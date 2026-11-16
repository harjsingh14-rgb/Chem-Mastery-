// Turns a list of Firestore attempt documents into the numbers the dashboards
// show. Pure functions, no React.

export const DAY = 24 * 60 * 60 * 1000;
export const attemptTime = (a) => a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.clientTime || 0);
export const pct = (n, d) => d === 0 ? null : Math.round((n / d) * 100);

export function relativeTime(ms) {
  if (!ms) return "never";
  const diff = Date.now() - ms;
  if (diff < 60 * 1000) return "just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / 3600000)} h ago`;
  const d = Math.floor(diff / DAY);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

export const TYPE_LABEL = { mcq: "MCQ", calc: "Calc", extended: "6-mark", quiz: "Quiz", flashcard: "Card", short: "Short" };

/**
 * Summary for one student's attempts. Every percentage is marks scored over
 * marks available (a 1-mark MCQ counts 1, a 21-mark question counts 21), so
 * it agrees with the homework pages. n and c stay as question counts (c =
 * questions counted as right) for the "7 Qs" style figures.
 */
export function summarise(attempts, { minForTopic = 3, weeks = 8 } = {}) {
  const now = Date.now();
  const s = { total: 0, correct: 0, marks: 0, maxMarks: 0, week: 0, weekCorrect: 0, weekMarks: 0, weekMax: 0, month: 0, monthCorrect: 0, monthMarks: 0, monthMax: 0, last: 0, topics: {}, recent: [], weekly: [] };
  const buckets = Array.from({ length: weeks }, () => ({ n: 0, c: 0, m: 0, mx: 0 }));
  for (const a of attempts) {
    const t = attemptTime(a);
    const ok = !!a.correct;
    const mx = Number(a.maxScore) > 0 ? Number(a.maxScore) : 1;
    const m = Math.min(mx, Math.max(0, a.score == null ? (ok ? mx : 0) : Number(a.score) || 0));
    s.total++; if (ok) s.correct++; s.marks += m; s.maxMarks += mx;
    if (t > now - 7 * DAY) { s.week++; if (ok) s.weekCorrect++; s.weekMarks += m; s.weekMax += mx; }
    if (t > now - 30 * DAY) { s.month++; if (ok) s.monthCorrect++; s.monthMarks += m; s.monthMax += mx; }
    if (t > s.last) s.last = t;
    const key = a.topic || "other";
    const tp = s.topics[key] || (s.topics[key] = { key, label: a.topicLabel || key, n: 0, c: 0, m: 0, mx: 0, type: a.type, last: 0 });
    tp.n++; if (ok) tp.c++; tp.m += m; tp.mx += mx; if (t > tp.last) tp.last = t;
    const w = Math.floor((now - t) / (7 * DAY));
    if (w >= 0 && w < weeks) { const b = buckets[weeks - 1 - w]; b.n++; if (ok) b.c++; b.m += m; b.mx += mx; }
    if (s.recent.length < 10) s.recent.push(a);
  }
  const list = Object.values(s.topics).map(t => ({ ...t, pct: pct(t.m, t.mx) }));
  s.topicList = list.sort((a, b) => b.n - a.n);
  const scored = list.filter(t => t.n >= minForTopic);
  s.weak = [...scored].sort((a, b) => a.pct - b.pct).slice(0, 4);
  s.strong = [...scored].filter(t => t.pct >= 70).sort((a, b) => b.pct - a.pct).slice(0, 4);
  s.weekly = buckets.map(b => ({ n: b.n, pct: pct(b.m, b.mx) }));
  s.weekPct = pct(s.weekMarks, s.weekMax);
  s.monthPct = pct(s.monthMarks, s.monthMax);
  s.allPct = pct(s.marks, s.maxMarks);
  // trend: this week vs previous week
  const prev = buckets[weeks - 2], cur = buckets[weeks - 1];
  s.trend = (prev && cur && prev.n >= 3 && cur.n >= 3) ? (pct(cur.m, cur.mx) - pct(prev.m, prev.mx)) : null;
  return s;
}

/** Group a student's attempts by spec section, using a label -> section mapper. */
export function groupBySection(topicList, sectionOf) {
  const groups = {};
  for (const t of topicList) {
    const sec = sectionOf(t) || "Other";
    const g = groups[sec] || (groups[sec] = { label: sec, n: 0, c: 0, m: 0, mx: 0, topics: [] });
    g.n += t.n; g.c += t.c; g.m += t.m || 0; g.mx += t.mx || 0; g.topics.push(t);
  }
  return Object.values(groups).map(g => ({ ...g, pct: pct(g.m, g.mx), topics: g.topics.sort((a, b) => b.n - a.n) })).sort((a, b) => b.n - a.n);
}

/** Flags, summary and display name for one student from their attempts. Used by the Students directory and the Overview. */
export function studentRow(s, sum) {
  const weekPct = sum ? sum.weekPct : null;
  const inactiveDays = sum?.last ? Math.floor((Date.now() - sum.last) / DAY) : null;
  const flags = [];
  if (!sum || inactiveDays === null) flags.push({ tone: "amber", text: "No activity yet" });
  else if (inactiveDays >= 7) flags.push({ tone: "red", text: `Inactive ${inactiveDays} days` });
  if (sum && sum.week >= 5 && weekPct !== null && weekPct < 50) flags.push({ tone: "red", text: `${weekPct}% this week` });
  const weakest = sum?.weak?.find(t => t.pct < 75) || null;
  return { s, sum, weekPct, flags, weakest, name: s.displayName || (s.email ? s.email.split("@")[0] : "Student") };
}
