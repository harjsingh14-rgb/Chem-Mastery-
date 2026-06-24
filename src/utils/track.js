export default function track(event, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}
