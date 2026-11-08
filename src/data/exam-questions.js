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
import { AROMATIC } from "./exam/aromatic";
import { AMINES } from "./exam/amines";
import { ENERGETICS } from "./exam/energetics";
import { GROUP_2 } from "./exam/group-2";
import { HALOGENS } from "./exam/halogens";
import { PERIOD_3 } from "./exam/period-3";
import { SPECTROSCOPY } from "./exam/spectroscopy";
import { ATOMIC_STRUCTURE } from "./exam/atomic-structure";
import { BONDING } from "./exam/bonding";
import { AMOUNT_OF_SUBSTANCE } from "./exam/amount-of-substance";
import { REDOX } from "./exam/redox";
import { ORGANIC_ANALYSIS } from "./exam/organic-analysis";
import { ALKANES } from "./exam/alkanes";
import { REACTION_RATES } from "./exam/reaction-rates";
import { AQUEOUS_IONS } from "./exam/aqueous-ions";
import { TM_OXIDATION_STATES } from "./exam/tm-oxidation-states";
import { POLYMERS } from "./exam/polymers";
import { AMINO_ACIDS_PROTEINS } from "./exam/amino-acids-proteins";
import { ORGANIC_SYNTHESIS } from "./exam/organic-synthesis";

// One file per topic in src/data/exam/. `board` is an array of board ids
// (["aqa", "ocr", "edexcel"]) or the string "both" for all boards.
// Each set is labelled with the topic the homework builder groups it under,
// in the order the topics are taught: physical, inorganic, organic.
const withTopic = (topic, qs) => qs.map(q => ({ ...q, topic }));

export const EXAM_QUESTIONS = [
  ...withTopic("Atomic structure", ATOMIC_STRUCTURE),
  ...withTopic("Amount of substance", AMOUNT_OF_SUBSTANCE),
  ...withTopic("Bonding and shapes", BONDING),
  ...withTopic("Energetics", ENERGETICS),
  ...withTopic("Reaction rates", REACTION_RATES),
  ...withTopic("Equilibria, Kc and Kp", EQUILIBRIA),
  ...withTopic("Redox", REDOX),
  ...withTopic("Born-Haber cycles", BORN_HABER),
  ...withTopic("Lattice energy (Edexcel)", BORN_HABER_EDEXCEL),
  ...withTopic("Entropy and Gibbs", ENTROPY_GIBBS),
  ...withTopic("Rate equations", KINETICS),
  ...withTopic("Electrode potentials and cells", ELECTROCHEMISTRY),
  ...withTopic("Acids, bases and buffers", ACIDS_BASES),
  ...withTopic("Periodicity and Period 3", PERIOD_3),
  ...withTopic("Group 2", GROUP_2),
  ...withTopic("Halogens", HALOGENS),
  ...withTopic("Transition metals: complexes", TRANSITION_METALS),
  ...withTopic("Transition metals: oxidation states", TM_OXIDATION_STATES),
  ...withTopic("Aqueous ions and inorganic tests", AQUEOUS_IONS),
  ...withTopic("Organic basics and analysis", ORGANIC_ANALYSIS),
  ...withTopic("Alkanes", ALKANES),
  ...withTopic("Alkenes", ELECTROPHILIC_ADDITION),
  ...withTopic("Halogenoalkanes", NUCLEOPHILIC_SUBSTITUTION),
  ...withTopic("Alcohols", ALCOHOLS),
  ...withTopic("Aldehydes and ketones", CARBONYLS),
  ...withTopic("Carboxylic acids and esters", CARBOXYLIC_ACIDS),
  ...withTopic("Aromatic chemistry", AROMATIC),
  ...withTopic("Amines", AMINES),
  ...withTopic("Amino acids and proteins", AMINO_ACIDS_PROTEINS),
  ...withTopic("Polymers", POLYMERS),
  ...withTopic("Organic synthesis and techniques", ORGANIC_SYNTHESIS),
  ...withTopic("NMR and chromatography", SPECTROSCOPY),
];

/** Topic labels in teaching order, for the builder's picker. */
export const EXAM_TOPICS = [...new Set(EXAM_QUESTIONS.map(q => q.topic))];

/** Marks available for a question (sum of its parts). */
export const questionMarks = (q) => q.parts.reduce((a, p) => a + (p.marks || 0), 0);

/** All distinct tags across the bank, for the builder's topic picker. */
export const EXAM_TAGS = [...new Set(EXAM_QUESTIONS.flatMap(q => q.tags || []))].sort();
