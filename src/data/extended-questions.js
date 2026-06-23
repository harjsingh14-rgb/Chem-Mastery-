export const EXTENDED_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════
  //  AQA 6-mark levels-of-response questions (from source PDFs)
  // ═══════════════════════════════════════════════════════════
  {
    id: "aqa01",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: `This question is about the shapes of molecules.

Discuss the difference between the shapes of CF₄ and XeF₄. In your answer you should:
• name the shape of each molecule
• explain the shape of each molecule
• explain the bond angle(s) in each molecule.`,
    markScheme: [
      "CF₄: four bonding pairs and zero lone pairs around carbon; electron pairs repel each other equally to be as far apart as possible; shape is tetrahedral with bond angle 109.5°",
      "XeF₄: four bonding pairs and two lone pairs around xenon (six electron pairs total)",
      "The six electron pairs adopt an octahedral arrangement; lone pairs repel more than bonding pairs",
      "The two lone pairs position themselves opposite each other (180° apart) to minimise lone pair-lone pair repulsion",
      "This gives XeF₄ a square planar shape with bond angles of 90°"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "You must name the shape AND give the bond angle for each molecule. For CF₄: tetrahedral, 109.5°. For XeF₄: square planar, 90°. The key to XeF₄ is explaining WHY the two lone pairs go to opposite (axial) positions: this minimises lp-lp repulsion."
  },
  {
    id: "aqa02",
    board: "aqa",
    category: "Kinetics",
    marks: 6,
    question: `Draw the Maxwell-Boltzmann distribution curves for a fixed mass of a gas at two different temperatures.

This gas decomposes when heated.

By reference to these distribution curves, explain why the rate of decomposition of this gas increases at higher temperatures.`,
    markScheme: [
      "Stage 1 - Single distribution curve: suitable axis labels (y-axis: number/proportion/fraction of molecules; x-axis: kinetic energy); suitable shape starting near the origin, not meeting or rising at the x-axis on the right",
      "Stage 2 - Distribution curve at higher temperature: peak moves to the right and down; area under the curve is roughly the same; curves cross once only",
      "Stage 3 - Why rate increases at higher temperature: molecules have more (kinetic) energy; more molecules have energy greater than or equal to the activation energy; higher proportion of collisions are successful / increased frequency of successful collisions"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and each stage is generally correct and virtually complete. Answer is well structured, covers all aspects of the question." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but stage(s) may be incomplete or may contain inaccuracies OR two stages are covered and are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but stage(s) may be incomplete or may contain inaccuracies OR only one stage is covered but is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the curves first before writing your explanation. Both curves must start near the origin and the right-hand tail must never touch or rise from the x-axis. The area under both curves must be equal. Use the phrase 'greater proportion of molecules have energy greater than or equal to Ea'."
  },
  {
    id: "aqa03",
    board: "aqa",
    category: "Transition Metals",
    marks: 6,
    question: `A student is given two aqueous solutions, L and M, that both contain iron salts. The student does a series of tests on the solutions.

Test | Observations with L | Observations with M
Add ammonia solution slowly until in excess | A red-brown precipitate forms that is insoluble in excess | A green precipitate forms that is insoluble in excess
Add sodium carbonate solution | A red-brown precipitate forms. Effervescence is seen. | A green precipitate forms.
Add dilute nitric acid and then divide into two portions | No change is seen | No change is seen
Add barium chloride solution to the first portion | No change is seen | A white precipitate forms
Add silver nitrate solution to the second portion | A white precipitate forms | No change is seen

Identify L and M using the results in the table. In your answer:
• identify all precipitates
• explain why effervescence is seen in the reaction of sodium carbonate with L but not with M
• give ionic equations for all reactions.`,
    markScheme: [
      "Stage 1 - Identifications: red-brown precipitate from L = Fe(OH)₃; green precipitate from M = Fe(OH)₂ (with NH₃) and FeCO₃ (with Na₂CO₃); white precipitate with L = AgCl; white precipitate with M = BaSO₄; therefore L = FeCl₃ and M = FeSO₄",
      "Stage 2 - Reactions with sodium carbonate: carbon dioxide gas is produced from L; Fe³⁺ / [Fe(H₂O)₆]³⁺ (in L) is more acidic than Fe²⁺ / [Fe(H₂O)₆]²⁺ (in M); Fe³⁺ is smaller / has higher charge / greater charge density / is more polarising, making the ion a better proton donor",
      "Stage 3 - Equations: [Fe(H₂O)₆]³⁺ + 3NH₃ → Fe(H₂O)₃(OH)₃ + 3NH₄⁺; 2[Fe(H₂O)₆]³⁺ + 3CO₃²⁻ → 2Fe(H₂O)₃(OH)₃ + 3CO₂ + 3H₂O",
      "[Fe(H₂O)₆]²⁺ + 2NH₃ → Fe(H₂O)₄(OH)₂ + 2NH₄⁺; Fe(H₂O)₆²⁺ + CO₃²⁻ → FeCO₃ + 6H₂O",
      "Ag⁺ + Cl⁻ → AgCl; Ba²⁺ + SO₄²⁻ → BaSO₄"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is correct and virtually complete. Answer communicates the whole explanation coherently and shows a logical progression through all three stages." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages covered and the explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR only one stage is covered but the explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "This question requires three separate skills: identifying precipitates, explaining acidity differences between Fe³⁺ and Fe²⁺, and writing ionic equations. The key to the effervescence explanation is charge density: Fe³⁺ is a stronger acid than Fe²⁺ because it has a higher charge and smaller ionic radius."
  },
  {
    id: "aqa04",
    board: "aqa",
    category: "Equilibrium",
    marks: 6,
    question: `Hydrogen can be prepared on an industrial scale using the reversible reaction between methane and steam.

CH₄(g) + H₂O(g) ⇌ CO(g) + 3H₂(g)     ΔH = +206 kJ mol⁻¹

The reaction is done at a temperature of 800 °C and a low pressure of 300 kPa in the presence of a nickel catalyst.

Explain, in terms of equilibrium yield and cost, why these conditions are used.`,
    markScheme: [
      "Stage 1 - Temperature: the reaction is endothermic so equilibrium shifts to the right-hand side at higher temperature, increasing yield; high temperatures are costly so a compromise temperature is used",
      "Stage 2 - Pressure: more moles of gas on the right-hand side (4 mol) than the left (2 mol), so lower pressure increases the yield; a low pressure means a lower cost",
      "Stage 3 - Catalyst: catalyst has no effect on yield; adding a catalyst allows a lower temperature to be used; this lowers the cost"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Structure your answer in three clear sections: temperature, pressure, catalyst. For each, address yield AND cost. The forward reaction is endothermic so high temperature favours yield. There are more moles of gas on the right so low pressure favours yield. The catalyst does NOT change the yield."
  },
  {
    id: "aqa05",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: `The melting point of XeF₄ is higher than the melting point of PF₃.

Explain why the melting points of these two compounds are different. In your answer you should give the shape of each molecule, explain why each molecule has that shape and how the shape influences the forces that affect the melting point.`,
    markScheme: [
      "Stage 1 - Electron pairs: XeF₄ has 4 bonding pairs and 2 lone pairs around Xe; PF₃ has 3 bonding pairs and 1 lone pair around P",
      "Stage 2 - Explanation of shapes: XeF₄ is square planar; PF₃ is pyramidal; electron pairs repel as far as possible / lone pairs repel more than bonding pairs",
      "Stage 3 - Intermolecular forces: XeF₄ has van der Waals forces and PF₃ has dipole-dipole forces (and van der Waals); stronger/more intermolecular forces in XeF₄; due to larger Mr or more electrons or larger molecules"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the description of each stage is generally correct and virtually complete. Answer is communicated coherently and shows a logical progression from stage 1 to stage 2 and stage 3." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the description of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the description of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "This question requires you to link shapes to intermolecular forces to melting points. XeF₄ is non-polar (square planar, symmetric) so only has van der Waals forces, but these are stronger than PF₃'s dipole-dipole forces because XeF₄ has a much larger Mr and more electrons."
  },
  {
    id: "aqa06",
    board: "aqa",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: `The first ionisation energies of the elements in Period 2 change as the atomic number increases.

Explain the pattern in the first ionisation energies of the elements from lithium to neon.`,
    markScheme: [
      "Stage 1 - General trend (Li to Ne): first ionisation energy increases across the period; more protons / increased nuclear charge; electrons are in the same energy level / shell; no extra / similar shielding; stronger attraction between nucleus and outer electron",
      "Stage 2 - Deviation Be to B: boron is lower than beryllium; outer electron in B is in the 2p subshell; 2p is higher in energy than the 2s subshell (so easier to remove)",
      "Stage 3 - Deviation N to O: oxygen is lower than nitrogen; two electrons in a 2p orbital need to pair; pairing causes repulsion (making the paired electron easier to remove)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and each stage is generally correct and virtually complete. Answer is well structured with accurate and clear expression of ideas." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Structure your answer in three parts: general trend, deviation at B, deviation at O. For B: it is about the subshell (2p higher energy than 2s), NOT about shielding. For O: it is about electron pairing repulsion in the same 2p orbital, NOT about the subshell."
  },
  {
    id: "aqa07",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `Four compounds, all colourless liquids, are:
• butan-2-ol
• butanal
• butanone
• 2-methylpropan-2-ol

Two of these compounds can be identified using different test-tube reactions. Describe these two test-tube reactions by giving reagents and observations in each case.

Suggest how the results of a spectroscopic technique could be used to distinguish between the other two compounds.`,
    markScheme: [
      "Stage 1 - First test-tube reaction to identify one compound: e.g. Tollens' reagent (or Fehling's/Benedict's) identifies butanal by producing a silver mirror (or orange/brick-red precipitate); no reaction with the other three compounds",
      "Stage 2 - Second test-tube reaction to identify another compound: e.g. acidified potassium dichromate reacts with butanal and butan-2-ol (turns orange to green); no reaction with butanone or 2-methylpropan-2-ol. OR sodium reacts with butan-2-ol and 2-methylpropan-2-ol (fizzes) but not with the other two",
      "Stage 3 - Spectroscopic technique to distinguish remaining two: IR spectroscopy: one has a C=O peak at 1680-1750 cm⁻¹ (ketone) while the other has an O-H peak at 3230-3550 cm⁻¹ (alcohol). OR mass spectrometry: different Mr values or different fragmentation patterns. OR they would have different fingerprint regions below 1500 cm⁻¹"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All three stages are covered and explanation of each stage is generally correct and virtually complete, leading to all four compounds being distinguished. Chemical tests start with all compounds, reagents and observations are complete and correct." },
      { level: 2, marks: "3-4", descriptor: "All three stages are covered but explanations may be incomplete or contain inaccuracies OR two stages covered and explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages covered but explanations may be incomplete or contain inaccuracies OR one stage covered and explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Nothing valid to warrant a mark." }
    ],
    examTip: "Think systematically: which single test eliminates one compound? Tollens' reagent is the best first test as it uniquely identifies the aldehyde (butanal). Then use dichromate to split alcohols from ketones. For the remaining pair, state the specific wavenumber ranges for IR."
  },
  {
    id: "aqa08",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `Compounds A, B and C all have the molecular formula C₅H₁₀.

A and B decolourise bromine water but C does not. B exists as two stereoisomers but A does not show stereoisomerism.

Use this information to deduce a possible structure for each of compounds A, B and C and explain your deductions. State the meaning of the term stereoisomers and explain how they arise in compound B.`,
    markScheme: [
      "Stage 1 - Deduces which compounds are unsaturated: A and B are unsaturated / contain C=C / are alkenes because they decolourise bromine water; C is saturated / does not contain C=C / is a cycloalkane because it does not decolourise bromine water",
      "Stage 2 - Deduces the structures: A = a suitable alkene that does not show E/Z isomerism (e.g. pent-1-ene, 2-methylbut-1-ene, 3-methylbut-1-ene); B = pent-2-ene (or 2-methylbut-2-ene); C = cyclopentane (or methylcyclobutane or dimethylcyclopropane)",
      "Stage 3 - Explains stereoisomerism: stereoisomers are molecules with the same structural formula but a different arrangement of atoms/groups in space; E/Z isomerism arises because there is restricted rotation around the C=C bond; each carbon in the C=C bond has two different groups attached"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered, three correct structures are given and each stage is generally correct and virtually complete. Answer communicates reasoning coherently including explaining about stereoisomerism." },
      { level: 2, marks: "3-4", descriptor: "Two stages are covered or parts of three stages (if two stages are covered, they must be complete for 4 marks)." },
      { level: 1, marks: "1-2", descriptor: "One stage covered or parts of two stages (if one stage is covered, it must be complete for 2 marks)." },
      { level: 0, marks: "0", descriptor: "No relevant correct chemistry to warrant a mark." }
    ],
    examTip: "Key deductions: bromine water test tells you about C=C bonds. If C₅H₁₀ has no C=C but is unsaturated by hydrogen count, it must be cyclic. For stereoisomerism in B, you need restricted rotation AND two different groups on each C of the C=C."
  },
  {
    id: "aqa09",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: `Titanium(IV) chloride can be made from titanium(IV) oxide as shown in the equation.

TiO₂(s) + 2C(s) + 2Cl₂(g) → 2CO(g) + TiCl₄(l)     ΔH° = -60.0 kJ mol⁻¹

Some entropy data are shown in the table:

Substance | S° / J K⁻¹ mol⁻¹
TiO₂(s)  | 50.2
C(s)      | 5.70
Cl₂(g)   | 223
CO(g)     | 198
TiCl₄(l) | 253

Use the equation and the data in the table to calculate the Gibbs free-energy change for this reaction at 989 °C. Give your answer to the appropriate number of significant figures.

Use your answer to explain whether this reaction is feasible.`,
    markScheme: [
      "ΔS = ΣS(products) - ΣS(reactants) = [253 + 2(198)] - [50.2 + 2(5.70) + 2(223)] = 649 - 507.6 = +141(.4) J K⁻¹ mol⁻¹",
      "Temperature converted to Kelvin: T = 989 + 273 = 1262 K",
      "ΔG = ΔH - TΔS = -60.0 - (1262 x 141.4 x 10⁻³) = -60.0 - 178.4",
      "ΔG = -238 kJ mol⁻¹ (to 3 significant figures)",
      "The reaction is feasible because ΔG is negative (less than zero)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer communicates the whole process coherently." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR only one stage is covered but the explanation is generally correct and virtually complete." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Two critical unit conversions: (1) Temperature MUST be in Kelvin (989 + 273 = 1262 K). (2) ΔS MUST be converted from J K⁻¹ mol⁻¹ to kJ K⁻¹ mol⁻¹ (divide by 1000) before using in ΔG = ΔH - TΔS. Answer to 3 significant figures as specified."
  },


  {
    id: "aqa10",
    board: "aqa",
    category: "Intermolecular Forces",
    marks: 6,
    question: `The boiling points of the hydrogen halides are shown below:

Compound | HF | HCl | HBr | HI
Boiling point / K | 293 | 188 | 206 | 237

Explain the pattern in boiling points in relation to the bonding, structure and intermolecular forces present in the four compounds.`,
    markScheme: [
      "All four compounds are covalent molecular",
      "HF has hydrogen bonding, which is the strongest intermolecular force and takes the most energy to overcome, giving HF the highest boiling point",
      "HCl, HBr and HI all have permanent dipole attractions and van der Waals forces, which are weaker than hydrogen bonding",
      "As you go down the group, the halide molecule becomes larger and contains more electrons",
      "The strength of the van der Waals forces increases down the group, so boiling points increase as it takes more energy to overcome these forces"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Identifies molecular structure, gives types of force present and links to trends in boiling point for all halides" },
      { level: 2, marks: "3-4", descriptor: "Links boiling point of HF to strength of hydrogen bonding and increasing boiling point of other halides to increasing van der Waals forces" },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies some of the intermolecular forces and links to boiling points" },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa11",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `Outline a two-stage procedure to produce the ester, ethyl ethanoate, using ethanol as the only organic reagent. For each step in the procedure you should include: reagents and conditions, chemical equations and the type of reaction taking place. Details of reaction mechanisms or purification steps are not required.`,
    markScheme: [
      "Stage 1: Reflux ethanol with excess acidified potassium dichromate to produce ethanoic acid",
      "Equation: CH₃CH₂OH + 2[O] → CH₃COOH + H₂O",
      "Type of reaction: oxidation",
      "Stage 2: Reflux ethanoic acid and ethanol in the presence of concentrated sulfuric acid (catalyst)",
      "Equation: CH₃CH₂OH + CH₃COOH → CH₃COOCH₂CH₃ + H₂O",
      "Type of reaction: condensation (esterification)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correct reagents and conditions, equations and reaction types for both stages. For full marks, must give full names or formulae of reagents." },
      { level: 2, marks: "3-4", descriptor: "Identifies oxidation to produce acid and reaction with alcohol to produce ester; at least 3 out of 6 correct for reagents and conditions, equations and reaction types." },
      { level: 1, marks: "1-2", descriptor: "Identifies oxidation to produce acid and reaction with alcohol to produce ester; some correct reagents/conditions/type of reaction." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa12",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `Using calcium as an example, describe the reactions of group 2 metals with cold water. You should include a balanced equation, observations you would make and an explanation of why this is a redox reaction.

Describe and explain the trend in reactivity of group 2 metals as you go down the group.`,
    markScheme: [
      "Balanced equation: Ca + 2H₂O → Ca(OH)₂ + H₂",
      "Observations: bubbling/fizzing, the metal disappears, slight white precipitate (Ca(OH)₂ is only slightly soluble)",
      "Calcium goes from oxidation state 0 to +2: it loses electrons and is oxidised",
      "Hydrogen (in water) goes from oxidation state +1 to 0: it gains electrons and is reduced",
      "Metals get more reactive down the group as there are more electron shells, more shielding and outer electrons are further from the nucleus",
      "The attraction between outer electrons and nucleus is weaker down the group so it takes less energy to remove the electrons"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correct balanced equation and observations plus both explanations correct. Minor errors or omissions can score 5." },
      { level: 2, marks: "3-4", descriptor: "Correct balanced equation and at least one observation plus either one fully correct explanation (redox or reactivity) or partly correct explanation for both." },
      { level: 1, marks: "1-2", descriptor: "Either mostly correct observations/explanation of redox or mostly correct explanation of reactivity." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa13",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 8,
    question: `You are given aqueous solutions of chlorine, bromine and iodine along with solid samples of potassium chloride, potassium bromide and potassium iodide.

Describe how you could use these chemicals to demonstrate the trend in oxidising ability as you go down the group. You should include observations you would make along with examples of full balanced and ionic equations for reactions that take place. You do not need to include details of practical equipment.`,
    markScheme: [
      "Add the aqueous halogens to small samples of the solid halides and observe colour changes",
      "A stronger oxidising agent (more reactive halogen) will displace a weaker one from its compound",
      "Chlorine + potassium bromide turns from colourless to orange (bromine formed) showing chlorine is a stronger oxidising agent",
      "Chlorine + potassium iodide turns from colourless to brown (iodine produced)",
      "Bromine + potassium iodide turns from orange to brown (iodine produced) showing bromine is a stronger oxidising agent than iodine",
      "Iodine produces no colour change with potassium chloride or potassium bromide as iodine is the weakest oxidising agent",
      "Full equation example: Cl₂ + 2KBr → 2KCl + Br₂",
      "Ionic equation example: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂"
    ],
    levels: [
      { level: 3, marks: "6-8", descriptor: "All equations and observations correct and linked to oxidising ability trend." },
      { level: 2, marks: "3-5", descriptor: "At least one correct equation, order of oxidising ability correct and linked to experimental observations with at least two correct colour changes." },
      { level: 1, marks: "1-2", descriptor: "Identifies use of displacement reactions and gives some correct observations linked to oxidising power." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa14",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: `The standard enthalpy of combustion of successive straight-chain alkanes shows a linear relationship with chain length.

Give the definition for standard enthalpy of combustion, and write a balanced equation (including state symbols) for this reaction using butane as an example.

Explain, in terms of bond making and breaking, why the reactions are exothermic and why the relationship is linear.`,
    markScheme: [
      "Standard enthalpy of combustion is the enthalpy change when one mole of a substance burns completely in excess oxygen under standard conditions",
      "Balanced equation: C₄H₁₀(g) + 6.5O₂(g) → 4CO₂(g) + 5H₂O(l)",
      "Reactions are exothermic because the energy required to break bonds in reactants is less than the energy released when new bonds are made in products",
      "As the number of carbons increases, the number of C-C, C-H and O=O bonds broken increases by the same amount each time",
      "The number of C=O and O-H bonds made also increases by the same amount each time",
      "Therefore the difference in enthalpy of combustion values is the same each time the carbon chain length increases, giving a linear relationship"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully correct definition and equation and clear explanation linking to same number and type of bonds broken and made." },
      { level: 2, marks: "3-4", descriptor: "Fully correct definition and equation and some explanation in terms of bond making/breaking." },
      { level: 1, marks: "1-2", descriptor: "Mostly correct definition, correct equation and some explanation." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa15",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `You are provided with unlabelled samples of three isomeric alcohols:
- Butan-1-ol
- Butan-2-ol
- 2-methylpropan-2-ol

You also have access to common laboratory equipment and chemicals.

Outline a practical procedure which would identify each of the three alcohols using chemical reactions and observations alone. You do not need to include descriptions or diagrams of practical apparatus, nor refer to safety procedures.`,
    markScheme: [
      "Heat/warm each sample with acidified potassium dichromate",
      "Butan-1-ol (primary) and butan-2-ol (secondary) both turn the mixture from orange to green; 2-methylpropan-2-ol (tertiary) will not change",
      "Take fresh samples of the two remaining alcohols and heat with acidified potassium dichromate, separating the product immediately with distillation",
      "Test the product with Tollens reagent (or Fehlings solution)",
      "Butan-1-ol produces an aldehyde as the distillate, which gives a silver mirror with Tollens (or red precipitate with Fehlings)",
      "Butan-2-ol produces a ketone, which does not react with Tollens"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correct use of oxidising agent plus distillation and testing of products, linked to identifying original alcohol based on classification." },
      { level: 2, marks: "3-4", descriptor: "Identifies use of oxidising agent and links the tests to the classification of each alcohol and products formed." },
      { level: 1, marks: "1-2", descriptor: "Identifies oxidising agent as a test to eliminate tertiary alcohol." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa16",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `You are given three unlabelled solids that are known to be: sodium carbonate, sodium chloride and sodium bromide.

Outline a procedure that could be used to identify each sample using simple laboratory tests and write ionic equations for the reactions that take place.`,
    markScheme: [
      "Dissolve the solids in distilled/deionised water",
      "Identifying the carbonate: add hydrochloric acid (or sulfuric/nitric acid) and the sample that produces bubbles/effervesces contains sodium carbonate",
      "Ionic equation: 2H⁺ + CO₃²⁻ → CO₂ + H₂O",
      "Identifying halides: add nitric acid and silver nitrate solution",
      "Sodium chloride gives a white precipitate; sodium bromide gives a cream precipitate",
      "Equations: Ag⁺(aq) + Cl⁻(aq) → AgCl(s) and Ag⁺(aq) + Br⁻(aq) → AgBr(s)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies both carbonate and halide tests with results and correct ionic equations with state symbols. Also identifies need to dissolve solids in distilled water." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies both carbonate and halide tests with results and mostly correct ionic equations." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies either carbonate or halide ion test with one correct equation." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa17",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 8,
    question: `Three different organic compounds are isomers with the molecular formula C₅H₁₀O. None of the compounds exist as stereoisomers.

More information about each isomer is presented in the table below:

Isomer | X | Y | Z
IR spectrum | Broad peak around 3500 cm⁻¹ and peak at 1650 cm⁻¹ | Broad peak around 3500 cm⁻¹ | Broad peak around 3500 cm⁻¹ and peak at 1650 cm⁻¹
Chemical tests | Reacts with bromine water but does not react with acidified potassium dichromate | Does not react with bromine water but does react with acidified potassium dichromate | Reacts with bromine water and with acidified potassium dichromate
Mass spectrum peaks | m/z: 15, 27, 59 | m/z: 17, 69 | m/z: 27, 31, 59

Deduce possible structures for each of the compounds, using all the information in the table to justify your answers.`,
    markScheme: [
      "Compound X: IR shows C=C (1650) and O-H (3500). Reacts with bromine water so contains an alkene. Does not react with dichromate so must be a tertiary alcohol",
      "Mass spec peaks: 15 = CH₃⁺, 27 = C₂H₃⁺, 59 = C₃H₆OH⁺",
      "Compound Y: IR shows O-H (3500). No reaction with bromine water and no C=C on IR, but C:H ratio is 1:2. Must be a cyclic alcohol. Reacts with dichromate so could be primary or secondary",
      "Mass spec peaks: 17 = OH⁺, 69 = C₅H₉⁺",
      "Compound Z: IR shows O-H (3500) and C=C (1650). Reacts with bromine so contains an alkene. Reacts with dichromate so could be primary or secondary alcohol",
      "Mass spec peaks: 27 = C₂H₃⁺, 31 = CH₂OH⁺, 59 = CH₂CH₂CH₂OH⁺"
    ],
    levels: [
      { level: 3, marks: "7-8", descriptor: "Correctly identifies all 3 structures with links to all information." },
      { level: 2, marks: "4-6", descriptor: "Correctly identifies three structures that match IR spectra and chemical tests. At least one reference to stereoisomerism." },
      { level: 1, marks: "1-3", descriptor: "Correctly identifies at least two structures with links to information from the table." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa18",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `The structures of three organic compounds are benzene, ethylamine (CH₃CH₂NH₂) and phenylamine (C₆H₅NH₂).

- Explain whether you would expect phenylamine to be a stronger or weaker base than ethylamine.
- Explain whether you would expect phenylamine to be more or less reactive than benzene in electrophilic substitution reactions.

In your answer you should include relevant definitions and examples, but do not need to include equations or mechanisms.`,
    markScheme: [
      "Phenylamine is a weaker base than ethylamine",
      "A base is a proton acceptor; both contain an amine functional group which acts as a base when the lone pair on the nitrogen bonds with H⁺",
      "In phenylamine, the lone pair on the nitrogen delocalises into the benzene ring, making it less available to donate to H⁺",
      "Phenylamine would be more reactive than benzene in electrophilic substitution reactions",
      "Electrophiles are attracted to the electron density of the benzene ring and accept a pair of electrons from the system",
      "In phenylamine, the lone pair of the nitrogen delocalises into the benzene ring, increasing the electron density and making it react more readily with electrophiles"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Both comparisons correct with full descriptions of how delocalisation of nitrogen electrons impacts reactivity." },
      { level: 2, marks: "3-4", descriptor: "Both comparisons correct with a correct definition/explanation of base and electrophile behaviour." },
      { level: 1, marks: "1-2", descriptor: "At least one correct comparison with a definition or explanation." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa19",
    board: "aqa",
    category: "Physical Chemistry",
    marks: 6,
    question: `Ethanoic acid is a weak acid that can be used to prepare a buffer solution.

Describe how you would use a solution of ethanoic acid and a solution of sodium hydroxide, both of equal concentrations, to prepare a buffer solution. Explain how your solution could act as a buffer when small amounts of hydrochloric acid are added.

You may illustrate your answer with equations, but do not need to include calculations.`,
    markScheme: [
      "Mix the acid and sodium hydroxide using approximately half the volume of sodium hydroxide compared to ethanoic acid",
      "The NaOH reacts with ethanoic acid to form sodium ethanoate (its salt/conjugate base): CH₃COOH + NaOH → CH₃COONa + H₂O",
      "A buffer solution contains a mixture of a weak acid and its conjugate base",
      "The buffer contains both the weak acid and its conjugate base in equilibrium: CH₃COOH ⇌ CH₃COO⁻ + H⁺",
      "When acid is added, H⁺ ions react with CH₃COO⁻ ions to form CH₃COOH",
      "Because the buffer contains relatively large amounts of both acid and conjugate base, the ratio does not change significantly and neither does the pH"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Identifies that fewer moles of NaOH are needed so some acid remains, and clearly identifies the significance of both acid and salt being present in large quantities so pH change is minimised." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies that fewer moles of NaOH are added so some acid remains. Explains effect of buffer in terms of equilibrium position." },
      { level: 1, marks: "1-2", descriptor: "Adds NaOH to the acid and explains that a salt will form and that a buffer is a mixture of weak acid and salt." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa20",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `Transition metal ions can form complex ions with different coordination numbers and shapes, depending on the transition metal and ligand involved. Some of these complexes can exist as stereoisomers.

Describe the types of stereoisomerism that can exist in transition metal complexes. You should refer to specific examples where possible, and illustrate your answer with relevant diagrams.`,
    markScheme: [
      "Cis/trans isomers can form in square planar complexes (coordination number 4) when there are two different ligands, e.g. cisplatin and transplatin",
      "In cis isomers, both same-type ligands are on the same side; in trans isomers they are on opposite sides",
      "Cis/trans isomerism also occurs in octahedral complexes (coordination number 6) with two different ligands",
      "Optical isomers can form in octahedral complexes with at least two bidentate ligands",
      "Optical isomers are non-superimposable mirror images"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies cis/trans in square planar and octahedral, as well as optical isomerism, with diagrams, definition of optical isomers and reference to coordination number and complex shape." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies that both cis/trans and optical isomerism can occur, with examples and reference to the coordination number or shape of the complex." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies at least one form of isomerism with an appropriate diagram and example." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa21",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `Hydroxide ions can behave as nucleophiles or bases when they react with haloalkanes. Explain the difference between these two terms and, for each case:

- Give an example equation for a reaction in which the behaviour occurs, using 1-bromobutane as the haloalkane, and name the organic product
- Give the reaction conditions necessary and name the type of reaction`,
    markScheme: [
      "Nucleophile: donates a lone pair of electrons to a positively polarised carbon atom",
      "Occurs in nucleophilic substitution reactions, in aqueous solvent",
      "Equation: CH₃CH₂CH₂CH₂Br + OH⁻ → CH₃CH₂CH₂CH₂OH + Br⁻. Product: butan-1-ol",
      "Base: proton acceptor / lone pair bonds with H⁺",
      "Occurs in elimination reactions, in ethanol solvent",
      "Equation: CH₃CH₂CH₂CH₂Br + OH⁻ → CH₃CH₂CH=CH₂ + H₂O + Br⁻. Product: but-1-ene"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All details correct: definitions, equations, product names, conditions and reaction types for both cases." },
      { level: 2, marks: "3-4", descriptor: "Correct definitions and balanced equations for both and some product names/conditions correct." },
      { level: 1, marks: "1-2", descriptor: "Correct definition and balanced equation for one example, or two correct definitions, or two correct balanced equations." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa22",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 8,
    question: `1-chloropropane can be prepared in two different reactions:

- The electrophilic addition reaction between HCl and propene
- The free radical substitution reaction between chlorine and propane in the presence of UV light

For each reaction, outline the mechanism and explain why neither reaction will produce a high yield of the desired product. You should refer to how the reaction mechanisms give rise to alternative products.`,
    markScheme: [
      "Electrophilic addition: reaction proceeds via a carbocation intermediate. Two possible carbocations can form (primary or secondary)",
      "The secondary carbocation is more stable, so the major product will be 2-chloropropane rather than 1-chloropropane",
      "Free radical substitution: initiation: Cl₂ → 2Cl•",
      "Propagation: Cl• + C₃H₈ → HCl + C₃H₇• then C₃H₇• + Cl₂ → C₃H₇Cl + Cl•",
      "It is random which hydrogen is replaced, so the product could be 1-chloropropane or 2-chloropropane",
      "With excess chlorine, multiple substitutions can occur (dichloropropane, trichloropropane etc.)",
      "Termination steps can produce longer-chain products e.g. 2C₃H₇• → C₆H₁₄"
    ],
    levels: [
      { level: 3, marks: "7-8", descriptor: "Both mechanisms correctly outlined and clear links between both mechanisms and alternative products." },
      { level: 2, marks: "4-6", descriptor: "Both mechanisms correctly outlined and at least one linked to alternative products." },
      { level: 1, marks: "1-3", descriptor: "At least one mechanism correctly outlined and some reference to alternative products." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa23",
    board: "aqa",
    category: "Practical Chemistry",
    marks: 6,
    question: `Describe how you could carry out an experiment to calculate the enthalpy of neutralisation in kJ mol⁻¹. You are provided with solutions of hydrochloric acid and sodium hydroxide of equal concentrations along with standard laboratory equipment.

In your answer you should clearly state the measurements you would take. You should also explain how results from the experiment would be used to calculate the enthalpy of neutralisation, and what assumptions you made in this calculation.`,
    markScheme: [
      "Measure out 25 cm³ hydrochloric acid using a volumetric pipette and add to a polystyrene cup",
      "Place the cup in a beaker and use a thermometer to take its temperature; record every 30 seconds for two minutes to ensure temperature is stable",
      "Add 25 cm³ sodium hydroxide solution using a volumetric pipette. Stir and record the highest temperature reached",
      "Calculate moles of acid (or alkali) = concentration x volume in dm³",
      "Heat energy transferred (J) = mass of solution x 4.18 x change in temperature. Convert J to kJ and divide by moles to get enthalpy change",
      "Assumptions: density of solutions is the same as water (1 g cm⁻³) and specific heat capacity of solutions is the same as water (4.18 J g⁻¹ K⁻¹)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully correct procedure and description of calculations plus assumptions made." },
      { level: 2, marks: "3-4", descriptor: "Procedure that includes volume measurement, temperature measurements, stirring and mostly correct calculation description." },
      { level: 1, marks: "1-2", descriptor: "Procedure that includes measurement of start and final temperature and calculation using specific heat capacity." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },
  {
    id: "aqa24",
    board: "aqa",
    category: "Practical Chemistry",
    marks: 6,
    question: `Hydrated sodium carbonate (Na₂CO₃·10H₂O) is a solid at room temperature and is soluble in water.

Describe how you would prepare 250 cm³ of a solution of hydrated sodium carbonate (Na₂CO₃·10H₂O) with an accurately known concentration of approximately 0.0100 mol dm⁻³. You should include a calculation with your answer.`,
    markScheme: [
      "Moles = 0.01 x 0.25 = 0.0025 mol. Mr = 106 + (10 x 18) = 286. Mass = 0.0025 x 286 = 0.715 g",
      "Zero the balance with an empty weighing boat. Add approximately 0.715 g solid. Record mass of solid and weighing boat",
      "Add solid to a clean dry beaker, reweigh the weighing boat. Subtract to obtain accurate mass (weighing by difference)",
      "Add around 100 cm³ distilled water to the beaker and stir to dissolve",
      "Pour the solution into a 250 cm³ volumetric flask using a funnel. Rinse the beaker with more distilled water and add to the flask",
      "Add distilled water to just below the line, then make up to the line with a pipette. Ensure the bottom of the meniscus touches the line. Stopper and invert several times to mix"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully correct procedure including description of accurate weighing technique and volume measurement." },
      { level: 2, marks: "3-4", descriptor: "Correct calculation of mass, use of volumetric flask and key details such as stirring, rinsing the beaker and inverting the flask." },
      { level: 1, marks: "1-2", descriptor: "Procedure that includes a calculation, weighing and dissolving the solid and use of a volumetric flask." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  OCR A 6-mark extended-response questions (from source PDF)
  // ═══════════════════════════════════════════════════════════
  {
    id: "ocr01",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 8,
    question: `The table below gives some information about the elements magnesium and oxygen and the compound magnesium oxide.

Substance | Melting point /K | Electrical conductivity
Magnesium | 922 | Conducts when solid or molten
Oxygen | 55 | None
Magnesium oxide | 3125 | Conducts when molten or aqueous

Explain the differences in physical properties between these three substances, referring to the structure and bonding present.`,
    markScheme: [
      "Magnesium has metallic bonding: a lattice of positive metal ions surrounded by a sea of delocalised electrons. Strong electrostatic forces of attraction between the positive ions and delocalised electrons require a lot of energy to overcome, so magnesium has a high melting point.",
      "The delocalised electrons are free to move through the structure and carry charge, so magnesium conducts electricity.",
      "Magnesium oxide has an ionic lattice structure with strong electrostatic forces of attraction between oppositely charged ions. These require a lot of energy to overcome, so magnesium oxide has a very high melting point.",
      "As a solid, the ions are fixed in place so are not free to move. When molten or aqueous, ions are free to move and carry charge, so magnesium oxide conducts when molten or aqueous but not when solid.",
      "Oxygen has a covalent molecular structure. Although there are strong covalent bonds between oxygen atoms, there are only weak intermolecular forces between molecules which do not require a lot of energy to overcome, so oxygen has a very low melting point.",
      "There are no delocalised electrons or free-moving ions in oxygen, so it does not conduct electricity."
    ],
    levels: [
      { level: 3, marks: "6-8", descriptor: "Correctly links bonding and structure to both properties for all three substances." },
      { level: 2, marks: "4-5", descriptor: "Correctly links bonding and structure to both properties for two substances or to one property for three substances." },
      { level: 1, marks: "1-3", descriptor: "Correctly links bonding and structure to both properties for one substance or to one property for two substances." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Cover all three substances systematically. For each one: name the bonding type, explain the melting point, and explain the electrical conductivity. Do not use 'atoms' when you mean 'ions'. Do not refer to intermolecular forces in lattice substances."
  },
  {
    id: "ocr02",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: `Aluminium forms compounds with group 7 elements with the empirical formula AlX₃. Aluminium chloride and aluminium fluoride are both solids which sublime (they turn from a solid to a gas when heated). The sublimation temperature of aluminium fluoride is over 1000°C higher than that of aluminium chloride.

Explain why the two halides have such different sublimation temperatures. You should refer to the structure and bonding present in the two compounds and also refer to the electronegativity values given below:

Element | Electronegativity value
Aluminium | 1.5
Chlorine | 3.0
Fluorine | 4.0`,
    markScheme: [
      "Fluorine is more electronegative than chlorine. When aluminium bonds with fluorine, the electronegativity difference is large (4.0 - 1.5 = 2.5) and aluminium fluoride is an ionic compound.",
      "When aluminium bonds with chlorine, the electronegativity difference is smaller (3.0 - 1.5 = 1.5) and aluminium chloride is a covalent compound.",
      "Aluminium fluoride is an ionic lattice with strong electrostatic forces of attraction between oppositely charged ions. These take a lot of energy to overcome, so aluminium fluoride has a high sublimation temperature.",
      "Aluminium chloride is a covalent molecule with only weak intermolecular forces between molecules, so it sublimes at a much lower temperature than aluminium fluoride."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly links bonding and structure to sublimation temperature for both compounds and links electronegativity difference to different types of bonding." },
      { level: 2, marks: "3-4", descriptor: "Links bonding and structure of both compounds to sublimation temperature OR explains one correctly and links type of bonding to difference in electronegativity." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies the different types of bonding/structure in both compounds OR links bonding and structure of one compound to its sublimation temperature." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "You must refer to the electronegativity difference between the elements in the compound, not just state that F is more electronegative than Cl. Remember this question is about sublimation temperature, not melting point."
  },
  {
    id: "ocr03",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: `Water molecules can accept hydrogen ions from acids to form the H₃O⁺ ion.

Use electron pair repulsion theory to predict and explain why the shapes and bond angles in water and the H₃O⁺ ion differ. You can use diagrams in your answer.`,
    markScheme: [
      "In water the oxygen atom has four areas of electrons: two lone pairs and two bonds. Electron pairs repel, so move apart to minimise repulsion.",
      "The largest angle they could move apart would be 109.5°, but lone pairs repel more than bonded pairs so the angle is reduced to 104.5°. The shape is non-linear (bent/V-shaped).",
      "In H₃O⁺ the oxygen atom also has four areas of electrons: one lone pair and three bonds.",
      "There is only one lone pair, so the bond angle is reduced less than in water, to 107°. The shape is trigonal pyramidal."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies shape and bond angle for both species and links to electron pair repulsion theory." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies shape and bond angle for both species OR for one species with links to electron pair repulsion theory." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies the shape and bond angle for one species, or correctly identifies shape or bond angle for both." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Talk about electron pairs repelling in general before discussing lone pair vs bonding pair repulsion. Be careful not to say trigonal planar instead of trigonal pyramidal. You can score marks using displayed formulae or dot-and-cross diagrams."
  },
  {
    id: "ocr04",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: `The boiling points of the hydrogen halides are shown below:

Compound | Boiling point / °C
HF | +19.5
HCl | -85
HBr | -67
HI | -35

Explain the pattern in boiling points in relation to the bonding, structure and intermolecular forces present in the four compounds.`,
    markScheme: [
      "All four compounds are covalent molecular substances.",
      "HF has hydrogen bonding between molecules, which is the strongest type of intermolecular force and takes the most energy to overcome. This gives HF the highest boiling point.",
      "HCl, HBr and HI all have permanent dipole-dipole attractions and van der Waals (London dispersion) forces between molecules. These are weaker than hydrogen bonding.",
      "As you go down the group from HCl to HI, the halide molecule becomes larger and contains more electrons. The strength of the van der Waals forces therefore increases as you go down the group.",
      "The boiling points of HCl, HBr and HI increase because it takes more energy to overcome the stronger van der Waals forces in the larger molecules."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Identifies molecular structure, gives types of force present and links to trends in boiling point for all halides." },
      { level: 2, marks: "3-4", descriptor: "Links boiling point of HF to strength of hydrogen bonding and increasing boiling point of other halides to increasing van der Waals forces." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies some of the intermolecular forces and links to boiling points." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Clearly state that hydrogen bonding is the strongest intermolecular force. Mention permanent dipoles but emphasise it is the van der Waals forces that give the trend from HCl to HI. Link strength of van der Waals to number of electrons, not increasing mass or surface area."
  },
  {
    id: "ocr05",
    board: "ocr",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: `The first five ionisation energies (in kJ mol⁻¹) of magnesium and aluminium are given below:

Ionisation energy | Magnesium | Aluminium
1st | 738 | 578
2nd | 1451 | 1817
3rd | 7733 | 2745
4th | 10541 | 11578
5th | 13629 | 14831

With reference to the electron configurations of the elements, explain the differences between:
• The first ionisation energies of the two elements
• The second ionisation energies of the two elements`,
    markScheme: [
      "Electron configurations: Mg 1s² 2s² 2p⁶ 3s², Al 1s² 2s² 2p⁶ 3s² 3p¹",
      "First ionisation energies: the electron removed from Mg is from the 3s subshell, whereas the electron removed from Al is from the 3p subshell. The 3p subshell is higher in energy than the 3s, so (despite the increased nuclear charge of Al) the attraction between the nucleus and outer electron is weaker, and the electron takes less energy to remove from aluminium.",
      "Second ionisation energies: the second electron is removed from the same subshell (3s) for both Mg and Al. Aluminium has a greater nuclear charge, so the electron being removed is more strongly attracted to the nucleus. The second electron is therefore more difficult to remove from Al and the second IE is higher."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Full explanation of both differences with reference to electron configuration." },
      { level: 2, marks: "3-4", descriptor: "Correct explanation of one difference with reference to electron configurations and partial explanation of other difference." },
      { level: 1, marks: "1-2", descriptor: "Correct explanation of either 1st or 2nd IE difference with no reference to electron configurations." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give the full electron configuration for both elements. This is a comparison question: do not use 'it' or 'they' - be clear which element you are talking about. Shielding is not relevant here as both elements are in the same period."
  },
  {
    id: "ocr06",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `Outline a two-stage procedure to produce the ester, ethyl ethanoate, using ethanol as the only organic reagent.

For each step in the procedure you should include: reagents and conditions, chemical equations and the type of reaction taking place. Details of reaction mechanisms or purification steps are not required.`,
    markScheme: [
      "Stage 1: Prepare ethanoic acid from some of the ethanol. Reflux ethanol with excess acidified potassium dichromate to produce ethanoic acid. Equation: CH₃CH₂OH + 2[O] → CH₃COOH + H₂O. Type of reaction: oxidation.",
      "Stage 2: React ethanoic acid with ethanol. Reflux ethanoic acid and ethanol in the presence of concentrated sulfuric acid (catalyst). Equation: CH₃CH₂OH + CH₃COOH → CH₃COOCH₂CH₃ + H₂O. Type of reaction: condensation (esterification)."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correct reagents and conditions, equations and reaction types for both stages. For full marks, must give full names or formulae of reagents." },
      { level: 2, marks: "3-4", descriptor: "Identifies oxidation to produce acid and reaction with alcohol to produce ester; at least 3 out of 6 correct for reagents and conditions, equations and reaction types." },
      { level: 1, marks: "1-2", descriptor: "Identifies oxidation to produce acid and reaction with alcohol to produce ester; some correct reagents/conditions/type of reaction." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Using [O] for oxidation of alcohols is fine but do not use molecular formulae for products - the structure needs to be clear. The acid catalyst for making an ester must be concentrated. Technically, the ester reaction is a condensation."
  },
  {
    id: "ocr07",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `Using calcium as an example, describe the reactions of group 2 metals with cold water. You should include a balanced equation, observations you would make and an explanation of why this is a redox reaction.

Describe and explain the trend in reactivity of group 2 metals as you go down the group.`,
    markScheme: [
      "Balanced equation: Ca + 2H₂O → Ca(OH)₂ + H₂. Observations: bubbling/effervescence, the metal disappears. For calcium there will be a slight white precipitate as calcium hydroxide is only slightly soluble.",
      "The calcium goes from oxidation state 0 to +2: it loses electrons and is oxidised. Hydrogen (in water) goes from oxidation state +1 to 0: it gains electrons and is reduced.",
      "Trend in reactivity: metals get more reactive as you go down the group. There are more electron shells, so more shielding and the outer electrons are further from the nucleus.",
      "The attraction between outer electrons and nucleus is weaker down the group so it takes less energy to remove the electrons."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correct balanced equation and observations plus both explanations (redox and reactivity trend) correct. Minor errors or omissions can score 5." },
      { level: 2, marks: "3-4", descriptor: "Correct balanced equation and at least one observation plus either one fully correct explanation or partly correct explanation for both." },
      { level: 1, marks: "1-2", descriptor: "Either mostly correct observations/explanation of redox or mostly correct explanation of reactivity." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Reaction with cold water produces hydroxides, not oxides. Link redox to change in oxidation state as well as to loss and gain of electrons. For trends down a group, refer to distance from nucleus and shielding as influencing attraction."
  },
  {
    id: "ocr08",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 8,
    question: `You are given aqueous solutions of chlorine, bromine and iodine along with solid samples of potassium chloride, potassium bromide and potassium iodide.

Describe how you could use these chemicals to demonstrate the trend in oxidising ability as you go down the group. You should include observations you would make along with examples of full balanced and ionic equations for reactions that take place. You do not need to include details of practical equipment.`,
    markScheme: [
      "Add the aqueous halogens to small samples of the solid halides and observe colour changes. A stronger oxidising agent (more reactive halogen) will displace a weaker one from its compound.",
      "Chlorine + potassium bromide: turns from colourless to orange (bromine formed) - chlorine is a stronger oxidising agent than bromine. Chlorine + potassium iodide: turns from colourless to brown (iodine produced).",
      "Bromine + potassium chloride: stays orange (no reaction). Bromine + potassium iodide: turns from orange to brown (iodine produced) - bromine is a stronger oxidising agent than iodine.",
      "Iodine produces no colour change with potassium chloride or potassium bromide as iodine is the weakest oxidising agent.",
      "Example full equation: Cl₂ + 2KBr → 2KCl + Br₂. Ionic equation: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂."
    ],
    levels: [
      { level: 3, marks: "6-8", descriptor: "All equations and observations correct and linked to oxidising ability trend." },
      { level: 2, marks: "3-5", descriptor: "At least one correct equation, order of oxidising ability correct and linked to experimental observations with at least two correct colour changes." },
      { level: 1, marks: "1-2", descriptor: "Identifies use of displacement reactions and gives some correct observations linked to oxidising power." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give colour changes (e.g. 'from orange to brown') not just 'turns brown'. You do not need to dissolve the solid halides first. State which halogen is the stronger oxidising agent in each case."
  },
  {
    id: "ocr09",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: `The standard enthalpy of combustion of successive straight-chain alkanes shows a linear relationship with chain length.

(a) Give the definition of standard enthalpy of combustion.
(b) Write a balanced equation, including state symbols, for the complete combustion of butane.
(c) Explain, in terms of bond making and breaking, why combustion reactions are exothermic.
(d) Explain why the enthalpy of combustion shows a linear relationship with carbon chain length.`,
    markScheme: [
      "Definition: the enthalpy change when one mole of a substance burns completely in excess oxygen under standard conditions.",
      "Equation: C₄H₁₀(g) + 6.5O₂(g) → 4CO₂(g) + 5H₂O(l). Must include state symbols and be balanced for one mole of butane.",
      "Reactions are exothermic because the energy released when new bonds are made in the products (C=O and O-H) is greater than the energy required to break bonds in the reactants (C-C, C-H and O=O).",
      "As the number of carbons increases, the number of C-C, C-H and O=O bonds broken increases by the same amount each time. The number of C=O and O-H bonds made also increases by the same amount each time.",
      "Therefore the difference in enthalpy of combustion values is the same each time the carbon chain length increases, giving a linear relationship."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully correct definition and equation and clear explanation linking to same number and type of bonds broken and made each time." },
      { level: 2, marks: "3-4", descriptor: "Fully correct definition and equation and some explanation in terms of bond making/breaking." },
      { level: 1, marks: "1-2", descriptor: "Mostly correct definition, correct equation and some explanation." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The equation needs to be for one mole only. For 5-6 marks you need to explain that the additional bonds broken and made are the same number and type each time you add a carbon. The question is about the linear relationship, not just that the value increases."
  },
  {
    id: "ocr10",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `You are provided with unlabelled samples of three isomeric alcohols:
• Butan-1-ol
• Butan-2-ol
• 2-methylpropan-2-ol

You also have access to common laboratory equipment and chemicals.

Outline a practical procedure which would identify each of the three alcohols using chemical reactions and observations alone. You do not need to include descriptions or diagrams of practical apparatus, nor refer to safety procedures.`,
    markScheme: [
      "Identification of 2-methylpropan-2-ol: heat/warm each sample with acidified potassium dichromate. Butan-1-ol (primary) and butan-2-ol (secondary) will both turn the mixture from orange to green. 2-methylpropan-2-ol (tertiary) will show no colour change.",
      "Identification of butan-1-ol and butan-2-ol: take fresh samples of the two remaining alcohols. Heat with acidified potassium dichromate and separate the product immediately by distillation.",
      "Test the distillate with Tollens' reagent: butan-1-ol will produce an aldehyde, which will produce a silver mirror. Butan-2-ol will produce a ketone, which will not react with Tollens' reagent."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correct use of oxidising agent plus distillation and testing of products, and links to identifying original alcohol based on classification." },
      { level: 2, marks: "3-4", descriptor: "Identifies use of oxidising agent and links the tests to the classification of each alcohol and products formed." },
      { level: 1, marks: "1-2", descriptor: "Identifies oxidising agent as a test to eliminate tertiary alcohol." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Eliminate the tertiary alcohol first with dichromate. Then use distillation with dichromate on the other two, followed by Tollens' test on the distillate. You could also use Fehling's instead of Tollens' (blue to brick-red precipitate for the aldehyde)."
  },
  {
    id: "ocr11",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `You are given three unlabelled solids that are known to be: sodium carbonate, sodium chloride and sodium bromide.

Outline a procedure that could be used to identify each sample using simple laboratory tests and write ionic equations for the reactions that take place.`,
    markScheme: [
      "Dissolve the solids in distilled/deionised water and carry out the following tests, using fresh samples each time.",
      "Identifying the carbonate: add hydrochloric acid (or sulfuric or nitric acid) to each sample. The sample that produces bubbles/effervesces contains sodium carbonate. Ionic equation: 2H⁺(aq) + CO₃²⁻(aq) → CO₂(g) + H₂O(l)",
      "Identifying the halides: add nitric acid then silver nitrate solution to the remaining two samples. Sodium chloride will give a white precipitate: Ag⁺(aq) + Cl⁻(aq) → AgCl(s). Sodium bromide will give a cream precipitate: Ag⁺(aq) + Br⁻(aq) → AgBr(s)."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies both carbonate and halide tests with results and correct ionic equations with state symbols for precipitation. Also identifies need to dissolve solids in distilled water." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies both carbonate and halide tests with results and mostly correct ionic equations." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies either carbonate or halide ion test with one correct equation." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Ionic equations for precipitation must contain state symbols. You cannot make a precipitate unless you start with a solution of the solid. Use nitric acid with silver nitrate (not hydrochloric acid, as that would add chloride ions and interfere with the test)."
  },
  {
    id: "ocr12",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 8,
    question: `Three different organic compounds are isomers with the molecular formula C₅H₁₀O. None of the compounds exist as stereoisomers.

More information about each isomer is presented in the table below:

Isomer | IR spectrum | Chemical tests | Mass spectrum (m/z)
X | Broad peak ~3500 cm⁻¹, Peak at 1650 cm⁻¹ | Reacts with bromine water, does NOT react with acidified K₂Cr₂O₇ | 15, 27, 59
Y | Broad peak ~3500 cm⁻¹ | Does NOT react with bromine water, DOES react with acidified K₂Cr₂O₇ | 17, 69
Z | Broad peak ~3500 cm⁻¹, Peak at 1650 cm⁻¹ | Reacts with bromine water AND with acidified K₂Cr₂O₇ | 27, 31, 59

Deduce possible structures for each of the compounds, using all the information in the table to justify your answers.`,
    markScheme: [
      "Compound X: IR shows O-H (3500) and C=C (1650). Reacts with bromine water so contains an alkene. Does not react with dichromate so must be a tertiary alcohol. OH cannot be attached to C=C as no stereoisomerism. Mass spec: 15 = CH₃⁺, 27 = C₂H₃⁺, 59 = C₃H₆OH⁺. Structure: 2-methylbut-3-en-2-ol.",
      "Compound Y: IR shows O-H (3500) but no C=C peak. No reaction with bromine water confirms no C=C. Does react with dichromate so could be primary or secondary alcohol. C:H ratio of 1:2 with no double bond means it must be cyclic. Mass spec: 17 = OH⁺, 69 = C₅H₉⁺. Structure: cyclopentanol.",
      "Compound Z: IR shows O-H (3500) and C=C (1650). Reacts with both bromine water and dichromate, so contains a C=C and is a primary or secondary alcohol. Peak at 27 matches CH₂=CH-. Mass spec: 27 = C₂H₃⁺, 31 = CH₂OH⁺, 59 = CH₂CH₂CH₂OH⁺. Structure: pent-4-en-1-ol."
    ],
    levels: [
      { level: 3, marks: "7-8", descriptor: "Correctly identifies all 3 structures with links to all information from IR, chemical tests and mass spectrum." },
      { level: 2, marks: "4-6", descriptor: "Correctly identifies three structures that match IR spectra and chemical tests. At least one reference to stereoisomerism." },
      { level: 1, marks: "1-3", descriptor: "Correctly identifies at least two structures with links to information from the table." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Remember that stereoisomer can mean E/Z or optical isomer. Be careful of C=C bonds on IR (close to C=O). The chemical tests confirm alkenes. If the molecular formula suggests unsaturation but there is no C=C, the compound must be cyclic."
  },
  {
    id: "ocr13",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `Draw the structures of all the possible isomers with the formula C₄H₈ that contain a C=C bond. Name the isomers and use them as examples to explain the different types of isomerism occurring.

You should include any relevant definitions in your answer.`,
    markScheme: [
      "Structural isomers: molecules with the same molecular formula but different structural formula. The structural isomers are but-1-ene, but-2-ene and methylpropene.",
      "But-1-ene and but-2-ene are position isomers (same functional group, different position). Methylpropene is a chain isomer (different carbon skeleton).",
      "Stereoisomers / E/Z isomers: but-2-ene has E/Z isomerism. This occurs due to restricted rotation around the C=C bond, and the fact that each carbon on the C=C bond has two different groups attached.",
      "In (Z)-but-2-ene, the two highest priority groups (the methyl groups) are on the same side of the C=C bond. In the (E) isomer they are on opposite sides."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies all three structural isomers plus stereoisomers, with definitions and description of position/chain isomerism and/or explanation of E/Z naming." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies all three structural isomers plus stereoisomers, with definition of structural isomer and explanation of how E/Z isomers arise." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies either the three structural isomers or the two stereoisomers with correct names. Correct definition of structural isomer or explanation of E/Z isomers." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "This question asks for isomers with C=C bonds, so cyclobutane does not apply. When drawing E/Z isomers, make it clear which groups are on which side of the C=C bond."
  },
  {
    id: "ocr14",
    board: "ocr",
    category: "Equilibrium",
    marks: 8,
    question: `Hydrogen is produced in industry from the reaction between methane and steam. The first stage in this process is shown below.

CH₄(g) + H₂O(g) ⇌ CO(g) + 3H₂(g)     ΔH = +206 kJ mol⁻¹

Use ideas about rates of reaction, collision theory and Le Chatelier's principle to explain why conditions of high temperature and high pressure are used in this process.`,
    markScheme: [
      "High temperature increases rate of reaction: particles have more kinetic energy, so particles collide more often and a greater proportion of collisions are successful as more particles have at least the activation energy. More successful collisions per second.",
      "High temperature also increases yield: the forward reaction is endothermic, so increasing temperature shifts the position of equilibrium to the right-hand side, producing more hydrogen.",
      "High pressure increases rate of reaction: more particles in a given volume, so particles collide more often and there are more successful collisions per second.",
      "However, high pressure decreases yield: increasing pressure shifts the position of equilibrium to the side with fewer moles of gas, which is the left-hand side (2 mol vs 4 mol). So high pressure produces a lower yield, but lower pressures would result in too slow a rate of reaction."
    ],
    levels: [
      { level: 3, marks: "7-8", descriptor: "Correctly links both conditions to effect on yield and rate with full explanation in terms of Le Chatelier and collision theory." },
      { level: 2, marks: "4-6", descriptor: "Correctly links both conditions to effect on yield and rate with some explanation either in terms of Le Chatelier or collision theory." },
      { level: 1, marks: "1-3", descriptor: "Correctly links at least one condition to effect on yield or rate, or links both conditions to effect on yield or rate." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "This question requires collision theory in your explanation - refer to frequency of collisions and, for temperature, the number of particles with at least the activation energy. Remember that conditions rarely have a positive effect on both rate and yield simultaneously."
  },
  {
    id: "ocr15",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `The structures of three organic compounds are benzene, ethylamine (CH₃CH₂NH₂) and phenylamine (C₆H₅NH₂).

• Explain whether you would expect phenylamine to be a stronger or weaker base than ethylamine.
• Explain whether you would expect phenylamine to be more or less reactive than benzene in electrophilic substitution reactions.

In your answer you should include relevant definitions and examples, but do not need to include equations or mechanisms.`,
    markScheme: [
      "Phenylamine is a weaker base than ethylamine. A base is a proton acceptor. Both contain an amine functional group which acts as a base when the lone pair on the nitrogen bonds with H⁺.",
      "In phenylamine, the lone pair on the nitrogen delocalises into the benzene ring, making it less available to donate to H⁺. Therefore phenylamine is a weaker base.",
      "Phenylamine would be more reactive than benzene in electrophilic substitution reactions. Electrophiles are attracted to the electron density of the benzene ring.",
      "In phenylamine, the lone pair of the nitrogen delocalises into the benzene ring, increasing the electron density of the ring, making it react more readily with electrophiles."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Both comparisons correct with full descriptions of how delocalisation of nitrogen electrons impacts reactivity." },
      { level: 2, marks: "3-4", descriptor: "Both comparisons correct with a correct definition/explanation of base and electrophile behaviour." },
      { level: 1, marks: "1-2", descriptor: "At least one correct comparison with a definition or explanation." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Both parts relate to delocalisation of the nitrogen lone pair. In base behaviour, delocalisation reduces lone pair availability. In electrophilic substitution, delocalisation increases ring electron density. Make sure you know definitions of base and electrophile."
  },
  {
    id: "ocr16",
    board: "ocr",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: `Ethanoic acid is a weak acid that can be used to prepare a buffer solution.

Describe how you would use a solution of ethanoic acid and a solution of sodium hydroxide, both of equal concentrations, to prepare a buffer solution.

Explain how your solution could act as a buffer when small amounts of hydrochloric acid are added. You may illustrate your answer with equations, but do not need to include calculations.`,
    markScheme: [
      "Preparation: mix together the acid and sodium hydroxide using approximately half the volume of sodium hydroxide compared to ethanoic acid. The NaOH reacts with some ethanoic acid to form sodium ethanoate (conjugate base): CH₃COOH + NaOH → CH₃COONa + H₂O. A buffer contains a mixture of a weak acid and its conjugate base.",
      "The buffer contains both the weak acid and its conjugate base in equilibrium: CH₃COOH ⇌ CH₃COO⁻ + H⁺",
      "When a small amount of acid (H⁺) is added, the H⁺ ions react with the CH₃COO⁻ ions to form CH₃COOH. The concentration of CH₃COOH increases slightly and CH₃COO⁻ decreases slightly.",
      "However, because the buffer solution contains relatively large amounts of both acid and conjugate base, the ratio does not change significantly and neither does the pH."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies that fewer moles of NaOH are added so some acid remains. Explains effect of buffer in terms of equilibrium, clearly identifying the significance of both acid and salt being present in large quantities." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies that fewer moles of NaOH are needed. Explains effect of buffer in terms of equilibrium position." },
      { level: 1, marks: "1-2", descriptor: "Adds NaOH to the acid and explains that a salt will form and that a buffer is a mixture of weak acid and salt." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The key to a high mark is explaining WHY the pH barely changes: because both acid and conjugate base are present in large amounts, so the ratio changes only slightly."
  },
  {
    id: "ocr17",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `Transition metal ions can form complex ions with different coordination numbers and shapes, depending on the transition metal and ligand involved. Some of these complexes can exist as stereoisomers.

Describe the types of stereoisomerism that can exist in transition metal complexes. You should refer to specific examples where possible, and illustrate your answer with relevant diagrams.`,
    markScheme: [
      "Cis/trans isomers: platinum forms square planar complexes with a coordination number of 4. If there are two different ligands then cis/trans isomers can form. In cisplatin, both same-type ligands are on the same side; in transplatin, they are on opposite sides.",
      "Cis/trans isomerism also occurs in octahedral complexes with coordination number of 6, if there are two different ligands. For example, in [CoCl₂(NH₃)₄]⁺: the trans isomer has the two Cl ligands 180° apart; the cis isomer has them 90° apart.",
      "Optical isomers: octahedral complexes can form optical isomers if they contain at least two bidentate ligands (e.g. [Ni(en)₃]²⁺).",
      "Optical isomers are non-superimposable mirror images of each other. They rotate plane-polarised light in opposite directions."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Correctly identifies cis/trans in square planar and octahedral, as well as optical isomerism, with diagrams, definition of optical isomers and reference to coordination number and complex shape." },
      { level: 2, marks: "3-4", descriptor: "Correctly identifies that both cis/trans and optical isomerism can occur, with examples and reference to the coordination number or shape of the complex." },
      { level: 1, marks: "1-2", descriptor: "Correctly identifies at least one form of isomerism with an appropriate diagram and example." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "There is more than one type of stereoisomerism in complexes, and cis/trans can occur in octahedral as well as square planar. For optical isomers, do not refer to chirality - just draw the non-superimposable mirror images."
  },
  {
    id: "ocr18",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 8,
    question: `1-chloropropane can be prepared in two different reactions:
• The electrophilic addition reaction between HCl and propene
• The free radical substitution reaction between chlorine and propane in the presence of UV light

For each reaction, outline the mechanism and explain why neither reaction will produce a high yield of the desired product. You should refer to how the reaction mechanisms give rise to alternative products.`,
    markScheme: [
      "Electrophilic addition: the reaction proceeds via a carbocation intermediate. Two possible carbocations can form (primary or secondary). The secondary carbocation is more stable, so the major product is 2-chloropropane, not 1-chloropropane.",
      "Free radical substitution - initiation: Cl₂ → 2Cl• (UV light causes homolytic fission). Propagation: Cl• + C₃H₈ → HCl + C₃H₇•; then C₃H₇• + Cl₂ → C₃H₇Cl + Cl•.",
      "It is random which hydrogen is replaced, so C₃H₇Cl could be 1-chloropropane or 2-chloropropane. The yield of 1-chloropropane is not high.",
      "Termination: any two radicals combine (e.g. 2C₃H₇• → C₆H₁₄). With excess chlorine, multiple substitutions can occur to produce polychlorinated products, further reducing yield."
    ],
    levels: [
      { level: 3, marks: "7-8", descriptor: "Both mechanisms correctly outlined and clear links between both mechanisms and alternative products." },
      { level: 2, marks: "4-6", descriptor: "Both mechanisms correctly outlined and at least one linked to alternative products." },
      { level: 1, marks: "1-3", descriptor: "At least one mechanism correctly outlined and some reference to alternative products." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Show curly arrows for electrophilic addition (with dipoles, lone pairs and charges). For free radical substitution, show initiation, propagation and termination steps. Use Markovnikov's rule to explain why 2-chloropropane is the major product from electrophilic addition."
  },
  {
    id: "ocr19",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: `Describe how you could carry out an experiment to calculate the enthalpy of neutralisation in kJ mol⁻¹.

You are provided with solutions of hydrochloric acid and sodium hydroxide of equal concentrations along with standard laboratory equipment.

In your answer you should clearly state the measurements you would take. You should also explain how results from the experiment would be used to calculate the enthalpy of neutralisation, and what assumptions you made in this calculation.`,
    markScheme: [
      "Method: measure out a known volume (e.g. 25 cm³) of hydrochloric acid using a volumetric pipette and add to a polystyrene cup inside a beaker. Record the temperature every 30 seconds for two minutes to confirm a stable baseline temperature.",
      "Add an equal volume (25 cm³) of sodium hydroxide solution using a volumetric pipette. Stir with the thermometer and record the highest temperature reached. Calculate the temperature change (ΔT).",
      "Calculations: moles of acid = concentration x volume (in dm³). Heat energy transferred (q, in J) = mass of solution x 4.18 x ΔT. Mass of solution = total volume (e.g. 50 g, assuming density = 1 g cm⁻³).",
      "Convert energy in J to kJ (divide by 1000) and divide by moles to get enthalpy of neutralisation in kJ mol⁻¹.",
      "Assumptions: the specific heat capacity of the solution is 4.18 J g⁻¹ K⁻¹ (same as water); the density of the solutions is 1 g cm⁻³; no heat is lost to the surroundings."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully correct procedure and description of calculations plus assumptions made." },
      { level: 2, marks: "3-4", descriptor: "Procedure includes volume measurement, temperature measurements, stirring and mostly correct calculation description." },
      { level: 1, marks: "1-2", descriptor: "Procedure includes measurement of start and final temperature and calculation using specific heat capacity." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The final answer needs to be in kJ mol⁻¹, so show clearly how to calculate both kJ and mol. Equal volumes of acid and alkali should be used. Simple details like stirring are often forgotten by students."
  },
  {
    id: "ocr20",
    board: "ocr",
    category: "Practical Chemistry",
    marks: 6,
    question: `Hydrated sodium carbonate (Na₂CO₃·10H₂O) is a solid at room temperature and is soluble in water.

Describe how you would prepare 250 cm³ of a solution of hydrated sodium carbonate (Na₂CO₃·10H₂O) with an accurately known concentration of approximately 0.0100 mol dm⁻³.

You should include a calculation with your answer.

Mᵣ(Na₂CO₃) = 106; Mᵣ(H₂O) = 18`,
    markScheme: [
      "Calculation: moles = 0.0100 x 0.250 = 2.50 x 10⁻³ mol. Mᵣ(Na₂CO₃·10H₂O) = 106 + (10 x 18) = 286. Mass required = 2.50 x 10⁻³ x 286 = 0.715 g.",
      "Zero the balance with an empty weighing boat. Add approximately 0.715 g of solid. Record the mass of solid and weighing boat. Transfer the solid to a clean, dry beaker. Reweigh the empty weighing boat. Calculate the accurate mass by difference.",
      "Add approximately 100 cm³ of distilled water to the beaker and stir to dissolve the solid completely.",
      "Pour the solution into a 250 cm³ volumetric flask using a funnel. Rinse the beaker with more distilled water and add the rinsings to the flask.",
      "Add distilled water to the flask until just below the graduation mark, then make up to the line using a pipette. The bottom of the meniscus should touch the line. Stopper the flask and invert several times to mix."
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully correct procedure including description of accurate weighing technique (by difference) and volume measurement." },
      { level: 2, marks: "3-4", descriptor: "Correct calculation of mass, use of volumetric flask and key details such as stirring, rinsing the beaker and inverting the flask." },
      { level: 1, marks: "1-2", descriptor: "Procedure includes a calculation, weighing and dissolving the solid and use of a volumetric flask." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Key points examiners look for: (1) weighing by difference (not just 'weigh the solid'), (2) rinsing the beaker into the flask to ensure complete transfer, (3) adding water to the graduation mark using a pipette for accuracy, (4) stopper and invert to mix."
  }
];
