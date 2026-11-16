// Admin pipeline endpoint for past-paper questions (PPQ). Driven by tools/ppq/publish.py.
// Auth: Bearer CRON_SECRET (pipeline) or an admin's Firebase ID token.
// Actions (POST JSON { action, ...payload }):
//   upload   { path, contentType, dataBase64 }     -> { url, path }   store an image in Firebase Storage
//   enrich   { question, msText, topics }          -> structured question JSON from the AI examiner
//   upsert   { id, doc }                           -> merge a ppq/{id} document
//   get      { id }                                -> the ppq/{id} document
//   reindex  { board, level }                      -> rebuild ppqIndex/{board}_{level}
//   cors     {}                                    -> allow the web app to read images into a canvas
const crypto = require("crypto");
const fb = require("./_firebaseAdmin");
const { setCors } = require("./_cors");
const { verifyFirebaseToken } = require("./_auth");

const BUCKET = "chemmastery-3adb0.firebasestorage.app";
const MODEL = "claude-opus-5-5";   // one-off indexing: quality of the mark scheme breakdown and hints matters most

async function authorise(req, token) {
  const bearer = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const secret = (process.env.CRON_SECRET || "").trim();
  if (secret && bearer === secret) return "pipeline";
  const caller = await verifyFirebaseToken(req).catch(() => null);
  if (caller) {
    const profile = await fb.getDocument(`users/${caller.uid}`, token);
    if (profile && profile.role === "admin") return "admin";
  }
  throw fb.httpError(401, "Unauthorised");
}

// ---- Storage ---------------------------------------------------------------
async function upload({ path, contentType, dataBase64 }, token) {
  if (!path || !dataBase64) throw fb.httpError(400, "path and dataBase64 required");
  if (!/^[\w./-]+$/.test(path)) throw fb.httpError(400, "bad path");
  const downloadToken = crypto.randomUUID();
  const meta = JSON.stringify({ name: path, contentType: contentType || "image/jpeg", cacheControl: "public, max-age=31536000, immutable",
    metadata: { firebaseStorageDownloadTokens: downloadToken } });
  const boundary = "ppq_" + crypto.randomBytes(8).toString("hex");
  const bin = Buffer.from(dataBase64, "base64");
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: ${contentType || "image/jpeg"}\r\n\r\n`),
    bin,
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const res = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=multipart`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}`, "Content-Length": String(body.length) }, body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw fb.httpError(502, `Storage upload failed (${res.status}): ${JSON.stringify(data).slice(0, 300)}`);
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;
  return { url, path, bytes: bin.length };
}

// ---- AI enrichment ----------------------------------------------------------
const BOARD_NAME = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };
const LEVEL_NAME = { as: "AS", a2: "A-level" };

function enrichPrompt({ question, msText, topics }) {
  const topicList = (topics || []).map(t => `${t.ref}: ${t.title}`).join("\n");
  return `You are a senior ${BOARD_NAME[question.board] || question.board} ${LEVEL_NAME[question.level] || ""} Chemistry examiner preparing a past-paper question for a revision app. Students will see the original question as an image; you are producing the structured data behind it.

PAPER: ${question.diagnostic ? `HSJ Tuition ${question.title || "initial diagnostic"}, an initial diagnostic paper assembled from ${BOARD_NAME[question.board]} ${LEVEL_NAME[question.level]} exam questions and sat by new HSJ students of every exam board${question.coverTitle ? ` (listed on the cover as "${question.coverTitle}")` : ""}` : question.legacy ? `${BOARD_NAME[question.board]} legacy unit ${question.unit} (the specification examined 2010 to 2016)` : `${BOARD_NAME[question.board]} ${LEVEL_NAME[question.level]} Paper ${question.paper}`}, ${question.series}, question ${question.q}. Total marks on the paper: ${question.total}.

QUESTION TEXT (extracted from the PDF; layout, tables and diagrams may be lost or garbled; answer lines removed):
<<<
${question.text}
>>>

OFFICIAL MARK SCHEME for this question (extracted from the PDF; columns may be interleaved):
<<<
${msText}
>>>

SPECIFICATION TOPICS for this board (ref: title). Choose from these refs only:
${topicList}

Return ONLY a JSON object, no markdown, with exactly this shape:
{
  "title": "short descriptive title, at most 8 words, no question number, exam language",
  "topics": ["ref", ...],            // 1 to 3 spec refs from the list, most relevant first
  "keywords": ["...", ...],          // up to 6 short topic keywords, e.g. "Born-Haber cycle", "Kp"
  "kind": "mcq" | "structured" | "extended" | "calculation" | "practical",
  "parts": [
    {
      "label": "the part label exactly as printed, e.g. \\"01.2\\", \\"(a)(ii)\\", \\"(b)\\"; \\"\\" if the question has a single unlabelled part",
      "marks": 2,
      "ask": "one sentence saying what this part asks for, in the question's own words where possible",
      "type": "mcq" | "short" | "calc" | "extended" | "draw",
      "answer": "mcq: the correct letter. calc: final answer with unit. otherwise null",
      "ms": ["one marking point per mark, in mark scheme wording; include key ALLOW / IGNORE / ECF notes briefly in brackets"],
      "hints": ["hint 1: orient the student (what topic or idea the examiner wants)", "hint 2: the method or the first step", "hint 3: nearly the answer, but never the answer itself"],
      "modelAnswer": "a concise answer that would earn full marks, as a strong student would write it; for calc show the working lines"
    }
  ],
  "totalMarks": ${question.total},
  "offSpec": false                   // true only if the question mainly tests content that is not in the specification topics listed above
}

Rules:
- Every part printed on the paper must appear once, in order, including 1-mark multiple-choice parts (type "mcq", ms = ["B"], hints that reason towards it).
- The sum of part marks must equal totalMarks. If the extracted text disagrees with the mark scheme, trust the mark scheme.
- Keep marking points faithful to the official mark scheme; do not invent credit the scheme does not give. For levels-of-response (6 mark) parts give the indicative content as the ms points and type "extended".
- "draw" is for structures, mechanisms, dot-and-cross diagrams, graphs or apparatus; the ms points describe what must be shown.
- Hints must not contain the final answer, the correct letter, or a quoted marking point. Use UK spelling and exam-style language. No em dashes.${question.legacy ? `
- This question is from the old specification. If the chemistry it mainly tests is no longer in the current specification topics listed above (for example extraction of metals, old-style polymer or haloalkane content, or ozone and CFC chemistry where the current board has dropped it), set "offSpec": true and leave "topics" empty. If only a small part is off the current specification, keep "offSpec": false and tag the topics that remain.` : ""}`;
}

async function enrich(payload) {
  const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey) throw fb.httpError(500, "ANTHROPIC_API_KEY not configured");
  if (!payload.question || !payload.msText) throw fb.httpError(400, "question and msText required");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-beta": "server-side-fallback-2026-07-01" },
    body: JSON.stringify({
      model: MODEL, max_tokens: 8000,
      output_config: { effort: "medium" },       // Opus default; keeps a long question inside the function time limit
      fallbacks: "default",                        // if a safety classifier declines, the API retries on a fallback model
      messages: [{ role: "user", content: enrichPrompt(payload) }],
    }),
  });
  if (!res.ok) throw fb.httpError(502, `AI service returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  if (data.stop_reason === "refusal") throw fb.httpError(502, "AI service declined this question: " + (data.stop_details?.explanation || ""));
  const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  let out;
  try { out = JSON.parse(raw); } catch { throw fb.httpError(502, "AI response was not valid JSON: " + raw.slice(0, 200)); }
  out.usage = data.usage;
  return out;
}

// ---- Firestore -------------------------------------------------------------
const INDEX_FIELDS = ["q", "paper", "series", "year", "totalMarks", "title", "topics", "kind", "keywords", "imageUrl", "legacy", "unit"]; // keywords: searched by the homework builder

async function reindex({ board, level }, token) {
  if (!board || !level) throw fb.httpError(400, "board and level required");
  const docs = await fb.queryDocuments("ppq", { board, level }, token, { limit: 3000 });
  const items = docs.filter(d => d.status !== "offspec" && !d.diagnostic).map(d => { const o = { id: d.id }; for (const k of INDEX_FIELDS) if (d[k] !== undefined && d[k] !== null && d[k] !== false) o[k] = d[k]; return o; })
    .sort((a, b) => (a.year - b.year) || String(a.series).localeCompare(String(b.series)) || (a.paper - b.paper) || (a.q - b.q));
  await fb.updateDocument(`ppqIndex/${board}_${level}`, { board, level, count: items.length, items, updatedAt: new Date() }, token);
  return { count: items.length };
}

/**
 * The question list of one HSJ diagnostic paper (ppq docs with unit = the
 * paper id), written to ppqIndex/diag_{unit} for api/students.js to set as a
 * new student's first homework. Diagnostic questions never enter the practise
 * index above.
 */
async function diagnosticIndex({ unit, title, level, board, ids }, token) {
  if (!unit) throw fb.httpError(400, "unit required");
  let docs;
  if (Array.isArray(ids) && ids.length) {
    // A paper assembled from bank questions (the Resit paper): the listed
    // questions in the given order, numbered 1..n, while they stay in Practise for everyone else
    const got = await Promise.all(ids.slice(0, 60).map(id => fb.getDocument(`ppq/${String(id).slice(0, 80)}`, token)));
    const missing = ids.filter((_, i) => !got[i]);
    if (missing.length) throw fb.httpError(400, `Not in the bank: ${missing.join(", ")}`);
    docs = got.map((d, i) => ({ ...d, q: i + 1, sourceQ: d.q }));
  } else {
    docs = (await fb.queryDocuments("ppq", { unit, diagnostic: true }, token, { limit: 200 })).sort((a, b) => (a.q - b.q));
  }
  const items = docs.filter(d => d.status !== "offspec").map(d => { const o = { id: d.id }; for (const k of INDEX_FIELDS) if (d[k] !== undefined && d[k] !== null && d[k] !== false) o[k] = d[k]; return o; });
  const totalMarks = items.reduce((a, it) => a + (Number(it.totalMarks) || 0), 0);
  await fb.updateDocument(`ppqIndex/diag_${unit}`, { unit, title: title || unit, level: level || null, board: board || null, diagnostic: true, count: items.length, totalMarks, items, updatedAt: new Date() }, token);
  return { count: items.length, totalMarks };
}

/**
 * One-off repair: multiple-choice letters marked by the AI examiner before
 * picked letters were compared on the server. Re-scores every stored part
 * where the student picked a letter and the bank part is an MCQ with a
 * letter answer, in Practise attempts (ppqAttempts) and homework
 * submissions. { dry: true } reports without writing.
 */
async function fixMcq({ dry = true }, token) {
  const bank = new Map();
  const bankDoc = async (qid) => { if (!bank.has(qid)) bank.set(qid, await fb.getDocument(`ppq/${qid}`, token).catch(() => null)); return bank.get(qid); };
  const letter = (v) => { const t = String(v == null ? "" : v).trim().toUpperCase(); return /^[A-D]$/.test(t) ? t : null; };
  const pk = (label) => (label === "" || label === null || label === undefined) ? "q" : String(label);
  // Right score for one stored part, or null when it is not a picked-letter MCQ
  const rescore = async (qid, key, stored) => {
    const doc = await bankDoc(qid);
    const part = (doc?.parts || []).find(p => pk(p.label) === key);
    if (!part || part.type !== "mcq") return null;
    const want = letter(part.answer), got = letter(stored?.answer);
    if (!want || !got) return null;
    return { score: got === want ? Number(part.marks) || 1 : 0, marks: Number(part.marks) || 1, right: got === want };
  };
  const report = { attempts: { seen: 0, fixed: 0 }, submissions: { seen: 0, fixed: 0 }, changes: [] };

  const attempts = await fb.queryDocuments("ppqAttempts", {}, token, { limit: 5000 });
  for (const att of attempts) {
    report.attempts.seen++;
    const latest = att.latest; if (!latest?.parts) continue;
    let changed = false; const parts = { ...latest.parts };
    for (const [key, sp] of Object.entries(parts)) {
      const r = await rescore(att.qid, key, sp);
      if (!r || r.score === sp.score) continue;
      parts[key] = { ...sp, score: r.score, marks: r.marks, awarded: [r.right], attempted: true, feedback: r.right ? "Correct." : sp.feedback, errorType: r.right ? null : sp.errorType || null, errorNote: r.right ? null : sp.errorNote || null };
      changed = true;
    }
    if (!changed) continue;
    const score = Object.values(parts).reduce((a, p) => a + (Number(p.score) || 0), 0);
    const patch = { latest: { ...latest, parts, score, repairedAt: new Date() }, best: Math.max(att.best || 0, score) };
    if ((att.attempts || 1) === 1 && att.first) patch.first = { ...att.first, score };
    report.attempts.fixed++; report.changes.push({ kind: "attempt", id: att.id, from: latest.score, to: score });
    if (!dry) await fb.updateDocument(`ppqAttempts/${att.id}`, patch, token);
  }

  const subs = await fb.queryDocuments("submissions", {}, token, { limit: 5000 });
  for (const sub of subs) {
    report.submissions.seen++;
    const answers = sub.answers || {}; let changed = false; const next = { ...answers };
    for (const [itemKey, ans] of Object.entries(answers)) {
      const d = ans?.detail; if (!d?.qid || !d.parts) continue;
      let itemChanged = false; const parts = { ...d.parts };
      for (const [key, sp] of Object.entries(parts)) {
        const r = await rescore(d.qid, key, sp);
        if (!r || r.score === sp.score) continue;
        parts[key] = { ...sp, score: r.score, attempted: true, feedback: r.right ? "Correct." : sp.feedback };
        itemChanged = true;
      }
      if (!itemChanged) continue;
      const score = Object.values(parts).reduce((a, p) => a + (Number(p.score) || 0), 0);
      const list = Array.isArray(ans.attempts) ? ans.attempts.slice() : [];
      if (list.length) list[list.length - 1] = { ...list[list.length - 1], score };
      const first = list.length ? list[0].score : score;
      const maxScore = Number(ans.maxScore) || score;
      next[itemKey] = { ...ans, detail: { ...d, parts }, attempts: list, score: first, bestScore: Math.max(first, ...list.map(x => Number(x.score) || 0)), correct: first >= Math.ceil(maxScore * 0.75), repairedAt: Date.now() };
      changed = true;
    }
    if (!changed) continue;
    const totalScore = Object.values(next).reduce((a, v) => a + (Number(v?.score) || 0), 0);
    report.submissions.fixed++; report.changes.push({ kind: "submission", id: sub.id, from: sub.totalScore, to: totalScore, tutorMarks: Object.keys(sub.tutorMarks || {}).length });
    if (!dry) await fb.updateDocument(`submissions/${sub.id}`, { answers: next, totalScore }, token);
  }
  return { dry, ...report };
}

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const token = await fb.getAccessToken();
    const who = await authorise(req, token);
    const { action, ...payload } = req.body || {};
    if (action === "upload") return res.status(200).json(await upload(payload, token));
    if (action === "enrich") return res.status(200).json(await enrich(payload));
    if (action === "upsert") {
      if (!payload.id || !payload.doc) throw fb.httpError(400, "id and doc required");
      await fb.updateDocument(`ppq/${payload.id}`, { ...payload.doc, updatedAt: new Date(), updatedBy: who }, token);
      return res.status(200).json({ ok: true, id: payload.id });
    }
    if (action === "get") return res.status(200).json({ doc: await fb.getDocument(`ppq/${payload.id}`, token) });
    if (action === "fixMcq") return res.status(200).json(await fixMcq(payload, token));
    if (action === "cors") {
      // Let the web app read question images into a canvas (whiteboard export)
      const r = await fetch(`https://storage.googleapis.com/storage/v1/b/${BUCKET}?fields=cors`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ cors: [{ origin: ["*"], method: ["GET", "HEAD"], responseHeader: ["Content-Type"], maxAgeSeconds: 3600 }] }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw fb.httpError(502, `Bucket update failed (${r.status}): ${JSON.stringify(data).slice(0, 300)}`);
      return res.status(200).json({ ok: true, cors: data.cors });
    }
    if (action === "reindex") return res.status(200).json(await reindex(payload, token));
    if (action === "diagnosticIndex") return res.status(200).json(await diagnosticIndex(payload, token));
    throw fb.httpError(400, "Unknown action");
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || "Server error" });
  }
};

