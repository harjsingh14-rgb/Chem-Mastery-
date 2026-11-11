// What a parent sees of their child: progress, lessons and attendance,
// homework status and payments. Read-only; everything comes from the same
// Firestore records the student and tutor use.
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfiles, fetchClass, fetchMyLessonNotes, fetchPayments, fetchMyPpqAttempts } from "../firebase";
import { T, pctColour, boardLabel } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, StatTile, Tabs, EmptyState, Notice, Table, th, td, Button } from "../ui/components";
import useAttempts from "../hooks/useAttempts";
import { summarise, groupBySection, relativeTime, TYPE_LABEL, attemptTime } from "../utils/analytics";
import { TopicTable, AccuracySpark } from "./StudentDashboard";
import { NoteBody, UpcomingLessons } from "./StudentLessons";
import CommunityCard from "./CommunityCard";
import { describeSlots, slotsOf } from "../utils/schedule";
import { useHomework } from "./StudentHomework";
import { fmtDue } from "../utils/homeworkBank";

const TABS = [{ id: "progress", label: "Progress" }, { id: "lessons", label: "Lessons" }, { id: "homework", label: "Homework" }, { id: "payments", label: "Payments" }];

export default function ParentPage({ authUser, userProfile, childUid }) {
  const navigate = useNavigate();
  const [children, setChildren] = useState(null);
  const [tab, setTab] = useState("progress");
  const [error, setError] = useState(null);

  useEffect(() => {
    const ids = userProfile?.children || [];
    if (ids.length === 0) { setChildren([]); return; }
    let alive = true;
    fetchUserProfiles(ids).then(list => alive && setChildren(list.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""))))
      .catch(e => { if (alive) { setError(e.message); setChildren([]); } });
    return () => { alive = false; };
  }, [userProfile]);

  const child = useMemo(() => {
    if (!children || children.length === 0) return null;
    return children.find(c => c.uid === childUid) || children[0];
  }, [children, childUid]);

  if (children === null) return <div style={{ color: T.muted, padding: 20 }}>Loading…</div>;
  if (children.length === 0) return (
    <>
      <PageHeader eyebrow="Parent" title="My child" />
      {error && <Notice tone="red">{error}</Notice>}
      <Card padding={0}><EmptyState icon="users" title="No student linked yet" body="Your account is not linked to a student. If your child has started with HSJ Tuition, reply to your welcome email and we will connect it." /></Card>
    </>
  );

  return (
    <>
      <PageHeader eyebrow="Parent" title={child.displayName || "My child"}
        sub={[child.className, child.board ? boardLabel(child.board) : null, child.year ? `Year ${child.year}` : null].filter(Boolean).join(" · ")}
        right={children.length > 1 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {children.map(c => <Button key={c.uid} size="sm" variant={c.uid === child.uid ? "primary" : "secondary"} onClick={() => navigate(`/parent/${c.uid}`)}>{(c.displayName || "Student").split(" ")[0]}</Button>)}
          </div>
        )} />
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === "progress" && <CommunityCard who="parent" style={{ marginBottom: 14 }} />}
      {tab === "progress" && <ProgressTab child={child} />}
      {tab === "lessons" && <LessonsTab child={child} />}
      {tab === "homework" && <HomeworkTab child={child} />}
      {tab === "payments" && <PaymentsTab child={child} parentName={userProfile?.displayName} />}
    </>
  );
}

// ─── Progress ───────────────────────────────────────────────────────────────
function ProgressTab({ child }) {
  const { attempts, loading } = useAttempts(child.uid);
  const [ppq, setPpq] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchMyPpqAttempts(child.uid).then(a => alive && setPpq(a)).catch(() => alive && setPpq([]));
    return () => { alive = false; };
  }, [child.uid]);
  const s = useMemo(() => summarise(attempts), [attempts]);
  const groups = useMemo(() => groupBySection(s.topicList, t => TYPE_LABEL[t.type] || (t.type === "ppq" ? "Past papers" : "Other")), [s]);
  const ppqMarks = (ppq || []).reduce((acc, a) => ({ got: acc.got + (a.best || 0), of: acc.of + (a.totalMarks || 0) }), { got: 0, of: 0 });
  const first = (child.displayName || "your child").split(" ")[0];

  return (
    <>
      <div className="cm-grid-4">
        <StatTile label="Answers · all time" value={loading ? "…" : s.total} sub={s.allPct === null ? "" : `${s.allPct}% correct`} />
        <StatTile label="Accuracy · 30 days" value={s.monthPct === null ? "–" : `${s.monthPct}%`} sub={`${s.month} answers`} />
        <StatTile label="Past-paper questions" value={ppq === null ? "…" : ppq.length} sub={ppqMarks.of ? `${ppqMarks.got} of ${ppqMarks.of} marks at best` : "none attempted yet"} />
        <StatTile label="Last active" value={s.last ? relativeTime(s.last) : "–"} />
      </div>
      <div className="cm-two-col">
        <div className="cm-main-col">
          <Card padding={0}>
            <CardHeader title="Performance by topic" sub={`Everything ${first} has answered, in revision and homework`} style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
            <TopicTable groups={groups} emptyBody={`Nothing answered yet. Topics appear here once ${first} starts practising.`} />
          </Card>
        </div>
        <aside className="cm-side-col">
          <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <CardHeader title="Accuracy over time" sub="weekly" />
            <AccuracySpark weekly={s.weekly} />
          </Card>
          <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CardHeader title="Needs work" sub="Topics under 75% with enough answers to judge" />
            {s.weak.filter(t => t.pct < 75).length === 0
              ? <span style={{ fontSize: 13, color: T.muted }}>Nothing flagged yet.</span>
              : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{s.weak.filter(t => t.pct < 75).map(t => <Chip key={t.key} tone={t.pct >= 50 ? "amber" : "red"}>{t.label} · {t.pct}%</Chip>)}</div>}
          </Card>
          <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CardHeader title="Recent answers" />
            {s.recent.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing yet.</span>}
            {s.recent.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.correct ? T.green : T.red, flexShrink: 0 }} />
                <span style={{ fontWeight: 700, width: 56, color: T.muted }}>{TYPE_LABEL[a.type] || (a.type === "ppq" ? "Paper" : a.type)}</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.topicLabel || a.topic || a.questionId}</span>
                {a.maxScore > 1 && <span style={{ fontWeight: 700, color: pctColour(Math.round((a.score / a.maxScore) * 100)) }}>{a.score}/{a.maxScore}</span>}
                <span style={{ color: T.muted, flexShrink: 0 }}>{relativeTime(attemptTime(a))}</span>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </>
  );
}

// ─── Lessons and attendance ─────────────────────────────────────────────────
function LessonsTab({ child }) {
  const [notes, setNotes] = useState(null);
  const [group, setGroup] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchMyLessonNotes(child.uid).then(n => alive && setNotes(n)).catch(() => alive && setNotes([]));
    if (child.classId) fetchClass(child.classId).then(g => alive && setGroup(g)).catch(() => {});
    return () => { alive = false; };
  }, [child.uid, child.classId]);
  const counts = (notes || []).reduce((c, n) => { c[n.attendance || "unknown"] = (c[n.attendance || "unknown"] || 0) + 1; return c; }, {});
  const total = (notes || []).length;
  return (
    <>
      <div className="cm-grid-4">
        <StatTile label="Lessons with a note" value={notes === null ? "…" : total} sub={describeSlots(slotsOf(group)) || group?.name || ""} />
        <StatTile label="Present" value={counts.present || 0} sub={total ? `${Math.round(((counts.present || 0) / total) * 100)}% of lessons` : ""} />
        <StatTile label="Late" value={counts.late || 0} />
        <StatTile label="Absent" value={counts.absent || 0} />
      </div>
      <UpcomingLessons uid={child.uid} classId={child.classId} who={(child.displayName || "your child").split(" ")[0]} />
      {notes && notes.length === 0 && <Card padding={0}><EmptyState icon="calendar" title="No lesson notes yet" body="After each lesson the tutor writes a short note: what was covered, attendance, how the homework went and what to work on. You also get it by email." /></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(notes || []).map(n => <Card key={n.id}><NoteBody n={n} /></Card>)}
      </div>
    </>
  );
}

// ─── Homework ───────────────────────────────────────────────────────────────
function HomeworkTab({ child }) {
  const { rows, loading } = useHomework(child.uid, child.classId);
  const first = (child.displayName || "your child").split(" ")[0];
  const todo = (rows || []).filter(r => r.status !== "done");
  const done = (rows || []).filter(r => r.status === "done");
  const Row = ({ r }) => {
    const { a, status, answered, pct, overdue } = r;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderTop: `1px solid ${T.line}`, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontWeight: 600 }}>{a.title}</span>
          <span style={{ fontSize: 12, color: overdue ? T.red : T.muted }}>{a.minutes} min · {a.summary} · {status === "done" ? "Submitted and marked" : `Due ${fmtDue(a.dueAt)}`}{overdue ? " · overdue" : ""}</span>
        </div>
        {status === "done"
          ? <Chip tone={pct >= 75 ? "green" : pct >= 50 ? "amber" : "red"}>{r.sub.totalScore} / {r.sub.maxScore} · {pct}%</Chip>
          : <Chip tone={overdue ? "red" : status === "progress" ? "accent" : "amber"}>{status === "progress" ? `${answered} of ${a.items.length} answered` : "Not started"}</Chip>}
      </div>
    );
  };
  return (
    <>
      {!child.classId && <Card padding={0}><EmptyState icon="users" title="Not in a group yet" body={`Homework appears here once ${first} is placed in a group.`} /></Card>}
      {child.classId && (
        <>
          <Card padding={0}>
            <CardHeader title="Set and not yet submitted" right={<Chip tone={todo.some(r => r.overdue) ? "red" : "accent"}>{todo.length}</Chip>} style={{ padding: "16px 20px" }} />
            {loading && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
            {!loading && todo.length === 0 && <div style={{ padding: "14px 20px", fontSize: 13, color: T.muted }}>Nothing outstanding.</div>}
            {todo.map(r => <Row key={r.a.id} r={r} />)}
          </Card>
          <Card padding={0}>
            <CardHeader title="Marked" right={<Chip tone="neutral">{done.length}</Chip>} style={{ padding: "16px 20px" }} />
            {!loading && done.length === 0 && <div style={{ padding: "14px 20px", fontSize: 13, color: T.muted }}>No marked homework yet.</div>}
            {done.map(r => <Row key={r.a.id} r={r} />)}
          </Card>
        </>
      )}
    </>
  );
}

// ─── Payments ───────────────────────────────────────────────────────────────
const money = (n) => `£${Number(n || 0).toLocaleString("en-GB", { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2 })}`;
const fmtDate = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "–";
const STATUS = { paid: ["green", "Paid"], open: ["amber", "Due"], overdue: ["red", "Overdue"], draft: ["neutral", "Scheduled"], void: ["neutral", "Cancelled"], uncollectible: ["red", "Unpaid"] };

function PaymentsTab({ child }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchPayments({ uid: child.uid }).then(p => alive && setRows(p)).catch(e => { if (alive) { setError(e.message); setRows([]); } });
    return () => { alive = false; };
  }, [child.uid]);
  const now = Date.now();
  const list = (rows || []).map(p => ({ ...p, state: p.status === "open" && p.dueAt && p.dueAt < now ? "overdue" : p.status }));
  const paid = list.filter(p => p.state === "paid").reduce((s, p) => s + Number(p.amount || 0), 0);
  const due = list.filter(p => p.state === "open" || p.state === "overdue").reduce((s, p) => s + Number(p.amount || 0), 0);
  const plan = child.agreement;
  return (
    <>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="cm-grid-4">
        <StatTile label="Programme fee" value={plan?.totalFee ? money(plan.totalFee) : "–"} sub={plan?.paymentPlan === "pif" ? "Paid in full" : plan?.paymentPlan === "instalments" ? "Instalments" : plan?.paymentPlan === "results" ? "Results-based" : ""} />
        <StatTile label="Paid so far" value={money(paid)} />
        <StatTile label="Outstanding" value={money(due)} subTone={due > 0 ? "amber" : undefined} sub={list.some(p => p.state === "overdue") ? "includes an overdue invoice" : ""} />
        <StatTile label="Invoices" value={rows === null ? "…" : list.length} />
      </div>
      <Card padding={0}>
        <CardHeader title="Invoices" sub="Issued by HSJ Tuition through Stripe. Pay online from the link, or by bank transfer as agreed." style={{ padding: "16px 20px" }} />
        {rows && list.length === 0 && <EmptyState icon="chart" title="No invoices yet" body="Invoices appear here when they are issued." />}
        {list.length > 0 && (
          <Table minWidth={560}>
            <thead><tr><th style={th}>Description</th><th style={th}>Amount</th><th style={th}>Due</th><th style={th}>Status</th><th style={th}></th></tr></thead>
            <tbody>
              {list.map(p => {
                const [tone, label] = STATUS[p.state] || ["neutral", p.state || ""];
                return (
                  <tr key={p.id} style={{ borderTop: `1px solid ${T.line}` }}>
                    <td style={td}>{p.description || "Tutoring programme"}{p.number ? <span style={{ color: T.muted }}> · {p.number}</span> : null}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{money(p.amount)}</td>
                    <td style={td}>{p.state === "paid" ? `Paid ${fmtDate(p.paidAt)}` : fmtDate(p.dueAt)}</td>
                    <td style={td}><Chip tone={tone}>{label}</Chip></td>
                    <td style={{ ...td, textAlign: "right" }}>{(p.state === "open" || p.state === "overdue") && p.hostedInvoiceUrl && <a className="cm-link" href={p.hostedInvoiceUrl} target="_blank" rel="noreferrer">Pay online</a>}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

