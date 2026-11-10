import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logOut, onAuthChange, getOrCreateUserProfile, recordAttempt, updateMyName } from "./firebase";
import TutorPage from "./components/TutorPage";
import StudentDashboard from "./components/StudentDashboard";
import ProgressPage from "./components/ProgressPage";
import PastPaperQuestion from "./components/ppq/PastPaperQuestion";
import RevisionPage from "./components/RevisionPage";
import ExamStyleTab from "./components/ExamStyleTab";
import ParentPage from "./components/ParentPage";
import { VideosPage } from "./components/Placeholders";
import HomeworkBuilder from "./components/HomeworkBuilder";
import { TutorHomeworkList, TutorHomeworkReview } from "./components/TutorHomework";
import StudentHomework from "./components/StudentHomework";
import HomeworkPlayer from "./components/HomeworkPlayer";
import AppShell, { ShellBody } from "./ui/AppShell";
import { T, BOARDS, BOARD_IDS, boardLabel } from "./ui/theme";
import { Button, Card, Chip, Notice, PageHeader, EmptyState, Icon, IconTile } from "./ui/components";
import { invalidateAttempts } from "./hooks/useAttempts";
import mcqData from "./mcq-data.json";
import { SETS } from "./data/sets";
import { SECTIONS, TOPIC_ORDER, OCR_SECTIONS, OCR_TOPIC_ORDER, EDEXCEL_SECTIONS, EDEXCEL_TOPIC_ORDER } from "./data/sections";
import LoginScreen from "./components/LoginScreen";
import OnboardingPage from "./components/OnboardingPage";
import TutorStudents from "./components/TutorStudents";
import { TutorLessonsList, TutorLessonEditor } from "./components/TutorLessons";
import StudentLessons from "./components/StudentLessons";
import TutorPayments from "./components/TutorPayments";
import CalcTab from "./components/CalcTab";
import ExtendedTab from "./components/ExtendedTab";
import McqTab from "./components/McqTab";
import NmrTab from "./components/NmrTab";
import SynthTab from "./components/SynthTab";
import PathwaysTab from "./components/PathwaysTab";
import MechanismsTab from "./components/MechanismsTab";
import track from "./utils/track";
import useStudyProgress from "./hooks/useStudyProgress";
import useFlashcards from "./hooks/useFlashcards";
import useQuiz from "./hooks/useQuiz";


export default function App() {
  // --- Auth state ---
  const [authUser, setAuthUser] = useState(undefined); // undefined=loading, null=not logged in, object=logged in
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Students linked to a tutor's class get full access for as long as they are in it
  // Full access: HSJ students placed into a group (role "student" or a classId), tutors and admins.
  // "paid" and "access_key" are legacy roles from before the platform became HSJ-only.
  const hasFullAccess = userProfile && (["student", "tutor", "admin", "paid", "access_key"].includes(userProfile.role) || !!userProfile.classId);
  const isAdmin = userProfile && userProfile.role === "admin";
  const isTutor = userProfile && (userProfile.role === "tutor" || userProfile.role === "admin");
  const isParent = userProfile && userProfile.role === "parent";

  // Every answered question is written to Firestore so progress survives
  // across devices and tutors can see it. Safe to call when logged out (no-op).
  const logAttempt = useCallback((data) => {
    if (!authUser) return;
    recordAttempt(authUser, userProfile, data);
    invalidateAttempts();
  }, [authUser, userProfile]);

  const LockedOverlay = ({ style }) => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(1px)", borderRadius: "inherit", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, ...style }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "22px", marginBottom: "4px" }}>🔒</div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a2d45" }}>HSJ students only</div>
      </div>
    </div>
  );

  const UpgradeCard = ({ section }) => (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2d45", margin: "0 0 8px" }}>{section} is locked</h3>
        <p style={{ fontSize: "14px", color: "#7a95b0", lineHeight: 1.6, margin: "0 0 8px" }}>
          This is for HSJ Tuition students. If you are one, log in with the email your welcome email was sent to.
        </p>
      </div>
    </div>
  );

  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const board = BOARD_IDS.includes(pathParts[0]) ? pathParts[0] : null;
  const routeTab = pathParts[1] || null;
  const routeParam = pathParts[2] || null;
  const tutorPage = pathParts[0] === 'tutor' ? (pathParts[1] || 'overview') : null;
  const tutorParam = pathParts[0] === 'tutor' ? (pathParts[2] || null) : null;
  let savedBoard = userProfile?.board || null;
  if (!savedBoard) { try { savedBoard = localStorage.getItem("hsj-board"); } catch {} }
  if (!BOARD_IDS.includes(savedBoard)) savedBoard = null;
  const screen = pathParts[0] === 'tutor' ? 'tutor'
    : pathParts[0] === 'parent' ? 'parent'
    : pathParts[0] === 'onboarding' ? 'onboarding'
    : !board ? 'board'
    : (routeTab === 'dashboard' || routeTab === 'progress') ? 'dashboard'
    : routeTab === 'cards' ? 'cards'
    : 'topics';
  const topicsTab = screen === 'topics' ? (routeTab || 'home') : 'home';
  const activeSection = topicsTab === 'flashcards' && routeParam ? routeParam : null;

  // Edexcel has no flashcard/MCQ banks yet: empty sections, shared calcs + extended answers still work
  const CURRENT_SECTIONS = board === "ocr" ? OCR_SECTIONS : board === "edexcel" ? EDEXCEL_SECTIONS : SECTIONS;
  const CURRENT_TOPIC_ORDER = board === "ocr" ? OCR_TOPIC_ORDER : board === "edexcel" ? EDEXCEL_TOPIC_ORDER : TOPIC_ORDER;

  // Maps an attempt's topic to a section label for the progress tables
  const sectionOf = useCallback((t) => {
    if (t.type === "calc") return "Calculations";
    if (t.type === "extended") return "Extended answers";
    const sec = CURRENT_SECTIONS.find(s => s.topics.includes(t.key));
    if (sec) return sec.label;
    const k = String(t.key || "");
    if (k.startsWith("3.1")) return "Physical chemistry";
    if (k.startsWith("3.2")) return "Inorganic chemistry";
    if (k.startsWith("3.3")) return "Organic chemistry";
    if (k.startsWith("OCR")) return "OCR past papers";
    return "Other";
  }, [CURRENT_SECTIONS]);

  const { studyLog, todayKey, logActivity, currentStreak, scoreHistory, logScore } = useStudyProgress();
  // --- Free tier: first item in each section is free ---
  const FREE_FLASHCARD_SECTIONS = board === "ocr" ? ["ocr_mod2"] : board === "edexcel" ? ["edx_12a"] : ["physical_as"];
  const FREE_CALC_IDS = ["calc_moles"];
  const FREE_MECH_COUNT = 1; // first mechanism in each category
  const fc = useFlashcards(logActivity);
  const { topic, setTopic, index, setIndex, flipped, setFlipped,
    known, setKnown, order, shuffled, showMenu, setShowMenu,
    cards, currentCardIndex, card, knownKey, knownSet, knownCount,
    selectTopic: fcSelectTopic, next, prev, toggleKnown, shuffle, reset, studyUnknown } = fc;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const quiz = useQuiz(board, logAttempt);
  const { quizScreen, setQuizScreen, quizYear, setQuizYear,
    quizMode, setQuizMode, quizCount, setQuizCount,
    quizCustomCount, setQuizCustomCount,
    quizSelectedTopics, setQuizSelectedTopics,
    quizDeck, quizPos, quizFlipped, setQuizFlipped,
    quizSessionScore, quizHistory,
    startQuiz, recordQuizAnswer,
    AQA_AS_SECTIONS, AQA_A2_SECTIONS, OCR_AS_SECTIONS, OCR_A2_SECTIONS } = quiz;

  const selectBoard = (b) => { try { localStorage.setItem("hsj-board", b); } catch {} navigate(`/${b}`); track("select_board", { board: b }); };
  const selectTopic = (t) => { fcSelectTopic(t, board); navigate(`/${board}/cards/${t}`); };

  const goBack = () => {
    if (screen === "cards") { navigate(`/${board}/flashcards`); setTopic(null); }
    else if (screen === "dashboard") { navigate(`/${board}`); }
    else if (activeSection) { navigate(`/${board}/flashcards`); }
    else { navigate("/"); }
  };

  // Past papers are homework only (HSJ decision, 10 Nov 2026): the old
  // Practise browser sends students to Revision.
  useEffect(() => {
    if (screen === "topics" && topicsTab === "practise" && !routeParam && board) navigate(`/${board}/revision`, { replace: true });
  }, [screen, topicsTab, routeParam, board]); // eslint-disable-line

  useEffect(() => {
    if (screen === "cards" && routeParam && board && topic !== routeParam) {
      fcSelectTopic(routeParam, board);
    }
  }, [screen, routeParam, board]); // eslint-disable-line

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

  const onTS = e => { touchStart.current = e.targetTouches[0].clientX; };
  const onTM = e => { touchEnd.current = e.targetTouches[0].clientX; };
  const onTE = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const d = touchStart.current - touchEnd.current;
    if (Math.abs(d) > 60) { d > 0 ? next() : prev(); }
    touchStart.current = null; touchEnd.current = null;
  };

  // Remember the board so "/" goes straight back to it next time
  useEffect(() => { if (board) { try { localStorage.setItem("hsj-board", board); } catch {} } }, [board]);
  useEffect(() => {
    if (screen !== "board" || !authUser) return;
    // Tutors land on their dashboard; parents on their child's page; students on their board's dashboard
    if (isTutor) navigate("/tutor", { replace: true });
    else if (isParent) navigate("/parent", { replace: true });
    else if (savedBoard) navigate(`/${savedBoard}`, { replace: true });
  }, [screen, authUser, savedBoard, isTutor, isParent, navigate]);
  // Parents have no student screens of their own
  useEffect(() => {
    if (isParent && authUser && screen !== "parent" && screen !== "board" && screen !== "onboarding") navigate("/parent", { replace: true });
  }, [isParent, authUser, screen, navigate]);

  // ─── App shell: nav + account menu shared by every signed-in screen ───
  const navBoard = board || savedBoard || "aqa";
  const studentNav = [
    { id: "home", label: "Dashboard", icon: "grid", to: `/${navBoard}`, active: screen === "topics" && topicsTab === "home" },
    { id: "homework", label: "Homework", icon: "checkSquare", to: `/${navBoard}/homework`, active: screen === "topics" && topicsTab === "homework" },
    { id: "lessons", label: "Lessons", icon: "calendar", to: `/${navBoard}/lessons`, active: screen === "topics" && topicsTab === "lessons" },
    { id: "revision", label: "Revision", icon: "book", to: `/${navBoard}/revision`, active: screen === "cards" || (screen === "topics" && !["home", "homework", "lessons", "videos", "practise"].includes(topicsTab)) },
    { id: "progress", label: "Progress", icon: "chart", to: `/${navBoard}/progress`, active: screen === "dashboard" },
    { id: "videos", label: "Learn", icon: "video", to: `/${navBoard}/videos`, active: screen === "topics" && topicsTab === "videos" },
  ];
  const tutorNav = [
    { id: "tutor", label: "Overview", icon: "users", to: "/tutor", active: screen === "tutor" && tutorPage === "overview" },
    { id: "thw", label: "Homework", icon: "checkSquare", to: "/tutor/homework", active: screen === "tutor" && tutorPage === "homework" },
    { id: "tlessons", label: "Lessons", icon: "calendar", to: "/tutor/lessons", active: screen === "tutor" && tutorPage === "lessons" },
    ...(isAdmin ? [
      { id: "students", label: "Students", icon: "plus", to: "/tutor/students", active: screen === "tutor" && tutorPage === "students" },
      { id: "payments", label: "Payments", icon: "chart", to: "/tutor/payments", active: screen === "tutor" && tutorPage === "payments" },
    ] : []),
    { id: "student", label: "Student view", icon: "grid", to: `/${navBoard}`, active: screen === "topics" && topicsTab === "home" },
    { id: "revision", label: "Revision", icon: "book", to: `/${navBoard}/revision`, active: screen === "cards" || (screen === "topics" && !["home", "homework", "lessons", "videos", "practise"].includes(topicsTab)) },
    { id: "progress", label: "Progress", icon: "chart", to: `/${navBoard}/progress`, active: screen === "dashboard" },
  ];

  const parentNav = [
    { id: "parent", label: "My child", icon: "users", to: "/parent", active: screen === "parent" },
  ];
  const menuSection = { borderTop: `1px solid ${T.line}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 };
  const menuLabel = { fontSize: 12, fontWeight: 600, color: T.muted };
  const accountMenu = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <NameBlock name={userProfile?.displayName || authUser?.displayName || "Student"} email={authUser?.email}
        onSave={async (n) => { const displayName = await updateMyName(n); setUserProfile(prev => ({ ...prev, displayName })); }} />
      <Chip tone={hasFullAccess ? "green" : "amber"} style={{ alignSelf: "flex-start" }}>
        {userProfile?.role === "admin" ? "Admin" : userProfile?.role === "tutor" ? "Tutor" : userProfile?.role === "parent" ? "Parent" : userProfile?.classId ? `Student · ${userProfile.className || userProfile.classId}` : hasFullAccess ? "Full access" : "Not in a group yet"}
      </Chip>
      {isTutor && <Button variant="primary" data-close-menu onClick={() => navigate("/tutor")} iconRight="arrowRight">Tutor dashboard</Button>}
      {!isTutor && !isParent && !userProfile?.classId && (
        <div style={menuSection}>
          <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>HSJ Tuition places you in a group once your onboarding is complete. If you are already an HSJ student, log in with the email your welcome email was sent to.</span>
        </div>
      )}
      <div style={menuSection}>
        {!isParent && (
          <>
            <span style={menuLabel}>Exam board</span>
            <div style={{ display: "flex", gap: 4 }}>
              {BOARDS.map(bd => (
                <Button key={bd.id} size="sm" data-close-menu variant={(board || savedBoard) === bd.id ? "primary" : "secondary"} style={{ flex: 1 }} onClick={() => selectBoard(bd.id)}>{bd.label}</Button>
              ))}
            </div>
          </>
        )}
        <Button variant="danger" size="sm" icon="logout" onClick={() => logOut()}>Log out</Button>
      </div>
    </div>
  );

  const renderShell = (children, opts = {}) => (
    <AppShell user={authUser ? { email: authUser.email, photoURL: authUser.photoURL, displayName: userProfile?.displayName || authUser.displayName } : authUser} menu={accountMenu} nav={isTutor ? tutorNav : isParent ? parentNav : studentNav}
      brandSub={isParent ? "Parent" : board ? boardLabel(board) : (isTutor ? "Tutor" : undefined)} {...opts}>
      {children}
    </AppShell>
  );

  // PUBLIC ONBOARDING LINKS (self-evaluation, parent terms): no login needed
  if (pathParts[0] === 'onboarding' && pathParts[1]) return <OnboardingPage token={pathParts[1]} />;

  // AUTH LOADING
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}><span style={{ color: "#29ABE2" }}>Chem</span>Mastery</div>
        <div style={{ color: "#7a95b0", fontSize: "14px" }}>Loading...</div>
      </div>
    </div>
  );

  // LOGIN SCREEN (accounts are created by HSJ when a student is placed, so there is no sign-up)
  if (!authUser) return <LoginScreen />;

  // ONBOARDING GATE: a placed student must send the self-evaluation, and a
  // parent must accept the agreement, before the rest of the account opens.
  // The tokens are copied onto the profile at placement and cleared server-side
  // when the step is done (api/onboarding).
  if (userProfile && !userProfile.needsPasswordChange) {
    if (userProfile.role === "student" && userProfile.evalToken && !userProfile.selfEvaluation) {
      return <OnboardingPage token={userProfile.evalToken} account={authUser.email} onLogOut={() => logOut()}
        onDone={() => setUserProfile(prev => ({ ...prev, evalToken: null, selfEvaluation: prev.selfEvaluation || { submittedAt: Date.now() } }))} />;
    }
    const pendingTerms = isParent ? Object.entries(userProfile.childTerms || {}).find(([, t]) => t?.token && !t.acceptedAt) : null;
    if (pendingTerms) {
      const [childUid, t] = pendingTerms;
      return <OnboardingPage token={t.token} account={authUser.email} onLogOut={() => logOut()}
        onDone={() => setUserProfile(prev => ({ ...prev, childTerms: { ...prev.childTerms, [childUid]: { ...t, acceptedAt: Date.now() } } }))} />;
    }
  }

  // CHANGE PASSWORD PROMPT (new students log in with a temporary password)
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

  // PARENT VIEW
  if (screen === "parent") return renderShell(
    isParent || isTutor
      ? <ParentPage authUser={authUser} userProfile={userProfile} childUid={pathParts[1] || null} />
      : <Card padding={0}><EmptyState icon="lock" title="Parent accounts only" body="This page is for parents of HSJ students." /></Card>
  );

  // TUTOR DASHBOARD
  if (screen === "tutor") return renderShell(
    !isTutor
      ? <Card padding={0}><EmptyState icon="lock" title="Tutor accounts only" body="Ask HSJ Tuition to upgrade your account to a tutor account." /></Card>
      : tutorPage === "homework"
        ? (tutorParam === "new"
            ? <HomeworkBuilder authUser={authUser} />
            : tutorParam
              ? <TutorHomeworkReview authUser={authUser} assignmentId={tutorParam} />
              : <TutorHomeworkList authUser={authUser} userProfile={userProfile} />)
        : tutorPage === "lessons"
          ? (tutorParam ? <TutorLessonEditor authUser={authUser} lessonId={tutorParam} /> : <TutorLessonsList authUser={authUser} />)
        : tutorPage === "payments"
          ? <TutorPayments />
        : tutorPage === "students"
          ? <TutorStudents authUser={authUser} userProfile={userProfile} />
          : <TutorPage authUser={authUser} userProfile={userProfile} />
  );

  // BOARD SELECT (shown once; afterwards "/" goes straight to the saved board)
  if (screen === "board") return renderShell(
    <>
      <PageHeader eyebrow="Welcome" title="Choose your exam board" sub="You can switch at any time from the account menu." />
      <div className="cm-grid-3" style={{ maxWidth: 1000 }}>
        {BOARDS.map(bd => (
          <button key={bd.id} className="cm-card-link" onClick={() => selectBoard(bd.id)} style={{ textAlign: "left", padding: 22, borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, color: T.ink, fontFamily: "inherit" }}>
            <span style={{ fontFamily: T.display, fontSize: 28, fontWeight: 800 }}>{bd.label}</span>
            <span style={{ fontSize: 13, color: T.muted }}>{bd.desc}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{bd.tags.map(t => <Chip key={t} tone="accent">{t}</Chip>)}</div>
            <span className="cm-link" style={{ marginTop: 4 }}>Continue →</span>
          </button>
        ))}
      </div>
    </>
  );

  // PROGRESS
  if (screen === "dashboard") return renderShell(
    <ProgressPage board={board} authUser={authUser} currentStreak={currentStreak} studyLog={studyLog} todayKey={todayKey}
      known={known} sets={SETS} sections={CURRENT_SECTIONS} sectionOf={sectionOf} />
  );

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
    edx_12a: { accent: "#29ABE2", bg: "#eaf6fd", border: "#29ABE2" },
    edx_12b: { accent: "#7c3aed", bg: "#f3eeff", border: "#7c3aed" },
    edx_12c: { accent: "#16a97d", bg: "#e6f9f3", border: "#16a97d" },
    edx_13a: { accent: "#0090cc", bg: "#e0f2fa", border: "#0090cc" },
    edx_13b: { accent: "#6d28d9", bg: "#ede9ff", border: "#6d28d9" },
    ocr_mod5: { accent: "#1a6b9a", bg: "#e8f4fb", border: "#1a6b9a" },
    ocr_mod6: { accent: "#16783a", bg: "#e9f7ef", border: "#16783a" },
  };

  if (screen === "topics" && activeSection) {
    const section = CURRENT_SECTIONS.find(s => s.id === activeSection);
    const fc = FOLDER_COLORS[activeSection] || FOLDER_COLORS.physical_as;
    return renderShell(
      <>
        <PageHeader eyebrow="Flashcards" title={section ? section.label : "Section"} sub={section ? `${section.topics.length} topics` : ""}
          right={<Button variant="secondary" icon="arrowLeft" onClick={goBack}>All sections</Button>} />
        <div className="cm-grid-3">
          {(section ? section.topics : []).map(id => {
            const s = SETS[id];
            const k = (known[id] || new Set()).size;
            const pct = Math.round((k / s.cards.length) * 100);
            return (
              <button key={id} className="cm-card-link" onClick={() => selectTopic(id)} style={{
                padding: 16, borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, color: T.ink,
                cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 11, color: fc.accent, fontWeight: 800, letterSpacing: 0.3 }}>{id}</span>
                  {k > 0 && <Chip tone={pct === 100 ? "green" : "accent"}>{pct}%</Chip>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, flex: 1 }}>{s.title}</div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginBottom: 5 }}>
                    <span>{s.cards.length} cards</span><span>{k} known</span>
                  </div>
                  <div style={{ height: 5, background: T.line, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: fc.accent, borderRadius: 3, transition: "width 0.3s" }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </>
    );
  }


  const isPage = ["home", "practise", "revision", "homework", "videos"].includes(topicsTab);   // "practise" with no question id redirects to Revision
  const legacyTitles = { flashcards: "Flashcards", mcq: "MCQs", calc: "Calculations", extended: "AI Examiner", exam: "Exam-style questions", mechanisms: "Mechanisms", pathways: "Pathways", synth: "Synthesis", nmr: "NMR Practice" };

  // Homework player: focused mode, no tabs
  if (screen === "topics" && topicsTab === "homework" && routeParam) return renderShell(
    <HomeworkPlayer board={board} authUser={authUser} userProfile={userProfile} assignmentId={routeParam} logAttempt={logAttempt} onExit={() => navigate(`/${board}/homework`)} />,
    { focus: true, back: () => navigate(`/${board}/homework`), backLabel: "Back to homework", title: "Homework", subtitle: boardLabel(board) }
  );

  // Past-paper question: focused mode, no tabs
  if (screen === "topics" && topicsTab === "practise" && routeParam) return renderShell(
    <PastPaperQuestion board={board} qid={routeParam} authUser={authUser} logAttempt={logAttempt} onExit={() => navigate(`/${board}/homework`)} />,
    { focus: true, back: () => navigate(`/${board}/homework`), backLabel: "Back to homework", title: "Past-paper question", subtitle: boardLabel(board) }
  );

  if (screen === "topics") return renderShell(
    <>
      {topicsTab === "home" && !hasFullAccess && (
        <Notice tone="amber"><b>Not in a group yet.</b> HSJ Tuition places you in a group once your onboarding is complete. Until then only the free samples are open.</Notice>
      )}
      {topicsTab === "home" && (
        <StudentDashboard board={board} authUser={authUser} userProfile={userProfile} currentStreak={currentStreak} known={known}
          sets={SETS} topicOrder={CURRENT_TOPIC_ORDER} sectionOf={sectionOf} hasFullAccess={hasFullAccess} isAdmin={isAdmin} mcqCount={mcqData.questions.length} />
      )}
      {topicsTab === "revision" && <RevisionPage board={board} isAdmin={isAdmin} hasFullAccess={hasFullAccess} />}
      {topicsTab === "homework" && <StudentHomework board={board} authUser={authUser} userProfile={userProfile} />}
      {topicsTab === "lessons" && <StudentLessons authUser={authUser} />}
      {topicsTab === "videos" && <VideosPage />}
      {!isPage && (
        <>
          <PageHeader eyebrow="Revision" title={legacyTitles[topicsTab] || "Revision"}
            right={<Button variant="secondary" icon="arrowLeft" onClick={() => navigate(`/${board}/revision`)}>Revision</Button>} />
          <ShellBody>
      {topicsTab === "flashcards" && quizScreen === "setup" && (() => {
        const allSections = CURRENT_SECTIONS;
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
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <button className={hasFullAccess ? "cm-card-link" : ""} disabled={!hasFullAccess} onClick={() => { if (hasFullAccess) setQuizScreen("setup"); }}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", textAlign: "left", borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: hasFullAccess ? "pointer" : "default", opacity: hasFullAccess ? 1 : 0.6, color: T.ink }}>
            <IconTile name="bolt" tone="accent" size={40} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Random quiz</span>
              <span style={{ fontSize: 12, color: T.muted }}>{hasFullAccess ? "Spaced repetition · 25+ cards · shows your weak cards more often" : "Pro feature · unlock from the account menu"}</span>
            </div>
            {hasFullAccess ? <Icon name="arrowRight" color={T.faint} /> : <Chip tone="neutral">Pro</Chip>}
          </button>
          {CURRENT_SECTIONS.length === 0 && (
            <Card padding={0}><EmptyState icon="cards" title={`${boardLabel(board)} flashcards are being written`} body="Calculations and the AI Examiner already work for every board. Flashcards and MCQs for this board will appear here as they're added." /></Card>
          )}
          <div className="cm-grid-3">
            {CURRENT_SECTIONS.map(section => {
              const fc = FOLDER_COLORS[section.id] || FOLDER_COLORS.physical_as;
              const totalCards = section.topics.reduce((sum, id) => sum + SETS[id].cards.length, 0);
              const totalKnown = section.topics.reduce((sum, id) => sum + (known[id] || new Set()).size, 0);
              const pct = totalCards > 0 ? Math.round((totalKnown / totalCards) * 100) : 0;
              const sectionLocked = !hasFullAccess && !FREE_FLASHCARD_SECTIONS.includes(section.id);
              return (
                <button key={section.id} className={sectionLocked ? "" : "cm-card-link"} disabled={sectionLocked} onClick={() => { if (!sectionLocked) navigate(`/${board}/flashcards/${section.id}`); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: 16, textAlign: "left", borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: sectionLocked ? "default" : "pointer", opacity: sectionLocked ? 0.6 : 1, color: T.ink }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: fc.accent }} />
                    {sectionLocked ? <Chip tone="neutral">Pro</Chip> : pct > 0 && <Chip tone={pct === 100 ? "green" : "accent"}>{pct}%</Chip>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{section.label}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{section.topics.length} topics · {totalCards} cards</span>
                  <div style={{ width: "100%", height: 5, background: T.line, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: fc.accent, borderRadius: 3 }} />
                  </div>
                </button>
              );
            })}
          </div>
          {CURRENT_SECTIONS.length > 0 && (
            <div style={{ textAlign: "center", fontSize: 12, color: T.muted }}>
              {CURRENT_TOPIC_ORDER.map(id => SETS[id]?.cards.length || 0).reduce((a, b) => a + b, 0)} cards · {CURRENT_TOPIC_ORDER.length} topics
            </div>
          )}
        </div>
      )}
      {topicsTab === "synth" && !hasFullAccess && (
        <UpgradeCard section="Synthesis" />
      )}
      {topicsTab === "synth" && hasFullAccess && (
        <SynthTab board={board} />
      )}
      {topicsTab === "pathways" && !hasFullAccess && (
        <UpgradeCard section="Pathways" />
      )}
      {topicsTab === "pathways" && hasFullAccess && (
        <PathwaysTab board={board} />
      )}
      {topicsTab === "exam" && (
        <ExamStyleTab board={board} logAttempt={logAttempt} />
      )}
      {topicsTab === "extended" && (
        <ExtendedTab board={board} hasFullAccess={hasFullAccess} logActivity={logActivity} logAttempt={logAttempt} LockedOverlay={LockedOverlay} />
      )}
      {topicsTab === "calc" && (
        <CalcTab board={board} hasFullAccess={hasFullAccess} FREE_CALC_IDS={FREE_CALC_IDS} logActivity={logActivity} logScore={logScore} logAttempt={logAttempt} LockedOverlay={LockedOverlay} />
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
      {topicsTab === "mechanisms" && isAdmin && (
        <MechanismsTab hasFullAccess={hasFullAccess} FREE_MECH_COUNT={FREE_MECH_COUNT} logActivity={logActivity} LockedOverlay={LockedOverlay} />
      )}

      {/* ── MCQ TAB ────────────────────────────────────────── */}
      {topicsTab === "mcq" && (
        <McqTab board={board} mcqData={mcqData} logAttempt={logAttempt} />
      )}

      {/* ── NMR PRACTICE TAB ──────────────────────────────────────────────────── */}
      {topicsTab === "nmr" && !isAdmin && (
        <UpgradeCard section="NMR Practice" />
      )}
      {topicsTab === "nmr" && isAdmin && (
        <NmrTab board={board} mcqData={mcqData} />
      )}

          </ShellBody>
        </>
      )}
    </>
  );

  // FLASHCARD VIEW
  const progress = ((index + 1) / order.length) * 100;
  return renderShell(
    <ShellBody style={{ minHeight: "calc(100vh - 150px)" }}>
      {showMenu && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 20px 0" }}>
          <Button size="sm" onClick={shuffled ? reset : shuffle}>{shuffled ? "Reset order" : "Shuffle cards"}</Button>
          <Button size="sm" onClick={studyUnknown}>Unknown only ({cards.length - knownCount})</Button>
          <Button size="sm" variant="danger" onClick={() => { setKnown(p => ({ ...p, [knownKey]: new Set() })); setShowMenu(false); }}>Clear progress</Button>
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
    </ShellBody>,
    { focus: true, back: goBack, backLabel: "Back to topics", title: SETS[topic]?.title || "Flashcards", subtitle: `${topic} · ${order.length} cards`,
      right: <Button size="sm" icon="settings" onClick={() => setShowMenu(!showMenu)}>Options</Button> }
  );
}

/** Name and email at the top of the account menu, with an inline "Change" so a student can fix a nickname. */
function NameBlock({ name, email, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => { if (!editing) setValue(name); }, [name, editing]);
  const save = async () => {
    setBusy(true); setErr(null);
    try { await onSave(value); setEditing(false); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  return (
    <div>
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input value={value} onChange={e => setValue(e.target.value)} aria-label="Your name" autoFocus maxLength={60}
            onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
            style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.ink, fontFamily: "inherit" }} />
          {err && <span style={{ fontSize: 12, color: T.red }}>{err}</span>}
          <div style={{ display: "flex", gap: 6 }}>
            <Button size="sm" variant="primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save name"}</Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{name}</span>
          <button type="button" className="cm-link" onClick={() => setEditing(true)} style={{ background: "none", border: 0, padding: 0, fontSize: 12, cursor: "pointer" }}>Change</button>
        </div>
      )}
      <div style={{ fontSize: 12, color: T.muted, wordBreak: "break-all" }}>{email}</div>
    </div>
  );
}
