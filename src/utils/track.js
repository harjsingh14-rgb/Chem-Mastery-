// Google Analytics was removed from the platform on 14 Nov 2026 (no consent
// banner, mostly under-18 users). Calls stay in place and are a no-op unless a
// gtag function is present on the page.
export default function track(event, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}
