/**
 * Kp calculations from the Science Skool worksheet.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_KP = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-kp-001", board: ALL, tags: ["equilibria", "kp", "calculations"], tier: 1, source: SS,
    title: "Kp from partial pressures",
    parts: [
      { label: "a", type: "short", marks: 1, q: "A(g) ⇌ B(g) + C(g). Write the expression for Kp.", ms: ["Kp = p(B) p(C) / p(A)"] },
      { label: "b", type: "calc", marks: 2, q: "At 400 °C the equilibrium partial pressures were A 5.1 kPa, B 95 kPa and C 95 kPa. Calculate Kp, in kPa.",
        answer: 1770, unit: "kPa", tolerance: 20, steps: ["Kp = (95 x 95) / 5.1 = 1770 kPa"] },
      { label: "c", type: "calc", marks: 2, q: "Hydrogen and iodine were heated in a closed container at 1100 K: H2(g) + I2(g) ⇌ 2HI(g). At equilibrium the partial pressures were hydrogen 50 kPa and iodine 50 kPa, and the total pressure was 350 kPa. Calculate Kp.",
        hints: ["p(HI) = total - p(H2) - p(I2)."], answer: 25, unit: "", tolerance: 0.3, steps: ["p(HI) = 350 - 50 - 50 = 250 kPa", "Kp = 250² / (50 x 50) = 25 (no units)"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-kp-002", board: ALL, tags: ["equilibria", "kp", "calculations"], tier: 2, source: SS,
    title: "Kp from mole fractions",
    context: "Partial pressure = mole fraction x total pressure.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "A vessel containing only dinitrogen tetroxide was held at 350 K until equilibrium was established: N2O4(g) ⇌ 2NO2(g). The equilibrium pressure was 123 kPa and the mole fraction of nitrogen dioxide was 0.800. Calculate Kp, in kPa.",
        answer: 394, unit: "kPa", tolerance: 5, steps: ["p(NO2) = 0.800 x 123 = 98.4 kPa; p(N2O4) = 0.200 x 123 = 24.6 kPa", "Kp = 98.4² / 24.6 = 394 kPa"] },
      { label: "b", type: "calc", marks: 4, q: "A 1 : 3 mixture of nitrogen and hydrogen was heated to 700 K at 79 atm over an iron catalyst: N2(g) + 3H2(g) ⇌ 2NH3(g). The equilibrium mixture contained 16% ammonia by volume. Calculate Kp, in atm-2.",
        hints: ["The remaining 84% is still N2 : H2 = 1 : 3, so N2 = 21% and H2 = 63%.", "Convert each percentage to a partial pressure, then substitute."],
        answer: 7.8e-5, unit: "atm-2", tolerance: 0.3e-5, steps: ["p(N2) = 0.21 x 79 = 16.6 atm; p(H2) = 0.63 x 79 = 49.8 atm; p(NH3) = 0.16 x 79 = 12.6 atm", "Kp = 12.6² / (16.6 x 49.8³) = 7.8 x 10^-5 atm-2"] },
      { label: "c", type: "calc", marks: 4, q: "0.200 mol of dinitrogen tetroxide was allowed to reach equilibrium at 25 °C: N2O4(g) ⇌ 2NO2(g). The equilibrium mixture contained 4.60 g of nitrogen dioxide and the equilibrium pressure was 0.431 atm. Calculate Kp, in atm.",
        hints: ["4.60 g NO2 = 0.100 mol, so 0.050 mol N2O4 dissociated and 0.150 mol remains.", "Total moles 0.250."],
        answer: 0.115, unit: "atm", tolerance: 0.004, steps: ["n(NO2) = 4.60 / 46.0 = 0.100 mol; n(N2O4) = 0.200 - 0.050 = 0.150 mol; total 0.250 mol", "p(NO2) = 0.400 x 0.431 = 0.172 atm; p(N2O4) = 0.600 x 0.431 = 0.259 atm", "Kp = 0.172² / 0.259 = 0.115 atm"] },
    ],
  },
  {
    id: "ss-kp-003", board: ALL, tags: ["equilibria", "kp", "calculations"], tier: 2, source: SS,
    title: "Partial pressures from Kp",
    context: "N2O4(g) ⇌ 2NO2(g); Kp = 3.89 atm at 350 K.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "At equilibrium at 350 K the partial pressure of N2O4 was 0.200 atm. Calculate the partial pressure of NO2.",
        answer: 0.882, unit: "atm", tolerance: 0.01, steps: ["p(NO2)² = 3.89 x 0.200 = 0.778", "p(NO2) = 0.882 atm"] },
      { label: "b", type: "calc", marks: 1, q: "Calculate the total pressure of this mixture.", answer: 1.08, unit: "atm", tolerance: 0.02, steps: ["0.200 + 0.882 = 1.08 atm"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-kp-004", board: ALL, tags: ["equilibria", "kp", "calculations"], tier: 3, source: SS,
    title: "Total pressure from Kp and equilibrium moles",
    context: "N2O4(g) ⇌ 2NO2(g); Kp = 3.89 atm at 350 K. 1.00 mol of dinitrogen tetroxide was heated to 350 K in a closed container and the equilibrium mixture contained 0.600 mol of nitrogen dioxide.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the mole fraction of NO2 at equilibrium.",
        answer: 0.462, unit: "", tolerance: 0.005, steps: ["n(N2O4) = 1.00 - 0.300 = 0.700 mol; total 1.30 mol", "x(NO2) = 0.600 / 1.30 = 0.462 (x(N2O4) = 0.538)"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the total pressure at equilibrium.",
        hints: ["Write each partial pressure as mole fraction x P and substitute into Kp; P appears once after cancelling."],
        answer: 9.83, unit: "atm", tolerance: 0.15, steps: ["Kp = (0.462P)² / (0.538P) = 0.396P", "P = 3.89 / 0.396 = 9.83 atm"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the partial pressure of NO2.", answer: 4.54, unit: "atm", tolerance: 0.08, steps: ["p(NO2) = 0.462 x 9.83 = 4.54 atm (p(N2O4) = 5.29 atm)"] },
    ],
  },
];
