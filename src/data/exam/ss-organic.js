/**
 * Organic drills from the Science Skool worksheets: halogenoalkane mechanisms
 * (described in words), stereoisomerism, aromatic chemistry, carbonyl
 * compounds and 1H NMR. Parts that needed a drawn structure or a curly-arrow
 * diagram are reworded to ask for names, products and descriptions.
 */
const ALL = ["aqa", "ocr", "edexcel"];
const SS = "scienceskool";

export const SS_HALOGENOALKANES = [
  {
    id: "ss-hal-001", board: ALL, tags: ["halogenoalkanes", "nucleophilic-substitution", "mechanisms"], tier: 1, source: SS,
    title: "Nucleophilic substitution: products and mechanism",
    context: "In nucleophilic substitution the nucleophile's lone pair attacks the δ+ carbon and the C-halogen bond breaks heterolytically, the halogen leaving as a halide ion.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Name the organic product when bromomethane reacts with aqueous sodium hydroxide, and name the mechanism.", ms: ["Methanol", "Nucleophilic substitution"] },
      { label: "b", type: "short", marks: 2, q: "Name the organic product when 2-chloropropane reacts with an excess of ammonia, and give the other product.", ms: ["Propan-2-amine (2-aminopropane)", "Ammonium chloride (NH4Cl, from the HCl and the excess ammonia)"] },
      { label: "c", type: "short", marks: 1, q: "Name the organic product when 1-chloropropane is heated under reflux with aqueous sodium hydroxide.", ms: ["Propan-1-ol"] },
      { label: "d", type: "short", marks: 2, q: "Name the organic product when 2-bromopropane is heated under reflux with potassium cyanide in ethanol, and state why this reaction is useful in synthesis.", ms: ["2-methylpropanenitrile", "It adds a carbon atom to the chain (the nitrile can then be hydrolysed to an acid or reduced to an amine)"] },
      { label: "e", type: "short", marks: 3, q: "Describe the mechanism for the reaction of bromomethane with hydroxide ions, naming where each curly arrow starts and ends.",
        ms: ["Curly arrow from the lone pair on the oxygen of OH- to the δ+ carbon", "Curly arrow from the C-Br bond to the bromine (the C-Br bond breaks heterolytically)", "Products: CH3OH and Br-; the carbon is δ+ because bromine is more electronegative"] },
    ],
  },
  {
    id: "ss-hal-002", board: ALL, tags: ["halogenoalkanes", "elimination", "mechanisms", "alkenes"], tier: 2, source: SS,
    title: "Elimination: products and mechanism",
    context: "Hydroxide in ethanol, heated, acts as a base and removes a hydrogen from a carbon adjacent to the C-halogen bond.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Name the organic product when 2-bromopropane is heated with potassium hydroxide dissolved in ethanol, and name the mechanism.", ms: ["Propene", "Elimination"] },
      { label: "b", type: "short", marks: 1, q: "Name the organic product when 2-iodopropane is heated with ethanolic potassium hydroxide.", ms: ["Propene"] },
      { label: "c", type: "short", marks: 3, q: "2-bromo-2-methylbutane is heated with ethanolic potassium hydroxide. Name the two possible alkene products and state which is formed in the greater amount.",
        ms: ["2-methylbut-2-ene", "2-methylbut-1-ene", "2-methylbut-2-ene is the major product (the more substituted / more stable alkene)"] },
      { label: "d", type: "short", marks: 3, q: "Describe the mechanism for the elimination reaction of 2-bromopropane with hydroxide ions, naming where each curly arrow starts and ends.",
        ms: ["Curly arrow from the lone pair on OH- to a hydrogen on a carbon adjacent to the C-Br carbon", "Curly arrow from that C-H bond to form the C=C double bond", "Curly arrow from the C-Br bond to bromine; products propene, water and Br-"] },
      { label: "e", type: "short", marks: 2, q: "State the conditions that favour elimination rather than substitution when a halogenoalkane reacts with potassium hydroxide.", ms: ["Hydroxide dissolved in ethanol (not water)", "Hot / heated under reflux; also favoured by tertiary halogenoalkanes and concentrated KOH"] },
    ],
  },
];

export const SS_STEREOISOMERISM = [
  {
    id: "ss-ster-001", board: ALL, tags: ["isomerism", "optical-isomerism", "chirality", "definitions"], tier: 1, source: SS,
    title: "Optical isomerism: key terms",
    parts: [
      { label: "a", type: "short", marks: 1, q: "Define the term chiral carbon.", ms: ["A carbon atom bonded to four different groups (atoms)"] },
      { label: "b", type: "short", marks: 1, q: "Define the term optical isomers.", ms: ["Isomers that are non-superimposable mirror images of each other, which rotate the plane of plane-polarised light in opposite directions"] },
      { label: "c", type: "short", marks: 1, q: "Define the term enantiomers.", ms: ["The two optical isomers of a chiral molecule (one mirror-image pair)"] },
      { label: "d", type: "short", marks: 1, q: "Define the term racemate (racemic mixture).", ms: ["A mixture containing equal amounts of the two enantiomers, which has no effect on plane-polarised light"] },
      { label: "e", type: "short", marks: 1, q: "Define the term plane-polarised light.", ms: ["Light in which the oscillations (of the electric field) occur in one plane only"] },
      { label: "f", type: "short", marks: 3, q: "For each of CH3CH2CH2CH(OH)CH3, C6H5CH(CH3)CH2CH3 and CH3CH(OH)COOH, identify the chiral carbon by stating the four different groups attached to it.",
        ms: ["Pentan-2-ol: the carbon bonded to H, OH, CH3 and CH2CH2CH3", "2-phenylbutane: the carbon bonded to H, CH3, C6H5 and CH2CH3", "Lactic acid (2-hydroxypropanoic acid): the carbon bonded to H, OH, CH3 and COOH"] },
    ],
  },
  {
    id: "ss-ster-002", board: ALL, tags: ["isomerism", "optical-isomerism", "pharmaceuticals"], tier: 2, source: SS,
    title: "Stereochemistry and drug action",
    parts: [
      { label: "a", type: "short", marks: 3, q: "Explain what is meant by the statement 'drug action may be determined by the stereochemistry of a molecule'.",
        ms: ["Drugs act by binding to receptors / enzymes (active sites) which have a specific three-dimensional shape", "Only one enantiomer has the right shape to fit and give the therapeutic effect", "The other enantiomer may be inactive or may cause (harmful) side effects"] },
      { label: "b", type: "short", marks: 2, q: "Give two advantages of giving a patient an optically pure sample of a drug rather than a racemic mixture.",
        ms: ["A smaller dose is needed (half the dose, since the inactive enantiomer is absent)", "Fewer / less risk of side effects from the other enantiomer"], allow: ["Can be cheaper per effective dose (although separating enantiomers is itself expensive)"] },
    ],
  },
];

export const SS_AROMATIC = [
  {
    id: "ss-arom-001", board: ALL, tags: ["aromatic", "benzene", "bonding", "delocalisation"], tier: 1, source: SS,
    title: "Evidence for the structure of benzene",
    parts: [
      { label: "a", type: "extended", marks: 4, q: "Explain why benzene has a delocalised structure rather than the alternating single and double bond structure proposed by Kekulé. Include at least three pieces of evidence in your answer.",
        ms: ["All the C-C bond lengths in benzene are identical, intermediate between C-C single and C=C double bonds (0.139 nm)", "Benzene is a planar, symmetrical molecule / regular hexagon", "The enthalpy of hydrogenation of benzene is about 150 kJ mol-1 less exothermic than that predicted for three C=C bonds (cyclohexa-1,3,5-triene), so benzene is more stable than Kekulé's structure", "Benzene undergoes substitution rather than addition reactions and does not decolourise bromine water"] },
      { label: "b", type: "short", marks: 2, q: "Describe the bonding in benzene in terms of p orbitals.", ms: ["Each carbon has one electron in a p orbital perpendicular to the ring", "The p orbitals overlap sideways to form a delocalised π system above and below the plane of the ring"] },
    ],
  },
  {
    id: "ss-arom-002", board: ALL, tags: ["aromatic", "electrophilic-substitution", "nitration", "acylation", "mechanisms"], tier: 2, source: SS,
    title: "Nitration and acylation of benzene",
    parts: [
      { label: "a", type: "short", marks: 1, q: "Explain what is meant by the term nitrating mixture.", ms: ["A mixture of concentrated nitric acid and concentrated sulfuric acid"] },
      { label: "b", type: "short", marks: 1, q: "Give the formula of the electrophile which reacts with benzene in nitration.", ms: ["NO2+ (nitronium / nitryl ion)"] },
      { label: "c", type: "short", marks: 1, q: "Write a balanced equation showing how the electrophile is generated by the nitrating mixture.", ms: ["HNO3 + H2SO4 → NO2+ + HSO4- + H2O (accept HNO3 + 2H2SO4 → NO2+ + 2HSO4- + H3O+)"] },
      { label: "d", type: "short", marks: 3, q: "Describe the mechanism for the nitration of benzene in words, stating where each curly arrow starts and ends.",
        ms: ["Curly arrow from the delocalised π ring to the N of NO2+", "Intermediate: a ring with a broken (horseshoe) delocalised system carrying a positive charge, with H and NO2 on the same carbon", "Curly arrow from the C-H bond back into the ring to restore delocalisation, releasing H+ (which regenerates the H2SO4 catalyst)"] },
      { label: "e", type: "short", marks: 2, q: "Phenylethanone can be made by the acylation of benzene with ethanoyl chloride. Name the catalyst and write an equation for the formation of the electrophile.", ms: ["Aluminium chloride, AlCl3", "CH3COCl + AlCl3 → CH3CO+ + AlCl4-"] },
      { label: "f", type: "short", marks: 2, q: "Write an overall equation for the acylation of benzene with ethanoyl chloride and explain how the AlCl3 catalyst is regenerated.", ms: ["C6H6 + CH3COCl → C6H5COCH3 + HCl", "The H+ lost from the intermediate reacts with AlCl4-: H+ + AlCl4- → HCl + AlCl3"] },
    ],
  },
];

export const SS_CARBONYLS = [
  {
    id: "ss-carb-001", board: ALL, tags: ["carbonyls", "aldehydes", "ketones", "intermolecular-forces", "nucleophilic-addition"], tier: 1, source: SS,
    title: "Carbonyl compounds: properties and reactivity",
    parts: [
      { label: "a", type: "short", marks: 3, q: "Compared with alkanes and alcohols of similar Mr, where do carbonyl compounds lie in terms of boiling point? Explain your answer in terms of intermolecular forces.",
        ms: ["Between alkanes (lowest) and alcohols (highest)", "The polar C=O gives permanent dipole-dipole forces (plus induced dipole-dipole), which are stronger than the induced dipole-dipole forces alone in alkanes", "They cannot hydrogen bond to each other (no O-H), unlike alcohols"] },
      { label: "b", type: "short", marks: 2, q: "What type of reaction is most likely for carbonyl compounds, and why?", ms: ["Nucleophilic addition", "The C=O bond is polar: oxygen is more electronegative, so the carbon is δ+ and attracts nucleophiles"] },
      { label: "c", type: "short", marks: 2, q: "Name the reagents and conditions used to oxidise an aldehyde to a carboxylic acid.", ms: ["Acidified potassium dichromate(VI) (K2Cr2O7 / H2SO4)", "Heat under reflux"] },
      { label: "d", type: "short", marks: 1, q: "Why can ketones not easily be oxidised?", ms: ["There is no hydrogen atom on the carbonyl carbon, so a C-C bond would have to be broken"] },
      { label: "e", type: "short", marks: 4, q: "Name two tests to distinguish between an aldehyde and a ketone. Give the positive result for each.",
        ms: ["Tollens' reagent (ammoniacal silver nitrate), warm", "Aldehyde gives a silver mirror; ketone no change", "Fehling's (or Benedict's) solution, warm", "Aldehyde gives a brick-red precipitate (Cu2O); ketone stays blue"] },
    ],
  },
  {
    id: "ss-carb-002", board: ALL, tags: ["carbonyls", "nucleophilic-addition", "mechanisms", "optical-isomerism", "reduction"], tier: 2, source: SS,
    title: "Nucleophilic addition mechanisms",
    parts: [
      { label: "a", type: "short", marks: 4, q: "Describe the mechanism for the reaction of propanone with hydrogen cyanide (KCN followed by dilute acid), stating where each curly arrow starts and ends, and name the product.",
        ms: ["Curly arrow from the lone pair on the carbon of CN- to the δ+ carbonyl carbon", "Curly arrow from the C=O π bond to the oxygen, giving an intermediate with O-", "Curly arrow from the O- lone pair to H+ (from HCN or the acid), forming O-H", "Product: 2-hydroxy-2-methylpropanenitrile"] },
      { label: "b", type: "short", marks: 2, q: "Why is the reaction with HCN considered useful? What kind of isomerism occurs if an aldehyde or an unsymmetrical ketone is used, and why?",
        ms: ["It increases the carbon chain length by one (and the nitrile can be hydrolysed or reduced)", "Optical isomerism: a racemic mixture forms because the planar C=O is attacked from either side with equal probability, creating a chiral carbon"] },
      { label: "c", type: "short", marks: 3, q: "Sodium tetrahydridoborate(III), NaBH4, reduces both ketones and aldehydes. Describe the mechanism and name the product type in each case.",
        ms: ["NaBH4 provides the hydride ion H-, which acts as the nucleophile attacking the δ+ carbonyl carbon (arrow from H- to C; arrow from C=O to O)", "The O- intermediate is protonated by water / dilute acid (arrow from O- to H+)", "An aldehyde gives a primary alcohol; a ketone gives a secondary alcohol"] },
    ],
  },
  {
    id: "ss-carb-003", board: ALL, tags: ["carboxylic-acids", "esters", "equations", "naming"], tier: 1, source: SS,
    title: "Carboxylic acids and esters",
    parts: [
      { label: "a", type: "short", marks: 2, q: "Name the esters CH3COOCH3 and HCOOC2H5.", ms: ["Methyl ethanoate", "Ethyl methanoate"] },
      { label: "b", type: "short", marks: 2, q: "Which test can be used to distinguish carboxylic acids from other organic compounds that contain the OH group?", ms: ["Add sodium carbonate (or sodium hydrogencarbonate)", "Carboxylic acids effervesce (CO2, turns limewater milky); alcohols and phenols do not"] },
      { label: "c", type: "short", marks: 2, q: "Write equations for the reactions of ethanoic acid with (i) sodium hydroxide and (ii) sodium carbonate.", ms: ["CH3COOH + NaOH → CH3COONa + H2O", "2CH3COOH + Na2CO3 → 2CH3COONa + H2O + CO2"] },
      { label: "d", type: "short", marks: 2, q: "Write an equation for the reaction between ethanoic acid and ethanol, and name the catalyst.", ms: ["CH3COOH + C2H5OH ⇌ CH3COOC2H5 + H2O", "Concentrated sulfuric acid"] },
      { label: "e", type: "short", marks: 2, q: "Describe how methanoic acid forms hydrogen bonds with water.", ms: ["The δ+ H of the O-H group hydrogen bonds to a lone pair on the oxygen of a water molecule", "A δ+ H of water hydrogen bonds to a lone pair on the C=O (or O-H) oxygen of the acid"] },
    ],
  },
  {
    id: "ss-carb-004", board: ALL, tags: ["esters", "fats", "triglycerides", "hydrolysis", "acyl-chlorides"], tier: 2, source: SS,
    title: "Triglycerides and acid derivatives",
    parts: [
      { label: "a", type: "short", marks: 2, q: "What is the difference between fats and oils?", ms: ["Fats are solids at room temperature; their fatty acid chains are mostly saturated and pack closely (stronger van der Waals forces)", "Oils are liquids; their chains contain C=C (unsaturated), whose kinks stop close packing"] },
      { label: "b", type: "short", marks: 2, q: "Give the products of the hydrolysis of a triglyceride (an ester of glycerol with three RCOOH acids) with three moles of sodium hydroxide.", ms: ["Propane-1,2,3-triol (glycerol)", "Three moles of the sodium salt of the fatty acid, RCOO-Na+"] },
      { label: "c", type: "short", marks: 2, q: "One of these products is an ionic salt. Why are such salts used as cleaning products?", ms: ["The ionic (carboxylate) head is hydrophilic and dissolves in water; the long hydrocarbon tail is hydrophobic and dissolves in grease", "So grease is lifted off and dispersed in water (soap)"] },
      { label: "d", type: "short", marks: 3, q: "Acid derivatives have the formula RCOZ. Name the derivative when Z is (i) OR', (ii) Cl, (iii) OCOR'.", ms: ["Ester", "Acyl chloride (acid chloride)", "Acid anhydride"] },
      { label: "e", type: "short", marks: 3, q: "Describe the general mechanism when RCOZ reacts with a nucleophile Nu-.",
        ms: ["Nucleophilic addition-elimination: lone pair on Nu attacks the δ+ carbonyl carbon and the C=O π electrons move onto oxygen", "The C=O re-forms and the C-Z bond breaks, Z- leaving", "Overall substitution of Z by Nu (a proton is lost if Nu was neutral, e.g. H2O or NH3)"] },
      { label: "f", type: "short", marks: 3, q: "State three factors that affect how readily this reaction occurs, and put the nucleophiles primary amine, alcohol, ammonia and water in order of strength (strongest first).",
        ms: ["How good a leaving group Z is (Cl > OCOR > OR); the strength / availability of the nucleophile's lone pair; the size of the δ+ on the carbonyl carbon", "Primary amine > ammonia > alcohol > water", "Both points made with correct reasoning"] },
      { label: "g", type: "short", marks: 4, q: "Name the organic product when ethanoyl chloride reacts with (i) water, (ii) ethanol, (iii) ammonia, (iv) methylamine.", ms: ["Ethanoic acid (+ HCl)", "Ethyl ethanoate (+ HCl)", "Ethanamide (+ NH4Cl with excess ammonia)", "N-methylethanamide (+ CH3NH3+Cl-)"] },
    ],
  },
];

export const SS_NMR = [
  {
    id: "ss-nmr-001", board: ALL, tags: ["nmr", "spectroscopy", "organic-analysis"], tier: 1, source: SS,
    title: "Low-resolution 1H NMR: counting environments",
    context: "Typical shifts: R-CH3 0.7 to 1.6; R-CH2-C=O 2.0 to 2.9; O-CH3 or O-CH2-R 3.3 to 4.3; H-C=O 9.0 to 10.0; COOH 11.0 to 12.0 ppm.",
    parts: [
      { label: "a", type: "short", marks: 2, q: "A low-resolution spectrum shows three peaks at about 12, 2.4 and 1.1 ppm with areas 1 : 2 : 3. Which of propanoic acid, methyl ethanoate and ethyl methanoate produced it? Explain.",
        ms: ["Propanoic acid, CH3CH2COOH", "The peak at 12 ppm is COOH; 2.4 ppm is CH2 next to C=O; 1.1 ppm is CH3 (the esters have no peak near 12 ppm)"] },
      { label: "b", type: "short", marks: 2, q: "How would you use low-resolution NMR to distinguish between the isomers propanone and propanal?",
        ms: ["Propanone, CH3COCH3: one peak only (both CH3 groups equivalent, about 2.2 ppm)", "Propanal, CH3CH2CHO: three peaks (about 1.1, 2.4 and 9.8 ppm) in the ratio 3 : 2 : 1"] },
      { label: "c", type: "short", marks: 2, q: "How many peaks would there be in the low-resolution spectrum of (CH3)3CCH2COOH, and what would be the ratio of the areas under the peaks?", ms: ["Three peaks", "Ratio 9 : 2 : 1 (three equivalent CH3, the CH2, the COOH)"] },
      { label: "d", type: "short", marks: 2, q: "Predict the low-resolution NMR spectrum of methyl ethanoate, CH3COOCH3.", ms: ["Two peaks (singlets) of equal area (3 : 3)", "About 2.0 ppm (CH3C=O) and about 3.7 ppm (OCH3)"] },
    ],
  },
  {
    id: "ss-nmr-002", board: ALL, tags: ["nmr", "spectroscopy", "organic-analysis", "splitting"], tier: 2, source: SS,
    title: "High-resolution 1H NMR: identifying compounds",
    parts: [
      { label: "a", type: "short", marks: 3, q: "A compound C4H8O2 gives three signals: a quartet at 4.1 ppm (2H), a singlet at 2.0 ppm (3H) and a triplet at 1.2 ppm (3H). Identify the compound and explain your reasoning.",
        ms: ["Ethyl ethanoate, CH3COOCH2CH3", "The 4.1 ppm quartet is O-CH2 next to a CH3 (n + 1 = 4); the 1.2 ppm triplet is the CH3 next to CH2", "The 2.0 ppm singlet is CH3C=O with no neighbouring hydrogens"] },
      { label: "b", type: "short", marks: 3, q: "Spectrum A has three signals: a singlet (1H) at about 4 ppm, a quartet (2H) at 3.6 ppm and a triplet (3H) at 1.2 ppm. Spectrum B has a single peak at 3.3 ppm. One is ethanol and the other methoxymethane. Assign the spectra and identify the type of hydrogen each peak represents.",
        ms: ["A is ethanol: O-H singlet (1H), O-CH2 quartet (2H), CH3 triplet (3H)", "B is methoxymethane, CH3OCH3: both CH3 groups are equivalent, one singlet of 6H at 3.3 ppm (O-CH3)", "Ratio of hydrogens in ethanol 1 : 2 : 3"] },
    ],
  },
  {
    id: "ss-nmr-003", board: ALL, tags: ["nmr", "spectroscopy", "infrared", "mass-spectrometry", "empirical-formula", "organic-analysis"], tier: 2, source: SS,
    title: "Identifying molecules from combined spectral data",
    parts: [
      { label: "a", type: "short", marks: 4, q: "A compound contains 82.76% C and 17.24% H by mass. Its mass spectrum has a molecular ion at m/z 58, its infrared spectrum shows only C-H absorptions at 2850 to 2950 cm-1, and its 1H NMR has two peaks with areas 9 : 1. Identify the compound, showing your reasoning.",
        ms: ["C : H = 82.76/12 : 17.24/1 = 6.90 : 17.24 = 2 : 5, empirical formula C2H5", "Mr = 58, so molecular formula C4H10", "An alkane with two hydrogen environments in the ratio 9 : 1", "2-methylpropane, (CH3)3CH"] },
      { label: "b", type: "short", marks: 4, q: "A compound contains 54.55% C, 9.09% H and 36.36% O. Its molecular ion is at m/z 88, its infrared spectrum has a strong sharp absorption at 1735 to 1750 cm-1, and its 1H NMR shows three peaks with areas 3 : 2 : 3 at about 3.7, 2.3 and 1.1 ppm. Identify the compound, showing your reasoning.",
        ms: ["C : H : O = 4.55 : 9.09 : 2.27 = 2 : 4 : 1, empirical formula C2H4O (Mr 44), so molecular formula C4H8O2", "1735 to 1750 cm-1 is the C=O of an ester", "3H at 3.7 ppm is O-CH3; 2H at 2.3 ppm is CH2 next to C=O; 3H at 1.1 ppm is CH3", "Methyl propanoate, CH3CH2COOCH3"] },
      { label: "c", type: "short", marks: 4, q: "A compound contains 62.07% C, 10.34% H and 27.59% O. Its molecular ion is at m/z 116, its infrared spectrum has a strong sharp absorption at 1700 to 1725 cm-1 and a moderate broad absorption at 2450 to 3150 cm-1, and its 1H NMR shows peaks with areas 1 : 2 : 9 at about 12, 2.3 and 1.0 ppm. Identify the compound, showing your reasoning.",
        ms: ["C : H : O = 5.17 : 10.34 : 1.72 = 3 : 6 : 1, empirical formula C3H6O (Mr 58), so molecular formula C6H12O2", "C=O at 1700 to 1725 plus very broad O-H at 2450 to 3150 cm-1 indicates a carboxylic acid", "1H at 12 ppm is COOH; 2H at 2.3 ppm is CH2 next to C=O; 9H at 1.0 ppm is (CH3)3C", "3,3-dimethylbutanoic acid, (CH3)3CCH2COOH"] },
    ],
  },
];
