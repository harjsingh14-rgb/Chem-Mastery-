import React, { useState, useEffect, useRef, useMemo } from "react";
import { auth, fetchAssignment, startSubmission, saveItemResult, submitSubmission, sendMarkQuery, notifyTutor } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, Chip, Button, Bar, Notice, EmptyState, Icon } from "../ui/components";
import McqQuestion from "./McqQuestion";
import PastPaperQuestion from "./ppq/PastPaperQuestion";
import { partKey } from "./ppq/ppqUtils";
import { resolveItem, TYPE_LABEL, fmtDue } from "../utils/homeworkBank";
import chemFormat from "../utils/chemFormat";
import ErrorLogPrompt from "./ErrorLogPrompt";

// ─── Attempt and hint rules, agreed with HSJ Tuition ─────────────────────
// - A part can be attempted up to MAX_ATTEMPTS times (MCQs twice: four options).
// - Hints unlock one at a time once the first attempt has been marked. They cost no marks,
//   but the number used is recorded and shown to the tutor.
// - The first attempt is the score that counts. The best score is kept alongside it.
// - The mark scheme, worked solution or model answer is only shown once the part is fully
//   correct, after every attempt and every hint has been used, or once the homework is submitted.
// - A past-paper question (marked by the AI examiner against the real scheme) can be marked twice.
export const MAX_ATTEMPTS = { mcq: 2, calc: 3, short: 3, extended: 3, ppq: 2 };
const COUNT_AS_CORRECT = 0.75;
// Where a homework question from the HSJ banks can be retested under Revision
const REVISION_TAB = { mcq: "mcq", calc: "calc", extended: "extended", exam: "exam" };

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
  const attempts = [...(prev?.attempts || []), { answer: a.answer, score: a.score, feedback: a.feedback || null, errorType: a.errorType || null, errorNote: a.errorNote || null, at: Date.now() }];
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
    errorType: data.errorType || null, errorNote: data.errorNote || null,
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
          <td style={{ padding: "8px 18px 8px 10px", fontWeight: 600, borderBottom: `1px solid ${T.line}` }}>{chemFormat(row[0])}</td>
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
          <span style={{ fontSize: 18, lineHeight: 1.5, fontFamily: "'Caveat', cursive", fontWeight: 600 }}>{chemFormat(s)}</span>
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
  const outOf = (n) => `${n} / ${result.maxScore}`;
  return (
    <Notice tone={tone} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, flexWrap: "wrap" }}>
        <Icon name={p >= 1 ? "check" : "x"} size={16} strokeWidth={3} />
        {outOf(last.score)} mark{result.maxScore === 1 ? "" : "s"}
        <span style={{ fontWeight: 500, color: T.muted, fontSize: 12 }}>Attempt {attempts.length} of {maxAttempts}</span>
        {result.markedBy === "ai" && result.confidence === "low" && <Chip tone="amber" style={{ fontSize: 11 }}>Your tutor will check this mark</Chip>}
      </div>
      {last.feedback && <div style={{ fontWeight: 400 }}>{last.feedback}</div>}
      {attempts.length > 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 6, marginTop: 2 }}>
          {attempts.map((at, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap", minWidth: 68 }}>Attempt {i + 1}</span>
              <span style={{ flex: 1, whiteSpace: "pre-wrap", color: T.body, minWidth: 0 }}>{String(at.answer)}</span>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{outOf(at.score)}</span>
            </div>
          ))}
          <div style={{ color: T.muted }}>Your first attempt ({outOf(attempts[0].score)}) is the mark that counts for this homework. Best so far: {outOf(result.bestScore)}.</div>
        </div>
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
          <span><b style={{ color: T.indigo }}>Hint {i + 1}.</b> {chemFormat(h)}</span>
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
function Part({ type, q, context, maxScore, result, readOnly, submitted, onRecord, query, onQuery, showQuestion, log }) {
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
          {q.unit && <span style={{ fontSize: 14, color: T.muted, fontWeight: 600 }}>{chemFormat(q.unit)}</span>}
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
        <div style={{ fontSize: 13 }}><span style={{ color: T.muted }}>Your answer: </span><b style={{ whiteSpace: "pre-wrap" }}>{String(last.answer)}{q.unit ? <> {chemFormat(q.unit)}</> : null}</b></div>
      )}
      {type !== "mcq" && !last && readOnly && <span style={{ fontSize: 13, color: T.muted }}>Not answered.</span>}

      {error && <Notice tone="red">{error}</Notice>}
      {result && <AttemptBanner result={result} maxAttempts={maxAttempts} />}
      {last && log && <ErrorLogPrompt authUser={log.authUser} userProfile={log.userProfile} entry={{ ...log.entry, type }} suggested={last.errorType || null} note={last.errorNote || null} lost={maxScore - last.score} maxMarks={maxScore} />}

      {last && <HintLadder hints={hints} used={result.hintsUsed || 0} canOpen={!readOnly && !revealed} onOpen={openHint} />}
      {exhausted && (result.hintsUsed || 0) < hints.length && !readOnly && (
        <span style={{ fontSize: 12, color: T.muted }}>You have used all {maxAttempts} attempts. Open the remaining hint{hints.length - (result.hintsUsed || 0) === 1 ? "" : "s"} to see the mark scheme.</span>
      )}

      {revealed && last && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6 }}>
          {type === "calc" && (
            <>
              <div style={{ fontSize: 13 }}>{sub("Answer")} <b style={{ marginLeft: 8 }}>{q.answer}{q.unit ? <> {chemFormat(q.unit)}</> : null}</b>{q.tolerance ? <span style={{ color: T.muted }}> (accept ±{q.tolerance})</span> : null}</div>
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
                      <Icon name={pt.got ? "check" : "x"} size={14} strokeWidth={3} style={{ marginTop: 3 }} /><span>{chemFormat(pt.text)}</span>
                    </div>
                  ))}
                  {(q.allow?.length || q.reject?.length) ? (
                    <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                      {q.allow?.length ? <div><b>Allow:</b> {chemFormat(q.allow.join("; "))}</div> : null}
                      {q.reject?.length ? <div><b>Reject:</b> {chemFormat(q.reject.join("; "))}</div> : null}
                    </div>
                  ) : null}
                </div>
              )}
              {result.detail?.modelAnswer && (
                <div>
                  <Button size="sm" variant="secondary" iconRight="chevronDown" onClick={() => setShowModel(v => !v)}>{showModel ? "Hide model answer" : "Model answer"}</Button>
                  {showModel && <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>{chemFormat(result.detail.modelAnswer)}</div>}
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

  /** A past-paper question marked inside the homework: fold the examiner's result into the item. */
  const recordPpq = (item, data, doc, extra) => {
    const parts = Object.fromEntries((data.parts || []).map(p => [partKey(p.label), {
      score: p.score || 0, maxScore: p.marks, answer: (extra?.answers || {})[p.label] || null, feedback: p.feedback || null, attempted: !!p.attempted,
    }]));
    const answered = (data.parts || []).filter(p => p.attempted).length;
    const a = {
      answer: `${answered} of ${(data.parts || []).length} part${(data.parts || []).length === 1 ? "" : "s"} answered`,
      score: data.score || 0, markedBy: "ai", confidence: data.confidence || "medium", feedback: data.overall || null,
      detail: { parts, qid: item.questionId, examinerAttempts: data.attempts || null, complete: true },
    };
    const prev = answers[item.key];
    const next = addAttempt(prev, item.marks, a);
    next.hintsUsed = Math.max(prev?.hintsUsed || 0, extra?.hintsUsed || 0);
    record(item, next, "attempt");
  };

  const query = async (key, note) => {
    const q = { note, at: Date.now(), status: "open", reply: null };
    setSubm(s => ({ ...s, queries: { ...(s.queries || {}), [key]: q } }));
    try { await sendMarkQuery(a.id, authUser.uid, key, note); notifyTutor({ type: "query", assignmentId: a.id, key }); } catch (e) { setError("Could not send your query: " + e.message); }
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit your homework? You will not be able to change your answers afterwards.")) return;
    setSubmitting(true);
    try {
      await submitSubmission(a.id, authUser.uid, { totalScore: total(answers), timeSpentMs: timeSpent() });
      notifyTutor({ type: "submission", assignmentId: a.id });
      setSubm(s => ({ ...s, submittedAt: Date.now(), submittedClientTime: Date.now() }));
      setIdx(0);
    } catch (e) { setError(e.message); }
    setSubmitting(false);
  };

  const items = a?.items || [];
  const item = items[idx];
  const res = useMemo(() => item ? resolveItem(item) : null, [item]);
  const answeredCount = items.filter(it => answers[it.key]).length;
  // A question is complete once every part has been attempted at least once.
  // Students work through the homework in order and cannot skip ahead.
  const isComplete = (it) => { const r = answers[it.key]; return !!r && (it.type === "exam" ? !!r.detail?.complete : (r.attempts?.length || 0) > 0); };
  const completeCount = items.filter(isComplete).length;
  const firstIncomplete = items.findIndex(it => !isComplete(it));
  const allComplete = firstIncomplete === -1;

  if (error && !a) return <Notice tone="red">{error}</Notice>;
  if (!a || !subm) return <div style={{ color: T.muted, fontSize: 13, padding: 20 }}>Loading homework…</div>;

  const readOnly = submitted;
  // Context for the error-log prompt under each marked part
  const logFor = (it) => ({ authUser, userProfile, entry: {
    source: "homework", questionId: String(it.questionId), topic: it.topic || null, topicLabel: it.topicLabel || null, title: it.topicLabel || null, board, assignmentId: a.id,
    retestPath: it.type === "ppq" ? `/${board}/practise/${it.questionId}` : `/${board}/${REVISION_TAB[it.type] || "revision"}`,
  } });
  const pctScore = subm.maxScore ? Math.round((total(answers) / subm.maxScore) * 100) : 0;
  const openQueries = Object.values(queries).filter(q => q.status === "open").length;
  const replies = Object.values(queries).filter(q => q.status === "resolved").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <Notice tone="red">{error}</Notice>}
      {/* Progress strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10 }}>
          <Bar value={(completeCount / Math.max(1, items.length)) * 100} colour={T.accent} style={{ flex: 1 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.body, whiteSpace: "nowrap" }}>{completeCount} of {items.length} complete</span>
        </div>
        <Chip tone="neutral"><Icon name="clock" size={13} />{Math.round(timeSpent() / 60000)} min · {a.minutes} min guide</Chip>
        {submitted
          ? <Chip tone={pctScore >= 75 ? "green" : pctScore >= 50 ? "amber" : "red"}>Marked · {total(answers)} / {subm.maxScore} · {pctScore}%</Chip>
          : <Chip tone="amber">Due {fmtDue(a.dueAt)}</Chip>}
        {!submitted && <Button variant="primary" onClick={handleSubmit} disabled={submitting || !allComplete} title={allComplete ? undefined : "Finish every question before submitting"}>{submitting ? "Submitting…" : "Submit homework"}</Button>}
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

      {!submitted && answeredCount === 0 && items.length > 0 && items.every(it => it.type === "ppq") && (
        <Notice tone="neutral" style={{ fontSize: 13 }}>
          <b>How marking works.</b> These are real exam questions. Answer every part by typing, drawing on the paper or photographing your work, then press <b>Mark my answer</b> and the AI examiner marks it against the real mark scheme. You can be marked twice on each question; your first mark is the one that counts. If you think a mark is wrong, query it and your tutor will check.
        </Notice>
      )}
      {!submitted && answeredCount === 0 && items.some(it => it.type !== "ppq") && (
        <Notice tone="neutral" style={{ fontSize: 13 }}>
          <b>How marking works.</b> Press <b>Mark</b> or <b>AI mark</b> to have each answer marked straight away. You get up to three attempts (two for multiple choice), and after your first attempt you can open hints one at a time. Hints are free, but your first attempt is the mark that counts. The mark scheme opens once you get full marks, or once you have used every attempt and hint.
        </Notice>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Question map */}
        <nav aria-label="Questions" style={{ flex: "1 1 200px", maxWidth: 240, background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {["mcq", "calc", "exam", "extended", "ppq"].map(type => {
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
                    const locked = !readOnly && firstIncomplete !== -1 && i > firstIncomplete;
                    return <button key={it.key} onClick={() => setIdx(i)} disabled={locked} aria-label={`Question ${i + 1}${locked ? " (locked until earlier questions are complete)" : ""}`} style={{ height: 34, borderRadius: 8, border: current || r ? "none" : `1px solid ${T.border}`, background: bg, color: fg, fontWeight: 700, fontSize: 12, cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.45 : 1 }}>{i + 1}</button>;
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
                <Chip tone={item.type === "mcq" ? "red" : item.type === "calc" ? "accent" : item.type === "exam" ? "amber" : item.type === "ppq" ? "green" : "indigo"}>{TYPE_LABEL[item.type]} · {item.marks} mark{item.marks === 1 ? "" : "s"}</Chip>
                {item.type !== "ppq" && <Chip tone="neutral">{item.topicLabel}</Chip>}
                {item.difficulty && <Chip tone="neutral">{item.difficulty}</Chip>}
              </div>

              {item.type === "ppq" && (
                <>
                  {!readOnly && !answers[item.key] && <Notice tone="neutral" style={{ fontSize: 13 }}>A real exam question. Answer every part, then press <b>Mark my answer</b>. You can be marked twice; your first mark counts for this homework.</Notice>}
                  <PastPaperQuestion board={board} qid={item.questionId} authUser={authUser} userProfile={userProfile} assignmentId={a.id} embedded onlyParts={Array.isArray(item.parts) ? item.parts : null}
                    locked={readOnly || (answers[item.key]?.attempts?.length || 0) >= MAX_ATTEMPTS.ppq}
                    onMarked={(data, doc, extra) => recordPpq(item, data, doc, extra)} />
                  {answers[item.key] && <AttemptBanner result={answers[item.key]} maxAttempts={MAX_ATTEMPTS.ppq} />}
                </>
              )}

              {item.type === "mcq" && (
                <Part type="mcq" q={res.q} maxScore={item.marks} result={answers[item.key]} readOnly={readOnly} submitted={submitted} showQuestion log={logFor(item)}
                  onRecord={(r, kind) => record(item, r, kind)} query={queries[item.key]} onQuery={(note) => query(item.key, note)} />
              )}

              {item.type === "calc" && (
                <>
                  <div style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 500, whiteSpace: "pre-line", fontFamily: T.display }}>{chemFormat(res.q.q)}</div>
                  {res.q.dataTable && <DataTable rows={res.q.dataTable} />}
                  {res.q.diagram && <div style={{ maxWidth: 700 }}>{res.q.diagram}</div>}
                  <Part type="calc" q={res.q} maxScore={item.marks} result={answers[item.key]} readOnly={readOnly} submitted={submitted} log={logFor(item)}
                    onRecord={(r, kind) => record(item, r, kind)} query={queries[item.key]} onQuery={(note) => query(item.key, note)} />
                </>
              )}

              {item.type === "extended" && (
                <>
                  <div style={serif}>{chemFormat(res.q.question)}</div>
                  <Part type="extended" q={res.q} maxScore={item.marks} result={answers[item.key]} readOnly={readOnly} submitted={submitted} log={logFor(item)}
                    onRecord={(r, kind) => record(item, r, kind)} query={queries[item.key]} onQuery={(note) => query(item.key, note)} />
                </>
              )}

              {item.type === "exam" && (
                <ExamItem q={res.q} item={item} result={answers[item.key]} readOnly={readOnly} submitted={submitted} log={logFor(item)}
                  onRecord={(r, kind) => record(item, r, kind)} queries={queries} onQuery={query} />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.line}`, flexWrap: "wrap" }}>
                <Button variant="secondary" icon="arrowLeft" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>Previous</Button>
                {!readOnly && !isComplete(item) && <span style={{ fontSize: 12, color: T.muted }}>{idx >= items.length - 1 ? "Answer every part, then submit at the top." : "Answer every part of this question to move on."}</span>}
                <Button variant="secondary" iconRight="arrowRight" onClick={() => setIdx(i => Math.min(items.length - 1, i + 1))} disabled={idx >= items.length - 1 || (!readOnly && !isComplete(item))}>Next</Button>
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

/** Also used on its own under Revision (ExamStyleTab), with no tutor queries: pass onQuery null. */
export function ExamItem({ q, item, result, readOnly, submitted, onRecord, queries, onQuery, log }) {
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
      {q.context && <div style={serif}>{chemFormat(q.context)}</div>}
      {q.dataTable && <DataTable rows={q.dataTable} />}
      {q.parts.map(p => {
        const key = partQueryKey(item.key, p.label);
        return (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontWeight: 700, minWidth: 28 }}>({p.label})</span>
              <div style={{ flex: 1, ...serif, fontSize: 15.5, lineHeight: 1.7 }}>{chemFormat(p.q)}</div>
              <Chip tone="neutral">{partMax(p)} mark{partMax(p) === 1 ? "" : "s"}</Chip>
            </div>
            <Part type={p.type} q={p} context={q.context} maxScore={partMax(p)} result={parts[p.label]} readOnly={readOnly} submitted={submitted}
              onRecord={(r, kind) => save(p.label, r, kind)} query={(queries || {})[key]} onQuery={onQuery ? (note) => onQuery(key, note) : null}
              log={log ? { ...log, entry: { ...log.entry, partLabel: p.label } } : null} />
          </div>
        );
      })}
    </div>
  );
}
