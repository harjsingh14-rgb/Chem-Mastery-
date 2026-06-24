const ALLOWED_ORIGINS = [
  "https://fc.hsjtuition.co.uk",
  "https://www.fc.hsjtuition.co.uk",
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return req.method === "OPTIONS";
}

module.exports = { setCors };
