"""Slice each mark scheme into per-question text. Writes ppq-build/<paperId>/ms.json = {"1": "...", ...}.
Usage: python3 -I tools/ppq/ms_slice.py [paperId ...]
"""
import json, os, re, sys
import fitz

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "ppq-build")
NOISE = re.compile(r"^(PMT|MARK SCHEME – .*|H[04]32/0\d|Mark Scheme|June 20\d\d|November 20\d\d|\d{1,2}|Question|Answers?|Marks?|Guidance|Additional.*|Marking guidance|Number|Acceptable Answer|Expected Answers|Mark|Version.*|\*\w+\*|© .*)$")

def clean(t):
    return re.sub(r"[\ud800-\udfff\uf000-\uf8ff]", "", t).strip()   # lost surrogates and private-use tick glyphs

def marker(board, block):
    x0, y0, x1, y1, text = block[0], block[1], block[2], block[3], block[4].strip()
    first = text.split("\n")[0].strip()
    if board == "aqa":
        if x0 > 95: return None
        if re.fullmatch(r"\d{1,2}", first) and y0 > 500: return None   # page number
        m = re.fullmatch(r"(\d{1,2})(?:\.\d{1,2})?", first)
        return int(m.group(1)) if m else None
    if board == "ocr":
        if x0 > 175: return None
        if re.fullmatch(r"\d\s+\d", text): return int(re.sub(r"\s+", "", text))
        m = re.fullmatch(r"(\d{1,2})\*?(\s*\([a-z]{1,3}\))?(\s*\([ivx]{1,4}\))?", first)
        if m and int(m.group(1)) <= 40 and (len(text.split("\n")) > 1 or x0 < 100): return int(m.group(1))
        return None
    if board == "edexcel":
        if x0 > 135: return None
        m = re.match(r"^\*?(\d{1,2})(?=\s*$|\s*\(|\*)", first)
        return int(m.group(1)) if m else None

HEADER = re.compile(r"^(Question|Qu)\s*\n(Answers?|Marking guidance)", re.I)

def slice_aqa(rec):
    doc = fitz.open(os.path.join(ROOT, rec["ms"]))
    rows, row, started = [], [], False
    for pno in range(len(doc)):
        for b in sorted([b for b in doc[pno].get_text("blocks") if b[6] == 0], key=lambda b: (round(b[1] / 6), b[0])):
            text = clean(b[4])
            if not text: continue
            if HEADER.match(text):
                if row and started: rows.append(row)
                row = []; started = True; continue
            if started:
                q = marker("aqa", b)
                if q is not None and "\n" in text and row:   # "10 \nD \n1 (AO2)": a self-contained row
                    rows.append(row); row = []
                row.append((q, text))
    if row: rows.append(row)
    out, cur, misses, expected = {}, None, [], 1
    for row in rows:
        qs = [q for q, _ in row if q is not None and (q == cur or expected <= q <= expected + 1)]
        if qs:
            q = qs[0]
            if q != cur:
                if q > expected: misses += list(range(expected, q))
                cur, expected = q, q + 1
        if cur is None: continue
        for _, text in row:
            lines = [ln.strip() for ln in text.split("\n") if ln.strip() and not NOISE.match(ln.strip())]
            if lines: out.setdefault(str(cur), []).append(" ".join(lines) if len(lines) == 1 else "\n".join(lines))
    return {k: "\n".join(v) for k, v in out.items()}, misses

def slice_ms(rec):
    if rec["board"] == "aqa": return slice_aqa(rec)
    doc = fitz.open(os.path.join(ROOT, rec["ms"]))
    stream = []  # (q_marker or None, text)
    for pno in range(len(doc)):
        for b in sorted([b for b in doc[pno].get_text("blocks") if b[6] == 0], key=lambda b: (round(b[1] / 6), b[0])):
            text = clean(b[4])
            if not text: continue
            stream.append((marker(rec["board"], b), text))
    out, expected, cur, buf, misses = {}, 1, None, [], []
    for q, text in stream:
        if q is not None and q >= expected and q <= expected + 1:
            if q == expected + 1: misses.append(expected)
            if cur is not None: out[str(cur)] = "\n".join(buf)
            cur, buf, expected = q, [], q + 1
        if cur is None: continue
        lines = [ln.strip() for ln in text.split("\n") if ln.strip() and not NOISE.match(ln.strip())]
        if lines: buf.append(" ".join(lines) if len(lines) == 1 else "\n".join(lines))
    if cur is not None: out[str(cur)] = "\n".join(buf)
    return out, misses

def main():
    manifest = json.load(open(os.path.join(OUT, "manifest.json")))
    ids = sys.argv[1:]
    for rec in manifest:
        if "ms" not in rec or (ids and rec["id"] not in ids): continue
        try:
            ms, misses = slice_ms(rec)
        except Exception as e:
            print(f"{rec['id']:24s} !! {type(e).__name__}: {e}", flush=True); continue
        qp = os.path.join(OUT, rec["id"], "questions.json")
        nq = len(json.load(open(qp))) if os.path.exists(qp) else None
        os.makedirs(os.path.join(OUT, rec["id"]), exist_ok=True)
        json.dump(ms, open(os.path.join(OUT, rec["id"], "ms.json"), "w"), indent=1, ensure_ascii=False)
        sizes = [len(v) for v in ms.values()]
        flag = "" if nq is None or nq == len(ms) else f"  <-- QP has {nq}"
        tiny = [k for k, v in ms.items() if len(v) < 15]
        print(f"{rec['id']:24s} {len(ms):3d} questions in MS{flag}  chars min/med {min(sizes) if sizes else 0}/{sorted(sizes)[len(sizes)//2] if sizes else 0}" + (f"  misses {misses}" if misses else "") + (f"  tiny {tiny}" if tiny else ""), flush=True)

if __name__ == "__main__":
    main()
