import React from "react";

export const GROUP_SMILES = {
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
export const chemBond = (x1,y1,x2,y2,order,key) => {
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
export const chemAtom = (x,y,txt,color,key,anchor) => React.createElement("text",{
  key, x, y, textAnchor: anchor||"middle", dominantBaseline:"central",
  fontSize:"11", fontWeight:"700", fill:color||"#1a2d45",
  fontFamily:"'DM Sans',sans-serif", style:{userSelect:"none"}
}, txt);

// Benzene ring helper - draws a regular hexagon with alternating double bonds
export const benzeneRing = (cx,cy,r,key) => {
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
export const ZZ = 24; // bond length horizontal component
export const ZY = 14; // bond length vertical component

// Molecule definitions: each returns SVG elements within a local coordinate space
// Format: { w, h, render } where render returns array of React elements
export const MOLECULE_SVG = {
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
export const REACTION_EXAMPLES = {
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
export const renderReactionSvg = (fromKey, toKey) => {
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
