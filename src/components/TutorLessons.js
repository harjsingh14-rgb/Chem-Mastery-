// Lessons tab: a lesson per group per date (topics covered), then one note
// per student with attendance, the tutor's comment and the week's homework
// record, emailed to the parent with the student copied.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLesson, updateLesson, deleteLesson, fetchTutorLessons, fetchLesson, fetchTutorClasses, fetchClassStudents,
  fetchLessonNotes, saveLessonNote, lessonNoteId, sendLessonNote, fetchTutorAssignments, fetchSubmissionsForAssignment } from "../firebase";
import { T, boardLabel } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Avatar } from "../ui/components";
import { SELF_EVALUATION } from "../data/self-evaluation";
import { lastOccurrence, describeSchedule } from "../utils/schedule";

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
  const [error, setError] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(today());
  const [topics, setTopics] = useState([]);
  const [creating, setCreating] = useState(false);
  const uid = authUser?.uid;

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    Promise.all([fetchTutorClasses(uid), fetchTutorLessons(uid)])
      .then(([g, l]) => { if (!cancelled) { setGroups(g); setLessons(l); if (g[0]) setClassId(g[0].code); if (l.length === 0) setShowNew(true); } })
      .catch(e => { if (!cancelled) { setError(e.message); setGroups([]); setLessons([]); } });
    return () => { cancelled = true; };
  }, [uid]);

  const group = groups?.find(g => g.code === classId);
  const pickGroup = (code) => {
    setClassId(code);
    const g = groups?.find(x => x.code === code);
    const last = g?.schedule ? lastOccurrence(g.schedule) : null;
    if (last) setDate(last);
  };
  useEffect(() => { if (group?.schedule) { const last = lastOccurrence(group.schedule); if (last) setDate(last); } }, [group]); // eslint-disable-line react-hooks/exhaustive-deps
  const create = async () => {
    if (!group || !date) return;
    setCreating(true); setError(null);
    try {
      const l = await createLesson(uid, { classId: group.code, className: group.name, board: group.board, date, topics });
      navigate(`/tutor/lessons/${l.id}`);
    } catch (e) { setError(e.message); setCreating(false); }
  };

  return (
    <>
      <PageHeader eyebrow="Lessons" title="Lesson notes" sub="Record each lesson, then write and send a note per student. Parents get it by email with the student copied."
        right={<Button variant="primary" icon="plus" onClick={() => setShowNew(v => !v)}>New lesson</Button>} />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {groups && groups.length === 0 && <Card padding={0}><EmptyState icon="users" title="Create a group first" body="Lessons belong to a group. Create one on the Overview tab." action={<Button variant="primary" onClick={() => navigate("/tutor")}>Overview</Button>} /></Card>}
      {showNew && groups && groups.length > 0 && (
        <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <CardHeader title="New lesson" sub="Which group, when, and what you covered. You can change the topics afterwards." />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><label style={label} htmlFor="ls-group">Group</label>
              <select id="ls-group" value={classId} onChange={e => pickGroup(e.target.value)} style={selectStyle}>{groups.map(g => <option key={g.code} value={g.code}>{g.name} ({boardLabel(g.board)}{g.schedule ? `, ${describeSchedule(g.schedule)}` : ""})</option>)}</select></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><label style={label} htmlFor="ls-date">Lesson date</label><Input id="ls-date" type="date" value={date} onChange={e => setDate(e.target.value)} />{group?.schedule && <span style={{ fontSize: 11, color: T.muted }}>Defaults to the latest {describeSchedule(group.schedule).split(" ")[0].replace(/s$/, "")} lesson</span>}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={label}>Topics covered</span><TopicPicker board={group?.board} value={topics} onChange={setTopics} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="accent" onClick={create} disabled={creating || !group || !date}>{creating ? "Creating…" : "Create lesson and write notes"}</Button>
            {lessons && lessons.length > 0 && <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>}
          </div>
        </Card>
      )}
      <Card padding={0}>
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
      </Card>
    </>
  );
}

const pctOf = (n, d) => d ? Math.round((n / d) * 100) : null;

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
  const [drafts, setDrafts] = useState({});    // uid -> { attendance, text }
  const [lastHw, setLastHw] = useState(null);
  const [nextHw, setNextHw] = useState(null);
  const [subs, setSubs] = useState([]);
  const [busy, setBusy] = useState({});        // uid -> "save" | "send"
  const [error, setError] = useState(null);
  const [editTopics, setEditTopics] = useState(false);

  useEffect(() => {
    if (!uid || !lessonId) return;
    let cancelled = false;
    (async () => {
      try {
        const l = await fetchLesson(lessonId);
        if (!l) { setError("This lesson no longer exists."); return; }
        const [st, ns, asgs] = await Promise.all([fetchClassStudents(l.classId, uid), fetchLessonNotes(lessonId, uid), fetchTutorAssignments(uid)]);
        const dayEnd = new Date(`${l.date}T23:59:59`).getTime();
        const forGroup = asgs.filter(a => a.classId === l.classId);
        const last = forGroup.filter(a => a.dueAt && a.dueAt <= dayEnd).sort((a, b) => b.dueAt - a.dueAt)[0] || null;
        const next = forGroup.filter(a => a.dueAt && a.dueAt > dayEnd).sort((a, b) => a.dueAt - b.dueAt)[0] || null;
        const sb = last ? await fetchSubmissionsForAssignment(last.id, uid) : [];
        if (cancelled) return;
        setLesson(l); setStudents(st); setLastHw(last); setNextHw(next); setSubs(sb);
        const byUid = {}; for (const n of ns) byUid[n.uid] = n;
        setNotes(byUid);
        const d = {}; for (const s of st) d[s.uid] = { attendance: byUid[s.uid]?.attendance || "present", text: byUid[s.uid]?.text || "" };
        setDrafts(d);
      } catch (e) { if (!cancelled) setError(e.message); }
    })();
    return () => { cancelled = true; };
  }, [uid, lessonId]);

  const setDraft = (suid, patch) => setDrafts(prev => ({ ...prev, [suid]: { ...prev[suid], ...patch } }));
  const noteData = (s) => {
    const d = drafts[s.uid] || {};
    return {
      studentName: s.displayName || s.email || "", classId: lesson.classId, className: lesson.className || null, tutorId: uid,
      date: lesson.date, topics: lesson.topics || [], attendance: d.attendance || "present", text: (d.text || "").trim(),
      homework: homeworkSnapshot(lastHw, subs.find(x => x.uid === s.uid) || null),
      nextHomework: nextHw ? { assignmentId: nextHw.id, title: nextHw.title, dueAt: nextHw.dueAt || null } : null,
    };
  };
  const save = async (s) => {
    setBusy(b => ({ ...b, [s.uid]: "save" })); setError(null);
    try {
      const data = noteData(s);
      await saveLessonNote(lessonId, s.uid, data);
      setNotes(prev => ({ ...prev, [s.uid]: { ...(prev[s.uid] || {}), ...data, id: lessonNoteId(lessonId, s.uid) } }));
    } catch (e) { setError(e.message); }
    setBusy(b => ({ ...b, [s.uid]: null }));
  };
  const send = async (s) => {
    const d = drafts[s.uid] || {};
    if (!(d.text || "").trim() && !window.confirm(`Send ${s.displayName || "this student"}'s note with attendance only and no comment?`)) return;
    setBusy(b => ({ ...b, [s.uid]: "send" })); setError(null);
    try {
      const data = noteData(s);
      await saveLessonNote(lessonId, s.uid, data);
      const r = await sendLessonNote(lessonNoteId(lessonId, s.uid));
      setNotes(prev => ({ ...prev, [s.uid]: { ...(prev[s.uid] || {}), ...data, sentAt: Date.now(), sentTo: r.sentTo } }));
    } catch (e) { setError(`${s.displayName || "Student"}: ${e.message}`); }
    setBusy(b => ({ ...b, [s.uid]: null }));
  };
  const sendAllUnsent = async () => {
    const pending = (students || []).filter(s => !notes[s.uid]?.sentAt && (drafts[s.uid]?.text || "").trim());
    if (pending.length === 0) { setError("No written, unsent notes to send."); return; }
    if (!window.confirm(`Send ${pending.length} note${pending.length === 1 ? "" : "s"} now?`)) return;
    for (const s of pending) await send(s); // eslint-disable-line no-await-in-loop
  };
  const saveTopics = async (topics) => {
    setLesson(l => ({ ...l, topics }));
    try { await updateLesson(lessonId, { topics }); } catch (e) { setError(e.message); }
  };
  const remove = async () => {
    if (!window.confirm("Delete this lesson? Notes already sent stay with the students.")) return;
    try { await deleteLesson(lessonId); navigate("/tutor/lessons"); } catch (e) { setError(e.message); }
  };

  if (error && !lesson) return <><PageHeader eyebrow="Lessons" title="Lesson" /><Notice tone="red">{error}</Notice></>;
  if (!lesson) return <PageHeader eyebrow="Lessons" title="Loading…" />;
  const sentCount = (students || []).filter(s => notes[s.uid]?.sentAt).length;

  return (
    <>
      <PageHeader eyebrow="Lessons" title={`${lesson.className || lesson.classId} · ${fmtLessonDate(lesson.date)}`}
        sub={students ? `${students.length} student${students.length === 1 ? "" : "s"} · ${sentCount} note${sentCount === 1 ? "" : "s"} sent${lastHw ? ` · homework reviewed: ${lastHw.title}` : " · no homework was due before this lesson"}` : "Loading students…"}
        right={<>
          <Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/tutor/lessons")}>All lessons</Button>
          <Button variant="accent" onClick={sendAllUnsent} disabled={!students}>Send all written</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </>} />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}

      <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <CardHeader title="Topics covered" sub="Goes into every note from this lesson" right={<Button size="sm" onClick={() => setEditTopics(v => !v)}>{editTopics ? "Done" : "Edit"}</Button>} />
        {editTopics ? <TopicPicker board={lesson.board} value={lesson.topics || []} onChange={saveTopics} />
          : <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(lesson.topics || []).length ? lesson.topics.map(t => <Chip key={t} tone="accent">{t}</Chip>) : <span style={{ fontSize: 13, color: T.muted }}>No topics ticked yet.</span>}</div>}
      </Card>

      {students && students.length === 0 && <Card padding={0}><EmptyState icon="users" title="No students in this group yet" body="Place students into the group from the Students tab, then come back to write their notes." /></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(students || []).map(s => {
          const d = drafts[s.uid] || { attendance: "present", text: "" };
          const n = notes[s.uid];
          const hw = homeworkSnapshot(lastHw, subs.find(x => x.uid === s.uid) || null);
          const dirty = n && (n.text !== (d.text || "").trim() || n.attendance !== d.attendance);
          return (
            <Card key={s.uid} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <Avatar name={s.displayName} email={s.email} photoURL={s.photoURL} size={32} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700 }}>{s.displayName || s.email}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{s.parentEmail ? `Parent: ${s.parentEmail}` : "No parent email on file, the note goes to the student"}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {ATTENDANCE.map(o => <Button key={o.id} size="sm" variant={d.attendance === o.id ? "primary" : "secondary"} onClick={() => setDraft(s.uid, { attendance: o.id })}>{o.label}</Button>)}
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
              <textarea value={d.text} onChange={e => setDraft(s.uid, { text: e.target.value })} rows={3} maxLength={3000}
                placeholder={`What ${(s.displayName || "they").split(" ")[0]} did well, what to work on, anything the parent should know.`}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.ink, resize: "vertical" }} />
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
