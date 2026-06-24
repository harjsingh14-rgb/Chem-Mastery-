import React, { useState } from "react";
import { auth } from "../firebase";
import { EXTENDED_QUESTIONS } from "../data/extended-questions";
import track from "../utils/track";

export default function ExtendedTab({ board, hasFullAccess, logActivity, LockedOverlay }) {
  const [extCategory, setExtCategory] = useState(null);
  const [extIndex, setExtIndex] = useState(0);
  const [extQPicker, setExtQPicker] = useState(false);
  const [extRevealed, setExtRevealed] = useState(false);
  const [extMarked, setExtMarked] = useState(new Set());
  const [extDraft, setExtDraft] = useState("");
  const [extScore, setExtScore] = useState({});
  const [extAiResult, setExtAiResult] = useState(null);
  const [extAiLoading, setExtAiLoading] = useState(false);
  const [extShowModel, setExtShowModel] = useState(false);
  const [extAiError, setExtAiError] = useState(null);

  const purple = "#7c3aed";
  const purpleLight = "#f3f0ff";
  const purpleMid = "#ede9fe";
  const filteredQs = EXTENDED_QUESTIONS.filter(q => q.board === "both" || q.board === board);
  const categories = [...new Set(filteredQs.map(q => q.category))];

  if (!extCategory) return (
    <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
      <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "6px", lineHeight: 1.5, fontWeight: 600 }}>6-Mark Extended Responses</p>
      <p style={{ color: "#7a95b0", fontSize: "12px", marginBottom: "16px", lineHeight: 1.5 }}>
        Read the question, think through your answer, then reveal the mark scheme. Tick each point you covered to track your score.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {categories.map((cat, catIdx) => {
          const qs = filteredQs.filter(q => q.category === cat);
          const scores = qs.map(q => extScore[q.id]).filter(Boolean);
          const earnedMarks = scores.reduce((a, b) => a + b, 0);
          const extLocked = !hasFullAccess && catIdx > 0;
          return (
            <button key={cat} onClick={() => { if (!extLocked) { setExtCategory(cat); setExtQPicker(true); setExtIndex(0); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); track("select_ext_category", { category: cat, board }); } }}
              style={{ background: "#fff", border: `2px solid ${purpleLight}`, borderRadius: "14px", padding: "14px 12px", textAlign: "left", cursor: extLocked ? "default" : "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s", position: "relative", overflow: "hidden" }}>
              {extLocked && <LockedOverlay />}
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: purple, marginBottom: "8px" }} />
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3, marginBottom: "4px" }}>{cat}</div>
              <div style={{ fontSize: "11px", color: purple, fontWeight: 600 }}>{qs.length} question{qs.length > 1 ? "s" : ""} · {qs[0]?.marks || 6} marks each</div>
              {scores.length > 0 && <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{earnedMarks}/{scores.length * 6} marks scored</div>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const catQs = filteredQs.filter(q => q.category === extCategory);
  if (extQPicker) return (
    <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
      <button onClick={() => { setExtCategory(null); setExtQPicker(false); }}
        style={{ background: "none", border: "none", color: purple, fontWeight: 700, fontSize: "13px", cursor: "pointer", padding: "0 0 14px 0", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}>
        &#8592; Back to topics
      </button>
      <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "4px" }}>{extCategory}</p>
      <p style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>Choose a question to attempt</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {catQs.map((question, i) => {
          const savedScore = extScore[question.id];
          const attempted = savedScore !== undefined;
          return (
            <button key={question.id}
              onClick={() => { setExtIndex(i); setExtQPicker(false); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiError(null); setExtAiLoading(false); setExtShowModel(false); track("attempt_extended", { question_id: catQs[i].id, category: extCategory, board }); }}
              style={{ background: "#fff", border: `2px solid ${attempted ? purple : purpleLight}`, borderRadius: "14px", padding: "14px 14px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: purple, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Q{i + 1} &middot; {question.marks} marks
                  </div>
                  <div style={{ fontSize: "12px", color: "#1a2d45", lineHeight: 1.5, fontWeight: 500 }}>
                    {question.question.length > 120 ? question.question.slice(0, 120).trim() + "..." : question.question}
                  </div>
                </div>
                {attempted && (
                  <div style={{ flexShrink: 0, background: savedScore >= question.marks * 0.7 ? "#d1fae5" : savedScore >= question.marks * 0.4 ? "#fef9c3" : "#fee2e2",
                    color: savedScore >= question.marks * 0.7 ? "#065f46" : savedScore >= question.marks * 0.4 ? "#92400e" : "#991b1b",
                    borderRadius: "8px", padding: "4px 8px", fontSize: "12px", fontWeight: 700 }}>
                    {savedScore}/{question.marks}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const q = catQs[extIndex];
  if (!q) return null;
  const isLast = extIndex === catQs.length - 1;
  const marksThisQ = extMarked.size;

  const renderQuestionText = (text) => {
    const lines = text.split("\n");
    const result = [];
    let i = 0;
    while (i < lines.length) {
      if (lines[i].includes(" | ") && (lines[i].match(/\|/g) || []).length >= 2) {
        const tableLines = [];
        while (i < lines.length && lines[i].includes(" | ") && (lines[i].match(/\|/g) || []).length >= 2) {
          tableLines.push(lines[i].split(" | ").map(c => c.trim()));
          i++;
        }
        if (tableLines.length > 0) {
          const headerRow = tableLines[0];
          const dataRows = tableLines.slice(1);
          result.push(
            <div key={`tbl-${result.length}`} style={{ overflowX: "auto", margin: "12px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr>
                    {headerRow.map((h, ci) => (
                      <th key={ci} style={{ background: "#f0f4f8", padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#1a2d45", borderBottom: "2px solid #d0dce8", fontSize: "12px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: "7px 10px", borderBottom: "1px solid #e8eef4", color: "#1a2d45", fontSize: "13px" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      } else {
        const line = lines[i];
        if (line.trim() === "") {
          result.push(<div key={`sp-${result.length}`} style={{ height: "8px" }} />);
        } else {
          result.push(<div key={`ln-${result.length}`}>{line}</div>);
        }
        i++;
      }
    }
    return result;
  };

  const canSubmit = extDraft.trim().length >= 20;
  const handleSubmit = async () => {
    setExtAiLoading(true);
    setExtAiError(null);
    track("submit_ai_examine", { question_id: q.id, category: extCategory, board });
    logActivity("extended");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/examine.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ question: q.question, markScheme: q.markScheme, studentAnswer: extDraft, maxMarks: q.marks, levels: q.levels }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setExtAiResult(data);
      const covered = new Set((data.coveredPoints || []).map((c, i) => c ? i : -1).filter(i => i >= 0));
      setExtMarked(covered);
      setExtScore(s => ({ ...s, [q.id]: data.score }));
      setExtRevealed(true);
    } catch (err) {
      setExtAiError(err.message || 'Could not reach AI Examiner');
    } finally {
      setExtAiLoading(false);
    }
  };
  const toggleMark = (i) => {
    setExtMarked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      setExtScore(s => ({ ...s, [q.id]: next.size }));
      return next;
    });
  };
  const resetExt = () => {
    setExtRevealed(false);
    setExtMarked(new Set());
    setExtDraft("");
    setExtAiResult(null);
    setExtAiLoading(false);
    setExtShowModel(false);
    setExtAiError(null);
  };
  const goNext = () => { setExtIndex(i => i + 1); resetExt(); };

  const scoreColour = marksThisQ >= q.marks * 0.75 ? "#16a34a" : marksThisQ >= q.marks * 0.5 ? "#d97706" : "#dc2626";

  return (
    <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <button onClick={() => { setExtQPicker(true); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); }} style={{ background: "none", border: "none", color: purple, fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>&#8592; Questions</button>
        <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{extCategory} · Q{extIndex + 1} / {catQs.length}</div>
      </div>
      <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "16px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((extIndex + 1) / catQs.length) * 100}%`, background: purple, borderRadius: "2px", transition: "width 0.3s" }} />
      </div>
      <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "12px", border: `1px solid ${purpleMid}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", background: purpleLight, padding: "3px 8px", borderRadius: "6px" }}>{q.category}</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", background: "#f0f4f8", padding: "3px 8px", borderRadius: "6px" }}>{q.marks} marks</div>
        </div>
        <div style={{ fontSize: "15.5px", color: "#1a2d45", lineHeight: 1.75, fontWeight: 500, fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "0.01em" }}>{renderQuestionText(q.question)}</div>
      </div>
      {!extRevealed && !extAiLoading && (
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45", textTransform: "uppercase", letterSpacing: "1px" }}>Your Answer <span style={{ color: "#dc2626" }}>*</span></div>
            <div style={{ fontSize: "11px", color: canSubmit ? "#16a34a" : "#7a95b0", fontWeight: 600 }}>{canSubmit ? "Ready to submit" : `${Math.max(0, 20 - extDraft.trim().length)} chars to unlock`}</div>
          </div>
          <textarea
            value={extDraft}
            onChange={e => setExtDraft(e.target.value)}
            placeholder={`Write your full answer to this ${q.marks}-mark question here. Cover every point you know - the AI Examiner will mark it against the mark scheme.`}
            rows={7}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: `2px solid ${canSubmit ? "#7c3aed" : "#d0dce8"}`, fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#1a2d45", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s" }}
          />
        </div>
      )}
      {!extRevealed && !extAiLoading && (
        <button onClick={handleSubmit} disabled={!canSubmit} style={{
          width: "100%", padding: "14px", borderRadius: "12px", border: "none",
          background: canSubmit ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e0e8f0",
          color: canSubmit ? "#fff" : "#9ca3af",
          fontSize: "15px", fontWeight: 800, cursor: canSubmit ? "pointer" : "not-allowed",
          fontFamily: "inherit", boxShadow: canSubmit ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "all 0.2s",
        }}>
          Submit to AI Examiner
        </button>
      )}
      {extAiError && !extAiLoading && (
        <div style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: "14px", padding: "16px 18px", marginTop: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#be123c", marginBottom: "6px" }}>⚠️ AI Examiner unavailable</div>
          <div style={{ fontSize: "12px", color: "#9f1239", lineHeight: 1.6, marginBottom: "12px" }}>
            {extAiError === 'API key not configured'
              ? 'The API key has not been added to Vercel. Add ANTHROPIC_API_KEY in Vercel > Settings > Environment Variables, then redeploy.'
              : `Error: ${extAiError}`}
          </div>
          <button onClick={handleSubmit} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "#be123c", color: "#fff", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      )}
      {extAiLoading && (
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px", animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45", marginBottom: "4px" }}>AI Examiner is reading your answer...</div>
          <div style={{ fontSize: "12px", color: "#7a95b0" }}>Marking against the mark scheme</div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {extRevealed && (
        <div>
          {extDraft.trim() && (
            <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "12px 14px", marginBottom: "12px", border: "1px solid #e0e8f0" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Your Answer</div>
              <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{extDraft}</div>
            </div>
          )}
          {extAiResult && (
            <>
              <div style={{ background: "linear-gradient(135deg,#1a2d45,#7c3aed)", borderRadius: "16px", padding: "18px", marginBottom: "12px", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8, letterSpacing: "1px", textTransform: "uppercase" }}>AI Examiner</div>
                    {extAiResult.level !== undefined && (
                      <div style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px", color: extAiResult.level >= 3 ? "#86efac" : extAiResult.level >= 2 ? "#fcd34d" : extAiResult.level >= 1 ? "#fca5a5" : "#f87171", background: "rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: "6px", display: "inline-block" }}>
                        Level {extAiResult.level}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span style={{ fontSize: "32px", fontWeight: 900, color: scoreColour === "#16a34a" ? "#86efac" : scoreColour === "#d97706" ? "#fcd34d" : "#fca5a5" }}>{marksThisQ}</span>
                    <span style={{ fontSize: "16px", opacity: 0.7 }}>/ {q.marks}</span>
                  </div>
                </div>
                <div style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.95 }}>{extAiResult.feedback}</div>
              </div>
              <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Indicative Content - tap to adjust</div>
                {q.markScheme.map((point, i) => {
                  const ticked = extMarked.has(i);
                  const aiSaid = extAiResult.coveredPoints[i];
                  return (
                    <button key={i} onClick={() => toggleMark(i)}
                      style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? "#f0fdf4" : "#fff8f8", border: `1.5px solid ${ticked ? "#16a34a" : "#fecaca"}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                      <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${ticked ? "#16a34a" : "#f87171"}`, background: ticked ? "#16a34a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all 0.15s" }}>
                        {ticked ? <span style={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}>✓</span> : <span style={{ color: "#f87171", fontSize: "13px", fontWeight: 900 }}>✗</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", color: ticked ? "#15803d" : "#7f1d1d", lineHeight: 1.5, fontWeight: ticked ? 600 : 400 }}>{point}</div>
                        {aiSaid !== ticked && <div style={{ fontSize: "10px", color: "#7a95b0", marginTop: "3px" }}>AI said: {aiSaid ? "covered ✓" : "missed ✗"} - tap to override</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setExtShowModel(v => !v)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #e9d5ff", background: extShowModel ? "#f3f0ff" : "#faf5ff", color: purple, fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Show Model Answer</span>
                <span style={{ transform: extShowModel ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
              </button>
              {extShowModel && (
                <div style={{ background: "#f3f0ff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #ddd6fe", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Model Answer</div>
                  <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.7 }}>{extAiResult.modelAnswer}</div>
                </div>
              )}
            </>
          )}
          {!extAiResult && (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Indicative Content - tick each point you covered</div>
              {q.markScheme.map((point, i) => {
                const ticked = extMarked.has(i);
                return (
                  <button key={i} onClick={() => toggleMark(i)}
                    style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? "#f0fdf4" : "transparent", border: `1px solid ${ticked ? "#16a34a" : "#e8eef4"}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${ticked ? "#16a34a" : "#c8d6e4"}`, background: ticked ? "#16a34a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all 0.15s" }}>
                      {ticked && <span style={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ fontSize: "13px", color: ticked ? "#15803d" : "#1a2d45", lineHeight: 1.6, fontWeight: ticked ? 600 : 400 }}>{point}</div>
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ background: "#fffbeb", borderRadius: "12px", padding: "14px 16px", border: "1px solid #fde68a", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Examiner Tip</div>
            <div style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.65 }}>{q.examTip}</div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {!isLast ? (
              <button onClick={goNext} style={{ flex: 1, padding: "13px", background: purple, border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Next Question →
              </button>
            ) : (
              <button onClick={() => { setExtCategory(null); setExtIndex(0); resetExt(); }}
                style={{ flex: 1, padding: "13px", background: "#1a2d45", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Finish - Back to Topics
              </button>
            )}
            <button onClick={resetExt} style={{ padding: "13px 16px", background: "#f0f4f8", border: "none", borderRadius: "12px", color: "#4a6080", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
