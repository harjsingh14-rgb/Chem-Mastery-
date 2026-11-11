import React, { useState, useEffect } from "react";
import { calendarApi } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, Button, Input, Notice, Icon } from "../ui/components";

// "Add to your calendar": a private feed link that Apple Calendar, Google
// Calendar and Outlook subscribe to. Lessons then appear in the user's own
// calendar and update by themselves when one is moved or cancelled.

const webcalOf = (url) => url.replace(/^https?:\/\//, "webcal://");
const googleOf = (url) => `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalOf(url))}`;

export function CalendarSubscribePanel({ onClose, who = "Your lessons" }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    let alive = true;
    calendarApi("link").then(d => alive && setUrl(d.url)).catch(e => alive && setError(e.message));
    return () => { alive = false; };
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setError("Could not copy. Select the link and copy it yourself."); }
  };
  const reset = async () => {
    setBusy(true); setError(null);
    try { const d = await calendarApi("reset"); setUrl(d.url); setConfirmReset(false); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };

  return (
    <Card style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 }}>
      <CardHeader title="Add to your calendar" sub={`${who} appear in your own calendar app and update by themselves when a lesson is moved or cancelled, with a reminder an hour before.`}
        right={onClose ? <Button variant="ghost" aria-label="Close" onClick={onClose}><Icon name="x" size={16} /></Button> : null} />
      {error && <Notice tone="red">{error}</Notice>}
      {!url && !error && <span style={{ fontSize: 13, color: T.muted }}>Preparing your link…</span>}
      {url && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="primary" icon="calendar" onClick={() => { window.location.href = webcalOf(url); }}>Apple Calendar</Button>
            <Button icon="calendar" onClick={() => window.open(googleOf(url), "_blank", "noopener")}>Google Calendar</Button>
            <Button icon="copy" onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>
            <Button variant="ghost" onClick={() => setShowHelp(h => !h)}>{showHelp ? "Hide instructions" : "Instructions"}</Button>
          </div>
          <Input readOnly value={url} onFocus={e => e.target.select()} aria-label="Calendar link" />
          {showHelp && (
            <div style={{ fontSize: 13, color: T.body, display: "flex", flexDirection: "column", gap: 8, lineHeight: 1.5 }}>
              <div><strong>iPhone or iPad.</strong> Tap Apple Calendar above and choose Subscribe. If nothing opens, copy the link, then go to Settings → Apps → Calendar → Calendar Accounts → Add Account → Other → Add Subscribed Calendar and paste it.</div>
              <div><strong>Mac.</strong> Tap Apple Calendar above, or in the Calendar app choose File → New Calendar Subscription and paste the link. Set Auto-refresh to Every hour.</div>
              <div><strong>Google Calendar.</strong> Tap Google Calendar above on a computer and confirm Add. The Google Calendar app on your phone shows it afterwards (Settings → tick the HSJ calendar). Google refreshes subscribed calendars a few times a day, so a change made today can take some hours to appear there.</div>
              <div><strong>Outlook.</strong> Add calendar → Subscribe from web, paste the link.</div>
              <div style={{ color: T.muted }}>Keep the link private: anyone who has it can see these lesson times. Reset it if you share it by mistake.</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {!confirmReset
              ? <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)} disabled={busy}>Reset link</Button>
              : <>
                <span style={{ fontSize: 12, color: T.muted }}>The old link stops working and you will need to subscribe again.</span>
                <Button size="sm" variant="danger" onClick={reset} disabled={busy}>{busy ? "Resetting…" : "Reset now"}</Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)} disabled={busy}>Keep it</Button>
              </>}
          </div>
        </>
      )}
    </Card>
  );
}

/** A button that opens the panel underneath itself. */
export default function CalendarSubscribe({ who, size = "sm", variant = "secondary" }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div><Button size={size} variant={variant} icon="calendar" onClick={() => setOpen(o => !o)}>{open ? "Hide calendar link" : "Add to your calendar"}</Button></div>
      {open && <CalendarSubscribePanel who={who} onClose={() => setOpen(false)} />}
    </div>
  );
}
