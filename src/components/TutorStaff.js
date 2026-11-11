// Admin: who teaches on the platform. Add a tutor (their account is created
// and the login emailed), make someone an admin, or take access away.
import React, { useState, useEffect } from "react";
import { fetchTutors, fetchAllClasses, staffApi, fetchSettings, saveSettings } from "../firebase";
import { resetCommunityCache, DEFAULT_DISCORD_INVITE } from "./CommunityCard";
import { T } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Table, th, td, EmptyState, Notice, Avatar } from "../ui/components";

const label = { fontSize: 12, fontWeight: 600, color: T.muted };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const selectStyle = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink };
const fmtDate = (v) => { const ms = v?.seconds ? v.seconds * 1000 : v?.toMillis ? v.toMillis() : typeof v === "number" ? v : null; return ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""; };

export default function TutorStaff({ authUser, userProfile }) {
  const isAdmin = userProfile?.role === "admin";
  const [staff, setStaff] = useState(null);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "tutor" });
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = () => Promise.all([fetchTutors(), fetchAllClasses()])
    .then(([t, c]) => { setStaff(t); setClasses(c); })
    .catch(e => { setError(e.message); setStaff([]); });
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null); setNotice(null);
    try {
      const r = await staffApi("add", form);
      setNotice(r.existing
        ? `${form.name} already had an account for ${form.email}; it now has ${form.role} access${r.emailed ? " and they have been emailed" : ""}.`
        : r.emailed ? `${form.name} has been added. Their login details were emailed to ${form.email}.` : `${form.name} has been added, but the email failed: ${r.emailError}. Use Reset password on the login page to send them a link.`);
      setForm({ name: "", email: "", role: "tutor" });
      await load();
    } catch (err) { setError(err.message); }
    setSaving(false);
  };
  const setRole = async (t, role) => {
    const groupsOf = classes.filter(c => c.tutorId === t.uid).length;
    const msg = role === "free" ? `Take tutor access away from ${t.displayName || t.email}?${groupsOf ? ` They still have ${groupsOf} group${groupsOf === 1 ? "" : "s"}, so reassign those first.` : ""}`
      : role === "admin" ? `Make ${t.displayName || t.email} an admin? Admins see every group, student, payment and tutor.` : `Change ${t.displayName || t.email} to a tutor? They will only see their own groups.`;
    if (!window.confirm(msg)) return;
    setBusy(t.uid); setError(null); setNotice(null);
    try { await staffApi("setRole", { uid: t.uid, role }); await load(); setNotice(role === "free" ? "Access removed." : "Role updated."); }
    catch (err) { setError(err.message); }
    setBusy(null);
  };

  if (!isAdmin) return <Card padding={0}><EmptyState icon="lock" title="Admin only" body="Only an HSJ admin can manage tutors." /></Card>;

  return (
    <>
      <PageHeader eyebrow="Tutors" title="Tutors and admins" sub="Add a tutor here and their account is created and the login emailed. Then create or reassign their groups on the Overview tab." />
      {error && <Notice tone="red" style={{ marginBottom: 12 }}>{error}</Notice>}
      {notice && <Notice tone="green" style={{ marginBottom: 12 }}>{notice}</Notice>}

      <Card style={{ marginBottom: 14 }}>
        <CardHeader title="Add a tutor" sub="If they already log in to the platform with this email, the existing account is upgraded instead." />
        <form onSubmit={add} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginTop: 10 }}>
          <div style={{ ...field, flex: "1 1 200px" }}><label htmlFor="st-name" style={label}>Name</label><Input id="st-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Priya Shah" required /></div>
          <div style={{ ...field, flex: "1 1 240px" }}><label htmlFor="st-email" style={label}>Email</label><Input id="st-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="They log in with this" required /></div>
          <div style={field}><label htmlFor="st-role" style={label}>Role</label>
            <select id="st-role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={selectStyle}>
              <option value="tutor">Tutor (own groups only)</option>
              <option value="admin">Admin (everything)</option>
            </select></div>
          <Button type="submit" variant="accent" disabled={saving || !form.name.trim() || !form.email.trim()}>{saving ? "Adding…" : "Add and email login"}</Button>
        </form>
      </Card>

      <CommunitySettings />

      <Card padding={0}>
        <CardHeader title="Who has access" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
        {staff === null && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
        {staff && staff.length === 0 && <EmptyState icon="users" title="No tutors yet" body="Add the first tutor above." />}
        {staff && staff.length > 0 && (
          <Table minWidth={640}>
            <thead><tr><th style={{ ...th, paddingLeft: 20 }}>Name</th><th style={th}>Role</th><th style={th}>Groups</th><th style={th}>Added</th><th style={{ ...th, paddingRight: 20 }}></th></tr></thead>
            <tbody>
              {staff.map(t => {
                const groups = classes.filter(c => c.tutorId === t.uid);
                const me = t.uid === authUser?.uid;
                return (
                  <tr key={t.uid} style={{ borderTop: `1px solid ${T.line}` }}>
                    <td style={{ ...td, paddingLeft: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={t.displayName} email={t.email} photoURL={t.photoURL} size={30} />
                        <div><div style={{ fontWeight: 700 }}>{t.displayName || t.email}{me ? " (you)" : ""}</div><div style={{ fontSize: 11, color: T.muted }}>{t.email}</div></div>
                      </div>
                    </td>
                    <td style={td}><Chip tone={t.role === "admin" ? "indigo" : "accent"}>{t.role === "admin" ? "Admin" : "Tutor"}</Chip>{t.needsPasswordChange && <Chip tone="amber" style={{ marginLeft: 6 }}>Not logged in yet</Chip>}</td>
                    <td style={{ ...td, color: T.muted }}>{groups.length ? groups.map(g => g.name).join(", ") : "None yet"}</td>
                    <td style={{ ...td, color: T.muted, whiteSpace: "nowrap" }}>{fmtDate(t.staffAddedAt || t.createdAt)}</td>
                    <td style={{ ...td, paddingRight: 20 }}>
                      {!me && (
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          {t.role === "admin" ? <Button size="sm" onClick={() => setRole(t, "tutor")} disabled={busy === t.uid}>Make tutor</Button> : <Button size="sm" onClick={() => setRole(t, "admin")} disabled={busy === t.uid}>Make admin</Button>}
                          <Button size="sm" variant="danger" onClick={() => setRole(t, "free")} disabled={busy === t.uid}>Remove access</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

// The HSJ Discord invite shown to students and parents (settings/community).
function CommunitySettings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    fetchSettings("community").then(d => setForm({ discordInvite: d?.discordInvite || "", discordNote: d?.discordNote || "", hidden: !!d?.hidden }))
      .catch(e => { setForm({ discordInvite: "", discordNote: "", hidden: false }); setMsg({ tone: "red", text: /permission/i.test(e.message) ? "The settings rule is not published yet, so this cannot be read or saved." : e.message }); });
  }, []);
  const save = async (e) => {
    e.preventDefault();
    const link = form.discordInvite.trim();
    if (link && !/^https:\/\/(discord\.gg|discord\.com\/invite)\//.test(link)) { setMsg({ tone: "red", text: "Paste a Discord invite link, like https://discord.gg/abc123" }); return; }
    setSaving(true); setMsg(null);
    try {
      await saveSettings("community", { discordInvite: link, discordNote: form.discordNote.trim(), hidden: !!form.hidden });
      resetCommunityCache();
      setMsg({ tone: "green", text: form.hidden ? "Saved. The Discord card is hidden." : `Saved. Students and parents see the Join the Discord card with ${link || "the built-in link"}, and new welcome emails include it.` });
    } catch (err) { setMsg({ tone: "red", text: /permission/i.test(err.message) ? "The settings rule is not published yet. Publish firestore.rules, then save again." : err.message }); }
    setSaving(false);
  };
  return (
    <Card style={{ marginBottom: 14 }}>
      <CardHeader title="HSJ Discord" sub={`Students see a Join the Discord card on their dashboard and parents on their page, and the link goes into the welcome emails. The built-in invite is ${DEFAULT_DISCORD_INVITE}; paste a new one here if it changes, and make it one that does not expire.`} />
      {msg && <Notice tone={msg.tone} style={{ margin: "10px 0" }}>{msg.text}</Notice>}
      {form && (
        <form onSubmit={save} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginTop: 10 }}>
          <div style={{ ...field, flex: "1 1 260px" }}>
            <label htmlFor="discord-invite" style={label}>Invite link</label>
            <Input id="discord-invite" type="url" value={form.discordInvite} onChange={e => setForm(f => ({ ...f, discordInvite: e.target.value }))} placeholder={DEFAULT_DISCORD_INVITE} />
          </div>
          <div style={{ ...field, flex: "2 1 320px" }}>
            <label htmlFor="discord-note" style={label}>Short note shown on the card (optional)</label>
            <Input id="discord-note" value={form.discordNote} onChange={e => setForm(f => ({ ...f, discordNote: e.target.value }))} placeholder="e.g. Say hello in #introductions and pick your year group role." />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "9px 0" }}>
            <input type="checkbox" checked={form.hidden} onChange={e => setForm(f => ({ ...f, hidden: e.target.checked }))} /> Hide the Discord card
          </label>
          <Button type="submit" variant="accent" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </form>
      )}
    </Card>
  );
}
