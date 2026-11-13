import { useState, useEffect, useCallback } from "react";
import { fetchErrorLogForUser, updateErrorLogEntry } from "../firebase";
import { DAY_MS, RETEST_DAYS } from "../utils/errorLog";

// One student's error log, cached in memory so the prompt under every marked
// answer and the cards on the dashboard share a single read.
const cache = { uid: null, data: null, at: 0, inflight: null };
const TTL = 5 * 60 * 1000;
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn(cache.data ? [...cache.data] : []));

async function load(uid, force) {
  if (!force && cache.uid === uid && cache.data && Date.now() - cache.at < TTL) return cache.data;
  if (cache.inflight && cache.uid === uid) return cache.inflight;
  cache.uid = uid;
  cache.inflight = fetchErrorLogForUser(uid).then(data => {
    cache.data = data; cache.at = Date.now(); cache.inflight = null; notify();
    return data;
  }).catch(e => { cache.inflight = null; throw e; });
  return cache.inflight;
}

export default function useErrorLog(uid) {
  const [entries, setEntries] = useState(() => (cache.uid === uid && cache.data) ? cache.data : null);
  const [loading, setLoading] = useState(!entries);

  const reload = useCallback(async (force) => {
    if (!uid) { setEntries([]); setLoading(false); return; }
    setLoading(true);
    try { setEntries(await load(uid, force)); } catch { setEntries(prev => prev || []); }
    setLoading(false);
  }, [uid]);

  useEffect(() => { reload(false); }, [reload]);
  useEffect(() => { listeners.add(setEntries); return () => { listeners.delete(setEntries); }; }, []);

  return { entries: entries || [], loading, reload: () => reload(true) };
}

/** Put a freshly written entry (or an edited one) into the cache so every prompt and card updates at once. */
export function noteEntry(entry) {
  if (!cache.data) cache.data = [];
  const i = cache.data.findIndex(e => e.id === entry.id);
  if (i >= 0) cache.data[i] = { ...cache.data[i], ...entry }; else cache.data.unshift(entry);
  notify();
}
export function dropEntry(id) {
  if (!cache.data) return;
  cache.data = cache.data.filter(e => e.id !== id);
  notify();
}
export function invalidateErrorLog() { cache.at = 0; }

/**
 * Called after every recorded attempt. An open entry for the same question,
 * logged more than a day ago, counts as retested: full marks closes it, anything
 * less sets the next retest for two weeks on.
 */
export async function settleRetests(uid, { questionId, correct }) {
  if (!uid || !questionId) return;
  let entries;
  try { entries = await load(uid, false); } catch { return; }
  const now = Date.now();
  const hits = entries.filter(e => e.status === "open" && String(e.questionId) === String(questionId) && (e.clientTime || 0) < now - DAY_MS);
  for (const e of hits) {
    const patch = correct
      ? { status: "fixed", fixedAt: now, retestAt: now, retestCount: (e.retestCount || 0) + 1 }
      : { retestAt: now, retestCount: (e.retestCount || 0) + 1, retestDue: now + RETEST_DAYS * DAY_MS };
    try { await updateErrorLogEntry(e.id, patch); noteEntry({ id: e.id, ...patch }); } catch { /* best effort */ }
  }
}
