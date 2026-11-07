/**
 * DRAFT Born-Haber pilot set. NOT USED BY THE APP.
 *
 * Written by Claude in the style of exam-board questions, from standard data
 * book values. Every question needs checking by HSJ Tuition (chemistry,
 * values, mark scheme wording, marks) before it is moved into
 * exam-questions.js. See QUESTION_REVIEW_born-haber.md for a readable copy.
 *
 * Data used (kJ mol-1, standard data book values, rounded):
 *   KCl:   dHf -437, dHat(K) +89, dHat(1/2 Cl2) +122, IE1(K) +419, EA1(Cl) -349
 *   NaCl:  dHf -411, dHat(Na) +108, dHat(1/2 Cl2) +121, IE1(Na) +496, EA1(Cl) -349
 *   MgO:   dHf -602, dHat(Mg) +148, IE1(Mg) +738, IE2(Mg) +1451, dHat(1/2 O2) +249, EA1(O) -141, EA2(O) +798
 *   CaCl2: dHf -796, dHat(Ca) +178, IE1(Ca) +590, IE2(Ca) +1145, dHat(1/2 Cl2) +122, EA1(Cl) -349
 *   KBr:   dHf -394, dHat(K) +89, dHat(1/2 Br2) +112, IE1(K) +419, dHlatt(formation) -671
 *   Hydration: Na+ -406, Cl- -364; dHlatt(formation) NaCl -787
 */

export const DRAFT_EXAM_QUESTIONS = [
  // ───────────────────────── Tier 1: scaffolded ─────────────────────────
  {
    id: "bh-001", board: "both", tags: ["born-haber", "lattice-enthalpy"], tier: 1,
    title: "KCl Born-Haber cycle, step by step",
    context: "The table gives enthalpy data for potassium chloride.",
    dataTable: [
      ["Enthalpy of formation of KCl(s)", -437],
      ["Enthalpy of atomisation of potassium", 89],
      ["Enthalpy of atomisation of chlorine", 122],
      ["First ionisation energy of potassium", 419],
      ["First electron affinity of chlorine", -349],
    ],
    parts: [
      {
        label: "a", type: "short", marks: 2,
        hints: [
          "A definition needs the amount, the states and the direction of change. What is being formed, and from what?",
          "The starting point is ions, not atoms or elements. What state are those ions in before the solid forms?",
          "Start your sentence with 'The enthalpy change when one mole of ...' and finish with the state of the ions and the conditions.",
        ],
        q: "Define the term lattice enthalpy of formation.",
        ms: [
          "Enthalpy change when one mole of an ionic solid is formed from its gaseous ions",
          "Under standard conditions (298 K and 100 kPa)",
        ],
        allow: ["Lattice enthalpy of dissociation defined the other way round, if the student states it is dissociation"],
        reject: ["Formed from its elements", "Formed from atoms"],
      },
      {
        label: "b", type: "calc", marks: 1,
        hints: [
          "Two steps are needed: the solid metal becomes gaseous atoms, then each atom loses an electron. Which two values in the table match these steps?",
          "Write K(s) to K(g) and K(g) to K+(g) + e- as separate equations, then add their enthalpy changes.",
          "Atomisation comes first, then the first ionisation energy. Both are positive, so the total is positive.",
        ],
        q: "Calculate the total enthalpy change, in kJ mol-1, for K(s) to K+(g).",
        answer: 508, unit: "kJ mol-1", tolerance: 1,
        steps: ["K(s) to K(g): +89 kJ mol-1 (atomisation)", "K(g) to K+(g) + e-: +419 kJ mol-1 (first ionisation energy)", "Total = 89 + 419 = +508 kJ mol-1"],
      },
      {
        label: "c", type: "calc", marks: 1,
        hints: [
          "Chlorine starts as a diatomic molecule. Which step turns 1/2 Cl2(g) into Cl(g), and which step then adds the electron?",
          "One of the two values is positive and one is negative. Check the sign of each before you add them.",
          "Atomisation of chlorine is per mole of Cl atoms formed, so the value in the table is already for 1/2 Cl2. Combine it with the first electron affinity.",
        ],
        q: "Calculate the total enthalpy change, in kJ mol-1, for 1/2 Cl2(g) to Cl-(g).",
        answer: -227, unit: "kJ mol-1", tolerance: 1,
        steps: ["1/2 Cl2(g) to Cl(g): +122 kJ mol-1 (atomisation)", "Cl(g) + e- to Cl-(g): -349 kJ mol-1 (first electron affinity)", "Total = 122 + (-349) = -227 kJ mol-1"],
      },
      {
        label: "d", type: "calc", marks: 2,
        hints: [
          "Hess's law: the direct route (formation from the elements) equals the indirect route through the gaseous ions.",
          "Write dHf = (b) + (c) + dHlatt, then rearrange to make dHlatt the subject before putting any numbers in.",
          "Substitute -437 for dHf and your answers to (b) and (c). Expect a large negative number.",
        ],
        q: "Use your answers to parts (b) and (c) to calculate the lattice enthalpy of formation of potassium chloride.",
        answer: -718, unit: "kJ mol-1", tolerance: 2,
        steps: ["dHf = (K steps) + (Cl steps) + dHlatt", "-437 = 508 + (-227) + dHlatt", "dHlatt = -437 - 281 = -718 kJ mol-1"],
      },
    ],
  },
  {
    id: "bh-002", board: "both", tags: ["born-haber", "definitions"], tier: 1,
    title: "Steps in the NaCl cycle",
    context: "This question is about the Born-Haber cycle for sodium chloride.",
    dataTable: [
      ["Enthalpy of formation of NaCl(s)", -411],
      ["Enthalpy of atomisation of sodium", 108],
      ["Enthalpy of atomisation of chlorine", 121],
      ["First ionisation energy of sodium", 496],
      ["First electron affinity of chlorine", -349],
    ],
    parts: [
      {
        label: "a", type: "mcq", marks: 1,
        hints: [
          "Electron affinity starts from one mole of gaseous atoms, not molecules.",
          "Only one electron is gained per atom, and the product is a gaseous 1- ion.",
        ],
        q: "Which equation represents the first electron affinity of chlorine?",
        options: { A: "Cl2(g) + 2e- to 2Cl-(g)", B: "Cl(g) + e- to Cl-(g)", C: "1/2 Cl2(g) + e- to Cl-(g)", D: "Cl(g) to Cl+(g) + e-" },
        answer: "B",
        explanation: "The first electron affinity is the enthalpy change when one mole of gaseous atoms each gain one electron to form one mole of gaseous 1- ions. It starts from gaseous atoms, not molecules.",
      },
      {
        label: "b", type: "mcq", marks: 1,
        hints: [
          "Atomisation forms one mole of gaseous atoms from the element in its standard state.",
          "Chlorine's standard state is Cl2(g). How much Cl2 gives exactly one mole of Cl atoms?",
        ],
        q: "Which equation represents the enthalpy of atomisation of chlorine?",
        options: { A: "Cl2(g) to 2Cl(g)", B: "1/2 Cl2(g) to Cl(g)", C: "Cl2(l) to Cl2(g)", D: "Cl(g) to Cl-(g)" },
        answer: "B",
        explanation: "Enthalpy of atomisation is defined per mole of gaseous atoms formed, so it is for 1/2 Cl2(g). Option A is the bond dissociation enthalpy, which forms two moles of atoms.",
      },
      {
        label: "c", type: "short", marks: 2,
        hints: [
          "Think about the charges involved: what is the incoming electron attracted to as it approaches the chlorine atom?",
          "When an attraction forms, is energy released or absorbed?",
          "Mention the positive nucleus and the negative electron, then state what happens to the energy when the attraction forms.",
        ],
        q: "Explain why the first electron affinity of chlorine is exothermic.",
        ms: [
          "The added electron is attracted to the (positive) nucleus",
          "Energy is released when this attraction forms",
        ],
        reject: ["To gain a full outer shell / to become stable (with no reference to attraction or energy released)"],
      },
      {
        label: "d", type: "calc", marks: 2,
        hints: [
          "List the steps from the elements to the gaseous ions: atomisation of Na, ionisation of Na, atomisation of Cl, electron affinity of Cl. Then the lattice forms.",
          "dHf = (sum of the steps to gaseous ions) + dHlatt. Rearrange for dHlatt.",
          "Add 108, 496, 121 and -349 for the route to gaseous ions, then use -411 for dHf.",
        ],
        q: "Calculate the lattice enthalpy of formation of sodium chloride.",
        answer: -787, unit: "kJ mol-1", tolerance: 2,
        steps: ["-411 = 108 + 121 + 496 + (-349) + dHlatt", "-411 = 376 + dHlatt", "dHlatt = -411 - 376 = -787 kJ mol-1"],
      },
    ],
  },
  {
    id: "bh-003", board: "both", tags: ["born-haber", "definitions"], tier: 1,
    title: "Which step is which",
    parts: [
      {
        label: "a", type: "mcq", marks: 1,
        hints: [
          "Which step forms attractions rather than breaking them?",
          "Forming an ionic lattice from separate gaseous ions releases energy.",
        ],
        q: "Which enthalpy change in a Born-Haber cycle is always exothermic?",
        options: { A: "First ionisation energy", B: "Enthalpy of atomisation", C: "Lattice enthalpy of formation", D: "Second electron affinity" },
        answer: "C",
        explanation: "Forming a lattice from gaseous ions always releases energy because oppositely charged ions attract. Ionisation and atomisation always require energy, and the second electron affinity is endothermic.",
      },
      {
        label: "b", type: "mcq", marks: 1,
        hints: [
          "The potassium is already gaseous atoms, so this is not atomisation.",
          "Removing one electron from each atom in one mole of gaseous atoms is which definition?",
        ],
        q: "Which enthalpy change is represented by K(g) to K+(g) + e-?",
        options: { A: "Enthalpy of atomisation", B: "First ionisation energy", C: "First electron affinity", D: "Enthalpy of formation" },
        answer: "B",
        explanation: "Removing one electron from each atom in one mole of gaseous atoms to form one mole of gaseous 1+ ions is the first ionisation energy.",
      },
      {
        label: "c", type: "mcq", marks: 1,
        hints: [
          "Dissociation is the reverse of formation.",
          "Reversing a process reverses the sign of the enthalpy change but keeps the same size.",
        ],
        q: "The lattice enthalpy of formation of NaCl is -787 kJ mol-1. What is the lattice enthalpy of dissociation of NaCl?",
        options: { A: "-787 kJ mol-1", B: "+787 kJ mol-1", C: "0 kJ mol-1", D: "-411 kJ mol-1" },
        answer: "B",
        explanation: "Dissociation is the reverse process (solid to gaseous ions), so it has the same magnitude and the opposite sign.",
      },
      {
        label: "d", type: "mcq", marks: 1,
        hints: [
          "Lattice enthalpy depends on ionic charge and ionic radius. All four have 1+ and 1- ions, so compare sizes.",
          "Smaller ions get closer together and attract more strongly.",
        ],
        q: "Which compound has the most exothermic lattice enthalpy of formation?",
        options: { A: "NaCl", B: "KCl", C: "NaBr", D: "KBr" },
        answer: "A",
        explanation: "Na+ is smaller than K+ and Cl- is smaller than Br-. Smaller ions have a higher charge density, so the electrostatic attraction between them is stronger.",
      },
    ],
  },

  // ───────────────────────── Tier 2: exam standard ──────────────────────
  {
    id: "bh-004", board: "both", tags: ["born-haber", "lattice-enthalpy"], tier: 2,
    title: "Magnesium oxide",
    context: "The table gives enthalpy data for magnesium oxide.",
    dataTable: [
      ["Enthalpy of formation of MgO(s)", -602],
      ["Enthalpy of atomisation of magnesium", 148],
      ["First ionisation energy of magnesium", 738],
      ["Second ionisation energy of magnesium", 1451],
      ["Enthalpy of atomisation of oxygen", 249],
      ["First electron affinity of oxygen", -141],
      ["Second electron affinity of oxygen", 798],
    ],
    parts: [
      {
        label: "a", type: "short", marks: 2,
        hints: [
          "In the second electron affinity, what is the electron being added to: an atom or an ion?",
          "What is the charge on O-, and how does a negative ion interact with an incoming electron?",
          "A repulsion has to be overcome. Say what repels what, and whether that needs energy or releases it.",
        ],
        q: "Explain why the second electron affinity of oxygen is endothermic.",
        ms: [
          "The electron is being added to a negative ion (O-)",
          "Energy is needed to overcome the repulsion between the electron and the negative ion",
        ],
      },
      {
        label: "b", type: "calc", marks: 3,
        hints: [
          "List every step: magnesium has two ionisation energies and oxygen has two electron affinities. Check you have used all seven values.",
          "Work out Mg(s) to Mg2+(g) and 1/2 O2(g) to O2-(g) as two subtotals first, then apply Hess's law.",
          "Mg subtotal: 148 + 738 + 1451. O subtotal: 249 + (-141) + 798. Then -602 = subtotals + dHlatt.",
        ],
        q: "Calculate the lattice enthalpy of formation of magnesium oxide.",
        answer: -3845, unit: "kJ mol-1", tolerance: 5,
        steps: [
          "Mg(s) to Mg2+(g): 148 + 738 + 1451 = +2337 kJ mol-1",
          "1/2 O2(g) to O2-(g): 249 + (-141) + 798 = +906 kJ mol-1",
          "dHf = 2337 + 906 + dHlatt, so -602 = 3243 + dHlatt",
          "dHlatt = -602 - 3243 = -3845 kJ mol-1",
        ],
      },
      {
        label: "c", type: "short", marks: 2,
        hints: [
          "Compare the charges on the ions in MgO with those in NaCl.",
          "Now compare the sizes: Mg2+ is smaller than Na+. Both factors affect the attraction between the ions.",
          "Link higher charge (and smaller radius) to stronger electrostatic attraction and more energy released when the lattice forms.",
        ],
        q: "The lattice enthalpy of formation of sodium chloride is -787 kJ mol-1. Explain why the lattice enthalpy of magnesium oxide is much more exothermic than that of sodium chloride.",
        ms: [
          "Mg2+ and O2- have a higher charge than Na+ and Cl- (and Mg2+ is smaller than Na+)",
          "So the electrostatic attraction between the ions is stronger (more energy released when the lattice forms)",
        ],
        allow: ["Higher charge density"],
      },
    ],
  },
  {
    id: "bh-005", board: "both", tags: ["born-haber", "lattice-enthalpy"], tier: 2,
    title: "Calcium chloride",
    context: "The table gives enthalpy data for calcium chloride.",
    dataTable: [
      ["Enthalpy of formation of CaCl2(s)", -796],
      ["Enthalpy of atomisation of calcium", 178],
      ["First ionisation energy of calcium", 590],
      ["Second ionisation energy of calcium", 1145],
      ["Enthalpy of atomisation of chlorine", 122],
      ["First electron affinity of chlorine", -349],
    ],
    parts: [
      {
        label: "a", type: "short", marks: 1,
        hints: [
          "Lattice enthalpy of formation: gaseous ions come together to form one mole of the solid.",
          "CaCl2 has two chloride ions for every calcium ion. Balance the ions and include state symbols.",
          "Left-hand side: Ca2+(g) and chloride ions. Right-hand side: CaCl2(s).",
        ],
        q: "Write an equation, including state symbols, for the process that corresponds to the lattice enthalpy of formation of calcium chloride.",
        ms: ["Ca2+(g) + 2Cl-(g) to CaCl2(s)"],
        reject: ["Missing or incorrect state symbols", "Cl2 or Cl instead of 2Cl-"],
      },
      {
        label: "b", type: "calc", marks: 3,
        hints: [
          "Two moles of Cl atoms and two moles of Cl- ions are needed. Which values must be doubled?",
          "Ca(s) to Ca2+(g) is atomisation + IE1 + IE2. Cl2(g) to 2Cl-(g) is 2 x atomisation + 2 x electron affinity.",
          "Ca subtotal: 178 + 590 + 1145. Chlorine subtotal: 2(122) + 2(-349). Then -796 = subtotals + dHlatt.",
        ],
        q: "Calculate the lattice enthalpy of formation of calcium chloride.",
        answer: -2255, unit: "kJ mol-1", tolerance: 5,
        steps: [
          "Ca(s) to Ca2+(g): 178 + 590 + 1145 = +1913 kJ mol-1",
          "Cl2(g) to 2Cl-(g): 2 x 122 + 2 x (-349) = -454 kJ mol-1 (both values doubled because two chloride ions are formed)",
          "-796 = 1913 + (-454) + dHlatt, so dHlatt = -796 - 1459 = -2255 kJ mol-1",
        ],
      },
      {
        label: "c", type: "mcq", marks: 1,
        hints: [
          "Work out how much the chlorine subtotal changes if one of the -349 values is left out.",
          "A less negative subtotal means dHlatt has to be more negative for the cycle to still give -796.",
        ],
        q: "A student forgot to double the first electron affinity of chlorine. What effect does this have on the calculated lattice enthalpy?",
        options: { A: "It is 349 kJ mol-1 more negative than the correct value", B: "It is 349 kJ mol-1 less negative than the correct value", C: "It is 698 kJ mol-1 more negative than the correct value", D: "It is unchanged" },
        answer: "A",
        explanation: "Leaving out one lot of -349 makes the sum of the other steps 349 kJ mol-1 larger, so the lattice enthalpy calculated by rearranging is 349 kJ mol-1 more negative (-2604 instead of -2255).",
      },
    ],
  },
  {
    id: "bh-006", board: "both", tags: ["born-haber", "definitions"], tier: 2,
    title: "Definitions",
    parts: [
      {
        label: "a", type: "short", marks: 2,
        hints: [
          "Three things are needed: how many electrons, removed from what, and in what state.",
          "The electrons are removed from gaseous atoms, one per atom, to form gaseous 1+ ions.",
          "Start with 'The enthalpy change when one mole of electrons is removed from one mole of ...'.",
        ],
        q: "Define the term first ionisation energy.",
        ms: [
          "Enthalpy change when one electron is removed from each atom in one mole of gaseous atoms",
          "To form one mole of gaseous 1+ ions",
        ],
        reject: ["Energy to remove an electron from an atom (no reference to one mole or gaseous)"],
      },
      {
        label: "b", type: "short", marks: 2,
        hints: [
          "Atomisation is about forming gaseous atoms. How many moles of atoms?",
          "The starting point is the element in its standard state, for example Cl2(g) or Na(s).",
          "Write 'The enthalpy change when one mole of gaseous atoms is formed from ...'.",
        ],
        q: "Define the term enthalpy of atomisation of an element.",
        ms: [
          "Enthalpy change when one mole of gaseous atoms is formed",
          "From the element in its standard state",
        ],
      },
      {
        label: "c", type: "short", marks: 2,
        hints: [
          "How many moles of Cl atoms are formed when one mole of Cl-Cl bonds is broken?",
          "Atomisation is defined per mole of gaseous atoms formed, not per mole of bonds broken.",
          "Breaking 1 mol of Cl2 needs +243 kJ and gives 2 mol of Cl(g). Work out the value per mole of Cl atoms.",
        ],
        q: "The Cl-Cl bond enthalpy is +243 kJ mol-1. Explain why the enthalpy of atomisation of chlorine is +122 kJ mol-1 and not +243 kJ mol-1.",
        ms: [
          "Enthalpy of atomisation is defined per mole of gaseous atoms formed",
          "Breaking one mole of Cl-Cl bonds forms two moles of Cl atoms, so atomisation is half the bond enthalpy",
        ],
      },
    ],
  },

  // ───────────────────────── Tier 3: unseen / stretch ───────────────────
  {
    id: "bh-007", board: "both", tags: ["born-haber", "lattice-enthalpy", "covalent-character"], tier: 3,
    title: "Potassium bromide: finding an electron affinity",
    context: "The table gives enthalpy data for potassium bromide. The lattice enthalpy of formation was determined experimentally using a Born-Haber cycle.",
    dataTable: [
      ["Enthalpy of formation of KBr(s)", -394],
      ["Enthalpy of atomisation of potassium", 89],
      ["Enthalpy of atomisation of bromine", 112],
      ["First ionisation energy of potassium", 419],
      ["Lattice enthalpy of formation of KBr(s)", -671],
    ],
    parts: [
      {
        label: "a", type: "calc", marks: 3,
        hints: [
          "Write every step of the cycle, leaving the electron affinity as an unknown x.",
          "dHf = dHat(K) + IE1(K) + dHat(Br) + x + dHlatt. Rearrange to make x the subject.",
          "Substitute: -394 = 89 + 419 + 112 + x + (-671). Collect the known numbers on one side.",
        ],
        q: "Use the data to calculate the first electron affinity of bromine.",
        answer: -343, unit: "kJ mol-1", tolerance: 3,
        steps: [
          "dHf = dHat(K) + IE1(K) + dHat(Br) + EA1(Br) + dHlatt",
          "-394 = 89 + 419 + 112 + EA1 + (-671), so -394 = -51 + EA1",
          "EA1(Br) = -394 + 51 = -343 kJ mol-1",
        ],
      },
      {
        label: "b", type: "short", marks: 2,
        hints: [
          "What does the perfectly ionic model assume about the shape of the ions and how their charge is spread?",
          "If the experimental value is more exothermic than the model predicts, the real bonding is stronger than purely ionic. What extra type of bonding is present?",
          "Use the terms polarised, distorted electron cloud and covalent character.",
        ],
        q: "A theoretical lattice enthalpy for potassium bromide, calculated assuming a perfectly ionic model, is less exothermic than the experimental value. Explain what this difference suggests about the bonding in potassium bromide.",
        ms: [
          "The perfectly ionic model assumes the ions are point charges / perfect spheres with evenly spread charge",
          "The difference shows the bonding has some covalent character (the bromide ion is polarised / its electron cloud is distorted by the cation)",
        ],
      },
      {
        label: "c", type: "short", marks: 2,
        hints: [
          "Compare the size of the iodide ion with the fluoride ion.",
          "Which anion's electron cloud is more easily distorted by the Mg2+ ion?",
          "More distortion means more covalent character and a bigger gap between the experimental and theoretical values.",
        ],
        q: "Suggest why the difference between the experimental and theoretical lattice enthalpies is larger for magnesium iodide than for magnesium fluoride.",
        ms: [
          "The iodide ion is larger (than the fluoride ion) so its electron cloud is more easily distorted / it is more polarisable",
          "So magnesium iodide has more covalent character (greater difference)",
        ],
      },
    ],
  },
  {
    id: "bh-008", board: "both", tags: ["born-haber", "lattice-enthalpy"], tier: 3,
    title: "Trends in lattice enthalpy",
    context: "Lattice enthalpies of formation, in kJ mol-1: NaF -918, NaCl -787, NaBr -742.",
    parts: [
      {
        label: "a", type: "short", marks: 3,
        hints: [
          "The cation is the same in all three, so focus on what changes about the anion down Group 7.",
          "Relate the ionic radius to the distance between the ion centres and so the strength of attraction.",
          "Three ideas for three marks: the radius, the strength of attraction, and the energy released (more or less exothermic).",
        ],
        q: "Explain the trend in the lattice enthalpies of the sodium halides.",
        ms: [
          "Ionic radius increases from F- to Cl- to Br-",
          "So the charge density of the anion decreases / the ions are further apart",
          "So the electrostatic attraction between the ions is weaker and less energy is released when the lattice forms (less exothermic)",
        ],
      },
      {
        label: "b", type: "mcq", marks: 1,
        hints: [
          "Charge matters more than size here. Which compounds have 2+ and 2- ions?",
          "Of the 2+/2- pair, which has the smaller cation?",
        ],
        q: "Which compound is predicted to have the most exothermic lattice enthalpy of formation?",
        options: { A: "NaF", B: "KCl", C: "CaO", D: "MgO" },
        answer: "D",
        explanation: "MgO has 2+ and 2- ions, and Mg2+ is smaller than Ca2+, so it has the strongest electrostatic attraction between ions.",
      },
      {
        label: "c", type: "short", marks: 2,
        hints: [
          "Continue the trend from NaF to NaBr. What happens to the anion size for iodide?",
          "State the direction (more or less exothermic) first, then give the reason in terms of attraction between the ions.",
        ],
        q: "Predict, with a reason, whether the lattice enthalpy of formation of sodium iodide is more or less exothermic than that of sodium bromide.",
        ms: [
          "Less exothermic",
          "Because the iodide ion is larger than the bromide ion, so the attraction between the ions is weaker",
        ],
      },
    ],
  },
  {
    id: "bh-009", board: "both", tags: ["enthalpy-of-solution", "hydration"], tier: 2,
    title: "Enthalpy of solution of sodium chloride",
    context: "Enthalpy data, in kJ mol-1: lattice enthalpy of formation of NaCl -787, enthalpy of hydration of Na+ -406, enthalpy of hydration of Cl- -364.",
    parts: [
      {
        label: "a", type: "short", marks: 2,
        hints: [
          "Hydration is about gaseous ions becoming aqueous ions. How many moles?",
          "Include the state change from (g) to (aq) and the standard conditions.",
          "Write 'The enthalpy change when one mole of gaseous ions ...'.",
        ],
        q: "Define the term enthalpy of hydration.",
        ms: [
          "Enthalpy change when one mole of gaseous ions",
          "Is dissolved in water to form one mole of aqueous ions (under standard conditions)",
        ],
      },
      {
        label: "b", type: "calc", marks: 3,
        hints: [
          "Dissolving can be treated as two stages: breaking the lattice into gaseous ions, then hydrating those ions.",
          "Breaking the lattice is the reverse of the lattice enthalpy of formation. What happens to the sign?",
          "dHsol = -(dHlatt) + dHhyd(Na+) + dHhyd(Cl-). Substitute -787, -406 and -364 with the correct signs.",
        ],
        q: "Calculate the enthalpy of solution of sodium chloride.",
        answer: 17, unit: "kJ mol-1", tolerance: 2,
        steps: [
          "dHsol = -(dHlatt of formation) + sum of hydration enthalpies",
          "dHsol = -(-787) + (-406) + (-364)",
          "dHsol = 787 - 770 = +17 kJ mol-1",
        ],
      },
      {
        label: "c", type: "short", marks: 2,
        hints: [
          "Enthalpy is not the only factor that decides whether a process is feasible. What else changes when an ordered solid becomes dissolved ions?",
          "Think about disorder: compare the ordered lattice with ions free to move through the solution.",
          "Use dG = dH - TdS. What must TdS be, compared with dH, for dG to be negative?",
        ],
        q: "Sodium chloride dissolves readily in water at room temperature even though the enthalpy of solution is endothermic. Explain why.",
        ms: [
          "The entropy change is positive / entropy increases because the ions become free to move in solution",
          "So the free energy change (dG = dH - TdS) is negative, so dissolving is feasible",
        ],
        allow: ["TdS is larger than dH"],
      },
    ],
  },
];
