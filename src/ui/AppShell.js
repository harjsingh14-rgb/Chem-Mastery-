import React, { useState } from "react";
import { Link } from "react-router-dom";
import { T, FONT_LINK, GLOBAL_CSS } from "./theme";
import { Icon, Avatar } from "./components";

/**
 * The one shell every signed-in screen sits in. On a desktop it is a teal
 * sidebar with the brand and the navigation, a slim white top bar with the
 * page actions and the account menu, and the page body. On a phone the
 * sidebar folds into icon tabs in the top bar.
 *
 * nav: [{ id, label, to, icon, badge, active }]
 * menu: React node rendered inside the account dropdown
 * focus: true hides the navigation (homework player / flashcard run) and shows `back`
 */
export default function AppShell({ brandSub, nav = [], right, menu, user, children, focus, back, backLabel = "Back", title, subtitle }) {
  const [open, setOpen] = useState(false);

  const brand = (
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit", minWidth: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
        <img src="/hsj-logo.png" alt="" style={{ height: 28, objectFit: "contain" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 16, letterSpacing: -0.2, whiteSpace: "nowrap" }}>HSJ Tuition</span>
        <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500, whiteSpace: "nowrap" }}>ChemMastery{brandSub ? ` · ${brandSub}` : ""}</span>
      </div>
    </Link>
  );

  const account = user && (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} aria-label="Account menu" style={{ display: "flex", alignItems: "center", gap: 10, padding: "3px 3px 3px 3px", borderRadius: 999, border: `1px solid ${T.border}`, background: T.card, cursor: "pointer" }}>
        <Avatar name={user.displayName} email={user.email} photoURL={user.photoURL} size={32} />
        <span className="cm-hide-sm" style={{ fontSize: 13, fontWeight: 600, color: T.ink, paddingRight: 10, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName || user.email}</span>
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
  );

  if (focus) {
    return (
      <div className="cm-shell" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.ink, fontFamily: T.font, fontSize: 14, lineHeight: 1.5 }}>
        <link href={FONT_LINK} rel="stylesheet" />
        <style>{GLOBAL_CSS}</style>
        <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 16, minHeight: 62, position: "sticky", top: 0, zIndex: 20 }}>
          {back && (
            <button onClick={back} aria-label={backLabel} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, border: `1px solid ${T.border}`, background: T.card, color: T.body, cursor: "pointer" }}>
              <Icon name="arrowLeft" />
            </button>
          )}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0 }}>
            <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
            {subtitle && <span style={{ fontSize: 12, color: T.muted }}>{subtitle}</span>}
          </div>
          <div style={{ flex: 1 }} />
          {right}
          {account}
        </header>
        <main className="cm-page" style={{ flex: 1, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "28px 24px 56px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20 }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="cm-shell" style={{ minHeight: "100vh", display: "flex", background: T.bg, color: T.ink, fontFamily: T.font, fontSize: 14, lineHeight: 1.5 }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{GLOBAL_CSS}</style>

      <aside className="cm-sidebar cm-side" style={{ width: 232, flexShrink: 0, background: T.brand, color: "#fff", flexDirection: "column", position: "sticky", top: 0, height: "100vh", boxSizing: "border-box", padding: "18px 14px" }}>
        <div style={{ padding: "2px 6px 18px" }}>{brand}</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(item => (
            <Link key={item.id} to={item.to} onClick={item.onClick} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, textDecoration: "none",
              background: item.active ? "rgba(255,255,255,0.18)" : "transparent", color: "#fff", fontWeight: item.active ? 700 : 500, fontSize: 14,
            }}>
              <Icon name={item.icon} size={17} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? <span style={{ padding: "1px 7px", borderRadius: 999, background: "#fff", color: T.brand, fontSize: 11, fontWeight: 700 }}>{item.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, opacity: 0.7, padding: "0 12px" }}>HSJ Tuition · ChemMastery</div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 14, minHeight: 60, position: "sticky", top: 0, zIndex: 20 }}>
          <div className="cm-topnav" style={{ alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
            <div style={{ color: T.ink }}>{brand}</div>
            <nav className="cm-nav" style={{ display: "flex", gap: 2, marginLeft: 4, overflowX: "auto" }}>
              {nav.map(item => (
                <Link key={item.id} to={item.to} onClick={item.onClick} aria-label={item.label} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap",
                  background: item.active ? T.accentTint : "transparent", color: item.active ? T.accentText : T.body, fontWeight: item.active ? 600 : 500,
                }}>
                  <Icon name={item.icon} size={16} />
                  <span className="cm-nav-label">{item.label}</span>
                  {item.badge ? <span style={{ padding: "1px 7px", borderRadius: 999, background: T.redTint, color: T.red, fontSize: 11, fontWeight: 700 }}>{item.badge}</span> : null}
                </Link>
              ))}
            </nav>
          </div>
          <div style={{ flex: 1 }} />
          {right}
          {account}
        </header>
        <main className="cm-page" style={{ flex: 1, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "28px 28px 56px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

/** A bare, full-width variant for legacy tabs that manage their own padding. */
export function ShellBody({ children, style }) {
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 400, ...style }}>{children}</div>;
}
