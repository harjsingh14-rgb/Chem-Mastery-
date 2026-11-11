import React, { useState } from "react";
import { Link } from "react-router-dom";
import { T, FONT_LINK, GLOBAL_CSS } from "./theme";
import { Icon, Avatar } from "./components";

/**
 * The one shell every signed-in screen sits in: white top bar with the brand,
 * icon tabs, an optional right-hand slot and the account menu.
 *
 * nav: [{ id, label, to, icon, badge, active }]
 * menu: React node rendered inside the account dropdown
 * focus: true hides the tabs (homework player / flashcard run) and shows `back`
 */
export default function AppShell({ brandSub, nav = [], right, menu, user, children, focus, back, backLabel = "Back", title, subtitle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="cm-shell" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.ink, fontFamily: T.font, fontSize: 14, lineHeight: 1.5 }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{GLOBAL_CSS}</style>

      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 16, minHeight: 62, position: "sticky", top: 0, zIndex: 20 }}>
        {focus && back ? (
          <>
            <button onClick={back} aria-label={backLabel} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, border: `1px solid ${T.border}`, background: T.card, color: T.body, cursor: "pointer" }}>
              <Icon name="arrowLeft" />
            </button>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0 }}>
              <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
              {subtitle && <span style={{ fontSize: 12, color: T.muted }}>{subtitle}</span>}
            </div>
          </>
        ) : (
          <>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: T.ink }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src="/hsj-logo.png" alt="" style={{ height: 28, objectFit: "contain" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>HSJ Tuition</span>
                <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>ChemMastery{brandSub ? ` · ${brandSub}` : ""}</span>
              </div>
            </Link>
            <nav className="cm-nav" style={{ display: "flex", gap: 2, marginLeft: 8, overflowX: "auto" }}>
              {nav.map(item => (
                <Link key={item.id} to={item.to} onClick={item.onClick} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap",
                  background: item.active ? T.accentTint : "transparent", color: item.active ? T.accentText : T.body, fontWeight: item.active ? 600 : 500,
                }}>
                  <Icon name={item.icon} size={16} />
                  <span className="cm-nav-label">{item.label}</span>
                  {item.badge ? <span style={{ padding: "1px 7px", borderRadius: 999, background: T.redTint, color: T.red, fontSize: 11, fontWeight: 700 }}>{item.badge}</span> : null}
                </Link>
              ))}
            </nav>
          </>
        )}

        <div style={{ flex: 1 }} />
        {right}

        {user && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpen(v => !v)} aria-label="Account menu" style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${T.border}`, background: "transparent", padding: 0, cursor: "pointer" }}>
              <Avatar name={user.displayName} email={user.email} photoURL={user.photoURL} size={36} />
            </button>
            {open && (
              <>
                <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                <div style={{ position: "absolute", right: 0, top: 46, background: T.card, borderRadius: T.radius, border: `1px solid ${T.border}`, boxShadow: "0 12px 32px rgba(21,40,58,0.14)", padding: 16, width: 280, zIndex: 100 }}
                  onClick={e => { if (e.target.closest && e.target.closest("[data-close-menu]")) setOpen(false); }}>
                  {menu}
                </div>
              </>
            )}
          </div>
        )}
      </header>

      <main className="cm-page" style={{ flex: 1, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "28px 24px 56px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20 }}>
        {children}
      </main>
    </div>
  );
}

/** A bare, full-width variant for legacy tabs that manage their own padding. */
export function ShellBody({ children, style }) {
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 400, ...style }}>{children}</div>;
}
