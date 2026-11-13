// Server-side upload to the Firebase Storage bucket with the service account
// (no npm dependencies). Used for files attached to lesson notes and to
// emails sent from the Students tab. Past-paper images use the same bucket
// through api/ppq-admin.js.
const crypto = require("crypto");
const fb = require("./_firebaseAdmin");

const BUCKET = "chemmastery-3adb0.firebasestorage.app";
const MAX_BYTES = 3 * 1024 * 1024;   // a Vercel request body is capped at 4.5 MB, base64 adds a third
const ALLOWED = /^(application\/pdf|image\/(png|jpeg|jpg|gif|webp)|application\/(msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation|spreadsheetml\.sheet)|vnd\.ms-(excel|powerpoint))|text\/(plain|csv))$/i;

const safeName = (name) => String(name || "file").replace(/[^\w.() -]+/g, "_").replace(/\s+/g, " ").trim().slice(0, 80) || "file";

/** Upload one file; returns { name, url, size, type }. folder like "lessons/abc123". */
async function uploadAttachment({ folder, name, type, dataBase64 }, token) {
  const contentType = String(type || "application/octet-stream").toLowerCase();
  if (!ALLOWED.test(contentType)) throw fb.httpError(400, "That file type cannot be attached. Use a PDF, image, Word, Excel, PowerPoint or text file.");
  if (!/^[\w/-]+$/.test(folder || "")) throw fb.httpError(400, "bad folder");
  const bin = Buffer.from(String(dataBase64 || ""), "base64");
  if (!bin.length) throw fb.httpError(400, "The file is empty");
  if (bin.length > MAX_BYTES) throw fb.httpError(400, "Files can be up to 3 MB each. Share bigger files as a link instead.");
  const clean = safeName(name);
  const path = `${folder}/${Date.now().toString(36)}_${clean}`;
  const downloadToken = crypto.randomUUID();
  const meta = JSON.stringify({ name: path, contentType, cacheControl: "public, max-age=31536000, immutable", contentDisposition: `inline; filename="${clean.replace(/"/g, "")}"`, metadata: { firebaseStorageDownloadTokens: downloadToken } });
  const boundary = "att_" + crypto.randomBytes(8).toString("hex");
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`),
    bin,
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const res = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=multipart`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}`, "Content-Length": String(body.length) }, body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw fb.httpError(502, `The file could not be stored (${res.status}): ${JSON.stringify(data).slice(0, 200)}`);
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;
  return { name: clean, url, size: bin.length, type: contentType };
}

/** Attachments as they are stored on a note or message: a short list of { name, url, size, type }. */
function cleanAttachments(list, max = 5) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, max).filter(a => a && typeof a.url === "string" && a.url.startsWith(`https://firebasestorage.googleapis.com/v0/b/${BUCKET}/`))
    .map(a => ({ name: safeName(a.name), url: a.url, size: Number(a.size) || 0, type: String(a.type || "") }));
}

module.exports = { uploadAttachment, cleanAttachments, MAX_BYTES };
