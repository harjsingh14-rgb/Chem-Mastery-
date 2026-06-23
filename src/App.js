import React, { useState, useCallback, useEffect, useRef } from "react";
import { logOut, onAuthChange, getOrCreateUserProfile, redeemAccessKey } from "./firebase";
import mcqData from "./mcq-data.json";
import { SETS } from "./data/sets";
import { GROUP_SMILES, chemBond, chemAtom, benzeneRing, ZZ, ZY, MOLECULE_SVG, REACTION_EXAMPLES, renderReactionSvg } from "./data/molecules";
import { HessTriangle, HessBox, BornHaberCycle } from "./data/energy-cycles";
import { CALC_SETS } from "./data/calc-sets";
import { EXTENDED_QUESTIONS } from "./data/extended-questions";
import { SECTIONS, TOPIC_ORDER, OCR_SECTIONS, OCR_TOPIC_ORDER } from "./data/sections";
import { SYNTH_ROUTES } from "./data/synth-routes";
import { SYNTH_ALI_NODES, SYNTH_ALI_RXNS, SYNTH_ARO_NODES, SYNTH_ARO_RXNS } from "./data/synth-maps";
import { MECHS } from "./data/mechanisms";
import LandingPage from "./components/LandingPage";
import LoginScreen from "./components/LoginScreen";
// Chemistry text formatter — converts plain text to JSX with proper sub/superscripts
function chemFormat(text) {
  if (!text || typeof text !== "string") return text;
  // Renders chemistry notation: electron configs (1s2 -> 1s superscript),
  // ion charges (Fe3+, Cu2+, OH-, SO4 2-, NH4+), state symbols ((g)/(aq)),
  // molecular-formula subscripts (H2O, Ca(OH)2) and delta signs.
  // Lookahead-only (no lookbehind) so it works on older Safari/Chrome too.
  const sign = (s) => s.replace(/[–-]/g, "−");
  // Alternatives (first match wins at each position):
  //  1-3  electron config (adjacent-aware: 3d94s2 -> 3d9 4s2)
  //  4-7  charge with magnitude after a boundary: Fe3+, Cu2+, Al3+
  //  8    state symbol
  //  9-11 subscript formula + optional trailing charge sign: H2O, NH4+, Ca(OH)2
  //  12-14 separated charge: "SO4 2-"
  //  15-16 trailing charge sign: Na+, OH-, e-
  //  17   delta sign
  const re = /(\d)([spdf])(\d{1,2}?)(?=\d[spdf]|[\s,.;)\]}]|$)|(^|[\s(\[=>\/+\-−\d])([A-Z][a-z]?)(\d+)([+−–\-])(?=[\s,.\]);}?!:(\/→]|$)|\((g|l|s|aq)\)|([A-Z][a-z]?|\))(\d+)([+−–\-]?)(?=[\s,.\]);}?!:(\/→]|[A-Za-z(]|$)|(\s)(\d+)([+−–\-])(?=[\s,.\]);}?!:(\/→]|$)|([A-Za-z)\]}])([+−–\-])(?=[\s,.\]);}?!:(\/→]|$)|δ([+−–\-])/g;

  let lastIdx = 0, key = 0;
  const result = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index === re.lastIndex) { re.lastIndex++; continue; } // guard against zero-width
    if (m.index > lastIdx) result.push(text.slice(lastIdx, m.index));

    if (m[2] !== undefined) {
      // Electron config: 1s2
      result.push(<span key={key++}>{m[1]}{m[2]}<sup>{m[3]}</sup></span>);
    } else if (m[5] !== undefined && m[7] !== undefined) {
      // Charge with magnitude: Fe3+ (m[4] is the captured leading boundary char)
      result.push(<span key={key++}>{m[4]}{m[5]}<sup>{m[6]}{sign(m[7])}</sup></span>);
    } else if (m[8] !== undefined) {
      // State symbol: (g), (l), (s), (aq)
      result.push(<sub key={key++}>({m[8]})</sub>);
    } else if (m[9] !== undefined && m[10] !== undefined) {
      // Subscript formula (+ optional charge sign): H2O, NH4+, Ca(OH)2
      result.push(<span key={key++}>{m[9]}<sub>{m[10]}</sub>{m[11] ? <sup>{sign(m[11])}</sup> : null}</span>);
    } else if (m[13] !== undefined && m[14] !== undefined) {
      // Separated charge: "SO4 2-" (m[12] is the leading space)
      result.push(<span key={key++}>{m[12]}<sup>{m[13]}{sign(m[14])}</sup></span>);
    } else if (m[15] !== undefined && m[16] !== undefined) {
      // Trailing charge sign: Na+, OH-, e-
      result.push(<span key={key++}>{m[15]}<sup>{sign(m[16])}</sup></span>);
    } else if (m[17] !== undefined) {
      // Delta: δ+, δ-
      result.push(<span key={key++}>δ<sup>{sign(m[17])}</sup></span>);
    }

    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) result.push(text.slice(lastIdx));
  return result.length > 0 ? result : text;
}
// --- Google Analytics helper ---
function track(event, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}

export default function App() {
  // --- Auth state ---
  const [authUser, setAuthUser] = useState(undefined); // undefined=loading, null=not logged in, object=logged in
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [accessKeyMsg, setAccessKeyMsg] = useState(null);
  const [accessKeyLoading, setAccessKeyLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // false = landing page, true = login screen
  const [pendingCheckout, setPendingCheckout] = useState(null); // null | "monthly" — auto-checkout after auth
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (user) {
        setAuthUser(user);
        try {
          const profile = await getOrCreateUserProfile(user);
          setUserProfile(profile);
          track("user_login", { method: user.providerData?.[0]?.providerId || "unknown", uid: user.uid });
        } catch (e) {
          console.error("Profile error:", e);
          setUserProfile({ role: "free" });
        }
      } else {
        setAuthUser(null);
        setUserProfile(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleRedeemKey = async () => {
    if (!accessKeyInput.trim() || !authUser) return;
    setAccessKeyLoading(true); setAccessKeyMsg(null);
    try {
      const result = await redeemAccessKey(authUser.uid, accessKeyInput.trim().toUpperCase());
      if (result.success) {
        setAccessKeyMsg({ type: "success", text: "Access key activated! You now have full access." });
        setUserProfile(prev => ({ ...prev, role: "access_key", accessKey: accessKeyInput.trim().toUpperCase(), accessKeyExpiry: result.expiresAt }));
        setAccessKeyInput("");
        track("redeem_access_key", { success: true });
      } else {
        setAccessKeyMsg({ type: "error", text: result.error });
        track("redeem_access_key", { success: false, error: result.error });
      }
    } catch (e) {
      setAccessKeyMsg({ type: "error", text: "Something went wrong. Please try again." });
    }
    setAccessKeyLoading(false);
  };

  const hasFullAccess = userProfile && (userProfile.role === "paid" || userProfile.role === "access_key" || userProfile.role === "admin");
  const isAdmin = userProfile && userProfile.role === "admin";

  const LockedBadge = () => (
    <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.55)", borderRadius: "6px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px", zIndex: 2 }}>
      <span style={{ fontSize: "11px" }}>🔒</span>
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>PRO</span>
    </div>
  );

  const LockedOverlay = ({ style }) => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(1px)", borderRadius: "inherit", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, ...style }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "22px", marginBottom: "4px" }}>🔒</div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45" }}>Unlock with access key</div>
      </div>
    </div>
  );

  // Auto-trigger checkout after sign-up if they clicked "Get full access" on landing page
  useEffect(() => {
    if (authUser && pendingCheckout && !authLoading) {
      const plan = pendingCheckout;
      setPendingCheckout(null);
      setShowLogin(false);
      // Small delay to let profile load
      setTimeout(() => handleCheckout(plan), 500);
    }
  }, [authUser, pendingCheckout, authLoading]); // eslint-disable-line

  // --- Stripe checkout ---
  const [checkoutLoading, setCheckoutLoading] = useState(null); // "monthly" | "yearly" | null
  const [showPricing, setShowPricing] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [cancelStep, setCancelStep] = useState(0); // 0=settings, 1=win-back, 2=confirm

  const handleCheckout = async (plan) => {
    if (!authUser) return;
    setCheckoutLoading(plan);
    try {
      const resp = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, uid: authUser.uid, email: authUser.email }),
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not start checkout");
      }
    } catch (err) {
      alert("Network error - please try again");
    }
    setCheckoutLoading(null);
  };

  const handleManageSubscription = async () => {
    if (!userProfile?.stripeCustomerId) return;
    try {
      const resp = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: userProfile.stripeCustomerId }),
      });
      const data = await resp.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Could not open subscription manager");
    }
  };

  // Check for payment success/cancel URL params
  const [paymentBanner, setPaymentBanner] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      setPaymentBanner("success");
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => setPaymentBanner(null), 8000);
    } else if (payment === "cancel") {
      setPaymentBanner("cancel");
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => setPaymentBanner(null), 5000);
    }
  }, []);

  const PricingCards = () => (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
      {/* Monthly */}
      <div style={{ background: "#fff", border: "2px solid #e0e8f0", borderRadius: "16px", padding: "20px", width: "180px", textAlign: "center" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Monthly</div>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#1a2d45" }}>£27.99</div>
        <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>per month</div>
        <button onClick={() => handleCheckout("monthly")} disabled={!!checkoutLoading}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: checkoutLoading ? "wait" : "pointer", fontFamily: "inherit", opacity: checkoutLoading === "yearly" ? 0.5 : 1 }}>
          {checkoutLoading === "monthly" ? "Loading..." : "Subscribe"}
        </button>
        <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "8px" }}>Cancel anytime</div>
      </div>
      {/* Yearly */}
      <div style={{ background: "#fff", border: "2px solid #29ABE2", borderRadius: "16px", padding: "20px", width: "180px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#29ABE2", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", letterSpacing: "0.5px" }}>SAVE 26%</div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#29ABE2", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Yearly</div>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#1a2d45" }}>£249.99</div>
        <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>per year (£20.83/mo)</div>
        <button onClick={() => handleCheckout("yearly")} disabled={!!checkoutLoading}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#1a2d45", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: checkoutLoading ? "wait" : "pointer", fontFamily: "inherit", opacity: checkoutLoading === "monthly" ? 0.5 : 1 }}>
          {checkoutLoading === "yearly" ? "Loading..." : "Subscribe"}
        </button>
        <div style={{ fontSize: "11px", color: "#29ABE2", marginTop: "8px", fontWeight: 600 }}>Best value</div>
      </div>
    </div>
  );

  const UpgradeCard = ({ section }) => (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>{section} is locked</h3>
        <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 8px" }}>
          Upgrade to ChemMastery Pro to unlock all content.
        </p>
        <PricingCards />
        <div style={{ marginTop: "20px", padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e0e8f0" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#4a6080", marginBottom: "8px" }}>HSJ Tuition student? Enter your free access key:</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <input value={accessKeyInput} onChange={e => setAccessKeyInput(e.target.value)} placeholder="e.g. HSJ-2026-ABCD"
              style={{ flex: 1, padding: "9px 10px", borderRadius: "8px", border: "1.5px solid #e0e8f0", fontSize: "13px", fontFamily: "inherit", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "#29ABE2"}
              onBlur={e => e.target.style.borderColor = "#e0e8f0"}
              onKeyDown={e => e.key === "Enter" && handleRedeemKey()}
            />
            <button onClick={handleRedeemKey} disabled={accessKeyLoading} style={{ padding: "9px 14px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: accessKeyLoading ? 0.6 : 1 }}>
              {accessKeyLoading ? "..." : "Redeem"}
            </button>
          </div>
          {accessKeyMsg && <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "8px", color: accessKeyMsg.type === "success" ? "#059669" : "#dc2626" }}>{accessKeyMsg.text}</div>}
        </div>
      </div>
    </div>
  );

  const [screen, setScreen] = useState("board");
  const [board, setBoard] = useState(null);
  const CURRENT_SECTIONS = board === "ocr" ? OCR_SECTIONS : SECTIONS;
  const CURRENT_TOPIC_ORDER = board === "ocr" ? OCR_TOPIC_ORDER : TOPIC_ORDER;

  // --- Free tier: first item in each section is free ---
  const FREE_FLASHCARD_SECTIONS = board === "ocr" ? ["ocr_mod2"] : ["physical_as"];
  const FREE_CALC_IDS = ["calc_moles"];
  const FREE_MECH_COUNT = 1; // first mechanism in each category
  const [topic, setTopic] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
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
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [revealedRoutes, setRevealedRoutes] = useState(new Set());
  const [topicsTab, setTopicsTab] = useState("home"); // "home" | "flashcards" | "synth" | "calc" | "extended" | "pathways" | "mechanisms" | "mcq" | "nmr"
  // NMR Practice state
  const [nmrSubTab, setNmrSubTab] = useState("challenges"); // "challenges" | "flashcards" | "mcqs"
  const [nmrChallengeIdx, setNmrChallengeIdx] = useState(0);
  const [nmrRevealed, setNmrRevealed] = useState(false);
  const [nmrFlashIdx, setNmrFlashIdx] = useState(0);
  const [nmrFlashFlipped, setNmrFlashFlipped] = useState(false);
  const [nmrMcqIdx, setNmrMcqIdx] = useState(0);
  const [nmrMcqSelected, setNmrMcqSelected] = useState(null);
  const [nmrMcqRevealed, setNmrMcqRevealed] = useState(false);
  const [nmrMcqScore, setNmrMcqScore] = useState({ correct: 0, total: 0 });
  const [extCategory, setExtCategory] = useState(null);
  const [extIndex, setExtIndex] = useState(0);
  const [extQPicker, setExtQPicker] = useState(false); // true = show question list, false = show question
  const [extRevealed, setExtRevealed] = useState(false);
  const [extMarked, setExtMarked] = useState(new Set());
  const [extDraft, setExtDraft] = useState("");
  const [extScore, setExtScore] = useState({}); // { questionId: marksAwarded }
  const [extAiResult, setExtAiResult] = useState(null);    // AI Examiner result
  const [extAiLoading, setExtAiLoading] = useState(false); // waiting for API
  const [extShowModel, setExtShowModel] = useState(false); // model answer toggle
  const [extAiError, setExtAiError] = useState(null);      // error message if API fails
  const [calcTopic, setCalcTopic] = useState(null);
  const [calcYear, setCalcYear] = useState("as"); // "as" | "a2"
  const [showPT, setShowPT] = useState(null); // null | "aqa" | "ocr"
  const [calcDifficulty, setCalcDifficulty] = useState(null); // null | "all" | "easy" | "medium" | "hard" | "exam"
  const [calcSortedQs, setCalcSortedQs] = useState([]); // questions sorted once when difficulty selected
  const [calcIndex, setCalcIndex] = useState(0);
  const [calcInput, setCalcInput] = useState("");
  const [calcChecked, setCalcChecked] = useState(false);
  const [calcShowSteps, setCalcShowSteps] = useState(false);
  const [calcShowHint, setCalcShowHint] = useState(false);
  const [calcScore, setCalcScore] = useState({}); // { topicId: { correct, attempted } }
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // --- Study streak & activity tracking ---
  const [studyLog, setStudyLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hsj-study-log") || "{}"); } catch { return {}; }
  });
  const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
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
  // Log a session on first load each day
  useEffect(() => {
    if (!studyLog[todayKey]?.sessions) logActivity("session");
  }, [todayKey]); // eslint-disable-line

  // Calculate streak
  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    // Check if active today, if not start from yesterday
    if (!studyLog[todayKey]) d.setDate(d.getDate() - 1);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (studyLog[key]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };
  const currentStreak = getStreak();

  // Score history for trends (stored in localStorage)
  const [scoreHistory, setScoreHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hsj-score-history") || "[]"); } catch { return []; }
  });
  const logScore = useCallback((type, topic, score, total) => {
    setScoreHistory(prev => {
      const entry = { date: todayKey, time: Date.now(), type, topic, score, total };
      const next = [...prev, entry].slice(-200); // keep last 200 entries
      try { localStorage.setItem("hsj-score-history", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [todayKey]);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const [mechId, setMechId] = useState(null);
  const [mechStep, setMechStep] = useState(0);
  const [mechOpenCards, setMechOpenCards] = useState({});
  // MCQ state
  const [mcqYear, setMcqYear] = useState("as"); // "as" | "a2"
  const [mcqTopic, setMcqTopic] = useState(null); // selected topic id
  const [mcqIdx, setMcqIdx] = useState(0); // current question index
  const [mcqSelected, setMcqSelected] = useState(null); // selected answer letter
  const [mcqRevealed, setMcqRevealed] = useState(false); // answer revealed
  const [mcqScore, setMcqScore] = useState({ correct: 0, total: 0 });
  const [mcqMode, setMcqMode] = useState("topic"); // "topic" | "random"
  const [mcqQuizSize, setMcqQuizSize] = useState(null); // null = not chosen, number = chosen
  const [mcqOpenCats, setMcqOpenCats] = useState({}); // { "Physical Chemistry": true }
  const [synthTab, setSynthTab] = useState("ali");
  const [selectedRxn, setSelectedRxn] = useState(null);
  const [synthQuiz, setSynthQuiz] = useState(false);
  // ── Random Quiz ──────────────────────────────────────────────────────────────
  const [quizScreen, setQuizScreen] = useState(null); // null | "setup" | "running" | "done"
  const [quizYear, setQuizYear] = useState("as");      // "as" | "a2" | "all"
  const [quizMode, setQuizMode] = useState("year");    // "year" | "topics"
  const [quizCount, setQuizCount] = useState(25);      // 25 | 50 | "custom"
  const [quizCustomCount, setQuizCustomCount] = useState(25);
  const [quizSelectedTopics, setQuizSelectedTopics] = useState([]);
  const [quizDeck, setQuizDeck] = useState([]);        // [{topicId, cardIdx, q, a}]
  const [quizPos, setQuizPos] = useState(0);
  const [quizFlipped, setQuizFlipped] = useState(false);
  const [quizSessionScore, setQuizSessionScore] = useState({ correct: 0, wrong: 0 });
  const [quizHistory, setQuizHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hsj-quiz-history') || '{}'); }
    catch { return {}; }
  });

  const cards = topic ? SETS[topic].cards : [];
  const currentCardIndex = order[index];
  const card = cards[currentCardIndex] || { q: "", a: "" };
  const knownKey = topic || "";
  const knownSet = known[knownKey] || new Set();
  const knownCount = knownSet.size;

  const selectBoard = (b) => { setBoard(b); setScreen("topics"); setTopicsTab("home"); track("select_board", { board: b }); };
  const selectTopic = (t) => {
    setTopic(t);
    const arr = SETS[t].cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    setOrder(arr);
    setIndex(0); setFlipped(false); setShuffled(true); setShowMenu(false);
    setScreen("cards");
    track("select_flashcard_topic", { topic: t, title: SETS[t]?.title, board });
  };
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      const serialisable = Object.fromEntries(Object.entries(known).map(([k, v]) => [k, [...v]]));
      localStorage.setItem('hsj-chem-known', JSON.stringify(serialisable));
    } catch {}
  }, [known]);

  // Save quiz history to localStorage
  useEffect(() => {
    try { localStorage.setItem('hsj-quiz-history', JSON.stringify(quizHistory)); }
    catch {}
  }, [quizHistory]);

  // ── Quiz helpers ─────────────────────────────────────────────────────────────
  const AQA_AS_SECTIONS = ["physical_as", "inorganic_as", "organic", "practicals_as"];
  const AQA_A2_SECTIONS = ["physical_a2", "inorganic_a2", "organic2", "practicals_a2"];
  const OCR_AS_SECTIONS = ["ocr_mod2", "ocr_mod3", "ocr_mod4"];
  const OCR_A2_SECTIONS = ["ocr_mod5", "ocr_mod6"];

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

    // Build weighted pool
    const pool = [];
    for (const topicId of eligibleTopics) {
      const cards = SETS[topicId].cards;
      cards.forEach((card, cardIdx) => {
        const key = `${topicId}-${cardIdx}`;
        const h = quizHistory[key];
        let weight;
        if (!h) {
          weight = 3; // never seen
        } else {
          const { c = 0, w = 0 } = h;
          const total = c + w;
          if (total === 0) { weight = 3; }
          else if (c >= 3 && c / total >= 0.7) { weight = 0.5; } // mastered
          else if (w > c) { weight = 4; } // more wrong than correct
          else { weight = 2; }
        }
        pool.push({ topicId, cardIdx, q: card.q, a: card.a, weight });
      });
    }
    if (pool.length === 0) return [];

    // Weighted random sample, capped at available pool
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

  const goBack = () => {
    if (screen === "cards") { setScreen("topics"); setTopic(null); }
    else if (screen === "dashboard") { setScreen("topics"); }
    else if (screen === "topics" && activeSection) { setActiveSection(null); }
    else if (screen === "topics") { setScreen("board"); setBoard(null); setTopicsTab("home"); }
  };

  const next = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.min(i + 1, order.length - 1)), 100); }, [order.length]);
  const prev = useCallback(() => { setFlipped(false); setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 100); }, []);
  const toggleKnown = useCallback(() => {
    setKnown(prev => {
      const s = new Set(prev[knownKey] || []);
      const wasKnown = s.has(currentCardIndex);
      wasKnown ? s.delete(currentCardIndex) : s.add(currentCardIndex);
      track("toggle_known", { topic, card_index: currentCardIndex, marked: !wasKnown });
      if (!wasKnown) logActivity("card");
      return { ...prev, [knownKey]: s };
    });
  }, [knownKey, currentCardIndex, topic]);

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

  useEffect(() => {
    if (screen !== "cards") return;
    const h = (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(f => !f); }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [screen, next, prev]);

  useEffect(() => {
    if (topicsTab !== "synth" || !selectedFrom) return;
    if (typeof window === "undefined" || !window.SmilesDrawer) return;
    const timer = setTimeout(() => {
      try {
        window.SmilesDrawer.apply({
          width: 160, height: 110,
          bondThickness: 1.5, bondLength: 30,
          fontSizeLarge: 8, fontSizeSmall: 6,
          padding: 10,
          themes: {
            light: { C:"#1a2d45", N:"#1d4ed8", O:"#dc2626", S:"#b45309",
                     Cl:"#15803d", Br:"#92400e", F:"#7c3aed", H:"#9ca3af",
                     BACKGROUND:"#f8fafc" }
          }
        });
      } catch(e) {}
    }, 120);
    return () => clearTimeout(timer);
  }, [topicsTab, selectedFrom, board, revealedRoutes]);

  const onTS = e => { touchStart.current = e.targetTouches[0].clientX; };
  const onTM = e => { touchEnd.current = e.targetTouches[0].clientX; };
  const onTE = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const d = touchStart.current - touchEnd.current;
    if (Math.abs(d) > 60) { d > 0 ? next() : prev(); }
    touchStart.current = null; touchEnd.current = null;
  };

  const bg = "#f0f4f8";
  const base = { minHeight: "100vh", background: bg, fontFamily: "'Outfit', 'DM Sans', 'Segoe UI', sans-serif", color: "#1a2d45", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" };

  // Inline SVG flask logo
  const FlaskLogo = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#29ABE2"/>
      <path d="M14 8h8v1.5l5.5 11.5A5 5 0 0 1 23 28H13a5 5 0 0 1-4.5-7L14 9.5V8z" fill="white" fillOpacity="0.15"/>
      <rect x="14" y="8" width="8" height="3" rx="1" fill="white"/>
      <path d="M14 11l-5.5 10.5A5 5 0 0 0 13 28h10a5 5 0 0 0 4.5-6.5L22 11" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
      <circle cx="15" cy="22" r="1.5" fill="#29ABE2" fillOpacity="0.9"/>
      <circle cx="20" cy="24" r="1" fill="#29ABE2" fillOpacity="0.9"/>
      <circle cx="18" cy="20" r="1" fill="#29ABE2" fillOpacity="0.9"/>
    </svg>
  );

  const Header = ({ sub, back }) => (
    <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: "14px", height: "72px", background: "#0f1d35", position: "relative", zIndex: 10, flexShrink: 0 }}>
      {back && <button onClick={back} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>}
      <div style={{ background: "#fff", borderRadius: "10px", padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "52px", objectFit: "contain", display: "block" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "18px", color: "#ffffff", letterSpacing: "-0.3px", lineHeight: 1.1 }}>HSJ TUITION</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "11px", color: "#29ABE2", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>A-Level Chemistry. Mastered.</div>
      </div>
      {/* User avatar */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowUserMenu(v => !v)} style={{
          width: "38px", height: "38px", borderRadius: "50%", border: "2px solid #29ABE2",
          background: authUser?.photoURL ? `url(${authUser.photoURL}) center/cover` : "#29ABE2",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: "inherit", padding: 0
        }}>
          {!authUser?.photoURL && (authUser?.displayName?.[0] || authUser?.email?.[0] || "?").toUpperCase()}
        </button>
        {showUserMenu && (
          <>
            <div onClick={() => setShowUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
            <div style={{ position: "absolute", right: 0, top: "48px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: "16px", minWidth: "240px", zIndex: 100 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "2px" }}>{authUser?.displayName || "Student"}</div>
              <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "12px" }}>{authUser?.email}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: hasFullAccess ? "#059669" : "#d97706", background: hasFullAccess ? "#ecfdf5" : "#fffbeb", borderRadius: "6px", padding: "4px 10px", display: "inline-block", marginBottom: "14px" }}>
                {userProfile?.role === "admin" ? "Admin" : userProfile?.role === "access_key" ? "Full Access (Key)" : userProfile?.role === "paid" ? "Full Access (Paid)" : "Free Plan"}
              </div>
              {userProfile?.role === "paid" && userProfile?.stripeCustomerId && (
                <button onClick={() => { setShowUserMenu(false); setShowAccountSettings(true); }} style={{
                  background: "none", border: "none", color: "#7a95b0", fontSize: "11px",
                  cursor: "pointer", fontFamily: "inherit", marginBottom: "8px", textDecoration: "underline"
                }}>Account settings</button>
              )}
              {!hasFullAccess && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#4a6080", marginBottom: "6px" }}>Have an access key?</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input value={accessKeyInput} onChange={e => setAccessKeyInput(e.target.value)} placeholder="e.g. HSJ-2026-ABCD"
                      style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #e0e8f0", fontSize: "13px", fontFamily: "inherit", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "#29ABE2"}
                      onBlur={e => e.target.style.borderColor = "#e0e8f0"}
                    />
                    <button onClick={handleRedeemKey} disabled={accessKeyLoading} style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: accessKeyLoading ? 0.6 : 1 }}>
                      {accessKeyLoading ? "..." : "Redeem"}
                    </button>
                  </div>
                  {accessKeyMsg && <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "6px", color: accessKeyMsg.type === "success" ? "#059669" : "#dc2626" }}>{accessKeyMsg.text}</div>}
                  <div style={{ borderTop: "1px solid #e0e8f0", marginTop: "12px", paddingTop: "12px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#4a6080", marginBottom: "8px" }}>Or upgrade to Pro</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleCheckout("monthly")} disabled={!!checkoutLoading} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {checkoutLoading === "monthly" ? "..." : "£27.99/mo"}
                      </button>
                      <button onClick={() => handleCheckout("yearly")} disabled={!!checkoutLoading} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#1a2d45", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {checkoutLoading === "yearly" ? "..." : "£249.99/yr"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={() => { logOut(); setShowUserMenu(false); }} style={{
                width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid #e0e8f0",
                background: "#ffffff", color: "#dc2626", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit"
              }}>Log out</button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Rich chemistry background artwork for card thumbnails
  const ChemArt = ({ id }) => {
    const s = { position: "absolute", inset: 0, pointerEvents: "none", userSelect: "none", opacity: 0.2 };
    const W = "100%", H = "100%";
    if (id === "aqa") return (
      <svg style={s} width={W} height={H} viewBox="0 0 400 170" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* AQA -dense organic chemistry art filling the whole card */}
        {/* Naphthalene (two fused benzene rings) -top-right */}
        <polygon points="238,10 260,22 260,46 238,58 216,46 216,22" stroke="white" strokeWidth="2.2" fill="none"/>
        <polygon points="282,10 304,22 304,46 282,58 260,46 260,22" stroke="white" strokeWidth="2.2" fill="none"/>
        {/* Naphthalene double bonds */}
        <line x1="216" y1="22" x2="238" y2="10" stroke="white" strokeWidth="1.4"/>
        <line x1="238" y1="58" x2="260" y2="46" stroke="white" strokeWidth="1.4"/>
        <line x1="260" y1="22" x2="282" y2="10" stroke="white" strokeWidth="1.4"/>
        <line x1="282" y1="58" x2="304" y2="46" stroke="white" strokeWidth="1.4"/>
        {/* Flask -far right filling top gap */}
        <path d="M348,8 L348,40 L328,78 Q323,88 333,92 L379,92 Q389,88 384,78 L364,40 L364,8 Z" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="344" y1="22" x2="368" y2="22" stroke="white" strokeWidth="1.5"/>
        <ellipse cx="356" cy="76" rx="10" ry="5" stroke="white" strokeWidth="1.5"/>
        <circle cx="348" cy="68" r="3" fill="white"/>
        <circle cx="362" cy="74" r="2.5" fill="white"/>
        <circle cx="355" cy="62" r="2" fill="white"/>
        {/* Long skeletal chain top-left */}
        <polyline points="12,62 34,40 56,62 78,40 100,62 122,40 144,62 166,40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Double bond */}
        <line x1="34" y1="40" x2="56" y2="62" stroke="white" strokeWidth="1.5"/>
        <line x1="37" y1="36" x2="59" y2="58" stroke="white" strokeWidth="1.5"/>
        {/* NH₂ branch */}
        <line x1="78" y1="40" x2="78" y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <text x="70" y="13" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">NH₂</text>
        {/* OH end */}
        <line x1="166" y1="40" x2="182" y2="24" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <text x="184" y="22" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">OH</text>
        {/* Reaction arrow centre */}
        <line x1="174" y1="76" x2="234" y2="76" stroke="white" strokeWidth="2"/>
        <polygon points="230,71 242,76 230,81" fill="white"/>
        <text x="184" y="68" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">HBr/Δ</text>
        {/* Cyclohexane ring bottom-left */}
        <polygon points="44,120 66,108 88,120 88,144 66,156 44,144" stroke="white" strokeWidth="2" fill="none"/>
        {/* Cyclohexane chair bond angles */}
        <line x1="44" y1="120" x2="28" y2="130" stroke="white" strokeWidth="1.5"/>
        <line x1="88" y1="120" x2="104" y2="130" stroke="white" strokeWidth="1.5"/>
        {/* Benzene -centre-bottom */}
        <polygon points="160,108 180,97 200,108 200,130 180,141 160,130" stroke="white" strokeWidth="2.2" fill="none"/>
        <circle cx="180" cy="119" r="13" stroke="white" strokeWidth="1.3" fill="none"/>
        {/* COOH attached to benzene -at top-right vertex (200,108) */}
        <line x1="200" y1="108" x2="222" y2="100" stroke="white" strokeWidth="1.8"/>
        <text x="224" y="104" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">COOH</text>
        {/* Ester linkage bottom-right */}
        <text x="268" y="130" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">-COO-</text>
        <polyline points="268,140 288,155 308,140 328,155" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
    if (id === "ocr") return (
      <svg style={s} width={W} height={H} viewBox="0 0 400 170" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* OCR A -physical/inorganic chemistry, fills whole card */}
        {/* Atomic orbitals top-right */}
        <circle cx="330" cy="48" r="42" stroke="white" strokeWidth="1.5" strokeDasharray="6 4"/>
        <circle cx="330" cy="48" r="26" stroke="white" strokeWidth="1.5" strokeDasharray="4 5"/>
        <circle cx="330" cy="48" r="9" stroke="white" strokeWidth="2.5"/>
        <circle cx="330" cy="6" r="4" fill="white"/>
        <circle cx="372" cy="48" r="4" fill="white"/>
        <circle cx="330" cy="90" r="4" fill="white"/>
        <circle cx="288" cy="48" r="4" fill="white"/>
        {/* Energy level diagram left */}
        <line x1="14" y1="142" x2="14" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="10,20 14,8 18,20" fill="white"/>
        <text x="6" y="10" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">E</text>
        <line x1="22" y1="132" x2="68" y2="132" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="110" x2="68" y2="110" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="88" x2="68" y2="88" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="58" x2="68" y2="58" stroke="white" strokeWidth="2.5"/>
        <line x1="22" y1="36" x2="68" y2="36" stroke="white" strokeWidth="2.5"/>
        <path d="M 48 130 C 58 120, 58 114, 48 108" stroke="white" strokeWidth="1.8" fill="none"/>
        <polygon points="44,110 48,100 54,110" fill="white"/>
        <line x1="74" y1="132" x2="74" y2="58" stroke="white" strokeWidth="1.5"/>
        <polygon points="70,62 74,50 78,62" fill="white"/>
        <text x="78" y="98" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">ΔH</text>
        {/* Activation energy curve -upper-middle fills gap */}
        <path d="M 96,90 C 116,90 126,18 156,14 C 186,10 196,90 216,90" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="96" y1="90" x2="96" y2="110" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
        <line x1="216" y1="90" x2="216" y2="110" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
        <line x1="155" y1="14" x2="155" y2="90" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
        <text x="158" y="55" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Ea</text>
        <text x="85" y="105" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">R</text>
        <text x="210" y="105" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">P</text>
        {/* Equilibrium arrows */}
        <line x1="96" y1="128" x2="168" y2="128" stroke="white" strokeWidth="2"/>
        <polygon points="164,123 176,128 164,133" fill="white"/>
        <line x1="168" y1="140" x2="96" y2="140" stroke="white" strokeWidth="2"/>
        <polygon points="100,135 88,140 100,145" fill="white"/>
        {/* Kc expression */}
        <text x="86" y="158" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Kc=[C][D]/[A][B]</text>
        {/* pH titration S-curve bottom-right */}
        <path d="M 228,162 C 238,162 244,150 248,138 C 256,112 268,106 278,80 C 288,54 292,42 302,28" stroke="white" strokeWidth="2" fill="none"/>
        <line x1="222" y1="90" x2="310" y2="90" stroke="white" strokeWidth="1.3"/>
        <line x1="228" y1="28" x2="228" y2="166" stroke="white" strokeWidth="1.3"/>
        <text x="230" y="26" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">pH</text>
        <text x="296" y="102" fill="white" fontSize="9" fontFamily="'Space Mono',monospace">V</text>
      </svg>
    );
    if (id === "flashcards") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Large benzene top-right */}
        <polygon points="248,5 272,19 272,47 248,61 224,47 224,19" stroke="white" strokeWidth="2.5"/>
        <circle cx="248" cy="33" r="18" stroke="white" strokeWidth="1.5"/>
        {/* Small benzene mid-left */}
        <polygon points="38,52 52,60 52,76 38,84 24,76 24,60" stroke="white" strokeWidth="2"/>
        <circle cx="38" cy="68" r="11" stroke="white" strokeWidth="1.2"/>
        {/* Skeletal chain bottom */}
        <polyline points="20,128 42,106 64,128 86,106 108,128 130,106 152,128" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Double bond */}
        <line x1="42" y1="106" x2="64" y2="128" stroke="white" strokeWidth="1.5"/>
        <line x1="45" y1="102" x2="67" y2="124" stroke="white" strokeWidth="1.5"/>
        {/* OH end group */}
        <line x1="152" y1="128" x2="168" y2="110" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <text x="170" y="108" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">OH</text>
        {/* Reaction arrow */}
        <line x1="170" y1="45" x2="214" y2="45" stroke="white" strokeWidth="1.8"/>
        <polygon points="210,40 222,45 210,50" fill="white"/>
        {/* NH₂ branch */}
        <line x1="86" y1="106" x2="86" y2="84" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <text x="79" y="78" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">NH₂</text>
      </svg>
    );
    if (id === "synth") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Benzene ring top-right */}
        <polygon points="252,6 274,19 274,45 252,58 230,45 230,19" stroke="white" strokeWidth="2.5"/>
        <circle cx="252" cy="32" r="16" stroke="white" strokeWidth="1.5"/>
        {/* Reactant skeletal left */}
        <polyline points="14,92 36,68 58,92 80,68" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Double bond on reactant */}
        <line x1="36" y1="68" x2="58" y2="92" stroke="white" strokeWidth="1.5"/>
        <line x1="39" y1="64" x2="61" y2="88" stroke="white" strokeWidth="1.5"/>
        {/* Big reaction arrow */}
        <line x1="96" y1="78" x2="168" y2="78" stroke="white" strokeWidth="2.5"/>
        <polygon points="164,72 178,78 164,84" fill="white"/>
        {/* Δ above arrow */}
        <text x="122" y="68" fill="white" fontSize="14" fontFamily="'Space Mono',monospace">Δ</text>
        {/* Reagent below */}
        <text x="102" y="96" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">H₂SO₄</text>
        {/* Product skeletal right */}
        <polyline points="186,92 208,68 230,92" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* Br branch on product */}
        <line x1="208" y1="68" x2="208" y2="46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <text x="202" y="40" fill="white" fontSize="11" fontFamily="'Space Mono',monospace">Br</text>
        {/* Dashed bottom chain continuation */}
        <polyline points="14,125 36,110 58,125 80,110 102,125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 4"/>
        {/* Small benzene far right */}
        <polygon points="278,88 292,96 292,112 278,120 264,112 264,96" stroke="white" strokeWidth="1.8"/>
        <circle cx="278" cy="104" r="10" stroke="white" strokeWidth="1.2"/>
      </svg>
    );
    if (id === "pathways") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Benzene top-right */}
        <polygon points="252,6 274,19 274,45 252,58 230,45 230,19" stroke="white" strokeWidth="2.5"/>
        <circle cx="252" cy="32" r="16" stroke="white" strokeWidth="1.5"/>
        {/* Central molecule */}
        <circle cx="80" cy="60" r="8" stroke="white" strokeWidth="2" fill="none"/>
        {/* Branching arrows */}
        <line x1="80" y1="52" x2="80" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="76,22 80,10 84,22" fill="white"/>
        <line x1="72" y1="64" x2="22" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="27,100 18,108 24,96" fill="white"/>
        <line x1="88" y1="64" x2="138" y2="100" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="133,96 142,104 133,108" fill="white"/>
        <line x1="88" y1="58" x2="140" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="135,34 144,26 140,38" fill="white"/>
        {/* Labels */}
        <text x="68" y="8" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Alkene</text>
        <text x="143" y="30" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Alcohol</text>
        <text x="145" y="104" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Halide</text>
        <text x="0" y="115" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">Amine</text>
        {/* Skeletal chain top area */}
        <polyline points="170,18 190,38 210,18 230,38" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3"/>
        {/* Small benzene bottom right */}
        <polygon points="240,98 256,107 256,125 240,134 224,125 224,107" stroke="white" strokeWidth="2"/>
        <circle cx="240" cy="116" r="11" stroke="white" strokeWidth="1.2"/>
      </svg>
    );
    if (id === "calc") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* n = m / Mr large fraction */}
        <text x="160" y="38" fill="white" fontSize="22" fontFamily="'Space Mono',monospace" fontWeight="700">n = m</text>
        <line x1="160" y1="46" x2="248" y2="46" stroke="white" strokeWidth="2.2"/>
        <text x="178" y="68" fill="white" fontSize="22" fontFamily="'Space Mono',monospace" fontWeight="700">Mᵣ</text>
        {/* c = n/V */}
        <text x="164" y="96" fill="white" fontSize="14" fontFamily="'Space Mono',monospace">c = n/V</text>
        {/* PV = nRT */}
        <text x="158" y="118" fill="white" fontSize="14" fontFamily="'Space Mono',monospace">PV = nRT</text>
        {/* Benzene small left */}
        <polygon points="42,30 58,39 58,57 42,66 26,57 26,39" stroke="white" strokeWidth="2"/>
        <circle cx="42" cy="48" r="11" stroke="white" strokeWidth="1.2"/>
        {/* ΔH = ... */}
        <text x="16" y="96" fill="white" fontSize="13" fontFamily="'Space Mono',monospace">ΔH = −kJ</text>
        {/* Skeletal snippet bottom-left */}
        <polyline points="16,128 34,112 52,128 70,112" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Arrow */}
        <line x1="80" y1="48" x2="136" y2="48" stroke="white" strokeWidth="1.8"/>
        <polygon points="132,43 144,48 132,53" fill="white"/>
        <text x="95" y="40" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">mol</text>
      </svg>
    );
    if (id === "extended") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Large tick top-right */}
        <polyline points="210,25 234,52 278,8" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Benzene left */}
        <polygon points="40,14 58,24 58,44 40,54 22,44 22,24" stroke="white" strokeWidth="2"/>
        <circle cx="40" cy="34" r="12" stroke="white" strokeWidth="1.2"/>
        {/* Mark scheme lines */}
        <rect x="16" y="72" width="10" height="10" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="34" y1="77" x2="120" y2="77" stroke="white" strokeWidth="1.5"/>
        <rect x="16" y="92" width="10" height="10" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="34" y1="97" x2="150" y2="97" stroke="white" strokeWidth="1.5"/>
        <rect x="16" y="112" width="10" height="10" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="34" y1="117" x2="100" y2="117" stroke="white" strokeWidth="1.5"/>
        {/* Checkmarks in two boxes */}
        <polyline points="18,76 21,80 26,72" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="18,96 21,100 26,92" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Skeletal formula right */}
        <polyline points="168,108 188,88 208,108 228,88 248,108" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="248" y1="108" x2="264" y2="92" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
    if (id === "mechanisms") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* Central C atom */}
        <text x="130" y="76" fill="white" fontSize="18" fontFamily="'Space Mono',monospace" fontWeight="700">C</text>
        {/* Bonds from central C */}
        <line x1="140" y1="58" x2="140" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="148" y1="70" x2="184" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="140" y1="82" x2="140" y2="112" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="132" y1="70" x2="96" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        {/* δ+ on central C */}
        <text x="148" y="72" fill="white" fontSize="12" fontFamily="'Space Mono',monospace">δ+</text>
        {/* Nucleophile curly arrow */}
        <path d="M 60 68 C 60 40, 110 30, 132 62" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <polygon points="126,56 134,64 138,54" fill="white"/>
        <text x="20" y="74" fill="white" fontSize="12" fontFamily="'Space Mono',monospace">Nu:</text>
        <text x="18" y="58" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">δ–</text>
        {/* Leaving group curly arrow */}
        <path d="M 158 64 C 195 54, 210 68, 208 88" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <polygon points="203,84 208,96 214,84" fill="white"/>
        <text x="194" y="58" fill="white" fontSize="10" fontFamily="'Space Mono',monospace">:X</text>
        {/* Benzene ring bottom-right */}
        <polygon points="246,94 264,104 264,124 246,134 228,124 228,104" stroke="white" strokeWidth="2"/>
        <circle cx="246" cy="114" r="12" stroke="white" strokeWidth="1.2"/>
        {/* Small skeletal top-right */}
        <polyline points="210,14 228,28 246,14 264,28" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Double bond */}
        <line x1="228" y1="28" x2="246" y2="14" stroke="white" strokeWidth="1.5"/>
        <line x1="231" y1="32" x2="249" y2="18" stroke="white" strokeWidth="1.5"/>
      </svg>
    );
    if (id === "mcq") return (
      <svg style={s} width={W} height={H} viewBox="0 0 300 140" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* MCQ bubbles */}
        <circle cx="80" cy="40" r="14" stroke="white" strokeWidth="2.5"/>
        <circle cx="80" cy="75" r="14" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.3)"/>
        <circle cx="80" cy="110" r="14" stroke="white" strokeWidth="2.5"/>
        {/* Labels */}
        <text x="80" y="45" textAnchor="middle" fill="white" fontSize="14" fontFamily="'Space Mono',monospace" fontWeight="700">A</text>
        <text x="80" y="80" textAnchor="middle" fill="white" fontSize="14" fontFamily="'Space Mono',monospace" fontWeight="700">B</text>
        <text x="80" y="115" textAnchor="middle" fill="white" fontSize="14" fontFamily="'Space Mono',monospace" fontWeight="700">C</text>
        {/* Lines representing text */}
        <line x1="110" y1="40" x2="220" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="110" y1="75" x2="240" y2="75" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="110" y1="110" x2="200" y2="110" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        {/* Checkmark on B */}
        <polyline points="72,75 78,82 90,68" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    return null;
  };

  // AUTH LOADING
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}><span style={{ color: "#29ABE2" }}>Chem</span>Mastery</div>
        <div style={{ color: "#7a95b0", fontSize: "14px" }}>Loading...</div>
      </div>
    </div>
  );

  // LANDING PAGE / LOGIN SCREEN
  if (!authUser) {
    if (showLogin) return <LoginScreen onBack={() => { setShowLogin(false); setPendingCheckout(null); }} />;
    return <>
      <LandingPage onGoToLogin={() => setShowLogin(true)} onGoToCheckout={() => setShowEmailPrompt(true)} />
      {showEmailPrompt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans',sans-serif" }} onClick={(e) => { if (e.target === e.currentTarget) setShowEmailPrompt(false); }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📧</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#1a2d45", marginBottom: "6px" }}>Enter your email to continue</div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.5 }}>We'll create your account and send login details to this email after payment.</div>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = guestEmail.trim();
              if (!email || !email.includes("@")) return;
              try {
                const resp = await fetch("/api/create-checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan: "monthly", email }),
                });
                const data = await resp.json();
                if (data.url) window.location.href = data.url;
                else alert(data.error || "Could not start checkout");
              } catch (err) { alert("Network error. Please try again."); }
            }}>
              <input type="email" placeholder="your@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required autoFocus
                style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "16px", fontFamily: "inherit", outline: "none", marginBottom: "16px", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#29ABE2"}
                onBlur={e => e.target.style.borderColor = "#e0e8f0"}
              />
              <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                Continue to payment →
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button onClick={() => { setShowEmailPrompt(false); setShowLogin(true); }} style={{ background: "none", border: "none", color: "#29ABE2", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Already have an account? Log in
              </button>
            </div>
          </div>
        </div>
      )}
    </>;
  }

  // CHANGE PASSWORD PROMPT (for guest checkout users with temp password)
  if (userProfile?.needsPasswordChange && !passwordChanged) {
    const handleChangePassword = async (e) => {
      e.preventDefault();
      setPasswordChangeError("");
      if (newPassword.length < 6) { setPasswordChangeError("Password must be at least 6 characters"); return; }
      if (newPassword !== confirmNewPassword) { setPasswordChangeError("Passwords do not match"); return; }
      setPasswordChangeLoading(true);
      try {
        const { updatePassword } = await import("firebase/auth");
        const { getAuth } = await import("firebase/auth");
        await updatePassword(getAuth().currentUser, newPassword);
        // Clear the flag in Firestore
        const { getFirestore, doc, updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(getFirestore(), "users", authUser.uid), { needsPasswordChange: false });
        setUserProfile(prev => ({ ...prev, needsPasswordChange: false }));
        setPasswordChanged(true);
      } catch (err) {
        setPasswordChangeError(err.message || "Failed to change password. Please try again.");
      }
      setPasswordChangeLoading(false);
    };

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d1b2a 0%, #1b2d45 50%, #0d1b2a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔐</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "26px", color: "#fff", marginBottom: "8px" }}>Set Your Password</div>
            <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
              You signed up with a temporary password. Please choose a new one to keep your account secure.
            </div>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <form onSubmit={handleChangePassword}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a6080", marginBottom: "6px" }}>New password</label>
              <input type="password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "16px", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#29ABE2"}
                onBlur={e => e.target.style.borderColor = "#e0e8f0"}
              />
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a6080", marginBottom: "6px" }}>Confirm new password</label>
              <input type="password" placeholder="Type it again" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "16px", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#29ABE2"}
                onBlur={e => e.target.style.borderColor = "#e0e8f0"}
              />
              {passwordChangeError && <div style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600, marginBottom: "12px", padding: "8px 12px", background: "#fef2f2", borderRadius: "8px" }}>{passwordChangeError}</div>}
              <button type="submit" disabled={passwordChangeLoading} style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: "#29ABE2", color: "#ffffff", fontSize: "15px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", opacity: passwordChangeLoading ? 0.6 : 1
              }}>
                {passwordChangeLoading ? "Updating..." : "Set New Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ACCOUNT SETTINGS MODAL (buried - only for paid users managing subscription)
  if (showAccountSettings) return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: "14px", height: "72px", background: "#0f1d35", flexShrink: 0 }}>
        <button onClick={() => { setShowAccountSettings(false); setCancelStep(0); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "17px", color: "#ffffff" }}>Account Settings</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: "400px", width: "100%" }}>
          {cancelStep === 0 && (
            <div>
              <div style={{ background: "#ecfdf5", border: "1.5px solid #059669", borderRadius: "14px", padding: "20px", marginBottom: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669", marginBottom: "4px" }}>ChemMastery Pro - Active</div>
                <div style={{ fontSize: "12px", color: "#047857" }}>You have full access to all content</div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "16px" }}>Account</div>
              <div style={{ fontSize: "13px", color: "#7a95b0", marginBottom: "6px" }}>{authUser?.email}</div>
              <div style={{ fontSize: "13px", color: "#7a95b0", marginBottom: "24px" }}>{authUser?.displayName || "Student"}</div>
              <div style={{ borderTop: "1px solid #e0e8f0", paddingTop: "20px" }}>
                <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "12px" }}>Subscription</div>
                <button onClick={() => setCancelStep(1)} style={{
                  background: "none", border: "none", color: "#94a3b8", fontSize: "12px",
                  cursor: "pointer", fontFamily: "inherit", textDecoration: "underline"
                }}>Cancel subscription</button>
              </div>
            </div>
          )}
          {cancelStep === 1 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "16px", color: "#7a95b0", fontWeight: 700 }}>Before you go...</div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>We would hate to see you go!</h3>
              <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 24px" }}>
                You will lose access to all premium content including flashcards, calculations, synthesis routes and AI marking.
              </p>
              <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "2px solid #f59e0b", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#92400e", marginBottom: "4px" }}>Stay for 50% off!</div>
                <div style={{ fontSize: "13px", color: "#a16207", marginBottom: "12px" }}>Get your next month for just £14.99 instead of £27.99</div>
                <button onClick={() => { setShowAccountSettings(false); setCancelStep(0); }} style={{
                  padding: "10px 24px", borderRadius: "10px", border: "none",
                  background: "#f59e0b", color: "#fff", fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(245,158,11,0.35)"
                }}>Keep my subscription</button>
              </div>
              <button onClick={() => setCancelStep(2)} style={{
                background: "none", border: "none", color: "#94a3b8", fontSize: "12px",
                cursor: "pointer", fontFamily: "inherit", textDecoration: "underline"
              }}>I still want to cancel</button>
            </div>
          )}
          {cancelStep === 2 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>Are you sure?</h3>
              <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 24px" }}>
                Your access will continue until the end of your current billing period. After that, your account will be downgraded to the free plan.
              </p>
              <button onClick={handleManageSubscription} style={{
                padding: "10px 24px", borderRadius: "10px", border: "1.5px solid #dc2626",
                background: "#fff", color: "#dc2626", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", marginBottom: "12px", width: "100%"
              }}>Proceed to cancellation</button>
              <br />
              <button onClick={() => { setShowAccountSettings(false); setCancelStep(0); }} style={{
                padding: "10px 24px", borderRadius: "10px", border: "none",
                background: "#29ABE2", color: "#fff", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", width: "100%",
                boxShadow: "0 4px 16px rgba(41,171,226,0.35)"
              }}>Never mind, keep my subscription</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // BOARD SELECT
  if (screen === "board") return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Header />
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#29ABE2", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 8px" }}>ChemMastery</p>
        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: 800, color: "#1a2d45", margin: "0 0 36px", letterSpacing: "-0.5px" }}>Choose your exam board</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", width: "100%", maxWidth: "720px" }}>
          {[
            { id: "aqa", label: "AQA", sub: "Chemistry", desc: "Year 1 and Year 2. Full spec coverage.", accent: "#29ABE2", grad: "linear-gradient(145deg,#29ABE2 0%,#0e7ab5 60%,#085f8f 100%)", features: ["Organic","Physical","Inorganic","Req. Practicals"] },
            { id: "ocr", label: "OCR A", sub: "Chemistry", desc: "Modules 2-6 fully covered. Module 1 is PAG practical skills only.", accent: "#7c3aed", grad: "linear-gradient(145deg,#a855f7 0%,#7c3aed 55%,#5b21b6 100%)", features: ["Modules 2-6","Organic","Physical","PAG Skills"] },
          ].map(b => (
            <button key={b.id} onClick={() => selectBoard(b.id)} style={{
              border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0,
              background: "#fff", borderRadius: "24px", overflow: "hidden",
              boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
              transition: "transform 0.18s, box-shadow 0.18s",
              textAlign: "left", width: "100%",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.16)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 30px rgba(0,0,0,0.1)"; }}
            >
              {/* Header gradient with chemistry icons */}
              <div style={{ background: b.grad, padding: "clamp(28px, 5vw, 44px) 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>EXAM BOARD</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(36px, 8vw, 48px)", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "4px" }}>{b.label}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{b.sub}</div>
                </div>
              </div>
              {/* Card body */}
              <div style={{ padding: "20px 24px 24px" }}>
                <div style={{ fontSize: "15px", color: "#4a6080", lineHeight: 1.5, marginBottom: "16px" }}>{b.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                  {b.features.map(f => (
                    <span key={f} style={{ fontSize: "12px", fontWeight: 600, color: b.accent, background: `${b.accent}12`, border: `1px solid ${b.accent}30`, borderRadius: "8px", padding: "5px 12px" }}>{f}</span>
                  ))}
                </div>
                <div style={{ background: b.accent, color: "#fff", borderRadius: "14px", padding: "14px", textAlign: "center", fontSize: "16px", fontWeight: 700, fontFamily: "inherit" }}>
                  Let's Go →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // DASHBOARD
  if (screen === "dashboard") {
    const allTopics = CURRENT_TOPIC_ORDER.map(id => {
      const s = SETS[id];
      const k = (known[id] || new Set()).size;
      const pct = Math.round((k / s.cards.length) * 100);
      return { id, title: s.title, total: s.cards.length, mastered: k, pct };
    });
    const totalCards = allTopics.reduce((a, t) => a + t.total, 0);
    const totalMastered = allTopics.reduce((a, t) => a + t.mastered, 0);
    const overallPct = Math.round((totalMastered / totalCards) * 100);
    const started = allTopics.filter(t => t.mastered > 0);
    const needsWork = [...allTopics].filter(t => t.pct < 70).sort((a, b) => a.pct - b.pct).slice(0, 5);
    const goingWell = [...allTopics].filter(t => t.pct >= 70).sort((a, b) => b.pct - a.pct);

    const StatCard = ({ label, value, sub, color }) => (
      <div style={{ background: "#ffffff", borderRadius: "16px", padding: "16px", flex: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderTop: `4px solid ${color}` }}>
        <div style={{ fontSize: "28px", fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginTop: "2px" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "2px" }}>{sub}</div>}
      </div>
    );

    const TopicRow = ({ t, showBar }) => (
      <div onClick={() => { setActiveSection(null); selectTopic(t.id); }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#ffffff", borderRadius: "12px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showBar ? "5px" : 0 }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#29ABE2", marginRight: "6px" }}>{t.id}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a2d45" }}>{t.title}</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: t.pct === 0 ? "#b0c4d4" : t.pct === 100 ? "#29ABE2" : "#1a8fc4", flexShrink: 0, marginLeft: "8px" }}>{t.pct}%</span>
          </div>
          {showBar && <div style={{ height: "4px", background: "#e8edf3", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${t.pct}%`, background: "linear-gradient(90deg, #29ABE2, #1a8fc4)", borderRadius: "2px" }} />
          </div>}
        </div>
        <div style={{ fontSize: "11px", color: "#7a95b0", flexShrink: 0 }}>{t.mastered}/{t.total}</div>
      </div>
    );

    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
        <Header sub="Progress Dashboard" back={goBack} />
        {(() => {
          const td = studyLog[todayKey] || {};
          const tdTotal = (td.cards||0) + (td.calcs||0) + (td.extended||0) + (td.mechanisms||0);
          return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Top row: Streak + Progress + Today */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "16px", padding: "16px", color: "#fff", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 900 }}>&#x2731;</div>
                <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1 }}>{currentStreak}</div>
                <div style={{ fontSize: "11px", fontWeight: 600, opacity: 0.9, marginTop: "2px" }}>day streak</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #29ABE2, #1a8fc4)", borderRadius: "16px", padding: "16px", color: "#fff", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, opacity: 0.8 }}>Mastered</div>
                <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.2 }}>{overallPct}%</div>
                <div style={{ fontSize: "10px", opacity: 0.8 }}>{totalMastered}/{totalCards}</div>
              </div>
              <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#7a95b0" }}>Today</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#1a2d45", lineHeight: 1.2 }}>{tdTotal}</div>
                <div style={{ fontSize: "10px", color: "#7a95b0" }}>actions</div>
              </div>
            </div>

            {/* Today breakdown */}
            <div style={{ display: "flex", gap: "6px" }}>
              {[{l:"Cards",v:td.cards||0,c:"#29ABE2",b:"#f0f9ff"},{l:"Calcs",v:td.calcs||0,c:"#0284c7",b:"#f0f9ff"},{l:"Extended",v:td.extended||0,c:"#7c3aed",b:"#f5f3ff"},{l:"Mechs",v:td.mechanisms||0,c:"#d97706",b:"#fff7ed"}].map(s=>(
                <div key={s.l} style={{ flex:1, textAlign:"center", padding:"8px 4px", background:s.b, borderRadius:"10px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:"9px", color:"#7a95b0", fontWeight:600 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Activity heatmap */}
            <div style={{ background:"#fff", borderRadius:"14px", padding:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                <span style={{ fontSize:"12px", fontWeight:700, color:"#1a2d45" }}>Last 28 Days</span>
                <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                  <span style={{ fontSize:"9px", color:"#94a3b8" }}>Less</span>
                  {["#edf2f7","#bae6fd","#38bdf8","#0284c7","#0c4a6e"].map(c=><div key={c} style={{ width:"8px", height:"8px", borderRadius:"2px", background:c }}/>)}
                  <span style={{ fontSize:"9px", color:"#94a3b8" }}>More</span>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"3px" }}>
                {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{ fontSize:"9px", color:"#94a3b8", textAlign:"center", fontWeight:600 }}>{d}</div>)}
                {(()=>{
                  const cells=[]; const now=new Date(); const st=new Date(now);
                  st.setDate(st.getDate()-27-((st.getDay()+6)%7));
                  for(let i=0;i<28;i++){const d=new Date(st);d.setDate(d.getDate()+i);const k=d.toISOString().slice(0,10);const dd=studyLog[k];
                  const tot=dd?(dd.cards||0)+(dd.calcs||0)+(dd.extended||0)+(dd.mechanisms||0):0;
                  const int=tot===0?0:tot<5?1:tot<15?2:tot<30?3:4;
                  cells.push(<div key={k} title={`${k}: ${tot}`} style={{aspectRatio:"1",borderRadius:"3px",background:["#edf2f7","#bae6fd","#38bdf8","#0284c7","#0c4a6e"][int],border:k===todayKey?"2px solid #f59e0b":"none"}}/>);}
                  return cells;
                })()}
              </div>
            </div>

            {/* Section progress */}
            <div style={{ background:"#fff", borderRadius:"14px", padding:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:"#1a2d45", marginBottom:"10px" }}>Progress by Section</div>
              {CURRENT_SECTIONS.map(sec=>{
                const sT=sec.topics.reduce((a,id)=>a+SETS[id].cards.length,0);
                const sM=sec.topics.reduce((a,id)=>a+(known[id]||new Set()).size,0);
                const sP=Math.round((sM/sT)*100);
                return(<div key={sec.id} style={{ marginBottom:"8px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                    <span style={{ fontSize:"12px", fontWeight:600, color:"#1a2d45" }}>{sec.label}</span>
                    <span style={{ fontSize:"11px", fontWeight:700, color:sP===0?"#94a3b8":"#29ABE2" }}>{sP}% · {sM}/{sT}</span>
                  </div>
                  <div style={{ height:"4px", background:"#e8edf3", borderRadius:"2px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${sP}%`, background:"linear-gradient(90deg,#29ABE2,#1a8fc4)", borderRadius:"2px" }}/>
                  </div>
                </div>);
              })}
            </div>

            {/* Quick stats */}
            <div style={{ display:"flex", gap:"8px" }}>
              <div style={{ flex:1, background:"#fff", borderRadius:"12px", padding:"12px", textAlign:"center", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:"22px", fontWeight:800, color:"#29ABE2" }}>{started.length}</div>
                <div style={{ fontSize:"10px", color:"#7a95b0", fontWeight:600 }}>Started</div>
              </div>
              <div style={{ flex:1, background:"#fff", borderRadius:"12px", padding:"12px", textAlign:"center", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:"22px", fontWeight:800, color:"#059669" }}>{allTopics.filter(t=>t.pct===100).length}</div>
                <div style={{ fontSize:"10px", color:"#7a95b0", fontWeight:600 }}>Mastered</div>
              </div>
              <div style={{ flex:1, background:"#fff", borderRadius:"12px", padding:"12px", textAlign:"center", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:"22px", fontWeight:800, color:"#94a3b8" }}>{allTopics.filter(t=>t.mastered===0).length}</div>
                <div style={{ fontSize:"10px", color:"#7a95b0", fontWeight:600 }}>Not Started</div>
              </div>
            </div>
          </div>);
        })()}
      </div>
    );
  }

  // TOPIC SELECT
  const FOLDER_COLORS = {
    physical_as:   { accent: "#29ABE2", bg: "#eaf6fd", border: "#29ABE2" },
    physical_a2:   { accent: "#0090cc", bg: "#e0f2fa", border: "#0090cc" },
    inorganic_as:  { accent: "#16a97d", bg: "#e6f9f3", border: "#16a97d" },
    inorganic_a2:  { accent: "#0d8c68", bg: "#dcf5ed", border: "#0d8c68" },
    organic:       { accent: "#7c3aed", bg: "#f3eeff", border: "#7c3aed" },
    organic2:      { accent: "#6d28d9", bg: "#ede9ff", border: "#6d28d9" },
    practicals_as: { accent: "#d97706", bg: "#fef6e4", border: "#d97706" },
    practicals_a2: { accent: "#b45309", bg: "#fef0d0", border: "#b45309" },
    ocr_mod2: { accent: "#e05c00", bg: "#fff3eb", border: "#e05c00" },
    ocr_mod3: { accent: "#c0392b", bg: "#fdecec", border: "#c0392b" },
    ocr_mod4: { accent: "#8e44ad", bg: "#f5eeff", border: "#8e44ad" },
    ocr_mod5: { accent: "#1a6b9a", bg: "#e8f4fb", border: "#1a6b9a" },
    ocr_mod6: { accent: "#16783a", bg: "#e9f7ef", border: "#16783a" },
  };

  if (screen === "topics" && activeSection) {
    const section = CURRENT_SECTIONS.find(s => s.id === activeSection);
    const fc = FOLDER_COLORS[activeSection] || FOLDER_COLORS.physical_as;
    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
        <Header sub={section.label} back={goBack} />
        <div style={{ padding: "8px 16px 24px", flex: 1, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
            {section.topics.map(id => {
              const s = SETS[id];
              const k = (known[id] || new Set()).size;
              const pct = Math.round((k / s.cards.length) * 100);
              return (
                <button key={id} onClick={() => selectTopic(id)} style={{
                  padding: "14px 12px 12px", borderRadius: "16px",
                  background: "#ffffff", border: `2px solid ${fc.accent}40`,
                  color: "#1a2d45", cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit", position: "relative", overflow: "hidden",
                  minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ borderLeft: `3px solid ${fc.accent}`, paddingLeft: "8px" }}>
                    <div style={{ fontSize: "11px", color: fc.accent, fontWeight: 800, letterSpacing: "0.3px", marginBottom: "4px" }}>{id}</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a2d45", lineHeight: 1.3 }}>{s.title}</div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <span style={{ fontSize: "11px", color: "#7a95b0" }}>{s.cards.length} cards</span>
                      {k > 0 && <span style={{ fontSize: "11px", color: "#29ABE2", fontWeight: 700 }}>{k} known</span>}
                    </div>
                    <div style={{ height: "4px", background: "rgba(0,0,0,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: fc.accent, borderRadius: "2px", transition: "width 0.3s" }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── NMR Spectrum Challenge Data ─────────────────────────────────────────────
  const NMR_CHALLENGES = [
    {
      id: "ethanol", name: "Ethanol", formula: "C₂H₆O", molecular: "CH₃CH₂OH",
      peaks: [
        { shift: 1.2, height: 0.75, splitting: "triplet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CH₂" },
        { shift: 3.7, height: 0.5, splitting: "quartet", integration: 2, label: "CH₂", env: "CH₂ adjacent to CH₃, deshielded by O" },
        { shift: 2.6, height: 0.25, splitting: "singlet", integration: 1, label: "OH", env: "O–H (broad, disappears with D₂O)" },
      ],
      answer: "Three environments: CH₃ (triplet, 3H, δ 1.2) split by 2 adjacent H on CH₂. CH₂ (quartet, 2H, δ 3.7) split by 3 adjacent H on CH₃, shifted downfield by electronegative O. OH (broad singlet, 1H, δ 2.6) exchangeable, disappears with D₂O shake. Integration ratio 3:2:1.",
      tips: "The quartet + triplet pair is diagnostic for a CH₃CH₂ group. The broad OH confirms an alcohol."
    },
    {
      id: "propanone", name: "Propanone", formula: "C₃H₆O", molecular: "CH₃COCH₃",
      peaks: [
        { shift: 2.1, height: 1.0, splitting: "singlet", integration: 6, label: "2×CH₃", env: "Two equivalent CH₃ groups adjacent to C=O" },
      ],
      answer: "Only one peak. Both CH₃ groups are equivalent (mirror symmetry). Singlet (no adjacent H on the carbonyl C). δ 2.1 shifted downfield by the electron-withdrawing C=O. Integration: 6H.",
      tips: "A single peak for a C₃H₆O compound immediately rules out propanal (which would show an aldehyde peak at δ 9.8)."
    },
    {
      id: "propanal", name: "Propanal", formula: "C₃H₆O", molecular: "CH₃CH₂CHO",
      peaks: [
        { shift: 1.0, height: 0.75, splitting: "triplet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CH₂" },
        { shift: 2.4, height: 0.5, splitting: "multiplet", integration: 2, label: "CH₂", env: "CH₂ between CH₃ and CHO" },
        { shift: 9.8, height: 0.25, splitting: "triplet", integration: 1, label: "CHO", env: "Aldehyde H, very deshielded by C=O" },
      ],
      answer: "Three environments: CH₃ (triplet, 3H, δ 1.0) split by 2H on CH₂. CH₂ (multiplet, 2H, δ 2.4) coupled to both CH₃ and CHO. CHO (triplet, 1H, δ 9.8) split by 2H on CH₂, very downfield due to C=O. Integration ratio 3:2:1.",
      tips: "The peak at δ 9.8 is the giveaway. Only aldehyde H appear this far downfield. This distinguishes propanal from propanone (same molecular formula C₃H₆O)."
    },
    {
      id: "ethyl_ethanoate", name: "Ethyl ethanoate", formula: "C₄H₈O₂", molecular: "CH₃COOCH₂CH₃",
      peaks: [
        { shift: 1.3, height: 0.75, splitting: "triplet", integration: 3, label: "CH₂CH₃", env: "CH₃ of ethyl group, adjacent to CH₂" },
        { shift: 2.0, height: 0.75, splitting: "singlet", integration: 3, label: "CH₃CO", env: "CH₃ adjacent to C=O, no neighbouring H" },
        { shift: 4.1, height: 0.5, splitting: "quartet", integration: 2, label: "OCH₂", env: "CH₂ deshielded by O, adjacent to CH₃" },
      ],
      answer: "Three environments: CH₃ of ethyl (triplet, 3H, δ 1.3) split by 2H on OCH₂. CH₃CO (singlet, 3H, δ 2.0) no adjacent H. OCH₂ (quartet, 2H, δ 4.1) split by 3H on CH₃, deshielded by O. Integration ratio 3:3:2.",
      tips: "The singlet at δ 2.0 is characteristic of CH₃ next to C=O. The quartet-triplet pair at δ 4.1 and 1.3 shows the ethyl ester group."
    },
    {
      id: "ethanoic_acid", name: "Ethanoic acid", formula: "C₂H₄O₂", molecular: "CH₃COOH",
      peaks: [
        { shift: 2.1, height: 0.75, splitting: "singlet", integration: 3, label: "CH₃", env: "CH₃ adjacent to C=O" },
        { shift: 11.4, height: 0.2, splitting: "singlet", integration: 1, label: "COOH", env: "Carboxylic acid H, very deshielded (broad)" },
      ],
      answer: "Two environments: CH₃ (singlet, 3H, δ 2.1) no adjacent H to cause splitting. COOH (broad singlet, 1H, δ 11.4) extremely deshielded, exchangeable with D₂O. Integration ratio 3:1.",
      tips: "The very broad peak above δ 10 is diagnostic for COOH. It disappears with D₂O shake, confirming an exchangeable proton."
    },
    {
      id: "bromoethane", name: "Bromoethane", formula: "C₂H₅Br", molecular: "CH₃CH₂Br",
      peaks: [
        { shift: 1.7, height: 0.75, splitting: "triplet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CH₂" },
        { shift: 3.4, height: 0.5, splitting: "quartet", integration: 2, label: "CH₂Br", env: "CH₂ deshielded by Br, adjacent to CH₃" },
      ],
      answer: "Two environments: CH₃ (triplet, 3H, δ 1.7) split by 2H on CH₂. CH₂ (quartet, 2H, δ 3.4) split by 3H on CH₃, shifted downfield by electronegative Br. Integration ratio 3:2.",
      tips: "The quartet-triplet pair confirms a CH₃CH₂ group. CH₂ at δ 3.4 is deshielded by Br."
    },
    {
      id: "methyl_propanoate", name: "Methyl propanoate", formula: "C₄H₈O₂", molecular: "CH₃CH₂COOCH₃",
      peaks: [
        { shift: 1.1, height: 0.75, splitting: "triplet", integration: 3, label: "CH₂CH₃", env: "CH₃ adjacent to CH₂" },
        { shift: 2.3, height: 0.5, splitting: "quartet", integration: 2, label: "CH₂", env: "CH₂ adjacent to CH₃ and C=O" },
        { shift: 3.7, height: 0.75, splitting: "singlet", integration: 3, label: "OCH₃", env: "OCH₃ deshielded by O, no adjacent H" },
      ],
      answer: "Three environments: CH₃ (triplet, 3H, δ 1.1) split by 2H on CH₂. CH₂ (quartet, 2H, δ 2.3) split by 3H on CH₃. OCH₃ (singlet, 3H, δ 3.7) no adjacent H, deshielded by O. Integration ratio 3:2:3.",
      tips: "Same molecular formula as ethyl ethanoate (C₄H₈O₂) but different spectrum. The singlet OCH₃ at δ 3.7 and quartet at δ 2.3 distinguish methyl propanoate from ethyl ethanoate."
    },
    {
      id: "propan_2_ol", name: "Propan-2-ol", formula: "C₃H₈O", molecular: "(CH₃)₂CHOH",
      peaks: [
        { shift: 1.2, height: 1.0, splitting: "doublet", integration: 6, label: "2×CH₃", env: "Two equivalent CH₃ groups adjacent to CH" },
        { shift: 4.0, height: 0.2, splitting: "septet", integration: 1, label: "CH", env: "CH adjacent to 6H (2×CH₃), deshielded by O" },
        { shift: 2.3, height: 0.15, splitting: "singlet", integration: 1, label: "OH", env: "O–H (broad, disappears with D₂O)" },
      ],
      answer: "Three environments: 2×CH₃ (doublet, 6H, δ 1.2) split by 1H on CH. CH (septet, 1H, δ 4.0) split by 6 adjacent H (n+1 = 7 lines), deshielded by O. OH (broad singlet, 1H, δ 2.3) exchangeable. Integration ratio 6:1:1.",
      tips: "The septet is the key. 6 equivalent adjacent H give a 7-line pattern. The large doublet (6H) confirms two equivalent CH₃ groups."
    },
    {
      id: "methylbenzene", name: "Methylbenzene", formula: "C₇H₈", molecular: "C₆H₅CH₃",
      peaks: [
        { shift: 2.3, height: 0.6, splitting: "singlet", integration: 3, label: "CH₃", env: "CH₃ attached to benzene ring" },
        { shift: 7.2, height: 1.0, splitting: "multiplet", integration: 5, label: "ArH", env: "5 aromatic H (complex splitting)" },
      ],
      answer: "Two main environments: CH₃ (singlet, 3H, δ 2.3) no adjacent H to split (ring C has no H). ArH (multiplet, 5H, δ 7.2) aromatic protons in the characteristic δ 6.5-8.0 region. Integration ratio 3:5.",
      tips: "Aromatic protons always appear δ 6.5–8.0. The singlet CH₃ tells you it's directly on the ring. At A-level you don't need to interpret detailed aromatic splitting."
    },
    {
      id: "ethanal", name: "Ethanal", formula: "C₂H₄O", molecular: "CH₃CHO",
      peaks: [
        { shift: 2.2, height: 0.75, splitting: "doublet", integration: 3, label: "CH₃", env: "CH₃ adjacent to CHO (1 neighbouring H)" },
        { shift: 9.8, height: 0.25, splitting: "quartet", integration: 1, label: "CHO", env: "Aldehyde H, very deshielded, adjacent to CH₃" },
      ],
      answer: "Two environments: CH₃ (doublet, 3H, δ 2.2) split by 1H on CHO. CHO (quartet, 1H, δ 9.8) split by 3H on CH₃, very far downfield due to C=O. Integration ratio 3:1.",
      tips: "The aldehyde peak at δ ~9.8 is unmistakable. The doublet CH₃ and quartet CHO confirm the connectivity."
    },
  ];

  const nmrFlashcards = board === "ocr"
    ? (SETS["ocr_6.5.1"]?.cards || [])
    : (SETS["3.3.15"]?.cards || []);

  const nmrMcqs = mcqData.questions.filter(q => q.topic === "3.3.15" || q.topic === "3.3.13");

  const NmrSpectrum = ({ peaks, revealed }) => {
    const W = 700, H = 280, padL = 50, padR = 25, padT = 50, padB = 45;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const maxShift = 12;
    const toX = (shift) => padL + plotW * (1 - shift / maxShift);
    const splitOffsets = {
      singlet: [0],
      doublet: [-4, 4],
      triplet: [-6, 0, 6],
      quartet: [-9, -3, 3, 9],
      septet: [-15, -10, -5, 0, 5, 10, 15],
      multiplet: [-8, -4, -1, 1, 4, 8],
    };
    const splitHeights = {
      singlet: [1],
      doublet: [1, 1],
      triplet: [0.5, 1, 0.5],
      quartet: [0.33, 1, 1, 0.33],
      septet: [0.15, 0.45, 0.75, 1, 0.75, 0.45, 0.15],
      multiplet: [0.4, 0.7, 1, 1, 0.7, 0.4],
    };
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #e2e8f0" }}>
        {/* Baseline */}
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
        {/* Tick marks */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(v => (
          <g key={v}>
            <line x1={toX(v)} y1={padT + plotH} x2={toX(v)} y2={padT + plotH + 6} stroke="#94a3b8" strokeWidth="1" />
            <text x={toX(v)} y={padT + plotH + 20} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="500" fontFamily="'Outfit',sans-serif">{v}</text>
          </g>
        ))}
        <text x={padL + plotW / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="#475569" fontWeight="600" fontFamily="'Outfit',sans-serif">{"δ / ppm"}</text>
        <text x={toX(0) + 10} y={padT + plotH + 20} textAnchor="start" fontSize="10" fill="#94a3b8" fontWeight="500" fontFamily="'Outfit',sans-serif">TMS</text>
        {/* Peaks */}
        {peaks.map((p, i) => {
          const cx = toX(p.shift);
          const offsets = splitOffsets[p.splitting] || [0];
          const heights = splitHeights[p.splitting] || [1];
          const peakH = plotH * p.height * 0.8;
          return (
            <g key={i}>
              {offsets.map((dx, j) => (
                <line key={j} x1={cx + dx} y1={padT + plotH} x2={cx + dx} y2={padT + plotH - peakH * (heights[j] || 0.5)}
                  stroke="#8b5cf6" strokeWidth={p.splitting === "singlet" ? "3" : "2"} strokeLinecap="round" />
              ))}
              {/* Integration label - always shown, above the peak top */}
              <text x={cx} y={padT + plotH - peakH - 14} textAnchor="middle" fontSize="11" fill="#8b5cf6" fontWeight="700" fontFamily="'Outfit',sans-serif">
                {p.integration}H
              </text>
              {/* Environment label - shown on reveal, at the very top */}
              {revealed && (
                <text x={cx} y={16} textAnchor="middle" fontSize="10" fill="#6d28d9" fontWeight="700" fontFamily="'Outfit',sans-serif">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // Activity card data used by both the home grid and the back-to-home helper
  const ACTIVITY_CARDS = [
    { id: "flashcards", label: "Flashcards",            labelBig: "Flash",    labelSmall: "cards",   desc: "Master every topic with smart revision cards.", color: "#29ABE2", grad: "linear-gradient(145deg,#29ABE2,#0e7ab5,#085f8f)", stat: `${CURRENT_TOPIC_ORDER.length} topics` },
    { id: "pathways",   label: "Pathways",              labelBig: "Path",     labelSmall: "ways",    desc: "Explore all synthesis routes between functional groups.",  color: "#059669", grad: "linear-gradient(145deg,#10b981,#059669,#047857)", stat: "Reaction map" },
    { id: "calc",       label: "Calculations",          labelBig: "Worked",   labelSmall: "Calcs",   desc: "Practise every calculation type with worked steps.", color: "#0284c7", grad: "linear-gradient(145deg,#0ea5e9,#0284c7,#075985)", stat: "Step-by-step" },
    { id: "extended",   label: "AI Examiner",           labelBig: "AI",       labelSmall: "Examiner",desc: "ChemMastery AI marks your extended answers.",    color: "#7c3aed", grad: "linear-gradient(145deg,#a855f7,#7c3aed,#5b21b6)", stat: "AI powered" },
    { id: "mechanisms", label: "Mechanisms",            labelBig: "Mech",     labelSmall: "anisms",  desc: "Handdrawn curly arrow mechanisms with explanations.",  color: "#d97706", grad: "linear-gradient(145deg,#f59e0b,#d97706,#b45309)", stat: "Handdrawn" },
    { id: "mcq",        label: "MCQs",                  labelBig: "MC",       labelSmall: "Qs",      desc: "Multiple choice questions with solutions by topic.", color: "#dc2626", grad: "linear-gradient(145deg,#f87171,#dc2626,#991b1b)", stat: `${mcqData.questions.length} Qs` },
    { id: "nmr",        label: "NMR Practice",          labelBig: "NMR",      labelSmall: "Practice",desc: "Interpret spectra, learn chemical shifts, and deduce structures.", color: "#8b5cf6", grad: "linear-gradient(145deg,#a78bfa,#8b5cf6,#6d28d9)", stat: "Spectra" },
  ];

  const goHome = () => { setTopicsTab("home"); setSelectedRxn(null); setSelectedFrom(null); setMechId(null); setMechStep(0); setMechOpenCards({}); setNmrRevealed(false); setNmrSubTab("challenges"); };

  if (screen === "topics") return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@media(max-width:640px){.lp-topic-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}.lp-topic-grid img{height:100px!important}.lp-topic-grid .card-body-text{font-size:11px!important}}`}</style>
      {/* Header -always visible */}
      <div style={{ padding: "0 20px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f1d35", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {topicsTab !== "home"
            ? <button onClick={goHome} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Home</button>
            : <button onClick={goBack} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
          }
          <div style={{ background: "#fff", borderRadius: "10px", padding: "4px 8px", display: "flex", alignItems: "center" }}>
            <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "48px", objectFit: "contain", display: "block" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "17px", color: "#ffffff", letterSpacing: "-0.3px", lineHeight: 1.1 }}>HSJ TUITION</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "10px", color: "#29ABE2", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>{board === "ocr" ? "OCR A" : "AQA"} · A-Level Chemistry</div>
          </div>
        </div>
        <button onClick={() => { setScreen("dashboard"); track("view_dashboard", { board }); }} style={{ background: "#29ABE2", border: "none", borderRadius: "10px", padding: "9px 16px", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 2px 8px rgba(41,171,226,0.4)" }}>My Progress</button>
      </div>

      {/* Payment success/cancel banner */}
      {paymentBanner === "success" && (
        <div style={{ margin: "12px 16px 0", padding: "14px 16px", background: "#ecfdf5", border: "1.5px solid #059669", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: 900, color: "#059669" }}>&#10003;</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669" }}>Payment successful!</div>
            <div style={{ fontSize: "12px", color: "#047857", marginTop: "2px" }}>Welcome to ChemMastery Pro - all content is now unlocked. It may take a moment to activate.</div>
          </div>
          <button onClick={() => setPaymentBanner(null)} style={{ background: "none", border: "none", color: "#059669", fontSize: "18px", cursor: "pointer", marginLeft: "auto" }}>x</button>
        </div>
      )}
      {paymentBanner === "cancel" && (
        <div style={{ margin: "12px 16px 0", padding: "14px 16px", background: "#fffbeb", border: "1.5px solid #d97706", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#92400e" }}>i</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}>Payment cancelled</div>
            <div style={{ fontSize: "12px", color: "#a16207", marginTop: "2px" }}>No worries - you can upgrade anytime from the home screen.</div>
          </div>
          <button onClick={() => setPaymentBanner(null)} style={{ background: "none", border: "none", color: "#92400e", fontSize: "18px", cursor: "pointer", marginLeft: "auto" }}>x</button>
        </div>
      )}

      {/* HOME card grid */}
      {topicsTab === "home" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px 56px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 6px", alignSelf: "flex-start" }}>ChemMastery</p>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1a2d45", margin: "0 0 12px", letterSpacing: "-0.5px", alignSelf: "flex-start" }}>What would you like to practise?</h2>
          {!hasFullAccess && (
            <div style={{ alignSelf: "stretch", background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "1.5px solid #fbbf2440", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: showPricing ? "12px" : "0" }}>
                <span style={{ fontSize: "18px" }}>🔑</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>Free plan - limited content</div>
                  <div style={{ fontSize: "11px", color: "#a16207", marginTop: "2px" }}>Upgrade to unlock all flashcards, calcs, synthesis and more</div>
                </div>
                <button onClick={() => setShowPricing(!showPricing)} style={{ background: "#29ABE2", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  {showPricing ? "Hide" : "Upgrade"}
                </button>
              </div>
              {showPricing && (
                <div>
                  <PricingCards />
                  <div style={{ marginTop: "12px", padding: "12px", background: "#fffbeb", borderRadius: "8px", border: "1px solid #fbbf24" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#92400e", marginBottom: "6px" }}>Have an access key? Enter it here:</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input value={accessKeyInput} onChange={e => setAccessKeyInput(e.target.value)} placeholder="e.g. HSJ-2026-ABCD"
                        style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #fbbf24", fontSize: "12px", fontFamily: "inherit", outline: "none", background: "#fff" }}
                        onFocus={e => e.target.style.borderColor = "#29ABE2"}
                        onBlur={e => e.target.style.borderColor = "#fbbf24"}
                        onKeyDown={e => e.key === "Enter" && handleRedeemKey()}
                      />
                      <button onClick={handleRedeemKey} disabled={accessKeyLoading} style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: accessKeyLoading ? 0.6 : 1 }}>
                        {accessKeyLoading ? "..." : "Redeem"}
                      </button>
                    </div>
                    {accessKeyMsg && <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "6px", color: accessKeyMsg.type === "success" ? "#059669" : "#dc2626" }}>{accessKeyMsg.text}</div>}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="lp-topic-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%", maxWidth: "900px" }}>
            {ACTIVITY_CARDS.map(card => {
              const mechComingSoon = (card.id === "mechanisms" || card.id === "nmr") && !isAdmin;
              const fullyLocked = !hasFullAccess && (card.id === "synth" || card.id === "pathways");
              const partiallyLocked = !hasFullAccess && !fullyLocked && !mechComingSoon;
              return (
              <button key={card.id} onClick={() => { if (mechComingSoon) return; setTopicsTab(card.id); track("open_section", { section: card.id, board }); if (card.id === "mechanisms") { setMechId(null); setMechStep(0); setMechOpenCards({}); } }}
                style={{ display: "flex", flexDirection: "column", borderRadius: "22px", border: "none", cursor: mechComingSoon ? "default" : "pointer", fontFamily: "inherit", background: "#ffffff", boxShadow: "0 4px 24px rgba(0,0,0,0.09)", overflow: "hidden", textAlign: "left", transition: "transform 0.18s, box-shadow 0.18s", opacity: mechComingSoon ? 0.75 : 1 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(0,0,0,0.16)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.09)"; }}
              >
                {/* Thumbnail — FigureLabs card image */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  {card.id === "nmr" ? (
                    <div style={{ width: "100%", height: "140px", background: card.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="200" height="80" viewBox="0 0 200 80" style={{ opacity: 0.35 }}>
                        <line x1="10" y1="70" x2="190" y2="70" stroke="#fff" strokeWidth="1.5" />
                        <line x1="40" y1="70" x2="40" y2="20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                        <line x1="37" y1="70" x2="37" y2="30" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        <line x1="43" y1="70" x2="43" y2="30" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        <line x1="100" y1="70" x2="100" y2="35" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                        <line x1="150" y1="70" x2="150" y2="15" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                        <line x1="147" y1="70" x2="147" y2="25" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        <text x="180" y="67" fill="#fff" fontSize="8" fontFamily="'Outfit',sans-serif">TMS</text>
                      </svg>
                    </div>
                  ) : (
                  <img src={process.env.PUBLIC_URL + `/card-${card.id === "extended" ? "ai-examiner" : card.id === "mcq" ? "mcqs" : card.id === "calc" ? "calculations" : card.id}.png`}
                    alt={card.label}
                    style={{ width: "100%", height: "140px", objectFit: "cover", objectPosition: "top", display: "block" }} />
                  )}
                  {/* Coming Soon badge for mechanisms */}
                  {mechComingSoon && (
                    <div style={{ position: "absolute", top: "14px", right: "16px", background: "rgba(217,119,6,0.9)", borderRadius: "6px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>COMING SOON</span>
                    </div>
                  )}
                  {/* Lock badge for free users */}
                  {!mechComingSoon && (fullyLocked || partiallyLocked) && (
                    <div style={{ position: "absolute", top: "14px", right: "16px", background: "rgba(0,0,0,0.5)", borderRadius: "6px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10px" }}>🔒</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>{fullyLocked ? "PRO" : "PREVIEW"}</span>
                    </div>
                  )}
                </div>
                {/* Card body */}
                <div style={{ padding: "12px 14px 16px", flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#1a2d45", marginBottom: "4px" }}>{card.label}</div>
                  <div className="card-body-text" style={{ fontSize: "12px", color: "#7a95b0", lineHeight: 1.5 }}>{card.desc}</div>
                </div>
              </button>
              );
            })}
          </div>
        </div>
      )}
      {topicsTab === "flashcards" && quizScreen === "setup" && (() => {
        const allSections = board === "ocr" ? OCR_SECTIONS : SECTIONS;
        const asSecs = board === "ocr" ? OCR_AS_SECTIONS : AQA_AS_SECTIONS;
        const a2Secs = board === "ocr" ? OCR_A2_SECTIONS : AQA_A2_SECTIONS;
        const effectiveCount = quizCount === "custom" ? Math.min(99, Math.max(25, quizCustomCount || 25)) : quizCount;

        // Card pool size for current selection
        let poolSize = 0;
        if (quizMode === "topics") {
          poolSize = quizSelectedTopics.filter(id => SETS[id]).reduce((sum, id) => sum + SETS[id].cards.length, 0);
        } else {
          const filter = quizYear === "as" ? asSecs : quizYear === "a2" ? a2Secs : [...asSecs, ...a2Secs];
          poolSize = allSections.filter(s => filter.includes(s.id)).flatMap(s => s.topics).filter(id => SETS[id]).reduce((sum, id) => sum + SETS[id].cards.length, 0);
        }

        const toggleTopic = (id) => setQuizSelectedTopics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        const toggleSection = (sec) => {
          const all = sec.topics.filter(id => SETS[id]);
          const allSelected = all.every(id => quizSelectedTopics.includes(id));
          setQuizSelectedTopics(prev => allSelected ? prev.filter(id => !all.includes(id)) : [...new Set([...prev, ...all])]);
        };
        const canStart = quizMode === "year" || quizSelectedTopics.length > 0;

        return (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 40px" }}>
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
              <button onClick={() => setQuizScreen(null)} style={{ background: "none", border: "none", color: "#7a95b0", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600, padding: "0 0 18px 0" }}>← Back to Topics</button>

              {/* Hero */}
              <div style={{ background: "linear-gradient(135deg,#29ABE2,#0090cc)", borderRadius: "20px", padding: "22px 24px", color: "#fff", marginBottom: "24px", boxShadow: "0 6px 20px rgba(41,171,226,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>Random Quiz</div>
                  <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>Weak cards shown more often</div>
                </div>
                <div style={{ fontSize: "36px" }}>🎯</div>
              </div>

              {/* Mode toggle */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Question Source</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[["year","By Year Level"],["topics","Choose Topics"]].map(([v,label]) => (
                    <button key={v} onClick={() => setQuizMode(v)} style={{
                      flex: 1, padding: "13px 8px", borderRadius: "12px", border: "2px solid",
                      borderColor: quizMode === v ? "#29ABE2" : "#dde4ed",
                      background: quizMode === v ? "#eaf6fd" : "#ffffff",
                      color: quizMode === v ? "#29ABE2" : "#7a95b0",
                      fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Year selector (mode = year) */}
              {quizMode === "year" && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Year Level</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[["as","AS Year 1"],["a2","A2 Year 2"],["all","All Topics"]].map(([v,label]) => (
                      <button key={v} onClick={() => setQuizYear(v)} style={{
                        flex: 1, padding: "13px 8px", borderRadius: "12px", border: "2px solid",
                        borderColor: quizYear === v ? "#29ABE2" : "#dde4ed",
                        background: quizYear === v ? "#eaf6fd" : "#ffffff",
                        color: quizYear === v ? "#29ABE2" : "#7a95b0",
                        fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                      }}>{label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Topic picker (mode = topics) */}
              {quizMode === "topics" && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase" }}>Pick Topics</div>
                    <button onClick={() => setQuizSelectedTopics([])} style={{ background: "none", border: "none", color: "#29ABE2", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {allSections.map(sec => {
                      const secTopics = sec.topics.filter(id => SETS[id]);
                      const allSel = secTopics.every(id => quizSelectedTopics.includes(id));
                      const someSel = secTopics.some(id => quizSelectedTopics.includes(id));
                      return (
                        <div key={sec.id} style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e0e8f0", overflow: "hidden" }}>
                          <button onClick={() => toggleSection(sec)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45" }}>{sec.label}</span>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: allSel ? "#29ABE2" : someSel ? "#7a95b0" : "#bcc8d4" }}>{allSel ? "All selected" : someSel ? `${secTopics.filter(id => quizSelectedTopics.includes(id)).length}/${secTopics.length}` : "Select all"}</span>
                          </button>
                          <div style={{ padding: "0 10px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {secTopics.map(id => {
                              const sel = quizSelectedTopics.includes(id);
                              return (
                                <button key={id} onClick={() => toggleTopic(id)} style={{
                                  padding: "6px 12px", borderRadius: "8px", border: "2px solid",
                                  borderColor: sel ? "#29ABE2" : "#dde4ed",
                                  background: sel ? "#eaf6fd" : "#ffffff",
                                  color: sel ? "#29ABE2" : "#7a95b0",
                                  fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                }}>{SETS[id]?.title || id}</button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card count */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a6070", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Cards per Session</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[[25,"25"],[50,"50"],["custom","Custom"]].map(([v,label]) => (
                    <button key={v} onClick={() => setQuizCount(v)} style={{
                      flex: 1, padding: "13px 8px", borderRadius: "12px", border: "2px solid",
                      borderColor: quizCount === v ? "#29ABE2" : "#dde4ed",
                      background: quizCount === v ? "#eaf6fd" : "#ffffff",
                      color: quizCount === v ? "#29ABE2" : "#7a95b0",
                      fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                </div>
                {quizCount === "custom" && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="number" min={25} max={99} value={quizCustomCount}
                      onChange={e => setQuizCustomCount(Math.min(99, Math.max(25, Number(e.target.value))))}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "2px solid #dde4ed", fontSize: "16px", fontFamily: "inherit", fontWeight: 700, color: "#1a2d45", outline: "none", textAlign: "center" }}
                    />
                    <span style={{ fontSize: "13px", color: "#7a95b0", fontWeight: 600 }}>cards (25–99)</span>
                  </div>
                )}
              </div>

              {/* Pool summary */}
              <div style={{ fontSize: "13px", color: "#7a95b0", textAlign: "center", marginBottom: "20px", padding: "12px", background: "#f8fafc", borderRadius: "10px" }}>
                Drawing <strong style={{ color: "#29ABE2" }}>{Math.min(effectiveCount, poolSize)}</strong> cards from a pool of <strong style={{ color: "#1a2d45" }}>{poolSize}</strong>
                {quizMode === "topics" && quizSelectedTopics.length === 0 && <div style={{ color: "#ef4444", marginTop: "4px", fontSize: "12px" }}>Select at least one topic above</div>}
              </div>

              <button onClick={startQuiz} disabled={!canStart} style={{
                width: "100%", padding: "18px", borderRadius: "14px", border: "none",
                background: canStart ? "linear-gradient(135deg,#29ABE2,#0090cc)" : "#e0e8f0",
                color: canStart ? "#ffffff" : "#aab5c2",
                fontFamily: "inherit", fontSize: "17px", fontWeight: 800, cursor: canStart ? "pointer" : "not-allowed",
                boxShadow: canStart ? "0 4px 16px rgba(41,171,226,0.4)" : "none",
              }}>Start Quiz →</button>
            </div>
          </div>
        );
      })()}
      {topicsTab === "flashcards" && quizScreen === "running" && (() => {
        const card = quizDeck[quizPos];
        const progress = Math.round(((quizPos) / quizDeck.length) * 100);
        const topicTitle = SETS[card?.topicId]?.title || card?.topicId || "";
        return (
          <div style={{ padding: "20px 20px 32px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "580px" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <button onClick={() => setQuizScreen("setup")} style={{ background: "none", border: "none", color: "#7a95b0", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: 600 }}>✕ Exit</button>
                <div style={{ fontSize: "14px", color: "#7a95b0", fontWeight: 600 }}>{quizPos + 1} / {quizDeck.length}</div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>
                  <span style={{ color: "#22c55e" }}>✓ {quizSessionScore.correct}</span>
                  <span style={{ color: "#d1d5db", margin: "0 6px" }}>|</span>
                  <span style={{ color: "#ef4444" }}>✗ {quizSessionScore.wrong}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: "6px", background: "#e0e8f0", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#29ABE2,#22c55e)", borderRadius: "3px", transition: "width 0.3s" }} />
              </div>
              {/* Topic label */}
              <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", textAlign: "center", marginBottom: "12px" }}>{topicTitle}</div>
              {/* Card */}
              <div onClick={() => setQuizFlipped(f => !f)} style={{
                minHeight: "260px", borderRadius: "24px", padding: "36px 32px",
                background: quizFlipped ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "#ffffff",
                border: `2px solid ${quizFlipped ? "#86efac" : "#dde4ed"}`,
                boxShadow: "0 6px 28px rgba(0,0,0,0.09)", cursor: "pointer",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                textAlign: "center", transition: "all 0.2s", userSelect: "none",
                marginBottom: "18px",
              }}>
                {!quizFlipped ? (
                  <>
                    <div style={{ fontSize: "11px", color: "#29ABE2", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>QUESTION</div>
                    <div style={{ fontSize: "19px", fontWeight: 600, color: "#1a2d45", lineHeight: 1.55 }}>{card?.q}</div>
                    <div style={{ marginTop: "24px", fontSize: "12px", color: "#aab5c2" }}>Tap to reveal answer</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "18px" }}>ANSWER</div>
                    <div style={{ fontSize: "17px", color: "#1a2d45", lineHeight: 1.65, whiteSpace: "pre-line" }}>{card?.a}</div>
                  </>
                )}
              </div>
              {/* Answer buttons */}
              {quizFlipped ? (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => recordQuizAnswer(false)} style={{
                    flex: 1, padding: "18px 10px", borderRadius: "16px", border: "2px solid #fecaca",
                    background: "#fff5f5", color: "#dc2626", fontFamily: "inherit", fontSize: "16px",
                    fontWeight: 800, cursor: "pointer",
                  }}>✗ Missed it</button>
                  <button onClick={() => recordQuizAnswer(true)} style={{
                    flex: 1, padding: "18px 10px", borderRadius: "16px", border: "none",
                    background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#ffffff",
                    fontFamily: "inherit", fontSize: "16px", fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(34,197,94,0.35)",
                  }}>✓ Got it</button>
                </div>
              ) : (
                <div style={{ height: "58px" }} />
              )}
            </div>
          </div>
        );
      })()}
      {topicsTab === "flashcards" && quizScreen === "done" && (() => {
        const total = quizSessionScore.correct + quizSessionScore.wrong;
        const pct = total > 0 ? Math.round((quizSessionScore.correct / total) * 100) : 0;
        const msg = pct >= 90 ? "Outstanding" : pct >= 70 ? "Great work" : pct >= 50 ? "Good effort" : "Keep practising";
        // Find weakest topics from this session
        const topicWrong = {};
        quizDeck.forEach((card, i) => {
          const key = `${card.topicId}-${card.cardIdx}`;
          const h = quizHistory[key];
          if (h && h.w > 0) {
            topicWrong[card.topicId] = (topicWrong[card.topicId] || 0) + h.w;
          }
        });
        const weakTopics = Object.entries(topicWrong).sort((a,b) => b[1]-a[1]).slice(0,3);
        return (
          <div style={{ padding: "24px 16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "360px" }}>
              {/* Score card */}
              <div style={{ background: "linear-gradient(135deg,#1a2d45,#29ABE2)", borderRadius: "24px", padding: "32px 24px", textAlign: "center", color: "#fff", marginBottom: "20px", boxShadow: "0 8px 28px rgba(41,171,226,0.3)" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "4px" }}>{msg}</div>
                <div style={{ fontSize: "52px", fontWeight: 800, lineHeight: 1, margin: "12px 0" }}>{pct}%</div>
                <div style={{ fontSize: "14px", opacity: 0.85 }}>{quizSessionScore.correct} correct · {quizSessionScore.wrong} missed · {total} cards</div>
              </div>
              {/* Weak topics */}
              {weakTopics.length > 0 && (
                <div style={{ background: "#fff9f0", border: "1px solid #fed7aa", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#c2410c", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Focus Areas</div>
                  {weakTopics.map(([topicId, wrongCount]) => (
                    <div key={topicId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #fed7aa20" }}>
                      <span style={{ fontSize: "12px", color: "#1a2d45", fontWeight: 600 }}>{SETS[topicId]?.title || topicId}</span>
                      <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700 }}>{wrongCount} missed</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => { startQuiz(); }} style={{
                  width: "100%", padding: "16px", borderRadius: "14px", border: "none",
                  background: "linear-gradient(135deg,#29ABE2,#0090cc)", color: "#ffffff",
                  fontFamily: "inherit", fontSize: "15px", fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(41,171,226,0.4)",
                }}>Play Again →</button>
                <button onClick={() => setQuizScreen("setup")} style={{
                  width: "100%", padding: "14px", borderRadius: "14px", border: "2px solid #dde4ed",
                  background: "#ffffff", color: "#4a6070", fontFamily: "inherit", fontSize: "14px",
                  fontWeight: 700, cursor: "pointer",
                }}>Change Settings</button>
                <button onClick={() => setQuizScreen(null)} style={{
                  width: "100%", padding: "14px", borderRadius: "14px", border: "none",
                  background: "none", color: "#7a95b0", fontFamily: "inherit", fontSize: "13px",
                  fontWeight: 600, cursor: "pointer",
                }}>Back to Topics</button>
              </div>
            </div>
          </div>
        );
      })()}
      {topicsTab === "flashcards" && !quizScreen && (
        <div style={{ padding: "8px 16px 24px", flex: 1, overflowY: "auto" }}>
          {/* Random Quiz launch card */}
          <button onClick={() => { if (hasFullAccess) setQuizScreen("setup"); }} style={{
            width: "100%", padding: "14px 16px", borderRadius: "16px", border: "none",
            background: hasFullAccess ? "linear-gradient(135deg,#29ABE2 0%,#0090cc 100%)" : "linear-gradient(135deg,#94a3b8 0%,#64748b 100%)", color: "#ffffff",
            cursor: hasFullAccess ? "pointer" : "default", textAlign: "left", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: hasFullAccess ? "0 4px 16px rgba(41,171,226,0.35)" : "none", marginBottom: "12px", marginTop: "4px",
            position: "relative", overflow: "hidden",
          }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>{hasFullAccess ? "" : "🔒 "}Random Quiz</div>
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>{hasFullAccess ? "Spaced repetition · 25 cards · adapts to your gaps" : "Unlock with access key for full quiz access"}</div>
            </div>
            <div style={{ fontSize: "20px", opacity: 0.8 }}>{hasFullAccess ? "→" : ""}</div>
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
            {CURRENT_SECTIONS.map(section => {
              const fc = FOLDER_COLORS[section.id] || FOLDER_COLORS.physical_as;
              const totalCards = section.topics.reduce((sum, id) => sum + SETS[id].cards.length, 0);
              const totalKnown = section.topics.reduce((sum, id) => sum + (known[id] || new Set()).size, 0);
              const pct = totalCards > 0 ? Math.round((totalKnown / totalCards) * 100) : 0;
              const sectionLocked = !hasFullAccess && !FREE_FLASHCARD_SECTIONS.includes(section.id);
              return (
                <button key={section.id} onClick={() => { if (!sectionLocked) setActiveSection(section.id); }} style={{
                  padding: "16px 14px 14px", borderRadius: "16px",
                  background: fc.bg, border: `2px solid ${fc.border}40`,
                  cursor: sectionLocked ? "default" : "pointer", textAlign: "left", fontFamily: "inherit",
                  position: "relative", overflow: "hidden", minHeight: "110px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}>
                  {sectionLocked && <LockedOverlay />}
                  <div style={{ borderLeft: `4px solid ${fc.accent}`, paddingLeft: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3 }}>{section.label}</div>
                    <div style={{ fontSize: "11px", color: fc.accent, marginTop: "3px", fontWeight: 600 }}>{section.topics.length} topics · {totalCards} cards</div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ height: "4px", background: "rgba(0,0,0,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: fc.accent, borderRadius: "2px", transition: "width 0.3s" }} />
                    </div>
                    {pct > 0 && <div style={{ fontSize: "10px", color: fc.accent, marginTop: "4px", fontWeight: 600 }}>{pct}% mastered</div>}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "#4a6070" }}>
            {CURRENT_TOPIC_ORDER.map(id => SETS[id]?.cards.length || 0).reduce((a,b)=>a+b,0)} cards · {CURRENT_TOPIC_ORDER.length} topics
          </div>
        </div>
      )}
      {topicsTab === "synth" && !hasFullAccess && (
        <UpgradeCard section="Synthesis" />
      )}
      {topicsTab === "synth" && hasFullAccess && (() => {
        const mechColors = {
          "Free Radical Substitution": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
          "Electrophilic Addition": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Electrophilic Addition (hydration)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Electrophilic Aromatic Substitution (nitration)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Electrophilic Aromatic Substitution (halogenation)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Friedel-Crafts Alkylation (EAS)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Friedel-Crafts Acylation (EAS)": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
          "Nucleophilic Substitution (SN2 for 1°, SN1 for 3°)": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Substitution (SN2)": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Substitution": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Addition": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Nucleophilic Addition-Elimination": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
          "Elimination (E2)": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
          "Acid-catalysed Elimination (dehydration)": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
          "Oxidation": { bg: "#fefce8", text: "#a16207", border: "#fde68a" },
          "Reduction": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
          "Reduction (nucleophilic addition of H⁻)": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
          "Catalytic Hydrogenation": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
          "Condensation (Esterification)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Condensation (Fischer Esterification)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Condensation": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Acid-Base Neutralisation": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
          "Acid-base reaction": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
          "Hydrolysis": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Acid-catalysed Hydrolysis (reversible)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Base-catalysed Hydrolysis (irreversible)": { bg: "#f0fdfa", text: "#0e7490", border: "#a5f3fc" },
          "Diazotisation": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
          "Coupling Reaction (Electrophilic Aromatic Substitution)": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
        };
        const getMC = (m) => mechColors[m] || { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" };
        const boardRoutes = SYNTH_ROUTES.filter(r => r.board === "both" || r.board === board || !board);
        const allFroms = [...new Set(boardRoutes.map(r => r.from))];
        const filteredRoutes = selectedFrom ? boardRoutes.filter(r => r.from === selectedFrom) : [];
        const aromaticFroms = new Set(["Arene", "Nitrobenzene", "Arylamine", "Diazonium Salt"]);
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px 7px", borderBottom: "1px solid #e8edf2", background: "#fafbfc", flexShrink: 0 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: selectedFrom ? "#29ABE2" : "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {selectedFrom ? `From: ${selectedFrom}` : "Pick a starting material"}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {selectedFrom && (
                  <button onClick={() => { setSelectedFrom(null); setRevealedRoutes(new Set()); }} style={{
                    padding: "4px 10px", borderRadius: "20px", border: "1px solid #e0e8f0",
                    background: "#fff", color: "#7a95b0", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
                  }}>← All</button>
                )}
                <button onClick={() => setSynthQuiz(q => !q)} style={{
                  padding: "4px 12px", borderRadius: "20px", border: "none",
                  background: synthQuiz ? "#f97316" : "#f0f4f8",
                  color: synthQuiz ? "#fff" : "#7a95b0",
                  fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                }}>Quiz {synthQuiz ? "ON" : "OFF"}</button>
              </div>
            </div>
            {!selectedFrom ? (
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 28px" }}>
                <div style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "12px", lineHeight: 1.6 }}>
                  Select a starting material to view all synthesis routes - with reagents, conditions, and step-by-step mechanisms.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {allFroms.map(from => {
                    const count = boardRoutes.filter(r => r.from === from).length;
                    const isAro = aromaticFroms.has(from);
                    const accent = isAro ? "#7c3aed" : "#29ABE2";
                    const bg = isAro ? "#fdf4ff" : "#eaf6fd";
                    const borderCol = isAro ? "#e9d5ff" : "#bae3f9";
                    return (
                      <button key={from} onClick={() => { setSelectedFrom(from); setRevealedRoutes(new Set()); }} style={{
                        padding: "13px 12px", borderRadius: "14px", border: `2px solid ${borderCol}`,
                        background: bg, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.06)", transition: "all 0.15s"
                      }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent, marginBottom: "7px" }} />
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", marginBottom: "3px", lineHeight: 1.3 }}>{from}</div>
                        <div style={{ fontSize: "11px", color: accent, fontWeight: 600 }}>{count} route{count !== 1 ? "s" : ""} →</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px 28px" }}>
                {filteredRoutes.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#7a95b0", fontSize: "13px", marginTop: "32px" }}>
                    No routes for {selectedFrom} on this exam board.
                  </div>
                ) : filteredRoutes.map((route, idx) => {
                  const isOpen = revealedRoutes.has(idx);
                  const mc = getMC(route.mechanism);
                  return (
                    <div key={idx} style={{
                      background: "#fff", borderRadius: "16px", marginBottom: "12px",
                      border: "1.5px solid #e8edf2", overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
                    }}>
                      {/* Header */}
                      <div style={{ padding: "13px 14px 11px" }}>
                        <div style={{ marginBottom: "7px" }}>
                          <span style={{
                            fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px",
                            background: mc.bg, color: mc.text, border: `1px solid ${mc.border}`
                          }}>{route.mechanism}</span>
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#1a2d45", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ color: "#29ABE2" }}>{route.from}</span>
                          <span style={{ fontSize: "18px", color: "#c4cdd6", lineHeight: 1 }}>→</span>
                          <span>{route.to}</span>
                        </div>
                      </div>
                      {/* Reagents + Conditions */}
                      {synthQuiz ? (
                        <div style={{ margin: "0 14px 13px", padding: "12px 14px", background: "#fff7ed", borderRadius: "12px", textAlign: "center", color: "#ea580c", fontWeight: 600, fontSize: "12px" }}>
                          Quiz mode - try to recall the reagents and conditions before revealing
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "0 14px 12px" }}>
                          <div style={{ background: "#f0f7ff", borderRadius: "12px", padding: "10px 12px", borderLeft: "3px solid #29ABE2" }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Reagents</div>
                            <div style={{ fontSize: "12px", color: "#1a2d45", fontWeight: 600, lineHeight: 1.5 }}>{route.reagents}</div>
                          </div>
                          <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "10px 12px", borderLeft: "3px solid #16a34a" }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Conditions</div>
                            <div style={{ fontSize: "12px", color: "#1a2d45", fontWeight: 600, lineHeight: 1.5 }}>{route.conditions}</div>
                          </div>
                        </div>
                      )}
                      {/* Notes */}
                      {route.notes && !synthQuiz && (
                        <div style={{ margin: "0 14px 12px", padding: "10px 12px", background: "#fafbfc", borderRadius: "10px", borderLeft: "3px solid #e0e8f0" }}>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Key notes</div>
                          <div style={{ fontSize: "11px", color: "#4a6070", lineHeight: 1.6 }}>{route.notes}</div>
                        </div>
                      )}
                      {/* Steps toggle */}
                      {route.steps && route.steps.length > 0 && (
                        <button onClick={() => setRevealedRoutes(prev => {
                          const next = new Set(prev);
                          if (next.has(idx)) next.delete(idx); else next.add(idx);
                          return next;
                        })} style={{
                          width: "100%", padding: "10px 14px", border: "none", borderTop: "1px solid #e8edf2",
                          background: isOpen ? "#eaf6fd" : "#f8fafc", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          fontFamily: "inherit", color: "#29ABE2", fontSize: "12px", fontWeight: 700
                        }}>
                          <span>Step-by-step mechanism</span>
                          <span style={{ fontSize: "13px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                        </button>
                      )}
                      {/* Steps expanded */}
                      {isOpen && route.steps && (
                        <div style={{ padding: "12px 14px 16px", background: "#f8fafc" }}>
                          {route.steps.map((step, si) => (
                            <div key={si} style={{ marginBottom: si < route.steps.length - 1 ? "16px" : "0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#29ABE2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(41,171,226,0.3)" }}>
                                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#fff" }}>{si + 1}</span>
                                </div>
                                <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2d45" }}>{step.stage}</div>
                              </div>
                              {step.equation && (
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1a2d45", background: "#fff", borderRadius: "10px", padding: "9px 12px", margin: "4px 0 6px 30px", border: "1px solid #e8edf2", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                                  {step.equation}
                                  {step.arrow && <span style={{ color: "#29ABE2", fontWeight: 700 }}>{" "}{step.arrow}</span>}
                                </div>
                              )}
                              {step.note && (
                                <div style={{ fontSize: "11px", color: "#4a6070", lineHeight: 1.6, paddingLeft: "30px" }}>{step.note}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
      {topicsTab === "pathways" && !hasFullAccess && (
        <UpgradeCard section="Pathways" />
      )}
      {topicsTab === "pathways" && hasFullAccess && (() => {
        const sNodes = synthTab === "ali" ? SYNTH_ALI_NODES : SYNTH_ARO_NODES;
        const sRxns  = synthTab === "ali" ? SYNTH_ALI_RXNS  : SYNTH_ARO_RXNS;
        const vbW = 660, vbH = synthTab === "ali" ? 870 : 720;
        const SW = 1.0; // full-size nodes for readability
        const nodeMap = Object.fromEntries(sNodes.map(n => [n[0], n]));
        const edgePt = (fcx, fcy, fhw, fhh, tcx, tcy) => {
          const dx = tcx - fcx, dy = tcy - fcy;
          const adx = Math.abs(dx), ady = Math.abs(dy);
          if (!adx && !ady) return [fcx, fcy];
          let t;
          if (!adx) t = (fhh + 4) / ady;
          else if (!ady) t = (fhw + 4) / adx;
          else t = (adx * fhh >= ady * fhw) ? (fhw + 4) / adx : (fhh + 4) / ady;
          return [fcx + dx * t, fcy + dy * t];
        };
        const selId = selectedFrom;
        const connRxnIds = selId ? new Set(sRxns.filter(r => r[1] === selId || r[2] === selId).map(r => r[0])) : null;
        const connNodeIds = selId ? new Set(sRxns.filter(r => r[1] === selId || r[2] === selId).flatMap(r => [r[1], r[2]])) : null;
        const selNodeData = selId ? sNodes.find(n => n[0] === selId) : null;
        const outRxns = selId ? sRxns.filter(r => r[1] === selId) : [];
        const inRxns  = selId ? sRxns.filter(r => r[2] === selId) : [];
        const selRxn  = selectedRxn ? sRxns.find(r => r[0] === selectedRxn) : null;
        // unused adjacency map stub kept for lint safety
        const outMap = {};
        const inMap = {};
        sNodes.forEach(([id]) => { outMap[id] = []; inMap[id] = []; });
        sRxns.forEach(r => {
          if (outMap[r[1]]) outMap[r[1]].push(r);
          if (inMap[r[2]])  inMap[r[2]].push(r);
        });
        const mAbbr = (mt, rt) => {
          const ms = {"Nucleophilic":"Nu","Electrophilic":"E","Free radical":"FR"};
          const rs = {"Substitution":"Sub","Addition":"Add","Elimination":"Elim","Oxidation":"Ox","Reduction":"Red","Acid-base":"A-B","Esterification":"Ester","Hydrolysis":"Hydrol","Hydration":"Hydra","Dehydration":"Dehydra","Acylation":"Acyl","Friedel-Crafts Acylation":"FC Acyl","Friedel-Crafts Alkylation":"FC Alkyl","Nitration":"Nitration","Diazotisation":"Diaz","Azo Coupling":"Azo"};
          const m = ms[mt] || ""; const r = rs[rt] || rt || "";
          return m ? `${m} ${r}` : r;
        };
        const rxnTypeColors = {"Substitution":"#2563eb","Addition":"#16a34a","Elimination":"#ea580c","Oxidation":"#dc2626","Reduction":"#7c3aed","Acid-base":"#0891b2","Esterification":"#0891b2","Hydrolysis":"#0284c7","Hydration":"#0284c7","Dehydration":"#ea580c","Acylation":"#6366f1","Friedel-Crafts Acylation":"#6366f1","Friedel-Crafts Alkylation":"#6366f1","Nitration":"#dc2626","Diazotisation":"#be185d","Azo Coupling":"#7c3aed"};
        return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Sub-tabs + quiz */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e8f0", padding: "0 14px", background: "#fff", flexShrink: 0 }}>
              {[["ali","Aliphatic","27"],["aro","Aromatic","9"]].map(([id,lbl,cnt]) => (
                <button key={id} onClick={() => { setSynthTab(id); setSelectedFrom(null); setSelectedRxn(null); track("view_synthesis", { map: id }); }} style={{
                  padding:"12px 18px", border:"none", background:"none", fontFamily:"inherit",
                  fontSize:"15px", fontWeight:800, cursor:"pointer",
                  color: synthTab===id ? "#0f1d35" : "#7a95b0",
                  borderBottom: synthTab===id ? "3px solid #29ABE2" : "3px solid transparent",
                  marginBottom:"-2px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"8px",
                  letterSpacing:"0.3px"
                }}>
                  {lbl}
                  <span style={{ fontSize:"11px", fontWeight:700, background:synthTab===id?"#e0f4fd":"#f0f4f8", color:synthTab===id?"#29ABE2":"#94a3b8", padding:"3px 10px", borderRadius:"12px" }}>{cnt}</span>
                </button>
              ))}
              <div style={{ flex:1 }} />
              <button onClick={() => setSynthQuiz(q => !q)} style={{
                padding:"6px 14px", borderRadius:"20px", border:"none",
                background:synthQuiz?"linear-gradient(135deg,#f97316,#ea580c)":"#f0f4f8", color:synthQuiz?"#fff":"#7a95b0",
                fontSize:"12px", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                boxShadow: synthQuiz ? "0 2px 8px rgba(249,115,22,0.3)" : "none"
              }}>Quiz {synthQuiz?"ON":"OFF"}</button>
            </div>
            {/* Hint bar */}
            <div style={{ fontSize:"12px", color: selId ? "#059669" : "#94a3b8", fontWeight: selId ? 600 : 400, padding:"6px 14px 5px", textAlign:"center", flexShrink:0, background: selId ? "#f0fdf4" : "#fff", borderBottom:"1px solid #f0f4f8", transition:"all 0.2s" }}>
              {selId ? `${selNodeData ? selNodeData[1].replace(/\n/g," ") : ""} selected - tap another compound or background to clear` : "Tap a compound to highlight its reaction routes"}
            </div>
            {/* SVG map - scrollable */}
            <div style={{ flex:1, overflow:"auto", WebkitOverflowScrolling:"touch", background:"linear-gradient(180deg, #f0f4f8 0%, #e8eef6 100%)" }}>
              <svg
                viewBox={`0 0 ${vbW} ${vbH}`}
                width={vbW * 1.05} height={vbH * 1.05}
                style={{ display:"block", margin:"12px auto" }}
                onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }}
              >
                <defs>
                  <marker id="mn" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0,0.5 L6,3.5 L0,6.5z" fill="#1a2d45" />
                  </marker>
                  <marker id="mo" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0.5 L7,4 L0,7.5z" fill="#059669" />
                  </marker>
                  <marker id="mi" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0.5 L7,4 L0,7.5z" fill="#2563eb" />
                  </marker>
                  <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
                  </filter>
                  <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#059669" floodOpacity="0.4" />
                  </filter>
                </defs>
                <rect x={0} y={0} width={vbW} height={vbH} fill="transparent" />
                {/* Zone backgrounds removed for cleaner look */}
                {/* Edges - curved arrows (reverse pairs get bigger curve separation) */}
                {(() => {
                  // Build reverse-pair lookup: for reactions A->B and B->A, curve them in opposite directions
                  const pairKey = (a,b) => a < b ? a+"|"+b : b+"|"+a;
                  const pairDir = {};
                  sRxns.forEach(r => {
                    const k = pairKey(r[1],r[2]);
                    if (pairDir[k] === undefined) pairDir[k] = r[0];
                    // else it's the reverse - second one found
                  });
                  return sRxns.map(r => {
                    const [n, fromId, toId] = r;
                    const fN = nodeMap[fromId], tN = nodeMap[toId];
                    if (!fN || !tN) return null;
                    const frw = fN[5]*SW, frh = fN[6]*SW, trw = tN[5]*SW, trh = tN[6]*SW;
                    const [x1,y1] = edgePt(fN[2],fN[3],frw,frh,tN[2],tN[3]);
                    const [x2,y2] = edgePt(tN[2],tN[3],trw,trh,fN[2],fN[3]);
                    const isOut = selId && fromId === selId;
                    const isIn  = selId && toId   === selId;
                    const isDim = connRxnIds && !connRxnIds.has(n);
                    const mx = (x1+x2)/2, my = (y1+y2)/2;
                    const dx = x2-x1, dy = y2-y1;
                    const len = Math.sqrt(dx*dx+dy*dy) || 1;
                    // Detect reverse pair and choose direction
                    const pk = pairKey(fromId, toId);
                    const isFirst = pairDir[pk] === n;
                    const hasReverse = sRxns.some(o => o[0] !== n && ((o[1]===fromId && o[2]===toId) || (o[1]===toId && o[2]===fromId)));
                    const curveOff = hasReverse ? Math.min(len * 0.22, 35) : Math.min(len * 0.1, 16);
                    const sign = hasReverse ? (isFirst ? 1 : -1) : 1;
                    const cx1 = mx + (dy/len)*curveOff*sign, cy1 = my - (dx/len)*curveOff*sign;
                    return (
                      <path key={"e"+n}
                        d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`}
                        fill="none"
                        stroke={isOut ? "#059669" : isIn ? "#2563eb" : selId ? "#d0d8e0" : "#1a2d45"}
                        strokeWidth={isOut||isIn ? 2.5 : selId ? 0.8 : 1.5}
                        opacity={isDim ? 0.1 : 1}
                        markerEnd={isOut ? "url(#mo)" : isIn ? "url(#mi)" : "url(#mn)"}
                        strokeLinecap="round"
                      />
                    );
                  });
                })()}
                {/* Nodes - tappable cards with shadows */}
                {sNodes.map(([id, label, cx, cy, fill, hw, hh]) => {
                  const rw = hw*SW, rh = hh*SW;
                  const lines = label.split("\n");
                  const lh = 14, th = lines.length * lh;
                  const isSel = id === selId;
                  const isConn = connNodeIds && connNodeIds.has(id);
                  const isDim = connNodeIds && !connNodeIds.has(id);
                  return (
                    <g key={id} onClick={e => { e.stopPropagation(); setSelectedFrom(id === selId ? null : id); setSelectedRxn(null); }} style={{ cursor:"pointer" }}>
                      {/* Selection glow ring */}
                      {isSel && <rect x={cx-rw-6} y={cy-rh-6} width={(rw+6)*2} height={(rh+6)*2} rx={14} fill="rgba(5,150,105,0.12)" stroke="#059669" strokeWidth={2.5} filter="url(#glowGreen)" />}
                      {/* Node body - pastel fill with coloured border */}
                      <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                        rx={12} fill={isDim ? "#f0f4f8" : "#fff"} opacity={isDim ? 0.4 : 1}
                        stroke={isSel ? "#059669" : fill}
                        strokeWidth={isSel ? 2.5 : 2}
                        filter={isDim ? "none" : "url(#nodeShadow)"}
                      />
                      {/* Pastel colour wash */}
                      {!isDim && <rect x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                        rx={12} fill={fill} fillOpacity={0.12}
                        style={{ pointerEvents:"none" }} />}
                      {/* Left accent bar */}
                      {!isDim && <rect x={cx-rw} y={cy-rh+4} width={3.5} height={rh*2-8}
                        rx={2} fill={fill} style={{ pointerEvents:"none" }} />}
                      {lines.map((ln,li) => (
                        <text key={li} x={cx} y={cy - th/2 + li*lh + lh*0.85}
                          textAnchor="middle" fontSize="12.5" fontWeight="800"
                          fill={isDim ? "#c0cdd8" : fill}
                          style={{ userSelect:"none", pointerEvents:"none" }}>{ln}</text>
                      ))}
                    </g>
                  );
                })}
                {/* Reaction labels — reagents & mechanism along edges */}
                {sRxns.map(r => {
                  const [n, fromId, toId, bx, by, , , reagents, conditions, mechType, rxnType] = r;
                  const isAct = selectedRxn === n;
                  const isOut = selId && fromId === selId;
                  const isIn  = selId && toId === selId;
                  const isDim = connRxnIds && !connRxnIds.has(n);
                  const mech = mAbbr(mechType, rxnType);
                  const tCol = rxnTypeColors[rxnType] || "#475569";
                  const shortReagent = reagents.length > 24 ? reagents.slice(0, 21) + "…" : reagents;
                  const reagentFill = isOut ? "#059669" : isIn ? "#2563eb" : "#1a2d45";
                  const mechFill = isOut ? "#047857" : isIn ? "#1d4ed8" : tCol;
                  const quizHide = synthQuiz;
                  return (
                    <g key={"b"+n} onClick={e => { e.stopPropagation(); setSelectedRxn(isAct ? null : n); }} style={{ cursor:"pointer" }}
                      opacity={isDim ? 0.12 : 1}>
                      <rect x={bx - 58} y={by - 14} width={116} height={28} fill="transparent" />
                      {quizHide ? (
                        <>
                          <text x={bx} y={by + 3} textAnchor="middle" fontSize="7.5" fontWeight="700"
                            fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"
                            style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                          <text x={bx} y={by + 3} textAnchor="middle" fontSize="7.5" fontWeight="700"
                            fill={mechFill}
                            style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                        </>
                      ) : (
                        <>
                          <text x={bx} y={by - 2} textAnchor="middle" fontSize="8" fontWeight="700"
                            fill="none" stroke="white" strokeWidth="3.5" strokeLinejoin="round"
                            style={{ userSelect:"none", pointerEvents:"none" }}>{shortReagent}</text>
                          <text x={bx} y={by - 2} textAnchor="middle" fontSize="8" fontWeight="700"
                            fill={reagentFill}
                            style={{ userSelect:"none", pointerEvents:"none" }}>{shortReagent}</text>
                          <text x={bx} y={by + 9} textAnchor="middle" fontSize="7" fontWeight="700"
                            fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"
                            style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                          <text x={bx} y={by + 9} textAnchor="middle" fontSize="7" fontWeight="700"
                            fill={mechFill}
                            style={{ userSelect:"none", pointerEvents:"none" }}>{mech}</text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
              {/* Colour legend for reaction types */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 12px", padding:"8px 14px 10px", justifyContent:"center" }}>
                {[["Sub","Substitution","#2563eb"],["Add","Addition","#16a34a"],["Elim","Elimination","#ea580c"],["Ox","Oxidation","#dc2626"],["Red","Reduction","#7c3aed"],["A-B","Acid-base","#0891b2"],["Ester","Esterification","#0891b2"],["Acyl","Acylation","#6366f1"]].map(([lbl,,col]) => (
                  <div key={lbl} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:col, flexShrink:0 }} />
                    <span style={{ fontSize:"10px", fontWeight:600, color:"#4a6070" }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* ═══ POPUP MODALS (overlay on top of map) ═══ */}
            {/* Compound connections popup */}
            {selId && !selRxn && (
              <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
                onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }}>
                <div style={{ position:"absolute", inset:0, background:"rgba(15,29,53,0.45)", backdropFilter:"blur(4px)" }} />
                <div style={{ position:"relative", background:"#fff", borderRadius:"18px", padding:"18px 16px 20px", width:"100%", maxWidth:"380px", maxHeight:"80vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
                  onClick={e => e.stopPropagation()}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <div style={{ width:"4px", height:"24px", borderRadius:"2px", background: selNodeData ? selNodeData[4] : "#059669" }} />
                      <div style={{ fontSize:"15px", fontWeight:800, color:"#1a2d45" }}>{selNodeData ? selNodeData[1].replace(/\n/g," ") : ""}</div>
                    </div>
                    <button onClick={() => { setSelectedFrom(null); setSelectedRxn(null); }} style={{
                      background:"#f0f4f8", border:"none", borderRadius:"50%", width:"30px", height:"30px",
                      fontSize:"14px", color:"#7a95b0", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center"
                    }}>✕</button>
                  </div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    {outRxns.length > 0 && (
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"10px", fontWeight:700, color:"#059669", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"7px" }}>Makes ({outRxns.length})</div>
                        {outRxns.map(r => (
                          <button key={r[0]} onClick={() => setSelectedRxn(r[0])} style={{
                            width:"100%", textAlign:"left", padding:"8px 10px", borderRadius:"10px", marginBottom:"5px",
                            border:"1.5px solid #e8edf2", background:"#fafcff", cursor:"pointer", fontFamily:"inherit",
                            display:"flex", alignItems:"center", gap:"8px"
                          }}>
                            <span style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#dcfce7", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:800, color:"#059669", flexShrink:0 }}>{r[0]}</span>
                            <span style={{ fontSize:"12px", fontWeight:600, color:"#1a2d45", lineHeight:1.3 }}>{r[6]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {inRxns.length > 0 && (
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"10px", fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"7px" }}>From ({inRxns.length})</div>
                        {inRxns.map(r => (
                          <button key={r[0]} onClick={() => setSelectedRxn(r[0])} style={{
                            width:"100%", textAlign:"left", padding:"8px 10px", borderRadius:"10px", marginBottom:"5px",
                            border:"1.5px solid #e8edf2", background:"#fafcff", cursor:"pointer", fontFamily:"inherit",
                            display:"flex", alignItems:"center", gap:"8px"
                          }}>
                            <span style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#dbeafe", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:800, color:"#2563eb", flexShrink:0 }}>{r[0]}</span>
                            <span style={{ fontSize:"12px", fontWeight:600, color:"#1a2d45", lineHeight:1.3 }}>{r[5]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Reaction detail popup with structural formulas */}
            {selRxn && (() => {
              const rxnExamples = REACTION_EXAMPLES[synthTab];
              const example = rxnExamples ? rxnExamples[selRxn[0]] : null;
              return (
                <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
                  onClick={() => setSelectedRxn(null)}>
                  <div style={{ position:"absolute", inset:0, background:"rgba(15,29,53,0.45)", backdropFilter:"blur(4px)" }} />
                  <div style={{ position:"relative", background:"#fff", borderRadius:"18px", padding:"0", width:"100%", maxWidth:"400px", maxHeight:"85vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
                    onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid #f0f4f8" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"6px" }}>
                            <span style={{ fontSize:"10px", fontWeight:700, color:"#fff", background:"#1a2d45", padding:"3px 10px", borderRadius:"20px" }}>Rxn {selRxn[0]}</span>
                            <span style={{ fontSize:"10px", fontWeight:700, color:"#059669", background:"#dcfce7", padding:"3px 10px", borderRadius:"20px" }}>{selRxn[10]}</span>
                            {selRxn[9] !== "--" && <span style={{ fontSize:"10px", fontWeight:700, color:"#29ABE2", background:"#eaf6fd", padding:"3px 10px", borderRadius:"20px" }}>{selRxn[9]}</span>}
                          </div>
                          <div style={{ fontSize:"15px", fontWeight:800, color:"#1a2d45" }}>
                            {selRxn[5]} <span style={{ color:"#94a3b8", fontWeight:400 }}>→</span> {selRxn[6]}
                          </div>
                        </div>
                        <button onClick={() => setSelectedRxn(null)} style={{ background:"#f0f4f8", border:"none", borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#7a95b0", flexShrink:0, marginLeft:"8px", fontSize:"15px", fontWeight:700 }}>✕</button>
                      </div>
                    </div>
                    {synthQuiz ? (
                      <div style={{ padding:"20px 16px", background:"#fff7ed", textAlign:"center", color:"#ea580c", fontWeight:600, fontSize:"13px", borderRadius:"0 0 18px 18px" }}>
                        Quiz mode - tap "Quiz OFF" to reveal
                      </div>
                    ) : (
                      <>
                        {/* Reagents & Conditions */}
                        <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                          <div style={{ background:"#f0f7ff", borderRadius:"10px", padding:"10px 12px", borderLeft:"3px solid #29ABE2" }}>
                            <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"4px" }}>Reagents</div>
                            <div style={{ fontSize:"12.5px", color:"#1a2d45", fontWeight:600, lineHeight:1.4 }}>{selRxn[7]}</div>
                          </div>
                          <div style={{ background:"#f0fdf4", borderRadius:"10px", padding:"10px 12px", borderLeft:"3px solid #16a34a" }}>
                            <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"4px" }}>Conditions</div>
                            <div style={{ fontSize:"12.5px", color:"#1a2d45", fontWeight:600, lineHeight:1.4 }}>{selRxn[8]}</div>
                          </div>
                        </div>
                        {/* Example reaction with structural formulas */}
                        {example && (
                          <div style={{ padding:"4px 16px 16px" }}>
                            <div style={{ fontSize:"9px", fontWeight:700, color:"#7a95b0", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px" }}>Example Reaction</div>
                            {/* Equation text */}
                            <div style={{ fontSize:"12px", color:"#475569", fontWeight:600, textAlign:"center", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.2px", lineHeight:1.5 }}>
                              {example.eq.split(" --> ").map((part, pi) => (
                                <span key={pi}>
                                  {pi > 0 && <span style={{ color:"#1a2d45", fontWeight:700, margin:"0 6px" }}> → </span>}
                                  {part}
                                </span>
                              ))}
                            </div>
                            {/* Structural formula SVGs */}
                            <div style={{ background:"#fafcff", border:"1.5px solid #e8edf2", borderRadius:"12px", padding:"14px 10px", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                              {renderReactionSvg(example.from, example.to)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}
      {topicsTab === "extended" && (() => {
        const purple = "#7c3aed";
        const purpleLight = "#f3f0ff";
        const purpleMid = "#ede9fe";
        const filteredQs = EXTENDED_QUESTIONS.filter(q => q.board === "both" || q.board === board);
        const categories = [...new Set(filteredQs.map(q => q.category))];

        // Category picker
        if (!extCategory) return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "6px", lineHeight: 1.5, fontWeight: 600 }}>6-Mark Extended Responses</p>
            <p style={{ color: "#7a95b0", fontSize: "12px", marginBottom: "16px", lineHeight: 1.5 }}>
              Read the question, think through your answer, then reveal the mark scheme. Tick each point you covered to track your score.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {categories.map((cat, catIdx) => {
                const qs = filteredQs.filter(q => q.category === cat);
                const scores = qs.map(q => extScore[q.id]).filter(Boolean);
                const totalMarks = qs.length * 6;
                const earnedMarks = scores.reduce((a, b) => a + b, 0);
                const extLocked = !hasFullAccess && catIdx > 0;
                return (
                  <button key={cat} onClick={() => { if (!extLocked) { setExtCategory(cat); setExtQPicker(true); setExtIndex(0); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); track("select_ext_category", { category: cat, board }); } }}
                    style={{ background: "#fff", border: `2px solid ${purpleLight}`, borderRadius: "14px", padding: "14px 12px", textAlign: "left", cursor: extLocked ? "default" : "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s", position: "relative", overflow: "hidden" }}>
                    {extLocked && <LockedOverlay />}
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: purple, marginBottom: "8px" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3, marginBottom: "4px" }}>{cat}</div>
                    <div style={{ fontSize: "11px", color: purple, fontWeight: 600 }}>{qs.length} question{qs.length > 1 ? "s" : ""} · {qs[0]?.marks || 6} marks each</div>
                    {scores.length > 0 && <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{earnedMarks}/{scores.length * 6} marks scored</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );

        // Question picker
        const catQs = filteredQs.filter(q => q.category === extCategory);
        if (extQPicker) return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            <button onClick={() => { setExtCategory(null); setExtQPicker(false); }}
              style={{ background: "none", border: "none", color: purple, fontWeight: 700, fontSize: "13px", cursor: "pointer", padding: "0 0 14px 0", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}>
              &#8592; Back to topics
            </button>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45", marginBottom: "4px" }}>{extCategory}</p>
            <p style={{ fontSize: "12px", color: "#7a95b0", marginBottom: "16px" }}>Choose a question to attempt</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {catQs.map((question, i) => {
                const savedScore = extScore[question.id];
                const attempted = savedScore !== undefined;
                return (
                  <button key={question.id}
                    onClick={() => { setExtIndex(i); setExtQPicker(false); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiError(null); setExtAiLoading(false); setExtShowModel(false); track("attempt_extended", { question_id: catQs[i].id, category: extCategory, board }); }}
                    style={{ background: "#fff", border: `2px solid ${attempted ? purple : purpleLight}`, borderRadius: "14px", padding: "14px 14px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: purple, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Q{i + 1} &middot; {question.marks} marks
                        </div>
                        <div style={{ fontSize: "12px", color: "#1a2d45", lineHeight: 1.5, fontWeight: 500 }}>
                          {question.question.length > 120 ? question.question.slice(0, 120).trim() + "..." : question.question}
                        </div>
                      </div>
                      {attempted && (
                        <div style={{ flexShrink: 0, background: savedScore >= question.marks * 0.7 ? "#d1fae5" : savedScore >= question.marks * 0.4 ? "#fef9c3" : "#fee2e2",
                          color: savedScore >= question.marks * 0.7 ? "#065f46" : savedScore >= question.marks * 0.4 ? "#92400e" : "#991b1b",
                          borderRadius: "8px", padding: "4px 8px", fontSize: "12px", fontWeight: 700 }}>
                          {savedScore}/{question.marks}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

        // Question view
        const q = catQs[extIndex];
        if (!q) return null;
        const isLast = extIndex === catQs.length - 1;
        const marksThisQ = extMarked.size;

        // Render question text with proper tables for pipe-separated data
        const renderQuestionText = (text) => {
          const lines = text.split("\n");
          const result = [];
          let i = 0;
          while (i < lines.length) {
            // Detect table: lines with | separators (at least 2 pipes)
            if (lines[i].includes(" | ") && (lines[i].match(/\|/g) || []).length >= 2) {
              const tableLines = [];
              while (i < lines.length && lines[i].includes(" | ") && (lines[i].match(/\|/g) || []).length >= 2) {
                tableLines.push(lines[i].split(" | ").map(c => c.trim()));
                i++;
              }
              if (tableLines.length > 0) {
                const headerRow = tableLines[0];
                const dataRows = tableLines.slice(1);
                result.push(
                  <div key={`tbl-${result.length}`} style={{ overflowX: "auto", margin: "12px 0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif" }}>
                      <thead>
                        <tr>
                          {headerRow.map((h, ci) => (
                            <th key={ci} style={{ background: "#f0f4f8", padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#1a2d45", borderBottom: "2px solid #d0dce8", fontSize: "12px" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataRows.map((row, ri) => (
                          <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f8fafc" }}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={{ padding: "7px 10px", borderBottom: "1px solid #e8eef4", color: "#1a2d45", fontSize: "13px" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
            } else {
              // Regular text line
              const line = lines[i];
              if (line.trim() === "") {
                result.push(<div key={`sp-${result.length}`} style={{ height: "8px" }} />);
              } else {
                result.push(<div key={`ln-${result.length}`}>{line}</div>);
              }
              i++;
            }
          }
          return result;
        };

        const canSubmit = extDraft.trim().length >= 20;
        const handleSubmit = async () => {
          setExtAiLoading(true);
          setExtAiError(null);
          track("submit_ai_examine", { question_id: thisQ.id, category: extCategory, board });
          logActivity("extended");
          try {
            const res = await fetch('/api/examine.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: q.question, markScheme: q.markScheme, studentAnswer: extDraft, maxMarks: q.marks, levels: q.levels }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server error');
            setExtAiResult(data);
            const covered = new Set((data.coveredPoints || []).map((c, i) => c ? i : -1).filter(i => i >= 0));
            setExtMarked(covered);
            setExtScore(s => ({ ...s, [q.id]: data.score }));
            setExtRevealed(true);
          } catch (err) {
            setExtAiError(err.message || 'Could not reach AI Examiner');
          } finally {
            setExtAiLoading(false);
          }
        };
        const toggleMark = (i) => {
          setExtMarked(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i); else next.add(i);
            // save score
            setExtScore(s => ({ ...s, [q.id]: next.size }));
            return next;
          });
        };
        const resetExt = () => {
          setExtRevealed(false);
          setExtMarked(new Set());
          setExtDraft("");
          setExtAiResult(null);
          setExtAiLoading(false);
          setExtShowModel(false);
          setExtAiError(null);
        };
        const goNext = () => { setExtIndex(i => i + 1); resetExt(); };

        const scoreColour = marksThisQ >= q.marks * 0.75 ? "#16a34a" : marksThisQ >= q.marks * 0.5 ? "#d97706" : "#dc2626";

        return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <button onClick={() => { setExtQPicker(true); setExtRevealed(false); setExtMarked(new Set()); setExtDraft(""); setExtAiResult(null); setExtAiLoading(false); setExtShowModel(false); setExtAiError(null); }} style={{ background: "none", border: "none", color: purple, fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>&#8592; Questions</button>
              <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{extCategory} · Q{extIndex + 1} / {catQs.length}</div>
            </div>
            {/* Progress bar */}
            <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "16px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((extIndex + 1) / catQs.length) * 100}%`, background: purple, borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
            {/* Question card */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "12px", border: `1px solid ${purpleMid}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", background: purpleLight, padding: "3px 8px", borderRadius: "6px" }}>{q.category}</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", background: "#f0f4f8", padding: "3px 8px", borderRadius: "6px" }}>{q.marks} marks</div>
              </div>
              <div style={{ fontSize: "15.5px", color: "#1a2d45", lineHeight: 1.75, fontWeight: 500, fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "0.01em" }}>{renderQuestionText(q.question)}</div>
            </div>
            {/* Answer box - required */}
            {!extRevealed && !extAiLoading && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45", textTransform: "uppercase", letterSpacing: "1px" }}>Your Answer <span style={{ color: "#dc2626" }}>*</span></div>
                  <div style={{ fontSize: "11px", color: canSubmit ? "#16a34a" : "#7a95b0", fontWeight: 600 }}>{canSubmit ? "Ready to submit" : `${Math.max(0, 20 - extDraft.trim().length)} chars to unlock`}</div>
                </div>
                <textarea
                  value={extDraft}
                  onChange={e => setExtDraft(e.target.value)}
                  placeholder={`Write your full answer to this ${q.marks}-mark question here. Cover every point you know - the AI Examiner will mark it against the mark scheme.`}
                  rows={7}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: `2px solid ${canSubmit ? "#7c3aed" : "#d0dce8"}`, fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#1a2d45", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s" }}
                />
              </div>
            )}
            {/* Submit to AI Examiner */}
            {!extRevealed && !extAiLoading && (
              <button onClick={handleSubmit} disabled={!canSubmit} style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: canSubmit ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e0e8f0",
                color: canSubmit ? "#fff" : "#9ca3af",
                fontSize: "15px", fontWeight: 800, cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "inherit", boxShadow: canSubmit ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}>
                Submit to AI Examiner
              </button>
            )}
            {/* Error state */}
            {extAiError && !extAiLoading && (
              <div style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: "14px", padding: "16px 18px", marginTop: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#be123c", marginBottom: "6px" }}>⚠️ AI Examiner unavailable</div>
                <div style={{ fontSize: "12px", color: "#9f1239", lineHeight: 1.6, marginBottom: "12px" }}>
                  {extAiError === 'API key not configured'
                    ? 'The API key has not been added to Vercel. Add ANTHROPIC_API_KEY in Vercel > Settings > Environment Variables, then redeploy.'
                    : `Error: ${extAiError}`}
                </div>
                <button onClick={handleSubmit} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "#be123c", color: "#fff", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  Try Again
                </button>
              </div>
            )}
            {/* Loading state */}
            {extAiLoading && (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px", animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45", marginBottom: "4px" }}>AI Examiner is reading your answer...</div>
                <div style={{ fontSize: "12px", color: "#7a95b0" }}>Marking against the mark scheme</div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {/* AI Results */}
            {extRevealed && (
              <div>
                {/* Your answer reminder */}
                {extDraft.trim() && (
                  <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "12px 14px", marginBottom: "12px", border: "1px solid #e0e8f0" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#7a95b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Your Answer</div>
                    <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{extDraft}</div>
                  </div>
                )}
                {/* AI score & feedback */}
                {extAiResult && (
                  <>
                    <div style={{ background: "linear-gradient(135deg,#1a2d45,#7c3aed)", borderRadius: "16px", padding: "18px", marginBottom: "12px", color: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8, letterSpacing: "1px", textTransform: "uppercase" }}>AI Examiner</div>
                          {extAiResult.level !== undefined && (
                            <div style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px", color: extAiResult.level >= 3 ? "#86efac" : extAiResult.level >= 2 ? "#fcd34d" : extAiResult.level >= 1 ? "#fca5a5" : "#f87171", background: "rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: "6px", display: "inline-block" }}>
                              Level {extAiResult.level}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                          <span style={{ fontSize: "32px", fontWeight: 900, color: scoreColour === "#16a34a" ? "#86efac" : scoreColour === "#d97706" ? "#fcd34d" : "#fca5a5" }}>{marksThisQ}</span>
                          <span style={{ fontSize: "16px", opacity: 0.7 }}>/ {q.marks}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.95 }}>{extAiResult.feedback}</div>
                    </div>
                    {/* Covered / missed points */}
                    <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Indicative Content - tap to adjust</div>
                      {q.markScheme.map((point, i) => {
                        const ticked = extMarked.has(i);
                        const aiSaid = extAiResult.coveredPoints[i];
                        return (
                          <button key={i} onClick={() => toggleMark(i)}
                            style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? "#f0fdf4" : "#fff8f8", border: `1.5px solid ${ticked ? "#16a34a" : "#fecaca"}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                            <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${ticked ? "#16a34a" : "#f87171"}`, background: ticked ? "#16a34a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all 0.15s" }}>
                              {ticked ? <span style={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}>✓</span> : <span style={{ color: "#f87171", fontSize: "13px", fontWeight: 900 }}>✗</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "13px", color: ticked ? "#15803d" : "#7f1d1d", lineHeight: 1.5, fontWeight: ticked ? 600 : 400 }}>{point}</div>
                              {aiSaid !== ticked && <div style={{ fontSize: "10px", color: "#7a95b0", marginTop: "3px" }}>AI said: {aiSaid ? "covered ✓" : "missed ✗"} - tap to override</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {/* Model answer toggle */}
                    <button onClick={() => setExtShowModel(v => !v)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #e9d5ff", background: extShowModel ? "#f3f0ff" : "#faf5ff", color: purple, fontFamily: "inherit", fontSize: "13px", fontWeight: 700, cursor: "pointer", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>Show Model Answer</span>
                      <span style={{ transform: extShowModel ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                    </button>
                    {extShowModel && (
                      <div style={{ background: "#f3f0ff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #ddd6fe", marginBottom: "12px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Model Answer</div>
                        <div style={{ fontSize: "13px", color: "#1a2d45", lineHeight: 1.7 }}>{extAiResult.modelAnswer}</div>
                      </div>
                    )}
                  </>
                )}
                {/* No AI result - fallback manual mark scheme */}
                {!extAiResult && (
                  <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", border: `1px solid ${purpleMid}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: purple, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Indicative Content - tick each point you covered</div>
                    {q.markScheme.map((point, i) => {
                      const ticked = extMarked.has(i);
                      return (
                        <button key={i} onClick={() => toggleMark(i)}
                          style={{ display: "flex", gap: "10px", alignItems: "flex-start", width: "100%", textAlign: "left", background: ticked ? "#f0fdf4" : "transparent", border: `1px solid ${ticked ? "#16a34a" : "#e8eef4"}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                          <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${ticked ? "#16a34a" : "#c8d6e4"}`, background: ticked ? "#16a34a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all 0.15s" }}>
                            {ticked && <span style={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}>✓</span>}
                          </div>
                          <div style={{ fontSize: "13px", color: ticked ? "#15803d" : "#1a2d45", lineHeight: 1.6, fontWeight: ticked ? 600 : 400 }}>{point}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Examiner tip */}
                <div style={{ background: "#fffbeb", borderRadius: "12px", padding: "14px 16px", border: "1px solid #fde68a", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Examiner Tip</div>
                  <div style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.65 }}>{q.examTip}</div>
                </div>
                {/* Navigation */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {!isLast ? (
                    <button onClick={goNext} style={{ flex: 1, padding: "13px", background: purple, border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Next Question →
                    </button>
                  ) : (
                    <button onClick={() => { setExtCategory(null); setExtIndex(0); resetExt(); }}
                      style={{ flex: 1, padding: "13px", background: "#1a2d45", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Finish - Back to Topics
                    </button>
                  )}
                  <button onClick={resetExt} style={{ padding: "13px 16px", background: "#f0f4f8", border: "none", borderRadius: "12px", color: "#4a6080", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {topicsTab === "calc" && (
        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
          {/* ── Topic selection ── */}
          {!calcTopic && (
            <div>
              <p style={{ color: "#4a6080", fontSize: "14px", marginBottom: "12px", lineHeight: 1.5 }}>
                Worked calc questions across all topics. Pick a topic then choose your difficulty.
              </p>
              {/* AS / A2 toggle */}
              <div style={{ display: "flex", gap: "0", marginBottom: "16px", borderRadius: "10px", overflow: "hidden", border: "2px solid #29ABE2" }}>
                {[{key:"as",label:"AS (Year 1)"},{key:"a2",label:"A2 (Year 2)"}].map(tab => (
                  <button key={tab.key} onClick={() => setCalcYear(tab.key)} style={{
                    flex: 1, padding: "10px", border: "none", fontSize: "13px", fontWeight: 700,
                    fontFamily: "inherit", cursor: "pointer",
                    background: calcYear === tab.key ? "#29ABE2" : "#ffffff",
                    color: calcYear === tab.key ? "#ffffff" : "#29ABE2",
                  }}>{tab.label}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {CALC_SETS.filter(set => {
                  // Filter by board
                  if (set.board !== "both" && set.board !== board) return false;
                  // AS shows only AS topics, A2 shows all
                  if (calcYear === "as" && set.year === "a2") return false;
                  return true;
                }).map(set => {
                  const score = calcScore[set.id] || { correct: 0, attempted: 0 };
                  const calcLocked = !hasFullAccess && !FREE_CALC_IDS.includes(set.id);
                  return (
                    <button key={set.id} onClick={() => { if (!calcLocked) { setCalcTopic(set.id); setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); track("select_calc_topic", { topic: set.id, title: set.title }); } }} style={{
                      background: "#ffffff", border: `2px solid ${set.color}30`,
                      borderRadius: "14px", padding: "14px 12px", textAlign: "left",
                      cursor: calcLocked ? "default" : "pointer", fontFamily: "inherit",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      position: "relative", overflow: "hidden",
                    }}>
                      {calcLocked && <LockedOverlay />}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: set.color }} />
                        {set.year === "a2" && calcYear === "a2" && <span style={{ fontSize: "9px", fontWeight: 700, color: "#fff", background: "#7c3aed", borderRadius: "4px", padding: "1px 5px" }}>A2</span>}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.3, marginBottom: "4px" }}>{set.title}</div>
                      <div style={{ fontSize: "11px", color: set.color, fontWeight: 600 }}>{set.questions.length} questions</div>
                      {score.attempted > 0 && (
                        <div style={{ fontSize: "11px", color: "#7a95b0", marginTop: "4px" }}>{score.correct}/{score.attempted} correct</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* ── Difficulty selection ── */}
          {calcTopic && !calcDifficulty && (() => {
            const set = CALC_SETS.find(s => s.id === calcTopic);
            if (!set) return null;
            const tiers = [
              { key: "all",    label: "All Questions",  icon: "∞", color: "#1a2d45",  desc: `${set.questions.length} questions across all levels` },
              { key: "easy",   label: "Easy",           icon: "1", color: "#16a34a",  desc: `${set.questions.filter(q=>q.difficulty==="easy").length} questions - single or two-step` },
              { key: "medium", label: "Medium",         icon: "2", color: "#d97706",  desc: `${set.questions.filter(q=>q.difficulty==="medium").length} questions - multi-step, unit conversions` },
              { key: "hard",   label: "Hard",           icon: "3", color: "#dc2626",  desc: `${set.questions.filter(q=>q.difficulty==="hard").length} questions - longer chains, stoichiometry` },
              { key: "exam",   label: "Exam Style",     icon: "★", color: "#7c3aed",  desc: `${set.questions.filter(q=>q.difficulty==="exam").length} questions - past paper difficulty` },
            ];
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <button onClick={() => setCalcTopic(null)} style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>← Topics</button>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45" }}>{set.title}</div>
                </div>
                <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Choose difficulty</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tiers.map(t => (
                    <button key={t.key} onClick={() => {
                      const baseQ = t.key === "all" ? set.questions : set.questions.filter(qq => qq.difficulty === t.key);
                      // Sort by spaced repetition: wrong first, unseen next, correct last
                      try {
                        const srData = JSON.parse(localStorage.getItem("hsj-calc-sr") || "{}");
                        const topicSR = srData[calcTopic] || {};
                        baseQ.sort((a, b) => {
                          const aK = JSON.stringify(a.q).slice(0, 40), bK = JSON.stringify(b.q).slice(0, 40);
                          const aH = topicSR[aK] || { correct: 0, wrong: 0 }, bH = topicSR[bK] || { correct: 0, wrong: 0 };
                          const aS = aH.wrong > 0 ? 0 : (aH.correct === 0 ? 1 : 2 + aH.correct);
                          const bS = bH.wrong > 0 ? 0 : (bH.correct === 0 ? 1 : 2 + bH.correct);
                          return aS - bS;
                        });
                      } catch {}
                      setCalcSortedQs(baseQ);
                      setCalcDifficulty(t.key); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); track("select_difficulty", { topic: calcTopic, difficulty: t.key });
                    }} style={{
                      background: "#ffffff", border: `2px solid ${t.color}20`, borderRadius: "14px",
                      padding: "14px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: "14px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 800, color: t.color, flexShrink: 0 }}>{t.icon}</div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45" }}>{t.label}</div>
                        <div style={{ fontSize: "12px", color: "#7a95b0", marginTop: "2px" }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          {/* ── Question view ── */}
          {calcTopic && calcDifficulty && (() => {
            const set = CALC_SETS.find(s => s.id === calcTopic);
            if (!set) return null;
            const filteredQs = calcSortedQs.length > 0 ? calcSortedQs : (calcDifficulty === "all" ? set.questions : set.questions.filter(q => q.difficulty === calcDifficulty));
            if (filteredQs.length === 0) return <div style={{ color: "#7a95b0", fontSize: "14px" }}>No questions at this difficulty yet.</div>;

            const q = filteredQs[calcIndex] || filteredQs[0];
            const currentIdx = Math.min(calcIndex, filteredQs.length - 1);
            const isLast = currentIdx === filteredQs.length - 1;
            const diffColors = { easy: "#16a34a", medium: "#d97706", hard: "#dc2626", exam: "#7c3aed" };
            const diffLabels = { easy: "Easy", medium: "Medium", hard: "Hard", exam: "Exam Style" };
            const checkAnswer = () => {
              if (!calcChecked) {
                const correct = q.isText
                  ? calcInput.trim().toUpperCase().replace(/\s/g,"") === String(q.answer).toUpperCase().replace(/\s/g,"")
                  : Math.abs(parseFloat(calcInput) - q.answer) <= q.tolerance;
                setCalcScore(prev => {
                  const s = prev[calcTopic] || { correct: 0, attempted: 0 };
                  return { ...prev, [calcTopic]: { correct: s.correct + (correct ? 1 : 0), attempted: s.attempted + 1 } };
                });
                track("attempt_question", { topic: calcTopic, difficulty: q.difficulty, correct, question_index: currentIdx });
                logActivity("calc");
                logScore("calc", calcTopic, correct ? 1 : 0, 1);
                // Update spaced repetition data
                try {
                  const srData = JSON.parse(localStorage.getItem("hsj-calc-sr") || "{}");
                  const topicSR = srData[calcTopic] || {};
                  const qKey = JSON.stringify(q.q).slice(0, 40);
                  const prev = topicSR[qKey] || { correct: 0, wrong: 0, last: 0 };
                  topicSR[qKey] = { correct: correct ? prev.correct + 1 : Math.max(0, prev.correct - 1), wrong: correct ? Math.max(0, prev.wrong - 1) : prev.wrong + 1, last: Date.now() };
                  srData[calcTopic] = topicSR;
                  localStorage.setItem("hsj-calc-sr", JSON.stringify(srData));
                } catch {}
              }
              setCalcChecked(true);
              setCalcShowSteps(true);
            };
            const isCorrect = calcChecked && (q.isText
              ? calcInput.trim().toUpperCase().replace(/\s/g,"") === String(q.answer).toUpperCase().replace(/\s/g,"")
              : Math.abs(parseFloat(calcInput) - q.answer) <= q.tolerance);
            return (
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <button onClick={() => { setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>← Difficulty</button>
                  <div style={{ fontSize: "12px", color: "#7a95b0", fontWeight: 600 }}>{currentIdx + 1} / {filteredQs.length}</div>
                </div>
                {/* Progress bar */}
                <div style={{ height: "4px", background: "#e0e8f0", borderRadius: "2px", marginBottom: "14px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${((currentIdx + 1) / filteredQs.length) * 100}%`, background: set.color, borderRadius: "2px", transition: "width 0.3s" }} />
                </div>
                {/* Difficulty badge */}
                {q.difficulty && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${diffColors[q.difficulty]}15`, borderRadius: "6px", padding: "3px 9px", marginBottom: "10px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: diffColors[q.difficulty] }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: diffColors[q.difficulty], textTransform: "uppercase", letterSpacing: "0.5px" }}>{diffLabels[q.difficulty]}</span>
                  </div>
                )}
                {/* Periodic table popup buttons */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <button onClick={() => setShowPT("aqa")} style={{ fontSize: "11px", fontWeight: 600, color: "#29ABE2", background: "#eaf6fd", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>📊 Periodic Table (AQA)</button>
                  <button onClick={() => setShowPT("ocr")} style={{ fontSize: "11px", fontWeight: 600, color: "#7c3aed", background: "#f3f0ff", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>📊 Periodic Table (OCR)</button>
                </div>
                {/* Periodic table popup modal */}
                {showPT && (
                  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setShowPT(null)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", width: "95vw", maxWidth: "900px", maxHeight: "80vh", overflow: "auto", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                      <div style={{ position: "sticky", top: 0, background: "#fff", padding: "12px 16px", borderBottom: "1px solid #e0e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "16px 16px 0 0", zIndex: 2 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a2d45" }}>{showPT === "aqa" ? "AQA" : "OCR A"} Periodic Table</div>
                        <button onClick={() => setShowPT(null)} style={{ background: "#f0f4f8", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4a6080", fontFamily: "inherit" }}>Close</button>
                      </div>
                      <div style={{ padding: "12px", textAlign: "center" }}>
                        <img
                          src={showPT === "aqa" ? "/pt-aqa.png" : "/pt-ocr.png"}
                          alt={`${showPT === "aqa" ? "AQA" : "OCR A"} Periodic Table`}
                          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Question + input layout */}
                <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "14px", border: "1px solid #e8eef4" }}>
                  <div style={{ fontSize: "19px", color: "#1a2d45", lineHeight: 1.75, fontWeight: 600, whiteSpace: "pre-line", fontFamily: "'Outfit','DM Sans',sans-serif", marginBottom: (q.diagram || q.dataTable) ? "0" : "16px" }}>{q.q}</div>
                  {(q.dataTable || q.diagram) && (
                    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", margin: "16px 0", flexWrap: "wrap" }}>
                      {q.dataTable && (
                        <table style={{ borderCollapse: "collapse", fontSize: "16px", fontFamily: "'Outfit','DM Sans',sans-serif", flexShrink: 0 }}>
                          <tbody>
                            {q.dataTable.map((row, ri) => (
                              <tr key={ri} style={{ background: ri % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                                <td style={{ padding: "10px 20px 10px 12px", fontWeight: 600, color: "#1a2d45", borderBottom: "1px solid #e0e8f0", fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: row[0].replace(/ΔHlatt/g, "ΔH<sub>latt</sub>").replace(/ΔHat/g, "ΔH<sub>at</sub>").replace(/ΔHf/g, "ΔH<sub>f</sub>") }} />
                                <td style={{ padding: "10px 12px", fontWeight: 700, color: "#29ABE2", borderBottom: "1px solid #e0e8f0", fontSize: "16px", whiteSpace: "nowrap" }}>{row[1]} kJ mol⁻¹</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {q.diagram && (
                        <div style={{ flex: 1, minWidth: "260px", maxWidth: "700px" }}>{q.diagram}</div>
                      )}
                    </div>
                  )}
                  {/* Input inside the card */}
                  {!calcChecked && (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                      <input
                        type={q.isText ? "text" : "number"}
                        value={calcInput}
                        onChange={e => setCalcInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && calcInput && checkAnswer()}
                        placeholder={q.isText ? "e.g. C2H4" : "Your answer"}
                        style={{ width: "200px", padding: "12px 16px", borderRadius: "10px", border: "2px solid #d0dce8", fontSize: "16px", fontFamily: "'Outfit','DM Sans',sans-serif", outline: "none", color: "#1a2d45", background: "#f8fafc" }}
                      />
                      {q.unit && <div style={{ fontSize: "14px", color: "#7a95b0", fontWeight: 600, whiteSpace: "nowrap" }}>{q.unit}</div>}
                      <button onClick={checkAnswer} disabled={!calcInput} style={{ padding: "12px 28px", background: calcInput ? "#29ABE2" : "#e0e8f0", border: "none", borderRadius: "10px", color: calcInput ? "#ffffff" : "#9ca3af", fontSize: "15px", fontWeight: 700, cursor: calcInput ? "pointer" : "not-allowed", fontFamily: "'Outfit','DM Sans',sans-serif", marginLeft: "4px" }}>
                        Check
                      </button>
                      {/* Hint toggle */}
                      <button onClick={() => setCalcShowHint(!calcShowHint)} style={{ padding: "12px 16px", background: "none", border: "1.5px solid #29ABE2", borderRadius: "10px", color: "#29ABE2", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                        {calcShowHint ? "Hide hint" : "Hint"}
                      </button>
                    </div>
                  )}
                  {/* Hint inline */}
                  {!calcChecked && calcShowHint && (
                    <div style={{ background: "#eaf6fd", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: "#1a2d45", lineHeight: 1.6, marginBottom: "8px" }}>{q.hint}</div>
                  )}
                </div>
                {/* Result + worked solution */}
                {calcChecked && (
                  <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: "14px", border: "1px solid #e8eef4" }}>
                    {/* Result banner */}
                    <div style={{ borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", background: isCorrect ? "#dcfce7" : "#fee2e2", border: `2px solid ${isCorrect ? "#16a34a" : "#dc2626"}` }}>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: isCorrect ? "#15803d" : "#dc2626" }}>{isCorrect ? "Correct!" : "Not quite"}{!isCorrect && <span style={{ fontWeight: 500, marginLeft: "8px" }}>Answer: {q.answer} {q.unit}</span>}</div>
                    </div>
                    {/* Worked solution */}
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#29ABE2", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Worked Solution</div>
                    {q.steps.map((step, si) => (
                      <div key={si} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#29ABE2", background: "#eaf6fd", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>{si + 1}</div>
                        <div style={{ fontSize: "18px", color: "#1a2d45", lineHeight: 1.5, fontFamily: "'Caveat', cursive", fontWeight: 600 }}>{step}</div>
                      </div>
                    ))}
                    {/* Navigation */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
                      {!isLast ? (
                        <button onClick={() => { setCalcIndex(currentIdx + 1); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); }} style={{ padding: "12px 28px", background: "#29ABE2", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Next →
                        </button>
                      ) : (
                        <button onClick={() => { setCalcDifficulty(null); setCalcIndex(0); setCalcInput(""); setCalcChecked(false); }} style={{ padding: "12px 28px", background: "#1a2d45", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Finish
                        </button>
                      )}
                      <button onClick={() => { setCalcIndex(0); setCalcInput(""); setCalcChecked(false); setCalcShowSteps(false); setCalcShowHint(false); }} style={{ padding: "12px 16px", background: "#f0f4f8", border: "none", borderRadius: "10px", color: "#4a6080", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Restart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── MECHANISMS TAB ────────────────────────────────── */}
      {topicsTab === "mechanisms" && !isAdmin && (
        <div style={{ padding:"40px 24px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div style={{ fontSize:"48px", marginBottom:"16px" }}>🧪</div>
          <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", marginBottom:"8px" }}>Mechanisms Coming Soon</div>
          <div style={{ fontSize:"15px", color:"#64748b", lineHeight:1.6, maxWidth:"400px" }}>
            Step-by-step animated curly arrow mechanisms are being built. This feature will be available soon!
          </div>
        </div>
      )}
      {topicsTab === "mechanisms" && isAdmin && (() => {
        const activeMech = mechId ? MECHS.find(m => m.id === mechId) : null;

        // ── List view ──
        if (!activeMech) return (
          <div style={{ padding:"16px", flex:1, overflowY:"auto" }}>
            <style>{`@keyframes mechFadeIn{from{opacity:0}to{opacity:1}}`}</style>
            <p style={{ color:"#475569", fontSize:"15px", marginBottom:"20px", lineHeight:1.6 }}>
              Handdrawn curly-arrow mechanisms with interactive explanations. Tap a mechanism to start.
            </p>
            {Object.entries(
              MECHS.reduce((acc,m)=>{ (acc[m.category]=acc[m.category]||[]).push(m); return acc; }, {})
            ).map(([cat, list]) => (
              <div key={cat} style={{ marginBottom:"22px" }}>
                <div style={{ fontSize:"13px", fontWeight:800, color:"#0f1d35", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"10px", borderBottom:"2px solid #e2e8f0", paddingBottom:"6px" }}>{cat}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {list.map((m, mIdx) => {
                    const mechLocked = !hasFullAccess && mIdx >= FREE_MECH_COUNT;
                    const hasImages = m.hasHanddrawn;
                    return (
                    <button key={m.id} onClick={()=>{ if (!mechLocked) { setMechId(m.id); setMechStep(0); setMechOpenCards({}); track("view_mechanism", { mechanism: m.id, title: m.title }); logActivity("mechanism"); } }}
                      style={{ background:"#ffffff", border:`2px solid ${m.color}30`, borderRadius:"14px",
                        padding:"16px 18px", textAlign:"left", cursor: mechLocked ? "default" : "pointer", fontFamily:"inherit",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"border-color 0.2s", position:"relative", overflow:"hidden",
                        opacity: hasImages ? 1 : 0.5 }}>
                      {mechLocked && <LockedOverlay />}
                      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                        <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:m.color, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"16px", fontWeight:700, color:"#0f1d35", marginBottom:"4px", lineHeight:1.3 }}>{m.title}</div>
                          <div style={{ fontSize:"14px", color:"#475569", fontFamily:"'DM Sans',system-ui,sans-serif", letterSpacing:"0.3px" }}>{m.subtitle}</div>
                        </div>
                        <div style={{ display:"flex", gap:"5px", flexShrink:0 }}>
                          {!hasImages && <span style={{ fontSize:"11px", fontWeight:700, background:"#f59e0b20", color:"#d97706", padding:"3px 8px", borderRadius:"8px" }}>SOON</span>}
                          {m.specs.map(s=><span key={s} style={{ fontSize:"11px", fontWeight:700, background:`${m.color}15`, color:m.color, padding:"3px 8px", borderRadius:"8px" }}>{s.replace("_"," ")}</span>)}
                        </div>
                      </div>
                    </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );

        // ── Handdrawn mechanism viewer ──
        if (activeMech.hasHanddrawn) {
          const images = activeMech.handdrawnImages || [];
          const explainers = activeMech.explainers || [];
          const hasMultipleImages = images.length > 1;

          return (
            <div style={{ padding:"0", flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
              <style>{`@keyframes mechFadeIn{from{opacity:0}to{opacity:1}}`}</style>

              {/* Header */}
              <div style={{ padding:"12px 16px 8px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #e8edf3" }}>
                <button onClick={()=>{ setMechId(null); setMechStep(0); setMechOpenCards({}); }}
                  style={{ background:"#f0f4f8", border:"1px solid #dde4ed", borderRadius:"8px", padding:"6px 12px",
                    color:"#29ABE2", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", fontWeight:600 }}>
                  ← Back
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", letterSpacing:"-0.3px" }}>{activeMech.title}</div>
                  <div style={{ fontSize:"15px", color:"#475569", fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:500, marginTop:"2px" }}>{activeMech.subtitle}</div>
                </div>
              </div>

              {/* Image tabs for multi-step mechanisms */}
              {hasMultipleImages && (
                <div style={{ display:"flex", gap:"6px", padding:"10px 16px 4px", overflowX:"auto" }}>
                  {images.map((img, idx) => (
                    <button key={idx} onClick={()=>setMechStep(idx)}
                      style={{ padding:"7px 14px", borderRadius:"20px", border:"none", cursor:"pointer",
                        fontFamily:"inherit", fontSize:"12px", fontWeight:700, whiteSpace:"nowrap",
                        background: mechStep === idx ? activeMech.color : "#f0f4f8",
                        color: mechStep === idx ? "#fff" : "#4a6080",
                        transition:"all 0.2s" }}>
                      {img.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Side-by-side: image left, explainers right */}
              <div style={{ display:"flex", gap:"16px", padding:"10px 16px 24px", flex:1, minHeight:0 }}>
                {/* Mechanism image — left */}
                <div key={`mech-img-${mechStep}`} style={{ flex:"1 1 55%", minWidth:0, background:"#fff", border:"1.5px solid #e2e8f0",
                  borderRadius:"16px", padding:"12px", overflow:"hidden", animation:"mechFadeIn 0.3s ease", alignSelf:"flex-start" }}>
                  <img
                    src={process.env.PUBLIC_URL + images[Math.min(mechStep, images.length - 1)].src}
                    alt={activeMech.title}
                    style={{ width:"100%", height:"auto", display:"block", borderRadius:"10px" }}
                  />
                </div>

                {/* Interactive explainer cards — right */}
                <div style={{ flex:"1 1 45%", minWidth:0, display:"flex", flexDirection:"column", gap:"8px", overflowY:"auto" }}>
                  <div style={{ fontSize:"13px", fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"6px" }}>
                    Tap to learn each part
                  </div>
                  {explainers.map((ex, idx) => {
                    const isOpen = mechOpenCards[idx];
                    const stepColors = ["#29ABE2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0284c7", "#ea580c", "#0d9488"];
                    const circleColor = stepColors[idx % stepColors.length];
                    return (
                      <button key={idx} onClick={()=> setMechOpenCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        style={{ background: isOpen ? `${circleColor}08` : "#fff",
                          border: isOpen ? `2px solid ${circleColor}40` : "1.5px solid #e2e8f0",
                          borderRadius:"12px", padding:"10px 14px", textAlign:"left", cursor:"pointer",
                          fontFamily:"inherit", transition:"all 0.2s" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <div style={{ width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                            background: circleColor,
                            color: "#fff",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"12px", fontWeight:800, transition:"all 0.2s" }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex:1, fontSize:"13px", fontWeight:700, color:"#1a2d45", lineHeight:1.3 }}>
                            {ex.title}
                          </div>
                          <div style={{ fontSize:"14px", color:"#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition:"transform 0.2s", flexShrink:0 }}>
                            ▼
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:`1px solid ${circleColor}20`,
                            fontSize:"13px", color:"#475569", lineHeight:1.65, fontWeight:400,
                            animation:"mechFadeIn 0.2s ease" }}>
                            {ex.text}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        // ── Fallback: old animated viewer for mechanisms without handdrawn images ──
        return (
          <div style={{ padding:"40px 24px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🧪</div>
            <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", marginBottom:"8px" }}>Handdrawn Explanation Coming Soon</div>
            <div style={{ fontSize:"15px", color:"#64748b", lineHeight:1.6, maxWidth:"400px" }}>
              The handdrawn step-by-step explanation of this mechanism is being built. Check back soon!
            </div>
            <button onClick={()=>{ setMechId(null); setMechStep(0); }}
              style={{ marginTop:"20px", padding:"10px 24px", borderRadius:"12px", border:"none", cursor:"pointer",
                background:"#29ABE2", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
              ← Back to List
            </button>
          </div>
        );
      })()}

      {/* ── MCQ TAB ────────────────────────────────────────── */}
      {topicsTab === "mcq" && (() => {
        const mcqBoard = board === "ocr" ? "OCR_A" : "AQA";
        const mcqTopics = Object.entries(mcqData.topics).map(([id, t]) => ({ id, ...t })).filter(t => t.board === mcqBoard);
        const boardQuestions = mcqData.questions.filter(q => { const t = mcqData.topics[q.topic]; return t && t.board === mcqBoard; });
        const topicQuestions = mcqTopic ? [...boardQuestions.filter(q => q.topic === mcqTopic)].sort(() => Math.random() - 0.5) : [];
        const shuffledAll = mcqMode === "random" && mcqQuizSize ? [...boardQuestions].sort(() => Math.random() - 0.5).slice(0, mcqQuizSize) : [];
        const activeQuestions = mcqMode === "random" ? shuffledAll : topicQuestions;
        const currentQ = activeQuestions[mcqIdx];

        // Topic selection view
        if (!mcqTopic && mcqMode === "topic") {
          const mcqCategoryColors = {
            "Physical": "#0284c7",
            "Inorganic": "#059669",
            "Organic": "#d97706",
          };
          const getCategory = (id) => {
            if (id.startsWith("OCR-P")) return "Past Paper MCQs";
            if (id.startsWith("3.1")) return "Physical Chemistry";
            if (id.startsWith("3.2")) return "Inorganic Chemistry";
            return "Organic Chemistry";
          };
          const getCatColor = (id) => {
            if (id.startsWith("OCR-P")) return "#7c3aed";
            if (id.startsWith("3.1")) return mcqCategoryColors["Physical"];
            if (id.startsWith("3.2")) return mcqCategoryColors["Inorganic"];
            return mcqCategoryColors["Organic"];
          };
          const filteredTopics = mcqTopics.filter(t => mcqYear === "as" ? t.level === "AS" : true);
          const grouped = {};
          filteredTopics.forEach(t => {
            const cat = getCategory(t.id);
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(t);
          });

          return (
            <div style={{ padding:"16px", flex:1, overflowY:"auto" }}>
              <p style={{ color:"#4a6080", fontSize:"14px", marginBottom:"12px", lineHeight:1.5 }}>
                Multiple choice questions with solutions. Pick a topic or try a random quiz.
              </p>
              {/* AS / A2 toggle */}
              <div style={{ display:"flex", gap:"0", marginBottom:"16px", borderRadius:"10px", overflow:"hidden", border:"2px solid #dc2626" }}>
                {[{key:"as",label:"AS (Year 1)"},{key:"a2",label:"A2 (Year 2)"}].map(tab => (
                  <button key={tab.key} onClick={() => setMcqYear(tab.key)} style={{
                    flex:1, padding:"10px", border:"none", fontSize:"13px", fontWeight:700,
                    fontFamily:"inherit", cursor:"pointer",
                    background: mcqYear === tab.key ? "#dc2626" : "#ffffff",
                    color: mcqYear === tab.key ? "#ffffff" : "#dc2626",
                  }}>{tab.label}</button>
                ))}
              </div>
              {/* Random quiz size picker */}
              <div style={{ marginBottom:"18px" }}>
                <div style={{ fontSize:"12px", fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px" }}>
                  Random Quiz
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  {[25, 50, 100].map(size => (
                    <button key={size} onClick={() => { setMcqMode("random"); setMcqTopic("_random"); setMcqQuizSize(size); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); }}
                      style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border:"2px solid #dc262630", cursor:"pointer",
                        background:"#fff", fontFamily:"inherit", textAlign:"center",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize:"18px", fontWeight:800, color:"#dc2626" }}>{size}</div>
                      <div style={{ fontSize:"10px", color:"#64748b", fontWeight:600, marginTop:"2px" }}>questions</div>
                    </button>
                  ))}
                  <button onClick={() => {
                    const custom = prompt("How many questions? (1-" + mcqData.questions.length + ")");
                    const num = parseInt(custom);
                    if (num && num > 0 && num <= mcqData.questions.length) {
                      setMcqMode("random"); setMcqTopic("_random"); setMcqQuizSize(num); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 });
                    }
                  }}
                    style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border:"2px solid #dc262630", cursor:"pointer",
                      background:"#fff", fontFamily:"inherit", textAlign:"center",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, color:"#dc2626" }}>?</div>
                    <div style={{ fontSize:"10px", color:"#64748b", fontWeight:600, marginTop:"2px" }}>custom</div>
                  </button>
                </div>
              </div>
              {/* Grouped topic cards — collapsible */}
              {Object.entries(grouped).map(([cat, topics]) => {
                const color = getCatColor(topics[0].id);
                const isOpen = mcqOpenCats[cat];
                const totalQs = topics.reduce((sum, t) => sum + t.questionCount, 0);
                return (
                  <div key={cat} style={{ marginBottom:"10px" }}>
                    <button onClick={() => setMcqOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))}
                      style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"12px 14px", borderRadius:"12px", border:`2px solid ${color}25`,
                        background: isOpen ? `${color}08` : "#fff", cursor:"pointer", fontFamily:"inherit",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.04)", transition:"all 0.2s" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <div style={{ width:"10px", height:"10px", borderRadius:"50%", background: color }} />
                        <div style={{ fontSize:"14px", fontWeight:800, color: color, letterSpacing:"0.3px" }}>{cat}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ fontSize:"11px", fontWeight:600, color:"#64748b" }}>{topics.length} topics · {totalQs} Qs</span>
                        <span style={{ fontSize:"14px", color:"#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition:"transform 0.2s" }}>▼</span>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"10px", paddingLeft:"4px", paddingRight:"4px" }}>
                        {topics.map(t => (
                          <button key={t.id} onClick={() => { setMcqTopic(t.id); setMcqMode("topic"); setMcqIdx(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore({ correct: 0, total: 0 }); }}
                            style={{ background:"#fff", border:`2px solid ${color}30`, borderRadius:"14px", padding:"14px 12px",
                              textAlign:"left", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"8px" }}>
                              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background: color }} />
                              {t.level === "A2" && mcqYear === "a2" && <span style={{ fontSize:"9px", fontWeight:700, color:"#fff", background:"#7c3aed", borderRadius:"4px", padding:"1px 5px" }}>A2</span>}
                            </div>
                            <div style={{ fontSize:"13px", fontWeight:700, color:"#1a2d45", lineHeight:1.3, marginBottom:"4px" }}>{t.name}</div>
                            <div style={{ fontSize:"11px", color: color, fontWeight:600 }}>{t.questionCount} questions</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        // Quiz view
        if (!currentQ) return (
          <div style={{ padding:"40px 24px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:"#059669", marginBottom:"16px", letterSpacing:"-0.5px" }}>Complete</div>
            <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", marginBottom:"8px" }}>Quiz Complete!</div>
            <div style={{ fontSize:"18px", color:"#dc2626", fontWeight:700, marginBottom:"4px" }}>{mcqScore.correct} / {mcqScore.total} correct</div>
            <div style={{ fontSize:"15px", color:"#64748b", marginBottom:"20px" }}>
              {mcqScore.total > 0 ? `${Math.round((mcqScore.correct / mcqScore.total) * 100)}%` : ""}
            </div>
            <button onClick={() => { setMcqTopic(null); setMcqMode("topic"); setMcqIdx(0); setMcqScore({ correct: 0, total: 0 }); setMcqQuizSize(null); }}
              style={{ padding:"12px 28px", borderRadius:"12px", border:"none", cursor:"pointer",
                background:"#dc2626", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
              ← Back to Topics
            </button>
          </div>
        );

        const optionLetters = ["A","B","C","D"];
        // OCR past-paper MCQs are stored as a full-question screenshot (stem +
        // options live inside the image); their `q` text field is an unrelated
        // scrape artifact, so suppress it and let the image stand in. NB: AQA
        // "See diagram" questions are different — there the image holds only the
        // options and `q` is the real stem, so they must keep their text.
        const imageIsQuestion = (currentQ.topic || "").startsWith("OCR") &&
          !!currentQ.image && !!currentQ.options &&
          Object.values(currentQ.options).every(v => v === "See diagram");

        return (
          <div style={{ padding:"0", flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <style>{`@keyframes mcqFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Header */}
            <div style={{ padding:"12px 16px 8px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #e8edf3" }}>
              <button onClick={() => { setMcqTopic(null); setMcqMode("topic"); setMcqIdx(0); setMcqScore({ correct: 0, total: 0 }); setMcqQuizSize(null); }}
                style={{ background:"#f0f4f8", border:"1px solid #dde4ed", borderRadius:"8px", padding:"6px 12px",
                  color:"#dc2626", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", fontWeight:600 }}>
                ← Back
              </button>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#1a2d45" }}>
                  {mcqMode === "random" ? "Random Quiz" : `${mcqTopic} — ${mcqData.topics[mcqTopic]?.name || ""}`}
                </div>
              </div>
              <div style={{ fontSize:"13px", fontWeight:700, color:"#dc2626", background:"#dc262612", padding:"4px 10px", borderRadius:"8px" }}>
                {mcqScore.correct}/{mcqScore.total} · Q{mcqIdx + 1}/{activeQuestions.length}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ padding:"8px 16px 0" }}>
              <div style={{ height:"4px", background:"#e8edf3", borderRadius:"2px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${((mcqIdx + 1) / activeQuestions.length) * 100}%`,
                  background:"#dc2626", borderRadius:"2px", transition:"width 0.3s ease" }}/>
              </div>
            </div>

            {/* Question */}
            <div key={currentQ.id} style={{ padding:"16px", animation:"mcqFadeIn 0.3s ease" }}>
              {!imageIsQuestion && (
                <div style={{ fontSize:"16px", fontWeight:700, color:"#0f1d35", lineHeight:1.5, marginBottom: currentQ.image ? "10px" : "16px" }}>
                  {chemFormat(currentQ.q)}
                </div>
              )}

              {/* Question image (for diagram-based questions) */}
              {currentQ.image && (
                <div style={{ marginBottom:"14px", background:"#fff", border:"1.5px solid #e2e8f0",
                  borderRadius:"12px", padding:"8px", overflow:"hidden" }}>
                  <img src={process.env.PUBLIC_URL + currentQ.image} alt="Question diagram"
                    style={{ width:"100%", height:"auto", display:"block", borderRadius:"8px" }} />
                </div>
              )}

              {/* Options */}
              <div style={{ display:"flex", flexDirection: currentQ.image && Object.values(currentQ.options).every(v => v === "See diagram") ? "row" : "column", gap:"10px", flexWrap:"wrap" }}>
                {optionLetters.map(letter => {
                  const optText = currentQ.options[letter];
                  if (!optText) return null;
                  const isSelected = mcqSelected === letter;
                  const isCorrect = letter === currentQ.answer;
                  const showResult = mcqRevealed;

                  let bg = "#fff";
                  let border = "1.5px solid #e2e8f0";
                  let textColor = "#1a2d45";
                  if (showResult && isCorrect) { bg = "#dcfce7"; border = "2px solid #22c55e"; }
                  else if (showResult && isSelected && !isCorrect) { bg = "#fef2f2"; border = "2px solid #ef4444"; }
                  else if (isSelected && !showResult) { bg = "#dc262610"; border = "2px solid #dc2626"; }

                  return (
                    <button key={letter} onClick={() => { if (!mcqRevealed) setMcqSelected(letter); }}
                      style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", borderRadius:"12px",
                        border, background: bg, cursor: mcqRevealed ? "default" : "pointer", fontFamily:"inherit",
                        textAlign:"left", transition:"all 0.2s" }}>
                      <div style={{ width:"30px", height:"30px", borderRadius:"50%", flexShrink:0,
                        background: isSelected ? "#dc2626" : "#f0f4f8",
                        color: isSelected ? "#fff" : "#64748b",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"13px", fontWeight:800, transition:"all 0.2s" }}>
                        {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : letter}
                      </div>
                      {optText !== "See diagram" && (
                        <div style={{ fontSize:"14px", color: textColor, lineHeight:1.4, fontWeight: showResult && isCorrect ? 700 : 400 }}>
                          {chemFormat(optText)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (shown after reveal) */}
              {mcqRevealed && currentQ.explanation && (
                <div style={{ marginTop:"14px", padding:"12px 16px", background:"#f0fdf4", border:"1.5px solid #bbf7d0",
                  borderRadius:"12px", fontSize:"13px", color:"#166534", lineHeight:1.6, animation:"mcqFadeIn 0.3s ease" }}>
                  <span style={{ fontWeight:700 }}>Answer: {currentQ.answer}</span>
                  {currentQ.explanation && <span> — {chemFormat(currentQ.explanation)}</span>}
                </div>
              )}

              {/* Check / Next buttons */}
              <div style={{ marginTop:"16px", display:"flex", gap:"10px" }}>
                {!mcqRevealed ? (
                  <button key="mcq-check-btn" onClick={() => {
                    if (!mcqSelected) return;
                    setMcqRevealed(true);
                    setMcqScore(prev => ({
                      correct: prev.correct + (mcqSelected === currentQ.answer ? 1 : 0),
                      total: prev.total + 1
                    }));
                  }}
                    disabled={!mcqSelected}
                    style={{ flex:1, padding:"14px", borderRadius:"12px", border:"none",
                      cursor: mcqSelected ? "pointer" : "default",
                      background: mcqSelected ? "#dc2626" : "#e8edf3",
                      color: mcqSelected ? "#fff" : "#b0c4d4",
                      fontSize:"14px", fontWeight:700, fontFamily:"inherit",
                      boxShadow: mcqSelected ? "0 4px 14px rgba(220,38,38,0.3)" : "none" }}>
                    Check Answer
                  </button>
                ) : (
                  <button key="mcq-next-btn" onClick={() => {
                    setMcqIdx(i => i + 1);
                    setMcqSelected(null);
                    setMcqRevealed(false);
                  }}
                    style={{ flex:1, padding:"14px", borderRadius:"12px", border:"none", cursor:"pointer",
                      background:"#dc2626", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit",
                      boxShadow:"0 4px 14px rgba(220,38,38,0.3)" }}>
                    {mcqIdx < activeQuestions.length - 1 ? "Next Question →" : "See Results"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── NMR PRACTICE TAB ──────────────────────────────────────────────────── */}
      {topicsTab === "nmr" && !isAdmin && (
        <UpgradeCard section="NMR Practice" />
      )}
      {topicsTab === "nmr" && isAdmin && (() => {
        const challenge = NMR_CHALLENGES[nmrChallengeIdx];
        const accentColor = "#8b5cf6";

        return (
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            {/* Sub-tab switcher */}
            <div style={{ display: "flex", gap: "0", marginBottom: "16px", borderRadius: "10px", overflow: "hidden", border: `2px solid ${accentColor}` }}>
              {[
                { key: "challenges", label: "Spectrum Challenges" },
                { key: "flashcards", label: "Flashcards" },
                { key: "mcqs", label: "MCQs" },
              ].map(tab => (
                <button key={tab.key} onClick={() => { setNmrSubTab(tab.key); }}
                  style={{ flex: 1, padding: "10px", border: "none", fontSize: "12px", fontWeight: 700,
                    fontFamily: "inherit", cursor: "pointer",
                    background: nmrSubTab === tab.key ? accentColor : "#ffffff",
                    color: nmrSubTab === tab.key ? "#ffffff" : accentColor,
                  }}>{tab.label}</button>
              ))}
            </div>

            {/* SPECTRUM CHALLENGES */}
            {nmrSubTab === "challenges" && challenge && (
              <div>
                {/* Challenge picker */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {NMR_CHALLENGES.map((c, i) => (
                    <button key={c.id} onClick={() => { setNmrChallengeIdx(i); setNmrRevealed(false); }}
                      style={{ padding: "6px 12px", borderRadius: "8px", border: `1.5px solid ${i === nmrChallengeIdx ? accentColor : "#e2e8f0"}`,
                        background: i === nmrChallengeIdx ? `${accentColor}15` : "#fff",
                        color: i === nmrChallengeIdx ? accentColor : "#64748b",
                        fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Side-by-side layout: spectrum left, answer right */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  {/* LEFT: Spectrum + question */}
                  <div style={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
                          Deduce the structure
                        </div>
                        <div style={{ fontSize: "38px", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
                          {chemFormat(challenge.formula)}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginTop: "10px", lineHeight: 1.5 }}>
                          Identify the compound from the ¹H NMR spectrum below.
                        </div>
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700, whiteSpace: "nowrap", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
                        {nmrChallengeIdx + 1} / {NMR_CHALLENGES.length}
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "8px" }}>
                      <NmrSpectrum peaks={challenge.peaks} revealed={nmrRevealed} />
                    </div>

                    {!nmrRevealed && (
                      <button onClick={() => setNmrRevealed(true)}
                        style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer",
                          background: accentColor, color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
                          boxShadow: `0 4px 14px ${accentColor}50`, marginTop: "16px" }}>
                        Show Answer
                      </button>
                    )}

                    {nmrRevealed && (
                      <button onClick={() => {
                        if (nmrChallengeIdx < NMR_CHALLENGES.length - 1) {
                          setNmrChallengeIdx(i => i + 1);
                          setNmrRevealed(false);
                        }
                      }}
                        disabled={nmrChallengeIdx >= NMR_CHALLENGES.length - 1}
                        style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", marginTop: "16px",
                          cursor: nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? "pointer" : "default",
                          background: nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? accentColor : "#e2e8f0",
                          color: nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? "#fff" : "#94a3b8",
                          fontSize: "14px", fontWeight: 700, fontFamily: "inherit" }}>
                        {nmrChallengeIdx < NMR_CHALLENGES.length - 1 ? "Next Challenge →" : "All Challenges Complete!"}
                      </button>
                    )}
                  </div>

                  {/* RIGHT: Answer panel (only when revealed) */}
                  {nmrRevealed && (
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px", animation: "mcqFadeIn 0.3s ease" }}>
                      {/* Structure */}
                      <div style={{ background: `${accentColor}08`, border: `1.5px solid ${accentColor}30`, borderRadius: "12px", padding: "16px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Structure</div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: "#1a2d45", marginBottom: "4px" }}>{challenge.name}</div>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#475569" }}>{chemFormat(challenge.molecular)}</div>
                      </div>

                      {/* Peak-by-peak breakdown */}
                      <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", padding: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Peak-by-Peak Analysis</div>
                        {challenge.peaks.map((p, i) => (
                          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: i < challenge.peaks.length - 1 ? "6px" : 0,
                            padding: "7px 10px", background: "#fff", borderRadius: "8px", border: "1px solid #dcfce7" }}>
                            <div style={{ minWidth: "46px", fontWeight: 800, color: accentColor, fontSize: "13px" }}>δ {p.shift}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a2d45" }}>
                                {p.label}: {p.splitting}, {p.integration}H
                              </div>
                              <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>{p.env}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Full explanation */}
                      <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "12px", padding: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e40af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Full Explanation</div>
                        <div style={{ fontSize: "13px", color: "#1e3a5f", lineHeight: 1.65 }}>{challenge.answer}</div>
                      </div>

                      {/* Exam tip */}
                      <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "12px", padding: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Exam Tip</div>
                        <div style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.55 }}>{challenge.tips}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NMR FLASHCARDS */}
            {nmrSubTab === "flashcards" && (() => {
              const cards = nmrFlashcards;
              if (cards.length === 0) return <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No NMR flashcards available for this board.</div>;
              const card = cards[nmrFlashIdx];
              return (
                <div>
                  <div style={{ textAlign: "center", fontSize: "12px", color: "#64748b", marginBottom: "12px", fontWeight: 600 }}>
                    {nmrFlashIdx + 1} / {cards.length}
                  </div>
                  <div onClick={() => setNmrFlashFlipped(f => !f)}
                    style={{ perspective: "1200px", cursor: "pointer", maxWidth: "700px", margin: "0 auto" }}>
                    <div style={{ position: "relative", minHeight: "320px", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d",
                      transform: nmrFlashFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                      {/* Front */}
                      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: `linear-gradient(145deg, ${accentColor}, #6d28d9)`,
                        borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                        boxShadow: `0 12px 40px ${accentColor}50` }}>
                        <div style={{ position: "absolute", top: "14px", left: "18px", fontSize: "10px", color: "rgba(255,255,255,0.7)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Question</div>
                        <p style={{ fontSize: card.q.length > 120 ? "15px" : "18px", lineHeight: 1.55, textAlign: "center", fontWeight: 700, color: "#fff", margin: 0 }}>{card.q}</p>
                        <div style={{ position: "absolute", bottom: "14px", fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>Tap to reveal</div>
                      </div>
                      {/* Back */}
                      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                        background: "#fff", border: `2px solid ${accentColor}`, borderRadius: "20px", padding: "32px 24px",
                        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                        boxShadow: `0 12px 40px ${accentColor}30` }}>
                        <div style={{ position: "absolute", top: "14px", left: "18px", fontSize: "10px", color: accentColor, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Answer</div>
                        <div style={{ fontSize: card.a.length > 200 ? "13px" : "15px", lineHeight: 1.7, textAlign: "center", color: "#1a2d45", whiteSpace: "pre-line", fontWeight: 500 }}>{card.a}</div>
                        <div style={{ position: "absolute", bottom: "14px", fontSize: "11px", color: "#94a3b8" }}>Tap to flip back</div>
                      </div>
                    </div>
                  </div>
                  {/* Nav buttons */}
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
                    <button onClick={() => { setNmrFlashIdx(i => Math.max(0, i - 1)); setNmrFlashFlipped(false); }}
                      disabled={nmrFlashIdx === 0}
                      style={{ padding: "10px 24px", borderRadius: "10px", border: `1.5px solid ${accentColor}30`, background: "#fff",
                        color: nmrFlashIdx === 0 ? "#cbd5e1" : accentColor, fontSize: "13px", fontWeight: 700, cursor: nmrFlashIdx === 0 ? "default" : "pointer", fontFamily: "inherit" }}>
                      ← Prev
                    </button>
                    <button onClick={() => { setNmrFlashIdx(i => Math.min(cards.length - 1, i + 1)); setNmrFlashFlipped(false); }}
                      disabled={nmrFlashIdx === cards.length - 1}
                      style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: nmrFlashIdx === cards.length - 1 ? "#e2e8f0" : accentColor,
                        color: nmrFlashIdx === cards.length - 1 ? "#94a3b8" : "#fff", fontSize: "13px", fontWeight: 700,
                        cursor: nmrFlashIdx === cards.length - 1 ? "default" : "pointer", fontFamily: "inherit" }}>
                      Next →
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* NMR MCQs */}
            {nmrSubTab === "mcqs" && (() => {
              if (nmrMcqs.length === 0) return <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No NMR MCQs available.</div>;

              if (nmrMcqIdx >= nmrMcqs.length) {
                const pct = nmrMcqScore.total > 0 ? Math.round((nmrMcqScore.correct / nmrMcqScore.total) * 100) : 0;
                return (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px", color: pct >= 80 ? "#059669" : pct >= 50 ? "#29ABE2" : "#64748b" }}>{nmrMcqScore.correct}/{nmrMcqScore.total}</div>
                    <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>{pct}% correct</div>
                    <button onClick={() => { setNmrMcqIdx(0); setNmrMcqSelected(null); setNmrMcqRevealed(false); setNmrMcqScore({ correct: 0, total: 0 }); }}
                      style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: accentColor, color: "#fff",
                        fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Try Again
                    </button>
                  </div>
                );
              }

              const q = nmrMcqs[nmrMcqIdx];
              return (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                      Question {nmrMcqIdx + 1} / {nmrMcqs.length}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: accentColor }}>
                      {nmrMcqScore.correct} / {nmrMcqScore.total} correct
                    </span>
                  </div>

                  <div style={{ background: "#fff", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a2d45", lineHeight: 1.6, marginBottom: "16px" }}>
                      {chemFormat(q.q)}
                    </div>
                    {q.image && (
                      <div style={{ marginBottom: "14px", textAlign: "center" }}>
                        <img src={q.image} alt="Question diagram" style={{ maxWidth: "100%", borderRadius: "8px" }} />
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {Object.entries(q.options).map(([letter, text]) => {
                        const isSelected = nmrMcqSelected === letter;
                        const isCorrect = letter === q.answer;
                        const showResult = nmrMcqRevealed;
                        let bg = "#fff", border = "#e2e8f0", textColor = "#1a2d45";
                        if (showResult && isCorrect) { bg = "#f0fdf4"; border = "#22c55e"; textColor = "#166534"; }
                        else if (showResult && isSelected && !isCorrect) { bg = "#fef2f2"; border = "#ef4444"; textColor = "#991b1b"; }
                        else if (isSelected) { bg = `${accentColor}10`; border = accentColor; textColor = accentColor; }
                        return (
                          <button key={letter} onClick={() => { if (!nmrMcqRevealed) setNmrMcqSelected(letter); }}
                            style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "10px",
                              border: `1.5px solid ${border}`, background: bg, cursor: nmrMcqRevealed ? "default" : "pointer",
                              fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}>
                            <div style={{ minWidth: "24px", height: "24px", borderRadius: "50%", background: isSelected || (showResult && isCorrect) ? (showResult && isCorrect ? "#22c55e" : accentColor) : "#f1f5f9",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700,
                              color: isSelected || (showResult && isCorrect) ? "#fff" : "#64748b" }}>
                              {letter}
                            </div>
                            <div style={{ fontSize: "13px", color: textColor, lineHeight: 1.5, fontWeight: showResult && isCorrect ? 700 : 400 }}>
                              {chemFormat(text)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {nmrMcqRevealed && q.explanation && (
                      <div style={{ marginTop: "14px", padding: "12px 16px", background: "#f0fdf4", border: "1.5px solid #bbf7d0",
                        borderRadius: "12px", fontSize: "13px", color: "#166534", lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 700 }}>Answer: {q.answer}</span>
                        {q.explanation && <span> — {chemFormat(q.explanation)}</span>}
                      </div>
                    )}

                    <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                      {!nmrMcqRevealed ? (
                        <button onClick={() => {
                          if (!nmrMcqSelected) return;
                          setNmrMcqRevealed(true);
                          setNmrMcqScore(prev => ({
                            correct: prev.correct + (nmrMcqSelected === q.answer ? 1 : 0),
                            total: prev.total + 1
                          }));
                        }}
                          disabled={!nmrMcqSelected}
                          style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none",
                            cursor: nmrMcqSelected ? "pointer" : "default",
                            background: nmrMcqSelected ? accentColor : "#e8edf3",
                            color: nmrMcqSelected ? "#fff" : "#b0c4d4",
                            fontSize: "14px", fontWeight: 700, fontFamily: "inherit" }}>
                          Check Answer
                        </button>
                      ) : (
                        <button onClick={() => { setNmrMcqIdx(i => i + 1); setNmrMcqSelected(null); setNmrMcqRevealed(false); }}
                          style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer",
                            background: accentColor, color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "inherit" }}>
                          {nmrMcqIdx < nmrMcqs.length - 1 ? "Next Question →" : "See Results"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

    </div>
  );

  // FLASHCARD VIEW
  const progress = ((index + 1) / order.length) * 100;
  return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />
      <div style={{ padding: "12px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", borderBottom: "1px solid #dde4ed", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={goBack} style={{ background: "#f0f4f8", border: "1px solid #dde4ed", borderRadius: "8px", padding: "8px 12px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: 600 }}>← Topics</button>
          <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "15px", color: "#29ABE2" }}>HSJ TUITION</div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} style={{ background: "#f0f4f8", border: "1px solid #dde4ed", borderRadius: "8px", padding: "8px 12px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>⚙</button>
      </div>

      {showMenu && (
        <div style={{ position: "absolute", top: "56px", right: "20px", zIndex: 10, background: "#ffffff", border: "1px solid #dde4ed", borderRadius: "12px", padding: "8px", minWidth: "200px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          {[
            { label: shuffled ? "⟲ Reset order" : "🔀 Shuffle cards", action: shuffled ? reset : shuffle },
            { label: `Unknown only (${cards.length - knownCount})`, action: studyUnknown },
            { label: "✕ Clear progress", action: () => { setKnown(p => ({ ...p, [knownKey]: new Set() })); setShowMenu(false); } },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#1a2d45", fontSize: "13px", textAlign: "left", cursor: "pointer", borderRadius: "8px", fontFamily: "inherit" }}
              onMouseEnter={e => e.target.style.background = "#f0f4f8"}
              onMouseLeave={e => e.target.style.background = "none"}
            >{item.label}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "10px 20px 4px", position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 600, color: "#29ABE2" }}>{topic} · {SETS[topic]?.title}</h2>
        <div style={{ height: "5px", background: "#dde4ed", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #29ABE2, #50C8F4)", borderRadius: "3px", transition: "width 0.3s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#7a95b0" }}>
          <span>{index + 1} / {order.length}</span>
          <span style={{ color: "#29ABE2", fontWeight: knownCount > 0 ? 600 : 400 }}>{knownCount} mastered</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 24px", position: "relative", zIndex: 2 }}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>
        <div onClick={() => setFlipped(f => !f)} style={{ width: "100%", maxWidth: "700px", minHeight: "440px", perspective: "1200px", cursor: "pointer" }}>
          <div style={{ position: "relative", width: "100%", minHeight: "440px", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            {/* Front */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(145deg, #29ABE2 0%, #1a8fc4 100%)", border: "none", borderRadius: "24px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 12px 40px rgba(41,171,226,0.35)" }}>
              <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "10px", color: "rgba(255,255,255,0.75)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Question</div>
              {knownSet.has(currentCardIndex) && <div style={{ position: "absolute", top: "13px", right: "18px", fontSize: "11px", color: "#ffffff", fontWeight: 600, background: "rgba(255,255,255,0.25)", padding: "3px 10px", borderRadius: "20px" }}>Mastered</div>}
              <p style={{ fontSize: card.q.length > 120 ? "16px" : card.q.length > 60 ? "18px" : "21px", lineHeight: 1.55, textAlign: "center", fontWeight: 700, color: "#ffffff", margin: 0 }}>{card.q}</p>
              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>Tap to reveal answer</div>
            </div>
            {/* Back */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#ffffff", border: "2px solid #29ABE2", borderRadius: "24px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 12px 40px rgba(41,171,226,0.2)" }}>
              <div style={{ position: "absolute", top: "16px", left: "20px", fontSize: "10px", color: "#29ABE2", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Answer</div>
              <div style={{ fontSize: card.a.length > 200 ? "13px" : card.a.length > 100 ? "15px" : "17px", lineHeight: 1.7, textAlign: "center", color: "#1a2d45", margin: 0, whiteSpace: "pre-line", fontWeight: 500 }}>{card.a}</div>
              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "#7a95b0", letterSpacing: "0.5px" }}>Tap to flip back</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 24px 20px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 2 }}>
        <button onClick={prev} disabled={index === 0} style={{ width: "52px", height: "52px", borderRadius: "14px", background: index === 0 ? "#e8edf3" : "#ffffff", border: `1px solid ${index === 0 ? "#dde4ed" : "#29ABE2"}`, color: index === 0 ? "#b0c4d4" : "#29ABE2", fontSize: "20px", cursor: index === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: index === 0 ? "none" : "0 2px 8px rgba(41,171,226,0.15)" }}>←</button>
        <button onClick={toggleKnown} style={{ height: "52px", borderRadius: "14px", padding: "0 24px", background: knownSet.has(currentCardIndex) ? "#1a8fc4" : "#29ABE2", border: "none", color: "#ffffff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 12px rgba(41,171,226,0.25)" }}>
          {knownSet.has(currentCardIndex) ? "Mastered" : "Mark as Known"}
        </button>
        <button onClick={next} disabled={index === order.length - 1} style={{ width: "52px", height: "52px", borderRadius: "14px", background: index === order.length - 1 ? "#e8edf3" : "#ffffff", border: `1px solid ${index === order.length - 1 ? "#dde4ed" : "#29ABE2"}`, color: index === order.length - 1 ? "#b0c4d4" : "#29ABE2", fontSize: "20px", cursor: index === order.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: index === order.length - 1 ? "none" : "0 2px 8px rgba(41,171,226,0.15)" }}>→</button>
      </div>

      {knownCount === cards.length && (
        <div style={{ margin: "0 24px 16px", padding: "14px", borderRadius: "14px", background: "linear-gradient(135deg, #eaf6fd, #d0eefa)", border: "1px solid rgba(41,171,226,0.4)", textAlign: "center", fontSize: "14px", color: "#1a8fc4", fontWeight: 700 }}>
          All {cards.length} cards mastered
        </div>
      )}
    </div>
  );
}