import React, { lazy } from "react";
import { T } from "../ui/theme";

// React.lazy with two extras: pick a named export, and recover when a chunk
// from an older deploy is gone (the browser still has the old index.html):
// reload once, then give up with the real error.
const RELOAD_KEY = "cm_chunk_reload";

export default function lazyPage(loader, pick) {
  return lazy(() => loader().then(m => {
    try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* storage may be blocked */ }
    return { default: pick ? pick(m) : m.default };
  }).catch(err => {
    let reloaded = false;
    try { reloaded = sessionStorage.getItem(RELOAD_KEY) === "1"; if (!reloaded) sessionStorage.setItem(RELOAD_KEY, "1"); } catch { /* ignore */ }
    if (!reloaded && typeof window !== "undefined") { window.location.reload(); return new Promise(() => {}); }
    throw err;
  }));
}

/** Suspense fallback: quiet, in the page's own colours. `full` fills the viewport for shell-less pages. */
export function PageLoading({ full }) {
  return (
    <div style={{ minHeight: full ? "100vh" : 240, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: T.muted, fontSize: 13, fontFamily: T.font, background: full ? T.bg : "transparent" }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${T.line}`, borderTopColor: T.accent, animation: "cm-spin 0.8s linear infinite" }} />
      Loading…
      <style>{"@keyframes cm-spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
