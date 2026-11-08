const ALLOWED_ORIGINS = [
  "https://fc.hsjtuition.co.uk",
  "https://www.fc.hsjtuition.co.uk",
];

// Vercel preview deployments are allowed too so a branch can be tested end to end.
const allowed = (origin) => !!origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin));

function setCors(req, res) {
  const origin = req.headers.origin;
  if (allowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return req.method === "OPTIONS";
}

module.exports = { setCors };
