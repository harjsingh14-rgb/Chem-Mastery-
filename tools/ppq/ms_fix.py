"""Fill mark-scheme slices that ms_slice.py missed, without touching the ones it got.
Usage: python3 -I tools/ppq/ms_fix.py paperId [paperId ...]   (--dry to only report)

Two passes for each question in questions.json with no (or empty) ms.json entry:
  1. Multiple-choice key tables (AQA "Question | Key"): "N <newline> A-D" pairs in the page text.
  2. Text range: from the first block that starts question N to the first block that starts N+1.
"""
import json, os, re, sys
import fitz

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "ppq-build")
NOISE = re.compile(r"^(PMT|MARK SCHEME – .*|H[04]32/0\d|Mark Scheme|June 20\d\d|November 20\d\d|\d{1,2}|Question|Answers?|Marks?|Guidance|Additional.*|Marking guidance|Number|Acceptable Answer|Expected Answers|Mark|Version.*|\*\w+\*|© .*|\d{1,2} of \d{1,2})$")
KEY = re.compile(r"(?m)^\s*(\d{1,2})\s*\n\s*([A-D](?:\s*(?:&|and)\s*[A-D])?)\s*(?:\(AO[^)]*\))?\s*\n")

def clean(t): return re.sub(r"[\ud800-\udfff-]", "", t).strip()

def starts(board, n, first):
    f = first.strip()
    if board == "aqa":
        return bool(re.match(rf"^0?{n}\.\d{{1,2}}(?=\s|$)", f) or re.fullmatch(rf"{n}", f))
    if board == "ocr":
        return bool(re.match(rf"^{n}\*?\s*(\([a-z]{{1,3}}\)\*?|$)", f))
    if board == "edexcel":
        return bool(re.match(rf"^\*?{n}\s*(\([a-z]{{1,3}}\)|\(?[ivx]{{1,4}}\)|$|\s+The only correct answer)", f))
    return False

def blocks(doc):
    out = []
    for pno in range(len(doc)):
        for b in sorted([b for b in doc[pno].get_text("blocks") if b[6] == 0], key=lambda b: (round(b[1] / 6), b[0])):
            t = clean(b[4])
            if t: out.append((pno, b[0], b[1], t))
    return out

def tidy(text):
    lines = [ln.strip() for ln in text.split("\n") if ln.strip() and not NOISE.match(ln.strip())]
    return " ".join(lines) if len(lines) == 1 else "\n".join(lines)

def key_table(doc, wanted):
    found = {}
    for pno in range(len(doc)):
        t = doc[pno].get_text()
        hits = list(KEY.finditer(t))
        if len(hits) < 3 and not re.search(r"Key|Marking Guidance|Marking guidance", t): continue   # a key list, not a stray pair
        for m in hits:
            n = int(m.group(1))
            key = re.sub(r"\s+", " ", m.group(2))
            if n in wanted and n not in found: found[n] = f"Correct answer: {key}"
    return found

def text_range(board, blks, n, qmax):
    """Blocks from the start of question n (left half of the page, past any front matter) to the start of n+1."""
    width_limit = 320
    start = None
    for i, (pno, x0, y0, t) in enumerate(blks):
        first = t.split("\n")[0]
        if x0 < width_limit and starts(board, n, first):
            # a bare number must be followed by an answer letter or a part, not be a page number
            if re.fullmatch(rf"{n}", first) and not re.match(r"^[A-D]\b|^\(", t.split("\n")[1].strip() if "\n" in t else ""): continue
            start = i; break
    if start is None: return None
    end = len(blks)
    for j in range(start + 1, len(blks)):
        pno, x0, y0, t = blks[j]
        first = t.split("\n")[0]
        if x0 < width_limit and any(starts(board, k, first) for k in range(n + 1, min(n + 3, qmax + 1))):
            if re.fullmatch(r"\d{1,2}", first) and not re.match(r"^[A-D]\b|^\(", t.split("\n")[1].strip() if "\n" in t else ""): continue
            end = j; break
        if pno > blks[start][0] + 6: end = j; break
    parts = [tidy(t) for _, _, _, t in blks[start:end]]
    text = "\n".join(p for p in parts if p)
    return text if 3 <= len(text) <= 15000 else None

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; dry = "--dry" in sys.argv
    manifest = {r["id"]: r for r in json.load(open(os.path.join(OUT, "manifest.json")))}
    for pid in args:
        rec = manifest[pid]; pdir = os.path.join(OUT, pid)
        qs = [q["q"] for q in json.load(open(os.path.join(pdir, "questions.json"))) if q.get("image")]
        ms = json.load(open(os.path.join(pdir, "ms.json")))
        missing = [q for q in qs if not ms.get(str(q), "").strip()]
        if not missing: print(f"{pid:24s} nothing missing"); continue
        doc = fitz.open(os.path.join(ROOT, rec["ms"]))
        filled = {}
        if rec["board"] == "aqa":
            for n, text in key_table(doc, set(missing)).items(): filled[n] = text
        blks = blocks(doc)
        for n in missing:
            if n in filled: continue
            t = text_range(rec["board"], blks, n, max(qs))
            if t: filled[n] = t
        still = [q for q in missing if q not in filled]
        print(f"{pid:24s} missing {missing} -> filled {sorted(filled)}" + (f"  STILL MISSING {still}" if still else ""))
        for n in sorted(filled): print(f"    q{n}: {len(filled[n]):5d} chars | {filled[n][:120]!r}")
        if not dry:
            for n, t in filled.items(): ms[str(n)] = t
            json.dump(ms, open(os.path.join(pdir, "ms.json"), "w"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main()
