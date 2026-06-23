import React, { useState, useEffect, useRef } from "react";

function track(event, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}

export default function LandingPage({ onGoToLogin, onGoToCheckout }) {
  const [activeSection, setActiveSection] = useState("mcqs"); // "mcqs"
  const [activeMechIdx, setActiveMechIdx] = useState(null); // null = list, 0 = first mech, 1 = second
  const [mechOpenCards, setMechOpenCards] = useState({});
  const [mcqIdx, setMcqIdx] = useState(0);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqShowExplanation, setMcqShowExplanation] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqAnswered, setMcqAnswered] = useState(0);
  const [flippedCard, setFlippedCard] = useState(false);

  // --- Landing page analytics ---
  const scrollMilestones = useRef(new Set());
  useEffect(() => {
    track("landing_page_view");

    // Scroll depth tracking (25%, 50%, 75%, 100%)
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      [25, 50, 75, 100].forEach(milestone => {
        if (pct >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          track("landing_scroll_depth", { percent: milestone });
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track time on landing page
  useEffect(() => {
    const start = Date.now();
    const intervals = [30, 60, 120, 300]; // seconds
    const timers = intervals.map(s => setTimeout(() => track("landing_time_spent", { seconds: s }), s * 1000));
    return () => { timers.forEach(clearTimeout); track("landing_exit", { seconds: Math.round((Date.now() - start) / 1000) }); };
  }, []);

  // Preview mechanisms data (subset of real content)
  const previewMechs = [
    {
      id: "nuc_sub",
      title: "Nucleophilic Substitution",
      subtitle: "OH⁻ + CH₃CH₂Br → CH₃CH₂OH + Br⁻",
      color: "#3182ce",
      image: "/mechanisms/nuc_sub/mechanism.jpg",
      locked: false,
      explainers: [
        { title: "What is the nucleophile?", text: "The hydroxide ion (OH⁻) has a lone pair of electrons on oxygen. It is the nucleophile. It donates this lone pair to form a new bond." },
        { title: "Arrow 1: Nucleophile attacks δ+ carbon", text: "The lone pair on oxygen attacks the δ+ carbon of bromoethane, forming a new C–O bond. The curly arrow goes from the lone pair to the carbon atom." },
        { title: "Arrow 2: C–Br bond breaks", text: "Simultaneously, the C–Br bonding pair shifts to bromine. Br leaves as Br⁻ (the leaving group). The curly arrow goes from the bond to Br." },
        { title: "Why is this a substitution?", text: "The –Br group has been replaced (substituted) by –OH. The product is ethanol (CH₃CH₂OH) and the by-product is bromide ion (Br⁻)." },
        { title: "Conditions", text: "Warm aqueous NaOH (dilute). Reflux. The OH⁻ acts as a nucleophile in this reaction." },
      ],
    },
    {
      id: "ea_br2",
      title: "Electrophilic Addition: Br₂",
      subtitle: "CH₂=CH₂ + Br₂ → CH₂BrCH₂Br",
      color: "#c05621",
      image: "/mechanisms/ea/IMG_0887.jpg",
      locked: false,
      halfLocked: true, // show first 3 explainers, lock the rest
      freeExplainers: 3,
      explainers: [
        { title: "Why does the π bond react?", text: "The C=C double bond has a region of high electron density (the π bond) above and below the plane. This electron-rich area attracts electrophiles." },
        { title: "Arrow 1: π electrons attack δ+ Br", text: "As Br₂ approaches, the π electrons repel the electrons in Br–Br, inducing a dipole: Brδ+–Brδ−. The π electrons attack the δ+ Br, forming a new C–Br bond." },
        { title: "Arrow 2: Br–Br bond breaks", text: "Simultaneously, the Br–Br bonding pair shifts entirely to the far Br atom, which leaves as Br⁻. The π bond is now completely used up." },
        { title: "Carbocation intermediate", text: "A carbocation (C⁺) forms on the carbon that didn't bond to Br. This is a reactive intermediate." },
        { title: "Arrow 3: Br⁻ attacks C⁺", text: "The Br⁻ ion uses a lone pair to attack the positive carbon, forming the second C–Br bond." },
        { title: "Test for alkenes", text: "This reaction decolourises orange bromine water. This is the standard test for a C=C double bond." },
      ],
    },
  ];

  // Preview MCQs (3 real questions from organic topics)
  const previewMCQs = [
    {
      q: "A catalyst increases the rate of a reaction. Which statement correctly explains this?",
      options: { A: "It increases the kinetic energy of the particles", B: "It provides an alternative pathway with lower activation energy", C: "It increases the concentration of reactants", D: "It increases the frequency of all collisions" },
      answer: "B",
      explanation: "A catalyst provides an alternative reaction pathway with a lower activation energy (Ea). More particles then have energy ≥ Ea, so the rate increases without changing temperature or concentration.",
    },
    {
      q: "Which of these molecules has a non-linear shape?",
      options: { A: "CO₂", B: "BeCl₂", C: "H₂O", D: "HCN" },
      answer: "C",
      explanation: "H₂O has two bonding pairs and two lone pairs around oxygen, giving a bent (non-linear) shape with a bond angle of about 104.5°. The others are all linear.",
    },
    {
      q: "Which compound can react with ammonia to produce propylamine?",
      options: { A: "CH₃CH=CH₂", B: "CH₃CH₂CH₂OH", C: "CH₃CH₂CH₂Br", D: "CH₃CH₂CH₃" },
      answer: "C",
      explanation: "Halogenoalkanes undergo nucleophilic substitution with NH₃. The lone pair on nitrogen attacks the δ+ carbon, displacing Br⁻. Excess NH₃ in a sealed tube with heat is required.",
    },
    {
      q: "An element has the electron configuration 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵. Which statement is correct?",
      options: { A: "It is a Group 5 element", B: "It is a d-block element with oxidation state +5 only", C: "It is a transition metal that can form coloured compounds", D: "It has 5 electrons in total" },
      answer: "C",
      explanation: "This is the electron configuration of Mn (or Cr depending on context). Transition metals have partially filled d orbitals and form coloured compounds due to d-d electron transitions.",
    },
    {
      q: "What is the pH of a 0.01 mol dm⁻³ solution of HCl?",
      options: { A: "1", B: "2", C: "3", D: "4" },
      answer: "B",
      explanation: "HCl is a strong acid that fully dissociates. [H⁺] = 0.01 = 10⁻² mol dm⁻³. pH = -log₁₀[H⁺] = -log₁₀(10⁻²) = 2.",
    },
  ];

  const currentQ = previewMCQs[mcqIdx];

  // Days until exams
  const now = new Date();
  const paper2 = new Date("2026-06-09");
  const paper3 = new Date("2026-06-15");
  const daysTo2 = Math.max(0, Math.ceil((paper2 - now) / 86400000));
  const daysTo3 = Math.max(0, Math.ceil((paper3 - now) / 86400000));

  // Shared styles
  const darkBg = { background: "linear-gradient(135deg, #0d1b2a 0%, #1b2d45 50%, #0d1b2a 100%)" };
  const creamBg = { background: "#f5f0e8" };
  const wrap = { maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 60px)" };
  const labelStyle = { fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "16px" };
  // Brighter text colors
  const bodyText = "#dce3ec"; // bright body text
  const mutedText = "#9ca8b8"; // readable muted text
  const dimText = "#8393a4"; // visible dim text

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", color: "#fff", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes lpFadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes lpPulse{0%,100%{box-shadow:0 0 0 0 rgba(41,171,226,0.4)}50%{box-shadow:0 0 0 12px rgba(41,171,226,0)}} .lp-faq-card{transition:all 0.2s} .lp-faq-card:hover{border-color:rgba(255,255,255,0.2)!important} .lp-flip{perspective:800px;cursor:pointer} .lp-flip-inner{position:relative;width:100%;min-height:160px;transition:transform 0.6s;transform-style:preserve-3d} .lp-flip-inner.flipped{transform:rotateY(180deg)} .lp-flip-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:16px;padding:28px 24px;display:flex;align-items:center;justify-content:center;text-align:center} .lp-flip-front{background:linear-gradient(145deg,#162d3d,#0f1f30);border:1px solid rgba(255,255,255,0.1)} .lp-flip-back{transform:rotateY(180deg);background:linear-gradient(145deg,#059669,#047857);border:1px solid rgba(255,255,255,0.15)} @media(max-width:640px){.lp-hero-wrap{flex-direction:column!important;text-align:center}.lp-hero-copy{max-width:100%!important;align-items:center}.lp-hero-copy>div{justify-content:center!important}.lp-hero-flip{min-width:0!important;width:100%!important}.lp-stakes-row,.lp-why-row,.lp-features-row{flex-direction:column!important}.lp-stakes-row>div,.lp-why-row>div{max-width:100%!important;flex-basis:100%!important}.lp-guide-row{flex-direction:column!important;align-items:center!important}.lp-guide-row>div{width:100%!important;max-width:100%!important}}`}</style>

      {/* ── STICKY HEADER ─────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, ...darkBg, borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/hsj-logo.png" alt="" style={{ height: "32px", objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "15px", color: "#fff", lineHeight: 1 }}>ChemMastery</div>
            <div style={{ fontSize: "10px", color: mutedText, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>A-Level Chemistry</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => { track("click_login", { location: "header" }); onGoToLogin(); }} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Log in</button>
          <button onClick={() => { track("click_get_access", { location: "header" }); onGoToCheckout(); }} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Get access</button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 1: HERO — emotional hook
          ══════════════════════════════════════════════════ */}
      <div style={{ ...darkBg }}>
        <div className="lp-hero-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(40px, 6vw, 80px)", flexWrap: "wrap", ...wrap, padding: "clamp(60px, 10vh, 100px) clamp(24px, 4vw, 60px) clamp(50px, 8vh, 80px)" }}>
          {/* Left: copy */}
          <div className="lp-hero-copy" style={{ flex: "1 1 300px", maxWidth: "540px", animation: "lpFadeIn 0.6s ease" }}>
            <div style={{ ...labelStyle, color: "#29ABE2" }}>A-LEVEL CHEMISTRY</div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5.5vw, 52px)", lineHeight: 1.08, margin: "0 0 24px", letterSpacing: "-1px", color: "#fff" }}>
              Stop losing marks.<br />
              <span style={{ color: "#29ABE2" }}>Start gaining grades.</span>
            </h1>
            <p style={{ fontSize: "clamp(16px, 2.2vw, 18px)", color: bodyText, lineHeight: 1.7, margin: "0 0 12px" }}>
              It's almost never that you don't understand it. It's that the exact answer the examiner gives marks for never made it into your memory.
            </p>
            <p style={{ fontSize: "clamp(16px, 2.2vw, 18px)", color: bodyText, lineHeight: 1.7, margin: "0 0 32px" }}>
              This app fixes that. 566+ MCQs that drill the gaps. Flashcards written to match the real mark scheme. Calculations with step-by-step solutions.
            </p>

            {/* Exam countdown pills */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px" }}>
              {daysTo3 > 0 && (
                <div style={{ background: "rgba(5,150,105,0.12)", border: "1.5px solid rgba(5,150,105,0.3)", borderRadius: "14px", padding: "14px 22px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 900, color: "#059669" }}>{daysTo3}</span>
                  <span style={{ fontSize: "15px", color: bodyText, fontWeight: 600 }}>days to Paper 3</span>
                </div>
              )}
            </div>

            <button onClick={() => { track("click_get_access", { location: "hero" }); onGoToCheckout(); }} style={{ padding: "20px 48px", borderRadius: "16px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "clamp(18px, 2.5vw, 21px)", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(41,171,226,0.35)", display: "inline-flex", alignItems: "center", gap: "10px" }}>
              Get full access <span style={{ fontSize: "22px" }}>→</span>
            </button>
            <div style={{ fontSize: "14px", color: dimText, marginTop: "12px" }}>Cancel anytime. Instant access.</div>
          </div>

          {/* Right: interactive flashcard demo with 3D flip */}
          <div className="lp-hero-flip" style={{ flex: "0 1 400px", minWidth: "260px", width: "100%" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", textAlign: "center" }}>
              <div style={{ ...labelStyle, color: "#059669", fontSize: "11px", marginBottom: "10px" }}>TAP TO TEST YOURSELF</div>
              <div style={{ fontSize: "10px", color: dimText, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px" }}>PHYSICAL • RATES</div>
              <div className="lp-flip" onClick={() => { setFlippedCard(!flippedCard); track("landing_flip_flashcard", { flipped: !flippedCard }); }}>
                <div className={`lp-flip-inner${flippedCard ? " flipped" : ""}`}>
                  <div className="lp-flip-face lp-flip-front">
                    <div style={{ fontSize: "clamp(17px, 2.5vw, 21px)", fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>
                      How does a catalyst increase the rate of a reaction?
                    </div>
                  </div>
                  <div className="lp-flip-face lp-flip-back">
                    <div style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 600, color: "#fff", lineHeight: 1.6 }}>
                      A catalyst provides an <strong>alternative reaction pathway</strong> with a <strong>lower activation energy</strong>, so more particles have energy ≥ Ea.
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: flippedCard ? "#059669" : dimText, fontWeight: 600, marginTop: "12px" }}>
                {flippedCard ? "tap to flip back" : "tap the card to reveal →"}
              </div>
            </div>
          </div>
        </div>

        {/* CTA banner strip */}
        <div style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
          <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 700, color: "#fff" }}>
              Open the app free and find your first gap in 60 seconds.
            </div>
            <button onClick={() => { track("click_get_access", { location: "banner_strip" }); onGoToCheckout(); }} style={{ padding: "12px 28px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Get access →
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FREE GUIDE DOWNLOAD — the lead magnet
          ══════════════════════════════════════════════════ */}
      <div style={{ background: "#0a1628", borderTop: "3px solid #29ABE2", padding: "clamp(40px, 6vh, 70px) 24px" }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <div style={{ ...labelStyle, color: "#29ABE2" }}>FREE PAPER 3 GUIDE</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(26px, 4.5vw, 40px)", lineHeight: 1.12, margin: "0 0 12px" }}>
            Your free predictions & advice guide
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: bodyText, lineHeight: 1.6, margin: "0 0 32px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            Based on 10 years of past papers and examiner reports. Download your exam board's guide. No sign-up needed.
          </p>

          <div className="lp-guide-row" style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* AQA */}
            <div style={{ background: "rgba(41,171,226,0.06)", border: "1.5px solid rgba(41,171,226,0.2)", borderRadius: "20px", padding: "40px 36px", flex: "1 1 340px", maxWidth: "420px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>📘</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>AQA Paper 3</div>
              <div style={{ fontSize: "16px", color: mutedText, marginBottom: "24px" }}>Strategy Guide + 2026 Predictions</div>
              <a href="/guides/AQA-7405-3-Student-Advice.pdf" download onClick={() => track("download_free_guide", { board: "AQA", paper: "3" })} style={{ display: "block", padding: "16px 28px", borderRadius: "14px", background: "#29ABE2", color: "#fff", fontSize: "17px", fontWeight: 700, textDecoration: "none", fontFamily: "inherit" }}>
                Download Free Guide
              </a>
            </div>

            {/* OCR A */}
            <div style={{ background: "rgba(5,150,105,0.06)", border: "1.5px solid rgba(5,150,105,0.2)", borderRadius: "20px", padding: "40px 36px", flex: "1 1 340px", maxWidth: "420px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>📗</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>OCR A Paper 3</div>
              <div style={{ fontSize: "16px", color: mutedText, marginBottom: "24px" }}>Strategy Guide + 2026 Predictions</div>
              <a href="/guides/OCR-H43203-Student-Advice.pdf" download onClick={() => track("download_free_guide", { board: "OCR_A", paper: "3" })} style={{ display: "block", padding: "16px 28px", borderRadius: "14px", background: "#059669", color: "#fff", fontSize: "17px", fontWeight: 700, textDecoration: "none", fontFamily: "inherit" }}>
                Download Free Guide
              </a>
            </div>
          </div>

          <div style={{ marginTop: "24px", fontSize: "14px", color: dimText }}>
            Want more than just predictions? Try the full app below.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 2: STAKES — why it matters in chemistry
          ══════════════════════════════════════════════════ */}
      <div style={{ ...darkBg, padding: "clamp(60px, 8vh, 100px) 24px" }}>
        <div style={{ ...wrap }}>
          <div style={{ ...labelStyle, color: "#e2a03f" }}>WHY IT MATTERS MORE IN CHEMISTRY</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(26px, 4.5vw, 42px)", lineHeight: 1.12, margin: "0 0 20px", maxWidth: "700px" }}>
            This isn't a knowledge problem.<br />
            It's a <span style={{ color: "#e2a03f" }}>marks</span> problem. And marks are grades.
          </h2>
          <p style={{ fontSize: "clamp(16px, 2.2vw, 18px)", color: bodyText, lineHeight: 1.7, margin: "0 0 36px", maxWidth: "680px" }}>
            Two marks here, three there, a loose definition, the wrong keyword on a six-marker. It stacks up fast. And Chemistry punishes it harder than most subjects, because it builds on itself. Physical, inorganic, organic, all cumulative. Fall behind on one topic and it drags the next three down with it.
          </p>

          {/* Stakes cards */}
          <div className="lp-stakes-row" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
            {[
              { from: "A", to: "B", color: "#29ABE2", text: "The difference a handful of lost keywords makes across three papers." },
              { from: "Firm", to: "Insurance", color: "#e2a03f", text: "One grade can be the gap between the offer you wanted and the one you settled for." },
              { from: "Near miss", to: "A*", color: "#059669", text: "What medicine, dentistry and the top courses actually ask for." },
            ].map((card, i) => (
              <div key={i} style={{ flex: "1 1 260px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "14px", color: mutedText, marginBottom: "4px" }}>{card.from} → <span style={{ color: card.color, fontWeight: 800, fontSize: "16px" }}>{card.to}</span></div>
                <div style={{ fontSize: "15px", color: bodyText, lineHeight: 1.6 }}>{card.text}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "clamp(16px, 2.2vw, 18px)", color: mutedText, textAlign: "center", fontStyle: "italic", maxWidth: "680px", margin: "0 auto" }}>
            Every week before the exam you spend rereading instead of testing yourself is a week you don't get back.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 3: THE FIX — what this app does + previews
          ══════════════════════════════════════════════════ */}
      <div style={{ ...creamBg, color: "#1a2d45", padding: "clamp(60px, 8vh, 100px) 24px" }}>
        <div style={{ ...wrap }}>
          <div style={{ ...labelStyle, color: "#059669" }}>WHAT'S INSIDE</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.12, margin: "0 0 16px", color: "#1a2d45" }}>
            Everything the examiner is looking for, in one place.
          </h2>
          <p style={{ fontSize: "clamp(16px, 2.2vw, 18px)", color: mutedText, lineHeight: 1.7, margin: "0 0 40px", maxWidth: "620px" }}>
            Not just content. The exact phrasing, the right keywords, the mark scheme wording that gets you the marks. Try the MCQs below.
          </p>

          {/* Feature cards row */}
          <div className="lp-features-row" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "40px" }}>
            {[
              { icon: "🧪", label: "11 Mechanisms", sub: "Handdrawn curly arrow diagrams with step-by-step interactive explainers" },
              { icon: "🎯", label: "566+ MCQs", sub: "AQA & OCR A exam-style questions with detailed explanations" },
              { icon: "📚", label: "1400+ Flashcards", sub: "Written to match the mark scheme, not just the textbook" },
              { icon: "🧮", label: "Calculations", sub: "Step-by-step worked problems with hints and tolerance checking" },
            ].map((item, i) => (
              <div key={i} style={{ flex: "1 1 140px", background: "#fff", border: "1.5px solid #e2ddd4", borderRadius: "14px", padding: "20px" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#1a2d45", marginBottom: "4px" }}>{item.label}</div>
                <div style={{ fontSize: "14px", color: mutedText, lineHeight: 1.6 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Interactive preview */}
          <div id="lp-preview" style={{ background: "#1a2d45", borderRadius: "20px", padding: "clamp(20px, 3vw, 32px)", color: "#fff" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ ...labelStyle, color: "#29ABE2", fontSize: "11px" }}>TRY IT FREE</div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>Test yourself — 566+ MCQs across every topic</div>
            </div>

            {/* ── MCQ PREVIEW ───────────────────────── */}
            {activeSection === "mcqs" && (
              <div style={{ animation: "lpFadeIn 0.4s ease" }}>
                <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
                  {previewMCQs.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i < mcqAnswered ? "#059669" : i === mcqIdx ? "#29ABE2" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                  ))}
                  {[0,1,2].map(i => (
                    <div key={`locked-${i}`} style={{ flex: 1, height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.04)" }} />
                  ))}
                </div>

                {mcqIdx < previewMCQs.length ? (
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "28px 24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#29ABE2", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                      Question {mcqIdx + 1} of {previewMCQs.length} (free preview)
                    </div>
                    <div style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, color: "#fff", lineHeight: 1.5, marginBottom: "24px" }}>{currentQ.q}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {Object.entries(currentQ.options).map(([letter, text]) => {
                        const isSelected = mcqSelected === letter;
                        const isCorrect = letter === currentQ.answer;
                        const showResult = mcqShowExplanation;
                        let bg = "rgba(255,255,255,0.04)";
                        let borderC = "rgba(255,255,255,0.1)";
                        if (showResult && isCorrect) { bg = "rgba(5,150,105,0.15)"; borderC = "#059669"; }
                        else if (showResult && isSelected && !isCorrect) { bg = "rgba(220,38,38,0.15)"; borderC = "#dc2626"; }
                        else if (isSelected && !showResult) { bg = "rgba(41,171,226,0.15)"; borderC = "#29ABE2"; }
                        return (
                          <button key={letter} onClick={() => { if (!mcqShowExplanation) { setMcqSelected(letter); track("landing_mcq_select", { question: mcqIdx + 1, selected: letter }); } }}
                            style={{ padding: "14px 16px", borderRadius: "12px", border: `2px solid ${borderC}`, background: bg,
                              cursor: mcqShowExplanation ? "default" : "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: isSelected ? "#29ABE2" : "rgba(255,255,255,0.08)", color: isSelected ? "#fff" : "#94a3b8",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, flexShrink: 0 }}>{letter}</div>
                            <div style={{ fontSize: "15px", color: "#e2e8f0", fontWeight: 500, lineHeight: 1.5 }}>{text}</div>
                          </button>
                        );
                      })}
                    </div>
                    {mcqSelected && !mcqShowExplanation && (
                      <button onClick={() => { setMcqShowExplanation(true); setMcqAnswered(prev => prev + 1); const correct = mcqSelected === currentQ.answer; if (correct) setMcqScore(prev => prev + 1); track("landing_mcq_check", { question: mcqIdx + 1, correct, selected: mcqSelected }); }}
                        style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "15px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginTop: "16px" }}>
                        Check Answer
                      </button>
                    )}
                    {mcqShowExplanation && (
                      <div style={{ marginTop: "16px" }}>
                        <div style={{ padding: "14px 16px", borderRadius: "12px", background: mcqSelected === currentQ.answer ? "rgba(5,150,105,0.12)" : "rgba(220,38,38,0.12)", border: `1px solid ${mcqSelected === currentQ.answer ? "#059669" : "#dc2626"}40`, marginBottom: "12px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 800, color: mcqSelected === currentQ.answer ? "#059669" : "#dc2626", marginBottom: "4px" }}>
                            {mcqSelected === currentQ.answer ? "Correct!" : `Incorrect. Answer: ${currentQ.answer}`}
                          </div>
                          <div style={{ fontSize: "13px", color: bodyText, lineHeight: 1.5 }}>{currentQ.explanation}</div>
                        </div>
                        <button onClick={() => { const nextIdx = mcqIdx + 1; if (nextIdx >= previewMCQs.length) { track("landing_mcq_complete", { score: mcqScore + (mcqSelected === currentQ.answer ? 1 : 0), total: previewMCQs.length }); } setMcqIdx(nextIdx); setMcqSelected(null); setMcqShowExplanation(false); }}
                          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "15px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                          {mcqIdx < previewMCQs.length - 1 ? "Next Question →" : "See Results"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 24px", background: "rgba(255,255,255,0.06)", borderRadius: "18px", border: "1.5px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ fontSize: "40px", fontWeight: 900, color: "#fff", marginBottom: "4px" }}>{mcqScore}/{previewMCQs.length}</div>
                    <div style={{ fontSize: "14px", color: mutedText, marginBottom: "24px" }}>
                      {mcqScore === previewMCQs.length ? "Perfect. There are 566+ more questions like these waiting for you." : "There are 566+ more exam-style MCQs covering every AQA and OCR A topic."}
                    </div>
                    <button onClick={() => { track("click_get_access", { location: "mcq_results_cta", score: mcqScore, total: previewMCQs.length }); onGoToCheckout(); }} style={{ padding: "14px 32px", borderRadius: "14px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(41,171,226,0.4)" }}>
                      Unlock All MCQs →
                    </button>
                    <div><button onClick={() => { track("landing_mcq_retry"); setMcqIdx(0); setMcqSelected(null); setMcqShowExplanation(false); setMcqScore(0); setMcqAnswered(0); }}
                      style={{ background: "none", border: "none", color: "#29ABE2", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "8px", marginTop: "8px" }}>Retry free questions</button></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 4: WHY IT WORKS — 3 pillars
          ══════════════════════════════════════════════════ */}
      <div style={{ ...creamBg, color: "#1a2d45", padding: "clamp(60px, 8vh, 100px) 24px", borderTop: "4px solid #29ABE2" }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <div style={{ ...labelStyle, color: "#059669" }}>WHY IT WORKS</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(26px, 4.5vw, 42px)", lineHeight: 1.15, margin: "0 0 12px", color: "#1a2d45", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
            Three things that actually move your grade.<br />This app is built on all three.
          </h2>
          <p style={{ fontSize: "14px", color: mutedText, margin: "0 0 44px" }}>Not theory. Not motivation. Just what the evidence says works.</p>

          <div className="lp-why-row" style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { num: "01", title: "Active recall", text: "Pulling an answer out of your own head is what burns it in. Looking at the answer barely does anything. Every card, every MCQ, every mechanism step forces the pull. That's the exact move the exam demands." },
              { num: "02", title: "Mark scheme language", text: "A card that says 'lowers the activation energy by providing an alternative pathway' trains your memory to produce those exact words. In the exam, the phrasing the examiner wants is already there waiting." },
              { num: "03", title: "Full coverage", text: "Every topic in the spec. Physical, inorganic and organic, so nothing slips through. The app finds the gap you didn't know you had, before the exam finds it for you." },
            ].map((item, i) => (
              <div key={i} style={{ flex: "1 1 260px", maxWidth: "320px", background: "#fff", border: "1.5px solid #e2ddd4", borderRadius: "16px", padding: "28px 24px", textAlign: "left", position: "relative" }}>
                <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "36px", fontWeight: 900, color: "#e8e3db" }}>{item.num}</div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#29ABE2", marginBottom: "12px" }}>{item.num}</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "#1a2d45", marginBottom: "8px" }}>{item.title}</div>
                <div style={{ fontSize: "15px", color: "#5a6a7d", lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 5: OBJECTION HANDLING — FAQ
          ══════════════════════════════════════════════════ */}
      <div style={{ ...creamBg, color: "#1a2d45", padding: "0 24px clamp(60px, 8vh, 100px)" }}>
        <div style={{ ...wrap }}>
          <div style={{ ...labelStyle, color: "#e2a03f" }}>STRAIGHT ANSWERS</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.12, margin: "0 0 32px", color: "#1a2d45" }}>
            What you're probably thinking.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "780px", margin: "0 auto" }}>
            {[
              { q: "\"I'll just use free resources online.\"", a: "Free resources are scattered, often wrong, and never written to match the mark scheme. You end up spending more time finding and checking them than actually revising. This is one place, already done, already accurate." },
              { q: "\"I don't have time.\"", a: "That's the reason to use it. Ten minutes on your phone on the bus or between lessons does more for your grade than an hour rereading notes at your desk. It fits the gaps you already have." },
              { q: "\"Will it actually move my grade?\"", a: "It moves the one thing grades are made of: the exact answers that score marks. Not a vague sense that you 'get' the topic. The words on the page." },
              { q: "\"I'm already behind.\"", a: "Then it's built for you. It shows you precisely what you don't know yet, so you stop spending time on the topics you've already got and put it where the marks are hiding." },
            ].map((item, i) => (
              <div key={i} className="lp-faq-card" style={{ background: "#fff", border: "1.5px solid #e2ddd4", borderRadius: "14px", padding: "24px 28px" }}>
                <div style={{ fontSize: "19px", fontWeight: 800, color: "#1a2d45", marginBottom: "10px", fontStyle: "italic" }}>{item.q}</div>
                <div style={{ fontSize: "15px", color: "#4a5568", lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 6: FINAL CTA — your move
          ══════════════════════════════════════════════════ */}
      <div style={{ ...darkBg, padding: "clamp(60px, 8vh, 100px) 24px", textAlign: "center" }}>
        <div style={{ ...wrap }}>
          <div style={{ ...labelStyle, color: "#059669" }}>YOUR MOVE</div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.1, margin: "0 0 12px" }}>
            You can start right now.
          </h2>
          <p style={{ fontSize: "clamp(16px, 2.2vw, 18px)", color: bodyText, margin: "0 0 36px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
            Set up takes under a minute on your phone.
          </p>

          {/* Option 1 vs Option 2 */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "36px" }}>
            <div style={{ flex: "1 1 280px", maxWidth: "360px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px 24px", textAlign: "left" }}>
              <div style={{ ...labelStyle, color: mutedText, fontSize: "11px" }}>OPTION 1</div>
              <div style={{ fontSize: "15px", color: bodyText, lineHeight: 1.7 }}>
                Reread Chapter 7 a third time, feel like you know it, and write "speeds it up" again in the exam.
              </div>
            </div>
            <div style={{ flex: "1 1 280px", maxWidth: "360px", background: "rgba(41,171,226,0.08)", border: "1.5px solid rgba(41,171,226,0.3)", borderRadius: "16px", padding: "28px 24px", textAlign: "left" }}>
              <div style={{ ...labelStyle, color: "#29ABE2", fontSize: "11px" }}>OPTION 2</div>
              <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.7 }}>
                Spend ten minutes testing yourself on the answer that actually scores, and keep doing that until it's automatic.
              </div>
            </div>
          </div>

          <div style={{ fontSize: "clamp(17px, 2.5vw, 22px)", fontWeight: 700, color: "#fff", marginBottom: "28px", maxWidth: "580px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
            One of those changes your grade. You already know which.
          </div>

          <button onClick={() => { track("click_get_access", { location: "final_cta" }); onGoToCheckout(); }} style={{ padding: "18px 44px", borderRadius: "14px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "17px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(41,171,226,0.4)", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            Get full access <span style={{ fontSize: "20px" }}>→</span>
          </button>
          <div style={{ fontSize: "12px", color: dimText, marginTop: "10px" }}>£27.99/mo. Cancel anytime.</div>

          {/* P.S. */}
          <div style={{ marginTop: "48px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "28px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontSize: "15px", color: "#5a6a7d", lineHeight: 1.7, textAlign: "left" }}>
              <strong style={{ color: bodyText }}>P.S.</strong>&nbsp;&nbsp;The exam doesn't reward the student who understands the most. It rewards the one who can write the mark-scheme answer under pressure. You build that by testing yourself, not by reading.
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────── */}
      <div style={{ ...darkBg, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "14px", color: "#fff" }}>ChemMastery</div>
            <div style={{ fontSize: "10px", color: dimText, letterSpacing: "1px", textTransform: "uppercase" }}>A-Level Chemistry</div>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button onClick={() => { track("click_login", { location: "footer" }); onGoToLogin(); }} style={{ background: "none", border: "none", color: mutedText, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Log in</button>
            <button onClick={() => { track("click_get_access", { location: "footer" }); onGoToCheckout(); }} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: "#29ABE2", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Get access</button>
          </div>
        </div>
        <div style={{ ...wrap, marginTop: "20px" }}>
          <div style={{ fontSize: "11px", color: "#5a6a7d", lineHeight: 1.6 }}>
            This platform is an independent revision tool and is not affiliated with, endorsed by, or connected to AQA, OCR, or any exam board.
            &nbsp;© {new Date().getFullYear()} HSJ Tuition. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
