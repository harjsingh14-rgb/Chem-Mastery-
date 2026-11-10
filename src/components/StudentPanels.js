// Side cards on the student dashboard: the next lessons from the calendar
// (the group's sessions plus any the student is named on), and the family's
// invoices (paid through Stripe).
import React, { useState, useEffect } from "react";
import { fetchClass, fetchPayments, fetchStudentSessions } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, Chip, Button } from "../ui/components";
import { describeSlots, slotsOf, nextOccurrences, fmtLessonDay, fmtTime, upcomingSessions, DEFAULT_MINUTES } from "../utils/schedule";

/** The student's group and calendar sessions. sessions is null while loading. */
export function useStudentCalendar(uid, classId) {
  const [cls, setCls] = useState(undefined);
  const [sessions, setSessions] = useState(null);
  useEffect(() => {
    let cancelled = false;
    if (!classId) setCls(null); else fetchClass(classId).then(c => { if (!cancelled) setCls(c); }).catch(() => { if (!cancelled) setCls(null); });
    if (!uid && !classId) { setSessions([]); return () => { cancelled = true; }; }
    fetchStudentSessions(uid, classId).then(list => { if (!cancelled) setSessions(list); }).catch(() => { if (!cancelled) setSessions([]); });
    return () => { cancelled = true; };
  }, [uid, classId]);
  return { cls, sessions };
}

/**
 * Next lessons as rows { key, date, time, minutes, title, cancelled, zoomLink }.
 * Comes from the calendar; a group with nothing on the calendar yet falls
 * back to its usual weekly times.
 */
export function nextLessonRows(cls, sessions, n = 3) {
  if (sessions && sessions.length > 0) {
    return upcomingSessions(sessions, n).map(s => ({ key: s.id, date: s.date, time: s.time, minutes: s.minutes || DEFAULT_MINUTES, title: s.title || null, named: !!s.studentIds, note: s.note || null, cancelled: s.status === "cancelled", zoomLink: s.zoomLink || cls?.zoomLink || null }));
  }
  return nextOccurrences(slotsOf(cls), n).map(o => ({ key: `${o.iso}_${o.time}`, date: o.iso, time: o.time, minutes: o.minutes, title: null, named: false, note: null, cancelled: false, zoomLink: cls?.zoomLink || null }));
}

export function NextLessonCard({ authUser, userProfile }) {
  const { cls, sessions } = useStudentCalendar(authUser?.uid, userProfile?.classId);
  const slots = slotsOf(cls);
  const loading = cls === undefined || sessions === null;
  const rows = loading ? [] : nextLessonRows(cls, sessions, 3);
  const live = rows.find(r => !r.cancelled);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CardHeader title="Next lesson" sub={slots.length ? `Usually ${describeSlots(slots)}` : cls?.lessonSlot || "On Zoom"} />
      {loading && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
      {!loading && rows.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing is on the calendar yet. Your tutor will add the next lessons.</span>}
      {rows.map((o, i) => (
        <div key={o.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, borderTop: i ? `1px solid ${T.line}` : "none", paddingTop: i ? 8 : 0 }}>
          <span style={{ fontSize: 13, fontWeight: o === live ? 700 : 500, color: o.cancelled ? T.faint : o === live ? T.ink : T.body, textDecoration: o.cancelled ? "line-through" : "none" }}>
            {fmtLessonDay(o.date)}{o.title ? <span style={{ fontWeight: 500, color: T.muted }}> · {o.title}</span> : o.named ? <span style={{ fontWeight: 500, color: T.muted }}> · just you</span> : null}
          </span>
          <span style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>{fmtTime(o.time)}{o.cancelled ? <Chip tone="red" style={{ marginLeft: 8 }}>Cancelled</Chip> : o === live ? <Chip tone="accent" style={{ marginLeft: 8 }}>Next</Chip> : null}</span>
        </div>
      ))}
      {live?.note && <span style={{ fontSize: 12, color: T.muted }}>{live.note}</span>}
      {live?.zoomLink && <div><Button size="sm" variant="primary" onClick={() => window.open(live.zoomLink, "_blank", "noopener")}>Join on Zoom</Button></div>}
    </Card>
  );
}

const money = (n) => `£${Number(n || 0).toLocaleString("en-GB", { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2 })}`;
const fmtDue = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
export const PAYMENT_TONE = { open: "amber", paid: "green", void: "neutral", uncollectible: "red", draft: "neutral" };
export const paymentStatusLabel = (p) => p.status === "open" ? (p.dueAt && p.dueAt < Date.now() ? "Overdue" : "Due") : p.status === "paid" ? "Paid" : p.status === "void" ? "Cancelled" : p.status || "";

export function PaymentsCard({ authUser }) {
  const [payments, setPayments] = useState(null);
  const uid = authUser?.uid;
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    fetchPayments({ uid }).then(p => { if (!cancelled) setPayments(p); }).catch(() => { if (!cancelled) setPayments([]); });
    return () => { cancelled = true; };
  }, [uid]);
  if (payments && payments.length === 0) return null;
  const open = (payments || []).filter(p => p.status === "open");
  const paid = (payments || []).filter(p => p.status === "paid");
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CardHeader title="Payments" sub={payments ? (open.length ? `${open.length} invoice${open.length === 1 ? "" : "s"} to pay` : `All paid · ${paid.length} invoice${paid.length === 1 ? "" : "s"}`) : "Loading…"} />
      {open.map(p => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{money(p.amountRemaining || p.amountDue)} <span style={{ color: T.muted, fontWeight: 400 }}>· {p.description || "Tutoring programme"}</span></div>
            <div style={{ fontSize: 12, color: T.muted }}>Due {fmtDue(p.dueAt)} <Chip tone={p.dueAt && p.dueAt < Date.now() ? "red" : "amber"} style={{ marginLeft: 6 }}>{paymentStatusLabel(p)}</Chip></div>
          </div>
          {p.hostedInvoiceUrl && <Button size="sm" variant="accent" onClick={() => window.open(p.hostedInvoiceUrl, "_blank", "noopener")}>Pay</Button>}
        </div>
      ))}
      {open.length > 0 && paid.length > 0 && <div style={{ fontSize: 12, color: T.muted, borderTop: `1px solid ${T.line}`, paddingTop: 8 }}>{paid.length} paid · receipts were emailed to your parent</div>}
      <div style={{ fontSize: 11, color: T.faint }}>Invoices are sent to your parent's email and paid securely through Stripe.</div>
    </Card>
  );
}
