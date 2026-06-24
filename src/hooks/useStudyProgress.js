import { useState, useCallback, useEffect } from "react";

export default function useStudyProgress() {
  const [studyLog, setStudyLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hsj-study-log") || "{}"); } catch { return {}; }
  });
  const todayKey = new Date().toISOString().slice(0, 10);

  const logActivity = useCallback((type) => {
    setStudyLog(prev => {
      const day = prev[todayKey] || { sessions: 0, cards: 0, calcs: 0, extended: 0, mechanisms: 0, firstOpen: Date.now() };
      if (type === "session") day.sessions = (day.sessions || 0) + 1;
      if (type === "card") day.cards = (day.cards || 0) + 1;
      if (type === "calc") day.calcs = (day.calcs || 0) + 1;
      if (type === "extended") day.extended = (day.extended || 0) + 1;
      if (type === "mechanism") day.mechanisms = (day.mechanisms || 0) + 1;
      day.lastActive = Date.now();
      const next = { ...prev, [todayKey]: day };
      try { localStorage.setItem("hsj-study-log", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [todayKey]);

  useEffect(() => {
    if (!studyLog[todayKey]?.sessions) logActivity("session");
  }, [todayKey]); // eslint-disable-line

  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    if (!studyLog[todayKey]) d.setDate(d.getDate() - 1);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (studyLog[key]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };
  const currentStreak = getStreak();

  const [scoreHistory, setScoreHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hsj-score-history") || "[]"); } catch { return []; }
  });
  const logScore = useCallback((type, topic, score, total) => {
    setScoreHistory(prev => {
      const entry = { date: todayKey, time: Date.now(), type, topic, score, total };
      const next = [...prev, entry].slice(-200);
      try { localStorage.setItem("hsj-score-history", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [todayKey]);

  return { studyLog, todayKey, logActivity, currentStreak, scoreHistory, logScore };
}
