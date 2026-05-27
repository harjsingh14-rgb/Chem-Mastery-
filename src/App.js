import { useState, useCallback, useEffect, useRef } from "react";

const SETS = {
  "3.1.1": { title: "Atomic Structure", cards: [
    {q:"What are the relative mass and charge of a proton?", a:"Relative mass: 1\nRelative charge: +1"},
    {q:"What are the relative mass and charge of a neutron?", a:"Relative mass: 1\nRelative charge: 0"},
    {q:"What are the relative mass and charge of an electron?", a:"Relative mass: 1/1836 (approximately 0)\nRelative charge: −1"},
    {q:"Where are protons and neutrons found in an atom?", a:"They are concentrated in the tiny, dense nucleus at the centre of the atom."},
    {q:"Where are electrons found in an atom?", a:"Electrons occupy orbitals arranged in subshells at various distances from the nucleus."},
    {q:"Define isotopes.", a:"Isotopes are atoms of the same element that have identical proton numbers but different numbers of neutrons, giving different mass numbers."},
    {q:"How do isotopes compare in terms of physical and chemical properties?", a:"Physical properties differ slightly (different masses and densities).\nChemical properties are essentially identical because they have the same electron configuration."},
    {q:"What are the four stages of a time-of-flight (TOF) mass spectrometer?", a:"1. Ionisation\n2. Acceleration\n3. Ion drift (flight)\n4. Detection"},
    {q:"Why must a mass spectrometer be kept under high vacuum?", a:"Any gas molecules present would be ionised and interfere with the detector readings, giving spurious peaks."},
    {q:"How does electron impact ionisation work?", a:"The vaporised sample is bombarded by high-energy electrons from an electron gun. One electron is knocked out of each molecule, forming a positive ion (M⁺)."},
    {q:"How does electrospray ionisation work?", a:"The sample is dissolved in a volatile polar solvent and pushed through a fine needle held at high voltage. Each molecule gains a proton (H⁺) to form an MH⁺ ion. The solvent evaporates, leaving gaseous ions."},
    {q:"In TOF MS, how are ions accelerated and why do lighter ions travel faster?", a:"All ions receive the same kinetic energy from an electric field (KE = ½mv²). Because KE is constant, lighter ions have a higher velocity and reach the detector sooner."},
    {q:"How is the molecular mass determined from an electrospray mass spectrum?", a:"The m/z value of the molecular ion peak is (Mr + 1) because the ion is MH⁺. Subtract 1 to obtain Mr."},
    {q:"Define relative atomic mass.", a:"The weighted mean mass of all naturally occurring isotopes of an element, expressed on a scale where ¹²C = 12.00 exactly."},
    {q:"How is relative atomic mass calculated from mass spectrometry data?", a:"Ar = Σ(isotopic mass × relative abundance) ÷ total relative abundance (or ÷ 100 if abundances are percentages)."},
    {q:"What are the four types of subshell (sub-energy level) and how many electrons can each hold?", a:"s: max 2 electrons\np: max 6 electrons\nd: max 10 electrons\nf: max 14 electrons"},
    {q:"What is an orbital and how many electrons can it contain?", a:"An orbital is a region of space with a high probability of finding an electron. Each orbital holds a maximum of 2 electrons with opposite (paired) spins."},
    {q:"State the Aufbau principle and give the filling order up to 4p.", a:"Electrons fill available orbitals starting from the lowest energy. Order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p."},
    {q:"State Hund's rule.", a:"When filling orbitals of equal energy (degenerate orbitals), electrons occupy each orbital singly before any pairing occurs, and all singly occupied orbitals have the same spin."},
    {q:"Why are the electron configurations of chromium and copper unusual?", a:"Cr is [Ar]3d⁵4s¹ and Cu is [Ar]3d¹⁰4s¹. Both promote one electron from 4s to 3d to achieve a half-filled or completely filled d subshell, which gives extra stability."},
    {q:"Define first ionisation energy and write the equation for sodium.", a:"First ionisation energy is the energy required to remove one mole of electrons from one mole of gaseous atoms in their ground state.\nNa(g) → Na⁺(g) + e⁻"},
    {q:"What three factors determine the magnitude of ionisation energy?", a:"1. Nuclear charge (more protons → higher IE)\n2. Atomic radius (larger → lower IE)\n3. Electron shielding (more inner shells → lower IE)"},
    {q:"Why does first ionisation energy generally increase across Period 3?", a:"Going from Na to Ar, nuclear charge increases while shielding stays approximately constant (same number of inner shells). The outer electron is more strongly attracted to the nucleus."},
    {q:"Why is there a drop in first IE between magnesium and aluminium?", a:"Aluminium's outer electron is in the 3p subshell, which is at a slightly higher energy and is shielded by the full 3s subshell. It is therefore easier to remove than magnesium's 3s electron."},
    {q:"Why is there a drop in first IE between phosphorus and sulfur?", a:"In sulfur, the fourth 3p electron must pair up in an orbital already containing an electron. The repulsion between paired electrons makes the outer electron easier to remove."},
    {q:"What do successive ionisation energies reveal about atomic structure?", a:"Each successive ionisation energy is larger (ion becomes more positive). A large jump between two consecutive ionisation energies indicates that the next electron is being removed from a new (inner) shell, revealing the element's group."},
    {q:"Why do first ionisation energies decrease down Group 2?", a:"Each period adds a new shell, increasing the distance between the outer electron and the nucleus. Greater shielding by inner electrons also reduces the effective nuclear charge felt by the outer electron."},
  ]},
  "3.1.2": { title: "Amount of Substance", cards: [
    {q:"What is a mole and what is Avogadro's constant?", a:"One mole is the amount of substance containing 6.022 × 10²³ particles (atoms, molecules, or ions). This number is Avogadro's constant, Nₐ."},
    {q:"How do you convert between mass, molar mass, and moles?", a:"n = m / M\nwhere n = moles, m = mass in grams, M = molar mass in g mol⁻¹ (numerically equal to Ar or Mr)."},
    {q:"Define empirical formula and molecular formula.", a:"Empirical formula: the simplest whole-number ratio of atoms of each element in a compound.\nMolecular formula: the actual number of atoms of each element in one molecule."},
    {q:"How do you determine empirical formula from percentage composition by mass?", a:"1. Divide each percentage by the element's Ar to get molar amounts.\n2. Divide all values by the smallest to get a ratio.\n3. Multiply up to whole numbers if needed."},
    {q:"How do you find molecular formula from empirical formula?", a:"Divide Mr (from mass spec or given data) by the empirical formula mass. Multiply the empirical formula by this integer."},
    {q:"What is the formula linking concentration, moles, and volume?", a:"c = n / V\nwhere c is in mol dm⁻³, n is in mol, and V is in dm³ (1 dm³ = 1000 cm³, so divide cm³ by 1000)."},
    {q:"State the ideal gas equation and define all symbols.", a:"pV = nRT\np = pressure (Pa), V = volume (m³), n = moles, R = 8.314 J K⁻¹ mol⁻¹, T = temperature (K).\nConvert °C to K by adding 273."},
    {q:"What is atom economy and how is it calculated?", a:"Atom economy measures how much of the reactant atoms end up in the desired product.\n% atom economy = (Mr of desired product / sum of Mr of all products) × 100"},
    {q:"What is percentage yield and how is it calculated?", a:"% yield = (actual moles obtained / theoretical moles expected) × 100\nTheoretical moles come from stoichiometry of the balanced equation."},
    {q:"How do you calculate the concentration of a solution in g dm⁻³ and convert to mol dm⁻³?", a:"Concentration in g dm⁻³ = mass of solute (g) / volume (dm³)\nConvert: mol dm⁻³ = (g dm⁻³) / Mr"},
    {q:"Describe the key steps in making a standard solution in a volumetric flask.", a:"1. Weigh out the required mass of solid accurately.\n2. Dissolve in a small volume of distilled water in a beaker, stirring.\n3. Transfer quantitatively via funnel into a volumetric flask, rinsing beaker and funnel.\n4. Make up to the graduation mark with distilled water (last drops with a dropping pipette, bottom of meniscus on the line).\n5. Invert to mix."},
    {q:"What is a titre and what does 'concordant' mean in a titration?", a:"A titre is the volume of solution delivered from the burette to reach the endpoint. Concordant titres agree within 0.10 cm³ and are averaged to calculate the mean titre."},
    {q:"How are titration results used to find the concentration of an unknown solution?", a:"1. Calculate moles of the standard solution used: n = c × V.\n2. Use the mole ratio from the balanced equation to find moles of unknown.\n3. Calculate concentration: c = n / V."},
    {q:"What is molar volume and what is its approximate value at room temperature and pressure?", a:"Molar volume is the volume occupied by one mole of any ideal gas. At RTP (298 K, 100 kPa) this is approximately 24.0 dm³ mol⁻¹."},
    {q:"How do you calculate the mass of a product formed in a reaction from given masses of reactants?", a:"1. Find moles of each reactant (n = m/M).\n2. Identify the limiting reagent using the mole ratio.\n3. Use the mole ratio to find moles of product.\n4. Calculate mass: m = n × M."},
    {q:"What is the significance of a high atom economy in industrial processes?", a:"High atom economy means less waste is produced and more of the raw material is converted to useful product, making the process more economical and environmentally sustainable."},
    {q:"How do you determine the number of moles of water of crystallisation in a hydrated salt?", a:"1. Heat a known mass of hydrated salt to constant mass to remove all water.\n2. Calculate moles of anhydrous salt and moles of water lost.\n3. Find the ratio moles water : moles salt to get the formula (e.g. CuSO₄·5H₂O)."},
  ]},
  "3.1.3": { title: "Bonding", cards: [
    {q:"Describe ionic bonding and the structure of an ionic compound.", a:"Ionic bonds form by electron transfer from a metal to a non-metal, producing oppositely charged ions that attract each other electrostatically. The ions pack into a regular giant ionic lattice. Ionic compounds have high melting points, are brittle, and conduct electricity only when molten or in aqueous solution."},
    {q:"Describe covalent bonding.", a:"A covalent bond is a shared pair of electrons between two non-metal atoms. The mutual attraction of both nuclei to the shared electrons holds the atoms together. Covalent bonds can be single, double, or triple."},
    {q:"What is a dative (coordinate) covalent bond?", a:"A dative bond is a covalent bond in which both electrons in the shared pair come from the same atom. Once formed, it is identical to an ordinary covalent bond. Example: NH₄⁺ (the H⁺ accepts both electrons from the N lone pair)."},
    {q:"Describe metallic bonding.", a:"In metallic bonding, positive metal ions (cations) are arranged in a regular lattice surrounded by a 'sea' of delocalised electrons. The electrostatic attraction between the cations and the mobile electrons gives metals their characteristic properties: high electrical and thermal conductivity, malleability, and ductility."},
    {q:"Define electronegativity and describe its periodic trends.", a:"Electronegativity (Pauling scale) is the ability of a bonded atom to attract the shared electron pair towards itself.\nAcross a period: increases (more protons, similar shielding, smaller atomic radius).\nDown a group: decreases (more electron shells, greater shielding, larger atomic radius).\nFluorine is the most electronegative element (4.0)."},
    {q:"What makes a bond polar, and when does a polar molecule result?", a:"A bond is polar when two atoms of different electronegativity share electrons unequally; the more electronegative atom carries a δ− charge. A molecule is polar if the individual bond dipoles do not cancel due to the molecular shape. Example: water (bent shape) is polar; CO₂ (linear, equal dipoles opposite) is non-polar."},
    {q:"State VSEPR theory and how it predicts molecular shapes.", a:"Electron pairs around a central atom repel each other and arrange to be as far apart as possible. Lone pairs repel more strongly than bonding pairs. The molecular shape is determined by the number of bonding pairs (BP) and lone pairs (LP)."},
    {q:"Give the shapes and bond angles for molecules with 2–6 electron pairs and no lone pairs.", a:"2 BP: linear, 180°\n3 BP: trigonal planar, 120°\n4 BP: tetrahedral, 109.5°\n5 BP: trigonal bipyramidal, 90°/120°\n6 BP: octahedral, 90°"},
    {q:"How does the presence of lone pairs affect bond angles? Give examples.", a:"Each lone pair reduces bond angles by approximately 2–2.5° compared to the all-bonding-pair arrangement.\nNH₃: 3 BP + 1 LP → trigonal pyramidal, 107°\nH₂O: 2 BP + 2 LP → bent/V-shaped, 104.5°"},
    {q:"What are London (instantaneous dipole-induced dipole) forces and what factors affect their strength?", a:"London forces arise from temporary, instantaneous dipoles caused by uneven electron distribution in one molecule, which induce a dipole in a neighbouring molecule. Strength increases with: larger molecules (more electrons), greater Mr, and greater surface area of contact. All molecules experience London forces."},
    {q:"What are permanent dipole–dipole interactions?", a:"Permanent dipole–dipole forces act between polar molecules. The δ+ end of one molecule attracts the δ− end of a neighbouring molecule. They are stronger than London forces for molecules of similar size."},
    {q:"What conditions are required for hydrogen bonding?", a:"Hydrogen bonding occurs when a hydrogen atom bonded to a highly electronegative atom (N, O, or F) is attracted to a lone pair on an N, O, or F atom in a neighbouring molecule. It is the strongest type of intermolecular force."},
    {q:"Why does water have anomalously high boiling point and why is ice less dense than water?", a:"Water molecules form up to four hydrogen bonds per molecule, requiring more energy to separate than expected for its small Mr, giving a high boiling point (100°C). In ice, molecules adopt a more open, hexagonal lattice with maximum H-bonding, so ice occupies more volume and is less dense than liquid water."},
    {q:"Compare giant ionic, giant covalent, giant metallic, and simple molecular structures.", a:"Giant ionic: high mp/bp, brittle, conducts when molten/dissolved.\nGiant covalent: very high mp/bp (e.g. SiO₂, diamond), hard, non-conducting (except graphite).\nGiant metallic: high mp/bp (varies), conducts, malleable.\nSimple molecular: low mp/bp, non-conducting; strength of intermolecular forces determines bp."},
    {q:"Why does diamond have a very high melting point while iodine melts at a much lower temperature?", a:"Diamond has a giant covalent structure where each carbon forms four strong C–C covalent bonds in a tetrahedral network — vast amounts of energy are needed to break these. Iodine (I₂) consists of discrete molecules held together only by weak London forces, so little energy is needed to separate them."},
    {q:"How does bond length relate to bond strength?", a:"Shorter bonds are generally stronger. Going from C–C (single) to C=C (double) to C≡C (triple), bond length decreases and bond enthalpy increases. This is because more shared electrons increase the attractive force pulling the nuclei together."},
  ]},
  "3.1.4": { title: "Energetics", cards: [
    {q:"What is enthalpy change (ΔH) and what are its standard conditions?", a:"Enthalpy change is the heat energy exchanged between a system and its surroundings at constant pressure. Standard conditions are 298 K, 100 kPa, and solutions at 1 mol dm⁻³. Standard enthalpy changes are denoted ΔH°."},
    {q:"Define standard enthalpy of formation (ΔHf°).", a:"The enthalpy change when one mole of a compound is formed from its constituent elements in their standard states under standard conditions. By definition, ΔHf° for any element in its standard state = 0 kJ mol⁻¹."},
    {q:"Define standard enthalpy of combustion (ΔHc°).", a:"The enthalpy change when one mole of a substance is completely burned in excess oxygen under standard conditions. Combustion enthalpies are always negative (exothermic)."},
    {q:"What is standard enthalpy of neutralisation, and what is the typical value for a strong acid and strong base?", a:"The enthalpy change when one mole of water is formed from the neutralisation of an acid with a base under standard conditions. For strong acid + strong base: approximately −57 kJ mol⁻¹ because the same ionic equation H⁺(aq) + OH⁻(aq) → H₂O(l) always applies."},
    {q:"State Hess's law and explain its basis.", a:"Hess's law states that the total enthalpy change for a chemical reaction is independent of the pathway taken, provided the initial and final conditions are the same. It is a consequence of conservation of energy."},
    {q:"How do you apply Hess's law using standard enthalpies of formation?", a:"ΔHr° = Σ ΔHf°(products) − Σ ΔHf°(reactants)\nMultiply each ΔHf° by the stoichiometric coefficient in the balanced equation."},
    {q:"How do you apply Hess's law using standard enthalpies of combustion?", a:"ΔHr° = Σ ΔHc°(reactants) − Σ ΔHc°(products)\nNote: this is the reverse of the formation equation — combustion data uses reactants minus products."},
    {q:"What is the calorimetry equation and what do each symbol represent?", a:"q = m c ΔT\nq = heat transferred (J), m = mass of water or solution (g), c = specific heat capacity (4.18 J g⁻¹ K⁻¹ for water), ΔT = temperature change (°C or K)."},
    {q:"How is molar enthalpy change calculated from a calorimetry experiment?", a:"1. Calculate q = m c ΔT.\n2. Determine moles of the substance causing the temperature change.\n3. ΔH = −q / n (divide by 1000 for kJ mol⁻¹). The sign is negative for exothermic."},
    {q:"Why is the experimental enthalpy of combustion always less exothermic than the data book value?", a:"Significant heat is lost to the surroundings, the calorimeter, and the air. Incomplete combustion also means less energy is released per mole. The experiment is not at standard conditions."},
    {q:"Define mean bond enthalpy.", a:"Mean bond enthalpy is the average energy required to break one mole of a specific type of bond, averaged across a range of different compounds in which that bond appears. All bond breaking is endothermic."},
    {q:"How is ΔH estimated using mean bond enthalpies?", a:"ΔH ≈ Σ(bond enthalpies of bonds broken) − Σ(bond enthalpies of bonds formed)\nBreaking bonds requires energy (+ve); forming bonds releases energy (−ve)."},
    {q:"Why are ΔH values calculated from mean bond enthalpies only approximate?", a:"Mean bond enthalpies are averages taken from many different compounds. The actual bond enthalpy in a specific molecule may differ from the average, so the calculated ΔH is not exact."},
    {q:"What is an energy profile diagram and what does it show for exothermic and endothermic reactions?", a:"An energy profile shows reactants and products on an enthalpy axis plotted against reaction progress. For exothermic reactions, products are lower than reactants (ΔH < 0). For endothermic, products are higher (ΔH > 0). The activation energy Ea is the energy difference between reactants and the peak of the curve."},
    {q:"What is the enthalpy change of solution and how does it compare to lattice enthalpy and hydration enthalpy?", a:"Enthalpy of solution is the enthalpy change when 1 mol of solid dissolves in excess water to form an infinitely dilute solution. ΔHsol = ΔHlatt(dissociation) + Σ ΔHhyd. If hydration enthalpy outweighs lattice enthalpy, dissolution is exothermic."},
  ]},
  "3.1.5": { title: "Kinetics", cards: [
    {q:"State collision theory and what conditions must be met for a successful collision.", a:"Reaction requires particles to collide with (a) sufficient energy (at least equal to the activation energy Ea) and (b) the correct orientation. Most collisions are unsuccessful because particles lack enough energy or approach at the wrong angle."},
    {q:"Define activation energy.", a:"Activation energy (Ea) is the minimum energy that colliding particles must possess for a reaction to occur. It corresponds to the energy needed to break bonds and form the transition state."},
    {q:"Describe the Maxwell-Boltzmann distribution curve (label axes and key features).", a:"X-axis: kinetic energy; Y-axis: number of molecules with that energy.\nThe curve starts at the origin (no molecules have zero energy), rises to a peak (most probable energy), then falls asymptotically (a few molecules always have very high energies). The area under the curve = total number of molecules."},
    {q:"How does increasing temperature affect the Maxwell-Boltzmann distribution and reaction rate?", a:"The peak shifts to higher energy and becomes lower and broader (total area unchanged). A significantly larger proportion of molecules now have energy ≥ Ea, so the frequency of successful collisions increases greatly, increasing the reaction rate."},
    {q:"How does increasing concentration or pressure increase reaction rate?", a:"More particles are present in the same volume, so collisions are more frequent. More frequent collisions means more successful collisions per unit time, increasing the rate."},
    {q:"How does increasing surface area increase reaction rate for a solid reactant?", a:"Breaking the solid into smaller pieces exposes more reactant particles at the surface, giving reactant molecules in solution or gas phase a greater area to collide with. This increases the frequency of collisions."},
    {q:"What is a catalyst and how does it affect activation energy and the energy profile?", a:"A catalyst is a substance that increases the rate of reaction without being consumed overall. It provides an alternative reaction pathway with a lower activation energy. On the energy profile, the peak is lower. ΔH is unchanged."},
    {q:"How does a catalyst affect the Maxwell-Boltzmann distribution curve?", a:"The distribution is unchanged (temperature is constant), but the new lower Ea is shown as a vertical line shifted to the left on the curve. A much larger proportion of molecules now have energy ≥ Ea (catalysed), so more successful collisions occur."},
    {q:"Distinguish between homogeneous and heterogeneous catalysts, giving one example of each.", a:"Homogeneous: catalyst and reactants are in the same phase. Example: Fe²⁺/Fe³⁺ ions catalysing the reaction between iodide and peroxodisulfate ions (both in aqueous solution).\nHeterogeneous: catalyst and reactants are in different phases. Example: iron (solid) in the Haber process with gaseous N₂ and H₂."},
    {q:"Explain how a heterogeneous catalyst works at the atomic level.", a:"Reactant molecules adsorb onto the catalyst surface at active sites. This brings them into close contact and may weaken bonds, lowering Ea. Products then desorb, freeing the active sites."},
    {q:"What is catalyst poisoning?", a:"Catalyst poisoning occurs when impurities in the reaction mixture adsorb strongly and permanently onto the active sites of the catalyst, blocking them and reducing catalytic activity. Example: sulfur poisoning the iron catalyst in the Haber process."},
    {q:"What is the role of the catalytic converter in a car exhaust system?", a:"Platinum and rhodium catalysts convert toxic exhaust gases: CO + NO → CO₂ + ½N₂. Unburned hydrocarbons are also oxidised to CO₂ and H₂O. The heterogeneous catalysts are on a honeycomb structure to maximise surface area."},
  ]},
  "3.1.6": { title: "Equilibria", cards: [
    {q:"What is a dynamic equilibrium and what conditions are required?", a:"A dynamic equilibrium exists in a closed system when the rate of the forward reaction equals the rate of the reverse reaction, so the macroscopic concentrations of reactants and products remain constant. Both reactions are still occurring at equal rates."},
    {q:"State Le Chatelier's principle.", a:"If a system at dynamic equilibrium is subjected to a change in conditions, the equilibrium position will shift in the direction that opposes the change and tends to restore equilibrium."},
    {q:"How does increasing the concentration of a reactant affect equilibrium position?", a:"The system shifts to the right (towards products) to reduce the concentration of the added reactant, increasing the yield of products."},
    {q:"How does changing pressure affect a gaseous equilibrium?", a:"Increasing pressure shifts the equilibrium towards the side with fewer moles of gas to reduce pressure.\nDecreasing pressure shifts it towards the side with more moles of gas."},
    {q:"How does temperature affect equilibrium position?", a:"Increasing temperature shifts the equilibrium in the endothermic direction, favouring that reaction to absorb the added heat.\nDecreasing temperature shifts it in the exothermic direction."},
    {q:"What effect does a catalyst have on the equilibrium position?", a:"A catalyst has no effect on the position of equilibrium or the yield. It increases the rates of both forward and reverse reactions equally, so equilibrium is reached more quickly."},
    {q:"Write the Kc expression for aA + bB ⇌ cC + dD.", a:"Kc = [C]^c [D]^d / ([A]^a [B]^b)\nConcentrations are in mol dm⁻³ and are raised to the power of their stoichiometric coefficients. Kc only changes with temperature."},
    {q:"What does the magnitude of Kc indicate about the position of equilibrium?", a:"Kc >> 1: equilibrium lies to the right, products predominate.\nKc << 1: equilibrium lies to the left, reactants predominate.\nKc ≈ 1: significant amounts of both reactants and products at equilibrium."},
    {q:"What are the conditions and compromise rationale for the Haber process?", a:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ mol⁻¹\nConditions: ~450°C (compromise — lower T gives better yield but too slow; catalyst needed), 200 atm, iron catalyst.\nLower T would give more NH₃ but unacceptably slow rate; higher P would give more NH₃ but is too costly and dangerous."},
    {q:"What are the conditions and compromise rationale for the Contact process?", a:"2SO₂(g) + O₂(g) ⇌ 2SO₃(g)  ΔH = −197 kJ mol⁻¹\nConditions: ~450°C, 1–2 atm, V₂O₅ catalyst.\nLow pressure is used because the yield is already high (~99.5%) without the cost of high pressure. Temperature is a compromise between yield (lower T favoured) and rate."},
    {q:"How does a change in temperature affect the value of Kc?", a:"Temperature is the only factor that changes Kc. For an exothermic forward reaction, increasing temperature shifts equilibrium left, decreasing Kc. For an endothermic forward reaction, increasing temperature increases Kc."},
    {q:"Why does adding an inert gas at constant volume not affect equilibrium?", a:"Adding an inert gas at constant volume does not change the concentration (or partial pressure) of any reactant or product, so the equilibrium position is unaffected."},
  ]},
  "3.1.7": { title: "Redox", cards: [
    {q:"Define oxidation and reduction in terms of electron transfer (OIL RIG).", a:"OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain of electrons.\nA substance that loses electrons is oxidised; a substance that gains electrons is reduced."},
    {q:"Define oxidising agent and reducing agent.", a:"Oxidising agent: accepts electrons from another species and is itself reduced.\nReducing agent: donates electrons to another species and is itself oxidised."},
    {q:"State the rules for assigning oxidation states.", a:"1. Uncombined element: 0\n2. Simple monatomic ion: equal to its charge\n3. H in compounds: +1 (except metal hydrides where it is −1)\n4. O in compounds: −2 (except peroxides where it is −1; OF₂ where it is +2)\n5. Sum of oxidation states in a neutral compound = 0; in an ion = charge of the ion."},
    {q:"What is the oxidation state of Mn in MnO₄⁻ and Cr in Cr₂O₇²⁻?", a:"MnO₄⁻: let Mn = x; x + 4(−2) = −1 → x = +7\nCr₂O₇²⁻: let Cr = x; 2x + 7(−2) = −2 → x = +6"},
    {q:"What is disproportionation? Give one example.", a:"Disproportionation is a redox reaction in which the same element is simultaneously oxidised and reduced.\nExample: Cl₂ + H₂O ⇌ HCl + HClO — chlorine goes from 0 to −1 (in HCl, reduced) and 0 to +1 (in HClO, oxidised)."},
    {q:"Describe the steps for writing a half-equation.", a:"1. Write the species being oxidised or reduced.\n2. Balance atoms other than H and O.\n3. Balance O atoms by adding H₂O molecules.\n4. Balance H atoms by adding H⁺ ions.\n5. Balance charge by adding electrons to the more positive side."},
    {q:"How do you combine two half-equations into an overall ionic equation?", a:"1. Multiply each half-equation to make the number of electrons equal.\n2. Add the two equations together.\n3. Cancel electrons and simplify (cancel any species appearing on both sides)."},
    {q:"Write the half-equations and overall equation for the reaction between iron(II) ions and acidified permanganate.", a:"Oxidation: Fe²⁺ → Fe³⁺ + e⁻ (×5)\nReduction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O\nOverall: MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺"},
    {q:"How can oxidation states be used to identify what has been oxidised and what has been reduced?", a:"Identify each element's oxidation state in reactants and products. An increase in oxidation state means that element has been oxidised; a decrease means it has been reduced."},
    {q:"What is the reaction between sodium bromide and concentrated sulfuric acid, and is it redox?", a:"NaBr + H₂SO₄ → NaHSO₄ + HBr (acid-base, not redox).\nHBr can then reduce H₂SO₄ to SO₂: 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O — this is redox (Br⁻ oxidised from −1 to 0)."},
    {q:"How are oxidation states used to name ionic compounds?", a:"The oxidation state of the metal is given in Roman numerals in brackets. E.g. Fe²⁺ compound = iron(II); Fe³⁺ = iron(III); MnO₄⁻ = manganate(VII) because Mn is +7."},
  ]},
  "3.1.8": { title: "Thermodynamics", cards: [
    {q:"Define lattice enthalpy (dissociation) and state its sign.", a:"Lattice enthalpy of dissociation is the enthalpy change when 1 mole of an ionic solid is converted into its constituent gaseous ions under standard conditions. It is always endothermic (positive), because bonds must be broken."},
    {q:"What two factors determine the magnitude of lattice enthalpy?", a:"1. Ionic charge: higher charges on the ions give a larger lattice enthalpy (stronger electrostatic attraction).\n2. Ionic radius: smaller ions give a larger lattice enthalpy (ions are closer together, stronger attraction)."},
    {q:"List all the steps included in a Born-Haber cycle for NaCl.", a:"1. Atomisation of Na: Na(s) → Na(g)\n2. First ionisation energy of Na: Na(g) → Na⁺(g) + e⁻\n3. Atomisation of Cl₂: ½Cl₂(g) → Cl(g)\n4. First electron affinity of Cl: Cl(g) + e⁻ → Cl⁻(g)\n5. Lattice formation enthalpy: Na⁺(g) + Cl⁻(g) → NaCl(s)\nHess's law connects all steps to ΔHf°(NaCl)."},
    {q:"Define enthalpy of atomisation.", a:"Enthalpy of atomisation is the enthalpy change when 1 mole of gaseous atoms is formed from the element in its standard state. It is always endothermic. Example: ½Cl₂(g) → Cl(g)."},
    {q:"Define first electron affinity and explain why first electron affinity is usually exothermic but second is endothermic.", a:"First EA: Cl(g) + e⁻ → Cl⁻(g); exothermic because the incoming electron is attracted to the nuclear charge.\nSecond EA (e.g. O⁻ + e⁻ → O²⁻): endothermic because the electron must overcome the repulsion from the already negatively charged ion."},
    {q:"When does the experimental (Born-Haber) lattice enthalpy differ from the theoretical (ionic model) value, and what does this mean?", a:"If the experimental lattice enthalpy (from Born-Haber) is more exothermic than the theoretical value (from purely ionic model), the compound has some covalent character. The degree of covalent character increases with higher charge and smaller cation (greater polarising power)."},
    {q:"Define enthalpy of hydration.", a:"Enthalpy of hydration is the enthalpy change when 1 mole of gaseous ions is dissolved in an excess of water to give aqueous ions under standard conditions. It is always exothermic (water molecules are attracted to the ions)."},
    {q:"How is enthalpy of solution related to lattice enthalpy and hydration enthalpies?", a:"ΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion)\nIf ΔHhyd exceeds the lattice enthalpy, ΔHsol is negative (exothermic, salt dissolves readily)."},
    {q:"Define entropy (S) and give its units.", a:"Entropy is a quantitative measure of the disorder or randomness in a system. Units: J K⁻¹ mol⁻¹. A higher entropy value means more disorder."},
    {q:"Describe factors that increase entropy.", a:"1. Change of state from solid → liquid → gas (large entropy increase for solid → gas).\n2. Dissolving a solid in a liquid.\n3. Reactions that produce more moles of gas than the reactants.\n4. Mixing of substances."},
    {q:"How is entropy change for a reaction calculated?", a:"ΔS°reaction = Σ S°(products) − Σ S°(reactants)\nMultiply each S° value by the stoichiometric coefficient. Units: J K⁻¹ mol⁻¹."},
    {q:"State the Gibbs free energy equation and define each term.", a:"ΔG = ΔH − TΔS\nΔG = Gibbs free energy change (kJ mol⁻¹), ΔH = enthalpy change (kJ mol⁻¹), T = temperature (K), ΔS = entropy change (kJ K⁻¹ mol⁻¹ — convert from J K⁻¹ mol⁻¹ by ÷1000)."},
    {q:"When is a reaction thermodynamically feasible?", a:"A reaction is feasible (spontaneous) when ΔG ≤ 0. If ΔG < 0, the reaction can proceed. If ΔG > 0, the reaction is not feasible under those conditions."},
    {q:"Why can an endothermic reaction still be feasible?", a:"If the entropy increase (TΔS) is large enough to outweigh the positive ΔH, then ΔG = ΔH − TΔS can still be negative. This is especially true at high temperatures."},
    {q:"How do you find the temperature at which a reaction becomes feasible?", a:"Set ΔG = 0 and solve for T:\nT = ΔH / ΔS\nAbove this temperature (for endothermic reactions with positive ΔS), the reaction becomes feasible."},
    {q:"Does a negative ΔG guarantee a reaction will occur?", a:"No. ΔG < 0 tells us the reaction is thermodynamically feasible (energetically favourable), but it says nothing about the rate. If the activation energy is very high, the reaction may still be extremely slow in practice."},
  ]},
  "3.1.9": { title: "Rate Equations", cards: [
    {q:"What is a rate equation and how is it determined?", a:"A rate equation expresses the rate of reaction as a function of reactant concentrations: rate = k[A]^m [B]^n. The orders m and n must be determined experimentally — they cannot be deduced from the stoichiometric equation."},
    {q:"Define zero, first, and second order with respect to a reactant.", a:"Zero order: rate is independent of that reactant's concentration.\nFirst order: rate is directly proportional to that reactant's concentration.\nSecond order: rate is proportional to the square of that reactant's concentration."},
    {q:"What is the overall order of reaction?", a:"The overall order is the sum of the individual orders for each reactant: overall order = m + n. The units of k depend on the overall order."},
    {q:"What are the units of the rate constant k for zero, first, and second order reactions?", a:"Zero order: mol dm⁻³ s⁻¹\nFirst order: s⁻¹\nSecond order: mol⁻¹ dm³ s⁻¹"},
    {q:"How can you determine orders of reaction using the initial rates method?", a:"Run several experiments varying only one reactant concentration at a time. Compare how the initial rate changes:\nIf doubling [A] has no effect: zero order. Doubles rate: first order. Quadruples rate: second order."},
    {q:"What does a concentration-time graph look like for zero, first, and second order reactions?", a:"Zero order: straight line decreasing (constant rate of decrease).\nFirst order: exponential decay (constant half-life).\nSecond order: curved, falls more steeply than first order at first, then slowly."},
    {q:"What does a rate-concentration graph look like for zero, first, and second order reactions?", a:"Zero order: horizontal line (rate independent of concentration).\nFirst order: straight line through the origin (rate ∝ concentration).\nSecond order: upward-curving parabola (rate ∝ [concentration]²)."},
    {q:"Define half-life and describe it for a first order reaction.", a:"Half-life (t½) is the time for the concentration of a reactant to fall to half its initial value. For a first order reaction, the half-life is constant (independent of concentration) and t½ = ln 2 / k ≈ 0.693 / k."},
    {q:"What is the rate-determining step?", a:"The rate-determining step (RDS) is the slowest step in a multi-step reaction mechanism. It controls the overall rate. The species appearing in the rate equation must all be present in the RDS (or in steps before it)."},
    {q:"How does the rate equation provide evidence for a reaction mechanism?", a:"The rate equation identifies which species affect the rate. These must be involved in the RDS or earlier steps. A proposed mechanism is only valid if the RDS is consistent with the experimentally determined rate equation."},
    {q:"State the Arrhenius equation and explain how it relates k to temperature.", a:"k = A exp(−Ea/RT)\nwhere k = rate constant, A = Arrhenius pre-exponential factor (related to collision frequency and geometry), Ea = activation energy (J mol⁻¹), R = 8.314 J K⁻¹ mol⁻¹, T = temperature in K. As T increases, k increases exponentially."},
    {q:"How is the Arrhenius equation linearised and what graph is plotted?", a:"Taking natural logarithms: ln k = ln A − Ea/RT.\nPlot ln k (y-axis) against 1/T (x-axis).\nGradient = −Ea/R, so Ea = −gradient × R.\ny-intercept = ln A."},
    {q:"How do you use the Arrhenius equation to calculate Ea given rate constants at two temperatures?", a:"ln(k₂/k₁) = (Ea/R) × (1/T₁ − 1/T₂)\nRearrange to find Ea. Make sure temperatures are in K."},
  ]},
  "3.1.10": { title: "Kp", cards: [
    {q:"What is Kp and how does it differ from Kc?", a:"Kp is the equilibrium constant expressed in terms of partial pressures of gaseous species, whereas Kc uses molar concentrations. Kp is used when all reactants and products are gases."},
    {q:"How is mole fraction calculated?", a:"Mole fraction of component A = moles of A / total moles of all gases present."},
    {q:"How is partial pressure calculated?", a:"Partial pressure of A = mole fraction of A × total pressure of the mixture.\nThe sum of all partial pressures equals the total pressure."},
    {q:"Write the Kp expression for the equilibrium: N₂(g) + 3H₂(g) ⇌ 2NH₃(g).", a:"Kp = (p_NH₃)² / (p_N₂ × (p_H₂)³)\nPartial pressures are raised to the power of their stoichiometric coefficients."},
    {q:"What are the units of Kp and how do you determine them?", a:"The units of Kp depend on the equation. Determine by substituting units of pressure (Pa or kPa) into the Kp expression and cancelling. If Δn(gas) = 0, Kp has no units."},
    {q:"What is the only factor that changes the value of Kp?", a:"Temperature. Changing pressure or adding a catalyst does not change Kp. Temperature shifts the equilibrium position and changes Kp."},
    {q:"How does temperature affect Kp for an exothermic reaction?", a:"Increasing temperature shifts the equilibrium to the left (endothermic direction), decreasing the proportion of products and decreasing the value of Kp."},
    {q:"What does Δn represent in the relationship Kp = Kc(RT)^Δn?", a:"Δn is the change in moles of gas: Δn = moles of gaseous products − moles of gaseous reactants. This relationship is only important conceptually; AQA mainly requires Kp calculations from scratch."},
    {q:"How do you calculate Kp when given initial amounts and equilibrium conversion?", a:"1. Calculate moles at equilibrium.\n2. Find total moles of gas.\n3. Calculate mole fractions.\n4. Multiply mole fractions by total pressure to get partial pressures.\n5. Substitute into Kp expression."},
    {q:"How does pressure affect the position of equilibrium in a gaseous reaction but not Kp?", a:"Increasing pressure shifts equilibrium towards fewer moles of gas (Le Chatelier's), changing the partial pressures of reactants and products, but the ratio that defines Kp remains unchanged — only temperature alters Kp."},
    {q:"For the Contact process, SO₂(g) + ½O₂(g) ⇌ SO₃(g), write the Kp expression.", a:"Kp = p_SO₃ / (p_SO₂ × (p_O₂)^½)\nUnits = Pa / (Pa × Pa^½) = Pa^(−½) or equivalent in kPa."},
  ]},
  "3.1.11": { title: "Electrode Potentials", cards: [
    {q:"What is a standard electrode potential (E°)?", a:"The potential of a half-cell measured against the standard hydrogen electrode under standard conditions (298 K, 1 mol dm⁻³ ion concentration, 100 kPa). It quantifies the tendency of a species to be reduced."},
    {q:"Describe the standard hydrogen electrode.", a:"A platinum electrode immersed in 1.00 mol dm⁻³ H⁺(aq) with H₂ gas bubbled in at 100 kPa and 298 K. The half-equation is: 2H⁺(aq) + 2e⁻ ⇌ H₂(g). By definition, E° = 0.00 V."},
    {q:"How is the EMF of an electrochemical cell calculated?", a:"E°cell = E°(cathode, more positive) − E°(anode, more negative)\nThe more positive electrode is the cathode (reduction occurs there); the more negative is the anode (oxidation)."},
    {q:"How is the feasibility of a reaction predicted from electrode potentials?", a:"A reaction is feasible (thermodynamically) if E°cell > 0. The more positive the E°cell, the more likely the reaction is to occur spontaneously."},
    {q:"What is the purpose of the salt bridge in an electrochemical cell?", a:"The salt bridge (e.g. filter paper soaked in saturated KNO₃ solution) allows ions to flow between the two half-cells, maintaining electrical neutrality without the electrolytes mixing. KNO₃ is used because it does not interfere with the electrode reactions."},
    {q:"Write the conventional cell notation for a Zn/Zn²⁺ || Cu²⁺/Cu cell.", a:"Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)\nSingle lines = phase boundaries; double line = salt bridge. Anode (oxidation) on the left, cathode (reduction) on the right."},
    {q:"What does a more positive E° value indicate about a species?", a:"A more positive E° means the species has a greater tendency to be reduced (it is a stronger oxidising agent). A more negative E° means the species is a better reducing agent."},
    {q:"Give two limitations when predicting feasibility from electrode potentials.", a:"1. Standard conditions are rarely met; non-standard concentrations or temperatures will affect E values.\n2. Even if E°cell > 0, the reaction may be very slow due to high activation energy (kinetic limitation).\nAlso: overpotential effects can prevent reactions that appear feasible."},
    {q:"Describe a hydrogen-oxygen fuel cell and write the electrode half-equations.", a:"Anode (oxidation): H₂ − 2e⁻ → 2H⁺ (acidic) or H₂ + 2OH⁻ − 2e⁻ → 2H₂O (alkaline)\nCathode (reduction): ½O₂ + 2H⁺ + 2e⁻ → H₂O (acidic)\nOverall: H₂ + ½O₂ → H₂O\nThe only product is water; continuous fuel supply is needed."},
    {q:"What are the advantages and disadvantages of hydrogen fuel cells compared to combustion engines?", a:"Advantages: only product is water (no CO₂ at point of use), higher efficiency than combustion, no recharging needed.\nDisadvantages: H₂ is explosive, costly to produce and store, currently mostly made from fossil fuels (not truly carbon-neutral), fuel cell infrastructure limited."},
    {q:"How does the standard electrode potential series allow prediction of which species can oxidise which?", a:"Any species in the series will oxidise any species below it (i.e. with a more negative E°). Species with more positive E° are stronger oxidising agents; species with more negative E° are stronger reducing agents."},
    {q:"Why is platinum used as the electrode in the standard hydrogen electrode?", a:"Platinum is chemically inert (does not react with the acid or H₂) and provides a conducting surface on which the H⁺/H₂ equilibrium can be established. It catalyses the interconversion."},
  ]},
  "3.1.12": { title: "Acids & Bases", cards: [
    {q:"Define a Brønsted-Lowry acid and base, and give an example of a conjugate pair.", a:"Brønsted-Lowry acid: proton (H⁺) donor.\nBrønsted-Lowry base: proton (H⁺) acceptor.\nConjugate acid-base pair: differ by one H⁺. E.g. CH₃COOH / CH₃COO⁻ — the acid donates H⁺ to form its conjugate base."},
    {q:"Distinguish between strong and weak acids, giving examples.", a:"Strong acid: fully dissociates in water. Examples: HCl, HNO₃, H₂SO₄, HBr, HI.\nWeak acid: only partially dissociates; equilibrium lies to the left. Examples: CH₃COOH, HF, carbonic acid."},
    {q:"Define pH and how to calculate it for a strong acid.", a:"pH = −log₁₀[H⁺]\nFor a strong acid, [H⁺] = concentration of the acid (complete dissociation).\nE.g. 0.10 mol dm⁻³ HCl: pH = −log(0.10) = 1.0"},
    {q:"What is Ka and how is pH of a weak acid calculated using it?", a:"Ka = [H⁺][A⁻] / [HA] (units: mol dm⁻³)\nAssumption: [H⁺] = [A⁻] and [HA]equilibrium ≈ [HA]initial (small dissociation).\n[H⁺] = √(Ka × [HA])\npH = −log[H⁺]"},
    {q:"Define pKa and explain its relationship to acid strength.", a:"pKa = −log₁₀(Ka)\nA stronger acid has a larger Ka and a smaller pKa. A weaker acid has a smaller Ka and a larger pKa."},
    {q:"What is Kw and what is its value at 298 K?", a:"Kw is the ionic product of water: Kw = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴ mol² dm⁻⁶ at 298 K.\nIn pure water at 298 K: [H⁺] = [OH⁻] = 1.00 × 10⁻⁷ mol dm⁻³, so pH = 7."},
    {q:"How do you calculate the pH of a strong base?", a:"For a strong base (e.g. NaOH), [OH⁻] = concentration of base.\nUse Kw to find [H⁺]: [H⁺] = Kw / [OH⁻]\nThen pH = −log[H⁺]."},
    {q:"What is a buffer solution and how does it resist pH change?", a:"A buffer is a solution that resists changes in pH when small amounts of acid or alkali are added. It contains a weak acid (HA) and its conjugate base (A⁻, from the sodium salt).\nAdding H⁺: A⁻ + H⁺ → HA (base component reacts).\nAdding OH⁻: HA + OH⁻ → A⁻ + H₂O (acid component reacts)."},
    {q:"Give two ways to prepare an acidic buffer solution.", a:"1. Mix a weak acid with a solution of its sodium salt (e.g. CH₃COOH with CH₃COONa).\n2. Mix a weak acid with a limited amount of strong base — the base partially neutralises the acid to form the conjugate base salt."},
    {q:"State the Henderson-Hasselbalch equation and use it to calculate buffer pH.", a:"pH = pKa + log([A⁻]/[HA])\nAt half-neutralisation: [A⁻] = [HA], so log(1) = 0, therefore pH = pKa.\nUse this to find the pKa of the acid or the ratio of buffer components needed."},
    {q:"Why must an indicator be chosen to match the equivalence point of a titration?", a:"An indicator changes colour over a range of ~2 pH units around its pKa. The endpoint (colour change) must fall within the steep pH jump at the equivalence point to give an accurate result. E.g. phenolphthalein (changes 8.2–10) is suitable for strong acid/strong base but NOT weak acid/strong base."},
    {q:"Describe the shape of a pH titration curve for: (a) strong acid/strong base, (b) weak acid/strong base.", a:"(a) Strong/strong: starts low (acidic), large sharp jump at equivalence point (~pH 7), ends high (alkaline).\n(b) Weak/strong: starts higher (weak acid), buffer region (flatter curve), equivalence point above pH 7 (conjugate base is alkaline), sharp jump smaller."},
    {q:"Give the biological importance of buffer solutions.", a:"Blood is maintained at pH 7.35–7.45 by the carbonic acid/hydrogen carbonate buffer: H₂CO₃ ⇌ H⁺ + HCO₃⁻. A change of even 0.5 pH units can be fatal. Cells also contain phosphate buffers."},
    {q:"How does temperature affect Kw and the neutral pH?", a:"Water's autoionisation is endothermic. Increasing temperature shifts the equilibrium right, increasing Kw. A larger Kw means a lower pH for pure water (e.g. pH ≈ 6.8 at 37°C). However, the solution remains neutral because [H⁺] still equals [OH⁻] — neutrality does not require pH = 7."},
  ]},

  "ocr_3.1.1": { title: "Periodicity", cards: [
    {q:"Describe the trend in melting points across Period 3 and explain it.", a:"Na, Mg, Al: increasing mp (stronger metallic bonding — more delocalised e⁻, higher ionic charge).\nSi: very high mp (giant covalent structure).\nP₄, S₈, Cl₂, Ar: decreasing mp (simple molecular, LDFs decrease: S₈ largest → Ar monatomic lowest).\nGeneral pattern: metallic → giant covalent → simple molecular."},
    {q:"Describe the electrical conductivity of Period 3 elements.", a:"Na, Mg, Al: good electrical conductors (delocalised electrons in metallic lattice carry charge).\nSi: semiconductor (electrical conductivity between metals and insulators — basis of transistors).\nP, S, Cl, Ar: non-conductors (no delocalised electrons; simple molecular or monatomic)."},
    {q:"Describe the reactions of Period 3 elements with oxygen.", a:"Na: 4Na + O₂ → 2Na₂O (yellow flame)\nMg: 2Mg + O₂ → 2MgO (intense white flame, very exothermic)\nAl: 4Al + 3O₂ → 2Al₂O₃ (burns if powdered; oxide layer passivates in bulk)\nSi: Si + O₂ → SiO₂ (slow; requires high temperature)\nP: P₄ + 5O₂ → P₄O₁₀ (white smoke, excess O₂); also P₄O₆ with limited O₂\nS: S + O₂ → SO₂ (blue flame); can further oxidise to SO₃"},
    {q:"Describe the acid/base nature of Period 3 oxides and their reactions with water.", a:"Na₂O: basic; Na₂O + H₂O → 2NaOH (strongly alkaline)\nMgO: basic; MgO + H₂O → Mg(OH)₂ (weakly alkaline)\nAl₂O₃: amphoteric; reacts with HCl and NaOH\nSiO₂: acidic; does not dissolve in water; reacts with hot conc NaOH: SiO₂ + 2NaOH → Na₂SiO₃ + H₂O\nP₄O₁₀: acidic; P₄O₁₀ + 6H₂O → 4H₃PO₄\nSO₃: strongly acidic; SO₃ + H₂O → H₂SO₄"},
    {q:"What is the amphoteric nature of Al₂O₃? Give equations.", a:"Al₂O₃ reacts with both acids and bases (amphoteric).\nWith dilute acid: Al₂O₃ + 6HCl(aq) → 2AlCl₃(aq) + 3H₂O(l)\nWith dilute alkali: Al₂O₃ + 2NaOH(aq) + 3H₂O → 2Na[Al(OH)₄](aq)\nThis dual behaviour reflects the borderline position of Al between metallic and non-metallic character."},
    {q:"Describe the reactions of Period 3 chlorides with water.", a:"NaCl: dissolves to give neutral solution (Na⁺ + Cl⁻ simply dissociate)\nMgCl₂: dissolves to give slightly acidic solution\nAlCl₃: vigorous hydrolysis → acidic solution + steamy HCl fumes: AlCl₃ + 3H₂O → Al(OH)₃ + 3HCl\nSiCl₄: complete hydrolysis: SiCl₄ + 2H₂O → SiO₂ + 4HCl (steamy fumes)\nPCl₃: PCl₃ + 3H₂O → H₃PO₃ + 3HCl (fumes)\nPCl₅: PCl₅ + 4H₂O → H₃PO₄ + 5HCl (fumes)"},
    {q:"Explain why NaCl dissolves neutrally but AlCl₃ gives an acidic solution.", a:"NaCl is fully ionic; Na⁺ and Cl⁻ have no tendency to react with water.\nAlCl₃ has significant covalent character: Al³⁺ has high charge density and coordinates water ligands [Al(H₂O)₆]³⁺.\nThe highly polarising Al³⁺ weakens O−H bonds in coordinated water → protons released → acidic solution.\nThe smaller and more highly charged the metal ion, the more acidic the solution."},
    {q:"Describe the trend in atomic radius across Period 3.", a:"Atomic radius decreases from Na to Cl (Ar is excluded — monatomic with no covalent radius).\nNa has the largest radius; Cl the smallest of the bonded elements.\nReason: nuclear charge increases (11 to 17 protons) while electrons are added to the same 3rd shell (shielding stays roughly constant) → effective nuclear charge increases → electrons pulled closer."},
    {q:"Describe the trend in electronegativity across Period 3.", a:"Electronegativity increases from Na (0.9) to Cl (3.0).\nReason: nuclear charge increases → stronger attraction for bonding electrons; atomic radius decreases → bonding electrons closer to nucleus.\nAr has no electronegativity (does not form bonds).\nNa and Mg are low → ionic bonding with non-metals; Si–Cl is polar covalent; Cl–Cl is non-polar covalent."},
    {q:"How do the ionisation energies change across Period 3, including anomalies?", a:"Generally increase from Na to Ar (greater nuclear charge, similar shielding).\nAnomaly 1: Al < Mg — Al's outer 3p electron is higher energy than Mg's 3s electron.\nAnomaly 2: S < P — S's 4th 3p electron pairs in an orbital, experiencing extra electron-electron repulsion.\nThese anomalies are evidence for 3s and 3p subshells."},
    {q:"What is the difference in structure between NaCl and SiCl₄ in the solid state and in solution?", a:"NaCl: giant ionic lattice; dissolves in water to give Na⁺(aq) and Cl⁻(aq) — neutral solution.\nSiCl₄: simple molecular (tetrahedral, covalent); reacts vigorously with water (hydrolysis) rather than simply dissolving: SiCl₄ + 2H₂O → SiO₂ + 4HCl\nKey difference: ionic vs covalent bonding determines behaviour with water."},
    {q:"Give the formula and acid/base nature of the oxides of Na, Mg, Al, Si, P, S.", a:"Na₂O: basic\nMgO: basic\nAl₂O₃: amphoteric\nSiO₂: weakly acidic\nP₄O₁₀: acidic (forms H₃PO₄)\nSO₂: acidic (forms H₂SO₃)\nSO₃: acidic (forms H₂SO₄)\nAcid/base nature changes from basic (left) to acidic (right) across Period 3."},
    {q:"What is the structure of white phosphorus (P₄) and how does it affect its properties?", a:"White phosphorus consists of P₄ molecules — tetrahedral with each P bonded to 3 others (bond angles 60°, very strained).\nSimple molecular structure → low melting point, soluble in non-polar solvents.\nThe strained bonds make P₄ very reactive.\nBy contrast, silicon has a giant covalent structure → very high melting point."},
    {q:"Explain why sodium oxide reacts with water to form a strongly alkaline solution while SiO₂ does not.", a:"Na₂O is an ionic compound (Na⁺ and O²⁻).\nO²⁻ acts as a base: O²⁻ + H₂O → 2OH⁻ → strongly alkaline (high pH).\nSiO₂ is a giant covalent network solid with very strong Si−O bonds throughout the lattice.\nIt does not dissolve in water at room temperature — the lattice energy is too high to be overcome by hydration."},
    {q:"What happens when Period 3 chlorides (AlCl₃, SiCl₄) are added to water — describe observations.", a:"AlCl₃: vigorous reaction producing white fumes (HCl gas), white precipitate or acidic solution forms.\nSiCl₄: violent hydrolysis, steamy fumes of HCl, white solid SiO₂ may form; strongly acidic solution/fumes.\nPCl₃/PCl₅: similar violent hydrolysis with HCl fumes.\nAll contrast with NaCl (gentle dissolution, no fumes) and MgCl₂ (dissolves to give slightly acidic solution)."},
  ]},

  "ocr_3.1.2": { title: "Group 2 — The Alkaline Earth Metals", cards: [
    {q:"State the electronic configurations of Group 2 elements and how they form ions.", a:"Be: [He] 2s²; Mg: [Ne] 3s²; Ca: [Ar] 4s²; Sr: [Kr] 5s²; Ba: [Xe] 6s²\nAll lose both s² electrons to form M²⁺ ions.\nReactivity increases down the group as it becomes easier to lose these 2 electrons (lower IE, larger radius, more shielding)."},
    {q:"Describe the trend in atomic/ionic radius down Group 2.", a:"Both atomic and ionic radii increase down Group 2 (Be < Mg < Ca < Sr < Ba).\nReason: each element has an additional electron shell → outer electrons further from nucleus.\nIncreased electron shielding also reduces effective nuclear charge felt by outer electrons."},
    {q:"Describe the trend in first ionisation energy down Group 2.", a:"First IE decreases down Group 2 (Be > Mg > Ca > Sr > Ba).\nReason: atomic radius increases, more electron shielding from inner shells → outer 2 electrons are less strongly attracted to the nucleus → easier to remove."},
    {q:"Why does reactivity of Group 2 metals increase down the group?", a:"Reactivity depends on the ease of losing the two s² electrons (forming M²⁺).\nDown the group: atomic radius increases, more shielding → lower IE₁ and IE₂ → electrons more easily lost.\nBarium reacts more vigorously with water and air than magnesium."},
    {q:"Describe the reactions of Group 2 metals with water.", a:"Be: no reaction with water or steam.\nMg: very slow with cold water; faster with steam: Mg + H₂O → MgO + H₂\nCa: vigorous with cold water: Ca + 2H₂O → Ca(OH)₂ + H₂\nSr: more vigorous: Sr + 2H₂O → Sr(OH)₂ + H₂\nBa: vigorous: Ba + 2H₂O → Ba(OH)₂ + H₂\nProducts are M(OH)₂ + H₂ (except Mg with steam → MgO)."},
    {q:"Describe the reactions of Group 2 metals with oxygen.", a:"All react with O₂ to form ionic oxides MO.\n2Mg + O₂ → 2MgO (burns with intense white flame)\n2Ca + O₂ → 2CaO\nBa can also form the peroxide BaO₂ with excess oxygen.\nGroup 2 oxides are basic ionic solids with high melting points."},
    {q:"Describe the reactions of Group 2 metals with dilute acids.", a:"M + 2HCl → MCl₂ + H₂ (all react, releasing hydrogen gas)\nM + H₂SO₄ → MSO₄ + H₂ (but reaction slows for Ca, Sr, Ba because MSO₄ is sparingly/insoluble and coats the metal)\nReactivity increases down the group — Ba reacts more vigorously than Mg."},
    {q:"Describe the trend in solubility of Group 2 hydroxides down the group.", a:"Solubility increases down Group 2:\nBe(OH)₂: virtually insoluble\nMg(OH)₂: sparingly soluble (~9×10⁻⁴ mol dm⁻³)\nCa(OH)₂: slightly soluble (limewater)\nSr(OH)₂: moderately soluble\nBa(OH)₂: soluble\nSolutions become increasingly alkaline (higher pH) down the group."},
    {q:"Describe the trend in solubility of Group 2 sulfates down the group.", a:"Solubility of sulfates decreases down Group 2:\nMgSO₄: very soluble (Epsom salts)\nCaSO₄: sparingly soluble\nSrSO₄: insoluble\nBaSO₄: essentially insoluble (~10⁻⁵ mol dm⁻³)\nThis trend is opposite to that of hydroxides. BaSO₄ is used in barium meal X-rays."},
    {q:"What is the thermal stability trend in Group 2 carbonates and explain it.", a:"Thermal stability increases down Group 2: MgCO₃ decomposes most easily; BaCO₃ requires highest temperature.\nReason: smaller cations (e.g. Mg²⁺) have higher charge density → greater ability to polarise the carbonate ion → weakens C−O bond → easier decomposition.\nLarger cations (Ba²⁺) have lower charge density → less polarisation → carbonate more stable."},
    {q:"Give the equation for thermal decomposition of calcium carbonate.", a:"CaCO₃(s) → CaO(s) + CO₂(g)\nΔH positive (endothermic — energy needed to break C−O bond in carbonate).\nThis reaction occurs in lime kilns at ~900°C.\nCaO (quicklime) is an important industrial material used in cement and steel making."},
    {q:"Describe uses of Group 2 compounds in medicine and industry.", a:"Mg(OH)₂: antacid (neutralises excess stomach acid), laxative.\nCa(OH)₂: liming of acidic soils (agriculture), water treatment (softening), building materials.\nCaSO₄ (gypsum/plaster of Paris): building, dental casts.\nBaSO₄: barium meal (X-ray imaging) — safe because insoluble (Ba²⁺ ions not released).\nMgO: refractory materials (high-temperature furnace linings)."},
    {q:"Why is BaSO₄ safe to swallow as a barium meal if Ba²⁺ is toxic?", a:"BaSO₄ is essentially insoluble in water and in stomach acid.\nBecause it does not dissolve, Ba²⁺ ions are not released into the bloodstream → not toxic.\nBaSO₄ is opaque to X-rays and passes safely through the GI tract, providing a clear outline of the digestive organs on X-ray."},
    {q:"What is the test for sulfate ions and why is the reagent acidified?", a:"Add dilute HCl (acidify) followed by BaCl₂(aq).\nPositive result: white precipitate of BaSO₄, insoluble in dilute HCl.\nAcidification removes CO₃²⁻ and SO₃²⁻ ions (they would also give white ppts with Ba²⁺) → eliminates false positives."},
    {q:"Write the equations for the reactions of MgO and CaO with water.", a:"MgO + H₂O → Mg(OH)₂ (slow, slight exothermic, slightly alkaline solution)\nCaO + H₂O → Ca(OH)₂ (exothermic, 'slaking of lime', more alkaline solution)\nBoth produce alkaline hydroxide solutions.\nCa(OH)₂ solution (limewater) is used to test for CO₂."},
  ]},

  "ocr_3.1.3": { title: "The Halogens", cards: [
    {q:"Describe the physical state and colour of the halogens at room temperature.", a:"F₂: pale yellow gas\nCl₂: yellow-green gas\nBr₂: red-brown liquid (volatile, dense vapour)\nI₂: grey-black solid (sublimes to violet/purple vapour on heating)\nBoiling points increase down the group due to stronger London dispersion forces."},
    {q:"Explain why boiling points increase from F₂ to I₂.", a:"All halogens are simple diatomic molecules (X₂) held together by London dispersion forces (LDFs).\nLDFs increase with number of electrons and molecular size: I₂ has 106 electrons vs F₂ with 18.\nMore electrons → stronger instantaneous dipoles → stronger LDFs → more energy needed to vaporise → higher boiling point."},
    {q:"Describe the trend in oxidising ability of halogens and explain it.", a:"Oxidising ability decreases: F₂ > Cl₂ > Br₂ > I₂\nOxidising power = ability to accept electrons (be reduced).\nDown the group: atomic radius increases, more electron shielding → incoming electron experiences less attraction from the nucleus → weaker oxidising agent.\nF₂ is the strongest oxidising agent (only achieves −1 oxidation state)."},
    {q:"Describe the halogen displacement reactions and what they demonstrate.", a:"Cl₂(aq) + 2Br⁻(aq) → 2Cl⁻(aq) + Br₂(aq) — solution turns orange/brown\nCl₂(aq) + 2I⁻(aq) → 2Cl⁻(aq) + I₂(aq) — solution turns brown (I₂ orange in water, purple in hexane)\nBr₂(aq) + 2I⁻(aq) → 2Br⁻(aq) + I₂(aq) — solution turns brown\nI₂ cannot displace Cl⁻ or Br⁻ (weaker oxidising agent).\nDemonstrates: Cl₂ > Br₂ > I₂ in oxidising power."},
    {q:"Describe the disproportionation of Cl₂ with water.", a:"Cl₂(g) + H₂O(l) ⇌ HCl(aq) + HClO(aq)\nChlorine goes from 0 to −1 (in HCl, reduced) and 0 to +1 (in HClO, oxidised) — simultaneously oxidised and reduced.\nThis is disproportionation.\nHClO (hypochlorous acid) is a weak acid with bleaching/disinfecting properties."},
    {q:"Describe the reaction of Cl₂ with NaOH and give its commercial application.", a:"Cl₂(g) + 2NaOH(aq) → NaCl(aq) + NaClO(aq) + H₂O(l)\nIonic equation: Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O\nProduct NaClO (sodium hypochlorite) is the active ingredient in household bleach.\nThis is also disproportionation (Cl₂ → Cl⁻ and ClO⁻)."},
    {q:"Describe the use of chlorine in water treatment.", a:"Chlorine is added to drinking water and swimming pools to kill bacteria and other microorganisms.\nCl₂ reacts with water to form HClO, which is bactericidal (kills bacteria by disrupting cell membranes and enzymes).\nBenefits: eliminates waterborne diseases (cholera, typhoid).\nRisks: Cl₂ is toxic; reacts with organic matter to form trihalomethanes (potential carcinogens); taste/odour issues."},
    {q:"Describe the tests for Cl⁻, Br⁻, and I⁻ using silver nitrate solution.", a:"Add acidified AgNO₃(aq) (acidified with dilute HNO₃ to remove interfering ions):\nCl⁻: white precipitate AgCl — dissolves in dilute NH₃(aq)\nBr⁻: cream precipitate AgBr — dissolves only in concentrated NH₃(aq)\nI⁻: yellow precipitate AgI — insoluble in both dilute and concentrated NH₃(aq)"},
    {q:"Describe the trend in reducing ability of halide ions (X⁻).", a:"Reducing ability: I⁻ > Br⁻ > Cl⁻ >> F⁻\nReducing ability = ease of losing electrons (being oxidised).\nDown the group: ionic radius increases, more shielding → outer electrons less tightly held → easier to lose → better reducing agent.\nF⁻ cannot act as a reducing agent (F is the most electronegative element)."},
    {q:"Compare the reactions of NaCl, NaBr, and NaI with concentrated H₂SO₄.", a:"NaCl: NaCl + H₂SO₄ → NaHSO₄ + HCl↑ (white fumes of HCl; no redox; Cl⁻ too weak reductant to reduce H₂SO₄)\nNaBr: produces HBr, which reduces H₂SO₄: 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O (orange fumes Br₂ + choking SO₂)\nNaI: HI produced reduces H₂SO₄ fully: HI → I₂ (black) + H₂S (rotten egg smell) + S (yellow solid) + SO₂"},
    {q:"What is the reducing agent in the reaction of NaI with concentrated H₂SO₄?", a:"HI (hydrogen iodide) is the reducing agent.\nHI reduces H₂SO₄ (+6) through several steps:\n→ SO₂ (+4): 2HI + H₂SO₄ → I₂ + SO₂ + 2H₂O\n→ S (0): 6HI + H₂SO₄ → 3I₂ + S + 4H₂O\n→ H₂S (−2): 8HI + H₂SO₄ → 4I₂ + H₂S + 4H₂O\nI⁻ is the strongest reducing halide ion."},
    {q:"Why does the rate of reaction between halogens and hydrogen decrease down the group?", a:"H₂ + F₂ → 2HF: explosive even in the dark\nH₂ + Cl₂ → 2HCl: explosive in UV light\nH₂ + Br₂ → 2HBr: only at high temperature with a catalyst\nH₂ + I₂ → 2HI: slow, incomplete, reversible\nTrend: bond enthalpy of H−X decreases down the group (H−F strongest) → activation energy increases → rate decreases."},
    {q:"How is the solubility of iodine in different solvents used in displacement reactions?", a:"I₂ is slightly soluble in water (orange/brown colour).\nI₂ is much more soluble in non-polar organic solvents such as hexane or cyclohexane (purple/violet colour).\nIn displacement reactions, add hexane to the reaction mixture and shake: if I₂ is present, it partitions into the organic (upper) layer giving a purple colour.\nThis confirms a displacement has occurred."},
    {q:"Describe the industrial uses of chlorine.", a:"Water treatment: kills pathogens (bacteria, viruses).\nManufacture of PVC (poly(chloroethene)) — a major plastic.\nProduction of bleach (NaClO from Cl₂ + NaOH).\nManufacture of solvents, pesticides, pharmaceuticals.\nChlorine is produced by electrolysis of brine (NaCl solution) — the chlor-alkali industry."},
    {q:"What observation would you make when Cl₂ is bubbled into potassium iodide solution?", a:"The colourless KI solution turns brown/orange (iodine liberated in aqueous solution).\nOn addition of hexane and shaking, the organic layer turns purple/violet (I₂ more soluble in hexane).\nStarch solution would turn blue-black (confirmatory test for I₂).\nEquation: Cl₂ + 2KI → 2KCl + I₂"},
  ]},

  "ocr_3.1.4": { title: "Qualitative Analysis", cards: [
    {q:"What colour does Li⁺ produce in a flame test?", a:"Crimson/red. Clean the nichrome wire with concentrated HCl and check it gives no colour before testing. Li⁺ gives a vivid crimson-red flame."},
    {q:"What colour does Na⁺ produce in a flame test?", a:"Persistent yellow/orange. Even trace amounts of Na⁺ contamination give a strong yellow flame. Use cobalt blue glass to mask the Na yellow when testing for K⁺. Always clean the wire thoroughly."},
    {q:"What colour does K⁺ produce in a flame test?", a:"Lilac/violet. The lilac colour can be masked by Na⁺ contamination — view through cobalt blue glass (which absorbs yellow) to confirm K⁺."},
    {q:"What colour does Ca²⁺ produce in a flame test?", a:"Brick-red/orange-red. Calcium gives a distinctive brick-red or orange-red flame, similar to but less vivid than strontium."},
    {q:"What colour does Sr²⁺ produce in a flame test?", a:"Crimson (deeper/more vivid than Ca²⁺). Strontium gives a rich crimson flame, distinct from the brick-red of calcium."},
    {q:"What colour does Ba²⁺ produce in a flame test?", a:"Apple green. Barium is the only common metal to give a green flame. Memory tip: Ba = Bright (apple) green."},
    {q:"What colour does Cu²⁺ produce in a flame test?", a:"Blue-green/turquoise. Copper gives a distinctive blue-green or turquoise flame. It also gives a blue precipitate with NaOH and a deep blue solution with excess NH₃."},
    {q:"Describe the NaOH test for transition metal cations (Cu²⁺, Fe²⁺, Fe³⁺).", a:"Add NaOH(aq) dropwise then in excess:\nCu²⁺: blue precipitate of Cu(OH)₂ — insoluble in excess NaOH.\nFe²⁺: green precipitate of Fe(OH)₂ — insoluble in excess; darkens to brown on standing in air (oxidised to Fe³⁺).\nFe³⁺: red-brown precipitate of Fe(OH)₃ — insoluble in excess.\nNone of these dissolve in excess NaOH."},
    {q:"Describe the NaOH test for Ca²⁺, Mg²⁺, Al³⁺, and Zn²⁺ — and how to distinguish them.", a:"Add NaOH(aq) dropwise then in excess:\nCa²⁺: white precipitate — insoluble in excess NaOH.\nMg²⁺: white precipitate — insoluble in excess NaOH.\nAl³⁺: white precipitate — DISSOLVES in excess NaOH → [Al(OH)₄]⁻ (amphoteric).\nZn²⁺: white precipitate — DISSOLVES in excess NaOH → [Zn(OH)₄]²⁻ (amphoteric).\nKey distinction: Al³⁺ and Zn²⁺ dissolve; Ca²⁺ and Mg²⁺ do not."},
    {q:"How do you test for the NH₄⁺ ion?", a:"Add NaOH(aq) and warm gently.\nAmmonia gas is released: NH₄⁺ + OH⁻ → NH₃(g) + H₂O\nTest with damp red litmus paper → turns blue (NH₃ is alkaline).\nAlternatively: the pungent smell of ammonia is characteristic.\nAlways confirm with damp red litmus paper."},
    {q:"How do you test for carbonate ions (CO₃²⁻)?", a:"Add dilute hydrochloric acid:\nCO₃²⁻ + 2H⁺ → H₂O + CO₂(g)\nObservation: effervescence (bubbling).\nConfirm CO₂: bubble gas through limewater [Ca(OH)₂(aq)] → milky white precipitate of CaCO₃.\nCaO(s) + CO₂(g) → CaCO₃(s)"},
    {q:"How do you test for sulfate ions (SO₄²⁻)?", a:"Acidify with dilute HCl (to remove CO₃²⁻ and SO₃²⁻ which give false positives), then add BaCl₂(aq).\nPositive test: white precipitate of BaSO₄, insoluble in dilute HCl.\nBa²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)"},
    {q:"How do you test for halide ions (Cl⁻, Br⁻, I⁻)?", a:"Acidify with dilute HNO₃ (removes CO₃²⁻, SO₃²⁻ interfering ions), then add AgNO₃(aq):\nCl⁻: white ppt AgCl → dissolves in dilute NH₃\nBr⁻: cream ppt AgBr → dissolves only in concentrated NH₃\nI⁻: yellow ppt AgI → insoluble in dilute and concentrated NH₃"},
    {q:"Describe the tests for the gases: H₂, O₂, CO₂, NH₃, Cl₂, HCl.", a:"H₂: lit splint → squeaky pop (ignites)\nO₂: glowing splint → relights\nCO₂: limewater → milky white ppt\nNH₃: damp red litmus → turns blue; pungent smell\nCl₂: damp blue litmus → turns red then bleaches white\nHCl: glass rod dipped in conc NH₃ → dense white fumes (NH₄Cl)"},
    {q:"What is the confirmatory test for iodide ions beyond AgNO₃?", a:"After adding acidified AgNO₃ to give a yellow precipitate:\nConfirmation: the yellow precipitate of AgI is insoluble in both dilute and concentrated ammonia solution.\nThis distinguishes I⁻ (yellow ppt, insoluble in NH₃) from Br⁻ (cream ppt, dissolves in concentrated NH₃) and Cl⁻ (white ppt, dissolves in dilute NH₃)."},
    {q:"How do you distinguish between Al³⁺ and Ca²⁺ or Mg²⁺ ions by NaOH addition?", a:"All three give a white precipitate with NaOH(aq).\nAdd excess NaOH:\nAl³⁺: white precipitate dissolves in excess NaOH → colourless solution ([Al(OH)₄]⁻)\nCa²⁺ and Mg²⁺: white precipitate does NOT dissolve in excess NaOH.\nThis dissolving in excess alkali (amphoteric behaviour) is diagnostic for Al³⁺ and Zn²⁺."},
    {q:"Describe the test for iron(II) ions (Fe²⁺) and how to distinguish from Fe³⁺.", a:"Add NaOH(aq):\nFe²⁺: green precipitate [Fe(OH)₂]\nFe³⁺: red-brown precipitate [Fe(OH)₃]\nThe green Fe(OH)₂ precipitate may darken/turn red-brown on standing in air as Fe²⁺ is oxidised to Fe³⁺ by O₂.\nThis colour change (green → red-brown) is also evidence that Fe²⁺ is present."},
    {q:"How do you test for nitrate ions (NO₃⁻)?", a:"Add aluminium foil (or Devarda's alloy) with NaOH(aq) and heat.\nNO₃⁻ is reduced to NH₃ (ammonia): NO₃⁻ + 8[H] → NH₃ + 2H₂O + OH⁻\nDetect NH₃ with damp red litmus → turns blue.\nAlternatively: adding Fe²⁺ and concentrated H₂SO₄ gives a brown ring test (Fe(NO)²⁺ complex) — but this is less commonly required at A-level."},
    {q:"Why must solutions be acidified with HNO₃ (not HCl or H₂SO₄) before testing for halides?", a:"HCl would introduce Cl⁻ ions → give a false positive for chloride.\nH₂SO₄ would introduce SO₄²⁻ ions → could interfere with other tests.\nHNO₃ does not introduce any ions that would form precipitates with Ag⁺, so it is the correct acid for acidifying before halide testing."},
    {q:"What observations confirm the presence of Cu²⁺ ions in solution?", a:"1. Blue colour of solution ([Cu(H₂O)₆]²⁺)\n2. Flame test: blue-green/turquoise flame\n3. Add NaOH: blue precipitate of Cu(OH)₂, insoluble in excess NaOH.\n4. Add excess NH₃: blue precipitate initially, then dissolves to give deep blue solution ([Cu(NH₃)₄(H₂O)₂]²⁺)."},
    {q:"How do you test for the presence of water and confirm that water is pure?", a:"Test for water presence: add anhydrous CuSO₄ (white) → turns blue if water present; or blue cobalt chloride paper → turns pink.\nConfirm purity: measure boiling point (pure water = exactly 100°C at 1 atm) and freezing point (exactly 0°C).\nImpure water: boils above 100°C (dissolved solutes raise bp) and freezes below 0°C."},
    {q:"What precipitate does Cr³⁺ form with NaOH, and what is distinctive about it?", a:"Cr³⁺ + NaOH(aq) → grey-green precipitate of Cr(OH)₃.\nDistinctive feature: Cr(OH)₃ is AMPHOTERIC — it dissolves in excess NaOH to give a green solution of [Cr(OH)₄]⁻ (or [Cr(OH)₆]³⁻).\nCr(OH)₃ also dissolves in excess NH₃ to give violet [Cr(NH₃)₆]³⁺.\nThis distinguishes Cr³⁺ from Fe³⁺ (red-brown ppt, insoluble in both excess NaOH and NH₃)."},
    {q:"What precipitate does Co²⁺ form with NaOH, and how does it behave with excess NH₃?", a:"Co²⁺ + NaOH(aq) → blue/green precipitate of Co(OH)₂.\nThe precipitate does NOT dissolve in excess NaOH.\nWith excess NH₃: Co(OH)₂ dissolves to give straw/yellow [Co(NH₃)₆]²⁺, which oxidises in air to brown [Co(NH₃)₆]³⁺.\nThis distinguishes Co²⁺ from Fe²⁺ (green ppt with NaOH, insoluble in excess NH₃)."},
    {q:"What precipitate does Mn²⁺ form with NaOH?", a:"Mn²⁺ + NaOH(aq) → cream/pale buff precipitate of Mn(OH)₂.\nThe precipitate does NOT dissolve in excess NaOH.\nOn standing in air: cream Mn(OH)₂ slowly darkens to brown as Mn²⁺ is oxidised to higher oxidation states (MnO(OH) or MnO₂).\nDistinguishes Mn²⁺ from Cu²⁺ (blue ppt), Fe²⁺ (green ppt), Fe³⁺ (red-brown ppt)."},
  ]},

  "ocr_3.2.1": { title: "Enthalpy Changes", cards: [
    {q:"Define enthalpy change ΔH and state standard conditions.", a:"Enthalpy change ΔH is the heat energy exchanged between system and surroundings at constant pressure.\nExothermic: ΔH < 0 (energy released to surroundings).\nEndothermic: ΔH > 0 (energy absorbed from surroundings).\nStandard conditions: 298 K (25°C), 100 kPa, concentrations at 1 mol dm⁻³. Denoted ΔH°."},
    {q:"Define standard enthalpy of combustion and standard enthalpy of formation.", a:"ΔHc° (combustion): enthalpy change when 1 mol of substance undergoes complete combustion in excess O₂ under standard conditions. Always exothermic (negative).\nΔHf° (formation): enthalpy change when 1 mol of compound is formed from its elements in their standard states under standard conditions. ΔHf° of any element = 0."},
    {q:"State Hess's law and explain how it is used.", a:"Hess's law: the total enthalpy change for a reaction is independent of the pathway taken, provided initial and final conditions are the same (conservation of energy).\nUse: ΔHr° = ΣΔHf°(products) − ΣΔHf°(reactants)\nOr construct a thermochemical cycle and apply Hess's law to find an unknown ΔH."},
    {q:"How do you use standard enthalpies of combustion to find ΔHr°?", a:"ΔHr° = ΣΔHc°(reactants) − ΣΔHc°(products)\nNote the reverse relationship compared to formation enthalpies.\nUsed when combustion data is available but formation data is not (common in organic chemistry).\nConstruct a cycle: reactants → CO₂/H₂O ← products."},
    {q:"State the calorimetry equation and define each term.", a:"q = mcΔT\nq = heat energy (J), m = mass of solution/water (g), c = specific heat capacity (4.18 J g⁻¹ K⁻¹ for water), ΔT = temperature change (K or °C).\nΔH = −q/n (negative because exothermic releases heat to solution)\nDivide by 1000 to convert J to kJ."},
    {q:"Describe sources of error in calorimetry experiments.", a:"1. Heat loss to surroundings and calorimeter (most significant).\n2. Incomplete combustion (in spirit lamp experiments).\n3. Evaporation of flammable liquid (fuel loss before combustion).\n4. Assuming density of solution = 1 g cm⁻³ and c = 4.18 J g⁻¹ K⁻¹ (approximations).\n5. Temperature measured after mixing, not at exact moment of mixing.\nAll lead to calculated ΔH being less exothermic than true value."},
    {q:"Define mean bond enthalpy and explain how to calculate ΔHr using bond enthalpies.", a:"Mean bond enthalpy: average energy to break 1 mol of a specific bond type across many different compounds.\nΔHr ≈ Σ(bonds broken) − Σ(bonds formed)\nBond breaking: endothermic (+)\nBond forming: exothermic (−)\nResult is approximate because mean values are averages, not exact for a specific molecule."},
    {q:"Why are ΔH values calculated from mean bond enthalpies only approximate?", a:"Mean bond enthalpies are averages taken across many different compounds.\nThe actual bond enthalpy in any specific molecule differs slightly from the average.\nFor example, the C−H bond enthalpy in CH₄ differs from C−H in CH₃Cl.\nCalculations assume all molecules are gaseous (standard states may differ).\nResult: calculated ΔH may differ from experimental value by 10–20%."},
    {q:"What is activation energy and how is it shown on an energy profile diagram?", a:"Activation energy Ea: minimum energy that colliding particles must possess for a reaction to occur.\nOn an energy profile: vertical distance from reactants to the peak (transition state).\nExothermic: products are lower than reactants; ΔH = products − reactants (negative).\nA catalyst provides an alternative pathway with a lower peak (lower Ea) but the same ΔH."},
    {q:"Calculate ΔH for the combustion of methane using bond enthalpies.", a:"CH₄ + 2O₂ → CO₂ + 2H₂O\nBonds broken: 4(C−H) + 2(O=O) = 4(413) + 2(498) = 1652 + 996 = 2648 kJ\nBonds formed: 2(C=O) + 4(O−H) = 2(805) + 4(464) = 1610 + 1856 = 3466 kJ\nΔH ≈ 2648 − 3466 = −818 kJ mol⁻¹\n(Literature value: −890 kJ mol⁻¹ — difference due to mean bond enthalpies)"},
    {q:"What is the standard enthalpy of neutralisation for a strong acid + strong base?", a:"Approximately −57 kJ mol⁻¹ for any strong acid + strong base.\nReason: the reaction is always H⁺(aq) + OH⁻(aq) → H₂O(l) for strong acid/base pairs.\nFor weak acid + strong base: less exothermic (energy absorbed to dissociate weak acid).\nFor strong acid + weak base: similarly, less exothermic."},
    {q:"Define the enthalpy of solution and its components.", a:"Enthalpy of solution ΔHsol: enthalpy change when 1 mol of solute dissolves in excess solvent to give an infinitely dilute solution.\nΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion)\nIf ΔHhyd values overcome lattice enthalpy → exothermic solution (ΔHsol negative).\nIf lattice enthalpy dominates → endothermic dissolution."},
    {q:"What is the enthalpy of hydration and what determines its magnitude?", a:"Enthalpy of hydration ΔHhyd: enthalpy change when 1 mol of gaseous ions dissolves in water to give aqueous ions.\nAlways exothermic (water dipoles attracted to ions).\nMagnitude increases with: higher ionic charge, smaller ionic radius (higher charge density → stronger ion-dipole interaction).\nExamples: Mg²⁺ (−1891 kJ mol⁻¹) >> Na⁺ (−406 kJ mol⁻¹)"},
    {q:"Describe a coffee-cup calorimetry experiment to measure the enthalpy of neutralisation.", a:"1. Measure 50 cm³ of 1.0 mol dm⁻³ NaOH into polystyrene cup, record temperature.\n2. Measure 50 cm³ of 1.0 mol dm⁻³ HCl, record temperature.\n3. Mix, stir, record maximum temperature reached.\n4. ΔT = T_max − T_initial; q = m c ΔT (m = total mass of solution ≈ 100 g).\n5. n = 0.050 mol (0.050 dm³ × 1.0 mol dm⁻³); ΔH = −q/n in kJ mol⁻¹."},
    {q:"How is an energy profile diagram drawn for an exothermic and endothermic reaction?", a:"x-axis: reaction coordinate (progress of reaction)\ny-axis: enthalpy/energy\nExothermic: reactants higher than products; ΔH negative; peak (transition state) above reactants by Ea.\nEndothermic: products higher than reactants; ΔH positive.\nWith catalyst: lower peak (same ΔH, smaller Ea, alternative pathway)."},
  ]},

  "ocr_3.2.2": { title: "Reaction Rates and Equilibrium", cards: [
    {q:"State collision theory and the conditions for a successful collision.", a:"For a reaction to occur, particles must:\n1. Collide with each other.\n2. Have kinetic energy ≥ activation energy Ea (sufficient energy).\n3. Collide with the correct orientation (for complex molecules).\nMost collisions are unsuccessful because most particles have energy below Ea."},
    {q:"Describe the Maxwell-Boltzmann distribution curve and label its key features.", a:"x-axis: kinetic energy (KE); y-axis: number of molecules with that energy.\nKey features:\n• Starts at origin (no molecules have zero KE)\n• Rises to a peak (most probable energy)\n• Long tail to the right (small number with very high energy)\n• Area under curve = total number of molecules\n• Mark Ea on x-axis: only molecules to the right of Ea can react"},
    {q:"How does increasing temperature affect the Maxwell-Boltzmann distribution and reaction rate?", a:"The distribution curve:\n• Peak shifts to higher energy and becomes lower (same area — same number of molecules)\n• Broader distribution\n• Much greater proportion of molecules have energy ≥ Ea\nEffect: frequency of successful collisions increases greatly → rate increases significantly.\nA 10°C rise approximately doubles the rate for many reactions."},
    {q:"How does increasing concentration increase reaction rate?", a:"Greater concentration means more particles per unit volume → more frequent collisions.\nAt higher concentration, the probability of two reactant particles being close enough to collide is greater.\nEffect: rate of successful collisions per unit time increases → rate increases.\nThis does NOT change Ea or the shape of the Maxwell-Boltzmann distribution."},
    {q:"How does a catalyst increase reaction rate?", a:"A catalyst provides an alternative reaction pathway with a lower activation energy Ea.\nOn the Maxwell-Boltzmann distribution: the same curve applies, but the new (lower) Ea means a much greater proportion of molecules have sufficient energy.\nEffect: much greater frequency of successful collisions → faster rate.\nCatalysts are not consumed in the reaction. ΔH is unchanged."},
    {q:"Distinguish between homogeneous and heterogeneous catalysts.", a:"Homogeneous catalyst: same phase as reactants (e.g. Fe²⁺/Fe³⁺ in aqueous solution catalysing I⁻ + S₂O₈²⁻).\nHeterogeneous catalyst: different phase from reactants (e.g. solid Fe catalyst with gaseous N₂/H₂ in Haber process; Pt/Pd in catalytic converters with gaseous exhaust).\nHeterogeneous catalysts work by adsorbing reactants onto the active surface."},
    {q:"State the conditions and compromise reasoning for the Haber process.", a:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ mol⁻¹\nConditions: ~450°C, 200 atm, iron catalyst.\nCompromise:\n• Low T would give better yield (exothermic → favours NH₃) but too slow.\n• High T gives faster rate but lower equilibrium yield.\n• 200 atm favours NH₃ (fewer gas moles on right) but costly/dangerous at higher pressures.\n• Iron catalyst increases rate without affecting equilibrium."},
    {q:"State the conditions for the Contact process and why these conditions are chosen.", a:"2SO₂(g) + O₂(g) ⇌ 2SO₃(g)  ΔH = −197 kJ mol⁻¹\nConditions: ~450°C, 1–2 atm, V₂O₅ catalyst.\nReasonings: low T would give higher yield but too slow; 450°C is a compromise.\nHigh pressure would favour products (3 moles gas → 2) but yield already ~99.5% at 1–2 atm → extra cost not justified.\nV₂O₅ (vanadium pentoxide) catalyst increases rate without affecting equilibrium."},
    {q:"Define dynamic equilibrium and state the conditions required.", a:"Dynamic equilibrium: in a closed system, the rate of the forward reaction equals the rate of the reverse reaction.\nMacroscopic concentrations remain constant — no apparent change.\nBoth reactions continue at the molecular level at equal rates.\nRequires: closed system (no matter added or removed), reversible reaction."},
    {q:"State Le Chatelier's principle and apply it to concentration changes.", a:"Le Chatelier's principle: if an equilibrium is disturbed by a change in conditions, the system shifts to oppose that change and restore equilibrium.\nConcentration: increase [reactant] → shift right (forward); increase [product] → shift left (reverse).\nDecreasing a concentration shifts equilibrium towards that component to replenish it."},
    {q:"How does pressure change affect gaseous equilibria?", a:"Increasing pressure: equilibrium shifts to the side with fewer moles of gas (to reduce pressure).\nDecreasing pressure: shifts to side with more moles of gas.\nIf equal moles of gas on both sides: pressure change has no effect on position.\nPressure has no effect if no gaseous species are involved."},
    {q:"How does temperature affect equilibrium position and the equilibrium constant?", a:"Temperature is the only factor that changes the value of the equilibrium constant Kc or Kp.\nEndothermic reaction: increase T → shift right → Kc increases.\nExothermic reaction: increase T → shift left (to absorb heat) → Kc decreases.\nA catalyst speeds up the attainment of equilibrium but does NOT change Kc or the position of equilibrium."},
    {q:"Write the Kc expression for N₂(g) + 3H₂(g) ⇌ 2NH₃(g) and explain what its magnitude means.", a:"Kc = [NH₃]² / ([N₂][H₂]³)    units: mol⁻² dm⁶\nKc >> 1: products predominate at equilibrium.\nKc << 1: reactants predominate.\nKc ≈ 1: significant amounts of both present.\nAt 500°C, Kc ≈ 6 × 10⁻² mol⁻² dm⁶ (reactants predominate — low conversion to NH₃)."},
    {q:"What is the effect of a catalyst on the equilibrium position and Kc?", a:"A catalyst has NO effect on:\n• The position of equilibrium (does not change concentrations at equilibrium).\n• The value of Kc (only temperature changes Kc).\n• ΔH or ΔG of the reaction.\nA catalyst increases the rates of both forward and reverse reactions equally → equilibrium is reached more quickly."},
    {q:"How does the industrial compromise in the Haber process illustrate Le Chatelier's principle?", a:"Yield favoured by: low temperature (exothermic → more NH₃), high pressure (fewer moles on right → more NH₃), removing NH₃ as it forms.\nRate favoured by: high temperature, catalyst.\nCompromise chosen: 450°C balances acceptable rate with acceptable yield; 200 atm provides sufficient yield without excessive engineering cost; Fe catalyst achieves acceptable rate at 450°C.\nNH₃ is continuously removed (liquefied) — shifts equilibrium right."},
  ]},

  // ═══════════════════════════════════════════════
  // INORGANIC CHEMISTRY (3.2)
  // ═══════════════════════════════════════════════

  "3.2.1": { title: "Periodicity", cards: [
    {q:"What is meant by periodicity in the periodic table?", a:"Periodicity refers to the repeating pattern of physical and chemical properties observed across each period of the periodic table, arising from the repeating pattern of electronic configurations."},
    {q:"Describe the trend in atomic radius across Period 3 and explain it.", a:"Atomic radius decreases from Na to Cl. The number of protons increases across the period, increasing nuclear charge, while electrons are added to the same shell (similar shielding). The stronger nuclear charge pulls the electrons closer to the nucleus."},
    {q:"Describe the general trend in first ionisation energy across Period 3 and explain it.", a:"First ionisation energy generally increases from Na to Ar. Nuclear charge increases, electron shielding stays roughly constant, and atomic radius decreases, so the outer electron is more strongly attracted."},
    {q:"Explain the anomaly in first ionisation energy between Mg (Group 2) and Al (Group 3).", a:"Al has a lower first IE than Mg. Aluminium's outer electron is in the 3p subshell (higher energy, more shielded by the full 3s²), whereas magnesium's is in 3s. It is therefore easier to remove Al's outer electron."},
    {q:"Explain the anomaly in first ionisation energy between P (Group 5) and S (Group 6).", a:"S has a lower first IE than P. In sulfur, the fourth 3p electron must pair in an already-occupied orbital. The electron–electron repulsion between paired electrons makes this electron easier to remove."},
    {q:"Explain the melting point trend across Period 3.", a:"Na, Mg, Al: metallic structures; melting point increases (Na⁺ < Mg²⁺ < Al³⁺, more delocalised electrons, stronger metallic bonding).\nSi: giant covalent structure, very high mp (~1414°C).\nP₄, S₈, Cl₂, Ar: simple molecular; melting points decrease sharply (S₈ largest/most Van der Waals; Ar monatomic/smallest)."},
    {q:"Why do Na, Mg, and Al have increasingly high melting points?", a:"All three have giant metallic structures. The charge on the metal ion increases (Na⁺, Mg²⁺, Al³⁺) and the number of delocalised electrons per atom increases, strengthening the electrostatic attraction between the ions and the electron sea."},
    {q:"Why does silicon have such a high melting point?", a:"Silicon has a giant covalent (macromolecular) structure in which each Si atom is covalently bonded to four others in a tetrahedral arrangement (similar to diamond). Breaking this requires enormous energy."},
    {q:"Why does the melting point order S₈ > P₄ > Cl₂ > Ar hold for the simple molecular elements?", a:"All four are simple molecular with only Van der Waals (London dispersion) forces between molecules. Larger molecules have more electrons, giving stronger London forces and higher melting points.\nS₈: 8 S atoms, 128 electrons per molecule — largest, strongest London forces, highest mp.\nP₄: 4 P atoms, 60 electrons — intermediate.\nCl₂: 2 Cl atoms, 34 electrons — smaller molecule, weaker forces.\nAr: monatomic, 18 electrons — weakest London forces, lowest mp."},
    {q:"Describe the reactions of sodium and magnesium with water.", a:"Na: vigorous reaction with cold water: 2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g); solution strongly alkaline, fizzing.\nMg: very slow reaction with cold water; reacts rapidly with steam: Mg(s) + H₂O(g) → MgO(s) + H₂(g)."},
    {q:"How does the oxide character change across Period 3?", a:"Na₂O and MgO are basic (react with acids). Al₂O₃ is amphoteric (reacts with both acids and alkalis). SiO₂ is weakly acidic. P₄O₁₀, SO₂, SO₃ are increasingly acidic and react with water to form acidic solutions."},
    {q:"What is electronegativity and how does it vary across Period 3?", a:"Electronegativity is the ability of a bonded atom to attract the shared electron pair. It increases from Na to Cl across Period 3 due to increasing nuclear charge and decreasing atomic radius (fluorine is the most electronegative element overall)."},
  ]},
  "3.2.2": { title: "Group 2", cards: [
    {q:"State the trends in atomic radius and first ionisation energy down Group 2.", a:"Atomic radius increases down the group (additional electron shell, more shielding, outer electrons further from nucleus).\nFirst ionisation energy decreases down the group (outer electron is further away and more shielded, so less energy is needed to remove it)."},
    {q:"Why does reactivity of Group 2 metals increase down the group?", a:"Going down the group, the outer two s electrons become easier to lose: the atomic radius increases, there is more electron shielding, and the nuclear attraction on the outer electrons decreases. This makes the metals more reactive."},
    {q:"Write equations for the reactions of magnesium with cold water and with steam.", a:"With cold water (slow): Mg(s) + 2H₂O(l) → Mg(OH)₂(aq) + H₂(g)\nWith steam (vigorous): Mg(s) + H₂O(g) → MgO(s) + H₂(g)"},
    {q:"Write a general equation for the reaction of a Group 2 metal with dilute acid.", a:"M(s) + 2HCl(aq) → MCl₂(aq) + H₂(g)\nAll Group 2 metals react vigorously with dilute acids, dissolving to form the M²⁺ salt and hydrogen gas."},
    {q:"Describe the trend in solubility of Group 2 hydroxides down the group and give an example.", a:"Solubility of hydroxides increases down Group 2: Mg(OH)₂ is sparingly soluble (gives slightly alkaline solution); Ca(OH)₂ is slightly soluble (limewater); Sr(OH)₂ and Ba(OH)₂ are increasingly soluble. The pH of their solutions increases down the group."},
    {q:"Describe the trend in solubility of Group 2 sulfates down the group.", a:"Solubility of sulfates decreases down Group 2: MgSO₄ is very soluble; CaSO₄ is slightly soluble; SrSO₄ is sparingly soluble; BaSO₄ is effectively insoluble. This trend is opposite to that of hydroxides."},
    {q:"How is Ca(OH)₂ used in agriculture?", a:"Calcium hydroxide (slaked lime) is added to acidic soils to neutralise excess acidity, raising the pH and improving conditions for crop growth. Equation: Ca(OH)₂ + 2H⁺ → Ca²⁺ + 2H₂O."},
    {q:"How is Mg(OH)₂ used medicinally?", a:"Magnesium hydroxide ('milk of magnesia') is used as an antacid to neutralise excess stomach acid (HCl): Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O. It is safe to use because it is insoluble and only reacts with the acid in the stomach."},
    {q:"How is BaSO₄ used in medicine, and why is it safe despite barium being toxic?", a:"Barium sulfate is ingested as a 'barium meal' before gastrointestinal X-rays or CT scans, as it is opaque to X-rays and outlines the digestive tract. BaSO₄ is safe because it is essentially insoluble — Ba²⁺ ions (which are toxic) cannot dissolve to any significant extent."},
    {q:"Describe how Group 2 oxides and hydroxides react with water.", a:"All Group 2 oxides react with water to form hydroxides: MO + H₂O → M(OH)₂. The resulting solutions are alkaline. E.g. CaO + H₂O → Ca(OH)₂."},
    {q:"How does the thermal stability of Group 2 carbonates change down the group?", a:"Thermal stability increases down Group 2 (larger cations have lower charge density and polarise the carbonate ion less). MgCO₃ decomposes most easily; BaCO₃ requires the highest temperature. MgCO₃ → MgO + CO₂ at a relatively low temperature."},
    {q:"How is CaO used in flue gas desulfurisation?", a:"Calcium oxide reacts with sulfur dioxide produced in power stations, preventing it from entering the atmosphere: CaO + SO₂ → CaSO₃. This reduces acid rain caused by SO₂ emissions."},
  ]},
  "3.2.3": { title: "Group 7", cards: [
    {q:"What is the colour and physical state of F₂ at room temperature?", a:"Pale yellow gas. F₂ has very weak London dispersion forces (small, few electrons) giving it the lowest boiling point of the halogens."},
    {q:"What is the colour and physical state of Cl₂ at room temperature?", a:"Yellow-green gas. Cl₂ has a characteristic choking smell and is denser than air. It is moderately soluble in water."},
    {q:"What is the colour and physical state of Br₂ at room temperature?", a:"Red-brown liquid. Br₂ is volatile and produces a dense red-brown vapour above it at room temperature. It is the only halogen that is a liquid at room temperature."},
    {q:"What is the colour and physical state of I₂ at room temperature?", a:"Grey-black solid. On heating, I₂ sublimes directly to give a purple/violet vapour. I₂ dissolves slightly in water (orange-brown solution) and readily in non-polar solvents such as hexane (purple/violet solution)."},
    {q:"Explain why boiling points increase down Group 7.", a:"Going down the group, atomic number and Mr increase. Larger atoms have more electrons, giving stronger instantaneous dipole–induced dipole (London) forces between molecules. More energy is needed to overcome these forces, raising the boiling point."},
    {q:"Describe the trend in oxidising ability down Group 7 and explain it.", a:"Oxidising ability decreases from F₂ to I₂. Going down the group, the halogen atoms become larger with more electron shells and increased shielding. The ability to attract an extra electron into the outer shell decreases, so halogens become weaker oxidising agents."},
    {q:"Describe the halogen displacement reactions in aqueous solution and explain what they show.", a:"Cl₂ displaces Br⁻ and I⁻: Cl₂ + 2Br⁻ → Br₂ + 2Cl⁻; Cl₂ + 2I⁻ → I₂ + 2Cl⁻\nBr₂ displaces I⁻: Br₂ + 2I⁻ → I₂ + 2Br⁻\nI₂ cannot displace Cl⁻ or Br⁻.\nThis confirms the order of oxidising power: Cl₂ > Br₂ > I₂."},
    {q:"Describe the trend in reducing ability of halide ions down Group 7 and explain it.", a:"Reducing ability increases from F⁻ to I⁻. Larger halide ions have more electron shells and greater shielding, so the outermost electrons are held less tightly and more easily donated (oxidised). I⁻ is the strongest reducing agent."},
    {q:"Compare the reactions of NaCl, NaBr, and NaI with concentrated H₂SO₄.", a:"NaCl: acid–base only. NaCl + H₂SO₄ → NaHSO₄ + HCl (misty fumes). No redox.\nNaBr: acid–base + mild redox. HBr produced, then 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O. Orange Br₂ and choking SO₂.\nNaI: acid–base + extensive redox. HI reduces H₂SO₄ to SO₂, S, and H₂S successively. Black I₂ solid, yellow S, smell of rotten eggs (H₂S)."},
    {q:"How are halide ions identified using silver nitrate solution?", a:"Add dilute HNO₃ (to remove interfering ions) then AgNO₃(aq):\nCl⁻: white ppt AgCl\nBr⁻: cream ppt AgBr\nI⁻: yellow ppt AgI\nConfirm by adding NH₃(aq): AgCl dissolves in dilute NH₃; AgBr dissolves only in concentrated NH₃; AgI is insoluble in NH₃."},
    {q:"Write the equation for chlorine reacting with water and name the reaction type.", a:"Cl₂ + H₂O ⇌ HCl + HClO\nThis is disproportionation: Cl₂ goes from oxidation state 0 to −1 (in HCl) and +1 (in HClO) simultaneously."},
    {q:"Write the equation for chlorine reacting with cold dilute NaOH and give the commercial application.", a:"Cl₂ + 2NaOH → NaCl + NaClO + H₂O\nIonic: Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O\nNaClO (sodium hypochlorite) is the active ingredient in household bleach."},
    {q:"How is chlorine used in water treatment?", a:"Chlorine is added in small, carefully controlled doses to drinking water and swimming pool water. It kills harmful microorganisms (bacteria and viruses) by reaction with water to form HClO, which destroys cell membranes. The dose must be carefully monitored as excess Cl₂ is toxic."},
    {q:"What are the risks and benefits of chlorinating drinking water?", a:"Benefits: kills waterborne pathogens, greatly reduces diseases like cholera and typhoid, cheap and effective.\nRisks: chlorine reacts with organic compounds in water to form trihalomethanes (e.g. CHCl₃), which are potential carcinogens. Chlorine gas itself is toxic."},
  ]},
  "3.2.4": { title: "Period 3 Elements", cards: [
    {q:"Describe the structures and bonding of Period 3 elements from Na to Ar.", a:"Na, Mg, Al: giant metallic (properties improve with more delocalised electrons).\nSi: giant covalent (diamond-like structure, very high mp).\nP (P₄), S (S₈), Cl (Cl₂): simple molecular, held by Van der Waals forces.\nAr: monatomic, no bonding."},
    {q:"Describe the reactions of Period 3 elements with oxygen.", a:"Na: 2Na + ½O₂ → Na₂O (yellow flame)\nMg: 2Mg + O₂ → 2MgO (intense white flame)\nAl: 4Al + 3O₂ → 2Al₂O₃ (slow, oxide layer protective)\nSi: Si + O₂ → SiO₂ (slow)\nP: P₄ + 5O₂ → P₄O₁₀ (white smoke)\nS: S + O₂ → SO₂ (blue flame, choking gas)"},
    {q:"Describe the reaction of sodium with water and state observations.", a:"2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)\nObservations: vigorous effervescence, sodium moves rapidly on the surface, orange/yellow flame, solution becomes strongly alkaline (pH 12–14)."},
    {q:"How does the acid-base character of Period 3 oxides change across the period?", a:"Na₂O, MgO: basic (react with acids to form salts + water).\nAl₂O₃: amphoteric (reacts with both dilute acids and dilute NaOH).\nSiO₂: weakly acidic (reacts with hot concentrated alkali).\nP₄O₁₀, SO₂, SO₃: strongly acidic (react with water to form acids, react with bases)."},
    {q:"Write equations for the reactions of Period 3 oxides with water.", a:"Na₂O + H₂O → 2NaOH (strongly alkaline)\nMgO + H₂O → Mg(OH)₂ (weakly alkaline)\nAl₂O₃: does not react with water\nSiO₂: does not react with water\nP₄O₁₀ + 6H₂O → 4H₃PO₄ (acidic)\nSO₂ + H₂O → H₂SO₃ (acidic)\nSO₃ + H₂O → H₂SO₄ (strongly acidic)"},
    {q:"What does it mean for Al₂O₃ to be amphoteric? Give equations.", a:"Al₂O₃ reacts with both acids and bases:\nWith acid: Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O\nWith alkali: Al₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄] (sodium tetrahydroxoaluminate)"},
    {q:"Describe the reactions of Period 3 chlorides with water.", a:"NaCl: dissolves, neutral solution (Na⁺ and Cl⁻ fully dissociated).\nMgCl₂: dissolves, slightly acidic ([Mg(H₂O)₆]²⁺ hydrolyses slightly).\nAlCl₃: vigorous hydrolysis to Al(OH)₃ + HCl; strongly acidic solution (pH 3).\nSiCl₄: complete hydrolysis: SiCl₄ + 2H₂O → SiO₂ + 4HCl; steamy fumes.\nPCl₃: PCl₃ + 3H₂O → H₃PO₃ + 3HCl\nPCl₅: PCl₅ + 4H₂O → H₃PO₄ + 5HCl"},
    {q:"Why do AlCl₃, SiCl₄, and PCl₅ hydrolyse readily with water but NaCl does not?", a:"NaCl is fully ionic; Na⁺ and Cl⁻ simply dissociate. AlCl₃, SiCl₄, and PCl₅ have significant covalent character and have empty low-energy orbitals or polar bonds that allow water to attack. The Si–Cl and P–Cl bonds are polarised and accessible to nucleophilic attack by water."},
    {q:"Why does aluminium appear unreactive in air despite having a negative electrode potential?", a:"Aluminium rapidly forms a thin, adherent, impermeable layer of Al₂O₃ on its surface when exposed to air. This oxide layer protects the metal underneath from further oxidation and prevents reaction with water or dilute acids."},
    {q:"Explain the trend in melting points across Period 3 in terms of structure and bonding.", a:"Na → Al: increasing mp (stronger metallic bonding — more delocalised electrons, higher ion charge).\nSi: very high mp (giant covalent, all bonds must be broken).\nP₄ → Cl₂ → Ar: decreasing mp (simple molecular, Van der Waals forces decrease with Mr: S₈ > P₄ > Cl₂ > Ar)."},
    {q:"Describe the reactions of Period 3 elements with chlorine (where relevant).", a:"Na: 2Na + Cl₂ → 2NaCl (vigorous, ionic product)\nMg: Mg + Cl₂ → MgCl₂ (exothermic)\nAl: 2Al + 3Cl₂ → 2AlCl₃ (covalent when anhydrous, forms Al₂Cl₆ dimer)\nSi: Si + 2Cl₂ → SiCl₄ (covalent liquid)\nP: P₄ + 6Cl₂ → 4PCl₃ (or PCl₅ with excess Cl₂) — all covalent."},
  ]},
  "3.2.5": { title: "Transition Metals", cards: [
    {q:"Define a transition metal and explain why Sc and Zn are not classified as transition metals.", a:"A transition metal is a d-block element that forms at least one stable ion with a partially filled d subshell.\nSc forms only Sc³⁺ ([Ar]3d⁰) — empty d subshell.\nZn forms only Zn²⁺ ([Ar]3d¹⁰) — full d subshell.\nNeither meets the definition."},
    {q:"List the four characteristic properties of transition metals.", a:"1. Variable oxidation states (due to similar energies of 3d and 4s electrons).\n2. Formation of coloured ions (d–d electron transitions absorb visible light).\n3. Catalytic activity (variable oxidation states allow electron shuttling).\n4. Ability to form complex ions with ligands."},
    {q:"Write the electron configurations of Cr and Cu, explaining the anomaly.", a:"Cr: [Ar]3d⁵4s¹ (not 3d⁴4s²) — half-filled 3d is extra stable.\nCu: [Ar]3d¹⁰4s¹ (not 3d⁹4s²) — fully filled 3d is extra stable.\nIn both cases, one electron is promoted from 4s to 3d."},
    {q:"Define ligand, complex ion, and coordination number.", a:"Ligand: a molecule or ion that donates a lone pair of electrons to a central metal ion via a coordinate bond.\nComplex ion: the central metal ion plus all its surrounding ligands.\nCoordination number: the total number of coordinate bonds from ligands to the central metal."},
    {q:"Compare monodentate, bidentate, and multidentate ligands with examples.", a:"Monodentate: donates one lone pair. Examples: H₂O, NH₃, Cl⁻, CN⁻, OH⁻.\nBidentate: donates two lone pairs from different atoms. Examples: 1,2-diaminoethane (en), ethanedioate (C₂O₄²⁻).\nMultidentate: donates 6 lone pairs. Example: EDTA⁴⁻ (hexadentate)."},
    {q:"Describe the common shapes of complex ions.", a:"Octahedral (6 ligands, 90°): [Fe(H₂O)₆]³⁺, [Cu(NH₃)₄(H₂O)₂]²⁺\nTetrahedral (4 ligands, 109.5°): [CuCl₄]²⁻ (large ligands)\nSquare planar (4 ligands, 90°): [Pt(NH₃)₂Cl₂] (cis-platin), [Ni(CN)₄]²⁻"},
    {q:"Explain why transition metal complexes are coloured.", a:"Ligands split the d orbitals into two sets of different energies. Electrons absorb photons of visible light with energy equal to this splitting (ΔE = hν) and are promoted to the higher-energy set. The complementary colour is transmitted. E.g. [Cu(H₂O)₆]²⁺ absorbs red/orange, appears blue."},
    {q:"What three factors affect the colour of a transition metal complex?", a:"1. The identity of the ligands (different ligands cause different d-orbital splitting).\n2. The oxidation state of the metal (affects electron count and splitting).\n3. The coordination number / shape of the complex."},
    {q:"Explain the chelate effect and why it makes bidentate ligands form more stable complexes.", a:"When bidentate or multidentate ligands replace monodentate ligands, there is a large entropy increase (more particles in products). ΔH ≈ 0 (similar bonds formed and broken). Since ΔG = ΔH − TΔS and ΔS > 0, ΔG is negative — the reaction is thermodynamically favourable."},
    {q:"Describe chromium chemistry: common oxidation states, colours, and the Cr²⁺/Cr⁶⁺ interconversion.", a:"Cr²⁺: blue; Cr³⁺: green (in [Cr(H₂O)₆]³⁺ violet/purple); CrO₄²⁻: yellow (alkaline); Cr₂O₇²⁻: orange (acidic).\nCr₂O₇²⁻ (orange) + OH⁻ → 2CrO₄²⁻ (yellow) — pH change\nCr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O — dichromate as oxidising agent"},
    {q:"What colour is Cr²⁺ in aqueous solution?", a:"Blue. Cr²⁺ is a relatively rare oxidation state for chromium and is easily oxidised in air to Cr³⁺."},
    {q:"What colour is [Cr(H₂O)₆]³⁺ (chromium(III) hexaqua complex)?", a:"Violet/purple. This is Cr³⁺ in neutral aqueous solution. It can appear green in acidic solution due to partial substitution of water ligands by anions (e.g. Cl⁻ or SO₄²⁻)."},
    {q:"What colour is CrO₄²⁻ (the chromate ion)?", a:"Yellow. Chromate is present in alkaline conditions. Adding acid converts it to the orange dichromate ion Cr₂O₇²⁻: 2CrO₄²⁻ + 2H⁺ ⇌ Cr₂O₇²⁻ + H₂O."},
    {q:"What colour is Cr₂O₇²⁻ (the dichromate ion)?", a:"Orange. Dichromate is present in acidic conditions. Adding alkali converts it to the yellow chromate ion CrO₄²⁻. Dichromate is also used as an oxidising agent (orange → green as Cr³⁺ forms)."},
    {q:"Describe copper chemistry: common ions, colours, and complex reactions.", a:"Cu²⁺: blue in [Cu(H₂O)₆]²⁺.\nWith excess NH₃: [Cu(H₂O)₂(NH₃)₄]²⁺ — deep blue (ligand substitution).\nWith Cl⁻: [CuCl₄]²⁻ — yellow/green (change in coordination number, 6→4, and ligand).\nCu⁺: unstable in water (disproportionates to Cu and Cu²⁺); stable as CuCl (insoluble) or in complexes."},
    {q:"What colour is [Cu(H₂O)₆]²⁺ (copper(II) hexaqua complex)?", a:"Pale blue/blue. This is the colour of Cu²⁺ ions dissolved in water — the characteristic blue colour of copper sulfate solution."},
    {q:"What colour is [Cu(NH₃)₄(H₂O)₂]²⁺ (tetraamminecopper(II) complex)?", a:"Deep blue/dark blue. Formed when excess aqueous ammonia is added to a Cu²⁺ solution. The colour is much more intense than [Cu(H₂O)₆]²⁺ because NH₃ causes greater d-orbital splitting than H₂O."},
    {q:"What colour is [CuCl₄]²⁻?", a:"Yellow/green. Formed when concentrated chloride ions (e.g. concentrated HCl) are added to Cu²⁺ solution. The coordination number drops from 6 (octahedral) to 4 (tetrahedral) and the colour changes dramatically from blue to yellow/green."},
    {q:"Describe cis-trans and optical isomerism in transition metal complexes.", a:"Cis-trans isomerism (square planar, e.g. [Pt(NH₃)₂Cl₂]): cis = same-type ligands adjacent; trans = opposite.\nOptical isomerism in octahedral complexes with bidentate ligands (e.g. [Fe(en)₃]²⁺): two non-superimposable mirror images. Relevant for cis-platin (cis = anti-cancer active; trans = inactive)."},
    {q:"Explain how carbon monoxide poisoning involves haemoglobin.", a:"In haemoglobin, Fe²⁺ has a porphyrin ring as a multidentate ligand and O₂ as the reversible monodentate ligand. CO binds to Fe²⁺ much more strongly and irreversibly than O₂, forming a very stable complex that cannot carry O₂. This causes oxygen starvation (hypoxia)."},
    {q:"Describe iron chemistry: Fe²⁺ and Fe³⁺ colours, and their interconversion.", a:"Fe²⁺ [Fe(H₂O)₆]²⁺: pale green solution.\nFe³⁺ [Fe(H₂O)₆]³⁺: pale violet/lilac solution (in practice appears yellow-brown due to hydrolysis, but the pure hexaqua ion is pale violet).\nFe²⁺ is a reducing agent (easily oxidised to Fe³⁺ in air).\nFe³⁺ is an oxidising agent (reduced back to Fe²⁺ by e.g. I⁻)."},
    {q:"What colour is [Fe(H₂O)₆]²⁺ (iron(II) hexaqua complex)?", a:"Pale green. This is the colour of Fe²⁺ in aqueous solution."},
    {q:"What colour is [Fe(H₂O)₆]³⁺ (iron(III) hexaqua complex)?", a:"Pale violet/lilac. Note: Fe³⁺ solutions commonly appear yellow-brown in practice due to partial hydrolysis (formation of hydroxo-aqua complexes), but the pure hexaqua ion is pale violet/lilac — this is the colour AQA expects for the pure complex."},
    {q:"What colour is the Mn²⁺ aqua complex [Mn(H₂O)₆]²⁺?", a:"Very pale pink (almost colourless). Mn²⁺ has a d⁵ configuration; d-d transitions are spin-forbidden → very weak colour absorption → nearly colourless aqueous solution."},
    {q:"What colour is the Co²⁺ aqua complex [Co(H₂O)₆]²⁺?", a:"Pink. This is the characteristic colour of cobalt(II) in aqueous solution. Adding concentrated Cl⁻ (e.g. conc HCl) converts it to the tetrahedral [CoCl₄]²⁻ complex which is blue."},
    {q:"What precipitate forms when NaOH(aq) is added to Co²⁺(aq)?", a:"Blue/green precipitate of Co(OH)₂ initially forms, which turns pink on standing.\nEquation: [Co(H₂O)₆]²⁺ + 2OH⁻ → Co(OH)₂(s) + 6H₂O\nCo(OH)₂ does not dissolve in excess NaOH.\nWith excess NH₃: the precipitate dissolves to give [Co(NH₃)₆]²⁺ (straw/yellow colour)."},
    {q:"What precipitate forms when NaOH(aq) is added to Mn²⁺(aq)?", a:"Cream/pale brown precipitate of Mn(OH)₂.\nEquation: [Mn(H₂O)₆]²⁺ + 2OH⁻ → Mn(OH)₂(s) + 6H₂O\nMn(OH)₂ does not dissolve in excess NaOH.\nOn standing in air, the cream ppt darkens to brown MnO(OH) or MnO₂ as Mn²⁺ is slowly oxidised."},
    {q:"Summarise the colours of the aqua complex ions [M(H₂O)₆]ⁿ⁺ for the first-row transition metals.", a:"Ti³⁺: purple\nV²⁺: violet; V³⁺: green\nCr²⁺: blue; Cr³⁺: violet/green\nMn²⁺: very pale pink (almost colourless)\nFe²⁺: pale green; Fe³⁺: pale violet/lilac (in practice yellow-brown)\nCo²⁺: pink\nNi²⁺: green\nCu²⁺: blue\nZn²⁺: colourless (d¹⁰, no d-d transition)"},
    {q:"Describe the colour changes when NaOH(aq) is added to aqueous solutions of Cu²⁺, Fe²⁺, Fe³⁺, Cr³⁺, Co²⁺, and Mn²⁺.", a:"Cu²⁺: pale blue solution → blue ppt Cu(OH)₂ (insoluble in excess NaOH)\nFe²⁺: pale green solution → green ppt Fe(OH)₂ (turns red-brown on standing: oxidised to Fe(OH)₃)\nFe³⁺: yellow-brown solution → red-brown ppt Fe(OH)₃ (insoluble in excess NaOH)\nCr³⁺: violet/green solution → grey-green ppt Cr(OH)₃ → dissolves in excess NaOH: [Cr(OH)₄]⁻ (green)\nCo²⁺: pink solution → blue/green ppt Co(OH)₂ (insoluble in excess NaOH)\nMn²⁺: pale pink solution → cream ppt Mn(OH)₂ (insoluble in excess NaOH; darkens in air)"},
    {q:"Describe what happens when excess NH₃(aq) is added to Cu²⁺, Co²⁺, Cr³⁺, and Fe²⁺/Fe³⁺ precipitates.", a:"Cu(OH)₂ (blue ppt) + excess NH₃ → deep blue solution [Cu(NH₃)₄(H₂O)₂]²⁺\nCo(OH)₂ (blue/green ppt) + excess NH₃ → straw/yellow solution [Co(NH₃)₆]²⁺ (oxidises to brown [Co(NH₃)₆]³⁺ in air)\nCr(OH)₃ (grey-green ppt) + excess NH₃ → violet solution [Cr(NH₃)₆]³⁺\nFe(OH)₂ and Fe(OH)₃: do NOT dissolve in excess NH₃"},
  ]},
  "3.2.6": { title: "Aqueous Ions", cards: [
    {q:"Why do transition metal ions form acidic solutions when dissolved in water?", a:"Metal ions attract water molecules as ligands, forming [M(H₂O)₆]ⁿ⁺. The metal ion polarises the O–H bond in coordinated water, making it easier for a proton to be released. Higher charge density (smaller or higher-charged ions) gives a lower pH."},
    {q:"Summarise the precipitates formed when NaOH is added to aqueous Cu²⁺, Fe²⁺, Fe³⁺, Cr³⁺, Mn²⁺, Al³⁺.", a:"Cu²⁺: blue ppt Cu(OH)₂\nFe²⁺: green ppt Fe(OH)₂ (turns brown in air → Fe(OH)₃)\nFe³⁺: red-brown ppt Fe(OH)₃\nCr³⁺: grey-green ppt Cr(OH)₃\nMn²⁺: cream ppt Mn(OH)₂\nAl³⁺: white ppt Al(OH)₃"},
    {q:"Which metal hydroxide precipitates dissolve in excess NaOH and what forms?", a:"Cr(OH)₃ (grey-green ppt) dissolves in excess NaOH → [Cr(OH)₄]⁻ green solution (chromate(III)).\nAl(OH)₃ (white ppt) dissolves in excess NaOH → [Al(OH)₄]⁻ colourless solution (tetrahydroxoaluminate).\nCu(OH)₂ and Fe(OH)₂/Fe(OH)₃ do NOT dissolve in excess NaOH."},
    {q:"What happens when excess ammonia solution is added to Cu²⁺ and Cr³⁺ precipitates?", a:"Cu(OH)₂ (blue ppt) + excess NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue solution (ligand substitution).\nCr(OH)₃ (grey-green ppt) + excess NH₃ → [Cr(NH₃)₆]³⁺ violet solution.\nFe²⁺ and Fe³⁺ precipitates do NOT dissolve in excess NH₃."},
    {q:"Write the ionic equation for Cu²⁺(aq) reacting with NaOH(aq).", a:"[Cu(H₂O)₆]²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s) + 6H₂O(l)\nBlue precipitate forms. No change with excess NaOH."},
    {q:"Write the ionic equation for Cu²⁺(aq) reacting with excess aqueous ammonia.", a:"[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O\nInitially blue Cu(OH)₂ ppt forms with limited NH₃, then dissolves to give deep blue solution with excess."},
    {q:"Write the ionic equation for Fe³⁺(aq) reacting with NaOH(aq).", a:"[Fe(H₂O)₆]³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s) + 6H₂O(l)\nRed-brown ppt forms. Does not dissolve in excess NaOH or excess NH₃."},
    {q:"Describe the test for NH₄⁺ ions.", a:"Add NaOH(aq) and heat: NH₄⁺ + OH⁻ → NH₃(g) + H₂O.\nAmmonia gas produced — recognised by pungent smell and turning damp red litmus paper blue."},
    {q:"Describe the test for CO₃²⁻ ions.", a:"Add dilute HCl: CO₃²⁻ + 2H⁺ → H₂O + CO₂(g).\nBubbling/effervescence; gas turns limewater milky (Ca(OH)₂ + CO₂ → CaCO₃ + H₂O)."},
    {q:"Describe the test for SO₄²⁻ ions.", a:"Add BaCl₂(aq) acidified with dilute HCl: Ba²⁺ + SO₄²⁻ → BaSO₄(s).\nWhite precipitate forms, insoluble in dilute HCl. Acidification removes CO₃²⁻ which could give a false positive."},
    {q:"Describe the tests for halide ions Cl⁻, Br⁻, I⁻.", a:"Add AgNO₃(aq) acidified with dilute HNO₃:\nCl⁻: white ppt AgCl, dissolves in dilute NH₃.\nBr⁻: cream ppt AgBr, dissolves only in conc. NH₃.\nI⁻: yellow ppt AgI, insoluble in both dilute and conc. NH₃."},
    {q:"What is the colour change observed when Fe²⁺ precipitate is left in air, and why?", a:"Fe(OH)₂ (green ppt) slowly turns to Fe(OH)₃ (red-brown ppt) on standing in air. Fe²⁺ is oxidised to Fe³⁺ by oxygen in air: 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃."},
    {q:"Why is Al³⁺ often tested for alongside transition metal ions in qualitative analysis?", a:"Al³⁺ is not a transition metal but forms a white precipitate with NaOH that dissolves in excess (amphoteric). This behaviour distinguishes it from Ca²⁺ and Mg²⁺ (white ppts that do not dissolve in excess NaOH) and from transition metal ions."},
  ]},

  "3.3.1": { title: "Introduction to Organic Chemistry", cards: [
    {q:"What is a homologous series and what four features define it?", a:"A homologous series is a family of organic compounds sharing the same functional group.\n1. Same general formula.\n2. Differ from adjacent members by CH\u2082.\n3. Similar chemical properties (same functional group).\n4. Gradual trend in physical properties (e.g. boiling point increases with chain length)."},
    {q:"Describe IUPAC naming rules for simple organic molecules.", a:"1. Find the longest continuous carbon chain \u2014 this gives the parent name (meth/eth/prop/but/pent/hex...).\n2. Identify the principal functional group and use its suffix (-ane, -ene, -ol, -al, -one, -oic acid, -amine).\n3. Number the chain from the end that gives the principal group the lowest locant.\n4. Name substituents as prefixes (methyl-, chloro- etc.) in alphabetical order with their positions."},
    {q:"What is the difference between displayed, structural, and skeletal formulae?", a:"Displayed: shows every atom and every bond explicitly.\nStructural: shows the arrangement of atoms in a condensed form (e.g. CH\u2083CH\u2082OH).\nSkeletal: carbon backbone shown as a zigzag with each vertex and end = a CH\u2082 or CH\u2083; heteroatoms and functional group atoms drawn explicitly; H on C omitted."},
    {q:"Define the three types of structural isomerism with examples.", a:"Chain isomers: same formula, different carbon skeleton. E.g. butane and 2-methylpropane (both C\u2084H\u2081\u2080).\nPositional isomers: same formula and skeleton, functional group at different position. E.g. propan-1-ol and propan-2-ol.\nFunctional group isomers: same formula, different functional group. E.g. ethanoic acid (COOH) and methyl methanoate (ester), both C\u2082H\u2084O\u2082."},
    {q:"Define E/Z isomerism and explain the CIP rules for assigning priorities.", a:"E/Z isomerism arises from restricted rotation about C=C. Each carbon of the double bond must have two different substituents.\nCIP priority: higher atomic number = higher priority. If the high-priority groups on each carbon are on the same side = Z (zusammen); opposite sides = E (entgegen)."},
    {q:"Define homolytic and heterolytic bond fission and the species produced.", a:"Homolytic fission: each atom receives one electron from the bond \u2192 two radicals (have unpaired electrons). Shown as 'fish-hook' half arrows.\nHeterolytic fission: both electrons go to one atom \u2192 a cation (electrophile) and an anion (nucleophile). Shown as full curly arrows."},
    {q:"Define electrophile and nucleophile with examples.", a:"Electrophile: electron-pair acceptor; electron-deficient species. Examples: H\u207a, NO\u2082\u207a, Br\u2082 (polarised), carbocations, AlCl\u2083.\nNucleophile: electron-pair donor; electron-rich species. Examples: OH\u207b, CN\u207b, NH\u2083, H\u2082O, halide ions."},
    {q:"What is the difference between a primary, secondary, and tertiary carbon (or alcohol/amine)?", a:"Based on how many other carbon atoms are directly bonded to the carbon in question.\nPrimary (1\u00b0): 1 other C attached.\nSecondary (2\u00b0): 2 other C attached.\nTertiary (3\u00b0): 3 other C attached."},
    {q:"Give the suffixes and one example for each of these functional groups: alcohol, aldehyde, ketone, carboxylic acid, ester, amine.", a:"Alcohol: -ol (e.g. ethanol)\nAldehyde: -al (e.g. ethanal)\nKetone: -one (e.g. propanone)\nCarboxylic acid: -oic acid (e.g. ethanoic acid)\nEster: -anoate (e.g. methyl ethanoate)\nAmine: -amine or -ylamine (e.g. methylamine)"},
    {q:"What is a chiral centre and what are enantiomers?", a:"A chiral centre (stereogenic centre) is a carbon atom bonded to four different groups. It has no plane of symmetry.\nEnantiomers are the two non-superimposable mirror-image forms. They rotate plane-polarised light in equal but opposite directions (+ and \u2212)."},
    {q:"What is a racemic mixture and how is it formed?", a:"A racemic mixture contains equal moles of both enantiomers and has zero net optical rotation. It is formed whenever a chiral centre is created from a flat (sp\u00b2 or symmetric) reactant, as both faces of the molecule are attacked equally (e.g. nucleophilic addition to a carbonyl)."},
    {q:"What is the pharmaceutical significance of chirality? (Thalidomide example)", a:"One enantiomer of thalidomide was effective against morning sickness; the other caused severe limb defects in unborn children. The active enantiomer also racemises in the body, so even pure enantiomer cannot be used safely. This illustrates why drug testing and chirality matter."},
  ]},
    "3.3.2": { title: "Alkanes", cards: [
    {q:"What is the general formula for alkanes and why are they relatively unreactive?", a:"CₙH₂ₙ₊₂. Alkanes contain only C–C and C–H sigma bonds; these are strong, non-polar bonds with no π electrons or lone pairs. This makes alkanes resistant to attack by electrophiles, nucleophiles, and oxidising agents under mild conditions."},
    {q:"What is crude oil and how is it processed?", a:"Crude oil is a naturally occurring mixture of mainly alkane hydrocarbons formed from ancient marine organisms over millions of years. It is separated by fractional distillation into fractions (groups of hydrocarbons of similar boiling point). Heavier fractions are further processed by cracking."},
    {q:"Explain the basis of fractional distillation and give typical fractions.", a:"Crude oil is heated; vapours rise up the fractionating column and condense at different heights according to boiling point. Fractions collected (approximate bp, shortest chains at top): refinery gas (gases), gasoline (petrol), naphtha, kerosene, gas oil (diesel), fuel oil, bitumen (base)."},
    {q:"Distinguish between thermal cracking and catalytic cracking.", a:"Thermal cracking: very high temperature (~800–1000°C), high pressure, random C–C bond breaking; mainly produces alkenes and straight-chain alkanes.\nCatalytic cracking: zeolite catalyst, lower temperature (~450°C), atmospheric pressure; mainly produces branched alkanes, cycloalkanes, and aromatic hydrocarbons (more useful fuels)."},
    {q:"Write a balanced equation for complete combustion of propane.", a:"C₃H₈ + 5O₂ → 3CO₂ + 4H₂O\nComplete combustion requires excess oxygen and produces only CO₂ and H₂O."},
    {q:"What is incomplete combustion and what are its products?", a:"When oxygen supply is limited, alkanes undergo incomplete combustion forming CO (toxic) and C (soot/carbon particulates). E.g. 2CH₄ + 3O₂ → 2CO + 4H₂O. CO is dangerous as it binds irreversibly to haemoglobin; carbon particulates cause respiratory disease."},
    {q:"Describe the three stages of free radical substitution (FRS) using methane and chlorine as an example.", a:"Initiation: Cl₂ →(UV) 2Cl• (homolytic fission)\nPropagation: Cl• + CH₄ → CH₃• + HCl; CH₃• + Cl₂ → CH₃Cl + Cl•\nTermination: any two radicals combine, e.g. 2Cl• → Cl₂; CH₃• + Cl• → CH₃Cl; 2CH₃• → C₂H₆"},
    {q:"Why does free radical substitution produce a mixture of products?", a:"Once CH₃Cl forms, it can itself react with Cl• in a further propagation step to form CH₂Cl₂, then CHCl₃, then CCl₄. All these chlorinated methanes accumulate, giving a mixture. This makes FRS poor for producing a single pure product."},
    {q:"What environmental problems arise from burning fossil fuels?", a:"CO₂: greenhouse gas, contributes to climate change.\nCO: toxic gas from incomplete combustion.\nSO₂ and NOₓ: react with rainwater to form acid rain (H₂SO₄/HNO₃), damaging ecosystems and buildings.\nCarbon particulates: respiratory damage, global dimming."},
    {q:"How do catalytic converters reduce atmospheric pollution?", a:"Platinum, palladium, and rhodium on a honeycomb ceramic support catalyse the conversion of:\n2CO + 2NO → 2CO₂ + N₂\nCₓHₙ + excess O₂ → CO₂ + H₂O\nThe honeycomb maximises surface area for the heterogeneous catalyst."},
    {q:"What is the trend in boiling point of alkanes and why?", a:"Boiling point increases with chain length (more electrons → stronger London forces). Branching decreases boiling point compared to straight-chain isomers (less surface area contact → weaker London forces). All alkanes are non-polar, so only London forces operate."},
  ]},
    "3.3.3": { title: "Halogenoalkanes", cards: [
    {q:"What is a halogenoalkane and how are primary, secondary, and tertiary types distinguished?", a:"A halogenoalkane has the general formula CₙH₂ₙ₊₁X where X = halogen.\nPrimary (1°): halogen-bearing C is attached to 1 other C.\nSecondary (2°): attached to 2 other C.\nTertiary (3°): attached to 3 other C."},
    {q:"Why is the C–X bond in halogenoalkanes polar?", a:"Halogens are more electronegative than carbon, so the shared electrons are pulled towards X, giving Cδ+–Xδ−. This makes the carbon susceptible to nucleophilic attack."},
    {q:"How does bond strength of C–X vary down the group and what is its effect on reactivity?", a:"Bond strength decreases: C–F > C–Cl > C–Br > C–I. Weaker bonds are more easily broken, so reactivity towards nucleophilic substitution increases from fluoroalkane to iodoalkane."},
    {q:"Describe SN2 nucleophilic substitution (primary halogenoalkanes).", a:"SN2 (substitution, nucleophilic, bimolecular) is a one-step concerted mechanism. The nucleophile attacks the Cδ+ from the back (180° from the leaving group). As the nucleophile–C bond forms, the C–X bond breaks. This causes inversion of configuration at the chiral centre (Walden inversion)."},
    {q:"Describe SN1 nucleophilic substitution (tertiary halogenoalkanes).", a:"SN1 (substitution, nucleophilic, unimolecular) is a two-step mechanism. Step 1: the C–X bond breaks heterolytically, forming a planar carbocation intermediate. Step 2: the nucleophile attacks the carbocation from either face, producing a racemic mixture."},
    {q:"How are halogenoalkanes hydrolysed and how is the rate compared for C–Cl, C–Br, and C–I?", a:"Warmed with NaOH(aq) or water; OH⁻ acts as nucleophile → alcohol formed. Rate: C–I > C–Br > C–Cl because the weaker bond is more easily broken. Measured using AgNO₃(aq) in ethanol — yellow ppt forms fastest for iodo compounds."},
    {q:"How is a nitrile made from a halogenoalkane, and what is the significance of this reaction?", a:"RX + KCN (in ethanol/water) → RCN + KX (nucleophilic substitution, CN⁻ is nucleophile)\nThe reaction increases the carbon chain by one — important in synthesis. The nitrile can then be hydrolysed to a carboxylic acid or reduced to an amine."},
    {q:"How is a primary amine made from a halogenoalkane?", a:"RX + excess NH₃ (in sealed tube/ethanol) → RNH₂ + HX. Excess NH₃ is used to push the reaction towards the primary amine (minimise formation of secondary and tertiary amines by preventing further alkylation)."},
    {q:"What happens when a halogenoalkane is treated with KOH in ethanol (not aqueous) and what product forms?", a:"Elimination occurs (not substitution). KOH/ethanol provides a strong base that removes an H from a carbon adjacent to the halogen, forming an alkene + HX. Hot, ethanolic conditions favour elimination; aqueous conditions favour substitution."},
    {q:"What are CFCs and why are they harmful?", a:"Chlorofluorocarbons: halogenoalkanes containing only C, Cl, and F. They were used as refrigerants and propellants. UV radiation in the stratosphere homolytically breaks the C–Cl bond, releasing Cl• radicals which catalytically destroy ozone: Cl• + O₃ → ClO• + O₂; then ClO• + O₃ → 2O₂ + Cl•. One Cl• destroys thousands of O₃ molecules."},
    {q:"What are HCFCs and HFCs, and why are they used as CFC replacements?", a:"HCFCs (hydrochlorofluorocarbons) and HFCs (hydrofluorocarbons) were introduced as safer alternatives. HCFCs have C–H bonds that are broken down lower in the atmosphere before reaching the stratosphere, releasing fewer radicals. HFCs contain no chlorine, so cannot release Cl• radicals and do not destroy ozone."},
  ]},
    "3.3.4": { title: "Alkenes", cards: [
    {q:"Describe the bonding in alkenes and why this makes them reactive.", a:"The C=C double bond consists of a σ bond and a π bond. The π bond is formed by sideways overlap of p orbitals above and below the C–C axis. The π electron cloud is exposed and electron-rich, making alkenes good targets for electrophilic attack."},
    {q:"What is E/Z isomerism and what structural requirement must be met?", a:"E/Z (geometric) isomerism arises because there is no rotation about the C=C double bond. Each carbon of the C=C must bear two different substituents. E: higher-priority groups on opposite sides; Z: higher-priority groups on the same side (CIP rules for priority: higher atomic number = higher priority)."},
    {q:"Describe the mechanism of electrophilic addition of Br₂ to ethene.", a:"1. The electron-rich π bond of ethene polarises the Br–Br molecule, making the nearer Br atom δ+.\n2. The π electrons attack the δ+ Br, forming a C–Br bond and generating a cyclic bromonium ion (or carbocation) intermediate; Br⁻ is released.\n3. Br⁻ attacks the carbocation from the back → 1,2-dibromoethane."},
    {q:"What test for a C=C double bond uses bromine water, and what is observed?", a:"Add bromine water (orange/brown) to the compound; if a C=C is present, the bromine undergoes electrophilic addition and the solution decolourises (turns colourless). Alkanes do not decolourise bromine water."},
    {q:"Explain Markovnikov's rule for addition of HBr to propene.", a:"HBr adds across the double bond such that the H goes to the carbon with more hydrogens (more substituted C gets Br). This is because the secondary carbocation formed at the middle C is more stable (more alkyl groups stabilise the positive charge) than the primary carbocation."},
    {q:"How does steam (H₂O) add to ethene and what are the conditions?", a:"CH₂=CH₂ + H₂O → CH₃CH₂OH (ethanol)\nConditions: 300°C, 65 atm, H₃PO₄ (phosphoric acid) catalyst.\nThe mechanism is electrophilic addition: H⁺ from H₃PO₄ acts as electrophile, attacks the π bond → carbocation → OH from water attacks → proton removed."},
    {q:"What is addition polymerisation and how is the repeat unit drawn?", a:"Addition polymerisation: many unsaturated monomer molecules join together via their C=C bonds, forming a long saturated polymer chain. The repeat unit is drawn by removing the double bond and placing brackets with 'n': −(CH₂–CHX)ₙ−. Addition polymers are not biodegradable."},
    {q:"Give the names and monomers for three important addition polymers.", a:"Poly(ethene) from ethene (CH₂=CH₂) — flexible, used for bags/bottles.\nPoly(propene) from propene (CH₂=CHCH₃) — tougher, used for ropes/carpets.\nPVC (poly(chloroethene)) from chloroethene — rigid unless plasticised; used in pipes and cable insulation."},
    {q:"What are the environmental issues with addition polymers?", a:"They are almost entirely non-biodegradable (the C–C backbone resists chemical attack). Disposal options: landfill (takes up space), incineration (may release toxic gases), recycling (energy-intensive, needs sorting). Research into biodegradable alternatives and chemical recycling is ongoing."},
    {q:"Why do alkenes undergo addition reactions rather than substitution?", a:"The π electrons of the C=C are easily attacked by electrophiles, breaking the π bond and forming a new σ bond with the electrophile. Unlike benzene's ring, alkene π bonds are not stabilised by delocalisation — substitution (which would preserve no π system) offers no advantage here; addition is more energetically favourable."},
  ]},
    "3.3.5": { title: "Alcohols", cards: [
    {q:"Classify alcohols as primary, secondary, or tertiary and give an example of each.", a:"Primary (1°): OH attached to C bearing 1 other C. Example: ethanol (CH₃CH₂OH).\nSecondary (2°): OH on C attached to 2 other C. Example: propan-2-ol.\nTertiary (3°): OH on C attached to 3 other C. Example: 2-methylpropan-2-ol."},
    {q:"Why do alcohols have much higher boiling points than alkanes of similar Mr?", a:"Alcohols form intermolecular hydrogen bonds via the O–H group (O is highly electronegative and H is bonded to it). These hydrogen bonds are much stronger than the London forces between alkane molecules, so much more energy is required to separate alcohol molecules."},
    {q:"Describe the oxidation of primary and secondary alcohols.", a:"Primary alcohol + [O] → aldehyde (K₂Cr₂O₇/H₂SO₄, distil off immediately to prevent further oxidation)\nPrimary alcohol + excess [O] → carboxylic acid (K₂Cr₂O₇/H₂SO₄, reflux)\nSecondary alcohol + [O] → ketone (K₂Cr₂O₇/H₂SO₄, reflux)\nTertiary alcohols are resistant to oxidation (no H on the C bearing OH)."},
    {q:"What colour change indicates oxidation is occurring with acidified dichromate?", a:"The orange Cr₂O₇²⁻ (dichromate) is reduced to green Cr³⁺. The solution changes from orange to green, confirming oxidation has occurred."},
    {q:"Describe the dehydration of alcohols to alkenes.", a:"Elimination: alcohol heated with concentrated H₃PO₄ or Al₂O₃ at about 180°C → alkene + H₂O.\nMechanism: H⁺ protonates the –OH to form a good leaving group (H₂O), then a proton is lost from an adjacent C to form the C=C double bond."},
    {q:"Compare the production of ethanol by fermentation versus direct hydration of ethene.", a:"Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂; enzyme in yeast, ~37°C, anaerobic, batch process; renewable, low rate, dilute product (needs distillation), uses crops.\nDirect hydration: C₂H₄ + H₂O → C₂H₅OH; H₃PO₄ catalyst, 300°C, 65 atm, continuous; non-renewable (from crude oil), fast, high purity."},
    {q:"Describe esterification of an alcohol with a carboxylic acid.", a:"Alcohol + carboxylic acid ⇌ ester + water (H₂SO₄ catalyst, warm/reflux). The reaction is reversible with a low atom economy. Excess of one reactant improves yield. The ester can be separated by distillation."},
    {q:"How is a bromoalkane made from an alcohol?", a:"React the alcohol with NaBr and concentrated H₂SO₄ (or HBr gas directly): ROH + HBr → RBr + H₂O. This is a nucleophilic substitution where Br⁻ displaces the OH (after it is protonated to form a water leaving group)."},
    {q:"What is the reaction of alcohols with sodium metal?", a:"2ROH + 2Na → 2RONa + H₂\nThe O–H bond is cleaved; H is released as H₂ gas and sodium alkoxide (RO⁻Na⁺) is formed. This shows the acidic character of the O–H group (though alcohols are weaker acids than water)."},
    {q:"Why is fermentation-derived ethanol sometimes described as carbon-neutral, and why is this claim contested?", a:"The crops absorb CO₂ during growth (photosynthesis), which theoretically offsets the CO₂ released on combustion. However, fossil fuels are used in planting, harvesting, transportation, and distillation, so overall the process is not truly carbon-neutral."},
  ]},
    "3.3.6": { title: "Organic Analysis", cards: [
    {q:"How is mass spectrometry used to identify an organic compound?", a:"The molecular ion peak (M⁺) gives the relative molecular mass. Fragmentation peaks arise from bond cleavage inside the spectrometer. Common losses: 15 (CH₃•), 29 (CHO•), 45 (COOH•), 77 (C₆H₅•). The base peak (tallest) is the most stable fragment. Comparing the fragmentation pattern to a database identifies the compound."},
    {q:"What is the principle of infrared (IR) spectroscopy?", a:"Bonds in molecules vibrate (stretch and bend) at characteristic frequencies. They absorb IR radiation at the frequency matching their natural vibration. A molecule absorbs specific IR frequencies corresponding to each bond type, giving a spectrum unique to that compound. Key absorptions are used to identify functional groups."},
    {q:"What are the key IR absorptions to recognise?", a:"O–H (alcohol): broad absorption ~3230–3550 cm⁻¹\nO–H (carboxylic acid): very broad ~2500–3300 cm⁻¹\nN–H (amine/amide): ~3300–3500 cm⁻¹ (two peaks for primary amine)\nC=O (aldehyde/ketone): ~1700–1750 cm⁻¹ (strong, sharp)\nC=O (carboxylic acid): ~1700–1725 cm⁻¹\nFingerprint region: <1500 cm⁻¹ (unique molecular pattern)"},
    {q:"What is the fingerprint region and how is it used?", a:"The fingerprint region (below 1500 cm⁻¹) contains complex overlapping absorptions unique to each molecule. It cannot be interpreted peak-by-peak, but can be compared against a library of known spectra to confirm the identity of a compound."},
    {q:"Describe the test for aldehydes using Tollens' reagent.", a:"Tollens' reagent = [Ag(NH₃)₂]⁺. With an aldehyde: Ag⁺ is reduced to Ag(s), forming a silver mirror on the inside of the test tube. Ketones do not react (they cannot be further oxidised).\nEquation: RCHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → RCOO⁻ + 2Ag(s) + 4NH₃ + H₂O"},
    {q:"Describe the test for aldehydes using Fehling's solution.", a:"Fehling's solution contains Cu²⁺ (blue). Aldehydes reduce Cu²⁺ to Cu₂O, giving a brick-red precipitate. Ketones do not react. Both test confirm a compound is an aldehyde (not a ketone), even though both contain C=O."},
    {q:"What is 2,4-DNPH (Brady's reagent) used for?", a:"2,4-dinitrophenylhydrazine reacts with any carbonyl compound (aldehyde or ketone) by condensation to form an orange/yellow 2,4-DNPH derivative precipitate. The melting point of the derivative is measured and compared to a data table to identify the specific aldehyde or ketone."},
    {q:"How is the iodoform (tri-iodomethane) test used in organic analysis?", a:"Add I₂/NaOH to the compound and warm. A yellow precipitate of CHI₃ (iodoform) with antiseptic smell indicates the compound contains a CH₃CO– group (methyl ketone or ethanol/secondary alcohol oxidisable to a methyl ketone). Propanone gives a positive result; pentan-3-one does not."},
    {q:"How do you test for carboxylic acids?", a:"Add Na₂CO₃ (sodium carbonate) solution: carboxylic acids react to release CO₂ gas (effervescence/bubbles). The gas turns limewater milky. Equation: 2RCOOH + Na₂CO₃ → 2RCOONa + H₂O + CO₂."},
    {q:"How does acidified K₂Cr₂O₇ help identify the oxidation state of an organic compound?", a:"Orange Cr₂O₇²⁻ turns green on oxidation. A colour change indicates a primary or secondary alcohol, or an aldehyde is present (all are oxidised). No colour change with a tertiary alcohol or ketone (cannot be oxidised under these conditions)."},
    {q:"How do you distinguish between a primary alcohol, secondary alcohol, aldehyde, ketone, and carboxylic acid using chemical tests?", a:"1. K₂Cr₂O₇/H₂SO₄: all except tertiary alcohol and ketone give orange→green.\n2. Tollens'/Fehling's: aldehyde gives silver mirror/red ppt; ketone does not.\n3. To distinguish 1° from 2° alcohol: oxidise and test product with Tollens' (aldehyde from 1°) or K₂Cr₂O₇ (ketone from 2°).\n4. Na₂CO₃: carboxylic acid gives CO₂ effervescence."},
  ]},
    "3.3.7": { title: "Optical Isomerism, Aldehydes & Ketones", cards: [
    {q:"Distinguish between aldehydes and ketones in terms of structure, naming, and reactivity.", a:"Aldehydes: C=O at end of chain (C-1), suffix -al. Example: propanal.\nKetones: C=O within chain, suffix -one. Example: propanone.\nAldehydes can be oxidised to carboxylic acids (weak reducing agents); ketones cannot be further oxidised and give no reaction with Tollens' or Fehling's reagent."},
    {q:"What is a chiral carbon and when does optical isomerism arise?", a:"A chiral carbon has four different substituents attached. Optical isomerism arises when a molecule contains one or more chiral centres. The two non-superimposable mirror-image structures are called enantiomers."},
    {q:"How do enantiomers differ in their physical and chemical properties?", a:"Enantiomers have identical physical properties (mp, bp, solubility) and identical chemical reactivity towards achiral reagents. They differ in: (1) the direction they rotate plane-polarised light (+/−); (2) their reactivity with other chiral molecules (e.g. in biological systems, enzymes are chiral and may interact with only one enantiomer)."},
    {q:"Describe nucleophilic addition of HCN to a carbonyl compound. Why is NaCN + HCl used instead of pure HCN?", a:"CN⁻ (from NaCN) attacks the δ+ carbonyl carbon, forming a tetrahedral alkoxide intermediate. H⁺ (from HCl or HCN) then protonates the O⁻ to give a hydroxynitrile (cyanohydrin).\nPure HCN is an extremely toxic volatile liquid; using NaCN + acid generates HCN in situ at low concentration, which is safer to handle."},
    {q:"Why does nucleophilic addition of HCN to an aldehyde such as ethanal produce a racemic mixture?", a:"The carbonyl carbon in ethanal is planar (sp² hybridised). The CN⁻ nucleophile can attack from either face of the plane with equal probability, creating both R and S enantiomers in equal amounts — a racemic mixture."},
    {q:"Draw the mechanism for nucleophilic addition of HCN to propanone.", a:"Step 1: CN⁻ attacks Cδ+ of C=O → C–CN bond forms, O⁻ alkoxide formed (curly arrow from CN⁻ lone pair to C).\nStep 2: H+ from HCN (or solvent) protonates O⁻ → hydroxyl group formed.\nProduct: 2-hydroxy-2-methylpropanenitrile (a hydroxynitrile/cyanohydrin)."},
    {q:"What is the product of reducing an aldehyde with NaBH₄, and what of a ketone?", a:"NaBH₄ (sodium tetrahydridoborate) provides H⁻ as a hydride reducing agent.\nAldehyde + NaBH₄ → primary alcohol\nKetone + NaBH₄ → secondary alcohol\nThe H⁻ acts as a nucleophile, attacking the Cδ+ of C=O."},
    {q:"How does the reaction of aldehydes and ketones with 2,4-DNPH help identify them?", a:"2,4-DNPH (Brady's reagent) reacts with any aldehyde or ketone by condensation to give an orange/yellow solid 2,4-dinitrophenylhydrazone. This confirms the presence of C=O. The melting point of the pure derivative, compared with data tables, identifies the specific compound."},
    {q:"Explain why the addition of 2,4-DNPH is a condensation reaction.", a:"A condensation reaction involves two molecules combining with the elimination of a small molecule (here, water). The –NH₂ group of 2,4-DNPH reacts with the C=O of the aldehyde/ketone: the N attacks C=O → tetrahedral intermediate → water is expelled → C=N bond forms."},
    {q:"Give the pharmaceutical importance of enantiomers, using a specific example.", a:"In biology, receptor sites and enzymes are chiral, so they interact differently with each enantiomer of a drug. Example: ibuprofen — one enantiomer (S) is the active anti-inflammatory, the other (R) is largely inactive but is converted to S in the body. Example: thalidomide — one enantiomer was therapeutic; the other caused birth defects."},
    {q:"Describe the preparation of an aldehyde from a primary alcohol.", a:"React the primary alcohol with acidified potassium dichromate (K₂Cr₂O₇/H₂SO₄) and immediately distil off the aldehyde as it forms. This prevents further oxidation of the aldehyde to a carboxylic acid. The orange solution turns green as Cr₂O₇²⁻ is reduced to Cr³⁺."},
  ]},
    "3.3.9": { title: "Carboxylic Acids & Derivatives", cards: [
    {q:"Describe the structure and properties of carboxylic acids.", a:"Carboxylic acids contain the –COOH functional group. They can form hydrogen bonds (including dimers in liquid/gas phase). Low Mr acids are very soluble in water; solubility decreases as chain length increases. They are weak acids (partially dissociate): RCOOH ⇌ RCOO⁻ + H⁺."},
    {q:"How do carboxylic acids react with carbonates and why is this a useful test?", a:"RCOOH + Na₂CO₃ → RCOONa + H₂O + CO₂↑\nEffervescence (CO₂ gas produced) confirms the presence of –COOH. This distinguishes carboxylic acids from other compounds (e.g. phenols do not react with Na₂CO₃)."},
    {q:"How are esters formed from carboxylic acids, and what are the conditions?", a:"Carboxylic acid + alcohol ⇌ ester + water. Conditions: concentrated H₂SO₄ catalyst, warm (or reflux). The reaction is reversible (Fischer esterification), giving a modest yield. The ester can be identified by its characteristic smell."},
    {q:"How are acyl chlorides made from carboxylic acids?", a:"RCOOH + PCl₅ → RCOCl + POCl₃ + HCl\nor RCOOH + SOCl₂ → RCOCl + SO₂ + HCl\nAcyl chlorides are much more reactive than carboxylic acids. The reactions are irreversible."},
    {q:"Describe the reactions of acyl chlorides with water, alcohols, and amines.", a:"With water: RCOCl + H₂O → RCOOH + HCl (vigorous, steamy fumes)\nWith alcohol: RCOCl + R'OH → RCOOR' + HCl (ester formed, irreversible, no catalyst needed)\nWith amine: RCOCl + R'NH₂ → RCONHR' + HCl (amide formed)\nAll produce HCl (steamy fumes in moist air)."},
    {q:"Why are acyl chlorides preferred over carboxylic acids for making esters in the laboratory?", a:"Reactions of acyl chlorides with nucleophiles are (1) much faster, (2) irreversible (higher yield), and (3) require no acid catalyst. The drawback is that HCl is produced, which is corrosive and requires careful handling."},
    {q:"Describe acid anhydrides and compare them to acyl chlorides.", a:"Acid anhydrides (RCO)₂O react similarly to acyl chlorides but are less reactive (safer). With water → 2 carboxylic acid molecules; with alcohol → ester + carboxylic acid; with amine → amide + carboxylic acid. Used industrially (e.g. ethanoic anhydride for aspirin) as they are cheaper, less corrosive, and easier to handle than acyl chlorides."},
    {q:"Describe the hydrolysis of esters under acidic and alkaline conditions.", a:"Acid hydrolysis: ester + H₂O ⇌ carboxylic acid + alcohol (H₂SO₄/HCl catalyst, reversible, low yield).\nAlkaline hydrolysis (saponification): ester + NaOH → carboxylate salt + alcohol (irreversible, driven by forming stable carboxylate salt → higher yield). Used in soap making."},
    {q:"What are polyesters and how are they made?", a:"Polyesters form by condensation polymerisation between a diol and a dicarboxylic acid (or diacid chloride), releasing H₂O. Example: Terylene (PET) from benzene-1,4-dicarboxylic acid + ethane-1,2-diol. The repeat unit contains an ester link (–COO–). Polyesters can be hydrolysed (unlike addition polymers)."},
    {q:"What are amides and how are they formed?", a:"Amides contain the –CONH– group. They are formed by nucleophilic addition-elimination:\nRCOCl + 2NH₃ → RCONH₂ + NH₄Cl (acyl chloride + excess ammonia)\nRCOCl + RNH₂ → RCONHR + HCl (acyl chloride + amine → N-substituted amide)\nAlternatively from acid anhydride + NH₃ or amine."},
    {q:"What are polyamides (nylons) and how are they made?", a:"Polyamides form by condensation polymerisation between a diamine and a dicarboxylic acid (releasing H₂O) or a diacyl chloride (releasing HCl). Example: nylon-6,6 from hexane-1,6-diamine and hexanedioic acid. Repeat unit contains amide link (–NHCO–). Kevlar is an aromatic polyamide used in bullet-proof vests."},
    {q:"What is the mechanism for acyl chloride reactions (nucleophilic addition-elimination)?", a:"Step 1 (addition): nucleophile (Nu:) attacks the electrophilic C of RCOCl → tetrahedral intermediate with both Nu and Cl attached.\nStep 2 (elimination): Cl⁻ is expelled as the leaving group → product formed.\nOverall: substitution of Cl⁻ by Nu, with tetrahedral intermediate."},
    {q:"How does aspirin synthesis use ethanoic anhydride rather than ethanoyl chloride?", a:"Aspirin is made by reacting salicylic acid with ethanoic anhydride (not ethanoyl chloride). Ethanoic anhydride is cheaper, less corrosive (no HCl formed — by-product is ethanoic acid instead), safer to handle, and less likely to hydrolyse during storage than ethanoyl chloride."},
  ]},
    "3.3.10": { title: "Aromatic Chemistry", cards: [
    {q:"Describe the Kekulé model of benzene and the evidence that disproves it.", a:"Kekulé proposed cyclohexatriene: alternating single and double C–C bonds. Evidence against:\n1. All C–C bonds in benzene are the same length (0.140 nm, between single 0.154 nm and double 0.134 nm).\n2. Benzene does not undergo electrophilic addition (bromine water is not decolourised).\n3. Enthalpy of hydrogenation = −208 kJ/mol, vs predicted −360 kJ/mol (3 × cyclohexene). The 152 kJ/mol difference is the delocalisation (resonance) energy."},
    {q:"Describe the delocalised model of benzene.", a:"Six carbon atoms form a regular hexagonal ring. Each C is sp² hybridised with one p orbital perpendicular to the ring plane. The six p orbitals overlap sideways to form a continuous π electron cloud above and below the ring. All 6 π electrons are fully delocalised, giving extra stability."},
    {q:"Why does benzene undergo electrophilic substitution rather than electrophilic addition?", a:"Benzene's delocalised π system is thermodynamically very stable. Addition would disrupt this delocalisation, giving an unstable product. Substitution allows H to be replaced while the aromatic π system is regenerated, maintaining stability. The energy gain from restoring aromaticity drives the substitution."},
    {q:"Describe the nitration of benzene (conditions, mechanism, electrophile).", a:"Conditions: concentrated HNO₃ + concentrated H₂SO₄ mixture, <55°C (to avoid polynitration).\nH₂SO₄ protonates HNO₃: HNO₃ + H₂SO₄ → NO₂⁺ + H₂O + HSO₄⁻. The nitronium ion (NO₂⁺) is the electrophile.\nMechanism: NO₂⁺ attacks π ring → arenium ion intermediate (delocalisation lost) → H⁺ lost, restoring aromaticity → nitrobenzene."},
    {q:"Describe halogenation of benzene (conditions and role of the halogen carrier).", a:"Benzene + Cl₂ (or Br₂) + halogen carrier (AlCl₃ or FeBr₃) → chlorobenzene/bromobenzene + HCl/HBr.\nThe Lewis acid catalyst polarises the halogen molecule: Cl₂ + AlCl₃ → Cl⁺···[AlCl₄]⁻. The Cl⁺ electrophile attacks the ring → arenium ion → H⁺ lost → product; AlCl₃ regenerated."},
    {q:"Describe Friedel-Crafts acylation of benzene.", a:"Benzene + acyl chloride (RCOCl) + AlCl₃ catalyst → aryl ketone + HCl.\nAlCl₃ generates the acylium ion RCO⁺ (electrophile): RCOCl + AlCl₃ → RCO⁺ + [AlCl₄]⁻.\nRCO⁺ attacks ring → arenium ion → H⁺ lost → phenyl ketone.\nUsed to introduce C=O groups into aromatic rings."},
    {q:"Why is phenol much more reactive than benzene toward electrophilic substitution?", a:"The lone pair on oxygen in the –OH group is partially delocalised into the benzene ring. This increases electron density in the ring (particularly at ortho and para positions), making electrophilic attack easier. Phenol reacts with Br₂(aq) without a catalyst and at room temperature."},
    {q:"Describe the reaction of phenol with bromine water.", a:"Phenol + 3Br₂(aq) → 2,4,6-tribromophenol (white precipitate) + 3HBr.\nNo catalyst needed; three Br atoms substitute at positions 2, 4, and 6 (activated by the –OH group). The orange Br₂ solution decolourises and a white ppt forms. This is also used as a test for phenol."},
    {q:"What are activating and deactivating substituents on benzene, and how do they direct further substitution?", a:"Activating (electron-donating) groups: –OH, –NH₂, –CH₃ make the ring more reactive and direct new electrophiles to ortho and para positions.\nDeactivating (electron-withdrawing) groups: –NO₂, –CHO, –COOH reduce reactivity and direct to meta positions."},
    {q:"Give the industrial importance of aromatic chemistry.", a:"Benzene is the starting material for many important compounds: nitrobenzene → aniline → dyes and pharmaceuticals; Friedel-Crafts → ketones for pharmaceuticals; chlorobenzene → pesticides; styrene (from ethylbenzene) → polystyrene. Aromatic chemistry underpins the dye, pharmaceutical, and polymer industries."},
    {q:"Explain the general mechanism for electrophilic aromatic substitution (EAS).", a:"Step 1: electrophile (E⁺) attacks one carbon of the aromatic ring, forming a positively charged intermediate (arenium ion / sigma complex) where the ring is no longer aromatic.\nStep 2: H⁺ is eliminated from the sp³ carbon, restoring the aromatic π system and giving the substituted product. Overall: one H replaced by E."},
  ]},
    "3.3.11": { title: "Amines", cards: [
    {q:"Classify amines as primary, secondary, and tertiary and give an example of each.", a:"Primary: one C attached to N. Example: CH₃NH₂ (methylamine).\nSecondary: two C attached to N. Example: (CH₃)₂NH (dimethylamine).\nTertiary: three C attached to N. Example: (CH₃)₃N (trimethylamine).\nAll have a lone pair on N, which makes them bases and nucleophiles."},
    {q:"Why are aliphatic amines stronger bases than ammonia, and why are aryl amines weaker?", a:"Aliphatic amines: alkyl groups push electrons towards N (positive inductive effect), increasing lone pair electron density → stronger base than NH₃.\nAryl amines (e.g. aniline): the N lone pair is partially delocalised into the benzene ring (conjugation), making it less available for protonation → weaker base than NH₃.\nBase strength order: aliphatic amine > NH₃ > aryl amine."},
    {q:"How are aliphatic amines made by reduction of nitriles?", a:"Nitrile + 2H₂ (+ Ni catalyst) or LiAlH₄ (in dry ether) → primary amine\nRCN + 2H₂ → RCH₂NH₂\nThe carbon chain is extended by one carbon if the nitrile was made from a halogenoalkane + KCN. This is a useful chain-extension route in synthesis."},
    {q:"How are primary amines made from halogenoalkanes and ammonia?", a:"Halogenoalkane + excess NH₃ (in sealed tube/ethanol) → primary amine + HX.\nExcess NH₃ suppresses formation of secondary and tertiary amines (the product RNH₂ is itself a nucleophile and can react further with RX, forming a mixture). The product is often obtained as a salt (RNH₃⁺)."},
    {q:"How is aniline (phenylamine) prepared from nitrobenzene?", a:"Nitrobenzene is reduced using Sn/conc. HCl (reflux): PhNO₂ + 6[H] → PhNH₂ + 2H₂O.\nIn acid, aniline is formed as the ammonium salt PhNH₃⁺Cl⁻. Adding NaOH liberates the free amine: PhNH₃⁺ + OH⁻ → PhNH₂ + H₂O."},
    {q:"How do amines react with acyl chlorides?", a:"Amine + acyl chloride → amide + HCl\nRNH₂ + R'COCl → R'CONHR + HCl\nThe amine acts as a nucleophile; the reaction is nucleophilic addition-elimination. Excess amine is used to neutralise the HCl produced."},
    {q:"What is a diazonium salt and how is it formed?", a:"Diazonium salts (ArN₂⁺Cl⁻) are formed by diazotisation: aromatic amine + NaNO₂ + HCl at 0–5°C.\nArNH₂ + NaNO₂ + HCl → ArN₂⁺Cl⁻ + 2H₂O\nTemperature must be kept below 10°C; diazonium ions decompose above this temperature. They are important intermediates in azo dye synthesis."},
    {q:"Describe the coupling reaction of diazonium salts to form azo dyes.", a:"ArN₂⁺ (diazonium ion) + PhOH (phenol) or PhNH₂ (amine) in alkaline solution → Ar–N=N–Ar' (azo compound) — brightly coloured.\nThe diazonium ion is a weak electrophile that attacks the highly activated aromatic ring of phenol or amine at the para position. Azo dyes are widely used in textiles, food colouring, and inks."},
    {q:"How do amines act as nucleophiles with halogenoalkanes?", a:"RNH₂ + R'X → R'NHR + HX (secondary amine)\nFurther alkylation: R'NHR + R'X → R'₂NR + HX (tertiary amine); then R'₂NR + R'X → R'₃NR⁺X⁻ (quaternary ammonium salt).\nA mixture of products is usually obtained, so this is not a clean route to a pure primary amine."},
    {q:"What are quaternary ammonium salts and what are their uses?", a:"Quaternary ammonium salts have N bonded to four C groups and carry a permanent + charge (no lone pair, no longer basic). They are used as cationic surfactants in fabric softeners and hair conditioners — the positive charge is attracted to negatively charged surfaces (hair and fabric)."},
    {q:"Why do amines generally have lower boiling points than alcohols of similar Mr?", a:"Amines can hydrogen bond through N–H···N, but N is less electronegative than O. The N–H···N hydrogen bonds are weaker than the O–H···O hydrogen bonds in alcohols, so amines require less energy to separate and have lower boiling points."},
  ]},
    "3.3.12": { title: "Polymers", cards: [
    {q:"Distinguish between addition and condensation polymerisation.", a:"Addition polymerisation: unsaturated monomers (alkenes) react to form a long saturated polymer with no other products. All atoms of the monomer appear in the polymer.\nCondensation polymerisation: bifunctional monomers react and a small molecule is eliminated (usually H₂O or HCl). The polymer contains fewer atoms than the sum of the monomers."},
    {q:"How do you draw the repeat unit of an addition polymer from its monomer?", a:"Remove the double bond from the monomer and add single bonds either side; place in square brackets with bonds extending through and 'n' subscript. Example: CH₂=CHCH₃ → [–CH₂–CH(CH₃)–]ₙ (poly(propene))."},
    {q:"Give three examples of addition polymers, their monomers, and uses.", a:"Poly(ethene): monomer CH₂=CH₂; uses: plastic bags, bottles.\nPVC (poly(chloroethene)): monomer CH₂=CHCl; uses: pipes, cable insulation.\nPTFE (poly(tetrafluoroethene)): monomer CF₂=CF₂; uses: non-stick cookware, waterproof clothing (Gore-Tex)."},
    {q:"How is a polyester formed? Give an example.", a:"Diol + dicarboxylic acid → polyester + H₂O (condensation)\nExample: Terylene/PET from ethane-1,2-diol + benzene-1,4-dicarboxylic acid.\nRepeat unit contains the ester link (–COO–). The reaction is condensation polymerisation."},
    {q:"How is nylon-6,6 formed and what is its repeat unit?", a:"Hexane-1,6-diamine + hexanedioic acid → nylon-6,6 + H₂O\nor diacyl chloride + diamine → nylon + HCl.\nRepeat unit: [–NH(CH₂)₆NH–CO(CH₂)₄CO–]ₙ\nThe amide link (–NHCO–) is the key feature."},
    {q:"Why can condensation polymers be hydrolysed but addition polymers cannot?", a:"Condensation polymers (polyesters, polyamides) contain ester or amide links (C–O or C–N bonds) which can be attacked by water under acidic or alkaline conditions, breaking the polymer into its monomers. Addition polymers have only C–C bonds in the backbone, which are non-polar and resistant to hydrolysis."},
    {q:"What are the environmental problems with non-biodegradable polymers?", a:"Accumulate in landfill (don't break down for hundreds of years). Pollute oceans and waterways (microplastics harm marine life). Incineration releases CO₂ and toxic gases. Recycling requires energy for collection, sorting, and reprocessing, and polymers often downgrade in quality on recycling."},
    {q:"Describe recycling and other disposal methods for polymers.", a:"Mechanical recycling: melting and remoulding (quality decreases with reuse).\nChemical recycling: hydrolysis of condensation polymers back to monomers; cracking of addition polymers to smaller hydrocarbons.\nIncineration: recovers energy but produces CO₂/toxic gases.\nBiodegradable polymers: designed to break down by microbes (e.g. poly(lactic acid) from renewable sources)."},
    {q:"What is Kevlar and why is it particularly strong?", a:"Kevlar is an aromatic polyamide (aramid): benzene-1,4-diamine + benzene-1,4-dicarboxylic acid. The rigid phenyl rings and amide links form extensive intermolecular hydrogen bonds between polymer chains. These strong, aligned H-bonds give Kevlar its exceptional tensile strength, used in bullet-proof vests."},
    {q:"What is the atom economy of addition polymerisation compared to condensation polymerisation?", a:"Addition polymerisation has 100% atom economy — all atoms of the monomer end up in the polymer, with no by-products.\nCondensation polymerisation has less than 100% atom economy — a small molecule (H₂O or HCl) is lost for each monomer unit added."},
  ]},
    "3.3.13": { title: "Amino Acids, Proteins & DNA", cards: [
    {q:"What is the general structure of an α-amino acid?", a:"An α-amino acid has an –NH₂ group and a –COOH group both attached to the same (α) carbon. General formula: RCH(NH₂)COOH where R is the side chain. All natural amino acids (except glycine) have a chiral α-carbon."},
    {q:"What is a zwitterion and at what pH does it form?", a:"A zwitterion is the form of an amino acid at the isoelectric point (pI) — the pH at which the amino acid carries zero net charge. The –NH₂ is protonated to –NH₃⁺ and the –COOH is deprotonated to –COO⁻. The charges cancel, but the molecule carries both + and − charges simultaneously."},
    {q:"How does pH affect the form of an amino acid?", a:"Below isoelectric point (acidic solution): –NH₃⁺ and –COOH, net charge +1.\nAt isoelectric point: –NH₃⁺ and –COO⁻, net charge 0 (zwitterion).\nAbove isoelectric point (alkaline solution): –NH₂ and –COO⁻, net charge −1."},
    {q:"Describe peptide bond formation and hydrolysis.", a:"Two amino acids condense (–COOH + –NH₂ → –CO–NH– + H₂O), forming a peptide bond (amide link). The product is a dipeptide. A polypeptide chain has many amino acid residues linked by peptide bonds.\nHydrolysis (reverse): acid/base or enzyme (protease) + H₂O breaks peptide bonds, regenerating the amino acids."},
    {q:"Describe the four levels of protein structure.", a:"Primary: sequence of amino acid residues (covalent peptide bonds).\nSecondary: local folding via H-bonds between C=O and N–H of the backbone → α-helix or β-sheet.\nTertiary: 3D folding of the whole chain via H-bonds, ionic bonds, disulfide bridges (–S–S–, between Cys residues), and van der Waals forces.\nQuaternary: association of two or more polypeptide chains."},
    {q:"What types of interactions stabilise the tertiary structure of a protein?", a:"1. Hydrogen bonds between polar R-groups.\n2. Ionic bonds between oppositely charged R-groups.\n3. Disulfide bridges: covalent –S–S– bonds formed by oxidation of two cysteine –SH groups.\n4. Van der Waals (London dispersion) forces between non-polar R-groups."},
    {q:"What are enzymes and how are they specific?", a:"Enzymes are biological catalysts (proteins) with an active site — a region complementary in shape, charge, and polarity to the substrate. Only the substrate with the correct shape and chemistry can bind (lock-and-key or induced fit model). This specificity means each enzyme catalyses only one or a few related reactions."},
    {q:"What is the structure of a nucleotide in DNA?", a:"A DNA nucleotide consists of:\n1. A deoxyribose sugar (5-carbon)\n2. A phosphate group\n3. One of four nitrogenous bases: adenine (A), thymine (T), guanine (G), or cytosine (C).\nThe nucleotides are joined by phosphodiester bonds between the sugar of one nucleotide and the phosphate of the next."},
    {q:"Describe the structure of the DNA double helix and the base-pairing rules.", a:"DNA consists of two antiparallel polynucleotide strands wound in a right-handed double helix. The sugar-phosphate backbones are on the outside; the bases point inward.\nBase pairing (complementary): A pairs with T (2 H-bonds); G pairs with C (3 H-bonds). The H-bonds hold the two strands together."},
    {q:"Why do G–C pairs give greater stability to DNA than A–T pairs?", a:"G–C pairs are held together by 3 hydrogen bonds, whereas A–T pairs have only 2 hydrogen bonds. Sequences with a higher proportion of G–C pairs require more energy to separate (higher melting temperature)."},
    {q:"Summarise how cis-platin interacts with DNA.", a:"Cis-platin is a square planar complex [Pt(NH₃)₂Cl₂]. Inside the cell, chloride ligands are slowly replaced by water: [Pt(NH₃)₂(H₂O)₂]²⁺. The activated complex forms coordinate bonds with two adjacent guanine bases on the same DNA strand, cross-linking and distorting the double helix. This blocks DNA replication, killing the (cancer) cell."},
    {q:"Explain the biological importance of chirality in amino acids.", a:"All naturally occurring amino acids (except glycine) are L-enantiomers. Enzymes and ribosomes are chiral, so they process only L-amino acids. D-amino acids occur in some bacterial cell walls but are not incorporated into human proteins. This biochemical homochirality is fundamental to protein function."},
  ]},
    "3.3.14": { title: "Organic Synthesis", cards: [
    {q:"What is the retrosynthesis approach and why is it useful?", a:"Retrosynthesis (working backwards): start with the target molecule and identify what simpler precursor it could be made from, and what reaction converts the precursor to the target. Repeat until you reach an available starting material. This systematic approach helps plan multi-step syntheses efficiently."},
    {q:"Summarise AS-level synthesis routes FROM alkanes and alkenes.", a:"Alkane → halogenoalkane: FRS with X₂/UV light.\nAlkene → halogenoalkane: add HX (Markovnikov's rule).\nAlkene → dihaloalkane: add X₂ (electrophilic addition).\nAlkene → alcohol: H₂O/H₃PO₄ catalyst, 300°C (direct hydration)."},
    {q:"Summarise AS-level synthesis routes FROM halogenoalkanes.", a:"Halogenoalkane → alcohol: NaOH(aq), warm (nucleophilic substitution).\nHalogenoalkane → alkene: KOH in ethanol, heat (elimination).\nHalogenoalkane → nitrile: KCN in ethanol, reflux (chain extended by 1C).\nHalogenoalkane → amine: excess NH₃ in ethanol, sealed tube, heat."},
    {q:"Summarise key functional group interconversions in synthesis (A2 level).", a:"Primary alcohol → aldehyde: K₂Cr₂O₇/H₂SO₄, distil\nPrimary alcohol → carboxylic acid: K₂Cr₂O₇/H₂SO₄, reflux\nSecondary alcohol → ketone: K₂Cr₂O₇/H₂SO₄, reflux\nAlcohol → ester: carboxylic acid + H₂SO₄, reflux\nCarboxylic acid → acyl chloride: PCl₅ or SOCl₂\nNitrile → amine: LiAlH₄ in dry ether\nNitrobenzene → aniline: Sn/HCl, then NaOH"},
    {q:"How do you extend a carbon chain in synthesis?", a:"Halogenoalkane + KCN → nitrile (chain extended by 1 C, can be hydrolysed to COOH or reduced to amine)\nHydroxynitrile: carbonyl compound + HCN → cyanohydrin (chain extended by 1 C)\nFriedel-Crafts acylation: ArH + RCOCl/AlCl₃ → Ar-CO-R (introduces C=O into aromatic ring)"},
    {q:"What practical techniques are used to isolate and purify organic products?", a:"Recrystallisation: dissolve crude solid in minimum hot solvent; cool to crystallise pure product; filter under vacuum.\nDistillation: separate liquids of different boiling points.\nSolvent extraction: separating funnel — shake with solvent in which product is more soluble; separate aqueous and organic layers.\nDrying: anhydrous MgSO₄, CaCl₂, or Na₂SO₄ to remove water from organic layer.\nReflux: heat reaction mixture with condenser to prevent boiling away."},
    {q:"What is green chemistry and how does it apply to organic synthesis?", a:"Green chemistry aims to minimise environmental impact:\n1. Maximise atom economy (choose reactions that convert most atoms into useful product).\n2. Use renewable feedstocks (bio-based starting materials).\n3. Use catalysts (reduce energy use and waste).\n4. Use safer solvents (water or recoverable solvents over volatile organics).\n5. Design shorter routes (fewer steps → less waste and energy)."},
    {q:"What precautions and techniques are used when handling hazardous reagents in synthesis?", a:"Corrosive reagents (HCl, H₂SO₄): use in fume cupboard; wear gloves and eye protection.\nToxic gases (HCN, HCl fumes): work in fume cupboard.\nFlammable solvents (ethanol, diethyl ether): no naked flames; work with electrical heating.\nReflux: use anti-bumping granules; ensure condenser water is flowing before heating."},
    {q:"Describe a two-step synthesis of an ester from a primary alcohol.", a:"Step 1: Primary alcohol → carboxylic acid: oxidise with excess K₂Cr₂O₇/H₂SO₄ under reflux conditions.\nStep 2: Carboxylic acid + alcohol (could be different) → ester: heat with concentrated H₂SO₄ catalyst (Fischer esterification). Product separated by distillation and purification."},
    {q:"How would you convert benzene to an amine in multiple steps?", a:"Step 1: Benzene → nitrobenzene: conc. HNO₃ + conc. H₂SO₄, <55°C (nitration).\nStep 2: Nitrobenzene → aniline (phenylamine): Sn + conc. HCl, reflux → forms PhNH₃⁺Cl⁻; then add NaOH → PhNH₂ (free amine)."},
    {q:"What information do IR and MS data give you when planning a synthesis or confirming a product?", a:"MS: molecular ion peak gives Mr; fragmentation gives structural clues about carbon skeleton and functional groups.\nIR: identifies functional groups (C=O, O–H, N–H, C–H absorptions). Comparison of product IR with starting material confirms transformation has occurred (e.g. loss of O–H, gain of C=O → oxidation of alcohol to ketone)."},
  ]},
    "3.3.15": { title: "NMR Spectroscopy", cards: [
    {q:"What is the physical basis of NMR spectroscopy?", a:"Certain nuclei with an odd number of protons or neutrons (e.g. ¹H, ¹³C) have a spin and behave like tiny magnets. In an external magnetic field they align parallel or antiparallel. When irradiated with radiofrequency radiation of the correct frequency, nuclei flip between these states, absorbing energy. This resonance is detected."},
    {q:"What is chemical shift (δ) and why is TMS used as the reference standard?", a:"Chemical shift (δ) is measured in ppm and reports the resonance frequency of a nucleus relative to TMS (tetramethylsilane, Si(CH₃)₄, set to δ = 0).\nTMS is used because: all 12 H are equivalent (one peak); the peak appears upfield (δ = 0) away from most organic signals; TMS is inert, non-toxic, and has a low bp (easily removed)."},
    {q:"How does ¹³C NMR differ from ¹H NMR in the information it provides?", a:"¹³C NMR: each peak represents a distinct carbon environment; peak height is not proportional to number of carbons; no spin-spin splitting is observed. Used to count the number of distinct C environments.\n¹H NMR: peak integration gives relative number of H; spin-spin splitting observed; chemical shift identifies functional group environment."},
    {q:"What is the n+1 rule (spin-spin splitting)?", a:"A proton with n equivalent adjacent protons (on neighbouring carbons) is split into n+1 peaks:\n0 adjacent H → singlet (1 peak)\n1 adjacent H → doublet (2 peaks)\n2 adjacent H → triplet (3 peaks)\n3 adjacent H → quartet (4 peaks)\nThe coupling occurs between non-equivalent protons on adjacent (neighbouring) carbons."},
    {q:"What information can be obtained from a ¹H NMR spectrum?", a:"1. Number of peaks → number of distinct proton environments.\n2. Chemical shift of each peak → type of environment (functional group nearby).\n3. Integration ratio (relative area) → ratio of H atoms in each environment.\n4. Splitting pattern → number of adjacent non-equivalent H atoms (n+1 rule)."},
    {q:"Give the approximate chemical shift ranges for common proton environments.", a:"CH₃ in alkyl: ~0.9 ppm\nCH₂ in alkyl: ~1.3 ppm\nC–H next to C=O: ~2–3 ppm\nO–CH₃ / O–CH₂: ~3.5 ppm\nAr–H (aromatic): ~7–8 ppm\nO–H (alcohol): ~1–5 ppm (variable, broad)\nCHO (aldehyde): ~9–10 ppm\nCOOH: ~10–12 ppm"},
    {q:"How are O–H and N–H protons identified in ¹H NMR?", a:"O–H and N–H protons are exchangeable: they give broad peaks at variable chemical shift positions. Adding D₂O to the sample causes these peaks to disappear (D exchanges with H), confirming they are O–H or N–H groups."},
    {q:"How is a ¹H NMR spectrum interpreted to identify an unknown organic compound?", a:"1. Count the number of peaks → number of distinct H environments.\n2. Use integration ratios → relative numbers of H in each environment.\n3. Match chemical shifts to functional group types.\n4. Use splitting patterns (n+1) to determine adjacent H counts.\n5. Combine with MS (for Mr and molecular formula) and IR (for functional groups) for full structure assignment."},
    {q:"Explain the ¹H NMR spectrum expected for ethanol (CH₃CH₂OH).", a:"Three types of H:\n1. CH₃ (δ ~1.2 ppm, triplet — 2 adjacent H on CH₂, integration 3H)\n2. CH₂ (δ ~3.7 ppm, quartet — 3 adjacent H on CH₃, integration 2H)\n3. OH (δ ~2–5 ppm, singlet, broad, integration 1H; disappears on adding D₂O)"},
    {q:"Why might two protons in a molecule not be equivalent (non-equivalent) even if they appear similar?", a:"Two protons are equivalent only if swapping them gives an identical molecule (related by a symmetry operation). Example: in CH₃CHBrCH₃, the two CH₃ groups are equivalent (mirror symmetry). In CH₃CHBrCH₂CH₃, the two groups flanking the chiral centre are different environments and give separate peaks."},
    {q:"How does ¹³C NMR help with structure determination?", a:"Each distinct carbon environment gives exactly one peak in the ¹³C spectrum. Comparing the number of peaks with the molecular formula reveals whether any carbons are equivalent (fewer peaks than C atoms = some equivalent carbons). Example: benzene gives only 1 ¹³C peak (all 6 C equivalent); methylbenzene gives 4 peaks."},
    {q:"What solvent is typically used in NMR and why?", a:"Deuterated solvents (e.g. CDCl₃, D₂O, DMSO-d₆) are used because they do not produce ¹H NMR signals that would overlap with the sample. Deuterium (²H) has a very different resonance frequency from ¹H and does not interfere with the spectrum."},
  ]},
  "3.3.16": { title: "Chromatography", cards: [
    {q:"State the general principle of chromatography.", a:"All chromatography separates mixtures based on the differential distribution of components between:\n• Stationary phase — does not move (e.g. silica in TLC, liquid film in GC).\n• Mobile phase — moves through the stationary phase (e.g. solvent in TLC, carrier gas in GC).\nComponents that interact more strongly with the stationary phase move more slowly; those that interact more with the mobile phase move faster. Separation arises from differences in these interactions."},
    {q:"Define Rf value and explain what it tells you.", a:"Rf = distance moved by compound ÷ distance moved by solvent front.\nRf is dimensionless and always between 0 and 1.\nA high Rf: compound has greater affinity for the mobile phase (less attracted to stationary phase).\nA low Rf: compound is more strongly adsorbed onto the stationary phase.\nRf values are characteristic of a compound under fixed conditions (same solvent, stationary phase, temperature) and can be used for identification."},
    {q:"Describe how TLC is carried out and how compounds are visualised.", a:"1. Draw a pencil baseline 1 cm from the bottom of a silica-coated TLC plate.\n2. Apply a small spot of sample using a capillary tube.\n3. Place plate in a sealed developing chamber with solvent level below the baseline.\n4. Allow solvent to rise; remove plate before solvent reaches the top.\n5. Mark solvent front immediately and allow to dry.\nVisualisation: UV lamp (dark spots on fluorescent plate); iodine vapour (yellow-brown spots); ninhydrin spray (purple spots for amino acids)."},
    {q:"How is TLC used to identify a compound and check purity?", a:"Identification: co-spot the unknown alongside a known reference compound on the same plate; if both give a single spot at the same Rf, they are likely the same compound. Use a second different solvent to confirm.\nPurity: a pure compound gives a single spot. Multiple spots indicate impurities are present."},
    {q:"How does column chromatography work and what is its advantage over TLC?", a:"A column is packed with silica (stationary phase). The mixture is loaded at the top and solvent (mobile phase) flows through under gravity.\nComponents with less affinity for silica (less polar) elute first; more polar compounds elute later.\nFractions are collected separately and analysed by TLC.\nAdvantage over TLC: column chromatography is preparative — it separates and collects useful quantities of pure compound; TLC is purely analytical (small scale, cannot collect product)."},
    {q:"Describe the principle and operation of gas chromatography (GC).", a:"In GC:\n• Stationary phase: high-boiling liquid coated on a solid support inside a long, coiled column housed in a thermostatted oven.\n• Mobile phase: inert carrier gas (N₂ or He).\nThe sample is injected and vaporised; the carrier gas sweeps it through the column.\nSeparation is based on boiling point AND interaction with the stationary phase. Components with lower boiling points or weaker interactions with the stationary phase elute earlier.\nA detector (often FID or mass spectrometer) generates a peak when each component exits the column."},
    {q:"What is retention time in gas chromatography and how is it used?", a:"Retention time (tR): the time from sample injection to the peak maximum at the detector, for a given compound.\nRetention time is characteristic of a compound under fixed conditions (column type, temperature, carrier gas flow rate).\nUse: compare the retention time of an unknown with those of reference standards run under identical conditions to identify the unknown.\nLonger retention time: compound has a higher boiling point or interacts more strongly with the stationary phase."},
    {q:"Describe GC-MS (gas chromatography–mass spectrometry) and its advantages.", a:"GC separates the components of a mixture by retention time. As each component elutes, it enters a mass spectrometer:\n• The MS ionises and fragments the compound → characteristic mass spectrum.\n• The fragmentation pattern is compared against a database for definitive identification.\nAdvantages of GC-MS:\n• Combines separation (GC) with unambiguous identification (MS database match).\n• Extremely sensitive (parts per billion).\n• Rapid analysis of complex mixtures.\n• Applications: forensics (drug testing, fire investigation), environmental monitoring, food safety, pharmaceutical QC."},
    {q:"Describe HPLC (high-performance liquid chromatography) and when it is used.", a:"In HPLC, a high-pressure pump forces solvent (mobile phase) through a column of very fine silica particles (stationary phase) at high pressure.\nThis gives much higher resolution and faster analysis than standard column chromatography.\nUsed for: non-volatile or thermally unstable compounds that cannot be vaporised for GC (e.g. proteins, drugs, polar biomolecules).\nApplications: pharmaceutical analysis (drug purity, blood levels), protein analysis, environmental water testing.\nDetectors: UV/visible absorbance, fluorescence, or mass spectrometer.\nReverse-phase HPLC (most common): non-polar C18 stationary phase, polar solvent (water/methanol) mobile phase."},
    {q:"Compare the four main chromatographic techniques: TLC, column chromatography, GC, and HPLC.", a:"TLC: stationary = silica on plate; mobile = organic solvent; analytical only; Rf values; room temperature.\nColumn chromatography: stationary = silica in column; mobile = organic solvent; preparative; fractions collected.\nGC: stationary = liquid film on solid support; mobile = inert carrier gas; sample must be volatile; retention times; detectors include MS.\nHPLC: stationary = fine silica (or C18 reverse phase); mobile = solvent at high pressure; used for non-volatile compounds; high resolution.\nAll exploit differential affinity for stationary vs mobile phase."},
    {q:"How does the polarity of the mobile phase affect Rf values in TLC on a silica plate?", a:"Silica is polar; it adsorbs polar compounds more strongly (lower Rf) and non-polar compounds less strongly (higher Rf).\nMore polar mobile phase (solvent): competes more effectively with compound–silica interactions → all compounds move further → higher Rf values.\nLess polar mobile phase: compounds remain closer to baseline → lower Rf.\nOptimal separation: choose a solvent that spreads spots across Rf = 0.2–0.8; if spots are too close, increase solvent polarity."},
  ]},

  "RP1a": { title: "Measurement of Enthalpy of Combustion", cards: [
    {q: "What is the standard enthalpy of combustion?", a: "The enthalpy change when one mole of a substance is completely burned in excess oxygen under standard conditions (298 K, 100 kPa)."},
    {q: "What apparatus is used to measure enthalpy of combustion experimentally?", a: "A spirit burner containing the fuel, a metal calorimeter (copper or aluminium can) holding a known mass of water, a thermometer, and a clamp stand."},
    {q: "What measurements must be recorded during a combustion calorimetry experiment?", a: "1. Initial mass of spirit burner + fuel (with cap)\n2. Initial temperature of the water\n3. Final temperature of the water\n4. Final mass of spirit burner + fuel after extinguishing"},
    {q: "How is the heat energy transferred to the water calculated?", a: "q = m × c × ΔT\nwhere m = mass of water in grams, c = 4.18 J g⁻¹ K⁻¹, ΔT = temperature rise in °C or K."},
    {q: "How is the molar enthalpy of combustion calculated from q?", a: "ΔcH = −q ÷ n\nwhere n = moles of fuel burned = mass burned ÷ molar mass of fuel.\nConvert q from J to kJ by dividing by 1000. The sign is negative (exothermic)."},
    {q: "Why does the experimental value for enthalpy of combustion differ from the data book value?", a: "Heat loss to the surroundings and the calorimeter itself.\nIncomplete combustion of the fuel.\nEvaporation of fuel from the wick.\nThe experiment is not at standard conditions."},
    {q: "Why is the experimental ΔcH always less exothermic than the data book value?", a: "Significant heat is lost to the surroundings rather than all being absorbed by the water, so the measured temperature rise is smaller than expected."},
    {q: "How can heat loss to the surroundings be reduced in this experiment?", a: "Draught shield around the apparatus.\nLid on the calorimeter.\nLagging (insulation) around the calorimeter.\nUsing a polished can to reduce radiation losses."},
    {q: "Why should the base of the calorimeter be close to the flame but not touching it?", a: "To maximise heat transfer from the flame to the water while avoiding direct contact that could cause soot deposits and uneven heating."},
    {q: "What safety precautions are needed when burning flammable liquids?", a: "Keep away from naked flames when not in use.\nEnsure the cap is on the spirit burner when not burning.\nWork in a well-ventilated area.\nDo not overfill the spirit burner."},
    {q: "What is soot formation and why is it a problem in this practical?", a: "Soot (carbon particles) deposits on the base of the can when combustion is incomplete. It reduces heat transfer to the water and means not all fuel energy is released as heat."},
    {q: "Why is a copper or aluminium can preferred over glass as the calorimeter?", a: "Metals are good conductors of heat, so they transfer heat to the water more efficiently. Glass is a poor conductor and would absorb more heat itself."},
    {q: "How does the mass of water in the calorimeter affect the temperature rise?", a: "A larger mass of water gives a smaller temperature rise for the same heat released, making measurement less precise. A smaller mass gives a larger, more measurable ΔT."},
    {q: "What is the specific heat capacity of water and what are its units?", a: "c = 4.18 J g⁻¹ K⁻¹ (or 4180 J kg⁻¹ K⁻¹).\nThis means 4.18 J of energy are needed to raise 1 g of water by 1 K."},
    {q: "What does it mean for combustion to be incomplete, and how does it affect the result?", a: "Incomplete combustion means carbon monoxide or soot is produced instead of CO₂. Less energy is released per mole of fuel, so the measured ΔcH is less exothermic than the true value."},
    {q: "How would you improve the accuracy of the enthalpy of combustion experiment?", a: "Use a bomb calorimeter to prevent heat loss.\nAvoid soot by ensuring excess oxygen supply.\nUse a thermometer reading to 0.1°C.\nRepeat and average results."}
  ]},

  "RP1b": { title: "Measurement of Enthalpy of Reaction", cards: [
    {q: "What type of calorimeter is used to measure enthalpy changes in solution?", a: "A polystyrene (expanded foam) cup calorimeter, which provides good insulation to minimise heat loss."},
    {q: "What reactions can be studied using a polystyrene cup calorimeter?", a: "Neutralisation reactions (acid + base), displacement reactions (e.g. Zn + CuSO₄), and dissolution reactions."},
    {q: "Describe the method for measuring enthalpy of neutralisation using a polystyrene cup.", a: "1. Measure 25 cm³ of alkali into the cup using a pipette.\n2. Record initial temperature every minute for 3 minutes.\n3. Add 25 cm³ of acid at the 4th minute (do not record at minute 4).\n4. Stir and record temperature every minute from minute 5 to minute 10.\n5. Extrapolate graph to find maximum temperature."},
    {q: "Why is the temperature recorded before the reaction as well as after?", a: "To establish a baseline and allow extrapolation back to the mixing point, giving a more accurate ΔT that accounts for any cooling during the experiment."},
    {q: "Why is a polystyrene cup preferred over a glass beaker?", a: "Polystyrene is a poor conductor of heat and provides good insulation, minimising heat loss to the surroundings and giving more accurate results."},
    {q: "How is ΔH per mole calculated from a neutralisation experiment?", a: "1. Calculate q = m × c × ΔT (use total mass of solution = mass of acid + mass of base).\n2. Find moles of limiting reagent.\n3. ΔH = −q ÷ n (in kJ mol⁻¹)."},
    {q: "Why is the sign of ΔH negative for neutralisation reactions?", a: "Neutralisation is exothermic — the temperature of the surroundings rises, meaning heat is released by the system into the solution."},
    {q: "What assumptions are made when calculating ΔH from a polystyrene cup experiment?", a: "1. The density of the solution is 1 g cm⁻³ (same as water).\n2. The specific heat capacity of the solution is 4.18 J g⁻¹ K⁻¹.\n3. All heat is transferred to the solution (none lost to cup or thermometer)."},
    {q: "How does the polystyrene cup experiment differ from a bomb calorimeter?", a: "The polystyrene cup is open to the atmosphere (constant pressure), measures enthalpy change directly, and has significant heat losses. A bomb calorimeter is closed (constant volume), measures internal energy change, and has much less heat loss — giving more accurate values."},
    {q: "What sources of error exist in the polystyrene cup method?", a: "Heat loss to the surroundings and the cup.\nApproximation of density as 1 g cm⁻³.\nApproximation of specific heat capacity.\nHeat capacity of the thermometer and cup ignored.\nInaccurate temperature reading if stirring is poor."},
    {q: "How can accuracy be improved in the polystyrene cup method?", a: "Use a lid on the cup.\nExtrapolate the temperature–time graph to the mixing point.\nUse a more precise thermometer (0.1°C resolution).\nEnsure thorough stirring for even mixing."},
    {q: "How do you extrapolate a temperature–time graph to find the maximum temperature rise?", a: "Plot temperature vs. time. The cooling section after the peak follows a straight line — extrapolate this line back to the time of mixing to find the temperature at the moment of maximum reaction, before cooling began."},
    {q: "What is the enthalpy of neutralisation for all strong acid–strong base reactions, and why?", a: "Approximately −57 kJ mol⁻¹ for all strong acid–strong base combinations, because the net ionic equation is always: H⁺(aq) + OH⁻(aq) → H₂O(l)."},
    {q: "Why is the enthalpy of neutralisation less exothermic for weak acids or weak bases?", a: "Energy is required to fully dissociate the weak acid or base, so some of the heat released by the H⁺ + OH⁻ reaction is used for dissociation, giving a less negative overall ΔH."},
    {q: "In a displacement reaction such as Zn(s) + CuSO₄(aq), what mass is used in q = mcΔT?", a: "The mass of the solution only (the copper sulfate solution), not the mass of zinc added, since the zinc is a solid and we assume only the aqueous solution absorbs the heat."}
  ]},

  "RP2": { title: "Rates of Reaction – Clock Reaction", cards: [
    {q: "What is a clock reaction, and why is it useful for measuring reaction rates?", a: "A clock reaction produces a sudden, visible change (e.g. a colour change) after a fixed amount of product has been formed. The time to this change is inversely proportional to the initial rate of reaction."},
    {q: "Describe the iodine clock reaction between H₂O₂ and I⁻ ions.", a: "H₂O₂ oxidises I⁻ to I₂ in acidic solution. I₂ is immediately reduced back to I⁻ by sodium thiosulfate (Na₂S₂O₃). When all the thiosulfate is consumed, I₂ reacts with starch to give a sudden blue-black colour."},
    {q: "What is the overall equation for the iodine clock reaction?", a: "H₂O₂(aq) + 2I⁻(aq) + 2H⁺(aq) → I₂(aq) + 2H₂O(l)\nI₂ is then immediately consumed by: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻\nThe clock stops when all S₂O₃²⁻ is used up."},
    {q: "How is the rate of reaction calculated from a clock reaction experiment?", a: "Rate ∝ 1/t\nwhere t is the time in seconds for the colour change to appear. The shorter the time, the faster the rate."},
    {q: "How is the effect of concentration on rate investigated using the clock reaction?", a: "Keep all other variables constant (temperature, total volume, amounts of starch and thiosulfate). Vary the concentration of one reactant (e.g. H₂O₂ or I⁻) by using different volumes and compensating with distilled water. Record the time t for each concentration and calculate rate = 1/t."},
    {q: "Why is distilled water added when changing the volume of reactant in a clock experiment?", a: "To keep the total volume constant so that concentrations of other reagents are not affected, ensuring a fair test."},
    {q: "How is the order with respect to a reactant determined from clock reaction data?", a: "Plot rate (1/t) against concentration. If the graph is linear through the origin, the reaction is first order with respect to that reactant. If it is a curve, it may be second order."},
    {q: "What graph would indicate first order kinetics in a clock experiment?", a: "A straight line through the origin when rate (1/t) is plotted against concentration [A], showing rate ∝ [A]."},
    {q: "How is the effect of temperature on reaction rate investigated?", a: "Keep all concentrations constant. Heat reactants to different temperatures in a water bath before mixing. Record time t for the colour change at each temperature. Calculate rate = 1/t and plot rate vs. temperature (or ln k vs. 1/T for Arrhenius analysis)."},
    {q: "What happens to the time t as temperature increases in the clock reaction?", a: "t decreases (the colour change occurs sooner) because particles have more energy, more collisions exceed the activation energy, so the reaction is faster."},
    {q: "What safety precautions are needed for the iodine clock reaction?", a: "H₂O₂ is an oxidiser and irritant — avoid skin contact, wear gloves and goggles.\nH₂SO₄ is corrosive — handle carefully.\nWork in a well-ventilated area.\nDispose of iodine solution safely."},
    {q: "What is the role of starch in the iodine clock reaction?", a: "Starch forms a deep blue-black complex with iodine (I₂). It acts as the visual indicator — the sudden appearance of the blue-black colour marks the end point of the clock."},
    {q: "What is the role of sodium thiosulfate in the iodine clock reaction?", a: "It immediately converts any I₂ produced back to I⁻, preventing iodine from accumulating. The clock only triggers when all the thiosulfate has been consumed and free I₂ can react with starch."},
    {q: "Why must the amount of sodium thiosulfate remain constant in all trials of the clock experiment?", a: "Because the clock triggers when a fixed amount of product (I₂) has formed — equal to the moles of thiosulfate. If thiosulfate changes, you are no longer measuring the rate at the same extent of reaction."},
    {q: "What is a typical source of error in a clock reaction experiment?", a: "Difficulty determining the exact moment of colour change (subjective).\nTemperature fluctuations during the experiment.\nInaccurate measurement of small volumes.\nDelay in starting/stopping the timer."},
    {q: "How can you verify that the reaction is first order from concentration–time data?", a: "A first-order reaction shows a constant half-life on a concentration–time graph, or a straight line on a ln[A] vs. time graph."}
  ]},

  "RP3": { title: "Equilibrium – Le Chatelier's", cards: [
    {q: "What is the chromate/dichromate equilibrium used to demonstrate in this practical?", a: "The yellow chromate ion (CrO₄²⁻) and the orange dichromate ion (Cr₂O₇²⁻) exist in equilibrium:\n2CrO₄²⁻(aq) + 2H⁺(aq) ⇌ Cr₂O₇²⁻(aq) + H₂O(l)\nAdding acid or alkali shifts the equilibrium, visible via colour change."},
    {q: "What colour change is observed when acid (H⁺) is added to yellow chromate solution?", a: "The solution turns orange, as the equilibrium shifts to the right (towards Cr₂O₇²⁻) to use up the added H⁺."},
    {q: "What colour change is observed when alkali (OH⁻) is added to orange dichromate solution?", a: "The solution turns yellow, as OH⁻ reacts with H⁺, reducing [H⁺] and shifting the equilibrium to the left (towards CrO₄²⁻)."},
    {q: "How does the iron(III) thiocyanate equilibrium demonstrate Le Chatelier's principle?", a: "Fe³⁺(aq) + SCN⁻(aq) ⇌ [FeSCN]²⁺(aq) (blood red)\nAdding Fe³⁺ or SCN⁻ deepens the red colour (shift right).\nAdding NaF removes Fe³⁺ (as FeF₃), shifting equilibrium left and reducing colour."},
    {q: "What is observed when more Fe³⁺ ions are added to the iron(III) thiocyanate equilibrium?", a: "The blood-red colour deepens/intensifies as the equilibrium shifts to the right, producing more [FeSCN]²⁺."},
    {q: "What is observed when Na₂HPO₄ or NaF is added to [FeSCN]²⁺ solution?", a: "The red colour fades/disappears as Fe³⁺ is removed (precipitated or complexed), shifting equilibrium to the left."},
    {q: "How is Le Chatelier's principle stated?", a: "When a change is imposed on a system at equilibrium, the equilibrium position shifts to oppose that change and restore a new equilibrium."},
    {q: "How can you confirm a colour change is due to equilibrium shift and not just dilution?", a: "Include a control tube where distilled water is added in the same volume. If the control shows the same colour change, the effect is dilution. If the treated sample shows a different, more pronounced change, it is due to equilibrium shift."},
    {q: "What does a shift to the right in an equilibrium mean in terms of concentrations?", a: "Concentrations of products increase and concentrations of reactants decrease until a new equilibrium is established."},
    {q: "What effect does adding water (diluting) have on the chromate/dichromate equilibrium?", a: "Dilution decreases [H⁺], shifting equilibrium to the left (towards CrO₄²⁻), so the solution becomes more yellow."},
    {q: "Why does adding NaOH to the chromate/dichromate system shift the equilibrium left?", a: "OH⁻ neutralises H⁺ ions (H⁺ + OH⁻ → H₂O), reducing [H⁺]. The equilibrium shifts left to produce more H⁺, generating more CrO₄²⁻ (yellow)."},
    {q: "What safety precautions are needed when working with chromate/dichromate solutions?", a: "Chromate and dichromate are toxic and carcinogenic — wear gloves and avoid skin contact.\nWork in a fume cupboard if possible.\nDispose of solutions in the heavy metals waste container."},
    {q: "What is the colour of CrO₄²⁻ and Cr₂O₇²⁻?", a: "CrO₄²⁻: yellow\nCr₂O₇²⁻: orange"},
    {q: "Why is a dynamic equilibrium described as 'dynamic'?", a: "Both the forward and reverse reactions continue to occur at equal rates — there is constant movement of molecules between reactants and products even though overall concentrations remain constant."},
    {q: "What are the conditions required for a dynamic equilibrium to be established?", a: "The system must be closed (no substances enter or leave), and the forward and reverse reactions must both be occurring at equal rates."},
    {q: "Does adding a catalyst shift the position of equilibrium?", a: "No. A catalyst increases the rates of both forward and reverse reactions equally, so equilibrium is reached faster but the position (yield) is unchanged."}
  ]},

  "RP4": { title: "Distillation of a Product from a Reaction (Activity 5)", cards: [
    {q: "What is the purpose of simple distillation?", a: "To separate a volatile liquid from a non-volatile solute or to separate two liquids with very different boiling points (greater than ~25°C apart)."},
    {q: "What is fractional distillation used for?", a: "Separating liquids with similar boiling points (e.g. ethanol/water mixture), by passing vapours through a fractionating column that provides multiple condensation–evaporation cycles."},
    {q: "Describe the apparatus required for simple distillation.", a: "Round-bottomed flask with the mixture, anti-bumping granules, thermometer with bulb at the side-arm junction, condenser with water flowing in at the bottom, collection flask (receiver)."},
    {q: "Why is the thermometer bulb positioned at the side-arm junction in distillation?", a: "To measure the temperature of the vapour passing into the condenser, which indicates the boiling point of the fraction being collected."},
    {q: "Why does water enter the condenser at the bottom and exit at the top?", a: "Counter-current flow ensures maximum cooling efficiency — the coolest water meets the coolest vapour, and the warmest water meets the warmest vapour entering."},
    {q: "Why are anti-bumping granules added to the distillation flask?", a: "They provide nucleation sites for bubble formation, preventing superheating and sudden violent boiling (bumping) which could cause the liquid to be ejected into the condenser."},
    {q: "How can purity of the distillate be checked?", a: "Measure the boiling point (pure liquids boil at a sharp, constant temperature) or measure the melting point for a solid. TLC can also compare the product with a known pure sample."},
    {q: "How does fractional distillation separate ethanol from water?", a: "Ethanol boils at 78.4°C, water at 100°C. The fractionating column allows repeated condensation and re-evaporation. Ethanol vapour rises to the top first and is collected when the thermometer reads ~78°C."},
    {q: "Why is a fractionating column packed with glass beads or Raschig rings?", a: "The packing increases the surface area for condensation and re-evaporation, providing more theoretical plates for better separation of components with close boiling points."},
    {q: "What is the purpose of the Liebig condenser?", a: "To cool and condense the vapour back to liquid by passing cold water through the outer jacket, so the distillate can be collected."},
    {q: "How is TLC used to assess purity of a distillate?", a: "Spot the distillate alongside a known pure sample on a TLC plate. Develop with an appropriate solvent. If only one spot is seen with the same Rf as the pure compound, the product is pure."},
    {q: "What is a suitable test for the purity of a solid product?", a: "Measure the melting point. A pure solid has a sharp melting point matching the data book value. An impure solid melts over a range of temperatures below the expected value."},
    {q: "What does it mean if the thermometer reading rises during distillation?", a: "A different fraction with a higher boiling point is beginning to distil over. The collector should be changed at this point to separate fractions."},
    {q: "What safety precautions are required during distillation of flammable liquids?", a: "No naked flames — use an electric heating mantle.\nEnsure all glassware joints are secure to avoid vapour leaks.\nWork in a fume cupboard.\nDo not allow the flask to boil dry."},
    {q: "Why should the distillation apparatus never be sealed (closed system)?", a: "Pressure would build up as vapour is produced, potentially causing the glassware to shatter explosively."},
    {q: "How does simple distillation differ from fractional distillation in terms of apparatus?", a: "Simple distillation uses no fractionating column -- just a flask, condenser and receiver. Fractional distillation adds a fractionating column between flask and condenser for better separation."},
    {q: "What is the specific reaction used in AQA Required Activity 5?", a: "The partial oxidation of a primary alcohol (e.g. propan-1-ol) to an aldehyde (propanal) using acidified potassium dichromate(VI):\nCH₃CH₂CH₂OH + [O] → CH₃CH₂CHO + H₂O\nA limited quantity of oxidising agent is used and the aldehyde is distilled off as it forms to prevent further oxidation to the carboxylic acid."},
    {q: "Why is a limited quantity of oxidising agent used and the product distilled off as it forms in Activity 5?", a: "To achieve PARTIAL oxidation (alcohol to aldehyde) rather than full oxidation (to carboxylic acid).\nIf the aldehyde remains in the reaction mixture it would be oxidised further to propanoic acid.\nDistilling it off immediately prevents this and maximises aldehyde yield."},
    {q: "What colour change is observed during the partial oxidation of propan-1-ol with K₂Cr₂O₇?", a: "The orange dichromate ion (Cr₂O₇²⁻) is reduced to the green Cr³⁺ ion as the alcohol is oxidised.\nOrange → green indicates the oxidation reaction is occurring."},
    {q: "What safety precautions are specific to the Activity 5 oxidation experiment?", a: "Potassium dichromate(VI) is highly toxic and a category 1B carcinogen: wear gloves, avoid skin contact, do not inhale dust.\nConcentrated H₂SO₄ is corrosive: add carefully.\nPropan-1-ol and propanal are flammable: use an electric heating mantle, no naked flames.\nCarry out in a well-ventilated area or fume cupboard."}
  ]},

  "RP5": { title: "TLC Separation (Activity 12)", cards: [
    {q: "What are the two phases in chromatography, and what is their role?", a: "Stationary phase: stays still (e.g. silica on TLC plate or in column). Mobile phase: moves (solvent). Compounds travel at different rates depending on their relative attraction to each phase."},
    {q: "How is Rf value defined and calculated?", a: "Rf = distance travelled by spot ÷ distance travelled by solvent front.\nRf has no units and is always between 0 and 1."},
    {q: "What does a high Rf value indicate about a compound?", a: "The compound has a greater affinity for the mobile phase (solvent) than the stationary phase — it is more soluble in the solvent and less adsorbed onto the silica."},
    {q: "Describe the TLC procedure step by step.", a: "1. Draw a pencil baseline 1 cm from bottom of plate (pencil, not pen).\n2. Apply small spot of sample using a capillary tube.\n3. Place plate in developing chamber with solvent level below the baseline.\n4. Allow solvent to rise — remove plate before solvent reaches top.\n5. Mark solvent front immediately. Allow to dry.\n6. Visualise spots (UV lamp or ninhydrin spray)."},
    {q: "Why must the pencil line on a TLC plate be drawn in pencil and not pen?", a: "Ink from a pen would dissolve in the solvent and travel up the plate, interfering with the chromatography."},
    {q: "Why must the solvent level be below the baseline in TLC?", a: "If the solvent covers the sample spots, the compounds will dissolve directly into the solvent rather than being carried up the plate by capillary action, ruining the separation."},
    {q: "How are colourless compounds visualised on a TLC plate?", a: "UV light — compounds fluoresce or appear as dark spots on a fluorescent plate.\nNinhydrin spray — reacts with amino acids to give purple/pink spots.\nIodine vapour — stains organic compounds yellow/brown."},
    {q: "How can TLC be used to identify a compound?", a: "Co-spot the unknown with known reference compounds on the same plate. If the unknown and a reference compound give spots with the same Rf value, they are likely the same compound."},
    {q: "How can TLC confirm the purity of a product?", a: "A pure compound shows a single spot. Multiple spots indicate impurities are present. The Rf of the spot should match the literature value for the expected product."},
    {q: "How does column chromatography work?", a: "A column is packed with silica (stationary phase). The mixture is loaded at the top. Solvent (mobile phase) is added and runs down by gravity. Components separate as they interact differently with the silica, eluting at different times."},
    {q: "How are fractions collected in column chromatography?", a: "Different fractions are collected in separate tubes as the solvent elutes. Each fraction can then be analysed by TLC to determine which contains the desired product."},
    {q: "What is the advantage of column chromatography over TLC?", a: "Column chromatography can handle larger quantities of material and actually separates components for collection, whereas TLC is purely analytical (small scale, not preparative)."},
    {q: "Why is ninhydrin used specifically for amino acids on TLC?", a: "Ninhydrin reacts with the amino (–NH₂) group of amino acids to produce a purple/pink colour (Ruhemann's purple), making it a specific visualisation reagent for amino acids."},
    {q: "What does it mean for two compounds to have the same Rf value?", a: "They may be the same compound, but this alone is not conclusive — two different compounds can coincidentally have the same Rf in one solvent. A different solvent should also be tested."},
    {q: "Why should a TLC developing chamber have a lid?", a: "To saturate the atmosphere inside with solvent vapour, preventing evaporation of solvent from the plate, which would distort Rf values."},
    {q: "What stationary phase is typically used in TLC and column chromatography?", a: "Silica (SiO₂) — it is polar and adsorbs polar compounds more strongly. Alumina (Al₂O₃) is also used. The stationary phase in TLC is coated onto an aluminium or glass backing plate."}
  ]},

  "RP6": { title: "Synthesis of Halogenoalkane", cards: [
    {q: "What is the overall reaction for the preparation of 1-bromobutane from butan-1-ol?", a: "CH₃CH₂CH₂CH₂OH + NaBr + H₂SO₄ → CH₃CH₂CH₂CH₂Br + NaHSO₄ + H₂O\nIn situ: NaBr + H₂SO₄ → HBr, then butan-1-ol + HBr → 1-bromobutane + H₂O."},
    {q: "Why is concentrated H₂SO₄ used rather than HBr directly in this synthesis?", a: "HBr gas is hazardous and difficult to handle. H₂SO₄ reacts with NaBr in situ to generate HBr, making the process safer and more convenient."},
    {q: "What type of reaction mechanism is involved in this synthesis?", a: "Nucleophilic substitution (SN2 mechanism) — the Br⁻ ion acts as a nucleophile and substitutes the OH group of butan-1-ol."},
    {q: "Describe the reflux stage of the 1-bromobutane preparation.", a: "Mix butan-1-ol, NaBr and water in a round-bottomed flask. Add concentrated H₂SO₄ carefully. Reflux for 30–45 minutes to drive the reaction to completion without losing volatile product."},
    {q: "Why is the reaction mixture refluxed rather than just heated in an open flask?", a: "1-bromobutane is volatile. Reflux condenses the vapour back into the flask, preventing loss of product and maintaining the reaction temperature."},
    {q: "How is 1-bromobutane separated from the reaction mixture after reflux?", a: "By distillation — heat the mixture and collect the fraction boiling at approximately 100–105°C (boiling point of 1-bromobutane is 101.6°C)."},
    {q: "What impurities are present in the crude distillate after distillation?", a: "Unreacted butan-1-ol, water, HBr, butan-1-ol sulfate, and other by-products. These are removed in the washing stages."},
    {q: "How is the crude product washed with concentrated H₂SO₄ and what does this remove?", a: "Adding concentrated H₂SO₄ removes unreacted butan-1-ol by protonation, making it water-soluble. The organic layer (1-bromobutane) is denser and sinks below the aqueous layer."},
    {q: "How is the crude 1-bromobutane washed with sodium hydrogencarbonate solution?", a: "NaHCO₃(aq) is added to the separating funnel. It neutralises any remaining HBr and H₂SO₄:\nHBr + NaHCO₃ → NaBr + H₂O + CO₂\nThe stopper must be released frequently to vent CO₂ gas."},
    {q: "Why must the tap of the separating funnel be opened frequently during washing with NaHCO₃?", a: "CO₂ gas is produced by the reaction of NaHCO₃ with acid — pressure would build up inside the funnel and could force the stopper out."},
    {q: "How is the organic layer dried after washing?", a: "Transfer the organic layer to a conical flask. Add anhydrous MgSO₄ (or anhydrous CaCl₂). Swirl and leave for a few minutes until the drying agent no longer clumps. Filter off the drying agent."},
    {q: "Why is anhydrous MgSO₄ used as a drying agent?", a: "It absorbs water by forming a hydrate (MgSO₄·7H₂O), removing traces of water from the organic product without reacting with it. It is then easily removed by filtration."},
    {q: "How is the identity of the product confirmed in this synthesis?", a: "Compare the boiling point of the purified product with the literature value for 1-bromobutane (101.6°C). Test with AgNO₃(aq)/ethanol — pale yellow precipitate of AgBr confirms the presence of C–Br bond."},
    {q: "What safety precautions are required for this synthesis?", a: "Concentrated H₂SO₄ is corrosive — add to water/reagents carefully, never the reverse.\n1-bromobutane is volatile and an irritant — work in a fume cupboard.\nNaBr dust — avoid inhalation.\nWear gloves and goggles throughout."},
    {q: "Why is the organic layer the lower layer in the separating funnel during this purification?", a: "1-bromobutane has a density of ~1.28 g cm⁻³, greater than water (1.00 g cm⁻³), so it sinks below the aqueous layer."},
    {q: "How is percentage yield calculated for this synthesis?", a: "% yield = (actual mass of product ÷ theoretical mass of product) × 100.\nTheoretical mass = moles of limiting reagent × Mr of 1-bromobutane."}
  ]},

  "RP7": { title: "Electrophilic Addition & Free Radical Substitution", cards: [
    {q: "What is electrophilic addition and which type of compound undergoes it?", a: "A reaction where an electrophile adds across a C=C double bond. Alkenes undergo electrophilic addition because the pi bond provides a region of high electron density that attracts electrophiles."},
    {q: "What is observed when bromine water is shaken with an alkene?", a: "The orange/brown colour of bromine water is decolourised (becomes colourless) as Br₂ adds across the double bond to form a dibromoalkane."},
    {q: "Write the equation for the addition of bromine to ethene.", a: "CH₂=CH₂ + Br₂ → CH₂BrCH₂Br\n(ethene + bromine → 1,2-dibromoethane)"},
    {q: "Describe the mechanism of electrophilic addition of Br₂ to ethene.", a: "1. The pi electrons of C=C polarise the Br–Br bond: Br becomes δ+ near the double bond.\n2. Br⁺ acts as electrophile — attacks pi bond → carbocation intermediate + Br⁻.\n3. Br⁻ attacks the carbocation from opposite side → 1,2-dibromoalkane product."},
    {q: "What is the carbocation intermediate in electrophilic addition?", a: "A carbon atom bearing a positive charge, formed when the electrophile (Br⁺) bonds to one carbon of the double bond, leaving the other carbon with a positive charge."},
    {q: "What is free radical substitution, and which type of compound undergoes it?", a: "A reaction in which hydrogen atoms in an alkane are replaced by halogen atoms via a free radical chain mechanism. Alkanes undergo free radical substitution with Cl₂ or Br₂ under UV light."},
    {q: "What are the three stages of the free radical substitution mechanism?", a: "1. Initiation: UV light breaks Cl–Cl bond homolytically → 2 Cl• radicals.\n2. Propagation (two steps): Cl• + CH₄ → CH₃• + HCl; CH₃• + Cl₂ → CH₃Cl + Cl•\n3. Termination: Two radicals combine → no new radicals formed."},
    {q: "What is homolytic fission?", a: "Bond breaking where each atom receives one electron from the shared pair, forming two neutral free radicals. Shown with a single-headed (fish-hook) arrow in mechanism diagrams."},
    {q: "What conditions are required for free radical substitution of alkanes?", a: "UV light (or very high temperatures). No catalyst needed. The halogen must be Cl₂ or Br₂ (F₂ reacts explosively; I₂ is too unreactive)."},
    {q: "What is observed when chlorine gas is mixed with methane under UV light?", a: "A mixture of chloromethane, dichloromethane, trichloromethane and tetrachloromethane is produced (a mixture of substitution products), along with HCl gas. The pale green colour of Cl₂ fades."},
    {q: "Why does free radical substitution produce a mixture of products?", a: "Each step of propagation can continue to substitute further H atoms. CH₃Cl can react with another Cl• to give CH₂Cl₂, and so on, until CH₂Cl₄ is formed."},
    {q: "What safety precautions are needed when handling bromine and chlorine in organic reactions?", a: "Both are toxic and corrosive gases/liquids — work in a fume cupboard.\nAvoid skin/eye contact — wear gloves and goggles.\nBromine is an irritant; chlorine is a suffocant.\nHave emergency procedures for spillages."},
    {q: "How can you distinguish between electrophilic addition and free radical substitution in the lab?", a: "Addition (alkene + Br₂ water): decolourisation in the dark or light, no HBr produced.\nSubstitution (alkane + Cl₂ under UV): requires UV light, HCl gas produced, mixture of products formed."},
    {q: "What is the test to confirm an alkene has undergone addition with bromine?", a: "The orange bromine water is decolourised when shaken with the alkene. No UV light is needed. The product (dibromoalkane) is colourless."},
    {q: "Write the two propagation steps for the free radical chlorination of methane.", a: "Step 1: Cl• + CH₄ → •CH₃ + HCl\nStep 2: •CH₃ + Cl₂ → CH₃Cl + Cl•\nThe Cl• produced in step 2 can re-enter step 1 — chain reaction."},
    {q: "Give two examples of termination steps in the chlorination of methane.", a: "Cl• + Cl• → Cl₂\nCl• + •CH₃ → CH₃Cl\n•CH₃ + •CH₃ → C₂H₆\n(Any two radicals combining counts as termination.)"}
  ]},

  "RP8": { title: "Measuring EMF & Electrode Potentials", cards: [
    {q: "What is a standard electrode potential (E°)?", a: "The potential difference (voltage) of a half-cell measured against the standard hydrogen electrode under standard conditions: 298 K, 100 kPa, all ion concentrations 1.00 mol dm⁻³."},
    {q: "What is the standard hydrogen electrode (SHE) and what is its E° value?", a: "The SHE consists of H₂ gas at 100 kPa bubbled over a platinum electrode in 1.00 mol dm⁻³ H⁺(aq). Its E° is defined as exactly 0.00 V."},
    {q: "Describe how to construct a Zn/Cu electrochemical cell to measure EMF.", a: "1. Place Zn electrode in 1.00 mol dm⁻³ ZnSO₄(aq).\n2. Place Cu electrode in 1.00 mol dm⁻³ CuSO₄(aq).\n3. Connect the two solutions with a salt bridge (KNO₃-soaked filter paper).\n4. Connect metals with a wire through a high-resistance voltmeter.\n5. Read the EMF."},
    {q: "What is the purpose of the salt bridge in an electrochemical cell?", a: "It allows ions to flow between the two half-cells to maintain electrical neutrality (balance the charge), completing the circuit without the two solutions mixing directly."},
    {q: "Why must the voltmeter have a very high resistance?", a: "To prevent current from flowing — if current flows, the concentrations change as the reaction proceeds, and the measured voltage would not be the equilibrium (standard) electrode potential."},
    {q: "How is E°cell calculated from two standard electrode potentials?", a: "E°cell = E°(cathode) − E°(anode)\n= E°(reduction) − E°(oxidation)\nThe half-cell with the more positive E° is the cathode (reduction occurs there)."},
    {q: "For a Zn/Cu cell: E°(Cu²⁺/Cu) = +0.34 V, E°(Zn²⁺/Zn) = −0.76 V. Calculate E°cell.", a: "E°cell = E°(cathode) − E°(anode) = +0.34 − (−0.76) = +1.10 V\nCu²⁺ is reduced at the cathode; Zn is oxidised at the anode."},
    {q: "What does a positive E°cell indicate?", a: "The cell reaction is feasible (thermodynamically spontaneous) under standard conditions."},
    {q: "What does a negative E°cell indicate?", a: "The cell reaction is not feasible in the forward direction — the reverse reaction is favoured."},
    {q: "Why is KNO₃ solution used in the salt bridge rather than KCl?", a: "K⁺ and NO₃⁻ ions are unlikely to react with either half-cell solution. KCl would not be suitable if one half-cell contains Ag⁺ ions, as Cl⁻ would precipitate AgCl."},
    {q: "What cell notation (cell diagram) represents the Zn/Cu cell?", a: "Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)\nLHS = anode (oxidation); RHS = cathode (reduction); || = salt bridge."},
    {q: "What are the limitations of using E° values to predict feasibility?", a: "1. E° applies only under standard conditions — non-standard concentrations, temperature or pressure may change feasibility.\n2. Kinetics — a thermodynamically feasible reaction may be too slow to observe (high activation energy).\n3. Overpotential effects in electrolysis."},
    {q: "How does the SHE provide a reference for measuring other E° values?", a: "Each half-cell is connected to the SHE as the other half-cell. The voltmeter reads the E° of the unknown half-cell, since E°(SHE) = 0.00 V. A positive reading means the half-cell is more easily reduced than H⁺."},
    {q: "How does a hydrogen fuel cell work?", a: "H₂ is oxidised at the anode: H₂ → 2H⁺ + 2e⁻\nO₂ is reduced at the cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O\nOverall: 2H₂ + O₂ → 2H₂O\nElectrons flow through an external circuit, generating electricity. Only water is produced."},
    {q: "What are the advantages of hydrogen fuel cells over conventional batteries?", a: "No recharging needed — fuel is supplied continuously.\nOnly water as waste product — environmentally clean.\nHigh efficiency compared to combustion engines.\nLightweight for their energy output."},
    {q: "What are the disadvantages of hydrogen fuel cells?", a: "Hydrogen is highly flammable and explosive — storage is hazardous.\nHydrogen is usually produced from fossil fuels — not truly zero-carbon.\nExpensive platinum catalyst required.\nNeed for hydrogen infrastructure (fuelling stations)."}
  ]},

  "RP9": { title: "Colorimetry & Beer-Lambert Law", cards: [
    {q: "State the Beer-Lambert law.", a: "A = εcl\nwhere A = absorbance (no units), ε = molar absorption coefficient (dm³ mol⁻¹ cm⁻¹), c = concentration (mol dm⁻³), l = path length of cuvette (cm)."},
    {q: "What does the Beer-Lambert law tell us about the relationship between absorbance and concentration?", a: "Absorbance is directly proportional to concentration (at constant path length and wavelength). Doubling the concentration doubles the absorbance — a linear relationship."},
    {q: "How is a colorimeter used to measure the concentration of a coloured solution?", a: "1. Select the complementary colour filter (opposite to solution colour on colour wheel).\n2. Zero/calibrate with distilled water (blank).\n3. Measure absorbance of standard solutions to make a calibration curve.\n4. Measure absorbance of unknown solution.\n5. Read concentration from the calibration curve."},
    {q: "Why is a filter used in a colorimeter, and how is the correct filter selected?", a: "The filter selects a specific wavelength of light to pass through the sample. The filter should transmit the wavelength that is most absorbed by the solution (complementary colour). This maximises sensitivity."},
    {q: "What is a calibration curve and how is it constructed?", a: "A graph of absorbance (y-axis) vs. concentration (x-axis) for a series of standard solutions of known concentration. According to Beer-Lambert, the graph is a straight line through the origin."},
    {q: "How is the concentration of an unknown solution found using a calibration curve?", a: "Measure the absorbance of the unknown solution using the colorimeter. Read off the corresponding concentration from the calibration curve (interpolate from the linear portion)."},
    {q: "What is λmax and why is it used in colorimetry?", a: "λmax is the wavelength at which a solution shows maximum absorbance. Measurements at λmax give the greatest sensitivity and accuracy, and the Beer-Lambert law applies most linearly here."},
    {q: "How can colorimetry be used to find the equilibrium constant Kc of a coloured equilibrium?", a: "Prepare mixtures with known initial concentrations. Once equilibrium is reached, measure the absorbance to find [coloured species] at equilibrium using the calibration curve. Calculate concentrations of other species by mass balance, then substitute into Kc expression."},
    {q: "What is a blank in colorimetry and why is it used?", a: "A blank is distilled water (or solvent) with no solute. It is used to zero the colorimeter — this corrects for any absorbance by the solvent itself or the cuvette, ensuring only the solute's absorbance is measured."},
    {q: "What errors can affect colorimetry measurements?", a: "Fingerprints on cuvette — absorbed light erroneously.\nAir bubbles in solution — scatter light.\nNot zeroing with blank.\nMeasuring outside the linear range of Beer-Lambert law (too concentrated).\nFailed calibration curve."},
    {q: "Why does Beer-Lambert law fail at very high concentrations?", a: "At high concentrations, interactions between solute molecules change the effective absorption coefficient. Also, scattered light becomes significant, and the relationship between A and c is no longer linear."},
    {q: "Give an example of a transition metal complex studied by colorimetry.", a: "Cu²⁺ ions form a blue complex in solution ([Cu(H₂O)₆]²⁺ or [Cu(NH₃)₄(H₂O)₂]²⁺). The concentration of Cu²⁺ can be determined by measuring absorbance at ~620 nm (the complement of blue/red filter)."},
    {q: "What is the path length l in a standard colorimetry cuvette?", a: "Typically 1 cm. This is the distance the light travels through the solution. A longer path length increases absorbance for the same concentration."},
    {q: "How would you prepare a series of standard solutions for a calibration curve?", a: "Make a stock solution of known concentration. Use serial dilutions: pipette measured volumes into volumetric flasks and make up to the mark with distilled water. Cover the range of concentrations you expect for the unknown."},
    {q: "What units does absorbance have?", a: "Absorbance (A) is dimensionless (no units). It is defined as log₁₀(I₀/I) where I₀ = incident light intensity and I = transmitted light intensity."},
    {q: "How can colorimetry be used to monitor a reaction rate?", a: "If a reactant or product is coloured, measure absorbance at regular time intervals. The change in absorbance over time reflects the change in concentration, allowing a rate curve to be plotted."}
  ]},

  "RP10a": { title: "Preparation of Aspirin", cards: [
    {q: "What are the starting materials for the synthesis of aspirin?", a: "Salicylic acid (2-hydroxybenzoic acid) and ethanoic anhydride, with phosphoric acid (H₃PO₄) as catalyst."},
    {q: "Write the equation for the synthesis of aspirin.", a: "Salicylic acid + ethanoic anhydride → aspirin (2-ethanoylhydroxybenzoic acid / acetylsalicylic acid) + ethanoic acid\nThe –OH group of salicylic acid reacts with ethanoic anhydride in an esterification reaction."},
    {q: "What type of reaction is used to make aspirin from salicylic acid?", a: "Esterification — the phenol –OH group of salicylic acid reacts with the acyl group of ethanoic anhydride in a nucleophilic addition-elimination (acylation) reaction."},
    {q: "Why is ethanoic anhydride used rather than ethanoic acid (acetic acid) for aspirin synthesis?", a: "Ethanoic anhydride is a more reactive acylating agent — it reacts faster and more completely with the phenol group. The reaction with acetic acid would be much slower and less clean."},
    {q: "Why is phosphoric acid added to the reaction mixture?", a: "It acts as a catalyst, protonating the carbonyl group of ethanoic anhydride to make it a better electrophile, thus speeding up the acylation reaction."},
    {q: "How is the crude aspirin product collected after the reaction?", a: "The reaction mixture is poured into ice-cold water to precipitate the aspirin (low solubility in cold water). The solid is collected by vacuum filtration (Buchner funnel)."},
    {q: "Why is ice-cold water used to precipitate the aspirin?", a: "Aspirin has low solubility in cold water, so cooling ensures maximum precipitation. Ice-cold water also prevents hydrolysis of the aspirin product back to salicylic acid and ethanoic acid."},
    {q: "How is the crude aspirin purified?", a: "By recrystallisation: dissolve the crude solid in a minimum volume of hot ethanol, then add warm water. Cool the solution in ice — pure aspirin crystals form. Collect by vacuum filtration, wash with cold water, and dry."},
    {q: "How is the purity of aspirin checked in the laboratory?", a: "1. Melting point measurement — pure aspirin melts sharply at 135°C. Impurities lower and broaden the melting point.\n2. FeCl₃ test — impure aspirin containing salicylic acid gives a purple colour; pure aspirin gives no colour change."},
    {q: "Why is the FeCl₃ test appropriate for checking aspirin purity and not Tollens' test?", a: "Aspirin contains no aldehyde group, so Tollens' test is irrelevant. FeCl₃ detects phenol groups — salicylic acid (the main impurity) has a free phenol –OH and gives a purple complex with Fe³⁺, indicating impurity."},
    {q: "What colour does salicylic acid give with FeCl₃ solution?", a: "A purple/violet colour, due to formation of an iron(III)–phenol complex. Pure aspirin gives no colour change (or very faint yellow) because the phenol group is esterified."},
    {q: "How is percentage yield calculated for the aspirin synthesis?", a: "% yield = (actual mass obtained ÷ theoretical mass) × 100\nTheoretical mass = moles of limiting reagent × Mr of aspirin (180 g mol⁻¹)."},
    {q: "What safety precautions are needed for the aspirin synthesis?", a: "Ethanoic anhydride is corrosive and has a pungent smell — use in fume cupboard, wear gloves.\nPhosphoric acid is corrosive.\nEthanol is flammable — no naked flames.\nAvoid skin contact with all reagents."},
    {q: "How does recrystallisation improve the purity of aspirin?", a: "The impure aspirin dissolves in hot solvent. On cooling, pure aspirin crystallises first because it is less soluble. Impurities (which are often more soluble) remain in solution and are washed away."},
    {q: "What is the molecular formula of aspirin?", a: "C₉H₈O₄ (acetylsalicylic acid), Mr = 180 g mol⁻¹."},
    {q: "Why might the percentage yield of aspirin be less than 100%?", a: "Product lost during filtration and washing.\nSome product remains dissolved in the filtrate.\nSide reactions may consume some starting material.\nProduct hydrolysed back in water."}
  ]},

  "RP10b": { title: "Preparation of Azo Dye", cards: [
    {q: "What is diazotisation, and what are the conditions required?", a: "Diazotisation is the reaction of a primary arylamine with NaNO₂ and HCl at 0–5°C to form a diazonium salt:\nArNH₂ + NaNO₂ + HCl → ArN₂⁺Cl⁻ + NaCl + H₂O\nTemperature must be kept below 5°C to prevent decomposition of the diazonium salt."},
    {q: "Why must the temperature be kept below 5°C during diazotisation?", a: "Diazonium salts are unstable and decompose above 5°C — they can release N₂ gas explosively and produce phenol. Low temperature stabilises the diazonium ion long enough to use it in coupling."},
    {q: "What reagents are used in the diazotisation of phenylamine (aniline)?", a: "Phenylamine (C₆H₅NH₂), NaNO₂(aq) and dilute HCl(aq). The mixture is kept in an ice bath at 0–5°C."},
    {q: "Write the equation for the diazotisation of phenylamine.", a: "C₆H₅NH₂ + NaNO₂ + 2HCl → C₆H₅N₂⁺Cl⁻ + NaCl + 2H₂O\n(Benzenediazonium chloride is the product)"},
    {q: "What is a coupling reaction in azo dye synthesis?", a: "The diazonium ion (ArN₂⁺) reacts with an aromatic coupling component (e.g. phenol or naphthol) in alkaline solution to form an azo compound containing the –N=N– (azo) group."},
    {q: "Why is the coupling reaction carried out in alkaline conditions?", a: "Alkaline conditions (e.g. NaOH) convert phenol to the phenoxide ion (C₆H₅O⁻), which is a stronger nucleophile/activating group than phenol itself, making the ring more reactive towards electrophilic substitution by the diazonium ion."},
    {q: "Write the equation for the coupling of benzenediazonium chloride with phenol.", a: "C₆H₅N₂⁺ + C₆H₅OH → C₆H₅–N=N–C₆H₄–OH + H⁺\n(Yellow-orange azo dye formed)"},
    {q: "What is the functional group in all azo dyes?", a: "The azo group: –N=N– (diazo linkage). It is responsible for the intense colour of azo dyes by absorbing visible light through delocalisation of electrons across the molecule."},
    {q: "What colours are typical azo dyes?", a: "Yellow, orange, red, or brown, depending on the nature of the aryl groups on either side of the –N=N– bridge and the degree of electron delocalisation."},
    {q: "Why do azo dyes have intense colours?", a: "The extended conjugated system (alternating single and double bonds including the –N=N– group and aromatic rings) absorbs light in the visible region. Electrons are excited across a small energy gap."},
    {q: "What is the role of the naphthol (2-naphthol) coupling component?", a: "2-naphthol provides an activated aromatic ring that undergoes electrophilic substitution with the diazonium ion. The product is a more deeply coloured azo dye due to the larger conjugated system."},
    {q: "What safety hazard is associated with aromatic amines such as phenylamine?", a: "Many aromatic amines are carcinogenic (cancer-causing) and can be absorbed through the skin. Gloves, lab coat and goggles must be worn. Handle in a fume cupboard. Some azo dyes derived from certain amines are also carcinogenic."},
    {q: "How is the azo dye product isolated from the reaction mixture?", a: "The dye precipitates as a coloured solid (or is present as a coloured solution). It can be collected by vacuum filtration, washed with cold water, and dried."},
    {q: "What test is used to confirm a successful coupling reaction?", a: "Observation — a vivid colour (yellow/orange/red) appears instantly when the diazonium solution is added to the coupling component. No further chemical test is needed; the colour is the product."},
    {q: "What industrial importance do azo dyes have?", a: "Azo dyes are the largest class of synthetic dyes, widely used in textiles, food colouring, printing inks and cosmetics. Examples include Sudan Red, Methyl Orange and tartrazine."},
    {q: "Why must ice be used throughout the diazotisation step?", a: "The reaction of NaNO₂ with HCl is slightly exothermic, and diazonium salts decompose at even modest temperatures. Continuous ice cooling maintains the solution below 5°C."}
  ]},

  "RP11": { title: "TLC & Column Chromatography (A2)", cards: [
    {q: "How is TLC used to monitor the progress of an organic reaction?", a: "Spot samples of the reaction mixture at different time intervals alongside the pure starting material and expected product on a TLC plate. If the starting material spot diminishes and a new spot at the product's Rf appears, the reaction is proceeding."},
    {q: "How can co-spotting identify an unknown compound by TLC?", a: "Apply the unknown and a known reference compound separately, then apply a mixture of both on the same plate. If the mixture gives a single spot at the same Rf as both individual spots, the compounds are the same."},
    {q: "What is the formula for Rf value?", a: "Rf = distance moved by compound ÷ distance moved by solvent front\nRf is always between 0 and 1; it is dimensionless."},
    {q: "How does solvent polarity affect Rf values in TLC on a silica plate?", a: "A more polar solvent increases the Rf of all spots (compounds move further). A more polar compound has a lower Rf on silica (more attracted to the polar stationary phase). A less polar compound has a higher Rf."},
    {q: "Describe how column chromatography separates a mixture of dyes.", a: "Pack a glass column with silica slurry. Load the dye mixture in a small volume of solvent at the top. Add solvent (eluent) — less polar compounds elute first (less interaction with silica). Collect separate coloured fractions as they elute."},
    {q: "How is the purity of each fraction from column chromatography assessed?", a: "Run a TLC plate of each fraction. A pure fraction shows a single spot with a characteristic Rf. If multiple spots appear, the fraction contains a mixture and more separation is needed."},
    {q: "Why do amino acids require a special visualisation technique in chromatography?", a: "Amino acids are colourless under visible light. They are visualised by spraying with ninhydrin solution and heating — ninhydrin reacts with the –NH₂ group to give a purple colour (Ruhemann's purple)."},
    {q: "What is the significance of Rf values being consistent between experiments?", a: "Rf values are specific to a compound under defined conditions (same stationary phase, solvent, temperature). Consistency allows identification of unknowns by comparison with reference compounds."},
    {q: "Why must the TLC developing chamber be sealed with a lid?", a: "To saturate the atmosphere with solvent vapour. This prevents the solvent from evaporating from the TLC plate as it rises, which would cause uneven migration and distorted Rf values."},
    {q: "What effect does changing the solvent in TLC have on separation?", a: "A more polar solvent moves compounds further up the plate (higher Rf). Choosing a solvent of appropriate polarity improves separation between compounds with similar Rf values."},
    {q: "How is column chromatography used preparatively (not just analytically)?", a: "Fractions containing the desired compound are collected, combined, and the solvent is evaporated (rotary evaporator or gently heated) to yield the pure compound. This allows isolation of pure compounds from a mixture on a useful scale."},
    {q: "What is gradient elution in column chromatography?", a: "Progressively increasing the polarity of the eluting solvent during the separation. This helps elute more polar compounds that are strongly adsorbed on the stationary phase, improving separation efficiency."},
    {q: "What is the stationary phase in a standard TLC plate?", a: "Silica gel (SiO₂) coated on a glass, aluminium or plastic backing. Silica is polar and adsorbs polar compounds more strongly than non-polar ones."},
    {q: "Give one advantage of column chromatography over TLC for purification.", a: "Column chromatography is preparative — it can isolate and collect milligrams to grams of pure compound. TLC is analytical only — it identifies and analyses compounds but does not collect them in useful quantities."},
    {q: "Why is a UV-fluorescent TLC plate used for many organic compounds?", a: "The silica contains a fluorescent indicator that glows under UV light. Organic compounds quench the fluorescence, appearing as dark spots on a bright background — making colourless compounds visible."},
    {q: "What is the mobile phase in TLC and column chromatography?", a: "The solvent (or solvent mixture) that moves through the stationary phase, carrying dissolved compounds with it. Examples: ethyl acetate, hexane, dichloromethane, or mixtures."}
  ]},

  "RP12": { title: "Titrations (Redox & Acid-Base)", cards: [
    {q: "What is potassium manganate(VII) (KMnO₄) used for in redox titrations?", a: "As an oxidising agent. It oxidises reducing agents such as Fe²⁺, C₂O₄²⁻ and H₂O₂ in acidified solution. It is self-indicating — the purple MnO₄⁻ is decolourised during the reaction, and the endpoint is the first permanent pale pink colour."},
    {q: "Write the half-equation for the reduction of MnO₄⁻ in acidic solution.", a: "MnO₄⁻(aq) + 8H⁺(aq) + 5e⁻ → Mn²⁺(aq) + 4H₂O(l)\nManganese is reduced from +7 to +2; Mn²⁺ is almost colourless."},
    {q: "What acid is used to acidify KMnO₄ titrations and why?", a: "Dilute H₂SO₄ — it provides H⁺ ions needed for the half-equation and does not react with KMnO₄ or the reducing agent. HCl is not used as Cl⁻ ions are oxidised by MnO₄⁻; HNO₃ is itself an oxidising agent."},
    {q: "Write the overall ionic equation for the reaction of KMnO₄ with Fe²⁺.", a: "MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺\nMolar ratio MnO₄⁻ : Fe²⁺ = 1 : 5"},
    {q: "How is the percentage of iron in iron tablets determined by KMnO₄ titration?", a: "1. Dissolve tablets in dilute H₂SO₄.\n2. Make up to 250 cm³ in a volumetric flask.\n3. Pipette 25.0 cm³ aliquots into a conical flask.\n4. Titrate with standard KMnO₄ — endpoint: permanent pale pink.\n5. Calculate moles Fe²⁺ → moles Fe → mass Fe → %."},
    {q: "What is an iodometric (iodine–thiosulfate) titration?", a: "An oxidising agent liberates I₂ from excess KI(aq). The I₂ is then titrated with standardised Na₂S₂O₃ solution. Near the endpoint, starch indicator is added — the blue-black colour disappears at the endpoint."},
    {q: "Write the half-equation for the reaction of I₂ with thiosulfate in iodometric titrations.", a: "I₂ + 2e⁻ → 2I⁻ (reduction)\n2S₂O₃²⁻ → S₄O₆²⁻ + 2e⁻ (oxidation)\nOverall: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻"},
    {q: "Why is starch indicator added near the endpoint in iodometric titrations rather than at the start?", a: "Starch forms a very stable complex with high concentrations of I₂ at the start — this complex can be difficult to break, making the endpoint hard to detect. Added near the endpoint (when solution is pale yellow), the blue colour disappears sharply."},
    {q: "What indicator is used for strong acid vs. strong base titrations and why?", a: "Either phenolphthalein or methyl orange — both change colour within the near-vertical section of the titration curve (pH 3–10). The choice is flexible for strong/strong titrations."},
    {q: "What indicator is used for weak acid vs. strong base titrations?", a: "Phenolphthalein (changes colour pH 8.2–10.0). The equivalence point is above pH 7 (alkaline salt formed), so the indicator must change colour in the alkaline region."},
    {q: "What indicator is used for strong acid vs. weak base titrations?", a: "Methyl orange (changes colour pH 3.1–4.4). The equivalence point is below pH 7 (acidic salt formed), so the indicator must change colour in the acidic region."},
    {q: "Why is phenolphthalein unsuitable for strong acid vs. weak base titrations?", a: "Phenolphthalein changes colour above pH 8. For strong acid–weak base, the equivalence point is at pH < 7. The indicator would change colour before the equivalence point is reached — giving an inaccurate result."},
    {q: "What is a back titration and when is it used?", a: "An excess of a known reagent is added to react fully with the analyte. The remaining excess is then titrated. Used when the analyte is insoluble (e.g. CaCO₃) or reacts too slowly for direct titration."},
    {q: "Describe the preparation of a standard KMnO₄ solution.", a: "Weigh the required mass of KMnO₄ accurately. Dissolve in distilled water in a beaker. Transfer to a volumetric flask and make up to the mark. KMnO₄ is a strong oxidant — do not use a rubber bung and clean apparatus thoroughly."},
    {q: "What is a standard solution?", a: "A solution of precisely known concentration, prepared by dissolving a known mass of a primary standard (or by standardisation) and making up to an accurate volume in a volumetric flask."},
    {q: "How is concordance assessed in titration results?", a: "Two or more titres that agree within 0.10 cm³ of each other are described as concordant. The mean of concordant titres is used in calculations (rough titre is excluded)."}
  ]},

  // ═══════════════════════════════════════════════
  // AQA REQUIRED PRACTICALS (NEW / MISSING ACTIVITIES)
  // ═══════════════════════════════════════════════

  "RP_A3": { title: "Rate vs Temperature (Activity 3)", cards: [
    {q: "What reaction is used in AQA Required Activity 3 to investigate how rate changes with temperature?", a: "Sodium thiosulfate and hydrochloric acid:\nNa₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + SO₂(g) + S(s) + H₂O(l)\nSulfur precipitates gradually, making the solution cloudy until a cross placed beneath the flask can no longer be seen."},
    {q: "How is reaction rate measured in the sodium thiosulfate and HCl experiment?", a: "A cross is placed beneath the reaction flask. The time t is measured for the cross to disappear as the sulfur precipitate forms. Rate is taken as 1/t.\nThis approximates the initial rate because the same fixed amount of sulfur is produced before the cross disappears in every run."},
    {q: "Why is rate = 1/t a valid approximation for initial rate in this experiment?", a: "Each run uses the same initial concentration of thiosulfate, so the same fixed amount of sulfur is produced before the cross disappears. The change in concentration of sulfur to the end-point is constant across runs, so only the time differs -- making 1/t proportional to rate."},
    {q: "Describe the method for Required Activity 3.", a: "1. Measure 10 cm³ of 0.2 M HCl and 10 cm³ of Na₂S₂O₃ separately in measuring cylinders.\n2. Use a water bath to equilibrate both solutions to the chosen temperature.\n3. Place the flask on a paper cross. Add Na₂S₂O₃ first, then HCl and start the timer immediately.\n4. Swirl and stop the timer when the cross is no longer visible.\n5. Repeat at four more temperatures up to a maximum of 70°C."},
    {q: "What graph is plotted to determine activation energy (Ea) from the rate-temperature data?", a: "ln(rate) or ln(1/t) on the y-axis against 1/T (in K⁻¹) on the x-axis.\nThis is the linearised Arrhenius equation. A straight line with a negative gradient is obtained. Gradient = -Ea/R."},
    {q: "State the Arrhenius equation in its linear form and identify each term.", a: "ln k = ln A - Ea/(RT)\nGradient = -Ea/R; y-intercept = ln A.\nEa = activation energy (J mol⁻¹), R = 8.31 J K⁻¹ mol⁻¹, T = temperature in Kelvin, A = pre-exponential (frequency) factor."},
    {q: "How is Ea calculated from the gradient of an Arrhenius plot?", a: "Ea = -gradient × R = -gradient × 8.31 (units: J mol⁻¹).\nDivide by 1000 to convert to kJ mol⁻¹.\nChoose two points far apart on the line of best fit to calculate the gradient accurately."},
    {q: "Why must temperature be converted to Kelvin before plotting 1/T?", a: "The Arrhenius equation requires absolute temperature T in Kelvin. Using °C would produce a non-linear result and give an incorrect value of Ea."},
    {q: "What are the main sources of error in the sodium thiosulfate and HCl experiment?", a: "Subjective judgement of when the cross disappears (inconsistent timing).\nTemperature of the water bath may fluctuate during the experiment.\nBoth solutions must be at the same temperature before mixing; a temperature difference introduces error.\nDelay in starting or stopping the timer."},
    {q: "Why should a maximum temperature of 70°C be used in this experiment?", a: "Above 70°C the reaction is too fast to time accurately, giving large percentage errors in t. At high temperatures the solutions may also begin to decompose, and the risk from hot acid increases."},
    {q: "If the gradient of the ln(1/t) vs 1/T graph is -5680, calculate Ea.", a: "Ea = -gradient × R = 5680 × 8.31 = 47 200 J mol⁻¹ = 47.2 kJ mol⁻¹.\n(The gradient is negative, so -gradient is positive, giving a positive Ea as expected.)"},
    {q: "What safety precautions are required for the sodium thiosulfate and HCl experiment?", a: "HCl is corrosive at higher concentrations and an irritant at lower concentrations: wear goggles.\nSO₂ gas is produced: work in a well-ventilated area or fume cupboard.\nNa₂S₂O₃ is a mild irritant: wash hands after use.\nAvoid splashing solutions, especially when heating."}
  ]},

  "RP_A4": { title: "Testing for Cations and Anions (Activity 4)", cards: [
    {q: "Describe the test for Group 2 metal ions using sodium hydroxide solution.", a: "Add NaOH(aq) dropwise to the metal ion solution.\nMg²⁺: white precipitate of Mg(OH)₂ (insoluble).\nCa²⁺: white precipitate of Ca(OH)₂ (sparingly soluble; more NaOH may be needed).\nSr²⁺ and Ba²⁺: no precipitate (hydroxides are soluble); the solution becomes strongly alkaline."},
    {q: "Write the ionic equation for magnesium hydroxide forming when NaOH is added to Mg²⁺(aq).", a: "Mg²⁺(aq) + 2OH⁻(aq) → Mg(OH)₂(s)\nWhite precipitate formed. This also applies to Ca²⁺ forming Ca(OH)₂(s)."},
    {q: "How do you test for ammonium ions (NH₄⁺)?", a: "Add dilute NaOH(aq) and warm the mixture gently in a water bath.\nAmmonia gas is released, turning damp red litmus paper blue (alkaline gas).\nNH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)"},
    {q: "Describe the test for sulfate ions (SO₄²⁻) and explain the role of HCl.", a: "Add acidified barium chloride solution (BaCl₂ acidified with dilute HCl) to the test solution.\nA white precipitate of barium sulfate confirms sulfate ions: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s).\nHCl prevents barium carbonate (BaCO₃) forming (carbonate impurities would give a false white precipitate)."},
    {q: "Why must the barium chloride be acidified with HCl and NOT with H₂SO₄ when testing for sulfate ions?", a: "H₂SO₄ contains sulfate ions -- adding it would produce a false positive precipitate of BaSO₄ even if no sulfate were present in the original sample.\nHCl is used instead because chloride ions do not form precipitates with Ba²⁺."},
    {q: "Describe the silver nitrate test for halide ions.", a: "Acidify the test solution with dilute HNO₃, then add AgNO₃(aq) dropwise.\nCl⁻: white precipitate of AgCl.\nBr⁻: cream precipitate of AgBr.\nI⁻: pale yellow precipitate of AgI.\nHNO₃ prevents carbonate interference (Ag₂CO₃ would give a white precipitate masking the result)."},
    {q: "How can AgCl, AgBr and AgI precipitates be distinguished after they have formed?", a: "Treat with ammonia solution:\nAgCl dissolves in dilute NH₃: AgCl(s) + 2NH₃(aq) → [Ag(NH₃)₂]⁺(aq) + Cl⁻(aq) -- colourless solution.\nAgBr dissolves only in concentrated NH₃.\nAgI does not dissolve in either dilute or concentrated NH₃ (too insoluble)."},
    {q: "Describe the test for carbonate ions (CO₃²⁻).", a: "Add dilute acid (e.g. dilute HCl). Effervescence (fizzing) is observed as CO₂ is released.\nBubble the gas through limewater: limewater turns cloudy if CO₂ is present.\n2HCl(aq) + Na₂CO₃(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)"},
    {q: "How do you test for the presence of hydroxide ions (OH⁻)?", a: "Test with damp red litmus paper held in the test tube: the paper turns blue because OH⁻ ions make the solution alkaline.\nAlternatively, measure the pH: a value significantly above 7 indicates OH⁻ ions are present."},
    {q: "How does the solubility trend of Group 2 hydroxides affect the NaOH precipitate test?", a: "Mg(OH)₂ is insoluble: a clear white precipitate always forms.\nCa(OH)₂ is sparingly soluble: a precipitate forms but may need more NaOH to become visible.\nSr(OH)₂ and Ba(OH)₂ are soluble: no precipitate; the solution turns very alkaline.\n(Hydroxide solubility increases down Group 2.)"},
    {q: "How does the solubility trend of Group 2 sulfates apply to the BaCl₂ anion test?", a: "MgSO₄ and CaSO₄ are soluble: Mg²⁺ and Ca²⁺ solutions give no precipitate with SO₄²⁻.\nSrSO₄ and BaSO₄ are insoluble: Sr²⁺ and Ba²⁺ solutions give a white precipitate.\n(Sulfate solubility DECREASES down Group 2 -- opposite trend to hydroxides.)"},
    {q: "What ionic equations represent the three silver halide precipitate reactions?", a: "Ag⁺(aq) + Cl⁻(aq) → AgCl(s) -- white\nAg⁺(aq) + Br⁻(aq) → AgBr(s) -- cream\nAg⁺(aq) + I⁻(aq) → AgI(s) -- pale yellow"}
  ]},

  "RP_A6": { title: "Functional Group Tests (Activity 6)", cards: [
    {q: "How do you test for an alkene using bromine water?", a: "Add a few drops of the unknown liquid or solution to 0.5 cm³ of bromine water in a test tube and shake.\nResult: alkenes decolourise the orange/brown bromine water, turning it colourless (Br₂ adds across the C=C).\nAlkanes and most other compounds do not decolourise bromine water in the absence of UV light."},
    {q: "How do you test for an aldehyde using Tollens' reagent?", a: "Prepare Tollens' reagent (silver nitrate + NaOH + NH₃ until precipitate dissolves). Add a few drops of the unknown and heat gently in a warm water bath (50-60°C).\nResult with aldehydes: a silver mirror forms on the inside of the test tube.\nKetones give no change.\nReaction: RCHO + 2Ag⁺ + H₂O → RCOOH + 2Ag(s) + 2H⁺"},
    {q: "How is Tollens' reagent prepared in the laboratory?", a: "1. Place 1 cm³ of AgNO₃(aq) in a test tube.\n2. Add one drop of NaOH(aq): a brown Ag₂O precipitate forms.\n3. Add NH₃(aq) dropwise with shaking until the precipitate just dissolves to give a clear, colourless solution.\nUse immediately. Do NOT store: dried silver residues can be shock-sensitive."},
    {q: "How do you test for an aldehyde using Fehling's solution?", a: "Mix equal volumes of Fehling's A (copper sulfate) and Fehling's B (NaOH + sodium potassium tartrate). Add a few drops of the unknown and heat in a warm water bath.\nResult with aldehydes: the blue Cu²⁺ solution forms a brick-red precipitate of copper(I) oxide, Cu₂O.\nKetones give no change.\nReaction: RCHO + 2Cu²⁺ + 2H₂O → RCOOH + Cu₂O(s) + 4H⁺"},
    {q: "How do you test for a carboxylic acid?", a: "Add a small amount of sodium carbonate (Na₂CO₃) solid or solution to the unknown.\nResult: effervescence (fizzing) due to CO₂ gas evolving confirms a carboxylic acid.\n2RCOOH + Na₂CO₃ → 2RCOONa + H₂O + CO₂"},
    {q: "How do you test for an alcohol using acidified potassium dichromate(VI)?", a: "Add a few drops of the unknown to acidified K₂Cr₂O₇ solution (orange) and warm gently.\nResult: the orange solution turns green if a primary or secondary alcohol is present (oxidised to aldehyde or ketone).\nTertiary alcohols give no colour change (cannot be oxidised under these conditions).\nNote: aldehydes also give orange to green with K₂Cr₂O₇."},
    {q: "What is the key difference between the aldehyde and ketone tests using Tollens' and Fehling's reagents?", a: "Aldehydes react with BOTH Tollens' (silver mirror) and Fehling's (red precipitate of Cu₂O) because they can be oxidised to carboxylic acids.\nKetones do NOT react with either reagent; they cannot be oxidised under these mild conditions.\nThis is the standard test to distinguish between aldehydes and ketones."},
    {q: "Summarise the key functional group tests and their results.", a: "Alkene: bromine water decolourised (orange to colourless).\nAldehyde: Tollens' gives silver mirror; Fehling's gives red Cu₂O precipitate.\nKetone: no reaction with Tollens' or Fehling's.\nCarboxylic acid: effervescence with Na₂CO₃.\nPrimary/secondary alcohol: orange to green with acidified K₂Cr₂O₇.\nTertiary alcohol: no reaction with acidified K₂Cr₂O₇."},
    {q: "How does the bromine water test distinguish an alkene from an alkane?", a: "Alkenes decolourise bromine water in the dark (electrophilic addition of Br₂ across C=C).\nAlkanes do NOT decolourise bromine water in the dark; they react only under UV light (free radical substitution), producing HBr gas.\nNo UV light: decolouration indicates an alkene."},
    {q: "What result does a halogenoalkane give with warm silver nitrate solution in ethanol?", a: "Warm with AgNO₃(aq) in ethanol.\nChloroalkane: slow white precipitate of AgCl.\nBromoalkane: cream precipitate of AgBr forms faster.\nIodoalkane: pale yellow precipitate of AgI forms first.\nThe rate of precipitate formation reflects the C-X bond strength (C-I weakest, hydrolyses fastest)."},
    {q: "What safety precautions are required for functional group tests?", a: "Tollens' reagent must be prepared fresh and disposed of immediately: dried silver compounds are potentially explosive.\nK₂Cr₂O₇ is toxic and a carcinogen: wear gloves, avoid skin contact.\nH₂SO₄ is corrosive: add carefully.\nBromine water is corrosive and toxic: use small volumes in a fume cupboard.\nAll heating should be in a water bath -- no naked flames with organic compounds."}
  ]},

  "RP_A7b": { title: "Continuous Monitoring Method (Activity 7b)", cards: [
    {q: "What is the continuous monitoring method for measuring reaction rate?", a: "One reaction is followed over time by recording a measurable quantity (e.g. gas volume, mass, absorbance) at regular time intervals. A concentration-time or volume-time graph is plotted from the data."},
    {q: "What does the gradient of a concentration-time graph represent?", a: "The gradient equals the rate of reaction at that moment. A steeper gradient means a faster rate.\nThe gradient is greatest at t = 0 (initial rate, highest reactant concentrations) and decreases toward zero as reactants are consumed."},
    {q: "How is the initial rate found from a continuous monitoring graph?", a: "Draw a tangent to the curve at t = 0. The gradient of this tangent equals the initial rate.\nGradient = change in y / change in x, using the tangent line -- NOT a chord through the curve."},
    {q: "Describe the gas syringe method for measuring rate continuously.", a: "Connect a gas syringe to the reaction flask via a sealed bung. Record the volume of gas collected at regular time intervals (e.g. every 15 seconds). Plot volume of gas vs time.\nExample: Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)"},
    {q: "Describe the method for the magnesium and hydrochloric acid continuous monitoring experiment.", a: "1. Measure 50 cm³ of 1.0 mol dm⁻³ HCl into a conical flask.\n2. Set up the gas syringe in a stand.\n3. Weigh 0.20 g of magnesium ribbon.\n4. Add Mg to the flask, insert the bung firmly and start the timer immediately.\n5. Record the volume of H₂ gas collected every 15 seconds for 3 minutes."},
    {q: "What are the main methods used for continuous monitoring of a reaction?", a: "1. Gas syringe: measure volume of gas produced (requires gas to be released).\n2. Mass change: place the flask on a balance; mass decreases if a gas escapes (e.g. CO₂ from acid + carbonate).\n3. Colorimetry: measure absorbance at regular intervals if a coloured reactant or product is involved.\n4. Titration of withdrawn samples: remove small aliquots, quench, then titrate."},
    {q: "When is the mass loss method used, and what is its limitation?", a: "Used when a gas escapes from the reaction mixture (e.g. CO₂ from HCOOH + Br₂ or CaCO₃ + HCl).\nLimitation: works best with dense gases like CO₂. Light gases like H₂ or HCl escape too quickly for reliable measurements. The balance must be sensitive enough for the expected mass change."},
    {q: "What does 'pseudo-zero order' mean in a continuous monitoring experiment?", a: "If one reactant is in large excess, its concentration remains approximately constant throughout the reaction. This reactant appears to have no effect on rate and is treated as pseudo-zero order in that experiment. The method isolates the effect of the other reactant on rate."},
    {q: "Why does a volume-time or concentration-time graph eventually become horizontal?", a: "The rate approaches zero as reactants are consumed. When the limiting reactant is completely used up, no further reaction occurs and the graph plateaus. The final horizontal value represents the maximum extent of reaction."},
    {q: "How does colorimetry enable continuous monitoring of a reaction rate?", a: "If a reactant or product is coloured, place the reaction mixture in a colorimeter cuvette and record absorbance at regular time intervals.\nAbsorbance is directly proportional to concentration (Beer-Lambert law), so changing absorbance reflects changing concentration over time."},
    {q: "What safety precautions are needed for the Mg + HCl gas syringe experiment?", a: "HCl is corrosive at higher concentrations: wear goggles and gloves.\nH₂ gas produced is highly flammable: no naked flames; ensure good ventilation.\nInsert the bung immediately when Mg is added to prevent gas loss at the start.\nDo not overfill the syringe: standard gas syringes have a maximum volume of about 100 cm³."},
    {q: "What is the difference in purpose between the initial rate method (Activity 7a) and continuous monitoring (Activity 7b)?", a: "Initial rate method (7a): many separate experiments with varying starting concentrations; determines reaction order and rate equation.\nContinuous monitoring (7b): one experiment followed over time; gives the full rate profile (how rate changes as concentrations fall) and allows half-life to be measured for first-order reactions."}
  ]},

  "RP_A9": { title: "Titration Curves (Activity 9)", cards: [
    {q: "Describe the method for constructing a pH curve by adding alkali to acid.", a: "1. Pipette 25 cm³ of acid into a conical flask.\n2. Calibrate the pH meter using a buffer solution of known pH, then measure the initial pH.\n3. Add alkali from a burette in 1-2 cm³ increments; stir and record pH after each addition.\n4. Near the equivalence point, add smaller volumes (0.1-0.5 cm³) to capture the steep section accurately.\n5. Continue until alkali is in excess.\n6. Plot pH on the y-axis vs volume of alkali added on the x-axis."},
    {q: "Why must a pH meter be calibrated before use?", a: "pH meters can drift and lose accuracy on storage. Calibration corrects the reading by placing the probe in a buffer solution of known pH (e.g. pH 4.00) and pressing the calibration button. This sets the meter to give accurate pH values for the test solutions."},
    {q: "Describe the shape of a strong acid-strong base pH curve.", a: "Starts at low pH (about 1-2 for 0.1 mol dm⁻³ HCl).\nRises slowly, then has a near-vertical section from pH 3 to pH 11.\nEquivalence point at pH = 7 (midpoint of the steep section).\nEnds at high pH (about 13 in excess NaOH)."},
    {q: "Describe the shape of a weak acid-strong base pH curve.", a: "Starts at a higher pH than strong acid (typically pH 3-4 for 0.1 mol dm⁻³ ethanoic acid).\nHas a flattened buffer region before the equivalence point.\nSteep section is above pH 7 (approximately pH 7-11).\nEquivalence point is above pH 7 (the salt is alkaline by hydrolysis).\nAt half the equivalence volume, pH = pKa."},
    {q: "What is the buffer region on a weak acid-strong base titration curve?", a: "The flat section of the pH curve before the equivalence point, where the pH changes very little as alkali is added. It forms because a buffer solution is present: both the weak acid HA and its conjugate base A⁻ are in significant amounts. The buffer resists pH change by consuming added OH⁻ or H⁺."},
    {q: "At what volume is pH = pKa in a weak acid-strong base titration, and why?", a: "At the half-equivalence point (half the volume needed to reach equivalence).\nAt this point [HA] = [A⁻], so Ka = [H⁺][A⁻]/[HA] = [H⁺].\nTherefore pH = pKa. This allows Ka of the weak acid to be determined directly from the titration curve."},
    {q: "Describe the shape of a strong acid-weak base pH curve.", a: "Starts at low pH (about 1-2).\nSteep section is below pH 7 (approximately pH 3-7).\nEquivalence point is below pH 7 (the salt formed is slightly acidic due to hydrolysis of the ammonium ion).\nNo buffer region in the basic region."},
    {q: "Describe the shape of a weak acid-weak base pH curve.", a: "There is NO steep section on the curve.\nThe pH changes gradually throughout the titration.\nNo indicator can be used reliably (indicators need a steep region to give a sharp colour change at the endpoint).\nA pH meter must be used to identify the equivalence point."},
    {q: "How do you identify the equivalence point from a pH curve?", a: "The equivalence point is at the midpoint of the steepest part (the inflection point) of the curve.\nStrong acid/strong base: pH = 7.\nWeak acid/strong base: pH > 7.\nStrong acid/weak base: pH < 7."},
    {q: "How do you use a pH curve to choose an appropriate indicator?", a: "The indicator's colour change range (approximately 2 pH units wide, centred on its pKIn) must fall within the steep section of the titration curve.\nStrong/strong: methyl orange (3.1-4.4) or phenolphthalein (8.2-10.0) both work.\nWeak acid/strong base: phenolphthalein only (equivalence point above pH 7).\nStrong acid/weak base: methyl orange only (equivalence point below pH 7)."},
    {q: "Why is phenolphthalein unsuitable for a strong acid-weak base titration?", a: "Phenolphthalein changes colour between pH 8.2 and 10.0. For a strong acid-weak base titration, the equivalence point is below pH 7. The indicator colour change would occur well before the equivalence point is reached, giving an inaccurate result."},
    {q: "Why should temperature be kept constant during a titration curve experiment?", a: "pH depends on temperature: Kw and Ka values change with temperature, shifting all equilibria. If temperature varies during the experiment, pH readings will be inconsistent and the shape of the curve will be distorted. A constant temperature (e.g. 25°C) is maintained for reliable results."}
  ]},

  "RP_A11": { title: "Testing Transition Metal Ions (Activity 11)", cards: [
    {q: "What colour precipitate does Cu²⁺(aq) form when NaOH(aq) is added?", a: "A blue precipitate of copper(II) hydroxide.\nIonic equation: [Cu(H₂O)₆]²⁺(aq) + 2OH⁻(aq) → Cu(H₂O)₄(OH)₂(s) + 2H₂O(l)"},
    {q: "What colour precipitate does Fe²⁺(aq) form when NaOH(aq) is added?", a: "A green precipitate of iron(II) hydroxide.\nIonic equation: [Fe(H₂O)₆]²⁺(aq) + 2OH⁻(aq) → Fe(H₂O)₄(OH)₂(s) + 2H₂O(l)\nNote: the green precipitate may turn brown at the surface as Fe²⁺ is oxidised to Fe³⁺ in air."},
    {q: "What colour precipitate does Fe³⁺(aq) form when NaOH(aq) is added?", a: "A brown precipitate of iron(III) hydroxide.\nIonic equation: [Fe(H₂O)₆]³⁺(aq) + 3OH⁻(aq) → Fe(H₂O)₃(OH)₃(s) + 3H₂O(l)"},
    {q: "What happens when excess NaOH(aq) is added to Al³⁺(aq)?", a: "A white precipitate of aluminium hydroxide forms first. With excess NaOH the precipitate dissolves to give a colourless solution of [Al(OH)₄]⁻.\nAl(H₂O)₃(OH)₃(s) + OH⁻(aq) → [Al(OH)₄]⁻(aq) + 3H₂O(l)\nAluminium hydroxide is amphoteric: it dissolves in both acid and alkali."},
    {q: "What happens when excess NH₃(aq) is added to Cu²⁺(aq)?", a: "A blue precipitate of copper hydroxide forms first with limited NH₃. With excess NH₃ the precipitate dissolves as NH₃ acts as a ligand, forming the deep blue complex [Cu(NH₃)₄(H₂O)₂]²⁺.\nCu(OH)₂(s) + 4NH₃(aq) → [Cu(NH₃)₄(H₂O)₂]²⁺(aq) + 2OH⁻(aq)"},
    {q: "What is the colour change when excess NH₃(aq) is added to Cu²⁺(aq)?", a: "Limited NH₃: blue precipitate of Cu(OH)₂ forms.\nExcess NH₃: the precipitate dissolves to give a deep blue/royal blue solution of the tetraamminecopper(II) complex [Cu(NH₃)₄(H₂O)₂]²⁺.\nThe deep blue complex is more intensely coloured than the original pale blue Cu²⁺(aq)."},
    {q: "What result does Fe²⁺ or Fe³⁺ give with excess NH₃(aq)?", a: "Both Fe²⁺ (green ppt) and Fe³⁺ (brown ppt) form hydroxide precipitates with limited NH₃. The precipitates do NOT dissolve in excess NH₃ because Fe²⁺ and Fe³⁺ do not form stable ammine complexes (unlike Cu²⁺)."},
    {q: "What is observed when Na₂CO₃(aq) is added to Fe³⁺(aq)?", a: "A brown precipitate of iron(III) hydroxide forms AND CO₂ gas evolves (effervescence).\n2[Fe(H₂O)₆]³⁺ + 3CO₃²⁻ → 2Fe(OH)₃·3H₂O(s) + 3CO₂(g)\nThe high charge density of Fe³⁺ polarises the carbonate, causing hydrolysis to OH⁻ and CO₂. Fe³⁺ forms a hydroxide, not a carbonate."},
    {q: "What is observed when Na₂CO₃(aq) is added to Cu²⁺(aq)?", a: "A blue-green precipitate of copper(II) carbonate (CuCO₃) forms. No gas is evolved.\nCu²⁺(aq) + CO₃²⁻(aq) → CuCO₃(s)\n2+ metal ions have lower charge density than 3+ ions and do not polarise carbonate enough to cause hydrolysis, so M(CO₃) precipitates form instead of hydroxides."},
    {q: "Describe the method for Required Activity 11.", a: "1. Place about 10 drops of the metal ion solution in a test tube.\n2. NaOH test: add NaOH(aq) dropwise with gentle shaking until in excess; note precipitate colour and whether it dissolves.\n3. NH₃ test: add NH₃(aq) dropwise until in excess; note initial precipitate colour and whether it dissolves.\n4. Na₂CO₃ test: add Na₂CO₃(aq); note precipitate colour and whether gas is evolved.\n5. Record all observations carefully."},
    {q: "Summarise the colours of hydroxide precipitates formed with NaOH for key metal ions.", a: "Cu²⁺: blue precipitate, does not dissolve in excess NaOH.\nFe²⁺: green precipitate, does not dissolve in excess NaOH.\nFe³⁺: brown precipitate, does not dissolve in excess NaOH.\nAl³⁺: white precipitate, dissolves in excess NaOH to give colourless [Al(OH)₄]⁻."},
    {q: "Why do 3+ metal ions form hydroxide precipitates (not carbonates) when Na₂CO₃ is added?", a: "The high charge density (small, highly charged ion) of 3+ ions strongly polarises the carbonate ion CO₃²⁻, causing it to hydrolyse: CO₃²⁻ is effectively converted to OH⁻ and CO₂.\nSo M³⁺ + CO₃²⁻ → M(OH)₃ + CO₂, not M₂(CO₃)₃.\n2+ ions have lower charge density and form insoluble M(CO₃) precipitates without decomposing the carbonate."}
  ]},

  // ═══════════════════════════════════════════════
  // OCR A CHEMISTRY (H432)
  // ═══════════════════════════════════════════════

  "ocr_2.1.1": { title: "Atoms, Ions and Molecules", cards: [
    {q:"Define atomic number and mass number.", a:"Atomic number (Z): number of protons in the nucleus.\nMass number (A): total number of protons + neutrons in the nucleus.\nNumber of neutrons = A − Z."},
    {q:"Define isotopes.", a:"Isotopes are atoms of the same element with the same atomic number (same number of protons) but different mass numbers (different numbers of neutrons).\nThey have identical chemical properties but slightly different physical properties (e.g. density, boiling point)."},
    {q:"Define relative atomic mass (Ar).", a:"The weighted mean mass of all naturally occurring isotopes of an element, expressed on a scale where ¹²C = 12.000 exactly.\nAr = Σ(isotopic mass × fractional abundance)"},
    {q:"Define relative molecular mass (Mr).", a:"The weighted mean mass of a molecule relative to 1/12 the mass of a carbon-12 atom.\nMr = sum of the Ar values of all atoms in the molecular formula.\nFor ionic compounds, it is called relative formula mass."},
    {q:"How do you calculate Ar from isotopic abundances?", a:"Ar = Σ(isotopic mass × % abundance) / 100\nExample: Cl has ³⁵Cl (75%) and ³⁷Cl (25%):\nAr = (35 × 75 + 37 × 25) / 100 = 35.5"},
    {q:"What is a cation and an anion?", a:"Cation: a positively charged ion formed by losing electrons (e.g. Na⁺, Mg²⁺, Al³⁺).\nAnion: a negatively charged ion formed by gaining electrons (e.g. Cl⁻, O²⁻, N³⁻)."},
    {q:"State the common ionic charges for elements in Groups 1–7.", a:"Group 1: 1+ (e.g. Na⁺, K⁺)\nGroup 2: 2+ (e.g. Mg²⁺, Ca²⁺)\nGroup 3: 3+ (e.g. Al³⁺)\nGroup 5: 3− (e.g. N³⁻)\nGroup 6: 2− (e.g. O²⁻, S²⁻)\nGroup 7: 1− (e.g. Cl⁻, Br⁻, I⁻)"},
    {q:"State the Aufbau principle, Pauli exclusion principle, and Hund's rule.", a:"Aufbau: electrons occupy the lowest available energy orbital first.\nPauli exclusion: each orbital holds a maximum of 2 electrons with opposite spins.\nHund's rule: electrons fill degenerate (same energy) orbitals singly before pairing; all unpaired electrons have the same spin."},
    {q:"Give the filling order for subshells up to 4p.", a:"1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p\nNote: 4s fills before 3d but 3d electrons are lost first when forming ions."},
    {q:"Write the full electron configuration of iron (Fe, Z=26).", a:"Fe: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²\nor [Ar] 3d⁶ 4s²\nFe²⁺: [Ar] 3d⁶ (4s electrons lost first)\nFe³⁺: [Ar] 3d⁵"},
    {q:"Why are the electron configurations of Cr and Cu anomalous?", a:"Cr: [Ar] 3d⁵ 4s¹ (not 3d⁴ 4s²) — half-filled d subshell is extra stable.\nCu: [Ar] 3d¹⁰ 4s¹ (not 3d⁹ 4s²) — fully filled d subshell is extra stable.\nBoth involve promoting one 4s electron to 3d."},
    {q:"How many electrons can s, p, d, and f subshells hold?", a:"s subshell: 1 orbital → max 2 electrons\np subshell: 3 orbitals → max 6 electrons\nd subshell: 5 orbitals → max 10 electrons\nf subshell: 7 orbitals → max 14 electrons"},
    {q:"Write the electron configuration of the first 10 elements.", a:"H: 1s¹\nHe: 1s²\nLi: 1s² 2s¹\nBe: 1s² 2s²\nB: 1s² 2s² 2p¹\nC: 1s² 2s² 2p²\nN: 1s² 2s² 2p³\nO: 1s² 2s² 2p⁴\nF: 1s² 2s² 2p⁵\nNe: 1s² 2s² 2p⁶"},
    {q:"What does it mean to write an electron configuration using noble gas shorthand?", a:"Replace the inner electron configuration with the symbol of the preceding noble gas in square brackets.\nExample: Na [Ne] 3s¹; Ca [Ar] 4s²; Fe [Ar] 3d⁶ 4s²\nThis simplifies writing for larger atoms."},
    {q:"What is an orbital?", a:"A region of space around the nucleus where there is a high probability (≥90%) of finding an electron.\nEach orbital has a characteristic shape: s = spherical, p = dumbbell/figure-8.\nEach orbital holds a maximum of 2 electrons with opposite spins."},
    {q:"How does the electron configuration change when a transition metal forms an ion?", a:"4s electrons are removed before 3d electrons when transition metals form ions, because once filled, 3d is lower in energy than 4s.\nExample: Fe → Fe²⁺: lose both 4s electrons → [Ar]3d⁶\nFe → Fe³⁺: lose both 4s and one 3d → [Ar]3d⁵"},
    {q:"What is the electron configuration of Zn²⁺?", a:"Zn: [Ar] 3d¹⁰ 4s²\nZn²⁺: [Ar] 3d¹⁰ (both 4s electrons lost)\nZn²⁺ has a full 3d subshell — this is why zinc is NOT classified as a transition metal."},
  ]},

  "ocr_2.1.2": { title: "Compounds, Formulae and Equations", cards: [
    {q:"How do you work out the formula of an ionic compound from ionic charges?", a:"The charges on cation and anion must balance to give an overall neutral compound.\nMethod: swap the numerical values of the charges (ignoring sign) as subscripts.\nExample: Al³⁺ and O²⁻ → Al₂O₃ (2×3+ and 3×2− = 0)"},
    {q:"What is empirical formula and how does it differ from molecular formula?", a:"Empirical formula: simplest whole-number ratio of atoms of each element in a compound (e.g. CH₂O for glucose).\nMolecular formula: actual number of each type of atom in one molecule (e.g. C₆H₁₂O₆ for glucose).\nMolecular formula = n × empirical formula, where n is a positive integer."},
    {q:"State the rules for writing balanced equations and the meaning of state symbols.", a:"Every balanced equation must have equal numbers of each type of atom on both sides, and equal total charge.\nState symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous solution.\nCoefficients are placed in front of formulae — never change subscripts within a formula."},
    {q:"What is an ionic equation and what are spectator ions?", a:"An ionic equation shows only the species that undergo change, written as ions where appropriate.\nSpectator ions are ions present in solution that take no part in the reaction — they appear identically on both sides and are cancelled out.\nExample: Ag⁺(aq) + Cl⁻(aq) → AgCl(s)"},
    {q:"Name the following common polyatomic ions: SO₄²⁻, NO₃⁻, CO₃²⁻, NH₄⁺, OH⁻, PO₄³⁻.", a:"SO₄²⁻: sulfate\nNO₃⁻: nitrate\nCO₃²⁻: carbonate\nNH₄⁺: ammonium\nOH⁻: hydroxide\nPO₄³⁻: phosphate"},
    {q:"How are binary compounds named?", a:"Binary compound = two elements only.\nName the more metallic/less electronegative element first, then add -ide suffix to the second element.\nExamples: NaCl = sodium chloride, MgO = magnesium oxide, FeCl₃ = iron(III) chloride (Roman numeral shows oxidation state)"},
    {q:"Name the common acids: HCl(aq), H₂SO₄(aq), HNO₃(aq).", a:"HCl(aq): hydrochloric acid\nH₂SO₄(aq): sulfuric acid\nHNO₃(aq): nitric acid\nThe (aq) indicates the acid is dissolved in water. The pure compounds are hydrogen chloride, sulfuric acid, and nitric acid."},
    {q:"State the rules for assigning oxidation states.", a:"1. Uncombined element = 0\n2. Monatomic ion = ionic charge\n3. H in compounds = +1 (except metal hydrides: −1)\n4. O in compounds = −2 (except peroxides: −1; OF₂: +2)\n5. F always = −1\n6. Sum of oxidation states = 0 for neutral compound, or equals the overall charge for an ion."},
    {q:"What is the oxidation state of S in H₂SO₄ and N in HNO₃?", a:"H₂SO₄: 2(+1) + S + 4(−2) = 0 → S = +6\nHNO₃: +1 + N + 3(−2) = 0 → N = +5\nThese represent the highest common oxidation states of S and N."},
    {q:"How do you balance a redox equation using half-equations?", a:"1. Write separate half-equations for oxidation and reduction.\n2. Balance atoms (other than H and O) first.\n3. Balance O by adding H₂O; balance H by adding H⁺.\n4. Balance charge by adding electrons.\n5. Multiply half-equations so electrons cancel, then add them together."},
    {q:"What common oxidation states does iron display?", a:"Fe: 0 (metal), +2 (Fe²⁺, iron(II), pale green in solution), +3 (Fe³⁺, iron(III), yellow/orange in solution).\nFe²⁺ is a reducing agent (easily oxidised to Fe³⁺).\nFe³⁺ is an oxidising agent (can be reduced back to Fe²⁺)."},
    {q:"Write a balanced equation for the reaction of magnesium with dilute hydrochloric acid.", a:"Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)\nIonic equation: Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)\nCl⁻ is a spectator ion."},
    {q:"Write balanced equations for the reactions of Na₂CO₃ with dilute HCl.", a:"Na₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)\nIonic: CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g)\nObservation: effervescence (bubbling) as CO₂ is released."},
    {q:"What is the formula of iron(III) sulfate?", a:"Iron(III) = Fe³⁺; sulfate = SO₄²⁻\nTo balance: 2×Fe³⁺ (charge 6+) and 3×SO₄²⁻ (charge 6−).\nFormula: Fe₂(SO₄)₃"},
    {q:"Distinguish between a molecular equation and a net ionic equation with an example.", a:"Molecular equation shows all species as complete formulae:\nNaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)\nNet ionic equation removes spectator ions (Na⁺, Cl⁻):\nOH⁻(aq) + H⁺(aq) → H₂O(l)\nNet ionic equations reveal what is chemically happening."},
  ]},

  "ocr_2.1.3": { title: "Amount of Substance", cards: [
    {q:"What is the mole and what is Avogadro's constant?", a:"One mole is the amount of substance containing exactly 6.022 × 10²³ entities (atoms, molecules, ions, electrons, etc.).\nAvogadro's constant Nₐ = 6.022 × 10²³ mol⁻¹.\nMolar mass M (g mol⁻¹) numerically equals Ar or Mr."},
    {q:"State the formula linking moles, mass, and molar mass.", a:"n = m / M\nn = moles (mol), m = mass (g), M = molar mass (g mol⁻¹)\nRearrangements: m = n × M; M = m / n"},
    {q:"State the formula linking concentration, moles, and volume.", a:"c = n / V\nc = concentration (mol dm⁻³), n = moles (mol), V = volume (dm³)\nNote: 1 dm³ = 1000 cm³, so divide cm³ by 1000 to get dm³.\nRearrangements: n = c × V; V = n / c"},
    {q:"State the ideal gas equation and define all symbols.", a:"pV = nRT\np = pressure (Pa), V = volume (m³), n = moles (mol),\nR = 8.314 J mol⁻¹ K⁻¹, T = temperature (K).\nConvert: °C → K by adding 273; cm³ → m³ ÷ 10⁶; kPa → Pa × 1000."},
    {q:"What is the molar volume of an ideal gas at RTP?", a:"At RTP (25°C/298 K and 100 kPa), the molar volume is approximately 24.0 dm³ mol⁻¹.\nVolume (dm³) = n × 24.0; or n = volume ÷ 24.0\nAt STP (0°C/273 K, 100 kPa) the molar volume is 22.7 dm³ mol⁻¹."},
    {q:"How do you find the empirical formula from percentage composition by mass?", a:"1. Divide each % by the element's Ar to get mole ratio.\n2. Divide all by the smallest value.\n3. Scale up to whole numbers if needed.\nExample: 40% C, 6.7% H, 53.3% O → C:H:O = 40/12 : 6.7/1 : 53.3/16 = 3.33:6.67:3.33 → 1:2:1 → CH₂O"},
    {q:"How do you determine molecular formula from empirical formula?", a:"Molecular formula = n × empirical formula, where n = Mr / empirical formula mass.\nExample: empirical formula CH₂O (mass 30), Mr = 180 → n = 180/30 = 6 → C₆H₁₂O₆"},
    {q:"What is the limiting reagent and how do you identify it?", a:"The limiting reagent is the reactant that is completely consumed first, determining the maximum amount of product.\nIdentify by: calculating moles of each reactant, dividing by stoichiometric coefficient, the reagent with the smaller value is limiting."},
    {q:"Define percentage yield and calculate it.", a:"% yield = (actual moles (or mass) of product obtained / theoretical moles (or mass)) × 100\nTheoretical yield is calculated from the balanced equation using the limiting reagent.\nA 100% yield is impossible in practice due to reversible reactions, side reactions, losses during handling."},
    {q:"Define atom economy and explain its significance.", a:"% atom economy = (Mr of desired product / sum of Mr of ALL products) × 100\nHigh atom economy means less waste, more efficient use of reactants → more sustainable/economical.\nAddition reactions have 100% atom economy; substitution reactions have lower atom economy."},
    {q:"Describe how to carry out a titration to find the concentration of an unknown acid.", a:"1. Pipette known volume of alkali into conical flask, add indicator.\n2. Fill burette with acid of known (or unknown) concentration.\n3. Add acid slowly until indicator changes colour permanently (endpoint).\n4. Record volume (titre). Repeat for concordant titres (within 0.10 cm³).\n5. Calculate: n(acid) = c×V; use mole ratio; find concentration of unknown."},
    {q:"What is a back titration and when is it used?", a:"A back titration is used when the analyte cannot be titrated directly (e.g. insoluble solid, slow reaction).\nMethod: add known excess of reagent, react completely, then titrate the remaining excess.\nMoles of analyte = moles of reagent added − moles of excess remaining."},
    {q:"How do you calculate concentration from a titration result?", a:"Example: 25.0 cm³ of NaOH neutralised by 22.4 cm³ of 0.100 mol dm⁻³ HCl.\n1. n(HCl) = 0.100 × (22.4/1000) = 2.24 × 10⁻³ mol\n2. Mole ratio HCl:NaOH = 1:1 → n(NaOH) = 2.24 × 10⁻³ mol\n3. c(NaOH) = 2.24×10⁻³ / (25.0/1000) = 0.0896 mol dm⁻³"},
    {q:"What is the volume (in dm³) occupied by 4.4 g of CO₂ at RTP?", a:"M(CO₂) = 12 + 32 = 44 g mol⁻¹\nn = 4.4 / 44 = 0.10 mol\nVolume = 0.10 × 24.0 = 2.40 dm³\n(or 2400 cm³)"},
    {q:"How is empirical formula determined from combustion data?", a:"Burn the compound in excess O₂ and measure masses of CO₂ and H₂O produced.\nMoles C = moles CO₂; moles H = 2 × moles H₂O.\nMoles O = (mass of sample − mass C − mass H) / 16.\nFind simplest whole-number ratio of C:H:O."},
  ]},

  "ocr_2.1.4": { title: "Acids and Redox", cards: [
    {q:"Define a Brønsted-Lowry acid and base.", a:"Brønsted-Lowry acid: a proton (H⁺) donor.\nBrønsted-Lowry base: a proton (H⁺) acceptor.\nAcid-base reactions involve proton transfer from acid to base.\nConjugate acid-base pairs differ by one proton."},
    {q:"Distinguish between strong and weak acids with examples.", a:"Strong acid: fully dissociates in aqueous solution; [H⁺] = [acid] for monoprotic acids.\nExamples: HCl, HNO₃, H₂SO₄ (both H⁺), HBr, HI, HClO₄.\nWeak acid: partially dissociates; equilibrium lies to the left.\nExamples: CH₃COOH, HF, H₂CO₃, H₃PO₄, HCN."},
    {q:"Write equations for the reactions of dilute sulfuric acid with: (a) zinc metal, (b) copper(II) oxide, (c) calcium carbonate.", a:"(a) Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)\n(b) CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)\n(c) CaCO₃(s) + H₂SO₄(aq) → CaSO₄(s) + H₂O(l) + CO₂(g)"},
    {q:"Define oxidation and reduction in terms of electrons (OILRIG).", a:"OIL RIG:\nOxidation Is Loss of electrons (oxidation state increases).\nReduction Is Gain of electrons (oxidation state decreases).\nOxidising agent: accepts electrons, is itself reduced.\nReducing agent: donates electrons, is itself oxidised."},
    {q:"What is disproportionation? Give an example.", a:"Disproportionation is a redox reaction in which the same element is simultaneously oxidised AND reduced.\nExample: Cl₂ + H₂O ⇌ HCl + HClO\nCl₂ (0) → HCl (−1) [reduced] and HClO (+1) [oxidised]."},
    {q:"State the common oxidation states of the following elements: Fe, Cu, Cr, Mn, S, N, Cl.", a:"Fe: 0, +2, +3\nCu: 0, +1, +2\nCr: 0, +2, +3, +6\nMn: 0, +2, +4, +7\nS: −2, 0, +4, +6\nN: −3, 0, +2, +4, +5\nCl: −1, 0, +1, +3, +5, +7"},
    {q:"Write the half-equation for the reduction of MnO₄⁻ in acidic solution.", a:"MnO₄⁻(aq) + 8H⁺(aq) + 5e⁻ → Mn²⁺(aq) + 4H₂O(l)\nMn goes from +7 to +2 (reduced).\nIn alkaline conditions: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻"},
    {q:"Write the overall equation for the reaction of Fe²⁺ with acidified KMnO₄.", a:"MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O\nMole ratio: 1 MnO₄⁻ : 5 Fe²⁺\nObservation: purple KMnO₄ solution decolourises as Mn²⁺ (near-colourless) is formed."},
    {q:"Describe the reactions of dilute acids with carbonates.", a:"Metal carbonate + acid → salt + water + carbon dioxide\nNa₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)\nCaCO₃(s) + 2HNO₃(aq) → Ca(NO₃)₂(aq) + H₂O(l) + CO₂(g)\nObservation: effervescence; CO₂ turns limewater milky."},
    {q:"What is the oxidation state of Cr in K₂Cr₂O₇ and Mn in KMnO₄?", a:"K₂Cr₂O₇: 2(+1) + 2Cr + 7(−2) = 0 → 2Cr = +12 → Cr = +6\nKMnO₄: +1 + Mn + 4(−2) = 0 → Mn = +7\nThese are maximum (highest) common oxidation states."},
    {q:"What is the oxidising agent in a redox reaction and how does it change?", a:"The oxidising agent accepts electrons from another species and is itself reduced (its oxidation state decreases).\nExamples: MnO₄⁻ (Mn +7 → +2), Cr₂O₇²⁻ (Cr +6 → +3), Cl₂ (0 → −1), Fe³⁺ (+3 → +2).\nThe stronger the oxidising agent, the more readily it gains electrons."},
    {q:"Write the half-equation for the oxidation of iodide ions.", a:"2I⁻(aq) → I₂(aq) + 2e⁻\nI⁻ is oxidised from −1 to 0.\nThis half-equation can combine with any reduction half-equation.\nExample with Cl₂: Cl₂ + 2I⁻ → 2Cl⁻ + I₂"},
    {q:"What is the reaction of dilute hydrochloric acid with a base (metal hydroxide)?", a:"Base + acid → salt + water (neutralisation)\nNaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)\nCu(OH)₂(s) + 2HCl(aq) → CuCl₂(aq) + 2H₂O(l)\nIonic equation: H⁺(aq) + OH⁻(aq) → H₂O(l)"},
    {q:"How do you balance the redox equation for the reaction of Cr₂O₇²⁻ with Fe²⁺ in acid?", a:"Reduction: Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O\nOxidation: Fe²⁺ → Fe³⁺ + e⁻ (×6)\nOverall: Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O"},
    {q:"What colour change is observed when dichromate(VI) is used as an oxidising agent?", a:"K₂Cr₂O₇ solution is orange (Cr in +6 state).\nWhen reduced (acting as oxidising agent), Cr³⁺ forms → solution turns green.\nOrange → green is the colour change observed in this redox reaction."},
    {q:"Define conjugate acid-base pairs in the Brønsted-Lowry theory.", a:"A conjugate acid-base pair differs by one proton (H⁺).\nWhen an acid donates H⁺, it forms its conjugate base.\nWhen a base accepts H⁺, it forms its conjugate acid.\nExample: CH₃COOH (acid) / CH₃COO⁻ (conjugate base); NH₃ (base) / NH₄⁺ (conjugate acid).\nThe stronger the acid, the weaker its conjugate base (and vice versa)."},
  ]},

  "ocr_2.2.1": { title: "Atomic Structure and Ionisation Energies", cards: [
    {q:"Describe Rutherford's gold foil experiment and what it proved.", a:"Alpha particles were fired at a thin gold foil. Most passed straight through; a small fraction were deflected at large angles; a very few bounced back.\nConclusions: the atom is mostly empty space; a tiny, dense, positively charged nucleus exists at the centre; electrons orbit at a distance.\nThis disproved Thomson's 'plum pudding' model."},
    {q:"Describe the four stages of a time-of-flight mass spectrometer.", a:"1. Ionisation: sample is ionised (electron impact: bombard with high-energy e⁻; or electrospray: proton added to give MH⁺).\n2. Acceleration: ions accelerated through electric field — all ions gain same kinetic energy.\n3. Ion drift/flight: ions travel through flight tube — lighter ions travel faster (KE = ½mv²).\n4. Detection: ions hit detector — time of flight gives m/z ratio; signal recorded."},
    {q:"How is relative atomic mass calculated from a mass spectrum?", a:"Ar = Σ(m/z value × relative abundance) / Σ(relative abundances)\nIf abundances are given as percentages, divide each by 100 first (or divide sum by 100 at end).\nExample: ⁶³Cu (69%) and ⁶⁵Cu (31%): Ar = (63×69 + 65×31)/100 = 63.6"},
    {q:"Define first ionisation energy and write the equation for Mg.", a:"First ionisation energy: the energy required to remove one mole of electrons from one mole of gaseous atoms in their ground state to form one mole of singly charged positive ions.\nMg(g) → Mg⁺(g) + e⁻   ΔH = +738 kJ mol⁻¹\nUnits: kJ mol⁻¹"},
    {q:"What three factors affect ionisation energy?", a:"1. Nuclear charge (more protons → stronger attraction → higher IE).\n2. Atomic radius (larger atom → outer electron further from nucleus → lower IE).\n3. Electron shielding (more inner electron shells → outer electron less attracted → lower IE).\nAll three factors interact to determine the IE value."},
    {q:"Explain the general trend in first ionisation energy across Period 3.", a:"First IE generally increases from Na to Ar.\nReason: nuclear charge increases from 11 to 18, but electrons are added to the same 3rd shell (similar shielding), so effective nuclear charge increases.\nThe outer electron is held more strongly, requiring more energy to remove."},
    {q:"Why is there a drop in first IE from Mg to Al, and from P to S?", a:"Mg→Al: Al's outer electron is in the higher-energy 3p subshell, shielded by the full 3s², making it easier to remove than Mg's 3s electron.\nP→S: In S, the fourth 3p electron must pair with an existing electron → electron-electron repulsion makes it easier to remove than P's unpaired 3p electron."},
    {q:"Explain the trend in first IE down Group 2.", a:"First IE decreases from Be to Ba.\nAs you go down: atomic radius increases (extra shells), electron shielding increases (more inner shells), nuclear charge increases but is offset by shielding.\nNet effect: outer electron is further from the nucleus and more shielded → less energy needed to remove it."},
    {q:"How do successive ionisation energies provide evidence for atomic shells?", a:"Each IE is larger than the previous (ion becomes more positive, remaining electrons experience greater nuclear charge).\nA very large jump between consecutive IEs indicates removal of an electron from an inner shell.\nExample: Na: IE₁ is low, IE₂ is much larger (going from 3rd to 2nd shell) → Na is in Group 1."},
    {q:"How do successive ionisation energies provide evidence for subshells?", a:"Within a shell, smaller jumps indicate different subshells.\nExample: Al has IEs: low IE₁ (3p), slightly larger IE₂, IE₃ (3s²), then very large jump to IE₄ (going into 2nd shell).\nThe pattern of gradual increases punctuated by sharp jumps reveals both shell and subshell structure."},
    {q:"Explain the relationship between atomic emission spectra and energy levels.", a:"When electrons are excited they absorb energy and move to higher energy levels.\nWhen they fall back to lower levels, they emit photons with energy ΔE = hν.\nDifferent transitions give photons of specific frequencies (spectral lines).\nThe convergence of lines in the series indicates ionisation — basis for measuring IE from spectra."},
    {q:"What is electrospray ionisation in mass spectrometry?", a:"The sample is dissolved in a volatile solvent and sprayed through a needle at high voltage.\nEach molecule gains a proton (H⁺) to form MH⁺ ions (m/z = Mr + 1).\nThe solvent evaporates leaving gaseous ions.\nTo find Mr: subtract 1 from the m/z of the molecular ion.\nAdvantage: gentle method — does not fragment large molecules."},
    {q:"Why must a mass spectrometer be kept under high vacuum?", a:"If air were present, gas molecules would be ionised by the electron beam and would interfere with the detector.\nThe vacuum ensures only the sample molecules are ionised and detected, giving an accurate spectrum."},
    {q:"What is the second ionisation energy of an element?", a:"Second IE: energy to remove one mole of electrons from one mole of singly charged gaseous cations:\nM⁺(g) → M²⁺(g) + e⁻\nAlways greater than first IE: the ion has a smaller radius and greater effective nuclear charge per electron."},
    {q:"What evidence from mass spectrometry supports the existence of isotopes?", a:"A mass spectrum of an element (e.g. chlorine) shows multiple peaks at different m/z values, each corresponding to a different isotope.\nThe relative heights (abundances) of the peaks reflect the natural abundance of each isotope.\nThis directly demonstrates that atoms of the same element can have different masses."},
  ]},

  "ocr_2.2.2": { title: "Bonding and Structure", cards: [
    {q:"Describe ionic bonding.", a:"Ionic bonding is the electrostatic attraction between oppositely charged ions.\nFormed when electrons are transferred from a metal (loses electrons, forms cation) to a non-metal (gains electrons, forms anion).\nTypically between elements with large electronegativity difference (>1.7 on Pauling scale).\nIons arrange into a giant ionic lattice."},
    {q:"Describe covalent bonding, distinguishing σ and π bonds.", a:"Covalent bond: a shared pair of electrons between two non-metal atoms, held by mutual attraction of both nuclei to the shared electrons.\nσ (sigma) bond: head-on overlap of orbitals along the bond axis — present in all single bonds and as one bond in double/triple bonds.\nπ (pi) bond: side-on overlap of p orbitals — present in double (one π) and triple bonds (two π). Restricted rotation around π bonds."},
    {q:"What is a dative (coordinate) covalent bond? Give two examples.", a:"A dative bond is a covalent bond where both electrons in the shared pair come from one atom (the donor).\nOnce formed, it is identical to an ordinary covalent bond.\nExamples:\n• NH₄⁺: N donates lone pair to H⁺\n• H₃O⁺: O donates lone pair to H⁺\n• BF₃ + NH₃ → F₃B←NH₃: N donates to the empty p orbital on B"},
    {q:"Describe metallic bonding and the properties it explains.", a:"Metallic bonding: electrostatic attraction between a lattice of positive metal ions (cations) and a 'sea' of delocalised electrons.\nExplains: high electrical/thermal conductivity (mobile electrons), malleability/ductility (layers slide — non-directional bonding), lustre, generally high melting points."},
    {q:"Define electronegativity and describe its periodic trends.", a:"Electronegativity: the ability of a bonded atom to attract the shared electron pair towards itself (Pauling scale, F = 4.0).\nAcross a period: increases (nuclear charge increases, similar shielding, smaller radius).\nDown a group: decreases (more electron shells, increased shielding, larger radius).\nFluorine is the most electronegative element."},
    {q:"State VSEPR theory and use it to predict molecular shapes.", a:"Electron pairs (bonding and lone pairs) around a central atom repel each other and arrange to be as far apart as possible.\nLone pair–lone pair repulsion > lone pair–bonding pair > bonding pair–bonding pair.\nThe molecular shape is described by the positions of the atoms (bonding pairs), NOT the lone pairs."},
    {q:"Give the shapes and bond angles for 2, 3, 4, 5, and 6 electron pairs (no lone pairs).", a:"2 pairs: linear, 180° (e.g. BeCl₂, CO₂)\n3 pairs: trigonal planar, 120° (e.g. BF₃, AlCl₃)\n4 pairs: tetrahedral, 109.5° (e.g. CH₄, CCl₄)\n5 pairs: trigonal bipyramidal, 90°/120° (e.g. PCl₅)\n6 pairs: octahedral, 90° (e.g. SF₆)"},
    {q:"How do lone pairs affect bond angles? Give the shapes of NH₃ and H₂O.", a:"Each lone pair reduces bond angles by ~2–2.5° compared to all-bonding geometry.\nNH₃: 4 electron pairs (3 bp + 1 lp) → trigonal pyramidal, 107° (reduced from 109.5°).\nH₂O: 4 electron pairs (2 bp + 2 lp) → bent/V-shaped, 104.5° (reduced from 109.5° by two lone pairs)."},
    {q:"Give the shapes of SF₄, ClF₃, XeF₄, PCl₅.", a:"SF₄ (4 bp + 1 lp): see-saw shape, ~87°/173°\nClF₃ (3 bp + 2 lp): T-shaped, ~87°\nXeF₄ (4 bp + 2 lp): square planar, 90°\nPCl₅ (5 bp): trigonal bipyramidal, 90°/120°\nIn all cases, lone pairs occupy equatorial positions (more space) in trigonal bipyramidal geometry."},
    {q:"Compare the properties of giant ionic, giant metallic, giant covalent, and simple molecular structures.", a:"Giant ionic: high mp/bp, brittle, conducts when molten/dissolved (not solid).\nGiant metallic: high mp/bp (variable), conducts well (solid and liquid), malleable/ductile.\nGiant covalent: very high mp/bp, hard, generally non-conducting (except graphite).\nSimple molecular: low mp/bp, non-conducting; intermolecular forces (not covalent bonds) break on melting."},
    {q:"Describe the structures of diamond, graphite, graphene, and silicon dioxide.", a:"Diamond: each C bonded to 4 others tetrahedrally; very hard, non-conductor, very high mp.\nGraphite: layers of hexagonal rings; each C bonded to 3 others (sp²); delocalised π electrons → conducts; layers held by weak LDFs → lubricant.\nGraphene: single layer of graphite; exceptional conductor, very strong.\nSiO₂: each Si bonded to 4 O, each O bonded to 2 Si; giant covalent network; very high mp, non-conductor."},
    {q:"What is bond polarity and when does it lead to a polar molecule?", a:"A bond is polar when two atoms of different electronegativity share electrons unequally → bond dipole (δ+...δ−).\nA molecule is polar if individual bond dipoles do not cancel due to the molecular geometry.\nExamples of polar molecules: HCl, H₂O, NH₃, CHCl₃.\nNon-polar despite polar bonds: CO₂ (linear, dipoles cancel), CCl₄ (tetrahedral, dipoles cancel)."},
    {q:"What is the Pauling electronegativity of F, O, N, Cl, and C?", a:"F: 4.0 (most electronegative)\nO: 3.5\nN: 3.0\nCl: 3.0\nC: 2.5\nH: 2.1\nBond polarity increases with the difference in electronegativity between bonded atoms."},
    {q:"Explain why AlCl₃ (anhydrous) exists as a dimer Al₂Cl₆.", a:"In AlCl₃, Al has only 6 electrons (electron deficient, empty p orbital).\nA lone pair from Cl on one AlCl₃ molecule forms a dative bond with the Al of another AlCl₃.\nThis gives Al a full octet in the dimer Al₂Cl₆.\nAlCl₃ is a Lewis acid (electron pair acceptor)."},
    {q:"Why does CO₂ have a linear shape but SO₂ is bent?", a:"CO₂: C has 2 double bonds (2 bonding regions, no lone pairs) → linear, 180°.\nSO₂: S has 2 bonding regions + 1 lone pair → bent/V-shaped, ~119°.\nThe lone pair on S repels the bonding pairs, reducing the bond angle from 120° to ~119°."},
  ]},

  "ocr_2.2.3": { title: "Intermolecular Forces", cards: [
    {q:"Describe London dispersion forces (LDFs) and what determines their strength.", a:"LDFs (van der Waals forces) arise from temporary dipoles: electron density fluctuates randomly, creating an instantaneous dipole that induces dipoles in neighbouring molecules.\nStrength increases with: number of electrons (larger molecules/Mr), greater surface area of contact (less branching), larger molecular size.\nAll molecules and noble gas atoms experience LDFs."},
    {q:"Describe permanent dipole–dipole forces.", a:"Permanent dipole–dipole forces exist between polar molecules (those with a net dipole moment).\nThe δ+ end of one molecule attracts the δ− end of a neighbouring molecule.\nStronger than LDFs for molecules of similar size/Mr.\nPresent in addition to LDFs in polar molecules."},
    {q:"What conditions are required for hydrogen bonding?", a:"Hydrogen bonding requires:\n1. H covalently bonded to a highly electronegative atom (F, O, or N)\n2. A lone pair on F, O, or N on an adjacent molecule\nThe H⁺...lone pair attraction is the hydrogen bond.\nIt is the strongest type of intermolecular force (~10–40 kJ mol⁻¹)."},
    {q:"Why does water have an anomalously high boiling point compared to H₂S, H₂Se, H₂Te?", a:"H₂S, H₂Se, H₂Te show a steady increase in bp with Mr (due to stronger LDFs).\nH₂O has a much higher bp than extrapolation predicts because each water molecule can form up to 4 hydrogen bonds (2 as donor, 2 as acceptor through lone pairs).\nBreaking these H-bonds requires significantly more energy than the LDFs in H₂S."},
    {q:"Why does ice float on water?", a:"In ice, each H₂O molecule forms 4 H-bonds in a tetrahedral, open lattice structure.\nThis open structure means ice has a lower density than liquid water (where H-bonds are constantly breaking and reforming, allowing molecules to pack more closely).\nDensity of ice (~0.917 g cm⁻³) < density of water (~1.00 g cm⁻³)."},
    {q:"How does branching affect the boiling point of alkane isomers?", a:"More branched molecules have lower boiling points than straight-chain isomers of the same molecular formula.\nReason: branching reduces the surface area available for contact between molecules → weaker LDFs → less energy needed to separate molecules.\nExample: pentane (bp 36°C) > 2-methylbutane (bp 28°C) > 2,2-dimethylpropane (bp 9°C)"},
    {q:"Compare the boiling points of ethanol (C₂H₅OH) and dimethyl ether (CH₃OCH₃), same Mr=46.", a:"Ethanol bp: 78°C; dimethyl ether bp: −24°C.\nEthanol has O-H bond → forms hydrogen bonds between molecules.\nDimethyl ether has no O-H bonds → only permanent dipole-dipole forces and LDFs (weaker than H-bonds).\nH-bonding requires much more energy to overcome → much higher bp."},
    {q:"Why do small alcohols (methanol, ethanol, propanol) dissolve readily in water?", a:"Small alcohols have an O-H group that can form hydrogen bonds with water molecules.\nThe O-H group in the alcohol is compatible with water's H-bonding network.\nThe hydrocarbon chain (non-polar) is short enough that the H-bonding interaction dominates.\nAs chain length increases, the non-polar tail disrupts water's structure → solubility decreases."},
    {q:"Explain why ammonia (NH₃) has a much higher boiling point than phosphine (PH₃).", a:"NH₃ bp: −33°C; PH₃ bp: −88°C.\nNitrogen is highly electronegative and H bonded to N forms hydrogen bonds with lone pairs on N of adjacent NH₃ molecules.\nPH₃ cannot form hydrogen bonds (P not electronegative enough).\nBreaking H-bonds in NH₃ requires considerably more energy than the LDFs/weak dipole forces in PH₃."},
    {q:"What effect does hydrogen bonding have on the viscosity and surface tension of water?", a:"Hydrogen bonding gives water unusually high viscosity (resistance to flow) and surface tension for a small molecule.\nThe network of H-bonds creates cohesion between molecules at the surface → high surface tension.\nBiological importance: capillary action (water transport in plants), surface tension supports surface-dwelling insects."},
    {q:"Compare the boiling points of HF, HCl, HBr, HI and explain the trend.", a:"HCl (−85°C) < HBr (−67°C) < HI (−35°C): bp increases due to stronger LDFs (more electrons down the group).\nHF (20°C): anomalously high bp despite small size, due to strong H-bonding (F is very electronegative).\nNote: HF forms fewer H-bonds per molecule than H₂O (F has fewer lone pairs relative to water's 2 lone pairs accessible for donation)."},
    {q:"How does chain length affect the boiling point of alcohols?", a:"Boiling point increases with chain length in a homologous series of alcohols.\nLonger chains have more electrons → stronger LDFs between molecules.\nAll alcohols also have H-bonding (due to O-H group) but the additional LDF contribution from the longer chain raises bp.\nExample: methanol (65°C) < ethanol (78°C) < propan-1-ol (97°C) < butan-1-ol (117°C)"},
    {q:"What is an instantaneous dipole and how does it induce a dipole in a neighbouring molecule?", a:"At any instant, electron density in a molecule is not perfectly symmetrical → temporary uneven distribution creates an instantaneous dipole (δ+/δ−).\nThis distorts the electron cloud of a neighbouring molecule, creating an induced dipole (opposite orientation).\nThe two temporary dipoles attract each other (positive end to negative end).\nThese fluctuating dipoles give rise to LDFs (always attractive)."},
    {q:"Why do carboxylic acids have higher boiling points than alcohols of similar Mr?", a:"Carboxylic acids (RCOOH) can form hydrogen-bonded dimers — two molecules join through two simultaneous H-bonds between the COOH groups.\nThis effectively doubles the 'molecular weight' that must be overcome on boiling.\nAlso, the C=O group makes the O-H more polar than in alcohols → stronger H-bonds.\nResult: carboxylic acids have higher bp than alcohols with similar Mr."},
  ]},

  "ocr_2.3.1": { title: "The Periodic Table", cards: [
    {q:"How are elements arranged in the modern periodic table?", a:"Elements are arranged in order of increasing atomic number (number of protons).\nPeriods: horizontal rows — elements in the same period have the same number of electron shells.\nGroups: vertical columns — elements in the same group have the same number of outer shell electrons and similar chemical properties.\nThe table is divided into s, p, d, and f blocks."},
    {q:"Describe Mendeleev's contribution to the periodic table.", a:"Mendeleev (1869) arranged elements in order of increasing atomic mass and noted repeating properties.\nHis key innovation: left gaps for undiscovered elements (e.g. eka-silicon = Ge, eka-aluminium = Ga) and predicted their properties.\nPredictions were later confirmed, validating his arrangement.\nMendeleev also swapped some elements to fit chemical trends (later justified by atomic number ordering)."},
    {q:"Describe the trend in atomic radius across a period and explain it.", a:"Atomic radius decreases across a period (e.g. Li to Ne, Na to Ar).\nReason: nuclear charge (number of protons) increases across the period, but electrons are added to the same shell (similar shielding from inner shells).\nGreater effective nuclear charge pulls electron cloud closer → smaller radius."},
    {q:"Describe the trend in atomic radius down a group and explain it.", a:"Atomic radius increases down a group.\nReason: each element has an additional electron shell → outer electrons are further from the nucleus.\nAlthough nuclear charge also increases, the increased shielding from the additional inner shells means the outer electrons are less strongly attracted.\nNet effect: radius increases."},
    {q:"Describe the trend in electronegativity across periods and down groups.", a:"Across a period: electronegativity increases (e.g. Na=0.9, Cl=3.0).\nReason: nuclear charge increases, atomic radius decreases → stronger attraction for shared electrons.\nDown a group: electronegativity decreases (e.g. F=4.0, I=2.5).\nReason: atomic radius increases, more electron shielding → weaker attraction for shared electrons."},
    {q:"Describe the trend in metallic character across a period and down a group.", a:"Across a period: metallic character decreases (Na→Mg→Al are metals; Si is metalloid; P, S, Cl, Ar are non-metals).\nDown a group: metallic character increases (e.g. C is non-metal; Si is metalloid; Ge is metalloid; Sn, Pb are metals).\nMetals lose electrons easily (low IE); non-metals gain electrons (high EA/electronegativity)."},
    {q:"What are the s, p, d, and f blocks of the periodic table?", a:"s block: Groups 1 and 2 — outer electrons in s subshell (e.g. Na [Ne]3s¹).\np block: Groups 13–18 — outer electrons in p subshell (e.g. Cl [Ne]3s²3p⁵).\nd block: transition metals (Groups 3–12) — outer electrons in d subshell (e.g. Fe [Ar]3d⁶4s²).\nf block: lanthanides and actinides — outer electrons in f subshell."},
    {q:"Explain the periodic trend in first ionisation energy and identify the anomalies.", a:"General trend: first IE increases across a period (increasing nuclear charge, similar shielding).\nAnomalies: \n• Group 13 < Group 2 (e.g. Al < Mg): p electron is higher energy and shielded by s².\n• Group 16 < Group 15 (e.g. S < P): paired p electron experiences extra repulsion.\nThese anomalies reveal subshell structure."},
    {q:"What are metalloids and give examples.", a:"Metalloids (semi-metals) are elements that have properties intermediate between metals and non-metals.\nExamples: Silicon (Si), Germanium (Ge), Arsenic (As), Antimony (Sb), Tellurium (Te).\nSi and Ge are semiconductors (electrical conductivity between metals and non-metals) — essential in electronics."},
    {q:"Explain why noble gases (Group 18) are chemically inert.", a:"Noble gases have full outer electron shells (He: 1s²; Ne: 2s²2p⁶; Ar: 3s²3p⁶).\nFull outer shells mean there is no tendency to gain, lose, or share electrons.\nVery high ionisation energies (especially for He and Ne) make electron removal extremely difficult.\nResult: noble gases rarely form chemical bonds (a few Xe compounds exist under extreme conditions)."},
    {q:"Describe the trend in melting and boiling points of Group 1 metals down the group.", a:"Melting and boiling points generally decrease down Group 1 (Li: mp 181°C → Cs: mp 28°C).\nReason: as atomic radius increases, the metallic bond (between positive ions and delocalised electrons) weakens — the delocalised electrons are further from the nuclear charge and interaction is weaker.\nGroup 1 metals have the weakest metallic bonding (only 1 delocalised electron per atom)."},
    {q:"How does the reactivity of Group 1 metals change down the group?", a:"Reactivity increases down Group 1 (Li < Na < K < Rb < Cs).\nReason: atomic radius increases and electron shielding increases → outer (valence) electron is easier to remove (lower IE).\nMore reactive metals react more vigorously with water and oxygen.\nCaesium reacts explosively with water."},
    {q:"What is effective nuclear charge and how does it relate to periodic trends?", a:"Effective nuclear charge (Zeff) = actual nuclear charge − shielding by inner electrons.\nZeff increases across a period (more protons but same inner electron shielding) → electrons are pulled in more strongly.\nZeff stays roughly constant down a group (extra protons offset by extra shielding from new shells).\nZeff explains trends in atomic radius, IE, and electronegativity."},
  ]},

  "ocr_4.1.1": { title: "Basic Concepts of Organic Chemistry", cards: [
    {q:"Define organic chemistry and a homologous series.", a:"Organic chemistry: study of carbon-based compounds (with H, and often O, N, halogens, S).\nHomologous series: a family of compounds sharing the same functional group and general formula, differing by CH₂ between adjacent members.\nProperties: same chemical reactions; gradual change in physical properties (e.g. bp increases with chain length)."},
    {q:"Name the carbon-framework functional groups and their structural features (alkene, aldehyde, ketone, carboxylic acid, ester).", a:"Alkene: C=C double bond (π bond, electrophilic addition).\nAldehyde: −CHO (C=O at chain end, can be oxidised).\nKetone: C=O within chain (cannot be oxidised further).\nCarboxylic acid: −COOH (weakly acidic).\nEster: −COO− (formed from acid + alcohol, pleasant smell)."},
    {q:"Name the heteroatom-containing functional groups and their features (halogenoalkane, alcohol, amine, amide, nitrile).", a:"Halogenoalkane: C−X (X = F, Cl, Br, I; polar bond → nucleophilic substitution).\nAlcohol: −OH (H-bonding; can be oxidised).\nAmine: −NH₂ (basic, lone pair on N; nucleophile).\nAmide: −CONH₂ (formed from acid chloride + amine; condensation linkage in proteins).\nNitrile: −C≡N (triple bond; can be hydrolysed to acid or reduced to amine)."},
    {q:"Describe the three types of structural formula.", a:"Displayed formula: shows ALL bonds explicitly (every C−H bond drawn).\nStructural formula (condensed): shows groups in sequence without individual bond lines, e.g. CH₃CH₂OH.\nSkeletal formula: carbon backbone as zigzag lines, C atoms and their H atoms implied at each vertex/end; functional groups and heteroatoms shown."},
    {q:"Give the general formulae of alkanes, alkenes, alkynes, alcohols, carboxylic acids.", a:"Alkanes: CₙH₂ₙ₊₂\nAlkenes: CₙH₂ₙ\nAlkynes: CₙH₂ₙ₋₂\nCycloalkanes: CₙH₂ₙ\nAlcohols (monol): CₙH₂ₙ₊₂O (or CₙH₂ₙ₊₁OH)\nCarboxylic acids: CₙH₂ₙO₂ (or CₙH₂ₙ₋₁COOH)"},
    {q:"State the IUPAC rules for naming organic compounds.", a:"1. Find the longest continuous carbon chain → parent name (1C=meth, 2C=eth, 3C=prop, 4C=but, 5C=pent, 6C=hex)\n2. Identify principal functional group → suffix (−ane, −ene, −ol, −al, −one, −oic acid, −amine, −anoate)\n3. Number chain from end giving lowest locant to principal group\n4. Name substituents alphabetically as prefixes (methyl−, ethyl−, chloro−, bromo−, hydroxy−) with their position numbers"},
    {q:"Define and distinguish structural isomers: chain, positional, and functional group isomers.", a:"Chain isomers: same molecular formula, different carbon chain arrangement (e.g. butane and methylpropane, both C₄H₁₀).\nPositional isomers: same molecular formula and functional group, but different position on chain (e.g. butan-1-ol and butan-2-ol).\nFunctional group isomers: same molecular formula but different functional groups (e.g. propanal and propanone, both C₃H₆O)."},
    {q:"What conditions are required for E/Z (geometric) isomerism?", a:"E/Z isomerism occurs when:\n1. There is restricted rotation around a bond (C=C double bond or ring).\n2. Each carbon of the double bond carries two DIFFERENT substituents.\nE (entgegen): higher priority groups on opposite sides of C=C.\nZ (zusammen): higher priority groups on same side.\nPriority: determined by CIP rules (higher atomic number = higher priority)."},
    {q:"Define chirality and optical isomers (enantiomers).", a:"A carbon atom is chiral (a chiral centre/stereogenic centre) if it has four different substituents attached.\nOptical isomers (enantiomers): non-superimposable mirror images of each other.\nProperties: same physical and chemical properties (except in a chiral environment); rotate plane-polarised light in opposite directions.\nA racemic mixture (racemate): equal amounts of both enantiomers — no net optical activity."},
    {q:"Define homolytic and heterolytic bond fission.", a:"Homolytic fission: bond breaks so each atom gets one electron from the shared pair → two radicals (species with unpaired electrons). Represented by half-arrows (fishhook arrows).\nHeterolytic fission: bond breaks so both electrons go to one atom → carbocation (C⁺) and carbanion (C⁻) or leaving group takes both electrons.\nHeterolytic = ionic mechanism; homolytic = radical mechanism."},
    {q:"Define electrophile and nucleophile.", a:"Electrophile: an electron-deficient species that accepts a lone pair of electrons. Examples: H⁺, Br₂ (polarised), NO₂⁺, carbocations (R⁺), carbonyl carbon (δ+).\nNucleophile: an electron-rich species that donates a lone pair to an electrophile. Examples: H₂O, NH₃, OH⁻, CN⁻, halide ions (X⁻), alkenes (π electrons)."},
    {q:"Explain the inductive effect and how it affects carbocation stability.", a:"Inductive effect: electron-donating or withdrawing effect transmitted through σ bonds.\nAlkyl groups (CH₃, C₂H₅) are electron-donating → push electron density towards adjacent positive charge.\nCarbocation stability: tertiary (3°) > secondary (2°) > primary (1°) > methyl.\nReason: more alkyl groups donate electrons, stabilising the positive charge → 3° carbocations more stable."},
    {q:"Name and give examples of the four main reaction types in organic chemistry.", a:"Substitution: one atom/group replaced by another (e.g. free radical substitution of alkanes, nucleophilic substitution of halogenoalkanes).\nAddition: atoms add across a multiple bond (e.g. electrophilic addition to alkenes).\nElimination: removal of atoms from adjacent carbons, forming a double bond (e.g. dehydration of alcohols).\nOxidation/Reduction: change in oxidation state (e.g. oxidation of alcohols to aldehydes/ketones)."},
    {q:"What are degrees of unsaturation and how are they calculated?", a:"Degrees of unsaturation (index of hydrogen deficiency) = (2C + 2 + N − H − X) / 2\nwhere C = number of C atoms, N = N atoms, H = H atoms, X = halogen atoms.\n1 degree = one double bond or one ring.\n2 degrees = triple bond or two rings/double bonds.\nExample: C₆H₆ (benzene) = (12+2−6)/2 = 4 degrees (1 ring + 3 double bonds in Kekulé)."},
    {q:"What is the difference between saturated and unsaturated organic compounds?", a:"Saturated: contains only single C−C bonds (no C=C or C≡C); general formula CₙH₂ₙ₊₂ for acyclic compounds.\nUnsaturated: contains one or more C=C or C≡C bonds (or rings).\nTest for unsaturation: bromine water (orange) → decolourises rapidly with unsaturated compounds (addition); no change with saturated."},
    {q:"How is IUPAC nomenclature applied to esters and amides?", a:"Esters: named as alkyl alkanoate — the alkyl part comes from the alcohol, the alkanoate from the acid.\nEthyl ethanoate: CH₃COOC₂H₅ (from ethanoic acid + ethanol).\nAmides: the parent acid name with -ic acid → -amide suffix.\nEthanamide: CH₃CONH₂\nN-substituted amides: N-methylethanamide CH₃CONHCH₃."},
  ]},

  "ocr_4.2.1": { title: "Hydrocarbons — Alkanes and Alkenes", cards: [
    {q:"State the general formula and key structural features of alkanes.", a:"General formula: CₙH₂ₙ₊₂ (acyclic)\nAll C−C single bonds (σ bonds); sp³ hybridised carbons; tetrahedral bond angles (109.5°).\nNon-polar; only London dispersion forces between molecules.\nBoiling point increases with chain length (more electrons → stronger LDFs); branching lowers bp (less surface contact)."},
    {q:"Describe the free radical substitution of methane with chlorine.", a:"Initiation: Cl₂ → 2Cl• (UV light provides energy to break Cl−Cl homolytically)\nPropagation step 1: Cl• + CH₄ → CH₃• + HCl\nPropagation step 2: CH₃• + Cl₂ → CH₃Cl + Cl•\nTermination: any two radicals combine: 2Cl• → Cl₂; Cl• + CH₃• → CH₃Cl; 2CH₃• → C₂H₆\nResult: mixture of products (CH₃Cl, CH₂Cl₂, CHCl₃, CCl₄) because substitution continues."},
    {q:"Why does free radical substitution of methane produce a mixture of products?", a:"Once one H is substituted by Cl, the product (CH₃Cl) can undergo further substitution.\nCH₃Cl → CH₂Cl₂ → CHCl₃ → CCl₄\nEach step has a similar probability, so a statistical mixture of all possible substitution products forms.\nThis makes free radical substitution poor for making a single specific product."},
    {q:"Compare complete and incomplete combustion of alkanes.", a:"Complete combustion (excess O₂): CₙH₂ₙ₊₂ + excess O₂ → CO₂ + H₂O\nProducts: only CO₂ and H₂O; burns with clean blue flame.\nIncomplete combustion (limited O₂): CₙH₂ₙ₊₂ + limited O₂ → CO + C (soot) + H₂O\nProducts: CO (toxic, colourless) and/or soot (carbon particulates); yellow/orange flame.\nCO is dangerous: binds to haemoglobin, prevents O₂ transport."},
    {q:"State the general formula and structural features of alkenes.", a:"General formula: CₙH₂ₙ\nContain C=C double bond (1 σ + 1 π bond).\nsp² hybridised carbons; trigonal planar around each C of double bond; bond angle 120°.\nRestricted rotation around C=C (π bond breaks if rotation occurs) → E/Z isomerism possible.\nMore reactive than alkanes (π bond easily attacked by electrophiles)."},
    {q:"Describe the electrophilic addition of Br₂ to ethene and the mechanism.", a:"Reagent: Br₂ in organic solvent (or Br₂(aq) — bromine water).\nStep 1: π electrons of C=C polarise Br₂ → Brδ+−Brδ−; Brδ+ acts as electrophile.\nStep 2: π electrons attack Brδ+; Br−Br bond breaks heterolytically; bromonium ion (cyclic) or carbocation intermediate forms.\nStep 3: Br⁻ (nucleophile) attacks the carbocation/bromonium from opposite face → anti addition.\nProduct: 1,2-dibromoethane.\nObservation: orange/brown bromine decolourises."},
    {q:"Describe the addition of HBr to propene and Markovnikov's rule.", a:"Two possible products: 1-bromopropane (H adds to C1) or 2-bromopropane (H adds to C2).\nMarkovnikov's rule: H adds to the carbon with more H atoms already attached (to give the more stable carbocation intermediate).\nMechanism: H⁺ adds to C1 → secondary carbocation on C2 (more stable than primary on C1) → Br⁻ attacks C2 → 2-bromopropane (major product).\nExplained by secondary > primary carbocation stability."},
    {q:"Describe the addition of steam (H₂O) to ethene to make ethanol.", a:"CH₂=CH₂ + H₂O → CH₃CH₂OH\nConditions: concentrated phosphoric acid (H₃PO₄) or sulfuric acid as catalyst; 300°C; 60–70 atm pressure.\nMechanism (electrophilic addition): H⁺ adds to one carbon → carbocation → H₂O attacks as nucleophile → proton loss → alcohol.\nThis is the industrial method for making ethanol from crude oil (continuous process, non-renewable)."},
    {q:"What is addition polymerisation? Draw the repeat unit of poly(ethene).", a:"Addition polymerisation: alkene monomers join together by opening the C=C double bond, forming a long-chain polymer with no small molecule by-product.\nnCH₂=CH₂ → −(CH₂−CH₂)ₙ−\nRepeat unit: −CH₂−CH₂− (drawn with bonds extending from each carbon).\nPoly(propene): monomer CH₃CH=CH₂; repeat unit −CH(CH₃)−CH₂−\nNo functional group in backbone of simple addition polymer."},
    {q:"What is hydrogenation of alkenes and what are its conditions?", a:"Alkene + H₂ → alkane (addition of H₂ across C=C).\nConditions: Ni catalyst, 150°C (Raney Ni) or Pt/Pd at room temperature.\nCH₂=CH₂ + H₂ → CH₃CH₃\nIndustrial importance: hardening vegetable oils to make margarine (liquid unsaturated oils → solid saturated fats).\nEnthalpy of hydrogenation measures stability of alkene."},
    {q:"Describe the test for alkenes using bromine water.", a:"Add bromine water (orange/brown) to the compound.\nAlkene: bromine decolourises rapidly (electrophilic addition of Br₂ across C=C → dibromoalkane).\nAlkane or other saturated compound: no colour change (no reaction with Br₂ in absence of UV light).\nNote: KMnO₄ solution (purple) also decolourises with alkenes → purple to colourless/brown MnO₂."},
    {q:"Explain why addition reactions of alkenes are thermodynamically favourable.", a:"In electrophilic addition to alkenes, a relatively weak π bond (~265 kJ mol⁻¹) is broken while two stronger σ bonds (C−H, C−X) are formed.\nNet: bond breaking < bond forming → ΔH negative → exothermic → thermodynamically favourable.\nThe reaction is spontaneous (ΔG < 0) under standard conditions for most additions (H₂, HX, X₂)."},
    {q:"Give the boiling point trend for the first six alkanes and explain it.", a:"Methane (−162°C) < ethane (−89°C) < propane (−42°C) < butane (−1°C) < pentane (36°C) < hexane (69°C).\nBoiling point increases steadily with carbon chain length.\nReason: larger molecules have more electrons → stronger London dispersion forces (LDFs) → more energy needed to overcome intermolecular attractions → higher bp."},
    {q:"What is cracking and why is it important industrially?", a:"Cracking: breaking long-chain alkanes into shorter, more useful alkanes and alkenes.\nThermal cracking: high temperature (700–1200°C), high pressure → predominantly alkenes (free radical mechanism).\nCatalytic cracking: zeolite catalyst, ~500°C, lower pressure → more branched alkanes and aromatic hydrocarbons (carbocation mechanism).\nImportance: supplies alkenes for polymerisation and shorter alkanes for petrol/aviation fuel demand."},
  ]},

  "ocr_4.3.1": { title: "Alcohols, Haloalkanes and Analysis", cards: [
    {q:"Classify alcohols as primary, secondary, or tertiary and give examples.", a:"Primary (1°): −OH attached to C bonded to one other C (e.g. ethanol CH₃CH₂OH, butan-1-ol).\nSecondary (2°): −OH attached to C bonded to two other C atoms (e.g. propan-2-ol (CH₃)₂CHOH).\nTertiary (3°): −OH attached to C bonded to three other C atoms (e.g. 2-methylpropan-2-ol (CH₃)₃COH).\nClassification affects oxidation reactions."},
    {q:"Describe the oxidation of primary and secondary alcohols.", a:"Primary alcohol → aldehyde (with limited oxidising agent/distil off product): RCH₂OH → RCHO\nPrimary alcohol → carboxylic acid (excess oxidising agent, reflux): RCH₂OH → RCOOH\nSecondary alcohol → ketone (reflux, any amount of oxidant): R₂CHOH → R₂C=O\nTertiary alcohols: NOT oxidised under these conditions (no H on C bearing OH).\nOxidising agent: acidified K₂Cr₂O₇ (orange → green) or KMnO₄."},
    {q:"Describe the dehydration of alcohols to alkenes.", a:"Heat alcohol with concentrated H₃PO₄ (phosphoric acid) or pass vapour over Al₂O₃ at ~300°C.\nCH₃CH₂OH → CH₂=CH₂ + H₂O (elimination)\nFor larger alcohols: H and OH on adjacent carbons are eliminated; Zaitsev's rule — major product has the more substituted double bond.\nThis is the reverse of hydration of alkenes."},
    {q:"Describe the production of ethanol by fermentation and compare with industrial synthesis.", a:"Fermentation: glucose → ethanol + CO₂ (yeast enzymes, anaerobic, ~30°C, pH ~5)\nC₆H₁₂O₆ → 2C₂H₅OH + 2CO₂\nAdvantages: renewable feedstock (plants), low energy; Disadvantages: slow, impure, batch process.\nIndustrial hydration: C₂H₄ + H₂O → C₂H₅OH (H₃PO₄ cat, 300°C, 60 atm).\nAdvantages: continuous, pure product; Disadvantages: non-renewable (ethene from crude oil), high energy."},
    {q:"Describe the substitution of −OH in alcohols with halide.", a:"To make halogenoalkanes from alcohols:\n• With HBr: reflux alcohol with NaBr + conc H₂SO₄ (generates HBr in situ)\n  R−OH + HBr → R−Br + H₂O\n• With PCl₅: gives acid chloride conditions\n• With SOCl₂: ROH → RCl + SO₂ + HCl\nThe OH is a poor leaving group; HX converts it to a better leaving group."},
    {q:"Classify haloalkanes as primary, secondary, or tertiary.", a:"Primary (1°): halogen on a carbon bonded to one other carbon (e.g. CH₃CH₂Br, bromoethane).\nSecondary (2°): halogen on carbon bonded to two other carbons (e.g. (CH₃)₂CHBr, 2-bromopropane).\nTertiary (3°): halogen on carbon bonded to three other carbons (e.g. (CH₃)₃CBr).\nClassification determines whether SN1 or SN2 mechanism operates."},
    {q:"Describe the SN2 mechanism for nucleophilic substitution in primary haloalkanes.", a:"SN2 = bimolecular nucleophilic substitution (one-step, rate = k[RX][Nu]).\nMechanism: nucleophile attacks the carbon bearing the halogen from the back (180° to leaving group).\nTransition state: carbon has 5 bonds partially formed/broken (trigonal bipyramidal).\nResult: inversion of configuration (Walden inversion) — stereochemistry flips.\nFavoured by 1° haloalkanes (less steric hindrance)."},
    {q:"Describe the SN1 mechanism for nucleophilic substitution in tertiary haloalkanes.", a:"SN1 = unimolecular nucleophilic substitution (two steps, rate = k[RX]).\nStep 1 (slow, RDS): C−X bond breaks heterolytically → tertiary carbocation + X⁻\nStep 2 (fast): nucleophile attacks carbocation from either face.\nResult: racemic mixture (nucleophile has equal probability of both faces).\nFavoured by 3° haloalkanes (stable 3° carbocation intermediate)."},
    {q:"Describe the reactivity order of haloalkanes: C−F, C−Cl, C−Br, C−I.", a:"Rate of hydrolysis: C−I > C−Br > C−Cl >> C−F\nAlthough C−F bond is most polar (most reactive by polarity alone), C−F bond enthalpy is highest (485 kJ mol⁻¹) → very difficult to break.\nC−I has the lowest bond enthalpy (228 kJ mol⁻¹) → breaks most easily → fastest hydrolysis.\nReactivity is determined by bond strength, not polarity alone."},
    {q:"Describe the test for rate of hydrolysis of halogenoalkanes using silver nitrate in ethanol.", a:"Dissolve haloalkane in ethanol; add AgNO₃(aq) in ethanol; warm.\nFastest: C−I → yellow precipitate of AgI almost immediately.\nModerate: C−Br → cream precipitate of AgBr after a few seconds.\nSlowest: C−Cl → white precipitate of AgCl after heating/long time.\nC−F: no precipitate (no hydrolysis under these conditions).\nThe halide ion released reacts with Ag⁺ to give the precipitate."},
    {q:"Describe the reactions of haloalkanes with KCN and with ammonia (excess).", a:"With KCN (in ethanol, warm): R−X + CN⁻ → R−CN + X⁻\nProduct: nitrile (chain extended by 1 carbon — useful in synthesis).\nWith excess NH₃ (sealed tube, warm): R−X + NH₃ → R−NH₂ + HX → can further react to R₂NH, R₃N, R₄N⁺X⁻ (mixture)\nFirst product is primary amine."},
    {q:"Describe the key absorptions in infrared spectroscopy for functional group identification.", a:"O−H (alcohol): broad absorption ~3230–3550 cm⁻¹\nO−H (carboxylic acid): very broad ~2500–3300 cm⁻¹\nC=O (carbonyl, aldehyde/ketone): ~1700–1750 cm⁻¹ (sharp, strong)\nC=O (ester): ~1735 cm⁻¹\nN−H: ~3300–3500 cm⁻¹\nC−H: ~2850–3000 cm⁻¹\nFingerprint region (<1500 cm⁻¹): unique to each compound; used for identification by comparison with database."},
    {q:"What do CFCs do to the ozone layer and what is the mechanism?", a:"CFCs (chlorofluorocarbons) are stable in the troposphere but rise to the stratosphere where UV radiation causes homolytic fission:\nCFCl₃ → CFCl₂• + Cl•\nChain reaction:\nCl• + O₃ → ClO• + O₂\nClO• + O → Cl• + O₂\nCl• regenerated → can destroy up to 100,000 O₃ molecules per Cl radical.\nOzone layer depletion → increased UV reaching Earth → skin cancer, cataracts."},
    {q:"How is a mass spectrum interpreted to identify organic fragments?", a:"Molecular ion peak (M⁺ or M+1): highest m/z gives molecular mass (Mr).\nBase peak: most abundant fragment (tallest peak).\nFragmentation pattern: bonds break at weakest points; common losses:\nm/z−15: loss of CH₃•\nm/z−29: loss of CHO• or C₂H₅•\nm/z−31: loss of CH₂OH•\nm/z−45: loss of OC₂H₅• or COOH•\nCombine with IR and NMR to identify compound."},
    {q:"Describe the elimination reaction of haloalkanes with KOH.", a:"Reagent: KOH dissolved in ethanol (alcoholic KOH); heat/reflux.\nMechanism: OH⁻ acts as base (not nucleophile) — removes H from carbon adjacent to C−X.\nH and X are eliminated from adjacent carbons → C=C forms.\nExample: CH₃CHBrCH₃ + KOH(alc) → CH₃CH=CH₂ + KBr + H₂O\nCompetes with SN2 (aqueous KOH favours substitution; alcoholic KOH favours elimination)."},
  ]},

  "ocr_4.4.1": { title: "Organic Synthesis", cards: [
    {q:"What is retrosynthesis and how is it used to plan a synthesis route?", a:"Retrosynthesis: working backwards from the target molecule to available starting materials.\nAt each step, identify what functional group transformation was used to introduce/change the key group.\nDraw disconnections (⟹) showing what bond was made in the forward synthesis.\nContinue until you reach a commercially available starting material.\nThen write the forward synthesis with reagents and conditions for each step."},
    {q:"Summarise key functional group interconversions involving halogenoalkanes.", a:"Alkane → halogenoalkane: free radical substitution (UV, X₂)\nAlkene → halogenoalkane: electrophilic addition (HX or X₂)\nAlcohol → halogenoalkane: HBr (or NaBr/H₂SO₄); PCl₅; SOCl₂\nHalogenoalkane → alcohol: NaOH(aq), reflux (SN2/SN1)\nHalogenoalkane → nitrile: KCN/ethanol (chain +1C)\nHalogenoalkane → amine: excess NH₃, sealed tube\nHalogenoalkane → alkene: KOH/ethanol, heat (elimination)"},
    {q:"Summarise key functional group interconversions involving alcohols.", a:"Alkene → alcohol: H₂O/H₃PO₄ catalyst (hydration)\nAlcohol → alkene: H₃PO₄/Al₂O₃, heat (dehydration/elimination)\nAlcohol → aldehyde: limited K₂Cr₂O₇/H₂SO₄, distil (1° alcohol)\nAlcohol → ketone: K₂Cr₂O₇/H₂SO₄, reflux (2° alcohol)\nAlcohol → carboxylic acid: excess K₂Cr₂O₇/H₂SO₄, reflux (1° alcohol)\nAldehyde/ketone → alcohol: NaBH₄ (reduction)"},
    {q:"Describe the practical techniques used in organic synthesis.", a:"Reflux: heat reaction mixture at bp without loss of volatile components; used for slow reactions needing prolonged heating.\nDistillation: separate products by boiling point difference.\nSeparating funnel: separate organic and aqueous layers.\nDrying: add anhydrous MgSO₄ or CaCl₂ to organic layer; remove by filtration.\nRecrystallisation: dissolve in minimum hot solvent, cool slowly → crystals form; filter, wash, dry.\nSuction filtration: collect solid products efficiently."},
    {q:"How do you measure the melting point of an organic solid and what does it indicate?", a:"Pack a small amount of dry crystalline solid into a melting point tube.\nPlace in a melting point apparatus; raise temperature slowly near expected mp.\nRecord temperature range at which solid melts (e.g. 85–87°C).\nPure compound: sharp melting point (narrow range, 0.5–1°C).\nImpure compound: depressed and broad melting point range (2–5°C or more).\nCompare with literature values to identify compound."},
    {q:"Describe thin layer chromatography (TLC) for monitoring a reaction.", a:"Apply spots of reaction mixture and pure product/starting material to silica TLC plate.\nDevelop in appropriate solvent system.\nVisualise under UV (fluorescent plate) or iodine vapour.\nCalculate Rf = distance moved by compound / distance moved by solvent front.\nMonitor reaction progress: starting material spot diminishes; product spot appears.\nCo-spot unknown with reference: single spot = same compound."},
    {q:"How is column chromatography used to purify an organic product?", a:"Pack glass column with silica slurry.\nLoad product mixture in minimum solvent at top.\nElute with solvent (or gradient of increasing polarity).\nLess polar compounds elute first (less interaction with polar silica).\nCollect fractions, check by TLC for purity.\nCombine pure fractions, evaporate solvent to give pure compound.\nPreparative scale — collects gram quantities of pure product."},
    {q:"Define atom economy and explain its role in green chemistry.", a:"Atom economy = (Mr desired product / sum Mr all products) × 100%\nHigh atom economy: most atoms in reactants end up in desired product → less waste.\nGreen chemistry principles:\n• Maximise atom economy\n• Use catalysts (not stoichiometric reagents)\n• Use renewable feedstocks\n• Minimise energy use and hazardous by-products\n• Use safer solvents (water where possible)\nAtom economy is a measure of sustainable/green chemistry."},
    {q:"Calculate the % yield for a synthesis reaction given actual and theoretical yields.", a:"% yield = (actual mass obtained / theoretical mass) × 100\nTo find theoretical mass:\n1. Find moles of limiting reagent\n2. Use mole ratio from balanced equation to find moles of product\n3. Calculate theoretical mass = moles × Mr of product\nReasons for <100% yield: reversible reactions, side reactions, losses in purification, incomplete reaction."},
    {q:"What is the significance of using a two-step vs one-step synthesis?", a:"One-step synthesis: fewer operations, less time, higher overall yield (no cumulative losses).\nTwo-step synthesis: necessary when a one-step route doesn't exist or gives very poor selectivity/yield.\nOverall yield = (% yield step 1 × % yield step 2) / 100.\nExample: if each step is 80%, overall yield = 64%; three steps at 80% = 51%.\nMinimising steps is a green chemistry principle."},
    {q:"How is a solid product purified by recrystallisation?", a:"1. Dissolve impure solid in minimum volume of hot solvent (in which it is soluble hot but poorly soluble cold).\n2. Filter hot solution to remove insoluble impurities.\n3. Allow filtrate to cool slowly → crystals of pure product form (impurities remain in solution).\n4. Collect crystals by suction filtration.\n5. Wash with cold solvent to remove traces of mother liquor.\n6. Dry and measure melting point to confirm purity."},
    {q:"Describe the use of a separating funnel in organic synthesis.", a:"Used to separate an organic layer from an aqueous layer.\n1. Pour mixture into separating funnel; allow layers to separate (denser layer sinks).\n2. Drain lower layer (usually aqueous if organic solvent is less dense) through the tap.\n3. Pour upper layer out through the top.\nWash organic layer with sodium carbonate solution (removes acidic impurities) or brine.\nDry organic layer with anhydrous MgSO₄; filter; evaporate solvent."},
    {q:"What is the role of an anhydrous drying agent in organic synthesis?", a:"Anhydrous drying agents (MgSO₄, CaCl₂, Na₂SO₄) absorb traces of water from an organic layer.\nWater is present after aqueous washing steps.\nMgSO₄: fast, effective, can be used with most functional groups.\nCaCl₂: cheap but cannot be used with alcohols or amines (forms complexes).\nAdd to organic layer, swirl, filter off the drying agent; proceed to evaporate solvent."},
    {q:"Name and describe four spectroscopic methods used to identify organic compounds.", a:"1. Mass spectrometry (MS): gives Mr (molecular ion), fragmentation pattern → molecular formula and structure clues.\n2. Infrared spectroscopy (IR): identifies functional groups from bond vibration absorptions (wavenumber/cm⁻¹).\n3. ¹H NMR spectroscopy: shows number of different H environments, relative numbers of H, neighbouring H (splitting pattern).\n4. ¹³C NMR: shows number of different carbon environments.\nUsed together, these four techniques allow complete structure determination."},
  ]},

  "ocr_5.1.1": { title: "Reaction Rates", cards: [
    {q:"Define rate of reaction and write the general rate equation.", a:"Rate of reaction: change in concentration of reactant or product per unit time (mol dm⁻³ s⁻¹).\nRate equation: rate = k[A]ᵐ[B]ⁿ\nwhere k = rate constant, [A] and [B] are concentrations of reactants, m and n are orders of reaction.\nOrders must be determined experimentally — they cannot be deduced from the stoichiometric equation."},
    {q:"Define zero, first, and second order with respect to a reactant.", a:"Zero order (m=0): rate is independent of [A]; doubling [A] → no change in rate.\nFirst order (m=1): rate ∝ [A]; doubling [A] → rate doubles.\nSecond order (m=2): rate ∝ [A]²; doubling [A] → rate quadruples.\nOverall order = sum of all individual orders (m+n for two reactants)."},
    {q:"State the units of rate constant k for zero, first, and second order reactions.", a:"Units of k: derived from rate = k[A]^n\nZero order: k = rate / 1 = mol dm⁻³ s⁻¹\nFirst order: k = rate / [A] = (mol dm⁻³ s⁻¹) / (mol dm⁻³) = s⁻¹\nSecond order: k = rate / [A]² = (mol dm⁻³ s⁻¹) / (mol dm⁻³)² = mol⁻¹ dm³ s⁻¹"},
    {q:"How do you determine order of reaction using the initial rates method?", a:"Run experiments varying one reactant at a time, keeping others constant.\nCompare initial rates:\nIf [A] doubles and rate stays same → zero order\nIf [A] doubles and rate doubles → first order\nIf [A] doubles and rate quadruples → second order\nThen use rate equation and experimental values to calculate k."},
    {q:"Describe the concentration-time graphs for zero, first, and second order reactions.", a:"Zero order: straight line decreasing (constant rate of concentration decrease).\nFirst order: exponential decay curve (half-life is constant).\nSecond order: curved, steeper than exponential decay initially; half-life increases as concentration decreases."},
    {q:"Describe the rate-concentration graphs for zero, first, and second order reactions.", a:"Zero order: horizontal line (rate is constant, independent of concentration).\nFirst order: straight line through origin (rate ∝ [reactant]).\nSecond order: upward-curving line (parabola; rate increases more steeply with concentration)."},
    {q:"Define half-life and how does it differ between first and second order reactions?", a:"Half-life t½: time for the concentration of a reactant to fall to half its initial value.\nFirst order: t½ is CONSTANT, independent of starting concentration. t½ = ln2/k ≈ 0.693/k\nSecond order: t½ INCREASES as concentration decreases (t½ = 1/(k[A]).\nConstant half-life is the diagnostic feature of a first order reaction."},
    {q:"Define rate-determining step and explain how rate equation reveals mechanism.", a:"Rate-determining step (RDS): the slowest step in a multi-step reaction mechanism, which controls the overall rate.\nSpecies appearing in the rate equation must be present in the RDS or in a fast prior equilibrium step.\nExample: if rate = k[A][B], then A and B both appear in or before the RDS.\nIf a proposed mechanism has these species in the RDS, it is consistent with the rate data."},
    {q:"State the Arrhenius equation and explain the effect of temperature on k.", a:"k = Ae^(−Ea/RT)\nk = rate constant, A = pre-exponential factor (collision frequency × steric factor), Ea = activation energy (J mol⁻¹), R = 8.314 J K⁻¹ mol⁻¹, T = temperature (K).\nAs T increases, e^(−Ea/RT) increases → k increases exponentially → rate increases.\nSmall increase in T → large increase in k (especially when Ea is large)."},
    {q:"How is the Arrhenius equation linearised and what graph is plotted?", a:"Take natural log: ln k = ln A − Ea/RT\nPlot ln k (y-axis) against 1/T (x-axis).\nResult: straight line with gradient = −Ea/R and y-intercept = ln A.\nTo find Ea: Ea = −gradient × R (remember R = 8.314 J mol⁻¹ K⁻¹).\nThis gives activation energy without needing to know A."},
    {q:"How do you use the Arrhenius equation to calculate Ea from k at two temperatures?", a:"ln(k₂/k₁) = (Ea/R) × (1/T₁ − 1/T₂)\nSubstitute: k₁, k₂ (rate constants), T₁, T₂ (temperatures in K), R = 8.314.\nSolve for Ea.\nAlternatively: ln k₁ − ln k₂ = Ea/R × (1/T₂ − 1/T₁)"},
    {q:"Describe how a catalyst affects the rate constant k and the Arrhenius equation.", a:"A catalyst lowers Ea → increases k (more molecules exceed Ea → faster rate).\nIn the Arrhenius equation: lower Ea → larger e^(−Ea/RT) → larger k.\nThe pre-exponential factor A may also change slightly (different collision geometry with catalyst surface).\nEffect: k increases dramatically (exponential dependence on Ea)."},
    {q:"How is the order of reaction determined graphically from a concentration-time graph?", a:"Plot concentration vs time:\nIf straight line → zero order.\nIf exponential decay with constant half-life → first order (confirm: consecutive half-lives are equal).\nIf half-life increases with time → second order.\nAlternatively: plot rate vs [reactant] — straight line through origin = first order; curve = second order; horizontal = zero order."},
    {q:"What is the molecularity of an elementary step?", a:"Molecularity: the number of reactant species (molecules, atoms, or ions) that collide in a single elementary step.\nUnimolecular (1 species): A → products (e.g. radioactive decay, SN1 first step)\nBimolecular (2 species): A + B → products (most common)\nTermolecular (3 species): very rare — probability of three-body collision is very low.\nMolecularity is always a whole number and applies only to elementary (one-step) reactions."},
    {q:"How does the initial rates method allow calculation of k?", a:"After determining orders m and n, substitute into rate equation:\nrate = k[A]ᵐ[B]ⁿ\nUse any one experimental data set:\nk = rate / ([A]ᵐ × [B]ⁿ)\nCalculate k using consistent units; check by substituting into other experiments.\nUnits of k depend on overall order (n+m)."},
  ]},

  "ocr_5.1.2": { title: "Equilibrium (Quantitative)", cards: [
    {q:"Write a general Kc expression and state its units for: aA + bB ⇌ cC + dD.", a:"Kc = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)\nConcentrations in mol dm⁻³; raised to stoichiometric powers.\nUnits of Kc: (mol dm⁻³)^(c+d−a−b) — simplify to find actual units.\nKc is dimensionless if c+d = a+b (Δn = 0).\nKc only changes with temperature."},
    {q:"Write the Kp expression for N₂(g) + 3H₂(g) ⇌ 2NH₃(g) and give its units.", a:"Kp = (pNH₃)² / (pN₂ × (pH₂)³)\nUnits: Pa² / (Pa × Pa³) = Pa^(2−1−3) = Pa⁻² (or kPa⁻², atm⁻²)\nΔn(gas) = 2 − (1+3) = −2 → units Pa⁻²\nKp only changes with temperature."},
    {q:"How do you calculate partial pressures from mole fractions and total pressure?", a:"Mole fraction of A: χₐ = nₐ / ntotal\nPartial pressure of A: pₐ = χₐ × Ptotal\nSum of all partial pressures = Ptotal (Dalton's law)\nExample: 0.3 mol N₂, 0.9 mol H₂, 0.6 mol NH₃; total = 1.8 mol; Ptotal = 200 kPa.\nχ(N₂) = 0.3/1.8 = 1/6; p(N₂) = (1/6)×200 = 33.3 kPa"},
    {q:"What is the relationship between Kp and Kc?", a:"Kp = Kc × (RT)^Δn\nwhere Δn = (moles of gaseous products) − (moles of gaseous reactants)\nR = 8.314 J mol⁻¹ K⁻¹, T = temperature in K.\nIf Δn = 0: Kp = Kc (numerically equal).\nKp uses partial pressures; Kc uses molar concentrations."},
    {q:"How does temperature affect Kp for exothermic and endothermic reactions?", a:"Exothermic reaction (ΔH < 0): increase T → equilibrium shifts left → fewer products → Kp decreases.\nEndothermic reaction (ΔH > 0): increase T → equilibrium shifts right → more products → Kp increases.\nTemperature is the ONLY factor that changes Kp (or Kc).\nChanging pressure, concentration, or adding catalyst: NO change in Kp."},
    {q:"Define the reaction quotient Q and use it to predict direction of reaction.", a:"Q is calculated using the same expression as Kc/Kp but with non-equilibrium concentrations/pressures.\nIf Q < Kc: reaction proceeds forward (more products needed to reach equilibrium).\nIf Q > Kc: reaction proceeds in reverse (too many products; reactants needed).\nIf Q = Kc: system is at equilibrium."},
    {q:"Define acid dissociation constant Ka and write its expression for a weak acid HA.", a:"Ka = [H⁺][A⁻] / [HA]    units: mol dm⁻³\nLarger Ka → stronger acid (more dissociated).\npKa = −log₁₀(Ka); smaller pKa → stronger acid.\nAssumptions for Ka calculation: [H⁺] = [A⁻] (from dissociation only), [HA]eq ≈ [HA]initial (small degree of dissociation)."},
    {q:"Calculate the pH of a 0.100 mol dm⁻³ solution of ethanoic acid (Ka = 1.8 × 10⁻⁵ mol dm⁻³).", a:"[H⁺] = √(Ka × c) = √(1.8×10⁻⁵ × 0.100) = √(1.8×10⁻⁶) = 1.34×10⁻³ mol dm⁻³\npH = −log(1.34×10⁻³) = 2.87\nCheck assumption: 1.34×10⁻³ / 0.100 = 1.34% dissociation — valid (<5%)."},
    {q:"Define Kw and calculate the pH of a strong base.", a:"Kw = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴ mol² dm⁻⁶ at 25°C.\npH of 0.1 mol dm⁻³ NaOH:\n[OH⁻] = 0.1 mol dm⁻³\n[H⁺] = Kw / [OH⁻] = 1.00×10⁻¹⁴ / 0.1 = 1.0×10⁻¹³ mol dm⁻³\npH = −log(1.0×10⁻¹³) = 13.0"},
    {q:"What is a buffer solution and how does it resist pH changes?", a:"Buffer solution: resists pH changes when small amounts of acid or alkali are added.\nComposition: weak acid (HA) + its conjugate base (A⁻, from soluble salt like sodium salt).\nResistance:\nAdd H⁺: A⁻(aq) + H⁺(aq) → HA(aq) [base component neutralises acid]\nAdd OH⁻: HA(aq) + OH⁻(aq) → A⁻(aq) + H₂O(l) [acid component neutralises alkali]"},
    {q:"State the Henderson-Hasselbalch equation and use it.", a:"pH = pKa + log([A⁻]/[HA])\nWhen [A⁻] = [HA]: log(1) = 0 → pH = pKa (half-neutralisation point).\nExample: buffer of CH₃COOH (pKa = 4.76) and CH₃COONa, [A⁻]/[HA] = 2:\npH = 4.76 + log(2) = 4.76 + 0.30 = 5.06"},
    {q:"Describe the shapes of titration curves for strong acid/strong base and weak acid/strong base.", a:"Strong acid / strong base:\n• Starts at low pH (~1 for 0.1 mol dm⁻³ HCl); sharp vertical jump at equivalence point (pH≈7); ends at high pH.\nWeak acid / strong base:\n• Starts at higher pH (pH ~3); buffer region (gradual change around half-equivalence point pH = pKa); equivalence point pH >7 (~8-9); vertical jump is less steep."},
    {q:"How do you choose the correct indicator for a titration?", a:"The indicator's pKa (and colour change range) should lie within the steep portion of the titration curve (at the equivalence point).\nStrong acid/strong base: either methyl orange (range 3.1–4.4) or phenolphthalein (8.2–10) work.\nWeak acid/strong base: phenolphthalein (changes in alkaline region, equivalence point pH>7).\nStrong acid/weak base: methyl orange (changes in acidic region, equivalence point pH<7).\nWeak acid/weak base: no suitable indicator (no sharp jump)."},
    {q:"How does temperature affect Kw and the pH of neutral water?", a:"Water autoionisation is endothermic: H₂O ⇌ H⁺ + OH⁻\nIncreasing temperature shifts equilibrium right → Kw increases → [H⁺] increases → pH decreases.\nAt 37°C: Kw ≈ 2.4×10⁻¹⁴, neutral pH ≈ 6.8.\nWater is still neutral because [H⁺] = [OH⁻]; neutrality does NOT require pH = 7."},
    {q:"Calculate the pH of a buffer solution containing 0.20 mol dm⁻³ CH₃COOH and 0.10 mol dm⁻³ CH₃COONa (pKa = 4.76).", a:"pH = pKa + log([A⁻]/[HA])\n= 4.76 + log(0.10/0.20)\n= 4.76 + log(0.5)\n= 4.76 + (−0.30)\n= 4.46"},
  ]},

  "ocr_5.2.1": { title: "Lattice Enthalpy", cards: [
    {q:"Define lattice enthalpy (dissociation) and state its sign.", a:"Lattice enthalpy of dissociation: the enthalpy change when 1 mole of ionic solid is converted to its constituent gaseous ions under standard conditions.\nMgO(s) → Mg²⁺(g) + O²⁻(g)\nAlways ENDOTHERMIC (positive ΔH) — bonds must be broken.\nAlternative definition (formation): ions → lattice; always exothermic (negative)."},
    {q:"State the two factors that determine the magnitude of lattice enthalpy.", a:"1. Ionic charge: higher charge on ions → stronger electrostatic attraction → larger (more endothermic) lattice enthalpy.\nExample: MgO (Mg²⁺, O²⁻) has much larger ΔHlatt than NaCl (Na⁺, Cl⁻).\n2. Ionic radius: smaller ions → ions are closer together → stronger attraction → larger lattice enthalpy.\nExample: LiF has larger ΔHlatt than CsI."},
    {q:"List all the steps in a Born-Haber cycle for NaCl.", a:"ΔHf°(NaCl) = ΔHat°(Na) + IE₁(Na) + ΔHat°(½Cl₂) + EA₁(Cl) + ΔHlatt°(NaCl)\nIndividual steps:\n1. Na(s) → Na(g): enthalpy of atomisation of Na (+108 kJ mol⁻¹)\n2. Na(g) → Na⁺(g) + e⁻: first IE of Na (+496 kJ mol⁻¹)\n3. ½Cl₂(g) → Cl(g): enthalpy of atomisation of Cl (+122 kJ mol⁻¹)\n4. Cl(g) + e⁻ → Cl⁻(g): first electron affinity (−349 kJ mol⁻¹)\n5. Na⁺(g) + Cl⁻(g) → NaCl(s): lattice formation (−787 kJ mol⁻¹)"},
    {q:"Define enthalpy of atomisation and electron affinity.", a:"Enthalpy of atomisation ΔHat°: enthalpy change to form 1 mol of gaseous atoms from the element in its standard state. Always endothermic.\nExamples: Na(s)→Na(g); ½Cl₂(g)→Cl(g)\nFirst electron affinity ΔEA1: energy released when 1 mol of gaseous atoms each accepts one electron to form 1 mol of −1 ions. Usually exothermic.\nCl(g) + e⁻ → Cl⁻(g)  ΔEA1 = −349 kJ mol⁻¹"},
    {q:"Why is the second electron affinity of oxygen endothermic?", a:"First EA (O(g) + e⁻ → O⁻(g)): exothermic (−141 kJ mol⁻¹) — electron attracted to neutral atom.\nSecond EA (O⁻(g) + e⁻ → O²⁻(g)): endothermic (+798 kJ mol⁻¹) — electron must overcome the repulsion from the already negatively charged O⁻ ion.\nEnergy input required to force second electron onto negative ion."},
    {q:"Explain the difference between theoretical and experimental lattice enthalpies.", a:"Theoretical lattice enthalpy: calculated assuming purely ionic model (perfect ions with no covalent character).\nExperimental lattice enthalpy: derived from Born-Haber cycle using real thermodynamic data.\nIf experimental > theoretical (more exothermic): compound has some covalent character.\nCovalent character increases with: small highly-charged cation (high polarising power) + large/highly charged anion (easily polarised).\nExample: AgCl shows more covalent character than NaCl."},
    {q:"Define enthalpy of hydration and its sign.", a:"Enthalpy of hydration ΔHhyd°: enthalpy change when 1 mol of gaseous ions dissolves in excess water to give aqueous ions under standard conditions.\nMg²⁺(g) + aq → Mg²⁺(aq)\nAlways EXOTHERMIC (negative ΔH) — ion-dipole attractions between ions and water molecules release energy.\nMagnitude increases with higher ionic charge and smaller ionic radius."},
    {q:"State the equation relating enthalpy of solution, lattice enthalpy, and hydration enthalpy.", a:"ΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion)\nIf ΔHhyd(cation) + ΔHhyd(anion) > ΔHlatt(dissociation): exothermic dissolution (salt dissolves readily, NaOH, NaCl).\nIf ΔHlatt(dissociation) > sum of ΔHhyd values: endothermic dissolution (less soluble, MgCO₃).\nExample: NaCl: ΔHsol = +787 + (−406) + (−363) = +18 kJ mol⁻¹ (slightly endothermic but dissolves due to entropy)."},
    {q:"Compare the lattice enthalpies of NaCl, MgCl₂, and MgO and explain the differences.", a:"ΔHlatt dissociation (kJ mol⁻¹): NaCl ≈ +787; MgCl₂ ≈ +2526; MgO ≈ +3791\nNaCl vs MgCl₂: Mg²⁺ has higher charge than Na⁺ AND smaller radius → much stronger lattice.\nMgCl₂ vs MgO: O²⁻ has higher charge than Cl⁻ AND smaller radius → O²⁻ interacts much more strongly with Mg²⁺ → largest lattice enthalpy."},
    {q:"Describe how a Born-Haber cycle is constructed and used.", a:"1. Arrange enthalpy changes in a cycle (like Hess's Law).\n2. Starting from elements in standard states → compound formation (ΔHf°) by direct route.\n3. Alternative route: atomise elements → form gaseous ions → form lattice.\n4. Apply Hess's Law: sum of clockwise steps = sum of anticlockwise.\n5. Use to find any unknown step (most commonly the lattice enthalpy)."},
    {q:"What is polarisation of ions and how does it indicate covalent character?", a:"Polarisation: a small, highly charged cation distorts the electron cloud of an anion towards itself, giving some shared electron character.\nHigh polarising power of cation: small size + high charge (e.g. Mg²⁺, Al³⁺).\nHigh polarisability of anion: large size + high charge (e.g. I⁻, S²⁻).\nMore polarisation → more covalent character → experimental ΔHlatt differs more from theoretical.\nFajans' rules describe these polarisation trends."},
    {q:"Calculate the lattice enthalpy of NaCl from the following data.", a:"Given: ΔHf°(NaCl) = −411, ΔHat°(Na) = +108, IE₁(Na) = +496, ΔHat°(½Cl₂) = +122, EA₁(Cl) = −349 (all kJ mol⁻¹)\nΔHf° = ΔHat(Na) + IE₁(Na) + ΔHat(Cl) + EA₁(Cl) + ΔHlatt(formation)\n−411 = 108 + 496 + 122 + (−349) + ΔHlatt\n−411 = 377 + ΔHlatt\nΔHlatt(formation) = −788 kJ mol⁻¹"},
    {q:"Why do Group 2 compounds have larger lattice enthalpies than Group 1 analogues?", a:"Group 2 cations are M²⁺ (charge 2+) vs Group 1 cations M⁺ (charge 1+).\nHigher charge → stronger electrostatic attraction in lattice → larger lattice enthalpy.\nGroup 2 cations also have slightly smaller radii than Group 1 cations of same period.\nExample: MgO (both 2+ and 2−) has a much larger lattice enthalpy (~3791 kJ mol⁻¹) than NaCl (~787 kJ mol⁻¹)."},
    {q:"How does enthalpy of hydration vary with ionic charge and radius?", a:"ΔHhyd increases (more negative/exothermic) with:\n1. Higher ionic charge: stronger ion-dipole interaction between ion and water.\n2. Smaller ionic radius: water molecules can get closer → stronger interaction.\nExamples: Al³⁺ (−4690 kJ mol⁻¹) >> Mg²⁺ (−1891) >> Na⁺ (−406) >> K⁺ (−322).\nF⁻ (−506) > Cl⁻ (−363) > Br⁻ (−336) > I⁻ (−295) (radius increases, ΔHhyd decreases)."},
  ]},

  "ocr_5.2.2": { title: "Gibbs Free Energy and Entropy", cards: [
    {q:"Define entropy S and state its units.", a:"Entropy S: a quantitative measure of the disorder or randomness in a system.\nUnits: J K⁻¹ mol⁻¹ (note: J not kJ — important for Gibbs free energy calculations).\nHigher S = more disordered/random arrangement.\nThird law of thermodynamics: perfect crystal at 0 K has S = 0."},
    {q:"State factors that increase entropy and give examples.", a:"Entropy increases when:\n1. State changes: solid → liquid → gas (large increase, especially solid→gas)\n2. Dissolving: solid/gas → solution (increased randomness)\n3. More moles of gas produced: N₂O₄ → 2NO₂ (1 mol → 2 mol gas)\n4. Mixing of gases or liquids\n5. Increasing temperature (more energy states accessible)\n6. Complex molecules: more vibrational modes → higher S"},
    {q:"How is ΔSsystem calculated for a chemical reaction?", a:"ΔS°system = ΣS°(products) − ΣS°(reactants)\nMultiply each S° value by stoichiometric coefficient.\nUnits: J K⁻¹ mol⁻¹\nExample: 2H₂(g) + O₂(g) → 2H₂O(l)\nΔS° = 2(70) − [2(131) + (205)] = 140 − 467 = −327 J K⁻¹ mol⁻¹\n(Negative: gas → liquid, fewer moles)"},
    {q:"State the Gibbs free energy equation and define each term.", a:"ΔG = ΔH − TΔS\nΔG = Gibbs free energy change (kJ mol⁻¹)\nΔH = enthalpy change (kJ mol⁻¹)\nT = temperature in Kelvin\nΔS = entropy change in kJ K⁻¹ mol⁻¹ (MUST convert from J K⁻¹ mol⁻¹ by dividing by 1000)\nFor spontaneous reaction: ΔG < 0"},
    {q:"What is the condition for spontaneity (feasibility) of a reaction?", a:"ΔG < 0: reaction is feasible/spontaneous (thermodynamically favoured).\nΔG = 0: system is at equilibrium.\nΔG > 0: reaction is not feasible under those conditions (reverse reaction is feasible).\nImportant: ΔG < 0 means the reaction CAN occur, but says nothing about the rate — kinetic barriers may prevent it."},
    {q:"Analyse feasibility for all four combinations of ΔH and ΔS signs.", a:"ΔH−, ΔS+: ΔG = −−T(+) always negative → ALWAYS feasible at all temperatures.\nΔH+, ΔS−: ΔG = +−T(−) always positive → NEVER feasible at any temperature.\nΔH−, ΔS−: ΔG negative only when |ΔH| > T|ΔS| → feasible at LOW temperatures only.\nΔH+, ΔS+: ΔG negative only when T|ΔS| > |ΔH| → feasible at HIGH temperatures only."},
    {q:"How do you calculate the temperature at which a reaction becomes feasible?", a:"At the crossover temperature, ΔG = 0:\n0 = ΔH − TΔS → T = ΔH / ΔS\nAbove this T (for ΔH+, ΔS+): reaction becomes feasible.\nBelow this T (for ΔH−, ΔS−): reaction is feasible.\nRemember to use consistent units: ΔH in kJ mol⁻¹, ΔS in kJ K⁻¹ mol⁻¹ (÷1000 if given in J K⁻¹ mol⁻¹)."},
    {q:"What is ΔSsurroundings and how does it relate to ΔH?", a:"ΔSsurroundings = −ΔH / T\nAn exothermic reaction (ΔH < 0) releases heat to surroundings → surroundings become more disordered → ΔSsurr positive.\nAn endothermic reaction (ΔH > 0) → ΔSsurr negative.\nΔStotal = ΔSsystem + ΔSsurroundings = −ΔG / T\nFor spontaneous process: ΔStotal > 0 (second law of thermodynamics)."},
    {q:"Calculate ΔG at 298 K for: N₂(g) + 3H₂(g) → 2NH₃(g), ΔH° = −92 kJ mol⁻¹, ΔS° = −199 J K⁻¹ mol⁻¹.", a:"Convert ΔS°: −199/1000 = −0.199 kJ K⁻¹ mol⁻¹\nΔG = ΔH − TΔS = −92 − (298 × −0.199) = −92 − (−59.3) = −92 + 59.3 = −32.7 kJ mol⁻¹\nΔG < 0 → feasible at 298 K.\nAt high T: TΔS becomes more negative → ΔG becomes positive → reaction becomes infeasible above ~462 K."},
    {q:"Why can an exothermic reaction have ΔG > 0 at high temperatures?", a:"If ΔH < 0 (exothermic) but ΔS < 0 (entropy decreases, e.g. gases combining):\nΔG = ΔH − TΔS = negative − T(negative) = negative + T(positive)\nAt high T, the +TΔS term dominates → ΔG becomes positive → no longer feasible.\nExample: N₂ + 3H₂ → 2NH₃ becomes infeasible above ~460 K (explains why high T gives poor yield in Haber process)."},
    {q:"Explain why ΔG < 0 does not guarantee a reaction will occur in practice.", a:"ΔG < 0 (thermodynamic feasibility) tells us the reaction is energetically downhill — the products are more stable than reactants.\nHowever, if the activation energy Ea is very high, the reaction will proceed extremely slowly at room temperature.\nExample: N₂ + 3H₂ → 2NH₃ has ΔG < 0 but requires high temperature and iron catalyst to proceed at a useful rate.\nThermodynamic feasibility ≠ kinetic feasibility."},
    {q:"How does the entropy change for dissolving NaCl in water?", a:"NaCl(s) → Na⁺(aq) + Cl⁻(aq)\nΔSsystem: positive (solid → ions in solution, more disorder).\nΔSsurroundings: slightly negative (dissolution is slightly endothermic, ΔHsol ≈ +18 kJ mol⁻¹, so ΔSsurr = −18/298 ≈ −0.06 kJ K⁻¹ mol⁻¹ = −60 J K⁻¹ mol⁻¹).\nΔStotal = ΔSsystem + ΔSsurr > 0 (net entropy increase drives dissolution even though slightly endothermic)."},
    {q:"Compare the entropy of diamond and graphite at 298 K and explain.", a:"S°(diamond) = 2.4 J K⁻¹ mol⁻¹; S°(graphite) = 5.7 J K⁻¹ mol⁻¹.\nBoth are giant covalent solids, so both have relatively low entropy.\nGraphite has higher entropy because its layered structure with weaker interlayer forces allows more vibrational modes and slight structural disorder.\nDiamond is a rigid 3D network with very constrained atomic positions → lower entropy."},
    {q:"What is the relationship between ΔG° and the equilibrium constant K?", a:"ΔG° = −RT ln K\nwhere R = 8.314 J mol⁻¹ K⁻¹, T = temperature (K), K = equilibrium constant.\nIf ΔG° < 0 → ln K > 0 → K > 1 (products favoured at equilibrium).\nIf ΔG° > 0 → ln K < 0 → K < 1 (reactants favoured).\nIf ΔG° = 0 → K = 1 (equal concentrations of reactants and products).\nThis equation links thermodynamic feasibility directly to the position of equilibrium."},
  ]},

  "ocr_5.3.1": { title: "Electrode Potentials and Cells", cards: [
    {q:"Define standard electrode potential E°.", a:"Standard electrode potential E°: the potential of a half-cell measured relative to the standard hydrogen electrode (SHE) under standard conditions (298 K, 1 mol dm⁻³ of all ions, 100 kPa for gases).\nA more positive E° means the species has a greater tendency to be reduced (stronger oxidising agent).\nA more negative E° means the species is more readily oxidised (stronger reducing agent)."},
    {q:"Describe the standard hydrogen electrode.", a:"SHE: platinum electrode immersed in 1.00 mol dm⁻³ H⁺(aq) with H₂ gas at 100 kPa bubbled over it, at 298 K.\nHalf-equation: 2H⁺(aq) + 2e⁻ ⇌ H₂(g)  E° = 0.00 V by definition.\nPt is used because it is inert and acts as an electron conductor without participating in the reaction.\nAll E° values are measured against this reference."},
    {q:"How is the EMF of an electrochemical cell calculated?", a:"E°cell = E°(right half-cell, cathode) − E°(left half-cell, anode)\n= E°(more positive) − E°(more negative)\nCathode: reduction occurs (more positive E°).\nAnode: oxidation occurs (more negative E°).\nExample: Cu²⁺/Cu (E°=+0.34V) and Zn²⁺/Zn (E°=−0.76V):\nE°cell = 0.34 − (−0.76) = +1.10 V"},
    {q:"Write the conventional cell notation and identify cathode and anode.", a:"Convention: anode | electrolyte || electrolyte | cathode\nOxidation occurs at the anode (left); reduction at cathode (right).\nExample: Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)\nDouble line || = salt bridge (or porous partition).\nSingle line | = phase boundary.\nElectrons flow from left (anode, Zn) to right (cathode, Cu) in the external circuit."},
    {q:"How is the feasibility of a redox reaction predicted from electrode potentials?", a:"Calculate E°cell = E°(reduction) − E°(oxidation)\nIf E°cell > 0: reaction is feasible (thermodynamically spontaneous).\nIf E°cell < 0: reaction is not feasible under standard conditions.\nExample: Will Fe³⁺ oxidise I⁻?\nE°(Fe³⁺/Fe²⁺) = +0.77V; E°(I₂/I⁻) = +0.54V\nE°cell = 0.77 − 0.54 = +0.23V > 0 → yes, feasible."},
    {q:"State two limitations when using E° to predict feasibility.", a:"1. Standard conditions rarely met in practice: non-standard concentrations or temperatures alter actual E values (Nernst equation).\n2. Kinetic barriers: even if E°cell > 0 (thermodynamically feasible), a high activation energy may mean the reaction is too slow to observe.\n3. Overpotential: extra voltage may be needed beyond the theoretical E° (especially in electrolysis).\nE°cell > 0 is necessary but not sufficient to guarantee a reaction occurs."},
    {q:"Describe a hydrogen-oxygen fuel cell and write the half-equations (acidic).", a:"Anode (oxidation): H₂(g) → 2H⁺(aq) + 2e⁻\nCathode (reduction): ½O₂(g) + 2H⁺(aq) + 2e⁻ → H₂O(l)\nOverall: H₂ + ½O₂ → H₂O\nFuel is supplied continuously (unlike batteries).\nAdvantages: only product is water; high efficiency; no recharging.\nDisadvantages: H₂ storage/safety; H₂ often made from fossil fuels; expensive Pt catalyst."},
    {q:"Describe the electrochemical series and how it predicts which species can oxidise which.", a:"Electrochemical series: half-cells arranged in order of E° (most negative at top, most positive at bottom).\nRule: any species on the RIGHT of a half-equation (oxidised form) with a more positive E° will oxidise species on the LEFT of any half-equation with a more negative E°.\nOr: species with more positive E° can oxidise species with more negative E°.\nThe further apart the E° values, the greater the driving force."},
    {q:"Explain the Nernst equation qualitatively.", a:"The Nernst equation: E = E° − (RT/nF) ln Q\nshows that the actual electrode potential E depends on concentration.\nIf [oxidised form] > standard → E more positive than E°.\nIf [reduced form] > standard → E more negative than E°.\nPractical implication: as a battery discharges, concentrations change → E decreases → terminal voltage drops → battery goes 'flat'.\nQualitative understanding required at A-level."},
    {q:"Describe a rechargeable lithium-ion cell.", a:"Anode: lithium-graphite (LiC₆) — Li⁺ intercalated in graphite.\nCathode: lithium metal oxide (e.g. LiCoO₂).\nElectrolyte: lithium salt in organic solvent.\nDischarging: Li in anode → Li⁺ + e⁻ (oxidation at anode); Li⁺ migrates to cathode; e⁻ flow through external circuit.\nCharging: reverse process — Li⁺ returns to anode.\nHigh energy density, rechargeable, used in phones/EVs."},
    {q:"Compare electrochemical cells and electrolytic cells.", a:"Electrochemical cell: chemical energy → electrical energy; spontaneous redox reaction drives current; E°cell > 0.\nElectrolytic cell: electrical energy → chemical energy; non-spontaneous reaction driven by external voltage; used for electroplating, electrolysis of brine, aluminium extraction.\nKey difference: electrochemical cell generates EMF; electrolytic cell requires external power supply."},
    {q:"Give the half-equations and overall equation for the hydrogen-oxygen fuel cell in alkaline conditions.", a:"Anode (oxidation): H₂(g) + 2OH⁻(aq) → 2H₂O(l) + 2e⁻\nCathode (reduction): ½O₂(g) + H₂O(l) + 2e⁻ → 2OH⁻(aq)\nOverall: H₂(g) + ½O₂(g) → H₂O(l)\nThe overall equation is the same in acid and alkaline conditions — only the electrolyte and form of water differ."},
    {q:"What is the salt bridge and what is its function?", a:"The salt bridge (usually saturated KNO₃ solution in a U-tube or filter paper) connects the two half-cells.\nFunctions:\n1. Allows ions to migrate to maintain electrical neutrality in each half-cell (prevents charge build-up).\n2. Completes the electrical circuit without allowing the half-cell solutions to mix.\nKNO₃ used because K⁺ and NO₃⁻ are unlikely to react with either half-cell solution."},
    {q:"Describe an iodometric (iodine–thiosulfate) redox titration.", a:"An oxidising agent (e.g. Cu²⁺, H₂O₂, Cl₂, IO₃⁻) is added to excess KI(aq) in acidic solution → liberates a known amount of I₂.\nThe I₂ produced is titrated with standard Na₂S₂O₃ solution (sodium thiosulfate).\nNear endpoint: solution turns pale yellow → add starch indicator → deep blue-black colour.\nEndpoint: blue-black colour disappears permanently on addition of the last drop of thiosulfate.\nMoles of oxidising agent calculated from moles of Na₂S₂O₃ used and stoichiometry."},
    {q:"Write the half-equations and overall equation for the iodine–thiosulfate titration.", a:"Reduction: I₂(aq) + 2e⁻ → 2I⁻(aq)\nOxidation: 2S₂O₃²⁻(aq) → S₄O₆²⁻(aq) + 2e⁻\nOverall: I₂(aq) + 2S₂O₃²⁻(aq) → 2I⁻(aq) + S₄O₆²⁻(aq)\nMole ratio: 1 mol I₂ : 2 mol S₂O₃²⁻\nThe tetrathionate ion (S₄O₆²⁻) is the oxidation product of thiosulfate."},
    {q:"Describe a KMnO₄ redox titration to find the concentration of Fe²⁺.", a:"Acidify Fe²⁺ solution with dilute H₂SO₄ (provides H⁺ required for MnO₄⁻ reduction; avoid HCl — Cl⁻ can be oxidised).\nFill burette with standardised KMnO₄ solution.\nRun KMnO₄ from burette into Fe²⁺ solution in conical flask; no indicator needed (KMnO₄ is self-indicating).\nEach drop of purple KMnO₄ decolourises as it reacts with Fe²⁺ → Mn²⁺ + Fe³⁺.\nEndpoint: first permanent pale pink colour (slight excess KMnO₄).\nMole ratio: 1 MnO₄⁻ : 5 Fe²⁺"},
  ]},

  "ocr_5.4.1": { title: "Transition Elements", cards: [
    {q:"Define a transition element and explain why Sc and Zn are excluded.", a:"Transition element: a d-block element that forms at least one stable ion with a PARTIALLY FILLED d subshell.\nSc: only forms Sc³⁺ ([Ar]3d⁰) — empty d → not a transition metal.\nZn: only forms Zn²⁺ ([Ar]3d¹⁰) — full d → not a transition metal.\nTi to Cu all form ions with partially filled d → all are transition metals."},
    {q:"Write the electron configurations of Cr and Cu, and explain the anomalies.", a:"Cr: [Ar]3d⁵4s¹ (not 3d⁴4s²) — half-filled d subshell confers extra stability.\nCu: [Ar]3d¹⁰4s¹ (not 3d⁹4s²) — fully filled d subshell confers extra stability.\nIn both cases, one electron is promoted from 4s to 3d.\nWhen forming ions, 4s electrons are lost before 3d: Fe → Fe²⁺ [Ar]3d⁶; Fe → Fe³⁺ [Ar]3d⁵."},
    {q:"List the four characteristic properties of transition metals.", a:"1. Variable oxidation states (3d and 4s electrons have similar energies → various combinations possible).\n2. Coloured ions (d-d electron transitions: ligand field splits d orbitals → absorb visible light).\n3. Catalytic activity (variable oxidation states enable electron shuttle in catalytic cycles).\n4. Complex ion formation (empty d orbitals accept lone pairs from ligands via coordinate bonds)."},
    {q:"Define ligand, complex ion, and coordination number.", a:"Ligand: a molecule or ion with a lone pair that donates to a central metal ion via a coordinate (dative covalent) bond.\nComplex ion: central metal ion surrounded by ligands bonded via coordinate bonds.\nCoordination number: total number of coordinate bonds from ligands to the metal centre (usually 4 or 6).\nCommon ligands: H₂O (aqua), NH₃ (ammine), Cl⁻ (chloro), CN⁻ (cyano), OH⁻ (hydroxo)."},
    {q:"Describe the common shapes of transition metal complexes.", a:"Octahedral (6 ligands, coordination number 6): bond angles 90°. Most common with small ligands (H₂O, NH₃, CN⁻).\nExample: [Fe(H₂O)₆]²⁺, [Co(NH₃)₆]³⁺\nTetrahedral (4 ligands): bond angles 109.5°. With larger ligands (Cl⁻).\nExample: [CuCl₄]²⁻, [FeCl₄]⁻\nSquare planar (4 ligands, 90°): especially Pt²⁺, Ni²⁺, Au³⁺.\nExample: cisplatin [Pt(NH₃)₂Cl₂], [Ni(CN)₄]²⁻"},
    {q:"Explain why transition metal complexes are coloured.", a:"Ligands split the d orbitals into two sets at different energies (crystal/ligand field splitting).\nElectrons can be promoted from the lower d set to the upper d set by absorbing visible light (d-d transition).\nEnergy absorbed = hν = difference between d orbital levels.\nThe colour observed = complementary colour to the absorbed wavelength.\nExample: [Cu(H₂O)₆]²⁺ absorbs red/orange → appears blue; [Cu(NH₃)₄(H₂O)₂]²⁺ absorbs different wavelength → deeper blue."},
    {q:"Describe cis-trans isomerism in square planar complexes.", a:"In square planar complexes with two different types of ligands (e.g. [Pt(NH₃)₂Cl₂]):\ncis isomer: identical ligands on the same side (adjacent, 90° apart).\ntrans isomer: identical ligands on opposite sides (180° apart).\nCisplatin (cis-[Pt(NH₃)₂Cl₂]): an anticancer drug — binds to DNA, prevents replication.\nTransplatin: inactive — too far apart to cross-link DNA strands."},
    {q:"Describe optical isomerism in octahedral complexes with bidentate ligands.", a:"Bidentate ligands (e.g. en = 1,2-diaminoethane) coordinate to the metal as chelates.\nIn octahedral [M(en)₃]ⁿ⁺: the three bidentate ligands create a helical arrangement.\nTwo non-superimposable mirror image structures form (Δ and Λ enantiomers).\nBoth rotate plane-polarised light in opposite directions.\nOptical isomerism requires a non-superimposable mirror image (no plane of symmetry)."},
    {q:"Describe the ligand substitution reaction of [Cu(H₂O)₆]²⁺ with NH₃.", a:"[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O\nWith limited NH₃: pale blue precipitate Cu(OH)₂ forms first.\nWith excess NH₃: Cu(OH)₂ dissolves → deep/royal blue solution of tetraamminecopper(II).\nColour change: pale blue → deep blue (characteristic observation)."},
    {q:"Describe the ligand substitution reaction of [Co(H₂O)₆]²⁺ with Cl⁻.", a:"[Co(H₂O)₆]²⁺(aq) + 4Cl⁻(aq) ⇌ [CoCl₄]²⁻(aq) + 6H₂O(l)\nForward: add conc HCl or concentrated Cl⁻ solution.\nReverse: add water (dilute).\nColour change: pink (octahedral [Co(H₂O)₆]²⁺) ⇌ blue (tetrahedral [CoCl₄]²⁻).\nAlso: shape changes from octahedral to tetrahedral — Cl⁻ is a larger ligand."},
    {q:"What colour is [Cu(H₂O)₆]²⁺?", a:"Pale blue. The hexaaquacopper(II) ion gives the characteristic pale blue colour of copper(II) sulfate solution and any other Cu²⁺ aqueous solution."},
    {q:"What colour is [Cu(NH₃)₄(H₂O)₂]²⁺?", a:"Deep/royal blue. Formed when excess aqueous ammonia is added to a Cu²⁺ solution. Much more intense than the pale blue of [Cu(H₂O)₆]²⁺ because NH₃ causes greater d-orbital splitting than H₂O."},
    {q:"What colour is [CuCl₄]²⁻?", a:"Yellow-green. Formed when concentrated chloride (e.g. conc HCl) is added to Cu²⁺ solution. The coordination number drops from 6 to 4, shape changes from octahedral to tetrahedral, and the colour shifts dramatically from blue to yellow-green."},
    {q:"What colour is [Fe(H₂O)₆]²⁺?", a:"Pale green. Fe²⁺ aqueous solution is pale green. Adding NaOH gives a green Fe(OH)₂ precipitate. Fe²⁺ is easily oxidised in air to Fe³⁺ (green → red-brown)."},
    {q:"What colour is [Fe(H₂O)₆]³⁺?", a:"Pale violet/lilac in pure water; appears yellow-orange in acidic solution due to partial hydrolysis to [Fe(H₂O)₅(OH)]²⁺. Adding NaOH gives a red-brown precipitate of Fe(OH)₃."},
    {q:"What colour is [Co(H₂O)₆]²⁺?", a:"Pink. The hexaaquacobalt(II) ion is pink. Adding excess Cl⁻ converts it to the blue tetrahedral [CoCl₄]²⁻. This reversible pink/blue colour change is used to detect water (water drives equilibrium back to pink)."},
    {q:"What colour is [CoCl₄]²⁻?", a:"Blue (tetrahedral). Formed when excess Cl⁻ (concentrated HCl) displaces water ligands from [Co(H₂O)₆]²⁺. The equilibrium [Co(H₂O)₆]²⁺ (pink) ⇌ [CoCl₄]²⁻ (blue) can be shifted by changing Cl⁻ concentration or adding water."},
    {q:"What colour is Mn²⁺ in aqueous solution?", a:"Very pale pink, almost colourless. The Mn²⁺ aqua complex is extremely pale. Adding NaOH gives a cream/buff Mn(OH)₂ precipitate that slowly darkens in air (Mn²⁺ → higher oxides)."},
    {q:"What colour is MnO₄⁻ (permanganate)?", a:"Intense purple/violet. KMnO₄ solution is deep purple. When acting as an oxidising agent in acidic solution, Mn(VII) is reduced to Mn²⁺ — colour changes from purple to almost colourless. In neutral/alkaline solution, reduced to brown MnO₂."},
    {q:"What colour is Cr²⁺?", a:"Blue. Cr²⁺ is an unstable oxidation state readily oxidised in air to Cr³⁺ (green/violet). Its blue colour is distinct from the violet of [Cr(H₂O)₆]³⁺."},
    {q:"What colour is [Cr(H₂O)₆]³⁺ (Cr³⁺ in water)?", a:"Violet/purple in pure water. In acidic solutions (with Cl⁻ or SO₄²⁻), partial ligand substitution gives a green colour. Adding NaOH gives a grey-green Cr(OH)₃ precipitate (amphoteric — dissolves in excess NaOH)."},
    {q:"What colour is CrO₄²⁻ (chromate)?", a:"Yellow. Chromate(VI) is stable in alkaline conditions. Adding acid converts it to the orange dichromate: 2CrO₄²⁻ + 2H⁺ ⇌ Cr₂O₇²⁻ + H₂O."},
    {q:"What colour is Cr₂O₇²⁻ (dichromate)?", a:"Orange. Dichromate(VI) is stable in acidic conditions. When used as an oxidising agent, it is reduced to Cr³⁺ and the colour changes from orange to green. Adding alkali converts it back to yellow CrO₄²⁻."},
    {q:"List the key catalytic applications of transition metals.", a:"Iron (Fe): Haber process N₂ + 3H₂ ⇌ 2NH₃\nVanadium(V) oxide (V₂O₅): Contact process 2SO₂ + O₂ ⇌ 2SO₃\nMnO₂: catalytic decomposition of H₂O₂: 2H₂O₂ → 2H₂O + O₂\nNickel (Ni): hydrogenation of alkenes/oils\nPlatinum/Palladium/Rhodium: catalytic converters (CO + NO → CO₂ + N₂)\nMechanism: variable oxidation states allow redox cycling."},
    {q:"Describe the chemistry of chromium ions: Cr²⁺, Cr³⁺, CrO₄²⁻, Cr₂O₇²⁻.", a:"Cr²⁺: [Ar]3d⁴; blue solution; unstable in air (oxidised to Cr³⁺).\nCr³⁺: [Ar]3d³; violet/green in solution; precipitates grey-green Cr(OH)₃ with NaOH (amphoteric).\nCrO₄²⁻: chromate(VI); yellow; stable in alkaline solution.\nCr₂O₇²⁻: dichromate(VI); orange; stable in acid solution.\nConversion: Cr₂O₇²⁻ (orange) + 2OH⁻ → 2CrO₄²⁻ (yellow) + H₂O and reverse."},
    {q:"Describe the chemistry of manganese: Mn²⁺, MnO₂, MnO₄⁻.", a:"Mn²⁺: [Ar]3d⁵; very pale pink solution; cream precipitate with NaOH.\nMnO₂: manganese(IV) oxide; black solid; oxidation state +4; catalyst for H₂O₂ decomposition.\nMnO₄⁻: permanganate/manganate(VII); intense purple; powerful oxidising agent in acid:\nMnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (purple → colourless/pale pink).\nIn neutral/alkaline: MnO₄⁻ reduced to MnO₂ (brown precipitate)."},
    {q:"Describe how haemoglobin uses Fe²⁺ to carry oxygen.", a:"Haemoglobin has four subunits, each containing haem — a porphyrin ring with Fe²⁺ at its centre.\nFe²⁺ (not Fe³⁺) binds O₂ reversibly in lungs and releases it in tissues (where pO₂ is low).\nCO binds to Fe²⁺ ~200× more strongly than O₂ → forms stable carboxyhaemoglobin → CO poisoning.\nCO poisoning treatment: high concentration O₂ to compete with CO; hyperbaric O₂ therapy."},
    {q:"Define monodentate and bidentate ligands with examples.", a:"Monodentate: donates ONE lone pair per ligand molecule.\nExamples: H₂O (aqua), NH₃ (ammine), Cl⁻ (chloro), CN⁻ (cyano), OH⁻ (hydroxo)\nBidentate: donates TWO lone pairs from TWO different donor atoms in the same ligand.\nExamples: 1,2-diaminoethane (en, H₂NCH₂CH₂NH₂), ethanedioate (oxalate, C₂O₄²⁻)\nBidentate ligands form chelate rings → enhanced stability."},
    {q:"Describe the successive oxidation states and colours of vanadium.", a:"V(V): VO₂⁺ ion — yellow (present as V₂O₅ solid, used as catalyst in Contact process)\nV(IV): VO²⁺ ion — blue\nV(III): V³⁺ ion — green\nV(II): V²⁺ ion — violet\nReduction sequence (e.g. zinc in H₂SO₄): yellow → blue → green → violet\nThis demonstrates variable oxidation states of transition metals."},
  ]},

  "ocr_6.1.1": { title: "Aromatic Chemistry", cards: [
    {q:"Describe the Kekulé structure of benzene and the evidence that disproved it.", a:"Kekulé proposed alternating C=C and C−C bonds in a hexagonal ring (cyclohexatriene).\nEvidence against:\n1. All C−C bond lengths in benzene = 0.140 nm (between C−C 0.154 and C=C 0.134) — all bonds identical.\n2. Enthalpy of hydrogenation of benzene (−208 kJ mol⁻¹) is much less exothermic than 3× cyclohexene (3×−120 = −360 kJ mol⁻¹) — benzene is ~152 kJ mol⁻¹ more stable than expected (delocalisation energy)."},
    {q:"Describe the delocalised model of benzene.", a:"Six sp² hybridised C atoms in a regular hexagon; each C has three σ bonds (to adjacent C and to H).\nEach C also has one electron in an unhybridised p orbital perpendicular to the ring plane.\nAll six p orbitals overlap sideways to form a continuous π system above and below the ring.\nElectrons are delocalised over all 6 carbons → extra stability (aromatic stabilisation).\nRepresented as a circle inside a hexagon."},
    {q:"Explain why benzene undergoes electrophilic substitution rather than addition.", a:"Addition would disrupt the delocalised π system, destroying aromatic stabilisation (loss of ~152 kJ mol⁻¹).\nSubstitution preserves the aromatic ring — after electrophile attacks, H⁺ is lost to regenerate the aromatic system.\nThermodynamically: substitution restores stability; addition would produce a less stable non-aromatic product.\nThis is why benzene reacts with electrophiles via EAS (electrophilic aromatic substitution)."},
    {q:"Describe the nitration of benzene — reagents, conditions, electrophile, and mechanism.", a:"Reagents: concentrated HNO₃ + concentrated H₂SO₄ (mixed acid), <55°C.\nElectrophile formed: NO₂⁺ (nitronium ion): HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O\nMechanism:\n1. NO₂⁺ attacks π system → arenium ion (Wheland intermediate, loses aromaticity).\n2. H⁺ lost from the C that was attacked → aromatic ring restored.\nProduct: nitrobenzene (yellow oil)."},
    {q:"Describe the halogenation of benzene — reagents, conditions, mechanism.", a:"Reagents: Cl₂ or Br₂ + halogen carrier Lewis acid catalyst (AlCl₃ or FeBr₃), room temperature.\nRole of catalyst: generates electrophile by polarising Br₂: Br₂ + AlBr₃ → [Br−δ+]...[Br−AlBr₃]δ⁻\nMechanism: Br⁺ equivalent attacks ring → arenium ion → H⁺ lost → bromobenzene + HBr + AlBr₃ (catalyst regenerated).\nProduct: bromobenzene or chlorobenzene."},
    {q:"Describe Friedel-Crafts acylation — reagents, conditions, and why it is preferred over alkylation.", a:"Reagents: acyl chloride (RCOCl) + AlCl₃ catalyst.\nElectrophile: acylium ion RCO⁺ (formed by: RCOCl + AlCl₃ → RCO⁺ + [AlCl₄]⁻).\nProduct: aryl ketone (ArCOR, e.g. phenylethanone from CH₃COCl).\nPreferred over alkylation because: the C=O group is electron-withdrawing → deactivates ring → prevents further substitution (one product).\nAlkylation gives polyalkylation (alkyl groups activate ring)."},
    {q:"Describe Friedel-Crafts alkylation and its limitation.", a:"Reagents: halogenoalkane (RCl) + AlCl₃ catalyst.\nElectrophile: carbocation R⁺ (or highly polarised complex).\nProduct: alkylbenzene (e.g. ethylbenzene from C₂H₅Cl).\nLimitation: alkyl group donates electrons to ring → activates ring → further alkylation occurs → mixture of mono-, di-, trialkylated products.\nFor clean synthesis of one product, acylation is preferred."},
    {q:"Describe the reactions of phenol with bromine water and with dilute HNO₃.", a:"Phenol + Br₂(aq): no catalyst needed; 2,4,6-tribromophenol (white precipitate) forms immediately.\nExplanation: lone pair on O delocalises into ring → ring highly activated → Br₂ adds without catalyst; substitutes at all available ortho/para positions.\nPhenol + dilute HNO₃ (room temperature): gives mixture of 2-nitrophenol and 4-nitrophenol (no concentrated H₂SO₄ needed — ring is reactive enough)."},
    {q:"Explain directing effects in electrophilic aromatic substitution.", a:"Electron-donating groups (OH, NH₂, CH₃, OR): activate ring (faster EAS), direct incoming electrophile to ortho and para positions.\nElectron-withdrawing groups (NO₂, CHO, COOH, COR, SO₃H): deactivate ring (slower EAS), direct incoming electrophile to meta position.\nExplanation: donor groups increase electron density at ortho/para; withdrawing groups decrease density at ortho/para but less so at meta."},
    {q:"Explain why phenol is much more reactive than benzene towards EAS.", a:"In phenol, the lone pair on the oxygen overlaps with the π system of the ring (p orbital overlap).\nThis delocalisation increases electron density in the ring (particularly at ortho and para positions).\nEnhanced electron density makes it easier for electrophiles to attack (lower activation energy).\nResult: phenol reacts without a catalyst in halogenation and with dilute (not concentrated) HNO₃."},
    {q:"What is the mechanism for nitration and what controls the rate?", a:"Rate-determining step: attack of NO₂⁺ on the benzene ring (forming the arenium ion/Wheland intermediate).\nRate depends on: concentration of NO₂⁺ (determined by H₂SO₄ protonating HNO₃), and reactivity of the aromatic ring (electron density).\nDeactivated rings (e.g. nitrobenzene) react more slowly and require harsher conditions (higher T or more concentrated acid)."},
    {q:"What is the role of H₂SO₄ in the nitration of benzene?", a:"H₂SO₄ acts as a Brønsted-Lowry acid to protonate HNO₃:\nHNO₃ + H₂SO₄ → H₂NO₃⁺ + HSO₄⁻ → NO₂⁺ + H₂O + HSO₄⁻\nH₂SO₄ generates the reactive electrophile NO₂⁺ (nitronium ion).\nH₂SO₄ is regenerated after the reaction → acts as a catalyst.\nWithout H₂SO₄, nitration would be extremely slow."},
    {q:"Why is the temperature kept below 55°C in the nitration of benzene?", a:"Above 55°C, further nitration occurs more readily → dinitrobenzene and trinitrobenzene form.\nBelow 55°C: mainly mononitration → nitrobenzene as the primary product.\nHigh temperatures can also cause side reactions and decomposition of the product.\nFor industrial explosives (TNT = 2,4,6-trinitrotoluene), higher temperatures and three stages of nitration are used deliberately."},
  ]},

  "ocr_6.1.2": { title: "Amines and Nitrogen Compounds", cards: [
    {q:"Classify amines as primary, secondary, tertiary, or quaternary.", a:"Primary (1°): RNH₂ (one alkyl/aryl group on N, e.g. methylamine CH₃NH₂, aniline C₆H₅NH₂)\nSecondary (2°): R₂NH (two groups on N, e.g. dimethylamine (CH₃)₂NH)\nTertiary (3°): R₃N (three groups on N, e.g. trimethylamine (CH₃)₃N)\nQuaternary ammonium salt: R₄N⁺X⁻ (four groups on N, permanent positive charge, no lone pair available)"},
    {q:"Explain why amines are bases and compare basicity of aliphatic, aromatic, and ammonia.", a:"Amines act as Brønsted-Lowry bases: lone pair on N accepts H⁺.\nRNH₂ + H₂O ⇌ RNH₃⁺ + OH⁻\nRelative basicity: aliphatic amines (CH₃NH₂) > NH₃ > aromatic amines (C₆H₅NH₂)\nAliphatic: alkyl groups donate electrons to N → more available lone pair → stronger base.\nAromatic: lone pair delocalised into benzene ring → less available for protonation → weaker base."},
    {q:"Explain why aniline is a much weaker base than methylamine.", a:"In aniline, the lone pair on N overlaps with the π system of the benzene ring.\nThis delocalisation reduces the availability of the lone pair for accepting H⁺.\npKb(aniline) ≈ 9.4; pKb(methylamine) ≈ 3.4 — aniline is ~10⁶ times weaker as a base.\nIn methylamine, the methyl group is electron-donating → lone pair more available."},
    {q:"Describe the reaction of amines with halogenoalkanes.", a:"RNH₂ + R'X → RR'NH₂⁺X⁻ → RR'NH + HX (secondary amine)\nContinues: RR'NH + R'X → RR'₂N → RR'₂NH⁺X⁻ → tertiary amine, then quaternary salt.\nProblem: mixture of 1°, 2°, 3° amines and quaternary salt forms (difficult to control).\nSolution: use large excess of amine to favour monoalkylation."},
    {q:"Describe the reaction of amines with acyl chlorides.", a:"RNH₂ + R'COCl → RNHCOR' + HCl (amide formed + HCl)\nReaction is fast and essentially irreversible (unlike esterification).\nHCl is immediately neutralised by excess amine: RNH₂ + HCl → RNH₃⁺Cl⁻\nAdvantage over alkylation: gives only one product (primary amine gives one N-substituted amide).\nProduct: amide (−CONH− linkage)."},
    {q:"Describe the preparation of amines by reduction of nitriles.", a:"Nitrile + 2H₂ (or LiAlH₄ in dry ether) → primary amine\nRCN + 4[H] → RCH₂NH₂ (chain extended by one carbon)\nExample: CH₃CN + 4[H] → CH₃CH₂NH₂ (ethanenitrile → ethylamine)\nThis is a useful method for making primary amines with one extra carbon.\nLiAlH₄ is a powerful reducing agent — used in dry ether; hydrolyse workup with water carefully."},
    {q:"Describe the preparation of aniline from nitrobenzene.", a:"Step 1: reduce nitrobenzene using Sn (tin) + concentrated HCl under reflux.\nC₆H₅NO₂ + 6[H] → C₆H₅NH₃⁺Cl⁻ (phenylammonium chloride salt, acidic conditions)\nStep 2: add NaOH to neutralise and liberate free amine:\nC₆H₅NH₃⁺ + OH⁻ → C₆H₅NH₂ + H₂O\nAniline is an oily liquid; carcinogenic — handle in fume cupboard, avoid skin contact."},
    {q:"Describe the preparation of a diazonium salt (diazotisation).", a:"ArNH₂ + NaNO₂ + HCl → ArN₂⁺Cl⁻ + NaCl + H₂O\nConditions: keep solution at 0–5°C (ice bath); NaNO₂ + HCl generates HNO₂ in situ.\nDiazonium salt (ArN₂⁺) is unstable above 10°C → decomposes to phenol + N₂.\nKeep ice cold throughout.\nExample: aniline + NaNO₂ + HCl (0–5°C) → benzenediazonium chloride."},
    {q:"Describe azo coupling and the formation of azo dyes.", a:"ArN₂⁺ + ArOH (in NaOH) → Ar-N=N-Ar'OH + H⁺ (azo compound, coloured)\nOr: ArN₂⁺ + Ar'NH₂ → Ar-N=N-Ar'NH₂\nThe coupling reaction: N₂⁺ group acts as electrophile; attacks electron-rich coupling component (phenol or amine in alkaline solution) at para position.\nAzo compounds (−N=N− chromophore) are intensely coloured (yellow/orange/red).\nUsed extensively as fabric dyes (e.g. tartrazine, methyl orange, Sudan Red)."},
    {q:"What is the importance of diazonium salts in synthesis?", a:"Diazonium salts are key intermediates for introducing various substituents onto aromatic rings that cannot be introduced by direct electrophilic substitution:\n• −Cl, −Br, −I, −CN, −OH can all be introduced via diazonium chemistry.\n• Starting material (ArNH₂) made by nitration + reduction.\n• This allows making many substituted arenes with precise regiochemistry.\n• Azo dye synthesis also uses diazonium coupling."},
    {q:"Why are aromatic amines (e.g. aniline) considered hazardous?", a:"Many aromatic amines are carcinogens (cause cancer) — they can be absorbed through the skin or by inhalation.\nAniline is highly toxic: absorbed dermally → converted to metabolites that damage DNA.\nSome azo dyes derived from certain aromatic amines are also carcinogenic (certain azo dyes banned in textiles).\nPrecautions: use in fume cupboard; wear gloves, lab coat, goggles; avoid skin contact."},
    {q:"Describe the basicity of amines quantitatively using Kb and pKb.", a:"Kb = [RNH₃⁺][OH⁻] / [RNH₂]\npKb = −log Kb\nLarger Kb (smaller pKb) = stronger base (more OH⁻ produced).\nMethylamine: pKb ≈ 3.4 (relatively strong base)\nNH₃: pKb ≈ 4.7\nAniline: pKb ≈ 9.4 (very weak base)\nRelationship: pKa(conjugate acid) + pKb = pKw = 14 (at 25°C)"},
  ]},

  "ocr_6.2.1": { title: "Carbonyl Compounds", cards: [
    {q:"Distinguish aldehydes from ketones in structure and nomenclature.", a:"Aldehyde: C=O at the end of the carbon chain; H on the carbonyl carbon; suffix -al.\nExamples: methanal (HCHO), ethanal (CH₃CHO), propanal (CH₃CH₂CHO).\nKetone: C=O within the chain; two carbon substituents on carbonyl C; suffix -one.\nExamples: propanone (CH₃COCH₃), butanone (CH₃COC₂H₅).\nBoth have polar C=O group (Cδ+—Oδ−)."},
    {q:"Explain the general mechanism for nucleophilic addition to the C=O group.", a:"The carbonyl carbon (C) is δ+ due to the electronegative O → electrophilic centre.\nMechanism (nucleophilic addition):\n1. Nucleophile (Nu⁻) attacks the δ+ carbonyl carbon from below/above plane.\n2. C=O π bond breaks; O becomes O⁻ (tetrahedral intermediate).\n3. O⁻ accepts H⁺ (from solvent or acid) → forms −OH group.\nResult: addition product with new bond to nucleophile."},
    {q:"Describe the addition of HCN to a carbonyl compound and its synthetic use.", a:"Carbonyl compound + HCN (or NaCN + dilute HCl) → hydroxynitrile (cyanohydrin)\nCH₃CHO + HCN → CH₃CH(OH)CN (2-hydroxypropanenitrile)\nMechanism: CN⁻ attacks δ+ C → alkoxide intermediate → H⁺ from HCN protonates O−.\nNew chiral centre formed → racemic mixture produced.\nSynthetic use: extends carbon chain by 1C; can be hydrolysed to hydroxy carboxylic acid."},
    {q:"Describe the reduction of aldehydes and ketones using NaBH₄.", a:"Reagent: NaBH₄ (sodium tetrahydridoborate) dissolved in methanol or water.\nAldehyde → primary alcohol: RCHO + 2[H] → RCH₂OH\nKetone → secondary alcohol: RCOR' + 2[H] → RCH(OH)R'\nMechanism: H⁻ (hydride) from BH₄⁻ acts as nucleophile, attacks carbonyl C.\nMild conditions — does not reduce C=C, carboxylic acids, or esters."},
    {q:"Describe the 2,4-DNPH (Brady's reagent) test for carbonyl compounds.", a:"Add a few drops of 2,4-dinitrophenylhydrazine (2,4-DNPH) in acidified ethanol to the compound.\nPositive result: orange or yellow crystalline precipitate forms (2,4-DNP derivative).\nConfirms presence of an aldehyde OR ketone (C=O group).\nTo identify the specific compound: filter, dry, and measure the melting point of the precipitate; compare to known values in tables."},
    {q:"Describe the Tollens' reagent test (silver mirror test) for aldehydes.", a:"Reagent: ammoniacal silver nitrate solution [Ag(NH₃)₂]⁺(aq).\nAldehyde (reducing): reduces Ag⁺ to Ag metal → silver mirror on inside of test tube.\nRCHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → RCOO⁻ + 2Ag(s) + 4NH₃ + H₂O\nKetone: no reaction (cannot be oxidised under mild conditions).\nDistinguishes aldehydes from ketones."},
    {q:"Describe the Fehling's/Benedict's solution test for aldehydes.", a:"Reagent: Fehling's or Benedict's solution (blue Cu²⁺ complex in alkaline solution).\nAldehyde: reduces Cu²⁺ to Cu₂O → brick-red precipitate on warming.\nKetone: no reaction.\nGlucose (an aldehyde sugar) gives positive result → used clinically to test for glucose in urine.\nDistinguishes aliphatic aldehydes from ketones; aromatic aldehydes may not always react."},
    {q:"Describe the iodoform reaction and which compounds give a positive result.", a:"Reagent: I₂ + NaOH (aq) (or KI + I₂ → iodine in NaOH).\nPositive result: yellow crystalline precipitate of CHI₃ (iodoform/triiodomethane) with antiseptic smell.\nGive positive result: CH₃COR (methyl ketones), CH₃CHO (ethanal), CH₃CH(OH)R (secondary alcohols with methyl group adjacent to CHOH), ethanol (CH₃CH₂OH).\nDoes NOT react: propanal (CH₃CH₂CHO — no methyl adjacent to C=O), most other aldehydes."},
    {q:"How are aldehydes and ketones distinguished by oxidation?", a:"Oxidation with acidified K₂Cr₂O₇ or KMnO₄:\nAldehyde (RCHO): readily oxidised to carboxylic acid (RCOOH); orange → green colour change with Cr₂O₇²⁻.\nKetone (RCOR'): NOT oxidised by mild oxidising agents.\nAlso: Tollens' and Fehling's only react with aldehydes (weaker oxidants)\nFor positional determination: 2,4-DNPH confirms C=O; Tollens'/Fehling's confirm aldehyde."},
    {q:"Describe the nucleophilic addition mechanism for the reaction of CN⁻ with ethanal.", a:"Step 1: CN⁻ (nucleophile) attacks the δ+ carbon of C=O in CH₃CHO.\nStep 2: C=O π bond breaks; O becomes O⁻; tetrahedral intermediate forms (CH₃CH(CN)O⁻).\nStep 3: O⁻ picks up H⁺ from HCN (or from water) → hydroxynitrile CH₃CH(OH)CN.\nNote: a new chiral centre is created at the α-carbon → both enantiomers form → racemic mixture.\nHCN is highly toxic (volatile, easily inhaled); use NaCN + dilute acid for safety."},
    {q:"What is the significance of forming a racemic mixture in nucleophilic addition to carbonyl compounds?", a:"When a nucleophile attacks a planar carbonyl group, it can approach from either face (above or below the C=O plane) with equal probability.\nBoth approaches give enantiomeric products.\nResult: racemic mixture (50:50 mixture of both enantiomers).\nImportance in pharmacy: two enantiomers of a drug often have very different biological activities (e.g. thalidomide); racemic mixtures of drugs require resolution or asymmetric synthesis."},
    {q:"How is a carbonyl compound identified using 2,4-DNPH and melting point?", a:"1. Add 2,4-DNPH reagent → orange/yellow precipitate forms (confirms C=O group).\n2. Filter and wash the precipitate.\n3. Recrystallise from ethanol to obtain pure crystalline derivative.\n4. Dry the crystals; measure melting point accurately.\n5. Compare measured melting point with tabulated data for 2,4-DNP derivatives.\n6. If melting point matches a known compound — positive identification.\nThis combines qualitative test with quantitative confirmation."},
    {q:"Describe the physical properties of aldehydes and ketones.", a:"Both have a polar C=O group → permanent dipole-dipole forces between molecules.\nNo O−H group → cannot H-bond with each other (unlike alcohols/carboxylic acids).\nBut can H-bond with water (O in C=O accepts H-bonds from water) → short-chain aldehydes/ketones are miscible with water.\nBoiling points: higher than alkanes of similar Mr (dipole-dipole forces) but lower than alcohols (no OH H-bonding between molecules).\nCarbonyl group gives characteristic IR absorption at ~1700–1750 cm⁻¹."},
  ]},

  "ocr_6.2.2": { title: "Carboxylic Acids and Esters", cards: [
    {q:"Describe the structure and bonding of carboxylic acids.", a:"Carboxylic acids contain the −COOH group: a carbonyl C=O and a hydroxyl O−H on the same carbon.\nAcidic: RCOOH ⇌ RCOO⁻ + H⁺ (weak acid, partially dissociates).\nH-bonding: carboxylic acids form hydrogen-bonded dimers in non-polar solvents (two H-bonds).\nHigh boiling points (higher than alcohols of similar Mr): dimers effectively double the molecular mass."},
    {q:"Explain how electron-withdrawing groups increase acid strength of carboxylic acids.", a:"Electron-withdrawing groups (e.g. Cl) pull electron density away from the −COOH group.\nThis stabilises the carboxylate anion (RCOO⁻) → equilibrium shifts right → larger Ka → stronger acid.\nExample: Cl₃CCOOH (trichloroethanoic acid, pKa 0.66) >> CH₃COOH (pKa 4.76).\nInductive effect: Cl withdraws electrons through σ bonds → destabilises RCOOH, stabilises RCOO⁻ → more acidic."},
    {q:"Describe the reactions of carboxylic acids: with bases, carbonates, and alcohols.", a:"With NaOH: RCOOH + NaOH → RCOONa + H₂O (sodium salt)\nWith Na₂CO₃: 2RCOOH + Na₂CO₃ → 2RCOONa + H₂O + CO₂↑ (effervescence — distinguishes from phenol)\nWith Na metal: 2RCOOH + 2Na → 2RCOONa + H₂↑\nWith alcohol + H₂SO₄ cat: RCOOH + R'OH ⇌ RCOOR' + H₂O (esterification, reversible, equilibrium)"},
    {q:"Describe the preparation of acyl chlorides and their reactions.", a:"From carboxylic acid: RCOOH + PCl₅ → RCOCl + POCl₃ + HCl; or RCOOH + SOCl₂ → RCOCl + SO₂ + HCl\nReactions (faster than carboxylic acid, irreversible):\nWith H₂O: RCOCl + H₂O → RCOOH + HCl (steamy fumes)\nWith alcohol: RCOCl + R'OH → RCOOR' + HCl (ester, faster than esterification)\nWith NH₃/amine: RCOCl + 2NH₃ → RCONH₂ + NH₄Cl (amide)\nMechanism: nucleophilic addition-elimination (tetrahedral intermediate, then Cl⁻ leaves)."},
    {q:"Describe the mechanism of nucleophilic addition-elimination for acyl chloride + amine.", a:"Step 1 (addition): amine N (nucleophile) attacks δ+ carbonyl C → tetrahedral intermediate.\nStep 2 (elimination): Cl⁻ leaves (C−Cl bond breaks) → C=O reforms.\nResult: amide bond −CONH− formed + HCl released.\nHCl immediately neutralised by excess amine: NH₂R + HCl → NH₃R⁺Cl⁻\nThis mechanism applies to all acyl chloride reactions (with O or N nucleophiles)."},
    {q:"Describe the hydrolysis of esters.", a:"Acid hydrolysis (reversible): RCOOR' + H₂O ⇌ RCOOH + R'OH (dilute H₂SO₄ catalyst, heat)\nBase hydrolysis/saponification (irreversible): RCOOR' + NaOH → RCOONa + R'OH\nIrreversible because carboxylate salt (RCOO⁻) does not react further.\nBase hydrolysis is complete and faster.\nApplication: soap making — fats (triglyceride esters) + NaOH → sodium carboxylate (soap) + glycerol."},
    {q:"Describe the naming and physical properties of esters.", a:"IUPAC name: alkyl alkanoate — alkyl from the alcohol part, alkanoate from the acid part.\nEthyl ethanoate: CH₃COOC₂H₅ (from ethanoic acid + ethanol).\nMethyl propanoate: CH₃CH₂COOCH₃ (from propanoic acid + methanol).\nPhysical properties: pleasant fruity/flowery aromas; volatile (no H-bonding between ester molecules).\nLower boiling points than parent acids; relatively low water solubility (small esters mix with water).\nUsed as solvents, flavourings, perfumes."},
    {q:"Describe the structure and reactions of acid anhydrides.", a:"Acid anhydride: two acyl groups linked by −CO−O−CO− (e.g. ethanoic anhydride (CH₃CO)₂O).\nFormed by: 2RCOOH → RCOOCOR + H₂O (dehydration).\nReactions (less vigorous than acyl chlorides but similar):\nWith H₂O: (CH₃CO)₂O + H₂O → 2CH₃COOH\nWith alcohol: (CH₃CO)₂O + R'OH → CH₃COOR' + CH₃COOH (ester + carboxylic acid)\nWith amine: (CH₃CO)₂O + RNH₂ → CH₃CONHR + CH₃COOH\nAspirin synthesis: salicylic acid + ethanoic anhydride → aspirin + ethanoic acid."},
    {q:"Describe the aspirin synthesis as an example of esterification with an acid anhydride.", a:"Salicylic acid (2-hydroxybenzoic acid) + ethanoic anhydride → aspirin (2-acetoxybenzoic acid) + ethanoic acid.\nReaction: the phenol OH of salicylic acid reacts with ethanoic anhydride (acid anhydride more reactive than acetic acid).\nProduct: aspirin has ester linkage (the phenol OH is esterified).\nWhy anhydride not acetic acid? Reaction is faster; product easier to purify (avoids equilibrium).\nOther COOH group not esterified (different reactivity)."},
    {q:"Describe fats, oils and their hydrolysis (saponification).", a:"Fats/oils: triesters of glycerol (propane-1,2,3-triol) and long-chain fatty acids (triglycerides).\nSaturated fats: long alkyl chains (no C=C) — solid at room temperature (stronger LDFs).\nUnsaturated oils: contain C=C bonds — liquid at room temperature (weaker, more disordered packing).\nHydrolysis with NaOH (saponification): triglyceride + 3NaOH → glycerol + 3 sodium carboxylates (soap).\nSoap action: non-polar tail in grease; polar/ionic head in water → emulsifies grease."},
    {q:"Why do carboxylic acids have higher boiling points than alcohols of similar Mr?", a:"Carboxylic acids form hydrogen-bonded dimers in both liquid and gas phase (two simultaneous H-bonds between pairs of molecules).\nThis effectively doubles the 'apparent Mr' that must be overcome → much higher bp than expected.\nAlso, the COOH group is more polar than OH alone → stronger intermolecular forces.\nExample: propanoic acid (Mr 74, bp 141°C) has a much higher bp than propan-1-ol (Mr 60, bp 97°C), even considering the Mr difference."},
    {q:"How is an ester identified by hydrolysis followed by analysis?", a:"1. Hydrolyse ester with NaOH(aq) (base hydrolysis): RCOOR' + NaOH → RCOONa + R'OH.\n2. Acidify the carboxylate salt (add HCl) → carboxylic acid RCOOH.\n3. Identify carboxylic acid: IR (broad O−H 2500–3300 cm⁻¹, C=O ~1710 cm⁻¹); ¹H NMR; mass spectrum.\n4. Identify alcohol R'OH by IR, NMR, or mass spectrum.\n5. Name the ester from the acid and alcohol identified."},
    {q:"Describe the properties and uses of esters as solvents.", a:"Esters are polar enough to dissolve polar organic compounds but also have non-polar alkyl chains.\nVolatile (low bp, no intermolecular H-bonding) → evaporate readily → good solvents for paints, varnishes, nail polish.\nNon-aqueous → dissolve non-polar substances that water cannot.\nExamples: ethyl ethanoate (nail polish remover, paint solvent), butyl ethanoate (nail polish).\nBiodegradable — less persistent in environment than halogenated solvents."},
    {q:"Compare the reactivity of carboxylic acid, acid anhydride, acyl chloride, and ester towards nucleophiles.", a:"Order of reactivity (fastest to slowest): acyl chloride > acid anhydride > carboxylic acid > ester\nAcyl chloride: Cl is excellent leaving group; most electrophilic C; reacts vigorously with H₂O, alcohols, amines.\nAcid anhydride: weaker leaving group (carboxylate); less vigorous.\nCarboxylic acid: needs activation (catalyst/conditions) — equilibrium (reversible).\nEster: least reactive; requires acid/base catalyst and heat; slowest hydrolysis."},
  ]},

  "ocr_6.3.1": { title: "Polymers and Amino Acids", cards: [
    {q:"Describe addition polymerisation and draw the repeat unit of poly(propene).", a:"Addition polymerisation: alkene monomers join by opening the C=C π bond; no atoms lost.\nnCH₂=CHCH₃ → −(CH₂−CH(CH₃))ₙ−\nRepeat unit of poly(propene): −CH₂−CH(CH₃)− (bracket with bonds extending from each end).\nProperties: non-biodegradable; electrical insulator; chemically inert.\nEnvironmental concern: accumulation in oceans/landfill."},
    {q:"Describe condensation polymerisation and how it differs from addition polymerisation.", a:"Condensation polymerisation: monomers join with loss of a small molecule (usually H₂O or HCl) at each bond formed.\nRequires bifunctional monomers (two reactive functional groups per monomer).\nPolymer backbone contains heteroatoms (O in polyesters, N in polyamides).\nAddition: no atoms lost; monomer = alkene; backbone is all carbon.\nCondensation: atoms lost; monomers have two functional groups; backbone contains O or N."},
    {q:"Describe the formation of polyesters from dicarboxylic acid + diol.", a:"Dicarboxylic acid (e.g. benzene-1,4-dicarboxylic acid) + diol (e.g. ethane-1,2-diol) → polyester + nH₂O.\n−HOOC−R−COOH + HO−R'−OH → −[OOC−R−COO−R']ₙ− + H₂O\nPET (Terylene): from benzene-1,4-dicarboxylic acid + ethane-1,2-diol.\nLinkage: ester bond −COO−\nUses: plastic bottles (PET), fibres (Terylene/Dacron), packaging."},
    {q:"Describe the formation of polyamides from dicarboxylic acid + diamine.", a:"Hexanedioic acid + hexane-1,6-diamine → nylon-6,6 + nH₂O\n−HOOC(CH₂)₄COOH + H₂N(CH₂)₆NH₂ → −[OC(CH₂)₄CO−NH(CH₂)₆NH]ₙ− + H₂O\nLinkage: amide bond −CONH−\nKevlar: aromatic polyamide from benzene-1,4-diamine + benzene-1,4-dicarboxylic acid; very high strength.\nNylon: flexible, strong; uses in clothing, ropes, engineering plastics."},
    {q:"How do you deduce monomers from the repeat unit of a condensation polymer?", a:"For polyesters: find the −COO− link; split here to give acid (−COOH) and alcohol (−OH) ends.\nFor polyamides: find the −CONH− link; split to give acid (−COOH) and amine (−NH₂) ends.\nExample: −[OC(CH₂)₄CO−NH(CH₂)₆NH]ₙ− → HOOC(CH₂)₄COOH (hexanedioic acid) + H₂N(CH₂)₆NH₂ (hexane-1,6-diamine)\nAdd H₂O back to the split points (reverse of condensation)."},
    {q:"Describe the hydrolysis of condensation polymers and compare to addition polymers.", a:"Condensation polymers (polyesters, polyamides): hydrolysed by hot acid or base, breaking ester/amide bonds → monomers regenerated.\nPolyesters + NaOH(aq), heat → diol + sodium dicarboxylate salt.\nPolyamides + HCl(aq) → amino acids or diamine + dicarboxylic acid salts.\nThis makes condensation polymers recyclable/biodegradable (compared to addition polymers).\nAddition polymers: no hydrolysable bonds in backbone → not biodegradable → persistent environmental problem."},
    {q:"Give the general structure of an amino acid and describe chirality.", a:"General structure: NH₂−CH(R)−COOH (α-amino acid)\nα-carbon: central carbon bonded to NH₂, COOH, H, and side chain R.\nChiral if R ≠ H (i.e., all 20 naturally occurring amino acids except glycine are chiral).\nAll naturally occurring amino acids are L-configuration (S at α-carbon, mostly).\nGlycine (R=H): no chirality (α-C has 2×H)."},
    {q:"Describe the zwitterion form of amino acids and isoelectric point.", a:"Zwitterion: amino acids exist as internal salts with both NH₃⁺ and COO⁻ groups simultaneously.\nThis occurs at the isoelectric point (pI): pH at which the molecule has no net charge.\nAcidic solution (low pH): NH₃⁺ and COOH (protonated, net positive charge)\nAlkaline solution (high pH): NH₂ and COO⁻ (deprotonated, net negative charge)\nAt pI: NH₃⁺ and COO⁻ (no net charge, zwitterion)"},
    {q:"Describe peptide bond formation.", a:"Condensation reaction between the COOH of one amino acid and the NH₂ of another:\n−COOH + H₂N− → −CO−NH− + H₂O\nThe bond −CO−NH− is the peptide bond (amide bond in context of amino acids).\nDipeptide: 2 amino acids; tripeptide: 3; polypeptide: many; protein: large polypeptide(s).\nHydrolysis with HCl(aq) or base reverses this → amino acid mixture."},
    {q:"Describe the four levels of protein structure.", a:"Primary: sequence of amino acid residues linked by peptide bonds (1D).\nSecondary: local regular structure — α-helix (H-bonds within one chain between C=O and N−H 4 residues apart) or β-sheet (H-bonds between adjacent chains/segments).\nTertiary: overall 3D shape of whole polypeptide; maintained by H-bonds, ionic bonds, disulfide bridges (−S−S−), hydrophobic interactions (van der Waals).\nQuaternary: two or more polypeptide chains together (e.g. haemoglobin — 4 chains)."},
    {q:"Describe the environmental impact of non-biodegradable addition polymers.", a:"Addition polymers (poly(ethene), PVC, poly(propene)) do not biodegrade in the environment.\nAccumulate in landfill sites, oceans, waterways.\nMicroplastics: fragmentation into tiny particles → ingested by marine life; enter food chain.\nSolutions: recycling (mechanical or chemical), incineration (energy recovery but CO₂/toxic gases), biodegradable alternatives (PLA, starch-based plastics), reducing single-use plastics.\nChemical recycling: hydrolyse condensation polymers back to monomers; addition polymers cracked."},
    {q:"Compare nylon and Kevlar in terms of structure and properties.", a:"Nylon-6,6: aliphatic polyamide (flexible chain); strong H-bonding between amide groups; good tensile strength; flexible → clothing, ropes, carpets.\nKevlar: aromatic polyamide (rigid benzene rings in backbone); extremely rigid chains pack parallel → very strong hydrogen bonds; density of H-bonds very high → exceptional tensile strength (5× stronger than steel by weight).\nKevlar uses: bulletproof vests, lightweight armour, racing car components, cables."},
    {q:"How are amino acids separated and identified by paper chromatography?", a:"Apply mixture of amino acids to chromatography paper as small spot.\nDevelop in appropriate solvent (e.g. butan-1-ol/ethanoic acid/water).\nAmino acids are colourless → spray with ninhydrin; heat → purple spots (Ruhemann's purple).\nCalculate Rf = distance moved / solvent front distance.\nIdentify each amino acid by comparing Rf values to known reference amino acids run in parallel.\nFor complex mixtures: 2D chromatography (two solvents, two directions)."},
    {q:"What is the structural difference between a polyester and a polyamide?", a:"Polyester: repeat linkage is the ester bond −COO− (−C(=O)−O−).\nPolyamide: repeat linkage is the amide bond −CONH− (−C(=O)−NH−).\nBoth are condensation polymers formed with loss of H₂O (or HCl in diacid chloride route).\nPolyamides have stronger H-bonding (N−H…O=C between chains) than polyesters (weaker C−H…O=C).\nResult: polyamides (nylon, Kevlar) generally have higher melting points and better strength than polyesters of similar structure."},
  ]},

  "ocr_6.4.1": { title: "Organic Synthesis and Analysis", cards: [
    {q:"Describe the retrosynthetic approach for planning a multi-step organic synthesis.", a:"Start with target molecule; work backwards (retrosynthesis).\n1. Identify key functional groups in target.\n2. Ask: what reaction could form this group? (e.g. ester ← acid + alcohol; amine ← nitrile reduction).\n3. Draw disconnection ⟹ to show bond broken; identify synthon and synthetic equivalent.\n4. Continue until reaching available starting materials.\n5. Write forward synthesis with reagents, conditions, and expected products for each step.\nCheck: atom economy, yield, safety, practicality."},
    {q:"Summarise key arene synthesis routes via diazonium chemistry.", a:"Benzene → nitrobenzene: HNO₃/H₂SO₄, <55°C\nNitrobenzene → aniline: Sn/conc HCl, reflux; then NaOH\nAniline → diazonium salt: NaNO₂/HCl, 0–5°C\nDiazonium → chlorobenzene: Cu₂Cl₂/HCl (Sandmeyer)\nDiazonium → phenol: H₂O, warm\nDiazonium → azo dye: coupling with phenol/amine in alkaline solution\nDiazonium → nitrile: CuCN; hydrolysis → carboxylic acid"},
    {q:"Describe how to convert an alcohol through multiple steps to an amine.", a:"Step 1: Alcohol → halogenoalkane (HBr/NaBr+H₂SO₄)\nStep 2: Halogenoalkane → nitrile (KCN/ethanol, reflux) [chain +1C]\nStep 3: Nitrile → primary amine (LiAlH₄/dry ether, then careful aqueous workup)\nOR: Alcohol → halogenoalkane → amine directly (excess NH₃, sealed tube, heat)\nThe nitrile route extends the chain; the direct route keeps same number of carbons."},
    {q:"How is a chiral centre created in synthesis and what are the stereochemical consequences?", a:"A chiral centre is created when a nucleophile attacks a planar sp² carbon (carbonyl C, or C of carbocation).\nNucleophile can approach from either face with equal probability → racemic mixture (50:50 enantiomers).\nExamples: CN⁻ addition to aldehyde; NaBH₄ reduction of ketone; Br⁺ addition to alkene.\nIn industry: chiral drugs often need resolution (separation of enantiomers) or asymmetric synthesis (chiral catalyst gives one enantiomer selectively)."},
    {q:"Describe the green chemistry principles relevant to A-level organic synthesis.", a:"1. Atom economy: maximise proportion of reactant atoms in desired product.\n2. Catalysis: use catalysts instead of stoichiometric reagents → less waste.\n3. Renewable feedstocks: use plant-based materials instead of fossil fuels (e.g. bioethanol).\n4. Safer solvents: water preferred; avoid halogenated solvents (toxic, persistent).\n5. Energy efficiency: minimise steps, use room temperature where possible.\n6. Prevent waste rather than treat it.\nMeasured by: atom economy, E-factor (mass waste / mass product)."},
    {q:"Describe how IR spectroscopy is used in organic analysis.", a:"Infrared radiation causes bond vibrations (stretching and bending).\nEach functional group absorbs at characteristic wavenumber (cm⁻¹).\nKey absorptions:\nO−H (alcohol): broad ~3230–3550 cm⁻¹\nO−H (carboxylic acid): very broad ~2500–3300 cm⁻¹\nC=O (carbonyl): sharp ~1700–1750 cm⁻¹\nN−H (amine/amide): ~3300–3500 cm⁻¹\nFingerprint region (<1500 cm⁻¹): unique to each molecule; compare with database.\nUsed to identify functional groups present/absent."},
    {q:"Describe how mass spectrometry (MS) is used for structural determination.", a:"Molecular ion (M⁺ or M+1 for ESI): gives Mr (molecular mass).\nFragmentation: bonds break; fragments detected at lower m/z.\nBase peak: most abundant fragment.\nCommon losses: 15 (CH₃), 29 (CHO or C₂H₅), 31 (CH₂OH), 45 (OEt or COOH).\nIsotope patterns: Cl (M:M+2 = 3:1), Br (M:M+2 = 1:1) — characteristic patterns identify halogens.\nCombined with IR: identify molecular formula and functional groups."},
    {q:"Describe how ¹H NMR data is interpreted for structural determination.", a:"Step 1: Number of peaks = number of distinct H environments.\nStep 2: Integration = relative number of H in each environment.\nStep 3: Chemical shift (δ ppm) = type of environment (e.g. CHO ~9–10, ArH ~7–8, OCH ~3.5–4, CH₂ ~1.2).\nStep 4: Splitting pattern = number of adjacent H (n+1 rule: n adjacent H → n+1 peaks).\nStep 5: D₂O shake — exchangeable H (OH, NH) signals disappear.\nCombine all information to propose structure; check consistency."},
    {q:"Describe how ¹³C NMR gives structural information.", a:"Each chemically distinct carbon gives one peak.\nNumber of peaks = number of different C environments in the molecule.\nChemical shift indicates type of C environment (similar ranges to ¹H but ×10–20 ppm).\nC=O carbons appear at ~160–220 ppm; aromatic C ~110–160 ppm; alkyl C ~0–50 ppm.\nIntegration NOT routinely used in ¹³C NMR (peak heights not proportional to number of C).\nKey use: counting distinct C environments and identifying functional groups."},
    {q:"Describe how degrees of unsaturation (DoU) helps in structure determination.", a:"DoU = (2C + 2 + N − H − X) / 2\nDoU = 1: one ring OR one double bond.\nDoU = 4: benzene ring (1 ring + 3 double bonds) OR other combination.\nDoU = 0: fully saturated, no rings.\nUse: if Mr and molecular formula known, calculate DoU → narrows structural possibilities.\nExample: C₆H₅Cl → DoU = (12+2−5−1)/2 = 4 → likely benzene derivative (4 DoU for benzene ring)."},
    {q:"Describe a complete analytical strategy for identifying an unknown organic compound.", a:"1. Elemental analysis: combustion → % C, H, N, O → empirical formula.\n2. Mass spectrometry: Mr from molecular ion → molecular formula.\n3. Calculate degrees of unsaturation → ring/double bond information.\n4. Infrared spectroscopy: identify functional groups from key absorptions.\n5. ¹H NMR: number of environments, integration, splitting, chemical shifts.\n6. ¹³C NMR: number of distinct C environments.\n7. Chemical tests: 2,4-DNPH (carbonyl), Tollens' (aldehyde), iodoform (methyl ketone/ethanol).\n8. Combine all data to propose and confirm structure."},
  ]},

  "ocr_6.5.1": { title: "NMR Spectroscopy", cards: [
    {q:"Explain the principle of NMR spectroscopy.", a:"Nuclei with odd atomic number or mass number have spin (e.g. ¹H, ¹³C, ³¹P, ¹⁹F).\nIn a magnetic field, these nuclei align parallel or antiparallel to the field (two energy states).\nRadiofrequency radiation flips nuclei between states; resonance absorption at a specific frequency.\nThe exact frequency depends on the chemical environment of the nucleus.\n¹H and ¹³C NMR are most commonly used in structure determination."},
    {q:"What is TMS and why is it used as the reference standard?", a:"TMS = tetramethylsilane, Si(CH₃)₄.\nUsed as δ = 0 reference because:\n1. All 12 H atoms are equivalent → single, sharp peak.\n2. Highly shielded (Si is less electronegative than C) → peak at most upfield position (δ = 0).\n3. Chemically inert and non-toxic.\n4. Volatile (bp 27°C) → easily removed after spectrum.\n5. Does not overlap with most organic compound peaks (which appear at δ > 0)."},
    {q:"Explain chemical shift and what causes differences between environments.", a:"Chemical shift δ (ppm): position of a peak relative to TMS (δ = 0) on the NMR scale.\nDifferences arise from electron shielding:\nElectron-rich environments: electrons shield the nucleus from the external field → more shielded → lower δ (upfield, near TMS).\nElectron-poor environments: nearby electronegative atoms withdraw electrons → deshielded → higher δ (downfield).\nHigh δ = deshielded: CHO (~9–10), ArH (~7–8), OCH (~3.5–4).\nLow δ = shielded: CH₃ in alkane (~0.9), CH₂ (~1.2)."},
    {q:"Give the approximate ¹H NMR chemical shift ranges for common environments.", a:"CH₃ (alkane): 0.7–1.0 ppm\nCH₂ (alkyl): 1.2–1.4 ppm\nC−CH₂−C=O or allylic: 2.0–2.5 ppm\nOCH₃ or OCH₂: 3.3–4.0 ppm\nVinyl (C=CH): 4.5–6.5 ppm\nArH (benzene ring): 6.5–8.0 ppm\nCHO (aldehyde): 9.5–10.0 ppm\nCOOH: 10–12 ppm\nOH (alcohol, variable): 1–5 ppm\nNH (amine, variable): 1–5 ppm"},
    {q:"Explain spin-spin coupling and the n+1 rule.", a:"Coupling: non-equivalent H on adjacent carbons cause each other's peaks to split.\nn+1 rule: if a proton has n equivalent neighbouring H (on adjacent carbons), its signal splits into n+1 peaks.\nSinglet (n=0): 1 peak\nDoublet (n=1): 2 peaks\nTriplet (n=2): 3 peaks\nQuartet (n=3): 4 peaks\nCoupling constant J (Hz): distance between lines in a multiplet; same for both coupled groups."},
    {q:"Interpret the ¹H NMR spectrum of ethanol (CH₃CH₂OH).", a:"CH₃ group: 3H, triplet (split by adjacent CH₂ with 2H: n+1=3), δ ~1.2 ppm.\nCH₂ group: 2H, quartet (split by adjacent CH₃ with 3H: n+1=4), δ ~3.7 ppm.\nOH group: 1H, singlet (OH is exchangeable; coupling to CH₂ not always observed), δ ~2–5 ppm (variable).\nRatio of integration: 3:2:1.\nAdding D₂O: OH peak disappears (H exchanged for D)."},
    {q:"How are exchangeable protons (OH, NH) identified in ¹H NMR?", a:"Add D₂O to the sample and re-run the spectrum (D₂O shake).\nExchangeable H (O−H and N−H) are replaced by D → their ¹H NMR peaks disappear.\nNon-exchangeable C−H peaks are unaffected.\nThis confirms which signals correspond to OH or NH groups.\nExchangeable protons often appear as broad peaks at variable chemical shifts (affected by concentration, temperature, solvent, hydrogen bonding)."},
    {q:"Describe ¹³C NMR and how it differs from ¹H NMR.", a:"¹³C NMR: each peak corresponds to one type (environment) of carbon.\nNumber of peaks = number of distinct C environments (symmetry reduces number of peaks).\nBroader range: δ 0–220 ppm.\nKey regions: alkyl C (0–50 ppm), C−O/C−N (50–90 ppm), aromatic/alkene C (110–160 ppm), C=O (160–220 ppm).\nIntegration is NOT proportional to number of C atoms (unlike ¹H NMR).\nUseful for counting distinct C environments and identifying C=O/aromatic groups."},
    {q:"How do you use ¹H NMR to distinguish between propan-1-ol and propan-2-ol?", a:"Propan-1-ol (CH₃CH₂CH₂OH):\n3 distinct environments: CH₃ (triplet, δ~0.9), CH₂ (sextet, δ~1.5), CH₂OH (triplet, δ~3.6), OH (singlet).\nPropan-2-ol ((CH₃)₂CHOH):\n2 distinct H environments (excluding OH): 2×CH₃ (doublet, δ~1.2, 6H), CH (septet, δ~4.0, 1H), OH.\nPropan-2-ol shows septet (from CH split by 6 adjacent H from 2×CH₃) — distinct from propan-1-ol."},
    {q:"How can ¹H NMR spectroscopy be used to determine the number of different proton environments in a molecule?", a:"Count the number of distinct peaks in the NMR spectrum (ignoring splitting patterns).\nEach distinct peak (or multiplet) = one type of H environment.\nSymmetry reduces apparent number of environments: e.g. benzene has 6H but all equivalent → 1 peak.\nFor 1,4-disubstituted benzene: H₂ and H₃ are equivalent pairs → 2 environments → 2 peaks.\nIntegration of each signal gives the ratio of H in each environment."},
    {q:"Explain the effect of electronegative groups on chemical shift.", a:"Electronegative groups (O, Cl, Br, N) withdraw electrons from adjacent H through inductive effect.\nH near electronegative group: deshielded → higher chemical shift (downfield).\nH farther from electronegative group: more shielded → lower δ.\nExample: CH₃Br (δ ~2.7) vs CH₃CH₃ (δ ~0.9) — Br deshields α-protons.\nC=O group (π system + electronegativity): aldehyde H very deshielded → δ ~9.5–10 ppm."},
    {q:"How is the ¹H NMR spectrum of ethyl ethanoate (CH₃COOC₂H₅) interpreted?", a:"Three environments:\n1. CH₃CO (ester CH₃): singlet, 3H, δ ~2.0 ppm (adjacent to C=O, no neighbouring H on adjacent C).\n2. OCH₂ (ester CH₂): quartet (split by 3 H of CH₃), 2H, δ ~4.1 ppm (deshielded by O).\n3. OCH₂CH₃: triplet (split by 2H of CH₂), 3H, δ ~1.3 ppm.\nRatio: 3:2:3\nKey indicator of ester: quartet (~4.1) + triplet (~1.3) for ethyl group; singlet (~2.0) for acetyl."},
    {q:"What is a coupling constant (J value) and what does it indicate?", a:"Coupling constant J (Hz): the separation between adjacent lines in a multiplet, measured in Hz.\nJ is the same for both coupled groups (mutual coupling).\nTypical values: vicinal coupling (³J, H on adjacent C): 6–8 Hz; geminal coupling (²J, same C): 0–3 Hz; aromatic coupling: 6–9 Hz.\nLarger J: greater coupling (closer in space, more overlap of orbitals).\nJ does not change with spectrometer frequency (unlike δ in Hz) → expressed in Hz, not ppm."},
    {q:"Describe how to determine molecular formula from NMR, MS, and combustion data combined.", a:"1. Combustion analysis → empirical formula (from % C, H, N).\n2. Mass spectrometry → Mr from molecular ion → molecular formula (n × empirical formula).\n3. ¹H NMR → number of H environments, integration, coupling → structural fragments.\n4. ¹³C NMR → number of C environments, chemical shifts → C types (alkyl, aromatic, C=O).\n5. IR → functional groups (C=O, O−H, N−H).\n6. Degrees of unsaturation → rings/double bonds.\n7. Combine all: propose structure; check all spectra are consistent with proposed structure."},
  ]},

  "ocr_6.5.2": { title: "Chromatography", cards: [
    {q:"State the general principle of chromatography.", a:"All chromatography separates mixtures based on the differential distribution of components between:\n• Stationary phase (does not move)\n• Mobile phase (moves through the stationary phase)\nComponents that interact more strongly with the stationary phase move slowly; those that interact more with the mobile phase move quickly.\nSeparation efficiency depends on the difference in interaction strengths."},
    {q:"Define Rf value and describe how it is calculated and used.", a:"Rf = distance moved by compound / distance moved by solvent front\n(always 0 < Rf < 1; dimensionless)\nRf values are reproducible under identical conditions (same stationary phase, solvent, temperature).\nUse: identify unknown compounds by comparing Rf with known reference compounds run under identical conditions.\nCo-spotting: spot unknown + reference + mixture; if mixture gives single spot at same Rf → same compound."},
    {q:"Describe thin layer chromatography (TLC) in detail.", a:"Stationary phase: silica gel (SiO₂) or alumina coated on glass, aluminium, or plastic plate.\nMobile phase: organic solvent or mixture.\nProcedure: spot sample, develop in sealed chamber (solvent-saturated atmosphere), remove, mark solvent front.\nVisualisation: UV lamp (fluorescent plate → dark spots) or iodine vapour or specific spray reagents.\nMore polar compound: lower Rf (adsorbs more to polar silica).\nMore polar solvent: higher Rf for all compounds."},
    {q:"How is TLC used to monitor the progress of a reaction?", a:"Take samples of reaction mixture at different times; spot each on TLC plate alongside starting material and expected product reference.\nDevelop and visualise.\nProgress indicators:\n• Starting material spot diminishes (less starting material remaining).\n• New spot appears at product's Rf.\n• When only product spot visible → reaction complete.\nAdditionally: co-spot product reference with reaction mixture — single spot confirms product identity."},
    {q:"Describe column chromatography and how it achieves separation.", a:"Column packed with silica (stationary phase); solvent (eluent, mobile phase) flows through under gravity or pressure.\nMixture loaded at top of column.\nComponents elute at different rates depending on affinity for silica vs solvent.\nLess polar compounds: elute first (weaker interaction with polar silica).\nMore polar compounds: elute later.\nCollect fractions as they elute; analyse by TLC to identify pure fractions.\nPreparative scale: can isolate grams of pure compound."},
    {q:"Describe gas chromatography (GC) and its applications.", a:"Stationary phase: high-boiling liquid coated on solid support inside a long thin column (in an oven).\nMobile phase: inert carrier gas (N₂ or He).\nSample is injected, vaporised, and carried through column.\nSeparation based on: boiling point (lower bp → elutes earlier) AND interaction with stationary phase.\nDetector: flame ionisation detector (FID) or mass spectrometer (GC-MS).\nRetention time: time from injection to peak; characteristic for each compound under given conditions.\nUsed for: analysis of volatile organic compounds, forensics, food flavours, environmental monitoring."},
    {q:"Describe GC-MS (gas chromatography-mass spectrometry) and its advantages.", a:"GC separates components; each separated component enters the mass spectrometer.\nMS: each component is ionised and fragmented; mass spectrum obtained.\nIdentification: retention time (GC) + mass spectrum fragmentation pattern (MS database match).\nAdvantages:\n• Combines separation (GC) with definitive identification (MS).\n• Very sensitive (ppb level).\n• Rapid analysis of complex mixtures.\n• Used in forensics, drug testing, environmental analysis, food quality control."},
    {q:"Describe HPLC (high-performance liquid chromatography).", a:"HPLC: high pressure pumps solvent (mobile phase) through a column of very fine silica particles (stationary phase).\nHigh resolution and sensitivity.\nUsed for: non-volatile or thermally unstable compounds (cannot be analysed by GC).\nApplications: pharmaceutical analysis (drug purity, blood levels), protein analysis, environmental water testing.\nDetectors: UV/visible absorbance, fluorescence, mass spectrometer.\nNormal phase: polar stationary phase, non-polar mobile phase (like TLC).\nReverse phase HPLC: non-polar stationary phase (C18), polar mobile phase (water/methanol) — most common."},
    {q:"Explain how polarity affects separation in TLC on a silica plate.", a:"Silica is a polar stationary phase.\nHighly polar compounds: strong interaction with silica (adsorb strongly) → move slowly → low Rf.\nNon-polar compounds: weak interaction with silica → move quickly → high Rf.\nMore polar solvent (mobile phase): competes more effectively with compounds for silica sites → all compounds move further → higher Rf values for all.\nOptimise separation by choosing solvent polarity so compounds separate (Rf between 0.2 and 0.8 ideally)."},
    {q:"Describe how amino acids are detected in paper chromatography.", a:"Amino acids are colourless and cannot be seen under UV.\nDetection: spray the dry chromatogram with ninhydrin solution; heat at 100°C.\nNinhydrin reacts with primary amine groups of amino acids → purple colour (Ruhemann's purple).\nProline (secondary amine) → yellow colour.\nEach amino acid gives a spot at a characteristic Rf value.\nUsed to: identify amino acid composition of a protein hydrolysate; detect amino acids in body fluids (diagnosis of metabolic disorders)."},
    {q:"What is the retention factor and retention time in chromatography?", a:"Retention factor (Rf): in TLC/paper chromatography = distance compound / distance solvent front. Dimensionless, 0–1.\nRetention time (tR): in GC/HPLC = time from injection to peak maximum at detector.\nRetention time is characteristic of a compound under fixed conditions (column, temperature, solvent flow rate).\nLonger retention time: compound interacts more strongly with stationary phase and/or has higher boiling point (GC).\nUsed for identification by comparison with retention times of standards."},
    {q:"Why must the TLC developing chamber be sealed and solvent-saturated?", a:"If the chamber is open or not saturated with solvent vapour:\n• Solvent evaporates from the TLC plate as it rises.\n• Evaporation causes uneven migration → distorted/smeared spots.\n• Rf values become unreliable and non-reproducible.\nSealing and saturating the atmosphere (by placing solvent-soaked filter paper in chamber) ensures:\n• Uniform solvent migration.\n• Reproducible Rf values.\n• Reliable separation."},
    {q:"Compare the stationary and mobile phases in TLC, column chromatography, GC, and HPLC.", a:"TLC:\nStationary: silica/alumina on plate\nMobile: organic solvent\n\nColumn chromatography:\nStationary: silica in column\nMobile: organic solvent (liquid)\n\nGC:\nStationary: liquid film on solid support in column\nMobile: inert gas (N₂/He)\n\nHPLC:\nStationary: fine silica (or C18 for reverse phase) under pressure\nMobile: solvent pumped at high pressure\n\nKey: all exploit differential affinity for stationary vs mobile phase."},
  ]},
};

const GROUP_SMILES = {
  // Aliphatic carbon frameworks
  "Alkane":              "CCCC",           // butane
  "Alkene":              "CC=CC",          // but-2-ene
  "Dihalide":            "BrCCBr",         // 1,2-dibromoethane
  "Addition Polymer":    "CCCCCC",         // hexane fragment represents polymer chain
  // Halogenoalkanes
  "Halogenoalkane":      "CCBr",           // bromoethane
  // Alcohols
  "Alcohol":             "CCO",            // ethanol (generic)
  "Primary Alcohol":     "CCO",            // ethanol
  "Secondary Alcohol":   "CC(O)C",         // propan-2-ol
  // Diol
  "Diol":                "OCCO",           // ethane-1,2-diol
  // Carbonyl compounds
  "Aldehyde":            "CC=O",           // ethanal (CH3CHO)
  "Ketone":              "CC(=O)C",        // propanone
  "Hydroxynitrile":      "CC(O)C#N",       // 2-hydroxypropanenitrile
  // Carboxylic acid derivatives
  "Carboxylic Acid":     "CC(=O)O",        // ethanoic acid
  "Carboxylic Acid + Alcohol": "CC(=O)O",  // show acid component
  "Acyl Chloride":       "CC(=O)Cl",       // ethanoyl chloride
  "Ester":               "CC(=O)OCC",      // ethyl ethanoate
  "Amide":               "CC(=O)N",        // ethanamide
  "Primary Amide":       "CC(=O)N",        // ethanamide
  "N-substituted Amide": "CC(=O)NCC",      // N-ethylethanamide
  // Salts
  "Carboxylate Salt":         "CC(=O)[O-]",     // acetate ion
  "Carboxylate Salt + Alcohol": "CC(=O)[O-]",   // show salt component
  "Ammonium Salt":            "CC[NH3+]",       // ethylammonium ion
  // Nitrogen compounds
  "Nitrile":             "CC#N",           // ethanenitrile
  "Amine":               "CCN",            // ethylamine (generic)
  "Primary Amine":       "CCN",            // ethylamine
  "Ether":               "CCOCC",          // diethyl ether
  // Aromatic compounds
  "Arene":               "c1ccccc1",                     // benzene
  "Nitrobenzene":        "O=[N+]([O-])c1ccccc1",         // nitrobenzene
  "Halogenobenzene":     "Clc1ccccc1",                   // chlorobenzene
  "Alkylbenzene":        "Cc1ccccc1",                    // methylbenzene (toluene)
  "Phenyl Ketone (Aryl Ketone)": "CC(=O)c1ccccc1",       // acetophenone
  "Phenol":              "Oc1ccccc1",                    // phenol
  "Arylamine":           "Nc1ccccc1",                    // aniline
  "Arylamine (Aniline)": "Nc1ccccc1",                    // aniline (alternate label)
  "Diazonium Salt":      "c1ccc([N+]#N)cc1",             // benzenediazonium (N+ on ring carbon)
  "Azo Dye":             "c1ccc(/N=N/c2ccccc2)cc1",      // (E)-azobenzene
};

const CALC_SETS = [
  {
    id: "calc_moles", title: "Moles & Amount of Substance", color: "#29ABE2", board: "both",
    questions: [
      { q: "Calculate the number of moles in 5.6 g of iron (Fe).", hint: "Use n = m/M. Mr of Fe = 56 g mol⁻¹.", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Mr of Fe = 56 g mol⁻¹", "n = m ÷ M = 5.6 ÷ 56", "n = 0.10 mol"] },
      { q: "How many moles are in 2.20 g of carbon dioxide (CO₂)?", hint: "Calculate Mr of CO₂ first: C=12, O=16.", answer: 0.05, unit: "mol", tolerance: 0.003, steps: ["Mr of CO₂ = 12 + (2×16) = 44 g mol⁻¹", "n = m ÷ M = 2.20 ÷ 44", "n = 0.050 mol"] },
      { q: "What mass of sodium hydroxide (NaOH) contains 0.25 mol? (Mr NaOH = 40)", hint: "Rearrange n = m/M to give m = n × M.", answer: 10, unit: "g", tolerance: 0.1, steps: ["m = n × M", "m = 0.25 × 40", "m = 10 g"] },
      { q: "Calculate the concentration (mol dm⁻³) of a solution containing 0.050 mol of HCl in 250 cm³ of solution.", hint: "Convert cm³ to dm³ first: divide by 1000.", answer: 0.2, unit: "mol dm⁻³", tolerance: 0.01, steps: ["V = 250 cm³ = 0.250 dm³", "c = n ÷ V = 0.050 ÷ 0.250", "c = 0.20 mol dm⁻³"] },
      { q: "How many moles of gas occupy 6.0 dm³ at RTP? (Molar volume at RTP = 24.0 dm³ mol⁻¹)", hint: "n = V ÷ molar volume", answer: 0.25, unit: "mol", tolerance: 0.01, steps: ["n = V ÷ Vm = 6.0 ÷ 24.0", "n = 0.25 mol"] },
      { q: "Calculate the volume (dm³) occupied by 0.40 mol of gas at RTP. (Molar volume = 24.0 dm³ mol⁻¹)", hint: "V = n × molar volume", answer: 9.6, unit: "dm³", tolerance: 0.05, steps: ["V = n × Vm = 0.40 × 24.0", "V = 9.6 dm³"] },
      { q: "Using PV = nRT, calculate the pressure (Pa) exerted by 0.10 mol of gas in a 2.0 dm³ container at 300 K. (R = 8.314 J mol⁻¹ K⁻¹)", hint: "Rearrange PV=nRT for P. Convert V to m³ (÷1000).", answer: 124710, unit: "Pa", tolerance: 500, steps: ["V = 2.0 dm³ = 0.0020 m³", "P = nRT ÷ V", "P = (0.10 × 8.314 × 300) ÷ 0.0020", "P = 249.42 ÷ 0.0020 = 124 710 Pa"] },
      { q: "Calculate the % atom economy for making ethanol (Mr = 46) by hydration of ethene: C₂H₄ + H₂O → C₂H₅OH. (Mr C₂H₄ = 28, Mr H₂O = 18)", hint: "Atom economy = (Mr desired product ÷ sum of Mr all reactants) × 100", answer: 100, unit: "%", tolerance: 1, steps: ["Sum of Mr of reactants = 28 + 18 = 46", "Desired product Mr = 46", "Atom economy = (46 ÷ 46) × 100 = 100%", "This is a 100% atom economy reaction — all atoms end up in the product."] },
      { q: "A reaction produces 4.2 g of product. The theoretical yield was 6.0 g. Calculate the % yield.", hint: "% yield = (actual ÷ theoretical) × 100", answer: 70, unit: "%", tolerance: 0.5, steps: ["% yield = (actual yield ÷ theoretical yield) × 100", "% yield = (4.2 ÷ 6.0) × 100", "% yield = 70%"] },
    ]
  },
  {
    id: "calc_formula", title: "Empirical & Molecular Formula", color: "#0090cc", board: "both",
    questions: [
      { q: "A compound contains 40.0% C, 6.7% H and 53.3% O by mass. Find its empirical formula. (Give the formula as e.g. CH2O)", hint: "Divide each % by its Ar to get mole ratios, then simplify.", answer: "CH2O", unit: "", tolerance: 0, isText: true, steps: ["C: 40.0÷12 = 3.33 mol", "H: 6.7÷1 = 6.7 mol", "O: 53.3÷16 = 3.33 mol", "Ratio C:H:O = 3.33:6.7:3.33 → divide by 3.33 → 1:2:1", "Empirical formula = CH₂O"] },
      { q: "The empirical formula of a compound is CH₂ and its Mr is 56. What is the molecular formula? (Type as e.g. C4H8)", hint: "Find the empirical formula mass, then divide Mr by it to get n.", answer: "C4H8", unit: "", tolerance: 0, isText: true, steps: ["Empirical formula mass of CH₂ = 12 + 2 = 14", "n = Mr ÷ empirical formula mass = 56 ÷ 14 = 4", "Molecular formula = C₄H₈"] },
      { q: "0.92 g of an alcohol burns completely to give 1.76 g CO₂ and 1.08 g H₂O. Find the empirical formula. (Type as e.g. C2H6O)", hint: "Find moles of C from CO₂ (Mr=44), H from H₂O (Mr=18), then O by subtraction.", answer: "C2H6O", unit: "", tolerance: 0, isText: true, steps: ["mol CO₂ = 1.76÷44 = 0.040 → mol C = 0.040", "mol H₂O = 1.08÷18 = 0.060 → mol H = 0.120", "Mass of C = 0.040×12 = 0.48 g; mass of H = 0.12×1 = 0.12 g", "Mass of O = 0.92 − 0.48 − 0.12 = 0.32 g → mol O = 0.32÷16 = 0.020", "C:H:O = 0.040:0.120:0.020 → divide by 0.020 → 2:6:1", "Empirical formula = C₂H₆O"] },
      { q: "A compound is 85.7% C and 14.3% H. Its Mr = 42. Find the molecular formula. (Type as e.g. C3H6)", hint: "Find empirical formula first, then use Mr.", answer: "C3H6", unit: "", tolerance: 0, isText: true, steps: ["C: 85.7÷12 = 7.14; H: 14.3÷1 = 14.3", "Ratio = 7.14:14.3 → 1:2 → empirical formula CH₂", "Empirical mass = 14; n = 42÷14 = 3", "Molecular formula = C₃H₆"] },
      { q: "Calculate the Mr of a gas if 0.25 mol occupies 6.0 dm³ at RTP and has a mass of 7.0 g.", hint: "Find moles from volume, then use M = m/n.", answer: 28, unit: "g mol⁻¹", tolerance: 0.5, steps: ["n = V ÷ 24.0 = 6.0 ÷ 24.0 = 0.25 mol", "Mr = m ÷ n = 7.0 ÷ 0.25 = 28 g mol⁻¹", "This corresponds to nitrogen (N₂) or carbon monoxide (CO)."] },
    ]
  },
  {
    id: "calc_titration", title: "Titrations & Volumetric Analysis", color: "#16a97d", board: "both",
    questions: [
      { q: "25.0 cm³ of NaOH is neutralised by 20.0 cm³ of 0.100 mol dm⁻³ HCl. Calculate the concentration of NaOH.", hint: "Find mol HCl first (n=cV), use 1:1 ratio, then c = n/V for NaOH.", answer: 0.08, unit: "mol dm⁻³", tolerance: 0.004, steps: ["mol HCl = c × V = 0.100 × (20.0÷1000) = 0.00200 mol", "NaOH + HCl → NaCl + H₂O (1:1 ratio)", "mol NaOH = 0.00200 mol", "c(NaOH) = n÷V = 0.00200 ÷ (25.0÷1000) = 0.0800 mol dm⁻³"] },
      { q: "What volume (cm³) of 0.200 mol dm⁻³ H₂SO₄ is needed to neutralise 30.0 cm³ of 0.150 mol dm⁻³ NaOH?\n(H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O)", hint: "Find mol NaOH, use stoichiometry (2:1 NaOH:H₂SO₄), then V = n/c.", answer: 11.25, unit: "cm³", tolerance: 0.2, steps: ["mol NaOH = 0.150 × 0.0300 = 0.00450 mol", "From equation: mol H₂SO₄ = 0.00450 ÷ 2 = 0.00225 mol", "V(H₂SO₄) = n÷c = 0.00225 ÷ 0.200 = 0.01125 dm³ = 11.25 cm³"] },
      { q: "A 0.400 g impure sample of Na₂CO₃ is dissolved and titrated with 0.200 mol dm⁻³ HCl. The titre is 34.0 cm³. Calculate the % purity of Na₂CO₃. (Mr Na₂CO₃ = 106; Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂)", hint: "Find mol HCl, use stoichiometry to get mol Na₂CO₃, convert to mass, then % purity.", answer: 90.1, unit: "%", tolerance: 0.5, steps: ["mol HCl = 0.200 × (34.0÷1000) = 0.00680 mol", "mol Na₂CO₃ = 0.00680 ÷ 2 = 0.00340 mol", "mass Na₂CO₃ = 0.00340 × 106 = 0.3604 g", "% purity = (0.3604 ÷ 0.400) × 100 = 90.1%"] },
      { q: "In a back titration, 1.20 g of CaCO₃ (Mr=100) is dissolved in 50.0 cm³ of 0.500 mol dm⁻³ HCl. The excess HCl requires 12.5 cm³ of 0.200 mol dm⁻³ NaOH to neutralise. Calculate the % purity of the CaCO₃ sample. (CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂)", hint: "Find total mol HCl, subtract mol HCl reacted with NaOH to get mol HCl that reacted with CaCO₃.", answer: 93.8, unit: "%", tolerance: 0.5, steps: ["Total mol HCl = 0.500 × 0.0500 = 0.0250 mol", "mol NaOH used = 0.200 × 0.0125 = 0.00250 mol", "mol excess HCl = 0.00250 mol (1:1 ratio)", "mol HCl reacted with CaCO₃ = 0.0250 − 0.00250 = 0.0225 mol", "mol CaCO₃ = 0.0225 ÷ 2 = 0.01125 mol", "mass CaCO₃ = 0.01125 × 100 = 1.125 g", "% purity = (1.125 ÷ 1.20) × 100 = 93.8%"] },
      { q: "A solution of ethanedioic acid (H₂C₂O₄, Mr=90) is prepared by dissolving 1.575 g in 250 cm³. What is its concentration in mol dm⁻³?", hint: "n = m/M, then c = n/V.", answer: 0.07, unit: "mol dm⁻³", tolerance: 0.003, steps: ["n = m ÷ M = 1.575 ÷ 90 = 0.01750 mol", "c = n ÷ V = 0.01750 ÷ 0.250 = 0.0700 mol dm⁻³"] },
    ]
  },
  {
    id: "calc_enthalpy", title: "Enthalpy Changes", color: "#7c3aed", board: "both",
    questions: [
      { q: "50.0 cm³ of 1.00 mol dm⁻³ HCl is mixed with 50.0 cm³ of 1.00 mol dm⁻³ NaOH. The temperature rises by 6.8 °C. Calculate the enthalpy of neutralisation in kJ mol⁻¹. (c = 4.18 J g⁻¹ K⁻¹, density = 1.00 g cm⁻³)", hint: "q = mcΔT for total mass; mol = c×V for HCl or NaOH; ΔH = −q/mol in kJ.", answer: -56.8, unit: "kJ mol⁻¹", tolerance: 1.0, steps: ["Total mass = 50.0 + 50.0 = 100 g", "q = mcΔT = 100 × 4.18 × 6.8 = 2842 J = 2.842 kJ", "mol HCl = 1.00 × 0.0500 = 0.0500 mol", "ΔH = −q ÷ mol = −2.842 ÷ 0.0500 = −56.8 kJ mol⁻¹"] },
      { q: "Using the following data, calculate ΔHr for: C(s) + 2H₂(g) → CH₄(g)\nΔHc°[C(s)] = −394 kJ mol⁻¹\nΔHc°[H₂(g)] = −286 kJ mol⁻¹\nΔHc°[CH₄(g)] = −890 kJ mol⁻¹", hint: "Use Hess's law: ΔHr = ΣΔHc°(reactants) − ΔHc°(product). Note the stoichiometry!", answer: -76, unit: "kJ mol⁻¹", tolerance: 2, steps: ["ΔHr = [ΔHc(C) + 2×ΔHc(H₂)] − ΔHc(CH₄)", "ΔHr = [−394 + 2×(−286)] − (−890)", "ΔHr = [−394 − 572] + 890", "ΔHr = −966 + 890 = −76 kJ mol⁻¹"] },
      { q: "Using mean bond enthalpies, calculate ΔHr for: H₂(g) + Cl₂(g) → 2HCl(g)\nE(H–H) = +436 kJ mol⁻¹; E(Cl–Cl) = +242 kJ mol⁻¹; E(H–Cl) = +431 kJ mol⁻¹", hint: "ΔHr = bonds broken − bonds formed. Breaking H-H and Cl-Cl; forming 2×H-Cl.", answer: -184, unit: "kJ mol⁻¹", tolerance: 2, steps: ["Bonds broken: H–H (+436) + Cl–Cl (+242) = +678 kJ", "Bonds formed: 2 × H–Cl = 2 × (−431) = −862 kJ", "ΔHr = +678 + (−862) = −184 kJ mol⁻¹"] },
      { q: "0.50 g of ethanol (Mr=46) is burned and heats 200 g of water from 20.0°C to 33.4°C. Calculate the enthalpy of combustion in kJ mol⁻¹. (c = 4.18 J g⁻¹ K⁻¹)", hint: "q = mcΔT (use mass of water); mol = m/M; ΔHc = −q/mol × 1000 to convert to kJ mol⁻¹.", answer: -1031, unit: "kJ mol⁻¹", tolerance: 20, steps: ["ΔT = 33.4 − 20.0 = 13.4°C", "q = 200 × 4.18 × 13.4 = 11202 J = 11.20 kJ", "mol ethanol = 0.50 ÷ 46 = 0.01087 mol", "ΔHc = −11.20 ÷ 0.01087 = −1031 kJ mol⁻¹"] },
      { q: "Calculate ΔHf° for ethane C₂H₆(g) using:\nΔHc°[C(graphite)] = −394 kJ mol⁻¹\nΔHc°[H₂(g)] = −286 kJ mol⁻¹\nΔHc°[C₂H₆(g)] = −1560 kJ mol⁻¹\n(Formation reaction: 2C + 3H₂ → C₂H₆)", hint: "ΔHf = [2×ΔHc(C) + 3×ΔHc(H₂)] − ΔHc(C₂H₆)", answer: -86, unit: "kJ mol⁻¹", tolerance: 3, steps: ["ΔHf = [2×(−394) + 3×(−286)] − (−1560)", "ΔHf = [−788 − 858] + 1560", "ΔHf = −1646 + 1560 = −86 kJ mol⁻¹"] },
    ]
  },
  {
    id: "calc_equilibrium", title: "Equilibrium — Kc and Kp", color: "#d97706", board: "both",
    questions: [
      { q: "At equilibrium, [H₂] = 0.30 mol dm⁻³, [I₂] = 0.10 mol dm⁻³, [HI] = 0.60 mol dm⁻³.\nH₂(g) + I₂(g) ⇌ 2HI(g)\nCalculate Kc.", hint: "Kc = [products]^stoich / [reactants]^stoich. Products are raised to the power of their coefficients.", answer: 12, unit: "", tolerance: 0.2, steps: ["Kc = [HI]² ÷ ([H₂][I₂])", "Kc = (0.60)² ÷ (0.30 × 0.10)", "Kc = 0.36 ÷ 0.030 = 12", "Kc has no units here (equal moles of gas each side)."] },
      { q: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), at equilibrium: [N₂] = 0.10, [H₂] = 0.30, [NH₃] = 0.20 mol dm⁻³. Calculate Kc (include units).", hint: "Kc = [NH₃]² ÷ ([N₂][H₂]³). Work out the units separately.", answer: 14.8, unit: "mol⁻² dm⁶", tolerance: 0.5, steps: ["Kc = [NH₃]² ÷ ([N₂] × [H₂]³)", "Kc = (0.20)² ÷ (0.10 × (0.30)³)", "Kc = 0.040 ÷ (0.10 × 0.027) = 0.040 ÷ 0.0027 = 14.8", "Units: mol²dm⁻⁶ ÷ (mol dm⁻³ × mol³dm⁻⁹) = mol⁻²dm⁶"] },
      { q: "In the equilibrium A(g) + B(g) ⇌ C(g), the mole fractions at equilibrium are: χ(A)=0.25, χ(B)=0.25, χ(C)=0.50. Total pressure = 200 kPa. Calculate Kp in kPa⁻¹.", hint: "Find partial pressures (p = χ × P_total), then write Kp expression.", answer: 0.04, unit: "kPa⁻¹", tolerance: 0.003, steps: ["p(A) = 0.25 × 200 = 50 kPa", "p(B) = 0.25 × 200 = 50 kPa", "p(C) = 0.50 × 200 = 100 kPa", "Kp = p(C) ÷ [p(A) × p(B)] = 100 ÷ (50 × 50) = 100 ÷ 2500 = 0.040 kPa⁻¹"] },
      { q: "For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) at equilibrium: p(SO₂) = 10 kPa, p(O₂) = 5 kPa, p(SO₃) = 40 kPa. Calculate Kp.", hint: "Kp = p(SO₃)² ÷ [p(SO₂)² × p(O₂)]", answer: 3.2, unit: "kPa⁻¹", tolerance: 0.1, steps: ["Kp = p(SO₃)² ÷ [p(SO₂)² × p(O₂)]", "Kp = (40)² ÷ [(10)² × 5]", "Kp = 1600 ÷ 500 = 3.2 kPa⁻¹"] },
      { q: "1.0 mol of N₂O₄(g) partially dissociates: N₂O₄(g) ⇌ 2NO₂(g). At equilibrium, the fraction dissociated is 0.40. Total moles at equilibrium = 1.40. If total pressure = 100 kPa, calculate Kp.", hint: "Find moles of each at equilibrium, then mole fractions, then partial pressures.", answer: 76.2, unit: "kPa", tolerance: 1.5, steps: ["Moles N₂O₄ at equil. = 1.0 − 0.40 = 0.60; moles NO₂ = 2×0.40 = 0.80", "Total = 1.40 mol", "χ(N₂O₄) = 0.60÷1.40 = 0.4286; χ(NO₂) = 0.80÷1.40 = 0.5714", "p(N₂O₄) = 0.4286 × 100 = 42.86 kPa; p(NO₂) = 0.5714 × 100 = 57.14 kPa", "Kp = p(NO₂)² ÷ p(N₂O₄) = (57.14)² ÷ 42.86 = 3265 ÷ 42.86 = 76.2 kPa"] },
    ]
  },
  {
    id: "calc_ph", title: "pH and Acids & Bases", color: "#0d8c68", board: "both",
    questions: [
      { q: "Calculate the pH of 0.050 mol dm⁻³ HCl (a strong acid).", hint: "Strong acid fully dissociates: [H⁺] = concentration of acid. pH = −log[H⁺].", answer: 1.30, unit: "", tolerance: 0.02, steps: ["HCl fully dissociates: [H⁺] = 0.050 mol dm⁻³", "pH = −log(0.050)", "pH = −log(5.0 × 10⁻²) = −(log 5.0 + log 10⁻²) = −(0.699 − 2) = 1.30"] },
      { q: "Calculate the pH of 0.020 mol dm⁻³ NaOH.", hint: "Strong base fully dissociates: [OH⁻] = concentration. Use Kw = [H⁺][OH⁻] = 1×10⁻¹⁴.", answer: 12.30, unit: "", tolerance: 0.02, steps: ["[OH⁻] = 0.020 mol dm⁻³", "[H⁺] = Kw ÷ [OH⁻] = 1×10⁻¹⁴ ÷ 0.020 = 5.0×10⁻¹³ mol dm⁻³", "pH = −log(5.0×10⁻¹³) = 12.30"] },
      { q: "Calculate the pH of 0.10 mol dm⁻³ ethanoic acid. Ka = 1.8 × 10⁻⁵ mol dm⁻³.", hint: "For weak acid: [H⁺] = √(Ka × c). Then pH = −log[H⁺].", answer: 2.87, unit: "", tolerance: 0.05, steps: ["[H⁺] = √(Ka × c) = √(1.8×10⁻⁵ × 0.10)", "[H⁺] = √(1.8×10⁻⁶) = 1.342×10⁻³ mol dm⁻³", "pH = −log(1.342×10⁻³) = 2.87"] },
      { q: "A buffer solution contains 0.20 mol dm⁻³ ethanoic acid and 0.10 mol dm⁻³ sodium ethanoate. Ka = 1.8×10⁻⁵ mol dm⁻³. Calculate the pH.", hint: "Use Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])", answer: 4.44, unit: "", tolerance: 0.05, steps: ["pKa = −log(1.8×10⁻⁵) = 4.745", "pH = pKa + log([A⁻]/[HA]) = 4.745 + log(0.10/0.20)", "pH = 4.745 + log(0.5) = 4.745 − 0.301 = 4.44"] },
      { q: "Calculate the pH of water at 50°C where Kw = 5.5 × 10⁻¹⁴.", hint: "At neutral pH, [H⁺] = [OH⁻] = √Kw. Then pH = −log[H⁺].", answer: 6.63, unit: "", tolerance: 0.03, steps: ["[H⁺] = [OH⁻] = √Kw = √(5.5×10⁻¹⁴) = 2.345×10⁻⁷ mol dm⁻³", "pH = −log(2.345×10⁻⁷) = 6.63", "Note: water is still neutral here (equal [H⁺] and [OH⁻]) even though pH < 7."] },
      { q: "What is the pH after adding 10.0 cm³ of 0.100 mol dm⁻³ NaOH to 20.0 cm³ of 0.100 mol dm⁻³ HCl?", hint: "Find moles of each, subtract to find excess, calculate [H⁺] or [OH⁻] in total volume.", answer: 1.48, unit: "", tolerance: 0.03, steps: ["mol HCl = 0.100 × 0.0200 = 0.00200 mol", "mol NaOH = 0.100 × 0.0100 = 0.00100 mol", "Excess HCl = 0.00200 − 0.00100 = 0.00100 mol", "Total volume = 30.0 cm³ = 0.0300 dm³", "[H⁺] = 0.00100 ÷ 0.0300 = 0.03333 mol dm⁻³", "pH = −log(0.03333) = 1.48"] },
    ]
  },
  {
    id: "calc_rates", title: "Rate Equations", color: "#6d28d9", board: "both",
    questions: [
      { q: "The rate equation for a reaction is: rate = k[A][B]². If [A] = 0.20 mol dm⁻³, [B] = 0.30 mol dm⁻³, and k = 5.0 mol⁻² dm⁶ s⁻¹, calculate the rate.", hint: "Substitute directly into rate = k[A][B]².", answer: 0.09, unit: "mol dm⁻³ s⁻¹", tolerance: 0.003, steps: ["rate = k[A][B]²", "rate = 5.0 × 0.20 × (0.30)²", "rate = 5.0 × 0.20 × 0.090 = 0.090 mol dm⁻³ s⁻¹"] },
      { q: "In two experiments: Exp 1: [A]=0.10, rate=2.0×10⁻³. Exp 2: [A]=0.20, rate=4.0×10⁻³ mol dm⁻³ s⁻¹. What is the order with respect to A? (Enter 0, 1, or 2)", hint: "When [A] doubles, how does the rate change? Rate doubles → 1st order.", answer: 1, unit: "", tolerance: 0, steps: ["[A] doubles from 0.10 to 0.20", "Rate doubles from 2.0×10⁻³ to 4.0×10⁻³", "Rate ∝ [A]¹ → first order with respect to A"] },
      { q: "Exp 1: [B]=0.10, rate=1.5×10⁻⁴. Exp 2: [B]=0.30, rate=1.35×10⁻³ mol dm⁻³ s⁻¹. What is the order with respect to B? (Enter 0, 1, or 2)", hint: "[B] triples. Calculate rate ratio: 1.35×10⁻³ ÷ 1.5×10⁻⁴ = 9 = 3². What order gives factor of 9?", answer: 2, unit: "", tolerance: 0, steps: ["[B] increases by factor 3 (0.10→0.30)", "Rate increases by factor 9 (1.5×10⁻⁴ → 1.35×10⁻³)", "3^n = 9 → n = 2", "Second order with respect to B."] },
      { q: "A first-order reaction has a half-life of 120 s. Calculate the rate constant k. (Give answer to 3 s.f.)", hint: "For a first-order reaction: t½ = ln2 ÷ k. Rearrange for k.", answer: 0.00578, unit: "s⁻¹", tolerance: 0.0001, steps: ["t½ = ln2 ÷ k", "k = ln2 ÷ t½ = 0.6931 ÷ 120", "k = 5.78 × 10⁻³ s⁻¹"] },
      { q: "From Arrhenius equation data: ln k = 12.5 at 1/T = 0.0025 K⁻¹, and ln k = 10.0 at 1/T = 0.0030 K⁻¹. Calculate the activation energy in kJ mol⁻¹. (R = 8.314 J mol⁻¹ K⁻¹)", hint: "Gradient = −Ea/R. gradient = Δ(ln k) ÷ Δ(1/T). Then Ea = −gradient × R.", answer: 41.6, unit: "kJ mol⁻¹", tolerance: 1.0, steps: ["Gradient = (12.5 − 10.0) ÷ (0.0025 − 0.0030) = 2.5 ÷ (−0.0005) = −5000 K", "Ea = −gradient × R = 5000 × 8.314 = 41 570 J mol⁻¹ = 41.6 kJ mol⁻¹"] },
    ]
  },
  {
    id: "calc_thermo", title: "Thermodynamics — ΔG & Born-Haber", color: "#b45309", board: "both",
    questions: [
      { q: "Calculate ΔG at 298 K for a reaction where ΔH = −92 kJ mol⁻¹ and ΔS = −199 J K⁻¹ mol⁻¹.", hint: "ΔG = ΔH − TΔS. Make sure units are consistent (convert ΔS to kJ).", answer: -32.7, unit: "kJ mol⁻¹", tolerance: 1.0, steps: ["ΔG = ΔH − TΔS", "ΔS in kJ = −199 ÷ 1000 = −0.199 kJ K⁻¹ mol⁻¹", "ΔG = −92 − (298 × −0.199)", "ΔG = −92 + 59.3 = −32.7 kJ mol⁻¹", "ΔG < 0 → reaction is feasible at 298 K."] },
      { q: "At what temperature (K) does a reaction with ΔH = +60 kJ mol⁻¹ and ΔS = +150 J K⁻¹ mol⁻¹ become feasible?", hint: "Feasible when ΔG = 0: T = ΔH ÷ ΔS. Convert ΔH to J.", answer: 400, unit: "K", tolerance: 5, steps: ["ΔG = 0 when ΔH = TΔS", "T = ΔH ÷ ΔS = 60 000 ÷ 150 = 400 K", "Above 400 K, ΔG < 0 and the reaction is feasible."] },
      { q: "Use the Born-Haber cycle for NaCl to find the lattice enthalpy (ΔHlatt) given:\nΔHf°(NaCl) = −411 kJ mol⁻¹\nΔHat°(Na) = +108 kJ mol⁻¹\nΔHat°(½Cl₂) = +121 kJ mol⁻¹\nIE₁(Na) = +496 kJ mol⁻¹\nEA₁(Cl) = −349 kJ mol⁻¹\n(ΔHlatt = lattice dissociation enthalpy)", hint: "ΔHf = ΔHat(Na) + ΔHat(½Cl₂) + IE₁(Na) + EA₁(Cl) + ΔHlatt. Rearrange for ΔHlatt.", answer: -787, unit: "kJ mol⁻¹", tolerance: 3, steps: ["ΔHf = ΔHat(Na) + ΔHat(½Cl₂) + IE₁(Na) + EA₁(Cl) + ΔHlatt", "−411 = +108 + 121 + 496 + (−349) + ΔHlatt", "−411 = +376 + ΔHlatt", "ΔHlatt = −411 − 376 = −787 kJ mol⁻¹"] },
      { q: "Calculate ΔSsurroundings for a reaction with ΔH = −240 kJ mol⁻¹ at 300 K.", hint: "ΔSsurr = −ΔH ÷ T. Convert ΔH to J.", answer: 800, unit: "J K⁻¹ mol⁻¹", tolerance: 5, steps: ["ΔSsurr = −ΔH ÷ T", "ΔSsurr = −(−240 000) ÷ 300", "ΔSsurr = +240 000 ÷ 300 = +800 J K⁻¹ mol⁻¹"] },
      { q: "For a reaction: ΔH = +50 kJ mol⁻¹, ΔSsystem = +200 J K⁻¹ mol⁻¹. Calculate ΔStotal at 400 K. Is the reaction spontaneous?", hint: "ΔSsurr = −ΔH/T; ΔStotal = ΔSsystem + ΔSsurr.", answer: 75, unit: "J K⁻¹ mol⁻¹", tolerance: 3, steps: ["ΔSsurr = −(+50 000) ÷ 400 = −125 J K⁻¹ mol⁻¹", "ΔStotal = ΔSsystem + ΔSsurr = +200 + (−125) = +75 J K⁻¹ mol⁻¹", "ΔStotal > 0 → reaction is spontaneous at 400 K."] },
    ]
  },
  {
    id: "calc_electrode", title: "Electrode Potentials", color: "#1a6b9a", board: "both",
    questions: [
      { q: "Calculate the standard cell EMF for a cell made from Zn²⁺/Zn (E° = −0.76 V) and Cu²⁺/Cu (E° = +0.34 V).", hint: "E°cell = E°cathode − E°anode. Cathode is the more positive electrode.", answer: 1.10, unit: "V", tolerance: 0.01, steps: ["E°cell = E°(more positive) − E°(more negative)", "E°cell = E°(Cu²⁺/Cu) − E°(Zn²⁺/Zn)", "E°cell = +0.34 − (−0.76) = +0.34 + 0.76 = +1.10 V"] },
      { q: "Are these two half-reactions spontaneous in the forward direction together?\nMnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O  E° = +1.51 V\nFe³⁺ + e⁻ → Fe²⁺  E° = +0.77 V\n(Enter 1 for yes, 0 for no)", hint: "The stronger oxidising agent (higher E°) oxidises the reducing form of the weaker one. E°cell > 0 means spontaneous.", answer: 1, unit: "", tolerance: 0, steps: ["MnO₄⁻/Mn²⁺ has E° = +1.51 V (stronger oxidising agent)", "Fe³⁺/Fe²⁺ has E° = +0.77 V", "MnO₄⁻ oxidises Fe²⁺ to Fe³⁺ (reverse of Fe half-equation)", "E°cell = +1.51 − 0.77 = +0.74 V > 0 → spontaneous ✓"] },
      { q: "A cell consists of Fe³⁺/Fe²⁺ (E° = +0.77 V) and Cl₂/Cl⁻ (E° = +1.36 V). What is E°cell if Fe²⁺ is oxidised to Fe³⁺ at the anode?", hint: "If Fe²⁺ is oxidised (anode), then Fe³⁺/Fe²⁺ is the anode. Cl₂/Cl⁻ is cathode. E°cell = E°cathode − E°anode.", answer: 0.59, unit: "V", tolerance: 0.01, steps: ["Anode (oxidation): Fe²⁺ → Fe³⁺ + e⁻ (reverse of Fe³⁺/Fe²⁺)", "Cathode (reduction): Cl₂ + 2e⁻ → 2Cl⁻", "E°cell = E°cathode − E°anode = +1.36 − 0.77 = +0.59 V"] },
    ]
  },
];

const EXTENDED_QUESTIONS = [
  {
    id: "doc01",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: `This question is about the shapes of molecules.Discuss the difference between the shapes of CF4 and XeF4 In your answer you should:• name the shape of each molecule• explain the shape of each molecule• explain the bond angle(s) in each molecule.`,
    markScheme: [
      "four bonding pairs (and zero lone pairs)",
      "electron pairs repel each other to be as far apart as possible / electronpairs repel each other equally",
      "four bonding pairs",
      "two lone pairs",
      "lone pairs repel more than bonding pairs"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc02",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 10,
    question: `1.1-Methylcyclohexene and limonene are cyclic alkenes with a citrus smell.1-Methylcyclohexene is manufactured and used in the chemical industry.Limonene is found naturally in orange peel.2.(a) 1-Methylcyclohexene reacts with HBr to form two structural isomers.The major product is 1-bromo-1-methylcyclohexane.Name and outline the mechanism for the formation of this major product.Name of mechanism Outline of mechanism (5)(b) Draw the skeletal formula of the minor product formed in the reaction in part (a).Explain why the products are formed in different amounts.Skeletal formula Explanation (4)(`,
    markScheme: [
      "electrophilic additionM2 must show an arrow from the double bond towards the Hatom of the HBr moleculeM3 must show the breaking of the H-Br bondM4 is for the structure of the correct carbocation (the added H does not need to beshown)",
      "-5) for wrong organic reactant or wrongcarbocation (ignore structure of product)",
      "if there is a bond drawn to the positive chargeFor",
      ", credit attack on a partially positively charged carbocationstructure, but penalise",
      "for the structure of the carbocation.52.Aston Manor Academy",
      "Penalise inclusion of —H bonds(allow carbonium ion in place of carbocation)",
      "idea that 1-bromo-1-methylcyclohexane is formed from/via orhas more stable carbocationM2 and",
      "must refer to stability of carbocations (ignore referenceto stability of products)"
    ],
    examTip: "This question is worth 10 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc03",
    board: "aqa",
    category: "Kinetics",
    marks: 6,
    question: `Draw the Maxwell–Boltzmann distribution curves for a fixed mass of a gas at two differenttemperatures.This gas decomposes when heated.By reference to these distribution curves, explain why the rate of decomposition of this gasincreases at higher temperatures.`,
    markScheme: [
      "suitable axis labels:vertical: number/proportion/fraction of molecules/particles;horizontal: (kinetic) energy",
      "peak moves to the right and down",
      "area under the curve (roughly) the same",
      "lines cross once only",
      "molecules have more energy",
      "more molecules have the activation energy",
      "higher proportion of collisions are successful / increases frequency ofsuccessful collisions"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc04",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 16,
    question: `lBorn–Haber cycleCalcium chloride22232237Potassium chloride690701Silver chloride770905Discuss the values in Table 3.In your answer you should• compare the three values based on a perfect ionic model• compare the values based on a perfect ionic model to the values from a Born–Habercycle for each compound.`,
    markScheme: [
      "KCl has similar values (between the perfect ionic model and Born-Haber cycle)",
      "AgCl has larger difference in values (between the perfect ionic model and Born-Habercycle)",
      "AgCl contains (some) covalent character",
      "Ag+ more polarising/distorts electron cloud more"
    ],
    examTip: "This question is worth 16 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc05",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 15,
    question: `n for reaction 3.Reagent and conditions Equation(2)(e) An incomplete equation for the formation of nylon 4,6 from five molecules of butane-1,4-diamine and five molecules of hexanedioic acid is shown.Deduce the values of x and y in this equation. x  y (2)(f) The figure below shows a section of the nylon 4,6 polymer molecule.Draw, on the figure above, another section of nylon 4,6 polymer showing two hydrogenbonds between the two sections.Draw, on the figure above, another section of nylon 4,6 polymer showing two hydrogenbonds between the two sections.`,
    markScheme: [
      "Exists as two Optical isomers / enantiomers",
      "Intermediate structure primary carbocation OR",
      "Alternative Intermediate structure secondary carbocation OR",
      "Optical because (secondary) C+ planar"
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc06",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: `cipitate forms.Add silver nitrate solution tothe second portion.A white precipitate forms.No change is seen.Identify L and M using the results in the table.In your answer:• identify all precipitates• explain why effervescence is seen in the reaction of sodiumcarbonate with L but not with M• give ionic equations for all reactions.`,
    markScheme: [
      "white ppt with L = AgCl AND white ppt with M = BaSO4",
      "L = FeCl3AND M = FeSO4",
      "Ag+ + Cl- → AgCl AND Ba2+ + SO42- → BaSO4"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc07",
    board: "aqa",
    category: "Kinetics",
    marks: 6,
    question: `6.Hydrogen can be prepared on an industrial scale using the reversible reaction between methaneand steam.CH4(g) + H2O(g) ⇌ CO(g) + 3 H2(g) ΔH = +206 kJ mol−1The reaction is done at a temperature of 800 °C and a low pressure of 300 kPa in the presenceof a nickel catalyst.Explain, in terms of equilibrium yield and cost, why these conditions are used.`,
    markScheme: [
      "The reaction is endothermic (so equilibrium shifts to RHS to reduce the temperature)1b",
      "So, higher temperature increases the yield 1c",
      "High temperatures are costly (so compromisetemperature used)Stage 2: Pressure2a",
      "More moles of gas on the right hand side, (so equilibrium shifts to RHS to increase the yield)2b",
      "So, lower pressure increases the yield2c",
      "A low pressure means a low costStage 3: Catalyst3a",
      "Catalyst has no effect on yield3b",
      "Adding a catalyst allows a lower temperature to be used3c"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc08",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 25,
    question: `its colour.Identity Colour (2)(f) Give the formula of B and state its colour.Give an ionic equation for the reaction of [Fe(H2O)6]3+ with aqueous Na2CO3 to form B.Formula Colour Ionic equation(3)(g) Explain why an aqueous solution containing [Fe(H2O)6]3+ ions has a lower pH than anaqueous solution containing [Fe(H2O)6]2+ ions.`,
    markScheme: [
      "Heterogeneous means in a different phase/state from reactants",
      "Catalyst speeds up reaction and is left unchanged OR lowers the activationenergy for the reaction",
      "Hydrogen and nitrogen/reactants adsorb onto the surface/ active sites of theiron",
      "Bonds weaken/reaction takes place",
      "Products desorb/leave from the surface (of the iron)",
      "Large surface area (of iron) by using powder or small pellets or supportmedium/mesh",
      "Catalyst poisoned / sulfur poisons or binds to the catalyst"
    ],
    examTip: "This question is worth 25 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc09",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 19,
    question: `peared on a website.“The fact that bioethanol is a carbon-neutral fuel outweighs the environmentaldisadvantages of producing bioethanol.”Evaluate this statement.In your answer you should include:• an outline of how bioethanol is produced• relevant equations• analysis of the environmental impacts.`,
    markScheme: [
      "Deforestation / Sacrifice land that could be used for food",
      "Loss of biodiversity / habitat"
    ],
    examTip: "This question is worth 19 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc10",
    board: "aqa",
    category: "Energetics",
    marks: 20,
    question: `cording the initial burette reading.1 2 (2)(h) When Na2C2O4(aq) is added to a solution containing [Fe(H2O)6]3+ ions, a reaction occurs inwhich all six water ligands are replaced by ethanedioate ions.Explain why the replacement of the water ligands by ethanedioate ions is favourable. Inyour answer refer to:• the enthalpy and entropy changes for the reaction• how the enthalpy and entropy changes influence the free-energy change for thereaction.`,
    markScheme: [
      "∆H negligible",
      "make & break same number of bonds",
      "make & break same type of bonds / bondshave similar enthalpies",
      "increase in entropy",
      "∆G = ∆H –T∆S",
      "∆G negative (for forward reaction)"
    ],
    examTip: "This question is worth 20 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc11",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: `The melting point of XeF4 is higher than the melting point of PF3Explain why the melting points of these two compounds are different.In your answer you should give the shape of each molecule, explain why each molecule has thatshape and how the shape influences the forces that affect the melting point.`,
    markScheme: [
      "Electron pairs repel as far as possible or Lone pair repels more than bonding pairs",
      "Stronger/more intermolecular forces in XeF",
      "Due to larger Mr or more electrons or larger molecules or packs more closely together"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc12",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 12,
    question: `11.This question is about NMR spectroscopy.(a) A compound is usually mixed with Si(CH3)4 and either CCl4 or CDCl3 before recording thecompound’s 1H NMR spectrum.State why Si(CH3)4, CCl4 and CDCl3 are used in 1H NMR spectroscopy.Explain how their properties make them suitable for use in 1H NMR spectroscopy.(6)12.(b) Deduce the splitting pattern for each of the peaks given by the H atoms labelled x, y and zin the 1H NMR spectrum of the compound shown.x y z (3)(c) Suggest why it is difficult to use Table B in the Data Booklet to predict the chemical shift (δvalue) for the peak given by the H at`,
    markScheme: [
      "Signal in an area away from other typical H signals / peak upfield from othersOR(Low electronegativity of Si shifts) signal right",
      "x – doublet1M2 y – quartet1M3 z – doublet"
    ],
    examTip: "This question is worth 12 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc13",
    board: "aqa",
    category: "Electrochemistry",
    marks: 13,
    question: `able shows some electrode potential data. Electrode reactionEө / V2 H+(aq) + 2 e− → H2(g)0.00Cu2+(aq) + 2 e− → Cu(s)+0.34NO3−(aq) + 4 H+(aq) + 3 e− → NO(g) + 2 H2O(l)+0.96Use the data in the table to explain why copper does not react with most acids but doesreact with nitric acid.Give an equation for the reaction between copper and nitric acid.Explanation Equation`,
    markScheme: [
      "Weigh 7.995 / 8.00 g TiOSO4",
      "transfer to volumetric flask and make up to the mark",
      "record voltage/potential difference/emf of the cell",
      "Ecell = ERHS – ELHSEcell = Ecopper – Etitanium"
    ],
    examTip: "This question is worth 13 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc14",
    board: "aqa",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: `The first ionisation energies of the elements in Period 2 change as the atomic number increases.Explain the pattern in the first ionisation energies of the elements from lithium to neon.`,
    markScheme: [
      "Errors in the use of technical terms.1-2 marksInsufficient correct chemistry to gain a mark.0 marks14",
      "Indicative Chemistry ContentStage 1: General Trend (Li → Ne)1a. 1st IE increases1b",
      "More protons/increased nuclear charge1c",
      "No extra/similar shielding1e",
      "Stronger attraction between nucleus and outer e OR outer e closer to nucleus (ignoreradius decreases)Stage 2: Deviation Be → B2a",
      "Outer electron in (2)p2c. higher in energy than (2)sIf Al vs Mg then do not award 2a or 2bStage 3: Deviation N → O3a",
      "O lower than N3b. 2 electrons in (2)p need to pair3c. pairing causes repulsion (do not award if it is clear reference to repulsion is in s orbital)If S vs P then do not award 3a or 3b"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc15",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 10,
    question: `14.Methanol (CH3OH) is an important alcohol with many uses.(a) Draw a diagram to show how two methanol molecules interact with each other throughhydrogen bonding in the liquid phase.Include all partial charges and all lone pairs of electrons in your diagram. (3)15.(b) The bond angle around the oxygen atom in methanol is slightly smaller than the regulartetrahedral angle of 109.5°Explain why this bond angle is smaller than 109.5°(1)(c) Methanol is made by the reaction of carbon monoxide with hydrogen.CO + 2 H2 ⇌ CH3OH ∆H = –91 kJ mol–1The reaction uses a copper-based catalyst, a pressure of 1`,
    markScheme: [
      "use of a catalyst has no impact on equilibrium yield",
      "use of a catalyst gives faster rate",
      "use of catalyst lowers costs",
      "higher pressure gives a higher equilibrium yield",
      "higher pressure gives a faster rate",
      "the higher the pressure, the greater the cost",
      "lower temperature gives a higher equilibrium yield",
      "higher temperature gives a faster rate",
      "the higher the temperature, the greater the costNote that converse statements are fine (e.g"
    ],
    examTip: "This question is worth 10 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc16",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 7,
    question: `Isomers X and Y have the molecular formula C5H8O (a) Give the IUPAC name for isomer X.(1)16.(b) Explain how and why isomers X and Y can be distinguished by comparing each of their• boiling points• 13C NMR spectra• infrared spectra.Use data from Tables A and C in the Data Booklet in your answer.`,
    markScheme: [
      "Use the mark scheme to award up to 7 marks based on the key chemistry points covered."
    ],
    examTip: "This question is worth 7 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc17",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 17,
    question: `This question is about sodium and some of its compounds.(a) Use your knowledge of structure and bonding to explain why sodium bromide has a meltingpoint that is higher than that of sodium, and higher than that of sodium iodide.(6)17.(b) When 250 mg of sodium were added to 500 cm3 of water at 25 °C a gas was produced.Give an equation for the reaction that occurs.Calculate the volume, in cm3, of the gas formed at 101 kPaThe gas constant, R = 8.31 J K–1 mol–1Equation Volume  cm3(6)(c) Calculate the concentration, in mol dm–3, of sodium ions in the solution produced in thereaction in part (b).Con`,
    markScheme: [
      "Na + H2O → NaOH + ½ H2",
      "andM5AE: If not divided by 1000 and final answer is 1.33 × 105 cm3 4/51M3 moles H2 = 5.43 × 10–3 to 5.45 × 10–3M3 =",
      "/2CE: If incorrect ratio used max 3/5 calculation marks –",
      "andM51M4 T = 298 (K) and P = 101000 (Pa)1M5 V = nRT/P or (5.435 × 10–3 × 8.31 × 298)/101000 or 1.33 × 10–4 (m3)1M6 V = 133 – 134 cm3",
      "from question (b)1Aston Manor Academy",
      "allow lone pairs repel more than bonding pairsMark independently1"
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc18",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `Four compounds, all colourless liquids, are• butan-2-ol• butanal• butanone• 2-methylpropan-2-olTwo of these compounds can be identified using different test-tube reactions.Describe these two test-tube reactions by giving reagents and observations in each case.Suggest how the results of a spectroscopic technique could be used to distinguish between theother two compounds.`,
    markScheme: [
      "observation withcorrect deduction",
      "suitable technique"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc19",
    board: "aqa",
    category: "Kinetics",
    marks: 7,
    question: `18.A student added 627 mg of hydrated sodium carbonate (Na2CO3.xH2O) to 200 cm3 of 0.250 moldm–3 hydrochloric acid in a beaker and stirred the mixture.After the reaction was complete, the resulting solution was transferred to a volumetric flask,made up to 250 cm3 with deionised water and mixed thoroughly.Several 25.0 cm3 portions of the resulting solution were titrated with 0.150 mol dm–3 aqueoussodium hydroxide. The mean titre was 26.60 cm3 of aqueous sodium hydroxide.Calculate the value of x in Na2CO3.xH2OShow your working.Give your answer as an integer.Value of x`,
    markScheme: [
      "HCl added = 0.050 mol andNaOH used in titration = 3.99 × 10–3 mol119",
      "xH2O = 0.627/5.05 × 10–3 -106.0 = 18 (.16)Alternative: mass Na2CO3 that reacted with the HCl 5.05 × 10–3x106.0 = 0.5353 g and mass H2O = 0.627- 0.5353 = 0.0917 g1M7 so x = 1Alternative: 0.0917 /18.0 = 5.094 × 10–3 so ratioNa2CO3 to H2O = 1:1.009 ie 1"
    ],
    examTip: "This question is worth 7 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc20",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 9,
    question: `19.Data about the hydrogenation of cyclohexene and of benzene are given.20.(a) Explain the bonding in and the shape of a benzene molecule.Compare the stability of benzene with that of the hypothetical cyclohexa-1,3,5-trienemolecule.Use the data in your answer.(6)(b) The enthalpy of hydrogenation of cyclohexa-1,3-diene is not exactly double that ofcyclohexene.Suggest a value for the enthalpy of hydrogenation of cyclohexa-1,3-diene and justify yourvalue.`,
    markScheme: [
      "Indicative chemistry contentStage"
    ],
    examTip: "This question is worth 9 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc21",
    board: "aqa",
    category: "Kinetics",
    marks: 13,
    question: `nd the data book value.(1)(c) Suggest how the students’ method, and the analysis of the results, could be improved inorder to determine a more accurate value for the enthalpy of reaction.Justify your suggestions.Do not refer to the precision of the measuring equipment. Do not change the amounts orthe concentration of the chemicals.`,
    markScheme: [
      "Insulate the beaker or use a polystyrene cup or a lid",
      "To reduce heat loss",
      "Record the temperature for a suitable time before adding the metal",
      "To establish an accurate initial temperatureOR",
      "Record temperature values at regular time intervals",
      "To plot the temperature results against time on a graph",
      "Extrapolate the cooling back to the point of addition"
    ],
    examTip: "This question is worth 13 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc22",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 6,
    question: `Compounds A, B and C all have the molecular formula C5H10A and B decolourise bromine water but C does not.B exists as two stereoisomers but A does not show stereoisomerism.Use this information to deduce a possible structure for each of compounds A, B and C andexplain your deductions.State the meaning of the term stereoisomers and explain how they arise in compound B.`,
    markScheme: [
      "states that A & B are unsaturated / do contain C=C / alkenes (this can be obtained from thestructures)",
      "as they decolourise bromine water",
      "states that C is saturated / does not contain C=C / is (cyclo)alkane (this can be obtainedfrom the structures)",
      "as it does not decolourise bromine water",
      "suggests a suitable name / structure of C (cyclopentane, methylcyclobutane, anydimethylcyclopropane)",
      "explains what stereoisomerism is in terms of molecules with the same structural formulabut a different arrangement of atoms / bonds / groups in space",
      "explains how it arises by discussing that C=C cannot rotate"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc23",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 14,
    question: `oric acid as a catalyst. The structure of concentrated phosphoric acid is shown. Identify the factors that influence the boiling points of each of the compounds in thisreaction mixture. State how and explain why cyclohexene can be separated from thereaction mixture.`,
    markScheme: [
      "for secondary and",
      "curly arrow from lone pair on O to H+1M2 correct structure of intermediate with + on O1M3 curly arrow from C‑O bond to O1M4 curly arrow from correct C‑H bond towards correct C‑C bond1",
      "/3/4 as relevant (but allow attack by ananion of phosphoric acid on the H that is lost in",
      "in addition to thearrow specified)for",
      ", the O of the +OH2 group must be bonded to the ring23.(b)Any correct structural representation1Aston Manor Academy",
      "more stable (carbocation formed)For",
      "penalise more stable product1M2 changes from secondary to tertiary (carbocation)For",
      "allow explanation via inductive effect with more alkyl / Cgroups attached or inductive effect from methyl group asalternatives",
      "/2/3 penalise reference to breaking covalent bondsM2 &",
      "ignore reference to van der Waals and/or (permanent)dipole-dipole forcesM2 allow use of term H bonds (on this occasion)"
    ],
    examTip: "This question is worth 14 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc24",
    board: "aqa",
    category: "Equilibrium",
    marks: 6,
    question: `Titanium(IV) chloride can be made from titanium(IV) oxide as shown in the equation.TiO2(s) + 2C(s) + 2Cl2 (g) → 2CO(g) + TiCl4(l) ΔHo = −60.0 kJ mol−1Some entropy data are shown in the table. SubstanceTiO2(s)C(s)Cl2(g)CO(g)TiCl4(l)So / J K−1 mol−150.25.70223198253Use the equation and the data in the table to calculate the Gibbs free-energy change forthis reaction at 989 °CGive your answer to the appropriate number of significant figures.Use your answer to explain whether this reaction is feasible.Gibbs free-energy change  kJ mol−1Explanation`,
    markScheme: [
      "from incorrect M21ΔG = ΔH - TΔS1ΔG = -60 - (1262 × 141(.4) × 10−3)This expression also scores",
      ", allow ΔG = -60 - (1262 × their",
      "× 10−3)1= –238 (kJ mol−1 ) to 3 sig figsIf calculated in joulesM4",
      "from their ΔG1"
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc25",
    board: "aqa",
    category: "Equilibrium",
    marks: 14,
    question: `de and hydrogen was allowed to reach equilibrium at600 KAt equilibrium, the mixture contained 2.76 mol of carbon monoxide, 4.51 mol of hydrogenand 0.360 mol of methanol. The total pressure was 630 kPaCalculate a value for the equilibrium constant, Kp, for this reaction at 600 K and state itsunits.Value of Kp  Units`,
    markScheme: [
      "Yield increases as temperature increases (or converse)",
      "After a certain temperature yield no longer increases",
      "Yield decreases as pressure increases (or converse)",
      "High temperature results in high energy costs/expensive",
      "(After a certain temperature) yield no longer increases therefore there is no gain in usinga higher temperature",
      "Low pressure may be too slow",
      "So compromise pressure required"
    ],
    examTip: "This question is worth 14 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc26",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 14,
    question: `the iron complex.Bond angle Type of isomerism (3)(d) Ethanedioate ions are poisonous because they react with iron ions in the body.Ethanedioate ions are present in foods such as broccoli and spinach.Suggest one reason why people who eat these foods do not suffer from poisoning.`,
    markScheme: [
      "(do not allow if negative and do not allow =",
      ")If no subtraction, max = 5 (",
      ")If incorrect subtraction, max = 6 (",
      "can be scored by multiplying",
      "by 10 beforesubtraction (giving 1.325 × 10−2 – 5.225 × 10−3 = 8.025 × 10−3 )",
      "× 134M8 = (",
      "/1.90) × 100"
    ],
    examTip: "This question is worth 14 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc27",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 6,
    question: `Test-tube reactions can be used to identify the functional groups in organic molecules.You are provided with samples of each of the four compounds. Describe how you could distinguish between all four compounds using the minimum number oftests on each compound.You should describe what would be observed in each test.`,
    markScheme: [
      "Use the mark scheme to award up to 6 marks based on the key chemistry points covered."
    ],
    examTip: "This is a 6-mark levels of response question. Structure your answer clearly covering all key stages."
  },
  {
    id: "doc28",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 21,
    question: `3)(e) Although the 1H spectra of R and S both show the same number of peaks, the spectra canbe used to distinguish between the isomers.Justify this statement using the splitting patterns of the peaks.Give the number of peaks for each isomer.JustificationNumber of peaks (3)(f) The action of heat on 5-hydroxyhexanoic acid can lead to two different products.On gentle heating, 5-hydroxyhexanoic acid loses water to form a cyclic compound, T(C6H10O2).Under different conditions, 5-hydroxyhexanoic acid forms a polyester.Draw the structure of T.Draw the repeating unit of the polyester and name the typ`,
    markScheme: [
      "– max 3If incorrect volume from AE then penalise",
      "and mark on(Final answer is 0.806 × their volume)M2Mol carbon dioxide = pV/RT = = 7.632 × 10−3If unit error in p, V or T lose",
      "and M5If incorrect rearrangement lose",
      "and M5If both errors seen then no further marksM3Mol P, C6H10O2 used = 7.632 × 10−3 / 6 = 1.272 × 10−3M3 divided by 6 If wrong no further marksM4Mass P used = 1.272 × 10−3 × 114(.0) g = 145 mgMark for answer (allow ans to 2 sf)Check chemical equation",
      "can be awarded on the spectra",
      "for resulting peak in spectraM2ORS has a -C(H2)-C(H3) R does notM1S has one peak in range δ = 5-40 R does not/ lowest peak for S is lower than lowest for RM2(Both have) three peaksM3Aston Manor Academy"
    ],
    examTip: "This question is worth 21 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc29",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 11,
    question: `This question is about the three amines, E, F and G. (a) Amines E, F and G are weak bases.Explain the difference in base strength of the three amines and give the order of increasingbase strength.(6)29.(b) Amine F can be prepared in a three-step synthesis starting from methylbenzene.Suggest the structures of the two intermediate compounds.For each step, give reagents and conditions only. Equations and mechanisms are notrequired.`,
    markScheme: [
      "Use the mark scheme to award up to 11 marks based on the key chemistry points covered."
    ],
    examTip: "This question is worth 11 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc30",
    board: "aqa",
    category: "Energetics",
    marks: 14,
    question: `mol−1298−592.5288−594.2273−596.7260−598.8240−602.2Use these data to plot a graph of free-energy change against temperature on the gridbelow.Calculate the gradient of the line on your graph and hence calculate the entropy change,ΔS, in J K−1 mol−1, for the formation of anhydrous magnesium chloride from its elements.Show your working.ΔS  J K−1 mol−1`,
    markScheme: [
      "Measures water with named appropriate apparatus",
      "Suitable volume/mass / volume/mass in range 10 – 200 cm3/g",
      "Record T at regular timed intervals for 5+ mins / until trend seen",
      "Tfinal – Tinitial = ΔT / idea of finding ΔT from graph at point of addition"
    ],
    examTip: "This question is worth 14 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc31",
    board: "aqa",
    category: "Equilibrium",
    marks: 18,
    question: `lar experiment, another student used 0.040 mol of ethyl benzoate and obtained5.12 g of benzoic acid.Calculate the percentage yield of benzoic acid.Suggest why the yield is not 100%.Percentage yield  %Suggestion`,
    markScheme: [
      "max = 41of minimum volume",
      "/0.04or calculation that 0.04 mol of benzoic = 4.88 g (",
      ") so% yield = (5.12/4.88) × 100 = 105%1Product not dried / impurities present in productOnly allow"
    ],
    examTip: "This question is worth 18 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc32",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 9,
    question: `hydroxide.(If you were unable to calculate a value for the concentration of HX in part (c) you shoulduse a value of 0.600 mol dm−3 in this calculation. This is not the correct value.)pH of HX (2)(e) Calculate the pH of the solution when half of the acid has reacted.pH of solution (1)(f) Plot your answers to part (d) and part (e) on the grid in the figure above.Use these points to sketch the missing part of the curve between 0 and 20 cm3 of NaOHsolution added.`,
    markScheme: [
      "dependent on a calculation of [H+]1(e) (pH at half-neutralisation = pKa)= –log 2.62 × 10−5 = 4.58 (must be 2 or more dp)"
    ],
    examTip: "This question is worth 9 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc33",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 17,
    question: `splitting patterns of these peaks.Signal at δ= 3.5 Signal at δ= 2.2 (4)(f) Deduce the structure of compound X, C6H12O2Use your answer from part (e) to help you.You are not required to explain how you deduced the structure.`,
    markScheme: [
      "Use the mark scheme to award up to 17 marks based on the key chemistry points covered."
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc34",
    board: "aqa",
    category: "Kinetics",
    marks: 19,
    question: `to comment on thestatement that “the student has demonstrated expert practical skills”.(4)(e) Suggest why the student should not use this sample of paracetamol for the purposes ofpain relief.(1)(f) Suggest two reasons why, in an industrial situation, ethanoic anhydride would be preferredto ethanoyl chloride in the production of paracetamol.1. 2.`,
    markScheme: [
      "= Arrow from lone pair on N to carbon in C=O.1M3 = Arrow from the bond in CO to the O.1M3 = Correct intermediate with + on N and − on O.1M4 = Three arrows and lone pair.1Aston Manor Academy"
    ],
    examTip: "This question is worth 19 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc35",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 5,
    question: `The table shows some data about the elements bromine and magnesium. ElementMelting point / KBoiling point / KBromine266332Magnesium923138335.In terms of structure and bonding explain why the boiling point of bromine is different from that ofmagnesium. Suggest why magnesium is a liquid over a much greater temperature rangecompared to bromine.`,
    markScheme: [
      "and M41StrengthM3 Br2 has weak (van der Waals) forces between the molecules / weak IMFsIf eg Mg molecules or Mg ionic bonds lose",
      "The comparison could be direct or implied.1Liquid rangeM5 Mg has a much greater liquid range because forces of attraction inliquid / molten metal are strong(er) OR converse argument for Br2Must refer to liquid range to score M51"
    ],
    examTip: "This question is worth 5 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc36",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 10,
    question: `The compounds in the table all have a relative molecular mass of 58.0 (a) Explain why determining the precise relative molecular mass of propanal andprop-2-en-1-ol by mass spectrometry could not be used to distinguish betweensamples of these two compounds.(2)36.(b) The infrared spectrum of one of these three compounds is shown below. Use the spectrum to identify the compound.State the bond that you used to identify the compound and give its wavenumber range.You should only consider absorptions with wavenumbers greater than 1500 cm−1.Compound Bond used to identify compound Wavenumber range of b`,
    markScheme: [
      "have the same molecular formulaor are C3H6Oor both have the same number/amount of each type of atom or same amount of eachelementor are isomers",
      "prop-2-en-1-olMust refer to this compound clearly by name or structure (not toalcohol alone); ignore minor slips in name/structure1M2 O(-)H (alcohol) and 3230–3550 (cm−1), orC=C and 1620–1680 (cm−1)Marked independently from M1Could score from bond la"
    ],
    examTip: "This question is worth 10 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc37",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 8,
    question: `The alkene 3-methylpent-2-ene (CH3CH=C(CH3)CH2CH3) reacts with hydrogen bromide to forma mixture of 3-bromo-3-methylpentane and 2-bromo-3-methylpentane.(a) The alkene 3-methylpent-2-ene (CH3CH=C(CH3)CH2CH3) exists as E and Zstereoisomers.Draw the structure of Z-3-methylpent-2-ene. (1)37.(b) Name and outline the mechanism for the formation of 3-bromo-3-methylpentane from thisreaction of 3-methylpent-2-ene with hydrogen bromide.Explain why more 3-bromo-3-methylpentane is formed in this reaction than 2-bromo-3-methylpentane.`,
    markScheme: [
      "Penalise one mark from their total if half-headed arrows areusedM2",
      "if there is a bond drawn to the positive chargePenalise only once in any part of the mechanism for a line and twodots to show a bondMax 3 of any 4 marks (",
      "-5) for wrong organic reactant or wrongorganic product (if shown) or secondary carbocationMax 2 of any 4 marks in the mechanism for use of bromineDo not penalise the “correct” use of “sticks”Aston Manor Academy",
      "must describe the movement of a pair of electrons from the Br−ion to the positive C atom of the carbocation / curly arrow from thelone pair of electrons on the negatively charged bromide iontowards the positively charged C atom (of either a secondary"
    ],
    examTip: "This question is worth 8 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc38",
    board: "aqa",
    category: "Kinetics",
    marks: 13,
    question: `Alcohols can be prepared from alkenes in various ways.(a) On a laboratory scale, a mixture of propan-1-ol and propan-2-ol can be prepared frompropene in two steps.In step 1, propene reacts with cold, concentrated sulfuric acid to form intermediatecompounds.In step 2, the intermediate compounds react with water to form the mixture of alcohols.Name and outline the mechanism for the reaction between propene and concentratedsulfuric acid to form the intermediate compound which gives propan-2-ol in step 2.Explain why propan-2-ol is the major product of this preparation.(7)38.(b) On an industrial s`,
    markScheme: [
      "= curly arrow from C=C towards H of H−O on ‘their’ sulfuric acidM3 = curly arrow to break H−OPenalise incorrect dipole/full chargesM4 = intermediateM5 = correct anion, lone pair on correct O and curly arrow from thatlone pair to C+ on their carbocati"
    ],
    examTip: "This question is worth 13 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc39",
    board: "aqa",
    category: "Kinetics",
    marks: 17,
    question: `e investigated by adding aqueous silvernitrate to the chloroalkanes. During the hydrolysis reactions, chloride ions are liberatedslowly. Precipitates of silver chloride are formed.Outline a method to compare the rate of hydrolysis of 1-chlorobutane with that of2-chlorobutane. State how the method would ensure a fair test.`,
    markScheme: [
      "if any mention of acidified/H+ in reagents or conditions1Reaction 1 = ethanolic/alcoholic ANDreaction 2 = aqueous",
      "only even if arrows inmechanism correctIf C chain length or halogen wrong in reactant or product max 2/311139.Aston Manor Academy"
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc40",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 17,
    question: `ve isomers are repeated to help you answer this question. State which isomer produces the spectrum in Figure 1 and which isomer produces thespectrum in Figure 2.Explain your answer.You do not need to identify every peak in each spectrum.Use Table C on the Data Sheet to answer the question.(5)(f) U and V are other isomers of P, Q, R, S and T.The 1H n.m.r. spectrum of U consists of two singlets.V is a cyclic alcohol that exists as optical isomers.Draw the structure of U and the structure of V. U V`,
    markScheme: [
      "or M5M3150-90 (ppm) or value in range is C—O or alcohol or etherM41two peaks (so not S which would have only one)",
      "(f) 1Aston Manor Academy"
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc41",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 9,
    question: `The N-substituted amide C6H13NO can be formed from but−2−ene in a three-step synthesis.H3CCHCHCH3 C4H9Br C4H11N C6H13NOFor each reaction• state a reagent• give the structure of the product• name the mechanism of the reaction.Detailed mechanisms are not required.`,
    markScheme: [
      "but canscore",
      "& M9M11M21electrophilic additionIf 1-bromobutane structure given for",
      "then 1-aminobutanestructure for",
      "consequentiallyM3141. Aston Manor Academy",
      "then 2-aminobutanestructure for",
      "and M8M51nucleophilic substitutionIf 2-bromobutane structure given for",
      "then 1-aminobutanestructure, penalise",
      "and M8M61Step 3CH3COCl or (CH3CO)2O"
    ],
    examTip: "This question is worth 9 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc42",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 12,
    question: `ydrogenphosphate can be represented by the formula Ca(H2PO4)x where x isan integer.A 9.76 g sample of calcium dihydrogenphosphate contains 0.17 g of hydrogen, 2.59 g ofphosphorus and 5.33 g of oxygen.Calculate the empirical formula and hence the value of x.Show your working.`,
    markScheme: [
      "- Mr calcium phosphate = 310(.3)If Mr wrong, lose",
      ".142.Aston Manor Academy",
      "- Moles calcium phosphate = (= 0.0234) 0.0234 moles can score",
      ".If Mr incorrect, can score",
      "to 2 significant figures here but will lose",
      "ifanswer not 1.23.1M3 - Moles phosphoric acid = 2 × 0.0234 = 0.0468",
      "× 2. If not multiplied by 2 then lose",
      ".1M4 - Vol phosphoric acid = 0.038(0) dm3If not 0.038(0) dm3 then lose",
      ".1Conc phosphoric acid =",
      "= 1.23 (mol dm−3)This answer only – unless arithmetic or transcription error that hasbeen penalised by 1 mark"
    ],
    examTip: "This question is worth 12 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc43",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 20,
    question: `al reaction involves one of the chloride ligandsbeing replaced by water.Write an equation for this reaction.(1)(iii) Suggest how the risk associated with the use of this drug can be minimised.(1)(d) Explain, with the aid of equations, how and why vanadium(V) oxide is used in the ContactProcess.`,
    markScheme: [
      "but can score",
      "particles form 7 particles / increase in number of particles",
      "if numbers match candidates incorrect equationprovided number of particles increases1disorder / entropy increases / ΔS positiveCannot score",
      "if number of particles stated or in equation is thesame or decreases1ΔH is approx. zero / no net change in bond enthalpies",
      "independently1(c) (i) Correct displayed structureMust show all three N–H bonds on each N",
      "Bond angle 90°",
      "must state that overall charge = 0"
    ],
    examTip: "This question is worth 20 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc44",
    board: "aqa",
    category: "Electrochemistry",
    marks: 7,
    question: `A student carried out an experiment to find the mass of FeSO4.7H2O in an impure sample, X.The student recorded the mass of X. This sample was dissolved in water and made up to250 cm3 of solution.The student found that, after an excess of acid had been added, 25.0 cm3 of this solution reactedwith 21.3 cm3 of a 0.0150 mol dm–3 solution of K2Cr2O7(a) Use this information to calculate a value for the mass of FeSO4.7H2O in the sample of X.(5)44.(b) The student found that the calculated mass of FeSO4.7H2O was greater than the actualmass of the sample that had been weighed out. The student realised t`,
    markScheme: [
      "or M31moles of Fe2+ = 6 × 3.195 × 10–4 = 1.917 × 10–3Process mark for",
      "× 6 (also score",
      ")1original moles in 250 cm3 = 1.917 × 10–3 × 10 = 1.917 × 10–2Process mark for",
      "× 101Aston Manor Academy",
      "× 277.9(allow 5.30 to 5.40)Answer must be to at least 3 sig figsNote that an answer of 0.888 scores",
      "(ratio 1:1used)1(b) (Impurity is a) reducing agent / reacts with dichromate / impurity is a version of FeSO4with fewer than 7 waters (not fully hydrated)"
    ],
    examTip: "This question is worth 7 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc45",
    board: "aqa",
    category: "Kinetics",
    marks: 17,
    question: `An excess of a given reagent is added to each of the following pairs of aqueous metal ions.For each metal ion, state the initial colour of the solution and the final observation that you wouldmake.In each case, write an overall equation for the formation of the final product from the initialaqueous metal ion.(a) An excess of aqueous sodium carbonate is added to separate aqueous solutionscontaining [Fe(H2O)6]2+ and [Fe(H2O)6]3+.(5)45.(b) An excess of concentrated hydrochloric acid is added to separate aqueous solutionscontaining [Cu(H2O)6]2+ and [Co(H2O)6]2+.(4)(c) An excess of dilute aqueous `,
    markScheme: [
      "(a) Iron(II): green (solution) gives a green precipitateApply list principle throughout if extra colours and / or extraobservations given"
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc46",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 15,
    question: `ve the formula of the complex cobalt compound Z that you would expect to be formed inthe preparation described above.Suggest one reason why the mole ratio of chloride ions to cobalt ions that you havecalculated is different from the expected value.`,
    markScheme: [
      "even if equation incorrect or missingprovided number of particles increases1So the entropy change is positive / disorder increases / entropy increases1(ii) Minimum for",
      "is 3 bidentate ligands bonded to Co",
      "but penalise charges on anyligand in M21Ligands need not have any atoms shown but diagram must show 6 bonds fromligands to Co, 2 from each ligandMinimum for",
      "is one ligand identified as H2N-----NH2",
      "is one bidentate ligand showing two arrows from separatenitrogens to cobalt1(c) Moles of cobalt = (50 × 0.203) / 1000 = 0.01015 mol",
      "Aston Manor Academy",
      "[Co(NH3)6]Cl3 (square brackets not essential)1Difference due to incomplete oxidation in the preparation"
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc47",
    board: "aqa",
    category: "Kinetics",
    marks: 5,
    question: `Concentrated sulfuric acid reacts with solid potassium iodide as shown in the equation.8KI + 9H2SO4 4l2 + 8KHSO4 + H2S + 4H2OGive two observations that you would make when this reaction occurs.In terms of electrons, state what happens to the iodide ions in this reaction.State the change in oxidation state of sulfur that occurs during this formation of H2S and deducethe half-equation for the conversion of H2SO4 into H2S`,
    markScheme: [
      "(either order)Any two from• purple vapour / gas• (white solid goes to) black or black / grey or black / purplesolid• bad egg smell or words to this effect"
    ],
    examTip: "This question is worth 5 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc48",
    board: "aqa",
    category: "Kinetics",
    marks: 18,
    question: `-determining step in the mechanism in part (b) (ii) involves attack by thenucleophile.Suggest how the rate of reaction of propanone with HCN would compare with therate of reaction of propanal with HCNExplain your answer.`,
    markScheme: [
      "arrow from circle or within it to C or to + on Chorseshoe must not extend beyond C2 to C6 but can be smaller+ not too close to C1M2 penalise C6H5–CH3CH2CO (even if already penalized in (a)(i))",
      "arrow into hexagon unless Kekuleallow",
      "arrow independent of",
      "structureignore base removing H in",
      "(b) (i) CH3CH2CHO + HCN → CH3CH2CH(OH)CN OR C2H5CH(OH)CNaldehyde must be –CHO brackets optional12-hydroxybutanenitrile OR 2-hydroxybutanonitrileno others1Aston Manor Academy",
      "includes lp and arrow to Carbonyl C and minus charge (oneither C or N)",
      ", but allow",
      "to C+ after non-scoringcarbonyl arrow"
    ],
    examTip: "This question is worth 18 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc49",
    board: "aqa",
    category: "Electrochemistry",
    marks: 17,
    question: `0.0187 mol dm–3 potassiummanganate(VII) solution.Write an equation for the reaction between acidified potassium manganate(VII) solutionand hydrogen peroxide.Use this equation and the results given to calculate a value for the concentration, inmol dm–3, of the original hydrogen peroxide solution.(If you have been unable to write an equation for this reaction you may assume that 3 molof KMnO4 react with 7mol of H2O2. This is not the correct reacting ratio.)`,
    markScheme: [
      "& M51Moles MnO4– = (24.35/1000) × 0.0187 = 4.55 × 10–4Note value must be quoted to at least 3 sig. figs",
      "is for 4.55 × 10–41Moles H2O2 = (4.55 × 10–4) × 5/2 = 1.138 × 10–3M3 is for × 5/2 (or 7/3)Mark consequential on molar ratio from candidate's equation1Aston Manor Academy",
      "is for consequentially correct answer from (answer to mark 4) ×(1000/5)Note an answer of between 2.25 and 2.30 is worth 4 marks)If candidate uses given ratio 3/7 max 4 marks",
      ": Moles of MnO4– = 4.55 × 10–4M2: Moles H2O2 = (4.55 × 10–4) × 7/3 = 1.0617 × 10–3M3: Moles H2O2 in 5 cm3 original= (1.0617 × 10–3) × 10 = 0.01062M4: Original [H2O2] = 0.01062 × (1000/5) = 2.12 mol dm–3(allow 2.10 to 2.15)1"
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc50",
    board: "aqa",
    category: "Energetics",
    marks: 15,
    question: `cess 3. The student showed that the temperature of 200 g of water increased by 8.0 °Cwhen 0.46 g of pure ethanol was burned in air and the heat produced was used to warmthe water.Use these results to calculate the value, in kJ mol–1, obtained by the student for thisenthalpy change. (The specific heat capacity of water is 4.18 J K–1 g–1)Give one reason, other than heat loss, why the value obtained from the student’s results isless exothermic than a data book value.`,
    markScheme: [
      "to M3M1 yeast or zymaseM2 30 °C ≥ T ≤ 42 °CM3 anaerobic/no oxygen/no air OR neutral pHM4 C6H12O6 2C2H5OH + 2CO2OR2C6H12O6 4C2H5OH + 4CO2Mark independentlyPenalise “bacteria” and “phosphoric acid” using the list principle",
      "Carbon-neutral",
      "for equations alone withoutcommentary or annotation or calculation1(c)",
      "(could be scored by a correct mathematical expression)(Sum of) bonds broken – (Sum of) bonds made/formed = ΔHOR(Σ) Breactants – (Σ) Bproducts = ΔH (where B = bond enthalpy/bond energy)For",
      "there must be a correct mathematical expression using ΔHor “enthalpy change”",
      "Reactants = (+) 4719ORProducts = (–) 5750M3 Overall + 4719 – 5750 = –1031 (kJ mol–1) (This is worth 3 marks)Award full marks for correct answer",
      "is for either value underlinedM3 is",
      "Mean bond enthalpies are not specific for this reactionOR they are average values from many differentcompounds/moleculesDo not forget to award this mark1Aston Manor Academy",
      "q = m c ΔT (this mark for correct mathematical formula)",
      "= 6688 (J) OR 6.688 (kJ) OR 6.69 (kJ) OR 6.7 (kJ)"
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc51",
    board: "aqa",
    category: "Equilibrium",
    marks: 17,
    question: `ΔS you may assume that they are–61 kJ mol–1 and –205 J K–1 mol–1 respectively. These are not the correct values.)(6)(d) Write an equation for the complete combustion of methanol. Use your equation to explainwhy the combustion reaction in the gas phase is feasible at all temperatures.(4)(e) Give one reason why methanol, synthesised from carbon dioxide and hydrogen, may notbe a carbon-neutral fuel.`,
    markScheme: [
      "(ΔS is negative so) at high temp –TΔS (is positive and)greater than ΔH/largeDo not award",
      "if positive ΔS value used1So ΔG > 0Independent mark unless positive ΔS value used1(Limiting condition ΔG = 0 so) T = ΔH/ΔS1= 272 K",
      "if T –ve or if",
      "should give T –ve1Reaction is too slow at this temperature/to speed up the reaction1Aston Manor Academy"
    ],
    examTip: "This question is worth 17 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc52",
    board: "aqa",
    category: "Electrochemistry",
    marks: 14,
    question: `s. A 25.0 cm3sample of the partially oxidised solution required 23.70 cm3 of 0.0100 mol dm–3 potassiumdichromate(VI) solution for complete reaction in the presence of an excess of dilute sulfuricacid.Calculate the percentage of iron(II) ions that had been oxidised by the air.`,
    markScheme: [
      "/101Original moles Fe2+ = 10.00/277.9 = 0.0360Independent mark1Moles Fe2+ oxidised = 0.0360 – 0.0142 = 0.0218M4 –",
      "% oxidised = (0.0218 × 100)/0.0360 = 60.5%(",
      "wrongeg 1:5 gives 67.1%1:1 gives 93.4%Note also, 39.5% (39-40) scores"
    ],
    examTip: "This question is worth 14 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc53",
    board: "aqa",
    category: "Atomic Structure & Periodicity",
    marks: 13,
    question: `nergiesacross Period 3. Explain your answer.How sulfur deviates from the trend Explanation (3)(e) A general trend exists in the first ionisation energies of the Period 2 elements lithium tofluorine. Identify one element which deviates from this general trend.`,
    markScheme: [
      "dependent upon a reasonable attempt at",
      "(e) Boron/B or oxygen/O/O21"
    ],
    examTip: "This question is worth 13 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc54",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 5,
    question: `A molecule of ClF3 reacts with a molecule of AsF5 as shown in the following equation.ClF3 + AsF5 → ClF2+ + AsF6–Use your understanding of electron pair repulsion to draw the shape of the AsF5 molecule andthe shape of the ClF2+ ion. Include any lone pairs of electrons.Name the shape made by the atoms in the AsF5 molecule and in the ClF2+ ion.Predict the bond angle in the ClF2+ ion.`,
    markScheme: [
      "independentlyM1 for 5 bond pairs around AsDo not penalise A for As or Fl for F1trigonal/triangular bipyramid(al)"
    ],
    examTip: "This question is worth 5 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc55",
    board: "aqa",
    category: "Electrochemistry",
    marks: 15,
    question: `-1-ol, carbondioxide and water only.State one condition necessary to ensure the complete combustion of a fuel in air.Write an equation for the complete combustion of butan-1-ol and state why it can bedescribed as a biofuel.(4)(d) Butan-1-ol reacts with acidified potassium dichromate(VI) solution to produce two organiccompounds.State the class of alcohols to which butan-1-ol belongs.Draw the displayed formula for both of the organic products.State the type of reaction that occurs and the change in colour of the potassiumdichromate(VI) solution.`,
    markScheme: [
      "displayed formula must have all bonds drawn out, including theO―H but ignore anglesPenalise “sticks”",
      "Alcohol X is",
      "structure must be clearly identifiable as2-methylpropan-2-ol and may be drawn in a variety of ways",
      "Alcohol Y is named (2)-methylpropan-1-ol ONLYM3 must be correct name, but ignore structures355.(b)",
      "The infrared spectrum shows an absorption/peak in the range3230 to 3550 (cm–1)(which supports the idea that an alcohol is present)In",
      ", allow the words “dip”, “spike”, “low transmittance” and“trough” as alternatives for absorption",
      "Reference to the ‘fingerprint region’ or below 1500 (cm–1)",
      "Match with or same as known sample/database spectraCheck the spectrum to see if alcohol OH is labelled and credit.ORM2 Run infrared spectra (of the alcohols)",
      "Find which one matches or is the same as this spectrum.3Aston Manor Academy",
      "balanced equationC6H12O6 → CH3CH2CH2CH2OH + 2CO2 + H2O or C4H9OHOr multiples for"
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc56",
    board: "aqa",
    category: "Organic Chemistry",
    marks: 15,
    question: `e the white precipitate and state what you would observe when an excess of aqueousammonia is added to it.(3)(d) The reaction of chlorine with ethene is similar to that of bromine with ethene.Name and outline a mechanism for the reaction of chlorine with ethene to form1,2-dichloroethane, as shown by the following equation.H2CCH2 + Cl2 → ClCH2CH2Cl`,
    markScheme: [
      "Cl2 (provides the pale green colour)",
      "requires the formulaM2 NaOH reacts with the acid(s)/the HCl/the HClO/H+",
      "requires a correct answer in M2Equilibrium shifts (from left ) to rightOR wtte356.(b)",
      "A reducing agent is an electron donor OR (readily) loses/gives away electronsPenalise",
      "if “electron pair donor”",
      "Cl2 + 2e– → 2Cl–For",
      ", iodide ions are stronger reducing agents thanchloride ions, because",
      "insist on “iodide ions”",
      "Strength of attraction for electron(s) being lostElectron(s) lost from an iodide ion is less strongly held by the nucleuscompared with that lost from a chloride ionM3 and",
      "must be comparative and should refer to electrons.(assume argument refers to iodide ions but accept converse argumentfor chloride ions)4(c)"
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc57",
    board: "aqa",
    category: "Inorganic Chemistry",
    marks: 18,
    question: `olution is 1.74 × 10–5 mol dm–3(i) Write an expression for the acid dissociation constant, Ka, for ethanoic acid.(1)(ii) Calculate the pH of 0.410 mol dm–3 ethanoic acid at this temperature.(3)(iii) Calculate the pH of the buffer solution formed when 10.00 cm3 of 0.100 mol dm–3potassium hydroxide are added to 25.00 cm3 of 0.410 mol dm–3 ethanoic acid.`,
    markScheme: [
      "mol OH– = (10.0 × 10–3) × 0.10 = 1.0 × 10–3If no subtraction or other wrong chemistry the max score is 3 forM1",
      "and M41M2 orig mol HA = (25.0 × 10–3) × 0.41 = 0.010251or 1.025 × 10–2 or 1.03 × 10–2Aston Manor Academy",
      "mol HA in buffer = orig mol HA – mol OH–1 = 0.00925 or 0.0093If A– is wrong, max 3 for",
      "or use ofpH = pKa – log [HA]/[A–]",
      "mol A– in buffer = mol OH– = 1.0 × 10–3Mark is for insertion of correct numbers in correct expression for[H+]11(= 1.61 × 10–4 or 1.62 × 10–4)",
      "pH = 3.79 can give six ticks for 3.79if [HA]/[A–] upside down lose",
      "& M6If wrong method e.g. [H+]2/[HA] max 3 for",
      "and M3Some may calculate concentrations[HA] = 0.264 and [A–] = 0.0286 and rounding this to 0.029 gives pH= 3.80 (which is OK)NB Unlike (c)(ii), this pH mark is"
    ],
    examTip: "This question is worth 18 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc58",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 15,
    question: `(a) State and explain the trend in electronegativities across Period 3 from sodium to sulfur.(4)58.(b) Explain why the oxides of the Period 3 elements sodium and phosphorus have differentmelting points. In your answer you should discuss the structure of and bonding in theseoxides, and the link between electronegativity and the type of bonding.(6)(c) A chemical company has a waste tank of volume 25 000 dm3. The tank is full of phosphoricacid (H3PO4) solution formed by adding some unwanted phosphorus(V) oxide to water inthe tank.A 25.0 cm3 sample of this solution required 21.2 cm3 of 0.500 mol`,
    markScheme: [
      "is for 1/31Moles of P in 25000 l = 0.00353 × 106 = 3.53 × 103M3 is for factor of 1,000,0001Moles of P4O10 = 3.53 × 103/4M4 is for factor of 1/4 (or 1/2 if P2O5)1Mass of P4O10 = 3.53 × 103/4 × 284 = 0.251 × 106 g = 251 kg(Or if P2O5 3.53 × 103/2 × 142",
      "is for multiplying moles by Mr with correct unitsallow conseq on incorrect",
      "(allow 250-252)1"
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc59",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 15,
    question: `ment.(2)(ii) Sketch a curve to show how you would expect the concentration of manganate(VII)ions to change with time until the colour has faded because the concentration hasreached a very low value. Explain the shape of the curve.`,
    markScheme: [
      "Use the mark scheme to award up to 15 marks based on the key chemistry points covered."
    ],
    examTip: "This question is worth 15 marks. Make sure you address all parts systematically."
  },
  {
    id: "doc60",
    board: "aqa",
    category: "Bonding & Structure",
    marks: 20,
    question: `(a) Describe the bonding in, and the structure of, sodium chloride and ice. In each case draw adiagram showing how each structure can be represented. Explain, by reference to thetypes of bonding present, why the melting point of these two compounds is very different.(12)60.(b) Explain how the concept of bonding and non-bonding electron pairs can be used to predictthe shape of, and bond angles in, a molecule of sulfur tetrafluoride, SF4.Illustrate your answer with a diagram of the structure.`,
    markScheme: [
      "(b)MarkRangeThe marking scheme for this part of the question includes an overallassessment for the Quality of Written Communication (QWC)"
    ],
    examTip: "This question is worth 20 marks. Make sure you address all parts systematically."
  }
,
  {
    id: "ocr01",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 8,
    question: `The table below gives some information about the elements magnesium and oxygen and the compound magnesium oxide. Substance Magnesium Oxygen Magnesium oxide Melting point /K 922 55 3125 Electrical conductivity Conducts when solid or molten None Conducts when molten or aqueous Explain the differences in physical properties between these three substances, referring to  the structure and bonding present.`,
    markScheme: [
      "Magnesium has metallic bonding – a lattice of positive metal ions surrounded by a sea of delocalised electrons.",
      "There are strong electrostatic forces of attraction between the positive ions and delocalised electrons – these require a lot of energy to overcome so magnesium has a high melting point.",
      "The delocalised electrons are free to move through the structure and carry charge, so magnesium conducts electricity.",
      "Magnesium oxide has an ionic lattice structure – strong electrostatic forces of attraction between oppositely charged ions.",
      "The attractions require a lot of energy to overcome so magnesium has a very high melting point.",
      "As a solid, the ions are fixed in place by the strong ionic bonds so are not free to move.",
      "When molten or aqueous, ions are free to move and carry charge so magnesium oxide conducts when molten or aqueous but not when solid.",
      "Oxygen has a covalent molecular structure.",
      "Although there are strong covalent bonds between oxygen atoms, there are only weak intermolecular forces between molecules which do not require a lot of energy to overcome, so oxygen has a very low melting point.",
      "There are no delocalised electrons or free moving ions in oxygen, so it does not conduct electricity."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr02",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: `Aluminium forms compounds with group 7 elements with the empirical formula AlX3. Aluminium chloride and aluminium fluoride are both solids which sublime (they turn from a solid to a gas when heated). The sublimation temperature of aluminium fluoride is over 1000°C higher than that of aluminium fluoride. Explain why the two halides have such different sublimation temperatures. You should refer to the structure and bonding present in the two compounds and also refer to the electronegativity values given below: Element Electronegativity value Aluminium 1.5 Chlorine 3.0 Fluorine 4.0`,
    markScheme: [
      "Fluorine is more electronegative than chlorine.",
      "When aluminium bonds with fluorine, the electronegativity difference is large and aluminium fluoride is an ionic compound.",
      "When aluminium bonds with chlorine, the electronegativity difference is smaller and aluminium chloride is a covalent compound.",
      "Aluminium fluoride is an ionic lattice – there are strong electrostatic forces of attraction between oppositely charged ions.",
      "These take a lot of energy to overcome, so aluminium fluoride has a high sublimation temperature.",
      "Aluminium chloride is a covalent molecule – there are only weak intermolecular forces between molecules, so it sublimes at a much lower temperature than aluminium fluoride."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr03",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: `Water molecules can accept hydrogen ions from acids to form the H3O+ ion. Use electron pair repulsion theory to predict and explain why the shapes and bond angles in water and the H3O+ ion differ. You can use diagrams in your answer.`,
    markScheme: [
      "In water the oxygen atom has four areas of electrons: two lone pairs and two bonds.",
      "Electron pairs repel, so move apart to minimise repulsion.",
      "The largest angle they could move apart would be 109.5°, but lone pairs repel more than bonded pairs so the angle is reduced to 104.5°.",
      "The shape is non-linear.",
      "In H3O+ the oxygen atom also has four areas of electrons: one lone pair and three bonds.",
      "There is only one lone pair, so the bond angle is reduced less than in water, to 107°.",
      "The shape is (trigonal) pyramidal."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr04",
    board: "ocr",
    category: "Bonding & Structure",
    marks: 6,
    question: `The graph opposite shows the boiling point of the hydrogen halides. Explain the pattern in boiling points in relation to the bonding, structure and intermolecular forces present in the four compounds.  HF HI HBr HCl`,
    markScheme: [
      "HF HI HBr HCl All four compounds are covalent molecular.",
      "HF has hydrogen bonding, which is the strongest intermolecular force and takes the most energy to overcome.",
      "This gives HF the highest boiling point.",
      "HCl, HBr and HI all have permanent dipole attractions and Van der Waals forces.",
      "These are weaker than hydrogen bonding.",
      "As you go down the group, the halide molecule becomes larger and contains more electrons.",
      "The strength of the Van der Waals forces therefore increases as you go down the group, so the boiling points of the molecules increase as it takes more energy to overcome these forces."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr05",
    board: "ocr",
    category: "Atomic Structure & Periodicity",
    marks: 6,
    question: `The first 5 ionisation energies of the elements magnesium and aluminium are given below: Magnesium Aluminium 1st 738 578 Ionisation Energy / kJ mol-1 3rd 7733 2745 4th 10541 11578 2nd 1451 1817 5th 13629 14831 With reference to the electron configurations of the elements, explain the differences between: • The first ionisation energies of the two elements • The second ionisation energies of the two elements`,
    markScheme: [
      "Electron configurations: Mg 1s2 2s2 2p6 3s2, Al 1s2 2s2 2p6 3s2 3p1 First ionisation energies: The electron removed from Mg is from the 3s subshell, whereas the electron removed from Al is from the 3p subshell.",
      "The 3p subshell is higher in energy than the 3s, so (despite the increased nuclear charge of Al) the attraction between the nucleus and outer electron is weaker so the electron takes less energy to remove from aluminium.",
      "Second ionisation energies: The second electron is removed from the same subshell (3s) for both Mg and Al.",
      "Aluminium has a greater nuclear charge, so the electron being removed is more strongly attracted to the nucleus.",
      "The second electron is therefore more difficult to remove from Al and the second I.E is higher."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr06",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `Outline a two-stage procedure to produce the ester, ethyl ethanoate using ethanol as the only organic reagent. For each step in the procedure you should include: reagents and conditions, chemical equations and the type of reaction taking place. Details of reaction mechanisms or purification steps are not required.`,
    markScheme: [
      "Prepare a sample of ethanoic acid from some of the ethanol: Reflux ethanol with excess acidified potassium dichromate to produce ethanoic acid.",
      "Equation: CH3CH2OH + 2[O] → CH3COOH + H2O Type of reaction: oxidation React ethanoic acid with ethanol: Reflux ethanoic acid and ethanol in the presence of concentrated sulfuric acid (catalyst).",
      "Equation: CH3CH2OH + CH3COOH → CH3COOCH2CH3 + H2O Type of reaction: condensation"
    ],
    examTip: "OCR A: structured answers score best. Cover each stage in order with reagents, conditions and equations."
  },
  {
    id: "ocr07",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `Using calcium as an example, describe the reactions of group 2 metals with cold water. You should include a balanced equation, observations you would make and an explanation of why this is a redox reaction. Describe and explain the trend in reactivity of group 2 metals as you go down the group.`,
    markScheme: [
      "Reactions of group 2 metals with water: Balanced equation: Ca + 2H2O → Ca(OH)2 + H2 Observations: bubbling, the metal disappears. (For calcium there will be a slight white precipitate formed as calcium hydroxide is only slightly soluble).",
      "The calcium goes from oxidation state/charge of zero to +2: it loses electrons and is oxidised.",
      "Hydrogen (in water) goes from oxidation state +1 to zero: it gains electrons and is reduced.",
      "Trend in reactivity: Metals get more reactive as you go down the group.",
      "There are more electron shells, so more shielding and the outer electrons are further from the nucleus.",
      "The attraction between outer electrons and nucleus is weaker down the group so it takes less energy to remove the electrons."
    ],
    examTip: "OCR A extended response: you must both describe AND explain. Don't just state observations - link them to underlying chemistry."
  },
  {
    id: "ocr08",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 8,
    question: `You are given aqueous solutions of chlorine, bromine and iodine along with solid samples of potassium chloride, potassium bromide and potassium iodide. Describe how you could use these chemicals to demonstrate the trend in oxidising ability as you go down the group.. You should include observations you would make along with examples of full balanced and ionic equations for reactions that take place. You do not need to include details of practical equipment.`,
    markScheme: [
      "Practical procedure and observations: Add the aqueous halogens to small samples of the solid halides and observe colour changes.",
      "A stronger oxidising agent (more reactive halogen) will displace a weaker oxidising agent (less reactive halogen) from its compound.",
      "Observations and deductions: Chlorine + potassium bromide turns from colourless to orange (bromine formed) - Chlorine stronger oxidising agent than bromine Chlorine + potassium iodide turns from colourless to brown (iodine produced) - Chlorine stronger oxidising agent than iodine",
      "Example equations: chlorine + potassium bromide: Full equation: Cl2 + 2KBr → 2KCl + Br2 Ionic equation: Cl2 + 2Br- → 2Cl- + Br2"
    ],
    examTip: "OCR A: be specific and systematic. List reagents, observations and conclusions clearly."
  },
  {
    id: "ocr09",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: `The graph opposite shows the standard enthalpy of combustion against carbon chain length for the first eight straight chain alkanes (because all the reactions are exothermic, for simplicity -ΔHc has been plotted). Give the definition for standard enthalpy of combustion, and write a balanced equation (including state symbols) for this reaction using butane as an example. 1 - l o m J k / c H Δ - Number of carbons in chain Explain, in terms of bond making and breaking, why the reactions are exothermic and why  the graph shows a linear relationship.`,
    markScheme: [
      "Number of carbons in chain [6 marks] Definition and equation: The enthalpy change/energy released when one mole of a substance/compound burns completely/in excess oxygen under standard conditions.",
      "C4H10 (g) + 6.5 O2 (g) → 4 CO2 (g) + 5 H2O (l) Explanation Reactions are exothermic because the energy required/absorbed to break bonds in the reactants is less than the energy released when new bonds are made in the products.",
      "As the number of carbons increases, the number of C-C, C-H and O=O bonds broken increases by the same amount each time.",
      "The number of C=O bonds and O-H bonds made also increases by the same amount each time.",
      "Therefore the difference in ΔHc values is the same each time the carbon chain length increases."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr10",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `You are provided with unlabelled samples of three isomeric alcohols: • Butan-1-ol • Butan-2-ol • 2-methylpropan-2-ol You also have access to common laboratory equipment and chemicals. Outline a practical procedure which would identify each of the three alcohols using chemical reactions and observations alone. You do not need to include descriptions or diagrams of practical apparatus, nor refer to safety procedures.`,
    markScheme: [
      "Identification of 2-methylpropan-2-ol: Heat/warm each sample with acidified potassium dichromate.",
      "Butan-1-ol (primary alcohol) and butan-2-ol (secondary alcohol) will both turn the mixture from orange to green. 2- methylpropan-2-ol (tertiary alcohol) will not change.",
      "Identification of butan-1-ol and butan-2-ol: Take fresh samples of each of the remaining alcohols.",
      "Heat with acidified potassium dichromate and separate the product immediately with distillation.",
      "Test the product with Tollen’s reagent.",
      "Butan-1-ol will produce an aldehyde as the distillate, which will produce a silver mirror.",
      "Butan-2-ol will produce a ketone, which will not react with Tollen’s."
    ],
    examTip: "OCR A: structured answers score best. Cover each stage in order with reagents, conditions and equations."
  },
  {
    id: "ocr11",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `You are given three unlabelled solids that are known to be: sodium carbonate, sodium chloride and sodium bromide. Outline a procedure that could be used to identify each sample using simple laboratory tests and write ionic equations for the reactions that take place.`,
    markScheme: [
      "Dissolve the solids in distilled/deionised water and carry out the following tests, using fresh samples each time.",
      "Identifying the carbonate: Add hydrochloric acid (could also be sulfuric or nitric acid): the sample that produces bubbles/effervesces contains sodium carbonate.",
      "Equation: 2H+ + CO3 Identifying halides: Add nitric acid and silver nitrate solution.",
      "Sodium chloride will give a white precipitate and sodium bromide will give a cream precipitate.",
      "Equations: Ag+ (aq) + Cl- (aq) → AgCl (s) Ag+ (aq) + Br- (aq) → AgBr (s) 2- → CO2 + H2O"
    ],
    examTip: "OCR A: structured answers score best. Cover each stage in order with reagents, conditions and equations."
  },
  {
    id: "ocr12",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 8,
    question: `Three different organic compounds are isomers with the molecular formula C5H10O. None of the compounds exist as stereoisomers. More information about each isomer is presented in the table below: Isomer Information from IR spectrum Information from chemical tests Information from mass spectrum X Broad peak around 3500 cm-1 Peak at 1650 cm-1 Reacts with bromine water but does not react with acidified potassium dichromate Peaks include m/z values: 15, 27, 59 Y Broad peak around 3500 cm-1 Does not react with bromine water but does react with acidified potassium dichromate Peaks include m/z values: 17 and 69 Z Broad peak around 3500 cm-1 Peak at 1650 cm-1 Reacts with bromine water and with acidif`,
    markScheme: [
      "Mass spec peaks: 17 = OH+, 69 = C5H9 + Compound Z: IR spectrum shows O-H (3500) and C=C (1650).",
      "Must be a cyclic alcohol; does react with dichromate so could be primary or secondary alcohol.",
      "No reaction with bromine water and no C=C on IR spectrum, but does contain C:H ratio 1:2.",
      "C=C bond needs to have two of the same groups on one side and peak at 27 matches CH2=CH-.",
      "This leaves 3 carbons – OH must be on the end otherwise there would be optical isomers.",
      "+, 27 = C2H3 +, 59 = C3H6OH+ Compound X: IR spectrum shows C=C (1650) and O-H (3500).",
      "Mass spec peaks: 15 = CH3 Compound Y: IR spectrum shows O-H (3500).",
      "It does not react with dichromate so must be a tertiary alcohol.",
      "Reacts with dichromate so could be primary or secondary alcohol.",
      "Mass spec peaks: 27 = C2H3 +, 31 = CH2OH+, 59 = CH2CH2CH2OH+"
    ],
    examTip: "OCR A 8-mark question: aim for clear, concise points covering structure, bonding and relevant chemistry."
  },
  {
    id: "ocr13",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `Draw the structures of all the possible isomers with the formula C4H8 that contain a C=C bond. Name the isomers and use them as examples to explain the different types of isomerism occurring. You should include any relevant definitions in your answer.`,
    markScheme: [
      "Structural isomers: (Molecules with) the same molecular formula and different structure/structural formula.",
      "Structural isomers are but-1-ene, but-2-ene and methylpropene as shown below: But-1-ene and but-2-ene are position isomers.",
      "Methylpropene is a chain isomer.",
      "Stereoisomers/geometric isomers/E/Z isomers: But-2-ene has E/Z isomerism.",
      "This occurs due to restricted rotation around the C=C bond, and the fact that but-2-ene has 2 different groups attached to each carbon on the C=C bond.",
      "In (Z) but-2-ene, the two highest priority groups (the methyl groups) are on the same side of the C=C bond relative to each other.",
      "In the E isomer they are on opposite sides of the C=C bond."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr14",
    board: "ocr",
    category: "Equilibrium",
    marks: 8,
    question: `Hydrogen is produced in industry from the reaction between methane and steam. The first stage in this process is shown below. CH4 (g) + H2O (g) ⇌ CO (g) + 3H2 (g) ΔH = +206 kJ mol-1 Use ideas about rates of reaction, collision theory and Le Chatelier’s principle to explain why conditions of high temperature and high pressure are used in this process.`,
    markScheme: [
      "The forward reaction is endothermic, so increasing temperature will shift the position of equilibrium to the right hand side, producing more hydrogen.",
      "Particles therefore collide more often, and a greater proportion of collisions are successful as more particles have at least the activation energy.",
      "This is because there are more particles in a given volume, so particles collide more often and there will be more successful collisions per second.",
      "Increasing pressure shifts the position of equilibrium to the side with fewer moles of gas, which is the left hand side.",
      "So high pressure produces a lower yield, but lower pressures would result in too slow a rate of reaction.",
      "High temperature: High temperature increases rate of reaction.",
      "High pressure: High pressure increases rate of reaction.",
      "So there will be more successful collisions per second.",
      "This is because particles have more kinetic energy.",
      "High temperature also increases yield."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr15",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 6,
    question: `The structure of three organic compounds - benzene, ethylamine and phenylamine – are shown opposite. • Explain whether you would expect phenylamine to be a stronger or weaker base than ethylamine • Explain whether you would expect phenylamine to be more or less reactive than benzene in electrophilic substitution reactions. In your answer you should include relevant definitions and examples, but do not need to include equations or mechanisms.`,
    markScheme: [
      "Comparison of base behaviour: Phenylamine is a weaker base than ethylamine.",
      "A base is a proton acceptor – both contain an amine functional group which acts as a base when the lone pair on the nitrogen bonds with H+.",
      "In phenylamine, the lone pair on the nitrogen delocalises into the benzene ring – this makes it less available to donate to H+ and therefore phenylamine is a weaker base.",
      "Comparison of electrophilic substitution reactions: Phenylamine would be more reactive than benzene in electrophilic substitution reactions.",
      "Electrophiles are attracted to the electron density of the benzene ring and accept a pair of electrons from the system in the first part of the electrophilic substitution mechanism.",
      "In phenylamine, the lone pair of the nitrogen delocalises into the benzene ring, increasing the electron density of the ring and therefore making it react more readily with electrophiles."
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr16",
    board: "ocr",
    category: "Acid-Base Chemistry",
    marks: 6,
    question: `Ethanoic acid is a weak acid that can be used to prepare a buffer solution. Describe how you would use a solution of ethanoic acid and a solution of sodium hydroxide, both of equal concentrations, to prepare a buffer solution. Explain how your solution could act as a buffer when small amounts of hydrochloric acid are added. You may illustrate your answer with equations, but do not need to include calculations.`,
    markScheme: [
      "Preparation of buffer: Mix together the acid and sodium hydroxide – approximately half the volume of sodium hydroxide compared to ethanoic acid.",
      "The sodium hydroxide will react with the ethanoic acid to form its salt/conjugate base (sodium ethanoate): CH3COOH + NaOH → CH3COONa + H2O CH3COOH ⇌ CH3COO- + H+ A buffer solution contains a mixture of a weak acid and its conjugate base.",
      "How the solution acts as a buffer: The buffer contains both the weak acid and its conjugate base in equilibrium: When a small amount of acid is added, the H+ ions react with the CH3COO- ions to form CH3COOH.",
      "Therefore, the concentration of CH3COOH increases slightly and the concentration of CH3COO- decreases slightly.",
      "However, because the buffer solution contains relatively large amounts of both, the ratio does not change significantly and neither does the pH."
    ],
    examTip: "OCR A extended response: you must both describe AND explain. Don't just state observations - link them to underlying chemistry."
  },
  {
    id: "ocr17",
    board: "ocr",
    category: "Inorganic Chemistry",
    marks: 6,
    question: `Transition metal ions can form complex ions with different coordination numbers and shapes, depending on the transition metal and ligand involved. Some of these complexes can exist as stereoisomers. Describe the types of stereoisomerism that can exist in transition metal complexes. You should refer to specific examples where possible, and illustrate your answer with relevant diagrams.`,
    markScheme: [
      "Cis/trans isomers: Platinum forms square planar complexes with a coordination number of 4.",
      "If there are two different ligands then cis/trans isomers can form, for example: Cisplatin (left) – both same type of ligand on the same side.",
      "Transplatin (right) – both same type of ligand on opposite sides.",
      "Cis/trans isomerism also occurs in octahedral complexes with coordination number of 6, so long as there are two different ligands.",
      "For example: The left hand complex is trans as the two water molecules are 180° apart.",
      "The complex on the right is cis, as the two water molecules are 90° apart.",
      "Optical isomers: Octahedral complexes can form optical isomers if they contain at least two bidentate ligands.",
      "Optical isomers are non-superimposable mirror images, as shown in the diagram:"
    ],
    examTip: "OCR A: be specific and systematic. List reagents, observations and conclusions clearly."
  },
  {
    id: "ocr18",
    board: "ocr",
    category: "Organic Chemistry",
    marks: 8,
    question: `1-chloropropane can be prepared in two different reactions: • The electrophilic addition reaction between HCl and propene • The free radical substitution reaction between chlorine and propane in the presence of UV light For each reaction, outline the mechanism and explain why neither reaction will produce a high yield of the desired product. You should refer to how the reaction mechanisms give rise to alternative products.`,
    markScheme: [
      "Electrophilic addition mechanism: The reaction proceeds via a carbocation intermediate.",
      "There are two possible carbocations that can form, primary or secondary.",
      "The secondary carbocation is more stable, so the reaction will be more likely to proceed by this route and the major product will be 2-chloropropane.",
      "Free radical substitution mechanism: Initiation: Propagation: Termination: It is random which hydrogen is replaced in the propagation steps, so C3H7Cl could be 1-chloropropane or 2-chloropropane.",
      "If there is an excess of alkane then an alternative termination is more likely: 2 C3H7• → C6H14 If there is an excess of chlorine then multiple substitutions can occur to produce dichloroalkanes, trichloroalkanes etc.",
      "Cl2 → 2Cl• Cl• + C3H8 → HCl + C3H7• C3H7• + Cl2 → C3H7Cl + Cl• Cl• + C3H7•→ C3H7Cl"
    ],
    examTip: "OCR A: use 'because' or 'so' to link your points together into a logical chain of reasoning."
  },
  {
    id: "ocr19",
    board: "ocr",
    category: "Energetics",
    marks: 6,
    question: `Describe how you could carry out an experiment to calculate enthalpy of neutralisation in kJmol-1. You are provided with solutions of hydrochloric acid and sodium hydroxide of equal concentrations along with standard laboratory equipment. In your answer you should clearly state the measurements you would take. You should also explain how results from the experiment would be used to calculate the enthalpy of neutralisation, and what assumptions you made in this calculation.`,
    markScheme: [
      "Measure out 25cm3 hydrochloric acid using a volumetric pipette and add to a polystyrene",
      "Place the polystyrene cup in a beaker and use a thermometer to take its temperature – repeat every 30 seconds for two minutes to ensure temperature is not changing",
      "Add 25cm3 sodium hydroxide solution using a volumetric pipette.",
      "Stir with the thermometer and record the highest temperature reached.",
      "Calculate the change in temperature Calculations:",
      "Moles of acid (or alkali) = concentration x volume in dm3",
      "Heat energy transferred (in J) = mass of solution x 4.18 x change in temperature",
      "Convert energy in J to kJ (/1000) and divide by moles to get enthalpy change"
    ],
    examTip: "OCR A extended response: you must both describe AND explain. Don't just state observations - link them to underlying chemistry."
  },
  {
    id: "ocr20",
    board: "ocr",
    category: "Practical Chemistry",
    marks: 6,
    question: `Hydrated sodium carbonate (Na2CO3.10H2O) is a solid at room temperature and is soluble in water. Describe how you would prepare 250cm3 of a solution of hydrated sodium carbonate (Na2CO3.10H2O) with an accurately known concentration of approximately 0.0100 moldm-3. You should include a calculation with your answer.  Mark scheme and notes If you’re a student, make sure you try the question under exam conditions before you look at the mark scheme to get the most out of the practice. You can allow a little more than one minute per mark, as these questions usually take a bit longer (other questions will take less than one minute usually). Each question comes with a “model answer” – this does not `,
    markScheme: [
      "Weighing the solid/calculations: Moles of solid = 0.01 x 0.25 = 0.0025 Mr = 106 + (10 x 18) = 286 Mass of solid required = 0.0025 x 286 = 0.715g • Zero the balance and add an empty weighing boat.",
      "Note the mass and add approximately 0.715g solid.",
      "Write down the mass of solid and weighing boat. • Add the solid to a clean dry beaker, then reweigh the weighing boat.",
      "Subtract the mass of the empty boat to obtain the accurate mass of solid used.",
      "Making the solution: • Add around 100 cm3 distilled water to the beaker and stir to dissolve the solid • Pour the solution into a 250cm3 volumetric flask using a funnel • Rinse the beaker with more distilled water and add to the flask • Add distilled water to the flask until just"
    ],
    examTip: "OCR A: be specific and systematic. List reagents, observations and conclusions clearly."
  }
];

const SYNTH_ROUTES = [
  // FROM: Alkane
  { from:"Alkane", to:"Halogenoalkane", reagents:"Cl₂ or Br₂", conditions:"UV light (hν), room temperature", mechanism:"Free Radical Substitution", notes:"Mixture of products formed (mono-, di-, tri-substituted etc.). Cl₂ is more reactive than Br₂ but Br₂ is more selective.", steps:[
    { stage:"Initiation", equation:"Cl₂  →  2Cl•", arrow:"hν (UV light)", note:"UV light supplies energy to break the Cl–Cl bond homolytically. Each chlorine atom takes one electron, forming two highly reactive chlorine radicals. This is the only step that requires an energy input." },
    { stage:"Propagation 1", equation:"Cl•  +  CH₄  →  CH₃•  +  HCl", arrow:"", note:"A chlorine radical abstracts a hydrogen atom from methane (takes the H along with its electron). A methyl radical (CH₃•) is produced alongside HCl. The chlorine radical is consumed but a new radical is generated — the chain continues." },
    { stage:"Propagation 2", equation:"CH₃•  +  Cl₂  →  CH₃Cl  +  Cl•", arrow:"", note:"The methyl radical reacts with a Cl₂ molecule, abstracting one chlorine atom. Chloromethane (the product) is formed, and a chlorine radical is regenerated — restarting Propagation 1. Steps 1 and 2 repeat thousands of times." },
    { stage:"Termination", equation:"Cl•  +  Cl•  →  Cl₂\nCH₃•  +  Cl•  →  CH₃Cl\nCH₃•  +  CH₃•  →  C₂H₆", arrow:"", note:"Any two radicals collide and combine, destroying both radicals and ending the chain. Three possible termination reactions are shown. The formation of ethane (C₂H₆) as a minor byproduct is evidence that CH₃• radicals exist during the reaction." },
  ], board:"both" },

  // FROM: Alkene
  { from:"Alkene", to:"Alkane", reagents:"H₂, Ni catalyst", conditions:"150°C", mechanism:"Catalytic Hydrogenation", notes:"Heterogeneous catalysis. H atoms adsorb onto Ni surface, then transferred to alkene.", board:"both" },
  { from:"Alkene", to:"Halogenoalkane", reagents:"HBr or HCl", conditions:"Room temperature, no catalyst", mechanism:"Electrophilic Addition", notes:"Markovnikov's rule for unsymmetrical alkenes: H adds to C with more H (via more stable secondary carbocation). Produces single haloalkane.", board:"both" },
  { from:"Alkene", to:"Dihalide", reagents:"Br₂ (bromine water or pure)", conditions:"Room temperature, no catalyst", mechanism:"Electrophilic Addition", notes:"Bromine water decolourises — test for C=C. Anti addition gives trans product. Produces 1,2-dibromoalkane.", board:"both" },
  { from:"Alkene", to:"Alcohol", reagents:"H₂O (steam), H₃PO₄ catalyst", conditions:"300°C, 60–70 atm", mechanism:"Electrophilic Addition (hydration)", notes:"Reversible reaction. H₃PO₄ is the acid catalyst. Markovnikov's rule applies for unsymmetrical alkenes → secondary alcohol preferred.", board:"both" },
  { from:"Alkene", to:"Diol", reagents:"Cold dilute KMnO₄ (alkaline)", conditions:"Room temperature, alkaline conditions", mechanism:"Oxidation (dihydroxylation)", notes:"OCR only. KMnO₄ is decolourised from purple → colourless. Syn addition. Alternatively O₃ then H₂O₂ gives carbonyl products.", board:"ocr" },
  { from:"Alkene", to:"Addition Polymer", reagents:"Monomer only (no other reagents)", conditions:"High pressure, Ziegler-Natta catalyst or radical initiator", mechanism:"Addition Polymerisation", notes:"n(CH₂=CHX) → (–CH₂–CHX–)ₙ. No atoms lost. Polymer is not biodegradable. Draw repeat unit with bonds through brackets.", board:"both" },

  // FROM: Halogenoalkane
  { from:"Halogenoalkane", to:"Alcohol", reagents:"NaOH(aq) or KOH(aq)", conditions:"Aqueous, reflux", mechanism:"Nucleophilic Substitution (SN2 for 1°, SN1 for 3°)", notes:"OH⁻ is the nucleophile. 1°: SN2 — backside attack, inversion of configuration. 3°: SN1 — carbocation intermediate, racemic mixture. Rate: I > Br > Cl (bond strength).", board:"both" },
  { from:"Halogenoalkane", to:"Alkene", reagents:"KOH (or NaOH) in ethanol", conditions:"Alcoholic solvent, heat (reflux)", mechanism:"Elimination (E2)", notes:"Hot ethanolic KOH favours elimination. HX eliminated. Produces alkene. Cold aqueous KOH favours substitution.", board:"both" },
  { from:"Halogenoalkane", to:"Nitrile", reagents:"KCN (or NaCN) in ethanol", conditions:"Ethanol solvent, reflux", mechanism:"Nucleophilic Substitution (SN2)", notes:"CN⁻ is the nucleophile. Chain extended by ONE carbon. Product can be hydrolysed to carboxylic acid or reduced to amine.", board:"both" },
  { from:"Halogenoalkane", to:"Amine", reagents:"Excess concentrated NH₃ in ethanol", conditions:"Sealed tube (pressure), heat", mechanism:"Nucleophilic Substitution", notes:"Excess NH₃ needed to avoid polyalkylation. 1° amine formed first, then 2° and 3° amines and quaternary ammonium salts as side products.", board:"both" },
  { from:"Halogenoalkane", to:"Ether", reagents:"NaOR (sodium alkoxide)", conditions:"Ethanol solvent, reflux", mechanism:"Nucleophilic Substitution (Williamson synthesis)", notes:"Alkoxide ion RO⁻ acts as nucleophile. Used for Williamson ether synthesis.", board:"ocr" },

  // FROM: Primary Alcohol
  { from:"Primary Alcohol", to:"Aldehyde", reagents:"K₂Cr₂O₇/H₂SO₄ (acidified dichromate)", conditions:"Warm, distil off product immediately", mechanism:"Oxidation", notes:"Distil as formed to prevent further oxidation to carboxylic acid. K₂Cr₂O₇ turns orange → green. Can also use [O] notation.", board:"both" },
  { from:"Primary Alcohol", to:"Carboxylic Acid", reagents:"Excess K₂Cr₂O₇/H₂SO₄", conditions:"Reflux (to prevent product escaping)", mechanism:"Oxidation", notes:"Primary alcohol oxidised twice: 1° alcohol → aldehyde → carboxylic acid. Excess oxidising agent and reflux ensures full conversion.", board:"both" },
  { from:"Primary Alcohol", to:"Alkene", reagents:"Conc H₃PO₄ or Al₂O₃", conditions:"~180°C (H₃PO₄) or 350°C (Al₂O₃)", mechanism:"Acid-catalysed Elimination (dehydration)", notes:"Loss of H₂O across adjacent C atoms. If multiple alkenes possible, Zaitsev's rule gives more substituted alkene as major product.", board:"both" },
  { from:"Primary Alcohol", to:"Halogenoalkane", reagents:"NaBr + conc H₂SO₄, or PCl₅, or SOCl₂", conditions:"Reflux (NaBr/H₂SO₄); room temperature (PCl₅)", mechanism:"Nucleophilic Substitution", notes:"NaBr/H₂SO₄ gives bromoalkane. PCl₅ gives chloroalkane + HCl fumes (test). SOCl₂ gives chloroalkane + SO₂ + HCl. OH replaced by halide.", board:"both" },
  { from:"Primary Alcohol", to:"Ester", reagents:"Carboxylic acid + conc H₂SO₄ catalyst", conditions:"Reflux (reversible reaction — Fischer esterification)", mechanism:"Condensation (Esterification)", notes:"Reversible — equilibrium mixture. Remove product or add excess of one reagent to improve yield. H₂O eliminated.", board:"both" },

  // FROM: Secondary Alcohol
  { from:"Secondary Alcohol", to:"Ketone", reagents:"K₂Cr₂O₇/H₂SO₄ (acidified)", conditions:"Reflux", mechanism:"Oxidation", notes:"Secondary alcohol → ketone only. No further oxidation possible. K₂Cr₂O₇ orange → green. Ketone cannot be oxidised further by Cr₂O₇²⁻.", board:"both" },
  { from:"Secondary Alcohol", to:"Alkene", reagents:"Conc H₃PO₄ or Al₂O₃", conditions:"~180°C", mechanism:"Acid-catalysed Elimination (dehydration)", notes:"Elimination of H₂O. May give mixture of alkenes if unsymmetrical.", board:"both" },
  { from:"Secondary Alcohol", to:"Halogenoalkane", reagents:"PCl₅ or HBr", conditions:"Room temperature", mechanism:"Nucleophilic Substitution", notes:"PCl₅ → chloroalkane; HBr → bromoalkane. Tertiary alcohols react fastest with HX (more stable carbocation).", board:"both" },

  // FROM: Aldehyde
  { from:"Aldehyde", to:"Primary Alcohol", reagents:"NaBH₄ in water/ethanol, or LiAlH₄ in dry ether", conditions:"Room temperature (NaBH₄); 0°C then careful hydrolysis (LiAlH₄)", mechanism:"Reduction (nucleophilic addition of H⁻)", notes:"NaBH₄ is milder and safer — used in aqueous solution. LiAlH₄ is more powerful but reacts violently with water — used in dry ether. H⁻ (hydride) is the nucleophile.", board:"both" },
  { from:"Aldehyde", to:"Carboxylic Acid", reagents:"K₂Cr₂O₇/H₂SO₄ or Tollens' reagent or Fehling's", conditions:"Reflux (Cr₂O₇²⁻); room temperature (Tollens'/Fehling's)", mechanism:"Oxidation", notes:"Aldehydes are easily oxidised. Tollens': silver mirror formed. Fehling's/Benedict's: blue → brick-red Cu₂O. Ketones NOT oxidised by these reagents.", board:"both" },
  { from:"Aldehyde", to:"Hydroxynitrile", reagents:"HCN + KCN catalyst (or NaCN then dilute HCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition", notes:"CN⁻ is the nucleophile — attacks Cδ+ of C=O. New C–C bond formed. Chain extended by 1C. Creates chiral centre → racemic mixture. HCN alone is too slow (no CN⁻ catalyst).", board:"both" },

  // FROM: Ketone
  { from:"Ketone", to:"Secondary Alcohol", reagents:"NaBH₄ in water/ethanol, or LiAlH₄ in dry ether", conditions:"Room temperature (NaBH₄); 0°C (LiAlH₄)", mechanism:"Reduction", notes:"H⁻ adds to carbonyl. Ketone → secondary alcohol. Not oxidised by Tollens'/Fehling's — can use this to distinguish from aldehyde.", board:"both" },
  { from:"Ketone", to:"Hydroxynitrile", reagents:"HCN + KCN (or NaCN + dil HCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition", notes:"Same mechanism as aldehyde. CN⁻ attacks Cδ+. Racemic mixture produced at new chiral centre.", board:"both" },

  // FROM: Carboxylic Acid
  { from:"Carboxylic Acid", to:"Ester", reagents:"Alcohol + conc H₂SO₄ catalyst", conditions:"Reflux (reversible)", mechanism:"Condensation (Fischer Esterification)", notes:"Acid-catalysed, reversible. H₂SO₄ protonates C=O making it more electrophilic. H₂O eliminated. Named: alkyl alkanoate (e.g. ethyl ethanoate).", board:"both" },
  { from:"Carboxylic Acid", to:"Acyl Chloride", reagents:"PCl₅ or SOCl₂", conditions:"Room temperature (PCl₅) or reflux (SOCl₂)", mechanism:"Nucleophilic Substitution", notes:"PCl₅ gives acyl chloride + POCl₃ + HCl. SOCl₂ gives acyl chloride + SO₂ + HCl (both gaseous byproducts — easy workup). Steamy fumes of HCl confirm reaction with PCl₅.", board:"both" },
  { from:"Carboxylic Acid", to:"Primary Alcohol", reagents:"LiAlH₄ in dry ether", conditions:"Reflux in dry ether, then careful aqueous workup", mechanism:"Reduction", notes:"LiAlH₄ reduces C=O twice: RCOOH → RCHO → RCH₂OH. NaBH₄ cannot reduce carboxylic acids.", board:"both" },
  { from:"Carboxylic Acid", to:"Amide", reagents:"NH₃ (forms ammonium salt first, then heat)", conditions:"Heat ammonium carboxylate salt to ~200°C", mechanism:"Condensation", notes:"RCOOH + NH₃ → RCOONH₄ (salt) → RCONH₂ + H₂O (on strong heating). More easily done via acyl chloride + NH₃.", board:"both" },
  { from:"Carboxylic Acid", to:"Carboxylate Salt", reagents:"NaOH(aq), Na₂CO₃, or NaHCO₃", conditions:"Room temperature (aqueous)", mechanism:"Acid-Base Neutralisation", notes:"RCOOH + NaOH → RCOONa + H₂O. Effervescence (CO₂) with carbonates confirms carboxylic acid. Forms soap when RCOOH = long-chain fatty acid.", board:"both" },

  // FROM: Acyl Chloride
  { from:"Acyl Chloride", to:"Carboxylic Acid", reagents:"Water (cold)", conditions:"Room temperature (vigorous, steamy fumes)", mechanism:"Nucleophilic Addition-Elimination", notes:"Water is the nucleophile. HCl fumes produced. Very fast, exothermic. RCOCl + H₂O → RCOOH + HCl.", board:"both" },
  { from:"Acyl Chloride", to:"Ester", reagents:"Alcohol (ROH)", conditions:"Room temperature or gentle warming", mechanism:"Nucleophilic Addition-Elimination", notes:"Faster and irreversible (unlike Fischer esterification). RCOCl + R'OH → RCOOR' + HCl. HCl fumes produced.", board:"both" },
  { from:"Acyl Chloride", to:"Primary Amide", reagents:"Ammonia (NH₃, anhydrous or aqueous)", conditions:"Room temperature", mechanism:"Nucleophilic Addition-Elimination", notes:"RCOCl + NH₃ → RCONH₂ + HCl. HCl reacts with excess NH₃ to form NH₄Cl (white solid). Very rapid reaction.", board:"both" },
  { from:"Acyl Chloride", to:"N-substituted Amide", reagents:"Primary amine (RNH₂)", conditions:"Room temperature", mechanism:"Nucleophilic Addition-Elimination", notes:"RCOCl + R'NH₂ → RCONHR' + HCl. Product is N-substituted amide. Important step in peptide bond formation.", board:"both" },

  // FROM: Nitrile
  { from:"Nitrile", to:"Primary Amine", reagents:"LiAlH₄ in dry ether, or H₂/Ni catalyst", conditions:"Reflux in dry ether then aqueous workup (LiAlH₄); high pressure/temp (H₂/Ni)", mechanism:"Reduction", notes:"RCN + 2[H₂] → RCH₂NH₂. Chain extended by 1C compared to halogenoalkane used to make the nitrile. Very important for chain extension.", board:"both" },
  { from:"Nitrile", to:"Carboxylic Acid", reagents:"Dilute HCl(aq) or NaOH(aq)", conditions:"Reflux (acid or base hydrolysis)", mechanism:"Hydrolysis", notes:"RCN + H₂O + HCl → RCOOH + NH₄Cl (acid conditions). Or: RCN + H₂O + NaOH → RCOONa + NH₃ (base conditions). Chain still extended by 1C.", board:"both" },

  // FROM: Primary Amine
  { from:"Primary Amine", to:"Amide", reagents:"Acyl chloride (RCOCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition-Elimination", notes:"R'NH₂ + RCOCl → RCONHR' + HCl. Clean, fast reaction. Useful for making amides without polyalkylation problem.", board:"both" },
  { from:"Primary Amine", to:"Ammonium Salt", reagents:"Dilute HCl or other acid", conditions:"Room temperature (aqueous)", mechanism:"Acid-Base reaction", notes:"RNH₂ + HCl → RNH₃⁺Cl⁻. Amines are bases due to lone pair on N. Salts are water-soluble, non-volatile.", board:"both" },

  // FROM: Ester
  { from:"Ester", to:"Carboxylic Acid + Alcohol", reagents:"Dilute H₂SO₄ or HCl (acid hydrolysis)", conditions:"Reflux with excess water", mechanism:"Acid-catalysed Hydrolysis (reversible)", notes:"Reverse of Fischer esterification. Acid catalyst, reversible. Excess water drives equilibrium toward products.", board:"both" },
  { from:"Ester", to:"Carboxylate Salt + Alcohol", reagents:"NaOH(aq) — saponification", conditions:"Reflux", mechanism:"Base-catalysed Hydrolysis (irreversible)", notes:"Saponification — irreversible because carboxylate salt formed is not reactive toward alcohol. Used in soap manufacture. Soap = sodium salt of long-chain fatty acid.", board:"both" },

  // FROM: Arene (Benzene)
  { from:"Arene", to:"Nitrobenzene", reagents:"Conc HNO₃ + conc H₂SO₄ (nitrating mixture)", conditions:"Below 55°C (avoid dinitration)", mechanism:"Electrophilic Aromatic Substitution (nitration)", notes:"H₂SO₄ protonates HNO₃ → NO₂⁺ (nitronium ion, electrophile). Above 55°C gives dinitration. Step 1: NO₂⁺ attacks ring (loss of aromaticity). Step 2: H⁺ lost (aromaticity restored).", board:"both" },
  { from:"Arene", to:"Halogenobenzene", reagents:"Br₂ (or Cl₂) + halogen carrier (AlBr₃ or AlCl₃)", conditions:"Room temperature, anhydrous", mechanism:"Electrophilic Aromatic Substitution (halogenation)", notes:"AlBr₃/AlCl₃ is a Lewis acid catalyst — polarises Br–Br to generate Br⁺. Reaction gives HBr as byproduct. No UV light needed (unlike alkane halogenation).", board:"both" },
  { from:"Arene", to:"Alkylbenzene", reagents:"RCl + AlCl₃ (Friedel-Crafts alkylation)", conditions:"Room temperature, anhydrous", mechanism:"Friedel-Crafts Alkylation (EAS)", notes:"AlCl₃ generates R⁺ carbocation or polarised R–Cl. Problem: multiple alkylation occurs because product is more reactive than starting material.", board:"both" },
  { from:"Arene", to:"Phenyl Ketone (Aryl Ketone)", reagents:"RCOCl + AlCl₃ (Friedel-Crafts acylation)", conditions:"Room temperature, anhydrous", mechanism:"Friedel-Crafts Acylation (EAS)", notes:"AlCl₃ generates acylium ion RCO⁺. Product is a phenyl ketone (aryl ketone). Acyl group deactivates ring → no further substitution. Preferred over alkylation industrially.", board:"both" },

  // FROM: Nitrobenzene
  { from:"Nitrobenzene", to:"Arylamine (Aniline)", reagents:"Sn (tin) + conc HCl, then NaOH(aq)", conditions:"Reflux with Sn/HCl; then add NaOH to liberate free amine", mechanism:"Reduction", notes:"Step 1: Sn + conc HCl reduces NO₂ → NH₃⁺ (phenylammonium salt). Step 2: NaOH added → free amine PhNH₂ liberated. Fe/HCl can also be used industrially.", board:"both" },

  // FROM: Arylamine (Aniline)
  { from:"Arylamine", to:"Diazonium Salt", reagents:"NaNO₂ + HCl(aq)", conditions:"0–5°C (ice bath essential)", mechanism:"Diazotisation", notes:"ArNH₂ + NaNO₂ + HCl → ArN₂⁺Cl⁻ + 2H₂O. MUST keep below 5°C — diazonium salts decompose above 10°C releasing N₂. Cold solution kept for immediate use.", board:"both" },
  { from:"Arylamine", to:"Amide", reagents:"Acyl chloride (RCOCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition-Elimination", notes:"ArNH₂ + RCOCl → ArNHCOR + HCl. N-acylation. Important for protecting the amine group during synthesis.", board:"both" },

  // FROM: Diazonium Salt
  { from:"Diazonium Salt", to:"Azo Dye", reagents:"Phenol or naphthol in NaOH(aq)", conditions:"0–5°C (cold, alkaline solution)", mechanism:"Coupling Reaction (Electrophilic Aromatic Substitution)", notes:"ArN₂⁺ is a weak electrophile — only attacks very reactive rings (phenol, naphthol, arylamines). Product Ar–N=N–Ar' is an azo dye. Brightly coloured due to extended conjugation.", board:"both" },
  { from:"Diazonium Salt", to:"Phenol", reagents:"H₂O (warm)", conditions:"Warm aqueous solution", mechanism:"Substitution with loss of N₂", notes:"ArN₂⁺ + H₂O → ArOH + N₂ + HCl. N₂ gas evolved (driving force). One of the Sandmeyer-type reactions.", board:"both" },
  { from:"Diazonium Salt", to:"Halogenobenzene", reagents:"CuCl/HCl (→ ArCl) or CuBr/HBr (→ ArBr)", conditions:"Warm", mechanism:"Sandmeyer Reaction", notes:"Cu(I) catalyst required. ArN₂⁺ + CuX → ArX + N₂. Allows introduction of Cl or Br onto benzene ring at position occupied by NH₂ group.", board:"both" },
];

const SECTIONS = [
  { id: "physical_as", label: "Physical Chemistry (AS)", sub: "3.1 Year 1", topics: ["3.1.1","3.1.2","3.1.3","3.1.4","3.1.5","3.1.6","3.1.7"] },
  { id: "physical_a2", label: "Physical Chemistry (A2)", sub: "3.1 Year 2", topics: ["3.1.8","3.1.9","3.1.10","3.1.11","3.1.12"] },
  { id: "inorganic_as", label: "Inorganic Chemistry (AS)", sub: "3.2 Year 1", topics: ["3.2.1","3.2.2","3.2.3"] },
  { id: "inorganic_a2", label: "Inorganic Chemistry (A2)", sub: "3.2 Year 2", topics: ["3.2.4","3.2.5","3.2.6"] },
  { id: "organic", label: "Organic Chemistry", sub: "3.3", topics: ["3.3.1","3.3.2","3.3.3","3.3.4","3.3.5","3.3.6","3.3.7"] },
  { id: "organic2", label: "Organic Chemistry (A2)", sub: "3.3 (A2)", topics: ["3.3.9","3.3.10","3.3.11","3.3.12","3.3.13","3.3.14","3.3.15","3.3.16"] },
  { id: "practicals_as", label: "Required Practicals (AS)", sub: "Activities 1-7 (Year 1)", topics: ["RP1a","RP1b","RP12","RP_A3","RP_A4","RP4","RP_A6","RP2","RP_A7b"] },
  { id: "practicals_a2", label: "Required Practicals (A2)", sub: "Activities 8-12 (Year 2)", topics: ["RP8","RP_A9","RP10a","RP6","RP_A11","RP5"] },
];

const TOPIC_ORDER = SECTIONS.flatMap(s => s.topics);

const OCR_SECTIONS = [
  { id: "ocr_mod2", label: "Module 2 – Foundations", sub: "Foundations in Chemistry", topics: ["ocr_2.1.1","ocr_2.1.2","ocr_2.1.3","ocr_2.1.4","ocr_2.2.1","ocr_2.2.2","ocr_2.2.3","ocr_2.3.1"] },
  { id: "ocr_mod3", label: "Module 3 – Periodic Table & Energy", sub: "Periodic Table and Energy", topics: ["ocr_3.1.1","ocr_3.1.2","ocr_3.1.3","ocr_3.1.4","ocr_3.2.1","ocr_3.2.2"] },
  { id: "ocr_mod4", label: "Module 4 – Core Organic", sub: "Core Organic Chemistry", topics: ["ocr_4.1.1","ocr_4.2.1","ocr_4.3.1","ocr_4.4.1"] },
  { id: "ocr_mod5", label: "Module 5 – Physical & Transition", sub: "Physical Chemistry and Transition Elements", topics: ["ocr_5.1.1","ocr_5.1.2","ocr_5.2.1","ocr_5.2.2","ocr_5.3.1","ocr_5.4.1"] },
  { id: "ocr_mod6", label: "Module 6 – Organic & Analysis", sub: "Organic Chemistry and Analysis", topics: ["ocr_6.1.1","ocr_6.1.2","ocr_6.2.1","ocr_6.2.2","ocr_6.3.1","ocr_6.4.1","ocr_6.5.1","ocr_6.5.2"] },
];
const OCR_TOPIC_ORDER = OCR_SECTIONS.flatMap(s => s.topics);

// === ORGANIC SYNTHESIS MAP DATA ===
const SYNTH_ALI_NODES = [
  ["alkylAmm",    "Alkyl\nAmm. Salts",              72,  36, "#4f46e5", 66, 22],
  ["quatAmm",     "Quat.\nAmm. Salts",             238,  36, "#6d28d9", 84, 22],
  ["tertAmines",  "Tertiary\nAmines",              400,  36, "#7c3aed", 56, 22],
  ["alkanes",     "Alkanes",                        55, 112, "#475569", 48, 14],
  ["haloalkanes", "Haloalkanes",                   195, 112, "#c2410c", 66, 14],
  ["primAmines",  "Primary\nAmines",               345, 112, "#be185d", 60, 20],
  ["secAmines",   "Secondary\nAmines",             435, 164, "#9d174d", 50, 20],
  ["alkenes",     "Alkenes",                       182, 200, "#15803d", 52, 14],
  ["nitriles",    "Nitriles",                      390, 200, "#4338ca", 50, 14],
  ["dihalides",   "Di-\nhaloalkanes",               65, 288, "#9a3412", 58, 20],
  ["alcohols",    "Alcohols",                      258, 274, "#1d4ed8", 54, 14],
  ["diols",       "Diols",                          65, 372, "#0369a1", 46, 14],
  ["ketones",     "Ketones",                       165, 372, "#7e22ce", 52, 14],
  ["aldehydes",   "Aldehydes",                     280, 372, "#a21caf", 54, 14],
  ["esters",      "Esters",                        415, 350, "#0e7490", 48, 14],
  ["carbAcids",   "Carboxylic\nAcids",             280, 456, "#b91c1c", 68, 20],
  ["carboxylate", "Carboxylate\nSalts",            108, 540, "#be123c", 68, 20],
  ["amides",      "Amides",                        272, 540, "#5b21b6", 50, 14],
  ["acylCl",      "Acyl Chlorides /\nAnhydrides",  416, 540, "#0369a1", 58, 24],
];
const SYNTH_ALI_RXNS = [
  [1,  "alkanes",    "haloalkanes", 124, 112, "Alkanes",             "Haloalkanes",              "Halogen",                "UV light",               "Free radical",  "Substitution"],
  [2,  "haloalkanes","primAmines",  272, 107, "Haloalkanes",         "Primary Amines",           "Conc. NH3",              "Heat, under pressure",   "Nucleophilic",  "Substitution"],
  [3,  "primAmines", "alkylAmm",   200,  68, "Primary Amines",      "Alkyl Ammonium Salts",     "Dilute HCl",             "Room temperature",       "--",            "Acid-base"],
  [4,  "tertAmines", "quatAmm",    320,  33, "Tertiary Amines",     "Quaternary Ammonium Salts","Halogenoalkane",         "Heat",                   "Nucleophilic",  "Substitution"],
  [5,  "secAmines",  "tertAmines", 420,  96, "Secondary Amines",    "Tertiary Amines",          "Halogenoalkane",         "Heat",                   "Nucleophilic",  "Substitution"],
  [6,  "primAmines", "secAmines",  393, 134, "Primary Amines",      "Secondary Amines",         "Halogenoalkane",         "Heat",                   "Nucleophilic",  "Substitution"],
  [7,  "haloalkanes","alkenes",    166, 153, "Haloalkanes",         "Alkenes",                  "NaOH in ethanol",        "Heat",                   "Elimination",   "Elimination"],
  [8,  "alkenes",   "haloalkanes", 214, 152, "Alkenes",             "Haloalkanes",              "Hydrogen halide",        "Room temperature",        "Electrophilic", "Addition"],
  [9,  "haloalkanes","alcohols",   220, 192, "Haloalkanes",         "Alcohols",                 "NaOH(aq)",               "Heat under reflux",      "Nucleophilic",  "Substitution"],
  [10, "haloalkanes","nitriles",   290, 152, "Haloalkanes",         "Nitriles",                 "KCN in ethanol",         "Heat under reflux",      "Nucleophilic",  "Substitution"],
  [11, "nitriles",  "primAmines",  368, 152, "Nitriles",            "Primary Amines",           "LiAlH4 in dry ether",   "Heat",                   "--",            "Reduction"],
  [12, "alkenes",   "dihalides",   118, 246, "Alkenes",             "Dihaloalkanes",            "Halogen",                "Room temperature",        "Electrophilic", "Addition"],
  [13, "alkenes",   "alcohols",    218, 238, "Alkenes",             "Alcohols",                 "Steam + H2SO4",          "Heat",                   "--",            "Hydration"],
  [14, "alcohols",  "alkenes",     242, 222, "Alcohols",            "Alkenes",                  "Al2O3 or conc. acid",   "Heat",                   "Elimination",   "Dehydration"],
  [15, "dihalides", "diols",        65, 330, "Dihaloalkanes",       "Diols",                    "NaOH(aq)",               "Heat under reflux",      "Nucleophilic",  "Substitution"],
  [16, "alcohols",  "ketones",     208, 320, "Alcohols (secondary)","Ketones",                  "K2Cr2O7 / H2SO4",       "Heat",                   "--",            "Oxidation"],
  [17, "ketones",   "alcohols",    228, 332, "Ketones",             "Alcohols (secondary)",     "NaBH4(aq)",              "Room temperature",        "--",            "Reduction"],
  [18, "alcohols",  "aldehydes",   268, 322, "Alcohols (primary)",  "Aldehydes",                "K2Cr2O7 / H2SO4",       "Heat, limited oxidant",  "--",            "Oxidation"],
  [19, "aldehydes", "alcohols",    286, 312, "Aldehydes",           "Alcohols (primary)",       "NaBH4(aq)",              "Room temperature",        "--",            "Reduction"],
  [20, "nitriles",  "carbAcids",   340, 328, "Nitriles",            "Carboxylic Acids",         "Dilute HCl(aq)",         "Heat under reflux",      "--",            "Hydrolysis"],
  [21, "aldehydes", "carbAcids",   280, 412, "Aldehydes",           "Carboxylic Acids",         "K2Cr2O7 / H2SO4",       "Heat under reflux",      "--",            "Oxidation"],
  [22, "carbAcids", "alcohols",    300, 366, "Carboxylic Acids",    "Primary Alcohols",         "LiAlH4 in dry ether",   "Heat",                   "--",            "Reduction"],
  [23, "carbAcids", "esters",      352, 404, "Carboxylic Acids",    "Esters",                   "Alcohol + conc. H2SO4", "Heat",                   "--",            "Esterification"],
  [24, "acylCl",    "esters",      416, 448, "Acyl Chlorides",      "Esters",                   "Alcohol",                "Room temperature",        "Nucleophilic",  "Acylation"],
  [25, "carbAcids", "carboxylate", 192, 500, "Carboxylic Acids",    "Carboxylate Salts",        "NaOH(aq)",               "Room temperature",        "--",            "Acid-base"],
  [26, "acylCl",    "carbAcids",   352, 498, "Acyl Chlorides",      "Carboxylic Acids",         "H2O",                    "Room temperature",        "--",            "Hydrolysis"],
  [27, "acylCl",    "amides",      344, 540, "Acyl Chlorides",      "Amides",                   "Amines",                 "Room temperature",        "Nucleophilic",  "Acylation"],
];
const SYNTH_ARO_NODES = [
  ["benzene",      "Benzene",                       250, 196, "#1d4ed8", 52, 14],
  ["methylbenz",   "Methylbenzene\n(Toluene)",      140, 196, "#15803d", 72, 22],
  ["acetophenone", "Acetophenone\n(COCH3)",         380, 112, "#0e7490", 72, 22],
  ["ethylbenzene", "Ethylbenzene",                  415, 196, "#0369a1", 64, 14],
  ["chloromethyl", "Chloromethyl-\nbenzene",         55, 284, "#9a3412", 72, 22],
  ["nitrobenzene", "Nitrobenzene",                  375, 284, "#b45309", 66, 14],
  ["dinitrotol",   "Di-nitro-\ntoluene",             55, 368, "#92400e", 60, 22],
  ["aniline",      "Aniline\n(Aminobenzene)",       342, 368, "#15803d", 78, 22],
  ["diazonium",    "Benzenediazonium\nChloride",    255, 456, "#dc2626", 94, 22],
  ["azoDye",       "Azo Dye",                       125, 456, "#9333ea", 52, 14],
];
const SYNTH_ARO_RXNS = [
  [1, "benzene",     "acetophenone", 316, 150, "Benzene",                    "Acetophenone",
      "Ethanoyl chloride + AlCl3",  "Heat",              "Electrophilic", "Friedel-Crafts Acylation"],
  [2, "benzene",     "ethylbenzene", 332, 196, "Benzene",                    "Ethylbenzene",
      "Chloroethane + AlCl3",       "Heat",              "Electrophilic", "Friedel-Crafts Alkylation"],
  [3, "methylbenz",  "chloromethyl",  97, 240, "Methylbenzene",              "Chloromethylbenzene",
      "Chlorine",                    "UV light",          "Free radical",  "Substitution"],
  [4, "benzene",     "methylbenz",   194, 196, "Benzene",                    "Methylbenzene",
      "Chloromethane + AlCl3",      "Heat",              "Electrophilic", "Friedel-Crafts Alkylation"],
  [5, "benzene",     "nitrobenzene", 312, 240, "Benzene",                    "Nitrobenzene",
      "Conc. HNO3 + H2SO4",        "25-60 degrees C",   "Electrophilic", "Nitration"],
  [6, "methylbenz",  "dinitrotol",    97, 328, "Methylbenzene",              "Di-nitrotoluene",
      "Conc. HNO3 + H2SO4",        "25-60 degrees C",   "Electrophilic", "Nitration"],
  [7, "nitrobenzene","aniline",      360, 326, "Nitrobenzene",               "Aniline",
      "Sn + conc. HCl",             "Heat",              "--",             "Reduction"],
  [8, "aniline",     "diazonium",    298, 414, "Aniline",                    "Benzenediazonium Chloride",
      "NaNO2 / HCl",                "Below 10 degrees C","--",             "Diazotisation"],
  [9, "diazonium",   "azoDye",       190, 456, "Benzenediazonium Chloride",  "Azo Dye",
      "Phenol",                      "Alkaline conditions","--",            "Azo Coupling"],
];

// ====================================================================
// MECHANISM VIEWER DATA & RENDERING
// ====================================================================

const MECHS = [
  {
    id: "nuc_sub",
    title: "Nucleophilic Substitution",
    subtitle: "HO⁻ + CH₃Br → CH₃OH + Br⁻",
    category: "Nucleophilic Substitution",
    color: "#3182ce",
    specs: ["AQA","OCR_A"],
    description: "The nucleophile (a species with a lone pair) attacks the δ+ carbon of the halogenoalkane. The C–X bond breaks heterolytically — X leaves as X⁻ (the leaving group) taking both bonding electrons. Both bond formation and bond breaking are shown with simultaneous curly arrows.",
    steps: [
      { title: "Identify: nucleophile and electrophile",
        explanation: "The C–Br bond is polarised because bromine is more electronegative than carbon. This gives Cδ+ and Brδ−. The hydroxide ion (OH⁻) has a lone pair of electrons and is the nucleophile. The δ+ carbon is the electrophile. Bromine is the leaving group — it can accommodate the negative charge as a stable halide ion Br⁻.",
        arrows: [] },
      { title: "Nucleophile attacks; leaving group departs",
        explanation: "Arrow ①: the lone pair on O⁻ attacks the δ+ carbon, starting to form a new O–C bond. Arrow ②: at the same time, the C–Br bonding electrons shift towards Br, breaking the C–Br bond. Br leaves as Br⁻ (a stable bromide ion). Both arrows are drawn together — the nucleophile donates electrons in and the leaving group takes electrons out simultaneously.",
        arrows: ["a1","a2"] },
      { title: "Products: CH₃OH + Br⁻",
        explanation: "The product CH₃OH (methanol) has formed as the nucleophile bonded to the carbon. Br⁻ is released as a free bromide ion. The overall reaction is a substitution — the –Br group has been replaced by –OH. This mechanism applies whenever a nucleophile reacts with a primary or secondary halogenoalkane.",
        arrows: [], past: [], showProducts: true },
    ],
    arrowPaths: {
      a1: { d:"M 100,93 C 155,60 215,65 248,104", label:"① O lone pair → δ+C (forms O–C bond)", type:"full" },
      a2: { d:"M 289,112 C 328,88 362,88 394,106", label:"② C–Br bond electrons → Br (forms Br⁻)", type:"full" },
    },
  },
  {
    id: "ea_br2",
    title: "Electrophilic Addition: Br₂",
    subtitle: "CH₂=CH₂ + Br₂ → CH₂BrCH₂Br",
    category: "Electrophilic Addition",
    color: "#c05621",
    specs: ["AQA","OCR_A"],
    description: "The electron-rich π bond of ethene induces a dipole in Br₂, making the near Br atom δ+. The π electrons attack this Br, forming a cyclic bromonium ion and releasing Br⁻. Br⁻ then attacks from the back to give 1,2-dibromoethane.",
    steps: [
      { title: "Electron-rich π bond polarises Br₂",
        explanation: "The π electrons of the C=C double bond create a region of high electron density. As Br₂ approaches, the near bromine atom becomes δ+ (electron density is repelled away from it) and the far bromine becomes δ−. This is temporary induced polarisation — without the approaching alkene, Br₂ is non-polar.",
        arrows: [] },
      { title: "π electrons attack δ+ Br; Br–Br breaks",
        explanation: "Arrow ①: the π bonding electrons attack the δ+ bromine atom, forming a C–Br bond (a carbocation intermediate or cyclic bromonium ion forms). Arrow ②: simultaneously, the Br–Br bonding electrons shift to the distant Br, forming Br⁻ (the leaving group). The π bond is completely used up in this step.",
        arrows: ["a1","a2"] },
      { title: "Br⁻ attacks the carbocation",
        explanation: "Arrow ③: the Br⁻ ion attacks the empty orbital on the positive carbon from the back face. This anti (trans) addition means the two Br atoms end up on opposite faces of the molecule, giving 1,2-dibromoethane. The orange colour of Br₂ disappears as the product is colourless — this is the standard alkene test.",
        arrows: ["a3"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 237,95 C 262,62 308,58 335,86", label:"① π electrons → δ+Br", type:"full" },
      a2: { d:"M 349,94 C 372,68 402,68 422,88", label:"② Br–Br bond → Br⁻", type:"full" },
      a3: { d:"M 408,104 C 385,75 320,72 256,108", label:"③ Br⁻ lone pair → C⁺", type:"full" },
    },
  },
  {
    id: "ea_hbr",
    title: "Electrophilic Addition: HBr (Markovnikov)",
    subtitle: "CH₃CH=CH₂ + HBr → CH₃CHBrCH₃",
    category: "Electrophilic Addition",
    color: "#b45309",
    specs: ["AQA","OCR_A"],
    description: "H⁺ (from HBr) is the electrophile. It adds to the carbon with MORE hydrogens (Markovnikov's rule), forming the MORE stable secondary carbocation. Br⁻ then attacks the carbocation. The major product has Br on the central carbon.",
    steps: [
      { title: "H–Br polarisation",
        explanation: "The H–Br bond is polarised: Hδ+ and Brδ−. The electron-rich π bond of propene is attracted to the δ+ hydrogen. The π electrons will attack the Hδ+, and H is the electrophile in this reaction.",
        arrows: [] },
      { title: "π electrons attack H; H–Br breaks → carbocation",
        explanation: "Arrow ①: the π electrons attack the δ+ H atom of HBr, forming a new C–H bond on C-1 (the CH₂ end). Arrow ②: the H–Br bond electrons shift to Br, forming Br⁻. A carbocation forms. Crucially, H adds to C-1 (the carbon with MORE hydrogens) because this gives the more stable SECONDARY carbocation at C-2, not the less stable primary carbocation at C-1. This is Markovnikov's rule.",
        arrows: ["a1","a2"] },
      { title: "Br⁻ attacks secondary carbocation",
        explanation: "Arrow ③: Br⁻ (a nucleophile) attacks the secondary carbocation at C-2 using a lone pair. The product is 2-bromopropane (the Markovnikov product). If H had added to C-2, a less stable primary carbocation at C-1 would form and the minor product 1-bromopropane would result.",
        arrows: ["a3"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 228,102 C 252,68 298,60 328,82", label:"① π electrons → Hδ+", type:"full" },
      a2: { d:"M 344,82 C 366,58 400,60 420,80", label:"② H–Br bond → Br⁻", type:"full" },
      a3: { d:"M 406,104 C 378,72 300,72 192,108", label:"③ Br⁻ lone pair → C⁺", type:"full" },
    },
  },
  {
    id: "nuc_add",
    title: "Nucleophilic Addition: HCN",
    subtitle: "CH₃CHO + HCN → CH₃CH(OH)CN",
    category: "Nucleophilic Addition",
    color: "#7c3aed",
    specs: ["AQA","OCR_A"],
    description: "The carbonyl carbon (C=O) is electrophilic (δ+) because O is more electronegative. CN⁻ is the nucleophile. Addition of HCN across C=O gives a hydroxynitrile (cyanohydrin). A racemic mixture is produced because the flat carbonyl carbon can be attacked from either face.",
    steps: [
      { title: "Identify: electrophilic C=O carbon",
        explanation: "Oxygen is more electronegative than carbon, so the C=O bond is polarised: Cδ+ and Oδ−. The CN⁻ ion (from NaCN/KCN) is the nucleophile with its lone pair on carbon. Pure HCN is avoided (toxic volatile liquid) — NaCN + dilute acid generates CN⁻ safely.",
        arrows: [] },
      { title: "CN⁻ attacks δ+C; C=O π bond breaks → O⁻",
        explanation: "Arrow ①: the lone pair on carbon of CN⁻ attacks the δ+ carbonyl carbon, forming a new C–CN bond. Arrow ②: simultaneously, the C=O π bond electrons shift entirely to oxygen, forming an alkoxide O⁻. Both arrows happen in the same step — nucleophilic addition is a single concerted event.",
        arrows: ["a1","a2"] },
      { title: "Alkoxide intermediate formed",
        explanation: "The tetrahedral alkoxide intermediate has formed. The carbon that was sp² (flat, trigonal planar) is now sp³ (tetrahedral). The O⁻ is negatively charged and will be protonated by H⁺ from the HCN in solution. A molecule of HCN is shown on the right, ready to donate its proton.",
        arrows: [], past: [], showIntermediate: true },
      { title: "H⁺ from HCN protonates O⁻ → hydroxynitrile",
        explanation: "Arrow ③: the H on HCN protonates the O⁻, forming the –OH group. The H–CN bond electrons shift towards C of CN, so CN⁻ is regenerated (it acts as a chain carrier). The final product is 2-hydroxypropanenitrile. The new carbon centre is chiral — equal attack from both faces gives a racemic mixture.",
        arrows: ["a3"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 60,115 C 118,68 208,68 284,112", label:"① CN⁻ lone pair → δ+C (new C–CN bond)", type:"full" },
      a2: { d:"M 300,106 C 312,80 332,68 345,84", label:"② C=O π bond electrons → O⁻", type:"full" },
      a3: { d:"M 388,112 C 352,76 280,65 175,70", label:"③ H⁺ from HCN → O⁻ (forms –OH)", type:"full" },
    },
  },
  {
    id: "nuc_add_elim",
    title: "Nucleophilic Addition-Elimination",
    subtitle: "CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl",
    category: "Nucleophilic Add-Elimination",
    color: "#059669",
    specs: ["AQA","OCR_A"],
    description: "Acyl chlorides are very reactive toward nucleophiles. Step 1: NH₃ donates a lone pair to the carbonyl C, forming a tetrahedral intermediate. Step 2: Cl⁻ is expelled as the leaving group, reforming a C=O bond (the amide). The HCl produced is mopped up by a second NH₃.",
    steps: [
      { title: "Identify: electrophilic acyl carbon",
        explanation: "The acyl carbon (C=O carbon bonded to Cl) is highly electrophilic: both O and Cl withdraw electron density, making the carbon strongly δ+. NH₃ has a lone pair on nitrogen — it is the nucleophile. Acyl chloride reactions are much faster and irreversible compared to esterification with a carboxylic acid.",
        arrows: [] },
      { title: "NH₃ attacks acyl carbon; C=O π breaks",
        explanation: "Arrow ①: the lone pair on N of NH₃ attacks the δ+ acyl carbon, forming a new N–C bond. Arrow ②: simultaneously, the C=O π bond electrons shift to O, forming O⁻. A tetrahedral intermediate forms with N, Cl, O⁻, and CH₃ all attached to the same carbon.",
        arrows: ["a1","a2"] },
      { title: "Cl⁻ expelled; C=O reforms",
        explanation: "Arrow ③: the lone pair on O⁻ reforms the C=O π bond (O pushes electrons back to the C=O). Arrow ④: simultaneously, the C–Cl bonding electrons shift to Cl, expelling Cl⁻. The carbonyl group is restored and the amide product CH₃CONH₂ forms. The overall result is substitution of Cl by NH₂.",
        arrows: ["a3","a4"], past: [] },
      { title: "HCl neutralised by second NH₃",
        explanation: "The HCl produced (from NH₄⁺ Cl⁻ in solution) is mopped up by a second equivalent of NH₃: NH₃ + HCl → NH₄Cl. This is why 2 mol of NH₃ are shown in the overall equation. Using an excess of ammonia ensures the acidic HCl is neutralised and the product is the free amide.",
        arrows: [], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 104,110 C 155,70 210,70 248,104", label:"① N lone pair → acyl C", type:"full" },
      a2: { d:"M 268,100 C 280,72 308,64 330,80", label:"② C=O π bond → O⁻", type:"full" },
      a3: { d:"M 236,78 C 214,58 188,72 170,108", label:"③ O⁻ lone pair → C=O reforms", type:"full" },
      a4: { d:"M 174,122 C 192,134 207,144 218,150", label:"④ C–Cl bond electrons → Cl⁻", type:"full" },
    },
  },
  {
    id: "fc_acyl",
    title: "Friedel-Crafts Acylation",
    subtitle: "C₆H₆ + CH₃COCl → C₆H₅COCH₃ + HCl",
    category: "Electrophilic Aromatic Substitution",
    color: "#7c3aed",
    specs: ["AQA","OCR_A"],
    description: "AlCl₃ (Lewis acid catalyst) generates the acylium ion (RCO⁺) from the acyl chloride. The acylium ion is the electrophile that attacks benzene's π system. The mechanism follows the general EAS pathway: π attack → arenium ion → H⁺ lost to restore aromaticity. AlCl₃ is regenerated at the end.",
    steps: [
      { title: "Generate the acylium ion (electrophile)",
        explanation: "AlCl₃ is a Lewis acid — it has an empty orbital and accepts electron pairs. Arrow ①: the lone pair on the Cl of CH₃COCl donates to AlCl₃, forming a coordinate bond. Arrow ②: the C–Cl bond electrons shift to Cl, forming the acylium ion CH₃CO⁺ and [AlCl₄]⁻. The acylium ion CH₃CO⁺ is stabilised by the positive charge on carbon being delocalised onto oxygen.",
        arrows: ["a1","a2"] },
      { title: "Acylium ion attacks benzene π system",
        explanation: "Arrow ③: the delocalised π electrons of benzene attack the electrophilic carbon of the acylium ion CH₃CO⁺, forming a new C–C bond. Aromaticity is temporarily lost. A positively charged arenium ion (Wheland intermediate) forms — one carbon in the ring is now sp³ and the positive charge is delocalised around the ring.",
        arrows: ["a3"], past: [] },
      { title: "H⁺ lost; aromaticity restored",
        explanation: "Arrow ④: the C–H bonding electrons on the sp³ carbon move into the ring, expelling H⁺. The aromatic π system (6 delocalised electrons) is fully restored — this is what drives the reaction forward. The H⁺ is accepted by [AlCl₄]⁻, regenerating AlCl₃ and HCl. Overall: one H replaced by –COCH₃ (an acyl group). Product: methyl phenyl ketone (acetophenone).",
        arrows: ["a4"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 400,143 C 412,126 418,112 414,100", label:"① Cl lone pair → Al (Lewis acid)", type:"full" },
      a2: { d:"M 378,108 C 363,90 344,88 330,100", label:"② C–Cl bond → Cl (acylium forms)", type:"full" },
      a3: { d:"M 238,93 C 260,58 296,54 318,76", label:"③ π electrons → acylium C", type:"full" },
      a4: { d:"M 248,104 C 240,130 253,148 270,154", label:"④ C–H bond → H⁺ expelled", type:"full" },
    },
  },
  {
    id: "eas",
    title: "Electrophilic Aromatic Substitution (Nitration)",
    subtitle: "C₆H₆ + NO₂⁺ → C₆H₅NO₂ + H⁺",
    category: "Electrophilic Aromatic Substitution",
    color: "#b91c1c",
    specs: ["AQA","OCR_A"],
    description: "The nitronium ion (NO₂⁺) is generated from conc. HNO₃ + conc. H₂SO₄. The delocalised π electrons of benzene attack NO₂⁺, forming a positively charged arenium ion. H⁺ is then lost to restore aromaticity. Substitution (not addition) preserves the stable delocalised π system.",
    steps: [
      { title: "Generate the electrophile: NO₂⁺",
        explanation: "Conc. H₂SO₄ donates a proton to HNO₃: HNO₃ + H₂SO₄ → NO₂⁺ + H₂O + HSO₄⁻. The nitronium ion (NO₂⁺) is the electrophile. The temperature is kept below 55°C — at higher temperatures, further nitration to give di- and tri-nitro products occurs.",
        arrows: [] },
      { title: "π electrons attack NO₂⁺",
        explanation: "Arrow ①: the delocalised π electrons of benzene attack the nitrogen of NO₂⁺, forming a new C–N bond. Aromaticity is temporarily lost — this is the slow, rate-determining step. A positively charged arenium ion (Wheland intermediate / sigma complex) is formed. One ring carbon is now sp³.",
        arrows: ["a1"] },
      { title: "H⁺ lost; aromaticity restored",
        explanation: "Arrow ②: the C–H bonding electrons on the sp³ carbon move into the ring, expelling H⁺. The aromatic π system (6 delocalised electrons) is fully restored. H⁺ is released into the acid mixture. This second step is fast. The overall result is substitution of one H by NO₂ — aromaticity is preserved because the energy gained by restoring delocalisation drives the reaction.",
        arrows: ["a2"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 248,98 C 274,58 314,50 344,76", label:"① π electrons → NO₂⁺", type:"full" },
      a2: { d:"M 258,107 C 248,133 262,148 280,152", label:"② C–H bond → H⁺ expelled", type:"full" },
    },
  },
  {
    id: "elimination",
    title: "Elimination (E2)",
    subtitle: "CH₃CH₂Br + KOH(ethanol) → CH₂=CH₂ + KBr + H₂O",
    category: "Elimination",
    color: "#9333ea",
    specs: ["AQA","OCR_A"],
    description: "Hot ethanolic KOH acts as a strong base. The OH⁻ abstracts an H from the β-carbon (adjacent to the C–X carbon). Simultaneously, the C–H electrons form a π bond and the C–Br bond breaks. All three events occur concertedly (E2). The conditions that favour elimination: hot, ethanolic KOH; aqueous KOH favours substitution.",
    steps: [
      { title: "Identify: β-hydrogen & leaving group",
        explanation: "The β-carbon is the carbon adjacent to the carbon bearing the Br. OH⁻ is a strong base (not just a nucleophile) — it abstracts the β-hydrogen rather than attacking the carbon (which would give SN2). Hot ethanolic conditions favour the more hindered approach (elimination) over back-face attack (substitution).",
        arrows: [] },
      { title: "Concerted: base removes H, π forms, Br⁻ leaves",
        explanation: "Arrow ①: the OH⁻ base uses its lone pair to abstract the β-H (H on the carbon adjacent to C–Br). Arrow ②: the C–H bonding electrons shift to form the C=C π bond between the two carbons. Arrow ③: simultaneously, the C–Br bonding electrons shift entirely to Br, forming Br⁻. All three bonds break/form at the same time (E2). The reaction produces ethene + H₂O + Br⁻.",
        arrows: ["a1","a2","a3"] },
    ],
    arrowPaths: {
      a1: { d:"M 105,99 C 138,68 182,66 205,90", label:"① O lone pair → β-H", type:"full" },
      a2: { d:"M 218,108 C 234,86 262,86 278,106", label:"② C–H electrons → π bond forms", type:"full" },
      a3: { d:"M 294,108 C 328,88 364,90 396,107", label:"③ C–Br electrons → Br⁻", type:"full" },
    },
  },
  {
    id: "frs",
    title: "Free Radical Substitution (FRS)",
    subtitle: "CH₄ + Cl₂  →(UV)→  CH₃Cl + HCl",
    category: "Radical",
    color: "#d97706",
    specs: ["AQA","OCR_A"],
    description: "A chain reaction using fish-hook (half-headed) arrows — each represents ONE electron. Three stages: initiation (UV breaks Cl–Cl homolytically), propagation (chain-carrying steps), termination (radicals combine). The mechanism uses fish-hook arrows, NOT full curly arrows.",
    steps: [
      { title: "Initiation: homolytic fission of Cl–Cl",
        explanation: "UV light provides energy for homolytic fission of the Cl–Cl bond — one electron from the bond goes to each chlorine atom. Fish-hook arrows (half-headed, ↷) each represent ONE electron moving. Two Cl• radicals are formed. Each has an unpaired electron shown as a dot (•). This step starts the chain.",
        arrows: ["a1","a2"] },
      { title: "Propagation Step 1: Cl• + CH₄",
        explanation: "Arrow ③: one electron from the C–H bond moves to pair with the unpaired electron on Cl•, forming H–Cl. Arrow ④: the remaining electron on carbon creates a methyl radical •CH₃. The Cl• radical is consumed but a new radical (•CH₃) is produced — this is why it's a chain reaction. Propagation continues while reactants are available.",
        arrows: ["a3","a4"], past: [] },
      { title: "Propagation Step 2: •CH₃ + Cl₂",
        explanation: "Arrow ⑤: one electron from the Cl–Cl bond pairs with the unpaired electron on •CH₃, forming CH₃–Cl (the product). Arrow ⑥: the other Cl atom becomes a new Cl• radical, which goes on to repeat propagation Step 1. Each propagation cycle produces one molecule of CH₃Cl and one molecule of HCl.",
        arrows: ["a5","a6"], past: [] },
      { title: "Termination: two radicals combine",
        explanation: "Termination occurs when any two radicals collide and combine, using up their unpaired electrons: Cl• + Cl• → Cl₂, or •CH₃ + Cl• → CH₃Cl, or •CH₃ + •CH₃ → C₂H₆. No radicals are produced in termination — the chain is ended. C₂H₆ forming is why trace amounts of ethane are always found as a by-product.",
        arrows: [], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 255,107 C 228,76 200,74 182,94", label:"① one e⁻ → left Cl", type:"fish" },
      a2: { d:"M 265,107 C 292,76 320,74 338,94", label:"② one e⁻ → right Cl", type:"fish" },
      a3: { d:"M 235,107 C 248,76 268,72 286,94", label:"③ one e⁻ from C–H → Cl•", type:"fish" },
      a4: { d:"M 285,110 C 268,130 248,132 232,118", label:"④ remaining e⁻ on C → •CH₃", type:"fish" },
      a5: { d:"M 240,107 C 265,76 290,74 308,94", label:"⑤ one e⁻ from Cl–Cl → •CH₃", type:"fish" },
      a6: { d:"M 318,98 C 345,76 368,76 382,94", label:"⑥ other e⁻ → new Cl•", type:"fish" },
    },
  },
];

function MechSVGBase({ children, animKey }) {
  return (
    <svg viewBox="0 0 560 220" style={{ width:"100%", height:"auto", display:"block", maxHeight:"220px" }}>
      <defs>
        <marker id={`arr-red-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626"/>
        </marker>
        <marker id={`arr-grey-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
        </marker>
        <marker id={`fish-red-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 5 z" fill="#dc2626"/>
        </marker>
        <marker id={`fish-grey-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 5 z" fill="#94a3b8"/>
        </marker>
      </defs>
      {children}
    </svg>
  );
}

// Atom label helper
function A({ x, y, el, charge, partial, size=16, color }) {
  const c = color || (el==="O"||el==="OH"||el==="OH⁻"?"#b91c1c":el==="N"||el==="NH₃"||el==="NH₂"?"#1d4ed8":el==="Br"?"#9a3412":el==="Cl"?"#166534":el==="H"?"#64748b":"#1a202c");
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
      style={{ fontSize:`${size}px`, fontFamily:"Georgia,'Times New Roman',serif", fontWeight:700, fill:c, userSelect:"none" }}>
      {el}{charge&&<tspan style={{fontSize:`${size*0.72}px`, baselineShift:"super"}}>{charge}</tspan>}
      {partial&&<tspan style={{fontSize:`${size*0.68}px`, fill:"#64748b"}}>{partial}</tspan>}
    </text>
  );
}

// Bond line helper
function Bond({ x1,y1,x2,y2,dbl,dash,color="#1a202c",width=2.5 }) {
  if (dbl) {
    const dx=y2-y1, dy=x1-x2, len=Math.sqrt(dx*dx+dy*dy)||1;
    const ox=dx/len*3, oy=dy/len*3;
    return <g><line x1={x1+ox} y1={y1+oy} x2={x2+ox} y2={y2+oy} stroke={color} strokeWidth={width} strokeLinecap="round"/>
              <line x1={x1-ox} y1={y1-oy} x2={x2-ox} y2={y2-oy} stroke={color} strokeWidth={width} strokeLinecap="round"/></g>;
  }
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
    strokeDasharray={dash?"6,4":undefined} strokeLinecap="round"/>;
}

// Lone pair helper (two dots)
function LP({ x, y, angle=0, color="#1a202c" }) {
  const rad=(angle*Math.PI)/180;
  const dx=Math.cos(rad)*5, dy=Math.sin(rad)*5;
  return <g><circle cx={x-dx} cy={y-dy} r={2.4} fill={color}/><circle cx={x+dx} cy={y+dy} r={2.4} fill={color}/></g>;
}

// Curly arrow helper (animated or static grey, or still=always red no animation)
function CurlyArrow({ d, active, animKey, delay=0, type="full", label, labelX, labelY, still }) {
  const isRed = active || still;
  const markerId = isRed
    ? (type==="fish" ? `fish-red-${animKey}` : `arr-red-${animKey}`)
    : (type==="fish" ? `fish-grey-${animKey}` : `arr-grey-${animKey}`);
  return (
    <g>
      <path
        key={active && !still ? `${d}-${animKey}` : d}
        d={d}
        fill="none"
        stroke={isRed ? "#dc2626" : "#94a3b8"}
        strokeWidth={isRed ? 2.6 : 1.8}
        markerEnd={`url(#${markerId})`}
        style={active && !still ? {
          strokeDasharray:350,
          strokeDashoffset:0,
          animation:`mechDrawArrow 0.65s ease-out ${delay}s both`
        } : {}}
      />
      {label && labelX && <text x={labelX} y={labelY||0} fill={isRed?"#dc2626":"#94a3b8"}
        style={{fontSize:"11px",fontFamily:"sans-serif",fontWeight:600,userSelect:"none"}}>{label}</text>}
    </g>
  );
}

// Charge badge
function Charge({ x, y, val, color }) {
  return <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
    style={{ fontSize:"13px", fontFamily:"Georgia,serif", fontWeight:700, fill: color||"#1a202c", userSelect:"none" }}>{val}</text>;
}

// Delta label
function Delta({ x, y, sign }) {
  return <text x={x} y={y} textAnchor="middle"
    style={{ fontSize:"11px", fontFamily:"Georgia,serif", fill:"#64748b", userSelect:"none" }}>δ{sign}</text>;
}

function MechSVG({ mech, stepIdx, animKey, stillMode=false }) {
  const step = mech.steps[Math.min(stepIdx, mech.steps.length-1)];
  const activeIds = step.arrows || [];
  const pastIds = step.past || [];
  const allArrowIds = Object.keys(mech.arrowPaths);
  // stillMode=true → all arrows red (legacy); stillMode="step" → only active arrows red, no animation
  const allVisibleIds = stillMode === true ? allArrowIds : stillMode === "step" ? activeIds : [...pastIds, ...activeIds];

  const renderArrows = () => allVisibleIds.map((id) => {
    const ap = mech.arrowPaths[id];
    if (!ap) return null;
    const isActive = !stillMode && activeIds.includes(id);
    const delay = isActive ? activeIds.indexOf(id) * 0.18 : 0;
    // In "step" still mode: arrows are red but not animated
    const isStill = stillMode === true || stillMode === "step";
    return <CurlyArrow key={id} d={ap.d} active={isActive} still={isStill} animKey={animKey} delay={delay} type={ap.type||"full"}/>;
  });

  // ── nuc_sub ─────────────────────────────────────────────────────────
  if (mech.id === "nuc_sub") {
    const showProducts = step.showProducts;
    if (showProducts) {
      // Step 2: Products — CH₃OH on left, Br⁻ on right
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH3-O-H */}
          <A x={110} y={115} el="CH₃" size={15}/>
          <Bond x1={131} y1={115} x2={158} y2={115}/>
          <A x={172} y={115} el="O" size={17}/>
          <LP x={172} y={98} angle={0} color="#b91c1c"/>
          <Bond x1={182} y1={115} x2={205} y2={115}/>
          <A x={214} y={115} el="H" size={15} color="#64748b"/>
          <text x={162} y={165} textAnchor="middle" style={{fontSize:"11px",fontFamily:"Georgia,serif",fill:"#059669",fontWeight:700}}>CH₃OH</text>
          {/* Br⁻ */}
          <A x={410} y={115} el="Br" size={19}/>
          <Charge x={432} y={101} val="−" color="#9a3412"/>
          <LP x={395} y={104} angle={150} color="#9a3412"/>
          <LP x={393} y={126} angle={120} color="#9a3412"/>
          <text x={410} y={165} textAnchor="middle" style={{fontSize:"11px",fontFamily:"Georgia,serif",fill:"#9a3412",fontWeight:700}}>Br⁻</text>
          {/* Past arrows (shown grey) */}
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: HO⁻ on left, CH₃Br on right
    return (
      <MechSVGBase animKey={animKey}>
        {/* HO⁻ on left */}
        <A x={68} y={115} el="H" size={15} color="#64748b"/>
        <Bond x1={79} y1={115} x2={90} y2={115}/>
        <A x={100} y={115} el="O" size={17}/>
        <Charge x={118} y={103} val="−" color="#b91c1c"/>
        <LP x={100} y={93} angle={0} color="#b91c1c"/>

        {/* CH3Br */}
        <A x={270} y={115} el="C" size={17}/>
        <Delta x={260} y={97} sign="+"/>
        <A x={270} y={85} el="H" size={14} color="#64748b"/>
        <Bond x1={270} y1={107} x2={270} y2={92}/>
        <A x={244} y={136} el="H" size={14} color="#64748b"/>
        <Bond x1={262} y1={121} x2={248} y2={133}/>
        <A x={296} y={136} el="H" size={14} color="#64748b"/>
        <Bond x1={278} y1={121} x2={292} y2={133}/>
        <Bond x1={284} y1={115} x2={388} y2={115}/>
        <A x={402} y={115} el="Br" size={17}/>
        <Delta x={416} y={97} sign="−"/>
        <LP x={418} y={102} angle={80} color="#9a3412"/>
        <LP x={430} y={115} angle={170} color="#9a3412"/>

        <text x={90} y={155} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#3182ce",fontWeight:700}}>nucleophile</text>
        <text x={270} y={165} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#b91c1c",fontWeight:700}}>electrophile</text>
        <text x={402} y={155} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#9a3412",fontWeight:700}}>leaving group</text>

        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── ea_br2 ───────────────────────────────────────────────────────────
  if (mech.id === "ea_br2") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2) {
      // Step 2: carbocation intermediate CH₂Br–CH₂⁺ with Br⁻ approaching
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH2Br–CH2+ carbocation intermediate */}
          <A x={130} y={115} el="C" size={17}/>
          <A x={112} y={88} el="H" size={14} color="#64748b"/><Bond x1={127} y1={107} x2={115} y2={93}/>
          <A x={112} y={142} el="H" size={14} color="#64748b"/><Bond x1={127} y1={123} x2={115} y2={137}/>
          <Bond x1={138} y1={108} x2={152} y2={94}/>
          <A x={158} y={88} el="Br" size={15}/>
          <LP x={170} y={76} angle={40} color="#9a3412"/>
          <Bond x1={144} y1={115} x2={218} y2={115}/>
          <A x={232} y={115} el="C" size={17}/>
          <Charge x={252} y={101} val="+" color="#b91c1c"/>
          <A x={232} y={85} el="H" size={14} color="#64748b"/><Bond x1={232} y1={107} x2={232} y2={92}/>
          <A x={232} y={145} el="H" size={14} color="#64748b"/><Bond x1={232} y1={123} x2={232} y2={138}/>
          {/* Br⁻ approaching from right */}
          <A x={420} y={115} el="Br" size={19}/>
          <Charge x={442} y={101} val="−" color="#9a3412"/>
          <LP x={408} y={104} angle={160} color="#9a3412"/>
          <LP x={406} y={126} angle={140} color="#9a3412"/>
          <Bond x1={258} y1={115} x2={392} y2={115} dash color="#94a3b8" width={1.5}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: CH₂=CH₂ on left, Br–Br on right
    return (
      <MechSVGBase animKey={animKey}>
        {/* Ethene: C=C */}
        <A x={185} y={115} el="C" size={17}/>
        <Bond x1={199} y1={115} x2={261} y2={115} dbl/>
        <A x={275} y={115} el="C" size={17}/>
        <A x={165} y={88} el="H" size={14} color="#64748b"/><Bond x1={182} y1={108} x2={168} y2={93}/>
        <A x={165} y={142} el="H" size={14} color="#64748b"/><Bond x1={182} y1={122} x2={168} y2={137}/>
        <A x={295} y={88} el="H" size={14} color="#64748b"/><Bond x1={278} y1={108} x2={292} y2={93}/>
        <A x={295} y={142} el="H" size={14} color="#64748b"/><Bond x1={278} y1={122} x2={292} y2={137}/>
        {/* π cloud label */}
        <text x={228} y={60} textAnchor="middle" style={{fontSize:"11px",fill:"#64748b",fontFamily:"Georgia,serif",fontStyle:"italic"}}>π cloud</text>
        {/* Br2 */}
        <A x={355} y={115} el="Br" size={17}/>
        <Delta x={344} y={97} sign="+"/>
        <LP x={342} y={103} angle={170} color="#9a3412"/>
        <Bond x1={369} y1={115} x2={405} y2={115}/>
        <A x={420} y={115} el="Br" size={17}/>
        <Delta x={436} y={97} sign="−"/>
        <LP x={436} y={103} angle={70} color="#9a3412"/>
        <LP x={438} y={126} angle={50} color="#9a3412"/>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── ea_hbr ───────────────────────────────────────────────────────────
  if (mech.id === "ea_hbr") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2) {
      // Step 2: secondary carbocation CH₃–C⁺H–CH₃ with Br⁻ approaching
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH3–C+H–CH3 */}
          <A x={90} y={115} el="CH₃" size={15}/>
          <Bond x1={112} y1={115} x2={155} y2={115}/>
          <A x={168} y={115} el="C" size={17}/>
          <Charge x={188} y={101} val="+" color="#b91c1c"/>
          <A x={168} y={85} el="H" size={14} color="#64748b"/><Bond x1={168} y1={107} x2={168} y2={92}/>
          <Bond x1={182} y1={115} x2={225} y2={115}/>
          <A x={248} y={115} el="CH₃" size={15}/>
          <text x={168} y={165} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#64748b"}}>secondary carbocation</text>
          {/* Br⁻ approaching */}
          <A x={420} y={115} el="Br" size={19}/>
          <Charge x={442} y={101} val="−" color="#9a3412"/>
          <LP x={406} y={104} angle={160} color="#9a3412"/>
          <LP x={404} y={126} angle={140} color="#9a3412"/>
          <Bond x1={272} y1={115} x2={392} y2={115} dash color="#94a3b8" width={1.5}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: CH₃CH=CH₂ on left, HBr on right
    return (
      <MechSVGBase animKey={animKey}>
        {/* Propene: CH3-CH=CH2 */}
        <A x={100} y={115} el="CH₃" size={15}/>
        <Bond x1={122} y1={115} x2={150} y2={115}/>
        <A x={163} y={115} el="C" size={17}/>
        <Bond x1={177} y1={115} x2={239} y2={115} dbl/>
        <A x={253} y={115} el="C" size={17}/>
        <Bond x1={257} y1={108} x2={272} y2={93}/><A x={276} y={87} el="H" size={14} color="#64748b"/>
        <Bond x1={257} y1={122} x2={272} y2={137}/><A x={276} y={143} el="H" size={14} color="#64748b"/>
        <Bond x1={156} y1={108} x2={150} y2={93}/><A x={148} y={87} el="H" size={14} color="#64748b"/>
        {/* HBr */}
        <A x={350} y={115} el="H" size={16} color="#64748b"/>
        <Delta x={342} y={97} sign="+"/>
        <Bond x1={362} y1={115} x2={398} y2={115}/>
        <A x={412} y={115} el="Br" size={17}/>
        <Delta x={426} y={97} sign="−"/>
        <LP x={430} y={103} angle={70} color="#9a3412"/>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── nuc_add ──────────────────────────────────────────────────────────
  if (mech.id === "nuc_add") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    // Steps 2 and 3: alkoxide intermediate on left + HCN on right; step 3 shows protonation arrow
    if (stepN === 2 || stepN === 3) {
      return (
        <MechSVGBase animKey={animKey}>
          {/* Alkoxide intermediate: CH₃–C(O⁻)(CN)–H */}
          <A x={68} y={115} el="CH₃" size={15}/>
          <Bond x1={88} y1={115} x2={128} y2={115}/>
          <A x={144} y={115} el="C" size={17}/>
          {/* O⁻ upward */}
          <Bond x1={144} y1={107} x2={144} y2={78}/>
          <A x={144} y={68} el="O" size={17}/>
          <Charge x={162} y={54} val="−" color="#b91c1c"/>
          <LP x={130} y={62} angle={145} color="#b91c1c"/>
          {/* CN down-right */}
          <Bond x1={152} y1={122} x2={178} y2={148}/>
          <A x={188} y={158} el="C" size={15} color="#1d4ed8"/>
          <line x1={198} y1={155} x2={222} y2={149} stroke="#1d4ed8" strokeWidth={2.2}/>
          <line x1={199} y1={159} x2={223} y2={153} stroke="#1d4ed8" strokeWidth={2.2}/>
          <line x1={200} y1={163} x2={224} y2={157} stroke="#1d4ed8" strokeWidth={2.2}/>
          <A x={234} y={152} el="N" size={15} color="#1d4ed8"/>
          {/* H on C */}
          <Bond x1={136} y1={121} x2={122} y2={140}/>
          <A x={117} y={150} el="H" size={14} color="#64748b"/>
          {stepN === 2 && <text x={144} y={195} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#64748b"}}>alkoxide intermediate</text>}

          {/* HCN proton source on right */}
          <A x={390} y={110} el="H" size={16} color="#64748b"/>
          <Bond x1={400} y1={110} x2={416} y2={110}/>
          <A x={425} y={110} el="C" size={15} color="#1d4ed8"/>
          <line x1={434} y1={107} x2={452} y2={103} stroke="#1d4ed8" strokeWidth={2.2}/>
          <line x1={434} y1={111} x2={452} y2={107} stroke="#1d4ed8" strokeWidth={2.2}/>
          <line x1={434} y1={115} x2={452} y2={111} stroke="#1d4ed8" strokeWidth={2.2}/>
          <A x={462} y={107} el="N" size={15} color="#1d4ed8"/>
          <text x={430} y={145} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#64748b"}}>HCN (H⁺ source)</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: CN⁻ on left, CH₃CHO on right
    return (
      <MechSVGBase animKey={animKey}>
        {/* CN⁻ */}
        <A x={72} y={115} el="N" size={17} color="#1d4ed8"/>
        <line x1={84} y1={111} x2={108} y2={111} stroke="#1d4ed8" strokeWidth={2.2}/>
        <line x1={84} y1={115} x2={108} y2={115} stroke="#1d4ed8" strokeWidth={2.2}/>
        <line x1={84} y1={119} x2={108} y2={119} stroke="#1d4ed8" strokeWidth={2.2}/>
        <A x={118} y={115} el="C" size={17} color="#1d4ed8"/>
        <Charge x={136} y={102} val="−" color="#1d4ed8"/>
        <LP x={55} y={115} angle={90} color="#1d4ed8"/>

        {/* Ethanal CH3-CHO */}
        <A x={240} y={115} el="CH₃" size={15}/>
        <Bond x1={262} y1={115} x2={283} y2={115}/>
        <A x={297} y={115} el="C" size={17}/>
        <Delta x={287} y={97} sign="+"/>
        {/* C=O double bond */}
        <Bond x1={307} y1={110} x2={335} y2={97} dbl/>
        <A x={348} y={90} el="O" size={17}/>
        <Delta x={362} y={78} sign="−"/>
        <LP x={360} y={88} angle={40} color="#b91c1c"/>
        {/* H on CHO carbon */}
        <Bond x1={292} y1={123} x2={286} y2={140}/>
        <A x={283} y={150} el="H" size={14} color="#64748b"/>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── nuc_add_elim ─────────────────────────────────────────────────────
  if (mech.id === "nuc_add_elim") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2) {
      // Step 2: tetrahedral intermediate CH₃–C(NH₂)(O⁻)(Cl)
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH₃ */}
          <A x={80} y={115} el="CH₃" size={15}/>
          <Bond x1={101} y1={115} x2={148} y2={115}/>
          {/* Central C */}
          <A x={162} y={115} el="C" size={17}/>
          {/* NH₂ up */}
          <Bond x1={162} y1={107} x2={162} y2={78}/>
          <A x={162} y={68} el="NH₂" size={14} color="#1d4ed8"/>
          {/* O⁻ right */}
          <Bond x1={170} y1={110} x2={210} y2={88}/>
          <A x={222} y={82} el="O" size={17}/>
          <Charge x={240} y={68} val="−" color="#b91c1c"/>
          <LP x={236} y={78} angle={30} color="#b91c1c"/>
          {/* Cl down-right */}
          <Bond x1={170} y1={121} x2={210} y2={143}/>
          <A x={222} y={152} el="Cl" size={17}/>
          <LP x={238} y={162} angle={50} color="#166534"/>
          {/* H */}
          <Bond x1={155} y1={122} x2={140} y2={142}/>
          <A x={135} y={152} el="H" size={14} color="#64748b"/>
          <text x={162} y={200} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#64748b"}}>tetrahedral intermediate</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 3) {
      // Step 3: amide product + second NH₃ mopping up HCl
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH₃CONH₂ */}
          <A x={80} y={115} el="CH₃" size={15}/>
          <Bond x1={101} y1={115} x2={130} y2={115}/>
          <A x={144} y={115} el="C" size={17}/>
          <Bond x1={154} y1={109} x2={182} y2={96} dbl/>
          <A x={195} y={89} el="O" size={17}/>
          <Bond x1={154} y1={121} x2={185} y2={135}/>
          <A x={200} y={142} el="NH₂" size={14} color="#1d4ed8"/>
          <text x={144} y={175} textAnchor="middle" style={{fontSize:"11px",fontFamily:"Georgia,serif",fill:"#059669",fontWeight:700}}>CH₃CONH₂</text>
          {/* + sign */}
          <text x={280} y={120} textAnchor="middle" style={{fontSize:"20px",fill:"#64748b",fontWeight:300}}>+</text>
          {/* NH₄Cl */}
          <A x={370} y={115} el="NH₄Cl" size={14} color="#64748b"/>
          <text x={370} y={155} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#64748b"}}>(2nd NH₃ + HCl)</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: NH₃ on left, CH₃COCl on right
    return (
      <MechSVGBase animKey={animKey}>
        {/* NH3 nucleophile */}
        <A x={80} y={115} el="NH₃" size={15} color="#1d4ed8"/>
        <LP x={104} y={108} angle={0} color="#1d4ed8"/>
        {/* CH3COCl */}
        <A x={200} y={115} el="CH₃" size={15}/>
        <Bond x1={222} y1={115} x2={245} y2={115}/>
        <A x={260} y={115} el="C" size={17}/>
        <Delta x={250} y={97} sign="+"/>
        {/* C=O */}
        <Bond x1={270} y1={108} x2={302} y2={95} dbl/>
        <A x={315} y={88} el="O" size={17}/>
        <Delta x={330} y={76} sign="−"/>
        <LP x={330} y={86} angle={40} color="#b91c1c"/>
        {/* C-Cl */}
        <Bond x1={270} y1={122} x2={302} y2={135}/>
        <A x={315} y={143} el="Cl" size={17}/>
        <LP x={330} y={152} angle={70} color="#166534"/>
        <text x={80} y={155} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#059669",fontWeight:700}}>nucleophile</text>
        <text x={260} y={175} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#b91c1c",fontWeight:700}}>electrophilic acyl C</text>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── fc_acyl ──────────────────────────────────────────────────────────
  if (mech.id === "fc_acyl") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 0) {
      // Step 0: CH₃COCl + AlCl₃ generating acylium
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH₃COCl */}
          <A x={130} y={115} el="CH₃" size={15}/>
          <Bond x1={152} y1={115} x2={176} y2={115}/>
          <A x={192} y={115} el="C" size={17}/>
          <Bond x1={202} y1={108} x2={230} y2={94} dbl/>
          <A x={244} y={87} el="O" size={17}/>
          <Bond x1={202} y1={122} x2={230} y2={136}/>
          <A x={244} y={143} el="Cl" size={17}/>
          <LP x={258} y={152} angle={60} color="#166534"/>
          {/* AlCl₃ */}
          <A x={380} y={115} el="AlCl₃" size={14} color="#64748b"/>
          {/* dashed line showing interaction */}
          <Bond x1={268} y1={143} x2={355} y2={120} dash color="#94a3b8" width={1.5}/>
          <text x={192} y={175} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#7c3aed",fontWeight:700}}>acyl chloride</text>
          <text x={380} y={155} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#64748b",fontWeight:700}}>Lewis acid</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 1) {
      // Step 1: benzene + acylium CH₃CO⁺
      const cx=195, cy=118, r=50;
      const pts = Array.from({length:6},(_,i)=>{ const a=(i*60-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; });
      return (
        <MechSVGBase animKey={animKey}>
          {pts.map(([x,y],i)=>{ const [nx,ny]=pts[(i+1)%6]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; })}
          {[0,2,4].map(i=>{ const [x,y]=pts[i],[nx,ny]=pts[(i+1)%6]; const ddx=ny-y,ddy=x-nx,len=Math.sqrt(ddx*ddx+ddy*ddy)||1; const ox=ddx/len*5,oy=ddy/len*5; return <line key={`d${i}`} x1={x+ox} y1={y+oy} x2={nx+ox} y2={ny+oy} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; })}
          <A x={195} y={58} el="H" size={14} color="#64748b"/>
          <Bond x1={195} y1={67} x2={195} y2={68}/>
          {/* CH₃CO⁺ acylium */}
          <A x={370} y={115} el="CH₃" size={14}/>
          <Bond x1={386} y1={115} x2={408} y2={115}/>
          <A x={418} y={115} el="C" size={17}/>
          <Bond x1={428} y1={110} x2={450} y2={97} dbl/>
          <A x={458} y={92} el="O" size={16}/>
          <Charge x={434} y={100} val="+" color="#b91c1c"/>
          <text x={418} y={155} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#b91c1c",fontWeight:700}}>acylium ion</text>
          <Bond x1={248} y1={115} x2={348} y2={115} dash color="#94a3b8" width={1.5}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Step 2: arenium ion with –COCH₃ attached, sp3 carbon shown, arrow expels H⁺
    const cx=195, cy=118, r=50;
    const pts = Array.from({length:6},(_,i)=>{ const a=(i*60-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; });
    return (
      <MechSVGBase animKey={animKey}>
        {pts.map(([x,y],i)=>{ const [nx,ny]=pts[(i+1)%6]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; })}
        {[0,2,4].map(i=>{ const [x,y]=pts[i],[nx,ny]=pts[(i+1)%6]; const ddx=ny-y,ddy=x-nx,len=Math.sqrt(ddx*ddx+ddy*ddy)||1; const ox=ddx/len*5,oy=ddy/len*5; return <line key={`d${i}`} x1={x+ox} y1={y+oy} x2={nx+ox} y2={ny+oy} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; })}
        {/* sp3 carbon at top with H */}
        <A x={195} y={55} el="H" size={14} color="#64748b"/>
        <Bond x1={195} y1={64} x2={195} y2={68}/>
        {/* acyl group attached at top */}
        <Bond x1={195} y1={68} x2={280} y2={80}/>
        <A x={296} y={78} el="C" size={15}/>
        <Bond x1={306} y1={72} x2={328} y2={60} dbl/>
        <A x={338} y={55} el="O" size={15}/>
        <Bond x1={306} y1={83} x2={332} y2={92}/>
        <A x={346} y={97} el="CH₃" size={13}/>
        {/* + charge on ring */}
        <Charge x={155} y={155} val="+" color="#b91c1c"/>
        <text x={195} y={200} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#b91c1c",fontWeight:700}}>arenium ion (sp³ C)</text>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── eas ──────────────────────────────────────────────────────────────
  if (mech.id === "eas") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    const cx=195, cy=118, r=52;
    const pts = Array.from({length:6},(_,i)=>{ const a=(i*60-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; });
    const ringLines = pts.map(([x,y],i)=>{ const [nx,ny]=pts[(i+1)%6]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; });
    const dblLines = [0,2,4].map(i=>{ const [x,y]=pts[i],[nx,ny]=pts[(i+1)%6]; const ddx=ny-y,ddy=x-nx,len=Math.sqrt(ddx*ddx+ddy*ddy)||1; const ox=ddx/len*5,oy=ddy/len*5; return <line key={`d${i}`} x1={x+ox} y1={y+oy} x2={nx+ox} y2={ny+oy} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; });

    if (stepN === 0) {
      // Step 0: HNO3 + H2SO4 generating NO2+
      return (
        <MechSVGBase animKey={animKey}>
          <text x={280} y={50} textAnchor="middle" style={{fontSize:"14px",fontFamily:"Georgia,serif",fill:"#b91c1c",fontWeight:700}}>Generating NO₂⁺</text>
          <text x={280} y={78} textAnchor="middle" style={{fontSize:"13px",fontFamily:"Georgia,serif",fill:"#1a202c"}}>HNO₃ + H₂SO₄</text>
          <text x={280} y={100} textAnchor="middle" style={{fontSize:"16px",fill:"#64748b"}}>→</text>
          <text x={280} y={125} textAnchor="middle" style={{fontSize:"13px",fontFamily:"Georgia,serif",fill:"#b91c1c",fontWeight:700}}>NO₂⁺</text>
          <text x={280} y={147} textAnchor="middle" style={{fontSize:"12px",fontFamily:"Georgia,serif",fill:"#64748b"}}>+ H₂O + HSO₄⁻</text>
          <text x={280} y={175} textAnchor="middle" style={{fontSize:"11px",fontFamily:"sans-serif",fill:"#94a3b8"}}>Temperature kept below 55°C</text>
        </MechSVGBase>
      );
    }
    if (stepN === 1) {
      // Step 1: benzene + NO₂⁺
      return (
        <MechSVGBase animKey={animKey}>
          {ringLines}{dblLines}
          <A x={195} y={56} el="H" size={14} color="#64748b"/>
          <Bond x1={195} y1={65} x2={195} y2={66}/>
          <A x={380} y={118} el="NO₂" size={16} color="#b91c1c"/>
          <Charge x={412} y={104} val="+" color="#b91c1c"/>
          <Bond x1={250} y1={118} x2={356} y2={118} dash color="#94a3b8" width={1.5}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Step 2: arenium intermediate with NO₂, arrow expels H⁺
    return (
      <MechSVGBase animKey={animKey}>
        {ringLines}{dblLines}
        <A x={195} y={56} el="H" size={14} color="#64748b"/>
        <Bond x1={195} y1={65} x2={195} y2={66}/>
        {/* NO2 attached */}
        <Bond x1={195} y1={66} x2={280} y2={80}/>
        <A x={296} y={78} el="NO₂" size={14} color="#b91c1c"/>
        <Charge x={155} y={155} val="+" color="#b91c1c"/>
        <text x={195} y={200} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#b91c1c",fontWeight:700}}>arenium ion</text>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── elimination ──────────────────────────────────────────────────────
  if (mech.id === "elimination") {
    return (
      <MechSVGBase animKey={animKey}>
        {/* OH⁻ base on far left */}
        <A x={78} y={115} el="HO" size={16} color="#b91c1c"/>
        <Charge x={102} y={103} val="−" color="#b91c1c"/>
        <LP x={78} y={99} angle={0} color="#b91c1c"/>

        {/* β-carbon */}
        <A x={198} y={115} el="C" size={17}/>
        <text x={198} y={165} textAnchor="middle" style={{fontSize:"10px",fill:"#64748b",fontFamily:"sans-serif"}}>β-C</text>
        {/* β-H (the one being abstracted) */}
        <A x={185} y={86} el="H" size={15} color="#64748b"/>
        <Bond x1={193} y1={107} x2={188} y2={92}/>
        <A x={172} y={138} el="H" size={14} color="#64748b"/>
        <Bond x1={191} y1={121} x2={176} y2={135}/>

        {/* C–C bond */}
        <Bond x1={210} y1={115} x2={268} y2={115}/>

        {/* α-carbon */}
        <A x={282} y={115} el="C" size={17}/>
        <text x={282} y={165} textAnchor="middle" style={{fontSize:"10px",fill:"#64748b",fontFamily:"sans-serif"}}>α-C</text>
        <A x={300} y={87} el="H" size={14} color="#64748b"/>
        <Bond x1={284} y1={107} x2={298} y2={93}/>
        <A x={300} y={143} el="H" size={14} color="#64748b"/>
        <Bond x1={284} y1={123} x2={297} y2={138}/>

        {/* C–Br bond */}
        <Bond x1={296} y1={115} x2={385} y2={115}/>
        <A x={400} y={115} el="Br" size={17}/>
        <LP x={415} y={103} angle={70} color="#9a3412"/>

        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── frs ──────────────────────────────────────────────────────────────
  if (mech.id === "frs") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 0) {
      // Initiation: Cl–Cl with UV
      return (
        <MechSVGBase animKey={animKey}>
          <text x={280} y={38} textAnchor="middle" style={{fontSize:"14px",fontFamily:"sans-serif",fill:"#d97706",fontWeight:700}}>UV light (hν)</text>
          <text x={280} y={56} textAnchor="middle" style={{fontSize:"12px",fontFamily:"sans-serif",fill:"#64748b"}}>↓</text>
          <A x={165} y={115} el="Cl" size={18}/>
          <LP x={148} y={103} angle={150} color="#166534"/>
          <LP x={150} y={127} angle={120} color="#166534"/>
          <Bond x1={186} y1={115} x2={345} y2={115}/>
          <A x={365} y={115} el="Cl" size={18}/>
          <LP x={382} y={103} angle={30} color="#166534"/>
          <LP x={384} y={127} angle={60} color="#166534"/>
          <text x={265} y={145} textAnchor="middle" style={{fontSize:"10px",fontFamily:"sans-serif",fill:"#d97706",fontWeight:700}}>homolytic fission</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 1) {
      // Propagation 1: Cl• + CH4
      return (
        <MechSVGBase animKey={animKey}>
          <A x={88} y={115} el="Cl" size={18}/>
          <text x={106} y={99} style={{fontSize:"15px",fill:"#166534",fontWeight:700}}>•</text>
          <LP x={72} y={103} angle={150} color="#166534"/>

          <A x={275} y={115} el="C" size={17}/>
          <A x={275} y={82} el="H" size={15} color="#64748b"/><Bond x1={275} y1={107} x2={275} y2={89}/>
          <A x={245} y={138} el="H" size={15} color="#64748b"/><Bond x1={267} y1={121} x2={250} y2={135}/>
          <A x={305} y={138} el="H" size={15} color="#64748b"/><Bond x1={283} y1={121} x2={302} y2={135}/>
          <A x={310} y={89} el="H" size={15} color="#64748b"/><Bond x1={282} y1={108} x2={305} y2={93}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 2) {
      // Propagation 2: •CH3 + Cl2
      return (
        <MechSVGBase animKey={animKey}>
          <A x={95} y={115} el="C" size={17}/>
          <text x={113} y={99} style={{fontSize:"15px",fill:"#1a202c",fontWeight:700}}>•</text>
          <A x={95} y={82} el="H" size={14} color="#64748b"/><Bond x1={95} y1={107} x2={95} y2={89}/>
          <A x={68} y={138} el="H" size={14} color="#64748b"/><Bond x1={88} y1={121} x2={72} y2={135}/>
          <A x={122} y={138} el="H" size={14} color="#64748b"/><Bond x1={102} y1={121} x2={118} y2={135}/>

          <A x={278} y={115} el="Cl" size={18}/>
          <LP x={262} y={103} angle={150} color="#166534"/>
          <Bond x1={298} y1={115} x2={360} y2={115}/>
          <A x={378} y={115} el="Cl" size={18}/>
          <LP x={394} y={103} angle={30} color="#166534"/>
          <LP x={396} y={127} angle={60} color="#166534"/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Termination (step 3)
    return (
      <MechSVGBase animKey={animKey}>
        <text x={280} y={58} textAnchor="middle" style={{fontSize:"14px",fontFamily:"Georgia,serif",fill:"#1a202c",fontWeight:600}}>Termination: any two radicals combine</text>
        <text x={280} y={88} textAnchor="middle" style={{fontSize:"13px",fontFamily:"Georgia,serif",fill:"#64748b"}}>Cl• + Cl• → Cl₂</text>
        <text x={280} y={113} textAnchor="middle" style={{fontSize:"13px",fontFamily:"Georgia,serif",fill:"#64748b"}}>Cl• + •CH₃ → CH₃Cl</text>
        <text x={280} y={138} textAnchor="middle" style={{fontSize:"13px",fontFamily:"Georgia,serif",fill:"#64748b"}}>•CH₃ + •CH₃ → C₂H₆</text>
        <text x={280} y={168} textAnchor="middle" style={{fontSize:"11px",fontFamily:"sans-serif",fill:"#94a3b8"}}>No curly arrows — radicals combine directly</text>
      </MechSVGBase>
    );
  }

  return <MechSVGBase animKey={animKey}><text x={280} y={110} textAnchor="middle" fill="#94a3b8">Diagram coming soon</text></MechSVGBase>;
}

// Still / exam version: shows the KEY step (first step with arrows) with all its arrows in red, no animation.
// For multi-step mechanisms this shows the initial reactant layout — matching what AQA expects to be drawn.
function MechSVGStill({ mech }) {
  const keyStepIdx = mech.steps.findIndex(s => (s.arrows||[]).length > 0);
  const stepIdx = keyStepIdx >= 0 ? keyStepIdx : 0;
  return <MechSVG mech={mech} stepIdx={stepIdx} animKey={999} stillMode="step"/>;
}

export default function App() {
  const [screen, setScreen] = useState("board");
  const [board, setBoard] = useState(null);
  const CURRENT_SECTIONS = board === "ocr" ? OCR_SECTIONS : SECTIONS;
  const CURRENT_TOPIC_ORDER = board === "ocr" ? OCR_TOPIC_ORDER : TOPIC_ORDER;
  const [topic, setTopic] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => {
    try {
      const saved = localStorage.getItem('hsj-chem-known');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, new Set(v)]));
    } catch { return {}; }
  });
  const [order, setOrder] = useState([]);
  const [shuffled, setShuffled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [revealedRoutes, setRevealedRoutes] = useState(new Set());
  const [topicsTab, setTopicsTab] = useState("flashcards"); // "flashcards" | "synth" | "calc" | "extended"
  const [extCategory, setExtCategory] = useState(null);
  const [extIndex, setExtIndex] = useState(0);
  const [extRevealed, setExtRevealed] = useState(false);
  const [extMarked, setExtMarked] = useState(new Set());
  const [extDraft, setExtDraft] = useState("");
  const [extScore, setExtScore] = useState({}); // { questionId: marksAwarded }
  const [extAiResult, setExtAiResult] = useState(null);    // AI Examiner result
  const [extAiLoading, setExtAiLoading] = useState(false); // waiting for API
  const [extShowModel, setExtShowModel] = useState(false); // model answer toggle
  const [extAiError, setExtAiError] = useState(null);      // error message if API fails
  const [calcTopic, setCalcTopic] = useState(null);
  const [calcIndex, setCalcIndex] = useState(0);
  const [calcInput, setCalcInput] = useState("");
  const [calcChecked, setCalcChecked] = useState(false);
  const [calcShowSteps, setCalcShowSteps] = useState(false);
  const [calcScore, setCalcScore] = useState({}); // { topicId: { correct, attempted } }
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const [mechId, setMechId] = useState(null);
  const [mechStep, setMechStep] = useState(0);
  const [mechAnimKey, setMechAnimKey] = useState(0);
  const [mechStill, setMechStill] = useState(false);
  const [synthTab, setSynthTab] = useState("ali");
  const [selectedRxn, setSelectedRxn] = useState(null);
  const [synthQuiz, setSynthQuiz] = useState(false);
  // ── Random Quiz ──────────────────────────────────────────────────────────────
  const [quizScreen, setQuizScreen] = useState(null); // null | "setup" | "running" | "done"
  const [quizYear, setQuizYear] = useState("as");      // "as" | "a2" | "all"
  const [quizDeck, setQuizDeck] = useState([]);        // [{topicId, cardIdx, q, a}]
  const [quizPos, setQuizPos] = useState(0);
  const [quizFlipped, setQuizFlipped] = useState(false);
  const [quizSessionScore, setQuizSessionScore] = useState({ correct: 0, wrong: 0 });
  const [quizHistory, setQuizHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hsj-quiz-history') || '{}'); }
    catch { return {}; }
  });

  const cards = topic ? SETS[topic].cards : [];
  const currentCardIndex = order[index];
  const card = cards[currentCardIndex] || { q: "", a: "" };
  const knownKey = topic || "";
  const knownSet = known[knownKey] || new Set();
  const knownCount = knownSet.size;

  const selectBoard = (b) => { setBoard(b); setScreen("topics"); };
  const selectTopic = (t) => {
    setTopic(t);
    setOrder(SETS[t].cards.map((_, i) => i));
    setIndex(0); setFlipped(false); setShuffled(false); setShowMenu(false);
    setScreen("cards");
  };
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      const serialisable = Object.fromEntries(Object.entries(known).map(([k, v]) => [k, [...v]]));
      localStorage.setItem('hsj-chem-known', JSON.stringify(serialisable));
    } catch {}
  }, [known]);

  // Save quiz history to localStorage
  useEffect(() => {
    try { localStorage.setItem('hsj-quiz-history', JSON.stringify(quizHistory)); }
    catch {}
  }, [quizHistory]);

  // ── Quiz helpers ─────────────────────────────────────────────────────────────
  const AQA_AS_SECTIONS = ["physical_as", "inorganic_as", "organic", "practicals_as"];
  const AQA_A2_SECTIONS = ["physical_a2", "inorganic_a2", "organic2", "practicals_a2"];
  const OCR_AS_SECTIONS = ["ocr_mod2", "ocr_mod3", "ocr_mod4"];
  const OCR_A2_SECTIONS = ["ocr_mod5", "ocr_mod6"];

  const buildQuizDeck = (year) => {
    const allSections = board === "ocr" ? OCR_SECTIONS : SECTIONS;
    let sectionFilter;
    const asSecs = board === "ocr" ? OCR_AS_SECTIONS : AQA_AS_SECTIONS;
    const a2Secs = board === "ocr" ? OCR_A2_SECTIONS : AQA_A2_SECTIONS;
    if (year === "as") sectionFilter = asSecs;
    else if (year === "a2") sectionFilter = a2Secs;
    else sectionFilter = [...asSecs, ...a2Secs];

    const eligibleTopics = allSections
      .filter(s => sectionFilter.includes(s.id))
      .flatMap(s => s.topics)
      .filter(id => SETS[id]);

    // Build weighted pool
    const pool = [];
    for (const topicId of eligibleTopics) {
      const cards = SETS[topicId].cards;
      cards.forEach((card, cardIdx) => {
        const key = `${topicId}-${cardIdx}`;
        const h = quizHistory[key];
        let weight;
        if (!h) {
          weight = 3; // never seen
        } else {
          const { c = 0, w = 0 } = h;
          const total = c + w;
          if (total === 0) { weight = 3; }
          else if (c >= 3 && c / total >= 0.7) { weight = 0.5; } // mastered
          else if (w > c) { weight = 4; } // more wrong than correct
          else { weight = 2; }
        }
        pool.push({ topicId, cardIdx, q: card.q, a: card.a, weight });
      });
    }
    if (pool.length === 0) return [];

    // Weighted random sample of 25 cards (no repeats)
    const DECK_SIZE = Math.min(25, pool.length);
    const selected = [];
    const remaining = [...pool];
    for (let i = 0; i < DECK_SIZE; i++) {
      const totalW = remaining.reduce((s, c) => s + c.weight, 0);
      let r = Math.random() * totalW;
      let idx = 0;
      while (idx < remaining.length - 1 && r > remaining[idx].weight) {
        r -= remaining[idx].weight;
        idx++;
      }
      selected.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
    return selected;
  };

  const startQuiz = () => {
    const deck = buildQuizDeck(quizYear);
    setQuizDeck(deck);
    setQuizPos(0);
    setQuizFlipped(false);
    setQuizSessionScore({ correct: 0, wrong: 0 });
    setQuizScreen("running");
  };

  const recordQuizAnswer = (correct) => {
    const card = quizDeck[quizPos];
    const key = `${card.topicId}-${card.cardIdx}`;
    setQuizHistory(prev => {
      const h = prev[key] || { c: 0, w: 0 };
      return { ...prev, [key]: correct ? { c: h.c + 1, w: h.w } : { c: h.c, w: h.w + 1 } };
    });
    setQuizSessionScore(prev => correct
      ? { ...prev, correct: prev.correct + 1 }
      : { ...prev, wrong: prev.wrong + 1 }
    );
    const isLast = quizPos >= quizDeck.length - 1;
    if (isLast) {
      setQuizScreen("done");
    } else {
      setQuizFlipped(false);
      setTimeout(() => setQuizPos(p => p + 1), 120);
    }
  };

  const goBack = () => {
    if (screen === "cards") { setScreen("topics"); setTopic(null); }
    else if (screen === "dashboard") { setScreen("topics"); }
    else if (screen === "topics" && activeSection) { setActiveSection(null); }
    else if (screen === "topics") { setScreen("board"); setBoard(null); }
  };

  const next = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.min(i + 1, order.length - 1)), 100); }, [order.length]);
  const prev = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 100); }, []);
  const toggleKnown = useCallback(() => {
    setKnown(prev => {
      const s = new Set(prev[knownKey] || []);
      s.has(currentCardIndex) ? s.delete(currentCardIndex) : s.add(currentCardIndex);
      return { ...prev, [knownKey]: s };
    });
  }, [knownKey, currentCardIndex]);

  const shuffle = useCallback(() => {
    const arr = cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    setOrder(arr); setIndex(0); setFlipped(false); setShuffled(true); setShowMenu(false);
  }, [cards]);

  const reset = useCallback(() => {
    setOrder(cards.map((_, i) => i)); setIndex(0); setFlipped(false); setShuffled(false); setShowMenu(false);
  }, [cards]);

  const studyUnknown = useCallback(() => {
    const unknown = cards.map((_, i) => i).filter(i => !knownSet.has(i));
    if (unknown.length === 0) return;
    setOrder(unknown); setIndex(0); setFlipped(false); setShowMenu(false);
  }, [cards, knownSet]);

  useEffect(() => {
    if (screen !== "cards") return;
    const h = (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(f => !f); }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [screen, next, prev]);

  useEffect(() => {
    if (topicsTab !== "synth" || !selectedFrom) return;
    if (typeof window === "undefined" || !window.SmilesDrawer) return;
    const timer = setTimeout(() => {
      try {
        window.SmilesDrawer.apply({
          width: 160, height: 110,
          bondThickness: 1.5, bondLength: 30,
          fontSizeLarge: 8, fontSizeSmall: 6,
          padding: 10,
          themes: {
            light: { C:"#1a2d45", N:"#1d4ed8", O:"#dc2626", S:"#b45309",
                     Cl:"#15803d", Br:"#92400e", F:"#7c3aed", H:"#9ca3af",
                     BACKGROUND:"#f8fafc" }
          }
        });
      } catch(e) {}
    }, 120);
    return () => clearTimeout(timer);
  }, [topicsTab, selectedFrom, board, revealedRoutes]);

  const onTS = e => { touchStart.current = e.targetTouches[0].clientX; };
  const onTM = e => { touchEnd.current = e.targetTouches[0].clientX; };
  const onTE = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const d = touchStart.current - touchEnd.current;
    if (Math.abs(d) > 60) { d > 0 ? next() : prev(); }
    touchStart.current = null; touchEnd.current = null;
  };

  const bg = "#f0f4f8";
  const base = { minHeight: "100vh", background: bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#1a2d45", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" };

  const Header = ({ title, sub, back }) => (
    <div style={{ padding: "16px 20px 10px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #dde4ed", background: "#ffffff", position: "relative", zIndex: 2 }}>
      {back && <button onClick={back} style={{ background: "#f0f4f8", border: "1px solid #dde4ed", borderRadius: "8px", padding: "8px 12px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "18px", color: "#29ABE2", letterSpacing: "-0.5px" }}>HSJ TUITION</div>
        <div style={{ fontSize: "10px", color: "#7a95b0", letterSpacing: "2px", textTransform: "uppercase", marginTop: "2px" }}>{sub || "A-Level Chemistry · Mastered"}</div>
      </div>
    </div>
  );

  // BOARD SELECT
  if (screen === "board") return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
      <Header />
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px", maxWidth: "500px", margin: "0 auto", width: "100%" }}>
        <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: 700, color: "#1a2d45", margin: "0 0 8px" }}>Choose your exam board</h2>
        {[{ id: "aqa", label: "AQA", count: TOPIC_ORDER.length + " topics" }, { id: "ocr", label: "OCR A", count: OCR_TOPIC_ORDER.length + " topics" }].map(b => (
          <button key={b.id} onClick={() => selectBoard(b.id)} style={{
            padding: "24px 20px", borderRadius: "16px",
            background: "#ffffff",
            border: "1px solid #29ABE2",
            color: "#1a2d45",
            cursor: "pointer",
            textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(41,171,226,0.15)",
          }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>{b.label}</div>
            <div style={{ fontSize: "13px", color: "#29ABE2", marginTop: "4px" }}>{b.count}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // DASHBOARD
  if (screen === "dashboard") {
    const allTopics = CURRENT_TOPIC_ORDER.map(id => {
      const s = SETS[id];
      const k = (known[id] || new Set()).size;
      const pct = Math.round((k / s.cards.length) * 100);
      return { id, title: s.title, total: s.cards.length, mastered: k, pct };
    });
    const totalCards = allTopics.reduce((a, t) => a + t.total, 0);
    const totalMastered = allTopics.reduce((a, t) => a + t.mastered, 0);
    const overallPct = Math.round((totalMastered / totalCards) * 100);
    const started = allTopics.filter(t => t.mastered > 0);
    const needsWork = [...allTopics].filter(t => t.pct < 70).sort((a, b) => a.pct - b.pct).slice(0, 5);
    const goingWell = [...allTopics].filter(t => t.pct >= 70).sort((a, b) => b.pct - a.pct);

    const StatCard = ({ label, value, sub, color }) => (
      <div style={{ background: "#ffffff", borderRadius: "16px", padding: "16px", flex: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderTop: `4px solid ${color}` }}>
        <div style={{ fontSize: "28px", fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginTop: "2px" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "2px" }}>{sub}</div>}
      </div>
    );

    const TopicRow = ({ t, showBar }) => (
      <div onClick={() => { setActiveSection(null); selectTopic(t.id); }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#ffffff", borderRadius: "12px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showBar ? "5px" : 0 }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#29ABE2", marginRight: "6px" }}>{t.id}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a2d45" }}>{t.title}</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: t.pct === 0 ? "#b0c4d4" : t.pct === 100 ? "#29ABE2" : "#1a8fc4", flexShrink: 0, marginLeft: "8px" }}>{t.pct}%</span>
          </div>
          {showBar && <div style={{ height: "4px", background: "#e8edf3", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${t.pct}%`, background: "linear-gradient(90deg, #29ABE2, #1a8fc4)", borderRadius: "2px" }} />
          </div>}
        </div>
        <div style={{ fontSize: "11px", color: "#7a95b0", flexShrink: 0 }}>{t.mastered}/{t.total}</div>
      </div>
    );

    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
        <Header sub="Progress Dashboard" back={goBack} />
        <div style={{ padding: "16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Hero stats */}
          <div style={{ background: "linear-gradient(135deg, #29ABE2, #1a8fc4)", borderRadius: "20px", padding: "20px", color: "#fff", boxShadow: "0 8px 24px rgba(41,171,226,0.3)" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, opacity: 0.85, marginBottom: "4px" }}>Overall Progress</div>
            <div style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1 }}>{overallPct}%</div>
            <div style={{ fontSize: "14px", opacity: 0.85, marginTop: "4px" }}>{totalMastered} of {totalCards} cards mastered</div>
            <div style={{ marginTop: "12px", height: "6px", background: "rgba(255,255,255,0.25)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${overallPct}%`, background: "#ffffff", borderRadius: "3px", transition: "width 0.5s" }} />
            </div>
          </div>

          {/* Quick stats row */}
          <div style={{ display: "flex", gap: "10px" }}>
            <StatCard label="Topics Started" value={started.length} sub={`of ${CURRENT_TOPIC_ORDER.length} total`} color="#29ABE2" />
            <StatCard label="Fully Mastered" value={allTopics.filter(t => t.pct === 100).length} sub="100% complete" color="#1a8fc4" />
            <StatCard label="Not Started" value={allTopics.filter(t => t.mastered === 0).length} sub="topics" color="#b0c4d4" />
          </div>

          {/* Section breakdown */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a95b0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>By Section</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {CURRENT_SECTIONS.map(sec => {
                const secTotal = sec.topics.reduce((a, id) => a + SETS[id].cards.length, 0);
                const secMastered = sec.topics.reduce((a, id) => a + (known[id] || new Set()).size, 0);
                const secPct = Math.round((secMastered / secTotal) * 100);
                return (
                  <div key={sec.id} style={{ background: "#ffffff", borderRadius: "12px", padding: "12px 14px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45" }}>{sec.label}</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#29ABE2" }}>{secPct}%</span>
                    </div>
                    <div style={{ height: "5px", background: "#e8edf3", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${secPct}%`, background: "linear-gradient(90deg, #29ABE2, #1a8fc4)", borderRadius: "3px" }} />
                    </div>
                    <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{secMastered} / {secTotal} cards</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Needs work */}
          {needsWork.length > 0 && (
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a95b0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>⚠️ Needs Attention</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {needsWork.map(t => <TopicRow key={t.id} t={t} showBar={true} />)}
              </div>
            </div>
          )}

          {/* Going well */}
          {goingWell.length > 0 && (
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a95b0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Going Well</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {goingWell.map(t => <TopicRow key={t.id} t={t} showBar={false} />)}
              </div>
            </div>
          )}

          {totalMastered === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a95b0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px", color: "#29ABE2", fontWeight: 700 }}>0%</div>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>No progress yet</div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>Start studying and your progress will appear here</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TOPIC SELECT
  const FOLDER_COLORS = {
    physical_as:   { accent: "#29ABE2", bg: "#eaf6fd", border: "#29ABE2" },
    physical_a2:   { accent: "#0090cc", bg: "#e0f2fa", border: "#0090cc" },
    inorganic_as:  { accent: "#16a97d", bg: "#e6f9f3", border: "#16a97d" },
    inorganic_a2:  { accent: "#0d8c68", bg: "#dcf5ed", border: "#0d8c68" },
    organic:       { accent: "#7c3aed", bg: "#f3eeff", border: "#7c3aed" },
    organic2:      { accent: "#6d28d9", bg: "#ede9ff", border: "#6d28d9" },
    practicals_as: { accent: "#d97706", bg: "#fef6e4", border: "#d97706" },
    practicals_a2: { accent: "#b45309", bg: "#fef0d0", border: "#b45309" },
    ocr_mod2: { accent: "#e05c00", bg: "#fff3eb", border: "#e05c00" },
    ocr_mod3: { accent: "#c0392b", bg: "#fdecec", border: "#c0392b" },
    ocr_mod4: { accent: "#8e44ad", bg: "#f5eeff", border: "#8e44ad" },
    ocr_mod5: { accent: "#1a6b9a", bg: "#e8f4fb", border: "#1a6b9a" },
    ocr_mod6: { accent: "#16783a", bg: "#e9f7ef", border: "#16783a" },
  };

  if (screen === "topics" && activeSection) {
    const section = CURRENT_SECTIONS.find(s => s.id === activeSection);
    const fc = FOLDER_COLORS[activeSection] || FOLDER_COLORS.physical_as;
    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
        <Header sub={section.label} back={goBack} />
        <div style={{ padding: "8px 16px 24px", flex: 1, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
            {section.topics.map(id => {
              const s = SETS[id];
              const k = (known[id] || new Set()).size;
              const pct = Math.round((k / s.cards.length) * 100);
              return (
                <button key={id} onClick={() => selectTopic(id)} style={{
                  padding: "14px 12px 12px", borderRadius: "16px",
                  background: "#ffffff", border: `2px solid ${fc.accent}40`,
                  color: "#1a2d45", cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit", position: "relative", overflow: "hidden",
                  minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ borderLeft: `3px solid ${fc.accent}`, paddingLeft: "8px" }}>
                    <div style={{ fontSize: "11px", color: fc.accent, fontWeight: 800, letterSpacing: "0.3px", marginBottom: "4px" }}>{id}</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a2d45", lineHeight: 1.3 }}>{s.title}</div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <span style={{ fontSize: "11px", color: "#7a95b0" }}>{s.cards.length} cards</span>
                      {k > 0 && <span style={{ fontSize: "11px", color: "#29ABE2", fontWeight: 700 }}>{k} known</span>}
                    </div>
                    <div style={{ height: "4px", background: "rgba(0,0,0,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: fc.accent, borderRadius: "2px", transition: "width 0.3s" }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "topics") return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
      <div style={{ padding: "12px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #dde4ed", background: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={goBack} style={{ background: "#f0f4f8", border: "1px solid #dde4ed", borderRadius: "8px", padding: "8px 12px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "17px", color: "#29ABE2" }}>HSJ TUITION</div>
            <div style={{ fontSize: "10px", color: "#7a95b0", letterSpacing: "2px", textTransform: "uppercase" }}>{board === "ocr" ? "OCR A · A-Level Chemistry" : "AQA · A-Level Chemistry"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setScreen("dashboard")} style={{ background: "#29ABE2", border: "none", borderRadius: "10px", padding: "9px 14px", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 2px 8px rgba(41,171,226,0.3)" }}>My Progress</button>
        </div>
      </div>
      {/* Tab bar */}
      <style>{`.hsjTabBar::-webkit-scrollbar{display:none}`}</style>
      <div className="hsjTabBar" style={{
        display: "flex", gap: "6px", padding: "10px 14px",
        background: "#f0f4f8", borderBottom: "1px solid #dde4ed",
        overflowX: "auto", WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none", msOverflowStyle: "none", flexShrink: 0,
      }}>
        {[
          { id: "flashcards", label: "Cards",      color: "#29ABE2" },
          { id: "synth",      label: "Synthesis",  color: "#29ABE2" },
          { id: "pathways",   label: "Pathways",   color: "#059669" },
          { id: "calc",       label: "Calcs",      color: "#29ABE2" },
          { id: "extended",   label: "6-Mark",     color: "#7c3aed" },
          { id: "mechanisms", label: "Mechanisms", color: "#d97706" },
        ].map(({ id, label, color }) => {
          const active = topicsTab === id;
          return (
            <button key={id}
              onClick={() => { setTopicsTab(id); setSelectedRxn(null); if (id === "pathways") setSelectedFrom(null); if (id === "synth") setSelectedFrom(null); if (id === "mechanisms") { setMechId(null); setMechStep(0); } }}
              style={{
                padding: "8px 16px", borderRadius: "22px", border: "none",
                cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
                fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                background: active ? color : "#ffffff",
                color: active ? "#ffffff" : "#4a6080",
                boxShadow: active ? `0 2px 10px ${color}45` : "0 1px 3px rgba(0,0,0,0.08)",
              }}>
              {label}
            </button>
          );
        })}
      </div>
      {topicsTab === "flashcards" && quizScreen === "setup" && (
        <div style={{ padding: "24px 16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "360px" }}>
            <button onClick={() => setQuizScreen(null)} style={{ background: "none", border: "none", color: "#7a95b0", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600, padding: "0 0 16px 0", display: "flex", alignItems: "center", gap: "4px" }}>← Back to Topics</button>
            <div style={{ background: "linear-gradient(135deg,#29ABE2,#0090cc)", borderRadius: "20px", padding: "24px 20px", color: "#fff", marginBottom: "24px", boxShadow: "0 6px 20px rgba(41,171,226,0.35)" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>🎯</div>
              <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>Random Quiz</div>
              <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "4px" }}>Cards you struggle with appear more often</div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Year Level</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[["as","AS Year 1"],["a2","A2 Year 2"],["all","All Topics"]].map(([v,label]) => (
                  <button key={v} onClick={() => setQuizYear(v)} style={{
                    flex: 1, padding: "12px 8px", borderRadius: "12px", border: "2px solid",
                    borderColor: quizYear === v ? "#29ABE2" : "#dde4ed",
                    background: quizYear === v ? "#eaf6fd" : "#ffffff",
                    color: quizYear === v ? "#29ABE2" : "#7a95b0",
                    fontFamily: "inherit", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.15s",
                  }}>{label}</button>
                ))}
              </div>
            </div>
            {(() => {
              const asSecs = board === "ocr" ? OCR_AS_SECTIONS : AQA_AS_SECTIONS;
              const a2Secs = board === "ocr" ? OCR_A2_SECTIONS : AQA_A2_SECTIONS;
              const filter = quizYear === "as" ? asSecs : quizYear === "a2" ? a2Secs : [...asSecs, ...a2Secs];
              const allSections = board === "ocr" ? OCR_SECTIONS : SECTIONS;
              const total = allSections.filter(s => filter.includes(s.id)).flatMap(s => s.topics).filter(id => SETS[id]).reduce((sum, id) => sum + SETS[id].cards.length, 0);
              return (
                <div style={{ fontSize: "12px", color: "#7a95b0", textAlign: "center", marginBottom: "20px" }}>
                  Drawing from <strong style={{ color: "#1a2d45" }}>{total}</strong> cards · Session size: <strong style={{ color: "#1a2d45" }}>25</strong>
                </div>
              );
            })()}
            <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "14px 16px", marginBottom: "24px", border: "1px solid #e0e8f0" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#4a6070", marginBottom: "8px", letterSpacing: "0.5px" }}>HOW IT WORKS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[["🔴","Cards you miss → shown 4× more often"],["🟡","New cards → shown 3× more often"],["🟢","Cards you know → shown less often"],["✅","Mastered (3+ correct, ≥70%) → rare"]].map(([icon,text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#4a6070" }}>
                    <span style={{ flexShrink: 0 }}>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={startQuiz} style={{
              width: "100%", padding: "16px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg,#29ABE2,#0090cc)", color: "#ffffff",
              fontFamily: "inherit", fontSize: "16px", fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(41,171,226,0.4)", letterSpacing: "-0.3px",
            }}>Start Quiz →</button>
          </div>
        </div>
      )}
      {topicsTab === "flashcards" && quizScreen === "running" && (() => {
        const card = quizDeck[quizPos];
        const progress = Math.round(((quizPos) / quizDeck.length) * 100);
        const topicTitle = SETS[card?.topicId]?.title || card?.topicId || "";
        return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "400px" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <button onClick={() => setQuizScreen("setup")} style={{ background: "none", border: "none", color: "#7a95b0", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>✕ Exit</button>
                <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{quizPos + 1} / {quizDeck.length}</div>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>
                  <span style={{ color: "#22c55e" }}>✓ {quizSessionScore.correct}</span>
                  <span style={{ color: "#d1d5db", margin: "0 4px" }}>|</span>
                  <span style={{ color: "#ef4444" }}>✗ {quizSessionScore.wrong}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: "5px", background: "#e0e8f0", borderRadius: "3px", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#29ABE2,#22c55e)", borderRadius: "3px", transition: "width 0.3s" }} />
              </div>
              {/* Topic label */}
              <div style={{ fontSize: "10px", color: "#7a95b0", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", textAlign: "center", marginBottom: "10px" }}>{topicTitle}</div>
              {/* Card */}
              <div onClick={() => setQuizFlipped(f => !f)} style={{
                minHeight: "200px", borderRadius: "20px", padding: "28px 22px",
                background: quizFlipped ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "#ffffff",
                border: `2px solid ${quizFlipped ? "#86efac" : "#dde4ed"}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                textAlign: "center", transition: "all 0.2s", userSelect: "none",
                marginBottom: "16px",
              }}>
                {!quizFlipped ? (
                  <>
                    <div style={{ fontSize: "11px", color: "#29ABE2", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px" }}>QUESTION</div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "#1a2d45", lineHeight: 1.5 }}>{card?.q}</div>
                    <div style={{ marginTop: "20px", fontSize: "11px", color: "#aab5c2" }}>Tap to reveal answer</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px" }}>ANSWER</div>
                    <div style={{ fontSize: "14px", color: "#1a2d45", lineHeight: 1.6, whiteSpace: "pre-line" }}>{card?.a}</div>
                  </>
                )}
              </div>
              {/* Answer buttons */}
              {quizFlipped ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => recordQuizAnswer(false)} style={{
                    flex: 1, padding: "16px 10px", borderRadius: "14px", border: "2px solid #fecaca",
                    background: "#fff5f5", color: "#dc2626", fontFamily: "inherit", fontSize: "14px",
                    fontWeight: 800, cursor: "pointer",
                  }}>✗ Missed it</button>
                  <button onClick={() => recordQuizAnswer(true)} style={{
                    flex: 1, padding: "16px 10px", borderRadius: "14px", border: "none",
                    background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#ffffff",
                    fontFamily: "inherit", fontSize: "14px", fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(34,197,94,0.35)",
                  }}>✓ Got it</button>
                </div>
              ) : (
                <div style={{ height: "54px" }} />
              )}
            </div>
          </div>
        );
      })()}
      {topicsTab === "flashcards" && quizScreen === "done" && (() => {
        const total = quizSessionScore.correct + quizSessionScore.wrong;
        const pct = total > 0 ? Math.round((quizSessionScore.correct / total) * 100) : 0;
        const emoji = pct >= 90 ? "🏆" : pct >= 70 ? "🎯" : pct >= 50 ? "📚" : "💪";
        const msg = pct >= 90 ? "Outstanding!" : pct >= 70 ? "Great work!" : pct >= 50 ? "Good effort!" : "Keep practising!";
        // Find weakest topics from this session
        const topicWrong = {};
        quizDeck.forEach((card, i) => {
          const key = `${card.topicId}-${card.cardIdx}`;
          const h = quizHistory[key];
          if (h && h.w > 0) {
            topicWrong[card.topicId] = (topicWrong[card.topicId] || 0) + h.w;
          }
        });
        const weakTopics = Object.entries(topicWrong).sort((a,b) => b[1]-a[1]).slice(0,3);
        return (
          <div style={{ padding: "24px 16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "360px" }}>
              {/* Score card */}
              <div style={{ background: "linear-gradient(135deg,#1a2d45,#29ABE2)", borderRadius: "24px", padding: "32px 24px", textAlign: "center", color: "#fff", marginBottom: "20px", boxShadow: "0 8px 28px rgba(41,171,226,0.3)" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>{emoji}</div>
                <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "4px" }}>{msg}</div>
                <div style={{ fontSize: "52px", fontWeight: 800, lineHeight: 1, margin: "12px 0" }}>{pct}%</div>
                <div style={{ fontSize: "14px", opacity: 0.85 }}>{quizSessionScore.correct} correct · {quizSessionScore.wrong} missed · {total} cards</div>
              </div>
              {/* Weak topics */}
              {weakTopics.length > 0 && (
                <div style={{ background: "#fff9f0", border: "1px solid #fed7aa", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#c2410c", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Focus Areas</div>
                  {weakTopics.map(([topicId, wrongCount]) => (
                    <div key={topicId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #fed7aa20" }}>
                      <span style={{ fontSize: "12px", color: "#1a2d45", fontWeight: 600 }}>{SETS[topicId]?.title || topicId}</span>
                      <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700 }}>{wrongCount} missed</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => { startQuiz(); }} style={{
                  width: "100%", padding: "16px", borderRadius: "14px", border: "none",
                  background: "linear-gradient(135deg,#29ABE2,#0090cc)", color: "#ffffff",
                  fontFamily: "inherit", fontSize: "15px", fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(41,171,226,0.4)",
                }}>Play Again →</button>
                <button onClick={() => setQuizScreen("setup")} style={{
                  width: "100%", padding: "14px", borderRadius: "14px", border: "2px solid #dde4ed",
                  background: "#ffffff", color: "#4a6070", fontFamily: "inherit", fontSize: "14px",
                  fontWeight: 700, cursor: "pointer",
                }}>Change Settings</button>
                <button onClick={() => setQuizScreen(null)} style={{
                  width: "100%", padding: "14px", borderRadius: "14px", border: "none",
                  background: "none", color: "#7a95b0", fontFamily: "inherit", fontSize: "13px",
                  fontWeight: 600, cursor: "pointer",
                }}>Back to Topics</button>
              </div>
            </div>
          </div>
        );
      })()}
      {topicsTab === "flashcards" && !quizScreen && (
        <div style={{ padding: "8px 16px 24px", flex: 1, overflowY: "auto" }}>
          {/* Random Quiz launch card */}
          <button onClick={() => setQuizScreen("setup")} style={{
            width: "100%", padding: "14px 16px", borderRadius: "16px", border: "none",
            background: "linear-gradient(135deg,#29ABE2 0%,#0090cc 100%)", color: "#ffffff",
            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 4px 16px rgba(41,171,226,0.35)", marginBottom: "12px", marginTop: "4px",
          }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>🎯 Random Quiz</div>
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>Spaced repetition · 25 cards · adapts to your gaps</div>
            </div>
            <div style={{ fontSize: "20px", opacity: 0.8 }}>→</div>
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
            {CURRENT_SECTIONS.map(section => {
              const fc = FOLDER_COLORS[section.id] || FOLDER_COLORS.physical_as;
              const totalCards = section.topics.reduce((sum, id) => sum + SETS[id].cards.length, 0);
              const totalKnown = section.topics.reduce((sum, id) => sum + (known[id] || new Set()).size, 0);
              const pct = totalCards > 0 ? Math.round((totalKnown / totalCards) * 100) : 0;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)} style={{
                  padding: "16px 14px 14px", borderRadius: "16px",
                  background: fc.bg, border: `2px solid ${fc.border}40`,
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  position: "relative", overflow: "hidden", minHeight: "110px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}>
                  <div style={{ borderLeft: `4px solid ${fc.accent}`, paddingLeft: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3 }}>{section.label}</div>
                    <div style={{ fontSize: "11px", color: fc.accent, marginTop: "3px", fontWeight: 600 }}>{section.topics.length} topics · {totalCards} cards</div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ height: "4px", background: "rgba(0,0,0,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: fc.accent, borderRadius: "2px", transition: "width 0.3s" }} />
                    </div>
                    {pct > 0 && <div style={{ fontSize: "10px", color: fc.accent, marginTop: "4px", fontWeight: 600 }}>{pct}% mastered</div>}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "#4a6070" }}>
            {CURRENT_TOPIC_ORDER.map(id => SETS[id]?.cards.length || 0).reduce((a,b)=>a+b,0)} cards · {CURRENT_TOPIC_ORDER.length} topics
          </div>
        </div>
      )}
      {topicsTab === "synth" && (() => {
        const mechColors = {
          "Free Radical Substitution": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
          "Electrophilic Addition": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Electrophilic Addition (hydration)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Electrophilic Aromatic Substitution (nitration)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Electrophilic Aromatic Substitution (halogenation)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Friedel-Crafts Alkylation (EAS)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Friedel-Crafts Acylation (EAS)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Nucleophilic Substitution (SN2 for 1°, SN1 for 3°)": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Substitution (SN2)": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Substitution": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Addition": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Addition-Elimination": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Elimination (E2)": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
          "Acid-catalysed Elimination (dehydration)": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
          "Oxidation": { bg: "#fefce8", text: "#a16207", border: "#fde68a" },
          "Reduction": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
          "Reduction (nucleophilic addition of H⁻)": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
          "Catalytic Hydrogenation": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
          "Condensation (Esterification)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Condensation (Fischer Esterification)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Condensation": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Acid-Base Neutralisation": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
          "Acid-base reaction": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
          "Hydrolysis": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Acid-catalysed Hydrolysis (reversible)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Base-catalysed Hydrolysis (irreversible)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Diazotisation": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
          "Coupling Reaction (Electrophilic Aromatic Substitution)": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
        };
        const getMC = (m) => mechColors[m] || { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" };
        const boardRoutes = SYNTH_ROUTES.filter(r => r.board === "both" || r.board === board || !board);
        const allFroms = [...new Set(boardRoutes.map(r => r.from))];
        const filteredRoutes = selectedFrom ? boardRoutes.filter(r => r.from === selectedFrom) : [];
        const aromaticFroms = new Set(["Arene", "Nitrobenzene", "Arylamine", "Diazonium Salt"]);
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px 7px", borderBottom: "1px solid #e8edf2", background: "#fafbfc", flexShrink: 0 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: selectedFrom ? "#29ABE2" : "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {selectedFrom ? `From: ${selectedFrom}` : "Pick a starting material"}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {selectedFrom && (
                  <button onClick={() => { setSelectedFrom(null); setRevealedRoutes(new Set()); }} style={{
                    padding: "4px 10px", borderRadius: "20px", border: "1px solid #e0e8f0",
                    background: "#fff", color: "#7a95b0", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
                  }}>← All</button>
                )}
                <button onClick={() => setSynthQuiz(q => !q)} style={{
                  padding: "4px 12px", borderRadius: "20px", border: "none",
                  background: synthQuiz ? "#f97316" : "#f0f4f8",
                  color: synthQuiz ? "#fff" : "#7a95b0",
                  fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                }}>Quiz {synthQuiz ? "ON" : "OFF"}</button>
              </div>
            </div>
            {!selectedFrom ? (
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 28px" }}>
                <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "12px", lineHeight: 1.6 }}>
                  Select a starting material to view all synthesis routes — with reagents, conditions, and step-by-step mechanisms.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {allFroms.map(from => {
                    const count = boardRoutes.filter(r => r.from === from).length;
                    const isAro = aromaticFroms.has(from);
                    const accent = isAro ? "#7c3aed" : "#29ABE2";
                    const bg = isAro ? "#fdf4ff" : "#eaf6fd";
                    const borderCol = isAro ? "#e9d5ff" : "#bae3f9";
                    return (
                      <button key={from} onClick={() => { setSelectedFrom(from); setRevealedRoutes(new Set()); }} style={{
                        padding: "13px 12px", borderRadius: "14px", border: `2px solid ${borderCol}`,
                        background: bg, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.06)", transition: "all 0.15s"
                      }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent, marginBottom: "7px" }} />
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginBottom: "3px", lineHeight: 1.3 }}>{from}</div>
                        <div style={{ fontSize: "11px", color: accent, fontWeight: 600 }}>{count} route{count !== 1 ? "s" : ""} →</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px 28px" }}>
                {filteredRoutes.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#7a95b0", fontSize: "13px", marginTop: "32px" }}>
                    No routes for {selectedFrom} on this exam board.
                  </div>
                ) : filteredRoutes.map((route, idx) => {
                  const isOpen = revealedRoutes.has(idx);
                  const mc = getMC(route.mechanism);
                  return (
                    <div key={idx} style={{
                      background: "#fff", borderRadius: "16px", marginBottom: "12px",
                      border: "1.5px solid #e8edf2", overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
                    }}>
                      {/* Header */}
                      <div style={{ padding: "13px 14px 11px" }}>
                        <div style={{ marginBottom: "7px" }}>
                          <span style={{
                            fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px",
                            background: mc.bg, color: mc.text, border: `1px solid ${mc.border}`
                          }}>{route.mechanism}</span>
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#1a2d45", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ color: "#29ABE2" }}>{route.from}</span>
                          <span style={{ fontSize: "18px", color: "#c4cdd6", lineHeight: 1 }}>→</span>
                          <span>{route.to}</span>
                        </div>
                      </div>
                      {/* Reagents + Conditions */}
                      {synthQuiz ? (
                        <div style={{ margin: "0 14px 13px", padding: "12px 14px", background: "#fff7ed", borderRadius: "12px", textAlign: "center", color: "#ea580c", fontWeight: 600, fontSize: "12px" }}>
                          Quiz mode — try to recall the reagents and conditions before revealing
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "0 14px 12px" }}>
                          <div style={{ background: "#f0f7ff", borderRadius: "12px", padding: "10px 12px", borderLeft: "3px solid #29ABE2" }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Reagents</div>
                            <div style={{ fontSize: "12px", color: "#1a2d45", fontWeight: 600, lineHeight: 1.5 }}>{route.reagents}</div>
                          </div>
                          <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "10px 12px", borderLeft: "3px solid #16a34a" }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Conditions</div>
                            <div style={{ fontSize: "12px", color: "#1a2d45", fontWeight: 600, lineHeight: 1.5 }}>{route.conditions}</div>
                          </div>
                        </div>
                      )}
                      {/* Notes */}
                      {route.notes && !synthQuiz && (
                        <div style={{ margin: "0 14px 12px", padding: "10px 12px", background: "#fafbfc", borderRadius: "10px", borderLeft: "3px solid #e0e8f0" }}>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Key notes</div>
                          <div style={{ fontSize: "11px", color: "#4a6070", lineHeight: 1.6 }}>{route.notes}</div>
                        </div>
                      )}
                      {/* Steps toggle */}
                      {route.steps && route.steps.length > 0 && (
                        <button onClick={() => setRevealedRoutes(prev => {
                          const next = new Set(prev);
                          if (next.has(idx)) next.delete(idx); else next.add(idx);
                          return next;
                        })} style={{
                          width: "100%", padding: "10px 14px", border: "none", borderTop: "1px solid #e8edf2",
                          background: isOpen ? "#eaf6fd" : "#f8fafc", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          fontFamily: "inherit", color: "#29ABE2", fontSize: "12px", fontWeight: 700
                        }}>
                          <span>Step-by-step mechanism</span>
                          <span style={{ fontSize: "13px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                        </button>
                      )}
                      {/* Steps expanded */}
                      {isOpen && route.steps && (
                        <div style={{ padding: "12px 14px 16px", background: "#f8fafc" }}>
                          {route.steps.map((step, si) => (
                            <div key={si} style={{ marginBottom: si < route.steps.length - 1 ? "16px" : "0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#29ABE2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(41,171,226,0.3)" }}>
                                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#fff" }}>{si + 1}</span>
                                </div>
                                <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2d45" }}>{step.stage}</div>
                              </div>
                              {step.equation && (
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1a2d45", background: "#fff", borderRadius: "10px", padding: "9px 12px", margin: "4px 0 6px 30px", border: "1px solid #e8edf2", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                                  {step.equation}
                                  {step.arrow && <span style={{ color: "#29ABE2", fontWeight: 700 }}>{" "}{step.arrow}</span>}
                                </div>
                              )}
                              {step.note && (
                                <div style={{ fontSize: "11px", color: "#4a6070", lineHeight: 1.6, paddingLeft: "30px" }}>{step.note}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
      {topicsTab === "pathways" && (() => {
        const sNodes = synthTab === "ali" ? SYNTH_ALI_NODES : SYNTH_ARO_NODES;
        const sRxns  = synthTab === "ali" ? SYNTH_ALI_RXNS  : SYNTH_ARO_RXNS;
        const vbW = 480, vbH = synthTab === "ali" ? 590 : 490;
        const SW = 0.76; // scale nodes down so they don't dominate the map
        const nodeMap = Object.fromEntries(sNodes.map(n => [n[0], n]));
        const edgePt = (fcx, fcy, fhw, fhh, tcx, tcy) => {
          const dx = tcx - fcx, dy = tcy - fcy;
          const adx = Math.abs(dx), ady = Math.abs(dy);
          if (!adx && !ady) return [fcx, fcy];
          let t;
          if (!adx) t = (fhh + 4) / ady;
          else if (!ady) t = (fhw + 4) / adx;
          else t = (adx * fhh >= ady * fhw) ? (fhw + 4) / adx : (fhh + 4) / ady;
          return [fcx + dx * t, fcy + dy * t];
        };
        const selId = selectedFrom;
        const connRxnIds = selId ? new Set(sRxns.filter(r => r[1] === selId || r[2] === selId).map(r => r[0])) : null;
        const connNodeIds = selId ? new Set(sRxns.filter(r => r[1] === selId || r[2] === selId).flatMap(r => [r[1], r[2]])) : null;
        const selNodeData = selId ? sNodes.find(n => n[0] === selId) : null;
        const outRxns = selId ? sRxns.filter(r => r[1] === selId) : [];
        const inRxns  = selId ? sRxns.filter(r => r[2] === selId) : [];
        const selRxn  = selectedRxn ? sRxns.find(r => r[0] === selectedRxn) : null;
        // unused adjacency map stub kept for lint safety
        const outMap = {};
        const inMap = {};
        sNodes.forEach(([id]) => { outMap[id] = []; inMap[id] = []; });
        sRxns.forEach(r => {
          if (outMap[r[1]]) outMap[r[1]].push(r);
          if (inMap[r[2]])  inMap[r[2]].push(r);
        });
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Sub-tabs + quiz */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e8f0", padding: "0 12px", background: "#fff", flexShrink: 0 }}>
              {[["ali","Aliphatic","27"],["aro","Aromatic","9"]].map(([id,lbl,cnt]) => (
                <button key={id} onClick={() => { setSynthTab(id); setSelectedFrom(null); setSelectedRxn(null); }} style={{
                  padding:"11px 13px", border:"none", background:"none", fontFamily:"inherit",
                  fontSize:"13px", fontWeight:700, cursor:"pointer",
                  color: synthTab===id ? "#059669" : "#7a95b0",
                  borderBottom: synthTab===id ? "3px solid #059669" : "3px solid transparent",
                  marginBottom:"-2px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"6px"
                }}>
                  {lbl}
                  <span style={{ fontSize:"10px", fontWeight:700, background:synthTab===id?"#dcfce7":"#f0f4f8", color:synthTab===id?"#059669":"#94a3b8", padding:"1px 6px", borderRadius:"10px" }}>{cnt}</span>
                </button>
              ))}
              <div style={{ flex:1 }} />
              <button onClick={() => setSynthQuiz(q => !q)} style={{
                padding:"5px 12px", borderRadius:"20px", border:"none",
                background:synthQuiz?"#f97316":"#f0f4f8", color:synthQuiz?"#fff":"#7a95b0",
                fontSize:"11px", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>Quiz {synthQuiz?"ON":"OFF"}</button>
            </div>
            {/* Hint bar */}
            <div style={{ fontSize:"11px", color:"#94a3b8", padding:"4px 0 3px", textAlign:"center", flexShrink:0, background:"#fff", borderBottom:"1px solid #f0f4f8" }}>
              {selId ? `${selNodeData ? selNodeData[1].replace(/\n/g," ") : ""} — tap another node or clear` : "Scroll to explore · tap a compound to highlight its routes"}
            </div>
            {/* SVG map — scrollable */}
            <div style={{ flex:1, overflow:"auto", WebkitOverflowScrolling:"touch", background:"#f0f4f8" }}>
              <svg
                viewBox={`0 0 ${vbW} ${vbH}`}
                width={vbW + 16} height={vbH + 16}
                style={{ display:"block", margin:"8px" }}
                onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }}
              >
                <defs>
                  <marker id="mn" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5z" fill="#b0bec5" />
                  </marker>
                  <marker id="mo" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5z" fill="#059669" />
                  </marker>
                  <marker id="mi" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5z" fill="#2563eb" />
                  </marker>
                </defs>
                <rect x={0} y={0} width={vbW} height={vbH} fill="#f0f4f8" />
                {/* Group zone backgrounds — aliphatic only */}
                {synthTab === "ali" && (<>
                  {/* Ammonium Salts row */}
                  <rect x={8} y={14} rx={7} width={175} height={48} fill="rgba(79,70,229,0.07)" stroke="rgba(79,70,229,0.18)" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={16} y={25} fontSize="7" fontWeight="700" fill="rgba(79,70,229,0.45)" style={{ userSelect:"none", pointerEvents:"none" }} letterSpacing="0.4">AMMONIUM SALTS</text>
                  {/* Amine family (right column) */}
                  <rect x={305} y={14} rx={7} width={168} height={204} fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.16)" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={313} y={25} fontSize="7" fontWeight="700" fill="rgba(124,58,237,0.45)" style={{ userSelect:"none", pointerEvents:"none" }} letterSpacing="0.4">AMINE FAMILY</text>
                  {/* Carbonyl compounds cluster */}
                  <rect x={128} y={346} rx={7} width={180} height={132} fill="rgba(162,28,175,0.05)" stroke="rgba(162,28,175,0.14)" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={136} y={357} fontSize="7" fontWeight="700" fill="rgba(162,28,175,0.4)" style={{ userSelect:"none", pointerEvents:"none" }} letterSpacing="0.4">CARBONYL COMPOUNDS</text>
                  {/* Acid derivatives row */}
                  <rect x={10} y={512} rx={7} width={455} height={66} fill="rgba(3,105,144,0.06)" stroke="rgba(3,105,144,0.16)" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={18} y={523} fontSize="7" fontWeight="700" fill="rgba(3,105,144,0.45)" style={{ userSelect:"none", pointerEvents:"none" }} letterSpacing="0.4">ACID DERIVATIVES</text>
                </>)}
                {/* Edges */}
                {sRxns.map(r => {
                  const [n, fromId, toId] = r;
                  const fN = nodeMap[fromId], tN = nodeMap[toId];
                  if (!fN || !tN) return null;
                  const frw = fN[5]*SW, frh = fN[6]*SW, trw = tN[5]*SW, trh = tN[6]*SW;
                  const [x1,y1] = edgePt(fN[2],fN[3],frw,frh,tN[2],tN[3]);
                  const [x2,y2] = edgePt(tN[2],tN[3],trw,trh,fN[2],fN[3]);
                  const isOut = selId && fromId === selId;
                  const isIn  = selId && toId   === selId;
                  const isDim = connRxnIds && !connRxnIds.has(n);
                  return (
                    <line key={"e"+n} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isOut ? "#059669" : isIn ? "#2563eb" : selId ? "#c5ced8" : "#b8c5d0"}
                      strokeWidth={isOut||isIn ? 2.2 : selId ? 1 : 0.9}
                      opacity={isDim ? 0.12 : 1}
                      markerEnd={isOut ? "url(#mo)" : isIn ? "url(#mi)" : "url(#mn)"}
                    />
                  );
                })}
                {/* Nodes — tappable */}
                {sNodes.map(([id, label, cx, cy, fill, hw, hh]) => {
                  const rw = hw*SW, rh = hh*SW;
                  const lines = label.split("\n");
                  const lh = 9.5, th = lines.length * lh;
                  const isSel = id === selId;
                  const isDim = connNodeIds && !connNodeIds.has(id);
                  return (
                    <g key={id} onClick={e => { e.stopPropagation(); setSelectedFrom(id === selId ? null : id); setSelectedRxn(null); }} style={{ cursor:"pointer" }}>
                      {isSel && <rect x={cx-rw-4} y={cy-rh-4} width={(rw+4)*2} height={(rh+4)*2} rx={10} fill="rgba(5,150,105,0.18)" stroke="#059669" strokeWidth={2.5} />}
                      <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                        rx={6} fill={fill} opacity={isDim ? 0.18 : 1}
                        stroke={isSel ? "#fff" : "rgba(255,255,255,0.22)"} strokeWidth={isSel ? 1.5 : 1}
                      />
                      {lines.map((ln,li) => (
                        <text key={li} x={cx} y={cy - th/2 + li*lh + lh*0.88}
                          textAnchor="middle" fontSize="8" fontWeight="700"
                          fill={isDim ? "rgba(255,255,255,0.25)" : "#fff"}
                          style={{ userSelect:"none", pointerEvents:"none" }}>{ln}</text>
                      ))}
                    </g>
                  );
                })}
                {/* Reaction number circles */}
                {sRxns.map(r => {
                  const [n,,,bx,by] = r;
                  const isAct = selectedRxn === n;
                  const isDim = connRxnIds && !connRxnIds.has(n);
                  return (
                    <g key={"b"+n} onClick={e => { e.stopPropagation(); setSelectedRxn(isAct ? null : n); }} style={{ cursor:"pointer" }}>
                      <circle cx={bx} cy={by} r={10} fill="transparent" />
                      <circle cx={bx} cy={by} r={7}
                        fill={isAct ? "#1a2d45" : "#fff"}
                        stroke={isDim ? "#d4dae0" : isAct ? "#1a2d45" : "#94a3b8"}
                        strokeWidth={1.5} opacity={isDim ? 0.25 : 1}
                      />
                      <text x={bx} y={by+0.5} textAnchor="middle" dominantBaseline="middle"
                        fontSize="7" fontWeight="800"
                        fill={isAct ? "#fff" : isDim ? "#aaa" : "#374151"}
                        opacity={isDim ? 0.25 : 1}
                        style={{ userSelect:"none", pointerEvents:"none" }}>{n}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Bottom panel: compound connections */}
            {selId && !selRxn && (
              <div style={{ background:"#fff", borderTop:"2px solid #e8edf2", padding:"12px 14px 20px", maxHeight:"38vh", overflowY:"auto", flexShrink:0, boxShadow:"0 -4px 20px rgba(0,0,0,0.1)" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"4px", height:"22px", borderRadius:"2px", background: selNodeData ? selNodeData[4] : "#059669" }} />
                    <div style={{ fontSize:"14px", fontWeight:800, color:"#1a2d45" }}>{selNodeData ? selNodeData[1].replace(/\n/g," ") : ""}</div>
                  </div>
                  <button onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }} style={{
                    background:"#f0f4f8", border:"none", borderRadius:"8px", padding:"5px 10px",
                    fontSize:"11px", color:"#7a95b0", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>✕</button>
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  {outRxns.length > 0 && (
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"10px", fontWeight:700, color:"#059669", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"7px" }}>→ Makes ({outRxns.length})</div>
                      {outRxns.map(r => (
                        <button key={r[0]} onClick={() => setSelectedRxn(r[0])} style={{
                          width:"100%", textAlign:"left", padding:"7px 9px", borderRadius:"10px", marginBottom:"5px",
                          border:"1.5px solid #e8edf2", background:"#fafcff", cursor:"pointer", fontFamily:"inherit",
                          display:"flex", alignItems:"center", gap:"7px"
                        }}>
                          <span style={{ width:"18px", height:"18px", borderRadius:"50%", background:"#dcfce7", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:800, color:"#059669", flexShrink:0 }}>{r[0]}</span>
                          <span style={{ fontSize:"11px", fontWeight:600, color:"#1a2d45", lineHeight:1.3 }}>{r[6]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {inRxns.length > 0 && (
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"10px", fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"7px" }}>← From ({inRxns.length})</div>
                      {inRxns.map(r => (
                        <button key={r[0]} onClick={() => setSelectedRxn(r[0])} style={{
                          width:"100%", textAlign:"left", padding:"7px 9px", borderRadius:"10px", marginBottom:"5px",
                          border:"1.5px solid #e8edf2", background:"#fafcff", cursor:"pointer", fontFamily:"inherit",
                          display:"flex", alignItems:"center", gap:"7px"
                        }}>
                          <span style={{ width:"18px", height:"18px", borderRadius:"50%", background:"#dbeafe", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:800, color:"#2563eb", flexShrink:0 }}>{r[0]}</span>
                          <span style={{ fontSize:"11px", fontWeight:600, color:"#1a2d45", lineHeight:1.3 }}>{r[5]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Bottom panel: reaction detail */}
            {selRxn && (
              <div style={{ background:"#fff", borderTop:"3px solid #1a2d45", padding:"13px 14px 22px", flexShrink:0, boxShadow:"0 -4px 20px rgba(0,0,0,0.1)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"10px" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"5px" }}>
                      <span style={{ fontSize:"11px", fontWeight:700, color:"#059669", background:"#dcfce7", padding:"2px 8px", borderRadius:"20px" }}>{selRxn[10]}</span>
                      {selRxn[9] !== "--" && <span style={{ fontSize:"11px", fontWeight:700, color:"#29ABE2", background:"#eaf6fd", padding:"2px 8px", borderRadius:"20px" }}>{selRxn[9]}</span>}
                    </div>
                    <div style={{ fontSize:"14px", fontWeight:800, color:"#1a2d45" }}>
                      {selRxn[5]} <span style={{ color:"#94a3b8" }}>→</span> {selRxn[6]}
                    </div>
                  </div>
                  <button onClick={() => setSelectedRxn(null)} style={{ background:"#f0f4f8", border:"none", borderRadius:"8px", width:"30px", height:"30px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#7a95b0", flexShrink:0, marginLeft:"8px", fontSize:"15px" }}>✕</button>
                </div>
                {synthQuiz ? (
                  <div style={{ padding:"11px 14px", background:"#fff7ed", borderRadius:"10px", textAlign:"center", color:"#ea580c", fontWeight:600, fontSize:"12px" }}>
                    Quiz mode — tap "Quiz OFF" to reveal
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    <div style={{ background:"#f0f7ff", borderRadius:"10px", padding:"9px 12px", borderLeft:"3px solid #29ABE2" }}>
                      <div style={{ fontSize:"10px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"3px" }}>Reagents</div>
                      <div style={{ fontSize:"12px", color:"#1a2d45", fontWeight:600, lineHeight:1.4 }}>{selRxn[7]}</div>
                    </div>
                    <div style={{ background:"#f0fdf4", borderRadius:"10px", padding:"9px 12px", borderLeft:"3px solid #16a34a" }}>
                      <div style={{ fontSize:"10px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"3px" }}>Conditions</div>
                      <div style={{ fontSize:"12px", color:"#1a2d45", fontWeight:600, lineHeight:1.4 }}>{selRxn[8]}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}
      {topicsTab === "extended" && (() => {
        const purple = "#7c3aed";
        const purpleLight = "#f3f0ff";
        const purpleMid = "#ede9fe";
        const filteredQs = EXTENDED_QUESTIONS.filter(q => q.board === "both" || q.board === board);
        const categories = [...new Set(filteredQs.map(q => q.category))];

        // Category picker
        if (!extCategory) return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "6px", lineHeight: 1.5, fontWeight: 600 }}>6-Mark Extended Responses</p>
            <p style={{ color: "#7a95b0", fontSize: "12px", marginBottom: "16px", lineHeight: 1.5 }}>
              Read the question, think through your answer, then reveal the mark scheme. Tick each point you covered to track your score.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {categories.map(cat => {
                const qs = filteredQs.filter(q => q.category === cat);
                const scores = qs.map(q => extScore[q.id]).filter(Boolean);
                const totalMarks = qs.length * 6;
                const earnedMarks = scores.reduce((a, b) => a + b, 0);
                return (
                  <button key={cat} onClick={() => { setExtCategory(cat); setExtIndex(0); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); }}
                    style={{ background: "#fff", border: `2px solid ${purpleLight}`, borderRadius: "14px", padding: "14px 12px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: purple, marginBottom: "8px" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3, marginBottom: "4px" }}>{cat}</div>
                    <div style={{ fontSize: "11px", color: purple, fontWeight: 600 }}>{qs.length} question{qs.length > 1 ? "s" : ""} · 6 marks each</div>
                    {scores.length > 0 && <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{earnedMarks}/{scores.length * 6} marks scored</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );

        // Question view
        const catQs = filteredQs.filter(q => q.category === extCategory);
        const q = catQs[extIndex];
        if (!q) return null;
        const isLast = extIndex === catQs.length - 1;
        const marksThisQ = extMarked.size;

        const canSubmit = extDraft.trim().length >= 20;
        const handleSubmit = async () => {
          setExtAiLoading(true);
          setExtAiError(null);
          try {
            const res = await fetch('/api/examine', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: q.question, markScheme: q.markScheme, studentAnswer: extDraft, maxMarks: q.marks }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server error');
            setExtAiResult(data);
            const covered = new Set((data.coveredPoints || []).map((c, i) => c ? i : -1).filter(i => i >= 0));
            setExtMarked(covered);
            setExtScore(s => ({ ...s, [q.id]: data.score }));
            setExtRevealed(true);
          } catch (err) {
            setExtAiError(err.message || 'Could not reach AI Examiner');
          } finally {
            setExtAiLoading(false);
          }
        };
        const toggleMark = (i) => {
          setExtMarked(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i); else next.add(i);
            // save score
            setExtScore(s => ({ ...s, [q.id]: next.size }));
            return next;
          });
        };
        const resetExt = () => {
          setExtRevealed(false);
          setExtMarked(new Set());
          setExtDraft("");
          setExtAiResult(null);
          setExtAiLoading(false);
          setExtShowModel(false);
          setExtAiError(null);
        };
        const goNext = () => { setExtIndex(i => i + 1); resetExt(); };

        const scoreColour = marksThisQ >= q.marks * 0.75 ? "#16a34a" : marksThisQ >= q.marks * 0.5 ? "#d97706" : "#dc2626";

        return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <button onClick={() => setExtCategory(null)} style={{ background: "none", border: "none", color: purple, fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>← Topics</button>
              <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{extCategory} · {extIndex + 1} / {catQs.length}</div>
            </div>
            {/* Progress bar */}
            <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "16px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((extIndex + 1) / catQs.length) * 100}%`, background: purple, borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
            {/* Question card */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "12px", border: `1px solid ${purpleMid}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", background: purpleLight, padding: "3px 8px", borderRadius: "6px" }}>{q.category}</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", background: "#f0f4f8", padding: "3px 8px", borderRadius: "6px" }}>{q.marks} marks</div>
              </div>
              <div style={{ fontSize: "14px", color: "#1a2d45", lineHeight: 1.7, fontWeight: 500, whiteSpace: "pre-line" }}>{q.question}</div>
            </div>
            {/* Answer box — required */}
            {!extRevealed && !extAiLoading && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45", textTransform: "uppercase", letterSpacing: "1px" }}>Your Answer <span style={{ color: "#dc2626" }}>*</span></div>
                  <div style={{ fontSize: "11px", color: canSubmit ? "#16a34a" : "#7a95b0", fontWeight: 600 }}>{canSubmit ? "Ready to submit" : `${Math.max(0, 20 - extDraft.trim().length)} chars to unlock`}</div>
                </div>
                <textarea
                  value={extDraft}
                  onChange={e => setExtDraft(e.target.value)}
                  placeholder={`Write your full answer to this ${q.marks}-mark question here. Cover every point you know — the AI Examiner will mark it against the mark scheme.`}
                  rows={7}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: `2px solid ${canSubmit ? "#7c3aed" : "#d0dce8"}`, fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#1a2d45", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s" }}
                />
              </div>
            )}
            {/* Submit to AI Examiner */}
            {!extRevealed && !extAiLoading && (
              <button onClick={handleSubmit} disabled={!canSubmit} style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: canSubmit ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e0e8f0",
                color: canSubmit ? "#fff" : "#9ca3af",
                fontSize: "15px", fontWeight: 800, cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "inherit", boxShadow: canSubmit ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}>
                <span>🤖</span> Submit to AI Examiner
              </button>
            )}
            {/* Error state */}
            {extAiError && !extAiLoading && (
              <div style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: "14px", padding: "16px 18px", marginTop: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#be123c", marginBottom: "6px" }}>⚠️ AI Examiner unavailable</div>
                <div style={{ fontSize: "12px", color: "#9f1239", lineHeight: 1.6, marginBottom: "12px" }}>
                  {extAiError === 'API key not configured'
                    ? 'The API key hasn\'t been added to Vercel yet. Add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables, then redeploy.'
                    : `Something went wrong: ${extAiError}. Check your internet connection and try again.`}
                </div>
                <button onClick={handleSubmit} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "#be123c", color: "#fff", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  Try Again
                </button>
              </div>
            )}
            {/* Loading state */}
            {extAiLoading && (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px", animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45", marginBottom: "4px" }}>AI Examiner is reading your answer...</div>
                <div style={{ fontSize: "12px", color: "#7a95b0" }}>Marking against the mark scheme</div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {/* AI Results */}
            {extRevealed && (
              <div>
                {/* Your answer reminder */}
                {extDraft.trim() && (
                  <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "12px 14px", marginBottom: "12px", border: "1px solid #e0e8f0" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Your Answer</div>
                    <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{extDraft}</div>
                  </div>
                )}
                {/* AI score & feedback */}
                {extAiResult && (
                  <>
                    <div style={{ background: "linear-gradient(135deg,#1a2d45,#7c3aed)", borderRadius: "16px", padding: "18px", marginBottom: "12px", color: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8, letterSpacing: "1px", textTransform: "uppercase" }}>🤖 AI Examiner</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                          <span style={{ fontSize: "32px", fontWeight: 900, color: scoreColour === "#16a34a" ? "#86efac" : scoreColour === "#d97706" ? "#fcd34d" : "#fca5a5" }}>{marksThisQ}</span>
                          <span style={{ fontSize: "16px", opacity: 0.7 }}>/ {q.marks}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.95 }}>{extAiResult.feedback}</div>
                    </div>
                    {/* Covered / missed points */}
                    <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Mark Scheme — tap to adjust</div>
                      {q.markScheme.map((point, i) => {
                        const ticked = extMarked.has(i);
                        const aiSaid = extAiResult.coveredPoints[i];
                        return (
                          <button key={i} onClick={() => toggleMark(i)}
                            style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? "#f0fdf4" : "#fff8f8", border: `1.5px solid ${ticked ? "#16a34a" : "#fecaca"}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                            <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${ticked ? "#16a34a" : "#f87171"}`, background: ticked ? "#16a34a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all 0.15s" }}>
                              {ticked ? <span style={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}>✓</span> : <span style={{ color: "#f87171", fontSize: "13px", fontWeight: 900 }}>✗</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "13px", color: ticked ? "#15803d" : "#7f1d1d", lineHeight: 1.5, fontWeight: ticked ? 600 : 400 }}>{point}</div>
                              {aiSaid !== ticked && <div style={{ fontSize: "10px", color: "#7a95b0", marginTop: "3px" }}>AI said: {aiSaid ? "covered ✓" : "missed ✗"} — tap to override</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {/* Model answer toggle */}
                    <button onClick={() => setExtShowModel(v => !v)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #e9d5ff", background: extShowModel ? "#f3f0ff" : "#faf5ff", color: purple, fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>📝 Show Model Answer</span>
                      <span style={{ transform: extShowModel ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                    </button>
                    {extShowModel && (
                      <div style={{ background: "#f3f0ff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #ddd6fe", marginBottom: "12px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Model Answer</div>
                        <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.7 }}>{extAiResult.modelAnswer}</div>
                      </div>
                    )}
                  </>
                )}
                {/* No AI result — fallback manual mark scheme */}
                {!extAiResult && (
                  <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Mark Scheme — tick each point you covered</div>
                    {q.markScheme.map((point, i) => {
                      const ticked = extMarked.has(i);
                      return (
                        <button key={i} onClick={() => toggleMark(i)}
                          style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? "#f0fdf4" : "transparent", border: `1px solid ${ticked ? "#16a34a" : "#e8eef4"}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                          <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${ticked ? "#16a34a" : "#c8d6e4"}`, background: ticked ? "#16a34a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all 0.15s" }}>
                            {ticked && <span style={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}>✓</span>}
                          </div>
                          <div style={{ fontSize: "13px", color: ticked ? "#15803d" : "#1a2d45", lineHeight: 1.6, fontWeight: ticked ? 600 : 400 }}>{point}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Examiner tip */}
                <div style={{ background: "#fffbeb", borderRadius: "12px", padding: "14px 16px", border: "1px solid #fde68a", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Examiner Tip</div>
                  <div style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.65 }}>{q.examTip}</div>
                </div>
                {/* Navigation */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {!isLast ? (
                    <button onClick={goNext} style={{ flex: 1, padding: "13px", background: purple, border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Next Question →
                    </button>
                  ) : (
                    <button onClick={() => { setExtCategory(null); setExtIndex(0); resetExt(); }}
                      style={{ flex: 1, padding: "13px", background: "#1a2d45", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Finish — Back to Topics
                    </button>
                  )}
                  <button onClick={resetExt} style={{ padding: "13px 16px", background: "#f0f4f8", border: "none", borderRadius: "12px", color: "#4a6080", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {topicsTab === "calc" && (
        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
          {!calcTopic && (
            <div>
              <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "16px", lineHeight: 1.5 }}>
                Practise exam-style calculation questions with full worked solutions.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {CALC_SETS.map(set => {
                  const score = calcScore[set.id] || { correct: 0, attempted: 0 };
                  return (
                    <button key={set.id} onClick={() => { setCalcTopic(set.id); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); }} style={{
                      background: "#ffffff", border: `2px solid ${set.color}30`,
                      borderRadius: "14px", padding: "14px 12px", textAlign: "left",
                      cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: set.color, marginBottom: "8px" }} />
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3, marginBottom: "4px" }}>{set.title}</div>
                      <div style={{ fontSize: "11px", color: set.color, fontWeight: 600 }}>{set.questions.length} questions</div>
                      {score.attempted > 0 && (
                        <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{score.correct}/{score.attempted} correct</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {calcTopic && (() => {
            const set = CALC_SETS.find(s => s.id === calcTopic);
            if (!set) return null;
            const q = set.questions[calcIndex];
            const isLast = calcIndex === set.questions.length - 1;
            const checkAnswer = () => {
              if (!calcChecked) {
                const correct = q.isText
                  ? calcInput.trim().toUpperCase().replace(/\s/g,"") === String(q.answer).toUpperCase().replace(/\s/g,"")
                  : Math.abs(parseFloat(calcInput) - q.answer) <= q.tolerance;
                setCalcScore(prev => {
                  const s = prev[calcTopic] || { correct: 0, attempted: 0 };
                  return { ...prev, [calcTopic]: { correct: s.correct + (correct ? 1 : 0), attempted: s.attempted + 1 } };
                });
              }
              setCalcChecked(true);
              setCalcShowSteps(true);
            };
            const isCorrect = calcChecked && (q.isText
              ? calcInput.trim().toUpperCase().replace(/\s/g,"") === String(q.answer).toUpperCase().replace(/\s/g,"")
              : Math.abs(parseFloat(calcInput) - q.answer) <= q.tolerance);
            return (
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <button onClick={() => setCalcTopic(null)} style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>← Topics</button>
                  <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{set.title} · {calcIndex + 1} / {set.questions.length}</div>
                </div>
                {/* Progress bar */}
                <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "16px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${((calcIndex + 1) / set.questions.length) * 100}%`, background: set.color, borderRadius: "2px", transition: "width 0.3s" }} />
                </div>
                {/* Question card */}
                <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "12px", border: "1px solid #e8eef4" }}>
                  <div style={{ fontSize: "14px", color: "#1a2d45", lineHeight: 1.6, fontWeight: 500, whiteSpace: "pre-line" }}>{q.q}</div>
                </div>
                {/* Hint */}
                {!calcChecked && (
                  <details style={{ marginBottom: "12px" }}>
                    <summary style={{ fontSize: "13px", color: "#29ABE2", fontWeight: 600, cursor: "pointer", userSelect: "none" }}>Show hint</summary>
                    <div style={{ background: "#eaf6fd", borderRadius: "8px", padding: "10px 12px", marginTop: "6px", fontSize: "13px", color: "#1a2d45", lineHeight: 1.5 }}>{q.hint}</div>
                  </details>
                )}
                {/* Input */}
                {!calcChecked && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type={q.isText ? "text" : "number"}
                      value={calcInput}
                      onChange={e => setCalcInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && calcInput && checkAnswer()}
                      placeholder={q.isText ? "e.g. C2H4" : "Enter your answer"}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "2px solid #d0dce8", fontSize: "15px", fontFamily: "inherit", outline: "none", color: "#1a2d45" }}
                    />
                    {q.unit && <div style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "#7a95b0", fontWeight: 600, whiteSpace: "nowrap" }}>{q.unit}</div>}
                  </div>
                )}
                {!calcChecked && (
                  <button onClick={checkAnswer} disabled={!calcInput} style={{ width: "100%", padding: "13px", background: calcInput ? "#29ABE2" : "#e0e8f0", border: "none", borderRadius: "12px", color: calcInput ? "#ffffff" : "#9ca3af", fontSize: "15px", fontWeight: 700, cursor: calcInput ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                    Check Answer
                  </button>
                )}
                {/* Result */}
                {calcChecked && (
                  <div>
                    <div style={{ borderRadius: "12px", padding: "14px 16px", marginBottom: "12px", background: isCorrect ? "#dcfce7" : "#fee2e2", border: `2px solid ${isCorrect ? "#16a34a" : "#dc2626"}` }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: isCorrect ? "#15803d" : "#dc2626", marginBottom: "4px" }}>{isCorrect ? "Correct!" : "Not quite"}</div>
                      {!isCorrect && <div style={{ fontSize: "13px", color: "#1a2d45" }}>Answer: <strong>{q.answer} {q.unit}</strong></div>}
                    </div>
                    {/* Worked solution */}
                    <div style={{ background: "#ffffff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #e8eef4", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#29ABE2", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Worked Solution</div>
                      {q.steps.map((step, si) => (
                        <div key={si} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#29ABE2", background: "#eaf6fd", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{si + 1}</div>
                          <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.5, fontFamily: step.includes("=") || step.includes("÷") || step.includes("×") ? "'Space Mono', monospace" : "inherit" }}>{step}</div>
                        </div>
                      ))}
                    </div>
                    {/* Navigation */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!isLast ? (
                        <button onClick={() => { setCalcIndex(i => i + 1); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); }} style={{ flex: 1, padding: "13px", background: "#29ABE2", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Next Question →
                        </button>
                      ) : (
                        <button onClick={() => { setCalcTopic(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ flex: 1, padding: "13px", background: "#1a2d45", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Finish — Back to Topics
                        </button>
                      )}
                      <button onClick={() => { setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); }} style={{ padding: "13px 16px", background: "#f0f4f8", border: "none", borderRadius: "12px", color: "#4a6080", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Restart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── MECHANISMS TAB ────────────────────────────────── */}
      {topicsTab === "mechanisms" && (() => {
        const activeMech = mechId ? MECHS.find(m => m.id === mechId) : null;

        // ── List view ──
        if (!activeMech) return (
          <div style={{ padding:"16px", flex:1, overflowY:"auto" }}>
            <style>{`@keyframes mechDrawArrow{from{stroke-dashoffset:350}to{stroke-dashoffset:0}}`}</style>
            <p style={{ color:"#4a6080", fontSize:"14px", marginBottom:"16px", lineHeight:1.5 }}>
              Step-by-step animated curly-arrow mechanisms. Each arrow is explained. Tap a mechanism to start.
            </p>
            {Object.entries(
              MECHS.reduce((acc,m)=>{ (acc[m.category]=acc[m.category]||[]).push(m); return acc; }, {})
            ).map(([cat, list]) => (
              <div key={cat} style={{ marginBottom:"18px" }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px" }}>{cat}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {list.map(m => (
                    <button key={m.id} onClick={()=>{ setMechId(m.id); setMechStep(0); setMechAnimKey(k=>k+1); setMechStill(false); }}
                      style={{ background:"#ffffff", border:`2px solid ${m.color}30`, borderRadius:"14px",
                        padding:"14px 16px", textAlign:"left", cursor:"pointer", fontFamily:"inherit",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:m.color, flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:"14px", fontWeight:700, color:"#1a2d45", marginBottom:"2px" }}>{m.title}</div>
                          <div style={{ fontSize:"12px", color:"#64748b", fontFamily:"Georgia,serif" }}>{m.subtitle}</div>
                        </div>
                        <div style={{ marginLeft:"auto", display:"flex", gap:"4px" }}>
                          {m.specs.map(s=><span key={s} style={{ fontSize:"10px", fontWeight:700, background:`${m.color}20`, color:m.color, padding:"2px 6px", borderRadius:"6px" }}>{s.replace("_"," ")}</span>)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

        // ── Mechanism viewer ──
        const totalSteps = activeMech.steps.length;
        const currentStepData = activeMech.steps[mechStep];
        const arrowLabels = (currentStepData.arrows||[]).map(id => activeMech.arrowPaths[id]?.label).filter(Boolean);
        const isFirst = mechStep === 0;
        const isLast = mechStep === totalSteps - 1;

        const goNext = () => { setMechStep(s=>s+1); setMechAnimKey(k=>k+1); };
        const goPrev = () => { setMechStep(s=>Math.max(0,s-1)); setMechAnimKey(k=>k+1); };

        return (
          <div style={{ padding:"0", flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <style>{`@keyframes mechDrawArrow{from{stroke-dashoffset:350}to{stroke-dashoffset:0}}`}</style>

            {/* Header */}
            <div style={{ padding:"12px 16px 8px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #e8edf3" }}>
              <button onClick={()=>{ setMechId(null); setMechStep(0); }}
                style={{ background:"#f0f4f8", border:"1px solid #dde4ed", borderRadius:"8px", padding:"6px 12px",
                  color:"#29ABE2", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", fontWeight:600 }}>
                ← Back
              </button>
              <div>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#1a2d45" }}>{activeMech.title}</div>
                <div style={{ fontSize:"11px", color:"#64748b", fontFamily:"Georgia,serif" }}>{activeMech.subtitle}</div>
              </div>
            </div>

            {/* Overview banner */}
            <div style={{ margin:"12px 16px 0", padding:"12px 14px", background:`${activeMech.color}12`,
              borderLeft:`4px solid ${activeMech.color}`, borderRadius:"0 10px 10px 0", fontSize:"12px",
              color:"#1a2d45", lineHeight:1.6 }}>
              {activeMech.description}
            </div>

            {/* Toggle animated / still */}
            <div style={{ display:"flex", gap:"8px", padding:"10px 16px 4px" }}>
              {["animated","still"].map(mode => (
                <button key={mode} onClick={()=>setMechStill(mode==="still")}
                  style={{ padding:"6px 16px", borderRadius:"20px", border:"none", cursor:"pointer",
                    fontFamily:"inherit", fontSize:"12px", fontWeight:700,
                    background: (mechStill ? mode==="still" : mode==="animated") ? activeMech.color : "#f0f4f8",
                    color: (mechStill ? mode==="still" : mode==="animated") ? "#fff" : "#4a6080" }}>
                  {mode==="animated" ? "▶ Animated" : "📄 Still (Exam)"}
                </button>
              ))}
            </div>

            {!mechStill && <>
              {/* Step indicator */}
              <div style={{ padding:"8px 16px 4px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ fontSize:"12px", color:"#94a3b8", fontWeight:600 }}>
                  Step {mechStep + 1} of {totalSteps}
                </div>
                <div style={{ flex:1, height:"4px", background:"#e8edf3", borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${((mechStep+1)/totalSteps)*100}%`,
                    background:activeMech.color, borderRadius:"2px", transition:"width 0.3s ease" }}/>
                </div>
              </div>

              {/* Step title */}
              <div style={{ padding:"4px 16px 8px" }}>
                <div style={{ fontSize:"15px", fontWeight:700, color:"#1a2d45" }}>{currentStepData.title}</div>
              </div>

              {/* SVG diagram */}
              <div style={{ margin:"0 16px", background:"#f8fafc", border:"1.5px solid #e2e8f0",
                borderRadius:"16px", padding:"12px 8px", overflow:"hidden" }}>
                <MechSVG mech={activeMech} stepIdx={mechStep} animKey={mechAnimKey}/>
              </div>

              {/* Arrow legend for current step */}
              {arrowLabels.length > 0 && (
                <div style={{ margin:"10px 16px 0", display:"flex", flexDirection:"column", gap:"4px" }}>
                  {arrowLabels.map((lbl,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px" }}>
                      <div style={{ width:"28px", height:"2px", background:"#dc2626", borderRadius:"1px", flexShrink:0 }}/>
                      <span style={{ color:"#1a2d45", fontFamily:"Georgia,serif" }}>{lbl}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation */}
              <div style={{ margin:"10px 16px", padding:"14px", background:"#ffffff",
                border:"1.5px solid #e2e8f0", borderRadius:"14px" }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:activeMech.color, textTransform:"uppercase",
                  letterSpacing:"0.8px", marginBottom:"6px" }}>Why this arrow?</div>
                <p style={{ margin:0, fontSize:"13px", lineHeight:1.75, color:"#1a2d45" }}>
                  {currentStepData.explanation}
                </p>
              </div>

              {/* Prev / Next */}
              <div style={{ padding:"12px 16px 20px", display:"flex", gap:"10px" }}>
                <button onClick={goPrev} disabled={isFirst}
                  style={{ flex:1, padding:"13px", borderRadius:"12px", border:"none", cursor: isFirst?"default":"pointer",
                    background: isFirst?"#e8edf3":"#f0f4f8", color: isFirst?"#b0c4d4":"#4a6080",
                    fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
                  ← Previous
                </button>
                {!isLast ? (
                  <button onClick={goNext}
                    style={{ flex:2, padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer",
                      background:activeMech.color, color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit",
                      boxShadow:`0 4px 14px ${activeMech.color}50` }}>
                    Next Step →
                  </button>
                ) : (
                  <button onClick={()=>{ setMechId(null); setMechStep(0); }}
                    style={{ flex:2, padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer",
                      background:"#1a2d45", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
                    ✓ Done — Back to List
                  </button>
                )}
              </div>
            </>}

            {/* STILL / EXAM version */}
            {mechStill && (
              <div style={{ padding:"12px 16px 24px" }}>
                <div style={{ fontSize:"13px", color:"#64748b", marginBottom:"10px", lineHeight:1.6 }}>
                  Exam diagram: key curly arrows shown in red. All arrow labels listed below.
                </div>
                {/* Show key step arrows in red on correct molecule layout */}
                <div style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:"16px", padding:"12px 8px", overflow:"hidden" }}>
                  <MechSVGStill mech={activeMech}/>
                </div>
                {/* Step-by-step key */}
                <div style={{ marginTop:"14px", display:"flex", flexDirection:"column", gap:"10px" }}>
                  {activeMech.steps.filter(s=>(s.arrows||[]).length>0).map((s,i) => (
                    <div key={i} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:"12px", padding:"12px" }}>
                      <div style={{ fontSize:"12px", fontWeight:700, color:activeMech.color, marginBottom:"4px" }}>{s.title}</div>
                      {(s.arrows||[]).map(id => {
                        const ap = activeMech.arrowPaths[id];
                        return ap ? <div key={id} style={{ fontSize:"12px", color:"#1a2d45", lineHeight:1.6, display:"flex", gap:"6px", alignItems:"flex-start" }}>
                          <span style={{ color:"#dc2626", fontWeight:700, marginTop:"1px" }}>↷</span>
                          <span style={{ fontFamily:"Georgia,serif" }}>{ap.label}</span>
                        </div> : null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );

  // FLASHCARD VIEW
  const progress = ((index + 1) / order.length) * 100;
  return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
      <div style={{ padding: "12px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", borderBottom: "1px solid #dde4ed", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={goBack} style={{ background: "#f0f4f8", border: "1px solid #dde4ed", borderRadius: "8px", padding: "8px 12px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Topics</button>
          <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "15px", color: "#29ABE2" }}>HSJ TUITION</div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} style={{ background: "#f0f4f8", border: "1px solid #dde4ed", borderRadius: "8px", padding: "8px 12px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>⚙</button>
      </div>

      {showMenu && (
        <div style={{ position: "absolute", top: "56px", right: "20px", zIndex: 10, background: "#ffffff", border: "1px solid #dde4ed", borderRadius: "12px", padding: "8px", minWidth: "200px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          {[
            { label: shuffled ? "⟲ Reset order" : "🔀 Shuffle cards", action: shuffled ? reset : shuffle },
            { label: `Unknown only (${cards.length - knownCount})`, action: studyUnknown },
            { label: "✕ Clear progress", action: () => { setKnown(p => ({ ...p, [knownKey]: new Set() })); setShowMenu(false); } },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#1a2d45", fontSize: "13px", textAlign: "left", cursor: "pointer", borderRadius: "8px", fontFamily: "inherit" }}
              onMouseEnter={e => e.target.style.background = "#f0f4f8"}
              onMouseLeave={e => e.target.style.background = "none"}
            >{item.label}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "10px 20px 4px", position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 600, color: "#29ABE2" }}>{topic} · {SETS[topic]?.title}</h2>
        <div style={{ height: "5px", background: "#dde4ed", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #29ABE2, #50C8F4)", borderRadius: "3px", transition: "width 0.3s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#7a95b0" }}>
          <span>{index + 1} / {order.length}</span>
          <span style={{ color: "#29ABE2", fontWeight: knownCount > 0 ? 600 : 400 }}>{knownCount} mastered</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 24px", position: "relative", zIndex: 2 }}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>
        <div onClick={() => setFlipped(f => !f)} style={{ width: "100%", maxWidth: "700px", minHeight: "440px", perspective: "1200px", cursor: "pointer" }}>
          <div style={{ position: "relative", width: "100%", minHeight: "440px", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {/* Front */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(145deg, #29ABE2 0%, #1a8fc4 100%)", border: "none", borderRadius: "24px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 12px 40px rgba(41,171,226,0.35)" }}>
              <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "10px", color: "rgba(255,255,255,0.75)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Question</div>
              {knownSet.has(currentCardIndex) && <div style={{ position: "absolute", top: "13px", right: "18px", fontSize: "11px", color: "#ffffff", fontWeight: 600, background: "rgba(255,255,255,0.25)", padding: "3px 10px", borderRadius: "20px" }}>Mastered</div>}
              <p style={{ fontSize: card.q.length > 120 ? "16px" : card.q.length > 60 ? "18px" : "21px", lineHeight: 1.55, textAlign: "center", fontWeight: 700, color: "#ffffff", margin: 0 }}>{card.q}</p>
              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>Tap to reveal answer</div>
            </div>
            {/* Back */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#ffffff", border: "2px solid #29ABE2", borderRadius: "24px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 12px 40px rgba(41,171,226,0.2)" }}>
              <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "10px", color: "#29ABE2", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Answer</div>
              <div style={{ fontSize: card.a.length > 200 ? "13px" : card.a.length > 100 ? "15px" : "17px", lineHeight: 1.7, textAlign: "center", color: "#1a2d45", margin: 0, whiteSpace: "pre-line", fontWeight: 500 }}>{card.a}</div>
              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "#7a95b0", letterSpacing: "0.5px" }}>Tap to flip back</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 24px 20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 2 }}>
        <button onClick={prev} disabled={index === 0} style={{ width: "52px", height: "52px", borderRadius: "14px", background: index === 0 ? "#e8edf3" : "#ffffff", border: `1px solid ${index === 0 ? "#dde4ed" : "#29ABE2"}`, color: index === 0 ? "#b0c4d4" : "#29ABE2", fontSize: "20px", cursor: index === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: index === 0 ? "none" : "0 2px 8px rgba(41,171,226,0.15)" }}>←</button>
        <button onClick={toggleKnown} style={{ height: "52px", borderRadius: "14px", padding: "0 24px", background: knownSet.has(currentCardIndex) ? "#1a8fc4" : "#29ABE2", border: "none", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 12px rgba(41,171,226,0.25)" }}>
          {knownSet.has(currentCardIndex) ? "Mastered" : "Mark as Known"}
        </button>
        <button onClick={next} disabled={index === order.length - 1} style={{ width: "52px", height: "52px", borderRadius: "14px", background: index === order.length - 1 ? "#e8edf3" : "#ffffff", border: `1px solid ${index === order.length - 1 ? "#dde4ed" : "#29ABE2"}`, color: index === order.length - 1 ? "#b0c4d4" : "#29ABE2", fontSize: "20px", cursor: index === order.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: index === order.length - 1 ? "none" : "0 2px 8px rgba(41,171,226,0.15)" }}>→</button>
      </div>

      {knownCount === cards.length && (
        <div style={{ margin: "0 24px 16px", padding: "14px", borderRadius: "14px", background: "linear-gradient(135deg, #eaf6fd, #d0eefa)", border: "1px solid rgba(41,171,226,0.4)", textAlign: "center", fontSize: "14px", color: "#1a8fc4", fontWeight: 700 }}>
          🎉 All {cards.length} cards mastered!
        </div>
      )}
    </div>
  );
}