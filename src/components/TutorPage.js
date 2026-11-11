import React, { useState, useEffect, useMemo } from "react";
import { createClass, fetchTutorClasses, fetchAllClasses, fetchTutors, fetchAllStudents, fetchStudentsForTutor, fetchAttemptsForTutor, updateClass, fetchTutorSessions, fetchAllSessions, fetchTutorSubmissions, fetchPayments, fetchApplicants } from "../firebase";
import { WEEKDAYS, DEFAULT_MINUTES, describeSchedule, describeSlots, slotsOf, nextOccurrences, upcomingSessions, fmtLessonDay, fmtTime, isoDate, addDays, sessionEndMs } from "../utils/schedule";
import { useNavigate } from "react-router-dom";
import { T, pctColour, BOARDS, boardLabel, groupColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, StatTile, AccuracyBar, Avatar, Button, Input, Notice } from "../ui/components";
import { summarise, pct } from "../utils/analytics";
import { money } from "../data/terms";
import { studentRow } from "./StudentsPage";
import WeekList from "./WeekList";

// The tutor home: the numbers that matter today, this week's lessons, the
// groups, and who needs a nudge. Students live on the Students tab; each
// name here links to the student's profile.

const mondayOf = (iso) => { const d = new Date(`${iso}T00:00:00`); return addDays(iso, -((d.getDay() + 6) % 7)); };
const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

export default function TutorPage({ authUser, userProfile }) {
  const isAdmin = userProfile?.role === "admin";
  const navigate = useNavigate();
  const [classes, setClasses] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [newTutor, setNewTutor] = useState("");
  const [newSlots, setNewSlots] = useState([{ weekday: 2, time: "18:00", minutes: DEFAULT_MINUTES }]);
  const [editSchedule, setEditSchedule] = useState(null); // { code, slots, zoomLink }
  const [selected, setSelected] = useState(null); // group whose weak spots are shown
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBoard, setNewBoard] = useState("aqa");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const tutorUid = authUser?.uid;

  useEffect(() => {
    if (!tutorUid) return;
    let cancelled = false;
    (async () => {
      try {
        const quiet = (p) => p.catch(() => []);
        const [cls, list, att, tut, ses, sb, pay, app] = await Promise.all([
          isAdmin ? fetchAllClasses() : fetchTutorClasses(tutorUid),
          quiet(isAdmin ? fetchAllStudents() : fetchStudentsForTutor(tutorUid)),
          quiet(fetchAttemptsForTutor(tutorUid)),
          isAdmin ? quiet(fetchTutors()) : Promise.resolve([]),
          quiet(isAdmin ? fetchAllSessions() : fetchTutorSessions(tutorUid)),
          quiet(fetchTutorSubmissions(tutorUid)),
          isAdmin ? quiet(fetchPayments({})) : Promise.resolve([]),
          isAdmin ? quiet(fetchApplicants()) : Promise.resolve([]),
        ]);
        if (cancelled) return;
        setClasses(cls); setStudents(list); setAttempts(att); setTutors(tut); setSessions(ses); setSubs(sb); setPayments(pay); setApplicants(app); setNewTutor(tutorUid);
        if (cls.length > 0) setSelected(cls[0].code); else setShowNew(true);
      } catch (e) { if (!cancelled) { setError(e.message); setClasses([]); setStudents([]); } }
    })();
    return () => { cancelled = true; };
  }, [tutorUid, isAdmin]);

  const saveSchedule = async () => {
    const cls = classes?.find(c => c.code === editSchedule?.code);
    if (!cls) return;
    try {
      const slots = (editSchedule.slots || []).filter(s => s.time).map(s => ({ weekday: Number(s.weekday), time: s.time, minutes: Number(s.minutes) || DEFAULT_MINUTES }));
      if (slots.length === 0) throw new Error("Add at least one lesson time");
      // `schedule` keeps the first slot for anything that still reads the old single-slot shape
      const patch = { slots, schedule: slots[0], lessonSlot: describeSlots(slots), zoomLink: (editSchedule.zoomLink || "").trim() || null };
      await updateClass(cls.code, patch);
      setClasses(list => list.map(c => c.code === cls.code ? { ...c, ...patch } : c));
      setEditSchedule(null);
    } catch (e) { setError(e.message); }
  };
  const openSchedule = (cls) => setEditSchedule(editSchedule?.code === cls.code ? null : { code: cls.code, slots: slotsOf(cls).length ? slotsOf(cls) : [{ weekday: 2, time: "18:00", minutes: DEFAULT_MINUTES }], zoomLink: cls.zoomLink || "" });

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true); setError(null);
    try {
      const slots = newSlots.filter(s => s.time).map(s => ({ weekday: Number(s.weekday), time: s.time, minutes: Number(s.minutes) || DEFAULT_MINUTES }));
      const cls = await createClass(tutorUid, { name: newName, board: newBoard, tutorId: isAdmin ? newTutor : tutorUid, lessonSlot: describeSlots(slots), schedule: slots[0] || null, slots });
      setClasses(prev => [...(prev || []), cls].sort((a, b) => a.name.localeCompare(b.name)));
      setSelected(cls.code); setNewName(""); setShowNew(false);
    } catch (e) { setError(e.message || "Could not create the group"); }
    setCreating(false);
  };

  const tutorName = (uid) => { const t = tutors.find(x => x.uid === uid); return t ? (t.displayName || t.email) : null; };
  const colourOf = (code) => groupColour((classes || []).findIndex(c => c.code === code));

  // Per-student summaries from every attempt
  const perStudent = useMemo(() => {
    const by = {};
    for (const a of attempts) (by[a.uid] || (by[a.uid] = [])).push(a);
    const out = {};
    for (const uid of Object.keys(by)) out[uid] = summarise(by[uid]);
    return out;
  }, [attempts]);
  const rows = useMemo(() => (students || []).map(s => studentRow(s, perStudent[s.uid])).sort((a, b) => (b.flags.length - a.flags.length) || a.name.localeCompare(b.name)), [students, perStudent]);
  const attention = rows.filter(r => r.flags.length > 0 && r.s.classId);
  const activeThisWeek = rows.filter(r => r.sum && r.sum.week > 0).length;

  // This week on the calendar
  const today = isoDate(new Date());
  const weekFrom = mondayOf(today), weekTo = addDays(weekFrom, 6);
  const weekSessions = sessions.filter(s => s.date >= weekFrom && s.date <= weekTo && s.status !== "cancelled");
  const weekMinutes = weekSessions.reduce((n, s) => n + (s.minutes || DEFAULT_MINUTES), 0);
  const stillToCome = weekSessions.filter(s => sessionEndMs(s) > Date.now()).length;

  const toReview = subs.filter(s => s.submittedAt && !s.reviewedAt).length;
  const openInvoices = payments.filter(p => p.status === "open");
  const owed = openInvoices.reduce((n, p) => n + Number(p.amount || 0), 0);
  const overdue = openInvoices.filter(p => p.dueAt && p.dueAt < Date.now()).length;
  const onboarding = applicants.filter(a => a.status !== "placed").length;

  // Weak spots for one group
  const cls = classes?.find(c => c.code === selected);
  const clsUids = useMemo(() => new Set((students || []).filter(s => s.classId === selected).map(s => s.uid)), [students, selected]);
  const classSum = useMemo(() => summarise(attempts.filter(a => clsUids.has(a.uid)), { minForTopic: 8 }), [attempts, clsUids]);
  const nextLessonFor = (c) => {
    const own = sessions.filter(s => s.classId === c.code && !s.studentIds);
    const next = upcomingSessions(own.filter(s => s.status !== "cancelled"), 1)[0];
    if (next) return `${fmtLessonDay(next.date)} ${fmtTime(next.time)}`;
    if (own.length === 0) { const o = nextOccurrences(slotsOf(c), 1)[0]; return o ? `${fmtLessonDay(o.iso)} ${fmtTime(o.time)} (usual time)` : "Not scheduled"; }
    return "Nothing scheduled";
  };
  const firstName = (userProfile?.displayName || authUser?.displayName || "").split(" ")[0];
  const dateLine = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={firstName ? `${greeting()}, ${firstName}` : greeting()}
        sub={`${dateLine} · ${weekSessions.length} lesson${weekSessions.length === 1 ? "" : "s"} this week${stillToCome && stillToCome !== weekSessions.length ? `, ${stillToCome} still to come` : ""}`}
        right={<>
          <Button icon="calendar" onClick={() => navigate("/tutor/calendar")}>Calendar</Button>
          <Button variant="primary" icon="plus" onClick={() => setShowNew(v => !v)}>New group</Button>
        </>}
      />

      {error && <Notice tone="red">{error}</Notice>}

      <div className={isAdmin ? "cm-grid-3" : "cm-grid-4"} style={{ gap: 16 }}>
        <StatTile label="Lessons this week" value={weekSessions.length} sub={weekMinutes ? `${Math.round((weekMinutes / 60) * 10) / 10} teaching hours` : "Nothing on the calendar yet"} icon="calendar" onClick={() => navigate("/tutor/calendar")} />
        <StatTile label="Students" value={students ? students.length : "–"} sub={students && students.length ? `${activeThisWeek} active this week` : "Place students from the Students tab"} icon="users" tone="indigo" onClick={() => navigate("/tutor/students")} />
        <StatTile label="Needs attention" value={attention.length} sub="Inactive 7+ days or under 50%" icon="bolt" tone={attention.length ? "red" : "green"} onClick={() => navigate("/tutor/students?attention=1")} />
        <StatTile label="Homework to review" value={toReview} sub={toReview ? "Submitted, not yet marked by you" : "All marked"} icon="checkSquare" tone={toReview ? "amber" : "green"} onClick={() => navigate("/tutor/homework")} />
        {isAdmin && <StatTile label="Outstanding invoices" value={owed ? money(owed) : "£0"} sub={overdue ? `${overdue} overdue` : openInvoices.length ? `${openInvoices.length} due` : "Nothing outstanding"} icon="chart" tone={overdue ? "red" : "amber"} onClick={() => navigate("/tutor/payments")} />}
        {isAdmin && <StatTile label="Onboarding" value={onboarding} sub={onboarding ? "Awaiting evaluation, terms or placing" : "Nobody waiting"} icon="plus" tone="accent" onClick={() => navigate("/tutor/students/onboarding")} />}
      </div>

      {classes && classes.length > 0 && (
        <WeekList sessions={sessions} classes={classes} tutorUid={tutorUid} tutorName={isAdmin ? tutorName : null}
          onLessonCreated={(sid, lid) => setSessions(prev => prev.map(x => x.id === sid ? { ...x, lessonId: lid } : x))} />
      )}

      {editSchedule && classes && (
        <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <CardHeader title={`Usual weekly times for ${classes.find(c => c.code === editSchedule.code)?.name || "this group"}`} sub="A template, not the timetable. One row per lesson each week. On the Calendar tab, Fill from usual times puts a term's lessons on the calendar from these, and you can then move or cancel any of them." />
          <SlotsFields slots={editSchedule.slots} onChange={slots => setEditSchedule(e => ({ ...e, slots }))} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 520 }}>
            <label htmlFor="cls-zoom" style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Zoom link (shown to students and parents, and in reminder emails)</label>
            <Input id="cls-zoom" type="url" value={editSchedule.zoomLink} onChange={e => setEditSchedule(x => ({ ...x, zoomLink: e.target.value }))} placeholder="https://zoom.us/j/…" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="accent" onClick={saveSchedule}>Save</Button>
            <Button variant="ghost" onClick={() => setEditSchedule(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      {showNew && (
        <Card style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 220px" }}>
            <label htmlFor="new-class-name" style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Group name</label>
            <Input id="new-class-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Year 13 OCR Tuesday" onKeyDown={e => e.key === "Enter" && handleCreate()} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 160px" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Usual weekly times</span>
            <SlotsFields slots={newSlots} onChange={setNewSlots} />
          </div>
          {isAdmin && tutors.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="new-class-tutor" style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Tutor</label>
              <select id="new-class-tutor" value={newTutor} onChange={e => setNewTutor(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink }}>
                {tutors.map(t => <option key={t.uid} value={t.uid}>{t.displayName || t.email}{t.uid === tutorUid ? " (you)" : ""}</option>)}
              </select>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Exam board</span>
            <div style={{ display: "flex", gap: 6 }}>
              {BOARDS.map(b => (
                <Button key={b.id} variant={newBoard === b.id ? "primary" : "secondary"} onClick={() => setNewBoard(b.id)}>{b.label}</Button>
              ))}
            </div>
          </div>
          <Button variant="accent" onClick={handleCreate} disabled={creating || !newName.trim()}>{creating ? "Creating…" : "Create group"}</Button>
          {classes && classes.length > 0 && <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>}
        </Card>
      )}

      {classes && classes.length > 0 && (
        <div className="cm-two-col">
          <div className="cm-main-col">
            <Card padding={0}>
              <CardHeader title="Groups" sub="Usual times, who teaches them and when they next meet" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
              {classes.map((c, i) => {
                const [bg, fg] = colourOf(c.code);
                const count = (students || []).filter(s => s.classId === c.code).length;
                return (
                  <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderTop: i ? `1px solid ${T.line}` : "none", flexWrap: "wrap" }}>
                    <span style={{ width: 12, height: 12, borderRadius: 4, background: fg, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700 }}>{c.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: bg, color: fg }}>{boardLabel(c.board)}</span>
                        {isAdmin && tutorName(c.tutorId) && <Chip>{tutorName(c.tutorId)}</Chip>}
                      </span>
                      <span style={{ fontSize: 12, color: T.muted }}>{describeSlots(slotsOf(c)) || c.lessonSlot || "No usual time set"} · next {nextLessonFor(c)} · {count} student{count === 1 ? "" : "s"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Button size="sm" onClick={() => openSchedule(c)}>{slotsOf(c).length ? "Usual times" : "Set usual times"}</Button>
                      <Button size="sm" icon="users" onClick={() => navigate(`/tutor/students?group=${encodeURIComponent(c.code)}`)}>Students</Button>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <aside className="cm-side-col">
            <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <CardHeader title="Needs attention" right={attention.length ? <Chip tone="red">{attention.length}</Chip> : null} />
              {attention.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Everyone is active and above 50% this week.</span>}
              {attention.slice(0, 6).map(r => (
                <button key={r.s.uid} type="button" onClick={() => navigate(`/tutor/students/${r.s.uid}`)} className="cm-row-hover"
                  style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", borderRadius: 10, background: T.card, border: `1px solid ${T.line}`, cursor: "pointer", textAlign: "left", fontFamily: T.font, width: "100%" }}>
                  <Avatar name={r.s.displayName} email={r.s.email} photoURL={r.s.photoURL} size={32} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: T.ink }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: T.muted }}>{r.flags.map(f => f.text).join(" · ")}{r.weakest ? ` · weakest: ${r.weakest.label}` : ""}</span>
                  </div>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.flags[0].tone === "red" ? T.red : T.amber, flexShrink: 0 }} />
                </button>
              ))}
              {attention.length > 6 && <Button size="sm" variant="ghost" onClick={() => navigate("/tutor/students?attention=1")}>See all {attention.length}</Button>}
            </Card>

            <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <CardHeader title="Group weak spots" sub="Topics the group scores lowest on (8+ answers)"
                right={classes.length > 1 ? (
                  <select value={selected || ""} onChange={e => setSelected(e.target.value)} aria-label="Group" style={{ padding: "6px 10px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 12, fontWeight: 600, color: T.ink }}>
                    {classes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                ) : null} />
              {cls && classSum.weak.filter(t => t.pct < 75).length === 0
                ? <span style={{ fontSize: 13, color: T.muted }}>Nothing flagged for {cls.name} yet. This fills in as students practise.</span>
                : classSum.weak.filter(t => t.pct < 75).map(t => (
                  <div key={t.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}>
                      <span>{t.label}</span>
                      <span style={{ fontWeight: 700, color: pctColour(t.pct) }}>{t.pct}% <span style={{ color: T.faint, fontWeight: 400 }}>({t.c}/{t.n})</span></span>
                    </div>
                    <AccuracyBar pct={t.pct} width="100%" />
                  </div>
                ))}
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10, fontSize: 12, color: T.muted }}>
                These are the topics to record videos for first.
              </div>
            </Card>
          </aside>
        </div>
      )}
    </>
  );
}

function TopicList({ title, topics, empty }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{title}</div>
      {(!topics || topics.length === 0) && <div style={{ fontSize: 12, color: T.muted }}>{empty}</div>}
      {topics && topics.map(t => (
        <div key={t.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "3px 0", gap: 8 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.label}</span>
          <span style={{ fontWeight: 700, color: pctColour(t.pct), flexShrink: 0 }}>{t.pct}% <span style={{ color: T.faint, fontWeight: 400 }}>({t.c}/{t.n})</span></span>
        </div>
      ))}
    </div>
  );
}

export { pct };

/** One row per weekly lesson: day, start, length. "Add another day" covers groups taught twice a week. */
function SlotsFields({ slots, onChange }) {
  const sel = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink };
  const set = (i, k, v) => onChange(slots.map((s, j) => j === i ? { ...s, [k]: v } : s));
  const lengthLabel = (m) => m === 60 ? "1 hour" : m === 120 ? "2 hours" : m === 180 ? "3 hours" : m % 60 === 0 ? `${m / 60} hours` : `${Math.floor(m / 60)}h ${m % 60}m`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {slots.map((value, i) => (
        <div key={i} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select value={value.weekday} onChange={e => set(i, "weekday", Number(e.target.value))} style={sel} aria-label="Lesson day">
            {WEEKDAYS.map((d, j) => <option key={d} value={j}>{d}s</option>)}
          </select>
          <Input type="time" value={value.time} onChange={e => set(i, "time", e.target.value)} aria-label="Start time" style={{ width: 120 }} />
          <select value={value.minutes} onChange={e => set(i, "minutes", Number(e.target.value))} style={sel} aria-label="Length">
            {[30, 45, 60, 90, 120, 150, 180].map(m => <option key={m} value={m}>{lengthLabel(m)}</option>)}
          </select>
          <span style={{ fontSize: 12, color: T.muted }}>{describeSchedule(value)}</span>
          {slots.length > 1 && <Button size="sm" variant="ghost" onClick={() => onChange(slots.filter((_, j) => j !== i))} aria-label="Remove this lesson time">Remove</Button>}
        </div>
      ))}
      <div><Button size="sm" onClick={() => onChange([...slots, { weekday: (Number(slots[slots.length - 1]?.weekday ?? 1) + 2) % 7, time: slots[slots.length - 1]?.time || "18:00", minutes: slots[slots.length - 1]?.minutes || DEFAULT_MINUTES }])}>Add another day</Button></div>
    </div>
  );
}
