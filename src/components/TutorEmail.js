// Admin: one email to many students and parents, written here and sent
// through api/students.js (action "email"). Pick groups or a single student
// (?uid=), who it goes to, add files, send yourself a test, then send. Every
// send is logged in `messages` and listed below.
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllClasses, fetchAllStudents, fetchMessages, studentsApi, uploadMailFile } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Notice, Icon } from "../ui/components";
import { relativeTime } from "../utils/analytics";

const fmtSize = (b) => b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round((b || 0) / 1024))} KB`;
const fmtWhen = (ms) => ms ? new Date(ms).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

function Toggle({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
      border: `1px solid ${on ? T.accentText : T.border}`, background: on ? T.accentTint : T.card, color: on ? T.accentText : T.body,
    }}>{on && <Icon name="check" size={12} strokeWidth={3} />}{children}</button>
  );
}

export default function TutorEmail({ authUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const onlyUid = new URLSearchParams(location.search).get("uid") || null;
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState(null);
  const [groups, setGroups] = useState([]);          // [] = every group
  const [toStudents, setToStudents] = useState(true);
  const [toParents, setToParents] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(null);
  const [open, setOpen] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!authUser?.uid) return undefined;
    let alive = true;
    (async () => {
      try {
        const [cls, st, msgs] = await Promise.all([fetchAllClasses(), fetchAllStudents(), fetchMessages().catch(() => [])]);
        if (!alive) return;
        setClasses(cls); setStudents(st); setHistory(msgs);
      } catch (e) { if (alive) { setError(e.message); setStudents([]); setHistory([]); } }
    })();
    return () => { alive = false; };
  }, [authUser]);

  const one = onlyUid && students ? students.find(s => s.uid === onlyUid) : null;
  // Who the email goes to, worked out the same way as the server does it
  const recipients = useMemo(() => {
    const list = (students || []).filter(s => (onlyUid ? s.uid === onlyUid : (groups.length === 0 || groups.includes(s.classId))) && !s.accessDisabled);
    const seen = new Set(); const out = [];
    const add = (name, email, role) => { const k = (email || "").toLowerCase(); if (!k || seen.has(k)) return; seen.add(k); out.push({ name, email, role }); };
    for (const s of list) {
      if (toStudents && s.email) add(s.displayName || s.email, s.email, "student");
      if (toParents && s.parentEmail) add(s.parentName || s.parentEmail, s.parentEmail, "parent");
    }
    return out;
  }, [students, onlyUid, groups, toStudents, toParents]);

  const flipGroup = (code) => setGroups(g => g.includes(code) ? g.filter(x => x !== code) : [...g, code]);
  const addFiles = async (list) => {
    const picked = Array.from(list || []).slice(0, 5 - files.length);
    if (!picked.length) return;
    setUploading(true); setError(null);
    try { const added = []; for (const f of picked) added.push(await uploadMailFile(f)); setFiles(fs => [...fs, ...added]); }
    catch (e) { setError(e.message); }
    setUploading(false);
  };

  const canSend = subject.trim().length >= 3 && message.trim().length >= 10 && recipients.length > 0 && !busy && !uploading;
  const send = async (test) => {
    if (!canSend) return;
    if (!test && !window.confirm(`Send "${subject.trim()}" to ${recipients.length} ${recipients.length === 1 ? "person" : "people"}?`)) return;
    setBusy(test ? "test" : "send"); setError(null); setNotice(null);
    try {
      const r = await studentsApi("email", {
        uids: onlyUid ? [onlyUid] : [], groups: onlyUid ? [] : groups, students: toStudents, parents: toParents,
        subject: subject.trim(), message: message.trim(), link: link.trim(), linkLabel: linkLabel.trim(), attachments: files, test,
      });
      if (test) setNotice(`Test sent to ${r.sentTo}. The real send would go to ${r.wouldGoTo} ${r.wouldGoTo === 1 ? "person" : "people"}.`);
      else {
        setNotice(r.skipped ? `Logged, but no email went out: the email service key is not set on the server.` : `Sent to ${r.count} ${r.count === 1 ? "person" : "people"}.`);
        setSubject(""); setMessage(""); setLink(""); setLinkLabel(""); setFiles([]);
        fetchMessages().then(setHistory).catch(() => {});
      }
    } catch (e) { setError(e.message); }
    setBusy(null);
  };

  const field = { display: "flex", flexDirection: "column", gap: 6 };
  const label = { fontSize: 12, fontWeight: 600, color: T.muted };

  return (
    <>
      <PageHeader eyebrow="Students" title={one ? `Email ${one.displayName || one.email}` : "Email students"}
        sub={one ? "Goes to this student, and to their parent if you tick Parents." : "One email, personalised with each first name, to the groups you pick. Parents can be included. Files are stored and linked, so nothing bounces for size."}
        right={<Button variant="secondary" icon="arrowLeft" onClick={() => navigate(one ? `/tutor/students/${one.uid}` : "/tutor/students")}>{one ? "Back to the profile" : "All students"}</Button>} />
      {error && <Notice tone="red">{error}</Notice>}
      {notice && <Notice tone="green">{notice}</Notice>}

      <div className="cm-two-col">
        <div className="cm-main-col">
          <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <CardHeader title="Who" />
            {!onlyUid && (
              <div style={field}>
                <span style={label}>Groups</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Toggle on={groups.length === 0} onClick={() => setGroups([])}>Every group</Toggle>
                  {classes.map(c => <Toggle key={c.code} on={groups.includes(c.code)} onClick={() => flipGroup(c.code)}>{c.name}</Toggle>)}
                </div>
              </div>
            )}
            <div style={field}>
              <span style={label}>Send to</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Toggle on={toStudents} onClick={() => setToStudents(v => !v)}>Students</Toggle>
                <Toggle on={toParents} onClick={() => setToParents(v => !v)}>Parents</Toggle>
              </div>
            </div>
            <span style={{ fontSize: 12, color: T.muted }}>
              {students === null ? "Loading…" : recipients.length === 0 ? "Nobody matches yet." : <>{recipients.length} {recipients.length === 1 ? "person" : "people"}: {recipients.slice(0, 12).map(r => r.name).join(", ")}{recipients.length > 12 ? ` and ${recipients.length - 12} more` : ""}. Accounts switched off are left out.</>}
            </span>
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <CardHeader title="Message" sub='Each email starts "Hi <first name>," on its own, so begin with the news.' />
            <div style={field}><label htmlFor="em-subject" style={label}>Subject</label><Input id="em-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mock exam feedback session on Thursday" maxLength={150} /></div>
            <div style={field}><label htmlFor="em-body" style={label}>Message</label>
              <textarea id="em-body" value={message} onChange={e => setMessage(e.target.value)} rows={9} maxLength={6000} placeholder="Write as you would speak to them. A blank line starts a new paragraph."
                style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, color: T.ink, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} /></div>
            <div className="cm-grid-2" style={{ gap: 12 }}>
              <div style={field}><label htmlFor="em-link" style={label}>Button link (optional)</label><Input id="em-link" type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://…" /></div>
              <div style={field}><label htmlFor="em-link-label" style={label}>Button text</label><Input id="em-link-label" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} placeholder="e.g. Join the meeting" maxLength={60} /></div>
            </div>
            <div style={field}>
              <span style={label}>Attachments</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {files.map(a => (
                  <span key={a.url} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: T.soft, fontSize: 12 }}>
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="cm-link" style={{ fontWeight: 600 }}>{a.name}</a>
                    <span style={{ color: T.faint }}>{fmtSize(a.size)}</span>
                    <button type="button" aria-label={`Remove ${a.name}`} onClick={() => setFiles(fs => fs.filter(x => x.url !== a.url))} style={{ border: "none", background: "none", cursor: "pointer", color: T.muted, padding: 0, display: "inline-flex" }}><Icon name="x" size={12} /></button>
                  </span>
                ))}
                {files.length < 5 && <Button size="sm" icon="plus" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Add file"}</Button>}
                <input ref={fileRef} type="file" hidden multiple accept=".pdf,image/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv" onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
                <span style={{ fontSize: 11, color: T.faint }}>Up to 5 files, 3 MB each, linked in the email.</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
              <Button variant="primary" icon="message" onClick={() => send(false)} disabled={!canSend}>{busy === "send" ? "Sending…" : `Send to ${recipients.length}`}</Button>
              <Button onClick={() => send(true)} disabled={!canSend}>{busy === "test" ? "Sending…" : "Send me a test first"}</Button>
              <span style={{ fontSize: 11, color: T.faint }}>Replies come to the HSJ inbox.</span>
            </div>
          </Card>
        </div>

        <aside className="cm-side-col">
          <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CardHeader title="Sent" sub="Every email sent from here" />
            {history === null && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
            {history && history.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing sent yet.</span>}
            {(history || []).slice(0, 40).map((m, i) => (
              <div key={m.id} style={{ borderTop: i ? `1px solid ${T.line}` : "none", paddingTop: i ? 8 : 0, display: "flex", flexDirection: "column", gap: 3, fontSize: 13 }}>
                <button type="button" onClick={() => setOpen(o => o === m.id ? null : m.id)} style={{ textAlign: "left", border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", color: T.ink, fontWeight: 600, fontSize: 13 }}>{m.subject}</button>
                <span style={{ fontSize: 11, color: T.muted }}>{fmtWhen(m.sentAt)} ({relativeTime(m.sentAt)}) · {m.count} {m.count === 1 ? "person" : "people"}{m.parents ? " incl. parents" : ""}{m.sentByName ? ` · ${m.sentByName}` : ""}{m.skipped ? " · not delivered (no email key)" : ""}</span>
                {open === m.id && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, padding: "8px 10px", borderRadius: T.radiusSm, background: T.soft }}>
                    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{m.message}</span>
                    {m.link && <a href={m.link} target="_blank" rel="noopener noreferrer" className="cm-link">{m.linkLabel || m.link}</a>}
                    {(m.attachments || []).length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{m.attachments.map(a => <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className="cm-link">{a.name}</a>)}</div>}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(m.recipients || []).map(r => <Chip key={r.email} tone={r.role === "parent" ? "indigo" : "neutral"} style={{ fontSize: 11, padding: "2px 8px" }}>{r.name || r.email}</Chip>)}</div>
                  </div>
                )}
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </>
  );
}
