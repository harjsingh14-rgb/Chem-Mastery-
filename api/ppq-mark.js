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
const { takeQuota } = require("./_quota");
const { ERROR_TYPES_PROMPT, cleanErrorType, cleanErrorNote } = require("./_errorTypes");
const { setCors } = require("./_cors");
const { verifyFirebaseToken } = require("./_auth");
const mail = require("./_email");
const diag = require("./_diagnostic");

const TEXT_MODEL = "claude-sonnet-5-5";
const VISION_MODEL = "claude-opus-5-5";
const MAX_IMAGES = 4;
const MAX_ANSWER_CHARS = 4000;          // per part, typed answer
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
7. Drawn answers (structures, mechanisms, dot-and-cross diagrams, graphs): check every feature the scheme asks for (bonds, charges, lone pairs, curly arrows from the right place, labels, axes). Be as strict as a real examiner.
8. Typed notation: students type on phones, so read plain-text notation as the chemistry intended and never deduct for it: 10^-7, 1.7e-7 or 1.7 x 10-7 for powers; mol dm-3, mol/dm3 or moldm-3 for units; H2SO4 or SO4 2- for formulae and ions; -> or = for reaction arrows; <=> for equilibrium; ^ for superscripts; numbers after symbols for subscripts.`;

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

PAPER: ${doc.legacy ? `${BOARD_NAME[doc.board]} legacy unit ${doc.unit} (2010 to 2016 specification)` : `${BOARD_NAME[doc.board]} ${LEVEL_NAME[doc.level]} Paper ${doc.paper}`}, ${doc.series}, question ${doc.q} (${doc.totalMarks} marks). The first attached image is the printed question as the student saw it.${doc.onlyParts ? ` Only the parts listed below were set; ignore any other parts printed on the question and do not mark them.` : ""}${imageNote}

${parts}

${CONVENTIONS}

${FEEDBACK_RULES}

For each part decide, for every mark scheme point in order, whether the student earns it, then total the marks for that part (capped at the marks available). For levels-of-response parts with indicative content, judge the level holistically and set "awarded" to which indicative points were covered. Then write one or two sentences of overall feedback for the whole question in the same style.

${ERROR_TYPES_PROMPT}
For a part that was not attempted use "timing".

Return ONLY a JSON object, no markdown, with exactly this shape:
{
  "parts": [
    { "label": "<part label exactly as given>", "score": <integer>, "awarded": [<boolean per mark scheme point, in order>], "feedback": "<one or two sentences following the FEEDBACK RULES, or an empty string if the part was not attempted>", "attempted": <boolean>, "errorType": <error type id or null>, "errorNote": <string or null> }
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
    const errorType = score < p.marks ? (cleanErrorType(r.errorType) || (!attempted ? "timing" : null)) : null;
    return { label: p.label, marks: p.marks, score, awarded, attempted, feedback: typeof r.feedback === "string" ? r.feedback : "", errorType, errorNote: errorType ? cleanErrorNote(r.errorNote) : null };
  });
  return {
    parts, score: Math.min(total, doc.totalMarks || total), totalMarks: doc.totalMarks,
    overall: typeof result.overall === "string" ? result.overall : "",
    confidence: ["high", "medium", "low"].includes(result.confidence) ? result.confidence : "medium",
  };
}

// Map keys in Firestore cannot be empty, and MCQs have one part with label "".
const partKey = (label) => (label === "" || label === null || label === undefined) ? "q" : String(label);

/** Student asks their tutor about one part's mark on their latest attempt. */
async function query(caller, { qid, part, note }) {
  part = partKey(part);
  if (!qid || typeof note !== "string" || note.trim().length < 5) throw fb.httpError(400, "Write a few words about why you think the mark should be different.");
  const token = await fb.getAccessToken();
  const id = `${qid}_${caller.uid}`;
  const att = await fb.getDocument(`ppqAttempts/${id}`, token);
  if (!att || att.uid !== caller.uid) throw fb.httpError(404, "Mark this question first, then query a part.");
  if (!att.latest?.parts?.[part]) throw fb.httpError(400, "Unknown part");
  const queries = { ...(att.queries || {}) };
  if (queries[part] && queries[part].status === "open") throw fb.httpError(409, "You have already sent a query for this part. Your tutor will reply soon.");
  queries[part] = { note: note.trim().slice(0, 1000), at: Date.now(), status: "open", reply: null, attempt: att.attempts || 1, score: att.latest.parts[part].score, answer: att.latest.parts[part].answer || null, feedback: att.latest.parts[part].feedback || null };
  await fb.updateDocument(`ppqAttempts/${id}`, { queries, hasOpenQuery: true, updatedAt: new Date() }, token);
  // Tell the tutor straight away (never fail the query if the email does)
  try {
    const [tutor, student] = await Promise.all([att.tutorId ? fb.getDocument(`users/${att.tutorId}`, token) : null, fb.getDocument(`users/${caller.uid}`, token)]);
    if (tutor?.email) {
      const { subject, html } = mail.tutorQuery({ tutorName: tutor.displayName, studentName: student?.displayName || student?.email || "A student", where: `${att.title || "past-paper question"} (Q${att.q} part ${part})`, note: note.trim(), link: `${mail.SITE}/tutor/homework` });
      await mail.sendEmail({ to: tutor.email, subject, html });
    }
  } catch (e) { console.warn("ppq query email failed:", e.message); }
  return { ok: true, queries };
}

/** Tutor or admin replies to a query and may correct the part's score. */
async function reply(caller, { attemptId, part, reply: text, score }) {
  part = partKey(part);
  if (!attemptId || typeof text !== "string" || !text.trim()) throw fb.httpError(400, "attemptId, part and reply required");
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

// ---- Initial diagnostic feedback report ----------------------------------
//   { action: "diagnosticReport", assignmentId, uid }            tutor/admin: write the draft report (Claude) onto the submission
//   { action: "saveDiagnosticReport", assignmentId, uid, report } tutor/admin: keep the tutor's edits
//   { action: "sendDiagnosticReport", assignmentId, uid, report } tutor/admin: save, email the parent (student copied), release in the app
async function diagnosticContext(caller, { assignmentId, uid }) {
  if (!assignmentId || !uid) throw fb.httpError(400, "assignmentId and uid required");
  const token = await fb.getAccessToken();
  const [profile, assignment, sub, student] = await Promise.all([
    fb.getDocument(`users/${caller.uid}`, token), fb.getDocument(`assignments/${assignmentId}`, token),
    fb.getDocument(`submissions/${assignmentId}_${uid}`, token), fb.getDocument(`users/${uid}`, token),
  ]);
  if (!profile || !["tutor", "admin"].includes(profile.role)) throw fb.httpError(403, "Tutor accounts only");
  if (!assignment || assignment.kind !== "diagnostic") throw fb.httpError(404, "This homework is not a diagnostic");
  if (profile.role !== "admin" && assignment.tutorId !== caller.uid) throw fb.httpError(403, "This student is not in one of your groups");
  if (!sub || !sub.submittedAt) throw fb.httpError(400, "The student has not submitted the diagnostic yet");
  if (!student) throw fb.httpError(404, "Student not found");
  return { token, profile, assignment, sub, student };
}

async function diagnosticReport(caller, body) {
  const { token, assignment, sub, student } = await diagnosticContext(caller, body);
  const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey) throw fb.httpError(500, "ANTHROPIC_API_KEY not configured");
  const report = await diag.generate({ assignment, sub, student, token, apiKey });
  const stored = { ...report, status: "draft", generatedAt: Date.now(), generatedBy: caller.uid, sentAt: sub.report?.sentAt || null };
  await fb.updateDocument(`submissions/${body.assignmentId}_${body.uid}`, { report: stored, updatedAt: new Date() }, token);
  return { report: stored };
}

/** One `attempts` row per diagnostic question, written when the report is first released, so the
 *  dashboard's topic stats include the diagnostic without revealing marks before the tutor sends them. */
async function recordDiagnosticAttempts({ assignment, sub, student, uid, assignmentId, items, token }) {
  const board = assignment.topicBoard || "aqa";
  // Dated when the paper was sat, so the accuracy-over-time chart puts it in the right week
  const sat = sub.submittedAt ? new Date(typeof sub.submittedAt === "number" ? sub.submittedAt : String(sub.submittedAt)) : new Date();
  const at = isNaN(sat.getTime()) ? new Date() : sat;
  for (const it of items) {
    const topic = it.topics[0] || null;
    const attempt = {
      uid, tutorId: student.tutorId || null, classId: student.classId || null, board: student.board || assignment.board || null,
      type: "ppq", questionId: String(it.questionId || it.key), topic, topicLabel: topic ? diag.topicTitle(board, topic) : (it.title || null), difficulty: null,
      correct: it.max > 0 && it.score >= Math.ceil(it.max * 0.7), score: it.score, maxScore: it.max,
      mode: "diagnostic", assignmentId, createdAt: at, clientTime: at.getTime(),
    };
    // Merge-write with a fixed id, so a repeat is harmless
    await fb.updateDocument(`attempts/${`diag_${assignmentId}_${uid}_${it.key}`.replace(/[^A-Za-z0-9_.-]/g, "_")}`, attempt, token);
  }
}

async function saveDiagnosticReport(caller, body, send) {
  const { token, assignment, sub, student } = await diagnosticContext(caller, body);
  if (!body.report) throw fb.httpError(400, "report required");
  // Recompute the numbers from the submission; only the words come from the editor
  const items = diag.scoreItems(assignment, sub);
  const nums = diag.numbers(assignment, items, student.year);
  const computed = { headline: nums.headline, byTopic: nums.byTopic, items: items.map(it => ({ n: it.n, q: it.q, title: it.title, score: it.score, max: it.max, attempted: it.attempted, topic: it.topics[0] || null })) };
  const report = diag.sanitise(body.report, computed);
  const stored = { ...report, status: send ? "sent" : "draft", generatedAt: sub.report?.generatedAt || null, editedAt: Date.now(), editedBy: caller.uid, sentAt: send ? Date.now() : (sub.report?.sentAt || null), sentBy: send ? caller.uid : (sub.report?.sentBy || null) };
  await fb.updateDocument(`submissions/${body.assignmentId}_${body.uid}`, { report: stored, updatedAt: new Date() }, token);
  let emailError = null;
  if (send) {
    try {
      const { subject, html } = mail.diagnosticReport({ studentName: student.displayName || sub.studentName || "", parentName: student.parentName || "", title: assignment.title, year: student.year, board: assignment.board, assignmentId: body.assignmentId, report: stored });
      const to = student.parentEmail || student.email;
      await mail.sendEmail({ to, cc: student.parentEmail && student.email && student.email !== student.parentEmail ? student.email : undefined, subject, html });
    } catch (e) { emailError = e.message; console.error("diagnostic report email failed:", e); }
    try { await fb.updateDocument(`users/${body.uid}`, { diagnostic: { ...(student.diagnostic || {}), assignmentId: body.assignmentId, reportSentAt: Date.now(), score: stored.headline?.score ?? null, max: stored.headline?.max ?? null } }, token); } catch (e) { console.error("profile diagnostic update failed:", e.message); }
    // First release only: the diagnostic answers now count towards the student's practice stats
    if (!sub.report?.sentAt) {
      try { await recordDiagnosticAttempts({ assignment, sub, student, uid: body.uid, assignmentId: body.assignmentId, items, token }); }
      catch (e) { console.error("diagnostic attempts failed:", e); }
    }
  }
  return { report: stored, emailError };
}

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const caller = await verifyFirebaseToken(req);
    if (!caller) throw fb.httpError(401, "Unauthorised");
    if (req.body?.action === "query") return res.status(200).json(await query(caller, req.body));
    if (req.body?.action === "reply") return res.status(200).json(await reply(caller, req.body));
    if (req.body?.action === "diagnosticReport") return res.status(200).json(await diagnosticReport(caller, req.body));
    if (req.body?.action === "saveDiagnosticReport") return res.status(200).json(await saveDiagnosticReport(caller, req.body, false));
    if (req.body?.action === "sendDiagnosticReport") return res.status(200).json(await saveDiagnosticReport(caller, req.body, true));
    const { qid, answers = {}, images = [], mode = "typed", hintsUsed = {}, inkOnly = false, onlyParts = null } = req.body || {};
    if (!qid || typeof qid !== "string") throw fb.httpError(400, "qid required");
    if (!Array.isArray(images) || images.length > MAX_IMAGES) throw fb.httpError(400, `Up to ${MAX_IMAGES} images`);
    for (const im of images) {
      if (!im || !/^image\/(jpeg|png|webp)$/.test(im.mediaType || "") || typeof im.dataBase64 !== "string") throw fb.httpError(400, "Images must be JPEG, PNG or WebP");
      if (im.dataBase64.length * 0.75 > MAX_IMAGE_BYTES) throw fb.httpError(413, "An image is too large. Please retake it or use a smaller photo.");
    }
    // Typed answers are capped before they reach the model: an exam answer is a few hundred words at most
    for (const k of Object.keys(answers)) if (typeof answers[k] === "string" && answers[k].length > MAX_ANSWER_CHARS) answers[k] = answers[k].slice(0, MAX_ANSWER_CHARS);
    const typedAny = Object.values(answers).some(v => v && String(v).trim());
    if (!typedAny && images.length === 0) throw fb.httpError(400, "Type an answer, draw on the question or add a photo before marking.");

    const token = await fb.getAccessToken();
    const full = await fb.getDocument(`ppq/${qid}`, token);
    if (!full || !Array.isArray(full.parts) || full.parts.length === 0) throw fb.httpError(404, "Question not found");
    // A homework may set only some parts: mark those alone, out of their marks
    const subset = Array.isArray(onlyParts) && onlyParts.length > 0 ? onlyParts.map(String) : null;
    const doc = subset
      ? { ...full, parts: full.parts.filter(p => subset.includes(String(p.label))), totalMarks: full.parts.filter(p => subset.includes(String(p.label))).reduce((a, p) => a + (Number(p.marks) || 0), 0) }
      : full;
    if (doc.parts.length === 0) throw fb.httpError(400, "None of the requested parts exist on this question");

    const hasImages = images.length > 0;
    // A picked multiple-choice letter is marked here by comparison with the
    // bank answer: instant, always the same, and no AI quota. The AI examiner
    // marks everything else (written parts, and a letter given only in ink).
    const exact = new Map();
    for (const p of doc.parts) {
      const key = String(p.answer || "").trim().toUpperCase();
      const given = String(answers[p.label] || "").trim().toUpperCase();
      if (p.type !== "mcq" || !/^[A-D]$/.test(key) || !/^[A-D]$/.test(given)) continue;
      const right = given === key;
      exact.set(String(p.label), {
        label: p.label, marks: p.marks, score: right ? p.marks : 0, awarded: (p.ms || []).map(() => right), attempted: true,
        feedback: right ? "Correct." : "Not the correct letter. Work through the question again and check which option your answer matches.",
        errorType: null, errorNote: null,
      });
    }
    const aiParts = doc.parts.filter(p => !exact.has(String(p.label)));
    let raw = { model: "exact", usage: null, parts: [], overall: "", confidence: "high" };
    if (aiParts.length > 0) {
      await takeQuota(caller.uid, "mark", token);
      const aiDoc = { ...doc, parts: aiParts, totalMarks: aiParts.reduce((a, p) => a + (Number(p.marks) || 0), 0), onlyParts: !!subset || aiParts.length < doc.parts.length };
      const content = [];
      if (doc.imageUrl) content.push({ type: "image", source: { type: "url", url: doc.imageUrl } });
      for (const im of images) content.push({ type: "image", source: { type: "base64", media_type: im.mediaType, data: im.dataBase64 } });
      content.push({ type: "text", text: markPrompt({ doc: aiDoc, answers, hasImages, mode, inkOnly: !!inkOnly }) });
      raw = await callClaude({ model: hasImages ? VISION_MODEL : TEXT_MODEL, content, maxTokens: 4000 });
    }
    const ai = tidy(raw, { ...doc, parts: aiParts });
    const merged = doc.parts.map(p => exact.get(String(p.label)) || ai.parts.find(x => String(x.label) === String(p.label)));
    const result = {
      parts: merged,
      score: Math.min(merged.reduce((a, p) => a + p.score, 0), doc.totalMarks || Infinity),
      totalMarks: doc.totalMarks,
      overall: aiParts.length > 0 ? ai.overall : (merged.every(p => p.score >= p.marks) ? "Correct." : ""),
      confidence: aiParts.length > 0 ? ai.confidence : "high",
    };

    // Persist: one document per student per question
    const attemptId = `${qid}_${caller.uid}`;
    const prev = await fb.getDocument(`ppqAttempts/${attemptId}`, token).catch(() => null);
    const profile = await fb.getDocument(`users/${caller.uid}`, token).catch(() => null);
    const now = new Date();
    const latest = {
      score: result.score, at: now, mode, model: raw.model,
      hintsUsed: Object.fromEntries(Object.entries(hintsUsed).map(([k, v]) => [partKey(k), Math.max(0, parseInt(v, 10) || 0)])),
      parts: Object.fromEntries(result.parts.map(p => [partKey(p.label), { answer: answers[p.label] ? String(answers[p.label]).slice(0, 4000) : null, score: p.score, marks: p.marks, feedback: p.feedback, awarded: p.awarded, attempted: p.attempted, errorType: p.errorType || null, errorNote: p.errorNote || null }])),
      overall: result.overall,
    };
    const attemptDoc = {
      uid: caller.uid, tutorId: profile?.tutorId || null, classId: profile?.classId || null,
      qid, board: doc.board, level: doc.level, paper: doc.paper, series: doc.series, year: doc.year, q: doc.q,
      totalMarks: doc.totalMarks, partsSubset: subset, title: doc.title || null, topics: doc.topics || [],
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
