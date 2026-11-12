/**
 * Short AS physical drills from the Science Skool worksheets: shapes of
 * molecules, collision theory, Le Chatelier and oxidation numbers. All tier 1.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const shape = (label, formula, name, angle, pairs) => ({
  label, type: "short", marks: 2, q: `For ${formula}, name the shape of the molecule, give the bond angle and state the numbers of bonding pairs and lone pairs around the central atom.`,
  ms: [`${name}, bond angle ${angle}`, `${pairs}`],
});
const oxNum = (label, species, element, answer) => ({
  label, type: "calc", marks: 1, q: `Give the oxidation number of ${element} in ${species}.`,
  answer, unit: "", tolerance: 0, steps: [`${element} in ${species}: ${answer >= 0 ? "+" : ""}${answer}`],
});
const yieldMcq = (label, q, answer, explanation) => ({
  label, type: "mcq", marks: 1, q, options: { A: "Increases", B: "Decreases", C: "No change" }, answer, explanation,
});

export const SS_SHAPES = [
  {
    id: "ss-shape-001", board: ALL, tags: ["bonding", "shapes"], tier: 1, source: SS,
    title: "Shapes of simple molecules",
    context: "Use the electron pair repulsion theory: count the bonding pairs and lone pairs around the central atom.",
    parts: [
      shape("a", "CH4", "Tetrahedral", "109.5°", "4 bonding pairs, 0 lone pairs"),
      shape("b", "BeCl2", "Linear", "180°", "2 bonding pairs, 0 lone pairs"),
      shape("c", "BCl3", "Trigonal planar", "120°", "3 bonding pairs, 0 lone pairs"),
      shape("d", "PCl5", "Trigonal bipyramidal", "120° and 90°", "5 bonding pairs, 0 lone pairs"),
      shape("e", "NH3", "(Trigonal) pyramidal", "107°", "3 bonding pairs, 1 lone pair"),
      shape("f", "SF6", "Octahedral", "90°", "6 bonding pairs, 0 lone pairs"),
    ],
  },
  {
    id: "ss-shape-002", board: ALL, tags: ["bonding", "shapes", "ions"], tier: 1, source: SS,
    title: "Shapes of molecules and ions with multiple bonds",
    context: "A double bond counts as one region of electron density. Remember to add an electron for each negative charge.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Name the shape of a CO2 molecule and give the bond angle.", ms: ["Linear", "180° (two bonding regions, no lone pairs on carbon)"] },
      { label: "b", type: "short", marks: 2, q: "Name the shape of an SO2 molecule and give the approximate bond angle.", ms: ["Bent / V-shaped / non-linear", "About 119° (two bonding regions and one lone pair on sulfur)"], allow: ["Any angle from 117° to 120°"] },
      { label: "c", type: "short", marks: 2, q: "Name the shape of a CO32- ion and give the bond angle.", ms: ["Trigonal planar", "120° (three bonding regions, no lone pairs on carbon)"] },
      { label: "d", type: "short", marks: 2, q: "Name the shape of an SO42- ion and give the bond angle.", ms: ["Tetrahedral", "109.5° (four bonding regions, no lone pairs on sulfur)"] },
      { label: "e", type: "short", marks: 2, q: "Name the shape of an NO3- ion and give the bond angle.", ms: ["Trigonal planar", "120° (three bonding regions, no lone pairs on nitrogen)"] },
    ],
  },
];

export const SS_REACTION_RATES = [
  {
    id: "ss-rate-001", board: ALL, tags: ["rates", "maxwell-boltzmann", "collision-theory"], tier: 1, source: SS,
    title: "Why cooling preserves food",
    context: "Food is preserved from decay by cooling.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Describe how the Maxwell-Boltzmann distribution of molecular energies at a lower temperature differs from the distribution at a higher temperature.",
        ms: ["The peak is higher and moves to lower energy at the lower temperature", "Fewer molecules have energy greater than the activation energy (smaller area under the curve beyond Ea); the area under both curves is the same"] },
      { label: "b", type: "short", marks: 2, q: "Explain, with reference to the distribution, why a decrease in temperature decreases the reaction rate.",
        ms: ["Molecules have less kinetic energy, so fewer collisions have energy greater than or equal to the activation energy", "Fewer successful collisions per unit time, so the rate is lower"] },
    ],
  },
  {
    id: "ss-rate-002", board: ALL, tags: ["rates", "catalysis", "definitions"], tier: 1, source: SS,
    title: "Catalytic converters",
    context: "Catalytic converters contain catalysts that help to break down harmful exhaust gases.",
    parts: [
      { label: "a", type: "short", marks: 1, q: "What is meant by activation energy?", ms: ["The minimum energy needed for a collision between molecules to lead to a reaction"] },
      { label: "b", type: "short", marks: 1, q: "What is a catalyst?", ms: ["A substance that speeds up a reaction without being used up / chemically unchanged at the end"] },
      { label: "c", type: "short", marks: 2, q: "How do catalysts work?", ms: ["Provide an alternative reaction route / pathway", "With a lower activation energy, so more collisions have enough energy to react"] },
    ],
  },
  {
    id: "ss-rate-003", board: ALL, tags: ["rates", "collision-theory", "catalysis"], tier: 1, source: SS,
    title: "Rate in the Haber process",
    context: "Ammonia is produced by reacting gaseous nitrogen with gaseous hydrogen.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Explain how a high pressure increases the rate of reaction.",
        ms: ["More molecules in the same volume / molecules closer together", "More frequent collisions, so a faster rate"] },
      { label: "b", type: "short", marks: 1, q: "Explain why an iron catalyst is used.", ms: ["Speeds up the reaction (lower activation energy) so more ammonia is made per day / lower temperature can be used"] },
    ],
  },
  {
    id: "ss-rate-004", board: ALL, tags: ["rates", "collision-theory"], tier: 1, source: SS,
    title: "Activation energy in everyday reactions",
    parts: [
      { label: "a", type: "short", marks: 2, q: "White phosphorus burns spontaneously in air to make phosphorus oxide. Comment on the activation energy of this reaction and explain your reasoning.",
        ms: ["The activation energy is very low", "So molecules at room temperature already have enough energy to react on collision"] },
      { label: "b", type: "short", marks: 2, q: "The reaction of nitrogen with oxygen in the air is exothermic. Explain why the atmosphere is not on fire.",
        ms: ["The reaction has a very high activation energy", "Because of the very strong triple bond in N2 (few collisions at room temperature have enough energy)"] },
      { label: "c", type: "short", marks: 1, q: "Suggest what could be done to help nitrogen and oxygen in the air react.", ms: ["Use a catalyst or heat the air (high temperature, as in lightning or a car engine)"] },
    ],
  },
];

export const SS_EQUILIBRIA = [
  {
    id: "ss-eqm-001", board: ALL, tags: ["equilibria", "le-chatelier"], tier: 1, source: SS,
    title: "Effect of pressure on yield and rate",
    context: "For each gaseous equilibrium, consider the effect of increasing the pressure.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "State the effect of increasing the pressure on the yield and on the rate for 4NH3(g) + 5O2(g) ⇌ 4NO(g) + 6H2O(g).",
        ms: ["Yield decreases: 9 moles of gas on the left and 10 on the right, so the equilibrium shifts to the side with fewer gas molecules (the left)", "Rate increases"] },
      { label: "b", type: "short", marks: 2, q: "State the effect of increasing the pressure on the yield and on the rate for 2NO2(g) ⇌ N2O4(g).",
        ms: ["Yield increases: fewer gas molecules on the right", "Rate increases"] },
      { label: "c", type: "short", marks: 2, q: "State the effect of increasing the pressure on the yield and on the rate for H2(g) + I2(g) ⇌ 2HI(g).",
        ms: ["No change in yield: the same number of gas molecules on each side", "Rate increases"] },
    ],
  },
  {
    id: "ss-eqm-002", board: ALL, tags: ["equilibria", "le-chatelier"], tier: 1, source: SS,
    title: "Effect of temperature on yield and rate",
    parts: [
      { label: "a", type: "short", marks: 2, q: "State the effect of decreasing the temperature on the yield and on the rate for 4NH3(g) + 5O2(g) ⇌ 4NO(g) + 6H2O(g), for which ΔH = -905 kJ mol-1.",
        ms: ["Yield increases: the forward reaction is exothermic, so lowering the temperature favours it", "Rate decreases"] },
      { label: "b", type: "short", marks: 2, q: "State the effect of decreasing the temperature on the yield and on the rate for CaCO3(s) ⇌ CaO(s) + CO2(g), which is endothermic.",
        ms: ["Yield decreases: the forward reaction is endothermic, so lowering the temperature favours the backward (exothermic) reaction", "Rate decreases"] },
      { label: "c", type: "short", marks: 2, q: "State the effect of decreasing the temperature on the yield and on the rate for acid + alcohol ⇌ ester + water, for which ΔH is zero.",
        ms: ["No change in yield: neither direction is favoured when ΔH = 0", "Rate decreases"] },
    ],
  },
  {
    id: "ss-eqm-003", board: ALL, tags: ["equilibria", "le-chatelier", "industrial"], tier: 1, source: SS,
    title: "Conditions for the Haber process",
    context: "Ammonia is made by the Haber process: N2(g) + 3H2(g) ⇌ 2NH3(g). The forward reaction is exothermic.",
    parts: [
      yieldMcq("a", "The temperature is increased. What happens to the equilibrium yield of ammonia?", "B", "The forward reaction is exothermic, so a higher temperature shifts the equilibrium to the left."),
      yieldMcq("b", "The pressure is increased. What happens to the equilibrium yield of ammonia?", "A", "Four moles of gas become two, so higher pressure shifts the equilibrium to the right."),
      yieldMcq("c", "A catalyst is added. What happens to the equilibrium yield of ammonia?", "C", "A catalyst speeds up both directions equally, so the position of equilibrium is unchanged; the yield is just reached faster."),
      yieldMcq("d", "The temperature is increased. What happens to the rate of reaction?", "A", "More collisions have energy greater than the activation energy."),
      yieldMcq("e", "The pressure is increased. What happens to the rate of reaction?", "A", "Molecules are closer together, so collisions are more frequent."),
      yieldMcq("f", "A catalyst is added. What happens to the rate of reaction?", "A", "The catalyst provides a route with a lower activation energy."),
      { label: "g", type: "short", marks: 3, q: "Suggest the optimum conditions for the production of ammonia, remembering that the best yield must be obtained at the fastest rate. Explain your choice.",
        ms: ["High pressure: increases both yield and rate (limited by cost and safety)", "A catalyst (iron): increases the rate without changing the yield", "A compromise (moderate) temperature: a high temperature gives a good rate but a poor yield, a low temperature a good yield but a slow rate"] },
    ],
  },
];

export const SS_REDOX = [
  {
    id: "ss-redox-001", board: ALL, tags: ["redox", "definitions"], tier: 1, source: SS,
    title: "Identifying what is oxidised and reduced",
    context: "Oxidation is loss of electrons (oxidation number goes up); reduction is gain of electrons (oxidation number goes down).",
    parts: [
      { label: "a", type: "short", marks: 2, q: "In C + O2 → CO2, identify the species being oxidised and the species being reduced.", ms: ["C is oxidised (0 to +4)", "O2 is reduced (0 to -2)"] },
      { label: "b", type: "short", marks: 2, q: "In 2Na + H2 → 2NaH, identify the species being oxidised and the species being reduced.", ms: ["Na is oxidised (0 to +1)", "H2 is reduced (0 to -1)"] },
      { label: "c", type: "short", marks: 2, q: "In Mg + CuSO4 → MgSO4 + Cu, identify the species being oxidised and the species being reduced.", ms: ["Mg is oxidised (0 to +2)", "Cu2+ is reduced (+2 to 0)"] },
      { label: "d", type: "short", marks: 2, q: "In Zn + 2HCl → ZnCl2 + H2, identify the species being oxidised and the species being reduced.", ms: ["Zn is oxidised (0 to +2)", "H+ is reduced (+1 to 0)"] },
      { label: "e", type: "short", marks: 2, q: "In 2HNO3 + Mg → Mg(NO3)2 + H2, identify the species being oxidised and the species being reduced.", ms: ["Mg is oxidised (0 to +2)", "H+ is reduced (+1 to 0)"] },
    ],
  },
  {
    id: "ss-redox-002", board: ALL, tags: ["redox", "definitions", "half-equations"], tier: 1, source: SS,
    title: "Oxidising agents, reducing agents and half-equations",
    context: "An oxidising agent accepts electrons (and is itself reduced); a reducing agent donates electrons (and is itself oxidised).",
    parts: [
      { label: "a", type: "short", marks: 2, q: "In C + O2 → CO2, identify the oxidising agent and the reducing agent.", ms: ["O2 is the oxidising agent", "C is the reducing agent"] },
      { label: "b", type: "short", marks: 2, q: "In 2Na + H2 → 2NaH, identify the oxidising agent and the reducing agent.", ms: ["H2 is the oxidising agent", "Na is the reducing agent"] },
      { label: "c", type: "short", marks: 2, q: "In Mg + CuSO4 → MgSO4 + Cu, identify the oxidising agent and the reducing agent.", ms: ["CuSO4 / Cu2+ is the oxidising agent", "Mg is the reducing agent"] },
      { label: "d", type: "short", marks: 2, q: "In Zn + 2HCl → ZnCl2 + H2, identify the oxidising agent and the reducing agent.", ms: ["HCl / H+ is the oxidising agent", "Zn is the reducing agent"] },
      { label: "e", type: "short", marks: 2, q: "Write two half-equations for Mg + CuSO4 → MgSO4 + Cu.", ms: ["Mg → Mg2+ + 2e-", "Cu2+ + 2e- → Cu"] },
      { label: "f", type: "short", marks: 2, q: "Write two half-equations for Zn + 2HCl → ZnCl2 + H2.", ms: ["Zn → Zn2+ + 2e-", "2H+ + 2e- → H2"] },
      { label: "g", type: "short", marks: 2, q: "Write two half-equations for 2Na + H2 → 2NaH.", ms: ["Na → Na+ + e- (or 2Na → 2Na+ + 2e-)", "H2 + 2e- → 2H-"] },
    ],
  },
  {
    id: "ss-redox-003", board: ALL, tags: ["redox", "oxidation-states"], tier: 1, source: SS,
    title: "Oxidation numbers",
    context: "Rules: uncombined elements 0; H is +1 (except in metal hydrides), O is -2 (except in peroxides), group 1 metals +1, group 2 metals +2, halogens usually -1; the sum of oxidation numbers equals the overall charge.",
    parts: [
      oxNum("a", "H2O", "H", 1), oxNum("b", "PCl3", "P", 3), oxNum("c", "PCl5", "P", 5), oxNum("d", "H2SO4", "S", 6), oxNum("e", "H2S", "S", -2),
      oxNum("f", "PbO2", "Pb", 4), oxNum("g", "PbO", "Pb", 2), oxNum("h", "CCl4", "C", 4), oxNum("i", "HNO3", "N", 5), oxNum("j", "Mg2+", "Mg", 2),
      oxNum("k", "MgSO4", "S", 6), oxNum("l", "MgCO3", "Mg", 2), oxNum("m", "MnO2", "Mn", 4), oxNum("n", "KNO3", "N", 5), oxNum("o", "CO2", "C", 4),
      oxNum("p", "O2-", "O", -2), oxNum("q", "FeI3", "Fe", 3), oxNum("r", "CuO", "Cu", 2), oxNum("s", "K2O", "K", 1), oxNum("t", "Br-", "Br", -1),
    ],
  },
];
