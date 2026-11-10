// Marks a student's attempt at a past-paper question against the structured
// mark scheme produced by api/ppq-admin.js (ppq/{id}).
//
//   POST { qid, answers: { "01.1": "text", ... }, images: [{ mediaType, dataBase64 }], mode, hintsUsed: { "01.1": 2 } }
//
// Typed answers are marked by Sonnet; anything with an image (whiteboard
// drawing over the question, or a photo of paper work) goes to Opus with
// vision. The question image itself is always attached so tables, graphs and
// diagrams the text extraction lost are visible to the examiner.
//
// The result is written to ppqAttempts/{qid}_{uid} (one document per student
// per question: attempt count, best score and the latest attempt) and returned
// together with the mark scheme and model answers for the reveal.
//
// Two further actions on the same attempt document:
//   { action: "query", qid, part, note }                      student asks their tutor to check a part's mark
//   { action: "reply", attemptId, part, reply, score? }       tutor (or admin) answers and may adjust the part's score
const fb = require("./_firebaseAdmin");
const { setCors } = require("./_cors");
const { verifyFirebaseToken } = require("./_auth");

const TEXT_MODEL = "claude-sonnet-5-5";
const VISION_MODEL = "claude-opus-5-5";
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;   // per image, after the client has downscaled it

const BOARD_NAME = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };
const LEVEL_NAME = { as: "AS", a2: "A-level" };

const CONVENTIONS = `MARKING CONVENTIONS (apply all of these):
1. Error carried forward (ECF): if an earlier value is wrong but is then used correctly in a later step, award the later marks.
2. Significant figures: deduct at most one mark for rounding, and only where a marking point depends on the final value.
3. Alternative wording: award a point for equivalent chemistry expressed in different words. Use ALLOW notes in the scheme where given.
4. Contradictions: if a correct statement is contradicted elsewhere in the answer, award 0 for that point. Use REJECT notes where given.
5. Never award more than the marks available for a point, never award a point twice, and never award a mark for a part the student has not attempted.
6. Multiple-choice parts: award the mark only if the student's letter matches the scheme. A letter with a correct explanation of a different letter still scores 0.
7. Drawn answers (structures, mechanisms, dot-and-cross diagrams, graphs): check every feature the scheme asks for (bonds, charges, lone pairs, curly arrows from the right place, labels, axes). Be as strict as a real examiner.`;

const FEEDBACK_RULES = `FEEDBACK RULES (the student may try the question again):
- Do NOT state a missing marking point, the correct value, the correct letter, or the answer.
- Do NOT quote or paraphrase the mark scheme; the scheme is shown to the student separately once they unlock it.
- Say what was credited in general terms, then describe what is missing or wrong by its kind: which concept, which step of the working, what type of error (sign, units, moles, a condition not stated, a term used loosely, a feature missing from a diagram).
- Two sentences at most per part, in exam-style language. UK spelling. No em dashes.`;

function partBlock(p, answer) {
  const scheme = (p.ms || []).map((m, i) => `   ${i + 1}. ${m}`).join("\n");
  const typed = answer === undefined || answer === null || String(answer).trim() === "" ? "(no typed answer; look for it in the attached image(s) if any)" : String(answer).trim();
  return `PART ${p.label} (${p.marks} mark${p.marks === 1 ? "" : "s"}, type ${p.type || "short"})
Asked: ${p.ask}
${p.answer ? `Expected final answer: ${p.answer}\n` : ""}Mark scheme points:
${scheme || "   (levels-of-response: use the indicative content and the marks available)"}
Student's answer:
---
${typed}
---`;
}

function markPrompt({ doc, answers, hasImages, mode, inkOnly }) {
  const parts = (doc.parts || []).map(p => partBlock(p, answers[p.label])).join("\n\n");
  const imageNote = !hasImages ? ""
    : mode === "draw" && inkOnly
      ? "\nThe student answered by drawing and writing directly on the question. The second attached image is the student's ink alone, on white, at exactly the same scale and position as the printed question in the first image, so line up the two to see which part each piece of ink belongs to. Where a typed answer is also given for a part, consider both."
    : mode === "draw"
      ? "\nThe student answered by drawing and writing directly on the question. The attached image(s) show the question with the student's ink on top; anything that is not part of the printed question is the student's answer. Where a typed answer is also given for a part, consider both."
      : "\nThe student worked on paper and photographed it. The attached image(s) are those photos. Read the handwriting carefully, follow the working, and match each piece of work to the part it answers (students usually label parts). Where a typed answer is also given for a part, consider both.";
  return `You are a senior ${BOARD_NAME[doc.board] || doc.board} ${LEVEL_NAME[doc.level] || ""} Chemistry examiner marking a student's attempt at a real past-paper question, point by point against the official mark scheme, exactly as in a real exam.

PAPER: ${BOARD_NAME[doc.board]} ${LEVEL_NAME[doc.level]} Paper ${doc.paper}, ${doc.series}, question ${doc.q} (${doc.totalMarks} marks). The first attached image is the printed question as the student saw it.${imageNote}

${parts}

${CONVENTIONS}

${FEEDBACK_RULES}

For each part decide, for every mark scheme point in order, whether the student earns it, then total the marks for that part (capped at the marks available). For levels-of-response parts with indicative content, judge the level holistically and set "awarded" to which indicative points were covered. Then write one or two sentences of overall feedback for the whole question in the same style.

Return ONLY a JSON object, no markdown, with exactly this shape:
{
  "parts": [
    { "label": "<part label exactly as given>", "score": <integer>, "awarded": [<boolean per mark scheme point, in order>], "feedback": "<one or two sentences following the FEEDBACK RULES, or an empty string if the part was not attempted>", "attempted": <boolean> }
  ],
  "overall": "<one or two sentences>",
  "confidence": "<high | medium | low>"
}`;
}

async function callClaude({ model, content, maxTokens }) {
  const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey) throw fb.httpError(500, "ANTHROPIC_API_KEY not configured");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-beta": "server-side-fallback-2026-07-01" },
    body: JSON.stringify({
      model, max_tokens: maxTokens,
      output_config: { effort: "medium" },
      fallbacks: "default",
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw fb.httpError(502, `Marking service returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  if (data.stop_reason === "refusal") throw fb.httpError(502, "The marking service declined this answer. " + (data.stop_details?.explanation || ""));
  if (data.stop_reason === "max_tokens") throw fb.httpError(502, "The marking service ran out of room. Please try again.");
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
  // The model occasionally wraps the JSON in fences or a sentence; take the outermost object.
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  const raw = start >= 0 && end > start ? text.slice(start, end + 1) : text;
  let out;
  try { out = JSON.parse(raw); } catch {
    console.error("ppq-mark: unparseable response", { model: data.model, stop: data.stop_reason, text: text.slice(0, 1500) });
    throw fb.httpError(502, "The marking service did not return valid JSON. Please try again.");
  }
  out.usage = data.usage;
  out.model = data.model || model;
  return out;
}

/** Clamp and complete the model's output against the question's parts. */
function tidy(result, doc) {
  const byLabel = new Map((Array.isArray(result.parts) ? result.parts : []).map(p => [String(p.label), p]));
  let total = 0;
  const parts = (doc.parts || []).map(p => {
    const r = byLabel.get(String(p.label)) || {};
    const n = (p.ms || []).length;
    let awarded = Array.isArray(r.awarded) ? r.awarded.slice(0, n).map(Boolean) : [];
    while (awarded.length < n) awarded.push(false);
    let score = Math.max(0, Math.min(p.marks, parseInt(r.score, 10) || 0));
    // Where there is one mark per scheme point (or more points than marks, "any 2 from"),
    // never give more marks than points credited. A part with fewer points than marks
    // has points worth several marks each, so the examiner's total stands.
    if (n >= p.marks) score = Math.min(score, awarded.filter(Boolean).length);
    const attempted = r.attempted === undefined ? score > 0 || awarded.some(Boolean) : !!r.attempted;
    total += score;
    return { label: p.label, marks: p.marks, score, awarded, attempted, feedback: typeof r.feedback === "string" ? r.feedback : "" };
  });
  return {
    parts, score: Math.min(total, doc.totalMarks || total), totalMarks: doc.totalMarks,
    overall: typeof result.overall === "string" ? result.overall : "",
    confidence: ["high", "medium", "low"].includes(result.confidence) ? result.confidence : "medium",
  };
}

/** Student asks their tutor about one part's mark on their latest attempt. */
async function query(caller, { qid, part, note }) {
  if (!qid || !part || typeof note !== "string" || note.trim().length < 5) throw fb.httpError(400, "Write a few words about why you think the mark should be different.");
  const token = await fb.getAccessToken();
  const id = `${qid}_${caller.uid}`;
  const att = await fb.getDocument(`ppqAttempts/${id}`, token);
  if (!att || att.uid !== caller.uid) throw fb.httpError(404, "Mark this question first, then query a part.");
  if (!att.latest?.parts?.[part]) throw fb.httpError(400, "Unknown part");
  const queries = { ...(att.queries || {}) };
  if (queries[part] && queries[part].status === "open") throw fb.httpError(409, "You have already sent a query for this part. Your tutor will reply soon.");
  queries[part] = { note: note.trim().slice(0, 1000), at: Date.now(), status: "open", reply: null, attempt: att.attempts || 1, score: att.latest.parts[part].score, answer: att.latest.parts[part].answer || null, feedback: att.latest.parts[part].feedback || null };
  await fb.updateDocument(`ppqAttempts/${id}`, { queries, hasOpenQuery: true, updatedAt: new Date() }, token);
  return { ok: true, queries };
}

/** Tutor or admin replies to a query and may correct the part's score. */
async function reply(caller, { attemptId, part, reply: text, score }) {
  if (!attemptId || !part || typeof text !== "string" || !text.trim()) throw fb.httpError(400, "attemptId, part and reply required");
  const token = await fb.getAccessToken();
  const [profile, att] = await Promise.all([fb.getDocument(`users/${caller.uid}`, token), fb.getDocument(`ppqAttempts/${attemptId}`, token)]);
  if (!profile || !["tutor", "admin"].includes(profile.role)) throw fb.httpError(403, "Tutor accounts only");
  if (!att) throw fb.httpError(404, "Attempt not found");
  if (profile.role !== "admin" && att.tutorId !== caller.uid) throw fb.httpError(403, "This student is not in one of your groups");
  const queries = { ...(att.queries || {}) };
  if (!queries[part]) throw fb.httpError(404, "No query on that part");
  queries[part] = { ...queries[part], reply: text.trim().slice(0, 2000), status: "resolved", repliedAt: Date.now(), repliedBy: caller.uid };
  const patch = { queries, hasOpenQuery: Object.values(queries).some(q => q.status === "open"), updatedAt: new Date() };
  // Optional correction of the part's score on the latest attempt
  if (score !== undefined && score !== null && score !== "") {
    const doc = await fb.getDocument(`ppq/${att.qid}`, token);
    const p = (doc?.parts || []).find(x => String(x.label) === String(part));
    const n = Math.max(0, Math.min(p ? p.marks : 99, parseInt(score, 10) || 0));
    const latest = { ...att.latest, parts: { ...att.latest.parts, [part]: { ...att.latest.parts[part], score: n, adjustedBy: caller.uid } } };
    latest.score = Object.values(latest.parts).reduce((sum, x) => sum + (x.score || 0), 0);
    patch.latest = latest;
    patch.best = Math.max(att.best || 0, latest.score);
    queries[part].newScore = n;
  }
  await fb.updateDocument(`ppqAttempts/${attemptId}`, patch, token);
  return { ok: true, queries, latest: patch.latest || att.latest, best: patch.best ?? att.best };
}

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const caller = await verifyFirebaseToken(req);
    if (!caller) throw fb.httpError(401, "Unauthorised");
    if (req.body?.action === "query") return res.status(200).json(await query(caller, req.body));
    if (req.body?.action === "reply") return res.status(200).json(await reply(caller, req.body));
    const { qid, answers = {}, images = [], mode = "typed", hintsUsed = {}, inkOnly = false } = req.body || {};
    if (!qid || typeof qid !== "string") throw fb.httpError(400, "qid required");
    if (!Array.isArray(images) || images.length > MAX_IMAGES) throw fb.httpError(400, `Up to ${MAX_IMAGES} images`);
    for (const im of images) {
      if (!im || !/^image\/(jpeg|png|webp)$/.test(im.mediaType || "") || typeof im.dataBase64 !== "string") throw fb.httpError(400, "Images must be JPEG, PNG or WebP");
      if (im.dataBase64.length * 0.75 > MAX_IMAGE_BYTES) throw fb.httpError(413, "An image is too large. Please retake it or use a smaller photo.");
    }
    const typedAny = Object.values(answers).some(v => v && String(v).trim());
    if (!typedAny && images.length === 0) throw fb.httpError(400, "Type an answer, draw on the question or add a photo before marking.");

    const token = await fb.getAccessToken();
    const doc = await fb.getDocument(`ppq/${qid}`, token);
    if (!doc || !Array.isArray(doc.parts) || doc.parts.length === 0) throw fb.httpError(404, "Question not found");

    const hasImages = images.length > 0;
    const content = [];
    if (doc.imageUrl) content.push({ type: "image", source: { type: "url", url: doc.imageUrl } });
    for (const im of images) content.push({ type: "image", source: { type: "base64", media_type: im.mediaType, data: im.dataBase64 } });
    content.push({ type: "text", text: markPrompt({ doc, answers, hasImages, mode, inkOnly: !!inkOnly }) });

    const raw = await callClaude({ model: hasImages ? VISION_MODEL : TEXT_MODEL, content, maxTokens: 4000 });
    const result = tidy(raw, doc);

    // Persist: one document per student per question
    const attemptId = `${qid}_${caller.uid}`;
    const prev = await fb.getDocument(`ppqAttempts/${attemptId}`, token).catch(() => null);
    const profile = await fb.getDocument(`users/${caller.uid}`, token).catch(() => null);
    const now = new Date();
    const latest = {
      score: result.score, at: now, mode, model: raw.model,
      hintsUsed: Object.fromEntries(Object.entries(hintsUsed).map(([k, v]) => [k, Math.max(0, parseInt(v, 10) || 0)])),
      parts: Object.fromEntries(result.parts.map(p => [p.label, { answer: answers[p.label] ? String(answers[p.label]).slice(0, 4000) : null, score: p.score, marks: p.marks, feedback: p.feedback, awarded: p.awarded, attempted: p.attempted }])),
      overall: result.overall,
    };
    const attemptDoc = {
      uid: caller.uid, tutorId: profile?.tutorId || null, classId: profile?.classId || null,
      qid, board: doc.board, level: doc.level, paper: doc.paper, series: doc.series, year: doc.year, q: doc.q,
      totalMarks: doc.totalMarks, title: doc.title || null, topics: doc.topics || [],
      attempts: (prev?.attempts || 0) + 1,
      best: Math.max(prev?.best || 0, result.score),
      first: prev?.first || { score: result.score, at: now },
      latest, updatedAt: now,
    };
    await fb.updateDocument(`ppqAttempts/${attemptId}`, attemptDoc, token);

    return res.status(200).json({
      ...result,
      attempts: attemptDoc.attempts, best: attemptDoc.best,
      scheme: doc.parts.map(p => ({ label: p.label, marks: p.marks, ms: p.ms || [], modelAnswer: p.modelAnswer || null, answer: p.answer || null })),
      usage: raw.usage, model: raw.model,
    });
  } catch (e) {
    if (!e.status) console.error("ppq-mark error:", e);
    return res.status(e.status || 500).json({ error: e.message || "Server error" });
  }
};
