import React, { useState, useEffect } from "react";
import { fetchSettings } from "../firebase";
import { T } from "../ui/theme";
import { Card, CardHeader, Button, IconTile } from "../ui/components";

// The HSJ Discord: a card inviting students and parents to join. The invite
// link lives in settings/community (set by an admin on the Tutors page), so a
// changed or expired invite needs no deploy. Nothing shows until a link is set.

// Harj's invite, 11 Nov 2026. settings/community can override it (discordInvite) or hide the card (hidden: true).
export const DEFAULT_DISCORD_INVITE = "https://discord.gg/xHfG8PDzaa";

let cached; // undefined = not loaded, null = none
let pending = null;
export function loadCommunity() {
  if (cached !== undefined) return Promise.resolve(cached);
  if (!pending) pending = fetchSettings("community").then(d => { cached = d || null; return cached; }).catch(() => { cached = null; return null; });
  return pending;
}
export const resetCommunityCache = () => { cached = undefined; pending = null; };

export function useCommunity() {
  const [c, setC] = useState(cached);
  useEffect(() => { let alive = true; loadCommunity().then(d => alive && setC(d)); return () => { alive = false; }; }, []);
  return c || null;
}

const COPY = {
  student: {
    title: "Join the HSJ Discord",
    body: "Ask questions between lessons, see announcements and revision tips, and work alongside the other HSJ students. Your tutor is on there too.",
  },
  parent: {
    title: "Parents on the HSJ Discord",
    body: "Announcements, term dates and reminders go out on the HSJ Discord as well as by email. Join to keep in the loop and to message HSJ directly.",
  },
};

export default function CommunityCard({ who = "student", style }) {
  const c = useCommunity();
  if (c?.hidden) return null;
  const invite = c?.discordInvite || DEFAULT_DISCORD_INVITE;
  const copy = COPY[who] || COPY.student;
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12, borderLeft: `4px solid #5865F2`, ...style }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <IconTile name="message" tone="indigo" />
        <div style={{ flex: 1 }}>
          <CardHeader title={copy.title} sub={c?.discordNote || copy.body} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary" icon="message" onClick={() => window.open(invite, "_blank", "noopener")} style={{ background: "#5865F2", borderColor: "#5865F2" }}>Join the Discord</Button>
        <span style={{ fontSize: 12, color: T.muted }}>Opens Discord. Free account needed.</span>
      </div>
    </Card>
  );
}
