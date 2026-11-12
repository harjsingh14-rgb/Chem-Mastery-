/**
 * pH calculations from the Science Skool worksheet.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const ph = (label, q, answer, steps, hints) => ({ label, type: "calc", marks: 1, q, hints, answer, unit: "", tolerance: 0.02, steps });

export const SS_ACIDS = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-ph-001", board: ALL, tags: ["acids-bases", "ph", "calculations"], tier: 1, source: SS,
    title: "pH and hydrogen ion concentration",
    context: "pH = -log10[H+] and [H+] = 10^-pH.",
    parts: [
      ph("a", "Calculate the pH of a solution in which [H+] = 0.01 mol dm-3.", 2.00, ["pH = -log(0.01) = 2.00"]),
      ph("b", "Calculate the pH of a solution in which [H+] = 7.50 x 10^-10 mol dm-3.", 9.12, ["pH = -log(7.50 x 10^-10) = 9.12"]),
      ph("c", "Calculate the pH of a solution in which [H+] = 3.00 x 10^-4 mol dm-3.", 3.52, ["pH = -log(3.00 x 10^-4) = 3.52"]),
      { label: "d", type: "calc", marks: 1, q: "Calculate [H+] in mol dm-3 for a solution of pH 1.20.", answer: 0.0631, unit: "mol dm-3", tolerance: 0.001, steps: ["[H+] = 10^-1.20 = 0.0631 mol dm-3"] },
      { label: "e", type: "calc", marks: 1, q: "Calculate [H+] in mol dm-3 for a solution of pH 8.40.", answer: 3.98e-9, unit: "mol dm-3", tolerance: 0.05e-9, steps: ["[H+] = 10^-8.40 = 3.98 x 10^-9 mol dm-3"] },
      { label: "f", type: "calc", marks: 1, q: "Calculate [H+] in mol dm-3 for a solution of pH 13.0.", answer: 1.0e-13, unit: "mol dm-3", tolerance: 0.02e-13, steps: ["[H+] = 10^-13 = 1.0 x 10^-13 mol dm-3"] },
    ],
  },
  {
    id: "ss-ph-002", board: ALL, tags: ["acids-bases", "ph", "kw", "calculations"], tier: 1, source: SS,
    title: "pH of strong acids and strong bases",
    context: "Kw = [H+][OH-] = 1.00 x 10^-14 mol2 dm-6 at 298 K unless stated.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the pH of 0.01 mol dm-3 sulfuric acid, H2SO4, assuming it is fully dissociated.", hints: ["Each H2SO4 gives two H+."], answer: 1.70, unit: "", tolerance: 0.02, steps: ["[H+] = 2 x 0.01 = 0.02 mol dm-3", "pH = -log(0.02) = 1.70"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the pH of pure water at 15 °C, where Kw = 4.52 x 10^-15 mol2 dm-6.", hints: ["In pure water [H+] = [OH-] = √Kw."], answer: 7.17, unit: "", tolerance: 0.02, steps: ["[H+] = √(4.52 x 10^-15) = 6.72 x 10^-8 mol dm-3", "pH = 7.17"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the pH of 0.10 mol dm-3 sodium hydroxide solution.", answer: 13.00, unit: "", tolerance: 0.02, steps: ["[H+] = Kw / [OH-] = 1.0 x 10^-14 / 0.10 = 1.0 x 10^-13", "pH = 13.00"] },
      { label: "d", type: "calc", marks: 2, q: "Calculate the pH of 0.0150 mol dm-3 calcium hydroxide solution, Ca(OH)2.", hints: ["Each Ca(OH)2 gives two OH-."], answer: 12.48, unit: "", tolerance: 0.02, steps: ["[OH-] = 0.0300 mol dm-3", "[H+] = 1.0 x 10^-14 / 0.0300 = 3.33 x 10^-13; pH = 12.48"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-ph-003", board: ALL, tags: ["acids-bases", "ph", "ka", "weak-acids", "calculations"], tier: 2, source: SS,
    title: "pH of weak acids",
    context: "For a weak acid HA: Ka = [H+][A-] / [HA] ≈ [H+]² / [HA], so [H+] = √(Ka x c). pKa = -log Ka.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "Calculate the pH of 0.01 mol dm-3 ethanoic acid (Ka = 1.74 x 10^-5 mol dm-3).", answer: 3.38, unit: "", tolerance: 0.02, steps: ["[H+] = √(1.74 x 10^-5 x 0.01) = 4.17 x 10^-4 mol dm-3", "pH = 3.38"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the pH of 0.05 mol dm-3 methanoic acid, HCOOH, given that its pKa is 3.75.", hints: ["Ka = 10^-pKa first."], answer: 2.53, unit: "", tolerance: 0.02, steps: ["Ka = 10^-3.75 = 1.78 x 10^-4 mol dm-3", "[H+] = √(1.78 x 10^-4 x 0.05) = 2.98 x 10^-3; pH = 2.53"] },
      { label: "c", type: "short", marks: 2, q: "State two assumptions made in the calculation in (a).",
        ms: ["[H+] = [A-] (ignores H+ from water)", "[HA] at equilibrium = initial concentration (dissociation is negligible)"] },
    ],
  },
];
