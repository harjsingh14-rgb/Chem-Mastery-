import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../ui/theme";
import { Button, Card, Chip, Notice, EmptyState, Icon, Input, Bar } from "../../ui/components";
import usePpq from "../../hooks/usePpq";
import track from "../../utils/track";
import chemFormat from "../../utils/chemFormat";
import { KIND_LABEL, seriesLabel, paperLabel, paperKey, topicsFor, topicShort, statusOf, STATUS_LABEL, STATUS_TONE, saveQueue, shuffle } from "./ppqUtils";
import { PRACTICE_MODULES } from "../PracticeGrid";

const FILTER_KEY = "hsj-ppq-filters";
const DEFAULT_FILTERS = { level: "all", topics: [], papers: [], series: [], kinds: [], status: "all", search: "" };
const MODES = [["topic", "By topic"], ["paper", "Full papers"], ["mixed", "Mixed practice"]];

function loadPrefs(board) {
  try { const all = JSON.parse(localStorage.getItem(FILTER_KEY) || "{}"); const p = all[board] || {}; return { filters: { ...DEFAULT_FILTERS, ...(p.filters || p) }, mode: MODES.some(m => m[0] === p.mode) ? p.mode : "topic", level: ["all", "as", "a2"].includes(p.level) ? p.level : "all" }; }
  catch { return { filters: DEFAULT_FILTERS, mode: "topic", level: "all" }; }
}
function storePrefs(board, prefs) {
  try { const all = JSON.parse(localStorage.getItem(FILTER_KEY) || "{}"); all[board] = prefs; localStorage.setItem(FILTER_KEY, JSON.stringify(all)); } catch {}
}

const toggleIn = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
const newestFirst = (a, b) => (b.year - a.year) || String(b.series).localeCompare(String(a.series)) || (a.level === b.level ? 0 : a.level === "as" ? -1 : 1) || (a.paper - b.paper) || (a.q - b.q);
const eyebrow = { fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 };

/**
 * Every past-paper question for the board, three ways in:
 *   By topic        spec folders, each topic opens to its questions
 *   Full papers     a whole paper worked through in order
 *   Mixed practice  filters, search, and a shuffled run across the bank
 */
export default function PastPaperBrowser({ board, authUser, hasFullAccess }) {
  const navigate = useNavigate();
  const { items, attempts, loading, error } = usePpq(board, authUser?.uid);
  const [prefs, setPrefs] = useState(() => loadPrefs(board));
  useEffect(() => { setPrefs(loadPrefs(board)); }, [board]);
  useEffect(() => { storePrefs(board, prefs); }, [board, prefs]);
  const { mode, level } = prefs;
  const showLegacy = prefs.legacy !== false;   // 2010 to 2016 papers are in unless the student switches them off
  const setMode = (m) => setPrefs(p => ({ ...p, mode: m }));
  const setLevel = (l) => setPrefs(p => ({ ...p, level: l }));
  const setF = (fn) => setPrefs(p => ({ ...p, filters: typeof fn === "function" ? fn(p.filters) : fn }));

  const hasLegacy = useMemo(() => items.some(i => i.legacy), [items]);
  const levelled = useMemo(() => items.filter(i => (level === "all" || i.level === level) && (showLegacy || !i.legacy)), [items, level, showLegacy]);

  const open = (id, list) => {
    saveQueue(list.map(i => i.id));
    track("ppq_open", { board, qid: id, mode });
    navigate(`/${board}/practise/${id}`);
  };
  const start = (list, shuffled) => {
    if (!list.length) return;
    const l = shuffled ? shuffle(list) : list;
    open(l[0].id, l);
  };

  if (!hasFullAccess) return (
    <Notice tone="amber"><b>Past papers are for HSJ students.</b> Every question from every AQA, OCR A and Edexcel paper, marked by the AI examiner against the real mark scheme. If you are an HSJ student, log in with the email your welcome email was sent to.</Notice>
  );

  const seg = (options, value, onChange) => (
    <div style={{ display: "flex", gap: 2, background: T.soft, padding: 3, borderRadius: 10 }}>
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: value === v ? T.card : "transparent", color: value === v ? T.ink : T.muted, boxShadow: value === v ? T.shadow : "none" }}>{l}</button>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <Notice tone="red">{error}</Notice>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {seg(MODES, mode, setMode)}
        {seg([["all", "AS + A-level"], ["as", "AS"], ["a2", "A-level"]], level, setLevel)}
        {hasLegacy && (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: T.body, cursor: "pointer" }} title="Papers from the specification examined 2010 to 2016. The chemistry is the same where it is still on your course; the paper layout and some question styles differ.">
            <input type="checkbox" checked={showLegacy} onChange={e => setPrefs(p => ({ ...p, legacy: e.target.checked }))} />
            Include old-spec papers (2010 to 2016)
          </label>
        )}
        <span style={{ fontSize: 12, color: T.muted, marginLeft: "auto" }}>
          {loading ? "Loading past papers…" : <>{levelled.length} questions{Object.keys(attempts).length > 0 && <> · {levelled.filter(i => statusOf(attempts[i.id]) !== "new").length} tried</>}</>}
        </span>
      </div>

      {!loading && items.length === 0 && !error && (
        <EmptyState icon="book" title="Past papers are being prepared" body="The question bank for this board is still being indexed. Check back shortly." />
      )}

      {items.length > 0 && mode === "topic" && <TopicFolders board={board} items={levelled} attempts={attempts} onOpen={open} onStart={start} />}
      {items.length > 0 && mode === "paper" && <PaperFolders items={levelled} attempts={attempts} onOpen={open} onStart={start} />}
      {items.length > 0 && mode === "mixed" && <MixedPractice board={board} items={levelled} attempts={attempts} f={prefs.filters} setF={setF} onOpen={open} onStart={start} />}

      {/* The older practice modules stay reachable while their future is decided */}
      <div style={{ marginTop: 12 }}>
        <div style={{ ...eyebrow, marginBottom: 8 }}>Other practice</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRACTICE_MODULES.filter(m => !["mechanisms", "nmr"].includes(m.id)).map(m => (
            <Button key={m.id} size="sm" icon={m.icon} onClick={() => { navigate(`/${board}/${m.id}`); track("open_section", { section: m.id, board }); }}>{m.label}</Button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────── By topic: module folders → topic folders → questions ───────────── */

function TopicFolders({ board, items, attempts, onOpen, onStart }) {
  const topics = useMemo(() => topicsFor(board), [board]);
  const [openModules, setOpenModules] = useState({});
  const [openTopic, setOpenTopic] = useState(null);

  const modules = useMemo(() => {
    const byRef = {};
    for (const i of items) for (const t of (i.topics || [])) (byRef[t] = byRef[t] || []).push(i);
    const m = new Map();
    for (const t of topics) {
      if (!m.has(t.module)) m.set(t.module, { id: t.module, title: t.moduleTitle, year: t.year, topics: [], n: 0, tried: 0, full: 0 });
      const list = (byRef[t.ref] || []).slice().sort(newestFirst);
      const tried = list.filter(i => statusOf(attempts[i.id]) !== "new").length;
      const full = list.filter(i => statusOf(attempts[i.id]) === "full").length;
      const mod = m.get(t.module);
      mod.topics.push({ ...t, list, n: list.length, tried, full });
      mod.n += list.length; mod.tried += tried; mod.full += full;
    }
    return [...m.values()].filter(x => x.n > 0);
  }, [topics, items, attempts]);

  if (modules.length === 0) return <EmptyState icon="search" title="No questions at this level" body="Switch to AS + A-level to see everything." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {modules.map(mod => {
        const isOpen = openModules[mod.id] ?? false;
        return (
          <Card key={mod.id} padding={0}>
            <button type="button" onClick={() => setOpenModules(o => ({ ...o, [mod.id]: !isOpen }))} className="cm-row-hover" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", color: T.ink }}>
              <Icon name="chevronDown" size={16} color={T.muted} style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
              <Icon name="book" size={18} color={T.accentText} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontFamily: T.display, fontSize: 15 }}>{mod.title}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Year {mod.year} · {mod.topics.filter(t => t.n > 0).length} topics · {mod.n} questions{mod.tried > 0 && ` · ${mod.tried} tried`}</div>
              </div>
              <div className="cm-hide-sm" style={{ width: 120, flexShrink: 0 }}><Bar value={mod.n ? (mod.tried / mod.n) * 100 : 0} colour={T.accent} /></div>
            </button>
            {isOpen && (
              <div style={{ borderTop: `1px solid ${T.line}` }}>
                {mod.topics.filter(t => t.n > 0).map(t => {
                  const tOpen = openTopic === t.ref;
                  return (
                    <div key={t.ref} style={{ borderBottom: `1px solid ${T.line}` }}>
                      <div className="cm-row-hover" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px 10px 44px", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => setOpenTopic(tOpen ? null : t.ref)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 200, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", color: T.ink }}>
                          <Icon name="chevronDown" size={14} color={T.muted} style={{ transform: tOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, fontSize: 14 }}><span style={{ color: T.muted, fontWeight: 600 }}>{board === "edexcel" ? `Topic ${t.ref}` : t.ref}</span> {t.title}</span>
                        </button>
                        <span style={{ fontSize: 12, color: T.muted }}>{t.n} question{t.n === 1 ? "" : "s"}{t.tried > 0 && ` · ${t.tried} tried`}{t.full > 0 && ` · ${t.full} full marks`}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Button size="sm" variant="ghost" onClick={() => onStart(t.list, true)}>Shuffle</Button>
                          <Button size="sm" iconRight="arrowRight" onClick={() => onStart(t.list, false)}>Start</Button>
                        </div>
                      </div>
                      {tOpen && (
                        <div style={{ background: T.soft, padding: "6px 0" }}>
                          {t.list.map(i => <QuestionRow key={i.id} item={i} board={board} att={attempts[i.id]} onOpen={() => onOpen(i.id, t.list)} compact indent />)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ───────────── Full papers: series folders → papers ───────────── */

function PaperFolders({ items, attempts, onOpen, onStart }) {
  const [openSeries, setOpenSeries] = useState({});
  const [openPaper, setOpenPaper] = useState(null);

  const groups = useMemo(() => {
    const bySeries = new Map();
    for (const i of items) {
      if (!bySeries.has(i.series)) bySeries.set(i.series, { series: i.series, year: i.year || 0, papers: new Map() });
      const s = bySeries.get(i.series);
      const key = `${i.level}-${paperKey(i)}`;
      if (!s.papers.has(key)) s.papers.set(key, { key, level: i.level, paper: i.paper, legacy: !!i.legacy, unit: i.unit, series: i.series, year: i.year, items: [] });
      s.papers.get(key).items.push(i);
    }
    return [...bySeries.values()]
      .sort((a, b) => (b.year - a.year) || String(a.series).localeCompare(String(b.series)))
      .map(s => ({ ...s, papers: [...s.papers.values()].sort((a, b) => (a.level === b.level ? 0 : a.level === "as" ? -1 : 1) || ((a.legacy ? 1 : 0) - (b.legacy ? 1 : 0)) || (a.paper - b.paper)).map(p => ({ ...p, items: p.items.sort((a, b) => a.q - b.q) })) }));
  }, [items]);

  if (groups.length === 0) return <EmptyState icon="search" title="No papers at this level" body="Switch to AS + A-level to see everything." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Notice tone="accent">Work through a whole paper in order, the way you would in the exam. Each question is marked as you go and your best mark per question is kept.</Notice>
      {groups.map((s, idx) => {
        const isOpen = openSeries[s.series] ?? idx === 0;
        const n = s.papers.reduce((a, p) => a + p.items.length, 0);
        const tried = s.papers.reduce((a, p) => a + p.items.filter(i => statusOf(attempts[i.id]) !== "new").length, 0);
        return (
          <Card key={s.series} padding={0}>
            <button type="button" onClick={() => setOpenSeries(o => ({ ...o, [s.series]: !isOpen }))} className="cm-row-hover" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", color: T.ink }}>
              <Icon name="chevronDown" size={16} color={T.muted} style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
              <Icon name="calendar" size={18} color={T.accentText} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontFamily: T.display, fontSize: 15 }}>{seriesLabel(s.series, s.year)}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{s.papers.length} paper{s.papers.length === 1 ? "" : "s"} · {n} questions{tried > 0 && ` · ${tried} tried`}</div>
              </div>
            </button>
            {isOpen && (
              <div style={{ borderTop: `1px solid ${T.line}` }}>
                {s.papers.map(p => {
                  const pOpen = openPaper === `${s.series}|${p.key}`;
                  const marks = p.items.reduce((a, i) => a + (i.totalMarks || 0), 0);
                  const pTried = p.items.filter(i => statusOf(attempts[i.id]) !== "new").length;
                  const best = p.items.reduce((a, i) => a + (attempts[i.id]?.best || 0), 0);
                  return (
                    <div key={p.key} style={{ borderBottom: `1px solid ${T.line}` }}>
                      <div className="cm-row-hover" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px 10px 44px", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => setOpenPaper(pOpen ? null : `${s.series}|${p.key}`)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 200, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", color: T.ink }}>
                          <Icon name="chevronDown" size={14} color={T.muted} style={{ transform: pOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{paperLabel(p)}</span>
                        </button>
                        <span style={{ fontSize: 12, color: T.muted }}>{p.items.length} questions · {marks} marks{pTried > 0 && ` · ${best}/${marks} so far`}</span>
                        {pTried > 0 && <Chip tone={pTried === p.items.length ? "green" : "amber"}>{pTried}/{p.items.length} done</Chip>}
                        <Button size="sm" iconRight="arrowRight" onClick={() => onStart(p.items, false)}>{pTried > 0 ? "Continue" : "Start paper"}</Button>
                      </div>
                      {pOpen && (
                        <div style={{ background: T.soft, padding: "6px 0" }}>
                          {p.items.map(i => <QuestionRow key={i.id} item={i} board={i.board} att={attempts[i.id]} onOpen={() => onOpen(i.id, p.items)} compact indent />)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ───────────── Mixed practice: filters, search, shuffled runs ───────────── */

function MixedPractice({ board, items, attempts, f, setF, onOpen, onStart }) {
  const [showTopics, setShowTopics] = useState(false);
  const topics = useMemo(() => topicsFor(board), [board]);
  const papers = useMemo(() => {
    const seen = new Map();
    for (const i of items) if (!seen.has(paperKey(i))) seen.set(paperKey(i), { key: paperKey(i), label: i.legacy ? `${i.unit || `Unit ${i.paper}`} (old spec)` : `Paper ${i.paper}`, legacy: !!i.legacy, paper: i.paper });
    return [...seen.values()].sort((a, b) => ((a.legacy ? 1 : 0) - (b.legacy ? 1 : 0)) || (a.paper - b.paper));
  }, [items]);
  const seriesList = useMemo(() => {
    const seen = new Map();
    for (const i of items) if (!seen.has(i.series)) seen.set(i.series, i.year || 0);
    return [...seen.entries()].sort((a, b) => (b[1] - a[1]) || String(a[0]).localeCompare(String(b[0]))).map(e => e[0]);
  }, [items]);
  const kinds = useMemo(() => [...new Set(items.map(i => i.kind).filter(Boolean))], [items]);
  const topicCounts = useMemo(() => {
    const c = {};
    for (const i of items) for (const t of (i.topics || [])) c[t] = (c[t] || 0) + 1;
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const s = f.search.trim().toLowerCase();
    return items.filter(i => {
      if (f.papers.length && !f.papers.includes(paperKey(i))) return false;
      if (f.series.length && !f.series.includes(i.series)) return false;
      if (f.kinds.length && !f.kinds.includes(i.kind)) return false;
      if (f.topics.length && !(i.topics || []).some(t => f.topics.includes(t))) return false;
      if (f.status !== "all") {
        const st = statusOf(attempts[i.id]);
        if (f.status === "new" && st !== "new") return false;
        if (f.status === "tried" && (st === "new" || st === "full")) return false;
        if (f.status === "full" && st !== "full") return false;
      }
      if (s) {
        const hay = `${i.title || ""} ${(i.topics || []).map(t => topicShort(board, t)).join(" ")} ${seriesLabel(i.series, i.year)} paper ${i.paper} ${i.unit || ""} ${i.legacy ? "old spec legacy" : ""} q${i.q}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    }).sort(newestFirst);
  }, [items, f, attempts, board]);

  const totalMarks = filtered.reduce((s, i) => s + (i.totalMarks || 0), 0);
  const doneCount = filtered.filter(i => statusOf(attempts[i.id]) !== "new").length;
  const activeFilters = f.topics.length + f.papers.length + f.series.length + f.kinds.length + (f.status !== "all" ? 1 : 0);

  const chipBtn = (on, onClick, children, key) => (
    <button key={key} type="button" onClick={onClick} style={{
      padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
      border: `1px solid ${on ? T.ink : T.border}`, background: on ? T.ink : T.card, color: on ? "#fff" : T.body,
    }}>{children}</button>
  );

  return (
    <>
      <Card padding={16} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input value={f.search} onChange={e => setF(x => ({ ...x, search: e.target.value }))} placeholder="Search by topic, keyword, paper or year" aria-label="Search questions" />
          </div>
          {activeFilters > 0 && <Button size="sm" variant="ghost" icon="x" onClick={() => setF({ ...DEFAULT_FILTERS, search: f.search })}>Clear {activeFilters} filter{activeFilters === 1 ? "" : "s"}</Button>}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ ...eyebrow, marginRight: 4 }}>Paper</span>
          {papers.map(p => chipBtn(f.papers.includes(p.key), () => setF(x => ({ ...x, papers: toggleIn(x.papers, p.key) })), p.label, `p${p.key}`))}
          <span style={{ width: 1, height: 18, background: T.border, margin: "0 6px" }} />
          <span style={{ ...eyebrow, marginRight: 4 }}>Type</span>
          {kinds.map(k => chipBtn(f.kinds.includes(k), () => setF(x => ({ ...x, kinds: toggleIn(x.kinds, k) })), KIND_LABEL[k] || k, `k${k}`))}
          <span style={{ width: 1, height: 18, background: T.border, margin: "0 6px" }} />
          <span style={{ ...eyebrow, marginRight: 4 }}>Progress</span>
          {[["all", "Any"], ["new", "Not tried"], ["tried", "Needs another go"], ["full", "Full marks"]].map(([v, l]) => chipBtn(f.status === v, () => setF(x => ({ ...x, status: v })), l, `s${v}`))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ ...eyebrow, marginRight: 4 }}>Series</span>
          {seriesList.map(s => chipBtn(f.series.includes(s), () => setF(x => ({ ...x, series: toggleIn(x.series, s) })), seriesLabel(s), `se${s}`))}
        </div>

        <div>
          <button type="button" onClick={() => setShowTopics(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, cursor: "pointer", color: T.ink, fontSize: 13, fontWeight: 600 }}>
            <Icon name="chevronDown" size={14} style={{ transform: showTopics ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            Topics {f.topics.length > 0 && <Chip tone="accent">{f.topics.length} selected</Chip>}
          </button>
          {!showTopics && f.topics.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {f.topics.map(t => chipBtn(true, () => setF(x => ({ ...x, topics: toggleIn(x.topics, t) })), <>{topicShort(board, t)} <span style={{ opacity: 0.7 }}>×</span></>, `t${t}`))}
            </div>
          )}
          {showTopics && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {groupModules(topics).map(m => (
                <div key={m.id}>
                  <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 6 }}>{m.title}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {m.topics.map(t => {
                      const n = topicCounts[t.ref] || 0;
                      return (
                        <button key={t.ref} type="button" disabled={n === 0} onClick={() => setF(x => ({ ...x, topics: toggleIn(x.topics, t.ref) }))} style={{
                          padding: "5px 10px", borderRadius: 999, fontSize: 12, cursor: n === 0 ? "default" : "pointer", opacity: n === 0 ? 0.4 : 1,
                          border: `1px solid ${f.topics.includes(t.ref) ? T.ink : T.border}`, background: f.topics.includes(t.ref) ? T.ink : T.card, color: f.topics.includes(t.ref) ? "#fff" : T.body,
                        }}>
                          <b style={{ fontWeight: 600 }}>{board === "edexcel" ? `Topic ${t.ref}` : t.ref}</b> {t.title} <span style={{ opacity: 0.6 }}>{n}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: T.body }}>
          <b style={{ color: T.ink }}>{filtered.length}</b> question{filtered.length === 1 ? "" : "s"} · {totalMarks} marks{doneCount > 0 && <> · {doneCount} tried</>}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => onStart(filtered, true)} disabled={filtered.length === 0}>Shuffle</Button>
          <Button size="sm" variant="primary" iconRight="arrowRight" onClick={() => onStart(filtered, false)} disabled={filtered.length === 0}>Start</Button>
        </div>
      </div>

      {filtered.length === 0 && (
        <EmptyState icon="search" title="No questions match" body="Loosen a filter or clear the search." action={<Button size="sm" onClick={() => setF(DEFAULT_FILTERS)}>Clear filters</Button>} />
      )}
      {filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(i => <QuestionRow key={i.id} item={i} board={board} att={attempts[i.id]} onOpen={() => onOpen(i.id, filtered)} />)}
        </div>
      )}
    </>
  );
}

function groupModules(topics) {
  const m = new Map();
  for (const t of topics) {
    if (!m.has(t.module)) m.set(t.module, { id: t.module, title: t.moduleTitle, topics: [] });
    m.get(t.module).topics.push(t);
  }
  return [...m.values()];
}

function QuestionRow({ item, board, att, onOpen, compact, indent }) {
  const st = statusOf(att);
  return (
    <button type="button" onClick={onOpen} className="cm-row-hover" style={{
      display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", cursor: "pointer", color: T.ink,
      padding: compact ? `8px 16px 8px ${indent ? 60 : 16}px` : "12px 16px", background: compact ? "transparent" : T.card,
      border: compact ? "none" : `1px solid ${T.border}`, borderRadius: compact ? 0 : T.radiusSm,
    }}>
      <div style={{ width: compact ? 38 : 44, height: compact ? 38 : 44, borderRadius: 10, background: st === "full" ? T.greenTint : st === "new" ? T.card : T.amberTint, border: st === "new" ? `1px solid ${T.border}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: T.muted, fontWeight: 600, lineHeight: 1 }}>Q</span>
        <span style={{ fontSize: compact ? 14 : 16, fontWeight: 800, fontFamily: T.display, lineHeight: 1.1 }}>{item.q}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontWeight: 600, fontSize: compact ? 13 : 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chemFormat(item.title) || `Question ${item.q}`}</div>
        <div style={{ fontSize: 12, color: T.muted, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span>{paperLabel(item)} · {seriesLabel(item.series, item.year)}</span>
          <span>·</span>
          <span>{item.totalMarks} mark{item.totalMarks === 1 ? "" : "s"}</span>
          {item.kind && item.kind !== "structured" && <><span>·</span><span>{KIND_LABEL[item.kind] || item.kind}</span></>}
          {!compact && (
            <span className="cm-hide-sm" style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {(item.topics || []).slice(0, 3).map(t => <Chip key={t} tone="neutral" style={{ fontSize: 10, padding: "1px 7px" }}>{topicShort(board, t)}</Chip>)}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {att ? <Chip tone={STATUS_TONE[st]}>{att.best}/{att.totalMarks}</Chip> : <Chip tone="neutral" style={{ opacity: 0.7 }}>{STATUS_LABEL.new}</Chip>}
        <Icon name="arrowRight" size={16} color={T.faint} />
      </div>
    </button>
  );
}
