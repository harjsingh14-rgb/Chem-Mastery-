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
  },
  // ═══════════════════════════════════════════════════════════
  //  HSJ-written extended questions (AQA, OCR A, Edexcel)
  // ═══════════════════════════════════════════════════════════
  {
    id: "aqa25",
    board: "aqa",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "Explain how a time of flight (TOF) mass spectrometer is used to determine the relative atomic mass of a sample of a metal. In your answer you should describe how the ions are formed, how they are separated and how they are detected.",
    markScheme: [
      "Ionisation: electron impact (a high energy electron knocks an electron out of the atom to form a 1+ ion) or electrospray (the sample gains a proton from a volatile solvent to form a 1+ ion)",
      "Acceleration: ions are accelerated by an electric field so that all ions of the same charge have the same kinetic energy",
      "Ion drift: ions travel through the flight tube at a speed that depends on their mass; lighter ions move faster and reach the detector first (KE = ½mv² so v = √(2KE/m))",
      "Detection: ions hit the detector and gain an electron, generating a current; the size of the current is proportional to the abundance of that ion",
      "Relative atomic mass = Σ(m/z × abundance) ÷ total abundance, using the peaks for each isotope"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Four stages must all be present: ionisation, acceleration, ion drift, detection. State explicitly that the ions have the same kinetic energy after acceleration so that the time of flight depends on mass only."
  },
  {
    id: "aqa26",
    board: "aqa",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "The first ionisation energies of the Period 3 elements show a general increase from sodium to argon, but aluminium and sulfur do not fit this trend. Explain the general trend and the two anomalies.",
    markScheme: [
      "General increase: nuclear charge increases across the period while electrons are added to the same shell, so shielding is similar and the outer electrons are more strongly attracted",
      "Atomic radius decreases across the period, increasing the attraction between the nucleus and the outer electron",
      "Aluminium: the outer electron is in the 3p subshell, which is higher in energy than the 3s subshell of magnesium and slightly more shielded, so less energy is needed to remove it",
      "Sulfur: the electron is removed from a 3p orbital that contains a pair of electrons; in phosphorus the 3p electrons are all unpaired",
      "The repulsion between the paired electrons in sulfur makes it easier to remove one, so the first ionisation energy of sulfur is lower than that of phosphorus"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name the specific subshells (3s, 3p) and the specific pair of elements being compared. 'Shielding' alone is not enough for aluminium; you must say the 3p electron is higher in energy."
  },
  {
    id: "aqa27",
    board: "aqa",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "Describe and explain the trend in melting points of the Period 3 elements from sodium to argon. In your answer, refer to the structure and bonding of each type of element.",
    markScheme: [
      "Na, Mg, Al: giant metallic lattices; melting point rises because the charge on the ion increases (1+, 2+, 3+) and there are more delocalised electrons, so the attraction between ions and electrons is stronger",
      "Si: giant covalent (macromolecular) structure with many strong covalent bonds that must be broken, so the highest melting point",
      "P₄, S₈, Cl₂: simple molecular with weak van der Waals forces between molecules; little energy needed to overcome them, so low melting points",
      "S₈ has the highest melting point of these because it is the largest molecule with the most electrons, giving the strongest van der Waals forces; P₄ next; Cl₂ lowest",
      "Ar: monatomic with very weak van der Waals forces, so the lowest melting point of all"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Put the elements into their three groups (metals, giant covalent, simple molecular) and explain each. Students often lose the mark for S₈ > P₄ > Cl₂, which needs the number of electrons per molecule."
  },
  {
    id: "aqa28",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: "Ammonia, NH₃, and boron trifluoride, BF₃, react together to form a single compound. Explain the shapes of NH₃ and BF₃, and describe the bonding in the compound they form.",
    markScheme: [
      "NH₃: three bonding pairs and one lone pair around nitrogen, giving a trigonal pyramidal shape with a bond angle of about 107°",
      "The lone pair repels more than the bonding pairs, so the angle is less than 109.5°",
      "BF₃: three bonding pairs and no lone pairs, so trigonal planar with bond angles of 120°",
      "The nitrogen lone pair is donated into the empty orbital on boron, forming a co-ordinate (dative covalent) bond, shown as an arrow from N to B",
      "In the product both atoms have four bonding pairs so the shape around each becomes tetrahedral with angles of about 109.5°"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The question has three parts: shape of NH₃, shape of BF₃, bonding in the adduct. Define the co-ordinate bond as a shared pair in which both electrons come from one atom, and say which atom donates."
  },
  {
    id: "aqa29",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: "Compare the structure and bonding in graphite and diamond, and use your comparison to explain the differences in their electrical conductivity, hardness and melting points.",
    markScheme: [
      "Both are giant covalent (macromolecular) structures of carbon with strong covalent bonds",
      "Diamond: each carbon bonded to four others in a tetrahedral arrangement; no delocalised electrons, so it does not conduct",
      "Graphite: each carbon bonded to three others in planar hexagonal layers; the fourth electron is delocalised between the layers and can carry charge, so graphite conducts",
      "Diamond is very hard because the rigid three-dimensional network of covalent bonds resists deformation; graphite is soft because the layers are held only by weak van der Waals forces and can slide",
      "Both have very high melting points because many strong covalent bonds must be broken; graphite's is similar or higher"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Say 'each carbon bonded to three/four other carbons' rather than 'three/four bonds'. The delocalised electrons must be linked to conductivity, and the weak forces between layers to softness."
  },
  {
    id: "aqa30",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: "Explain why the boiling points of the hydrogen halides HF, HCl, HBr and HI follow the order HCl < HBr < HI < HF. Refer to all the intermolecular forces involved.",
    markScheme: [
      "All four are polar molecules with permanent dipole-dipole forces and van der Waals forces between molecules",
      "From HCl to HBr to HI the number of electrons increases, so van der Waals forces get stronger and more energy is needed to separate the molecules",
      "The increase in van der Waals forces outweighs the decrease in dipole-dipole forces as electronegativity of the halogen falls",
      "HF has hydrogen bonding because fluorine is very electronegative and small, giving a highly δ+ hydrogen and a lone pair on F",
      "Hydrogen bonds are much stronger than the other intermolecular forces, so HF has the highest boiling point despite having the fewest electrons"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Two separate explanations are needed: the trend HCl to HI (van der Waals) and the anomaly of HF (hydrogen bonding). Mention that it is intermolecular forces, not the H–X bonds, that are overcome on boiling."
  },
  {
    id: "aqa31",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: "Describe how you would determine the enthalpy change of neutralisation for the reaction between dilute hydrochloric acid and dilute sodium hydroxide solution in the laboratory. Explain how the results would be used and why the value obtained is likely to be less exothermic than the accepted value.",
    markScheme: [
      "Measure known volumes (e.g. 25.0 cm³) of acid and alkali of known concentration using a pipette or burette; record the initial temperature of each",
      "Mix in a polystyrene cup with a lid, stir, record the temperature at regular intervals (or the maximum temperature); extrapolate a temperature-time graph to the time of mixing to find ΔT",
      "Calculate q = m × c × ΔT using the total mass of solution (density 1 g cm⁻³) and c = 4.18 J g⁻¹ K⁻¹",
      "Calculate moles of water formed from the moles of acid or alkali (whichever is limiting); ΔH = −q ÷ n, converted to kJ mol⁻¹",
      "Less exothermic because heat is lost to the surroundings and the cup, and the specific heat capacity of the solution is assumed to be that of water"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The extrapolation method gains credit for accuracy. Make sure your sign is negative for an exothermic reaction and that you divide by moles of water (not moles of total reactants)."
  },
  {
    id: "aqa32",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: "Explain, using Hess's law, how the standard enthalpy of formation of propane can be determined from standard enthalpies of combustion. Explain why the value obtained from mean bond enthalpies would be different.",
    markScheme: [
      "Hess's law: the enthalpy change for a reaction is independent of the route taken, provided the initial and final states are the same",
      "Write the formation equation 3C(s) + 4H₂(g) → C₃H₈(g) and a cycle via the combustion products CO₂ and H₂O",
      "ΔfH = Σ ΔcH(elements) − ΔcH(propane) = 3ΔcH(C) + 4ΔcH(H₂) − ΔcH(C₃H₈)",
      "The combustion route works because the same products (3CO₂ + 4H₂O) are formed from the elements and from propane",
      "Mean bond enthalpies are averages over many different compounds, so the actual bond enthalpies in propane differ; bond enthalpies also apply to gaseous species, so state changes (carbon is solid) are ignored"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the cycle with arrows going downwards to the combustion products and show the arithmetic. 'Mean bond enthalpies are averages' is the key phrase for the final part."
  },
  {
    id: "aqa33",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: "Use the concept of a Born-Haber cycle to explain how the lattice enthalpy of formation of magnesium chloride can be determined. State the enthalpy changes needed and explain why the second electron affinity is not required for this compound.",
    markScheme: [
      "Lattice enthalpy of formation: the enthalpy change when one mole of the solid ionic compound is formed from its gaseous ions, Mg²⁺(g) + 2Cl⁻(g) → MgCl₂(s)",
      "Enthalpies needed: enthalpy of formation of MgCl₂, atomisation of Mg, first and second ionisation energies of Mg, atomisation of Cl (×2), first electron affinity of Cl (×2)",
      "Apply Hess's law round the cycle: ΔfH = ΔatH(Mg) + IE1 + IE2 + 2ΔatH(Cl) + 2EA1 + ΔLEH, so ΔLEH = ΔfH − (all other terms)",
      "The two chlorine terms must be doubled because two moles of chloride ions are formed",
      "Second electron affinity is not needed because each chlorine atom gains only one electron to form Cl⁻; a second electron affinity applies to ions such as O²⁻"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Define lattice enthalpy with state symbols. The two most common errors are forgetting to double the chlorine terms and forgetting the second ionisation energy of magnesium."
  },
  {
    id: "aqa34",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: "The theoretical lattice enthalpy of silver iodide calculated from a perfect ionic model is significantly less exothermic than the experimental value from a Born-Haber cycle. Explain what this difference shows about the bonding in silver iodide and compare this with sodium chloride, where the two values are very similar.",
    markScheme: [
      "The perfect ionic model assumes ions are perfect spheres with evenly distributed charge and only electrostatic attraction between them",
      "The experimental value is more exothermic, so there is additional bonding not accounted for by the ionic model: covalent character",
      "The silver ion polarises the large iodide ion, distorting its electron cloud so that electron density is shared between the ions",
      "I⁻ is large and easily polarised; Ag⁺ has a high polarising power, so the covalent character is significant",
      "In NaCl the ions are small or less polarisable and the Na⁺ ion has low polarising power, so the bonding is close to purely ionic and the two values agree"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Say which value is more exothermic and why: extra covalent bonding adds to the attraction. Use the words 'polarises', 'polarising power' and 'polarisable' correctly."
  },
  {
    id: "aqa35",
    board: "aqa",
    category: "Energetics",
    marks: 6,
    question: "Explain what is meant by entropy and Gibbs free energy, and explain how these quantities can be used to predict whether a reaction is feasible at a given temperature. Illustrate your answer by considering the thermal decomposition of calcium carbonate, which is endothermic.",
    markScheme: [
      "Entropy S is a measure of disorder (the number of ways particles and energy can be arranged); gases have higher entropy than liquids and solids",
      "ΔG = ΔH − TΔS; a reaction is feasible when ΔG ≤ 0",
      "For CaCO₃ → CaO + CO₂, ΔH is positive (endothermic) and ΔS is positive because a gas is produced from a solid",
      "At low temperature TΔS is small so ΔG is positive and the reaction is not feasible; at high temperature TΔS exceeds ΔH and ΔG becomes negative",
      "The minimum temperature for feasibility is when ΔG = 0, so T = ΔH ÷ ΔS (with ΔS converted to kJ K⁻¹ mol⁻¹)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Convert units: ΔS is usually in J K⁻¹ mol⁻¹ and ΔH in kJ mol⁻¹. Remember a feasible reaction may still be very slow because of a high activation energy."
  },
  {
    id: "aqa36",
    board: "aqa",
    category: "Kinetics",
    marks: 6,
    question: "The reaction between hydrogen and iodine was studied and the rate equation was found to be rate = k[H₂][I₂]. Explain how the orders of reaction could have been determined experimentally using the initial rates method, and explain what the rate equation shows about the mechanism.",
    markScheme: [
      "Carry out a series of experiments in which the initial concentration of one reactant is varied while the other is kept constant",
      "Measure the initial rate for each experiment, for example by drawing a tangent at t = 0 to a concentration-time graph (or using a clock method where rate ∝ 1/t)",
      "Compare rate with concentration: if doubling [H₂] doubles the rate, the reaction is first order with respect to H₂; repeat for I₂",
      "Overall order is the sum of the individual orders (second order); k can be found by substituting values into the rate equation",
      "The rate equation shows that one molecule of each reactant is involved in (or before) the rate-determining step, consistent with a single bimolecular step"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The initial rates method must say 'keep the other concentration constant' and 'measure initial rate'. Link the rate equation to the rate-determining step; species not in the rate equation react after it."
  },
  {
    id: "aqa37",
    board: "aqa",
    category: "Kinetics",
    marks: 6,
    question: "Explain how the Arrhenius equation, k = Ae^(−Ea/RT), can be used to determine the activation energy of a reaction from experimental data. Describe how the data would be collected and processed, and explain how a catalyst would change the result.",
    markScheme: [
      "Take logs: ln k = ln A − Ea/RT, which is the equation of a straight line when ln k is plotted against 1/T",
      "Measure the rate constant k at several different temperatures (by measuring the rate at known concentrations, with temperature kept constant in a water bath for each run)",
      "Plot ln k (y axis) against 1/T (x axis, with T in kelvin); the graph is a straight line with gradient −Ea/R",
      "Ea = −gradient × R (R = 8.31 J K⁻¹ mol⁻¹); the intercept gives ln A",
      "A catalyst lowers Ea by providing an alternative route, so the gradient would be less steep and k larger at every temperature"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "State the axes explicitly and the gradient expression. Convert temperatures to kelvin and give Ea in kJ mol⁻¹ with the correct sign (positive)."
  },
  {
    id: "aqa38",
    board: "aqa",
    category: "Kinetics",
    marks: 6,
    question: "The hydrolysis of 2-bromo-2-methylpropane by hydroxide ions is first order with respect to the haloalkane and zero order with respect to hydroxide ions. The hydrolysis of 1-bromobutane is first order with respect to both. Explain these observations in terms of the mechanisms of the two reactions.",
    markScheme: [
      "Rate equations: rate = k[(CH₃)₃CBr] for the tertiary haloalkane and rate = k[CH₃CH₂CH₂CH₂Br][OH⁻] for the primary",
      "The tertiary haloalkane reacts by a two-step mechanism: slow heterolytic fission of the C–Br bond to form a tertiary carbocation, then fast attack by OH⁻",
      "The slow step (rate-determining step) involves only the haloalkane, so OH⁻ does not appear in the rate equation",
      "The tertiary carbocation is stabilised by the positive inductive effect of three alkyl groups, making this route favourable",
      "The primary haloalkane reacts in a single step in which OH⁻ attacks the δ+ carbon as the C–Br bond breaks; both species are in the rate-determining step so both are first order"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Link 'zero order' explicitly to 'not involved in the rate-determining step'. Explain carbocation stability with the inductive effect of alkyl groups."
  },
  {
    id: "aqa39",
    board: "aqa",
    category: "Equilibrium",
    marks: 6,
    question: "Nitrogen dioxide dimerises according to the equation 2NO₂(g) ⇌ N₂O₄(g), ΔH = −57 kJ mol⁻¹. Explain, with reference to the equilibrium constant Kp, how the composition of the equilibrium mixture changes when the pressure is increased at constant temperature and when the temperature is increased at constant pressure.",
    markScheme: [
      "Kp = p(N₂O₄) / p(NO₂)², and Kp is constant at a fixed temperature",
      "Increasing pressure increases both partial pressures, but p(NO₂)² increases more than p(N₂O₄), so the ratio falls below Kp",
      "The system responds by converting NO₂ to N₂O₄ until the ratio equals Kp again, so the proportion of N₂O₄ increases (fewer moles of gas)",
      "Increasing temperature decreases Kp because the forward reaction is exothermic (equilibrium shifts in the endothermic direction)",
      "A smaller Kp means a smaller p(N₂O₄)/p(NO₂)² ratio, so the mixture contains more NO₂ (darker brown)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Pressure does not change Kp; temperature does. Explain the pressure effect through the ratio becoming temporarily unequal to Kp rather than just quoting Le Chatelier."
  },
  {
    id: "aqa40",
    board: "aqa",
    category: "Equilibrium",
    marks: 6,
    question: "Ethanol is manufactured by the hydration of ethene: C₂H₄(g) + H₂O(g) ⇌ C₂H₅OH(g), ΔH = −46 kJ mol⁻¹. The conditions used are 300 °C, 60 to 70 atm and a phosphoric acid catalyst. Explain why these conditions are chosen, considering both equilibrium yield and rate.",
    markScheme: [
      "A low temperature favours a high equilibrium yield because the forward reaction is exothermic",
      "However a low temperature gives a slow rate, so 300 °C is a compromise between yield and rate",
      "A high pressure favours the forward reaction because 2 moles of gas form 1 mole, increasing yield; high pressure also increases rate by increasing collision frequency",
      "Pressure is limited to 60 to 70 atm because very high pressures are expensive (thick-walled vessels, energy for compression) and can cause ethene to polymerise",
      "The catalyst increases the rate by lowering the activation energy but does not change the equilibrium yield; unreacted ethene is recycled"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Discuss temperature and pressure each in terms of both yield and rate, then the catalyst. The word 'compromise' is expected for the temperature."
  },
  {
    id: "aqa41",
    board: "aqa",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Explain how a buffer solution made from ethanoic acid and sodium ethanoate maintains an almost constant pH when small amounts of acid or alkali are added. Include equations in your answer and explain why a mixture of hydrochloric acid and sodium chloride cannot act as a buffer.",
    markScheme: [
      "The buffer contains a large reservoir of a weak acid CH₃COOH and its conjugate base CH₃COO⁻ (from the salt); CH₃COOH ⇌ CH₃COO⁻ + H⁺",
      "Added H⁺ reacts with the ethanoate ions: CH₃COO⁻ + H⁺ → CH₃COOH, so [H⁺] barely changes",
      "Added OH⁻ reacts with the ethanoic acid: CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O, and the equilibrium shifts to replace the H⁺ removed",
      "Because both CH₃COOH and CH₃COO⁻ are present in large amounts, the ratio [CH₃COOH]/[CH₃COO⁻] changes very little, so [H⁺] = Ka × [CH₃COOH]/[CH₃COO⁻] is almost constant",
      "HCl is a strong acid that is fully dissociated; there is no undissociated acid to supply H⁺ when alkali is added and Cl⁻ is too weak a base to accept H⁺"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Both equations are needed, and the explanation of why the pH is almost constant should refer to the ratio of acid to conjugate base. The final part needs 'fully dissociated' and 'Cl⁻ is a very weak base'."
  },
  {
    id: "aqa42",
    board: "aqa",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Sketch and explain the shape of the pH curve obtained when 0.1 mol dm⁻³ sodium hydroxide is added to 25 cm³ of 0.1 mol dm⁻³ ethanoic acid. Explain how a suitable indicator is chosen for this titration and why methyl orange would be unsuitable.",
    markScheme: [
      "Starts at about pH 3 (weak acid, partially dissociated), rises gradually through a buffer region where both acid and ethanoate are present",
      "At half neutralisation pH = pKa (about 4.8); near 25 cm³ there is a sharp vertical rise from about pH 7 to pH 11",
      "The equivalence point is above pH 7 because the salt formed (sodium ethanoate) is the salt of a weak acid, whose anion is a weak base",
      "After the equivalence point the curve levels off at about pH 13 as excess NaOH is added",
      "An indicator must change colour within the vertical section: phenolphthalein (pKin about 9.3) is suitable; methyl orange (pKin about 3.7) changes colour before the equivalence point, in the buffer region, giving a wrong end point"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Label the axes, the start pH, the buffer region, the vertical section and the end pH. The indicator argument is always 'its pKin lies within the vertical part of the curve'."
  },
  {
    id: "aqa43",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe the reactions of chlorine with water and with cold, dilute sodium hydroxide. Explain why chlorine is used in water treatment despite its toxicity, and explain what type of redox reaction occurs in each case.",
    markScheme: [
      "Cl₂ + H₂O ⇌ HCl + HClO; chlorine goes from 0 to −1 (in HCl) and 0 to +1 (in HClO), so this is disproportionation",
      "In sunlight: 2Cl₂ + 2H₂O → 4HCl + O₂; chlorine is reduced and oxygen in water is oxidised",
      "Cl₂ + 2NaOH → NaCl + NaClO + H₂O; again disproportionation; NaClO is bleach",
      "Chlorine (chloric(I) acid) kills bacteria, preventing water-borne diseases such as cholera and typhoid",
      "The benefit of killing pathogens outweighs the risk from the very low concentrations used, though chlorine can form chlorinated hydrocarbons that may be carcinogenic"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give oxidation states to prove disproportionation. The 'why use chlorine' answer must weigh the benefit against the risk, not just state one side."
  },
  {
    id: "aqa44",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Explain how aqueous solutions of sodium chloride, sodium bromide and sodium iodide can be distinguished using silver nitrate solution followed by ammonia solution. Explain why the solutions are acidified first and why the solubility of the silver halides in ammonia differs.",
    markScheme: [
      "Add dilute nitric acid first to remove carbonate (or hydroxide) ions that would otherwise form a precipitate of silver carbonate and give a false positive",
      "Add silver nitrate solution: Ag⁺(aq) + X⁻(aq) → AgX(s); AgCl white, AgBr cream, AgI yellow",
      "The colours are similar, so add ammonia to confirm: AgCl dissolves in dilute ammonia forming [Ag(NH₃)₂]⁺",
      "AgBr dissolves only in concentrated ammonia; AgI is insoluble even in concentrated ammonia",
      "Solubility decreases from AgCl to AgI because the lattice becomes harder to break down (the silver halides become less soluble down the group), so a higher concentration of ammonia is needed to form the complex"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Nitric acid, not hydrochloric acid (which would add chloride ions). Give the ionic equation with state symbols and all three colours."
  },
  {
    id: "aqa45",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Sulfuric acid behaves as an acid with sodium chloride but as an oxidising agent with sodium iodide. Describe the observations when concentrated sulfuric acid is added to solid sodium chloride and to solid sodium iodide, and explain the difference in behaviour using equations.",
    markScheme: [
      "NaCl: steamy (misty) fumes of HCl; H₂SO₄ + NaCl → NaHSO₄ + HCl; acid-base reaction only, chloride is not oxidised because it is too weak a reducing agent",
      "NaI: HI is formed initially (steamy fumes) but is then oxidised; purple vapour or black solid of iodine is seen",
      "Sulfuric acid is reduced to SO₂ (choking gas), to sulfur (yellow solid) and to H₂S (smell of rotten eggs)",
      "Example equations: 2HI + H₂SO₄ → I₂ + SO₂ + 2H₂O; 8HI + H₂SO₄ → 4I₂ + H₂S + 4H₂O",
      "Iodide ions are strong reducing agents because the outer electron is far from the nucleus and well shielded, so it is lost easily; chloride holds its electrons more tightly"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Observations and equations are both needed. Explain the trend in reducing power in terms of ionic radius and shielding, not electronegativity."
  },
  {
    id: "aqa46",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe the trend in the solubility of the Group 2 hydroxides and sulfates, and describe how these trends are used in medicine and in the test for sulfate ions. Include relevant equations.",
    markScheme: [
      "Hydroxides become more soluble down the group: Mg(OH)₂ is sparingly soluble, Ba(OH)₂ is soluble, so the pH of a saturated solution increases down the group",
      "Sulfates become less soluble down the group: MgSO₄ is soluble, BaSO₄ is insoluble",
      "Mg(OH)₂ is used in indigestion remedies (antacid) to neutralise excess stomach acid: Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O; it is safe because it is only sparingly soluble and weakly alkaline",
      "BaSO₄ is used as a barium meal in X-ray imaging of the digestive system; it is opaque to X-rays and safe despite Ba²⁺ being toxic because it is insoluble",
      "Test for sulfate: acidify with dilute HCl (to remove carbonate), add BaCl₂ solution; a white precipitate of BaSO₄ shows sulfate: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Both trends go in opposite directions; state each clearly. For the barium meal, the key word is 'insoluble' to explain why a toxic ion is safe."
  },
  {
    id: "aqa47",
    board: "aqa",
    category: "Transition Metals",
    marks: 6,
    question: "Explain why transition metal complexes are coloured, and explain how a colorimeter can be used to determine the concentration of a solution of a coloured complex ion.",
    markScheme: [
      "Ligands cause the d orbitals of the metal ion to split into two sets of different energy",
      "An electron in a lower d orbital absorbs a photon of visible light and is excited to a higher d orbital; ΔE = hν = hc/λ",
      "The colour seen is the complementary colour of the light absorbed (the frequencies not absorbed are transmitted or reflected)",
      "Colorimeter: select a filter of the complementary colour (the wavelength most strongly absorbed); prepare solutions of known concentration and measure the absorbance of each; plot a calibration curve of absorbance against concentration",
      "Measure the absorbance of the unknown and read its concentration from the calibration curve; a ligand may be added to intensify the colour if it is pale"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Include ΔE = hν. For the colorimeter, the three steps are: filter choice, calibration curve from standards, read off the unknown."
  },
  {
    id: "aqa48",
    board: "aqa",
    category: "Transition Metals",
    marks: 6,
    question: "Describe what is observed when aqueous sodium hydroxide, followed by excess sodium hydroxide, is added separately to solutions containing [Fe(H₂O)₆]³⁺ and [Al(H₂O)₆]³⁺. Explain the differences using equations and explain why the hexaaqua ions are acidic.",
    markScheme: [
      "The 3+ ions have a high charge density that polarises the O–H bonds in the water ligands, weakening them so a proton is released: [M(H₂O)₆]³⁺ + H₂O ⇌ [M(H₂O)₅(OH)]²⁺ + H₃O⁺",
      "Fe³⁺: brown (orange-brown) precipitate of [Fe(H₂O)₃(OH)₃]; [Fe(H₂O)₆]³⁺ + 3OH⁻ → [Fe(H₂O)₃(OH)₃] + 3H₂O",
      "The iron(III) hydroxide precipitate is insoluble in excess NaOH (not amphoteric)",
      "Al³⁺: white precipitate of [Al(H₂O)₃(OH)₃] forms by the same type of acid-base (deprotonation) reaction",
      "The aluminium hydroxide dissolves in excess NaOH because it is amphoteric: [Al(H₂O)₃(OH)₃] + OH⁻ → [Al(H₂O)₂(OH)₄]⁻ + H₂O, giving a colourless solution"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The hydroxide reactions are acid-base (deprotonation), not ligand substitution. State both the colour of each precipitate and what happens in excess."
  },
  {
    id: "aqa49",
    board: "aqa",
    category: "Transition Metals",
    marks: 6,
    question: "Explain what is meant by heterogeneous and homogeneous catalysis. Illustrate your answer with the Contact process and with the reaction between peroxodisulfate ions and iodide ions, including equations where appropriate.",
    markScheme: [
      "A heterogeneous catalyst is in a different phase from the reactants, usually a solid catalysing a gas reaction; a homogeneous catalyst is in the same phase, usually all in solution",
      "Contact process: V₂O₅ catalyses 2SO₂ + O₂ ⇌ 2SO₃; SO₂ + V₂O₅ → SO₃ + V₂O₄, then V₂O₄ + ½O₂ → V₂O₅; vanadium changes oxidation state from +5 to +4 and back",
      "Heterogeneous catalysis works by adsorption of reactants onto active sites on the surface, weakening bonds; products then desorb; the catalyst can be poisoned by impurities blocking active sites",
      "S₂O₈²⁻ + 2I⁻ → 2SO₄²⁻ + I₂ is slow because both ions are negatively charged and repel; Fe²⁺ catalyses it",
      "S₂O₈²⁻ + 2Fe²⁺ → 2SO₄²⁻ + 2Fe³⁺ then 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂: the catalyst uses its variable oxidation state and is regenerated"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Both examples need equations showing the catalyst changing oxidation state and being regenerated. For the homogeneous example explain why the uncatalysed reaction is slow (repulsion between anions)."
  },
  {
    id: "aqa50",
    board: "aqa",
    category: "Transition Metals",
    marks: 6,
    question: "Explain how the standard electrode potential of a Cu²⁺/Cu half cell is measured. Describe the apparatus, the conditions and the role of each component, and explain how E° values are used to predict the direction of a redox reaction.",
    markScheme: [
      "Connect the Cu²⁺/Cu half cell to a standard hydrogen electrode: platinum electrode, H₂(g) at 100 kPa bubbled over it, 1.00 mol dm⁻³ H⁺(aq), at 298 K; E° of the SHE is 0.00 V",
      "The copper half cell: copper electrode in 1.00 mol dm⁻³ Cu²⁺(aq) at 298 K",
      "A high resistance voltmeter measures the e.m.f. without drawing current; a salt bridge (filter paper soaked in saturated KNO₃) completes the circuit by allowing ions to move without the solutions mixing",
      "E°cell = E°(right) − E°(left) with the SHE on the left, so the reading gives E° for Cu²⁺/Cu directly",
      "To predict a reaction: the half cell with the more positive E° is reduced (gains electrons) and the more negative is oxidised; the reaction is feasible if E°cell is positive"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "All three standard conditions, platinum electrode, salt bridge and high resistance voltmeter are the 'expected' points. Avoid saying the salt bridge carries electrons."
  },
  {
    id: "aqa51",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Outline the mechanism for the reaction of 2-methylpropene with hydrogen bromide and explain why 2-bromo-2-methylpropane is the major product. Name the type of mechanism.",
    markScheme: [
      "Electrophilic addition: the electron-rich C=C attracts the δ+ hydrogen of the polar H–Br molecule",
      "Curly arrow from the C=C to the H of HBr, and from the H–Br bond to Br, forming Br⁻ and a carbocation",
      "Two carbocations are possible: a tertiary (CH₃)₃C⁺ and a primary (CH₃)₂CHCH₂⁺",
      "The tertiary carbocation is more stable because three alkyl groups donate electron density (positive inductive effect), spreading the positive charge",
      "Br⁻ attacks the tertiary carbocation (curly arrow from the lone pair on Br⁻ to C⁺), so 2-bromo-2-methylpropane is the major product"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw both carbocations and name them as tertiary and primary. The explanation must mention the inductive effect of alkyl groups stabilising the positive charge."
  },
  {
    id: "aqa52",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Compare the mechanisms of the reactions of 1-bromopropane with aqueous potassium hydroxide and with ethanolic potassium hydroxide. Name each type of reaction, give the organic product and explain the role of the hydroxide ion in each.",
    markScheme: [
      "With aqueous KOH: nucleophilic substitution; OH⁻ acts as a nucleophile (lone pair donor) attacking the δ+ carbon; propan-1-ol is formed",
      "Curly arrow from the lone pair on OH⁻ to the carbon, and from the C–Br bond to Br, releasing Br⁻",
      "With ethanolic KOH (heated): elimination; OH⁻ acts as a base, removing a hydrogen from the carbon adjacent to the C–Br carbon",
      "Curly arrow from OH⁻ to the H, from the C–H bond to form the C=C, and from the C–Br bond to Br; propene and water formed",
      "Water as a solvent favours substitution; ethanol and higher temperatures favour elimination; in practice a mixture forms"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The two roles of OH⁻ (nucleophile versus base) are the heart of the answer. State the conditions that favour each and the product names."
  },
  {
    id: "aqa53",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe how you would distinguish between propanal and propanone using two different chemical tests, and explain how the two compounds could also be distinguished using infrared spectroscopy and mass spectrometry.",
    markScheme: [
      "Tollens' reagent (ammoniacal silver nitrate): warm; propanal gives a silver mirror as Ag⁺ is reduced to Ag and the aldehyde is oxidised to a carboxylic acid; propanone gives no change",
      "Fehling's solution: propanal gives a brick-red precipitate of Cu₂O; propanone gives no change (or acidified potassium dichromate: orange to green with propanal only)",
      "Ketones are not oxidised because there is no hydrogen on the carbonyl carbon",
      "Infrared: both show C=O at about 1680 to 1750 cm⁻¹ so the carbonyl peak alone does not distinguish them; the fingerprint regions differ and can be matched to database spectra",
      "Mass spectrometry: both have M = 58, but propanone gives a strong peak at m/z 43 (CH₃CO⁺) and 15, whereas propanal shows m/z 29 (CHO⁺ and C₂H₅⁺) and 57"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Say what you would see and why for each test. For IR, admit that the C=O peak is in both and use the fingerprint region; for MS, give the distinguishing fragments."
  },
  {
    id: "aqa54",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain how nucleophilic addition of hydrogen cyanide to ethanal produces a racemic mixture of products, and explain why a racemic mixture does not rotate the plane of plane-polarised light. State why a mixture of this type is a problem in the pharmaceutical industry.",
    markScheme: [
      "CN⁻ attacks the planar carbonyl carbon from above or below the plane with equal probability",
      "Mechanism: curly arrow from the lone pair on CN⁻ to the C of C=O, from C=O to O to form O⁻, then O⁻ is protonated by HCN (or H⁺) to give 2-hydroxypropanenitrile",
      "The product carbon has four different groups (H, CH₃, OH, CN) so is chiral; attack from each side produces the opposite enantiomer",
      "Equal amounts of the two enantiomers form (a racemic mixture); each rotates plane-polarised light equally but in opposite directions, so the rotations cancel",
      "Enantiomers of a drug can have different effects; one may be therapeutic and the other inactive or harmful, so separating them or synthesising a single enantiomer is costly but necessary"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The planar carbonyl group attacked from either face is the key idea. Draw both enantiomers as mirror images."
  },
  {
    id: "aqa55",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the mechanism for the nitration of benzene using concentrated nitric acid and concentrated sulfuric acid at 50 °C. Explain why benzene undergoes substitution rather than addition, and explain why the temperature is kept at 50 °C.",
    markScheme: [
      "Formation of the electrophile: HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₂O (or HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O)",
      "Curly arrow from the delocalised ring to NO₂⁺, forming an intermediate with a horseshoe of partial delocalisation and a positive charge",
      "Curly arrow from the C–H bond back into the ring, releasing H⁺ and restoring the delocalised system; H⁺ + HSO₄⁻ → H₂SO₄ regenerates the catalyst",
      "Substitution preserves the delocalised π system, which gives benzene about 152 kJ mol⁻¹ of extra stability; addition would break the delocalisation",
      "At higher temperatures further nitration occurs, giving dinitrobenzene and trinitrobenzene as by-products; at lower temperatures the reaction is too slow"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The intermediate must show the horseshoe-shaped partial ring and the positive charge. 'Delocalisation energy' or 'stability of the delocalised ring' is required for the substitution explanation."
  },
  {
    id: "aqa56",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Compare the base strengths of ammonia, methylamine and phenylamine and explain the differences. Describe how methylamine can be prepared from a haloalkane and from a nitrile, and state one disadvantage of the haloalkane method.",
    markScheme: [
      "Order of base strength: methylamine > ammonia > phenylamine; base strength depends on the availability of the nitrogen lone pair to accept a proton",
      "Methylamine: the methyl group has a positive inductive effect, pushing electron density onto nitrogen, making the lone pair more available",
      "Phenylamine: the lone pair is delocalised into the benzene ring, so it is much less available",
      "From a haloalkane: CH₃Br + 2NH₃ → CH₃NH₂ + NH₄Br, using excess ammonia in ethanol under pressure (nucleophilic substitution)",
      "From a nitrile: CH₃CN + 2H₂ → CH₃CH₂NH₂ (ethylamine) with Ni catalyst, or LiAlH₄; the haloalkane route gives a mixture of primary, secondary and tertiary amines and a quaternary ammonium salt because the amine product is itself a nucleophile"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Use the terms 'inductive effect' and 'delocalised into the ring'. For the disadvantage, explain that further substitution happens because the product amine is a better nucleophile than ammonia."
  },
  {
    id: "aqa57",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the structure of a protein in terms of its primary, secondary and tertiary structure. Explain how hydrolysis can be used to identify the amino acids in a protein and how the products can be separated and identified.",
    markScheme: [
      "Primary structure: the sequence of amino acids joined by peptide (amide) links –CONH– formed by condensation",
      "Secondary structure: α-helix or β-pleated sheet held by hydrogen bonds between the C=O of one peptide link and the N–H of another",
      "Tertiary structure: the overall three-dimensional folding held by hydrogen bonds, ionic interactions between charged side chains, disulfide bridges (S–S between cysteine residues) and van der Waals forces",
      "Hydrolysis: heat under reflux with 6 mol dm⁻³ HCl (or NaOH) breaks the peptide links, giving the individual amino acids (as their salts)",
      "Separate by thin-layer chromatography: spot on silica plate, run in a solvent, develop with ninhydrin (or UV) as the amino acids are colourless, calculate Rf = distance moved by spot ÷ distance moved by solvent and compare with known values"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name the specific interactions at each level. For TLC, include the developing agent and the Rf calculation; comparison with standards is what identifies each amino acid."
  },
  {
    id: "aqa58",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain how proton NMR spectroscopy can be used to distinguish between the isomers propan-1-ol and propan-2-ol. In your answer refer to the number of peaks, the integration ratios and the splitting patterns, and explain the use of TMS and a deuterated solvent.",
    markScheme: [
      "Propan-1-ol has four proton environments (CH₃, CH₂, CH₂OH, OH) so four peaks; propan-2-ol has three (two equivalent CH₃, CH, OH) so three peaks",
      "Propan-1-ol integration ratio 3:2:2:1; propan-2-ol 6:1:1",
      "Splitting (n+1 rule): propan-1-ol CH₃ triplet, middle CH₂ multiplet (sextet), CH₂O triplet; propan-2-ol CH₃ doublet, CH septet (or multiplet); OH peaks are singlets",
      "TMS (tetramethylsilane) is the reference standard set at δ = 0; it gives one sharp peak from 12 equivalent protons, is inert and volatile",
      "Deuterated solvents such as CDCl₃ are used because deuterium does not give a signal in the ¹H spectrum, so the solvent peak does not interfere; a D₂O shake removes the OH peak"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give the specific numbers for both compounds. The chemical shift of the CH next to oxygen in propan-2-ol (about 4) versus CH₂O in propan-1-ol (about 3.6) can be added."
  },
  {
    id: "aqa59",
    board: "aqa",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how a pure sample of an organic liquid such as cyclohexene can be obtained from a crude product mixture that also contains water, unreacted cyclohexanol and acid catalyst. Explain the purpose of each step.",
    markScheme: [
      "Transfer the mixture to a separating funnel and add sodium carbonate (or sodium hydrogencarbonate) solution to neutralise the acid; shake, release the pressure from CO₂, allow the layers to separate",
      "Run off the lower aqueous layer and keep the organic layer (cyclohexene is less dense than water); wash with water to remove remaining salts",
      "Add anhydrous calcium chloride (or magnesium sulfate) drying agent and swirl until the liquid is clear, showing all water has been removed; decant or filter off the drying agent",
      "Distil the liquid, collecting the fraction that boils at the boiling point of cyclohexene (83 °C); cyclohexanol has a much higher boiling point so remains in the flask",
      "Check purity by measuring the boiling point, or by infrared spectroscopy (absence of the broad O–H peak at 3200 to 3550 cm⁻¹)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The order matters: neutralise, separate, dry, distil. Explain 'why' for each: e.g. drying agent removes water, distillation separates by boiling point."
  },
  {
    id: "aqa60",
    board: "aqa",
    category: "Practical Chemistry",
    marks: 6,
    question: "A student wants to determine the percentage purity of a sample of impure sodium carbonate by titration with hydrochloric acid. Describe how the student should prepare a standard solution of the sample and carry out the titration to obtain an accurate result. Explain how the results would be used.",
    markScheme: [
      "Weigh accurately about 2.5 g of the sample by difference on a balance reading to 2 decimal places; dissolve in distilled water in a beaker, stirring",
      "Transfer to a 250 cm³ volumetric flask with rinsings, make up to the mark with distilled water (bottom of meniscus on the line), stopper and invert to mix",
      "Pipette 25.0 cm³ into a conical flask, add methyl orange indicator; fill a burette with standard HCl and record the initial reading",
      "Titrate, swirling, adding dropwise near the end point until the colour changes (yellow to orange/red); repeat until two concordant titres within 0.10 cm³ are obtained and calculate the mean",
      "Calculate moles of HCl = c × V, moles of Na₂CO₃ = ½ moles HCl (Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂), scale up to the whole flask, find the mass of Na₂CO₃ and percentage purity = mass Na₂CO₃ ÷ mass of sample × 100"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "All stages are covered and the explanation of each stage is generally correct and virtually complete. Answer is well structured with no repetition or irrelevant points. Accurate and clear expression of ideas with no errors in use of technical terms." },
      { level: 2, marks: "3-4", descriptor: "All stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies OR two stages are covered and the explanations are generally correct and virtually complete. Answer is mostly well structured with some repetition or irrelevant points." },
      { level: 1, marks: "1-2", descriptor: "Two stages are covered but the explanation of each stage may be incomplete or may contain inaccuracies, OR only one stage is covered but the explanation is generally correct and virtually complete. Answer includes isolated statements with little or no structure." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Standard solution preparation is often half the marks: weighing by difference, rinsings into the flask, filling to the mark, inverting. State the 1:2 ratio in the calculation."
  },
  {
    id: "ocr21",
    board: "ocr",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "The first ionisation energies of the elements across Period 3 show a general increase, with decreases between magnesium and aluminium and between phosphorus and sulfur. Explain these observations in terms of electron structure. In your answer you should refer to nuclear charge, shielding and sub-shells.",
    markScheme: [
      "Across the period the nuclear charge increases and electrons are added to the same shell with similar shielding, so the outer electron is attracted more strongly and the atomic radius decreases",
      "Mg to Al: aluminium's outer electron is in the 3p sub-shell, which is higher in energy than the 3s sub-shell of magnesium",
      "The 3p electron is also shielded slightly by the 3s electrons, so less energy is needed to remove it",
      "P to S: phosphorus has three unpaired 3p electrons; sulfur has two electrons paired in one 3p orbital",
      "The paired electrons repel each other, so one is removed more easily, giving sulfur a lower first ionisation energy"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give both the general trend and the two anomalies with sub-shell labels. OCR expects the phrase 'electron pair repulsion' for the sulfur anomaly."
  },
  {
    id: "ocr22",
    board: "ocr",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "Describe and explain the trends in melting point and electrical conductivity across Period 3 from sodium to argon. Link your explanation to the structure and bonding of each element.",
    markScheme: [
      "Na, Mg, Al are giant metallic lattices; melting point rises because the ionic charge increases and more electrons are delocalised, strengthening the metallic bonding; all three conduct because of the delocalised electrons",
      "Si is a giant covalent lattice with strong covalent bonds throughout, giving the highest melting point; it is a semiconductor with low conductivity",
      "P₄, S₈, Cl₂ are simple molecular with weak London forces between molecules, so low melting points; none conduct because there are no mobile charged particles",
      "S₈ > P₄ > Cl₂ in melting point because the larger molecules have more electrons and stronger London forces",
      "Ar is monatomic with very weak London forces, giving the lowest melting point; it does not conduct"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Classify the elements into the three structure types and treat conductivity and melting point for each. Explain London forces in terms of number of electrons."
  },
  {
    id: "ocr23",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: "Explain the shapes of, and bond angles in, the molecules BF₃, NH₃ and SF₆ and the ion NH₄⁺. In your answer, explain how electron-pair repulsion theory predicts these shapes and why some bond angles are smaller than expected.",
    markScheme: [
      "Electron pairs around the central atom repel and arrange themselves as far apart as possible; lone pairs repel more than bonding pairs",
      "BF₃: 3 bonding pairs, 0 lone pairs; trigonal planar, 120°",
      "NH₃: 3 bonding pairs, 1 lone pair; pyramidal, 107°; the lone pair repels the bonding pairs more strongly, reducing the angle from 109.5°",
      "NH₄⁺: 4 bonding pairs (one dative covalent from the N lone pair to H⁺), 0 lone pairs; tetrahedral, 109.5°",
      "SF₆: 6 bonding pairs, 0 lone pairs; octahedral, 90°"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "For each species state the number of bonding and lone pairs, the shape name and the angle. Mention that lone pair–bonding pair repulsion > bonding pair–bonding pair repulsion."
  },
  {
    id: "ocr24",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: "Water has an anomalously high boiling point and ice is less dense than liquid water. Explain both observations in terms of the intermolecular forces present, and compare the boiling point of water with that of hydrogen sulfide, H₂S.",
    markScheme: [
      "Water forms hydrogen bonds: O is very electronegative, so the H is strongly δ+ and is attracted to a lone pair on the O of a neighbouring molecule",
      "Each water molecule can form two hydrogen bonds (two H atoms and two lone pairs), giving an extensive network",
      "Hydrogen bonds are much stronger than London forces and permanent dipole–dipole interactions, so more energy is needed to separate the molecules and the boiling point is high",
      "In ice the hydrogen bonds hold the molecules in an open tetrahedral lattice with the molecules further apart than in the liquid, so ice is less dense and floats",
      "H₂S has more electrons but sulfur is not electronegative enough for hydrogen bonding; only London forces and weak dipole–dipole forces exist, so H₂S boils at −60 °C compared with 100 °C for water"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw a hydrogen bond with the lone pair, the δ charges and the 180° O–H···O arrangement. The ice explanation must mention the open lattice."
  },
  {
    id: "ocr25",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: "Explain the trend in boiling points of the straight-chain alkanes from methane to butane, and explain why 2-methylpropane has a lower boiling point than butane. Name the intermolecular forces involved and explain how they arise.",
    markScheme: [
      "Alkanes are non-polar, so the only intermolecular forces are London (induced dipole–dipole) forces",
      "London forces arise from the random movement of electrons creating an instantaneous dipole, which induces a dipole in a neighbouring molecule",
      "From methane to butane the number of electrons per molecule increases, so the instantaneous dipoles are larger and the London forces stronger",
      "More energy is therefore needed to separate the molecules, so the boiling point increases",
      "2-methylpropane is branched so the molecules cannot pack as closely; fewer points of contact and a smaller surface area give weaker London forces than in butane"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Explain how London forces arise, not just that they get stronger. For branching, the phrase 'fewer points of contact between molecules' is expected."
  },
  {
    id: "ocr26",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: "Describe how you would determine the enthalpy change of combustion of ethanol using a spirit burner and a copper calorimeter. Explain how the results are processed and why the value obtained is less exothermic than the data book value.",
    markScheme: [
      "Measure a known volume (mass) of water into the calorimeter and record its initial temperature; weigh the spirit burner containing ethanol",
      "Light the burner under the calorimeter, stir the water, and extinguish when the temperature has risen by a measured amount; record the final temperature and reweigh the burner",
      "q = m c ΔT using the mass of water and c = 4.18 J g⁻¹ K⁻¹; moles of ethanol burned = mass lost ÷ 46.0",
      "ΔcH = −q ÷ n(ethanol), converted to kJ mol⁻¹",
      "Less exothermic because of heat loss to the surroundings and to the calorimeter, incomplete combustion (soot), and evaporation of ethanol; also non-standard conditions"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The two measurements that students forget are the mass of ethanol burned (weigh before and after) and the mass of water. Give at least two reasons for the lower value."
  },
  {
    id: "ocr27",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: "Explain how Hess's law can be used to calculate the enthalpy change of formation of methane from enthalpy changes of combustion. Then explain why a value calculated from average bond enthalpies is only approximate.",
    markScheme: [
      "Hess's law: the enthalpy change of a reaction is independent of the route, provided the initial and final conditions are the same",
      "Formation: C(s) + 2H₂(g) → CH₄(g); construct a cycle in which both the elements and methane are burned to the same products, CO₂ + 2H₂O",
      "ΔfH = ΔcH(C) + 2ΔcH(H₂) − ΔcH(CH₄); the arrows for combustion point towards the products",
      "Average bond enthalpies are averaged over many compounds; the actual C–H bond enthalpy in methane differs slightly",
      "Bond enthalpies apply to gaseous species, so the energy change for carbon (solid) to gas is not accounted for"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the cycle and show the direction of each arrow. Two reasons for the approximation are expected: averages, and gaseous state assumption."
  },
  {
    id: "ocr28",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: "Define lattice enthalpy and explain how a Born–Haber cycle can be used to determine the lattice enthalpy of calcium oxide. Explain why the second electron affinity of oxygen is endothermic and why the lattice enthalpy of calcium oxide is more exothermic than that of calcium chloride.",
    markScheme: [
      "Lattice enthalpy: the enthalpy change when one mole of an ionic lattice is formed from its gaseous ions under standard conditions, Ca²⁺(g) + O²⁻(g) → CaO(s)",
      "Cycle includes: formation of CaO, atomisation of Ca, first and second ionisation energies of Ca, atomisation of O (½O₂), first and second electron affinities of O",
      "ΔLEH = ΔfH − [ΔatH(Ca) + IE1 + IE2 + ΔatH(O) + EA1 + EA2]",
      "Second electron affinity is endothermic because an electron is being added to a negative ion, O⁻, so energy is needed to overcome repulsion",
      "CaO lattice enthalpy is more exothermic because O²⁻ has a higher charge than Cl⁻ and a smaller radius, giving a stronger attraction between the ions"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The definition must have 'gaseous ions' and 'one mole of lattice'. Compare ionic charge and ionic radius for the final part."
  },
  {
    id: "ocr29",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: "Explain the terms entropy and free energy change, and explain why the reaction between solid barium hydroxide and solid ammonium chloride, which is endothermic, occurs spontaneously at room temperature. Describe how the minimum temperature for a reaction to be feasible can be calculated.",
    markScheme: [
      "Entropy is a measure of the dispersal of energy or disorder; it increases when solids become liquids or gases and when the number of gas molecules increases",
      "ΔG = ΔH − TΔS; a reaction is feasible when ΔG is negative (or zero)",
      "The reaction produces ammonia gas and water from two solids, so ΔS is large and positive",
      "Even though ΔH is positive, TΔS is greater than ΔH at room temperature, so ΔG is negative and the reaction is feasible",
      "Minimum temperature: set ΔG = 0, so T = ΔH ÷ ΔS, with ΔS converted from J K⁻¹ mol⁻¹ to kJ K⁻¹ mol⁻¹"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "State the sign of ΔS and explain it from the states of matter. The unit conversion of ΔS is a classic lost mark."
  },
  {
    id: "ocr30",
    board: "ocr",
    category: "Kinetics",
    marks: 6,
    question: "Describe how the initial rates method can be used to determine the rate equation for the reaction between propanone and iodine in acid solution. Explain how the rate constant and its units are then found, and what the rate equation tells you about the mechanism.",
    markScheme: [
      "Carry out several experiments varying the initial concentration of one reactant at a time while keeping the others constant and the temperature constant",
      "Follow the reaction (e.g. by colorimetry as iodine is coloured, or by quenching samples and titrating iodine with thiosulfate) and plot concentration against time; the initial rate is the gradient of the tangent at t = 0",
      "Compare how rate changes with concentration: rate unchanged means zero order, rate doubles when concentration doubles means first order, quadruples means second order",
      "Rate = k[CH₃COCH₃][H⁺], zero order in iodine; k = rate ÷ ([CH₃COCH₃][H⁺]), units mol⁻¹ dm³ s⁻¹",
      "Iodine is not in the rate-determining step; the slow step involves propanone and H⁺ (formation of the enol), and iodine reacts in a later fast step"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Say explicitly how you would monitor the reaction and how you get the initial rate. Zero order for iodine means it reacts after the rate-determining step."
  },
  {
    id: "ocr31",
    board: "ocr",
    category: "Kinetics",
    marks: 6,
    question: "Explain how the Arrhenius equation can be used to determine the activation energy and the pre-exponential factor for a reaction from measurements of the rate constant at different temperatures. Explain the effect of temperature on the rate constant in terms of the Boltzmann distribution.",
    markScheme: [
      "Arrhenius equation k = Ae^(−Ea/RT); taking natural logarithms gives ln k = −Ea/RT + ln A",
      "Plot ln k against 1/T (T in K); the graph is a straight line with gradient −Ea/R and y-intercept ln A",
      "Ea = −gradient × R; A = e^(intercept)",
      "As temperature rises the Boltzmann distribution shifts and flattens, so a greater proportion of molecules have energy at least equal to Ea",
      "Hence more collisions are successful per second and k increases exponentially; the exponential factor e^(−Ea/RT) is the fraction of molecules with sufficient energy"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The gradient has units of K; multiply by R = 8.314 J K⁻¹ mol⁻¹ to get Ea in J mol⁻¹. Describe the Boltzmann distribution change properly: peak lower and to the right, area unchanged."
  },
  {
    id: "ocr32",
    board: "ocr",
    category: "Equilibrium",
    marks: 6,
    question: "Explain how the equilibrium constant Kc for the esterification of ethanoic acid with ethanol can be determined experimentally. Then explain how the value of Kc, and the position of equilibrium, respond to changes in temperature and concentration.",
    markScheme: [
      "Mix known amounts of ethanoic acid and ethanol with a small known amount of HCl catalyst, seal and leave for about a week at constant temperature to reach equilibrium",
      "Titrate a sample (or the whole mixture) with standard NaOH to find the total acid; subtract the HCl to find the ethanoic acid remaining; quench or titrate quickly so equilibrium does not shift",
      "Use the moles of acid reacted to find the equilibrium moles of ethanol, ester and water (ICE table); Kc = [ester][water] / ([acid][ethanol]), units cancel",
      "Kc changes only with temperature; for this slightly exothermic reaction, raising the temperature lowers Kc and shifts equilibrium to the left",
      "Increasing the concentration of a reactant does not change Kc; the ratio is temporarily less than Kc, so more ester forms until the ratio equals Kc again"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Mention the HCl correction in the titration. Make the distinction between the value of Kc (temperature only) and the position of equilibrium (concentration too)."
  },
  {
    id: "ocr33",
    board: "ocr",
    category: "Equilibrium",
    marks: 6,
    question: "Ammonia is made in the Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ mol⁻¹. Write the expression for Kp and explain, using Kp, how increasing the pressure and increasing the temperature affect the composition of the equilibrium mixture. Explain why the conditions actually used are 400 to 450 °C and about 200 atm.",
    markScheme: [
      "Kp = p(NH₃)² / (p(N₂) × p(H₂)³), units atm⁻² (or kPa⁻²); Kp depends only on temperature",
      "Increasing pressure raises all partial pressures but the denominator (4 moles of gas) rises more than the numerator (2 moles), so the ratio falls below Kp and more NH₃ forms to restore Kp",
      "Increasing temperature decreases Kp because the forward reaction is exothermic, so the mixture contains less ammonia",
      "A low temperature gives a high yield but a slow rate; 400 to 450 °C with an iron catalyst is a compromise",
      "Very high pressures increase yield and rate but are expensive and hazardous, so about 200 atm is used; ammonia is liquefied and removed and unreacted gases recycled"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Explain the pressure effect via Kp (ratio of partial pressures), not just Le Chatelier. 'Compromise' between rate and yield is the key word for temperature."
  },
  {
    id: "ocr34",
    board: "ocr",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Explain how a buffer solution can be prepared from propanoic acid and sodium hydroxide, and how the buffer formed controls pH when small amounts of acid and alkali are added. Describe how you would calculate the pH of the buffer.",
    markScheme: [
      "Add NaOH to an excess of propanoic acid; partial neutralisation converts some acid to propanoate ions (CH₃CH₂COOH + OH⁻ → CH₃CH₂COO⁻ + H₂O), leaving a mixture of weak acid and its conjugate base",
      "Equilibrium: CH₃CH₂COOH ⇌ CH₃CH₂COO⁻ + H⁺",
      "Added H⁺ reacts with the large reservoir of propanoate ions, CH₃CH₂COO⁻ + H⁺ → CH₃CH₂COOH, so [H⁺] barely changes",
      "Added OH⁻ reacts with the propanoic acid, CH₃CH₂COOH + OH⁻ → CH₃CH₂COO⁻ + H₂O, and the equilibrium shifts right to replace the H⁺",
      "pH: [H⁺] = Ka × [CH₃CH₂COOH] / [CH₃CH₂COO⁻], using the moles remaining after neutralisation (volumes cancel in the ratio), then pH = −log[H⁺]"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give the neutralisation equation and explain 'excess acid'. For the calculation, the moles of salt equal the moles of NaOH added, and the acid left is initial acid minus NaOH."
  },
  {
    id: "ocr35",
    board: "ocr",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Sketch the pH titration curve for the addition of 0.100 mol dm⁻³ hydrochloric acid to 25.0 cm³ of 0.100 mol dm⁻³ aqueous ammonia. Explain the shape of the curve, the choice of indicator and how the curve would differ if ethanoic acid were used instead of hydrochloric acid.",
    markScheme: [
      "Starts at about pH 11 (ammonia is a weak base), falls slowly, then drops sharply near 25.0 cm³ from about pH 7 to pH 3",
      "The equivalence point is below pH 7 because the salt formed, NH₄Cl, contains the weakly acidic NH₄⁺ ion",
      "After the equivalence point the curve levels off at about pH 1 as excess strong acid is added",
      "Indicator: methyl orange (pH range 3.1 to 4.4) because its colour change lies within the vertical section; phenolphthalein would change colour too early",
      "With ethanoic acid (weak acid–weak base) there is no sharp vertical section, the pH changes gradually around the equivalence point and no indicator is suitable; a pH meter would be needed"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Label start pH, vertical range and end pH. The indicator must be justified by its range matching the vertical part."
  },
  {
    id: "ocr36",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe and explain the trends in reactivity of the Group 2 elements with water and the thermal stability of their carbonates. Describe what you would observe in each case and write equations for the reactions of calcium.",
    markScheme: [
      "Reactivity with water increases down the group: Mg reacts very slowly with cold water, Ca fizzes steadily, Sr and Ba react vigorously; Ca + 2H₂O → Ca(OH)₂ + H₂",
      "Reactivity increases because the first and second ionisation energies decrease as atomic radius and shielding increase, so the two outer electrons are lost more easily",
      "Thermal stability of the carbonates increases down the group: MgCO₃ decomposes most readily, BaCO₃ needs the highest temperature; CaCO₃ → CaO + CO₂",
      "Smaller cations have a higher charge density and polarise (distort) the carbonate ion more, weakening the C–O bonds so decomposition is easier",
      "Observations on heating a carbonate: the gas produced turns limewater cloudy; the residue (oxide) is a white solid"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Two separate trends with two separate explanations: ionisation energy for reactivity, polarisation of the anion for thermal stability. Include state symbols in the equations."
  },
  {
    id: "ocr37",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe the reactions of the halide ions with aqueous silver nitrate and with concentrated sulfuric acid. Explain how the trend in reducing ability of the halide ions accounts for the different products formed with sulfuric acid.",
    markScheme: [
      "Silver nitrate: Ag⁺ + X⁻ → AgX; AgCl white, AgBr cream, AgI yellow; confirmed with ammonia (AgCl dissolves in dilute, AgBr only in concentrated, AgI insoluble)",
      "Chloride with H₂SO₄: steamy fumes of HCl only; NaCl + H₂SO₄ → NaHSO₄ + HCl; chloride is not oxidised",
      "Bromide: HBr forms, then is oxidised to Br₂ (orange/brown vapour) with SO₂; 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O",
      "Iodide: HI forms, then I₂ (purple vapour, black solid) with SO₂, S (yellow solid) and H₂S (rotten egg smell); e.g. 8HI + H₂SO₄ → 4I₂ + H₂S + 4H₂O",
      "Reducing ability increases down the group because the ionic radius increases and the outer electron is more shielded, so it is lost more easily; I⁻ reduces sulfur from +6 to −2"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Observations for each halide are essential. Link the increasing reducing power to the increasing extent of reduction of sulfuric acid (SO₂ only for bromide; down to H₂S for iodide)."
  },
  {
    id: "ocr38",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Explain the trend in reactivity of the Group 7 elements as oxidising agents, and describe how displacement reactions in aqueous solution and in cyclohexane can be used to demonstrate this trend. Describe the reaction of chlorine with cold dilute aqueous sodium hydroxide and explain its importance.",
    markScheme: [
      "Oxidising ability decreases down the group: Cl₂ > Br₂ > I₂; atomic radius and shielding increase so the nucleus attracts an extra electron less strongly",
      "Chlorine displaces bromide and iodide: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂ (solution turns orange); Cl₂ + 2I⁻ → 2Cl⁻ + I₂ (brown); bromine displaces iodide only; iodine displaces neither",
      "Adding cyclohexane and shaking: the halogen dissolves in the upper organic layer, Br₂ orange and I₂ violet, confirming which halogen has formed",
      "Cl₂ + 2NaOH → NaCl + NaClO + H₂O: a disproportionation reaction (chlorine 0 to −1 and 0 to +1)",
      "Sodium chlorate(I) is bleach; chlorine's reaction with water (Cl₂ + H₂O ⇌ HCl + HClO) is used to kill bacteria in drinking water, the benefits outweighing the risk of toxic chlorine"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give the colours in both water and cyclohexane. Show oxidation numbers to justify disproportionation."
  },
  {
    id: "ocr39",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "A solution is known to contain one of the anions carbonate, sulfate, chloride, bromide or iodide. Describe a sequence of tests that would identify the anion, explaining the order in which the tests must be carried out and the observations expected.",
    markScheme: [
      "Test for carbonate first: add dilute nitric acid; effervescence and a gas that turns limewater cloudy indicates CO₃²⁻ (CO₃²⁻ + 2H⁺ → CO₂ + H₂O)",
      "Carbonate must be tested first because carbonate ions would give a white precipitate with barium ions and with silver ions, causing false positives",
      "Test for sulfate second: add barium nitrate (or barium chloride) solution; a white precipitate of BaSO₄ indicates sulfate; sulfate must be removed before the halide test because Ag₂SO₄ is also slightly insoluble",
      "Test for halides last: add silver nitrate solution; white precipitate = chloride, cream = bromide, yellow = iodide",
      "Confirm the halide with ammonia: AgCl dissolves in dilute NH₃, AgBr in concentrated NH₃, AgI insoluble"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The order (carbonate, sulfate, halide) and the reason for the order are what earn the top level. Use nitric acid and barium nitrate so that no chloride is introduced."
  },
  {
    id: "ocr40",
    board: "ocr",
    category: "Transition Metals",
    marks: 6,
    question: "Define the terms ligand, complex ion and coordination number. Describe the shapes of the complexes [Cu(H₂O)₆]²⁺, [CuCl₄]²⁻ and cisplatin, and explain why the coordination number changes when concentrated hydrochloric acid is added to aqueous copper(II) ions.",
    markScheme: [
      "A ligand is a molecule or ion that donates a pair of electrons to a central metal ion to form a coordinate (dative covalent) bond; a complex ion is a metal ion bonded to one or more ligands; coordination number is the number of coordinate bonds to the central ion",
      "[Cu(H₂O)₆]²⁺: six-coordinate, octahedral, 90° bond angles, pale blue",
      "[CuCl₄]²⁻: four-coordinate, tetrahedral, 109.5°, yellow",
      "Cisplatin, Pt(NH₃)₂Cl₂: four-coordinate, square planar, 90°, with the two Cl ligands adjacent (cis)",
      "[Cu(H₂O)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O; chloride ligands are much larger than water so only four can fit around the copper ion"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give coordination number, shape and bond angle for each complex. The size argument (Cl⁻ larger than H₂O) explains the change from 6 to 4."
  },
  {
    id: "ocr41",
    board: "ocr",
    category: "Transition Metals",
    marks: 6,
    question: "Describe the reactions of aqueous Cu²⁺, Fe²⁺, Fe³⁺, Mn²⁺ and Cr³⁺ ions with aqueous sodium hydroxide and with aqueous ammonia. In your answer give the colours of the precipitates formed and describe what happens when excess reagent is added.",
    markScheme: [
      "Cu²⁺: pale blue precipitate Cu(OH)₂ with both reagents; insoluble in excess NaOH; dissolves in excess NH₃ to form the deep blue [Cu(NH₃)₄(H₂O)₂]²⁺",
      "Fe²⁺: green precipitate Fe(OH)₂, insoluble in excess of either; turns brown at the surface on standing in air as it is oxidised to Fe(III)",
      "Fe³⁺: orange-brown (rust) precipitate Fe(OH)₃, insoluble in excess of either reagent",
      "Mn²⁺: light brown (buff) precipitate Mn(OH)₂ that darkens on standing; insoluble in excess",
      "Cr³⁺: grey-green precipitate Cr(OH)₃; dissolves in excess NaOH to give a dark green solution of [Cr(OH)₆]³⁻ and in excess NH₃ to give a purple solution of [Cr(NH₃)₆]³⁺"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Make a table: ion, colour of precipitate, excess NaOH, excess NH₃. The differences in excess reagent are what distinguish the ions, especially Cu²⁺ and Cr³⁺."
  },
  {
    id: "ocr42",
    board: "ocr",
    category: "Transition Metals",
    marks: 6,
    question: "Explain how standard electrode potentials are used to predict the feasibility of redox reactions, and explain the limitations of such predictions. Use the following data to decide whether acidified dichromate(VI) ions will oxidise chloride ions and bromide ions: E°(Cr₂O₇²⁻/Cr³⁺) = +1.33 V, E°(Cl₂/Cl⁻) = +1.36 V, E°(Br₂/Br⁻) = +1.09 V.",
    markScheme: [
      "The half-cell with the more positive E° is reduced (gains electrons) and the half-cell with the less positive E° is oxidised; the reaction is feasible if E°cell = E°(reduced) − E°(oxidised) is positive",
      "Dichromate and bromide: E°cell = 1.33 − 1.09 = +0.24 V, so dichromate(VI) oxidises Br⁻ to Br₂ (feasible)",
      "Dichromate and chloride: E°cell = 1.33 − 1.36 = −0.03 V, so the reaction is not feasible; chloride is not oxidised",
      "Limitation: E° values apply to standard conditions (1 mol dm⁻³, 298 K, 100 kPa); changing concentration changes the electrode potential and can make a marginal reaction feasible (e.g. concentrated HCl)",
      "Limitation: E° predicts thermodynamic feasibility only; a feasible reaction may have a high activation energy and be too slow to observe"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Show the subtraction and the sign for each case. Both limitations (non-standard conditions and kinetics) are needed for full marks."
  },
  {
    id: "ocr43",
    board: "ocr",
    category: "Transition Metals",
    marks: 6,
    question: "Describe how you would carry out a titration to determine the concentration of iron(II) ions in a solution using standard potassium manganate(VII). Explain why no indicator is needed, why sulfuric acid rather than hydrochloric acid is used, and how the concentration is calculated.",
    markScheme: [
      "Pipette 25.0 cm³ of the Fe²⁺ solution into a conical flask and add an excess of dilute sulfuric acid; fill a burette with standard KMnO₄ solution",
      "Titrate until the first permanent pale pink colour appears; repeat to obtain concordant titres and calculate the mean",
      "No indicator is needed because MnO₄⁻ is purple and is reduced to almost colourless Mn²⁺ during the titration; the first drop of excess MnO₄⁻ gives a permanent pink colour (self-indicating)",
      "Hydrochloric acid cannot be used because MnO₄⁻ would oxidise Cl⁻ to Cl₂, using up manganate(VII) and giving a titre that is too high",
      "MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺; moles MnO₄⁻ = c × V; moles Fe²⁺ = 5 × moles MnO₄⁻; concentration = moles ÷ 0.0250 dm³"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Read the burette from the top of the meniscus because the solution is dark. The 1 : 5 ratio and the reason for sulfuric acid are the discriminating points."
  },
  {
    id: "ocr44",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the mechanism for the reaction of ethene with bromine, and explain how the reaction is used as a test for unsaturation. Then explain, using the mechanism of the reaction of propene with hydrogen bromide, why 2-bromopropane is the major product.",
    markScheme: [
      "Electrophilic addition: as Br₂ approaches the electron-rich C=C, an induced dipole forms (Br δ+ ... Br δ−)",
      "Curly arrow from the C=C to Br δ+, and from the Br–Br bond to the Br δ−, giving a carbocation and Br⁻; then Br⁻ attacks the carbocation to form 1,2-dibromoethane",
      "Test: bromine water is decolourised from orange to colourless when shaken with an alkene; alkanes give no change",
      "With propene and HBr, the H adds first; attack at the end carbon gives a secondary carbocation CH₃CH⁺CH₃, attack at the middle carbon gives a primary carbocation",
      "The secondary carbocation is more stable because two alkyl groups push electrons towards the positive carbon (positive inductive effect), so it forms preferentially and Br⁻ adds to give 2-bromopropane"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Show the induced dipole on Br₂ and the curly arrows. The Markownikoff explanation must name the carbocation types and the inductive effect."
  },
  {
    id: "ocr45",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Compare the rates of hydrolysis of 1-chlorobutane, 1-bromobutane and 1-iodobutane and describe an experiment, using aqueous silver nitrate, to compare these rates. Explain the trend in terms of bond enthalpy and explain why bond polarity does not explain the trend.",
    markScheme: [
      "Rate of hydrolysis: iodo > bromo > chloro",
      "Experiment: place equal volumes of each haloalkane in separate test tubes with ethanol (as a common solvent) and aqueous silver nitrate in a water bath at about 60 °C; start timing",
      "Record the time for a precipitate to appear: AgCl white, AgBr cream, AgI yellow; shorter time means faster hydrolysis (Ag⁺ + X⁻ → AgX)",
      "The C–I bond is the longest and weakest (lowest bond enthalpy), so it breaks most easily; C–Cl is the strongest, so hydrolysis is slowest",
      "C–Cl is the most polar bond so, if polarity controlled the rate, chlorobutane would be fastest; the opposite is observed, so bond enthalpy is the deciding factor"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Control variables (same volume, same temperature, same concentration) get credit. The last mark is for explaining why polarity predicts the wrong order."
  },
  {
    id: "ocr46",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain how infrared spectroscopy and mass spectrometry can be used together to identify an unknown compound with the molecular formula C₃H₆O. Describe the key absorptions and fragment ions you would look for and how they would distinguish between the possible isomers.",
    markScheme: [
      "C₃H₆O isomers include propanal (aldehyde), propanone (ketone) and prop-2-en-1-ol (alkene and alcohol)",
      "IR: a strong C=O absorption at 1630 to 1820 cm⁻¹ indicates propanal or propanone; a broad O–H at 3200 to 3600 cm⁻¹ with a C=C at about 1650 cm⁻¹ indicates the alcohol",
      "Mass spectrum: the molecular ion peak at m/z 58 confirms the molecular mass of 58 for all isomers",
      "Fragmentation distinguishes propanal from propanone: propanone gives a large peak at m/z 43 (CH₃CO⁺) and 15 (CH₃⁺); propanal gives m/z 29 (CHO⁺ or C₂H₅⁺) and 57 (loss of H)",
      "The fingerprint region (below 1500 cm⁻¹) of the IR spectrum can be matched to a database to confirm the identity"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the isomers first so your spectroscopic reasoning has targets. Give wavenumbers for the absorptions and m/z values with the fragment formulae."
  },
  {
    id: "ocr47",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain why benzene does not react with bromine under the conditions in which cyclohexene does, and describe the mechanism and conditions for the bromination of benzene. Explain why phenol reacts readily with bromine water without a catalyst.",
    markScheme: [
      "In cyclohexene the π electrons are localised between two carbons, giving a high electron density that can polarise Br₂ and attract the electrophile",
      "In benzene the π electrons are delocalised over six carbons, so the electron density is lower and insufficient to polarise Br₂; a halogen carrier catalyst (FeBr₃ or AlBr₃) is needed to generate Br⁺: Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻",
      "Mechanism: curly arrow from the ring to Br⁺, forming an intermediate with a horseshoe of partial delocalisation and a positive charge; then loss of H⁺ restores the delocalised ring; H⁺ + FeBr₄⁻ → HBr + FeBr₃",
      "Electrophilic substitution occurs rather than addition because it preserves the stable delocalised system",
      "Phenol: a lone pair on the oxygen is partially delocalised into the ring, increasing the electron density so that Br₂ is polarised without a catalyst; bromine water is decolourised and a white precipitate of 2,4,6-tribromophenol forms"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The comparison hinges on 'localised versus delocalised electron density'. Phenol's activation must mention the oxygen lone pair being delocalised into the ring."
  },
  {
    id: "ocr48",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe how carbonyl compounds can be identified using 2,4-dinitrophenylhydrazine and Tollens' reagent, and describe the mechanism for the reaction of propanal with hydrogen cyanide. Explain why the product of this reaction is formed as a racemic mixture.",
    markScheme: [
      "2,4-DNP gives an orange or yellow precipitate with aldehydes and ketones (but not with other carbonyl-containing groups such as esters); the precipitate can be purified by recrystallisation and its melting point compared with data tables to identify the specific carbonyl",
      "Tollens' reagent (ammoniacal silver nitrate), warmed: aldehydes give a silver mirror as Ag⁺ is reduced to Ag and the aldehyde is oxidised to a carboxylic acid; ketones give no reaction",
      "Nucleophilic addition: the CN⁻ ion (from KCN, with a little acid) attacks the δ+ carbonyl carbon; curly arrow from CN⁻ to C and from the C=O bond to O, forming an alkoxide intermediate",
      "The negatively charged oxygen is protonated by H⁺ (or HCN) to give 2-hydroxybutanenitrile",
      "The carbonyl group is planar, so CN⁻ can attack from either side with equal probability; the product carbon has four different groups and so both enantiomers form in equal amounts"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name the product of the HCN addition and show both curly arrows. 'Planar carbonyl, attack from either side' explains the racemate."
  },
  {
    id: "ocr49",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Compare the hydrolysis of an ester under acidic and alkaline conditions, giving equations for the hydrolysis of ethyl propanoate. Explain why alkaline hydrolysis gives a better yield, and describe how the carboxylic acid could be recovered from the product of alkaline hydrolysis.",
    markScheme: [
      "Acid hydrolysis: heat under reflux with dilute sulfuric acid (catalyst); CH₃CH₂COOC₂H₅ + H₂O ⇌ CH₃CH₂COOH + C₂H₅OH",
      "Acid hydrolysis is reversible (the reverse of esterification), so an equilibrium mixture forms and the yield is limited",
      "Alkaline hydrolysis: heat under reflux with aqueous NaOH; CH₃CH₂COOC₂H₅ + NaOH → CH₃CH₂COO⁻Na⁺ + C₂H₅OH",
      "Alkaline hydrolysis goes to completion because the carboxylate ion formed cannot react with the alcohol, so the reaction is not reversible and the yield is high",
      "To recover propanoic acid, add a strong acid such as HCl to the sodium propanoate: CH₃CH₂COO⁻ + H⁺ → CH₃CH₂COOH, then separate (e.g. by distillation or solvent extraction)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The reversible/irreversible distinction is the key point. Alkaline hydrolysis gives the salt, not the acid, so an acidification step is needed."
  },
  {
    id: "ocr50",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain the basic properties of amines and compare the base strengths of ethylamine, ammonia and phenylamine. Describe how ethylamine can be prepared from a haloalkane and from a nitrile, and explain why the nitrile route gives a purer product.",
    markScheme: [
      "Amines are bases because the nitrogen lone pair can accept a proton: C₂H₅NH₂ + H⁺ → C₂H₅NH₃⁺; with HCl an ammonium salt such as ethylammonium chloride forms",
      "Ethylamine > ammonia > phenylamine; the ethyl group donates electron density to the nitrogen (positive inductive effect), making the lone pair more available",
      "In phenylamine the nitrogen lone pair is delocalised into the aromatic ring, so it is much less available to accept a proton",
      "From a haloalkane: C₂H₅Br + 2NH₃ → C₂H₅NH₂ + NH₄Br with excess ethanolic ammonia under pressure (nucleophilic substitution)",
      "From a nitrile: CH₃CN + 2H₂ → C₂H₅NH₂ with H₂/Ni (or LiAlH₄); the haloalkane route gives a mixture because the primary amine is itself a nucleophile and reacts further to give secondary and tertiary amines and a quaternary ammonium salt"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Compare base strengths with the lone pair availability argument. The impurity in the haloalkane route is further substitution; say why (the amine product is a nucleophile)."
  },
  {
    id: "ocr51",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the structures of, and bonding in, the condensation polymers Terylene and nylon-6,6, naming the monomers used. Explain how these polymers can be broken down by hydrolysis and compare their disposal with that of addition polymers such as poly(ethene).",
    markScheme: [
      "Terylene (PET) is a polyester made from ethane-1,2-diol and benzene-1,4-dicarboxylic acid; ester links –COO– form with loss of water",
      "Nylon-6,6 is a polyamide made from hexane-1,6-diamine and hexanedioic acid (or hexanedioyl dichloride, losing HCl); amide links –CONH– form",
      "Hydrogen bonding between N–H and C=O groups of adjacent polyamide chains gives nylon high strength; polyesters have permanent dipole–dipole forces between chains",
      "Both can be hydrolysed: acid hydrolysis gives the diol or diamine (as its salt) and the dicarboxylic acid; alkaline hydrolysis gives the diol or diamine and the dicarboxylate salt",
      "Because the ester and amide links are polar and hydrolysable, these polymers are biodegradable or can be chemically recycled to monomers; poly(ethene) has only non-polar C–C and C–H bonds, is not hydrolysed and persists in landfill"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw a repeat unit for each polymer with the link clearly shown. The disposal comparison depends on the polarity and hydrolysability of the links."
  },
  {
    id: "ocr52",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the use of chromatography in separating and identifying the components of a mixture. Compare thin-layer chromatography and gas chromatography, explaining how the components are separated and how they are identified, and explain why gas chromatography is often linked to mass spectrometry.",
    markScheme: [
      "Chromatography separates components by their different affinities for a stationary phase and a mobile phase; components that adsorb more strongly to the stationary phase (or are less soluble in the mobile phase) move more slowly",
      "TLC: stationary phase is a thin layer of silica or alumina on a plate; mobile phase is a liquid solvent; components are identified by Rf = distance moved by spot ÷ distance moved by solvent front, compared with known values",
      "GC: stationary phase is a liquid or solid coated inside a long column; mobile phase is an inert carrier gas; components separate by volatility and solubility in the stationary phase",
      "GC components are identified by retention time compared with standards; peak area is proportional to the amount present, so concentrations can be found from a calibration curve",
      "Retention times are not unique (similar compounds may overlap), so the separated components pass into a mass spectrometer which identifies each from its mass spectrum (GC–MS); used in forensics, drug testing and environmental analysis"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name the stationary and mobile phase for each technique and the measurement used for identification. 'Retention times may be the same for different compounds' justifies GC–MS."
  },
  {
    id: "ocr53",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain how carbon-13 and proton NMR spectroscopy can be used to distinguish between the isomers butanone and butanal. For each technique, state the number of peaks, and for proton NMR describe the splitting patterns and relative peak areas you would expect.",
    markScheme: [
      "¹³C NMR: butanone has four carbon environments (CH₃CO, C=O, CH₂, CH₃) so four peaks; butanal also has four (CHO, CH₂, CH₂, CH₃) so the number does not distinguish them",
      "The ¹³C chemical shifts do: a ketone C=O at about 205 to 220 ppm versus an aldehyde C=O at 190 to 200 ppm; butanal has no carbon at about 30 ppm from CH₃CO",
      "¹H NMR butanone: three environments; CH₃CO singlet (3H, about 2.1 ppm), CH₂ quartet (2H, about 2.4 ppm), CH₃ triplet (3H, about 1.0 ppm); ratio 3:2:3",
      "¹H NMR butanal: four environments; CHO triplet (1H, about 9.8 ppm), CH₂ multiplet next to CHO (2H), CH₂ multiplet (2H), CH₃ triplet (3H); ratio 1:2:2:3",
      "The aldehyde proton at about 9.8 ppm is the clearest distinguishing feature; splitting follows the n + 1 rule based on the number of protons on adjacent carbons"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Count environments carefully: in butanone the two CH₃ groups are different. The aldehyde proton near 10 ppm is the quickest discriminator."
  },
  {
    id: "ocr54",
    board: "ocr",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would prepare a pure, dry sample of an organic solid such as aspirin by recrystallisation and how you would then check its purity. Explain the reason for each step.",
    markScheme: [
      "Dissolve the impure solid in the minimum volume of hot solvent to obtain a saturated solution; the solvent is chosen so the compound is soluble when hot but not when cold, while impurities stay in solution",
      "Filter the hot solution (if insoluble impurities are present) to remove them, keeping the solution hot so the product does not crystallise prematurely",
      "Allow the solution to cool slowly so that crystals of the pure compound form; the soluble impurities remain in solution because they are at low concentration",
      "Filter under reduced pressure using a Büchner funnel, wash the crystals with a little cold solvent to remove soluble impurities, and dry (in a desiccator or low temperature oven)",
      "Check purity by measuring the melting point: a pure compound melts sharply at the literature value; impurities lower and broaden the melting range"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "'Minimum volume of hot solvent' and 'wash with cold solvent' are expected phrases. Always explain the purpose of each step, not just the step."
  },
  {
    id: "ocr55",
    board: "ocr",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would carry out a qualitative analysis to identify the functional groups present in an unknown organic liquid that may contain an alkene, an alcohol (primary, secondary or tertiary), an aldehyde, a ketone, a carboxylic acid or a phenol. State the reagent, conditions and expected observations for each test.",
    markScheme: [
      "Alkene: shake with bromine water; orange to colourless",
      "Carboxylic acid: add sodium carbonate solution; effervescence (CO₂ turns limewater cloudy); phenol does not react with carbonate but does with NaOH and gives a white precipitate with bromine water",
      "Alcohols (primary and secondary) and aldehydes: warm with acidified potassium dichromate(VI); orange to green; tertiary alcohols and ketones give no change",
      "Aldehydes and ketones: add 2,4-DNP; orange precipitate; distinguish aldehydes by warming with Tollens' reagent, which gives a silver mirror only with aldehydes",
      "Primary versus secondary alcohol: oxidise with acidified dichromate and distil the product; test the product with Tollens' reagent (silver mirror shows an aldehyde, so the alcohol was primary); a ketone product shows a secondary alcohol"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Organise the answer by functional group, each with reagent, conditions and observation. Remember 2,4-DNP identifies any carbonyl; Tollens' separates aldehydes from ketones."
  },
  {
    id: "ocr56",
    board: "ocr",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how to carry out a titration to determine the concentration of a solution of ethanoic acid using standard sodium hydroxide, and explain how a pH meter could be used instead of an indicator to find the end point and the Ka of the acid.",
    markScheme: [
      "Pipette 25.0 cm³ of the ethanoic acid into a conical flask; add phenolphthalein; titrate with standard NaOH from a burette until the first permanent pink colour",
      "Repeat to obtain concordant titres (within 0.10 cm³) and take the mean; moles NaOH = c × V = moles CH₃COOH; concentration = moles ÷ 0.0250",
      "Phenolphthalein is chosen because its pH range (8.3 to 10) lies within the vertical section of the weak acid–strong base curve",
      "With a pH meter: calibrate using buffer solutions, add NaOH in small portions (e.g. 1.0 cm³, then 0.2 cm³ near the end point), record pH after each addition, plot pH against volume; the equivalence point is the midpoint of the vertical section",
      "Ka: read the pH at half the equivalence volume where [CH₃COOH] = [CH₃COO⁻], so pH = pKa and Ka = 10^(−pKa)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Calibration of the pH meter and smaller additions near the end point are the practical marks. Half-neutralisation gives pKa directly."
  },
  {
    id: "ocr57",
    board: "ocr",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how the rate of the reaction between magnesium and dilute hydrochloric acid could be followed by measuring the volume of gas produced, and explain how the data could be used to determine the order of reaction with respect to hydrochloric acid. Discuss the sources of error in the experiment.",
    markScheme: [
      "Use a known mass of magnesium ribbon (in excess) and a measured volume of acid in a conical flask connected to a gas syringe; start timing when the acid is added and record the volume of hydrogen at regular intervals",
      "Plot volume against time; the gradient at any time gives the rate; concentration of acid at that time can be calculated from the volume of gas produced (1 mol H₂ per 2 mol HCl)",
      "Order: plot rate against concentration of HCl (or examine half-lives on a concentration–time graph); constant half-life shows first order; rate ∝ [HCl]² shows second order; or use initial rates with different acid concentrations",
      "Keep temperature constant with a water bath and use the same surface area of magnesium each time; stir consistently",
      "Errors: gas escapes before the bung is replaced, the reaction is exothermic so temperature rises and increases the rate, hydrogen may dissolve slightly, syringe friction; use a large volume of acid so the temperature change is small"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Say how you convert volume data into concentration and then into order. Error discussion should be specific to this reaction (heat released, gas lost at the start)."
  },
  {
    id: "ocr58",
    board: "ocr",
    category: "Physical Chemistry",
    marks: 6,
    question: "Describe how you would determine the enthalpy change of a reaction that cannot be measured directly, such as the thermal decomposition of sodium hydrogencarbonate, using an indirect method and Hess's law. Describe the experiments, the cycle and the calculation.",
    markScheme: [
      "Measure the enthalpy change for NaHCO₃ reacting with excess dilute HCl: add a known mass of NaHCO₃ to a measured volume of acid in a polystyrene cup, record the temperature change, q = mcΔT, ΔH₁ = −q ÷ n(NaHCO₃)",
      "Repeat with Na₂CO₃ and the same acid to find ΔH₂ per mole of Na₂CO₃",
      "Construct a Hess cycle: 2NaHCO₃ → Na₂CO₃ + CO₂ + H₂O (ΔH to find); both 2NaHCO₃ and Na₂CO₃ react with HCl to give the same products (2NaCl + 2CO₂ + 2H₂O)",
      "ΔH(decomposition) = 2ΔH₁ − ΔH₂, applying Hess's law since the enthalpy change is independent of route",
      "Precautions: use excess acid so all the solid reacts, the same acid volume in both experiments, and extrapolate temperature–time graphs to correct for heat loss"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The cycle must have the arrows in the right direction and the factor of 2 for NaHCO₃. State why the direct measurement is impossible (decomposition happens on heating, not in solution)."
  },
  {
    id: "ocr59",
    board: "ocr",
    category: "Physical Chemistry",
    marks: 6,
    question: "Explain, with reference to the Boltzmann distribution, how an increase in temperature and the addition of a catalyst each increase the rate of a reaction. Sketch the distributions you describe and explain the economic and environmental benefits of using catalysts in industry.",
    markScheme: [
      "Boltzmann distribution: a plot of number of molecules against energy, starting at the origin, with a peak at the most probable energy and a tail that never reaches the axis; the area under the curve is the total number of molecules",
      "At a higher temperature the peak moves to higher energy and lower height, the curve broadens, and a greater proportion of molecules have energy greater than or equal to Ea, so more successful collisions per second",
      "A catalyst provides an alternative route with a lower activation energy; the distribution is unchanged but the Ea line moves to the left, so a greater area lies beyond it",
      "Catalysts therefore allow reactions to proceed at lower temperatures and pressures, saving energy and reducing costs",
      "Lower energy use means less fossil fuel burned and lower CO₂ emissions; catalysts can also give higher atom economy by favouring the desired product and are reusable"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Two sketches: two temperatures on one, one temperature with two Ea lines on the other. Area under the curve stays constant on heating."
  },
  {
    id: "ocr60",
    board: "ocr",
    category: "Physical Chemistry",
    marks: 6,
    question: "The equilibrium constant Kc for the reaction N₂O₄(g) ⇌ 2NO₂(g) can be found by measuring the degree of dissociation in a sealed vessel. Explain how equilibrium concentrations are found from an initial amount and a measured amount dissociated, how Kc is calculated with its units, and how the value of Kc changes with temperature, given that the reaction is endothermic.",
    markScheme: [
      "Set up an ICE table: initial moles of N₂O₄ = a; if x moles dissociate, equilibrium moles are N₂O₄ = a − x and NO₂ = 2x",
      "Divide each by the vessel volume V to obtain equilibrium concentrations in mol dm⁻³",
      "Kc = [NO₂]² / [N₂O₄] = (2x/V)² ÷ ((a − x)/V); units (mol dm⁻³)²/(mol dm⁻³) = mol dm⁻³",
      "Because the reaction is endothermic, increasing the temperature increases Kc; the equilibrium shifts to the right and more NO₂ (brown) forms",
      "Kc is unaffected by changes in pressure or concentration; only temperature changes its value, although compressing the mixture shifts the position towards N₂O₄ to restore the ratio"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "Fully describes and explains the chemistry with all key points covered. There is a well-developed line of reasoning which is clear and logically structured. The information presented is relevant and substantiated." },
      { level: 2, marks: "3-4", descriptor: "Describes and explains most of the chemistry with the majority of key points covered, possibly with minor errors. There is a line of reasoning presented with some structure. The information presented is in the most part relevant and supported by some evidence." },
      { level: 1, marks: "1-2", descriptor: "Describes some relevant chemistry with few key points covered. The information is basic and communicated in an unstructured way. The information is supported by limited evidence and the relationship to the evidence may not be clear." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Set out the ICE table clearly and keep the volume in the expression; the volume does not cancel here. Give the units of Kc."
  },
  {
    id: "edx01",
    board: "edexcel",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "Explain how a mass spectrometer is used to determine the relative atomic mass of a sample of chlorine, and explain why the mass spectrum of a sample of chlorine gas shows peaks at m/z values of 35, 37, 70, 72 and 74.",
    markScheme: [
      "The sample is vaporised and ionised (electron bombardment knocks out an electron to form positive ions), accelerated by an electric field, deflected by a magnetic field (or separated by time of flight) according to m/z, and detected",
      "Chlorine has two isotopes, ³⁵Cl (about 75%) and ³⁷Cl (about 25%); the peaks at 35 and 37 are the Cl⁺ ions in a 3:1 ratio",
      "Relative atomic mass = Σ(isotopic mass × % abundance) ÷ 100 = (35 × 75 + 37 × 25)/100 = 35.5",
      "The peaks at 70, 72 and 74 are the molecular ions Cl₂⁺: ³⁵Cl³⁵Cl, ³⁵Cl³⁷Cl and ³⁷Cl³⁷Cl",
      "The molecular ion peaks are in the ratio 9:6:1 because the probability of each combination is 0.75², 2 × 0.75 × 0.25 and 0.25²"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Explain the molecular ion peaks as combinations of two isotopes and work out the 9:6:1 ratio. The key stages of the spectrometer are ionisation, acceleration, deflection or drift, detection."
  },
  {
    id: "edx02",
    board: "edexcel",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "The successive ionisation energies of magnesium show a large increase between the second and third values. Explain the trend in successive ionisation energies for magnesium, and explain how data of this type provides evidence for the existence of quantum shells and sub-shells.",
    markScheme: [
      "Successive ionisation energies always increase because each electron is removed from an increasingly positive ion, so the remaining electrons are held more tightly, and there is less electron–electron repulsion",
      "The large jump between the second and third ionisation energies shows the third electron is removed from a shell closer to the nucleus (n = 2) with less shielding",
      "The two outer electrons (3s) are in a shell further from the nucleus and more shielded, so are relatively easy to remove; this shows magnesium is in Group 2",
      "A graph of log(ionisation energy) against electron number shows groups of 2, 8 and 2 electrons, providing evidence for the quantum shells",
      "Smaller jumps within a shell (e.g. between the 2p and 2s electrons) provide evidence for sub-shells of slightly different energy"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Link the number of electrons removed before each jump to the shell structure. Mention both the big jumps (shells) and the small irregularities (sub-shells)."
  },
  {
    id: "edx03",
    board: "edexcel",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: "Describe and explain the trend in first ionisation energy across Period 2 from lithium to neon, including the anomalies at boron and oxygen. Explain how the trend in first ionisation energy down Group 1 differs.",
    markScheme: [
      "General increase across Period 2: nuclear charge increases, electrons enter the same shell with similar shielding, so the outer electron is attracted more strongly and is harder to remove",
      "Boron is lower than beryllium because its outer electron is in the 2p sub-shell, which is higher in energy than the 2s sub-shell",
      "Oxygen is lower than nitrogen because the electron removed is one of a pair in a 2p orbital; the repulsion between the paired electrons makes it easier to remove",
      "Down Group 1 the first ionisation energy decreases because the outer electron is in a shell further from the nucleus with more shielding by inner shells",
      "The increased distance and shielding outweigh the increased nuclear charge, so the attraction on the outer electron is weaker"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Three things: trend, anomalies with sub-shell reasons, and the group trend. Use the terms nuclear charge, shielding and distance consistently."
  },
  {
    id: "edx04",
    board: "edexcel",
    category: "Bonding & Structure",
    marks: 6,
    question: "Explain, using electron-pair repulsion theory, the shapes of and bond angles in CH₄, NH₃ and H₂O. Explain why the bond angles decrease in this order and describe the evidence from electron density maps and physical properties that supports the existence of ions in ionic compounds.",
    markScheme: [
      "Electron pairs repel and take up positions as far apart as possible; lone pairs repel more than bonding pairs",
      "CH₄: 4 bonding pairs, tetrahedral, 109.5°; NH₃: 3 bonding pairs + 1 lone pair, trigonal pyramidal, 107°; H₂O: 2 bonding pairs + 2 lone pairs, V-shaped (non-linear), 104.5°",
      "Each lone pair repels the bonding pairs more strongly, pushing them closer together and reducing the angle by about 2.5° per lone pair",
      "Evidence for ions: electron density maps of NaCl show separate spheres of electron density with no overlap and zero density between the ions",
      "Ionic compounds conduct when molten or dissolved (ions free to move) and in electrolysis of a coloured compound such as copper(II) chromate the blue Cu²⁺ moves to the cathode and the yellow CrO₄²⁻ to the anode"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give both the number of electron pairs and the shape name with the angle. The copper chromate electrolysis demonstration is the classic Edexcel evidence."
  },
  {
    id: "edx05",
    board: "edexcel",
    category: "Bonding & Structure",
    marks: 6,
    question: "Explain the differences in melting point and electrical conductivity between sodium chloride, magnesium, silicon dioxide and iodine by considering the structure and bonding in each substance.",
    markScheme: [
      "NaCl: giant ionic lattice with strong electrostatic attraction between oppositely charged ions; high melting point; conducts only when molten or dissolved because ions can then move",
      "Mg: giant metallic lattice of Mg²⁺ ions in a sea of delocalised electrons; high melting point; conducts in solid and liquid states because the delocalised electrons can move",
      "SiO₂: giant covalent (macromolecular) structure with each silicon bonded to four oxygens by strong covalent bonds; very high melting point; does not conduct because there are no mobile charged particles",
      "I₂: simple molecular; weak London forces between molecules are easily overcome so a low melting point (sublimes); does not conduct because the molecules are neutral and the electrons are localised",
      "The strength of the forces that must be overcome on melting determines the melting point: covalent and ionic bonds and metallic bonding are strong, intermolecular forces are weak"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Four substances, four structure types. For conductivity always name the charge carrier (ions or delocalised electrons) and whether it can move."
  },
  {
    id: "edx06",
    board: "edexcel",
    category: "Bonding & Structure",
    marks: 6,
    question: "Explain how London forces, permanent dipole–dipole interactions and hydrogen bonds arise. Use these ideas to explain why the boiling point of ethanol (78 °C) is much higher than that of methoxymethane, CH₃OCH₃ (−24 °C), even though they have the same molecular formula.",
    markScheme: [
      "London forces: random movement of electrons creates an instantaneous dipole which induces a dipole in a neighbouring molecule; weak attraction that increases with the number of electrons",
      "Permanent dipole–dipole: attraction between the δ+ end of one polar molecule and the δ− end of another, arising from a difference in electronegativity that does not cancel by symmetry",
      "Hydrogen bonds: a hydrogen covalently bonded to N, O or F is strongly δ+ and is attracted to a lone pair on an N, O or F atom of another molecule; the strongest intermolecular force",
      "Ethanol has an O–H group so it forms hydrogen bonds between molecules; methoxymethane has no O–H so cannot hydrogen bond (its oxygen is bonded to two carbons)",
      "Both have the same number of electrons (similar London forces) and both are polar, so the difference is due to hydrogen bonding, which needs much more energy to overcome, giving ethanol the higher boiling point"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Define each force before using it. Show the hydrogen bond in ethanol with the lone pair, partial charges and a dashed line."
  },
  {
    id: "edx07",
    board: "edexcel",
    category: "Energetics",
    marks: 6,
    question: "Explain the terms standard enthalpy change of formation and standard enthalpy change of combustion. Describe how the enthalpy change of combustion of methanol could be measured experimentally, and explain why the result differs from the data book value.",
    markScheme: [
      "Standard enthalpy change of formation: the enthalpy change when one mole of a compound is formed from its elements in their standard states under standard conditions (100 kPa, 298 K)",
      "Standard enthalpy change of combustion: the enthalpy change when one mole of a substance is completely burned in oxygen under standard conditions",
      "Experiment: burn methanol in a spirit burner under a copper calorimeter containing a known mass of water; measure the temperature rise and the mass of methanol burned (weigh before and after)",
      "q = m × c × ΔT (mass of water, 4.18 J g⁻¹ K⁻¹); moles methanol = mass ÷ 32.0; ΔcH = −q ÷ n in kJ mol⁻¹",
      "Less exothermic than the data book value because of heat losses to the surroundings and calorimeter, incomplete combustion, evaporation of methanol and non-standard conditions"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Definitions need 'one mole', 'standard conditions' and 'standard states'. Give at least two specific reasons for the discrepancy."
  },
  {
    id: "edx08",
    board: "edexcel",
    category: "Energetics",
    marks: 6,
    question: "Explain how Hess's law can be used to find the enthalpy change for the reaction between carbon and hydrogen to form ethane, using enthalpy changes of combustion. Then explain how mean bond enthalpies could be used to estimate the enthalpy change of combustion of ethane and why the estimate is only approximate.",
    markScheme: [
      "Hess's law: the total enthalpy change is independent of the route taken provided the initial and final conditions are the same",
      "Cycle: 2C(s) + 3H₂(g) → C₂H₆(g) with both routes burning to 2CO₂ + 3H₂O; ΔfH = 2ΔcH(C) + 3ΔcH(H₂) − ΔcH(C₂H₆)",
      "Bond enthalpy estimate: ΔH = Σ(bonds broken) − Σ(bonds formed); for C₂H₆ + 3½O₂ → 2CO₂ + 3H₂O, break 6 C–H, 1 C–C and 3½ O=O; form 4 C=O and 6 O–H",
      "Mean bond enthalpies are averages over many compounds, so the actual bond enthalpies in ethane and the products differ slightly",
      "Bond enthalpies refer to gaseous species, but water is a liquid under standard conditions; the enthalpy of vaporisation of water is not included"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the Hess cycle with arrows downward to the combustion products. For bond enthalpies, list the bonds broken and formed before any arithmetic."
  },
  {
    id: "edx09",
    board: "edexcel",
    category: "Kinetics",
    marks: 6,
    question: "Use collision theory and the Maxwell–Boltzmann distribution to explain how increasing temperature, increasing concentration and adding a catalyst each affect the rate of a reaction. Explain why a catalyst does not alter the enthalpy change of a reaction or the position of equilibrium.",
    markScheme: [
      "Reactions occur when particles collide with energy at least equal to the activation energy and with the correct orientation",
      "Temperature: the Maxwell–Boltzmann distribution shifts to higher energies (peak lower and further right, same area), so a much greater proportion of molecules have E ≥ Ea; collisions are also slightly more frequent",
      "Concentration: more particles per unit volume so collisions are more frequent, giving more successful collisions per second; the distribution is unchanged",
      "Catalyst: provides an alternative route with a lower activation energy, so a greater proportion of the existing distribution has E ≥ Ea",
      "A catalyst does not change the energy of reactants or products, so ΔH is unchanged; it speeds up forward and reverse reactions equally, so the equilibrium position and yield are unchanged, only reached faster"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Sketch the distribution at two temperatures. Keep the three factors separate and finish with the two 'does not' statements for the catalyst."
  },
  {
    id: "edx10",
    board: "edexcel",
    category: "Kinetics",
    marks: 6,
    question: "Describe how you would investigate the effect of temperature on the rate of reaction between sodium thiosulfate solution and dilute hydrochloric acid. Explain how the results would be processed and discuss the main sources of error.",
    markScheme: [
      "Measure fixed volumes and concentrations of sodium thiosulfate and HCl; warm the thiosulfate to the required temperature in a water bath and record the temperature just before mixing",
      "Mix in a conical flask placed over a cross marked on paper; start the stopwatch and time how long it takes for the sulfur precipitate to obscure the cross",
      "Repeat at several temperatures (e.g. 20, 30, 40, 50, 60 °C), keeping concentrations, volumes and the observer the same",
      "Rate is proportional to 1/time (a fixed amount of sulfur forms in each run); plot 1/t against temperature or ln(1/t) against 1/T to find activation energy",
      "Errors: judging when the cross disappears is subjective, temperature falls during the run, the sulfur dioxide gas released must be ventilated; use the same person and the same cross each time, and a thermostatically controlled water bath"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The 1/t ∝ rate argument must be stated. Control variables and the subjective end point are the expected evaluation points."
  },
  {
    id: "edx11",
    board: "edexcel",
    category: "Equilibrium",
    marks: 6,
    question: "The Contact process produces sulfur trioxide: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH = −196 kJ mol⁻¹. Explain, using Le Chatelier's principle, the effect of changing temperature and pressure on the equilibrium yield, and explain why the conditions actually used are about 450 °C, 1 to 2 atm and a vanadium(V) oxide catalyst.",
    markScheme: [
      "Le Chatelier: a system at equilibrium shifts to oppose any change imposed on it",
      "Lower temperature favours the exothermic forward reaction, increasing the yield of SO₃; but lower temperature decreases rate, so 450 °C is a compromise",
      "Higher pressure favours the side with fewer gas molecules (3 → 2), increasing yield and rate",
      "The equilibrium yield is already about 98% at 1 to 2 atm, so the cost of high-pressure equipment is not justified; a slight increase above atmospheric pressure is enough to push the gases through the plant",
      "V₂O₅ increases the rate by lowering the activation energy, allowing a lower temperature to be used without the rate becoming too slow; it does not change the yield"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The pressure argument is unusual here: the yield is already high so high pressure is not economic. Make this point explicitly."
  },
  {
    id: "edx12",
    board: "edexcel",
    category: "Equilibrium",
    marks: 6,
    question: "Explain what is meant by a dynamic equilibrium and by the equilibrium constant Kc. Describe how the value of Kc for the esterification of ethanoic acid with ethanol can be determined experimentally and discuss the importance of allowing enough time and using a catalyst.",
    markScheme: [
      "Dynamic equilibrium: in a closed system the forward and reverse reactions occur at the same rate, so the concentrations of reactants and products remain constant",
      "Kc = [CH₃COOC₂H₅][H₂O] / ([CH₃COOH][C₂H₅OH]); constant at constant temperature; no units for this reaction",
      "Mix known moles of ethanoic acid and ethanol with a known small amount of HCl catalyst, stopper, and leave at constant temperature for several days to reach equilibrium",
      "Titrate the mixture with standard NaOH to find the total acid; subtract the HCl to find the ethanoic acid at equilibrium, then use an ICE table to find the moles of each species and calculate Kc",
      "The reaction is slow without a catalyst so equilibrium would take weeks; the acid catalyst speeds up both reactions equally so equilibrium is reached quickly without changing Kc; enough time must be allowed or the mixture will not be at equilibrium and Kc will be wrong"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Remember to correct for the HCl catalyst in the titre. Explain why the catalyst does not alter Kc."
  },
  {
    id: "edx13",
    board: "edexcel",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe and explain the trend in thermal stability of the Group 2 carbonates and nitrates, and describe how you could compare the thermal stabilities of magnesium carbonate and calcium carbonate experimentally. Include equations for the decomposition of calcium nitrate.",
    markScheme: [
      "Thermal stability increases down Group 2: a higher temperature is needed to decompose the carbonates and nitrates of the heavier elements",
      "Smaller cations such as Mg²⁺ have a higher charge density and polarise the large anion more, distorting the electron cloud and weakening the C–O (or N–O) bonds",
      "The anion therefore breaks up more easily into the oxide ion and CO₂ (or NO₂ and O₂)",
      "2Ca(NO₃)₂ → 2CaO + 4NO₂ + O₂; observations: brown fumes of NO₂, a gas that relights a glowing splint, a white solid residue",
      "Experiment: heat equal moles of each carbonate with the same Bunsen flame and pass the gas into limewater; time how long it takes for the limewater to go cloudy; the carbonate that takes longer is more stable (control the heating and the amount of solid)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Use the term 'polarise' and explain it in terms of charge density. The experimental comparison must name a measurable (time to turn limewater cloudy) and the controlled variables."
  },
  {
    id: "edx14",
    board: "edexcel",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe the reactions of the halogens with Group 1 halide solutions and with cold dilute and hot concentrated sodium hydroxide. Explain the trend in oxidising power of the halogens and explain what is meant by disproportionation, using oxidation numbers.",
    markScheme: [
      "A more reactive halogen displaces a less reactive halide: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂ (orange), Cl₂ + 2I⁻ → 2Cl⁻ + I₂ (brown), Br₂ + 2I⁻ → 2Br⁻ + I₂; iodine displaces nothing",
      "Oxidising power decreases down the group because the atoms get larger and the outer shell is more shielded, so the attraction for an additional electron is weaker",
      "Cold dilute NaOH: Cl₂ + 2NaOH → NaCl + NaClO + H₂O; chlorine 0 → −1 and 0 → +1",
      "Hot concentrated NaOH: 3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O; chlorine 0 → −1 and 0 → +5",
      "Disproportionation is a reaction in which the same element is both oxidised and reduced; the changes in oxidation number above show this for chlorine"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Both NaOH reactions with their different products and oxidation numbers are needed. The displacement reactions need the colour observations."
  },
  {
    id: "edx15",
    board: "edexcel",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe tests to distinguish between aqueous solutions of sodium carbonate, sodium sulfate, ammonium chloride and sodium bromide. For each test give the reagents, the observations and an equation where appropriate.",
    markScheme: [
      "Carbonate: add dilute nitric acid; effervescence, and the gas turns limewater cloudy; CO₃²⁻ + 2H⁺ → CO₂ + H₂O",
      "Sulfate: add dilute HCl then barium chloride solution (or acidified barium nitrate); white precipitate of BaSO₄; Ba²⁺ + SO₄²⁻ → BaSO₄",
      "Ammonium: add sodium hydroxide and warm; ammonia gas is released, which turns damp red litmus blue; NH₄⁺ + OH⁻ → NH₃ + H₂O",
      "Bromide: add dilute nitric acid then silver nitrate solution; cream precipitate of AgBr; Ag⁺ + Br⁻ → AgBr; the precipitate dissolves in concentrated but not dilute ammonia",
      "Ammonium chloride would also give a white precipitate with silver nitrate (chloride), so the ammonia test or the solubility of the silver halide in dilute ammonia distinguishes it from the bromide"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Four solutions, four distinct positive tests, with the complication that ammonium chloride also contains a halide. Mention acidifying before the sulfate and halide tests."
  },
  {
    id: "edx16",
    board: "edexcel",
    category: "Inorganic Chemistry",
    marks: 6,
    question: "Describe the reactions of magnesium, calcium and barium with water and with oxygen, and describe the reactions of their oxides and hydroxides with water and with dilute acids. Explain the trend in reactivity and the trend in the pH of the solutions formed by the hydroxides.",
    markScheme: [
      "With oxygen all burn to form the oxide: 2Mg + O₂ → 2MgO (bright white flame); reactivity increases down the group",
      "With water: Mg reacts very slowly with cold water (Mg + 2H₂O → Mg(OH)₂ + H₂) but rapidly with steam to give MgO + H₂; Ca reacts steadily with cold water; Ba reacts vigorously",
      "Reactivity increases down the group because the first and second ionisation energies decrease (larger radius, more shielding), so the electrons are lost more easily",
      "Oxides react with water to form hydroxides (MgO only slightly, BaO vigorously); oxides and hydroxides are bases that react with acids to form salts and water, e.g. CaO + 2HCl → CaCl₂ + H₂O",
      "The hydroxides become more soluble down the group, so the concentration of OH⁻ and the pH of a saturated solution increase: Mg(OH)₂ about pH 9 (sparingly soluble), Ba(OH)₂ about pH 13"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Link reactivity to ionisation energy and the pH trend to solubility. Equations with state symbols for calcium reactions are a safe bet."
  },
  {
    id: "edx17",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain the mechanism of free radical substitution for the reaction of chlorine with methane in the presence of UV light. Name each stage, write equations and explain why this reaction is of limited use for making chloromethane.",
    markScheme: [
      "Initiation: UV light causes homolytic fission of the Cl–Cl bond (the weakest bond) forming two chlorine radicals: Cl₂ → 2Cl•",
      "Propagation step 1: Cl• + CH₄ → •CH₃ + HCl; propagation step 2: •CH₃ + Cl₂ → CH₃Cl + Cl•; the chlorine radical is regenerated so a chain reaction continues",
      "Termination: two radicals combine to form a stable molecule, e.g. Cl• + Cl• → Cl₂, •CH₃ + Cl• → CH₃Cl, •CH₃ + •CH₃ → C₂H₆",
      "A radical is a species with an unpaired electron, shown by the dot; homolytic fission gives one electron to each atom",
      "Limited use because further substitution gives CH₂Cl₂, CHCl₃ and CCl₄, and termination gives ethane; the result is a mixture that must be separated, lowering the yield of chloromethane"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name all three stages with equations and show the radical dots. Explain the mixture problem (further substitution and termination by-products)."
  },
  {
    id: "edx18",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the mechanism for the reaction of but-2-ene with bromine and explain why this reaction occurs more readily than the reaction of butane with bromine. Describe how addition polymerisation of alkenes occurs and discuss two ways of disposing of addition polymers, with their advantages and disadvantages.",
    markScheme: [
      "Electrophilic addition: the high electron density of the C=C π bond induces a dipole in Br₂; curly arrow from C=C to Br δ+, Br–Br bond breaks heterolytically giving Br⁻ and a carbocation; Br⁻ attacks the carbocation forming 2,3-dibromobutane",
      "Butane has only σ bonds with no region of high electron density to attract an electrophile; it reacts with bromine only by free radical substitution in UV light",
      "Addition polymerisation: many alkene monomers join when the C=C bond opens, forming a long saturated chain with no other product; the repeat unit shows the two carbons from the monomer",
      "Incineration: recovers energy and reduces landfill volume but releases CO₂ and possibly toxic gases such as HCl from PVC, needing scrubbing",
      "Recycling: conserves crude oil and reduces waste, but polymers must be sorted by type, cleaned and the quality decreases each cycle; landfill is cheap but polymers do not biodegrade and space is limited"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Contrast the π bond in alkenes with the σ bonds in alkanes. For disposal give one advantage and one disadvantage of each method."
  },
  {
    id: "edx19",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Compare the reactions of 1-bromobutane with aqueous potassium hydroxide, ethanolic potassium hydroxide and ethanolic ammonia. For each reaction give the conditions, name the type of reaction and the organic product, and explain the role played by the hydroxide ion or ammonia.",
    markScheme: [
      "Aqueous KOH, warm: nucleophilic substitution; OH⁻ acts as a nucleophile donating a lone pair to the δ+ carbon; C–Br breaks heterolytically; product butan-1-ol",
      "Ethanolic KOH, heat under reflux: elimination; OH⁻ acts as a base removing a hydrogen from the adjacent carbon; the electrons form a C=C and Br⁻ leaves; product but-1-ene and water",
      "Ethanolic ammonia, heat under pressure in a sealed tube with excess ammonia: nucleophilic substitution; NH₃ acts as a nucleophile using its lone pair; product butylamine (and NH₄Br)",
      "Excess ammonia is used to reduce further substitution, because butylamine is also a nucleophile and would react with more bromobutane to give secondary and tertiary amines",
      "The solvent determines the role of OH⁻: in water it behaves as a nucleophile, in ethanol as a base; in practice a mixture of products forms and conditions shift the balance"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Three reactions, three product names, three roles. The excess ammonia explanation is a common extra mark."
  },
  {
    id: "edx20",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe how the alcohols propan-1-ol, propan-2-ol and 2-methylpropan-2-ol can be distinguished by their reactions with acidified potassium dichromate(VI). Describe the practical techniques used to obtain an aldehyde and a carboxylic acid from a primary alcohol, and describe tests to identify the products.",
    markScheme: [
      "Propan-1-ol (primary) and propan-2-ol (secondary) are oxidised, turning the dichromate from orange to green; 2-methylpropan-2-ol (tertiary) is not oxidised so stays orange",
      "Primary alcohols give aldehydes then carboxylic acids; secondary alcohols give ketones; tertiary alcohols have no hydrogen on the carbon bearing the OH so cannot be oxidised",
      "To obtain the aldehyde: add the oxidising agent slowly to the warm alcohol and distil the aldehyde off as it forms (it has a lower boiling point than the alcohol because it cannot hydrogen bond), preventing further oxidation",
      "To obtain the carboxylic acid: heat the alcohol with excess acidified dichromate under reflux so the aldehyde is not lost and is fully oxidised; the condenser returns volatile components to the flask",
      "Tests: aldehyde gives a silver mirror with Tollens' reagent or a brick-red precipitate with Fehling's solution; carboxylic acid gives effervescence with sodium carbonate and an IR spectrum with a very broad O–H at 2500 to 3300 cm⁻¹ and C=O at about 1700 cm⁻¹"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The 'distil versus reflux' distinction with reasons is the core. Explain why the aldehyde distils off first (no hydrogen bonding, lower boiling point)."
  },
  {
    id: "edx21",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe how mass spectrometry and infrared spectroscopy can be used to identify an unknown organic compound. Illustrate your answer with a compound of molecular formula C₂H₄O₂, explaining which absorptions and which fragment ions you would expect for ethanoic acid and for methyl methanoate.",
    markScheme: [
      "Mass spectrometry: the molecular ion peak (highest m/z, ignoring M+1) gives the relative molecular mass (60 for C₂H₄O₂); fragmentation patterns identify parts of the structure",
      "Ethanoic acid fragments: m/z 45 (COOH⁺), 43 (CH₃CO⁺), 15 (CH₃⁺); methyl methanoate fragments: m/z 31 (OCH₃⁺), 29 (HCO⁺), 59 (loss of H)",
      "Infrared spectroscopy: bonds absorb at characteristic wavenumbers; the fingerprint region below 1500 cm⁻¹ can be matched to a database for identification",
      "Ethanoic acid shows a very broad O–H absorption at 2500 to 3300 cm⁻¹ and a C=O at about 1700 cm⁻¹",
      "Methyl methanoate shows a C=O at about 1740 cm⁻¹ and C–O absorptions at 1000 to 1300 cm⁻¹ but no O–H absorption, so the absence of the broad O–H distinguishes the ester from the acid"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Say what each technique gives in general, then apply it to the two isomers. The presence or absence of the acid O–H is the decisive IR feature."
  },
  {
    id: "edx22",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the test-tube reactions you would use to show that a compound is an alkene, that it is a primary alcohol rather than a tertiary alcohol, and that it is an aldehyde rather than a ketone. For each test give reagents, conditions and observations, and explain the chemistry occurring.",
    markScheme: [
      "Alkene: shake with bromine water at room temperature; orange to colourless; electrophilic addition of bromine across the C=C forms a colourless dibromoalkane",
      "Primary versus tertiary alcohol: warm with acidified potassium dichromate(VI); orange to green for a primary alcohol as Cr(VI) is reduced to Cr(III) and the alcohol is oxidised to an aldehyde; tertiary alcohols stay orange because there is no H on the carbon carrying the OH",
      "Confirm the primary alcohol by distilling the product and testing with Tollens' or Fehling's; or test the alcohol with PCl₅ (HCl fumes) to confirm an OH group is present",
      "Aldehyde versus ketone: warm with Tollens' reagent (ammoniacal silver nitrate); silver mirror for an aldehyde as Ag⁺ is reduced to Ag and the aldehyde is oxidised to a carboxylic acid; ketones do not react",
      "Alternative: Fehling's or Benedict's solution gives a brick-red precipitate of copper(I) oxide with aldehydes only; or acidified dichromate goes green with aldehydes only"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Each test needs reagent, condition, observation and an explanation of why the observation occurs. Say explicitly why tertiary alcohols and ketones give no reaction."
  },
  {
    id: "edx23",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain what is meant by structural isomerism and stereoisomerism, using compounds of molecular formula C₄H₈ as examples. Explain why but-2-ene exists as E and Z isomers but but-1-ene does not, and explain how the E/Z and cis/trans naming systems are used.",
    markScheme: [
      "Structural isomers have the same molecular formula but different structural formulae: chain isomers (but-1-ene and 2-methylpropene), position isomers (but-1-ene and but-2-ene) and functional group isomers (but-1-ene and cyclobutane)",
      "Stereoisomers have the same structural formula but a different arrangement of atoms in space; E/Z isomerism is one type",
      "E/Z isomerism arises because the C=C bond cannot rotate (the π bond would have to break) and each carbon of the double bond has two different groups attached",
      "But-2-ene: each carbon of the C=C has an H and a CH₃, so E and Z forms exist; but-1-ene has two H atoms on one of the double bond carbons, so swapping them gives the same molecule",
      "Cis/trans is used when the two groups on each carbon are the same: cis means the same groups on the same side, trans on opposite sides; E/Z uses Cahn–Ingold–Prelog priority (higher atomic number has priority) and Z has the higher priority groups on the same side, E on opposite sides"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the C₄H₈ isomers. The two conditions for E/Z (restricted rotation and two different groups on each carbon) must both be stated."
  },
  {
    id: "edx24",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would prepare 250 cm³ of a standard solution of sodium carbonate of approximately 0.100 mol dm⁻³ and use it to determine the concentration of a solution of hydrochloric acid by titration. Explain how you would ensure the results are accurate and how the percentage uncertainty of the titre is calculated.",
    markScheme: [
      "Calculate the mass needed (0.025 mol × 106 = 2.65 g); weigh accurately by difference using a balance reading to 0.01 g; dissolve in distilled water in a beaker and transfer with rinsings to a 250 cm³ volumetric flask",
      "Make up to the graduation mark with distilled water (bottom of meniscus on the line), stopper and invert several times to mix",
      "Pipette 25.0 cm³ of the carbonate solution into a conical flask, add methyl orange, titrate with HCl from a burette until the colour changes from yellow to orange; record to 0.05 cm³",
      "Repeat until two concordant titres within 0.10 cm³ are obtained; use the mean of concordant titres only; swirl continuously and add dropwise near the end point; rinse the burette with the acid first",
      "Moles Na₂CO₃ = c × 0.025; moles HCl = 2 × moles Na₂CO₃; [HCl] = moles ÷ titre volume; percentage uncertainty of the titre = (2 × 0.05 ÷ titre) × 100 because two burette readings are taken"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Standard solution technique and titration technique each carry marks. For the uncertainty, remember a titre involves two readings, so the uncertainty is ±0.10 cm³."
  },
  {
    id: "edx25",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would determine the enthalpy change for the displacement reaction between zinc and aqueous copper(II) sulfate. Explain how a cooling curve is used to correct for heat loss and how the enthalpy change is calculated from the data.",
    markScheme: [
      "Measure 25.0 cm³ (or 50.0 cm³) of copper(II) sulfate solution of known concentration into a polystyrene cup; record the temperature every 30 s for 2 to 3 minutes to establish a steady starting temperature",
      "Add an excess of powdered zinc (so all the Cu²⁺ reacts), stir continuously, and continue recording the temperature every 30 s for several minutes after the maximum",
      "Plot temperature against time; extrapolate the cooling section back to the time of addition and read the temperature at that time; ΔT is the difference between this extrapolated value and the initial temperature",
      "The extrapolation corrects for heat lost to the surroundings while the reaction was proceeding, giving the temperature rise that would have occurred with no heat loss",
      "q = m × c × ΔT using the mass of solution (density 1.00 g cm⁻³) and c = 4.18 J g⁻¹ K⁻¹; moles Cu²⁺ = c × V; ΔH = −q ÷ n in kJ mol⁻¹ (negative because exothermic)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Excess zinc, continuous stirring and the extrapolation are the practical marks. Divide by moles of copper(II) sulfate, the limiting reagent."
  },
  {
    id: "edx26",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would carry out an experiment to determine the formula of hydrated magnesium sulfate, MgSO₄·xH₂O, by heating to constant mass. Explain the calculation and discuss the sources of error, including what would happen to the calculated value of x if the salt were not fully dehydrated.",
    markScheme: [
      "Weigh a clean, dry crucible; add about 2 g of the hydrated salt and reweigh; heat gently then more strongly with a Bunsen burner",
      "Allow to cool and reweigh; repeat heating, cooling and weighing until two consecutive masses agree (constant mass), showing all the water has been driven off",
      "Mass of water lost = mass before − mass after; moles water = mass ÷ 18.0; mass of anhydrous MgSO₄ = final mass − crucible; moles = mass ÷ 120.4",
      "x = moles water ÷ moles MgSO₄, rounded to the nearest whole number",
      "Errors: incomplete dehydration gives too little water lost so x is too low; overheating can decompose the salt, giving too much mass loss so x is too high; absorbing moisture while cooling (use a desiccator); use a lid to prevent spitting"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "'Heat to constant mass' needs the repeat heating and weighing explained. Give the direction of the error on x for incomplete heating."
  },
  {
    id: "edx27",
    board: "edexcel",
    category: "Energetics",
    marks: 6,
    question: "Explain the terms lattice energy, enthalpy change of hydration and enthalpy change of solution. Explain how these are related and use them to explain why magnesium sulfate is soluble in water but barium sulfate is not.",
    markScheme: [
      "Lattice energy: the enthalpy change when one mole of an ionic solid is formed from its gaseous ions; hydration enthalpy: the enthalpy change when one mole of gaseous ions dissolves in water to form an infinitely dilute solution; enthalpy of solution: the enthalpy change when one mole of solute dissolves in enough water that further dilution causes no further change",
      "ΔsolH = −ΔLE + ΣΔhydH: breaking the lattice is endothermic (reverse of lattice energy) and hydrating the ions is exothermic",
      "Dissolving is favoured when the hydration enthalpies are large enough to compensate for the lattice energy (ΔsolH negative or only slightly positive, and the entropy change favourable)",
      "Mg²⁺ is small with a high charge density, so its hydration enthalpy is very exothermic and compensates for the lattice energy of MgSO₄; the enthalpy of solution is exothermic and the salt dissolves",
      "Ba²⁺ is much larger so its hydration enthalpy is much less exothermic, while the lattice energy of BaSO₄ decreases less (the large sulfate ion dominates the interionic distance); the enthalpy of solution is endothermic and BaSO₄ is insoluble"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Three definitions, the equation linking them, and a trend argument based on cation size. Note that the lattice energy changes less than the hydration enthalpy down the group because the anion is large."
  },
  {
    id: "edx28",
    board: "edexcel",
    category: "Energetics",
    marks: 6,
    question: "Explain what is meant by the terms ΔS system, ΔS surroundings and ΔS total, and explain how they determine whether a reaction is feasible. Use these ideas to explain why ice melts above 0 °C but not below, and why the thermal decomposition of calcium carbonate becomes feasible only at high temperatures.",
    markScheme: [
      "ΔS system is the entropy change of the reacting chemicals (Σ S products − Σ S reactants); ΔS surroundings = −ΔH/T is the entropy change of the surroundings caused by heat exchange; ΔS total = ΔS system + ΔS surroundings",
      "A reaction is thermodynamically feasible if ΔS total is positive (equivalent to ΔG negative)",
      "Melting ice: ΔS system is positive (liquid more disordered) and ΔH is positive, so ΔS surroundings is negative; above 273 K the magnitude of −ΔH/T is smaller than ΔS system so ΔS total > 0; below 273 K it is larger so ΔS total < 0 and ice does not melt",
      "CaCO₃ → CaO + CO₂: ΔS system is large and positive (gas formed) but ΔH is strongly positive (+178 kJ mol⁻¹), so at room temperature ΔS surroundings is very negative and ΔS total is negative",
      "As T increases, ΔS surroundings = −ΔH/T becomes less negative; above about 1100 K (T = ΔH/ΔS system) ΔS total becomes positive and the decomposition is feasible"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The sign of ΔS surroundings depends on the sign of ΔH; the magnitude falls as T rises. Edexcel wants ΔS total, not just ΔG."
  },
  {
    id: "edx29",
    board: "edexcel",
    category: "Kinetics",
    marks: 6,
    question: "The reaction between propanone and iodine in acidic solution has the rate equation rate = k[CH₃COCH₃][H⁺]. Explain how this rate equation could have been determined using a clock reaction or by continuous monitoring, and explain what it shows about the mechanism of the reaction.",
    markScheme: [
      "Clock method: mix fixed volumes of propanone, acid and iodine with a small fixed amount of sodium thiosulfate and starch; time how long until the blue-black colour appears (when the thiosulfate is used up); repeat varying one concentration at a time; initial rate ∝ 1/t",
      "Continuous monitoring: follow [I₂] with a colorimeter (iodine is the only coloured species) over time, or withdraw samples at intervals, quench with sodium hydrogencarbonate and titrate the iodine with thiosulfate",
      "Determine orders by comparing rate with concentration: doubling [propanone] doubles rate (first order), doubling [H⁺] doubles rate (first order), doubling [I₂] has no effect (zero order)",
      "Zero order in iodine shows iodine is not involved in the rate-determining step; it reacts in a fast step after the slow step",
      "The rate-determining step involves one propanone molecule and one H⁺ (the acid-catalysed formation of the enol intermediate), which then reacts rapidly with iodine; H⁺ is a catalyst as it is regenerated"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Explain why 1/t represents the initial rate. Link each order to the mechanism explicitly."
  },
  {
    id: "edx30",
    board: "edexcel",
    category: "Kinetics",
    marks: 6,
    question: "Explain how the half-life of a reaction can be used to show that a reaction is first order and how the rate constant can be found from it. Describe how the orders with respect to the haloalkane and hydroxide ions for the hydrolysis of 2-bromo-2-methylpropane lead to a proposed SN1 mechanism, and compare this with the SN2 mechanism of a primary haloalkane.",
    markScheme: [
      "Half-life is the time for the concentration of a reactant to fall to half its value; for a first-order reaction successive half-lives are constant regardless of concentration (check at least two or three on a concentration–time graph)",
      "For first order, k = ln 2 ÷ t½ = 0.693 ÷ t½, with units s⁻¹",
      "Rate = k[(CH₃)₃CBr]: first order in haloalkane, zero order in OH⁻, so only the haloalkane is in the rate-determining step",
      "SN1: slow step is heterolytic fission of the C–Br bond forming a tertiary carbocation (stabilised by the positive inductive effect of three methyl groups) and Br⁻; fast step is attack by OH⁻ on the planar carbocation",
      "SN2 (primary haloalkane): a single step in which OH⁻ attacks the δ+ carbon from the side opposite the Br as the C–Br bond breaks via a five-coordinate transition state; rate = k[RBr][OH⁻], second order overall; primary carbocations are too unstable for SN1 and the carbon is less hindered"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "State what zero order means for the mechanism. Compare the two mechanisms in terms of steps, intermediates/transition states and the rate equation."
  },
  {
    id: "edx31",
    board: "edexcel",
    category: "Equilibrium",
    marks: 6,
    question: "Explain the terms partial pressure, mole fraction and Kp. For the equilibrium N₂O₄(g) ⇌ 2NO₂(g), explain how Kp can be calculated from the degree of dissociation at a known total pressure, and explain how the value of Kp and the composition of the mixture change when the total pressure is doubled at constant temperature.",
    markScheme: [
      "Mole fraction = moles of a gas ÷ total moles of gas; partial pressure = mole fraction × total pressure; partial pressures sum to the total pressure",
      "Kp = p(NO₂)² / p(N₂O₄), units of pressure (kPa or atm); Kp is constant at constant temperature",
      "If a moles of N₂O₄ dissociate to a fraction α: N₂O₄ = a(1 − α), NO₂ = 2aα, total = a(1 + α); mole fractions (1 − α)/(1 + α) and 2α/(1 + α); multiply by total pressure to find partial pressures and substitute",
      "Kp does not change when the pressure is doubled because only temperature affects Kp",
      "Doubling pressure doubles both partial pressures so p(NO₂)²/p(N₂O₄) would double; to restore Kp the equilibrium shifts to the left (fewer gas moles), decreasing the mole fraction of NO₂ and the mixture becomes paler"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Set up the moles in terms of α (or x), then mole fractions, then partial pressures. The pressure argument must be made through the Kp expression, not just Le Chatelier."
  },
  {
    id: "edx32",
    board: "edexcel",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Explain the difference between a strong acid and a weak acid, and between a concentrated and a dilute acid. Describe how you would calculate the pH of 0.100 mol dm⁻³ solutions of hydrochloric acid, ethanoic acid (Ka = 1.7 × 10⁻⁵ mol dm⁻³) and sodium hydroxide at 298 K, stating any assumptions made.",
    markScheme: [
      "A strong acid is fully dissociated in solution; a weak acid is only partially dissociated and exists in equilibrium with its ions; concentration refers to the amount of acid per dm³, not the degree of dissociation",
      "HCl: [H⁺] = 0.100 mol dm⁻³ (complete dissociation), pH = −log(0.100) = 1.00",
      "Ethanoic acid: Ka = [H⁺][A⁻]/[HA]; assume [H⁺] = [A⁻] (negligible H⁺ from water) and [HA] ≈ 0.100 (negligible dissociation); [H⁺] = √(Ka × c) = √(1.7 × 10⁻⁶) = 1.30 × 10⁻³; pH = 2.88",
      "NaOH: fully dissociated so [OH⁻] = 0.100; Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ so [H⁺] = 1.0 × 10⁻¹³; pH = 13.00",
      "The weak acid has a higher pH than the strong acid of the same concentration because far fewer H⁺ ions are present; the two assumptions for the weak acid are stated explicitly"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Four distinct definitions, then three calculations with working. Write out both weak acid assumptions; they are usually worth a mark."
  },
  {
    id: "edx33",
    board: "edexcel",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Describe how you would use a pH meter to obtain a titration curve for the addition of sodium hydroxide to a weak acid, and explain how the curve can be used to find the Ka of the acid and to choose a suitable indicator. Explain why the equivalence point is not at pH 7.",
    markScheme: [
      "Calibrate the pH meter with standard buffer solutions; pipette 25.0 cm³ of the acid into a beaker; add NaOH from a burette in portions (1 cm³, then 0.2 cm³ near the equivalence point), stirring and recording the pH after each addition",
      "Plot pH against volume of NaOH; the curve starts at about pH 3, rises slowly through a buffer region, then rises steeply around the equivalence volume and levels off at about pH 13",
      "Ka: at half the equivalence volume, half the acid has been converted to its salt so [HA] = [A⁻] and pH = pKa; Ka = 10^(−pKa)",
      "Indicator: its pH range (pKin ± 1) must lie entirely within the steep vertical section; for a weak acid–strong base titration this is roughly pH 7 to 11, so phenolphthalein is suitable and methyl orange is not",
      "The equivalence point is above pH 7 because the salt contains the conjugate base of a weak acid, which reacts with water: A⁻ + H₂O ⇌ HA + OH⁻, making the solution slightly alkaline"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Calibration and small additions near the end point are the practical marks. The half-neutralisation method for pKa is the standard route."
  },
  {
    id: "edx34",
    board: "edexcel",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: "Explain how a buffer solution based on carbonic acid and hydrogencarbonate ions controls the pH of blood. Explain, with equations, what happens when acid or alkali enters the blood, and describe how you would calculate the pH of a buffer solution containing known concentrations of a weak acid and its salt.",
    markScheme: [
      "Blood is buffered at about pH 7.4 by the equilibrium H₂CO₃ ⇌ H⁺ + HCO₃⁻ (carbonic acid formed from dissolved CO₂)",
      "Added H⁺ (e.g. lactic acid from exercise) reacts with the large reservoir of HCO₃⁻: HCO₃⁻ + H⁺ → H₂CO₃, so [H⁺] barely changes",
      "Added OH⁻ reacts with carbonic acid: H₂CO₃ + OH⁻ → HCO₃⁻ + H₂O; the equilibrium shifts to replace the H⁺ removed",
      "The ratio [H₂CO₃]/[HCO₃⁻] changes only slightly because both are present in large amounts, so [H⁺] = Ka × [H₂CO₃]/[HCO₃⁻] stays almost constant; excess CO₂ is removed by breathing",
      "Calculation: [H⁺] = Ka × [HA]/[A⁻] using the concentrations (or moles, since volumes cancel) of the weak acid and the salt; pH = −log[H⁺]; when [HA] = [A⁻], pH = pKa"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Both equations are required and the explanation must say why [H⁺] barely changes (large reservoir, ratio nearly constant). Include the role of breathing in removing CO₂ if you can."
  },
  {
    id: "edx35",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Explain how standard electrode potentials are measured against the standard hydrogen electrode and how E°cell values are used to predict feasibility. Discuss the limitations of these predictions, and explain how the e.m.f. of a cell changes when the concentration of ions in one half-cell is changed.",
    markScheme: [
      "Standard hydrogen electrode: H₂ gas at 100 kPa bubbled over a platinum electrode in 1.00 mol dm⁻³ H⁺ at 298 K, defined as 0.00 V; connected via a salt bridge and high resistance voltmeter to the half-cell under test (1.00 mol dm⁻³ ions, 298 K)",
      "E°cell = E°(more positive) − E°(more negative); the more positive half-cell is reduced; a positive E°cell indicates a thermodynamically feasible reaction",
      "Limitation 1: the prediction applies to standard conditions; changes in concentration or temperature alter electrode potentials and may change the outcome",
      "Limitation 2: a positive E°cell says nothing about rate; the activation energy may be so high that the reaction is too slow to observe",
      "Changing concentration: for M²⁺ + 2e⁻ ⇌ M, increasing [M²⁺] shifts the equilibrium right so the electrode potential becomes more positive; decreasing it makes E more negative; the e.m.f. therefore rises or falls accordingly"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Standard conditions in full, then the sign rule, then both limitations. The concentration effect is reasoned through the half-cell equilibrium."
  },
  {
    id: "edx36",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Describe how a hydrogen–oxygen fuel cell produces an electric current, giving half-equations for an acidic electrolyte. Compare fuel cells with rechargeable lithium-ion cells and with petrol engines in terms of their advantages and disadvantages for powering vehicles.",
    markScheme: [
      "Negative electrode: H₂ → 2H⁺ + 2e⁻ (oxidation); positive electrode: O₂ + 4H⁺ + 4e⁻ → 2H₂O (reduction); overall 2H₂ + O₂ → 2H₂O; electrons flow through the external circuit",
      "A fuel cell generates a continuous voltage as long as hydrogen and oxygen are supplied; it does not need recharging and is not used up like a conventional cell",
      "Advantages over petrol: the only product is water, no CO₂ or pollutants such as NOₓ at the point of use; higher efficiency than an internal combustion engine",
      "Disadvantages: hydrogen is a flammable gas that is difficult to store and transport (high pressure or very low temperature); producing hydrogen (electrolysis or from methane) uses energy and may release CO₂; expensive platinum catalysts",
      "Lithium-ion cells: rechargeable by reversing the cell reaction with an external supply; no emissions at the point of use but limited range, long charging times, and the electricity and the lithium mining have environmental costs; fuel cells refuel quickly and have a longer range"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give the half-equations with the correct electrode. A balanced evaluation needs at least one advantage and one disadvantage for each option."
  },
  {
    id: "edx37",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Describe how the concentration of an oxidising agent such as iodate(V) ions in solution can be determined by reaction with excess potassium iodide followed by titration with sodium thiosulfate. Give equations, explain the use of starch indicator and describe how the result is calculated.",
    markScheme: [
      "Add excess acidified potassium iodide to a measured volume of the iodate(V) solution; iodine is liberated: IO₃⁻ + 5I⁻ + 6H⁺ → 3I₂ + 3H₂O (solution turns brown)",
      "Titrate the liberated iodine with standard sodium thiosulfate: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻; the brown colour fades to pale yellow",
      "Add a few drops of starch solution near the end point when the solution is pale yellow; the blue-black starch–iodine complex forms; continue adding thiosulfate until the blue-black colour just disappears",
      "Starch is added late because, if a lot of iodine is present, the starch–iodine complex forms in a way that is slow to break down and gives an inaccurate end point",
      "Moles S₂O₃²⁻ = c × V; moles I₂ = half; moles IO₃⁻ = moles I₂ ÷ 3; concentration of iodate = moles ÷ volume of sample"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Track the mole ratios: 1 IO₃⁻ gives 3 I₂ which needs 6 S₂O₃²⁻. Explain why the starch is added near the end."
  },
  {
    id: "edx38",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Explain what is meant by a transition metal and explain why transition metals form coloured compounds, show variable oxidation states and act as catalysts. Illustrate your answer with the reactions of vanadium or chromium species.",
    markScheme: [
      "A transition metal is a d-block element that forms at least one stable ion with a partially filled d sub-shell; Sc and Zn are excluded",
      "Colour: ligands split the d orbitals into two energy levels; an electron absorbs visible light of frequency ν (ΔE = hν) to move to the higher level; the complementary colour is observed; a full or empty d sub-shell gives no colour (Zn²⁺, Cu⁺, Sc³⁺)",
      "Variable oxidation states: the 4s and 3d electrons are close in energy so different numbers can be lost; e.g. vanadium +5 (yellow VO₂⁺), +4 (blue VO²⁺), +3 (green V³⁺), +2 (violet V²⁺), produced in turn when zinc and acid reduce vanadate(V)",
      "Catalysis: variable oxidation states allow transition metal ions to act as homogeneous catalysts by forming intermediates (e.g. Fe²⁺/Fe³⁺ in the S₂O₈²⁻/I⁻ reaction); partially filled d orbitals allow adsorption of reactants on metal surfaces in heterogeneous catalysis (Fe in the Haber process, V₂O₅ in the Contact process)",
      "Chromium example: Cr₂O₇²⁻ (orange, +6) is reduced by zinc in acid to Cr³⁺ (green) and then Cr²⁺ (blue); Cr³⁺ is oxidised by H₂O₂ in alkali to yellow CrO₄²⁻"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Four properties, each with the electronic explanation. Give the vanadium colour sequence or the chromium changes as evidence."
  },
  {
    id: "edx39",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Describe the ligand exchange reactions of [Cu(H₂O)₆]²⁺ with excess ammonia and with concentrated hydrochloric acid, and the reaction of [Cr(H₂O)₆]³⁺ with excess sodium hydroxide. Explain the colour changes and the changes in coordination number and shape, and explain why multidentate ligands such as EDTA⁴⁻ form very stable complexes.",
    markScheme: [
      "Ammonia: first a pale blue precipitate of Cu(OH)₂ (acid-base), then in excess NH₃ ligand exchange: [Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O; deep blue; coordination number stays 6, octahedral (distorted)",
      "Concentrated HCl: [Cu(H₂O)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O; pale blue to yellow (green when mixed); coordination number falls from 6 to 4 and the shape changes from octahedral to tetrahedral because Cl⁻ ligands are larger than water",
      "Cr³⁺ with NaOH: grey-green precipitate of Cr(OH)₃ (deprotonation), which dissolves in excess to give green [Cr(OH)₆]³⁻ because chromium(III) hydroxide is amphoteric",
      "The colour changes because the different ligands split the d orbitals by different amounts, changing ΔE and so the frequency of light absorbed",
      "EDTA⁴⁻ is hexadentate and replaces six monodentate ligands: [Cu(H₂O)₆]²⁺ + EDTA⁴⁻ → [Cu(EDTA)]²⁻ + 6H₂O; the number of particles increases from 2 to 7 so ΔS system is large and positive, making the reaction strongly favoured (chelate effect)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Distinguish acid-base (precipitate) steps from ligand exchange. The EDTA stability argument is entropy driven; say so explicitly with the particle count."
  },
  {
    id: "edx40",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the mechanism for the reduction of propanone by lithium tetrahydridoaluminate(III) and for the addition of hydrogen cyanide to propanal. Explain why the product from propanal shows optical activity in principle but the product obtained is optically inactive.",
    markScheme: [
      "LiAlH₄ (in dry ether) provides the hydride ion H⁻ as the nucleophile; curly arrow from H⁻ to the δ+ carbonyl carbon and from the C=O bond to O, forming an alkoxide intermediate; protonation (by water added afterwards) gives propan-2-ol",
      "Both reactions are nucleophilic additions to the planar C=O group; the carbon is δ+ because oxygen is more electronegative",
      "HCN addition (using KCN with a little acid): curly arrow from CN⁻ to the carbonyl carbon and from C=O to O, giving an alkoxide, which is protonated by HCN or H⁺ to form 2-hydroxybutanenitrile",
      "The product carbon carries four different groups (H, C₂H₅, OH, CN) so it is a chiral centre and the two enantiomers would each rotate plane-polarised light",
      "The carbonyl group is planar and CN⁻ attacks from above or below with equal probability, so equal amounts of the two enantiomers form (racemic mixture) and the rotations cancel"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the mechanism with the curly arrows and the alkoxide intermediate. The racemate explanation is planar carbonyl plus equal probability of attack from either face."
  },
  {
    id: "edx41",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Compare the reactions of ethanoic acid, ethanoyl chloride and ethanoic anhydride with ethanol and with ammonia. Explain the relative reactivity of the three compounds and explain why ethanoic anhydride rather than ethanoyl chloride is used to manufacture aspirin from salicylic acid.",
    markScheme: [
      "Ethanoic acid + ethanol: slow reversible esterification needing heat and a concentrated H₂SO₄ catalyst to form ethyl ethanoate; with ammonia it just forms the ammonium salt CH₃COO⁻NH₄⁺",
      "Ethanoyl chloride + ethanol: rapid, vigorous reaction at room temperature giving ethyl ethanoate and HCl fumes; with ammonia gives ethanamide and HCl (NH₄Cl)",
      "Ethanoic anhydride + ethanol: faster than the acid but less vigorous than the acyl chloride, giving ethyl ethanoate and ethanoic acid; with ammonia gives ethanamide and ethanoic acid",
      "Reactivity order: acyl chloride > anhydride > carboxylic acid; the carbonyl carbon in the acyl chloride is the most δ+ because Cl is strongly electron withdrawing and Cl⁻ is a good leaving group",
      "The anhydride is preferred for aspirin because it is less corrosive and hazardous, does not produce HCl (which is corrosive and would react with the product), is cheaper, and the reaction is easier to control; the ethanoic acid by-product can be recycled"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Set out a 3 × 2 grid of reagents and products. Justify the reactivity order with the δ+ character of the carbonyl carbon."
  },
  {
    id: "edx42",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the bonding in benzene and explain why benzene undergoes electrophilic substitution rather than electrophilic addition. Outline the mechanism for the Friedel–Crafts acylation of benzene using ethanoyl chloride and aluminium chloride, and explain the role of the aluminium chloride.",
    markScheme: [
      "Benzene is a planar hexagonal ring of six sp² carbons; each carbon forms σ bonds to two carbons and one hydrogen and contributes one electron from a p orbital to a delocalised π system above and below the plane; all C–C bonds are the same length, intermediate between single and double",
      "Delocalisation gives benzene extra stability (about 150 kJ mol⁻¹ compared with the hypothetical cyclohexatriene, shown by the less exothermic enthalpy of hydrogenation); addition would destroy the delocalised system, whereas substitution preserves it",
      "AlCl₃ is a halogen carrier (Lewis acid catalyst) that removes Cl⁻ from CH₃COCl to generate the acylium ion electrophile: CH₃COCl + AlCl₃ → CH₃CO⁺ + AlCl₄⁻",
      "Mechanism: curly arrow from the delocalised ring to CH₃CO⁺ forming a positively charged intermediate with a horseshoe of partial delocalisation; curly arrow from the C–H bond back into the ring, releasing H⁺",
      "H⁺ + AlCl₄⁻ → HCl + AlCl₃ regenerates the catalyst; the product is phenylethanone, C₆H₅COCH₃; conditions: anhydrous, heat under reflux"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The stability argument needs the hydrogenation enthalpy evidence. Show the catalyst generating the electrophile and being regenerated."
  },
  {
    id: "edx43",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain why phenol is more acidic than ethanol but less acidic than ethanoic acid, and describe tests that could distinguish the three compounds. Explain why phenol reacts with bromine water while benzene does not, and name the product.",
    markScheme: [
      "Phenol: the negative charge on the phenoxide ion is delocalised into the ring, stabilising it, so phenol loses a proton more readily than ethanol, where the ethoxide ion's charge is localised on oxygen",
      "Ethanoic acid is more acidic than phenol because the negative charge of the ethanoate ion is delocalised over two oxygen atoms (more electronegative), so it is stabilised even more",
      "Tests: ethanoic acid gives effervescence with sodium carbonate (CO₂); phenol does not react with carbonate but does react with NaOH (forming sodium phenoxide) and is only slightly soluble in water; ethanol reacts with neither base",
      "Phenol decolourises bromine water and gives a white precipitate of 2,4,6-tribromophenol; ethanol and ethanoic acid give no reaction with bromine water; alternatively, phenol gives a purple colour with iron(III) chloride",
      "Phenol reacts with bromine without a catalyst because a lone pair on the oxygen is delocalised into the ring, increasing the electron density and activating it towards electrophiles; benzene's lower electron density cannot polarise Br₂"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Acidity is explained by the stability of the anion. Give the specific observations for each test; carbonate is the discriminator between the acid and phenol."
  },
  {
    id: "edx44",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe how amines can be prepared from haloalkanes, nitriles and nitroarenes, giving reagents and conditions. Explain why amines are basic and compare the base strengths of butylamine, ammonia and phenylamine, and describe the reactions of amines with acids, acyl chlorides and copper(II) ions.",
    markScheme: [
      "Haloalkane + excess ethanolic ammonia, heated under pressure (nucleophilic substitution): C₄H₉Br + 2NH₃ → C₄H₉NH₂ + NH₄Br; nitrile reduction with LiAlH₄ or H₂/Ni: RCN → RCH₂NH₂; nitrobenzene reduced with Sn and concentrated HCl then NaOH to give phenylamine",
      "Amines are bases because the nitrogen lone pair accepts a proton; butylamine > ammonia > phenylamine because the alkyl group pushes electron density onto N (inductive effect) while the phenyl group delocalises the lone pair into the ring",
      "With acids, amines form alkylammonium salts: C₄H₉NH₂ + HCl → C₄H₉NH₃⁺Cl⁻",
      "With acyl chlorides, amines form N-substituted amides: C₄H₉NH₂ + CH₃COCl → CH₃CONHC₄H₉ + HCl",
      "With copper(II) ions, amines act as ligands like ammonia: a pale blue precipitate of Cu(OH)₂ forms then dissolves in excess butylamine to give a deep blue complex ion"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Three preparations with conditions, then basicity, then three reactions. The lone pair availability argument explains the order of base strength."
  },
  {
    id: "edx45",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe how Grignard reagents are prepared and how they are used to increase the length of a carbon chain, giving the products formed with carbon dioxide, methanal, other aldehydes and ketones. Explain why the reaction must be carried out under dry conditions and compare this route with the use of KCN for chain extension.",
    markScheme: [
      "Prepared by reacting a haloalkane with magnesium in dry ether: RBr + Mg → RMgBr; the carbon attached to Mg is nucleophilic (δ−)",
      "With CO₂ then dilute acid: carboxylic acid RCOOH (one extra carbon); with methanal then acid: primary alcohol RCH₂OH",
      "With other aldehydes: secondary alcohols RCH(OH)R'; with ketones: tertiary alcohols; in each case the R group bonds to the carbonyl carbon and the O⁻ is protonated by dilute acid",
      "Water must be excluded because the Grignard reagent reacts with water (RMgBr + H₂O → RH + Mg(OH)Br), destroying it before it can react with the carbonyl compound",
      "KCN route: haloalkane + KCN in ethanol gives a nitrile with one extra carbon (nucleophilic substitution), which can be hydrolysed to a carboxylic acid or reduced to an amine; the Grignard route is more versatile as it gives alcohols of any class directly and extends the chain by the whole R group"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Give the product class for each carbonyl type. The 'dry ether' point must be explained (reaction with water), not just stated."
  },
  {
    id: "edx46",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the formation of condensation polymers from suitable monomers, using the manufacture of Terylene and nylon-6,6 as examples, and compare condensation polymerisation with addition polymerisation. Explain how the different types of polymer can be disposed of and why condensation polymers are more easily broken down.",
    markScheme: [
      "Condensation polymerisation: monomers with two functional groups join with the loss of a small molecule (water or HCl) at each link",
      "Terylene: ethane-1,2-diol + benzene-1,4-dicarboxylic acid form ester links –COO–; nylon-6,6: hexane-1,6-diamine + hexanedioic acid (or hexanedioyl dichloride) form amide links –CONH–; draw the repeat unit showing the link",
      "Addition polymerisation: alkene monomers join by opening the C=C bond with no other product; the polymer is the only product and has a saturated non-polar backbone",
      "Disposal options: landfill (polymers do not biodegrade), incineration with energy recovery (CO₂ and possibly toxic gases), recycling (sorting needed), feedstock recycling by cracking to monomers or other useful compounds",
      "Condensation polymers contain polar ester or amide links that can be hydrolysed by acid or alkali (or enzymes), so they can be broken back down to their monomers and some are biodegradable; addition polymers have only strong non-polar C–C bonds that are not attacked by water"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name both monomers for each polymer and draw the repeat unit. The disposal comparison depends on the hydrolysable links."
  },
  {
    id: "edx47",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the acid-base behaviour of amino acids, including the formation of zwitterions, and describe how two amino acids join to form a dipeptide. Explain how a mixture of amino acids from the hydrolysis of a peptide could be separated and identified by chromatography.",
    markScheme: [
      "Amino acids contain a basic NH₂ group and an acidic COOH group; with acid they form the ammonium salt (H₃N⁺CHRCOOH) and with alkali the carboxylate salt (H₂NCHRCOO⁻)",
      "In solution near neutral pH they exist as zwitterions, H₃N⁺CHRCOO⁻, formed by internal proton transfer; this gives amino acids high melting points and water solubility",
      "A dipeptide forms by condensation: the COOH of one amino acid reacts with the NH₂ of another, losing water and forming a peptide (secondary amide) link –CONH–; two different amino acids can give two different dipeptides",
      "Hydrolysis of a peptide: heat under reflux with 6 mol dm⁻³ HCl (or NaOH) breaks the peptide links, giving the constituent amino acids",
      "Separate by paper or thin-layer chromatography: spot the mixture, run in a suitable solvent, dry, develop with ninhydrin (amino acids are colourless) to give purple spots, calculate Rf = distance moved by spot ÷ distance moved by solvent front and compare with known values run alongside"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Draw the zwitterion. For chromatography, the developing agent and the Rf comparison with standards are both required."
  },
  {
    id: "edx48",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Devise a synthetic route, in no more than three steps, to convert ethene into ethyl ethanoate. For each step give the reagents, conditions and the type of reaction, and explain how you would purify the ester produced and check its purity.",
    markScheme: [
      "Step 1: ethene to ethanol by hydration with steam, phosphoric acid catalyst, 300 °C and 60 to 70 atm (or bromoethane via HBr then hydrolysis); electrophilic addition",
      "Step 2: oxidise part of the ethanol to ethanoic acid by heating under reflux with excess acidified potassium dichromate(VI); oxidation (orange to green)",
      "Step 3: esterify ethanoic acid with ethanol by heating with a concentrated sulfuric acid catalyst; CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (reversible, so excess alcohol or removal of the ester improves yield)",
      "Purification: distil off the crude ester, shake with sodium carbonate solution in a separating funnel to remove acid (release the CO₂ pressure), separate the organic layer, wash with water, dry with anhydrous calcium chloride and redistil, collecting the fraction at 77 °C",
      "Purity check: boiling point close to 77 °C, or IR spectrum showing C=O at about 1740 cm⁻¹ and no broad O–H absorption from acid or alcohol"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Reagents, conditions and reaction type for every step. Purification of a liquid ester follows the standard sequence: separate, wash, dry, distil."
  },
  {
    id: "edx49",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Explain how proton NMR and carbon-13 NMR spectroscopy can be used to distinguish between the three isomeric alcohols propan-1-ol, propan-2-ol and methoxyethane, C₂H₅OCH₃. In your answer refer to the number of peaks, chemical shifts, splitting patterns and the effect of adding D₂O.",
    markScheme: [
      "¹³C NMR: propan-1-ol 3 peaks (CH₃, CH₂, CH₂OH); propan-2-ol 2 peaks (two equivalent CH₃ and CH); methoxyethane 3 peaks (CH₃, CH₂, OCH₃), so propan-2-ol is identified immediately by having only two carbon environments",
      "¹H NMR propan-1-ol: 4 peaks, ratio 3:2:2:1; CH₃ triplet, CH₂ multiplet, CH₂O triplet at about 3.6 ppm, OH singlet",
      "¹H NMR propan-2-ol: 3 peaks, ratio 6:1:1; CH₃ doublet, CH septet (multiplet) at about 4 ppm, OH singlet",
      "¹H NMR methoxyethane: 3 peaks, ratio 3:2:3; CH₃ triplet, OCH₂ quartet at about 3.4 ppm, OCH₃ singlet at about 3.3 ppm; no OH peak",
      "Adding D₂O: the OH peak disappears for both alcohols (proton exchanged for deuterium) but the methoxyethane spectrum is unchanged, confirming it has no OH group"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Count environments carefully and give integration ratios. The D₂O shake and the absence of an OH peak identify the ether."
  },
  {
    id: "edx50",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the principles of high performance liquid chromatography (HPLC) and gas chromatography (GC). Explain how retention time and peak area are used, why these techniques are often combined with mass spectrometry, and give one application of each.",
    markScheme: [
      "All chromatography separates components according to their relative affinities for a stationary phase and a mobile phase; components with greater attraction to the stationary phase move more slowly",
      "HPLC: stationary phase is a fine solid (e.g. silica) packed in a column; the mobile phase is a liquid solvent forced through under high pressure; suitable for non-volatile or thermally unstable compounds; detection often by UV absorption",
      "GC: a vaporised sample is carried by an inert gas (N₂ or He) through a long column coated with a liquid or solid stationary phase; separation depends on volatility and solubility in the stationary phase; suitable for volatile compounds",
      "Retention time (time from injection to detection) identifies a component by comparison with standards run under identical conditions; the area under a peak is proportional to the amount of that component so concentrations can be found using calibration",
      "Retention times alone are not conclusive because different compounds can have similar values, so the eluted components are passed into a mass spectrometer (GC–MS, LC–MS) to be identified by their mass spectra; applications include drug testing in athletes, forensic analysis and monitoring pollutants"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Name stationary and mobile phase for each technique and say what each is suited to. Peak area gives quantity; retention time gives identity."
  },
  {
    id: "edx51",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would prepare a sample of aspirin (2-ethanoyloxybenzenecarboxylic acid) from salicylic acid and ethanoic anhydride, purify it by recrystallisation and assess its purity. Explain the reasons for each stage of the procedure.",
    markScheme: [
      "Mix salicylic acid with excess ethanoic anhydride and a few drops of concentrated sulfuric (or phosphoric) acid catalyst; heat gently in a water bath (about 60 °C) for 10 to 15 minutes to ensure the reaction is complete without decomposing the product",
      "Add cold water to hydrolyse the excess ethanoic anhydride and precipitate the aspirin (which is insoluble in cold water); cool in ice to maximise crystallisation; filter under reduced pressure using a Büchner funnel",
      "Recrystallise: dissolve the crude product in the minimum volume of hot solvent (e.g. ethanol or ethyl ethanoate) so the solution is saturated; filter hot if insoluble impurities remain; cool slowly so pure crystals form while soluble impurities stay in solution",
      "Filter the crystals under reduced pressure, wash with a little cold solvent to remove soluble impurities, and dry (in a desiccator or warm oven)",
      "Assess purity by melting point: pure aspirin melts sharply at about 135 °C; impurities lower and broaden the range; also TLC against a pure standard (one spot with the same Rf) or IR (no broad phenolic O–H absorption)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "'Minimum volume of hot solvent' and 'wash with cold solvent' are expected phrases. Give a purity method and explain why impurities lower the melting point."
  },
  {
    id: "edx52",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would determine the rate equation for the reaction between hydrogen peroxide and iodide ions in acid solution (H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O) using a clock reaction with sodium thiosulfate and starch. Explain how the data are processed and discuss the assumptions and limitations of the method.",
    markScheme: [
      "Mix known volumes of KI, H₂SO₄, a small fixed amount of sodium thiosulfate and starch; add H₂O₂ and start the clock; time until the blue-black colour appears, which is when the thiosulfate has been used up (2S₂O₃²⁻ + I₂ → S₄O₆²⁻ + 2I⁻)",
      "Repeat varying the concentration of one reactant at a time (using water to keep the total volume constant) at constant temperature",
      "A fixed amount of iodine has formed at the colour change, so the initial rate ∝ 1/t; plot 1/t against concentration (or log(1/t) against log(concentration)); a straight line through the origin shows first order, a horizontal line zero order, a curve second order",
      "Rate equation found to be rate = k[H₂O₂][I⁻] (zero order in H⁺ under these conditions), so the rate-determining step involves one H₂O₂ and one I⁻",
      "Assumptions and limitations: the amount of iodine formed is small so the concentrations of reactants have barely changed (initial rate approximation); the end point is judged by eye; temperature must be controlled; the thiosulfate must be small compared with the other reagents"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Explain why 1/t is proportional to the initial rate. The data processing must state how the graph shape reveals the order."
  },
  {
    id: "edx53",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would determine the activation energy for the reaction between magnesium and hydrochloric acid, or between sodium thiosulfate and hydrochloric acid, by measuring the rate at several temperatures. Explain the processing of the results using the Arrhenius equation and discuss the main sources of error.",
    markScheme: [
      "Keep all concentrations and volumes constant; measure the reaction time at five or more temperatures (e.g. 20 to 60 °C) using a water bath to set the temperature, recording the actual temperature of the mixture at the start",
      "Measure the time for a fixed change: for Mg/HCl the time to collect a fixed volume of H₂ (or for a fixed mass of Mg to disappear); for thiosulfate/HCl the time for a cross to be obscured by the sulfur precipitate",
      "Rate ∝ 1/t, so 1/t is proportional to k at each temperature; convert temperatures to kelvin",
      "Plot ln(1/t) against 1/T; from ln k = ln A − Ea/RT the gradient is −Ea/R, so Ea = −gradient × 8.31 J K⁻¹ mol⁻¹, converted to kJ mol⁻¹",
      "Errors: the temperature changes during the run (exothermic reaction or cooling), judging the end point by eye is subjective, the surface area of the magnesium may vary, gas may escape before the bung is fitted; use a thermostatic water bath, the same observer and a large volume of acid so the temperature change is small"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "You do not need absolute k values; 1/t is enough because the constant cancels in the gradient. State the axes and how to get Ea from the gradient."
  },
  {
    id: "edx54",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would carry out a redox titration to determine the percentage of iron in a sample of iron tablets using potassium manganate(VII). Explain the choice of acid, why no indicator is needed, how to read the burette and how the percentage of iron is calculated.",
    markScheme: [
      "Crush a known mass of tablets, dissolve in dilute sulfuric acid (warming if necessary), transfer with rinsings to a 250 cm³ volumetric flask and make up to the mark; pipette 25.0 cm³ into a conical flask and add more dilute H₂SO₄",
      "Sulfuric acid is used because it provides the H⁺ needed (MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O) without being oxidised; HCl would be oxidised to Cl₂ and nitric acid would itself oxidise Fe²⁺",
      "Titrate with standard KMnO₄ until the first permanent pale pink colour; MnO₄⁻ is self-indicating because the purple colour disappears as it is reduced to colourless Mn²⁺, and the first excess drop stays pink",
      "Read the burette from the top of the meniscus because the dark solution hides the bottom; repeat to concordant titres and take the mean",
      "MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O; moles Fe²⁺ in 25.0 cm³ = 5 × moles MnO₄⁻; scale up by 10 for the flask; mass of Fe = moles × 55.8; percentage = mass Fe ÷ mass of tablets × 100"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "The acid choice (sulfuric, with reasons for rejecting HCl and HNO₃) and the top-of-meniscus reading are the distinctive practical marks. Use the 1 : 5 ratio."
  },
  {
    id: "edx55",
    board: "edexcel",
    category: "Practical Chemistry",
    marks: 6,
    question: "Describe how you would investigate the effect of changing the halogen on the rate of hydrolysis of the halogenoalkanes 1-chlorobutane, 1-bromobutane and 1-iodobutane. Explain the observations, the trend and why the trend is explained by bond enthalpy and not bond polarity.",
    markScheme: [
      "Place equal volumes of ethanol in three test tubes in a water bath at about 50 to 60 °C and add a few drops of aqueous silver nitrate to each; add equal amounts of each halogenoalkane at the same time and start timing",
      "Ethanol is a solvent in which both the halogenoalkane and the aqueous silver nitrate dissolve; the water hydrolyses the halogenoalkane, releasing halide ions: RX + H₂O → ROH + H⁺ + X⁻",
      "The halide ions react with silver ions to form a precipitate: Ag⁺ + X⁻ → AgX; AgCl white, AgBr cream, AgI yellow; record the time for each precipitate to appear",
      "Iodobutane gives a precipitate fastest, bromobutane next and chlorobutane slowest, so the rate of hydrolysis is I > Br > Cl",
      "The C–I bond has the lowest bond enthalpy (longest, weakest) so it breaks most easily in the rate-determining step; C–Cl is the most polar bond, so if polarity controlled the rate chlorobutane would be fastest, which is not observed; bond strength is the controlling factor"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Control variables (temperature, volumes, concentration, same time of addition) earn credit. Finish by explicitly rejecting the polarity argument."
  },
  {
    id: "edx56",
    board: "edexcel",
    category: "Energetics",
    marks: 6,
    question: "Explain how a Born–Haber cycle is constructed for sodium chloride and used to calculate its lattice energy. Explain how the lattice energies of sodium chloride, potassium chloride and magnesium chloride compare, and how the comparison of theoretical and experimental lattice energies gives evidence for the bonding in a compound.",
    markScheme: [
      "Steps: atomisation of Na (Na(s) → Na(g)), first ionisation energy of Na, atomisation of Cl (½Cl₂(g) → Cl(g)), first electron affinity of Cl, and the enthalpy of formation of NaCl; all linked in a cycle with the lattice energy Na⁺(g) + Cl⁻(g) → NaCl(s)",
      "Applying Hess's law: ΔLE = ΔfH − [ΔatH(Na) + IE(Na) + ΔatH(Cl) + EA(Cl)]; the lattice energy is negative (exothermic)",
      "KCl is less exothermic than NaCl because K⁺ is larger than Na⁺, so the ions are further apart and the electrostatic attraction weaker; MgCl₂ is much more exothermic because Mg²⁺ is smaller and doubly charged, giving a much stronger attraction",
      "The theoretical lattice energy is calculated from a perfect ionic model (spherical ions, point charges, purely electrostatic attraction); the experimental value comes from the Born–Haber cycle",
      "Close agreement (e.g. NaCl) shows the bonding is almost purely ionic; a significantly more exothermic experimental value (e.g. AgI, MgI₂) shows extra attraction from covalent character, caused by a small highly charged cation polarising a large anion"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "List every step in the cycle with its state symbols. Compare lattice energies using ionic radius and charge; the ionic versus experimental comparison identifies covalent character."
  },
  {
    id: "edx57",
    board: "edexcel",
    category: "Equilibrium",
    marks: 6,
    question: "Explain how changes in temperature, pressure and concentration affect the position of equilibrium and the equilibrium constant for the reaction CO(g) + 2H₂(g) ⇌ CH₃OH(g), ΔH = −91 kJ mol⁻¹. Explain the relationship between ΔS total and K and use it to explain why K decreases as temperature rises for this reaction.",
    markScheme: [
      "Temperature: raising T shifts equilibrium to the left (endothermic direction), decreasing the yield of methanol, and decreases Kc and Kp; lowering T increases K",
      "Pressure: increasing pressure shifts the equilibrium to the right (3 moles of gas to 1), increasing the yield, but Kp is unchanged because the partial pressures readjust until their ratio equals Kp again",
      "Concentration: adding more CO or H₂ shifts the equilibrium right to make more methanol, but the value of K is unchanged; removing methanol as it forms also increases conversion",
      "ΔS total = R ln K, so a large positive ΔS total gives a large K; ΔS total = ΔS system + ΔS surroundings where ΔS surroundings = −ΔH/T",
      "For this exothermic reaction ΔS surroundings is positive but its magnitude −ΔH/T decreases as T increases, so ΔS total decreases (ΔS system is negative because gas moles decrease) and therefore ln K and K decrease with temperature"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Separate the effects on position from the effects on K. The last part is the Edexcel-specific link between ΔS total and K; show that −ΔH/T shrinks as T rises."
  },
  {
    id: "edx58",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Explain how the colour of a transition metal complex arises and how a colorimeter can be used to find the formula of a complex ion or the concentration of a coloured solution. Explain why [Cu(H₂O)₆]²⁺ is blue, [Cu(NH₃)₄(H₂O)₂]²⁺ is a deeper blue and [CuCl₄]²⁻ is yellow, and why Zn²⁺ complexes are colourless.",
    markScheme: [
      "In a complex the ligands split the five d orbitals into two sets of slightly different energy; electrons absorb photons of visible light with energy equal to the gap, ΔE = hν, and are promoted; the transmitted light is the complementary colour of the light absorbed",
      "Different ligands produce different splitting (ΔE), so the frequency absorbed and the colour seen differ: ammonia splits the d orbitals more than water, shifting the absorption, giving the deeper blue; chloride ligands with tetrahedral geometry give a much smaller or different splitting so the complex absorbs in the blue/violet region and appears yellow",
      "Zn²⁺ has a full 3d¹⁰ sub-shell so no d–d transitions are possible and the complexes are colourless; similarly Cu⁺ and Sc³⁺",
      "Colorimeter: choose a filter of the complementary colour (the wavelength the complex absorbs most strongly); zero with a blank; measure the absorbance of standard solutions of known concentration to plot a calibration curve; measure the unknown and read off its concentration",
      "Formula by colorimetry: mix the metal ion and ligand solutions in different volume ratios keeping the total volume constant; the ratio giving the maximum absorbance corresponds to the formula of the complex (e.g. 1:4 for the tetraammine)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Use ΔE = hν and the word 'complementary'. The formula-by-colorimetry method (continuous variation) is a distinct point from the calibration-curve method."
  },
  {
    id: "edx59",
    board: "edexcel",
    category: "Transition Metals",
    marks: 6,
    question: "Explain, using equations, how transition metals act as homogeneous and heterogeneous catalysts. Use the reactions of Fe²⁺ with peroxodisulfate and iodide ions, the autocatalysis of the manganate(VII)–ethanedioate reaction, and the Haber process as examples, and explain why catalysts become poisoned.",
    markScheme: [
      "Homogeneous catalysis: the catalyst is in the same phase and forms an intermediate using its variable oxidation state; S₂O₈²⁻ + 2I⁻ → 2SO₄²⁻ + I₂ is slow because the two anions repel; with Fe²⁺: S₂O₈²⁻ + 2Fe²⁺ → 2SO₄²⁻ + 2Fe³⁺ then 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂; the catalyst is regenerated and each step involves oppositely charged ions",
      "Autocatalysis: 2MnO₄⁻ + 16H⁺ + 5C₂O₄²⁻ → 2Mn²⁺ + 8H₂O + 10CO₂ is slow at first; the Mn²⁺ product catalyses the reaction (4Mn²⁺ + MnO₄⁻ + 8H⁺ → 5Mn³⁺ + 4H₂O; 2Mn³⁺ + C₂O₄²⁻ → 2Mn²⁺ + 2CO₂) so the rate increases then falls as reactants are used up",
      "Heterogeneous catalysis: the catalyst is in a different phase, usually a solid with gaseous reactants; in the Haber process N₂ + 3H₂ ⇌ 2NH₃ is catalysed by iron",
      "Mechanism on the surface: reactants adsorb at active sites (using the partially filled d orbitals), bonds within the reactants weaken, new bonds form, products desorb; adsorption must be strong enough to weaken bonds but weak enough for products to leave",
      "Poisoning: impurities (e.g. sulfur compounds, carbon monoxide, lead) adsorb strongly and irreversibly onto active sites, blocking them so the catalyst's efficiency falls; reactants must be purified and the catalyst eventually replaced, adding cost"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Equations for the homogeneous examples must show the catalyst being used and regenerated. For heterogeneous catalysis use adsorb/desorb and link poisoning to blocked active sites."
  },
  {
    id: "edx60",
    board: "edexcel",
    category: "Organic Chemistry",
    marks: 6,
    question: "Describe the chemical tests that would identify the functional groups in an unknown compound that could be a carboxylic acid, an ester, an acyl chloride, a phenol, a primary amine or an amide. Explain the chemistry behind each positive result and state how infrared spectroscopy could support the identification.",
    markScheme: [
      "Carboxylic acid: effervescence with sodium carbonate or sodium hydrogencarbonate (CO₂, turns limewater cloudy); acyl chloride: vigorous reaction with water giving steamy fumes of HCl that turn blue litmus red and give a white precipitate with silver nitrate",
      "Ester: no reaction with carbonate, often a sweet smell; heat under reflux with NaOH then acidify to obtain the carboxylic acid, which then tests positive with carbonate; phenol: no reaction with carbonate but dissolves in NaOH, decolourises bromine water giving a white precipitate, and gives a purple colour with iron(III) chloride",
      "Primary amine: fishy smell, turns damp red litmus blue (basic), forms a salt with HCl, gives white smoke with HCl gas; with copper(II) sulfate a precipitate forms that dissolves in excess amine to a deep blue solution",
      "Amide: neutral to litmus; warming with NaOH releases ammonia (primary amide) which turns damp red litmus blue, distinguishing it from an amine which gives no ammonia",
      "IR support: carboxylic acid shows C=O (about 1700 cm⁻¹) and very broad O–H (2500 to 3300 cm⁻¹); ester C=O (about 1740) and C–O with no O–H; acyl chloride C=O at about 1800; phenol broad O–H (3200 to 3600) and no C=O; amine N–H (3300 to 3500) and no C=O; amide both N–H and C=O (about 1680)"
    ],
    levels: [
      { level: 3, marks: "5-6", descriptor: "The answer is scientifically coherent, logically structured and shows a sustained line of reasoning. All of the relevant chemistry is covered accurately and linked to the question, with appropriate use of technical terminology." },
      { level: 2, marks: "3-4", descriptor: "Some of the relevant chemistry is covered accurately with a line of reasoning that is partially supported. The answer has some structure but may contain gaps or minor errors." },
      { level: 1, marks: "1-2", descriptor: "Limited relevant chemistry is presented, with isolated points and little linking or reasoning. The answer may contain errors or omissions." },
      { level: 0, marks: "0", descriptor: "Insufficient correct chemistry to gain a mark." }
    ],
    examTip: "Make a table of compound, test, observation, explanation. IR is confirmation; give wavenumbers for the key bonds that differ between the groups."
  },
];
