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
    {q:"Why does the melting point order S₈ > P₄ > Cl₂ > Ar hold for the simple molecular elements?", a:"All four are simple molecular with only Van der Waals forces between molecules. Larger molecules have more electrons and greater surface contact, giving stronger Van der Waals forces and higher melting points. S₈ (32 electrons per molecule) > P₄ (60 electrons per molecule — wait, actually S has more electrons per molecule due to molecular size) > Cl₂ > Ar(monatomic)."},
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
    {q:"Describe the physical appearance of the halogens at room temperature.", a:"F₂: pale yellow gas\nCl₂: yellow-green gas\nBr₂: red-brown liquid\nI₂: grey-black solid (purple vapour on heating)"},
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
    {q:"Describe the test for chloride, bromide, and iodide ions using silver nitrate and ammonia.", a:"Add AgNO₃(aq) acidified with dilute HNO₃:\nAgCl: white ppt; dissolves in dilute NH₃(aq).\nAgBr: cream ppt; does not dissolve in dilute NH₃ but dissolves in concentrated NH₃.\nAgI: yellow ppt; insoluble in both dilute and concentrated NH₃."},
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
    {q:"Describe chromium chemistry: common oxidation states, colours, and the Cr²⁺/Cr⁶⁺ interconversion.", a:"Cr²⁺: blue; Cr³⁺: green (in [Cr(H₂O)₆]³⁺ violet); CrO₄²⁻: yellow (alkaline); Cr₂O₇²⁻: orange (acidic).\nCr₂O₇²⁻ (orange) + OH⁻ → 2CrO₄²⁻ (yellow) — pH change\nCr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O — dichromate as oxidising agent"},
    {q:"Describe copper chemistry: common ions, colours, and complex reactions.", a:"Cu²⁺: blue in [Cu(H₂O)₆]²⁺.\nWith excess NH₃: [Cu(H₂O)₂(NH₃)₄]²⁺ — deep blue (ligand substitution).\nWith Cl⁻: [CuCl₄]²⁻ — yellow/green (change in coordination number, 6→4, and ligand).\nCu⁺: unstable in water (disproportionates to Cu and Cu²⁺); stable as CuCl (insoluble) or in complexes."},
    {q:"What is a stability constant (Kstab)?", a:"Kstab is the equilibrium constant for the formation of a complex ion from the metal ion and its ligands in aqueous solution. A large Kstab means the complex is very stable. E.g. [Fe(CN)₆]⁴⁻ has a much larger Kstab than [Fe(H₂O)₆]²⁺, indicating CN⁻ forms a much more stable complex."},
    {q:"Describe cis-trans and optical isomerism in transition metal complexes.", a:"Cis-trans isomerism (square planar, e.g. [Pt(NH₃)₂Cl₂]): cis = same-type ligands adjacent; trans = opposite.\nOptical isomerism in octahedral complexes with bidentate ligands (e.g. [Fe(en)₃]²⁺): two non-superimposable mirror images. Relevant for cis-platin (cis = anti-cancer active; trans = inactive)."},
    {q:"Explain how carbon monoxide poisoning involves haemoglobin.", a:"In haemoglobin, Fe²⁺ has a porphyrin ring as a multidentate ligand and O₂ as the reversible monodentate ligand. CO binds to Fe²⁺ much more strongly than O₂ (Kstab much larger), forming a stable complex that cannot carry O₂. This causes oxygen starvation (hypoxia)."},
    {q:"Describe iron chemistry: Fe²⁺ and Fe³⁺ colours, and their interconversion.", a:"Fe²⁺ [Fe(H₂O)₆]²⁺: pale green solution.\nFe³⁺ [Fe(H₂O)₆]³⁺: yellow/pale brown solution (often appears dark orange due to hydrolysis).\nFe²⁺ is a reducing agent (easily oxidised to Fe³⁺ in air).\nFe³⁺ is an oxidising agent (reduced back to Fe²⁺ by e.g. I⁻)."},
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
    {q:"Summarise key functional group interconversions in synthesis (AS level).", a:"Alkane → halogenoalkane: FRS with X₂/UV\nAlkene → halogenoalkane: add HX (Markovnikov)\nAlkene → dihaloalkane: add X₂\nAlkene → alcohol: H₂O/H₃PO₄ (direct hydration)\nHalogenoalkane → alcohol: NaOH(aq), warm\nHalogenoalkane → alkene: KOH(alc), heat (elimination)\nHalogenoalkane → nitrile: KCN/ethanol (chain +1C)\nHalogenoalkane → amine: excess NH₃/ethanol, sealed tube"},
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

  "RP4": { title: "Distillation of a Mixture", cards: [
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
    {q: "How does simple distillation differ from fractional distillation in terms of apparatus?", a: "Simple distillation uses no fractionating column — just a flask, condenser and receiver. Fractional distillation adds a fractionating column between flask and condenser for better separation."}
  ]},

  "RP5": { title: "Column Chromatography & TLC", cards: [
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
};

const SECTIONS = [
  { id: "physical_as", label: "Physical Chemistry (AS)", sub: "3.1 Year 1", topics: ["3.1.1","3.1.2","3.1.3","3.1.4","3.1.5","3.1.6","3.1.7"] },
  { id: "physical_a2", label: "Physical Chemistry (A2)", sub: "3.1 Year 2", topics: ["3.1.8","3.1.9","3.1.10","3.1.11","3.1.12"] },
  { id: "inorganic_as", label: "Inorganic Chemistry (AS)", sub: "3.2 Year 1", topics: ["3.2.1","3.2.2","3.2.3"] },
  { id: "inorganic_a2", label: "Inorganic Chemistry (A2)", sub: "3.2 Year 2", topics: ["3.2.4","3.2.5","3.2.6"] },
  { id: "organic", label: "Organic Chemistry", sub: "3.3", topics: ["3.3.1","3.3.2","3.3.3","3.3.4","3.3.5","3.3.6","3.3.7"] },
  { id: "organic2", label: "Organic Chemistry (A2)", sub: "3.3 (A2)", topics: ["3.3.9","3.3.10","3.3.11","3.3.12","3.3.13","3.3.14","3.3.15"] },
  { id: "practicals_as", label: "Required Practicals (AS)", sub: "RP Year 1", topics: ["RP1a","RP1b","RP2","RP3","RP4","RP5","RP6","RP7"] },
  { id: "practicals_a2", label: "Required Practicals (A2)", sub: "RP Year 2", topics: ["RP8","RP9","RP10a","RP10b","RP11","RP12"] },
];

const TOPIC_ORDER = SECTIONS.flatMap(s => s.topics);

export default function App() {
  const [screen, setScreen] = useState("board");
  const [board, setBoard] = useState(null);
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
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

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
        {[{ id: "aqa", label: "AQA", count: TOPIC_ORDER.length + " topics" }, { id: "ocr", label: "OCR A", count: "Coming soon" }].map(b => (
          <button key={b.id} onClick={() => b.id === "aqa" && selectBoard(b.id)} disabled={b.id !== "aqa"} style={{
            padding: "24px 20px", borderRadius: "16px",
            background: b.id === "aqa" ? "#ffffff" : "#f8f9fb",
            border: `1px solid ${b.id === "aqa" ? "#29ABE2" : "#dde4ed"}`,
            color: b.id === "aqa" ? "#1a2d45" : "#9ab0c4",
            cursor: b.id === "aqa" ? "pointer" : "default",
            textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
            boxShadow: b.id === "aqa" ? "0 4px 20px rgba(41,171,226,0.15)" : "none",
          }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>{b.label}</div>
            <div style={{ fontSize: "13px", color: b.id === "aqa" ? "#29ABE2" : "#b0c4d4", marginTop: "4px" }}>{b.count}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // DASHBOARD
  if (screen === "dashboard") {
    const allTopics = TOPIC_ORDER.map(id => {
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
            <StatCard label="Topics Started" value={started.length} sub={`of ${TOPIC_ORDER.length} total`} color="#29ABE2" />
            <StatCard label="Fully Mastered" value={allTopics.filter(t => t.pct === 100).length} sub="100% complete" color="#1a8fc4" />
            <StatCard label="Not Started" value={allTopics.filter(t => t.mastered === 0).length} sub="topics" color="#b0c4d4" />
          </div>

          {/* Section breakdown */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a95b0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>By Section</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SECTIONS.map(sec => {
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
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a95b0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>✅ Going Well</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {goingWell.map(t => <TopicRow key={t.id} t={t} showBar={false} />)}
              </div>
            </div>
          )}

          {totalMastered === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a95b0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📚</div>
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
    physical_as:   { accent: "#29ABE2", bg: "#eaf6fd", border: "#29ABE2", icon: "⚛️" },
    physical_a2:   { accent: "#0090cc", bg: "#e0f2fa", border: "#0090cc", icon: "⚛️" },
    inorganic_as:  { accent: "#16a97d", bg: "#e6f9f3", border: "#16a97d", icon: "🧪" },
    inorganic_a2:  { accent: "#0d8c68", bg: "#dcf5ed", border: "#0d8c68", icon: "🧪" },
    organic:       { accent: "#7c3aed", bg: "#f3eeff", border: "#7c3aed", icon: "🔗" },
    organic2:      { accent: "#6d28d9", bg: "#ede9ff", border: "#6d28d9", icon: "🔗" },
    practicals_as: { accent: "#d97706", bg: "#fef6e4", border: "#d97706", icon: "🔬" },
    practicals_a2: { accent: "#b45309", bg: "#fef0d0", border: "#b45309", icon: "🔬" },
  };

  if (screen === "topics" && activeSection) {
    const section = SECTIONS.find(s => s.id === activeSection);
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
                      {k > 0 && <span style={{ fontSize: "11px", color: "#29ABE2", fontWeight: 700 }}>{k} ✓</span>}
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
            <div style={{ fontSize: "10px", color: "#7a95b0", letterSpacing: "2px", textTransform: "uppercase" }}>AQA · A-Level Chemistry</div>
          </div>
        </div>
        <button onClick={() => setScreen("dashboard")} style={{ background: "#29ABE2", border: "none", borderRadius: "10px", padding: "9px 14px", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 2px 8px rgba(41,171,226,0.3)" }}>📊 My Progress</button>
      </div>
      <div style={{ padding: "8px 16px 24px", flex: 1, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
          {SECTIONS.map(section => {
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
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>{fc.icon}</div>
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
          {Object.values(SETS).reduce((a, s) => a + s.cards.length, 0)} cards · {TOPIC_ORDER.length} topics
        </div>
      </div>
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
            { label: `📚 Unknown only (${cards.length - knownCount})`, action: studyUnknown },
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
              {knownSet.has(currentCardIndex) && <div style={{ position: "absolute", top: "13px", right: "18px", fontSize: "11px", color: "#ffffff", fontWeight: 600, background: "rgba(255,255,255,0.25)", padding: "3px 10px", borderRadius: "20px" }}>✓ Mastered</div>}
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
          {knownSet.has(currentCardIndex) ? "✓ Mastered" : "Mark as known"}
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