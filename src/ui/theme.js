// Design tokens for the ChemMastery shell. Every new screen reads from here so
// the app stays one system: light canvas, white bordered cards, one accent,
// semantic colours only for status.

export const T = {
  bg: "#F5F7FA",
  card: "#FFFFFF",
  border: "#E3E8EF",
  line: "#EDF0F4",
  soft: "#F1F3F7",
  ink: "#0F1D35",
  body: "#3D4B61",
  muted: "#5B6B82",
  faint: "#B0BAC9",
  accent: "#29ABE2",      // fills, bars, tints
  accentText: "#0B6E9C",  // accent used as text (passes contrast on white)
  accentTint: "#E8F6FC",
  green: "#15803D", greenTint: "#ECFDF3",
  amber: "#B45309", amberTint: "#FFF7E6",
  red: "#B91C1C", redTint: "#FEF2F2",
  indigo: "#4338CA", indigoTint: "#EEF2FF",
  radius: 14,
  radiusSm: 10,
  font: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
  display: "Outfit, Inter, system-ui, sans-serif",
  shadow: "0 1px 2px rgba(15,29,53,0.04)",
};

export const FONT_LINK = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Caveat:wght@600&display=swap";

export const BOARDS = [
  { id: "aqa", label: "AQA", desc: "Year 1 and Year 2. Full spec coverage.", tags: ["Physical", "Inorganic", "Organic", "Required practicals"] },
  { id: "ocr", label: "OCR A", desc: "Modules 2–6 fully covered. Module 1 is PAG practical skills only.", tags: ["Modules 2–6", "Physical", "Organic", "PAG skills"] },
  { id: "edexcel", label: "Edexcel", desc: "Calculations and extended answers now; Edexcel topic banks are being added.", tags: ["Calculations", "AI Examiner", "Topics coming"] },
];
export const BOARD_IDS = BOARDS.map(b => b.id);
export const boardLabel = (id) => (BOARDS.find(b => b.id === id) || BOARDS[0]).label;

// Colour for an accuracy percentage (null = no data)
export const pctColour = (p) => p === null || p === undefined ? T.faint : p >= 75 ? T.green : p >= 50 ? T.amber : T.red;
export const pctTint = (p) => p === null || p === undefined ? T.soft : p >= 75 ? T.greenTint : p >= 50 ? T.amberTint : T.redTint;

export const GLOBAL_CSS = `
  html, body, #root { min-height: 100%; }
  body { margin: 0; background: ${T.bg}; color: ${T.ink}; font-family: ${T.font}; -webkit-font-smoothing: antialiased; }
  .cm-shell button, .cm-shell input, .cm-shell select, .cm-shell textarea { font-family: inherit; }
  .cm-nav a { transition: background 0.15s, color 0.15s; }
  .cm-nav a:hover { background: ${T.soft}; color: ${T.ink}; }
  .cm-row-hover:hover { background: #FAFBFC; }
  .cm-link { color: ${T.accentText}; font-weight: 600; text-decoration: none; }
  .cm-link:hover { text-decoration: underline; }
  .cm-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .cm-grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .cm-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .cm-two-col { display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start; }
  .cm-main-col { flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .cm-side-col { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .cm-card-link { transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s; }
  .cm-card-link:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,29,53,0.08); border-color: #D5DCE6 !important; }
  @media (max-width: 900px) {
    .cm-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .cm-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .cm-nav-label { display: none; }
    .cm-hide-sm { display: none !important; }
  }
  @media (max-width: 560px) {
    .cm-grid-3 { grid-template-columns: 1fr; }
    .cm-grid-2 { grid-template-columns: 1fr; }
    .cm-page { padding: 16px 16px 40px !important; }
  }
`;
