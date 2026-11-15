// Year groups: 12, 13 and "resit" (a student who has finished Year 13 and is
// resitting). Mirrors src/data/years.js; keep the two in step.
const YEARS = [12, 13, "resit"];
const normYear = (v) => { if (v === "resit" || v === "Resit") return "resit"; const n = Number(v); return n === 12 || n === 13 ? n : null; };
const yearLabel = (v) => { const y = normYear(v); return y === "resit" ? "Resit" : y ? `Year ${y}` : ""; };
// Resit students have covered the whole course, so they get the A2 treatment
const isA2 = (v) => { const y = normYear(v); return y === 13 || y === "resit"; };
const DIAGNOSTIC_UNIT = { 12: "hsj-diag-y12", 13: "hsj-diag-y13", resit: "hsj-diag-resit" };
const diagnosticUnitFor = (v) => DIAGNOSTIC_UNIT[normYear(v)] || null;
module.exports = { YEARS, normYear, yearLabel, isA2, DIAGNOSTIC_UNIT, diagnosticUnitFor };
