import { SELF_EVALUATION } from "../../data/self-evaluation";

export const LEVEL_LABEL = { as: "AS", a2: "A-level" };
// Attempt records key parts by label; an MCQ's single part has label "", which Firestore cannot store as a key.
export const partKey = (label) => (label === "" || label === null || label === undefined) ? "q" : String(label);
export const KIND_LABEL = { mcq: "Multiple choice", structured: "Structured", extended: "Extended response", calculation: "Calculation", practical: "Practical" };

const MONTH = { JAN: "January", JUN: "June", NOV: "November", OCT: "October" };

/** "JUN24" -> "June 2024", "SPEC" -> "Specimen". */
export function seriesLabel(series, year) {
  if (!series) return year ? String(year) : "";
  const s = String(series).toUpperCase();
  if (s === "SPEC") return "Specimen";
  const m = s.match(/^([A-Z]{3})(\d\d)(R?)$/);
  if (m) return `${MONTH[m[1]] || m[1]} 20${m[2]}${m[3] ? " (R)" : ""}`;
  return year ? `${s} ${year}` : s;
}

/** "A-level Paper 2", or for a 2010 to 2016 paper "AS CHEM1 (old spec)". */
export function paperLabel(item) {
  if (item.legacy) return `${LEVEL_LABEL[item.level] || ""} ${item.unit || `Unit ${item.paper}`} (old spec)`.trim();
  return `${LEVEL_LABEL[item.level] || ""} Paper ${item.paper}`.trim();
}

/** Short form for tight lists: "P2" or "CHEM1". */
export function paperShort(item) {
  return item.legacy ? (item.unit || `U${item.paper}`) : `P${item.paper}`;
}

/** Key that keeps an old-spec unit apart from a current paper with the same number. */
export const paperKey = (item) => item.legacy ? `u${item.paper}` : item.paper;

export function qLabel(item) {
  return `Q${item.q}`;
}

/** Flat list of spec topics for a board: [{ ref, title, module, moduleTitle, year }]. */
export function topicsFor(board) {
  const b = SELF_EVALUATION[board];
  if (!b) return [];
  const out = [];
  for (const m of b.modules) for (const st of m.subtopics) out.push({ ref: st.ref, title: st.title, module: m.id, moduleTitle: m.title, year: m.year });
  return out;
}

export function topicTitle(board, ref) {
  const t = topicsFor(board).find(x => x.ref === ref);
  if (!t) return ref;
  return board === "edexcel" ? `Topic ${ref}: ${t.title}` : `${ref} ${t.title}`;
}

/** Short chip text for a topic ref. */
export function topicShort(board, ref) {
  const t = topicsFor(board).find(x => x.ref === ref);
  if (!t) return ref;
  return board === "edexcel" ? `T${ref} ${t.title}` : `${ref} ${t.title}`;
}

/** The student's standing on a question from their ppqAttempts doc. */
export function statusOf(att) {
  if (!att) return "new";
  if (att.best >= att.totalMarks) return "full";
  if (att.best >= Math.ceil(att.totalMarks * 0.7)) return "good";
  return "tried";
}
export const STATUS_LABEL = { new: "Not tried", tried: "Tried", good: "Good", full: "Full marks" };
export const STATUS_TONE = { new: "neutral", tried: "amber", good: "accent", full: "green" };

// The ordered list the student is working through, so the question page can
// offer "Next question" without refetching the index.
const QUEUE_KEY = "hsj-ppq-queue";
export function saveQueue(ids) { try { sessionStorage.setItem(QUEUE_KEY, JSON.stringify(ids)); } catch {} }
export function loadQueue() { try { return JSON.parse(sessionStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; } }

/**
 * Downscale an image file or canvas to a JPEG data URL no larger than `maxEdge`
 * on its long side. Keeps the marking request well inside the upload limit.
 * Returns { mediaType, dataBase64, width, height }.
 */
export async function compressImage(source, maxEdge = 1600, quality = 0.82) {
  const img = source instanceof HTMLCanvasElement ? source : await loadImage(source);
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const dataUrl = c.toDataURL("image/jpeg", quality);
  return { mediaType: "image/jpeg", dataBase64: dataUrl.split(",")[1], width: w, height: h, dataUrl };
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read that image")); };
    img.src = url;
  });
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
