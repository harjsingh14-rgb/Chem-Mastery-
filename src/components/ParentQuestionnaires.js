// Every parent questionnaire in one place (Students tab, Questionnaires, admins
// only): a summary of the multiple-choice answers across all parents, one row
// per family with the full answers underneath, and a CSV download for a
// spreadsheet. The answers themselves live on the applicant record and on the
// student's profile (Details tab).
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApplicants } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Bar } from "../ui/components";
import { QUESTIONNAIRE_SECTIONS, QUESTIONNAIRE_QUESTIONS } from "../data/parent-questionnaire";
import { yearLabel } from "../data/years";

const fmtDate = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
const csvCell = (v) => { const s = Array.isArray(v) ? v.join("; ") : String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

function downloadCsv(rows) {
  const head = ["Student", "Year", "Board", "Parent", "Parent email", "Completed", "Group", ...QUESTIONNAIRE_QUESTIONS.map(q => q.label)];
  const lines = [head.map(csvCell).join(",")];
  for (const r of rows) {
    const q = r.questionnaire;
    lines.push([r.studentName, r.year, r.board, r.parentName, r.parentEmail, fmtDate(q.submittedAt), r.groupCode || "", ...QUESTIONNAIRE_QUESTIONS.map(x => q[x.id])].map(csvCell).join(","));
  }
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `parent-questionnaires-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Counts of each option for one select or multi question, most common first. */
function tally(rows, q) {
  const n = {};
  for (const r of rows) {
    const v = r.questionnaire[q.id];
    for (const x of Array.isArray(v) ? v : v ? [v] : []) n[x] = (n[x] || 0) + 1;
  }
  return Object.entries(n).sort((a, b) => b[1] - a[1]);
}

export default function ParentQuestionnaires() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetchApplicants().then(setApplicants).catch(e => { setError(e.message); setApplicants([]); });
  }, []);

  const rows = useMemo(() => (applicants || []).filter(a => a.questionnaire?.submittedAt).sort((a, b) => (b.questionnaire.submittedAt || 0) - (a.questionnaire.submittedAt || 0)), [applicants]);
  const shown = useMemo(() => {
    const s = search.trim().toLowerCase();
    return s ? rows.filter(r => [r.studentName, r.parentName, r.parentEmail, r.groupCode].some(v => (v || "").toLowerCase().includes(s))) : rows;
  }, [rows, search]);
  const waiting = (applicants || []).filter(a => !a.questionnaire?.submittedAt && a.terms?.acceptedAt).length;
  const choiceQuestions = QUESTIONNAIRE_QUESTIONS.filter(q => q.type === "select" || q.type === "multi");

  return (
    <>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="cm-grid-4">
        <Card padding="18px 20px"><div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>Completed</div><div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 800 }}>{rows.length}</div></Card>
        <Card padding="18px 20px"><div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>Agreed, not yet answered</div><div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 800 }}>{waiting}</div><div style={{ fontSize: 12, color: T.muted }}>Send a reminder from the Onboarding tab</div></Card>
      </div>

      {rows.length > 0 && (
        <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <CardHeader title="Across every parent" sub="How often each answer was chosen" />
          <div className="cm-grid-2" style={{ gap: 16 }}>
            {choiceQuestions.map(q => {
              const t = tally(rows, q);
              const max = t[0]?.[1] || 1;
              return (
                <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{q.label.replace(" (Select all that apply)", "")}</div>
                  {t.length === 0 && <span style={{ fontSize: 12, color: T.muted }}>No answers yet</span>}
                  {t.map(([opt, n]) => (
                    <div key={opt} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <span style={{ flex: "1 1 160px" }}>{opt}</span>
                      <Bar value={(n / max) * 100} colour={T.accent} style={{ flex: "1 1 100px" }} />
                      <span style={{ width: 28, textAlign: "right", fontWeight: 700 }}>{n}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card padding={0}>
        <CardHeader title="Every questionnaire" sub="Tap a family for the full answers" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
          right={<div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Input placeholder="Search student, parent or group" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
            <Button icon="copy" onClick={() => downloadCsv(shown)} disabled={shown.length === 0}>Download CSV</Button>
          </div>} />
        {applicants === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {applicants && rows.length === 0 && <EmptyState icon="message" title="No questionnaires yet" body="Parents answer the questions on the agreement link, after accepting the terms. Answers appear here and on each student's profile." />}
        {shown.length > 0 && (
          <Table minWidth={720}>
            <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Student</th><th style={th}>Parent</th><th style={th}>Grades</th><th style={th}>Heard from</th><th style={th}>Group</th><th style={{ ...th, paddingRight: 20 }}>Completed</th></tr></thead>
            <tbody>
              {shown.map(r => {
                const q = r.questionnaire; const isOpen = open === r.id;
                return (
                  <React.Fragment key={r.id}>
                    <tr className="cm-row-hover" onClick={() => setOpen(isOpen ? null : r.id)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                      <td style={{ ...td, paddingLeft: 20, fontWeight: 600 }}>{r.studentName}<div style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>{yearLabel(r.year)}{r.board ? ` · ${r.board.toUpperCase()}` : ""}</div></td>
                      <td style={td}>{r.parentName}<div style={{ fontSize: 12, color: T.muted }}>{r.parentEmail}</div></td>
                      <td style={td}><Chip tone="neutral">{q.currentGrade || "?"} now</Chip> <Chip tone="accent">{q.targetGrade || "?"} target</Chip></td>
                      <td style={{ ...td, color: T.body }}>{q.heardFrom || "–"}</td>
                      <td style={td}>{r.groupCode ? <Chip tone="green">{r.groupCode}</Chip> : <span style={{ color: T.muted }}>Not placed</span>}</td>
                      <td style={{ ...td, paddingRight: 20, color: T.muted }}>{fmtDate(q.submittedAt)}</td>
                    </tr>
                    {isOpen && (
                      <tr style={{ background: "#FAFBFC" }}><td colSpan={6} style={{ padding: "6px 20px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                          {r.studentUid && <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); navigate(`/tutor/students/${r.studentUid}/details`); }}>Open the student</Button>}
                        </div>
                        <div className="cm-grid-2" style={{ gap: 16 }}>
                          {QUESTIONNAIRE_SECTIONS.map(sec => (
                            <div key={sec.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: T.accentText, textTransform: "uppercase", letterSpacing: 0.6 }}>{sec.title}</div>
                              {sec.questions.map(x => (
                                <div key={x.id} style={{ fontSize: 13 }}>
                                  <div style={{ color: T.muted, fontSize: 12 }}>{x.label}</div>
                                  <div style={{ whiteSpace: "pre-wrap" }}>{Array.isArray(q[x.id]) ? q[x.id].join(", ") : (q[x.id] || <span style={{ color: T.faint }}>No answer</span>)}</div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
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
