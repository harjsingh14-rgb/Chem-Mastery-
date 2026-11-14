// One student's page for tutors and admins (/tutor/students/:uid): who they
// are and how to reach the family on the left; tabs on the right for the
// overview, attendance and notes, homework, payments and the agreement
// details. "Parent view" opens the page the parent sees for this student.
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfiles, fetchClass, fetchAllClasses, fetchStudentLessonNotes, fetchStudentPrivateNotes, fetchPayments, fetchStudentSessions, fetchAttemptsForUser, setStudentName, setStudentPhoto, studentsApi } from "../firebase";
import { T, boardLabel, pctColour } from "../ui/theme";
import { Card, CardHeader, Chip, StatTile, Tabs, EmptyState, Notice, Table, th, td, Button, Input, Icon, AccuracyBar, chipToneForPct } from "../ui/components";
import { summarise, relativeTime, TYPE_LABEL, attemptTime } from "../utils/analytics";
import { TutorErrorLog } from "./ErrorLogCard";
import { fmtTime, describeSlots, slotsOf, sessionEndMs, fmtLessonDay } from "../utils/schedule";
import { NoteBody } from "./StudentLessons";
import { useHomework } from "./StudentHomework";
import { money, paymentPlanLabel } from "../data/terms";
import { ragCounts, subtopicTitle, SELF_EVALUATION } from "../data/self-evaluation";
import { QUESTIONNAIRE_SECTIONS } from "../data/parent-questionnaire";
import { PAYMENT_TONE, paymentStatusLabel } from "./StudentPanels";
import { fmtDue } from "../utils/homeworkDates";
import PhotoUpload from "./PhotoUpload";
import { can } from "../utils/privileges";

const toMs = (v) => v?.toMillis ? v.toMillis() : typeof v === "number" ? v : v ? new Date(v).getTime() : null;
const fmtDate = (v) => { const ms = toMs(v); return ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""; };
const fmtIso = (iso) => { const d = new Date(`${iso}T00:00:00`); return Number.isNaN(d.getTime()) ? iso || "" : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); };
const ATT = { present: ["green", "Present"], late: ["amber", "Late"], absent: ["red", "Absent"] };
const TABS = [
  { id: "overview", label: "Overview" }, { id: "notes", label: "Attendance & notes" }, { id: "homework", label: "Homework" },
  { id: "payments", label: "Payments" }, { id: "details", label: "Details" },
];

export default function StudentProfile({ authUser, userProfile, uid, initialTab }) {
  const navigate = useNavigate();
  const isAdmin = userProfile?.role === "admin";
  const canFamily = can(userProfile, "family");
  const tabs = canFamily ? TABS : TABS.filter(t => t.id !== "payments" && t.id !== "details");
  const tutorUid = authUser?.uid;
  const [student, setStudent] = useState(undefined);
  const [group, setGroup] = useState(null);
  const [notes, setNotes] = useState(null);
  const [privateNotes, setPrivateNotes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [tab, setTab] = useState(tabs.some(t => t.id === initialTab) ? initialTab : "overview");
  const [error, setError] = useState(null);
  const [nameEdit, setNameEdit] = useState(null);
  // "View as student": the student pages open with this student's account in
  // place of the admin's (App.js reads this on load). Read only.
  const viewAsStudent = () => {
    if (!student) return;
    try {
      const profile = JSON.parse(JSON.stringify(student));
      sessionStorage.setItem("hsj-view-as", JSON.stringify({ uid, user: { uid, email: student.email || "", displayName: student.displayName || "", photoURL: student.photoURL || "" }, profile }));
    } catch { setError("Could not open the student view in this browser."); return; }
    window.location.assign(`/${student.board || "aqa"}`);
  };

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    setStudent(undefined); setError(null);
    fetchUserProfiles([uid]).then(async ([p]) => {
      if (!alive) return;
      if (!p) { setStudent(null); return; }
      setStudent(p);
      const mine = isAdmin ? null : tutorUid;
      const [g, n, pn, ses, att] = await Promise.all([
        p.classId ? fetchClass(p.classId).catch(() => null) : null,
        fetchStudentLessonNotes(uid, mine).catch(() => []),
        fetchStudentPrivateNotes(uid, mine).catch(() => []),
        fetchStudentSessions(uid, p.classId).catch(() => []),
        fetchAttemptsForUser(uid).catch(() => []),
      ]);
      if (!alive) return;
      setGroup(g); setNotes(n); setPrivateNotes(pn); setSessions(ses); setAttempts(att);
    }).catch(e => { if (alive) { setError(e.message); setStudent(null); } });
    return () => { alive = false; };
  }, [uid, tutorUid, isAdmin]);

  const sum = useMemo(() => summarise(attempts), [attempts]);
  const counts = useMemo(() => (notes || []).reduce((c, n) => { c[n.attendance || "unknown"] = (c[n.attendance || "unknown"] || 0) + 1; return c; }, {}), [notes]);
  const noted = (notes || []).filter(n => ATT[n.attendance]).length;
  const attended = (counts.present || 0) + (counts.late || 0);
  const canEdit = !!student && (isAdmin || student.tutorId === tutorUid) && can(userProfile, "editStudents");
  const name = student?.displayName || (student?.email ? student.email.split("@")[0] : "Student");

  const saveName = async () => {
    if (!nameEdit || nameEdit.value.trim().length < 2) return;
    setNameEdit({ ...nameEdit, saving: true });
    try { await setStudentName(uid, nameEdit.value); setStudent(s => ({ ...s, displayName: nameEdit.value.trim() })); setNameEdit(null); }
    catch (e) { setError(e.message); setNameEdit({ ...nameEdit, saving: false }); }
  };
  const savePhoto = async (url) => { await setStudentPhoto(uid, url); setStudent(s => ({ ...s, photoURL: url || "" })); };

  if (student === undefined) return <div style={{ color: T.muted, padding: 20 }}>Loading…</div>;
  if (student === null) return (
    <>
      <Button variant="ghost" icon="arrowLeft" onClick={() => navigate("/tutor/students")}>All students</Button>
      {error && <Notice tone="red">{error}</Notice>}
      <Card padding={0}><EmptyState icon="users" title="Student not found" body="This account may have been removed, or it is not one of your students." /></Card>
    </>
  );

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Button variant="ghost" icon="arrowLeft" onClick={() => navigate("/tutor/students")}>All students</Button>
        <div style={{ flex: 1 }} />
        {isAdmin && <Button icon="flask" onClick={viewAsStudent} title="See the app exactly as this student sees it (read only)">View as student</Button>}
        {canFamily && <Button icon="users" onClick={() => navigate(`/tutor/students/${uid}/parent`)}>Parent view</Button>}
        {isAdmin && <Button icon="message" onClick={() => navigate(`/tutor/students/email?uid=${uid}`)}>Email</Button>}
        {group && <Button icon="calendar" onClick={() => navigate("/tutor/calendar")}>Calendar</Button>}
      </div>
      {error && <Notice tone="red">{error}</Notice>}

      <div className="cm-two-col">
        <aside style={{ flex: "0 1 300px", minWidth: 260, display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <PhotoUpload name={student.displayName} email={student.email} photoURL={student.photoURL} size={104} canEdit={canEdit} onSave={savePhoto} />
            {nameEdit ? (
              <form style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }} onSubmit={e => { e.preventDefault(); saveName(); }}>
                <Input autoFocus value={nameEdit.value} onChange={e => setNameEdit({ ...nameEdit, value: e.target.value })} placeholder="Student's name" style={{ width: 190 }} />
                <Button type="submit" size="sm" variant="accent" disabled={nameEdit.saving || nameEdit.value.trim().length < 2}>Save</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setNameEdit(null)}>Cancel</Button>
              </form>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <h1 style={{ margin: 0, fontFamily: T.display, fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{name}</h1>
                {canEdit && <button type="button" title="Edit name" onClick={() => setNameEdit({ uid, value: student.displayName || "", saving: false })} style={{ border: "none", background: "none", cursor: "pointer", color: T.faint, padding: 2, display: "inline-flex" }}><Icon name="pencil" size={14} /></button>}
              </div>
            )}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
              {student.className && <Chip tone="accent">{student.className}</Chip>}
              {student.year && <Chip>Year {student.year}</Chip>}
              {student.board && <Chip>{boardLabel(student.board)}</Chip>}
              {student.needsPasswordChange && <Chip tone="amber">Not logged in yet</Chip>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", textAlign: "left", fontSize: 13, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
              <Row label="Email"><a className="cm-link" href={`mailto:${student.email}`}>{student.email}</a></Row>
              {group && <Row label="Lessons">{describeSlots(slotsOf(group)) || group.lessonSlot || "Not set"}</Row>}
              <Row label="Started">{fmtDate(student.placedAt || student.joinedClassAt || student.createdAt) || "–"}</Row>
              <Row label="Last active">{sum.last ? relativeTime(sum.last) : "No practice yet"}</Row>
            </div>
          </Card>

          {isAdmin && <GroupCard student={student} onMoved={patch => { setStudent(s => ({ ...s, ...patch })); fetchClass(patch.classId).then(setGroup).catch(() => setGroup(null)); }} />}
          {isAdmin && <AccessCard student={student} onChange={patch => setStudent(s => ({ ...s, ...patch }))} />}

          {canFamily && <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CardHeader title="Family" />
            {(student.parentName || student.parentEmail) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{student.parentName || "Parent"}</span>
                {student.parentEmail && <a className="cm-link" href={`mailto:${student.parentEmail}`} style={{ fontWeight: 500 }}>{student.parentEmail}</a>}
                {student.parentPhone && <a className="cm-link" href={`tel:${student.parentPhone}`} style={{ fontWeight: 500 }}>{student.parentPhone}</a>}
                <span style={{ fontSize: 12, color: T.muted }}>{student.parentUid ? "Has a parent login" : "No parent login yet"}{student.agreement?.acceptedAt ? ` · agreement accepted ${fmtDate(student.agreement.acceptedAt)}` : student.agreement?.agreedBeforePlatform ? " · agreed before the platform" : " · agreement not accepted"}</span>
                <span style={{ fontSize: 12, color: T.muted }}>
                  {student.parentQuestionnaire ? `Questionnaire answered ${fmtDate(student.parentQuestionnaire.submittedAt)} · ` : "Questionnaire not answered yet · "}
                  <button type="button" onClick={() => setTab("details")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", fontWeight: 600, color: T.accentText }}>{student.parentQuestionnaire ? "read the answers" : "see the Details tab"}</button>
                </span>
              </div>
            ) : <span style={{ fontSize: 13, color: T.muted }}>No parent details on file.</span>}
          </Card>}
        </aside>

        <div className="cm-main-col">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />

          {tab === "overview" && (
            <>
              <div className="cm-grid-4">
                <StatTile label="Attendance" value={noted ? `${Math.round((attended / noted) * 100)}%` : "–"} sub={noted ? `${attended} of ${noted} lessons` : "No lessons noted yet"} icon="calendar" tone="green" onClick={() => setTab("notes")} />
                <StatTile label="Answers · 7 days" value={sum.week} sub={`${sum.month} in the last 30 days`} icon="bolt" />
                <StatTile label="Accuracy · 30 days" value={sum.monthPct === null ? "–" : `${sum.monthPct}%`} sub={sum.trend === null ? "Needs a few answers each week" : `${sum.trend >= 0 ? "▲" : "▼"} ${Math.abs(sum.trend)} pts on last week`} subTone={sum.trend === null ? undefined : sum.trend >= 0 ? "green" : "red"} icon="target" tone="indigo" />
                <StatTile label="Lesson notes" value={notes === null ? "…" : notes.length} sub={`${(notes || []).filter(n => n.sentAt).length} sent to the parent`} icon="pencil" tone="amber" onClick={() => setTab("notes")} />
              </div>
              <div className="cm-two-col">
                <div className="cm-main-col">
                  <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <CardHeader title="Coming up" sub="This student's lessons and any sessions just for them" />
                    <Upcoming sessions={sessions} />
                  </Card>
                  <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <CardHeader title="Latest lesson note" right={notes && notes.length > 0 ? <Button size="sm" onClick={() => setTab("notes")}>All notes</Button> : null} />
                    {notes === null && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
                    {notes && notes.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing written yet. Take attendance from the calendar or the week list after a lesson.</span>}
                    {notes && notes[0] && <NoteBody n={notes[0]} />}
                  </Card>
                </div>
                <aside className="cm-side-col">
                  <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <CardHeader title="Needs work" sub="Lowest-scoring topics (3+ answers)" />
                    {sum.weak.filter(t => t.pct < 75).length === 0 && <span style={{ fontSize: 13, color: T.muted }}>{sum.total ? "Nothing under 75% yet." : "No answers recorded yet."}</span>}
                    {sum.weak.filter(t => t.pct < 75).map(t => (
                      <div key={t.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}><span>{t.label}</span><span style={{ fontWeight: 700, color: pctColour(t.pct) }}>{t.pct}% <span style={{ color: T.faint, fontWeight: 400 }}>({t.c}/{t.n})</span></span></div>
                        <AccuracyBar pct={t.pct} width="100%" />
                      </div>
                    ))}
                  </Card>
                  <TutorErrorLog uid={uid} />
                  <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <CardHeader title="Recent answers" />
                    {sum.recent.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing yet.</span>}
                    {sum.recent.slice(0, 8).map(a => (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "3px 0" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.correct ? T.green : T.red, flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, width: 44, color: T.muted }}>{TYPE_LABEL[a.type] || a.type}</span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.topicLabel || a.topic || a.questionId}</span>
                        <span style={{ color: T.muted, flexShrink: 0 }}>{relativeTime(attemptTime(a))}</span>
                      </div>
                    ))}
                  </Card>
                </aside>
              </div>
            </>
          )}

          {tab === "notes" && (
            <>
              <div className="cm-grid-4">
                <StatTile label="Lessons noted" value={notes === null ? "…" : noted} sub={group ? describeSlots(slotsOf(group)) || group.name : ""} />
                <StatTile label="Present" value={counts.present || 0} sub={noted ? `${Math.round(((counts.present || 0) / noted) * 100)}% of lessons` : ""} />
                <StatTile label="Late" value={counts.late || 0} subTone={counts.late ? "amber" : undefined} />
                <StatTile label="Absent" value={counts.absent || 0} subTone={counts.absent ? "red" : undefined} />
              </div>
              <Card padding={0}>
                <CardHeader title="Attendance and notes" sub="One row per lesson. Open a row to read or edit the note; private notes are yours only." style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
                {notes === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
                {notes && notes.length === 0 && <EmptyState icon="calendar" title="No lessons noted yet" body="After a lesson, open it from the calendar or the week list and take attendance. The note you write appears here and can be sent to the parent." />}
                {notes && notes.length > 0 && (
                  <Table minWidth={640}>
                    <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Lesson</th><th style={th}>Attendance</th><th style={th}>Note</th><th style={th}>Private</th><th style={{ ...th, paddingRight: 20 }}>Sent</th></tr></thead>
                    <tbody>
                      {notes.map(n => {
                        const [tone, label] = ATT[n.attendance] || ["neutral", "Not marked"];
                        const pn = privateNotes.find(p => p.lessonId === n.lessonId);
                        const pnText = pn ? (pn.text || pn.note || pn.body || "") : "";
                        return (
                          <tr key={n.id} className="cm-row-hover" onClick={() => navigate(`/tutor/lessons/${n.lessonId}`)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                            <td style={{ ...td, paddingLeft: 20, whiteSpace: "nowrap" }}><div style={{ fontWeight: 600 }}>{fmtIso(n.date)}</div>{n.topics?.length ? <div style={{ fontSize: 11, color: T.muted, whiteSpace: "normal" }}>{n.topics.join(", ")}</div> : null}</td>
                            <td style={td}><Chip tone={tone}>{label}</Chip></td>
                            <td style={{ ...td, color: T.body, maxWidth: 360 }}>
                              {n.www || n.ebi || n.text || n.summary ? <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.www || n.text || n.summary || n.ebi}</span> : <span style={{ color: T.faint }}>No note yet</span>}
                            </td>
                            <td style={{ ...td, color: T.muted, maxWidth: 200 }}>{pnText ? <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={pnText}>{pnText}</span> : <span style={{ color: T.faint }}>–</span>}</td>
                            <td style={{ ...td, paddingRight: 20 }}>{n.sentAt ? <Chip tone="green">Sent {fmtDate(n.sentAt)}</Chip> : <Chip tone="neutral">Not sent</Chip>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card>
              {privateNotes.filter(p => !(notes || []).some(n => n.lessonId === p.lessonId)).length > 0 && (
                <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <CardHeader title="Other private notes" sub="Your own record; never sent" />
                  {privateNotes.filter(p => !(notes || []).some(n => n.lessonId === p.lessonId)).map(p => (
                    <div key={p.id} style={{ fontSize: 13, color: T.body, padding: "8px 12px", background: T.soft, borderRadius: 8 }}><strong>{fmtIso(p.date)}</strong> {p.text || p.note || p.body || ""}</div>
                  ))}
                </Card>
              )}
            </>
          )}

          {tab === "homework" && <HomeworkTab student={student} />}
          {tab === "payments" && canFamily && <PaymentsTab student={student} isAdmin={isAdmin} />}
          {tab === "details" && canFamily && <DetailsTab student={student} group={group} isAdmin={isAdmin} onChange={patch => setStudent(st => ({ ...st, ...patch }))} />}
        </div>
      </div>
    </>
  );
}

const loginMs = (u) => u?.lastLogin?.toMillis ? u.lastLogin.toMillis() : (u?.lastLogin?.seconds ? u.lastLogin.seconds * 1000 : null);

/** Admin: the student's (and parent's) login, with new login details, a password reset and an on/off switch. */
/** Admins: which group (and so which tutor) the student is in, with a move control. */
function GroupCard({ student, onMoved }) {
  const [classes, setClasses] = useState(null);
  const [tutors, setTutors] = useState({});
  const [choice, setChoice] = useState("");
  const [moving, setMoving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!moving || classes) return;
    fetchAllClasses().then(async cs => {
      setClasses(cs);
      const ids = Array.from(new Set(cs.map(c => c.tutorId).filter(Boolean)));
      try { const ps = await fetchUserProfiles(ids); setTutors(Object.fromEntries(ps.map(p => [p.uid, p.displayName || p.email]))); } catch { /* names are a nicety */ }
    }).catch(e => setMsg(e.message));
  }, [moving, classes]);
  const move = async () => {
    const target = (classes || []).find(c => c.code === choice);
    if (!target) return;
    if (!window.confirm(`Move ${student.displayName || "this student"} to ${target.name || target.code}${target.tutorId ? ` with ${tutors[target.tutorId] || "its tutor"}` : ""}? Their lessons, homework and notes from now on belong to that group.`)) return;
    setBusy(true); setMsg(null);
    try {
      const r = await studentsApi("move", { uid: student.uid, groupCode: choice });
      onMoved({ classId: r.classId, className: r.className, tutorId: r.tutorId, board: r.board });
      setMoving(false); setChoice(""); setMsg(`Moved to ${r.className}.`);
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  };
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <CardHeader title="Group" sub={student.className || "Not in a group"} right={!moving && <Button size="sm" variant="secondary" onClick={() => setMoving(true)}>{student.className ? "Move" : "Place"}</Button>} />
      {moving && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <select value={choice} onChange={e => setChoice(e.target.value)} style={{ padding: "9px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, background: T.card }}>
            <option value="">{classes ? "Choose a group" : "Loading groups…"}</option>
            {(classes || []).filter(c => c.code !== student.classId).map(c => <option key={c.code} value={c.code}>{c.name || c.code}{c.tutorId ? ` · ${tutors[c.tutorId] || "tutor"}` : " · no tutor"}{c.board ? ` · ${boardLabel(c.board)}` : ""}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="primary" onClick={move} disabled={!choice || busy}>{busy ? "Moving…" : "Move student"}</Button>
            <Button size="sm" variant="ghost" onClick={() => { setMoving(false); setChoice(""); }}>Cancel</Button>
          </div>
          <span style={{ fontSize: 12, color: T.muted }}>The student's tutor becomes the new group's tutor. Past lesson notes stay with the lessons they were written on.</span>
        </div>
      )}
      {msg && <Notice tone={/^Moved/.test(msg) ? "green" : "red"}>{msg}</Notice>}
    </Card>
  );
}

function AccessCard({ student, onChange }) {
  const navigate = useNavigate();
  const [parent, setParent] = useState(null);
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const parentUid = student.parentUid || null;
  useEffect(() => {
    let alive = true;
    if (!parentUid) { setParent(null); return undefined; }
    fetchUserProfiles([parentUid]).then(([p]) => { if (alive) setParent(p || null); }).catch(() => {});
    return () => { alive = false; };
  }, [parentUid]);

  const run = async (who, op) => {
    const target = who === "parent" ? parent : student;
    if (!target) return;
    const first = (target.displayName || target.email || "them").split(" ")[0];
    const ask = op === "disable" ? `Switch off ${first}'s access? They will not be able to log in until it is switched back on.`
      : op === "enable" ? null
      : `Email ${first} a new temporary password? Their current password stops working${who === "student" && student.parentEmail ? ", and the parent is copied in" : ""}.`;
    if (ask && !window.confirm(ask)) return;
    setBusy(`${who}:${op}`); setMsg(null);
    try {
      const r = await studentsApi("access", { uid: target.uid, op });
      const patch = op === "disable" || op === "enable" ? { accessDisabled: r.accessDisabled } : { needsPasswordChange: true };
      if (who === "parent") setParent(p => ({ ...p, ...patch })); else onChange(patch);
      setMsg({ tone: "green", text: op === "disable" ? `${first}'s access is switched off.` : op === "enable" ? `${first}'s access is back on.` : `Sent to ${r.sentTo}${r.cc ? `, copied to ${r.cc}` : ""}.` });
    } catch (e) { setMsg({ tone: "red", text: e.message }); }
    setBusy(null);
  };

  const remove = async () => {
    const first = (student.displayName || student.email || "this student").split(" ")[0];
    if (!window.confirm(`Delete ${first}'s account for good? Their login, profile, diagnostic homework and onboarding record are removed, and the parent's account too if ${first} is their only child. This cannot be undone.`)) return;
    if (!window.confirm(`Last check: delete ${first}'s account now?`)) return;
    setBusy("student:delete"); setMsg(null);
    try { await studentsApi("access", { uid: student.uid, op: "delete" }); navigate("/tutor/students"); }
    catch (e) { setMsg({ tone: "red", text: e.message }); setBusy(null); }
  };

  const row = (who, u, title) => {
    const off = !!u.accessDisabled;
    const last = loginMs(u);
    const is = (op) => busy === `${who}:${op}`;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700 }}>{title}</span>
          {off ? <Chip tone="red">Access off</Chip> : u.needsPasswordChange ? <Chip tone="amber">Not logged in yet</Chip> : <Chip tone="green">Enabled</Chip>}
        </div>
        <span style={{ fontSize: 12, color: T.muted }}>{u.email || "No email"} · {last ? `last login ${relativeTime(last)}` : "never logged in"}</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => run(who, "resendLogin")} disabled={!!busy || off}>{is("resendLogin") ? "Sending…" : "Send login details"}</Button>
          <Button size="sm" onClick={() => run(who, "resetPassword")} disabled={!!busy || off}>{is("resetPassword") ? "Resetting…" : "Reset password"}</Button>
          <Button size="sm" variant={off ? "accent" : "ghost"} onClick={() => run(who, off ? "enable" : "disable")} disabled={!!busy} style={off ? undefined : { color: T.red }}>{is("disable") || is("enable") ? "Saving…" : off ? "Switch access on" : "Switch access off"}</Button>
        </div>
      </div>
    );
  };

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CardHeader title="Login and access" sub="A new temporary password is emailed; they choose their own when they next log in." />
      {row("student", student, "Student")}
      {parentUid && parent && <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>{row("parent", parent, "Parent")}</div>}
      {parentUid && !parent && <span style={{ fontSize: 12, color: T.muted }}>Loading the parent's login…</span>}
      {msg && <Notice tone={msg.tone} style={{ fontSize: 12 }}>{msg.text}</Notice>}
      <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
        <Button size="sm" variant="ghost" onClick={remove} disabled={!!busy} style={{ color: T.red }}>{busy === "student:delete" ? "Deleting…" : "Delete this account"}</Button>
      </div>
    </Card>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
      <span style={{ width: 78, flexShrink: 0, fontSize: 12, color: T.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{children}</span>
    </div>
  );
}

function Upcoming({ sessions }) {
  const now = Date.now();
  const rows = (sessions || []).filter(s => sessionEndMs(s) > now).slice(0, 5);
  if (rows.length === 0) return <span style={{ fontSize: 13, color: T.muted }}>Nothing on the calendar yet.</span>;
  return rows.map((s, i) => (
    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", borderTop: i ? `1px solid ${T.line}` : "none", paddingTop: i ? 8 : 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: s.status === "cancelled" ? T.faint : T.ink, textDecoration: s.status === "cancelled" ? "line-through" : "none" }}>{fmtLessonDay(s.date)} · {fmtTime(s.time)}{s.title ? ` · ${s.title}` : ""}</span>
        <span style={{ fontSize: 11, color: T.muted }}>{s.studentIds ? "Session just for this student" : s.className || s.classId}{s.note ? ` · ${s.note}` : ""}</span>
      </div>
      {s.status === "cancelled" ? <Chip tone="red">Cancelled</Chip> : i === 0 ? <Chip tone="accent">Next</Chip> : s.studentIds ? <Chip tone="indigo">Extra session</Chip> : null}
    </div>
  ));
}

function HomeworkTab({ student }) {
  const navigate = useNavigate();
  const { rows, loading, error } = useHomework(student.uid, student.classId);
  const done = (rows || []).filter(r => r.status === "done");
  const avg = done.length ? Math.round(done.reduce((s, r) => s + (r.pct || 0), 0) / done.length) : null;
  const late = (rows || []).filter(r => r.overdue).length;
  return (
    <>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="cm-grid-4">
        <StatTile label="Set" value={rows ? rows.length : "…"} sub="for this group" />
        <StatTile label="Submitted" value={done.length} sub={rows && rows.length ? `${Math.round((done.length / rows.length) * 100)}% of homework` : ""} />
        <StatTile label="Average score" value={avg === null ? "–" : `${avg}%`} subTone={avg === null ? undefined : avg >= 75 ? "green" : avg >= 50 ? "amber" : "red"} sub={avg === null ? "No marked homework yet" : ""} />
        <StatTile label="Overdue" value={late} subTone={late ? "red" : undefined} />
      </div>
      <Card padding={0}>
        <CardHeader title="Homework" sub="Open a row to review the answers" style={{ padding: "16px 20px" }} />
        {loading && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {!loading && (rows || []).length === 0 && <EmptyState icon="checkSquare" title="No homework set yet" body="Homework set for this student's group appears here with their status and score." />}
        {(rows || []).map(({ a, status, answered, pct, overdue, sub }) => (
          <div key={a.id} className="cm-row-hover" onClick={() => navigate(`/tutor/homework/${a.id}`)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderTop: `1px solid ${T.line}`, flexWrap: "wrap", cursor: "pointer" }}>
            <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 600 }}>{a.title}</span>
              <span style={{ fontSize: 12, color: overdue ? T.red : T.muted }}>{a.minutes} min · {status === "done" ? `Submitted ${fmtDate(sub?.submittedAt)}` : `Due ${fmtDue(a.dueAt)}`}{overdue ? " · overdue" : ""}{sub?.reviewedAt ? " · reviewed" : status === "done" ? " · awaiting your review" : ""}</span>
            </div>
            {status === "done"
              ? <Chip tone={chipToneForPct(pct)}>{sub.totalScore} / {sub.maxScore} · {pct}%</Chip>
              : <Chip tone={overdue ? "red" : status === "progress" ? "accent" : "amber"}>{status === "progress" ? `${answered} of ${a.items.length} answered` : "Not started"}</Chip>}
          </div>
        ))}
      </Card>
    </>
  );
}

function PaymentsTab({ student, isAdmin }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchPayments({ uid: student.uid }).then(p => alive && setRows(p)).catch(e => { if (alive) { setError(e.message); setRows([]); } });
    return () => { alive = false; };
  }, [student.uid]);
  const list = rows || [];
  const paid = list.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount || 0), 0);
  const due = list.filter(p => p.status === "open").reduce((s, p) => s + Number(p.amount || 0), 0);
  const plan = student.agreement;
  return (
    <>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="cm-grid-4">
        <StatTile label="Programme fee" value={plan?.totalFee ? money(plan.totalFee) : "–"} sub={plan?.paymentPlan ? paymentPlanLabel(plan.paymentPlan) : ""} />
        <StatTile label="Paid so far" value={money(paid) || "£0"} />
        <StatTile label="Outstanding" value={money(due) || "£0"} subTone={due > 0 ? "amber" : undefined} sub={list.some(p => p.status === "open" && p.dueAt && p.dueAt < Date.now()) ? "includes an overdue invoice" : ""} />
        <StatTile label="Invoices" value={rows === null ? "…" : list.length} />
      </div>
      {plan?.schedule?.length > 0 && (
        <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <CardHeader title="Agreed schedule" sub="From the parent agreement" />
          {plan.schedule.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: T.body }}>{r.due || "–"}</span><span style={{ fontWeight: 600 }}>{money(r.amount)}</span></div>)}
        </Card>
      )}
      <Card padding={0}>
        <CardHeader title="Invoices" style={{ padding: "16px 20px" }} right={isAdmin ? <Button size="sm" icon="plus" onClick={() => navigate("/tutor/payments")}>Raise an invoice</Button> : null} />
        {rows && list.length === 0 && <EmptyState icon="chart" title="No invoices yet" body={isAdmin ? "Raise one from the Payments tab; it appears here and on the parent's page." : "Invoices are raised by HSJ admin."} />}
        {list.length > 0 && (
          <Table minWidth={520}>
            <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Description</th><th style={th}>Amount</th><th style={th}>Due</th><th style={{ ...th, paddingRight: 20 }}>Status</th></tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${T.line}` }}>
                  <td style={{ ...td, paddingLeft: 20, fontWeight: 600 }}>{p.description || "Tuition"}</td>
                  <td style={td}>{money(p.amount)}</td>
                  <td style={{ ...td, color: T.muted }}>{p.dueAt ? fmtDue(p.dueAt) : "–"}</td>
                  <td style={{ ...td, paddingRight: 20 }}><Chip tone={p.status === "open" && p.dueAt && p.dueAt < Date.now() ? "red" : PAYMENT_TONE[p.status] || "neutral"}>{paymentStatusLabel(p)}</Chip></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

function DetailsTab({ student, group, isAdmin, onChange }) {
  const ev = student.selfEvaluation;
  const rag = ragCounts(ev?.ratings);
  const evBoard = SELF_EVALUATION[student.board] ? student.board : "aqa";
  // Module ids are stored on the evaluation; show their names, shortened to the part before the spec refs
  const taughtTitles = (Array.isArray(ev?.taught) ? ev.taught : []).map(id => {
    const m = SELF_EVALUATION[evBoard].modules.find(x => x.id === id);
    return m ? m.title.replace(/\s*\([^)]*\)\s*$/, "") : id;
  });
  const ag = student.agreement || {};
  const navigate = useNavigate();
  const [diagBusy, setDiagBusy] = useState(false);
  const [diagMsg, setDiagMsg] = useState(null);
  const dg = student.diagnostic;
  const setDiagnostic = async () => {
    setDiagBusy(true); setDiagMsg(null);
    try {
      const r = await studentsApi("assignDiagnostic", { uid: student.uid });
      onChange && onChange({ diagnostic: { ...(dg || {}), assignmentId: r.assignmentId, dueAt: r.dueAt, setAt: Date.now() } });
      setDiagMsg(r.existing ? "The diagnostic was already set; nothing changed." : `Set, due ${fmtDue(r.dueAt)}. It is on the student's Homework page now.`);
    } catch (e) { setDiagMsg(e.message); }
    setDiagBusy(false);
  };
  return (
    <>
      <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <CardHeader title="Initial diagnostic" sub={dg?.reportSentAt ? `Report sent ${fmtDate(dg.reportSentAt)}${dg.score != null ? ` · ${dg.score} / ${dg.max}` : ""}` : dg?.assignmentId ? `Set ${fmtDate(dg.setAt)} · due ${fmtDue(dg.dueAt)}` : "Not set"}
          right={<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {dg?.assignmentId && <Button variant="secondary" size="sm" onClick={() => navigate(`/tutor/homework/${dg.assignmentId}`)}>Open the review</Button>}
            {isAdmin && !dg?.assignmentId && <Button variant="primary" size="sm" onClick={setDiagnostic} disabled={diagBusy}>{diagBusy ? "Setting…" : "Set the initial diagnostic"}</Button>}
          </div>} />
        <span style={{ fontSize: 13, color: T.muted }}>{dg?.assignmentId ? "The paper is the student's first homework. Marks are hidden from them until the tutor sends the feedback report from the review page." : "Set automatically when a student is placed, once the Year 12 and Year 13 papers are published. Students placed before that get it from here."}</span>
        {diagMsg && <Notice tone={/already|Set,/.test(diagMsg) ? "green" : "red"}>{diagMsg}</Notice>}
      </Card>
      <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <CardHeader title="Course" />
        <div className="cm-grid-2" style={{ fontSize: 13 }}>
          <Field label="Group">{student.className || "Not placed"}</Field>
          <Field label="Exam board">{student.board ? boardLabel(student.board) : "–"}</Field>
          <Field label="Year group">{student.year ? `Year ${student.year}` : "–"}</Field>
          <Field label="Usual lessons">{group ? describeSlots(slotsOf(group)) || group.lessonSlot || "Not set" : "–"}</Field>
          <Field label="Programme">{ag.programmeStart ? `${fmtIso(ag.programmeStart)} until ${ag.programmeEnd || "the end of the course"}` : "–"}</Field>
          <Field label="Initial assessed grade">{ag.initialGrade || "–"}</Field>
          <Field label="Student login">{student.email}</Field>
          <Field label="Added to the platform">{fmtDate(student.placedAt || student.createdAt) || "–"}</Field>
        </div>
      </Card>
      <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <CardHeader title="Self-evaluation" sub={ev ? `Submitted ${fmtDate(ev.submittedAt)}` : "Not submitted yet"} />
        {ev ? (
          <>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Chip tone="red">{rag.red} red</Chip><Chip tone="amber">{rag.amber} amber</Chip><Chip tone="green">{rag.green} green</Chip>
              {Array.isArray(ev.taught) && ev.taught.length > 0 && <Chip title={taughtTitles.join("; ")}>Taught: {taughtTitles.join(", ")}</Chip>}
            </div>
            {Object.entries(ev.ratings || {}).filter(([, r]) => r?.rag === "red").length > 0 && (
              <div style={{ fontSize: 13, color: T.body }}><strong>Red topics:</strong> {Object.entries(ev.ratings).filter(([, r]) => r?.rag === "red").map(([ref]) => `${ref} ${subtopicTitle(evBoard, ref)}`).join(", ")}</div>
            )}
            {ev.notes && <div style={{ fontSize: 13, color: T.body, whiteSpace: "pre-wrap", background: T.soft, borderRadius: 8, padding: "8px 12px" }}>{ev.notes}</div>}
          </>
        ) : <span style={{ fontSize: 13, color: T.muted }}>The student has not sent the self-evaluation. Resend it from the Onboarding tab.</span>}
      </Card>
      <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <CardHeader title="Parent questionnaire" sub={student.parentQuestionnaire ? `Completed ${fmtDate(student.parentQuestionnaire.submittedAt)}` : "Not completed yet"} />
        {student.parentQuestionnaire ? QUESTIONNAIRE_SECTIONS.map(sec => (
          <div key={sec.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.accentText, textTransform: "uppercase", letterSpacing: 0.6 }}>{sec.title}</div>
            {sec.questions.filter(q => student.parentQuestionnaire[q.id] !== undefined).map(q => (
              <div key={q.id} style={{ fontSize: 13 }}>
                <div style={{ color: T.muted }}>{q.label}</div>
                <div style={{ color: T.ink, whiteSpace: "pre-wrap" }}>{Array.isArray(student.parentQuestionnaire[q.id]) ? student.parentQuestionnaire[q.id].join(", ") : student.parentQuestionnaire[q.id]}</div>
              </div>
            ))}
          </div>
        )) : <span style={{ fontSize: 13, color: T.muted }}>The parent fills it in on the agreement page after accepting. Send the link again from the Onboarding tab.</span>}
      </Card>
      <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <CardHeader title="Agreement" sub={ag.acceptedAt ? `Accepted by ${ag.acceptedName || "the parent"} on ${fmtDate(ag.acceptedAt)}` : ag.agreedBeforePlatform ? "Current student: agreed before the platform" : "Not accepted yet"} />
        <div className="cm-grid-2" style={{ fontSize: 13 }}>
          <Field label="Fee">{ag.totalFee ? money(ag.totalFee) : "–"}</Field>
          <Field label="Payment option">{ag.paymentPlan ? paymentPlanLabel(ag.paymentPlan) : "–"}</Field>
          <Field label="Group size">{ag.groupSize ? `Up to ${ag.groupSize}` : "–"}</Field>
          <Field label="Version">{ag.version || "–"}</Field>
        </div>
        {ag.extraTerms && <div style={{ fontSize: 13, color: T.body, whiteSpace: "pre-wrap", background: T.soft, borderRadius: 8, padding: "8px 12px" }}><strong>Extra terms.</strong> {ag.extraTerms}</div>}
      </Card>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</span>
      <span style={{ color: T.ink }}>{children}</span>
    </div>
  );
}
