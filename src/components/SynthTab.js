import React, { useState, useEffect } from "react";
import { SYNTH_ROUTES } from "../data/synth-routes";

export default function SynthTab({ board }) {
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [revealedRoutes, setRevealedRoutes] = useState(new Set());
  const [synthQuiz, setSynthQuiz] = useState(false);

  useEffect(() => {
    if (!selectedFrom) return;
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
  }, [selectedFrom, board, revealedRoutes]);

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
                {route.notes && !synthQuiz && (
                  <div style={{ margin: "0 14px 12px", padding: "10px 12px", background: "#fafbfc", borderRadius: "10px", borderLeft: "3px solid #e0e8f0" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Key notes</div>
                    <div style={{ fontSize: "11px", color: "#4a6070", lineHeight: 1.6 }}>{route.notes}</div>
                  </div>
                )}
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
}
