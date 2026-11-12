/**
 * Buffer calculations from the Science Skool worksheets (main and extra).
 * pH = pKa + log([salt] / [acid]); for a basic buffer use the pKa of the
 * conjugate acid with [base] / [conjugate acid].
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const ph = (label, marks, q, answer, steps, hints, tol = 0.02) => ({ label, type: "calc", marks, q, hints, answer, unit: "", tolerance: tol, steps });

export const SS_BUFFERS = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-buf-001", board: ALL, tags: ["acids-bases", "buffers", "ph", "ka", "calculations"], tier: 1, source: SS,
    title: "pH of acidic buffers",
    context: "Ka for ethanoic acid = 1.74 x 10^-5 mol dm-3 (pKa 4.76). pKa for propanoic acid = 4.87. pKa for methanoic acid = 3.75.",
    parts: [
      ph("a", 2, "Calculate the pH of a buffer made by making up 1.00 dm3 of solution containing 1.00 mol of ethanoic acid and 1.00 mol of sodium ethanoate.", 4.76, ["[H+] = Ka x [acid] / [salt] = 1.74 x 10^-5 x 1.00 / 1.00", "pH = 4.76 (equal amounts, so pH = pKa)"]),
      ph("b", 3, "Calculate the pH of a buffer containing 0.400 mol of ethanoic acid and 0.500 mol of sodium ethanoate in 1000 cm3 of solution.", 4.86, ["pH = 4.76 + log(0.500 / 0.400)", "= 4.76 + 0.10 = 4.86"]),
      ph("c", 3, "Calculate the pH of a buffer made by mixing 50.0 cm3 of 0.300 mol dm-3 ethanoic acid with 100 cm3 of 0.600 mol dm-3 sodium ethanoate.", 5.36, ["n(acid) = 0.0150 mol; n(salt) = 0.0600 mol (the volume cancels in the ratio)", "pH = 4.76 + log(0.0600 / 0.0150) = 4.76 + 0.60 = 5.36"], ["Work in moles: the two components share the same final volume."]),
      ph("d", 3, "Calculate the pH of a buffer made by mixing 50.0 cm3 of 0.300 mol dm-3 methanoic acid, HCOOH, with 150 cm3 of 0.300 mol dm-3 sodium methanoate.", 4.23, ["n(acid) = 0.0150 mol; n(salt) = 0.0450 mol", "pH = 3.75 + log(3) = 4.23"]),
      ph("e", 4, "Calculate the pH of a buffer made by dissolving 18.5 g of propanoic acid, C2H5COOH, and 12.0 g of sodium propanoate, C2H5COONa, in water and making up to 250 cm3.", 4.57, ["n(acid) = 18.5 / 74.0 = 0.250 mol; n(salt) = 12.0 / 96.0 = 0.125 mol", "pH = 4.87 + log(0.125 / 0.250) = 4.87 - 0.30 = 4.57"], ["Mr: propanoic acid 74.0; sodium propanoate 96.0."]),
    ],
  },
  {
    id: "ss-buf-002", board: ALL, tags: ["acids-bases", "buffers", "ph", "ka", "calculations"], tier: 1, source: SS,
    title: "pH of basic buffers",
    context: "Treat the conjugate acid as the weak acid: pH = pKa(conjugate acid) + log([base] / [conjugate acid]). Ka(NH4+) = 5.62 x 10^-10 mol dm-3 (pKa 9.25). Ka(CH3NH3+) = 2.29 x 10^-11 mol dm-3.",
    parts: [
      ph("a", 3, "Calculate the pH of a buffer containing 1.00 mol dm-3 ammonia and 0.400 mol dm-3 ammonium chloride.", 9.65, ["pKa(NH4+) = -log(5.62 x 10^-10) = 9.25", "pH = 9.25 + log(1.00 / 0.400) = 9.25 + 0.40 = 9.65"]),
      ph("b", 3, "Calculate the pH of a buffer containing 0.100 mol of ammonia and 0.200 mol of ammonium chloride in 250 cm3 of solution.", 8.95, ["pH = 9.25 + log(0.100 / 0.200)", "= 9.25 - 0.30 = 8.95"]),
      ph("c", 3, "Calculate the pH of a buffer made by mixing 100 cm3 of 0.250 mol dm-3 methylamine, CH3NH2, with 100 cm3 of 0.250 mol dm-3 methylammonium chloride, CH3NH3+Cl-.", 10.64, ["pKa(CH3NH3+) = -log(2.29 x 10^-11) = 10.64", "Equal moles of base and conjugate acid, so pH = pKa = 10.64"]),
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-buf-003", board: ALL, tags: ["acids-bases", "buffers", "ph", "ka", "calculations"], tier: 2, source: SS,
    title: "Buffer ratios for a target pH",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "In what ratio of moles (ethanoate : ethanoic acid) should sodium ethanoate and ethanoic acid be mixed to give a buffer of pH 5.00? pKa = 4.76.",
        answer: 1.74, unit: "", tolerance: 0.05, steps: ["log([salt] / [acid]) = 5.00 - 4.76 = 0.24", "[salt] / [acid] = 10^0.24 = 1.74 : 1"] },
      { label: "b", type: "calc", marks: 2, q: "In what ratio of moles (ammonia : ammonium chloride) should ammonia and ammonium chloride be mixed to give a buffer of pH 10.0? pKa(NH4+) = 9.25.",
        answer: 5.62, unit: "", tolerance: 0.1, steps: ["log([NH3] / [NH4+]) = 10.0 - 9.25 = 0.75", "[NH3] / [NH4+] = 10^0.75 = 5.62 : 1"] },
      { label: "c", type: "short", marks: 2, q: "Explain why a buffer works best when the ratio of salt to acid is close to 1.",
        ms: ["There are large and roughly equal reserves of both the weak acid and its conjugate base", "So added acid or alkali changes the ratio (and so the pH) only slightly in either direction"] },
    ],
  },
  {
    id: "ss-buf-004", board: ALL, tags: ["acids-bases", "buffers", "ph", "ka", "calculations"], tier: 2, source: SS,
    title: "Adding acid or alkali to a buffer",
    context: "A buffer contains 1.00 mol of ethanoic acid and 1.00 mol of sodium ethanoate in 1000 cm3 (pH 4.76, Ka = 1.74 x 10^-5 mol dm-3). Added H+ reacts with ethanoate to form ethanoic acid; added OH- reacts with ethanoic acid to form ethanoate.",
    parts: [
      ph("a", 3, "Calculate the pH after adding 1.00 cm3 of 10.0 mol dm-3 hydrochloric acid to the buffer.", 4.75, ["Added H+ = 0.0100 mol: acid 1.01 mol, ethanoate 0.99 mol", "pH = 4.76 + log(0.99 / 1.01) = 4.75"], undefined, 0.015),
      { label: "b", type: "short", marks: 3, q: "100 cm3 of 10.0 mol dm-3 sodium hydroxide is added to a fresh 1000 cm3 of the buffer. Explain what happens to the pH.",
        ms: ["Added OH- = 1.00 mol, which equals all the ethanoic acid present", "All the acid is converted to ethanoate, so the buffer is destroyed / its capacity is exceeded", "The solution is now sodium ethanoate (a weak base), so the pH rises sharply to about 9 to 9.5"] },
      ph("c", 3, "A different buffer contains 1.00 mol dm-3 ammonia and 0.400 mol dm-3 ammonium chloride (pH 9.65, pKa(NH4+) = 9.25). Calculate the pH after adding 5.00 cm3 of 10.0 mol dm-3 hydrochloric acid to 1000 cm3 of this buffer.", 9.57, ["Added H+ = 0.0500 mol: NH3 0.95 mol, NH4+ 0.45 mol", "pH = 9.25 + log(0.95 / 0.45) = 9.57"]),
      ph("d", 3, "Calculate the pH after adding 5.00 cm3 of 10.0 mol dm-3 sodium hydroxide to 1000 cm3 of the ammonia buffer instead.", 9.73, ["Added OH- = 0.0500 mol: NH3 1.05 mol, NH4+ 0.35 mol", "pH = 9.25 + log(1.05 / 0.35) = 9.73"]),
    ],
  },
  {
    id: "ss-buf-005", board: ALL, tags: ["acids-bases", "buffers", "ph", "ka", "calculations"], tier: 2, source: SS,
    title: "Buffer from masses, then small additions",
    context: "A buffer contains 60.0 g of ethanoic acid and 82.0 g of sodium ethanoate in 1000 cm3 of solution. Ka for ethanoic acid = 1.74 x 10^-5 mol dm-3.",
    parts: [
      ph("a", 3, "Calculate the pH of the buffer.", 4.76, ["n(CH3COOH) = 60.0 / 60.0 = 1.00 mol; n(CH3COONa) = 82.0 / 82.0 = 1.00 mol", "Equal moles, so pH = pKa = 4.76"]),
      ph("b", 3, "Calculate the pH after adding 1.00 cm3 of 5.00 mol dm-3 hydrochloric acid to 500 cm3 of the buffer.", 4.75, ["500 cm3 contains 0.500 mol of each; added H+ = 0.00500 mol", "acid 0.505, salt 0.495: pH = 4.76 + log(0.495 / 0.505) = 4.75"], undefined, 0.015),
      ph("c", 3, "Calculate the pH after adding 1.00 cm3 of 5.00 mol dm-3 sodium hydroxide to 500 cm3 of the buffer.", 4.77, ["Added OH- = 0.00500 mol: acid 0.495, salt 0.505", "pH = 4.76 + log(0.505 / 0.495) = 4.77"], undefined, 0.015),
    ],
  },
];
