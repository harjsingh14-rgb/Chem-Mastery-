/**
 * Electrode potentials and balancing redox equations (Science Skool).
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const emf = (label, q, answer, steps) => ({ label, type: "calc", marks: 1, q, answer, unit: "V", tolerance: 0.01, steps });

export const SS_ELECTROCHEMISTRY = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-ec-001", board: ALL, tags: ["redox", "electrode-potentials", "electrochemical-cells", "calculations"], tier: 1, source: SS,
    title: "EMF of cells from standard electrode potentials",
    context: "E(cell) = E(right-hand electrode) - E(left-hand electrode) as written in the cell diagram. E° / V: Al3+/Al -1.66; Cd2+/Cd -0.40; Ag+/Ag +0.80; Cu2+/Cu +0.34; Fe3+/Fe2+ +0.77; Cl2/2Cl- +1.36.",
    parts: [
      emf("a", "Calculate the emf of Al(s) | Al3+(aq) || Cd2+(aq) | Cd(s).", 1.26, ["E = -0.40 - (-1.66) = +1.26 V"]),
      emf("b", "Calculate the emf of Ag(s) | Ag+(aq) || Cu2+(aq) | Cu(s).", -0.46, ["E = +0.34 - (+0.80) = -0.46 V (the cell would run the other way)"]),
      emf("c", "Calculate the emf of Pt(s) | Fe2+(aq), Fe3+(aq) || Cl2(g), 2Cl-(aq) | Pt(s).", 0.59, ["E = +1.36 - (+0.77) = +0.59 V"]),
    ],
  },
  {
    id: "ss-ec-002", board: ALL, tags: ["redox", "electrode-potentials", "electrochemical-cells", "calculations"], tier: 1, source: SS,
    title: "Unknown electrode potentials from cell emfs",
    context: "E° / V: Ni2+/Ni -0.25; Mg2+/Mg -2.37; Cd2+/Cd -0.40.",
    parts: [
      emf("a", "E(cell) = -0.49 V for Ni(s) | Ni2+(aq) || Cr3+(aq) | Cr(s). Calculate E° for Cr3+/Cr.", -0.74, ["-0.49 = E(Cr3+/Cr) - (-0.25)", "E(Cr3+/Cr) = -0.74 V"]),
      emf("b", "E(cell) = -2.11 V for Pt(s) | V2+(aq), V3+(aq) || Mg2+(aq) | Mg(s). Calculate E° for V3+/V2+.", -0.26, ["-2.11 = -2.37 - E(V3+/V2+)", "E(V3+/V2+) = -0.26 V"]),
      emf("c", "E(cell) = +0.79 V for Mn(s) | Mn2+(aq) || Cd2+(aq) | Cd(s). Calculate E° for Mn2+/Mn.", -1.19, ["+0.79 = -0.40 - E(Mn2+/Mn)", "E(Mn2+/Mn) = -1.19 V"]),
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-ec-003", board: ALL, tags: ["redox", "electrode-potentials", "feasibility"], tier: 2, source: SS,
    title: "Feasibility from electrode potentials",
    context: "A reaction is feasible if E(cell) for the reaction as written is positive: the species with the more positive E° is reduced. E° / V: Al3+/Al -1.66; Co2+/Co -0.28; Na+/Na -2.71; Mg2+/Mg -2.37; Br2/2Br- +1.07; Cl2/2Cl- +1.36; Fe3+/Fe2+ +0.77.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Is 3Co2+(aq) + 2Al(s) → 3Co(s) + 2Al3+(aq) feasible? Justify your answer with a calculation.",
        ms: ["E(cell) = -0.28 - (-1.66) = +1.38 V", "Positive, so feasible"] },
      { label: "b", type: "short", marks: 2, q: "Is 2Na+(aq) + Mg(s) → 2Na(s) + Mg2+(aq) feasible? Justify your answer with a calculation.",
        ms: ["E(cell) = -2.71 - (-2.37) = -0.34 V", "Negative, so not feasible (magnesium is a weaker reducing agent than sodium)"] },
      { label: "c", type: "short", marks: 2, q: "Is 2Br-(aq) + Cl2(g) → Br2(l) + 2Cl-(aq) feasible? Justify your answer with a calculation.",
        ms: ["E(cell) = +1.36 - (+1.07) = +0.29 V", "Positive, so feasible"] },
    ],
  },
  {
    id: "ss-ec-004", board: ALL, tags: ["redox", "electrode-potentials", "feasibility", "oxidising-agents"], tier: 2, source: SS,
    title: "Choosing an oxidising agent",
    context: "E° / V: MnO4-/Mn2+ (acidified) +1.51; Cl2/2Cl- +1.36; Cr2O72-/2Cr3+ (acidified) +1.33; O2 + 4H+ / 2H2O +1.23; Br2/2Br- +1.07.",
    parts: [
      { label: "a", type: "short", marks: 3, q: "Acidified potassium manganate(VII) and acidified potassium dichromate(VI) are both oxidising agents. Are either, or both, strong enough to oxidise chloride ions to chlorine? Explain.",
        ms: ["To oxidise Cl- the oxidising agent needs E° more positive than +1.36 V", "MnO4- (+1.51 V) can: E(cell) = +0.15 V", "Cr2O72- (+1.33 V) cannot: E(cell) = -0.03 V"] },
      { label: "b", type: "short", marks: 3, q: "Water can be oxidised to oxygen: 2H2O → O2 + 4H+ + 4e-. Which of acidified manganate(VII), chlorine, acidified dichromate(VI) and bromine can oxidise water in this way? Explain.",
        ms: ["The oxidising agent must have E° more positive than +1.23 V", "MnO4- (+1.51), Cl2 (+1.36) and Cr2O72- (+1.33) can", "Br2 (+1.07) cannot"] },
      { label: "c", type: "short", marks: 1, q: "Suggest why acidified potassium manganate(VII) solutions can be stored in the laboratory although they are thermodynamically able to oxidise water.", ms: ["The reaction is very slow (high activation energy): feasibility says nothing about rate"] },
    ],
  },
  {
    id: "ss-ec-005", board: ALL, tags: ["redox", "half-equations", "balancing-redox"], tier: 2, source: SS,
    title: "Balancing redox equations",
    context: "Balance each equation using oxidation numbers or half-equations. Add H+ and H2O (acidic conditions) or OH- and H2O (where OH- appears) as needed.",
    parts: [
      { label: "a", type: "short", marks: 1, q: "SO2(g) + HNO2(aq) → H2SO4(aq) + NO(g)", ms: ["SO2 + 2HNO2 → H2SO4 + 2NO"] },
      { label: "b", type: "short", marks: 1, q: "Al(s) + H2SO4(aq) → Al2(SO4)3(aq) + H2(g)", ms: ["2Al + 3H2SO4 → Al2(SO4)3 + 3H2"] },
      { label: "c", type: "short", marks: 1, q: "Au3+(aq) + I-(aq) → Au(s) + I2(s)", ms: ["2Au3+ + 6I- → 2Au + 3I2"] },
      { label: "d", type: "short", marks: 2, q: "S2-(aq) + I2(s) → SO42-(aq) + I-(aq) (acidic conditions)", ms: ["S2- + 4H2O → SO42- + 8H+ + 8e- and I2 + 2e- → 2I-", "S2- + 4I2 + 4H2O → SO42- + 8I- + 8H+"] },
      { label: "e", type: "short", marks: 2, q: "H2O2(aq) + ClO4-(aq) → O2(g) + ClO2-(aq) (acidic conditions)", ms: ["H2O2 → O2 + 2H+ + 2e- and ClO4- + 4H+ + 4e- → ClO2- + 2H2O", "2H2O2 + ClO4- → 2O2 + ClO2- + 2H2O"] },
      { label: "f", type: "short", marks: 2, q: "Br2(aq) + OH-(aq) → Br-(aq) + BrO3-(aq)", ms: ["Bromine is both oxidised (0 to +5) and reduced (0 to -1): disproportionation", "3Br2 + 6OH- → 5Br- + BrO3- + 3H2O"] },
      { label: "g", type: "short", marks: 2, q: "Mn(s) + HNO3(aq) → Mn2+(aq) + NO2(g)", ms: ["Mn → Mn2+ + 2e- and NO3- + 2H+ + e- → NO2 + H2O", "Mn + 4H+ + 2NO3- → Mn2+ + 2NO2 + 2H2O (or Mn + 4HNO3 → Mn(NO3)2 + 2NO2 + 2H2O)"] },
      { label: "h", type: "short", marks: 2, q: "I2(s) + OCl-(aq) → IO3-(aq) + Cl-(aq)", ms: ["I2 + 6H2O → 2IO3- + 12H+ + 10e- and OCl- + 2H+ + 2e- → Cl- + H2O", "I2 + 5OCl- + H2O → 2IO3- + 5Cl- + 2H+"] },
      { label: "i", type: "short", marks: 2, q: "Cr2O72-(aq) + HNO2(aq) → Cr3+(aq) + NO3-(aq)", ms: ["Cr2O72- + 14H+ + 6e- → 2Cr3+ + 7H2O and HNO2 + H2O → NO3- + 3H+ + 2e-", "Cr2O72- + 3HNO2 + 5H+ → 2Cr3+ + 3NO3- + 4H2O"] },
      { label: "j", type: "short", marks: 2, q: "CrO42-(aq) + S2-(aq) → Cr(OH)3(s) + S(s) (alkaline conditions)", ms: ["CrO42- + 4H2O + 3e- → Cr(OH)3 + 5OH- and S2- → S + 2e-", "2CrO42- + 3S2- + 8H2O → 2Cr(OH)3 + 3S + 10OH-"] },
    ],
  },
];
