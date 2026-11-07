/**
 * Exam-style questions: one scenario with lettered parts, as in a real paper.
 * Written by HSJ Tuition. See QUESTION_TEMPLATE.md at the project root for the
 * format and how to add a set.
 *
 * Shape (every field below the comment is required unless marked optional):
 * {
 *   id: "bh-001",                 // unique, lowercase, hyphenated
 *   board: ["aqa", "ocr", "edexcel"],   // array of boards, or "both" for all
 *   tags: ["born-haber"],         // sub-topic tags used by the homework builder
 *   tier: 1 | 2 | 3,              // 1 scaffolded, 2 exam standard, 3 unseen or stretch
 *   title: "Lattice enthalpy of caesium fluoride",   // shown in the builder
 *   context: "...",               // optional: scenario or data shared by all parts
 *   dataTable: [["ΔHf", -554], ...],  // optional: [label, value] rows, shown as a table
 *   parts: [
 *     { label: "a", type: "short", marks: 2, q: "Define ...",
 *       hints: ["orient", "method", "first step"],                       // up to 3, never the answer
 *       ms: ["point 1", "point 2"], allow: ["..."], reject: ["..."] },   // allow/reject optional
 *     { label: "b", type: "calc", marks: 3, q: "Calculate ...",
 *       answer: -744, unit: "kJ mol-1", tolerance: 3, steps: ["...", "..."] },
 *     { label: "c", type: "mcq", marks: 1, q: "Which ...",
 *       options: { A: "...", B: "...", C: "...", D: "..." }, answer: "B", explanation: "..." },
 *     { label: "d", type: "extended", marks: 6, q: "Explain ...",
 *       ms: ["indicative point 1", ...], levels: [...optional AQA level descriptors...] },
 *   ],
 * }
 *
 * Marking: mcq and calc parts are marked automatically. short parts (2 to 5
 * marks) go to the AI examiner in point-by-point mode. extended parts (6 or
 * more marks) use levels-of-response marking.
 */

import { BORN_HABER } from "./exam/born-haber";
import { ACIDS_BASES } from "./exam/acids-bases";
import { EQUILIBRIA } from "./exam/equilibria";
import { KINETICS } from "./exam/kinetics";
import { ELECTROCHEMISTRY } from "./exam/electrochemistry";
import { TRANSITION_METALS } from "./exam/transition-metals";
import { ENTROPY_GIBBS } from "./exam/entropy-gibbs";
import { CARBOXYLIC_ACIDS } from "./exam/carboxylic-acids";
import { ALCOHOLS } from "./exam/alcohols";
import { CARBONYLS } from "./exam/carbonyls";
import { ELECTROPHILIC_ADDITION } from "./exam/electrophilic-addition";
import { NUCLEOPHILIC_SUBSTITUTION } from "./exam/nucleophilic-substitution";
import { BORN_HABER_EDEXCEL } from "./exam/born-haber-edexcel";

// One file per topic in src/data/exam/. `board` is an array of board ids
// (["aqa", "ocr", "edexcel"]) or the string "both" for all boards.
export const EXAM_QUESTIONS = [
  ...BORN_HABER,
  ...ACIDS_BASES,
  ...EQUILIBRIA,
  ...KINETICS,
  ...ELECTROCHEMISTRY,
  ...TRANSITION_METALS,
  ...ENTROPY_GIBBS,
  ...CARBOXYLIC_ACIDS,
  ...ALCOHOLS,
  ...CARBONYLS,
  ...ELECTROPHILIC_ADDITION,
  ...NUCLEOPHILIC_SUBSTITUTION,
  ...BORN_HABER_EDEXCEL,
];

/** Marks available for a question (sum of its parts). */
export const questionMarks = (q) => q.parts.reduce((a, p) => a + (p.marks || 0), 0);

/** All distinct tags across the bank, for the builder's topic picker. */
export const EXAM_TAGS = [...new Set(EXAM_QUESTIONS.flatMap(q => q.tags || []))].sort();
