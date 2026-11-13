// Under a marked answer that lost marks: the examiner's suggested kind of
// error, the eight kinds to choose from and one button to file it in the
// student's error log. Once filed it shows what was logged and when the
// question comes back for a retest (src/utils/errorLog.js).
import React, { useState } from "react";
import { addErrorLogEntry, updateErrorLogEntry, deleteErrorLogEntry } from "../firebase";
import useErrorLog, { noteEntry, dropEntry } from "../hooks/useErrorLog";
import { ERROR_TYPES, typeLabel, entryKey, defaultType, fmtDay } from "../utils/errorLog";
import { T } from "../ui/theme";
import { Button, Icon } from "../ui/components";

function TypeChips({ picked, suggested, onPick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {ERROR_TYPES.map(t => {
        const on = picked === t.id;
        return (
          <button key={t.id} type="button" onClick={() => onPick(t.id)} title={t.advice} style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            border: `1px solid ${on ? T.ink : T.border}`, background: on ? T.ink : T.card, color: on ? "#fff" : T.body,
          }}>
            {on && <Icon name="check" size={11} strokeWidth={3} />}{t.label}
            {suggested === t.id && !on && <span style={{ fontSize: 10, color: T.accentText, fontWeight: 700 }}>· suggested</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * entry: { source, type, questionId, partLabel, topic, topicLabel, title, board, assignmentId, retestPath, attempted }
 * suggested / note: what the examiner returned (errorType / errorNote), if anything.
 * lost: marks lost on the latest attempt. Nothing renders when none were lost and nothing is logged.
 */
export default function ErrorLogPrompt({ authUser, userProfile, entry, suggested, note, lost, maxMarks }) {
  const { entries } = useErrorLog(authUser?.uid);
  const key = entryKey(entry);
  const existing = entries.find(e => entryKey(e) === key) || null;
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  if (!authUser?.uid) return null;
  if (!existing && !(lost > 0)) return null;
  const suggestion = suggested || defaultType(entry.type, entry.attempted !== false);
  const picked = choice || existing?.category || suggestion;

  const save = async () => {
    setBusy(true); setErr(null);
    try {
      if (existing) {
        const patch = { category: picked };
        await updateErrorLogEntry(existing.id, patch);
        noteEntry({ id: existing.id, ...patch });
      } else {
        const made = await addErrorLogEntry(authUser, userProfile, {
          ...entry, category: picked, suggested: suggested || null, note: note || null,
          marksLost: lost, maxMarks: maxMarks ?? null,
        });
        noteEntry(made);
      }
      setEditing(false); setChoice(null);
    } catch (e) { setErr(e.message || "Could not save"); }
    setBusy(false);
  };
  const remove = async () => {
    if (!existing) return;
    setBusy(true); setErr(null);
    try { await deleteErrorLogEntry(existing.id); dropEntry(existing.id); setEditing(false); setChoice(null); }
    catch (e) { setErr(e.message || "Could not remove"); }
    setBusy(false);
  };

  const box = { border: `1px dashed ${T.border}`, borderRadius: T.radiusSm, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8, background: "#FAFBFC" };

  if (existing && !editing) {
    const fixed = existing.status === "fixed";
    return (
      <div style={{ ...box, borderStyle: "solid", background: fixed ? T.greenTint : T.card, flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <Icon name={fixed ? "check" : "target"} size={15} color={fixed ? T.green : T.accentText} />
        <span style={{ fontSize: 12, color: T.body, flex: 1, minWidth: 200 }}>
          {fixed ? <>Fixed on retest. Was in your error log as <b>{typeLabel(existing.category)}</b>.</>
            : <>In your error log as <b>{typeLabel(existing.category)}</b>{existing.note ? <span style={{ color: T.muted }}> · {existing.note}</span> : null}. Retest from {fmtDay(existing.retestDue)}.</>}
        </span>
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)} disabled={busy}>Change</Button>
      </div>
    );
  }

  return (
    <div style={box}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Icon name="target" size={15} color={T.accentText} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{existing ? "Change the kind of error" : `${lost} mark${lost === 1 ? "" : "s"} lost. What went wrong?`}</span>
        {note && !existing && <span style={{ fontSize: 12, color: T.muted }}>Examiner: {note}</span>}
      </div>
      <TypeChips picked={picked} suggested={suggested} onPick={setChoice} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Button size="sm" variant="primary" onClick={save} disabled={busy}>{busy ? "Saving…" : existing ? "Save" : "Add to my error log"}</Button>
        {existing && <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setChoice(null); }} disabled={busy}>Cancel</Button>}
        {existing && <Button size="sm" variant="ghost" onClick={remove} disabled={busy}>Remove from log</Button>}
        {!existing && <span style={{ fontSize: 11, color: T.faint }}>Logged slips come back for a retest after two weeks.</span>}
        {err && <span style={{ fontSize: 12, color: T.red }}>{err}</span>}
      </div>
    </div>
  );
}
