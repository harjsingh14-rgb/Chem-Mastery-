// Students: every student a tutor teaches (admins: everyone), one row each,
// with the group, how they are doing this week, attendance and when they were
// last active. Click a row for the student's profile. Admins also get the
// Onboarding tab (adding, following and placing new students, and importing).
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllClasses, fetchTutorClasses, fetchAllStudents, fetchStudentsForTutor, fetchAttemptsForTutor, fetchClassLessonNotes } from "../firebase";
import { T, groupColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Avatar, AccuracyBar, Tabs } from "../ui/components";
import { summarise, relativeTime, studentRow } from "../utils/analytics";
import TutorStudents from "./TutorStudents";

export function AttendanceChips({ a }) {
  if (!a) return <span style={{ fontSize: 12, color: T.muted }}>No lessons noted</span>;
  const total = a.present + a.late + a.absent;
  if (!total) return <span style={{ fontSize: 12, color: T.muted }}>No lessons noted</span>;
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }} title={`${a.present} present, ${a.late} late, ${a.absent} absent of ${total}`}>
      <Chip tone={a.absent === 0 ? "green" : a.absent / total > 0.25 ? "red" : "amber"}>{a.present + a.late}/{total} attended</Chip>
      {a.late > 0 && <Chip tone="amber">{a.late} late</Chip>}
    </div>
  );
}

export default function StudentsPage({ authUser, userProfile, tab = "all" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = userProfile?.role === "admin";
  const params = new URLSearchParams(location.search);
  const tabs = [{ id: "all", label: "All students" }, ...(isAdmin ? [{ id: "onboarding", label: "Onboarding" }] : [])];
  const go = (id) => navigate(id === "all" ? "/tutor/students" : "/tutor/students/onboarding");

  return (
    <>
      <PageHeader eyebrow="Students" title={tab === "onboarding" ? "Onboarding" : "Students"}
        sub={tab === "onboarding" ? "Add a student after the discovery call. They get the self-evaluation, the parent gets the terms, and you place them into a group here." : "Everyone you teach. Open a student for their attendance, notes, homework and family details."}
        right={isAdmin && tab === "all" ? <>
          <Button icon="message" onClick={() => navigate("/tutor/students/email")}>Email students</Button>
          <Button icon="users" onClick={() => navigate("/tutor/students/onboarding?import=1")}>Import current students</Button>
          <Button variant="primary" icon="plus" onClick={() => navigate("/tutor/students/onboarding?new=1")}>Add student</Button>
        </> : null} />
      {tabs.length > 1 && <Tabs tabs={tabs} value={tab} onChange={go} />}
      {tab === "onboarding"
        ? <TutorStudents authUser={authUser} userProfile={userProfile} embedded startNew={params.get("new") === "1"} startImport={params.get("import") === "1"} />
        : <Directory authUser={authUser} isAdmin={isAdmin} initialGroup={params.get("group") || ""} initialAttention={params.get("attention") === "1"} />}
    </>
  );
}

function Directory({ authUser, isAdmin, initialGroup, initialAttention }) {
  const navigate = useNavigate();
  const tutorUid = authUser?.uid;
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState(initialGroup);
  const [onlyAttention, setOnlyAttention] = useState(initialAttention);

  useEffect(() => {
    if (!tutorUid) return;
    let alive = true;
    (async () => {
      try {
        const [cls, list, att] = await Promise.all([
          isAdmin ? fetchAllClasses() : fetchTutorClasses(tutorUid),
          isAdmin ? fetchAllStudents() : fetchStudentsForTutor(tutorUid),
          fetchAttemptsForTutor(tutorUid).catch(() => []),
        ]);
        if (!alive) return;
        setClasses(cls); setStudents(list); setAttempts(att);
        // Attendance from every lesson note, one query per group
        const notes = (await Promise.all(cls.map(c => fetchClassLessonNotes(c.code, isAdmin ? null : tutorUid).catch(() => [])))).flat();
        if (!alive) return;
        const byUid = {};
        for (const n of notes) { const a = byUid[n.uid] || (byUid[n.uid] = { present: 0, late: 0, absent: 0 }); if (a[n.attendance] !== undefined) a[n.attendance]++; }
        setAttendance(byUid);
      } catch (e) { if (alive) { setError(e.message); setStudents([]); } }
    })();
    return () => { alive = false; };
  }, [tutorUid, isAdmin]);

  const perStudent = useMemo(() => {
    const by = {};
    for (const a of attempts) (by[a.uid] || (by[a.uid] = [])).push(a);
    const out = {};
    for (const uid of Object.keys(by)) out[uid] = summarise(by[uid]);
    return out;
  }, [attempts]);
  const colourOf = (code) => groupColour(classes.findIndex(c => c.code === code));
  const tutorOf = (code) => (classes.find(c => c.code === code) || {}).tutorId;

  const rows = useMemo(() => (students || []).map(s => studentRow(s, perStudent[s.uid]))
    .filter(r => !group || (group === "none" ? !r.s.classId : r.s.classId === group))
    .filter(r => !onlyAttention || r.flags.length > 0)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.s.email || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)), [students, perStudent, group, onlyAttention, search]);
  const attentionCount = (students || []).filter(s => studentRow(s, perStudent[s.uid]).flags.length > 0).length;
  const unplaced = (students || []).filter(s => !s.classId).length;
  const sel = { padding: "7px 10px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink };

  return (
    <>
      {error && <Notice tone="red">{error}</Notice>}
      <Card padding={0}>
        <CardHeader title={students ? `${rows.length} of ${students.length} students` : "Students"} style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
          right={<>
            <select value={group} onChange={e => setGroup(e.target.value)} aria-label="Filter by group" style={sel}>
              <option value="">All groups</option>
              {classes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              {unplaced > 0 && <option value="none">No group yet</option>}
            </select>
            <Button size="sm" variant={onlyAttention ? "primary" : "secondary"} onClick={() => setOnlyAttention(v => !v)}>Needs attention{attentionCount ? ` · ${attentionCount}` : ""}</Button>
            <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 160, padding: "7px 12px", fontSize: 13 }} aria-label="Search students" />
          </>} />
        {students === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {students && students.length === 0 && <EmptyState icon="users" title="No students yet" body={isAdmin ? "Add a student from Onboarding, or import your current students." : "Students appear here once HSJ places them into one of your groups."} />}
        {students && students.length > 0 && rows.length === 0 && <EmptyState icon="search" title="Nobody matches" body="Try another group or clear the search." />}
        {rows.length > 0 && (
          <Table minWidth={820}>
            <thead>
              <tr>
                <th style={{ ...th, paddingLeft: 20 }}>Student</th>
                <th style={th}>Group</th>
                <th style={th}>Status</th>
                <th style={th}>This week</th>
                <th style={{ ...th, width: 170 }}>Accuracy · 7d</th>
                <th style={th}>Attendance</th>
                <th style={{ ...th, paddingRight: 20 }}>Last active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ s, sum, weekPct, flags, name }) => {
                const [bg, fg] = colourOf(s.classId);
                const other = isAdmin && s.classId && tutorOf(s.classId) && tutorOf(s.classId) !== tutorUid;
                return (
                  <tr key={s.uid} className="cm-row-hover" onClick={() => navigate(`/tutor/students/${s.uid}`)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                    <td style={{ ...td, paddingLeft: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={s.displayName} email={s.email} photoURL={s.photoURL} size={34} />
                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: s.displayName ? T.ink : T.muted }}>{name}</span>
                          <span style={{ fontSize: 11, color: T.muted }}>{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={td}>{s.classId ? <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: bg, color: fg, whiteSpace: "nowrap" }}>{s.className || s.classId}</span> : <Chip tone="amber">No group</Chip>}</td>
                    <td style={td}>
                      {s.accessDisabled ? <Chip tone="red">Access off</Chip> : other ? <Chip tone="neutral">Another tutor</Chip> : flags.length === 0 ? <Chip tone="green">On track</Chip> : <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{flags.map(f => <Chip key={f.text} tone={f.tone}>{f.text}</Chip>)}</div>}
                    </td>
                    <td style={{ ...td, fontWeight: 600 }}>{sum?.week || 0} <span style={{ color: T.muted, fontWeight: 400 }}>Qs</span></td>
                    <td style={td}><AccuracyBar pct={weekPct} width={150} /></td>
                    <td style={td}><AttendanceChips a={attendance[s.uid]} /></td>
                    <td style={{ ...td, paddingRight: 20, color: T.muted, whiteSpace: "nowrap" }}>{sum?.last ? relativeTime(sum.last) : "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
      {!isAdmin && <span style={{ fontSize: 12, color: T.muted }}>Adding and placing students is done by HSJ admin.</span>}
    </>
  );
}


