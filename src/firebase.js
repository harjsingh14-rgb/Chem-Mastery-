import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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

export { auth, db };
