const crypto = require("crypto");

const PROJECT_ID = "chemmastery-3adb0";
const CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let cachedKeys = null;
let cacheExpiry = 0;

async function getPublicKeys() {
  if (cachedKeys && Date.now() < cacheExpiry) return cachedKeys;
  const res = await fetch(CERTS_URL);
  cachedKeys = await res.json();
  cacheExpiry = Date.now() + 3600_000;
  return cachedKeys;
}

function base64UrlDecode(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

async function verifyFirebaseToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7);

  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const jwtHeader = JSON.parse(base64UrlDecode(headerB64).toString());
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString());

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    if (payload.iat > now + 5) return null;
    if (payload.iss !== `https://securetoken.google.com/${PROJECT_ID}`) return null;
    if (payload.aud !== PROJECT_ID) return null;
    if (!payload.sub) return null;

    const keys = await getPublicKeys();
    const pem = keys[jwtHeader.kid];
    if (!pem) return null;

    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(`${headerB64}.${payloadB64}`);
    if (!verify.verify(pem, base64UrlDecode(sigB64))) return null;

    return { uid: payload.sub, email: payload.email || null };
  } catch {
    return null;
  }
}

module.exports = { verifyFirebaseToken };
