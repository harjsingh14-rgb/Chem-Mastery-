// Pulls homework items from the question banks and resolves them back to
// full questions. Pure functions, no React.
import { CALC_SETS } from "../data/calc-sets";
import { EXTENDED_QUESTIONS } from "../data/extended-questions";
import { EXAM_QUESTIONS, questionMarks } from "../data/exam-questions";
import mcqData from "../mcq-data.json";

// Agreed with HSJ Tuition: homework is budgeted at 1.5 minutes per mark.
export const MIN_PER_MARK = 1.5;
export const minutesFor = (marks) => Math.round(marks * MIN_PER_MARK * 10) / 10;

// Marks per calculation question by difficulty. Calc questions in the bank
// have no marks of their own, so this is the working assumption until HSJ
// confirms or changes it.
export const CALC_MARKS = { easy: 1, medium: 2, hard: 3, exam: 4 };

// Default split of the time budget across the sources the tutor selects.
export const DEFAULT_WEIGHTS = { mcq: 35, calc: 35, extended: 15, exam: 15 };

export const TYPE_LABEL = { mcq: "MCQ", calc: "Calculation", extended: "Extended answer", exam: "Exam question" };

const mcqBoardKey = (board) => board === "ocr" ? "OCR_A" : board === "edexcel" ? "EDEXCEL" : "AQA";
const boardOk = (b, board) => b === "both" || b === board || (Array.isArray(b) && b.includes(board));
export const itemKey = (type, questionId) => `${type}_${String(questionId).replace(/[^A-Za-z0-9]/g, "_")}`;

/** Everything a tutor can pick from for one exam board. */
export function sourcesFor(board) {
  const key = mcqBoardKey(board);
  const mcqTopics = Object.entries(mcqData.topics).map(([id, t]) => ({ id, ...t })).filter(t => t.board === key);
  const calcSets = CALC_SETS.filter(s => boardOk(s.board, board)).map(s => ({ id: s.id, title: s.title, year: s.year, count: s.questions.length }));
  const extCategories = [...new Set(EXTENDED_QUESTIONS.filter(q => boardOk(q.board, board)).map(q => q.category))]
    .map(c => ({ id: c, count: EXTENDED_QUESTIONS.filter(q => boardOk(q.board, board) && q.category === c).length }));
  const examTags = [...new Set(EXAM_QUESTIONS.filter(q => boardOk(q.board, board)).flatMap(q => q.tags || []))]
    .map(t => ({ id: t, count: EXAM_QUESTIONS.filter(q => boardOk(q.board, board) && (q.tags || []).includes(t)).length }));
  return { mcqTopics, calcSets, extCategories, examTags };
}

/** Full question for an assignment item. Returns null if the bank no longer has it. */
export function resolveItem(item) {
  if (item.type === "mcq") {
    const q = mcqData.questions.find(x => x.id === item.questionId);
    return q ? { q, topicLabel: mcqData.topics[q.topic]?.name || q.topic } : null;
  }
  if (item.type === "calc") {
    for (const set of CALC_SETS) {
      const q = set.questions.find(x => x.id === item.questionId);
      if (q) return { q, set, topicLabel: set.title };
    }
    return null;
  }
  if (item.type === "extended") {
    const q = EXTENDED_QUESTIONS.find(x => x.id === item.questionId);
    return q ? { q, topicLabel: q.category } : null;
  }
  if (item.type === "exam") {
    const q = EXAM_QUESTIONS.find(x => x.id === item.questionId);
    return q ? { q, topicLabel: q.title } : null;
  }
  return null;
}

const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function toItem(type, q, extra = {}) {
  const marks = type === "mcq" ? 1
    : type === "calc" ? (CALC_MARKS[q.difficulty] || 2)
    : type === "extended" ? (q.marks || 6)
    : questionMarks(q);
  return { key: itemKey(type, q.id), type, questionId: q.id, marks, minutes: minutesFor(marks), ...extra };
}

/**
 * Fill a time budget from the chosen sources.
 * opts: { board, minutes, mcqTopics: [ids], calcSets: [ids], calcDifficulties: [keys], extCategories: [names], examTags: [tags], weights }
 */
export function buildItems(opts) {
  const { board, minutes } = opts;
  const weights = { ...DEFAULT_WEIGHTS, ...(opts.weights || {}) };
  const pools = {};

  if (opts.mcqTopics?.length) {
    const key = mcqBoardKey(board);
    pools.mcq = shuffle(mcqData.questions.filter(q => opts.mcqTopics.includes(q.topic) && mcqData.topics[q.topic]?.board === key))
      .map(q => toItem("mcq", q, { topic: q.topic, topicLabel: mcqData.topics[q.topic]?.name || q.topic }));
  }
  if (opts.calcSets?.length) {
    const diffs = opts.calcDifficulties?.length ? opts.calcDifficulties : ["easy", "medium", "hard", "exam"];
    const list = [];
    for (const set of CALC_SETS.filter(s => opts.calcSets.includes(s.id))) {
      for (const q of set.questions) if (diffs.includes(q.difficulty)) list.push(toItem("calc", q, { topic: set.id, topicLabel: set.title, difficulty: q.difficulty }));
    }
    // Easy first, then harder: a homework should ramp up
    const order = { easy: 0, medium: 1, hard: 2, exam: 3 };
    pools.calc = shuffle(list).sort((a, b) => (order[a.difficulty] ?? 9) - (order[b.difficulty] ?? 9));
  }
  if (opts.extCategories?.length) {
    pools.extended = shuffle(EXTENDED_QUESTIONS.filter(q => boardOk(q.board, board) && opts.extCategories.includes(q.category)))
      .map(q => toItem("extended", q, { topic: q.category, topicLabel: q.category }));
  }
  if (opts.examTags?.length) {
    pools.exam = shuffle(EXAM_QUESTIONS.filter(q => boardOk(q.board, board) && (q.tags || []).some(t => opts.examTags.includes(t))))
      .sort((a, b) => (a.tier || 2) - (b.tier || 2))
      .map(q => toItem("exam", q, { topic: (q.tags || [])[0] || "exam", topicLabel: q.title, tier: q.tier }));
  }

  const present = Object.keys(pools).filter(k => pools[k].length > 0);
  if (present.length === 0) return [];
  const totalW = present.reduce((a, k) => a + weights[k], 0);
  const items = [];
  for (const k of present) {
    const share = minutes * (weights[k] / totalW);
    let used = 0;
    for (const it of pools[k]) {
      if (items.length > 0 && used > 0 && used + it.minutes > share + 0.5) break;
      items.push(it); used += it.minutes;
      if (used >= share) break;
    }
  }
  // Order: MCQs, then calcs, then exam questions, then extended answers
  const order = { mcq: 0, calc: 1, exam: 2, extended: 3 };
  return items.sort((a, b) => order[a.type] - order[b.type]);
}

export const totals = (items) => ({
  marks: items.reduce((a, it) => a + it.marks, 0),
  minutes: Math.round(items.reduce((a, it) => a + it.minutes, 0)),
  count: items.length,
});

/** Human summary like "15 MCQs · 5 calcs · 1 extended answer". */
export function describeItems(items) {
  const n = {};
  for (const it of items) n[it.type] = (n[it.type] || 0) + 1;
  const parts = [];
  if (n.mcq) parts.push(`${n.mcq} MCQ${n.mcq === 1 ? "" : "s"}`);
  if (n.calc) parts.push(`${n.calc} calc${n.calc === 1 ? "" : "s"}`);
  if (n.exam) parts.push(`${n.exam} exam question${n.exam === 1 ? "" : "s"}`);
  if (n.extended) parts.push(`${n.extended} extended answer${n.extended === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

export const fmtDue = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "No due date";
export const isOverdue = (ms) => !!ms && Date.now() > ms;
