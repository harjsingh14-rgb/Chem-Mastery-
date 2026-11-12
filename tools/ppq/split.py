"""Split each question paper into one image per question.

Usage: python3 -I tools/ppq/split.py [paperId ...]   (default: every paper in the manifest with a QP)
Writes ppq-build/<paperId>/qNN.jpg and ppq-build/<paperId>/questions.json.
"""
import json, os, re, sys
import fitz

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "ppq-build")
ZOOM = 2.2  # about 158 dpi

# Per-board page geometry: content box on a continuation page (points, A4 = 595 x 842)
GEOM = {
    "aqa":     dict(x0=34, x1=545, top=60, bottom=806),
    "ocr":     dict(x0=34, x1=562, top=58, bottom=768),
    "edexcel": dict(x0=34, x1=562, top=52, bottom=800),
    # old-spec (2010 to 2016) layouts: AQA had a boxed page with "(02)" page codes under the box
    "aqa-legacy":     dict(x0=34, x1=545, top=60, bottom=788),
    "ocr-legacy":     dict(x0=34, x1=562, top=58, bottom=768),
    "edexcel-legacy": dict(x0=34, x1=562, top=52, bottom=790),
}
def geom_for(rec): return GEOM[rec["board"] + ("-legacy" if rec.get("legacy") else "")]
END_RE = re.compile(r"END\s+OF\s+QUESTION|END\s+OF\s+PAPER|TOTAL FOR PAPER", re.I)
SKIP_PAGE_RE = re.compile(r"no questions printed on this page|BLANK PAGE|ADDITIONAL ANSWER SPACE|Additional page", re.I)
NOISE_RE = re.compile(r"^(PMT|Do not write|outside the|box|DO NOT WRITE IN THIS AREA.*|Turn over.*|\d{1,2}|\(\d\d\)|WMP/.*|© OCR 20\d\d|\*\w+\*|© .*|IB/M/.*|Question \d+ continues on the next page|[.\s_]+)$", re.I)
GAP = 36      # vertical white space (points) above which answer space is collapsed
SPACER = 26   # what it is collapsed to

def content_bands(page, g, y0, y1):
    """y-ranges inside [y0, y1] that hold real content: text that is not answer lines, images, drawings
    other than thin horizontal rules and page frames."""
    bands = []
    sc = page_scale(page)
    for b in page.get_text("dict")["blocks"]:
        bx0, by0, bx1, by1 = b["bbox"]
        if bx1 < g["x0"] or bx0 > g["x1"] or by1 < y0 or by0 > y1: continue
        if b["type"] == 1:
            if bx1 - bx0 < 80 * sc and by1 - by0 > 25 * sc: continue   # barcodes
            bands.append((by0, by1)); continue
        txt = " ".join(sp["text"] for ln in b["lines"] for sp in ln["spans"]).strip()
        if not txt or NOISE_RE.match(txt): continue
        for ln in b["lines"]:
            t = "".join(sp["text"] for sp in ln["spans"]).strip()
            if t and not re.fullmatch(r"[.\s_]+", t) and not NOISE_RE.match(t):
                bands.append((ln["bbox"][1], ln["bbox"][3]))
    for d in page.get_drawings():
        r = d["rect"]
        if r.x1 < g["x0"] or r.x0 > g["x1"] or r.y1 < y0 or r.y0 > y1: continue
        if r.height <= 4 * sc: continue                           # ruled answer lines, underlines
        if r.width > 470 * sc and r.height > 450 * sc: continue  # page frames (Edexcel)
        if r.width < 3 * sc and r.height > 300 * sc: continue    # margin bars
        bands.append((max(r.y0, y0), min(r.y1, y1)))
    bands.sort()
    merged = []
    for a, b in bands:
        a, b = max(a, y0), min(b, y1)
        if b <= a: continue
        if merged and a <= merged[-1][1] + 2: merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else: merged.append((a, b))
    return merged

def clips_for_segment(page, g, y0, y1):
    """Split a segment into clip ranges with big gaps collapsed. Returns list of (ya, yb) or ("gap",)."""
    bands = content_bands(page, g, y0, y1)
    if not bands: return []
    out = []; cur_a = max(y0, bands[0][0] - 8); cur_b = bands[0][1]
    for a, b in bands[1:]:
        if a - cur_b > GAP * page_scale(page):
            out.append((cur_a, min(cur_b + 8, y1))); out.append(("gap",)); cur_a = a - 6
        cur_b = b
    out.append((cur_a, min(cur_b + 8, y1)))
    return out

def page_scale(page):
    return page.rect.width / 595.0   # some PMT re-exports are larger than A4 points

def blocks(page):
    out = []
    s = page_scale(page)
    for b in page.get_text("blocks"):
        if b[6] != 0: continue  # images
        txt = b[4].strip()
        if not txt: continue
        out.append(dict(x0=b[0] / s, y0=b[1] / s, x1=b[2] / s, y1=b[3] / s, text=txt))
    return sorted(out, key=lambda b: (round(b["y0"]), b["x0"]))

def qnum_at(block, board, legacy=False):
    """Return the top-level question number if this block starts one, else None."""
    t = block["text"]
    first = t.split("\n")[0].strip()
    if board == "aqa" and legacy:
        # 2010 to 2016 CHEM1/2/4/5: "1  (a)" or "3  This question is about" in the left margin
        if block["x0"] > 60: return None
        m = re.match(r"^(\d{1,2})\s+\(a\)", first) or re.match(r"^(\d{1,2})\s{2,}[A-Z(]", first) or re.match(r"^(\d{1,2})\n[A-Z(]", t)
        return int(m.group(1)) if m else None
    if board == "aqa":
        if block["x0"] > 76: return None
        norm = re.sub(r"\s+", " ", t)
        # modern: "0 1" box alone (part box ". 2" is a separate block); older: "0 1 . 3 text" in one block
        m = re.match(r"^([0-3]) ?(\d)(?: ?\. ?\d)?(?: |$)", norm)
        if m: return int(m.group(1) + m.group(2))
        m = re.match(r"^(\d{1,2})\s{3,}\S", t)   # 2016 AS: "2        This question is about"
        if m: return int(m.group(1))
        return None
    if board == "ocr":
        if not (42 <= block["x0"] <= 60): return None
        m = re.match(r"(\d{1,2})\*?(?:\s|$)", first)
        if m and not re.match(r"\d+\s*\(", first): return int(m.group(1))
        return None
    if board == "edexcel":
        if not (34 <= block["x0"] <= 70): return None
        first = first.lstrip("* ")
        m = re.match(r"(\d{1,2})\s+(?=[A-Za-z(“\"'])", first)
        if m: return int(m.group(1))
        m = re.match(r"(\d{1,2})\s+(?=\d+[-,]\d*[A-Za-z])", first)   # "8 2-Hydroxyethanoic acid"
        if m and block["y0"] < 75: return int(m.group(1))
        if re.fullmatch(r"\d{1,2}", first) and len(t.split("\n")) > 1: return int(first)  # "5" then "*" then text
        return None

def marks_in(text, board):
    if board == "aqa": return [int(x) for x in re.findall(r"[\[(](\d+) marks?[\])]?", text)]
    if board == "ocr": return [int(x) for x in re.findall(r"\[(\d+)\]", text)]
    tot = re.search(r"Total for Question \d+\s*=\s*(\d+)\s*marks?", text, re.I)
    if tot: return [int(tot.group(1))]
    return [int(x) for x in re.findall(r"^\s*\((\d{1,2})\)\s*$", text, re.M)]

def split_paper(rec, verbose=True):
    board = rec["board"]; g = geom_for(rec); legacy = bool(rec.get("legacy"))
    doc = fitz.open(os.path.join(ROOT, rec["qp"]))
    starts = []  # (qnum, page, y)
    end = None   # (page, y)
    expected = 1
    for pno in range(len(doc)):
        page = doc[pno]
        ptext = page.get_text()
        if pno == 0: continue  # cover
        if SKIP_PAGE_RE.search(ptext) and len(ptext) < 600: continue
        for b in blocks(page):
            if end: break
            if END_RE.search(b["text"]) and b["x0"] < 400:
                end = (pno, b["y0"]); break
            q = qnum_at(b, board, legacy)
            if q == expected:
                starts.append((q, pno, b["y0"])); expected += 1
        if end: break
    if not starts:
        chars = sum(len(doc[i].get_text()) for i in range(min(6, len(doc))))
        print(f"  !! no questions found {rec['id']}" + ("  (no text layer: scanned PDF)" if chars < 400 else "")); return []
    if end is None: end = (len(doc) - 1, g["bottom"])
    questions = []
    for i, (q, p0, y0) in enumerate(starts):
        if i + 1 < len(starts):
            q2, p1, y1 = starts[i + 1]
        else:
            p1, y1 = end
        segs = []
        for p in range(p0, p1 + 1):
            ptext = doc[p].get_text()
            if p != p0 and SKIP_PAGE_RE.search(ptext) and len(ptext) < 600: continue
            top = (y0 - 10) if p == p0 else g["top"]
            bot = (y1 - 6) if p == p1 else g["bottom"]
            if bot - top < 30: continue
            segs.append(dict(page=p, y0=round(top, 1), y1=round(bot, 1)))
        text_parts, marks = [], []
        for s in segs:
            sc = page_scale(doc[s["page"]])
            clip = fitz.Rect(g["x0"] * sc, s["y0"] * sc, g["x1"] * sc, s["y1"] * sc)
            t = doc[s["page"]].get_text("text", clip=clip)
            lines = [ln for ln in t.split("\n") if ln.strip() and not NOISE_RE.match(ln.strip())]
            text_parts.append("\n".join(lines))
        text = "\n".join(text_parts); marks = marks_in(text, board)
        questions.append(dict(q=q, segments=segs, marks=marks, total=sum(marks), text=text))
    return questions, doc

def render(rec, questions, doc):
    g = geom_for(rec)
    outdir = os.path.join(OUT, rec["id"]); os.makedirs(outdir, exist_ok=True)
    for qd in questions:
        from PIL import Image
        pieces = []  # PIL images or int spacer heights
        for s in qd["segments"]:
            page = doc[s["page"]]
            sc = page_scale(page); z = ZOOM / sc
            gs = {k: v * sc for k, v in g.items()}
            for c in clips_for_segment(page, gs, s["y0"] * sc, s["y1"] * sc):
                if c[0] == "gap": pieces.append(int(SPACER * ZOOM)); continue
                clip = fitz.Rect(gs["x0"], c[0], gs["x1"], c[1])
                p = page.get_pixmap(matrix=fitz.Matrix(z, z), clip=clip, alpha=False)
                pieces.append(Image.frombytes("RGB", (p.width, p.height), p.samples))
        # drop spacers at the ends and doubled spacers
        while pieces and isinstance(pieces[-1], int): pieces.pop()
        while pieces and isinstance(pieces[0], int): pieces.pop(0)
        if not pieces:
            print(f"  !! empty question {rec['id']} q{qd['q']}"); qd["image"] = None; continue
        w = max(p.width for p in pieces if not isinstance(p, int)); h = sum(p if isinstance(p, int) else p.height for p in pieces)
        canvas = Image.new("RGB", (w, h), "white"); y = 0
        for p in pieces:
            if isinstance(p, int): y += p; continue
            canvas.paste(p, (0, y)); y += p.height
        name = f"q{qd['q']:02d}.jpg"
        canvas.save(os.path.join(outdir, name), "JPEG", quality=85, optimize=True)
        qd["image"] = name; qd["width"] = w; qd["height"] = h
        qd["bytes"] = os.path.getsize(os.path.join(outdir, name))
    json.dump(questions, open(os.path.join(outdir, "questions.json"), "w"), indent=1)

EXPECTED = {("aqa","a2",1):105, ("aqa","a2",2):105, ("aqa","a2",3):90, ("aqa","as",1):80, ("aqa","as",2):80,
            ("ocr","a2",1):100, ("ocr","a2",2):100, ("ocr","a2",3):70, ("ocr","as",1):70, ("ocr","as",2):70,
            ("edexcel","a2",1):90, ("edexcel","a2",2):90, ("edexcel","a2",3):120, ("edexcel","as",1):80, ("edexcel","as",2):80}
LEGACY_EXPECTED = {"CHEM1": 70, "CHEM2": 100, "CHEM4": 100, "CHEM5": 100, "F321": 60, "F322": 100, "F324": 60, "F325": 100,
                   "6CH01": 80, "6CH02": 80, "6CH04": 90, "6CH05": 90}

def main():
    manifest = json.load(open(os.path.join(OUT, "manifest.json")))
    ids = sys.argv[1:]
    recs = [r for r in manifest if "qp" in r and (not ids or r["id"] in ids)]
    for rec in recs:
        try:
            run_one(rec)
        except Exception as e:
            print(f"{rec['id']:24s} !! {type(e).__name__}: {e}", flush=True)

def run_one(rec):
        res = split_paper(rec)
        if not res: return
        questions, doc = res
        render(rec, questions, doc)
        tot = sum(q["total"] for q in questions); kb = sum(q.get("bytes", 0) for q in questions) // 1024
        exp = LEGACY_EXPECTED.get(rec.get("unit")) if rec.get("legacy") else EXPECTED.get((rec["board"], rec["level"], rec["paper"]))
        flag = "" if exp == tot else f"  <-- expected {exp}"
        print(f"{rec['id']:24s} {len(questions):3d} questions, {tot:3d} marks, {kb:5d} KB{flag}  " + " ".join(f"{q['q']}:{q['total']}" for q in questions), flush=True)

if __name__ == "__main__":
    main()
