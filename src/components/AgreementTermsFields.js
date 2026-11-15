// The agreement's variable terms as form fields: payment option, fee, payment
// schedule, programme dates, initial grade, group size and extra clauses.
// Used when editing a pending student and when proposing a change to a signed
// agreement, so the two forms cannot drift apart.
import React from "react";
import { T } from "../ui/theme";
import { Button, Input } from "../ui/components";
import { PAYMENT_PLANS, GRADES, programmeEndFor, DEFAULT_GROUP_SIZE } from "../data/terms";

const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const selectStyle = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink };
const today = () => new Date().toISOString().slice(0, 10);

/** Form state from an applicant record (paymentAmount) or a signed agreement (totalFee). */
export function termsFormFrom(src = {}, year = 12) {
  const fee = src.totalFee ?? src.paymentAmount;
  return {
    paymentPlan: src.paymentPlan || "instalments",
    paymentAmount: fee === null || fee === undefined ? "" : fee,
    schedule: (src.schedule || []).length ? src.schedule.map(r => ({ amount: r.amount, due: r.due })) : [{ amount: "", due: "" }],
    programmeStart: src.programmeStart || today(),
    programmeEnd: src.programmeEnd || programmeEndFor(year),
    initialGrade: src.initialGrade || "Not yet assessed",
    groupSize: src.groupSize || DEFAULT_GROUP_SIZE,
    extraTerms: src.extraTerms || "",
  };
}

/** The terms to send to the API, with empty schedule rows dropped. */
export const termsFieldsToSend = (form) => ({
  paymentPlan: form.paymentPlan, paymentAmount: form.paymentAmount,
  schedule: (form.schedule || []).filter(r => r.amount || r.due),
  programmeStart: form.programmeStart, programmeEnd: form.programmeEnd,
  initialGrade: form.initialGrade, groupSize: form.groupSize, extraTerms: form.extraTerms,
});

export default function AgreementTermsFields({ form, setForm, year = 12, idPrefix = "tm" }) {
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setRow = (i, k, v) => setForm(f => ({ ...f, schedule: f.schedule.map((r, j) => j === i ? { ...r, [k]: v } : r) }));
  const id = (s) => `${idPrefix}-${s}`;
  return (
    <>
      <div className="cm-grid-2" style={{ gap: 12 }}>
        <div style={field}><label style={label} htmlFor={id("start")}>Programme start date</label><Input id={id("start")} type="date" required value={form.programmeStart} onChange={e => setF("programmeStart", e.target.value)} /></div>
        <div style={field}><label style={label} htmlFor={id("end")}>Programme runs until</label><Input id={id("end")} value={form.programmeEnd} onChange={e => setF("programmeEnd", e.target.value)} placeholder={programmeEndFor(year)} /></div>
        <div style={field}><label style={label} htmlFor={id("grade")}>Initial assessed grade</label>
          <select id={id("grade")} value={form.initialGrade} onChange={e => setF("initialGrade", e.target.value)} style={selectStyle}>{GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
        <div style={field}><label style={label} htmlFor={id("size")}>Group size (up to)</label><Input id={id("size")} type="number" min="2" max="12" value={form.groupSize} onChange={e => setF("groupSize", e.target.value)} style={{ width: 90 }} /></div>
        <div style={field}><label style={label} htmlFor={id("plan")}>Payment option</label>
          <select id={id("plan")} value={form.paymentPlan} onChange={e => setF("paymentPlan", e.target.value)} style={selectStyle}>{PAYMENT_PLANS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
        <div style={field}><label style={label} htmlFor={id("fee")}>Total programme fee (£)</label><Input id={id("fee")} type="number" min="1" step="1" required value={form.paymentAmount} onChange={e => setF("paymentAmount", e.target.value)} /></div>
      </div>
      <div style={{ ...field, marginTop: 12 }}>
        <span style={label}>Payment schedule (goes into clause 5.4 of the agreement)</span>
        {form.schedule.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Input type="number" min="1" step="1" placeholder="£ amount" aria-label="Amount" value={r.amount} onChange={e => setRow(i, "amount", e.target.value)} style={{ width: 130 }} />
            <Input placeholder="Due, e.g. On signing, or 26 November 2026" aria-label="When due" value={r.due} onChange={e => setRow(i, "due", e.target.value)} style={{ flex: 1 }} />
            {form.schedule.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, schedule: f.schedule.filter((_, j) => j !== i) }))} aria-label="Remove line">×</Button>}
          </div>
        ))}
        <div><Button type="button" size="sm" onClick={() => setForm(f => ({ ...f, schedule: [...f.schedule, { amount: "", due: "" }] }))}>Add a payment line</Button></div>
      </div>
      <div style={{ ...field, marginTop: 12 }}><label style={label} htmlFor={id("extra")}>Additional or replacement terms (optional). One clause per line.</label>
        <textarea id={id("extra")} rows={3} value={form.extraTerms} onChange={e => setF("extraTerms", e.target.value)} style={{ ...selectStyle, fontFamily: T.font, resize: "vertical" }} /></div>
    </>
  );
}
