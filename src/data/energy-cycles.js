import React from "react";

// Hess cycle diagram components
export const HessTriangle = ({ top, left, right, dh1, dh2, dhr, find }) => (
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

export const HessBox = ({ topLeft, topRight, botLeft, botRight, dhTop, dhBot, dhL, dhR, find }) => (
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
export const BornHaberCycle = ({ compound, steps, find }) => {
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
