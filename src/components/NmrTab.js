import React, { useState } from "react";
import { SETS } from "../data/sets";
import { NMR_CHALLENGES } from "../data/nmr-challenges";
import chemFormat from "../utils/chemFormat";
import McqQuestion from "./McqQuestion";

function NmrSpectrum({ peaks, revealed }) {
  const W = 700, H = 280, padL = 50, padR = 25, padT = 50, padB = 45;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxShift = 12;
  const toX = (shift) => padL + plotW * (1 - shift / maxShift);
  const splitOffsets = {
    singlet: [0], doublet: [-4, 4], triplet: [-6, 0, 6],
    quartet: [-9, -3, 3, 9], septet: [-15, -10, -5, 0, 5, 10, 15],
    multiplet: [-8, -4, -1, 1, 4, 8],
  };
  const splitHeights = {
    singlet: [1], doublet: [1, 1], triplet: [0.5, 1, 0.5],
    quartet: [0.33, 1, 1, 0.33], septet: [0.15, 0.45, 0.75, 1, 0.75, 0.45, 0.15],
    multiplet: [0.4, 0.7, 1, 1, 0.7, 0.4],
  };
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #e2e8f0" }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(v => (
        <g key={v}>
          <line x1={toX(v)} y1={padT + plotH} x2={toX(v)} y2={padT + plotH + 6} stroke="#94a3b8" strokeWidth="1" />
          <text x={toX(v)} y={padT + plotH + 20} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="500" fontFamily="'Outfit',sans-serif">{v}</text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="#475569" fontWeight="600" fontFamily="'Outfit',sans-serif">{"δ / ppm"}</text>
      <text x={toX(0) + 10} y={padT + plotH + 20} textAnchor="start" fontSize="10" fill="#94a3b8" fontWeight="500" fontFamily="'Outfit',sans-serif">TMS</text>
      {peaks.map((p, i) => {
        const cx = toX(p.shift);
        const offsets = splitOffsets[p.splitting] || [0];
        const heights = splitHeights[p.splitting] || [1];
        const peakH = plotH * p.height * 0.8;
        return (
          <g key={i}>
            {offsets.map((dx, j) => (
              <line key={j} x1={cx + dx} y1={padT + plotH} x2={cx + dx} y2={padT + plotH - peakH * (heights[j] || 0.5)}
                stroke="#8b5cf6" strokeWidth={p.splitting === "singlet" ? "3" : "2"} strokeLinecap="round" />
            ))}
            <text x={cx} y={padT + plotH - peakH - 14} textAnchor="middle" fontSize="11" fill="#8b5cf6" fontWeight="700" fontFamily="'Outfit',sans-serif">
              {p.integration}H
            </text>
            {revealed && (
              <text x={cx} y={16} textAnchor="middle" fontSize="10" fill="#6d28d9" fontWeight="700" fontFamily="'Outfit',sans-serif">
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function NmrTab({ board, mcqData }) {
  const accentColor = "#8b5cf6";

  const [nmrSubTab, setNmrSubTab] = useState("challenges");
  const [nmrChallengeIdx, setNmrChallengeIdx] = useState(0);
  const [nmrRevealed, setNmrRevealed] = useState(false);
  const [nmrFlashIdx, setNmrFlashIdx] = useState(0);
  const [nmrFlashFlipped, setNmrFlashFlipped] = useState(false);
  const [nmrMcqIdx, setNmrMcqIdx] = useState(0);
  const [nmrMcqSelected, setNmrMcqSelected] = useState(null);
  const [nmrMcqRevealed, setNmrMcqRevealed] = useState(false);
  const [nmrMcqScore, setNmrMcqScore] = useState({ correct: 0, total: 0 });

  const nmrFlashcards = board === "ocr"
    ? (SETS["ocr_6.5.1"]?.cards || [])
    : (SETS["3.3.15"]?.cards || []);

  const nmrMcqs = mcqData.questions.filter(q => q.topic === "3.3.15" || q.topic === "3.3.13");

  const challenge = NMR_CHALLENGES[nmrChallengeIdx];

  return (
    <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", gap: "0", marginBottom: "16px", borderRadius: "10px", overflow: "hidden", border: `2px solid ${accentColor}` }}>
        {[
          { key: "challenges", label: "Spectrum Challenges" },
          { key: "flashcards", label: "Flashcards" },
          { key: "mcqs", label: "MCQs" },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setNmrSubTab(tab.key); }}
            style={{ flex: 1, padding: "10px", border: "none", fontSize: "12px", fontWeight: 700,
              fontFamily: "inherit", cursor: "pointer",
              background: nmrSubTab === tab.key ? accentColor : "#ffffff",
              color: nmrSubTab === tab.key ? "#ffffff" : accentColor,
            }}>{tab.label}</button>
        ))}
      </div>

      {nmrSubTab === "challenges" && challenge && (
        <div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {NMR_CHALLENGES.map((c, i) => (
              <button key={c.id} onClick={() => { setNmrChallengeIdx(i); setNmrRevealed(false); }}
                style={{ padding: "6px 12px", borderRadius: "8px", border: `1.5px solid ${i === nmrChallengeIdx ? accentColor : "#e2e8f0"}`,
                  background: i === nmrChallengeIdx ? `${accentColor}15` : "#fff",
                  color: i === nmrChallengeIdx ? accentColor : "#64748b",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {i + 1}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
                    Deduce the structure
                  </div>
                  <div style={{ fontSize: "38px", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
                    {chemFormat(challenge.formula)}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginTop: "10px", lineHeight: 1.5 }}>
                    Identify the compound from the ¹H NMR spectrum below.
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700, whiteSpace: "nowrap", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
                  {nmrChallengeIdx + 1} / {NMR_CHALLENGES.length}
                </div>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "8px" }}>
                <NmrSpectrum peaks={challenge.peaks} revealed={nmrRevealed} />
              </div>

              {!nmrRevealed && (
                <button onClick={() => setNmrRevealed(true)}
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer",
                    background: accentColor, color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
                    boxShadow: `0 4px 14px ${accentColor}50`, marginTop: "16px" }}>
                  Show Answer
                </button>
              )}

              {nmrRevealed && (
                <button onClick={() => {
                  if (nmrChallengeIdx < NMR_CHALLENGES.length - 1) {
                    setNmrChallengeIdx(i => i + 1);
                    setNmrRevealed(false);
                  }
                }}
                  disabled={nmrChallengeIdx >= NMR_CHALLENGES.length - 1}
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", marginTop: "16px",
                    cursor: nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? "pointer" : "default",
                    background: nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? accentColor : "#e2e8f0",
                    color: nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? "#fff" : "#94a3b8",
                    fontSize: "14px", fontWeight: 700, fontFamily: "inherit" }}>
                  {nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? "Next Challenge →" : "All Challenges Complete!"}
                </button>
              )}
            </div>

            {nmrRevealed && (
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px", animation: "mcqFadeIn 0.3s ease" }}>
                <div style={{ background: `${accentColor}08`, border: `1.5px solid ${accentColor}30`, borderRadius: "12px", padding: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Structure</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#1a2d45", marginBottom: "4px" }}>{challenge.name}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#475569" }}>{chemFormat(challenge.molecular)}</div>
                </div>

                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Peak-by-Peak Analysis</div>
                  {challenge.peaks.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: i < challenge.peaks.length - 1 ? "6px" : 0,
                      padding: "7px 10px", background: "#fff", borderRadius: "8px", border: "1px solid #dcfce7" }}>
                      <div style={{ minWidth: "46px", fontWeight: 800, color: accentColor, fontSize: "13px" }}>δ {p.shift}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45" }}>
                          {p.label}: {p.splitting}, {p.integration}H
                        </div>
                        <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>{p.env}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e40af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Full Explanation</div>
                  <div style={{ fontSize: "13px", color: "#1e3a5f", lineHeight: 1.65 }}>{challenge.answer}</div>
                </div>

                <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Exam Tip</div>
                  <div style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.55 }}>{challenge.tips}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {nmrSubTab === "flashcards" && (() => {
        const cards = nmrFlashcards;
        if (cards.length === 0) return <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No NMR flashcards available for this board.</div>;
        const card = cards[nmrFlashIdx];
        return (
          <div>
            <div style={{ textAlign: "center", fontSize: "12px", color: "#64748b", marginBottom: "12px", fontWeight: 600 }}>
              {nmrFlashIdx + 1} / {cards.length}
            </div>
            <div onClick={() => setNmrFlashFlipped(f => !f)}
              style={{ perspective: "1200px", cursor: "pointer", maxWidth: "700px", margin: "0 auto" }}>
              <div style={{ position: "relative", minHeight: "320px", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d",
                transform: nmrFlashFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: `linear-gradient(145deg, ${accentColor}, #6d28d9)`,
                  borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  boxShadow: `0 12px 40px ${accentColor}50` }}>
                  <div style={{ position: "absolute", top: "14px", left: "18px", fontSize: "10px", color: "rgba(255,255,255,0.7)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Question</div>
                  <p style={{ fontSize: card.q.length > 120 ? "15px" : "18px", lineHeight: 1.55, textAlign: "center", fontWeight: 700, color: "#fff", margin: 0 }}>{card.q}</p>
                  <div style={{ position: "absolute", bottom: "14px", fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>Tap to reveal</div>
                </div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                  background: "#fff", border: `2px solid ${accentColor}`, borderRadius: "20px", padding: "32px 24px",
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  boxShadow: `0 12px 40px ${accentColor}30` }}>
                  <div style={{ position: "absolute", top: "14px", left: "18px", fontSize: "10px", color: accentColor, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Answer</div>
                  <div style={{ fontSize: card.a.length > 200 ? "13px" : "15px", lineHeight: 1.7, textAlign: "center", color: "#1a2d45", whiteSpace: "pre-line", fontWeight: 500 }}>{card.a}</div>
                  <div style={{ position: "absolute", bottom: "14px", fontSize: "11px", color: "#94a3b8" }}>Tap to flip back</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button onClick={() => { setNmrFlashIdx(i => Math.max(0, i - 1)); setNmrFlashFlipped(false); }}
                disabled={nmrFlashIdx === 0}
                style={{ padding: "10px 24px", borderRadius: "10px", border: `1.5px solid ${accentColor}30`, background: "#fff",
                  color: nmrFlashIdx === 0 ? "#cbd5e1" : accentColor, fontSize: "13px", fontWeight: 700, cursor: nmrFlashIdx === 0 ? "default" : "pointer", fontFamily: "inherit" }}>
                ← Prev
              </button>
              <button onClick={() => { setNmrFlashIdx(i => Math.min(cards.length - 1, i + 1)); setNmrFlashFlipped(false); }}
                disabled={nmrFlashIdx === cards.length - 1}
                style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: nmrFlashIdx === cards.length - 1 ? "#e2e8f0" : accentColor,
                  color: nmrFlashIdx === cards.length - 1 ? "#94a3b8" : "#fff", fontSize: "13px", fontWeight: 700,
                  cursor: nmrFlashIdx === cards.length - 1 ? "default" : "pointer", fontFamily: "inherit" }}>
                Next →
              </button>
            </div>
          </div>
        );
      })()}

      {nmrSubTab === "mcqs" && (() => {
        if (nmrMcqs.length === 0) return <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No NMR MCQs available.</div>;

        if (nmrMcqIdx >= nmrMcqs.length) {
          const pct = nmrMcqScore.total > 0 ? Math.round((nmrMcqScore.correct / nmrMcqScore.total) * 100) : 0;
          return (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px", color: pct >= 80 ? "#059669" : pct >= 50 ? "#29ABE2" : "#64748b" }}>{nmrMcqScore.correct}/{nmrMcqScore.total}</div>
              <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>{pct}% correct</div>
              <button onClick={() => { setNmrMcqIdx(0); setNmrMcqSelected(null); setNmrMcqRevealed(false); setNmrMcqScore({ correct: 0, total: 0 }); }}
                style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: accentColor, color: "#fff",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Try Again
              </button>
            </div>
          );
        }

        const q = nmrMcqs[nmrMcqIdx];
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                Question {nmrMcqIdx + 1} / {nmrMcqs.length}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: accentColor }}>
                {nmrMcqScore.correct} / {nmrMcqScore.total} correct
              </span>
            </div>

            <div style={{ background: "#fff", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <McqQuestion
                question={q}
                selected={nmrMcqSelected}
                revealed={nmrMcqRevealed}
                accentColor={accentColor}
                onSelect={setNmrMcqSelected}
                onCheck={() => {
                  setNmrMcqRevealed(true);
                  setNmrMcqScore(prev => ({
                    correct: prev.correct + (nmrMcqSelected === q.answer ? 1 : 0),
                    total: prev.total + 1
                  }));
                }}
                onNext={() => { setNmrMcqIdx(i => i + 1); setNmrMcqSelected(null); setNmrMcqRevealed(false); }}
                isLast={nmrMcqIdx >= nmrMcqs.length - 1}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
