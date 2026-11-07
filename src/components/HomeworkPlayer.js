import React, { useState, useEffect, useRef, useMemo } from "react";
import { auth, fetchAssignment, startSubmission, saveItemResult, submitSubmission } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, Chip, Button, Bar, Notice, EmptyState, Icon } from "../ui/components";
import McqQuestion from "./McqQuestion";
import { resolveItem, TYPE_LABEL, fmtDue } from "../utils/homeworkBank";

// ─── Marking helpers ─────────────────────────────────────────────────────
const calcCorrect = (q, input) => q.isText
  ? String(input).trim().toUpperCase().replace(/\s/g, "") === String(q.answer).toUpperCase().replace(/\s/g, "")
  : Math.abs(parseFloat(input) - q.answer) <= (q.tolerance ?? 0);

async function examine(payload) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/examine.js", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Marking failed");
  return data;
}

const sub = (s) => <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{s}</span>;

function DataTable({ rows }) {
  if (!rows) return null;
  return (
    <table style={{ borderCollapse: "collapse", fontSize: 14, margin: "4px 0" }}>
      <tbody>{rows.map((row, ri) => (
        <tr key={ri} style={{ background: ri % 2 === 0 ? "#FAFBFC" : T.card }}>
          <td style={{ padding: "8px 18px 8px 10px", fontWeight: 600, borderBottom: `1px solid ${T.line}` }}>{row[0]}</td>
          <td style={{ padding: "8px 10px", fontWeight: 700, color: T.accentText, borderBottom: `1px solid ${T.line}`, whiteSpace: "nowrap" }}>{row[1]}{typeof row[1] === "number" ? " kJ mol⁻¹" : ""}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

function Steps({ steps }) {
  if (!steps?.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sub("Worked solution")}
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.accentText, background: T.accentTint, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
          <span style={{ fontSize: 18, lineHeight: 1.5, fontFamily: "'Caveat', cursive", fontWeight: 600 }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function ResultBanner({ score, max, feedback, confidence }) {
  const p = max ? score / max : 0;
  const tone = p >= 0.75 ? "green" : p >= 0.5 ? "amber" : "red";
  return (
    <Notice tone={tone} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14 }}>
        <Icon name={p >= 0.75 ? "check" : "x"} size={16} strokeWidth={3} />
        {score} / {max} mark{max === 1 ? "" : "s"}
        {confidence === "low" && <Chip tone="amber" style={{ fontSize: 11 }}>Your tutor will check this mark</Chip>}
      </div>
      {feedback && <div style={{ fontWeight: 400 }}>{feedback}</div>}
    </Notice>
  );
}

// ─── Single-answer parts: calc, short, extended ──────────────────────────
function CalcPart({ q, result, onCheck, readOnly }) {
  const [input, setInput] = useState(result?.answer ?? "");
  const done = !!result;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {!done && !readOnly && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input type={q.isText ? "text" : "number"} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input !== "" && onCheck(input)}
            placeholder={q.isText ? "e.g. C2H4" : "Your answer"} aria-label="Your answer"
            style={{ width: 200, padding: "11px 14px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 16, outline: "none", color: T.ink }} />
          {q.unit && <span style={{ fontSize: 14, color: T.muted, fontWeight: 600 }}>{q.unit}</span>}
          <Button variant="primary" onClick={() => onCheck(input)} disabled={input === ""}>Check</Button>
        </div>
      )}
      {done && (
        <>
          <div style={{ fontSize: 13 }}><span style={{ color: T.muted }}>Your answer: </span><b>{String(result.answer)}{q.unit ? ` ${q.unit}` : ""}</b>{!result.correct && <span style={{ color: T.muted }}> · correct answer {q.answer}{q.unit ? ` ${q.unit}` : ""}</span>}</div>
          <ResultBanner score={result.score} max={result.maxScore} />
          <Steps steps={q.steps} />
        </>
      )}
      {!done && readOnly && <span style={{ fontSize: 13, color: T.muted }}>Not answered.</span>}
    </div>
  );
}

function WrittenPart({ q, marks, result, onSubmit, readOnly, mode }) {
  const [draft, setDraft] = useState(result?.answer ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const done = !!result;
  const send = async () => {
    setBusy(true); setError(null);
    try { await onSubmit(draft); } catch (e) { setError(e.message); }
    setBusy(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {!done && !readOnly && (
        <>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={mode === "levels" ? 8 : 4} aria-label="Your answer" placeholder={`Write your answer (${marks} marks)`}
            style={{ width: "100%", padding: "12px 14px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, outline: "none", color: T.ink, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="primary" icon="pencil" onClick={send} disabled={busy || draft.trim().length < 10}>{busy ? "Marking…" : "Submit answer"}</Button>
            {busy && <span style={{ fontSize: 12, color: T.muted }}>Marking against the mark scheme…</span>}
          </div>
          {error && <Notice tone="red">{error} <Button size="sm" variant="danger" onClick={send} style={{ marginLeft: 8 }}>Try again</Button></Notice>}
        </>
      )}
      {done && (
        <>
          <Card padding={14} style={{ background: "#FAFBFC" }}>{sub("Your answer")}<div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", marginTop: 4 }}>{result.answer}</div></Card>
          <ResultBanner score={result.score} max={result.maxScore} feedback={result.feedback} confidence={result.confidence} />
          {result.detail?.points && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sub("Mark scheme")}
              {result.detail.points.map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: pt.got ? T.green : "#7F1D1D" }}>
                  <Icon name={pt.got ? "check" : "x"} size={14} strokeWidth={3} style={{ marginTop: 3 }} /><span>{pt.text}</span>
                </div>
              ))}
            </div>
          )}
          {result.detail?.modelAnswer && (
            <div>
              <Button size="sm" variant="secondary" iconRight="chevronDown" onClick={() => setShowModel(v => !v)}>{showModel ? "Hide model answer" : "Model answer"}</Button>
              {showModel && <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>{result.detail.modelAnswer}</div>}
            </div>
          )}
        </>
      )}
      {!done && readOnly && <span style={{ fontSize: 13, color: T.muted }}>Not answered.</span>}
    </div>
  );
}

function McqPart({ q, result, onCheck, readOnly }) {
  const [selected, setSelected] = useState(result?.answer ?? null);
  const revealed = !!result || readOnly;
  return (
    <McqQuestion question={q} selected={selected} revealed={revealed} accentColor={T.ink}
      onSelect={setSelected} onCheck={() => onCheck(selected)} onNext={() => {}} isLast={true} hideNext />
  );
}

// ─── The player ──────────────────────────────────────────────────────────
export default function HomeworkPlayer({ board, authUser, userProfile, assignmentId, logAttempt, onExit }) {
  const [a, setA] = useState(null);
  const [subm, setSubm] = useState(null);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const openedAt = useRef(Date.now());
  const baseTime = useRef(0);

  useEffect(() => {
    if (!authUser || !assignmentId) return;
    let cancelled = false;
    (async () => {
      try {
        const asg = await fetchAssignment(assignmentId);
        if (!asg) { setError("This homework no longer exists."); return; }
        const s = await startSubmission(authUser, userProfile, asg);
        if (cancelled) return;
        setA(asg); setSubm(s); baseTime.current = s.timeSpentMs || 0; openedAt.current = Date.now();
        const firstUnanswered = asg.items.findIndex(it => !s.answers?.[it.key]);
        setIdx(firstUnanswered === -1 ? 0 : firstUnanswered);
      } catch (e) { if (!cancelled) setError(e.message); }
    })();
    return () => { cancelled = true; };
  }, [authUser, userProfile, assignmentId]);

  const answers = subm?.answers || {};
  const submitted = !!subm?.submittedAt;
  const timeSpent = () => baseTime.current + (Date.now() - openedAt.current);
  const total = (ans) => (a?.items || []).reduce((x, it) => x + (ans[it.key]?.score || 0), 0);

  const record = async (item, result) => {
    const next = { ...answers, [item.key]: { ...result, maxScore: item.marks } };
    const totals = { totalScore: total(next), timeSpentMs: timeSpent() };
    setSubm(s => ({ ...s, answers: next, totalScore: totals.totalScore }));
    try { await saveItemResult(a.id, authUser.uid, item.key, { ...result, maxScore: item.marks }, totals); } catch (e) { setError("Could not save: " + e.message); }
    logAttempt && logAttempt({
      board, type: item.type === "exam" ? "exam" : item.type, questionId: item.questionId, topic: item.topic, topicLabel: item.topicLabel,
      difficulty: item.difficulty || null, score: result.score, maxScore: item.marks, correct: result.score >= Math.ceil(item.marks * 0.75), mode: "homework", assignmentId: a.id,
    });
  };

  const handleSubmit = async () => {
    const unanswered = a.items.filter(it => !answers[it.key]).length;
    if (unanswered > 0 && !window.confirm(`${unanswered} question${unanswered === 1 ? "" : "s"} not answered. Submit anyway?`)) return;
    setSubmitting(true);
    try {
      await submitSubmission(a.id, authUser.uid, { totalScore: total(answers), timeSpentMs: timeSpent() });
      setSubm(s => ({ ...s, submittedAt: Date.now(), submittedClientTime: Date.now() }));
      setIdx(0);
    } catch (e) { setError(e.message); }
    setSubmitting(false);
  };

  const items = a?.items || [];
  const item = items[idx];
  const res = useMemo(() => item ? resolveItem(item) : null, [item]);
  const answeredCount = items.filter(it => answers[it.key]).length;

  if (error) return <Notice tone="red">{error}</Notice>;
  if (!a || !subm) return <div style={{ color: T.muted, fontSize: 13, padding: 20 }}>Loading homework…</div>;

  const readOnly = submitted;
  const pctScore = subm.maxScore ? Math.round((total(answers) / subm.maxScore) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Progress strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10 }}>
          <Bar value={(answeredCount / Math.max(1, items.length)) * 100} colour={T.accent} style={{ flex: 1 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.body, whiteSpace: "nowrap" }}>{answeredCount} of {items.length} answered</span>
        </div>
        <Chip tone="neutral"><Icon name="clock" size={13} />{Math.round(timeSpent() / 60000)} min · {a.minutes} min guide</Chip>
        {submitted
          ? <Chip tone={pctScore >= 75 ? "green" : pctScore >= 50 ? "amber" : "red"}>Marked · {total(answers)} / {subm.maxScore} · {pctScore}%</Chip>
          : <Chip tone="amber">Due {fmtDue(a.dueAt)}</Chip>}
        {!submitted && <Button variant="primary" onClick={handleSubmit} disabled={submitting || answeredCount === 0}>{submitting ? "Submitting…" : "Submit homework"}</Button>}
        <Button variant="secondary" onClick={onExit}>{submitted ? "Back to homework" : "Save and exit"}</Button>
      </div>

      {submitted && (
        <Card style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontFamily: T.display, fontSize: 40, fontWeight: 800, color: pctColour(pctScore), lineHeight: 1 }}>{pctScore}%</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700 }}>{total(answers)} out of {subm.maxScore} marks</div>
            <div style={{ fontSize: 13, color: T.muted }}>Tap any question on the left to see the feedback, worked solution or model answer. Your tutor may adjust AI marks.</div>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Question map */}
        <nav aria-label="Questions" style={{ flex: "1 1 200px", maxWidth: 240, background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {["mcq", "calc", "exam", "extended"].map(type => {
            const group = items.map((it, i) => ({ it, i })).filter(x => x.it.type === type);
            if (group.length === 0) return null;
            return (
              <div key={type} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sub(`${TYPE_LABEL[type]}s`)}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 5 }}>
                  {group.map(({ it, i }) => {
                    const r = answers[it.key];
                    const current = i === idx;
                    const bg = current ? T.ink : r ? (r.score >= Math.ceil(it.marks * 0.75) ? T.greenTint : r.score > 0 ? T.amberTint : T.redTint) : T.card;
                    const fg = current ? "#fff" : r ? (r.score >= Math.ceil(it.marks * 0.75) ? T.green : r.score > 0 ? T.amber : T.red) : T.muted;
                    return <button key={it.key} onClick={() => setIdx(i)} aria-label={`Question ${i + 1}`} style={{ height: 34, borderRadius: 8, border: current || r ? "none" : `1px solid ${T.border}`, background: bg, color: fg, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{i + 1}</button>;
                  })}
                </div>
              </div>
            );
          })}
          {a.note && <Notice tone="amber" style={{ fontSize: 12 }}><b>Tutor note:</b> {a.note}</Notice>}
        </nav>

        {/* Question */}
        <section style={{ flex: "999 1 480px", minWidth: 0 }}>
          {!item && <Card padding={0}><EmptyState icon="checkSquare" title="No questions in this homework" /></Card>}
          {item && !res && <Card padding={0}><EmptyState icon="help" title="This question is no longer in the bank" body="Skip it; it will not count against you." /></Card>}
          {item && res && (
            <Card key={item.key} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20 }}>Question {idx + 1}</span>
                <Chip tone={item.type === "mcq" ? "red" : item.type === "calc" ? "accent" : item.type === "exam" ? "amber" : "indigo"}>{TYPE_LABEL[item.type]} · {item.marks} mark{item.marks === 1 ? "" : "s"}</Chip>
                <Chip tone="neutral">{item.topicLabel}</Chip>
                {item.difficulty && <Chip tone="neutral">{item.difficulty}</Chip>}
              </div>

              {item.type === "mcq" && (
                <McqPart q={res.q} result={answers[item.key]} readOnly={readOnly}
                  onCheck={(sel) => record(item, { answer: sel, correct: sel === res.q.answer, score: sel === res.q.answer ? 1 : 0, markedBy: "auto" })} />
              )}

              {item.type === "calc" && (
                <>
                  <div style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 500, whiteSpace: "pre-line", fontFamily: T.display }}>{res.q.q}</div>
                  {res.q.dataTable && <DataTable rows={res.q.dataTable} />}
                  {res.q.diagram && <div style={{ maxWidth: 700 }}>{res.q.diagram}</div>}
                  <CalcPart q={res.q} result={answers[item.key]} readOnly={readOnly}
                    onCheck={(input) => { const ok = calcCorrect(res.q, input); record(item, { answer: input, correct: ok, score: ok ? item.marks : 0, markedBy: "auto" }); }} />
                </>
              )}

              {item.type === "extended" && (
                <>
                  <div style={{ fontSize: 15.5, lineHeight: 1.75, fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "pre-line" }}>{res.q.question}</div>
                  <WrittenPart q={res.q} marks={item.marks} mode="levels" result={answers[item.key]} readOnly={readOnly}
                    onSubmit={async (text) => {
                      const data = await examine({ mode: "levels", question: res.q.question, markScheme: res.q.markScheme, studentAnswer: text, maxMarks: item.marks, levels: res.q.levels });
                      await record(item, { answer: text, correct: data.score >= Math.ceil(item.marks * 0.75), score: data.score, markedBy: "ai", confidence: data.confidence, feedback: data.feedback,
                        detail: { level: data.level, modelAnswer: data.modelAnswer, points: res.q.markScheme.map((text2, i) => ({ text: text2, got: !!data.coveredPoints?.[i] })) } });
                    }} />
                </>
              )}

              {item.type === "exam" && (
                <ExamItem q={res.q} item={item} result={answers[item.key]} readOnly={readOnly} onRecord={(r) => record(item, r)} />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.line}` }}>
                <Button variant="secondary" icon="arrowLeft" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>Previous</Button>
                <Button variant="secondary" iconRight="arrowRight" onClick={() => setIdx(i => Math.min(items.length - 1, i + 1))} disabled={idx >= items.length - 1}>Next</Button>
              </div>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

// ─── Multi-part exam question: each part marked on its own ───────────────
function ExamItem({ q, item, result, readOnly, onRecord }) {
  const parts = result?.detail?.parts || {};
  const partMax = (p) => p.marks || 1;
  const save = (label, partResult) => {
    const nextParts = { ...parts, [label]: partResult };
    const score = q.parts.reduce((x, p) => x + (nextParts[p.label]?.score || 0), 0);
    const allDone = q.parts.every(p => nextParts[p.label]);
    const anyLow = Object.values(nextParts).some(r => r.confidence === "low");
    onRecord({ answer: `${Object.keys(nextParts).length}/${q.parts.length} parts`, score, correct: allDone && score >= Math.ceil(item.marks * 0.75), markedBy: Object.values(nextParts).some(r => r.markedBy === "ai") ? "ai" : "auto", confidence: anyLow ? "low" : "high", detail: { parts: nextParts, complete: allDone } });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {q.context && <div style={{ fontSize: 15.5, lineHeight: 1.75, fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "pre-line" }}>{q.context}</div>}
      {q.dataTable && <DataTable rows={q.dataTable} />}
      {q.parts.map(p => {
        const r = parts[p.label];
        const key = `${item.key}_${p.label}`;
        return (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontWeight: 700, minWidth: 28 }}>({p.label})</span>
              <div style={{ flex: 1, fontSize: 15.5, lineHeight: 1.7, fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "pre-line" }}>{p.q}</div>
              <Chip tone="neutral">{partMax(p)} mark{partMax(p) === 1 ? "" : "s"}</Chip>
            </div>
            {p.type === "mcq" && <McqPart q={p} result={r} readOnly={readOnly} onCheck={(sel) => save(p.label, { answer: sel, score: sel === p.answer ? partMax(p) : 0, maxScore: partMax(p), markedBy: "auto" })} />}
            {p.type === "calc" && <CalcPart q={p} result={r} readOnly={readOnly} onCheck={(input) => { const ok = calcCorrect(p, input); save(p.label, { answer: input, correct: ok, score: ok ? partMax(p) : 0, maxScore: partMax(p), markedBy: "auto" }); }} />}
            {(p.type === "short" || p.type === "extended") && (
              <WrittenPart q={p} marks={partMax(p)} mode={p.type === "extended" ? "levels" : "points"} result={r} readOnly={readOnly}
                onSubmit={async (text) => {
                  const data = await examine({ mode: p.type === "extended" ? "levels" : "points", question: p.q, context: q.context, markScheme: p.ms, allow: p.allow, reject: p.reject, studentAnswer: text, maxMarks: partMax(p), levels: p.levels });
                  save(p.label, { answer: text, score: data.score, maxScore: partMax(p), markedBy: "ai", confidence: data.confidence, feedback: data.feedback,
                    detail: { modelAnswer: data.modelAnswer, points: (p.ms || []).map((t, i) => ({ text: t, got: !!(data.awarded || data.coveredPoints)?.[i] })) } });
                }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
