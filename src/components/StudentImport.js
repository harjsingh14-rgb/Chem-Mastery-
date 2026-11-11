import React, { useState, useMemo } from "react";
import { studentsApi } from "../firebase";
import { T, BOARDS, boardLabel } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Table, th, td, Notice } from "../ui/components";

// Bulk import of current students: paste rows from a spreadsheet (TutorBird
// export, Google Sheet, Excel). Columns are matched by their headings; a group,
// board and year can be set as defaults for rows that do not say. The server
// checks every row first (dry run), then creates and places them.

const HEADINGS = {
  studentName: ["student name", "student", "name", "full name", "pupil"],
  studentFirst: ["first name", "student first name", "first", "forename", "given name"],
  studentLast: ["last name", "student last name", "last", "surname", "family name"],
  studentEmail: ["student email", "email", "e-mail", "student e-mail", "email address", "student email address"],
  parentName: ["parent name", "parent", "guardian", "parent/guardian", "parent or guardian", "family", "parent guardian name", "contact name"],
  parentFirst: ["parent first name", "guardian first name", "contact first name", "parent contact 1 first name"],
  parentLast: ["parent last name", "guardian last name", "contact last name", "parent contact 1 last name"],
  parentEmail: ["parent email", "guardian email", "family email", "parent e-mail", "contact email", "parent email address", "parent contact 1 email"],
  parentPhone: ["phone", "parent phone", "mobile", "telephone", "phone number", "contact phone", "parent mobile", "parent contact 1 mobile phone"],
  board: ["board", "exam board", "specification", "spec"],
  year: ["year", "year group", "yr", "school year"],
  groupCode: ["group", "group code", "class", "group name"],
  // TutorBird contact export: "Group Tags" like "A Level Chemistry Year 13 - OCR A; Tuesday group"
  tags: ["group tags", "tags"],
  status: ["status"],
};
// "Khan, Nadia" (TutorBird order) -> "Nadia Khan"
const fixName = (v) => { const m = String(v || "").trim().match(/^([^,]+),\s*([^,]+)$/); return m ? `${m[2].trim()} ${m[1].trim()}` : String(v || "").trim(); };
const norm = (s) => String(s || "").trim().toLowerCase().replace(/[_\s]+/g, " ");

/** Split pasted text into rows of cells: tab-separated (spreadsheet paste) or comma-separated with quotes. */
function parseTable(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim());
  if (lines.length === 0) return [];
  const sep = lines[0].includes("\t") ? "\t" : ",";
  return lines.map(line => {
    if (sep === "\t") return line.split("\t").map(c => c.trim());
    const cells = []; let cur = ""; let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { cells.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  });
}

const boardOf = (v) => { const s = norm(v); if (!s) return ""; if (s.startsWith("aqa")) return "aqa"; if (s.startsWith("ocr")) return "ocr"; if (s.startsWith("edex") || s.startsWith("pearson")) return "edexcel"; return s; };
const yearOf = (v) => { const m = String(v || "").match(/1[23]/); return m ? Number(m[0]) : ""; };

/** Map parsed rows to import rows using the heading row (or a fixed order when there is none). */
function toRows(table, groups, defaults) {
  if (table.length === 0) return { rows: [], mapped: [] };
  const header = table[0].map(norm);
  const hasHeader = !header.some(h => h.includes("@"));
  const col = {};
  if (hasHeader) {
    for (const [key, names] of Object.entries(HEADINGS)) {
      const i = header.findIndex(h => names.includes(h));
      if (i >= 0 && !(i in Object.fromEntries(Object.values(col).map(x => [x, 1])))) col[key] = i;
    }
  } else {
    ["studentName", "studentEmail", "parentName", "parentEmail", "parentPhone", "board", "year", "groupCode"].forEach((k, i) => { col[k] = i; });
  }
  const groupCodeOf = (v) => {
    const s = norm(v); if (!s) return defaults.groupCode;
    const g = groups.find(x => norm(x.code) === s || norm(x.name) === s);
    return g ? g.code : String(v).trim().toUpperCase();
  };
  const body = hasHeader ? table.slice(1) : table;
  const get = (r, k) => col[k] === undefined ? "" : (r[col[k]] || "");
  // Board, year and group hidden in a tags cell ("Year 13 - OCR A; Tuesday group"): a tag only counts as the group when it names one
  const fromTags = (v) => {
    const parts = String(v || "").split(/[;|]/).map(x => x.trim()).filter(Boolean);
    const board = parts.map(x => (norm(x).match(/\b(aqa|ocr|edexcel|pearson)\b/) || [])[1]).find(Boolean) || "";
    const year = parts.map(yearOf).find(Boolean) || "";
    const group = parts.map(x => groups.find(g => norm(g.name) === norm(x) || norm(g.code) === norm(x))).find(Boolean);
    return { board: boardOf(board), year, groupCode: group ? group.code : "" };
  };
  const rows = body.filter(r => !/^inactive|^archived|^former/i.test(get(r, "status"))).map(r => {
    const tags = fromTags(get(r, "tags"));
    const parentFull = [get(r, "parentFirst"), get(r, "parentLast")].filter(Boolean).join(" ");
    return {
      studentName: fixName(get(r, "studentName")) || [get(r, "studentFirst"), get(r, "studentLast")].filter(Boolean).join(" "),
      studentEmail: get(r, "studentEmail"),
      parentName: parentFull || fixName(get(r, "parentName")),
      parentEmail: get(r, "parentEmail"),
      parentPhone: get(r, "parentPhone"),
      board: boardOf(get(r, "board")) || tags.board || defaults.board,
      year: yearOf(get(r, "year")) || tags.year || defaults.year,
      groupCode: get(r, "groupCode") ? groupCodeOf(get(r, "groupCode")) : (tags.groupCode || defaults.groupCode),
    };
  }).filter(r => r.studentName || r.studentEmail);
  return { rows, mapped: Object.keys(col).filter(k => !k.endsWith("First") && !k.endsWith("Last") && k !== "status") };
}

export default function StudentImport({ groups, onImported, onClose }) {
  const [text, setText] = useState("");
  const [defaults, setDefaults] = useState({ groupCode: groups[0]?.code || "", board: "", year: 13 });
  const [check, setCheck] = useState(null);   // dry-run results
  const [done, setDone] = useState(null);     // import results
  const [sendEmails, setSendEmails] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const parsed = useMemo(() => toRows(parseTable(text), groups, { ...defaults, board: defaults.board || groups.find(g => g.code === defaults.groupCode)?.board || "aqa" }), [text, groups, defaults]);
  const ready = check ? check.filter(r => r.status === "ready").length : 0;

  const runCheck = async () => {
    setBusy(true); setError(null); setDone(null);
    try { const r = await studentsApi("import", { rows: parsed.rows, dryRun: true }); setCheck(r.results); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };
  const runImport = async () => {
    if (!window.confirm(`Import ${ready} student${ready === 1 ? "" : "s"} and place them into their groups now?${sendEmails ? "\n\nWelcome emails with logins go to every student and parent straight away." : "\n\nNo emails are sent: you send the welcomes later from the Onboarding list."}`)) return;
    setBusy(true); setError(null);
    try {
      const okRows = parsed.rows.filter((_, i) => check[i]?.status === "ready");
      const r = await studentsApi("import", { rows: okRows, sendEmails });
      setDone(r.results); setCheck(null);
      if (onImported) onImported(r.results);
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  const results = done || check;
  return (
    <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 }}>
      <CardHeader title="Import current students" sub="Paste rows from a spreadsheet: a TutorBird export, a Google Sheet or Excel. The first row should be the headings (student name, student email, parent name, parent email, phone, board, year, group). Each student is created as a current student, placed into their group and given an account. No agreement is sent and no fees are recorded."
        right={<Button variant="ghost" onClick={onClose}>Close</Button>} />
      {error && <Notice tone="red">{error}</Notice>}
      {!done && (
        <>
          <textarea value={text} onChange={e => { setText(e.target.value); setCheck(null); }} rows={8} placeholder={"Student name\tStudent email\tParent name\tParent email\tPhone\tBoard\tYear\tGroup\nAisha Khan\taisha@example.com\tNadia Khan\tnadia@example.com\t07700 900000\tAQA\t13\tElectropositives"}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 13, fontFamily: "ui-monospace, Menlo, monospace", color: T.ink, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 600, color: T.muted }}>Group when a row has none
              <select value={defaults.groupCode} onChange={e => setDefaults(d => ({ ...d, groupCode: e.target.value }))} style={{ padding: "8px 10px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink }}>
                <option value="">None</option>
                {groups.map(g => <option key={g.code} value={g.code}>{g.name} ({boardLabel(g.board)})</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 600, color: T.muted }}>Board when a row has none
              <select value={defaults.board} onChange={e => setDefaults(d => ({ ...d, board: e.target.value }))} style={{ padding: "8px 10px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink }}>
                <option value="">Same as the group</option>
                {BOARDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 600, color: T.muted }}>Year when a row has none
              <select value={defaults.year} onChange={e => setDefaults(d => ({ ...d, year: Number(e.target.value) }))} style={{ padding: "8px 10px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink }}>
                <option value={12}>Year 12</option><option value={13}>Year 13</option>
              </select>
            </label>
            <Button variant="primary" onClick={runCheck} disabled={busy || parsed.rows.length === 0}>{busy && !check ? "Checking…" : `Check ${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"}`}</Button>
            {parsed.rows.length > 0 && <span style={{ fontSize: 12, color: T.muted, alignSelf: "center" }}>Columns found: {parsed.mapped.length ? parsed.mapped.join(", ") : "none, using the fixed order"}</span>}
          </div>
        </>
      )}
      {results && (
        <>
          <Table minWidth={760}>
            <thead><tr><th style={th}>Student</th><th style={th}>Email</th><th style={th}>Group</th><th style={th}>Result</th></tr></thead>
            <tbody>
              {results.map(r => (
                <tr key={r.row} style={{ borderTop: `1px solid ${T.line}` }}>
                  <td style={td}>{r.studentName || <span style={{ color: T.faint }}>(blank)</span>}</td>
                  <td style={{ ...td, color: T.muted }}>{r.studentEmail}</td>
                  <td style={td}>{r.groupName || ""}</td>
                  <td style={td}>
                    <Chip tone={r.status === "ready" || r.status === "imported" ? "green" : r.status === "failed" ? "red" : "amber"}>{r.status === "ready" ? "Ready" : r.status === "imported" ? "Imported" : r.status === "failed" ? "Failed" : "Skipped"}</Chip>
                    {r.problems.length > 0 && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{r.problems.join("; ")}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {!done && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}><input type="radio" checked={!sendEmails} onChange={() => setSendEmails(false)} /> Hold the welcome emails (send them from the Onboarding list when you launch)</label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}><input type="radio" checked={sendEmails} onChange={() => setSendEmails(true)} /> Send welcome emails with logins now</label>
              </div>
              <div><Button variant="accent" onClick={runImport} disabled={busy || ready === 0}>{busy ? "Importing…" : `Import ${ready} student${ready === 1 ? "" : "s"}`}</Button></div>
            </div>
          )}
          {done && <Notice tone="green">{done.filter(r => r.status === "imported").length} imported. {sendEmails ? "Welcome emails sent." : "Welcome emails are held: open a student in the Placed list and click Send welcome emails when you are ready."}</Notice>}
        </>
      )}
    </Card>
  );
}
