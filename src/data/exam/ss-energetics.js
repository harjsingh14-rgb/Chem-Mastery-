/**
 * Hess's law, Born-Haber cycles, enthalpy of solution, entropy and Gibbs
 * free energy drills from the Science Skool worksheets. All data in kJ mol-1
 * unless stated; entropies in J K-1 mol-1.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const kj = (label, marks, q, answer, tol, steps, hints) => ({ label, type: "calc", marks, q, hints, answer, unit: "kJ mol-1", tolerance: tol, steps });

export const SS_ENERGETICS = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-en-001", board: ALL, tags: ["energetics", "hess", "enthalpy", "calculations"], tier: 1, source: SS,
    title: "Hess's law from enthalpies of combustion",
    context: "ΔH(reaction) = Σ ΔHc(reactants) - Σ ΔHc(products).",
    parts: [
      kj("a", 2, "Calculate the standard enthalpy change for C2H4(g) + H2(g) → C2H6(g), given ΔHc: C2H4(g) -1411, H2(g) -286, C2H6(g) -1560.", -137, 2, ["ΔH = (-1411 + -286) - (-1560)", "= -137 kJ mol-1"]),
      kj("b", 2, "Calculate the standard enthalpy change of formation of methane, given ΔHc: CH4(g) -890, H2(g) -286, C(s) -394.", -76, 2, ["C(s) + 2H2(g) → CH4(g)", "ΔH = (-394 + 2 x -286) - (-890) = -76 kJ mol-1"], ["Write the formation equation first: C(s) + 2H2(g) → CH4(g)."]),
    ],
  },
  {
    id: "ss-en-002", board: ALL, tags: ["energetics", "hess", "enthalpy", "calculations"], tier: 1, source: SS,
    title: "Hess's law from enthalpies of formation",
    context: "ΔH(reaction) = Σ ΔHf(products) - Σ ΔHf(reactants). ΔHf of an element in its standard state is zero.",
    parts: [
      kj("a", 2, "Calculate the enthalpy change of combustion of ethene, C2H4, given ΔHf: C2H4(g) +52, CO2(g) -394, H2O(l) -286.", -1412, 3, ["C2H4 + 3O2 → 2CO2 + 2H2O", "ΔH = (2 x -394 + 2 x -286) - (+52) = -1412 kJ mol-1"], ["Balance the combustion equation first."]),
      kj("b", 2, "Calculate the enthalpy change for CaCO3(s) → CaO(s) + CO2(g), given ΔHf: CaCO3(s) -1207, CaO(s) -635, CO2(g) -394.", 178, 2, ["ΔH = (-635 + -394) - (-1207) = +178 kJ mol-1"]),
      kj("c", 2, "Calculate the standard enthalpy change of formation of solid ammonium chloride, given ΔHf: NH3(g) -46.1, HCl(g) -92.3, and ΔH = -176.0 kJ mol-1 for NH3(g) + HCl(g) → NH4Cl(s).", -314.4, 1, ["-176.0 = ΔHf(NH4Cl) - (-46.1 + -92.3)", "ΔHf(NH4Cl) = -176.0 - 138.4 = -314.4 kJ mol-1"]),
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-en-003", board: ALL, tags: ["energetics", "born-haber", "lattice-enthalpy", "calculations"], tier: 2, source: SS,
    title: "Born-Haber cycles for sodium chloride and sodium bromide",
    context: "Lattice enthalpy of formation: M+(g) + X-(g) → MX(s). Data (kJ mol-1): ΔHat(Na) +109; first ionisation enthalpy (Na) +494; ΔHat(Cl) +121; first electron affinity (Cl) -364; ΔHf(NaCl) -411; ΔHat(Br) +112; ΔHf(NaBr) -360; lattice enthalpy of formation (NaBr) -733.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Write the equations, with state symbols, for the enthalpy of atomisation of chlorine and the first electron affinity of chlorine.",
        ms: ["½Cl2(g) → Cl(g)", "Cl(g) + e- → Cl-(g)"] },
      kj("b", 3, "Calculate the lattice enthalpy of formation of sodium chloride.", -771, 2, ["ΔHf = ΔHat(Na) + IE(Na) + ΔHat(Cl) + EA(Cl) + LE", "-411 = 109 + 494 + 121 - 364 + LE", "LE = -771 kJ mol-1"], ["Go round the cycle: formation = atomisation + ionisation + atomisation + electron affinity + lattice enthalpy."]),
      kj("c", 3, "Use the same type of cycle to calculate the first electron affinity of bromine.", -342, 2, ["-360 = 109 + 494 + 112 + EA - 733", "EA = -360 - 109 - 494 - 112 + 733 = -342 kJ mol-1"]),
    ],
  },
  {
    id: "ss-en-004", board: ALL, tags: ["energetics", "born-haber", "lattice-enthalpy", "calculations"], tier: 2, source: SS,
    title: "Born-Haber cycles with a 2+ or 2- ion",
    context: "Data (kJ mol-1). Strontium chloride: ΔHat(Sr) +164; ΔHat(Cl) +121; first IE (Sr) +548; second IE (Sr) +1060; first EA (Cl) -364; lattice enthalpy of formation (SrCl2) -2112. Sodium oxide: ΔHf(Na2O) -416; ΔHat(Na) +109; first IE (Na) +494; ΔHat(O) +248; first EA (O) -142; second EA (O) +844.",
    parts: [
      kj("a", 3, "Calculate the enthalpy change of formation of SrCl2(s).", -826, 3, ["ΔHf = 164 + 2(121) + 548 + 1060 + 2(-364) + (-2112)", "= -826 kJ mol-1"], ["Two chlorine atoms are needed: double the atomisation and electron affinity of chlorine."]),
      { label: "b", type: "short", marks: 2, q: "Explain why the second electron affinity of oxygen is endothermic.",
        ms: ["The electron is being added to a negative ion (O-)", "Energy is needed to overcome the repulsion between the electron and the negative ion"] },
      kj("c", 3, "Calculate the lattice enthalpy of formation of sodium oxide.", -2572, 3, ["-416 = 2(109) + 2(494) + 248 - 142 + 844 + LE", "LE = -416 - 218 - 988 - 248 + 142 - 844 = -2572 kJ mol-1"], ["Two sodium atoms: double the atomisation and ionisation of sodium. Both electron affinities of oxygen are needed."]),
    ],
  },
  {
    id: "ss-en-005", board: ALL, tags: ["energetics", "lattice-enthalpy", "enthalpy-of-solution", "hydration", "calculations"], tier: 2, source: SS,
    title: "Enthalpy of solution cycles",
    context: "ΔH(solution) = -(lattice enthalpy of formation) + Σ ΔH(hydration of ions), or equivalently lattice enthalpy of dissociation + Σ ΔH(hydration).",
    parts: [
      kj("a", 2, "Calculate the enthalpy of solution of NaCl, given the lattice enthalpy of formation of NaCl is -771 kJ mol-1 and the enthalpies of hydration of Na+ and Cl- are -406 and -364 kJ mol-1.", 1, 2, ["ΔHsol = +771 + (-406) + (-364)", "= +1 kJ mol-1"]),
      kj("b", 3, "Calculate the enthalpy of hydration of bromide ions, given ΔHhyd(Ba2+) = -1360 kJ mol-1, the lattice enthalpy of formation of BaBr2 is -1937 kJ mol-1 and the enthalpy of solution of BaBr2 is -38 kJ mol-1.", -308, 3, ["-38 = +1937 - 1360 + 2x", "2x = -615, x = -308 kJ mol-1"], ["There are two bromide ions per formula unit."]),
      kj("c", 3, "Calculate the lattice enthalpy of formation of calcium iodide, given its enthalpy of solution is -120 kJ mol-1 and the enthalpies of hydration of Ca2+ and I- are -1650 and -293 kJ mol-1.", -2116, 3, ["-120 = -LE + (-1650) + 2(-293)", "-LE = -120 + 2236 = +2116, so LE = -2116 kJ mol-1"]),
      kj("d", 2, "Calculate the enthalpy of solution of ammonium chloride, given ΔHhyd(NH4+) = -301, ΔHhyd(Cl-) = -364 and the lattice enthalpy of dissociation of NH4Cl = +640 kJ mol-1.", -25, 2, ["ΔHsol = +640 - 301 - 364 = -25 kJ mol-1"]),
    ],
  },
  {
    id: "ss-en-006", board: ["edexcel", "ocr"], tags: ["thermodynamics", "entropy", "feasibility", "calculations"], tier: 2, source: SS,
    title: "Entropy of the surroundings and total entropy change",
    context: "ΔS(surroundings) = -ΔH / T (ΔH in J mol-1), ΔS(total) = ΔS(system) + ΔS(surroundings). A reaction is feasible if ΔS(total) is positive.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "For 2A(s) + B(g) → C(s) at 350 K, ΔH = +49.5 kJ mol-1 and ΔS(system) = -17.6 J K-1 mol-1. Calculate ΔS(surroundings).",
        answer: -141, unit: "J K-1 mol-1", tolerance: 1, steps: ["ΔSsurr = -49 500 / 350 = -141 J K-1 mol-1"] },
      { label: "b", type: "short", marks: 2, q: "Calculate ΔS(total) for the reaction in (a) and state whether it is feasible at 350 K.",
        ms: ["ΔStotal = -17.6 + (-141) = -159 J K-1 mol-1", "Negative, so not feasible"] },
      { label: "c", type: "calc", marks: 2, q: "For 2D(s) → 2E(s) + F(g) at 900 K, ΔH = +141 kJ mol-1 and ΔS(system) = +230 J K-1 mol-1. Calculate ΔS(surroundings).",
        answer: -157, unit: "J K-1 mol-1", tolerance: 1, steps: ["ΔSsurr = -141 000 / 900 = -157 J K-1 mol-1"] },
      { label: "d", type: "short", marks: 2, q: "Calculate ΔS(total) for the reaction in (c) and state whether it is feasible at 900 K.",
        ms: ["ΔStotal = 230 - 157 = +73 J K-1 mol-1", "Positive, so feasible"] },
    ],
  },
  {
    id: "ss-en-007", board: ["edexcel", "ocr"], tags: ["thermodynamics", "entropy", "hess", "feasibility", "calculations"], tier: 2, source: SS,
    title: "Hydrogenation of benzene: enthalpy and entropy",
    context: "C6H6(l) + 3H2(g) → C6H12(l). ΔHc (kJ mol-1): C6H6(l) -3276, H2(g) -286, C6H12(l) -3920. S° (J K-1 mol-1): C6H6(l) 173, C6H12(l) 204.4, H2(g) 130.6.",
    parts: [
      kj("a", 2, "Calculate the enthalpy change for the hydrogenation of benzene.", -214, 2, ["ΔH = (-3276 + 3 x -286) - (-3920) = -214 kJ mol-1"]),
      { label: "b", type: "calc", marks: 1, q: "Calculate ΔS(surroundings) if the reaction occurs at 330 K.", answer: 648, unit: "J K-1 mol-1", tolerance: 3, steps: ["ΔSsurr = +214 000 / 330 = +648 J K-1 mol-1"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate ΔS(system) from the standard entropy values.", answer: -360.4, unit: "J K-1 mol-1", tolerance: 1, steps: ["ΔSsys = 204.4 - (173 + 3 x 130.6) = -360.4 J K-1 mol-1"] },
      { label: "d", type: "short", marks: 2, q: "Calculate ΔS(total) and comment on the feasibility of the reaction at 330 K.",
        ms: ["ΔStotal = -360.4 + 648 = +288 J K-1 mol-1", "Positive, so the reaction is feasible (thermodynamically) at 330 K, although it may be slow without a catalyst"] },
    ],
  },
  {
    id: "ss-en-008", board: ["edexcel", "ocr"], tags: ["thermodynamics", "entropy", "hess", "feasibility", "calculations"], tier: 2, source: SS,
    title: "Reduction of zinc oxide by carbon monoxide at 1000 K",
    context: "ZnO(s) + CO(g) → Zn(s) + CO2(g). ΔHf (kJ mol-1): ZnO(s) -348, CO(g) -111, Zn(s) 0, CO2(g) -394. S° (J K-1 mol-1): ZnO 43.6, CO 197.6, Zn 41.6, CO2 213.6.",
    parts: [
      kj("a", 2, "Calculate the enthalpy change for the reaction.", 65, 1, ["ΔH = (0 + -394) - (-348 + -111) = +65 kJ mol-1"]),
      { label: "b", type: "calc", marks: 2, q: "Calculate ΔS(system).", answer: 14.0, unit: "J K-1 mol-1", tolerance: 0.5, steps: ["ΔSsys = (41.6 + 213.6) - (43.6 + 197.6) = +14.0 J K-1 mol-1"] },
      { label: "c", type: "calc", marks: 1, q: "Calculate ΔS(surroundings) at 1000 K.", answer: -65, unit: "J K-1 mol-1", tolerance: 0.5, steps: ["ΔSsurr = -65 000 / 1000 = -65 J K-1 mol-1"] },
      { label: "d", type: "short", marks: 2, q: "Calculate ΔS(total) and comment on the feasibility of the reaction at 1000 K.",
        ms: ["ΔStotal = 14.0 - 65 = -51 J K-1 mol-1", "Negative, so not feasible at 1000 K"] },
    ],
  },
  {
    id: "ss-en-009", board: ALL, tags: ["thermodynamics", "gibbs", "entropy", "feasibility", "calculations"], tier: 2, source: SS,
    title: "Gibbs free energy: decomposition of silver(I) oxide",
    context: "2Ag2O(s) → 4Ag(s) + O2(g); ΔH° = +62.0 kJ mol-1, ΔS(system) = +132.8 J K-1 mol-1. ΔG = ΔH - TΔS, with ΔS converted to kJ K-1 mol-1.",
    parts: [
      kj("a", 2, "Calculate ΔG for the reaction at 400 K.", 8.9, 0.3, ["ΔG = 62.0 - 400 x 0.1328 = +8.9 kJ mol-1"]),
      kj("b", 2, "Calculate ΔG for the reaction at 600 K.", -17.7, 0.3, ["ΔG = 62.0 - 600 x 0.1328 = -17.7 kJ mol-1"]),
      { label: "c", type: "short", marks: 2, q: "Comment on the feasibility of the reaction at these two temperatures.",
        ms: ["Not feasible at 400 K because ΔG is positive", "Feasible at 600 K because ΔG is negative"] },
      { label: "d", type: "calc", marks: 2, q: "Calculate the minimum temperature at which silver(I) oxide decomposes.",
        hints: ["Feasible when ΔG = 0, so T = ΔH / ΔS."], answer: 467, unit: "K", tolerance: 2, steps: ["T = 62 000 / 132.8 = 467 K"] },
    ],
  },
  {
    id: "ss-en-010", board: ALL, tags: ["thermodynamics", "gibbs", "entropy", "hess", "feasibility", "calculations"], tier: 2, source: SS,
    title: "Gibbs free energy: group 2 carbonates",
    context: "XCO3(s) → XO(s) + CO2(g). ΔHf (kJ mol-1): MgCO3 -1096, MgO -602, CO2 -394, BaCO3 -1216, BaO -554. S° (J K-1 mol-1): MgCO3 65.7, MgO 26.9, CO2 213.6, BaCO3 112.1, BaO 70.4.",
    parts: [
      kj("a", 2, "Calculate ΔH for the decomposition of magnesium carbonate.", 100, 1, ["ΔH = (-602 + -394) - (-1096) = +100 kJ mol-1"]),
      { label: "b", type: "calc", marks: 1, q: "Calculate ΔS(system) for the decomposition of magnesium carbonate.", answer: 174.8, unit: "J K-1 mol-1", tolerance: 0.5, steps: ["ΔS = (26.9 + 213.6) - 65.7 = +174.8 J K-1 mol-1"] },
      kj("c", 2, "Calculate ΔG at 900 K for the decomposition of magnesium carbonate.", -57.3, 1, ["ΔG = 100 - 900 x 0.1748 = -57.3 kJ mol-1 (feasible)"]),
      kj("d", 3, "Calculate ΔG at 900 K for the decomposition of barium carbonate.", 113.3, 1.5, ["ΔH = (-554 + -394) - (-1216) = +268 kJ mol-1", "ΔS = (70.4 + 213.6) - 112.1 = +171.9 J K-1 mol-1", "ΔG = 268 - 900 x 0.1719 = +113.3 kJ mol-1 (not feasible)"]),
      { label: "e", type: "calc", marks: 2, q: "Calculate the minimum temperature needed to decompose barium carbonate.", answer: 1559, unit: "K", tolerance: 5, steps: ["T = 268 000 / 171.9 = 1559 K (magnesium carbonate: 100 000 / 174.8 = 572 K)"] },
      { label: "f", type: "short", marks: 2, q: "Explain, in terms of the data, why barium carbonate is more thermally stable than magnesium carbonate.",
        ms: ["ΔS(system) is similar for both, but ΔH is much more endothermic for BaCO3", "So a higher temperature is needed before TΔS exceeds ΔH and ΔG becomes negative"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-en-011", board: ALL, tags: ["thermodynamics", "gibbs", "entropy", "feasibility", "calculations"], tier: 3, source: SS,
    title: "ΔG against temperature for copper(II) sulfate",
    context: "When heated strongly, copper(II) sulfate decomposes: CuSO4(s) → CuO(s) + SO3(g). Values of ΔG (kJ mol-1) at different temperatures: 400 K +145; 800 K +71; 1200 K -4; 1600 K -78.",
    dataTable: [["T / K", "400 / 800 / 1200 / 1600"], ["ΔG / kJ mol-1", "+145 / +71 / -4 / -78"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "A graph of ΔG against T is a straight line. State what the gradient and the intercept represent.",
        ms: ["ΔG = ΔH - TΔS, so gradient = -ΔS(system)", "Intercept (at T = 0) = ΔH"] },
      { label: "b", type: "calc", marks: 2, q: "Use the data to calculate ΔS(system) in J K-1 mol-1.",
        answer: 186, unit: "J K-1 mol-1", tolerance: 4, steps: ["Gradient = (-78 - 145) / (1600 - 400) = -0.186 kJ K-1 mol-1", "ΔS = +186 J K-1 mol-1"] },
      kj("c", 2, "Use the data to calculate the enthalpy change for the reaction.", 219, 5, ["Extrapolate to T = 0: ΔH = 145 + 0.186 x 400 = +219 kJ mol-1"]),
      { label: "d", type: "calc", marks: 2, q: "Calculate the minimum temperature at which the decomposition becomes feasible.",
        hints: ["Feasible when ΔG = 0."], answer: 1180, unit: "K", tolerance: 20, steps: ["T = ΔH / ΔS = 219 000 / 186 = 1180 K (where the line crosses ΔG = 0)"] },
    ],
  },
];
