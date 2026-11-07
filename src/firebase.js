import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
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

export const signUpEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

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

// --- Access key redemption ---
export async function redeemAccessKey(uid, key) {
  const keyRef = doc(db, "accessKeys", key);
  const keySnap = await getDoc(keyRef);
  if (!keySnap.exists()) return { success: false, error: "Invalid access key" };
  const keyData = keySnap.data();

  // Check if key is disabled
  if (keyData.disabled) return { success: false, error: "This access key has been disabled" };

  // Check expiry
  if (keyData.expiresAt && keyData.expiresAt.toDate() < new Date()) return { success: false, error: "This access key has expired" };

  // For single-use keys, check if already used
  if (keyData.type === "single" && keyData.used) return { success: false, error: "This key has already been used" };

  // Track usage (for shared keys, keep a count)
  const usageCount = (keyData.usageCount || 0) + 1;
  await setDoc(keyRef, { usageCount, lastUsedAt: serverTimestamp() }, { merge: true });

  // Update user profile
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    role: "access_key",
    accessKey: key,
    accessKeyExpiry: keyData.expiresAt || null,
  }, { merge: true });

  return { success: true, expiresAt: keyData.expiresAt ? keyData.expiresAt.toDate() : null };
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

export async function createClass(tutorUid, { name, board }) {
  // Retry a few times in the (unlikely) event of a code collision
  for (let i = 0; i < 5; i++) {
    const code = makeClassCode();
    const ref = doc(db, "classes", code);
    const existing = await getDoc(ref);
    if (existing.exists()) continue;
    const cls = { code, name: name.trim(), board: board || "aqa", tutorId: tutorUid, createdAt: serverTimestamp() };
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
export async function fetchClassStudents(code, tutorUid) {
  const q = query(collection(db, "users"), where("tutorId", "==", tutorUid), where("classId", "==", code));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

export async function joinClass(uid, rawCode) {
  const code = rawCode.trim().toUpperCase();
  const snap = await getDoc(doc(db, "classes", code));
  if (!snap.exists()) return { success: false, error: "No class found with that code" };
  const cls = snap.data();
  if (cls.tutorId === uid) return { success: false, error: "You can't join your own class" };
  await setDoc(doc(db, "users", uid), {
    classId: code,
    tutorId: cls.tutorId,
    joinedClassAt: serverTimestamp(),
  }, { merge: true });
  return { success: true, cls };
}

export async function leaveClass(uid) {
  await setDoc(doc(db, "users", uid), { classId: null, tutorId: null, joinedClassAt: null }, { merge: true });
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

export { auth, db };
