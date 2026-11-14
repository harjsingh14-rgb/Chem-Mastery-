"""Split the HSJ initial diagnostic papers (Exampro export) into per-question images and
mark-scheme text, in the same shape split.py produces for real past papers.

    python3 tools/ppq/diag_split.py            # every manifest record with "diagnostic": true
    python3 tools/ppq/diag_split.py hsj-diag-y12

Question boundaries are the "(Total N marks)" blocks; the mark scheme is split at its "[N]" totals.
Writes ppq-build/<id>/qNN.jpg, questions.json and ms.json."""
import json, os, re, sys
import fitz
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import split

TOTAL_RE = re.compile(r"^\(Total (\d+) marks?\)$")
LABEL_RE = re.compile(r"^\d{1,2}\.$")
FOOT_Y = 760   # footer text starts at y=765

def text_blocks(page):
    out = []
    for b in page.get_text("blocks"):
        if b[6] != 0: continue
        t = b[4].strip()
        if not t or b[1] > FOOT_Y: continue
        out.append(dict(x0=b[0], y0=b[1], x1=b[2], y1=b[3], text=t))
    return sorted(out, key=lambda b: (round(b["y0"]), b["x0"]))

def split_questions(doc, g):
    """Questions as [{q, total, segments:[{page,y0,y1}], text}] using the Total blocks as ends."""
    questions = []
    start = (1, g["top"])          # (page, y) where the next question begins; page 0 is the cover
    n = 0
    for pno in range(1, len(doc)):
        bl = text_blocks(doc[pno])
        for b in bl:
            m = TOTAL_RE.match(b["text"])
            if not m: continue
            n += 1
            end_y = min(b["y1"] + 2, g["bottom"])
            segs = []
            sp, sy = start
            for p in range(sp, pno + 1):
                y0 = sy if p == sp else g["top"]
                y1 = end_y if p == pno else g["bottom"]
                if y1 > y0: segs.append(dict(page=p, y0=round(y0, 1), y1=round(y1, 1)))
            text = []
            for sgm in segs:
                for tb in text_blocks(doc[sgm["page"]]):
                    if tb["y0"] >= sgm["y0"] - 1 and tb["y1"] <= sgm["y1"] + 1 and not re.fullmatch(r"[_\s]+", tb["text"]):
                        text.append(tb["text"])
            questions.append(dict(q=n, total=int(m.group(1)), segments=segs, text="\n".join(text), marks=[]))
            more = [x for x in bl if x["y0"] > b["y1"] and x["y1"] <= g["bottom"] and not re.fullmatch(r"[_\s]+", x["text"])]
            start = (pno, b["y1"] + 2) if more else (pno + 1, g["top"])
    return questions

def split_ms(doc):
    """Mark scheme text per question: the stream of non-footer blocks split after each [N] total."""
    stream = []
    for pno in range(1, len(doc)):
        page_text = doc[pno].get_text()
        if "Examiner report" in page_text[:40]: break
        for b in text_blocks(doc[pno]):
            if b["text"] in ("Mark schemes",): continue
            for line in b["text"].split("\n"):
                line = line.strip()
                if not line or LABEL_RE.match(line): continue
                stream.append(line)
    chunks, cur = [], []
    for line in stream:
        m = re.fullmatch(r"\[(\d+)\]", line)
        if m:
            chunks.append((int(m.group(1)), "\n".join(cur).strip())); cur = []
        else:
            cur.append(line)
    return chunks

def run(rec):
    doc = fitz.open(os.path.expanduser(rec["qp"]))
    sc = split.page_scale(doc[1])
    g = {k: v * sc for k, v in split.geom_for(rec).items()}   # geometry in real page points
    questions = split_questions(doc, g)
    for qd in questions:
        for sgm in qd["segments"]: sgm["y0"] = round(sgm["y0"] / sc, 1); sgm["y1"] = round(sgm["y1"] / sc, 1)
    cover = doc[0].get_text()
    titles = dict((int(a), t.strip()) for a, t in re.findall(r"Q(\d+)\s+—\s+(.+)", cover))
    for qd in questions: qd["coverTitle"] = titles.get(qd["q"])
    tot = sum(q["total"] for q in questions)
    print(f"{rec['id']}: {len(questions)} questions, {tot} marks  " + " ".join(f"{q['q']}:{q['total']}" for q in questions))
    if rec.get("expected") and tot != rec["expected"]: print(f"  !! expected {rec['expected']} marks")
    split.render(rec, questions, doc)
    kb = sum(q.get("bytes", 0) for q in questions) // 1024
    print(f"  rendered {kb} KB; empty: {[q['q'] for q in questions if not q.get('image')]}")
    if rec.get("ms"):
        chunks = split_ms(fitz.open(os.path.expanduser(rec["ms"])))
        ms = {}
        bad = []
        for i, (marks, text) in enumerate(chunks, start=1):
            ms[str(i)] = text
            if i <= len(questions) and marks != questions[i - 1]["total"]: bad.append((i, marks, questions[i - 1]["total"]))
        print(f"  mark scheme: {len(chunks)} questions; mismatches (q, ms marks, paper marks): {bad or 'none'}")
        json.dump(ms, open(os.path.join(split.OUT, rec["id"], "ms.json"), "w"), indent=1, ensure_ascii=False)
    else:
        print("  no mark scheme in the manifest record")

def main():
    manifest = json.load(open(os.path.join(split.OUT, "manifest.json")))
    ids = sys.argv[1:]
    for rec in manifest:
        if rec.get("diagnostic") and (not ids or rec["id"] in ids): run(rec)

if __name__ == "__main__":
    main()
