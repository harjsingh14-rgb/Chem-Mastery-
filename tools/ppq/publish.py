"""Publish split questions to the live app: upload images, enrich with the AI examiner, write Firestore.

  PPQ_SECRET=... python3 -I tools/ppq/publish.py aqa-a2-p1-JUN24            # one paper
  PPQ_SECRET=... python3 -I tools/ppq/publish.py --all                      # everything with questions.json and ms.json
  options: --only q03   --no-upsert   --reindex   --workers 4   --base https://fc.hsjtuition.co.uk

State per paper in ppq-build/<paperId>/state.json; enriched JSON kept in ppq-build/<paperId>/enriched/qNN.json for review.
"""
import base64, json, os, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "ppq-build")
SECRET = os.environ.get("PPQ_SECRET", "").strip()
BASE = "https://fc.hsjtuition.co.uk"
TOPICS = json.load(open(os.path.join(OUT, "topics.json")))

def call(action, payload, retries=3):
    body = json.dumps({"action": action, **payload}).encode()
    req = urllib.request.Request(f"{BASE}/api/ppq-admin", data=body, method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {SECRET}"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (502, 504, 500, 429) and attempt < retries - 1:
                time.sleep(5 * (attempt + 1)); continue
            raise RuntimeError(f"{action} -> {e.code} {msg}")
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < retries - 1: time.sleep(5); continue
            raise

def year_of(series):
    return 2000 + int(series[-2:]) if series[-2:].isdigit() else None

def load_state(pdir):
    p = os.path.join(pdir, "state.json")
    return json.load(open(p)) if os.path.exists(p) else {}

def save_state(pdir, st):
    json.dump(st, open(os.path.join(pdir, "state.json"), "w"), indent=1)

def validate(enr, qd, board):
    problems = []
    parts = enr.get("parts") or []
    if not parts: problems.append("no parts")
    s = sum(int(p.get("marks") or 0) for p in parts)
    if s != qd["total"] and qd["total"]: problems.append(f"part marks {s} != total {qd['total']}")
    refs = {t["ref"] for t in TOPICS[board]}
    bad = [t for t in enr.get("topics") or [] if t not in refs]
    if bad: problems.append(f"unknown topics {bad}")
    if not enr.get("topics") and not enr.get("offSpec"): problems.append("no topics")
    for p in parts:
        if len(p.get("hints") or []) < 2: problems.append(f"part {p.get('label')} has {len(p.get('hints') or [])} hints")
        if not p.get("ms"): problems.append(f"part {p.get('label')} has no ms")
    return problems

def process_question(rec, qd, ms_text, pdir, st, opts):
    key = qd["image"][:-4] if qd.get("image") else f"q{qd['q']:02d}"
    s = st.setdefault(key, {})
    qid = f"{rec['id']}-{key}"
    # 1. enrich (cached locally so a failed upload never repeats the AI call)
    epath = os.path.join(pdir, "enriched", f"{key}.json")
    if os.path.exists(epath):
        enr = json.load(open(epath))
    elif opts.get("no_enrich"):
        return qid, ["not indexed yet"], None
    else:
        question = {k: rec[k] for k in ("board", "level", "paper", "series")}
        if rec.get("legacy"): question.update(legacy=True, unit=rec.get("unit"))
        question.update(q=qd["q"], total=qd["total"], text=qd["text"][:9000])
        enr = call("enrich", {"question": question, "msText": ms_text[:12000], "topics": [{"ref": t["ref"], "title": t["title"]} for t in TOPICS[rec["board"]]]})
        os.makedirs(os.path.dirname(epath), exist_ok=True)
        json.dump(enr, open(epath, "w"), indent=1, ensure_ascii=False)
    problems = validate(enr, qd, rec["board"])
    s["problems"] = problems
    # 2. image
    if not s.get("imageUrl") and not opts.get("no_upload"):
        data = base64.b64encode(open(os.path.join(pdir, qd["image"]), "rb").read()).decode()
        r = call("upload", {"path": f"ppq/{rec['id']}/{qd['image']}", "contentType": "image/jpeg", "dataBase64": data})
        s["imageUrl"] = r["url"]
    # 3. upsert
    if not opts["no_upsert"]:
        doc = dict(id=qid, board=rec["board"], level=rec["level"], paper=rec["paper"], series=rec["series"], year=year_of(rec["series"]),
                   q=qd["q"], totalMarks=qd["total"] or int(enr.get("totalMarks") or 0), title=enr.get("title") or f"Question {qd['q']}",
                   topics=enr.get("topics") or [], keywords=enr.get("keywords") or [], kind=enr.get("kind") or "structured",
                   parts=enr.get("parts") or [], imageUrl=s.get("imageUrl"), imageW=qd.get("width"), imageH=qd.get("height"),
                   qText=qd["text"][:6000], msText=ms_text[:8000], source={"qp": rec.get("qp"), "ms": rec.get("ms")},
                   legacy=bool(rec.get("legacy")), unit=rec.get("unit") or None,
                   status="offspec" if enr.get("offSpec") else ("live" if not problems else "review"), problems=problems)
        call("upsert", {"id": qid, "doc": doc})
        s["upserted"] = True
    return qid, problems, enr.get("usage")

def main():
    args = sys.argv[1:]
    opts = {"no_upsert": "--no-upsert" in args, "no_upload": "--no-upload" in args, "reindex": "--reindex" in args, "all": "--all" in args, "no_enrich": "--no-enrich" in args, "only": None, "workers": 4}
    if "--only" in args: opts["only"] = args[args.index("--only") + 1]
    if "--workers" in args: opts["workers"] = int(args[args.index("--workers") + 1])
    if "--base" in args:
        global BASE; BASE = args[args.index("--base") + 1]
    ids = [a for a in args if not a.startswith("--") and a != opts["only"] and not a.isdigit() and not a.startswith("http")]
    if not SECRET: sys.exit("PPQ_SECRET not set")
    manifest = json.load(open(os.path.join(OUT, "manifest.json")))
    recs = [r for r in manifest if (opts["all"] or r["id"] in ids)]
    touched = set(); total_usage = {"input_tokens": 0, "output_tokens": 0}
    for rec in recs:
        pdir = os.path.join(OUT, rec["id"])
        qpath, mpath = os.path.join(pdir, "questions.json"), os.path.join(pdir, "ms.json")
        if not (os.path.exists(qpath) and os.path.exists(mpath)):
            print(f"{rec['id']:24s} skipped (missing questions.json or ms.json)"); continue
        questions = [q for q in json.load(open(qpath)) if q.get("image")]
        ms = json.load(open(mpath))
        if opts["only"]: questions = [q for q in questions if q["image"].startswith(opts["only"])]
        st = load_state(pdir)
        t0 = time.time(); results = []
        def work(qd):
            mtext = ms.get(str(qd["q"]), "")
            if not mtext.strip(): return (f"{rec['id']}-q{qd['q']:02d}", ["no mark scheme text"], None)
            try: return process_question(rec, qd, mtext, pdir, st, opts)
            except Exception as e: return (f"{rec['id']}-q{qd['q']:02d}", [f"ERROR {e}"], None)
        with ThreadPoolExecutor(opts["workers"]) as ex:
            for res in ex.map(work, questions): results.append(res)
        save_state(pdir, st)
        touched.add((rec["board"], rec["level"]))
        flagged = [(qid, p) for qid, p, _ in results if p]
        for _, _, u in results:
            if u: total_usage["input_tokens"] += u.get("input_tokens", 0); total_usage["output_tokens"] += u.get("output_tokens", 0)
        print(f"{rec['id']:24s} {len(results):3d} questions in {time.time()-t0:5.0f}s, {len(flagged)} flagged", flush=True)
        for qid, p in flagged: print(f"    {qid}: {'; '.join(p)}", flush=True)
    if opts["reindex"] or opts["all"]:
        for board, level in sorted(touched):
            r = call("reindex", {"board": board, "level": level}); print(f"reindex {board} {level}: {r}")
    print("usage", total_usage)

if __name__ == "__main__":
    main()
