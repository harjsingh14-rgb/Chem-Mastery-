import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTutorAssignments, fetchTutorSubmissions, fetchAssignment, fetchClassStudents, fetchSubmissionsForAssignment, saveTutorMark, updateAssignment, deleteAssignment, answerMarkQuery } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Bar, Avatar, Table, th, td, EmptyState, Notice, Icon, Input, chipToneForPct, StatTile } from "../ui/components";
import { fmtDue, isOverdue, resolveItem, TYPE_LABEL } from "../utils/homeworkBank";
import { relativeTime } from "../utils/analytics";

const pct = (n, d) => d ? Math.round((n / d) * 100) : null;

// ─── List of all homework set by this tutor ──────────────────────────────
export function TutorHomeworkList({ authUser }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(null);
  const [subs, setSubs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser?.uid) return;
    Promise.all([fetchTutorAssignments(authUser.uid), fetchTutorSubmissions(authUser.uid)])
      .then(([a, s]) => { setAssignments(a); setSubs(s); })
      .catch(e => { setError(e.message); setAssignments([]); });
  }, [authUser]);

  const open = (assignments || []).filter(a => a.status !== "closed");
  const closed = (assignments || []).filter(a => a.status === "closed");

  const Row = ({ a }) => {
    const mine = subs.filter(s => s.assignmentId === a.id);
    const submitted = mine.filter(s => s.submittedAt);
    const avg = submitted.length ? Math.round(submitted.reduce((x, s) => x + pct(s.totalScore, s.maxScore), 0) / submitted.length) : null;
    return (
      <div className="cm-row-hover" onClick={() => navigate(`/tutor/homework/${a.id}`)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderTop: `1px solid ${T.line}`, cursor: "pointer", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontWeight: 600 }}>{a.title}</span>
          <span style={{ fontSize: 12, color: T.muted }}>{a.minutes} min · {a.summary} · Due {fmtDue(a.dueAt)}{isOverdue(a.dueAt) && a.status !== "closed" ? " (past due)" : ""}</span>
        </div>
        <div style={{ width: 150, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: T.muted }}>Submitted</span><span style={{ fontWeight: 600 }}>{submitted.length}{mine.length > submitted.length ? ` (+${mine.length - submitted.length} started)` : ""}</span></div>
          <Bar value={mine.length ? (submitted.length / Math.max(mine.length, 1)) * 100 : 0} colour={T.accent} />
        </div>
        <div style={{ textAlign: "center", width: 64 }}><div style={{ fontWeight: 700, fontSize: 16, color: avg === null ? T.muted : pctColour(avg) }}>{avg === null ? "–" : `${avg}%`}</div><div style={{ fontSize: 11, color: T.muted }}>average</div></div>
        <Icon name="arrowRight" color={T.faint} />
      </div>
    );
  };

  return (
    <>
      <PageHeader eyebrow="Homework" title="Homework" sub="Everything you've set, with who has done it and how they did."
        right={<Button variant="primary" icon="plus" onClick={() => navigate("/tutor/homework/new")}>Set homework</Button>} />
      {error && <Notice tone="red">{error}</Notice>}
      <Card padding={0}>
        <CardHeader title="Open" right={<Chip tone="accent">{open.length}</Chip>} style={{ padding: "16px 20px" }} />
        {assignments === null && <div style={{ padding: 20, color: T.muted, fontSize: 13 }}>Loading…</div>}
        {assignments && open.length === 0 && <EmptyState icon="checkSquare" title="No open homework" body="Set homework from the question banks with a time budget and due date." action={<Button variant="primary" icon="plus" onClick={() => navigate("/tutor/homework/new")}>Set homework</Button>} />}
        {open.map(a => <Row key={a.id} a={a} />)}
      </Card>
      {closed.length > 0 && (
        <Card padding={0}>
          <CardHeader title="Closed" right={<Chip tone="neutral">{closed.length}</Chip>} style={{ padding: "16px 20px" }} />
          {closed.map(a => <Row key={a.id} a={a} />)}
        </Card>
      )}
    </>
  );
}

// ─── Review one assignment ───────────────────────────────────────────────
export function TutorHomeworkReview({ authUser, assignmentId }) {
  const navigate = useNavigate();
  const [a, setA] = useState(null);
  const [students, setStudents] = useState(null);
  const [subs, setSubs] = useState([]);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!authUser?.uid || !assignmentId) return;
    fetchAssignment(assignmentId).then(async asg => {
      if (!asg) { setError("This homework no longer exists."); return; }
      setA(asg);
      const [st, sb] = await Promise.all([fetchClassStudents(asg.classId, authUser.uid), fetchSubmissionsForAssignment(assignmentId, authUser.uid)]);
      setStudents(st); setSubs(sb);
    }).catch(e => setError(e.message));
  };
  useEffect(load, [authUser, assignmentId]); // eslint-disable-line

  const rows = useMemo(() => (students || []).map(s => {
    const sub = subs.find(x => x.uid === s.uid) || null;
    const status = !sub ? "not-started" : sub.submittedAt ? "submitted" : "in-progress";
    const answered = sub ? Object.keys(sub.answers || {}).length : 0;
    return { s, sub, status, answered, name: s.displayName || s.email };
  }).sort((x, y) => ({ submitted: 0, "in-progress": 1, "not-started": 2 }[x.status] - { submitted: 0, "in-progress": 1, "not-started": 2 }[y.status]) || x.name.localeCompare(y.name)), [students, subs]);

  const submitted = rows.filter(r => r.status === "submitted");
  const avg = submitted.length ? Math.round(submitted.reduce((x, r) => x + pct(r.sub.totalScore, r.sub.maxScore), 0) / submitted.length) : null;
  const lowConfidence = subs.flatMap(sub => Object.entries(sub.answers || {}).filter(([, r]) => r.markedBy === "ai" && r.confidence === "low").map(([key]) => ({ sub, key })));
  const openQueries = subs.flatMap(sub => Object.entries(sub.queries || {}).filter(([, q]) => q.status === "open").map(([key, q]) => ({ sub, key, itemKey: key.split("__")[0], q })));
  const [replies, setReplies] = useState({});

  const reply = async (sub, key) => {
    const text = (replies[sub.id + key] || "").trim();
    if (!text) return;
    const nextQ = { ...sub.queries[key], reply: text, status: "resolved", repliedAt: Date.now() };
    setSubs(prev => prev.map(x => x.id === sub.id ? { ...x, queries: { ...x.queries, [key]: nextQ } } : x));
    try { await answerMarkQuery(a.id, sub.uid, key, text); } catch (e) { setError(e.message); }
  };

  // Which items were missed most across submitted work
  const missed = useMemo(() => {
    if (!a) return [];
    return a.items.map(it => {
      const results = submitted.map(r => r.sub.answers?.[it.key]).filter(Boolean);
      const got = results.reduce((x, r) => x + (r.score || 0), 0);
      const max = results.length * it.marks;
      return { it, n: results.length, pct: pct(got, max) };
    }).filter(x => x.n >= 2 && x.pct !== null).sort((x, y) => x.pct - y.pct).slice(0, 5);
  }, [a, submitted]);

  const effectiveScore = (sub, key) => (sub.tutorMarks && sub.tutorMarks[key] !== undefined) ? sub.tutorMarks[key] : (sub.answers?.[key]?.score || 0);
  const totalFor = (sub) => (a?.items || []).reduce((x, it) => x + (sub.answers?.[it.key] ? effectiveScore(sub, it.key) : 0), 0);

  const override = async (sub, key, value, max) => {
    const score = Math.max(0, Math.min(max, parseInt(value, 10) || 0));
    const next = { ...sub, tutorMarks: { ...(sub.tutorMarks || {}), [key]: score } };
    const total = totalFor(next);
    setSubs(prev => prev.map(x => x.id === sub.id ? { ...next, totalScore: total } : x));
    try { await saveTutorMark(a.id, sub.uid, key, score, total); } catch (e) { setError(e.message); }
  };

  const toggleClosed = async () => {
    setBusy(true);
    try { const status = a.status === "closed" ? "open" : "closed"; await updateAssignment(a.id, { status }); setA({ ...a, status }); } catch (e) { setError(e.message); }
    setBusy(false);
  };
  const remove = async () => {
    if (!window.confirm("Delete this homework? Students' submissions stay in the database but will no longer be shown.")) return;
    setBusy(true);
    try { await deleteAssignment(a.id); navigate("/tutor/homework"); } catch (e) { setError(e.message); setBusy(false); }
  };

  if (error) return <><PageHeader eyebrow="Homework" title="Homework" /><Notice tone="red">{error}</Notice></>;
  if (!a) return <PageHeader eyebrow="Homework" title="Loading…" />;

  return (
    <>
      <PageHeader eyebrow="Homework" title={a.title} sub={`${a.minutes} min · ${a.summary} · ${a.maxScore} marks · Due ${fmtDue(a.dueAt)}`}
        right={<>
          <Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/tutor/homework")}>All homework</Button>
          <Button variant="secondary" onClick={toggleClosed} disabled={busy}>{a.status === "closed" ? "Reopen" : "Close"}</Button>
          <Button variant="danger" onClick={remove} disabled={busy}>Delete</Button>
        </>} />
      {a.note && <Notice tone="amber"><b>Your note to students:</b> {a.note}</Notice>}

      <div className="cm-grid-4">
        <StatTile label="Submitted" value={<>{submitted.length}<span style={{ fontSize: 16, color: T.muted, fontWeight: 600 }}> / {rows.length}</span></>} sub={`${rows.filter(r => r.status === "in-progress").length} in progress`} />
        <StatTile label="Group average" value={avg === null ? "–" : `${avg}%`} sub={submitted.length ? "of submitted work" : "Nothing submitted yet"} />
        <StatTile label="Needs your check" value={lowConfidence.length + openQueries.length} sub={`${openQueries.length} mark quer${openQueries.length === 1 ? "y" : "ies"} · ${lowConfidence.length} low-confidence AI mark${lowConfidence.length === 1 ? "" : "s"}`} subTone={lowConfidence.length + openQueries.length ? "amber" : undefined} />
        <StatTile label="Status" value={a.status === "closed" ? "Closed" : isOverdue(a.dueAt) ? "Past due" : "Open"} sub={a.status === "closed" ? "Students can still view feedback" : "Students can still submit"} />
      </div>

      <div className="cm-two-col">
        <div className="cm-main-col">
          <Card padding={0}>
            <CardHeader title="Students" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
            {students && students.length === 0 && <EmptyState icon="users" title="No students in this group yet" />}
            {students && students.length > 0 && (
              <Table minWidth={640}>
                <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Student</th><th style={th}>Status</th><th style={th}>Score</th><th style={{ ...th, width: 180 }}>Marks</th><th style={th}>Time</th><th style={{ ...th, paddingRight: 20 }}>Submitted</th></tr></thead>
                <tbody>
                  {rows.map(({ s, sub, status, answered, name }) => {
                    const isOpen = open === s.uid;
                    const total = sub ? totalFor(sub) : 0;
                    const p = sub && sub.maxScore ? pct(total, sub.maxScore) : null;
                    return (
                      <React.Fragment key={s.uid}>
                        <tr className="cm-row-hover" onClick={() => sub && setOpen(isOpen ? null : s.uid)} style={{ borderTop: `1px solid ${T.line}`, cursor: sub ? "pointer" : "default" }}>
                          <td style={{ ...td, paddingLeft: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={s.displayName} email={s.email} photoURL={s.photoURL} size={30} /><span style={{ fontWeight: 600 }}>{name}</span></div></td>
                          <td style={td}>{status === "submitted" ? <Chip tone="green">Submitted</Chip> : status === "in-progress" ? <Chip tone="accent">In progress · {answered}/{a.items.length}</Chip> : <Chip tone={isOverdue(a.dueAt) ? "red" : "neutral"}>Not started</Chip>}</td>
                          <td style={{ ...td, fontWeight: 700, color: p === null ? T.muted : pctColour(p) }}>{p === null ? "–" : `${p}%`}</td>
                          <td style={td}>{sub ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Bar value={p || 0} style={{ flex: 1 }} /><span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{total} / {sub.maxScore}</span></div> : <span style={{ color: T.muted }}>–</span>}</td>
                          <td style={{ ...td, color: T.muted }}>{sub?.timeSpentMs ? `${Math.round(sub.timeSpentMs / 60000)} min` : "–"}</td>
                          <td style={{ ...td, paddingRight: 20, color: T.muted }}>{sub?.submittedClientTime ? relativeTime(sub.submittedClientTime) : "–"}</td>
                        </tr>
                        {isOpen && sub && (
                          <tr style={{ background: "#FAFBFC" }}><td colSpan={6} style={{ padding: "6px 20px 18px" }}>
                            {a.items.map((it, i) => {
                              const r = sub.answers?.[it.key];
                              const res = resolveItem(it);
                              const eff = effectiveScore(sub, it.key);
                              const overridden = sub.tutorMarks && sub.tutorMarks[it.key] !== undefined;
                              return (
                                <div key={it.key} style={{ padding: "10px 0", borderBottom: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 6 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ color: T.faint, fontSize: 12, width: 20 }}>{i + 1}</span>
                                    <Chip tone="neutral" style={{ padding: "2px 8px", fontSize: 11 }}>{TYPE_LABEL[it.type]}</Chip>
                                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{it.topicLabel}</span>
                                    {r ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        {r.markedBy === "ai" && <Chip tone={r.confidence === "low" ? "amber" : "neutral"} style={{ fontSize: 11 }}>AI · {r.confidence || "medium"} confidence</Chip>}
                                        <label style={{ fontSize: 12, color: T.muted }}>Mark</label>
                                        <Input type="number" min={0} max={it.marks} value={eff} onChange={e => override(sub, it.key, e.target.value, it.marks)} onClick={e => e.stopPropagation()} style={{ width: 60, padding: "4px 8px", fontSize: 13 }} aria-label="Override mark" />
                                        <span style={{ fontSize: 12, color: T.muted }}>/ {it.marks}{overridden ? " (adjusted)" : ""}</span>
                                      </div>
                                    ) : <Chip tone="neutral" style={{ fontSize: 11 }}>Not answered</Chip>}
                                  </div>
                                  {r && (
                                    <div style={{ marginLeft: 28, display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                                      <AttemptSummary r={r} />
                                      {it.type !== "exam" && r.answer !== undefined && <div><span style={{ color: T.muted }}>Answer: </span><span style={{ whiteSpace: "pre-wrap" }}>{String(r.answer)}</span>{res?.q?.answer !== undefined && it.type !== "extended" && <span style={{ color: T.muted }}> · correct: {String(res.q.answer)}{res.q.unit ? ` ${res.q.unit}` : ""}</span>}</div>}
                                      {it.type === "exam" && r.detail?.parts && Object.entries(r.detail.parts).map(([lbl, pr]) => (
                                        <div key={lbl}><span style={{ color: T.muted }}>({lbl}) {pr.score}/{pr.maxScore}: </span><span style={{ whiteSpace: "pre-wrap" }}>{String(pr.answer ?? "")}</span> <AttemptSummary r={pr} inline />{pr.feedback && <div style={{ color: T.body, marginLeft: 12 }}>{pr.feedback}</div>}
                                          <QueryThread q={sub.queries?.[`${it.key}__${lbl}`]} draft={replies[sub.id + `${it.key}__${lbl}`]} onDraft={v => setReplies(d => ({ ...d, [sub.id + `${it.key}__${lbl}`]: v }))} onReply={() => reply(sub, `${it.key}__${lbl}`)} />
                                        </div>
                                      ))}
                                      {r.feedback && <div style={{ color: T.body }}><span style={{ color: T.muted }}>Feedback: </span>{r.feedback}</div>}
                                      <QueryThread q={sub.queries?.[it.key]} draft={replies[sub.id + it.key]} onDraft={v => setReplies(d => ({ ...d, [sub.id + it.key]: v }))} onReply={() => reply(sub, it.key)} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </td></tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>
        </div>
        <aside className="cm-side-col">
          <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <CardHeader title="Most missed" sub="Questions the group scored lowest on (2+ submissions)" />
            {missed.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Shows once two or more students have submitted.</span>}
            {missed.map(({ it, pct: p, n }) => (
              <div key={it.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}><span>{TYPE_LABEL[it.type]} · {it.topicLabel}</span><span style={{ fontWeight: 700, color: pctColour(p) }}>{p}% <span style={{ color: T.faint, fontWeight: 400 }}>({n})</span></span></div>
                <Bar value={p} />
              </div>
            ))}
          </Card>
          <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CardHeader title="Mark queries" sub="Students asking you to check a mark" />
            {openQueries.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>None open.</span>}
            {openQueries.slice(0, 8).map(({ sub, key, itemKey, q }) => (
              <button key={sub.id + key} onClick={() => setOpen(sub.uid)} style={{ textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "4px 0", fontSize: 13, color: T.ink }}>
                <span style={{ fontWeight: 600 }}>{sub.studentName || sub.uid}</span> <span style={{ color: T.muted }}>· {a.items.find(it => it.key === itemKey)?.topicLabel || key}</span>
                <div style={{ fontSize: 12, color: T.body, marginTop: 2 }}>{q.note}</div>
              </button>
            ))}
          </Card>
          <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CardHeader title="Low-confidence AI marks" sub="Worth a quick look" />
            {lowConfidence.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>None so far.</span>}
            {lowConfidence.slice(0, 8).map(({ sub, key }) => (
              <button key={sub.id + key} onClick={() => setOpen(sub.uid)} style={{ textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "4px 0", fontSize: 13, color: T.ink }}>
                <span style={{ fontWeight: 600 }}>{sub.studentName || sub.uid}</span> <span style={{ color: T.muted }}>· {a.items.find(it => it.key === key)?.topicLabel || key}</span>
              </button>
            ))}
          </Card>
          <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <CardHeader title="Questions" sub={`${a.items.length} items`} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 300, overflowY: "auto" }}>
              {a.items.map((it, i) => <div key={it.key} style={{ display: "flex", gap: 8, fontSize: 12 }}><span style={{ color: T.faint, width: 18 }}>{i + 1}</span><span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.topicLabel}</span><span style={{ color: T.muted }}>{it.marks} mk</span></div>)}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}

/** "2 attempts · 1 hint · best 3/3" for a stored result or part result. */
function AttemptSummary({ r, inline }) {
  const n = r.attempts?.length || 0;
  if (!n && !r.hintsUsed) return null;
  const bits = [];
  if (n) bits.push(`${n} attempt${n === 1 ? "" : "s"}`);
  if (r.hintsUsed) bits.push(`${r.hintsUsed} hint${r.hintsUsed === 1 ? "" : "s"}`);
  if (n > 1 && r.bestScore !== undefined && r.bestScore !== r.score) bits.push(`best ${r.bestScore}/${r.maxScore}`);
  return <span style={{ color: T.muted, fontSize: 11, display: inline ? "inline" : "block" }}>{inline ? "· " : ""}{bits.join(" · ")}</span>;
}

/** A student's query on one mark, with the tutor's reply box. */
function QueryThread({ q, draft, onDraft, onReply }) {
  if (!q) return null;
  return (
    <div style={{ margin: "6px 0 4px 12px", padding: "8px 12px", background: q.status === "open" ? T.amberTint : "#FAFBFC", border: `1px solid ${q.status === "open" ? "#FDE68A" : T.line}`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 6 }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Chip tone={q.status === "open" ? "amber" : "green"} style={{ fontSize: 11 }}>{q.status === "open" ? "Mark query" : "Query answered"}</Chip><span style={{ color: T.muted }}>{relativeTime(q.at)}</span></div>
      <div><span style={{ color: T.muted }}>Student: </span>{q.note}</div>
      {q.status === "resolved" && <div><span style={{ color: T.muted }}>You: </span>{q.reply}</div>}
      {q.status === "open" && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <textarea value={draft || ""} onChange={e => onDraft(e.target.value)} rows={2} placeholder="Reply to the student. Adjust the mark above if it should change." aria-label="Reply"
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 12, fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }} />
          <Button size="sm" variant="primary" onClick={onReply} disabled={!(draft || "").trim()}>Reply</Button>
        </div>
      )}
    </div>
  );
}

export { chipToneForPct };
