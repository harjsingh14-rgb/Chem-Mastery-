/**
 * Year groups: 12, 13 and "resit" (a student who has finished Year 13 and is
 * resitting the A level). Mirrors api/_years.js; keep the two in step.
 */
export const YEARS = [
  { id: 12, label: "Year 12" },
  { id: 13, label: "Year 13" },
  { id: "resit", label: "Resit" },
];
export const normYear = (v) => { if (v === "resit" || v === "Resit") return "resit"; const n = Number(v); return n === 12 || n === 13 ? n : null; };
export const yearLabel = (v) => { const y = normYear(v); return y === "resit" ? "Resit" : y ? `Year ${y}` : ""; };
export const isA2 = (v) => { const y = normYear(v); return y === 13 || y === "resit"; };
export const DIAGNOSTIC_UNIT = { 12: "hsj-diag-y12", 13: "hsj-diag-y13", resit: "hsj-diag-resit" };
export const diagnosticUnitFor = (v) => DIAGNOSTIC_UNIT[normYear(v)] || null;
