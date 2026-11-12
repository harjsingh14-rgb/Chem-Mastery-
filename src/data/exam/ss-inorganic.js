/**
 * Inorganic drills from the Science Skool worksheets: group 2, group 7,
 * displacement reactions, intermolecular forces and Period 3 oxides.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

const imf = (label, molecules, forces, order) => ({
  label, type: "short", marks: 2,
  q: `For ${molecules}, identify the strongest type of intermolecular force present in each molecule, then order the molecules by boiling point from lowest to highest.`,
  ms: [forces, order],
});

export const SS_BONDING_IMF = [
  {
    id: "ss-imf-001", board: ALL, tags: ["bonding", "intermolecular-forces", "hydrogen-bonding", "boiling-points"], tier: 1, source: SS,
    title: "Intermolecular forces and boiling points",
    context: "The three types of intermolecular force are induced dipole-dipole (van der Waals / London) forces, permanent dipole-dipole forces and hydrogen bonding.",
    parts: [
      imf("a", "CH4, SiH4 and SnH4", "All three: induced dipole-dipole (van der Waals) forces only", "CH4 < SiH4 < SnH4 (more electrons, stronger induced dipole-dipole forces)"),
      imf("b", "NH3, PH3 and AsH3", "NH3: hydrogen bonding; PH3 and AsH3: induced dipole-dipole (with weak permanent dipoles)", "PH3 < AsH3 < NH3 (hydrogen bonding in NH3 outweighs the larger induced dipoles in AsH3)"),
      imf("c", "HF, HCl and HBr", "HF: hydrogen bonding; HCl and HBr: permanent dipole-dipole (and induced dipole-dipole)", "HCl < HBr < HF"),
      imf("d", "CH3F, CH3Cl and CH4", "CH3F and CH3Cl: permanent dipole-dipole; CH4: induced dipole-dipole only", "CH4 < CH3F < CH3Cl (CH3Cl has more electrons, so stronger induced dipole-dipole forces as well)"),
      imf("e", "HF, H2O and NH3", "All three: hydrogen bonding", "NH3 < HF < H2O (water forms two hydrogen bonds per molecule on average; N-H hydrogen bonds are the weakest)"),
    ],
  },
];

export const SS_GROUP_2 = [
  {
    id: "ss-g2-001", board: ALL, tags: ["group-2", "periodicity", "atomic-radius", "ionisation-energy"], tier: 1, source: SS,
    title: "Trends down group 2",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Arrange the ions Ba2+, Mg2+, Sr2+ and Ca2+ in order of increasing ionic radius.", ms: ["Mg2+ < Ca2+ < Sr2+ < Ba2+", "Correct order with all four ions"] },
      { label: "b", type: "short", marks: 3, q: "State and explain the change in atomic radius with increasing atomic number in group 2.",
        ms: ["Atomic radius increases down the group", "Each element has one more occupied electron shell", "The extra shielding outweighs the increase in nuclear charge, so the outer electrons are further from the nucleus"] },
      { label: "c", type: "extended", marks: 5, q: "Which of the group 2 elements (Mg to Ba) would you expect to react most vigorously with water, and why?",
        ms: ["Barium", "Reaction involves loss of the two outer electrons (M → M2+ + 2e-)", "Barium has the largest atomic radius / outer electrons furthest from the nucleus", "Most shielding by inner shells", "Lowest (first and second) ionisation energies, so electrons are lost most easily"] },
    ],
  },
  {
    id: "ss-g2-002", board: ALL, tags: ["group-2", "equations", "oxides", "hydroxides"], tier: 1, source: SS,
    title: "Reactions of calcium and its compounds",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Write a balanced equation, with state symbols, for the reaction between calcium and oxygen.", ms: ["2Ca(s) + O2(g) → 2CaO(s)", "Balanced with state symbols"] },
      { label: "b", type: "short", marks: 2, q: "Write a balanced equation, with state symbols, for the reaction between calcium oxide and water.", ms: ["CaO(s) + H2O(l) → Ca(OH)2(s) (accept (aq))", "Balanced with state symbols"] },
      { label: "c", type: "short", marks: 2, q: "Write a balanced equation, with state symbols, for the reaction between calcium hydroxide solution and carbon dioxide.", ms: ["Ca(OH)2(aq) + CO2(g) → CaCO3(s) + H2O(l)", "Balanced with state symbols"] },
      { label: "d", type: "short", marks: 3, q: "Write an equation for the thermal decomposition of a group 2 nitrate, M(NO3)2, and state for which group 2 metal (Mg to Ba) this reaction occurs least easily and most easily.",
        ms: ["2M(NO3)2 → 2MO + 4NO2 + O2", "Least easily: barium", "Most easily: magnesium (the small, highly polarising Mg2+ ion distorts the nitrate ion most)"] },
    ],
  },
  {
    id: "ss-g2-003", board: ALL, tags: ["group-2", "energetics", "lattice-enthalpy", "ionisation-energy"], tier: 2, source: SS,
    title: "Why magnesium burns more vigorously than barium",
    parts: [
      { label: "a", type: "extended", marks: 4, q: "Despite the greater first and second ionisation energies of magnesium, it appears to burn much more vigorously in air than barium does. Suggest an explanation.",
        ms: ["The overall enthalpy change depends on the lattice enthalpy as well as the ionisation energies", "Mg2+ is much smaller than Ba2+, so MgO has a far more exothermic lattice enthalpy, which more than repays the extra ionisation energy", "The reaction of magnesium is therefore more exothermic overall / the bright white flame reflects the energy released", "Barium is coated with a layer of oxide (and stored under oil), so the clean metal surface is not exposed; its reaction also appears less vigorous because the reaction of the bulk metal is limited by this coating"] },
    ],
  },
];

export const SS_GROUP_7 = [
  {
    id: "ss-g7-001", board: ALL, tags: ["halogens", "intermolecular-forces", "oxidising-agents", "redox"], tier: 1, source: SS,
    title: "Physical states and oxidising power of the halogens",
    parts: [
      { label: "a", type: "short", marks: 3, q: "Chlorine is a gas at room temperature while iodine is a solid under the same conditions. Explain the cause of the difference in their physical states.",
        ms: ["Both are simple molecular (diatomic) with induced dipole-dipole (van der Waals) forces between molecules", "Iodine molecules have more electrons, so the induced dipoles and the forces between molecules are stronger", "More energy is needed to separate iodine molecules, so iodine has the higher melting and boiling points"] },
      { label: "b", type: "short", marks: 2, q: "What is meant by the term oxidising agent?", ms: ["A species that accepts electrons from another species (oxidises it)", "And is itself reduced"] },
      { label: "c", type: "short", marks: 2, q: "Write an equation which shows chlorine oxidising iodide ions.", ms: ["Cl2 + 2I- → 2Cl- + I2", "Balanced, with correct charges"] },
      { label: "d", type: "short", marks: 3, q: "Why do the halogens become less powerful oxidising agents with increasing atomic number?",
        ms: ["The atoms get larger: the outer shell is further from the nucleus", "There is more shielding by inner electrons", "So the nucleus attracts an incoming electron less strongly and the halogen gains an electron less readily"] },
      { label: "e", type: "short", marks: 3, q: "Which halide ion (Cl-, Br- or I-) is the most powerful reducing agent? Write a balanced equation for the reaction between this halide ion and bromine.",
        ms: ["Iodide", "2I- + Br2 → I2 + 2Br-", "Balanced with correct charges"] },
    ],
  },
  {
    id: "ss-g7-002", board: ALL, tags: ["halogens", "halides", "redox", "half-equations", "sulfuric-acid"], tier: 2, source: SS,
    title: "Halides with concentrated sulfuric acid",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Hydrogen chloride can be prepared in the laboratory from sodium chloride. Name the other reagent required and state the reaction conditions.",
        ms: ["Concentrated sulfuric acid", "Added to the solid at room temperature (no heating needed)"] },
      { label: "b", type: "short", marks: 2, q: "Write a balanced equation for the reaction in which hydrogen chloride is formed.", ms: ["NaCl + H2SO4 → NaHSO4 + HCl", "Balanced (accept 2NaCl + H2SO4 → Na2SO4 + 2HCl)"] },
      { label: "c", type: "extended", marks: 6, q: "In a similar reaction involving sodium bromide, red-brown fumes and sulfur dioxide are formed and the yield of hydrogen bromide is poor. Write half-equations for the formation of the red-brown fumes and of the sulfur dioxide, and hence write a balanced equation for the redox reaction which occurs.",
        ms: ["Red-brown fumes are bromine: 2Br- → Br2 + 2e-", "H2SO4 + 2H+ + 2e- → SO2 + 2H2O", "Overall: 2Br- + H2SO4 + 2H+ → Br2 + SO2 + 2H2O (or 2HBr + H2SO4 → Br2 + SO2 + 2H2O)", "Oxidation state of bromine -1 → 0 (oxidised)", "Oxidation state of sulfur +6 → +4 (reduced)", "Electrons balanced in the overall equation"] },
      { label: "d", type: "short", marks: 3, q: "Explain the differing behaviour of sodium chloride and sodium bromide in these reactions.",
        ms: ["Bromide is a stronger reducing agent than chloride", "The bromide ion is larger, so its outer electrons are further from the nucleus / more shielded and more easily lost", "Bromide reduces sulfuric acid (to SO2) whereas chloride cannot, so HCl survives but HBr is oxidised"] },
    ],
  },
  {
    id: "ss-g7-003", board: ALL, tags: ["halogens", "acids-bases", "disproportionation", "oxidation-states"], tier: 2, source: SS,
    title: "Hydrogen fluoride and the disproportionation of chlorine",
    parts: [
      { label: "a", type: "short", marks: 3, q: "Hydrogen fluoride dissolves in water to form an acidic solution, but the solution is more weakly acidic than that formed when hydrogen chloride dissolves in water. Explain this observation.",
        ms: ["The H-F bond is much stronger (shorter, fluorine is small) than the H-Cl bond", "So HF only partially dissociates in water (weak acid) whereas HCl fully dissociates (strong acid)", "HF molecules are also held by hydrogen bonds to water / to each other, which further reduces dissociation"] },
      { label: "b", type: "extended", marks: 5, q: "Write a balanced equation for the reaction between chlorine and aqueous sodium hydroxide at room temperature. Use the concept of oxidation states to show that a disproportionation reaction has taken place.",
        ms: ["Cl2 + 2NaOH → NaCl + NaClO + H2O", "Chlorine in Cl2 has oxidation state 0", "In NaCl chlorine is -1 (reduced)", "In NaClO chlorine is +1 (oxidised)", "The same element is simultaneously oxidised and reduced, which is disproportionation"] },
    ],
  },
  {
    id: "ss-g7-004", board: ALL, tags: ["halogens", "halides", "displacement", "redox", "half-equations"], tier: 1, source: SS,
    title: "Halogen displacement reactions",
    parts: [
      { label: "a", type: "short", marks: 2, q: "When chlorine gas is bubbled through potassium iodide solution a grey-black precipitate of iodine forms. Write the ionic half-equations for chlorine and for iodide ions, including state symbols.",
        ms: ["Cl2(g) + 2e- → 2Cl-(aq)", "2I-(aq) → I2(s) + 2e-"] },
      { label: "b", type: "short", marks: 2, q: "Identify the species being oxidised and the species being reduced in this reaction, and combine the half-equations to give the overall equation.",
        ms: ["I- is oxidised; Cl2 is reduced", "Cl2(g) + 2I-(aq) → 2Cl-(aq) + I2(s)"] },
      { label: "c", type: "short", marks: 3, q: "Chlorine displaces bromine from potassium bromide solution: Cl2(g) + 2Br-(aq) → 2Cl-(aq) + Br2(aq). Write the two ionic half-equations and identify the species oxidised and reduced.",
        ms: ["Cl2 + 2e- → 2Cl-", "2Br- → Br2 + 2e-", "Br- oxidised, Cl2 reduced"] },
      { label: "d", type: "short", marks: 3, q: "Bromine water is added to potassium iodide solution: Br2(aq) + 2I-(aq) → I2(s) + 2Br-(aq). State what you would see, write the two half-equations and identify the species oxidised and reduced.",
        ms: ["The solution turns brown / dark brown (iodine forms; grey-black solid may appear)", "Br2 + 2e- → 2Br- and 2I- → I2 + 2e-", "I- oxidised, Br2 reduced"] },
    ],
  },
];

export const SS_PERIOD_3 = [
  {
    id: "ss-p3-001", board: ALL, tags: ["period-3", "periodicity", "oxides", "acids-bases", "equations"], tier: 1, source: SS,
    title: "Period 3 oxides in water",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Write an equation for sodium oxide added to water and predict the approximate pH of the solution.", ms: ["Na2O + H2O → 2NaOH", "pH 13 to 14"] },
      { label: "b", type: "short", marks: 2, q: "Write an equation for sulfur dioxide added to water and predict the approximate pH of the solution.", ms: ["SO2 + H2O → H2SO3", "pH 2 to 3"] },
      { label: "c", type: "short", marks: 2, q: "What is the relationship between bond type in the oxides of the Period 3 elements and the pH of the solutions which result from adding the oxides to water?",
        ms: ["Ionic oxides (Na2O, MgO) give alkaline solutions (release O2-, which forms OH-)", "Covalent oxides (SO2, SO3, P4O10) give acidic solutions"] },
      { label: "d", type: "short", marks: 2, q: "From Na2O, MgO, Al2O3, SiO2, P4O10 and SO3, identify one oxide that can form a solution with pH less than 3 and one that can form a solution with pH greater than 12.", ms: ["pH < 3: P4O10 or SO3", "pH > 12: Na2O"] },
    ],
  },
  {
    id: "ss-p3-002", board: ALL, tags: ["period-3", "periodicity", "oxides", "structure", "bonding"], tier: 2, source: SS,
    title: "Structure and bonding of Period 3 oxides",
    context: "The melting points of some Period 3 oxides are given in random order: A 2852 °C; B -73 °C; C 1610 °C; D 1275 °C; E 300 °C.",
    parts: [
      { label: "a", type: "short", marks: 3, q: "The oxide of element Z (one of Na, Mg, Al, Si, P) is a crystalline solid with a very high melting point, classified as acidic but insoluble in water. Deduce the type of crystal, identify Z and write an equation illustrating the acidic nature of the oxide.",
        ms: ["Macromolecular / giant covalent", "Silicon (SiO2)", "SiO2 + 2NaOH → Na2SiO3 + H2O"] },
      { label: "b", type: "short", marks: 3, q: "Using the letters A to E, give the two oxides which have simple molecular structures and explain your answer.",
        ms: ["B and E", "Lowest melting points", "Only weak intermolecular forces (van der Waals) to overcome between molecules"] },
      { label: "c", type: "short", marks: 2, q: "Give a simple chemical test which could show which of the oxides is sodium oxide, and the observation you would make.", ms: ["Add to water and test with universal indicator (or pH paper)", "Turns purple / blue, pH about 14 (strongly alkaline)"] },
      { label: "d", type: "short", marks: 2, q: "Give the formula of an oxide of a Period 3 element in which the element is not in its highest oxidation state, with the oxidation state of the element. Write an equation for the formation of phosphorus(V) oxide from phosphorus and oxygen.",
        ms: ["SO2, sulfur +4 (or P4O6, phosphorus +3)", "P4 + 5O2 → P4O10 (accept 4P + 5O2 → P4O10)"] },
      { label: "e", type: "extended", marks: 4, q: "Explain, in terms of their type of structure and bonding, why P4O10 can be vaporised by gentle heat but SiO2 cannot.",
        ms: ["P4O10 is simple molecular (covalent bonds within molecules)", "Only weak induced dipole-dipole (van der Waals) forces between molecules need to be overcome", "SiO2 is macromolecular / giant covalent", "Many strong covalent bonds must be broken, which needs a very large amount of energy"] },
    ],
  },
  {
    id: "ss-p3-003", board: ALL, tags: ["period-3", "periodicity", "oxides", "acids-bases", "equations", "amphoteric"], tier: 2, source: SS,
    title: "Period 3 elements and oxides as acids and bases",
    parts: [
      { label: "a", type: "short", marks: 1, q: "Write an equation for the reaction of sodium with cold water.", ms: ["2Na + 2H2O → 2NaOH + H2"] },
      { label: "b", type: "short", marks: 2, q: "By referring to the bonding and structure of silicon, suggest why silicon does not react with cold water.",
        ms: ["Silicon is macromolecular / giant covalent", "The strong covalent bonds would need to be broken, which water cannot do (high activation energy)"] },
      { label: "c", type: "short", marks: 3, q: "Write equations for the reactions between (i) MgO and HNO3, (ii) SiO2 and NaOH, (iii) Na2O and H3PO4.",
        ms: ["MgO + 2HNO3 → Mg(NO3)2 + H2O", "SiO2 + 2NaOH → Na2SiO3 + H2O", "3Na2O + 2H3PO4 → 2Na3PO4 + 3H2O"] },
      { label: "d", type: "short", marks: 3, q: "Give the formula of a Period 3 oxide that reacts with (i) aqueous sodium hydroxide only, (ii) aqueous sulfuric acid only, (iii) both.",
        ms: ["SiO2 (or P4O10, SO2, SO3)", "Na2O or MgO", "Al2O3 (amphoteric)"] },
    ],
  },
];
