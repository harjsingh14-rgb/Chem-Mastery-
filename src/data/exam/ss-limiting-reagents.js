/**
 * Limiting reagent problems from the Science Skool worksheet. Ar values: H 1.0,
 * C 12.0, N 14.0, O 16.0, Na 23.0, Si 28.1, P 31.0, S 32.1, Br 79.9.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_LIMITING_REAGENTS = [
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-lim-001", board: ALL, tags: ["moles", "limiting-reagent", "calculations", "reacting-masses"], tier: 2, source: SS,
    title: "Limiting reagent: ammonia and oxygen",
    context: "Ammonia is oxidised by oxygen: 4NH3 + 5O2 → 4NO + 6H2O. In an experiment, 3.25 g of NH3 is allowed to react with 3.50 g of O2.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Identify the limiting reagent. Show your working.",
        ms: ["n(NH3) = 3.25 / 17.0 = 0.191 mol; n(O2) = 3.50 / 32.0 = 0.109 mol", "0.191 mol NH3 would need 0.239 mol O2 (ratio 4 : 5), so O2 is the limiting reagent"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the mass of NO formed.",
        hints: ["Use the moles of the limiting reagent: n(NO) = 4/5 x n(O2)."], answer: 2.63, unit: "g", tolerance: 0.05, steps: ["n(NO) = 0.109 x 4/5 = 0.0875 mol", "m = 0.0875 x 30.0 = 2.63 g"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the mass of the excess reactant remaining after the reaction.",
        hints: ["NH3 used = 4/5 x n(O2); subtract from the moles you started with."], answer: 1.76, unit: "g", tolerance: 0.05, steps: ["NH3 used = 0.0875 mol; remaining = 0.191 - 0.0875 = 0.104 mol", "m = 0.104 x 17.0 = 1.76 g"] },
    ],
  },
  {
    id: "ss-lim-002", board: ALL, tags: ["moles", "limiting-reagent", "calculations", "reacting-masses"], tier: 2, source: SS,
    title: "Limiting reagent: combustion of ethene",
    context: "4.95 g of ethene, C2H4, is combusted with 3.25 g of oxygen: C2H4 + 3O2 → 2CO2 + 2H2O.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Identify the limiting reagent. Show your working.",
        ms: ["n(C2H4) = 4.95 / 28.0 = 0.177 mol; n(O2) = 3.25 / 32.0 = 0.102 mol", "0.177 mol C2H4 would need 0.530 mol O2, so O2 is limiting"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the mass of CO2 formed.",
        answer: 2.98, unit: "g", tolerance: 0.05, steps: ["n(CO2) = 0.102 x 2/3 = 0.0677 mol", "m = 0.0677 x 44.0 = 2.98 g"] },
    ],
  },
  {
    id: "ss-lim-003", board: ALL, tags: ["moles", "limiting-reagent", "percentage-yield", "calculations", "organic"], tier: 2, source: SS,
    title: "Theoretical and percentage yield of bromobenzene",
    context: "Benzene reacts with bromine: C6H6 + Br2 → C6H5Br + HBr. 42.1 g of C6H6 reacts with 73.0 g of Br2.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "Calculate the theoretical yield of C6H5Br.",
        hints: ["Find the moles of each reactant; the smaller number is the limiting reagent (1 : 1 ratio).", "Mr(C6H5Br) = 157.0."],
        answer: 71.7, unit: "g", tolerance: 0.5, steps: ["n(C6H6) = 42.1 / 78.0 = 0.540 mol; n(Br2) = 73.0 / 159.8 = 0.457 mol, so Br2 is limiting", "Theoretical yield = 0.457 x 157.0 = 71.7 g"] },
      { label: "b", type: "calc", marks: 1, q: "The actual yield of C6H5Br is 63.6 g. Calculate the percentage yield.",
        answer: 88.7, unit: "%", tolerance: 0.5, steps: ["63.6 / 71.7 x 100 = 88.7%"] },
    ],
  },
  {
    id: "ss-lim-004", board: ALL, tags: ["moles", "limiting-reagent", "percentage-yield", "calculations", "organic"], tier: 2, source: SS,
    title: "Percentage yield with three reactants",
    parts: [
      { label: "a", type: "calc", marks: 4, q: "C4H9OH + NaBr + H2SO4 → C4H9Br + NaHSO4 + H2O. 15.0 g of C4H9OH reacts with 22.4 g of NaBr and 32.7 g of H2SO4 to give 17.1 g of C4H9Br. Calculate the percentage yield.",
        hints: ["Mr: C4H9OH 74.0; NaBr 102.9; H2SO4 98.1; C4H9Br 136.9.", "The reactant with the fewest moles is limiting (all 1 : 1)."],
        answer: 61.6, unit: "%", tolerance: 0.6, steps: ["n(C4H9OH) = 0.203 mol; n(NaBr) = 0.218 mol; n(H2SO4) = 0.333 mol, so butan-1-ol is limiting", "Theoretical yield = 0.203 x 136.9 = 27.8 g", "17.1 / 27.8 x 100 = 61.6%"] },
      { label: "b", type: "calc", marks: 3, q: "Silicon nitride, Si3N4, is made by heating silicon with an excess of nitrogen: 3Si + 2N2 → Si3N4. Calculate the mass of silicon needed to prepare 125 g of silicon nitride if the percentage yield is 95.0%.",
        hints: ["Theoretical mass needed = 125 / 0.950.", "Mr(Si3N4) = 140.3."],
        answer: 79.1, unit: "g", tolerance: 0.8, steps: ["Theoretical Si3N4 = 125 / 0.950 = 131.6 g = 0.938 mol", "n(Si) = 3 x 0.938 = 2.81 mol", "m = 2.81 x 28.1 = 79.1 g"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-lim-005", board: ALL, tags: ["moles", "limiting-reagent", "percentage-yield", "calculations"], tier: 3, source: SS,
    title: "The souring of wine",
    context: "Wine sours when ethanol is oxidised by oxygen: C2H5OH + O2 → CH3COOH + H2O. A 1.00 dm3 bottle of wine labelled 8.5% ethanol by volume has a defective seal. Analysis of 1.00 cm3 shows it contains 0.0274 g of ethanoic acid. Density of ethanol = 0.816 g cm-3.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "Calculate the mass of oxygen that must have leaked into the bottle.",
        hints: ["Total ethanoic acid = 0.0274 x 1000 g; Mr = 60.0.", "1 mol O2 per mol of ethanoic acid."],
        answer: 14.6, unit: "g", tolerance: 0.2, steps: ["Ethanoic acid = 27.4 g = 27.4 / 60.0 = 0.457 mol", "n(O2) = 0.457 mol", "m = 0.457 x 32.0 = 14.6 g"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the percentage yield for the conversion of ethanol to ethanoic acid, assuming oxygen is in excess.",
        hints: ["Ethanol volume = 85 cm3; mass = volume x density; Mr = 46.0."],
        answer: 30.3, unit: "%", tolerance: 0.5, steps: ["Ethanol = 85 x 0.816 = 69.4 g = 1.51 mol", "Maximum ethanoic acid = 1.51 mol; actual = 0.457 mol", "0.457 / 1.51 x 100 = 30.3%"] },
    ],
  },
  {
    id: "ss-lim-006", board: ALL, tags: ["moles", "limiting-reagent", "calculations"], tier: 3, source: SS,
    title: "Two-stage oxidation of phosphorus",
    context: "A container holds 5.77 g of P4 and 5.77 g of O2. P4 + 3O2 → P4O6, and if enough oxygen is available, P4O6 + 2O2 → P4O10. Assume all the oxygen that reacts ends up in P4O10.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Identify the limiting reagent for the formation of P4O10. Show your working.",
        ms: ["Overall P4 + 5O2 → P4O10; n(P4) = 5.77 / 124.0 = 0.0465 mol; n(O2) = 5.77 / 32.0 = 0.180 mol", "0.0465 mol P4 would need 0.233 mol O2, so O2 is limiting"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the mass of P4O10 produced.",
        hints: ["Mr(P4O10) = 284.0."], answer: 10.2, unit: "g", tolerance: 0.2, steps: ["n(P4O10) = 0.180 / 5 = 0.0361 mol", "m = 0.0361 x 284.0 = 10.2 g"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the mass of excess reactant left in the container.",
        answer: 1.30, unit: "g", tolerance: 0.05, steps: ["P4 used = 0.0361 mol; left = 0.0465 - 0.0361 = 0.0105 mol", "m = 0.0105 x 124.0 = 1.30 g"] },
    ],
  },
];
