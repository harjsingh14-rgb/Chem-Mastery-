import { useState, useCallback, useEffect } from "react";
import { SETS } from "../data/sets";
import track from "../utils/track";

export default function useFlashcards(logActivity) {
  const [topic, setTopic] = useState(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => {
    try {
      const saved = localStorage.getItem('hsj-chem-known');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, new Set(v)]));
    } catch { return {}; }
  });
  const [order, setOrder] = useState([]);
  const [shuffled, setShuffled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const cards = topic ? SETS[topic].cards : [];
  const currentCardIndex = order[index];
  const card = cards[currentCardIndex] || { q: "", a: "" };
  const knownKey = topic || "";
  const knownSet = known[knownKey] || new Set();
  const knownCount = knownSet.size;

  const selectTopic = (t, board) => {
    setTopic(t);
    const arr = SETS[t].cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    setOrder(arr);
    setIndex(0); setFlipped(false); setShuffled(true); setShowMenu(false);
    track("select_flashcard_topic", { topic: t, title: SETS[t]?.title, board });
    return "cards";
  };

  useEffect(() => {
    try {
      const serialisable = Object.fromEntries(Object.entries(known).map(([k, v]) => [k, [...v]]));
      localStorage.setItem('hsj-chem-known', JSON.stringify(serialisable));
    } catch {}
  }, [known]);

  const next = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.min(i + 1, order.length - 1)), 100); }, [order.length]);
  const prev = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 100); }, []);
  const toggleKnown = useCallback(() => {
    setKnown(prev => {
      const s = new Set(prev[knownKey] || []);
      const wasKnown = s.has(currentCardIndex);
      wasKnown ? s.delete(currentCardIndex) : s.add(currentCardIndex);
      track("toggle_known", { topic, card_index: currentCardIndex, marked: !wasKnown });
      if (!wasKnown && logActivity) logActivity("card");
      return { ...prev, [knownKey]: s };
    });
  }, [knownKey, currentCardIndex, topic, logActivity]);

  const shuffle = useCallback(() => {
    const arr = cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    setOrder(arr); setIndex(0); setFlipped(false); setShuffled(true); setShowMenu(false);
  }, [cards]);

  const reset = useCallback(() => {
    setOrder(cards.map((_, i) => i)); setIndex(0); setFlipped(false); setShuffled(false); setShowMenu(false);
  }, [cards]);

  const studyUnknown = useCallback(() => {
    const unknown = cards.map((_, i) => i).filter(i => !knownSet.has(i));
    if (unknown.length === 0) return;
    setOrder(unknown); setIndex(0); setFlipped(false); setShowMenu(false);
  }, [cards, knownSet]);

  return {
    topic, setTopic, index, setIndex, flipped, setFlipped,
    known, setKnown, order, setOrder, shuffled, showMenu, setShowMenu,
    cards, currentCardIndex, card, knownKey, knownSet, knownCount,
    selectTopic, next, prev, toggleKnown, shuffle, reset, studyUnknown,
  };
}
