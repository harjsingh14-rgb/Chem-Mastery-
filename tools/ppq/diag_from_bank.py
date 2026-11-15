"""Publish an HSJ diagnostic paper assembled from questions already in the bank.

The Resit paper is built this way: real AQA A-level questions, chosen by hand,
in a fixed order, each already carrying its image, parts and mark scheme. The
questions stay in Practise for everyone else (a student who sat the paper has
them hidden by src/hooks/usePpq.js).

    PPQ_SECRET=$(cat ppq-build/secret.txt) python3 -I tools/ppq/diag_from_bank.py tools/ppq/papers/resit.json

The JSON file: { "unit": "hsj-diag-resit", "title": "Initial diagnostic (Resit)", "level": "a2", "board": "aqa", "ids": [ "aqa-a2-p1-JUN19-q01", ... ] }
"""
import json, os, sys, urllib.request

SECRET = os.environ.get("PPQ_SECRET", "").strip()
BASE = "https://fc.hsjtuition.co.uk"

def call(action, payload):
    body = json.dumps({"action": action, **payload}).encode()
    req = urllib.request.Request(f"{BASE}/api/ppq-admin", data=body, method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {SECRET}"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{action} -> {e.code} {e.read().decode()[:300]}")

def main():
    if not SECRET: raise SystemExit("PPQ_SECRET is not set")
    if len(sys.argv) < 2: raise SystemExit(__doc__)
    spec = json.load(open(sys.argv[1]))
    for k in ("unit", "title", "ids"):
        if not spec.get(k): raise SystemExit(f"{k} missing from {sys.argv[1]}")
    r = call("diagnosticIndex", {"unit": spec["unit"], "title": spec["title"], "level": spec.get("level", "a2"), "board": spec.get("board", "aqa"), "ids": spec["ids"]})
    print(f"{spec['unit']}: {r}")

if __name__ == "__main__":
    main()
