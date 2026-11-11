// Lessons tab: a lesson per group per date (topics covered), then one note
// per student with attendance, the tutor's comment and the week's homework
// record, emailed to the parent with the student copied.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLesson, updateLesson, deleteLesson, fetchTutorLessons, fetchLesson, fetchTutorClasses, fetchClassStudents,
  fetchLessonNotes, saveLessonNote, lessonNoteId, sendLessonNote, fetchTutorAssignments, fetchSubmissionsForAssignment, fetchTutorSessions, updateSession,
  fetchClassLessonNotes, fetchPrivateNotes, savePrivateNote } from "../firebase";
import { T, boardLabel } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Avatar, Tabs } from "../ui/components";
import { SELF_EVALUATION } from "../data/self-evaluation";
import { lastOccurrence, lastSessionDate, describeSlots, slotsOf } from "../utils/schedule";

const today = () => new Date().toISOString().slice(0, 10);
export const fmtLessonDate = (iso) => { const d = new Date(`${iso}T00:00:00`); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); };
const fmtWhen = (ms) => ms ? new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const ATTENDANCE = [{ id: "present", label: "Present", tone: "green" }, { id: "late", label: "Late", tone: "amber" }, { id: "absent", label: "Absent", tone: "red" }];
const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const selectStyle = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink };

/** Spec sub-topics for the group's board, grouped by module. A ticked topic is stored as "ref title". */
function TopicPicker({ board, value, onChange }) {
  const spec = SELF_EVALUATION[board] || SELF_EVALUATION.aqa;
  const toggle = (t) => onChange(value.includes(t) ? value.filter(x => x !== t) : [...value, t]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {spec.modules.map(m => (
        <div key={m.id}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>{m.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.subtopics.map(st => {
              const t = `${st.ref} ${st.title}`;
              const on = value.includes(t);
              return <button key={st.ref} type="button" onClick={() => toggle(t)} style={{ padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${on ? T.accentText : T.border}`, background: on ? T.accentTint : T.card, color: on ? T.accentText : T.body }}>{t}</button>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TutorLessonsList({ authUser }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [tab, setTab] = useState("lessons");
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(today());
  const [topics, setTopics] = useState([]);
  const [creating, setCreating] = useState(false);
  const uid = authUser?.uid;

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    Promise.all([fetchTutorClasses(uid), fetchTutorLessons(uid), fetchTutorSessions(uid).catch(() => [])])
      .then(([g, l, ses]) => { if (!cancelled) { setGroups(g); setLessons(l); setSessions(ses); if (g[0]) setClassId(g[0].code); if (l.length === 0) setShowNew(true); } })
      .catch(e => { if (!cancelled) { setError(e.message); setGroups([]); setLessons([]); } });
    return () => { cancelled = true; };
  }, [uid]);

  const group = groups?.find(g => g.code === classId);
  // Default the date to the group's latest calendar session, else its usual weekly time
  const defaultDate = (g) => lastSessionDate(sessions, g?.code) || lastOccurrence(slotsOf(g));
  const pickGroup = (code) => {
    setClassId(code);
    const last = defaultDate(groups?.find(x => x.code === code));
    if (last) setDate(last);
  };
  useEffect(() => { const last = defaultDate(group); if (last) setDate(last); }, [group]); // eslint-disable-line
  const create = async () => {
    if (!group || !date) return;
    setCreating(true); setError(null);
    try {
      // Tie the lesson to the calendar session on that day, if there is one without notes yet
      const session = sessions.find(s => s.classId === group.code && s.date === date && !s.lessonId && !s.studentIds && s.status !== "cancelled") || null;
      const l = await createLesson(uid, { classId: group.code, className: group.name, board: group.board, date, topics, sessionId: session?.id || null });
      if (session) await updateSession(session.id, { lessonId: l.id }).catch(() => {});
      navigate(`/tutor/lessons/${l.id}`);
    } catch (e) { setError(e.message); setCreating(false); }
  };

  return (
    <>
      <PageHeader eyebrow="Lessons" title="Lesson notes" sub="Record each lesson, then write and send a note per student. Parents get it by email with the student copied."
        right={<Button variant="primary" icon="plus" onClick={() => setShowNew(v => !v)}>New lesson</Button>} />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {groups && groups.length === 0 && <Card padding={0}><EmptyState icon="users" title="Create a group first" body="Lessons belong to a group. Create one on the Overview tab." action={<Button variant="primary" onClick={() => navigate("/tutor")}>Overview</Button>} /></Card>}
      {groups && groups.length > 0 && <div style={{ marginBottom: 12 }}><Tabs tabs={[{ id: "lessons", label: "Lessons" }, { id: "register", label: "Attendance register" }]} value={tab} onChange={setTab} /></div>}
      {tab === "register" && groups && groups.length > 0 && <AttendanceRegister uid={uid} groups={groups} lessons={lessons || []} />}
      {tab === "lessons" && showNew && groups && groups.length > 0 && (
        <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <CardHeader title="New lesson" sub="Which group, when, and what you covered. You can change the topics afterwards." />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><label style={label} htmlFor="ls-group">Group</label>
              <select id="ls-group" value={classId} onChange={e => pickGroup(e.target.value)} style={selectStyle}>{groups.map(g => <option key={g.code} value={g.code}>{g.name} ({boardLabel(g.board)}{slotsOf(g).length ? `, ${describeSlots(slotsOf(g))}` : ""})</option>)}</select></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><label style={label} htmlFor="ls-date">Lesson date</label><Input id="ls-date" type="date" value={date} onChange={e => setDate(e.target.value)} />{slotsOf(group).length > 0 && <span style={{ fontSize: 11, color: T.muted }}>Defaults to the group's latest lesson on the calendar</span>}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={label}>Topics covered</span><TopicPicker board={group?.board} value={topics} onChange={setTopics} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="accent" onClick={create} disabled={creating || !group || !date}>{creating ? "Creating…" : "Create lesson and write notes"}</Button>
            {lessons && lessons.length > 0 && <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>}
          </div>
        </Card>
      )}
      {tab === "lessons" && <Card padding={0}>
        <CardHeader title="Past lessons" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
        {lessons === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {lessons && lessons.length === 0 && <EmptyState icon="calendar" title="No lessons recorded yet" body="Click New lesson after you teach." />}
        {lessons && lessons.length > 0 && (
          <Table minWidth={560}>
            <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Date</th><th style={th}>Group</th><th style={th}>Topics</th><th style={{ ...th, paddingRight: 20 }}>Notes</th></tr></thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l.id} className="cm-row-hover" onClick={() => navigate(`/tutor/lessons/${l.id}`)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                  <td style={{ ...td, paddingLeft: 20, fontWeight: 600 }}>{fmtLessonDate(l.date)}</td>
                  <td style={td}>{l.className || l.classId}</td>
                  <td style={{ ...td, color: T.muted }}>{(l.topics || []).join(", ") || "No topics ticked"}</td>
                  <td style={{ ...td, paddingRight: 20 }}>{l.sentCount !== undefined ? <Chip tone={l.sentCount === l.studentCount ? "green" : "amber"}>{l.sentCount} of {l.studentCount} sent</Chip> : <span style={{ color: T.muted }}>Open</span>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>}
    </>
  );
}

const pctOf = (n, d) => d ? Math.round((n / d) * 100) : null;

/** One group: students down the side, lessons across the top, P / L / A in each cell. */
function AttendanceRegister({ uid, groups, lessons }) {
  const navigate = useNavigate();
  const [classId, setClassId] = useState(groups[0]?.code || "");
  const [students, setStudents] = useState(null);
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    if (!classId || !uid) return;
    let cancelled = false;
    setStudents(null);
    Promise.all([fetchClassStudents(classId, uid), fetchClassLessonNotes(classId, uid)])
      .then(([st, ns]) => { if (!cancelled) { setStudents(st.sort((a, b) => (a.displayName || a.email || "").localeCompare(b.displayName || b.email || ""))); setNotes(ns); } })
      .catch(() => { if (!cancelled) { setStudents([]); setNotes([]); } });
    return () => { cancelled = true; };
  }, [classId, uid]);
  const cols = lessons.filter(l => l.classId === classId).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 20);
  const byKey = {}; for (const n of notes) byKey[`${n.lessonId}_${n.uid}`] = n;
  const mark = { present: ["P", T.green, T.greenTint], late: ["L", T.amber, T.amberTint], absent: ["A", T.red, T.redTint] };
  return (
    <Card padding={0}>
      <CardHeader title="Attendance register" sub="Newest lesson first. Click a date to open that lesson's notes. Attendance is recorded on the notes page for each lesson."
        right={groups.length > 1 && <select value={classId} onChange={e => setClassId(e.target.value)} style={selectStyle} aria-label="Group">{groups.map(g => <option key={g.code} value={g.code}>{g.name}</option>)}</select>}
        style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
      {students === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
      {students && students.length === 0 && <EmptyState icon="users" title="No students in this group yet" body="Place students into the group from the Students tab." />}
      {students && students.length > 0 && cols.length === 0 && <EmptyState icon="calendar" title="No lessons recorded yet" body="Take attendance from the Calendar, or click New lesson on the Lessons tab." />}
      {students && students.length > 0 && cols.length > 0 && (
        <Table minWidth={420 + cols.length * 52}>
          <thead><tr>
            <th style={{ ...th, paddingLeft: 20, position: "sticky", left: 0, background: T.card }}>Student</th>
            <th style={th}>Present</th>
            {cols.map(l => <th key={l.id} style={{ ...th, textAlign: "center", cursor: "pointer" }} onClick={() => navigate(`/tutor/lessons/${l.id}`)} title={fmtLessonDate(l.date)}>{new Date(`${l.date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</th>)}
          </tr></thead>
          <tbody>
            {students.map(s => {
              const cells = cols.map(l => byKey[`${l.id}_${s.uid}`]?.attendance || null);
              const recorded = cells.filter(Boolean).length;
              const present = cells.filter(a => a === "present" || a === "late").length;
              return (
                <tr key={s.uid} style={{ borderTop: `1px solid ${T.line}` }}>
                  <td style={{ ...td, paddingLeft: 20, fontWeight: 600, position: "sticky", left: 0, background: T.card, whiteSpace: "nowrap" }}>{s.displayName || s.email}</td>
                  <td style={{ ...td, color: T.muted, whiteSpace: "nowrap" }}>{recorded ? `${Math.round((present / recorded) * 100)}%` : "–"}<span style={{ fontSize: 11, color: T.faint }}> {recorded ? `of ${recorded}` : ""}</span></td>
                  {cells.map((a, i) => { const m = a ? mark[a] : null; return <td key={cols[i].id} style={{ ...td, textAlign: "center" }}>{m ? <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: m[1], background: m[2] }}>{m[0]}</span> : <span style={{ color: T.faint }}>·</span>}</td>; })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Card>
  );
}

/** The student's record on the homework due before this lesson, as it goes into the email. */
function homeworkSnapshot(assignment, sub) {
  if (!assignment) return null;
  const base = { assignmentId: assignment.id, title: assignment.title, dueAt: assignment.dueAt || null };
  if (!sub) return { ...base, status: "not-started", score: 0, maxScore: assignment.maxScore || 0, pct: null, weak: [] };
  const score = sub.totalScore || 0, max = sub.maxScore || assignment.maxScore || 0;
  const weak = [...new Set((assignment.items || []).filter(it => { const r = sub.answers?.[it.key]; return r && it.marks && (r.score || 0) / it.marks < 0.5; }).map(it => it.topicLabel || it.topic).filter(Boolean))].slice(0, 3);
  return { ...base, status: sub.submittedAt ? "submitted" : "in-progress", score, maxScore: max, pct: pctOf(score, max), weak };
}

export function TutorLessonEditor({ authUser, lessonId }) {
  const navigate = useNavigate();
  const uid = authUser?.uid;
  const [lesson, setLesson] = useState(null);
  const [students, setStudents] = useState(null);
  const [notes, setNotes] = useState({});      // uid -> saved note
  const [privates, setPrivates] = useState({}); // uid -> saved private note
  const [previous, setPrevious] = useState({}); // uid -> the student's most recent earlier note
  const [drafts, setDrafts] = useState({});    // uid -> { attendance, www, ebi, extra, text, private }
  const [summary, setSummary] = useState("");
  const [lastHw, setLastHw] = useState(null);
  const [nextHw, setNextHw] = useState(null);
  const [subs, setSubs] = useState([]);
  const [busy, setBusy] = useState({});        // uid -> "save" | "send"
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(null);
  const [editTopics, setEditTopics] = useState(false);

  useEffect(() => {
    if (!uid || !lessonId) return;
    let cancelled = false;
    (async () => {
      try {
        const l = await fetchLesson(lessonId);
        if (!l) { setError("This lesson no longer exists."); return; }
        const [all, ns, asgs, pn, history] = await Promise.all([fetchClassStudents(l.classId, uid), fetchLessonNotes(lessonId, uid), fetchTutorAssignments(uid), fetchPrivateNotes(lessonId, uid).catch(() => []), fetchClassLessonNotes(l.classId, uid).catch(() => [])]);
        // A lesson made from a session for chosen students only has those students on it
        const st = Array.isArray(l.studentIds) && l.studentIds.length ? all.filter(s => l.studentIds.includes(s.uid)) : all;
        const dayEnd = new Date(`${l.date}T23:59:59`).getTime();
        const forGroup = asgs.filter(a => a.classId === l.classId);
        const last = forGroup.filter(a => a.dueAt && a.dueAt <= dayEnd).sort((a, b) => b.dueAt - a.dueAt)[0] || null;
        const next = forGroup.filter(a => a.dueAt && a.dueAt > dayEnd).sort((a, b) => a.dueAt - b.dueAt)[0] || null;
        const sb = last ? await fetchSubmissionsForAssignment(last.id, uid) : [];
        if (cancelled) return;
        setLesson(l); setStudents(st); setLastHw(last); setNextHw(next); setSubs(sb); setSummary(l.summary || "");
        const byUid = {}; for (const n of ns) byUid[n.uid] = n;
        setNotes(byUid);
        const pv = {}; for (const n of pn) pv[n.uid] = n;
        setPrivates(pv);
        const prev = {};
        for (const n of history) { if (n.lessonId === lessonId || !n.date || n.date >= l.date) continue; if (!prev[n.uid] || n.date > prev[n.uid].date) prev[n.uid] = n; }
        setPrevious(prev);
        const d = {}; for (const s of st) d[s.uid] = draftOf(byUid[s.uid], pv[s.uid]);
        setDrafts(d);
      } catch (e) { if (!cancelled) setError(e.message); }
    })();
    return () => { cancelled = true; };
  }, [uid, lessonId]);

  const say = (msg) => { setFlash(msg); window.clearTimeout(say.t); say.t = window.setTimeout(() => setFlash(null), 3500); };
  const setDraft = (suid, patch) => setDrafts(prev => ({ ...prev, [suid]: { ...prev[suid], ...patch } }));
  const applyToAll = (field, value) => setDrafts(prev => { const out = { ...prev }; for (const k of Object.keys(out)) out[k] = { ...out[k], [field]: value }; return out; });
  const noteData = (s) => {
    const d = drafts[s.uid] || {};
    return {
      studentName: s.displayName || s.email || "", classId: lesson.classId, className: lesson.className || null, tutorId: uid,
      date: lesson.date, topics: lesson.topics || [], summary: summary.trim() || null, attendance: d.attendance || "present",
      www: (d.www || "").trim(), ebi: (d.ebi || "").trim(), extra: (d.extra || "").trim(), text: (d.text || "").trim(),
      homework: homeworkSnapshot(lastHw, subs.find(x => x.uid === s.uid) || null),
      nextHomework: nextHw ? { assignmentId: nextHw.id, title: nextHw.title, dueAt: nextHw.dueAt || null } : null,
    };
  };
  const savePrivate = async (s) => {
    const text = (drafts[s.uid]?.private || "").trim();
    if (text === (privates[s.uid]?.text || "")) return;
    await savePrivateNote(lessonId, s.uid, { text, tutorId: uid, classId: lesson.classId, date: lesson.date, studentName: s.displayName || s.email || "" });
    setPrivates(prev => ({ ...prev, [s.uid]: { ...(prev[s.uid] || {}), text } }));
  };
  const save = async (s, quiet) => {
    setBusy(b => ({ ...b, [s.uid]: "save" })); setError(null);
    try {
      const data = noteData(s);
      await saveLessonNote(lessonId, s.uid, data);
      await savePrivate(s);
      setNotes(prev => ({ ...prev, [s.uid]: { ...(prev[s.uid] || {}), ...data, id: lessonNoteId(lessonId, s.uid) } }));
      if (!quiet) say(`${(s.displayName || "Student").split(" ")[0]}'s note saved.`);
    } catch (e) { setError(e.message); }
    setBusy(b => ({ ...b, [s.uid]: null }));
  };
  const send = async (s) => {
    const d = drafts[s.uid] || {};
    const written = [d.www, d.ebi, d.extra, d.text].some(x => (x || "").trim());
    if (!written && !window.confirm(`Send ${s.displayName || "this student"}'s note with attendance only and nothing written?`)) return;
    setBusy(b => ({ ...b, [s.uid]: "send" })); setError(null);
    try {
      const data = noteData(s);
      await saveLessonNote(lessonId, s.uid, data);
      await savePrivate(s);
      const r = await sendLessonNote(lessonNoteId(lessonId, s.uid));
      setNotes(prev => ({ ...prev, [s.uid]: { ...(prev[s.uid] || {}), ...data, sentAt: Date.now(), sentTo: r.sentTo } }));
    } catch (e) { setError(`${s.displayName || "Student"}: ${e.message}`); }
    setBusy(b => ({ ...b, [s.uid]: null }));
  };
  const saveAttendanceAll = async () => {
    setError(null);
    for (const s of students || []) await save(s, true);
    say("Attendance saved for everyone.");
  };
  const sendAllUnsent = async () => {
    const pending = (students || []).filter(s => !notes[s.uid]?.sentAt && [drafts[s.uid]?.www, drafts[s.uid]?.ebi, drafts[s.uid]?.extra, drafts[s.uid]?.text].some(x => (x || "").trim()));
    if (pending.length === 0) { setError("No written, unsent notes to send."); return; }
    if (!window.confirm(`Send ${pending.length} note${pending.length === 1 ? "" : "s"} now?`)) return;
    for (const s of pending) await send(s);
  };
  const saveTopics = async (topics) => {
    setLesson(l => ({ ...l, topics }));
    try { await updateLesson(lessonId, { topics }); } catch (e) { setError(e.message); }
  };
  const saveSummary = async () => {
    const v = summary.trim();
    if (v === (lesson.summary || "")) return;
    try { await updateLesson(lessonId, { summary: v || null }); setLesson(l => ({ ...l, summary: v || null })); } catch (e) { setError(e.message); }
  };
  const remove = async () => {
    if (!window.confirm("Delete this lesson? Notes already sent stay with the students.")) return;
    try {
      await deleteLesson(lessonId);
      if (lesson?.sessionId) await updateSession(lesson.sessionId, { lessonId: null }).catch(() => {}); // the calendar session can be cancelled or deleted again
      navigate("/tutor/lessons");
    } catch (e) { setError(e.message); }
  };

  if (error && !lesson) return <><PageHeader eyebrow="Lessons" title="Lesson" /><Notice tone="red">{error}</Notice></>;
  if (!lesson) return <PageHeader eyebrow="Lessons" title="Loading…" />;
  const sentCount = (students || []).filter(s => notes[s.uid]?.sentAt).length;
  const counts = (students || []).reduce((c, s) => { const a = drafts[s.uid]?.attendance || "present"; c[a] = (c[a] || 0) + 1; return c; }, {});

  return (
    <>
      <PageHeader eyebrow="Lessons" title={`${lesson.className || lesson.classId} · ${fmtLessonDate(lesson.date)}${lesson.title ? ` · ${lesson.title}` : ""}`}
        sub={students ? `${students.length} student${students.length === 1 ? "" : "s"} · ${sentCount} note${sentCount === 1 ? "" : "s"} sent${lastHw ? ` · homework reviewed: ${lastHw.title}` : " · no homework was due before this lesson"}` : "Loading students…"}
        right={<>
          <Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/tutor/lessons")}>All lessons</Button>
          <Button variant="accent" onClick={sendAllUnsent} disabled={!students}>Send all written</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </>} />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {flash && <Notice tone="green" style={{ marginBottom: 12 }}>{flash}</Notice>}

      <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <CardHeader title="Attendance" sub="Mark everyone, then save. You can write the notes now or come back later." right={<div style={{ display: "flex", gap: 6 }}><Button size="sm" onClick={() => applyToAll("attendance", "present")} disabled={!students}>Mark all present</Button><Button size="sm" variant="accent" onClick={saveAttendanceAll} disabled={!students || Object.values(busy).some(Boolean)}>Save attendance</Button></div>} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {(students || []).map(s => {
            const a = drafts[s.uid]?.attendance || "present";
            const o = ATTENDANCE.find(x => x.id === a) || ATTENDANCE[0];
            return (
              <button key={s.uid} type="button" onClick={() => setDraft(s.uid, { attendance: ATTENDANCE[(ATTENDANCE.findIndex(x => x.id === a) + 1) % ATTENDANCE.length].id })} title="Click to cycle present, late, absent"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px 6px 6px", borderRadius: 999, border: `1px solid ${T.border}`, background: T.card, cursor: "pointer", fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.ink }}>
                <Avatar name={s.displayName} email={s.email} photoURL={s.photoURL} size={24} />
                {(s.displayName || s.email || "Student").split(" ")[0]}
                <Chip tone={o.tone}>{o.label}</Chip>
              </button>
            );
          })}
          <span style={{ fontSize: 11, color: T.muted }}>{counts.present || 0} present{counts.late ? `, ${counts.late} late` : ""}{counts.absent ? `, ${counts.absent} absent` : ""}</span>
        </div>
      </Card>

      <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <CardHeader title="What we covered" sub="Goes into every note from this lesson" right={<Button size="sm" onClick={() => setEditTopics(v => !v)}>{editTopics ? "Done" : "Edit topics"}</Button>} />
        <textarea value={summary} onChange={e => setSummary(e.target.value)} onBlur={saveSummary} rows={2} maxLength={2000}
          placeholder="One or two lines for parents, e.g. pH of strong and weak acids, Ka calculations, strong base pH. Saved when you click away."
          style={textareaStyle} />
        {editTopics ? <TopicPicker board={lesson.board} value={lesson.topics || []} onChange={saveTopics} />
          : <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(lesson.topics || []).length ? lesson.topics.map(t => <Chip key={t} tone="accent">{t}</Chip>) : <span style={{ fontSize: 12, color: T.muted }}>No spec topics ticked. Edit topics to add them.</span>}</div>}
      </Card>

      {students && students.length === 0 && <Card padding={0}><EmptyState icon="users" title="No students in this group yet" body="Place students into the group from the Students tab, then come back to write their notes." /></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(students || []).map(s => {
          const d = drafts[s.uid] || { attendance: "present" };
          const n = notes[s.uid];
          const p = previous[s.uid];
          const hw = homeworkSnapshot(lastHw, subs.find(x => x.uid === s.uid) || null);
          const first = (s.displayName || "they").split(" ")[0];
          const dirty = !!n && (["www", "ebi", "extra", "text"].some(k => (n[k] || "") !== (d[k] || "").trim()) || n.attendance !== d.attendance);
          const o = ATTENDANCE.find(x => x.id === d.attendance) || ATTENDANCE[0];
          return (
            <Card key={s.uid} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <Avatar name={s.displayName} email={s.email} photoURL={s.photoURL} size={32} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>{s.displayName || s.email} <Chip tone={o.tone}>{o.label}</Chip></div>
                  <div style={{ fontSize: 11, color: T.muted }}>{s.parentEmail ? `Parent: ${s.parentEmail}` : "No parent email on file, the note goes to the student"}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {ATTENDANCE.map(x => <Button key={x.id} size="sm" variant={d.attendance === x.id ? "primary" : "secondary"} onClick={() => setDraft(s.uid, { attendance: x.id })}>{x.label}</Button>)}
                </div>
              </div>
              {hw && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 12, color: T.muted }}>
                  <span>Homework "{hw.title}":</span>
                  <Chip tone={hw.status === "submitted" ? (hw.pct >= 75 ? "green" : hw.pct >= 50 ? "amber" : "red") : hw.status === "in-progress" ? "amber" : "red"}>
                    {hw.status === "submitted" ? `${hw.score}/${hw.maxScore} (${hw.pct}%)` : hw.status === "in-progress" ? "Started, not finished" : "Not started"}
                  </Chip>
                  {hw.weak.map(w => <Chip key={w} tone="neutral">{w}</Chip>)}
                </div>
              )}
              {p && (p.ebi || p.text) && <div style={{ fontSize: 12, color: T.muted, background: T.soft, borderRadius: T.radiusSm, padding: "8px 10px" }}><strong>Last time ({fmtLessonDate(p.date)}):</strong> {p.ebi ? `even better if ${p.ebi}` : p.text}</div>}
              <div className="cm-grid-2" style={{ gap: 10 }}>
                <NoteField id={`www-${s.uid}`} label="What went well" tone={T.green} value={d.www || ""} onChange={v => setDraft(s.uid, { www: v })} onAll={() => applyToAll("www", d.www || "")}
                  placeholder={`e.g. ${first} set out the Ka calculation clearly and got the pH right first time.`} />
                <NoteField id={`ebi-${s.uid}`} label="Even better if" tone={T.amber} value={d.ebi || ""} onChange={v => setDraft(s.uid, { ebi: v })} onAll={() => applyToAll("ebi", d.ebi || "")}
                  placeholder={`e.g. ${first} practised the weak acid assumptions and when they break down.`} />
              </div>
              {(d.text || n?.text) ? <NoteField id={`text-${s.uid}`} label="Note (older format)" value={d.text || ""} onChange={v => setDraft(s.uid, { text: v })} placeholder="" /> : null}
              <details>
                <summary style={{ fontSize: 12, fontWeight: 600, color: T.muted, cursor: "pointer" }}>Extra notes for home and a private note{(d.extra || d.private) ? " · written" : ""}</summary>
                <div className="cm-grid-2" style={{ gap: 10, marginTop: 8 }}>
                  <NoteField id={`extra-${s.uid}`} label="Extra notes (sent to the parent)" value={d.extra || ""} onChange={v => setDraft(s.uid, { extra: v })} placeholder="Anything else the parent should know." />
                  <NoteField id={`priv-${s.uid}`} label="Private note (only you and HSJ see this)" tone={T.indigo} value={d.private || ""} onChange={v => setDraft(s.uid, { private: v })} placeholder="e.g. seemed tired, check in next week. Never emailed." />
                </div>
              </details>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Button variant="accent" size="sm" onClick={() => send(s)} disabled={!!busy[s.uid]}>{busy[s.uid] === "send" ? "Sending…" : n?.sentAt ? "Send again" : "Save and send"}</Button>
                <Button size="sm" onClick={() => save(s)} disabled={!!busy[s.uid]}>{busy[s.uid] === "save" ? "Saving…" : "Save draft"}</Button>
                {n?.sentAt && <Chip tone={dirty ? "amber" : "green"}>{dirty ? `Sent ${fmtWhen(n.sentAt)}, edited since` : `Sent ${fmtWhen(n.sentAt)} to ${(n.sentTo || []).join(", ")}`}</Chip>}
                {!n?.sentAt && n && <Chip tone="neutral">Draft saved</Chip>}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

const textareaStyle = { width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.ink, resize: "vertical" };

const draftOf = (n, p) => ({ attendance: n?.attendance || "present", www: n?.www || "", ebi: n?.ebi || "", extra: n?.extra || "", text: n?.text || "", private: p?.text || "" });

function NoteField({ id, label: lbl, tone, value, onChange, onAll, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label htmlFor={id} style={{ ...label, color: tone || T.muted }}>{lbl}</label>
        {onAll && value.trim() && <button type="button" onClick={onAll} style={{ border: "none", background: "transparent", color: T.accentText, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: T.font }}>Use for everyone</button>}
      </div>
      <textarea id={id} value={value} onChange={e => onChange(e.target.value)} rows={2} maxLength={2000} placeholder={placeholder} style={{ ...textareaStyle, fontSize: 13, borderLeft: tone ? `3px solid ${tone}` : textareaStyle.border }} />
    </div>
  );
}
