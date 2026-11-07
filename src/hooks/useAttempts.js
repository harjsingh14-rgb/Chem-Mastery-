import { useState, useEffect, useCallback } from "react";
import { fetchAttemptsForUser } from "../firebase";

// Small in-memory cache so moving between dashboard pages doesn't refetch.
const cache = { uid: null, data: null, at: 0 };
const TTL = 60 * 1000;

export default function useAttempts(uid) {
  const [attempts, setAttempts] = useState(() => (cache.uid === uid && cache.data) ? cache.data : null);
  const [loading, setLoading] = useState(!attempts);
  const [error, setError] = useState(null);

  const load = useCallback(async (force) => {
    if (!uid) { setAttempts([]); setLoading(false); return; }
    if (!force && cache.uid === uid && cache.data && Date.now() - cache.at < TTL) { setAttempts(cache.data); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await fetchAttemptsForUser(uid);
      cache.uid = uid; cache.data = data; cache.at = Date.now();
      setAttempts(data); setError(null);
    } catch (e) {
      setError(e.message || "Could not load progress");
      setAttempts(prev => prev || []);
    }
    setLoading(false);
  }, [uid]);

  useEffect(() => { load(false); }, [load]);

  return { attempts: attempts || [], loading, error, reload: () => load(true) };
}

/** Call after logging an attempt so the next dashboard visit refetches. */
export function invalidateAttempts() { cache.at = 0; }
