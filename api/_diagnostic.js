// The feedback report for a student's initial diagnostic (api/ppq-mark.js
// actions diagnosticReport / saveDiagnosticReport / sendDiagnosticReport).
//
// The numbers (overall score, score on attempted questions, marks left blank,
// score by topic area, Year 12 content for a Year 13 student, and the score on
// topics school has taught so far when the self-evaluation says some have not
// been) are worked out here from the submission. Claude writes the words: summary, what went well,
// priority areas ranked by marks recoverable, exam technique, next steps and a
// comment per question. The tutor reviews and edits before it is sent.
const fb = require("./_firebaseAdmin");
const TOPICS = require("./_specTopics");
const Y = require("./_years");
const { untaughtAqaRefs } = require("./_topicMap");

const REPORT_MODEL = "claude-opus-5-5";
// AQA AS content (the Year 12 part of the Year 13 paper)
const AQA_AS = new Set(["3.1.1", "3.1.2", "3.1.3", "3.1.4", "3.1.5", "3.1.6", "3.1.7", "3.2.1", "3.2.2", "3.2.3", "3.3.1", "3.3.2", "3.3.3", "3.3.4", "3.3.5", "3.3.6"]);
const pct = (n, d) => d ? Math.round((n / d) * 100) : null;
const topicTitle = (board, ref) => (TOPICS[board] || {})[ref] || ref || "Other";

/** Per-question scores with the tutor's overrides applied. untaught: AQA refs school has not taught yet. */
function scoreItems(assignment, sub, untaught = new Set()) {
  const answers = sub.answers || {}, tm = sub.tutorMarks || {};
  return (assignment.items || []).map((it, i) => {
    const r = answers[it.key];
    const parts = r?.detail?.parts || {};
    const attempted = !!r && (Object.values(parts).some(p => p.attempted) || (r.score || 0) > 0 || Object.keys(parts).length === 0);
    const score = tm[it.key] !== undefined ? Number(tm[it.key]) : (r?.score || 0);
    return { n: i + 1, key: it.key, questionId: it.questionId, q: it.q, title: it.title || it.topicLabel || `Question ${i + 1}`, topics: it.topics || [], max: Number(it.marks) || 0,
      score: Math.max(0, Math.min(Number(it.marks) || 0, score)), attempted, feedback: r?.feedback || null, parts, adjusted: tm[it.key] !== undefined,
      notTaught: !!it.notTaught || untaught.has((it.topics || [])[0]) };
  });
}

// The papers are built from AQA questions and tagged with AQA topic refs; students of any board sit them
const topicBoard = (assignment) => assignment.topicBoard || "aqa";

function numbers(assignment, items, year) {
  const board = topicBoard(assignment);
  const max = items.reduce((a, it) => a + it.max, 0);
  const score = items.reduce((a, it) => a + it.score, 0);
  const attempted = items.filter(it => it.attempted);
  const attemptedMax = attempted.reduce((a, it) => a + it.max, 0);
  const byTopicMap = {};
  for (const it of items) {
    const ref = it.topics[0] || "other";
    const row = byTopicMap[ref] || (byTopicMap[ref] = { ref, area: topicTitle(board, ref), score: 0, max: 0, questions: [], notTaught: true });
    row.score += it.score; row.max += it.max; row.questions.push(it.n);
    if (!it.notTaught) row.notTaught = false;
  }
  // Topics not yet taught sort last, so the weakest taught topic leads the report
  const byTopic = Object.values(byTopicMap).map(r => ({ ...r, pct: pct(r.score, r.max) })).sort((a, b) => (a.notTaught - b.notTaught) || (a.pct ?? 0) - (b.pct ?? 0));
  // Score on the topics school has taught so far, when the self-evaluation rules some out
  let taught = null;
  const notTaughtItems = items.filter(it => it.notTaught);
  if (notTaughtItems.length) {
    const t = items.filter(it => !it.notTaught);
    const tMax = t.reduce((a, it) => a + it.max, 0), tScore = t.reduce((a, it) => a + it.score, 0);
    taught = { score: tScore, max: tMax, pct: pct(tScore, tMax), notTaughtMarks: notTaughtItems.reduce((a, it) => a + it.max, 0), notTaughtCount: notTaughtItems.length };
  }
  let year12 = null;
  if (Y.isA2(year)) {
    const as = items.filter(it => AQA_AS.has(it.topics[0]));
    const asMax = as.reduce((a, it) => a + it.max, 0);
    if (asMax) year12 = { score: as.reduce((a, it) => a + it.score, 0), max: asMax, pct: pct(as.reduce((a, it) => a + it.score, 0), asMax) };
  }
  return {
    headline: { score, max, pct: pct(score, max), attemptedScore: attempted.reduce((a, it) => a + it.score, 0), attemptedMax, attemptedPct: pct(attempted.reduce((a, it) => a + it.score, 0), attemptedMax), blankMarks: max - attemptedMax, blankCount: items.length - attempted.length, year12, taught },
    byTopic,
  };
}

function ragSummary(ev, board) {
  if (!ev?.ratings) return "not completed";
  const groups = { red: [], amber: [], green: [] };
  for (const [ref, r] of Object.entries(ev.ratings)) if (r?.rag && groups[r.rag]) groups[r.rag].push(`${ref} ${topicTitle(board, ref)}${r.note ? ` (student note: ${r.note})` : ""}`);
  const notCovered = Object.entries(ev.ratings).filter(([, r]) => r?.covered === "no").map(([ref]) => ref);
  return `Red (needs most help): ${groups.red.join("; ") || "none"}\nAmber: ${groups.amber.join("; ") || "none"}\nGreen (confident): ${groups.green.join("; ") || "none"}\nNot yet taught at school: ${notCovered.join(", ") || "none listed"}${ev.notes ? `\nStudent's own note: ${ev.notes}` : ""}`;
}

function questionBlock(it, doc, board) {
  const parts = (doc?.parts || []).map(p => {
    const r = it.parts[p.label] || it.parts[String(p.label)] || {};
    return `  Part ${p.label || "(whole)"} [${p.marks}]: asked: ${p.ask || ""}\n    Scheme: ${(p.ms || []).join(" | ")}\n    Student's answer: ${r.answer ? String(r.answer).slice(0, 600) : (r.attempted ? "(drawn or photographed work, marked from the image)" : "(not attempted)")}\n    Awarded: ${r.score ?? 0}/${r.maxScore ?? p.marks}${r.feedback ? ` · examiner note: ${r.feedback}` : ""}`;
  }).join("\n");
  return `Q${it.n}. ${it.title} [${it.max} marks] · topic ${it.topics.map(t => `${t} ${topicTitle(board, t)}`).join(", ") || "n/a"} · scored ${it.score}/${it.max}${it.adjusted ? " (tutor adjusted)" : ""}${it.attempted ? "" : " · NOT ATTEMPTED"}${it.notTaught ? " · TOPIC NOT YET TAUGHT AT SCHOOL" : ""}\n${parts}${it.feedback ? `\n  Overall examiner comment: ${it.feedback}` : ""}`;
}

function prompt({ student, assignment, items, docs, nums, year }) {
  const board = topicBoard(assignment);
  const examBoard = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" }[student.board || assignment.board] || "A-level";
  const first = (student.displayName || "the student").trim().split(/\s+/)[0];
  const pq = student.parentQuestionnaire || {};
  return `You are a senior A-level Chemistry tutor at HSJ Tuition writing the feedback report on a new student's initial diagnostic paper. The parent and the student both read it. Write in clear, direct, exam-style language with UK spelling. No em dashes. Be honest about weaknesses, specific about the chemistry, and constructive: every weakness comes with what to do about it. Refer to the student by first name (${first}). Do not invent anything that is not in the data below.

STUDENT: ${first}, ${Y.yearLabel(year) || "year group unknown"}, studying the ${examBoard} specification. Paper: ${assignment.title} (${assignment.unit || ""}), an HSJ paper sat by students of every board; its topic labels follow the AQA numbering.
Parent's view: current grade ${pq.currentGrade || "not given"}, target grade ${pq.targetGrade || "not given"}${pq.hardestTopics ? `, hardest topics according to the parent: ${pq.hardestTopics}` : ""}${pq.feeling ? `, how they feel about chemistry: ${pq.feeling}` : ""}.
Student's self-evaluation (Red/Amber/Green by topic):
${ragSummary(student.selfEvaluation, board)}

RESULTS
Overall ${nums.headline.score}/${nums.headline.max} (${nums.headline.pct}%). On questions attempted: ${nums.headline.attemptedScore}/${nums.headline.attemptedMax} (${nums.headline.attemptedPct ?? "n/a"}%). Marks on questions left blank: ${nums.headline.blankMarks} (${nums.headline.blankCount} question${nums.headline.blankCount === 1 ? "" : "s"}).${nums.headline.year12 ? ` Year 12 content only: ${nums.headline.year12.score}/${nums.headline.year12.max} (${nums.headline.year12.pct}%).` : ""}${nums.headline.taught ? ` On topics school has taught so far: ${nums.headline.taught.score}/${nums.headline.taught.max} (${nums.headline.taught.pct ?? "n/a"}%); ${nums.headline.taught.notTaughtCount} question${nums.headline.taught.notTaughtCount === 1 ? "" : "s"} (${nums.headline.taught.notTaughtMarks} marks) were on topics not yet taught, so treat the taught-content score as the baseline and do not count those questions against ${first}.` : ""}
By topic area (weakest first):
${nums.byTopic.map(t => `  ${t.area}: ${t.score}/${t.max} (${t.pct}%) · Q${t.questions.join(", Q")}${t.notTaught ? " · not yet taught at school" : ""}`).join("\n")}

QUESTION BY QUESTION
${items.map(it => questionBlock(it, docs[it.questionId], board)).join("\n\n")}

Return ONLY a JSON object, no markdown, with exactly this shape:
{
  "summary": "3 to 5 sentences for the parent and student: where ${first} is now, the one or two things that matter most, and the outlook. Mention the overall score and, where it differs a lot, the score on attempted questions.${nums.headline.taught ? " Lead with the score on topics taught so far and say that the rest of the paper covers content still to come at school." : ""}",
  "wentWell": ["3 to 5 short points naming the specific chemistry or skills that were secure, with the question numbers in brackets"],
  "priorities": [
    { "area": "topic or skill name", "marksRecoverable": 0, "why": "one or two sentences on what went wrong, in the chemistry's own terms", "action": "one or two sentences on exactly what to practise or relearn and how" }
  ],
  "examTechnique": ["2 to 4 points on technique: reading the command word, showing working, units, significant figures, state symbols, using the data given, time, leaving questions blank"],
  "nextSteps": ["3 to 5 concrete steps for the next two to three weeks, in priority order, each one sentence"],
  "questions": [{ "q": 1, "comment": "one sentence on this question: what was credited and what was missing; for a correct answer say so briefly; for a blank question say what it tested; for a topic not yet taught at school, say so and that it will be covered" }]
}
Rules:
- "priorities": 3 to 5 entries, ranked by marks recoverable (the marks lost in that area, highest first). marksRecoverable must be the marks lost there on this paper.
- "questions" must contain one entry for every question, Q1 to Q${items.length}, in order.
- Do not quote mark scheme points word for word. Do not give the answers to the questions.
- Keep every string plain text (no markdown, no bullets inside strings).`;
}

async function callClaude(apiKey, text) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-beta": "server-side-fallback-2026-07-01" },
    body: JSON.stringify({ model: REPORT_MODEL, max_tokens: 6000, output_config: { effort: "medium" }, fallbacks: "default", messages: [{ role: "user", content: text }] }),
  });
  if (!res.ok) throw fb.httpError(502, `Report service returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  if (data.stop_reason === "refusal") throw fb.httpError(502, "The report service declined: " + (data.stop_details?.explanation || ""));
  const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim().replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  try { return JSON.parse(raw); } catch { throw fb.httpError(502, "The report was not valid JSON: " + raw.slice(0, 200)); }
}

const s = (v, n = 2000) => String(v ?? "").trim().slice(0, n);
const list = (v, n = 8) => (Array.isArray(v) ? v : []).map(x => s(x, 600)).filter(Boolean).slice(0, n);

/** A report as stored: the computed numbers plus the tutor-editable text, all bounded. */
function sanitise(r, computed) {
  const base = computed || {};
  const questions = (Array.isArray(r?.questions) ? r.questions : []).map(q => ({ q: Number(q.q) || 0, comment: s(q.comment, 600) }));
  return {
    headline: base.headline || r?.headline || null,
    byTopic: base.byTopic || (Array.isArray(r?.byTopic) ? r.byTopic : []),
    items: base.items || (Array.isArray(r?.items) ? r.items : []),
    summary: s(r?.summary, 3000),
    wentWell: list(r?.wentWell),
    priorities: (Array.isArray(r?.priorities) ? r.priorities : []).slice(0, 6).map(p => ({ area: s(p.area, 120), marksRecoverable: Math.max(0, Number(p.marksRecoverable) || 0), why: s(p.why, 800), action: s(p.action, 800) })),
    examTechnique: list(r?.examTechnique),
    nextSteps: list(r?.nextSteps),
    questions,
  };
}

/** Build the report: numbers from the submission, words from Claude. */
async function generate({ assignment, sub, student, token, apiKey }) {
  const items = scoreItems(assignment, sub, untaughtAqaRefs(student.selfEvaluation, student.board));
  const nums = numbers(assignment, items, student.year);
  const docs = {};
  await Promise.all(items.map(async it => { docs[it.questionId] = await fb.getDocument(`ppq/${it.questionId}`, token).catch(() => null); }));
  const ai = await callClaude(apiKey, prompt({ student, assignment, items, docs, nums, year: student.year }));
  const computed = { headline: nums.headline, byTopic: nums.byTopic, items: items.map(it => ({ n: it.n, q: it.q, title: it.title, score: it.score, max: it.max, attempted: it.attempted, notTaught: !!it.notTaught, topic: it.topics[0] || null })) };
  const report = sanitise(ai, computed);
  // Every question gets a comment slot, in order
  report.questions = computed.items.map(it => ({ q: it.n, comment: (report.questions.find(x => x.q === it.n) || {}).comment || "" }));
  return report;
}

/** The report as the parent sees it in the email (the app renders the same data). */
function html(report, { studentName, title, year, esc }) {
  const h = report.headline || {};
  const first = (studentName || "").trim().split(/\s+/)[0] || "the student";
  const tile = (label, value, sub) => `<td style="padding:8px;vertical-align:top;"><div style="background:#F4F6F9;border-radius:10px;padding:12px 14px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#6b7a8c;">${esc(label)}</div><div style="font-size:22px;font-weight:800;margin-top:2px;">${esc(value)}</div>${sub ? `<div style="font-size:12px;color:#6b7a8c;">${esc(sub)}</div>` : ""}</div></td>`;
  const section = (heading, inner) => `<h2 style="font-size:16px;font-weight:800;margin:24px 0 8px;">${esc(heading)}</h2>${inner}`;
  const ul = (arr) => `<ul style="margin:0;padding-left:20px;">${(arr || []).map(x => `<li style="margin:4px 0;">${esc(x)}</li>`).join("")}</ul>`;
  return `
    <p style="margin:0 0 6px;color:#6b7a8c;font-size:13px;">${esc(title || "Initial diagnostic")}${Y.yearLabel(year) ? ` · ${esc(Y.yearLabel(year))}` : ""}</p>
    <table style="width:100%;border-collapse:collapse;"><tr>
      ${tile("Overall score", `${h.score ?? "–"} / ${h.max ?? "–"}`, h.pct != null ? `${h.pct}%` : "")}
      ${tile("On attempted questions", h.attemptedPct != null ? `${h.attemptedPct}%` : "–", `${h.attemptedScore ?? 0} / ${h.attemptedMax ?? 0}`)}
      ${tile("Left blank", `${h.blankMarks ?? 0} marks`, `${h.blankCount ?? 0} question${h.blankCount === 1 ? "" : "s"}`)}
      ${h.year12 ? tile("Year 12 content", `${h.year12.pct}%`, `${h.year12.score} / ${h.year12.max}`) : ""}
      ${h.taught ? tile("On topics taught so far", h.taught.pct != null ? `${h.taught.pct}%` : "–", `${h.taught.score} / ${h.taught.max} · ${h.taught.notTaughtCount} question${h.taught.notTaughtCount === 1 ? "" : "s"} not yet taught`) : ""}
    </tr></table>
    ${section("Summary", `<p style="margin:0;">${esc(report.summary)}</p>`)}
    ${section("Score by topic area", `<table style="width:100%;border-collapse:collapse;font-size:14px;">${(report.byTopic || []).map(t => `<tr><td style="padding:6px 0;border-bottom:1px solid #E3E8EF;">${esc(t.area)}<span style="color:#6b7a8c;font-size:12px;"> · Q${esc((t.questions || []).join(", Q"))}${t.notTaught ? " · not yet taught at school" : ""}</span></td><td style="padding:6px 0;border-bottom:1px solid #E3E8EF;text-align:right;white-space:nowrap;font-weight:700;color:${t.pct >= 75 ? "#1A7F4B" : t.pct >= 50 ? "#9A5B00" : "#B42318"};">${t.score} / ${t.max} · ${t.pct ?? 0}%</td></tr>`).join("")}</table>`)}
    ${section("What went well", ul(report.wentWell))}
    ${section("Priority areas (ranked by marks recoverable)", (report.priorities || []).map((p, i) => `<div style="margin:0 0 12px;padding:12px 14px;border:1px solid #E3E8EF;border-radius:10px;"><div style="font-weight:800;">${i + 1}. ${esc(p.area)} <span style="color:#B42318;font-weight:700;font-size:13px;">· ${p.marksRecoverable} mark${p.marksRecoverable === 1 ? "" : "s"} recoverable</span></div><div style="margin-top:4px;">${esc(p.why)}</div><div style="margin-top:4px;"><strong>Action:</strong> ${esc(p.action)}</div></div>`).join(""))}
    ${section("Exam technique", ul(report.examTechnique))}
    ${section("Next steps", `<ol style="margin:0;padding-left:20px;">${(report.nextSteps || []).map(x => `<li style="margin:4px 0;">${esc(x)}</li>`).join("")}</ol>`)}
    ${section("Question by question", `<table style="width:100%;border-collapse:collapse;font-size:13px;">${(report.items || []).map(it => { const c = (report.questions || []).find(q => q.q === it.n); return `<tr><td style="padding:6px 0;border-bottom:1px solid #E3E8EF;vertical-align:top;white-space:nowrap;"><strong>Q${it.n}</strong> <span style="color:${it.score >= it.max ? "#1A7F4B" : it.score > 0 ? "#9A5B00" : "#B42318"};font-weight:700;">${it.score}/${it.max}</span></td><td style="padding:6px 0 6px 10px;border-bottom:1px solid #E3E8EF;vertical-align:top;"><div style="color:#6b7a8c;font-size:12px;">${esc(it.title)}${it.attempted ? "" : " · not attempted"}${it.notTaught ? " · not yet taught at school" : ""}</div>${esc(c?.comment || "")}</td></tr>`; }).join("")}</table>`)}
    <p style="margin-top:22px;">${esc(first)}'s tutor will build the first few lessons around the priority areas above. Reply to this email with any questions.</p>`;
}

module.exports = { topicTitle, generate, sanitise, html, scoreItems, numbers };
