// Side cards on the student dashboard: the next lesson from the group's
// weekly schedule, and the family's invoices (paid through Stripe).
import React, { useState, useEffect } from "react";
import { fetchClass, fetchPayments } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, Chip, Button } from "../ui/components";
import { describeSlots, slotsOf, nextOccurrences, fmtLessonDay, fmtTime } from "../utils/schedule";

export function NextLessonCard({ userProfile }) {
  const [cls, setCls] = useState(undefined);
  const code = userProfile?.classId;
  useEffect(() => {
    if (!code) { setCls(null); return; }
    let cancelled = false;
    fetchClass(code).then(c => { if (!cancelled) setCls(c); }).catch(() => { if (!cancelled) setCls(null); });
    return () => { cancelled = true; };
  }, [code]);
  const slots = slotsOf(cls);
  const next = nextOccurrences(slots, 3);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CardHeader title="Next lesson" sub={slots.length ? describeSlots(slots) : cls?.lessonSlot || "Weekly, on Zoom"} />
      {cls === undefined && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
      {cls !== undefined && !slots.length && <span style={{ fontSize: 13, color: T.muted }}>Your tutor will confirm the weekly lesson time.</span>}
      {next.map((o, i) => (
        <div key={`${o.iso}_${o.time}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: i ? `1px solid ${T.line}` : "none", paddingTop: i ? 8 : 0 }}>
          <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? T.ink : T.body }}>{fmtLessonDay(o.iso)}</span>
          <span style={{ fontSize: 12, color: T.muted }}>{fmtTime(o.time)}{i === 0 && <Chip tone="accent" style={{ marginLeft: 8 }}>Next</Chip>}</span>
        </div>
      ))}
      {cls?.zoomLink && <div><Button size="sm" variant="primary" onClick={() => window.open(cls.zoomLink, "_blank", "noopener")}>Join on Zoom</Button></div>}
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
