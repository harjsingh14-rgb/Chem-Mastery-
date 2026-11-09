import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../ui/theme";
import { Button, Card, Chip, Notice, EmptyState, Icon, Input } from "../../ui/components";
import usePpq from "../../hooks/usePpq";
import track from "../../utils/track";
import { LEVEL_LABEL, KIND_LABEL, seriesLabel, topicsFor, topicShort, statusOf, STATUS_LABEL, STATUS_TONE, saveQueue, shuffle } from "./ppqUtils";
import { PRACTICE_MODULES } from "../PracticeGrid";

const FILTER_KEY = "hsj-ppq-filters";
const DEFAULT_FILTERS = { level: "all", topics: [], papers: [], series: [], kinds: [], status: "all", search: "" };

function loadFilters(board) {
  try { const all = JSON.parse(localStorage.getItem(FILTER_KEY) || "{}"); return { ...DEFAULT_FILTERS, ...(all[board] || {}) }; } catch { return DEFAULT_FILTERS; }
}
function storeFilters(board, f) {
  try { const all = JSON.parse(localStorage.getItem(FILTER_KEY) || "{}"); all[board] = f; localStorage.setItem(FILTER_KEY, JSON.stringify(all)); } catch {}
}

const toggleIn = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

/**
 * Every past-paper question for the board, as a filterable list. Students
 * narrow by level, topic, paper, series, question type and their own progress,
 * then open a question or work through the list in order or shuffled.
 */
export default function PastPaperBrowser({ board, authUser, hasFullAccess }) {
  const navigate = useNavigate();
  const { items, attempts, loading, error } = usePpq(board, authUser?.uid);
  const [f, setF] = useState(() => loadFilters(board));
  const [group, setGroup] = useState("question");     // "question" | "paper"
  const [showTopics, setShowTopics] = useState(false);
  useEffect(() => { setF(loadFilters(board)); }, [board]);
  useEffect(() => { storeFilters(board, f); }, [board, f]);

  const topics = useMemo(() => topicsFor(board), [board]);
  const papers = useMemo(() => [...new Set(items.map(i => i.paper))].sort(), [items]);
  const seriesList = useMemo(() => {
    const seen = new Map();
    for (const i of items) if (!seen.has(i.series)) seen.set(i.series, i.year || 0);
    return [...seen.entries()].sort((a, b) => (b[1] - a[1]) || String(a[0]).localeCompare(String(b[0]))).map(e => e[0]);
  }, [items]);
  const kinds = useMemo(() => [...new Set(items.map(i => i.kind).filter(Boolean))], [items]);

  // Which topics actually have questions, with counts, so the picker is not a wall of empty refs
  const topicCounts = useMemo(() => {
    const c = {};
    for (const i of items) for (const t of (i.topics || [])) c[t] = (c[t] || 0) + 1;
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const s = f.search.trim().toLowerCase();
    return items.filter(i => {
      if (f.level !== "all" && i.level !== f.level) return false;
      if (f.papers.length && !f.papers.includes(i.paper)) return false;
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
        const hay = `${i.title || ""} ${(i.topics || []).map(t => topicShort(board, t)).join(" ")} ${seriesLabel(i.series, i.year)} paper ${i.paper} q${i.q}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    }).sort((a, b) => (b.year - a.year) || String(b.series).localeCompare(String(a.series)) || (a.level === b.level ? 0 : a.level === "as" ? -1 : 1) || (a.paper - b.paper) || (a.q - b.q));
  }, [items, f, attempts, board]);

  const totalMarks = filtered.reduce((s, i) => s + (i.totalMarks || 0), 0);
  const doneCount = filtered.filter(i => statusOf(attempts[i.id]) !== "new").length;
  const activeFilters = (f.level !== "all" ? 1 : 0) + f.topics.length + f.papers.length + f.series.length + f.kinds.length + (f.status !== "all" ? 1 : 0);

  const open = (id, list) => {
    saveQueue((list || filtered).map(i => i.id));
    track("ppq_open", { board, qid: id });
    navigate(`/${board}/practise/${id}`);
  };
  const start = (shuffled) => {
    if (filtered.length === 0) return;
    const list = shuffled ? shuffle(filtered) : filtered;
    open(list[0].id, list);
  };

  const byPaper = useMemo(() => {
    const m = new Map();
    for (const i of filtered) {
      const key = `${i.level}-${i.paper}-${i.series}`;
      if (!m.has(key)) m.set(key, { key, level: i.level, paper: i.paper, series: i.series, year: i.year, items: [] });
      m.get(key).items.push(i);
    }
    return [...m.values()].map(p => ({ ...p, items: p.items.sort((a, b) => a.q - b.q) }));
  }, [filtered]);

  const chipBtn = (on, onClick, children, key) => (
    <button key={key} type="button" onClick={onClick} style={{
      padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
      border: `1px solid ${on ? T.ink : T.border}`, background: on ? T.ink : T.card, color: on ? "#fff" : T.body,
    }}>{children}</button>
  );

  if (!hasFullAccess) return (
    <Notice tone="amber"><b>Past papers are for HSJ students.</b> Every question from every AQA, OCR A and Edexcel paper, marked by the AI examiner against the real mark scheme. If you are an HSJ student, log in with the email your welcome email was sent to.</Notice>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <Notice tone="red">{error}</Notice>}

      {/* Filters */}
      <Card padding={16} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, background: T.soft, padding: 3, borderRadius: 10 }}>
            {[["all", "AS + A-level"], ["as", "AS"], ["a2", "A-level"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setF(x => ({ ...x, level: v }))} style={{ padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: f.level === v ? T.card : "transparent", color: f.level === v ? T.ink : T.muted, boxShadow: f.level === v ? T.shadow : "none" }}>{l}</button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input value={f.search} onChange={e => setF(x => ({ ...x, search: e.target.value }))} placeholder="Search by topic, keyword, paper or year" aria-label="Search questions" />
          </div>
          {activeFilters > 0 && <Button size="sm" variant="ghost" icon="x" onClick={() => setF({ ...DEFAULT_FILTERS, search: f.search })}>Clear {activeFilters} filter{activeFilters === 1 ? "" : "s"}</Button>}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginRight: 4 }}>Paper</span>
          {papers.map(p => chipBtn(f.papers.includes(p), () => setF(x => ({ ...x, papers: toggleIn(x.papers, p) })), `Paper ${p}`, `p${p}`))}
          <span style={{ width: 1, height: 18, background: T.border, margin: "0 6px" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginRight: 4 }}>Type</span>
          {kinds.map(k => chipBtn(f.kinds.includes(k), () => setF(x => ({ ...x, kinds: toggleIn(x.kinds, k) })), KIND_LABEL[k] || k, `k${k}`))}
          <span style={{ width: 1, height: 18, background: T.border, margin: "0 6px" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginRight: 4 }}>Progress</span>
          {[["all", "Any"], ["new", "Not tried"], ["tried", "Needs another go"], ["full", "Full marks"]].map(([v, l]) => chipBtn(f.status === v, () => setF(x => ({ ...x, status: v })), l, `s${v}`))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginRight: 4 }}>Series</span>
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

      {/* Summary and actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: T.body }}>
          {loading ? "Loading past papers…" : <><b style={{ color: T.ink }}>{filtered.length}</b> question{filtered.length === 1 ? "" : "s"} · {totalMarks} marks{doneCount > 0 && <> · {doneCount} tried</>}</>}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 2, background: T.soft, padding: 3, borderRadius: 10 }}>
            {[["question", "Questions"], ["paper", "By paper"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setGroup(v)} style={{ padding: "5px 10px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: group === v ? T.card : "transparent", color: group === v ? T.ink : T.muted, boxShadow: group === v ? T.shadow : "none" }}>{l}</button>
            ))}
          </div>
          <Button size="sm" onClick={() => start(true)} disabled={filtered.length === 0}>Shuffle</Button>
          <Button size="sm" variant="primary" iconRight="arrowRight" onClick={() => start(false)} disabled={filtered.length === 0}>Start</Button>
        </div>
      </div>

      {/* List */}
      {!loading && items.length === 0 && !error && (
        <EmptyState icon="book" title="Past papers are being prepared" body="The question bank for this board is still being indexed. Check back shortly." />
      )}
      {!loading && items.length > 0 && filtered.length === 0 && (
        <EmptyState icon="search" title="No questions match" body="Loosen a filter or clear the search." action={<Button size="sm" onClick={() => setF(DEFAULT_FILTERS)}>Clear filters</Button>} />
      )}

      {group === "question" && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(i => <QuestionRow key={i.id} item={i} board={board} att={attempts[i.id]} onOpen={() => open(i.id)} />)}
        </div>
      )}

      {group === "paper" && byPaper.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {byPaper.map(p => {
            const marks = p.items.reduce((s, i) => s + (i.totalMarks || 0), 0);
            const tried = p.items.filter(i => statusOf(attempts[i.id]) !== "new").length;
            return (
              <Card key={p.key} padding={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${T.line}`, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 700, fontFamily: T.display, fontSize: 15 }}>{LEVEL_LABEL[p.level]} Paper {p.paper} · {seriesLabel(p.series, p.year)}</div>
                  <span style={{ fontSize: 12, color: T.muted }}>{p.items.length} questions · {marks} marks{tried > 0 && ` · ${tried} tried`}</span>
                  <Button size="sm" style={{ marginLeft: "auto" }} iconRight="arrowRight" onClick={() => open(p.items[0].id, p.items)}>Work through</Button>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {p.items.map(i => <QuestionRow key={i.id} item={i} board={board} att={attempts[i.id]} onOpen={() => open(i.id, p.items)} compact />)}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* The older practice modules stay reachable while their future is decided */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Other practice</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRACTICE_MODULES.filter(m => !["mechanisms", "nmr"].includes(m.id)).map(m => (
            <Button key={m.id} size="sm" icon={m.icon} onClick={() => { navigate(`/${board}/${m.id}`); track("open_section", { section: m.id, board }); }}>{m.label}</Button>
          ))}
        </div>
      </div>
    </div>
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

function QuestionRow({ item, board, att, onOpen, compact }) {
  const st = statusOf(att);
  return (
    <button type="button" onClick={onOpen} className="cm-row-hover" style={{
      display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", cursor: "pointer", color: T.ink,
      padding: compact ? "10px 16px" : "12px 16px", background: compact ? "transparent" : T.card,
      border: compact ? "none" : `1px solid ${T.border}`, borderBottom: compact ? `1px solid ${T.line}` : undefined, borderRadius: compact ? 0 : T.radiusSm,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: st === "full" ? T.greenTint : st === "new" ? T.soft : T.amberTint, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: T.muted, fontWeight: 600, lineHeight: 1 }}>Q</span>
        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: T.display, lineHeight: 1.1 }}>{item.q}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || `Question ${item.q}`}</div>
        <div style={{ fontSize: 12, color: T.muted, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {!compact && <span>{LEVEL_LABEL[item.level]} Paper {item.paper} · {seriesLabel(item.series, item.year)}</span>}
          {!compact && <span>·</span>}
          <span>{item.totalMarks} mark{item.totalMarks === 1 ? "" : "s"}</span>
          {item.kind && item.kind !== "structured" && <><span>·</span><span>{KIND_LABEL[item.kind] || item.kind}</span></>}
          <span className="cm-hide-sm" style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
            {(item.topics || []).slice(0, 3).map(t => <Chip key={t} tone="neutral" style={{ fontSize: 10, padding: "1px 7px" }}>{topicShort(board, t)}</Chip>)}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {att ? <Chip tone={STATUS_TONE[st]}>{att.best}/{att.totalMarks}</Chip> : <Chip tone="neutral" style={{ opacity: 0.7 }}>{STATUS_LABEL.new}</Chip>}
        <Icon name="arrowRight" size={16} color={T.faint} />
      </div>
    </button>
  );
}
