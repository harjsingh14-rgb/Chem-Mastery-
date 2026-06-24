import { useState, useEffect } from "react";
import { SETS } from "../data/sets";
import { SECTIONS, OCR_SECTIONS } from "../data/sections";

const AQA_AS_SECTIONS = ["physical_as", "inorganic_as", "organic", "practicals_as"];
const AQA_A2_SECTIONS = ["physical_a2", "inorganic_a2", "organic2", "practicals_a2"];
const OCR_AS_SECTIONS = ["ocr_mod2", "ocr_mod3", "ocr_mod4"];
const OCR_A2_SECTIONS = ["ocr_mod5", "ocr_mod6"];

export default function useQuiz(board) {
  const [quizScreen, setQuizScreen] = useState(null);
  const [quizYear, setQuizYear] = useState("as");
  const [quizMode, setQuizMode] = useState("year");
  const [quizCount, setQuizCount] = useState(25);
  const [quizCustomCount, setQuizCustomCount] = useState(25);
  const [quizSelectedTopics, setQuizSelectedTopics] = useState([]);
  const [quizDeck, setQuizDeck] = useState([]);
  const [quizPos, setQuizPos] = useState(0);
  const [quizFlipped, setQuizFlipped] = useState(false);
  const [quizSessionScore, setQuizSessionScore] = useState({ correct: 0, wrong: 0 });
  const [quizHistory, setQuizHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hsj-quiz-history') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem('hsj-quiz-history', JSON.stringify(quizHistory)); }
    catch {}
  }, [quizHistory]);

  const buildQuizDeck = (year, deckSize = 25, topicIds = null) => {
    let eligibleTopics;
    if (topicIds && topicIds.length > 0) {
      eligibleTopics = topicIds.filter(id => SETS[id]);
    } else {
      const allSections = board === "ocr" ? OCR_SECTIONS : SECTIONS;
      const asSecs = board === "ocr" ? OCR_AS_SECTIONS : AQA_AS_SECTIONS;
      const a2Secs = board === "ocr" ? OCR_A2_SECTIONS : AQA_A2_SECTIONS;
      let sectionFilter;
      if (year === "as") sectionFilter = asSecs;
      else if (year === "a2") sectionFilter = a2Secs;
      else sectionFilter = [...asSecs, ...a2Secs];
      eligibleTopics = allSections
        .filter(s => sectionFilter.includes(s.id))
        .flatMap(s => s.topics)
        .filter(id => SETS[id]);
    }

    const pool = [];
    for (const topicId of eligibleTopics) {
      const cards = SETS[topicId].cards;
      cards.forEach((card, cardIdx) => {
        const key = `${topicId}-${cardIdx}`;
        const h = quizHistory[key];
        let weight;
        if (!h) {
          weight = 3;
        } else {
          const { c = 0, w = 0 } = h;
          const total = c + w;
          if (total === 0) { weight = 3; }
          else if (c >= 3 && c / total >= 0.7) { weight = 0.5; }
          else if (w > c) { weight = 4; }
          else { weight = 2; }
        }
        pool.push({ topicId, cardIdx, q: card.q, a: card.a, weight });
      });
    }
    if (pool.length === 0) return [];

    const DECK_SIZE = Math.min(deckSize, pool.length);
    const selected = [];
    const remaining = [...pool];
    for (let i = 0; i < DECK_SIZE; i++) {
      const totalW = remaining.reduce((s, c) => s + c.weight, 0);
      let r = Math.random() * totalW;
      let idx = 0;
      while (idx < remaining.length - 1 && r > remaining[idx].weight) {
        r -= remaining[idx].weight;
        idx++;
      }
      selected.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
    return selected;
  };

  const startQuiz = () => {
    const count = quizCount === "custom" ? Math.min(99, Math.max(25, quizCustomCount || 25)) : quizCount;
    const topicFilter = quizMode === "topics" && quizSelectedTopics.length > 0 ? quizSelectedTopics : null;
    const deck = buildQuizDeck(quizYear, count, topicFilter);
    setQuizDeck(deck);
    setQuizPos(0);
    setQuizFlipped(false);
    setQuizSessionScore({ correct: 0, wrong: 0 });
    setQuizScreen("running");
  };

  const recordQuizAnswer = (correct) => {
    const card = quizDeck[quizPos];
    const key = `${card.topicId}-${card.cardIdx}`;
    setQuizHistory(prev => {
      const h = prev[key] || { c: 0, w: 0 };
      return { ...prev, [key]: correct ? { c: h.c + 1, w: h.w } : { c: h.c, w: h.w + 1 } };
    });
    setQuizSessionScore(prev => correct
      ? { ...prev, correct: prev.correct + 1 }
      : { ...prev, wrong: prev.wrong + 1 }
    );
    const isLast = quizPos >= quizDeck.length - 1;
    if (isLast) {
      setQuizScreen("done");
    } else {
      setQuizFlipped(false);
      setTimeout(() => setQuizPos(p => p + 1), 120);
    }
  };

  return {
    quizScreen, setQuizScreen, quizYear, setQuizYear,
    quizMode, setQuizMode, quizCount, setQuizCount,
    quizCustomCount, setQuizCustomCount,
    quizSelectedTopics, setQuizSelectedTopics,
    quizDeck, quizPos, quizFlipped, setQuizFlipped,
    quizSessionScore, quizHistory,
    startQuiz, recordQuizAnswer,
    AQA_AS_SECTIONS, AQA_A2_SECTIONS, OCR_AS_SECTIONS, OCR_A2_SECTIONS,
  };
}
