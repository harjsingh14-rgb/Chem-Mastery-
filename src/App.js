import { useState, useCallback, useEffect, useRef } from "react";

const SETS = {
  "3.1.1": { title: "Atomic Structure", cards: [
    {q:"What is the relative mass of a proton?",a:"1"},{q:"What is the relative charge of a proton?",a:"+1"},{q:"What is the relative mass of a neutron?",a:"1"},{q:"What is the relative charge of a neutron?",a:"0"},{q:"What is the relative mass of an electron?",a:"1/1840"},{q:"What is the relative charge of an electron?",a:"−1"},{q:"Where are protons and neutrons positioned within an atom?",a:"Within the nucleus of the atom."},{q:"Where are electrons positioned within an atom?",a:"Electrons are located in orbitals within subshells around the nucleus of an atom."},{q:"What are isotopes?",a:"Atoms of the same element with the same number of protons but different mass numbers due to varying numbers of neutrons."},{q:"What are the physical and chemical properties of isotopes?",a:"Slightly different physical properties (different masses).\nSimilar chemical properties (same electronic configuration)."},{q:"What was Dalton's early model of the atom?",a:"In the early 19th century, Dalton described atoms as solid spheres. Different spheres represented different elements."},{q:"What was J. J. Thomson's contribution to atomic structure?",a:"In 1897, Thomson discovered the electron → atoms are not solid and indivisible → 'plum pudding model' of a positively charged sphere containing electrons."},{q:"What was Rutherford's gold foil experiment?",a:"1. Fired alpha particles at thin gold sheet\n2. Most passed through → mostly empty space\n3. A few deflected → small, dense, positive nucleus\n4. Plum pudding model disproved"},{q:"What was the key idea of Rutherford's nuclear model?",a:"Tiny, dense, positively charged nucleus surrounded by a cloud of negative electrons, with most of the atom being empty space."},{q:"How did Bohr solve the problem with Rutherford's model?",a:"Proposed electrons exist in fixed orbits (shells) at specific energies. Movement between shells involves emission or absorption of EM radiation of fixed frequency."},{q:"Why was Bohr's model accepted?",a:"It matched experimental observations of radiation absorbed and emitted by atoms, providing evidence for fixed energy levels."},{q:"How was the Bohr model refined?",a:"Not all electrons in a shell have the same energy → model refined to include sub-shells."},{q:"What are the stages of a TOF mass spectrometer?",a:"1. Ionisation\n2. Acceleration\n3. Ion drift\n4. Detection"},{q:"What is a mass spectrometer used for?",a:"To determine all isotopes present in a sample and to determine the elements or compounds within it."},{q:"Why is a mass spectrometer operated under a vacuum?",a:"To prevent air particles from becoming ionised and registering on the detector."},{q:"What are the two ways of ionisation in TOF mass spectrometry?",a:"Electron impact and electrospray ionisation."},{q:"What are the steps in electron impact ionisation?",a:"1. Vaporised sample injected at low pressure\n2. Electron gun fires high-energy electrons, knocking out an outer electron\n3. Forms positive ions"},{q:"What are the steps in electrospray ionisation?",a:"1. Sample dissolved in a volatile, polar solvent\n2. Injected through a fine needle at high voltage\n3. Molecule gains a proton → MH⁺"},{q:"Why must electrospray solvent be volatile and polar?",a:"Volatile → evaporates easily, leaving ions to move to negative plate.\nPolar → supplies molecules with hydrogen ions."},{q:"Electron impact vs electrospray — which molecules?",a:"Electron impact: low Mr compounds (larger molecules fragment).\nElectrospray: larger organic molecules e.g. proteins (gentler, less fragmentation)."},{q:"What happens during acceleration in TOF?",a:"All positive ions accelerated by an electric field from a negatively charged plate. Each ion given the same kinetic energy."},{q:"What determines the velocity of ions in TOF?",a:"Mass of ions. Lighter ions → higher velocity. Heavier ions → slower (KE = ½mv²)."},{q:"How are ions separated in the drift stage?",a:"By m/z values. Higher m/z → longer flight time. Different flight times recorded at detector."},{q:"What happens during detection in TOF?",a:"Ions gain an electron → generates current → fed into computer. Current magnitude ∝ abundance of ion species."},{q:"What is relative atomic mass?",a:"Weighted average mass of isotopes of an element, relative to 1/12th of the mass of carbon-12."},{q:"What is relative isotopic mass?",a:"Mass of a particular isotope compared with carbon-12."},{q:"What is relative molecular mass (Mr)?",a:"Average mass of a molecule compared with carbon-12 (taken as 12)."},{q:"What is the formula for RAM?",a:"RAM = Σ(isotopic mass × % abundance) ÷ 100"},{q:"How might they trick you with RAM questions?",a:"Relative abundances may not total 100 — they're based on the sample's total relative abundance."},{q:"Isotopic composition of Cl and Br?",a:"Cl: ³⁵Cl (75%), ³⁷Cl (25%)\nBr: ⁷⁹Br (50%), ⁸¹Br (50%)"},{q:"Ratio of diatomic ions for Cl and Br?",a:"Chlorine: 9:6:1\nBromine: 1:2:1"},{q:"What is a molecular ion?",a:"The highest m/z peak on the mass spectrum."},{q:"Molecular ion with electrospray — what to remember?",a:"Subtract 1 from m/z to account for the H⁺ ion."},{q:"What are principal energy levels divided into?",a:"Sub-energy levels: s, p, d and f."},{q:"How many electrons does each sub-energy level hold?",a:"s: 2 | p: 6 | d: 10 | f: 14"},{q:"What are sub-energy levels divided into?",a:"Orbitals — each holds up to 2 electrons with opposite spins."},{q:"What do orbitals represent?",a:"Mathematical probabilities of finding an electron at any point within a certain distance from the nucleus."},{q:"Order of electron filling?",a:"1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶"},{q:"Rule for spin diagrams?",a:"Electrons fill orbitals singly before pairing up."},{q:"Outer electron and periodic table position?",a:"The sub-energy level of the outermost electron determines the block (e.g. sodium → s sub-level → s-block)."},{q:"How do d-block elements lose electrons?",a:"From the 4s orbital before the 3d orbital."},{q:"Exceptions to conventional electronic configuration?",a:"Cu and Cr promote an electron from 4s to 3d → half-filled or fully filled 3d subshell."},{q:"What is first ionisation energy?",a:"Minimum energy to remove one electron from one mole of gaseous atoms → one mole of gaseous 1+ ions."},{q:"First ionisation equation for Mg?",a:"Mg(g) → Mg⁺(g) + e⁻"},{q:"What is second ionisation energy?",a:"Enthalpy change when 1 mol of electrons is removed from 1 mol of gaseous 1+ ions → gaseous 2+ ions."},{q:"Factors affecting ionisation energy?",a:"1. Nuclear charge\n2. Atomic radius\n3. Shielding"},{q:"Why are successive ionisation energies always larger?",a:"Each electron removed → positive charge increases → stronger attraction to remaining electrons → more energy needed."},{q:"Large jump in successive ionisation energies indicates?",a:"The element's group in the periodic table."},{q:"Why does He have the largest first IE?",a:"Electron in closest shell to nucleus. No inner shell shielding. One more proton than H → stronger attraction."},{q:"Why do first IEs decrease down a group?",a:"Outer electrons further from nucleus. More shielding. Weaker electrostatic attraction."},{q:"Why does first IE generally increase across a period?",a:"Same number of shells → similar shielding. Nuclear charge increases → stronger attraction to outer electron."},{q:"Why the drop in first IE from Mg to Al?",a:"Al fills 3p (Mg is 3s). 3p is higher energy → easier to remove. Additional shielding from 3s electrons."},{q:"Why the drop in first IE from P to S?",a:"In S, 4th electron in 3p pairs up → electron-electron repulsion makes paired electron easier to remove."},
  ]},
  "3.1.2": { title: "Amount of Substance", cards: [
    {q:"What does Avogadro's constant represent?",a:"The number of molecules in one mole of any substance."},{q:"How do you calculate mass of a substance?",a:"Mass = Mr × Moles"},{q:"Formula for moles in a solution?",a:"n = c × v\nn = moles, c = concentration (mol dm⁻³), v = volume (dm³)"},{q:"What is the ideal gas equation?",a:"pV = nRT\np = pressure (Pa), V = volume (m³)\nn = moles, R = gas constant, T = temperature (K)"},{q:"Convert °C to K?",a:"+273"},{q:"Convert K to °C?",a:"−273"},{q:"Convert kPa to Pa?",a:"×1000"},{q:"Convert cm³ to m³?",a:"÷1,000,000"},{q:"Definition of empirical formula?",a:"Simplest whole number ratio of each element in a compound."},{q:"Definition of molecular formula?",a:"The actual number of atoms of each element in the compound."},{q:"Deduce molecular formula: empirical C₃H₆O, Mr = 116",a:"C₃H₆O has Mr of 58. Fits twice into 116.\nMolecular formula = C₆H₁₂O₂"},{q:"How to find waters of crystallisation in a hydrated salt?",a:"Use the empirical formula method with two compounds (water and the salt)."},{q:"Purpose of heating in a crucible?",a:"Measure mass loss during thermal decomposition, or mass gain when reacting Mg with O₂."},{q:"Method for heating in a crucible?",a:"1. Weigh empty dry crucible + lid\n2. Add ~2g hydrated salt, reweigh\n3. Heat strongly\n4. Cool\n5. Reweigh\n6. Repeat until constant mass"},{q:"Why use the lid during heating?",a:"Prevents loss of solid while allowing gas to escape."},{q:"Why not use large amounts of hydrated salt?",a:"Decomposition is likely to be incomplete."},{q:"Why must the crucible be dry?",a:"Water loss from heating would cause larger mass loss than expected → inaccurate results."},{q:"Why not use very small amounts of solid?",a:"High percentage uncertainties in weighing."},{q:"Convert g dm⁻³ to mol dm⁻³?",a:"Concentration (g dm⁻³) = Concentration (mol dm⁻³) × Mr"},{q:"First step in making a volumetric solution?",a:"1. Weigh sample bottle with solid on 2 d.p. balance\n2. Transfer solid to beaker, reweigh bottle to find difference"},{q:"Next step after weighing the solid?",a:"Add 100 cm³ distilled water. Use glass rod to stir and dissolve."},{q:"If substance doesn't dissolve in cold water?",a:"Heat the beaker gently until the solid dissolves completely."},{q:"How to transfer solution to volumetric flask?",a:"1. Pour via funnel into 250 cm³ flask\n2. Rinse beaker and funnel, add washings\n3. Use glass rod to transfer all washings"},{q:"How to reach correct volume?",a:"Make up to the mark with distilled water, last few drops with a dropping pipette. Bottom of meniscus on the line."},{q:"How to ensure uniform solution?",a:"Invert the flask several times to mix thoroughly."},{q:"How do you calculate atom economy?",a:"% Atom economy = (Mr of desired product ÷ sum Mr of all reactants) × 100"},{q:"How do you calculate percentage yield?",a:"% Yield = (actual yield ÷ theoretical yield) × 100"},{q:"How do you calculate percentage uncertainty?",a:"% Uncertainty = (uncertainty ÷ measurement made on apparatus) × 100"},{q:"What does concordant results mean?",a:"Within 0.10 cm³ of each other → allows you to calculate a mean titre."},{q:"Phenolphthalein in acid?",a:"Colourless"},{q:"Phenolphthalein in alkali?",a:"Pink"},{q:"Phenolphthalein endpoint?",a:"Very pale pink"},{q:"Methyl orange in acid?",a:"Red"},{q:"Methyl orange in alkali?",a:"Yellow"},{q:"Methyl orange endpoint?",a:"Pale orange"},
  ]},
  "3.1.3": { title: "Bonding", cards: [
    {q:"What is a covalent bond?",a:"A shared pair of electrons."},{q:"What is electronegativity?",a:"The power of an atom to attract a pair of electrons in a covalent bond."},{q:"How is electronegativity measured?",a:"Pauling scale, 0 to 4.0"},{q:"Electronegativity trend across a period?",a:"Increases: more protons, same shielding, smaller atomic radius."},{q:"Electronegativity trend down a group?",a:"Decreases: more energy levels, more shielding, larger atomic radius."},{q:"Most electronegative atom?",a:"F — Fluorine"},{q:"What is a polar bond?",a:"A covalent bond where the electron density is unevenly distributed."},{q:"Are planar molecules like F₂ polar?",a:"No — the electron cloud is evenly distributed."},{q:"Partial charge on more electronegative atom?",a:"δ−"},{q:"Partial charge on less electronegative atom?",a:"δ+"},{q:"What happens with very large electronegativity difference?",a:"Such a strong pull that electrons are removed completely → ionic bonding."},{q:"What is an ionic bond?",a:"A strong electrostatic attraction between oppositely charged ions."},{q:"What lattice do ionic compounds form?",a:"Giant ionic lattice."},{q:"Properties of ionic compounds?",a:"High melting/boiling points (strong electrostatic attraction).\nDon't conduct electricity as solid (ions not free to move).\nBrittle — shatter upon impact."},{q:"Factors affecting ionic bond strength?",a:"Charge of ion (greater = stronger)\nSize of ion (smaller = stronger)"},{q:"What is a metal?",a:"A lattice of positively charged ions attracted to a sea of delocalised electrons."},{q:"Properties of metals?",a:"Good conductors of electricity and heat.\nHigh melting points.\nMalleable and ductile."},{q:"Factors affecting metallic bond strength?",a:"Ionic charge (higher = stronger)\nNumber of delocalised electrons (more = stronger)\nAtomic radius (smaller = stronger)"},{q:"Why are metals good conductors?",a:"Delocalised electrons are free to move and flow."},{q:"Why are metals malleable and ductile?",a:"Layers of ions can slide over each other."},{q:"What is a co-ordinate (dative covalent) bond?",a:"When one atom provides both electrons to form the covalent bond."},{q:"2BP 0LP → shape and angle?",a:"Linear, 180°"},{q:"3BP 0LP → shape and angle?",a:"Trigonal planar, 120°"},{q:"4BP 0LP → shape and angle?",a:"Tetrahedral, 109.5°"},{q:"3BP 1LP → shape and angle?",a:"Trigonal pyramidal, 107°"},{q:"2BP 2LP → shape and angle?",a:"V-shaped / Bent, 104.5°"},{q:"5BP 0LP → shape and angle?",a:"Trigonal bipyramidal, 120° and 90°"},{q:"6BP 0LP → shape and angle?",a:"Octahedral, 90°"},{q:"4BP 2LP → shape and angle?",a:"Square planar, 90°"},{q:"What does electron repulsion theory state?",a:"All electron pairs repel as far apart as possible.\nLP-LP > LP-BP > BP-BP repulsion."},{q:"Order of intermolecular forces?",a:"1. Van der Waals (weakest)\n2. Permanent dipole-dipole\n3. Hydrogen bonding (strongest)"},{q:"Where is van der Waals found?",a:"Between ALL molecules."},{q:"Where is permanent dipole-dipole found?",a:"Between polar molecules."},{q:"Why do some molecules with polar bonds lack permanent dipoles?",a:"The molecule itself is non-polar — dipoles cancel out in planar molecules."},{q:"Where is hydrogen bonding found?",a:"Only between polar molecules with a H–F/O/N bond."},{q:"How do van der Waals forces arise?",a:"Uneven distribution of electrons in one molecule induces a dipole in a neighbouring molecule."},{q:"Factors affecting strength of van der Waals?",a:"Size of molecule (bigger = stronger)\nMr (bigger = stronger)\nSurface area contact (more = stronger)"},{q:"Why are straight chains harder to boil than branched?",a:"More surface area contact → more van der Waals forces between molecules."},{q:"Why is ice less dense than liquid water?",a:"Water molecules are more spread out in ice compared to liquid water."},{q:"Why do macromolecular structures have high melting points?",a:"Strong covalent bonds between atoms → require large amounts of energy to break."},
  ]},
  "3.1.4": { title: "Energetics", cards: [
    {q:"What is enthalpy change?",a:"Heat energy change at constant pressure."},{q:"Units and symbol for enthalpy change?",a:"Symbol: ΔH\nUnit: kJ mol⁻¹"},{q:"ΔH for exothermic reaction?",a:"Negative"},{q:"ΔH for endothermic reaction?",a:"Positive"},{q:"What happens in an exothermic reaction?",a:"System gives out heat to the surroundings."},{q:"What happens in an endothermic reaction?",a:"System takes in heat from the surroundings."},{q:"Standard conditions for ΔH°?",a:"298 K, 100 kPa"},{q:"Standard enthalpy of combustion (ΔH°c)?",a:"Enthalpy change when 1 mole of a substance is completely burned in oxygen under standard conditions."},{q:"Are combustion enthalpies exo or endothermic?",a:"Always exothermic."},{q:"Standard enthalpy of formation (ΔH°f)?",a:"Enthalpy change when 1 mole of a compound is formed from its elements under standard conditions."},{q:"Enthalpy of formation of elements?",a:"Zero"},{q:"What does Hess's law state?",a:"The enthalpy change for a reaction is independent of the route taken."},{q:"When is Hess's law needed?",a:"For enthalpy changes that cannot be determined experimentally."},{q:"ΔH from combustion data?",a:"ΔrH = ΣΔcH (reactants) − ΣΔcH (products)"},{q:"ΔH from formation data?",a:"ΔrH = ΣΔfH (products) − ΣΔfH (reactants)"},{q:"Formula for heat energy transferred to water?",a:"q = m × c × ΔT\nq = heat (J), m = mass of water (g)\nc = specific heat capacity, ΔT = temp change"},{q:"Convert 1 cm³ of water to g?",a:"1 cm³ = 1 g"},{q:"How to calculate ΔH from q?",a:"ΔH = ±q ÷ n (in kJ mol⁻¹)\nDivide q by 1000 to convert J to kJ."},{q:"Two ways of carrying out calorimetry?",a:"1. Fuel heats a known volume of water\n2. Reaction in solution in an insulated container"},{q:"First step using fuel to heat water?",a:"Record mass of spirit burner and fuel with cap on."},{q:"What to do when water temperature has risen?",a:"Extinguish flame (lid on burner). Monitor and record highest temperature."},{q:"How to calculate mass of fuel burned?",a:"Reweigh spirit burner with lid and calculate difference from initial mass."},{q:"Why is experimental ΔH less than data book value?",a:"Heat loss to surroundings.\nIncomplete combustion."},{q:"Other reasons for less exothermic result?",a:"Non-standard conditions. Evaporation of fuel. Heat loss to the can."},{q:"How can poor stirring affect the result?",a:"Temperature reading may be incorrect."},{q:"Insulated container for method 2?",a:"A polystyrene coffee cup."},{q:"First step in method 2 calorimetry?",a:"Pour aqueous reactant into cup. Record temperature every minute for 3 minutes."},{q:"What to do on the 4th minute?",a:"Add other reactant and stir. Do not record temperature."},{q:"From the 5th minute onwards?",a:"Record temperature at 5th minute and every minute up to 10 minutes."},{q:"What is bond dissociation energy?",a:"Enthalpy change to break the bond in 1 mole of gaseous molecules → gaseous atoms."},{q:"What is mean bond enthalpy?",a:"Enthalpy required to break 1 mole of covalent bonds, averaged over a range of compounds."},{q:"Why is ΔH from mean bond enthalpies not 100% accurate?",a:"Bond enthalpies are average values from a range of compounds."},{q:"ΔH using bond enthalpies?",a:"ΔH = Σ(bonds broken) − Σ(bonds formed)"},
  ]},
  "3.1.5": { title: "Kinetics", cards: [
    {q:"What is activation energy?",a:"The minimum energy required for a reaction to occur."},{q:"What is collision theory?",a:"As frequency of collisions increases, rate increases — but % of successful collisions stays the same."},{q:"How can rate of reaction be defined?",a:"Change in concentration over time."},{q:"Factors affecting rate of reaction?",a:"Concentration, pressure, surface area, temperature."},{q:"How does increasing concentration increase rate?",a:"More reactant particles in a given volume → more frequent collisions → more successful collisions per unit time."},{q:"How does increasing surface area increase rate?",a:"More reactant particles available for collision → more frequent collisions → more successful collisions."},{q:"Effect of increasing pressure on rate?",a:"More particles in a given volume → more successful collisions per unit time."},{q:"Effect of increasing temperature on rate?",a:"Particles have more energy → move faster → more collisions → more particles exceed Ea → more successful collisions."},{q:"Why does the Boltzmann curve start at the origin?",a:"There are no particles with zero energy."},{q:"Why doesn't the curve touch the x-axis at high energy?",a:"There will always be some particles with very high energies (asymptote)."},{q:"What does the area under the Boltzmann curve represent?",a:"The total number of particles in the system."},{q:"What does the peak of the Boltzmann curve show?",a:"The most probable energy."},{q:"Boltzmann curve at higher temperature?",a:"Peak shifts right and lower. Many more particles have E ≥ Ea → faster rate."},{q:"Boltzmann curve at lower temperature?",a:"Peak shifts left and higher. Fewer particles have E ≥ Ea → slower rate."},{q:"What is a catalyst?",a:"A substance that increases rate of reaction but is unchanged at the end."},{q:"How does a catalyst work?",a:"Provides an alternative route with lower activation energy."},{q:"Effect of catalyst on ΔH?",a:"No effect — ΔH remains unchanged."},{q:"How does a catalyst affect the Boltzmann curve?",a:"Lowers Ea → more molecules have E ≥ Ea → increases frequency of successful collisions."},
  ]},
  "3.1.6": { title: "Equilibria", cards: [
    {q:"Under what condition can equilibrium be reached?",a:"Only in a closed system, where reactants and products cannot escape."},{q:"Features of a dynamic equilibrium?",a:"Rate of forward reaction = rate of backward reaction.\nConcentrations of reactants and products remain constant."},{q:"What is Le Chatelier's principle?",a:"A system at equilibrium will react to oppose any change imposed on it."},{q:"Three factors affecting position of equilibrium?",a:"1. Concentration\n2. Pressure\n3. Temperature"},{q:"Increasing [reactants] or decreasing [products]?",a:"Equilibrium shifts right → to decrease [reactants] / increase [products]."},{q:"Decreasing [reactants] or increasing [products]?",a:"Equilibrium shifts left."},{q:"Increasing pressure?",a:"Shifts to the side with fewer moles of gas → to decrease pressure."},{q:"Decreasing pressure?",a:"Shifts to the side with more moles of gas → to increase pressure."},{q:"Increasing temperature?",a:"Shifts in the endothermic direction → to decrease temperature."},{q:"Decreasing temperature?",a:"Shifts in the exothermic direction → to increase temperature."},{q:"How does a catalyst affect equilibrium?",a:"No effect on position or yield. Increases rates of both forward and backward reactions equally."},{q:"Position of equilibrium and yield?",a:"Shift right → yield increases.\nShift left → yield decreases."},{q:"Primary goal of equilibrium in industry?",a:"Highest yield, shortest time, lowest cost."},{q:"Why are very high T and P unfavourable industrially?",a:"Cost is too high."},{q:"Why are very low T and P sometimes unfavourable?",a:"Low yield (for some reactions) and low rate of reaction."},{q:"Why are compromise conditions used?",a:"Balance yield, rate of reaction, and cost."},{q:"Expression for Kc?",a:"Kc = [Products]ⁿ / [Reactants]ᵐ\nWhere [ ] = concentration in mol dm⁻³"},{q:"What is the only factor that affects Kc?",a:"Temperature."},
  ]},
  "3.1.7": { title: "Redox", cards: [
    {q:"What does redox mean?",a:"Reactions involving both reduction and oxidation."},{q:"What is oxidation?",a:"Process of electron loss."},{q:"What is reduction?",a:"Process of electron gain."},{q:"What is an oxidising agent?",a:"Electron acceptor."},{q:"What is a reducing agent?",a:"Electron donor."},{q:"Oxidation state of uncombined elements?",a:"0"},{q:"Oxidation state of O in compounds (not peroxides)?",a:"−2"},{q:"Oxidation state of O in peroxides?",a:"−1"},{q:"Oxidation state of H in compounds (not metal hydrides)?",a:"+1"},{q:"Oxidation state of H in metal hydrides?",a:"−1"},{q:"Oxidation state of Group I metals in compounds?",a:"+1"},{q:"Oxidation state of Group II metals in compounds?",a:"+2"},{q:"Usual oxidation state of Group 7 in compounds?",a:"−1"},{q:"Increase in oxidation state indicates?",a:"Oxidation"},{q:"Decrease in oxidation state indicates?",a:"Reduction"},{q:"Best order for balancing half equations?",a:"1. Balance atoms (not H or O)\n2. Balance O using water\n3. Balance H using H⁺\n4. Balance charge using electrons\n5. Double check"},
  ]},
  "3.1.8": { title: "Thermodynamics", cards: [
    {q:"What is standard molar enthalpy of atomisation?",a:"Enthalpy change for formation of 1 mol of gaseous atoms from the element in its standard state."},{q:"Example reaction for atomisation?",a:"½Cl₂(g) → Cl(g)"},{q:"What is first ionisation energy?",a:"Minimum energy to remove 1 mol of electrons from 1 mol of gaseous atoms."},{q:"Why is second IE greater than first?",a:"More difficult to remove an electron from a more positively charged ion."},{q:"What is first electron affinity?",a:"Enthalpy change when 1 mol of gaseous atoms → 1 mol of gaseous negative ions."},{q:"Example: first electron affinity?",a:"Cl(g) + e⁻ → Cl⁻(g)"},{q:"Why is first electron affinity exothermic?",a:"Attraction between the electron and the nucleus."},{q:"What is second electron affinity?",a:"Enthalpy change when 1 mol of electrons is added to 1 mol of gaseous negative ions → doubly negative ions."},{q:"Why is second EA always endothermic?",a:"Energy required to overcome repulsion between the negative electron and the negative ion."},{q:"What is lattice formation enthalpy?",a:"Enthalpy change when 1 mol of solid ionic compound is formed from its gaseous ions."},{q:"Example: lattice formation?",a:"Na⁺(g) + Cl⁻(g) → NaCl(s)"},{q:"What is lattice dissociation enthalpy?",a:"Enthalpy change to separate 1 mol of ionic substance into gaseous ions."},{q:"How are lattice formation and dissociation related?",a:"Same value but opposite signs."},{q:"What is enthalpy of hydration?",a:"Enthalpy change when 1 mol of gaseous ions becomes aqueous ions."},{q:"Why is hydration enthalpy exothermic?",a:"Attraction between positive ions and δ⁻ O of water, and negative ions and δ⁺ H of water."},{q:"What is enthalpy of solution?",a:"Enthalpy change when 1 mol of solid dissolves in water → aqueous ions."},{q:"Two factors affecting lattice enthalpy?",a:"Charge on ions (larger = greater)\nIonic radius (smaller = greater)"},{q:"Lattice enthalpy trend down a group?",a:"Decreases — larger ions have weaker electrostatic attraction."},{q:"What does the perfect ionic model predict?",a:"All ions are perfect spheres with purely ionic attraction."},{q:"If experimental ≠ theoretical lattice enthalpy?",a:"Due to presence of covalent character."},{q:"Can experimental be less than theoretical?",a:"No — either the same (purely ionic) or greater (covalent character)."},{q:"Factors contributing to covalent character?",a:"Size of the ion and charge on the ion."},{q:"What is theoretical lattice enthalpy?",a:"Calculated using the Perfect Ionic Model — assumes perfect spheres."},{q:"What is experimental lattice enthalpy?",a:"Calculated from a Born-Haber cycle — shows covalent character makes bond stronger."},{q:"Equation for enthalpy of solution?",a:"ΔHsol = lattice dissociation enthalpy + Σ(hydration enthalpies)"},{q:"What is entropy?",a:"A measure of disorder in a system."},{q:"Increase in disorder → reaction is?",a:"Feasible / spontaneous."},{q:"Features affecting entropy?",a:"Change of state (s→l→g increases entropy)\nIncrease in moles of products"},{q:"Sign of entropy if moles increase?",a:"Positive"},{q:"Sign of entropy if moles decrease?",a:"Negative"},{q:"More positive ΔS indicates?",a:"More random/disordered system. More feasible reaction."},{q:"Conditions for entropy values?",a:"Standard conditions: 298 K, 100 kPa"},{q:"Formula for entropy change?",a:"ΔS = ΣS(products) − ΣS(reactants)\nUnits: J K⁻¹ mol⁻¹"},{q:"Gibbs free energy formula?",a:"ΔG° = ΔH° − TΔS\nUnits: kJ mol⁻¹"},{q:"What to do with ΔS units for Gibbs?",a:"Convert from J K⁻¹ mol⁻¹ to kJ K⁻¹ mol⁻¹ (÷1000)."},{q:"When is a reaction feasible?",a:"When ΔG° ≤ 0"},{q:"More negative ΔG° means?",a:"More feasible."},{q:"Finding temperature for feasibility?",a:"Set ΔG = 0, rearrange: T = ΔH / ΔS"},{q:"ΔG and feasibility?",a:"If TΔS > ΔH → ΔG negative → feasible.\nIf TΔS < ΔH → ΔG positive → not feasible."},
  ]},
  "3.1.9": { title: "Rate Equations", cards: [
    {q:"What is the order of a reaction?",a:"The power of the concentration term in the rate equation."},{q:"What is zero order?",a:"As concentration changes, rate remains the same."},{q:"What is first order?",a:"Concentration changes by a factor → rate changes by the same factor."},{q:"What is second order?",a:"Concentration changes by a factor → rate increases by that factor squared."},{q:"Which reactants don't appear in the rate equation?",a:"Those that are zero order (don't affect rate)."},{q:"General rate equation?",a:"Rate = k[A]ᵐ[B]ⁿ\nRate in mol dm⁻³ s⁻¹"},{q:"What is the overall order?",a:"Sum of all individual orders: m + n"},{q:"What is the rate determining step?",a:"The slowest stage in a reaction mechanism."},{q:"Relationship between mechanism and rate equation?",a:"Steps up to and including the RDS contain the same species as in the rate equation, in the correct ratio."},{q:"What is the rate constant k?",a:"Relates reactant concentrations to rate at a particular temperature."},{q:"Relationship between rate and k?",a:"As rate increases, k increases. Described by the Arrhenius equation."},{q:"State the Arrhenius equation",a:"k = Ae^(−Ea/RT)\nk = rate constant, A = Arrhenius constant\nEa = activation energy (J mol⁻¹)\nR = 8.31 J K⁻¹ mol⁻¹, T = temperature (K)"},{q:"Logarithmic Arrhenius equation?",a:"ln k = ln A − Ea/RT"},{q:"Gradient of Arrhenius graph?",a:"−Ea / R"},{q:"Y-intercept of Arrhenius graph?",a:"ln A"},{q:"Y-axis of Arrhenius graph?",a:"ln k"},{q:"X-axis of Arrhenius graph?",a:"1/T"},
  ]},
  "3.1.10": { title: "Kp", cards: [
    {q:"Expression for Kp?",a:"Kp = (Pc)ᶜ(Pd)ᵈ / (Pa)ᵃ(Pb)ᵇ\nP = partial pressures. Units usually Pa or kPa."},{q:"How to calculate mole fraction?",a:"Mole fraction = moles of component ÷ total moles"},{q:"How to calculate partial pressure?",a:"Partial pressure = mole fraction × total pressure"},{q:"What is the only factor that affects Kp?",a:"Temperature."},
  ]},
  "3.1.11": { title: "Electrode Potentials", cards: [
    {q:"What happens when metal is dipped in its metal ion solution?",a:"Equilibrium established between metal atoms and ions → a half cell."},{q:"What is electrode potential (E°)?",a:"The potential difference between the rod and solution. Measures how readily electrons are released."},{q:"What does a voltmeter measure in an electrochemical cell?",a:"The potential pushing power of electrons through the circuit (at zero current)."},{q:"Function of the wire?",a:"Allows movement of electrons."},{q:"What are electrodes?",a:"Where half-equations take place (the half-cells)."},{q:"What is a salt bridge?",a:"Filter paper soaked in KNO₃ solution."},{q:"Purpose of salt bridge?",a:"Allows movement of ions to complete circuit. Compensates for changes in ion concentration."},{q:"Why is KNO₃ suitable for salt bridge?",a:"Doesn't react with any ions in solution — doesn't interfere with the redox reaction."},{q:"Why not use KCl with Ag⁺ ions?",a:"Cl⁻ would react with Ag⁺ → white precipitate."},{q:"Why use standard electrode potentials?",a:"To compare tendency of metals to release electrons and determine which electrode is +/−."},{q:"Role of Standard Hydrogen Electrode (SHE)?",a:"Primary standard assigned a potential of 0.00 V as reference."},{q:"Half-equation for SHE?",a:"H⁺(aq) + e⁻ ⇌ ½H₂(g)"},{q:"E° of SHE?",a:"0.00 V"},{q:"Standard conditions for SHE?",a:"1.00 mol dm⁻³ HCl (pH = 0)\n100 kPa pressure\n298 K"},{q:"Components of SHE?",a:"1.00 mol dm⁻³ HCl, H₂ gas, Pt electrode coated in platinum black."},{q:"What is an electrochemical series?",a:"Electrode potentials of different ions measured using the SHE."},{q:"Best reducing agents?",a:"Very negative electrode potentials."},{q:"Best oxidising agents?",a:"Very positive electrode potentials."},{q:"What is E cell also known as?",a:"Electromotive force (EMF) — potential difference across two electrodes."},{q:"Positive E cell indicates?",a:"The reaction is feasible."},{q:"Negative E cell indicates?",a:"The reaction is not feasible."},{q:"Formula for EMF of a cell?",a:"E°cell = E°(reduction) − E°(oxidation)"},{q:"More positive E value means?",a:"More feasible reaction."},{q:"Single lines (|) in cell diagrams?",a:"Phase boundaries (different states)."},{q:"Commas (,) in cell diagrams?",a:"Components in the same phase or liquid and aqueous."},{q:"Double line (||) in cell diagrams?",a:"Salt bridge."},{q:"LHS of cell diagram?",a:"Species being oxidised (negative electrode)."},{q:"RHS of cell diagram?",a:"Species being reduced (positive electrode)."},{q:"When are H⁺ and H₂O in cell diagrams?",a:"When they are species undergoing oxidation or reduction."},{q:"Pt electrode in cell diagram?",a:"Written as 'Pt' when no solid is present."},{q:"Non-rechargeable cell examples?",a:"Zinc-carbon, Daniell cell, alkaline cells."},{q:"What is the Daniell cell?",a:"Zn as negative electrode, Cu as positive electrode."},{q:"Why is the Daniell cell non-rechargeable?",a:"Zinc electrode consumed over time → irreversible."},{q:"Rechargeable cell examples?",a:"Lithium-ion, nickel-cadmium, lead-acid cells."},{q:"Benefits of using cells?",a:"Portable source of electrical energy."},{q:"Benefits of rechargeable cells?",a:"Less waste, cheaper long-term, lower environmental impact."},{q:"Risks of rechargeable cells?",a:"Some waste issues at end of useful life."},{q:"Benefits of hydrogen fuel cells?",a:"Only waste product is water. No recharging needed. Very efficient."},{q:"Risks of hydrogen fuel cells?",a:"Need constant fuel supply. H₂ is flammable/explosive. Usually made from fossil fuels. High cost."},
  ]},
  "3.1.12": { title: "Acids & Bases", cards: [
    {q:"Formula of sulfuric acid?",a:"H₂SO₄"},{q:"Formula of sodium hydroxide?",a:"NaOH"},{q:"Formula of phosphoric acid?",a:"H₃PO₄"},{q:"Formula of sodium carbonate?",a:"Na₂CO₃"},{q:"Formula of nitric acid?",a:"HNO₃"},{q:"Formula of potassium oxide?",a:"K₂O"},{q:"Formula of ethanoic acid?",a:"CH₃COOH"},{q:"Formula of barium hydroxide?",a:"Ba(OH)₂"},{q:"Formula of hydrochloric acid?",a:"HCl"},{q:"Formula of ammonia?",a:"NH₃"},{q:"Product of Metal + Acid?",a:"Salt + Hydrogen"},{q:"Product of Metal Oxide + Acid?",a:"Salt + Water"},{q:"Product of Metal Carbonate + Acid?",a:"Salt + CO₂ + Water"},{q:"Product of Hydroxide + Acid?",a:"Salt + Water"},{q:"What is a Brønsted-Lowry acid?",a:"A proton donor."},{q:"General reaction of acid HA with water?",a:"HA(aq) + H₂O(l) → A⁻(aq) + H₃O⁺(aq)"},{q:"What is a Brønsted-Lowry base?",a:"A proton acceptor."},{q:"General reaction of base B with water?",a:"B(aq) + H₂O(l) → BH⁺(aq) + OH⁻(aq)"},{q:"What are strong acids and bases?",a:"Completely dissociate into ions in aqueous solution."},{q:"Example monoprotic strong acid dissociation?",a:"HCl → H⁺(aq) + Cl⁻(aq)"},{q:"Example diprotic strong acid dissociation?",a:"H₂SO₄ → 2H⁺(aq) + SO₄²⁻(aq)"},{q:"What are weak acids and bases?",a:"Only slightly dissociate into ions in aqueous solution."},{q:"The weaker the acid/base...",a:"The less it dissociates. The more the equilibrium lies to the left."},{q:"Difference between strong and weak in terms of reactions?",a:"Weak substances have an equilibrium reaction. Strong have only a forward reaction."},{q:"What is amphoteric?",a:"A substance that can act as both an acid and a base, e.g. water."},{q:"Definition of pH?",a:"pH = −log₁₀[H⁺]"},{q:"Calculate [H⁺] from pH?",a:"[H⁺] = 10⁻ᵖᴴ"},{q:"As [H⁺] increases...",a:"pH decreases."},{q:"How can pH be measured?",a:"Indicator paper/solution (e.g. universal indicator) or pH meter (more accurate)."},{q:"Why is [H₂O] treated as constant in Kc?",a:"Water is weakly dissociated — equilibrium lies far to the left — [H₂O] is effectively constant."},{q:"What is Kw?",a:"Ionic product of water.\nKw = [H⁺][OH⁻]"},{q:"Value and units of Kw at 298 K?",a:"1.00 × 10⁻¹⁴ mol² dm⁻⁶"},{q:"Why is pH of water neutral?",a:"[H⁺] = [OH⁻]"},{q:"pH of pure water at 298 K?",a:"7"},{q:"How does Kw vary with temperature?",a:"Temperature ↑ → equilibrium shifts right → more dissociation → Kw increases → pH decreases (but still neutral)."},{q:"What is a monoprotic base?",a:"Accepts one proton, e.g. NaOH, KOH."},{q:"What is a diprotic base?",a:"Accepts two protons, e.g. Ba(OH)₂, Ca(OH)₂."},{q:"State Ka and its units",a:"Ka = [H⁺][A⁻] / [HA]\nUnits: mol dm⁻³"},{q:"As acid strength decreases...",a:"Ka decreases."},{q:"Ka < 1?",a:"Weak acid."},{q:"Ka > 1?",a:"Strong acid."},{q:"pKa expression?",a:"pKa = −log₁₀(Ka)"},{q:"Relationship between Ka and pKa?",a:"Ka = 10⁻ᵖᴷᵃ\nLow Ka → high pKa, and vice versa."},{q:"pH of weak acid using Ka?",a:"Assume [H⁺] = [A⁻].\nKa = [H⁺]² / [HA]\n[H⁺] = √(Ka × [HA])"},{q:"What is a pH meter?",a:"Digital device that determines pH by placing a probe in solution. Can track pH during titration."},{q:"Why calibrate a pH meter?",a:"It doesn't give accurate readings over time."},{q:"What is true at half neutralisation?",a:"Half the acid neutralised → [HA] = [A⁻] → Ka = [H⁺]"},{q:"pH at half equivalence?",a:"Same as the pKa value."},{q:"Properties of a suitable indicator?",a:"1. Sharp colour change (one drop)\n2. Endpoint matches equivalence point\n3. Distinct colour change"},{q:"What are buffers?",a:"Solutions that maintain the same pH despite addition of acid, base, or water."},{q:"What is an acidic buffer?",a:"Maintains pH below 7. Contains weak acid + one of its salts."},{q:"Two types of acidic buffer?",a:"1. Weak acid + its salt\n2. Weak acid + strong base (salt formed as product)"},{q:"H⁺ added to acidic buffer?",a:"H⁺ reacts with A⁻ → equilibrium shifts left → [H⁺] unchanged → pH maintained."},{q:"OH⁻ added to acidic buffer?",a:"OH⁻ reacts with H⁺ → forms H₂O → equilibrium shifts right → more acid dissociates → [H⁺] constant."},{q:"Example acidic buffer?",a:"Ethanoic acid (CH₃COOH) + sodium ethanoate (CH₃COONa)."},{q:"What is a basic buffer?",a:"Maintains pH above 7. Weak base + one of its salts."},{q:"Example basic buffer?",a:"Ammonia + ammonium chloride."},{q:"Buffer in the human body?",a:"Blood — maintains pH ~7.4. Even a 0.5 unit change can be fatal."},{q:"Buffers in everyday products?",a:"Detergents and shampoos — prevent damage from overly acidic or alkaline conditions."},
  ]},

  // ═══════════════════════════════════════════════
  // INORGANIC CHEMISTRY (3.2)
  // ═══════════════════════════════════════════════

  "3.2.1": { title: "Periodicity", cards: [
    {q:"What is periodicity?",a:"Repeating trends of physical or chemical properties."},{q:"What are periods in the periodic table?",a:"Horizontal rows of elements in the periodic table."},{q:"What are groups in the periodic table?",a:"Groups are vertical columns in the periodic table where all elements have the same number of electrons in their outermost principal energy level (PEL) and similar properties."},{q:"How does reactivity change in the s-block elements as we move down a group?",a:"In the s-block, elements get more reactive as we move down a group."},{q:"How does reactivity change in non-metals as we move up a group?",a:"In the non-metals, elements tend to get more reactive as we move up a group."},{q:"How reactive are the transition metals in the d-block?",a:"Usually unreactive."},{q:"What type of structures do elements in Groups 1, 2, and 3 have?",a:"Elements in Groups 1, 2, and 3 are all metals and have giant metallic structures."},{q:"What type of structure does silicon (Si) in Group 4 form?",a:"Silicon in Group 4 forms a macromolecular structure with 4 covalent bonds."},{q:"What type of structures do elements in Groups 5, 6, and 7 form?",a:"Non-metals that form simple molecular structures."},{q:"What is the structure of argon in Group 0, and why is it inert?",a:"Has a simple molecular structure with a full outer PEL of electrons (making it inert)."},{q:"Why do molecular structures have low melting and boiling points?",a:"They have weak Van der Waals forces between molecules that need to be broken."},{q:"Why do metallic structures have high melting and boiling points?",a:"Due to strong electrostatic attraction between positive ions and delocalised electrons."},{q:"Why do macromolecular structures like silicon have very high melting and boiling points?",a:"Due to strong covalent bonds which require a lot of energy to break."},{q:"What type of bonding do Na, Mg, and Al possess?",a:"Metallic bonding."},{q:"How does the charge on the metal ion change across Na, Mg, and Al?",a:"The charge on the metal ion increases from 1+ to 3+."},{q:"What happens to the number of delocalised electrons across Na, Mg, and Al?",a:"The number of delocalised electrons increases."},{q:"How does the strength of metallic bonding change across Na, Mg, and Al?",a:"The strength of metallic bonding increases, making the metals harder to melt."},{q:"Why do Na, Mg, and Al have increasing melting and boiling points?",a:"Na, Mg, and Al have increasing melting and boiling points due to stronger metallic bonding."},{q:"What type of structure does silicon (Si) have?",a:"Macromolecular structure similar to diamond."},{q:"How are silicon atoms bonded in its macromolecular structure?",a:"Each silicon atom is bonded to 4 others in a tetrahedral structure, forming a giant 3D structure."},{q:"Why does silicon have a very high melting and boiling point?",a:"Silicon has a very high melting and boiling point due to strong covalent bonds which require a lot of energy to break."},{q:"What types of structures do P, S, Cl, and Ar form?",a:"They form simple molecular structures."},{q:"How do P, S, and Cl exist in nature compared to Ar?",a:"P, S, and Cl exist as simple molecules, while Ar exists as separate atoms."},{q:"Why do P, S, Cl, and Ar have low melting and boiling points?",a:"They have weak Van der Waals forces between molecules, requiring less energy to break and melt/boil."},{q:"Why does sulfur have a higher melting point than phosphorus, chlorine, or argon?",a:"Phosphorus exists as P₄, sulfur as S₈, chlorine as Cl₂, and argon as Ar atoms. Sulfur, being a larger molecule, has more Van der Waals forces between molecules. More energy is required to break these forces."},{q:"What is the order of melting and boiling points for P, S, Cl, and Ar?",a:"S₈ > P₄ > Cl₂ > Ar"},{q:"What happens to ionisation energy down a group, and why?",a:"Ionisation energy decreases.\nThe electron is removed from a higher principal energy level.\nThe electron is further from the nucleus.\nThere is more shielding.\nWeaker attraction means less energy is required to remove it."},{q:"What happens to ionisation energy across a period, and why?",a:"Ionisation energy increases.\nThe number of protons increases.\nShielding is constant, and atomic radius decreases.\nStronger attraction means more energy is required to remove the outer electron."},{q:"Why is there an exception for Group 3 ionisation energy across a period?",a:"Ionisation energy is lower.\nThe electron is removed from a higher energy p sub-level.\nLess energy is required to remove the electron."},{q:"Why is there an exception for Group 6 ionisation energy across a period?",a:"Ionisation energy is lower.\nThere is a pair of electrons in a p orbital.\nExtra repulsion means less energy is required to remove the electron."},
  ]},
  "3.2.2": { title: "Group 2", cards: [
    {q:"What is the trend in atomic radius down Group 2, and why?",a:"Atomic radius increases.\nThe number of principal energy levels increases.\nThere is more shielding.\nWeaker attraction between the nucleus and outer electrons."},{q:"What is the trend in first ionisation energy down Group 2, and why?",a:"First ionisation energy decreases.\nThe number of principal energy levels increases, causing more shielding.\nWeaker attraction between the nucleus and the outer electron."},{q:"What is the trend in melting point down Group 2, and why?",a:"Melting point decreases.\nThe size of the atom/ion increases.\nWeaker electrostatic attraction between positive ions and delocalised electrons."},{q:"What happens when Group 2 elements react with water?",a:"The metal atom loses electrons and becomes a metal 2+ ion."},{q:"Why does reactivity increase down Group 2?",a:"Atoms become larger.\nThe distance between the nucleus and outer electron increases.\nThere is more shielding."},{q:"How does the reactivity of Group 2 elements with water change down the group?",a:"Reactivity increases and the reaction becomes more vigorous."},{q:"What is the reaction of magnesium with liquid water?",a:"Mg(s) + 2H₂O(l) → Mg(OH)₂(s) + H₂(g)\nVery slow reaction."},{q:"What is the reaction of magnesium with steam?",a:"Mg(s) + H₂O(g) → MgO(s) + H₂(g)\nVery fast reaction."},{q:"What is the reaction of calcium with water?",a:"Ca(s) + 2H₂O(l) → Ca(OH)₂(s) + H₂(g)"},{q:"What is the reaction of strontium with water?",a:"Sr(s) + 2H₂O(l) → Sr(OH)₂(aq) + H₂(g)"},{q:"What is the reaction of barium with water?",a:"Ba(s) + 2H₂O(l) → Ba(OH)₂(aq) + H₂(g)"},{q:"What is the least soluble Group 2 hydroxide?",a:"Mg(OH)₂ (basically insoluble)."},{q:"What is the most soluble Group 2 hydroxide?",a:"Ba(OH)₂"},{q:"What happens to the solubility of Group II hydroxides in water down the group?",a:"Solubility in water increases down the group."},{q:"What happens to the pH of Group II hydroxides as a base down the group?",a:"The pH increases down the group because there are more hydroxide ions in the solution."},{q:"What is observed when sodium hydroxide is added to magnesium chloride?",a:"White precipitate, because magnesium hydroxide is insoluble in water."},{q:"Write the ionic equation for the reaction between magnesium chloride and sodium hydroxide.",a:"Mg²⁺(aq) + 2OH⁻(aq) → Mg(OH)₂(s)"},{q:"What is observed when sodium hydroxide is added to barium chloride?",a:"No precipitate is seen because barium hydroxide is soluble in water."},{q:"What is the test for hydroxide ions?",a:"Magnesium chloride solution is added to a solution containing hydroxide ions. A white precipitate of Mg(OH)₂ is formed."},{q:"What is the test for magnesium ions?",a:"Sodium hydroxide solution is added to a solution containing magnesium ions. A white precipitate of Mg(OH)₂ is formed."},{q:"What is the most soluble Group 2 sulfate?",a:"MgSO₄"},{q:"What is the least soluble Group 2 sulfate?",a:"BaSO₄ (insoluble)."},{q:"What happens to the solubility of Group II sulfates in water down the group?",a:"Decreases down the group."},{q:"How do you test for sulfate ions?",a:"Add acidified barium chloride solution to a solution containing sulfate ions. A white precipitate of BaSO₄ is formed."},{q:"How do you test for barium ions?",a:"Add sulfuric acid to a solution containing barium ions. A white precipitate of BaSO₄ is formed."},{q:"Why must an unknown solution be acidified with HCl or HNO₃ before testing for barium ions?",a:"Acidification removes carbonate ions that could interfere with the test."},{q:"Why is H₂SO₄ not used to acidify the solution before testing for barium ions?",a:"H₂SO₄ contains sulfate ions which would form a white precipitate and interfere with the test."},{q:"What are the two reactions for the extraction of titanium by magnesium?",a:"TiO₂(s) + 2Cl₂(g) + 2C(s) → TiCl₄(g) + 2CO(g)\nTiCl₄(g) + 2Mg(l) → Ti(s) + 2MgCl₂(l)"},{q:"What is the condition needed for the extraction of titanium by magnesium?",a:"Very high temperatures (600–900°C)."},{q:"What is the use of Ca(OH)₂ in agriculture?",a:"Ca(OH)₂ is used to neutralise acidic soils."},{q:"What is the ionic equation for Ca(OH)₂ neutralising acids?",a:"H⁺ + OH⁻ → H₂O"},{q:"What is Mg(OH)₂ used for in medicine?",a:"Known as 'milk of magnesia'. Used to neutralise stomach acid (HCl) and treat indigestion."},{q:"What are the uses of CaO and CaCO₃ in flue gas desulfurisation?",a:"CaO and CaCO₃ are used to neutralise SO₂, which can cause acid rain, thus preventing its emission."},{q:"Why can CaCO₃ not be used to treat indigestion?",a:"It produces CO₂ gas."},{q:"What is the equation for CaO neutralising SO₂?",a:"CaO + SO₂ → CaSO₃"},{q:"What is BaSO₄ used for in diagnostic medicine?",a:"Used as a barium meal before x-rays or CT scans to identify damaged or diseased areas of the digestive tract."},{q:"Why is BaSO₄ safe to use despite barium being toxic?",a:"BaSO₄ is safe because it is insoluble."},
  ]},
  "3.2.3": { title: "Group 7", cards: [
    {q:"What is the trend in electronegativity in Group 7 elements?",a:"Electronegativity decreases down the group."},{q:"Why does electronegativity decrease down Group 7?",a:"1. The size of the atom increases.\n2. The number of principal energy levels increases.\n3. There is weaker attraction between the nucleus and electrons in a covalent bond."},{q:"What is the trend in boiling points in Group 7 elements?",a:"Increase down the group."},{q:"Why do boiling points increase down Group 7?",a:"The size of the atom increases and there are more Van der Waals forces between the molecules that need to be broken."},{q:"What is the appearance of fluorine (F₂) at room temperature?",a:"Pale yellow gas."},{q:"What is the appearance of chlorine (Cl₂) at room temperature?",a:"Pale green gas."},{q:"What is the appearance of bromine (Br₂) at room temperature?",a:"Dark red/orange liquid."},{q:"What is the appearance of iodine (I₂) at room temperature?",a:"Dark purple/black solid."},{q:"What is an oxidising agent?",a:"Electron acceptor."},{q:"What is the trend in the oxidising power of halogen atoms down the group?",a:"The oxidising power decreases down the group from fluorine (strongest) to iodine (weakest)."},{q:"Why does the oxidising power of halogen atoms decrease down the group?",a:"The size of the atom increases.\nThe effect of the nuclear charge is reduced due to shielding.\nThe halogen gains electrons less readily."},{q:"What is the observation when chlorine (Cl₂) is added to potassium chloride (KCl)?",a:"No visible change."},{q:"Write the ionic equation when chlorine (Cl₂) reacts with potassium bromide (KBr).",a:"Cl₂ + 2Br⁻ → Br₂ + 2Cl⁻"},{q:"What is the observation when chlorine (Cl₂) reacts with potassium bromide (KBr)?",a:"A yellow solution of bromine (Br₂) is formed."},{q:"Write the ionic equation when chlorine (Cl₂) reacts with potassium iodide (KI).",a:"Cl₂ + 2I⁻ → I₂ + 2Cl⁻"},{q:"Write the ionic equation when bromine (Br₂) reacts with potassium iodide (KI).",a:"Br₂ + 2I⁻ → I₂ + 2Br⁻"},{q:"What is the observation when chlorine (Cl₂) reacts with potassium iodide (KI)?",a:"A brown solution of iodine (I₂) is formed."},{q:"What is the observation when bromine (Br₂) reacts with potassium iodide (KI)?",a:"A brown solution of iodine (I₂) is formed."},{q:"What is a reducing agent?",a:"Electron donor."},{q:"What is the trend in reducing power of halide ions down the group?",a:"The reducing power increases from fluoride (weakest) to iodide (strongest)."},{q:"Why does the reducing power of halide ions increase down the group?",a:"The size of the ion increases.\nThere is increased shielding.\nIt is easier to lose an electron."},{q:"What is the reaction type of sodium fluoride (NaF) with concentrated sulfuric acid?",a:"Acid-base reaction."},{q:"Write the equation for the reaction of NaF with concentrated sulfuric acid.",a:"2NaF + H₂SO₄ → Na₂SO₄ + 2HF"},{q:"What observation is made when NaF reacts with concentrated sulfuric acid?",a:"Misty fumes of HF are produced."},{q:"What is the reaction type of sodium chloride (NaCl) with concentrated sulfuric acid?",a:"Acid-base reaction."},{q:"What observation is made when NaCl reacts with concentrated sulfuric acid?",a:"Misty fumes of HCl are produced."},{q:"What are the reaction types observed when NaBr reacts with concentrated sulfuric acid?",a:"Acid-base reaction and redox reaction."},{q:"Write the acid-base reaction equation for NaBr with concentrated sulfuric acid.",a:"2NaBr + H₂SO₄ → Na₂SO₄ + 2HBr"},{q:"What is observed during the acid-base reaction of NaBr with concentrated sulfuric acid?",a:"Misty fumes of HBr are produced."},{q:"Write the redox reaction equation for NaBr with concentrated sulfuric acid.",a:"2H⁺ + H₂SO₄ + 2Br⁻ → Br₂ + SO₂ + 2H₂O"},{q:"What are the observations for the redox reaction of NaBr with concentrated sulfuric acid?",a:"Choking gas (SO₂) is produced.\nBrown gas (Br₂) is produced."},{q:"What are the reaction types observed when NaI reacts with concentrated sulfuric acid?",a:"Acid-base reaction and multiple redox reactions."},{q:"Write the acid-base reaction equation for NaI with concentrated sulfuric acid.",a:"2NaI + H₂SO₄ → Na₂SO₄ + 2HI"},{q:"Write a redox reaction equation for NaI with concentrated sulfuric acid, producing I₂ and SO₂.",a:"2H⁺ + H₂SO₄ + 2I⁻ → I₂ + SO₂ + 2H₂O"},{q:"What are the observations for the redox reaction of NaI producing I₂ and SO₂?",a:"Choking gas (SO₂) is produced.\nBlack solid or purple fumes (I₂) are produced."},{q:"Write a redox reaction equation for NaI with concentrated sulfuric acid, producing sulfur.",a:"6H⁺ + H₂SO₄ + 6I⁻ → S + 4H₂O + 3I₂"},{q:"What are the observations for the redox reaction of NaI producing sulfur?",a:"Yellow solid (S) is produced.\nBlack solid or purple fumes (I₂) are produced."},{q:"Write a redox reaction equation for NaI with concentrated sulfuric acid, producing H₂S.",a:"8H⁺ + H₂SO₄ + 8I⁻ → H₂S + 4H₂O + 4I₂"},{q:"What are the observations for the redox reaction of NaI producing hydrogen sulfide?",a:"Smell of rotten eggs (H₂S) is produced.\nBlack solid or purple fumes (I₂) are produced."},{q:"What is used to identify halide ions in solution?",a:"Acidified silver nitrate solution."},{q:"What is the simplest ionic equation for the reaction of silver nitrate with halide ions?",a:"Ag⁺ + X⁻ → AgX"},{q:"What is the observation when fluoride ions (F⁻) react with acidified silver nitrate solution?",a:"No visible change as AgF is soluble."},{q:"What is the observation when chloride ions (Cl⁻) react with acidified silver nitrate solution?",a:"White precipitate (AgCl)."},{q:"What is the observation when bromide ions (Br⁻) react with acidified silver nitrate solution?",a:"Cream precipitate (AgBr)."},{q:"What is the observation when iodide ions (I⁻) react with acidified silver nitrate solution?",a:"Yellow precipitate (AgI)."},{q:"Why must hydroxide and carbonate ions be removed before testing for halide ions with silver nitrate?",a:"Hydroxide and carbonate ions will form a precipitate with silver ions, interfering with the test."},{q:"Which acid is used to acidify the solution before testing for halide ions with silver nitrate?",a:"Nitric acid (HNO₃)."},{q:"Why should HCl not be used to acidify the solution when testing for halide ions?",a:"HCl contains Cl⁻ ions, which would form a white precipitate, interfering with the test."},{q:"Which silver halide is soluble in dilute ammonia?",a:"AgCl."},{q:"Which silver halide is partially soluble in dilute ammonia and soluble in concentrated ammonia?",a:"AgBr."},{q:"Which silver halide is insoluble in both dilute and concentrated ammonia?",a:"AgI."},{q:"Write the equation showing the solubility of silver chloride (AgCl) in ammonia.",a:"AgCl(s) + 2NH₃(aq) → [Ag(NH₃)₂]⁺(aq) + Cl⁻(aq)"},{q:"Write the equation showing the solubility of silver bromide (AgBr) in ammonia.",a:"AgBr(s) + 2NH₃(aq) → [Ag(NH₃)₂]⁺(aq) + Br⁻(aq)"},{q:"What is the trend in solubility of silver halides in ammonia?",a:"Decreases.\nMost soluble: AgF\nLeast soluble: AgI"},{q:"What observation is made when carbonate ions react with an acid?",a:"Effervescence (fizzing) is observed due to the release of CO₂ gas."},{q:"Write the equilibrium equation for chlorine water.",a:"Cl₂(g) + H₂O(l) ⇌ HCl(aq) + HClO(aq)"},{q:"What type of redox reaction occurs when chlorine reacts with water and why?",a:"Disproportionation reaction. Chlorine is both oxidised (to +1 in HClO) and reduced (to −1 in HCl) in the same reaction."},{q:"What happens when universal indicator paper is added to chlorine water?",a:"Initially turns red due to the formation of acidic products (HCl and HClO). The red colour disappears, and the indicator turns white as HClO acts as a bleach."},{q:"Write the equation for the reaction of chlorine with water in bright sunlight.",a:"2Cl₂ + 2H₂O → 4HCl + O₂"},{q:"What happens to the green colour of chlorine water under bright sunlight?",a:"The green colour fades."},{q:"What is the primary use of chlorine and its compounds in water treatment?",a:"To sterilise drinking water and the water in swimming baths."},{q:"Why must chlorine be used in very small amounts in water treatment?",a:"Because chlorine is toxic."},{q:"What compound is now being used to replace chlorine in swimming pools and why?",a:"Calcium chlorate(I), because it is less hazardous."},{q:"Write the equation for the reaction of chlorine with cold dilute sodium hydroxide.",a:"Cl₂ + 2NaOH → H₂O + NaCl + NaClO"},{q:"Write the ionic equation for the reaction of chlorine with cold dilute sodium hydroxide.",a:"Cl₂ + 2OH⁻ → H₂O + Cl⁻ + ClO⁻"},{q:"Why is the reaction of chlorine with cold dilute sodium hydroxide of great commercial importance?",a:"Because sodium chlorate(I) (NaClO) is the active ingredient in household bleach."},
  ]},
  "3.2.4": { title: "Period 3 Elements", cards: [
    {q:"Write the reaction equation for sodium with water.",a:"2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)"},{q:"What are the observations when sodium reacts with water?",a:"The reaction is exothermic.\nGas is produced — effervescence."},{q:"What is the product formed when sodium reacts with water?",a:"Colourless very alkaline solution."},{q:"Write the reaction equation for magnesium with cold water.",a:"Mg(s) + 2H₂O(l) → Mg(OH)₂(s) + H₂(g)"},{q:"What are the observations when magnesium reacts with cold water?",a:"Minor bubbles are formed.\nThe reaction is slow."},{q:"What is the product formed when magnesium reacts with cold water?",a:"Sparingly soluble, weakly alkaline solution."},{q:"Write the reaction equation for magnesium with steam.",a:"Mg(s) + H₂O(g) → MgO(s) + H₂(g)"},{q:"What are the observations when magnesium reacts with steam?",a:"A white flame is produced.\nA white solid is formed during a fast reaction."},{q:"What is the product formed when magnesium reacts with steam?",a:"Basic solid."},{q:"Why does Na react more readily with cold water than Mg?",a:"It takes less energy to lose one electron in sodium compared to two electrons in magnesium."},{q:"Write the reaction equation for sodium with oxygen.",a:"2Na(s) + ½O₂(g) → Na₂O(s)"},{q:"What are the observations when sodium reacts with oxygen?",a:"Yellow flame (or orange).\nYellow solid is formed.\nReacts readily in air."},{q:"Write the reaction equation for magnesium with oxygen.",a:"Mg(s) + ½O₂(g) → MgO(s)"},{q:"What are the observations when magnesium reacts with oxygen?",a:"White flame.\nWhite solid is formed.\nReacts readily in air."},{q:"Write the reaction equation for aluminium with oxygen.",a:"2Al(s) + 1½O₂(g) → Al₂O₃(s)"},{q:"What is the observation when aluminium reacts with oxygen?",a:"Reacts slowly."},{q:"Write the reaction equation for silicon with oxygen.",a:"Si(s) + O₂(g) → SiO₂(s)"},{q:"What is the observation when silicon reacts with oxygen?",a:"Reacts slowly."},{q:"Write the reaction equation for phosphorus with oxygen.",a:"P₄(s) + 5O₂(g) → P₄O₁₀(s)"},{q:"What are the observations when phosphorus reacts with oxygen?",a:"White smoke.\nWhite flame.\nP₄ ignites spontaneously in air, so it is stored in oil or under water."},{q:"Write the reaction equation for sulfur with oxygen.",a:"S(s) + O₂(g) → SO₂(g)"},{q:"What are the observations when sulfur reacts with oxygen?",a:"Blue flame.\nChoking gas (SO₂).\nReacts readily in air."},{q:"What is the structure of Na₂O and MgO?",a:"Giant ionic lattice."},{q:"What is the structure of Al₂O₃?",a:"Giant ionic lattice."},{q:"What type of bonding is present in Al₂O₃?",a:"Ionic with covalent character."},{q:"What is the structure of SiO₂?",a:"Macromolecular."},{q:"What type of bonding is present in SiO₂?",a:"Strong covalent bonds."},{q:"What is the structure of P₄O₁₀?",a:"Simple molecular."},{q:"What type of intermolecular force is present in P₄O₁₀?",a:"Weak Van der Waals forces between molecules."},{q:"What is the structure of SO₃ and SO₂?",a:"Simple molecular."},{q:"What type of intermolecular force is present in SO₃ and SO₂?",a:"Weak Van der Waals forces between molecules."},{q:"Which ionic oxides are basic?",a:"Na₂O and MgO."},{q:"Which oxide is amphoteric?",a:"Al₂O₃ (Aluminium oxide)."},{q:"What does it mean for an oxide to be amphoteric?",a:"It can act as an acid or a base."},{q:"Which oxides are acidic?",a:"SiO₂ (macromolecular), P₄O₁₀, SO₂, and SO₃ (simple molecular oxides)."},{q:"What is the reaction of Na₂O with water?",a:"Na₂O(s) + H₂O(l) → 2NaOH(aq)"},{q:"What is the pH of the solution formed when Na₂O reacts with water?",a:"12–14 (Very alkaline)."},{q:"What is the reaction of MgO with water?",a:"MgO(s) + H₂O(l) → Mg(OH)₂(aq)"},{q:"What is the pH of the solution formed when MgO reacts with water?",a:"9–10 (Alkali but Mg(OH)₂ is sparingly soluble)."},{q:"Does Al₂O₃ react with water?",a:"No, Al₂O₃ is insoluble. Forms a protective layer on the surface of Al."},{q:"What is the pH of Al₂O₃ with water?",a:"7 (Neutral)."},{q:"Does SiO₂ react with water?",a:"No, SiO₂ is insoluble."},{q:"What is the reaction of P₄O₁₀ with water?",a:"P₄O₁₀(s) + 6H₂O(l) → 4H₃PO₄(aq)"},{q:"What acid is formed in the reaction of P₄O₁₀ with water?",a:"Phosphoric acid (H₃PO₄)."},{q:"What is the reaction of SO₂ with water?",a:"SO₂(g) + H₂O(l) → H₂SO₃(aq)"},{q:"What acid is formed in the reaction of SO₂ with water?",a:"Sulfurous acid (H₂SO₃)."},{q:"What is the reaction of SO₃ with water?",a:"SO₃(g) + H₂O(l) → H₂SO₄(aq)"},{q:"What acid is formed in the reaction of SO₃ with water?",a:"Sulfuric acid (H₂SO₄)."},
  ]},
  "3.2.5": { title: "Transition Metals", cards: [
    {q:"Where are transitional metals found on the periodic table?",a:"D block (in the middle)."},{q:"What is the definition of a transition element?",a:"Forms at least one stable ion with a partially filled d-subshell."},{q:"What are the four characteristics of transitional metals?",a:"1. They form complexes\n2. They form coloured ions\n3. They have variable oxidation states\n4. They possess the ability to act as a catalyst"},{q:"What is a ligand?",a:"A molecule or ion that forms a coordinate bond with a transition metal."},{q:"What is a complex?",a:"A central metal or ion surrounded by ligands joined by coordinate bonds."},{q:"What is the coordination number?",a:"The number of coordinate bonds to the central metal atom or ion."},{q:"What is the coordination number for a linear complex?",a:"2"},{q:"What is an example of a linear complex?",a:"Ag⁺ complexes, e.g. [Ag(NH₃)₂]⁺ (Tollens' reagent)."},{q:"What is the coordination number for a square planar complex?",a:"4"},{q:"What are examples of square planar complexes?",a:"Pt²⁺ and Ni²⁺ complexes."},{q:"What is the coordination number for a tetrahedral complex?",a:"4"},{q:"When do tetrahedral complexes form?",a:"When ligands are too big to fit six (e.g., Cl⁻)."},{q:"What is the coordination number for an octahedral complex?",a:"6"},{q:"When do octahedral complexes form?",a:"Most complexes with small ligands (e.g., H₂O and NH₃)."},{q:"What is a monodentate ligand?",a:"A ligand that forms one co-ordinate bond to the transition metal ion."},{q:"Give examples of monodentate ligands.",a:"H₂O, NH₃, Cl⁻, CN⁻, OH⁻"},{q:"Why are H₂O and NH₃ similar as monodentate ligands?",a:"They are very similar in size and are both neutral, so the overall charge on the complex is the same as the charge on the metal ion."},{q:"Why does the complex ion of chloride ligands have a different shape compared to those of H₂O ligands?",a:"Chloride ions are too big to fit more than four around one ion."},{q:"What do the terms 'cis' and 'trans' mean in transition metal complexes?",a:"Cis: Ligands are on the same side of the complex.\nTrans: Ligands are on opposite sides of the complex."},{q:"What are the advantages of cis-platin as an anti-cancer drug?",a:"It kills cancer cells."},{q:"What are the disadvantages of cis-platin as an anti-cancer drug?",a:"Causes hair loss and causes fertility issues."},{q:"What is a bidentate ligand?",a:"A ligand that forms two co-ordinate bonds to a transition metal ion through two different atoms on the same ligand."},{q:"What are the two requirements for a ligand to act as a bidentate ligand?",a:"It must have two available lone pairs.\nEach lone pair must form a co-ordinate bond from separate atoms."},{q:"What are the two examples of bidentate ligands you must know?",a:"NH₂CH₂CH₂NH₂ (1,2-diaminoethane)\n[C₂O₄]²⁻ (ethanedioate)"},{q:"How many ligands are required to form a complex ion with a bidentate ligand?",a:"Three ligands."},{q:"What is a key property of octahedral complexes formed with bidentate ligands?",a:"They exhibit optical isomerism, forming two mirror-image isomers."},{q:"What is a multidentate ligand?",a:"A ligand that can form two or more coordinate bonds to a transition metal ion from different atoms on the same ligand."},{q:"What is the maximum number of bonds a multidentate ligand can form?",a:"6 bonds."},{q:"What are the two examples of multidentate ligands?",a:"EDTA⁴⁻ and the porphyrin ring in haemoglobin."},{q:"What is the general formula for a complex ion with EDTA?",a:"[M(EDTA)]²⁻"},{q:"What is the coordination number for a complex ion with EDTA?",a:"6"},{q:"What is the medicinal use of EDTA?",a:"Used to treat patients suffering from lead poisoning through chelation therapy, where it binds to toxic ions and removes them from the bloodstream."},{q:"What is the function of haemoglobin?",a:"Haemoglobin transports oxygen around the body."},{q:"What is the central metal ion and ligand in haemoglobin?",a:"Fe²⁺ is the central metal ion, and the porphyrin ring is the multi-dentate ligand."},{q:"What acts as a monodentate ligand in oxygenated haemoglobin?",a:"Oxygen (O₂)."},{q:"What happens when carbon monoxide is inhaled?",a:"Carbon monoxide forms a coordinate bond with Fe²⁺, replacing oxygen and preventing oxygen transport in the body."},{q:"What is the equation for replacing all H₂O ligands in [Co(H₂O)₆]²⁺ with NH₃ ligands?",a:"[Co(H₂O)₆]²⁺ + 6NH₃ → [Co(NH₃)₆]²⁺ + 6H₂O"},{q:"What is the equation for replacing some H₂O ligands in [Cu(H₂O)₆]²⁺ with NH₃ ligands?",a:"[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(H₂O)₂(NH₃)₄]²⁺ + 4H₂O"},{q:"What is the equation for replacing H₂O ligands in [Cu(H₂O)₆]²⁺ with Cl⁻ ligands?",a:"[Cu(H₂O)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O"},{q:"What is the chelate effect?",a:"The process where monodentate ligands are substituted for bi/multidentate ligands to form a more stable complex."},{q:"Why is the product of a chelation reaction more stable?",a:"There has been a positive ΔS (increase in entropy)."},{q:"Why does ΔS increase in the chelation reaction?",a:"4 moles are converted to 7 moles, leading to an increase in disorder."},{q:"What is the value of ΔH in the chelation reaction, and why?",a:"ΔH ≈ 0 because the same number and same type of bonds are broken and formed (6 Cu-N bonds)."},{q:"Explain why the free energy change (ΔG) is negative for the chelation reaction.",a:"ΔS is positive and ΔH = 0.\nΔG = ΔH − TΔS.\nSince TΔS > ΔH, ΔG is negative, making the reaction feasible."},{q:"What happens in the test for aldehydes using Tollens' reagent?",a:"1. Silver mirror forms in the presence of aldehydes.\n2. Ag⁺ in [Ag(NH₃)₂]⁺ is reduced to Ag (silver mirror).\n3. Aldehyde is oxidised to carboxylic acid."},{q:"What happens in the test for aldehydes using Fehling's solution?",a:"1. Brick-red precipitate (Cu₂O) forms in the presence of aldehydes.\n2. Cu²⁺ is reduced to Cu⁺ in Cu₂O.\n3. Aldehyde is oxidised to carboxylic acid."},{q:"Write the half equation for the reduction of Cr₂O₇²⁻ to Cr³⁺ in acidified K₂Cr₂O₇.",a:"14H⁺ + 6e⁻ + Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O"},{q:"What is the oxidation state and colour of VO₂⁺ in acidic solution?",a:"+5, Yellow."},{q:"What is the oxidation state and colour of VO²⁺ in acidic solution?",a:"+4, Blue."},{q:"What is the oxidation state and colour of V³⁺ in acidic solution?",a:"+3, Green."},{q:"What is the oxidation state and colour of V²⁺ in acidic solution?",a:"+2, Purple."},{q:"What is the sequence of colours observed when zinc reduces vanadium from +5 to +2?",a:"Yellow → Blue → Green → Violet"},{q:"Write the half equation for the oxidation of zinc metal to Zn²⁺ ions.",a:"Zn → Zn²⁺ + 2e⁻"},{q:"Write the half equation for the reduction of vanadium(V) to vanadium(II).",a:"VO₂⁺ + 4H⁺ + 3e⁻ → V²⁺ + 2H₂O"},{q:"What is the reducing agent when determining the percentage of iron in iron tablets?",a:"Fe²⁺"},{q:"What is the oxidising agent in redox titrations involving acidified KMnO₄?",a:"MnO₄⁻"},{q:"Write the half-equation for the reduction of MnO₄⁻ to Mn²⁺ in acidified conditions.",a:"MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O"},{q:"Construct the half-equation for the oxidation of Fe²⁺ to Fe³⁺.",a:"Fe²⁺ → Fe³⁺ + e⁻"},{q:"Combine the half-equations for the redox reaction of MnO₄⁻ with Fe²⁺. What is the molar ratio?",a:"MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺\nMolar ratio: 1 : 5"},{q:"Construct the half-equation for the oxidation of C₂O₄²⁻ to CO₂.",a:"C₂O₄²⁻ → 2CO₂ + 2e⁻"},{q:"Combine the half-equations for the redox reaction of MnO₄⁻ with C₂O₄²⁻. What is the molar ratio?",a:"2MnO₄⁻ + 16H⁺ + 5C₂O₄²⁻ → 2Mn²⁺ + 8H₂O + 10CO₂\nMolar ratio: 2 : 5"},{q:"Construct the half-equation for the oxidation of H₂O₂ to O₂.",a:"H₂O₂ → O₂ + 2H⁺ + 2e⁻"},{q:"Combine the half-equations for the redox reaction of MnO₄⁻ with H₂O₂. What is the molar ratio?",a:"2MnO₄⁻ + 6H⁺ + 5H₂O₂ → 5O₂ + 2Mn²⁺ + 8H₂O\nMolar ratio: 2 : 5"},{q:"Why do transition metals exhibit colour in their compounds?",a:"Due to their partly filled d sub-levels.\nElectrons in the d sub-level can shift between unoccupied orbitals, absorbing light energy in the process."},{q:"How is the colour of a transition metal compound observed?",a:"The colour transmitted is the light that is not absorbed during electron promotion."},{q:"Why does the energy gap (ΔE) between d orbitals matter in colour chemistry?",a:"The d orbitals are at specific energy values. The energy gap (ΔE) determines the amount of energy or light required for an electron to be promoted."},{q:"What is the equation relating the energy gap (ΔE) to frequency and wavelength of light?",a:"ΔE = hν = hc/λ"},{q:"Why do magnesium, aluminium, and zinc complexes appear colourless in solution?",a:"They do not have partially filled d sub-levels (they are not transitional metals)."},{q:"What are the three factors that can change the colour of a transition metal complex?",a:"1. The ligands bonded to the transition metal ion.\n2. The coordination number of the complex ion.\n3. The oxidation state of the transition metal ion."},{q:"What is the first step in determining concentration using a colorimeter?",a:"Pass the range of visible light through the metal ion solution to find the wavelength (λmax) where absorbance is maximum."},{q:"What is the purpose of making standard solutions of known concentrations in spectrophotometry?",a:"To create a calibration graph by measuring their absorbance."},{q:"How is a calibration graph used to determine the concentration of an unknown solution?",a:"The absorbance of the unknown is measured and compared to the calibration graph to find its concentration."},{q:"What is a heterogeneous catalyst?",a:"A catalyst in a different phase than the reactants, typically a solid where the reaction takes place on the surface."},{q:"How does adsorption differ from absorption?",a:"Adsorption is when a substance bonds onto a surface, while absorption is when a substance is taken into something."},{q:"What are active sites on a heterogeneous catalyst?",a:"Places on the catalyst's surface where molecules are adsorbed."},{q:"How does adsorption onto a catalyst's surface increase the reaction rate?",a:"1. It concentrates reactants, bringing them closer together for collision.\n2. It may weaken bonds in molecules, making reactions easier.\n3. It positions molecules in a favourable orientation for reaction."},{q:"What is desorption in a heterogeneous catalytic process?",a:"The products are released from the surface of the catalyst after the reaction."},{q:"What catalyst is used in the Haber process?",a:"Iron (Fe)."},{q:"What is the equation for the Haber process?",a:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g)"},{q:"What catalyst is used in the Contact process?",a:"Vanadium(V) oxide (V₂O₅)."},{q:"What are the steps in the Contact process?",a:"Step 1: SO₂(g) + V₂O₅(s) → SO₃(g) + V₂O₄(s)\nStep 2: V₂O₄(s) + ½O₂(g) → V₂O₅(s)\nOverall: SO₂(g) + ½O₂(g) → SO₃(g)"},{q:"What is catalyst poisoning?",a:"Catalyst poisoning occurs when impurities adsorb strongly onto the catalyst's surface, blocking active sites and reducing efficiency."},{q:"Give an example of catalyst poisoning in car catalytic converters.",a:"Lead poisoning, where rhodium (Rh) and platinum (Pt) catalysts are poisoned by lead from leaded petrol."},{q:"How does sulfur poisoning affect the Haber process?",a:"Sulfur from contaminated natural gas poisons the iron (Fe) catalyst, reducing its efficiency."},{q:"What are homogeneous catalysts?",a:"Catalysts in the same phase as the reactants, often in solution."},{q:"What is the catalyst in the reaction between iodide ions and peroxodisulfate ions (S₂O₈²⁻)?",a:"Fe²⁺ or Fe³⁺."},{q:"Write the overall equation for the reaction between iodide ions and peroxodisulfate ions.",a:"S₂O₈²⁻(aq) + 2I⁻(aq) → 2SO₄²⁻(aq) + I₂(aq)"},{q:"What is autocatalysis?",a:"Autocatalysis occurs when one of the products of a reaction acts as a catalyst for the reaction."},{q:"What is the catalyst in the reaction between ethanedioic acid and manganate(VII) ions?",a:"Mn²⁺"},{q:"Write the overall redox reaction between C₂O₄²⁻ and MnO₄⁻.",a:"2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O"},{q:"Explain why the reaction between C₂O₄²⁻ and MnO₄⁻ starts slowly.",a:"It involves two negative ions which repel each other, making collision difficult."},{q:"How does Mn²⁺ act as a catalyst in the reaction between C₂O₄²⁻ and MnO₄⁻?",a:"1. Mn²⁺ reacts with MnO₄⁻ to form Mn³⁺.\n2. Mn³⁺ reacts with C₂O₄²⁻ to regenerate Mn²⁺, speeding up the reaction."},
  ]},
  "3.2.6": { title: "Aqueous Ions", cards: [
    {q:"What happens when a transition metal salt dissolves in water?",a:"The metal ion is surrounded by six water ligands, forming a metal aqua ion or hexa aqua ion."},{q:"What is the colour of the [Fe(H₂O)₆]²⁺ complex?",a:"Green."},{q:"What is the colour of the [Cu(H₂O)₆]²⁺ complex?",a:"Blue."},{q:"What is the central metal charge of [Fe(H₂O)₆]³⁺, and what is its colour?",a:"Central metal charge: Fe³⁺\nColour: Purple (often appears brown due to [Fe(H₂O)₅(OH)]²⁺)."},{q:"What is the colour of the [Al(H₂O)₆]³⁺ complex?",a:"Colourless."},{q:"Define a Brønsted-Lowry acid.",a:"Proton donor."},{q:"Define a Brønsted-Lowry base.",a:"Proton acceptor."},{q:"How does the charge on the central metal ion affect the acidity of a complex ion?",a:"Higher charge increases charge density. This polarises the O-H bond more, increasing the number of H⁺ ions in solution."},{q:"What is the typical pH of a solution containing [M(H₂O)₆]²⁺ ions?",a:"pH 6"},{q:"What is the typical pH of a solution containing [M(H₂O)₆]³⁺ ions?",a:"pH 3"},{q:"How does Lewis acid theory define an acid?",a:"A Lewis acid is an electron pair acceptor."},{q:"How does Lewis acid theory define a base?",a:"A Lewis base is an electron pair donor."},{q:"What happens when NaOH is added dropwise to [Fe(H₂O)₆]²⁺?",a:"Fe(H₂O)₄(OH)₂(s) forms as a green precipitate which turns brown on standing in air."},{q:"What happens when an excess of NaOH is added to [Fe(H₂O)₆]²⁺?",a:"No further change."},{q:"What happens when NH₃ is added dropwise to [Fe(H₂O)₆]²⁺?",a:"Fe(H₂O)₄(OH)₂(s) forms as a green precipitate which turns brown on standing in air."},{q:"What happens when an excess of NH₃ is added to [Fe(H₂O)₆]²⁺?",a:"No further change."},{q:"What happens when Na₂CO₃ is added to [Fe(H₂O)₆]²⁺?",a:"FeCO₃(s) forms as a green precipitate."},{q:"What happens when NaOH is added dropwise to [Cu(H₂O)₆]²⁺?",a:"Cu(H₂O)₄(OH)₂(s) forms as a blue precipitate."},{q:"What happens when an excess of NaOH is added to [Cu(H₂O)₆]²⁺?",a:"No further change."},{q:"What happens when NH₃ is added dropwise to [Cu(H₂O)₆]²⁺?",a:"Cu(H₂O)₄(OH)₂(s) forms as a blue precipitate."},{q:"What happens when an excess of NH₃ is added to [Cu(H₂O)₆]²⁺?",a:"[Cu(H₂O)₂(NH₃)₄]²⁺ forms as a deep blue solution."},{q:"What happens when Na₂CO₃ is added to [Cu(H₂O)₆]²⁺?",a:"CuCO₃(s) forms as a blue-green precipitate."},{q:"What happens when NaOH is added dropwise to [Fe(H₂O)₆]³⁺?",a:"Fe(H₂O)₃(OH)₃(s) forms as a brown precipitate (may look orange-brown)."},{q:"What happens when an excess of NaOH is added to [Fe(H₂O)₆]³⁺?",a:"No further change."},{q:"What happens when NH₃ is added dropwise to [Fe(H₂O)₆]³⁺?",a:"Fe(H₂O)₃(OH)₃(s) forms as a brown precipitate (may look orange-brown)."},{q:"What happens when an excess of NH₃ is added to [Fe(H₂O)₆]³⁺?",a:"No further change."},{q:"What happens when Na₂CO₃ is added to [Fe(H₂O)₆]³⁺?",a:"Fe(H₂O)₃(OH)₃(s) forms as a brown precipitate. CO₂ gas is evolved."},{q:"What happens when NaOH is added dropwise to [Al(H₂O)₆]³⁺?",a:"Al(H₂O)₃(OH)₃(s) forms as a white precipitate."},{q:"What happens when an excess of NaOH is added to [Al(H₂O)₆]³⁺?",a:"[Al(OH)₄]⁻ forms as a colourless solution."},{q:"What happens when NH₃ is added dropwise to [Al(H₂O)₆]³⁺?",a:"Al(H₂O)₃(OH)₃(s) forms as a white precipitate."},{q:"What happens when an excess of NH₃ is added to [Al(H₂O)₆]³⁺?",a:"No further change."},{q:"What happens when Na₂CO₃ is added to [Al(H₂O)₆]³⁺?",a:"Al(H₂O)₃(OH)₃(s) forms as a white precipitate, and CO₂ gas is evolved."},{q:"Write the reaction for [Fe(H₂O)₆]²⁺ with NaOH(aq) dropwise.",a:"[Fe(H₂O)₆]²⁺(aq) + 2OH⁻(aq) → Fe(H₂O)₄(OH)₂ + 2H₂O(l)"},{q:"Write the reaction for [Fe(H₂O)₆]²⁺ with NH₃(aq) dropwise.",a:"[Fe(H₂O)₆]²⁺(aq) + 2NH₃(aq) → Fe(H₂O)₄(OH)₂ + 2NH₄⁺(aq)"},{q:"Write the reaction for [Fe(H₂O)₆]²⁺ with excess Na₂CO₃(aq).",a:"[Fe(H₂O)₆]²⁺(aq) + CO₃²⁻(aq) → FeCO₃(s) + 6H₂O(l)"},{q:"Write the reaction for [Cu(H₂O)₆]²⁺ with NaOH(aq) dropwise.",a:"[Cu(H₂O)₆]²⁺(aq) + 2OH⁻(aq) → Cu(H₂O)₄(OH)₂ + 2H₂O(l)"},{q:"Write the reaction for [Cu(H₂O)₆]²⁺ with NH₃(aq) in excess.",a:"Cu(H₂O)₄(OH)₂ + 4NH₃(aq) → [Cu(H₂O)₂(NH₃)₄]²⁺(aq) + 2H₂O(l) + 2OH⁻(aq)"},{q:"Write the reaction for [Cu(H₂O)₆]²⁺ with Na₂CO₃(aq).",a:"[Cu(H₂O)₆]²⁺(aq) + CO₃²⁻(aq) → CuCO₃(s) + 6H₂O(l)"},{q:"Write the reaction for [Fe(H₂O)₆]³⁺ with NaOH(aq) dropwise.",a:"[Fe(H₂O)₆]³⁺(aq) + 3OH⁻(aq) → Fe(H₂O)₃(OH)₃ + 3H₂O(l)"},{q:"Write the reaction for [Fe(H₂O)₆]³⁺ with NH₃(aq) dropwise.",a:"[Fe(H₂O)₆]³⁺(aq) + 3NH₃(aq) → Fe(H₂O)₃(OH)₃ + 3NH₄⁺(aq)"},{q:"Write the reaction for [Fe(H₂O)₆]³⁺ with Na₂CO₃(aq).",a:"2[Fe(H₂O)₆]³⁺(aq) + 3CO₃²⁻(aq) → 2Fe(H₂O)₃(OH)₃ + 3CO₂(g) + 3H₂O(l)"},{q:"Write the reaction for [Al(H₂O)₆]³⁺ with NaOH(aq) dropwise.",a:"[Al(H₂O)₆]³⁺(aq) + 3OH⁻(aq) → Al(H₂O)₃(OH)₃ + 3H₂O(l)"},{q:"Write the reaction for [Al(H₂O)₆]³⁺ with NaOH(aq) in excess.",a:"Al(H₂O)₃(OH)₃ + OH⁻(aq) → [Al(OH)₄]⁻(aq) + 3H₂O(l)"},{q:"Write the reaction for [Al(H₂O)₆]³⁺ with NH₃(aq) dropwise.",a:"[Al(H₂O)₆]³⁺(aq) + 3NH₃(aq) → Al(H₂O)₃(OH)₃ + 3NH₄⁺(aq)"},{q:"Write the reaction for [Al(H₂O)₆]³⁺ with Na₂CO₃(aq).",a:"2[Al(H₂O)₆]³⁺(aq) + 3CO₃²⁻(aq) → 2Al(H₂O)₃(OH)₃ + 3CO₂(g) + 3H₂O(l)"},{q:"Why is aluminium hydroxide classified as an amphoteric hydroxide?",a:"It reacts with both acids and bases to form different soluble species."},
  ]},

  "3.3.1": { title: "Introduction to Organic Chemistry", cards: [
    {q:"What are the two factors that physical and chemical properties of organic compounds depend on?",a:"1. The number and arrangement of carbon atoms in the molecule\n2. The functional group in the molecule"},
    {q:"What is a homologous series in organic chemistry?",a:"Organic compounds with the same functional group but a different number of carbon atoms"},
    {q:"List the four main characteristics of a homologous series.",a:"1. They have the same general formula\n2. They have similar chemical properties\n3. There is a trend in their physical properties\n4. One differs from the next by CH\u2082"},
    {q:"What is the general formula of alkanes in a homologous series?",a:"C\u2099H\u2082\u2099\u208a\u2082"},
    {q:"Provide the molecular formula of methane.",a:"CH\u2084"},
    {q:"Provide the molecular formula of ethane.",a:"C\u2082H\u2086"},
    {q:"Provide the molecular formula of propane.",a:"C\u2083H\u2088"},
    {q:"Provide the molecular formula of butane.",a:"C\u2084H\u2081\u2080"},
    {q:"What is the suffix used for naming alkanes?",a:"-ane"},
    {q:"What is the general formula for cycloalkanes?",a:"C\u2099H\u2082\u2099"},
    {q:"What is the prefix and suffix used for naming cycloalkanes?",a:"Cyclo-ane"},
    {q:"What is the general formula for alkenes?",a:"C\u2099H\u2082\u2099"},
    {q:"What is the suffix for naming alkenes?",a:"-ene"},
    {q:"What are the prefixes for naming halogenoalkanes?",a:"Fluoro-, Chloro-, Bromo-, Iodo-"},
    {q:"What is the prefix/suffix for alcohols?",a:"Prefix = hydroxy\nSuffix = -ol"},
    {q:"What is the prefix/suffix for aldehydes?",a:"-al"},
    {q:"What is the prefix/suffix for ketones?",a:"-one"},
    {q:"What is the prefix/suffix for carboxylic acids?",a:"-oic acid"},
    {q:"What is the prefix/suffix for nitriles?",a:"-anenitrile"},
    {q:"What is the prefix/suffix for amines?",a:"Prefix = amino\nSuffix = -yl amine"},
    {q:"Define molecular formula.",a:"The molecular formula shows the actual number of atoms of each element in a compound"},
    {q:"Define empirical formula.",a:"The empirical formula shows the simplest whole number ratio of atoms of each element in a compound"},
    {q:"Define structural formula.",a:"The structural formula shows how the atoms are joined together in a molecule"},
    {q:"Write the structural formula for butane.",a:"CH\u2083CH\u2082CH\u2082CH\u2083"},
    {q:"What are the three features required to describe an organic molecule according to IUPAC?",a:"1. The longest carbon chain on the molecule\n2. The presence of functional groups\n3. The position of the functional groups or branches"},
    {q:"What is the root name for a molecule with one carbon in the chain?",a:"Meth"},
    {q:"What is the root name for a molecule with two carbons in the chain?",a:"Eth"},
    {q:"What is the root name for a molecule with three carbons in the chain?",a:"Prop"},
    {q:"What is the root name for a molecule with four carbons in the chain?",a:"But"},
    {q:"What is the root name for a molecule with five carbons in the chain?",a:"Pent"},
    {q:"What is the root name for a molecule with six carbons in the chain?",a:"Hex"},
    {q:"How is a branch defined in a carbon chain?",a:"A branch is an additional carbon group attached to the main chain but not part of the longest carbon chain"},
    {q:"What is the naming convention for carbon chain branches?",a:"Branches are named using a prefix based on their length with \u2018yl\u2019 added to the end\ne.g., CH\u2083 is methyl, CH\u2082CH\u2083 is ethyl"},
    {q:"What is the rule for numbering the carbon chain when a functional group is present?",a:"Number the chain from the side that gives the functional group the lowest possible positional number"},
    {q:"What must be done when a molecule has more than one functional group?",a:"All functional groups must be represented in the name\nPrefixes are arranged in alphabetical order"},
    {q:"What prefix is used when there are two identical functional groups?",a:"Di-"},
    {q:"What prefix is used when there are three identical functional groups?",a:"Tri-"},
    {q:"What prefix is used when there are four identical functional groups?",a:"Tetra-"},
    {q:"What prefix is used when there are five identical functional groups?",a:"Penta-"},
    {q:"What prefix is used when there are six identical functional groups?",a:"Hexa-"},
    {q:"How are multiple functional groups on a carbon chain numbered?",a:"Each functional group is assigned its own positional number, separated by commas, and groups are listed alphabetically if they differ\nE.g. 1,2-dibromo-3-chloro propane"},
    {q:"What are the two main types of isomerism?",a:"Structural isomerism\nStereoisomerism"},
    {q:"What is structural isomerism?",a:"When compounds have the same molecular formula but different structural formulas"},
    {q:"What are the three types of structural isomerism?",a:"Chain isomerism\nPosition isomerism\nFunctional group isomerism"},
    {q:"What is stereoisomerism?",a:"Stereoisomerism occurs when compounds have the same structural formula but different arrangements in space"},
    {q:"What are the two types of stereoisomerism?",a:"Geometric isomerism (E/Z) \u2014 Alkenes only\nOptical isomerism"},
    {q:"What is chain isomerism?",a:"Molecules with the same molecular formula but a different length of the carbon chain"},
    {q:"Provide an example of chain isomerism using the molecular formula C\u2084H\u2081\u2080.",a:"Butane and 2-methylpropane"},
    {q:"What is position isomerism?",a:"Molecules with the same molecular formula and carbon chain length but with the functional group attached at different positions"},
    {q:"Provide an example of position isomerism for C\u2084H\u2089OH.",a:"Butan-1-ol and butan-2-ol"},
    {q:"What is functional group isomerism?",a:"Molecules with the same molecular formula but different functional groups"},
    {q:"What is the functional group isomer of alkenes?",a:"Cycloalkanes"},
    {q:"What is the functional group isomer of aldehydes?",a:"Ketones"},
    {q:"What is the functional group isomer of carboxylic acids?",a:"Esters"},
    {q:"What is the key feature of stereoisomers?",a:"Stereoisomers have the same structural formula but bonds are arranged differently in space"},
    {q:"What causes E-Z isomerism in alkenes?",a:"Restricted rotation about the C=C double bond"},
    {q:"What is the difference between Z and E isomers in E-Z isomerism?",a:"Z isomer: Two identical groups are on the same side of the double bond\nE isomer: Two identical groups are on opposite sides of the double bond"},
    {q:"When is it not possible to have geometrical isomerism in alkenes?",a:"When two identical groups are joined to the same carbon atom in the double bond"},
    {q:"What is the first step in applying Cahn-Ingold-Prelog (CIP) priority rules for E-Z isomerism?",a:"Consider the atomic number of the atoms attached to the left-hand carbon of the C=C bond\nThe atom with the higher atomic number takes priority"},
    {q:"What should you do if the atoms attached to the left-hand carbon of the C=C bond are the same when applying CIP rules?",a:"Consider the atoms one bond further away\nThe atom with the higher atomic number takes priority"},
    {q:"What is the second step in applying CIP priority rules for E-Z isomerism?",a:"Repeat the process for the right-hand carbon of the C=C bond and identify the priority group"},
    {q:"What determines if a compound is Z in E-Z isomerism?",a:"If the priority groups are on the same side of the C=C bond, the isomer is Z"},
    {q:"What determines if a compound is E in E-Z isomerism?",a:"If the priority groups are on opposite sides of the C=C bond, the isomer is E"},
    {q:"What is a chiral centre?",a:"A carbon atom bonded to four different atoms or groups, creating a molecule with no centre, plane, or axis of symmetry"},
    {q:"What is the result of a molecule with a chiral centre?",a:"The result is a pair of non-superimposable mirror images called optical isomers"},
    {q:"What is an example of a molecule with optical isomerism?",a:"2-bromobutane (CH\u2083CHBrCH\u2082CH\u2083)"},
    {q:"What are enantiomers?",a:"Name given to each optical isomer"},
    {q:"How do enantiomers differ from each other?",a:"Enantiomers rotate the plane of polarized light in opposite directions"},
    {q:"What is a racemic mixture?",a:"A racemic mixture contains equal amounts of each enantiomer and is optically inactive, as it rotates the plane of polarised light in opposite directions equally"},
    {q:"What was thalidomide originally used for in the 1950s?",a:"Thalidomide was used as a drug to treat morning sickness during pregnancy"},
    {q:"What negative side effect was discovered with thalidomide use?",a:"Thalidomide resulted in babies being born with shortened or missing arms or legs"},
    {q:"What is the difference between the two enantiomers of thalidomide?",a:"One enantiomer treated morning sickness, while the other caused birth defects"},
    {q:"Why was thalidomide never re-released?",a:"It was found that the body could convert the useful enantiomer to the dangerous one naturally"},
  ]},
  "3.3.2": { title: "Alkanes", cards: [
    {q:"What is the general formula for alkanes?",a:"C\u2099H\u2082\u2099\u208a\u2082"},
    {q:"How reactive are alkanes?",a:"Alkanes are very unreactive, but can burn in oxygen and react with halogens to produce halogenoalkanes"},
    {q:"How does the boiling point of alkanes change with carbon chain length?",a:"The longer the carbon chain, the higher the boiling point due to stronger van der Waals\u2019 forces"},
    {q:"How does branching in alkane isomers affect their boiling point?",a:"More branching lowers the boiling point due to weaker van der Waals\u2019 forces and less surface area contact between molecules"},
    {q:"What is crude oil?",a:"A complex mixture consisting mainly of alkanes. It has no use in its raw form, so it must be separated by fractional distillation"},
    {q:"What is distillation?",a:"A method used to separate mixtures of miscible liquids based on differences in boiling points"},
    {q:"What determines the height at which a molecule condenses during fractional distillation?",a:"The boiling point of the molecule determines the height\nMolecules with higher boiling points condense lower down in the column"},
    {q:"What is a fraction in fractional distillation?",a:"A fraction is a mixture of hydrocarbons with similar boiling points"},
    {q:"What happens to hydrocarbons as the carbon chain gets longer?",a:"They become more viscous, harder to ignite, less volatile, and have higher boiling points"},
    {q:"What is cracking?",a:"Cracking is the breaking of long-chain molecules into smaller ones"},
    {q:"Why is industrial cracking used?",a:"To develop saturated and unsaturated hydrocarbon chains and to meet the demand for shorter hydrocarbons like naphtha"},
    {q:"What does \u2018saturated\u2019 mean in the context of hydrocarbons?",a:"Saturated hydrocarbons contain only single bonds"},
    {q:"What does \u2018unsaturated\u2019 mean in the context of hydrocarbons?",a:"Unsaturated hydrocarbons contain double bonds (at least one C=C)"},
    {q:"What does \u2018hydrocarbon\u2019 mean?",a:"A hydrocarbon contains only carbon and hydrogen atoms"},
    {q:"What are the conditions for thermal cracking?",a:"High temperature (~1000K) and high pressure (~7000kPa)"},
    {q:"What products are formed during thermal cracking?",a:"A high percentage of alkenes and straight-chain alkanes"},
    {q:"What are the conditions for catalytic cracking?",a:"Lower temperature (~720K) and the use of a catalyst, such as zeolite crystals"},
    {q:"What products are formed during catalytic cracking?",a:"Motor fuels, aromatic hydrocarbons, and cycloalkanes"},
    {q:"Write the equation for the cracking of octane (C\u2088H\u2081\u2088) to form hexane and one other product.",a:"C\u2088H\u2081\u2088 \u2192 C\u2086H\u2081\u2084 + C\u2082H\u2084"},
    {q:"What is complete combustion of alkanes?",a:"Complete combustion occurs when alkanes react with excess oxygen to produce carbon dioxide and water"},
    {q:"How should combustion equations be balanced?",a:"Balanced alphabetically: Carbon (C), Hydrogen (H), then Oxygen (O)"},
    {q:"What are the products of complete combustion of methane?",a:"Carbon dioxide (CO\u2082) and water (H\u2082O)"},
    {q:"Write the balanced equation for complete combustion of methane.",a:"CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O"},
    {q:"What happens during incomplete combustion of alkanes?",a:"Produces carbon monoxide (CO) or carbon (C) due to a limited supply of oxygen"},
    {q:"Write the balanced equation for incomplete combustion of methane producing CO.",a:"CH\u2084 + 1.5O\u2082 \u2192 CO + 2H\u2082O"},
    {q:"Write the balanced equation for incomplete combustion of methane producing carbon.",a:"CH\u2084 + O\u2082 \u2192 C + 2H\u2082O"},
    {q:"How is carbon monoxide formed, and what problem does it cause?",a:"From incomplete combustion of carbon-containing fuels\nIt is toxic"},
    {q:"How are carbon particulates formed, and what problems do they cause?",a:"Formed by incomplete combustion of carbon-containing fuels\nThey blacken buildings, cause respiratory problems, and contribute to global dimming"},
    {q:"How can the problem of carbon monoxide and carbon particulates be reduced?",a:"Ensure a good supply of oxygen when burning fuels"},
    {q:"What problem does carbon dioxide cause?",a:"Global warming"},
    {q:"How can the problem of carbon dioxide be reduced?",a:"Burn fewer fossil fuels"},
    {q:"How is sulfur dioxide formed, and what problem does it cause?",a:"Formed by combustion of sulfur-containing compounds in fuels\nIt reacts with water to form acid rain"},
    {q:"How can the problem of sulfur dioxide be reduced?",a:"Remove sulfur from fuel before burning or use flue gas desulfurisation"},
    {q:"How are nitrogen oxides (NO\u2093) formed, and what problem do they cause?",a:"Formed by the reaction of N\u2082 with O\u2082 at very high temperatures (e.g., in engines)\nThey react with water to form acid rain"},
    {q:"How can the problem of nitrogen oxides be reduced?",a:"Use catalytic converters in cars"},
    {q:"How is water vapour formed, and what problem does it cause?",a:"Formed by combustion of fuels containing hydrogen\nIt is a greenhouse gas"},
    {q:"What does flue gas desulfurisation remove?",a:"SO\u2082 from the gases emitted by fossil-fuel power plants"},
    {q:"What substances are used in flue gas desulfurisation to neutralise sulfur dioxide?",a:"CaO (calcium oxide) or CaCO\u2083 (calcium carbonate)"},
    {q:"Write the equation for flue gas desulfurisation using CaO.",a:"CaO(s) + SO\u2082(g) \u2192 CaSO\u2083(s)"},
    {q:"What harmful effect does sulfur dioxide cause if not removed?",a:"Sulfur dioxide causes acid rain"},
    {q:"What is the primary function of catalytic converters in cars?",a:"Reduce the amount of CO, NO, and particulates released into the atmosphere"},
    {q:"What metals are typically used in the coating of catalytic converters?",a:"Platinum, Palladium, and Rhodium"},
    {q:"How does the honeycomb structure improve catalytic converter effectiveness?",a:"Increases the surface area, making the converter more cost-effective and efficient"},
    {q:"Write the equation for the reaction in a catalytic converter to reduce nitrogen oxides.",a:"2CO + 2NO \u2192 2CO\u2082 + N\u2082"},
    {q:"Why is the ceramic material in catalytic converters essential?",a:"It can withstand high temperatures inside the combustion engine"},
    {q:"Write the overall reaction for conversion of CO, NO, and C\u2088H\u2081\u2088 in a catalytic converter.",a:"C\u2088H\u2081\u2088 + 25NO \u2192 8CO\u2082 + 12.5N\u2082 + 9H\u2082O"},
  ]},
  "3.3.3": { title: "Halogenoalkanes", cards: [
    {q:"What is the general formula for haloalkanes?",a:"C\u2099H\u2082\u2099\u208a\u2081X, where X is a halogen (F, Cl, Br, or I)"},
    {q:"What are the three types of haloalkanes?",a:"Primary (1\u00b0), secondary (2\u00b0), and tertiary (3\u00b0)"},
    {q:"What happens during the formation of halogenoalkanes via free radical substitution?",a:"Alkanes react with halogens in the presence of ultraviolet (UV) light to form halogenoalkanes and hydrogen halides"},
    {q:"Write the equation for the reaction of methane with chlorine to form chloromethane.",a:"CH\u2084 + Cl\u2082 \u2192 CH\u2083Cl + HCl"},
    {q:"In free radical substitution, what happens to the hydrogen atom in the alkane?",a:"It is replaced by a halogen atom"},
    {q:"What condition is necessary for free radical substitution to occur?",a:"Ultraviolet (UV) light"},
    {q:"What happens during the initiation stage of free radical substitution?",a:"The X-X bond in halogen molecules is weaker than the C-H bond and breaks first under UV light, forming two halogen radicals"},
    {q:"Write the equation for the initiation stage of free radical substitution.",a:"X\u2082 \u2192 2X\u00b7"},
    {q:"Write the equation for the first propagation stage.",a:"CH\u2084 + X\u00b7 \u2192 \u00b7CH\u2083 + HX"},
    {q:"Write the equation for the second propagation stage.",a:"\u00b7CH\u2083 + X\u2082 \u2192 CH\u2083X + X\u00b7"},
    {q:"What happens during the termination stage of free radical substitution?",a:"Radicals combine to form stable molecules, ending the reaction"},
    {q:"What are chlorofluorocarbons (CFCs)?",a:"Halogenoalkanes containing both chlorine and fluorine atoms but no hydrogen"},
    {q:"How are chlorofluorocarbons used?",a:"Short-chain CFCs are gases used in refrigerators\nLonger chains are used for dry cleaning and as degreasing solvents"},
    {q:"What happens to CFC gases in the atmosphere?",a:"CFC gases decompose in the atmosphere to give chlorine free radicals"},
    {q:"Why is the ozone layer important?",a:"The ozone layer absorbs harmful UV radiation, preventing DNA damage in skin cells and reducing the risk of skin cancer"},
    {q:"How do chlorine radicals affect the ozone layer?",a:"Chlorine radicals decompose ozone in the stratosphere, causing a hole in the ozone layer"},
    {q:"Write the reaction for the breakdown of the C-Cl bond in UV radiation.",a:"C-Cl \u2192 Cl\u00b7"},
    {q:"Write the reaction showing how Cl\u00b7 decomposes ozone.",a:"Cl\u00b7 + O\u2083 \u2192 ClO\u00b7 + O\u2082"},
    {q:"How is Cl\u00b7 regenerated in the breakdown of ozone?",a:"ClO\u00b7 + O\u2083 \u2192 2O\u2082 + Cl\u00b7"},
    {q:"What is the overall equation for ozone breakdown catalyzed by Cl\u00b7?",a:"2O\u2083 \u2192 3O\u2082"},
    {q:"Why is Cl\u00b7 considered a catalyst in ozone breakdown?",a:"Cl\u00b7 is not destroyed and is regenerated during the reaction, enabling it to repeatedly catalyse the breakdown of ozone"},
    {q:"Why are the carbon-halogen bonds in halogenoalkanes polar?",a:"The halogen atoms are electronegative, attracting the electrons in the C-X bond, giving the halogen \u03b4- and the carbon \u03b4+"},
    {q:"What type of species readily attacks the electron-deficient carbon atom in halogenoalkanes?",a:"Nucleophile"},
    {q:"What happens to the C-X bond during nucleophilic substitution?",a:"The electrons in the C-X bond move onto the halogen atom, breaking the bond and releasing a halide ion"},
    {q:"What is nucleophilic substitution?",a:"A reaction where the halide ion is substituted for a nucleophile, involving the donation of a lone pair of electrons from the nucleophile to the carbon atom"},
    {q:"What are the three steps in the nucleophilic substitution mechanism?",a:"1. The lone pair on the nucleophile forms a covalent bond with the \u03b4+ carbon\n2. The electrons in the C-X bond move onto the halogen, breaking the bond\n3. The halogen gains the electrons to form a halide ion"},
    {q:"What happens to the strength of the C-X bond as we go down the group?",a:"The C-X bond strength decreases because the shared electrons are further from the halogen nucleus, making the bond weaker"},
    {q:"Why is the C-F bond the strongest among carbon-halogen bonds?",a:"Fluorine is the smallest halogen and the shared electrons are strongly attracted to the fluorine nucleus"},
    {q:"What does bond enthalpy suggest about the reactivity of carbon-halogen compounds?",a:"Iodo-compounds with the weakest bonds are the most reactive, while fluoro-compounds with the strongest bonds are the least reactive"},
    {q:"What trend does experimental data show about the reactivity of carbon-halogen bonds?",a:"Reactivity increases as we go down the group"},
    {q:"Arrange the carbon-halogen bonds in order of decreasing bond enthalpy.",a:"C-F > C-Cl > C-Br > C-I"},
    {q:"What reagent and conditions are used for nucleophilic substitution with hydroxide ions to form alcohols?",a:"Reagent: NaOH or KOH\nConditions: Warm and aqueous"},
    {q:"What product is formed when CH\u2083CH\u2082Br reacts with hydroxide ions?",a:"Ethanol (CH\u2083CH\u2082OH) and bromide ion (Br\u207b)"},
    {q:"What is the mechanism involved in the reaction of halogenoalkanes with hydroxide ions?",a:"Nucleophilic substitution"},
    {q:"What reagent and conditions are used for nucleophilic substitution with cyanide ions to form nitriles?",a:"Reagent: Potassium cyanide (KCN)\nConditions: Warm with aqueous ethanol"},
    {q:"Write the equation for the reaction of CH\u2083CH\u2082Br with cyanide ions.",a:"CH\u2083CH\u2082Br + HCN \u2192 CH\u2083CH\u2082CN + HBr"},
    {q:"What reagent and conditions are required for the reaction of halogenoalkanes with ammonia?",a:"Reagent: Excess ammonia (NH\u2083)\nConditions: Sealed container, warmed"},
    {q:"What is the nucleophile in the reaction of halogenoalkanes with ammonia?",a:"Ammonia (NH\u2083)"},
    {q:"Write the first step of the reaction of ethyl bromide with ammonia.",a:"CH\u2083CH\u2082Br + NH\u2083 \u2192 CH\u2083CH\u2082NH\u2082 + HBr"},
    {q:"What is the overall equation for the reaction of ethyl bromide with excess ammonia?",a:"CH\u2083CH\u2082Br + 2NH\u2083 \u2192 CH\u2083CH\u2082NH\u2082 + NH\u2084Br"},
    {q:"Describe the mechanism for nucleophilic substitution of halogenoalkanes with ammonia.",a:"1. The lone pair on nitrogen attacks the \u03b4+ carbon, forming a covalent bond\n2. The C-Br bond breaks heterolytically, forming Br\u207b\n3. A proton from the attached NH\u2083 is removed by another ammonia molecule\n4. Forming the amine and NH\u2084\u207a"},
    {q:"How does a primary amine react further with a halogenoalkane?",a:"The primary amine acts as a nucleophile due to its lone pair on nitrogen, reacting with the halogenoalkane to form a secondary amine"},
    {q:"Write the general equation for the formation of a secondary amine.",a:"RX + RNH\u2082 \u2192 R\u2082NH + HX"},
    {q:"How is a tertiary amine formed from a secondary amine?",a:"A secondary amine reacts with a halogenoalkane via nucleophilic substitution to form a tertiary amine and a halide ion"},
    {q:"Write the general equation for the formation of a tertiary amine.",a:"RX + R\u2082NH \u2192 R\u2083N + HX"},
    {q:"What is the product of the reaction between a tertiary amine and a halogenoalkane?",a:"A quaternary ammonium salt is formed"},
    {q:"Write the general equation for the formation of a quaternary ammonium salt.",a:"RBr + R\u2083N \u2192 [R\u2084N]\u207a Br\u207b"},
    {q:"What results in a high yield of quaternary ammonium salt?",a:"Using a large excess of halogenoalkane"},
    {q:"How can a better yield of primary amine be achieved?",a:"By using a large excess of ammonia, which reduces further substitution"},
    {q:"What is the reagent and condition for elimination reactions involving halogenoalkanes?",a:"Reagent = NaOH\nConditions = Hot, in ethanol"},
    {q:"Write the elimination reaction with CH\u2083CHBrCH\u2083.",a:"CH\u2083CHBrCH\u2083 + OH\u207b \u2192 CH\u2083CH=CH\u2082 + H\u2082O + Br\u207b"},
    {q:"Explain the role of OH\u207b in the elimination reaction with CH\u2083CHBrCH\u2083.",a:"Acts as a base, removing a hydrogen atom from a carbon adjacent to the one bonded to the bromine, leading to the formation of a double bond (alkene)"},
    {q:"What types of isomers can form in the elimination reaction of CH\u2083CHBrCH\u2083?",a:"Both Z and E isomers of the alkene product can form due to geometrical isomerism"},
    {q:"How do primary halogenoalkanes (RCH\u2082X) influence the reaction?",a:"They favour substitution"},
    {q:"How do secondary halogenoalkanes (R\u2082CHX) influence the reaction?",a:"They favour both substitution and elimination"},
    {q:"How do tertiary halogenoalkanes (R\u2083CX) influence the reaction?",a:"They favour elimination"},
    {q:"How does a stronger base affect substitution and elimination?",a:"Stronger bases increase the likelihood of elimination"},
    {q:"What solution favours substitution?",a:"Aqueous solution favours substitution"},
    {q:"What solution favours elimination?",a:"Ethanolic solution favours elimination"},
    {q:"How does temperature affect substitution and elimination?",a:"Higher temperatures favour elimination"},
  ]},
  "3.3.4": { title: "Alkenes", cards: [
    {q:"Why are alkenes more reactive than alkanes?",a:"Alkenes are more reactive because of the C=C double bond, which has a high electron density"},
    {q:"What is an electrophile in the context of alkene reactions?",a:"An electron-deficient species that accepts a pair of electrons, containing an atom with a partial positive charge (\u03b4+)"},
    {q:"What happens to the double bond (C=C) during an electrophilic addition reaction?",a:"1. The double bond breaks\n2. The electrons are donated to the electrophile\n3. Forming a single bond and saturated (C-C) products"},
    {q:"How does the high electron density of the C=C bond contribute to the reactivity of alkenes?",a:"Makes the C=C bond readily attacked by electrophiles"},
    {q:"What is the test for alkenes using bromine water?",a:"Add bromine water to the alkene\nThe red-brown colour will decolourise to show a C=C double bond"},
    {q:"Write the equation for the reaction of ethene with bromine to form 1,2-dibromoethane.",a:"C\u2082H\u2084 + Br\u2082 \u2192 C\u2082H\u2084Br\u2082"},
    {q:"Describe the stages of the electrophilic addition mechanism of bromine to ethene.",a:"1. The electron-rich double bond induces a dipole on the bromine molecule\n2. Electrons from C=C move to \u03b4+ Br, forming a C-Br bond and releasing Br\u207b\n3. The other carbon becomes a carbocation\n4. Br\u207b acts as a nucleophile, attacking the carbocation"},
    {q:"What is the product of hydrolysis of ethyl hydrogensulfate with water?",a:"Ethanol (CH\u2083CH\u2082OH)"},
    {q:"Write the equation for the hydrolysis of ethyl hydrogensulfate with water.",a:"CH\u2083CH\u2082OSO\u2083H + H\u2082O \u2192 CH\u2083CH\u2082OH + H\u2082SO\u2084"},
    {q:"Why does sulfuric acid act as a catalyst in the overall reaction?",a:"Sulfuric acid is not used up in the reaction"},
    {q:"What happens when alkenes react with electrophiles in an unsymmetrical environment?",a:"They form two products: a major product and a minor product"},
    {q:"How is the major product in electrophilic addition of unsymmetrical alkenes determined?",a:"From the more stable carbocation intermediate"},
    {q:"What are the three types of carbocations in increasing order of stability?",a:"Primary (1\u00b0) < Secondary (2\u00b0) < Tertiary (3\u00b0)"},
    {q:"What makes tertiary carbocations more stable than primary carbocations?",a:"Presence of more alkyl groups stabilises the carbocation\nPositive inductive effect of alkyl groups helps stabilise the positive charge"},
    {q:"What is the positive inductive effect in carbocations?",a:"The electron-releasing property of alkyl groups that stabilises the positive charge on the carbocation"},
    {q:"Why do unsymmetrical alkenes give rise to different products during electrophilic addition?",a:"Different carbocation intermediates form during the reaction, leading to products in unequal amounts"},
    {q:"Which product forms in higher amounts during electrophilic addition to unsymmetrical alkenes?",a:"The product derived from the more stable carbocation forms in higher amounts"},
    {q:"What is addition polymerisation?",a:"A reaction where small molecules (monomers, alkenes) join together to form a very large molecule called a polymer (poly(alkene)), which is unreactive"},
    {q:"What is the polymer formed when ethene molecules join together?",a:"Poly(ethene), which is saturated (C-C bonds)"},
    {q:"What is poly(chloroethene) commonly known as?",a:"PVC"},
    {q:"Why does pure poly(chloroethene) tend to be hard and rigid?",a:"It has permanent dipole forces between chains due to the \u03b4\u207b Cl and \u03b4\u207a C"},
    {q:"What is the purpose of plasticisers in PVC?",a:"Added to reduce the effectiveness of intermolecular forces, making the plastic more flexible"},
    {q:"What are the most common plasticisers used for PVC?",a:"Phthalates (esters of phthalic acid)"},
    {q:"List one use of unplasticised PVC.",a:"Doors, windows, or guttering"},
    {q:"List one use of plasticised PVC.",a:"Cable insulation, imitation leather, or inflatable products"},
    {q:"Why are most plastics not biodegradable?",a:"They are not broken down by microbes quickly or at all"},
    {q:"How can poly(ethene) be recycled?",a:"It can be separated, washed, melted, and remoulded into new products"},
    {q:"How can poly(propene) be recycled?",a:"It can be heated to break polymer bonds, producing monomers that can be used to make new plastics"},
  ]},
  "3.3.5": { title: "Alcohols", cards: [
    {q:"What is the functional group in alcohols?",a:"-OH (Hydroxy group)"},
    {q:"What is the general formula for an alcohol?",a:"C\u2099H\u2082\u2099\u208a\u2081OH"},
    {q:"How are alcohols classified?",a:"Primary, Secondary, and Tertiary"},
    {q:"What are the two ways of producing ethanol?",a:"1. Fermentation of glucose\n2. Direct hydration of ethene"},
    {q:"What is the equation for the fermentation of glucose to produce ethanol?",a:"C\u2086H\u2081\u2082O\u2086 \u2192 2CH\u2083CH\u2082OH + 2CO\u2082"},
    {q:"What conditions are required for the fermentation of glucose to produce ethanol?",a:"Yeast provides enzymes\nTemperature of 35\u00b0C\nOxygen-free environment (anaerobic respiration)\n15% yield"},
    {q:"What is a biofuel, and how is ethanol from fermentation separated?",a:"Biofuel: Derived from biological materials, such as plants or animals\nEthanol is separated using fractional distillation"},
    {q:"What is the equation for the direct hydration of ethene to produce ethanol?",a:"C\u2082H\u2084 + H\u2082O \u2192 CH\u2083CH\u2082OH"},
    {q:"What are the essential conditions for the direct hydration of ethene?",a:"High temperature (300\u00b0C)\nHigh pressure (70 atm)"},
    {q:"What catalyst is used in the direct hydration of ethene?",a:"Concentrated phosphoric acid (H\u2083PO\u2084) or concentrated sulfuric acid"},
    {q:"What type of reaction mechanism is involved in the direct hydration of ethene?",a:"Electrophilic addition"},
    {q:"Why is ethanol made from ethene not considered renewable?",a:"Because it originates from crude oil"},
    {q:"Why is ethanol made by fermentation considered renewable?",a:"Sugars used in fermentation come from plants like sugar cane, which can be grown annually, making it a biofuel"},
    {q:"What is the environmental concern with current carbon-based fuels?",a:"They release carbon dioxide, contributing to global warming and climate change"},
    {q:"Why is ethanol made by fermentation sometimes called a carbon-neutral fuel?",a:"The CO\u2082 released during combustion is balanced by the CO\u2082 absorbed by the plant during photosynthesis"},
    {q:"Is ethanol made by fermentation truly carbon neutral? Why or why not?",a:"No, because additional CO\u2082 is released during transportation, harvesting, and other processes"},
    {q:"Write the equation for photosynthesis.",a:"6H\u2082O + 6CO\u2082 \u2192 C\u2086H\u2081\u2082O\u2086 + O\u2082"},
    {q:"Write the equation for the combustion of ethanol.",a:"2C\u2082H\u2085OH + O\u2082 \u2192 4CO\u2082 + 6H\u2082O"},
    {q:"What is the elimination reaction of alcohols also referred to as?",a:"Dehydration reaction \u2014 turning alcohol into an alkene"},
    {q:"What catalyst is required for the elimination reaction of alcohols?",a:"Concentrated sulfuric acid (H\u2082SO\u2084) or phosphoric acid catalyst"},
    {q:"What are the three stages of the mechanism for the elimination reaction of alcohols?",a:"1. A lone pair of electrons on the alcohol oxygen is donated to a proton (H\u207a) from the acid catalyst\n2. Oxygen gains the proton and becomes positively charged\n3. Hydrogen is lost from an adjacent carbon, forming a double bond (C=C), and water is eliminated"},
    {q:"What are the possible alkene products formed in the elimination reaction of propan-2-ol?",a:"CH\u2083CH=CH\u2082 (propene)\nMinor product: E or Z isomers depending on conditions"},
    {q:"What reaction can cyclohexanol undergo to form cyclohexene?",a:"Cyclohexanol can undergo dehydration using concentrated phosphoric acid to form cyclohexene and water"},
    {q:"What are the possible impurities in the product of cyclohexanol dehydration?",a:"Acid catalyst (H\u2083PO\u2084)\nUnreacted cyclohexanol\nWater"},
    {q:"How is a separating funnel used to purify cyclohexene after dehydration of cyclohexanol?",a:"Used to separate the organic layer (cyclohexene) from the aqueous layer containing impurities"},
    {q:"What is the apparatus used to separate two immiscible liquids?",a:"A separating funnel"},
    {q:"Why is sodium hydrogen carbonate solution added to the impure product?",a:"To neutralise the acid catalyst\n3NaHCO\u2083 + H\u2083PO\u2084 \u2192 Na\u2083PO\u2084 + 3CO\u2082 + 3H\u2082O"},
    {q:"Why is it important to remove the stopper after shaking the mixture?",a:"To prevent the buildup of pressure due to CO\u2082 being produced"},
    {q:"How does re-distillation remove unreacted cyclohexanol from the product?",a:"Cyclohexanol and cyclohexene have different boiling points\nDistillation separates the two based on their boiling points"},
    {q:"How is the purified organic product dried to remove water?",a:"1. Pour the organic liquid into a beaker and add a drying agent (e.g., calcium chloride or magnesium sulfate)\n2. Swirl until the liquid changes from cloudy to clear\n3. Filter to remove the drying agent"},
    {q:"What oxidising agent is used to oxidise alcohols?",a:"Acidified potassium dichromate (K\u2082Cr\u2082O\u2087/H\u207a)"},
    {q:"What colour change indicates oxidation when using potassium dichromate(VI)?",a:"Orange to green"},
    {q:"What new bond is formed when alcohols are oxidized?",a:"A carbonyl bond (C=O)"},
    {q:"What are the oxidation products of a primary alcohol?",a:"1. Aldehyde (RCHO)\n2. Then Carboxylic acid (RCOOH)"},
    {q:"What is the oxidation product of a secondary alcohol?",a:"Ketone (RCOR)"},
    {q:"Can tertiary alcohols be oxidised using acidified potassium dichromate(VI)?",a:"No, tertiary alcohols cannot be oxidised"},
    {q:"What are primary alcohols oxidised to, and what apparatus is used?",a:"Oxidised to aldehydes (-CHO)\nApparatus: distillation"},
    {q:"Write the equation for the oxidation of ethanol to ethanal.",a:"CH\u2083CH\u2082OH + [O] \u2192 CH\u2083CHO + H\u2082O"},
    {q:"What are aldehydes oxidised to, and what apparatus is used?",a:"Oxidised to carboxylic acids (-COOH)\nApparatus: reflux"},
    {q:"Write the equation for the oxidation of ethanal to ethanoic acid.",a:"CH\u2083CHO + [O] \u2192 CH\u2083COOH"},
    {q:"What is the overall equation for the formation of a carboxylic acid from a primary alcohol?",a:"CH\u2083CH\u2082OH + 2[O] \u2192 CH\u2083COOH + H\u2082O"},
    {q:"What happens to acidified potassium dichromate(VI) when primary and secondary alcohols are oxidised?",a:"The solution turns from orange to green"},
    {q:"How do tertiary alcohols affect acidified potassium dichromate(VI)?",a:"Tertiary alcohols have no effect; the solution remains orange"},
    {q:"Rank ethanal, ethanol, and ethanoic acid from lowest to highest boiling point.",a:"Ethanal < Ethanol < Ethanoic acid"},
    {q:"Why does ethanoic acid have the highest boiling point?",a:"Ethanoic acid forms more hydrogen bonds than ethanol and is a larger molecule, leading to stronger van der Waals forces"},
    {q:"Why does ethanol have a higher boiling point than ethanal?",a:"Ethanol forms hydrogen bonds, which are stronger than the permanent dipole-dipole forces present in ethanal"},
    {q:"Why does ethanal have the lowest boiling point among ethanal, ethanol, and ethanoic acid?",a:"Ethanal only has permanent dipole-dipole forces, which are weaker than hydrogen bonds present in ethanol and ethanoic acid"},
  ]},
  "3.3.6": { title: "Organic Analysis", cards: [
    {q:"How do you test for the presence of a carboxylic acid?",a:"Add sodium carbonate"},
    {q:"What observation indicates the presence of a carboxylic acid in a sodium carbonate test?",a:"Effervescence is observed"},
    {q:"What is the deduction if effervescence is observed when sodium carbonate is added?",a:"CO\u2082 is formed from an acid-base reaction"},
    {q:"What test is used to identify halogenoalkanes?",a:"Warm with NaOH followed by acidified silver nitrate"},
    {q:"What observation indicates the presence of a chloroalkane?",a:"A white precipitate forms"},
    {q:"What is the deduction when a white precipitate forms in the halogenoalkane test?",a:"1. NaCl is formed\n2. Followed by AgCl"},
    {q:"What observation indicates the presence of a bromoalkane?",a:"A cream precipitate forms"},
    {q:"What is the deduction when a cream precipitate forms in the halogenoalkane test?",a:"1. NaBr is formed\n2. Followed by AgBr"},
    {q:"What observation indicates the presence of an iodoalkane?",a:"A yellow precipitate forms"},
    {q:"What is the deduction when a yellow precipitate forms in the halogenoalkane test?",a:"1. NaI is formed\n2. Followed by AgI"},
    {q:"What is the method of ionisation involving an electron gun called?",a:"Electron impact ionisation"},
    {q:"How does electron impact ionisation work?",a:"1. High-energy electrons from an electron gun are fired at the sample\n2. These electrons knock off an electron from the sample, forming a positive ion"},
    {q:"What is the general equation for electron impact ionisation?",a:"X(g) \u2192 X\u207a(g) + e\u207b"},
    {q:"What is the key observation for Electron Impact Ionisation regarding the molecular ion peak?",a:"The Mr for the sample will be equal to the peak with the greatest m/z value"},
    {q:"What is the principle of Electrospray Ionisation?",a:"1. The sample is dissolved in a volatile solvent and injected through a fine needle at high voltage to form a fine mist\n2. Each particle is ionised by gaining a proton (H\u207a)"},
    {q:"Write the equation for Electrospray Ionisation.",a:"X(g) + H\u207a \u2192 XH\u207a(g)"},
    {q:"What is the key observation for Electrospray Ionisation regarding the molecular ion peak?",a:"The Mr will be equal to the peak with the greatest m/z value minus one"},
    {q:"What is high-resolution mass spectrometry?",a:"Measures masses to 4 or 5 decimal places, allowing determination of the molecular formula by using precise atomic masses"},
    {q:"What does Infra-red (IR) spectroscopy help identify in a compound?",a:"It helps identify the type of bonds in a compound"},
    {q:"How does infra-red spectroscopy work to identify bonds?",a:"1. A chemical bond vibrates like two balls joined by a spring\n2. Stronger bonds vibrate faster, heavier atoms make the bond vibrate slower\n3. Each bond absorbs infrared radiation at its own natural frequency"},
    {q:"What is the fingerprint region in an IR spectrum?",a:"The area below 1500 cm\u207b\u00b9, unique for each molecule, used to identify compounds"},
    {q:"How can the fingerprint region confirm the identity of a compound?",a:"By matching the fingerprint region with a database of known compounds for an exact match"},
    {q:"What do both spectra of propan-1-ol and propan-2-ol share in the 3230\u20133350 cm\u207b\u00b9 region?",a:"Absorption due to the O-H bond in alcohols"},
    {q:"How do the fingerprint regions of propan-1-ol and propan-2-ol differ?",a:"They have different patterns of peaks, which can be used to distinguish the two alcohols"},
    {q:"How can IR spectroscopy help identify impurities in a sample?",a:"By revealing absorptions that should not be present in the pure compound"},
    {q:"What are common impurities detectable in an IR spectrum?",a:"Water and leftover reactants"},
    {q:"What is the role of greenhouse gases in trapping heat?",a:"Greenhouse gases absorb the most infrared radiation and trap heat in the Earth\u2019s atmosphere"},
  ]},
  "3.3.7": { title: "Optical Isomerism, Aldehydes & Ketones", cards: [
    {q:"What is the general formula of aldehydes and ketones?",a:"C\u2099H\u2082\u2099O"},
    {q:"How do aldehydes and ketones differ in the placement of the C=O functional group?",a:"Ketones have the C=O group in the middle of the carbon chain\nAldehydes have the C=O group at the end of the carbon chain"},
    {q:"What are aldehydes and ketones classified as in terms of isomerism?",a:"They are functional group isomers of each other"},
    {q:"How can aldehydes and ketones be distinguished in oxidation reactions?",a:"Aldehydes are further oxidised to carboxylic acids\nKetones are not easily oxidised using potassium dichromate(VI)"},
    {q:"Why can\u2019t potassium dichromate(VI) distinguish between primary and secondary alcohols?",a:"Both show the orange to green colour change during oxidation"},
    {q:"What is the observation when aldehydes react with Tollens\u2019 reagent?",a:"A silver mirror is formed"},
    {q:"What is the observation when ketones react with Tollens\u2019 reagent?",a:"No observable change"},
    {q:"What is the observation when aldehydes react with Fehling\u2019s solution?",a:"A brick-red precipitate is formed"},
    {q:"What is the observation when ketones react with Fehling\u2019s solution?",a:"No observable change"},
    {q:"What is the role of sodium tetrahydridoborate (NaBH\u2084) in reduction reactions?",a:"NaBH\u2084 acts as a reducing agent, providing hydride (H\u207b) ions to reduce aldehydes and ketones to alcohols"},
    {q:"What are aldehydes reduced to in the presence of a reducing agent?",a:"Primary alcohols"},
    {q:"Write the equation for the reduction of ethanal to ethanol.",a:"CH\u2083CHO + 2[H] \u2192 CH\u2083CH\u2082OH"},
    {q:"What are ketones reduced to in the presence of a reducing agent?",a:"Secondary alcohols"},
    {q:"Write the equation for the reduction of propanone to propan-2-ol.",a:"CH\u2083COCH\u2083 + 2[H] \u2192 CH\u2083CH(OH)CH\u2083"},
    {q:"What happens when aldehydes and ketones react with potassium cyanide (KCN) and dilute HCl?",a:"They undergo nucleophilic addition with KCN, forming an alcohol with a nitrile functional group"},
    {q:"Write the overall equation for the reaction of ethanal with KCN and dilute HCl.",a:"CH\u2083CHO + KCN + HCl \u2192 CH\u2083CH(OH)CN + KCl"},
    {q:"Write the ionic equation for the nucleophilic addition of ethanal with KCN.",a:"CH\u2083CHO + CN\u207b + H\u207a \u2192 CH\u2083CH(OH)CN"},
    {q:"What is a racemic mixture?",a:"A racemic mixture contains equal amounts of each enantiomer, is optically inactive, and rotates plane polarised light equally in opposite directions"},
    {q:"Why are racemic mixtures optically inactive?",a:"Because the rotations of the plane of polarised light by the enantiomers cancel each other out"},
    {q:"What is the reagent and catalyst used in the catalytic hydrogenation of nitriles?",a:"Hydrogen (H\u2082) and a nickel catalyst"},
    {q:"What functional group is formed by the catalytic hydrogenation of nitriles?",a:"A primary amine (-CH\u2082NH\u2082) group"},
    {q:"Write the reaction for the hydrogenation of CH\u2083CN to form ethylamine.",a:"CH\u2083CN + 4[H] \u2192 CH\u2083CH\u2082NH\u2082"},
    {q:"Why is the catalytic hydrogenation of nitriles important in synthesis?",a:"It turns nitriles into more reactive amine groups, allowing further reactions in synthesis routes"},
    {q:"How is a hydroxy group named in a molecule containing both a hydroxy group and a nitrile group?",a:"The hydroxy group is named using the \u2018hydroxy-\u2019 prefix\nThe nitrile group uses the \u2018-nitrile\u2019 suffix"},
    {q:"Name the hydroxy-nitrile: CH\u2083\u2014CH\u2082\u2014CH(OH)\u2014C\u2261N",a:"2-hydroxybutanenitrile"},
    {q:"Name the hydroxy-nitrile: CH\u2083\u2014CH\u2082\u2014C(OH)(CH\u2083)\u2014C\u2261N",a:"2-hydroxy-2-methylbutanenitrile"},
  ]},
  "3.3.9": { title: "Carboxylic Acids & Derivatives", cards: [
    {q:"What is the functional group of carboxylic acids?",a:"-COOH"},
    {q:"How are carboxylic acids made?",a:"1. By oxidising a primary alcohol to an aldehyde. 2. It is then further oxidised to form the carboxylic acid."},
    {q:"Write the general reaction for the oxidation of a primary alcohol to an aldehyde.",a:"RCH2OH + [O] → RCHO + H2O"},
    {q:"Provide an example of a primary alcohol being oxidised to an aldehyde.",a:"CH3CH2OH + [O] → CH3CHO + H2O"},
    {q:"Write the general reaction for the oxidation of an aldehyde to a carboxylic acid.",a:"RCHO + [O] → RCOOH"},
    {q:"Provide an example of an aldehyde being oxidised to a carboxylic acid.",a:"CH3CHO + [O] → CH3COOH"},
    {q:"Write the overall reaction for the formation of a carboxylic acid from a primary alcohol.",a:"CH3CH2OH + 2[O] → CH3COOH + H2O"},
    {q:"Why are carboxylic acids with a low molecular mass very soluble in water?",a:"The -COOH group forms hydrogen bonding with water."},
    {q:"Why are carboxylic acids considered weak acids despite being very soluble in water?",a:"They are only slightly dissociated in water."},
    {q:"Write the dissociation equation for ethanoic acid in water.",a:"CH3COOH (aq) ⇌ CH3COO⁻ (aq) + H⁺ (aq)"},
    {q:"What is the role of the carbonyl group in the dissociation of a carboxylic acid in water?",a:"The carbonyl group attracts electrons away from the -OH group, weakening the bond and allowing it to release a proton."},
    {q:"How does the addition of a halogen atom such as chlorine affect the acidity of a carboxylic acid?",a:"The halogen withdraws electron density from the carbonyl carbon, making the O-H bond more polar and easier to break, increasing the acid's ability to release H⁺."},
    {q:"How can you test for carboxylic acids using sodium carbonate?",a:"1. React the carboxylic acid with sodium carbonate (Na2CO3). 2. Effervescence occurs due to the evolution of carbon dioxide gas."},
    {q:"Write the balanced equation for the reaction of ethanoic acid with sodium carbonate.",a:"2CH3COOH + Na2CO3 → 2CH3COO⁻Na⁺ + CO2 + H2O"},
    {q:"Why are ionic salts formed in the reaction between carboxylic acids and sodium carbonate?",a:"The reaction forms carboxylate salts, which are ionic and soluble in water."},
    {q:"What is the reaction called when carboxylic acids react with alcohols to form esters?",a:"Esterification"},
    {q:"What are the products of an esterification reaction?",a:"An ester and water"},
    {q:"What catalyst is used in the esterification reaction?",a:"Concentrated sulfuric acid (H2SO4)"},
    {q:"Give the general reaction equation for esterification.",a:"RCOOH + R'OH ⇌ RCOOR' + H2O"},
    {q:"What is the functional group isomer of esters?",a:"Carboxylic acid"},
    {q:"How is the name of an ester derived from its alcohol and carboxylic acid?",a:"Alcohol part (e.g. ethanol → ethyl) + Acid part (e.g. ethanoic acid → ethanoate)"},
    {q:"What is the ester formed from ethanol and propanoic acid?",a:"Ethyl propanoate"},
    {q:"What is the ester formed from propan-1-ol and ethanoic acid?",a:"Propyl ethanoate"},
    {q:"What happens when esters are hydrolysed using water and a dilute acid catalyst?",a:"Esters are broken down into their carboxylic acid and alcohol components."},
    {q:"What catalyst is used for the hydrolysis of esters with water?",a:"Dilute H2SO4 or HCl"},
    {q:"Why does hydrolysis of esters using water result in a low yield?",a:"The reaction is reversible, so only partial hydrolysis occurs."},
    {q:"What is the first step in the 2-step method for hydrolysing esters with alkali?",a:"Add NaOH to hydrolyse the ester into an alcohol and a carboxylate salt."},
    {q:"What happens during the second step of the 2-step method for ester hydrolysis?",a:"An acid such as H2SO4 or HCl is added to convert the carboxylate salt into a carboxylic acid."},
    {q:"Write the reaction for the hydrolysis of methyl ethanoate with NaOH.",a:"CH3COOCH3 + NaOH → CH3COO⁻Na⁺ + CH3OH (sodium ethanoate and methanol)"},
    {q:"What are the products of hydrolysing an ester with alkali followed by acid?",a:"A carboxylic acid and an alcohol"},
    {q:"Why is an excess of dilute acid required in the second step of 2-step ester hydrolysis?",a:"To fully convert the carboxylate salt back into the carboxylic acid."},
    {q:"What are triglycerides?",a:"Triesters of long-chain carboxylic acids (fatty acids) and propane-1,2,3-triol (glycerol)"},
    {q:"How can triglycerides be hydrolysed?",a:"Using a hot NaOH solution to form glycerol and sodium salts of long-chain carboxylic acids."},
    {q:"What is the chemical structure of glycerol?",a:"Propane-1,2,3-triol"},
    {q:"Why are sodium carboxylate salts important?",a:"They are used in the manufacture of soaps."},
    {q:"Why does glycerol dissolve easily in water?",a:"Glycerol has three -OH bonds which form hydrogen bonds easily with water."},
    {q:"What are the uses of glycerol?",a:"1. Cosmetics industry 2. Food 3. Glues (to prevent materials drying too quickly) 4. Wine"},
    {q:"What is biodiesel?",a:"A liquid fuel consisting of a mixture of methyl esters of long-chain carboxylic acids, derived from vegetable oils."},
    {q:"What is a biofuel?",a:"A fuel produced from renewable biological sources."},
    {q:"How is biodiesel produced from vegetable oils?",a:"By reacting vegetable oils (e.g. rapeseed oil) with methanol (CH3OH) in the presence of a strong acid or alkali catalyst to form a mixture of methyl esters."},
    {q:"Why is biodiesel considered renewable?",a:"It is made from oils derived from crops such as rapeseed."},
    {q:"What are the raw materials used to make bioethanol?",a:"Sugar cane and sugar beet"},
    {q:"What are the raw materials used to make biodiesel?",a:"Vegetable oil"},
    {q:"How is bioethanol made?",a:"By fermentation"},
    {q:"How is biodiesel made?",a:"By reacting vegetable oil with an alcohol and HCl"},
    {q:"Where is bioethanol commonly used?",a:"In cars as a mixture with petrol; widely used in Brazil."},
    {q:"Where is biodiesel commonly used?",a:"In cars, buses, and vans as a mixture with diesel."},
    {q:"How widely available is bioethanol in the UK?",a:"It is increasingly available."},
    {q:"How widely available is biodiesel?",a:"It can be home-made and is available from some petrol stations."},
    {q:"What two functional groups can carboxylic acids be turned into for use in organic synthesis?",a:"Acyl chlorides and acid anhydrides"},
    {q:"How can carboxylic acids be turned into acyl chlorides?",a:"By replacing the -OH group of the carboxylic acid with a chlorine atom."},
    {q:"Why is the carbon atom in an acyl chloride susceptible to nucleophilic attack?",a:"1. Chlorine and oxygen are more electronegative than carbon. 2. Making the carbon atom δ⁺."},
    {q:"What is the name of CH3COCl?",a:"Ethanoyl chloride"},
    {q:"What is the name of CH3CH2COCl?",a:"Propanoyl chloride"},
    {q:"What happens to the -OH group in carboxylic acids to form acid anhydrides?",a:"The -OH group is replaced by -OCOR"},
    {q:"How are acid anhydrides formed?",a:"When two molecules of carboxylic acids join together with the elimination of water."},
    {q:"What is the general formula of an acid anhydride?",a:"(RCO)2O"},
    {q:"What is the name of the acid anhydride formed from two molecules of ethanoic acid?",a:"Ethanoic anhydride"},
    {q:"What is a good leaving group in carboxylic acid derivatives?",a:"A stable species that is removed during a chemical reaction."},
    {q:"What are the leaving groups in acyl chlorides and acid anhydrides?",a:"Acyl chloride: Cl⁻ | Acid anhydride: -OCOR"},
    {q:"What by-product is formed when acyl chlorides react?",a:"HCl"},
    {q:"What by-product is formed when acid anhydrides react?",a:"A carboxylic acid"},
    {q:"How are carboxylic acids formed from primary alcohols?",a:"Primary alcohols are oxidised by acidified potassium dichromate to form carboxylic acids."},
    {q:"Write the reaction for the oxidation of a primary alcohol to a carboxylic acid.",a:"RCH2OH + 2[O] → RCOOH + H2O"},
    {q:"How are carboxylic acids formed from aldehydes?",a:"Aldehydes are oxidised by acidified potassium dichromate to form carboxylic acids."},
    {q:"Write the reaction for the oxidation of an aldehyde to a carboxylic acid.",a:"RCHO + [O] → RCOOH"},
    {q:"How do acyl chlorides react with water?",a:"Acyl chlorides react with water to form carboxylic acids and HCl."},
    {q:"Write the reaction for the hydrolysis of an acyl chloride.",a:"RCOCl + H2O → RCOOH + HCl"},
    {q:"Give an example of an acyl chloride hydrolysis reaction.",a:"CH3COCl + H2O → CH3COOH + HCl"},
    {q:"What do acid anhydrides form when they react with water?",a:"Two molecules of carboxylic acids"},
    {q:"Write the general reaction for the hydrolysis of an acid anhydride.",a:"(RCO)2O + H2O → RCOOH + RCOOH"},
    {q:"Provide an example of an acid anhydride reacting with water.",a:"(CH3CO)2O + H2O → CH3COOH + CH3COOH"},
    {q:"How do acyl chlorides react with alcohols to form esters?",a:"Via nucleophilic addition-elimination to form esters and HCl."},
    {q:"Write the general equation for the reaction of acyl chlorides with alcohols.",a:"RCOCl + CH3OH → RCOOCH3 + HCl"},
    {q:"Provide an example of an acyl chloride reacting with an alcohol.",a:"CH3COCl + CH3OH → CH3COOCH3 + HCl"},
    {q:"Why are acyl chlorides preferred to carboxylic acids for ester formation?",a:"1. No acid catalyst required (esterification uses H2SO4). 2. A purer product is obtained. 3. Higher yield as the reaction is not reversible."},
    {q:"What is the reaction equation for acid anhydrides with alcohols to form esters?",a:"(RCO)2O + CH3CH2OH → RCOOCH2CH3 + RCOOH"},
    {q:"Provide an example of an acid anhydride reaction with an alcohol to form an ester.",a:"(CH3CO)2O + CH3CH2OH → CH3COOCH2CH3 + CH3COOH"},
    {q:"Why are acid anhydrides preferred to acyl chlorides for ester formation?",a:"1. Cheaper. 2. React less exothermically (less dangerous). 3. Less vulnerable to hydrolysis. 4. No corrosive HCl is formed."},
    {q:"What is ethanoic anhydride's advantage over ethanoyl chloride in synthesising aspirin?",a:"Cheaper, less corrosive, less vulnerable to hydrolysis, and less dangerous to use."},
    {q:"What is the main use of ethanoic anhydride in aspirin synthesis?",a:"Used in the manufacture of 2-ethanoyloxybenzenecarboxylic acid (aspirin)."},
    {q:"What functional groups are involved in the synthesis of aspirin?",a:"Alcohol group in salicylic acid and ester group in aspirin."},
    {q:"Outline the first four steps of the method for synthesising aspirin.",a:"1. Weigh out salicylic acid. 2. Transfer to a pear-shaped flask. 3. In fume cupboard, add ethanoic anhydride and phosphoric acid. 4. Add anti-bumping granules."},
    {q:"What is the role of the water-ice bath during aspirin synthesis?",a:"To allow complete crystallisation of aspirin."},
    {q:"How is the purified aspirin obtained after crystallisation?",a:"1. Filter using a Buchner funnel under reduced pressure. 2. Wash thoroughly with deionised water to remove impurities."},
    {q:"What is the final step in drying the aspirin after filtration?",a:"Pat the sample dry using filter paper and place in a fume hood for further drying."},
    {q:"What is the suffix for naming amides?",a:"-anamide"},
    {q:"How are amides formed from acyl chlorides?",a:"Acyl chlorides react with ammonia to form amides and ammonium chloride."},
    {q:"Write the balanced equation for the reaction of acyl chlorides with ammonia.",a:"RCOCl + 2NH3 → RCONH2 + NH4Cl"},
    {q:"Why is excess ammonia used in the reaction of acyl chlorides with ammonia?",a:"To neutralise the HCl formed during the reaction."},
    {q:"How are amides formed from acid anhydrides?",a:"Acid anhydrides react with ammonia to form amides and carboxylic acids."},
    {q:"Write the balanced equation for the reaction of acid anhydrides with ammonia.",a:"(RCO)2O + NH3 → RCONH2 + RCOOH"},
    {q:"Provide an example reaction where ethanoic anhydride reacts with ammonia.",a:"(CH3CO)2O + NH3 → CH3CONH2 + CH3COOH"},
    {q:"How are N-substituted amides formed from acyl chlorides?",a:"Acyl chlorides react with amines to form N-substituted amide and an ammonium salt."},
    {q:"How are N-substituted amides formed from acid anhydrides?",a:"Acid anhydrides react with amines, producing an N-substituted amide and a carboxylic acid."},
    {q:"Write the balanced equation for the reaction of acid anhydrides with amines.",a:"(RCO)2O + R'NH2 → RCONHR' + RCOOH"}
  ]},
  "3.3.10": { title: "Aromatic Chemistry", cards: [
    {q:"What are aliphatic compounds?",a:"Compounds with carbon chains that do not contain benzene rings."},
    {q:"What are aromatic compounds?",a:"Compounds that contain benzene rings."},
    {q:"What was Kekulé's proposed structure of benzene?",a:"A six-carbon ring with alternating single and double bonds (cyclohexatriene)."},
    {q:"What were the problems with Kekulé's structure?",a:"1. Benzene does not decolourise bromine water. 2. All C-C bonds are the same length (intermediate between single and double bond length)."},
    {q:"Why does benzene not decolourise bromine water?",a:"Because it does not undergo electrophilic addition reactions."},
    {q:"What do electron density spectra reveal about benzene's carbon-carbon bonds?",a:"All C-C bonds in benzene are the same length, indicating equivalence among the carbon atoms."},
    {q:"Describe the modern day structure of benzene.",a:"Pi electrons are delocalised across all six carbon atoms, forming a ring of electron density above and below the plane."},
    {q:"Describe the thermochemical evidence for the modern structure of benzene.",a:"Expected enthalpy of hydrogenation (Kekulé) = -360 kJ/mol. Actual value = -208 kJ/mol, which is 152 kJ/mol less exothermic than expected, indicating extra stability from delocalisation."},
    {q:"When do we use the naming root 'benzene'?",a:"When the group attached is: 1. An alkyl group. 2. A halogen. 3. A nitro group (NO2). 4. A carboxylic acid (COOH)."},
    {q:"When is the prefix name 'phenyl' given?",a:"When functional groups do not follow the benzene root naming rules."},
    {q:"What is the definition of an electrophile?",a:"An electrophile is an electron pair acceptor."},
    {q:"Name two electrophiles involved in the electrophilic substitution reactions of benzene.",a:"The nitronium ion (NO2⁺) and the acylium ion (RCO⁺)."},
    {q:"What are the three general steps for any reaction of benzene?",a:"1. Generation of electrophile. 2. Electrophilic substitution mechanism. 3. Regeneration of catalyst (H⁺ liberated from benzene reforms it)."},
    {q:"What is the role of H2SO4 in the nitration of benzene?",a:"H2SO4 acts as a catalyst by protonating HNO3, forming the nitronium ion (NO2⁺), the electrophile for the reaction."},
    {q:"Write the equation for the protonation of HNO3 by H2SO4.",a:"H2SO4 + HNO3 → HSO4⁻ + H2NO3⁺"},
    {q:"What happens to protonated nitric acid (H2NO3⁺) during the nitration of benzene?",a:"H2NO3⁺ breaks down to form the nitronium ion (NO2⁺) and water (H2O)."},
    {q:"Write the single equation representing the generation of the nitronium ion.",a:"H2SO4 + HNO3 → HSO4⁻ + NO2⁺ + H2O"},
    {q:"Write the equation for the breakdown of protonated nitric acid.",a:"H2NO3⁺ → NO2⁺ + H2O"},
    {q:"Write the equation for the regeneration of catalyst in the nitration of benzene.",a:"HSO4⁻ + H⁺ → H2SO4"},
    {q:"What is nitrobenzene used for in synthetic chemistry?",a:"In the preparation of azo dye."},
    {q:"Write the balanced equation for the reduction of nitrobenzene to phenylamine.",a:"C6H5NO2 + 6[H] → C6H5NH2 + 2H2O"},
    {q:"What does TNT stand for?",a:"Tri Nitro Toluene"},
    {q:"What is the IUPAC name of TNT?",a:"2-methyl-1,3,5-trinitrobenzene"},
    {q:"What is toluene an alternative name for?",a:"Methylbenzene"},
    {q:"What reagents are used for the nitration of methylbenzene?",a:"Concentrated nitric acid and sulfuric acid."},
    {q:"How many nitrations occur to form TNT?",a:"Three nitrations."},
    {q:"What is the intermediate product of dinitration of methylbenzene?",a:"2,4-dinitrotoluene"},
    {q:"Why is methylbenzene more reactive than benzene towards electrophilic substitution?",a:"1. The methyl group pushes electrons towards the benzene ring (positive inductive effect). 2. There is a stronger attraction to the electrophile. 3. Methylbenzene is a better nucleophile."},
    {q:"Write the equation for the regeneration of the catalyst in the Friedel-Crafts reaction.",a:"AlCl4⁻ + H⁺ → AlCl3 + HCl"}
  ]},
  "3.3.11": { title: "Amines", cards: [
    {q:"What is a primary amine?",a:"A primary amine has one carbon atom bonded to the nitrogen atom. Represented as RNH2."},
    {q:"Provide an example of a primary amine.",a:"CH3NH2"},
    {q:"What is a secondary amine?",a:"A secondary amine has two carbon atoms bonded to the nitrogen atom. Represented as R2NH."},
    {q:"Provide an example of a secondary amine.",a:"CH3CH2NHCH3"},
    {q:"What is a tertiary amine?",a:"A tertiary amine has three carbon atoms bonded to the nitrogen atom. Represented as R3N."},
    {q:"Provide an example of a tertiary amine.",a:"(CH3)3N"},
    {q:"What is a quaternary ammonium salt?",a:"A quaternary ammonium salt has four carbon atoms bonded to the nitrogen atom. Represented as R4N⁺."},
    {q:"Provide an example of a quaternary ammonium salt.",a:"(CH3)4N⁺"},
    {q:"What property allows primary, secondary, and tertiary amines to act as bases?",a:"The nitrogen atom has a lone pair, which can accept a proton."},
    {q:"Why can tertiary amines act as nucleophiles?",a:"Tertiary amines can donate their lone pair of electrons to a δ⁺ carbon, acting as nucleophiles."},
    {q:"Why do quaternary ammonium salts not react?",a:"Quaternary ammonium salts have no lone pair on the nitrogen atom."},
    {q:"Why are short-chain amines soluble in water?",a:"They form hydrogen bonds with water molecules."},
    {q:"What is the shape of an amine molecule and why?",a:"Pyramidal, due to three bonding pairs and one lone pair of electrons."},
    {q:"What is the shape of quaternary ammonium salts?",a:"Tetrahedral"},
    {q:"Why do amines generally have lower boiling points than alcohols with the same carbon chain length?",a:"Amines have weaker hydrogen bonds compared to alcohols, resulting in lower boiling points."},
    {q:"What are the two methods for preparation of aliphatic amines?",a:"1. Nucleophilic substitution of haloalkanes. 2. Reduction of a nitrile."},
    {q:"What is the primary disadvantage of nucleophilic substitution of haloalkanes for producing amines?",a:"A mixture of amine products is formed (product acts as nucleophile), resulting in a low yield of primary amine."},
    {q:"What are amines used for in the manufacture of synthetic materials?",a:"Amines are used in the manufacture of nylon, dyes, and drugs."},
    {q:"What are quaternary ammonium salts used for?",a:"Used as cationic surfactants in fabric softening and hair products."},
    {q:"How do quaternary ammonium salts function in hair conditioners?",a:"1. They attract to the negative charges on wet hair surfaces. 2. Forming a coating that prevents static electricity and flyaway hair."},
    {q:"Why are quaternary ammonium salts effective as fabric softeners?",a:"They keep the fabric surface smooth by preventing the build-up of static electricity."},
    {q:"What is the general equation for the reduction of a nitrile to an amine?",a:"RCN + 2H2 → RCH2NH2"},
    {q:"Which catalyst is used in the reduction of nitriles to amines?",a:"Nickel catalyst"},
    {q:"What is the 2-step method for producing an amine from a haloalkane?",a:"1. RBr + KCN → RCN + KBr (nucleophilic substitution in aqueous ethanol). 2. RCN + 2H2 → RCH2NH2 (catalytic hydrogenation)."},
    {q:"Why does the 2-step method for producing amines yield a purer product?",a:"The 2-step method increases the length of the carbon chain and reduces the formation of by-products."},
    {q:"What is the product of bromoethane + KCN followed by H2 with Ni catalyst?",a:"Propylamine (CH3CH2CH2NH2)"},
    {q:"What are aromatic amines?",a:"Aromatic amines (also called arenes) contain a benzene ring."},
    {q:"How are aromatic amines formed?",a:"By the reduction of nitrobenzene using HCl and tin as the catalyst."},
    {q:"Write the balanced equation for the reduction of nitrobenzene to aromatic amines.",a:"C6H5NO2 + 6[H] → C6H5NH2 + 2H2O"},
    {q:"What happens to the product of nitrobenzene reduction in the presence of HCl?",a:"The aromatic amine reacts with HCl to form a salt, C6H5NH3Cl."},
    {q:"How is the free aromatic amine liberated from its salt?",a:"By adding sodium hydroxide (NaOH), resulting in C6H5NH2 + H2O + NaCl."},
    {q:"Write the balanced equation for the liberation of free aromatic amine from its salt.",a:"C6H5NH3Cl + NaOH → C6H5NH2 + H2O + NaCl"},
    {q:"How do amines and ammonia behave as bases in water?",a:"They partially dissociate. e.g. NH3 + H2O ⇌ NH4⁺ + OH⁻"},
    {q:"What happens when ammonia reacts as a base with a proton?",a:"NH3 + H⁺ → NH4⁺"},
    {q:"What is the reaction of methylamine with H⁺?",a:"CH3NH2 + H⁺ → CH3NH3⁺"},
    {q:"What is the reaction of dimethylamine with H⁺?",a:"(CH3)2NH + H⁺ → (CH3)2NH2⁺"},
    {q:"What happens when trimethylamine reacts with H⁺?",a:"(CH3)3N + H⁺ → (CH3)3NH⁺"},
    {q:"What is the reaction of phenylamine with H⁺?",a:"C6H5NH2 + H⁺ → C6H5NH3⁺"},
    {q:"How does the availability of the lone pair affect the strength of amines as bases?",a:"The strength of amines as bases increases with the availability of the lone pair on nitrogen for protonation."},
    {q:"Arrange in increasing base strength: aromatic amines, ammonia, aliphatic amines.",a:"Aromatic amines < Ammonia < Aliphatic amines"},
    {q:"Why are aromatic amines weaker bases?",a:"The lone pair on nitrogen overlaps with the delocalised ring, making it less available. This is the negative inductive effect."},
    {q:"Why are aliphatic amines stronger bases?",a:"The R group pushes electrons towards the nitrogen atom, making the lone pair more available. This is the positive inductive effect."}
  ]},
  "3.3.12": { title: "Polymers", cards: [
    {q:"What is a condensation polymer?",a:"A polymer formed through a condensation reaction where molecules join, losing small molecules such as water as by-products."},
    {q:"What is the general reaction for forming esters from carboxylic acids and alcohols?",a:"CH3COOH + CH3OH → CH3COOCH3 + H2O"},
    {q:"What is the general reaction for forming esters from acyl chlorides and alcohols?",a:"CH3COCl + CH3OH → CH3COOCH3 + HCl"},
    {q:"What is the general reaction for forming amides from acyl chlorides and amines?",a:"CH3COCl + CH3NH2 → CH3CONHCH3 + HCl"},
    {q:"Why do simple condensation reactions of esters and amides not allow polymerisation?",a:"The products formed are not able to react with each other to form larger molecules."},
    {q:"What type of monomers are required for the formation of condensation polymers?",a:"Monomers with functional groups at both ends of the molecule, e.g. diol or diacid."},
    {q:"What two monomers are used in the formation of a polyester?",a:"A diacid and a diol"},
    {q:"What is the by-product of polyester formation through condensation polymerisation?",a:"Water (H2O)"},
    {q:"What is the name of the polyester made from benzene-1,4-dioic acid and ethane-1,2-diol?",a:"Terylene"},
    {q:"What are polyamides made from?",a:"Condensation of: 1. A diacid and a diamine, or 2. A diacyl chloride and a diamine."},
    {q:"What are the two examples of polyamides you must know?",a:"1. Nylon-6,6 — made by combining hexanedioic acid and hexane-1,6-diamine. 2. Kevlar — used in bullet-proof vests."},
    {q:"Why are polyamides generally very strong?",a:"Hydrogen bonding occurs both intermolecularly and intramolecularly, forming a helical structure."},
    {q:"What are polyesters commonly used for?",a:"As substitutes for wool and cotton — in clothing, carpets, rugs, bullet-proof vests, and flame-retardant clothing."},
    {q:"What are polyamides commonly used for?",a:"Underwear, fishing nets, and other elastic synthetic fibres."},
    {q:"What is the key structural difference between condensation and addition polymers?",a:"Condensation polymers contain polar bonds (C-N and C-O), whereas addition polymers consist entirely of non-polar C-C bonds."},
    {q:"Why are condensation polymers biodegradable?",a:"Their polar bonds (C-N and C-O) can be readily attacked by nucleophiles, breaking the polymer into monomers."},
    {q:"Why are addition polymers non-biodegradable?",a:"They consist entirely of non-polar C-C bonds, which are resistant to chemical attack."},
    {q:"What is one advantage of recycling polymers related to resource use?",a:"Recycling saves using crude oil (a non-renewable resource) and the energy required to refine it."},
    {q:"What is one advantage of recycling polymers related to waste management?",a:"Recycling prevents polymers from ending up in landfill sites."},
    {q:"What is a disadvantage of recycling polymers related to the process?",a:"Recycling requires collection, transportation, and sorting, which uses energy, manpower, and is expensive."}
  ]},
  "3.3.13": { title: "Amino Acids, Proteins & DNA", cards: [
    {q:"What are the two functional groups present in amino acids?",a:"Amine group (-NH2) and carboxylic acid group (-COOH)"},
    {q:"What is unique about the side chain (R) in amino acids?",a:"The alkyl side chain (R) is different for each amino acid."},
    {q:"What is a zwitterion, and at what pH does it form?",a:"A zwitterion is a molecule with both positive and negative charges. It forms at neutral pH."},
    {q:"Why are zwitterions solid at room temperature?",a:"Due to strong ionic interactions between molecules."},
    {q:"How does the amine group react with acids?",a:"The amine group is protonated by acids."},
    {q:"How does the carboxylic acid group react with bases?",a:"The carboxylic acid group is deprotonated by bases."},
    {q:"What reaction occurs between the carboxylic acid group and alcohols?",a:"The carboxylic acid group reacts with alcohols to form esters, with an acid catalyst."},
    {q:"What reaction can the amine group undergo with acyl chlorides or acid anhydrides?",a:"Acylation reactions"},
    {q:"What are two amino acids bonded together by a peptide bond called?",a:"Dipeptide"},
    {q:"What are three amino acids bonded together by a peptide bond called?",a:"Tripeptides"},
    {q:"What are many amino acids bonded together by a peptide bond called?",a:"Polypeptides"},
    {q:"What is the primary structure of a protein?",a:"The sequence of amino acids covalently bonded to form the polypeptide chain."},
    {q:"What is the secondary structure of a protein formed by?",a:"Hydrogen bonding between backbone atoms."},
    {q:"What are the two examples of secondary structure of a protein?",a:"Alpha-helix (α-helix) and beta-pleated sheet (β-pleated sheet)"},
    {q:"What is the role of hydrogen bonds in the tertiary structure of a protein?",a:"They hold the polypeptide chains together, forming between the C=O group of one amino acid and the N-H group of another."},
    {q:"What causes disulfide bridges to form in proteins?",a:"Through the oxidation of two cysteine amino acids, resulting in a covalent bond between their sulfur atoms."},
    {q:"What are enzymes?",a:"Enzymes are proteins with an active site that is stereospecific, interacting only with one enantiomer."},
    {q:"What is an enzyme-substrate complex?",a:"A complex formed when an enzyme binds to its specific substrate."},
    {q:"What is the function of enzyme inhibitors?",a:"Enzyme inhibitors block the active site of enzymes and prevent their function."},
    {q:"What are the components of a nucleotide in DNA?",a:"1. A phosphate ion bonded to 2. 2-deoxyribose (sugar), which is bonded to 3. One of four bases: adenine, cytosine, guanine, or thymine."},
    {q:"How are nucleotides joined together in DNA?",a:"In a condensation reaction, forming a sugar-phosphate backbone and losing water."},
    {q:"What is cis-platin?",a:"A square planar complex used in chemotherapy treatment."},
    {q:"How does cis-platin disrupt DNA replication?",a:"Cis-platin bonds with guanine and disrupts DNA replication, which kills the cells."},
    {q:"What happens to the chloride ligands in cis-platin when it binds to DNA?",a:"The chloride ligands are replaced by guanine base."},
    {q:"How does the nitrogen atom of guanine interact with cis-platin?",a:"The nitrogen atom uses its lone pair to form a coordinate bond with the platinum in cis-platin."},
    {q:"What happens when cis-platin reacts with water inside the body?",a:"One chloride ligand is replaced by a water molecule, forming [Pt(NH3)2Cl(H2O)]⁺ and Cl⁻."},
    {q:"Write the reaction when cis-platin reacts with water inside the body.",a:"[Pt(NH3)2Cl2] + H2O → [Pt(NH3)2Cl(H2O)]⁺ + Cl⁻"},
    {q:"Why can't trans-platin function like cis-platin?",a:"The chloride ligands are on opposite sides of the complex, preventing effective interaction with DNA."},
    {q:"What other fast-multiplying cells are affected by cis-platin treatment?",a:"White blood cells, gametes, and hair cells."},
    {q:"What are the side effects of cis-platin treatment?",a:"Immune system suppression, fertility issues, and hair loss."},
    {q:"Which nitrogen atoms on guanine can form a coordinate bond with cis-platin?",a:"Either of the nitrogen atoms with a lone pair NOT involved in bonding to cytosine."},
    {q:"How can cis-platin be administered to minimise its side effects on healthy cells?",a:"Use in very small amounts or target the application to the tumour."}
  ]},
  "3.3.14": { title: "Organic Synthesis", cards: [
    {q:"What mechanism is involved in converting an alkane to a halogenoalkane?",a:"Free Radical Substitution"},
    {q:"What are the reagents and conditions for the reaction of an alkane to a halogenoalkane?",a:"Reagents: Chlorine | Conditions: UV light"},
    {q:"Provide the equation for the reaction of methane with chlorine to form a halogenoalkane.",a:"CH4 + Cl2 → CH3Cl + HCl"},
    {q:"What mechanism is used to convert a halogenoalkane to an alcohol?",a:"Nucleophilic Substitution"},
    {q:"What are the reagents and conditions for the conversion of a halogenoalkane to an alcohol?",a:"Reagents: NaOH | Conditions: Warm aqueous"},
    {q:"Write the general equation for the reaction of a halogenoalkane with NaOH to form an alcohol.",a:"R-Cl + NaOH → R-OH + NaCl"},
    {q:"What is the mechanism and equation for the conversion of a halogenoalkane to an alkene?",a:"Mechanism: Elimination | Equation: CH3CH2Cl + KOH → CH2=CH2 + KCl + H2O | Conditions: Hot in ethanol"},
    {q:"How can a halogenoalkane be converted to a nitrile?",a:"Mechanism: Nucleophilic Substitution | Reagents: KCN | Equation: R-Cl + KCN → R-CN + KCl | Conditions: Aqueous ethanol"},
    {q:"How can a halogenoalkane be converted to a primary amine?",a:"Mechanism: Nucleophilic Substitution | Reagents: Excess ammonia | Equation: R-Cl + 2NH3 → R-NH2 + NH4Cl"},
    {q:"How can an alkene be converted to an alkane?",a:"Reaction: Catalytic hydrogenation | Reagents: Hydrogen | Conditions: Ni catalyst | Equation: CH2=CH2 + H2 → CH3CH3"},
    {q:"How can an alkene be converted to a dibromoalkane?",a:"Mechanism: Electrophilic Addition | Reagents: Bromine | Equation: CH2=CH2 + Br2 → CH2BrCH2Br"},
    {q:"How can an alkene be converted to a bromoalkane?",a:"Mechanism: Electrophilic Addition | Reagents: Hydrogen bromide | Equation: CH2=CH2 + HBr → CH3CH2Br"},
    {q:"How can an alkene be converted to an alkylhydrogensulphate?",a:"Mechanism: Electrophilic Addition | Reagents: Concentrated sulphuric acid | Equation: CH2=CH2 + H2SO4 → CH3CH2OSO3H"},
    {q:"How can an alkylhydrogensulphate be converted to an alcohol?",a:"Reaction: Hydrolysis | Reagents: Water | Equation: CH3CH2OSO3H + H2O → CH3CH2OH + H2SO4"},
    {q:"How can an alkene be converted to an alcohol (direct hydration)?",a:"Reaction: Direct Hydration | Mechanism: Electrophilic Addition | Reagents: Steam | Conditions: H3PO4 or H2SO4 catalyst | Equation: CH2=CH2 + H2O → CH3CH2OH"},
    {q:"How can an alcohol be converted to an alkene?",a:"Reaction: Dehydration | Mechanism: Elimination | Reagents: Concentrated sulfuric acid | Equation: CH3CH2OH → CH2=CH2 + H2O"},
    {q:"How can a primary or secondary alcohol be converted to an aldehyde or ketone?",a:"Reaction: Oxidation | Reagents: Acidified potassium dichromate | Conditions: Distillation | Equations: RCH2OH + [O] → RCHO + H2O; RCH(OH)R + [O] → RCOR + H2O"},
    {q:"How can a primary alcohol be converted to a carboxylic acid?",a:"Reaction: Oxidation | Reagents: Acidified potassium dichromate | Conditions: Reflux, excess oxidant | Equation: R-CH2OH + 2[O] → R-COOH + H2O"},
    {q:"How can an aldehyde be converted to a carboxylic acid?",a:"Reaction: Oxidation | Reagents: Acidified potassium dichromate | Conditions: Reflux | Equation: R-CHO + [O] → R-COOH"},
    {q:"How can an aldehyde or ketone be converted to an alcohol?",a:"Reaction: Reduction | Mechanism: Nucleophilic Addition | Reagents: NaBH4 (aqueous) | Equation: R1-COR2 + 2[H] → R1R2CHOH"},
    {q:"How can an aldehyde or ketone be converted to a hydroxynitrile?",a:"Mechanism: Nucleophilic Addition | Reagents: KCN + dilute HCl | Equation: R1COR2 + KCN + H⁺ → R1R2COHCN"},
    {q:"How can an acyl chloride be converted to a carboxylic acid?",a:"Mechanism: Nucleophilic addition-elimination | Reagents: Water | Equation: R-COCl + H2O → R-COOH + HCl"},
    {q:"How can an acid anhydride be converted to a carboxylic acid?",a:"Mechanism: Nucleophilic addition-elimination | Reagents: Water | Equation: (RCO)2O + H2O → 2R-COOH"},
    {q:"How can a carboxylic acid be converted to a carboxylate salt?",a:"Reagents: NaOH | Equation: R-COOH + NaOH → R-COONa + H2O"},
    {q:"How can a carboxylic acid and alcohol react to form an ester?",a:"Reaction: Esterification | Reagents: Concentrated sulphuric acid | Equation: R1COOH + R2OH → R1COOR2 + H2O"},
    {q:"How can an acyl chloride and alcohol react to form an ester?",a:"Mechanism: Nucleophilic Addition-Elimination | Equation: R1COCl + R2OH → R1COOR2 + HCl"},
    {q:"How can an acid anhydride and alcohol react to form an ester?",a:"Mechanism: Nucleophilic Addition-Elimination | Equation: (RCO)2O + R2OH → R1COOR2 + R1COOH"},
    {q:"How can an acyl chloride be converted to an amide?",a:"Mechanism: Nucleophilic Addition-Elimination | Reagents: Ammonia | Equation: R-COCl + NH3 → R-CONH2 + HCl"},
    {q:"How can an acid anhydride be converted to an amide?",a:"Mechanism: Nucleophilic Addition-Elimination | Reagents: Ammonia | Equation: (RCO)2O + NH3 → R-CONH2 + RCOOH"},
    {q:"How can an acyl chloride react with a primary amine to form an N-substituted amide?",a:"Mechanism: Nucleophilic Addition-Elimination | Equation: R1COCl + 2R2-NH2 → R1CONHR2 + R2-NH3Cl"},
    {q:"How can an acid anhydride react with a primary amine to form an N-substituted amide?",a:"Mechanism: Nucleophilic Addition-Elimination | Equation: (RCO)2O + R2-NH2 → R1CONHR2 + R1-COOH"},
    {q:"How can an ester be converted to a carboxylic acid and alcohol?",a:"Reaction: Hydrolysis | Reagents: Water + concentrated sulfuric acid | Equation: R1COOR2 + H2O → R1COOH + R2OH"},
    {q:"How can an ester be converted to a carboxylate salt and alcohol?",a:"Reaction: Hydrolysis | Reagents: NaOH(aq) | Equation: R1COOR2 + NaOH → R1COONa + R2OH"},
    {q:"How can benzene be converted to nitrobenzene?",a:"Mechanism: Electrophilic Substitution | Reagents: Concentrated H2SO4 + concentrated HNO3 | Equation: C6H6 + HNO3 → C6H5NO2 + H2O"},
    {q:"How can benzene be converted to phenylketone (Friedel-Crafts acylation)?",a:"Mechanism: Electrophilic Substitution | Reagents: Acyl chloride, AlCl3 | Equation: C6H6 + RCOCl → C6H5COR + HCl"},
    {q:"How can nitrobenzene be converted to phenylamine?",a:"Reaction: Reduction | Reagents: Tin, concentrated HCl | Equation: C6H5NO2 + 6[H] → C6H5NH2 + 2H2O"},
    {q:"How can a primary amine be converted to a secondary amine?",a:"Mechanism: Nucleophilic Substitution | Reagents: Haloalkane | Equation: R1-NH2 + R2-Cl → R1R2NH + HCl"},
    {q:"How can a secondary amine be converted to a tertiary amine?",a:"Mechanism: Nucleophilic Substitution | Reagents: Haloalkane | Equation: R1R2NH + R3-Cl → R1R2R3N + HCl"},
    {q:"How can a tertiary amine be converted to a quaternary ammonium halide salt?",a:"Mechanism: Nucleophilic Substitution | Reagents: Haloalkane | Equation: R1R2R3N + R4-Cl → R1R2R3R4N⁺Cl⁻"},
    {q:"How can an amine be converted to an alkylammonium salt?",a:"Mechanism: Nucleophilic Substitution | Reagents: HCl(aq) | Equation: R1R2R3N + HCl → R1R2R3NHCl"},
    {q:"How can a nitrile be converted to an amine?",a:"Reaction: Reduction | Reagents: Hydrogen and Nickel Catalyst | Equation: RCN + 4[H] → RCH2NH2"},
    {q:"How can a nitrile be converted to a carboxylic acid?",a:"Reaction: Hydrolysis | Reagents: Dilute HCl | Equation: RCN + HCl + 2H2O → RCOOH + NH4Cl"}
  ]},
  "3.3.15": { title: "NMR Spectroscopy", cards: [
    {q:"What does NMR stand for?",a:"Nuclear Magnetic Resonance Spectroscopy"},
    {q:"What is NMR used for?",a:"To deduce the entire chemical structure."},
    {q:"Why are analytical techniques important in confirming new compounds?",a:"They provide precise molecular information."},
    {q:"How does carbon-13 NMR differ from proton NMR?",a:"Carbon-13 NMR gives simpler spectra as carbon atoms do not exhibit splitting from adjacent atoms."},
    {q:"Why is the delta scale used in NMR spectroscopy?",a:"It is used to record chemical shift, measuring the resonance frequency relative to a standard."},
    {q:"What information can be found using NMR spectroscopy?",a:"1. Number of proton environments (from number of peaks). 2. Hydrogens in nearby environment (from peak splitting). 3. Hydrogens in that environment (from integration ratio). 4. Nature of the environment (from chemical shift)."},
    {q:"For proton NMR, what must be remembered when counting environments?",a:"If a carbon isn't attached to a hydrogen, don't consider it when counting the number of environments."},
    {q:"How do you use IR and NMR spectroscopy together to deduce a molecule?",a:"1. Work out the empirical and molecular formula. 2. Use IR spectroscopy to identify the main functional groups. 3. Use NMR spectroscopy to give details of the carbon chain."},
    {q:"Why do hydrogen atoms on neighbouring carbons affect resonance?",a:"They create their own magnetic fields, impacting the resonance conditions of protons."},
    {q:"What is the integration trace in NMR?",a:"It gives the relative number of hydrogens in each environment."},
    {q:"What is Carbon-13 NMR spectroscopy?",a:"Works the same as proton NMR but detects C-13 nuclei. Provides the number and type of carbon environments, but is less reliable."},
    {q:"What is chemical shift in NMR?",a:"Measured in ppm with a standard of 0 from Si(CH3)4. More shielding reduces chemical shift. Electronegative atoms nearby cause deshielding and a larger chemical shift."},
    {q:"What is the (n+1) rule?",a:"Peak splitting = Number of hydrogens on neighbouring carbons + 1"},
    {q:"How does the molecular environment affect chemical shift?",a:"Highly electronegative atoms deshield the nucleus, increasing the chemical shift (delta value)."},
    {q:"What are the four rules for proton NMR when deducing a molecule?",a:"1. Number of peaks. 2. Chemical shift. 3. Integration trace (ratios). 4. Splitting pattern."},
    {q:"How does resonance occur in NMR?",a:"Protons flip between high and low energy orientations under the right magnetic field strength and radio-frequency. Absorption peaks are produced during resonance."},
    {q:"How is NMR spectroscopy prepared?",a:"1. Dissolve the sample in an inert solvent (e.g. CCl4 or CDCl3). 2. Use solvents with no H atoms. 3. Deuterated solvents like CDCl3 can be used."},
    {q:"Why must the sample be dissolved in an inert solvent for NMR?",a:"The solvent contains no protons, so it does not create interference peaks."},
    {q:"What solvents are used for NMR spectroscopy?",a:"TMS; CCl4 (non-polar, for non-polar organic molecules); CDCl3 (polar, for polar organic molecules)."},
    {q:"How does NMR spectroscopy work?",a:"1. Hydrogen nuclei act as spinning protons with a magnetic field. 2. When placed in a magnetic field, they align along magnetic force lines. 3. High-energy orientation is achieved by absorbing photons."},
    {q:"What is meant by equivalent hydrogen environments?",a:"Both carbon groups give the same peak in the spectrum."},
    {q:"What does a singlet peak splitting mean?",a:"No adjacent hydrogen environments."},
    {q:"What does a doublet peak splitting mean?",a:"1 adjacent hydrogen environment."},
    {q:"What does a triplet peak splitting mean?",a:"2 adjacent hydrogen environments."},
    {q:"What does a quartet peak splitting mean?",a:"3 adjacent hydrogen environments."},
    {q:"What is tetramethylsilane (TMS / Si(CH3)4) used for in NMR?",a:"It acts as a standard in NMR as it produces a single peak at delta = 0."},
    {q:"Why is TMS used as the NMR standard?",a:"Produces one signal; signal is away from other H signals; strong signal allows small sample; non-toxic; inert; low boiling point for easy removal."}
  ]},
  "RP1a": {
    title: "RP1a: Making a Standard Solution",
    cards: [
      {q: "What is the first step in making a standard solution?", a: "Weigh the sample bottle containing the required mass of solid on a 2 decimal place balance."},
      {q: "How is the mass of the solid determined after transferring it to the beaker?", a: "Reweigh the sample bottle and record the difference in mass (differential weighing)."},
      {q: "How is the solid dissolved in the beaker? (2 steps)", a: "1. Add 100 cm³ of distilled water to the beaker.\n2. Use a glass rod to stir and help dissolve the solid."},
      {q: "How is the solution transferred to the volumetric flask? (2 steps)", a: "1. Pour the solution into a 250 cm³ graduated flask via a funnel.\n2. Rinse the beaker and funnel, adding the washings to the volumetric flask."},
      {q: "How is the solution made up to the required volume? (2 steps)", a: "1. Add distilled water up to the mark using a dropping pipette for the final few drops.\n2. Invert the flask several times to ensure a uniform solution."},
      {q: "What should be done if the substance does not dissolve in cold water?", a: "The beaker and its contents should be gently heated until all the solid has dissolved."},
      {q: "Why is it important to correctly fill the volumetric flask up to the mark?", a: "The bottom of the meniscus must sit on the line to ensure accurate concentration. Especially for dark liquids like potassium manganate, where the meniscus is hard to see."}
    ]
  },

  "RP1b": {
    title: "RP1b: Carrying out an Acid-Base Titration",
    cards: [
      {q: "What equipment should be rinsed before starting a titration? (3)", a: "- Burette with acid\n- Pipette with alkali\n- Conical flask with distilled water"},
      {q: "What volume of alkali is pipetted into the conical flask for titration?", a: "25 cm³"},
      {q: "How should the burette be prepared before starting the titration? (2)", a: "- Fill the burette with acid\n- Ensure the jet space in the burette is filled with acid"},
      {q: "What is recorded before starting the titration?", a: "The initial burette reading"},
      {q: "What is added to the alkali in the conical flask before titration begins?", a: "A few drops of indicator"},
      {q: "Why is a white tile placed underneath the conical flask during titration?", a: "To help observe the colour change"},
      {q: "How is the acid added to the alkali in the conical flask? (2)", a: "- Add acid whilst swirling the mixture\n- Add acid dropwise near the endpoint"},
      {q: "When should the titration be stopped?", a: "When the relevant colour change is observed"},
      {q: "What is recorded at the end of the titration?", a: "The final burette reading"},
      {q: "How many titrations should be performed to obtain concordant results?", a: "At least two concordant results (two readings within 0.1 cm³ of each other)"},
      {q: "Why must the jet space in the burette be properly filled?", a: "If not filled, it will result in a larger than expected titration reading"},
      {q: "Why are conical flasks preferred over beakers for titrations?", a: "They are easier to swirl"},
      {q: "Why should only a few drops of indicator be used?", a: "Indicators are weak acids, so using too much affects the titration result"},
      {q: "What is the colour change for phenolphthalein in titration? (2)", a: "Alkali: Pink\nAcid: Colourless (endpoint: pink colour just disappears)"},
      {q: "What is the colour change for methyl orange in titration? (3)", a: "Alkali: Yellow\nAcid: Red\nEndpoint: Orange"}
    ]
  },

  "RP2": {
    title: "RP2: Measuring an Enthalpy Change",
    cards: [
      {q: "What is used to insulate and support the reaction mixture in an enthalpy change experiment?", a: "A polystyrene cup in a beaker"},
      {q: "How should the thermometer be positioned in the enthalpy change experiment?", a: "Clamped in place with the bulb immersed in liquid"},
      {q: "What temperature measurements should be taken before starting the reaction?", a: "The initial temperature(s) of the solution (or both solutions if two are used)"},
      {q: "What is the correct order of adding reagents if a solid reagent is used? (2 steps)", a: "1. Add the solution to the cup first\n2. Then add the weighed-out solid"},
      {q: "What should be done to ensure even mixing of the reactants?", a: "Stir the mixture"},
      {q: "What is recorded at the end of the reaction in an enthalpy experiment?", a: "The highest/lowest temperature reached"},
      {q: "Why is the exact temperature rise difficult to obtain if the reaction is slow?", a: "Cooling occurs at the same time as the reaction"},
      {q: "How can inaccuracies due to cooling be minimised in temperature measurements? (3)", a: "1. Take readings at regular intervals\n2. Plot the data\n3. Extrapolate the temperature curve back"},
      {q: "What are common sources of error in an enthalpy change experiment? (5)", a: "- Heat loss/gain\n- Approximation of specific heat capacity of solution\n- Neglecting specific heat capacity of the calorimeter\n- Incomplete reaction\n- Assuming the density of the solution is the same as water"}
    ]
  },

  "RP3": {
    title: "RP3: Investigating Rate vs Temperature",
    cards: [
      {q: "What equipment is used to measure 10.0 cm³ of sodium thiosulfate solution?", a: "A measuring cylinder"},
      {q: "What is placed under the conical flask in the rate vs temperature experiment?", a: "A white tile with a cross drawn on it"},
      {q: "What should be recorded before starting the clock reaction?", a: "The initial temperature"},
      {q: "What is added to the sodium thiosulfate solution to start the reaction?", a: "1 cm³ of 1 mol dm⁻³ hydrochloric acid"},
      {q: "What should be recorded as the clock reaction takes place?", a: "The time for the cross to disappear from view"},
      {q: "What measurement is taken after the clock reaction is complete?", a: "The final temperature of the reaction mixture"},
      {q: "How many different temperature conditions should be used in the rate experiment?", a: "At least 5 different temperatures"},
      {q: "What should be plotted on a graph to analyse the rate vs temperature results?", a: "A graph of temperature vs. time, using the average temperature for each reaction"},
      {q: "Why can the temperature of an exothermic reaction only be approximated in this experiment?", a: "Because you can only take a reading of the initial temperature"}
    ]
  },

  "RP4": {
    title: "RP4: Ion Identification Tests",
    cards: [
      {q: "What is the result when barium ions react with NaOH dropwise until in excess?", a: "No visible change (NVC)"},
      {q: "What is observed when calcium ions react with NaOH dropwise until in excess?", a: "Slight white precipitate"},
      {q: "How does magnesium ion react with NaOH dropwise until in excess? (2)", a: "- Slight white precipitate\n- White precipitate in excess"},
      {q: "What is the result when strontium ions react with NaOH dropwise until in excess?", a: "Slight white precipitate"},
      {q: "What is the result when barium ions react with dilute H₂SO₄ dropwise until in excess?", a: "White precipitate"},
      {q: "How does calcium ion react with dilute H₂SO₄ dropwise until in excess?", a: "Slight white precipitate"},
      {q: "What is the result when magnesium ions react with dilute H₂SO₄ dropwise until in excess? (2)", a: "- Slight white precipitate\n- Colourless solution in excess"},
      {q: "How does strontium ion react with dilute H₂SO₄ dropwise until in excess?", a: "White precipitate"},
      {q: "How can ammonium ions be identified using NaOH? (2)", a: "1. Gently heat.\n2. Hold damp red litmus paper over the gas; ammonia gas is produced, turning litmus blue."},
      {q: "How can hydroxide ions be identified using indicator paper?", a: "Turns red litmus paper or universal indicator paper blue"},
      {q: "What is the test for carbonate ions? (3)", a: "1. Add HCl.\n2. Test the gas produced with limewater.\n3. Effervescence occurs, CO₂ gas is produced, and limewater turns cloudy"},
      {q: "How can sulfate ions be identified? (2)", a: "1. Add HCl followed by barium chloride\n2. White precipitate forms"},
      {q: "How do chloride ions in solution react with silver nitrate?", a: "White precipitate forms"},
      {q: "What happens when dilute ammonia is added to the chloride precipitate from silver nitrate?", a: "Precipitate dissolves"},
      {q: "How do bromide ions in solution react with silver nitrate?", a: "Cream precipitate forms"},
      {q: "What happens when concentrated ammonia is added to the bromide precipitate from silver nitrate?", a: "Precipitate dissolves"},
      {q: "How do iodide ions in solution react with silver nitrate?", a: "Pale yellow precipitate forms"},
      {q: "What happens when concentrated ammonia is added to the iodide precipitate from silver nitrate?", a: "No visible change"},
      {q: "What is the result when solid chloride reacts with concentrated H₂SO₄? (2)", a: "- Effervescence\n- Damp blue litmus paper turns red (HCl produced)"},
      {q: "How does solid bromide react with concentrated H₂SO₄? (3)", a: "- Effervescence\n- Brown gas (Br₂) is produced\n- Solution turns red/brown"},
      {q: "What happens when gas from solid bromide reacting with H₂SO₄ is tested with acidified potassium dichromate solution?", a: "Turns solution orange"},
      {q: "How does solid iodide react with concentrated H₂SO₄? (3)", a: "- Brown gas (I₂) is produced\n- Solution turns red/brown\n- Paper dipped in lead nitrate turns black"}
    ]
  },

  "RP5": {
    title: "RP5: Distilling a Product from a Reaction",
    cards: [
      {q: "What is the purpose of distillation in organic chemistry? (2)", a: "- Used as a separation technique to isolate an organic product from its reacting mixture\n- By collecting the distillate at the approximate boiling point of the desired liquid"},
      {q: "What is the purpose of the Liebig condenser in distillation?", a: "To cool and condense the vaporised liquid into a distillate"},
      {q: "Why does water enter from the bottom of the Liebig condenser? (2)", a: "- Ensures more efficient cooling\n- Prevents backflow of water"},
      {q: "What type of flask is used in distillation, and why? (2)", a: "- A round-bottomed flask is used\n- Because it allows even heating of the liquid"},
      {q: "What is the purpose of fractional distillation?", a: "Fractional distillation is used to separate liquids with different boiling points"},
      {q: "How is the mixture heated in fractional distillation? (2)", a: "- The flask is heated using a Bunsen burner or an electric mantle\n- To produce vapours of all the components in the mixture"},
      {q: "What happens to vapours as they pass up the fractionating column? (2)", a: "- The vapour of the substance with the lower boiling point reaches the top of the fractionating column first\n- Vapours with higher boiling points condense back into the flask"},
      {q: "Where should the thermometer be placed in the fractional distillation apparatus?", a: "The thermometer should be at or below the boiling point of the most volatile substance"},
      {q: "What is the function of the condenser in fractional distillation?", a: "The condenser cools the vapours and condenses them into a liquid, which is then collected"}
    ]
  },

  "RP6": {
    title: "RP6: Testing for Functional Groups",
    cards: [
      {q: "What reagent is used to test for an alkene, and what is the positive result? (2)", a: "- Reagent: Bromine water\n- Result: Orange colour decolorises"},
      {q: "What reagent is used to test for an aldehyde, and what is the result with Fehling's solution? (2)", a: "- Reagent: Fehling's solution\n- Result: Blue solution turns red with precipitate"},
      {q: "What is the result of the Tollen's reagent test for an aldehyde?", a: "Silver mirror formed"},
      {q: "How can a carboxylic acid be identified using a reagent, and what is the positive result? (2)", a: "- Reagent: Sodium carbonate / sodium hydrogencarbonate\n- Result: Effervescence, CO₂ made"},
      {q: "What reagent is used to test for primary and secondary alcohols, and what is the result? (2)", a: "- Reagent: Acidified sodium dichromate (K₂Cr₂O₇/H₂SO₄)\n- Result: Orange to green colour change"},
      {q: "What happens when a chloroalkane is warmed with silver nitrate?", a: "Formation of white precipitate (AgCl)"},
      {q: "What is the result when a bromoalkane is warmed with silver nitrate?", a: "Formation of cream precipitate (AgBr)"},
      {q: "What is the result when an iodoalkane is warmed with silver nitrate?", a: "Formation of pale yellow precipitate (AgI)"},
      {q: "How does an acyl chloride react with silver nitrate? (2)", a: "- Vigorous reaction with steamy fumes of HCl\n- Rapid production of white precipitate (AgCl)"}
    ]
  },

  "RP7": {
    title: "RP7: Measuring the Rate of a Reaction",
    cards: [
      {q: "What are the two methods for measuring rate of a reaction?", a: "- Initial rates method\n- Continuous monitoring"},
      {q: "What method is used to measure the rate of reaction by the initial rates method?", a: "Measuring the volume of hydrogen gas collected in 30 seconds"},
      {q: "What volume and concentration of hydrochloric acid is used in the initial rates method? (2)", a: "- Volume: 50 cm³\n- Concentration: 1.0 mol dm⁻³"},
      {q: "What apparatus is set up to measure gas production in both rate methods?", a: "A gas syringe is set up in the stand"},
      {q: "What mass of magnesium is used in both rate methods?", a: "0.20 g of magnesium"},
      {q: "How is the rate of reaction determined in the initial rates method?", a: "By recording the volume of hydrogen gas collected in 30 seconds"},
      {q: "What variable is changed when repeating the initial rates method?", a: "Different concentrations of hydrochloric acid are used"},
      {q: "How is the rate of reaction measured in the continuous monitoring method?", a: "The volume of hydrogen gas collected is recorded every 15 seconds until the reaction is finished"}
    ]
  },

  "RP8": {
    title: "RP8: Measuring the EMF of an Electrochemical Cell",
    cards: [
      {q: "What two metals are cleaned using fine-grade sandpaper in the electrochemical cell experiment? (2)", a: "- Copper\n- Zinc"},
      {q: "How is the metal degreased before the electrochemical cell experiment? (2)", a: "- Using cotton wool\n- Using propanone"},
      {q: "What solutions are used for the copper and zinc half-cells? (2)", a: "- Copper half-cell: 1 mol dm⁻³ CuSO₄ solution\n- Zinc half-cell: 1 mol dm⁻³ ZnSO₄ solution"},
      {q: "What solution is used to fill the U-tube in the electrochemical cell experiment?", a: "2 mol dm⁻³ NaCl solution"},
      {q: "How is the U-tube prepared before connecting the half-cells? (2)", a: "- One end of the tube is lightly plugged with cotton wool and filled with NaCl solution\n- The free end is then plugged with cotton wool before joining the two beakers"},
      {q: "How are the copper and zinc half-cells connected to measure EMF? (2)", a: "- The two beakers are joined using the inverted U-tube\n- The Cu(s)|Cu²⁺(aq) and Zn(s)|Zn²⁺(aq) half-cells are connected using metals, crocodile clips, and leads"},
      {q: "What is the final step in measuring the EMF of an electrochemical cell?", a: "Read off the voltage from the voltmeter"}
    ]
  },

  "RP9": {
    title: "RP9: pH Changes in Acid-Base Reactions",
    cards: [
      {q: "What is the first step in investigating pH changes in acid-base reactions?", a: "Measure the initial pH of the alkali"},
      {q: "How should the acid be added to the alkali during the pH experiment? (2)", a: "- In small amounts\n- Noting the volume added"},
      {q: "Why is stirring necessary when adding acid to the alkali in the pH experiment?", a: "To equalise the pH"},
      {q: "What should be done after each addition of acid in the pH experiment?", a: "Measure and record the pH"},
      {q: "How should the acid be added when approaching the endpoint in the pH experiment?", a: "In smaller volumes"},
      {q: "When should the addition of acid be stopped in the pH experiment?", a: "When acid is in excess"},
      {q: "Why should the pH meter be calibrated before the pH experiment? (2)", a: "- pH meters can lose accuracy in storage\n- So calibration with a known buffer solution ensures accurate measurements"},
      {q: "How can accuracy be improved in the pH investigation?", a: "By maintaining a constant temperature"}
    ]
  },

  "RP10a": {
    title: "RP10a: Preparing a Pure Organic Solid",
    cards: [
      {q: "What is the first step in recrystallisation?", a: "Dissolve the impure compound in a minimum volume of hot (near boiling) solvent"},
      {q: "Why is a minimum volume of hot solvent used in recrystallisation? (2)", a: "- To obtain a saturated solution\n- To enable crystallisation on cooling"},
      {q: "Why should the solution be filtered hot through fluted filter paper?", a: "To remove any insoluble impurities and prevent crystals from reforming during filtration"},
      {q: "How is the solution cooled after filtration in recrystallisation?", a: "By inserting the beaker in ice"},
      {q: "Why is the recrystallised solution cooled in ice? (2)", a: "- To encourage crystal formation\n- Soluble impurities remain in solution as they are present in small quantities"},
      {q: "How are crystals separated from the filtrate in recrystallisation?", a: "By suction filtration using a Buchner flask"},
      {q: "Why is suction filtration used in recrystallisation?", a: "It reduces pressure and speeds up the filtration"},
      {q: "How are the recrystallised crystals washed?", a: "By washing with distilled water"},
      {q: "Why are the recrystallised crystals washed with distilled water?", a: "To remove soluble impurities"},
      {q: "How are recrystallised crystals dried?", a: "By drying between absorbent paper"},
      {q: "What are possible sources of yield loss during recrystallisation? (3)", a: "- Loss of crystals during filtering and washing\n- Product staying in solution after recrystallisation\n- Side reactions"},
      {q: "How is melting point measured to determine purity? (2)", a: "- Place a small amount of the sample in a capillary tube\n- Heat slowly near the melting point"},
      {q: "What are the characteristics of a pure sample's melting point?", a: "A pure sample has a sharp melting point at the same value as in data books"},
      {q: "How do impurities affect the melting point? (2)", a: "- Impurities lower the melting point\n- The sample melts over a range of several degrees Celsius"}
    ]
  },

  "RP10b": {
    title: "RP10b: Preparing a Pure Organic Liquid",
    cards: [
      {q: "What are the guidelines for drawing the reflux apparatus (common examiner mistakes)? (4)", a: "- Don't draw lines between flask and condenser\n- Don't seal the top of the condenser\n- Ensure the condenser has an outer tube for water that is sealed at the top and bottom\n- The condenser must have two open openings for water inlet and outlet"},
      {q: "What is the purpose of reflux in an organic reaction?", a: "The condenser prevents organic vapours from escaping by condensing them back to liquids during long heating periods"},
      {q: "Why should the end of the condenser never be sealed? (3)", a: "- Can cause gas pressure to build up\n- Potentially leading to an explosion\n- Especially when heating volatile liquids"},
      {q: "What is the function of anti-bumping granules in reflux and distillation?", a: "Prevent vigorous, uneven boiling by forming small bubbles instead of large ones"},
      {q: "What is the first step in purifying a liquid product from reflux?", a: "Put the distillate of the impure product into a separating funnel"},
      {q: "What two solutions can be used to wash the product in a separating funnel? (2)", a: "- Sodium hydrogencarbonate solution (shaking and releasing pressure from CO₂ produced)\n- Saturated sodium chloride solution"},
      {q: "What should be done after washing the product in the separating funnel?", a: "Allow the layers to separate and then run and discard the aqueous layer"},
      {q: "How is the organic layer dried after separation from the aqueous layer? (2)", a: "1. The organic layer is transferred into a clean, dry conical flask\n2. Three spatula loads of anhydrous sodium sulfate are added to dry the liquid"},
      {q: "How should the dry organic liquid be transferred for purification?", a: "Carefully decant the liquid into a distillation flask"},
      {q: "What is the final step in purifying a liquid organic product?", a: "Distill the liquid to collect the pure product"},
      {q: "What is the role of sodium hydrogencarbonate in purification of an organic liquid?", a: "Sodium hydrogencarbonate neutralises any remaining acid"},
      {q: "How does sodium chloride help in purification of an organic liquid?", a: "Sodium chloride helps separate the organic layer from the aqueous layer"},
      {q: "What are two important properties of a suitable drying agent? (2)", a: "- It should be insoluble in the organic liquid\n- It should not react with the organic liquid"}
    ]
  },

  "RP11": {
    title: "RP11: Transition Metal Ion Identification",
    cards: [
      {q: "What are the three reagents used to test metal-aqua ions in solution? (3)", a: "- Sodium hydroxide solution\n- Ammonia solution\n- Sodium carbonate solution"},
      {q: "What is the reaction of [Cu(H₂O)₆]²⁺ with sodium hydroxide?", a: "Forms a blue precipitate of [Cu(H₂O)₄(OH)₂]"},
      {q: "What happens when excess sodium hydroxide is added to [Cu(H₂O)₆]²⁺?", a: "No visible change"},
      {q: "What happens when ammonia is added to [Cu(H₂O)₆]²⁺?", a: "No visible change (blue precipitate initially, same as NaOH)"},
      {q: "What is the effect of excess ammonia on [Cu(H₂O)₆]²⁺?", a: "A deep blue solution of [Cu(H₂O)₂(NH₃)₄]²⁺ is formed"},
      {q: "What happens when sodium carbonate solution is added to [Cu(H₂O)₆]²⁺?", a: "A green-blue precipitate of CuCO₃ forms"},
      {q: "What is the reaction of [Fe(H₂O)₆]²⁺ with sodium hydroxide?", a: "Forms a green precipitate of [Fe(H₂O)₄(OH)₂]"},
      {q: "What happens when excess sodium hydroxide is added to [Fe(H₂O)₆]²⁺?", a: "No visible change"},
      {q: "What is the reaction of [Fe(H₂O)₆]²⁺ with sodium carbonate solution?", a: "Forms a green precipitate of FeCO₃"},
      {q: "What is the reaction of [Al(H₂O)₆]³⁺ with sodium hydroxide?", a: "Forms a white precipitate of [Al(H₂O)₃(OH)₃]"},
      {q: "What happens when excess sodium hydroxide is added to [Al(H₂O)₆]³⁺?", a: "Forms a colourless solution of [Al(H₂O)₂(OH)₄]⁻"},
      {q: "What is the reaction of [Al(H₂O)₆]³⁺ with sodium carbonate solution?", a: "Forms a white precipitate of [Al(H₂O)₃(OH)₃] with bubbles of CO₂"},
      {q: "What is the reaction of [Fe(H₂O)₆]³⁺ with sodium hydroxide?", a: "Forms a brown precipitate of [Fe(H₂O)₃(OH)₃]"},
      {q: "What happens when excess sodium hydroxide is added to [Fe(H₂O)₆]³⁺?", a: "No visible change"},
      {q: "What is the reaction of [Fe(H₂O)₆]³⁺ with sodium carbonate solution?", a: "Forms a brown precipitate of [Fe(H₂O)₃(OH)₃] with bubbles of CO₂"}
    ]
  },

  "RP12": {
    title: "RP12: Thin-Layer Chromatography",
    cards: [
      {q: "Why should gloves be worn when handling a TLC plate?", a: "Gloves prevent contamination from hands"},
      {q: "Where should the pencil line be drawn on a TLC plate before spotting?", a: "1 cm above the bottom of the plate"},
      {q: "Why is a pencil line used instead of a pen on a TLC plate?", a: "The pencil line will not dissolve in the solvent"},
      {q: "How should the sample be applied to the TLC plate?", a: "Use a capillary tube to add a tiny drop of each solution to a different spot"},
      {q: "Why should only a tiny drop of solution be added to a TLC plate?", a: "A large drop will cause different spots to merge"},
      {q: "How deep should the solvent be in the developing chamber?", a: "No more than 1 cm in depth"},
      {q: "Why must the solvent level be kept below the pencil line on a TLC plate?", a: "To prevent the solvent from dissolving the sample spots"},
      {q: "Why should the chamber lid be tightly closed during TLC?", a: "To prevent evaporation of toxic solvent"},
      {q: "What should be done once the solvent level reaches 1 cm from the top of the TLC plate?", a: "Remove the plate, mark the solvent level with a pencil, and allow it to dry in the fume cupboard"},
      {q: "Why must the TLC plate be dried in a fume cupboard?", a: "Because the solvent is toxic"},
      {q: "How are the spots visualised on a TLC plate?", a: "By placing the plate under a UV lamp"},
      {q: "Why is UV light needed for TLC analysis?", a: "The spots are colourless, so UV helps to see them"},
      {q: "How should the observed spots on a TLC plate be recorded?", a: "Draw around them lightly in pencil"},
      {q: "How are Rf values calculated in TLC?", a: "By measuring the distance traveled by each spot relative to the solvent front"},
      {q: "What reagent can be used to visualise amino acids on a TLC plate?", a: "Ninhydrin"},
      {q: "What is an alternative method to visualise amino acids on a TLC plate?", a: "Using a plate impregnated with fluorescent dye"},
      {q: "Why does each amino acid produce a different spot on a TLC plate?", a: "Each amino acid has its own unique Rf value"},
      {q: "How do you calculate Rf value?", a: "Rf = distance traveled by solute / distance traveled by solvent"}
    ]
  },
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
  const [known, setKnown] = useState({});
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
  const goBack = () => {
    if (screen === "cards") { setScreen("topics"); setTopic(null); }
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
                      {k > 0 && <span style={{ fontSize: "11px", color: "#16a97d", fontWeight: 700 }}>{k} ✓</span>}
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
      <Header sub="AQA · A-Level Chemistry" back={goBack} />
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
          <span style={{ color: "#16a97d", fontWeight: knownCount > 0 ? 600 : 400 }}>{knownCount} mastered</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 24px", position: "relative", zIndex: 2 }}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>
        <div onClick={() => setFlipped(f => !f)} style={{ width: "100%", maxWidth: "700px", minHeight: "440px", perspective: "1200px", cursor: "pointer" }}>
          <div style={{ position: "relative", width: "100%", minHeight: "440px", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {/* Front */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(145deg, #1e3a6e 0%, #254a8a 60%, #1a3870 100%)", border: "1px solid rgba(41,171,226,0.45)", borderRadius: "24px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(41,171,226,0.08)" }}>
              <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "10px", color: "#29ABE2", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Question</div>
              {knownSet.has(currentCardIndex) && <div style={{ position: "absolute", top: "13px", right: "18px", fontSize: "11px", color: "#4ecb71", fontWeight: 600, background: "rgba(78,203,113,0.15)", padding: "3px 10px", borderRadius: "20px" }}>✓ Mastered</div>}
              <p style={{ fontSize: card.q.length > 120 ? "16px" : card.q.length > 60 ? "18px" : "21px", lineHeight: 1.55, textAlign: "center", fontWeight: 600, color: "#f0f6ff", margin: 0 }}>{card.q}</p>
              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "#5a8aaa", letterSpacing: "0.5px" }}>Tap to reveal answer</div>
            </div>
            {/* Back */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(145deg, #0e2d1a 0%, #14401f 60%, #0c2918 100%)", border: "1px solid rgba(78,203,113,0.4)", borderRadius: "24px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(78,203,113,0.06)" }}>
              <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "10px", color: "#4ecb71", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Answer</div>
              <div style={{ fontSize: card.a.length > 200 ? "13px" : card.a.length > 100 ? "15px" : "17px", lineHeight: 1.7, textAlign: "center", color: "#e8f5ec", margin: 0, whiteSpace: "pre-line", fontWeight: 500 }}>{card.a}</div>
              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "#3a6a4a", letterSpacing: "0.5px" }}>Tap to flip back</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 24px 20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 2 }}>
        <button onClick={prev} disabled={index === 0} style={{ width: "52px", height: "52px", borderRadius: "14px", background: index === 0 ? "#e8edf3" : "#ffffff", border: `1px solid ${index === 0 ? "#dde4ed" : "#29ABE2"}`, color: index === 0 ? "#b0c4d4" : "#29ABE2", fontSize: "20px", cursor: index === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: index === 0 ? "none" : "0 2px 8px rgba(41,171,226,0.15)" }}>←</button>
        <button onClick={toggleKnown} style={{ height: "52px", borderRadius: "14px", padding: "0 24px", background: knownSet.has(currentCardIndex) ? "#16a97d" : "#29ABE2", border: "none", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 12px rgba(41,171,226,0.25)" }}>
          {knownSet.has(currentCardIndex) ? "✓ Mastered" : "Mark as known"}
        </button>
        <button onClick={next} disabled={index === order.length - 1} style={{ width: "52px", height: "52px", borderRadius: "14px", background: index === order.length - 1 ? "#e8edf3" : "#ffffff", border: `1px solid ${index === order.length - 1 ? "#dde4ed" : "#29ABE2"}`, color: index === order.length - 1 ? "#b0c4d4" : "#29ABE2", fontSize: "20px", cursor: index === order.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: index === order.length - 1 ? "none" : "0 2px 8px rgba(41,171,226,0.15)" }}>→</button>
      </div>

      {knownCount === cards.length && (
        <div style={{ margin: "0 24px 16px", padding: "14px", borderRadius: "14px", background: "linear-gradient(135deg, #e6f9f3, #eaf6fd)", border: "1px solid #16a97d40", textAlign: "center", fontSize: "14px", color: "#16a97d", fontWeight: 700 }}>
          🎉 All {cards.length} cards mastered!
        </div>
      )}
    </div>
  );
}