import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLesson, updateSession } from "../firebase";
import { fmtTime, isoDate, addDays, sessionEndMs, DEFAULT_MINUTES } from "../utils/schedule";
import { T, groupColour } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Notice } from "../ui/components";

// "This week" on the tutor Overview: every lesson and session from Monday to
// Sunday as a list, with the Zoom link and a one-click way into the register.

const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const mondayOf = (iso) => { const d = new Date(`${iso}T00:00:00`); return addDays(iso, -((d.getDay() + 6) % 7)); };
const dayHeading = (iso, today) => {
  const d = new Date(`${iso}T00:00:00`);
  const label = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  if (iso === today) return `Today · ${label}`;
  if (iso === addDays(today, 1)) return `Tomorrow · ${label}`;
  return label;
};
const endTime = (s) => { const d = new Date(sessionEndMs({ ...s, minutes: s.minutes || DEFAULT_MINUTES })); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

export default function WeekList({ sessions, classes, tutorUid, tutorName, onLessonCreated }) {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0); // weeks from this week
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);
  const today = isoDate(new Date());
  const from = addDays(mondayOf(today), 7 * offset);
  const to = addDays(from, 6);

  const byDay = useMemo(() => {
    const rows = (sessions || []).filter(s => s.date >= from && s.date <= to)
      .sort((a, b) => (a.startAt || 0) - (b.startAt || 0) || (a.time || "").localeCompare(b.time || ""));
    const groups = [];
    for (const s of rows) {
      const last = groups[groups.length - 1];
      if (last && last.date === s.date) last.items.push(s); else groups.push({ date: s.date, items: [s] });
    }
    return groups;
  }, [sessions, from, to]);

  const total = byDay.reduce((n, g) => n + g.items.filter(s => s.status !== "cancelled").length, 0);
  const minutes = byDay.reduce((n, g) => n + g.items.filter(s => s.status !== "cancelled").reduce((m, s) => m + (s.minutes || DEFAULT_MINUTES), 0), 0);
  const groupOf = (s) => (classes || []).find(c => c.code === s.classId);
  const colourOf = (s) => groupColour((classes || []).findIndex(c => c.code === s.classId));

  const openNotes = async (s) => {
    if (s.lessonId) { navigate(`/tutor/lessons/${s.lessonId}`); return; }
    setBusyId(s.id); setError(null);
    try {
      const l = await createLesson(tutorUid, { classId: s.classId, className: s.className, board: s.board, date: s.date, topics: [], sessionId: s.id, studentIds: s.studentIds || null, title: s.title || null });
      await updateSession(s.id, { lessonId: l.id });
      if (onLessonCreated) onLessonCreated(s.id, l.id);
      navigate(`/tutor/lessons/${l.id}`);
    } catch (e) { setError(e.message || "Could not open the notes"); setBusyId(null); }
  };

  const weekLabel = offset === 0 ? "This week" : offset === 1 ? "Next week" : offset === -1 ? "Last week" : `Week of ${new Date(`${from}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  const hours = minutes ? `${Math.round((minutes / 60) * 10) / 10} teaching hours` : null;

  return (
    <Card padding={0} style={{ marginBottom: 14 }}>
      <CardHeader title={weekLabel} style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
        sub={[`${total} lesson${total === 1 ? "" : "s"}`, hours, `${DAY_LABEL[1]} ${from.slice(8)} to ${DAY_LABEL[0]} ${to.slice(8)}`].filter(Boolean).join(" · ")}
        right={<div style={{ display: "flex", gap: 6 }}>
          <Button size="sm" icon="arrowLeft" aria-label="Previous week" onClick={() => setOffset(o => o - 1)} />
          {offset !== 0 && <Button size="sm" onClick={() => setOffset(0)}>This week</Button>}
          <Button size="sm" icon="arrowRight" aria-label="Next week" onClick={() => setOffset(o => o + 1)} />
          <Button size="sm" icon="calendar" onClick={() => navigate("/tutor/calendar")}>Calendar</Button>
        </div>} />
      {error && <Notice tone="red" style={{ margin: 12 }}>{error}</Notice>}
      {byDay.length === 0 && (
        <div style={{ padding: "18px 20px", fontSize: 13, color: T.muted }}>
          Nothing on the calendar {offset === 0 ? "this week" : "that week"}. Use Fill from usual times on the Calendar tab to add the regular lessons.
        </div>
      )}
      {byDay.map(g => (
        <div key={g.date} style={{ borderBottom: `1px solid ${T.line}` }}>
          <div style={{ padding: "8px 20px", fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: g.date === today ? T.accentText : T.muted, background: g.date === today ? T.accentTint : T.soft }}>{dayHeading(g.date, today)}</div>
          {g.items.map(s => {
            const cancelled = s.status === "cancelled";
            const past = sessionEndMs(s) < Date.now();
            const grp = groupOf(s);
            const zoom = s.zoomLink || grp?.zoomLink || null;
            const who = s.studentIds ? (s.studentNames?.length ? s.studentNames.join(", ") : `${s.studentIds.length} student${s.studentIds.length === 1 ? "" : "s"}`) : "Whole group";
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", flexWrap: "wrap", opacity: cancelled ? 0.6 : 1 }}>
                <div style={{ width: 110, fontSize: 13, fontWeight: 700, color: cancelled ? T.faint : T.ink, textDecoration: cancelled ? "line-through" : "none", fontVariantNumeric: "tabular-nums" }}>{fmtTime(s.time)} – {fmtTime(endTime(s))}</div>
                <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: cancelled ? T.soft : colourOf(s)[0], color: cancelled ? T.faint : colourOf(s)[1], whiteSpace: "nowrap" }}>{s.className || grp?.name || s.classId}</span>
                    {s.title && <span style={{ fontSize: 14, fontWeight: 600, color: cancelled ? T.faint : T.ink, textDecoration: cancelled ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>}
                  </span>
                  <span style={{ fontSize: 12, color: T.muted }}>{[who, tutorName && tutorName(s.tutorId), s.note].filter(Boolean).join(" · ")}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  {cancelled && <Chip tone="red">Cancelled</Chip>}
                  {!cancelled && s.lessonId && <Chip tone="green">Notes started</Chip>}
                  {!cancelled && zoom && <Button size="sm" onClick={() => window.open(zoom, "_blank", "noopener")}>Zoom</Button>}
                  {!cancelled && <Button size="sm" variant={past && !s.lessonId ? "accent" : "secondary"} icon="pencil" onClick={() => openNotes(s)} disabled={busyId === s.id}>
                    {busyId === s.id ? "Opening…" : s.lessonId ? "Open notes" : past ? "Attendance and notes" : "Take attendance"}
                  </Button>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </Card>
  );
}
