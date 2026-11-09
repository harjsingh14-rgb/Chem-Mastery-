"""Export the spec topic taxonomy from src/data/self-evaluation.js to ppq-build/topics.json."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = open(os.path.join(ROOT, "src/data/self-evaluation.js")).read()
out = {}
for bm in re.finditer(r"^  (ocr|aqa|edexcel): \{(.*?)^  \},", src, re.S | re.M):
    board, body = bm.group(1), bm.group(2)
    topics = []
    for mm in re.finditer(r'mod\("([^"]+)", "([^"]+)", (\d+), \[(.*?)\]\)', body, re.S):
        mid, mtitle, year, subs = mm.groups()
        for ref, title in re.findall(r'\["([^"]+)", "([^"]+)"\]', subs):
            topics.append(dict(ref=ref, title=title, year=int(year), module=mid, moduleTitle=mtitle))
    out[board] = topics
json.dump(out, open(os.path.join(ROOT, "ppq-build/topics.json"), "w"), indent=1)
print({b: len(t) for b, t in out.items()})
