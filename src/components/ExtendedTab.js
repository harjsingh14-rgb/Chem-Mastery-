import React, { useState } from "react";
import { auth } from "../firebase";
import { EXTENDED_QUESTIONS } from "../data/extended-questions";
import track from "../utils/track";
import { T } from "../ui/theme";
import { Card, Chip, Button, Bar, Notice, EmptyState, Icon } from "../ui/components";

export default function ExtendedTab({ board, hasFullAccess, logActivity, logAttempt }) {
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

  const filteredQs = EXTENDED_QUESTIONS.filter(q => q.board === "both" || q.board === board);
  const categories = [...new Set(filteredQs.map(q => q.category))];

  const resetExt = () => { setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); };

  // ── Category picker ──
  if (!extCategory) return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ color: T.muted, fontSize: 13 }}>Extended-response questions marked by the AI Examiner against the real levels-of-response descriptors. Write a full answer and get a level, a mark and feedback in seconds.</span>
      {categories.length === 0 && <EmptyState icon="pencil" title="No extended questions for this board yet" body="They're being written. The AQA and OCR A banks are available now." />}
      <div className="cm-grid-3">
        {categories.map((cat, catIdx) => {
          const qs = filteredQs.filter(q => q.category === cat);
          const scores = qs.map(q => extScore[q.id]).filter(s => s !== undefined);
          const earned = scores.reduce((a, b) => a + b, 0);
          const locked = !hasFullAccess && catIdx > 0;
          return (
            <button key={cat} className={locked ? "" : "cm-card-link"} disabled={locked}
              onClick={() => { setExtCategory(cat); setExtQPicker(true); setExtIndex(0); resetExt(); track("select_ext_category", { category: cat, board }); }}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: 16, textAlign: "left", borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: locked ? "default" : "pointer", opacity: locked ? 0.6 : 1, color: T.ink }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.indigo }} />
                {locked && <Chip tone="neutral">Pro</Chip>}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{cat}</span>
              <span style={{ fontSize: 12, color: T.muted }}>{qs.length} question{qs.length === 1 ? "" : "s"} · {qs[0]?.marks || 6} marks each{scores.length > 0 ? ` · ${earned}/${scores.length * (qs[0]?.marks || 6)} scored` : ""}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const catQs = filteredQs.filter(q => q.category === extCategory);

  // ── Question picker ──
  if (extQPicker) return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, maxWidth: 800 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button size="sm" icon="arrowLeft" onClick={() => { setExtCategory(null); setExtQPicker(false); }}>Topics</Button>
        <span style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700 }}>{extCategory}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {catQs.map((question, i) => {
          const saved = extScore[question.id];
          const attempted = saved !== undefined;
          const tone = !attempted ? "neutral" : saved >= question.marks * 0.7 ? "green" : saved >= question.marks * 0.4 ? "amber" : "red";
          return (
            <button key={question.id} className="cm-card-link"
              onClick={() => { setExtIndex(i); setExtQPicker(false); resetExt(); track("attempt_extended", { question_id: question.id, category: extCategory, board }); }}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", textAlign: "left", borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: "pointer", color: T.ink }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>Q{i + 1} · {question.marks} marks</span>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{question.question.length > 140 ? question.question.slice(0, 140).trim() + "…" : question.question}</span>
              </div>
              {attempted && <Chip tone={tone}>{saved}/{question.marks}</Chip>}
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
    const isTableLine = (l) => l.includes(" | ") && (l.match(/\|/g) || []).length >= 2;
    while (i < lines.length) {
      if (isTableLine(lines[i])) {
        const tableLines = [];
        while (i < lines.length && isTableLine(lines[i])) { tableLines.push(lines[i].split(" | ").map(c => c.trim())); i++; }
        const [headerRow, ...dataRows] = tableLines;
        result.push(
          <div key={`tbl-${result.length}`} style={{ overflowX: "auto", margin: "12px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: T.font }}>
              <thead><tr>{headerRow.map((h, ci) => <th key={ci} style={{ background: T.soft, padding: "8px 10px", textAlign: "left", fontWeight: 700, borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>{h}</th>)}</tr></thead>
              <tbody>{dataRows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "7px 10px", borderBottom: `1px solid ${T.line}` }}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      } else {
        const line = lines[i];
        result.push(line.trim() === "" ? <div key={`sp-${result.length}`} style={{ height: 8 }} /> : <div key={`ln-${result.length}`}>{line}</div>);
        i++;
      }
    }
    return result;
  };

  const canSubmit = extDraft.trim().length >= 20;
  const handleSubmit = async () => {
    setExtAiLoading(true); setExtAiError(null);
    track("submit_ai_examine", { question_id: q.id, category: extCategory, board });
    logActivity("extended");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/examine.js", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ question: q.question, markScheme: q.markScheme, studentAnswer: extDraft, maxMarks: q.marks, levels: q.levels }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setExtAiResult(data);
      const covered = new Set((data.coveredPoints || []).map((c, i) => c ? i : -1).filter(i => i >= 0));
      setExtMarked(covered);
      setExtScore(s => ({ ...s, [q.id]: data.score }));
      setExtRevealed(true);
      logAttempt && logAttempt({ board, type: "extended", questionId: q.id, topic: q.category, topicLabel: q.category, score: data.score, maxScore: q.marks, correct: data.score >= Math.ceil(q.marks * 0.75) });
    } catch (err) {
      setExtAiError(err.message || "Could not reach AI Examiner");
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
  const goNext = () => { setExtIndex(i => i + 1); resetExt(); };
  const scoreTone = marksThisQ >= q.marks * 0.75 ? "green" : marksThisQ >= q.marks * 0.5 ? "amber" : "red";
  const scoreColour = scoreTone === "green" ? T.green : scoreTone === "amber" ? T.amber : T.red;

  const MarkPoint = ({ point, ticked, aiSaid, onClick, showMissed }) => (
    <button onClick={onClick} style={{ display: "flex", gap: 10, alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? T.greenTint : (showMissed ? T.redTint : T.card), border: `1px solid ${ticked ? "#BBF7D0" : (showMissed ? "#FECACA" : T.border)}`, borderRadius: T.radiusSm, padding: "10px 12px", cursor: "pointer", color: T.ink }}>
      <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: `2px solid ${ticked ? T.green : (showMissed ? T.red : T.faint)}`, background: ticked ? T.green : T.card, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
        {ticked && <Icon name="check" size={12} color="#fff" strokeWidth={3} />}
        {!ticked && showMissed && <Icon name="x" size={12} color={T.red} strokeWidth={3} />}
      </span>
      <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, lineHeight: 1.5, color: ticked ? T.green : (showMissed ? "#7F1D1D" : T.ink), fontWeight: ticked ? 600 : 400 }}>{point}</span>
        {aiSaid !== undefined && aiSaid !== ticked && <span style={{ fontSize: 11, color: T.muted }}>AI said {aiSaid ? "covered" : "missed"} · tap to override</span>}
      </span>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.line}`, flexWrap: "wrap" }}>
        <Button size="sm" icon="arrowLeft" onClick={() => { setExtQPicker(true); resetExt(); }}>Questions</Button>
        <span style={{ flex: 1, minWidth: 160, fontWeight: 600 }}>{extCategory}</span>
        <Chip tone="indigo">{q.marks} marks</Chip>
        <Chip tone="accent">Q{extIndex + 1} / {catQs.length}</Chip>
      </div>
      <div style={{ padding: "10px 20px 0" }}><Bar value={((extIndex + 1) / catQs.length) * 100} colour={T.accent} height={5} /></div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, maxWidth: 860 }}>
        <Card>
          <div style={{ fontSize: 15.5, lineHeight: 1.75, fontFamily: "Georgia, 'Times New Roman', serif" }}>{renderQuestionText(q.question)}</div>
        </Card>

        {!extRevealed && !extAiLoading && (
          <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Your answer</span>
              <span style={{ fontSize: 12, color: canSubmit ? T.green : T.muted, fontWeight: 600 }}>{canSubmit ? "Ready to submit" : `${Math.max(0, 20 - extDraft.trim().length)} more characters`}</span>
            </div>
            <textarea value={extDraft} onChange={e => setExtDraft(e.target.value)} rows={8} aria-label="Your answer"
              placeholder={`Write your full answer to this ${q.marks}-mark question. Cover every point you know; the AI Examiner marks it against the mark scheme.`}
              style={{ width: "100%", padding: "12px 14px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, outline: "none", color: T.ink, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button variant="primary" size="lg" icon="pencil" onClick={handleSubmit} disabled={!canSubmit}>Submit to AI Examiner</Button>
              <Button variant="ghost" onClick={() => setExtRevealed(true)}>Skip and self-mark</Button>
            </div>
          </Card>
        )}

        {extAiError && !extAiLoading && (
          <Notice tone="red">
            <div style={{ fontWeight: 700, marginBottom: 4 }}>AI Examiner unavailable</div>
            <div style={{ marginBottom: 10 }}>{extAiError === "API key not configured" ? "The API key has not been added to Vercel (ANTHROPIC_API_KEY)." : extAiError}</div>
            <Button size="sm" variant="danger" onClick={handleSubmit}>Try again</Button>
          </Notice>
        )}

        {extAiLoading && (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <style>{`@keyframes cmSpin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ width: 28, height: 28, border: `3px solid ${T.line}`, borderTopColor: T.accent, borderRadius: "50%", margin: "0 auto 12px", animation: "cmSpin 0.8s linear infinite" }} />
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Marking your answer…</div>
            <div style={{ fontSize: 12, color: T.muted }}>Checking it against the levels-of-response mark scheme</div>
          </Card>
        )}

        {extRevealed && (
          <>
            {extDraft.trim() && (
              <Card padding={16} style={{ background: "#FAFBFC" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Your answer</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{extDraft}</div>
              </Card>
            )}

            {extAiResult && (
              <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>AI Examiner</span>
                    {extAiResult.level !== undefined && <Chip tone={extAiResult.level >= 3 ? "green" : extAiResult.level >= 2 ? "amber" : "red"} style={{ alignSelf: "flex-start" }}>Level {extAiResult.level}</Chip>}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontFamily: T.display, fontSize: 36, fontWeight: 800, color: scoreColour, lineHeight: 1 }}>{marksThisQ}</span>
                    <span style={{ fontSize: 16, color: T.muted }}>/ {q.marks}</span>
                  </div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{extAiResult.feedback}</div>
              </Card>
            )}

            <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{extAiResult ? "Indicative content · tap to adjust" : "Indicative content · tick each point you covered"}</span>
              {q.markScheme.map((point, i) => (
                <MarkPoint key={i} point={point} ticked={extMarked.has(i)} aiSaid={extAiResult ? extAiResult.coveredPoints[i] : undefined} showMissed={!!extAiResult} onClick={() => toggleMark(i)} />
              ))}
              <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Marks: <b style={{ color: scoreColour }}>{marksThisQ} / {q.marks}</b></div>
            </Card>

            {extAiResult && (
              <Card padding={0}>
                <button onClick={() => setExtShowModel(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: 14, color: T.ink }}>
                  <span>Model answer</span>
                  <Icon name="chevronDown" size={16} color={T.faint} style={{ transform: extShowModel ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {extShowModel && <div style={{ padding: "0 18px 18px", fontSize: 14, lineHeight: 1.7, borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>{extAiResult.modelAnswer}</div>}
              </Card>
            )}

            {q.examTip && (
              <Notice tone="amber">
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Examiner tip</div>
                <div>{q.examTip}</div>
              </Notice>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!isLast
                ? <Button variant="primary" size="lg" iconRight="arrowRight" onClick={goNext}>Next question</Button>
                : <Button variant="primary" size="lg" onClick={() => { setExtCategory(null); setExtIndex(0); resetExt(); }}>Finish</Button>}
              <Button variant="ghost" onClick={resetExt}>Retry</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
