/**
 * Avogadro's constant, isotopic abundance and time-of-flight calculations
 * from the Science Skool worksheets. L = 6.022 x 10^23 mol-1.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_ATOMIC_CALCS = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-atc-001", board: ALL, tags: ["moles", "avogadro", "calculations"], tier: 1, source: SS,
    title: "Avogadro's constant",
    context: "Number of particles = moles x L, where L = 6.022 x 10^23 mol-1. Ar values: H 1.0, C 12.0, O 16.0, Mg 24.3.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the number of water molecules in 9.0 g of water.",
        answer: 3.01e23, unit: "molecules", tolerance: 0.05e23, steps: ["n = 9.0 / 18.0 = 0.50 mol", "0.50 x 6.022 x 10^23 = 3.01 x 10^23 molecules"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the number of atoms in 11.0 g of propane, C3H8.",
        hints: ["Each propane molecule contains 11 atoms."], answer: 1.66e24, unit: "atoms", tolerance: 0.03e24, steps: ["n = 11.0 / 44.0 = 0.250 mol of molecules", "0.250 x 11 = 2.75 mol of atoms", "2.75 x 6.022 x 10^23 = 1.66 x 10^24 atoms"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the mass of magnesium that contains the same number of magnesium atoms as there are molecules of CO2 in 1000 g of carbon dioxide.",
        hints: ["Equal numbers of particles means equal numbers of moles."], answer: 552, unit: "g", tolerance: 5, steps: ["n(CO2) = 1000 / 44.0 = 22.7 mol", "m(Mg) = 22.7 x 24.3 = 552 g"] },
    ],
  },
  {
    id: "ss-atc-002", board: ALL, tags: ["atomic-structure", "isotopes", "mass-spectrometry", "calculations"], tier: 1, source: SS,
    title: "Isotopic abundance from relative atomic mass",
    context: "Let the fraction of the lighter isotope be x; then the heavier is (1 - x). Set the weighted mean equal to the relative atomic mass.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Nitrogen has two isotopes, 14N and 15N. The relative atomic mass of nitrogen is 14.007. Calculate the percentage abundance of 14N.",
        answer: 99.3, unit: "%", tolerance: 0.1, steps: ["14x + 15(1 - x) = 14.007", "15 - x = 14.007, so x = 0.993", "14N = 99.3%, 15N = 0.7%"] },
      { label: "b", type: "calc", marks: 2, q: "Copper has two isotopes, 63Cu and 65Cu, and a relative atomic mass of 63.546. Calculate the percentage abundance of 63Cu.",
        answer: 72.7, unit: "%", tolerance: 0.2, steps: ["63x + 65(1 - x) = 63.546", "65 - 2x = 63.546, so x = 0.727", "63Cu = 72.7%, 65Cu = 27.3%"] },
      { label: "c", type: "calc", marks: 3, q: "Lead has three isotopes, 206Pb, 207Pb and 208Pb. 207Pb and 208Pb are present in equal amounts and the relative atomic mass is 207.19. Calculate the percentage abundance of 206Pb.",
        hints: ["Let 207Pb = 208Pb = y, so 206Pb = 1 - 2y."], answer: 20.6, unit: "%", tolerance: 0.3, steps: ["206(1 - 2y) + 207y + 208y = 207.19", "206 + 3y = 207.19, so y = 0.397", "206Pb = 1 - 0.794 = 20.6% (207Pb and 208Pb 39.7% each)"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-atc-003", board: ALL, tags: ["atomic-structure", "isotopes", "mass-spectrometry", "calculations"], tier: 2, source: SS,
    title: "Isotopic abundance with three or four isotopes",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "A sample of silicon consists of 28Si, 29Si and 30Si. The relative atomic mass is 28.0855 and the abundance of 29Si is 4.67%. Calculate the percentage abundance of 28Si.",
        hints: ["28Si + 30Si = 95.33%. Let 28Si = a and 30Si = 95.33 - a."],
        answer: 93.4, unit: "%", tolerance: 0.2, steps: ["28a + 29(4.67) + 30(95.33 - a) = 2808.55", "28a + 135.43 + 2859.9 - 30a = 2808.55", "2a = 186.78, a = 93.4% (30Si = 1.9%)"] },
      { label: "b", type: "calc", marks: 3, q: "A sample of iron contains 54Fe (8.536%), 56Fe (90.007%), 57Fe and 58Fe. Its relative atomic mass is 55.845. Calculate the percentage abundance of 57Fe.",
        hints: ["57Fe + 58Fe = 1.457%."],
        answer: 1.34, unit: "%", tolerance: 0.05, steps: ["54(8.536) + 56(90.007) = 5501.34", "57a + 58(1.457 - a) = 5584.5 - 5501.34 = 83.16", "84.51 - a = 83.16, so a = 1.34% (58Fe = 0.12%)"] },
    ],
  },
  {
    id: "ss-atc-004", board: ["aqa"], tags: ["atomic-structure", "mass-spectrometry", "time-of-flight", "calculations"], tier: 2, source: SS,
    title: "Time-of-flight mass spectrometry: velocity of ions",
    context: "In a time-of-flight mass spectrometer every ion is given the same kinetic energy: KE = ½mv², so v = √(2KE / m). Masses must be in kg (mass of one ion = Ar x 10^-3 / L). L = 6.022 x 10^23 mol-1.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the velocity of an ion of mass 2.1 x 10^-25 kg which has a kinetic energy of 1.21 x 10^-17 J.",
        answer: 1.07e4, unit: "m s-1", tolerance: 200, steps: ["v = √(2 x 1.21 x 10^-17 / 2.1 x 10^-25)", "= 1.07 x 10^4 m s-1"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the velocity of an ion of mass 2.1 x 10^-20 g which has a kinetic energy of 2.16 x 10^-19 J.",
        hints: ["Convert the mass to kg first."], answer: 143, unit: "m s-1", tolerance: 3, steps: ["m = 2.1 x 10^-23 kg", "v = √(2 x 2.16 x 10^-19 / 2.1 x 10^-23) = 143 m s-1"] },
      { label: "c", type: "calc", marks: 3, q: "Calculate the velocity of a 24Mg+ ion which has a kinetic energy of 1.21 x 10^-17 J.",
        hints: ["Mass of one ion = 24 x 10^-3 / 6.022 x 10^23 kg."], answer: 2.46e4, unit: "m s-1", tolerance: 400, steps: ["m = 0.024 / 6.022 x 10^23 = 3.99 x 10^-26 kg", "v = √(2 x 1.21 x 10^-17 / 3.99 x 10^-26) = 2.46 x 10^4 m s-1"] },
    ],
  },
  {
    id: "ss-atc-005", board: ["aqa"], tags: ["atomic-structure", "mass-spectrometry", "time-of-flight", "calculations"], tier: 2, source: SS,
    title: "Time-of-flight mass spectrometry: distance and time",
    context: "KE = ½mv² and distance = velocity x time. Mass of one ion = Ar x 10^-3 / L, with L = 6.022 x 10^23 mol-1.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "Calculate the distance travelled by a 23Na+ ion which has a kinetic energy of 1.1 x 10^-19 J and a time of flight of 0.001 s.",
        answer: 2.40, unit: "m", tolerance: 0.05, steps: ["m = 0.023 / 6.022 x 10^23 = 3.82 x 10^-26 kg", "v = √(2 x 1.1 x 10^-19 / 3.82 x 10^-26) = 2400 m s-1", "d = 2400 x 0.001 = 2.40 m"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the time of flight of a 39K+ ion that has a kinetic energy of 1.21 x 10^-17 J when the flight tube is 80 cm long.",
        answer: 4.14e-5, unit: "s", tolerance: 0.1e-5, steps: ["m = 0.039 / 6.022 x 10^23 = 6.48 x 10^-26 kg", "v = √(2 x 1.21 x 10^-17 / 6.48 x 10^-26) = 1.93 x 10^4 m s-1", "t = 0.80 / 1.93 x 10^4 = 4.14 x 10^-5 s"] },
      { label: "c", type: "calc", marks: 3, q: "A 137Ba+ ion travels through a flight tube with a kinetic energy of 3.23 x 10^-16 J and takes 2.62 x 10^-5 s to reach the detector. Calculate the length of the flight tube.",
        answer: 1.40, unit: "m", tolerance: 0.03, steps: ["m = 0.137 / 6.022 x 10^23 = 2.28 x 10^-25 kg", "v = √(2 x 3.23 x 10^-16 / 2.28 x 10^-25) = 5.33 x 10^4 m s-1", "d = 5.33 x 10^4 x 2.62 x 10^-5 = 1.40 m"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-atc-006", board: ["aqa"], tags: ["atomic-structure", "mass-spectrometry", "time-of-flight", "calculations"], tier: 3, source: SS,
    title: "Time of flight of a second isotope",
    context: "All ions are accelerated to the same kinetic energy, so v = √(2KE / m) and the time of flight is proportional to √m.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "A sample of copper contains 63Cu and 65Cu. All ions have a kinetic energy of 1 x 10^-16 J and travel through a flight tube 0.80 m long. The 63Cu+ ions take 1.829 x 10^-5 s. Calculate the time taken by the 65Cu+ ions.",
        hints: ["t = d / v and v ∝ 1/√m, so t ∝ √m: t65 = t63 x √(65/63)."],
        answer: 1.858e-5, unit: "s", tolerance: 0.01e-5, steps: ["t ∝ √m at constant kinetic energy", "t(65Cu) = 1.829 x 10^-5 x √(65 / 63)", "= 1.858 x 10^-5 s"] },
      { label: "b", type: "calc", marks: 2, q: "In another sample, 63Cu+ ions take 1.4242 x 10^-5 s to reach the detector. Calculate the time taken by 66Cu+ ions under the same conditions.",
        answer: 1.458e-5, unit: "s", tolerance: 0.01e-5, steps: ["t(66Cu) = 1.4242 x 10^-5 x √(66 / 63)", "= 1.458 x 10^-5 s"] },
    ],
  },
];
