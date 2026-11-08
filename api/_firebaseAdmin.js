// Server-side Firebase access for the Vercel functions: a Google access token
// from the service account, thin Firestore REST helpers, Firebase Auth user
// creation and an admin check. No npm dependencies (Vercel functions here run
// with only Node built-ins).
const crypto = require("crypto");
const { verifyFirebaseToken } = require("./_auth");

const PROJECT_ID = "chemmastery-3adb0";
const API_KEY = "AIzaSyCtSbGHVvDJinQ2NnbZUAMp2YHU2aNtkTM";
const DOCS = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let cachedToken = null;
let cachedUntil = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedUntil) return cachedToken;
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  if (!sa.client_email || !sa.private_key) throw httpError(500, "FIREBASE_SERVICE_ACCOUNT is not configured");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(sa.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${payload}.${signature}`,
  });
  const data = await res.json();
  if (!data.access_token) throw httpError(500, "Could not get a Google access token");
  cachedToken = data.access_token;
  cachedUntil = Date.now() + 50 * 60 * 1000;
  return cachedToken;
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

// ---- Firestore value encoding -------------------------------------------
function encode(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encode) } };
  if (typeof v === "object") {
    const fields = {};
    for (const [k, x] of Object.entries(v)) if (x !== undefined) fields[k] = encode(x);
    return { mapValue: { fields } };
  }
  return { stringValue: String(v) };
}

function decode(v) {
  if (!v || typeof v !== "object") return null;
  if ("nullValue" in v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(decode);
  if ("mapValue" in v) return decodeFields(v.mapValue.fields);
  return null;
}

function decodeFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) out[k] = decode(v);
  return out;
}

function encodeFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) fields[k] = encode(v);
  return fields;
}

function docFromResponse(d) {
  if (!d || !d.name) return null;
  return { id: d.name.split("/").pop(), ...decodeFields(d.fields) };
}

async function fsFetch(url, init, token) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw httpError(502, data.error?.message || `Firestore error ${res.status}`);
  }
  return data;
}

/** Read one document. path is "collection/id". Returns null if missing. */
async function getDocument(path, token) {
  const data = await fsFetch(`${DOCS}/${path}`, { method: "GET" }, token);
  return docFromResponse(data);
}

/** Create a document with a chosen id. Fails if it already exists. */
async function createDocument(collection, id, obj, token) {
  const data = await fsFetch(`${DOCS}/${collection}?documentId=${encodeURIComponent(id)}`,
    { method: "POST", body: JSON.stringify({ fields: encodeFields(obj) }) }, token);
  return docFromResponse(data);
}

/** Merge the given top-level fields into a document, creating it if needed. */
async function updateDocument(path, obj, token) {
  const keys = Object.keys(obj).filter(k => obj[k] !== undefined);
  const mask = keys.map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
  const data = await fsFetch(`${DOCS}/${path}?${mask}`,
    { method: "PATCH", body: JSON.stringify({ fields: encodeFields(obj) }) }, token);
  return docFromResponse(data);
}

async function deleteDocument(path, token) {
  await fsFetch(`${DOCS}/${path}`, { method: "DELETE" }, token);
}

/** Documents in a collection where field == value (one filter), newest first if orderBy given. */
async function queryDocuments(collection, filters, token, { limit = 50 } = {}) {
  const fieldFilters = Object.entries(filters).map(([field, value]) => ({
    fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: encode(value) },
  }));
  const where = fieldFilters.length === 1 ? fieldFilters[0]
    : fieldFilters.length > 1 ? { compositeFilter: { op: "AND", filters: fieldFilters } } : undefined;
  const body = { structuredQuery: { from: [{ collectionId: collection }], where, limit } };
  const data = await fsFetch(`${DOCS}:runQuery`, { method: "POST", body: JSON.stringify(body) }, token);
  return (Array.isArray(data) ? data : []).filter(r => r.document).map(r => docFromResponse(r.document));
}

// ---- Firebase Auth ------------------------------------------------------
/** Find an auth user by email. Returns { uid, email, displayName } or null. */
async function lookupAuthUser(email, token) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: [email] }),
  });
  const data = await res.json().catch(() => ({}));
  const u = data.users?.[0];
  return u ? { uid: u.localId, email: u.email, displayName: u.displayName || "" } : null;
}

/**
 * Create an email/password auth user. If the email already has an account,
 * returns it with existing: true and no password.
 */
async function createAuthUser({ email, password, displayName }, token) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName, returnSecureToken: false }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok && data.localId) return { uid: data.localId, existing: false };
  const msg = data.error?.message || "";
  if (msg.includes("EMAIL_EXISTS")) {
    const u = await lookupAuthUser(email, token);
    if (u) return { uid: u.uid, existing: true };
  }
  throw httpError(502, `Could not create the account: ${msg || res.status}`);
}

function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(10);
  let pw = "";
  for (let i = 0; i < 10; i++) pw += chars[bytes[i] % chars.length];
  return pw;
}

const newToken = () => crypto.randomBytes(24).toString("hex");

/** Verify the caller's Firebase ID token and require an admin profile. */
async function requireAdmin(req, token) {
  const caller = await verifyFirebaseToken(req);
  if (!caller) throw httpError(401, "Please sign in again");
  const profile = await getDocument(`users/${caller.uid}`, token);
  if (!profile || profile.role !== "admin") throw httpError(403, "Only an HSJ admin can do this");
  return { ...caller, profile };
}

/** Where links in emails should point: the calling site if it is one of ours, else production. */
function siteOrigin(req) {
  const o = req.headers.origin || "";
  if (o === "https://fc.hsjtuition.co.uk" || o === "https://www.fc.hsjtuition.co.uk" || o.endsWith(".vercel.app")) return o;
  return "https://fc.hsjtuition.co.uk";
}

module.exports = {
  getAccessToken, httpError, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments,
  lookupAuthUser, createAuthUser, generateTempPassword, newToken, requireAdmin, siteOrigin,
};
