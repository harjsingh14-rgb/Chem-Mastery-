/**
 * Atomic structure and mass spectrometry: exam questions from the Science
 * Skool worksheet (legacy AQA questions), re-worded only where a part asked
 * for a drawing. Parts that tested the old magnetic-sector mass spectrometer
 * are left out; the time-of-flight instrument is in atomic-structure.js.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_ATOMIC_STRUCTURE = [
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-atom-001", board: ALL, tags: ["atomic-structure", "isotopes", "mass-spectrometry", "ionisation-energy"], tier: 2, source: SS,
    title: "Isotopes of krypton and ionisation energies",
    context: "A sample of krypton contains four isotopes.",
    dataTable: [["Mass number", "82 / 83 / 84 / 86"], ["Relative abundance", "12 / 12 / 50 / 26"]],
    parts: [
      { label: "a", type: "short", marks: 1, q: "Define the term atomic number of an atom.", ms: ["The number of protons (in the nucleus)"] },
      { label: "b", type: "short", marks: 1, q: "Explain why atoms of the same element may have different mass numbers.", ms: ["They have different numbers of neutrons"], reject: ["They are isotopes, with no reference to neutrons"] },
      { label: "c", type: "short", marks: 1, q: "Name the instrument used to measure the relative abundance of isotopes.", ms: ["Mass spectrometer"] },
      { label: "d", type: "short", marks: 2, q: "Define the term relative atomic mass of an element.",
        ms: ["(Weighted) mean / average mass of one atom (of the element)", "Compared with 1/12 of the mass of one atom of carbon-12"],
        allow: ["Average mass of one mole of atoms relative to 1/12 the mass of one mole of carbon-12"], reject: ["Mass of a molecule or of an element rather than an atom"] },
      { label: "e", type: "calc", marks: 2, q: "Calculate the relative atomic mass of this sample of krypton. Give your answer to two decimal places.",
        hints: ["Multiply each mass number by its abundance, add them up and divide by the total abundance (100)."],
        answer: 84.16, unit: "", tolerance: 0.05, steps: ["(82 x 12) + (83 x 12) + (84 x 50) + (86 x 26) = 8416", "8416 / 100 = 84.16"] },
      { label: "f", type: "short", marks: 1, q: "Give the complete electron configuration of krypton in terms of s, p and d sub-levels.", ms: ["1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6"], reject: ["[Ar] shorthand"] },
      { label: "g", type: "short", marks: 2, q: "Explain why the first ionisation energy of krypton is greater than the first ionisation energy of bromine.",
        ms: ["Krypton has more protons / a greater nuclear charge", "The outer electron is in the same shell / sub-shell with similar shielding, so it is held more strongly"] },
      { label: "h", type: "short", marks: 2, q: "Explain why the first ionisation energy of rubidium is less than the first ionisation energy of krypton.",
        ms: ["The outer electron of rubidium is in a higher energy level / the 5th shell", "It is further from the nucleus and more shielded, so less strongly attracted"] },
    ],
  },
  {
    id: "ss-atom-002", board: ALL, tags: ["atomic-structure", "isotopes", "mass-spectrometry", "electron-configuration"], tier: 2, source: SS,
    title: "Isotope symbols, ions and data from a mass spectrum",
    dataTable: [["Ion", "12C+ / 13C+"], ["Absolute mass of one ion / g", "1.993 x 10^-23 / 2.158 x 10^-23"], ["Relative abundance / %", "98.9 / 1.1"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Give the symbol, including mass number and atomic number, for the isotope which has a mass number of 34 and 18 neutrons in each nucleus.",
        ms: ["Atomic number 16 (sulfur, S)", "Mass number 34: 34S with 16 as the atomic number"], allow: ["34/16 S written as mass number over atomic number"] },
      { label: "b", type: "short", marks: 1, q: "Give the electron configuration of the F- ion in terms of levels and sub-levels.", ms: ["1s2 2s2 2p6"] },
      { label: "c", type: "short", marks: 1, q: "Give a reason why it is unlikely that an F- ion would reach the detector in a mass spectrometer.",
        ms: ["A negative ion is not accelerated / attracted by the electric field (which accelerates positive ions)"], allow: ["Negative ion repelled by the negative plate / deflected the wrong way"] },
      { label: "d", type: "calc", marks: 2, q: "Use the data to calculate the mass of one neutron, in g. You may neglect the mass of an electron.",
        hints: ["13C+ has one more neutron than 12C+, so subtract the two ion masses."],
        answer: 1.65e-24, unit: "g", tolerance: 0.02e-24, steps: ["2.158 x 10^-23 - 1.993 x 10^-23 = 1.65 x 10^-24 g"] },
      { label: "e", type: "calc", marks: 2, q: "Use the data to calculate the relative atomic mass of 13C. Give your answer to two decimal places.",
        hints: ["Relative atomic mass compares the mass with 1/12 of the mass of a 12C atom: (mass of 13C x 12) / mass of 12C."],
        answer: 12.99, unit: "", tolerance: 0.02, steps: ["(2.158 x 10^-23 x 12) / 1.993 x 10^-23 = 12.99"] },
      { label: "f", type: "calc", marks: 2, q: "Calculate the relative atomic mass of carbon in the sample. Give your answer to two decimal places.",
        hints: ["Weighted mean of 12.00 and your answer to (e) using the abundances."],
        answer: 12.01, unit: "", tolerance: 0.02, steps: ["(98.9 x 12.00) + (1.1 x 12.99) = 1201.1", "1201.1 / 100 = 12.01"] },
    ],
  },
  {
    id: "ss-atom-003", board: ALL, tags: ["atomic-structure", "ionisation-energy", "electron-configuration"], tier: 2, source: SS,
    title: "Ionisation energies of lithium, helium, beryllium and boron",
    parts: [
      { label: "a", type: "short", marks: 3, q: "Write equations, including state symbols, to show the processes which occur when the first and the second ionisation energies of lithium are measured.",
        ms: ["Li(g) → Li+(g) + e-", "Li+(g) → Li2+(g) + e-", "State symbols (g) correct throughout"] },
      { label: "b", type: "short", marks: 2, q: "Explain why helium has a much higher first ionisation energy than lithium.",
        ms: ["The electron removed from helium is in the 1s sub-level / first shell", "It is closer to the nucleus and not shielded, whereas the 2s electron of lithium is further away and shielded by the 1s electrons"] },
      { label: "c", type: "short", marks: 2, q: "Explain why beryllium has a higher first ionisation energy than boron.",
        ms: ["The outer electron of beryllium is in the 2s sub-level whereas that of boron is in 2p", "2p is higher in energy / further from the nucleus / shielded by the 2s electrons, so it is easier to remove"] },
      { label: "d", type: "short", marks: 2, q: "Explain why the second ionisation energy of beryllium is greater than its first ionisation energy.",
        ms: ["The second electron is removed from a positive ion (Be+)", "The remaining electrons are attracted more strongly by the nucleus (same nuclear charge, less repulsion / fewer electrons)"] },
    ],
  },
  {
    id: "ss-atom-004", board: ALL, tags: ["atomic-structure", "isotopes", "mass-spectrometry", "ideal-gas"], tier: 2, source: SS,
    title: "Titanium isotopes, bromine molecular ions and a gas calculation",
    context: "The relative isotopic abundances of titanium are given in the table. Bromine gas contains the isotopes 79Br and 81Br in almost equal proportions.",
    dataTable: [["Isotope", "46Ti / 47Ti / 48Ti / 49Ti / 50Ti"], ["% abundance", "8.02 / 7.31 / 73.81 / 5.54 / 5.32"]],
    parts: [
      { label: "a", type: "short", marks: 2, q: "Explain what is meant by the term relative isotopic abundance.",
        ms: ["The proportion / percentage of each isotope", "Present in the (natural) sample of the element"], reject: ["Reference to relative atomic mass"] },
      { label: "b", type: "calc", marks: 2, q: "Using the data, calculate the relative atomic mass, Ar, of titanium. Give your answer to one decimal place.",
        answer: 47.9, unit: "", tolerance: 0.05, steps: ["(0.0802 x 46) + (0.0731 x 47) + (0.7381 x 48) + (0.0554 x 49) + (0.0532 x 50)", "= 47.9"] },
      { label: "c", type: "short", marks: 3, q: "The mass spectrum of bromine gas shows peaks for the molecular ion Br2+. State the m/z value of each molecular ion peak and the ratio of their heights.",
        ms: ["Three peaks", "At m/z = 158, 160 and 162", "In the ratio 1 : 2 : 1"] },
      { label: "d", type: "short", marks: 1, q: "Explain the number of molecular ion peaks.",
        ms: ["Three possible combinations of isotopes: 79Br-79Br, 79Br-81Br and 81Br-81Br"] },
      { label: "e", type: "short", marks: 1, q: "Explain the ratio of the heights of the molecular ion peaks.",
        ms: ["79Br-81Br is twice as likely as either 79Br-79Br or 81Br-81Br (79-81 and 81-79 are the same molecule, so four permutations give 1 : 2 : 1)"] },
      { label: "f", type: "calc", marks: 5, q: "Calculate the mass of argon, in g, contained in an 18.6 dm3 container at 20 °C and a pressure of 2.35 atm. 1 atm = 101 325 Pa; R = 8.31 J K-1 mol-1; Ar of argon = 39.9.",
        hints: ["Use pV = nRT with p in Pa, V in m3 and T in K.", "18.6 dm3 = 0.0186 m3; 20 °C = 293 K; 2.35 atm = 238 114 Pa.", "Mass = n x 39.9."],
        answer: 72.6, unit: "g", tolerance: 0.6, steps: ["p = 2.35 x 101 325 = 238 114 Pa; V = 0.0186 m3; T = 293 K", "n = pV / RT = 238 114 x 0.0186 / (8.31 x 293) = 1.82 mol", "m = 1.82 x 39.9 = 72.6 g"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-atom-005", board: ALL, tags: ["atomic-structure", "isotopes", "mass-spectrometry", "formulae"], tier: 3, source: SS,
    title: "Fundamental particles, an unknown element and an empirical formula",
    context: "The mass spectrum of an element has peaks with the m/z values and relative intensities shown. A separate compound has a molecular ion peak at m/z = 168 and contains 42.9% carbon, 2.4% hydrogen and 16.7% nitrogen by mass; the remainder is oxygen.",
    dataTable: [["m/z", "80 / 82 / 83 / 84 / 86"], ["Relative intensity", "1 / 5 / 5 / 25 / 8"]],
    parts: [
      { label: "a", type: "extended", marks: 6, q: "Describe, in terms of charge and mass, the properties of protons, neutrons and electrons. Explain fully how these particles are arranged in an atom of 14N.",
        ms: ["Proton: relative mass 1, relative charge +1", "Neutron: relative mass 1, charge 0", "Electron: relative mass about 1/1800 (negligible), relative charge -1", "14N has 7 protons and 7 neutrons in the nucleus", "7 electrons surround the nucleus in shells / orbitals", "Electron configuration 1s2 2s2 2p3"] },
      { label: "b", type: "short", marks: 2, q: "Account for the existence of isotopes.",
        ms: ["Atoms of the same element have the same number of protons / atomic number", "But different numbers of neutrons / mass numbers"] },
      { label: "c", type: "calc", marks: 3, q: "Calculate the accurate relative atomic mass of the element from its mass spectrum. Give your answer to one decimal place.",
        hints: ["The total intensity is 44, so each fraction is intensity / 44."],
        answer: 83.9, unit: "", tolerance: 0.1, steps: ["Total intensity = 1 + 5 + 5 + 25 + 8 = 44", "Ar = (1 x 80 + 5 x 82 + 5 x 83 + 25 x 84 + 8 x 86) / 44 = 3693 / 44", "= 83.9"] },
      { label: "d", type: "short", marks: 1, q: "Identify the element.", ms: ["Krypton"] },
      { label: "e", type: "short", marks: 4, q: "Calculate the empirical and molecular formulae of the compound.",
        hints: ["Oxygen is 100 - (42.9 + 2.4 + 16.7)%.", "Divide each percentage by the Ar, then by the smallest ratio."],
        ms: ["Percentage of oxygen = 38.0%", "Ratio 42.9/12 : 2.4/1 : 16.7/14 : 38.0/16 = 3.6 : 2.4 : 1.2 : 2.4 = 3 : 2 : 1 : 2", "Empirical formula C3H2NO2", "Empirical mass 84, so molecular formula C6H4N2O4"] },
    ],
  },
];
