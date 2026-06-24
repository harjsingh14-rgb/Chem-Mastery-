import React, { useState } from "react";
import { CALC_SETS } from "../data/calc-sets";
import track from "../utils/track";

export default function CalcTab({ board, hasFullAccess, FREE_CALC_IDS, logActivity, logScore, LockedOverlay }) {
  const [calcTopic, setCalcTopic] = useState(null);
  const [calcYear, setCalcYear] = useState("as");
  const [calcDifficulty, setCalcDifficulty] = useState(null);
  const [calcSortedQs, setCalcSortedQs] = useState([]);
  const [calcIndex, setCalcIndex] = useState(0);
  const [calcInput, setCalcInput] = useState("");
  const [calcChecked, setCalcChecked] = useState(false);
  const [calcShowSteps, setCalcShowSteps] = useState(false);
  const [calcShowHint, setCalcShowHint] = useState(false);
  const [calcScore, setCalcScore] = useState({});
  const [showPT, setShowPT] = useState(null);

  return (
    <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
      {/* ── Topic selection ── */}
      {!calcTopic && (
        <div>
          <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "12px", lineHeight: 1.5 }}>
            Worked calc questions across all topics. Pick a topic then choose your difficulty.
          </p>
          <div style={{ display: "flex", gap: "0", marginBottom: "16px", borderRadius: "10px", overflow: "hidden", border: "2px solid #29ABE2" }}>
            {[{key:"as",label:"AS (Year 1)"},{key:"a2",label:"A2 (Year 2)"}].map(tab => (
              <button key={tab.key} onClick={() => setCalcYear(tab.key)} style={{
                flex: 1, padding: "10px", border: "none", fontSize: "13px", fontWeight: 700,
                fontFamily: "inherit", cursor: "pointer",
                background: calcYear === tab.key ? "#29ABE2" : "#ffffff",
                color: calcYear === tab.key ? "#ffffff" : "#29ABE2",
              }}>{tab.label}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {CALC_SETS.filter(set => {
              if (set.board !== "both" && set.board !== board) return false;
              if (calcYear === "as" && set.year === "a2") return false;
              return true;
            }).map(set => {
              const score = calcScore[set.id] || { correct: 0, attempted: 0 };
              const calcLocked = !hasFullAccess && !FREE_CALC_IDS.includes(set.id);
              return (
                <button key={set.id} onClick={() => { if (!calcLocked) { setCalcTopic(set.id); setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); track("select_calc_topic", { topic: set.id, title: set.title }); } }} style={{
                  background: "#ffffff", border: `2px solid ${set.color}30`,
                  borderRadius: "14px", padding: "14px 12px", textAlign: "left",
                  cursor: calcLocked ? "default" : "pointer", fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  position: "relative", overflow: "hidden",
                }}>
                  {calcLocked && <LockedOverlay />}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: set.color }} />
                    {set.year === "a2" && calcYear === "a2" && <span style={{ fontSize: "9px", fontWeight: 700, color: "#fff", background: "#7c3aed", borderRadius: "4px", padding: "1px 5px" }}>A2</span>}
                  </div>
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
                <button key={t.key} onClick={() => {
                  const baseQ = t.key === "all" ? set.questions : set.questions.filter(qq => qq.difficulty === t.key);
                  try {
                    const srData = JSON.parse(localStorage.getItem("hsj-calc-sr") || "{}");
                    const topicSR = srData[calcTopic] || {};
                    baseQ.sort((a, b) => {
                      const aK = JSON.stringify(a.q).slice(0, 40), bK = JSON.stringify(b.q).slice(0, 40);
                      const aH = topicSR[aK] || { correct: 0, wrong: 0 }, bH = topicSR[bK] || { correct: 0, wrong: 0 };
                      const aS = aH.wrong > 0 ? 0 : (aH.correct === 0 ? 1 : 2 + aH.correct);
                      const bS = bH.wrong > 0 ? 0 : (bH.correct === 0 ? 1 : 2 + bH.correct);
                      return aS - bS;
                    });
                  } catch {}
                  setCalcSortedQs(baseQ);
                  setCalcDifficulty(t.key); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); track("select_difficulty", { topic: calcTopic, difficulty: t.key });
                }} style={{
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
        const filteredQs = calcSortedQs.length > 0 ? calcSortedQs : (calcDifficulty === "all" ? set.questions : set.questions.filter(q => q.difficulty === calcDifficulty));
        if (filteredQs.length === 0) return <div style={{ color: "#7a95b0", fontSize: "14px" }}>No questions at this difficulty yet.</div>;

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <button onClick={() => { setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>← Difficulty</button>
              <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{currentIdx + 1} / {filteredQs.length}</div>
            </div>
            <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "14px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((currentIdx + 1) / filteredQs.length) * 100}%`, background: set.color, borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
            {q.difficulty && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${diffColors[q.difficulty]}15`, borderRadius: "6px", padding: "3px 9px", marginBottom: "10px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: diffColors[q.difficulty] }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: diffColors[q.difficulty], textTransform: "uppercase", letterSpacing: "0.5px" }}>{diffLabels[q.difficulty]}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <button onClick={() => setShowPT("aqa")} style={{ fontSize: "11px", fontWeight: 600, color: "#29ABE2", background: "#eaf6fd", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>📊 Periodic Table (AQA)</button>
              <button onClick={() => setShowPT("ocr")} style={{ fontSize: "11px", fontWeight: 600, color: "#7c3aed", background: "#f3f0ff", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>📊 Periodic Table (OCR)</button>
            </div>
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
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "14px", border: "1px solid #e8eef4" }}>
              <div style={{ fontSize: "19px", color: "#1a2d45", lineHeight: 1.75, fontWeight: 600, whiteSpace: "pre-line", fontFamily: "'Outfit','DM Sans',sans-serif", marginBottom: (q.diagram || q.dataTable) ? "0" : "16px" }}>{q.q}</div>
              {(q.dataTable || q.diagram) && (
                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", margin: "16px 0", flexWrap: "wrap" }}>
                  {q.dataTable && (
                    <table style={{ borderCollapse: "collapse", fontSize: "16px", fontFamily: "'Outfit','DM Sans',sans-serif", flexShrink: 0 }}>
                      <tbody>
                        {q.dataTable.map((row, ri) => (
                          <tr key={ri} style={{ background: ri % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                            <td style={{ padding: "10px 20px 10px 12px", fontWeight: 600, color: "#1a2d45", borderBottom: "1px solid #e0e8f0", fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: row[0].replace(/ΔHlatt/g, "ΔH<sub>latt</sub>").replace(/ΔHat/g, "ΔH<sub>at</sub>").replace(/ΔHf/g, "ΔH<sub>f</sub>") }} />
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: "#29ABE2", borderBottom: "1px solid #e0e8f0", fontSize: "16px", whiteSpace: "nowrap" }}>{row[1]} kJ mol⁻¹</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {q.diagram && (
                    <div style={{ flex: 1, minWidth: "260px", maxWidth: "700px" }}>{q.diagram}</div>
                  )}
                </div>
              )}
              {!calcChecked && (
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                  <input
                    type={q.isText ? "text" : "number"}
                    value={calcInput}
                    onChange={e => setCalcInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && calcInput && checkAnswer()}
                    placeholder={q.isText ? "e.g. C2H4" : "Your answer"}
                    style={{ width: "200px", padding: "12px 16px", borderRadius: "10px", border: "2px solid #d0dce8", fontSize: "16px", fontFamily: "'Outfit','DM Sans',sans-serif", outline: "none", color: "#1a2d45", background: "#f8fafc" }}
                  />
                  {q.unit && <div style={{ fontSize: "14px", color: "#7a95b0", fontWeight: 600, whiteSpace: "nowrap" }}>{q.unit}</div>}
                  <button onClick={checkAnswer} disabled={!calcInput} style={{ padding: "12px 28px", background: calcInput ? "#29ABE2" : "#e0e8f0", border: "none", borderRadius: "10px", color: calcInput ? "#ffffff" : "#9ca3af", fontSize: "15px", fontWeight: 700, cursor: calcInput ? "pointer" : "not-allowed", fontFamily: "'Outfit','DM Sans',sans-serif", marginLeft: "4px" }}>
                    Check
                  </button>
                  <button onClick={() => setCalcShowHint(!calcShowHint)} style={{ padding: "12px 16px", background: "none", border: "1.5px solid #29ABE2", borderRadius: "10px", color: "#29ABE2", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    {calcShowHint ? "Hide hint" : "Hint"}
                  </button>
                </div>
              )}
              {!calcChecked && calcShowHint && (
                <div style={{ background: "#eaf6fd", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: "#1a2d45", lineHeight: 1.6, marginBottom: "8px" }}>{q.hint}</div>
              )}
            </div>
            {calcChecked && (
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "14px", border: "1px solid #e8eef4" }}>
                <div style={{ borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", background: isCorrect ? "#dcfce7" : "#fee2e2", border: `2px solid ${isCorrect ? "#16a34a" : "#dc2626"}` }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: isCorrect ? "#15803d" : "#dc2626" }}>{isCorrect ? "Correct!" : "Not quite"}{!isCorrect && <span style={{ fontWeight: 500, marginLeft: "8px" }}>Answer: {q.answer} {q.unit}</span>}</div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#29ABE2", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Worked Solution</div>
                {q.steps.map((step, si) => (
                  <div key={si} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#29ABE2", background: "#eaf6fd", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>{si + 1}</div>
                    <div style={{ fontSize: "18px", color: "#1a2d45", lineHeight: 1.5, fontFamily: "'Caveat', cursive", fontWeight: 600 }}>{step}</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
                  {!isLast ? (
                    <button onClick={() => { setCalcIndex(currentIdx + 1); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); }} style={{ padding: "12px 28px", background: "#29ABE2", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Next →
                    </button>
                  ) : (
                    <button onClick={() => { setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ padding: "12px 28px", background: "#1a2d45", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Finish
                    </button>
                  )}
                  <button onClick={() => { setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); }} style={{ padding: "12px 16px", background: "#f0f4f8", border: "none", borderRadius: "10px", color: "#4a6080", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Restart
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
