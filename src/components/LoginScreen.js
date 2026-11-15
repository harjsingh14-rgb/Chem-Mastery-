import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInGoogle, signInEmail, resetPassword } from "../firebase";
import { T } from "../ui/theme";
import { Icon } from "../ui/components";

export default function LoginScreen({ onLogin, onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
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
    try {
      if (mode === "reset") { await resetPassword(email); setResetSent(true); setLoading(false); return; }
      await signInEmail(email, password);
    } catch (e) {
      const msg = e.code === "auth/user-not-found" ? "No account found with this email. HSJ students: use the email your welcome email was sent to."
        : e.code === "auth/wrong-password" ? "Incorrect password"
        : e.code === "auth/invalid-credential" ? "Incorrect email or password"
        : e.code === "auth/invalid-email" ? "Please enter a valid email"
        : e.code === "auth/too-many-requests" ? "Too many attempts. Wait a few minutes or reset your password."
        : e.message;
      setError(msg); setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: T.font }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Back to landing page */}
        {onBack && (
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 14px", color: T.body, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", marginBottom: 24 }}>
            <Icon name="arrowLeft" size={14} /> Back to overview
          </button>
        )}
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src="/hsj-logo.png" alt="HSJ Tuition" style={{ height: "96px", objectFit: "contain", display: "block", margin: "0 auto 14px" }} />
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 26, color: T.navy, letterSpacing: -0.3, lineHeight: 1.15 }}>ChemMastery</div>
          <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 6 }}>A-level Chemistry homework, practice and progress</div>
        </div>

        {/* Card */}
        <div style={{ background: T.card, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: "28px", boxShadow: "0 8px 24px rgba(21,40,58,0.06)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: T.ink, margin: "0 0 24px", textAlign: "center" }}>
            {mode === "login" ? "Log in" : "Reset your password"}
          </h2>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: `1.5px solid ${T.border}`,
            background: T.card, cursor: "pointer", fontFamily: "inherit", fontSize: "15px",
            fontWeight: 600, color: T.ink, display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px", transition: "all 0.15s",
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.soft; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.card; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: T.border }} />
            <span style={{ fontSize: "13px", color: T.muted, fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: T.border }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail}>
            <input type="email" autoComplete="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: `1.5px solid ${T.border}`, fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "12px", boxSizing: "border-box", transition: "border 0.15s" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            {mode === "login" && (
              <input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: `1.5px solid ${T.border}`, fontSize: "15px", fontFamily: "inherit", outline: "none", marginBottom: "16px", boxSizing: "border-box", transition: "border 0.15s" }}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            )}
            {mode === "reset" && resetSent && <div style={{ color: "#059669", fontSize: "13px", fontWeight: 600, marginBottom: "12px", padding: "8px 12px", background: "#f0fdf4", borderRadius: "8px" }}>If that email has an account, a reset link is on its way. Check your spam folder too.</div>}
            {error && <div style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600, marginBottom: "12px", padding: "8px 12px", background: "#fef2f2", borderRadius: "8px" }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: T.accent, color: T.card, fontSize: "15px", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Send reset link"}
            </button>
          </form>

          {/* Forgot password / back */}
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: T.muted }}>
            <button onClick={() => { setMode(mode === "login" ? "reset" : "login"); setError(""); setResetSent(false); }}
              style={{ background: "none", border: "none", color: T.accent, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", padding: 0 }}>
              {mode === "login" ? "Forgotten your password?" : "Back to log in"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: T.muted, lineHeight: 1.5 }}>
            Accounts are set up by HSJ Tuition when you join a group. Not with HSJ yet? Visit <a href="https://hsjtuition.co.uk" style={{ color: T.accent, fontWeight: 600 }}>hsjtuition.co.uk</a>.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: T.muted, lineHeight: 1.6, maxWidth: "360px", margin: "24px auto 0" }}>
          <div style={{ marginBottom: "6px" }}>By signing in you agree to our <Link to="/terms" style={{ color: T.muted, fontWeight: 600 }}>terms of use</Link> and <Link to="/privacy" style={{ color: T.muted, fontWeight: 600 }}>privacy policy</Link>.</div>
          <div>This platform is an independent revision tool and is not affiliated with, endorsed by, or connected to AQA, OCR, or any exam board. All exam board names and specifications are used for reference only.</div>
          <div style={{ marginTop: "10px", color: T.faint }}>&#169; {new Date().getFullYear()} HSJ Tuition. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
