// Daily reminders (Vercel cron, see vercel.json). Three passes, each
// de-duplicated through `reminders/{key}` so a day is never emailed twice:
//   1. lesson tomorrow -> student, parent copied (with homework still open)
//   2. homework due within 24 hours and not submitted -> student
//   3. invoice due within 3 days, or overdue (nudged weekly) -> parent
// Protected by CRON_SECRET (Vercel sends it as a Bearer token). The same
// endpoint also accepts an admin's Firebase token for a manual run.
const fb = require("./_firebaseAdmin");
const mail = require("./_email");
const { verifyFirebaseToken } = require("./_auth");

const DAY = 86400000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmtTime = (hhmm) => { const [h, m] = (hhmm || "0:0").split(":").map(Number); const hh = h % 12 === 0 ? 12 : h % 12; return `${hh}${m ? `:${String(m).padStart(2, "0")}` : ""}${h >= 12 ? "pm" : "am"}`; };

// Dates are judged in UK time whatever the server's zone.
function ukParts(ms) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(new Date(ms)).map(x => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday) };
}

async function once(key, token, fn) {
  const seen = await fb.getDocument(`reminders/${key}`, token);
  if (seen) return false;
  await fn();
  await fb.updateDocument(`reminders/${key}`, { sentAt: Date.now() }, token);
  return true;
}

async function authorised(req, token) {
  const bearer = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const secret = (process.env.CRON_SECRET || "").trim();
  if (secret && bearer === secret) return "cron";
  const caller = await verifyFirebaseToken(req).catch(() => null);
  if (caller) {
    const profile = await fb.getDocument(`users/${caller.uid}`, token);
    if (profile?.role === "admin") return "admin";
  }
  return null;
}

module.exports = async function handler(req, res) {
  try {
    const token = await fb.getAccessToken();
    const who = await authorised(req, token);
    if (!who) return res.status(401).json({ error: "Unauthorised" });
    const now = Date.now();
    const tomorrow = ukParts(now + DAY);
    const report = { lessons: 0, homework: 0, payments: 0, errors: [] };

    const students = await fb.queryDocuments("users", { role: "student" }, token, { limit: 500 });
    const byClass = {};
    for (const s of students) if (s.classId) (byClass[s.classId] = byClass[s.classId] || []).push(s);

    // 1. Sessions tomorrow. The calendar (`sessions`) is the source of truth:
    //    one document per lesson, for the whole group or for named students.
    //    A group with nothing on the calendar at all falls back to its usual
    //    weekly times, so reminders keep going until the calendar is filled.
    const classes = await fb.queryDocuments("classes", {}, token, { limit: 200 });
    const assignments = await fb.queryDocuments("assignments", {}, token, { limit: 1000 });
    const byUid = Object.fromEntries(students.map(s => [s.id, s]));
    const remind = async (cls, recipients, { key, when, zoomLink, title }) => {
      const open = assignments.filter(a => a.classId === cls.id && a.status !== "draft" && a.dueAt && a.dueAt > now - DAY && a.dueAt < now + 2 * DAY);
      for (const s of recipients) {
        if (!s.email) continue;
        try {
          const sent = await once(`${key}_${s.id}`, token, async () => {
            const homework = [];
            for (const a of open) {
              const sub = await fb.getDocument(`submissions/${a.id}_${s.id}`, token);
              if (!sub?.submittedAt) homework.push({ title: a.title, dueAt: a.dueAt });
            }
            const { subject, html } = mail.lessonReminder({ studentName: s.displayName, groupName: title ? `${cls.name} (${title})` : cls.name, when, zoomNote: cls.zoomNote || "", zoomLink: zoomLink || cls.zoomLink || "", homework });
            await mail.sendEmail({ to: s.email, cc: s.parentEmail && s.parentEmail !== s.email ? s.parentEmail : undefined, subject, html });
          });
          if (sent) report.lessons++;
        } catch (e) { report.errors.push(`lesson ${s.id}: ${e.message}`); }
      }
    };
    const sessionsTomorrow = await fb.queryDocuments("sessions", { date: tomorrow.iso }, token, { limit: 200 });
    const onCalendar = new Set();
    for (const ses of sessionsTomorrow) {
      const cls = classes.find(c => c.id === ses.classId);
      if (!cls) continue;
      onCalendar.add(cls.id);
      if (ses.status === "cancelled") continue;
      const recipients = Array.isArray(ses.studentIds) && ses.studentIds.length ? ses.studentIds.map(id => byUid[id]).filter(Boolean) : (byClass[cls.id] || []);
      await remind(cls, recipients, { key: `lesson_${cls.id}_${tomorrow.iso}_${ses.time}`, when: `tomorrow, ${WEEKDAYS[tomorrow.weekday]} at ${fmtTime(ses.time)}`, zoomLink: ses.zoomLink, title: ses.title });
    }
    for (const cls of classes) {
      if (onCalendar.has(cls.id)) continue;
      const any = await fb.queryDocuments("sessions", { classId: cls.id }, token, { limit: 1 });
      if (any.length) continue; // the group is on the calendar and simply has nothing tomorrow
      const slots = (Array.isArray(cls.slots) && cls.slots.length ? cls.slots : cls.schedule ? [cls.schedule] : []).filter(s => s && s.time);
      const sch = slots.find(s => Number(s.weekday) === tomorrow.weekday);
      if (!sch) continue;
      await remind(cls, byClass[cls.id] || [], { key: `lesson_${cls.id}_${tomorrow.iso}`, when: `tomorrow, ${WEEKDAYS[tomorrow.weekday]} at ${fmtTime(sch.time)}` });
    }

    // 2. Homework due within 24h, not submitted
    for (const a of assignments) {
      if (a.status === "draft" || !a.dueAt || a.dueAt < now || a.dueAt > now + DAY) continue;
      for (const s of byClass[a.classId] || []) {
        if (!s.email) continue;
        try {
          const sub = await fb.getDocument(`submissions/${a.id}_${s.id}`, token);
          if (sub?.submittedAt) continue;
          const sent = await once(`hw_${a.id}_${s.id}`, token, async () => {
            const { subject, html } = mail.homeworkReminder({ studentName: s.displayName, title: a.title, dueAt: a.dueAt, started: !!sub });
            await mail.sendEmail({ to: s.email, subject, html });
          });
          if (sent) report.homework++;
        } catch (e) { report.errors.push(`homework ${a.id} ${s.id}: ${e.message}`); }
      }
    }

    // 3. Invoices due within 3 days, or overdue (every 7 days)
    const payments = await fb.queryDocuments("payments", { status: "open" }, token, { limit: 500 });
    for (const p of payments) {
      if (!p.dueAt || !p.customerEmail) continue;
      const daysToDue = Math.floor((p.dueAt - now) / DAY);
      const overdue = daysToDue < 0;
      if (!overdue && daysToDue > 3) continue;
      if (overdue && Math.abs(daysToDue) % 7 !== 0) continue;
      const s = p.uid ? byUid[p.uid] : null;
      const key = overdue ? `pay_${p.id}_overdue_${Math.abs(daysToDue)}` : `pay_${p.id}_due`;
      try {
        const sent = await once(key, token, async () => {
          const { subject, html } = mail.paymentReminder({ parentName: s?.parentName || p.customerName || "", studentName: s?.displayName || p.studentName || "your child", amount: p.amountRemaining || p.amountDue, description: p.description, dueAt: p.dueAt, overdue, url: p.hostedInvoiceUrl });
          await mail.sendEmail({ to: p.customerEmail, subject, html });
        });
        if (sent) report.payments++;
      } catch (e) { report.errors.push(`payment ${p.id}: ${e.message}`); }
    }

    console.log("reminders:", who, JSON.stringify(report));
    return res.status(200).json({ ok: true, ran: who, ...report });
  } catch (err) {
    console.error("cron-reminders error:", err);
    return res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
};
