import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, limit, getDocs, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtSbGHVvDJinQ2NnbZUAMp2YHU2aNtkTM",
  authDomain: "chemmastery-3adb0.firebaseapp.com",
  projectId: "chemmastery-3adb0",
  storageBucket: "chemmastery-3adb0.firebasestorage.app",
  messagingSenderId: "585543890032",
  appId: "1:585543890032:web:e5830fea701137d54170b5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Auth functions ---
export const signInGoogle = () => signInWithPopup(auth, googleProvider);

export const signInEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Accounts are created by HSJ when a student is placed into a group (see api/students.js),
// so there is no self sign-up. Students who forget their password reset it by email.
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const logOut = () => signOut(auth);

/** Change the signed-in user's own display name (auth record and profile). */
export async function updateMyName(name) {
  const u = auth.currentUser;
  if (!u) throw new Error("Not signed in");
  const displayName = String(name || "").trim().slice(0, 60);
  if (displayName.length < 2) throw new Error("Please enter your name");
  await updateProfile(u, { displayName });
  await setDoc(doc(db, "users", u.uid), { displayName, updatedAt: serverTimestamp() }, { merge: true });
  return displayName;
}

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// --- Firestore user profile ---
export async function getOrCreateUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    // Update last login
    await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
    return snap.data();
  }
  // New user - create profile
  const profile = {
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    role: "free",           // "free" | "paid" | "access_key" | "admin"
    accessKey: null,
    accessKeyExpiry: null,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  };
  await setDoc(ref, profile);
  return profile;
}

// =====================================================================
//  Attempts — one document per answered question (revision or homework)
//  Everything in the progress/tutor dashboards is computed from these.
// =====================================================================

/**
 * data: { board, type, questionId, topic, difficulty, correct, score, maxScore,
 *         mode ("revision" | "homework"), assignmentId }
 */
export async function recordAttempt(user, profile, data) {
  if (!user?.uid) return;
  const attempt = {
    uid: user.uid,
    tutorId: profile?.tutorId || null,
    classId: profile?.classId || null,
    board: data.board || null,
    type: data.type,                       // "mcq" | "calc" | "extended" | "flashcard" | "quiz"
    questionId: String(data.questionId),
    topic: data.topic || null,             // spec code / calc set id / category
    topicLabel: data.topicLabel || null,   // human-readable name for dashboards
    difficulty: data.difficulty || null,
    correct: data.correct === undefined ? data.score >= data.maxScore : !!data.correct,
    score: data.score ?? (data.correct ? 1 : 0),
    maxScore: data.maxScore ?? 1,
    mode: data.mode || "revision",
    assignmentId: data.assignmentId || null,
    createdAt: serverTimestamp(),
    clientTime: Date.now(),
  };
  try {
    await addDoc(collection(db, "attempts"), attempt);
  } catch (e) {
    // Never block the UI on analytics-style writes
    console.warn("recordAttempt failed:", e.message);
  }
}

const tsToMs = (a) => a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.clientTime || 0);

export async function fetchAttemptsForUser(uid, max = 1000) {
  const q = query(collection(db, "attempts"), where("uid", "==", uid), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => tsToMs(b) - tsToMs(a));
}

export async function fetchAttemptsForTutor(tutorId, max = 5000) {
  const q = query(collection(db, "attempts"), where("tutorId", "==", tutorId), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => tsToMs(b) - tsToMs(a));
}

// =====================================================================
//  Classes — a tutor creates a class, students join with its code
// =====================================================================

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
const makeClassCode = () => "HSJ-" + Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

// A group (stored in the `classes` collection) has one tutor. An admin may
// create a group for another tutor by passing tutorId.
export async function createClass(tutorUid, { name, board, tutorId, lessonSlot, schedule }) {
  // Retry a few times in the (unlikely) event of a code collision
  for (let i = 0; i < 5; i++) {
    const code = makeClassCode();
    const ref = doc(db, "classes", code);
    const existing = await getDoc(ref);
    if (existing.exists()) continue;
    const cls = { code, name: name.trim(), board: board || "aqa", tutorId: tutorId || tutorUid, lessonSlot: (lessonSlot || "").trim() || null, schedule: schedule || null, createdBy: tutorUid, createdAt: serverTimestamp() };
    await setDoc(ref, cls);
    return cls;
  }
  throw new Error("Could not generate a unique class code, please try again");
}

export async function fetchTutorClasses(tutorUid) {
  const q = query(collection(db, "classes"), where("tutorId", "==", tutorUid));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

// Both filters are needed: the security rule only lets a tutor list users
// whose tutorId is their own uid, so the query must say so explicitly.
// Admins may list any user, so they pass no tutorUid.
export async function fetchClassStudents(code, tutorUid) {
  const q = tutorUid
    ? query(collection(db, "users"), where("tutorId", "==", tutorUid), where("classId", "==", code))
    : query(collection(db, "users"), where("classId", "==", code));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

// ---- Admin: every group, every tutor, the onboarding queue ----
export async function fetchAllClasses() {
  const snap = await getDocs(collection(db, "classes"));
  return snap.docs.map(d => d.data()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

export async function fetchClass(code) {
  if (!code) return null;
  const snap = await getDoc(doc(db, "classes", code));
  return snap.exists() ? { code: snap.id, ...snap.data() } : null;
}
export async function updateClass(code, patch) {
  await updateDoc(doc(db, "classes", code), patch);
}

export async function fetchTutors() {
  const snap = await getDocs(query(collection(db, "users"), where("role", "in", ["tutor", "admin"])));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.displayName || a.email || "").localeCompare(b.displayName || b.email || ""));
}

/** Every placed student (admin). */
export async function fetchAllStudents() {
  const snap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.displayName || a.email || "").localeCompare(b.displayName || b.email || ""));
}

/** Stripe invoices mirrored into `payments`. scope: { uid } for a student, { tutorId } for a tutor, {} for admin. */
export async function fetchPayments(scope = {}) {
  const col = collection(db, "payments");
  const q = scope.uid ? query(col, where("uid", "==", scope.uid)) : scope.tutorId ? query(col, where("tutorId", "==", scope.tutorId)) : col;
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || b.updatedAt || 0) - (a.createdAt || a.updatedAt || 0));
}

/** Admin: raise, void, mark paid or resend a Stripe invoice. */
export async function invoicesApi(action, payload = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again");
  const idToken = await user.getIdToken();
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export async function fetchApplicants() {
  const snap = await getDocs(collection(db, "applicants"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/** Admin onboarding actions run server-side (account creation, emails). */
export async function studentsApi(action, payload = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again");
  const idToken = await user.getIdToken();
  const res = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

// A tutor may set the display name of one of their own students (students
// signing up by email often have no name on their account).
export async function setStudentName(uid, name) {
  await updateDoc(doc(db, "users", uid), { displayName: name.trim() });
}

// =====================================================================
//  Assignments (homework set for a class) and submissions (one per student)
// =====================================================================

/**
 * assignment: { title, classId, board, minutes, dueAt (ms), note,
 *               items: [{ key, type, questionId, marks, minutes, topic, topicLabel }] }
 */
export async function createAssignment(tutorUid, assignment) {
  const ref = await addDoc(collection(db, "assignments"), {
    ...assignment,
    tutorId: tutorUid,
    status: "open",
    createdAt: serverTimestamp(),
    clientTime: Date.now(),
  });
  return { id: ref.id, ...assignment, tutorId: tutorUid, status: "open", clientTime: Date.now() };
}

export async function updateAssignment(id, patch) {
  await updateDoc(doc(db, "assignments", id), patch);
}

export async function deleteAssignment(id) {
  await deleteDoc(doc(db, "assignments", id));
}

const byNewest = (a, b) => (b.clientTime || 0) - (a.clientTime || 0);

export async function fetchTutorAssignments(tutorUid) {
  const snap = await getDocs(query(collection(db, "assignments"), where("tutorId", "==", tutorUid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort(byNewest);
}

export async function fetchClassAssignments(classId) {
  if (!classId) return [];
  const snap = await getDocs(query(collection(db, "assignments"), where("classId", "==", classId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort(byNewest);
}

export async function fetchAssignment(id) {
  const snap = await getDoc(doc(db, "assignments", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export const submissionId = (assignmentId, uid) => `${assignmentId}_${uid}`;

export async function fetchSubmission(assignmentId, uid) {
  const snap = await getDoc(doc(db, "submissions", submissionId(assignmentId, uid)));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchMySubmissions(uid) {
  const snap = await getDocs(query(collection(db, "submissions"), where("uid", "==", uid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchSubmissionsForAssignment(assignmentId, tutorUid) {
  const snap = await getDocs(query(collection(db, "submissions"), where("tutorId", "==", tutorUid), where("assignmentId", "==", assignmentId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchTutorSubmissions(tutorUid) {
  const snap = await getDocs(query(collection(db, "submissions"), where("tutorId", "==", tutorUid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Create the student's submission doc the first time they open an assignment. */
export async function startSubmission(user, profile, assignment) {
  const id = submissionId(assignment.id, user.uid);
  const existing = await getDoc(doc(db, "submissions", id));
  if (existing.exists()) return { id, ...existing.data() };
  const sub = {
    assignmentId: assignment.id,
    uid: user.uid,
    tutorId: profile?.tutorId || null,
    classId: profile?.classId || null,
    studentName: user.displayName || user.email || "",
    answers: {},
    maxScore: (assignment.items || []).reduce((a, it) => a + (it.marks || 0), 0),
    totalScore: 0,
    startedAt: serverTimestamp(),
    submittedAt: null,
    timeSpentMs: 0,
    tutorMarks: {},
    tutorComment: null,
  };
  await setDoc(doc(db, "submissions", id), sub);
  return { id, ...sub };
}

/** Save one answered item. `result` = { answer, score, maxScore, correct, feedback, markedBy, confidence, detail } */
export async function saveItemResult(assignmentId, uid, itemKey, result, totals) {
  // Firestore rejects undefined values; the JSON round trip strips them
  const clean = JSON.parse(JSON.stringify(result));
  await updateDoc(doc(db, "submissions", submissionId(assignmentId, uid)), {
    [`answers.${itemKey}`]: { ...clean, answeredAt: Date.now() },
    totalScore: totals.totalScore,
    timeSpentMs: totals.timeSpentMs,
    lastSavedAt: serverTimestamp(),
  });
}

export async function submitSubmission(assignmentId, uid, totals) {
  await updateDoc(doc(db, "submissions", submissionId(assignmentId, uid)), {
    submittedAt: serverTimestamp(),
    submittedClientTime: Date.now(),
    totalScore: totals.totalScore,
    timeSpentMs: totals.timeSpentMs,
  });
}

/** Tutor adjusts a mark on one item. tutorMarks: { [itemKey]: score } */
export async function saveTutorMark(assignmentId, uid, itemKey, score, totalScore, comment) {
  const patch = { [`tutorMarks.${itemKey}`]: score, totalScore, reviewedAt: serverTimestamp() };
  if (comment !== undefined) patch.tutorComment = comment;
  await updateDoc(doc(db, "submissions", submissionId(assignmentId, uid)), patch);
}

/** Student asks the tutor to check a mark. key = item key, or item key + "__" + part label. */
export async function sendMarkQuery(assignmentId, uid, key, note) {
  await updateDoc(doc(db, "submissions", submissionId(assignmentId, uid)), {
    [`queries.${key}`]: { note, at: Date.now(), status: "open", reply: null },
  });
}

/** Tutor replies to a query and closes it. */
export async function answerMarkQuery(assignmentId, uid, key, reply) {
  await updateDoc(doc(db, "submissions", submissionId(assignmentId, uid)), {
    [`queries.${key}.reply`]: reply,
    [`queries.${key}.status`]: "resolved",
    [`queries.${key}.repliedAt`]: Date.now(),
    reviewedAt: serverTimestamp(),
  });
}

// =====================================================================
//  Lessons (one per group per date) and lesson notes (one per student)
// =====================================================================

export async function createLesson(tutorUid, { classId, className, board, date, topics }) {
  const data = { classId, className: className || null, board: board || null, date, topics: topics || [], tutorId: tutorUid, createdAt: serverTimestamp(), clientTime: Date.now() };
  const ref = await addDoc(collection(db, "lessons"), data);
  return { id: ref.id, ...data };
}

export async function updateLesson(id, patch) {
  await updateDoc(doc(db, "lessons", id), patch);
}

export async function deleteLesson(id) {
  await deleteDoc(doc(db, "lessons", id));
}

export async function fetchTutorLessons(tutorUid) {
  const snap = await getDocs(query(collection(db, "lessons"), where("tutorId", "==", tutorUid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.clientTime || 0) - (a.clientTime || 0));
}

export async function fetchLesson(id) {
  const snap = await getDoc(doc(db, "lessons", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export const lessonNoteId = (lessonId, uid) => `${lessonId}_${uid}`;

/** Create or update a student's note for a lesson. data carries the whole note (attendance, text, homework snapshot, ...). */
export async function saveLessonNote(lessonId, uid, data) {
  const id = lessonNoteId(lessonId, uid);
  await setDoc(doc(db, "lessonNotes", id), { ...data, lessonId, uid, updatedAt: Date.now() }, { merge: true });
  return id;
}

export async function fetchLessonNotes(lessonId, tutorUid) {
  const snap = await getDocs(query(collection(db, "lessonNotes"), where("tutorId", "==", tutorUid), where("lessonId", "==", lessonId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** All notes for one group (attendance record). */
export async function fetchClassLessonNotes(classId, tutorUid) {
  const q = tutorUid
    ? query(collection(db, "lessonNotes"), where("tutorId", "==", tutorUid), where("classId", "==", classId))
    : query(collection(db, "lessonNotes"), where("classId", "==", classId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchMyLessonNotes(uid) {
  const snap = await getDocs(query(collection(db, "lessonNotes"), where("uid", "==", uid)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(n => n.sentAt).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/** Email a saved lesson note to the parent (student copied). Runs server-side. */
export async function sendLessonNote(noteId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again");
  const idToken = await user.getIdToken();
  const res = await fetch("/api/lesson-note", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ noteId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "The note could not be sent");
  return data;
}

// ─── Past-paper questions (written by api/ppq-admin.js and api/ppq-mark.js) ───
/** The compact list of every question for a board and level: ppqIndex/{board}_{level}. */
export async function fetchPpqIndex(board, level) {
  const snap = await getDoc(doc(db, "ppqIndex", `${board}_${level}`));
  return snap.exists() ? (snap.data().items || []) : [];
}
export async function fetchPpqQuestion(id) {
  const snap = await getDoc(doc(db, "ppq", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
/** The student's own attempt record for one question, or null. */
export async function fetchPpqAttempt(qid, uid) {
  const snap = await getDoc(doc(db, "ppqAttempts", `${qid}_${uid}`));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
/** Attempts with an unanswered mark query: the tutor's own students, or everyone for admins. */
export async function fetchOpenPpqQueries(tutorUid, isAdmin) {
  const q = isAdmin
    ? query(collection(db, "ppqAttempts"), where("hasOpenQuery", "==", true), limit(200))
    : query(collection(db, "ppqAttempts"), where("hasOpenQuery", "==", true), where("tutorId", "==", tutorUid), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
/** Display names for a set of users (a tutor may read their own students; admins anyone). */
export async function fetchUserNames(uids) {
  const out = {};
  await Promise.all([...new Set(uids)].map(async uid => {
    try { const s = await getDoc(doc(db, "users", uid)); if (s.exists()) out[uid] = s.data().displayName || s.data().email || uid; } catch { out[uid] = uid; }
  }));
  return out;
}
/** Full profiles for a set of users (a parent reads their children; rules enforce it). */
export async function fetchUserProfiles(uids) {
  const out = [];
  await Promise.all([...new Set(uids || [])].map(async uid => {
    try { const s = await getDoc(doc(db, "users", uid)); if (s.exists()) out.push({ uid, ...s.data() }); } catch {}
  }));
  return out;
}
/** Fire-and-forget: tell the tutor by email about a submission or mark query (api/notify.js). */
export function notifyTutor(payload) {
  auth.currentUser?.getIdToken().then(token =>
    fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
  ).catch(() => {});
}
/** Query and reply actions on api/ppq-mark.js (marking itself is called from the question page). */
export async function ppqMarkApi(payload) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/ppq-mark", { method: "POST", headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) }, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
/** One document per question the student has had marked: attempts, best, latest. */
export async function fetchMyPpqAttempts(uid) {
  const q = query(collection(db, "ppqAttempts"), where("uid", "==", uid), limit(3000));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export { auth, db };
