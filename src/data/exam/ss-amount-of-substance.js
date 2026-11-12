/**
 * Amount of substance drills from the Science Skool worksheets (moles, molar
 * gas volumes, titration calculations). Tier 1 unless the question needs an
 * equation and a limiting step. Ar values: H 1.0, C 12.0, N 14.0, O 16.0,
 * Na 23.0, Mg 24.3, Al 27.0, Si 28.1, S 32.1, Cl 35.5, K 39.1, Ca 40.1, Ar 39.9, Mn 54.9.
 * Molar gas volume 24.0 dm3 mol-1 at room temperature and pressure.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const molesOf = (label, text, answer, tol = 0.05) => ({
  label, type: "calc", marks: 1, q: `Calculate the number of moles in ${text}.`,
  hints: ["n = m / M. Use the Ar or Mr of the substance named, not of a single atom if it is a molecule."],
  answer, unit: "mol", tolerance: tol, steps: [`n = m / M = ${answer} mol`],
});
const massOf = (label, text, answer, tol = 0.5) => ({
  label, type: "calc", marks: 1, q: `Calculate the mass of ${text}.`,
  hints: ["m = n x M."], answer, unit: "g", tolerance: tol, steps: [`m = n x M = ${answer} g`],
});
const arOf = (label, n, m, answer) => ({
  label, type: "calc", marks: 1, q: `${n} mol of a metal has a mass of ${m} g. Calculate the relative atomic mass of the metal.`,
  hints: ["M = m / n."], answer, unit: "", tolerance: 0.2, steps: [`Ar = ${m} / ${n} = ${answer}`],
});
const mrOf = (label, n, m, answer) => ({
  label, type: "calc", marks: 1, q: `${n} mol of a compound has a mass of ${m} g. Calculate the relative molecular mass of the compound.`,
  hints: ["Mr = m / n."], answer, unit: "", tolerance: 0.2, steps: [`Mr = ${m} / ${n} = ${answer}`],
});

/** One scaffolded titration: dilute, titrate, scale back up. */
const titration = (id, acid, formula, Mr, v1, flask, base, cBase, titre, ratio, eqn) => {
  const nBase = cBase * titre / 1000;
  const nAcid = nBase / ratio;
  const cDil = nAcid / 0.025;
  const factor = flask / v1;
  const cUndil = cDil * factor;
  const gdm = cUndil * Mr;
  const r = (x, d) => Number(x.toPrecision(d));
  return {
    id, board: ALL, tags: ["moles", "titration", "calculations"], tier: 1, source: SS,
    title: `Titration: concentration of ${acid}`,
    context: `A ${v1} cm3 sample of ${acid} is transferred by pipette into a ${flask} cm3 volumetric flask and made up to the mark with water. 25 cm3 of the diluted acid is transferred into a conical flask and neutralised with ${cBase.toFixed(3)} mol dm-3 ${base} from a burette. The equation is ${eqn}`,
    parts: [
      { label: "a", type: "calc", marks: 1, q: `The average titre of ${base} was ${titre.toFixed(2)} cm3. Calculate the number of moles of ${base} in the average titre.`,
        hints: ["n = c x V, with V in dm3 (divide cm3 by 1000)."],
        answer: r(nBase, 3), unit: "mol", tolerance: r(nBase, 3) * 0.02, steps: [`n = ${cBase.toFixed(3)} x ${titre.toFixed(2)} / 1000 = ${r(nBase, 3)} mol`] },
      { label: "b", type: "calc", marks: 2, q: "Determine the number of moles of acid in the 25 cm3 of diluted acid, and hence the concentration of the diluted acid in mol dm-3.",
        hints: ["Use the mole ratio in the equation to go from moles of base to moles of acid.", "c = n / V with V = 0.025 dm3."],
        answer: r(cDil, 3), unit: "mol dm-3", tolerance: r(cDil, 3) * 0.02, steps: [`Moles of acid = ${r(nBase, 3)} / ${ratio} = ${r(nAcid, 3)} mol`, `c = ${r(nAcid, 3)} / 0.025 = ${r(cDil, 3)} mol dm-3`] },
      { label: "c", type: "calc", marks: 1, q: "Calculate the concentration of the undiluted acid in mol dm-3.",
        hints: [`The acid was diluted from ${v1} cm3 to ${flask} cm3, so multiply back up by ${flask} / ${v1}.`],
        answer: r(cUndil, 3), unit: "mol dm-3", tolerance: r(cUndil, 3) * 0.02, steps: [`Dilution factor = ${flask} / ${v1} = ${factor}`, `${r(cDil, 3)} x ${factor} = ${r(cUndil, 3)} mol dm-3`] },
      { label: "d", type: "calc", marks: 2, q: "Calculate the concentration of the undiluted acid in g dm-3.",
        hints: [`Work out Mr of ${formula} first.`, "Concentration in g dm-3 = concentration in mol dm-3 x Mr."],
        answer: r(gdm, 3), unit: "g dm-3", tolerance: r(gdm, 3) * 0.02, steps: [`Mr(${formula}) = ${Mr}`, `${r(cUndil, 3)} x ${Mr} = ${r(gdm, 3)} g dm-3`] },
    ],
  };
};

export const SS_AMOUNT_OF_SUBSTANCE = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-aos-001", board: ALL, tags: ["moles", "calculations"], tier: 1, source: SS,
    title: "Moles from mass",
    context: "Use n = m / M. Ar values: O 16.0, Na 23.0, Mg 24.3, Cl 35.5, Li 6.9, Ar 39.9, K 39.1, C 12.0, Si 28.1, Al 27.0.",
    parts: [
      molesOf("a", "32 g of O2", 1.0), molesOf("b", "11.5 g of Na", 0.5), molesOf("c", "36 g of Mg", 1.48), molesOf("d", "71 g of Cl2", 1.0),
      molesOf("e", "21 g of Li", 3.04, 0.1), molesOf("f", "10 g of Ar", 0.25), molesOf("g", "58.5 g of K", 1.50), molesOf("h", "18 g of C", 1.5),
      molesOf("i", "84 g of Si", 2.99), molesOf("j", "67.5 g of Al", 2.5),
    ],
  },
  {
    id: "ss-aos-002", board: ALL, tags: ["moles", "calculations"], tier: 1, source: SS,
    title: "Mass from moles",
    context: "Use m = n x M. Ar values: O 16.0, Mg 24.3, N 14.0, Ne 20.2, S 32.1, Ca 40.1, Na 23.0, C 12.0.",
    parts: [
      massOf("a", "2 mol of O2", 64.0), massOf("b", "0.5 mol of Mg", 12.2), massOf("c", "2 mol of N2", 56.0), massOf("d", "1.5 mol of Ne", 30.3),
      massOf("e", "3 mol of S", 96.3), massOf("f", "0.25 mol of Ca", 10.0), massOf("g", "0.5 mol of Mg", 12.2), massOf("h", "0.75 mol of S", 24.1),
      massOf("i", "1.5 mol of Na", 34.5), massOf("j", "3 mol of C", 36.0),
    ],
  },
  {
    id: "ss-aos-003", board: ALL, tags: ["moles", "calculations"], tier: 1, source: SS,
    title: "Relative atomic and molecular mass from moles",
    parts: [
      arOf("a", 0.1, 2.3, 23), arOf("b", 0.25, 10, 40), arOf("c", 0.6, 14.4, 24), arOf("d", 0.1, 5.2, 52), arOf("e", 0.3, 7.2, 24),
      mrOf("f", 0.1, 4.4, 44), mrOf("g", 0.1, 3.2, 32), mrOf("h", 0.05, 3.2, 64), mrOf("i", 0.2, 5.6, 28), mrOf("j", 0.2, 6.4, 32),
    ],
  },
  {
    id: "ss-aos-004", board: ALL, tags: ["moles", "ideal-gas", "calculations"], tier: 1, source: SS,
    title: "Molar gas volume at room temperature and pressure",
    context: "One mole of any gas occupies 24.0 dm3 at room temperature and pressure (rtp). Ar values: H 1.0, C 12.0, O 16.0, Cl 35.5, Ar 39.9.",
    parts: [
      { label: "a", type: "calc", marks: 1, q: "Calculate the volume, in dm3, of 0.010 g of hydrogen at rtp.",
        hints: ["Moles of H2 first (Mr = 2.0), then V = n x 24.0."], answer: 0.12, unit: "dm3", tolerance: 0.005, steps: ["n = 0.010 / 2.0 = 0.0050 mol", "V = 0.0050 x 24.0 = 0.12 dm3"] },
      { label: "b", type: "calc", marks: 1, q: "Calculate the mass of 100 cm3 of CO2 at rtp.",
        hints: ["n = V / 24 000 with V in cm3.", "m = n x 44.0."], answer: 0.183, unit: "g", tolerance: 0.005, steps: ["n = 100 / 24 000 = 4.17 x 10^-3 mol", "m = 4.17 x 10^-3 x 44.0 = 0.183 g"] },
      { label: "c", type: "calc", marks: 1, q: "Calculate the mass of 200 cm3 of chlorine gas at rtp.",
        hints: ["Chlorine gas is Cl2, Mr = 71.0."], answer: 0.592, unit: "g", tolerance: 0.01, steps: ["n = 200 / 24 000 = 8.33 x 10^-3 mol", "m = 8.33 x 10^-3 x 71.0 = 0.592 g"] },
      { label: "d", type: "calc", marks: 1, q: "Calculate the density of argon, in g dm-3, at rtp.",
        hints: ["Density = mass of one mole / volume of one mole."], answer: 1.66, unit: "g dm-3", tolerance: 0.02, steps: ["Density = 39.9 / 24.0 = 1.66 g dm-3"] },
      { label: "e", type: "calc", marks: 1, q: "Calculate the volume, in dm3, occupied by 0.16 g of oxygen gas at rtp.",
        hints: ["O2, Mr = 32.0."], answer: 0.12, unit: "dm3", tolerance: 0.005, steps: ["n = 0.16 / 32.0 = 0.0050 mol", "V = 0.0050 x 24.0 = 0.12 dm3"] },
      { label: "f", type: "calc", marks: 1, q: "A gas has a density of 1.42 g dm-3 at rtp. Calculate the mass of one mole of the gas.",
        hints: ["One mole occupies 24.0 dm3, so multiply the density by 24.0."], answer: 34.1, unit: "g", tolerance: 0.3, steps: ["M = 1.42 x 24.0 = 34.1 g mol-1"] },
    ],
  },
  {
    id: "ss-aos-005", board: ALL, tags: ["moles", "ideal-gas", "calculations"], tier: 2, source: SS,
    title: "Gas volumes from reacting masses",
    context: "One mole of any gas occupies 24.0 dm3 at rtp. Ar values: H 1.0, N 14.0, O 16.0, Al 27.0, Ca 40.1, Mn 54.9, K 39.1, C 12.0.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the volume, in cm3, of carbon dioxide evolved at rtp when an excess of dilute hydrochloric acid is added to 1.00 g of calcium carbonate.",
        hints: ["CaCO3 + 2HCl → CaCl2 + H2O + CO2, so 1 mol CaCO3 gives 1 mol CO2.", "Mr(CaCO3) = 100.1."],
        answer: 240, unit: "cm3", tolerance: 3, steps: ["n(CaCO3) = 1.00 / 100.1 = 9.99 x 10^-3 mol = n(CO2)", "V = 9.99 x 10^-3 x 24 000 = 240 cm3"] },
      { label: "b", type: "calc", marks: 3, q: "A student collects the hydrogen from the reaction between aluminium and excess dilute hydrochloric acid in a 100 cm3 gas syringe. Calculate the maximum mass of aluminium she could use without exceeding the capacity of the syringe.",
        hints: ["2Al + 6HCl → 2AlCl3 + 3H2.", "Moles of H2 that fill the syringe = 100 / 24 000.", "Moles of Al = 2/3 of the moles of H2."],
        answer: 0.075, unit: "g", tolerance: 0.002, steps: ["n(H2) = 100 / 24 000 = 4.17 x 10^-3 mol", "n(Al) = 4.17 x 10^-3 x 2/3 = 2.78 x 10^-3 mol", "m = 2.78 x 10^-3 x 27.0 = 0.075 g"] },
      { label: "c", type: "calc", marks: 3, q: "Chlorine can be prepared by heating manganese(IV) oxide with an excess of concentrated hydrochloric acid: MnO2 + 4HCl → MnCl2 + Cl2 + 2H2O. Calculate the maximum volume of chlorine, in cm3 at rtp, obtainable from 2.00 g of manganese(IV) oxide.",
        hints: ["Mr(MnO2) = 86.9.", "1 mol MnO2 gives 1 mol Cl2."],
        answer: 552, unit: "cm3", tolerance: 5, steps: ["n(MnO2) = 2.00 / 86.9 = 0.0230 mol = n(Cl2)", "V = 0.0230 x 24 000 = 552 cm3"] },
      { label: "d", type: "calc", marks: 3, q: "Potassium nitrate decomposes on heating: 2KNO3 → 2KNO2 + O2. Calculate the mass of potassium nitrate that must be heated to produce 1.00 dm3 of oxygen at rtp.",
        hints: ["n(O2) = 1.00 / 24.0.", "Two moles of KNO3 give one mole of O2.", "Mr(KNO3) = 101.1."],
        answer: 8.42, unit: "g", tolerance: 0.1, steps: ["n(O2) = 1.00 / 24.0 = 0.0417 mol", "n(KNO3) = 2 x 0.0417 = 0.0833 mol", "m = 0.0833 x 101.1 = 8.42 g"] },
    ],
  },
  titration("ss-aos-006", "hydrochloric acid", "HCl", 36.5, 25, 250, "sodium hydroxide", 0.100, 30.00, 1, "HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)"),
  titration("ss-aos-007", "nitric acid", "HNO3", 63.0, 10, 100, "sodium hydroxide", 0.150, 23.33, 1, "HNO3(aq) + NaOH(aq) → NaNO3(aq) + H2O(l)"),
  titration("ss-aos-008", "sulfuric acid", "H2SO4", 98.1, 25, 500, "sodium hydroxide", 0.100, 25.00, 2, "H2SO4(aq) + 2NaOH(aq) → Na2SO4(aq) + 2H2O(l)"),
  titration("ss-aos-009", "hydrochloric acid", "HCl", 36.5, 10, 500, "potassium hydroxide", 0.050, 20.00, 1, "HCl(aq) + KOH(aq) → KCl(aq) + H2O(l)"),
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-aos-010", board: ALL, tags: ["moles", "titration", "practical", "uncertainty"], tier: 2, source: SS,
    title: "Titration technique and uncertainty",
    context: "A student dilutes a sample of acid in a volumetric flask, pipettes 25 cm3 of the diluted acid into a conical flask and titrates it against sodium hydroxide from a burette.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Explain the effect on the titre if the pipette used to transfer the acid solution was filled to slightly above the mark.",
        ms: ["Titre is greater / too high", "More moles of acid transferred to the conical flask"] },
      { label: "b", type: "short", marks: 2, q: "Explain the effect on the titre if the pipette used to transfer the acid solution was filled to slightly below the mark.",
        ms: ["Titre is smaller / too low", "Fewer moles of acid transferred to the conical flask"] },
      { label: "c", type: "short", marks: 2, q: "Explain the effect on the titre if the volumetric flask was filled to slightly above the mark.",
        ms: ["Titre is smaller / too low", "Concentration of the diluted acid is lower (so fewer moles of acid in 25 cm3)"] },
      { label: "d", type: "short", marks: 2, q: "Explain the effect on the titre if the volumetric flask was filled to slightly below the mark.",
        ms: ["Titre is greater / too high", "Concentration of the diluted acid is higher (so more moles of acid in 25 cm3)"] },
      { label: "e", type: "calc", marks: 1, q: "Calculate the percentage uncertainty of a 100 cm3 volumetric flask with an uncertainty of 0.1 cm3.",
        answer: 0.1, unit: "%", tolerance: 0.005, steps: ["(0.1 / 100) x 100 = 0.1%"] },
      { label: "f", type: "calc", marks: 1, q: "Calculate the percentage uncertainty of a 250 cm3 volumetric flask with an uncertainty of 0.2 cm3.",
        answer: 0.08, unit: "%", tolerance: 0.005, steps: ["(0.2 / 250) x 100 = 0.08%"] },
      { label: "g", type: "calc", marks: 1, q: "Calculate the percentage uncertainty of a 500 cm3 volumetric flask with an uncertainty of 0.5 cm3.",
        answer: 0.1, unit: "%", tolerance: 0.005, steps: ["(0.5 / 500) x 100 = 0.1%"] },
      { label: "h", type: "short", marks: 2, q: "A student suggests washing out the pipette with water before filling it with the acid solution. Explain why this is not a good idea.",
        ms: ["Water left in the pipette would dilute the acid / lower its concentration", "Rinsing with the acid solution itself removes any contaminant and does not change the concentration"],
        allow: ["Fewer moles of acid transferred, so the titre is too low"] },
    ],
  },
];
