// Calendar: what is actually happening and when. One `sessions` document
// per lesson or extra session. A group's usual weekly times are only a
// template: "Fill from usual times" writes a term's worth of sessions from
// them, and each one can then be moved, cancelled or deleted on its own.
// A session is for the whole group, or for named students (a drop-in or
// catch-up) who are the only ones to see it.
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTutorClasses, fetchAllClasses, fetchTutors, fetchClassStudents, fetchTutorSessions, fetchAllSessions,
  createSession, createSessions, updateSession, deleteSession, createLesson } from "../firebase";
import { slotsOf, describeSlots, fmtTime, fmtLessonDay, isoDate, addDays, templateOccurrences, DEFAULT_MINUTES, describeSession, sessionEndMs } from "../utils/schedule";
import { T, boardLabel, groupColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Icon } from "../ui/components";
import { CalendarSubscribePanel } from "./CalendarSubscribe";

const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const selectStyle = { padding: "9px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, fontFamily: T.font };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// Colours come from the shared palette so the legend, blocks and student views agree.
const TIMES = Array.from({ length: 4 * 15 }, (_, i) => { const h = 8 + Math.floor(i / 4), m = (i % 4) * 15; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`; });
const DURATIONS = [30, 45, 60, 75, 90, 105, 120, 150, 180];

const todayIso = () => isoDate(new Date());
const monday = (iso) => { const d = new Date(`${iso}T00:00:00`); return addDays(iso, -((d.getDay() + 6) % 7)); };
const firstOfMonth = (iso) => `${iso.slice(0, 7)}-01`;
const shiftMonth = (iso, n) => { const d = new Date(`${firstOfMonth(iso)}T00:00:00`); d.setMonth(d.getMonth() + n); return isoDate(d); };
const monthTitle = (iso) => { const d = new Date(`${iso}T00:00:00`); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const shortName = (s) => (s.className || s.classId || "").replace(/^Year\s+/i, "Y");

export default function TutorCalendar({ authUser, userProfile }) {
  const isAdmin = userProfile?.role === "admin";
  const uid = authUser?.uid;
  const navigate = useNavigate();
  const [classes, setClasses] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [sessions, setSessions] = useState(null);
  const [studentsByClass, setStudentsByClass] = useState({});
  const [view, setView] = useState(() => (typeof window !== "undefined" && window.innerWidth < 720 ? "list" : "month"));
  const [cursor, setCursor] = useState(todayIso());
  const [tutorFilter, setTutorFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [fill, setFill] = useState(null);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    (async () => {
      try {
        const [cls, tut] = await Promise.all([
          isAdmin ? fetchAllClasses() : fetchTutorClasses(uid),
          isAdmin ? fetchTutors() : Promise.resolve([]),
        ]);
        if (cancelled) return;
        setClasses(cls); setTutors(tut);
      } catch (e) { if (!cancelled) { setError(e.message); setClasses([]); } }
      // Sessions are read separately so a refused read (rules not published
      // yet) shows as an error rather than hiding the groups
      try {
        const ses = await (isAdmin ? fetchAllSessions() : fetchTutorSessions(uid));
        if (!cancelled) setSessions(ses);
      } catch (e) { if (!cancelled) { setSessions([]); setError(/permission/i.test(e.message) ? "The calendar cannot be read yet. The Firestore rule for sessions needs publishing in the Firebase console, then reload." : e.message); } }
    })();
    return () => { cancelled = true; };
  }, [uid, isAdmin]);

  const classOf = useCallback((code) => (classes || []).find(c => c.code === code), [classes]);
  const colourOf = useCallback((code) => groupColour((classes || []).findIndex(c => c.code === code)), [classes]);
  const tutorName = (tid) => { const t = tutors.find(x => x.uid === tid); return t ? (t.displayName || t.email) : ""; };

  const loadStudents = useCallback(async (code) => {
    if (!code || studentsByClass[code]) return studentsByClass[code] || [];
    const list = await fetchClassStudents(code, isAdmin ? null : uid);
    setStudentsByClass(prev => ({ ...prev, [code]: list }));
    return list;
  }, [studentsByClass, isAdmin, uid]);
  useEffect(() => { if (form?.who === "students" && form.classId) loadStudents(form.classId).catch(e => setError(e.message)); }, [form?.who, form?.classId, loadStudents]);

  const visible = useMemo(() => (sessions || []).filter(s => tutorFilter === "all" || s.tutorId === tutorFilter), [sessions, tutorFilter]);
  const byDate = useMemo(() => { const m = {}; for (const s of visible) (m[s.date] = m[s.date] || []).push(s); for (const k of Object.keys(m)) m[k].sort((a, b) => a.startAt - b.startAt); return m; }, [visible]);
  const sel = selected ? (sessions || []).find(s => s.id === selected) : null;

  const say = (msg) => { setFlash(msg); window.clearTimeout(say.t); say.t = window.setTimeout(() => setFlash(null), 4000); };

  // ---- add / edit ----
  const blankForm = (patch = {}) => {
    const cls = classOf(patch.classId) || (classes || [])[0];
    const slot = slotsOf(cls)[0];
    return { mode: "add", classId: cls?.code || "", date: todayIso(), time: slot?.time || "18:00", minutes: slot?.minutes || DEFAULT_MINUTES, who: "group", studentIds: [], title: "", zoomLink: "", note: "", repeat: 1, type: "lesson", ...patch };
  };
  const openAdd = (patch) => { setFill(null); setSelected(null); setForm(blankForm(patch)); };
  const openEdit = (s) => { setFill(null); setForm({ mode: "edit", id: s.id, classId: s.classId, date: s.date, time: s.time, minutes: s.minutes || DEFAULT_MINUTES, who: s.studentIds ? "students" : "group", studentIds: s.studentIds || [], title: s.title || "", zoomLink: s.zoomLink || "", note: s.note || "", type: s.type || "lesson" }); };
  const setF = (patch) => setForm(f => ({ ...f, ...patch }));

  const submitForm = async () => {
    const cls = classOf(form.classId);
    if (!cls || !form.date || !form.time) return;
    if (form.who === "students" && form.studentIds.length === 0) { setError("Tick at least one student, or choose the whole group."); return; }
    setBusy(true); setError(null);
    try {
      const roster = studentsByClass[form.classId] || [];
      const studentIds = form.who === "students" ? form.studentIds : null;
      const studentNames = studentIds ? studentIds.map(id => roster.find(s => s.uid === id)?.displayName || "Student") : null;
      const base = { classId: cls.code, className: cls.name, board: cls.board, tutorId: cls.tutorId, time: form.time, minutes: Number(form.minutes), type: studentIds ? "session" : form.type, title: form.title, zoomLink: form.zoomLink, note: form.note, studentIds, studentNames };
      if (form.mode === "edit") {
        const patch = await updateSession(form.id, { ...base, date: form.date });
        setSessions(prev => prev.map(s => s.id === form.id ? { ...s, ...patch } : s));
        say("Session updated.");
      } else {
        const n = Math.max(1, Math.min(52, Number(form.repeat) || 1));
        const list = Array.from({ length: n }, (_, i) => ({ ...base, date: addDays(form.date, 7 * i) }));
        const made = n === 1 ? [await createSession(uid, list[0])] : await createSessions(uid, list);
        setSessions(prev => [...prev, ...made].sort((a, b) => a.startAt - b.startAt));
        setCursor(form.date);
        say(made.length === 1 ? "Session added." : `${made.length} sessions added.`);
      }
      setForm(null);
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  // ---- fill a term from the usual times ----
  const openFill = () => { setForm(null); setSelected(null); const cls = (classes || []).find(c => slotsOf(c).length) || (classes || [])[0]; setFill({ classId: cls?.code || "", from: todayIso(), to: addDays(todayIso(), 7 * 12 - 1) }); };
  const fillPlan = useMemo(() => {
    if (!fill) return [];
    const cls = classOf(fill.classId);
    const have = new Set((sessions || []).filter(s => s.classId === fill.classId).map(s => `${s.date}_${s.time}`));
    return templateOccurrences(slotsOf(cls), fill.from, fill.to).filter(o => !have.has(`${o.date}_${o.time}`));
  }, [fill, classOf, sessions]);
  const submitFill = async () => {
    const cls = classOf(fill.classId);
    if (!cls || fillPlan.length === 0) return;
    setBusy(true); setError(null);
    try {
      const made = await createSessions(uid, fillPlan.map(o => ({ classId: cls.code, className: cls.name, board: cls.board, tutorId: cls.tutorId, date: o.date, time: o.time, minutes: o.minutes, type: "lesson" })));
      setSessions(prev => [...prev, ...made].sort((a, b) => a.startAt - b.startAt));
      setCursor(fill.from);
      setFill(null);
      say(`${made.length} lesson${made.length === 1 ? "" : "s"} added for ${cls.name}.`);
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  // ---- one session ----
  const setStatus = async (s, status) => {
    setBusy(true); setError(null);
    try { await updateSession(s.id, { status }); setSessions(prev => prev.map(x => x.id === s.id ? { ...x, status } : x)); say(status === "cancelled" ? "Session cancelled. Students see it crossed out." : "Session restored."); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };
  const remove = async (s) => {
    if (!window.confirm(`Delete this session on ${fmtLessonDay(s.date)}? It disappears from the students' calendars.`)) return;
    setBusy(true); setError(null);
    try { await deleteSession(s.id); setSessions(prev => prev.filter(x => x.id !== s.id)); setSelected(null); say("Session deleted."); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };
  const removeFuture = async (s) => {
    const future = (sessions || []).filter(x => x.classId === s.classId && x.time === s.time && x.date >= s.date && !x.lessonId && x.studentIds === null && s.studentIds === null);
    if (future.length === 0) return remove(s);
    if (!window.confirm(`Delete this and the ${future.length - 1} later ${fmtTime(s.time)} session${future.length === 2 ? "" : "s"} for ${s.className || s.classId}? Sessions with notes already written are kept.`)) return;
    setBusy(true); setError(null);
    try { for (const x of future) await deleteSession(x.id); const ids = new Set(future.map(x => x.id)); setSessions(prev => prev.filter(x => !ids.has(x.id))); setSelected(null); say(`${future.length} sessions deleted.`); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };
  const openNotes = async (s) => {
    if (s.lessonId) { navigate(`/tutor/lessons/${s.lessonId}`); return; }
    setBusy(true); setError(null);
    try {
      const l = await createLesson(uid, { classId: s.classId, className: s.className, board: s.board, date: s.date, topics: [], sessionId: s.id, studentIds: s.studentIds || null, title: s.title || null });
      await updateSession(s.id, { lessonId: l.id });
      setSessions(prev => prev.map(x => x.id === s.id ? { ...x, lessonId: l.id } : x));
      navigate(`/tutor/lessons/${l.id}`);
    } catch (e) { setError(e.message); setBusy(false); }
  };

  // ---- navigation ----
  const go = (n) => setCursor(c => view === "month" ? shiftMonth(c, n) : addDays(c, 7 * n));
  const title = view === "month" ? monthTitle(cursor) : view === "week" ? `Week of ${fmtLessonDay(monday(cursor))}` : "Upcoming sessions";

  const headerRight = (
    <>
      {isAdmin && tutors.length > 1 && (
        <select value={tutorFilter} onChange={e => setTutorFilter(e.target.value)} aria-label="Tutor" style={{ ...selectStyle, fontWeight: 600 }}>
          <option value="all">All tutors</option>
          {tutors.map(t => <option key={t.uid} value={t.uid}>{t.displayName || t.email}</option>)}
        </select>
      )}
      <div style={{ display: "inline-flex", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, overflow: "hidden" }}>
        {[["month", "Month"], ["week", "Week"], ["list", "List"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setView(id)} style={{ padding: "8px 12px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: T.font, background: view === id ? T.ink : T.card, color: view === id ? "#fff" : T.muted }}>{lbl}</button>
        ))}
      </div>
      {view !== "list" && <>
        <Button icon="arrowLeft" aria-label="Previous" onClick={() => go(-1)} />
        <Button onClick={() => setCursor(todayIso())}>Today</Button>
        <Button icon="arrowRight" aria-label="Next" onClick={() => go(1)} />
      </>}
      <Button icon="calendar" onClick={openFill} disabled={!classes || classes.length === 0}>Fill from usual times</Button>
      <Button icon="calendar" onClick={() => setShowSubscribe(v => !v)}>Add to your calendar</Button>
      <Button variant="primary" icon="plus" onClick={() => openAdd()} disabled={!classes || classes.length === 0}>Add session</Button>
    </>
  );

  if (classes && classes.length === 0) return (
    <>
      <PageHeader eyebrow="Calendar" title="Calendar" />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      <Card padding={0}><EmptyState icon="users" title="Create a group first" body="Sessions belong to a group. Create one on the Overview tab, then come back to put lessons on the calendar." action={<Button variant="primary" onClick={() => navigate("/tutor")}>Overview</Button>} /></Card>
    </>
  );

  return (
    <>
      <PageHeader eyebrow="Calendar" title={title}
        sub={sessions === null ? "Loading…" : `${visible.filter(s => s.status !== "cancelled" && sessionEndMs(s) > Date.now()).length} upcoming · click a day to add a session there, click a session to open it`}
        right={headerRight} />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {flash && <Notice tone="green" style={{ marginBottom: 12 }}>{flash}</Notice>}

      {form && (
        <SessionForm form={form} setF={setF} classes={classes || []} classOf={classOf} students={studentsByClass[form.classId]} busy={busy}
          onSubmit={submitForm} onCancel={() => setForm(null)} />
      )}

      {showSubscribe && <CalendarSubscribePanel who="Your lessons and sessions" onClose={() => setShowSubscribe(false)} />}
      {fill && (
        <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <CardHeader title="Fill the calendar from a group's usual times" sub="Adds one session for every usual weekly time between the two dates. Days that already have a session at that time are skipped, so running it twice adds nothing. Set the usual times on the Overview tab." />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={field}><label style={label} htmlFor="fill-group">Group</label>
              <select id="fill-group" value={fill.classId} onChange={e => setFill(f => ({ ...f, classId: e.target.value }))} style={selectStyle}>
                {(classes || []).map(c => <option key={c.code} value={c.code}>{c.name} ({describeSlots(slotsOf(c)) || "no usual times set"})</option>)}
              </select></div>
            <div style={field}><label style={label} htmlFor="fill-from">From</label><Input id="fill-from" type="date" value={fill.from} onChange={e => setFill(f => ({ ...f, from: e.target.value }))} /></div>
            <div style={field}><label style={label} htmlFor="fill-to">To</label><Input id="fill-to" type="date" value={fill.to} onChange={e => setFill(f => ({ ...f, to: e.target.value }))} /></div>
            <div style={{ display: "flex", gap: 6 }}>
              {[6, 12, 14].map(w => <Button key={w} size="sm" onClick={() => setFill(f => ({ ...f, to: addDays(f.from, 7 * w - 1) }))}>{w} weeks</Button>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="accent" onClick={submitFill} disabled={busy || fillPlan.length === 0}>{busy ? "Adding…" : `Add ${fillPlan.length} lesson${fillPlan.length === 1 ? "" : "s"}`}</Button>
            <Button variant="ghost" onClick={() => setFill(null)}>Cancel</Button>
            {fill.classId && slotsOf(classOf(fill.classId)).length === 0 && <span style={{ fontSize: 12, color: T.amber }}>This group has no usual times yet. Set them on the Overview tab, or add sessions one by one.</span>}
            {fillPlan.length === 0 && slotsOf(classOf(fill.classId)).length > 0 && <span style={{ fontSize: 12, color: T.muted }}>Every usual time in this range is already on the calendar.</span>}
          </div>
        </Card>
      )}

      {sel && !form && (
        <SessionDetail s={sel} cls={classOf(sel.classId)} colour={colourOf(sel.classId)} tutorName={isAdmin ? tutorName(sel.tutorId) : null} busy={busy}
          onEdit={() => openEdit(sel)} onCancel={() => setStatus(sel, "cancelled")} onRestore={() => setStatus(sel, "scheduled")}
          onDelete={() => remove(sel)} onDeleteFuture={() => removeFuture(sel)} onNotes={() => openNotes(sel)} onClose={() => setSelected(null)} />
      )}

      {view === "month" && <MonthGrid cursor={cursor} byDate={byDate} colourOf={colourOf} selected={selected} onPick={s => { setForm(null); setFill(null); setSelected(s.id); }} onDay={d => openAdd({ date: d })} />}
      {view === "week" && <WeekGrid cursor={cursor} byDate={byDate} colourOf={colourOf} selected={selected} onPick={s => { setForm(null); setFill(null); setSelected(s.id); }} onDay={d => openAdd({ date: d })} />}
      {view === "list" && <UpcomingList sessions={visible} colourOf={colourOf} selected={selected} tutorName={isAdmin ? tutorName : null} onPick={s => { setForm(null); setFill(null); setSelected(s.id); }} />}

      {classes && classes.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.muted }}>Groups:</span>
          {classes.map(c => { const [bg, fg] = colourOf(c.code); return <span key={c.code} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: bg, color: fg }}>{c.name}</span>; })}
        </div>
      )}
    </>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

function Pill({ s, colour, selected, onClick, full }) {
  const [bg, fg] = colour;
  const cancelled = s.status === "cancelled";
  const count = s.studentIds ? s.studentIds.length : null;
  const who = count ? (s.studentNames?.length === 1 ? s.studentNames[0].split(" ")[0] : `${count} student${count === 1 ? "" : "s"}`) : "Whole group";
  return (
    <button onClick={e => { e.stopPropagation(); onClick(s); }} title={`${s.className || s.classId} · ${describeSession(s)}${s.title ? ` · ${s.title}` : ""}${cancelled ? " · cancelled" : ""}`}
      style={{ display: "block", width: "100%", textAlign: "left", border: "none", outline: selected ? `2px solid ${fg}` : "none", outlineOffset: 1, borderLeft: `3px solid ${cancelled ? T.faint : fg}`, borderRadius: 6,
        padding: full ? "6px 8px 7px" : "3px 7px", background: cancelled ? T.soft : bg, color: cancelled ? T.muted : fg,
        fontSize: 11.5, cursor: "pointer", fontFamily: T.font, lineHeight: 1.35, textDecoration: cancelled ? "line-through" : "none", overflow: "hidden", whiteSpace: full ? "normal" : "nowrap", textOverflow: "ellipsis" }}>
      <span style={{ fontWeight: 700 }}>{fmtTime(s.time)}</span>
      <span style={{ fontWeight: 500, marginLeft: 5 }}>{s.title || shortName(s)}</span>
      {full && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 2, opacity: 0.9, fontWeight: 500 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title ? `${shortName(s)} · ${who}` : who}</span>
          <span style={{ flexShrink: 0 }}>{s.minutes || DEFAULT_MINUTES} min{s.lessonId ? " · notes" : ""}</span>
        </div>
      )}
    </button>
  );
}

function MonthGrid({ cursor, byDate, colourOf, selected, onPick, onDay }) {
  const first = firstOfMonth(cursor);
  const start = monday(first);
  const month = cursor.slice(0, 7);
  const today = todayIso();
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const rows = days[35].slice(0, 7) === month ? 6 : 5;
  return (
    <Card padding={0} style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 640 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", borderBottom: `1px solid ${T.line}` }}>
          {DAYS.map(d => <div key={d} style={{ padding: "8px 10px", fontSize: 11, fontWeight: 600, color: T.muted, textAlign: "left" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
          {days.slice(0, rows * 7).map((d, i) => {
            const inMonth = d.slice(0, 7) === month;
            const list = byDate[d] || [];
            return (
              <div key={d} role="button" tabIndex={0} onClick={() => onDay(d)} onKeyDown={e => e.key === "Enter" && onDay(d)} title="Add a session on this day"
                style={{ minHeight: 92, padding: 6, borderTop: `1px solid ${T.line}`, borderLeft: i % 7 ? `1px solid ${T.line}` : "none", background: inMonth ? T.card : "#FAFBFC", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: d === today ? 800 : 600, color: d === today ? "#fff" : inMonth ? T.ink : T.faint, background: d === today ? T.accent : "transparent", borderRadius: 999, minWidth: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{Number(d.slice(8))}</span>
                {list.map(s => <Pill key={s.id} s={s} colour={colourOf(s.classId)} selected={s.id === selected} onClick={onPick} />)}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function WeekGrid({ cursor, byDate, colourOf, selected, onPick, onDay }) {
  const start = monday(cursor);
  const today = todayIso();
  return (
    <Card padding={0} style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", minWidth: 700 }}>
        {Array.from({ length: 7 }, (_, i) => addDays(start, i)).map((d, i) => {
          const list = byDate[d] || [];
          return (
            <div key={d} role="button" tabIndex={0} onClick={() => onDay(d)} onKeyDown={e => e.key === "Enter" && onDay(d)} title="Add a session on this day"
              style={{ minHeight: 260, padding: 8, borderLeft: i ? `1px solid ${T.line}` : "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: d === today ? T.accentText : T.ink, paddingBottom: 6, borderBottom: `1px solid ${T.line}` }}>{DAYS[i]} <span style={{ color: T.muted, fontWeight: 500 }}>{Number(d.slice(8))}</span></div>
              {list.length === 0 && <span style={{ fontSize: 11, color: T.faint }}>Nothing on</span>}
              {list.map(s => <Pill key={s.id} s={s} colour={colourOf(s.classId)} selected={s.id === selected} onClick={onPick} full />)}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function UpcomingList({ sessions, colourOf, selected, tutorName, onPick }) {
  const now = Date.now();
  const list = sessions.filter(s => sessionEndMs(s) > now).slice(0, 60);
  if (list.length === 0) return <Card padding={0}><EmptyState icon="calendar" title="Nothing scheduled yet" body="Add a session, or fill the calendar from a group's usual times." /></Card>;
  return (
    <Card padding={0}>
      <Table minWidth={560}>
        <thead><tr><th style={{ ...th, paddingLeft: 20 }}>When</th><th style={th}>Group</th><th style={th}>Who</th>{tutorName && <th style={th}>Tutor</th>}<th style={{ ...th, paddingRight: 20 }}>Status</th></tr></thead>
        <tbody>
          {list.map(s => { const [bg, fg] = colourOf(s.classId); return (
            <tr key={s.id} className="cm-row-hover" onClick={() => onPick(s)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer", background: s.id === selected ? T.soft : undefined }}>
              <td style={{ ...td, paddingLeft: 20, fontWeight: 600, textDecoration: s.status === "cancelled" ? "line-through" : "none" }}>{describeSession(s)}</td>
              <td style={td}><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: bg, color: fg }}>{s.className || s.classId}</span></td>
              <td style={{ ...td, color: T.muted }}>{s.studentIds ? `${(s.studentNames || []).join(", ") || `${s.studentIds.length} students`}${s.title ? ` · ${s.title}` : ""}` : s.title || "Whole group"}</td>
              {tutorName && <td style={{ ...td, color: T.muted }}>{tutorName(s.tutorId)}</td>}
              <td style={{ ...td, paddingRight: 20 }}>{s.status === "cancelled" ? <Chip tone="red">Cancelled</Chip> : s.lessonId ? <Chip tone="green">Notes started</Chip> : <Chip tone="neutral">Scheduled</Chip>}</td>
            </tr>
          ); })}
        </tbody>
      </Table>
    </Card>
  );
}

function SessionDetail({ s, cls, colour, tutorName, busy, onEdit, onCancel, onRestore, onDelete, onDeleteFuture, onNotes, onClose }) {
  const [bg, fg] = colour;
  const cancelled = s.status === "cancelled";
  const zoom = s.zoomLink || cls?.zoomLink || null;
  const past = sessionEndMs(s) < Date.now();
  return (
    <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 10, borderLeft: `4px solid ${fg}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: bg, color: fg }}>{s.className || s.classId}</span>
            {s.studentIds ? <Chip tone="indigo">{s.studentIds.length === 1 ? "One student" : `${s.studentIds.length} students`}</Chip> : <Chip tone="neutral">Whole group</Chip>}
            {cancelled && <Chip tone="red">Cancelled</Chip>}
            {s.lessonId && <Chip tone="green">Notes started</Chip>}
            {tutorName && <Chip tone="neutral">{tutorName}</Chip>}
          </div>
          <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 700, marginTop: 6, textDecoration: cancelled ? "line-through" : "none" }}>{s.title || (s.studentIds ? "Session" : "Lesson")} · {describeSession(s)}</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
            {s.studentIds ? `For ${(s.studentNames || []).join(", ") || "the named students"} only. Nobody else in the group sees it.` : `${cls ? boardLabel(cls.board) : ""} · every student in the group sees it`}
            {s.note ? ` · ${s.note}` : ""}
          </div>
          {zoom && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Zoom: <a href={zoom} target="_blank" rel="noopener noreferrer" className="cm-link">{zoom}</a>{s.zoomLink ? " (this session only)" : ""}</div>}
        </div>
        <Button variant="ghost" aria-label="Close" onClick={onClose}><Icon name="x" size={16} /></Button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button variant="accent" icon="pencil" onClick={onNotes} disabled={busy || cancelled}>{s.lessonId ? "Open lesson notes" : past ? "Attendance and notes" : "Take attendance"}</Button>
        <Button onClick={onEdit} disabled={busy}>Edit or move</Button>
        {cancelled ? <Button onClick={onRestore} disabled={busy}>Restore</Button> : <Button onClick={onCancel} disabled={busy || !!s.lessonId}>Cancel session</Button>}
        <Button variant="danger" onClick={onDelete} disabled={busy || !!s.lessonId}>Delete</Button>
        {!s.studentIds && !s.lessonId && <Button variant="danger" onClick={onDeleteFuture} disabled={busy}>Delete this and later</Button>}
      </div>
      {s.lessonId && <span style={{ fontSize: 11, color: T.muted }}>Notes have been started for this session, so it cannot be cancelled or deleted from here. Delete the lesson from its notes page first.</span>}
    </Card>
  );
}

function SessionForm({ form, setF, classes, classOf, students, busy, onSubmit, onCancel }) {
  const cls = classOf(form.classId);
  const edit = form.mode === "edit";
  const toggle = (id) => setF({ studentIds: form.studentIds.includes(id) ? form.studentIds.filter(x => x !== id) : [...form.studentIds, id] });
  const pickGroup = (code) => { const c = classOf(code); const slot = slotsOf(c)[0]; setF({ classId: code, studentIds: [], ...(edit ? {} : { time: slot?.time || form.time, minutes: slot?.minutes || form.minutes }) }); };
  return (
    <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 }}>
      <CardHeader title={edit ? "Edit session" : "Add a session"} sub={edit ? "Change the day, time or who it is for. Students see the change straight away." : "A lesson for the whole group, or a session for chosen students that only they see."} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={field}><label style={label} htmlFor="ss-group">Group</label>
          <select id="ss-group" value={form.classId} onChange={e => pickGroup(e.target.value)} style={selectStyle}>
            {classes.map(c => <option key={c.code} value={c.code}>{c.name} ({boardLabel(c.board)})</option>)}
          </select></div>
        <div style={field}><label style={label} htmlFor="ss-date">Date</label><Input id="ss-date" type="date" value={form.date} onChange={e => setF({ date: e.target.value })} /></div>
        <div style={field}><label style={label} htmlFor="ss-time">Start</label>
          <select id="ss-time" value={form.time} onChange={e => setF({ time: e.target.value })} style={selectStyle}>
            {(TIMES.includes(form.time) ? TIMES : [form.time, ...TIMES]).map(t => <option key={t} value={t}>{fmtTime(t)}</option>)}
          </select></div>
        <div style={field}><label style={label} htmlFor="ss-mins">Length</label>
          <select id="ss-mins" value={form.minutes} onChange={e => setF({ minutes: Number(e.target.value) })} style={selectStyle}>
            {(DURATIONS.includes(Number(form.minutes)) ? DURATIONS : [Number(form.minutes), ...DURATIONS]).map(m => <option key={m} value={m}>{m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m} min`}</option>)}
          </select></div>
        {!edit && <div style={field}><label style={label} htmlFor="ss-repeat">Repeat weekly</label>
          <select id="ss-repeat" value={form.repeat} onChange={e => setF({ repeat: Number(e.target.value) })} style={selectStyle}>
            <option value={1}>Just once</option>
            {[2, 3, 4, 5, 6, 8, 10, 12, 14].map(n => <option key={n} value={n}>{n} weeks</option>)}
          </select></div>}
      </div>
      <div style={field}>
        <span style={label}>Who is it for?</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Button size="sm" variant={form.who === "group" ? "primary" : "secondary"} onClick={() => setF({ who: "group" })}>Whole group</Button>
          <Button size="sm" variant={form.who === "students" ? "primary" : "secondary"} onClick={() => setF({ who: "students" })}>Chosen students</Button>
        </div>
        {form.who === "students" && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            {students === undefined && <span style={{ fontSize: 12, color: T.muted }}>Loading students…</span>}
            {students && students.length === 0 && <span style={{ fontSize: 12, color: T.amber }}>No students are in {cls?.name || "this group"} yet.</span>}
            {(students || []).map(s => {
              const on = form.studentIds.includes(s.uid);
              return <button key={s.uid} onClick={() => toggle(s.uid)} style={{ padding: "6px 10px", borderRadius: 999, border: `1px solid ${on ? T.accent : T.border}`, background: on ? T.accentTint : T.card, color: on ? T.accentText : T.ink, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>{on ? "✓ " : ""}{s.displayName || s.email}</button>;
            })}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ ...field, flex: "1 1 220px" }}><label style={label} htmlFor="ss-title">Title (optional)</label><Input id="ss-title" value={form.title} onChange={e => setF({ title: e.target.value })} placeholder={form.who === "students" ? "e.g. Catch-up: equilibrium" : "e.g. Mock exam, Revision day"} /></div>
        <div style={{ ...field, flex: "1 1 260px" }}><label style={label} htmlFor="ss-zoom">Zoom link (blank = the group's usual link)</label><Input id="ss-zoom" type="url" value={form.zoomLink} onChange={e => setF({ zoomLink: e.target.value })} placeholder={cls?.zoomLink || "https://zoom.us/j/…"} /></div>
      </div>
      <div style={field}><label style={label} htmlFor="ss-note">Note for students (optional)</label><Input id="ss-note" value={form.note} onChange={e => setF({ note: e.target.value })} placeholder="e.g. Bring your data sheet. Shown with the session." /></div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="accent" onClick={onSubmit} disabled={busy || !form.classId || !form.date}>{busy ? "Saving…" : edit ? "Save changes" : form.repeat > 1 ? `Add ${form.repeat} sessions` : "Add session"}</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <span style={{ fontSize: 12, color: T.muted }}>{form.who === "students" ? "Only the ticked students and their parents see this, and only they get the reminder email." : "Every student in the group sees it, with the reminder email the day before."}</span>
      </div>
    </Card>
  );
}
