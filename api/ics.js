// Calendar feed. Each user has a private link (users/{uid}.calendarToken)
// that Apple Calendar, Google Calendar and Outlook subscribe to. The feed is
// built from the sessions collection, so moves and cancellations reach the
// phone on the next refresh.
//   GET  /api/ics?t=TOKEN         -> text/calendar
//   POST /api/ics {action}        -> { url } for the signed-in user
//        action "link" returns the existing link (creating one the first time),
//        action "reset" issues a new link so the old one stops working.
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const { verifyFirebaseToken } = require("./_auth");

const SITE = "https://fc.hsjtuition.co.uk";
const TOKEN_RE = /^[a-f0-9]{48}$/;
const DEFAULT_MINUTES = 120;
const PAST_DAYS = 60;        // how far back the feed reaches
const MAX_SESSIONS = 2000;

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  try {
    if (req.method === "GET") return await serveFeed(req, res);
    if (req.method === "POST") return await serveLink(req, res);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error("ics:", e);
    return res.status(status).json({ error: e.message || "Something went wrong" });
  }
};

// ---- POST: the signed-in user's link ------------------------------------
async function serveLink(req, res) {
  const caller = await verifyFirebaseToken(req);
  if (!caller) throw fb.httpError(401, "Please sign in again");
  const token = await fb.getAccessToken();
  const profile = await fb.getDocument(`users/${caller.uid}`, token);
  if (!profile) throw fb.httpError(404, "No profile found for this account");
  const action = String((req.body || {}).action || "link");
  let cal = TOKEN_RE.test(profile.calendarToken || "") ? profile.calendarToken : null;
  if (!cal || action === "reset") {
    cal = fb.newToken();
    await fb.updateDocument(`users/${caller.uid}`, { calendarToken: cal, calendarTokenAt: new Date() }, token);
  }
  return res.status(200).json({ url: `${fb.siteOrigin(req)}/api/ics?t=${cal}`, reset: action === "reset" });
}

// ---- GET: the calendar itself ------------------------------------------
async function serveFeed(req, res) {
  const t = String((req.query || {}).t || "");
  if (!TOKEN_RE.test(t)) throw fb.httpError(404, "That calendar link is not valid");
  const token = await fb.getAccessToken();
  const [user] = await fb.queryDocuments("users", { calendarToken: t }, token, { limit: 1 });
  if (!user) throw fb.httpError(404, "That calendar link is no longer active");

  const cache = { classes: {}, users: {} };
  const cls = async (id) => {
    if (!id) return null;
    if (!(id in cache.classes)) cache.classes[id] = await fb.getDocument(`classes/${id}`, token).catch(() => null);
    return cache.classes[id];
  };
  const person = async (uid) => {
    if (!uid) return null;
    if (!(uid in cache.users)) cache.users[uid] = await fb.getDocument(`users/${uid}`, token).catch(() => null);
    return cache.users[uid];
  };

  const sessions = await sessionsFor(user, token, person);
  const since = isoDaysAgo(PAST_DAYS);
  const rows = sessions.filter(s => s && s.date && s.time && s.date >= since)
    .sort((a, b) => (a.startAt || 0) - (b.startAt || 0));

  const staff = user.role === "tutor" || user.role === "admin";
  const events = [];
  for (const s of rows) {
    const group = await cls(s.classId);
    const tutor = staff ? null : await person(s.tutorId || group?.tutorId);
    events.push(vevent(s, group, tutor, staff));
  }

  const name = staff ? "HSJ Tuition lessons" : user.role === "parent" ? "HSJ Tuition (children's lessons)" : "HSJ Tuition chemistry";
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HSJ Tuition//ChemMastery//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    "X-WR-TIMEZONE:Europe/London",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
    ...LONDON_TZ,
    ...events.flat(),
    "END:VCALENDAR",
  ].map(fold).join("\r\n") + "\r\n";

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", 'inline; filename="hsj-tuition.ics"');
  res.setHeader("Cache-Control", "private, max-age=300");
  return res.status(200).send(body);
}

/** The sessions this user should see, by role. */
async function sessionsFor(user, token, person) {
  const opts = { limit: MAX_SESSIONS };
  if (user.role === "tutor" || user.role === "admin") {
    return fb.queryDocuments("sessions", { tutorId: user.id }, token, opts);
  }
  const forStudent = async (st) => {
    if (!st) return [];
    const [group, named] = await Promise.all([
      st.classId ? fb.queryDocuments("sessions", { classId: st.classId, studentIds: null }, token, opts) : [],
      fb.queryDocuments("sessions", { studentIds: st.id }, token, { ...opts, ops: { studentIds: "ARRAY_CONTAINS" } }),
    ]);
    return [...group, ...named];
  };
  if (user.role === "parent") {
    const kids = Array.isArray(user.children) ? user.children : [];
    const lists = await Promise.all(kids.map(async uid => forStudent(await person(uid))));
    const seen = new Set();
    return lists.flat().filter(s => !seen.has(s.id) && seen.add(s.id));
  }
  return forStudent(user);
}

function vevent(s, group, tutor, staff) {
  const className = s.className || group?.name || s.classId || "Chemistry";
  const cancelled = s.status === "cancelled";
  const minutes = Number(s.minutes) || DEFAULT_MINUTES;
  const zoom = s.zoomLink || group?.zoomLink || null;
  const who = Array.isArray(s.studentNames) && s.studentNames.length ? s.studentNames.join(", ") : null;
  let summary = s.title ? `${s.title} · ${className}` : (staff ? `${className} lesson` : `Chemistry lesson · ${className}`);
  if (cancelled) summary = `Cancelled: ${summary}`;
  const desc = [];
  if (cancelled) desc.push("This lesson has been cancelled.");
  if (tutor?.displayName) desc.push(`Tutor: ${tutor.displayName}`);
  if (who) desc.push(staff ? `Students: ${who}` : "Session for chosen students only.");
  else if (s.studentIds && staff) desc.push(`${s.studentIds.length} chosen student${s.studentIds.length === 1 ? "" : "s"}`);
  if (s.note) desc.push(s.note);
  if (zoom) desc.push(`Meeting link: ${zoom}`);
  if (group?.zoomNote) desc.push(group.zoomNote);
  desc.push(staff ? `Attendance and notes: ${SITE}/tutor/calendar` : `Lesson notes and homework: ${SITE}`);
  const created = isoStamp(s.createdAt);
  const lines = [
    "BEGIN:VEVENT",
    `UID:${s.id}@fc.hsjtuition.co.uk`,
    `DTSTAMP:${isoStamp(Date.now())}`,
    `DTSTART;TZID=Europe/London:${localStamp(s.date, s.time)}`,
    `DTEND;TZID=Europe/London:${localStamp(s.date, addMinutes(s.time, minutes))}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(desc.join("\n"))}`,
    `LOCATION:${escapeText(zoom ? "Online (meeting link in the description)" : "Online")}`,
    zoom ? `URL:${zoom}` : null,
    created ? `CREATED:${created}` : null,
    `STATUS:${cancelled ? "CANCELLED" : "CONFIRMED"}`,
    `SEQUENCE:${cancelled ? 1 : 0}`,
    `CATEGORIES:${escapeText(s.type === "session" ? "Tuition session" : "Tuition lesson")}`,
    "TRANSP:OPAQUE",
  ];
  if (!cancelled) lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapeText(summary)} in 1 hour`, "TRIGGER:-PT1H", "END:VALARM");
  lines.push("END:VEVENT");
  return lines.filter(Boolean);
}

// ---- iCalendar helpers --------------------------------------------------
const LONDON_TZ = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/London",
  "X-LIC-LOCATION:Europe/London",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0000",
  "TZOFFSETTO:+0100",
  "TZNAME:BST",
  "DTSTART:19700329T010000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0000",
  "TZNAME:GMT",
  "DTSTART:19701025T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

const pad = (n) => String(n).padStart(2, "0");

/** "2026-11-11" + "18:00" -> "20261111T180000" (local wall-clock time, no zone suffix). */
function localStamp(date, time) {
  const [y, m, d] = String(date).split("-");
  const [hh, mm] = String(time || "00:00").split(":");
  return `${y}${m}${d}T${pad(hh)}${pad(mm)}00`;
}

/** Add minutes to "HH:MM", staying on the same day label (lessons do not cross midnight). */
function addMinutes(time, minutes) {
  const [hh, mm] = String(time || "00:00").split(":").map(Number);
  const total = Math.min(hh * 60 + mm + minutes, 23 * 60 + 59);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** UTC timestamp in iCalendar form, or null when the value is not a date. */
function isoStamp(v) {
  const d = v instanceof Date ? v : new Date(v);
  if (!v || Number.isNaN(d.getTime())) return null;
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Escape a TEXT value: backslashes, semicolons, commas and newlines. */
function escapeText(s) {
  return String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Fold long lines at 75 octets, continuation lines starting with a space. */
function fold(line) {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out = [];
  let i = 0;
  let first = true;
  while (i < bytes.length) {
    let take = Math.min(first ? 75 : 74, bytes.length - i);
    // Do not split a multi-byte character: back off to a byte that starts one.
    while (take > 1 && i + take < bytes.length && (bytes[i + take] & 0xc0) === 0x80) take -= 1;
    out.push((first ? "" : " ") + bytes.subarray(i, i + take).toString("utf8"));
    i += take;
    first = false;
  }
  return out.join("\r\n");
}
