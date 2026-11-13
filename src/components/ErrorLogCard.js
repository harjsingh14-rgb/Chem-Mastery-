// The error log as the student and the tutor see it: a compact card for the
// dashboard, the full panel on the Progress page, and a read-only summary on
// the tutor's student profile. Entries come from hooks/useErrorLog.js.
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchErrorLogForUser, updateErrorLogEntry, deleteErrorLogEntry } from "../firebase";
import useErrorLog, { noteEntry, dropEntry } from "../hooks/useErrorLog";
import { typeShort, summariseLog, isDue, fmtDay, ERROR_TYPE_BY_ID } from "../utils/errorLog";
import { T } from "../ui/theme";
import { Card, CardHeader, Chip, Button, Bar, Icon } from "../ui/components";
import chemFormat from "../utils/chemFormat";

const SOURCE_LABEL = { homework: "Homework", ppq: "Past paper", revision: "Revision" };
const entryTitle = (e) => e.title || e.topicLabel || e.topic || e.questionId;
const where = (e) => `${SOURCE_LABEL[e.source] || "Revision"}${e.partLabel ? ` · part ${e.partLabel}` : ""}`;

/** Horizontal bars, one per kind of error that has entries. */
export function TypeBars({ byType, total }) {
  if (!byType.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {byType.map(t => (
        <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
            <span style={{ fontWeight: 600 }}>{t.label}</span>
            <span style={{ color: T.muted }}>{t.n} slip{t.n === 1 ? "" : "s"}{t.marks ? ` · ${t.marks} mk` : ""}{t.open < t.n ? ` · ${t.n - t.open} fixed` : ""}</span>
          </div>
          <Bar value={total ? (t.n / total) * 100 : 0} colour={t.tone === "red" ? T.red : t.tone === "amber" ? T.amber : t.tone === "indigo" ? T.indigo : T.faint} height={6} />
        </div>
      ))}
    </div>
  );
}

function EntryRow({ e, onRetest, onFixed, onReopen, onRemove, dense }) {
  const due = isDue(e);
  const fixed = e.status === "fixed";
  const t = ERROR_TYPE_BY_ID[e.category];
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: dense ? "6px 0" : "10px 0", borderTop: `1px solid ${T.line}`, fontSize: 13 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: fixed ? T.green : due ? T.red : T.amber }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{chemFormat(entryTitle(e))}</span>
          <Chip tone={t?.tone === "neutral" ? "neutral" : t?.tone || "neutral"} style={{ fontSize: 11, padding: "2px 8px" }}>{typeShort(e.category)}</Chip>
          {fixed ? <Chip tone="green" style={{ fontSize: 11, padding: "2px 8px" }}>Fixed</Chip> : due ? <Chip tone="red" style={{ fontSize: 11, padding: "2px 8px" }}>Retest due</Chip> : null}
        </div>
        <span style={{ fontSize: 12, color: T.muted }}>
          {where(e)} · {e.marksLost != null ? `${e.marksLost} mark${e.marksLost === 1 ? "" : "s"} lost · ` : ""}{fmtDay(e.clientTime)}
          {e.note ? <> · <span style={{ fontStyle: "italic" }}>{e.note}</span></> : null}
          {!fixed && !due && e.retestDue ? ` · retest from ${fmtDay(e.retestDue)}` : ""}
          {e.retestCount ? ` · retested ${e.retestCount}×` : ""}
        </span>
      </div>
      {(onRetest || onFixed || onReopen || onRemove) && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {!fixed && onRetest && <Button size="sm" variant={due ? "primary" : "secondary"} onClick={() => onRetest(e)}>Retest</Button>}
          {!fixed && onFixed && <Button size="sm" variant="ghost" onClick={() => onFixed(e)} title="I have gone over this and would get it right now">Fixed</Button>}
          {fixed && onReopen && <Button size="sm" variant="ghost" onClick={() => onReopen(e)}>Reopen</Button>}
          {onRemove && <Button size="sm" variant="ghost" onClick={() => onRemove(e)} aria-label="Remove"><Icon name="x" size={13} /></Button>}
        </div>
      )}
    </div>
  );
}

function useActions(board) {
  const navigate = useNavigate();
  const retest = (e) => navigate(e.retestPath || `/${board}/revision`);
  const setStatus = async (e, status) => {
    const patch = status === "fixed" ? { status, fixedAt: Date.now() } : { status, fixedAt: null };
    try { await updateErrorLogEntry(e.id, patch); noteEntry({ id: e.id, ...patch }); } catch { /* shown unchanged */ }
  };
  const remove = async (e) => {
    if (!window.confirm("Remove this from your error log?")) return;
    try { await deleteErrorLogEntry(e.id); dropEntry(e.id); } catch { /* shown unchanged */ }
  };
  return { retest, fixed: (e) => setStatus(e, "fixed"), reopen: (e) => setStatus(e, "open"), remove };
}

/** Dashboard: the top kinds of error and what is due for a retest. */
export function ErrorLogCard({ authUser, board }) {
  const navigate = useNavigate();
  const { entries, loading } = useErrorLog(authUser?.uid);
  const s = useMemo(() => summariseLog(entries), [entries]);
  const act = useActions(board);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CardHeader title="Error log" sub="What has cost you marks, and what to retest" right={s.total > 0 ? <Button size="sm" onClick={() => navigate(`/${board}/progress`)}>All</Button> : null} />
      {loading && s.total === 0 && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
      {!loading && s.total === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing logged yet. When a marked answer loses marks, file what went wrong and it will come back here for a retest two weeks on.</span>}
      {s.top && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {s.byType.slice(0, 4).map(t => <Chip key={t.id} tone={t.tone === "neutral" ? "neutral" : t.tone}>{t.label} · {t.n}</Chip>)}
          </div>
          <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}><b style={{ color: T.body }}>Most common: {s.top.label}.</b> {s.top.advice}</span>
        </div>
      )}
      {s.due.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.red, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>{s.due.length} retest{s.due.length === 1 ? "" : "s"} due</span>
          {s.due.slice(0, 4).map(e => <EntryRow key={e.id} e={e} dense onRetest={act.retest} />)}
        </div>
      )}
      {s.total > 0 && s.due.length === 0 && <span style={{ fontSize: 12, color: T.muted }}>{s.open.length} open, {s.fixed.length} fixed. Nothing due for a retest yet.</span>}
    </Card>
  );
}

/** Progress page: everything, with retest, fixed and remove. */
export function ErrorLogPanel({ authUser, board }) {
  const { entries, loading } = useErrorLog(authUser?.uid);
  const s = useMemo(() => summariseLog(entries), [entries]);
  const act = useActions(board);
  const [show, setShow] = useState("open");   // open | fixed | all
  const shown = show === "open" ? s.open : show === "fixed" ? s.fixed : s.recent;
  const sorted = useMemo(() => [...shown].sort((a, b) => (isDue(b) ? 1 : 0) - (isDue(a) ? 1 : 0) || (b.clientTime || 0) - (a.clientTime || 0)), [shown]);
  return (
    <Card padding={0}>
      <CardHeader title="Error log" sub="Every lost mark you have filed, by the kind of error. Retest what is due, and mark a slip fixed once you can do it without help."
        style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
        right={<div style={{ display: "flex", gap: 4 }}>{[["open", `Open · ${s.open.length}`], ["fixed", `Fixed · ${s.fixed.length}`], ["all", "All"]].map(([k, l]) => <Button key={k} size="sm" variant={show === k ? "primary" : "ghost"} onClick={() => setShow(k)}>{l}</Button>)}</div>} />
      <div style={{ padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {loading && s.total === 0 && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
        {!loading && s.total === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing logged yet. After the examiner marks an answer that loses marks, pick what went wrong under it and it is filed here.</span>}
        {s.total > 0 && <TypeBars byType={s.byType} total={s.total} />}
        {s.top && <div style={{ fontSize: 13, lineHeight: 1.55, padding: "10px 12px", borderRadius: T.radiusSm, background: T.accentTint, color: T.accentText }}><b>Your pattern: {s.top.label}.</b> {s.top.advice}</div>}
        {s.total > 0 && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {sorted.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing here.</span>}
            {sorted.map(e => <EntryRow key={e.id} e={e} onRetest={act.retest} onFixed={act.fixed} onReopen={act.reopen} onRemove={act.remove} />)}
          </div>
        )}
      </div>
    </Card>
  );
}

/** Tutor's view of one student's log: read only. */
export function TutorErrorLog({ uid }) {
  const [entries, setEntries] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!uid) return undefined;
    fetchErrorLogForUser(uid).then(d => alive && setEntries(d)).catch(() => alive && setEntries([]));
    return () => { alive = false; };
  }, [uid]);
  const s = useMemo(() => summariseLog(entries || []), [entries]);
  const [all, setAll] = useState(false);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CardHeader title="Error log" sub="The kinds of error this student has filed" right={s.total > 6 ? <Button size="sm" variant="ghost" onClick={() => setAll(v => !v)}>{all ? "Fewer" : `All ${s.total}`}</Button> : null} />
      {entries === null && <span style={{ fontSize: 13, color: T.muted }}>Loading…</span>}
      {entries && s.total === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing filed yet. Students log a slip under each marked answer that loses marks.</span>}
      {s.total > 0 && (
        <>
          <div style={{ display: "flex", gap: 10, fontSize: 12, color: T.muted, flexWrap: "wrap" }}>
            <span><b style={{ color: T.ink }}>{s.open.length}</b> open</span>
            <span><b style={{ color: s.due.length ? T.red : T.ink }}>{s.due.length}</b> due for retest</span>
            <span><b style={{ color: T.green }}>{s.fixed.length}</b> fixed</span>
          </div>
          <TypeBars byType={s.byType} total={s.total} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(all ? s.recent : s.recent.slice(0, 6)).map(e => <EntryRow key={e.id} e={e} dense />)}
          </div>
        </>
      )}
    </Card>
  );
}

