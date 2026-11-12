/**
 * Orders of reaction from initial-rate tables (Science Skool worksheet 1).
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_RATE_ORDERS = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-ord-001", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 1, source: SS,
    title: "Using a rate equation",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "The reaction between P and Q has the rate equation rate = k[P][Q]². The rate constant is 1.60 x 10^-6 mol-2 dm6 s-1. Calculate the rate when [P] = 0.15 mol dm-3 and [Q] = 0.30 mol dm-3.",
        answer: 2.16e-8, unit: "mol dm-3 s-1", tolerance: 0.03e-8, steps: ["rate = 1.60 x 10^-6 x 0.15 x 0.30² = 2.16 x 10^-8 mol dm-3 s-1"] },
      { label: "b", type: "calc", marks: 2, q: "A reaction between N and M is first order with respect to each. k = 0.048 mol-1 dm3 s-1. If [N] = 0.10 mol dm-3, calculate the concentration of M needed to give a rate of 2.4 x 10^-4 mol dm-3 s-1.",
        answer: 0.050, unit: "mol dm-3", tolerance: 0.001, steps: ["[M] = rate / (k[N]) = 2.4 x 10^-4 / (0.048 x 0.10) = 0.050 mol dm-3"] },
    ],
  },
  {
    id: "ss-ord-002", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 1, source: SS,
    title: "Orders from a table with two reactants",
    dataTable: [["Experiment", "1 / 2 / 3"], ["[A] / mol dm-3", "0.10 / 0.20 / 0.30"], ["[B] / mol dm-3", "0.10 / 0.10 / 0.20"], ["Rate of loss of A / mol dm-3 s-1", "2.5 x 10^-5 / 2.5 x 10^-5 / 5.0 x 10^-5"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Deduce the order with respect to A and with respect to B.",
        ms: ["Experiments 1 and 2: [A] doubles, rate unchanged, so zero order in A", "Experiments 2 and 3: [B] doubles (A has no effect), rate doubles, so first order in B"] },
      { label: "b", type: "short", marks: 1, q: "Write the rate equation and state the overall order.", ms: ["rate = k[B]; overall first order"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 2.5e-4, unit: "s-1", tolerance: 0.05e-4, steps: ["k = 2.5 x 10^-5 / 0.10 = 2.5 x 10^-4 s-1"] },
    ],
  },
  {
    id: "ss-ord-003", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 1, source: SS,
    title: "Orders where both concentrations change together",
    dataTable: [["Experiment", "1 / 2 / 3"], ["[A] / mol dm-3", "0.10 / 0.10 / 0.30"], ["[B] / mol dm-3", "0.10 / 0.20 / 0.30"], ["Rate of loss of A / mol dm-3 s-1", "1.0 x 10^-3 / 2.0 x 10^-3 / 9.0 x 10^-3"]],
    parts: [
      { label: "a", type: "short", marks: 3, q: "Deduce the order of reaction with respect to A and with respect to B. Show your reasoning.",
        ms: ["Experiments 1 and 2: [B] doubles, rate doubles, so first order in B", "Experiments 1 and 3: both triple and the rate goes up by 9; B accounts for x3, so A accounts for x3", "First order in A"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 0.10, unit: "dm3 mol-1 s-1", tolerance: 0.002, steps: ["k = 1.0 x 10^-3 / (0.10 x 0.10) = 0.10 dm3 mol-1 s-1"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-ord-004", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Orders with three reactants",
    dataTable: [["Experiment", "1 / 2 / 3 / 4"], ["[A] / mol dm-3", "0.1 / 0.2 / 0.2 / 0.1"], ["[B] / mol dm-3", "0.1 / 0.1 / 0.2 / 0.1"], ["[C] / mol dm-3", "0.1 / 0.1 / 0.1 / 0.2"], ["Rate of loss of A / mol dm-3 s-1", "2.0 x 10^-4 / 4.0 x 10^-4 / 1.6 x 10^-3 / 2.0 x 10^-4"]],
    parts: [
      { label: "a", type: "short", marks: 3, q: "Deduce the order of reaction with respect to A, B and C.",
        ms: ["Experiments 1 and 2: [A] doubles, rate doubles, first order in A", "Experiments 2 and 3: [B] doubles, rate x4, second order in B", "Experiments 1 and 4: [C] doubles, no change, zero order in C"] },
      { label: "b", type: "short", marks: 1, q: "Write the rate equation and state the overall order.", ms: ["rate = k[A][B]²; overall third order"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 0.20, unit: "dm6 mol-2 s-1", tolerance: 0.005, steps: ["k = 2.0 x 10^-4 / (0.1 x 0.1²) = 0.20 dm6 mol-2 s-1"] },
    ],
  },
  {
    id: "ss-ord-005", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Orders with three reactants: zero order reactant",
    dataTable: [["Experiment", "1 / 2 / 3 / 4"], ["[A] / mol dm-3", "0.010 / 0.010 / 0.020 / 0.020"], ["[B] / mol dm-3", "0.020 / 0.010 / 0.020 / 0.020"], ["[C] / mol dm-3", "0.0050 / 0.0050 / 0.0050 / 0.015"], ["Rate of loss of A / mol dm-3 s-1", "1.4 x 10^-6 / 7.0 x 10^-7 / 1.4 x 10^-6 / 4.2 x 10^-6"]],
    parts: [
      { label: "a", type: "short", marks: 3, q: "Deduce the order of reaction with respect to A, B and C.",
        ms: ["Experiments 1 and 2: [B] halves, rate halves, first order in B", "Experiments 1 and 3: [A] doubles, no change, zero order in A", "Experiments 3 and 4: [C] triples, rate triples, first order in C"] },
      { label: "b", type: "short", marks: 1, q: "Write the rate equation and state the overall order.", ms: ["rate = k[B][C]; overall second order"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 0.014, unit: "dm3 mol-1 s-1", tolerance: 0.0005, steps: ["k = 1.4 x 10^-6 / (0.020 x 0.0050) = 0.014 dm3 mol-1 s-1"] },
    ],
  },
  {
    id: "ss-ord-006", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Second order in one reactant, zero in the other",
    dataTable: [["Experiment", "1 / 2 / 3"], ["[A] / mol dm-3", "0.12 / 0.36 / 0.36"], ["[B] / mol dm-3", "0.04 / 0.04 / 0.20"], ["Rate of loss of A / mol dm-3 s-1", "9.0 x 10^-5 / 8.1 x 10^-4 / 8.1 x 10^-4"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Deduce the order with respect to A and with respect to B.",
        ms: ["Experiments 1 and 2: [A] x3, rate x9, second order in A", "Experiments 2 and 3: [B] x5, no change, zero order in B"] },
      { label: "b", type: "calc", marks: 2, q: "Write the rate equation and calculate the rate constant.", answer: 6.25e-3, unit: "dm3 mol-1 s-1", tolerance: 0.1e-3, steps: ["rate = k[A]²", "k = 9.0 x 10^-5 / 0.12² = 6.25 x 10^-3 dm3 mol-1 s-1"] },
    ],
  },
  {
    id: "ss-ord-007", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Completing a rate table",
    context: "The rate equation for the reaction between D and E is rate = k[D][E]². Experiment 1: [D] = 0.100, [E] = 0.100 mol dm-3, rate = 1.2 x 10^-5 mol dm-3 s-1.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 1.2e-2, unit: "dm6 mol-2 s-1", tolerance: 0.02e-2, steps: ["k = 1.2 x 10^-5 / (0.100 x 0.100²) = 1.2 x 10^-2 dm6 mol-2 s-1"] },
      { label: "b", type: "calc", marks: 1, q: "Experiment 2: [D] = 0.200 and [E] = 0.100 mol dm-3. Calculate the rate.", answer: 2.4e-5, unit: "mol dm-3 s-1", tolerance: 0.05e-5, steps: ["Doubling [D] doubles the rate: 2.4 x 10^-5 mol dm-3 s-1"] },
      { label: "c", type: "calc", marks: 2, q: "Experiment 3: [D] = 0.100 mol dm-3 and the rate is 1.08 x 10^-4 mol dm-3 s-1. Calculate [E].", answer: 0.300, unit: "mol dm-3", tolerance: 0.005, steps: ["[E]² = 1.08 x 10^-4 / (1.2 x 10^-2 x 0.100) = 0.0900", "[E] = 0.300 mol dm-3"] },
      { label: "d", type: "calc", marks: 2, q: "Experiment 4: [E] = 0.100 mol dm-3 and the rate is 6.00 x 10^-5 mol dm-3 s-1. Calculate [D].", answer: 0.500, unit: "mol dm-3", tolerance: 0.005, steps: ["[D] = 6.00 x 10^-5 / (1.2 x 10^-2 x 0.100²) = 0.500 mol dm-3"] },
    ],
  },
];
