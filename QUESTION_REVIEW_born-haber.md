# Born-Haber pilot set: for your review

Draft written by Claude in exam-board style from standard data-book values.
**Nothing here is live.** The questions sit in `src/data/exam-questions-draft.js`
and are not loaded by the app. Please check the chemistry, the values, the mark
scheme wording and the marks. Edit anything directly in the draft file or tell
me the changes, then say which ones to move into the live bank.

Data used (kJ mol-1, standard data book values): KCl dHf -437, dHat(K) +89,
dHat(Cl) +122, IE1(K) +419, EA1(Cl) -349. NaCl dHf -411, dHat(Na) +108,
dHat(Cl) +121, IE1(Na) +496. MgO dHf -602, dHat(Mg) +148, IE1 +738, IE2 +1451,
dHat(O) +249, EA1(O) -141, EA2(O) +798. CaCl2 dHf -796, dHat(Ca) +178,
IE1 +590, IE2 +1145. KBr dHf -394, dHat(Br) +112, dHlatt -671.
Hydration Na+ -406, Cl- -364.

Marks: 36 in total. At 1.5 min per mark the full set is about 54 minutes.

---

## Tier 1 (scaffolded)

### bh-001 KCl Born-Haber cycle, step by step (6 marks)
Data table: KCl values above.

(a) Define the term lattice enthalpy of formation. **[2]**
- M1 Enthalpy change when one mole of an ionic solid is formed from its gaseous ions
- M2 Under standard conditions (298 K and 100 kPa)
- Reject: formed from its elements / from atoms

(b) Calculate the total enthalpy change for K(s) to K+(g). **[1]** Answer +508

(c) Calculate the total enthalpy change for 1/2 Cl2(g) to Cl-(g). **[1]** Answer -227

(d) Use (b) and (c) to calculate the lattice enthalpy of formation of KCl. **[2]** Answer -718
- -437 = 508 + (-227) + dHlatt, so dHlatt = -437 - 281 = -718

### bh-002 Steps in the NaCl cycle (6 marks)
Data table: NaCl values above.

(a) MCQ: Which equation represents the first electron affinity of chlorine? **[1]**
A Cl2(g) + 2e- to 2Cl-(g) · B Cl(g) + e- to Cl-(g) · C 1/2 Cl2(g) + e- to Cl-(g) · D Cl(g) to Cl+(g) + e-. Answer **B**

(b) MCQ: Which equation represents the enthalpy of atomisation of chlorine? **[1]**
A Cl2(g) to 2Cl(g) · B 1/2 Cl2(g) to Cl(g) · C Cl2(l) to Cl2(g) · D Cl(g) to Cl-(g). Answer **B**

(c) Explain why the first electron affinity of chlorine is exothermic. **[2]**
- M1 The added electron is attracted to the (positive) nucleus
- M2 Energy is released when this attraction forms
- Reject: "to gain a full outer shell / become stable" with no reference to attraction or energy

(d) Calculate the lattice enthalpy of formation of NaCl. **[2]** Answer -787

### bh-003 Which step is which (4 marks, all MCQ)
(a) Always exothermic in a Born-Haber cycle? IE1 / atomisation / **lattice enthalpy of formation** / second EA
(b) K(g) to K+(g) + e- is: atomisation / **first ionisation energy** / first EA / formation
(c) dHlatt(formation) NaCl = -787, so dHlatt(dissociation) = -787 / **+787** / 0 / -411
(d) Most exothermic lattice enthalpy: **NaCl** / KCl / NaBr / KBr

---

## Tier 2 (exam standard)

### bh-004 Magnesium oxide (7 marks)
Data table: MgO values above.

(a) Explain why the second electron affinity of oxygen is endothermic. **[2]**
- M1 The electron is being added to a negative ion (O-)
- M2 Energy is needed to overcome the repulsion between the electron and the negative ion

(b) Calculate the lattice enthalpy of formation of MgO. **[3]** Answer -3845 (tolerance 5)
- Mg(s) to Mg2+(g) = 148 + 738 + 1451 = +2337
- 1/2 O2(g) to O2-(g) = 249 - 141 + 798 = +906
- -602 = 3243 + dHlatt, so dHlatt = -3845

(c) NaCl lattice enthalpy is -787. Explain why MgO's is much more exothermic. **[2]**
- M1 Mg2+ and O2- have a higher charge than Na+ and Cl- (and Mg2+ is smaller than Na+)
- M2 Stronger electrostatic attraction between the ions
- Allow: higher charge density

### bh-005 Calcium chloride (5 marks)
Data table: CaCl2 values above.

(a) Equation with state symbols for the lattice enthalpy of formation of CaCl2. **[1]**
- Ca2+(g) + 2Cl-(g) to CaCl2(s). Reject missing state symbols, Cl2 or Cl.

(b) Calculate the lattice enthalpy of formation of CaCl2. **[3]** Answer -2255 (tolerance 5)
- Ca steps +1913; Cl steps 2(122) + 2(-349) = -454; -796 = 1913 - 454 + dHlatt, so dHlatt = -2255

(c) MCQ: A student forgot to double the first electron affinity of chlorine. Effect on the calculated lattice enthalpy? **[1]**
**A 349 more negative** / B 349 less negative / C 698 more negative / D unchanged

### bh-006 Definitions (6 marks)
(a) Define first ionisation energy. **[2]**
- M1 Enthalpy change when one electron is removed from each atom in one mole of gaseous atoms
- M2 To form one mole of gaseous 1+ ions

(b) Define enthalpy of atomisation of an element. **[2]**
- M1 Enthalpy change when one mole of gaseous atoms is formed
- M2 From the element in its standard state

(c) Cl-Cl bond enthalpy is +243. Explain why dHat(Cl) is +122 and not +243. **[2]**
- M1 Atomisation is defined per mole of gaseous atoms formed
- M2 Breaking one mole of Cl-Cl bonds forms two moles of Cl atoms, so atomisation is half the bond enthalpy

---

## Tier 3 (unseen / stretch)

### bh-007 Potassium bromide: finding an electron affinity (7 marks)
Data table: KBr values above (includes the experimental lattice enthalpy -671).

(a) Use the data to calculate the first electron affinity of bromine. **[3]** Answer -343 (tolerance 3)
- -394 = 89 + 419 + 112 + EA1 + (-671), so EA1 = -394 + 51 = -343

(b) A theoretical lattice enthalpy (perfectly ionic model) is less exothermic than the experimental value. Explain what this suggests about the bonding. **[2]**
- M1 The ionic model assumes point charges / perfectly spherical ions with evenly spread charge
- M2 The difference shows some covalent character (bromide ion polarised / electron cloud distorted by the cation)

(c) Suggest why the difference is larger for MgI2 than for MgF2. **[2]**
- M1 Iodide ion is larger so its electron cloud is more easily distorted / more polarisable
- M2 So MgI2 has more covalent character

### bh-008 Trends in lattice enthalpy (6 marks)
Context: NaF -918, NaCl -787, NaBr -742.

(a) Explain the trend. **[3]**
- M1 Ionic radius increases F- to Cl- to Br-
- M2 Charge density of the anion decreases / ions further apart
- M3 Weaker electrostatic attraction, less energy released (less exothermic)

(b) MCQ: Most exothermic lattice enthalpy: NaF / KCl / CaO / **MgO** **[1]**

(c) Predict, with a reason, whether NaI is more or less exothermic than NaBr. **[2]**
- M1 Less exothermic
- M2 Iodide ion larger than bromide, so weaker attraction

### bh-009 Enthalpy of solution of NaCl (7 marks)
Context: dHlatt NaCl -787, dHhyd Na+ -406, dHhyd Cl- -364.

(a) Define enthalpy of hydration. **[2]**
- M1 Enthalpy change when one mole of gaseous ions
- M2 Is dissolved in water to form one mole of aqueous ions (standard conditions)

(b) Calculate the enthalpy of solution of NaCl. **[3]** Answer +17 (tolerance 2)
- dHsol = -(-787) + (-406) + (-364) = +17

(c) NaCl dissolves readily although dHsol is endothermic. Explain why. **[2]**
- M1 Entropy increases (ions free to move in solution)
- M2 So dG = dH - TdS is negative, so dissolving is feasible
- Allow: TdS larger than dH

---

## Things I was unsure about and want you to decide

1. **bh-001 (a) allow line**: I allowed the dissociation definition if the student says so. You may prefer to reject it outright.
2. **bh-007 data**: dHat(Br) +112 and dHlatt(KBr) -671 are data-book values; the electron affinity that comes out (-343) is a little larger than the usual -325 because the values are rounded. If you would rather the cycle gives -325, say so and I will adjust the lattice enthalpy to -689.
3. **Tolerances**: I used 1 to 5 kJ mol-1. Tell me if your students are expected to carry more or fewer significant figures.
4. **Sig figs**: none of the calc parts states a number of significant figures, so the examiner applies the "match the data" rule you set. If you want explicit "give your answer to 3 significant figures" wording, say which parts.
5. **Board**: all marked `both`. If any wording is AQA-only or OCR-only (for example "lattice enthalpy of formation" vs OCR's "lattice enthalpy"), tell me and I'll split them.
