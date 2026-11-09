// Payments tab (admin): raise Stripe invoices to parents from the agreed
// payment schedule, and see what is due, overdue and paid.
import React, { useState, useEffect, useMemo } from "react";
import { fetchPayments, fetchAllStudents, invoicesApi } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, StatTile } from "../ui/components";
import { money } from "../data/terms";
import { PAYMENT_TONE, paymentStatusLabel } from "./StudentPanels";

const fmtDate = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
const isoPlusDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const selectStyle = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, minWidth: 220 };
const parseDue = (text) => { const t = String(text || "").trim(); if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t; const d = new Date(t); return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10); };

export default function TutorPayments() {
  const [payments, setPayments] = useState(null);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("open");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ uid: "", amount: "", description: "", dueDate: isoPlusDays(7), scheduleIndex: "" });

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchPayments({}), fetchAllStudents()])
      .then(([p, s]) => { if (!cancelled) { setPayments(p); setStudents(s); } })
      .catch(e => { if (!cancelled) { setError(e.message); setPayments([]); } });
    return () => { cancelled = true; };
  }, []);

  const student = students.find(s => s.uid === form.uid);
  const schedule = student?.agreement?.schedule || [];
  const invoicedIdx = useMemo(() => new Set((payments || []).filter(p => p.uid === form.uid && p.status !== "void" && p.scheduleIndex !== null && p.scheduleIndex !== undefined).map(p => p.scheduleIndex)), [payments, form.uid]);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const useLine = (i) => {
    const r = schedule[i];
    setForm(f => ({ ...f, amount: String(r.amount || ""), description: `Payment ${i + 1} of ${schedule.length}: A Level Chemistry tutoring programme, ${student.displayName || ""}`.trim(), dueDate: parseDue(r.due) || f.dueDate, scheduleIndex: String(i) }));
  };

  const create = async (e) => {
    e.preventDefault();
    setBusy("create"); setError(null); setNotice(null);
    try {
      const { payment } = await invoicesApi("create", { ...form, scheduleIndex: form.scheduleIndex === "" ? undefined : Number(form.scheduleIndex) });
      setPayments(p => [payment, ...(p || []).filter(x => x.id !== payment.id)]);
      setNotice(`Invoice ${payment.number || ""} for ${money(payment.amountDue)} sent to ${payment.customerEmail}.`);
      setForm(f => ({ ...f, amount: "", description: "", scheduleIndex: "" }));
    } catch (err) { setError(err.message); }
    setBusy(null);
  };
  const act = async (action, p, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(`${action}:${p.id}`); setError(null); setNotice(null);
    try {
      const { payment } = await invoicesApi(action, { invoiceId: p.id });
      setPayments(list => list.map(x => x.id === payment.id ? payment : x));
      setNotice(action === "resend" ? `Invoice resent to ${payment.customerEmail}.` : action === "markPaid" ? "Marked as paid." : "Invoice cancelled.");
    } catch (err) { setError(err.message); }
    setBusy(null);
  };

  const list = (payments || []).filter(p => filter === "all" ? true : filter === "open" ? p.status === "open" : p.status === filter);
  const open = (payments || []).filter(p => p.status === "open");
  const overdue = open.filter(p => p.dueAt && p.dueAt < Date.now());
  const sum = (arr, k) => arr.reduce((t, p) => t + (p[k] || 0), 0);
  const paidThisMonth = (payments || []).filter(p => p.status === "paid" && p.paidAt && new Date(p.paidAt).getMonth() === new Date().getMonth() && new Date(p.paidAt).getFullYear() === new Date().getFullYear());

  return (
    <>
      <PageHeader eyebrow="Payments" title="Invoices and payments" sub="Raise invoices to parents from the agreed schedule. Stripe emails the payment page and payments show here as they come in."
        right={<Button variant="primary" icon="plus" onClick={() => setShowNew(v => !v)}>Raise invoice</Button>} />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {notice && <Notice tone="green" style={{ marginBottom: 12 }}>{notice}</Notice>}

      <div className="cm-grid-4" style={{ marginBottom: 14 }}>
        <StatTile label="Outstanding" value={money(sum(open, "amountRemaining"))} sub={`${open.length} open invoice${open.length === 1 ? "" : "s"}`} />
        <StatTile label="Overdue" value={<span style={{ color: overdue.length ? T.red : T.ink }}>{money(sum(overdue, "amountRemaining"))}</span>} sub={`${overdue.length} invoice${overdue.length === 1 ? "" : "s"}`} />
        <StatTile label="Paid this month" value={money(sum(paidThisMonth, "amountPaid"))} sub={`${paidThisMonth.length} payment${paidThisMonth.length === 1 ? "" : "s"}`} />
        <StatTile label="Students" value={students.length} sub="placed, with agreements" />
      </div>

      {showNew && (
        <Card style={{ marginBottom: 14 }}>
          <form onSubmit={create} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <CardHeader title="Raise an invoice" sub="Sent to the parent's email with a Stripe payment link. Pick a line from the agreed schedule or enter the details." />
            <div style={field}><label style={label} htmlFor="inv-student">Student</label>
              <select id="inv-student" required value={form.uid} onChange={e => setForm(f => ({ ...f, uid: e.target.value, scheduleIndex: "" }))} style={selectStyle}>
                <option value="">Choose a student</option>
                {students.map(s => <option key={s.uid} value={s.uid}>{s.displayName || s.email}{s.className ? ` · ${s.className}` : ""}</option>)}
              </select>
              {student && <span style={{ fontSize: 12, color: T.muted }}>Invoice goes to {student.parentName ? `${student.parentName}, ` : ""}{student.parentEmail || student.email}{student.agreement?.totalFee ? ` · programme fee ${money(student.agreement.totalFee)}` : ""}</span>}
            </div>
            {student && schedule.length > 0 && (
              <div style={field}><span style={label}>Agreed schedule (clause 5.4)</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {schedule.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, minWidth: 70 }}>{money(r.amount)}</span><span style={{ color: T.muted, flex: 1 }}>{r.due}</span>
                      {invoicedIdx.has(i) ? <Chip tone="green">Invoiced</Chip> : <Button type="button" size="sm" variant={form.scheduleIndex === String(i) ? "primary" : "secondary"} onClick={() => useLine(i)}>Use this line</Button>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={field}><label style={label} htmlFor="inv-amount">Amount (£)</label><Input id="inv-amount" type="number" min="1" step="0.01" required value={form.amount} onChange={e => setF("amount", e.target.value)} style={{ width: 130 }} /></div>
              <div style={{ ...field, flex: 1, minWidth: 240 }}><label style={label} htmlFor="inv-desc">Description</label><Input id="inv-desc" required value={form.description} onChange={e => setF("description", e.target.value)} placeholder="e.g. Payment 1 of 3: A Level Chemistry tutoring programme" /></div>
              <div style={field}><label style={label} htmlFor="inv-due">Due date</label><Input id="inv-due" type="date" required value={form.dueDate} onChange={e => setF("dueDate", e.target.value)} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="submit" variant="accent" disabled={busy === "create" || !form.uid}>{busy === "create" ? "Sending…" : "Send invoice"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card padding={0}>
        <CardHeader title="Invoices" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
          right={<div style={{ display: "flex", gap: 4 }}>
            {[["open", "Open"], ["paid", "Paid"], ["all", "All"]].map(([k, l]) => <Button key={k} size="sm" variant={filter === k ? "primary" : "secondary"} onClick={() => setFilter(k)}>{l}</Button>)}
          </div>} />
        {payments === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {payments && list.length === 0 && <EmptyState icon="check" title={filter === "open" ? "Nothing outstanding" : "No invoices here"} body={filter === "open" ? "Every invoice is paid or cancelled. Raise the next one from the agreed schedule." : "Invoices you raise here, or in the Stripe dashboard, appear in this list."} />}
        {payments && list.length > 0 && (
          <Table minWidth={820}>
            <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Student</th><th style={th}>Description</th><th style={th}>Amount</th><th style={th}>Due</th><th style={th}>Status</th><th style={{ ...th, paddingRight: 20 }}>Actions</th></tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${T.line}` }}>
                  <td style={{ ...td, paddingLeft: 20 }}><div style={{ fontWeight: 600 }}>{p.studentName || <span style={{ color: T.muted }}>Unmatched</span>}</div><div style={{ fontSize: 11, color: T.muted }}>{p.customerEmail}</div></td>
                  <td style={{ ...td, color: T.body }}>{p.description || "–"}{p.number && <div style={{ fontSize: 11, color: T.muted }}>{p.number}</div>}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{money(p.amountDue)}{p.status === "open" && p.amountPaid > 0 && <div style={{ fontSize: 11, color: T.muted }}>{money(p.amountRemaining)} left</div>}</td>
                  <td style={td}>{p.status === "paid" ? <span style={{ color: T.muted }}>Paid {fmtDate(p.paidAt)}</span> : fmtDate(p.dueAt)}</td>
                  <td style={td}><Chip tone={p.status === "open" && p.dueAt && p.dueAt < Date.now() ? "red" : PAYMENT_TONE[p.status] || "neutral"}>{paymentStatusLabel(p)}</Chip>{p.paidOutOfBand && <div style={{ fontSize: 11, color: T.muted }}>bank transfer</div>}</td>
                  <td style={{ ...td, paddingRight: 20 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {p.hostedInvoiceUrl && <Button size="sm" variant="ghost" onClick={() => window.open(p.hostedInvoiceUrl, "_blank", "noopener")}>View</Button>}
                      {p.status === "open" && <>
                        <Button size="sm" onClick={() => act("resend", p)} disabled={!!busy}>Resend</Button>
                        <Button size="sm" onClick={() => act("markPaid", p, `Mark ${money(p.amountRemaining)} from ${p.customerEmail} as paid by bank transfer?`)} disabled={!!busy}>Mark paid</Button>
                        <Button size="sm" variant="ghost" style={{ color: T.red }} onClick={() => act("void", p, "Cancel this invoice? The parent can no longer pay it.")} disabled={!!busy}>Cancel</Button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
