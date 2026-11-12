"""Build ppq-build/manifest.json: every question paper matched to its mark scheme.

Boards: aqa (7405 A-level, 7404 AS), ocr (H432 A-level, H032 AS), edexcel (9CH0 A-level, 8CH0 AS).
Series codes: JUN24, NOV20, SPEC. Run with:  python3 -I tools/ppq/inventory.py
"""
import json, os, re, sys
import fitz

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "ppq-build")

SOURCES = [
    # (folder, board, level, kind, paper-or-None)
    ("resources/aqa/as/question-papers", "aqa", "as", "qp", None),
    ("resources/aqa/as/mark-schemes", "aqa", "as", "ms", None),
    ("resources/aqa/mark-schemes", "aqa", "a2", "ms", None),
    ("paper-analysis/papers", "aqa", "a2", "qp", None),
    ("paper-analysis/papers/AQA-7405-2", "aqa", "a2", "qp", 2),
    ("paper-analysis/papers/AQA-7405-3", "aqa", "a2", "qp", 3),
    ("resources/ocr/as/question-papers", "ocr", "as", "qp", None),
    ("resources/ocr/as/mark-schemes", "ocr", "as", "ms", None),
    ("Paper-analysis-OCR A- Physical /Papers", "ocr", "a2", "qp", 1),
    ("paper-analysis/OCR Paper 2 Papers and ERs", "ocr", "a2", "qp", 2),
    ("paper-analysis/OCR Paper 3 Papers and ERs/question-papers", "ocr", "a2", "qp", 3),
    ("paper-analysis/OCR Paper 3 Papers and ERs/mark-schemes", "ocr", "a2", "ms", 3),
    ("OCR Ms", "ocr", "a2", "ms", None),
    ("resources/edexcel/question-papers", "edexcel", "a2", "qp", None),
    ("resources/edexcel/mark-schemes", "edexcel", "a2", "ms", None),
    ("resources/edexcel/as/question-papers", "edexcel", "as", "qp", None),
    ("resources/edexcel/as/mark-schemes", "edexcel", "as", "ms", None),
]

MONTHS = {"january": "JAN", "june": "JUN", "may": "JUN", "october": "NOV", "november": "NOV"}

# Old-specification papers (2010 to 2016), downloaded from scienceskool.co.uk into resources/legacy/<board>/.
# Units 1 and 2 were AS, units 4 and 5 were A2. Ids use "u" (unit) so they never collide with current-spec paper ids.
LEGACY = [("resources/legacy/aqa", "aqa"), ("resources/legacy/ocr", "ocr"), ("resources/legacy/edexcel", "edexcel")]
UNIT_CODE = {"aqa": "CHEM{n}", "ocr": "F32{n}", "edexcel": "6CH0{n}"}

def legacy_from_name(name, board):
    """(unit, series, kind) for an old-spec file name, or None."""
    n = name.lower()
    if board == "aqa":
        m = re.match(r"aqa-chem(\d)-(?:w-)?(qp|ms)-(jan|jun)(\d\d)\.pdf$", n)
        if m: return int(m.group(1)), m.group(3).upper() + m.group(4), m.group(2)
    if board == "ocr":
        m = re.match(r"f32(\d)_(jan|june)_20(\d\d)_(qp|ms)\.pdf$", n)
        if m: return int(m.group(1)), m.group(2)[:3].upper() + m.group(3), m.group(4)
    if board == "edexcel":
        m = re.match(r"unit_(\d)_(jan|june)_20(\d\d)_(qp|ms)\.pdf$", n)
        if m: return int(m.group(1)), m.group(2)[:3].upper() + m.group(3), m.group(4)
        m = re.match(r"6ch0(\d)_01(r?)_(que|msc)_20(\d\d)\d{4}\.pdf$", n)
        if m: return int(m.group(1)), "JUN" + m.group(4) + m.group(2).upper(), ("qp" if m.group(3) == "que" else "ms")
        m = re.match(r"(question-paper|mark-scheme)-unit-(\d)-_6ch0\d_-(paper-1r-)?june-20(\d\d)\.pdf$", n)
        if m: return int(m.group(2)), "JUN" + m.group(4) + ("R" if m.group(3) else ""), ("qp" if m.group(1) == "question-paper" else "ms")
    return None

def series_from_name(name):
    n = name.upper()
    m = re.search(r"(JUN|NOV|JAN)(\d\d)", n)
    if m: return m.group(1) + m.group(2)
    if "SPEC" in n or "SQP" in n: return "SPEC"
    m = re.search(r"(JUNE|NOV)\w*\s+20(\d\d)", n)
    if m: return ("JUN" if m.group(1) == "JUNE" else "NOV") + m.group(2)
    m = re.search(r"(\d\d)JUN(\d\d)", n)
    if m: return "JUN" + m.group(2)
    return None

def series_from_pdf(path):
    doc = fitz.open(path)
    text = " ".join(doc[i].get_text() for i in range(min(3, len(doc))))
    m = re.search(r"\*(JUN|NOV|JAN)(\d\d)74\d{5}\*", text, re.I)   # AQA barcode, authoritative
    if m: return m.group(1).upper() + m.group(2)
    if re.search(r"specimen", text, re.I): return "SPEC"
    m = re.search(r"(January|June|May|October|November)\s+(20\d\d)", text)
    if m: return MONTHS[m.group(1).lower()] + m.group(2)[2:]
    return None

def paper_from_name(name, board):
    n = name.upper()
    for pat in [r"740[45]-(\d)-", r"740[45](\d)-", r"[89]CH0-(\d)", r"H[04]32-(\d)", r"H[04]32(\d)-", r"H[04]32[_-]0(\d)", r"\(H432_0(\d)\)"]:
        m = re.search(pat, n)
        if m: return int(m.group(1))
    low = name.lower()
    if "periodic-table" in low: return 1
    if "synthesis-and-analytical" in low: return 2
    if "unified" in low: return 3
    return None

def kind_from_name(name):
    n = name.upper()
    if "-MS" in n or "MARK SCHEME" in n or "MARK-SCHEME" in n: return "ms"
    if "-QP" in n or "QUESTION PAPER" in n or "QUESTION-PAPER" in n or "SQP" in n: return "qp"
    return None

def main():
    files = []
    for folder, board, level, kind, paper in SOURCES:
        full = os.path.join(ROOT, folder)
        if not os.path.isdir(full): print("missing", folder, file=sys.stderr); continue
        for name in sorted(os.listdir(full)):
            if not name.lower().endswith(".pdf"): continue
            if "examiner" in name.lower() or "report" in name.lower(): continue
            k = kind_from_name(name) or kind
            if k != kind: continue
            p = paper or paper_from_name(name, board)
            s = (series_from_pdf(os.path.join(full, name)) if board == "aqa" else None) or series_from_name(name) or series_from_pdf(os.path.join(full, name))
            if not p or not s:
                print(f"skip (paper={p}, series={s}): {folder}/{name}", file=sys.stderr); continue
            files.append(dict(board=board, level=level, paper=p, series=s, kind=k, path=os.path.join(folder, name)))
    for folder, board in LEGACY:
        full = os.path.join(ROOT, folder)
        if not os.path.isdir(full): continue
        for name in sorted(os.listdir(full)):
            info = legacy_from_name(name, board)
            if not info: print(f"skip (legacy name not understood): {folder}/{name}", file=sys.stderr); continue
            unit, series, kind = info
            files.append(dict(board=board, level="as" if unit <= 2 else "a2", paper=unit, series=series, kind=kind,
                              path=os.path.join(folder, name), legacy=True, unit=UNIT_CODE[board].format(n=unit)))
    papers = {}
    for f in files:
        key = f"{f['board']}-{f['level']}-{'u' if f.get('legacy') else 'p'}{f['paper']}-{f['series']}"
        rec = papers.setdefault(key, dict(id=key, board=f["board"], level=f["level"], paper=f["paper"], series=f["series"],
                                          **({"legacy": True, "unit": f["unit"]} if f.get("legacy") else {})))
        if f["kind"] in rec and rec[f["kind"]] != f["path"]:
            # prefer resources/ copies (cleaner names) over scattered analysis folders
            if f["path"].startswith("resources/"): rec[f["kind"]] = f["path"]
            continue
        rec[f["kind"]] = f["path"]
    out = sorted(papers.values(), key=lambda r: (r["board"], r["level"], r["paper"], r["series"][-2:], r["series"]))
    os.makedirs(OUT, exist_ok=True)
    json.dump(out, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
    both = [r for r in out if "qp" in r and "ms" in r]
    print(f"{len(out)} papers, {len(both)} with both QP and MS")
    for r in out:
        if "qp" not in r or "ms" not in r:
            print("  incomplete:", r["id"], "has", [k for k in ("qp", "ms") if k in r])
    from collections import Counter
    print(Counter((r["board"], r["level"]) for r in both))

if __name__ == "__main__":
    main()
