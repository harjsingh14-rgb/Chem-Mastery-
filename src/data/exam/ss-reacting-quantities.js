/**
 * Calculations from equations, the ideal gas equation, titrations, atom
 * economy and percentage yield (Science Skool worksheets). Ar values: H 1.0,
 * C 12.0, N 14.0, O 16.0, Na 23.0, Mg 24.3, Al 27.0, S 32.1, Cl 35.5, Ca 40.1,
 * Ti 47.9, Fe 55.8, Br 79.9, Ag 107.9, Li 6.9. R = 8.31 J K-1 mol-1.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_REACTING_QUANTITIES = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "ss-rq-001", board: ALL, tags: ["moles", "calculations", "reacting-masses"], tier: 1, source: SS,
    title: "Masses from equations",
    context: "For each reaction: moles of the substance given, mole ratio from the equation, then mass. Ar values: C 12.0, O 16.0, N 14.0, Na 23.0, Ca 40.1, Ti 47.9, Fe 55.8, Al 27.0, Cl 35.5, Ag 107.9, H 1.0.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the mass of calcium oxide obtained by heating 25.0 g of calcium carbonate: CaCO3 → CaO + CO2.",
        hints: ["Mr(CaCO3) = 100.1, Mr(CaO) = 56.1.", "1 : 1 ratio."], answer: 14.0, unit: "g", tolerance: 0.2, steps: ["n(CaCO3) = 25.0 / 100.1 = 0.250 mol = n(CaO)", "m = 0.250 x 56.1 = 14.0 g"] },
      { label: "b", type: "calc", marks: 2, q: "In the blast furnace, haematite is converted to iron: Fe2O3 + 3CO → 2Fe + 3CO2. Calculate the mass of iron, in tonnes, obtained from 16.0 tonnes of iron(III) oxide.",
        hints: ["Mr(Fe2O3) = 159.6.", "Work in tonnes exactly as you would in grams: 1 tonne of Fe2O3 is 1/159.6 tonne-moles."],
        answer: 11.2, unit: "tonnes", tolerance: 0.2, steps: ["n(Fe2O3) = 16.0 / 159.6 = 0.100", "n(Fe) = 2 x 0.100 = 0.200", "m = 0.200 x 55.8 = 11.2 tonnes"] },
      { label: "c", type: "calc", marks: 2, q: "Titanium is manufactured by heating titanium(IV) chloride with sodium: TiCl4 + 4Na → Ti + 4NaCl. Calculate the mass of sodium, in tonnes, required to produce 1.00 tonne of titanium.",
        answer: 1.92, unit: "tonnes", tolerance: 0.04, steps: ["n(Ti) = 1.00 / 47.9 = 0.0209", "n(Na) = 4 x 0.0209 = 0.0835", "m = 0.0835 x 23.0 = 1.92 tonnes"] },
      { label: "d", type: "calc", marks: 2, q: "2.67 g of aluminium chloride was dissolved in water and an excess of silver nitrate solution added: AlCl3(aq) + 3AgNO3(aq) → Al(NO3)3(aq) + 3AgCl(s). Calculate the mass of silver chloride precipitated.",
        hints: ["Mr(AlCl3) = 133.5, Mr(AgCl) = 143.4."], answer: 8.60, unit: "g", tolerance: 0.1, steps: ["n(AlCl3) = 2.67 / 133.5 = 0.0200 mol", "n(AgCl) = 3 x 0.0200 = 0.0600 mol", "m = 0.0600 x 143.4 = 8.60 g"] },
    ],
  },
  {
    id: "ss-rq-002", board: ALL, tags: ["moles", "calculations", "reacting-masses"], tier: 2, source: SS,
    title: "Masses through a sequence of reactions",
    context: "Nitric acid is made from nitrogen in four stages: N2 + 3H2 → 2NH3; 4NH3 + 5O2 → 4NO + 6H2O; 2NO + O2 → 2NO2; 2H2O + 4NO2 + O2 → 4HNO3. Calcium hydroxide is made in two: CaCO3 → CaO + CO2; CaO + H2O → Ca(OH)2.",
    parts: [
      { label: "a", type: "short", marks: 1, q: "Deduce the overall mole ratio of N2 to HNO3 in the four-stage process.", ms: ["1 mol N2 → 2 mol HNO3 (1 : 2)"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the mass of nitric acid, in tonnes, that can be produced from 1.00 tonne of nitrogen gas.",
        hints: ["Mr(N2) = 28.0, Mr(HNO3) = 63.0."], answer: 4.50, unit: "tonnes", tolerance: 0.06, steps: ["n(N2) = 1.00 / 28.0 = 0.0357", "n(HNO3) = 2 x 0.0357 = 0.0714", "m = 0.0714 x 63.0 = 4.50 tonnes"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the mass of water, in tonnes, that must be added to the calcium oxide produced from 1.00 tonne of calcium carbonate.",
        answer: 0.180, unit: "tonnes", tolerance: 0.004, steps: ["n(CaCO3) = 1.00 / 100.1 = 0.00999 = n(CaO) = n(H2O)", "m = 0.00999 x 18.0 = 0.180 tonnes"] },
      { label: "d", type: "calc", marks: 1, q: "Calculate the mass of calcium hydroxide, in tonnes, ultimately produced from 1.00 tonne of calcium carbonate.",
        hints: ["Mr(Ca(OH)2) = 74.1."], answer: 0.740, unit: "tonnes", tolerance: 0.01, steps: ["0.00999 x 74.1 = 0.740 tonnes"] },
    ],
  },
  {
    id: "ss-rq-003", board: ALL, tags: ["moles", "ideal-gas", "calculations"], tier: 1, source: SS,
    title: "The ideal gas equation",
    context: "pV = nRT with p in Pa, V in m3, T in K and R = 8.31 J K-1 mol-1. 1 dm3 = 1 x 10^-3 m3; 1 cm3 = 1 x 10^-6 m3.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the volume, in dm3, occupied by 2.20 g of carbon dioxide at 298 K and a pressure of 100 kPa.",
        hints: ["n = 2.20 / 44.0.", "V = nRT / p, then convert m3 to dm3."], answer: 1.24, unit: "dm3", tolerance: 0.03, steps: ["n = 2.20 / 44.0 = 0.0500 mol", "V = 0.0500 x 8.31 x 298 / 100 000 = 1.24 x 10^-3 m3", "= 1.24 dm3"] },
      { label: "b", type: "calc", marks: 2, q: "Calculate the pressure, in kPa, exerted by 1.60 g of oxygen in a volume of 2.00 dm3 at 80 °C.",
        hints: ["80 °C = 353 K; 2.00 dm3 = 2.00 x 10^-3 m3."], answer: 73.3, unit: "kPa", tolerance: 0.5, steps: ["n = 1.60 / 32.0 = 0.0500 mol", "p = 0.0500 x 8.31 x 353 / 2.00 x 10^-3 = 73 300 Pa", "= 73.3 kPa"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the volume, in dm3, occupied by 0.100 g of hydrogen at 293 K and 100 kPa.",
        answer: 1.22, unit: "dm3", tolerance: 0.03, steps: ["n = 0.100 / 2.0 = 0.0500 mol", "V = 0.0500 x 8.31 x 293 / 100 000 = 1.22 x 10^-3 m3 = 1.22 dm3"] },
    ],
  },
  {
    id: "ss-rq-004", board: ALL, tags: ["moles", "ideal-gas", "calculations"], tier: 2, source: SS,
    title: "Ideal gas equation: unknown mass and molar mass",
    context: "pV = nRT; R = 8.31 J K-1 mol-1.",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "56.0 cm3 of an unknown gas X, measured at 90 °C and a pressure of 101 kPa, was found to weigh 0.135 g. Calculate the relative formula mass of X.",
        hints: ["Convert: 56.0 cm3 = 5.60 x 10^-5 m3; 90 °C = 363 K; 101 kPa = 101 000 Pa.", "n = pV / RT, then Mr = mass / n."],
        answer: 72.0, unit: "", tolerance: 1.0, steps: ["n = 101 000 x 5.60 x 10^-5 / (8.31 x 363) = 1.87 x 10^-3 mol", "Mr = 0.135 / 1.87 x 10^-3 = 72.0"] },
      { label: "b", type: "calc", marks: 3, q: "Calculate the mass of 200 cm3 of carbon monoxide at 17 °C and a pressure of 98 900 Pa.",
        hints: ["17 °C = 290 K; 200 cm3 = 2.00 x 10^-4 m3.", "Mr(CO) = 28.0."],
        answer: 0.230, unit: "g", tolerance: 0.005, steps: ["n = 98 900 x 2.00 x 10^-4 / (8.31 x 290) = 8.21 x 10^-3 mol", "m = 8.21 x 10^-3 x 28.0 = 0.230 g"] },
    ],
  },
  {
    id: "ss-rq-005", board: ALL, tags: ["moles", "titration", "calculations"], tier: 1, source: SS,
    title: "Titration calculations: single step",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "25.0 cm3 of 0.100 mol dm-3 sodium hydroxide solution required 23.5 cm3 of dilute hydrochloric acid for neutralisation: NaOH + HCl → NaCl + H2O. Calculate the concentration of the hydrochloric acid in mol dm-3.",
        hints: ["n(NaOH) = 0.100 x 25.0 / 1000.", "1 : 1 ratio, then c = n / V with V = 0.0235 dm3."],
        answer: 0.106, unit: "mol dm-3", tolerance: 0.002, steps: ["n(NaOH) = 0.100 x 0.0250 = 2.50 x 10^-3 mol = n(HCl)", "c = 2.50 x 10^-3 / 0.0235 = 0.106 mol dm-3"] },
      { label: "b", type: "calc", marks: 3, q: "25.0 cm3 of sodium hydroxide solution of unknown concentration was titrated with 0.0500 mol dm-3 sulfuric acid. 20.0 cm3 of the acid was required: 2NaOH + H2SO4 → Na2SO4 + 2H2O. Calculate the concentration of the sodium hydroxide in mol dm-3.",
        hints: ["Two moles of NaOH react with each mole of H2SO4."],
        answer: 0.0800, unit: "mol dm-3", tolerance: 0.002, steps: ["n(H2SO4) = 0.0500 x 0.0200 = 1.00 x 10^-3 mol", "n(NaOH) = 2.00 x 10^-3 mol", "c = 2.00 x 10^-3 / 0.0250 = 0.0800 mol dm-3"] },
    ],
  },
  {
    id: "ss-rq-006", board: ALL, tags: ["moles", "titration", "calculations"], tier: 2, source: SS,
    title: "Titration calculations in g dm-3",
    context: "Ar values: H 1.0, C 12.0, O 16.0, Na 23.0, S 32.1, Cl 35.5.",
    parts: [
      { label: "a", type: "calc", marks: 4, q: "25.0 cm3 of 0.100 mol dm-3 sodium hydrogencarbonate solution was titrated with dilute sulfuric acid of unknown concentration. 17.6 cm3 of the acid was required: 2NaHCO3 + H2SO4 → Na2SO4 + 2H2O + 2CO2. Calculate the concentration of the sulfuric acid in g dm-3.",
        hints: ["n(NaHCO3) = 0.100 x 0.0250; halve it for H2SO4.", "c in mol dm-3 x Mr(H2SO4) = 98.1 gives g dm-3."],
        answer: 6.97, unit: "g dm-3", tolerance: 0.1, steps: ["n(NaHCO3) = 2.50 x 10^-3 mol", "n(H2SO4) = 1.25 x 10^-3 mol", "c = 1.25 x 10^-3 / 0.0176 = 0.0710 mol dm-3", "0.0710 x 98.1 = 6.97 g dm-3"] },
      { label: "b", type: "calc", marks: 5, q: "2.10 g of sodium hydrogencarbonate was dissolved in water and the solution made up to 250 cm3. 25.0 cm3 of this solution was pipetted into a conical flask with methyl orange indicator and neutralised by 25.9 cm3 of dilute hydrochloric acid from a burette: NaHCO3 + HCl → NaCl + CO2 + H2O. Calculate the concentration of the acid in g dm-3.",
        hints: ["Mr(NaHCO3) = 84.0; moles in 250 cm3, then concentration, then moles in 25.0 cm3.", "1 : 1 with HCl; c = n / 0.0259; multiply by 36.5."],
        answer: 3.52, unit: "g dm-3", tolerance: 0.06, steps: ["n(NaHCO3) = 2.10 / 84.0 = 0.0250 mol in 250 cm3, so 0.100 mol dm-3", "In 25.0 cm3: 2.50 x 10^-3 mol = n(HCl)", "c(HCl) = 2.50 x 10^-3 / 0.0259 = 0.0965 mol dm-3", "0.0965 x 36.5 = 3.52 g dm-3"] },
    ],
  },
  {
    id: "ss-rq-007", board: ALL, tags: ["moles", "atom-economy", "calculations"], tier: 1, source: SS,
    title: "Atom economy",
    context: "% atom economy = (Mr of desired product / total Mr of all products) x 100, taking account of the balancing numbers. Ar values: H 1.0, C 12.0, N 14.0, O 16.0, Li 6.9, Fe 55.8.",
    parts: [
      { label: "a", type: "calc", marks: 2, q: "Calculate the atom economy for making hydrogen by reacting coal with steam: C(s) + 2H2O(g) → CO2(g) + 2H2(g).",
        answer: 8.33, unit: "%", tolerance: 0.1, steps: ["Desired product 2 x 2.0 = 4.0", "Total products 44.0 + 4.0 = 48.0", "4.0 / 48.0 x 100 = 8.33%"] },
      { label: "b", type: "calc", marks: 2, q: "Lithium hydroxide reacts with nitric acid to produce lithium nitrate and water. Calculate the atom economy if the desired product is lithium nitrate.",
        hints: ["LiOH + HNO3 → LiNO3 + H2O."], answer: 79.3, unit: "%", tolerance: 0.3, steps: ["Mr(LiNO3) = 68.9; Mr(H2O) = 18.0", "68.9 / 86.9 x 100 = 79.3%"] },
      { label: "c", type: "calc", marks: 2, q: "Calculate the percentage atom economy for the blast furnace reaction Fe2O3 + 3CO → 2Fe + 3CO2, where iron is the desired product.",
        answer: 45.8, unit: "%", tolerance: 0.3, steps: ["Desired 2 x 55.8 = 111.6", "Total products 111.6 + 3 x 44.0 = 243.6", "111.6 / 243.6 x 100 = 45.8%"] },
      { label: "d", type: "calc", marks: 1, q: "Calculate the percentage atom economy for the Haber process, N2 + 3H2 → 2NH3.",
        answer: 100, unit: "%", tolerance: 0.1, steps: ["Only one product, so atom economy = 100%"] },
      { label: "e", type: "calc", marks: 2, q: "Calculate the percentage atom economy for the final stage of the Ostwald process, NH3 + 2O2 → HNO3 + H2O, where nitric acid is the desired product.",
        answer: 77.8, unit: "%", tolerance: 0.3, steps: ["63.0 / (63.0 + 18.0) x 100 = 77.8%"] },
    ],
  },
  // ───────────────────────── Tier 2: exam standard ─────────────────────────
  {
    id: "ss-rq-008", board: ALL, tags: ["moles", "percentage-yield", "calculations", "organic"], tier: 2, source: SS,
    title: "Percentage yield from a mass of reactant",
    parts: [
      { label: "a", type: "calc", marks: 3, q: "In an experiment to produce hex-1-ene, 10.2 g of hexan-1-ol was heated with an excess of phosphoric(V) acid, which acts as a dehydrating agent: C6H13OH → C6H12 + H2O. After purification, 5.04 g of hex-1-ene was obtained. Calculate the percentage yield.",
        hints: ["Mr(hexan-1-ol) = 102.0; Mr(hex-1-ene) = 84.0.", "% yield = actual mass / theoretical mass x 100."],
        answer: 60.0, unit: "%", tolerance: 0.5, steps: ["n(hexan-1-ol) = 10.2 / 102.0 = 0.100 mol = n(hex-1-ene)", "Theoretical mass = 0.100 x 84.0 = 8.40 g", "5.04 / 8.40 x 100 = 60.0%"] },
      { label: "b", type: "calc", marks: 4, q: "A student made magnesium sulfate crystals, MgSO4.7H2O, by reacting 1.20 g of magnesium with a slight excess of sulfuric acid, evaporating about three-quarters of the liquid and leaving it to crystallise: Mg + H2SO4 → MgSO4 + H2, then MgSO4 + 7H2O → MgSO4.7H2O. 9.84 g of dried crystals were obtained. Calculate the percentage yield.",
        hints: ["Mr(MgSO4.7H2O) = 246.4.", "Magnesium is the limiting reagent: 1 mol Mg gives 1 mol of hydrated crystals."],
        answer: 80.9, unit: "%", tolerance: 0.8, steps: ["n(Mg) = 1.20 / 24.3 = 0.0494 mol", "Theoretical mass = 0.0494 x 246.4 = 12.2 g", "9.84 / 12.2 x 100 = 80.9%"] },
    ],
  },
  // ───────────────────────── Tier 3: stretch ─────────────────────────
  {
    id: "ss-rq-009", board: ALL, tags: ["moles", "percentage-yield", "calculations", "organic", "limiting-reagent"], tier: 3, source: SS,
    title: "Percentage yield from volumes and densities",
    context: "Densities: butan-1-ol 0.810 g cm-3; 1-bromobutane 1.28 g cm-3; ethanoic anhydride 1.08 g cm-3; phenylamine 1.02 g cm-3. Mass = volume x density.",
    parts: [
      { label: "a", type: "calc", marks: 4, q: "A sample of 1-bromobutane was made by treating 8.0 cm3 of butan-1-ol with an excess of sodium bromide and concentrated sulfuric acid: C4H9OH + NaBr + H2SO4 → C4H9Br + NaHSO4 + H2O. After purification 3.7 cm3 of 1-bromobutane was obtained. Calculate the percentage yield.",
        hints: ["Convert both volumes to masses with the densities.", "Mr(C4H9OH) = 74.0; Mr(C4H9Br) = 136.9."],
        answer: 39.5, unit: "%", tolerance: 0.8, steps: ["Mass of butan-1-ol = 8.0 x 0.810 = 6.48 g; n = 6.48 / 74.0 = 0.0876 mol", "Theoretical mass of C4H9Br = 0.0876 x 136.9 = 12.0 g", "Actual mass = 3.7 x 1.28 = 4.74 g", "4.74 / 12.0 x 100 = 39.5%"] },
      { label: "b", type: "calc", marks: 5, q: "4.0 cm3 of phenylamine was treated with 6.0 cm3 of ethanoic anhydride and the solid N-phenylethanamide purified: (CH3CO)2O + C6H5NH2 → CH3CONHC6H5 + CH3COOH. 4.15 g of product was obtained. Calculate the percentage yield.",
        hints: ["Find the moles of each reactant and identify the limiting reagent.", "Mr: phenylamine 93.0; ethanoic anhydride 102.0; N-phenylethanamide 135.0."],
        answer: 70.1, unit: "%", tolerance: 1.0, steps: ["Phenylamine: 4.0 x 1.02 = 4.08 g; n = 4.08 / 93.0 = 0.0439 mol", "Ethanoic anhydride: 6.0 x 1.08 = 6.48 g; n = 6.48 / 102.0 = 0.0635 mol, so phenylamine is limiting", "Theoretical mass = 0.0439 x 135.0 = 5.92 g", "4.15 / 5.92 x 100 = 70.1%"] },
    ],
  },
];
