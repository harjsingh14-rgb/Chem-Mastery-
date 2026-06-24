import React from "react";
import chemFormat from "../utils/chemFormat";

export default function McqQuestion({ question, selected, revealed, accentColor, onSelect, onCheck, onNext, isLast }) {
  const optionLetters = ["A","B","C","D"];
  const imageIsQuestion = (question.topic || "").startsWith("OCR") &&
    !!question.image && !!question.options &&
    Object.values(question.options).every(v => v === "See diagram");

  return (
    <div>
      {!imageIsQuestion && (
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.6, marginBottom: question.image ? "10px" : "16px" }}>
          {chemFormat(question.q)}
        </div>
      )}

      {question.image && (
        <div style={{ marginBottom: "14px", background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: "12px", padding: "8px", overflow: "hidden" }}>
          <img src={process.env.PUBLIC_URL + question.image} alt="Question diagram"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }} />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: imageIsQuestion ? "row" : "column", gap: "10px", flexWrap: "wrap" }}>
        {optionLetters.map(letter => {
          const optText = question.options[letter];
          if (!optText) return null;
          const isSelected = selected === letter;
          const isCorrect = letter === question.answer;
          const showResult = revealed;

          let bg = "#fff";
          let border = "1.5px solid #e2e8f0";
          let textColor = "#1a2d45";
          if (showResult && isCorrect) { bg = "#f0fdf4"; border = "2px solid #22c55e"; textColor = "#166534"; }
          else if (showResult && isSelected && !isCorrect) { bg = "#fef2f2"; border = "2px solid #ef4444"; textColor = "#991b1b"; }
          else if (isSelected && !showResult) { bg = `${accentColor}10`; border = `2px solid ${accentColor}`; textColor = accentColor; }

          return (
            <button key={letter} onClick={() => { if (!revealed) onSelect(letter); }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "12px",
                border, background: bg, cursor: revealed ? "default" : "pointer", fontFamily: "inherit",
                textAlign: "left", transition: "all 0.15s" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                background: isSelected || (showResult && isCorrect)
                  ? (showResult && isCorrect ? "#22c55e" : accentColor) : "#f1f5f9",
                color: isSelected || (showResult && isCorrect) ? "#fff" : "#64748b",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 800, transition: "all 0.2s" }}>
                {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : letter}
              </div>
              {optText !== "See diagram" && (
                <div style={{ fontSize: "13px", color: textColor, lineHeight: 1.5, fontWeight: showResult && isCorrect ? 700 : 400 }}>
                  {chemFormat(optText)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {revealed && question.explanation && (
        <div style={{ marginTop: "14px", padding: "12px 16px", background: "#f0fdf4", border: "1.5px solid #bbf7d0",
          borderRadius: "12px", fontSize: "13px", color: "#166534", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700 }}>Answer: {question.answer}</span>
          {question.explanation && <span> — {chemFormat(question.explanation)}</span>}
        </div>
      )}

      <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
        {!revealed ? (
          <button key="mcq-check-btn" onClick={onCheck}
            disabled={!selected}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none",
              cursor: selected ? "pointer" : "default",
              background: selected ? accentColor : "#e8edf3",
              color: selected ? "#fff" : "#b0c4d4",
              fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
              boxShadow: selected ? `0 4px 14px ${accentColor}50` : "none" }}>
            Check Answer
          </button>
        ) : (
          <button key="mcq-next-btn" onClick={onNext}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer",
              background: accentColor, color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
              boxShadow: `0 4px 14px ${accentColor}50` }}>
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
