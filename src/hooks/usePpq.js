import { useState, useEffect, useCallback } from "react";
import { fetchPpqIndex, fetchMyPpqAttempts } from "../firebase";

// Module-level caches so moving between the browser and a question does not
// refetch the index (one document per board and level) or the attempts.
const indexCache = {};               // `${board}_${level}` -> items[]
const attemptsCache = { uid: null, byQid: null, at: 0 };
const TTL = 5 * 60 * 1000;

/** Every question for a board at both levels, plus the student's attempts keyed by question id. */
export default function usePpq(board, uid) {
  const [items, setItems] = useState(() => (indexCache[`${board}_as`] && indexCache[`${board}_a2`]) ? merge(board) : null);
  const [attempts, setAttempts] = useState(() => (attemptsCache.uid === uid && attemptsCache.byQid) || null);
  const [loading, setLoading] = useState(!items);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!indexCache[`${board}_as`] || !indexCache[`${board}_a2`]) {
          setLoading(true);
          const [as, a2] = await Promise.all([fetchPpqIndex(board, "as"), fetchPpqIndex(board, "a2")]);
          indexCache[`${board}_as`] = as.map(x => ({ ...x, level: "as", board }));
          indexCache[`${board}_a2`] = a2.map(x => ({ ...x, level: "a2", board }));
        }
        if (alive) { setItems(merge(board)); setError(null); }
      } catch (e) {
        if (alive) setError(e.message || "Could not load the past papers");
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [board]);

  const loadAttempts = useCallback(async (force) => {
    if (!uid) { setAttempts({}); return; }
    if (!force && attemptsCache.uid === uid && attemptsCache.byQid && Date.now() - attemptsCache.at < TTL) { setAttempts(attemptsCache.byQid); return; }
    try {
      const list = await fetchMyPpqAttempts(uid);
      const byQid = {};
      for (const a of list) byQid[a.qid] = a;
      attemptsCache.uid = uid; attemptsCache.byQid = byQid; attemptsCache.at = Date.now();
      setAttempts(byQid);
    } catch (e) {
      setAttempts(prev => prev || {});
    }
  }, [uid]);

  useEffect(() => { loadAttempts(false); }, [loadAttempts]);

  return { items: items || [], attempts: attempts || {}, loading, error, reloadAttempts: () => loadAttempts(true) };
}

function merge(board) {
  return [...(indexCache[`${board}_as`] || []), ...(indexCache[`${board}_a2`] || [])];
}

/** Update the cached attempt for one question after marking, so the browser shows the new status at once. */
export function noteAttempt(uid, qid, patch) {
  if (attemptsCache.uid !== uid || !attemptsCache.byQid) return;
  attemptsCache.byQid = { ...attemptsCache.byQid, [qid]: { ...(attemptsCache.byQid[qid] || {}), qid, ...patch } };
}
