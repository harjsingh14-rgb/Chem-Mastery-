// What the student (and, by email, their parent) sees of each lesson: the
// notes their tutor has sent, newest first.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyLessonNotes } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, EmptyState, Icon } from "../ui/components";
import { useStudentCalendar, nextLessonRows } from "./StudentPanels";
import { fmtTime, describeSlots, slotsOf } from "../utils/schedule";
import CalendarSubscribe from "./CalendarSubscribe";

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

export function NoteBody({ n, compact, hideHead }) {
  const [tone, attLabel] = ATT[n.attendance] || ["neutral", ""];
  const topics = compact ? [] : (n.topics || []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {(!hideHead || topics.length > 0) && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {!hideHead && <span style={{ fontWeight: 700, fontSize: 14 }}>{fmtDate(n.date)}</span>}
          {!hideHead && attLabel && <Chip tone={tone}>{attLabel}</Chip>}
          {topics.map(t => <Chip key={t} tone="accent">{t}</Chip>)}
        </div>
      )}
      {n.summary && !compact && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.body, whiteSpace: "pre-wrap" }}>{n.summary}</div>}
      {n.www && <NoteSection label="What went well" tone={T.green} tint={T.greenTint} text={n.www} compact={compact} />}
      {n.ebi && <NoteSection label="Even better if" tone={T.amber} tint={T.amberTint} text={n.ebi} compact={compact} />}
      {n.text && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.body, whiteSpace: "pre-wrap" }}>{compact && n.text.length > 180 ? `${n.text.slice(0, 180)}…` : n.text}</div>}
      {n.extra && !compact && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.body, whiteSpace: "pre-wrap" }}>{n.extra}</div>}
      {n.homeworkText && !compact && <div style={{ fontSize: 13, lineHeight: 1.6, color: T.body, whiteSpace: "pre-wrap" }}><strong>Homework before the next lesson.</strong> {n.homeworkText}</div>}
      {n.recording && !compact && <div><Button size="sm" variant="primary" onClick={() => window.open(n.recording, "_blank", "noopener")}>Watch the lesson recording</Button></div>}
      {!compact && (n.attachments || []).length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Attached:</span>
          {n.attachments.map(a => <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className="cm-link" style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: T.soft }}>{a.name}</a>)}
        </div>
      )}
      {!compact && n.homework && (
        <div style={{ fontSize: 12, color: T.muted }}>
          Homework "{n.homework.title}": {n.homework.status === "submitted" ? `${n.homework.score}/${n.homework.maxScore} (${n.homework.pct}%)` : n.homework.status === "in-progress" ? "started, not finished" : "not started"}
          {n.homework.weak?.length ? ` · needs more work: ${n.homework.weak.join(", ")}` : ""}
        </div>
      )}
    </div>
  );
}

function NoteSection({ label, tone, tint, text, compact }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.55, color: T.body, background: tint, borderLeft: `3px solid ${tone}`, borderRadius: 8, padding: "6px 10px", whiteSpace: "pre-wrap" }}>
      <strong style={{ color: tone }}>{label}.</strong> {compact && text.length > 140 ? `${text.slice(0, 140)}…` : text}
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

/** The next few lessons from the calendar, for the student's and the parent's Lessons pages. */
export function UpcomingLessons({ uid, classId, who = "you" }) {
  const { cls, sessions } = useStudentCalendar(uid, classId);
  const loading = cls === undefined || sessions === null;
  const rows = loading ? [] : nextLessonRows(cls, sessions, 6);
  const live = rows.find(r => !r.cancelled);
  const slots = slotsOf(cls);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
      <CardHeader title="Coming up" sub={slots.length ? `Usually ${describeSlots(slots)}. Sessions listed only for ${who} are marked.` : "Lessons and sessions on the calendar"}
        right={live?.zoomLink ? <Button size="sm" variant="primary" onClick={() => window.open(live.zoomLink, "_blank", "noopener")}>Join on Zoom</Button> : null} />
      {loading && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
      {!loading && rows.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing is on the calendar yet.</span>}
      {rows.map((o, i) => (
        <div key={o.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", borderTop: i ? `1px solid ${T.line}` : "none", paddingTop: i ? 8 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: o === live ? 700 : 500, color: o.cancelled ? T.faint : T.ink, textDecoration: o.cancelled ? "line-through" : "none" }}>{fmtDate(o.date)} · {fmtTime(o.time)}{o.title ? ` · ${o.title}` : ""}</span>
            {(o.note || o.named) && <span style={{ fontSize: 11, color: T.muted }}>{[o.named ? `Only for ${who}` : null, o.note].filter(Boolean).join(" · ")}</span>}
          </div>
          <span>{o.cancelled ? <Chip tone="red">Cancelled</Chip> : o === live ? <Chip tone="accent">Next</Chip> : o.named ? <Chip tone="indigo">Extra session</Chip> : null}</span>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
        <CalendarSubscribe who={who === "you" ? "Your lessons" : `${who}'s lessons`} />
      </div>
    </Card>
  );
}

/** One lesson in the student's list: a row that opens to the full note. */
function LessonRow({ n, open, onToggle, first }) {
  const [tone, attLabel] = ATT[n.attendance] || ["neutral", ""];
  const files = (n.attachments || []).length;
  const line = (n.topics || [])[0] || (n.summary || "").split("\n")[0] || n.www || n.text || "";
  const more = (n.topics || []).length > 1 ? ` +${n.topics.length - 1}` : "";
  return (
    <div style={{ borderTop: first ? "none" : `1px solid ${T.line}` }}>
      <button type="button" onClick={onToggle} aria-expanded={open}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 0", border: "none", background: "none", cursor: "pointer", textAlign: "left", color: T.ink }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{fmtDate(n.date)}</span>
            {attLabel && <Chip tone={tone}>{attLabel}</Chip>}
            {n.recording && <Chip tone="indigo">Recording</Chip>}
            {files > 0 && <Chip tone="neutral">{files} file{files === 1 ? "" : "s"}</Chip>}
          </div>
          {!open && line && <span style={{ fontSize: 13, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{line}{more}</span>}
        </div>
        <Icon name="chevronDown" size={16} color={T.muted} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      {open && (
        <div style={{ paddingBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {n.recording && <div><Button variant="primary" icon="play" onClick={() => window.open(n.recording, "_blank", "noopener")}>Watch the lesson recording</Button></div>}
          <NoteBody n={{ ...n, recording: null }} hideHead />
        </div>
      )}
    </div>
  );
}

export default function StudentLessons({ authUser, userProfile }) {
  const notes = useMyLessonNotes(authUser?.uid);
  const [open, setOpen] = useState(null); // note id; the newest is open until you tap another
  const openId = open ?? notes?.[0]?.id ?? null;
  const toggle = (id) => setOpen(openId === id ? "" : id);
  const recorded = (notes || []).filter(n => n.recording).length;
  return (
    <>
      <PageHeader eyebrow="Lessons" title="Lessons" sub="What is coming up, then a note from your tutor after each lesson. Tap a lesson to open it. Your parent gets the same note by email." />
      {userProfile?.classId && <UpcomingLessons uid={authUser?.uid} classId={userProfile.classId} who="you" />}
      {notes === null && <div style={{ fontSize: 13, color: T.muted }}>Loading…</div>}
      {notes && notes.length === 0 && <Card padding={0}><EmptyState icon="calendar" title="No notes yet" body="After each lesson your tutor writes a short note: what was covered, how you did on the homework, and what to work on." /></Card>}
      {notes && notes.length > 0 && (
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <CardHeader title="Past lessons" sub={`${notes.length} lesson${notes.length === 1 ? "" : "s"}${recorded ? ` · ${recorded} with a recording` : ""}`} />
          {notes.map((n, i) => <LessonRow key={n.id} n={n} first={i === 0} open={openId === n.id} onToggle={() => toggle(n.id)} />)}
        </Card>
      )}
    </>
  );
}
