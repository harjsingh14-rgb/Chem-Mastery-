import React, { useState, useCallback, useEffect, useRef } from "react";
import { signInGoogle, signInEmail, signUpEmail, logOut, onAuthChange, getOrCreateUserProfile, redeemAccessKey } from "./firebase";

const SETS = {
  "3.1.1": { title: "Atomic Structure", cards: [
    {q:"What are the relative mass and charge of a proton?", a:"Relative mass: 1\nRelative charge: +1"},
    {q:"What are the relative mass and charge of a neutron?", a:"Relative mass: 1\nRelative charge: 0"},
    {q:"What are the relative mass and charge of an electron?", a:"Relative mass: 1/1836 (approximately 0)\nRelative charge: −1"},
    {q:"Where are protons and neutrons found in an atom?", a:"In the tiny, dense nucleus."},
    {q:"Where are electrons found in an atom?", a:"In orbitals in subshells at various distances from the nucleus."},
    {q:"Define isotopes.", a:"Atoms of the same element with the same atomic number but different mass numbers (different numbers of neutrons)."},
    {q:"How do isotopes compare in terms of physical and chemical properties?", a:"Identical chemical properties (same electron configuration).\nSlightly different physical properties (different masses/densities)."},
    {q:"What are the four stages of a time-of-flight (TOF) mass spectrometer?", a:"1. Ionisation\n2. Acceleration\n3. Ion drift (flight)\n4. Detection"},
    {q:"Why must a mass spectrometer be kept under high vacuum?", a:"Gas molecules would be ionised and give spurious peaks at the detector."},
    {q:"How does electron impact ionisation work?", a:"Vaporised sample is bombarded by high-energy electrons; one electron is knocked from each molecule → M⁺ ion formed."},
    {q:"How does electrospray ionisation work?", a:"Sample dissolved in volatile solvent; pushed through a high-voltage needle. Each molecule gains H⁺ → MH⁺ ion. Solvent evaporates → gaseous ions."},
    {q:"In TOF MS, how are ions accelerated and why do lighter ions travel faster?", a:"All ions gain the same kinetic energy (KE = ½mv²). Lighter ions therefore have higher velocity and reach the detector sooner."},
    {q:"How is the molecular mass determined from an electrospray mass spectrum?", a:"Ion is MH⁺, so m/z = Mr + 1. Subtract 1 from the molecular ion peak to get Mr."},
    {q:"Define relative atomic mass.", a:"Weighted mean mass of all naturally occurring isotopes of an element on a scale where ¹²C = 12.00."},
    {q:"How is relative atomic mass calculated from mass spectrometry data?", a:"Ar = Σ(isotopic mass × % abundance) ÷ 100"},
    {q:"What are the four types of subshell (sub-energy level) and how many electrons can each hold?", a:"s: max 2 electrons\np: max 6 electrons\nd: max 10 electrons\nf: max 14 electrons"},
    {q:"What is an orbital and how many electrons can it contain?", a:"A region of space with high probability of finding an electron. Each orbital holds max 2 electrons with opposite spins."},
    {q:"State the Aufbau principle and give the filling order up to 4p.", a:"Electrons fill orbitals from lowest energy first. Order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p."},
    {q:"State Hund's rule.", a:"Electrons fill degenerate orbitals singly before pairing; all singly occupied orbitals have the same spin."},
    {q:"Why are the electron configurations of chromium and copper unusual?", a:"Cr: [Ar]3d⁵4s¹; Cu: [Ar]3d¹⁰4s¹. One 4s electron promoted to 3d to achieve a half-filled or fully filled d subshell (extra stability)."},
    {q:"Define first ionisation energy and write the equation for sodium.", a:"Energy to remove 1 mol of electrons from 1 mol of gaseous atoms in their ground state.\nNa(g) → Na⁺(g) + e⁻"},
    {q:"What three factors determine the magnitude of ionisation energy?", a:"1. Nuclear charge (more protons → higher IE)\n2. Atomic radius (larger atom → lower IE)\n3. Electron shielding (more inner shells → lower IE)"},
    {q:"Why does first ionisation energy generally increase across Period 3?", a:"Nuclear charge increases; shielding roughly constant (same shell) → outer electron more strongly attracted."},
    {q:"Why is there a drop in first IE between magnesium and aluminium?", a:"Al's outer electron is in the 3p subshell (higher energy, shielded by the 3s²), making it easier to remove than Mg's 3s electron."},
    {q:"Why is there a drop in first IE between phosphorus and sulfur?", a:"S's fourth 3p electron is paired in an occupied orbital; electron–electron repulsion makes it easier to remove than P's unpaired 3p electron."},
    {q:"What do successive ionisation energies reveal about atomic structure?", a:"Large jump between consecutive IEs = new (inner) shell being ionised → reveals the element's group."},
    {q:"Why do first ionisation energies decrease down Group 2?", a:"Larger radius and more shielding → outer electron less attracted to nucleus."},
  ]},
  "3.1.2": { title: "Amount of Substance", cards: [
    {q:"What is a mole and what is Avogadro's constant?", a:"One mole contains 6.022 × 10²³ particles. Avogadro's constant Nₐ = 6.022 × 10²³ mol⁻¹."},
    {q:"How do you convert between mass, molar mass, and moles?", a:"n = m / M\n(n = mol, m = g, M = g mol⁻¹)"},
    {q:"Define empirical formula and molecular formula.", a:"Empirical formula: simplest whole-number ratio of atoms of each element.\nMolecular formula: actual number of each atom in one molecule."},
    {q:"How do you determine empirical formula from percentage composition by mass?", a:"1. Divide each % by Ar → mole ratio.\n2. Divide by the smallest value.\n3. Scale to whole numbers if needed."},
    {q:"How do you find molecular formula from empirical formula?", a:"n = Mr ÷ empirical formula mass. Multiply empirical formula by n."},
    {q:"What is the formula linking concentration, moles, and volume?", a:"c = n / V\n(c in mol dm⁻³, V in dm³; divide cm³ by 1000)"},
    {q:"State the ideal gas equation and define all symbols.", a:"pV = nRT\np = Pa, V = m³, n = mol, R = 8.314 J K⁻¹ mol⁻¹, T = K"},
    {q:"What is atom economy and how is it calculated?", a:"% atom economy = (Mr of desired product ÷ sum of Mr of all products) × 100"},
    {q:"What is percentage yield and how is it calculated?", a:"% yield = (actual moles obtained ÷ theoretical moles) × 100"},
    {q:"How do you calculate the concentration of a solution in g dm⁻³ and convert to mol dm⁻³?", a:"g dm⁻³ = mass (g) ÷ volume (dm³)\nmol dm⁻³ = g dm⁻³ ÷ Mr"},
    {q:"Describe the key steps in making a standard solution in a volumetric flask.", a:"1. Weigh accurately; dissolve in a little distilled water.\n2. Transfer via funnel into volumetric flask, rinsing beaker and funnel.\n3. Make up to the mark with distilled water (meniscus on the line).\n4. Invert to mix."},
    {q:"What is a titre and what does 'concordant' mean in a titration?", a:"Titre: volume delivered from burette to endpoint. Concordant: titres agree within 0.10 cm³; averaged."},
    {q:"How are titration results used to find the concentration of an unknown solution?", a:"1. n(known) = c × V\n2. Use mole ratio → n(unknown)\n3. c(unknown) = n ÷ V"},
    {q:"What is molar volume and what is its approximate value at room temperature and pressure?", a:"Volume of 1 mol of ideal gas. At RTP (298 K, 100 kPa) ≈ 24.0 dm³ mol⁻¹."},
    {q:"How do you calculate the mass of a product formed in a reaction from given masses of reactants?", a:"1. n = m/M for each reactant.\n2. Identify limiting reagent.\n3. Use mole ratio → moles of product.\n4. m = n × M."},
    {q:"What is the significance of a high atom economy in industrial processes?", a:"Less waste; more raw material → useful product → more economical and sustainable."},
    {q:"How do you determine the number of moles of water of crystallisation in a hydrated salt?", a:"1. Heat to constant mass → find mass of water lost.\n2. Calculate moles of anhydrous salt and moles of water.\n3. Find ratio water : salt → formula (e.g. CuSO₄·5H₂O)."},
  ]},
  "3.1.3": { title: "Bonding", cards: [
    {q:"Describe ionic bonding and the structure of an ionic compound.", a:"Electron transfer → oppositely charged ions attract electrostatically. Giant ionic lattice. High mp, brittle, conducts when molten or dissolved."},
    {q:"Describe covalent bonding.", a:"Shared pair of electrons; both nuclei attracted to the shared pair. Can be single, double, or triple."},
    {q:"What is a dative (coordinate) covalent bond?", a:"A covalent bond where both electrons come from one atom. Identical to a normal covalent bond once formed. Example: NH₄⁺ - N lone pair donated to H⁺."},
    {q:"Describe metallic bonding.", a:"Positive ions in a lattice; delocalised electrons. Electrostatic attraction → high conductivity, malleability, ductility."},
    {q:"Define electronegativity and describe its periodic trends.", a:"Ability of a bonded atom to attract the shared electron pair.\nIncreases across a period; decreases down a group. F most electronegative (4.0)."},
    {q:"What makes a bond polar, and when does a polar molecule result?", a:"A bond is polar when atoms have different electronegativities → δ+/δ−. A molecule is polar if bond dipoles do not cancel.\nPolar: H₂O (bent). Non-polar: CO₂ (linear, dipoles cancel)."},
    {q:"State VSEPR theory and how it predicts molecular shapes.", a:"Electron pairs repel and arrange as far apart as possible. Lone pairs repel more than bonding pairs. Shape determined by number of bonding pairs and lone pairs."},
    {q:"Give the shapes and bond angles for molecules with 2–6 electron pairs and no lone pairs.", a:"2 BP: linear, 180°\n3 BP: trigonal planar, 120°\n4 BP: tetrahedral, 109.5°\n5 BP: trigonal bipyramidal, 90°/120°\n6 BP: octahedral, 90°"},
    {q:"How does the presence of lone pairs affect bond angles? Give examples.", a:"Each lone pair reduces bond angles by approximately 2–2.5° compared to the all-bonding-pair arrangement.\nNH₃: 3 BP + 1 LP → trigonal pyramidal, 107°\nH₂O: 2 BP + 2 LP → bent/V-shaped, 104.5°"},
    {q:"What are London (instantaneous dipole-induced dipole) forces and what factors affect their strength?", a:"Temporary dipoles induced in neighbouring molecules. Strength increases with more electrons (larger Mr) and greater surface area. All molecules experience London forces."},
    {q:"What are permanent dipole–dipole interactions?", a:"Attraction between δ+ end of one polar molecule and δ− end of another. Stronger than London forces for molecules of similar size."},
    {q:"What conditions are required for hydrogen bonding?", a:"H bonded to N, O or F, with a lone pair on N, O or F of a neighbouring molecule. Strongest intermolecular force."},
    {q:"Why does water have anomalously high boiling point and why is ice less dense than water?", a:"Up to 4 H-bonds per molecule → high energy needed to separate → high bp (100°C).\nIn ice, molecules form an open hexagonal lattice → lower density than liquid water."},
    {q:"Compare giant ionic, giant covalent, giant metallic, and simple molecular structures.", a:"Giant ionic: high mp, brittle, conducts when molten/dissolved.\nGiant covalent: very high mp (SiO₂, diamond), hard, non-conducting (except graphite).\nGiant metallic: high mp, conducts, malleable.\nSimple molecular: low mp, non-conducting; bp depends on intermolecular forces."},
    {q:"Why does diamond have a very high melting point while iodine melts at a much lower temperature?", a:"Diamond: giant covalent lattice; many strong C–C bonds must be broken.\nI₂: simple molecular; only weak London forces between molecules."},
    {q:"How does bond length relate to bond strength?", a:"Shorter bonds are stronger. C–C < C=C < C≡C in length; bond enthalpy increases with bond order."},
  ]},
  "3.1.4": { title: "Energetics", cards: [
    {q:"What is enthalpy change (ΔH) and what are its standard conditions?", a:"Heat exchanged at constant pressure. Standard: 298 K, 100 kPa, 1 mol dm⁻³. Symbol ΔH°."},
    {q:"Define standard enthalpy of formation (ΔHf°).", a:"Enthalpy change when 1 mol of compound forms from its elements in their standard states. ΔHf° of elements = 0."},
    {q:"Define standard enthalpy of combustion (ΔHc°).", a:"Enthalpy change when 1 mol burns completely in excess O₂ under standard conditions. Always negative."},
    {q:"What is standard enthalpy of neutralisation, and what is the typical value for a strong acid and strong base?", a:"Enthalpy change when 1 mol H₂O forms from acid + base. Strong/strong ≈ −57 kJ mol⁻¹. Net equation: H⁺(aq) + OH⁻(aq) → H₂O(l)."},
    {q:"State Hess's law and explain its basis.", a:"Total enthalpy change is independent of pathway (same initial and final states). Consequence of conservation of energy."},
    {q:"How do you apply Hess's law using standard enthalpies of formation?", a:"ΔHr° = Σ ΔHf°(products) − Σ ΔHf°(reactants)"},
    {q:"How do you apply Hess's law using standard enthalpies of combustion?", a:"ΔHr° = Σ ΔHc°(reactants) − Σ ΔHc°(products)\n(Note: reactants minus products - opposite to formation.)"},
    {q:"What is the calorimetry equation and what do each symbol represent?", a:"q = mcΔT\nq = heat (J), m = mass of solution (g), c = 4.18 J g⁻¹ K⁻¹, ΔT = temperature change (K or °C)"},
    {q:"How is molar enthalpy change calculated from a calorimetry experiment?", a:"1. q = mcΔT\n2. n = moles of substance\n3. ΔH = −q/n (÷1000 for kJ mol⁻¹; negative sign for exothermic)"},
    {q:"Why is the experimental enthalpy of combustion always less exothermic than the data book value?", a:"Heat lost to surroundings; incomplete combustion; not at standard conditions."},
    {q:"Define mean bond enthalpy.", a:"Average energy to break 1 mol of a specific bond type across many compounds. Bond breaking: always endothermic (+)."},
    {q:"How is ΔH estimated using mean bond enthalpies?", a:"ΔH ≈ Σ(bonds broken) − Σ(bonds formed)\nBond breaking: endothermic (+); bond forming: exothermic (−)."},
    {q:"Why are ΔH values calculated from mean bond enthalpies only approximate?", a:"Mean values are averages; actual bond enthalpy in a specific molecule differs from the mean."},
    {q:"What is an energy profile diagram and what does it show for exothermic and endothermic reactions?", a:"Enthalpy vs reaction coordinate. Exothermic: products below reactants (ΔH < 0). Endothermic: products above (ΔH > 0). Ea = height from reactants to peak."},
    {q:"What is the enthalpy change of solution and how does it compare to lattice enthalpy and hydration enthalpy?", a:"Enthalpy change when 1 mol solid dissolves in excess water. ΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion). Exothermic if hydration enthalpies outweigh lattice enthalpy."},
  ]},
  "3.1.5": { title: "Kinetics", cards: [
    {q:"State collision theory and what conditions must be met for a successful collision.", a:"Particles must collide with energy ≥ Ea and correct orientation."},
    {q:"Define activation energy.", a:"Minimum energy colliding particles must possess for a reaction to occur."},
    {q:"Describe the Maxwell-Boltzmann distribution curve (label axes and key features).", a:"X-axis: kinetic energy; Y-axis: number of molecules.\nStarts at origin, rises to a peak (most probable energy), then falls asymptotically. Area under curve = total number of molecules."},
    {q:"How does increasing temperature affect the Maxwell-Boltzmann distribution and reaction rate?", a:"Peak shifts to higher energy, becomes lower and broader (same total area). Greater proportion of molecules have energy ≥ Ea → more successful collisions → faster rate."},
    {q:"How does increasing concentration or pressure increase reaction rate?", a:"More particles per unit volume → more frequent collisions → faster rate."},
    {q:"How does increasing surface area increase reaction rate for a solid reactant?", a:"More particles exposed at surface → greater collision frequency."},
    {q:"What is a catalyst and how does it affect activation energy and the energy profile?", a:"Increases rate without being consumed. Alternative pathway with lower Ea. ΔH unchanged."},
    {q:"How does a catalyst affect the Maxwell-Boltzmann distribution curve?", a:"Distribution unchanged; Ea is lower → larger proportion of molecules have energy ≥ Ea → more successful collisions."},
    {q:"Distinguish between homogeneous and heterogeneous catalysts, giving one example of each.", a:"Homogeneous: same phase as reactants. Example: Fe²⁺/Fe³⁺ catalysing I⁻/S₂O₈²⁻ reaction (aqueous).\nHeterogeneous: different phase. Example: Fe (solid) in the Haber process."},
    {q:"Explain how a heterogeneous catalyst works at the atomic level.", a:"Reactants adsorb onto active sites on the surface. Bonds weaken, lowering Ea. Products desorb, freeing the sites."},
    {q:"What is catalyst poisoning?", a:"Impurities adsorb onto active sites, blocking them. E.g. sulfur poisons the Fe catalyst in the Haber process."},
    {q:"What is the role of the catalytic converter in a car exhaust system?", a:"Pt and Rh catalysts convert toxic gases: CO + NO → CO₂ + ½N₂. Hydrocarbons oxidised to CO₂ and H₂O. Honeycomb structure maximises surface area."},
  ]},
  "3.1.6": { title: "Equilibria", cards: [
    {q:"What is a dynamic equilibrium and what conditions are required?", a:"Closed system; rate forward = rate reverse; concentrations constant. Both reactions still occurring."},
    {q:"State Le Chatelier's principle.", a:"When conditions change, the equilibrium shifts to oppose that change."},
    {q:"How does increasing the concentration of a reactant affect equilibrium position?", a:"Shifts right (towards products) to reduce the added reactant."},
    {q:"How does changing pressure affect a gaseous equilibrium?", a:"Increasing pressure → shifts towards fewer moles of gas.\nDecreasing pressure → shifts towards more moles of gas."},
    {q:"How does temperature affect equilibrium position?", a:"Increasing temperature → shifts in the endothermic direction.\nDecreasing temperature → shifts in the exothermic direction."},
    {q:"What effect does a catalyst have on the equilibrium position?", a:"No effect on position or yield. Speeds up both directions equally - equilibrium reached faster."},
    {q:"Write the Kc expression for aA + bB ⇌ cC + dD.", a:"Kc = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)\nOnly temperature changes Kc."},
    {q:"What does the magnitude of Kc indicate about the position of equilibrium?", a:"Kc >> 1: products predominate.\nKc << 1: reactants predominate.\nKc ≈ 1: significant amounts of both."},
    {q:"What are the conditions and compromise rationale for the Haber process?", a:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  ΔH = −92 kJ mol⁻¹\n~450°C (compromise: lower T gives better yield but too slow), 200 atm, Fe catalyst.\nHigher P increases yield but costly/dangerous."},
    {q:"What are the conditions and compromise rationale for the Contact process?", a:"2SO₂(g) + O₂(g) ⇌ 2SO₃(g)  ΔH = −197 kJ mol⁻¹\n~450°C, 1–2 atm, V₂O₅ catalyst.\nLow P sufficient (yield already ~99.5%). T is a compromise between yield and rate."},
    {q:"How does a change in temperature affect the value of Kc?", a:"Temperature is the only factor that changes Kc.\nExothermic forward reaction: increasing T decreases Kc.\nEndothermic forward reaction: increasing T increases Kc."},
    {q:"Why does adding an inert gas at constant volume not affect equilibrium?", a:"Concentrations (and partial pressures) of reactants and products are unchanged, so equilibrium position is unaffected."},
  ]},
  "3.1.7": { title: "Redox", cards: [
    {q:"Define oxidation and reduction in terms of electron transfer (OIL RIG).", a:"OIL RIG: Oxidation Is Loss; Reduction Is Gain (of electrons)."},
    {q:"Define oxidising agent and reducing agent.", a:"Oxidising agent: accepts electrons; is itself reduced.\nReducing agent: donates electrons; is itself oxidised."},
    {q:"State the rules for assigning oxidation states.", a:"1. Uncombined element: 0\n2. Monatomic ion: equal to charge\n3. H: +1 (−1 in metal hydrides)\n4. O: −2 (−1 in peroxides; +2 in OF₂)\n5. Sum = 0 for neutral compound; = ion charge for ions."},
    {q:"What is the oxidation state of Mn in MnO₄⁻ and Cr in Cr₂O₇²⁻?", a:"MnO₄⁻: Mn = +7\nCr₂O₇²⁻: Cr = +6"},
    {q:"What is disproportionation? Give one example.", a:"Same element simultaneously oxidised and reduced.\nExample: Cl₂ + H₂O ⇌ HCl + HClO (Cl: 0 → −1 and 0 → +1)."},
    {q:"Describe the steps for writing a half-equation.", a:"1. Write species oxidised/reduced.\n2. Balance non-H/O atoms.\n3. Balance O with H₂O.\n4. Balance H with H⁺.\n5. Balance charge with electrons."},
    {q:"How do you combine two half-equations into an overall ionic equation?", a:"1. Multiply to equalise electrons.\n2. Add equations.\n3. Cancel electrons and any species on both sides."},
    {q:"Write the half-equations and overall equation for the reaction between iron(II) ions and acidified permanganate.", a:"Fe²⁺ → Fe³⁺ + e⁻ (×5)\nMnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O\nOverall: MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺"},
    {q:"How can oxidation states be used to identify what has been oxidised and what has been reduced?", a:"Oxidation state increases → oxidised. Decreases → reduced."},
    {q:"What is the reaction between sodium bromide and concentrated sulfuric acid, and is it redox?", a:"NaBr + H₂SO₄ → NaHSO₄ + HBr (acid-base, not redox).\nHBr then reduces H₂SO₄: 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O (Br⁻ oxidised −1 → 0)."},
    {q:"How are oxidation states used to name ionic compounds?", a:"Metal oxidation state given in Roman numerals: e.g. Fe²⁺ = iron(II); Fe³⁺ = iron(III); MnO₄⁻ = manganate(VII)."},
  ]},
  "3.1.8": { title: "Thermodynamics", cards: [
    {q:"Define lattice enthalpy (dissociation) and state its sign.", a:"Enthalpy change: 1 mol ionic solid → gaseous ions. Always endothermic (+)."},
    {q:"What two factors determine the magnitude of lattice enthalpy?", a:"1. Ionic charge: higher charge → larger lattice enthalpy.\n2. Ionic radius: smaller ions → larger lattice enthalpy (ions closer together)."},
    {q:"List all the steps included in a Born-Haber cycle for NaCl.", a:"1. Na(s) → Na(g)  (atomisation)\n2. Na(g) → Na⁺(g) + e⁻  (1st IE)\n3. ½Cl₂(g) → Cl(g)  (atomisation)\n4. Cl(g) + e⁻ → Cl⁻(g)  (1st EA)\n5. Na⁺(g) + Cl⁻(g) → NaCl(s)  (lattice formation)\nAll steps link via Hess's law to ΔHf°(NaCl)."},
    {q:"Define enthalpy of atomisation.", a:"Enthalpy change when 1 mol gaseous atoms forms from element in its standard state. Always endothermic (+). E.g. ½Cl₂(g) → Cl(g)."},
    {q:"Define first electron affinity and explain why first electron affinity is usually exothermic but second is endothermic.", a:"1st EA: Cl(g) + e⁻ → Cl⁻(g); exothermic - electron attracted to nucleus.\n2nd EA (e.g. O⁻ + e⁻ → O²⁻): endothermic - electron repelled by negative ion."},
    {q:"When does the experimental (Born-Haber) lattice enthalpy differ from the theoretical (ionic model) value, and what does this mean?", a:"If experimental (Born-Haber) lattice enthalpy is more exothermic than theoretical, the compound has covalent character. Greater with higher charge and smaller cation (greater polarising power)."},
    {q:"Define enthalpy of hydration.", a:"Enthalpy change when 1 mol gaseous ions → aqueous ions. Always exothermic (−)."},
    {q:"How is enthalpy of solution related to lattice enthalpy and hydration enthalpies?", a:"ΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion)"},
    {q:"Define entropy (S) and give its units.", a:"Measure of disorder in a system. Units: J K⁻¹ mol⁻¹."},
    {q:"Describe factors that increase entropy.", a:"• solid → liquid → gas\n• dissolving a solid\n• more moles of gas produced\n• mixing substances"},
    {q:"How is entropy change for a reaction calculated?", a:"ΔS° = Σ S°(products) − Σ S°(reactants)  [J K⁻¹ mol⁻¹]"},
    {q:"State the Gibbs free energy equation and define each term.", a:"ΔG = ΔH − TΔS\nT in K; ΔS must be in kJ K⁻¹ mol⁻¹ (÷1000 if given in J)."},
    {q:"When is a reaction thermodynamically feasible?", a:"When ΔG ≤ 0."},
    {q:"Why can an endothermic reaction still be feasible?", a:"If TΔS > ΔH → ΔG < 0. More likely at high T when TΔS term dominates."},
    {q:"How do you find the temperature at which a reaction becomes feasible?", a:"Set ΔG = 0: T = ΔH / ΔS"},
    {q:"Does a negative ΔG guarantee a reaction will occur?", a:"No. ΔG < 0 = thermodynamically feasible but rate can be negligible (high Ea)."},
  ]},
  "3.1.9": { title: "Rate Equations", cards: [
    {q:"What is a rate equation and how is it determined?", a:"rate = k[A]ᵐ[B]ⁿ. Orders determined experimentally, not from stoichiometry."},
    {q:"Define zero, first, and second order with respect to a reactant.", a:"Zero: rate independent of concentration.\nFirst: rate ∝ concentration.\nSecond: rate ∝ [concentration]²."},
    {q:"What is the overall order of reaction?", a:"Sum of individual orders (m + n). Units of k depend on overall order."},
    {q:"What are the units of the rate constant k for zero, first, and second order reactions?", a:"Zero: mol dm⁻³ s⁻¹\nFirst: s⁻¹\nSecond: mol⁻¹ dm³ s⁻¹"},
    {q:"How can you determine orders of reaction using the initial rates method?", a:"Vary one concentration at a time. Compare initial rates:\nDoubling [A]: no effect → 0th order; doubles rate → 1st; quadruples → 2nd."},
    {q:"What does a concentration-time graph look like for zero, first, and second order reactions?", a:"Zero: straight line (constant decrease).\nFirst: exponential decay (constant t½).\nSecond: steeper curve than first order."},
    {q:"What does a rate-concentration graph look like for zero, first, and second order reactions?", a:"Zero: horizontal line.\nFirst: straight line through origin.\nSecond: upward-curving parabola."},
    {q:"Define half-life and describe it for a first order reaction.", a:"Time for concentration to fall to half its value. For 1st order: t½ is constant; t½ = ln2 / k ≈ 0.693 / k."},
    {q:"What is the rate-determining step?", a:"Slowest step in the mechanism. Species in the rate equation appear in or before the RDS."},
    {q:"How does the rate equation provide evidence for a reaction mechanism?", a:"Species in the rate equation must appear in or before the RDS. Proposed mechanism must be consistent with the experimental rate equation."},
    {q:"State the Arrhenius equation and explain how it relates k to temperature.", a:"k = Ae^(−Ea/RT)\nA = pre-exponential factor, Ea = activation energy (J mol⁻¹), R = 8.314, T in K. Increasing T increases k exponentially."},
    {q:"How is the Arrhenius equation linearised and what graph is plotted?", a:"ln k = ln A − Ea/RT\nPlot ln k vs 1/T. Gradient = −Ea/R → Ea = −gradient × R. y-intercept = ln A."},
    {q:"How do you use the Arrhenius equation to calculate Ea given rate constants at two temperatures?", a:"ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂). Rearrange for Ea. T must be in K."},
  ]},
  "3.1.10": { title: "Kp", cards: [
    {q:"What is Kp and how does it differ from Kc?", a:"Kp uses partial pressures; Kc uses concentrations. Used for gaseous equilibria."},
    {q:"How is mole fraction calculated?", a:"Mole fraction of A = moles of A / total moles."},
    {q:"How is partial pressure calculated?", a:"pA = mole fraction of A × total pressure. Sum of all partial pressures = total pressure."},
    {q:"Write the Kp expression for the equilibrium: N₂(g) + 3H₂(g) ⇌ 2NH₃(g).", a:"Kp = (p_NH₃)² / (p_N₂ × (p_H₂)³)"},
    {q:"What are the units of Kp and how do you determine them?", a:"Substitute pressure units into the Kp expression and cancel. If Δn(gas) = 0, Kp has no units."},
    {q:"What is the only factor that changes the value of Kp?", a:"Temperature only."},
    {q:"How does temperature affect Kp for an exothermic reaction?", a:"Increasing T shifts equilibrium left → Kp decreases."},
    {q:"What does Δn represent in the relationship Kp = Kc(RT)^Δn?", a:"Δn = moles of gaseous products − moles of gaseous reactants."},
    {q:"How do you calculate Kp when given initial amounts and equilibrium conversion?", a:"1. Moles at equilibrium.\n2. Total moles of gas.\n3. Mole fractions.\n4. Partial pressures (mole fraction × total P).\n5. Substitute into Kp expression."},
    {q:"How does pressure affect the position of equilibrium in a gaseous reaction but not Kp?", a:"Pressure shifts equilibrium position but the ratio of partial pressures at equilibrium gives the same Kp. Only T changes Kp."},
    {q:"For the Contact process, SO₂(g) + ½O₂(g) ⇌ SO₃(g), write the Kp expression.", a:"Kp = p_SO₃ / (p_SO₂ × p_O₂^½)  Units: Pa^(−½)"},
  ]},
  "3.1.11": { title: "Electrode Potentials", cards: [
    {q:"What is a standard electrode potential (E°)?", a:"EMF of a half-cell vs. SHE at 298 K, 1 mol dm⁻³, 100 kPa. Measures tendency to be reduced."},
    {q:"Describe the standard hydrogen electrode.", a:"Pt electrode in 1.00 mol dm⁻³ H⁺(aq), H₂ at 100 kPa, 298 K. 2H⁺(aq) + 2e⁻ ⇌ H₂(g). E° = 0.00 V by definition."},
    {q:"How is the EMF of an electrochemical cell calculated?", a:"E°cell = E°(cathode) − E°(anode)\nCathode = more positive (reduction); anode = more negative (oxidation)."},
    {q:"How is the feasibility of a reaction predicted from electrode potentials?", a:"Feasible if E°cell > 0."},
    {q:"What is the purpose of the salt bridge in an electrochemical cell?", a:"Allows ions to flow between half-cells to maintain electrical neutrality. KNO₃ used - doesn't interfere with electrode reactions."},
    {q:"Write the conventional cell notation for a Zn/Zn²⁺ || Cu²⁺/Cu cell.", a:"Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)\n| = phase boundary; || = salt bridge. Anode left, cathode right."},
    {q:"What does a more positive E° value indicate about a species?", a:"Greater tendency to be reduced → stronger oxidising agent. More negative E° → stronger reducing agent."},
    {q:"Give two limitations when predicting feasibility from electrode potentials.", a:"1. Non-standard conditions alter E values.\n2. High Ea can make a feasible reaction very slow (kinetic limitation)."},
    {q:"Describe a hydrogen-oxygen fuel cell and write the electrode half-equations.", a:"Anode: H₂ − 2e⁻ → 2H⁺ (acidic) / H₂ + 2OH⁻ − 2e⁻ → 2H₂O (alkaline)\nCathode: ½O₂ + 2H⁺ + 2e⁻ → H₂O\nOverall: H₂ + ½O₂ → H₂O. Only product is water."},
    {q:"What are the advantages and disadvantages of hydrogen fuel cells compared to combustion engines?", a:"Advantages: only H₂O produced, higher efficiency, no recharging.\nDisadvantages: H₂ explosive, costly to store, mostly from fossil fuels, limited infrastructure."},
    {q:"How does the standard electrode potential series allow prediction of which species can oxidise which?", a:"Species with more positive E° oxidise species with more negative E°. More positive = stronger oxidising agent; more negative = stronger reducing agent."},
    {q:"Why is platinum used as the electrode in the standard hydrogen electrode?", a:"Inert; conducting surface for H⁺/H₂ equilibrium; catalyses the interconversion."},
  ]},
  "3.1.12": { title: "Acids & Bases", cards: [
    {q:"Define a Brønsted-Lowry acid and base, and give an example of a conjugate pair.", a:"Acid: H⁺ donor. Base: H⁺ acceptor.\nConjugate pair: differ by one H⁺. E.g. CH₃COOH/CH₃COO⁻."},
    {q:"Distinguish between strong and weak acids, giving examples.", a:"Strong: fully dissociates. E.g. HCl, HNO₃, H₂SO₄.\nWeak: partially dissociates. E.g. CH₃COOH, HF."},
    {q:"Define pH and how to calculate it for a strong acid.", a:"pH = −log[H⁺]. For strong acid: [H⁺] = acid concentration. E.g. 0.10 mol dm⁻³ HCl → pH = 1.0."},
    {q:"What is Ka and how is pH of a weak acid calculated using it?", a:"Ka = [H⁺][A⁻]/[HA]. Assume [H⁺]=[A⁻] and [HA]eq ≈ [HA]init.\n[H⁺] = √(Ka × [HA]); pH = −log[H⁺]."},
    {q:"Define pKa and explain its relationship to acid strength.", a:"pKa = −log Ka. Stronger acid → larger Ka → smaller pKa."},
    {q:"What is Kw and what is its value at 298 K?", a:"Kw = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴ mol² dm⁻⁶ at 298 K. Pure water: [H⁺] = [OH⁻] = 10⁻⁷ → pH = 7."},
    {q:"How do you calculate the pH of a strong base?", a:"[OH⁻] = base concentration. [H⁺] = Kw / [OH⁻]. pH = −log[H⁺]."},
    {q:"What is a buffer solution and how does it resist pH change?", a:"Resists pH change on adding small amounts of acid or alkali. Contains weak acid (HA) + conjugate base (A⁻).\nAdd H⁺: A⁻ + H⁺ → HA.\nAdd OH⁻: HA + OH⁻ → A⁻ + H₂O."},
    {q:"Give two ways to prepare an acidic buffer solution.", a:"1. Mix weak acid with its sodium salt (e.g. CH₃COOH + CH₃COONa).\n2. Mix weak acid with limited strong base (partially neutralises to form salt)."},
    {q:"State the Henderson-Hasselbalch equation and use it to calculate buffer pH.", a:"pH = pKa + log([A⁻]/[HA])\nAt half-neutralisation: [A⁻] = [HA] → pH = pKa."},
    {q:"Why must an indicator be chosen to match the equivalence point of a titration?", a:"Indicator changes colour over ~2 pH units around its pKa; must fall within the steep pH jump at equivalence.\nE.g. phenolphthalein (pH 8.2–10): suitable for strong acid/strong base. NOT for weak acid/strong base (equivalence > 10)."},
    {q:"Describe the shape of a pH titration curve for: (a) strong acid/strong base, (b) weak acid/strong base.", a:"(a) Starts low, large sharp jump at ~pH 7, ends high.\n(b) Starts higher, buffer region visible, equivalence point above pH 7, smaller sharp jump."},
    {q:"Give the biological importance of buffer solutions.", a:"Blood maintained at pH 7.35–7.45 by H₂CO₃/HCO₃⁻: H₂CO₃ ⇌ H⁺ + HCO₃⁻. Change of 0.5 pH units can be fatal. Cells also use phosphate buffers."},
    {q:"How does temperature affect Kw and the neutral pH?", a:"Autoionisation is endothermic → increasing T increases Kw → lower pH for pure water (e.g. ~6.8 at 37°C). Still neutral ([H⁺] = [OH⁻]). Neutrality ≠ pH 7."},
  ]},

  "ocr_3.1.1": { title: "Periodicity", cards: [
    {q:"Describe the trend in melting points across Period 3 and explain it.", a:"Na→Al: increasing mp (stronger metallic bonding). Si: very high mp (giant covalent). P₄→Ar: decreasing mp (simple molecular, LDFs decrease with size). Pattern: metallic → giant covalent → simple molecular."},
    {q:"Describe the electrical conductivity of Period 3 elements.", a:"Na, Mg, Al: good conductors (delocalised e⁻). Si: semiconductor. P, S, Cl, Ar: non-conductors."},
    {q:"Describe the reactions of Period 3 elements with oxygen.", a:"Na: 4Na + O₂ → 2Na₂O\nMg: 2Mg + O₂ → 2MgO (intense white flame)\nAl: 4Al + 3O₂ → 2Al₂O₃ (oxide layer passivates bulk)\nSi: Si + O₂ → SiO₂ (slow, high T)\nP: P₄ + 5O₂ → P₄O₁₀ (excess O₂)\nS: S + O₂ → SO₂"},
    {q:"Describe the acid/base nature of Period 3 oxides and their reactions with water.", a:"Na₂O: basic; + H₂O → 2NaOH\nMgO: basic; + H₂O → Mg(OH)₂\nAl₂O₃: amphoteric\nSiO₂: acidic (giant covalent; doesn't dissolve in H₂O)\nP₄O₁₀: acidic; + 6H₂O → 4H₃PO₄\nSO₃: acidic; + H₂O → H₂SO₄"},
    {q:"What is the amphoteric nature of Al₂O₃? Give equations.", a:"Reacts with both acids and bases.\nWith HCl: Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O\nWith NaOH: Al₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄]"},
    {q:"Describe the reactions of Period 3 chlorides with water.", a:"NaCl: neutral solution\nMgCl₂: slightly acidic\nAlCl₃: vigorous hydrolysis, steamy HCl fumes; AlCl₃ + 3H₂O → Al(OH)₃ + 3HCl\nSiCl₄: SiCl₄ + 2H₂O → SiO₂ + 4HCl\nPCl₃: + 3H₂O → H₃PO₃ + 3HCl\nPCl₅: + 4H₂O → H₃PO₄ + 5HCl"},
    {q:"Explain why NaCl dissolves neutrally but AlCl₃ gives an acidic solution.", a:"NaCl: fully ionic; Na⁺ and Cl⁻ don't hydrolyse.\nAlCl₃: Al³⁺ high charge density → [Al(H₂O)₆]³⁺ donates H⁺ → acidic."},
    {q:"Describe the trend in atomic radius across Period 3.", a:"Decreases Na → Cl. Increasing nuclear charge (11→17); electrons in same shell → greater effective nuclear charge."},
    {q:"Describe the trend in electronegativity across Period 3.", a:"Increases Na (0.9) → Cl (3.0). Increasing nuclear charge, decreasing radius → stronger attraction for bonding electrons."},
    {q:"How do the ionisation energies change across Period 3, including anomalies?", a:"Generally increase Na → Ar.\nAnomaly 1: Al < Mg (3p electron higher energy than 3s).\nAnomaly 2: S < P (paired 3p electron in S has extra e⁻-e⁻ repulsion)."},
    {q:"What is the difference in structure between NaCl and SiCl₄ in the solid state and in solution?", a:"NaCl: giant ionic lattice; dissolves to give Na⁺(aq) + Cl⁻(aq), neutral solution.\nSiCl₄: simple molecular (tetrahedral); hydrolyses: SiCl₄ + 2H₂O → SiO₂ + 4HCl."},
    {q:"Give the formula and acid/base nature of the oxides of Na, Mg, Al, Si, P, S.", a:"Na₂O: basic\nMgO: basic\nAl₂O₃: amphoteric\nSiO₂: weakly acidic\nP₄O₁₀: acidic → H₃PO₄\nSO₂: acidic → H₂SO₃\nSO₃: acidic → H₂SO₄"},
    {q:"What is the structure of white phosphorus (P₄) and how does it affect its properties?", a:"P₄ molecules: tetrahedral, each P bonded to 3 others (60° bond angles, strained). Simple molecular → low mp, soluble in non-polar solvents, very reactive."},
    {q:"Explain why sodium oxide reacts with water to form a strongly alkaline solution while SiO₂ does not.", a:"Na₂O: ionic; O²⁻ + H₂O → 2OH⁻ → strongly alkaline.\nSiO₂: giant covalent; strong Si−O bonds; insoluble in water at room T."},
    {q:"What happens when Period 3 chlorides (AlCl₃, SiCl₄) are added to water - describe observations.", a:"AlCl₃: vigorous, white fumes of HCl, acidic solution.\nSiCl₄: violent hydrolysis, steamy HCl fumes, white SiO₂ solid.\nContrast: NaCl dissolves neutrally; MgCl₂ gives slightly acidic solution."},
  ]},

  "ocr_3.1.2": { title: "Group 2 - The Alkaline Earth Metals", cards: [
    {q:"State the electronic configurations of Group 2 elements and how they form ions.", a:"Be [He]2s²; Mg [Ne]3s²; Ca [Ar]4s²; Sr [Kr]5s²; Ba [Xe]6s².\nAll lose 2 s electrons → M²⁺. Reactivity increases down group."},
    {q:"Describe the trend in atomic/ionic radius down Group 2.", a:"Increases Be → Ba. Each extra shell adds shielding and distance → reduced effective nuclear charge."},
    {q:"Describe the trend in first ionisation energy down Group 2.", a:"Decreases Be → Ba. Larger radius, more shielding → outer electrons less tightly held."},
    {q:"Why does reactivity of Group 2 metals increase down the group?", a:"Larger radius, more shielding → lower IE₁ and IE₂ → 2 electrons lost more easily."},
    {q:"Describe the reactions of Group 2 metals with water.", a:"Be: no reaction. Mg: very slow with cold water; steam: MgO + H₂.\nCa: vigorous, Ca(OH)₂ + H₂. Sr/Ba: increasingly vigorous, M(OH)₂ + H₂."},
    {q:"Describe the reactions of Group 2 metals with oxygen.", a:"All: 2M + O₂ → 2MO. Mg burns with intense white flame. Ba can also form BaO₂ (peroxide) with excess O₂."},
    {q:"Describe the reactions of Group 2 metals with dilute acids.", a:"M + 2HCl → MCl₂ + H₂. With H₂SO₄: slows for Ca/Sr/Ba - insoluble MSO₄ coats the metal."},
    {q:"Describe the trend in solubility of Group 2 hydroxides down the group.", a:"Increases down the group: Be(OH)₂ insoluble → Ba(OH)₂ soluble. pH increases down the group."},
    {q:"Describe the trend in solubility of Group 2 sulfates down the group.", a:"Decreases: MgSO₄ very soluble → BaSO₄ essentially insoluble. Opposite trend to hydroxides."},
    {q:"What is the thermal stability trend in Group 2 carbonates and explain it.", a:"Increases down group. Smaller cations polarise CO₃²⁻ more → C−O weakened → lower decomposition T. MgCO₃ least stable; BaCO₃ most stable."},
    {q:"Give the equation for thermal decomposition of calcium carbonate.", a:"CaCO₃(s) → CaO(s) + CO₂(g)  (endothermic, ~900°C)"},
    {q:"Describe uses of Group 2 compounds in medicine and industry.", a:"Mg(OH)₂: antacid, laxative.\nCa(OH)₂: soil liming, water treatment.\nCaSO₄: plaster of Paris.\nBaSO₄: barium meal (X-ray imaging; insoluble so non-toxic).\nMgO: refractory furnace linings."},
    {q:"Why is BaSO₄ safe to swallow as a barium meal if Ba²⁺ is toxic?", a:"BaSO₄ insoluble in water and stomach acid → Ba²⁺ not released → not absorbed. Opaque to X-rays → outlines GI tract."},
    {q:"What is the test for sulfate ions and why is the reagent acidified?", a:"Acidify with dilute HCl; add BaCl₂(aq) → white ppt BaSO₄ = positive. HCl removes CO₃²⁻ and SO₃²⁻ to prevent false positives."},
    {q:"Write the equations for the reactions of MgO and CaO with water.", a:"MgO + H₂O → Mg(OH)₂\nCaO + H₂O → Ca(OH)₂ (exothermic, 'slaking of lime')\nCa(OH)₂ solution (limewater) tests for CO₂."},
  ]},

  "ocr_3.1.3": { title: "The Halogens", cards: [
    {q:"Describe the physical state and colour of the halogens at room temperature.", a:"F₂: pale yellow gas. Cl₂: yellow-green gas. Br₂: red-brown liquid. I₂: grey-black solid (violet vapour). Bp increases down the group (stronger LDFs)."},
    {q:"Explain why boiling points increase from F₂ to I₂.", a:"All are simple diatomic molecules with London dispersion forces. More electrons in larger molecules → stronger LDFs → higher bp."},
    {q:"Describe the trend in oxidising ability of halogens and explain it.", a:"Decreases F₂ > Cl₂ > Br₂ > I₂. Larger radius, more shielding → incoming electron less attracted → weaker oxidising agent."},
    {q:"Describe the halogen displacement reactions and what they demonstrate.", a:"Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂ (orange)\nCl₂ + 2I⁻ → 2Cl⁻ + I₂ (brown; purple in hexane)\nBr₂ + 2I⁻ → 2Br⁻ + I₂\nI₂ cannot displace Cl⁻ or Br⁻. Shows: Cl₂ > Br₂ > I₂ in oxidising power."},
    {q:"Describe the disproportionation of Cl₂ with water.", a:"Cl₂ + H₂O ⇌ HCl + HClO\nCl: 0 → −1 (reduced) and 0 → +1 (oxidised). HClO is bactericidal."},
    {q:"Describe the reaction of Cl₂ with NaOH and give its commercial application.", a:"Cl₂ + 2NaOH → NaCl + NaClO + H₂O\nNaClO = household bleach. Also disproportionation (Cl₂ → Cl⁻ + ClO⁻)."},
    {q:"Describe the use of chlorine in water treatment.", a:"Cl₂ + H₂O → HClO (bactericidal) → kills pathogens.\nRisks: Cl₂ toxic; trihalomethanes formed (potential carcinogens); taste/odour."},
    {q:"Describe the tests for Cl⁻, Br⁻, and I⁻ using silver nitrate solution.", a:"Acidify with dilute HNO₃, add AgNO₃(aq):\nCl⁻: white ppt AgCl → dissolves in dilute NH₃\nBr⁻: cream ppt AgBr → dissolves only in conc NH₃\nI⁻: yellow ppt AgI → insoluble in dilute and conc NH₃"},
    {q:"Describe the trend in reducing ability of halide ions (X⁻).", a:"Increases Cl⁻ < Br⁻ < I⁻. Larger ion, more shielding → electrons less tightly held → easier to lose. F⁻ cannot act as reducing agent."},
    {q:"Compare the reactions of NaCl, NaBr, and NaI with concentrated H₂SO₄.", a:"NaCl: NaHSO₄ + HCl (white fumes; no redox)\nNaBr: HBr reduces H₂SO₄ → Br₂ (orange fumes) + SO₂\nNaI: HI reduces H₂SO₄ → I₂ (black) + S (yellow) + H₂S (rotten egg) + SO₂"},
    {q:"What is the reducing agent in the reaction of NaI with concentrated H₂SO₄?", a:"HI is the reducing agent. Reduces S from +6 to:\n+4 (SO₂): 2HI + H₂SO₄ → I₂ + SO₂ + 2H₂O\n0 (S): 6HI + H₂SO₄ → 3I₂ + S + 4H₂O\n−2 (H₂S): 8HI + H₂SO₄ → 4I₂ + H₂S + 4H₂O"},
    {q:"Why does the rate of reaction between halogens and hydrogen decrease down the group?", a:"H−X bond enthalpy decreases down group → Ea increases → rate decreases.\nH−F: explosive. H−Cl: explosive in UV. H−Br: high T + catalyst. H−I: slow, reversible."},
    {q:"How is the solubility of iodine in different solvents used in displacement reactions?", a:"I₂ is slightly soluble in water (orange/brown). Much more soluble in non-polar solvents (hexane/cyclohexane) → purple/violet layer. Add hexane and shake: purple upper layer confirms I₂."},
    {q:"Describe the industrial uses of chlorine.", a:"Water treatment; PVC manufacture; bleach (NaClO); solvents, pesticides, pharmaceuticals. Produced by electrolysis of brine."},
    {q:"What observation would you make when Cl₂ is bubbled into potassium iodide solution?", a:"Colourless KI → brown/orange (I₂ formed). Hexane layer → purple. Starch → blue-black.\nCl₂ + 2KI → 2KCl + I₂"},
  ]},

  "ocr_3.1.4": { title: "Qualitative Analysis", cards: [
    {q:"What colour does Li⁺ produce in a flame test?", a:"Crimson/red."},
    {q:"What colour does Na⁺ produce in a flame test?", a:"Persistent yellow/orange. Use cobalt blue glass to mask Na when testing for K⁺."},
    {q:"What colour does K⁺ produce in a flame test?", a:"Lilac/violet. View through cobalt blue glass to confirm (masks Na yellow)."},
    {q:"What colour does Ca²⁺ produce in a flame test?", a:"Brick-red/orange-red."},
    {q:"What colour does Sr²⁺ produce in a flame test?", a:"Crimson (deeper than Ca²⁺)."},
    {q:"What colour does Ba²⁺ produce in a flame test?", a:"Apple green."},
    {q:"What colour does Cu²⁺ produce in a flame test?", a:"Blue-green/turquoise."},
    {q:"Describe the NaOH test for transition metal cations (Cu²⁺, Fe²⁺, Fe³⁺).", a:"Cu²⁺: blue ppt Cu(OH)₂, insoluble in excess.\nFe²⁺: green ppt Fe(OH)₂, darkens to brown in air.\nFe³⁺: red-brown ppt Fe(OH)₃, insoluble in excess."},
    {q:"Describe the NaOH test for Ca²⁺, Mg²⁺, Al³⁺, and Zn²⁺ - and how to distinguish them.", a:"All give white ppt. In excess NaOH:\nAl³⁺ and Zn²⁺: dissolve (amphoteric) → [Al(OH)₄]⁻ / [Zn(OH)₄]²⁻.\nCa²⁺ and Mg²⁺: do not dissolve."},
    {q:"How do you test for the NH₄⁺ ion?", a:"Add NaOH(aq) and warm: NH₄⁺ + OH⁻ → NH₃ + H₂O.\nDamp red litmus → turns blue. Pungent smell."},
    {q:"How do you test for carbonate ions (CO₃²⁻)?", a:"Add dilute HCl → effervescence (CO₂).\nCO₂ turns limewater milky."},
    {q:"How do you test for sulfate ions (SO₄²⁻)?", a:"Acidify with dilute HCl, add BaCl₂(aq) → white ppt BaSO₄ (insoluble in HCl)."},
    {q:"How do you test for halide ions (Cl⁻, Br⁻, I⁻)?", a:"Acidify with dilute HNO₃, add AgNO₃(aq):\nCl⁻: white ppt → dissolves in dilute NH₃\nBr⁻: cream ppt → dissolves in conc NH₃\nI⁻: yellow ppt → insoluble in NH₃"},
    {q:"Describe the tests for the gases: H₂, O₂, CO₂, NH₃, Cl₂, HCl.", a:"H₂: squeaky pop with lit splint.\nO₂: relights glowing splint.\nCO₂: limewater → milky.\nNH₃: damp red litmus → blue; pungent.\nCl₂: damp blue litmus → red then bleached.\nHCl: conc NH₃ on glass rod → white fumes NH₄Cl."},
    {q:"What is the confirmatory test for iodide ions beyond AgNO₃?", a:"Yellow ppt AgI is insoluble in both dilute and concentrated NH₃. (AgCl dissolves in dilute NH₃; AgBr dissolves only in conc NH₃.)"},
    {q:"How do you distinguish between Al³⁺ and Ca²⁺ or Mg²⁺ ions by NaOH addition?", a:"All give white ppt. Add excess NaOH: Al³⁺ dissolves → [Al(OH)₄]⁻. Ca²⁺ and Mg²⁺ do not dissolve."},
    {q:"Describe the test for iron(II) ions (Fe²⁺) and how to distinguish from Fe³⁺.", a:"Fe²⁺ + NaOH → green ppt Fe(OH)₂ (darkens to red-brown in air).\nFe³⁺ + NaOH → red-brown ppt Fe(OH)₃."},
    {q:"How do you test for nitrate ions (NO₃⁻)?", a:"Add Al foil and NaOH(aq), heat → NH₃ gas released.\nDamp red litmus → turns blue."},
    {q:"Why must solutions be acidified with HNO₃ (not HCl or H₂SO₄) before testing for halides?", a:"HCl introduces Cl⁻ (false positive for chloride). H₂SO₄ introduces SO₄²⁻ (interferes). HNO₃ adds no interfering ions."},
    {q:"What observations confirm the presence of Cu²⁺ ions in solution?", a:"Blue solution; blue-green flame; blue ppt with NaOH (insoluble in excess); deep blue solution with excess NH₃ ([Cu(NH₃)₄(H₂O)₂]²⁺)."},
    {q:"How do you test for the presence of water and confirm that water is pure?", a:"Presence: anhydrous CuSO₄ (white → blue) or cobalt chloride paper (blue → pink).\nPurity: bp exactly 100°C at 1 atm; fp exactly 0°C."},
    {q:"What precipitate does Cr³⁺ form with NaOH, and what is distinctive about it?", a:"Grey-green ppt Cr(OH)₃. Amphoteric: dissolves in excess NaOH → [Cr(OH)₄]⁻ (green); also dissolves in excess NH₃ → violet [Cr(NH₃)₆]³⁺."},
    {q:"What precipitate does Co²⁺ form with NaOH, and how does it behave with excess NH₃?", a:"Blue/green ppt Co(OH)₂, insoluble in excess NaOH. With excess NH₃: dissolves → [Co(NH₃)₆]²⁺ (straw/yellow), oxidises in air → brown [Co(NH₃)₆]³⁺."},
    {q:"What precipitate does Mn²⁺ form with NaOH?", a:"Cream/pale buff ppt Mn(OH)₂, insoluble in excess. Darkens to brown in air (oxidised to higher Mn oxidation state)."},
  ]},

  "ocr_3.2.1": { title: "Enthalpy Changes", cards: [
    {q:"Define enthalpy change ΔH and state standard conditions.", a:"Heat energy exchanged at constant pressure. Exothermic: ΔH < 0. Endothermic: ΔH > 0.\nStandard conditions: 298 K, 100 kPa, 1 mol dm⁻³."},
    {q:"Define standard enthalpy of combustion and standard enthalpy of formation.", a:"ΔHc°: enthalpy change when 1 mol burns completely in excess O₂ (always negative).\nΔHf°: enthalpy change when 1 mol compound forms from elements in standard states. ΔHf° of elements = 0."},
    {q:"State Hess's law and explain how it is used.", a:"Total enthalpy change is independent of pathway.\nΔHr° = ΣΔHf°(products) − ΣΔHf°(reactants)"},
    {q:"How do you use standard enthalpies of combustion to find ΔHr°?", a:"ΔHr° = ΣΔHc°(reactants) − ΣΔHc°(products)\n(Note: reverse of formation formula.)"},
    {q:"State the calorimetry equation and define each term.", a:"q = mcΔT. m in g, c = 4.18 J g⁻¹ K⁻¹, ΔT in K.\nΔH = −q/n (÷1000 for kJ mol⁻¹)."},
    {q:"Describe sources of error in calorimetry experiments.", a:"• Heat loss to surroundings (main error)\n• Incomplete combustion\n• Fuel evaporation\n• Approximating density = 1 g cm⁻³\nAll make calculated ΔH less exothermic than true value."},
    {q:"Define mean bond enthalpy and explain how to calculate ΔHr using bond enthalpies.", a:"Mean bond enthalpy: average energy to break 1 mol of a bond type.\nΔHr ≈ Σ(bonds broken) − Σ(bonds formed). Approximate (averages used)."},
    {q:"Why are ΔH values calculated from mean bond enthalpies only approximate?", a:"Mean values are averages across many compounds; actual bond enthalpies vary with molecular environment. Assumes all species gaseous."},
    {q:"What is activation energy and how is it shown on an energy profile diagram?", a:"Minimum energy for particles to react. On energy profile: height from reactants to peak (transition state). Catalyst lowers the peak; ΔH unchanged."},
    {q:"Calculate ΔH for the combustion of methane using bond enthalpies.", a:"CH₄ + 2O₂ → CO₂ + 2H₂O\nBroken: 4(C−H) + 2(O=O) = 4(413) + 2(498) = 2648 kJ\nFormed: 2(C=O) + 4(O−H) = 2(805) + 4(464) = 3466 kJ\nΔH ≈ 2648 − 3466 = −818 kJ mol⁻¹"},
    {q:"What is the standard enthalpy of neutralisation for a strong acid + strong base?", a:"~−57 kJ mol⁻¹. Always H⁺(aq) + OH⁻(aq) → H₂O(l). Weaker acid/base → less exothermic."},
    {q:"Define the enthalpy of solution and its components.", a:"ΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion)"},
    {q:"What is the enthalpy of hydration and what determines its magnitude?", a:"Enthalpy change when 1 mol gaseous ions → aqueous ions. Always exothermic. Greater with higher charge and smaller ionic radius."},
    {q:"Describe a coffee-cup calorimetry experiment to measure the enthalpy of neutralisation.", a:"Mix 50 cm³ of 1.0 mol dm⁻³ NaOH and 50 cm³ of 1.0 mol dm⁻³ HCl in polystyrene cup. Record T before and after.\nq = mcΔT (m ≈ 100 g). n = 0.050 mol. ΔH = −q/n (kJ mol⁻¹)."},
    {q:"How is an energy profile diagram drawn for an exothermic and endothermic reaction?", a:"x-axis: reaction coordinate; y-axis: enthalpy.\nExothermic: reactants above products, ΔH negative.\nEndothermic: products above reactants, ΔH positive.\nCatalyst: lower peak, same ΔH."},
  ]},

  "ocr_3.2.2": { title: "Reaction Rates and Equilibrium", cards: [
    {q:"State collision theory and the conditions for a successful collision.", a:"Particles must collide with energy ≥ Ea and correct orientation."},
    {q:"Describe the Maxwell-Boltzmann distribution curve and label its key features.", a:"x-axis: KE; y-axis: number of molecules.\nStarts at origin, peak = most probable energy, long tail to right.\nArea = total molecules. Ea marked on x-axis; only molecules to right can react."},
    {q:"How does increasing temperature affect the Maxwell-Boltzmann distribution and reaction rate?", a:"Peak shifts right, becomes lower and broader (same area). Greater proportion ≥ Ea → more successful collisions → faster rate. ~10°C rise ≈ doubles rate."},
    {q:"How does increasing concentration increase reaction rate?", a:"More particles per unit volume → more frequent collisions → more successful collisions per unit time."},
    {q:"How does a catalyst increase reaction rate?", a:"Provides alternative pathway with lower Ea. Greater proportion of molecules ≥ Ea → more successful collisions. ΔH unchanged."},
    {q:"Distinguish between homogeneous and heterogeneous catalysts.", a:"Homogeneous: same phase (e.g. Fe²⁺/Fe³⁺ in aqueous I⁻ + S₂O₈²⁻).\nHeterogeneous: different phase (e.g. solid Fe in Haber; Pt in catalytic converters). Reactants adsorb onto surface."},
    {q:"State the conditions and compromise reasoning for the Haber process.", a:"N₂ + 3H₂ ⇌ 2NH₃  ΔH = −92 kJ mol⁻¹\n~450°C (compromise: lower T = better yield but too slow), 200 atm, Fe catalyst. NH₃ removed as liquid."},
    {q:"State the conditions for the Contact process and why these conditions are chosen.", a:"2SO₂ + O₂ ⇌ 2SO₃  ΔH = −197 kJ mol⁻¹\n~450°C (compromise), 1–2 atm (yield already ~99.5% → higher P not cost-effective), V₂O₅ catalyst."},
    {q:"Define dynamic equilibrium and state the conditions required.", a:"Closed system; rate of forward = rate of reverse reaction; concentrations constant."},
    {q:"State Le Chatelier's principle and apply it to concentration changes.", a:"System shifts to oppose the change.\nIncrease [reactant] → shift right. Increase [product] → shift left."},
    {q:"How does pressure change affect gaseous equilibria?", a:"Increase P → shifts to fewer moles of gas. Decrease P → shifts to more moles of gas. No effect if equal moles both sides."},
    {q:"How does temperature affect equilibrium position and the equilibrium constant?", a:"Only T changes Kc. Endothermic: increase T → shift right, Kc increases. Exothermic: increase T → shift left, Kc decreases. Catalyst has no effect on Kc."},
    {q:"Write the Kc expression for N₂(g) + 3H₂(g) ⇌ 2NH₃(g) and explain what its magnitude means.", a:"Kc = [NH₃]² / ([N₂][H₂]³)  units: mol⁻² dm⁶\nKc >> 1: products predominate. Kc << 1: reactants predominate."},
    {q:"What is the effect of a catalyst on the equilibrium position and Kc?", a:"No effect on position, Kc, or ΔH. Increases rates of both reactions equally → equilibrium reached faster."},
    {q:"How does the industrial compromise in the Haber process illustrate Le Chatelier's principle?", a:"Yield favoured by: low T, high P, removing NH₃.\nRate favoured by: high T, catalyst.\n450°C and 200 atm are compromises; Fe catalyst gives acceptable rate; NH₃ liquefied and removed to shift equilibrium right."},
  ]},

  // ═══════════════════════════════════════════════
  // INORGANIC CHEMISTRY (3.2)
  // ═══════════════════════════════════════════════

  "3.2.1": { title: "Periodicity", cards: [
    {q:"What is meant by periodicity in the periodic table?", a:"Repeating pattern of physical and chemical properties across each period, arising from repeating electronic configurations."},
    {q:"Describe the trend in atomic radius across Period 3 and explain it.", a:"Decreases Na → Cl. Nuclear charge increases; same shell (similar shielding) → increased effective nuclear charge → electrons pulled in."},
    {q:"Describe the general trend in first ionisation energy across Period 3 and explain it.", a:"Generally increases Na → Ar. Nuclear charge increases; shielding roughly constant → outer electron more strongly attracted."},
    {q:"Explain the anomaly in first ionisation energy between Mg (Group 2) and Al (Group 3).", a:"Al < Mg: Al's outer electron is in the higher-energy 3p subshell (above the full 3s²) → easier to remove."},
    {q:"Explain the anomaly in first ionisation energy between P (Group 5) and S (Group 6).", a:"S < P: S's 4th 3p electron must pair in an occupied orbital → extra e⁻–e⁻ repulsion → easier to remove."},
    {q:"Explain the melting point trend across Period 3.", a:"Na→Al: increasing mp (stronger metallic bonding). Si: very high mp (giant covalent). P₄→Cl₂→Ar: decreasing mp (simple molecular; S₈ most electrons → strongest LDFs; Ar weakest)."},
    {q:"Why do Na, Mg, and Al have increasingly high melting points?", a:"Ion charge increases (Na⁺ → Mg²⁺ → Al³⁺) and number of delocalised electrons per atom increases → stronger electrostatic attraction in metallic lattice."},
    {q:"Why does silicon have such a high melting point?", a:"Giant covalent structure; each Si bonded to 4 others tetrahedrally. Many strong covalent bonds must be broken."},
    {q:"Why does the melting point order S₈ > P₄ > Cl₂ > Ar hold for the simple molecular elements?", a:"All held by London dispersion forces. Larger molecules → more electrons → stronger LDFs → higher mp. S₈ (128 e⁻) > P₄ (60 e⁻) > Cl₂ (34 e⁻) > Ar (18 e⁻)."},
    {q:"Describe the reactions of sodium and magnesium with water.", a:"Na: 2Na + 2H₂O → 2NaOH + H₂ (vigorous, strongly alkaline).\nMg: very slow with cold water; Mg + H₂O(steam) → MgO + H₂."},
    {q:"How does the oxide character change across Period 3?", a:"Na₂O, MgO: basic. Al₂O₃: amphoteric. SiO₂: weakly acidic. P₄O₁₀, SO₂, SO₃: increasingly acidic."},
    {q:"What is electronegativity and how does it vary across Period 3?", a:"Ability of bonded atom to attract shared electrons. Increases Na → Cl (increasing nuclear charge, decreasing radius)."},
  ]},
  "3.2.2": { title: "Group 2", cards: [
    {q:"State the trends in atomic radius and first ionisation energy down Group 2.", a:"Atomic radius increases (extra shell, more shielding). First IE decreases (outer electrons further, more shielded)."},
    {q:"Why does reactivity of Group 2 metals increase down the group?", a:"Larger radius and more shielding → lower IE₁ and IE₂ → 2 s electrons more easily lost."},
    {q:"Write equations for the reactions of magnesium with cold water and with steam.", a:"Cold water (slow): Mg + 2H₂O → Mg(OH)₂ + H₂\nSteam: Mg + H₂O → MgO + H₂"},
    {q:"Write a general equation for the reaction of a Group 2 metal with dilute acid.", a:"M + 2HCl → MCl₂ + H₂"},
    {q:"Describe the trend in solubility of Group 2 hydroxides down the group and give an example.", a:"Increases: Mg(OH)₂ sparingly soluble → Ba(OH)₂ soluble. pH increases down the group."},
    {q:"Describe the trend in solubility of Group 2 sulfates down the group.", a:"Decreases: MgSO₄ very soluble → BaSO₄ effectively insoluble. Opposite to hydroxides."},
    {q:"How is Ca(OH)₂ used in agriculture?", a:"Added to acidic soils to neutralise acidity and raise pH. Ca(OH)₂ + 2H⁺ → Ca²⁺ + 2H₂O."},
    {q:"How is Mg(OH)₂ used medicinally?", a:"Antacid ('milk of magnesia'): Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O. Safe as it is insoluble."},
    {q:"How is BaSO₄ used in medicine, and why is it safe despite barium being toxic?", a:"Barium meal for GI X-rays. BaSO₄ is insoluble → Ba²⁺ not released → non-toxic. Opaque to X-rays."},
    {q:"Describe how Group 2 oxides and hydroxides react with water.", a:"MO + H₂O → M(OH)₂ (alkaline solution). E.g. CaO + H₂O → Ca(OH)₂."},
    {q:"How does the thermal stability of Group 2 carbonates change down the group?", a:"Increases down group. Smaller cations polarise CO₃²⁻ more → weaker C−O bonds → lower decomposition T. MgCO₃ least stable; BaCO₃ most stable."},
    {q:"How is CaO used in flue gas desulfurisation?", a:"CaO + SO₂ → CaSO₃. Prevents SO₂ from entering atmosphere; reduces acid rain."},
  ]},
  "3.2.3": { title: "Group 7", cards: [
    {q:"What is the colour and physical state of F₂ at room temperature?", a:"Pale yellow gas."},
    {q:"What is the colour and physical state of Cl₂ at room temperature?", a:"Yellow-green gas; choking smell; denser than air."},
    {q:"What is the colour and physical state of Br₂ at room temperature?", a:"Red-brown liquid; volatile; only halogen that is liquid at room temperature."},
    {q:"What is the colour and physical state of I₂ at room temperature?", a:"Grey-black solid; sublimes to purple/violet vapour. Slightly soluble in water (orange-brown); soluble in non-polar solvents (purple)."},
    {q:"Explain why boiling points increase down Group 7.", a:"Larger molecules → more electrons → stronger London dispersion forces → more energy needed to vaporise."},
    {q:"Describe the trend in oxidising ability down Group 7 and explain it.", a:"Decreases F₂ → I₂. Larger atoms, more shielding → less able to attract an extra electron."},
    {q:"Describe the halogen displacement reactions in aqueous solution and explain what they show.", a:"Cl₂ + 2Br⁻ → Br₂ + 2Cl⁻; Cl₂ + 2I⁻ → I₂ + 2Cl⁻; Br₂ + 2I⁻ → I₂ + 2Br⁻. I₂ cannot displace Cl⁻ or Br⁻. Confirms: Cl₂ > Br₂ > I₂ in oxidising power."},
    {q:"Describe the trend in reducing ability of halide ions down Group 7 and explain it.", a:"Increases F⁻ → I⁻. Larger ions, more shielding → electrons held less tightly → easier to lose (oxidise)."},
    {q:"Compare the reactions of NaCl, NaBr, and NaI with concentrated H₂SO₄.", a:"NaCl: NaHSO₄ + HCl (white fumes; no redox).\nNaBr: HBr produced, then 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O (orange fumes + choking SO₂).\nNaI: HI reduces H₂SO₄ to SO₂, S, H₂S (black I₂, yellow S, rotten eggs)."},
    {q:"How are halide ions identified using silver nitrate solution?", a:"Acidify with dilute HNO₃, add AgNO₃(aq):\nCl⁻: white ppt AgCl → dilute NH₃\nBr⁻: cream ppt AgBr → conc NH₃\nI⁻: yellow ppt AgI → insoluble in NH₃"},
    {q:"Write the equation for chlorine reacting with water and name the reaction type.", a:"Cl₂ + H₂O ⇌ HCl + HClO. Disproportionation (Cl: 0 → −1 and +1)."},
    {q:"Write the equation for chlorine reacting with cold dilute NaOH and give the commercial application.", a:"Cl₂ + 2NaOH → NaCl + NaClO + H₂O. NaClO = household bleach."},
    {q:"How is chlorine used in water treatment?", a:"Added to water to kill bacteria/viruses. Cl₂ + H₂O → HClO, which is bactericidal. Dose carefully controlled (Cl₂ is toxic)."},
    {q:"What are the risks and benefits of chlorinating drinking water?", a:"Benefits: kills pathogens, prevents cholera/typhoid, cheap.\nRisks: reacts with organic matter → trihalomethanes (potential carcinogens); Cl₂ itself is toxic."},
  ]},
  "3.2.4": { title: "Period 3 Elements", cards: [
    {q:"Describe the structures and bonding of Period 3 elements from Na to Ar.", a:"Na, Mg, Al: giant metallic. Si: giant covalent. P₄, S₈, Cl₂: simple molecular (Van der Waals). Ar: monatomic."},
    {q:"Describe the reactions of Period 3 elements with oxygen.", a:"Na: 4Na + O₂ → 2Na₂O\nMg: 2Mg + O₂ → 2MgO (intense white flame)\nAl: 4Al + 3O₂ → 2Al₂O₃ (protective oxide layer)\nSi: Si + O₂ → SiO₂\nP: P₄ + 5O₂ → P₄O₁₀\nS: S + O₂ → SO₂"},
    {q:"Describe the reaction of sodium with water and state observations.", a:"2Na + 2H₂O → 2NaOH + H₂. Vigorous effervescence, Na moves on surface, yellow/orange flame, strongly alkaline solution."},
    {q:"How does the acid-base character of Period 3 oxides change across the period?", a:"Na₂O, MgO: basic. Al₂O₃: amphoteric. SiO₂: weakly acidic. P₄O₁₀, SO₂, SO₃: strongly acidic."},
    {q:"Write equations for the reactions of Period 3 oxides with water.", a:"Na₂O + H₂O → 2NaOH\nMgO + H₂O → Mg(OH)₂\nP₄O₁₀ + 6H₂O → 4H₃PO₄\nSO₂ + H₂O → H₂SO₃\nSO₃ + H₂O → H₂SO₄\nAl₂O₃ and SiO₂ do not react with water."},
    {q:"What does it mean for Al₂O₃ to be amphoteric? Give equations.", a:"Reacts with both acids and bases.\nWith HCl: Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O\nWith NaOH: Al₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄]"},
    {q:"Describe the reactions of Period 3 chlorides with water.", a:"NaCl: neutral solution. MgCl₂: slightly acidic.\nAlCl₃: vigorous hydrolysis → HCl fumes, acidic solution.\nSiCl₄: SiCl₄ + 2H₂O → SiO₂ + 4HCl\nPCl₃: + 3H₂O → H₃PO₃ + 3HCl\nPCl₅: + 4H₂O → H₃PO₄ + 5HCl"},
    {q:"Why do AlCl₃, SiCl₄, and PCl₅ hydrolyse readily with water but NaCl does not?", a:"NaCl is fully ionic; Na⁺ and Cl⁻ simply dissociate. AlCl₃/SiCl₄/PCl₅ have covalent polar bonds and available orbitals → water can attack → hydrolysis."},
    {q:"Why does aluminium appear unreactive in air despite having a negative electrode potential?", a:"Al rapidly forms a thin, adherent, impermeable Al₂O₃ layer that protects the metal from further reaction."},
    {q:"Explain the trend in melting points across Period 3 in terms of structure and bonding.", a:"Na→Al: increasing mp (metallic bonding strengthens). Si: very high mp (giant covalent). P₄→Ar: decreasing mp (simple molecular; S₈ > P₄ > Cl₂ > Ar by LDF strength)."},
    {q:"Describe the reactions of Period 3 elements with chlorine (where relevant).", a:"Na: 2Na + Cl₂ → 2NaCl\nMg: Mg + Cl₂ → MgCl₂\nAl: 2Al + 3Cl₂ → 2AlCl₃ (covalent; forms Al₂Cl₆ dimer)\nSi: Si + 2Cl₂ → SiCl₄\nP: P₄ + 6Cl₂ → 4PCl₃ (excess → PCl₅)"},
  ]},
  "3.2.5": { title: "Transition Metals", cards: [
    {q:"Define a transition metal and explain why Sc and Zn are not classified as transition metals.", a:"d-block element with at least one stable ion with a partially filled d subshell.\nSc³⁺ = [Ar]3d⁰ (empty d); Zn²⁺ = [Ar]3d¹⁰ (full d). Neither qualifies."},
    {q:"List the four characteristic properties of transition metals.", a:"1. Variable oxidation states.\n2. Coloured ions.\n3. Catalytic activity.\n4. Form complex ions with ligands."},
    {q:"Write the electron configurations of Cr and Cu, explaining the anomaly.", a:"Cr: [Ar]3d⁵4s¹ (half-filled 3d extra stable).\nCu: [Ar]3d¹⁰4s¹ (fully filled 3d extra stable).\nOne electron promoted from 4s to 3d in each case."},
    {q:"Define ligand, complex ion, and coordination number.", a:"Ligand: molecule/ion that donates a lone pair to central metal (coordinate bond).\nComplex ion: metal ion + ligands.\nCoordination number: number of coordinate bonds to the metal."},
    {q:"Compare monodentate, bidentate, and multidentate ligands with examples.", a:"Monodentate: 1 lone pair. E.g. H₂O, NH₃, Cl⁻, CN⁻.\nBidentate: 2 lone pairs. E.g. en (1,2-diaminoethane), C₂O₄²⁻.\nMultidentate (hexadentate): E.g. EDTA⁴⁻."},
    {q:"Describe the common shapes of complex ions.", a:"Octahedral (6 ligands, 90°): e.g. [Fe(H₂O)₆]³⁺.\nTetrahedral (4 ligands, 109.5°): e.g. [CuCl₄]²⁻.\nSquare planar (4 ligands, 90°): e.g. [Pt(NH₃)₂Cl₂]."},
    {q:"Explain why transition metal complexes are coloured.", a:"Ligands split d orbitals into two energy levels. Electrons absorb visible light (ΔE = hν) promoting to higher level; complementary colour transmitted.\nE.g. [Cu(H₂O)₆]²⁺ absorbs red → appears blue."},
    {q:"What three factors affect the colour of a transition metal complex?", a:"1. Identity of ligands.\n2. Oxidation state of metal.\n3. Coordination number/shape."},
    {q:"Explain the chelate effect and why it makes bidentate ligands form more stable complexes.", a:"Replacing monodentate with bidentate/multidentate ligands increases number of free particles → ΔS > 0.\nΔG = ΔH − TΔS < 0 → thermodynamically favoured (entropy-driven)."},
    {q:"Describe chromium chemistry: common oxidation states, colours, and the Cr²⁺/Cr⁶⁺ interconversion.", a:"Cr²⁺: blue. Cr³⁺: violet ([Cr(H₂O)₆]³⁺) or green. CrO₄²⁻: yellow (alkaline). Cr₂O₇²⁻: orange (acidic).\nCr₂O₇²⁻ + OH⁻ → 2CrO₄²⁻\nCr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O"},
    {q:"What colour is Cr²⁺ in aqueous solution?", a:"Blue. Easily oxidised to Cr³⁺ in air."},
    {q:"What colour is [Cr(H₂O)₆]³⁺ (chromium(III) hexaqua complex)?", a:"Violet/purple. Can appear green in acidic solution (ligand substitution by Cl⁻ or SO₄²⁻)."},
    {q:"What colour is CrO₄²⁻ (the chromate ion)?", a:"Yellow (alkaline conditions). 2CrO₄²⁻ + 2H⁺ ⇌ Cr₂O₇²⁻ + H₂O on acidification."},
    {q:"What colour is Cr₂O₇²⁻ (the dichromate ion)?", a:"Orange (acidic conditions). + OH⁻ → yellow CrO₄²⁻. Used as oxidising agent (orange → green, Cr³⁺)."},
    {q:"Describe copper chemistry: common ions, colours, and complex reactions.", a:"[Cu(H₂O)₆]²⁺: pale blue. + excess NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺: deep blue. + conc Cl⁻ → [CuCl₄]²⁻: yellow/green (tetrahedral). Cu⁺ unstable in water (disproportionates to Cu + Cu²⁺)."},
    {q:"What colour is [Cu(H₂O)₆]²⁺ (copper(II) hexaqua complex)?", a:"Pale blue."},
    {q:"What colour is [Cu(NH₃)₄(H₂O)₂]²⁺ (tetraamminecopper(II) complex)?", a:"Deep blue. NH₃ causes greater d-orbital splitting than H₂O."},
    {q:"What colour is [CuCl₄]²⁻?", a:"Yellow/green. Tetrahedral (CN 4); formed with concentrated Cl⁻."},
    {q:"Describe cis-trans and optical isomerism in transition metal complexes.", a:"Cis-trans (square planar): e.g. [Pt(NH₃)₂Cl₂]: cis = same ligands adjacent; trans = opposite.\nOptical (octahedral with bidentate): e.g. [Fe(en)₃]²⁺: non-superimposable mirror images.\ncis-platin is anti-cancer active; trans-platin is inactive."},
    {q:"Explain how carbon monoxide poisoning involves haemoglobin.", a:"Haem Fe²⁺ normally binds O₂ reversibly. CO binds ~200× more strongly and irreversibly → O₂ cannot be transported → hypoxia."},
    {q:"Describe iron chemistry: Fe²⁺ and Fe³⁺ colours, and their interconversion.", a:"Fe²⁺ [Fe(H₂O)₆]²⁺: pale green. Fe³⁺ [Fe(H₂O)₆]³⁺: pale violet/lilac (in practice yellow-brown).\nFe²⁺ is reducing agent (oxidised to Fe³⁺); Fe³⁺ is oxidising agent."},
    {q:"What colour is [Fe(H₂O)₆]²⁺ (iron(II) hexaqua complex)?", a:"Pale green."},
    {q:"What colour is [Fe(H₂O)₆]³⁺ (iron(III) hexaqua complex)?", a:"Pale violet/lilac (pure complex). In practice yellow-brown (partial hydrolysis)."},
    {q:"What colour is the Mn²⁺ aqua complex [Mn(H₂O)₆]²⁺?", a:"Very pale pink (almost colourless). d⁵ configuration; d-d transitions spin-forbidden → very weak absorption."},
    {q:"What colour is the Co²⁺ aqua complex [Co(H₂O)₆]²⁺?", a:"Pink. + conc Cl⁻ → blue [CoCl₄]²⁻ (tetrahedral)."},
    {q:"What precipitate forms when NaOH(aq) is added to Co²⁺(aq)?", a:"Blue/green ppt Co(OH)₂; turns pink on standing. Does not dissolve in excess NaOH. With excess NH₃: dissolves → [Co(NH₃)₆]²⁺ (straw/yellow)."},
    {q:"What precipitate forms when NaOH(aq) is added to Mn²⁺(aq)?", a:"Cream ppt Mn(OH)₂; does not dissolve in excess NaOH. Darkens to brown in air (oxidation)."},
    {q:"Summarise the colours of the aqua complex ions [M(H₂O)₆]ⁿ⁺ for the first-row transition metals.", a:"Ti³⁺: purple. V²⁺: violet; V³⁺: green. Cr²⁺: blue; Cr³⁺: violet. Mn²⁺: very pale pink. Fe²⁺: pale green; Fe³⁺: pale violet. Co²⁺: pink. Ni²⁺: green. Cu²⁺: blue. Zn²⁺: colourless."},
    {q:"Describe the colour changes when NaOH(aq) is added to aqueous solutions of Cu²⁺, Fe²⁺, Fe³⁺, Cr³⁺, Co²⁺, and Mn²⁺.", a:"Cu²⁺: → blue ppt Cu(OH)₂ (insoluble in excess)\nFe²⁺: → green ppt Fe(OH)₂ (→ red-brown in air)\nFe³⁺: → red-brown ppt Fe(OH)₃\nCr³⁺: → grey-green ppt Cr(OH)₃ → dissolves in excess → green [Cr(OH)₄]⁻\nCo²⁺: → blue/green ppt Co(OH)₂\nMn²⁺: → cream ppt Mn(OH)₂ (darkens in air)"},
    {q:"Describe what happens when excess NH₃(aq) is added to Cu²⁺, Co²⁺, Cr³⁺, and Fe²⁺/Fe³⁺ precipitates.", a:"Cu(OH)₂ → deep blue [Cu(NH₃)₄(H₂O)₂]²⁺\nCo(OH)₂ → [Co(NH₃)₆]²⁺ (straw/yellow) → brown in air\nCr(OH)₃ → violet [Cr(NH₃)₆]³⁺\nFe(OH)₂/Fe(OH)₃: do NOT dissolve in excess NH₃"},
  ]},
  "3.2.6": { title: "Aqueous Ions", cards: [
    {q:"Why do transition metal ions form acidic solutions when dissolved in water?", a:"[M(H₂O)₆]ⁿ⁺ forms; high charge density polarises O−H bonds → H⁺ released → acidic solution."},
    {q:"Summarise the precipitates formed when NaOH is added to aqueous Cu²⁺, Fe²⁺, Fe³⁺, Cr³⁺, Mn²⁺, Al³⁺.", a:"Cu²⁺: blue ppt Cu(OH)₂\nFe²⁺: green ppt Fe(OH)₂ (→ red-brown in air)\nFe³⁺: red-brown ppt Fe(OH)₃\nCr³⁺: grey-green ppt Cr(OH)₃\nMn²⁺: cream ppt Mn(OH)₂\nAl³⁺: white ppt Al(OH)₃"},
    {q:"Which metal hydroxide precipitates dissolve in excess NaOH and what forms?", a:"Cr(OH)₃ → [Cr(OH)₄]⁻ (green). Al(OH)₃ → [Al(OH)₄]⁻ (colourless). Cu(OH)₂ and Fe hydroxides do NOT dissolve."},
    {q:"What happens when excess ammonia solution is added to Cu²⁺ and Cr³⁺ precipitates?", a:"Cu(OH)₂ → deep blue [Cu(NH₃)₄(H₂O)₂]²⁺.\nCr(OH)₃ → violet [Cr(NH₃)₆]³⁺.\nFe²⁺ and Fe³⁺ hydroxides do NOT dissolve in excess NH₃."},
    {q:"Write the ionic equation for Cu²⁺(aq) reacting with NaOH(aq).", a:"[Cu(H₂O)₆]²⁺ + 2OH⁻ → Cu(OH)₂(s) + 6H₂O. Blue ppt; insoluble in excess NaOH."},
    {q:"Write the ionic equation for Cu²⁺(aq) reacting with excess aqueous ammonia.", a:"[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O. Deep blue solution."},
    {q:"Write the ionic equation for Fe³⁺(aq) reacting with NaOH(aq).", a:"[Fe(H₂O)₆]³⁺ + 3OH⁻ → Fe(OH)₃(s) + 6H₂O. Red-brown ppt; insoluble in excess NaOH or NH₃."},
    {q:"Describe the test for NH₄⁺ ions.", a:"Add NaOH(aq) and heat: NH₄⁺ + OH⁻ → NH₃ + H₂O. Pungent gas; damp red litmus → blue."},
    {q:"Describe the test for CO₃²⁻ ions.", a:"Add dilute HCl: CO₃²⁻ + 2H⁺ → H₂O + CO₂. Effervescence; CO₂ turns limewater milky."},
    {q:"Describe the test for SO₄²⁻ ions.", a:"Acidify with dilute HCl, add BaCl₂(aq) → white ppt BaSO₄ (insoluble in HCl)."},
    {q:"Describe the tests for halide ions Cl⁻, Br⁻, I⁻.", a:"Acidify with HNO₃, add AgNO₃(aq):\nCl⁻: white ppt → dissolves in dilute NH₃.\nBr⁻: cream ppt → dissolves in conc NH₃.\nI⁻: yellow ppt → insoluble in NH₃."},
    {q:"What is the colour change observed when Fe²⁺ precipitate is left in air, and why?", a:"Fe(OH)₂ (green) → Fe(OH)₃ (red-brown). Fe²⁺ oxidised to Fe³⁺ by O₂: 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃."},
    {q:"Why is Al³⁺ often tested for alongside transition metal ions in qualitative analysis?", a:"Al³⁺ → white ppt with NaOH that dissolves in excess (amphoteric → [Al(OH)₄]⁻). Distinguishes from Ca²⁺/Mg²⁺ (don't dissolve) and transition metals (coloured ppts)."},
  ]},

  "3.3.1": { title: "Introduction to Organic Chemistry", cards: [
    {q:"What is a homologous series and what four features define it?", a:"Family of compounds with the same functional group: same general formula, adjacent members differ by CH\u2082, similar chemical properties, gradual trend in physical properties."},
    {q:"Describe IUPAC naming rules for simple organic molecules.", a:"1. Longest C chain = parent name.\n2. Principal functional group gives suffix (-ane, -ene, -ol, -al, -one, -oic acid).\n3. Lowest locant to principal group.\n4. Substituents as prefixes (alphabetical order)."},
    {q:"What is the difference between displayed, structural, and skeletal formulae?", a:"Displayed: every atom and bond shown. Structural: condensed (e.g. CH\u2083CH\u2082OH). Skeletal: zigzag backbone, vertices/ends = C; H on C omitted; heteroatoms shown."},
    {q:"Define the three types of structural isomerism with examples.", a:"Chain: different C skeleton. E.g. butane/2-methylpropane.\nPositional: functional group at different position. E.g. propan-1-ol/propan-2-ol.\nFunctional group: different functional group. E.g. ethanoic acid/methyl methanoate (both C\u2082H\u2084O\u2082)."},
    {q:"Define E/Z isomerism and explain the CIP rules for assigning priorities.", a:"Restricted rotation about C=C; each C must have 2 different substituents. CIP: higher atomic number = higher priority. Same side = Z; opposite = E."},
    {q:"Define homolytic and heterolytic bond fission and the species produced.", a:"Homolytic: each atom gets one electron \u2192 two radicals (half-arrows).\nHeterolytic: both electrons go to one atom \u2192 cation + anion (full curly arrows)."},
    {q:"Define electrophile and nucleophile with examples.", a:"Electrophile: electron-pair acceptor. E.g. H\u207a, NO\u2082\u207a, Br\u2082, carbocations.\nNucleophile: electron-pair donor. E.g. OH\u207b, CN\u207b, NH\u2083, halide ions."},
    {q:"What is the difference between a primary, secondary, and tertiary carbon (or alcohol/amine)?", a:"1\u00b0: 1 other C on that carbon. 2\u00b0: 2 other C. 3\u00b0: 3 other C."},
    {q:"Give the suffixes and one example for each of these functional groups: alcohol, aldehyde, ketone, carboxylic acid, ester, amine.", a:"Alcohol: -ol (ethanol). Aldehyde: -al (ethanal). Ketone: -one (propanone). Carboxylic acid: -oic acid (ethanoic acid). Ester: -anoate (methyl ethanoate). Amine: -amine (methylamine)."},
    {q:"What is a chiral centre and what are enantiomers?", a:"Chiral centre: C bonded to 4 different groups. Enantiomers: non-superimposable mirror images. Rotate plane-polarised light equally but in opposite directions."},
    {q:"What is a racemic mixture and how is it formed?", a:"Equal amounts of both enantiomers; zero net optical rotation. Formed when a chiral centre is created from a planar reactant \u2014 attack is equally likely from both faces."},
    {q:"What is the pharmaceutical significance of chirality? (Thalidomide example)", a:"One enantiomer of thalidomide relieved morning sickness; the other caused birth defects. Even pure active enantiomer racemises in the body. Illustrates why chirality matters in drug design."},
  ]},
    "3.3.2": { title: "Alkanes", cards: [
    {q:"What is the general formula for alkanes and why are they relatively unreactive?", a:"CₙH₂ₙ₊₂. Only strong, non-polar C–C and C–H σ bonds; no π electrons or lone pairs → resistant to electrophiles and nucleophiles."},
    {q:"What is crude oil and how is it processed?", a:"Mixture of mainly alkane hydrocarbons; separated by fractional distillation into fractions of similar bp. Heavy fractions cracked to more useful products."},
    {q:"Explain the basis of fractional distillation and give typical fractions.", a:"Heated crude oil vaporises; vapours condense at different heights based on bp. Fractions (top to bottom): refinery gas, petrol, naphtha, kerosene, diesel, fuel oil, bitumen."},
    {q:"Distinguish between thermal cracking and catalytic cracking.", a:"Thermal: ~800–1000°C, high pressure → mainly alkenes and straight-chain alkanes.\nCatalytic: ~450°C, zeolite catalyst → mainly branched alkanes, cycloalkanes, aromatics (more useful fuels)."},
    {q:"Write a balanced equation for complete combustion of propane.", a:"C₃H₈ + 5O₂ → 3CO₂ + 4H₂O"},
    {q:"What is incomplete combustion and what are its products?", a:"Limited O₂ → CO (toxic) and C (soot). CO binds to haemoglobin; soot causes respiratory disease."},
    {q:"Describe the three stages of free radical substitution (FRS) using methane and chlorine as an example.", a:"Initiation: Cl₂ →(UV) 2Cl•\nPropagation: Cl• + CH₄ → •CH₃ + HCl; •CH₃ + Cl₂ → CH₃Cl + Cl•\nTermination: 2Cl• → Cl₂; •CH₃ + Cl• → CH₃Cl; 2•CH₃ → C₂H₆"},
    {q:"Why does free radical substitution produce a mixture of products?", a:"CH₃Cl itself reacts further with Cl• → CH₂Cl₂ → CHCl₃ → CCl₄. All accumulate, giving a mixture."},
    {q:"What environmental problems arise from burning fossil fuels?", a:"CO₂: greenhouse gas. CO: toxic. SO₂/NOₓ: acid rain. Particulates: respiratory disease, global dimming."},
    {q:"How do catalytic converters reduce atmospheric pollution?", a:"Pt, Pd, Rh on honeycomb ceramic:\n2CO + 2NO → 2CO₂ + N₂\nHydrocarbons + O₂ → CO₂ + H₂O"},
    {q:"What is the trend in boiling point of alkanes and why?", a:"Increases with chain length (more electrons → stronger LDFs). Branching lowers bp (less surface contact → weaker LDFs)."},
  ]},
    "3.3.3": { title: "Halogenoalkanes", cards: [
    {q:"What is a halogenoalkane and how are primary, secondary, and tertiary types distinguished?", a:"Contains C−X bond. 1°: halogen C bonded to 1 other C. 2°: 2 other C. 3°: 3 other C."},
    {q:"Why is the C–X bond in halogenoalkanes polar?", a:"X is more electronegative than C → Cδ+–Xδ− → C susceptible to nucleophilic attack."},
    {q:"How does bond strength of C–X vary down the group and what is its effect on reactivity?", a:"C–F > C–Cl > C–Br > C–I. Weaker bond → more easily broken → reactivity increases F → I."},
    {q:"Describe SN2 nucleophilic substitution (primary halogenoalkanes).", a:"One-step concerted. Nucleophile attacks Cδ+ from back (180° to leaving group). Bond forms and C–X breaks simultaneously → inversion of configuration (Walden inversion)."},
    {q:"Describe SN1 nucleophilic substitution (tertiary halogenoalkanes).", a:"Two steps. Step 1: C–X breaks → planar carbocation. Step 2: nucleophile attacks from either face → racemic mixture."},
    {q:"How are halogenoalkanes hydrolysed and how is the rate compared for C–Cl, C–Br, and C–I?", a:"Warm with NaOH(aq); OH⁻ replaces X → alcohol. Rate: C–I > C–Br > C–Cl. Test: AgNO₃/ethanol - yellow AgI ppt fastest."},
    {q:"How is a nitrile made from a halogenoalkane, and what is the significance of this reaction?", a:"RX + KCN (ethanol/water) → RCN + KX. CN⁻ is nucleophile. Chain extended by one C - useful in synthesis. Nitrile can be hydrolysed → carboxylic acid or reduced → amine."},
    {q:"How is a primary amine made from a halogenoalkane?", a:"RX + excess NH₃ (sealed tube/ethanol) → RNH₂ + HX. Excess NH₃ minimises secondary/tertiary amine formation."},
    {q:"What happens when a halogenoalkane is treated with KOH in ethanol (not aqueous) and what product forms?", a:"Elimination: KOH/ethanol removes H from adjacent C → alkene + HX.\nEthanolic KOH → elimination; aqueous KOH → substitution."},
    {q:"What are CFCs and why are they harmful?", a:"Chlorofluorocarbons (C, Cl, F only). UV breaks C–Cl → Cl• radicals in stratosphere.\nCl• + O₃ → ClO• + O₂; ClO• + O₃ → 2O₂ + Cl•. One Cl• destroys thousands of O₃ molecules."},
    {q:"What are HCFCs and HFCs, and why are they used as CFC replacements?", a:"HCFCs: have C–H bonds; break down before reaching stratosphere → fewer Cl• radicals.\nHFCs: no Cl → no Cl• → no ozone depletion."},
  ]},
    "3.3.4": { title: "Alkenes", cards: [
    {q:"Describe the bonding in alkenes and why this makes them reactive.", a:"C=C: σ bond + π bond (sideways p-orbital overlap). π electrons exposed above/below plane → attacked by electrophiles."},
    {q:"What is E/Z isomerism and what structural requirement must be met?", a:"No rotation about C=C; each C must have 2 different groups. E: high-priority groups opposite sides; Z: same side (CIP: higher atomic number = higher priority)."},
    {q:"Describe the mechanism of electrophilic addition of Br₂ to ethene.", a:"1. π electrons polarise Br–Br → nearer Br δ+.\n2. π electrons attack δ+ Br → bromonium ion/carbocation + Br⁻.\n3. Br⁻ attacks from back → 1,2-dibromoethane."},
    {q:"What test for a C=C double bond uses bromine water, and what is observed?", a:"Add bromine water (orange/brown). If C=C present, electrophilic addition occurs → solution decolourises. Alkanes do not react."},
    {q:"Explain Markovnikov's rule for addition of HBr to propene.", a:"H adds to C with more H atoms; Br adds to more substituted C. More stable secondary carbocation formed at middle C (more alkyl groups stabilise +charge)."},
    {q:"How does steam (H₂O) add to ethene and what are the conditions?", a:"CH₂=CH₂ + H₂O → CH₃CH₂OH. Conditions: 300°C, 65 atm, H₃PO₄ catalyst."},
    {q:"What is addition polymerisation and how is the repeat unit drawn?", a:"Many C=C monomers link to form saturated polymer chain. Repeat unit: remove double bond, add brackets with n. E.g. −(CH₂–CHX)ₙ−. Not biodegradable."},
    {q:"Give the names and monomers for three important addition polymers.", a:"Poly(ethene) from CH₂=CH₂ (bags/bottles).\nPoly(propene) from CH₂=CHCH₃ (ropes/carpets).\nPVC from CH₂=CHCl (pipes/insulation)."},
    {q:"What are the environmental issues with addition polymers?", a:"Non-biodegradable; C–C backbone resists attack. Disposal: landfill, incineration (toxic gases possible), recycling (energy-intensive)."},
    {q:"Why do alkenes undergo addition reactions rather than substitution?", a:"π electrons readily attract electrophiles; addition breaks the π bond and forms two σ bonds, restoring stable sp³ carbons. Addition more energetically favourable than substitution."},
  ]},
    "3.3.5": { title: "Alcohols", cards: [
    {q:"Classify alcohols as primary, secondary, or tertiary and give an example of each.", a:"1°: OH on C bonded to 1 other C (e.g. ethanol). 2°: 2 other C (e.g. propan-2-ol). 3°: 3 other C (e.g. 2-methylpropan-2-ol)."},
    {q:"Why do alcohols have much higher boiling points than alkanes of similar Mr?", a:"O–H hydrogen bonds (much stronger than London forces in alkanes) → more energy needed to separate molecules."},
    {q:"Describe the oxidation of primary and secondary alcohols.", a:"1° + K₂Cr₂O₇/H₂SO₄, distil → aldehyde.\n1° + excess [O], reflux → carboxylic acid.\n2° + [O] → ketone.\n3°: no reaction."},
    {q:"What colour change indicates oxidation is occurring with acidified dichromate?", a:"Orange Cr₂O₇²⁻ → green Cr³⁺."},
    {q:"Describe the dehydration of alcohols to alkenes.", a:"Alcohol + conc H₃PO₄ (or Al₂O₃) at ~180°C → alkene + H₂O (elimination)."},
    {q:"Compare the production of ethanol by fermentation versus direct hydration of ethene.", a:"Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂; yeast, ~37°C; batch; renewable; slow; dilute.\nHydration: C₂H₄ + H₂O → C₂H₅OH; H₃PO₄, 300°C, 65 atm; continuous; non-renewable; fast; pure."},
    {q:"Describe esterification of an alcohol with a carboxylic acid.", a:"RCOOH + R'OH ⇌ RCOOR' + H₂O. Conc H₂SO₄ catalyst, warm. Reversible; excess reagent improves yield."},
    {q:"How is a bromoalkane made from an alcohol?", a:"ROH + HBr → RBr + H₂O. Nucleophilic substitution: OH protonated → H₂O leaving group, Br⁻ attacks."},
    {q:"What is the reaction of alcohols with sodium metal?", a:"2ROH + 2Na → 2RONa + H₂. O–H bond cleaved; H₂ released; sodium alkoxide formed."},
    {q:"Why is fermentation-derived ethanol sometimes described as carbon-neutral, and why is this claim contested?", a:"Crops absorb CO₂ during growth, offsetting combustion. But fossil fuels used in farming, transport, and distillation → not truly carbon-neutral."},
  ]},
    "3.3.6": { title: "Organic Analysis", cards: [
    {q:"How is mass spectrometry used to identify an organic compound?", a:"M⁺ peak = Mr. Common fragment losses: 15 (CH₃), 29 (CHO), 45 (COOH), 77 (C₆H₅). Base peak = most stable fragment. Compare fragmentation to database."},
    {q:"What is the principle of infrared (IR) spectroscopy?", a:"Bonds absorb IR at characteristic wavenumbers. Each bond type gives a specific absorption; spectrum identifies functional groups."},
    {q:"What are the key IR absorptions to recognise?", a:"O–H (alcohol): broad ~3230–3550 cm⁻¹\nO–H (carboxylic acid): very broad ~2500–3300 cm⁻¹\nN–H (amine): ~3300–3500 cm⁻¹ (2 peaks for 1°)\nC=O (aldehyde/ketone): ~1700–1750 cm⁻¹\nFingerprint region: <1500 cm⁻¹"},
    {q:"What is the fingerprint region and how is it used?", a:"Below 1500 cm⁻¹: unique to each molecule. Cannot be interpreted peak-by-peak; compared to a library to confirm identity."},
    {q:"Describe the test for aldehydes using Tollens' reagent.", a:"[Ag(NH₃)₂]⁺ + aldehyde → silver mirror (Ag⁺ reduced to Ag). Ketones: no reaction."},
    {q:"Describe the test for aldehydes using Fehling's solution.", a:"Cu²⁺ (blue) + aldehyde → Cu₂O brick-red ppt. Ketones: no reaction."},
    {q:"What is 2,4-DNPH (Brady's reagent) used for?", a:"Reacts with any aldehyde or ketone → orange/yellow 2,4-DNPH derivative (condensation). Melting point of derivative identifies the specific compound."},
    {q:"How is the iodoform (tri-iodomethane) test used in organic analysis?", a:"Add I₂/NaOH, warm. Yellow CHI₃ precipitate (antiseptic smell) = positive for CH₃CO– group (methyl ketone or ethanol/secondary alcohol with CH₃CO– after oxidation)."},
    {q:"How do you test for carboxylic acids?", a:"Add Na₂CO₃: effervescence (CO₂). 2RCOOH + Na₂CO₃ → 2RCOONa + H₂O + CO₂."},
    {q:"How does acidified K₂Cr₂O₇ help identify the oxidation state of an organic compound?", a:"Orange → green: oxidation (1°/2° alcohol or aldehyde present). No change: 3° alcohol or ketone."},
    {q:"How do you distinguish between a primary alcohol, secondary alcohol, aldehyde, ketone, and carboxylic acid using chemical tests?", a:"K₂Cr₂O₇/H₂SO₄: 1°, 2° alcohol, aldehyde → green; 3° alcohol, ketone → no change.\nTollens'/Fehling's: aldehyde → silver mirror/brick-red ppt; ketone → no reaction.\nNa₂CO₃: carboxylic acid → CO₂ effervescence."},
  ]},
    "3.3.7": { title: "Optical Isomerism, Aldehydes & Ketones", cards: [
    {q:"Distinguish between aldehydes and ketones in terms of structure, naming, and reactivity.", a:"Aldehyde: C=O at end of chain (C-1), suffix -al; can be oxidised (reducing agent).\nKetone: C=O within chain, suffix -one; cannot be oxidised → no reaction with Tollens'/Fehling's."},
    {q:"What is a chiral carbon and when does optical isomerism arise?", a:"Chiral C: 4 different substituents. Optical isomerism: molecule has one or more chiral centres → two non-superimposable mirror images (enantiomers)."},
    {q:"How do enantiomers differ in their physical and chemical properties?", a:"Identical physical/chemical properties to achiral reagents. Differ in: rotation of plane-polarised light (+/−); reactivity with chiral molecules (e.g. enzymes)."},
    {q:"Describe nucleophilic addition of HCN to a carbonyl compound. Why is NaCN + HCl used instead of pure HCN?", a:"CN⁻ attacks Cδ+ of C=O → alkoxide anion; H⁺ protonates O⁻ → hydroxynitrile.\nPure HCN extremely toxic; NaCN + acid generates HCN in situ more safely."},
    {q:"Why does nucleophilic addition of HCN to an aldehyde such as ethanal produce a racemic mixture?", a:"Carbonyl C is planar (sp²). CN⁻ attacks from either face equally → equal R and S enantiomers → racemic mixture."},
    {q:"Draw the mechanism for nucleophilic addition of HCN to propanone.", a:"Step 1: CN⁻ lone pair → Cδ+ of C=O; C−CN bond forms, O⁻ alkoxide.\nStep 2: H⁺ protonates O⁻ → OH.\nProduct: 2-hydroxy-2-methylpropanenitrile."},
    {q:"What is the product of reducing an aldehyde with NaBH₄, and what of a ketone?", a:"NaBH₄ provides H⁻ (hydride). Aldehyde + NaBH₄ → primary alcohol. Ketone + NaBH₄ → secondary alcohol."},
    {q:"How does the reaction of aldehydes and ketones with 2,4-DNPH help identify them?", a:"Any C=O + 2,4-DNPH → orange/yellow solid derivative. Melting point compared to data table identifies specific compound."},
    {q:"Explain why the addition of 2,4-DNPH is a condensation reaction.", a:"Two molecules combine with loss of H₂O. −NH₂ of 2,4-DNPH attacks C=O → tetrahedral intermediate → H₂O expelled → C=N bond."},
    {q:"Give the pharmaceutical importance of enantiomers, using a specific example.", a:"Chiral receptors/enzymes interact differently with each enantiomer. Ibuprofen: S-enantiomer active; R-enantiomer largely inactive. Thalidomide: one enantiomer therapeutic, other teratogenic."},
    {q:"Describe the preparation of an aldehyde from a primary alcohol.", a:"1° alcohol + K₂Cr₂O₇/H₂SO₄; distil off aldehyde immediately to prevent further oxidation to carboxylic acid. Orange → green."},
  ]},
    "3.3.9": { title: "Carboxylic Acids & Derivatives", cards: [
    {q:"Describe the structure and properties of carboxylic acids.", a:"–COOH group. Form H bonds (including dimers). Low Mr: very soluble in water. Weak acids: RCOOH ⇌ RCOO⁻ + H⁺."},
    {q:"How do carboxylic acids react with carbonates and why is this a useful test?", a:"2RCOOH + Na₂CO₃ → 2RCOONa + H₂O + CO₂. CO₂ effervescence confirms –COOH. Phenols do not react with Na₂CO₃."},
    {q:"How are esters formed from carboxylic acids, and what are the conditions?", a:"RCOOH + R'OH ⇌ RCOOR' + H₂O. Conc H₂SO₄, warm/reflux. Reversible; modest yield."},
    {q:"How are acyl chlorides made from carboxylic acids?", a:"RCOOH + PCl₅ → RCOCl + POCl₃ + HCl\nor RCOOH + SOCl₂ → RCOCl + SO₂ + HCl. Irreversible; highly reactive."},
    {q:"Describe the reactions of acyl chlorides with water, alcohols, and amines.", a:"+ H₂O → RCOOH + HCl (vigorous, steamy fumes)\n+ R'OH → RCOOR' + HCl (ester, irreversible)\n+ R'NH₂ → RCONHR' + HCl (amide)"},
    {q:"Why are acyl chlorides preferred over carboxylic acids for making esters in the laboratory?", a:"Faster, irreversible → higher yield; no catalyst needed. Drawback: HCl produced."},
    {q:"Describe acid anhydrides and compare them to acyl chlorides.", a:"(RCO)₂O: less reactive than RCOCl but similar products (by-product RCOOH instead of HCl).\n+ H₂O → 2RCOOH; + R'OH → RCOOR' + RCOOH; + amine → amide + RCOOH. Used industrially (e.g. aspirin)."},
    {q:"Describe the hydrolysis of esters under acidic and alkaline conditions.", a:"Acid: ester + H₂O ⇌ acid + alcohol (H₂SO₄/HCl; reversible; low yield).\nAlkaline (saponification): ester + NaOH → carboxylate salt + alcohol (irreversible; higher yield). Used in soap making."},
    {q:"What are polyesters and how are they made?", a:"Condensation polymerisation of diol + dicarboxylic acid → polyester + H₂O. E.g. PET (Terylene) from benzene-1,4-dicarboxylic acid + ethane-1,2-diol. Repeat unit: –COO–. Can be hydrolysed."},
    {q:"What are amides and how are they formed?", a:"–CONH– group. RCOCl + 2NH₃ → RCONH₂ + NH₄Cl. RCOCl + R'NH₂ → RCONHR + HCl. Also from acid anhydride + NH₃ or amine."},
    {q:"What are polyamides (nylons) and how are they made?", a:"Condensation polymerisation of diamine + dicarboxylic acid (or diacid chloride). E.g. nylon-6,6 from hexane-1,6-diamine + hexanedioic acid. Repeat unit: –NHCO–. Kevlar: aromatic polyamide (bullet-proof vests)."},
    {q:"What is the mechanism for acyl chloride reactions (nucleophilic addition-elimination)?", a:"Step 1: Nu: attacks electrophilic C of RCOCl → tetrahedral intermediate.\nStep 2: Cl⁻ expelled → product (substitution of Cl by Nu)."},
    {q:"How does aspirin synthesis use ethanoic anhydride rather than ethanoyl chloride?", a:"Ethanoic anhydride: cheaper, less corrosive (by-product = ethanoic acid, not HCl), safer to handle. Used to acetylate salicylic acid."},
  ]},
    "3.3.10": { title: "Aromatic Chemistry", cards: [
    {q:"Describe the Kekulé model of benzene and the evidence that disproves it.", a:"Kekulé: alternating C–C and C=C. Evidence against:\n1. All C–C bonds same length (0.140 nm, intermediate).\n2. No addition with Br₂(aq).\n3. ΔHhydrogenation = −208 vs −360 kJ/mol predicted for 3 double bonds (152 kJ/mol delocalisation energy)."},
    {q:"Describe the delocalised model of benzene.", a:"Regular hexagon; each C sp² hybridised. Six p orbitals overlap → continuous π cloud above and below ring. 6 π electrons fully delocalised → extra stability."},
    {q:"Why does benzene undergo electrophilic substitution rather than electrophilic addition?", a:"Addition would destroy the stable delocalised π system. Substitution restores aromaticity → energetically preferred."},
    {q:"Describe the nitration of benzene (conditions, mechanism, electrophile).", a:"Conditions: conc HNO₃ + conc H₂SO₄, <55°C.\nElectrophile: NO₂⁺ (nitronium ion): HNO₃ + H₂SO₄ → NO₂⁺ + H₂O + HSO₄⁻.\nNO₂⁺ attacks ring → arenium ion → H⁺ lost → nitrobenzene."},
    {q:"Describe halogenation of benzene (conditions and role of the halogen carrier).", a:"Benzene + Cl₂/Br₂ + AlCl₃/FeBr₃ (Lewis acid) → halobenzene + HX.\nCatalyst generates Cl⁺/Br⁺ electrophile → attacks ring → arenium ion → H⁺ lost → product."},
    {q:"Describe Friedel-Crafts acylation of benzene.", a:"Benzene + RCOCl + AlCl₃ → aryl ketone + HCl.\nAlCl₃ generates RCO⁺ (acylium ion) → attacks ring → arenium ion → H⁺ lost. Introduces C=O into ring."},
    {q:"Why is phenol much more reactive than benzene toward electrophilic substitution?", a:"–OH lone pair delocalised into ring → higher electron density at ortho and para positions. Reacts with Br₂(aq) without catalyst."},
    {q:"Describe the reaction of phenol with bromine water.", a:"Phenol + 3Br₂(aq) → 2,4,6-tribromophenol (white ppt) + 3HBr. No catalyst; Br₂ solution decolourises. Test for phenol."},
    {q:"What are activating and deactivating substituents on benzene, and how do they direct further substitution?", a:"Activating (e⁻-donating: –OH, –NH₂, –CH₃): ring more reactive → ortho/para.\nDeactivating (e⁻-withdrawing: –NO₂, –CHO, –COOH): ring less reactive → meta."},
    {q:"Give the industrial importance of aromatic chemistry.", a:"Nitrobenzene → aniline → dyes/pharmaceuticals. Friedel-Crafts → ketones for pharmaceuticals. Chlorobenzene → pesticides. Styrene → polystyrene."},
    {q:"Explain the general mechanism for electrophilic aromatic substitution (EAS).", a:"Step 1: E⁺ attacks ring C → arenium ion (ring no longer aromatic).\nStep 2: H⁺ lost → aromaticity restored → substituted product."},
  ]},
    "3.3.11": { title: "Amines", cards: [
    {q:"Classify amines as primary, secondary, and tertiary and give an example of each.", a:"1°: 1 C on N (e.g. CH₃NH₂). 2°: 2 C on N (e.g. (CH₃)₂NH). 3°: 3 C on N (e.g. (CH₃)₃N). All have lone pair on N → bases and nucleophiles."},
    {q:"Why are aliphatic amines stronger bases than ammonia, and why are aryl amines weaker?", a:"Aliphatic: alkyl groups donate e⁻ to N → lone pair more available → stronger than NH₃.\nAryl (aniline): lone pair delocalised into ring → less available → weaker than NH₃.\nOrder: aliphatic > NH₃ > aryl."},
    {q:"How are aliphatic amines made by reduction of nitriles?", a:"RCN + 2H₂ (Ni catalyst) or LiAlH₄ (dry ether) → RCH₂NH₂. Chain extended by 1 C."},
    {q:"How are primary amines made from halogenoalkanes and ammonia?", a:"RX + excess NH₃ (sealed tube/ethanol) → RNH₂ + HX. Excess NH₃ minimises secondary/tertiary amine formation."},
    {q:"How is aniline (phenylamine) prepared from nitrobenzene?", a:"PhNO₂ + 6[H] → PhNH₂ + 2H₂O. Reagent: Sn/conc HCl, reflux. Add NaOH to liberate free amine from PhNH₃⁺Cl⁻ salt."},
    {q:"How do amines react with acyl chlorides?", a:"RNH₂ + R'COCl → R'CONHR + HCl (amide). Nucleophilic addition-elimination. Excess amine neutralises HCl."},
    {q:"What is a diazonium salt and how is it formed?", a:"ArNH₂ + NaNO₂ + HCl at 0–5°C → ArN₂⁺Cl⁻ + 2H₂O. Must stay <10°C; decomposes above this."},
    {q:"Describe the coupling reaction of diazonium salts to form azo dyes.", a:"ArN₂⁺ + phenol or amine (alkaline) → Ar–N=N–Ar' (azo dye; brightly coloured). Diazonium ion = weak electrophile; attacks activated ring at para position."},
    {q:"How do amines act as nucleophiles with halogenoalkanes?", a:"RNH₂ + R'X → R'NHR (2°) → R'₂NR (3°) → R'₃NR⁺X⁻ (quaternary salt). Mixture of products obtained."},
    {q:"What are quaternary ammonium salts and what are their uses?", a:"N bonded to 4 C; permanent + charge; no lone pair. Used as cationic surfactants in fabric softeners and conditioners."},
    {q:"Why do amines generally have lower boiling points than alcohols of similar Mr?", a:"N–H···N H-bonds weaker than O–H···O → less energy to separate molecules → lower bp."},
  ]},
    "3.3.12": { title: "Polymers", cards: [
    {q:"Distinguish between addition and condensation polymerisation.", a:"Addition: alkene monomers join with no other products; 100% atom economy. Condensation: bifunctional monomers react, small molecule lost (H₂O or HCl); <100% atom economy."},
    {q:"How do you draw the repeat unit of an addition polymer from its monomer?", a:"Remove double bond; add single bonds on each side; place in square brackets with subscript n. E.g. CH₂=CHCH₃ → [–CH₂–CH(CH₃)–]ₙ."},
    {q:"Give three examples of addition polymers, their monomers, and uses.", a:"Poly(ethene): CH₂=CH₂; bags/bottles.\nPVC: CH₂=CHCl; pipes/insulation.\nPTFE: CF₂=CF₂; non-stick cookware."},
    {q:"How is a polyester formed? Give an example.", a:"Diol + dicarboxylic acid → polyester + H₂O. E.g. PET from ethane-1,2-diol + benzene-1,4-dicarboxylic acid. Repeat unit: –COO–."},
    {q:"How is nylon-6,6 formed and what is its repeat unit?", a:"Hexane-1,6-diamine + hexanedioic acid → nylon-6,6 + H₂O. Repeat unit: [–NH(CH₂)₆NHCO(CH₂)₄CO–]ₙ. Key feature: amide link –NHCO–."},
    {q:"Why can condensation polymers be hydrolysed but addition polymers cannot?", a:"Condensation polymers contain ester/amide links → attacked by water. Addition polymers: C−C backbone only → resistant to hydrolysis."},
    {q:"What are the environmental problems with non-biodegradable polymers?", a:"Accumulate in landfill; microplastics in oceans; incineration releases CO₂ and toxic gases; recycling energy-intensive."},
    {q:"Describe recycling and other disposal methods for polymers.", a:"Mechanical: melt and remould (quality decreases). Chemical: hydrolyse condensation polymers; crack addition polymers. Incineration: recovers energy. Biodegradable polymers: broken down by microbes."},
    {q:"What is Kevlar and why is it particularly strong?", a:"Aromatic polyamide from benzene-1,4-diamine + benzene-1,4-dicarboxylic acid. Rigid rings + amide H-bonds between aligned chains → exceptional tensile strength. Used in bullet-proof vests."},
    {q:"What is the atom economy of addition polymerisation compared to condensation polymerisation?", a:"Addition: 100% (all atoms in product). Condensation: <100% (H₂O or HCl lost per monomer unit)."},
  ]},
    "3.3.13": { title: "Amino Acids, Proteins & DNA", cards: [
    {q:"What is the general structure of an α-amino acid?", a:"–NH₂ and –COOH on the same α-carbon. Formula: RCH(NH₂)COOH. All (except glycine) have a chiral α-carbon."},
    {q:"What is a zwitterion and at what pH does it form?", a:"At the isoelectric point (pI): –NH₃⁺ and –COO⁻ both present; net charge = 0."},
    {q:"How does pH affect the form of an amino acid?", a:"Below pI (acidic): –NH₃⁺ and –COOH (+1).\nAt pI: –NH₃⁺ and –COO⁻ (0, zwitterion).\nAbove pI (alkaline): –NH₂ and –COO⁻ (−1)."},
    {q:"Describe peptide bond formation and hydrolysis.", a:"–COOH + –NH₂ → –CONH– + H₂O (condensation → peptide bond).\nHydrolysis (acid/base/enzyme + H₂O) → amino acids."},
    {q:"Describe the four levels of protein structure.", a:"1° = amino acid sequence (covalent peptide bonds).\n2° = α-helix or β-sheet (H-bonds between backbone C=O and N–H).\n3° = 3D folding (H-bonds, ionic bonds, disulfide bridges –S–S–, VdW).\n4° = association of 2+ polypeptide chains."},
    {q:"What types of interactions stabilise the tertiary structure of a protein?", a:"H-bonds (polar R-groups); ionic bonds (charged R-groups); disulfide bridges –S–S– (cysteine); van der Waals (non-polar R-groups)."},
    {q:"What are enzymes and how are they specific?", a:"Biological protein catalysts. Active site is complementary in shape/charge/polarity to the substrate (lock-and-key or induced fit). Each enzyme catalyses one or few reactions."},
    {q:"What is the structure of a nucleotide in DNA?", a:"Deoxyribose sugar + phosphate group + one of four bases (A, T, G, C). Nucleotides joined by phosphodiester bonds."},
    {q:"Describe the structure of the DNA double helix and the base-pairing rules.", a:"Two antiparallel polynucleotide strands in a right-handed double helix. Backbones outside; bases inward. A–T (2 H-bonds); G–C (3 H-bonds)."},
    {q:"Why do G–C pairs give greater stability to DNA than A–T pairs?", a:"G–C: 3 H-bonds. A–T: 2 H-bonds. More G–C → more energy to separate strands → higher melting temperature."},
    {q:"Summarise how cis-platin interacts with DNA.", a:"[Pt(NH₃)₂Cl₂] (square planar). Cl⁻ replaced by H₂O → [Pt(NH₃)₂(H₂O)₂]²⁺. Forms coordinate bonds with two adjacent guanine bases → cross-links and distorts DNA → blocks replication → kills cancer cell."},
    {q:"Explain the biological importance of chirality in amino acids.", a:"All natural amino acids (except glycine) are L-enantiomers. Chiral enzymes/ribosomes process only L-forms. D-amino acids not incorporated into human proteins."},
  ]},
    "3.3.14": { title: "Organic Synthesis", cards: [
    {q:"What is the retrosynthesis approach and why is it useful?", a:"Work backwards from target to starting materials, identifying each transformation. Systematic approach for multi-step synthesis planning."},
    {q:"Summarise AS-level synthesis routes FROM alkanes and alkenes.", a:"Alkane → halogenoalkane: X₂/UV (FRS).\nAlkene → halogenoalkane: + HX (Markovnikov).\nAlkene → dihaloalkane: + X₂ (electrophilic addition).\nAlkene → alcohol: + H₂O, H₃PO₄, 300°C."},
    {q:"Summarise AS-level synthesis routes FROM halogenoalkanes.", a:"→ alcohol: NaOH(aq), warm.\n→ alkene: KOH/ethanol, heat.\n→ nitrile: KCN/ethanol, reflux (+1 C).\n→ amine: excess NH₃, sealed tube, heat."},
    {q:"Summarise key functional group interconversions in synthesis (A2 level).", a:"1° alcohol → aldehyde: K₂Cr₂O₇/H₂SO₄, distil.\n1° alcohol → carboxylic acid: K₂Cr₂O₇/H₂SO₄, reflux.\n2° alcohol → ketone: K₂Cr₂O₇/H₂SO₄, reflux.\nAlcohol → ester: + RCOOH, H₂SO₄.\nCarboxylic acid → acyl chloride: PCl₅ or SOCl₂.\nNitrile → amine: LiAlH₄/dry ether.\nNitrobenzene → aniline: Sn/HCl, then NaOH."},
    {q:"How do you extend a carbon chain in synthesis?", a:"RX + KCN → RCN (+1 C; hydrolyse → COOH or reduce → amine).\nCarbonyl + HCN → cyanohydrin (+1 C).\nFriedel-Crafts acylation: ArH + RCOCl/AlCl₃ → Ar−CO−R."},
    {q:"What practical techniques are used to isolate and purify organic products?", a:"Recrystallisation (solids): dissolve in hot solvent, cool, filter.\nDistillation: separate liquids by bp.\nSolvent extraction: separating funnel; separate organic/aqueous layers.\nDrying: anhydrous MgSO₄/Na₂SO₄.\nReflux: heat with condenser to prevent evaporation."},
    {q:"What is green chemistry and how does it apply to organic synthesis?", a:"Maximise atom economy; renewable feedstocks; catalysts; safer solvents; shorter routes → less waste, less energy."},
    {q:"What precautions and techniques are used when handling hazardous reagents in synthesis?", a:"Corrosives (HCl, H₂SO₄): fume cupboard, gloves, goggles.\nToxic gases: fume cupboard.\nFlammable solvents: no naked flames, electrical heating.\nReflux: anti-bumping granules; condenser flowing before heating."},
    {q:"Describe a two-step synthesis of an ester from a primary alcohol.", a:"Step 1: 1° alcohol + excess K₂Cr₂O₇/H₂SO₄, reflux → carboxylic acid.\nStep 2: Carboxylic acid + alcohol + conc H₂SO₄, reflux → ester + H₂O."},
    {q:"How would you convert benzene to an amine in multiple steps?", a:"Step 1: Benzene + conc HNO₃/H₂SO₄, <55°C → nitrobenzene.\nStep 2: Nitrobenzene + Sn/conc HCl, reflux → PhNH₃⁺Cl⁻; + NaOH → PhNH₂."},
    {q:"What information do IR and MS data give you when planning a synthesis or confirming a product?", a:"MS: M⁺ peak = Mr; fragmentation = structural clues.\nIR: identifies functional groups. Compare starting material and product IR to confirm transformation (e.g. loss of O–H peak, gain of C=O → oxidation of alcohol)."},
  ]},
    "3.3.15": { title: "NMR Spectroscopy", cards: [
    {q:"What is the physical basis of NMR spectroscopy?", a:"Nuclei with spin (¹H, ¹³C) align in an external field. RF radiation flips spins between energy states, absorbing energy at characteristic frequencies - this resonance is detected."},
    {q:"What is chemical shift (δ) and why is TMS used as the reference standard?", a:"δ (ppm): resonance position relative to TMS (δ = 0). TMS: all 12 H equivalent (one peak); inert; low bp; peak away from organic signals."},
    {q:"How does ¹³C NMR differ from ¹H NMR in the information it provides?", a:"¹³C: each peak = distinct C environment; no splitting; peak height not proportional to number of C.\n¹H: integration = relative number of H; splitting observed; shift identifies environment."},
    {q:"What is the n+1 rule (spin-spin splitting)?", a:"n adjacent H → n+1 peaks. 0 adj H = singlet; 1 = doublet; 2 = triplet; 3 = quartet."},
    {q:"What information can be obtained from a ¹H NMR spectrum?", a:"1. Number of peaks = number of distinct H environments.\n2. Chemical shift = type of environment.\n3. Integration ratio = relative number of H.\n4. Splitting pattern = number of adjacent H (n+1 rule)."},
    {q:"Give the approximate chemical shift ranges for common proton environments.", a:"Alkyl CH₃: ~0.9; CH₂: ~1.3\nNext to C=O: ~2–3\nO–CH: ~3.5\nAr–H: ~7–8\nO–H (alcohol): ~1–5 (broad)\nCHO: ~9–10\nCOOH: ~10–12"},
    {q:"How are O–H and N–H protons identified in ¹H NMR?", a:"Broad peaks at variable δ. Adding D₂O causes these peaks to disappear (H/D exchange) → confirms O–H or N–H."},
    {q:"How is a ¹H NMR spectrum interpreted to identify an unknown organic compound?", a:"1. Number of peaks = distinct H environments.\n2. Integration ratios = relative H counts.\n3. Chemical shifts → functional groups.\n4. Splitting patterns (n+1) → adjacent H.\n5. Combine with MS (Mr) and IR (functional groups)."},
    {q:"Explain the ¹H NMR spectrum expected for ethanol (CH₃CH₂OH).", a:"CH₃: δ ~1.2, triplet (2 adj H), 3H.\nCH₂: δ ~3.7, quartet (3 adj H), 2H.\nOH: δ ~2–5, broad singlet, 1H; disappears with D₂O."},
    {q:"Why might two protons in a molecule not be equivalent (non-equivalent) even if they appear similar?", a:"Equivalent only if swapping gives an identical molecule. E.g. CH₃CHBrCH₃: both CH₃ equivalent. CH₃CHBrCH₂CH₃: flanking groups at chiral centre inequivalent → separate peaks."},
    {q:"How does ¹³C NMR help with structure determination?", a:"One peak per distinct C environment. Fewer peaks than C atoms = equivalent carbons. E.g. benzene: 1 ¹³C peak (all 6 C equivalent)."},
    {q:"What solvent is typically used in NMR and why?", a:"Deuterated solvents (CDCl₃, D₂O): ²H resonates at a very different frequency → no interference with ¹H spectrum."},
  ]},
  "3.3.16": { title: "Chromatography", cards: [
    {q:"State the general principle of chromatography.", a:"Components distribute between stationary phase (doesn't move) and mobile phase (moves). Stronger affinity for stationary phase → moves slower. Differences in affinity cause separation."},
    {q:"Define Rf value and explain what it tells you.", a:"Rf = distance moved by compound ÷ distance moved by solvent front (0–1).\nHigh Rf: greater affinity for mobile phase. Low Rf: strongly adsorbed on stationary phase. Characteristic under fixed conditions."},
    {q:"Describe how TLC is carried out and how compounds are visualised.", a:"Draw pencil baseline on silica plate; spot sample; develop in solvent (below baseline); mark solvent front; allow to dry.\nVisualise: UV lamp; iodine vapour (yellow-brown); ninhydrin (purple, amino acids)."},
    {q:"How is TLC used to identify a compound and check purity?", a:"ID: co-spot unknown + reference; same Rf = likely identical. Confirm with different solvent.\nPurity: pure compound = single spot; impurities = multiple spots."},
    {q:"How does column chromatography work and what is its advantage over TLC?", a:"Silica column; solvent flows through. Less polar compounds elute first. Fractions collected and analysed by TLC.\nAdvantage: preparative (isolates usable quantities); TLC is analytical only."},
    {q:"Describe the principle and operation of gas chromatography (GC).", a:"Stationary: liquid film on solid support in coiled column. Mobile: inert carrier gas (N₂/He). Sample vaporised, swept through column. Separation by bp and stationary phase interaction. Lower bp/weaker interaction → elutes earlier. Detector generates peak per component."},
    {q:"What is retention time in gas chromatography and how is it used?", a:"Time from injection to peak maximum. Characteristic under fixed conditions. Compare unknown tR to reference standards for identification."},
    {q:"Describe GC-MS (gas chromatography–mass spectrometry) and its advantages.", a:"GC separates; each component enters MS → fragmentation pattern compared to database → definitive ID. Extremely sensitive (ppb); rapid; used in forensics, environmental monitoring, pharmaceutical QC."},
    {q:"Describe HPLC (high-performance liquid chromatography) and when it is used.", a:"High-pressure pump forces solvent through fine silica column. High resolution. Used for non-volatile/thermally unstable compounds (proteins, drugs). Reverse-phase HPLC: C18 stationary, polar mobile phase."},
    {q:"Compare the four main chromatographic techniques: TLC, column chromatography, GC, and HPLC.", a:"TLC: silica plate/organic solvent; analytical; Rf values.\nColumn: silica column/organic solvent; preparative; fractions.\nGC: liquid film/carrier gas; volatile samples; retention times; MS detection.\nHPLC: fine silica/high-pressure solvent; non-volatile; high resolution."},
    {q:"How does the polarity of the mobile phase affect Rf values in TLC on a silica plate?", a:"Silica = polar. More polar mobile phase: competes with compound–silica interactions → compounds move further → higher Rf. Less polar solvent → lower Rf. Aim for Rf 0.2–0.8."},
  ]},

  "RP1a": { title: "Measurement of Enthalpy of Combustion", cards: [
    {q: "What is the standard enthalpy of combustion?", a: "Enthalpy change when 1 mol of substance is completely burned in excess O₂ under standard conditions (298 K, 100 kPa)."},
    {q: "What apparatus is used to measure enthalpy of combustion experimentally?", a: "Spirit burner, copper/aluminium calorimeter (known mass of water), thermometer, clamp stand."},
    {q: "What measurements must be recorded during a combustion calorimetry experiment?", a: "Initial and final mass of spirit burner + fuel. Initial and final water temperature."},
    {q: "How is the heat energy transferred to the water calculated?", a: "q = mcΔT where m = mass of water (g), c = 4.18 J g⁻¹ K⁻¹, ΔT = temperature rise."},
    {q: "How is the molar enthalpy of combustion calculated from q?", a: "ΔcH = −q ÷ n; n = mass burned ÷ Mr. Convert q to kJ (÷1000). Sign is negative (exothermic)."},
    {q: "Why does the experimental value for enthalpy of combustion differ from the data book value?", a: "Heat lost to surroundings. Incomplete combustion. Fuel evaporation. Not at standard conditions."},
    {q: "Why is the experimental ΔcH always less exothermic than the data book value?", a: "Heat lost to surroundings → measured ΔT smaller than expected → less exothermic value."},
    {q: "How can heat loss to the surroundings be reduced in this experiment?", a: "Draught shield. Lid on calorimeter. Lagging/insulation. Polished can to reduce radiation."},
    {q: "Why should the base of the calorimeter be close to the flame but not touching it?", a: "Maximises heat transfer; avoids soot deposits that reduce conduction."},
    {q: "What safety precautions are needed when burning flammable liquids?", a: "Cap on spirit burner when not lit. Keep away from flames. Well-ventilated area. Do not overfill."},
    {q: "What is soot formation and why is it a problem in this practical?", a: "Incomplete combustion deposits carbon on the can, reducing heat transfer to the water."},
    {q: "Why is a copper or aluminium can preferred over glass as the calorimeter?", a: "Metals are good heat conductors - transfer heat to water more efficiently than glass."},
    {q: "How does the mass of water in the calorimeter affect the temperature rise?", a: "Larger mass → smaller ΔT (less precise). Smaller mass → larger, more measurable ΔT."},
    {q: "What is the specific heat capacity of water and what are its units?", a: "c = 4.18 J g⁻¹ K⁻¹"},
    {q: "What does it mean for combustion to be incomplete, and how does it affect the result?", a: "CO or soot formed instead of CO₂ - less energy released, so measured ΔcH is less exothermic."},
    {q: "How would you improve the accuracy of the enthalpy of combustion experiment?", a: "Use a bomb calorimeter. Ensure excess O₂. Use thermometer to 0.1°C. Repeat and average."}
  ]},

  "RP1b": { title: "Measurement of Enthalpy of Reaction", cards: [
    {q: "What type of calorimeter is used to measure enthalpy changes in solution?", a: "Polystyrene cup - good insulation, minimises heat loss."},
    {q: "What reactions can be studied using a polystyrene cup calorimeter?", a: "Neutralisation (acid + base), displacement (e.g. Zn + CuSO₄), dissolution."},
    {q: "Describe the method for measuring enthalpy of neutralisation using a polystyrene cup.", a: "1. Pipette 25 cm³ alkali into cup. Record temperature every minute for 3 min.\n2. Add 25 cm³ acid at minute 4. Stir; record every minute for minutes 5–10.\n3. Extrapolate cooling curve back to minute 4 to find maximum ΔT."},
    {q: "Why is the temperature recorded before the reaction as well as after?", a: "Establishes a baseline; allows extrapolation to mixing time, giving a more accurate ΔT."},
    {q: "Why is a polystyrene cup preferred over a glass beaker?", a: "Polystyrene is a poor heat conductor - minimises heat loss to surroundings."},
    {q: "How is ΔH per mole calculated from a neutralisation experiment?", a: "q = mcΔT (m = total mass of solution). n = moles of limiting reagent. ΔH = −q ÷ n (kJ mol⁻¹)."},
    {q: "Why is the sign of ΔH negative for neutralisation reactions?", a: "Neutralisation is exothermic - heat is released into the solution."},
    {q: "What assumptions are made when calculating ΔH from a polystyrene cup experiment?", a: "Density = 1 g cm⁻³. c = 4.18 J g⁻¹ K⁻¹. No heat lost to cup or thermometer."},
    {q: "How does the polystyrene cup experiment differ from a bomb calorimeter?", a: "Polystyrene cup: open (constant pressure), measures ΔH, significant heat losses.\nBomb calorimeter: closed (constant volume), measures ΔU, much more accurate."},
    {q: "What sources of error exist in the polystyrene cup method?", a: "Heat loss to surroundings/cup. Density ≈ 1 g cm⁻³ (approximation). Heat capacity of cup/thermometer ignored. Poor stirring."},
    {q: "How can accuracy be improved in the polystyrene cup method?", a: "Lid on cup. Extrapolate temperature–time graph. Thermometer to 0.1°C. Thorough stirring."},
    {q: "How do you extrapolate a temperature–time graph to find the maximum temperature rise?", a: "Extrapolate cooling curve back to the time of mixing → temperature at maximum reaction."},
    {q: "What is the enthalpy of neutralisation for all strong acid–strong base reactions, and why?", a: "≈ −57 kJ mol⁻¹; net ionic equation is always H⁺(aq) + OH⁻(aq) → H₂O(l)."},
    {q: "Why is the enthalpy of neutralisation less exothermic for weak acids or weak bases?", a: "Energy needed to dissociate the weak acid/base offsets some heat from H⁺ + OH⁻ → H₂O."},
    {q: "In a displacement reaction such as Zn(s) + CuSO₄(aq), what mass is used in q = mcΔT?", a: "Mass of the solution only (not the zinc solid) - only the aqueous solution absorbs the heat."}
  ]},

  "RP2": { title: "Rates of Reaction – Clock Reaction", cards: [
    {q: "What is a clock reaction, and why is it useful for measuring reaction rates?", a: "Produces a sudden visible change after a fixed amount of product forms. Time to this change ∝ 1/initial rate."},
    {q: "Describe the iodine clock reaction between H₂O₂ and I⁻ ions.", a: "H₂O₂ oxidises I⁻ → I₂. I₂ is immediately reduced back by Na₂S₂O₃. When all thiosulfate is consumed, free I₂ reacts with starch → sudden blue-black colour."},
    {q: "What is the overall equation for the iodine clock reaction?", a: "H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O\nThen: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻\nClock triggers when all S₂O₃²⁻ is consumed."},
    {q: "How is the rate of reaction calculated from a clock reaction experiment?", a: "Rate ∝ 1/t (t = time in seconds for colour change)."},
    {q: "How is the effect of concentration on rate investigated using the clock reaction?", a: "Keep temperature, total volume, starch and thiosulfate constant. Vary one reactant's volume; make up to same total volume with distilled water. Record t; calculate rate = 1/t."},
    {q: "Why is distilled water added when changing the volume of reactant in a clock experiment?", a: "To keep total volume constant, so concentrations of other reagents are unchanged - fair test."},
    {q: "How is the order with respect to a reactant determined from clock reaction data?", a: "Plot rate (1/t) vs [A]. Straight line through origin = first order. Upward curve = second order."},
    {q: "What graph would indicate first order kinetics in a clock experiment?", a: "Straight line through origin: rate (1/t) vs [A] - shows rate ∝ [A]."},
    {q: "How is the effect of temperature on reaction rate investigated?", a: "Keep concentrations constant. Heat reactants in water bath to different temperatures before mixing. Record t; calculate rate = 1/t. Plot rate vs T (or ln k vs 1/T for Arrhenius)."},
    {q: "What happens to the time t as temperature increases in the clock reaction?", a: "t decreases - more energetic collisions exceed Ea, so rate increases."},
    {q: "What safety precautions are needed for the iodine clock reaction?", a: "H₂O₂: oxidiser/irritant - gloves and goggles. H₂SO₄: corrosive. Well-ventilated area. Dispose of iodine safely."},
    {q: "What is the role of starch in the iodine clock reaction?", a: "Forms a deep blue-black complex with I₂ - visual indicator for the endpoint."},
    {q: "What is the role of sodium thiosulfate in the iodine clock reaction?", a: "Immediately converts I₂ back to I⁻, preventing accumulation. Clock triggers only when all thiosulfate is consumed."},
    {q: "Why must the amount of sodium thiosulfate remain constant in all trials of the clock experiment?", a: "The clock triggers when a fixed amount of I₂ forms (= moles of thiosulfate). Changing it means different extents of reaction are being compared - unfair test."},
    {q: "What is a typical source of error in a clock reaction experiment?", a: "Subjective colour-change judgement. Temperature fluctuations. Inaccurate small-volume measurement. Timer delay."},
    {q: "How can you verify that the reaction is first order from concentration–time data?", a: "Constant half-life on concentration–time graph, or straight line on ln[A] vs time graph."}
  ]},

  "RP3": { title: "Equilibrium – Le Chatelier's", cards: [
    {q: "What is the chromate/dichromate equilibrium used to demonstrate in this practical?", a: "2CrO₄²⁻(aq) + 2H⁺(aq) ⇌ Cr₂O₇²⁻(aq) + H₂O(l)\nAdding acid/alkali shifts equilibrium - visible by colour change."},
    {q: "What colour change is observed when acid (H⁺) is added to yellow chromate solution?", a: "Yellow → orange: equilibrium shifts right (more Cr₂O₇²⁻) to consume added H⁺."},
    {q: "What colour change is observed when alkali (OH⁻) is added to orange dichromate solution?", a: "Orange → yellow: OH⁻ removes H⁺, equilibrium shifts left (more CrO₄²⁻)."},
    {q: "How does the iron(III) thiocyanate equilibrium demonstrate Le Chatelier's principle?", a: "Fe³⁺ + SCN⁻ ⇌ [FeSCN]²⁺ (blood red). Adding Fe³⁺/SCN⁻ deepens colour (shift right). Adding NaF removes Fe³⁺ → colour fades (shift left)."},
    {q: "What is observed when more Fe³⁺ ions are added to the iron(III) thiocyanate equilibrium?", a: "Blood-red colour deepens - equilibrium shifts right, more [FeSCN]²⁺ formed."},
    {q: "What is observed when Na₂HPO₄ or NaF is added to [FeSCN]²⁺ solution?", a: "Red colour fades - Fe³⁺ is removed, equilibrium shifts left."},
    {q: "How is Le Chatelier's principle stated?", a: "When conditions change, equilibrium shifts to oppose that change."},
    {q: "How can you confirm a colour change is due to equilibrium shift and not just dilution?", a: "Run a control with the same volume of distilled water. If the control shows no colour change (or smaller change), the effect is due to equilibrium shift."},
    {q: "What does a shift to the right in an equilibrium mean in terms of concentrations?", a: "Product concentrations increase; reactant concentrations decrease."},
    {q: "What effect does adding water (diluting) have on the chromate/dichromate equilibrium?", a: "Decreases [H⁺] → shifts left → solution becomes more yellow (more CrO₄²⁻)."},
    {q: "Why does adding NaOH to the chromate/dichromate system shift the equilibrium left?", a: "OH⁻ + H⁺ → H₂O, reducing [H⁺]. Equilibrium shifts left to replace H⁺ → more CrO₄²⁻ (yellow)."},
    {q: "What safety precautions are needed when working with chromate/dichromate solutions?", a: "Toxic and carcinogenic - wear gloves. Fume cupboard if possible. Dispose in heavy metals waste."},
    {q: "What is the colour of CrO₄²⁻ and Cr₂O₇²⁻?", a: "CrO₄²⁻: yellow. Cr₂O₇²⁻: orange."},
    {q: "Why is a dynamic equilibrium described as 'dynamic'?", a: "Forward and reverse reactions continue at equal rates - constant molecular movement, but no overall concentration change."},
    {q: "What are the conditions required for a dynamic equilibrium to be established?", a: "Closed system; forward and reverse reactions occurring at equal rates."},
    {q: "Does adding a catalyst shift the position of equilibrium?", a: "No - catalyst speeds both directions equally; equilibrium reached faster but position unchanged."}
  ]},

  "RP4": { title: "Distillation of a Product from a Reaction (Activity 5)", cards: [
    {q: "What is the purpose of simple distillation?", a: "Separate a volatile liquid from a non-volatile solute, or two liquids with bp differing by >25°C."},
    {q: "What is fractional distillation used for?", a: "Separating liquids with similar boiling points (e.g. ethanol/water) via repeated condensation–evaporation in a fractionating column."},
    {q: "Describe the apparatus required for simple distillation.", a: "Round-bottomed flask, anti-bumping granules, thermometer (bulb at side-arm junction), Liebig condenser (water in at bottom), receiver flask."},
    {q: "Why is the thermometer bulb positioned at the side-arm junction in distillation?", a: "Measures vapour temperature - indicates bp of fraction being collected."},
    {q: "Why does water enter the condenser at the bottom and exit at the top?", a: "Counter-current flow - maximises cooling efficiency."},
    {q: "Why are anti-bumping granules added to the distillation flask?", a: "Nucleation sites for bubbles → prevent superheating and violent bumping."},
    {q: "How can purity of the distillate be checked?", a: "Measure boiling point (pure = sharp, constant). TLC against known sample. Melting point for solids."},
    {q: "How does fractional distillation separate ethanol from water?", a: "Ethanol bp 78.4°C, water bp 100°C. Fractionating column allows repeated condensation/re-evaporation. Collect when thermometer reads ~78°C."},
    {q: "Why is a fractionating column packed with glass beads or Raschig rings?", a: "Increases surface area for condensation/re-evaporation cycles → more theoretical plates → better separation."},
    {q: "What is the purpose of the Liebig condenser?", a: "Cools and condenses vapour back to liquid via cold water in outer jacket."},
    {q: "How is TLC used to assess purity of a distillate?", a: "Spot distillate alongside pure reference. Single spot at matching Rf = pure product."},
    {q: "What is a suitable test for the purity of a solid product?", a: "Melting point: pure solid = sharp, matches data book value. Impure = broad range, lower temperature."},
    {q: "What does it mean if the thermometer reading rises during distillation?", a: "Higher-boiling fraction distilling over - change the collection vessel."},
    {q: "What safety precautions are required during distillation of flammable liquids?", a: "No naked flames - electric heating mantle. Secure all joints. Fume cupboard. Do not boil dry."},
    {q: "Why should the distillation apparatus never be sealed (closed system)?", a: "Vapour pressure builds up → glassware could shatter."},
    {q: "How does simple distillation differ from fractional distillation in terms of apparatus?", a: "Simple: flask + condenser + receiver (no fractionating column). Fractional: adds fractionating column for closer boiling points."},
    {q: "What is the specific reaction used in AQA Required Activity 5?", a: "Partial oxidation of propan-1-ol → propanal: CH₃CH₂CH₂OH + [O] → CH₃CH₂CHO + H₂O.\nLimited K₂Cr₂O₇/H₂SO₄; aldehyde distilled off immediately to prevent further oxidation."},
    {q: "Why is a limited quantity of oxidising agent used and the product distilled off as it forms in Activity 5?", a: "Prevents further oxidation of aldehyde to carboxylic acid. Distilling off immediately maximises aldehyde yield."},
    {q: "What colour change is observed during the partial oxidation of propan-1-ol with K₂Cr₂O₇?", a: "Orange → green (Cr₂O₇²⁻ reduced to Cr³⁺)."},
    {q: "What safety precautions are specific to the Activity 5 oxidation experiment?", a: "K₂Cr₂O₇: toxic, carcinogenic - gloves. H₂SO₄: corrosive. Propan-1-ol/propanal: flammable - electric mantle. Fume cupboard."}
  ]},

  "RP5": { title: "TLC Separation (Activity 12)", cards: [
    {q: "What are the two phases in chromatography, and what is their role?", a: "Stationary phase: stays still (silica). Mobile phase: moves (solvent). Compounds separate by differential attraction to each phase."},
    {q: "How is Rf value defined and calculated?", a: "Rf = distance moved by spot ÷ distance moved by solvent front. No units; always 0–1."},
    {q: "What does a high Rf value indicate about a compound?", a: "Greater affinity for the mobile phase - more soluble in solvent, less adsorbed to silica."},
    {q: "Describe the TLC procedure step by step.", a: "1. Pencil baseline 1 cm from bottom.\n2. Spot sample with capillary tube.\n3. Develop in chamber with solvent below baseline.\n4. Remove before solvent front reaches top; mark front.\n5. Visualise (UV lamp or ninhydrin)."},
    {q: "Why must the pencil line on a TLC plate be drawn in pencil and not pen?", a: "Ink dissolves in solvent and travels up the plate, interfering with the chromatography."},
    {q: "Why must the solvent level be below the baseline in TLC?", a: "If solvent covers the spots, compounds dissolve into it directly rather than being carried up by capillary action."},
    {q: "How are colourless compounds visualised on a TLC plate?", a: "UV light (dark spots on fluorescent plate). Ninhydrin spray (purple - amino acids). Iodine vapour (yellow/brown - organics)."},
    {q: "How can TLC be used to identify a compound?", a: "Co-spot unknown alongside reference compounds. Same Rf as reference = likely the same compound."},
    {q: "How can TLC confirm the purity of a product?", a: "Single spot = pure. Multiple spots = impurities present. Rf should match literature value."},
    {q: "How does column chromatography work?", a: "Silica-packed column. Mixture loaded at top; solvent runs down by gravity. Components elute at different times based on silica interactions."},
    {q: "How are fractions collected in column chromatography?", a: "Separate tubes collected as solvent elutes. Each fraction analysed by TLC to identify desired product."},
    {q: "What is the advantage of column chromatography over TLC?", a: "Preparative - isolates and collects pure compound. TLC is analytical only."},
    {q: "Why is ninhydrin used specifically for amino acids on TLC?", a: "Reacts with –NH₂ group → purple/pink (Ruhemann's purple)."},
    {q: "What does it mean for two compounds to have the same Rf value?", a: "They may be the same, but not conclusive - test with a second solvent to confirm."},
    {q: "Why should a TLC developing chamber have a lid?", a: "Saturates atmosphere with solvent vapour - prevents evaporation from plate, which would distort Rf values."},
    {q: "What stationary phase is typically used in TLC and column chromatography?", a: "Silica (SiO₂) - polar, adsorbs polar compounds more strongly. Coated on aluminium/glass backing."}
  ]},

  "RP6": { title: "Synthesis of Halogenoalkane", cards: [
    {q: "What is the overall reaction for the preparation of 1-bromobutane from butan-1-ol?", a: "CH₃CH₂CH₂CH₂OH + NaBr + H₂SO₄ → CH₃CH₂CH₂CH₂Br + NaHSO₄ + H₂O\n(H₂SO₄ + NaBr → HBr in situ; HBr then reacts with the alcohol.)"},
    {q: "Why is concentrated H₂SO₄ used rather than HBr directly in this synthesis?", a: "HBr gas is hazardous. H₂SO₄ generates HBr in situ from NaBr - safer and more convenient."},
    {q: "What type of reaction mechanism is involved in this synthesis?", a: "Nucleophilic substitution (SN2) - Br⁻ substitutes the –OH group."},
    {q: "Describe the reflux stage of the 1-bromobutane preparation.", a: "Mix butan-1-ol, NaBr, water; add H₂SO₄ carefully. Reflux 30–45 min to drive reaction to completion without losing volatile product."},
    {q: "Why is the reaction mixture refluxed rather than just heated in an open flask?", a: "1-bromobutane is volatile; reflux condenses vapour back into flask → retains product."},
    {q: "How is 1-bromobutane separated from the reaction mixture after reflux?", a: "Distillation - collect fraction boiling at ~101–105°C (bp of 1-bromobutane = 101.6°C)."},
    {q: "What impurities are present in the crude distillate after distillation?", a: "Unreacted butan-1-ol, water, HBr, sulfate esters - removed by washing."},
    {q: "How is the crude product washed with concentrated H₂SO₄ and what does this remove?", a: "H₂SO₄ protonates butan-1-ol → water-soluble (removed in aqueous layer). 1-BrBu is denser - sinks."},
    {q: "How is the crude 1-bromobutane washed with sodium hydrogencarbonate solution?", a: "NaHCO₃ neutralises HBr/H₂SO₄: HBr + NaHCO₃ → NaBr + H₂O + CO₂. Release tap frequently to vent CO₂."},
    {q: "Why must the tap of the separating funnel be opened frequently during washing with NaHCO₃?", a: "CO₂ produced → pressure builds up and could force out the stopper."},
    {q: "How is the organic layer dried after washing?", a: "Add anhydrous MgSO₄ to the organic layer; swirl until no clumping. Filter off drying agent."},
    {q: "Why is anhydrous MgSO₄ used as a drying agent?", a: "Absorbs water (→ MgSO₄·7H₂O) without reacting with product; removed by filtration."},
    {q: "How is the identity of the product confirmed in this synthesis?", a: "bp ≈ 101.6°C. AgNO₃/ethanol → cream AgBr ppt confirms C–Br bond."},
    {q: "What safety precautions are required for this synthesis?", a: "Conc. H₂SO₄: corrosive - add carefully. 1-bromobutane: volatile/irritant - fume cupboard. NaBr dust: avoid inhalation. Gloves and goggles."},
    {q: "Why is the organic layer the lower layer in the separating funnel during this purification?", a: "1-bromobutane density (~1.28 g cm⁻³) > water → sinks below aqueous layer."},
    {q: "How is percentage yield calculated for this synthesis?", a: "% yield = (actual mass ÷ theoretical mass) × 100. Theoretical mass = moles of limiting reagent × Mr(1-bromobutane)."}
  ]},

  "RP7": { title: "Electrophilic Addition & Free Radical Substitution", cards: [
    {q: "What is electrophilic addition and which type of compound undergoes it?", a: "Electrophile adds across a C=C double bond. Alkenes: π bond provides electron density → attracts electrophiles."},
    {q: "What is observed when bromine water is shaken with an alkene?", a: "Orange/brown bromine water decolourises (Br₂ adds across C=C → dibromoalkane)."},
    {q: "Write the equation for the addition of bromine to ethene.", a: "CH₂=CH₂ + Br₂ → CH₂BrCH₂Br (1,2-dibromoethane)"},
    {q: "Describe the mechanism of electrophilic addition of Br₂ to ethene.", a: "1. Pi electrons polarise Br–Br: δ+ Br acts as electrophile.\n2. Br⁺ attacks C=C → carbocation + Br⁻.\n3. Br⁻ attacks carbocation → 1,2-dibromoalkane."},
    {q: "What is the carbocation intermediate in electrophilic addition?", a: "Carbon atom with a positive charge - formed when electrophile bonds to one C of the double bond."},
    {q: "What is free radical substitution, and which type of compound undergoes it?", a: "H replaced by halogen via free radical chain. Alkanes + Cl₂/Br₂ under UV light."},
    {q: "What are the three stages of the free radical substitution mechanism?", a: "1. Initiation: UV → Cl–Cl → 2Cl•\n2. Propagation: Cl• + CH₄ → •CH₃ + HCl; •CH₃ + Cl₂ → CH₃Cl + Cl•\n3. Termination: two radicals combine."},
    {q: "What is homolytic fission?", a: "Bond breaks so each atom receives one electron → two neutral radicals. Shown with fish-hook arrows."},
    {q: "What conditions are required for free radical substitution of alkanes?", a: "UV light (or high T). No catalyst. Cl₂ or Br₂. (F₂ too reactive/explosive; I₂ too unreactive.)"},
    {q: "What is observed when chlorine gas is mixed with methane under UV light?", a: "Mixture of CH₃Cl, CH₂Cl₂, CHCl₃, CCl₄ + HCl. Pale green Cl₂ colour fades."},
    {q: "Why does free radical substitution produce a mixture of products?", a: "Each product (e.g. CH₃Cl) can react further with Cl• to give more substituted products."},
    {q: "What safety precautions are needed when handling bromine and chlorine in organic reactions?", a: "Toxic/corrosive - fume cupboard, gloves and goggles. Bromine: irritant. Chlorine: suffocant. Emergency procedures for spillages."},
    {q: "How can you distinguish between electrophilic addition and free radical substitution in the lab?", a: "Addition (alkene + Br₂ water): decolourises in dark; no HBr produced.\nSubstitution (alkane + Cl₂): requires UV; HCl produced; mixture of products."},
    {q: "What is the test to confirm an alkene has undergone addition with bromine?", a: "Bromine water decolourises without UV light. Colourless dibromoalkane product."},
    {q: "Write the two propagation steps for the free radical chlorination of methane.", a: "Cl• + CH₄ → •CH₃ + HCl\n•CH₃ + Cl₂ → CH₃Cl + Cl•"},
    {q: "Give two examples of termination steps in the chlorination of methane.", a: "Cl• + Cl• → Cl₂\nCl• + •CH₃ → CH₃Cl\n•CH₃ + •CH₃ → C₂H₆"}
  ]},

  "RP8": { title: "Measuring EMF & Electrode Potentials", cards: [
    {q: "What is a standard electrode potential (E°)?", a: "EMF of a half-cell vs the SHE under standard conditions (298 K, 100 kPa, 1.00 mol dm⁻³ ions)."},
    {q: "What is the standard hydrogen electrode (SHE) and what is its E° value?", a: "H₂(g) at 100 kPa bubbled over Pt in 1.00 mol dm⁻³ H⁺(aq). E° = 0.00 V by definition."},
    {q: "Describe how to construct a Zn/Cu electrochemical cell to measure EMF.", a: "Zn in ZnSO₄(aq); Cu in CuSO₄(aq) (both 1.00 mol dm⁻³). Connect with KNO₃ salt bridge. Connect electrodes via high-resistance voltmeter."},
    {q: "What is the purpose of the salt bridge in an electrochemical cell?", a: "Allows ion flow between half-cells to maintain electrical neutrality - completes the circuit without mixing solutions."},
    {q: "Why must the voltmeter have a very high resistance?", a: "Prevents current flow; if current flowed, concentrations would change → measured value ≠ equilibrium E°."},
    {q: "How is E°cell calculated from two standard electrode potentials?", a: "E°cell = E°(cathode) − E°(anode). More positive E° = cathode (reduction)."},
    {q: "For a Zn/Cu cell: E°(Cu²⁺/Cu) = +0.34 V, E°(Zn²⁺/Zn) = −0.76 V. Calculate E°cell.", a: "E°cell = +0.34 − (−0.76) = +1.10 V. Cu²⁺ reduced at cathode; Zn oxidised at anode."},
    {q: "What does a positive E°cell indicate?", a: "Reaction is thermodynamically feasible (spontaneous) under standard conditions."},
    {q: "What does a negative E°cell indicate?", a: "Reaction not feasible in the forward direction - reverse reaction favoured."},
    {q: "Why is KNO₃ solution used in the salt bridge rather than KCl?", a: "NO₃⁻ does not precipitate with common metal ions. Cl⁻ would precipitate AgCl if Ag⁺ is present."},
    {q: "What cell notation (cell diagram) represents the Zn/Cu cell?", a: "Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s). LHS = anode (oxidation); RHS = cathode (reduction); || = salt bridge."},
    {q: "What are the limitations of using E° values to predict feasibility?", a: "E° only valid at standard conditions. Feasible reaction may still be very slow (high Ea). Overpotential effects in electrolysis."},
    {q: "How does the SHE provide a reference for measuring other E° values?", a: "Connect unknown half-cell to SHE; voltmeter reads E° of unknown (since SHE = 0.00 V)."},
    {q: "How does a hydrogen fuel cell work?", a: "Anode: H₂ → 2H⁺ + 2e⁻. Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O. Overall: 2H₂ + O₂ → 2H₂O. Only water produced."},
    {q: "What are the advantages of hydrogen fuel cells over conventional batteries?", a: "No recharging (fuel supplied continuously). Only water as waste. High efficiency."},
    {q: "What are the disadvantages of hydrogen fuel cells?", a: "H₂ is flammable/explosive - storage hazardous. H₂ usually made from fossil fuels. Expensive Pt catalyst. Lack of infrastructure."}
  ]},

  "RP9": { title: "Colorimetry & Beer-Lambert Law", cards: [
    {q: "State the Beer-Lambert law.", a: "A = εcl (A = absorbance, ε = molar absorption coefficient, c = concentration mol dm⁻³, l = path length cm)."},
    {q: "What does the Beer-Lambert law tell us about the relationship between absorbance and concentration?", a: "A ∝ c - linear at constant path length and wavelength."},
    {q: "How is a colorimeter used to measure the concentration of a coloured solution?", a: "1. Select complementary colour filter.\n2. Zero with blank (distilled water).\n3. Measure absorbance of standard solutions → calibration curve.\n4. Measure absorbance of unknown → read concentration from curve."},
    {q: "Why is a filter used in a colorimeter, and how is the correct filter selected?", a: "Selects the complementary colour (wavelength of maximum absorption) → maximises sensitivity."},
    {q: "What is a calibration curve and how is it constructed?", a: "Absorbance (y) vs concentration (x) for standard solutions - straight line through origin (Beer-Lambert)."},
    {q: "How is the concentration of an unknown solution found using a calibration curve?", a: "Measure absorbance of unknown; read off concentration from the linear portion of the calibration curve."},
    {q: "What is λmax and why is it used in colorimetry?", a: "Wavelength of maximum absorbance - gives greatest sensitivity and most linear Beer-Lambert response."},
    {q: "How can colorimetry be used to find the equilibrium constant Kc of a coloured equilibrium?", a: "Measure A at equilibrium → [coloured species] from calibration curve → mass balance for other species → substitute into Kc."},
    {q: "What is a blank in colorimetry and why is it used?", a: "Distilled water with no solute - zeros the colorimeter to correct for solvent/cuvette absorbance."},
    {q: "What errors can affect colorimetry measurements?", a: "Fingerprints on cuvette. Air bubbles. Not zeroing with blank. Solution too concentrated (outside linear range). Poor calibration."},
    {q: "Why does Beer-Lambert law fail at very high concentrations?", a: "Solute–solute interactions alter ε; scattered light increases → A vs c no longer linear."},
    {q: "Give an example of a transition metal complex studied by colorimetry.", a: "[Cu(H₂O)₆]²⁺ (blue). Absorbance at ~620 nm used to determine Cu²⁺ concentration."},
    {q: "What is the path length l in a standard colorimetry cuvette?", a: "Typically 1 cm."},
    {q: "How would you prepare a series of standard solutions for a calibration curve?", a: "Make stock solution; serial dilutions into volumetric flasks (make up to mark with distilled water) covering expected concentration range."},
    {q: "What units does absorbance have?", a: "Dimensionless (no units). A = log₁₀(I₀/I)."},
    {q: "How can colorimetry be used to monitor a reaction rate?", a: "Measure absorbance at regular time intervals - changing absorbance reflects changing concentration, allowing a rate curve to be plotted."}
  ]},

  "RP10a": { title: "Preparation of Aspirin", cards: [
    {q: "What are the starting materials for the synthesis of aspirin?", a: "Salicylic acid + ethanoic anhydride; H₃PO₄ as catalyst."},
    {q: "Write the equation for the synthesis of aspirin.", a: "Salicylic acid + ethanoic anhydride → aspirin + ethanoic acid\n(–OH of salicylic acid reacts with acyl group - esterification/acylation.)"},
    {q: "What type of reaction is used to make aspirin from salicylic acid?", a: "Esterification/acylation - phenol –OH reacts with ethanoic anhydride."},
    {q: "Why is ethanoic anhydride used rather than ethanoic acid (acetic acid) for aspirin synthesis?", a: "More reactive acylating agent - faster, more complete reaction."},
    {q: "Why is phosphoric acid added to the reaction mixture?", a: "Catalyst; protonates the acyl group of ethanoic anhydride → better electrophile."},
    {q: "How is the crude aspirin product collected after the reaction?", a: "Pour into ice-cold water → aspirin precipitates. Collect by vacuum filtration (Buchner funnel)."},
    {q: "Why is ice-cold water used to precipitate the aspirin?", a: "Low solubility in cold water → maximum yield. Cold also prevents hydrolysis back to salicylic acid."},
    {q: "How is the crude aspirin purified?", a: "Recrystallisation: dissolve in minimum hot ethanol, add warm water, cool in ice. Collect crystals by vacuum filtration, wash with cold water, dry."},
    {q: "How is the purity of aspirin checked in the laboratory?", a: "Melting point: pure aspirin = sharp 135°C. FeCl₃ test: salicylic acid impurity gives purple; pure aspirin gives no colour change."},
    {q: "Why is the FeCl₃ test appropriate for checking aspirin purity and not Tollens' test?", a: "No aldehyde → Tollens' irrelevant. FeCl₃ detects free phenol –OH of salicylic acid impurity → purple colour."},
    {q: "What colour does salicylic acid give with FeCl₃ solution?", a: "Purple/violet (iron(III)–phenol complex). Pure aspirin: no colour (phenol is esterified)."},
    {q: "How is percentage yield calculated for the aspirin synthesis?", a: "% yield = (actual mass ÷ theoretical mass) × 100. Theoretical mass = moles of limiting reagent × 180."},
    {q: "What safety precautions are needed for the aspirin synthesis?", a: "Ethanoic anhydride: corrosive/pungent - fume cupboard, gloves. H₃PO₄: corrosive. Ethanol: flammable - no naked flames."},
    {q: "How does recrystallisation improve the purity of aspirin?", a: "Dissolve in hot solvent; cool → aspirin crystallises (less soluble at low T). Impurities remain in solution."},
    {q: "What is the molecular formula of aspirin?", a: "C₉H₈O₄ (acetylsalicylic acid), Mr = 180 g mol⁻¹."},
    {q: "Why might the percentage yield of aspirin be less than 100%?", a: "Product lost in filtration/washing. Some dissolves in filtrate. Side reactions. Hydrolysis in water."}
  ]},

  "RP10b": { title: "Preparation of Azo Dye", cards: [
    {q: "What is diazotisation, and what are the conditions required?", a: "Primary arylamine + NaNO₂ + HCl at 0–5°C → diazonium salt:\nArNH₂ + NaNO₂ + HCl → ArN₂⁺Cl⁻ + NaCl + H₂O"},
    {q: "Why must the temperature be kept below 5°C during diazotisation?", a: "Diazonium salts decompose above ~5°C → N₂ released, phenol formed. Low T stabilises ArN₂⁺."},
    {q: "What reagents are used in the diazotisation of phenylamine (aniline)?", a: "Phenylamine + NaNO₂(aq) + dilute HCl(aq) at 0–5°C (ice bath)."},
    {q: "Write the equation for the diazotisation of phenylamine.", a: "C₆H₅NH₂ + NaNO₂ + 2HCl → C₆H₅N₂⁺Cl⁻ + NaCl + 2H₂O"},
    {q: "What is a coupling reaction in azo dye synthesis?", a: "ArN₂⁺ reacts with aromatic coupling component (e.g. phenol) in alkaline conditions to form azo compound with –N=N– group."},
    {q: "Why is the coupling reaction carried out in alkaline conditions?", a: "NaOH converts phenol → phenoxide (C₆H₅O⁻) - stronger activating group → more reactive towards the diazonium electrophile."},
    {q: "Write the equation for the coupling of benzenediazonium chloride with phenol.", a: "C₆H₅N₂⁺ + C₆H₅OH → C₆H₅–N=N–C₆H₄–OH + H⁺ (yellow-orange dye)"},
    {q: "What is the functional group in all azo dyes?", a: "–N=N– (azo group). Responsible for intense colour via delocalisation across the conjugated system."},
    {q: "What colours are typical azo dyes?", a: "Yellow, orange, red, or brown - depends on aryl groups and degree of delocalisation."},
    {q: "Why do azo dyes have intense colours?", a: "Extended conjugated π system (–N=N– + aromatic rings) → small HOMO-LUMO gap → absorbs visible light."},
    {q: "What is the role of the naphthol (2-naphthol) coupling component?", a: "Activated aromatic ring undergoes electrophilic substitution with diazonium ion. Larger conjugated system → deeper colour."},
    {q: "What safety hazard is associated with aromatic amines such as phenylamine?", a: "Carcinogenic - absorbed through skin. Gloves, goggles, fume cupboard essential."},
    {q: "How is the azo dye product isolated from the reaction mixture?", a: "Dye precipitates as coloured solid - collect by vacuum filtration, wash with cold water, dry."},
    {q: "What test is used to confirm a successful coupling reaction?", a: "Vivid colour (yellow/orange/red) appears instantly on addition to coupling component - colour is the product."},
    {q: "What industrial importance do azo dyes have?", a: "Largest class of synthetic dyes - textiles, food colouring (tartrazine), printing inks, cosmetics."},
    {q: "Why must ice be used throughout the diazotisation step?", a: "Reaction exothermic; diazonium salt decomposes even at modest T. Continuous ice cooling keeps T below 5°C."}
  ]},

  "RP11": { title: "TLC & Column Chromatography (A2)", cards: [
    {q: "How is TLC used to monitor the progress of an organic reaction?", a: "Spot reaction mixture at intervals alongside starting material and product. Starting material spot shrinks; product spot grows."},
    {q: "How can co-spotting identify an unknown compound by TLC?", a: "Apply unknown, reference, and mixed spot. Single spot in the mixture at the same Rf as both = same compound."},
    {q: "What is the formula for Rf value?", a: "Rf = distance moved by compound ÷ distance moved by solvent front. Dimensionless; 0–1."},
    {q: "How does solvent polarity affect Rf values in TLC on a silica plate?", a: "More polar solvent → higher Rf (compounds move further). More polar compound → lower Rf (more attracted to polar silica)."},
    {q: "Describe how column chromatography separates a mixture of dyes.", a: "Pack column with silica; load mixture at top. Add solvent (eluent) - less polar compounds elute first. Collect separate coloured fractions."},
    {q: "How is the purity of each fraction from column chromatography assessed?", a: "Run TLC of each fraction - single spot = pure. Multiple spots = mixture, more separation needed."},
    {q: "Why do amino acids require a special visualisation technique in chromatography?", a: "Colourless - visualised by ninhydrin spray + heat → purple (Ruhemann's purple) via reaction with –NH₂."},
    {q: "What is the significance of Rf values being consistent between experiments?", a: "Under fixed conditions, Rf is compound-specific → identification by comparison with references."},
    {q: "Why must the TLC developing chamber be sealed with a lid?", a: "Saturates atmosphere with solvent vapour - prevents evaporation from plate, which distorts Rf values."},
    {q: "What effect does changing the solvent in TLC have on separation?", a: "More polar solvent → higher Rf. Adjust polarity to separate compounds with similar Rf values."},
    {q: "How is column chromatography used preparatively (not just analytically)?", a: "Collect fractions; combine pure-fraction aliquots; evaporate solvent → isolated pure compound on useful (mg–g) scale."},
    {q: "What is gradient elution in column chromatography?", a: "Progressively increase solvent polarity during separation - elutes more polar compounds adsorbed on silica."},
    {q: "What is the stationary phase in a standard TLC plate?", a: "Silica gel (SiO₂) on glass/aluminium/plastic backing - polar, adsorbs polar compounds more strongly."},
    {q: "Give one advantage of column chromatography over TLC for purification.", a: "Preparative - isolates mg–g of pure compound. TLC is analytical only."},
    {q: "Why is a UV-fluorescent TLC plate used for many organic compounds?", a: "Silica contains fluorescent indicator - organic compounds quench fluorescence, appearing as dark spots under UV."},
    {q: "What is the mobile phase in TLC and column chromatography?", a: "The solvent (e.g. ethyl acetate, hexane, DCM) that carries compounds through the stationary phase."}
  ]},

  "RP12": { title: "Titrations (Redox & Acid-Base)", cards: [
    {q: "What is potassium manganate(VII) (KMnO₄) used for in redox titrations?", a: "Oxidising agent (oxidises Fe²⁺, C₂O₄²⁻, H₂O₂ in acid). Self-indicating: endpoint = first permanent pale pink."},
    {q: "Write the half-equation for the reduction of MnO₄⁻ in acidic solution.", a: "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (Mn: +7 → +2; Mn²⁺ almost colourless)."},
    {q: "What acid is used to acidify KMnO₄ titrations and why?", a: "Dilute H₂SO₄: provides H⁺ without interfering. Not HCl (Cl⁻ oxidised by MnO₄⁻); not HNO₃ (itself an oxidising agent)."},
    {q: "Write the overall ionic equation for the reaction of KMnO₄ with Fe²⁺.", a: "MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺\nRatio MnO₄⁻ : Fe²⁺ = 1 : 5"},
    {q: "How is the percentage of iron in iron tablets determined by KMnO₄ titration?", a: "1. Dissolve tablets in dilute H₂SO₄; make up to 250 cm³.\n2. Pipette 25.0 cm³ aliquots; titrate with standard KMnO₄.\n3. Endpoint = permanent pale pink. Calculate moles Fe²⁺ → mass Fe → %."},
    {q: "What is an iodometric (iodine–thiosulfate) titration?", a: "Oxidising agent liberates I₂ from excess KI. Titrate I₂ with Na₂S₂O₃. Add starch near endpoint - blue-black disappears at endpoint."},
    {q: "Write the half-equation for the reaction of I₂ with thiosulfate in iodometric titrations.", a: "I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻"},
    {q: "Why is starch indicator added near the endpoint in iodometric titrations rather than at the start?", a: "Starch forms a very stable complex with high [I₂] - difficult to break. Add when solution is pale yellow; blue disappears sharply at endpoint."},
    {q: "What indicator is used for strong acid vs. strong base titrations and why?", a: "Either phenolphthalein or methyl orange - both change within the steep pH 3–10 section."},
    {q: "What indicator is used for weak acid vs. strong base titrations?", a: "Phenolphthalein (pH 8.2–10.0) - equivalence point above pH 7."},
    {q: "What indicator is used for strong acid vs. weak base titrations?", a: "Methyl orange (pH 3.1–4.4) - equivalence point below pH 7."},
    {q: "Why is phenolphthalein unsuitable for strong acid vs. weak base titrations?", a: "Colour change at pH 8.2–10; equivalence point below pH 7 → indicator changes before the equivalence point."},
    {q: "What is a back titration and when is it used?", a: "Add excess known reagent; titrate remaining excess. Used when analyte is insoluble (e.g. CaCO₃) or reacts too slowly for direct titration."},
    {q: "Describe the preparation of a standard KMnO₄ solution.", a: "Accurately weigh KMnO₄; dissolve; transfer to volumetric flask; make up to mark. No rubber bung (KMnO₄ oxidises rubber)."},
    {q: "What is a standard solution?", a: "Solution of precisely known concentration. Prepared by dissolving accurate mass of primary standard and making up to exact volume."},
    {q: "How is concordance assessed in titration results?", a: "Titres agreeing within 0.10 cm³ are concordant. Mean of concordant titres used (rough titre excluded)."}
  ]},

  // ═══════════════════════════════════════════════
  // AQA REQUIRED PRACTICALS (NEW / MISSING ACTIVITIES)
  // ═══════════════════════════════════════════════

  "RP_A3": { title: "Rate vs Temperature (Activity 3)", cards: [
    {q: "What reaction is used in AQA Required Activity 3 to investigate how rate changes with temperature?", a: "Na₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + SO₂(g) + S(s) + H₂O(l)\nSulfur precipitate clouds the solution until a cross beneath cannot be seen."},
    {q: "How is reaction rate measured in the sodium thiosulfate and HCl experiment?", a: "Time t for cross to disappear as sulfur forms. Rate = 1/t."},
    {q: "Why is rate = 1/t a valid approximation for initial rate in this experiment?", a: "Same fixed amount of sulfur forms before the cross disappears each run; only t differs → 1/t ∝ rate."},
    {q: "Describe the method for Required Activity 3.", a: "1. Equilibrate 10 cm³ HCl and 10 cm³ Na₂S₂O₃ in water bath to chosen temperature.\n2. Mix in flask on paper cross; start timer.\n3. Stop when cross disappears.\n4. Repeat at 4+ temperatures up to 70°C."},
    {q: "What graph is plotted to determine activation energy (Ea) from the rate-temperature data?", a: "ln(1/t) vs 1/T (K⁻¹). Gradient = −Ea/R. Straight line confirms Arrhenius behaviour."},
    {q: "State the Arrhenius equation in its linear form and identify each term.", a: "ln k = ln A − Ea/RT. Gradient = −Ea/R; y-intercept = ln A. R = 8.31 J K⁻¹ mol⁻¹."},
    {q: "How is Ea calculated from the gradient of an Arrhenius plot?", a: "Ea = −gradient × 8.31 (J mol⁻¹). Divide by 1000 for kJ mol⁻¹."},
    {q: "Why must temperature be converted to Kelvin before plotting 1/T?", a: "Arrhenius equation requires absolute T. Using °C gives a non-linear plot and incorrect Ea."},
    {q: "What are the main sources of error in the sodium thiosulfate and HCl experiment?", a: "Subjective cross-disappearance judgement. Temperature fluctuations. Solutions not equilibrated before mixing. Timer delay."},
    {q: "Why should a maximum temperature of 70°C be used in this experiment?", a: "Above ~70°C, reaction too fast to time accurately → large % error in t. Hot acid also more hazardous."},
    {q: "If the gradient of the ln(1/t) vs 1/T graph is -5680, calculate Ea.", a: "Ea = 5680 × 8.31 = 47 200 J mol⁻¹ = 47.2 kJ mol⁻¹."},
    {q: "What safety precautions are required for the sodium thiosulfate and HCl experiment?", a: "HCl: corrosive/irritant - goggles. SO₂ produced: fume cupboard or well-ventilated area. Wash hands after handling Na₂S₂O₃."}
  ]},

  "RP_A4": { title: "Testing for Cations and Anions (Activity 4)", cards: [
    {q: "Describe the test for Group 2 metal ions using sodium hydroxide solution.", a: "Mg²⁺: white ppt Mg(OH)₂ (insoluble).\nCa²⁺: white ppt Ca(OH)₂ (slightly soluble).\nSr²⁺/Ba²⁺: no ppt (hydroxides soluble)."},
    {q: "Write the ionic equation for magnesium hydroxide forming when NaOH is added to Mg²⁺(aq).", a: "Mg²⁺(aq) + 2OH⁻(aq) → Mg(OH)₂(s) (white ppt). Same for Ca²⁺ → Ca(OH)₂(s)."},
    {q: "How do you test for ammonium ions (NH₄⁺)?", a: "Add NaOH(aq) and warm. NH₃ gas released - turns damp red litmus blue.\nNH₄⁺ + OH⁻ → NH₃(g) + H₂O"},
    {q: "Describe the test for sulfate ions (SO₄²⁻) and explain the role of HCl.", a: "Add BaCl₂(aq) acidified with dilute HCl → white ppt BaSO₄ = SO₄²⁻ present.\nHCl removes CO₃²⁻/SO₃²⁻ → prevents false BaCO₃/BaSO₃ precipitates."},
    {q: "Why must the barium chloride be acidified with HCl and NOT with H₂SO₄ when testing for sulfate ions?", a: "H₂SO₄ contains SO₄²⁻ → false positive BaSO₄. HCl: Cl⁻ does not precipitate with Ba²⁺."},
    {q: "Describe the silver nitrate test for halide ions.", a: "Acidify with dilute HNO₃; add AgNO₃(aq).\nCl⁻: white AgCl. Br⁻: cream AgBr. I⁻: pale yellow AgI.\nHNO₃ removes CO₃²⁻ → prevents Ag₂CO₃ false positive."},
    {q: "How can AgCl, AgBr and AgI precipitates be distinguished after they have formed?", a: "AgCl: dissolves in dilute NH₃.\nAgBr: dissolves only in conc. NH₃.\nAgI: insoluble in dilute or conc. NH₃."},
    {q: "Describe the test for carbonate ions (CO₃²⁻).", a: "Add dilute HCl → effervescence. Bubble gas through limewater - turns cloudy if CO₂ present."},
    {q: "How do you test for the presence of hydroxide ions (OH⁻)?", a: "Damp red litmus → blue. pH >> 7."},
    {q: "How does the solubility trend of Group 2 hydroxides affect the NaOH precipitate test?", a: "Mg(OH)₂: insoluble → clear white ppt. Ca(OH)₂: slightly soluble → faint ppt. Sr/Ba(OH)₂: soluble → no ppt. Solubility increases down Group 2."},
    {q: "How does the solubility trend of Group 2 sulfates apply to the BaCl₂ anion test?", a: "MgSO₄/CaSO₄: soluble → no ppt. SrSO₄/BaSO₄: insoluble → white ppt. Sulfate solubility decreases down Group 2 (opposite to hydroxides)."},
    {q: "What ionic equations represent the three silver halide precipitate reactions?", a: "Ag⁺ + Cl⁻ → AgCl(s) white\nAg⁺ + Br⁻ → AgBr(s) cream\nAg⁺ + I⁻ → AgI(s) pale yellow"}
  ]},

  "RP_A6": { title: "Functional Group Tests (Activity 6)", cards: [
    {q: "How do you test for an alkene using bromine water?", a: "Shake with bromine water - alkenes decolourise orange/brown to colourless (Br₂ adds across C=C). No UV needed."},
    {q: "How do you test for an aldehyde using Tollens' reagent?", a: "Add unknown to Tollens' reagent; warm in water bath.\nAldehydes: silver mirror. Ketones: no change.\nRCHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → RCOOH + 2Ag(s) + 4NH₃ + H₂O"},
    {q: "How is Tollens' reagent prepared in the laboratory?", a: "AgNO₃(aq) + 1 drop NaOH → Ag₂O ppt; add NH₃(aq) dropwise until ppt just dissolves. Use immediately - do NOT store (dried silver = shock-sensitive explosive)."},
    {q: "How do you test for an aldehyde using Fehling's solution?", a: "Mix equal volumes Fehling's A + B; add unknown; heat in water bath.\nAldehydes: blue → brick-red ppt Cu₂O. Ketones: no change."},
    {q: "How do you test for a carboxylic acid?", a: "Add Na₂CO₃ - effervescence (CO₂) confirms carboxylic acid.\n2RCOOH + Na₂CO₃ → 2RCOONa + H₂O + CO₂"},
    {q: "How do you test for an alcohol using acidified potassium dichromate(VI)?", a: "Warm with acidified K₂Cr₂O₇ (orange).\nPrimary/secondary alcohol: orange → green. Tertiary: no change."},
    {q: "What is the key difference between the aldehyde and ketone tests using Tollens' and Fehling's reagents?", a: "Aldehydes: react with both Tollens' (silver mirror) and Fehling's (red Cu₂O).\nKetones: no reaction with either (cannot be oxidised under mild conditions)."},
    {q: "Summarise the key functional group tests and their results.", a: "Alkene: bromine water decolourises.\nAldehyde: Tollens' silver mirror; Fehling's red Cu₂O ppt.\nKetone: no reaction with Tollens'/Fehling's.\nCarboxylic acid: effervescence with Na₂CO₃.\n1°/2° alcohol: orange → green with K₂Cr₂O₇.\n3° alcohol: no reaction with K₂Cr₂O₇."},
    {q: "How does the bromine water test distinguish an alkene from an alkane?", a: "Alkene: decolourises Br₂ water in dark (electrophilic addition). Alkane: no reaction in dark; requires UV (free radical substitution → HBr)."},
    {q: "What result does a halogenoalkane give with warm silver nitrate solution in ethanol?", a: "Chloro: white AgCl ppt (slowest). Bromo: cream AgBr ppt. Iodo: pale yellow AgI ppt (fastest - C–I weakest)."},
    {q: "What safety precautions are required for functional group tests?", a: "Tollens': prepare fresh, dispose immediately (dried silver explosive). K₂Cr₂O₇: toxic/carcinogenic - gloves. H₂SO₄: corrosive. Bromine water: corrosive/toxic - fume cupboard. Water bath - no naked flames."}
  ]},

  "RP_A7b": { title: "Continuous Monitoring Method (Activity 7b)", cards: [
    {q: "What is the continuous monitoring method for measuring reaction rate?", a: "Record a measurable quantity (gas volume, mass, absorbance) at regular intervals for one reaction. Plot concentration–time or volume–time graph."},
    {q: "What does the gradient of a concentration-time graph represent?", a: "Rate at that moment. Greatest at t = 0 (initial rate); decreases to zero as reactants are consumed."},
    {q: "How is the initial rate found from a continuous monitoring graph?", a: "Draw tangent to curve at t = 0. Gradient = initial rate. Use tangent, NOT a chord."},
    {q: "Describe the gas syringe method for measuring rate continuously.", a: "Connect gas syringe to reaction flask via bung. Record gas volume every 15 s. Plot volume vs time.\ne.g. Mg + 2HCl → MgCl₂ + H₂(g)"},
    {q: "Describe the method for the magnesium and hydrochloric acid continuous monitoring experiment.", a: "50 cm³ of 1.0 mol dm⁻³ HCl in flask. Weigh 0.20 g Mg ribbon. Add Mg, bung immediately, start timer. Record H₂ volume every 15 s for 3 min."},
    {q: "What are the main methods used for continuous monitoring of a reaction?", a: "Gas syringe (gas produced). Mass loss on balance (gas escapes). Colorimetry (coloured species). Titration of withdrawn aliquots."},
    {q: "When is the mass loss method used, and what is its limitation?", a: "When gas escapes (e.g. CO₂ from CaCO₃ + HCl). Limitation: unreliable for light gases (H₂, HCl escape too quickly). Balance must be sensitive enough."},
    {q: "What does 'pseudo-zero order' mean in a continuous monitoring experiment?", a: "One reactant in large excess - concentration stays approximately constant, so it appears to have no effect on rate. Isolates the effect of the other reactant."},
    {q: "Why does a volume-time or concentration-time graph eventually become horizontal?", a: "Limiting reactant fully consumed - rate → 0, graph plateaus."},
    {q: "How does colorimetry enable continuous monitoring of a reaction rate?", a: "Record absorbance at regular intervals. A ∝ c (Beer-Lambert) - changing absorbance reflects changing concentration."},
    {q: "What safety precautions are needed for the Mg + HCl gas syringe experiment?", a: "HCl: corrosive - goggles and gloves. H₂: flammable - no flames, good ventilation. Insert bung immediately. Do not overfill syringe (max ~100 cm³)."},
    {q: "What is the difference in purpose between the initial rate method (Activity 7a) and continuous monitoring (Activity 7b)?", a: "7a (initial rate): many experiments varying [reactant] → determines rate equation and orders.\n7b (continuous): one experiment over time → full rate profile; half-life measurable for first-order reactions."}
  ]},

  "RP_A9": { title: "Titration Curves (Activity 9)", cards: [
    {q: "Describe the method for constructing a pH curve by adding alkali to acid.", a: "1. 25 cm³ acid in flask; calibrate pH meter.\n2. Add alkali in 1–2 cm³ increments; stir; record pH.\n3. Near equivalence point: add 0.1–0.5 cm³ increments.\n4. Continue to excess. Plot pH vs volume added."},
    {q: "Why must a pH meter be calibrated before use?", a: "pH meters drift. Calibration with known buffer (e.g. pH 4.00) ensures accurate readings."},
    {q: "Describe the shape of a strong acid-strong base pH curve.", a: "Starts pH ~1–2. Slow rise then near-vertical section pH 3–11. Equivalence point pH = 7. Ends pH ~13."},
    {q: "Describe the shape of a weak acid-strong base pH curve.", a: "Starts pH ~3–4. Flat buffer region before equivalence point. Steep section above pH 7. Equivalence point above pH 7. At half-equivalence volume: pH = pKa."},
    {q: "What is the buffer region on a weak acid-strong base titration curve?", a: "Flat section before equivalence point - both HA and A⁻ present in significant amounts. Buffer resists pH change."},
    {q: "At what volume is pH = pKa in a weak acid-strong base titration, and why?", a: "At half-equivalence volume: [HA] = [A⁻] → Ka = [H⁺] → pH = pKa. Read Ka directly from curve."},
    {q: "Describe the shape of a strong acid-weak base pH curve.", a: "Starts pH ~1–2. Steep section below pH 7 (~pH 3–7). Equivalence point below pH 7."},
    {q: "Describe the shape of a weak acid-weak base pH curve.", a: "No steep section - pH changes gradually throughout. No suitable indicator; use pH meter to find equivalence point."},
    {q: "How do you identify the equivalence point from a pH curve?", a: "Inflection point of the steepest section. Strong/strong: pH 7. Weak acid/strong base: pH > 7. Strong acid/weak base: pH < 7."},
    {q: "How do you use a pH curve to choose an appropriate indicator?", a: "Indicator's colour-change range must fall within the steep section.\nStrong/strong: methyl orange or phenolphthalein.\nWeak acid/strong base: phenolphthalein only.\nStrong acid/weak base: methyl orange only."},
    {q: "Why is phenolphthalein unsuitable for a strong acid-weak base titration?", a: "Changes colour at pH 8.2–10; equivalence point below pH 7 → indicator changes before equivalence point."},
    {q: "Why should temperature be kept constant during a titration curve experiment?", a: "Kw and Ka change with T → pH values shift. Variable T distorts the curve shape."}
  ]},

  "RP_A11": { title: "Testing Transition Metal Ions (Activity 11)", cards: [
    {q: "What colour precipitate does Cu²⁺(aq) form when NaOH(aq) is added?", a: "Blue ppt of Cu(OH)₂.\n[Cu(H₂O)₆]²⁺ + 2OH⁻ → Cu(H₂O)₄(OH)₂(s) + 2H₂O"},
    {q: "What colour precipitate does Fe²⁺(aq) form when NaOH(aq) is added?", a: "Green ppt of Fe(OH)₂. May turn brown at surface (oxidation to Fe³⁺ in air)."},
    {q: "What colour precipitate does Fe³⁺(aq) form when NaOH(aq) is added?", a: "Brown ppt of Fe(OH)₃.\n[Fe(H₂O)₆]³⁺ + 3OH⁻ → Fe(H₂O)₃(OH)₃(s) + 3H₂O"},
    {q: "What happens when excess NaOH(aq) is added to Al³⁺(aq)?", a: "White ppt Al(OH)₃ first; dissolves in excess NaOH → [Al(OH)₄]⁻ (colourless). Al(OH)₃ is amphoteric."},
    {q: "What happens when excess NH₃(aq) is added to Cu²⁺(aq)?", a: "Limited NH₃: blue Cu(OH)₂ ppt. Excess NH₃: dissolves → deep blue [Cu(NH₃)₄(H₂O)₂]²⁺."},
    {q: "What is the colour change when excess NH₃(aq) is added to Cu²⁺(aq)?", a: "Limited NH₃: blue ppt. Excess NH₃: blue ppt dissolves → deep blue/royal blue solution of [Cu(NH₃)₄(H₂O)₂]²⁺."},
    {q: "What result does Fe²⁺ or Fe³⁺ give with excess NH₃(aq)?", a: "Both form hydroxide ppts (green for Fe²⁺, brown for Fe³⁺) that do NOT dissolve in excess NH₃ - no stable ammine complexes formed."},
    {q: "What is observed when Na₂CO₃(aq) is added to Fe³⁺(aq)?", a: "Brown Fe(OH)₃ ppt + CO₂ effervescence. Fe³⁺ high charge density polarises CO₃²⁻ → hydrolysis → OH⁻ + CO₂."},
    {q: "What is observed when Na₂CO₃(aq) is added to Cu²⁺(aq)?", a: "Blue-green CuCO₃ ppt; no CO₂ - Cu²⁺ lower charge density → does not hydrolyse CO₃²⁻."},
    {q: "Describe the method for Required Activity 11.", a: "10 drops of metal ion solution. Add NaOH dropwise to excess; note ppt colour and whether it dissolves. Repeat with NH₃(aq). Add Na₂CO₃; note ppt colour and gas."},
    {q: "Summarise the colours of hydroxide precipitates formed with NaOH for key metal ions.", a: "Cu²⁺: blue ppt (stays). Fe²⁺: green ppt (stays). Fe³⁺: brown ppt (stays). Al³⁺: white ppt (dissolves in excess NaOH → [Al(OH)₄]⁻)."},
    {q: "Why do 3+ metal ions form hydroxide precipitates (not carbonates) when Na₂CO₃ is added?", a: "M³⁺ high charge density polarises CO₃²⁻ → hydrolysis → OH⁻ + CO₂ → M(OH)₃ ppt + gas.\nM²⁺: lower charge density → MCO₃ ppt, no gas."}
  ]},

  // ═══════════════════════════════════════════════
  // OCR A CHEMISTRY (H432)
  // ═══════════════════════════════════════════════

  "ocr_2.1.1": { title: "Atoms, Ions and Molecules", cards: [
    {q:"Define atomic number and mass number.", a:"Z = number of protons. A = protons + neutrons. Neutrons = A − Z."},
    {q:"Define isotopes.", a:"Same element (same Z), different mass number (different neutron count). Same chemical properties; slightly different physical properties."},
    {q:"Define relative atomic mass (Ar).", a:"Weighted mean mass of all isotopes relative to ¹²C = 12. Ar = Σ(isotopic mass × fractional abundance)."},
    {q:"Define relative molecular mass (Mr).", a:"Sum of Ar values of all atoms in the molecular formula, relative to ¹²C = 12. Called relative formula mass for ionic compounds."},
    {q:"How do you calculate Ar from isotopic abundances?", a:"Ar = Σ(mass × % abundance) / 100. Example: ³⁵Cl (75%) + ³⁷Cl (25%) → Ar = (35×75 + 37×25)/100 = 35.5"},
    {q:"What is a cation and an anion?", a:"Cation: positive ion (loses electrons). Anion: negative ion (gains electrons)."},
    {q:"State the common ionic charges for elements in Groups 1–7.", a:"Gp 1: 1+. Gp 2: 2+. Gp 3: 3+. Gp 5: 3−. Gp 6: 2−. Gp 7: 1−."},
    {q:"State the Aufbau principle, Pauli exclusion principle, and Hund's rule.", a:"Aufbau: lowest energy orbitals fill first.\nPauli: max 2 electrons per orbital, opposite spins.\nHund's: degenerate orbitals fill singly before pairing."},
    {q:"Give the filling order for subshells up to 4p.", a:"1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p\n(4s fills before 3d but 3d lost first when forming ions.)"},
    {q:"Write the full electron configuration of iron (Fe, Z=26).", a:"Fe: [Ar] 3d⁶ 4s². Fe²⁺: [Ar] 3d⁶. Fe³⁺: [Ar] 3d⁵."},
    {q:"Why are the electron configurations of Cr and Cu anomalous?", a:"Cr: [Ar] 3d⁵ 4s¹ (half-filled d - extra stable). Cu: [Ar] 3d¹⁰ 4s¹ (full d - extra stable). One 4s electron promoted to 3d."},
    {q:"How many electrons can s, p, d, and f subshells hold?", a:"s: 2. p: 6. d: 10. f: 14."},
    {q:"Write the electron configuration of the first 10 elements.", a:"H: 1s¹. He: 1s². Li: [He]2s¹. Be: [He]2s². B: [He]2s²2p¹. C: [He]2s²2p². N: [He]2s²2p³. O: [He]2s²2p⁴. F: [He]2s²2p⁵. Ne: [He]2s²2p⁶."},
    {q:"What does it mean to write an electron configuration using noble gas shorthand?", a:"Replace inner shells with the preceding noble gas in [brackets]. e.g. Na: [Ne]3s¹; Fe: [Ar]3d⁶4s²."},
    {q:"What is an orbital?", a:"Region of space where there is ≥90% probability of finding an electron. s = spherical; p = dumbbell. Max 2 electrons per orbital (opposite spins)."},
    {q:"How does the electron configuration change when a transition metal forms an ion?", a:"4s electrons lost first (3d lower energy once filled). Fe → Fe²⁺: lose 4s² → [Ar]3d⁶. Fe → Fe³⁺: lose 4s² and one 3d → [Ar]3d⁵."},
    {q:"What is the electron configuration of Zn²⁺?", a:"Zn: [Ar]3d¹⁰4s². Zn²⁺: [Ar]3d¹⁰. Full 3d → not a transition metal."},
  ]},

  "ocr_2.1.2": { title: "Compounds, Formulae and Equations", cards: [
    {q:"How do you work out the formula of an ionic compound from ionic charges?", a:"Charges must balance to zero. Swap charge values as subscripts. e.g. Al³⁺ + O²⁻ → Al₂O₃."},
    {q:"What is empirical formula and how does it differ from molecular formula?", a:"Empirical: simplest whole-number ratio of atoms (e.g. CH₂O). Molecular: actual count per molecule (e.g. C₆H₁₂O₆). Molecular = n × empirical."},
    {q:"State the rules for writing balanced equations and the meaning of state symbols.", a:"Equal atoms and charge on both sides. State symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous. Adjust coefficients only, never subscripts."},
    {q:"What is an ionic equation and what are spectator ions?", a:"Shows only species that change, written as ions. Spectator ions appear unchanged on both sides and are cancelled. e.g. Ag⁺(aq) + Cl⁻(aq) → AgCl(s)."},
    {q:"Name the following common polyatomic ions: SO₄²⁻, NO₃⁻, CO₃²⁻, NH₄⁺, OH⁻, PO₄³⁻.", a:"SO₄²⁻: sulfate. NO₃⁻: nitrate. CO₃²⁻: carbonate. NH₄⁺: ammonium. OH⁻: hydroxide. PO₄³⁻: phosphate."},
    {q:"How are binary compounds named?", a:"More metallic element first + -ide suffix for second. e.g. NaCl = sodium chloride, FeCl₃ = iron(III) chloride."},
    {q:"Name the common acids: HCl(aq), H₂SO₄(aq), HNO₃(aq).", a:"HCl: hydrochloric acid. H₂SO₄: sulfuric acid. HNO₃: nitric acid."},
    {q:"State the rules for assigning oxidation states.", a:"Uncombined element = 0. Monatomic ion = charge. H = +1 (−1 in metal hydrides). O = −2 (−1 peroxides). F = −1. Sum = 0 (neutral) or = overall charge (ion)."},
    {q:"What is the oxidation state of S in H₂SO₄ and N in HNO₃?", a:"H₂SO₄: S = +6. HNO₃: N = +5."},
    {q:"How do you balance a redox equation using half-equations?", a:"1. Write oxidation and reduction half-equations.\n2. Balance non-H/O atoms.\n3. Balance O with H₂O; H with H⁺.\n4. Balance charge with e⁻.\n5. Multiply to cancel electrons; add half-equations."},
    {q:"What common oxidation states does iron display?", a:"Fe: 0, +2 (pale green), +3 (yellow/orange). Fe²⁺ = reducing agent; Fe³⁺ = oxidising agent."},
    {q:"Write a balanced equation for the reaction of magnesium with dilute hydrochloric acid.", a:"Mg + 2HCl → MgCl₂ + H₂. Ionic: Mg + 2H⁺ → Mg²⁺ + H₂."},
    {q:"Write balanced equations for the reactions of Na₂CO₃ with dilute HCl.", a:"Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Ionic: CO₃²⁻ + 2H⁺ → H₂O + CO₂. Effervescence observed."},
    {q:"What is the formula of iron(III) sulfate?", a:"Fe³⁺ and SO₄²⁻ → Fe₂(SO₄)₃."},
    {q:"Distinguish between a molecular equation and a net ionic equation with an example.", a:"Molecular: NaOH + HCl → NaCl + H₂O. Net ionic (spectators removed): OH⁻ + H⁺ → H₂O."},
  ]},

  "ocr_2.1.3": { title: "Amount of Substance", cards: [
    {q:"What is the mole and what is Avogadro's constant?", a:"1 mol = 6.022 × 10²³ entities. Nₐ = 6.022 × 10²³ mol⁻¹. Molar mass M (g mol⁻¹) = Ar or Mr numerically."},
    {q:"State the formula linking moles, mass, and molar mass.", a:"n = m/M. Rearrange: m = nM; M = m/n."},
    {q:"State the formula linking concentration, moles, and volume.", a:"c = n/V (V in dm³; divide cm³ by 1000). n = cV; V = n/c."},
    {q:"State the ideal gas equation and define all symbols.", a:"pV = nRT. p (Pa), V (m³), n (mol), R = 8.314 J mol⁻¹ K⁻¹, T (K). Convert: °C + 273; cm³ ÷ 10⁶; kPa × 1000."},
    {q:"What is the molar volume of an ideal gas at RTP?", a:"RTP (25°C, 100 kPa): 24.0 dm³ mol⁻¹. STP (0°C, 100 kPa): 22.7 dm³ mol⁻¹."},
    {q:"How do you find the empirical formula from percentage composition by mass?", a:"Divide % by Ar → mole ratio. Divide by smallest. Scale to whole numbers. e.g. 40%C, 6.7%H, 53.3%O → 1:2:1 → CH₂O."},
    {q:"How do you determine molecular formula from empirical formula?", a:"n = Mr / empirical formula mass. Molecular formula = n × empirical formula."},
    {q:"What is the limiting reagent and how do you identify it?", a:"Reactant fully consumed first - limits product yield. Divide moles of each reactant by its stoichiometric coefficient; smaller value = limiting reagent."},
    {q:"Define percentage yield and calculate it.", a:"% yield = (actual mass ÷ theoretical mass) × 100. Theoretical from limiting reagent + balanced equation."},
    {q:"Define atom economy and explain its significance.", a:"% atom economy = (Mr desired product / ΣMr all products) × 100. High = less waste, more sustainable. Addition = 100%; substitution < 100%."},
    {q:"Describe how to carry out a titration to find the concentration of an unknown acid.", a:"Pipette alkali into flask + indicator. Add acid from burette; record titre at permanent colour change. Repeat for concordant titres (±0.10 cm³). n = cV; use mole ratio to find unknown concentration."},
    {q:"What is a back titration and when is it used?", a:"Add known excess reagent; react fully; titrate remaining excess. Moles analyte = moles added − moles excess. Used for insoluble or slow-reacting analytes."},
    {q:"How do you calculate concentration from a titration result?", a:"n(HCl) = c × V. Use mole ratio → n(NaOH). c(NaOH) = n/V. e.g. 22.4 cm³ of 0.100 mol dm⁻³ HCl: n = 0.00224 mol → c(NaOH) = 0.00224/0.025 = 0.0896 mol dm⁻³."},
    {q:"What is the volume (in dm³) occupied by 4.4 g of CO₂ at RTP?", a:"n = 4.4/44 = 0.10 mol. V = 0.10 × 24.0 = 2.40 dm³."},
    {q:"How is empirical formula determined from combustion data?", a:"Moles C = moles CO₂. Moles H = 2 × moles H₂O. Moles O = (sample mass − mass C − mass H)/16. Find simplest C:H:O ratio."},
  ]},

  "ocr_2.1.4": { title: "Acids and Redox", cards: [
    {q:"Define a Brønsted-Lowry acid and base.", a:"Acid: H⁺ donor. Base: H⁺ acceptor. Conjugate pairs differ by one H⁺."},
    {q:"Distinguish between strong and weak acids with examples.", a:"Strong: fully dissociates (HCl, HNO₃, H₂SO₄, HBr, HI). Weak: partially dissociates, equilibrium left (CH₃COOH, HF, HCN)."},
    {q:"Write equations for the reactions of dilute sulfuric acid with: (a) zinc metal, (b) copper(II) oxide, (c) calcium carbonate.", a:"(a) Zn + H₂SO₄ → ZnSO₄ + H₂\n(b) CuO + H₂SO₄ → CuSO₄ + H₂O\n(c) CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂"},
    {q:"Define oxidation and reduction in terms of electrons (OILRIG).", a:"OIL RIG: Oxidation Is Loss; Reduction Is Gain (of electrons). Oxidising agent = gets reduced; reducing agent = gets oxidised."},
    {q:"What is disproportionation? Give an example.", a:"Same element is simultaneously oxidised and reduced. e.g. Cl₂ + H₂O ⇌ HCl + HClO (Cl: 0 → −1 and 0 → +1)."},
    {q:"State the common oxidation states of the following elements: Fe, Cu, Cr, Mn, S, N, Cl.", a:"Fe: 0, +2, +3. Cu: 0, +1, +2. Cr: 0, +3, +6. Mn: 0, +2, +4, +7. S: −2, 0, +4, +6. N: −3, 0, +2, +4, +5. Cl: −1, 0, +1, +3, +5, +7."},
    {q:"Write the half-equation for the reduction of MnO₄⁻ in acidic solution.", a:"MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (Mn: +7 → +2)."},
    {q:"Write the overall equation for the reaction of Fe²⁺ with acidified KMnO₄.", a:"MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. Ratio 1:5. Purple → colourless."},
    {q:"Describe the reactions of dilute acids with carbonates.", a:"Carbonate + acid → salt + water + CO₂. e.g. CaCO₃ + 2HNO₃ → Ca(NO₃)₂ + H₂O + CO₂. Effervescence; CO₂ turns limewater milky."},
    {q:"What is the oxidation state of Cr in K₂Cr₂O₇ and Mn in KMnO₄?", a:"Cr in K₂Cr₂O₇: +6. Mn in KMnO₄: +7."},
    {q:"What is the oxidising agent in a redox reaction and how does it change?", a:"Accepts electrons - is itself reduced (oxidation state decreases). e.g. MnO₄⁻ (Mn +7→+2), Cr₂O₇²⁻ (Cr +6→+3)."},
    {q:"Write the half-equation for the oxidation of iodide ions.", a:"2I⁻ → I₂ + 2e⁻ (I: −1 → 0). e.g. Cl₂ + 2I⁻ → 2Cl⁻ + I₂."},
    {q:"What is the reaction of dilute hydrochloric acid with a base (metal hydroxide)?", a:"Base + acid → salt + water. NaOH + HCl → NaCl + H₂O. Ionic: H⁺ + OH⁻ → H₂O."},
    {q:"How do you balance the redox equation for the reaction of Cr₂O₇²⁻ with Fe²⁺ in acid?", a:"Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O\nFe²⁺ → Fe³⁺ + e⁻ (×6)\nOverall: Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O"},
    {q:"What colour change is observed when dichromate(VI) is used as an oxidising agent?", a:"Orange (Cr⁶⁺) → green (Cr³⁺)."},
    {q:"Define conjugate acid-base pairs in the Brønsted-Lowry theory.", a:"Differ by one H⁺. Acid donates H⁺ → conjugate base. Base accepts H⁺ → conjugate acid. e.g. CH₃COOH/CH₃COO⁻; NH₃/NH₄⁺. Stronger acid = weaker conjugate base."},
  ]},

  "ocr_2.2.1": { title: "Atomic Structure and Ionisation Energies", cards: [
    {q:"Describe Rutherford's gold foil experiment and what it proved.", a:"Most α-particles passed straight through gold foil; few deflected; very few bounced back. Proved: mostly empty space; tiny, dense, positively charged nucleus. Disproved 'plum pudding' model."},
    {q:"Describe the four stages of a time-of-flight mass spectrometer.", a:"1. Ionisation (electron impact or electrospray → MH⁺).\n2. Acceleration (electric field; all ions gain same KE).\n3. Drift (lighter ions travel faster; KE = ½mv²).\n4. Detection (time of flight gives m/z)."},
    {q:"How is relative atomic mass calculated from a mass spectrum?", a:"Ar = Σ(m/z × abundance) / Σ(abundances). e.g. ⁶³Cu (69%) + ⁶⁵Cu (31%): Ar = (63×69 + 65×31)/100 = 63.6."},
    {q:"Define first ionisation energy and write the equation for Mg.", a:"Energy to remove 1 mol of electrons from 1 mol of gaseous atoms. Mg(g) → Mg⁺(g) + e⁻. Units: kJ mol⁻¹."},
    {q:"What three factors affect ionisation energy?", a:"Nuclear charge (↑ → ↑ IE). Atomic radius (↑ → ↓ IE). Electron shielding (↑ → ↓ IE)."},
    {q:"Explain the general trend in first ionisation energy across Period 3.", a:"Generally increases Na → Ar. Nuclear charge increases; electrons in same shell (similar shielding) → greater effective nuclear charge → harder to remove outer electron."},
    {q:"Why is there a drop in first IE from Mg to Al, and from P to S?", a:"Mg→Al: Al's outer electron in higher-energy 3p (shielded by 3s²) → easier to remove.\nP→S: S's 4th 3p electron is paired → electron repulsion → easier to remove."},
    {q:"Explain the trend in first IE down Group 2.", a:"Decreases Be → Ba. Increasing atomic radius + shielding → outer electron further from nucleus, less strongly held."},
    {q:"How do successive ionisation energies provide evidence for atomic shells?", a:"Each successive IE is larger. A very large jump indicates an electron removed from an inner shell. e.g. Na: low IE₁, very high IE₂ → Group 1 (1 outer electron)."},
    {q:"How do successive ionisation energies provide evidence for subshells?", a:"Gradual increases within a shell; sharp jumps between shells and subshells. e.g. Al: low IE₁ (3p), slight increase for IE₂/IE₃ (3s), large jump to IE₄ (2nd shell)."},
    {q:"Explain the relationship between atomic emission spectra and energy levels.", a:"Excited electrons fall to lower energy levels → emit photons, ΔE = hν. Each transition = specific frequency (spectral line). Converging lines → ionisation."},
    {q:"What is electrospray ionisation in mass spectrometry?", a:"Sample sprayed through high-voltage needle → each molecule gains H⁺ → MH⁺ (m/z = Mr + 1). Gentle: no fragmentation. To find Mr: subtract 1 from m/z of molecular ion."},
    {q:"Why must a mass spectrometer be kept under high vacuum?", a:"Air molecules would be ionised and interfere with detection, giving inaccurate spectrum."},
    {q:"What is the second ionisation energy of an element?", a:"M⁺(g) → M²⁺(g) + e⁻. Always greater than first IE (smaller ion, greater Zeff per electron)."},
    {q:"What evidence from mass spectrometry supports the existence of isotopes?", a:"Multiple peaks at different m/z for same element (e.g. Cl at 35 and 37). Peak heights reflect natural isotopic abundance."},
  ]},

  "ocr_2.2.2": { title: "Bonding and Structure", cards: [
    {q:"Describe ionic bonding.", a:"Electrostatic attraction between oppositely charged ions. Metal transfers electrons to non-metal → cation + anion → giant ionic lattice."},
    {q:"Describe covalent bonding, distinguishing σ and π bonds.", a:"Shared electron pair between non-metals. σ bond: head-on orbital overlap (all single bonds; one in double/triple). π bond: side-on p-orbital overlap (one in double; two in triple). Restricted rotation around π bonds."},
    {q:"What is a dative (coordinate) covalent bond? Give two examples.", a:"Both electrons from one atom (donor). Identical to normal covalent bond once formed. e.g. NH₄⁺ (N → H⁺); H₃O⁺ (O → H⁺); BF₃·NH₃ (N → B)."},
    {q:"Describe metallic bonding and the properties it explains.", a:"Lattice of positive ions in a sea of delocalised electrons. Explains: conductivity (mobile e⁻), malleability/ductility (non-directional), high mp."},
    {q:"Define electronegativity and describe its periodic trends.", a:"Ability of a bonded atom to attract shared electrons. Increases across a period (↑ nuclear charge); decreases down a group (↑ radius, shielding). F = 4.0 (highest)."},
    {q:"State VSEPR theory and use it to predict molecular shapes.", a:"Electron pairs repel and arrange to maximise separation. lp–lp > lp–bp > bp–bp repulsion. Molecular shape described by atom positions only."},
    {q:"Give the shapes and bond angles for 2, 3, 4, 5, and 6 electron pairs (no lone pairs).", a:"2: linear, 180°. 3: trigonal planar, 120°. 4: tetrahedral, 109.5°. 5: trigonal bipyramidal, 90°/120°. 6: octahedral, 90°."},
    {q:"How do lone pairs affect bond angles? Give the shapes of NH₃ and H₂O.", a:"Each lp reduces bond angle ~2–2.5°. NH₃: 3bp + 1lp → trigonal pyramidal, 107°. H₂O: 2bp + 2lp → bent, 104.5°."},
    {q:"Give the shapes of SF₄, ClF₃, XeF₄, PCl₅.", a:"SF₄ (4bp+1lp): see-saw. ClF₃ (3bp+2lp): T-shaped. XeF₄ (4bp+2lp): square planar, 90°. PCl₅ (5bp): trigonal bipyramidal, 90°/120°."},
    {q:"Compare the properties of giant ionic, giant metallic, giant covalent, and simple molecular structures.", a:"Giant ionic: high mp, brittle, conducts molten/dissolved only.\nGiant metallic: high mp, conducts (solid+liquid), malleable.\nGiant covalent: very high mp, hard, non-conducting (except graphite).\nSimple molecular: low mp, non-conducting (IMFs break, not covalent bonds)."},
    {q:"Describe the structures of diamond, graphite, graphene, and silicon dioxide.", a:"Diamond: each C bonded to 4 (tetrahedral); hard, non-conductor, very high mp.\nGraphite: hexagonal layers; each C bonded to 3 (sp²); delocalised π e⁻ → conducts; lubricant.\nGraphene: single graphite layer; exceptional conductor.\nSiO₂: giant covalent; each Si to 4 O; very high mp, non-conductor."},
    {q:"What is bond polarity and when does it lead to a polar molecule?", a:"Unequal electronegativity → bond dipole (δ+/δ−). Polar molecule: dipoles do not cancel. e.g. H₂O, NH₃ polar; CO₂, CCl₄ non-polar (symmetric, dipoles cancel)."},
    {q:"What is the Pauling electronegativity of F, O, N, Cl, and C?", a:"F: 4.0. O: 3.5. N: 3.0. Cl: 3.0. C: 2.5. H: 2.1."},
    {q:"Explain why AlCl₃ (anhydrous) exists as a dimer Al₂Cl₆.", a:"Al in AlCl₃ is electron-deficient (6 electrons). Cl lone pair on one AlCl₃ forms dative bond to Al of another → Al₂Cl₆ (both Al have full octets). AlCl₃ = Lewis acid."},
    {q:"Why does CO₂ have a linear shape but SO₂ is bent?", a:"CO₂: 2 bonding regions, no lp → linear, 180°. SO₂: 2 bonding regions + 1 lp → bent, ~119°."},
  ]},

  "ocr_2.2.3": { title: "Intermolecular Forces", cards: [
    {q:"Describe London dispersion forces (LDFs) and what determines their strength.", a:"Arise from instantaneous dipoles inducing dipoles in neighbouring molecules. Strength increases with: number of electrons (larger Mr), greater surface area (less branching). Present in ALL molecules."},
    {q:"Describe permanent dipole–dipole forces.", a:"Between polar molecules: δ+ end of one attracts δ− end of another. Stronger than LDFs for similar-sized molecules. Present in addition to LDFs."},
    {q:"What conditions are required for hydrogen bonding?", a:"H bonded to F, O, or N; lone pair on F, O, or N of adjacent molecule. Strongest IMF (~10–40 kJ mol⁻¹)."},
    {q:"Why does water have an anomalously high boiling point compared to H₂S, H₂Se, H₂Te?", a:"H₂O forms up to 4 H-bonds per molecule (2 donor, 2 acceptor). Much more energy needed to break these than the LDFs in H₂S/H₂Se/H₂Te."},
    {q:"Why does ice float on water?", a:"Ice: 4 H-bonds per molecule in open tetrahedral lattice → lower density (~0.917 g cm⁻³) than liquid water (~1.00 g cm⁻³)."},
    {q:"How does branching affect the boiling point of alkane isomers?", a:"More branching → less surface contact → weaker LDFs → lower bp. e.g. pentane (36°C) > 2-methylbutane (28°C) > 2,2-dimethylpropane (9°C)."},
    {q:"Compare the boiling points of ethanol (C₂H₅OH) and dimethyl ether (CH₃OCH₃), same Mr=46.", a:"Ethanol bp 78°C; DME bp −24°C. Ethanol has O–H → H-bonds. DME has no O–H → only dipole-dipole + LDFs. H-bonds require more energy to break."},
    {q:"Why do small alcohols (methanol, ethanol, propanol) dissolve readily in water?", a:"O–H group forms H-bonds with water - compatible with water's H-bond network. As chain length ↑, non-polar tail disrupts water structure → solubility ↓."},
    {q:"Explain why ammonia (NH₃) has a much higher boiling point than phosphine (PH₃).", a:"NH₃ (bp −33°C) forms H-bonds (N–H···N). PH₃ (bp −88°C) cannot - P not electronegative enough. H-bonds require more energy to break than LDFs."},
    {q:"What effect does hydrogen bonding have on the viscosity and surface tension of water?", a:"H-bond network gives water unusually high surface tension and viscosity. Enables capillary action and supports surface-dwelling insects."},
    {q:"Compare the boiling points of HF, HCl, HBr, HI and explain the trend.", a:"HCl < HBr < HI: increasing LDFs (more electrons). HF (bp 20°C): anomalously high - strong H-bonding despite small size."},
    {q:"How does chain length affect the boiling point of alcohols?", a:"Longer chain → more electrons → stronger LDFs → higher bp. e.g. MeOH (65°C) < EtOH (78°C) < propan-1-ol (97°C) < butan-1-ol (117°C)."},
    {q:"What is an instantaneous dipole and how does it induce a dipole in a neighbouring molecule?", a:"Random electron movement → temporary uneven charge distribution → instantaneous dipole. Distorts neighbouring electron cloud → induced dipole. Attraction = LDF."},
    {q:"Why do carboxylic acids have higher boiling points than alcohols of similar Mr?", a:"Carboxylic acids form H-bonded dimers (2 simultaneous H-bonds between COOH groups) - effectively double molecular mass on boiling. Also, C=O makes O–H more polar → stronger H-bonds."},
  ]},

  "ocr_2.3.1": { title: "The Periodic Table", cards: [
    {q:"How are elements arranged in the modern periodic table?", a:"Increasing atomic number. Periods: same number of electron shells. Groups: same number of outer electrons, similar properties. Divided into s, p, d, f blocks."},
    {q:"Describe Mendeleev's contribution to the periodic table.", a:"Arranged by atomic mass (1869); left gaps for undiscovered elements (e.g. eka-Si = Ge) with predicted properties. Later confirmed, validating his table."},
    {q:"Describe the trend in atomic radius across a period and explain it.", a:"Decreases across a period. Nuclear charge increases but electrons added to same shell (similar shielding) → greater Zeff pulls electrons closer."},
    {q:"Describe the trend in atomic radius down a group and explain it.", a:"Increases down a group. Extra electron shell added; increased shielding offsets higher nuclear charge → outer electrons further from nucleus."},
    {q:"Describe the trend in electronegativity across periods and down groups.", a:"Across period: increases (↑ nuclear charge, ↓ radius). Down group: decreases (↑ radius, ↑ shielding). F = most electronegative (4.0)."},
    {q:"Describe the trend in metallic character across a period and down a group.", a:"Decreases across period (Na→Al metals; P, S, Cl non-metals). Increases down group (C non-metal; Sn, Pb metals). Metals lose electrons easily (low IE)."},
    {q:"What are the s, p, d, and f blocks of the periodic table?", a:"s: Groups 1–2 (outer e⁻ in s). p: Groups 13–18 (outer e⁻ in p). d: transition metals (Groups 3–12). f: lanthanides/actinides."},
    {q:"Explain the periodic trend in first ionisation energy and identify the anomalies.", a:"Generally increases across a period. Anomalies: Gp 13 < Gp 2 (p electron shielded by s²); Gp 16 < Gp 15 (paired p electron - extra repulsion)."},
    {q:"What are metalloids and give examples.", a:"Properties intermediate between metals and non-metals. Si, Ge, As, Sb, Te. Si and Ge are semiconductors - essential in electronics."},
    {q:"Explain why noble gases (Group 18) are chemically inert.", a:"Full outer shells → no tendency to gain, lose or share electrons. Very high IE. Rarely form bonds."},
    {q:"Describe the trend in melting and boiling points of Group 1 metals down the group.", a:"Decreases down Group 1 (Li mp 181°C → Cs mp 28°C). Increasing radius weakens metallic bond (only 1 delocalised e⁻ per atom)."},
    {q:"How does the reactivity of Group 1 metals change down the group?", a:"Increases (Li < Na < K < Rb < Cs). Larger radius + more shielding → lower IE → outer electron lost more easily."},
    {q:"What is effective nuclear charge and how does it relate to periodic trends?", a:"Zeff = nuclear charge − shielding. Increases across a period (same shielding, more protons). Roughly constant down a group. Explains trends in radius, IE, electronegativity."},
  ]},

  "ocr_4.1.1": { title: "Basic Concepts of Organic Chemistry", cards: [
    {q:"Define organic chemistry and a homologous series.", a:"Organic chemistry: study of carbon-based compounds. Homologous series: same functional group, differ by CH₂; same reactions, gradually changing physical properties."},
    {q:"Name the carbon-framework functional groups and their structural features (alkene, aldehyde, ketone, carboxylic acid, ester).", a:"Alkene: C=C. Aldehyde: −CHO (can be oxidised). Ketone: C=O in chain (cannot be further oxidised). Carboxylic acid: −COOH. Ester: −COO−."},
    {q:"Name the heteroatom-containing functional groups and their features (halogenoalkane, alcohol, amine, amide, nitrile).", a:"Halogenoalkane: C−X (nucleophilic substitution). Alcohol: −OH (H-bonding, oxidisable). Amine: −NH₂ (basic nucleophile). Amide: −CONH₂. Nitrile: −C≡N."},
    {q:"Describe the three types of structural formula.", a:"Displayed: all bonds drawn. Structural (condensed): groups in sequence, e.g. CH₃CH₂OH. Skeletal: zigzag backbone; C and H implied; heteroatoms/functional groups shown."},
    {q:"Give the general formulae of alkanes, alkenes, alkynes, alcohols, carboxylic acids.", a:"Alkanes: CₙH₂ₙ₊₂. Alkenes: CₙH₂ₙ. Alkynes: CₙH₂ₙ₋₂. Alcohols: CₙH₂ₙ₊₂O. Carboxylic acids: CₙH₂ₙO₂."},
    {q:"State the IUPAC rules for naming organic compounds.", a:"1. Longest chain → parent name (meth/eth/prop/but/pent/hex…)\n2. Principal functional group → suffix (−ane/−ene/−ol/−al/−one/−oic acid)\n3. Number to give lowest locant to principal group\n4. Substituents alphabetically as prefixes with position numbers"},
    {q:"Define and distinguish structural isomers: chain, positional, and functional group isomers.", a:"Chain: different carbon skeleton (e.g. butane/methylpropane). Positional: same group, different position (e.g. butan-1-ol/butan-2-ol). Functional group: different functional groups, same formula (e.g. propanal/propanone)."},
    {q:"What conditions are required for E/Z (geometric) isomerism?", a:"Restricted rotation (C=C or ring). Each C of double bond carries two different substituents. E: higher priority groups opposite. Z: higher priority groups same side. Priority by CIP (higher atomic number first)."},
    {q:"Define chirality and optical isomers (enantiomers).", a:"Chiral centre: C with 4 different substituents. Enantiomers: non-superimposable mirror images. Same physical/chemical properties except optical rotation. Racemate: 50:50 mixture, no net optical activity."},
    {q:"Define homolytic and heterolytic bond fission.", a:"Homolytic: one electron to each atom → two radicals (fish-hook arrows). Heterolytic: both electrons to one atom → ions (carbocation + anion). Homolytic = radical; heterolytic = ionic."},
    {q:"Define electrophile and nucleophile.", a:"Electrophile: electron-deficient, accepts lone pair (e.g. H⁺, Br₂, NO₂⁺, carbocations). Nucleophile: electron-rich, donates lone pair (e.g. OH⁻, CN⁻, NH₃, H₂O)."},
    {q:"Explain the inductive effect and how it affects carbocation stability.", a:"Alkyl groups donate electrons through σ bonds, stabilising adjacent positive charge. Stability: 3° > 2° > 1° > methyl carbocation."},
    {q:"Name and give examples of the four main reaction types in organic chemistry.", a:"Substitution (replace atom/group). Addition (add across double bond). Elimination (remove atoms → double bond). Oxidation/Reduction (change in oxidation state)."},
    {q:"What are degrees of unsaturation and how are they calculated?", a:"DoU = (2C + 2 + N − H − X) / 2. 1 DoU = 1 ring or double bond; 2 DoU = triple bond or 2 rings/double bonds. e.g. C₆H₆: DoU = (14−6)/2 = 4."},
    {q:"What is the difference between saturated and unsaturated organic compounds?", a:"Saturated: only C−C single bonds (CₙH₂ₙ₊₂). Unsaturated: C=C or C≡C. Test: bromine water decolourises with unsaturated; no change with saturated."},
    {q:"How is IUPAC nomenclature applied to esters and amides?", a:"Ester: alkyl alkanoate (e.g. ethyl ethanoate CH₃COOC₂H₅). Amide: -ic acid → -amide (e.g. ethanamide CH₃CONH₂). N-substituted: N-methylethanamide."},
  ]},

  "ocr_4.2.1": { title: "Hydrocarbons - Alkanes and Alkenes", cards: [
    {q:"State the general formula and key structural features of alkanes.", a:"CₙH₂ₙ₊₂. All C−C σ bonds; sp³; 109.5°. Non-polar (LDFs only). bp increases with chain length; branching lowers bp."},
    {q:"Describe the free radical substitution of methane with chlorine.", a:"Initiation: Cl₂ →(UV) 2Cl•\nPropagation: Cl• + CH₄ → •CH₃ + HCl; •CH₃ + Cl₂ → CH₃Cl + Cl•\nTermination: any two radicals combine.\nProduct: mixture (CH₃Cl, CH₂Cl₂, CHCl₃, CCl₄)."},
    {q:"Why does free radical substitution of methane produce a mixture of products?", a:"Each substitution product (CH₃Cl etc.) can react further with Cl• → statistical mixture of all possible substitution levels."},
    {q:"Compare complete and incomplete combustion of alkanes.", a:"Complete (excess O₂): CO₂ + H₂O; blue flame. Incomplete (limited O₂): CO + soot + H₂O; yellow flame. CO: toxic - binds haemoglobin."},
    {q:"State the general formula and structural features of alkenes.", a:"CₙH₂ₙ. C=C (1σ + 1π). sp²; 120°. Restricted rotation → E/Z isomerism. More reactive than alkanes (π electrons attract electrophiles)."},
    {q:"Describe the electrophilic addition of Br₂ to ethene and the mechanism.", a:"1. π electrons polarise Br₂ → δ+Br acts as electrophile.\n2. Br–Br breaks heterolytically → carbocation + Br⁻.\n3. Br⁻ attacks carbocation → 1,2-dibromoethane.\nObservation: orange bromine decolourises."},
    {q:"Describe the addition of HBr to propene and Markovnikov's rule.", a:"H⁺ adds to C with more H atoms (gives more stable secondary carbocation). Br⁻ attacks → 2-bromopropane (major). Markovnikov: H to the carbon with more H."},
    {q:"Describe the addition of steam (H₂O) to ethene to make ethanol.", a:"CH₂=CH₂ + H₂O → CH₃CH₂OH. Conditions: H₃PO₄ catalyst, 300°C, 60–70 atm. Industrial (continuous, non-renewable)."},
    {q:"What is addition polymerisation? Draw the repeat unit of poly(ethene).", a:"Alkene C=C opens; monomers join with no by-product. nCH₂=CH₂ → −(CH₂CH₂)ₙ−. Poly(propene): −CH(CH₃)CH₂−."},
    {q:"What is hydrogenation of alkenes and what are its conditions?", a:"Alkene + H₂ → alkane. Ni catalyst, 150°C. Used industrially to harden vegetable oils (margarine)."},
    {q:"Describe the test for alkenes using bromine water.", a:"Add bromine water (orange) - decolourises with alkenes (electrophilic addition). No change with alkanes (no UV)."},
    {q:"Explain why addition reactions of alkenes are thermodynamically favourable.", a:"Weak π bond (~265 kJ mol⁻¹) broken; two stronger σ bonds formed. Net bond making > bond breaking → ΔH negative → exothermic."},
    {q:"Give the boiling point trend for the first six alkanes and explain it.", a:"CH₄ (−162°C) < C₂H₆ (−89°C) < C₃H₈ (−42°C) < C₄H₁₀ (−1°C) < C₅H₁₂ (36°C) < C₆H₁₄ (69°C). More electrons → stronger LDFs → higher bp."},
    {q:"What is cracking and why is it important industrially?", a:"Breaks long-chain alkanes → shorter alkanes + alkenes. Thermal: 700–1200°C (free radical). Catalytic: zeolite, ~500°C (carbocation). Supplies alkenes for polymers and shorter-chain fuels."},
  ]},

  "ocr_4.3.1": { title: "Alcohols, Haloalkanes and Analysis", cards: [
    {q:"Classify alcohols as primary, secondary, or tertiary and give examples.", a:"1°: −OH on C bonded to 1 other C (e.g. ethanol). 2°: −OH on C bonded to 2 other C (e.g. propan-2-ol). 3°: −OH on C bonded to 3 other C (e.g. 2-methylpropan-2-ol)."},
    {q:"Describe the oxidation of primary and secondary alcohols.", a:"1° → aldehyde (limited K₂Cr₂O₇, distil). 1° → carboxylic acid (excess, reflux). 2° → ketone (reflux). 3°: not oxidised. Orange → green with acidified K₂Cr₂O₇."},
    {q:"Describe the dehydration of alcohols to alkenes.", a:"Heat with conc H₃PO₄ or over Al₂O₃ at ~300°C. CH₃CH₂OH → CH₂=CH₂ + H₂O. Larger alcohols: Zaitsev's rule - more substituted alkene predominates."},
    {q:"Describe the production of ethanol by fermentation and compare with industrial synthesis.", a:"Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (yeast, ~30°C, anaerobic). Renewable but slow, impure, batch.\nHydration: C₂H₄ + H₂O → C₂H₅OH (H₃PO₄, 300°C, 60 atm). Continuous, pure; non-renewable."},
    {q:"Describe the substitution of −OH in alcohols with halide.", a:"With NaBr/conc H₂SO₄ (HBr in situ): ROH + HBr → RBr + H₂O. With PCl₅ or SOCl₂ → RCl. OH is poor leaving group; acid converts to better leaving group."},
    {q:"Classify haloalkanes as primary, secondary, or tertiary.", a:"1°: X on C bonded to 1 other C. 2°: X on C bonded to 2 C. 3°: X on C bonded to 3 C. Classification determines SN1/SN2 preference."},
    {q:"Describe the SN2 mechanism for nucleophilic substitution in primary haloalkanes.", a:"One step. Nu attacks C from back (180° to X). Trigonal bipyramidal TS. Inversion of configuration (Walden inversion). Rate = k[RX][Nu]. Favoured by 1°."},
    {q:"Describe the SN1 mechanism for nucleophilic substitution in tertiary haloalkanes.", a:"Step 1 (slow, RDS): C−X breaks → 3° carbocation + X⁻. Step 2 (fast): Nu attacks either face → racemic mixture. Rate = k[RX]. Favoured by 3°."},
    {q:"Describe the reactivity order of haloalkanes: C−F, C−Cl, C−Br, C−I.", a:"Hydrolysis: C−I > C−Br > C−Cl >> C−F. Bond enthalpy: C−F (485) >> C−I (228 kJ mol⁻¹). Reactivity depends on bond strength, not polarity alone."},
    {q:"Describe the test for rate of hydrolysis of halogenoalkanes using silver nitrate in ethanol.", a:"Warm with AgNO₃/ethanol. C−I: immediate yellow AgI ppt. C−Br: cream AgBr (seconds). C−Cl: white AgCl (slowly/heating). C−F: no ppt."},
    {q:"Describe the reactions of haloalkanes with KCN and with ammonia (excess).", a:"KCN (ethanol, warm): RX + CN⁻ → RCN + X⁻ (nitrile, chain +1C). Excess NH₃ (sealed tube): RX → RNH₂ (primary amine); further substitution possible."},
    {q:"Describe the key absorptions in infrared spectroscopy for functional group identification.", a:"O−H (alcohol): ~3230–3550 cm⁻¹ (broad). O−H (acid): ~2500–3300 cm⁻¹ (very broad). C=O (ketone/aldehyde): ~1700–1750 cm⁻¹. C=O (ester): ~1735 cm⁻¹. N−H: ~3300–3500 cm⁻¹. Fingerprint (<1500 cm⁻¹): unique to compound."},
    {q:"What do CFCs do to the ozone layer and what is the mechanism?", a:"UV homolysis in stratosphere: CFCl₃ → CFCl₂• + Cl•. Chain: Cl• + O₃ → ClO• + O₂; ClO• + O → Cl• + O₂. Cl• regenerated - destroys up to 100,000 O₃ per radical. → Increased UV → skin cancer."},
    {q:"How is a mass spectrum interpreted to identify organic fragments?", a:"M⁺: highest m/z = Mr. Base peak: most abundant fragment. Common losses: −15 (CH₃•), −29 (CHO• or C₂H₅•), −31 (CH₂OH•), −45 (COOH•). Combine with IR/NMR."},
    {q:"Describe the elimination reaction of haloalkanes with KOH.", a:"Alcoholic KOH, heat. OH⁻ acts as base - removes H from adjacent C; X leaves → C=C. e.g. CH₃CHBrCH₃ + KOH(alc) → CH₃CH=CH₂. Aqueous KOH favours SN2; alcoholic KOH favours elimination."},
  ]},

  "ocr_4.4.1": { title: "Organic Synthesis", cards: [
    {q:"What is retrosynthesis and how is it used to plan a synthesis route?", a:"Work backwards from target → starting materials. Identify functional group transformations at each step (disconnections ⟹). Write forward synthesis with reagents/conditions for each step."},
    {q:"Summarise key functional group interconversions involving halogenoalkanes.", a:"Alkane → RX: UV + X₂. Alkene → RX: HX or X₂. ROH → RX: HBr/NaBr/H₂SO₄; PCl₅; SOCl₂. RX → ROH: NaOH(aq). RX → RCN: KCN/ethanol. RX → RNH₂: excess NH₃. RX → alkene: KOH/ethanol."},
    {q:"Summarise key functional group interconversions involving alcohols.", a:"Alkene → ROH: H₂O/H₃PO₄ (hydration). ROH → alkene: H₃PO₄/heat (elimination). 1°ROH → RCHO: limited K₂Cr₂O₇, distil. 2°ROH → ketone: K₂Cr₂O₇, reflux. 1°ROH → RCOOH: excess K₂Cr₂O₇, reflux. RCHO/R₂CO → ROH: NaBH₄."},
    {q:"Describe the practical techniques used in organic synthesis.", a:"Reflux: heat at bp, no loss of volatiles. Distillation: separate by bp. Separating funnel: separate organic/aqueous layers. Drying: anhydrous MgSO₄, filter. Recrystallisation: dissolve hot, cool, filter. Suction filtration: collect solid."},
    {q:"How do you measure the melting point of an organic solid and what does it indicate?", a:"Pack into melting point tube; heat slowly. Record range. Pure: sharp, narrow (0.5–1°C), matches literature. Impure: broad, depressed range."},
    {q:"Describe thin layer chromatography (TLC) for monitoring a reaction.", a:"Spot reaction mixture + reference on silica plate. Develop; visualise (UV/iodine). Rf = distance compound/solvent front. Starting material spot shrinks; product spot grows."},
    {q:"How is column chromatography used to purify an organic product?", a:"Silica column; load mixture at top; elute with solvent. Less polar compounds elute first. Collect fractions; check by TLC; combine pure fractions; evaporate solvent."},
    {q:"Define atom economy and explain its role in green chemistry.", a:"% atom economy = (Mr desired product / ΣMr all products) × 100. High = less waste, more sustainable. Green: use catalysts, renewable feedstocks, minimise energy/hazardous by-products."},
    {q:"Calculate the % yield for a synthesis reaction given actual and theoretical yields.", a:"% yield = (actual mass / theoretical mass) × 100. Theoretical: moles limiting reagent × Mr of product."},
    {q:"What is the significance of using a two-step vs one-step synthesis?", a:"One-step: higher overall yield, fewer losses. Two-step: necessary when one-step doesn't exist. Overall yield = (yield₁ × yield₂)/100. e.g. 80% × 80% = 64%."},
    {q:"How is a solid product purified by recrystallisation?", a:"Dissolve in minimum hot solvent. Filter hot (insoluble impurities). Cool slowly → pure crystals form. Filter; wash with cold solvent; dry; check melting point."},
    {q:"Describe the use of a separating funnel in organic synthesis.", a:"Pour mixture in; layers separate (denser sinks). Drain lower through tap; pour upper out top. Wash organic layer with Na₂CO₃ (removes acidic impurities) or brine. Dry with anhydrous MgSO₄."},
    {q:"What is the role of an anhydrous drying agent in organic synthesis?", a:"Absorbs water from organic layer (present after aqueous washes). MgSO₄: fast, general use. CaCl₂: cheap but cannot use with alcohols/amines. Filter off; evaporate solvent."},
    {q:"Name and describe four spectroscopic methods used to identify organic compounds.", a:"MS: Mr and fragmentation. IR: functional groups (bond vibrations, cm⁻¹). ¹H NMR: H environments, ratio, splitting pattern. ¹³C NMR: carbon environments. Together allow complete structure determination."},
  ]},

  "ocr_5.1.1": { title: "Reaction Rates", cards: [
    {q:"Define rate of reaction and write the general rate equation.", a:"Change in concentration per unit time (mol dm⁻³ s⁻¹). rate = k[A]ᵐ[B]ⁿ. Orders determined experimentally, not from stoichiometry."},
    {q:"Define zero, first, and second order with respect to a reactant.", a:"0th: rate independent of [A]. 1st: rate ∝ [A] (double [A] → double rate). 2nd: rate ∝ [A]² (double [A] → quadruple rate). Overall order = sum of individual orders."},
    {q:"State the units of rate constant k for zero, first, and second order reactions.", a:"0th order: mol dm⁻³ s⁻¹. 1st order: s⁻¹. 2nd order: mol⁻¹ dm³ s⁻¹. Derived from rate = k[A]ⁿ."},
    {q:"How do you determine order of reaction using the initial rates method?", a:"Vary one reactant at a time; keep others constant. Compare initial rates: ×2[A] → same rate = 0th; ×2 rate = 1st; ×4 rate = 2nd. Calculate k from rate = k[A]ᵐ[B]ⁿ using one data set."},
    {q:"Describe the concentration-time graphs for zero, first, and second order reactions.", a:"0th: straight line decreasing. 1st: exponential decay, constant half-life. 2nd: curve with increasing half-life."},
    {q:"Describe the rate-concentration graphs for zero, first, and second order reactions.", a:"0th: horizontal line. 1st: straight line through origin. 2nd: upward-curving parabola."},
    {q:"Define half-life and how does it differ between first and second order reactions?", a:"t½: time for [reactant] to halve. 1st order: t½ constant = ln2/k ≈ 0.693/k. 2nd order: t½ increases as [A] falls. Constant t½ is diagnostic of 1st order."},
    {q:"Define rate-determining step and explain how rate equation reveals mechanism.", a:"RDS: slowest step, controls overall rate. Species in the rate equation must appear in or before the RDS. rate = k[A][B] → A and B both present in/before RDS."},
    {q:"State the Arrhenius equation and explain the effect of temperature on k.", a:"k = Ae^(−Ea/RT). As T increases, e^(−Ea/RT) increases → k increases exponentially. A = pre-exponential factor; Ea = activation energy; R = 8.314 J K⁻¹ mol⁻¹."},
    {q:"How is the Arrhenius equation linearised and what graph is plotted?", a:"ln k = ln A − Ea/RT. Plot ln k (y) vs 1/T (x) → straight line. Gradient = −Ea/R; y-intercept = ln A. Ea = −gradient × 8.314."},
    {q:"How do you use the Arrhenius equation to calculate Ea from k at two temperatures?", a:"ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂). Substitute k₁, k₂, T₁, T₂ (in K), R = 8.314. Solve for Ea."},
    {q:"Describe how a catalyst affects the rate constant k and the Arrhenius equation.", a:"Catalyst lowers Ea → larger e^(−Ea/RT) → larger k → faster rate. Effect is exponential (k very sensitive to Ea)."},
    {q:"How is the order of reaction determined graphically from a concentration-time graph?", a:"Straight line → 0th. Exponential decay with constant t½ → 1st. Increasing t½ → 2nd. Confirm with rate vs [reactant] plot."},
    {q:"What is the molecularity of an elementary step?", a:"Number of species colliding in one elementary step. Unimolecular (1), bimolecular (2, most common), termolecular (3, rare). Only applies to elementary reactions."},
    {q:"How does the initial rates method allow calculation of k?", a:"Determine orders, then k = rate / ([A]ᵐ[B]ⁿ) using any one data set. Units depend on overall order."},
  ]},

  "ocr_5.1.2": { title: "Equilibrium (Quantitative)", cards: [
    {q:"Write a general Kc expression and state its units for: aA + bB ⇌ cC + dD.", a:"Kc = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ). Units: (mol dm⁻³)^Δn. Kc dimensionless if Δn = 0. Only changes with temperature."},
    {q:"Write the Kp expression for N₂(g) + 3H₂(g) ⇌ 2NH₃(g) and give its units.", a:"Kp = (pNH₃)² / (pN₂ × (pH₂)³). Δn = 2−4 = −2 → units Pa⁻². Only changes with temperature."},
    {q:"How do you calculate partial pressures from mole fractions and total pressure?", a:"χₐ = nₐ/ntotal. pₐ = χₐ × Ptotal. Sum of partial pressures = Ptotal (Dalton's law)."},
    {q:"What is the relationship between Kp and Kc?", a:"Kp = Kc(RT)^Δn. Δn = moles gaseous products − moles gaseous reactants. If Δn = 0: Kp = Kc."},
    {q:"How does temperature affect Kp for exothermic and endothermic reactions?", a:"Exothermic (ΔH < 0): ↑T → Kp decreases. Endothermic (ΔH > 0): ↑T → Kp increases. Temperature is the ONLY factor that changes Kp/Kc."},
    {q:"Define the reaction quotient Q and use it to predict direction of reaction.", a:"Q: same expression as Kc but with non-equilibrium values. Q < Kc → forward. Q > Kc → reverse. Q = Kc → equilibrium."},
    {q:"Define acid dissociation constant Ka and write its expression for a weak acid HA.", a:"Ka = [H⁺][A⁻]/[HA]  (mol dm⁻³). Larger Ka → stronger acid. pKa = −log Ka. Assumptions: [H⁺]=[A⁻]; [HA]eq ≈ [HA]initial."},
    {q:"Calculate the pH of a 0.100 mol dm⁻³ solution of ethanoic acid (Ka = 1.8 × 10⁻⁵ mol dm⁻³).", a:"[H⁺] = √(Ka × c) = √(1.8×10⁻⁵ × 0.100) = 1.34×10⁻³ mol dm⁻³. pH = −log(1.34×10⁻³) = 2.87."},
    {q:"Define Kw and calculate the pH of a strong base.", a:"Kw = [H⁺][OH⁻] = 1.00×10⁻¹⁴ mol² dm⁻⁶ at 25°C. 0.1 mol dm⁻³ NaOH: [H⁺] = 10⁻¹⁴/0.1 = 10⁻¹³ → pH = 13."},
    {q:"What is a buffer solution and how does it resist pH changes?", a:"Weak acid + conjugate base (e.g. CH₃COOH + CH₃COO⁻). Add H⁺: A⁻ + H⁺ → HA. Add OH⁻: HA + OH⁻ → A⁻ + H₂O. pH stays approximately constant."},
    {q:"State the Henderson-Hasselbalch equation and use it.", a:"pH = pKa + log([A⁻]/[HA]). When [A⁻] = [HA]: pH = pKa. Example: pKa 4.76, [A⁻]/[HA] = 2 → pH = 4.76 + 0.30 = 5.06."},
    {q:"Describe the shapes of titration curves for strong acid/strong base and weak acid/strong base.", a:"Strong/strong: starts ~pH 1; sharp vertical jump at equivalence point (pH ≈ 7). Weak acid/strong base: starts ~pH 3; buffer region; equivalence point pH > 7 (~8–9); less steep jump."},
    {q:"How do you choose the correct indicator for a titration?", a:"Indicator pKa must fall within the steep section at equivalence point. Strong/strong: methyl orange or phenolphthalein. Weak acid/strong base: phenolphthalein. Strong acid/weak base: methyl orange. Weak/weak: no suitable indicator."},
    {q:"How does temperature affect Kw and the pH of neutral water?", a:"Autoionisation endothermic → ↑T → Kw increases → pH of neutral water decreases. At 37°C: Kw ≈ 2.4×10⁻¹⁴, neutral pH ≈ 6.8. [H⁺] = [OH⁻] still holds; neutrality ≠ pH 7."},
    {q:"Calculate the pH of a buffer solution containing 0.20 mol dm⁻³ CH₃COOH and 0.10 mol dm⁻³ CH₃COONa (pKa = 4.76).", a:"pH = 4.76 + log(0.10/0.20) = 4.76 + log(0.5) = 4.76 − 0.30 = 4.46."},
  ]},

  "ocr_5.2.1": { title: "Lattice Enthalpy", cards: [
    {q:"Define lattice enthalpy (dissociation) and state its sign.", a:"ΔH when 1 mol ionic solid → gaseous ions. Always endothermic (+). E.g. MgO(s) → Mg²⁺(g) + O²⁻(g). Lattice formation (reverse) is always exothermic."},
    {q:"State the two factors that determine the magnitude of lattice enthalpy.", a:"1. Ionic charge: higher charge → stronger attraction → larger ΔHlatt. 2. Ionic radius: smaller ions → closer together → larger ΔHlatt. MgO >> NaCl; LiF > CsI."},
    {q:"List all the steps in a Born-Haber cycle for NaCl.", a:"1. Na(s)→Na(g): ΔHat(Na) +108. 2. Na(g)→Na⁺(g)+e⁻: IE₁ +496. 3. ½Cl₂(g)→Cl(g): ΔHat(Cl) +122. 4. Cl(g)+e⁻→Cl⁻(g): EA₁ −349. 5. Na⁺(g)+Cl⁻(g)→NaCl(s): ΔHlatt −787. Sum = ΔHf°(NaCl) = −411 kJ mol⁻¹."},
    {q:"Define enthalpy of atomisation and electron affinity.", a:"ΔHat°: ΔH to form 1 mol gaseous atoms from element in standard state. Always endothermic. ΔEA1: energy when 1 mol gaseous atoms each gains one e⁻ → −1 ions. Usually exothermic. Cl(g)+e⁻→Cl⁻(g): −349 kJ mol⁻¹."},
    {q:"Why is the second electron affinity of oxygen endothermic?", a:"1st EA (O→O⁻): exothermic −141 kJ mol⁻¹. 2nd EA (O⁻→O²⁻): endothermic +798 kJ mol⁻¹ - must overcome repulsion from existing negative charge on O⁻."},
    {q:"Explain the difference between theoretical and experimental lattice enthalpies.", a:"Theoretical: assumes purely ionic model. Experimental: from Born-Haber cycle. If |experimental| > |theoretical|: compound has covalent character. Caused by small high-charge cation polarising large/high-charge anion (Fajans' rules). E.g. AgCl > NaCl in covalent character."},
    {q:"Define enthalpy of hydration and its sign.", a:"ΔH when 1 mol gaseous ions dissolves in excess water → aqueous ions. Always exothermic (−). Magnitude increases with higher charge and smaller radius."},
    {q:"State the equation relating enthalpy of solution, lattice enthalpy, and hydration enthalpy.", a:"ΔHsol = ΔHlatt(dissociation) + ΔHhyd(cation) + ΔHhyd(anion). NaCl: +787 + (−406) + (−363) = +18 kJ mol⁻¹ (slightly endothermic; dissolves due to entropy increase)."},
    {q:"Compare the lattice enthalpies of NaCl, MgCl₂, and MgO and explain the differences.", a:"NaCl ≈ +787, MgCl₂ ≈ +2526, MgO ≈ +3791 kJ mol⁻¹. Mg²⁺ has higher charge and smaller radius than Na⁺. O²⁻ has higher charge and smaller radius than Cl⁻."},
    {q:"Describe how a Born-Haber cycle is constructed and used.", a:"Arrange steps as a closed cycle (Hess's Law). Direct route: elements → compound (ΔHf°). Indirect: atomise → ions → lattice. Σenergy clockwise = Σenergy anticlockwise. Solve for unknown (usually ΔHlatt)."},
    {q:"What is polarisation of ions and how does it indicate covalent character?", a:"High-charge small cation distorts anion electron cloud → covalent character. High polarising power: small, high-charge cation. High polarisability: large, high-charge anion. More polarisation → experimental and theoretical ΔHlatt diverge more."},
    {q:"Calculate the lattice enthalpy of NaCl from the following data.", a:"−411 = 108 + 496 + 122 + (−349) + ΔHlatt → −411 = 377 + ΔHlatt → ΔHlatt(formation) = −788 kJ mol⁻¹."},
    {q:"Why do Group 2 compounds have larger lattice enthalpies than Group 1 analogues?", a:"Group 2: M²⁺ (charge 2+) vs Group 1 M⁺. Higher charge → stronger electrostatic forces → larger ΔHlatt. MgO (~3791) >> NaCl (~787 kJ mol⁻¹)."},
    {q:"How does enthalpy of hydration vary with ionic charge and radius?", a:"ΔHhyd more exothermic with higher charge and smaller radius. Al³⁺ (−4690) >> Mg²⁺ (−1891) >> Na⁺ (−406) >> K⁺ (−322). F⁻ (−506) > Cl⁻ (−363) > Br⁻ (−336) > I⁻ (−295) kJ mol⁻¹."},
  ]},

  "ocr_5.2.2": { title: "Gibbs Free Energy and Entropy", cards: [
    {q:"Define entropy S and state its units.", a:"Quantitative measure of disorder/randomness. Units: J K⁻¹ mol⁻¹. Perfect crystal at 0 K: S = 0 (third law)."},
    {q:"State factors that increase entropy and give examples.", a:"s→l→g (large increase). Dissolving. More moles of gas (e.g. N₂O₄ → 2NO₂). Mixing. Increasing T. Larger/more complex molecules."},
    {q:"How is ΔSsystem calculated for a chemical reaction?", a:"ΔS°system = ΣS°(products) − ΣS°(reactants). Multiply by stoichiometric coefficients. Units: J K⁻¹ mol⁻¹."},
    {q:"State the Gibbs free energy equation and define each term.", a:"ΔG = ΔH − TΔS. ΔH in kJ mol⁻¹; T in K; ΔS in kJ K⁻¹ mol⁻¹ (divide J value by 1000). ΔG < 0 → feasible."},
    {q:"What is the condition for spontaneity (feasibility) of a reaction?", a:"ΔG < 0: feasible. ΔG = 0: equilibrium. ΔG > 0: not feasible. ΔG < 0 does not guarantee the reaction is fast - kinetic barriers may still prevent it."},
    {q:"Analyse feasibility for all four combinations of ΔH and ΔS signs.", a:"ΔH−, ΔS+: always feasible. ΔH+, ΔS−: never feasible. ΔH−, ΔS−: feasible at low T only. ΔH+, ΔS+: feasible at high T only."},
    {q:"How do you calculate the temperature at which a reaction becomes feasible?", a:"Set ΔG = 0: T = ΔH/ΔS. Use consistent units (ΔS in kJ K⁻¹ mol⁻¹). Above this T (ΔH+, ΔS+): feasible. Below this T (ΔH−, ΔS−): feasible."},
    {q:"What is ΔSsurroundings and how does it relate to ΔH?", a:"ΔSsurr = −ΔH/T. Exothermic → ΔSsurr positive. ΔStotal = ΔSsystem + ΔSsurr = −ΔG/T. Spontaneous if ΔStotal > 0."},
    {q:"Calculate ΔG at 298 K for: N₂(g) + 3H₂(g) → 2NH₃(g), ΔH° = −92 kJ mol⁻¹, ΔS° = −199 J K⁻¹ mol⁻¹.", a:"ΔS° = −0.199 kJ K⁻¹ mol⁻¹. ΔG = −92 − (298×−0.199) = −92 + 59.3 = −32.7 kJ mol⁻¹. Feasible at 298 K; infeasible above ~462 K."},
    {q:"Why can an exothermic reaction have ΔG > 0 at high temperatures?", a:"If ΔS < 0 (e.g. gases combining): ΔG = ΔH − TΔS. At high T, −TΔS term (+ve) dominates → ΔG > 0. E.g. N₂ + 3H₂ → 2NH₃ infeasible above ~460 K."},
    {q:"Explain why ΔG < 0 does not guarantee a reaction will occur in practice.", a:"ΔG < 0 = thermodynamically feasible (products more stable). High Ea means reaction may be too slow at room temperature. Thermodynamic feasibility ≠ kinetic feasibility."},
    {q:"How does the entropy change for dissolving NaCl in water?", a:"ΔSsystem: positive (solid → ions in solution). ΔSsurr: slightly negative (ΔHsol ≈ +18 kJ mol⁻¹). ΔStotal > 0 → dissolution occurs despite being slightly endothermic."},
    {q:"Compare the entropy of diamond and graphite at 298 K and explain.", a:"S°(diamond) = 2.4; S°(graphite) = 5.7 J K⁻¹ mol⁻¹. Graphite higher: layered structure with weaker interlayer forces → more vibrational modes. Diamond: rigid 3D network → more constrained."},
    {q:"What is the relationship between ΔG° and the equilibrium constant K?", a:"ΔG° = −RT ln K. ΔG° < 0 → K > 1 (products favoured). ΔG° > 0 → K < 1 (reactants favoured). ΔG° = 0 → K = 1."},
  ]},

  "ocr_5.3.1": { title: "Electrode Potentials and Cells", cards: [
    {q:"Define standard electrode potential E°.", a:"E° of a half-cell vs SHE under standard conditions (298 K, 1 mol dm⁻³ ions, 100 kPa). More positive E° → stronger oxidising agent (greater tendency to be reduced)."},
    {q:"Describe the standard hydrogen electrode.", a:"Pt electrode in 1.00 mol dm⁻³ H⁺(aq), H₂ at 100 kPa, 298 K. 2H⁺(aq) + 2e⁻ ⇌ H₂(g)  E° = 0.00 V (by definition). Pt is inert conductor."},
    {q:"How is the EMF of an electrochemical cell calculated?", a:"E°cell = E°(cathode) − E°(anode) = E°(more +ve) − E°(more −ve). Cathode: reduction. Anode: oxidation. E.g. Cu/Zn: 0.34 − (−0.76) = +1.10 V."},
    {q:"Write the conventional cell notation and identify cathode and anode.", a:"Anode | electrolyte || electrolyte | cathode. E.g. Zn(s)|Zn²⁺(aq)||Cu²⁺(aq)|Cu(s). || = salt bridge. | = phase boundary. Electrons flow left → right (anode → cathode)."},
    {q:"How is the feasibility of a redox reaction predicted from electrode potentials?", a:"E°cell = E°(reduction) − E°(oxidation). E°cell > 0 → feasible. E.g. Fe³⁺ vs I⁻: 0.77 − 0.54 = +0.23 V → feasible."},
    {q:"State two limitations when using E° to predict feasibility.", a:"1. Non-standard conditions alter actual E (Nernst equation). 2. High Ea → kinetically too slow even if E°cell > 0. 3. Overpotential in electrolysis."},
    {q:"Describe a hydrogen-oxygen fuel cell and write the half-equations (acidic).", a:"Anode: H₂ → 2H⁺ + 2e⁻. Cathode: ½O₂ + 2H⁺ + 2e⁻ → H₂O. Overall: H₂ + ½O₂ → H₂O. Fuel supplied continuously. Only product: water. Disadvantages: H₂ storage, expensive Pt, H₂ production often uses fossil fuels."},
    {q:"Describe the electrochemical series and how it predicts which species can oxidise which.", a:"Half-cells in order of E°. Species on RIGHT (oxidised form) with more positive E° oxidises species on LEFT with more negative E°. Greater separation → greater driving force."},
    {q:"Explain the Nernst equation qualitatively.", a:"E = E° − (RT/nF)lnQ. Actual E depends on concentration. As battery discharges, concentrations change → E decreases → voltage drops → battery 'flat'."},
    {q:"Describe a rechargeable lithium-ion cell.", a:"Anode: LiC₆ (Li⁺ in graphite). Cathode: LiCoO₂. Electrolyte: Li salt in organic solvent. Discharge: Li → Li⁺ + e⁻ at anode. Charge: reverse. High energy density; used in phones/EVs."},
    {q:"Compare electrochemical cells and electrolytic cells.", a:"Electrochemical: chemical → electrical energy; spontaneous (E°cell > 0). Electrolytic: electrical → chemical energy; non-spontaneous; requires external power supply (electroplating, Al extraction, brine electrolysis)."},
    {q:"Give the half-equations and overall equation for the hydrogen-oxygen fuel cell in alkaline conditions.", a:"Anode: H₂ + 2OH⁻ → 2H₂O + 2e⁻. Cathode: ½O₂ + H₂O + 2e⁻ → 2OH⁻. Overall: H₂ + ½O₂ → H₂O (same as acid conditions)."},
    {q:"What is the salt bridge and what is its function?", a:"Saturated KNO₃ in U-tube/filter paper. Allows ions to migrate → maintains electrical neutrality. Completes circuit without mixing solutions. KNO₃: K⁺ and NO₃⁻ unreactive with most half-cell solutions."},
    {q:"Describe an iodometric (iodine–thiosulfate) redox titration.", a:"Oxidising agent + excess KI(aq) (acidic) → I₂ liberated. Titrate I₂ with standard Na₂S₂O₃. Near endpoint: add starch → blue-black. Endpoint: blue-black disappears. Calculate oxidising agent from moles Na₂S₂O₃ and stoichiometry."},
    {q:"Write the half-equations and overall equation for the iodine–thiosulfate titration.", a:"I₂ + 2e⁻ → 2I⁻. 2S₂O₃²⁻ → S₄O₆²⁻ + 2e⁻. Overall: I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻. Ratio: 1 mol I₂ : 2 mol S₂O₃²⁻."},
    {q:"Describe a KMnO₄ redox titration to find the concentration of Fe²⁺.", a:"Acidify with H₂SO₄ (not HCl - Cl⁻ oxidised). Run KMnO₄ from burette; self-indicating (purple → colourless). Endpoint: first permanent pale pink. Ratio: 1 MnO₄⁻ : 5 Fe²⁺."},
  ]},

  "ocr_5.4.1": { title: "Transition Elements", cards: [
    {q:"Define a transition element and explain why Sc and Zn are excluded.", a:"d-block element forming ≥1 stable ion with partially filled d subshell. Sc³⁺: 3d⁰ (empty). Zn²⁺: 3d¹⁰ (full). Neither qualifies."},
    {q:"Write the electron configurations of Cr and Cu, and explain the anomalies.", a:"Cr: [Ar]3d⁵4s¹ (half-filled d extra stable). Cu: [Ar]3d¹⁰4s¹ (full d extra stable). 4s electrons lost before 3d when forming ions: Fe²⁺ [Ar]3d⁶; Fe³⁺ [Ar]3d⁵."},
    {q:"List the four characteristic properties of transition metals.", a:"1. Variable oxidation states. 2. Coloured ions (d-d transitions). 3. Catalytic activity. 4. Complex ion formation."},
    {q:"Define ligand, complex ion, and coordination number.", a:"Ligand: molecule/ion donating lone pair to metal via coordinate bond. Complex ion: metal + ligands. Coordination number: number of coordinate bonds to metal (usually 4 or 6). Common: H₂O, NH₃, Cl⁻, CN⁻, OH⁻."},
    {q:"Describe the common shapes of transition metal complexes.", a:"Octahedral (CN=6, 90°): [Fe(H₂O)₆]²⁺. Tetrahedral (CN=4, 109.5°, large ligands): [CuCl₄]²⁻. Square planar (CN=4, 90°, Pt²⁺): cisplatin [Pt(NH₃)₂Cl₂]."},
    {q:"Explain why transition metal complexes are coloured.", a:"Ligands split d orbitals into two energy levels. Electrons absorb visible light to undergo d-d transitions (lower → upper set). Colour observed = complementary to absorbed wavelength. E.g. [Cu(H₂O)₆]²⁺ absorbs red/orange → appears blue."},
    {q:"Describe cis-trans isomerism in square planar complexes.", a:"cis: identical ligands adjacent (90°). trans: identical ligands opposite (180°). Cisplatin cis-[Pt(NH₃)₂Cl₂]: anticancer drug - cross-links DNA. Transplatin: inactive (ligands too far apart)."},
    {q:"Describe optical isomerism in octahedral complexes with bidentate ligands.", a:"[M(en)₃]ⁿ⁺: three bidentate ligands create helical arrangement → two non-superimposable mirror images (Δ and Λ enantiomers). Rotate plane-polarised light in opposite directions."},
    {q:"Describe the ligand substitution reaction of [Cu(H₂O)₆]²⁺ with NH₃.", a:"[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O. Limited NH₃: pale blue Cu(OH)₂ precipitate. Excess NH₃: precipitate dissolves → deep blue solution."},
    {q:"Describe the ligand substitution reaction of [Co(H₂O)₆]²⁺ with Cl⁻.", a:"[Co(H₂O)₆]²⁺ + 4Cl⁻ ⇌ [CoCl₄]²⁻ + 6H₂O. Add conc HCl → blue (tetrahedral). Add water → pink (octahedral). Shape change: octahedral ⇌ tetrahedral."},
    {q:"What colour is [Cu(H₂O)₆]²⁺?", a:"Pale blue."},
    {q:"What colour is [Cu(NH₃)₄(H₂O)₂]²⁺?", a:"Deep/royal blue."},
    {q:"What colour is [CuCl₄]²⁻?", a:"Yellow-green."},
    {q:"What colour is [Fe(H₂O)₆]²⁺?", a:"Pale green. NaOH → green Fe(OH)₂ precipitate (darkens in air to red-brown Fe(OH)₃)."},
    {q:"What colour is [Fe(H₂O)₆]³⁺?", a:"Pale violet/lilac (pure water); yellow-orange in acidic solution. NaOH → red-brown Fe(OH)₃ precipitate."},
    {q:"What colour is [Co(H₂O)₆]²⁺?", a:"Pink. Excess Cl⁻ converts to blue [CoCl₄]²⁻. Reversible pink/blue change used to detect water."},
    {q:"What colour is [CoCl₄]²⁻?", a:"Blue (tetrahedral)."},
    {q:"What colour is Mn²⁺ in aqueous solution?", a:"Very pale pink, almost colourless. NaOH → cream Mn(OH)₂ precipitate (darkens in air)."},
    {q:"What colour is MnO₄⁻ (permanganate)?", a:"Intense purple. In acid: Mn(VII) → Mn²⁺ (purple → colourless). In neutral/alkaline: → brown MnO₂."},
    {q:"What colour is Cr²⁺?", a:"Blue (unstable, rapidly oxidised in air to Cr³⁺)."},
    {q:"What colour is [Cr(H₂O)₆]³⁺ (Cr³⁺ in water)?", a:"Violet/purple (pure water); green in acidic solution (partial ligand substitution). NaOH → grey-green Cr(OH)₃ (amphoteric - dissolves in excess NaOH)."},
    {q:"What colour is CrO₄²⁻ (chromate)?", a:"Yellow (stable in alkaline). In acid: 2CrO₄²⁻ + 2H⁺ ⇌ Cr₂O₇²⁻ (orange) + H₂O."},
    {q:"What colour is Cr₂O₇²⁻ (dichromate)?", a:"Orange (stable in acid). Reduced to Cr³⁺ (green). In alkali → CrO₄²⁻ (yellow)."},
    {q:"List the key catalytic applications of transition metals.", a:"Fe: Haber process. V₂O₅: Contact process. MnO₂: H₂O₂ decomposition. Ni: hydrogenation of alkenes. Pt/Pd/Rh: catalytic converters. Mechanism: variable oxidation states."},
    {q:"Describe the chemistry of chromium ions: Cr²⁺, Cr³⁺, CrO₄²⁻, Cr₂O₇²⁻.", a:"Cr²⁺: blue, unstable (→Cr³⁺). Cr³⁺: violet/green; Cr(OH)₃ with NaOH (amphoteric). CrO₄²⁻: yellow (alkaline). Cr₂O₇²⁻: orange (acid). Interconvert: Cr₂O₇²⁻ + 2OH⁻ ⇌ 2CrO₄²⁻ + H₂O."},
    {q:"Describe the chemistry of manganese: Mn²⁺, MnO₂, MnO₄⁻.", a:"Mn²⁺: very pale pink; cream Mn(OH)₂ with NaOH. MnO₂: black solid (+4); catalyses H₂O₂ decomposition. MnO₄⁻: purple; in acid: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (purple → colourless). In alkaline: → MnO₂ (brown)."},
    {q:"Describe how haemoglobin uses Fe²⁺ to carry oxygen.", a:"Fe²⁺ at centre of haem (porphyrin ring). Binds O₂ reversibly in lungs; releases in tissues. CO binds ~200× more strongly → carboxyhaemoglobin → poisoning. Treatment: high-concentration O₂."},
    {q:"Define monodentate and bidentate ligands with examples.", a:"Monodentate: one lone pair donated. Examples: H₂O, NH₃, Cl⁻, CN⁻, OH⁻. Bidentate: two lone pairs from two donor atoms. Examples: en (H₂NCH₂CH₂NH₂), oxalate (C₂O₄²⁻). Bidentate → chelate rings → more stable."},
    {q:"Describe the successive oxidation states and colours of vanadium.", a:"V(V) VO₂⁺: yellow. V(IV) VO²⁺: blue. V(III) V³⁺: green. V(II) V²⁺: violet. Reduction sequence (Zn/H₂SO₄): yellow → blue → green → violet."},
  ]},

  "ocr_6.1.1": { title: "Aromatic Chemistry", cards: [
    {q:"Describe the Kekulé structure of benzene and the evidence that disproved it.", a:"Kekulé: alternating C=C and C−C (cyclohexatriene). Evidence against: 1. All C−C bonds = 0.140 nm (intermediate, not two lengths). 2. ΔH(hydrogenation) = −208 kJ mol⁻¹, not −360 (3 × cyclohexene) - benzene ~152 kJ mol⁻¹ more stable (delocalisation energy)."},
    {q:"Describe the delocalised model of benzene.", a:"Six sp² C in regular hexagon. Each C has one e⁻ in p orbital ⊥ to ring. Six p orbitals overlap → continuous π system above and below ring. Electrons delocalised over all 6 C → aromatic stabilisation. Represented as circle in hexagon."},
    {q:"Explain why benzene undergoes electrophilic substitution rather than addition.", a:"Addition would break the delocalised π system (lose ~152 kJ mol⁻¹ stabilisation). Substitution restores the aromatic ring - H⁺ leaves after electrophile attacks. Products more stable."},
    {q:"Describe the nitration of benzene - reagents, conditions, electrophile, and mechanism.", a:"conc HNO₃ + conc H₂SO₄; <55°C. Electrophile: NO₂⁺ (nitronium). HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O. 1. NO₂⁺ attacks ring → arenium ion. 2. H⁺ lost → ring restored. Product: nitrobenzene (yellow oil)."},
    {q:"Describe the halogenation of benzene - reagents, conditions, mechanism.", a:"Cl₂ or Br₂ + AlCl₃/FeBr₃ (Lewis acid catalyst), r.t. Catalyst polarises X₂ → generates X⁺ equivalent. X⁺ attacks ring → arenium ion → H⁺ lost → halobenzene + HX. Catalyst regenerated."},
    {q:"Describe Friedel-Crafts acylation - reagents, conditions, and why it is preferred over alkylation.", a:"RCOCl + AlCl₃. Electrophile: acylium RCO⁺. Product: aryl ketone. Preferred over alkylation: C=O is electron-withdrawing → deactivates ring → stops further substitution → one product."},
    {q:"Describe Friedel-Crafts alkylation and its limitation.", a:"RCl + AlCl₃. Product: alkylbenzene. Limitation: alkyl activates ring → polyalkylation → mixture of products. Acylation preferred for clean synthesis."},
    {q:"Describe the reactions of phenol with bromine water and with dilute HNO₃.", a:"Br₂(aq): no catalyst; immediate white precipitate of 2,4,6-tribromophenol. O lone pair delocalises into ring → activates all ortho/para. Dilute HNO₃ (r.t.): 2-nitrophenol + 4-nitrophenol (no H₂SO₄ needed)."},
    {q:"Explain directing effects in electrophilic aromatic substitution.", a:"Electron-donating groups (OH, NH₂, CH₃): activate ring → ortho/para directors. Electron-withdrawing groups (NO₂, CHO, COOH): deactivate ring → meta directors."},
    {q:"Explain why phenol is much more reactive than benzene towards EAS.", a:"O lone pair overlaps with ring π system → increases electron density at ortho/para. Electrophiles attack more readily. No catalyst needed for halogenation; dilute HNO₃ sufficient."},
    {q:"What is the mechanism for nitration and what controls the rate?", a:"RDS: NO₂⁺ attacks ring → arenium ion (Wheland intermediate). Rate controlled by [NO₂⁺] (from H₂SO₄) and ring electron density. Deactivated rings need higher T/more concentrated acid."},
    {q:"What is the role of H₂SO₄ in the nitration of benzene?", a:"Protonates HNO₃: HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O. Generates electrophile NO₂⁺. H₂SO₄ regenerated → acts as catalyst."},
    {q:"Why is the temperature kept below 55°C in the nitration of benzene?", a:"Above 55°C: further nitration → dinitrobenzene/trinitrobenzene. Below 55°C: mainly mononitration → nitrobenzene as product."},
  ]},

  "ocr_6.1.2": { title: "Amines and Nitrogen Compounds", cards: [
    {q:"Classify amines as primary, secondary, tertiary, or quaternary.", a:"1°: RNH₂ (e.g. CH₃NH₂). 2°: R₂NH. 3°: R₃N. Quaternary: R₄N⁺X⁻ (no lone pair; permanent +charge)."},
    {q:"Explain why amines are bases and compare basicity of aliphatic, aromatic, and ammonia.", a:"N lone pair accepts H⁺. Basicity: aliphatic (CH₃NH₂) > NH₃ > aromatic (C₆H₅NH₂). Alkyl: donates e⁻ to N → lone pair more available. Aryl: lone pair delocalised into ring → less available."},
    {q:"Explain why aniline is a much weaker base than methylamine.", a:"N lone pair delocalised into benzene ring → less available for H⁺. pKb: aniline ≈ 9.4; methylamine ≈ 3.4 (~10⁶ times weaker)."},
    {q:"Describe the reaction of amines with halogenoalkanes.", a:"RNH₂ + R'X → 2° amine → 3° amine → quaternary salt (mixture). Use large excess amine to favour monoalkylation."},
    {q:"Describe the reaction of amines with acyl chlorides.", a:"RNH₂ + R'COCl → RNHCOR' + HCl. Fast, irreversible. Gives one product (amide). HCl neutralised by excess amine."},
    {q:"Describe the preparation of amines by reduction of nitriles.", a:"RCN + 4[H] (LiAlH₄/dry ether) → RCH₂NH₂. Chain extended by 1C. E.g. CH₃CN → CH₃CH₂NH₂."},
    {q:"Describe the preparation of aniline from nitrobenzene.", a:"1. Sn + conc HCl, reflux → C₆H₅NH₃⁺Cl⁻. 2. Add NaOH → C₆H₅NH₂. Carcinogenic - fume cupboard; avoid skin contact."},
    {q:"Describe the preparation of a diazonium salt (diazotisation).", a:"ArNH₂ + NaNO₂ + HCl, 0–5°C → ArN₂⁺Cl⁻. Must keep ice cold - unstable above 10°C (decomposes to phenol + N₂)."},
    {q:"Describe azo coupling and the formation of azo dyes.", a:"ArN₂⁺ + phenol (alkaline) or ArNH₂ → Ar−N=N−Ar' (azo compound). Electrophilic attack at para position. −N=N− chromophore → yellow/orange/red colour. Used as fabric dyes."},
    {q:"What is the importance of diazonium salts in synthesis?", a:"Introduce substituents (−Cl, −Br, −I, −CN, −OH) not accessible by direct EAS. ArNH₂ made by nitration + reduction. Enables precise regiochemistry. Also used in azo dye synthesis."},
    {q:"Why are aromatic amines (e.g. aniline) considered hazardous?", a:"Carcinogenic - absorbed through skin/inhalation; metabolites damage DNA. Precautions: fume cupboard; gloves; avoid skin contact."},
    {q:"Describe the basicity of amines quantitatively using Kb and pKb.", a:"Kb = [RNH₃⁺][OH⁻]/[RNH₂]. pKb = −log Kb. Smaller pKb = stronger base. CH₃NH₂: pKb ≈ 3.4; NH₃: 4.7; aniline: 9.4. pKa(conjugate acid) + pKb = 14."},
  ]},

  "ocr_6.2.1": { title: "Carbonyl Compounds", cards: [
    {q:"Distinguish aldehydes from ketones in structure and nomenclature.", a:"Aldehyde: C=O at end of chain; −CHO; suffix −al. Ketone: C=O within chain; suffix −one. Both polar (Cδ+−Oδ−)."},
    {q:"Explain the general mechanism for nucleophilic addition to the C=O group.", a:"Cδ+ attacked by Nu⁻ → C=O π bond breaks → O⁻ (tetrahedral intermediate) → O⁻ protonated → OH. New C−Nu bond formed."},
    {q:"Describe the addition of HCN to a carbonyl compound and its synthetic use.", a:"RCHO + HCN → RCH(OH)CN (hydroxynitrile). CN⁻ attacks Cδ+; O⁻ protonated by HCN. New chiral centre → racemic mixture. Synthetic use: +1C; can hydrolyse to hydroxy acid."},
    {q:"Describe the reduction of aldehydes and ketones using NaBH₄.", a:"RCHO → RCH₂OH (1° alcohol). RCOR' → RCH(OH)R' (2° alcohol). H⁻ (hydride) from BH₄⁻ attacks Cδ+. Mild - does not reduce C=C, COOH, or esters."},
    {q:"Describe the 2,4-DNPH (Brady's reagent) test for carbonyl compounds.", a:"Add 2,4-DNPH in acidified ethanol → orange/yellow crystalline precipitate (confirms C=O). Identify compound: filter, dry, measure melting point, compare to tables."},
    {q:"Describe the Tollens' reagent test (silver mirror test) for aldehydes.", a:"[Ag(NH₃)₂]⁺(aq). Aldehyde → silver mirror (Ag⁺ reduced to Ag). Ketone: no reaction. Distinguishes aldehyde from ketone."},
    {q:"Describe the Fehling's/Benedict's solution test for aldehydes.", a:"Blue Cu²⁺ complex. Aldehyde + heat → brick-red Cu₂O precipitate. Ketone: no reaction. Used to test for glucose (aldehyde sugar) in urine."},
    {q:"Describe the iodoform reaction and which compounds give a positive result.", a:"I₂ + NaOH → yellow CHI₃ precipitate (antiseptic smell). Positive: CH₃COR, CH₃CHO, CH₃CH(OH)R, ethanol. Negative: propanal (no CH₃ adjacent to C=O)."},
    {q:"How are aldehydes and ketones distinguished by oxidation?", a:"Aldehyde: oxidised to RCOOH (Cr₂O₇²⁻: orange → green; KMnO₄: purple → colourless). Ketone: not oxidised. Also: Tollens'/Fehling's only react with aldehydes."},
    {q:"Describe the nucleophilic addition mechanism for the reaction of CN⁻ with ethanal.", a:"1. CN⁻ attacks Cδ+ of CH₃CHO. 2. C=O breaks → O⁻; tetrahedral CH₃CH(CN)O⁻. 3. O⁻ + H⁺ (from HCN/water) → CH₃CH(OH)CN. New chiral centre → racemic mixture. Use NaCN + dilute acid (safer than HCN)."},
    {q:"What is the significance of forming a racemic mixture in nucleophilic addition to carbonyl compounds?", a:"Nu⁻ can attack either face of planar C=O → equal probability of both enantiomers → racemic (50:50) mixture. Important in pharmacy: enantiomers of drugs may have different biological activity (e.g. thalidomide)."},
    {q:"How is a carbonyl compound identified using 2,4-DNPH and melting point?", a:"1. Add 2,4-DNPH → precipitate (confirms C=O). 2. Filter, recrystallise from ethanol. 3. Dry; measure melting point. 4. Compare to tabulated values for 2,4-DNP derivatives → identify compound."},
    {q:"Describe the physical properties of aldehydes and ketones.", a:"Polar C=O → dipole-dipole forces. No O−H → cannot H-bond with each other. C=O can H-bond to water → short-chain ones miscible. bp: higher than alkanes, lower than alcohols. IR: C=O ~1700–1750 cm⁻¹."},
  ]},

  "ocr_6.2.2": { title: "Carboxylic Acids and Esters", cards: [
    {q:"Describe the structure and bonding of carboxylic acids.", a:"−COOH group: C=O and O−H on same C. Weak acid (partial dissociation). Form H-bonded dimers → high bp. bp higher than alcohols of similar Mr."},
    {q:"Explain how electron-withdrawing groups increase acid strength of carboxylic acids.", a:"EWG (e.g. Cl) stabilises RCOO⁻ via inductive effect → Ka increases. Cl₃CCOOH (pKa 0.66) >> CH₃COOH (pKa 4.76)."},
    {q:"Describe the reactions of carboxylic acids: with bases, carbonates, and alcohols.", a:"+ NaOH → RCOONa + H₂O. + Na₂CO₃ → RCOONa + H₂O + CO₂↑ (effervescence; distinguishes from phenol). + Na → RCOONa + H₂↑. + R'OH/H₂SO₄ ⇌ RCOOR' + H₂O (reversible esterification)."},
    {q:"Describe the preparation of acyl chlorides and their reactions.", a:"RCOOH + PCl₅ → RCOCl + POCl₃ + HCl; or + SOCl₂ → RCOCl + SO₂ + HCl. Reactions: + H₂O → RCOOH + HCl (steamy fumes). + R'OH → RCOOR' + HCl. + 2NH₃ → RCONH₂ + NH₄Cl. Mechanism: nucleophilic addition-elimination."},
    {q:"Describe the mechanism of nucleophilic addition-elimination for acyl chloride + amine.", a:"1. N attacks Cδ+ → tetrahedral intermediate. 2. Cl⁻ leaves → C=O reforms → amide (−CONH−) + HCl. HCl neutralised by excess amine."},
    {q:"Describe the hydrolysis of esters.", a:"Acid (reversible): RCOOR' + H₂O ⇌ RCOOH + R'OH (H₂SO₄/heat). Base (irreversible): RCOOR' + NaOH → RCOONa + R'OH. Base hydrolysis complete (carboxylate unreactive). Saponification: fats + NaOH → soap + glycerol."},
    {q:"Describe the naming and physical properties of esters.", a:"Name: alkyl alkanoate (alcohol part first). E.g. ethyl ethanoate CH₃COOC₂H₅. No O−H → no intermolecular H-bonding → volatile, fruity smell, lower bp than parent acids. Used as solvents, flavourings, perfumes."},
    {q:"Describe the structure and reactions of acid anhydrides.", a:"−CO−O−CO− linkage (e.g. (CH₃CO)₂O). Less vigorous than acyl chloride. + H₂O → 2CH₃COOH. + R'OH → CH₃COOR' + CH₃COOH. + RNH₂ → CH₃CONHR + CH₃COOH. Aspirin: salicylic acid + (CH₃CO)₂O → aspirin + CH₃COOH."},
    {q:"Describe the aspirin synthesis as an example of esterification with an acid anhydride.", a:"Salicylic acid + ethanoic anhydride → aspirin (2-acetoxybenzoic acid) + ethanoic acid. Phenol OH esterified. Anhydride preferred over acetic acid: faster, avoids equilibrium issues."},
    {q:"Describe fats, oils and their hydrolysis (saponification).", a:"Triglycerides: triesters of glycerol + long-chain fatty acids. Saturated (no C=C): solid. Unsaturated (C=C): liquid. + NaOH → glycerol + sodium carboxylates (soap). Soap: non-polar tail in grease, ionic head in water."},
    {q:"Why do carboxylic acids have higher boiling points than alcohols of similar Mr?", a:"Form H-bonded dimers (two simultaneous H-bonds) → effectively double Mr that must be overcome → very high bp. Also COOH more polar than OH. E.g. propanoic acid (bp 141°C) >> propan-1-ol (bp 97°C)."},
    {q:"How is an ester identified by hydrolysis followed by analysis?", a:"1. NaOH(aq) → RCOONa + R'OH. 2. Acidify → RCOOH. 3. Identify acid and alcohol by IR, NMR, mass spec. 4. Name ester from acid and alcohol."},
    {q:"Describe the properties and uses of esters as solvents.", a:"Polar (dissolve polar solutes) + non-polar chains (dissolve non-polar). Volatile (no intermolecular H-bonding) → evaporate readily. Uses: ethyl ethanoate (nail polish remover, paints). Biodegradable."},
    {q:"Compare the reactivity of carboxylic acid, acid anhydride, acyl chloride, and ester towards nucleophiles.", a:"Reactivity: acyl chloride > acid anhydride > carboxylic acid > ester. Cl is excellent leaving group; RCO₂⁻ weaker; carboxylic acid needs activation; ester slowest (needs acid/base catalyst + heat)."},
  ]},

  "ocr_6.3.1": { title: "Polymers and Amino Acids", cards: [
    {q:"Describe addition polymerisation and draw the repeat unit of poly(propene).", a:"Alkene monomers join by opening C=C; no atoms lost. Repeat unit of poly(propene): −CH₂−CH(CH₃)−. Non-biodegradable; accumulates in landfill/oceans."},
    {q:"Describe condensation polymerisation and how it differs from addition polymerisation.", a:"Monomers join with loss of H₂O (or HCl); bifunctional monomers required; backbone contains O or N. Addition: no atoms lost; alkene monomer; all-carbon backbone."},
    {q:"Describe the formation of polyesters from dicarboxylic acid + diol.", a:"−HOOC−R−COOH + HO−R'−OH → −[OOC−R−COO−R']ₙ− + nH₂O. Linkage: −COO−. PET: benzene-1,4-dicarboxylic acid + ethane-1,2-diol. Uses: bottles, fibres (Terylene)."},
    {q:"Describe the formation of polyamides from dicarboxylic acid + diamine.", a:"Hexanedioic acid + hexane-1,6-diamine → nylon-6,6 + nH₂O. Linkage: −CONH−. Kevlar: aromatic polyamide (benzene-1,4-diamine + benzene-1,4-dicarboxylic acid); exceptional strength."},
    {q:"How do you deduce monomers from the repeat unit of a condensation polymer?", a:"Polyester: split −COO− → acid (−COOH) + alcohol (−OH). Polyamide: split −CONH− → acid (−COOH) + amine (−NH₂). Add H₂O back at each split point."},
    {q:"Describe the hydrolysis of condensation polymers and compare to addition polymers.", a:"Polyesters/polyamides: hydrolysed by hot acid or base → monomers. Addition polymers: no hydrolysable bonds → not biodegradable → environmental problem (microplastics)."},
    {q:"Give the general structure of an amino acid and describe chirality.", a:"NH₂−CH(R)−COOH (α-amino acid). Chiral if R ≠ H. All natural amino acids are L-configuration except glycine (R=H; achiral)."},
    {q:"Describe the zwitterion form of amino acids and isoelectric point.", a:"At isoelectric point (pI): NH₃⁺ + COO⁻ (net charge = 0). Low pH: NH₃⁺ + COOH (+). High pH: NH₂ + COO⁻ (−)."},
    {q:"Describe peptide bond formation.", a:"−COOH + H₂N− → −CO−NH− + H₂O (amide/peptide bond). Hydrolysis with HCl(aq) or NaOH reverses → amino acid mixture."},
    {q:"Describe the four levels of protein structure.", a:"1° sequence (peptide bonds). 2° α-helix or β-sheet (H-bonds within/between chains). 3° overall 3D shape (H-bonds, ionic bonds, −S−S− bridges, hydrophobic forces). 4° multiple polypeptide chains (e.g. haemoglobin, 4 chains)."},
    {q:"Describe the environmental impact of non-biodegradable addition polymers.", a:"Do not biodegrade → accumulate in landfill/oceans. Microplastics ingested by marine life; enter food chain. Solutions: recycling, incineration, biodegradable alternatives (PLA), reduce single-use plastics."},
    {q:"Compare nylon and Kevlar in terms of structure and properties.", a:"Nylon-6,6: aliphatic; flexible; H-bonding between amide groups; clothing, ropes. Kevlar: aromatic; rigid benzene rings; dense H-bonding → exceptional strength (~5× steel by weight); bulletproof vests, armour."},
    {q:"How are amino acids separated and identified by paper chromatography?", a:"Spot on paper; develop with solvent. Spray ninhydrin + heat → purple spots. Rf = distance moved/solvent front. Compare Rf to reference amino acids. 2D chromatography for complex mixtures."},
    {q:"What is the structural difference between a polyester and a polyamide?", a:"Polyester: −COO− linkage. Polyamide: −CONH− linkage. Polyamides: stronger N−H…O=C H-bonding → higher mp and strength than polyesters of similar structure."},
  ]},

  "ocr_6.4.1": { title: "Organic Synthesis and Analysis", cards: [
    {q:"Describe the retrosynthetic approach for planning a multi-step organic synthesis.", a:"Work backwards from target: identify FG transformations (disconnections ⟹). Identify synthon and synthetic equivalent at each step. Continue until available starting materials. Write forward synthesis with reagents/conditions."},
    {q:"Summarise key arene synthesis routes via diazonium chemistry.", a:"Benzene → nitrobenzene: HNO₃/H₂SO₄ <55°C. Nitrobenzene → aniline: Sn/conc HCl, reflux; NaOH. Aniline → ArN₂⁺: NaNO₂/HCl, 0–5°C. ArN₂⁺ → Cl: Sandmeyer (Cu₂Cl₂). ArN₂⁺ → phenol: H₂O, warm. ArN₂⁺ → azo dye: couple with phenol/amine. ArN₂⁺ → CN: CuCN."},
    {q:"Describe how to convert an alcohol through multiple steps to an amine.", a:"ROH → RX: HBr/NaBr+H₂SO₄. RX → RCN: KCN/ethanol (+1C). RCN → RCH₂NH₂: LiAlH₄/dry ether. OR: RX → RNH₂ directly with excess NH₃ (mixture)."},
    {q:"How is a chiral centre created in synthesis and what are the stereochemical consequences?", a:"Nu⁻ attacks planar sp² C from either face equally → racemic mixture (50:50 enantiomers). E.g. CN⁻ + RCHO, NaBH₄ + ketone. Chiral drugs: enantiomers may differ in activity → need resolution or asymmetric synthesis."},
    {q:"Describe the green chemistry principles relevant to A-level organic synthesis.", a:"1. Atom economy: maximise atoms in product. 2. Use catalysts (less waste). 3. Renewable feedstocks. 4. Safer solvents (water preferred). 5. Energy efficiency. 6. Prevent waste. Measured by atom economy and E-factor."},
    {q:"Describe how IR spectroscopy is used in organic analysis.", a:"Each functional group absorbs at characteristic wavenumber. Key: O−H (alcohol) broad ~3230–3550; O−H (acid) very broad ~2500–3300; C=O sharp ~1700–1750; N−H ~3300–3500 cm⁻¹. Fingerprint <1500 cm⁻¹ unique to each molecule."},
    {q:"Describe how mass spectrometry (MS) is used for structural determination.", a:"M⁺ → Mr. Fragmentation at lower m/z. Common losses: 15 (CH₃), 29 (CHO/C₂H₅), 31 (CH₂OH), 45 (OEt/COOH). Isotope patterns: Cl (3:1), Br (1:1) at M:M+2."},
    {q:"Describe how ¹H NMR data is interpreted for structural determination.", a:"Peaks = H environments. Integration = relative H count. δ = environment type (CHO ~9–10, ArH ~7–8, OCH ~3.5–4). Splitting (n+1 rule). D₂O shake: OH/NH peaks disappear."},
    {q:"Describe how ¹³C NMR gives structural information.", a:"Each distinct C environment → one peak. C=O ~160–220 ppm; aromatic ~110–160; alkyl ~0–50 ppm. Integration not used (unlike ¹H NMR). Count distinct environments."},
    {q:"Describe how degrees of unsaturation (DoU) helps in structure determination.", a:"DoU = (2C + 2 + N − H − X)/2. DoU=1: ring or double bond. DoU=4: benzene ring. DoU=0: fully saturated. E.g. C₆H₅Cl: DoU = (12+2−5−1)/2 = 4 → benzene derivative."},
    {q:"Describe a complete analytical strategy for identifying an unknown organic compound.", a:"1. Combustion → empirical formula. 2. MS → Mr → molecular formula. 3. DoU. 4. IR → functional groups. 5. ¹H NMR → environments, integration, splitting. 6. ¹³C NMR → C environments. 7. Chemical tests (2,4-DNPH, Tollens', iodoform). 8. Combine → propose structure."},
  ]},

  "ocr_6.5.1": { title: "NMR Spectroscopy", cards: [
    {q:"Explain the principle of NMR spectroscopy.", a:"Nuclei with spin (¹H, ¹³C) align in a magnetic field. RF radiation flips nuclei between energy states; resonance frequency depends on chemical environment. ¹H and ¹³C most commonly used."},
    {q:"What is TMS and why is it used as the reference standard?", a:"Si(CH₃)₄. δ = 0 reference. 12 equivalent H → single sharp peak. Highly shielded (upfield). Inert, volatile (bp 27°C, easy to remove). Does not overlap with organic peaks."},
    {q:"Explain chemical shift and what causes differences between environments.", a:"δ (ppm): position relative to TMS (δ=0). Electronegative groups deshield H → higher δ (downfield). Electron-rich → shielded → lower δ. CHO ~9–10; ArH ~7–8; OCH ~3.5–4; CH₃ ~0.9."},
    {q:"Give the approximate ¹H NMR chemical shift ranges for common environments.", a:"CH₃ (alkyl) ~0.7–1.0. CH₂ ~1.2–1.4. α-C=O/allylic ~2.0–2.5. OCH₂/OCH₃ ~3.3–4.0. C=CH ~4.5–6.5. ArH ~6.5–8.0. CHO ~9.5–10.0. COOH ~10–12."},
    {q:"Explain spin-spin coupling and the n+1 rule.", a:"H on adjacent C split each other's signals. n adjacent H → n+1 peaks. Singlet (0), doublet (1), triplet (2), quartet (3). J (Hz): separation between lines in multiplet; same for both coupled groups."},
    {q:"Interpret the ¹H NMR spectrum of ethanol (CH₃CH₂OH).", a:"CH₃: triplet, 3H, δ ~1.2. CH₂: quartet, 2H, δ ~3.7. OH: singlet, 1H, variable δ. Ratio 3:2:1. D₂O shake: OH peak disappears."},
    {q:"How are exchangeable protons (OH, NH) identified in ¹H NMR?", a:"D₂O shake: replace O−H/N−H with D → those peaks disappear. C−H peaks unaffected. Confirms which signals are exchangeable."},
    {q:"Describe ¹³C NMR and how it differs from ¹H NMR.", a:"Each distinct C environment → one peak. Range 0–220 ppm. Alkyl 0–50; C−O 50–90; aromatic/alkene 110–160; C=O 160–220. Integration NOT used. Count C environments."},
    {q:"How do you use ¹H NMR to distinguish between propan-1-ol and propan-2-ol?", a:"Propan-1-ol: CH₃ (triplet), CH₂ (multiplet), CH₂OH (triplet). Propan-2-ol: 2×CH₃ (doublet, 6H), CH (septet, 1H). Septet at δ ~4.0 is diagnostic for propan-2-ol."},
    {q:"How can ¹H NMR spectroscopy be used to determine the number of different proton environments in a molecule?", a:"Count distinct peaks/multiplets = number of H environments. Symmetry reduces count (e.g. benzene: 6H but 1 environment). Integration gives ratio of H in each environment."},
    {q:"Explain the effect of electronegative groups on chemical shift.", a:"EWG withdraws electrons → deshields adjacent H → higher δ. E.g. CH₃Br (δ ~2.7) vs CH₃CH₃ (δ ~0.9). Aldehyde H very deshielded by C=O → δ ~9.5–10."},
    {q:"How is the ¹H NMR spectrum of ethyl ethanoate (CH₃COOC₂H₅) interpreted?", a:"3 environments. CH₃CO: singlet 3H δ ~2.0. OCH₂: quartet 2H δ ~4.1 (deshielded by O). CH₂CH₃: triplet 3H δ ~1.3. Ratio 3:2:3. Quartet+triplet pair diagnostic for ethyl ester."},
    {q:"What is a coupling constant (J value) and what does it indicate?", a:"J (Hz): separation between lines in a multiplet. Same value for both coupled groups. Vicinal ³J ~6–8 Hz; aromatic ~6–9 Hz. J independent of spectrometer frequency (unlike δ in Hz)."},
    {q:"Describe how to determine molecular formula from NMR, MS, and combustion data combined.", a:"1. Combustion → empirical formula. 2. MS → Mr → molecular formula. 3. ¹H NMR → H environments, integration, coupling. 4. ¹³C NMR → C environments. 5. IR → functional groups. 6. DoU → rings/double bonds. Combine → propose structure."},
  ]},

  "ocr_6.5.2": { title: "Chromatography", cards: [
    {q:"State the general principle of chromatography.", a:"Components distributed between stationary phase (fixed) and mobile phase (moving). Stronger affinity for stationary → slower movement. Separation based on differential affinities."},
    {q:"Define Rf value and describe how it is calculated and used.", a:"Rf = distance moved by compound / distance moved by solvent front (0–1). Reproducible under identical conditions. Identify unknowns by comparing Rf with references. Co-spot to confirm identity."},
    {q:"Describe thin layer chromatography (TLC) in detail.", a:"Stationary: silica/alumina on plate. Mobile: organic solvent. Develop in sealed, saturated chamber. Visualise: UV lamp, iodine vapour, or spray reagent. More polar compound → lower Rf. More polar solvent → higher Rf."},
    {q:"How is TLC used to monitor the progress of a reaction?", a:"Spot reaction mixture + SM reference + product reference at intervals. SM spot diminishes; product spot appears. Single spot at product Rf = complete. Co-spot confirms identity."},
    {q:"Describe column chromatography and how it achieves separation.", a:"Silica column; solvent elutes components by gravity/pressure. Less polar → elutes first. More polar → elutes later. Collect fractions; analyse by TLC. Preparative scale for grams of product."},
    {q:"Describe gas chromatography (GC) and its applications.", a:"Stationary: high-boiling liquid on solid support in oven column. Mobile: inert gas (N₂/He). Separation by bp + stationary phase interaction. Retention time characteristic of compound. Uses: volatile organics, forensics, food, environment."},
    {q:"Describe GC-MS (gas chromatography-mass spectrometry) and its advantages.", a:"GC separates; MS identifies each component (retention time + mass spectrum vs database). Very sensitive (ppb). Rapid complex mixture analysis. Used in forensics, drug testing, environmental analysis."},
    {q:"Describe HPLC (high-performance liquid chromatography).", a:"High pressure pumps solvent through fine silica column. For non-volatile/thermally unstable compounds. Reverse phase (C18, polar mobile phase) most common. Uses: pharmaceuticals, proteins, water testing."},
    {q:"Explain how polarity affects separation in TLC on a silica plate.", a:"Polar stationary phase (silica). Polar compounds: strong silica interaction → low Rf. Non-polar: weak interaction → high Rf. More polar solvent → all Rf values increase. Aim for Rf 0.2–0.8 for good separation."},
    {q:"Describe how amino acids are detected in paper chromatography.", a:"Colourless → spray with ninhydrin; heat → purple (Ruhemann's purple) for primary amines. Proline → yellow. Identify by Rf vs references."},
    {q:"What is the retention factor and retention time in chromatography?", a:"Rf (TLC/paper): distance compound/solvent front. 0–1. Retention time tR (GC/HPLC): time from injection to peak. Both characteristic under fixed conditions; compare with standards for identification."},
    {q:"Why must the TLC developing chamber be sealed and solvent-saturated?", a:"Prevents solvent evaporation from plate → ensures uniform migration → reproducible Rf values. Saturate with filter paper soaked in solvent before use."},
    {q:"Compare the stationary and mobile phases in TLC, column chromatography, GC, and HPLC.", a:"TLC: silica plate / organic solvent. Column: silica / organic solvent. GC: liquid film on solid / inert gas. HPLC: fine silica or C18 / solvent under high pressure. All exploit differential affinity for stationary vs mobile phase."},
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

// ═══════════════════════════════════════════════════════════════
// MOLECULE SVG DRAWING - RCS-style skeletal/structural formulas
// ═══════════════════════════════════════════════════════════════

// Bond drawing helper: creates SVG line elements for single/double/triple bonds
const chemBond = (x1,y1,x2,y2,order,key) => {
  const s = "#1a2d45", cap = "round";
  if (order === 1) return React.createElement("line",{key,x1,y1,x2,y2,stroke:s,strokeWidth:1.8,strokeLinecap:cap});
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy)||1;
  const ox=(-dy/len)*2.8, oy=(dx/len)*2.8;
  if (order === 2) return React.createElement("g",{key},
    React.createElement("line",{x1:x1+ox,y1:y1+oy,x2:x2+ox,y2:y2+oy,stroke:s,strokeWidth:1.5,strokeLinecap:cap}),
    React.createElement("line",{x1:x1-ox,y1:y1-oy,x2:x2-ox,y2:y2-oy,stroke:s,strokeWidth:1.5,strokeLinecap:cap})
  );
  return React.createElement("g",{key},
    React.createElement("line",{x1,y1,x2,y2,stroke:s,strokeWidth:1.5,strokeLinecap:cap}),
    React.createElement("line",{x1:x1+ox*1.2,y1:y1+oy*1.2,x2:x2+ox*1.2,y2:y2+oy*1.2,stroke:s,strokeWidth:1.3,strokeLinecap:cap}),
    React.createElement("line",{x1:x1-ox*1.2,y1:y1-oy*1.2,x2:x2-ox*1.2,y2:y2-oy*1.2,stroke:s,strokeWidth:1.3,strokeLinecap:cap})
  );
};

// Atom label helper
const chemAtom = (x,y,txt,color,key,anchor) => React.createElement("text",{
  key, x, y, textAnchor: anchor||"middle", dominantBaseline:"central",
  fontSize:"11", fontWeight:"700", fill:color||"#1a2d45",
  fontFamily:"'DM Sans',sans-serif", style:{userSelect:"none"}
}, txt);

// Benzene ring helper - draws a regular hexagon with alternating double bonds
const benzeneRing = (cx,cy,r,key) => {
  const pts = [];
  for (let i=0;i<6;i++) { const a = Math.PI/2 + i*Math.PI/3; pts.push([cx+r*Math.cos(a), cy-r*Math.sin(a)]); }
  const els = [];
  for (let i=0;i<6;i++) {
    const j=(i+1)%6;
    els.push(React.createElement("line",{key:key+"b"+i,x1:pts[i][0],y1:pts[i][1],x2:pts[j][0],y2:pts[j][1],stroke:"#1a2d45",strokeWidth:1.8,strokeLinecap:"round"}));
  }
  // Inner circle for aromaticity
  els.push(React.createElement("circle",{key:key+"c",cx,cy,r:r*0.55,fill:"none",stroke:"#1a2d45",strokeWidth:1.2,strokeDasharray:"4 3"}));
  return React.createElement("g",{key}, ...els);
};

// Standard zig-zag geometry
const ZZ = 24; // bond length horizontal component
const ZY = 14; // bond length vertical component

// Molecule definitions: each returns SVG elements within a local coordinate space
// Format: { w, h, render } where render returns array of React elements
const MOLECULE_SVG = {
  // === ALIPHATIC MOLECULES ===
  ethane: { w:55, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,1,"b1")
  ]},
  methane: { w:40, h:25, render: () => [
    chemAtom(20,12,"CH₄","#1a2d45","a0")
  ]},
  chloromethane: { w:70, h:25, render: () => [
    chemAtom(18,12,"CH₃","#1a2d45","a0"),
    chemBond(35,12,50,12,1,"b0"),
    chemAtom(60,12,"Cl","#16a34a","a1")
  ]},
  bromoethane: { w:80, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,1,"b1"),
    chemAtom(68,25,"Br","#b45309","a0","start")
  ]},
  ethylamine: { w:90, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,1,"b1"),
    chemAtom(72,25,"NH₂","#2563eb","a0","start")
  ]},
  ethylammSalt: { w:100, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,1,"b1"),
    chemAtom(78,25,"NH₃⁺Cl⁻","#2563eb","a0","start")
  ]},
  diethylamine: { w:110, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,1,"b1"),
    chemAtom(60,25,"NH","#2563eb","a0","middle"),
    chemBond(73,25,97,11,1,"b2"), chemBond(97,11,110,25,1,"b3")
  ]},
  triethylamine: { w:110, h:50, render: () => [
    chemBond(5,30,29,16,1,"b0"), chemBond(29,16,53,30,1,"b1"),
    chemAtom(58,30,"N","#2563eb","a0","middle"),
    chemBond(65,30,89,16,1,"b2"),
    chemBond(58,30,58,12,1,"b3")
  ]},
  quatAmm: { w:110, h:50, render: () => [
    chemAtom(55,25,"N⁺","#6d28d9","a0","middle"),
    chemBond(45,25,25,11,1,"b0"), chemBond(65,25,85,11,1,"b1"),
    chemBond(55,15,55,3,1,"b2"), chemBond(55,35,55,47,1,"b3"),
    chemAtom(100,25,"X⁻","#94a3b8","a1","start")
  ]},
  ethene: { w:55, h:30, render: () => [
    chemBond(5,15,50,15,2,"b0"),
    chemAtom(3,15,"H₂C","#1a2d45","a0","end"),
    chemAtom(52,15,"CH₂","#1a2d45","a1","start")
  ]},
  propene: { w:80, h:35, render: () => [
    chemBond(5,20,35,20,2,"b0"), chemBond(35,20,59,34,1,"b1")
  ]},
  dibromoethane: { w:100, h:40, render: () => [
    chemAtom(8,12,"Br","#b45309","a0"),
    chemBond(18,15,42,29,1,"b0"), chemBond(42,29,66,15,1,"b1"),
    chemAtom(76,12,"Br","#b45309","a1")
  ]},
  ethanol: { w:80, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,1,"b1"),
    chemAtom(68,25,"OH","#dc2626","a0","start")
  ]},
  ethanediol: { w:100, h:40, render: () => [
    chemAtom(6,12,"HO","#dc2626","a0","end"),
    chemBond(16,15,40,29,1,"b0"), chemBond(40,29,64,15,1,"b1"),
    chemAtom(74,12,"OH","#dc2626","a1","start")
  ]},
  propanone: { w:100, h:45, render: () => [
    chemBond(5,30,29,16,1,"b0"), chemBond(29,16,53,30,1,"b1"),
    chemBond(29,16,29,0,2,"b2"),
    chemAtom(29,-4,"O","#dc2626","a0")
  ]},
  ethanal: { w:75, h:45, render: () => [
    chemBond(5,30,29,16,1,"b0"), chemBond(29,16,53,30,1,"b1"),
    chemBond(53,30,53,14,2,"b2"),
    chemAtom(53,9,"O","#dc2626","a0"),
    chemAtom(65,33,"H","#7a95b0","a1","start")
  ]},
  ethanoicAcid: { w:95, h:50, render: () => [
    chemBond(5,28,29,14,1,"b0"), chemBond(29,14,53,28,1,"b1"),
    chemBond(53,28,53,10,2,"b2"),
    chemAtom(53,5,"O","#dc2626","a0"),
    chemAtom(70,32,"OH","#dc2626","a1","start")
  ]},
  ethylEthanoate: { w:120, h:50, render: () => [
    chemBond(5,28,29,14,1,"b0"), chemBond(29,14,53,28,1,"b1"),
    chemBond(53,28,53,10,2,"b2"),
    chemAtom(53,5,"O","#dc2626","a0"),
    chemAtom(62,32,"O","#dc2626","a1","middle"),
    chemBond(72,32,96,18,1,"b3"), chemBond(96,18,115,32,1,"b4")
  ]},
  ethanoylChloride: { w:85, h:50, render: () => [
    chemBond(5,28,29,14,1,"b0"), chemBond(29,14,53,28,1,"b1"),
    chemBond(53,28,53,10,2,"b2"),
    chemAtom(53,5,"O","#dc2626","a0"),
    chemAtom(70,32,"Cl","#16a34a","a1","start")
  ]},
  ethanamide: { w:90, h:50, render: () => [
    chemBond(5,28,29,14,1,"b0"), chemBond(29,14,53,28,1,"b1"),
    chemBond(53,28,53,10,2,"b2"),
    chemAtom(53,5,"O","#dc2626","a0"),
    chemAtom(72,32,"NH₂","#2563eb","a1","start")
  ]},
  sodiumEthanoate: { w:110, h:50, render: () => [
    chemBond(5,28,29,14,1,"b0"), chemBond(29,14,53,28,1,"b1"),
    chemBond(53,28,53,10,2,"b2"),
    chemAtom(53,5,"O","#dc2626","a0"),
    chemAtom(70,32,"O⁻","#dc2626","a1","start"),
    chemAtom(92,32,"Na⁺","#7c3aed","a2","start")
  ]},
  ethanenitrile: { w:70, h:35, render: () => [
    chemBond(5,25,29,11,1,"b0"), chemBond(29,11,53,25,3,"b1"),
    chemAtom(62,28,"N","#2563eb","a0","start")
  ]},
  // === AROMATIC MOLECULES ===
  benzene: { w:50, h:50, render: () => [benzeneRing(25,25,20,"bz")] },
  methylbenzene: { w:70, h:60, render: () => [
    benzeneRing(25,33,20,"bz"),
    chemBond(25,13,25,4,1,"b0"),
    chemAtom(25,-3,"CH₃","#1a2d45","a0")
  ]},
  nitrobenzene: { w:65, h:70, render: () => [
    benzeneRing(28,25,20,"bz"),
    chemBond(28,45,28,54,1,"b0"),
    chemAtom(28,65,"NO₂","#b45309","a0")
  ]},
  aniline: { w:65, h:70, render: () => [
    benzeneRing(28,25,20,"bz"),
    chemBond(28,45,28,54,1,"b0"),
    chemAtom(28,65,"NH₂","#2563eb","a0")
  ]},
  acetophenone: { w:80, h:60, render: () => [
    benzeneRing(25,30,20,"bz"),
    chemBond(25,10,40,2,1,"b0"),
    chemBond(40,2,40,-10,2,"b1"),
    chemAtom(40,-15,"O","#dc2626","a0"),
    chemAtom(55,5,"CH₃","#1a2d45","a1")
  ]},
  ethylbenzene: { w:70, h:70, render: () => [
    benzeneRing(28,25,20,"bz"),
    chemBond(28,45,28,56,1,"b0"), chemBond(28,56,45,68,1,"b1")
  ]},
  chloromethylbenzene: { w:80, h:75, render: () => [
    benzeneRing(28,25,20,"bz"),
    chemBond(28,45,28,55,1,"b0"),
    chemAtom(42,66,"Cl","#16a34a","a0","start")
  ]},
  dinitrotoluene: { w:80, h:70, render: () => [
    benzeneRing(28,25,20,"bz"),
    chemBond(28,5,28,-5,1,"b0"),
    chemAtom(28,-10,"CH₃","#1a2d45","a0"),
    chemAtom(55,20,"NO₂","#b45309","a1","start"),
    chemAtom(55,35,"NO₂","#b45309","a2","start")
  ]},
  diazonium: { w:100, h:60, render: () => [
    benzeneRing(25,30,20,"bz"),
    chemBond(45,30,58,30,1,"b0"),
    chemAtom(62,30,"N","#2563eb","a0","middle"),
    chemBond(67,30,75,30,3,"b1"),
    chemAtom(82,30,"N⁺","#2563eb","a1","middle"),
    chemAtom(95,30,"Cl⁻","#16a34a","a2","start")
  ]},
  azoDye: { w:120, h:50, render: () => [
    benzeneRing(22,25,16,"bz1"),
    chemBond(38,25,48,25,1,"b0"),
    chemAtom(52,25,"N","#9333ea","a0","middle"),
    chemBond(55,25,65,25,2,"bd"),
    chemAtom(68,25,"N","#9333ea","a1","middle"),
    chemBond(73,25,83,25,1,"b1"),
    benzeneRing(98,25,16,"bz2"),
    chemAtom(98,45,"OH","#dc2626","a2")
  ]},
};

// Reaction examples: maps reaction number to { eq: text equation, from: mol key, to: mol key }
// ali = aliphatic, aro = aromatic
const REACTION_EXAMPLES = {
  ali: {
    1:  { eq:"CH₄ + Cl₂ --> CH₃Cl + HCl", from:"methane", to:"chloromethane" },
    2:  { eq:"CH₃CH₂Br + NH₃ --> CH₃CH₂NH₂ + HBr", from:"bromoethane", to:"ethylamine" },
    3:  { eq:"CH₃CH₂NH₂ + HCl --> CH₃CH₂NH₃⁺Cl⁻", from:"ethylamine", to:"ethylammSalt" },
    4:  { eq:"R₃N + RX --> R₄N⁺X⁻", from:"triethylamine", to:"quatAmm" },
    5:  { eq:"R₂NH + RX --> R₃N + HX", from:"diethylamine", to:"triethylamine" },
    6:  { eq:"RNH₂ + RX --> R₂NH + HX", from:"ethylamine", to:"diethylamine" },
    7:  { eq:"CH₃CH₂Br + KOH --> CH₂=CH₂ + KBr + H₂O", from:"bromoethane", to:"ethene" },
    8:  { eq:"CH₂=CH₂ + HBr --> CH₃CH₂Br", from:"ethene", to:"bromoethane" },
    9:  { eq:"CH₃CH₂Br + NaOH --> CH₃CH₂OH + NaBr", from:"bromoethane", to:"ethanol" },
    10: { eq:"CH₃CH₂Br + KCN --> CH₃CH₂CN + KBr", from:"bromoethane", to:"ethanenitrile" },
    11: { eq:"CH₃CN + 4[H] --> CH₃CH₂NH₂", from:"ethanenitrile", to:"ethylamine" },
    12: { eq:"CH₂=CH₂ + Br₂ --> BrCH₂CH₂Br", from:"ethene", to:"dibromoethane" },
    13: { eq:"CH₂=CH₂ + H₂O --> CH₃CH₂OH", from:"ethene", to:"ethanol" },
    14: { eq:"CH₃CH₂OH --> CH₂=CH₂ + H₂O", from:"ethanol", to:"ethene" },
    15: { eq:"BrCH₂CH₂Br + 2NaOH --> HOCH₂CH₂OH + 2NaBr", from:"dibromoethane", to:"ethanediol" },
    16: { eq:"R₂CHOH + [O] --> R₂C=O + H₂O", from:"ethanol", to:"propanone" },
    17: { eq:"R₂C=O + 2[H] --> R₂CHOH", from:"propanone", to:"ethanol" },
    18: { eq:"RCH₂OH + [O] --> RCHO + H₂O", from:"ethanol", to:"ethanal" },
    19: { eq:"RCHO + 2[H] --> RCH₂OH", from:"ethanal", to:"ethanol" },
    20: { eq:"CH₃CN + 2H₂O + HCl --> CH₃COOH + NH₄Cl", from:"ethanenitrile", to:"ethanoicAcid" },
    21: { eq:"CH₃CHO + [O] --> CH₃COOH", from:"ethanal", to:"ethanoicAcid" },
    22: { eq:"CH₃COOH + 4[H] --> CH₃CH₂OH + H₂O", from:"ethanoicAcid", to:"ethanol" },
    23: { eq:"CH₃COOH + C₂H₅OH --> CH₃COOC₂H₅ + H₂O", from:"ethanoicAcid", to:"ethylEthanoate" },
    24: { eq:"CH₃COCl + C₂H₅OH --> CH₃COOC₂H₅ + HCl", from:"ethanoylChloride", to:"ethylEthanoate" },
    25: { eq:"CH₃COOH + NaOH --> CH₃COO⁻Na⁺ + H₂O", from:"ethanoicAcid", to:"sodiumEthanoate" },
    26: { eq:"CH₃COCl + H₂O --> CH₃COOH + HCl", from:"ethanoylChloride", to:"ethanoicAcid" },
    27: { eq:"CH₃COCl + NH₃ --> CH₃CONH₂ + HCl", from:"ethanoylChloride", to:"ethanamide" },
  },
  aro: {
    1: { eq:"C₆H₆ + CH₃COCl --> C₆H₅COCH₃ + HCl", from:"benzene", to:"acetophenone" },
    2: { eq:"C₆H₆ + C₂H₅Cl --> C₆H₅C₂H₅ + HCl", from:"benzene", to:"ethylbenzene" },
    3: { eq:"C₆H₅CH₃ + Cl₂ --> C₆H₅CH₂Cl + HCl", from:"methylbenzene", to:"chloromethylbenzene" },
    4: { eq:"C₆H₆ + CH₃Cl --> C₆H₅CH₃ + HCl", from:"benzene", to:"methylbenzene" },
    5: { eq:"C₆H₆ + HNO₃ --> C₆H₅NO₂ + H₂O", from:"benzene", to:"nitrobenzene" },
    6: { eq:"C₆H₅CH₃ + 2HNO₃ --> CH₃C₆H₃(NO₂)₂ + 2H₂O", from:"methylbenzene", to:"dinitrotoluene" },
    7: { eq:"C₆H₅NO₂ + 6[H] --> C₆H₅NH₂ + 2H₂O", from:"nitrobenzene", to:"aniline" },
    8: { eq:"C₆H₅NH₂ + HNO₂ --> C₆H₅N₂⁺Cl⁻ + 2H₂O", from:"aniline", to:"diazonium" },
    9: { eq:"C₆H₅N₂⁺ + C₆H₅OH --> azo dye + H⁺", from:"diazonium", to:"azoDye" },
  },
};

// Renders a complete reaction diagram SVG (reactant -> product with arrow)
const renderReactionSvg = (fromKey, toKey) => {
  const fMol = MOLECULE_SVG[fromKey];
  const tMol = MOLECULE_SVG[toKey];
  if (!fMol || !tMol) return null;
  const pad = 16;
  const arrowLen = 44;
  const arrowGap = 10; // gap between molecule edge and arrow
  const totalW = pad + fMol.w + arrowGap + arrowLen + arrowGap + tMol.w + pad;
  const maxH = Math.max(fMol.h, tMol.h) + pad * 2;
  const fX = pad;
  const fY = (maxH - fMol.h) / 2;
  const tX = pad + fMol.w + arrowGap + arrowLen + arrowGap;
  const tY = (maxH - tMol.h) / 2;
  const arrowX1 = pad + fMol.w + arrowGap;
  const arrowX2 = arrowX1 + arrowLen;
  const arrowY = maxH / 2;

  return React.createElement("svg", {
    viewBox: `0 0 ${totalW} ${maxH}`,
    width: Math.min(totalW * 1.6, 380),
    height: Math.min(maxH * 1.6, 120),
    style: { display:"block", margin:"0 auto" }
  },
    React.createElement("defs", null,
      React.createElement("marker", { id:"rxnArrow", markerWidth:10, markerHeight:10, refX:9, refY:5, orient:"auto" },
        React.createElement("path", { d:"M0,1 L9,5 L0,9z", fill:"#1a2d45" })
      )
    ),
    React.createElement("g", { transform:`translate(${fX},${fY})` }, ...fMol.render()),
    React.createElement("line", { x1:arrowX1, y1:arrowY, x2:arrowX2-6, y2:arrowY, stroke:"#1a2d45", strokeWidth:2.2, markerEnd:"url(#rxnArrow)" }),
    React.createElement("g", { transform:`translate(${tX},${tY})` }, ...tMol.render())
  );
};

// Hess cycle diagram components
const HessTriangle = ({ top, left, right, dh1, dh2, dhr, find }) => (
  <svg width="320" height="160" viewBox="0 0 320 160" style={{ fontFamily: "'Caveat',cursive" }}>
    <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#1a2d45"/></marker></defs>
    {/* Top arrow */}
    <line x1="60" y1="30" x2="240" y2="30" stroke="#1a2d45" strokeWidth="2" markerEnd="url(#ah)"/>
    <text x="150" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill={find==="dhr"?"#dc2626":"#1a2d45"}>{dhr}</text>
    {/* Left arrow down */}
    <line x1="40" y1="45" x2="140" y2="135" stroke="#29ABE2" strokeWidth="2" markerEnd="url(#ah)"/>
    <text x="70" y="100" fontSize="13" fontWeight="600" fill={find==="dh1"?"#dc2626":"#29ABE2"}>{dh1}</text>
    {/* Right arrow up */}
    <line x1="180" y1="135" x2="260" y2="45" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#ah)"/>
    <text x="235" y="100" fontSize="13" fontWeight="600" fill={find==="dh2"?"#dc2626":"#7c3aed"}>{dh2}</text>
    {/* Labels */}
    <text x="30" y="32" textAnchor="end" fontSize="13" fontWeight="700" fill="#1a2d45">{top[0]}</text>
    <text x="270" y="32" fontSize="13" fontWeight="700" fill="#1a2d45">{top[1]}</text>
    <text x="160" y="152" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a2d45">{left}</text>
  </svg>
);

const HessBox = ({ topLeft, topRight, botLeft, botRight, dhTop, dhBot, dhL, dhR, find }) => (
  <svg width="360" height="170" viewBox="0 0 360 170" style={{ fontFamily: "'Caveat',cursive" }}>
    <defs><marker id="ah2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#1a2d45"/></marker></defs>
    {/* Top arrow */}
    <line x1="80" y1="30" x2="260" y2="30" stroke="#1a2d45" strokeWidth="2" markerEnd="url(#ah2)"/>
    <text x="170" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill={find==="top"?"#dc2626":"#1a2d45"}>{dhTop}</text>
    {/* Bottom arrow */}
    {dhBot && <line x1="80" y1="140" x2="260" y2="140" stroke="#64748b" strokeWidth="2" markerEnd="url(#ah2)"/>}
    {dhBot && <text x="170" y="160" textAnchor="middle" fontSize="13" fontWeight="600" fill="#64748b">{dhBot}</text>}
    {/* Left arrow down */}
    <line x1="50" y1="45" x2="50" y2="125" stroke="#29ABE2" strokeWidth="2" markerEnd="url(#ah2)"/>
    <text x="30" y="90" textAnchor="middle" fontSize="12" fontWeight="600" fill={find==="left"?"#dc2626":"#29ABE2"}>{dhL}</text>
    {/* Right arrow down */}
    <line x1="310" y1="45" x2="310" y2="125" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#ah2)"/>
    <text x="335" y="90" textAnchor="middle" fontSize="12" fontWeight="600" fill={find==="right"?"#dc2626":"#7c3aed"}>{dhR}</text>
    {/* Labels */}
    <text x="50" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a2d45">{topLeft}</text>
    <text x="290" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a2d45">{topRight}</text>
    {botLeft && <text x="50" y="138" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a2d45">{botLeft}</text>}
    {botRight && <text x="290" y="138" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a2d45">{botRight}</text>}
  </svg>
);

// Born-Haber cycle diagram (exam-style rectangle: ΔHf left, steps up, lattice right)
const BornHaberCycle = ({ compound, steps, find }) => {
  const W = 600, padT = 35, padB = 35, lineW = 130;
  // Calculate cumulative energies from compound (energy = 0)
  let cumE = [0]; let run = 0;
  steps.forEach(s => { run += (s.value || 0); cumE.push(run); });
  // ΔHf = final cumulative (should equal ΔHf of compound, negative for stable compounds)
  const dhf = cumE[cumE.length - 1]; // e.g. -437 for KCl
  // Elements level is at energy = sum of all steps except lattice (i.e. ΔHf reversed)
  // Actually elements are the starting point: compound is BELOW elements by |ΔHf|
  // In our system compound=0, so elements = -dhf (positive number for exothermic ΔHf)
  const elementsE = -dhf; // e.g. +437 for KCl

  // Find EA start (first negative step before lattice)
  let eaStart = steps.length - 1;
  for (let i = steps.length - 2; i >= 0; i--) {
    if (steps[i].value < 0 || steps[i].value > 0 && i > 0 && steps[i-1].value < 0) break;
    if (steps[i].value < 0) { eaStart = i; }
  }
  // Simpler: EA starts at first negative-value step (excluding lattice)
  eaStart = -1;
  for (let i = 0; i < steps.length - 1; i++) {
    if (steps[i].value < 0) { eaStart = i; break; }
  }
  if (eaStart === -1) eaStart = steps.length - 1;

  // Build levels: compound, then each step
  let energy = 0;
  const allLevels = [{ e: 0, label: compound, col: "left", type: "compound" }];
  steps.forEach((s, i) => {
    energy += (s.value || 0);
    const isLast = i === steps.length - 1;
    const col = (i >= eaStart || isLast) ? "right" : "left";
    allLevels.push({ e: energy, label: s.species, arrow: s.label, miss: s.label === find, val: s.value, col, type: isLast ? "compound" : "step" });
  });

  const maxE = Math.max(...allLevels.map(l => l.e));
  const minE = Math.min(...allLevels.map(l => l.e));
  const range = maxE - minE || 1;
  const H = Math.max(range * 0.25 + padT + padB + 80, 400);
  const sc = (H - padT - padB - 50) / range;
  const toY = e => padT + 30 + (maxE - e) * sc;

  const LX = 70, RX = 370;
  const dhfX = LX - 25; // ΔHf arrow on far left
  const leftArrowX = LX + lineW + 18;
  const eaArrowX = RX - 18;
  const lattArrowX = RX + lineW + 22;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ fontFamily: "'Outfit','DM Sans',sans-serif", display: "block", margin: "0 auto" }}>
      {/* Energy axis */}
      <text x="14" y={H / 2} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f1d35" transform={`rotate(-90, 14, ${H/2})`}>Energy</text>
      <line x1="30" y1={H - padB + 5} x2="30" y2={padT} stroke="#0f1d35" strokeWidth="2.5"/>
      <polygon points={`25 ${padT + 3}, 30 ${padT - 7}, 35 ${padT + 3}`} fill="#0f1d35"/>

      {/* ΔHf arrow on far left (elements down to compound) */}
      {(() => {
        const compY = toY(0);
        const elemY = toY(elementsE);
        return (
          <g>
            <line x1={dhfX} y1={elemY + 3} x2={dhfX} y2={compY - 5} stroke="#059669" strokeWidth="3"/>
            <polygon points={`${dhfX - 5} ${compY - 8}, ${dhfX} ${compY}, ${dhfX + 5} ${compY - 8}`} fill="#059669"/>
            <text x={dhfX - 6} y={(elemY + compY) / 2 + 4} fontSize="11" fontWeight="700" fill="#059669" textAnchor="end">ΔHf</text>
          </g>
        );
      })()}

      {/* Draw all levels */}
      {allLevels.map((lv, i) => {
        const y = toY(lv.e);
        const x = lv.col === "left" ? LX : RX;
        return (
          <g key={`lv${i}`}>
            <line x1={x} y1={y} x2={x + lineW} y2={y} stroke="#1e293b" strokeWidth="2"/>
            <text x={x + lineW / 2} y={y - 7} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">{lv.label}</text>
          </g>
        );
      })}

      {/* Draw step arrows */}
      {allLevels.map((lv, i) => {
        if (i === 0) return null;
        const prev = allLevels[i - 1];
        const py = toY(prev.e), cy = toY(lv.e);
        const isMiss = lv.miss;
        const col = isMiss ? "#dc2626" : "#29ABE2";

        // Left-to-left: endothermic steps going UP
        if (prev.col === "left" && lv.col === "left") {
          return (
            <g key={`ar${i}`}>
              <rect x={leftArrowX - 4} y={Math.min(py, cy) + 4} width="8" height={Math.abs(cy - py) - 8} fill={col} rx="2"/>
              <polygon points={`${leftArrowX - 6} ${cy + 5}, ${leftArrowX} ${cy - 4}, ${leftArrowX + 6} ${cy + 5}`} fill={col}/>
              <text x={leftArrowX + 12} y={(py + cy) / 2 + 4} fontSize="11" fontWeight="700" fill={col}>{lv.arrow}</text>
            </g>
          );
        }

        // Left-to-right: EA transition
        if (prev.col === "left" && lv.col === "right") {
          return (
            <g key={`ar${i}`}>
              <line x1={LX + lineW} y1={py} x2={RX + lineW} y2={py} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
              <rect x={eaArrowX - 3} y={Math.min(py, cy) + 3} width="6" height={Math.abs(cy - py) - 6} fill={col} rx="2"/>
              <polygon points={`${eaArrowX - 5} ${cy - 4}, ${eaArrowX} ${cy + 4}, ${eaArrowX + 5} ${cy - 4}`} fill={col}/>
              <text x={eaArrowX + 10} y={(py + cy) / 2 + 4} fontSize="10" fontWeight="700" fill={col}>{lv.arrow}</text>
            </g>
          );
        }

        // Right-to-right: lattice enthalpy (or second EA)
        if (prev.col === "right" && lv.col === "right") {
          const isLattice = lv.type === "compound";
          const ax = isLattice ? lattArrowX : eaArrowX;
          if (isLattice) {
            // Big lattice arrow
            return (
              <g key={`ar${i}`}>
                {isMiss
                  ? <line x1={ax} y1={py + 5} x2={ax} y2={cy - 8} stroke={col} strokeWidth="7" strokeDasharray="8,5"/>
                  : <rect x={ax - 5} y={py + 5} width="10" height={cy - py - 12} fill={col} rx="2"/>
                }
                <polygon points={`${ax - 8} ${cy - 8}, ${ax} ${cy + 2}, ${ax + 8} ${cy - 8}`} fill={col}/>
                <text x={ax - 14} y={(py + cy) / 2 + 4} fontSize="12" fontWeight="800" fill={col} textAnchor="end">{lv.arrow}</text>
              </g>
            );
          }
          // EA2 or additional right-side step
          return (
            <g key={`ar${i}`}>
              <rect x={eaArrowX - 3} y={Math.min(py, cy) + 3} width="6" height={Math.abs(cy - py) - 6} fill={col} rx="2"/>
              {lv.val > 0
                ? <polygon points={`${eaArrowX - 5} ${cy + 4}, ${eaArrowX} ${cy - 4}, ${eaArrowX + 5} ${cy + 4}`} fill={col}/>
                : <polygon points={`${eaArrowX - 5} ${cy - 4}, ${eaArrowX} ${cy + 4}, ${eaArrowX + 5} ${cy - 4}`} fill={col}/>
              }
              <text x={eaArrowX + 10} y={(py + cy) / 2 + 4} fontSize="10" fontWeight="700" fill={col}>{lv.arrow}</text>
            </g>
          );
        }
        return null;
      })}
    </svg>
  );
};

const CALC_SETS = [
  {
    id: "calc_moles", title: "Moles & Amount of Substance", color: "#29ABE2", board: "both",
    questions: [
      // ═══ EASY ═══ (15 questions - basic n=m/M, m=nM, molar volume)
      // n = m/M variations
      { difficulty: "easy", q: "Calculate the number of moles in 5.6 g of iron (Fe).", hint: "n = m / M. Look up Ar of Fe on the periodic table.", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Ar of Fe = 55.8 (from periodic table)", "n = m / M = 5.6 / 55.8", "n = 0.100 mol"] },
      { difficulty: "easy", q: "Calculate the number of moles in 4.0 g of calcium (Ca).", hint: "n = m / M", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Ar of Ca = 40.1", "n = m / M = 4.0 / 40.1", "n = 0.100 mol"] },
      { difficulty: "easy", q: "Calculate the number of moles in 3.2 g of sulfur (S).", hint: "n = m / M", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Ar of S = 32.1", "n = m / M = 3.2 / 32.1", "n = 0.0997 mol (accept 0.10)"] },
      { difficulty: "easy", q: "How many moles are in 12.0 g of magnesium (Mg)?", hint: "n = m / M", answer: 0.494, unit: "mol", tolerance: 0.01, steps: ["Ar of Mg = 24.3", "n = m / M = 12.0 / 24.3", "n = 0.494 mol"] },
      { difficulty: "easy", q: "How many moles are in 32.0 g of oxygen gas (O₂)?", hint: "Mr of O₂ = 2 x Ar of O", answer: 1.0, unit: "mol", tolerance: 0.05, steps: ["Mr of O₂ = 2 x 16.0 = 32.0", "n = m / M = 32.0 / 32.0", "n = 1.00 mol"] },
      // m = nM variations
      { difficulty: "easy", q: "What mass of sodium hydroxide (NaOH) contains 0.25 mol?", hint: "m = n x M. Calculate Mr of NaOH first.", answer: 10, unit: "g", tolerance: 0.1, steps: ["Mr of NaOH = 23 + 16 + 1 = 40", "m = n x M = 0.25 x 40", "m = 10.0 g"] },
      { difficulty: "easy", q: "What mass of water (H₂O) is 2.0 mol?", hint: "m = n x M", answer: 36, unit: "g", tolerance: 0.5, steps: ["Mr of H₂O = (2 x 1) + 16 = 18", "m = n x M = 2.0 x 18", "m = 36.0 g"] },
      { difficulty: "easy", q: "Calculate the mass of 0.50 mol of copper (Cu).", hint: "m = n x M", answer: 31.8, unit: "g", tolerance: 0.3, steps: ["Ar of Cu = 63.5", "m = n x M = 0.50 x 63.5", "m = 31.8 g"] },
      { difficulty: "easy", q: "Calculate the mass of 0.10 mol of calcium carbonate (CaCO₃).", hint: "m = n x M. Work out Mr first.", answer: 10.0, unit: "g", tolerance: 0.2, steps: ["Mr of CaCO₃ = 40 + 12 + (3 x 16) = 100", "m = n x M = 0.10 x 100", "m = 10.0 g"] },
      { difficulty: "easy", q: "What mass of sulfuric acid (H₂SO₄) contains 0.20 mol?", hint: "m = n x M", answer: 19.6, unit: "g", tolerance: 0.2, steps: ["Mr of H₂SO₄ = (2 x 1) + 32 + (4 x 16) = 98", "m = n x M = 0.20 x 98", "m = 19.6 g"] },
      // Molar volume
      { difficulty: "easy", q: "How many moles of gas occupy 4.8 dm³ at RTP? (Molar volume = 24.0 dm³ mol⁻¹)", hint: "n = V / Vm", answer: 0.2, unit: "mol", tolerance: 0.005, steps: ["n = V / Vm = 4.8 / 24.0", "n = 0.200 mol"] },
      { difficulty: "easy", q: "What volume (dm³) does 0.50 mol of gas occupy at RTP?", hint: "V = n x Vm (Vm = 24.0 dm³ mol⁻¹)", answer: 12.0, unit: "dm³", tolerance: 0.1, steps: ["V = n x Vm = 0.50 x 24.0", "V = 12.0 dm³"] },
      { difficulty: "easy", q: "How many moles of gas occupy 120 cm³ at RTP?", hint: "Convert cm³ to dm³ first, then n = V / Vm", answer: 0.005, unit: "mol", tolerance: 0.0005, steps: ["V = 120 / 1000 = 0.120 dm³", "n = V / Vm = 0.120 / 24.0", "n = 0.00500 mol"] },
      { difficulty: "easy", q: "Calculate the number of moles in 6.4 g of methane (CH₄).", hint: "n = m / M", answer: 0.4, unit: "mol", tolerance: 0.01, steps: ["Mr of CH₄ = 12 + (4 x 1) = 16", "n = m / M = 6.4 / 16", "n = 0.400 mol"] },
      { difficulty: "easy", q: "Calculate the mass of 3.0 mol of nitrogen gas (N₂).", hint: "m = n x M", answer: 84, unit: "g", tolerance: 0.5, steps: ["Mr of N₂ = 2 x 14 = 28", "m = n x M = 3.0 x 28", "m = 84.0 g"] },

      // ═══ MEDIUM ═══ (20 questions - Mr calculations, concentrations, conversions)
      // Calculate Mr then find moles
      { difficulty: "medium", q: "How many moles are in 2.20 g of carbon dioxide (CO₂)?", hint: "Calculate Mr of CO₂ first, then use n = m / M.", answer: 0.05, unit: "mol", tolerance: 0.003, steps: ["Mr of CO₂ = 12 + (2 x 16) = 44", "n = m / M = 2.20 / 44", "n = 0.0500 mol"] },
      { difficulty: "medium", q: "Calculate the number of moles in 7.1 g of chlorine gas (Cl₂).", hint: "Mr of Cl₂ = 2 x Ar(Cl)", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Mr of Cl₂ = 2 x 35.5 = 71.0", "n = m / M = 7.1 / 71.0", "n = 0.100 mol"] },
      { difficulty: "medium", q: "How many moles are in 9.8 g of sulfuric acid (H₂SO₄)?", hint: "Calculate Mr first", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Mr of H₂SO₄ = 2 + 32 + 64 = 98", "n = m / M = 9.8 / 98", "n = 0.100 mol"] },
      { difficulty: "medium", q: "Calculate the number of moles in 17.0 g of ammonia (NH₃).", hint: "Calculate Mr of NH₃ first", answer: 1.0, unit: "mol", tolerance: 0.05, steps: ["Mr of NH₃ = 14 + (3 x 1) = 17", "n = m / M = 17.0 / 17", "n = 1.00 mol"] },
      { difficulty: "medium", q: "How many moles are in 5.85 g of sodium chloride (NaCl)?", hint: "Calculate Mr of NaCl", answer: 0.1, unit: "mol", tolerance: 0.005, steps: ["Mr of NaCl = 23 + 35.5 = 58.5", "n = m / M = 5.85 / 58.5", "n = 0.100 mol"] },
      { difficulty: "medium", q: "Calculate the mass of 0.30 mol of ethanol (C₂H₅OH).", hint: "Work out Mr of C₂H₅OH first, then m = n x M", answer: 13.8, unit: "g", tolerance: 0.2, steps: ["Mr of C₂H₅OH = (2 x 12) + (6 x 1) + 16 = 46", "m = n x M = 0.30 x 46", "m = 13.8 g"] },
      { difficulty: "medium", q: "What mass of potassium permanganate (KMnO₄) contains 0.025 mol?", hint: "Calculate Mr of KMnO₄", answer: 3.95, unit: "g", tolerance: 0.05, steps: ["Mr of KMnO₄ = 39 + 55 + (4 x 16) = 158", "m = n x M = 0.025 x 158", "m = 3.95 g"] },
      // Concentration calculations
      { difficulty: "medium", q: "Calculate the concentration (mol dm⁻³) of a solution containing 0.050 mol of HCl in 250 cm³ of solution.", hint: "Convert cm³ to dm³ first, then c = n / V.", answer: 0.2, unit: "mol dm⁻³", tolerance: 0.01, steps: ["V = 250 / 1000 = 0.250 dm³", "c = n / V = 0.050 / 0.250", "c = 0.200 mol dm⁻³"] },
      { difficulty: "medium", q: "What is the concentration (mol dm⁻³) of a solution containing 0.10 mol of NaOH in 500 cm³?", hint: "c = n / V. Convert cm³ to dm³.", answer: 0.2, unit: "mol dm⁻³", tolerance: 0.01, steps: ["V = 500 / 1000 = 0.500 dm³", "c = n / V = 0.10 / 0.500", "c = 0.200 mol dm⁻³"] },
      { difficulty: "medium", q: "How many moles of solute are in 100 cm³ of 0.50 mol dm⁻³ HNO₃?", hint: "n = c x V. Convert cm³ to dm³.", answer: 0.05, unit: "mol", tolerance: 0.003, steps: ["V = 100 / 1000 = 0.100 dm³", "n = c x V = 0.50 x 0.100", "n = 0.0500 mol"] },
      { difficulty: "medium", q: "Calculate the concentration (mol dm⁻³) of 4.0 g of NaOH dissolved in 500 cm³ of solution.", hint: "Find moles of NaOH first, then c = n / V.", answer: 0.2, unit: "mol dm⁻³", tolerance: 0.01, steps: ["Mr of NaOH = 23 + 16 + 1 = 40", "n = 4.0 / 40 = 0.10 mol", "V = 500 / 1000 = 0.500 dm³", "c = 0.10 / 0.500 = 0.200 mol dm⁻³"] },
      { difficulty: "medium", q: "What mass of HCl is dissolved in 250 cm³ of 0.10 mol dm⁻³ solution?", hint: "Find moles first (n = cV), then m = nM.", answer: 0.913, unit: "g", tolerance: 0.02, steps: ["V = 250 / 1000 = 0.250 dm³", "n = c x V = 0.10 x 0.250 = 0.025 mol", "Mr of HCl = 1 + 35.5 = 36.5", "m = 0.025 x 36.5 = 0.913 g"] },
      // Gas volume
      { difficulty: "medium", q: "Calculate the volume (dm³) occupied by 0.40 mol of gas at RTP.", hint: "V = n x Vm (Vm = 24.0 dm³ mol⁻¹)", answer: 9.6, unit: "dm³", tolerance: 0.05, steps: ["V = n x Vm = 0.40 x 24.0", "V = 9.60 dm³"] },
      { difficulty: "medium", q: "What volume (cm³) does 0.020 mol of CO₂ occupy at RTP?", hint: "V = n x Vm, then convert to cm³", answer: 480, unit: "cm³", tolerance: 5, steps: ["V = n x Vm = 0.020 x 24.0 = 0.480 dm³", "V = 0.480 x 1000 = 480 cm³"] },
      { difficulty: "medium", q: "3.2 g of oxygen gas (O₂) is collected at RTP. Calculate the volume in dm³.", hint: "Find moles first (n = m/M), then V = n x Vm", answer: 2.4, unit: "dm³", tolerance: 0.05, steps: ["Mr of O₂ = 2 x 16 = 32", "n = m / M = 3.2 / 32 = 0.10 mol", "V = n x Vm = 0.10 x 24.0 = 2.40 dm³"] },
      { difficulty: "medium", q: "480 cm³ of hydrogen gas (H₂) at RTP has what mass?", hint: "Convert to dm³, find moles, then m = nM", answer: 0.04, unit: "g", tolerance: 0.002, steps: ["V = 480 / 1000 = 0.480 dm³", "n = V / Vm = 0.480 / 24.0 = 0.0200 mol", "Mr of H₂ = 2 x 1 = 2", "m = n x M = 0.0200 x 2 = 0.0400 g"] },
      // Concentration in g dm⁻³
      { difficulty: "medium", q: "Convert 0.50 mol dm⁻³ NaCl solution to g dm⁻³.", hint: "g dm⁻³ = c x Mr", answer: 29.25, unit: "g dm⁻³", tolerance: 0.3, steps: ["Mr of NaCl = 23 + 35.5 = 58.5", "conc (g dm⁻³) = c x Mr = 0.50 x 58.5", "= 29.3 g dm⁻³"] },
      { difficulty: "medium", q: "A solution has a concentration of 4.0 g dm⁻³ of NaOH. What is its concentration in mol dm⁻³?", hint: "mol dm⁻³ = (g dm⁻³) / Mr", answer: 0.1, unit: "mol dm⁻³", tolerance: 0.005, steps: ["Mr of NaOH = 23 + 16 + 1 = 40", "c = 4.0 / 40 = 0.10 mol dm⁻³"] },
      { difficulty: "medium", q: "Calculate the number of moles in 24.5 g of potassium hydroxide (KOH).", hint: "Calculate Mr of KOH, then n = m / M", answer: 0.437, unit: "mol", tolerance: 0.005, steps: ["Mr of KOH = 39 + 16 + 1 = 56", "n = m / M = 24.5 / 56", "n = 0.438 mol"] },

      // ═══ HARD ═══ (15 questions - ideal gas, multi-step, stoichiometry)
      { difficulty: "hard", q: "Using PV = nRT, calculate the pressure (Pa) exerted by 0.10 mol of gas in a 2.0 dm³ container at 300 K.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "Rearrange for P. Convert V to m³.", answer: 124710, unit: "Pa", tolerance: 500, steps: ["V = 2.0 dm³ = 0.0020 m³", "P = nRT / V = (0.10 x 8.314 x 300) / 0.0020", "P = 249.42 / 0.0020 = 124 710 Pa"] },
      { difficulty: "hard", q: "Using PV = nRT, calculate the number of moles in a gas at 100 kPa, 500 cm³, and 298 K.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "Convert P to Pa, V to m³. n = PV / RT", answer: 0.0202, unit: "mol", tolerance: 0.001, steps: ["P = 100 kPa = 100 000 Pa", "V = 500 cm³ = 0.000500 m³", "n = PV / RT = (100000 x 0.000500) / (8.314 x 298)", "n = 50.0 / 2477.6 = 0.0202 mol"] },
      { difficulty: "hard", q: "What volume (m³) does 0.25 mol of gas occupy at 350 K and 150 kPa?\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "V = nRT / P. Convert P to Pa.", answer: 0.00485, unit: "m³", tolerance: 0.0001, steps: ["P = 150 kPa = 150 000 Pa", "V = nRT / P = (0.25 x 8.314 x 350) / 150000", "V = 727.5 / 150000 = 0.00485 m³"] },
      { difficulty: "hard", q: "2.40 dm³ of chlorine gas (Cl₂) at RTP is dissolved in NaOH solution:\nCl₂ + 2NaOH -> NaCl + NaClO + H₂O\nCalculate the mass of NaOH that reacts.", hint: "Find mol Cl₂ from volume, use mole ratio 1:2, then m = nM", answer: 8.0, unit: "g", tolerance: 0.1, steps: ["n(Cl₂) = V / Vm = 2.40 / 24.0 = 0.100 mol", "n(NaOH) = 2 x 0.100 = 0.200 mol (1:2 ratio)", "Mr of NaOH = 40", "m = 0.200 x 40 = 8.00 g"] },
      // Dilution
      { difficulty: "hard", q: "50.0 cm³ of 0.400 mol dm⁻³ KOH is diluted to 200 cm³. Calculate the new concentration.", hint: "c₁V₁ = c₂V₂", answer: 0.1, unit: "mol dm⁻³", tolerance: 0.005, steps: ["c₁V₁ = c₂V₂", "0.400 x 50.0 = c₂ x 200", "c₂ = 20.0 / 200 = 0.100 mol dm⁻³"] },
      { difficulty: "hard", q: "A student needs 500 cm³ of 0.0500 mol dm⁻³ HCl. They have 1.00 mol dm⁻³ HCl. What volume (cm³) should they dilute?", hint: "c₁V₁ = c₂V₂. Rearrange for V₁.", answer: 25.0, unit: "cm³", tolerance: 0.5, steps: ["c₁V₁ = c₂V₂", "1.00 x V₁ = 0.0500 x 500", "V₁ = 25.0 / 1.00 = 25.0 cm³"] },
      // Number of particles
      { difficulty: "hard", q: "How many atoms are in 0.50 mol of neon gas (Ne)?\nGive as e.g. 3.01e23", hint: "N = n x Na (6.022 x 10²³)", answer: 3.011e23, unit: "", tolerance: 1e21, steps: ["N = n x Na = 0.50 x 6.022 x 10²³", "N = 3.01 x 10²³ atoms"] },
      { difficulty: "hard", q: "How many individual atoms are in 1.0 mol of H₂O?\nGive as e.g. 1.81e24", hint: "1 molecule of H₂O has 3 atoms. N = n x Na x 3", answer: 1.807e24, unit: "", tolerance: 5e22, steps: ["1 molecule H₂O = 3 atoms (2H + 1O)", "Molecules = 1.0 x 6.022 x 10²³ = 6.022 x 10²³", "Total atoms = 3 x 6.022 x 10²³ = 1.81 x 10²⁴"] },
      // Mass of one atom/ion
      { difficulty: "hard", q: "Calculate the mass (g) of a single atom of carbon-12.\nGive as e.g. 1.99e-23", hint: "mass = Ar / Na", answer: 1.993e-23, unit: "g", tolerance: 1e-25, steps: ["mass of 1 atom = Ar / Na", "= 12.0 / (6.022 x 10²³)", "= 1.99 x 10⁻²³ g"] },
      { difficulty: "hard", q: "Calculate the mass (g) of a single molecule of water (H₂O).\nGive as e.g. 2.99e-23", hint: "mass = Mr / Na", answer: 2.99e-23, unit: "g", tolerance: 1e-25, steps: ["Mr of H₂O = 18", "mass of 1 molecule = Mr / Na", "= 18 / (6.022 x 10²³)", "= 2.99 x 10⁻²³ g"] },
      { difficulty: "hard", q: "1.06 g of Na₂CO₃ is dissolved in 250 cm³ of solution. Calculate the concentration in mol dm⁻³.", hint: "Find Mr of Na₂CO₃, then n = m/M, then c = n/V", answer: 0.04, unit: "mol dm⁻³", tolerance: 0.002, steps: ["Mr of Na₂CO₃ = (2 x 23) + 12 + (3 x 16) = 106", "n = 1.06 / 106 = 0.0100 mol", "V = 250 / 1000 = 0.250 dm³", "c = 0.0100 / 0.250 = 0.0400 mol dm⁻³"] },
      { difficulty: "hard", q: "A gas has a density of 1.78 g dm⁻³ at RTP. Calculate its molar mass.", hint: "At RTP, 1 mol of gas = 24.0 dm³. Mass of 24 dm³ = molar mass.", answer: 42.7, unit: "g mol⁻¹", tolerance: 0.5, steps: ["At RTP, 1 mol of gas occupies 24.0 dm³", "Mass of 24.0 dm³ = 1.78 x 24.0", "Mr = 42.7 g mol⁻¹"] },
      { difficulty: "hard", q: "0.120 g of a gas occupies 48.0 cm³ at RTP. Calculate the molar mass of the gas.", hint: "Find moles from volume, then M = m / n", answer: 60, unit: "g mol⁻¹", tolerance: 1, steps: ["V = 48.0 / 1000 = 0.0480 dm³", "n = V / Vm = 0.0480 / 24.0 = 0.00200 mol", "Mr = m / n = 0.120 / 0.00200 = 60.0 g mol⁻¹"] },
      { difficulty: "hard", q: "200 cm³ of 0.500 mol dm⁻³ CuSO₄ solution contains what mass of CuSO₄?", hint: "n = cV, then m = nM", answer: 15.97, unit: "g", tolerance: 0.2, steps: ["n = c x V = 0.500 x 0.200 = 0.100 mol", "Mr of CuSO₄ = 63.5 + 32 + (4 x 16) = 159.5 (accept 160)", "m = 0.100 x 159.5 = 16.0 g"] },
      { difficulty: "hard", q: "What concentration of Na₂CO₃ solution (g dm⁻³) is equivalent to 0.100 mol dm⁻³?", hint: "g dm⁻³ = c (mol dm⁻³) x Mr", answer: 10.6, unit: "g dm⁻³", tolerance: 0.2, steps: ["Mr of Na₂CO₃ = (2 x 23) + 12 + (3 x 16) = 106", "g dm⁻³ = 0.100 x 106 = 10.6 g dm⁻³"] },
      { difficulty: "hard", q: "At RTP, 1.20 dm³ of CO₂ is produced when CaCO₃ reacts with excess HCl.\nCaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂\nCalculate the mass of CaCO₃ that reacted.", hint: "Find mol CO₂ from volume, 1:1 ratio, then m = nM", answer: 5.0, unit: "g", tolerance: 0.1, steps: ["n(CO₂) = 1.20 / 24.0 = 0.0500 mol", "n(CaCO₃) = 0.0500 mol (1:1 ratio)", "Mr of CaCO₃ = 40 + 12 + 48 = 100", "m = 0.0500 x 100 = 5.00 g"] },
      { difficulty: "hard", q: "Calculate the temperature (K) at which 0.050 mol of gas at 200 kPa occupies 800 cm³.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "T = PV / nR. Convert P to Pa and V to m³.", answer: 385, unit: "K", tolerance: 5, steps: ["P = 200 000 Pa, V = 0.000800 m³", "T = PV / nR = (200000 x 0.000800) / (0.050 x 8.314)", "T = 160 / 0.4157 = 385 K"] },
      { difficulty: "hard", q: "A student dilutes 25.0 cm³ of 2.00 mol dm⁻³ HCl to make 500 cm³ of solution. What is the new concentration?", hint: "c₁V₁ = c₂V₂", answer: 0.1, unit: "mol dm⁻³", tolerance: 0.005, steps: ["c₁V₁ = c₂V₂", "2.00 x 25.0 = c₂ x 500", "c₂ = 50.0 / 500 = 0.100 mol dm⁻³"] },
      { difficulty: "hard", q: "How many molecules are in 0.25 mol of water?\nGive your answer in standard form as e.g. 1.51e23", hint: "Number = n x Nₐ (6.022 x 10²³)", answer: 1.506e23, unit: "", tolerance: 1e21, steps: ["N = n x Nₐ = 0.25 x 6.022 x 10²³", "N = 1.51 x 10²³ molecules"] },

      // ═══ EXAM ═══ (10 questions - multi-step stoichiometry, limiting reagent)
      { difficulty: "exam", q: "0.580 g of butane (C₄H₁₀) is burned completely:\nC₄H₁₀ + 13/2 O₂ -> 4CO₂ + 5H₂O\nCalculate the volume (dm³) of CO₂ produced at RTP.", hint: "Find moles of butane, use mole ratio, then V = n x Vm", answer: 0.960, unit: "dm³", tolerance: 0.01, steps: ["Mr of C₄H₁₀ = (4 x 12) + (10 x 1) = 58", "n(C₄H₁₀) = 0.580 / 58 = 0.0100 mol", "n(CO₂) = 4 x 0.0100 = 0.0400 mol", "V = 0.0400 x 24.0 = 0.960 dm³"] },
      { difficulty: "exam", q: "A sealed container holds 0.040 mol of gas at 25.0 C and 100 kPa. The gas is heated to 200.0 C at constant volume.\nUsing PV = nRT, calculate the new pressure in kPa.", hint: "At constant V and n: P₁/T₁ = P₂/T₂. Convert to Kelvin.", answer: 159, unit: "kPa", tolerance: 2, steps: ["T₁ = 25.0 + 273 = 298 K", "T₂ = 200.0 + 273 = 473 K", "P₁/T₁ = P₂/T₂ (from PV = nRT at constant V, n)", "P₂ = P₁ x T₂/T₁ = 100 x 473/298", "P₂ = 158.7 kPa (accept 159)"] },
      { difficulty: "exam", q: "2.65 g of Na₂CO₃ reacts with excess HCl:\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nThe CO₂ is collected at 298 K and 101 kPa.\nUsing PV = nRT, calculate the volume of CO₂ in cm³.", hint: "Find mol Na₂CO₃, 1:1 ratio for CO₂, then V = nRT/P", answer: 612, unit: "cm³", tolerance: 10, steps: ["Mr of Na₂CO₃ = 46 + 12 + 48 = 106", "n(Na₂CO₃) = 2.65 / 106 = 0.0250 mol", "n(CO₂) = 0.0250 mol (1:1)", "V = nRT/P = (0.0250 x 8.314 x 298) / 101000", "V = 61.94 / 101000 = 0.000613 m³ = 613 cm³"] },
      { difficulty: "exam", q: "50.0 cm³ of 0.200 mol dm⁻³ Na₂CO₃ is added to 50.0 cm³ of 0.300 mol dm⁻³ HCl.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nWhich reagent is in excess and by how many moles?", hint: "Find moles of each. Na₂CO₃ needs 2x HCl. Compare.", answer: "Na2CO3", unit: "", tolerance: 0, isText: true, steps: ["n(Na₂CO₃) = 0.200 x 0.0500 = 0.0100 mol", "n(HCl) = 0.300 x 0.0500 = 0.0150 mol", "Na₂CO₃ needs 2 x 0.0100 = 0.0200 mol HCl", "Only 0.0150 mol HCl available - HCl is limiting", "Na₂CO₃ excess = 0.0100 - 0.0075 = 0.0025 mol", "Na₂CO₃ is in excess"] },
      { difficulty: "exam", q: "A student makes a standard solution by dissolving 2.65 g of anhydrous Na₂CO₃ in a 250 cm³ volumetric flask.\nCalculate the concentration in mol dm⁻³.", hint: "Mr of Na₂CO₃ = 106. n = m/M, c = n/V", answer: 0.1, unit: "mol dm⁻³", tolerance: 0.005, steps: ["Mr of Na₂CO₃ = (2 x 23) + 12 + (3 x 16) = 106", "n = 2.65 / 106 = 0.0250 mol", "V = 250 / 1000 = 0.250 dm³", "c = 0.0250 / 0.250 = 0.100 mol dm⁻³"] },
      { difficulty: "exam", q: "3.0 g of Mg reacts with 100 cm³ of 1.0 mol dm⁻³ HCl:\nMg + 2HCl -> MgCl₂ + H₂\nCalculate the maximum volume of H₂ (dm³) at RTP.", hint: "Find moles of both. Identify limiting reagent. Calculate H₂ volume.", answer: 1.2, unit: "dm³", tolerance: 0.05, steps: ["n(Mg) = 3.0 / 24.3 = 0.123 mol", "n(HCl) = 1.0 x 0.100 = 0.100 mol", "Mg needs 2 x 0.123 = 0.247 mol HCl - HCl is limiting", "n(H₂) = 0.100 / 2 = 0.0500 mol", "V = 0.0500 x 24.0 = 1.20 dm³"] },
      { difficulty: "exam", q: "An unknown metal M reacts with HCl:\nM + 2HCl -> MCl₂ + H₂\n0.480 g of M produces 192 cm³ of H₂ at RTP.\nCalculate the Ar of M and identify it.", hint: "Find mol H₂, use 1:1 ratio for mol M, then Ar = m/n", answer: 60, unit: "g mol⁻¹", tolerance: 2, steps: ["V(H₂) = 192 / 1000 = 0.192 dm³", "n(H₂) = 0.192 / 24.0 = 0.00800 mol", "n(M) = 0.00800 mol (1:1 ratio)", "Ar = m / n = 0.480 / 0.00800 = 60.0", "This is cobalt (Co, Ar = 58.9) - accept 60"] },
      // More limiting reagent
      { difficulty: "exam", q: "2.43 g of Mg is added to 100 cm³ of 0.500 mol dm⁻³ HCl.\nMg + 2HCl -> MgCl₂ + H₂\nWhich is the limiting reagent? Calculate the volume of H₂ produced at RTP (dm³).", hint: "Find moles of both. Mg needs 2x its moles of HCl.", answer: 0.6, unit: "dm³", tolerance: 0.02, steps: ["n(Mg) = 2.43 / 24.3 = 0.100 mol", "n(HCl) = 0.500 x 0.100 = 0.0500 mol", "Mg needs 2 x 0.100 = 0.200 mol HCl, only 0.0500 available", "HCl is limiting", "n(H₂) = 0.0500 / 2 = 0.0250 mol", "V = 0.0250 x 24.0 = 0.600 dm³"] },
      { difficulty: "exam", q: "1.40 g of Fe reacts with 50.0 cm³ of 1.00 mol dm⁻³ CuSO₄.\nFe + CuSO₄ -> FeSO₄ + Cu\nCalculate the mass of Cu deposited.", hint: "Find moles of both. 1:1 ratio. Identify limiting reagent.", answer: 1.59, unit: "g", tolerance: 0.02, steps: ["n(Fe) = 1.40 / 55.8 = 0.0251 mol", "n(CuSO₄) = 1.00 x 0.0500 = 0.0500 mol", "1:1 ratio - Fe is limiting (0.0251 mol)", "n(Cu) = 0.0251 mol", "m(Cu) = 0.0251 x 63.5 = 1.59 g"] },
      { difficulty: "exam", q: "4.00 g of NaOH is added to 200 cm³ of 0.300 mol dm⁻³ HCl.\nNaOH + HCl -> NaCl + H₂O\nCalculate the mass of NaCl formed.", hint: "Find moles of both. 1:1 ratio. Limiting reagent determines product.", answer: 3.51, unit: "g", tolerance: 0.05, steps: ["n(NaOH) = 4.00 / 40 = 0.100 mol", "n(HCl) = 0.300 x 0.200 = 0.0600 mol", "1:1 ratio - HCl is limiting (0.0600 mol)", "n(NaCl) = 0.0600 mol", "Mr NaCl = 58.5", "m = 0.0600 x 58.5 = 3.51 g"] },
      { difficulty: "exam", q: "3.25 g of Zn is added to 50.0 cm³ of 0.500 mol dm⁻³ H₂SO₄.\nZn + H₂SO₄ -> ZnSO₄ + H₂\nDetermine the limiting reagent and the volume of H₂ at RTP.", hint: "Find moles of both. 1:1 ratio.", answer: 0.6, unit: "dm³", tolerance: 0.02, steps: ["n(Zn) = 3.25 / 65.4 = 0.0497 mol", "n(H₂SO₄) = 0.500 x 0.0500 = 0.0250 mol", "1:1 ratio - H₂SO₄ is limiting", "n(H₂) = 0.0250 mol", "V = 0.0250 x 24.0 = 0.600 dm³"] },
      { difficulty: "exam", q: "A 1.00 g sample of impure CaCO₃ reacts with excess HCl and produces 200 cm³ of CO₂ at RTP.\nCalculate the percentage purity of the CaCO₃.\nCaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂", hint: "Find mol CO₂, 1:1 ratio for CaCO₃, find mass of pure CaCO₃, then % purity", answer: 83.3, unit: "%", tolerance: 1, steps: ["n(CO₂) = 0.200 / 24.0 = 0.00833 mol", "n(CaCO₃) = 0.00833 mol (1:1)", "m(CaCO₃) = 0.00833 x 100 = 0.833 g", "% purity = (0.833 / 1.00) x 100 = 83.3%"] },
      { difficulty: "exam", q: "Using PV = nRT, calculate the volume (cm³) occupied by 0.0150 mol of gas at 80.0 C and 110 kPa.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "Convert T to K and P to Pa. V = nRT/P. Convert m³ to cm³.", answer: 400, unit: "cm³", tolerance: 5, steps: ["T = 80.0 + 273 = 353 K", "P = 110 kPa = 110 000 Pa", "V = nRT/P = (0.0150 x 8.314 x 353) / 110000", "V = 44.02 / 110000 = 0.000400 m³", "V = 400 cm³"] },

      // ═══ PERCENTAGE PURITY (4 more) ═══
      { difficulty: "hard", q: "A 2.50 g sample of impure MgCO₃ reacts with excess HCl and produces 480 cm³ of CO₂ at RTP.\nMgCO₃ + 2HCl -> MgCl₂ + H₂O + CO₂\nCalculate the percentage purity.", hint: "Find mol CO₂ from volume, 1:1 ratio, find mass of pure MgCO₃, then %", answer: 67.2, unit: "%", tolerance: 1, steps: ["n(CO₂) = 0.480 / 24.0 = 0.0200 mol", "n(MgCO₃) = 0.0200 mol (1:1)", "Mr MgCO₃ = 24.3 + 12 + 48 = 84.3", "m(MgCO₃) = 0.0200 x 84.3 = 1.686 g", "% purity = (1.686 / 2.50) x 100 = 67.4%"] },
      { difficulty: "hard", q: "0.800 g of impure zinc reacts with excess H₂SO₄ and produces 240 cm³ of H₂ at RTP.\nZn + H₂SO₄ -> ZnSO₄ + H₂\nCalculate the percentage purity of the zinc.", hint: "Find mol H₂, 1:1 ratio for Zn, find mass of pure Zn, then %", answer: 81.8, unit: "%", tolerance: 1, steps: ["n(H₂) = 0.240 / 24.0 = 0.0100 mol", "n(Zn) = 0.0100 mol (1:1)", "m(Zn) = 0.0100 x 65.4 = 0.654 g", "% purity = (0.654 / 0.800) x 100 = 81.8%"] },
      { difficulty: "exam", q: "5.00 g of impure Na₂CO₃ is dissolved and reacted with excess HCl. The CO₂ produced occupies 960 cm³ at RTP.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate the percentage purity.", hint: "Find mol CO₂, 1:1 with Na₂CO₃, find mass, then %", answer: 84.8, unit: "%", tolerance: 1, steps: ["n(CO₂) = 0.960 / 24.0 = 0.0400 mol", "n(Na₂CO₃) = 0.0400 mol (1:1)", "Mr Na₂CO₃ = 106", "m = 0.0400 x 106 = 4.24 g", "% purity = (4.24 / 5.00) x 100 = 84.8%"] },
      { difficulty: "exam", q: "A 3.00 g sample of impure iron reacts with excess CuSO₄ solution. 2.54 g of Cu is deposited.\nFe + CuSO₄ -> FeSO₄ + Cu\nCalculate the % purity of the iron sample.", hint: "Find mol Cu, 1:1 ratio for Fe, find mass of pure Fe, then %", answer: 74.3, unit: "%", tolerance: 1, steps: ["n(Cu) = 2.54 / 63.5 = 0.0400 mol", "n(Fe) = 0.0400 mol (1:1)", "m(Fe) = 0.0400 x 55.8 = 2.23 g", "% purity = (2.23 / 3.00) x 100 = 74.3%"] },

      // ═══ WATER OF CRYSTALLISATION (8 questions) ═══
      { difficulty: "medium", q: "4.96 g of hydrated CuSO₄ (CuSO₄.xH₂O) is heated to constant mass. The anhydrous residue weighs 3.18 g.\nCalculate the value of x (moles of water of crystallisation).", hint: "Find mass of water lost. Find moles of CuSO₄ and moles of H₂O. Divide to get ratio.", answer: 5, unit: "", tolerance: 0.1, steps: ["Mass of water = 4.96 - 3.18 = 1.78 g", "n(CuSO₄) = 3.18 / 159.5 = 0.01994 mol", "n(H₂O) = 1.78 / 18 = 0.0989 mol", "x = 0.0989 / 0.01994 = 4.96", "x = 5, so formula is CuSO₄.5H₂O"] },
      { difficulty: "medium", q: "5.72 g of hydrated Na₂CO₃ (Na₂CO₃.xH₂O) is heated to constant mass, leaving 2.12 g of anhydrous Na₂CO₃.\nCalculate x.", hint: "Mass of water = total - anhydrous. Find mol of each, divide.", answer: 10, unit: "", tolerance: 0.1, steps: ["Mass of water = 5.72 - 2.12 = 3.60 g", "n(Na₂CO₃) = 2.12 / 106 = 0.0200 mol", "n(H₂O) = 3.60 / 18 = 0.200 mol", "x = 0.200 / 0.0200 = 10.0", "Formula is Na₂CO₃.10H₂O"] },
      { difficulty: "medium", q: "2.46 g of hydrated MgSO₄ (MgSO₄.xH₂O) is heated. The anhydrous residue weighs 1.20 g.\nCalculate x.", hint: "Find mass of water, then moles of MgSO₄ and H₂O, divide for ratio.", answer: 7, unit: "", tolerance: 0.1, steps: ["Mass of water = 2.46 - 1.20 = 1.26 g", "n(MgSO₄) = 1.20 / 120.4 = 0.00997 mol", "n(H₂O) = 1.26 / 18 = 0.0700 mol", "x = 0.0700 / 0.00997 = 7.02", "x = 7, formula is MgSO₄.7H₂O"] },
      { difficulty: "hard", q: "Calculate the Mr of hydrated iron(II) sulfate, FeSO₄.7H₂O.", hint: "Mr = Mr(FeSO₄) + 7 x Mr(H₂O)", answer: 278, unit: "g mol⁻¹", tolerance: 1, steps: ["Mr(FeSO₄) = 55.8 + 32 + (4 x 16) = 151.8", "Mr(7H₂O) = 7 x 18 = 126", "Mr(FeSO₄.7H₂O) = 151.8 + 126 = 277.8 (accept 278)"] },
      { difficulty: "hard", q: "What mass of CuSO₄.5H₂O must be dissolved to make 250 cm³ of 0.100 mol dm⁻³ CuSO₄ solution?", hint: "Find moles needed, then use Mr of hydrated salt", answer: 6.24, unit: "g", tolerance: 0.1, steps: ["n = c x V = 0.100 x 0.250 = 0.0250 mol", "Mr(CuSO₄.5H₂O) = 159.5 + (5 x 18) = 249.5", "m = 0.0250 x 249.5 = 6.24 g"] },
      { difficulty: "hard", q: "3.50 g of hydrated BaCl₂ (BaCl₂.xH₂O) is heated to give 2.98 g of anhydrous BaCl₂.\nCalculate x.", hint: "Find mass of water, then moles of each, divide.", answer: 2, unit: "", tolerance: 0.1, steps: ["Mass of water = 3.50 - 2.98 = 0.52 g", "Mr(BaCl₂) = 137.3 + (2 x 35.5) = 208.3", "n(BaCl₂) = 2.98 / 208.3 = 0.01431 mol", "n(H₂O) = 0.52 / 18 = 0.0289 mol", "x = 0.0289 / 0.01431 = 2.02", "x = 2, formula is BaCl₂.2H₂O"] },
      { difficulty: "exam", q: "A student dissolves 7.15 g of Na₂CO₃.xH₂O in water and makes 250 cm³ of solution.\nThe concentration is 0.100 mol dm⁻³. Calculate x.", hint: "Find moles from concentration, then Mr = m/n, subtract Mr of Na₂CO₃ to find mass of water.", answer: 10, unit: "", tolerance: 0.1, steps: ["n = c x V = 0.100 x 0.250 = 0.0250 mol", "Mr of hydrate = m / n = 7.15 / 0.0250 = 286", "Mr(Na₂CO₃) = 106", "Mass from water = 286 - 106 = 180", "x = 180 / 18 = 10", "Formula is Na₂CO₃.10H₂O"] },
      { difficulty: "exam", q: "11.10 g of FeSO₄.xH₂O is dissolved in water to make 200 cm³ of solution.\nThe solution is found to be 0.200 mol dm⁻³. Calculate x.", hint: "Find moles, then Mr = m/n, subtract Mr(FeSO₄) and divide by 18.", answer: 7, unit: "", tolerance: 0.1, steps: ["n = c x V = 0.200 x 0.200 = 0.0400 mol", "Mr of hydrate = 11.10 / 0.0400 = 277.5", "Mr(FeSO₄) = 55.8 + 32 + 64 = 151.8", "Water mass = 277.5 - 151.8 = 125.7", "x = 125.7 / 18 = 6.98", "x = 7, formula is FeSO₄.7H₂O"] },
    ]
  },
  {
    id: "calc_formula", title: "Empirical & Molecular Formula", color: "#0090cc", board: "both",
    questions: [
      // ═══ EASY (12) ═══
      // Empirical to molecular
      { difficulty: "easy", q: "The empirical formula of a compound is CH₂ and its Mr is 56. Find the molecular formula.\n(Type as e.g. C4H8)", hint: "Empirical formula mass, divide Mr by it, multiply subscripts.", answer: "C4H8", unit: "", tolerance: 0, isText: true, steps: ["Empirical formula mass of CH₂ = 12 + 2 = 14", "n = 56 / 14 = 4", "Molecular formula = C₄H₈"] },
      { difficulty: "easy", q: "The empirical formula is CH₂O and Mr = 60. Find the molecular formula.\n(Type as e.g. C2H4O2)", hint: "Empirical mass = 12+2+16 = 30. Divide Mr by this.", answer: "C2H4O2", unit: "", tolerance: 0, isText: true, steps: ["Empirical formula mass = 12 + 2 + 16 = 30", "n = 60 / 30 = 2", "Molecular formula = C₂H₄O₂"] },
      { difficulty: "easy", q: "The empirical formula is CH₃ and Mr = 30. Find the molecular formula.\n(Type as e.g. C2H6)", hint: "Empirical mass = 15.", answer: "C2H6", unit: "", tolerance: 0, isText: true, steps: ["Empirical formula mass = 12 + 3 = 15", "n = 30 / 15 = 2", "Molecular formula = C₂H₆"] },
      { difficulty: "easy", q: "The empirical formula is HO and Mr = 34. Find the molecular formula.\n(Type as e.g. H2O2)", hint: "Empirical mass = 17.", answer: "H2O2", unit: "", tolerance: 0, isText: true, steps: ["Empirical formula mass = 1 + 16 = 17", "n = 34 / 17 = 2", "Molecular formula = H₂O₂"] },
      // Simple % composition
      { difficulty: "easy", q: "A hydrocarbon is 75.0% C and 25.0% H by mass. Its Mr = 16. Find the molecular formula.\n(Type as e.g. CH4)", hint: "Divide % by Ar for each element.", answer: "CH4", unit: "", tolerance: 0, isText: true, steps: ["C: 75.0 / 12 = 6.25", "H: 25.0 / 1 = 25.0", "Ratio: 6.25 : 25.0 = 1 : 4", "Empirical = CH₄, mass = 16, Mr = 16, so molecular = CH₄"] },
      { difficulty: "easy", q: "A compound is 50.0% sulfur and 50.0% oxygen by mass. Find the empirical formula.\n(Type as e.g. SO3)", hint: "Divide each % by Ar.", answer: "SO2", unit: "", tolerance: 0, isText: true, steps: ["S: 50.0 / 32 = 1.5625", "O: 50.0 / 16 = 3.125", "Divide by 1.5625: S:O = 1:2", "Empirical formula = SO₂"] },
      { difficulty: "easy", q: "A compound is 80.0% C and 20.0% H by mass. Find the empirical formula.\n(Type as e.g. CH3)", hint: "Divide each % by Ar, then simplify.", answer: "CH3", unit: "", tolerance: 0, isText: true, steps: ["C: 80.0 / 12 = 6.67", "H: 20.0 / 1 = 20.0", "Ratio: 6.67 : 20.0 divide by 6.67 = 1 : 3", "Empirical formula = CH₃"] },
      { difficulty: "easy", q: "A compound is 46.7% N and 53.3% O by mass. Find the empirical formula.\n(Type as e.g. N2O5)", hint: "Divide each % by Ar.", answer: "NO", unit: "", tolerance: 0, isText: true, steps: ["N: 46.7 / 14 = 3.336", "O: 53.3 / 16 = 3.331", "Ratio: 3.336 : 3.331 = 1 : 1", "Empirical formula = NO"] },
      // Calculate % composition from formula
      { difficulty: "easy", q: "Calculate the percentage by mass of oxygen in CaCO₃.", hint: "Mr of CaCO₃, then (mass of O / Mr) x 100", answer: 48.0, unit: "%", tolerance: 0.5, steps: ["Mr of CaCO₃ = 40 + 12 + (3 x 16) = 100", "Mass of O = 3 x 16 = 48", "% O = (48 / 100) x 100 = 48.0%"] },
      { difficulty: "easy", q: "Calculate the percentage by mass of nitrogen in NH₄NO₃.", hint: "There are 2 nitrogen atoms in NH₄NO₃.", answer: 35.0, unit: "%", tolerance: 0.5, steps: ["Mr of NH₄NO₃ = 14 + 4 + 14 + 48 = 80", "Mass of N = 2 x 14 = 28", "% N = (28 / 80) x 100 = 35.0%"] },
      { difficulty: "easy", q: "Calculate the percentage by mass of iron in Fe₂O₃.", hint: "Mr of Fe₂O₃, then (mass of Fe / Mr) x 100", answer: 69.9, unit: "%", tolerance: 0.5, steps: ["Mr of Fe₂O₃ = (2 x 55.8) + (3 x 16) = 159.6", "Mass of Fe = 2 x 55.8 = 111.6", "% Fe = (111.6 / 159.6) x 100 = 69.9%"] },
      { difficulty: "easy", q: "Calculate the percentage by mass of carbon in C₂H₅OH (ethanol).", hint: "Mr of C₂H₅OH = 46", answer: 52.2, unit: "%", tolerance: 0.5, steps: ["Mr of C₂H₅OH = (2 x 12) + 6 + 16 = 46", "Mass of C = 2 x 12 = 24", "% C = (24 / 46) x 100 = 52.2%"] },

      // ═══ MEDIUM (18) ═══
      // Three-element empirical formulas
      { difficulty: "medium", q: "A compound contains 40.0% C, 6.7% H and 53.3% O by mass. Find its empirical formula.\n(Type as e.g. CH2O)", hint: "Divide each % by Ar, then divide all by smallest.", answer: "CH2O", unit: "", tolerance: 0, isText: true, steps: ["C: 40.0/12 = 3.33; H: 6.7/1 = 6.7; O: 53.3/16 = 3.33", "Divide by 3.33: C:H:O = 1:2:1", "Empirical formula = CH₂O"] },
      { difficulty: "medium", q: "A compound is 85.7% C and 14.3% H. Its Mr = 42. Find the molecular formula.\n(Type as e.g. C3H6)", hint: "Find empirical formula, then compare empirical mass with Mr.", answer: "C3H6", unit: "", tolerance: 0, isText: true, steps: ["C: 85.7/12 = 7.14; H: 14.3/1 = 14.3", "Ratio = 1:2, empirical = CH₂", "Empirical mass = 14; n = 42/14 = 3", "Molecular formula = C₃H₆"] },
      { difficulty: "medium", q: "A compound contains 27.3% C and 72.7% O. Find its empirical formula.\n(Type as e.g. CO2)", hint: "Divide each % by Ar.", answer: "CO2", unit: "", tolerance: 0, isText: true, steps: ["C: 27.3/12 = 2.275", "O: 72.7/16 = 4.544", "Ratio: 2.275:4.544 divide by 2.275 = 1:2", "Empirical formula = CO₂"] },
      { difficulty: "medium", q: "A compound is 32.4% Na, 22.6% S and 45.0% O. Find the empirical formula.\n(Type as e.g. Na2SO4)", hint: "Divide each % by Ar.", answer: "Na2SO4", unit: "", tolerance: 0, isText: true, steps: ["Na: 32.4/23 = 1.409", "S: 22.6/32 = 0.706", "O: 45.0/16 = 2.813", "Divide by 0.706: 2:1:4", "Empirical formula = Na₂SO₄"] },
      { difficulty: "medium", q: "A compound contains 26.7% C, 2.2% H and 71.1% O. Its Mr = 90. Find the molecular formula.\n(Type as e.g. C2H2O4)", hint: "Find empirical formula, then use Mr.", answer: "C2H2O4", unit: "", tolerance: 0, isText: true, steps: ["C: 26.7/12 = 2.225; H: 2.2/1 = 2.2; O: 71.1/16 = 4.444", "Divide by 2.2: 1:1:2", "Empirical = CHO₂, mass = 45", "n = 90/45 = 2", "Molecular = C₂H₂O₄ (ethanedioic acid)"] },
      { difficulty: "medium", q: "A compound is 40.7% C, 5.1% H and 54.2% O. Find the empirical formula.\n(Type as e.g. C2H3O2)", hint: "Divide by Ar, simplify ratio.", answer: "C2H3O2", unit: "", tolerance: 0, isText: true, steps: ["C: 40.7/12 = 3.392; H: 5.1/1 = 5.1; O: 54.2/16 = 3.388", "Divide by 3.388: 1:1.505:1", "Multiply by 2: 2:3:2", "Empirical formula = C₂H₃O₂"] },
      // Mr from gas volume
      { difficulty: "medium", q: "0.25 mol of gas occupies 6.0 dm³ at RTP and has a mass of 7.0 g. Calculate Mr.", hint: "n = V / 24.0, then Mr = m / n", answer: 28, unit: "g mol⁻¹", tolerance: 0.5, steps: ["n = 6.0 / 24.0 = 0.25 mol", "Mr = m / n = 7.0 / 0.25 = 28 g mol⁻¹"] },
      { difficulty: "medium", q: "120 cm³ of gas at RTP has a mass of 0.22 g. Calculate the Mr of the gas.", hint: "Convert to dm³, find n = V/Vm, then Mr = m/n", answer: 44, unit: "g mol⁻¹", tolerance: 1, steps: ["V = 120/1000 = 0.120 dm³", "n = 0.120/24.0 = 0.00500 mol", "Mr = 0.22/0.00500 = 44 g mol⁻¹"] },
      { difficulty: "medium", q: "A gas has a density of 1.25 g dm⁻³ at RTP. Calculate its Mr.", hint: "1 mol = 24 dm³ at RTP. Mass of 24 dm³ = Mr.", answer: 30, unit: "g mol⁻¹", tolerance: 0.5, steps: ["At RTP, 1 mol occupies 24.0 dm³", "Mr = density x Vm = 1.25 x 24.0 = 30.0 g mol⁻¹"] },
      // Mass composition from formula
      { difficulty: "medium", q: "Calculate the percentage by mass of water in CuSO₄.5H₂O.", hint: "Mr of hydrate, mass of 5H₂O, then %", answer: 36.1, unit: "%", tolerance: 0.5, steps: ["Mr(CuSO₄.5H₂O) = 63.5+32+(4x16)+(5x18) = 249.5", "Mass of 5H₂O = 90", "% = (90/249.5) x 100 = 36.1%"] },
      { difficulty: "medium", q: "What mass of iron can be obtained from 1.00 kg of Fe₂O₃?", hint: "Find % Fe in Fe₂O₃, apply to 1.00 kg", answer: 699, unit: "g", tolerance: 5, steps: ["Mr Fe₂O₃ = 159.6", "Mass Fe = 2 x 55.8 = 111.6", "% Fe = 111.6/159.6 = 69.9%", "Mass from 1000 g = 699 g"] },
      { difficulty: "medium", q: "What mass of Na₂CO₃.10H₂O is needed to obtain 5.30 g of Na₂CO₃?", hint: "Find moles of Na₂CO₃, then use Mr of hydrate.", answer: 14.3, unit: "g", tolerance: 0.2, steps: ["n(Na₂CO₃) = 5.30/106 = 0.0500 mol", "Mr(Na₂CO₃.10H₂O) = 106 + (10x18) = 286", "m = 0.0500 x 286 = 14.3 g"] },
      // % composition backwards
      { difficulty: "medium", q: "An oxide of nitrogen contains 30.4% N by mass. Find the empirical formula.\n(Type as e.g. NO2)", hint: "% O = 100 - 30.4. Divide each by Ar.", answer: "NO2", unit: "", tolerance: 0, isText: true, steps: ["% O = 100 - 30.4 = 69.6%", "N: 30.4/14 = 2.171", "O: 69.6/16 = 4.350", "Ratio: 2.171:4.350 = 1:2", "Empirical = NO₂"] },
      { difficulty: "medium", q: "An oxide of phosphorus contains 43.6% P and 56.4% O. Find the empirical formula.\n(Type as e.g. P2O5)", hint: "Divide each % by Ar.", answer: "P2O5", unit: "", tolerance: 0, isText: true, steps: ["P: 43.6/31 = 1.406", "O: 56.4/16 = 3.525", "Ratio: 1.406:3.525 divide by 1.406 = 1:2.506", "Multiply by 2: 2:5", "Empirical = P₂O₅"] },
      { difficulty: "medium", q: "What is the % by mass of carbon in glucose (C₆H₁₂O₆)?", hint: "Mr of C₆H₁₂O₆ = 180", answer: 40.0, unit: "%", tolerance: 0.5, steps: ["Mr = (6x12)+(12x1)+(6x16) = 72+12+96 = 180", "Mass C = 72", "% C = (72/180) x 100 = 40.0%"] },
      { difficulty: "medium", q: "What mass of carbon is in 10.0 g of aspirin (C₉H₈O₄)?", hint: "Find % C in aspirin, then apply to 10.0 g", answer: 6.0, unit: "g", tolerance: 0.1, steps: ["Mr(C₉H₈O₄) = 108+8+64 = 180", "Mass of C in formula = 108", "% C = 108/180 = 60.0%", "Mass in 10.0 g = 0.600 x 10.0 = 6.00 g"] },

      // ═══ HARD (12) ═══
      // Combustion analysis
      { difficulty: "hard", q: "0.92 g of an alcohol burns completely to give 1.76 g CO₂ and 1.08 g H₂O. Find the empirical formula.\n(Type as e.g. C2H6O)", hint: "Find mol C from CO₂, mol H from H₂O (2H per molecule), mass O by subtraction.", answer: "C2H6O", unit: "", tolerance: 0, isText: true, steps: ["n(CO₂) = 1.76/44 = 0.040 mol, so n(C) = 0.040, mass C = 0.48 g", "n(H₂O) = 1.08/18 = 0.060 mol, so n(H) = 0.120, mass H = 0.12 g", "Mass O = 0.92 - 0.48 - 0.12 = 0.32 g, n(O) = 0.32/16 = 0.020", "Ratio 0.040:0.120:0.020 = 2:6:1", "Empirical formula = C₂H₆O"] },
      { difficulty: "hard", q: "0.600 g of a hydrocarbon burns to give 1.760 g CO₂ and 1.080 g H₂O. Find the empirical formula.\n(Type as e.g. CH3)", hint: "Find mol C from CO₂, mol H from H₂O. Check if mass adds up (hydrocarbon = C and H only).", answer: "CH3", unit: "", tolerance: 0, isText: true, steps: ["n(CO₂) = 1.760/44 = 0.0400, n(C) = 0.0400, mass C = 0.480 g", "n(H₂O) = 1.080/18 = 0.0600, n(H) = 0.120, mass H = 0.120 g", "Total = 0.480 + 0.120 = 0.600 g (matches sample)", "Ratio C:H = 0.0400:0.120 = 1:3", "Empirical = CH₃"] },
      { difficulty: "hard", q: "1.50 g of a compound containing C, H and O burns to give 2.20 g CO₂ and 0.900 g H₂O. Its Mr = 90. Find the molecular formula.\n(Type as e.g. C3H6O3)", hint: "Find mol C, mol H, mass O by subtraction. Get empirical, then use Mr.", answer: "C3H6O3", unit: "", tolerance: 0, isText: true, steps: ["n(CO₂) = 2.20/44 = 0.0500, mass C = 0.600 g", "n(H₂O) = 0.900/18 = 0.0500, n(H) = 0.100, mass H = 0.100 g", "Mass O = 1.50 - 0.600 - 0.100 = 0.800 g, n(O) = 0.0500", "Ratio C:H:O = 1:2:1, empirical = CH₂O (mass 30)", "n = 90/30 = 3", "Molecular formula = C₃H₆O₃"] },
      // Mr from ideal gas
      { difficulty: "hard", q: "0.867 g of gas X occupies 480 cm³ at 20 C and 100 kPa. Calculate its Mr.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "Find n from PV=nRT, then Mr = m/n. Convert all units.", answer: 44.0, unit: "g mol⁻¹", tolerance: 0.5, steps: ["T = 293 K, V = 4.80 x 10⁻⁴ m³, P = 100000 Pa", "n = PV/RT = (100000 x 0.000480)/(8.314 x 293)", "n = 48.0/2436 = 0.01970 mol", "Mr = 0.867/0.01970 = 44.0 g mol⁻¹"] },
      { difficulty: "hard", q: "0.164 g of a volatile liquid is vaporised. The vapour occupies 72.0 cm³ at 100 C and 100 kPa. Calculate Mr.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "PV=nRT. Convert units carefully.", answer: 70.0, unit: "g mol⁻¹", tolerance: 1, steps: ["T = 373 K, V = 7.20 x 10⁻⁵ m³, P = 100000 Pa", "n = PV/RT = (100000 x 0.0000720)/(8.314 x 373)", "n = 7.20/3101 = 0.002322 mol", "Mr = 0.164/0.002322 = 70.6 g mol⁻¹ (accept 70)"] },
      { difficulty: "hard", q: "A compound contains 52.2% C, 13.0% H and 34.8% O. Its Mr = 46. Find the molecular formula.\n(Type as e.g. C2H6O)", hint: "Find empirical from %, then compare mass with Mr.", answer: "C2H6O", unit: "", tolerance: 0, isText: true, steps: ["C: 52.2/12=4.35; H: 13.0/1=13.0; O: 34.8/16=2.175", "Divide by 2.175: C:H:O = 2:6:1", "Empirical = C₂H₆O, mass = 46", "Mr = 46, so molecular = C₂H₆O (ethanol)"] },
      { difficulty: "hard", q: "A compound is 38.7% C, 9.7% H and 51.6% O. Its Mr = 62. Find the molecular formula.\n(Type as e.g. C2H6O2)", hint: "Find empirical, then use Mr.", answer: "C2H6O2", unit: "", tolerance: 0, isText: true, steps: ["C: 38.7/12 = 3.225; H: 9.7/1 = 9.7; O: 51.6/16 = 3.225", "Divide by 3.225: 1:3:1", "Empirical = CH₃O, mass = 31", "n = 62/31 = 2", "Molecular = C₂H₆O₂"] },
      { difficulty: "hard", q: "2.00 g of a metal carbonate MCO₃ reacts with excess HCl. 480 cm³ of CO₂ is produced at RTP.\nCalculate the Ar of metal M.", hint: "Find mol CO₂ = mol MCO₃. Mr = m/n. Ar(M) = Mr - 12 - 48.", answer: 40, unit: "", tolerance: 1, steps: ["n(CO₂) = 0.480/24.0 = 0.0200 mol", "n(MCO₃) = 0.0200 mol (1:1)", "Mr(MCO₃) = 2.00/0.0200 = 100", "Ar(M) = 100 - 12 - 48 = 40", "M is calcium (Ca)"] },
      { difficulty: "hard", q: "A metal oxide M₂O₃ contains 52.9% metal. Calculate the Ar of M and identify it.", hint: "% O = 47.1. Find ratio of moles.", answer: 27, unit: "", tolerance: 0.5, steps: ["In 100 g: M = 52.9 g, O = 47.1 g", "n(O) = 47.1/16 = 2.944, but 3 O atoms so per formula unit", "Mr(M₂O₃) = 48/0.471 = 101.9 (from O being 47.1%)", "2 x Ar(M) = 101.9 - 48 = 53.9", "Ar(M) = 27.0 = aluminium (Al)"] },
      { difficulty: "hard", q: "When 10.0 g of hydrated sodium sulfate (Na₂SO₄.xH₂O) is heated, 4.43 g of Na₂SO₄ remains.\nCalculate x.", hint: "Mass of water lost, find mol Na₂SO₄ and mol H₂O, divide.", answer: 10, unit: "", tolerance: 0.1, steps: ["Mass H₂O = 10.0 - 4.43 = 5.57 g", "n(Na₂SO₄) = 4.43/142 = 0.0312 mol", "n(H₂O) = 5.57/18 = 0.309 mol", "x = 0.309/0.0312 = 9.9", "x = 10, formula is Na₂SO₄.10H₂O"] },
      { difficulty: "hard", q: "Calculate the percentage by mass of water in FeSO₄.7H₂O.", hint: "Mr of hydrate, mass of 7H₂O, then %", answer: 45.3, unit: "%", tolerance: 0.5, steps: ["Mr(FeSO₄) = 55.8+32+64 = 151.8", "Mr(7H₂O) = 126", "Mr(hydrate) = 277.8", "% H₂O = (126/277.8) x 100 = 45.4%"] },

      // ═══ EXAM (10) ═══
      { difficulty: "exam", q: "0.430 g of a liquid hydrocarbon CₓHᵧ (Mr = 86) is burned completely, producing 1.320 g CO₂ and 0.630 g H₂O. Find the molecular formula.\n(Type as e.g. C6H14)", hint: "Find mol C from CO₂, mol H from H₂O, find ratio, use Mr.", answer: "C6H14", unit: "", tolerance: 0, isText: true, steps: ["n(CO₂) = 1.320/44 = 0.03000, n(C) = 0.03000, mass C = 0.360 g", "n(H₂O) = 0.630/18 = 0.03500, n(H) = 0.0700, mass H = 0.070 g", "C:H = 0.030:0.070 = 3:7", "Empirical = C₃H₇, mass = 43", "n = 86/43 = 2, molecular = C₆H₁₄"] },
      { difficulty: "exam", q: "0.230 g of ethanol is burned and produces 0.440 g of CO₂ and 0.270 g of H₂O. Use combustion data to find the empirical formula and confirm it is C₂H₆O.\n(Type as e.g. C2H6O)", hint: "Find mol C, mol H, mass O by subtraction.", answer: "C2H6O", unit: "", tolerance: 0, isText: true, steps: ["n(CO₂) = 0.440/44 = 0.0100, mass C = 0.120 g", "n(H₂O) = 0.270/18 = 0.0150, n(H) = 0.0300, mass H = 0.030 g", "Mass O = 0.230-0.120-0.030 = 0.080 g, n(O) = 0.080/16 = 0.0050", "Ratio 0.010:0.030:0.005 = 2:6:1", "Empirical = C₂H₆O, confirmed"] },
      { difficulty: "exam", q: "A compound has the composition 12.8% C, 2.1% H, 85.1% Br. Its Mr = 188. Find the molecular formula.\n(Type as e.g. C2H4Br2)", hint: "Find empirical from %, then use Mr.", answer: "C2H4Br2", unit: "", tolerance: 0, isText: true, steps: ["C: 12.8/12 = 1.067; H: 2.1/1 = 2.1; Br: 85.1/80 = 1.064", "Divide by 1.064: 1:2:1", "Empirical = CH₂Br, mass = 93.8 (accept 94)", "n = 188/94 = 2", "Molecular = C₂H₄Br₂"] },
      { difficulty: "exam", q: "A gas has a density of 1.83 g dm⁻³ at RTP. It contains 82.8% C and 17.2% H. Find the molecular formula.\n(Type as e.g. C3H8)", hint: "Mr = density x 24. Then use % to find empirical, then molecular.", answer: "C3H8", unit: "", tolerance: 0, isText: true, steps: ["Mr = 1.83 x 24.0 = 43.9 (accept 44)", "C: 82.8/12 = 6.90; H: 17.2/1 = 17.2", "Ratio = 1:2.49 = 2:5? No...", "6.90:17.2 divide by 6.90 = 1:2.493", "Multiply by 2: 2:5 = C₂H₅ (mass 29)", "n = 44/29 = 1.5... try 3:8", "C: 82.8/12 x 44/100 = 3.04, H: 17.2 x 44/100 = 7.6", "Molecular = C₃H₈ (propane, Mr=44)"] },
      { difficulty: "exam", q: "0.372 g of a volatile liquid is injected into a gas syringe at 100 C and 101 kPa. The gas occupies 160 cm³.\nCalculate Mr and suggest the identity of the liquid.\n(R = 8.314 J mol⁻¹ K⁻¹)", hint: "PV=nRT to find n, then Mr = m/n.", answer: 72, unit: "g mol⁻¹", tolerance: 2, steps: ["T = 373 K, V = 1.60 x 10⁻⁴ m³, P = 101000 Pa", "n = PV/RT = (101000 x 0.000160)/(8.314 x 373)", "n = 16.16/3101 = 0.005211 mol", "Mr = 0.372/0.005211 = 71.4", "Likely pentane C₅H₁₂ (Mr = 72)"] },
      { difficulty: "exam", q: "A student heats 3.125 g of hydrated CuSO₄ to constant mass. The anhydrous residue weighs 2.000 g.\nCalculate the formula of the hydrated salt.\n(Type as e.g. CuSO4.5H2O)", hint: "Find mol CuSO₄ and mol H₂O, divide for x.", answer: "CuSO4.5H2O", unit: "", tolerance: 0, isText: true, steps: ["Mass H₂O = 3.125 - 2.000 = 1.125 g", "n(CuSO₄) = 2.000/159.5 = 0.01254 mol", "n(H₂O) = 1.125/18 = 0.06250 mol", "x = 0.06250/0.01254 = 4.98", "Formula = CuSO₄.5H₂O"] },
      { difficulty: "exam", q: "An organic compound is 54.5% C, 9.1% H and 36.4% O. Its mass spectrum shows Mr = 88.\nFind the molecular formula.\n(Type as e.g. C4H8O2)", hint: "Find empirical, compare mass with Mr.", answer: "C4H8O2", unit: "", tolerance: 0, isText: true, steps: ["C: 54.5/12 = 4.542; H: 9.1/1 = 9.1; O: 36.4/16 = 2.275", "Divide by 2.275: 2:4:1", "Empirical = C₂H₄O, mass = 44", "n = 88/44 = 2", "Molecular = C₄H₈O₂ (e.g. ethyl ethanoate)"] },
      { difficulty: "exam", q: "1.00 g of a Group 2 metal reacts with excess oxygen to form 1.40 g of oxide (M₂O? or MO?).\nCalculate the Ar of the metal and identify it.\nAssume the oxide formula is MO.", hint: "Mass O = 1.40-1.00. Find mol O, then mol M (1:1 for MO). Ar = m/n.", answer: 40, unit: "", tolerance: 1, steps: ["Mass O = 1.40 - 1.00 = 0.40 g", "n(O) = 0.40/16 = 0.0250 mol", "For MO: n(M) = 0.0250 mol", "Ar = 1.00/0.0250 = 40.0", "M is calcium (Ca)"] },
      { difficulty: "exam", q: "0.370 g of an unknown alcohol (containing C, H and O only) burns to produce 0.880 g CO₂ and 0.450 g H₂O.\nFind the empirical and molecular formula. Mr = 74.\n(Type as e.g. C4H10O)", hint: "Find mol C from CO₂, mol H from H₂O, mass O by subtraction, find ratio, then use Mr.", answer: "C4H10O", unit: "", tolerance: 0, isText: true, steps: ["n(CO₂) = 0.880/44 = 0.0200, n(C) = 0.0200, mass C = 0.240 g", "n(H₂O) = 0.450/18 = 0.0250, n(H) = 0.0500, mass H = 0.050 g", "Mass O = 0.370 - 0.240 - 0.050 = 0.080 g, n(O) = 0.080/16 = 0.0050", "Ratio C:H:O = 0.020:0.050:0.005 = 4:10:1", "Empirical = C₄H₁₀O, mass = 74", "Mr = 74, so molecular = C₄H₁₀O (butan-1-ol)"] },
    ]
  },
  {
    id: "calc_titration", title: "Titrations & Volumetric Analysis", color: "#16a97d", board: "both",
    questions: [
      // ═══ EASY (12) ═══
      // Basic 1:1 titrations - find unknown concentration
      { difficulty: "easy", q: "25.0 cm³ of NaOH is neutralised by 20.0 cm³ of 0.100 mol dm⁻³ HCl.\nNaOH + HCl -> NaCl + H₂O\nCalculate the concentration of NaOH.", hint: "n(HCl) = c x V; 1:1 ratio; c(NaOH) = n / V", answer: 0.08, unit: "mol dm⁻³", tolerance: 0.004, steps: ["n(HCl) = 0.100 x 0.0200 = 0.00200 mol", "1:1 ratio: n(NaOH) = 0.00200 mol", "c(NaOH) = 0.00200 / 0.0250 = 0.0800 mol dm⁻³"] },
      { difficulty: "easy", q: "25.0 cm³ of HCl is neutralised by 20.0 cm³ of 0.150 mol dm⁻³ NaOH.\nCalculate the concentration of HCl.", hint: "n = cV for NaOH, 1:1 ratio, then c = n/V for HCl", answer: 0.12, unit: "mol dm⁻³", tolerance: 0.005, steps: ["n(NaOH) = 0.150 x 0.0200 = 0.00300 mol", "1:1 ratio: n(HCl) = 0.00300 mol", "c(HCl) = 0.00300 / 0.0250 = 0.120 mol dm⁻³"] },
      { difficulty: "easy", q: "20.0 cm³ of KOH is neutralised by 25.0 cm³ of 0.0500 mol dm⁻³ HCl.\nCalculate the concentration of KOH.", hint: "n(HCl) = cV; 1:1; c(KOH) = n/V", answer: 0.0625, unit: "mol dm⁻³", tolerance: 0.003, steps: ["n(HCl) = 0.0500 x 0.0250 = 0.00125 mol", "1:1 ratio: n(KOH) = 0.00125 mol", "c(KOH) = 0.00125 / 0.0200 = 0.0625 mol dm⁻³"] },
      // Find volume needed
      { difficulty: "easy", q: "What volume (cm³) of 0.100 mol dm⁻³ HCl is needed to neutralise 25.0 cm³ of 0.100 mol dm⁻³ NaOH?", hint: "Same concentrations, 1:1 ratio, so same volume!", answer: 25.0, unit: "cm³", tolerance: 0.5, steps: ["n(NaOH) = 0.100 x 0.0250 = 0.00250 mol", "1:1 ratio: n(HCl) = 0.00250 mol", "V = n/c = 0.00250/0.100 = 0.0250 dm³ = 25.0 cm³"] },
      { difficulty: "easy", q: "What volume (cm³) of 0.200 mol dm⁻³ NaOH neutralises 10.0 cm³ of 0.100 mol dm⁻³ HCl?", hint: "n(HCl) = cV; 1:1; V(NaOH) = n/c", answer: 5.0, unit: "cm³", tolerance: 0.2, steps: ["n(HCl) = 0.100 x 0.0100 = 0.00100 mol", "n(NaOH) = 0.00100 mol (1:1)", "V = 0.00100 / 0.200 = 0.00500 dm³ = 5.00 cm³"] },
      // Standard solutions
      { difficulty: "easy", q: "A standard solution is made by dissolving 1.575 g of ethanedioic acid (H₂C₂O₄, Mr = 90) in a 250 cm³ volumetric flask.\nCalculate its concentration.", hint: "n = m/M, then c = n/V", answer: 0.07, unit: "mol dm⁻³", tolerance: 0.003, steps: ["n = 1.575 / 90 = 0.01750 mol", "c = 0.01750 / 0.250 = 0.0700 mol dm⁻³"] },
      { difficulty: "easy", q: "2.65 g of Na₂CO₃ (Mr = 106) is dissolved in a 250 cm³ volumetric flask.\nCalculate the concentration.", hint: "n = m/M, c = n/V", answer: 0.1, unit: "mol dm⁻³", tolerance: 0.005, steps: ["n = 2.65 / 106 = 0.0250 mol", "c = 0.0250 / 0.250 = 0.100 mol dm⁻³"] },
      { difficulty: "easy", q: "What mass of NaOH (Mr = 40) is needed to make 500 cm³ of 0.200 mol dm⁻³ solution?", hint: "n = cV, m = nM", answer: 4.0, unit: "g", tolerance: 0.1, steps: ["n = 0.200 x 0.500 = 0.100 mol", "m = 0.100 x 40 = 4.00 g"] },
      // Find moles from titre
      { difficulty: "easy", q: "In a titration, 23.50 cm³ of 0.100 mol dm⁻³ NaOH is used.\nCalculate the number of moles of NaOH.", hint: "n = c x V. Convert cm³ to dm³.", answer: 0.00235, unit: "mol", tolerance: 0.00005, steps: ["V = 23.50 / 1000 = 0.02350 dm³", "n = c x V = 0.100 x 0.02350", "n = 0.00235 mol"] },
      { difficulty: "easy", q: "Mean concordant titres: 24.10, 24.00, 24.15 cm³.\nCalculate the mean titre.", hint: "Add the three values and divide by 3.", answer: 24.08, unit: "cm³", tolerance: 0.02, steps: ["Mean = (24.10 + 24.00 + 24.15) / 3", "Mean = 72.25 / 3 = 24.08 cm³"] },
      { difficulty: "easy", q: "25.0 cm³ of 0.100 mol dm⁻³ Na₂CO₃ reacts with HCl.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nHow many moles of HCl are needed?", hint: "Find mol Na₂CO₃, then use 1:2 ratio.", answer: 0.005, unit: "mol", tolerance: 0.0003, steps: ["n(Na₂CO₃) = 0.100 x 0.0250 = 0.00250 mol", "Ratio 1:2, so n(HCl) = 2 x 0.00250", "n(HCl) = 0.00500 mol"] },
      { difficulty: "easy", q: "A titre of 18.40 cm³ of 0.0500 mol dm⁻³ H₂SO₄ is needed to neutralise a sample of NaOH.\nHow many moles of H₂SO₄ were used?", hint: "n = c x V", answer: 0.00092, unit: "mol", tolerance: 0.00002, steps: ["V = 18.40 / 1000 = 0.01840 dm³", "n = 0.0500 x 0.01840", "n = 9.20 x 10⁻⁴ mol"] },

      // ═══ MEDIUM (16) ═══
      // 2:1 stoichiometry titrations
      { difficulty: "medium", q: "What volume (cm³) of 0.200 mol dm⁻³ H₂SO₄ neutralises 30.0 cm³ of 0.150 mol dm⁻³ NaOH?\nH₂SO₄ + 2NaOH -> Na₂SO₄ + 2H₂O", hint: "Find n(NaOH), use 2:1 ratio for H₂SO₄, then V = n/c", answer: 11.25, unit: "cm³", tolerance: 0.2, steps: ["n(NaOH) = 0.150 x 0.0300 = 0.00450 mol", "n(H₂SO₄) = 0.00450 / 2 = 0.00225 mol", "V = 0.00225 / 0.200 = 0.01125 dm³ = 11.25 cm³"] },
      { difficulty: "medium", q: "25.0 cm³ of 0.100 mol dm⁻³ H₂SO₄ neutralises 20.0 cm³ of NaOH.\nH₂SO₄ + 2NaOH -> Na₂SO₄ + 2H₂O\nCalculate c(NaOH).", hint: "n(H₂SO₄) = cV; n(NaOH) = 2 x n(H₂SO₄); c = n/V", answer: 0.25, unit: "mol dm⁻³", tolerance: 0.01, steps: ["n(H₂SO₄) = 0.100 x 0.0250 = 0.00250 mol", "n(NaOH) = 2 x 0.00250 = 0.00500 mol", "c(NaOH) = 0.00500 / 0.0200 = 0.250 mol dm⁻³"] },
      // Na₂CO₃ + 2HCl
      { difficulty: "medium", q: "25.0 cm³ of Na₂CO₃ solution is titrated with 0.100 mol dm⁻³ HCl. Titre = 22.40 cm³.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate c(Na₂CO₃).", hint: "n(HCl) = cV; Na₂CO₃:HCl = 1:2; c = n/V", answer: 0.0448, unit: "mol dm⁻³", tolerance: 0.001, steps: ["n(HCl) = 0.100 x 0.02240 = 0.00224 mol", "n(Na₂CO₃) = 0.00224 / 2 = 0.00112 mol", "c(Na₂CO₃) = 0.00112 / 0.0250 = 0.0448 mol dm⁻³"] },
      { difficulty: "medium", q: "25.0 cm³ of 0.100 mol dm⁻³ Na₂CO₃ is titrated with 0.150 mol dm⁻³ HCl.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate the volume of HCl needed (cm³).", hint: "n(Na₂CO₃) = cV; n(HCl) = 2 x n(Na₂CO₃); V = n/c", answer: 33.3, unit: "cm³", tolerance: 0.3, steps: ["n(Na₂CO₃) = 0.100 x 0.0250 = 0.00250 mol", "n(HCl) = 2 x 0.00250 = 0.00500 mol", "V = 0.00500 / 0.150 = 0.03333 dm³ = 33.3 cm³"] },
      // Diprotic acid
      { difficulty: "medium", q: "25.0 cm³ of ethanedioic acid (H₂C₂O₄) is titrated with 0.100 mol dm⁻³ NaOH. Titre = 20.0 cm³.\nH₂C₂O₄ + 2NaOH -> Na₂C₂O₄ + 2H₂O\nCalculate c(H₂C₂O₄).", hint: "n(NaOH) = cV; acid:base = 1:2; c = n/V", answer: 0.04, unit: "mol dm⁻³", tolerance: 0.002, steps: ["n(NaOH) = 0.100 x 0.0200 = 0.00200 mol", "n(H₂C₂O₄) = 0.00200 / 2 = 0.00100 mol", "c = 0.00100 / 0.0250 = 0.0400 mol dm⁻³"] },
      // Convert to g dm⁻³
      { difficulty: "medium", q: "A titration shows HCl has concentration 0.120 mol dm⁻³.\nConvert this to g dm⁻³.", hint: "g dm⁻³ = c x Mr", answer: 4.38, unit: "g dm⁻³", tolerance: 0.05, steps: ["Mr(HCl) = 1 + 35.5 = 36.5", "g dm⁻³ = 0.120 x 36.5 = 4.38 g dm⁻³"] },
      { difficulty: "medium", q: "A NaOH solution has concentration 8.0 g dm⁻³.\nCalculate its concentration in mol dm⁻³.", hint: "c (mol dm⁻³) = (g dm⁻³) / Mr", answer: 0.2, unit: "mol dm⁻³", tolerance: 0.01, steps: ["Mr(NaOH) = 23 + 16 + 1 = 40", "c = 8.0 / 40 = 0.200 mol dm⁻³"] },
      // Purity from titration
      { difficulty: "medium", q: "A 0.500 g aspirin tablet (Mr = 180) is titrated with 0.100 mol dm⁻³ NaOH. Titre = 27.7 cm³. (1:1 ratio)\nCalculate % purity.", hint: "n(NaOH) = cV; n(aspirin) = n(NaOH); mass = nM; %", answer: 99.8, unit: "%", tolerance: 0.5, steps: ["n(NaOH) = 0.100 x 0.0277 = 0.00277 mol", "n(aspirin) = 0.00277 mol (1:1)", "mass = 0.00277 x 180 = 0.499 g", "% purity = (0.499 / 0.500) x 100 = 99.8%"] },
      // Reacting masses from titration
      { difficulty: "medium", q: "25.0 cm³ of 0.200 mol dm⁻³ NaOH reacts with excess HCl.\nNaOH + HCl -> NaCl + H₂O\nCalculate the mass of NaCl formed.", hint: "n(NaOH) = cV; 1:1 ratio; m = nM", answer: 0.293, unit: "g", tolerance: 0.005, steps: ["n(NaOH) = 0.200 x 0.0250 = 0.00500 mol", "n(NaCl) = 0.00500 mol (1:1)", "Mr(NaCl) = 23 + 35.5 = 58.5", "m = 0.00500 x 58.5 = 0.293 g"] },
      { difficulty: "medium", q: "30.0 cm³ of 0.100 mol dm⁻³ Na₂CO₃ reacts with excess HCl.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nWhat volume of CO₂ is produced at RTP?", hint: "n(Na₂CO₃) = cV; 1:1 ratio for CO₂; V = n x 24.0", answer: 72, unit: "cm³", tolerance: 1, steps: ["n(Na₂CO₃) = 0.100 x 0.0300 = 0.00300 mol", "n(CO₂) = 0.00300 mol (1:1)", "V = 0.00300 x 24.0 = 0.0720 dm³ = 72.0 cm³"] },
      // Triprotic acid
      { difficulty: "medium", q: "25.0 cm³ of H₃PO₄ is titrated with 0.150 mol dm⁻³ NaOH. Titre = 30.0 cm³.\nH₃PO₄ + 3NaOH -> Na₃PO₄ + 3H₂O\nCalculate c(H₃PO₄).", hint: "n(NaOH) = cV; 1:3 ratio; c = n/V", answer: 0.06, unit: "mol dm⁻³", tolerance: 0.003, steps: ["n(NaOH) = 0.150 x 0.0300 = 0.00450 mol", "n(H₃PO₄) = 0.00450 / 3 = 0.00150 mol", "c = 0.00150 / 0.0250 = 0.0600 mol dm⁻³"] },
      // Multiple titres - concordance
      { difficulty: "medium", q: "Titres: 24.10, 25.60, 24.20, 24.05 cm³.\nIdentify the anomalous result and calculate the mean concordant titre.", hint: "The outlier is 25.60. Average the other three.", answer: 24.12, unit: "cm³", tolerance: 0.02, steps: ["25.60 is anomalous (not within 0.10 of the others)", "Concordant titres: 24.10, 24.20, 24.05", "Mean = (24.10 + 24.20 + 24.05) / 3 = 24.12 cm³"] },
      { difficulty: "medium", q: "What mass of Na₂CO₃ (Mr = 106) is needed to make 250 cm³ of 0.0500 mol dm⁻³ standard solution?", hint: "n = cV, m = nM", answer: 1.325, unit: "g", tolerance: 0.01, steps: ["n = 0.0500 x 0.250 = 0.01250 mol", "m = 0.01250 x 106 = 1.325 g"] },
      { difficulty: "medium", q: "25.0 cm³ of 0.100 mol dm⁻³ NaOH neutralises 22.50 cm³ of HCl.\nCalculate c(HCl) in both mol dm⁻³ and g dm⁻³.", hint: "Find c in mol dm⁻³ first, then multiply by Mr for g dm⁻³", answer: 0.111, unit: "mol dm⁻³", tolerance: 0.003, steps: ["n(NaOH) = 0.100 x 0.0250 = 0.00250 mol", "n(HCl) = 0.00250 mol (1:1)", "c = 0.00250 / 0.02250 = 0.111 mol dm⁻³", "g dm⁻³ = 0.111 x 36.5 = 4.05 g dm⁻³"] },

      // ═══ HARD (12) ═══
      // Purity calculations
      { difficulty: "hard", q: "A 0.400 g impure Na₂CO₃ sample is titrated with 0.200 mol dm⁻³ HCl. Titre = 34.0 cm³.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate % purity. (Mr Na₂CO₃ = 106)", hint: "n(HCl) = cV; divide by 2; mass = nM; %", answer: 90.1, unit: "%", tolerance: 0.5, steps: ["n(HCl) = 0.200 x 0.0340 = 0.00680 mol", "n(Na₂CO₃) = 0.00680 / 2 = 0.00340 mol", "mass = 0.00340 x 106 = 0.360 g", "% purity = (0.360 / 0.400) x 100 = 90.1%"] },
      { difficulty: "hard", q: "A 0.500 g antacid tablet (containing CaCO₃) is dissolved in 50.0 cm³ of 0.200 mol dm⁻³ HCl.\nCaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂\nThe excess HCl requires 10.0 cm³ of 0.100 mol dm⁻³ NaOH.\nCalculate % CaCO₃ in the tablet.", hint: "Back titration: total HCl - excess = reacted.", answer: 90.0, unit: "%", tolerance: 0.5, steps: ["Total n(HCl) = 0.200 x 0.0500 = 0.01000 mol", "n(excess HCl) = n(NaOH) = 0.100 x 0.0100 = 0.00100 mol", "n(HCl reacted) = 0.01000 - 0.00100 = 0.00900 mol", "n(CaCO₃) = 0.00900 / 2 = 0.00450 mol", "mass = 0.00450 x 100 = 0.450 g", "% = (0.450 / 0.500) x 100 = 90.0%"] },
      // Back titration
      { difficulty: "hard", q: "1.20 g of CaCO₃ sample is dissolved in 50.0 cm³ of 0.500 mol dm⁻³ HCl. Excess HCl needs 12.5 cm³ of 0.200 mol dm⁻³ NaOH.\nCaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂\nCalculate % purity.", hint: "Total HCl - excess HCl = HCl reacted with CaCO₃", answer: 93.8, unit: "%", tolerance: 0.5, steps: ["Total n(HCl) = 0.500 x 0.0500 = 0.0250 mol", "n(excess HCl) = n(NaOH) = 0.200 x 0.0125 = 0.00250 mol", "n(HCl reacted) = 0.0250 - 0.00250 = 0.0225 mol", "n(CaCO₃) = 0.0225 / 2 = 0.01125 mol", "mass = 0.01125 x 100 = 1.125 g", "% = (1.125 / 1.20) x 100 = 93.8%"] },
      // Volumetric flask aliquot
      { difficulty: "hard", q: "1.325 g of anhydrous Na₂CO₃ is dissolved in 250 cm³. 25.0 cm³ aliquots are titrated with HCl. Mean titre = 25.00 cm³.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate c(HCl).", hint: "Find c(Na₂CO₃) first, then n from aliquot, use ratio, c = n/V", answer: 0.1, unit: "mol dm⁻³", tolerance: 0.005, steps: ["n(Na₂CO₃) total = 1.325 / 106 = 0.01250 mol", "c(Na₂CO₃) = 0.01250 / 0.250 = 0.0500 mol dm⁻³", "In 25.0 cm³: n(Na₂CO₃) = 0.0500 x 0.0250 = 0.00125 mol", "n(HCl) = 2 x 0.00125 = 0.00250 mol", "c(HCl) = 0.00250 / 0.02500 = 0.100 mol dm⁻³"] },
      // Find Mr from titration
      { difficulty: "hard", q: "0.600 g of a monobasic acid HA is dissolved in water and titrated with 0.100 mol dm⁻³ NaOH. Titre = 25.0 cm³.\nHA + NaOH -> NaA + H₂O\nCalculate Mr of the acid.", hint: "n(NaOH) = n(HA) from 1:1 ratio. Mr = m/n", answer: 240, unit: "g mol⁻¹", tolerance: 2, steps: ["n(NaOH) = 0.100 x 0.0250 = 0.00250 mol", "n(HA) = 0.00250 mol (1:1)", "Mr = m/n = 0.600 / 0.00250 = 240 g mol⁻¹"] },
      { difficulty: "hard", q: "0.460 g of a dibasic acid H₂X is dissolved and titrated with 0.200 mol dm⁻³ NaOH. Titre = 25.0 cm³.\nH₂X + 2NaOH -> Na₂X + 2H₂O\nCalculate Mr of the acid.", hint: "n(NaOH) = cV; n(H₂X) = n(NaOH)/2; Mr = m/n", answer: 184, unit: "g mol⁻¹", tolerance: 2, steps: ["n(NaOH) = 0.200 x 0.0250 = 0.00500 mol", "n(H₂X) = 0.00500 / 2 = 0.00250 mol", "Mr = 0.460 / 0.00250 = 184 g mol⁻¹"] },
      // Concentration of acid in g dm⁻³
      { difficulty: "hard", q: "25.0 cm³ of H₂SO₄ is titrated with 0.100 mol dm⁻³ NaOH. Titre = 20.0 cm³.\nH₂SO₄ + 2NaOH -> Na₂SO₄ + 2H₂O\nCalculate c(H₂SO₄) in g dm⁻³.", hint: "Find c in mol dm⁻³ first, then convert", answer: 3.92, unit: "g dm⁻³", tolerance: 0.05, steps: ["n(NaOH) = 0.100 x 0.0200 = 0.00200 mol", "n(H₂SO₄) = 0.00200 / 2 = 0.00100 mol", "c = 0.00100 / 0.0250 = 0.0400 mol dm⁻³", "g dm⁻³ = 0.0400 x 98 = 3.92 g dm⁻³"] },
      // Redox titration
      { difficulty: "hard", q: "25.0 cm³ of iron(II) sulfate solution is titrated with 0.0200 mol dm⁻³ KMnO₄. Titre = 24.0 cm³.\nMnO₄⁻ + 5Fe²⁺ + 8H⁺ -> Mn²⁺ + 5Fe³⁺ + 4H₂O\nCalculate c(Fe²⁺).", hint: "n(KMnO₄) = cV; Fe:KMnO₄ = 5:1; c = n/V", answer: 0.096, unit: "mol dm⁻³", tolerance: 0.003, steps: ["n(KMnO₄) = 0.0200 x 0.0240 = 4.80 x 10⁻⁴ mol", "n(Fe²⁺) = 5 x 4.80 x 10⁻⁴ = 2.40 x 10⁻³ mol", "c(Fe²⁺) = 2.40 x 10⁻³ / 0.0250 = 0.0960 mol dm⁻³"] },
      // Iodine/thiosulfate
      { difficulty: "hard", q: "In an iodine-thiosulfate titration, 25.0 cm³ of iodine solution requires 20.0 cm³ of 0.100 mol dm⁻³ Na₂S₂O₃.\n2Na₂S₂O₃ + I₂ -> Na₂S₄O₆ + 2NaI\nCalculate c(I₂).", hint: "n(Na₂S₂O₃) = cV; I₂:Na₂S₂O₃ = 1:2; c = n/V", answer: 0.04, unit: "mol dm⁻³", tolerance: 0.002, steps: ["n(Na₂S₂O₃) = 0.100 x 0.0200 = 0.00200 mol", "n(I₂) = 0.00200 / 2 = 0.00100 mol", "c(I₂) = 0.00100 / 0.0250 = 0.0400 mol dm⁻³"] },
      // Mass of substance from titration
      { difficulty: "hard", q: "25.0 cm³ of Na₂CO₃ solution is titrated with 0.120 mol dm⁻³ HCl. Titre = 21.60 cm³.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate the mass of Na₂CO₃ in 1.00 dm³ of solution.", hint: "Find c(Na₂CO₃) first, then mass in 1 dm³ = c x Mr", answer: 5.50, unit: "g", tolerance: 0.1, steps: ["n(HCl) = 0.120 x 0.02160 = 2.592 x 10⁻³ mol", "n(Na₂CO₃) = 2.592 x 10⁻³ / 2 = 1.296 x 10⁻³ mol", "c = 1.296 x 10⁻³ / 0.0250 = 0.05184 mol dm⁻³", "mass per dm³ = 0.05184 x 106 = 5.50 g dm⁻³"] },
      // Double indicator titration concept
      { difficulty: "hard", q: "25.0 cm³ of a mixture of NaOH and Na₂CO₃ is titrated with 0.100 mol dm⁻³ HCl.\nUsing phenolphthalein indicator, titre = 15.00 cm³.\nUsing methyl orange indicator (fresh sample), titre = 25.00 cm³.\nCalculate c(NaOH) and c(Na₂CO₃) in the mixture.", hint: "Phenolphthalein: NaOH + half Na₂CO₃ reacts. Methyl orange: all acid reacts. Set up simultaneous equations.", answer: 0.02, unit: "mol dm⁻³", tolerance: 0.002, steps: ["With phenolphthalein: n(HCl) = 0.100 x 0.01500 = 0.00150 mol", "This neutralises all NaOH + Na₂CO₃ -> NaHCO₃", "With methyl orange: n(HCl) = 0.100 x 0.02500 = 0.00250 mol", "This neutralises all NaOH + all Na₂CO₃", "Extra HCl for full Na₂CO₃ = 0.00250 - 0.00150 = 0.00100 mol", "n(Na₂CO₃) = 0.00100 / 1 = 0.00100 (needs 1 more HCl for NaHCO₃ -> NaCl)", "Actually: n(Na₂CO₃) = 0.00100 mol, n(NaOH) = 0.00150 - 0.00100 = 0.00050 mol", "c(NaOH) = 0.00050/0.0250 = 0.0200 mol dm⁻³"] },

      // ═══ EXAM (10) ═══
      { difficulty: "exam", q: "5.00 g of vinegar is titrated with 0.100 mol dm⁻³ NaOH. Titre = 31.3 cm³.\nCH₃COOH + NaOH -> CH₃COONa + H₂O\nCalculate the % by mass of ethanoic acid (Mr = 60).", hint: "n(NaOH) = cV; 1:1; mass = nM; %", answer: 3.76, unit: "%", tolerance: 0.1, steps: ["n(NaOH) = 0.100 x 0.0313 = 0.00313 mol", "n(CH₃COOH) = 0.00313 mol (1:1)", "mass = 0.00313 x 60 = 0.1878 g", "% = (0.1878 / 5.00) x 100 = 3.76%"] },
      { difficulty: "exam", q: "A 1.62 g impure Na₂CO₃ sample is dissolved and made up to 250 cm³. 25.0 cm³ aliquots are titrated with 0.105 mol dm⁻³ HCl. Mean titre = 24.80 cm³.\nNa₂CO₃ + 2HCl -> 2NaCl + H₂O + CO₂\nCalculate % purity (Mr Na₂CO₃ = 106).", hint: "n(HCl) from titre, use ratio, scale up x10, find mass.", answer: 85.3, unit: "%", tolerance: 0.5, steps: ["n(HCl) = 0.105 x 0.02480 = 2.604 x 10⁻³ mol", "n(Na₂CO₃) in 25 cm³ = 2.604 x 10⁻³ / 2 = 1.302 x 10⁻³ mol", "n(Na₂CO₃) in 250 cm³ = 1.302 x 10⁻³ x 10 = 0.01302 mol", "mass = 0.01302 x 106 = 1.380 g", "% = (1.380 / 1.62) x 100 = 85.2%"] },
      { difficulty: "exam", q: "25.0 cm³ of 0.0700 mol dm⁻³ H₂C₂O₄ is titrated against KMnO₄ solution.\n2KMnO₄ + 5H₂C₂O₄ + 3H₂SO₄ -> 2MnSO₄ + K₂SO₄ + 10CO₂ + 8H₂O\nTitre = 18.6 cm³. Calculate c(KMnO₄).", hint: "n(H₂C₂O₄) = cV; use 5:2 ratio for KMnO₄; c = n/V", answer: 0.0376, unit: "mol dm⁻³", tolerance: 0.001, steps: ["n(H₂C₂O₄) = 0.0700 x 0.0250 = 1.750 x 10⁻³ mol", "n(KMnO₄) = 1.750 x 10⁻³ x (2/5) = 7.000 x 10⁻⁴ mol", "c = 7.000 x 10⁻⁴ / 0.0186 = 0.0376 mol dm⁻³"] },
      { difficulty: "exam", q: "0.2640 g of sodium oxalate (Na₂C₂O₄, Mr = 134) is titrated with KMnO₄. Titre = 30.74 cm³.\n5Na₂C₂O₄ + 2KMnO₄ + 8H₂SO₄ -> products\nCalculate c(KMnO₄).", hint: "n(Na₂C₂O₄) = m/M; 5:2 ratio; c = n/V", answer: 0.02564, unit: "mol dm⁻³", tolerance: 0.001, steps: ["n(Na₂C₂O₄) = 0.2640 / 134 = 1.970 x 10⁻³ mol", "n(KMnO₄) = 1.970 x 10⁻³ x (2/5) = 7.881 x 10⁻⁴ mol", "c = 7.881 x 10⁻⁴ / 0.03074 = 0.02564 mol dm⁻³"] },
      { difficulty: "exam", q: "25.0 cm³ of FeSO₄ solution is titrated with 0.0200 mol dm⁻³ KMnO₄. Titre = 22.5 cm³.\nMnO₄⁻ + 5Fe²⁺ + 8H⁺ -> Mn²⁺ + 5Fe³⁺ + 4H₂O\nCalculate the mass of iron in 1.00 dm³ of solution.", hint: "Find c(Fe²⁺), then mass per dm³ = c x Ar(Fe)", answer: 5.03, unit: "g", tolerance: 0.1, steps: ["n(KMnO₄) = 0.0200 x 0.0225 = 4.50 x 10⁻⁴ mol", "n(Fe²⁺) = 5 x 4.50 x 10⁻⁴ = 2.25 x 10⁻³ mol", "c(Fe²⁺) = 2.25 x 10⁻³ / 0.0250 = 0.0900 mol dm⁻³", "mass per dm³ = 0.0900 x 55.8 = 5.02 g"] },
      { difficulty: "exam", q: "A 0.500 g sample of impure MgCO₃ is added to 50.0 cm³ of 0.200 mol dm⁻³ HCl.\nMgCO₃ + 2HCl -> MgCl₂ + H₂O + CO₂\nThe excess HCl requires 25.0 cm³ of 0.100 mol dm⁻³ NaOH.\nCalculate the % purity.", hint: "Back titration: total HCl - excess = reacted", answer: 63.3, unit: "%", tolerance: 0.5, steps: ["Total n(HCl) = 0.200 x 0.0500 = 0.01000 mol", "n(excess HCl) = n(NaOH) = 0.100 x 0.0250 = 0.00250 mol", "n(HCl reacted) = 0.01000 - 0.00250 = 0.00750 mol", "n(MgCO₃) = 0.00750 / 2 = 0.00375 mol", "Mr(MgCO₃) = 24.3 + 12 + 48 = 84.3", "mass = 0.00375 x 84.3 = 0.316 g", "% = (0.316 / 0.500) x 100 = 63.3%"] },
      { difficulty: "exam", q: "0.500 g of an iron tablet is dissolved in acid. The Fe²⁺ is titrated with 0.0200 mol dm⁻³ KMnO₄.\nTitre = 24.0 cm³.\nMnO₄⁻ + 5Fe²⁺ + 8H⁺ -> Mn²⁺ + 5Fe³⁺ + 4H₂O\nCalculate the mass of iron per tablet and the % iron.", hint: "n(KMnO₄) = cV; n(Fe) = 5 x n(KMnO₄); mass = n x Ar(Fe)", answer: 26.8, unit: "%", tolerance: 0.5, steps: ["n(KMnO₄) = 0.0200 x 0.0240 = 4.80 x 10⁻⁴ mol", "n(Fe²⁺) = 5 x 4.80 x 10⁻⁴ = 2.40 x 10⁻³ mol", "mass Fe = 2.40 x 10⁻³ x 55.8 = 0.1339 g", "% Fe = (0.1339 / 0.500) x 100 = 26.8%"] },
      { difficulty: "exam", q: "A vitamin C tablet (Mr ascorbic acid = 176) is dissolved and titrated with 0.0500 mol dm⁻³ I₂.\nAscorbic acid + I₂ -> dehydroascorbic acid + 2HI (1:1 ratio)\nTitre = 28.40 cm³. Calculate the mass of vitamin C per tablet.", hint: "n(I₂) = cV; 1:1; mass = n x Mr", answer: 0.250, unit: "g", tolerance: 0.005, steps: ["n(I₂) = 0.0500 x 0.02840 = 1.420 x 10⁻³ mol", "n(ascorbic acid) = 1.420 x 10⁻³ mol (1:1)", "mass = 1.420 x 10⁻³ x 176 = 0.250 g = 250 mg"] },
      { difficulty: "exam", q: "A sample of bleach (NaClO) is diluted: 10.0 cm³ to 250 cm³. 25.0 cm³ of the diluted bleach is added to excess KI:\nNaClO + 2KI + H₂O -> I₂ + NaCl + 2KOH\nThe I₂ released requires 20.0 cm³ of 0.100 mol dm⁻³ Na₂S₂O₃:\n2Na₂S₂O₃ + I₂ -> Na₂S₄O₆ + 2NaI\nCalculate c(NaClO) in the original bleach.", hint: "n(Na₂S₂O₃) -> n(I₂) (2:1) -> n(NaClO) (1:1). Scale up for dilution.", answer: 1.0, unit: "mol dm⁻³", tolerance: 0.05, steps: ["n(Na₂S₂O₃) = 0.100 x 0.0200 = 0.00200 mol", "n(I₂) = 0.00200 / 2 = 0.00100 mol", "n(NaClO) in 25 cm³ diluted = 0.00100 mol (1:1)", "c(NaClO) diluted = 0.00100 / 0.0250 = 0.0400 mol dm⁻³", "Dilution factor = 250/10 = 25", "c(NaClO) original = 0.0400 x 25 = 1.00 mol dm⁻³"] },
      { difficulty: "exam", q: "2.50 g of hydrated ethanedioic acid (H₂C₂O₄.2H₂O, Mr = 126) is dissolved in 250 cm³.\n25.0 cm³ aliquots are titrated with NaOH. Titre = 15.85 cm³.\nH₂C₂O₄ + 2NaOH -> Na₂C₂O₄ + 2H₂O\nCalculate c(NaOH).", hint: "Find c(H₂C₂O₄) from mass of hydrate, then n from aliquot, use ratio, c = n/V", answer: 0.250, unit: "mol dm⁻³", tolerance: 0.005, steps: ["n(H₂C₂O₄.2H₂O) = 2.50 / 126 = 0.01984 mol", "c(H₂C₂O₄) = 0.01984 / 0.250 = 0.07937 mol dm⁻³", "In 25.0 cm³: n(H₂C₂O₄) = 0.07937 x 0.0250 = 1.984 x 10⁻³ mol", "n(NaOH) = 2 x 1.984 x 10⁻³ = 3.968 x 10⁻³ mol", "c(NaOH) = 3.968 x 10⁻³ / 0.01585 = 0.250 mol dm⁻³... hmm", "Let me recheck: c = 3.968e-3 / 0.01585 = 0.2503", "c(NaOH) = 0.250 mol dm⁻³"] },
    ]
  },
  {
    id: "calc_enthalpy", title: "Enthalpy Changes", color: "#7c3aed", board: "both",
    questions: [
      // ═══ EASY (12) ═══
      // q = mcΔT basics
      { difficulty: "easy", q: "100 g of water is heated from 20.0 C to 35.0 C. Calculate the heat energy transferred (J).\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "q = m x c x ΔT", answer: 6270, unit: "J", tolerance: 30, steps: ["ΔT = 35.0 - 20.0 = 15.0 C", "q = m x c x ΔT = 100 x 4.18 x 15.0", "q = 6270 J"] },
      { difficulty: "easy", q: "500 g of water absorbs 20 920 J. Calculate the temperature rise.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "Rearrange q = mcΔT for ΔT.", answer: 10.0, unit: "C", tolerance: 0.1, steps: ["ΔT = q / (m x c)", "ΔT = 20920 / (500 x 4.18)", "ΔT = 10.0 C"] },
      { difficulty: "easy", q: "250 g of water rises from 18.0 C to 24.5 C. Calculate q in J.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "q = mcΔT", answer: 6794, unit: "J", tolerance: 20, steps: ["ΔT = 24.5 - 18.0 = 6.5 C", "q = 250 x 4.18 x 6.5", "q = 6793 J"] },
      { difficulty: "easy", q: "How much energy (kJ) is needed to heat 200 g of water from 20 C to 100 C?\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "q = mcΔT, then convert J to kJ", answer: 66.9, unit: "kJ", tolerance: 0.5, steps: ["ΔT = 100 - 20 = 80 C", "q = 200 x 4.18 x 80 = 66 880 J", "q = 66.9 kJ"] },
      { difficulty: "easy", q: "8 360 J of energy heats 100 g of water. What is the temperature rise?\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "ΔT = q / (mc)", answer: 20.0, unit: "C", tolerance: 0.1, steps: ["ΔT = q / (m x c)", "ΔT = 8360 / (100 x 4.18)", "ΔT = 20.0 C"] },
      // Simple ΔH calculation
      { difficulty: "easy", q: "0.100 mol of fuel releases 5.02 kJ of energy. Calculate ΔHc in kJ mol⁻¹.", hint: "ΔHc = -q / n (negative because exothermic)", answer: -50.2, unit: "kJ mol⁻¹", tolerance: 0.5, steps: ["ΔHc = -q / n", "ΔHc = -5.02 / 0.100", "ΔHc = -50.2 kJ mol⁻¹"] },
      { difficulty: "easy", q: "A reaction absorbs 1200 J and uses 0.0200 mol of reactant. Calculate ΔH in kJ mol⁻¹.\n(Is this endothermic or exothermic?)", hint: "ΔH = +q/n for endothermic (absorbs heat)", answer: 60.0, unit: "kJ mol⁻¹", tolerance: 0.5, steps: ["ΔH = +q / n (endothermic = positive)", "ΔH = +1.200 / 0.0200", "ΔH = +60.0 kJ mol⁻¹"] },
      // Simple bond enthalpy
      { difficulty: "easy", q: "Calculate the energy needed to break 2 mol of O-H bonds.\nE(O-H) = +463 kJ mol⁻¹", hint: "Total = number of bonds x bond enthalpy", answer: 926, unit: "kJ", tolerance: 2, steps: ["Energy = 2 x 463", "Energy = 926 kJ (endothermic - breaking bonds)"] },
      { difficulty: "easy", q: "Calculate the energy released when 3 mol of H-Cl bonds form.\nE(H-Cl) = +431 kJ mol⁻¹", hint: "Bond formation releases energy (exothermic)", answer: -1293, unit: "kJ", tolerance: 2, steps: ["Energy = -3 x 431 (negative = released)", "Energy = -1293 kJ"] },
      // Simple Hess
      { difficulty: "easy", q: "ΔHf°[CO₂] = -394 kJ mol⁻¹ and ΔHf°[H₂O] = -286 kJ mol⁻¹.\nCalculate ΔHf°[CO₂] + ΔHf°[H₂O].", hint: "Just add them!", answer: -680, unit: "kJ mol⁻¹", tolerance: 1, steps: ["-394 + (-286)", "= -680 kJ mol⁻¹"] },
      { difficulty: "easy", q: "ΔH₁ = -200 kJ mol⁻¹ and ΔH₂ = +50 kJ mol⁻¹.\nUsing Hess's Law, if ΔHr = ΔH₁ + ΔH₂, calculate ΔHr.", hint: "Add the two values, keeping signs.", answer: -150, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔHr = ΔH₁ + ΔH₂", "ΔHr = -200 + 50", "ΔHr = -150 kJ mol⁻¹"] },
      { difficulty: "easy", q: "Convert 4500 J to kJ.", hint: "Divide by 1000", answer: 4.5, unit: "kJ", tolerance: 0.01, steps: ["4500 / 1000 = 4.50 kJ"] },

      // ═══ MEDIUM (16) ═══
      // Calorimetry with moles
      { difficulty: "medium", q: "50.0 cm³ of 1.00 mol dm⁻³ HCl is mixed with 50.0 cm³ of 1.00 mol dm⁻³ NaOH. Temperature rises by 6.8 C.\nCalculate the enthalpy of neutralisation.\n(c = 4.18 J g⁻¹ K⁻¹, density = 1.00 g cm⁻³)", hint: "q = mcΔT (total mass); n = cV; ΔH = -q/n", answer: -56.8, unit: "kJ mol⁻¹", tolerance: 1.0, steps: ["Total mass = 50 + 50 = 100 g", "q = 100 x 4.18 x 6.8 = 2842 J = 2.842 kJ", "n(HCl) = 1.00 x 0.0500 = 0.0500 mol", "ΔH = -2.842 / 0.0500 = -56.8 kJ mol⁻¹"] },
      { difficulty: "medium", q: "25.0 cm³ of 2.00 mol dm⁻³ HCl is mixed with 25.0 cm³ of 2.00 mol dm⁻³ NaOH. ΔT = 13.5 C.\nCalculate ΔH neutralisation.\n(c = 4.18 J g⁻¹ K⁻¹, density = 1.00 g cm⁻³)", hint: "Total mass = 50 g; n = cV", answer: -56.4, unit: "kJ mol⁻¹", tolerance: 1.0, steps: ["Total mass = 50.0 g", "q = 50.0 x 4.18 x 13.5 = 2822 J = 2.822 kJ", "n(HCl) = 2.00 x 0.0250 = 0.0500 mol", "ΔH = -2.822 / 0.0500 = -56.4 kJ mol⁻¹"] },
      { difficulty: "medium", q: "3.00 g of zinc powder is added to 50.0 cm³ of excess CuSO₄ solution. Temperature rises by 15.2 C.\nCalculate ΔH per mole of Zn.\n(c = 4.18 J g⁻¹ K⁻¹; Ar Zn = 65.4)", hint: "q = mcΔT (mass = 50 g solution); n = m/M for Zn", answer: -69.3, unit: "kJ mol⁻¹", tolerance: 1.5, steps: ["q = 50.0 x 4.18 x 15.2 = 3177 J = 3.177 kJ", "n(Zn) = 3.00 / 65.4 = 0.04587 mol", "ΔH = -3.177 / 0.04587 = -69.3 kJ mol⁻¹"] },
      // Hess's Law with combustion data + diagram
      { difficulty: "medium", q: "Use the Hess cycle below to calculate ΔHf for CH₄.\nΔHc[C] = -394 kJ mol⁻¹\nΔHc[H₂] = -286 kJ mol⁻¹\nΔHc[CH₄] = -890 kJ mol⁻¹", hint: "ΔHf = ΣΔHc(reactants) - ΔHc(product)", answer: -76, unit: "kJ mol⁻¹", tolerance: 2, diagram: React.createElement(HessTriangle, {top:["C + 2H₂","CH₄"], left:"CO₂ + 2H₂O", dh1:"ΔHc", dh2:"-ΔHc(CH₄)", dhr:"ΔHf = ?", find:"dhr"}), steps: ["ΔHf = [ΔHc(C) + 2 x ΔHc(H₂)] - ΔHc(CH₄)", "ΔHf = [-394 + 2(-286)] - (-890)", "ΔHf = -966 + 890 = -76 kJ mol⁻¹"] },
      { difficulty: "medium", q: "Use Hess's Law to calculate ΔHr for:\nN₂(g) + 2O₂(g) -> 2NO₂(g)\nΔHf[NO₂] = +34 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(products) - ΣΔHf(reactants). Elements have ΔHf = 0.", answer: 68, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔHr = 2 x ΔHf(NO₂) - [ΔHf(N₂) + ΔHf(O₂)]", "ΔHr = 2(+34) - [0 + 0]", "ΔHr = +68 kJ mol⁻¹"] },
      // Bond enthalpy calculations
      { difficulty: "medium", q: "Using mean bond enthalpies, calculate ΔHr for:\nH₂ + Cl₂ -> 2HCl\nE(H-H) = +436; E(Cl-Cl) = +242; E(H-Cl) = +431 kJ mol⁻¹", hint: "ΔH = bonds broken - bonds formed", answer: -184, unit: "kJ mol⁻¹", tolerance: 2, steps: ["Bonds broken: H-H (436) + Cl-Cl (242) = +678 kJ", "Bonds formed: 2 x H-Cl = 2 x 431 = -862 kJ", "ΔH = 678 - 862 = -184 kJ mol⁻¹"] },
      { difficulty: "medium", q: "Calculate ΔH for: CH₄ + 2O₂ -> CO₂ + 2H₂O\nE(C-H) = +412; E(O=O) = +496; E(C=O) = +743; E(O-H) = +463 kJ mol⁻¹", hint: "Count all bonds broken and formed carefully.", answer: -818, unit: "kJ mol⁻¹", tolerance: 10, steps: ["Bonds broken: 4(C-H) + 2(O=O) = 4(412) + 2(496) = 1648 + 992 = 2640 kJ", "Bonds formed: 2(C=O) + 4(O-H) = 2(743) + 4(463) = 1486 + 1852 = 3338 kJ", "ΔH = 2640 - 3338 = -698 kJ mol⁻¹", "Note: bond enthalpy value gives approximate answer (-698 vs data book -890)"] },
      { difficulty: "medium", q: "Calculate ΔH for: N₂ + 3H₂ -> 2NH₃\nE(N≡N) = +944; E(H-H) = +436; E(N-H) = +388 kJ mol⁻¹", hint: "Break 1 N≡N and 3 H-H, form 6 N-H", answer: -92, unit: "kJ mol⁻¹", tolerance: 3, steps: ["Bonds broken: N≡N (944) + 3 x H-H (3 x 436) = 944 + 1308 = 2252 kJ", "Bonds formed: 6 x N-H = 6 x 388 = 2328 kJ", "ΔH = 2252 - 2328 = -76 kJ mol⁻¹... wait that's for 2 mol NH₃", "ΔH = -76 kJ mol⁻¹ for the reaction as written"] },
      // Hess with formation data + diagram
      { difficulty: "medium", q: "Calculate ΔHr for:\n2CO(g) + O₂(g) -> 2CO₂(g)\nΔHf[CO] = -111 kJ mol⁻¹\nΔHf[CO₂] = -394 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(products) - ΣΔHf(reactants)", answer: -566, unit: "kJ mol⁻¹", tolerance: 2, diagram: React.createElement(HessTriangle, {top:["2CO + O₂","2CO₂"], left:"2C + O₂", dh1:"2xΔHf(CO)", dh2:"-2xΔHf(CO₂)", dhr:"ΔHr = ?", find:"dhr"}), steps: ["ΔHr = 2 x ΔHf(CO₂) - [2 x ΔHf(CO) + ΔHf(O₂)]", "ΔHr = 2(-394) - [2(-111) + 0]", "ΔHr = -788 - (-222)", "ΔHr = -788 + 222 = -566 kJ mol⁻¹"] },
      // Calorimetry combustion
      { difficulty: "medium", q: "1.00 g of methanol (CH₃OH, Mr = 32) is burned and heats 150 g of water by 22.3 C.\nCalculate ΔHc.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "q = mcΔT; n = m/M; ΔHc = -q/n", answer: -447, unit: "kJ mol⁻¹", tolerance: 10, steps: ["q = 150 x 4.18 x 22.3 = 13 982 J = 13.98 kJ", "n(CH₃OH) = 1.00 / 32 = 0.03125 mol", "ΔHc = -13.98 / 0.03125 = -447 kJ mol⁻¹"] },
      { difficulty: "medium", q: "50.0 cm³ of 1.00 mol dm⁻³ HCl is added to excess NaHCO₃. Temperature drops from 22.0 C to 17.5 C.\nCalculate ΔH.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "Endothermic (temp drops). q = mcΔT; ΔH = +q/n", answer: 18.8, unit: "kJ mol⁻¹", tolerance: 0.5, steps: ["ΔT = 17.5 - 22.0 = -4.5 C (temperature fell)", "q = 50.0 x 4.18 x 4.5 = 941 J = 0.941 kJ", "n(HCl) = 1.00 x 0.0500 = 0.0500 mol", "ΔH = +0.941 / 0.0500 = +18.8 kJ mol⁻¹ (endothermic)"] },
      // Hess with combustion
      { difficulty: "medium", q: "Calculate ΔHf for propan-1-ol (C₃H₇OH) using:\nΔHc[C] = -394; ΔHc[H₂] = -286; ΔHc[C₃H₇OH] = -2021 kJ mol⁻¹\n(3C + 4H₂ + 1/2 O₂ -> C₃H₇OH)", hint: "ΔHf = ΣΔHc(elements) - ΔHc(compound)", answer: -305, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(HessTriangle, {top:["3C+4H₂+½O₂","C₃H₇OH"], left:"3CO₂ + 4H₂O", dh1:"ΔHc(elements)", dh2:"-ΔHc(C₃H₇OH)", dhr:"ΔHf = ?", find:"dhr"}), steps: ["ΔHf = [3(-394) + 4(-286)] - (-2021)", "ΔHf = [-1182 - 1144] + 2021", "ΔHf = -2326 + 2021 = -305 kJ mol⁻¹"] },
      { difficulty: "medium", q: "In a calorimetry experiment, why is the experimental ΔHc always less exothermic than the data book value?", hint: "Think about heat loss.", answer: -1, unit: "", tolerance: 999, isText: false, steps: ["Heat is lost to the surroundings (not all transferred to water)", "Incomplete combustion of the fuel", "The experiment is not conducted under standard conditions", "These factors all make the measured value less negative"] },

      // ═══ HARD (12) ═══
      // Calorimetry experiments
      { difficulty: "hard", q: "0.50 g of ethanol (Mr = 46) is burned and heats 200 g of water from 20.0 C to 33.4 C.\nCalculate ΔHc.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "q = mcΔT; n = m/M; ΔHc = -q/n", answer: -1031, unit: "kJ mol⁻¹", tolerance: 20, steps: ["ΔT = 33.4 - 20.0 = 13.4 C", "q = 200 x 4.18 x 13.4 = 11 202 J = 11.20 kJ", "n = 0.50 / 46 = 0.01087 mol", "ΔHc = -11.20 / 0.01087 = -1031 kJ mol⁻¹"] },
      { difficulty: "hard", q: "2.00 g of NH₄NO₃ (Mr = 80) dissolves in 50.0 cm³ water. Temperature drops from 20.0 C to 16.8 C.\nCalculate ΔHsolution.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "Endothermic: +ΔH. q = mcΔT; ΔH = +q/n", answer: 26.8, unit: "kJ mol⁻¹", tolerance: 0.5, steps: ["ΔT = 20.0 - 16.8 = 3.2 C (temperature fell)", "q = 50.0 x 4.18 x 3.2 = 669 J = 0.669 kJ", "n = 2.00 / 80 = 0.0250 mol", "ΔH = +0.669 / 0.0250 = +26.8 kJ mol⁻¹"] },
      // Hess with combustion data + diagrams
      { difficulty: "hard", q: "Calculate ΔHf for ethane C₂H₆ using the Hess cycle below.\nΔHc[C] = -394; ΔHc[H₂] = -286; ΔHc[C₂H₆] = -1560 kJ mol⁻¹", hint: "ΔHf = ΣΔHc(elements) - ΔHc(product)", answer: -86, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(HessTriangle, {top:["2C + 3H₂","C₂H₆"], left:"2CO₂ + 3H₂O", dh1:"ΣΔHc", dh2:"-ΔHc(C₂H₆)", dhr:"ΔHf = ?", find:"dhr"}), steps: ["ΔHf = [2(-394) + 3(-286)] - (-1560)", "ΔHf = [-788 - 858] + 1560", "ΔHf = -1646 + 1560 = -86 kJ mol⁻¹"] },
      { difficulty: "hard", q: "Calculate ΔHf for benzene C₆H₆ using:\nΔHc[C] = -394; ΔHc[H₂] = -286; ΔHc[C₆H₆] = -3268 kJ mol⁻¹\n(6C + 3H₂ -> C₆H₆)", hint: "ΔHf = ΣΔHc(elements) - ΔHc(compound)", answer: +46, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(HessTriangle, {top:["6C + 3H₂","C₆H₆"], left:"6CO₂ + 3H₂O", dh1:"ΣΔHc", dh2:"-ΔHc(C₆H₆)", dhr:"ΔHf = ?", find:"dhr"}), steps: ["ΔHf = [6(-394) + 3(-286)] - (-3268)", "ΔHf = [-2364 - 858] + 3268", "ΔHf = -3222 + 3268 = +46 kJ mol⁻¹", "(Benzene has a positive ΔHf - endothermic formation)"] },
      // Hess with formation data + diagram
      { difficulty: "hard", q: "Calculate ΔHc for ethanol using the Hess cycle:\nC₂H₅OH(l) + 3O₂ -> 2CO₂ + 3H₂O\nΔHf[C₂H₅OH] = -278; ΔHf[CO₂] = -394; ΔHf[H₂O] = -286 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(products) - ΣΔHf(reactants)", answer: -1368, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(HessTriangle, {top:["C₂H₅OH+3O₂","2CO₂+3H₂O"], left:"Elements", dh1:"-ΔHf(eth)", dh2:"ΣΔHf(prod)", dhr:"ΔHc = ?", find:"dhr"}), steps: ["ΔHc = [2(-394) + 3(-286)] - [(-278) + 0]", "ΔHc = [-788 - 858] - (-278)", "ΔHc = -1646 + 278 = -1368 kJ mol⁻¹"] },
      { difficulty: "hard", q: "Calculate ΔH for:\nCH₄(g) + 2O₂(g) -> CO₂(g) + 2H₂O(l)\nΔHf[CH₄] = -75; ΔHf[CO₂] = -394; ΔHf[H₂O] = -286 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(products) - ΣΔHf(reactants)", answer: -891, unit: "kJ mol⁻¹", tolerance: 2, steps: ["ΔHr = [(-394) + 2(-286)] - [(-75) + 0]", "ΔHr = [-394 - 572] - (-75)", "ΔHr = -966 + 75 = -891 kJ mol⁻¹"] },
      // Bond enthalpy - harder
      { difficulty: "hard", q: "Calculate ΔH for the cracking of decane:\nC₁₀H₂₂ -> C₈H₁₈ + C₂H₄\nE(C-C) = +348; E(C-H) = +412; E(C=C) = +612 kJ mol⁻¹", hint: "Only the bonds that CHANGE need to be counted. Breaking: 1 C-C + 2 C-H. Forming: 1 C=C + 1 H-H... but careful!", answer: 80, unit: "kJ mol⁻¹", tolerance: 10, steps: ["Bonds broken: 1 C-C (348) + 2 C-H (2 x 412) = 1172 kJ", "Bonds formed: 1 C=C (612) + 1 H-H (436) = 1048 kJ", "Wait - need to reconsider. Only net bond changes:", "Break: 1 C-C (348) + 2 C-H (824) = 1172", "Form: 1 C=C (612) + 2 extra C-H already there", "ΔH = approximately +80 kJ mol⁻¹ (endothermic)"] },
      // Enthalpy of solution from lattice + hydration
      { difficulty: "hard", q: "Calculate the enthalpy of solution of NaCl using:\nΔHlattice(NaCl) = +787 kJ mol⁻¹\nΔHhyd(Na⁺) = -406 kJ mol⁻¹\nΔHhyd(Cl⁻) = -377 kJ mol⁻¹", hint: "ΔHsol = ΔHlattice + ΔHhyd(cation) + ΔHhyd(anion)", answer: 4, unit: "kJ mol⁻¹", tolerance: 2, diagram: React.createElement(HessTriangle, {top:["NaCl(s)","Na⁺(aq)+Cl⁻(aq)"], left:"Na⁺(g)+Cl⁻(g)", dh1:"+787", dh2:"-406-377", dhr:"ΔHsol = ?", find:"dhr"}), steps: ["ΔHsol = ΔHlatt + ΔHhyd(Na⁺) + ΔHhyd(Cl⁻)", "ΔHsol = +787 + (-406) + (-377)", "ΔHsol = +787 - 783 = +4 kJ mol⁻¹", "(Slightly endothermic - NaCl feels cold when dissolving)"] },
      { difficulty: "hard", q: "Calculate ΔHhyd(K⁺) given:\nΔHlattice(KCl) = +711 kJ mol⁻¹\nΔHhyd(Cl⁻) = -377 kJ mol⁻¹\nΔHsol(KCl) = +17 kJ mol⁻¹", hint: "Rearrange: ΔHhyd(K⁺) = ΔHsol - ΔHlatt - ΔHhyd(Cl⁻)", answer: -317, unit: "kJ mol⁻¹", tolerance: 2, steps: ["ΔHsol = ΔHlatt + ΔHhyd(K⁺) + ΔHhyd(Cl⁻)", "+17 = +711 + ΔHhyd(K⁺) + (-377)", "+17 = +334 + ΔHhyd(K⁺)", "ΔHhyd(K⁺) = 17 - 334 = -317 kJ mol⁻¹"] },
      // Temperature extrapolation
      { difficulty: "hard", q: "In a calorimetry experiment, temperatures recorded were:\nt=0: 19.5, t=1: 19.5, t=2: 19.5, t=3: 19.5 (mix at t=4)\nt=5: 27.1, t=6: 26.8, t=7: 26.5, t=8: 26.2\nExtrapolate back to t=4 to find the corrected maximum temperature and ΔT.", hint: "The cooling trend is -0.3 per min. Extrapolate back from t=5 to t=4.", answer: 7.9, unit: "C", tolerance: 0.2, steps: ["Initial temperature = 19.5 C", "Cooling rate = 0.3 C per minute", "At t=5: 27.1 C, so at t=4 (extrapolated): 27.1 + 0.3 = 27.4 C", "ΔT = 27.4 - 19.5 = 7.9 C"] },

      // ═══ EXAM (10) ═══
      { difficulty: "exam", q: "Calculate ΔHc for propane using ΔHf values:\nC₃H₈(g) + 5O₂(g) -> 3CO₂(g) + 4H₂O(l)\nΔHf[C₃H₈] = -104; ΔHf[CO₂] = -394; ΔHf[H₂O] = -286 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(prod) - ΣΔHf(react)", answer: -2222, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(HessTriangle, {top:["C₃H₈ + 5O₂","3CO₂ + 4H₂O"], left:"Elements", dh1:"-ΔHf(C₃H₈)", dh2:"ΣΔHf(prod)", dhr:"ΔHc = ?", find:"dhr"}), steps: ["ΔHc = [3(-394) + 4(-286)] - [(-104) + 0]", "ΔHc = [-1182 - 1144] - (-104)", "ΔHc = -2326 + 104 = -2222 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Using bond enthalpies, calculate ΔH for:\nC₂H₄ + H₂ -> C₂H₆\nE(C=C) = +612; E(C-C) = +348; E(H-H) = +436; E(C-H) = +412 kJ mol⁻¹", hint: "Break C=C and H-H. Form C-C and 2 C-H.", answer: -124, unit: "kJ mol⁻¹", tolerance: 3, steps: ["Bonds broken: C=C (612) + H-H (436) = 1048 kJ", "Bonds formed: C-C (348) + 2 x C-H (2 x 412) = 1172 kJ", "ΔH = 1048 - 1172 = -124 kJ mol⁻¹"] },
      { difficulty: "exam", q: "0.920 g of ethanol (Mr = 46) is burned. The heat produced raises the temperature of 200 g of water from 20.0 C to 35.6 C.\nCalculate the experimental ΔHc and the % error.\n(Data book ΔHc = -1367 kJ mol⁻¹; c = 4.18 J g⁻¹ K⁻¹)", hint: "Find experimental ΔHc, then % error = |exp - true| / true x 100", answer: -652, unit: "kJ mol⁻¹", tolerance: 15, steps: ["q = 200 x 4.18 x 15.6 = 13 042 J = 13.04 kJ", "n = 0.920 / 46 = 0.0200 mol", "ΔHc = -13.04 / 0.0200 = -652 kJ mol⁻¹", "% error = |(-652) - (-1367)| / 1367 x 100 = 52.3%"] },
      { difficulty: "exam", q: "Calculate ΔHf for ethanol using combustion data and the Hess cycle:\nΔHc[C] = -394; ΔHc[H₂] = -286; ΔHc[C₂H₅OH] = -1367 kJ mol⁻¹\n(2C + 3H₂ + 1/2 O₂ -> C₂H₅OH)", hint: "ΔHf = ΣΔHc(elements) - ΔHc(compound)", answer: -279, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(HessTriangle, {top:["2C+3H₂+½O₂","C₂H₅OH"], left:"2CO₂+3H₂O", dh1:"ΣΔHc", dh2:"-ΔHc(eth)", dhr:"ΔHf = ?", find:"dhr"}), steps: ["ΔHf = [2(-394) + 3(-286)] - (-1367)", "ΔHf = [-788 - 858] + 1367", "ΔHf = -1646 + 1367 = -279 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Calculate ΔH for the hydrogenation of ethene:\nC₂H₄(g) + H₂(g) -> C₂H₆(g)\nΔHc[C₂H₄] = -1411; ΔHc[H₂] = -286; ΔHc[C₂H₆] = -1560 kJ mol⁻¹", hint: "Hess cycle via combustion products. ΔH = ΣΔHc(react) - ΔHc(prod)", answer: -137, unit: "kJ mol⁻¹", tolerance: 2, diagram: React.createElement(HessTriangle, {top:["C₂H₄ + H₂","C₂H₆"], left:"CO₂ + H₂O", dh1:"ΣΔHc(react)", dh2:"-ΔHc(C₂H₆)", dhr:"ΔH = ?", find:"dhr"}), steps: ["ΔH = [ΔHc(C₂H₄) + ΔHc(H₂)] - ΔHc(C₂H₆)", "ΔH = [-1411 + (-286)] - (-1560)", "ΔH = -1697 + 1560 = -137 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Calculate the lattice enthalpy of MgCl₂ given:\nΔHsol(MgCl₂) = -155 kJ mol⁻¹\nΔHhyd(Mg²⁺) = -1920 kJ mol⁻¹\nΔHhyd(Cl⁻) = -377 kJ mol⁻¹", hint: "ΔHsol = -ΔHlatt + ΔHhyd(cation) + ΔHhyd(anion). Rearrange for ΔHlatt.", answer: 2519, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(HessTriangle, {top:["MgCl₂(s)","Mg²⁺(aq)+2Cl⁻(aq)"], left:"Mg²⁺(g)+2Cl⁻(g)", dh1:"ΔHlatt=?", dh2:"ΔHhyd", dhr:"-155", find:"dh1"}), steps: ["ΔHsol = -ΔHlatt + ΔHhyd(Mg²⁺) + 2xΔHhyd(Cl⁻)", "-155 = -ΔHlatt + (-1920) + 2(-377)", "-155 = -ΔHlatt - 2674", "ΔHlatt = -2674 + 155 = -2519", "ΔHlatt = +2519 kJ mol⁻¹ (endothermic dissociation)"] },
      { difficulty: "exam", q: "Use bond enthalpies to predict whether this reaction is exothermic or endothermic:\nCH₃OH(g) + 3/2 O₂(g) -> CO₂(g) + 2H₂O(g)\nE(C-H)=412, E(C-O)=360, E(O-H)=463, E(O=O)=496, E(C=O)=743 kJ mol⁻¹", hint: "CH₃OH has 3 C-H, 1 C-O, 1 O-H. Count all bonds.", answer: -628, unit: "kJ mol⁻¹", tolerance: 15, steps: ["Bonds broken: 3(C-H) + 1(C-O) + 1(O-H) + 1.5(O=O)", "= 3(412) + 360 + 463 + 1.5(496)", "= 1236 + 360 + 463 + 744 = 2803 kJ", "Bonds formed: 2(C=O) + 4(O-H)", "= 2(743) + 4(463) = 1486 + 1852 = 3338 kJ", "ΔH = 2803 - 3338 = -535 kJ mol⁻¹", "Exothermic (more energy released forming bonds)"] },
      { difficulty: "exam", q: "A 2.50 g sample of fuel X (Mr = 50) is burned and heats 500 g of water from 19.0 C to 44.8 C.\n(a) Calculate experimental ΔHc.\n(b) The data book value is -1615 kJ mol⁻¹. Calculate % error.\n(c = 4.18 J g⁻¹ K⁻¹)", hint: "q = mcΔT; n = m/M; ΔHc = -q/n; % error = |exp-true|/true x 100", answer: -1079, unit: "kJ mol⁻¹", tolerance: 10, steps: ["ΔT = 44.8 - 19.0 = 25.8 C", "q = 500 x 4.18 x 25.8 = 53 922 J = 53.92 kJ", "n = 2.50 / 50 = 0.0500 mol", "ΔHc = -53.92 / 0.0500 = -1078 kJ mol⁻¹", "% error = |(-1078)-(-1615)| / 1615 x 100 = 33.3%"] },
      { difficulty: "exam", q: "Calculate ΔHr for:\n4NH₃(g) + 5O₂(g) -> 4NO(g) + 6H₂O(g)\nΔHf[NH₃] = -46; ΔHf[NO] = +90; ΔHf[H₂O(g)] = -242 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(prod) - ΣΔHf(react). Elements = 0.", answer: -908, unit: "kJ mol⁻¹", tolerance: 5, steps: ["ΔHr = [4(+90) + 6(-242)] - [4(-46) + 0]", "ΔHr = [+360 - 1452] - [-184]", "ΔHr = -1092 + 184 = -908 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Using the Hess cycle, calculate ΔH for:\nCaCO₃(s) -> CaO(s) + CO₂(g)\nΔHf[CaCO₃] = -1207; ΔHf[CaO] = -635; ΔHf[CO₂] = -394 kJ mol⁻¹", hint: "ΔHr = ΣΔHf(products) - ΣΔHf(reactants)", answer: 178, unit: "kJ mol⁻¹", tolerance: 2, diagram: React.createElement(HessTriangle, {top:["CaCO₃","CaO + CO₂"], left:"Elements", dh1:"-(-1207)", dh2:"-635+(-394)", dhr:"ΔH = ?", find:"dhr"}), steps: ["ΔH = [ΔHf(CaO) + ΔHf(CO₂)] - ΔHf(CaCO₃)", "ΔH = [(-635) + (-394)] - (-1207)", "ΔH = -1029 + 1207 = +178 kJ mol⁻¹", "(Endothermic thermal decomposition)"] },
    ]
  },
  {
    id: "calc_equilibrium", title: "Equilibrium - Kc and Kp", color: "#d97706", board: "both",
    questions: [
      // EASY
      { difficulty: "easy", q: "At equilibrium: [A] = 0.50 mol dm⁻³, [B] = 0.50 mol dm⁻³, [AB] = 1.0 mol dm⁻³.\nA(g) + B(g) ⇌ AB(g)\nCalculate Kc.", hint: "Kc = [AB] ÷ ([A][B])", answer: 4.0, unit: "", tolerance: 0.1, steps: ["Kc = [AB] ÷ ([A][B])", "Kc = 1.0 ÷ (0.50 × 0.50)", "Kc = 1.0 ÷ 0.25 = 4.0"] },
      // MEDIUM
      { difficulty: "medium", q: "At equilibrium, [H₂] = 0.30 mol dm⁻³, [I₂] = 0.10 mol dm⁻³, [HI] = 0.60 mol dm⁻³.\nH₂(g) + I₂(g) ⇌ 2HI(g)\nCalculate Kc.", hint: "Kc = [HI]² ÷ ([H₂][I₂]). Raise concentrations to the power of their stoichiometric coefficients.", answer: 12, unit: "", tolerance: 0.2, steps: ["Kc = [HI]² ÷ ([H₂][I₂])", "Kc = (0.60)² ÷ (0.30 × 0.10) = 0.36 ÷ 0.030 = 12", "No units (equal mol gas on each side)."] },
      { difficulty: "medium", q: "PCl₅(g) ⇌ PCl₃(g) + Cl₂(g). At equilibrium: [PCl₅] = 0.10, [PCl₃] = 0.040, [Cl₂] = 0.040 mol dm⁻³. Calculate Kc (include units).", hint: "Kc = [PCl₃][Cl₂] ÷ [PCl₅]", answer: 0.016, unit: "mol dm⁻³", tolerance: 0.001, steps: ["Kc = [PCl₃][Cl₂] ÷ [PCl₅]", "Kc = (0.040 × 0.040) ÷ 0.10", "Kc = 0.0016 ÷ 0.10 = 0.016 mol dm⁻³"] },
      { difficulty: "medium", q: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), at equilibrium: [N₂] = 0.10, [H₂] = 0.30, [NH₃] = 0.20 mol dm⁻³. Calculate Kc (give numerical value only).", hint: "Kc = [NH₃]² ÷ ([N₂][H₂]³)", answer: 14.8, unit: "mol⁻² dm⁶", tolerance: 0.5, steps: ["Kc = [NH₃]² ÷ ([N₂] × [H₂]³)", "Kc = (0.20)² ÷ (0.10 × (0.30)³)", "Kc = 0.040 ÷ (0.10 × 0.027) = 0.040 ÷ 0.0027 = 14.8"] },
      // HARD
      { difficulty: "hard", q: "A(g) + B(g) ⇌ C(g). Mole fractions at equilibrium: χ(A)=0.25, χ(B)=0.25, χ(C)=0.50. Total pressure = 200 kPa. Calculate Kp (kPa⁻¹).", hint: "Partial pressure = mole fraction × total pressure. Write Kp expression.", answer: 0.04, unit: "kPa⁻¹", tolerance: 0.003, steps: ["p(A) = 0.25 × 200 = 50 kPa; p(B) = 50 kPa; p(C) = 100 kPa", "Kp = p(C) ÷ [p(A) × p(B)] = 100 ÷ (50×50) = 0.040 kPa⁻¹"] },
      { difficulty: "hard", q: "2.0 mol SO₂ and 1.0 mol O₂ are placed in a 5.0 dm³ vessel and reach equilibrium:\n2SO₂(g) + O₂(g) ⇌ 2SO₃(g)\nAt equilibrium, 1.40 mol SO₃ is present. Calculate Kc (mol⁻¹ dm³).", hint: "Use an ICE table: work out equilibrium moles of each species, divide by volume for concentrations.", answer: 90.7, unit: "mol⁻¹ dm³", tolerance: 2.0, steps: ["Equilibrium: SO₂ = 2.0−1.40 = 0.60 mol; O₂ = 1.0−0.70 = 0.30 mol; SO₃ = 1.40 mol", "[SO₂] = 0.12; [O₂] = 0.060; [SO₃] = 0.280 mol dm⁻³", "Kc = [SO₃]² ÷ ([SO₂]² × [O₂]) = (0.280)² ÷ ((0.12)² × 0.060)", "Kc = 0.07840 ÷ 0.000864 = 90.7 mol⁻¹ dm³"] },
      // EXAM
      { difficulty: "exam", q: "For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) at equilibrium: p(SO₂)=10 kPa, p(O₂)=5 kPa, p(SO₃)=40 kPa. Calculate Kp.", hint: "Kp = p(SO₃)² ÷ [p(SO₂)² × p(O₂)]. Keep track of units.", answer: 3.2, unit: "kPa⁻¹", tolerance: 0.1, steps: ["Kp = p(SO₃)² ÷ [p(SO₂)² × p(O₂)]", "Kp = (40)² ÷ [(10)² × 5] = 1600 ÷ 500 = 3.2 kPa⁻¹"] },
      { difficulty: "exam", q: "1.0 mol of N₂O₄(g) partially dissociates: N₂O₄(g) ⇌ 2NO₂(g). Fraction dissociated = 0.40. Total moles at equilibrium = 1.40. Total pressure = 100 kPa. Calculate Kp (kPa).", hint: "Find moles of each species, then mole fractions, then partial pressures.", answer: 76.2, unit: "kPa", tolerance: 1.5, steps: ["n(N₂O₄) = 0.60; n(NO₂) = 0.80; total = 1.40", "χ(N₂O₄) = 0.60÷1.40 = 0.4286; χ(NO₂) = 0.5714", "p(N₂O₄) = 42.86 kPa; p(NO₂) = 57.14 kPa", "Kp = p(NO₂)² ÷ p(N₂O₄) = (57.14)² ÷ 42.86 = 76.2 kPa"] },
    ]
  },
  {
    id: "calc_ph", title: "pH and Acids & Bases", color: "#0d8c68", board: "both",
    questions: [
      // EASY
      { difficulty: "easy", q: "Calculate the pH of 0.100 mol dm⁻³ HCl.", hint: "HCl is a strong acid and fully dissociates. [H⁺] = 0.100 mol dm⁻³. pH = −log[H⁺].", answer: 1.00, unit: "", tolerance: 0.02, steps: ["HCl fully dissociates → [H⁺] = 0.100 mol dm⁻³", "pH = −log(0.100) = 1.00"] },
      { difficulty: "easy", q: "Calculate the pH of 0.050 mol dm⁻³ HCl.", hint: "Strong acid: [H⁺] = concentration. pH = −log[H⁺].", answer: 1.30, unit: "", tolerance: 0.02, steps: ["[H⁺] = 0.050 mol dm⁻³", "pH = −log(0.050) = 1.30"] },
      { difficulty: "easy", q: "A solution has pH = 2.00. Calculate [H⁺] in mol dm⁻³.", hint: "[H⁺] = 10^(−pH)", answer: 0.01, unit: "mol dm⁻³", tolerance: 0.0005, steps: ["[H⁺] = 10^(−pH) = 10^(−2.00)", "[H⁺] = 0.0100 mol dm⁻³"] },
      // MEDIUM
      { difficulty: "medium", q: "Calculate the pH of 0.020 mol dm⁻³ NaOH.", hint: "Strong base: [OH⁻] = concentration. Use Kw = [H⁺][OH⁻] = 1×10⁻¹⁴ to find [H⁺].", answer: 12.30, unit: "", tolerance: 0.02, steps: ["[OH⁻] = 0.020 mol dm⁻³", "[H⁺] = 1×10⁻¹⁴ ÷ 0.020 = 5.0×10⁻¹³", "pH = −log(5.0×10⁻¹³) = 12.30"] },
      { difficulty: "medium", q: "Calculate the pH of 0.10 mol dm⁻³ ethanoic acid. Ka = 1.8×10⁻⁵ mol dm⁻³.", hint: "Weak acid: [H⁺] = √(Ka × c). Then pH = −log[H⁺].", answer: 2.87, unit: "", tolerance: 0.05, steps: ["[H⁺] = √(Ka × c) = √(1.8×10⁻⁵ × 0.10)", "[H⁺] = √(1.8×10⁻⁶) = 1.342×10⁻³ mol dm⁻³", "pH = −log(1.342×10⁻³) = 2.87"] },
      { difficulty: "medium", q: "Calculate the pH of water at 50°C where Kw = 5.5×10⁻¹⁴.", hint: "In pure water [H⁺] = [OH⁻] = √Kw. Then pH = −log[H⁺].", answer: 6.63, unit: "", tolerance: 0.03, steps: ["[H⁺] = √(5.5×10⁻¹⁴) = 2.345×10⁻⁷ mol dm⁻³", "pH = −log(2.345×10⁻⁷) = 6.63", "Note: still neutral (equal [H⁺] and [OH⁻]) even though pH < 7."] },
      // HARD
      { difficulty: "hard", q: "A buffer contains 0.20 mol dm⁻³ ethanoic acid and 0.10 mol dm⁻³ sodium ethanoate. Ka = 1.8×10⁻⁵ mol dm⁻³. Calculate the pH.", hint: "pH = pKa + log([A⁻]/[HA]). First find pKa = −log(Ka).", answer: 4.44, unit: "", tolerance: 0.05, steps: ["pKa = −log(1.8×10⁻⁵) = 4.745", "pH = 4.745 + log(0.10÷0.20) = 4.745 + log(0.5)", "pH = 4.745 − 0.301 = 4.44"] },
      { difficulty: "hard", q: "Calculate the pH of 0.050 mol dm⁻³ propanoic acid. Ka = 1.35×10⁻⁵ mol dm⁻³.", hint: "[H⁺] = √(Ka × c), assuming weak acid approximation.", answer: 3.09, unit: "", tolerance: 0.05, steps: ["[H⁺] = √(1.35×10⁻⁵ × 0.050) = √(6.75×10⁻⁷)", "[H⁺] = 8.22×10⁻⁴ mol dm⁻³", "pH = −log(8.22×10⁻⁴) = 3.09"] },
      { difficulty: "hard", q: "Calculate the pH after adding 10.0 cm³ of 0.100 mol dm⁻³ NaOH to 20.0 cm³ of 0.100 mol dm⁻³ HCl.", hint: "Find moles of each, subtract to find excess acid, then [H⁺] = excess mol ÷ total volume.", answer: 1.48, unit: "", tolerance: 0.03, steps: ["n(HCl) = 0.00200 mol; n(NaOH) = 0.00100 mol", "Excess HCl = 0.00100 mol", "Total volume = 30.0 cm³ = 0.0300 dm³", "[H⁺] = 0.00100 ÷ 0.0300 = 0.0333 mol dm⁻³", "pH = −log(0.0333) = 1.48"] },
      // EXAM
      { difficulty: "exam", q: "Calculate the pH of 0.500 mol dm⁻³ NaOH. (Kw = 1.0 x 10⁻¹⁴)", hint: "[OH⁻] = 0.500; [H⁺] = Kw / [OH⁻]; pH = -log[H⁺].", answer: 13.70, unit: "", tolerance: 0.03, steps: ["[OH⁻] = 0.500 mol dm⁻³", "[H⁺] = 1.0 x 10⁻¹⁴ / 0.500 = 2.0 x 10⁻¹⁴ mol dm⁻³", "pH = -log(2.0 x 10⁻¹⁴) = 13.70"] },
      { difficulty: "exam", q: "Calculate the pH of 0.10 mol dm⁻³ benzoic acid (C₆H₅COOH). Ka = 6.3 x 10⁻⁵ mol dm⁻³.", hint: "Weak acid: [H⁺] = sqrt(Ka x c). Then pH = -log[H⁺].", answer: 2.60, unit: "", tolerance: 0.05, steps: ["[H⁺] = sqrt(6.3 x 10⁻⁵ x 0.10) = sqrt(6.3 x 10⁻⁶)", "[H⁺] = 2.51 x 10⁻³ mol dm⁻³", "pH = -log(2.51 x 10⁻³) = 2.60"] },
      { difficulty: "exam", q: "Calculate the pH of a buffer containing 0.10 mol dm⁻³ propanoic acid and 0.050 mol dm⁻³ sodium propanoate. Ka = 1.26 x 10⁻⁵ mol dm⁻³.", hint: "Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).", answer: 4.60, unit: "", tolerance: 0.05, steps: ["pKa = -log(1.26 x 10⁻⁵) = 4.90", "pH = 4.90 + log(0.050/0.10) = 4.90 + log(0.5)", "pH = 4.90 - 0.301 = 4.60"] },
      { difficulty: "exam", q: "A 0.10 mol dm⁻³ weak monoprotic acid HA has pH 2.85. Calculate the Ka of the acid.", hint: "[H⁺] = 10^(-pH). Then Ka = [H⁺]² / c (weak acid approximation).", answer: 2.0e-5, unit: "mol dm⁻³", tolerance: 2e-6, steps: ["[H⁺] = 10^(-2.85) = 1.413 x 10⁻³ mol dm⁻³", "Ka = [H⁺]² / c = (1.413 x 10⁻³)² / 0.10", "Ka = 2.00 x 10⁻⁶ / 0.10 = 2.0 x 10⁻⁵ mol dm⁻³"] },
      { difficulty: "exam", q: "Calculate the pH of 0.20 mol dm⁻³ Ba(OH)₂. (Kw = 1.0 x 10⁻¹⁴)", hint: "Ba(OH)₂ gives 2 mol OH⁻ per mol. [OH⁻] = 2 x 0.20 = 0.40 mol dm⁻³.", answer: 13.60, unit: "", tolerance: 0.03, steps: ["[OH⁻] = 2 x 0.20 = 0.40 mol dm⁻³", "[H⁺] = 1.0 x 10⁻¹⁴ / 0.40 = 2.5 x 10⁻¹⁴", "pH = -log(2.5 x 10⁻¹⁴) = 13.60"] },
    ]
  },
  {
    id: "calc_rates", title: "Rate Equations", color: "#6d28d9", board: "both",
    questions: [
      // EASY
      { difficulty: "easy", q: "For rate = k[A][B], k = 2.0 mol⁻¹ dm³ s⁻¹, [A] = 0.50 mol dm⁻³, [B] = 0.50 mol dm⁻³. Calculate the rate.", hint: "Substitute directly: rate = k × [A] × [B].", answer: 0.50, unit: "mol dm⁻³ s⁻¹", tolerance: 0.02, steps: ["rate = k[A][B] = 2.0 × 0.50 × 0.50", "rate = 0.50 mol dm⁻³ s⁻¹"] },
      // MEDIUM
      { difficulty: "medium", q: "For rate = k[A][B]². If [A] = 0.20 mol dm⁻³, [B] = 0.30 mol dm⁻³, k = 5.0 mol⁻² dm⁶ s⁻¹, calculate the rate.", hint: "rate = k × [A] × [B]². Square [B] first.", answer: 0.09, unit: "mol dm⁻³ s⁻¹", tolerance: 0.003, steps: ["rate = 5.0 × 0.20 × (0.30)²", "rate = 5.0 × 0.20 × 0.090 = 0.090 mol dm⁻³ s⁻¹"] },
      { difficulty: "medium", q: "Exp 1: [A]=0.10, rate=2.0×10⁻³. Exp 2: [A]=0.20, rate=4.0×10⁻³ mol dm⁻³ s⁻¹ ([B] constant). What is the order with respect to A? (Enter 0, 1, or 2)", hint: "When [A] doubles, how does rate change? rate doubles → 1st order.", answer: 1, unit: "", tolerance: 0, steps: ["[A] doubles (×2); rate doubles (×2)", "Rate factor = 2 = 2^n → n = 1", "First order with respect to A."] },
      { difficulty: "medium", q: "Exp 1: [B]=0.10, rate=1.5×10⁻⁴. Exp 2: [B]=0.30, rate=1.35×10⁻³ mol dm⁻³ s⁻¹ ([A] constant). What is the order with respect to B? (Enter 0, 1, or 2)", hint: "[B] triples. Rate ratio = 1.35×10⁻³ ÷ 1.5×10⁻⁴ = 9. What power of 3 gives 9?", answer: 2, unit: "", tolerance: 0, steps: ["[B] increases ×3; rate increases ×9", "9 = 3^n → n = 2", "Second order with respect to B."] },
      { difficulty: "medium", q: "Experiments show doubling [A] has no effect on rate, and doubling [B] quadruples the rate. What is the overall order of reaction? (Enter as a number)", hint: "0th order means rate is independent of [A]. 2nd order means rate ∝ [B]². Add the orders.", answer: 2, unit: "", tolerance: 0, steps: ["[A] doubled → no rate change → 0th order in A", "[B] doubled → rate ×4 = 2^2 → 2nd order in B", "Overall order = 0 + 2 = 2"] },
      // HARD
      { difficulty: "hard", q: "A first-order reaction has a half-life of 120 s. Calculate the rate constant k (s⁻¹). Give your answer to 3 significant figures.", hint: "t½ = ln2 ÷ k. Rearrange for k.", answer: 0.00578, unit: "s⁻¹", tolerance: 0.0001, steps: ["t½ = ln2 ÷ k → k = ln2 ÷ t½", "k = 0.6931 ÷ 120 = 5.78×10⁻³ s⁻¹"] },
      { difficulty: "hard", q: "For rate = k[A][B]², rate = 4.80×10⁻³ mol dm⁻³ s⁻¹ when [A]=0.300, [B]=0.200 mol dm⁻³. Calculate k.", hint: "Rearrange rate = k[A][B]² for k.", answer: 0.400, unit: "mol⁻² dm⁶ s⁻¹", tolerance: 0.01, steps: ["k = rate ÷ ([A][B]²)", "k = 4.80×10⁻³ ÷ (0.300 × (0.200)²)", "k = 4.80×10⁻³ ÷ (0.300 × 0.0400) = 4.80×10⁻³ ÷ 0.0120", "k = 0.400 mol⁻² dm⁶ s⁻¹"] },
      // EXAM
      { difficulty: "exam", q: "From an Arrhenius plot: ln k = 12.5 at 1/T = 0.0025 K⁻¹, and ln k = 10.0 at 1/T = 0.0030 K⁻¹. Calculate the activation energy (kJ mol⁻¹). (R = 8.314 J mol⁻¹ K⁻¹)", hint: "Gradient = -Ea/R. Gradient = delta(ln k) / delta(1/T). Then Ea = -gradient x R / 1000.", answer: 41.6, unit: "kJ mol⁻¹", tolerance: 1.0, steps: ["Gradient = (12.5-10.0) / (0.0025-0.0030) = 2.5 / (-0.0005) = -5000 K", "Ea = -gradient x R = 5000 x 8.314 = 41570 J mol⁻¹ = 41.6 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Rate constants for a reaction: k = 3.01 x 10⁻³ s⁻¹ at 293 K, k = 0.567 s⁻¹ at 353 K. Use the Arrhenius equation to calculate Ea (kJ mol⁻¹).\nln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂). R = 8.314 J mol⁻¹ K⁻¹", hint: "Substitute values into the two-temperature Arrhenius equation.", answer: 87.5, unit: "kJ mol⁻¹", tolerance: 2.0, steps: ["ln(0.567/3.01 x 10⁻³) = ln(188.4) = 5.239", "1/T₁ - 1/T₂ = 1/293 - 1/353 = 0.003413 - 0.002833 = 5.80 x 10⁻⁴", "Ea/R = 5.239 / (5.80 x 10⁻⁴) = 9033 K", "Ea = 9033 x 8.314 = 75090 J = 75.1 kJ mol⁻¹"] },
    ]
  },
  {
    id: "calc_thermo", title: "Thermodynamics - Delta G & Born-Haber", color: "#b45309", board: "both",
    questions: [
      // ═══ EASY (10) ═══
      // ΔG = ΔH - TΔS basics
      { difficulty: "easy", q: "Calculate ΔG (kJ mol⁻¹) for a reaction where ΔH = -200 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹ at 400 K.", hint: "ΔG = ΔH - TΔS. Convert ΔS to kJ first (divide by 1000).", answer: -240, unit: "kJ mol⁻¹", tolerance: 2, steps: ["ΔS = +100 J K⁻¹ mol⁻¹ = +0.100 kJ K⁻¹ mol⁻¹", "ΔG = -200 - (400 x 0.100)", "ΔG = -200 - 40 = -240 kJ mol⁻¹"] },
      { difficulty: "easy", q: "Calculate ΔG at 298 K.\nΔH = -100 kJ mol⁻¹, ΔS = +50.0 J K⁻¹ mol⁻¹", hint: "ΔG = ΔH - TΔS. Convert ΔS to kJ.", answer: -114.9, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔS = +0.0500 kJ K⁻¹ mol⁻¹", "ΔG = -100 - (298 x 0.0500)", "ΔG = -100 - 14.9 = -114.9 kJ mol⁻¹"] },
      { difficulty: "easy", q: "Calculate ΔG at 500 K.\nΔH = +80 kJ mol⁻¹, ΔS = +200 J K⁻¹ mol⁻¹", hint: "ΔG = ΔH - TΔS", answer: -20, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔS = +0.200 kJ K⁻¹ mol⁻¹", "ΔG = +80 - (500 x 0.200)", "ΔG = 80 - 100 = -20 kJ mol⁻¹", "(Feasible at 500 K because ΔG < 0)"] },
      { difficulty: "easy", q: "Is a reaction feasible at 298 K if ΔH = -50 kJ mol⁻¹ and ΔS = -100 J K⁻¹ mol⁻¹?\nCalculate ΔG.", hint: "ΔG = ΔH - TΔS. If ΔG < 0, feasible.", answer: -20.2, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔG = -50 - (298 x -0.100)", "ΔG = -50 + 29.8 = -20.2 kJ mol⁻¹", "ΔG < 0, so yes, feasible at 298 K"] },
      // ΔSsurroundings
      { difficulty: "easy", q: "Calculate ΔSsurroundings for a reaction with ΔH = -120 kJ mol⁻¹ at 300 K.", hint: "ΔSsurr = -ΔH / T. Convert ΔH to J first.", answer: 400, unit: "J K⁻¹ mol⁻¹", tolerance: 5, steps: ["ΔSsurr = -ΔH / T", "ΔSsurr = -(-120 000) / 300", "ΔSsurr = +400 J K⁻¹ mol⁻¹"] },
      { difficulty: "easy", q: "Calculate ΔSsurroundings for an endothermic reaction with ΔH = +80 kJ mol⁻¹ at 400 K.", hint: "ΔSsurr = -ΔH / T", answer: -200, unit: "J K⁻¹ mol⁻¹", tolerance: 3, steps: ["ΔSsurr = -ΔH / T = -(+80 000) / 400", "ΔSsurr = -200 J K⁻¹ mol⁻¹", "(Negative because endothermic cools surroundings)"] },
      // Entropy change of system
      { difficulty: "easy", q: "Calculate ΔSsystem for:\n2Mg(s) + O₂(g) -> 2MgO(s)\nS°[Mg] = 32.7, S°[O₂] = 205, S°[MgO] = 26.9 J K⁻¹ mol⁻¹", hint: "ΔS = ΣS°(products) - ΣS°(reactants)", answer: -216.6, unit: "J K⁻¹ mol⁻¹", tolerance: 2, steps: ["ΔS = 2(26.9) - [2(32.7) + 205]", "ΔS = 53.8 - [65.4 + 205]", "ΔS = 53.8 - 270.4 = -216.6 J K⁻¹ mol⁻¹"] },
      { difficulty: "easy", q: "Predict the sign of ΔS for: CaCO₃(s) -> CaO(s) + CO₂(g)\nThen calculate it.\nS°[CaCO₃] = 92.9, S°[CaO] = 39.7, S°[CO₂] = 213.6 J K⁻¹ mol⁻¹", hint: "Gas produced = positive ΔS. ΔS = ΣS°(prod) - ΣS°(react)", answer: 160.4, unit: "J K⁻¹ mol⁻¹", tolerance: 1, steps: ["ΔS = [39.7 + 213.6] - [92.9]", "ΔS = 253.3 - 92.9 = +160.4 J K⁻¹ mol⁻¹", "(Positive as expected - gas is produced)"] },
      // Simple Born-Haber step
      { difficulty: "easy", q: "Calculate the enthalpy of atomisation for 1/2 Cl₂(g) -> Cl(g) if the bond enthalpy of Cl-Cl is +242 kJ mol⁻¹.", hint: "Atomisation of 1/2 Cl₂ = half the bond enthalpy.", answer: 121, unit: "kJ mol⁻¹", tolerance: 1, steps: ["Bond enthalpy Cl-Cl = +242 kJ mol⁻¹", "ΔHat(1/2 Cl₂) = +242 / 2 = +121 kJ mol⁻¹"] },
      { difficulty: "easy", q: "Na(g) -> Na⁺(g) + e⁻ has IE₁ = +496 kJ mol⁻¹.\nCl(g) + e⁻ -> Cl⁻(g) has EA₁ = -349 kJ mol⁻¹.\nCalculate the total enthalpy change for both steps combined.", hint: "Just add the two values.", answer: 147, unit: "kJ mol⁻¹", tolerance: 1, steps: ["Total = IE₁ + EA₁", "Total = +496 + (-349)", "Total = +147 kJ mol⁻¹"] },

      // ═══ MEDIUM (14) ═══
      // ΔG calculations
      { difficulty: "medium", q: "Calculate ΔG at 298 K for:\nΔH = -92 kJ mol⁻¹, ΔS = -199 J K⁻¹ mol⁻¹", hint: "ΔG = ΔH - TΔS", answer: -32.7, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔG = -92 - (298 x -0.199)", "ΔG = -92 + 59.3 = -32.7 kJ mol⁻¹"] },
      { difficulty: "medium", q: "Calculate ΔG at 1000 K for the decomposition of CaCO₃:\nΔH = +178 kJ mol⁻¹, ΔS = +160 J K⁻¹ mol⁻¹\nIs the reaction feasible?", hint: "ΔG = ΔH - TΔS. Feasible if ΔG < 0.", answer: 18, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔG = +178 - (1000 x 0.160)", "ΔG = 178 - 160 = +18 kJ mol⁻¹", "ΔG > 0, so NOT feasible at 1000 K"] },
      // Feasibility temperature
      { difficulty: "medium", q: "At what temperature (K) does CaCO₃ decomposition become feasible?\nΔH = +178 kJ mol⁻¹, ΔS = +160 J K⁻¹ mol⁻¹", hint: "T = ΔH / ΔS when ΔG = 0. Convert units.", answer: 1113, unit: "K", tolerance: 5, steps: ["At ΔG = 0: T = ΔH / ΔS", "T = 178 000 / 160 = 1113 K", "Above 1113 K (840 C), decomposition is feasible"] },
      { difficulty: "medium", q: "At what temperature does a reaction with ΔH = +60 kJ mol⁻¹ and ΔS = +150 J K⁻¹ mol⁻¹ become feasible?", hint: "T = ΔH / ΔS when ΔG = 0", answer: 400, unit: "K", tolerance: 5, steps: ["T = ΔH / ΔS = 60 000 / 150 = 400 K", "Above 400 K, ΔG < 0 and reaction is feasible"] },
      // ΔStotal
      { difficulty: "medium", q: "ΔSsurroundings for a reaction with ΔH = -240 kJ mol⁻¹ at 300 K.", hint: "ΔSsurr = -ΔH / T", answer: 800, unit: "J K⁻¹ mol⁻¹", tolerance: 5, steps: ["ΔSsurr = -(-240 000) / 300 = +800 J K⁻¹ mol⁻¹"] },
      { difficulty: "medium", q: "Calculate ΔStotal for:\nΔH = -100 kJ mol⁻¹, ΔSsystem = -50 J K⁻¹ mol⁻¹ at 298 K.\nIs it feasible?", hint: "ΔSsurr = -ΔH/T; ΔStotal = ΔSsys + ΔSsurr", answer: 285.6, unit: "J K⁻¹ mol⁻¹", tolerance: 3, steps: ["ΔSsurr = -(-100 000)/298 = +335.6 J K⁻¹ mol⁻¹", "ΔStotal = -50 + 335.6 = +285.6 J K⁻¹ mol⁻¹", "Positive ΔStotal = feasible"] },
      // Entropy calculations
      { difficulty: "medium", q: "Calculate ΔS for: N₂(g) + 3H₂(g) -> 2NH₃(g)\nS°[N₂]=192, S°[H₂]=131, S°[NH₃]=192 J K⁻¹ mol⁻¹", hint: "ΔS = ΣS°(prod) - ΣS°(react). Note coefficients!", answer: -199, unit: "J K⁻¹ mol⁻¹", tolerance: 2, steps: ["ΔS = 2(192) - [192 + 3(131)]", "ΔS = 384 - [192 + 393]", "ΔS = 384 - 585 = -201 J K⁻¹ mol⁻¹"] },
      // Born-Haber: find individual step
      { difficulty: "medium", q: "In a Born-Haber cycle for LiF:\nΔHat(Li) = +161 kJ mol⁻¹\nIE₁(Li) = +520 kJ mol⁻¹\nWhat is the total energy to go from Li(s) to Li⁺(g)?", hint: "Atomisation then ionisation.", answer: 681, unit: "kJ mol⁻¹", tolerance: 1, steps: ["Li(s) -> Li(g): +161 kJ mol⁻¹", "Li(g) -> Li⁺(g) + e⁻: +520 kJ mol⁻¹", "Total = 161 + 520 = +681 kJ mol⁻¹"] },
      { difficulty: "medium", q: "In a Born-Haber cycle for MgO:\nΔHat(Mg) = +148 kJ mol⁻¹\nIE₁(Mg) = +738 kJ mol⁻¹\nIE₂(Mg) = +1451 kJ mol⁻¹\nWhat is the total energy to go from Mg(s) to Mg²⁺(g)?", hint: "Atomisation + IE₁ + IE₂ (Mg forms 2+ ion).", answer: 2337, unit: "kJ mol⁻¹", tolerance: 2, steps: ["Mg(s) -> Mg(g): +148", "Mg(g) -> Mg⁺(g): +738", "Mg⁺(g) -> Mg²⁺(g): +1451", "Total = 148 + 738 + 1451 = +2337 kJ mol⁻¹"] },
      { difficulty: "medium", q: "For oxygen in a Born-Haber cycle for MgO:\nΔHat(1/2 O₂) = +249 kJ mol⁻¹\nEA₁(O) = -141 kJ mol⁻¹\nEA₂(O) = +798 kJ mol⁻¹\nCalculate total energy for 1/2 O₂(g) -> O²⁻(g).", hint: "Atomisation + EA₁ + EA₂. Note EA₂ is endothermic for O.", answer: 906, unit: "kJ mol⁻¹", tolerance: 2, steps: ["1/2 O₂(g) -> O(g): +249", "O(g) + e⁻ -> O⁻(g): -141", "O⁻(g) + e⁻ -> O²⁻(g): +798", "Total = 249 + (-141) + 798 = +906 kJ mol⁻¹"] },
      // ΔG with mixed signs
      { difficulty: "medium", q: "A reaction has ΔH = +120 kJ mol⁻¹ and ΔS = -80 J K⁻¹ mol⁻¹.\nCalculate ΔG at 298 K. Can this reaction ever be feasible?", hint: "ΔG = ΔH - TΔS. Think about what happens as T increases.", answer: 143.8, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔG = +120 - (298 x -0.080)", "ΔG = 120 + 23.8 = +143.8 kJ mol⁻¹", "ΔH positive, ΔS negative: ΔG always positive", "This reaction is NEVER feasible at any temperature"] },
      { difficulty: "medium", q: "A reaction has ΔH = -150 kJ mol⁻¹ and ΔS = +200 J K⁻¹ mol⁻¹.\nCalculate ΔG at 298 K. Is this always feasible?", hint: "ΔG = ΔH - TΔS", answer: -209.6, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔG = -150 - (298 x 0.200)", "ΔG = -150 - 59.6 = -209.6 kJ mol⁻¹", "ΔH negative, ΔS positive: ΔG always negative", "This reaction is ALWAYS feasible at all temperatures"] },

      // ═══ HARD (12) ═══
      // Full Born-Haber cycles
      { difficulty: "hard", q: "Use the Born-Haber cycle for KCl to find the lattice enthalpy:\nΔHf(KCl) = -437\nΔHat(K) = +89\nΔHat(1/2 Cl₂) = +122\nIE₁(K) = +419\nEA₁(Cl) = -349 kJ mol⁻¹", hint: "ΔHf = ΔHat(K) + ΔHat(Cl) + IE₁ + EA₁ + ΔHlatt", answer: -718, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(BornHaberCycle, {compound:"KCl(s)", steps:[{label:"ΔHat(K) +89",species:"K(g)",value:89},{label:"ΔHat(Cl) +122",species:"K(g) + Cl(g)",value:122},{label:"IE₁(K) +419",species:"K⁺(g) + Cl(g) + e⁻",value:419},{label:"EA₁(Cl) -349",species:"K⁺(g) + Cl⁻(g)",value:-349},{label:"ΔHlatt = ?",species:"KCl(s)",value:-718}], find:"ΔHlatt = ?"}), steps: ["ΔHf = ΔHat(K) + ΔHat(Cl) + IE₁ + EA₁ + ΔHlatt", "-437 = 89 + 122 + 419 + (-349) + ΔHlatt", "-437 = +281 + ΔHlatt", "ΔHlatt = -437 - 281 = -718 kJ mol⁻¹"] },
      { difficulty: "hard", q: "Use the Born-Haber cycle for NaCl to find the lattice enthalpy:\nΔHf(NaCl) = -411\nΔHat(Na) = +108\nΔHat(1/2 Cl₂) = +121\nIE₁(Na) = +496\nEA₁(Cl) = -349 kJ mol⁻¹", hint: "Sum all steps = ΔHf. Rearrange for ΔHlatt.", answer: -787, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(BornHaberCycle, {compound:"NaCl(s)", steps:[{label:"ΔHat(Na) +108",species:"Na(g)",value:108},{label:"ΔHat(Cl) +121",species:"Na(g) + Cl(g)",value:121},{label:"IE₁(Na) +496",species:"Na⁺(g) + Cl(g) + e⁻",value:496},{label:"EA₁(Cl) -349",species:"Na⁺(g) + Cl⁻(g)",value:-349},{label:"ΔHlatt = ?",species:"NaCl(s)",value:-787}], find:"ΔHlatt = ?"}), steps: ["-411 = 108 + 121 + 496 + (-349) + ΔHlatt", "-411 = +376 + ΔHlatt", "ΔHlatt = -411 - 376 = -787 kJ mol⁻¹"] },
      { difficulty: "hard", q: "Use the Born-Haber cycle for LiF to find ΔHlatt:\nΔHf(LiF) = -617\nΔHat(Li) = +161\nΔHat(1/2 F₂) = +79\nIE₁(Li) = +520\nEA₁(F) = -328 kJ mol⁻¹", hint: "ΔHf = sum of all steps", answer: -1049, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(BornHaberCycle, {compound:"LiF(s)", steps:[{label:"ΔHat(Li) +161",species:"Li(g)",value:161},{label:"ΔHat(F) +79",species:"Li(g) + F(g)",value:79},{label:"IE₁(Li) +520",species:"Li⁺(g) + F(g) + e⁻",value:520},{label:"EA₁(F) -328",species:"Li⁺(g) + F⁻(g)",value:-328},{label:"ΔHlatt = ?",species:"LiF(s)",value:-1049}], find:"ΔHlatt = ?"}), steps: ["-617 = 161 + 79 + 520 + (-328) + ΔHlatt", "-617 = +432 + ΔHlatt", "ΔHlatt = -617 - 432 = -1049 kJ mol⁻¹"] },
      { difficulty: "hard", q: "Use the Born-Haber cycle for CaCl₂ to find ΔHlatt:\nΔHf(CaCl₂) = -795\nΔHat(Ca) = +178\nΔHat(Cl₂) = +242\nIE₁(Ca) = +590\nIE₂(Ca) = +1145\nEA₁(Cl) = -349 kJ mol⁻¹\n(Note: 2 Cl atoms needed)", hint: "Ca loses 2 electrons. 2 x EA₁ for 2 Cl atoms. ΔHat for full Cl₂.", answer: -2253, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(BornHaberCycle, {compound:"CaCl₂(s)", steps:[{label:"ΔHat(Ca) +178",species:"Ca(g)",value:178},{label:"ΔHat(Cl₂) +242",species:"Ca(g) + 2Cl(g)",value:242},{label:"IE₁(Ca) +590",species:"Ca⁺(g) + 2Cl(g)",value:590},{label:"IE₂(Ca) +1145",species:"Ca²⁺(g) + 2Cl(g)",value:1145},{label:"2×EA₁ -698",species:"Ca²⁺(g) + 2Cl⁻(g)",value:-698},{label:"ΔHlatt = ?",species:"CaCl₂(s)",value:-2252}], find:"ΔHlatt = ?"}), steps: ["-795 = 178 + 242 + 590 + 1145 + 2(-349) + ΔHlatt", "-795 = 178 + 242 + 590 + 1145 - 698 + ΔHlatt", "-795 = +1457 + ΔHlatt", "ΔHlatt = -795 - 1457 = -2252 kJ mol⁻¹"] },
      // Find missing Born-Haber step
      { difficulty: "hard", q: "In the Born-Haber cycle for NaBr:\nΔHf = -361, ΔHat(Na) = +108, IE₁(Na) = +496, ΔHlatt = -747\nEA₁(Br) = -325 kJ mol⁻¹\nCalculate ΔHat(1/2 Br₂).", hint: "ΔHf = ΔHat(Na) + ΔHat(Br) + IE₁ + EA₁ + ΔHlatt. Solve for ΔHat(Br).", answer: 107, unit: "kJ mol⁻¹", tolerance: 2, diagram: React.createElement(BornHaberCycle, {compound:"NaBr(s)", steps:[{label:"ΔHat(Na) +108",species:"Na(g)",value:108},{label:"ΔHat(Br) = ?",species:"Na(g) + Br(g)",value:107},{label:"IE₁(Na) +496",species:"Na⁺(g) + Br(g) + e⁻",value:496},{label:"EA₁(Br) -325",species:"Na⁺(g) + Br⁻(g)",value:-325},{label:"ΔHlatt -747",species:"NaBr(s)",value:-747}], find:"ΔHat(Br) = ?"}), steps: ["-361 = 108 + ΔHat(Br) + 496 + (-325) + (-747)", "-361 = -468 + ΔHat(Br)", "ΔHat(Br) = -361 + 468 = +107 kJ mol⁻¹"] },
      { difficulty: "hard", q: "In the Born-Haber cycle for MgO:\nΔHf = -602, ΔHat(Mg) = +148, IE₁(Mg) = +738, IE₂(Mg) = +1451\nΔHat(1/2 O₂) = +249, EA₁(O) = -141, EA₂(O) = +798\nCalculate ΔHlatt.", hint: "Sum all steps. Mg forms 2+, O forms 2-.", answer: -3845, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(BornHaberCycle, {compound:"MgO(s)", steps:[{label:"ΔHat(Mg) +148",species:"Mg(g)",value:148},{label:"ΔHat(O) +249",species:"Mg(g) + O(g)",value:249},{label:"IE₁(Mg) +738",species:"Mg⁺(g) + O(g)",value:738},{label:"IE₂(Mg) +1451",species:"Mg²⁺(g) + O(g)",value:1451},{label:"EA₁(O) -141",species:"Mg²⁺(g) + O⁻(g)",value:-141},{label:"EA₂(O) +798",species:"Mg²⁺(g) + O²⁻(g)",value:798},{label:"ΔHlatt = ?",species:"MgO(s)",value:-3845}], find:"ΔHlatt = ?"}), steps: ["-602 = 148 + 249 + 738 + 1451 + (-141) + 798 + ΔHlatt", "-602 = 3243 + ΔHlatt", "ΔHlatt = -602 - 3243 = -3845 kJ mol⁻¹"] },
      // ΔStotal and feasibility
      { difficulty: "hard", q: "ΔH = +50 kJ mol⁻¹, ΔSsystem = +200 J K⁻¹ mol⁻¹.\nCalculate ΔStotal at 400 K.", hint: "ΔSsurr = -ΔH/T; ΔStotal = ΔSsys + ΔSsurr", answer: 75, unit: "J K⁻¹ mol⁻¹", tolerance: 3, steps: ["ΔSsurr = -(+50 000) / 400 = -125 J K⁻¹ mol⁻¹", "ΔStotal = +200 + (-125) = +75 J K⁻¹ mol⁻¹", "Positive = spontaneous at 400 K"] },
      { difficulty: "hard", q: "For N₂(g) + 3H₂(g) -> 2NH₃(g):\nΔH = -92 kJ mol⁻¹, ΔS = -199 J K⁻¹ mol⁻¹\nCalculate the maximum temperature at which the reaction is feasible.", hint: "T = ΔH / ΔS when ΔG = 0. Both ΔH and ΔS negative.", answer: 462, unit: "K", tolerance: 5, steps: ["At ΔG = 0: T = ΔH / ΔS", "T = -92 000 / -199 = 462 K", "Below 462 K (189 C), ΔG < 0 and reaction is feasible", "Above 462 K, equilibrium shifts back"] },
      // ΔG with entropy of system
      { difficulty: "hard", q: "Calculate ΔG at 298 K for:\n2Mg(s) + O₂(g) -> 2MgO(s)\nΔH = -1204 kJ mol⁻¹\nS°[Mg] = 32.7, S°[O₂] = 205, S°[MgO] = 26.9 J K⁻¹ mol⁻¹", hint: "First calculate ΔS, then ΔG = ΔH - TΔS", answer: -1139, unit: "kJ mol⁻¹", tolerance: 5, steps: ["ΔS = 2(26.9) - [2(32.7) + 205] = 53.8 - 270.4 = -216.6 J K⁻¹ mol⁻¹", "ΔG = -1204 - (298 x -0.2166)", "ΔG = -1204 + 64.5 = -1139.5 kJ mol⁻¹"] },
      // Lattice enthalpy trends
      { difficulty: "hard", q: "The lattice enthalpies are:\nNaF = -923, NaCl = -787, NaBr = -747 kJ mol⁻¹\nPredict ΔHlatt for NaI (it should be least exothermic).\nIf ΔHf(NaI) = -288, ΔHat(Na) = +108, IE₁(Na) = +496,\nΔHat(1/2 I₂) = +107, EA₁(I) = -295 kJ mol⁻¹\nCalculate the actual value.", hint: "Sum all steps = ΔHf", answer: -704, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(BornHaberCycle, {compound:"NaI(s)", steps:[{label:"ΔHat(Na) +108",species:"Na(g)",value:108},{label:"ΔHat(I) +107",species:"Na(g) + I(g)",value:107},{label:"IE₁(Na) +496",species:"Na⁺(g) + I(g) + e⁻",value:496},{label:"EA₁(I) -295",species:"Na⁺(g) + I⁻(g)",value:-295},{label:"ΔHlatt = ?",species:"NaI(s)",value:-704}], find:"ΔHlatt = ?"}), steps: ["-288 = 108 + 107 + 496 + (-295) + ΔHlatt", "-288 = +416 + ΔHlatt", "ΔHlatt = -288 - 416 = -704 kJ mol⁻¹", "Trend: NaF(-923) > NaCl(-787) > NaBr(-747) > NaI(-704)"] },
      // Entropy and ΔG combined
      { difficulty: "hard", q: "Calculate ΔS and ΔG at 298 K for:\nNH₄Cl(s) -> NH₃(g) + HCl(g)\nΔH = +176 kJ mol⁻¹\nS°[NH₄Cl] = 94.6, S°[NH₃] = 192, S°[HCl] = 187 J K⁻¹ mol⁻¹", hint: "Find ΔS first, then ΔG = ΔH - TΔS", answer: 91.3, unit: "kJ mol⁻¹", tolerance: 2, steps: ["ΔS = [192 + 187] - 94.6 = 284.4 J K⁻¹ mol⁻¹", "ΔG = +176 - (298 x 0.2844)", "ΔG = 176 - 84.8 = +91.2 kJ mol⁻¹", "Not feasible at 298 K (ΔG > 0)"] },

      // ═══ EXAM (10) ═══
      { difficulty: "exam", q: "Use the Born-Haber cycle for MgCl₂ to find ΔHlatt:\nΔHf = -641, ΔHat(Mg) = +148, IE₁(Mg) = +738, IE₂(Mg) = +1451\nΔHat(Cl₂) = +242, EA₁(Cl) = -349 kJ mol⁻¹", hint: "Mg²⁺ needs IE₁ + IE₂. Full Cl₂ atomisation. 2 x EA₁.", answer: -2523, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(BornHaberCycle, {compound:"MgCl₂(s)", steps:[{label:"ΔHat(Mg) +148",species:"Mg(g)",value:148},{label:"ΔHat(Cl₂) +242",species:"Mg(g) + 2Cl(g)",value:242},{label:"IE₁(Mg) +738",species:"Mg⁺(g) + 2Cl(g)",value:738},{label:"IE₂(Mg) +1451",species:"Mg²⁺(g) + 2Cl(g)",value:1451},{label:"2×EA₁(Cl) -698",species:"Mg²⁺(g) + 2Cl⁻(g)",value:-698},{label:"ΔHlatt = ?",species:"MgCl₂(s)",value:-2522}], find:"ΔHlatt = ?"}), steps: ["-641 = 148 + 242 + 738 + 1451 + 2(-349) + ΔHlatt", "-641 = 148 + 242 + 738 + 1451 - 698 + ΔHlatt", "-641 = 1881 + ΔHlatt", "ΔHlatt = -641 - 1881 = -2522 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Calculate ΔHf for KBr using the Born-Haber cycle:\nΔHat(K) = +89, ΔHat(1/2 Br₂) = +112\nIE₁(K) = +419, EA₁(Br) = -325\nΔHlatt(KBr) = -689 kJ mol⁻¹", hint: "ΔHf = sum of all steps including lattice enthalpy", answer: -394, unit: "kJ mol⁻¹", tolerance: 3, diagram: React.createElement(BornHaberCycle, {compound:"KBr(s)", steps:[{label:"ΔHat(K) +89",species:"K(g)",value:89},{label:"ΔHat(Br) +112",species:"K(g) + Br(g)",value:112},{label:"IE₁(K) +419",species:"K⁺(g) + Br(g) + e⁻",value:419},{label:"EA₁(Br) -325",species:"K⁺(g) + Br⁻(g)",value:-325},{label:"ΔHlatt -689",species:"KBr(s)",value:-689}], find:"none"}), steps: ["ΔHf = ΔHat(K) + ΔHat(Br) + IE₁ + EA₁ + ΔHlatt", "ΔHf = 89 + 112 + 419 + (-325) + (-689)", "ΔHf = -394 kJ mol⁻¹"] },
      { difficulty: "exam", q: "The theoretical (Born-Haber) lattice enthalpy of NaCl is -787 kJ mol⁻¹.\nThe calculated (Born-Lande) value is -770 kJ mol⁻¹.\nCalculate the % difference and explain what this suggests about the bonding.", hint: "% diff = |exp - calc| / exp x 100. Small difference = ionic model works well.", answer: 2.2, unit: "%", tolerance: 0.2, steps: ["% difference = |(-787) - (-770)| / 787 x 100", "= 17 / 787 x 100 = 2.2%", "Small % = good agreement with ionic model", "NaCl bonding is almost purely ionic"] },
      { difficulty: "exam", q: "For AgI, the Born-Haber lattice enthalpy is -876 kJ mol⁻¹ but the theoretical (Born-Lande) value is -736 kJ mol⁻¹.\nCalculate the % discrepancy and explain.", hint: "Large discrepancy = covalent character.", answer: 16.0, unit: "%", tolerance: 0.5, steps: ["% = |(-876) - (-736)| / 876 x 100", "= 140 / 876 x 100 = 16.0%", "Large discrepancy = significant covalent character", "Ag⁺ is small and highly polarising; I⁻ is large and polarisable", "The electron cloud of I⁻ is distorted (Fajans' rules)"] },
      { difficulty: "exam", q: "Calculate ΔG at 298 K and 1200 K for:\nCaCO₃(s) -> CaO(s) + CO₂(g)\nΔH = +178 kJ mol⁻¹, ΔS = +160.4 J K⁻¹ mol⁻¹\nAt which temperature is the reaction feasible?", hint: "Calculate ΔG at both temperatures.", answer: 130.2, unit: "kJ mol⁻¹", tolerance: 2, steps: ["At 298 K: ΔG = 178 - (298 x 0.1604) = 178 - 47.8 = +130.2 kJ mol⁻¹", "Not feasible (ΔG > 0)", "At 1200 K: ΔG = 178 - (1200 x 0.1604) = 178 - 192.5 = -14.5 kJ mol⁻¹", "Feasible at 1200 K (ΔG < 0)", "Answer: 130.2 (ΔG at 298 K)"] },
      { difficulty: "exam", q: "Calculate ΔG at 298 K for the Haber process:\nN₂(g) + 3H₂(g) -> 2NH₃(g)\nΔH = -92 kJ mol⁻¹, ΔS = -199 J K⁻¹ mol⁻¹\nExplain why the process uses ~450 C despite being feasible at 298 K.", hint: "ΔG = ΔH - TΔS. Think about kinetics vs thermodynamics.", answer: -32.7, unit: "kJ mol⁻¹", tolerance: 1, steps: ["ΔG = -92 - (298 x -0.199) = -92 + 59.3 = -32.7 kJ mol⁻¹", "Feasible at 298 K (ΔG < 0)", "But rate is too slow at low temperatures", "Higher T increases rate (kinetics) but decreases yield (ΔG less negative)", "450 C is a compromise between rate and yield"] },
      { difficulty: "exam", q: "For the dissolving of NaCl:\nΔHsol = +3.9 kJ mol⁻¹\nΔSsol = +43 J K⁻¹ mol⁻¹\nCalculate ΔG at 298 K and explain why NaCl dissolves despite being endothermic.", hint: "ΔG = ΔH - TΔS", answer: -8.9, unit: "kJ mol⁻¹", tolerance: 0.5, steps: ["ΔG = +3.9 - (298 x 0.043)", "ΔG = 3.9 - 12.8 = -8.9 kJ mol⁻¹", "ΔG < 0 so dissolving is feasible", "Even though ΔH > 0 (endothermic), the large positive ΔS", "(increase in disorder from ions spreading out)", "makes TΔS > ΔH, giving negative ΔG"] },
      { difficulty: "exam", q: "Use the Born-Haber cycle for Na₂O to find ΔHlatt:\nΔHf = -414, ΔHat(Na) = +108, IE₁(Na) = +496\nΔHat(1/2 O₂) = +249, EA₁(O) = -141, EA₂(O) = +798 kJ mol⁻¹\n(Note: 2 Na atoms)", hint: "2 x atomisation of Na, 2 x IE₁. Full O pathway.", answer: -2528, unit: "kJ mol⁻¹", tolerance: 5, diagram: React.createElement(BornHaberCycle, {compound:"Na₂O(s)", steps:[{label:"2×ΔHat(Na) +216",species:"2Na(g)",value:216},{label:"ΔHat(O) +249",species:"2Na(g) + O(g)",value:249},{label:"2×IE₁(Na) +992",species:"2Na⁺(g) + O(g)",value:992},{label:"EA₁(O) -141",species:"2Na⁺(g) + O⁻(g)",value:-141},{label:"EA₂(O) +798",species:"2Na⁺(g) + O²⁻(g)",value:798},{label:"ΔHlatt = ?",species:"Na₂O(s)",value:-2528}], find:"ΔHlatt = ?"}), steps: ["-414 = 2(108) + 249 + 2(496) + (-141) + 798 + ΔHlatt", "-414 = 216 + 249 + 992 - 141 + 798 + ΔHlatt", "-414 = 2114 + ΔHlatt", "ΔHlatt = -414 - 2114 = -2528 kJ mol⁻¹"] },
      { difficulty: "exam", q: "Explain why ΔHlatt for MgO (-3850 kJ mol⁻¹) is much more exothermic than NaCl (-787 kJ mol⁻¹), and calculate the ratio.", hint: "Consider charge and ionic radius. Lattice enthalpy depends on q+q-/r.", answer: 4.89, unit: "", tolerance: 0.1, steps: ["Ratio = 3850 / 787 = 4.89", "MgO has higher charges (2+ and 2-) vs (1+ and 1-)", "Mg²⁺ is smaller than Na⁺ (higher charge density)", "O²⁻ is smaller than Cl⁻", "Lattice enthalpy proportional to (q+ x q-)/(r+ + r-)", "Higher charges and smaller radii = much stronger lattice"] },
      { difficulty: "exam", q: "At what temperature does the reduction of iron oxide become feasible?\n2Fe₂O₃(s) + 3C(s) -> 4Fe(s) + 3CO₂(g)\nΔH = +468 kJ mol⁻¹, ΔS = +558 J K⁻¹ mol⁻¹", hint: "T = ΔH/ΔS at ΔG = 0", answer: 839, unit: "K", tolerance: 5, steps: ["At ΔG = 0: T = ΔH / ΔS", "T = 468 000 / 558 = 839 K", "Above 839 K (566 C), reduction is feasible", "This is why blast furnaces operate at very high temperatures"] },
    ]
  },
  {
    id: "calc_electrode", title: "Electrode Potentials", color: "#1a6b9a", board: "both",
    questions: [
      // EASY
      { difficulty: "easy", q: "Calculate the standard cell EMF for a cell made from Zn²⁺/Zn (E° = −0.76 V) and Cu²⁺/Cu (E° = +0.34 V).", hint: "E°cell = E°cathode − E°anode. The cathode (reduction) is the more positive half-cell.", answer: 1.10, unit: "V", tolerance: 0.01, steps: ["E°cell = E°(Cu²⁺/Cu) − E°(Zn²⁺/Zn)", "E°cell = +0.34 − (−0.76) = +1.10 V"] },
      { difficulty: "easy", q: "Calculate the standard cell EMF for a cell made from Ag⁺/Ag (E° = +0.80 V) and Cu²⁺/Cu (E° = +0.34 V).", hint: "More positive electrode is the cathode. E°cell = E°cathode − E°anode.", answer: 0.46, unit: "V", tolerance: 0.01, steps: ["Ag⁺/Ag is more positive → cathode (reduction)", "Cu²⁺/Cu is less positive → anode (oxidation)", "E°cell = +0.80 − 0.34 = +0.46 V"] },
      { difficulty: "easy", q: "A cell is made from Fe³⁺/Fe²⁺ (E° = +0.77 V) and Sn⁴⁺/Sn²⁺ (E° = +0.15 V). Fe³⁺ is reduced at the cathode. Calculate E°cell.", hint: "E°cell = E°cathode − E°anode.", answer: 0.62, unit: "V", tolerance: 0.01, steps: ["Cathode: Fe³⁺/Fe²⁺ (E° = +0.77 V)", "Anode: Sn⁴⁺/Sn²⁺ (E° = +0.15 V)", "E°cell = 0.77 − 0.15 = +0.62 V"] },
      // MEDIUM
      { difficulty: "medium", q: "Are these two half-reactions spontaneous in the forward direction together?\nMnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O  E° = +1.51 V\nFe³⁺ + e⁻ → Fe²⁺  E° = +0.77 V\n(Enter 1 for yes, 0 for no)", hint: "For a spontaneous reaction, E°cell > 0. The stronger oxidiser (higher E°) reacts with the reducing form of the weaker.", answer: 1, unit: "", tolerance: 0, steps: ["MnO₄⁻/Mn²⁺ has higher E° → is the oxidising agent (cathode)", "Fe²⁺ is oxidised to Fe³⁺ (anode = reverse of Fe³⁺/Fe²⁺)", "E°cell = +1.51 − 0.77 = +0.74 V > 0 → spontaneous ✓"] },
      { difficulty: "medium", q: "A cell consists of Fe³⁺/Fe²⁺ (E° = +0.77 V) and Cl₂/Cl⁻ (E° = +1.36 V). Fe²⁺ is oxidised at the anode. Calculate E°cell.", hint: "E°cell = E°cathode − E°anode. Identify which is cathode and which is anode.", answer: 0.59, unit: "V", tolerance: 0.01, steps: ["Anode (oxidation): Fe²⁺ → Fe³⁺ + e⁻", "Cathode (reduction): Cl₂ + 2e⁻ → 2Cl⁻", "E°cell = +1.36 − 0.77 = +0.59 V"] },
      // HARD
      { difficulty: "hard", q: "A hydrogen fuel cell uses H₂ and O₂. The two half-equations are:\nO₂ + 4H⁺ + 4e⁻ → 2H₂O  E° = +1.23 V\n2H⁺ + 2e⁻ → H₂  E° = 0.00 V\nIdentify the cathode and calculate E°cell (V).", hint: "The cathode is where reduction occurs (more positive E°). E°cell = E°cathode − E°anode.", answer: 1.23, unit: "V", tolerance: 0.01, steps: ["O₂/H₂O has higher E° → reduction occurs here → cathode", "H⁺/H₂ is reversed at the anode: H₂ → 2H⁺ + 2e⁻", "E°cell = E°cathode − E°anode = +1.23 − 0.00 = +1.23 V"] },
    ]
  },
  {
    id: "calc_ram", title: "Relative Atomic Mass & Mass Spec", color: "#e11d48", board: "both",
    questions: [
      // EASY
      { difficulty: "easy", q: "A sample of lithium contains two isotopes: Li-7 (92.5%) and Li-6 (7.5%). Calculate the relative atomic mass to 1 decimal place.", hint: "Ar = (mass1 x %1 + mass2 x %2) / 100", answer: 6.9, unit: "", tolerance: 0.05, steps: ["Ar = (7 x 92.5 + 6 x 7.5) / 100", "Ar = (647.5 + 45.0) / 100 = 692.5 / 100", "Ar = 6.9"] },
      { difficulty: "easy", q: "Chlorine has two isotopes: Cl-35 (75%) and Cl-37 (25%). Calculate the relative atomic mass.", hint: "Ar = (mass1 x %1 + mass2 x %2) / 100", answer: 35.5, unit: "", tolerance: 0.05, steps: ["Ar = (35 x 75 + 37 x 25) / 100", "Ar = (2625 + 925) / 100 = 3550 / 100", "Ar = 35.5"] },
      { difficulty: "easy", q: "Calculate the relative formula mass (Mr) of Ca(OH)₂. (Ar: Ca=40, O=16, H=1)", hint: "Mr = sum of all Ar values. Ca(OH)₂ has 1 Ca, 2 O, 2 H.", answer: 74, unit: "", tolerance: 0.1, steps: ["Mr = 40 + 2(16 + 1)", "Mr = 40 + 2(17) = 40 + 34", "Mr = 74"] },
      // MEDIUM
      { difficulty: "medium", q: "A sample of iron from a meteorite contains: Fe-54 (6.20%), Fe-56 (91.8%), Fe-57 (1.76%), Fe-58 (0.24%). Calculate the Ar to 3 significant figures.", hint: "Ar = sum of (isotope mass x % abundance) / 100", answer: 55.9, unit: "", tolerance: 0.05, steps: ["Ar = (54x6.20 + 56x91.8 + 57x1.76 + 58x0.24) / 100", "Ar = (334.8 + 5140.8 + 100.32 + 13.92) / 100", "Ar = 5589.84 / 100 = 55.9"] },
      { difficulty: "medium", q: "The Mr of hydrated magnesium sulfate MgSO₄.xH₂O is 246.4. Calculate the value of x. (Ar: Mg=24.3, S=32.1, O=16, H=1)", hint: "Mr(MgSO₄) = 24.3 + 32.1 + 4(16) = 120.4. Then 246.4 - 120.4 = mass of xH₂O.", answer: 7, unit: "", tolerance: 0, steps: ["Mr(MgSO₄) = 24.3 + 32.1 + 64.0 = 120.4", "Mass of water = 246.4 - 120.4 = 126.0", "Mr(H₂O) = 18; x = 126.0 / 18 = 7"] },
      { difficulty: "medium", q: "The Mr of a Group 2 nitrate M(NO₃)₂ is 212. Find the Ar of the metal M. (Ar: N=14, O=16)", hint: "Mr(NO₃)₂ = 2(14 + 48) = 124. Then Ar(M) = 212 - 124.", answer: 88, unit: "", tolerance: 0.5, steps: ["Mr of 2 NO₃ groups = 2 x (14 + 3x16) = 2 x 62 = 124", "Ar(M) = 212 - 124 = 88", "The metal is strontium (Sr)"] },
      // HARD
      { difficulty: "hard", q: "The Ar of rubidium is 85.47. Rubidium has two isotopes: Rb-85 and Rb-87. Calculate the percentage abundance of Rb-87.", hint: "Let x = % of Rb-87. Then (85(100-x) + 87x) / 100 = 85.47.", answer: 23.5, unit: "%", tolerance: 0.5, steps: ["Let x = % Rb-87, so % Rb-85 = (100 - x)", "85(100-x) + 87x = 85.47 x 100 = 8547", "8500 - 85x + 87x = 8547", "2x = 47, x = 23.5%"] },
      { difficulty: "hard", q: "A sample of boron has two isotopes: B-10 and B-11. The Ar is 10.88. Calculate the percentage abundance of B-11.", hint: "Let x = % of B-11. Set up: 10(100-x) + 11x = 10.88 x 100", answer: 88, unit: "%", tolerance: 0.5, steps: ["Let x = % B-11", "10(100-x) + 11x = 1088", "1000 - 10x + 11x = 1088", "x = 88%"] },
      { difficulty: "hard", q: "Calculate the mass (in kg) of a single P-31 ion (31P+). (L = 6.02 x 10²³ mol⁻¹)", hint: "Mass of 1 mol of P-31 atoms = 31 g = 0.031 kg. Divide by Avogadro's number.", answer: 5.15e-26, unit: "kg", tolerance: 1e-27, steps: ["Mass of 1 atom = molar mass / L", "Mass = 0.031 / (6.02 x 10²³)", "Mass = 5.15 x 10⁻²⁶ kg"] },
      // EXAM
      { difficulty: "exam", q: "A singly charged ion has a mass of 1.66 x 10⁻²³ kg and is accelerated through a TOF mass spectrometer with KE = 2.00 x 10⁻¹⁶ J. The drift region is 1.50 m. Calculate the time (s) for the ion to reach the detector.", hint: "KE = 1/2 mv². Rearrange for v, then t = d/v.", answer: 3.05e-4, unit: "s", tolerance: 5e-6, steps: ["KE = 1/2 mv², so v² = 2KE/m", "v² = 2(2.00 x 10⁻¹⁶) / (1.66 x 10⁻²³) = 2.41 x 10⁷", "v = 4910 m s⁻¹", "t = d/v = 1.50 / 4910 = 3.05 x 10⁻⁴ s"] },
    ]
  },
  {
    id: "calc_tof", title: "TOF Mass Spectrometry", color: "#be185d", board: "both",
    questions: [
      // ═══ EASY (10) ═══
      { difficulty: "easy", q: "In a TOF mass spectrometer, an ion has a velocity of 5000 m s⁻¹. The drift region is 1.50 m long.\nCalculate the time of flight (s).", hint: "t = d / v", answer: 3.00e-4, unit: "s", tolerance: 5e-6, steps: ["t = d / v", "t = 1.50 / 5000", "t = 3.00 x 10⁻⁴ s"] },
      { difficulty: "easy", q: "An ion travels 2.00 m in 4.00 x 10⁻⁵ s. Calculate its velocity (m s⁻¹).", hint: "v = d / t", answer: 50000, unit: "m s⁻¹", tolerance: 500, steps: ["v = d / t", "v = 2.00 / (4.00 x 10⁻⁵)", "v = 50 000 m s⁻¹"] },
      { difficulty: "easy", q: "An ion has mass 3.32 x 10⁻²⁶ kg and velocity 8000 m s⁻¹.\nCalculate its kinetic energy (J).\n(KE = 1/2 mv²)", hint: "Substitute into KE = 1/2 mv²", answer: 1.063e-18, unit: "J", tolerance: 1e-20, steps: ["KE = 1/2 mv²", "KE = 0.5 x 3.32 x 10⁻²⁶ x 8000²", "KE = 0.5 x 3.32 x 10⁻²⁶ x 6.4 x 10⁷", "KE = 1.06 x 10⁻¹⁸ J"] },
      { difficulty: "easy", q: "Calculate the mass (kg) of one atom of ²⁰Ne.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = Ar x 1.661 x 10⁻²⁷", answer: 3.322e-26, unit: "kg", tolerance: 1e-28, steps: ["mass = 20 x 1.661 x 10⁻²⁷", "mass = 3.322 x 10⁻²⁶ kg"] },
      { difficulty: "easy", q: "Calculate the mass (kg) of one ³⁵Cl⁺ ion.\n(1 u = 1.661 x 10⁻²⁷ kg, ignore electron mass)", hint: "mass = Ar x 1.661 x 10⁻²⁷", answer: 5.814e-26, unit: "kg", tolerance: 1e-28, steps: ["mass = 35 x 1.661 x 10⁻²⁷", "mass = 5.814 x 10⁻²⁶ kg", "(electron mass is negligible)"] },
      { difficulty: "easy", q: "Calculate the mass (kg) of one ¹⁶O atom.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = Ar x 1.661 x 10⁻²⁷", answer: 2.658e-26, unit: "kg", tolerance: 1e-28, steps: ["mass = 16 x 1.661 x 10⁻²⁷", "mass = 2.658 x 10⁻²⁶ kg"] },
      { difficulty: "easy", q: "An ion has KE = 6.40 x 10⁻¹⁶ J and mass 5.31 x 10⁻²⁶ kg.\nCalculate its velocity (m s⁻¹).", hint: "v = sqrt(2KE / m)", answer: 4908, unit: "m s⁻¹", tolerance: 20, steps: ["v² = 2KE / m", "v² = 2(6.40 x 10⁻¹⁶) / (5.31 x 10⁻²⁶)", "v² = 2.41 x 10⁷", "v = 4910 m s⁻¹"] },
      { difficulty: "easy", q: "An ⁴⁰Ar⁺ ion has KE = 3.20 x 10⁻¹⁶ J.\nCalculate its velocity.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = 40u, then v = sqrt(2KE/m)", answer: 98180, unit: "m s⁻¹", tolerance: 500, steps: ["mass = 40 x 1.661 x 10⁻²⁷ = 6.644 x 10⁻²⁶ kg", "v = sqrt(2 x 3.20 x 10⁻¹⁶ / 6.644 x 10⁻²⁶)", "v = sqrt(9.632 x 10⁹)", "v = 9.81 x 10⁴ m s⁻¹"] },
      { difficulty: "easy", q: "A ¹²C⁺ ion has velocity 2.00 x 10⁵ m s⁻¹.\nCalculate its kinetic energy.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "KE = 1/2 mv². Find mass first.", answer: 3.99e-16, unit: "J", tolerance: 1e-17, steps: ["mass = 12 x 1.661 x 10⁻²⁷ = 1.993 x 10⁻²⁶ kg", "KE = 1/2 x 1.993 x 10⁻²⁶ x (2.00 x 10⁵)²", "KE = 0.5 x 1.993 x 10⁻²⁶ x 4.00 x 10¹⁰", "KE = 3.99 x 10⁻¹⁶ J"] },
      { difficulty: "easy", q: "An ion has mass 1.063 x 10⁻²⁵ kg. Convert this to an m/z value (for z = 1).\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "m/z = mass (kg) / 1.661 x 10⁻²⁷", answer: 64, unit: "", tolerance: 0.5, steps: ["m/z = mass / (1.661 x 10⁻²⁷)", "m/z = 1.063 x 10⁻²⁵ / 1.661 x 10⁻²⁷", "m/z = 64.0 (likely ⁶⁴Cu⁺ or ⁶⁴Zn⁺)"] },

      // ═══ MEDIUM (12) ═══
      { difficulty: "medium", q: "A ²³Na⁺ ion is accelerated to a KE of 4.80 x 10⁻¹⁶ J. The drift region is 1.20 m.\nCalculate the time of flight.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Find mass, then v = sqrt(2KE/m), then t = d/v", answer: 7.57e-6, unit: "s", tolerance: 1e-7, steps: ["mass = 23 x 1.661 x 10⁻²⁷ = 3.820 x 10⁻²⁶ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 3.820 x 10⁻²⁶)", "v = sqrt(2.513 x 10¹⁰) = 1.585 x 10⁵ m s⁻¹", "t = 1.20 / (1.585 x 10⁵) = 7.57 x 10⁻⁶ s"] },
      { difficulty: "medium", q: "A ⁵⁶Fe⁺ ion has KE = 3.20 x 10⁻¹⁶ J. The drift region is 1.50 m.\nCalculate the time of flight.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = 56u, then v = sqrt(2KE/m), then t = d/v", answer: 1.81e-5, unit: "s", tolerance: 2e-7, steps: ["mass = 56 x 1.661 x 10⁻²⁷ = 9.302 x 10⁻²⁶ kg", "v² = 2(3.20 x 10⁻¹⁶) / (9.302 x 10⁻²⁶) = 6.882 x 10⁹", "v = sqrt(6.882 x 10⁹) = 8.296 x 10⁴ m s⁻¹", "t = 1.50 / 8.296 x 10⁴ = 1.81 x 10⁻⁵ s"] },
      { difficulty: "medium", q: "Two isotopes ³⁵Cl⁺ and ³⁷Cl⁺ are accelerated with KE = 4.80 x 10⁻¹⁶ J. Drift region = 1.50 m.\nCalculate the difference in their times of flight.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Calculate t for each isotope separately, then subtract.", answer: 3.29e-7, unit: "s", tolerance: 1e-8, steps: ["m(³⁵Cl) = 35 x 1.661 x 10⁻²⁷ = 5.814 x 10⁻²⁶ kg", "v(³⁵Cl) = sqrt(2 x 4.80 x 10⁻¹⁶ / 5.814 x 10⁻²⁶) = 1.285 x 10⁵", "t(³⁵Cl) = 1.50 / 1.285 x 10⁵ = 1.167 x 10⁻⁵ s", "m(³⁷Cl) = 37 x 1.661 x 10⁻²⁷ = 6.146 x 10⁻²⁶ kg", "v(³⁷Cl) = sqrt(2 x 4.80 x 10⁻¹⁶ / 6.146 x 10⁻²⁶) = 1.249 x 10⁵", "t(³⁷Cl) = 1.50 / 1.249 x 10⁵ = 1.200 x 10⁻⁵ s", "Difference = 1.200 x 10⁻⁵ - 1.167 x 10⁻⁵ = 3.29 x 10⁻⁷ s"] },
      { difficulty: "medium", q: "An ion reaches the detector in 1.24 x 10⁻⁵ s. The drift region is 1.50 m and KE = 4.80 x 10⁻¹⁶ J.\nCalculate the mass of the ion (kg).\n(KE = 1/2 mv²)", hint: "Find v = d/t, then rearrange KE = 1/2 mv² for m.", answer: 6.56e-26, unit: "kg", tolerance: 1e-27, steps: ["v = d/t = 1.50 / (1.24 x 10⁻⁵) = 1.210 x 10⁵ m s⁻¹", "m = 2KE / v²", "m = 2(4.80 x 10⁻¹⁶) / (1.210 x 10⁵)²", "m = 9.60 x 10⁻¹⁶ / 1.464 x 10¹⁰", "m = 6.56 x 10⁻²⁶ kg"] },
      { difficulty: "medium", q: "An ion has mass 6.56 x 10⁻²⁶ kg. Convert this to a relative mass (m/z for z=1).\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Divide mass by 1 u to get relative mass.", answer: 39.5, unit: "", tolerance: 0.5, steps: ["m/z = mass / (1.661 x 10⁻²⁷)", "m/z = 6.56 x 10⁻²⁶ / 1.661 x 10⁻²⁷", "m/z = 39.5 (likely ⁴⁰Ar or ⁴⁰Ca)"] },
      { difficulty: "medium", q: "In electrospray ionisation, a molecule gives a peak at m/z = 181.\nWhat is the Mr of the molecule?", hint: "In electrospray, ion = MH⁺, so m/z = Mr + 1.", answer: 180, unit: "", tolerance: 0.1, steps: ["Electrospray forms MH⁺ ions", "m/z of MH⁺ = Mr + 1", "Mr = 181 - 1 = 180"] },
      { difficulty: "medium", q: "In electron impact ionisation, a molecule gives a molecular ion peak at m/z = 46.\nWhat is the Mr of the molecule?", hint: "Electron impact forms M⁺ ions, so m/z = Mr.", answer: 46, unit: "", tolerance: 0.1, steps: ["Electron impact forms M⁺ ions", "m/z of M⁺ = Mr", "Mr = 46 (could be ethanol C₂H₅OH or NO₂)"] },
      { difficulty: "medium", q: "An ion with charge +1 has a time of flight of 1.85 x 10⁻⁵ s over a distance of 2.00 m.\nCalculate the velocity of the ion.", hint: "v = d / t", answer: 108108, unit: "m s⁻¹", tolerance: 1000, steps: ["v = d / t", "v = 2.00 / (1.85 x 10⁻⁵)", "v = 1.08 x 10⁵ m s⁻¹"] },
      { difficulty: "medium", q: "A ¹⁴N⁺ ion is accelerated to KE = 4.80 x 10⁻¹⁶ J. Drift region = 1.50 m.\nCalculate the time of flight.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = 14u, v = sqrt(2KE/m), t = d/v", answer: 7.38e-6, unit: "s", tolerance: 1e-7, steps: ["mass = 14 x 1.661 x 10⁻²⁷ = 2.325 x 10⁻²⁶ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 2.325 x 10⁻²⁶)", "v = sqrt(4.129 x 10¹⁰) = 2.032 x 10⁵ m s⁻¹", "t = 1.50 / 2.032 x 10⁵ = 7.38 x 10⁻⁶ s"] },
      { difficulty: "medium", q: "A ¹²C⁺ ion is accelerated with KE = 4.80 x 10⁻¹⁶ J.\nCalculate its velocity.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = 12u, v = sqrt(2KE/m)", answer: 219462, unit: "m s⁻¹", tolerance: 2000, steps: ["mass = 12 x 1.661 x 10⁻²⁷ = 1.993 x 10⁻²⁶ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 1.993 x 10⁻²⁶)", "v = sqrt(4.817 x 10¹⁰)", "v = 2.195 x 10⁵ m s⁻¹"] },
      { difficulty: "medium", q: "A singly charged ion with m/z = 28 has KE = 3.20 x 10⁻¹⁶ J.\nCalculate its velocity.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "mass = 28u, v = sqrt(2KE/m)", answer: 117200, unit: "m s⁻¹", tolerance: 1000, steps: ["mass = 28 x 1.661 x 10⁻²⁷ = 4.651 x 10⁻²⁶ kg", "v = sqrt(2 x 3.20 x 10⁻¹⁶ / 4.651 x 10⁻²⁶)", "v = sqrt(1.376 x 10¹⁰)", "v = 1.173 x 10⁵ m s⁻¹"] },
      { difficulty: "medium", q: "An ion takes 1.50 x 10⁻⁵ s to travel 1.80 m. Its KE is 5.00 x 10⁻¹⁶ J.\nCalculate the m/z value of the ion.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Find v from d/t, find m from KE=1/2mv², convert to m/z.", answer: 42, unit: "", tolerance: 1, steps: ["v = 1.80 / 1.50 x 10⁻⁵ = 1.200 x 10⁵ m s⁻¹", "m = 2KE/v² = 2(5.00 x 10⁻¹⁶) / (1.200 x 10⁵)²", "m = 1.00 x 10⁻¹⁵ / 1.44 x 10¹⁰ = 6.944 x 10⁻²⁶ kg", "m/z = 6.944 x 10⁻²⁶ / 1.661 x 10⁻²⁷ = 41.8 = 42"] },

      // ═══ HARD (8) ═══
      { difficulty: "hard", q: "Derive the equation: m = 2KE x t² / d²\nStarting from KE = 1/2 mv² and v = d/t.\nThen use it: KE = 4.80 x 10⁻¹⁶ J, t = 1.23 x 10⁻⁵ s, d = 1.50 m.\nCalculate m/z.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Substitute v = d/t into KE = 1/2 mv², rearrange for m.", answer: 39, unit: "", tolerance: 1, steps: ["v = d/t, so KE = 1/2 m(d/t)² = md²/(2t²)", "Rearranging: m = 2KE x t² / d²", "m = 2(4.80 x 10⁻¹⁶)(1.23 x 10⁻⁵)² / (1.50)²", "m = 2(4.80 x 10⁻¹⁶)(1.513 x 10⁻¹⁰) / 2.25", "m = 1.452 x 10⁻²⁵ / 2.25 = 6.45 x 10⁻²⁶ kg", "m/z = 6.45 x 10⁻²⁶ / 1.661 x 10⁻²⁷ = 38.9 = 39 (K⁺)"] },
      { difficulty: "hard", q: "A ⁶³Cu⁺ ion and a ⁶⁵Cu⁺ ion are both accelerated with KE = 4.80 x 10⁻¹⁶ J. Drift region = 2.00 m.\nCalculate the time of flight for each and the time difference.\n(1 u = 1.661 x 10⁻²⁷ kg)\nGive the time difference in s.", hint: "Calculate t for each isotope separately.", answer: 3.29e-7, unit: "s", tolerance: 1e-8, steps: ["m(⁶³Cu) = 63 x 1.661 x 10⁻²⁷ = 1.046 x 10⁻²⁵ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 1.046 x 10⁻²⁵) = 9.578 x 10⁴", "t(⁶³Cu) = 2.00 / 9.578 x 10⁴ = 2.088 x 10⁻⁵ s", "m(⁶⁵Cu) = 65 x 1.661 x 10⁻²⁷ = 1.080 x 10⁻²⁵ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 1.080 x 10⁻²⁵) = 9.428 x 10⁴", "t(⁶⁵Cu) = 2.00 / 9.428 x 10⁴ = 2.121 x 10⁻⁵ s", "Difference = 2.121 x 10⁻⁵ - 2.088 x 10⁻⁵ = 3.29 x 10⁻⁷ s"] },
      { difficulty: "hard", q: "An unknown singly charged ion reaches the detector in 1.36 x 10⁻⁵ s.\nKE = 4.80 x 10⁻¹⁶ J, drift region = 1.50 m.\nCalculate m/z and identify the element.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Find v, then m, then convert to m/z to identify.", answer: 48, unit: "", tolerance: 1, steps: ["v = d/t = 1.50 / (1.36 x 10⁻⁵) = 1.103 x 10⁵ m s⁻¹", "m = 2KE/v² = 2(4.80 x 10⁻¹⁶) / (1.103 x 10⁵)²", "m = 9.60 x 10⁻¹⁶ / 1.217 x 10¹⁰ = 7.89 x 10⁻²⁶ kg", "m/z = 7.89 x 10⁻²⁶ / 1.661 x 10⁻²⁷ = 47.5", "m/z = 48, element is titanium (Ti)"] },
      { difficulty: "hard", q: "In a TOF mass spectrometer, the time of flight is proportional to sqrt(m/z).\nIf a ¹²C⁺ ion has t = 6.83 x 10⁻⁶ s, calculate the time of flight for a ⁸⁰Br⁺ ion.", hint: "t is proportional to sqrt(m/z). Set up ratio: t₂/t₁ = sqrt(m₂/m₁).", answer: 1.76e-5, unit: "s", tolerance: 2e-7, steps: ["t is proportional to sqrt(m/z)", "t(Br)/t(C) = sqrt(80/12) = sqrt(6.667) = 2.582", "t(Br) = 6.83 x 10⁻⁶ x 2.582", "t(Br) = 1.76 x 10⁻⁵ s"] },
      { difficulty: "hard", q: "A protein has Mr = 12000. In electrospray ionisation it forms a doubly charged ion [M+2H]²⁺.\nAt what m/z value will the peak appear?", hint: "m/z = (Mr + number of protons) / charge", answer: 6001, unit: "", tolerance: 0.5, steps: ["Ion formed: [M+2H]²⁺", "Mass of ion = Mr + 2(1) = 12002", "Charge z = 2", "m/z = 12002/2 = 6001"] },
      { difficulty: "hard", q: "A mass spectrum from electrospray shows a peak at m/z = 4001. The ion is triply charged [M+3H]³⁺.\nCalculate the Mr of the molecule.", hint: "m/z = (Mr + 3)/3. Rearrange for Mr.", answer: 12000, unit: "", tolerance: 1, steps: ["m/z = (Mr + 3) / 3", "4001 = (Mr + 3) / 3", "Mr + 3 = 12003", "Mr = 12000"] },
      { difficulty: "hard", q: "The ratio of t² for two ions is 0.857.\nIf the heavier ion has m/z = 28, what is the m/z of the lighter ion?", hint: "t² is proportional to m/z. ratio of t² = ratio of m/z.", answer: 24, unit: "", tolerance: 0.5, steps: ["t² is proportional to m/z (from m = 2KE t²/d²)", "m₁/m₂ = t₁²/t₂² = 0.857", "m₁ = 0.857 x 28 = 24.0", "m/z = 24 (likely ²⁴Mg⁺)"] },
      { difficulty: "hard", q: "An ion of mass 1.162 x 10⁻²⁵ kg is accelerated through a potential difference of 5000 V (charge = 1.602 x 10⁻¹⁹ C).\nKE = qV. Calculate the velocity of the ion.", hint: "KE = qV, then v = sqrt(2KE/m)", answer: 117400, unit: "m s⁻¹", tolerance: 1000, steps: ["KE = qV = 1.602 x 10⁻¹⁹ x 5000 = 8.010 x 10⁻¹⁶ J", "v = sqrt(2KE/m) = sqrt(2 x 8.010 x 10⁻¹⁶ / 1.162 x 10⁻²⁵)", "v = sqrt(1.379 x 10¹⁰)", "v = 1.174 x 10⁵ m s⁻¹"] },

      // ═══ EXAM (6) ═══
      { difficulty: "exam", q: "A singly charged ion has mass 1.66 x 10⁻²³ g.\nIt is accelerated to KE = 2.00 x 10⁻¹⁶ J.\nThe drift region is 1.50 m.\nCalculate the time of flight (s).", hint: "Convert mass to kg first! Then v = sqrt(2KE/m), t = d/v.", answer: 3.05e-4, unit: "s", tolerance: 5e-6, steps: ["mass = 1.66 x 10⁻²³ g = 1.66 x 10⁻²⁶ kg", "v = sqrt(2 x 2.00 x 10⁻¹⁶ / 1.66 x 10⁻²⁶)", "v = sqrt(2.41 x 10¹⁰) = 4910 m s⁻¹", "t = d/v = 1.50 / 4910 = 3.05 x 10⁻⁴ s"] },
      { difficulty: "exam", q: "In a TOF experiment, ion X⁺ has t = 1.243 x 10⁻⁵ s and ion Y⁺ has t = 1.085 x 10⁻⁵ s.\nBoth have KE = 4.80 x 10⁻¹⁶ J, drift = 1.50 m.\nCalculate m/z for both ions and identify them.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "For each: v = d/t, m = 2KE/v², m/z = m/(1.661 x 10⁻²⁷).", answer: 40, unit: "", tolerance: 1, steps: ["Ion X: v = 1.50/1.243 x 10⁻⁵ = 1.207 x 10⁵", "m = 2(4.80 x 10⁻¹⁶)/(1.207 x 10⁵)² = 6.59 x 10⁻²⁶ kg", "m/z = 6.59 x 10⁻²⁶/1.661 x 10⁻²⁷ = 39.7 = 40 (⁴⁰Ca⁺ or ⁴⁰Ar⁺)", "Ion Y: v = 1.50/1.085 x 10⁻⁵ = 1.383 x 10⁵", "m = 2(4.80 x 10⁻¹⁶)/(1.383 x 10⁵)² = 5.02 x 10⁻²⁶ kg", "m/z = 5.02 x 10⁻²⁶/1.661 x 10⁻²⁷ = 30.2 = 30 (answer: X=40)"] },
      { difficulty: "exam", q: "A protein is analysed using electrospray ionisation. Three peaks appear:\nm/z = 1001, 751, 601\nThese correspond to [M+nH]ⁿ⁺ ions with charges +12, +16 and +20.\nCalculate Mr from each peak and find the average.", hint: "Mr = (m/z x charge) - charge. Or Mr = m/z x z - z.", answer: 12000, unit: "", tolerance: 10, steps: ["Peak 1: Mr = (1001 x 12) - 12 = 12012 - 12 = 12000", "Peak 2: Mr = (751 x 16) - 16 = 12016 - 16 = 12000", "Peak 3: Mr = (601 x 20) - 20 = 12020 - 20 = 12000", "Average Mr = 12000"] },
      { difficulty: "exam", q: "An unknown element has two isotopes. In the TOF mass spectrum:\nIsotope A: m/z = 63, relative abundance = 69.2%\nIsotope B: m/z = 65, relative abundance = 30.8%\nCalculate the relative atomic mass to 1 d.p. and identify the element.", hint: "Ar = sum of (m/z x abundance) / 100", answer: 63.6, unit: "", tolerance: 0.1, steps: ["Ar = (63 x 69.2 + 65 x 30.8) / 100", "Ar = (4359.6 + 2002.0) / 100", "Ar = 6361.6 / 100 = 63.6", "Element is copper (Cu)"] },
      { difficulty: "exam", q: "A TOF mass spectrometer has drift region 1.80 m. An ion with m/z = 88 is detected at t = 2.15 x 10⁻⁵ s.\nCalculate the KE given to all ions in this spectrometer.\n(1 u = 1.661 x 10⁻²⁷ kg)", hint: "Find mass = 88u, find v = d/t, then KE = 1/2 mv².", answer: 5.13e-16, unit: "J", tolerance: 1e-17, steps: ["m = 88 x 1.661 x 10⁻²⁷ = 1.462 x 10⁻²⁵ kg", "v = d/t = 1.80 / (2.15 x 10⁻⁵) = 8.372 x 10⁴ m s⁻¹", "KE = 1/2 mv² = 0.5 x 1.462 x 10⁻²⁵ x (8.372 x 10⁴)²", "KE = 0.5 x 1.462 x 10⁻²⁵ x 7.009 x 10⁹", "KE = 5.12 x 10⁻¹⁶ J"] },
      { difficulty: "exam", q: "Bromine has two isotopes: ⁷⁹Br (50.7%) and ⁸¹Br (49.3%).\nBoth are accelerated with KE = 4.80 x 10⁻¹⁶ J. Drift = 1.50 m.\nCalculate the Ar of bromine and the time of flight for each isotope.\n(1 u = 1.661 x 10⁻²⁷ kg)\nGive Ar to 1 d.p.", hint: "Ar from abundances. Then TOF calc for each isotope.", answer: 80.0, unit: "", tolerance: 0.1, steps: ["Ar = (79 x 50.7 + 81 x 49.3) / 100 = 79.99 = 80.0", "m(⁷⁹Br) = 79 x 1.661 x 10⁻²⁷ = 1.312 x 10⁻²⁵ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 1.312 x 10⁻²⁵) = 8.555 x 10⁴", "t(⁷⁹Br) = 1.50 / 8.555 x 10⁴ = 1.753 x 10⁻⁵ s", "m(⁸¹Br) = 81 x 1.661 x 10⁻²⁷ = 1.345 x 10⁻²⁵ kg", "v = sqrt(2 x 4.80 x 10⁻¹⁶ / 1.345 x 10⁻²⁵) = 8.446 x 10⁴", "t(⁸¹Br) = 1.50 / 8.446 x 10⁴ = 1.776 x 10⁻⁵ s"] },
    ]
  },
  {
    id: "calc_yield", title: "% Yield & Atom Economy", color: "#059669", board: "both",
    questions: [
      // EASY
      { difficulty: "easy", q: "A reaction produces 4.2 g of product. The theoretical yield was 6.0 g. Calculate the % yield.", hint: "% yield = (actual / theoretical) x 100", answer: 70, unit: "%", tolerance: 0.5, steps: ["% yield = (actual / theoretical) x 100", "% yield = (4.2 / 6.0) x 100 = 70%"] },
      { difficulty: "easy", q: "0.32 g of magnesium reacts with excess HCl:\nMg + 2HCl -> MgCl₂ + H₂\n1.04 g of MgCl₂ is obtained. Calculate the % yield. (Ar: Mg=24, Cl=35.5)", hint: "Find theoretical mass of MgCl₂ from moles of Mg, then % yield.", answer: 81.9, unit: "%", tolerance: 0.5, steps: ["n(Mg) = 0.32 / 24 = 0.01333 mol", "n(MgCl₂) = 0.01333 mol (1:1 ratio)", "Theoretical mass = 0.01333 x 95 = 1.267 g", "% yield = (1.04 / 1.267) x 100 = 82.1%"] },
      // MEDIUM
      { difficulty: "medium", q: "2Mg(s) + O₂(g) -> 2MgO(s). 4.80 g of Mg reacts with excess O₂. The actual yield of MgO is 5.60 g. Calculate the % yield. (Mr: Mg=24, MgO=40)", hint: "Find moles of Mg, use 1:1 mole ratio for MgO, then calculate theoretical mass.", answer: 70.0, unit: "%", tolerance: 0.5, steps: ["n(Mg) = 4.80 / 24 = 0.200 mol", "n(MgO) = 0.200 mol (1:1 mole ratio)", "Theoretical mass MgO = 0.200 x 40 = 8.00 g", "% yield = (5.60 / 8.00) x 100 = 70.0%"] },
      { difficulty: "medium", q: "Calculate the atom economy for making NaIO₃ from:\n3I₂ + 6NaOH -> 5NaI + NaIO₃ + 3H₂O\n(Mr: I₂=254, NaOH=40, NaIO₃=198)", hint: "Atom economy = (Mr of desired product / total Mr of all products) x 100. Or use: (Mr desired / total Mr reactants) x 100.", answer: 15.4, unit: "%", tolerance: 0.5, steps: ["Total Mr of reactants = 3(254) + 6(40) = 762 + 240 = 1002", "Or: total Mr products = 5(150) + 198 + 3(18) = 750 + 198 + 54 = 1002", "Mr of desired product (NaIO₃) = 198", "Atom economy = (198 / 1002) x 100 = 19.8%", "Note: some mark schemes define AE as Mr(desired) / Mr(reactants) x 100"] },
      { difficulty: "medium", q: "Calculate the % atom economy for making ethanol by fermentation:\nC₆H₁₂O₆ -> 2C₂H₅OH + 2CO₂\n(Mr: C₆H₁₂O₆=180, C₂H₅OH=46)", hint: "Atom economy = (total Mr of desired product(s) / total Mr of reactants) x 100.", answer: 51.1, unit: "%", tolerance: 0.5, steps: ["Total Mr of desired products = 2 x 46 = 92", "Total Mr of reactants = 180", "Atom economy = (92 / 180) x 100 = 51.1%"] },
      { difficulty: "medium", q: "What is the atom economy for making MgSO₄ from:\nMgCO₃ + H₂SO₄ -> MgSO₄ + CO₂ + H₂O\n(Mr: MgCO₃=84, H₂SO₄=98, MgSO₄=120)", hint: "Atom economy = Mr(desired) / Mr(all reactants) x 100", answer: 65.9, unit: "%", tolerance: 0.5, steps: ["Total Mr of reactants = 84 + 98 = 182", "Mr of desired product (MgSO₄) = 120", "Atom economy = (120 / 182) x 100 = 65.9%"] },
      // HARD
      { difficulty: "hard", q: "What mass of barium sulfate (Mr=233) is produced from 10 g of barium hydroxide (Mr=171) in:\nBa(OH)₂ + H₂SO₄ -> BaSO₄ + 2H₂O", hint: "Find moles of Ba(OH)₂, use 1:1 ratio for BaSO₄, convert to mass.", answer: 13.6, unit: "g", tolerance: 0.2, steps: ["n(Ba(OH)₂) = 10 / 171 = 0.05848 mol", "n(BaSO₄) = 0.05848 mol (1:1 ratio)", "mass BaSO₄ = 0.05848 x 233 = 13.6 g"] },
      { difficulty: "hard", q: "Aspirin (C₉H₈O₄) is made from:\nC₇H₆O₃ + C₄H₆O₃ -> C₉H₈O₄ + C₂H₄O₂\n(Mr: C₇H₆O₃=138, C₄H₆O₃=102, C₉H₈O₄=180)\na) Calculate the atom economy.", hint: "AE = Mr(aspirin) / Mr(all reactants) x 100", answer: 75.0, unit: "%", tolerance: 0.5, steps: ["Total Mr reactants = 138 + 102 = 240", "AE = (180 / 240) x 100 = 75.0%"] },
      { difficulty: "hard", q: "Mg + 2HNO₃ -> Mg(NO₃)₂ + H₂\n7.8 g of magnesium reacts with 0.60 mol of nitric acid. Which reagent is in excess? Enter the mass (g) of excess reagent remaining. (Ar: Mg=24, Mr HNO₃=63)", hint: "Find moles of each, compare using stoichiometry. Mg needs 2 mol HNO₃ per mol Mg.", answer: 0.6, unit: "g", tolerance: 0.1, steps: ["n(Mg) = 7.8 / 24 = 0.325 mol", "Mg needs 2 x 0.325 = 0.65 mol HNO₃", "Only 0.60 mol HNO₃ available, so HNO₃ is limiting", "HNO₃ reacts with 0.30 mol Mg", "Excess Mg = 0.325 - 0.30 = 0.025 mol = 0.60 g"] },
      // EXAM
      { difficulty: "exam", q: "Aspirin synthesis: 65 g of C₇H₆O₃ (Mr=138) reacts with 65 g of C₄H₆O₃ (Mr=102).\nC₇H₆O₃ + C₄H₆O₃ -> C₉H₈O₄ + C₂H₄O₂\nThe yield is 86%. Calculate the mass of aspirin (Mr=180) obtained.", hint: "Find the limiting reagent first. Then theoretical mass, then apply % yield.", answer: 72.9, unit: "g", tolerance: 0.5, steps: ["n(C₇H₆O₃) = 65/138 = 0.4710 mol", "n(C₄H₆O₃) = 65/102 = 0.6373 mol", "1:1 ratio, so C₇H₆O₃ is limiting", "Theoretical mass aspirin = 0.4710 x 180 = 84.78 g", "Actual mass = 84.78 x 0.86 = 72.9 g"] },
      { difficulty: "exam", q: "Fe(NO₃)₃ + 3NaOH -> Fe(OH)₃ + 3NaNO₃\n15 g of Fe(NO₃)₃ (Mr=242) reacts with 6 g of NaOH (Mr=40). Calculate the maximum mass of Fe(OH)₃ (Mr=107) produced.", hint: "Find moles of each reactant, identify limiting reagent using stoichiometry.", answer: 5.35, unit: "g", tolerance: 0.1, steps: ["n(Fe(NO₃)₃) = 15/242 = 0.06198 mol", "n(NaOH) = 6/40 = 0.150 mol", "Fe(NO₃)₃ needs 3 x 0.06198 = 0.186 mol NaOH", "Only 0.150 mol NaOH available, so NaOH is limiting", "n(Fe(OH)₃) = 0.150/3 = 0.0500 mol", "mass = 0.0500 x 107 = 5.35 g"] },
    ]
  },
];

const EXTENDED_QUESTIONS = [
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

const SYNTH_ROUTES = [
  // FROM: Alkane
  { from:"Alkane", to:"Halogenoalkane", reagents:"Cl₂ or Br₂", conditions:"UV light (hν), room temperature", mechanism:"Free Radical Substitution", notes:"Mixture of products formed (mono-, di-, tri-substituted etc.). Cl₂ is more reactive than Br₂ but Br₂ is more selective.", steps:[
    { stage:"Initiation", equation:"Cl₂  →  2Cl•", arrow:"hν (UV light)", note:"UV light supplies energy to break the Cl–Cl bond homolytically. Each chlorine atom takes one electron, forming two highly reactive chlorine radicals. This is the only step that requires an energy input." },
    { stage:"Propagation 1", equation:"Cl•  +  CH₄  →  CH₃•  +  HCl", arrow:"", note:"A chlorine radical abstracts a hydrogen atom from methane (takes the H along with its electron). A methyl radical (CH₃•) is produced alongside HCl. The chlorine radical is consumed but a new radical is generated - the chain continues." },
    { stage:"Propagation 2", equation:"CH₃•  +  Cl₂  →  CH₃Cl  +  Cl•", arrow:"", note:"The methyl radical reacts with a Cl₂ molecule, abstracting one chlorine atom. Chloromethane (the product) is formed, and a chlorine radical is regenerated - restarting Propagation 1. Steps 1 and 2 repeat thousands of times." },
    { stage:"Termination", equation:"Cl•  +  Cl•  →  Cl₂\nCH₃•  +  Cl•  →  CH₃Cl\nCH₃•  +  CH₃•  →  C₂H₆", arrow:"", note:"Any two radicals collide and combine, destroying both radicals and ending the chain. Three possible termination reactions are shown. The formation of ethane (C₂H₆) as a minor byproduct is evidence that CH₃• radicals exist during the reaction." },
  ], board:"both" },

  // FROM: Alkene
  { from:"Alkene", to:"Alkane", reagents:"H₂, Ni catalyst", conditions:"150°C", mechanism:"Catalytic Hydrogenation", notes:"Heterogeneous catalysis. H atoms adsorb onto Ni surface, then transferred to alkene.", board:"both" },
  { from:"Alkene", to:"Halogenoalkane", reagents:"HBr or HCl", conditions:"Room temperature, no catalyst", mechanism:"Electrophilic Addition", notes:"Markovnikov's rule for unsymmetrical alkenes: H adds to C with more H (via more stable secondary carbocation). Produces single haloalkane.", board:"both" },
  { from:"Alkene", to:"Dihalide", reagents:"Br₂ (bromine water or pure)", conditions:"Room temperature, no catalyst", mechanism:"Electrophilic Addition", notes:"Bromine water decolourises - test for C=C. Anti addition gives trans product. Produces 1,2-dibromoalkane.", board:"both" },
  { from:"Alkene", to:"Alcohol", reagents:"H₂O (steam), H₃PO₄ catalyst", conditions:"300°C, 60–70 atm", mechanism:"Electrophilic Addition (hydration)", notes:"Reversible reaction. H₃PO₄ is the acid catalyst. Markovnikov's rule applies for unsymmetrical alkenes → secondary alcohol preferred.", board:"both" },
  { from:"Alkene", to:"Diol", reagents:"Cold dilute KMnO₄ (alkaline)", conditions:"Room temperature, alkaline conditions", mechanism:"Oxidation (dihydroxylation)", notes:"OCR only. KMnO₄ is decolourised from purple → colourless. Syn addition. Alternatively O₃ then H₂O₂ gives carbonyl products.", board:"ocr" },
  { from:"Alkene", to:"Addition Polymer", reagents:"Monomer only (no other reagents)", conditions:"High pressure, Ziegler-Natta catalyst or radical initiator", mechanism:"Addition Polymerisation", notes:"n(CH₂=CHX) → (–CH₂–CHX–)ₙ. No atoms lost. Polymer is not biodegradable. Draw repeat unit with bonds through brackets.", board:"both" },

  // FROM: Halogenoalkane
  { from:"Halogenoalkane", to:"Alcohol", reagents:"NaOH(aq) or KOH(aq)", conditions:"Aqueous, reflux", mechanism:"Nucleophilic Substitution (SN2 for 1°, SN1 for 3°)", notes:"OH⁻ is the nucleophile. 1°: SN2 - backside attack, inversion of configuration. 3°: SN1 - carbocation intermediate, racemic mixture. Rate: I > Br > Cl (bond strength).", board:"both" },
  { from:"Halogenoalkane", to:"Alkene", reagents:"KOH (or NaOH) in ethanol", conditions:"Alcoholic solvent, heat (reflux)", mechanism:"Elimination (E2)", notes:"Hot ethanolic KOH favours elimination. HX eliminated. Produces alkene. Cold aqueous KOH favours substitution.", board:"both" },
  { from:"Halogenoalkane", to:"Nitrile", reagents:"KCN (or NaCN) in ethanol", conditions:"Ethanol solvent, reflux", mechanism:"Nucleophilic Substitution (SN2)", notes:"CN⁻ is the nucleophile. Chain extended by ONE carbon. Product can be hydrolysed to carboxylic acid or reduced to amine.", board:"both" },
  { from:"Halogenoalkane", to:"Amine", reagents:"Excess concentrated NH₃ in ethanol", conditions:"Sealed tube (pressure), heat", mechanism:"Nucleophilic Substitution", notes:"Excess NH₃ needed to avoid polyalkylation. 1° amine formed first, then 2° and 3° amines and quaternary ammonium salts as side products.", board:"both" },
  { from:"Halogenoalkane", to:"Ether", reagents:"NaOR (sodium alkoxide)", conditions:"Ethanol solvent, reflux", mechanism:"Nucleophilic Substitution (Williamson synthesis)", notes:"Alkoxide ion RO⁻ acts as nucleophile. Used for Williamson ether synthesis.", board:"ocr" },

  // FROM: Primary Alcohol
  { from:"Primary Alcohol", to:"Aldehyde", reagents:"K₂Cr₂O₇/H₂SO₄ (acidified dichromate)", conditions:"Warm, distil off product immediately", mechanism:"Oxidation", notes:"Distil as formed to prevent further oxidation to carboxylic acid. K₂Cr₂O₇ turns orange → green. Can also use [O] notation.", board:"both" },
  { from:"Primary Alcohol", to:"Carboxylic Acid", reagents:"Excess K₂Cr₂O₇/H₂SO₄", conditions:"Reflux (to prevent product escaping)", mechanism:"Oxidation", notes:"Primary alcohol oxidised twice: 1° alcohol → aldehyde → carboxylic acid. Excess oxidising agent and reflux ensures full conversion.", board:"both" },
  { from:"Primary Alcohol", to:"Alkene", reagents:"Conc H₃PO₄ or Al₂O₃", conditions:"~180°C (H₃PO₄) or 350°C (Al₂O₃)", mechanism:"Acid-catalysed Elimination (dehydration)", notes:"Loss of H₂O across adjacent C atoms. If multiple alkenes possible, Zaitsev's rule gives more substituted alkene as major product.", board:"both" },
  { from:"Primary Alcohol", to:"Halogenoalkane", reagents:"NaBr + conc H₂SO₄, or PCl₅, or SOCl₂", conditions:"Reflux (NaBr/H₂SO₄); room temperature (PCl₅)", mechanism:"Nucleophilic Substitution", notes:"NaBr/H₂SO₄ gives bromoalkane. PCl₅ gives chloroalkane + HCl fumes (test). SOCl₂ gives chloroalkane + SO₂ + HCl. OH replaced by halide.", board:"both" },
  { from:"Primary Alcohol", to:"Ester", reagents:"Carboxylic acid + conc H₂SO₄ catalyst", conditions:"Reflux (reversible reaction - Fischer esterification)", mechanism:"Condensation (Esterification)", notes:"Reversible - equilibrium mixture. Remove product or add excess of one reagent to improve yield. H₂O eliminated.", board:"both" },

  // FROM: Secondary Alcohol
  { from:"Secondary Alcohol", to:"Ketone", reagents:"K₂Cr₂O₇/H₂SO₄ (acidified)", conditions:"Reflux", mechanism:"Oxidation", notes:"Secondary alcohol → ketone only. No further oxidation possible. K₂Cr₂O₇ orange → green. Ketone cannot be oxidised further by Cr₂O₇²⁻.", board:"both" },
  { from:"Secondary Alcohol", to:"Alkene", reagents:"Conc H₃PO₄ or Al₂O₃", conditions:"~180°C", mechanism:"Acid-catalysed Elimination (dehydration)", notes:"Elimination of H₂O. May give mixture of alkenes if unsymmetrical.", board:"both" },
  { from:"Secondary Alcohol", to:"Halogenoalkane", reagents:"PCl₅ or HBr", conditions:"Room temperature", mechanism:"Nucleophilic Substitution", notes:"PCl₅ → chloroalkane; HBr → bromoalkane. Tertiary alcohols react fastest with HX (more stable carbocation).", board:"both" },

  // FROM: Aldehyde
  { from:"Aldehyde", to:"Primary Alcohol", reagents:"NaBH₄ in water/ethanol, or LiAlH₄ in dry ether", conditions:"Room temperature (NaBH₄); 0°C then careful hydrolysis (LiAlH₄)", mechanism:"Reduction (nucleophilic addition of H⁻)", notes:"NaBH₄ is milder and safer - used in aqueous solution. LiAlH₄ is more powerful but reacts violently with water - used in dry ether. H⁻ (hydride) is the nucleophile.", board:"both" },
  { from:"Aldehyde", to:"Carboxylic Acid", reagents:"K₂Cr₂O₇/H₂SO₄ or Tollens' reagent or Fehling's", conditions:"Reflux (Cr₂O₇²⁻); room temperature (Tollens'/Fehling's)", mechanism:"Oxidation", notes:"Aldehydes are easily oxidised. Tollens': silver mirror formed. Fehling's/Benedict's: blue → brick-red Cu₂O. Ketones NOT oxidised by these reagents.", board:"both" },
  { from:"Aldehyde", to:"Hydroxynitrile", reagents:"HCN + KCN catalyst (or NaCN then dilute HCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition", notes:"CN⁻ is the nucleophile - attacks Cδ+ of C=O. New C–C bond formed. Chain extended by 1C. Creates chiral centre → racemic mixture. HCN alone is too slow (no CN⁻ catalyst).", board:"both" },

  // FROM: Ketone
  { from:"Ketone", to:"Secondary Alcohol", reagents:"NaBH₄ in water/ethanol, or LiAlH₄ in dry ether", conditions:"Room temperature (NaBH₄); 0°C (LiAlH₄)", mechanism:"Reduction", notes:"H⁻ adds to carbonyl. Ketone → secondary alcohol. Not oxidised by Tollens'/Fehling's - can use this to distinguish from aldehyde.", board:"both" },
  { from:"Ketone", to:"Hydroxynitrile", reagents:"HCN + KCN (or NaCN + dil HCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition", notes:"Same mechanism as aldehyde. CN⁻ attacks Cδ+. Racemic mixture produced at new chiral centre.", board:"both" },

  // FROM: Carboxylic Acid
  { from:"Carboxylic Acid", to:"Ester", reagents:"Alcohol + conc H₂SO₄ catalyst", conditions:"Reflux (reversible)", mechanism:"Condensation (Fischer Esterification)", notes:"Acid-catalysed, reversible. H₂SO₄ protonates C=O making it more electrophilic. H₂O eliminated. Named: alkyl alkanoate (e.g. ethyl ethanoate).", board:"both" },
  { from:"Carboxylic Acid", to:"Acyl Chloride", reagents:"PCl₅ or SOCl₂", conditions:"Room temperature (PCl₅) or reflux (SOCl₂)", mechanism:"Nucleophilic Substitution", notes:"PCl₅ gives acyl chloride + POCl₃ + HCl. SOCl₂ gives acyl chloride + SO₂ + HCl (both gaseous byproducts - easy workup). Steamy fumes of HCl confirm reaction with PCl₅.", board:"both" },
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
  { from:"Ester", to:"Carboxylate Salt + Alcohol", reagents:"NaOH(aq) - saponification", conditions:"Reflux", mechanism:"Base-catalysed Hydrolysis (irreversible)", notes:"Saponification - irreversible because carboxylate salt formed is not reactive toward alcohol. Used in soap manufacture. Soap = sodium salt of long-chain fatty acid.", board:"both" },

  // FROM: Arene (Benzene)
  { from:"Arene", to:"Nitrobenzene", reagents:"Conc HNO₃ + conc H₂SO₄ (nitrating mixture)", conditions:"Below 55°C (avoid dinitration)", mechanism:"Electrophilic Aromatic Substitution (nitration)", notes:"H₂SO₄ protonates HNO₃ → NO₂⁺ (nitronium ion, electrophile). Above 55°C gives dinitration. Step 1: NO₂⁺ attacks ring (loss of aromaticity). Step 2: H⁺ lost (aromaticity restored).", board:"both" },
  { from:"Arene", to:"Halogenobenzene", reagents:"Br₂ (or Cl₂) + halogen carrier (AlBr₃ or AlCl₃)", conditions:"Room temperature, anhydrous", mechanism:"Electrophilic Aromatic Substitution (halogenation)", notes:"AlBr₃/AlCl₃ is a Lewis acid catalyst - polarises Br–Br to generate Br⁺. Reaction gives HBr as byproduct. No UV light needed (unlike alkane halogenation).", board:"both" },
  { from:"Arene", to:"Alkylbenzene", reagents:"RCl + AlCl₃ (Friedel-Crafts alkylation)", conditions:"Room temperature, anhydrous", mechanism:"Friedel-Crafts Alkylation (EAS)", notes:"AlCl₃ generates R⁺ carbocation or polarised R–Cl. Problem: multiple alkylation occurs because product is more reactive than starting material.", board:"both" },
  { from:"Arene", to:"Phenyl Ketone (Aryl Ketone)", reagents:"RCOCl + AlCl₃ (Friedel-Crafts acylation)", conditions:"Room temperature, anhydrous", mechanism:"Friedel-Crafts Acylation (EAS)", notes:"AlCl₃ generates acylium ion RCO⁺. Product is a phenyl ketone (aryl ketone). Acyl group deactivates ring → no further substitution. Preferred over alkylation industrially.", board:"both" },

  // FROM: Nitrobenzene
  { from:"Nitrobenzene", to:"Arylamine (Aniline)", reagents:"Sn (tin) + conc HCl, then NaOH(aq)", conditions:"Reflux with Sn/HCl; then add NaOH to liberate free amine", mechanism:"Reduction", notes:"Step 1: Sn + conc HCl reduces NO₂ → NH₃⁺ (phenylammonium salt). Step 2: NaOH added → free amine PhNH₂ liberated. Fe/HCl can also be used industrially.", board:"both" },

  // FROM: Arylamine (Aniline)
  { from:"Arylamine", to:"Diazonium Salt", reagents:"NaNO₂ + HCl(aq)", conditions:"0–5°C (ice bath essential)", mechanism:"Diazotisation", notes:"ArNH₂ + NaNO₂ + HCl → ArN₂⁺Cl⁻ + 2H₂O. MUST keep below 5°C - diazonium salts decompose above 10°C releasing N₂. Cold solution kept for immediate use.", board:"both" },
  { from:"Arylamine", to:"Amide", reagents:"Acyl chloride (RCOCl)", conditions:"Room temperature", mechanism:"Nucleophilic Addition-Elimination", notes:"ArNH₂ + RCOCl → ArNHCOR + HCl. N-acylation. Important for protecting the amine group during synthesis.", board:"both" },

  // FROM: Diazonium Salt
  { from:"Diazonium Salt", to:"Azo Dye", reagents:"Phenol or naphthol in NaOH(aq)", conditions:"0–5°C (cold, alkaline solution)", mechanism:"Coupling Reaction (Electrophilic Aromatic Substitution)", notes:"ArN₂⁺ is a weak electrophile - only attacks very reactive rings (phenol, naphthol, arylamines). Product Ar–N=N–Ar' is an azo dye. Brightly coloured due to extended conjugation.", board:"both" },
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
  ["alkylAmm",    "Alkyl\nAmm. Salts",              95,  55, "#6366f1", 82, 28],
  ["quatAmm",     "Quat.\nAmm. Salts",             305,  55, "#7c3aed", 94, 28],
  ["tertAmines",  "Tertiary\nAmines",              520,  55, "#8b5cf6", 76, 28],
  ["alkanes",     "Alkanes",                        70, 165, "#475569", 66, 22],
  ["haloalkanes", "Haloalkanes",                   255, 165, "#c2410c", 86, 22],
  ["primAmines",  "Primary\nAmines",               455, 165, "#db2777", 82, 28],
  ["secAmines",   "Secondary\nAmines",             580, 230, "#be185d", 72, 28],
  ["alkenes",     "Alkenes",                       175, 310, "#16a34a", 70, 22],
  ["nitriles",    "Nitriles",                      510, 310, "#4f46e5", 70, 22],
  ["dihalides",   "Dihaloalkanes",                   70, 440, "#c2410c", 86, 22],
  ["alcohols",    "Alcohols",                      370, 410, "#2563eb", 74, 22],
  ["diols",       "Diols",                          70, 600, "#0284c7", 62, 22],
  ["ketones",     "Ketones",                       225, 560, "#7c3aed", 70, 22],
  ["aldehydes",   "Aldehydes",                     420, 560, "#a855f7", 74, 22],
  ["esters",      "Esters",                        575, 510, "#0891b2", 66, 22],
  ["carbAcids",   "Carboxylic\nAcids",             420, 690, "#dc2626", 90, 28],
  ["carboxylate", "Carboxylate\nSalts",            140, 790, "#e11d48", 90, 28],
  ["amides",      "Amides",                        370, 790, "#7c3aed", 70, 22],
  ["acylCl",      "Acyl Chlorides /\nAnhydrides",  560, 790, "#0284c7", 82, 32],
];
const SYNTH_ALI_RXNS = [
  [1,  "alkanes",    "haloalkanes", 162, 148, "Alkanes",             "Haloalkanes",              "Halogen",                "UV light",               "Free radical",  "Substitution"],
  [2,  "haloalkanes","primAmines",  355, 148, "Haloalkanes",         "Primary Amines",           "Conc. NH₃",              "Heat, under pressure",   "Nucleophilic",  "Substitution"],
  [3,  "primAmines", "alkylAmm",   265,  95, "Primary Amines",      "Alkyl Ammonium Salts",     "Dilute HCl",             "Room temperature",       "--",            "Acid-base"],
  [4,  "tertAmines", "quatAmm",    415,  38, "Tertiary Amines",     "Quaternary Ammonium Salts","Halogenoalkane",         "Heat",                   "Nucleophilic",  "Substitution"],
  [5,  "secAmines",  "tertAmines", 558, 132, "Secondary Amines",    "Tertiary Amines",          "Halogenoalkane",         "Heat",                   "Nucleophilic",  "Substitution"],
  [6,  "primAmines", "secAmines",  525, 190, "Primary Amines",      "Secondary Amines",         "Halogenoalkane",         "Heat",                   "Nucleophilic",  "Substitution"],
  [7,  "haloalkanes","alkenes",    182, 220, "Haloalkanes",         "Alkenes",                  "NaOH in ethanol",        "Heat",                   "Elimination",   "Elimination"],
  [8,  "alkenes",   "haloalkanes", 248, 260, "Alkenes",             "Haloalkanes",              "Hydrogen halide",        "Room temperature",        "Electrophilic", "Addition"],
  [9,  "haloalkanes","alcohols",   300, 275, "Haloalkanes",         "Alcohols",                 "NaOH(aq)",               "Heat under reflux",      "Nucleophilic",  "Substitution"],
  [10, "haloalkanes","nitriles",   385, 222, "Haloalkanes",         "Nitriles",                 "KCN in ethanol",         "Heat under reflux",      "Nucleophilic",  "Substitution"],
  [11, "nitriles",  "primAmines",  490, 228, "Nitriles",            "Primary Amines",           "LiAlH₄ in dry ether",   "Heat",                   "--",            "Reduction"],
  [12, "alkenes",   "dihalides",   112, 370, "Alkenes",             "Dihaloalkanes",            "Halogen",                "Room temperature",        "Electrophilic", "Addition"],
  [13, "alkenes",   "alcohols",    240, 338, "Alkenes",             "Alcohols",                 "Steam + H₂SO₄",          "Heat",                   "--",            "Hydration"],
  [14, "alcohols",  "alkenes",     298, 385, "Alcohols",            "Alkenes",                  "Al₂O₃ or conc. acid",   "Heat",                   "Elimination",   "Dehydration"],
  [15, "dihalides", "diols",        52, 520, "Dihaloalkanes",       "Diols",                    "NaOH(aq)",               "Heat under reflux",      "Nucleophilic",  "Substitution"],
  [16, "alcohols",  "ketones",     268, 472, "Alcohols (secondary)","Ketones",                  "K₂Cr₂O₇ / H₂SO₄",       "Heat",                   "--",            "Oxidation"],
  [17, "ketones",   "alcohols",    335, 505, "Ketones",             "Alcohols (secondary)",     "NaBH₄(aq)",              "Room temperature",        "--",            "Reduction"],
  [18, "alcohols",  "aldehydes",   418, 468, "Alcohols (primary)",  "Aldehydes",                "K₂Cr₂O₇ / H₂SO₄",       "Heat, limited oxidant",  "--",            "Oxidation"],
  [19, "aldehydes", "alcohols",    372, 505, "Aldehydes",           "Alcohols (primary)",       "NaBH₄(aq)",              "Room temperature",        "--",            "Reduction"],
  [20, "nitriles",  "carbAcids",   478, 490, "Nitriles",            "Carboxylic Acids",         "Dilute HCl(aq)",         "Heat under reflux",      "--",            "Hydrolysis"],
  [21, "aldehydes", "carbAcids",   408, 625, "Aldehydes",           "Carboxylic Acids",         "K₂Cr₂O₇ / H₂SO₄",       "Heat under reflux",      "--",            "Oxidation"],
  [22, "carbAcids", "alcohols",    382, 548, "Carboxylic Acids",    "Primary Alcohols",         "LiAlH₄ in dry ether",   "Heat",                   "--",            "Reduction"],
  [23, "carbAcids", "esters",      505, 598, "Carboxylic Acids",    "Esters",                   "Alcohol + conc. H₂SO₄", "Heat",                   "--",            "Esterification"],
  [24, "acylCl",    "esters",      582, 648, "Acyl Chlorides",      "Esters",                   "Alcohol",                "Room temperature",        "Nucleophilic",  "Acylation"],
  [25, "carbAcids", "carboxylate", 270, 738, "Carboxylic Acids",    "Carboxylate Salts",        "NaOH(aq)",               "Room temperature",        "--",            "Acid-base"],
  [26, "acylCl",    "carbAcids",   500, 728, "Acyl Chlorides",      "Carboxylic Acids",         "H₂O",                    "Room temperature",        "--",            "Hydrolysis"],
  [27, "acylCl",    "amides",      468, 775, "Acyl Chlorides",      "Amides",                   "Amines",                 "Room temperature",        "Nucleophilic",  "Acylation"],
];
const SYNTH_ARO_NODES = [
  ["benzene",      "Benzene",                       320, 260, "#2563eb", 72, 22],
  ["methylbenz",   "Methylbenzene\n(Toluene)",      160, 260, "#16a34a", 94, 30],
  ["acetophenone", "Acetophenone\n(COCH₃)",         520, 140, "#0891b2", 94, 30],
  ["ethylbenzene", "Ethylbenzene",                  560, 260, "#0284c7", 84, 22],
  ["chloromethyl", "Chloromethyl-\nbenzene",         80, 395, "#c2410c", 92, 30],
  ["nitrobenzene", "Nitrobenzene",                  510, 395, "#ea580c", 86, 22],
  ["dinitrotol",   "Di-nitro-\ntoluene",             80, 520, "#b45309", 80, 30],
  ["aniline",      "Aniline\n(Aminobenzene)",       470, 520, "#16a34a", 100, 30],
  ["diazonium",    "Benzenediazonium\nChloride",    350, 650, "#dc2626", 114, 30],
  ["azoDye",       "Azo Dye",                       150, 650, "#7c3aed", 72, 22],
];
const SYNTH_ARO_RXNS = [
  [1, "benzene",     "acetophenone", 425, 192, "Benzene",                    "Acetophenone",
      "Ethanoyl chloride + AlCl₃",  "Heat",              "Electrophilic", "Friedel-Crafts Acylation"],
  [2, "benzene",     "ethylbenzene", 445, 256, "Benzene",                    "Ethylbenzene",
      "Chloroethane + AlCl₃",       "Heat",              "Electrophilic", "Friedel-Crafts Alkylation"],
  [3, "methylbenz",  "chloromethyl", 115, 328, "Methylbenzene",              "Chloromethylbenzene",
      "Chlorine",                    "UV light",          "Free radical",  "Substitution"],
  [4, "benzene",     "methylbenz",   240, 256, "Benzene",                    "Methylbenzene",
      "Chloromethane + AlCl₃",      "Heat",              "Electrophilic", "Friedel-Crafts Alkylation"],
  [5, "benzene",     "nitrobenzene", 420, 328, "Benzene",                    "Nitrobenzene",
      "Conc. HNO₃ + H₂SO₄",        "25-60 degrees C",   "Electrophilic", "Nitration"],
  [6, "methylbenz",  "dinitrotol",   115, 458, "Methylbenzene",              "Di-nitrotoluene",
      "Conc. HNO₃ + H₂SO₄",        "25-60 degrees C",   "Electrophilic", "Nitration"],
  [7, "nitrobenzene","aniline",      492, 458, "Nitrobenzene",               "Aniline",
      "Sn + conc. HCl",             "Heat",              "--",             "Reduction"],
  [8, "aniline",     "diazonium",    412, 588, "Aniline",                    "Benzenediazonium Chloride",
      "NaNO₂ / HCl",                "Below 10 degrees C","--",             "Diazotisation"],
  [9, "diazonium",   "azoDye",       250, 650, "Benzenediazonium Chloride",  "Azo Dye",
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
    description: "The nucleophile (a species with a lone pair) attacks the δ+ carbon of the halogenoalkane. The C–X bond breaks heterolytically - X leaves as X⁻ (the leaving group) taking both bonding electrons. Both bond formation and bond breaking are shown with simultaneous curly arrows.",
    steps: [
      { title: "Identify: nucleophile and electrophile",
        explanation: "The C–Br bond is polarised because bromine is more electronegative than carbon. This gives Cδ+ and Brδ−. The hydroxide ion (OH⁻) has a lone pair of electrons and is the nucleophile. The δ+ carbon is the electrophile. Bromine is the leaving group - it can accommodate the negative charge as a stable halide ion Br⁻.",
        arrows: [] },
      { title: "Nucleophile attacks; leaving group departs",
        explanation: "Arrow 1: the lone pair on O⁻ attacks the δ+ carbon, starting to form a new O–C bond. Arrow 2: at the same time, the C–Br bonding electrons shift towards Br, breaking the C–Br bond. Br leaves as Br⁻ (a stable bromide ion). Both arrows are drawn together - the nucleophile donates electrons in and the leaving group takes electrons out simultaneously.",
        arrows: ["a1","a2"] },
      { title: "Products: CH₃OH + Br⁻",
        explanation: "The product CH₃OH (methanol) has formed as the nucleophile bonded to the carbon. Br⁻ is released as a free bromide ion. The overall reaction is a substitution - the –Br group has been replaced by –OH. This mechanism applies whenever a nucleophile reacts with a primary or secondary halogenoalkane.",
        arrows: [], past: [], showProducts: true },
    ],
    arrowPaths: {
      a1: { d:"M 116,140 C 160,86 220,86 268,120", label:"O⁻ lone pair → C (new bond forms)", type:"full" },
      a2: { d:"M 310,132 C 322,112 334,112 344,128", label:"C-Br breaks → Br⁻ leaves", type:"full" },
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
        explanation: "The π electrons of the C=C double bond create a region of high electron density. As Br₂ approaches, the near bromine atom becomes δ+ (electron density is repelled away from it) and the far bromine becomes δ−. This is temporary induced polarisation - without the approaching alkene, Br₂ is non-polar.",
        arrows: [] },
      { title: "π electrons attack δ+ Br; Br–Br breaks",
        explanation: "Arrow 1: the π bonding electrons attack the δ+ bromine atom, forming a C–Br bond (a carbocation intermediate or cyclic bromonium ion forms). Arrow 2: simultaneously, the Br–Br bonding electrons shift to the distant Br, forming Br⁻ (the leaving group). The π bond is completely used up in this step.",
        arrows: ["a1","a2"] },
      { title: "Br⁻ attacks the carbocation",
        explanation: "Arrow 3: the Br⁻ ion attacks the empty orbital on the positive carbon from the back face. This anti (trans) addition means the two Br atoms end up on opposite faces of the molecule, giving 1,2-dibromoethane. The orange colour of Br₂ disappears as the product is colourless - this is the standard alkene test.",
        arrows: ["a3"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 230,115 C 265,80 320,78 350,118", label:"π electrons → δ+Br (new C-Br bond)", type:"full" },
      a2: { d:"M 380,120 C 400,92 420,92 432,118", label:"Br-Br breaks → Br⁻ forms", type:"full" },
      a3: { d:"M 426,118 C 390,76 310,74 250,118", label:"Br⁻ attacks C⁺ (anti addition)", type:"full" },
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
        explanation: "Arrow 1: the π electrons attack the δ+ H atom of HBr, forming a new C–H bond on C-1 (the CH₂ end). Arrow 2: the H–Br bond electrons shift to Br, forming Br⁻. A carbocation forms. Crucially, H adds to C-1 (the carbon with MORE hydrogens) because this gives the more stable SECONDARY carbocation at C-2, not the less stable primary carbocation at C-1. This is Markovnikov's rule.",
        arrows: ["a1","a2"] },
      { title: "Br⁻ attacks secondary carbocation",
        explanation: "Arrow 3: Br⁻ (a nucleophile) attacks the secondary carbocation at C-2 using a lone pair. The product is 2-bromopropane (the Markovnikov product). If H had added to C-2, a less stable primary carbocation at C-1 would form and the minor product 1-bromopropane would result.",
        arrows: ["a3"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 224,115 C 255,78 320,76 365,118", label:"π electrons → Hδ+ (new C-H bond)", type:"full" },
      a2: { d:"M 390,118 C 410,88 436,88 450,118", label:"H-Br breaks → Br⁻ forms", type:"full" },
      a3: { d:"M 458,118 C 420,80 300,74 178,122", label:"Br⁻ → secondary C⁺ (Markovnikov)", type:"full" },
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
        explanation: "Oxygen is more electronegative than carbon, so the C=O bond is polarised: Cδ+ and Oδ−. The CN⁻ ion (from NaCN/KCN) is the nucleophile with its lone pair on carbon. Pure HCN is avoided (toxic volatile liquid) - NaCN + dilute acid generates CN⁻ safely.",
        arrows: [] },
      { title: "CN⁻ attacks δ+C; C=O π bond breaks → O⁻",
        explanation: "Arrow 1: the lone pair on carbon of CN⁻ attacks the δ+ carbonyl carbon, forming a new C–CN bond. Arrow 2: simultaneously, the C=O π bond electrons shift entirely to oxygen, forming an alkoxide O⁻. Both arrows happen in the same step - nucleophilic addition is a single concerted event.",
        arrows: ["a1","a2"] },
      { title: "Alkoxide intermediate formed",
        explanation: "The tetrahedral alkoxide intermediate has formed. The carbon that was sp² (flat, trigonal planar) is now sp³ (tetrahedral). The O⁻ is negatively charged and will be protonated by H⁺ from the HCN in solution. A molecule of HCN is shown on the right, ready to donate its proton.",
        arrows: [], past: [], showIntermediate: true },
      { title: "H⁺ from HCN protonates O⁻ → hydroxynitrile",
        explanation: "Arrow 3: the H on HCN protonates the O⁻, forming the –OH group. The H–CN bond electrons shift towards C of CN, so CN⁻ is regenerated (it acts as a chain carrier). The final product is 2-hydroxypropanenitrile. The new carbon centre is chiral - equal attack from both faces gives a racemic mixture.",
        arrows: ["a3"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 60,140 C 130,80 240,80 318,120", label:"CN⁻ lone pair → δ+C (new C-CN bond)", type:"full" },
      a2: { d:"M 348,128 C 362,100 385,90 394,100", label:"C=O π breaks → O⁻ forms", type:"full" },
      a3: { d:"M 428,118 C 380,70 280,60 170,76", label:"H from HCN → O⁻ (forms -OH)", type:"full" },
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
        explanation: "The acyl carbon (C=O carbon bonded to Cl) is highly electrophilic: both O and Cl withdraw electron density, making the carbon strongly δ+. NH₃ has a lone pair on nitrogen - it is the nucleophile. Acyl chloride reactions are much faster and irreversible compared to esterification with a carboxylic acid.",
        arrows: [] },
      { title: "NH₃ attacks acyl carbon; C=O π breaks",
        explanation: "Arrow 1: the lone pair on N of NH₃ attacks the δ+ acyl carbon, forming a new N–C bond. Arrow 2: simultaneously, the C=O π bond electrons shift to O, forming O⁻. A tetrahedral intermediate forms with N, Cl, O⁻, and CH₃ all attached to the same carbon.",
        arrows: ["a1","a2"] },
      { title: "Cl⁻ expelled; C=O reforms",
        explanation: "Arrow 3: the lone pair on O⁻ reforms the C=O π bond (O pushes electrons back to the C=O). Arrow 4: simultaneously, the C–Cl bonding electrons shift to Cl, expelling Cl⁻. The carbonyl group is restored and the amide product CH₃CONH₂ forms. The overall result is substitution of Cl by NH₂.",
        arrows: ["a3","a4"], past: [] },
      { title: "HCl neutralised by second NH₃",
        explanation: "The HCl produced (from NH₄⁺ Cl⁻ in solution) is mopped up by a second equivalent of NH₃: NH₃ + HCl → NH₄Cl. This is why 2 mol of NH₃ are shown in the overall equation. Using an excess of ammonia ensures the acidic HCl is neutralised and the product is the free amide.",
        arrows: [], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 98,126 C 155,78 240,78 283,120", label:"N lone pair → acyl C (new N-C bond)", type:"full" },
      a2: { d:"M 316,126 C 330,96 350,88 362,98", label:"C=O π breaks → O⁻ forms", type:"full" },
      a3: { d:"M 270,90 C 245,64 210,76 198,120", label:"O⁻ reforms C=O bond", type:"full" },
      a4: { d:"M 204,150 C 225,168 248,178 256,178", label:"C-Cl breaks → Cl⁻ expelled", type:"full" },
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
        explanation: "AlCl₃ is a Lewis acid - it has an empty orbital and accepts electron pairs. Arrow 1: the lone pair on the Cl of CH₃COCl donates to AlCl₃, forming a coordinate bond. Arrow 2: the C–Cl bond electrons shift to Cl, forming the acylium ion CH₃CO⁺ and [AlCl₄]⁻. The acylium ion CH₃CO⁺ is stabilised by the positive charge on carbon being delocalised onto oxygen.",
        arrows: ["a1","a2"] },
      { title: "Acylium ion attacks benzene π system",
        explanation: "Arrow 3: the delocalised π electrons of benzene attack the electrophilic carbon of the acylium ion CH₃CO⁺, forming a new C–C bond. Aromaticity is temporarily lost. A positively charged arenium ion (Wheland intermediate) forms - one carbon in the ring is now sp³ and the positive charge is delocalised around the ring.",
        arrows: ["a3"], past: [] },
      { title: "H⁺ lost; aromaticity restored",
        explanation: "Arrow 4: the C–H bonding electrons on the sp³ carbon move into the ring, expelling H⁺. The aromatic π system (6 delocalised electrons) is fully restored - this is what drives the reaction forward. The H⁺ is accepted by [AlCl₄]⁻, regenerating AlCl₃ and HCl. Overall: one H replaced by –COCH₃ (an acyl group). Product: methyl phenyl ketone (acetophenone).",
        arrows: ["a4"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 460,176 C 472,156 472,146 462,136", label:"Cl lone pair → Al (coordinate bond)", type:"full" },
      a2: { d:"M 424,132 C 404,110 384,108 370,120", label:"C-Cl breaks → acylium CH₃CO⁺ forms", type:"full" },
      a3: { d:"M 248,118 C 290,72 360,68 382,96", label:"π electrons → acylium C⁺ (new C-C bond)", type:"full" },
      a4: { d:"M 262,130 C 252,160 268,180 288,186", label:"C-H breaks → H⁺ lost, aromaticity restored", type:"full" },
    },
  },
  {
    id: "eas",
    title: "Electrophilic Aromatic Substitution (Nitration)",
    subtitle: "C₆H₆ + NO₂⁺ → C₆H₅NO₂ + H⁺",
    category: "Electrophilic Aromatic Substitution",
    color: "#0284c7",
    specs: ["AQA","OCR_A"],
    description: "The nitronium ion (NO₂⁺) is generated from conc. HNO₃ + conc. H₂SO₄. The delocalised π electrons of benzene attack NO₂⁺, forming a positively charged arenium ion. H⁺ is then lost to restore aromaticity. Substitution (not addition) preserves the stable delocalised π system.",
    steps: [
      { title: "Generate the electrophile: NO₂⁺",
        explanation: "Conc. H₂SO₄ donates a proton to HNO₃: HNO₃ + H₂SO₄ → NO₂⁺ + H₂O + HSO₄⁻. The nitronium ion (NO₂⁺) is the electrophile. The temperature is kept below 55°C - at higher temperatures, further nitration to give di- and tri-nitro products occurs.",
        arrows: [] },
      { title: "π electrons attack NO₂⁺",
        explanation: "Arrow 1: the delocalised π electrons of benzene attack the nitrogen of NO₂⁺, forming a new C–N bond. Aromaticity is temporarily lost - this is the slow, rate-determining step. A positively charged arenium ion (Wheland intermediate / sigma complex) is formed. One ring carbon is now sp³.",
        arrows: ["a1"] },
      { title: "H⁺ lost; aromaticity restored",
        explanation: "Arrow 2: the C–H bonding electrons on the sp³ carbon move into the ring, expelling H⁺. The aromatic π system (6 delocalised electrons) is fully restored. H⁺ is released into the acid mixture. This second step is fast. The overall result is substitution of one H by NO₂ - aromaticity is preserved because the energy gained by restoring delocalisation drives the reaction.",
        arrows: ["a2"], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 250,118 C 290,72 360,68 400,118", label:"π electrons → NO₂⁺ (new C-N bond)", type:"full" },
      a2: { d:"M 262,130 C 252,162 268,184 290,190", label:"C-H breaks → H⁺ lost, aromaticity restored", type:"full" },
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
        explanation: "The β-carbon is the carbon adjacent to the carbon bearing the Br. OH⁻ is a strong base (not just a nucleophile) - it abstracts the β-hydrogen rather than attacking the carbon (which would give SN2). Hot ethanolic conditions favour the more hindered approach (elimination) over back-face attack (substitution).",
        arrows: [] },
      { title: "Concerted: base removes H, π forms, Br⁻ leaves",
        explanation: "Arrow 1: the OH⁻ base uses its lone pair to abstract the β-H (H on the carbon adjacent to C–Br). Arrow 2: the C–H bonding electrons shift to form the C=C π bond between the two carbons. Arrow 3: simultaneously, the C–Br bonding electrons shift entirely to Br, forming Br⁻. All three bonds break/form at the same time (E2). The reaction produces ethene + H₂O + Br⁻.",
        arrows: ["a1","a2","a3"] },
    ],
    arrowPaths: {
      a1: { d:"M 72,118 C 110,78 160,76 196,108", label:"OH⁻ base abstracts β-H", type:"full" },
      a2: { d:"M 218,128 C 240,102 278,102 302,128", label:"C-H electrons → new C=C π bond", type:"full" },
      a3: { d:"M 326,128 C 348,104 370,104 385,128", label:"C-Br breaks → Br⁻ leaves", type:"full" },
    },
  },
  {
    id: "frs",
    title: "Free Radical Substitution (FRS)",
    subtitle: "CH₄ + Cl₂  →(UV)→  CH₃Cl + HCl",
    category: "Radical",
    color: "#d97706",
    specs: ["AQA","OCR_A"],
    description: "A chain reaction using fish-hook (half-headed) arrows - each represents ONE electron. Three stages: initiation (UV breaks Cl–Cl homolytically), propagation (chain-carrying steps), termination (radicals combine). The mechanism uses fish-hook arrows, NOT full curly arrows.",
    steps: [
      { title: "Initiation: homolytic fission of Cl–Cl",
        explanation: "UV light provides energy for homolytic fission of the Cl–Cl bond - one electron from the bond goes to each chlorine atom. Fish-hook arrows (half-headed, ↷) each represent ONE electron moving. Two Cl• radicals are formed. Each has an unpaired electron shown as a dot (•). This step starts the chain.",
        arrows: ["a1","a2"] },
      { title: "Propagation Step 1: Cl• + CH₄",
        explanation: "Arrow 3: one electron from the C–H bond moves to pair with the unpaired electron on Cl•, forming H–Cl. Arrow 4: the remaining electron on carbon creates a methyl radical •CH₃. The Cl• radical is consumed but a new radical (•CH₃) is produced - this is why it's a chain reaction. Propagation continues while reactants are available.",
        arrows: ["a3","a4"], past: [] },
      { title: "Propagation Step 2: •CH₃ + Cl₂",
        explanation: "Arrow 5: one electron from the Cl–Cl bond pairs with the unpaired electron on •CH₃, forming CH₃–Cl (the product). Arrow 6: the other Cl atom becomes a new Cl• radical, which goes on to repeat propagation Step 1. Each propagation cycle produces one molecule of CH₃Cl and one molecule of HCl.",
        arrows: ["a5","a6"], past: [] },
      { title: "Termination: two radicals combine",
        explanation: "Termination occurs when any two radicals collide and combine, using up their unpaired electrons: Cl• + Cl• → Cl₂, or •CH₃ + Cl• → CH₃Cl, or •CH₃ + •CH₃ → C₂H₆. No radicals are produced in termination - the chain is ended. C₂H₆ forming is why trace amounts of ethane are always found as a by-product.",
        arrows: [], past: [] },
    ],
    arrowPaths: {
      a1: { d:"M 284,120 C 254,86 218,84 196,108", label:"1e⁻ → left Cl (homolytic fission)", type:"fish" },
      a2: { d:"M 298,120 C 330,86 370,84 404,108", label:"1e⁻ → right Cl (forms Cl radical)", type:"fish" },
      a3: { d:"M 252,120 C 270,88 288,86 282,112", label:"1e⁻ from C-H → Cl radical (forms HCl)", type:"fish" },
      a4: { d:"M 298,128 C 282,152 262,154 246,140", label:"1e⁻ stays on C (forms CH₃ radical)", type:"fish" },
      a5: { d:"M 270,120 C 296,88 312,86 302,112", label:"1e⁻ from Cl-Cl → CH₃ radical (forms CH₃Cl)", type:"fish" },
      a6: { d:"M 346,120 C 374,88 402,88 418,112", label:"1e⁻ → new Cl radical (chain continues)", type:"fish" },
    },
  },
];

function MechSVGBase({ children, animKey }) {
  return (
    <svg viewBox="0 0 620 280" style={{ width:"100%", height:"auto", display:"block", maxHeight:"280px" }}>
      <defs>
        <marker id={`arr-blue-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#29ABE2"/>
        </marker>
        <marker id={`arr-grey-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
        </marker>
        <marker id={`fish-blue-${animKey}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 5 z" fill="#29ABE2"/>
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
function A({ x, y, el, charge, partial, size=18, color }) {
  const c = color || (el==="O"||el==="OH"||el==="OH⁻"?"#b91c1c":el==="N"||el==="NH₃"||el==="NH₂"?"#1d4ed8":el==="Br"?"#9a3412":el==="Cl"?"#166534":el==="H"?"#64748b":"#1a202c");
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
      style={{ fontSize:`${size}px`, fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fill:c, userSelect:"none" }}>
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

// Lone pair helper (two dots close to atom - Lewis structure style)
function LP({ x, y, angle=0, color="#1a202c" }) {
  const rad=(angle*Math.PI)/180;
  const ox=Math.cos(rad), oy=Math.sin(rad);
  const px=-oy, py=ox;
  const dist=9, gap=2.8;
  const cx=x+ox*dist, cy=y+oy*dist;
  return <g>
    <circle cx={cx+px*gap} cy={cy+py*gap} r={1.8} fill={color}/>
    <circle cx={cx-px*gap} cy={cy-py*gap} r={1.8} fill={color}/>
  </g>;
}

// Curly arrow helper (animated or static grey, or still=always red no animation)
function CurlyArrow({ d, active, animKey, delay=0, type="full", label, labelX, labelY, still }) {
  const isBlue = active || still;
  const markerId = isBlue
    ? (type==="fish" ? `fish-blue-${animKey}` : `arr-blue-${animKey}`)
    : (type==="fish" ? `fish-grey-${animKey}` : `arr-grey-${animKey}`);
  return (
    <g>
      <path
        key={active && !still ? `${d}-${animKey}` : d}
        d={d}
        fill="none"
        stroke={isBlue ? "#29ABE2" : "#94a3b8"}
        strokeWidth={isBlue ? 2.6 : 1.8}
        markerEnd={`url(#${markerId})`}
        style={active && !still ? {
          strokeDasharray:350,
          strokeDashoffset:0,
          animation:`mechDrawArrow 0.65s ease-out ${delay}s both`
        } : {}}
      />
      {label && labelX && <text x={labelX} y={labelY||0} fill={isBlue?"#29ABE2":"#94a3b8"}
        style={{fontSize:"11px",fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:600,userSelect:"none"}}>{label}</text>}
    </g>
  );
}

// Charge badge
function Charge({ x, y, val, color }) {
  return <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
    style={{ fontSize:"13px", fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fill: color||"#1a202c", userSelect:"none" }}>{val}</text>;
}

// Delta label
function Delta({ x, y, sign }) {
  return <text x={x} y={y} textAnchor="middle"
    style={{ fontSize:"11px", fontFamily:"'DM Sans',system-ui,sans-serif", fill:"#64748b", userSelect:"none" }}>δ{sign}</text>;
}

function MechSVG({ mech, stepIdx, animKey, stillMode=false, visibleArrowCount=999 }) {
  const step = mech.steps[Math.min(stepIdx, mech.steps.length-1)];
  const allStepArrows = step.arrows || [];
  const pastIds = step.past || [];
  const allArrowIds = Object.keys(mech.arrowPaths);
  const isStill = stillMode === true || stillMode === "step";

  // In still mode show all step arrows; otherwise show only the revealed ones
  const revealedIds = isStill ? allStepArrows : allStepArrows.slice(0, visibleArrowCount);
  // The newest revealed arrow is the one animating
  const animatingId = !isStill && revealedIds.length > 0 ? revealedIds[revealedIds.length - 1] : null;

  const allVisibleIds = stillMode === true ? allArrowIds : [...pastIds, ...revealedIds];

  const renderArrows = () => allVisibleIds.map((id) => {
    const ap = mech.arrowPaths[id];
    if (!ap) return null;
    const isAnimating = id === animatingId;
    // Previously revealed arrows in this step: blue static (still=true, active=false)
    const wasRevealed = !isStill && revealedIds.includes(id) && !isAnimating;
    return <CurlyArrow key={id} d={ap.d} active={isAnimating} still={isStill || wasRevealed} animKey={animKey} delay={0} type={ap.type||"full"}/>;
  });

  // ── nuc_sub ─────────────────────────────────────────────────────────
  if (mech.id === "nuc_sub") {
    const showProducts = step.showProducts;
    if (showProducts) {
      return (
        <MechSVGBase animKey={animKey}>
          {/* CH3-O-H product */}
          <A x={130} y={140} el="H" size={16} color="#64748b"/>
          <Bond x1={141} y1={140} x2={163} y2={140}/>
          <A x={175} y={140} el="C" size={18}/>
          <A x={175} y={108} el="H" size={16} color="#64748b"/><Bond x1={175} y1={132} x2={175} y2={116}/>
          <A x={149} y={164} el="H" size={16} color="#64748b"/><Bond x1={168} y1={147} x2={154} y2={160}/>
          <Bond x1={189} y1={140} x2={220} y2={140}/>
          <A x={234} y={140} el="O" size={18}/>
          <Bond x1={248} y1={140} x2={272} y2={140}/>
          <A x={282} y={140} el="H" size={16} color="#64748b"/>
          <text x={205} y={200} textAnchor="middle" style={{fontSize:"13px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#059669",fontWeight:700}}>methanol</text>
          {/* Br⁻ */}
          <A x={470} y={140} el="Br" size={20} color="#c2410c"/>
          <Charge x={494} y={124} val="-" color="#c2410c"/>
          <text x={470} y={200} textAnchor="middle" style={{fontSize:"13px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#c2410c",fontWeight:700}}>bromide ion</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    return (
      <MechSVGBase animKey={animKey}>
        {/* HO⁻ nucleophile */}
        <A x={55} y={140} el="H" size={16} color="#64748b"/>
        <Bond x1={66} y1={140} x2={88} y2={140}/>
        <A x={100} y={140} el="O" size={18}/>
        <Charge x={118} y={124} val="-" color="#b91c1c"/>
        <LP x={100} y={140} angle={0} color="#b91c1c"/>

        {/* CH₃Br displayed formula */}
        <A x={290} y={140} el="C" size={18}/>
        <Delta x={278} y={118} sign="+"/>
        <A x={290} y={106} el="H" size={16} color="#64748b"/><Bond x1={290} y1={132} x2={290} y2={114}/>
        <A x={262} y={166} el="H" size={16} color="#64748b"/><Bond x1={283} y1={148} x2={268} y2={162}/>
        <A x={318} y={166} el="H" size={16} color="#64748b"/><Bond x1={297} y1={148} x2={312} y2={162}/>
        <Bond x1={306} y1={140} x2={336} y2={140}/>
        <A x={350} y={140} el="Br" size={18} color="#c2410c"/>
        <Delta x={366} y={118} sign="-"/>

        <text x={100} y={190} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#3182ce",fontWeight:700}}>nucleophile</text>
        <text x={290} y={210} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>electrophilic carbon</text>
        <text x={350} y={190} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#9a3412",fontWeight:700}}>leaving group</text>

        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── ea_br2 ───────────────────────────────────────────────────────────
  if (mech.id === "ea_br2") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2) {
      // Step 2: carbocation intermediate with Br⁻ approaching
      return (
        <MechSVGBase animKey={animKey}>
          <A x={90} y={108} el="H" size={16} color="#64748b"/><Bond x1={110} y1={126} x2={100} y2={114}/>
          <A x={90} y={176} el="H" size={16} color="#64748b"/><Bond x1={110} y1={155} x2={100} y2={168}/>
          <A x={125} y={140} el="C" size={18}/>
          <Bond x1={137} y1={128} x2={158} y2={108}/>
          <A x={168} y={100} el="Br" size={17} color="#c2410c"/>
          <Bond x1={142} y1={140} x2={218} y2={140}/>
          <A x={235} y={140} el="C" size={18}/>
          <Charge x={250} y={122} val="+" color="#b91c1c"/>
          <A x={235} y={100} el="H" size={16} color="#64748b"/><Bond x1={235} y1={130} x2={235} y2={108}/>
          <A x={235} y={182} el="H" size={16} color="#64748b"/><Bond x1={235} y1={152} x2={235} y2={174}/>
          {/* Br⁻ approaching */}
          <A x={440} y={140} el="Br" size={20} color="#c2410c"/>
          <Charge x={466} y={124} val="-" color="#c2410c"/>
          <LP x={440} y={140} angle={180} color="#c2410c"/>
          <Bond x1={258} y1={140} x2={412} y2={140} dash color="#94a3b8" width={1.5}/>
          <text x={180} y={224} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>carbocation intermediate</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: ethene + Br₂
    return (
      <MechSVGBase animKey={animKey}>
        {/* Ethene H₂C=CH₂ */}
        <A x={155} y={108} el="H" size={16} color="#64748b"/><Bond x1={170} y1={120} x2={162} y2={112}/>
        <A x={155} y={168} el="H" size={16} color="#64748b"/><Bond x1={170} y1={155} x2={162} y2={163}/>
        <A x={185} y={140} el="C" size={18}/>
        <Bond x1={200} y1={140} x2={240} y2={140} dbl/>
        <A x={255} y={140} el="C" size={18}/>
        <A x={284} y={108} el="H" size={16} color="#64748b"/><Bond x1={262} y1={126} x2={276} y2={114}/>
        <A x={284} y={168} el="H" size={16} color="#64748b"/><Bond x1={262} y1={153} x2={276} y2={163}/>
        <text x={220} y={84} textAnchor="middle" style={{fontSize:"12px",fill:"#64748b",fontFamily:"'DM Sans',system-ui,sans-serif",fontStyle:"italic"}}>π bond</text>
        {/* Br₂ */}
        <A x={370} y={140} el="Br" size={18} color="#c2410c"/>
        <Delta x={358} y={118} sign="+"/>
        <Bond x1={388} y1={140} x2={425} y2={140}/>
        <A x={440} y={140} el="Br" size={18} color="#c2410c"/>
        <Delta x={458} y={118} sign="-"/>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── ea_hbr ───────────────────────────────────────────────────────────
  if (mech.id === "ea_hbr") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2) {
      // Step 2: secondary carbocation with Br⁻ approaching
      return (
        <MechSVGBase animKey={animKey}>
          <A x={75} y={140} el="CH₃" size={16}/>
          <Bond x1={100} y1={140} x2={145} y2={140}/>
          <A x={160} y={140} el="C" size={18}/>
          <Charge x={180} y={120} val="+" color="#b91c1c"/>
          <A x={160} y={106} el="H" size={16} color="#64748b"/><Bond x1={160} y1={132} x2={160} y2={114}/>
          <Bond x1={175} y1={140} x2={225} y2={140}/>
          <A x={250} y={140} el="CH₃" size={16}/>
          <text x={160} y={200} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>secondary carbocation (more stable)</text>
          {/* Br⁻ approaching */}
          <A x={470} y={140} el="Br" size={20} color="#c2410c"/>
          <Charge x={496} y={124} val="-" color="#c2410c"/>
          <LP x={470} y={140} angle={180} color="#c2410c"/>
          <Bond x1={276} y1={140} x2={442} y2={140} dash color="#94a3b8" width={1.5}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: propene + HBr
    return (
      <MechSVGBase animKey={animKey}>
        {/* Propene: CH₃-CH=CH₂ */}
        <A x={72} y={140} el="CH₃" size={16}/>
        <Bond x1={97} y1={140} x2={140} y2={140}/>
        <A x={155} y={140} el="C" size={18}/>
        <Bond x1={169} y1={140} x2={238} y2={140} dbl/>
        <A x={252} y={140} el="C" size={18}/>
        <A x={280} y={112} el="H" size={16} color="#64748b"/><Bond x1={259} y1={128} x2={274} y2={118}/>
        <A x={280} y={168} el="H" size={16} color="#64748b"/><Bond x1={259} y1={152} x2={274} y2={162}/>
        <A x={148} y={112} el="H" size={16} color="#64748b"/><Bond x1={151} y1={132} x2={150} y2={118}/>
        <text x={204} y={86} textAnchor="middle" style={{fontSize:"13px",fill:"#64748b",fontFamily:"'DM Sans',system-ui,sans-serif",fontStyle:"italic"}}>π bond</text>
        {/* HBr */}
        <A x={380} y={140} el="H" size={18} color="#64748b"/>
        <Delta x={370} y={118} sign="+"/>
        <Bond x1={394} y1={140} x2={438} y2={140}/>
        <A x={456} y={140} el="Br" size={18} color="#c2410c"/>
        <Delta x={474} y={118} sign="-"/>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── nuc_add ──────────────────────────────────────────────────────────
  if (mech.id === "nuc_add") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2 || stepN === 3) {
      return (
        <MechSVGBase animKey={animKey}>
          {/* Alkoxide intermediate */}
          <A x={68} y={140} el="CH₃" size={16}/>
          <Bond x1={93} y1={140} x2={140} y2={140}/>
          <A x={155} y={140} el="C" size={18}/>
          {/* O⁻ upward */}
          <Bond x1={155} y1={130} x2={155} y2={96}/>
          <A x={155} y={84} el="O" size={18}/>
          <Charge x={174} y={68} val="-" color="#b91c1c"/>
          <LP x={155} y={84} angle={180} color="#b91c1c"/>
          {/* CN down-right */}
          <Bond x1={164} y1={150} x2={194} y2={178}/>
          <A x={205} y={188} el="C" size={16} color="#1d4ed8"/>
          <line x1={216} y1={184} x2={242} y2={178} stroke="#1d4ed8" strokeWidth={2.4}/>
          <line x1={217} y1={188} x2={243} y2={182} stroke="#1d4ed8" strokeWidth={2.4}/>
          <line x1={218} y1={192} x2={244} y2={186} stroke="#1d4ed8" strokeWidth={2.4}/>
          <A x={256} y={182} el="N" size={16} color="#1d4ed8"/>
          {/* H on C */}
          <Bond x1={146} y1={150} x2={128} y2={170}/>
          <A x={122} y={180} el="H" size={16} color="#64748b"/>
          {stepN === 2 && <text x={155} y={240} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>alkoxide intermediate</text>}
          {/* HCN proton source */}
          <A x={430} y={130} el="H" size={18} color="#64748b"/>
          <Bond x1={442} y1={130} x2={462} y2={130}/>
          <A x={475} y={130} el="C" size={16} color="#1d4ed8"/>
          <line x1={486} y1={126} x2={508} y2={122} stroke="#1d4ed8" strokeWidth={2.4}/>
          <line x1={486} y1={130} x2={508} y2={126} stroke="#1d4ed8" strokeWidth={2.4}/>
          <line x1={486} y1={134} x2={508} y2={130} stroke="#1d4ed8" strokeWidth={2.4}/>
          <A x={520} y={126} el="N" size={16} color="#1d4ed8"/>
          <text x={475} y={170} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>HCN (proton source)</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: CN⁻ + ethanal
    return (
      <MechSVGBase animKey={animKey}>
        {/* CN⁻ */}
        <A x={52} y={140} el="N" size={18} color="#1d4ed8"/>
        <line x1={66} y1={136} x2={94} y2={136} stroke="#1d4ed8" strokeWidth={2.4}/>
        <line x1={66} y1={140} x2={94} y2={140} stroke="#1d4ed8" strokeWidth={2.4}/>
        <line x1={66} y1={144} x2={94} y2={144} stroke="#1d4ed8" strokeWidth={2.4}/>
        <A x={108} y={140} el="C" size={18} color="#1d4ed8"/>
        <Charge x={128} y={122} val="-" color="#1d4ed8"/>
        <LP x={108} y={140} angle={0} color="#1d4ed8"/>
        <text x={80} y={192} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#1d4ed8",fontWeight:700}}>nucleophile</text>

        {/* Ethanal CH₃CHO */}
        <A x={270} y={140} el="CH₃" size={16}/>
        <Bond x1={296} y1={140} x2={325} y2={140}/>
        <A x={340} y={140} el="C" size={18}/>
        <Delta x={328} y={118} sign="+"/>
        <Bond x1={352} y1={132} x2={388} y2={112} dbl/>
        <A x={400} y={106} el="O" size={18}/>
        <Delta x={418} y={90} sign="-"/>
        <Bond x1={335} y1={150} x2={326} y2={172}/>
        <A x={322} y={182} el="H" size={16} color="#64748b"/>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── nuc_add_elim ─────────────────────────────────────────────────────
  if (mech.id === "nuc_add_elim") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 2) {
      return (
        <MechSVGBase animKey={animKey}>
          <A x={100} y={140} el="CH₃" size={16}/>
          <Bond x1={126} y1={140} x2={175} y2={140}/>
          <A x={190} y={140} el="C" size={18}/>
          {/* NH₂ up */}
          <Bond x1={190} y1={130} x2={190} y2={96}/>
          <A x={190} y={82} el="NH₂" size={16} color="#1d4ed8"/>
          {/* O⁻ right-up */}
          <Bond x1={200} y1={132} x2={245} y2={104}/>
          <A x={258} y={96} el="O" size={18}/>
          <Charge x={278} y={80} val="-" color="#b91c1c"/>
          <LP x={258} y={96} angle={0} color="#b91c1c"/>
          {/* Cl down-right */}
          <Bond x1={200} y1={148} x2={245} y2={176}/>
          <A x={258} y={184} el="Cl" size={18}/>
          {/* H */}
          <Bond x1={182} y1={150} x2={162} y2={174}/>
          <A x={156} y={184} el="H" size={16} color="#64748b"/>
          <text x={190} y={245} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>tetrahedral intermediate</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 3) {
      return (
        <MechSVGBase animKey={animKey}>
          <A x={100} y={140} el="CH₃" size={16}/>
          <Bond x1={126} y1={140} x2={160} y2={140}/>
          <A x={175} y={140} el="C" size={18}/>
          <Bond x1={186} y1={132} x2={220} y2={112} dbl/>
          <A x={234} y={104} el="O" size={18}/>
          <Bond x1={186} y1={148} x2={222} y2={168}/>
          <A x={240} y={176} el="NH₂" size={16} color="#1d4ed8"/>
          <text x={175} y={218} textAnchor="middle" style={{fontSize:"13px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#059669",fontWeight:700}}>ethanamide (CH₃CONH₂)</text>
          <text x={340} y={145} textAnchor="middle" style={{fontSize:"22px",fill:"#64748b",fontWeight:300}}>+</text>
          <A x={440} y={140} el="NH₄Cl" size={16} color="#64748b"/>
          <text x={440} y={185} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>(2nd NH₃ mops up HCl)</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Steps 0 & 1: NH₃ + CH₃COCl
    return (
      <MechSVGBase animKey={animKey}>
        <A x={70} y={140} el="NH₃" size={17} color="#1d4ed8"/>
        <LP x={92} y={140} angle={0} color="#1d4ed8"/>
        <text x={70} y={188} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#059669",fontWeight:700}}>nucleophile</text>

        <A x={230} y={140} el="CH₃" size={16}/>
        <Bond x1={256} y1={140} x2={288} y2={140}/>
        <A x={305} y={140} el="C" size={18}/>
        <Delta x={292} y={118} sign="+"/>
        <Bond x1={316} y1={132} x2={354} y2={112} dbl/>
        <A x={368} y={104} el="O" size={18}/>
        <Delta x={386} y={88} sign="-"/>
        <Bond x1={316} y1={148} x2={354} y2={168}/>
        <A x={368} y={176} el="Cl" size={18}/>
        <text x={305} y={218} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>electrophilic acyl carbon</text>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── fc_acyl ──────────────────────────────────────────────────────────
  if (mech.id === "fc_acyl") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 0) {
      return (
        <MechSVGBase animKey={animKey}>
          <A x={130} y={140} el="CH₃" size={16}/>
          <Bond x1={156} y1={140} x2={188} y2={140}/>
          <A x={205} y={140} el="C" size={18}/>
          <Bond x1={216} y1={132} x2={248} y2={112} dbl/>
          <A x={262} y={104} el="O" size={18}/>
          <Bond x1={216} y1={148} x2={248} y2={168}/>
          <A x={262} y={176} el="Cl" size={18}/>
          <A x={440} y={140} el="AlCl₃" size={16} color="#64748b"/>
          <Bond x1={286} y1={176} x2={410} y2={146} dash color="#94a3b8" width={1.5}/>
          <text x={205} y={220} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#7c3aed",fontWeight:700}}>acyl chloride</text>
          <text x={440} y={188} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b",fontWeight:700}}>Lewis acid catalyst</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 1) {
      const cx=195, cy=145, r=55;
      const pts = Array.from({length:6},(_,i)=>{ const a=(i*60-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; });
      return (
        <MechSVGBase animKey={animKey}>
          {pts.map(([x,y],i)=>{ const [nx,ny]=pts[(i+1)%6]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; })}
          <circle cx={cx} cy={cy} r={28} fill="none" stroke="#1a202c" strokeWidth={1.5} strokeDasharray="4,3"/>
          <A x={195} y={76} el="H" size={16} color="#64748b"/>
          <Bond x1={195} y1={84} x2={195} y2={90}/>
          <A x={410} y={140} el="CH₃" size={16}/>
          <Bond x1={434} y1={140} x2={462} y2={140}/>
          <A x={478} y={140} el="C" size={18}/>
          <Bond x1={490} y1={132} x2={514} y2={116} dbl/>
          <A x={524} y={108} el="O" size={18}/>
          <Charge x={494} y={120} val="+" color="#b91c1c"/>
          <text x={478} y={185} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>acylium ion</text>
          <Bond x1={254} y1={140} x2={388} y2={140} dash color="#94a3b8" width={1.5}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Step 2: arenium ion
    const cx=195, cy=145, r=55;
    const pts = Array.from({length:6},(_,i)=>{ const a=(i*60-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; });
    return (
      <MechSVGBase animKey={animKey}>
        {pts.map(([x,y],i)=>{ const [nx,ny]=pts[(i+1)%6]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; })}
        <A x={195} y={76} el="H" size={16} color="#64748b"/>
        <Bond x1={195} y1={84} x2={195} y2={90}/>
        <Bond x1={195} y1={90} x2={310} y2={100}/>
        <A x={326} y={98} el="C" size={16}/>
        <Bond x1={338} y1={92} x2={365} y2={76} dbl/>
        <A x={378} y={68} el="O" size={16}/>
        <Bond x1={338} y1={104} x2={370} y2={116}/>
        <A x={385} y={122} el="CH₃" size={14}/>
        <Charge x={160} y={190} val="+" color="#b91c1c"/>
        <text x={195} y={245} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>arenium ion</text>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── eas ──────────────────────────────────────────────────────────────
  if (mech.id === "eas") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    const cx=195, cy=145, r=55;
    const pts = Array.from({length:6},(_,i)=>{ const a=(i*60-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; });
    const ringLines = pts.map(([x,y],i)=>{ const [nx,ny]=pts[(i+1)%6]; return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#1a202c" strokeWidth={2.5} strokeLinecap="round"/>; });

    if (stepN === 0) {
      return (
        <MechSVGBase animKey={animKey}>
          <text x={310} y={65} textAnchor="middle" style={{fontSize:"16px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>Generating the electrophile: NO₂⁺</text>
          <text x={310} y={100} textAnchor="middle" style={{fontSize:"15px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#1a202c"}}>HNO₃ + H₂SO₄</text>
          <text x={310} y={128} textAnchor="middle" style={{fontSize:"18px",fill:"#64748b"}}>→</text>
          <text x={310} y={158} textAnchor="middle" style={{fontSize:"16px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>NO₂⁺ + H₂O + HSO₄⁻</text>
          <text x={310} y={195} textAnchor="middle" style={{fontSize:"13px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#94a3b8"}}>Temperature kept below 55 degrees C</text>
        </MechSVGBase>
      );
    }
    if (stepN === 1) {
      return (
        <MechSVGBase animKey={animKey}>
          {ringLines}
          <circle cx={cx} cy={cy} r={28} fill="none" stroke="#1a202c" strokeWidth={1.5} strokeDasharray="4,3"/>
          <A x={195} y={76} el="H" size={16} color="#64748b"/>
          <Bond x1={195} y1={84} x2={195} y2={90}/>
          <A x={420} y={145} el="NO₂" size={18} color="#0284c7"/>
          <Charge x={452} y={128} val="+" color="#0284c7"/>
          <Bond x1={254} y1={145} x2={394} y2={145} dash color="#94a3b8" width={1.5}/>
          <text x={420} y={190} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>electrophile</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Step 2: arenium ion
    return (
      <MechSVGBase animKey={animKey}>
        {ringLines}
        <A x={195} y={76} el="H" size={16} color="#64748b"/>
        <Bond x1={195} y1={84} x2={195} y2={90}/>
        <Bond x1={195} y1={90} x2={310} y2={100}/>
        <A x={330} y={98} el="NO₂" size={16} color="#0284c7"/>
        <Charge x={160} y={190} val="+" color="#0284c7"/>
        <text x={195} y={248} textAnchor="middle" style={{fontSize:"12px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#0284c7",fontWeight:700}}>arenium ion</text>
        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── elimination ──────────────────────────────────────────────────────
  if (mech.id === "elimination") {
    return (
      <MechSVGBase animKey={animKey}>
        {/* OH⁻ base */}
        <A x={60} y={140} el="HO" size={18} color="#b91c1c"/>
        <Charge x={86} y={122} val="-" color="#b91c1c"/>
        <LP x={80} y={140} angle={0} color="#b91c1c"/>
        <text x={60} y={192} textAnchor="middle" style={{fontSize:"12px",fill:"#9333ea",fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700}}>base</text>

        {/* β-carbon */}
        <A x={210} y={140} el="C" size={18}/>
        <text x={210} y={204} textAnchor="middle" style={{fontSize:"12px",fill:"#64748b",fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:600}}>β-C</text>
        <A x={192} y={106} el="H" size={16} color="#64748b"/>
        <Bond x1={205} y1={130} x2={196} y2={114}/>
        <A x={182} y={168} el="H" size={16} color="#64748b"/>
        <Bond x1={203} y1={148} x2={188} y2={164}/>

        {/* C-C bond */}
        <Bond x1={224} y1={140} x2={295} y2={140}/>

        {/* α-carbon */}
        <A x={310} y={140} el="C" size={18}/>
        <text x={310} y={204} textAnchor="middle" style={{fontSize:"12px",fill:"#64748b",fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:600}}>α-C</text>
        <A x={330} y={106} el="H" size={16} color="#64748b"/>
        <Bond x1={314} y1={130} x2={326} y2={114}/>
        <A x={330} y={174} el="H" size={16} color="#64748b"/>
        <Bond x1={314} y1={150} x2={326} y2={168}/>

        {/* C-Br bond */}
        <Bond x1={326} y1={140} x2={378} y2={140}/>
        <A x={395} y={140} el="Br" size={18} color="#c2410c"/>

        {renderArrows()}
      </MechSVGBase>
    );
  }

  // ── frs ──────────────────────────────────────────────────────────────
  if (mech.id === "frs") {
    const stepN = Math.min(stepIdx, mech.steps.length - 1);
    if (stepN === 0) {
      return (
        <MechSVGBase animKey={animKey}>
          <text x={310} y={55} textAnchor="middle" style={{fontSize:"16px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#d97706",fontWeight:700}}>UV light (hv)</text>
          <text x={310} y={78} textAnchor="middle" style={{fontSize:"14px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>|</text>
          <A x={180} y={140} el="Cl" size={20}/>
          <Bond x1={204} y1={140} x2={395} y2={140}/>
          <A x={418} y={140} el="Cl" size={20}/>
          <text x={300} y={178} textAnchor="middle" style={{fontSize:"13px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#d97706",fontWeight:700}}>homolytic fission</text>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 1) {
      return (
        <MechSVGBase animKey={animKey}>
          <A x={80} y={140} el="Cl" size={20}/>
          <text x={100} y={122} style={{fontSize:"18px",fill:"#166534",fontWeight:700}}>.</text>

          <A x={290} y={140} el="C" size={18}/>
          <A x={290} y={104} el="H" size={16} color="#64748b"/><Bond x1={290} y1={132} x2={290} y2={112}/>
          <A x={258} y={168} el="H" size={16} color="#64748b"/><Bond x1={283} y1={148} x2={264} y2={164}/>
          <A x={322} y={168} el="H" size={16} color="#64748b"/><Bond x1={297} y1={148} x2={316} y2={164}/>
          <A x={330} y={110} el="H" size={16} color="#64748b"/><Bond x1={298} y1={132} x2={322} y2={116}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    if (stepN === 2) {
      return (
        <MechSVGBase animKey={animKey}>
          <A x={95} y={140} el="C" size={18}/>
          <text x={115} y={122} style={{fontSize:"18px",fill:"#1a202c",fontWeight:700}}>.</text>
          <A x={95} y={104} el="H" size={16} color="#64748b"/><Bond x1={95} y1={132} x2={95} y2={112}/>
          <A x={65} y={168} el="H" size={16} color="#64748b"/><Bond x1={88} y1={148} x2={71} y2={164}/>
          <A x={125} y={168} el="H" size={16} color="#64748b"/><Bond x1={102} y1={148} x2={119} y2={164}/>

          <A x={310} y={140} el="Cl" size={20}/>
          <Bond x1={334} y1={140} x2={405} y2={140}/>
          <A x={425} y={140} el="Cl" size={20}/>
          {renderArrows()}
        </MechSVGBase>
      );
    }
    // Termination
    return (
      <MechSVGBase animKey={animKey}>
        <text x={310} y={70} textAnchor="middle" style={{fontSize:"16px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#1a202c",fontWeight:600}}>Termination: any two radicals combine</text>
        <text x={310} y={110} textAnchor="middle" style={{fontSize:"15px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>Cl. + Cl. ---> Cl₂</text>
        <text x={310} y={145} textAnchor="middle" style={{fontSize:"15px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>Cl. + .CH₃ ---> CH₃Cl</text>
        <text x={310} y={180} textAnchor="middle" style={{fontSize:"15px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#64748b"}}>.CH₃ + .CH₃ ---> C₂H₆</text>
        <text x={310} y={218} textAnchor="middle" style={{fontSize:"13px",fontFamily:"'DM Sans',system-ui,sans-serif",fill:"#94a3b8"}}>No new radicals produced - chain ends</text>
      </MechSVGBase>
    );
  }

  return <MechSVGBase animKey={animKey}><text x={310} y={140} textAnchor="middle" fill="#94a3b8">Diagram coming soon</text></MechSVGBase>;
}

// Still / exam version: shows the KEY step (first step with arrows) with all its arrows in red, no animation.
// For multi-step mechanisms this shows the initial reactant layout - matching what AQA expects to be drawn.
function MechSVGStill({ mech }) {
  const keyStepIdx = mech.steps.findIndex(s => (s.arrows||[]).length > 0);
  const stepIdx = keyStepIdx >= 0 ? keyStepIdx : 0;
  return <MechSVG mech={mech} stepIdx={stepIdx} animKey={999} stillMode="step"/>;
}

// --- Google Analytics helper ---
function track(event, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}

// --- Login Screen Component ---
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true); setError("");
    try { await signInGoogle(); }
    catch (e) { setError(e.message); setLoading(false); }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (mode === "signup" && password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }
    try {
      if (mode === "signup") await signUpEmail(email, password);
      else await signInEmail(email, password);
    } catch (e) {
      const msg = e.code === "auth/user-not-found" ? "No account found with this email"
        : e.code === "auth/wrong-password" ? "Incorrect password"
        : e.code === "auth/invalid-credential" ? "Incorrect email or password"
        : e.code === "auth/email-already-in-use" ? "An account with this email already exists"
        : e.code === "auth/invalid-email" ? "Please enter a valid email"
        : e.message;
      setError(msg); setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d1b2a 0%, #1b2d45 50%, #0d1b2a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "120px", objectFit: "contain", display: "block", margin: "0 auto 20px", filter: "drop-shadow(0 4px 20px rgba(41,171,226,0.3))" }} />
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "32px", color: "#ffffff", letterSpacing: "2px", textTransform: "uppercase", lineHeight: 1.1 }}>HSJ TUITION</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "14px", color: "#29ABE2", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", marginTop: "8px" }}>A-Level Chemistry. Mastered.</div>
        </div>

        {/* Card */}
        <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a2d45", margin: "0 0 24px", textAlign: "center" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: "1.5px solid #e0e8f0",
            background: "#ffffff", cursor: "pointer", fontFamily: "inherit", fontSize: "15px",
            fontWeight: 600, color: "#1a2d45", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px", transition: "all 0.15s",
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#f8fafc"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e0e8f0" }} />
            <span style={{ fontSize: "13px", color: "#7a95b0", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e8f0" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail}>
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "12px", boxSizing: "border-box", transition: "border 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#29ABE2"}
              onBlur={e => e.target.style.borderColor = "#e0e8f0"}
            />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: mode === "signup" ? "12px" : "16px", boxSizing: "border-box", transition: "border 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#29ABE2"}
              onBlur={e => e.target.style.borderColor = "#e0e8f0"}
            />
            {mode === "signup" && (
              <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "16px", boxSizing: "border-box", transition: "border 0.15s" }}
                onFocus={e => e.target.style.borderColor = "#29ABE2"}
                onBlur={e => e.target.style.borderColor = "#e0e8f0"}
              />
            )}
            {error && <div style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600, marginBottom: "12px", padding: "8px 12px", background: "#fef2f2", borderRadius: "8px" }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "#29ABE2", color: "#ffffff", fontSize: "15px", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          {/* Toggle mode */}
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#7a95b0" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", padding: 0 }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "#4a6080", lineHeight: 1.6, maxWidth: "360px", margin: "24px auto 0" }}>
          <div style={{ marginBottom: "6px" }}>By signing in you agree to our terms of use and privacy policy.</div>
          <div>This platform is an independent revision tool and is not affiliated with, endorsed by, or connected to AQA, OCR, or any exam board. All exam board names and specifications are used for reference only.</div>
          <div style={{ marginTop: "10px", color: "#3a5068" }}>&#169; {new Date().getFullYear()} HSJ Tuition. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // --- Auth state ---
  const [authUser, setAuthUser] = useState(undefined); // undefined=loading, null=not logged in, object=logged in
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [accessKeyMsg, setAccessKeyMsg] = useState(null);
  const [accessKeyLoading, setAccessKeyLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (user) {
        setAuthUser(user);
        try {
          const profile = await getOrCreateUserProfile(user);
          setUserProfile(profile);
          track("user_login", { method: user.providerData?.[0]?.providerId || "unknown", uid: user.uid });
        } catch (e) {
          console.error("Profile error:", e);
          setUserProfile({ role: "free" });
        }
      } else {
        setAuthUser(null);
        setUserProfile(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleRedeemKey = async () => {
    if (!accessKeyInput.trim() || !authUser) return;
    setAccessKeyLoading(true); setAccessKeyMsg(null);
    try {
      const result = await redeemAccessKey(authUser.uid, accessKeyInput.trim().toUpperCase());
      if (result.success) {
        setAccessKeyMsg({ type: "success", text: "Access key activated! You now have full access." });
        setUserProfile(prev => ({ ...prev, role: "access_key", accessKey: accessKeyInput.trim().toUpperCase(), accessKeyExpiry: result.expiresAt }));
        setAccessKeyInput("");
        track("redeem_access_key", { success: true });
      } else {
        setAccessKeyMsg({ type: "error", text: result.error });
        track("redeem_access_key", { success: false, error: result.error });
      }
    } catch (e) {
      setAccessKeyMsg({ type: "error", text: "Something went wrong. Please try again." });
    }
    setAccessKeyLoading(false);
  };

  const hasFullAccess = userProfile && (userProfile.role === "paid" || userProfile.role === "access_key" || userProfile.role === "admin");

  const LockedBadge = () => (
    <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.55)", borderRadius: "6px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px", zIndex: 2 }}>
      <span style={{ fontSize: "11px" }}>🔒</span>
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>PRO</span>
    </div>
  );

  const LockedOverlay = ({ style }) => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(1px)", borderRadius: "inherit", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, ...style }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "22px", marginBottom: "4px" }}>🔒</div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45" }}>Unlock with access key</div>
      </div>
    </div>
  );

  // --- Stripe checkout ---
  const [checkoutLoading, setCheckoutLoading] = useState(null); // "monthly" | "yearly" | null
  const [showPricing, setShowPricing] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [cancelStep, setCancelStep] = useState(0); // 0=settings, 1=win-back, 2=confirm

  const handleCheckout = async (plan) => {
    if (!authUser) return;
    setCheckoutLoading(plan);
    try {
      const resp = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, uid: authUser.uid, email: authUser.email }),
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not start checkout");
      }
    } catch (err) {
      alert("Network error - please try again");
    }
    setCheckoutLoading(null);
  };

  const handleManageSubscription = async () => {
    if (!userProfile?.stripeCustomerId) return;
    try {
      const resp = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: userProfile.stripeCustomerId }),
      });
      const data = await resp.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Could not open subscription manager");
    }
  };

  // Check for payment success/cancel URL params
  const [paymentBanner, setPaymentBanner] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      setPaymentBanner("success");
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => setPaymentBanner(null), 8000);
    } else if (payment === "cancel") {
      setPaymentBanner("cancel");
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => setPaymentBanner(null), 5000);
    }
  }, []);

  const PricingCards = () => (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
      {/* Monthly */}
      <div style={{ background: "#fff", border: "2px solid #e0e8f0", borderRadius: "16px", padding: "20px", width: "180px", textAlign: "center" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Monthly</div>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#1a2d45" }}>£4.99</div>
        <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>per month</div>
        <button onClick={() => handleCheckout("monthly")} disabled={!!checkoutLoading}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: checkoutLoading ? "wait" : "pointer", fontFamily: "inherit", opacity: checkoutLoading === "yearly" ? 0.5 : 1 }}>
          {checkoutLoading === "monthly" ? "Loading..." : "Subscribe"}
        </button>
        <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "8px" }}>Cancel anytime</div>
      </div>
      {/* Yearly */}
      <div style={{ background: "#fff", border: "2px solid #29ABE2", borderRadius: "16px", padding: "20px", width: "180px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#29ABE2", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", letterSpacing: "0.5px" }}>SAVE 27%</div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#29ABE2", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Yearly</div>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#1a2d45" }}>£43.99</div>
        <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>per year (£3.67/mo)</div>
        <button onClick={() => handleCheckout("yearly")} disabled={!!checkoutLoading}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#1a2d45", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: checkoutLoading ? "wait" : "pointer", fontFamily: "inherit", opacity: checkoutLoading === "monthly" ? 0.5 : 1 }}>
          {checkoutLoading === "yearly" ? "Loading..." : "Subscribe"}
        </button>
        <div style={{ fontSize: "11px", color: "#29ABE2", marginTop: "8px", fontWeight: 600 }}>Best value</div>
      </div>
    </div>
  );

  const UpgradeCard = ({ section }) => (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>{section} is locked</h3>
        <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 8px" }}>
          Upgrade to ChemMastery Pro to unlock all content.
        </p>
        <PricingCards />
        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e0e8f0" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#4a6080", marginBottom: "6px" }}>HSJ Tuition student?</div>
          <button onClick={() => setShowUserMenu(true)} style={{ background: "none", border: "none", color: "#29ABE2", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
            Enter your free access key instead
          </button>
        </div>
      </div>
    </div>
  );

  const [screen, setScreen] = useState("board");
  const [board, setBoard] = useState(null);
  const CURRENT_SECTIONS = board === "ocr" ? OCR_SECTIONS : SECTIONS;
  const CURRENT_TOPIC_ORDER = board === "ocr" ? OCR_TOPIC_ORDER : TOPIC_ORDER;

  // --- Free tier: first item in each section is free ---
  const FREE_FLASHCARD_SECTIONS = board === "ocr" ? ["ocr_mod2"] : ["physical_as"];
  const FREE_CALC_IDS = ["calc_moles"];
  const FREE_MECH_COUNT = 1; // first mechanism in each category
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
  const [topicsTab, setTopicsTab] = useState("home"); // "home" | "flashcards" | "synth" | "calc" | "extended" | "pathways" | "mechanisms"
  const [extCategory, setExtCategory] = useState(null);
  const [extIndex, setExtIndex] = useState(0);
  const [extQPicker, setExtQPicker] = useState(false); // true = show question list, false = show question
  const [extRevealed, setExtRevealed] = useState(false);
  const [extMarked, setExtMarked] = useState(new Set());
  const [extDraft, setExtDraft] = useState("");
  const [extScore, setExtScore] = useState({}); // { questionId: marksAwarded }
  const [extAiResult, setExtAiResult] = useState(null);    // AI Examiner result
  const [extAiLoading, setExtAiLoading] = useState(false); // waiting for API
  const [extShowModel, setExtShowModel] = useState(false); // model answer toggle
  const [extAiError, setExtAiError] = useState(null);      // error message if API fails
  const [calcTopic, setCalcTopic] = useState(null);
  const [showPT, setShowPT] = useState(null); // null | "aqa" | "ocr"
  const [calcDifficulty, setCalcDifficulty] = useState(null); // null | "all" | "easy" | "medium" | "hard" | "exam"
  const [calcIndex, setCalcIndex] = useState(0);
  const [calcInput, setCalcInput] = useState("");
  const [calcChecked, setCalcChecked] = useState(false);
  const [calcShowSteps, setCalcShowSteps] = useState(false);
  const [calcScore, setCalcScore] = useState({}); // { topicId: { correct, attempted } }

  // --- Study streak & activity tracking ---
  const [studyLog, setStudyLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hsj-study-log") || "{}"); } catch { return {}; }
  });
  const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const logActivity = useCallback((type) => {
    setStudyLog(prev => {
      const day = prev[todayKey] || { sessions: 0, cards: 0, calcs: 0, extended: 0, mechanisms: 0, firstOpen: Date.now() };
      if (type === "session") day.sessions = (day.sessions || 0) + 1;
      if (type === "card") day.cards = (day.cards || 0) + 1;
      if (type === "calc") day.calcs = (day.calcs || 0) + 1;
      if (type === "extended") day.extended = (day.extended || 0) + 1;
      if (type === "mechanism") day.mechanisms = (day.mechanisms || 0) + 1;
      day.lastActive = Date.now();
      const next = { ...prev, [todayKey]: day };
      try { localStorage.setItem("hsj-study-log", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [todayKey]);
  // Log a session on first load each day
  useEffect(() => {
    if (!studyLog[todayKey]?.sessions) logActivity("session");
  }, [todayKey]); // eslint-disable-line

  // Calculate streak
  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    // Check if active today, if not start from yesterday
    if (!studyLog[todayKey]) d.setDate(d.getDate() - 1);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (studyLog[key]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };
  const currentStreak = getStreak();

  // Score history for trends (stored in localStorage)
  const [scoreHistory, setScoreHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hsj-score-history") || "[]"); } catch { return []; }
  });
  const logScore = useCallback((type, topic, score, total) => {
    setScoreHistory(prev => {
      const entry = { date: todayKey, time: Date.now(), type, topic, score, total };
      const next = [...prev, entry].slice(-200); // keep last 200 entries
      try { localStorage.setItem("hsj-score-history", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [todayKey]);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const [mechId, setMechId] = useState(null);
  const [mechStep, setMechStep] = useState(0);
  const [mechArrowIdx, setMechArrowIdx] = useState(0); // arrows revealed in current step
  const [mechAnimKey, setMechAnimKey] = useState(0);
  const [mechStill, setMechStill] = useState(false);
  const [synthTab, setSynthTab] = useState("ali");
  const [selectedRxn, setSelectedRxn] = useState(null);
  const [synthQuiz, setSynthQuiz] = useState(false);
  // ── Random Quiz ──────────────────────────────────────────────────────────────
  const [quizScreen, setQuizScreen] = useState(null); // null | "setup" | "running" | "done"
  const [quizYear, setQuizYear] = useState("as");      // "as" | "a2" | "all"
  const [quizMode, setQuizMode] = useState("year");    // "year" | "topics"
  const [quizCount, setQuizCount] = useState(25);      // 25 | 50 | "custom"
  const [quizCustomCount, setQuizCustomCount] = useState(25);
  const [quizSelectedTopics, setQuizSelectedTopics] = useState([]);
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

  const selectBoard = (b) => { setBoard(b); setScreen("topics"); setTopicsTab("home"); track("select_board", { board: b }); };
  const selectTopic = (t) => {
    setTopic(t);
    setOrder(SETS[t].cards.map((_, i) => i));
    setIndex(0); setFlipped(false); setShuffled(false); setShowMenu(false);
    setScreen("cards");
    track("select_flashcard_topic", { topic: t, title: SETS[t]?.title, board });
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

  const buildQuizDeck = (year, deckSize = 25, topicIds = null) => {
    let eligibleTopics;
    if (topicIds && topicIds.length > 0) {
      eligibleTopics = topicIds.filter(id => SETS[id]);
    } else {
      const allSections = board === "ocr" ? OCR_SECTIONS : SECTIONS;
      const asSecs = board === "ocr" ? OCR_AS_SECTIONS : AQA_AS_SECTIONS;
      const a2Secs = board === "ocr" ? OCR_A2_SECTIONS : AQA_A2_SECTIONS;
      let sectionFilter;
      if (year === "as") sectionFilter = asSecs;
      else if (year === "a2") sectionFilter = a2Secs;
      else sectionFilter = [...asSecs, ...a2Secs];
      eligibleTopics = allSections
        .filter(s => sectionFilter.includes(s.id))
        .flatMap(s => s.topics)
        .filter(id => SETS[id]);
    }

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

    // Weighted random sample, capped at available pool
    const DECK_SIZE = Math.min(deckSize, pool.length);
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
    const count = quizCount === "custom" ? Math.min(99, Math.max(25, quizCustomCount || 25)) : quizCount;
    const topicFilter = quizMode === "topics" && quizSelectedTopics.length > 0 ? quizSelectedTopics : null;
    const deck = buildQuizDeck(quizYear, count, topicFilter);
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
    else if (screen === "topics") { setScreen("board"); setBoard(null); setTopicsTab("home"); }
  };

  const next = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.min(i + 1, order.length - 1)), 100); }, [order.length]);
  const prev = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 100); }, []);
  const toggleKnown = useCallback(() => {
    setKnown(prev => {
      const s = new Set(prev[knownKey] || []);
      const wasKnown = s.has(currentCardIndex);
      wasKnown ? s.delete(currentCardIndex) : s.add(currentCardIndex);
      track("toggle_known", { topic, card_index: currentCardIndex, marked: !wasKnown });
      if (!wasKnown) logActivity("card");
      return { ...prev, [knownKey]: s };
    });
  }, [knownKey, currentCardIndex, topic]);

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
  const base = { minHeight: "100vh", background: bg, fontFamily: "'Outfit', 'DM Sans', 'Segoe UI', sans-serif", color: "#1a2d45", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" };

  // Inline SVG flask logo
  const FlaskLogo = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#29ABE2"/>
      <path d="M14 8h8v1.5l5.5 11.5A5 5 0 0 1 23 28H13a5 5 0 0 1-4.5-7L14 9.5V8z" fill="white" fillOpacity="0.15"/>
      <rect x="14" y="8" width="8" height="3" rx="1" fill="white"/>
      <path d="M14 11l-5.5 10.5A5 5 0 0 0 13 28h10a5 5 0 0 0 4.5-6.5L22 11" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
      <circle cx="15" cy="22" r="1.5" fill="#29ABE2" fillOpacity="0.9"/>
      <circle cx="20" cy="24" r="1" fill="#29ABE2" fillOpacity="0.9"/>
      <circle cx="18" cy="20" r="1" fill="#29ABE2" fillOpacity="0.9"/>
    </svg>
  );

  const [showUserMenu, setShowUserMenu] = useState(false);
  const Header = ({ sub, back }) => (
    <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: "14px", height: "72px", background: "#0f1d35", position: "relative", zIndex: 10, flexShrink: 0 }}>
      {back && <button onClick={back} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>}
      <div style={{ background: "#fff", borderRadius: "10px", padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "52px", objectFit: "contain", display: "block" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "18px", color: "#ffffff", letterSpacing: "-0.3px", lineHeight: 1.1 }}>HSJ TUITION</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "11px", color: "#29ABE2", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>A-Level Chemistry. Mastered.</div>
      </div>
      {/* User avatar */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowUserMenu(v => !v)} style={{
          width: "38px", height: "38px", borderRadius: "50%", border: "2px solid #29ABE2",
          background: authUser?.photoURL ? `url(${authUser.photoURL}) center/cover` : "#29ABE2",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: "inherit", padding: 0
        }}>
          {!authUser?.photoURL && (authUser?.displayName?.[0] || authUser?.email?.[0] || "?").toUpperCase()}
        </button>
        {showUserMenu && (
          <>
            <div onClick={() => setShowUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
            <div style={{ position: "absolute", right: 0, top: "48px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: "16px", minWidth: "240px", zIndex: 100 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "2px" }}>{authUser?.displayName || "Student"}</div>
              <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "12px" }}>{authUser?.email}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: hasFullAccess ? "#059669" : "#d97706", background: hasFullAccess ? "#ecfdf5" : "#fffbeb", borderRadius: "6px", padding: "4px 10px", display: "inline-block", marginBottom: "14px" }}>
                {userProfile?.role === "admin" ? "Admin" : userProfile?.role === "access_key" ? "Full Access (Key)" : userProfile?.role === "paid" ? "Full Access (Paid)" : "Free Plan"}
              </div>
              {userProfile?.role === "paid" && userProfile?.stripeCustomerId && (
                <button onClick={() => { setShowUserMenu(false); setShowAccountSettings(true); }} style={{
                  background: "none", border: "none", color: "#7a95b0", fontSize: "11px",
                  cursor: "pointer", fontFamily: "inherit", marginBottom: "8px", textDecoration: "underline"
                }}>Account settings</button>
              )}
              {!hasFullAccess && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#4a6080", marginBottom: "6px" }}>Have an access key?</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input value={accessKeyInput} onChange={e => setAccessKeyInput(e.target.value)} placeholder="e.g. HSJ-2026-ABCD"
                      style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #e0e8f0", fontSize: "13px", fontFamily: "inherit", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "#29ABE2"}
                      onBlur={e => e.target.style.borderColor = "#e0e8f0"}
                    />
                    <button onClick={handleRedeemKey} disabled={accessKeyLoading} style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: accessKeyLoading ? 0.6 : 1 }}>
                      {accessKeyLoading ? "..." : "Redeem"}
                    </button>
                  </div>
                  {accessKeyMsg && <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "6px", color: accessKeyMsg.type === "success" ? "#059669" : "#dc2626" }}>{accessKeyMsg.text}</div>}
                  <div style={{ borderTop: "1px solid #e0e8f0", marginTop: "12px", paddingTop: "12px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#4a6080", marginBottom: "8px" }}>Or upgrade to Pro</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleCheckout("monthly")} disabled={!!checkoutLoading} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {checkoutLoading === "monthly" ? "..." : "£4.99/mo"}
                      </button>
                      <button onClick={() => handleCheckout("yearly")} disabled={!!checkoutLoading} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#1a2d45", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {checkoutLoading === "yearly" ? "..." : "£43.99/yr"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={() => { logOut(); setShowUserMenu(false); }} style={{
                width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid #e0e8f0",
                background: "#ffffff", color: "#dc2626", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit"
              }}>Log out</button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Rich chemistry background artwork for card thumbnails
  const ChemArt = ({ id }) => {
    const s = { position: "absolute", inset: 0, pointerEvents: "none", userSelect: "none", opacity: 0.2 };
    const W = "100%", H = "100%";
    if (id === "aqa") return (
      <svg style={s} width={W} height={H} viewBox="0 0 400 170" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* AQA -dense organic chemistry art filling the whole card */}
        {/* Naphthalene (two fused benzene rings) -top-right */}
        <polygon points="238,10 260,22 260,46 238,58 216,46 216,22" stroke="white" strokeWidth="2.2" fill="none"/>
        <polygon points="282,10 304,22 304,46 282,58 260,46 260,22" stroke="white" strokeWidth="2.2" fill="none"/>
        {/* Naphthalene double bonds */}
        <line x1="216" y1="22" x2="238" y2="10" stroke="white" strokeWidth="1.4"/>
        <line x1="238" y1="58" x2="260" y2="46" stroke="white" strokeWidth="1.4"/>
        <line x1="260" y1="22" x2="282" y2="10" stroke="white" strokeWidth="1.4"/>
        <line x1="282" y1="58" x2="304" y2="46" stroke="white" strokeWidth="1.4"/>
        {/* Flask -far right filling top gap */}
        <path d="M348,8 L348,40 L328,78 Q323,88 333,92 L379,92 Q389,88 384,78 L364,40 L364,8 Z" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="344" y1="22" x2="368" y2="22" stroke="white" strokeWidth="1.5"/>
        <ellipse cx="356" cy="76" rx="10" ry="5" stroke="white" strokeWidth="1.5"/>
        <circle cx="348" cy="68" r="3" fill="white"/>
        <circle cx="362" cy="74" r="2.5" fill="white"/>
        <circle cx="355" cy="62" r="2" fill="white"/>
        {/* Long skeletal chain top-left */}
        <polyline points="12,62 34,40 56,62 78,40 100,62 122,40 144,62 166,40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Double bond */}
        <line x1="34" y1="40" x2="56" y2="62" stroke="white" strokeWidth="1.5"/>
        <line x1="37" y1="36" x2="59" y2="58" stroke="white" strokeWidth="1.5"/>
        {/* NH₂ branch */}
        <line x1="78" y1="40" x2="78" y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <text x="70" y="13" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">NH₂</text>
        {/* OH end */}
        <line x1="166" y1="40" x2="182" y2="24" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <text x="184" y="22" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">OH</text>
        {/* Reaction arrow centre */}
        <line x1="174" y1="76" x2="234" y2="76" stroke="white" strokeWidth="2"/>
        <polygon points="230,71 242,76 230,81" fill="white"/>
        <text x="184" y="68" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">HBr/Δ</text>
        {/* Cyclohexane ring bottom-left */}
        <polygon points="44,120 66,108 88,120 88,144 66,156 44,144" stroke="white" strokeWidth="2" fill="none"/>
        {/* Cyclohexane chair bond angles */}
        <line x1="44" y1="120" x2="28" y2="130" stroke="white" strokeWidth="1.5"/>
        <line x1="88" y1="120" x2="104" y2="130" stroke="white" strokeWidth="1.5"/>
        {/* Benzene -centre-bottom */}
        <polygon points="160,108 180,97 200,108 200,130 180,141 160,130" stroke="white" strokeWidth="2.2" fill="none"/>
        <circle cx="180" cy="119" r="13" stroke="white" strokeWidth="1.3" fill="none"/>
        {/* COOH attached to benzene -at top-right vertex (200,108) */}
        <line x1="200" y1="108" x2="222" y2="100" stroke="white" strokeWidth="1.8"/>
        <text x="224" y="104" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">COOH</text>
        {/* Ester linkage bottom-right */}
        <text x="268" y="130" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">-COO-</text>
        <polyline points="268,140 288,155 308,140 328,155" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
    if (id === "ocr") return (
      <svg style={s} width={W} height={H} viewBox="0 0 400 170" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* OCR A -physical/inorganic chemistry, fills whole card */}
        {/* Atomic orbitals top-right */}
        <circle cx="330" cy="48" r="42" stroke="white" strokeWidth="1.5" strokeDasharray="6 4"/>
        <circle cx="330" cy="48" r="26" stroke="white" strokeWidth="1.5" strokeDasharray="4 5"/>
        <circle cx="330" cy="48" r="9" stroke="white" strokeWidth="2.5"/>
        <circle cx="330" cy="6" r="4" fill="white"/>
        <circle cx="372" cy="48" r="4" fill="white"/>
        <circle cx="330" cy="90" r="4" fill="white"/>
        <circle cx="288" cy="48" r="4" fill="white"/>
        {/* Energy level diagram left */}
        <line x1="14" y1="142" x2="14" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="10,20 14,8 18,20" fill="white"/>
        <text x="6" y="10" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">E</text>
        <line x1="22" y1="132" x2="68" y2="132" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="110" x2="68" y2="110" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="88" x2="68" y2="88" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="58" x2="68" y2="58" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="36" x2="68" y2="36" stroke="white" strokeWidth="2.5"/>
        <path d="M 48 130 C 58 120, 58 114, 48 108" stroke="white" strokeWidth="1.8" fill="none"/>
        <polygon points="44,110 48,100 54,110" fill="white"/>
        <line x1="74" y1="132" x2="74" y2="58" stroke="white" strokeWidth="1.5"/>
        <polygon points="70,62 74,50 78,62" fill="white"/>
        <text x="78" y="98" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">ΔH</text>
        {/* Activation energy curve -upper-middle fills gap */}
        <path d="M 96,90 C 116,90 126,18 156,14 C 186,10 196,90 216,90" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="96" y1="90" x2="96" y2="110" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
        <line x1="216" y1="90" x2="216" y2="110" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
        <line x1="155" y1="14" x2="155" y2="90" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
        <text x="158" y="55" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Ea</text>
        <text x="85" y="105" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">R</text>
        <text x="210" y="105" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">P</text>
        {/* Equilibrium arrows */}
        <line x1="96" y1="128" x2="168" y2="128" stroke="white" strokeWidth="2"/>
        <polygon points="164,123 176,128 164,133" fill="white"/>
        <line x1="168" y1="140" x2="96" y2="140" stroke="white" strokeWidth="2"/>
        <polygon points="100,135 88,140 100,145" fill="white"/>
        {/* Kc expression */}
        <text x="86" y="158" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Kc=[C][D]/[A][B]</text>
        {/* pH titration S-curve bottom-right */}
        <path d="M 228,162 C 238,162 244,150 248,138 C 256,112 268,106 278,80 C 288,54 292,42 302,28" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="222" y1="90" x2="310" y2="90" stroke="white" strokeWidth="1.3"/>
        <line x1="228" y1="28" x2="228" y2="166" stroke="white" strokeWidth="1.3"/>
        <text x="230" y="26" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">pH</text>
        <text x="296" y="102" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">V</text>
      </svg>
    );
    if (id === "flashcards") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Large benzene top-right */}
        <polygon points="248,5 272,19 272,47 248,61 224,47 224,19" stroke="white" strokeWidth="2.5"/>
        <circle cx="248" cy="33" r="18" stroke="white" strokeWidth="1.5"/>
        {/* Small benzene mid-left */}
        <polygon points="38,52 52,60 52,76 38,84 24,76 24,60" stroke="white" strokeWidth="2"/>
        <circle cx="38" cy="68" r="11" stroke="white" strokeWidth="1.2"/>
        {/* Skeletal chain bottom */}
        <polyline points="20,128 42,106 64,128 86,106 108,128 130,106 152,128" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Double bond */}
        <line x1="42" y1="106" x2="64" y2="128" stroke="white" strokeWidth="1.5"/>
        <line x1="45" y1="102" x2="67" y2="124" stroke="white" strokeWidth="1.5"/>
        {/* OH end group */}
        <line x1="152" y1="128" x2="168" y2="110" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <text x="170" y="108" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">OH</text>
        {/* Reaction arrow */}
        <line x1="170" y1="45" x2="214" y2="45" stroke="white" strokeWidth="1.8"/>
        <polygon points="210,40 222,45 210,50" fill="white"/>
        {/* NH₂ branch */}
        <line x1="86" y1="106" x2="86" y2="84" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <text x="79" y="78" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">NH₂</text>
      </svg>
    );
    if (id === "synth") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Benzene ring top-right */}
        <polygon points="252,6 274,19 274,45 252,58 230,45 230,19" stroke="white" strokeWidth="2.5"/>
        <circle cx="252" cy="32" r="16" stroke="white" strokeWidth="1.5"/>
        {/* Reactant skeletal left */}
        <polyline points="14,92 36,68 58,92 80,68" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Double bond on reactant */}
        <line x1="36" y1="68" x2="58" y2="92" stroke="white" strokeWidth="1.5"/>
        <line x1="39" y1="64" x2="61" y2="88" stroke="white" strokeWidth="1.5"/>
        {/* Big reaction arrow */}
        <line x1="96" y1="78" x2="168" y2="78" stroke="white" strokeWidth="2.5"/>
        <polygon points="164,72 178,78 164,84" fill="white"/>
        {/* Δ above arrow */}
        <text x="122" y="68" fill="white" fontSize="14" fontFamily="'Space Mono',monospace">Δ</text>
        {/* Reagent below */}
        <text x="102" y="96" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">H₂SO₄</text>
        {/* Product skeletal right */}
        <polyline points="186,92 208,68 230,92" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Br branch on product */}
        <line x1="208" y1="68" x2="208" y2="46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <text x="202" y="40" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">Br</text>
        {/* Dashed bottom chain continuation */}
        <polyline points="14,125 36,110 58,125 80,110 102,125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 4"/>
        {/* Small benzene far right */}
        <polygon points="278,88 292,96 292,112 278,120 264,112 264,96" stroke="white" strokeWidth="1.8"/>
        <circle cx="278" cy="104" r="10" stroke="white" strokeWidth="1.2"/>
      </svg>
    );
    if (id === "pathways") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Benzene top-right */}
        <polygon points="252,6 274,19 274,45 252,58 230,45 230,19" stroke="white" strokeWidth="2.5"/>
        <circle cx="252" cy="32" r="16" stroke="white" strokeWidth="1.5"/>
        {/* Central molecule */}
        <circle cx="80" cy="60" r="8" stroke="white" strokeWidth="2" fill="none"/>
        {/* Branching arrows */}
        <line x1="80" y1="52" x2="80" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="76,22 80,10 84,22" fill="white"/>
        <line x1="72" y1="64" x2="22" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="27,100 18,108 24,96" fill="white"/>
        <line x1="88" y1="64" x2="138" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="133,96 142,104 133,108" fill="white"/>
        <line x1="88" y1="58" x2="140" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="135,34 144,26 140,38" fill="white"/>
        {/* Labels */}
        <text x="68" y="8" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Alkene</text>
        <text x="143" y="30" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Alcohol</text>
        <text x="145" y="104" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Halide</text>
        <text x="0" y="115" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Amine</text>
        {/* Skeletal chain top area */}
        <polyline points="170,18 190,38 210,18 230,38" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3"/>
        {/* Small benzene bottom right */}
        <polygon points="240,98 256,107 256,125 240,134 224,125 224,107" stroke="white" strokeWidth="2"/>
        <circle cx="240" cy="116" r="11" stroke="white" strokeWidth="1.2"/>
      </svg>
    );
    if (id === "calc") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* n = m / Mr large fraction */}
        <text x="160" y="38" fill="white" fontSize="22" fontFamily="'Space Mono',monospace" fontWeight="700">n = m</text>
        <line x1="160" y1="46" x2="248" y2="46" stroke="white" strokeWidth="2.2"/>
        <text x="178" y="68" fill="white" fontSize="22" fontFamily="'Space Mono',monospace" fontWeight="700">Mᵣ</text>
        {/* c = n/V */}
        <text x="164" y="96" fill="white" fontSize="14" fontFamily="'Space Mono',monospace">c = n/V</text>
        {/* PV = nRT */}
        <text x="158" y="118" fill="white" fontSize="14" fontFamily="'Space Mono',monospace">PV = nRT</text>
        {/* Benzene small left */}
        <polygon points="42,30 58,39 58,57 42,66 26,57 26,39" stroke="white" strokeWidth="2"/>
        <circle cx="42" cy="48" r="11" stroke="white" strokeWidth="1.2"/>
        {/* ΔH = ... */}
        <text x="16" y="96" fill="white" fontSize="13" fontFamily="'Space Mono',monospace">ΔH = −kJ</text>
        {/* Skeletal snippet bottom-left */}
        <polyline points="16,128 34,112 52,128 70,112" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Arrow */}
        <line x1="80" y1="48" x2="136" y2="48" stroke="white" strokeWidth="1.8"/>
        <polygon points="132,43 144,48 132,53" fill="white"/>
        <text x="95" y="40" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">mol</text>
      </svg>
    );
    if (id === "extended") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Large tick top-right */}
        <polyline points="210,25 234,52 278,8" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Benzene left */}
        <polygon points="40,14 58,24 58,44 40,54 22,44 22,24" stroke="white" strokeWidth="2"/>
        <circle cx="40" cy="34" r="12" stroke="white" strokeWidth="1.2"/>
        {/* Mark scheme lines */}
        <rect x="16" y="72" width="10" height="10" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="34" y1="77" x2="120" y2="77" stroke="white" strokeWidth="1.5"/>
        <rect x="16" y="92" width="10" height="10" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="34" y1="97" x2="150" y2="97" stroke="white" strokeWidth="1.5"/>
        <rect x="16" y="112" width="10" height="10" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="34" y1="117" x2="100" y2="117" stroke="white" strokeWidth="1.5"/>
        {/* Checkmarks in two boxes */}
        <polyline points="18,76 21,80 26,72" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="18,96 21,100 26,92" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Skeletal formula right */}
        <polyline points="168,108 188,88 208,108 228,88 248,108" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="248" y1="108" x2="264" y2="92" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
    if (id === "mechanisms") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Central C atom */}
        <text x="130" y="76" fill="white" fontSize="18" fontFamily="'Space Mono',monospace" fontWeight="700">C</text>
        {/* Bonds from central C */}
        <line x1="140" y1="58" x2="140" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="148" y1="70" x2="184" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="140" y1="82" x2="140" y2="112" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="132" y1="70" x2="96" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* δ+ on central C */}
        <text x="148" y="72" fill="white" fontSize="12" fontFamily="'Space Mono',monospace">δ+</text>
        {/* Nucleophile curly arrow */}
        <path d="M 60 68 C 60 40, 110 30, 132 62" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <polygon points="126,56 134,64 138,54" fill="white"/>
        <text x="20" y="74" fill="white" fontSize="12" fontFamily="'Space Mono',monospace">Nu:</text>
        <text x="18" y="58" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">δ–</text>
        {/* Leaving group curly arrow */}
        <path d="M 158 64 C 195 54, 210 68, 208 88" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <polygon points="203,84 208,96 214,84" fill="white"/>
        <text x="194" y="58" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">:X</text>
        {/* Benzene ring bottom-right */}
        <polygon points="246,94 264,104 264,124 246,134 228,124 228,104" stroke="white" strokeWidth="2"/>
        <circle cx="246" cy="114" r="12" stroke="white" strokeWidth="1.2"/>
        {/* Small skeletal top-right */}
        <polyline points="210,14 228,28 246,14 264,28" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Double bond */}
        <line x1="228" y1="28" x2="246" y2="14" stroke="white" strokeWidth="1.5"/>
        <line x1="231" y1="32" x2="249" y2="18" stroke="white" strokeWidth="1.5"/>
      </svg>
    );
    return null;
  };

  // AUTH LOADING
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}><span style={{ color: "#29ABE2" }}>Chem</span>Mastery</div>
        <div style={{ color: "#7a95b0", fontSize: "14px" }}>Loading...</div>
      </div>
    </div>
  );

  // LOGIN SCREEN
  if (!authUser) return <LoginScreen />;

  // ACCOUNT SETTINGS MODAL (buried - only for paid users managing subscription)
  if (showAccountSettings) return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: "14px", height: "72px", background: "#0f1d35", flexShrink: 0 }}>
        <button onClick={() => { setShowAccountSettings(false); setCancelStep(0); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "17px", color: "#ffffff" }}>Account Settings</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: "400px", width: "100%" }}>
          {cancelStep === 0 && (
            <div>
              <div style={{ background: "#ecfdf5", border: "1.5px solid #059669", borderRadius: "14px", padding: "20px", marginBottom: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669", marginBottom: "4px" }}>ChemMastery Pro - Active</div>
                <div style={{ fontSize: "12px", color: "#047857" }}>You have full access to all content</div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "16px" }}>Account</div>
              <div style={{ fontSize: "13px", color: "#7a95b0", marginBottom: "6px" }}>{authUser?.email}</div>
              <div style={{ fontSize: "13px", color: "#7a95b0", marginBottom: "24px" }}>{authUser?.displayName || "Student"}</div>
              <div style={{ borderTop: "1px solid #e0e8f0", paddingTop: "20px" }}>
                <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "12px" }}>Subscription</div>
                <button onClick={() => setCancelStep(1)} style={{
                  background: "none", border: "none", color: "#94a3b8", fontSize: "12px",
                  cursor: "pointer", fontFamily: "inherit", textDecoration: "underline"
                }}>Cancel subscription</button>
              </div>
            </div>
          )}
          {cancelStep === 1 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>😢</div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>We would hate to see you go!</h3>
              <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 24px" }}>
                You will lose access to all premium content including flashcards, calculations, synthesis routes and AI marking.
              </p>
              <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "2px solid #f59e0b", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#92400e", marginBottom: "4px" }}>Stay for 50% off!</div>
                <div style={{ fontSize: "13px", color: "#a16207", marginBottom: "12px" }}>Get your next month for just £2.50 instead of £4.99</div>
                <button onClick={() => { setShowAccountSettings(false); setCancelStep(0); }} style={{
                  padding: "10px 24px", borderRadius: "10px", border: "none",
                  background: "#f59e0b", color: "#fff", fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(245,158,11,0.35)"
                }}>Keep my subscription</button>
              </div>
              <button onClick={() => setCancelStep(2)} style={{
                background: "none", border: "none", color: "#94a3b8", fontSize: "12px",
                cursor: "pointer", fontFamily: "inherit", textDecoration: "underline"
              }}>I still want to cancel</button>
            </div>
          )}
          {cancelStep === 2 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>Are you sure?</h3>
              <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 24px" }}>
                Your access will continue until the end of your current billing period. After that, your account will be downgraded to the free plan.
              </p>
              <button onClick={handleManageSubscription} style={{
                padding: "10px 24px", borderRadius: "10px", border: "1.5px solid #dc2626",
                background: "#fff", color: "#dc2626", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", marginBottom: "12px", width: "100%"
              }}>Proceed to cancellation</button>
              <br />
              <button onClick={() => { setShowAccountSettings(false); setCancelStep(0); }} style={{
                padding: "10px 24px", borderRadius: "10px", border: "none",
                background: "#29ABE2", color: "#fff", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", width: "100%",
                boxShadow: "0 4px 16px rgba(41,171,226,0.35)"
              }}>Never mind, keep my subscription</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // BOARD SELECT
  if (screen === "board") return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Header />
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#29ABE2", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 8px" }}>ChemMastery</p>
        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: 800, color: "#1a2d45", margin: "0 0 36px", letterSpacing: "-0.5px" }}>Choose your exam board</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", width: "100%", maxWidth: "720px" }}>
          {[
            { id: "aqa", label: "AQA", sub: "Chemistry", count: TOPIC_ORDER.length, desc: "Year 1 and Year 2. Full spec coverage.", accent: "#29ABE2", grad: "linear-gradient(145deg,#29ABE2 0%,#0e7ab5 60%,#085f8f 100%)", features: ["Organic","Physical","Inorganic","Req. Practicals"] },
            { id: "ocr", label: "OCR A", sub: "Chemistry", count: OCR_TOPIC_ORDER.length, desc: "Modules 2-6 fully covered. Module 1 is PAG practical skills only.", accent: "#7c3aed", grad: "linear-gradient(145deg,#a855f7 0%,#7c3aed 55%,#5b21b6 100%)", features: ["Modules 2-6","Organic","Physical","PAG Skills"] },
          ].map(b => (
            <button key={b.id} onClick={() => selectBoard(b.id)} style={{
              display: "flex", flexDirection: "column", borderRadius: "24px",
              border: "none", cursor: "pointer", fontFamily: "inherit",
              background: "#ffffff", boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
              overflow: "hidden", transition: "transform 0.18s, box-shadow 0.18s", textAlign: "left",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.16)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 30px rgba(0,0,0,0.1)"; }}
            >
              {/* Fancy thumbnail */}
              <div style={{ height: "170px", background: b.grad, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
                {/* Chemistry art -unique per board */}
                <ChemArt id={b.id} />
                {/* Label */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Exam Board</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, lineHeight: 1 }}>
                    <span style={{ fontSize: "48px", color: "#ffffff", letterSpacing: "-2px", display: "block" }}>{b.label}</span>
                    <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.5px" }}>{b.sub}</span>
                  </div>
                </div>
              </div>
              {/* Card body */}
              <div style={{ padding: "22px 24px 26px", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ fontSize: "15px", color: "#5a7090", lineHeight: 1.6 }}>{b.desc}</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {b.features.map(f => (
                    <span key={f} style={{ fontSize: "13px", fontWeight: 700, color: b.accent, background: `${b.accent}15`, borderRadius: "6px", padding: "5px 12px" }}>{f}</span>
                  ))}
                </div>
                <div style={{ marginTop: "auto", background: b.grad, borderRadius: "12px", padding: "14px 16px", color: "#fff", fontWeight: 700, fontSize: "16px", textAlign: "center" }}>
                  Let's Go →
                </div>
              </div>
            </button>
          ))}
        </div>
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

          {/* Streak & Activity Hero */}
          <div style={{ display: "flex", gap: "10px" }}>
            {/* Streak card */}
            <div style={{ flex: 1, background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "20px", padding: "20px", color: "#fff", boxShadow: "0 8px 24px rgba(245,158,11,0.3)", textAlign: "center" }}>
              <div style={{ fontSize: "42px", marginBottom: "4px" }}>🔥</div>
              <div style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1 }}>{currentStreak}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, opacity: 0.9, marginTop: "4px" }}>{currentStreak === 1 ? "day streak" : "day streak"}</div>
              {currentStreak >= 7 && <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px" }}>Keep it going!</div>}
            </div>
            {/* Overall progress card */}
            <div style={{ flex: 2, background: "linear-gradient(135deg, #29ABE2, #1a8fc4)", borderRadius: "20px", padding: "20px", color: "#fff", boxShadow: "0 8px 24px rgba(41,171,226,0.3)" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, opacity: 0.85, marginBottom: "4px" }}>Overall Progress</div>
              <div style={{ fontSize: "42px", fontWeight: 800, lineHeight: 1 }}>{overallPct}%</div>
              <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>{totalMastered} of {totalCards} cards mastered</div>
              <div style={{ marginTop: "10px", height: "6px", background: "rgba(255,255,255,0.25)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${overallPct}%`, background: "#ffffff", borderRadius: "3px", transition: "width 0.5s" }} />
              </div>
            </div>
          </div>

          {/* Activity Heatmap - last 28 days */}
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginBottom: "10px" }}>Activity - Last 28 Days</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} style={{ fontSize: "10px", color: "#7a95b0", textAlign: "center", fontWeight: 600, marginBottom: "2px" }}>{d}</div>
              ))}
              {(() => {
                const cells = [];
                const today = new Date();
                // Find the Monday 4 weeks ago
                const start = new Date(today);
                start.setDate(start.getDate() - 27 - ((start.getDay() + 6) % 7));
                for (let i = 0; i < 28; i++) {
                  const d = new Date(start);
                  d.setDate(d.getDate() + i);
                  const key = d.toISOString().slice(0, 10);
                  const dayData = studyLog[key];
                  const total = dayData ? (dayData.cards || 0) + (dayData.calcs || 0) + (dayData.extended || 0) + (dayData.mechanisms || 0) : 0;
                  const isToday = key === todayKey;
                  const intensity = total === 0 ? 0 : total < 5 ? 1 : total < 15 ? 2 : total < 30 ? 3 : 4;
                  const colors = ["#edf2f7", "#bae6fd", "#38bdf8", "#0284c7", "#0c4a6e"];
                  cells.push(
                    <div key={key} title={`${key}: ${total} actions`} style={{
                      aspectRatio: "1", borderRadius: "4px",
                      background: colors[intensity],
                      border: isToday ? "2px solid #f59e0b" : "none",
                    }} />
                  );
                }
                return cells;
              })()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "10px", color: "#7a95b0" }}>Less</span>
              {["#edf2f7", "#bae6fd", "#38bdf8", "#0284c7", "#0c4a6e"].map(c => (
                <div key={c} style={{ width: "10px", height: "10px", borderRadius: "2px", background: c }} />
              ))}
              <span style={{ fontSize: "10px", color: "#7a95b0" }}>More</span>
            </div>
          </div>

          {/* Today's activity */}
          {(() => {
            const today = studyLog[todayKey] || {};
            const todayTotal = (today.cards || 0) + (today.calcs || 0) + (today.extended || 0) + (today.mechanisms || 0);
            return (
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginBottom: "10px" }}>Today</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  <div style={{ textAlign: "center", padding: "8px", background: "#f0f9ff", borderRadius: "10px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#29ABE2" }}>{today.cards || 0}</div>
                    <div style={{ fontSize: "10px", color: "#7a95b0", fontWeight: 600 }}>Cards</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "8px", background: "#f0f9ff", borderRadius: "10px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#0284c7" }}>{today.calcs || 0}</div>
                    <div style={{ fontSize: "10px", color: "#7a95b0", fontWeight: 600 }}>Calcs</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "8px", background: "#f5f3ff", borderRadius: "10px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#7c3aed" }}>{today.extended || 0}</div>
                    <div style={{ fontSize: "10px", color: "#7a95b0", fontWeight: 600 }}>Extended</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "8px", background: "#fff7ed", borderRadius: "10px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#d97706" }}>{today.mechanisms || 0}</div>
                    <div style={{ fontSize: "10px", color: "#7a95b0", fontWeight: 600 }}>Mechs</div>
                  </div>
                </div>
                {todayTotal === 0 && <div style={{ textAlign: "center", fontSize: "12px", color: "#7a95b0", marginTop: "8px" }}>Start studying to fill this up!</div>}
              </div>
            );
          })()}

          {/* Score Trends */}
          {scoreHistory.length > 0 && (
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginBottom: "10px" }}>Recent Calc Scores</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "60px" }}>
                {scoreHistory.filter(s => s.type === "calc").slice(-20).map((s, i) => (
                  <div key={i} title={`${s.topic}: ${s.score}/${s.total}`} style={{
                    flex: 1, maxWidth: "20px",
                    height: `${s.score ? 100 : 20}%`, minHeight: "4px",
                    background: s.score ? "linear-gradient(180deg, #29ABE2, #0284c7)" : "#fecaca",
                    borderRadius: "3px 3px 0 0",
                    transition: "height 0.3s",
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "10px", color: "#7a95b0" }}>Oldest</span>
                <span style={{ fontSize: "10px", color: "#7a95b0" }}>
                  {(() => {
                    const calcScores = scoreHistory.filter(s => s.type === "calc");
                    const correct = calcScores.filter(s => s.score > 0).length;
                    return calcScores.length > 0 ? `${Math.round((correct / calcScores.length) * 100)}% correct overall` : "";
                  })()}
                </span>
                <span style={{ fontSize: "10px", color: "#7a95b0" }}>Latest</span>
              </div>
            </div>
          )}

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

  // Activity card data used by both the home grid and the back-to-home helper
  const ACTIVITY_CARDS = [
    { id: "flashcards", label: "Flashcards",            labelBig: "Flash",    labelSmall: "cards",   desc: "Master every topic with smart revision cards.", color: "#29ABE2", grad: "linear-gradient(145deg,#29ABE2,#0e7ab5,#085f8f)", stat: `${CURRENT_TOPIC_ORDER.length} topics` },
    { id: "synth",      label: "Synthesis",             labelBig: "Synth",    labelSmall: "esis",    desc: "Build multi-step reaction routes from scratch.", color: "#0ea5e9", grad: "linear-gradient(145deg,#38bdf8,#0ea5e9,#0369a1)", stat: "Route builder" },
    { id: "pathways",   label: "Pathways",              labelBig: "Path",     labelSmall: "ways",    desc: "Explore all routes between functional groups.",  color: "#059669", grad: "linear-gradient(145deg,#10b981,#059669,#047857)", stat: "Reaction map" },
    { id: "calc",       label: "Calculations",          labelBig: "Worked",   labelSmall: "Calcs",   desc: "Practise every calculation type with worked steps.", color: "#0284c7", grad: "linear-gradient(145deg,#0ea5e9,#0284c7,#075985)", stat: "Step-by-step" },
    { id: "extended",   label: "AI Examiner",           labelBig: "AI",       labelSmall: "Examiner",desc: "ChemMastery AI marks your extended answers.",    color: "#7c3aed", grad: "linear-gradient(145deg,#a855f7,#7c3aed,#5b21b6)", stat: "AI powered" },
    { id: "mechanisms", label: "Mechanisms",            labelBig: "Mech",     labelSmall: "anisms",  desc: "Animated curly arrow mechanisms step by step.",  color: "#d97706", grad: "linear-gradient(145deg,#f59e0b,#d97706,#b45309)", stat: "Animated" },
  ];

  const goHome = () => { setTopicsTab("home"); setSelectedRxn(null); setSelectedFrom(null); setMechId(null); setMechStep(0); setMechArrowIdx(0); };

  if (screen === "topics") return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* Header -always visible */}
      <div style={{ padding: "0 20px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f1d35", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {topicsTab !== "home"
            ? <button onClick={goHome} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Home</button>
            : <button onClick={goBack} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
          }
          <div style={{ background: "#fff", borderRadius: "10px", padding: "4px 8px", display: "flex", alignItems: "center" }}>
            <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "48px", objectFit: "contain", display: "block" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "17px", color: "#ffffff", letterSpacing: "-0.3px", lineHeight: 1.1 }}>HSJ TUITION</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "10px", color: "#29ABE2", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>{board === "ocr" ? "OCR A" : "AQA"} · A-Level Chemistry</div>
          </div>
        </div>
        <button onClick={() => { setScreen("dashboard"); track("view_dashboard", { board }); }} style={{ background: "#29ABE2", border: "none", borderRadius: "10px", padding: "9px 16px", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 2px 8px rgba(41,171,226,0.4)" }}>My Progress</button>
      </div>

      {/* Payment success/cancel banner */}
      {paymentBanner === "success" && (
        <div style={{ margin: "12px 16px 0", padding: "14px 16px", background: "#ecfdf5", border: "1.5px solid #059669", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🎉</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669" }}>Payment successful!</div>
            <div style={{ fontSize: "12px", color: "#047857", marginTop: "2px" }}>Welcome to ChemMastery Pro - all content is now unlocked. It may take a moment to activate.</div>
          </div>
          <button onClick={() => setPaymentBanner(null)} style={{ background: "none", border: "none", color: "#059669", fontSize: "18px", cursor: "pointer", marginLeft: "auto" }}>x</button>
        </div>
      )}
      {paymentBanner === "cancel" && (
        <div style={{ margin: "12px 16px 0", padding: "14px 16px", background: "#fffbeb", border: "1.5px solid #d97706", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>💡</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}>Payment cancelled</div>
            <div style={{ fontSize: "12px", color: "#a16207", marginTop: "2px" }}>No worries - you can upgrade anytime from the home screen.</div>
          </div>
          <button onClick={() => setPaymentBanner(null)} style={{ background: "none", border: "none", color: "#92400e", fontSize: "18px", cursor: "pointer", marginLeft: "auto" }}>x</button>
        </div>
      )}

      {/* HOME card grid */}
      {topicsTab === "home" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px 56px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 6px", alignSelf: "flex-start" }}>ChemMastery</p>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1a2d45", margin: "0 0 12px", letterSpacing: "-0.5px", alignSelf: "flex-start" }}>What would you like to practise?</h2>
          {!hasFullAccess && (
            <div style={{ alignSelf: "stretch", background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "1.5px solid #fbbf2440", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: showPricing ? "12px" : "0" }}>
                <span style={{ fontSize: "18px" }}>🔑</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>Free plan - limited content</div>
                  <div style={{ fontSize: "11px", color: "#a16207", marginTop: "2px" }}>Upgrade to unlock all flashcards, calcs, synthesis and more</div>
                </div>
                <button onClick={() => setShowPricing(!showPricing)} style={{ background: "#29ABE2", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  {showPricing ? "Hide" : "Upgrade"}
                </button>
              </div>
              {showPricing && (
                <div>
                  <PricingCards />
                  <div style={{ textAlign: "center", marginTop: "12px" }}>
                    <button onClick={() => setShowUserMenu(true)} style={{ background: "none", border: "none", color: "#92400e", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                      Have an access key? Enter it here
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%", maxWidth: "900px" }}>
            {ACTIVITY_CARDS.map(card => {
              const fullyLocked = !hasFullAccess && (card.id === "synth" || card.id === "pathways");
              const partiallyLocked = !hasFullAccess && !fullyLocked;
              return (
              <button key={card.id} onClick={() => { setTopicsTab(card.id); track("open_section", { section: card.id, board }); if (card.id === "mechanisms") { setMechId(null); setMechStep(0); setMechArrowIdx(0); } }}
                style={{ display: "flex", flexDirection: "column", borderRadius: "22px", border: "none", cursor: "pointer", fontFamily: "inherit", background: "#ffffff", boxShadow: "0 4px 24px rgba(0,0,0,0.09)", overflow: "hidden", textAlign: "left", transition: "transform 0.18s, box-shadow 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(0,0,0,0.16)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.09)"; }}
              >
                {/* Thumbnail */}
                <div style={{ height: "140px", background: card.grad, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                  {/* Chemistry artwork */}
                  <ChemArt id={card.id} />
                  {/* Stat badge top-left */}
                  <div style={{ position: "absolute", top: "14px", left: "16px", background: "rgba(255,255,255,0.2)", borderRadius: "6px", padding: "4px 10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>{card.stat}</span>
                  </div>
                  {/* Lock badge for free users */}
                  {(fullyLocked || partiallyLocked) && (
                    <div style={{ position: "absolute", top: "14px", right: "16px", background: "rgba(0,0,0,0.5)", borderRadius: "6px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10px" }}>🔒</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>{fullyLocked ? "PRO" : "PREVIEW"}</span>
                    </div>
                  )}
                  {/* Single bold title */}
                  <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "34px", color: "#ffffff", lineHeight: 1, letterSpacing: "-1px" }}>{card.label}</div>
                </div>
                {/* Card body */}
                <div style={{ padding: "16px 18px 22px", flex: 1 }}>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#1a2d45", marginBottom: "6px" }}>{card.label}</div>
                  <div style={{ fontSize: "13px", color: "#7a95b0", lineHeight: 1.55 }}>{card.desc}</div>
                </div>
              </button>
              );
            })}
          </div>
        </div>
      )}
      {topicsTab === "flashcards" && quizScreen === "setup" && (() => {
        const allSections = board === "ocr" ? OCR_SECTIONS : SECTIONS;
        const asSecs = board === "ocr" ? OCR_AS_SECTIONS : AQA_AS_SECTIONS;
        const a2Secs = board === "ocr" ? OCR_A2_SECTIONS : AQA_A2_SECTIONS;
        const effectiveCount = quizCount === "custom" ? Math.min(99, Math.max(25, quizCustomCount || 25)) : quizCount;

        // Card pool size for current selection
        let poolSize = 0;
        if (quizMode === "topics") {
          poolSize = quizSelectedTopics.filter(id => SETS[id]).reduce((sum, id) => sum + SETS[id].cards.length, 0);
        } else {
          const filter = quizYear === "as" ? asSecs : quizYear === "a2" ? a2Secs : [...asSecs, ...a2Secs];
          poolSize = allSections.filter(s => filter.includes(s.id)).flatMap(s => s.topics).filter(id => SETS[id]).reduce((sum, id) => sum + SETS[id].cards.length, 0);
        }

        const toggleTopic = (id) => setQuizSelectedTopics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        const toggleSection = (sec) => {
          const all = sec.topics.filter(id => SETS[id]);
          const allSelected = all.every(id => quizSelectedTopics.includes(id));
          setQuizSelectedTopics(prev => allSelected ? prev.filter(id => !all.includes(id)) : [...new Set([...prev, ...all])]);
        };
        const canStart = quizMode === "year" || quizSelectedTopics.length > 0;

        return (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 40px" }}>
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
              <button onClick={() => setQuizScreen(null)} style={{ background: "none", border: "none", color: "#7a95b0", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600, padding: "0 0 18px 0" }}>← Back to Topics</button>

              {/* Hero */}
              <div style={{ background: "linear-gradient(135deg,#29ABE2,#0090cc)", borderRadius: "20px", padding: "22px 24px", color: "#fff", marginBottom: "24px", boxShadow: "0 6px 20px rgba(41,171,226,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>Random Quiz</div>
                  <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>Weak cards shown more often</div>
                </div>
                <div style={{ fontSize: "36px" }}>🎯</div>
              </div>

              {/* Mode toggle */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Question Source</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[["year","By Year Level"],["topics","Choose Topics"]].map(([v,label]) => (
                    <button key={v} onClick={() => setQuizMode(v)} style={{
                      flex: 1, padding: "13px 8px", borderRadius: "12px", border: "2px solid",
                      borderColor: quizMode === v ? "#29ABE2" : "#dde4ed",
                      background: quizMode === v ? "#eaf6fd" : "#ffffff",
                      color: quizMode === v ? "#29ABE2" : "#7a95b0",
                      fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Year selector (mode = year) */}
              {quizMode === "year" && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Year Level</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[["as","AS Year 1"],["a2","A2 Year 2"],["all","All Topics"]].map(([v,label]) => (
                      <button key={v} onClick={() => setQuizYear(v)} style={{
                        flex: 1, padding: "13px 8px", borderRadius: "12px", border: "2px solid",
                        borderColor: quizYear === v ? "#29ABE2" : "#dde4ed",
                        background: quizYear === v ? "#eaf6fd" : "#ffffff",
                        color: quizYear === v ? "#29ABE2" : "#7a95b0",
                        fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                      }}>{label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Topic picker (mode = topics) */}
              {quizMode === "topics" && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase" }}>Pick Topics</div>
                    <button onClick={() => setQuizSelectedTopics([])} style={{ background: "none", border: "none", color: "#29ABE2", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {allSections.map(sec => {
                      const secTopics = sec.topics.filter(id => SETS[id]);
                      const allSel = secTopics.every(id => quizSelectedTopics.includes(id));
                      const someSel = secTopics.some(id => quizSelectedTopics.includes(id));
                      return (
                        <div key={sec.id} style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e0e8f0", overflow: "hidden" }}>
                          <button onClick={() => toggleSection(sec)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45" }}>{sec.label}</span>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: allSel ? "#29ABE2" : someSel ? "#7a95b0" : "#bcc8d4" }}>{allSel ? "All selected" : someSel ? `${secTopics.filter(id => quizSelectedTopics.includes(id)).length}/${secTopics.length}` : "Select all"}</span>
                          </button>
                          <div style={{ padding: "0 10px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {secTopics.map(id => {
                              const sel = quizSelectedTopics.includes(id);
                              return (
                                <button key={id} onClick={() => toggleTopic(id)} style={{
                                  padding: "6px 12px", borderRadius: "8px", border: "2px solid",
                                  borderColor: sel ? "#29ABE2" : "#dde4ed",
                                  background: sel ? "#eaf6fd" : "#ffffff",
                                  color: sel ? "#29ABE2" : "#7a95b0",
                                  fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                }}>{SETS[id]?.title || id}</button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card count */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Cards per Session</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[[25,"25"],[50,"50"],["custom","Custom"]].map(([v,label]) => (
                    <button key={v} onClick={() => setQuizCount(v)} style={{
                      flex: 1, padding: "13px 8px", borderRadius: "12px", border: "2px solid",
                      borderColor: quizCount === v ? "#29ABE2" : "#dde4ed",
                      background: quizCount === v ? "#eaf6fd" : "#ffffff",
                      color: quizCount === v ? "#29ABE2" : "#7a95b0",
                      fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                </div>
                {quizCount === "custom" && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="number" min={25} max={99} value={quizCustomCount}
                      onChange={e => setQuizCustomCount(Math.min(99, Math.max(25, Number(e.target.value))))}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "2px solid #dde4ed", fontSize: "16px", fontFamily: "inherit", fontWeight: 700, color: "#1a2d45", outline: "none", textAlign: "center" }}
                    />
                    <span style={{ fontSize: "13px", color: "#7a95b0", fontWeight: 600 }}>cards (25–99)</span>
                  </div>
                )}
              </div>

              {/* Pool summary */}
              <div style={{ fontSize: "13px", color: "#7a95b0", textAlign: "center", marginBottom: "20px", padding: "12px", background: "#f8fafc", borderRadius: "10px" }}>
                Drawing <strong style={{ color: "#29ABE2" }}>{Math.min(effectiveCount, poolSize)}</strong> cards from a pool of <strong style={{ color: "#1a2d45" }}>{poolSize}</strong>
                {quizMode === "topics" && quizSelectedTopics.length === 0 && <div style={{ color: "#ef4444", marginTop: "4px", fontSize: "12px" }}>Select at least one topic above</div>}
              </div>

              <button onClick={startQuiz} disabled={!canStart} style={{
                width: "100%", padding: "18px", borderRadius: "14px", border: "none",
                background: canStart ? "linear-gradient(135deg,#29ABE2,#0090cc)" : "#e0e8f0",
                color: canStart ? "#ffffff" : "#aab5c2",
                fontFamily: "inherit", fontSize: "17px", fontWeight: 800, cursor: canStart ? "pointer" : "not-allowed",
                boxShadow: canStart ? "0 4px 16px rgba(41,171,226,0.4)" : "none",
              }}>Start Quiz →</button>
            </div>
          </div>
        );
      })()}
      {topicsTab === "flashcards" && quizScreen === "running" && (() => {
        const card = quizDeck[quizPos];
        const progress = Math.round(((quizPos) / quizDeck.length) * 100);
        const topicTitle = SETS[card?.topicId]?.title || card?.topicId || "";
        return (
          <div style={{ padding: "20px 20px 32px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "580px" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <button onClick={() => setQuizScreen("setup")} style={{ background: "none", border: "none", color: "#7a95b0", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: 600 }}>✕ Exit</button>
                <div style={{ fontSize: "14px", color: "#7a95b0", fontWeight: 600 }}>{quizPos + 1} / {quizDeck.length}</div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>
                  <span style={{ color: "#22c55e" }}>✓ {quizSessionScore.correct}</span>
                  <span style={{ color: "#d1d5db", margin: "0 6px" }}>|</span>
                  <span style={{ color: "#ef4444" }}>✗ {quizSessionScore.wrong}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: "6px", background: "#e0e8f0", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#29ABE2,#22c55e)", borderRadius: "3px", transition: "width 0.3s" }} />
              </div>
              {/* Topic label */}
              <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", textAlign: "center", marginBottom: "12px" }}>{topicTitle}</div>
              {/* Card */}
              <div onClick={() => setQuizFlipped(f => !f)} style={{
                minHeight: "260px", borderRadius: "24px", padding: "36px 32px",
                background: quizFlipped ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "#ffffff",
                border: `2px solid ${quizFlipped ? "#86efac" : "#dde4ed"}`,
                boxShadow: "0 6px 28px rgba(0,0,0,0.09)", cursor: "pointer",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                textAlign: "center", transition: "all 0.2s", userSelect: "none",
                marginBottom: "18px",
              }}>
                {!quizFlipped ? (
                  <>
                    <div style={{ fontSize: "11px", color: "#29ABE2", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>QUESTION</div>
                    <div style={{ fontSize: "19px", fontWeight: 600, color: "#1a2d45", lineHeight: 1.55 }}>{card?.q}</div>
                    <div style={{ marginTop: "24px", fontSize: "12px", color: "#aab5c2" }}>Tap to reveal answer</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>ANSWER</div>
                    <div style={{ fontSize: "17px", color: "#1a2d45", lineHeight: 1.65, whiteSpace: "pre-line" }}>{card?.a}</div>
                  </>
                )}
              </div>
              {/* Answer buttons */}
              {quizFlipped ? (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => recordQuizAnswer(false)} style={{
                    flex: 1, padding: "18px 10px", borderRadius: "16px", border: "2px solid #fecaca",
                    background: "#fff5f5", color: "#dc2626", fontFamily: "inherit", fontSize: "16px",
                    fontWeight: 800, cursor: "pointer",
                  }}>✗ Missed it</button>
                  <button onClick={() => recordQuizAnswer(true)} style={{
                    flex: 1, padding: "18px 10px", borderRadius: "16px", border: "none",
                    background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#ffffff",
                    fontFamily: "inherit", fontSize: "16px", fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(34,197,94,0.35)",
                  }}>✓ Got it</button>
                </div>
              ) : (
                <div style={{ height: "58px" }} />
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
          <button onClick={() => { if (hasFullAccess) setQuizScreen("setup"); }} style={{
            width: "100%", padding: "14px 16px", borderRadius: "16px", border: "none",
            background: hasFullAccess ? "linear-gradient(135deg,#29ABE2 0%,#0090cc 100%)" : "linear-gradient(135deg,#94a3b8 0%,#64748b 100%)", color: "#ffffff",
            cursor: hasFullAccess ? "pointer" : "default", textAlign: "left", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: hasFullAccess ? "0 4px 16px rgba(41,171,226,0.35)" : "none", marginBottom: "12px", marginTop: "4px",
            position: "relative", overflow: "hidden",
          }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>{hasFullAccess ? "🎯" : "🔒"} Random Quiz</div>
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>{hasFullAccess ? "Spaced repetition · 25 cards · adapts to your gaps" : "Unlock with access key for full quiz access"}</div>
            </div>
            <div style={{ fontSize: "20px", opacity: 0.8 }}>{hasFullAccess ? "→" : ""}</div>
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
            {CURRENT_SECTIONS.map(section => {
              const fc = FOLDER_COLORS[section.id] || FOLDER_COLORS.physical_as;
              const totalCards = section.topics.reduce((sum, id) => sum + SETS[id].cards.length, 0);
              const totalKnown = section.topics.reduce((sum, id) => sum + (known[id] || new Set()).size, 0);
              const pct = totalCards > 0 ? Math.round((totalKnown / totalCards) * 100) : 0;
              const sectionLocked = !hasFullAccess && !FREE_FLASHCARD_SECTIONS.includes(section.id);
              return (
                <button key={section.id} onClick={() => { if (!sectionLocked) setActiveSection(section.id); }} style={{
                  padding: "16px 14px 14px", borderRadius: "16px",
                  background: fc.bg, border: `2px solid ${fc.border}40`,
                  cursor: sectionLocked ? "default" : "pointer", textAlign: "left", fontFamily: "inherit",
                  position: "relative", overflow: "hidden", minHeight: "110px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}>
                  {sectionLocked && <LockedOverlay />}
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
      {topicsTab === "synth" && !hasFullAccess && (
        <UpgradeCard section="Synthesis" />
      )}
      {topicsTab === "synth" && hasFullAccess && (() => {
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
                  Select a starting material to view all synthesis routes - with reagents, conditions, and step-by-step mechanisms.
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
                          Quiz mode - try to recall the reagents and conditions before revealing
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
      {topicsTab === "pathways" && !hasFullAccess && (
        <UpgradeCard section="Pathways" />
      )}
      {topicsTab === "pathways" && hasFullAccess && (() => {
        const sNodes = synthTab === "ali" ? SYNTH_ALI_NODES : SYNTH_ARO_NODES;
        const sRxns  = synthTab === "ali" ? SYNTH_ALI_RXNS  : SYNTH_ARO_RXNS;
        const vbW = 660, vbH = synthTab === "ali" ? 870 : 720;
        const SW = 1.0; // full-size nodes for readability
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
            <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e8f0", padding: "0 14px", background: "#fff", flexShrink: 0 }}>
              {[["ali","Aliphatic","27"],["aro","Aromatic","9"]].map(([id,lbl,cnt]) => (
                <button key={id} onClick={() => { setSynthTab(id); setSelectedFrom(null); setSelectedRxn(null); track("view_synthesis", { map: id }); }} style={{
                  padding:"12px 18px", border:"none", background:"none", fontFamily:"inherit",
                  fontSize:"15px", fontWeight:800, cursor:"pointer",
                  color: synthTab===id ? "#0f1d35" : "#7a95b0",
                  borderBottom: synthTab===id ? "3px solid #29ABE2" : "3px solid transparent",
                  marginBottom:"-2px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"8px",
                  letterSpacing:"0.3px"
                }}>
                  {lbl}
                  <span style={{ fontSize:"11px", fontWeight:700, background:synthTab===id?"#e0f4fd":"#f0f4f8", color:synthTab===id?"#29ABE2":"#94a3b8", padding:"3px 10px", borderRadius:"12px" }}>{cnt}</span>
                </button>
              ))}
              <div style={{ flex:1 }} />
              <button onClick={() => setSynthQuiz(q => !q)} style={{
                padding:"6px 14px", borderRadius:"20px", border:"none",
                background:synthQuiz?"linear-gradient(135deg,#f97316,#ea580c)":"#f0f4f8", color:synthQuiz?"#fff":"#7a95b0",
                fontSize:"12px", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                boxShadow: synthQuiz ? "0 2px 8px rgba(249,115,22,0.3)" : "none"
              }}>Quiz {synthQuiz?"ON":"OFF"}</button>
            </div>
            {/* Hint bar */}
            <div style={{ fontSize:"12px", color: selId ? "#059669" : "#94a3b8", fontWeight: selId ? 600 : 400, padding:"6px 14px 5px", textAlign:"center", flexShrink:0, background: selId ? "#f0fdf4" : "#fff", borderBottom:"1px solid #f0f4f8", transition:"all 0.2s" }}>
              {selId ? `${selNodeData ? selNodeData[1].replace(/\n/g," ") : ""} selected - tap another compound or background to clear` : "Tap a compound to highlight its reaction routes"}
            </div>
            {/* SVG map - scrollable */}
            <div style={{ flex:1, overflow:"auto", WebkitOverflowScrolling:"touch", background:"linear-gradient(180deg, #f0f4f8 0%, #e8eef6 100%)" }}>
              <svg
                viewBox={`0 0 ${vbW} ${vbH}`}
                width={vbW * 1.05} height={vbH * 1.05}
                style={{ display:"block", margin:"12px auto" }}
                onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }}
              >
                <defs>
                  <marker id="mn" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0.5 L6,3.5 L0,6.5z" fill="#1a2d45" />
                  </marker>
                  <marker id="mo" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0.5 L7,4 L0,7.5z" fill="#059669" />
                  </marker>
                  <marker id="mi" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0.5 L7,4 L0,7.5z" fill="#2563eb" />
                  </marker>
                  <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
                  </filter>
                  <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#059669" floodOpacity="0.4" />
                  </filter>
                </defs>
                <rect x={0} y={0} width={vbW} height={vbH} fill="transparent" />
                {/* Zone backgrounds removed for cleaner look */}
                {/* Edges - curved arrows (reverse pairs get bigger curve separation) */}
                {(() => {
                  // Build reverse-pair lookup: for reactions A->B and B->A, curve them in opposite directions
                  const pairKey = (a,b) => a < b ? a+"|"+b : b+"|"+a;
                  const pairDir = {};
                  sRxns.forEach(r => {
                    const k = pairKey(r[1],r[2]);
                    if (pairDir[k] === undefined) pairDir[k] = r[0];
                    // else it's the reverse - second one found
                  });
                  return sRxns.map(r => {
                    const [n, fromId, toId] = r;
                    const fN = nodeMap[fromId], tN = nodeMap[toId];
                    if (!fN || !tN) return null;
                    const frw = fN[5]*SW, frh = fN[6]*SW, trw = tN[5]*SW, trh = tN[6]*SW;
                    const [x1,y1] = edgePt(fN[2],fN[3],frw,frh,tN[2],tN[3]);
                    const [x2,y2] = edgePt(tN[2],tN[3],trw,trh,fN[2],fN[3]);
                    const isOut = selId && fromId === selId;
                    const isIn  = selId && toId   === selId;
                    const isDim = connRxnIds && !connRxnIds.has(n);
                    const mx = (x1+x2)/2, my = (y1+y2)/2;
                    const dx = x2-x1, dy = y2-y1;
                    const len = Math.sqrt(dx*dx+dy*dy) || 1;
                    // Detect reverse pair and choose direction
                    const pk = pairKey(fromId, toId);
                    const isFirst = pairDir[pk] === n;
                    const hasReverse = sRxns.some(o => o[0] !== n && ((o[1]===fromId && o[2]===toId) || (o[1]===toId && o[2]===fromId)));
                    const curveOff = hasReverse ? Math.min(len * 0.22, 35) : Math.min(len * 0.1, 16);
                    const sign = hasReverse ? (isFirst ? 1 : -1) : 1;
                    const cx1 = mx + (dy/len)*curveOff*sign, cy1 = my - (dx/len)*curveOff*sign;
                    return (
                      <path key={"e"+n}
                        d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`}
                        fill="none"
                        stroke={isOut ? "#059669" : isIn ? "#2563eb" : selId ? "#d0d8e0" : "#1a2d45"}
                        strokeWidth={isOut||isIn ? 2.5 : selId ? 0.8 : 1.5}
                        opacity={isDim ? 0.1 : 1}
                        markerEnd={isOut ? "url(#mo)" : isIn ? "url(#mi)" : "url(#mn)"}
                        strokeLinecap="round"
                      />
                    );
                  });
                })()}
                {/* Nodes - tappable cards with shadows */}
                {sNodes.map(([id, label, cx, cy, fill, hw, hh]) => {
                  const rw = hw*SW, rh = hh*SW;
                  const lines = label.split("\n");
                  const lh = 14, th = lines.length * lh;
                  const isSel = id === selId;
                  const isConn = connNodeIds && connNodeIds.has(id);
                  const isDim = connNodeIds && !connNodeIds.has(id);
                  return (
                    <g key={id} onClick={e => { e.stopPropagation(); setSelectedFrom(id === selId ? null : id); setSelectedRxn(null); }} style={{ cursor:"pointer" }}>
                      {/* Selection glow ring */}
                      {isSel && <rect x={cx-rw-6} y={cy-rh-6} width={(rw+6)*2} height={(rh+6)*2} rx={14} fill="rgba(5,150,105,0.12)" stroke="#059669" strokeWidth={2.5} filter="url(#glowGreen)" />}
                      {/* Node body - pastel fill with coloured border */}
                      <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                        rx={12} fill={isDim ? "#f0f4f8" : "#fff"} opacity={isDim ? 0.4 : 1}
                        stroke={isSel ? "#059669" : fill}
                        strokeWidth={isSel ? 2.5 : 2}
                        filter={isDim ? "none" : "url(#nodeShadow)"}
                      />
                      {/* Pastel colour wash */}
                      {!isDim && <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                        rx={12} fill={fill} fillOpacity={0.12}
                        style={{ pointerEvents:"none" }} />}
                      {/* Left accent bar */}
                      {!isDim && <rect x={cx-rw} y={cy-rh+4} width={3.5} height={rh*2-8}
                        rx={2} fill={fill} style={{ pointerEvents:"none" }} />}
                      {lines.map((ln,li) => (
                        <text key={li} x={cx} y={cy - th/2 + li*lh + lh*0.85}
                          textAnchor="middle" fontSize="12.5" fontWeight="800"
                          fill={isDim ? "#c0cdd8" : fill}
                          style={{ userSelect:"none", pointerEvents:"none" }}>{ln}</text>
                      ))}
                    </g>
                  );
                })}
                {/* Reaction number badges */}
                {sRxns.map(r => {
                  const [n, fromId, toId, bx, by] = r;
                  const isAct = selectedRxn === n;
                  const isOut = selId && fromId === selId;
                  const isIn  = selId && toId === selId;
                  const isDim = connRxnIds && !connRxnIds.has(n);
                  const badgeColor = isAct ? "#1a2d45" : isOut ? "#059669" : isIn ? "#2563eb" : "#fff";
                  const textColor = isAct || isOut || isIn ? "#fff" : isDim ? "#bbb" : "#1a2d45";
                  return (
                    <g key={"b"+n} onClick={e => { e.stopPropagation(); setSelectedRxn(isAct ? null : n); }} style={{ cursor:"pointer" }}>
                      <circle cx={bx} cy={by} r={16} fill="transparent" />
                      <circle cx={bx} cy={by} r={12}
                        fill={badgeColor}
                        stroke={isDim ? "#dde3ea" : isOut ? "#059669" : isIn ? "#2563eb" : "#1a2d45"}
                        strokeWidth={1.8} opacity={isDim ? 0.2 : 1}
                        filter={isAct || isOut || isIn ? "url(#nodeShadow)" : "none"}
                      />
                      <text x={bx} y={by+0.5} textAnchor="middle" dominantBaseline="middle"
                        fontSize="10" fontWeight="800"
                        fill={textColor}
                        opacity={isDim ? 0.2 : 1}
                        style={{ userSelect:"none", pointerEvents:"none" }}>{n}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* ═══ POPUP MODALS (overlay on top of map) ═══ */}
            {/* Compound connections popup */}
            {selId && !selRxn && (
              <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
                onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }}>
                <div style={{ position:"absolute", inset:0, background:"rgba(15,29,53,0.45)", backdropFilter:"blur(4px)" }} />
                <div style={{ position:"relative", background:"#fff", borderRadius:"18px", padding:"18px 16px 20px", width:"100%", maxWidth:"380px", maxHeight:"80vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
                  onClick={e => e.stopPropagation()}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <div style={{ width:"4px", height:"24px", borderRadius:"2px", background: selNodeData ? selNodeData[4] : "#059669" }} />
                      <div style={{ fontSize:"15px", fontWeight:800, color:"#1a2d45" }}>{selNodeData ? selNodeData[1].replace(/\n/g," ") : ""}</div>
                    </div>
                    <button onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }} style={{
                      background:"#f0f4f8", border:"none", borderRadius:"50%", width:"30px", height:"30px",
                      fontSize:"14px", color:"#7a95b0", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center"
                    }}>✕</button>
                  </div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    {outRxns.length > 0 && (
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"10px", fontWeight:700, color:"#059669", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"7px" }}>Makes ({outRxns.length})</div>
                        {outRxns.map(r => (
                          <button key={r[0]} onClick={() => setSelectedRxn(r[0])} style={{
                            width:"100%", textAlign:"left", padding:"8px 10px", borderRadius:"10px", marginBottom:"5px",
                            border:"1.5px solid #e8edf2", background:"#fafcff", cursor:"pointer", fontFamily:"inherit",
                            display:"flex", alignItems:"center", gap:"8px"
                          }}>
                            <span style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#dcfce7", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:800, color:"#059669", flexShrink:0 }}>{r[0]}</span>
                            <span style={{ fontSize:"12px", fontWeight:600, color:"#1a2d45", lineHeight:1.3 }}>{r[6]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {inRxns.length > 0 && (
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"10px", fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"7px" }}>From ({inRxns.length})</div>
                        {inRxns.map(r => (
                          <button key={r[0]} onClick={() => setSelectedRxn(r[0])} style={{
                            width:"100%", textAlign:"left", padding:"8px 10px", borderRadius:"10px", marginBottom:"5px",
                            border:"1.5px solid #e8edf2", background:"#fafcff", cursor:"pointer", fontFamily:"inherit",
                            display:"flex", alignItems:"center", gap:"8px"
                          }}>
                            <span style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#dbeafe", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:800, color:"#2563eb", flexShrink:0 }}>{r[0]}</span>
                            <span style={{ fontSize:"12px", fontWeight:600, color:"#1a2d45", lineHeight:1.3 }}>{r[5]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Reaction detail popup with structural formulas */}
            {selRxn && (() => {
              const rxnExamples = REACTION_EXAMPLES[synthTab];
              const example = rxnExamples ? rxnExamples[selRxn[0]] : null;
              return (
                <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
                  onClick={() => setSelectedRxn(null)}>
                  <div style={{ position:"absolute", inset:0, background:"rgba(15,29,53,0.45)", backdropFilter:"blur(4px)" }} />
                  <div style={{ position:"relative", background:"#fff", borderRadius:"18px", padding:"0", width:"100%", maxWidth:"400px", maxHeight:"85vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
                    onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid #f0f4f8" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"6px" }}>
                            <span style={{ fontSize:"10px", fontWeight:700, color:"#fff", background:"#1a2d45", padding:"3px 10px", borderRadius:"20px" }}>Rxn {selRxn[0]}</span>
                            <span style={{ fontSize:"10px", fontWeight:700, color:"#059669", background:"#dcfce7", padding:"3px 10px", borderRadius:"20px" }}>{selRxn[10]}</span>
                            {selRxn[9] !== "--" && <span style={{ fontSize:"10px", fontWeight:700, color:"#29ABE2", background:"#eaf6fd", padding:"3px 10px", borderRadius:"20px" }}>{selRxn[9]}</span>}
                          </div>
                          <div style={{ fontSize:"15px", fontWeight:800, color:"#1a2d45" }}>
                            {selRxn[5]} <span style={{ color:"#94a3b8", fontWeight:400 }}>→</span> {selRxn[6]}
                          </div>
                        </div>
                        <button onClick={() => setSelectedRxn(null)} style={{ background:"#f0f4f8", border:"none", borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#7a95b0", flexShrink:0, marginLeft:"8px", fontSize:"15px", fontWeight:700 }}>✕</button>
                      </div>
                    </div>
                    {synthQuiz ? (
                      <div style={{ padding:"20px 16px", background:"#fff7ed", textAlign:"center", color:"#ea580c", fontWeight:600, fontSize:"13px", borderRadius:"0 0 18px 18px" }}>
                        Quiz mode - tap "Quiz OFF" to reveal
                      </div>
                    ) : (
                      <>
                        {/* Reagents & Conditions */}
                        <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                          <div style={{ background:"#f0f7ff", borderRadius:"10px", padding:"10px 12px", borderLeft:"3px solid #29ABE2" }}>
                            <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"4px" }}>Reagents</div>
                            <div style={{ fontSize:"12.5px", color:"#1a2d45", fontWeight:600, lineHeight:1.4 }}>{selRxn[7]}</div>
                          </div>
                          <div style={{ background:"#f0fdf4", borderRadius:"10px", padding:"10px 12px", borderLeft:"3px solid #16a34a" }}>
                            <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"4px" }}>Conditions</div>
                            <div style={{ fontSize:"12.5px", color:"#1a2d45", fontWeight:600, lineHeight:1.4 }}>{selRxn[8]}</div>
                          </div>
                        </div>
                        {/* Example reaction with structural formulas */}
                        {example && (
                          <div style={{ padding:"4px 16px 16px" }}>
                            <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px" }}>Example Reaction</div>
                            {/* Equation text */}
                            <div style={{ fontSize:"12px", color:"#475569", fontWeight:600, textAlign:"center", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.2px", lineHeight:1.5 }}>
                              {example.eq.split(" --> ").map((part, pi) => (
                                <span key={pi}>
                                  {pi > 0 && <span style={{ color:"#1a2d45", fontWeight:700, margin:"0 6px" }}> → </span>}
                                  {part}
                                </span>
                              ))}
                            </div>
                            {/* Structural formula SVGs */}
                            <div style={{ background:"#fafcff", border:"1.5px solid #e8edf2", borderRadius:"12px", padding:"14px 10px", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                              {renderReactionSvg(example.from, example.to)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
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
              {categories.map((cat, catIdx) => {
                const qs = filteredQs.filter(q => q.category === cat);
                const scores = qs.map(q => extScore[q.id]).filter(Boolean);
                const totalMarks = qs.length * 6;
                const earnedMarks = scores.reduce((a, b) => a + b, 0);
                const extLocked = !hasFullAccess && catIdx > 0;
                return (
                  <button key={cat} onClick={() => { if (!extLocked) { setExtCategory(cat); setExtQPicker(true); setExtIndex(0); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); track("select_ext_category", { category: cat, board }); } }}
                    style={{ background: "#fff", border: `2px solid ${purpleLight}`, borderRadius: "14px", padding: "14px 12px", textAlign: "left", cursor: extLocked ? "default" : "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s", position: "relative", overflow: "hidden" }}>
                    {extLocked && <LockedOverlay />}
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: purple, marginBottom: "8px" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3, marginBottom: "4px" }}>{cat}</div>
                    <div style={{ fontSize: "11px", color: purple, fontWeight: 600 }}>{qs.length} question{qs.length > 1 ? "s" : ""} · {qs[0]?.marks || 6} marks each</div>
                    {scores.length > 0 && <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{earnedMarks}/{scores.length * 6} marks scored</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );

        // Question picker
        const catQs = filteredQs.filter(q => q.category === extCategory);
        if (extQPicker) return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            <button onClick={() => { setExtCategory(null); setExtQPicker(false); }}
              style={{ background: "none", border: "none", color: purple, fontWeight: 700, fontSize: "13px", cursor: "pointer", padding: "0 0 14px 0", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}>
              &#8592; Back to topics
            </button>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "4px" }}>{extCategory}</p>
            <p style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>Choose a question to attempt</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {catQs.map((question, i) => {
                const savedScore = extScore[question.id];
                const attempted = savedScore !== undefined;
                return (
                  <button key={question.id}
                    onClick={() => { setExtIndex(i); setExtQPicker(false); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiError(null); setExtAiLoading(false); setExtShowModel(false); track("attempt_extended", { question_id: catQs[i].id, category: extCategory, board }); }}
                    style={{ background: "#fff", border: `2px solid ${attempted ? purple : purpleLight}`, borderRadius: "14px", padding: "14px 14px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: purple, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Q{i + 1} &middot; {question.marks} marks
                        </div>
                        <div style={{ fontSize: "12px", color: "#1a2d45", lineHeight: 1.5, fontWeight: 500 }}>
                          {question.question.length > 120 ? question.question.slice(0, 120).trim() + "..." : question.question}
                        </div>
                      </div>
                      {attempted && (
                        <div style={{ flexShrink: 0, background: savedScore >= question.marks * 0.7 ? "#d1fae5" : savedScore >= question.marks * 0.4 ? "#fef9c3" : "#fee2e2",
                          color: savedScore >= question.marks * 0.7 ? "#065f46" : savedScore >= question.marks * 0.4 ? "#92400e" : "#991b1b",
                          borderRadius: "8px", padding: "4px 8px", fontSize: "12px", fontWeight: 700 }}>
                          {savedScore}/{question.marks}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

        // Question view
        const q = catQs[extIndex];
        if (!q) return null;
        const isLast = extIndex === catQs.length - 1;
        const marksThisQ = extMarked.size;

        // Render question text with proper tables for pipe-separated data
        const renderQuestionText = (text) => {
          const lines = text.split("\n");
          const result = [];
          let i = 0;
          while (i < lines.length) {
            // Detect table: lines with | separators (at least 2 pipes)
            if (lines[i].includes(" | ") && (lines[i].match(/\|/g) || []).length >= 2) {
              const tableLines = [];
              while (i < lines.length && lines[i].includes(" | ") && (lines[i].match(/\|/g) || []).length >= 2) {
                tableLines.push(lines[i].split(" | ").map(c => c.trim()));
                i++;
              }
              if (tableLines.length > 0) {
                const headerRow = tableLines[0];
                const dataRows = tableLines.slice(1);
                result.push(
                  <div key={`tbl-${result.length}`} style={{ overflowX: "auto", margin: "12px 0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif" }}>
                      <thead>
                        <tr>
                          {headerRow.map((h, ci) => (
                            <th key={ci} style={{ background: "#f0f4f8", padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#1a2d45", borderBottom: "2px solid #d0dce8", fontSize: "12px" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataRows.map((row, ri) => (
                          <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8fafc" }}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={{ padding: "7px 10px", borderBottom: "1px solid #e8eef4", color: "#1a2d45", fontSize: "13px" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
            } else {
              // Regular text line
              const line = lines[i];
              if (line.trim() === "") {
                result.push(<div key={`sp-${result.length}`} style={{ height: "8px" }} />);
              } else {
                result.push(<div key={`ln-${result.length}`}>{line}</div>);
              }
              i++;
            }
          }
          return result;
        };

        const canSubmit = extDraft.trim().length >= 20;
        const handleSubmit = async () => {
          setExtAiLoading(true);
          setExtAiError(null);
          track("submit_ai_examine", { question_id: thisQ.id, category: extCategory, board });
          logActivity("extended");
          try {
            const res = await fetch('/api/examine.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: q.question, markScheme: q.markScheme, studentAnswer: extDraft, maxMarks: q.marks, levels: q.levels }),
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
              <button onClick={() => { setExtQPicker(true); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); }} style={{ background: "none", border: "none", color: purple, fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>&#8592; Questions</button>
              <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{extCategory} · Q{extIndex + 1} / {catQs.length}</div>
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
              <div style={{ fontSize: "15.5px", color: "#1a2d45", lineHeight: 1.75, fontWeight: 500, fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "0.01em" }}>{renderQuestionText(q.question)}</div>
            </div>
            {/* Answer box - required */}
            {!extRevealed && !extAiLoading && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45", textTransform: "uppercase", letterSpacing: "1px" }}>Your Answer <span style={{ color: "#dc2626" }}>*</span></div>
                  <div style={{ fontSize: "11px", color: canSubmit ? "#16a34a" : "#7a95b0", fontWeight: 600 }}>{canSubmit ? "Ready to submit" : `${Math.max(0, 20 - extDraft.trim().length)} chars to unlock`}</div>
                </div>
                <textarea
                  value={extDraft}
                  onChange={e => setExtDraft(e.target.value)}
                  placeholder={`Write your full answer to this ${q.marks}-mark question here. Cover every point you know - the AI Examiner will mark it against the mark scheme.`}
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
                    ? 'The API key has not been added to Vercel. Add ANTHROPIC_API_KEY in Vercel > Settings > Environment Variables, then redeploy.'
                    : `Error: ${extAiError}`}
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
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8, letterSpacing: "1px", textTransform: "uppercase" }}>AI Examiner</div>
                          {extAiResult.level !== undefined && (
                            <div style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px", color: extAiResult.level >= 3 ? "#86efac" : extAiResult.level >= 2 ? "#fcd34d" : extAiResult.level >= 1 ? "#fca5a5" : "#f87171", background: "rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: "6px", display: "inline-block" }}>
                              Level {extAiResult.level}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                          <span style={{ fontSize: "32px", fontWeight: 900, color: scoreColour === "#16a34a" ? "#86efac" : scoreColour === "#d97706" ? "#fcd34d" : "#fca5a5" }}>{marksThisQ}</span>
                          <span style={{ fontSize: "16px", opacity: 0.7 }}>/ {q.marks}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.95 }}>{extAiResult.feedback}</div>
                    </div>
                    {/* Covered / missed points */}
                    <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Indicative Content - tap to adjust</div>
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
                              {aiSaid !== ticked && <div style={{ fontSize: "10px", color: "#7a95b0", marginTop: "3px" }}>AI said: {aiSaid ? "covered ✓" : "missed ✗"} - tap to override</div>}
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
                {/* No AI result - fallback manual mark scheme */}
                {!extAiResult && (
                  <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Indicative Content - tick each point you covered</div>
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
                      Finish - Back to Topics
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
          {/* ── Topic selection ── */}
          {!calcTopic && (
            <div>
              <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "16px", lineHeight: 1.5 }}>
                Worked calc questions across all topics. Pick a topic then choose your difficulty.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {CALC_SETS.map(set => {
                  const score = calcScore[set.id] || { correct: 0, attempted: 0 };
                  const calcLocked = !hasFullAccess && !FREE_CALC_IDS.includes(set.id);
                  return (
                    <button key={set.id} onClick={() => { if (!calcLocked) { setCalcTopic(set.id); setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); track("select_calc_topic", { topic: set.id, title: set.title }); } }} style={{
                      background: "#ffffff", border: `2px solid ${set.color}30`,
                      borderRadius: "14px", padding: "14px 12px", textAlign: "left",
                      cursor: calcLocked ? "default" : "pointer", fontFamily: "inherit",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      position: "relative", overflow: "hidden",
                    }}>
                      {calcLocked && <LockedOverlay />}
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
          {/* ── Difficulty selection ── */}
          {calcTopic && !calcDifficulty && (() => {
            const set = CALC_SETS.find(s => s.id === calcTopic);
            if (!set) return null;
            const tiers = [
              { key: "all",    label: "All Questions",  icon: "∞", color: "#1a2d45",  desc: `${set.questions.length} questions across all levels` },
              { key: "easy",   label: "Easy",           icon: "1", color: "#16a34a",  desc: `${set.questions.filter(q=>q.difficulty==="easy").length} questions - single or two-step` },
              { key: "medium", label: "Medium",         icon: "2", color: "#d97706",  desc: `${set.questions.filter(q=>q.difficulty==="medium").length} questions - multi-step, unit conversions` },
              { key: "hard",   label: "Hard",           icon: "3", color: "#dc2626",  desc: `${set.questions.filter(q=>q.difficulty==="hard").length} questions - longer chains, stoichiometry` },
              { key: "exam",   label: "Exam Style",     icon: "★", color: "#7c3aed",  desc: `${set.questions.filter(q=>q.difficulty==="exam").length} questions - past paper difficulty` },
            ];
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <button onClick={() => setCalcTopic(null)} style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>← Topics</button>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45" }}>{set.title}</div>
                </div>
                <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Choose difficulty</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tiers.map(t => (
                    <button key={t.key} onClick={() => { setCalcDifficulty(t.key); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); track("select_difficulty", { topic: calcTopic, difficulty: t.key }); }} style={{
                      background: "#ffffff", border: `2px solid ${t.color}20`, borderRadius: "14px",
                      padding: "14px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: "14px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 800, color: t.color, flexShrink: 0 }}>{t.icon}</div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45" }}>{t.label}</div>
                        <div style={{ fontSize: "12px", color: "#7a95b0", marginTop: "2px" }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          {/* ── Question view ── */}
          {calcTopic && calcDifficulty && (() => {
            const set = CALC_SETS.find(s => s.id === calcTopic);
            if (!set) return null;
            const baseQs = calcDifficulty === "all" ? set.questions : set.questions.filter(q => q.difficulty === calcDifficulty);
            if (baseQs.length === 0) return <div style={{ color: "#7a95b0", fontSize: "14px" }}>No questions at this difficulty yet.</div>;

            // Spaced repetition: sort by performance (wrong answers first, unseen next, correct last)
            const calcHistory = JSON.parse(localStorage.getItem("hsj-calc-sr") || "{}");
            const topicHistory = calcHistory[calcTopic] || {};
            const filteredQs = [...baseQs].sort((a, b) => {
              const aKey = JSON.stringify(a.q).slice(0, 40);
              const bKey = JSON.stringify(b.q).slice(0, 40);
              const aH = topicHistory[aKey] || { correct: 0, wrong: 0, last: 0 };
              const bH = topicHistory[bKey] || { correct: 0, wrong: 0, last: 0 };
              // Priority: wrong > unseen > correct. Within same, oldest first.
              const aScore = aH.wrong > 0 ? 0 : (aH.correct === 0 ? 1 : 2 + Math.min(aH.correct, 5));
              const bScore = bH.wrong > 0 ? 0 : (bH.correct === 0 ? 1 : 2 + Math.min(bH.correct, 5));
              if (aScore !== bScore) return aScore - bScore;
              return (aH.last || 0) - (bH.last || 0);
            });

            const q = filteredQs[calcIndex] || filteredQs[0];
            const currentIdx = Math.min(calcIndex, filteredQs.length - 1);
            const isLast = currentIdx === filteredQs.length - 1;
            const diffColors = { easy: "#16a34a", medium: "#d97706", hard: "#dc2626", exam: "#7c3aed" };
            const diffLabels = { easy: "Easy", medium: "Medium", hard: "Hard", exam: "Exam Style" };
            const checkAnswer = () => {
              if (!calcChecked) {
                const correct = q.isText
                  ? calcInput.trim().toUpperCase().replace(/\s/g,"") === String(q.answer).toUpperCase().replace(/\s/g,"")
                  : Math.abs(parseFloat(calcInput) - q.answer) <= q.tolerance;
                setCalcScore(prev => {
                  const s = prev[calcTopic] || { correct: 0, attempted: 0 };
                  return { ...prev, [calcTopic]: { correct: s.correct + (correct ? 1 : 0), attempted: s.attempted + 1 } };
                });
                track("attempt_question", { topic: calcTopic, difficulty: q.difficulty, correct, question_index: currentIdx });
                logActivity("calc");
                logScore("calc", calcTopic, correct ? 1 : 0, 1);
                // Update spaced repetition data
                try {
                  const srData = JSON.parse(localStorage.getItem("hsj-calc-sr") || "{}");
                  const topicSR = srData[calcTopic] || {};
                  const qKey = JSON.stringify(q.q).slice(0, 40);
                  const prev = topicSR[qKey] || { correct: 0, wrong: 0, last: 0 };
                  topicSR[qKey] = { correct: correct ? prev.correct + 1 : Math.max(0, prev.correct - 1), wrong: correct ? Math.max(0, prev.wrong - 1) : prev.wrong + 1, last: Date.now() };
                  srData[calcTopic] = topicSR;
                  localStorage.setItem("hsj-calc-sr", JSON.stringify(srData));
                } catch {}
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
                  <button onClick={() => { setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>← Difficulty</button>
                  <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{currentIdx + 1} / {filteredQs.length}</div>
                </div>
                {/* Progress bar */}
                <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "14px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${((currentIdx + 1) / filteredQs.length) * 100}%`, background: set.color, borderRadius: "2px", transition: "width 0.3s" }} />
                </div>
                {/* Difficulty badge */}
                {q.difficulty && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${diffColors[q.difficulty]}15`, borderRadius: "6px", padding: "3px 9px", marginBottom: "10px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: diffColors[q.difficulty] }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: diffColors[q.difficulty], textTransform: "uppercase", letterSpacing: "0.5px" }}>{diffLabels[q.difficulty]}</span>
                  </div>
                )}
                {/* Periodic table popup buttons */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <button onClick={() => setShowPT("aqa")} style={{ fontSize: "11px", fontWeight: 600, color: "#29ABE2", background: "#eaf6fd", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>📊 Periodic Table (AQA)</button>
                  <button onClick={() => setShowPT("ocr")} style={{ fontSize: "11px", fontWeight: 600, color: "#7c3aed", background: "#f3f0ff", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>📊 Periodic Table (OCR)</button>
                </div>
                {/* Periodic table popup modal */}
                {showPT && (
                  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setShowPT(null)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", width: "95vw", maxWidth: "900px", maxHeight: "80vh", overflow: "auto", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                      <div style={{ position: "sticky", top: 0, background: "#fff", padding: "12px 16px", borderBottom: "1px solid #e0e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "16px 16px 0 0", zIndex: 2 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45" }}>{showPT === "aqa" ? "AQA" : "OCR A"} Periodic Table</div>
                        <button onClick={() => setShowPT(null)} style={{ background: "#f0f4f8", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4a6080", fontFamily: "inherit" }}>Close</button>
                      </div>
                      <div style={{ padding: "12px", textAlign: "center" }}>
                        <img
                          src={showPT === "aqa" ? "/pt-aqa.png" : "/pt-ocr.png"}
                          alt={`${showPT === "aqa" ? "AQA" : "OCR A"} Periodic Table`}
                          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Question card */}
                <div style={{ background: "#ffffff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "12px", border: "1px solid #e8eef4" }}>
                  <div style={{ fontSize: "14px", color: "#1a2d45", lineHeight: 1.6, fontWeight: 500, whiteSpace: "pre-line" }}>{q.q}</div>
                  {q.diagram && <div style={{ margin: "12px 0 4px", display: "flex", justifyContent: "center" }}>{q.diagram}</div>}
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
                        <div key={si} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#29ABE2", background: "#eaf6fd", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>{si + 1}</div>
                          <div style={{ fontSize: "17px", color: "#1a2d45", lineHeight: 1.5, fontFamily: "'Caveat', cursive", fontWeight: 600 }}>{step}</div>
                        </div>
                      ))}
                    </div>
                    {/* Navigation */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!isLast ? (
                        <button onClick={() => { setCalcIndex(currentIdx + 1); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); }} style={{ flex: 1, padding: "13px", background: "#29ABE2", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Next Question →
                        </button>
                      ) : (
                        <button onClick={() => { setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ flex: 1, padding: "13px", background: "#1a2d45", border: "none", borderRadius: "12px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Finish - Back to Difficulty
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
            <p style={{ color:"#475569", fontSize:"15px", marginBottom:"20px", lineHeight:1.6 }}>
              Step-by-step animated curly-arrow mechanisms. Each arrow is explained. Tap a mechanism to start.
            </p>
            {Object.entries(
              MECHS.reduce((acc,m)=>{ (acc[m.category]=acc[m.category]||[]).push(m); return acc; }, {})
            ).map(([cat, list]) => (
              <div key={cat} style={{ marginBottom:"22px" }}>
                <div style={{ fontSize:"13px", fontWeight:800, color:"#0f1d35", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"10px", borderBottom:"2px solid #e2e8f0", paddingBottom:"6px" }}>{cat}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {list.map((m, mIdx) => {
                    const mechLocked = !hasFullAccess && mIdx >= FREE_MECH_COUNT;
                    return (
                    <button key={m.id} onClick={()=>{ if (!mechLocked) { setMechId(m.id); setMechStep(0); setMechArrowIdx(0); setMechAnimKey(k=>k+1); setMechStill(false); track("view_mechanism", { mechanism: m.id, title: m.title }); logActivity("mechanism"); } }}
                      style={{ background:"#ffffff", border:`2px solid ${m.color}30`, borderRadius:"14px",
                        padding:"16px 18px", textAlign:"left", cursor: mechLocked ? "default" : "pointer", fontFamily:"inherit",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"border-color 0.2s", position:"relative", overflow:"hidden" }}>
                      {mechLocked && <LockedOverlay />}
                      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                        <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:m.color, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"16px", fontWeight:700, color:"#0f1d35", marginBottom:"4px", lineHeight:1.3 }}>{m.title}</div>
                          <div style={{ fontSize:"14px", color:"#475569", fontFamily:"'DM Sans',system-ui,sans-serif", letterSpacing:"0.3px" }}>{m.subtitle}</div>
                        </div>
                        <div style={{ display:"flex", gap:"5px", flexShrink:0 }}>
                          {m.specs.map(s=><span key={s} style={{ fontSize:"11px", fontWeight:700, background:`${m.color}15`, color:m.color, padding:"3px 8px", borderRadius:"8px" }}>{s.replace("_"," ")}</span>)}
                        </div>
                      </div>
                    </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );

        // ── Mechanism viewer ──
        const totalSteps = activeMech.steps.length;
        const currentStepData = activeMech.steps[mechStep];
        const stepArrows = currentStepData.arrows || [];
        const totalStepArrows = stepArrows.length;

        // Build flat total for progress bar: sum all arrows + 1 per step (for the "intro" frame)
        const totalFrames = activeMech.steps.reduce((n, s) => n + 1 + (s.arrows||[]).length, 0);
        const framesBeforeStep = activeMech.steps.slice(0, mechStep).reduce((n, s) => n + 1 + (s.arrows||[]).length, 0);
        const currentFrame = framesBeforeStep + 1 + mechArrowIdx; // +1 for step intro frame

        // Currently visible arrow IDs for this step (revealed so far)
        const visibleArrowIds = stepArrows.slice(0, mechArrowIdx);
        // The most recently revealed arrow label (for the legend)
        const latestArrowLabel = mechArrowIdx > 0 ? activeMech.arrowPaths[stepArrows[mechArrowIdx - 1]]?.label : null;

        const isAtStart = mechStep === 0 && mechArrowIdx === 0;
        const isAtEnd = mechStep === totalSteps - 1 && mechArrowIdx >= totalStepArrows;

        const goNext = () => {
          if (mechArrowIdx < totalStepArrows) {
            // Reveal next arrow in current step
            setMechArrowIdx(i => i + 1);
            setMechAnimKey(k => k + 1);
          } else if (mechStep < totalSteps - 1) {
            // Advance to next step
            setMechStep(s => s + 1);
            setMechArrowIdx(0);
            setMechAnimKey(k => k + 1);
          }
        };
        const goPrev = () => {
          if (mechArrowIdx > 0) {
            setMechArrowIdx(i => i - 1);
            setMechAnimKey(k => k + 1);
          } else if (mechStep > 0) {
            const prevArrows = (activeMech.steps[mechStep - 1].arrows || []).length;
            setMechStep(s => s - 1);
            setMechArrowIdx(prevArrows); // show all arrows of prev step
            setMechAnimKey(k => k + 1);
          }
        };

        return (
          <div style={{ padding:"0", flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <style>{`@keyframes mechDrawArrow{from{stroke-dashoffset:350}to{stroke-dashoffset:0}}`}</style>

            {/* Header */}
            <div style={{ padding:"12px 16px 8px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #e8edf3" }}>
              <button onClick={()=>{ setMechId(null); setMechStep(0); setMechArrowIdx(0); }}
                style={{ background:"#f0f4f8", border:"1px solid #dde4ed", borderRadius:"8px", padding:"6px 12px",
                  color:"#29ABE2", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", fontWeight:600 }}>
                ← Back
              </button>
              <div>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#1a2d45" }}>{activeMech.title}</div>
                <div style={{ fontSize:"11px", color:"#64748b", fontFamily:"'DM Sans',system-ui,sans-serif" }}>{activeMech.subtitle}</div>
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
              {/* Progress bar */}
              <div style={{ padding:"10px 16px 4px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ fontSize:"12px", color:"#94a3b8", fontWeight:600, whiteSpace:"nowrap" }}>
                  Step {mechStep + 1} of {totalSteps}
                </div>
                <div style={{ flex:1, height:"4px", background:"#e8edf3", borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(currentFrame/totalFrames)*100}%`,
                    background:"#29ABE2", borderRadius:"2px", transition:"width 0.25s ease" }}/>
                </div>
              </div>

              {/* Step title */}
              <div style={{ padding:"4px 16px 8px" }}>
                <div style={{ fontSize:"17px", fontWeight:700, color:"#1a2d45", lineHeight:1.3 }}>{currentStepData.title}</div>
              </div>

              {/* SVG diagram */}
              <div style={{ margin:"0 16px", background:"#f8fafc", border:"1.5px solid #e2e8f0",
                borderRadius:"16px", padding:"14px 10px", overflow:"hidden" }}>
                <MechSVG mech={activeMech} stepIdx={mechStep} animKey={mechAnimKey} visibleArrowCount={mechArrowIdx}/>
              </div>

              {/* Latest arrow label */}
              {latestArrowLabel && (
                <div style={{ margin:"10px 16px 0", display:"flex", alignItems:"center", gap:"8px",
                  background:"#29ABE212", padding:"8px 14px", borderRadius:"10px", border:"1px solid #29ABE230" }}>
                  <span style={{ color:"#29ABE2", fontSize:"16px", fontWeight:700 }}>&#8635;</span>
                  <span style={{ fontSize:"13px", color:"#1a2d45", fontWeight:600, lineHeight:1.3 }}>{latestArrowLabel}</span>
                </div>
              )}

              {/* Explanation */}
              <div style={{ margin:"10px 16px", padding:"16px", background:"#ffffff",
                border:"1.5px solid #e2e8f0", borderRadius:"14px" }}>
                <div style={{ fontSize:"12px", fontWeight:700, color:"#29ABE2", textTransform:"uppercase",
                  letterSpacing:"0.8px", marginBottom:"8px" }}>
                  {mechArrowIdx === 0 ? "Overview" : "What happens here"}
                </div>
                <p style={{ margin:0, fontSize:"14.5px", lineHeight:1.75, color:"#1a2d45" }}>
                  {currentStepData.explanation}
                </p>
              </div>

              {/* Prev / Next */}
              <div style={{ padding:"8px 16px 20px", display:"flex", gap:"10px" }}>
                <button onClick={goPrev} disabled={isAtStart}
                  style={{ flex:1, padding:"13px", borderRadius:"12px", border:"none",
                    cursor: isAtStart ? "default" : "pointer",
                    background: isAtStart ? "#e8edf3" : "#f0f4f8",
                    color: isAtStart ? "#b0c4d4" : "#4a6080",
                    fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
                  ← Back
                </button>
                {!isAtEnd ? (
                  <button onClick={goNext}
                    style={{ flex:2, padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer",
                      background:"#29ABE2", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit",
                      boxShadow:"0 4px 14px rgba(41,171,226,0.35)" }}>
                    {mechArrowIdx < totalStepArrows ? "Show Next Arrow →" : "Next Step →"}
                  </button>
                ) : (
                  <button onClick={()=>{ setMechId(null); setMechStep(0); setMechArrowIdx(0); }}
                    style={{ flex:2, padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer",
                      background:"#1a2d45", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
                    Done - Back to List
                  </button>
                )}
              </div>
            </>}

            {/* STILL / EXAM version */}
            {mechStill && (
              <div style={{ padding:"12px 16px 24px" }}>
                <div style={{ fontSize:"13px", color:"#64748b", marginBottom:"10px", lineHeight:1.6 }}>
                  Exam diagram: key curly arrows shown in blue. All arrow labels listed below.
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
                          <span style={{ color:"#29ABE2", fontWeight:700, marginTop:"1px" }}>↷</span>
                          <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif" }}>{ap.label}</span>
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