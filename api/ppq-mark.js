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
  const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  let out;
  try { out = JSON.parse(raw); } catch { throw fb.httpError(502, "The marking service did not return valid JSON."); }
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
    // For point-marked parts never give more marks than points credited
    if (n > 0 && n <= p.marks) score = Math.min(score, awarded.filter(Boolean).length);
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

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const caller = await verifyFirebaseToken(req);
    if (!caller) throw fb.httpError(401, "Unauthorised");
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

    const raw = await callClaude({ model: hasImages ? VISION_MODEL : TEXT_MODEL, content, maxTokens: 3000 });
    const result = tidy(raw, doc);

    // Persist: one document per student per question
    const attemptId = `${qid}_${caller.uid}`;
    const prev = await fb.getDocument(`ppqAttempts/${attemptId}`, token).catch(() => null);
    const profile = await fb.getDocument(`users/${caller.uid}`, token).catch(() => null);
    const now = new Date();
    const latest = {
      score: result.score, at: now, mode, model: raw.model,
      hintsUsed: Object.fromEntries(Object.entries(hintsUsed).map(([k, v]) => [k, Math.max(0, parseInt(v, 10) || 0)])),
      parts: Object.fromEntries(result.parts.map(p => [p.label, { answer: answers[p.label] ? String(answers[p.label]).slice(0, 4000) : null, score: p.score, marks: p.marks, feedback: p.feedback }])),
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
