import React from "react";
import { T, pctColour } from "./theme";

// ─── Icons (stroke, 24-box) ─────────────────────────────────────────────
const PATHS = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  check: "M20 6L9 17l-5-5",
  checkSquare: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  flask: "M9 3h6l-1 7 5 9H5l5-9zM8 14h8",
  chart: "M3 3v18h18M7 14l4-4 4 4 5-6",
  video: "M23 7l-7 5 7 5V7zM2 5h14v14H2z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  plus: "M12 5v14M5 12h14",
  chevronDown: "M6 9l6 6 6-6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  play: "M6 4l14 8-14 8z",
  cards: "M2 5h16v13H2zM6 21h14a2 2 0 0 0 2-2V9",
  pencil: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  calculator: "M4 2h16v20H4zM8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h.01M8 18h2M12 18h2M16 18h.01",
  nodes: "M5 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M19 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7 6h10M6 8l5 8M18 8l-5 8",
  arrowCurve: "M4 18c4-10 10-10 16-4M16 11l4 3-1 4",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  copy: "M9 9h11v11H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  x: "M18 6L6 18M6 6l12 12",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  atom: "M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M12 12m-9 0c0-2.5 4-4.5 9-4.5s9 2 9 4.5-4 4.5-9 4.5-9-2-9-4.5zM7.5 4.2c2.2-1.3 5.8 1.3 8.3 5.6s2.9 8.8.7 10.1-5.8-1.3-8.3-5.6-2.9-8.8-.7-10.1zM16.5 4.2c-2.2-1.3-5.8 1.3-8.3 5.6s-2.9 8.8-.7 10.1 5.8-1.3 8.3-5.6 2.9-8.8.7-10.1z",
  flame: "M12 22c4.4 0 7-2.8 7-6.5 0-3-2-5.5-3.5-7.5-.5 2-1.5 3-2.5 3.5 0-3-1.5-6.5-4-8.5 0 3-1.5 5-3 7S4 13.5 4 15.5C4 19.2 7.6 22 12 22z",
  spectrum: "M3 20h18M6 20V8M8 20V12M12 20v-9M16 20V6M18 20v-8",
};

export function Icon({ name, size = 16, color = "currentColor", strokeWidth = 2, style }) {
  const d = PATHS[name] || PATHS.help;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, ...style }}>
      <path d={d} />
    </svg>
  );
}

// ─── Buttons ───────────────────────────────────────────────────────────────
const BTN = {
  primary: { background: T.ink, color: "#fff", border: `1px solid ${T.ink}` },
  accent: { background: T.accent, color: "#fff", border: `1px solid ${T.accent}` },
  secondary: { background: T.card, color: T.ink, border: `1px solid ${T.border}` },
  ghost: { background: "transparent", color: T.muted, border: "1px solid transparent" },
  danger: { background: T.card, color: T.red, border: `1px solid #FECACA` },
};

export function Button({ variant = "secondary", size = "md", icon, iconRight, children, style, disabled, ...rest }) {
  const pad = size === "sm" ? "6px 10px" : size === "lg" ? "12px 20px" : "9px 14px";
  const fs = size === "sm" ? 12 : size === "lg" ? 14 : 13;
  return (
    <button disabled={disabled} {...rest} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: pad, borderRadius: T.radiusSm, fontSize: fs, fontWeight: 600, cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1, lineHeight: 1.2, whiteSpace: "nowrap", ...BTN[variant], ...style,
    }}>
      {icon && <Icon name={icon} size={fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fs + 2} />}
    </button>
  );
}

// ─── Cards ──────────────────────────────────────────────────────────────────
export function Card({ children, style, padding = 20, ...rest }) {
  return (
    <section {...rest} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, padding, boxShadow: T.shadow, ...style }}>
      {children}
    </section>
  );
}

export function CardHeader({ title, sub, right, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", ...style }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <h2 style={{ margin: 0, fontFamily: T.display, fontSize: 17, fontWeight: 700, color: T.ink }}>{title}</h2>
        {sub && <span style={{ fontSize: 12, color: T.muted }}>{sub}</span>}
      </div>
      {right && <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>{right}</div>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 240 }}>
        {eyebrow && <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: 0.6, textTransform: "uppercase" }}>{eyebrow}</span>}
        <h1 style={{ margin: 0, fontFamily: T.display, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: T.ink }}>{title}</h1>
        {sub && <span style={{ color: T.muted, fontSize: 14 }}>{sub}</span>}
      </div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{right}</div>}
    </div>
  );
}

// ─── Small bits ─────────────────────────────────────────────────────────────
export function Chip({ tone = "neutral", children, style }) {
  const tones = {
    neutral: { background: T.soft, color: T.body },
    accent: { background: T.accentTint, color: T.accentText },
    green: { background: T.greenTint, color: T.green },
    amber: { background: T.amberTint, color: T.amber },
    red: { background: T.redTint, color: T.red },
    indigo: { background: T.indigoTint, color: T.indigo },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", ...tones[tone], ...style }}>
      {children}
    </span>
  );
}

export const chipToneForPct = (p) => p === null || p === undefined ? "neutral" : p >= 75 ? "green" : p >= 50 ? "amber" : "red";

export function Bar({ value, colour, height = 6, style }) {
  const v = value === null || value === undefined ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div style={{ height, borderRadius: height / 2, background: T.line, overflow: "hidden", ...style }}>
      <div style={{ width: `${v}%`, height: "100%", background: colour || pctColour(v), borderRadius: height / 2, transition: "width 0.3s" }} />
    </div>
  );
}

export function AccuracyBar({ pct, width = 160 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width }}>
      <Bar value={pct} style={{ flex: 1 }} />
      <span style={{ fontWeight: 600, width: 36, textAlign: "right", color: pct === null || pct === undefined ? T.muted : T.ink }}>{pct === null || pct === undefined ? "–" : `${pct}%`}</span>
    </div>
  );
}

/** A number with a label. `icon` and `tone` add a soft icon tile on the right; `onClick` makes the tile a link. */
export function StatTile({ label, value, sub, subTone, icon, tone = "accent", onClick, children }) {
  const subColour = subTone === "green" ? T.green : subTone === "red" ? T.red : subTone === "amber" ? T.amber : T.muted;
  return (
    <Card padding="18px 20px" className={onClick ? "cm-tile-link" : undefined} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } }) : undefined}
      style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: T.display, fontSize: 30, fontWeight: 800, lineHeight: 1, color: T.ink }}>{value}</span>
        {sub && <span style={{ fontSize: 12, color: subColour, fontWeight: subTone ? 600 : 400 }}>{sub}</span>}
        {children}
      </div>
      {icon && <IconTile name={icon} tone={tone} size={40} />}
    </Card>
  );
}

const AVATAR_TONES = [
  [T.accentTint, T.accentText], [T.indigoTint, T.indigo], [T.greenTint, T.green], [T.amberTint, T.amber],
];
export function Avatar({ name, email, photoURL, size = 36 }) {
  const label = (name || email || "?").trim();
  const initials = label.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  const tone = AVATAR_TONES[(label.charCodeAt(0) || 0) % AVATAR_TONES.length];
  return (
    <div aria-hidden="true" style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: photoURL ? `url(${photoURL}) center/cover` : tone[0], color: tone[1],
      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: Math.round(size * 0.34),
    }}>
      {!photoURL && initials}
    </div>
  );
}

export function IconTile({ name, tone = "accent", size = 36 }) {
  const tones = {
    accent: [T.accentTint, T.accentText], green: [T.greenTint, T.green], amber: [T.amberTint, T.amber],
    red: [T.redTint, T.red], indigo: [T.indigoTint, T.indigo], neutral: [T.soft, T.body],
  };
  const [bg, fg] = tones[tone] || tones.accent;
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name={name} size={Math.round(size / 2)} />
    </div>
  );
}

export function EmptyState({ icon = "help", title, body, action }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <IconTile name={icon} tone="neutral" size={44} />
      <div style={{ fontWeight: 700, fontSize: 15, color: T.ink, marginTop: 4 }}>{title}</div>
      {body && <div style={{ fontSize: 13, color: T.muted, maxWidth: 420, lineHeight: 1.5 }}>{body}</div>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {tabs.map(t => {
        const active = t.id === value;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            padding: "5px 10px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: active ? T.accentTint : "transparent", color: active ? T.accentText : (t.tone === "red" ? T.red : T.muted),
          }}>
            {t.label}{t.count !== undefined ? ` · ${t.count}` : ""}
          </button>
        );
      })}
    </div>
  );
}

// Table primitives: plain markup styled consistently
export const th = { fontWeight: 600, padding: "10px 12px", fontSize: 12, color: T.muted, textAlign: "left", whiteSpace: "nowrap" };
export const td = { padding: "12px 12px", fontSize: 13, color: T.ink, verticalAlign: "middle" };
export function Table({ children, minWidth = 640 }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth }}>{children}</table>
    </div>
  );
}

export function Input(props) {
  return (
    <input {...props} style={{
      padding: "9px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, outline: "none",
      color: T.ink, background: T.card, ...props.style,
    }}
      onFocus={e => { e.target.style.borderColor = T.accent; props.onFocus && props.onFocus(e); }}
      onBlur={e => { e.target.style.borderColor = T.border; props.onBlur && props.onBlur(e); }}
    />
  );
}

export function Notice({ tone = "neutral", children, style }) {
  const tones = {
    neutral: [T.soft, T.body, T.border], green: [T.greenTint, T.green, "#BBF7D0"], amber: [T.amberTint, "#92400E", "#FDE2B5"], red: [T.redTint, T.red, "#FECACA"],
    accent: [T.accentTint, T.accentText, "#B5E0E4"],
  };
  const [bg, fg, bd] = tones[tone];
  return <div style={{ background: bg, color: fg, border: `1px solid ${bd}`, borderRadius: T.radiusSm, padding: "10px 14px", fontSize: 13, lineHeight: 1.5, ...style }}>{children}</div>;
}
