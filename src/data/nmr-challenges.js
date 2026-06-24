export const NMR_CHALLENGES = [
  {
    id: "ethanol", name: "Ethanol", formula: "C₂H₆O", molecular: "CH₃CH₂OH",
    peaks: [
      { shift: 1.2, height: 0.75, splitting: "triplet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CH₂" },
      { shift: 3.7, height: 0.5, splitting: "quartet", integration: 2, label: "CH₂", env: "CH₂ adjacent to CH₃, deshielded by O" },
      { shift: 2.6, height: 0.25, splitting: "singlet", integration: 1, label: "OH", env: "O–H (broad, disappears with D₂O)" },
    ],
    answer: "Three environments: CH₃ (triplet, 3H, δ 1.2) split by 2 adjacent H on CH₂. CH₂ (quartet, 2H, δ 3.7) split by 3 adjacent H on CH₃, shifted downfield by electronegative O. OH (broad singlet, 1H, δ 2.6) exchangeable, disappears with D₂O shake. Integration ratio 3:2:1.",
    tips: "The quartet + triplet pair is diagnostic for a CH₃CH₂ group. The broad OH confirms an alcohol."
  },
  {
    id: "propanone", name: "Propanone", formula: "C₃H₆O", molecular: "CH₃COCH₃",
    peaks: [
      { shift: 2.1, height: 1.0, splitting: "singlet", integration: 6, label: "2×CH₃", env: "Two equivalent CH₃ groups adjacent to C=O" },
    ],
    answer: "Only one peak. Both CH₃ groups are equivalent (mirror symmetry). Singlet (no adjacent H on the carbonyl C). δ 2.1 shifted downfield by the electron-withdrawing C=O. Integration: 6H.",
    tips: "A single peak for a C₃H₆O compound immediately rules out propanal (which would show an aldehyde peak at δ 9.8)."
  },
  {
    id: "propanal", name: "Propanal", formula: "C₃H₆O", molecular: "CH₃CH₂CHO",
    peaks: [
      { shift: 1.0, height: 0.75, splitting: "triplet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CH₂" },
      { shift: 2.4, height: 0.5, splitting: "multiplet", integration: 2, label: "CH₂", env: "CH₂ between CH₃ and CHO" },
      { shift: 9.8, height: 0.25, splitting: "triplet", integration: 1, label: "CHO", env: "Aldehyde H, very deshielded by C=O" },
    ],
    answer: "Three environments: CH₃ (triplet, 3H, δ 1.0) split by 2H on CH₂. CH₂ (multiplet, 2H, δ 2.4) coupled to both CH₃ and CHO. CHO (triplet, 1H, δ 9.8) split by 2H on CH₂, very downfield due to C=O. Integration ratio 3:2:1.",
    tips: "The peak at δ 9.8 is the giveaway. Only aldehyde H appear this far downfield. This distinguishes propanal from propanone (same molecular formula C₃H₆O)."
  },
  {
    id: "ethyl_ethanoate", name: "Ethyl ethanoate", formula: "C₄H₈O₂", molecular: "CH₃COOCH₂CH₃",
    peaks: [
      { shift: 1.3, height: 0.75, splitting: "triplet", integration: 3, label: "CH₂CH₃", env: "CH₃ of ethyl group, adjacent to CH₂" },
      { shift: 2.0, height: 0.75, splitting: "singlet", integration: 3, label: "CH₃CO", env: "CH₃ adjacent to C=O, no neighbouring H" },
      { shift: 4.1, height: 0.5, splitting: "quartet", integration: 2, label: "OCH₂", env: "CH₂ deshielded by O, adjacent to CH₃" },
    ],
    answer: "Three environments: CH₃ of ethyl (triplet, 3H, δ 1.3) split by 2H on OCH₂. CH₃CO (singlet, 3H, δ 2.0) no adjacent H. OCH₂ (quartet, 2H, δ 4.1) split by 3H on CH₃, deshielded by O. Integration ratio 3:3:2.",
    tips: "The singlet at δ 2.0 is characteristic of CH₃ next to C=O. The quartet-triplet pair at δ 4.1 and 1.3 shows the ethyl ester group."
  },
  {
    id: "ethanoic_acid", name: "Ethanoic acid", formula: "C₂H₄O₂", molecular: "CH₃COOH",
    peaks: [
      { shift: 2.1, height: 0.75, splitting: "singlet", integration: 3, label: "CH₃", env: "CH₃ adjacent to C=O" },
      { shift: 11.4, height: 0.2, splitting: "singlet", integration: 1, label: "COOH", env: "Carboxylic acid H, very deshielded (broad)" },
    ],
    answer: "Two environments: CH₃ (singlet, 3H, δ 2.1) no adjacent H to cause splitting. COOH (broad singlet, 1H, δ 11.4) extremely deshielded, exchangeable with D₂O. Integration ratio 3:1.",
    tips: "The very broad peak above δ 10 is diagnostic for COOH. It disappears with D₂O shake, confirming an exchangeable proton."
  },
  {
    id: "bromoethane", name: "Bromoethane", formula: "C₂H₅Br", molecular: "CH₃CH₂Br",
    peaks: [
      { shift: 1.7, height: 0.75, splitting: "triplet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CH₂" },
      { shift: 3.4, height: 0.5, splitting: "quartet", integration: 2, label: "CH₂Br", env: "CH₂ deshielded by Br, adjacent to CH₃" },
    ],
    answer: "Two environments: CH₃ (triplet, 3H, δ 1.7) split by 2H on CH₂. CH₂ (quartet, 2H, δ 3.4) split by 3H on CH₃, shifted downfield by electronegative Br. Integration ratio 3:2.",
    tips: "The quartet-triplet pair confirms a CH₃CH₂ group. CH₂ at δ 3.4 is deshielded by Br."
  },
  {
    id: "methyl_propanoate", name: "Methyl propanoate", formula: "C₄H₈O₂", molecular: "CH₃CH₂COOCH₃",
    peaks: [
      { shift: 1.1, height: 0.75, splitting: "triplet", integration: 3, label: "CH₂CH₃", env: "CH₃ adjacent to CH₂" },
      { shift: 2.3, height: 0.5, splitting: "quartet", integration: 2, label: "CH₂", env: "CH₂ adjacent to CH₃ and C=O" },
      { shift: 3.7, height: 0.75, splitting: "singlet", integration: 3, label: "OCH₃", env: "OCH₃ deshielded by O, no adjacent H" },
    ],
    answer: "Three environments: CH₃ (triplet, 3H, δ 1.1) split by 2H on CH₂. CH₂ (quartet, 2H, δ 2.3) split by 3H on CH₃. OCH₃ (singlet, 3H, δ 3.7) no adjacent H, deshielded by O. Integration ratio 3:2:3.",
    tips: "Same molecular formula as ethyl ethanoate (C₄H₈O₂) but different spectrum. The singlet OCH₃ at δ 3.7 and quartet at δ 2.3 distinguish methyl propanoate from ethyl ethanoate."
  },
  {
    id: "propan_2_ol", name: "Propan-2-ol", formula: "C₃H₈O", molecular: "(CH₃)₂CHOH",
    peaks: [
      { shift: 1.2, height: 1.0, splitting: "doublet", integration: 6, label: "2×CH₃", env: "Two equivalent CH₃ groups adjacent to CH" },
      { shift: 4.0, height: 0.2, splitting: "septet", integration: 1, label: "CH", env: "CH adjacent to 6H (2×CH₃), deshielded by O" },
      { shift: 2.3, height: 0.15, splitting: "singlet", integration: 1, label: "OH", env: "O–H (broad, disappears with D₂O)" },
    ],
    answer: "Three environments: 2×CH₃ (doublet, 6H, δ 1.2) split by 1H on CH. CH (septet, 1H, δ 4.0) split by 6 adjacent H (n+1 = 7 lines), deshielded by O. OH (broad singlet, 1H, δ 2.3) exchangeable. Integration ratio 6:1:1.",
    tips: "The septet is the key. 6 equivalent adjacent H give a 7-line pattern. The large doublet (6H) confirms two equivalent CH₃ groups."
  },
  {
    id: "methylbenzene", name: "Methylbenzene", formula: "C₇H₈", molecular: "C₆H₅CH₃",
    peaks: [
      { shift: 2.3, height: 0.6, splitting: "singlet", integration: 3, label: "CH₃", env: "CH₃ attached to benzene ring" },
      { shift: 7.2, height: 1.0, splitting: "multiplet", integration: 5, label: "ArH", env: "5 aromatic H (complex splitting)" },
    ],
    answer: "Two main environments: CH₃ (singlet, 3H, δ 2.3) no adjacent H to split (ring C has no H). ArH (multiplet, 5H, δ 7.2) aromatic protons in the characteristic δ 6.5-8.0 region. Integration ratio 3:5.",
    tips: "Aromatic protons always appear δ 6.5–8.0. The singlet CH₃ tells you it's directly on the ring. At A-level you don't need to interpret detailed aromatic splitting."
  },
  {
    id: "ethanal", name: "Ethanal", formula: "C₂H₄O", molecular: "CH₃CHO",
    peaks: [
      { shift: 2.2, height: 0.75, splitting: "doublet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CHO (1 neighbouring H)" },
      { shift: 9.8, height: 0.25, splitting: "quartet", integration: 1, label: "CHO", env: "Aldehyde H, very deshielded, adjacent to CH₃" },
    ],
    answer: "Two environments: CH₃ (doublet, 3H, δ 2.2) split by 1H on CHO. CHO (quartet, 1H, δ 9.8) split by 3H on CH₃, very far downfield due to C=O. Integration ratio 3:1.",
    tips: "The aldehyde peak at δ ~9.8 is unmistakable. The doublet CH₃ and quartet CHO confirm the connectivity."
  },
];
