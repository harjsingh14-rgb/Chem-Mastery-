import React, { useState } from "react";
import McqQuestion from "./McqQuestion";
import { T, boardLabel } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Bar, Icon, EmptyState } from "../ui/components";

const CATEGORY_COLOUR = { Physical: T.accentText, Inorganic: T.green, Organic: T.amber, Past: T.indigo };
const CATEGORY_KEY = { "Physical chemistry": "Physical", "Inorganic chemistry": "Inorganic", "Organic chemistry": "Organic", "Past paper MCQs": "Past",
  "Module 2: Foundations in chemistry": "Physical", "Module 3: Periodic table and energy": "Inorganic", "Module 4: Core organic chemistry": "Organic",
  "Module 5: Physical chemistry and transition elements": "Physical", "Module 6: Organic chemistry and analysis": "Organic" };

// Topic ids: AQA use the spec reference ("3.1.8"); OCR spec topics are "OCR-2.1.1";
// Edexcel topics are "EDX-12"; the OCR past-paper buckets are "OCR-P1" and "OCR-P2".
const OCR_MODULE = { 2: "Module 2: Foundations in chemistry", 3: "Module 3: Periodic table and energy", 4: "Module 4: Core organic chemistry", 5: "Module 5: Physical chemistry and transition elements", 6: "Module 6: Organic chemistry and analysis" };
const EDX_ORGANIC = new Set([6, 7, 17, 18, 19]);
const EDX_INORGANIC = new Set([3, 4, 14, 15]);
function categoryFor(id) {
  if (id.startsWith("OCR-P")) return "Past paper MCQs";
  if (id.startsWith("OCR-")) return OCR_MODULE[Number(id.slice(4).split(".")[0])] || "Other";
  if (id.startsWith("EDX-")) { const n = Number(id.slice(4)); return EDX_ORGANIC.has(n) ? "Organic chemistry" : EDX_INORGANIC.has(n) ? "Inorganic chemistry" : "Physical chemistry"; }
  return id.startsWith("3.1") ? "Physical chemistry" : id.startsWith("3.2") ? "Inorganic chemistry" : "Organic chemistry";
}
/** Spec reference shown on a topic card. */
export const topicRef = (id) => id.startsWith("OCR-P") ? "" : id.startsWith("OCR-") ? id.slice(4) : id.startsWith("EDX-") ? `Topic ${id.slice(4)}` : id;

export default function McqTab({ board, mcqData, logAttempt }) {
  const [mcqYear, setMcqYear] = useState("as");
  const [mcqTopic, setMcqTopic] = useState(null);
  const [mcqIdx, setMcqIdx] = useState(0);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);
  const [mcqScore, setMcqScore] = useState({ correct: 0, total: 0 });
  const [mcqMode, setMcqMode] = useState("topic");
  const [mcqQuizSize, setMcqQuizSize] = useState(null);
  const [mcqOpenCats, setMcqOpenCats] = useState({});

  const mcqBoard = board === "ocr" ? "OCR_A" : board === "edexcel" ? "EDEXCEL" : "AQA";
  const mcqTopics = Object.entries(mcqData.topics).map(([id, t]) => ({ id, ...t })).filter(t => t.board === mcqBoard);
  const boardQuestions = mcqData.questions.filter(q => { const t = mcqData.topics[q.topic]; return t && t.board === mcqBoard; });
  const topicQuestions = mcqTopic ? [...boardQuestions.filter(q => q.topic === mcqTopic)].sort(() => Math.random() - 0.5) : [];
  const shuffledAll = mcqMode === "random" && mcqQuizSize ? [...boardQuestions].sort(() => Math.random() - 0.5).slice(0, mcqQuizSize) : [];
  const activeQuestions = mcqMode === "random" ? shuffledAll : topicQuestions;
  const currentQ = activeQuestions[mcqIdx];

  const reset = () => { setMcqTopic(null); setMcqMode("topic"); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); setMcqQuizSize(null); };
  const startRandom = (size) => { setMcqMode("random"); setMcqTopic("_random"); setMcqQuizSize(size); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); };

  // ── Topic picker ──
  if (!mcqTopic && mcqMode === "topic") {
    const getCategory = (id) => categoryFor(id);
    const getCatColour = (id) => CATEGORY_COLOUR[CATEGORY_KEY[categoryFor(id)]] || CATEGORY_COLOUR.Physical;
    const filteredTopics = mcqTopics.filter(t => mcqYear === "as" ? t.level === "AS" : true);
    const grouped = {};
    filteredTopics.forEach(t => { const cat = getCategory(t.id); (grouped[cat] = grouped[cat] || []).push(t); });

    if (boardQuestions.length === 0) return (
      <div style={{ padding: 20 }}>
        <Card padding={0}><EmptyState icon="checkSquare" title={`${boardLabel(board)} MCQs are being written`} body="Calculations and the AI Examiner already work for every board. The MCQ bank for this board will appear here as it's added." /></Card>
      </div>
    );

    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: T.muted, fontSize: 13, flex: 1, minWidth: 220 }}>Multiple choice with worked explanations. Pick a topic, or take a random quiz across the year.</span>
          <YearToggle value={mcqYear} onChange={setMcqYear} />
        </div>

        <Card padding={16} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <CardHeader title="Random quiz" sub={`${boardQuestions.length} questions in the ${boardLabel(board)} bank`} />
          <div className="cm-grid-4" style={{ gap: 10 }}>
            {[25, 50, 100].map(size => (
              <button key={size} onClick={() => startRandom(size)} className="cm-card-link" style={optionCard}>
                <span style={{ fontFamily: T.display, fontSize: 22, fontWeight: 800, color: T.ink }}>{size}</span>
                <span style={{ fontSize: 12, color: T.muted }}>questions</span>
              </button>
            ))}
            <button onClick={() => {
              const custom = prompt(`How many questions? (1-${boardQuestions.length})`);
              const num = parseInt(custom, 10);
              if (num && num > 0 && num <= boardQuestions.length) startRandom(num);
            }} className="cm-card-link" style={optionCard}>
              <span style={{ fontFamily: T.display, fontSize: 22, fontWeight: 800, color: T.ink }}>?</span>
              <span style={{ fontSize: 12, color: T.muted }}>custom</span>
            </button>
          </div>
        </Card>

        {Object.entries(grouped).sort(([a], [b]) => (a === "Past paper MCQs") - (b === "Past paper MCQs")).map(([cat, topics]) => {
          const colour = getCatColour(topics[0].id);
          const isOpen = !!mcqOpenCats[cat];
          const totalQs = topics.reduce((sum, t) => sum + t.questionCount, 0);
          return (
            <Card key={cat} padding={0}>
              <button onClick={() => setMcqOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: colour, flexShrink: 0 }} />
                <span style={{ fontFamily: T.display, fontSize: 16, fontWeight: 700, color: T.ink, flex: 1 }}>{cat}</span>
                <span style={{ fontSize: 12, color: T.muted }}>{topics.length} topics · {totalQs} Qs</span>
                <Icon name="chevronDown" size={16} color={T.faint} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {isOpen && (
                <div className="cm-grid-3" style={{ padding: "0 16px 16px", gap: 10 }}>
                  {topics.map(t => (
                    <button key={t.id} className="cm-card-link" onClick={() => { setMcqTopic(t.id); setMcqMode("topic"); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); }}
                      style={{ ...optionCard, alignItems: "flex-start", textAlign: "left", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: colour }}>{topicRef(t.id)}</span>
                        {t.level === "A2" && <Chip tone="indigo" style={{ padding: "1px 7px", fontSize: 10 }}>A2</Chip>}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{t.name}</span>
                      <span style={{ fontSize: 12, color: T.muted }}>{t.questionCount} questions</span>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  // ── Finished ──
  if (!currentQ) {
    const p = mcqScore.total > 0 ? Math.round((mcqScore.correct / mcqScore.total) * 100) : 0;
    return (
      <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
        <Card style={{ maxWidth: 420, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <Chip tone={p >= 75 ? "green" : p >= 50 ? "amber" : "red"}>{p >= 90 ? "Outstanding" : p >= 70 ? "Great work" : p >= 50 ? "Good effort" : "Keep practising"}</Chip>
          <div style={{ fontFamily: T.display, fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{p}%</div>
          <div style={{ color: T.muted }}>{mcqScore.correct} of {mcqScore.total} correct</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Button variant="primary" onClick={reset}>Back to topics</Button>
            {mcqMode === "random" && <Button onClick={() => startRandom(mcqQuizSize)}>Play again</Button>}
          </div>
        </Card>
      </div>
    );
  }

  // ── Question ──
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes mcqFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.line}`, flexWrap: "wrap" }}>
        <Button size="sm" icon="arrowLeft" onClick={reset}>Topics</Button>
        <div style={{ flex: 1, minWidth: 160, fontWeight: 600, fontSize: 14, color: T.ink }}>
          {mcqMode === "random" ? "Random quiz" : `${topicRef(mcqTopic)}${topicRef(mcqTopic) ? " · " : ""}${mcqData.topics[mcqTopic]?.name || ""}`}
        </div>
        <Chip tone="accent">Q{mcqIdx + 1} / {activeQuestions.length}</Chip>
        <Chip tone={mcqScore.total === 0 ? "neutral" : mcqScore.correct / mcqScore.total >= 0.75 ? "green" : mcqScore.correct / mcqScore.total >= 0.5 ? "amber" : "red"}>{mcqScore.correct} / {mcqScore.total} right</Chip>
      </div>
      <div style={{ padding: "10px 20px 0" }}><Bar value={((mcqIdx + 1) / activeQuestions.length) * 100} colour={T.accent} height={5} /></div>

      <div key={currentQ.id} style={{ padding: 20, animation: "mcqFadeIn 0.25s ease", maxWidth: 820 }}>
        <McqQuestion
          question={currentQ}
          selected={mcqSelected}
          revealed={mcqRevealed}
          accentColor={T.ink}
          onSelect={setMcqSelected}
          onCheck={() => {
            const correct = mcqSelected === currentQ.answer;
            setMcqRevealed(true);
            setMcqScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
            logAttempt && logAttempt({
              board, type: "mcq", questionId: currentQ.id, topic: currentQ.topic,
              topicLabel: mcqData.topics[currentQ.topic]?.name || null, correct,
            });
          }}
          onNext={() => { setMcqIdx(i => i + 1); setMcqSelected(null); setMcqRevealed(false); }}
          isLast={mcqIdx >= activeQuestions.length - 1}
        />
      </div>
    </div>
  );
}

const optionCard = {
  display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "14px 12px", borderRadius: T.radiusSm,
  background: T.card, border: `1px solid ${T.border}`, cursor: "pointer", color: T.ink,
};

export function YearToggle({ value, onChange, options = [{ key: "as", label: "AS · Year 1" }, { key: "a2", label: "A2 · Year 2" }] }) {
  return (
    <div style={{ display: "inline-flex", padding: 3, borderRadius: 10, background: T.soft, gap: 2 }}>
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)} style={{
          padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
          background: value === o.key ? T.card : "transparent", color: value === o.key ? T.ink : T.muted,
          boxShadow: value === o.key ? "0 1px 2px rgba(15,29,53,0.08)" : "none",
        }}>{o.label}</button>
      ))}
    </div>
  );
}
