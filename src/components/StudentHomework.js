import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClassAssignments, fetchMySubmissions } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Bar, EmptyState, IconTile } from "../ui/components";
import { fmtDue, isOverdue } from "../utils/homeworkBank";

/** Assignments for the student's class with their own submission status. */
export function useHomework(uid, classId) {
  const [state, setState] = useState({ rows: null, loading: true });
  useEffect(() => {
    if (!uid) { setState({ rows: [], loading: false }); return; }
    let cancelled = false;
    (async () => {
      try {
        const [asg, subs] = await Promise.all([fetchClassAssignments(classId), fetchMySubmissions(uid)]);
        if (cancelled) return;
        const rows = asg.filter(a => a.status !== "closed" || subs.some(s => s.assignmentId === a.id)).map(a => {
          const sub = subs.find(s => s.assignmentId === a.id) || null;
          const answered = sub ? Object.keys(sub.answers || {}).length : 0;
          const status = !sub ? "todo" : sub.submittedAt ? "done" : "progress";
          const pct = sub && sub.submittedAt && sub.maxScore ? Math.round((sub.totalScore / sub.maxScore) * 100) : null;
          return { a, sub, answered, status, pct, overdue: status !== "done" && isOverdue(a.dueAt) };
        });
        setState({ rows, loading: false });
      } catch (e) { if (!cancelled) setState({ rows: [], loading: false, error: e.message }); }
    })();
    return () => { cancelled = true; };
  }, [uid, classId]);
  return state;
}

export function HomeworkRow({ row, board }) {
  const navigate = useNavigate();
  const { a, status, answered, pct, overdue } = row;
  const tone = status === "done" ? "green" : overdue ? "red" : status === "progress" ? "accent" : "amber";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderTop: `1px solid ${T.line}`, flexWrap: "wrap" }}>
      <IconTile name={status === "done" ? "check" : "checkSquare"} tone={tone} size={40} />
      <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontWeight: 600 }}>{a.title}</span>
        <span style={{ fontSize: 12, color: overdue ? T.red : T.muted }}>{a.minutes} min · {a.summary} · {status === "done" ? "Marked" : `Due ${fmtDue(a.dueAt)}`}{overdue ? " · overdue" : ""}</span>
      </div>
      {status === "done" ? (
        <Chip tone={pct >= 75 ? "green" : pct >= 50 ? "amber" : "red"}>{row.sub.totalScore} / {row.sub.maxScore} · {pct}%</Chip>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 140 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: T.muted }}>Progress</span><span style={{ fontWeight: 600 }}>{answered} / {a.items.length}</span></div>
          <Bar value={(answered / Math.max(1, a.items.length)) * 100} colour={T.accent} />
        </div>
      )}
      <Button variant={status === "done" ? "secondary" : "primary"} onClick={() => navigate(`/${board}/homework/${a.id}`)}>{status === "done" ? "Feedback" : status === "progress" ? "Continue" : "Start"}</Button>
    </div>
  );
}

export default function StudentHomework({ board, authUser, userProfile }) {
  const { rows, loading } = useHomework(authUser?.uid, userProfile?.classId);
  const inClass = !!userProfile?.classId;
  const todo = (rows || []).filter(r => r.status !== "done");
  const done = (rows || []).filter(r => r.status === "done");

  return (
    <>
      <PageHeader eyebrow="Homework" title="Homework" sub="Work your tutor has set you. Answers save as you go, and marks and feedback come back on the same page." />
      {!inClass && <Card padding={0}><EmptyState icon="users" title="Join your class first" body="Enter your tutor's class code from the account menu (top right). Homework will show up here." /></Card>}
      {inClass && (
        <>
          <Card padding={0}>
            <CardHeader title="To do" right={<Chip tone={todo.some(r => r.overdue) ? "red" : "accent"}>{todo.length}</Chip>} style={{ padding: "16px 20px" }} />
            {loading && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
            {!loading && todo.length === 0 && <EmptyState icon="check" title="Nothing to do" body="When your tutor sets homework it appears here with a due date." />}
            {todo.map(r => <HomeworkRow key={r.a.id} row={r} board={board} />)}
          </Card>
          {done.length > 0 && (
            <Card padding={0}>
              <CardHeader title="Marked" right={<Chip tone="neutral">{done.length}</Chip>} style={{ padding: "16px 20px" }} />
              {done.map(r => <HomeworkRow key={r.a.id} row={r} board={board} />)}
            </Card>
          )}
        </>
      )}
    </>
  );
}

export { pctColour };
