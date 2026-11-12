import React, { useState, useEffect } from "react";
import { fetchOpenPpqQueries, fetchUserNames, ppqMarkApi } from "../../firebase";
import { T } from "../../ui/theme";
import chemFormat from "../../utils/chemFormat";
import { Card, CardHeader, Chip, Button, Notice } from "../../ui/components";
import { relativeTime } from "../../utils/analytics";
import { seriesLabel, paperLabel } from "./ppqUtils";

const BOARD_NAME = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };

/**
 * Past-paper mark queries waiting for the tutor. Each shows the student's
 * answer, the AI's mark and feedback, and the student's note, with a reply box
 * and an optional corrected mark. Tutors see their own students; admins all.
 */
export default function TutorPpqQueries({ authUser, isAdmin }) {
  const [items, setItems] = useState(null);
  const [names, setNames] = useState({});
  const [drafts, setDrafts] = useState({});      // `${attemptId}|${part}` -> { reply, score }
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser?.uid) return;
    let alive = true;
    fetchOpenPpqQueries(authUser.uid, isAdmin).then(async list => {
      if (!alive) return;
      setItems(list);
      setNames(await fetchUserNames(list.map(a => a.uid)));
    }).catch(e => { if (alive) { setError(e.message); setItems([]); } });
    return () => { alive = false; };
  }, [authUser, isAdmin]);

  const open = (items || []).flatMap(a => Object.entries(a.queries || {}).filter(([, q]) => q.status === "open").map(([part, q]) => ({ a, part, q })))
    .sort((x, y) => (x.q.at || 0) - (y.q.at || 0));

  const send = async ({ a, part }) => {
    const key = `${a.id}|${part}`;
    const d = drafts[key] || {};
    if (!d.reply || !d.reply.trim()) return;
    setBusy(key); setError(null);
    try {
      const r = await ppqMarkApi({ action: "reply", attemptId: a.id, part, reply: d.reply.trim(), score: d.score === "" || d.score === undefined ? undefined : d.score });
      setItems(list => list.map(x => x.id === a.id ? { ...x, queries: r.queries, latest: r.latest, best: r.best } : x));
    } catch (e) { setError(e.message); }
    setBusy(null);
  };

  if (items === null) return null;
  if (open.length === 0 && !error) return null;

  return (
    <Card padding={0}>
      <CardHeader title="Past-paper mark queries" sub="Students asking you to check a mark the AI examiner gave." right={<Chip tone="amber">{open.length}</Chip>} style={{ padding: "16px 20px" }} />
      {error && <div style={{ padding: "0 20px 12px" }}><Notice tone="red">{error}</Notice></div>}
      {open.map(({ a, part, q }) => {
        const key = `${a.id}|${part}`;
        const d = drafts[key] || { reply: "", score: "" };
        const lp = a.latest?.parts?.[part] || {};
        return (
          <div key={key} style={{ borderTop: `1px solid ${T.line}`, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700 }}>{names[a.uid] || "Student"}</span>
              <span style={{ fontSize: 12, color: T.muted }}>{BOARD_NAME[a.board] || a.board} {paperLabel(a)} · {seriesLabel(a.series, a.year)} · Q{a.q}{part === "q" ? "" : ` part ${part}`}</span>
              <Chip tone="neutral">{lp.score ?? q.score} / {lp.marks ?? "?"}</Chip>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: "auto" }}>{relativeTime(q.at)}</span>
              <a className="cm-link" style={{ fontSize: 12 }} href={`/${a.board}/practise/${a.qid}`} target="_blank" rel="noreferrer">Open question</a>
            </div>
            {a.title && <div style={{ fontSize: 13, color: T.body }}>{a.title}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, fontSize: 13 }}>
              <div style={{ padding: "10px 12px", background: T.soft, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Student's answer</div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{chemFormat(q.answer || lp.answer) || <span style={{ color: T.muted }}>Drawn or photographed, not typed. Open the question to see the paper.</span>}</div>
              </div>
              <div style={{ padding: "10px 12px", background: T.soft, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>AI examiner said</div>
                <div style={{ lineHeight: 1.5 }}>{q.feedback || lp.feedback || <span style={{ color: T.muted }}>No feedback recorded.</span>}</div>
              </div>
            </div>
            <div style={{ padding: "10px 12px", background: T.amberTint, borderRadius: T.radiusSm, fontSize: 13, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: "#92400E" }}>Query: </span>{q.note}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
              <textarea value={d.reply} onChange={e => setDrafts(x => ({ ...x, [key]: { ...d, reply: e.target.value } }))} rows={2} aria-label="Reply to student" placeholder="Your reply to the student"
                style={{ flex: "1 1 280px", padding: "8px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 13, color: T.ink, resize: "vertical", lineHeight: 1.5, boxSizing: "border-box", fontFamily: "inherit" }} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.muted }}>
                New mark
                <input type="number" min={0} max={lp.marks || 20} value={d.score} onChange={e => setDrafts(x => ({ ...x, [key]: { ...d, score: e.target.value } }))} aria-label="Corrected mark" placeholder="keep"
                  style={{ width: 64, padding: "8px 10px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 13, color: T.ink }} />
                <span>/ {lp.marks ?? "?"}</span>
              </label>
              <Button size="sm" variant="primary" disabled={busy === key || !d.reply.trim()} onClick={() => send({ a, part })}>{busy === key ? "Sending…" : "Reply"}</Button>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
