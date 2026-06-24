import React, { useState } from "react";
import chemFormat from "../utils/chemFormat";

export default function McqTab({ board, mcqData }) {
  const [mcqYear, setMcqYear] = useState("as");
  const [mcqTopic, setMcqTopic] = useState(null);
  const [mcqIdx, setMcqIdx] = useState(0);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);
  const [mcqScore, setMcqScore] = useState({ correct: 0, total: 0 });
  const [mcqMode, setMcqMode] = useState("topic");
  const [mcqQuizSize, setMcqQuizSize] = useState(null);
  const [mcqOpenCats, setMcqOpenCats] = useState({});

  const mcqBoard = board === "ocr" ? "OCR_A" : "AQA";
  const mcqTopics = Object.entries(mcqData.topics).map(([id, t]) => ({ id, ...t })).filter(t => t.board === mcqBoard);
  const boardQuestions = mcqData.questions.filter(q => { const t = mcqData.topics[q.topic]; return t && t.board === mcqBoard; });
  const topicQuestions = mcqTopic ? [...boardQuestions.filter(q => q.topic === mcqTopic)].sort(() => Math.random() - 0.5) : [];
  const shuffledAll = mcqMode === "random" && mcqQuizSize ? [...boardQuestions].sort(() => Math.random() - 0.5).slice(0, mcqQuizSize) : [];
  const activeQuestions = mcqMode === "random" ? shuffledAll : topicQuestions;
  const currentQ = activeQuestions[mcqIdx];

  if (!mcqTopic && mcqMode === "topic") {
    const mcqCategoryColors = {
      "Physical": "#0284c7",
      "Inorganic": "#059669",
      "Organic": "#d97706",
    };
    const getCategory = (id) => {
      if (id.startsWith("OCR-P")) return "Past Paper MCQs";
      if (id.startsWith("3.1")) return "Physical Chemistry";
      if (id.startsWith("3.2")) return "Inorganic Chemistry";
      return "Organic Chemistry";
    };
    const getCatColor = (id) => {
      if (id.startsWith("OCR-P")) return "#7c3aed";
      if (id.startsWith("3.1")) return mcqCategoryColors["Physical"];
      if (id.startsWith("3.2")) return mcqCategoryColors["Inorganic"];
      return mcqCategoryColors["Organic"];
    };
    const filteredTopics = mcqTopics.filter(t => mcqYear === "as" ? t.level === "AS" : true);
    const grouped = {};
    filteredTopics.forEach(t => {
      const cat = getCategory(t.id);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
    });

    return (
      <div style={{ padding:"16px", flex:1, overflowY:"auto" }}>
        <p style={{ color:"#4a6080", fontSize:"14px", marginBottom:"12px", lineHeight:1.5 }}>
          Multiple choice questions with solutions. Pick a topic or try a random quiz.
        </p>
        <div style={{ display:"flex", gap:"0", marginBottom:"16px", borderRadius:"10px", overflow:"hidden", border:"2px solid #dc2626" }}>
          {[{key:"as",label:"AS (Year 1)"},{key:"a2",label:"A2 (Year 2)"}].map(tab => (
            <button key={tab.key} onClick={() => setMcqYear(tab.key)} style={{
              flex:1, padding:"10px", border:"none", fontSize:"13px", fontWeight:700,
              fontFamily:"inherit", cursor:"pointer",
              background: mcqYear === tab.key ? "#dc2626" : "#ffffff",
              color: mcqYear === tab.key ? "#ffffff" : "#dc2626",
            }}>{tab.label}</button>
          ))}
        </div>
        <div style={{ marginBottom:"18px" }}>
          <div style={{ fontSize:"12px", fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px" }}>
            Random Quiz
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            {[25, 50, 100].map(size => (
              <button key={size} onClick={() => { setMcqMode("random"); setMcqTopic("_random"); setMcqQuizSize(size); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); }}
                style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border:"2px solid #dc262630", cursor:"pointer",
                  background:"#fff", fontFamily:"inherit", textAlign:"center",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:"18px", fontWeight:800, color:"#dc2626" }}>{size}</div>
                <div style={{ fontSize:"10px", color:"#64748b", fontWeight:600, marginTop:"2px" }}>questions</div>
              </button>
            ))}
            <button onClick={() => {
              const custom = prompt("How many questions? (1-" + mcqData.questions.length + ")");
              const num = parseInt(custom);
              if (num && num > 0 && num <= mcqData.questions.length) {
                setMcqMode("random"); setMcqTopic("_random"); setMcqQuizSize(num); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 });
              }
            }}
              style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border:"2px solid #dc262630", cursor:"pointer",
                background:"#fff", fontFamily:"inherit", textAlign:"center",
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:"18px", fontWeight:800, color:"#dc2626" }}>?</div>
              <div style={{ fontSize:"10px", color:"#64748b", fontWeight:600, marginTop:"2px" }}>custom</div>
            </button>
          </div>
        </div>
        {Object.entries(grouped).map(([cat, topics]) => {
          const color = getCatColor(topics[0].id);
          const isOpen = mcqOpenCats[cat];
          const totalQs = topics.reduce((sum, t) => sum + t.questionCount, 0);
          return (
            <div key={cat} style={{ marginBottom:"10px" }}>
              <button onClick={() => setMcqOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))}
                style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"12px 14px", borderRadius:"12px", border:`2px solid ${color}25`,
                  background: isOpen ? `${color}08` : "#fff", cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.04)", transition:"all 0.2s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%", background: color }} />
                  <div style={{ fontSize:"14px", fontWeight:800, color: color, letterSpacing:"0.3px" }}>{cat}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontSize:"11px", fontWeight:600, color:"#64748b" }}>{topics.length} topics · {totalQs} Qs</span>
                  <span style={{ fontSize:"14px", color:"#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition:"transform 0.2s" }}>▼</span>
                </div>
              </button>
              {isOpen && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"10px", paddingLeft:"4px", paddingRight:"4px" }}>
                  {topics.map(t => (
                    <button key={t.id} onClick={() => { setMcqTopic(t.id); setMcqMode("topic"); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); }}
                      style={{ background:"#fff", border:`2px solid ${color}30`, borderRadius:"14px", padding:"14px 12px",
                        textAlign:"left", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"8px" }}>
                        <div style={{ width:"8px", height:"8px", borderRadius:"50%", background: color }} />
                        {t.level === "A2" && mcqYear === "a2" && <span style={{ fontSize:"9px", fontWeight:700, color:"#fff", background:"#7c3aed", borderRadius:"4px", padding:"1px 5px" }}>A2</span>}
                      </div>
                      <div style={{ fontSize:"13px", fontWeight:700, color:"#1a2d45", lineHeight:1.3, marginBottom:"4px" }}>{t.name}</div>
                      <div style={{ fontSize:"11px", color: color, fontWeight:600 }}>{t.questionCount} questions</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (!currentQ) return (
    <div style={{ padding:"40px 24px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
      <div style={{ fontSize:"22px", fontWeight:800, color:"#059669", marginBottom:"16px", letterSpacing:"-0.5px" }}>Complete</div>
      <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", marginBottom:"8px" }}>Quiz Complete!</div>
      <div style={{ fontSize:"18px", color:"#dc2626", fontWeight:700, marginBottom:"4px" }}>{mcqScore.correct} / {mcqScore.total} correct</div>
      <div style={{ fontSize:"15px", color:"#64748b", marginBottom:"20px" }}>
        {mcqScore.total > 0 ? `${Math.round((mcqScore.correct / mcqScore.total) * 100)}%` : ""}
      </div>
      <button onClick={() => { setMcqTopic(null); setMcqMode("topic"); setMcqIdx(0); setMcqScore({ correct: 0, total: 0 }); setMcqQuizSize(null); }}
        style={{ padding:"12px 28px", borderRadius:"12px", border:"none", cursor:"pointer",
          background:"#dc2626", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
        ← Back to Topics
      </button>
    </div>
  );

  const optionLetters = ["A","B","C","D"];
  const imageIsQuestion = (currentQ.topic || "").startsWith("OCR") &&
    !!currentQ.image && !!currentQ.options &&
    Object.values(currentQ.options).every(v => v === "See diagram");

  return (
    <div style={{ padding:"0", flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
      <style>{`@keyframes mcqFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ padding:"12px 16px 8px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #e8edf3" }}>
        <button onClick={() => { setMcqTopic(null); setMcqMode("topic"); setMcqIdx(0); setMcqScore({ correct: 0, total: 0 }); setMcqQuizSize(null); }}
          style={{ background:"#f0f4f8", border:"1px solid #dde4ed", borderRadius:"8px", padding:"6px 12px",
            color:"#dc2626", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", fontWeight:600 }}>
          ← Back
        </button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#1a2d45" }}>
            {mcqMode === "random" ? "Random Quiz" : `${mcqTopic} — ${mcqData.topics[mcqTopic]?.name || ""}`}
          </div>
        </div>
        <div style={{ fontSize:"13px", fontWeight:700, color:"#dc2626", background:"#dc262612", padding:"4px 10px", borderRadius:"8px" }}>
          {mcqScore.correct}/{mcqScore.total} · Q{mcqIdx + 1}/{activeQuestions.length}
        </div>
      </div>

      <div style={{ padding:"8px 16px 0" }}>
        <div style={{ height:"4px", background:"#e8edf3", borderRadius:"2px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${((mcqIdx + 1) / activeQuestions.length) * 100}%`,
            background:"#dc2626", borderRadius:"2px", transition:"width 0.3s ease" }}/>
        </div>
      </div>

      <div key={currentQ.id} style={{ padding:"16px", animation:"mcqFadeIn 0.3s ease" }}>
        {!imageIsQuestion && (
          <div style={{ fontSize:"16px", fontWeight:700, color:"#0f1d35", lineHeight:1.5, marginBottom: currentQ.image ? "10px" : "16px" }}>
            {chemFormat(currentQ.q)}
          </div>
        )}

        {currentQ.image && (
          <div style={{ marginBottom:"14px", background:"#fff", border:"1.5px solid #e2e8f0",
            borderRadius:"12px", padding:"8px", overflow:"hidden" }}>
            <img src={process.env.PUBLIC_URL + currentQ.image} alt="Question diagram"
              style={{ width:"100%", height:"auto", display:"block", borderRadius:"8px" }} />
          </div>
        )}

        <div style={{ display:"flex", flexDirection: currentQ.image && Object.values(currentQ.options).every(v => v === "See diagram") ? "row" : "column", gap:"10px", flexWrap:"wrap" }}>
          {optionLetters.map(letter => {
            const optText = currentQ.options[letter];
            if (!optText) return null;
            const isSelected = mcqSelected === letter;
            const isCorrect = letter === currentQ.answer;
            const showResult = mcqRevealed;

            let bg = "#fff";
            let border = "1.5px solid #e2e8f0";
            let textColor = "#1a2d45";
            if (showResult && isCorrect) { bg = "#dcfce7"; border = "2px solid #22c55e"; }
            else if (showResult && isSelected && !isCorrect) { bg = "#fef2f2"; border = "2px solid #ef4444"; }
            else if (isSelected && !showResult) { bg = "#dc262610"; border = "2px solid #dc2626"; }

            return (
              <button key={letter} onClick={() => { if (!mcqRevealed) setMcqSelected(letter); }}
                style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", borderRadius:"12px",
                  border, background: bg, cursor: mcqRevealed ? "default" : "pointer", fontFamily:"inherit",
                  textAlign:"left", transition:"all 0.2s" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"50%", flexShrink:0,
                  background: isSelected ? "#dc2626" : "#f0f4f8",
                  color: isSelected ? "#fff" : "#64748b",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"13px", fontWeight:800, transition:"all 0.2s" }}>
                  {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : letter}
                </div>
                {optText !== "See diagram" && (
                  <div style={{ fontSize:"14px", color: textColor, lineHeight:1.4, fontWeight: showResult && isCorrect ? 700 : 400 }}>
                    {chemFormat(optText)}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {mcqRevealed && currentQ.explanation && (
          <div style={{ marginTop:"14px", padding:"12px 16px", background:"#f0fdf4", border:"1.5px solid #bbf7d0",
            borderRadius:"12px", fontSize:"13px", color:"#166534", lineHeight:1.6, animation:"mcqFadeIn 0.3s ease" }}>
            <span style={{ fontWeight:700 }}>Answer: {currentQ.answer}</span>
            {currentQ.explanation && <span> — {chemFormat(currentQ.explanation)}</span>}
          </div>
        )}

        <div style={{ marginTop:"16px", display:"flex", gap:"10px" }}>
          {!mcqRevealed ? (
            <button key="mcq-check-btn" onClick={() => {
              if (!mcqSelected) return;
              setMcqRevealed(true);
              setMcqScore(prev => ({
                correct: prev.correct + (mcqSelected === currentQ.answer ? 1 : 0),
                total: prev.total + 1
              }));
            }}
              disabled={!mcqSelected}
              style={{ flex:1, padding:"14px", borderRadius:"12px", border:"none",
                cursor: mcqSelected ? "pointer" : "default",
                background: mcqSelected ? "#dc2626" : "#e8edf3",
                color: mcqSelected ? "#fff" : "#b0c4d4",
                fontSize:"14px", fontWeight:700, fontFamily:"inherit",
                boxShadow: mcqSelected ? "0 4px 14px rgba(220,38,38,0.3)" : "none" }}>
              Check Answer
            </button>
          ) : (
            <button key="mcq-next-btn" onClick={() => {
              setMcqIdx(i => i + 1);
              setMcqSelected(null);
              setMcqRevealed(false);
            }}
              style={{ flex:1, padding:"14px", borderRadius:"12px", border:"none", cursor:"pointer",
                background:"#dc2626", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit",
                boxShadow:"0 4px 14px rgba(220,38,38,0.3)" }}>
              {mcqIdx < activeQuestions.length - 1 ? "Next Question →" : "See Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
