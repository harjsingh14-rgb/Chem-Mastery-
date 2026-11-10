// What the student (and, by email, their parent) sees of each lesson: the
// notes their tutor has sent, newest first.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyLessonNotes } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, EmptyState } from "../ui/components";

const fmtDate = (iso) => { const d = new Date(`${iso}T00:00:00`); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); };
const ATT = { present: ["green", "Present"], late: ["amber", "Late"], absent: ["red", "Absent"] };

export function useMyLessonNotes(uid) {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    if (!uid) { setNotes([]); return; }
    let cancelled = false;
    fetchMyLessonNotes(uid).then(n => { if (!cancelled) setNotes(n); }).catch(() => { if (!cancelled) setNotes([]); });
    return () => { cancelled = true; };
  }, [uid]);
  return notes;
}

export function NoteBody({ n, compact }) {
  const [tone, attLabel] = ATT[n.attendance] || ["neutral", ""];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{fmtDate(n.date)}</span>
        {attLabel && <Chip tone={tone}>{attLabel}</Chip>}
        {!compact && (n.topics || []).map(t => <Chip key={t} tone="accent">{t}</Chip>)}
      </div>
      {n.text && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.body, whiteSpace: "pre-wrap" }}>{compact && n.text.length > 180 ? `${n.text.slice(0, 180)}…` : n.text}</div>}
      {!compact && n.homework && (
        <div style={{ fontSize: 12, color: T.muted }}>
          Homework "{n.homework.title}": {n.homework.status === "submitted" ? `${n.homework.score}/${n.homework.maxScore} (${n.homework.pct}%)` : n.homework.status === "in-progress" ? "started, not finished" : "not started"}
          {n.homework.weak?.length ? ` · needs more work: ${n.homework.weak.join(", ")}` : ""}
        </div>
      )}
    </div>
  );
}

/** Dashboard card: the two most recent notes. */
export function LessonNotesCard({ authUser, board }) {
  const navigate = useNavigate();
  const notes = useMyLessonNotes(authUser?.uid);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CardHeader title="Lesson notes" sub="From your tutor after each lesson" right={notes && notes.length > 0 ? <Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => navigate(`/${board}/lessons`)}>All</Button> : null} />
      {notes === null && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
      {notes && notes.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Your tutor's notes appear here after your first lesson.</span>}
      {(notes || []).slice(0, 2).map(n => <div key={n.id} style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}><NoteBody n={n} compact /></div>)}
    </Card>
  );
}

export default function StudentLessons({ authUser }) {
  const notes = useMyLessonNotes(authUser?.uid);
  return (
    <>
      <PageHeader eyebrow="Lessons" title="Lesson notes" sub="What your tutor sent after each lesson. Your parent gets the same note by email." />
      {notes === null && <div style={{ fontSize: 13, color: T.muted }}>Loading…</div>}
      {notes && notes.length === 0 && <Card padding={0}><EmptyState icon="calendar" title="No notes yet" body="After each lesson your tutor writes a short note: what was covered, how you did on the homework, and what to work on." /></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(notes || []).map(n => <Card key={n.id}><NoteBody n={n} /></Card>)}
      </div>
    </>
  );
}
