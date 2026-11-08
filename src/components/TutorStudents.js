// Admin onboarding queue: add a student after the discovery call, follow
// their self-evaluation and parent terms, then place them into a group.
import React, { useState, useEffect, useMemo } from "react";
import { fetchApplicants, fetchAllClasses, studentsApi } from "../firebase";
import { T, BOARDS, boardLabel } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Icon } from "../ui/components";
import { SELF_EVALUATION, ragCounts } from "../data/self-evaluation";
import { PAYMENT_PLANS, paymentPlanLabel } from "../data/terms";

const STATUS = {
  invited: { tone: "amber", label: "Self-evaluation sent" },
  evaluated: { tone: "accent", label: "Evaluated · terms sent" },
  agreed: { tone: "green", label: "Ready to place" },
  placed: { tone: "neutral", label: "Placed" },
};
const fmtDate = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";
const fmtDateTime = (ms) => ms ? new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const selectStyle = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink };
const EMPTY_FORM = { studentName: "", studentEmail: "", parentName: "", parentEmail: "", parentPhone: "", board: "aqa", year: 12, paymentPlan: "pif", paymentAmount: "", notes: "" };

export default function TutorStudents({ authUser, userProfile }) {
  const isAdmin = userProfile?.role === "admin";
  const [applicants, setApplicants] = useState(null);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    Promise.all([fetchApplicants(), fetchAllClasses()])
      .then(([a, g]) => { if (!cancelled) { setApplicants(a); setGroups(g); if (a.length === 0) setShowNew(true); } })
      .catch(e => { if (!cancelled) { setError(e.message); setApplicants([]); } });
    return () => { cancelled = true; };
  }, [isAdmin]);

  const patchApplicant = (id, patch) => setApplicants(prev => (prev || []).map(a => a.id === id ? { ...a, ...patch } : a));
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const create = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null); setNotice(null);
    try {
      const { applicant, emailError } = await studentsApi("create", form);
      setApplicants(prev => [applicant, ...(prev || [])]);
      setForm(EMPTY_FORM); setShowNew(false); setOpenId(applicant.id); setFilter("open");
      setNotice(emailError ? { tone: "amber", text: `${applicant.studentName} added, but the self-evaluation email failed: ${emailError}. Use Resend.` }
        : { tone: "green", text: `${applicant.studentName} added. Self-evaluation link emailed to ${applicant.studentEmail}.` });
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const rows = useMemo(() => (applicants || []).filter(a => filter === "placed" ? a.status === "placed" : a.status !== "placed"), [applicants, filter]);
  const openCount = (applicants || []).filter(a => a.status !== "placed").length;

  if (!isAdmin) return <Card padding={0}><EmptyState icon="lock" title="HSJ admin only" body="Adding and placing students is done by HSJ Tuition. Your groups and their students are on the Overview tab." /></Card>;

  return (
    <>
      <PageHeader eyebrow="Students" title="Onboarding"
        sub="Add a student after the discovery call. They get the self-evaluation, the parent gets the terms, and you place them into a group here."
        right={<Button variant="primary" icon="plus" onClick={() => setShowNew(v => !v)}>Add student</Button>} />

      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {notice && <Notice tone={notice.tone} style={{ marginBottom: 12 }}>{notice.text}</Notice>}

      {showNew && (
        <Card style={{ marginBottom: 14 }}>
          <form onSubmit={create}>
            <CardHeader title="New student" sub="Details from the call. The student is emailed the self-evaluation link straight away." />
            <div className="cm-grid-2" style={{ gap: 12, marginTop: 12 }}>
              <div style={field}><label style={label} htmlFor="ns-name">Student name</label><Input id="ns-name" required value={form.studentName} onChange={e => setF("studentName", e.target.value)} /></div>
              <div style={field}><label style={label} htmlFor="ns-email">Student email (their login)</label><Input id="ns-email" type="email" required value={form.studentEmail} onChange={e => setF("studentEmail", e.target.value)} /></div>
              <div style={field}><label style={label} htmlFor="ns-pname">Parent name</label><Input id="ns-pname" required value={form.parentName} onChange={e => setF("parentName", e.target.value)} /></div>
              <div style={field}><label style={label} htmlFor="ns-pemail">Parent email</label><Input id="ns-pemail" type="email" required value={form.parentEmail} onChange={e => setF("parentEmail", e.target.value)} /></div>
              <div style={field}><label style={label} htmlFor="ns-phone">Parent phone</label><Input id="ns-phone" value={form.parentPhone} onChange={e => setF("parentPhone", e.target.value)} /></div>
              <div style={field}><span style={label}>Exam board</span>
                <div style={{ display: "flex", gap: 6 }}>{BOARDS.map(b => <Button key={b.id} type="button" variant={form.board === b.id ? "primary" : "secondary"} onClick={() => setF("board", b.id)}>{b.label}</Button>)}</div></div>
              <div style={field}><span style={label}>Year group</span>
                <div style={{ display: "flex", gap: 6 }}>{[12, 13].map(y => <Button key={y} type="button" variant={form.year === y ? "primary" : "secondary"} onClick={() => setF("year", y)}>Year {y}</Button>)}</div></div>
              <div style={field}><label style={label} htmlFor="ns-plan">Payment plan</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <select id="ns-plan" value={form.paymentPlan} onChange={e => setF("paymentPlan", e.target.value)} style={{ ...selectStyle, flex: 1 }}>{PAYMENT_PLANS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
                  <Input type="number" min="0" step="1" placeholder="£" aria-label="Amount in pounds" value={form.paymentAmount} onChange={e => setF("paymentAmount", e.target.value)} style={{ width: 110 }} />
                </div></div>
            </div>
            <div style={{ ...field, marginTop: 12 }}><label style={label} htmlFor="ns-notes">Notes from the call (optional)</label>
              <textarea id="ns-notes" rows={2} value={form.notes} onChange={e => setF("notes", e.target.value)} style={{ ...selectStyle, fontFamily: T.font, resize: "vertical" }} /></div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Button type="submit" variant="accent" disabled={saving}>{saving ? "Adding…" : "Add and send self-evaluation"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card padding={0}>
        <CardHeader title={filter === "placed" ? "Placed students" : "To place"} style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
          right={<div style={{ display: "flex", gap: 6 }}>
            <Button size="sm" variant={filter === "open" ? "primary" : "secondary"} onClick={() => setFilter("open")}>Onboarding{openCount ? ` (${openCount})` : ""}</Button>
            <Button size="sm" variant={filter === "placed" ? "primary" : "secondary"} onClick={() => setFilter("placed")}>Placed</Button>
          </div>} />
        {applicants === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {applicants && rows.length === 0 && <EmptyState icon="users" title={filter === "placed" ? "Nobody placed yet" : "Nobody onboarding"} body={filter === "placed" ? "Students appear here once they are placed into a group." : "Click Add student after a discovery call."} />}
        {rows.length > 0 && (
          <Table minWidth={820}>
            <thead><tr>
              <th style={{ ...th, paddingLeft: 20 }}>Student</th><th style={th}>Parent</th><th style={th}>Course</th><th style={th}>Plan</th><th style={th}>Status</th><th style={{ ...th, paddingRight: 20 }}>Added</th>
            </tr></thead>
            <tbody>
              {rows.map(a => {
                const isOpen = openId === a.id;
                const st = STATUS[a.status] || STATUS.invited;
                return (
                  <React.Fragment key={a.id}>
                    <tr className="cm-row-hover" onClick={() => setOpenId(isOpen ? null : a.id)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                      <td style={{ ...td, paddingLeft: 20 }}><div style={{ fontWeight: 600 }}>{a.studentName}</div><div style={{ fontSize: 11, color: T.muted }}>{a.studentEmail}</div></td>
                      <td style={td}><div>{a.parentName}</div><div style={{ fontSize: 11, color: T.muted }}>{a.parentEmail}{a.parentPhone ? ` · ${a.parentPhone}` : ""}</div></td>
                      <td style={td}>{boardLabel(a.board)} · Year {a.year}</td>
                      <td style={td}>{paymentPlanLabel(a.paymentPlan)}{a.paymentAmount ? <span style={{ color: T.muted }}> · £{a.paymentAmount}</span> : null}</td>
                      <td style={td}><Chip tone={st.tone}>{st.label}</Chip></td>
                      <td style={{ ...td, paddingRight: 20, color: T.muted }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>{fmtDate(a.createdAt)}<Icon name="chevronDown" size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: T.faint }} /></div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr style={{ background: "#FAFBFC" }}><td colSpan={6} style={{ padding: "16px 20px 20px" }}>
                        <ApplicantDetail a={a} groups={groups} onChange={patch => patchApplicant(a.id, patch)} onRemove={() => { setApplicants(prev => prev.filter(x => x.id !== a.id)); setOpenId(null); }} setNotice={setNotice} />
                      </td></tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

const ragChip = { red: "red", amber: "amber", green: "green" };

function ApplicantDetail({ a, groups, onChange, onRemove, setNotice }) {
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState(null);
  const matching = groups.filter(g => g.board === a.board);
  const [groupCode, setGroupCode] = useState(() => (matching[0] || groups[0] || {}).code || "");
  const tree = SELF_EVALUATION[a.board];
  const ev = a.evaluation;
  const counts = ragCounts(ev?.ratings);

  const run = async (name, fn) => {
    setBusy(name); setErr(null);
    try { await fn(); } catch (e) { setErr(e.message); }
    setBusy(null);
  };
  const resend = (which) => run(which, async () => {
    await studentsApi("resend", { id: a.id, which });
    onChange(which === "evaluation" ? { evalSentAt: Date.now() } : { termsSentAt: Date.now() });
    setNotice({ tone: "green", text: `${which === "evaluation" ? "Self-evaluation" : "Terms"} email sent again to ${which === "evaluation" ? a.studentEmail : a.parentEmail}.` });
  });
  const place = () => {
    const g = groups.find(x => x.code === groupCode);
    if (!g) return;
    const warn = [!ev && "the self-evaluation is not done", !a.terms && "the parent has not accepted the terms"].filter(Boolean);
    if (!window.confirm(`Place ${a.studentName} into ${g.name}?${warn.length ? `\n\nNote: ${warn.join(" and ")}.` : ""}\n\nThis creates their account and emails the login to ${a.studentEmail} (parent copied).`)) return;
    run("place", async () => {
      const r = await studentsApi("place", { id: a.id, groupCode });
      onChange({ status: "placed", groupCode, studentUid: r.uid, placedAt: Date.now() });
      setNotice(r.emailError ? { tone: "amber", text: `${a.studentName} placed, but the welcome email failed: ${r.emailError}` }
        : { tone: "green", text: `${a.studentName} placed into ${g.name}. ${r.existingAccount ? "They already had an account, so no new password was sent." : "Welcome email with login sent."}` });
    });
  };
  const remove = () => {
    if (!window.confirm(`Remove ${a.studentName} from onboarding? Their links stop working.`)) return;
    run("delete", async () => { await studentsApi("delete", { id: a.id }); onRemove(); });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {err && <Notice tone="red">{err}</Notice>}
      <div className="cm-grid-3" style={{ gap: 16 }}>
        <div>
          <div style={{ ...label, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11, marginBottom: 6 }}>Self-evaluation</div>
          {ev ? (
            <>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                <Chip tone="red">{counts.red} Red</Chip><Chip tone="amber">{counts.amber} Amber</Chip><Chip tone="green">{counts.green} Green</Chip>
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>Completed {fmtDateTime(ev.submittedAt)}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>Not completed yet. Link sent {fmtDateTime(a.evalSentAt) || "never"}.</div>
              <Button size="sm" onClick={() => resend("evaluation")} disabled={!!busy}>{busy === "evaluation" ? "Sending…" : "Resend to student"}</Button>
            </>
          )}
        </div>
        <div>
          <div style={{ ...label, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11, marginBottom: 6 }}>Parent terms</div>
          {a.terms ? (
            <div style={{ fontSize: 13 }}>Accepted by <strong>{a.terms.acceptedName}</strong><div style={{ fontSize: 12, color: T.muted }}>{fmtDateTime(a.terms.acceptedAt)} · version {a.terms.version}</div></div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>Not accepted yet. {a.termsSentAt ? `Sent ${fmtDateTime(a.termsSentAt)}.` : "Sent automatically once the self-evaluation is in."}</div>
              <Button size="sm" onClick={() => resend("terms")} disabled={!!busy}>{busy === "terms" ? "Sending…" : a.termsSentAt ? "Resend to parent" : "Send to parent now"}</Button>
            </>
          )}
        </div>
        <div>
          <div style={{ ...label, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11, marginBottom: 6 }}>Group</div>
          {a.status === "placed" ? (
            <div style={{ fontSize: 13 }}>Placed into <strong>{groups.find(g => g.code === a.groupCode)?.name || a.groupCode}</strong><div style={{ fontSize: 12, color: T.muted }}>{fmtDateTime(a.placedAt)} · account created, welcome email sent</div></div>
          ) : groups.length === 0 ? (
            <div style={{ fontSize: 13, color: T.muted }}>No groups yet. Create one on the Overview tab.</div>
          ) : (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <select value={groupCode} onChange={e => setGroupCode(e.target.value)} style={{ ...selectStyle, flex: "1 1 160px" }} aria-label="Group">
                {groups.map(g => <option key={g.code} value={g.code}>{g.name} ({boardLabel(g.board)}{g.lessonSlot ? `, ${g.lessonSlot}` : ""})</option>)}
              </select>
              <Button variant="accent" onClick={place} disabled={!!busy || !groupCode}>{busy === "place" ? "Placing…" : "Place"}</Button>
            </div>
          )}
        </div>
      </div>

      {ev && tree && (
        <div>
          <div style={{ ...label, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11, marginBottom: 8 }}>Topic ratings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tree.modules.filter(m => (ev.taught || []).includes(m.id)).map(m => (
              <div key={m.id}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{m.title}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {m.subtopics.map(s => {
                    const r = ev.ratings?.[s.ref];
                    const notTaught = r && r.covered === "no";
                    const tone = notTaught ? "neutral" : ragChip[r?.rag] || "neutral";
                    return <Chip key={s.ref} tone={tone} style={{ whiteSpace: "normal" }} title={r?.note || ""}>{s.title}{notTaught ? " · not taught" : r?.covered === "partly" ? " · partly" : ""}{r?.note ? " *" : ""}</Chip>;
                  })}
                </div>
                {m.subtopics.filter(s => ev.ratings?.[s.ref]?.note).map(s => (
                  <div key={s.ref} style={{ fontSize: 12, color: T.body, marginTop: 4 }}><strong>{s.title}:</strong> {ev.ratings[s.ref].note}</div>
                ))}
              </div>
            ))}
            {(ev.taught || []).length === 0 && <div style={{ fontSize: 12, color: T.muted }}>No modules ticked.</div>}
          </div>
          {ev.notes && <div style={{ marginTop: 10, fontSize: 13, padding: 12, borderRadius: 10, background: T.card, border: `1px solid ${T.line}` }}><strong>From the student:</strong> {ev.notes}</div>}
        </div>
      )}

      {a.notes && <div style={{ fontSize: 13, color: T.body }}><strong>Call notes:</strong> {a.notes}</div>}

      {a.status !== "placed" && (
        <div><Button size="sm" variant="ghost" onClick={remove} disabled={!!busy} style={{ color: T.red }}>{busy === "delete" ? "Removing…" : "Remove from onboarding"}</Button></div>
      )}
    </div>
  );
}
