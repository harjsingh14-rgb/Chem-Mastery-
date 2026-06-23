import React, { useState } from "react";
import { signInGoogle, signInEmail, signUpEmail } from "../firebase";

export default function LoginScreen({ onLogin, onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true); setError("");
    try { await signInGoogle(); }
    catch (e) { setError(e.message); setLoading(false); }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (mode === "signup" && password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }
    try {
      if (mode === "signup") await signUpEmail(email, password);
      else await signInEmail(email, password);
    } catch (e) {
      const msg = e.code === "auth/user-not-found" ? "No account found with this email"
        : e.code === "auth/wrong-password" ? "Incorrect password"
        : e.code === "auth/invalid-credential" ? "Incorrect email or password"
        : e.code === "auth/email-already-in-use" ? "An account with this email already exists"
        : e.code === "auth/invalid-email" ? "Please enter a valid email"
        : e.message;
      setError(msg); setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d1b2a 0%, #1b2d45 50%, #0d1b2a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Back to landing page */}
        {onBack && (
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "8px 16px", color: "#29ABE2", cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
            ← Back to overview
          </button>
        )}
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "120px", objectFit: "contain", display: "block", margin: "0 auto 20px", filter: "drop-shadow(0 4px 20px rgba(41,171,226,0.3))" }} />
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: "32px", color: "#ffffff", letterSpacing: "2px", textTransform: "uppercase", lineHeight: 1.1 }}>HSJ TUITION</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "14px", color: "#29ABE2", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", marginTop: "8px" }}>A-Level Chemistry. Mastered.</div>
        </div>

        {/* Card */}
        <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a2d45", margin: "0 0 24px", textAlign: "center" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: "1.5px solid #e0e8f0",
            background: "#ffffff", cursor: "pointer", fontFamily: "inherit", fontSize: "15px",
            fontWeight: 600, color: "#1a2d45", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px", transition: "all 0.15s",
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#f8fafc"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e0e8f0" }} />
            <span style={{ fontSize: "13px", color: "#7a95b0", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e8f0" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail}>
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "12px", boxSizing: "border-box", transition: "border 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#29ABE2"}
              onBlur={e => e.target.style.borderColor = "#e0e8f0"}
            />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: mode === "signup" ? "12px" : "16px", boxSizing: "border-box", transition: "border 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#29ABE2"}
              onBlur={e => e.target.style.borderColor = "#e0e8f0"}
            />
            {mode === "signup" && (
              <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e0e8f0", fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "16px", boxSizing: "border-box", transition: "border 0.15s" }}
                onFocus={e => e.target.style.borderColor = "#29ABE2"}
                onBlur={e => e.target.style.borderColor = "#e0e8f0"}
              />
            )}
            {error && <div style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600, marginBottom: "12px", padding: "8px 12px", background: "#fef2f2", borderRadius: "8px" }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: "#29ABE2", color: "#ffffff", fontSize: "15px", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          {/* Toggle mode */}
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#7a95b0" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#29ABE2", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", padding: 0 }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "#4a6080", lineHeight: 1.6, maxWidth: "360px", margin: "24px auto 0" }}>
          <div style={{ marginBottom: "6px" }}>By signing in you agree to our terms of use and privacy policy.</div>
          <div>This platform is an independent revision tool and is not affiliated with, endorsed by, or connected to AQA, OCR, or any exam board. All exam board names and specifications are used for reference only.</div>
          <div style={{ marginTop: "10px", color: "#3a5068" }}>&#169; {new Date().getFullYear()} HSJ Tuition. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
