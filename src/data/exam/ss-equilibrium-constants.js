/**
 * Kc calculations from the Science Skool worksheet.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_KC = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-kc-001", board: ALL, tags: ["equilibria", "kc", "calculations"], tier: 1, source: SS,
    title: "Kc from equilibrium concentrations",
    parts: [
      { label: "a", type: "short", marks: 1, q: "Write the expression for Kc for H2(g) + I2(g) ⇌ 2HI(g).", ms: ["Kc = [HI]² / ([H2][I2])"] },
      { label: "b", type: "calc", marks: 2, q: "At equilibrium at 764 K a mixture contains hydrogen 2.484 x 10^-3 mol dm-3, iodine 2.514 x 10^-3 mol dm-3 and hydrogen iodide 1.695 x 10^-2 mol dm-3. Calculate Kc at this temperature.",
        answer: 46.0, unit: "", tolerance: 0.5, steps: ["Kc = (1.695 x 10^-2)² / (2.484 x 10^-3 x 2.514 x 10^-3)", "= 46.0 (no units)"] },
      { label: "c", type: "short", marks: 1, q: "Explain why Kc for this reaction has no units.", ms: ["Two concentration terms on top and two on the bottom, so the units cancel"] },
    ],
  },
  {
    id: "ss-kc-002", board: ALL, tags: ["equilibria", "kc", "calculations"], tier: 1, source: SS,
    title: "Kc from moles reacting",
    context: "Set out an ICE table: initial moles, change, equilibrium moles. Divide by the volume only if the volume is given and does not cancel.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "Exactly 1 mol of ethyl ethanoate was mixed with exactly 1 mol of water (with an acid catalyst) and allowed to reach equilibrium: CH3COOC2H5(l) + H2O(l) ⇌ CH3COOH(l) + C2H5OH(l). The equilibrium mixture contained 0.300 mol of ethanoic acid. Calculate Kc.",
        hints: ["0.300 mol of acid means 0.300 mol of ethanol formed and 0.700 mol of each reactant left.", "The volume cancels (2 terms top and bottom)."],
        answer: 0.184, unit: "", tolerance: 0.004, steps: ["Equilibrium moles: ester 0.700, water 0.700, acid 0.300, ethanol 0.300", "Kc = (0.300 x 0.300) / (0.700 x 0.700) = 0.184"] },
      { label: "b", type: "calc", marks: 3, q: "0.500 mol of B and 0.300 mol of C were mixed in a container of volume 10.0 dm3 at 400 K: B(g) + C(g) ⇌ A(g). At equilibrium there was 0.100 mol of A. Calculate Kc, in dm3 mol-1.",
        hints: ["B left = 0.500 - 0.100; C left = 0.300 - 0.100.", "Divide each by 10.0 dm3 before substituting."],
        answer: 12.5, unit: "dm3 mol-1", tolerance: 0.2, steps: ["Equilibrium: A 0.100, B 0.400, C 0.200 mol", "[A] = 0.0100, [B] = 0.0400, [C] = 0.0200 mol dm-3", "Kc = 0.0100 / (0.0400 x 0.0200) = 12.5 dm3 mol-1"] },
      { label: "c", type: "calc", marks: 3, q: "4.00 mol of A was placed in a 20.0 dm3 container and heated to 320 K: A(g) ⇌ 2B(g). At equilibrium the mixture contained 1.50 mol of A. Calculate Kc, in mol dm-3.",
        hints: ["2.50 mol of A reacted, giving 5.00 mol of B."],
        answer: 0.833, unit: "mol dm-3", tolerance: 0.01, steps: ["Equilibrium: A 1.50 mol, B 5.00 mol", "[A] = 0.0750, [B] = 0.250 mol dm-3", "Kc = 0.250² / 0.0750 = 0.833 mol dm-3"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-kc-003", board: ALL, tags: ["equilibria", "kc", "titration", "calculations"], tier: 2, source: SS,
    title: "Kc for esterification from a titration",
    context: "24.0 g of ethanoic acid and 23.0 g of ethanol were mixed in a stoppered bottle and left to reach equilibrium: CH3COOH(l) + C2H5OH(l) ⇌ CH3COOC2H5(l) + H2O(l). The mixture was then made up to 250 cm3 with water. A 25.0 cm3 sample needed 26.5 cm3 of 0.400 mol dm-3 sodium hydroxide to neutralise the remaining ethanoic acid.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the initial moles of ethanoic acid and of ethanol. Give the moles of ethanol.",
        answer: 0.500, unit: "mol", tolerance: 0.005, steps: ["n(CH3COOH) = 24.0 / 60.0 = 0.400 mol", "n(C2H5OH) = 23.0 / 46.0 = 0.500 mol"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the moles of ethanoic acid remaining at equilibrium in the whole 250 cm3.",
        hints: ["Moles in 25.0 cm3 = 0.400 x 26.5 / 1000, then scale by 10."], answer: 0.106, unit: "mol", tolerance: 0.002, steps: ["In 25.0 cm3: 0.400 x 0.0265 = 0.0106 mol", "In 250 cm3: 0.106 mol"] },
      { label: "c", type: "calc", marks: 3, q: "Calculate Kc for the reaction.",
        hints: ["Acid reacted = 0.400 - 0.106 = 0.294 mol = ester formed = water formed; ethanol left = 0.500 - 0.294."],
        answer: 3.96, unit: "", tolerance: 0.1, steps: ["Equilibrium: acid 0.106, ethanol 0.206, ester 0.294, water 0.294 mol", "Kc = (0.294 x 0.294) / (0.106 x 0.206) = 3.96"] },
      { label: "d", type: "short", marks: 1, q: "Explain why the water added to make the mixture up to 250 cm3 does not affect the calculation.",
        ms: ["The equilibrium is 'frozen' once diluted (reaction is very slow without heating / catalyst) and the titration measures the acid present at that moment; the volume also cancels in Kc"] },
    ],
  },
  {
    id: "ss-kc-004", board: ALL, tags: ["equilibria", "kc", "calculations"], tier: 2, source: SS,
    title: "Equilibrium amounts from Kc",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "For A(l) ⇌ B(l), Kc = 0.0200 at the temperature of the reaction. If 1.00 mol of A is allowed to reach equilibrium, calculate the moles of B formed.",
        hints: ["Let x mol of B form: x / (1.00 - x) = 0.0200."], answer: 0.0196, unit: "mol", tolerance: 0.0005, steps: ["x / (1.00 - x) = 0.0200", "x = 0.0200 - 0.0200x, so 1.02x = 0.0200", "x = 0.0196 mol"] },
      { label: "b", type: "calc", marks: 4, q: "Kc = 36 for 2P(g) ⇌ Q(g) + R(g). Calculate the fraction of P converted into Q and R at equilibrium.",
        hints: ["Start with 1 mol P and let f be the fraction converted: P = 1 - f, Q = R = f/2.", "Kc = (f/2)² / (1 - f)², so take the square root of both sides."],
        answer: 0.923, unit: "", tolerance: 0.01, steps: ["(f/2)² / (1 - f)² = 36", "f / (2(1 - f)) = 6, so f = 12 - 12f", "f = 12/13 = 0.923"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-kc-005", board: ALL, tags: ["equilibria", "kc", "calculations"], tier: 3, source: SS,
    title: "Equilibrium amounts needing a quadratic",
    parts: [
      { label: "a", type: "calc", marks: 5, q: "Kc = 4.0 at 20 °C for E(l) + F(l) ⇌ G(l) + H(l). 2.0 mol of E and 1.0 mol of F are mixed and allowed to reach equilibrium at 20 °C. Calculate the moles of H formed.",
        hints: ["Let x mol of H form: x² / ((2.0 - x)(1.0 - x)) = 4.0.", "Rearrange to 3x² - 12x + 8 = 0 and solve with the quadratic formula; only one root is physically possible."],
        answer: 0.845, unit: "mol", tolerance: 0.01, steps: ["x² = 4.0(2.0 - x)(1.0 - x) = 8 - 12x + 4x²", "3x² - 12x + 8 = 0", "x = (12 - √(144 - 96)) / 6 = 0.845 mol (the other root, 3.15, exceeds the F available)"] },
    ],
  },
];
