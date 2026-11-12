/**
 * Rate equations, orders of reaction and the Arrhenius equation from the
 * Science Skool worksheets.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_KINETICS_A2 = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-kin-001", board: ALL, tags: ["rates", "rate-equations", "orders", "definitions"], tier: 1, source: SS,
    title: "Rate of reaction and the effect of conditions on k",
    parts: [
      { label: "a", type: "short", marks: 1, q: "Explain what is meant by the term rate of reaction.", ms: ["The change in concentration of a reactant or product per unit time"] },
      { label: "b", type: "short", marks: 2, q: "State and explain the effect of increasing the temperature on the rate of a reaction and on the rate constant, k.",
        ms: ["Rate increases: more molecules have energy greater than or equal to the activation energy, so more frequent successful collisions", "k increases (k depends on temperature)"] },
      { label: "c", type: "short", marks: 2, q: "State and explain the effect of increasing the concentration of a reactant (that appears in the rate equation) on the rate and on k.",
        ms: ["Rate increases: more frequent collisions", "k is unchanged (k is independent of concentration)"] },
      { label: "d", type: "short", marks: 2, q: "State and explain the effect of adding a catalyst on the rate and on k.",
        ms: ["Rate increases: an alternative route with lower activation energy, so more collisions have enough energy", "k increases (a larger proportion of collisions are successful at the same concentrations)"] },
      { label: "e", type: "short", marks: 1, q: "State the effect of increasing the pressure of a gaseous reaction on k.", ms: ["No change (pressure increases concentration, not k)"] },
    ],
  },
  {
    id: "ss-kin-002", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 1, source: SS,
    title: "Orders from initial-rate data",
    context: "Initial rates for 2A + B → 2C + D.",
    dataTable: [["Experiment", "1 / 2 / 3"], ["[A] / mol dm-3", "0.01 / 0.02 / 0.01"], ["[B] / mol dm-3", "0.20 / 0.20 / 0.40"], ["Initial rate / mol dm-3 s-1", "0.10 / 0.20 / 0.40"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Deduce the order of reaction with respect to A and with respect to B.",
        ms: ["Experiments 1 and 2: [A] doubles, rate doubles, so first order with respect to A", "Experiments 1 and 3: [B] doubles, rate x4, so second order with respect to B"] },
      { label: "b", type: "short", marks: 1, q: "State the overall order of reaction.", ms: ["Third order (1 + 2)"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the rate constant, k, and give its units in your working.",
        hints: ["rate = k[A][B]²; use experiment 1."], answer: 250, unit: "dm6 mol-2 s-1", tolerance: 2, steps: ["k = 0.10 / (0.01 x 0.20²) = 250 dm6 mol-2 s-1"] },
      { label: "d", type: "calc", marks: 1, q: "Calculate the rate when [A] and [B] are both 0.01 mol dm-3.",
        answer: 2.5e-4, unit: "mol dm-3 s-1", tolerance: 0.05e-4, steps: ["rate = 250 x 0.01 x 0.01² = 2.5 x 10^-4 mol dm-3 s-1"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-kin-003", board: ALL, tags: ["rates", "rate-equations", "orders", "rate-determining-step", "calculations"], tier: 2, source: SS,
    title: "Rate equation and rate-determining step",
    context: "2NO(g) + H2(g) → N2O(g) + H2O(g).",
    dataTable: [["Initial [NO] / mol dm-3", "0.60 / 1.20 / 1.20"], ["Initial [H2] / mol dm-3", "0.37 / 0.37 / 0.74"], ["Initial rate / mol dm-3 s-1", "3.0 x 10^-3 / 1.2 x 10^-2 / 1.2 x 10^-2"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Deduce the rate equation.",
        ms: ["[NO] doubles, rate x4: second order in NO; [H2] doubles, no change: zero order in H2", "rate = k[NO]²"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 8.3e-3, unit: "dm3 mol-1 s-1", tolerance: 0.1e-3, steps: ["k = 3.0 x 10^-3 / 0.60² = 8.3 x 10^-3 dm3 mol-1 s-1"] },
      { label: "c", type: "short", marks: 2, q: "What can you deduce about the rate-determining step of the reaction?",
        ms: ["Two molecules of NO are involved in (or before) the rate-determining step", "H2 is not involved until after the rate-determining step"] },
    ],
  },
  {
    id: "ss-kin-004", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Rate equation where two concentrations change at once",
    context: "PCl3 + Cl2 → PCl5.",
    dataTable: [["Experiment", "1 / 2 / 3"], ["[PCl3] / mol dm-3", "0.36 / 0.36 / 0.72"], ["[Cl2] / mol dm-3", "1.26 / 0.63 / 2.52"], ["Rate / mol dm-3 s-1", "6.0 x 10^-4 / 1.5 x 10^-4 / 4.8 x 10^-3"]],
    parts: [
      { label: "a", type: "short", marks: 3, q: "Deduce the rate equation. Show your reasoning.",
        ms: ["Experiments 1 and 2: [Cl2] halves, rate falls by a factor of 4, so second order in Cl2", "Experiments 1 and 3: [PCl3] x2 and [Cl2] x2 gives rate x8; the Cl2 change accounts for x4, so PCl3 is first order", "rate = k[PCl3][Cl2]²"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 1.05e-3, unit: "dm6 mol-2 s-1", tolerance: 0.03e-3, steps: ["k = 6.0 x 10^-4 / (0.36 x 1.26²) = 1.05 x 10^-3 dm6 mol-2 s-1"] },
    ],
  },
  {
    id: "ss-kin-005", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Rate constant from five experiments",
    context: "X + 3Y → XY3.",
    dataTable: [["Experiment", "1 / 2 / 3 / 4 / 5"], ["[X] / mol dm-3", "0.100 / 0.100 / 0.100 / 0.200 / 0.300"], ["[Y] / mol dm-3", "0.100 / 0.200 / 0.300 / 0.100 / 0.100"], ["Initial rate / mol dm-3 s-1", "0.00200 / 0.00798 / 0.01805 / 0.00399 / 0.00601"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Deduce the orders with respect to X and Y.",
        ms: ["Experiments 1, 4, 5: rate is proportional to [X], first order in X", "Experiments 1, 2, 3: rate x4 and x9 when [Y] x2 and x3, second order in Y"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 2.00, unit: "dm6 mol-2 s-1", tolerance: 0.05, steps: ["k = 0.00200 / (0.100 x 0.100²) = 2.00 dm6 mol-2 s-1"] },
    ],
  },
  {
    id: "ss-kin-006", board: ALL, tags: ["rates", "rate-equations", "orders", "calculations"], tier: 2, source: SS,
    title: "Rate equation for hydrogen and nitrogen monoxide",
    context: "2NO(g) + 2H2(g) → N2(g) + 2H2O(g) at 673 K.",
    dataTable: [["Experiment", "1 / 2 / 3"], ["[H2] / mol dm-3", "2.0 x 10^-3 / 3.0 x 10^-3 / 6.0 x 10^-3"], ["[NO] / mol dm-3", "6.0 x 10^-3 / 6.0 x 10^-3 / 1.0 x 10^-3"], ["Initial rate / mol dm-3 s-1", "6.0 x 10^-3 / 9.0 x 10^-3 / 0.5 x 10^-3"]],
    parts: [
      { label: "a", type: "short", marks: 3, q: "Deduce the rate equation. Show your reasoning.",
        ms: ["Experiments 1 and 2: [H2] x1.5, rate x1.5, first order in H2", "Experiment 1 to 3: [H2] x3 would give 18 x 10^-3; [NO] falls by 6 and the rate falls by 36, so second order in NO", "rate = k[H2][NO]²"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the rate constant.", answer: 8.3e4, unit: "dm6 mol-2 s-1", tolerance: 0.2e4, steps: ["k = 6.0 x 10^-3 / (2.0 x 10^-3 x (6.0 x 10^-3)²) = 8.3 x 10^4 dm6 mol-2 s-1"] },
    ],
  },
  {
    id: "ss-kin-007", board: ALL, tags: ["rates", "arrhenius", "activation-energy", "calculations"], tier: 2, source: SS,
    title: "The Arrhenius equation",
    context: "k = A e^(-Ea/RT), so ln k = ln A - Ea/RT. R = 8.31 J K-1 mol-1.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "The decomposition of N2O5 at 308 K has a rate constant of 1.35 x 10^-4 s-1 and an Arrhenius constant of 4.79 x 10^13 s-1. Calculate the activation energy, in kJ mol-1.",
        hints: ["Ea = RT ln(A / k)."], answer: 103, unit: "kJ mol-1", tolerance: 1.5, steps: ["Ea = 8.31 x 308 x ln(4.79 x 10^13 / 1.35 x 10^-4)", "= 8.31 x 308 x 40.4 = 103 000 J mol-1 = 103 kJ mol-1"] },
      { label: "b", type: "calc", marks: 3, q: "The same reaction at another temperature has a rate constant of 2.4 x 10^-3 s-1 and an Arrhenius constant of 6.22 x 10^13 s-1. Using your activation energy from (a), calculate this temperature.",
        hints: ["T = Ea / (R ln(A / k))."], answer: 329, unit: "K", tolerance: 4, steps: ["ln(A / k) = ln(6.22 x 10^13 / 2.4 x 10^-3) = 37.8", "T = 103 000 / (8.31 x 37.8) = 329 K"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-kin-008", board: ALL, tags: ["rates", "arrhenius", "activation-energy", "graphs", "calculations"], tier: 3, source: SS,
    title: "Arrhenius plot from rate constants at several temperatures",
    context: "Rate constants for a reaction at different temperatures are given. A plot of ln k against 1/T is a straight line of gradient -Ea/R and intercept ln A.",
    dataTable: [["T / K", "150 / 200 / 250 / 300 / 350 / 400"], ["k / s-1", "4.59 x 10^-48 / 2.44 x 10^-36 / 5.90 x 10^-29 / 9.60 x 10^-24 / 1.05 x 10^-20 / 4.25 x 10^-18"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "State what should be plotted on each axis to obtain a straight line, and what the gradient represents.",
        ms: ["ln k (y axis) against 1/T (x axis)", "Gradient = -Ea / R"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the values of ln k at 150 K and 400 K and hence the gradient of the line, in K.",
        answer: -16600, unit: "K", tolerance: 500, steps: ["ln k: -109.0 at 150 K (1/T = 6.67 x 10^-3); -40.0 at 400 K (1/T = 2.50 x 10^-3)", "Gradient = (-40.0 - (-109.0)) / (2.50 x 10^-3 - 6.67 x 10^-3) = -1.66 x 10^4 K"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the activation energy, in kJ mol-1.", answer: 138, unit: "kJ mol-1", tolerance: 5, steps: ["Ea = -gradient x R = 1.66 x 10^4 x 8.31 = 138 000 J mol-1 = 138 kJ mol-1"] },
      { label: "d", type: "short", marks: 2, q: "Explain how the Arrhenius constant, A, could be found from the graph, and estimate its value.",
        ms: ["A = e^(intercept on the ln k axis), i.e. extrapolate to 1/T = 0", "ln A ≈ 1.7, so A ≈ 5 s-1 (accept 3 to 10 s-1)"] },
    ],
  },
];
