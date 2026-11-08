/**
 * Student self-evaluation: the topic tree each new student rates before
 * being placed into a group. Mirrors the HSJ "Self Evaluation Sheet"
 * spreadsheet (one row per spec sub-topic, Red / Amber / Green) and extends
 * it to AQA and Edexcel using the specification section titles.
 *
 * The onboarding form is adaptive: the student first ticks the modules they
 * have been taught so far, then rates only the sub-topics inside those.
 *
 * Shape: SELF_EVALUATION[board] = { label, modules: [{ id, title, year, subtopics: [{ ref, title }] }] }
 */

export const RAG = [
  { id: "red", label: "Red", help: "Not confident, needs teaching" },
  { id: "amber", label: "Amber", help: "Some gaps, needs practice" },
  { id: "green", label: "Green", help: "Confident, exam ready" },
];

export const COVERED = [
  { id: "yes", label: "Yes" },
  { id: "partly", label: "Partly" },
  { id: "no", label: "Not yet" },
];

const mod = (id, title, year, subtopics) => ({ id, title, year, subtopics: subtopics.map(([ref, t]) => ({ ref, title: t })) });

export const SELF_EVALUATION = {
  ocr: {
    label: "OCR A (H432)",
    modules: [
      mod("ocr-2.1", "Module 2: Foundations in Chemistry, 2.1 Atoms and reactions", 12, [
        ["2.1.1", "Atomic structure and isotopes"],
        ["2.1.2", "Compounds, formulae and equations"],
        ["2.1.3", "Amount of substance"],
        ["2.1.4", "Acids"],
        ["2.1.5", "Redox"],
      ]),
      mod("ocr-2.2", "Module 2: Foundations in Chemistry, 2.2 Electrons, bonding and structure", 12, [
        ["2.2.1", "Electron structure"],
        ["2.2.2", "Bonding and structure"],
      ]),
      mod("ocr-3.1", "Module 3: Periodic Table and Energy, 3.1 The periodic table", 12, [
        ["3.1.1", "Periodicity"],
        ["3.1.2", "Group 2"],
        ["3.1.3", "The halogens"],
        ["3.1.4", "Qualitative analysis"],
      ]),
      mod("ocr-3.2", "Module 3: Periodic Table and Energy, 3.2 Physical chemistry", 12, [
        ["3.2.1", "Enthalpy changes"],
        ["3.2.2", "Reaction rates"],
        ["3.2.3", "Chemical equilibrium"],
      ]),
      mod("ocr-4.1", "Module 4: Core Organic Chemistry, 4.1 Basic concepts and hydrocarbons", 12, [
        ["4.1.1", "Basic concepts of organic chemistry"],
        ["4.1.2", "Alkanes"],
        ["4.1.3", "Alkenes"],
      ]),
      mod("ocr-4.2", "Module 4: Core Organic Chemistry, 4.2 Alcohols, haloalkanes and analysis", 12, [
        ["4.2.1", "Alcohols"],
        ["4.2.2", "Haloalkanes"],
        ["4.2.3", "Organic synthesis"],
        ["4.2.4", "Analytical techniques"],
      ]),
      mod("ocr-5.1", "Module 5: Physical Chemistry and Transition Elements, 5.1 Rates, equilibrium and pH", 13, [
        ["5.1.1", "How fast?"],
        ["5.1.2", "How far?"],
        ["5.1.3", "Acids, bases and buffers"],
      ]),
      mod("ocr-5.2", "Module 5: Physical Chemistry and Transition Elements, 5.2 Energy", 13, [
        ["5.2.1", "Lattice enthalpy"],
        ["5.2.2", "Enthalpy and entropy"],
        ["5.2.3", "Redox and electrode potentials"],
      ]),
      mod("ocr-5.3", "Module 5: Physical Chemistry and Transition Elements, 5.3 Transition elements", 13, [
        ["5.3.1", "General properties of transition elements"],
        ["5.3.2", "Shapes of complex ions"],
        ["5.3.3", "Substitution reactions"],
        ["5.3.4", "Redox reactions of transition elements"],
        ["5.3.5", "Qualitative tests for ions in aqueous solution"],
      ]),
      mod("ocr-6.1", "Module 6: Organic Chemistry and Analysis, 6.1 Aromatic compounds, carbonyls and acids", 13, [
        ["6.1.1", "Aromatic compounds"],
        ["6.1.2", "Carbonyl compounds"],
        ["6.1.3", "Carboxylic acids and esters"],
      ]),
      mod("ocr-6.2", "Module 6: Organic Chemistry and Analysis, 6.2 Nitrogen compounds, polymers and synthesis", 13, [
        ["6.2.1", "Amines"],
        ["6.2.2", "Amino acids, amides and chirality"],
        ["6.2.3", "Polyesters and polyamides"],
        ["6.2.4", "Carbon-carbon bond formation"],
        ["6.2.5", "Organic synthesis"],
      ]),
      mod("ocr-6.3", "Module 6: Organic Chemistry and Analysis, 6.3 Analysis", 13, [
        ["6.3.1", "Chromatography and qualitative analysis"],
        ["6.3.2", "Spectroscopy (NMR and mass spectrometry)"],
      ]),
    ],
  },

  aqa: {
    label: "AQA (7405)",
    modules: [
      mod("aqa-phys-12", "Physical chemistry, Year 12 (3.1.1 to 3.1.7)", 12, [
        ["3.1.1", "Atomic structure"],
        ["3.1.2", "Amount of substance"],
        ["3.1.3", "Bonding"],
        ["3.1.4", "Energetics"],
        ["3.1.5", "Kinetics"],
        ["3.1.6", "Chemical equilibria, Le Chatelier's principle and Kc"],
        ["3.1.7", "Oxidation, reduction and redox equations"],
      ]),
      mod("aqa-inorg-12", "Inorganic chemistry, Year 12 (3.2.1 to 3.2.3)", 12, [
        ["3.2.1", "Periodicity"],
        ["3.2.2", "Group 2, the alkaline earth metals"],
        ["3.2.3", "Group 7(17), the halogens"],
      ]),
      mod("aqa-org-12", "Organic chemistry, Year 12 (3.3.1 to 3.3.6)", 12, [
        ["3.3.1", "Introduction to organic chemistry"],
        ["3.3.2", "Alkanes"],
        ["3.3.3", "Halogenoalkanes"],
        ["3.3.4", "Alkenes"],
        ["3.3.5", "Alcohols"],
        ["3.3.6", "Organic analysis"],
      ]),
      mod("aqa-phys-13", "Physical chemistry, Year 13 (3.1.8 to 3.1.12)", 13, [
        ["3.1.8", "Thermodynamics"],
        ["3.1.9", "Rate equations"],
        ["3.1.10", "Equilibrium constant Kp for homogeneous systems"],
        ["3.1.11", "Electrode potentials and electrochemical cells"],
        ["3.1.12", "Acids and bases"],
      ]),
      mod("aqa-inorg-13", "Inorganic chemistry, Year 13 (3.2.4 to 3.2.6)", 13, [
        ["3.2.4", "Properties of Period 3 elements and their oxides"],
        ["3.2.5", "Transition metals"],
        ["3.2.6", "Reactions of ions in aqueous solution"],
      ]),
      mod("aqa-org-13", "Organic chemistry, Year 13 (3.3.7 to 3.3.16)", 13, [
        ["3.3.7", "Optical isomerism"],
        ["3.3.8", "Aldehydes and ketones"],
        ["3.3.9", "Carboxylic acids and derivatives"],
        ["3.3.10", "Aromatic chemistry"],
        ["3.3.11", "Amines"],
        ["3.3.12", "Polymers"],
        ["3.3.13", "Amino acids, proteins and DNA"],
        ["3.3.14", "Organic synthesis"],
        ["3.3.15", "Nuclear magnetic resonance spectroscopy"],
        ["3.3.16", "Chromatography"],
      ]),
    ],
  },

  edexcel: {
    label: "Edexcel (9CH0)",
    modules: [
      mod("edx-phys-inorg-12a", "Year 12: Atoms, bonding, redox and the periodic table (Topics 1 to 5)", 12, [
        ["1", "Atomic structure and the periodic table"],
        ["2", "Bonding and structure"],
        ["3", "Redox I"],
        ["4", "Inorganic chemistry and the periodic table"],
        ["5", "Formulae, equations and amounts of substance"],
      ]),
      mod("edx-org-12", "Year 12: Organic chemistry and analysis (Topics 6 and 7)", 12, [
        ["6", "Organic chemistry I"],
        ["7", "Modern analytical techniques I"],
      ]),
      mod("edx-phys-12b", "Year 12: Energetics, kinetics and equilibrium (Topics 8 to 10)", 12, [
        ["8", "Energetics I"],
        ["9", "Kinetics I"],
        ["10", "Equilibrium I"],
      ]),
      mod("edx-phys-inorg-13", "Year 13: Physical and inorganic chemistry (Topics 11 to 16)", 13, [
        ["11", "Equilibrium II"],
        ["12", "Acid-base equilibria"],
        ["13", "Energetics II"],
        ["14", "Redox II"],
        ["15", "Transition metals"],
        ["16", "Kinetics II"],
      ]),
      mod("edx-org-13", "Year 13: Organic chemistry and analysis (Topics 17 to 19)", 13, [
        ["17", "Organic chemistry II"],
        ["18", "Organic chemistry III"],
        ["19", "Modern analytical techniques II"],
      ]),
    ],
  },
};

/** Look up a sub-topic title by board and spec ref, for summaries. */
export function subtopicTitle(board, ref) {
  const tree = SELF_EVALUATION[board];
  if (!tree) return ref;
  for (const m of tree.modules) {
    const s = m.subtopics.find(x => x.ref === ref);
    if (s) return s.title;
  }
  return ref;
}

/** Counts of red / amber / green across a saved evaluation's ratings. */
export function ragCounts(ratings) {
  const n = { red: 0, amber: 0, green: 0 };
  for (const r of Object.values(ratings || {})) if (r?.rag && n[r.rag] !== undefined) n[r.rag]++;
  return n;
}
