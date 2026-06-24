import React, { useState } from "react";
import { SYNTH_ALI_NODES, SYNTH_ALI_RXNS, SYNTH_ARO_NODES, SYNTH_ARO_RXNS } from "../data/synth-maps";
import { REACTION_EXAMPLES, renderReactionSvg } from "../data/molecules";
import track from "../utils/track";

export default function PathwaysTab({ board }) {
  const [synthTab, setSynthTab] = useState("ali");
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedRxn, setSelectedRxn] = useState(null);
  const [synthQuiz, setSynthQuiz] = useState(false);

  const sNodes = synthTab === "ali" ? SYNTH_ALI_NODES : SYNTH_ARO_NODES;
  const sRxns  = synthTab === "ali" ? SYNTH_ALI_RXNS  : SYNTH_ARO_RXNS;
  const vbW = 660, vbH = synthTab === "ali" ? 870 : 720;
  const SW = 1.0;
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
  const outMap = {};
  const inMap = {};
  sNodes.forEach(([id]) => { outMap[id] = []; inMap[id] = []; });
  sRxns.forEach(r => {
    if (outMap[r[1]]) outMap[r[1]].push(r);
    if (inMap[r[2]])  inMap[r[2]].push(r);
  });
  const mAbbr = (mt, rt) => {
    const ms = {"Nucleophilic":"Nu","Electrophilic":"E","Free radical":"FR"};
    const rs = {"Substitution":"Sub","Addition":"Add","Elimination":"Elim","Oxidation":"Ox","Reduction":"Red","Acid-base":"A-B","Esterification":"Ester","Hydrolysis":"Hydrol","Hydration":"Hydra","Dehydration":"Dehydra","Acylation":"Acyl","Friedel-Crafts Acylation":"FC Acyl","Friedel-Crafts Alkylation":"FC Alkyl","Nitration":"Nitration","Diazotisation":"Diaz","Azo Coupling":"Azo"};
    const m = ms[mt] || ""; const r = rs[rt] || rt || "";
    return m ? `${m} ${r}` : r;
  };
  const rxnTypeColors = {"Substitution":"#2563eb","Addition":"#16a34a","Elimination":"#ea580c","Oxidation":"#dc2626","Reduction":"#7c3aed","Acid-base":"#0891b2","Esterification":"#0891b2","Hydrolysis":"#0284c7","Hydration":"#0284c7","Dehydration":"#ea580c","Acylation":"#6366f1","Friedel-Crafts Acylation":"#6366f1","Friedel-Crafts Alkylation":"#6366f1","Nitration":"#dc2626","Diazotisation":"#be185d","Azo Coupling":"#7c3aed"};

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
      <div style={{ fontSize:"12px", color: selId ? "#059669" : "#94a3b8", fontWeight: selId ? 600 : 400, padding:"6px 14px 5px", textAlign:"center", flexShrink:0, background: selId ? "#f0fdf4" : "#fff", borderBottom:"1px solid #f0f4f8", transition:"all 0.2s" }}>
        {selId ? `${selNodeData ? selNodeData[1].replace(/\n/g," ") : ""} selected - tap another compound or background to clear` : "Tap a compound to highlight its reaction routes"}
      </div>
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
          {(() => {
            const pairKey = (a,b) => a < b ? a+"|"+b : b+"|"+a;
            const pairDir = {};
            sRxns.forEach(r => {
              const k = pairKey(r[1],r[2]);
              if (pairDir[k] === undefined) pairDir[k] = r[0];
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
          {sNodes.map(([id, label, cx, cy, fill, hw, hh]) => {
            const rw = hw*SW, rh = hh*SW;
            const lines = label.split("\n");
            const lh = 14, th = lines.length * lh;
            const isSel = id === selId;
            const isConn = connNodeIds && connNodeIds.has(id);
            const isDim = connNodeIds && !connNodeIds.has(id);
            return (
              <g key={id} onClick={e => { e.stopPropagation(); setSelectedFrom(id === selId ? null : id); setSelectedRxn(null); }} style={{ cursor:"pointer" }}>
                {isSel && <rect x={cx-rw-6} y={cy-rh-6} width={(rw+6)*2} height={(rh+6)*2} rx={14} fill="rgba(5,150,105,0.12)" stroke="#059669" strokeWidth={2.5} filter="url(#glowGreen)" />}
                <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                  rx={12} fill={isDim ? "#f0f4f8" : "#fff"} opacity={isDim ? 0.4 : 1}
                  stroke={isSel ? "#059669" : fill}
                  strokeWidth={isSel ? 2.5 : 2}
                  filter={isDim ? "none" : "url(#nodeShadow)"}
                />
                {!isDim && <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                  rx={12} fill={fill} fillOpacity={0.12}
                  style={{ pointerEvents:"none" }} />}
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
          {sRxns.map(r => {
            const [n, fromId, toId, bx, by, , , reagents, conditions, mechType, rxnType] = r;
            const isAct = selectedRxn === n;
            const isOut = selId && fromId === selId;
            const isIn  = selId && toId === selId;
            const isDim = connRxnIds && !connRxnIds.has(n);
            const mech = mAbbr(mechType, rxnType);
            const tCol = rxnTypeColors[rxnType] || "#475569";
            const shortReagent = reagents.length > 24 ? reagents.slice(0, 21) + "…" : reagents;
            const reagentFill = isOut ? "#059669" : isIn ? "#2563eb" : "#1a2d45";
            const mechFill = isOut ? "#047857" : isIn ? "#1d4ed8" : tCol;
            const quizHide = synthQuiz;
            return (
              <g key={"b"+n} onClick={e => { e.stopPropagation(); setSelectedRxn(isAct ? null : n); }} style={{ cursor:"pointer" }}
                opacity={isDim ? 0.12 : 1}>
                <rect x={bx - 58} y={by - 14} width={116} height={28} fill="transparent" />
                {quizHide ? (
                  <>
                    <text x={bx} y={by + 3} textAnchor="middle" fontSize="7.5" fontWeight="700"
                      fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"
                      style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                    <text x={bx} y={by + 3} textAnchor="middle" fontSize="7.5" fontWeight="700"
                      fill={mechFill}
                      style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                  </>
                ) : (
                  <>
                    <text x={bx} y={by - 2} textAnchor="middle" fontSize="8" fontWeight="700"
                      fill="none" stroke="white" strokeWidth="3.5" strokeLinejoin="round"
                      style={{ userSelect:"none", pointerEvents:"none" }}>{shortReagent}</text>
                    <text x={bx} y={by - 2} textAnchor="middle" fontSize="8" fontWeight="700"
                      fill={reagentFill}
                      style={{ userSelect:"none", pointerEvents:"none" }}>{shortReagent}</text>
                    <text x={bx} y={by + 9} textAnchor="middle" fontSize="7" fontWeight="700"
                      fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"
                      style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                    <text x={bx} y={by + 9} textAnchor="middle" fontSize="7" fontWeight="700"
                      fill={mechFill}
                      style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 12px", padding:"8px 14px 10px", justifyContent:"center" }}>
          {[["Sub","Substitution","#2563eb"],["Add","Addition","#16a34a"],["Elim","Elimination","#ea580c"],["Ox","Oxidation","#dc2626"],["Red","Reduction","#7c3aed"],["A-B","Acid-base","#0891b2"],["Ester","Esterification","#0891b2"],["Acyl","Acylation","#6366f1"]].map(([lbl,,col]) => (
            <div key={lbl} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:col, flexShrink:0 }} />
              <span style={{ fontSize:"10px", fontWeight:600, color:"#4a6070" }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
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
      {selRxn && (() => {
        const rxnExamples = REACTION_EXAMPLES[synthTab];
        const example = rxnExamples ? rxnExamples[selRxn[0]] : null;
        return (
          <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
            onClick={() => setSelectedRxn(null)}>
            <div style={{ position:"absolute", inset:0, background:"rgba(15,29,53,0.45)", backdropFilter:"blur(4px)" }} />
            <div style={{ position:"relative", background:"#fff", borderRadius:"18px", padding:"0", width:"100%", maxWidth:"400px", maxHeight:"85vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
              onClick={e => e.stopPropagation()}>
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
                  {example && (
                    <div style={{ padding:"4px 16px 16px" }}>
                      <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px" }}>Example Reaction</div>
                      <div style={{ fontSize:"12px", color:"#475569", fontWeight:600, textAlign:"center", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.2px", lineHeight:1.5 }}>
                        {example.eq.split(" --> ").map((part, pi) => (
                          <span key={pi}>
                            {pi > 0 && <span style={{ color:"#1a2d45", fontWeight:700, margin:"0 6px" }}> → </span>}
                            {part}
                          </span>
                        ))}
                      </div>
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
}
