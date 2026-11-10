import React, { useState, useMemo } from "react";
import { T, boardLabel } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Icon, EmptyState, Notice } from "../ui/components";
import { EXAM_QUESTIONS, EXAM_TOPICS, questionMarks } from "../data/exam-questions";
import { ExamItem } from "./HomeworkPlayer";

const boardOk = (b, board) => b === "both" || b === board || (Array.isArray(b) && b.includes(board));
const TIER = { 1: { label: "Tier 1 · scaffolded", tone: "green", short: "Scaffolded" }, 2: { label: "Tier 2 · exam standard", tone: "amber", short: "Exam standard" }, 3: { label: "Tier 3 · stretch", tone: "red", short: "Stretch" } };
const category = (topic) => {
  const i = EXAM_TOPICS.indexOf(topic);
  const inorg = EXAM_TOPICS.indexOf("Periodicity and Period 3");
  const org = EXAM_TOPICS.indexOf("Organic basics and analysis");
  return i >= org ? "Organic chemistry" : i >= inorg ? "Inorganic chemistry" : "Physical chemistry";
};
const storeKey = (board) => `hsj-exam-style-${board}`;
const loadResults = (board) => { try { return JSON.parse(localStorage.getItem(storeKey(board)) || "{}"); } catch (e) { return {}; } };

/**
 * Revision: HSJ's exam-style questions, one scenario with lettered parts,
 * tiered from scaffolded to stretch. Each part is marked on its own (MCQ and
 * calculation parts at once, written parts by the AI examiner) with hints,
 * and the mark scheme opens once the whole question is complete. Progress is
 * kept on this device; first attempts feed the student's Progress page.
 */
export default function ExamStyleTab({ board, logAttempt }) {
  const [topic, setTopic] = useState(null);
  const [tier, setTier] = useState(0);              // 0 = all
  const [qid, setQid] = useState(null);
  const [results, setResults] = useState(() => loadResults(board));

  const bank = useMemo(() => EXAM_QUESTIONS.filter(q => boardOk(q.board, board)), [board]);
  const topics = useMemo(() => EXAM_TOPICS.map(t => ({ id: t, qs: bank.filter(q => q.topic === t) })).filter(t => t.qs.length > 0), [bank]);
  const q = qid ? bank.find(x => x.id === qid) : null;

  const save = (id, r, kind) => {
    const next = { ...results, [id]: r };
    setResults(next);
    try { localStorage.setItem(storeKey(board), JSON.stringify(next)); } catch (e) { /* private window or full storage */ }
    if (kind === "first" && logAttempt && q) {
      logAttempt({ board, type: "exam", questionId: q.id, topic: q.topic, topicLabel: q.title, tier: q.tier || null, score: r.score, maxScore: questionMarks(q), correct: !!r.correct, mode: "revision" });
    }
  };
  const retry = (id) => {
    const next = { ...results }; delete next[id];
    setResults(next);
    try { localStorage.setItem(storeKey(board), JSON.stringify(next)); } catch (e) { /* ignore */ }
  };

  if (bank.length === 0) return <div style={{ padding: 20 }}><Card padding={0}><EmptyState icon="pencil" title={`${boardLabel(board)} exam-style questions are being written`} body="They will appear here as they are added." /></Card></div>;

  // ── One question ──
  if (q) {
    const r = results[q.id];
    const marks = questionMarks(q);
    const complete = !!r?.detail?.complete;
    const pct = complete ? Math.round((r.score / Math.max(1, marks)) * 100) : null;
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" icon="arrowLeft" onClick={() => setQid(null)}>{q.topic}</Button>
          <Chip tone={TIER[q.tier]?.tone || "neutral"}>{TIER[q.tier]?.label || "Exam style"}</Chip>
          <Chip tone="neutral">{marks} marks</Chip>
          {complete && <Chip tone={pct >= 75 ? "green" : pct >= 50 ? "amber" : "red"}>{r.score} / {marks} · {pct}%</Chip>}
        </div>
        <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20 }}>{q.title}</div>
          {!r && <Notice tone="neutral" style={{ fontSize: 13 }}>Answer each part and press <b>Mark</b>. Hints open after your first go at a part and cost nothing. The mark scheme, worked solution and model answer open once every part is done.</Notice>}
          <ExamItem q={q} item={{ key: q.id, marks }} result={r} readOnly={false} submitted={complete} onRecord={(res, kind) => save(q.id, res, kind)} queries={{}} onQuery={null} />
          {complete && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 8, borderTop: `1px solid ${T.line}` }}>
              <Button onClick={() => retry(q.id)}>Try this question again</Button>
              <Button variant="primary" iconRight="arrowRight" onClick={() => setQid(null)}>Back to the list</Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // ── Questions in a topic ──
  if (topic) {
    const list = bank.filter(x => x.topic === topic && (!tier || x.tier === tier)).sort((a, b) => (a.tier || 2) - (b.tier || 2));
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" icon="arrowLeft" onClick={() => setTopic(null)}>All topics</Button>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, flex: 1 }}>{topic}</span>
          <div style={{ display: "inline-flex", padding: 3, borderRadius: 10, background: T.soft, gap: 2 }}>
            {[0, 1, 2, 3].map(t => <button key={t} onClick={() => setTier(t)} style={{ border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: tier === t ? T.card : "transparent", color: tier === t ? T.ink : T.muted, boxShadow: tier === t ? T.shadow : "none" }}>{t === 0 ? "All tiers" : TIER[t].short}</button>)}
          </div>
        </div>
        <Card padding={0}>
          {list.length === 0 && <EmptyState icon="pencil" title="No questions at this tier yet" />}
          {list.map(x => {
            const r = results[x.id]; const marks = questionMarks(x); const done = !!r?.detail?.complete;
            return (
              <button key={x.id} className="cm-card-link" onClick={() => setQid(x.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "12px 16px", borderBottom: `1px solid ${T.line}`, background: "transparent", border: "none", cursor: "pointer" }}>
                <Chip tone={TIER[x.tier]?.tone || "neutral"} style={{ fontSize: 11, minWidth: 96, justifyContent: "center" }}>{TIER[x.tier]?.short || "Exam style"}</Chip>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.ink }}>{x.title}</span>
                <span style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>{x.parts.length} part{x.parts.length === 1 ? "" : "s"} · {marks} marks</span>
                {done ? <Chip tone={r.score / marks >= 0.75 ? "green" : r.score > 0 ? "amber" : "red"} style={{ fontSize: 11 }}>{r.score} / {marks}</Chip> : r ? <Chip tone="neutral" style={{ fontSize: 11 }}>In progress</Chip> : <Icon name="arrowRight" size={16} color={T.faint} />}
              </button>
            );
          })}
        </Card>
      </div>
    );
  }

  // ── Topic picker ──
  const grouped = {};
  for (const t of topics) (grouped[category(t.id)] = grouped[category(t.id)] || []).push(t);
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ color: T.muted, fontSize: 13 }}>Exam-style questions written by HSJ Tuition: one scenario with lettered parts, like a real paper. Start at Tier 1, where the steps are broken down, and work up to Tier 3 stretch questions.</span>
      {Object.entries(grouped).map(([cat, list]) => (
        <Card key={cat} padding={16} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <CardHeader title={cat} sub={`${list.length} topics · ${list.reduce((a, t) => a + t.qs.length, 0)} questions`} />
          <div className="cm-grid-3" style={{ gap: 10 }}>
            {list.map(t => {
              const done = t.qs.filter(x => results[x.id]?.detail?.complete).length;
              return (
                <button key={t.id} className="cm-card-link" onClick={() => { setTopic(t.id); setTier(0); }} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: 14, borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{t.id}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{t.qs.length} question{t.qs.length === 1 ? "" : "s"}{done ? ` · ${done} done` : ""}</span>
                  <span style={{ display: "flex", gap: 4 }}>{[1, 2, 3].map(k => { const n = t.qs.filter(x => x.tier === k).length; return n ? <Chip key={k} tone={TIER[k].tone} style={{ fontSize: 10, padding: "1px 7px" }}>T{k} ×{n}</Chip> : null; })}</span>
                </button>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
