// The eight kinds of lost mark a student logs in their error log (agreed with
// HSJ Tuition, 13 Nov 2026). Mirrored in src/utils/errorLog.js; the examiner
// suggests one of these ids for every answer that loses marks and the
// student confirms or changes it.
const ERROR_TYPES = [
  { id: "knowledge", label: "Knowledge gap", hint: "did not know or recall the chemistry needed" },
  { id: "command", label: "Misread the question", hint: "answered a different question, ignored the command word or a condition given" },
  { id: "incomplete", label: "Incomplete answer", hint: "knew the chemistry but stopped short: a missing step, point or final answer" },
  { id: "calc", label: "Calculation slip", hint: "wrong arithmetic, units, moles, rearrangement, significant figures or sign" },
  { id: "language", label: "Imprecise language", hint: "right idea but vague, loose or non-technical wording that the scheme cannot credit" },
  { id: "diagram", label: "Mechanism or diagram error", hint: "a structure, mechanism, dot-and-cross diagram, graph or apparatus drawing missing a feature" },
  { id: "practical", label: "Practical and data", hint: "a practical method, measurement, error analysis or data-handling point missed" },
  { id: "timing", label: "Not attempted or ran out of time", hint: "left blank or clearly abandoned" },
];

const ERROR_IDS = ERROR_TYPES.map(t => t.id);

/** Prompt text listing the categories for the examiner. */
const ERROR_TYPES_PROMPT = `ERROR TYPE (for the student's error log): when an answer loses marks, say which ONE kind of error best explains the biggest loss, using exactly one of these ids:
${ERROR_TYPES.map(t => `- ${t.id}: ${t.hint}`).join("\n")}
Also give "errorNote": at most 12 words naming the kind of slip in plain exam language, without stating the missing chemistry, value or answer (for example "Units missing from the final answer", "Condition for the reaction not stated"). When the answer earns full marks, set both to null.`;

const cleanErrorType = (v) => (ERROR_IDS.includes(v) ? v : null);
const cleanErrorNote = (v) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : null);

module.exports = { ERROR_TYPES, ERROR_IDS, ERROR_TYPES_PROMPT, cleanErrorType, cleanErrorNote };
