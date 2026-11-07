import React, { useState, useEffect, useRef, useMemo } from "react";
import { auth, fetchAssignment, startSubmission, saveItemResult, submitSubmission, sendMarkQuery } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, Chip, Button, Bar, Notice, EmptyState, Icon } from "../ui/components";
import McqQuestion from "./McqQuestion";
import { resolveItem, TYPE_LABEL, fmtDue } from "../utils/homeworkBank";

// ─── Attempt and hint rules, agreed with HSJ Tuition ─────────────────────
// - A part can be attempted up to MAX_ATTEMPTS times (MCQs twice: four options).
// - Hints unlock one at a time once the first attempt has been marked. They cost no marks,
//   but the number used is recorded and shown to the tutor.
// - The first attempt is the score that counts. The best score is kept alongside it.
// - The mark scheme, worked solution or model answer is only shown once the part is fully
//   correct, after every attempt and every hint has been used, or once the homework is submitted.
export const MAX_ATTEMPTS = { mcq: 2, calc: 3, short: 3, extended: 3 };
const COUNT_AS_CORRECT = 0.75;

export function hintsFor(q, type) {
  if (Array.isArray(q.hints) && q.hints.length) return q.hints;
  if (type === "calc") return [q.hint, q.steps?.length > 1 ? `First line of working: ${q.steps[0]}` : null].filter(Boolean);
  return [];
}

export const isRevealed = (r, hints, maxAttempts, submitted) =>
  submitted || (!!r && ((r.bestScore ?? r.score) >= r.maxScore
    || ((r.attempts?.length || 0) >= maxAttempts && (r.hintsUsed || 0) >= hints.length)));

/** Fold a newly marked attempt into the stored result for a part. */
function addAttempt(prev, maxScore, a) {
  const attempts = [...(prev?.attempts || []), { answer: a.answer, score: a.score, feedback: a.feedback || null, at: Date.now() }];
  const first = attempts[0].score;
  return {
    ...(prev || {}), ...a, maxScore, attempts,
    hintsUsed: prev?.hintsUsed || 0,
    score: first,
    bestScore: Math.max(...attempts.map(x => x.score)),
    correct: first >= Math.ceil(maxScore * COUNT_AS_CORRECT),
  };
}

// ─── Marking ─────────────────────────────────────────────────────────────
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

/** Mark one answer. Returns { answer, score, markedBy, confidence?, feedback?, detail? } */
async function mark(type, q, context, answer, maxScore, attemptNumber) {
  if (type === "mcq") return { answer, score: answer === q.answer ? maxScore : 0, markedBy: "auto" };
  if (type === "calc") return { answer, score: calcCorrect(q, answer) ? maxScore : 0, markedBy: "auto" };
  const levels = type === "extended";
  const ms = q.ms || q.markScheme || [];
  const data = await examine({
    mode: levels ? "levels" : "points", question: q.q || q.question, context, markScheme: ms,
    allow: q.allow, reject: q.reject, studentAnswer: answer, maxMarks: maxScore, levels: q.levels, attempt: attemptNumber,
  });
  return {
    answer, score: data.score, markedBy: "ai", confidence: data.confidence || "medium", feedback: data.feedback || null,
    detail: { level: data.level ?? null, modelAnswer: data.modelAnswer || null, points: ms.map((t, i) => ({ text: t, got: !!(data.awarded || data.coveredPoints)?.[i] })) },
  };
}

// ─── Small pieces ────────────────────────────────────────────────────────
const sub = (s) => <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{s}</span>;
const serif = { fontSize: 15.5, lineHeight: 1.75, fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "pre-line" };

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

function AttemptBanner({ result, maxAttempts }) {
  const attempts = result.attempts || [];
  const last = attempts[attempts.length - 1];
  if (!last) return null;
  const p = result.maxScore ? last.score / result.maxScore : 0;
  const tone = p >= 1 ? "green" : p >= 0.5 ? "amber" : "red";
  return (
    <Notice tone={tone} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, flexWrap: "wrap" }}>
        <Icon name={p >= 1 ? "check" : "x"} size={16} strokeWidth={3} />
        {last.score} / {result.maxScore} mark{result.maxScore === 1 ? "" : "s"}
        <span style={{ fontWeight: 500, color: T.muted, fontSize: 12 }}>Attempt {attempts.length} of {maxAttempts}</span>
        {result.markedBy === "ai" && result.confidence === "low" && <Chip tone="amber" style={{ fontSize: 11 }}>Your tutor will check this mark</Chip>}
      </div>
      {last.feedback && <div style={{ fontWeight: 400 }}>{last.feedback}</div>}
      {attempts.length > 1 && (
        <div style={{ fontSize: 12, color: T.muted }}>Your first attempt ({attempts[0].score} / {result.maxScore}) is the mark that counts for this homework. Best so far: {result.bestScore} / {result.maxScore}.</div>
      )}
    </Notice>
  );
}

function HintLadder({ hints, used, canOpen, onOpen }) {
  if (!hints.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {hints.slice(0, used).map((h, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: T.indigoTint, border: `1px solid #C7D2FE`, borderRadius: T.radiusSm, fontSize: 14, lineHeight: 1.6 }}>
          <Icon name="help" size={16} color={T.indigo} style={{ flexShrink: 0, marginTop: 3 }} />
          <span><b style={{ color: T.indigo }}>Hint {i + 1}.</b> {h}</span>
        </div>
      ))}
      {used < hints.length && canOpen && (
        <div>
          <Button size="sm" variant="secondary" icon="help" onClick={onOpen}>Show hint {used + 1} of {hints.length}</Button>
          <span style={{ fontSize: 12, color: T.muted, marginLeft: 10 }}>Hints do not cost marks. Have another go after reading one.</span>
        </div>
      )}
    </div>
  );
}

function QueryBox({ query, onSend, readOnly }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  if (query) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 14px", background: "#FAFBFC", border: `1px solid ${T.line}`, borderRadius: T.radiusSm, fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Chip tone={query.status === "resolved" ? "green" : "amber"} style={{ fontSize: 11 }}>{query.status === "resolved" ? "Tutor replied" : "Query sent to your tutor"}</Chip>
        </div>
        <div><span style={{ color: T.muted }}>You wrote: </span>{query.note}</div>
        {query.reply && <div><span style={{ color: T.muted }}>Tutor: </span>{query.reply}</div>}
      </div>
    );
  }
  if (readOnly) return null;
  if (!open) return <div><Button size="sm" variant="ghost" icon="message" onClick={() => setOpen(true)} style={{ color: T.muted }}>Query this mark</Button></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: "#FAFBFC", border: `1px solid ${T.line}`, borderRadius: T.radiusSm }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>Tell your tutor why you think this mark should be different</span>
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} aria-label="Your query" placeholder="e.g. I stated the conditions in my second sentence"
        style={{ width: "100%", padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", color: T.ink, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button size="sm" variant="primary" disabled={busy || note.trim().length < 5} onClick={async () => { setBusy(true); try { await onSend(note.trim()); } finally { setBusy(false); } }}>{busy ? "Sending…" : "Send to tutor"}</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── One markable part (an MCQ, a calculation, a short or extended answer) ──
function Part({ type, q, context, maxScore, result, readOnly, submitted, onRecord, query, onQuery, showQuestion }) {
  const hints = useMemo(() => hintsFor(q, type), [q, type]);
  const maxAttempts = MAX_ATTEMPTS[type] || 3;
  const attempts = result?.attempts || [];
  const last = attempts[attempts.length - 1];
  const revealed = isRevealed(result, hints, maxAttempts, submitted);
  const canAttempt = !readOnly && !revealed && attempts.length < maxAttempts;
  const exhausted = !revealed && attempts.length >= maxAttempts;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState(last?.answer ?? "");
  const [selected, setSelected] = useState(null);
  const [showModel, setShowModel] = useState(false);

  const attempt = async (answer) => {
    setBusy(true); setError(null);
    try {
      const a = await mark(type, q, context, answer, maxScore, attempts.length + 1);
      onRecord(addAttempt(result, maxScore, a), "attempt");
    } catch (e) { setError(e.message); }
    setBusy(false);
  };
  const openHint = () => onRecord({ ...result, hintsUsed: (result.hintsUsed || 0) + 1 }, "hint");

  const written = type === "short" || type === "extended";
  const label = type === "mcq" ? "Mark" : type === "calc" ? "Mark" : "AI mark";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {type === "mcq" && (
        <McqQuestion question={q} selected={revealed || !canAttempt ? last?.answer ?? null : selected} revealed={revealed} locked={!canAttempt}
          wrongLetters={attempts.filter(a => a.score < maxScore).map(a => a.answer)} hideQuestion={!showQuestion}
          accentColor={T.ink} onSelect={setSelected} onCheck={() => selected && attempt(selected)} onNext={() => {}} isLast hideNext checkLabel={busy ? "Marking…" : `${label}${attempts.length ? " again" : ""}`} />
      )}

      {type === "calc" && canAttempt && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input type={q.isText ? "text" : "number"} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input !== "" && !busy && attempt(input)}
            placeholder={q.isText ? "e.g. C2H4" : "Your answer"} aria-label="Your answer"
            style={{ width: 200, padding: "11px 14px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 16, outline: "none", color: T.ink }} />
          {q.unit && <span style={{ fontSize: 14, color: T.muted, fontWeight: 600 }}>{q.unit}</span>}
          <Button variant="primary" onClick={() => attempt(input)} disabled={busy || input === ""}>{label}{attempts.length ? " again" : ""}</Button>
        </div>
      )}

      {written && canAttempt && (
        <>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={type === "extended" ? 8 : 4} aria-label="Your answer" placeholder={`Write your answer (${maxScore} marks)`}
            style={{ width: "100%", padding: "12px 14px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, outline: "none", color: T.ink, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="primary" icon="pencil" onClick={() => attempt(input)} disabled={busy || String(input).trim().length < 10 || (last && String(input).trim() === String(last.answer).trim())}>{busy ? "Marking…" : `${label}${attempts.length ? " again" : ""}`}</Button>
            {busy && <span style={{ fontSize: 12, color: T.muted }}>Marking against the mark scheme…</span>}
            {!busy && attempts.length > 0 && <span style={{ fontSize: 12, color: T.muted }}>Edit your answer above, then mark it again.</span>}
          </div>
        </>
      )}

      {type !== "mcq" && last && !canAttempt && (
        <div style={{ fontSize: 13 }}><span style={{ color: T.muted }}>Your answer: </span><b style={{ whiteSpace: "pre-wrap" }}>{String(last.answer)}{q.unit ? ` ${q.unit}` : ""}</b></div>
      )}
      {type !== "mcq" && !last && readOnly && <span style={{ fontSize: 13, color: T.muted }}>Not answered.</span>}

      {error && <Notice tone="red">{error}</Notice>}
      {result && <AttemptBanner result={result} maxAttempts={maxAttempts} />}

      {last && <HintLadder hints={hints} used={result.hintsUsed || 0} canOpen={!readOnly && !revealed} onOpen={openHint} />}
      {exhausted && (result.hintsUsed || 0) < hints.length && !readOnly && (
        <span style={{ fontSize: 12, color: T.muted }}>You have used all {maxAttempts} attempts. Open the remaining hint{hints.length - (result.hintsUsed || 0) === 1 ? "" : "s"} to see the mark scheme.</span>
      )}

      {revealed && last && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6 }}>
          {type === "calc" && (
            <>
              <div style={{ fontSize: 13 }}>{sub("Answer")} <b style={{ marginLeft: 8 }}>{q.answer}{q.unit ? ` ${q.unit}` : ""}</b>{q.tolerance ? <span style={{ color: T.muted }}> (accept ±{q.tolerance})</span> : null}</div>
              <Steps steps={q.steps} />
            </>
          )}
          {written && (
            <>
              {result.detail?.points?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sub("Mark scheme")}
                  {result.detail.points.map((pt, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: pt.got ? T.green : "#7F1D1D" }}>
                      <Icon name={pt.got ? "check" : "x"} size={14} strokeWidth={3} style={{ marginTop: 3 }} /><span>{pt.text}</span>
                    </div>
                  ))}
                  {(q.allow?.length || q.reject?.length) ? (
                    <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                      {q.allow?.length ? <div><b>Allow:</b> {q.allow.join("; ")}</div> : null}
                      {q.reject?.length ? <div><b>Reject:</b> {q.reject.join("; ")}</div> : null}
                    </div>
                  ) : null}
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
        </div>
      )}

      {last && <QueryBox query={query} readOnly={!onQuery} onSend={onQuery} />}
    </div>
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
  const queries = subm?.queries || {};
  const submitted = !!subm?.submittedAt;
  const timeSpent = () => baseTime.current + (Date.now() - openedAt.current);
  const total = (ans) => (a?.items || []).reduce((x, it) => x + (ans[it.key]?.score || 0), 0);

  /** kind: "attempt" | "hint" for single parts; "part" | "first" | "hint" for exam items */
  const record = async (item, result, kind) => {
    const next = { ...answers, [item.key]: { ...result, maxScore: item.marks } };
    const totals = { totalScore: total(next), timeSpentMs: timeSpent() };
    setSubm(s => ({ ...s, answers: next, totalScore: totals.totalScore }));
    try { await saveItemResult(a.id, authUser.uid, item.key, next[item.key], totals); } catch (e) { setError("Could not save: " + e.message); }
    const isFirst = item.type === "exam" ? kind === "first" : (kind === "attempt" && (result.attempts?.length || 0) === 1);
    if (isFirst && logAttempt) logAttempt({
      board, type: item.type, questionId: item.questionId, topic: item.topic, topicLabel: item.topicLabel,
      difficulty: item.difficulty || null, score: result.score, maxScore: item.marks, correct: result.score >= Math.ceil(item.marks * COUNT_AS_CORRECT), mode: "homework", assignmentId: a.id,
    });
  };

  const query = async (key, note) => {
    const q = { note, at: Date.now(), status: "open", reply: null };
    setSubm(s => ({ ...s, queries: { ...(s.queries || {}), [key]: q } }));
    try { await sendMarkQuery(a.id, authUser.uid, key, note); } catch (e) { setError("Could not send your query: " + e.message); }
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

  if (error && !a) return <Notice tone="red">{error}</Notice>;
  if (!a || !subm) return <div style={{ color: T.muted, fontSize: 13, padding: 20 }}>Loading homework…</div>;

  const readOnly = submitted;
  const pctScore = subm.maxScore ? Math.round((total(answers) / subm.maxScore) * 100) : 0;
  const openQueries = Object.values(queries).filter(q => q.status === "open").length;
  const replies = Object.values(queries).filter(q => q.status === "resolved").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <Notice tone="red">{error}</Notice>}
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
            <div style={{ fontWeight: 700 }}>{total(answers)} out of {subm.maxScore} marks (first attempts)</div>
            <div style={{ fontSize: 13, color: T.muted }}>Every mark scheme, worked solution and model answer is now open. Tap a question on the left to see it. If you think a mark is wrong, use "Query this mark" and your tutor will check it.</div>
          </div>
          {(openQueries > 0 || replies > 0) && <Chip tone={replies ? "green" : "amber"}>{replies ? `${replies} tutor repl${replies === 1 ? "y" : "ies"}` : ""}{replies && openQueries ? " · " : ""}{openQueries ? `${openQueries} quer${openQueries === 1 ? "y" : "ies"} waiting` : ""}</Chip>}
        </Card>
      )}

      {!submitted && answeredCount === 0 && (
        <Notice tone="neutral" style={{ fontSize: 13 }}>
          <b>How marking works.</b> Press <b>Mark</b> or <b>AI mark</b> to have each answer marked straight away. You get up to three attempts (two for multiple choice), and after your first attempt you can open hints one at a time. Hints are free, but your first attempt is the mark that counts. The mark scheme opens once you get full marks, or once you have used every attempt and hint.
        </Notice>
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
                    const good = r && r.score >= Math.ceil(it.marks * COUNT_AS_CORRECT);
                    const bg = current ? T.ink : r ? (good ? T.greenTint : r.score > 0 ? T.amberTint : T.redTint) : T.card;
                    const fg = current ? "#fff" : r ? (good ? T.green : r.score > 0 ? T.amber : T.red) : T.muted;
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
                <Part type="mcq" q={res.q} maxScore={item.marks} result={answers[item.key]} readOnly={readOnly} submitted={submitted} showQuestion
                  onRecord={(r, kind) => record(item, r, kind)} query={queries[item.key]} onQuery={(note) => query(item.key, note)} />
              )}

              {item.type === "calc" && (
                <>
                  <div style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 500, whiteSpace: "pre-line", fontFamily: T.display }}>{res.q.q}</div>
                  {res.q.dataTable && <DataTable rows={res.q.dataTable} />}
                  {res.q.diagram && <div style={{ maxWidth: 700 }}>{res.q.diagram}</div>}
                  <Part type="calc" q={res.q} maxScore={item.marks} result={answers[item.key]} readOnly={readOnly} submitted={submitted}
                    onRecord={(r, kind) => record(item, r, kind)} query={queries[item.key]} onQuery={(note) => query(item.key, note)} />
                </>
              )}

              {item.type === "extended" && (
                <>
                  <div style={serif}>{res.q.question}</div>
                  <Part type="extended" q={res.q} maxScore={item.marks} result={answers[item.key]} readOnly={readOnly} submitted={submitted}
                    onRecord={(r, kind) => record(item, r, kind)} query={queries[item.key]} onQuery={(note) => query(item.key, note)} />
                </>
              )}

              {item.type === "exam" && (
                <ExamItem q={res.q} item={item} result={answers[item.key]} readOnly={readOnly} submitted={submitted}
                  onRecord={(r, kind) => record(item, r, kind)} queries={queries} onQuery={query} />
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

// ─── Multi-part exam question: each part attempted and marked on its own ──
export const partQueryKey = (itemKey, label) => `${itemKey}__${label}`;

function ExamItem({ q, item, result, readOnly, submitted, onRecord, queries, onQuery }) {
  const parts = result?.detail?.parts || {};
  const partMax = (p) => p.marks || 1;
  const save = (label, partResult, kind) => {
    const nextParts = { ...parts, [label]: partResult };
    const sum = (f) => q.parts.reduce((x, p) => x + (f(nextParts[p.label]) || 0), 0);
    const score = sum(r => r?.score);
    const allDone = q.parts.every(p => nextParts[p.label]?.attempts?.length);
    const wasDone = !!result?.detail?.complete;
    const results = Object.values(nextParts);
    onRecord({
      answer: `${results.length}/${q.parts.length} parts`, score, bestScore: sum(r => r?.bestScore),
      hintsUsed: sum(r => r?.hintsUsed),
      correct: allDone && score >= Math.ceil(item.marks * COUNT_AS_CORRECT),
      markedBy: results.some(r => r.markedBy === "ai") ? "ai" : "auto",
      confidence: results.some(r => r.confidence === "low") ? "low" : "high",
      detail: { parts: nextParts, complete: allDone },
    }, kind === "attempt" && allDone && !wasDone ? "first" : kind === "hint" ? "hint" : "part");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {q.context && <div style={serif}>{q.context}</div>}
      {q.dataTable && <DataTable rows={q.dataTable} />}
      {q.parts.map(p => {
        const key = partQueryKey(item.key, p.label);
        return (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontWeight: 700, minWidth: 28 }}>({p.label})</span>
              <div style={{ flex: 1, ...serif, fontSize: 15.5, lineHeight: 1.7 }}>{p.q}</div>
              <Chip tone="neutral">{partMax(p)} mark{partMax(p) === 1 ? "" : "s"}</Chip>
            </div>
            <Part type={p.type} q={p} context={q.context} maxScore={partMax(p)} result={parts[p.label]} readOnly={readOnly} submitted={submitted}
              onRecord={(r, kind) => save(p.label, r, kind)} query={queries[key]} onQuery={(note) => onQuery(key, note)} />
          </div>
        );
      })}
    </div>
  );
}
