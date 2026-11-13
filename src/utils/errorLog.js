// The student's error log: every lost mark filed under one of eight kinds of
// error (agreed with HSJ Tuition, 13 Nov 2026). The AI examiner suggests a
// kind, the student confirms or changes it, and the question comes back for a
// retest two weeks later. Pure helpers, no React. The ids mirror
// api/_errorTypes.js, which the examiners use for their suggestion.

export const RETEST_DAYS = 14;
export const DAY_MS = 24 * 60 * 60 * 1000;

export const ERROR_TYPES = [
  { id: "knowledge", label: "Knowledge gap", short: "Knowledge", tone: "red",
    advice: "Go back to the notes or flashcards for this topic before you retest it. The chemistry itself was missing, so revising the content comes first." },
  { id: "command", label: "Misread the question", short: "Misread", tone: "amber",
    advice: "Underline the command word and every condition in the question before writing. Ask: what exactly is being asked, and how many marks is it worth?" },
  { id: "incomplete", label: "Incomplete answer", short: "Incomplete", tone: "amber",
    advice: "Match the number of points you make to the marks available, and always finish with the final answer, unit or conclusion the question asked for." },
  { id: "calc", label: "Calculation slip", short: "Calculation", tone: "indigo",
    advice: "Set out every step with units, check the rearrangement, and round only at the end to the significant figures of the data given." },
  { id: "language", label: "Imprecise language", short: "Language", tone: "amber",
    advice: "Use the exact technical terms the mark scheme uses. Say which species, which bond, which electrons, and avoid words like it, this or stuff." },
  { id: "diagram", label: "Mechanism or diagram error", short: "Diagram", tone: "indigo",
    advice: "Check every feature the examiner looks for: curly arrows from the right place, lone pairs, charges, dipoles, labelled axes and apparatus." },
  { id: "practical", label: "Practical and data", short: "Practical", tone: "indigo",
    advice: "Revisit the required practical this came from: the method, the measurements taken, the sources of error and how the data is processed." },
  { id: "timing", label: "Not attempted or ran out of time", short: "Timing", tone: "neutral",
    advice: "Practise this kind of question against the clock. Leaving a part blank always scores zero, so write something for every part." },
];

export const ERROR_TYPE_BY_ID = Object.fromEntries(ERROR_TYPES.map(t => [t.id, t]));
export const typeLabel = (id) => ERROR_TYPE_BY_ID[id]?.label || "Lost marks";
export const typeShort = (id) => ERROR_TYPE_BY_ID[id]?.short || "Other";

/** The category to suggest when the examiner gave none (auto-marked MCQs and calculations). */
export function defaultType(itemType, attempted = true) {
  if (!attempted) return "timing";
  if (itemType === "calc" || itemType === "calculation") return "calc";
  if (itemType === "draw") return "diagram";
  return "knowledge";
}

/** One entry per question part per source; logging the same slip twice updates the first. */
export const entryKey = ({ source, questionId, partLabel }) => `${source || "revision"}:${questionId}:${partLabel || ""}`;

export const isDue = (e, now = Date.now()) => e.status === "open" && (e.retestDue || 0) <= now;

/** Counts and groupings for the cards. */
export function summariseLog(entries, now = Date.now()) {
  const list = entries || [];
  const open = list.filter(e => e.status === "open");
  const due = open.filter(e => isDue(e, now)).sort((a, b) => (a.retestDue || 0) - (b.retestDue || 0));
  const fixed = list.filter(e => e.status === "fixed");
  const byType = ERROR_TYPES.map(t => ({
    ...t,
    n: list.filter(e => e.category === t.id).length,
    open: open.filter(e => e.category === t.id).length,
    marks: list.filter(e => e.category === t.id).reduce((x, e) => x + (e.marksLost || 0), 0),
  })).filter(t => t.n > 0).sort((a, b) => b.n - a.n || b.marks - a.marks);
  const recent = [...list].sort((a, b) => (b.clientTime || 0) - (a.clientTime || 0));
  return { total: list.length, open, due, fixed, byType, top: byType[0] || null, recent };
}

export const fmtDay = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";
