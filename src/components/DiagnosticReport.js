// The feedback report on a student's initial diagnostic. The numbers come from
// the submission (api/_diagnostic.js), the words from Claude, and the tutor
// edits them here before sending. Students and parents see the sent report at
// the top of the homework page (ReportView) and can print it.
import React, { useState } from "react";
import { ppqMarkApi } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Notice, Bar } from "../ui/components";
import chemFormat from "../utils/chemFormat";
import { yearLabel } from "../data/years";

const fmt = (ms) => ms ? new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const area = { width: "100%", minHeight: 72, padding: "9px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: "inherit", lineHeight: 1.5, color: T.ink, background: T.card, resize: "vertical", boxSizing: "border-box" };
const H = ({ children }) => <h3 style={{ margin: "18px 0 8px", fontFamily: T.display, fontSize: 16, fontWeight: 800 }}>{children}</h3>;
const Tile = ({ label, value, sub, colour }) => (
  <div style={{ background: T.soft, borderRadius: 12, padding: "12px 14px", flex: "1 1 140px" }}>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: T.muted }}>{label}</div>
    <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, color: colour || T.ink, lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: T.muted }}>{sub}</div>}
  </div>
);

/** One list section: read-only bullets, or one line per item while editing. */
function ListField({ items, editable, onChange, ordered }) {
  if (editable) return <textarea style={area} value={(items || []).join("\n")} onChange={e => onChange(e.target.value.split("\n"))} placeholder="One point per line" />;
  const Tag = ordered ? "ol" : "ul";
  return <Tag style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, fontSize: 14, lineHeight: 1.55 }}>{(items || []).filter(Boolean).map((x, i) => <li key={i}>{chemFormat(x)}</li>)}</Tag>;
}

/** The report itself. With editable, every text field is a textarea and onChange gets the whole report back. */
export function ReportView({ report, studentName, title, year, editable = false, onChange }) {
  const r = report;
  const h = r.headline || {};
  const set = (patch) => onChange && onChange({ ...r, ...patch });
  const setPriority = (i, patch) => set({ priorities: r.priorities.map((p, j) => j === i ? { ...p, ...patch } : p) });
  const setComment = (q, comment) => set({ questions: (r.questions || []).some(x => x.q === q) ? r.questions.map(x => x.q === q ? { ...x, comment } : x) : [...(r.questions || []), { q, comment }] });
  const first = (studentName || "").trim().split(/\s+/)[0];
  return (
    <div className="cm-report" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{title || "Initial diagnostic"}{yearLabel(year) ? ` · ${yearLabel(year)}` : ""}{studentName ? ` · ${studentName}` : ""}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
        <Tile label="Overall score" value={`${h.score ?? "–"} / ${h.max ?? "–"}`} sub={h.pct != null ? `${h.pct}%` : ""} colour={pctColour(h.pct ?? 0)} />
        <Tile label="On attempted questions" value={h.attemptedPct != null ? `${h.attemptedPct}%` : "–"} sub={`${h.attemptedScore ?? 0} / ${h.attemptedMax ?? 0}`} />
        <Tile label="Left blank" value={`${h.blankMarks ?? 0} marks`} sub={`${h.blankCount ?? 0} question${h.blankCount === 1 ? "" : "s"}`} colour={h.blankMarks ? T.red : T.ink} />
        {h.year12 && <Tile label="Year 12 content" value={`${h.year12.pct}%`} sub={`${h.year12.score} / ${h.year12.max}`} colour={pctColour(h.year12.pct)} />}
        {h.taught && <Tile label="On topics taught so far" value={h.taught.pct != null ? `${h.taught.pct}%` : "–"} sub={`${h.taught.score} / ${h.taught.max} · ${h.taught.notTaughtCount} question${h.taught.notTaughtCount === 1 ? "" : "s"} not yet taught`} colour={pctColour(h.taught.pct ?? 0)} />}
      </div>

      <H>Summary</H>
      {editable ? <textarea style={{ ...area, minHeight: 110 }} value={r.summary || ""} onChange={e => set({ summary: e.target.value })} />
        : <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{chemFormat(r.summary)}</p>}

      <H>Score by topic area</H>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(r.byTopic || []).map(t => (
          <div key={t.ref} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ flex: "1 1 200px" }}>{t.area}<span style={{ color: T.muted, fontSize: 12 }}> · Q{(t.questions || []).join(", Q")}{t.notTaught ? " · not yet taught at school" : ""}</span></span>
            <Bar value={t.pct || 0} colour={pctColour(t.pct ?? 0)} style={{ flex: "1 1 120px" }} />
            <span style={{ fontWeight: 700, color: pctColour(t.pct ?? 0), whiteSpace: "nowrap", width: 90, textAlign: "right" }}>{t.score} / {t.max} · {t.pct ?? 0}%</span>
          </div>
        ))}
      </div>

      <H>What went well</H>
      <ListField items={r.wentWell} editable={editable} onChange={v => set({ wentWell: v })} />

      <H>Priority areas (ranked by marks recoverable)</H>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(r.priorities || []).map((p, i) => (
          <div key={i} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800 }}>{i + 1}.</span>
              {editable ? <input style={{ ...area, minHeight: 0, flex: 1, padding: "6px 10px" }} value={p.area} onChange={e => setPriority(i, { area: e.target.value })} /> : <span style={{ fontWeight: 800, flex: 1 }}>{p.area}</span>}
              {editable ? <label style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 6 }}>Marks recoverable <input type="number" min={0} style={{ ...area, minHeight: 0, width: 64, padding: "6px 8px" }} value={p.marksRecoverable} onChange={e => setPriority(i, { marksRecoverable: Number(e.target.value) || 0 })} /></label>
                : <Chip tone="red">{p.marksRecoverable} mark{p.marksRecoverable === 1 ? "" : "s"} recoverable</Chip>}
            </div>
            {editable ? <textarea style={{ ...area, minHeight: 56 }} value={p.why} onChange={e => setPriority(i, { why: e.target.value })} /> : <div style={{ fontSize: 14, lineHeight: 1.55 }}>{chemFormat(p.why)}</div>}
            {editable ? <textarea style={{ ...area, minHeight: 56 }} value={p.action} onChange={e => setPriority(i, { action: e.target.value })} placeholder="Action" /> : <div style={{ fontSize: 14, lineHeight: 1.55 }}><b>Action:</b> {chemFormat(p.action)}</div>}
          </div>
        ))}
      </div>

      <H>Exam technique</H>
      <ListField items={r.examTechnique} editable={editable} onChange={v => set({ examTechnique: v })} />

      <H>Next steps</H>
      <ListField items={r.nextSteps} editable={editable} onChange={v => set({ nextSteps: v })} ordered />

      <H>Question by question</H>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {(r.items || []).map(it => {
          const c = (r.questions || []).find(q => q.q === it.n);
          return (
            <div key={it.n} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: `1px solid ${T.line}`, fontSize: 13, alignItems: "flex-start" }}>
              <div style={{ width: 70, flexShrink: 0 }}><b>Q{it.n}</b> <span style={{ fontWeight: 700, color: it.score >= it.max ? T.green : it.score > 0 ? T.amber : T.red }}>{it.score}/{it.max}</span></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.muted, fontSize: 12 }}>{chemFormat(it.title)}{it.attempted ? "" : " · not attempted"}{it.notTaught ? " · not yet taught at school" : ""}</div>
                {editable ? <textarea style={{ ...area, minHeight: 44, marginTop: 4 }} value={c?.comment || ""} onChange={e => setComment(it.n, e.target.value)} /> : <div style={{ lineHeight: 1.5 }}>{chemFormat(c?.comment || "")}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {!editable && first && <p style={{ margin: "16px 0 0", fontSize: 13, color: T.muted }}>{first}'s tutor builds the first few lessons around the priority areas above.</p>}
    </div>
  );
}

/** The tutor's panel on the review page: generate, edit, save, send. */
export function DiagnosticReportEditor({ a, sub, student, canMark, onSaved }) {
  const [report, setReport] = useState(sub.report || null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(null);
  const base = { assignmentId: a.id, uid: sub.uid };

  const run = async (what, action, payload) => {
    setBusy(what); setError(null); setFlash(null);
    try {
      const r = await ppqMarkApi({ action, ...base, ...payload });
      setReport(r.report); onSaved && onSaved(r.report);
      if (r.emailError) setError(`The report was saved but the email failed: ${r.emailError}`);
      else setFlash(what === "generate" ? "Draft written. Read it through, edit anything, then send." : what === "save" ? "Draft saved." : "Report sent to the parent, with the student copied. It now shows on the student's homework page.");
      if (what !== "generate") setEditing(false);
    } catch (e) { setError(e.message); }
    setBusy(null);
  };
  const generate = () => { if (report && !window.confirm("Write a new draft? The current text, including any edits, will be replaced.")) return; run("generate", "diagnosticReport"); };
  const send = () => { if (!window.confirm("Send this report to the parent (student copied) and show it to the student in the app?")) return; run("send", "sendDiagnosticReport", { report }); };

  if (!sub.submittedAt) return null;
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, borderColor: report?.sentAt ? T.green : T.border }}>
      <CardHeader title="Feedback report" sub={report?.sentAt ? `Sent ${fmt(report.sentAt)}` : report ? `Draft written ${fmt(report.generatedAt || report.editedAt)} · not sent yet` : "No report yet"}
        right={canMark && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!report && <Button variant="primary" onClick={generate} disabled={!!busy}>{busy === "generate" ? "Writing the report…" : "Write the report"}</Button>}
            {report && !editing && <Button variant="secondary" onClick={() => setEditing(true)} disabled={!!busy}>Edit</Button>}
            {report && editing && <Button variant="secondary" onClick={() => run("save", "saveDiagnosticReport", { report })} disabled={!!busy}>{busy === "save" ? "Saving…" : "Save draft"}</Button>}
            {report && <Button variant="ghost" onClick={generate} disabled={!!busy}>{busy === "generate" ? "Writing…" : "Rewrite"}</Button>}
            {report && <Button variant="primary" onClick={send} disabled={!!busy}>{busy === "send" ? "Sending…" : report.sentAt ? "Send again" : "Send to parent"}</Button>}
          </div>
        )} />
      {error && <Notice tone="red">{error}</Notice>}
      {flash && <Notice tone="green">{flash}</Notice>}
      {!report && <div style={{ fontSize: 13, color: T.muted }}>Check the marks above first (adjust any you disagree with), then write the report. It takes about a minute. You can edit every sentence before it goes out.</div>}
      {report && <ReportView report={report} studentName={student?.displayName} title={a.title} year={student?.year} editable={editing && canMark} onChange={setReport} />}
    </Card>
  );
}

/** What the student (and parent) see once the report has been sent. */
export function StudentReport({ report, studentName, title, year }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <CardHeader title="Your feedback report" sub={`Sent ${fmt(report.sentAt)}`} right={<Button variant="secondary" icon="copy" onClick={() => window.print()}>Print or save as PDF</Button>} />
      <ReportView report={report} studentName={studentName} title={title} year={year} />
    </Card>
  );
}
