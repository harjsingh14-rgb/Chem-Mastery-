// Changing a signed Tutoring Programme Agreement. The admin proposes new terms
// from the student's profile; the parent sees the old terms against the new
// ones on their Agreement tab and accepts by typing their name, as they did
// the first time. The signed terms stand until then, and every previous
// version is kept on the profile (agreementHistory).
import React, { useState } from "react";
import { studentsApi } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, Button, Input, Notice } from "../ui/components";
import { TERMS_VERSION } from "../data/terms";
import AgreementDocument, { agreementVarsFromProfile } from "./AgreementDocument";
import AgreementTermsFields, { termsFormFrom, termsFieldsToSend } from "./AgreementTermsFields";

const fmtDate = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
const fmtDateTime = (ms) => ms ? new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const textarea = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, fontFamily: T.font, resize: "vertical" };
const cell = { padding: "8px 12px 8px 0", verticalAlign: "top", borderTop: `1px solid ${T.line}` };

/** Old terms against new, as the API recorded them on the proposal. */
export function ChangesTable({ changes }) {
  if (!changes?.length) return null;
  return (
    <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
      <thead><tr>{["Term", "Now", "Proposed"].map(h => <th key={h} style={{ ...label, textAlign: "left", padding: "0 12px 6px 0" }}>{h}</th>)}</tr></thead>
      <tbody>
        {changes.map(c => (
          <tr key={c.key}>
            <td style={{ ...cell, color: T.body, fontWeight: 600, whiteSpace: "nowrap" }}>{c.label}</td>
            <td style={{ ...cell, color: T.muted, textDecoration: "line-through", whiteSpace: "pre-wrap" }}>{c.from || "Not set"}</td>
            <td style={{ ...cell, color: T.ink, fontWeight: 600, whiteSpace: "pre-wrap" }}>{c.to || "Not set"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Admin, on a placed student's profile: propose a change, or follow the one waiting. */
export function ProposeVariationCard({ student, onChange }) {
  const p = student.agreementProposal || null;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => termsFormFrom(student.agreement || {}, student.year));
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const parent = student.parentName || "the parent";
  const run = async (name, fn) => {
    setBusy(name); setMsg(null);
    try { await fn(); } catch (e) { setMsg({ tone: "red", text: e.message }); }
    setBusy(null);
  };
  const start = () => { setForm(termsFormFrom(student.agreement || {}, student.year)); setReason(""); setOpen(true); setMsg(null); };
  const propose = (e) => {
    e.preventDefault();
    run("propose", async () => {
      const r = await studentsApi("proposeVariation", { uid: student.uid, fields: termsFieldsToSend(form), reason });
      onChange({ agreementProposal: r.proposal });
      setOpen(false);
      setMsg(r.emailError ? { tone: "amber", text: `Saved. The email to ${parent} failed: ${r.emailError}. They still see the change when they log in.` }
        : { tone: "green", text: `Sent. ${parent} has been emailed and sees the change when they log in. The signed terms stand until they accept.` });
    });
  };
  const withdraw = () => {
    if (!window.confirm("Withdraw this proposed change? The signed agreement stays as it is.")) return;
    run("withdraw", async () => { await studentsApi("withdrawVariation", { uid: student.uid }); onChange({ agreementProposal: null }); setMsg({ tone: "green", text: "Withdrawn. The agreement is unchanged." }); });
  };
  const resend = () => run("resend", async () => {
    await studentsApi("resendVariation", { uid: student.uid });
    onChange({ agreementProposal: { ...p, emailedAt: Date.now(), emailError: null } });
    setMsg({ tone: "green", text: `Email sent to ${student.parentEmail}.` });
  });

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CardHeader title={p ? "Proposed change, waiting for the parent" : "Change the agreement"}
        sub={p ? `Proposed ${fmtDateTime(p.proposedAt)}${p.proposedByName ? ` by ${p.proposedByName}` : ""}${p.emailedAt ? `, emailed ${fmtDateTime(p.emailedAt)}` : ", not emailed"}` : "Fee, payment option, payment dates, programme dates or extra terms. The parent accepts the revised agreement online and the previous version is kept."}
        right={!p && !open ? <Button size="sm" icon="pencil" onClick={start}>Change the agreement</Button> : null} />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {!student.parentUid && (open || p) && <Notice tone="amber">This student has no parent login yet, so nobody can accept the change. Create the parent login from the Onboarding tab first.</Notice>}
      {p && (
        <>
          <ChangesTable changes={p.changes} />
          {p.reason && <div style={{ fontSize: 13, color: T.body, whiteSpace: "pre-wrap", background: T.soft, borderRadius: 8, padding: "8px 12px" }}><strong>Reason given to the parent.</strong> {p.reason}</div>}
          <div style={{ fontSize: 12, color: T.muted }}>The signed terms stand until {parent} accepts. Payments keeps following the current schedule.</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button size="sm" onClick={resend} disabled={!!busy || !student.parentEmail}>{busy === "resend" ? "Sending…" : "Resend the email"}</Button>
            <Button size="sm" variant="ghost" style={{ color: T.red }} onClick={withdraw} disabled={!!busy}>{busy === "withdraw" ? "Withdrawing…" : "Withdraw"}</Button>
          </div>
        </>
      )}
      {!p && open && (
        <form onSubmit={propose} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, color: T.muted }}>Change what needs changing and leave the rest. {parent} gets an email, sees the current terms against the new ones and accepts by typing their name, as they did the first time. Nothing changes until they do.</div>
          <AgreementTermsFields form={form} setForm={setForm} year={student.year} idPrefix="var" />
          <div style={field}><label style={label} htmlFor="var-reason">Why the change (shown to the parent)</label>
            <textarea id="var-reason" rows={2} value={reason} onChange={e => setReason(e.target.value)} style={textarea} placeholder="e.g. Moving the second payment to January, as agreed by phone on 14 November" /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="submit" variant="accent" disabled={busy === "propose"}>{busy === "propose" ? "Sending…" : "Send to the parent"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={busy === "propose"}>Cancel</Button>
          </div>
        </form>
      )}
    </Card>
  );
}

/** Parent: the proposed change against the current terms, the revised agreement in full, and the accept form. */
export function VariationReview({ child, previewUid, onAccepted }) {
  const p = child.agreementProposal || null;
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [showDoc, setShowDoc] = useState(false);
  if (!p) return null;
  const first = (child.displayName || "your child").split(" ")[0];
  const vars = {
    ...agreementVarsFromProfile(child),
    agreementDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    totalFee: p.totalFee, paymentPlan: p.paymentPlan, schedule: p.schedule || [],
    startDate: p.programmeStart || null, programmeEnd: p.programmeEnd || null, groupSize: p.groupSize || 6,
    initialGrade: p.initialGrade || null, extraTerms: p.extraTerms || "",
  };
  const accept = async (e) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      const r = await studentsApi("acceptVariation", { uid: child.uid, name: name.trim(), version: TERMS_VERSION });
      onAccepted(r);
    } catch (ex) { setErr(ex.message); }
    setSaving(false);
  };
  return (
    <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12, borderColor: T.accent }} className="cm-no-print">
      <CardHeader title={`HSJ Tuition has proposed a change to ${first}'s agreement`}
        sub={`Proposed on ${fmtDate(p.proposedAt)}. The agreement you accepted stays in force until you accept this change. If you would rather not, reply to the email or contact HSJ Tuition.`} />
      {p.reason && <div style={{ fontSize: 14, color: T.body, whiteSpace: "pre-wrap", background: T.soft, borderRadius: 8, padding: "10px 14px" }}>{p.reason}</div>}
      <ChangesTable changes={p.changes} />
      <div><Button size="sm" variant="ghost" onClick={() => setShowDoc(v => !v)}>{showDoc ? "Hide the revised agreement" : "Read the revised agreement in full"}</Button></div>
      {showDoc && <AgreementDocument vars={vars} accepted={null} collapsible />}
      {previewUid ? (
        <Notice tone="neutral">{child.parentName || "The parent"} accepts from here when they log in.</Notice>
      ) : (
        <form onSubmit={accept} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
          <div style={{ fontWeight: 700 }}>Accept the revised agreement</div>
          <div style={{ fontSize: 13, color: T.muted }}>Typing your name and clicking Accept has the same effect as signing. Your name, the date and time are recorded, and the version you accepted before is kept with the agreement.</div>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required autoComplete="name" style={{ maxWidth: 320 }} />
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: T.body, cursor: "pointer" }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
            <span>I am the parent or guardian of {child.displayName || first}. I have read the changes above and I accept the revised agreement.</span>
          </label>
          {err && <Notice tone="red">{err}</Notice>}
          <div><Button type="submit" variant="accent" disabled={saving || !agree || name.trim().length < 2}>{saving ? "Saving…" : "Accept the revised agreement"}</Button></div>
        </form>
      )}
    </Card>
  );
}

/** Earlier versions of the agreement, each openable in full. */
export function AgreementHistory({ child }) {
  const hist = Array.isArray(child.agreementHistory) ? child.agreementHistory : [];
  const [open, setOpen] = useState(null);
  if (!hist.length) return null;
  return (
    <Card style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }} className="cm-no-print">
      <CardHeader title="Previous versions" sub={`${hist.length} earlier version${hist.length === 1 ? "" : "s"} of this agreement, kept for the record.`} />
      {hist.map((h, i) => (
        <div key={i} style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", fontSize: 13 }}>
            <span style={{ flex: 1, color: T.body }}>
              <strong>Version {h.revision || i + 1}.</strong> {h.agreedBeforePlatform ? "Agreed before the platform" : h.acceptedAt ? `Accepted by ${h.acceptedName || "the parent"} on ${fmtDate(h.acceptedAt)}` : "Not accepted"}, replaced on {fmtDate(h.supersededAt)}.
            </span>
            <Button size="sm" variant="ghost" onClick={() => setOpen(open === i ? null : i)}>{open === i ? "Hide" : "View"}</Button>
          </div>
          {open === i && <div style={{ marginTop: 10 }}><AgreementDocument vars={agreementVarsFromProfile({ ...child, agreement: h })} accepted={h.acceptedAt ? { acceptedAt: h.acceptedAt, acceptedName: h.acceptedName, version: h.version } : null} collapsible /></div>}
        </div>
      ))}
    </Card>
  );
}
