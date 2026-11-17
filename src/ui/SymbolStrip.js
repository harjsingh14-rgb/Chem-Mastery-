import React from "react";
import { T } from "./theme";

/**
 * One-tap symbols for typed chemistry answers: the characters a phone or
 * tablet keyboard hides. Inserts at the caret of the textarea in `target`
 * (a ref), then puts the caret back after what was inserted.
 */
export const SYMBOLS = [
  ["×", "multiply"], ["10^", "ten to the power"], ["⁻", "superscript minus"], ["⁺", "superscript plus"],
  ["²", "squared"], ["³", "cubed"], ["⁻¹", "to the minus one"], ["⁻³", "to the minus three"],
  ["₂", "subscript 2"], ["₃", "subscript 3"], ["₄", "subscript 4"],
  ["→", "arrow"], ["⇌", "equilibrium arrows"], ["Δ", "delta"], ["°C", "degrees Celsius"], ["mol dm⁻³", "moles per cubic decimetre"],
];

export const NOTATION_NOTE = "Powers can be typed as 10^-7 or 1.7e-7 and units as mol dm-3; the examiner reads both. For long working, draw on the question or add a photo instead.";

export default function SymbolStrip({ target, value, onChange, disabled, note, style }) {
  const insert = (s) => {
    const el = target?.current;
    const v = value || "";
    const start = el && typeof el.selectionStart === "number" ? el.selectionStart : v.length;
    const end = el && typeof el.selectionEnd === "number" ? el.selectionEnd : start;
    onChange(v.slice(0, start) + s + v.slice(end));
    const caret = start + s.length;
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      try { el.setSelectionRange(caret, caret); } catch { /* not a text control */ }
    });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, maxWidth: "100%", ...style }}>
      {/* minWidth 0: a scroll container still reports its full content width as its minimum inside a flex column, which would widen the page on a phone */}
      <div role="toolbar" aria-label="Insert a symbol" style={{ display: "flex", gap: 4, overflowX: "auto", minWidth: 0, maxWidth: "100%", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
        {SYMBOLS.map(([s, label]) => (
          <button key={s} type="button" disabled={disabled} onClick={() => insert(s)} aria-label={`Insert ${label}`} title={label}
            onPointerDown={e => e.preventDefault()}
            style={{ flexShrink: 0, minWidth: 32, height: 30, padding: "0 8px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink,
              fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", touchAction: "manipulation", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" }}>
            {s}
          </button>
        ))}
      </div>
      {note && <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{note}</span>}
    </div>
  );
}
