import React, { useEffect, useState } from "react";
import { T } from "../ui/theme";
import { Button, Icon } from "../ui/components";
import { TERMS_VERSION, buildAgreement, agreementPreamble, paymentPlanLabel, money, fmtLongDate, SCHEDULE_TOKEN } from "../data/terms";

// The Tutoring Programme Agreement as a document: the summary grid, the
// preamble and the numbered sections. Used on the parent's acceptance page
// (OnboardingPage) and afterwards on the parent's Agreement tab, where it can
// be printed or saved as a PDF.

const label = { fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 };
const cardStyle = { background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 20, marginBottom: 14 };
const clauseStyle = { margin: "0 0 8px", fontSize: 14, lineHeight: 1.65, color: T.body };
const sectionNo = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 999, background: T.soft, color: T.ink, fontSize: 13, fontWeight: 700, flexShrink: 0 };
const sectionTitle = { fontSize: 17, fontWeight: 700, color: T.ink, lineHeight: 1.3 };

function clauseText(c) {
  const m = c.match(/^(\d{1,2}\.\d{1,2}|\([a-z]\))\s+([\s\S]*)$/);
  if (!m) return c;
  return <><strong style={{ color: T.ink }}>{m[1]}</strong> {m[2]}</>;
}

/** Build the template variables from a placed student's profile (users/{uid}). */
export function agreementVarsFromProfile(child) {
  const ag = child.agreement || {};
  const when = ag.acceptedAt || (child.placedAt?.seconds ? child.placedAt.seconds * 1000 : child.placedAt) || null;
  return {
    parentName: child.parentName || "", studentName: child.displayName || "",
    agreementDate: when ? new Date(when).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "",
    subject: "Chemistry", level: `A Level (${child.board ? child.board.toUpperCase() : ""}${child.year ? `, Year ${child.year}` : ""})`,
    startDate: ag.programmeStart || null, programmeEnd: ag.programmeEnd || null, groupSize: ag.groupSize || 6,
    totalFee: ag.totalFee, paymentPlan: ag.paymentPlan, schedule: ag.schedule || [],
    initialGrade: ag.initialGrade || null, extraTerms: ag.extraTerms || "",
  };
}

const PRINT_CSS = `@media print {
  body * { visibility: hidden; }
  .cm-print-area, .cm-print-area * { visibility: visible; }
  .cm-print-area { position: absolute; left: 0; top: 0; width: 100%; }
  .cm-print-area .cm-no-print { display: none !important; }
}`;

/** Sets the browser tab title while mounted, so a saved PDF gets a sensible file name. */
function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);
}

export function PrintAgreementButton({ size }) {
  return <Button size={size} icon="copy" className="cm-no-print" onClick={() => window.print()}>Download or print</Button>;
}

export default function AgreementDocument({ vars, accepted, printable, title, collapsible }) {
  const sections = buildAgreement(vars);
  useDocumentTitle(printable ? title : null);
  // Collapsible (the parent's signed copy): sections start closed and the
  // print dialog opens them all, so a saved PDF is always the whole document
  const [open, setOpen] = useState(() => new Set());
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    if (!collapsible) return undefined;
    const on = () => setPrinting(true), off = () => setPrinting(false);
    window.addEventListener("beforeprint", on); window.addEventListener("afterprint", off);
    return () => { window.removeEventListener("beforeprint", on); window.removeEventListener("afterprint", off); };
  }, [collapsible]);
  const isOpen = (n) => !collapsible || printing || open.has(n);
  const toggle = (n) => setOpen(prev => { const next = new Set(prev); next.has(n) ? next.delete(n) : next.add(n); return next; });
  const allOpen = sections.every(sec => open.has(sec.n));
  return (
    <div className={printable ? "cm-print-area" : undefined}>
      {printable && <style>{PRINT_CSS}</style>}
      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {[["Student", vars.studentName], ["Parent or guardian", vars.parentName], ["Programme", vars.level], ["Start date", fmtLongDate(vars.startDate) || "To be confirmed"],
            ["Total programme fee", money(vars.totalFee) || "See below"], ["Payment option", paymentPlanLabel(vars.paymentPlan)]].map(([k, v]) => (
            <div key={k}><div style={label}>{k}</div><div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{v}</div></div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        {agreementPreamble(vars).map((p, i) => <p key={i} style={clauseStyle}>{p}</p>)}
        {collapsible && (
          <button type="button" className="cm-no-print" onClick={() => setOpen(allOpen ? new Set() : new Set(sections.map(sec => sec.n)))}
            style={{ background: "none", border: "none", padding: 0, marginTop: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.accentText }}>
            {allOpen ? "Collapse all sections" : "Expand all sections"}
          </button>
        )}
      </div>
      {sections.map(sec => (
        <div key={sec.n} style={{ ...cardStyle, padding: collapsible ? "4px 20px" : "18px 20px 10px" }}>
          {collapsible ? (
            <button type="button" onClick={() => toggle(sec.n)} aria-expanded={isOpen(sec.n)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: "12px 0", cursor: "pointer", textAlign: "left" }}>
              <span style={sectionNo}>{sec.n}</span>
              <span style={{ ...sectionTitle, flex: 1 }}>{sec.title}</span>
              <span className="cm-no-print" style={{ display: "inline-flex", transition: "transform .15s", transform: isOpen(sec.n) ? "rotate(180deg)" : "none", color: T.muted }}><Icon name="chevronDown" size={18} /></span>
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={sectionNo}>{sec.n}</span>
              <span style={sectionTitle}>{sec.title}</span>
            </div>
          )}
          {isOpen(sec.n) && <div style={{ paddingBottom: collapsible ? 10 : 0 }}>
            {sec.clauses.map((c, i) => c === SCHEDULE_TOKEN ? (
              <table key={i} style={{ borderCollapse: "collapse", margin: "4px 0 10px", fontSize: 14, minWidth: 260 }}>
                <tbody>
                  {(vars.schedule || []).map((r, j) => (
                    <tr key={j}><td style={{ padding: "4px 14px 4px 0", fontWeight: 600 }}>{money(r.amount)}</td><td style={{ padding: "4px 0", color: T.body }}>{r.due}</td></tr>
                  ))}
                  {(vars.schedule || []).length === 0 && <tr><td style={{ color: T.muted, padding: "4px 0" }}>Payment dates as agreed at enrolment.</td></tr>}
                </tbody>
              </table>
            ) : c.startsWith("- ") ? (
              <div key={i} style={{ ...clauseStyle, paddingLeft: 22, position: "relative" }}><span style={{ position: "absolute", left: 8 }}>•</span>{clauseText(c.slice(2))}</div>
            ) : (
              <p key={i} style={clauseStyle}>{clauseText(c)}</p>
            ))}
          </div>}
        </div>
      ))}
      <div style={cardStyle}>
        {accepted?.acceptedAt && (
          <div style={{ fontSize: 14 }}>
            <div style={{ fontWeight: 700 }}>Accepted</div>
            <div>By {accepted.acceptedName} on {new Date(accepted.acceptedAt).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}, by typing their name on the HSJ Tuition platform.</div>
          </div>
        )}
        <div style={{ fontSize: 11, color: T.faint, marginTop: 10 }}>Version {accepted?.version || TERMS_VERSION}</div>
      </div>
    </div>
  );
}
