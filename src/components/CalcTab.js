import React, { useState } from "react";
import { CALC_SETS } from "../data/calc-sets";
import track from "../utils/track";
import { T } from "../ui/theme";
import { Card, Chip, Button, Bar, Notice, EmptyState } from "../ui/components";
import { YearToggle } from "./McqTab";

const DIFF = {
  easy: { label: "Easy", tone: "green", colour: T.green, desc: "single or two-step" },
  medium: { label: "Medium", tone: "amber", colour: T.amber, desc: "multi-step, unit conversions" },
  hard: { label: "Hard", tone: "red", colour: T.red, desc: "longer chains, stoichiometry" },
  exam: { label: "Exam style", tone: "indigo", colour: T.indigo, desc: "past-paper difficulty" },
};

export default function CalcTab({ board, hasFullAccess, FREE_CALC_IDS, logActivity, logScore, logAttempt }) {
  const [calcTopic, setCalcTopic] = useState(null);
  const [calcYear, setCalcYear] = useState("as");
  const [calcDifficulty, setCalcDifficulty] = useState(null);
  const [calcSortedQs, setCalcSortedQs] = useState([]);
  const [calcIndex, setCalcIndex] = useState(0);
  const [calcInput, setCalcInput] = useState("");
  const [calcChecked, setCalcChecked] = useState(false);
  const [calcShowHint, setCalcShowHint] = useState(false);
  const [calcScore, setCalcScore] = useState({});
  const [showPT, setShowPT] = useState(null);

  const resetQuestion = () => { setCalcInput(""); setCalcChecked(false); setCalcShowHint(false); };

  // ── Topic selection ──
  if (!calcTopic) {
    const sets = CALC_SETS.filter(set => {
      if (set.board !== "both" && set.board !== board) return false;
      if (calcYear === "as" && set.year === "a2") return false;
      return true;
    });
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: T.muted, fontSize: 13, flex: 1, minWidth: 220 }}>Worked calculations across every topic. Pick a topic, then a difficulty.</span>
          <YearToggle value={calcYear} onChange={setCalcYear} />
        </div>
        <div className="cm-grid-3">
          {sets.map(set => {
            const score = calcScore[set.id] || { correct: 0, attempted: 0 };
            const locked = !hasFullAccess && !FREE_CALC_IDS.includes(set.id);
            return (
              <button key={set.id} className={locked ? "" : "cm-card-link"} disabled={locked}
                onClick={() => { setCalcTopic(set.id); setCalcDifficulty(null); setCalcIndex(0); resetQuestion(); track("select_calc_topic", { topic: set.id, title: set.title }); }}
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: 16, textAlign: "left", borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: locked ? "default" : "pointer", opacity: locked ? 0.6 : 1, color: T.ink }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: set.color }} />
                    {set.year === "a2" && <Chip tone="indigo" style={{ padding: "1px 7px", fontSize: 10 }}>A2</Chip>}
                  </div>
                  {locked && <Chip tone="neutral">Pro</Chip>}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{set.title}</span>
                <span style={{ fontSize: 12, color: T.muted }}>{set.questions.length} questions{score.attempted > 0 ? ` · ${score.correct}/${score.attempted} correct this session` : ""}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const set = CALC_SETS.find(s => s.id === calcTopic);
  if (!set) return null;

  // ── Difficulty selection ──
  if (!calcDifficulty) {
    const tiers = [
      { key: "all", label: "All questions", tone: "neutral", desc: `${set.questions.length} questions across all levels` },
      ...Object.entries(DIFF).map(([key, d]) => ({ key, label: d.label, tone: d.tone, desc: `${set.questions.filter(q => q.difficulty === key).length} questions · ${d.desc}` })),
    ].filter(t => t.key === "all" || set.questions.some(q => q.difficulty === t.key));
    const start = (key) => {
      const baseQ = key === "all" ? [...set.questions] : set.questions.filter(qq => qq.difficulty === key);
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
      setCalcDifficulty(key); setCalcIndex(0); resetQuestion();
      track("select_difficulty", { topic: calcTopic, difficulty: key });
    };
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button size="sm" icon="arrowLeft" onClick={() => setCalcTopic(null)}>Topics</Button>
          <span style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700 }}>{set.title}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Choose difficulty</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tiers.map(t => (
            <button key={t.key} className="cm-card-link" onClick={() => start(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", textAlign: "left", borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: "pointer", color: T.ink }}>
              <Chip tone={t.tone} style={{ width: 86, justifyContent: "center" }}>{t.label}</Chip>
              <span style={{ fontSize: 13, color: T.muted }}>{t.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Question view ──
  const filteredQs = calcSortedQs.length > 0 ? calcSortedQs : (calcDifficulty === "all" ? set.questions : set.questions.filter(q => q.difficulty === calcDifficulty));
  if (filteredQs.length === 0) return <EmptyState icon="calculator" title="No questions at this difficulty yet" action={<Button onClick={() => setCalcDifficulty(null)}>Choose another</Button>} />;

  const currentIdx = Math.min(calcIndex, filteredQs.length - 1);
  const q = filteredQs[currentIdx];
  const isLast = currentIdx === filteredQs.length - 1;
  const diff = DIFF[q.difficulty];
  const isCorrectFor = (input) => q.isText
    ? input.trim().toUpperCase().replace(/\s/g, "") === String(q.answer).toUpperCase().replace(/\s/g, "")
    : Math.abs(parseFloat(input) - q.answer) <= q.tolerance;
  const checkAnswer = () => {
    if (!calcChecked) {
      const correct = isCorrectFor(calcInput);
      setCalcScore(prev => {
        const s = prev[calcTopic] || { correct: 0, attempted: 0 };
        return { ...prev, [calcTopic]: { correct: s.correct + (correct ? 1 : 0), attempted: s.attempted + 1 } };
      });
      track("attempt_question", { topic: calcTopic, difficulty: q.difficulty, correct, question_index: currentIdx });
      logActivity("calc");
      logScore("calc", calcTopic, correct ? 1 : 0, 1);
      logAttempt && logAttempt({ board, type: "calc", questionId: q.id, topic: calcTopic, topicLabel: set.title, difficulty: q.difficulty, correct });
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
  };
  const isCorrect = calcChecked && isCorrectFor(calcInput);
  const next = () => { setCalcIndex(currentIdx + 1); resetQuestion(); };
  const backToDifficulty = () => { setCalcDifficulty(null); setCalcIndex(0); resetQuestion(); };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.line}`, flexWrap: "wrap" }}>
        <Button size="sm" icon="arrowLeft" onClick={backToDifficulty}>Difficulty</Button>
        <span style={{ flex: 1, minWidth: 160, fontWeight: 600 }}>{set.title}</span>
        {diff && <Chip tone={diff.tone}>{diff.label}</Chip>}
        <Chip tone="accent">Q{currentIdx + 1} / {filteredQs.length}</Chip>
      </div>
      <div style={{ padding: "10px 20px 0" }}><Bar value={((currentIdx + 1) / filteredQs.length) * 100} colour={T.accent} height={5} /></div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, maxWidth: 900 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button size="sm" variant="ghost" icon="book" onClick={() => setShowPT("aqa")}>Periodic table · AQA</Button>
          <Button size="sm" variant="ghost" icon="book" onClick={() => setShowPT("ocr")}>Periodic table · OCR</Button>
        </div>
        {showPT && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,29,53,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setShowPT(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: T.card, borderRadius: T.radius, width: "95vw", maxWidth: 900, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
              <div style={{ position: "sticky", top: 0, background: T.card, padding: "12px 16px", borderBottom: `1px solid ${T.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                <span style={{ fontWeight: 700 }}>{showPT === "aqa" ? "AQA" : "OCR A"} periodic table</span>
                <Button size="sm" icon="x" onClick={() => setShowPT(null)}>Close</Button>
              </div>
              <div style={{ padding: 12 }}><img src={showPT === "aqa" ? "/pt-aqa.png" : "/pt-ocr.png"} alt={`${showPT === "aqa" ? "AQA" : "OCR A"} periodic table`} style={{ width: "100%", height: "auto", borderRadius: 8 }} /></div>
            </div>
          </div>
        )}

        <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 500, whiteSpace: "pre-line", fontFamily: T.display }}>{q.q}</div>
          {(q.dataTable || q.diagram) && (
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              {q.dataTable && (
                <table style={{ borderCollapse: "collapse", fontSize: 15, flexShrink: 0 }}>
                  <tbody>
                    {q.dataTable.map((row, ri) => (
                      <tr key={ri} style={{ background: ri % 2 === 0 ? "#FAFBFC" : T.card }}>
                        <td style={{ padding: "9px 20px 9px 12px", fontWeight: 600, borderBottom: `1px solid ${T.line}` }} dangerouslySetInnerHTML={{ __html: row[0].replace(/ΔHlatt/g, "ΔH<sub>latt</sub>").replace(/ΔHat/g, "ΔH<sub>at</sub>").replace(/ΔHf/g, "ΔH<sub>f</sub>") }} />
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: T.accentText, borderBottom: `1px solid ${T.line}`, whiteSpace: "nowrap" }}>{row[1]} kJ mol⁻¹</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {q.diagram && <div style={{ flex: 1, minWidth: 260, maxWidth: 700 }}>{q.diagram}</div>}
            </div>
          )}
          {!calcChecked && (
            <>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input type={q.isText ? "text" : "number"} value={calcInput} onChange={e => setCalcInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && calcInput && checkAnswer()} placeholder={q.isText ? "e.g. C2H4" : "Your answer"} aria-label="Your answer"
                  style={{ width: 200, padding: "11px 14px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 16, outline: "none", color: T.ink, background: T.card }}
                  onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
                {q.unit && <span style={{ fontSize: 14, color: T.muted, fontWeight: 600 }}>{q.unit}</span>}
                <Button variant="primary" size="lg" onClick={checkAnswer} disabled={!calcInput}>Check</Button>
                <Button variant="ghost" icon="help" onClick={() => setCalcShowHint(v => !v)}>{calcShowHint ? "Hide hint" : "Hint"}</Button>
              </div>
              {calcShowHint && <Notice tone="accent">{q.hint}</Notice>}
            </>
          )}
        </Card>

        {calcChecked && (
          <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Notice tone={isCorrect ? "green" : "red"} style={{ fontWeight: 600, fontSize: 14 }}>
              {isCorrect ? "Correct" : "Not quite"}{!isCorrect && <span style={{ fontWeight: 500, marginLeft: 8 }}>Answer: {q.answer} {q.unit}</span>}
            </Notice>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Worked solution</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.steps.map((step, si) => (
                <div key={si} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.accentText, background: T.accentTint, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 3 }}>{si + 1}</span>
                  <span style={{ fontSize: 19, lineHeight: 1.5, fontFamily: "'Caveat', cursive", fontWeight: 600 }}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
              {!isLast
                ? <Button variant="primary" size="lg" iconRight="arrowRight" onClick={next}>Next</Button>
                : <Button variant="primary" size="lg" onClick={backToDifficulty}>Finish</Button>}
              <Button variant="ghost" onClick={() => { setCalcIndex(0); resetQuestion(); }}>Restart set</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
