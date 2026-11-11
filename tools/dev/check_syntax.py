"""Syntax check (esprima, JSX + modules) and unused-import check for the given files.
No Node on the dev Mac, so this is the pre-push check: python3 tools/dev/check_syntax.py src/App.js api/ics.js ...
Requires: pip3 install esprima. Firestore rules are not checked here."""
import re, sys
import esprima

def imports_of(src):
    names = []
    for m in re.finditer(r'^import\s+(.+?)\s+from\s+["\'][^"\']+["\'];?\s*$', src, re.M):
        clause = m.group(1)
        if clause.startswith("{"):
            inner = clause.strip("{} ")
        else:
            parts = clause.split(",", 1)
            names.append(parts[0].strip().split(" as ")[-1].strip())
            inner = parts[1].strip().strip("{} ") if len(parts) > 1 else ""
        for item in inner.split(","):
            item = item.strip()
            if not item: continue
            names.append(item.split(" as ")[-1].strip())
    return [n for n in names if n and n != "React"]

bad = 0
for path in sys.argv[1:]:
    src = open(path).read()
    # esprima 4 predates optional chaining, ?? and optional catch bindings: rewrite them
    # to older forms with the same token structure before parsing.
    compat = re.sub(r'\?\.(?=[A-Za-z_$])', '.', src)
    compat = re.sub(r'\?\.(?=[\[(])', '', compat)
    compat = compat.replace('<>', '<React.Fragment>').replace('</>', '</React.Fragment>')
    compat = compat.replace('??', '||')
    compat = re.sub(r'catch\s*\{', 'catch (_e) {', compat)
    parse = esprima.parseScript if path.startswith("api/") else esprima.parseModule
    try:
        parse(compat, {"jsx": True, "tolerant": False})
    except Exception as e:
        print(f"{path}: SYNTAX {e}"); bad = 1; continue
    body = re.sub(r'^import\s.+$', '', src, flags=re.M)
    unused = [n for n in imports_of(src) if not re.search(r'\b' + re.escape(n) + r'\b', body)]
    if unused:
        print(f"{path}: unused import(s): {', '.join(unused)}"); bad = 1
    else:
        print(f"{path}: ok")
sys.exit(bad)
