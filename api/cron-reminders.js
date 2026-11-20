// Daily reminders (Vercel cron, see vercel.json). Five passes, each
// de-duplicated through `reminders/{key}` so a day is never emailed twice:
//   1. lesson tomorrow -> student, parent copied (with homework still open)
//   2. homework due within 24 hours and not submitted -> student
//   3. invoice due within 3 days, or overdue (nudged weekly) -> parent
//   4. tomorrow's lessons -> each tutor (their own), each admin (everyone's)
//   5. on Sundays, the week ahead -> tutors and admins as above, and every
//      student with a lesson that week, parent copied
// Protected by CRON_SECRET (Vercel sends it as a Bearer token). The same
// endpoint also accepts an admin's Firebase token for a manual run.
const fb = require("./_firebaseAdmin");
const mail = require("./_email");
const { verifyFirebaseToken } = require("./_auth");
const { groupLink, slotsOf } = require("./_groupLink");

const DAY = 86400000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmtTime = (hhmm) => { const [h, m] = (hhmm || "0:0").split(":").map(Number); const hh = h % 12 === 0 ? 12 : h % 12; return `${hh}${m ? `:${String(m).padStart(2, "0")}` : ""}${h >= 12 ? "pm" : "am"}`; };
const addMinutes = (hhmm, mins) => { const [h, m] = (hhmm || "0:0").split(":").map(Number); const t = h * 60 + m + Number(mins || 0); return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
const timeRange = (s) => `${fmtTime(s.time)} to ${fmtTime(addMinutes(s.time, s.minutes || 120))}`;
const addDaysIso = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const fmtDay = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const fmtShort = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

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
            const { subject, html } = mail.lessonReminder({ studentName: s.displayName, groupName: title ? `${cls.name} (${title})` : cls.name, when, zoomNote: cls.zoomNote || "", zoomLink: zoomLink || "", homework });
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
      await remind(cls, recipients, { key: `lesson_${cls.id}_${tomorrow.iso}_${ses.time}`, when: `tomorrow, ${WEEKDAYS[tomorrow.weekday]} at ${fmtTime(ses.time)}`, zoomLink: groupLink(cls, ses), title: ses.title });
    }
    for (const cls of classes) {
      if (onCalendar.has(cls.id)) continue;
      const any = await fb.queryDocuments("sessions", { classId: cls.id }, token, { limit: 1 });
      if (any.length) continue; // the group is on the calendar and simply has nothing tomorrow
      const sch = slotsOf(cls).find(s => Number(s.weekday) === tomorrow.weekday);
      if (!sch) continue;
      await remind(cls, byClass[cls.id] || [], { key: `lesson_${cls.id}_${tomorrow.iso}`, when: `tomorrow, ${WEEKDAYS[tomorrow.weekday]} at ${fmtTime(sch.time)}`, zoomLink: sch.zoomLink || cls.zoomLink || "" });
    }

    // 2. Homework due within 24h, not submitted. A homework set for named
    //    students (the initial diagnostic) reminds only them, not the group.
    for (const a of assignments) {
      if (a.status === "draft" || !a.dueAt || a.dueAt < now || a.dueAt > now + DAY) continue;
      const recipients = Array.isArray(a.studentIds) && a.studentIds.length ? a.studentIds.map(id => byUid[id]).filter(Boolean) : (byClass[a.classId] || []);
      for (const s of recipients) {
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

    // 4 and 5. Digests for staff, and the week ahead for students. Every
    //    session on the calendar from tomorrow for a week, cancelled ones left out.
    report.digests = 0;
    const today = ukParts(now);
    const sunday = today.weekday === 0;
    const weekFrom = tomorrow.iso, weekTo = addDaysIso(weekFrom, 6);
    const ahead = (await fb.queryDocuments("sessions", { date: weekFrom }, token, { limit: 1000, ops: { date: "GREATER_THAN_OR_EQUAL" } }))
      .filter(s => s.date <= weekTo && s.status !== "cancelled" && classes.some(c => c.id === s.classId))
      .sort((a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
    const staff = [...await fb.queryDocuments("users", { role: "tutor" }, token, { limit: 100 }), ...await fb.queryDocuments("users", { role: "admin" }, token, { limit: 20 })];
    const staffName = Object.fromEntries(staff.map(t => [t.id, t.displayName || t.email || ""]));
    const whoOf = (s) => s.studentIds ? ((s.studentNames || []).join(", ") || `${s.studentIds.length} students`) : "Whole group";
    const item = (s, withTutor) => { const cls = classes.find(c => c.id === s.classId); return { time: timeRange(s), group: `${cls?.name || s.className || s.classId}${s.title ? ` (${s.title})` : ""}`, who: whoOf(s), tutor: withTutor ? staffName[s.tutorId] || "" : "", link: cls ? groupLink(cls, s) : (s.zoomLink || "") }; };
    const byDay = (list, withTutor) => { const m = {}; for (const s of list) (m[s.date] = m[s.date] || []).push(s); return Object.keys(m).sort().map(d => ({ label: fmtDay(d), items: m[d].map(s => item(s, withTutor)) })); };
    const digest = async (to, cc, key, props) => {
      if (!to) return;
      try {
        const sent = await once(key, token, async () => { const { subject, html } = mail.lessonDigest(props); await mail.sendEmail({ to, cc, subject, html }); });
        if (sent) report.digests++;
      } catch (e) { report.errors.push(`digest ${key}: ${e.message}`); }
    };
    for (const t of staff) {
      const all = t.role === "admin";
      const mine = all ? ahead : ahead.filter(s => s.tutorId === t.id);
      const tmrw = mine.filter(s => s.date === tomorrow.iso);
      const plural = (n) => `${n} lesson${n === 1 ? "" : "s"}`;
      if (tmrw.length) await digest(t.email, undefined, `digest_day_${t.id}_${tomorrow.iso}`, {
        name: t.displayName, title: `${all ? "Lessons" : "Your lessons"} tomorrow, ${fmtDay(tomorrow.iso)}`,
        intro: `${all ? "There are" : "You have"} ${plural(tmrw.length)} tomorrow.`, days: byDay(tmrw, all), url: `${mail.SITE}/tutor/calendar` });
      if (sunday && mine.length) await digest(t.email, undefined, `digest_week_${t.id}_${weekFrom}`, {
        name: t.displayName, title: `${all ? "Lessons" : "Your lessons"} this week, ${fmtShort(weekFrom)} to ${fmtShort(weekTo)}`,
        intro: `${all ? "There are" : "You have"} ${plural(mine.length)} on the calendar this week.`, days: byDay(mine, all), url: `${mail.SITE}/tutor/calendar` });
    }
    if (sunday) {
      for (const s of students) {
        if (!s.email || !s.classId) continue;
        const mine = ahead.filter(x => x.classId === s.classId && (!x.studentIds || x.studentIds.includes(s.id)));
        if (!mine.length) continue;
        await digest(s.email, s.parentEmail && s.parentEmail !== s.email ? s.parentEmail : undefined, `digest_week_student_${s.id}_${weekFrom}`, {
          name: s.displayName, title: `Your lessons this week, ${fmtShort(weekFrom)} to ${fmtShort(weekTo)}`,
          intro: `You have ${mine.length} lesson${mine.length === 1 ? "" : "s"} this week. A reminder with the meeting link comes the day before each one.`,
          days: byDay(mine, false), url: `${mail.SITE}/`, urlLabel: "Open ChemMastery", signoff: "See you in the lesson, HSJ Tuition" });
      }
    }

    console.log("reminders:", who, JSON.stringify(report));
    return res.status(200).json({ ok: true, ran: who, ...report });
  } catch (err) {
    console.error("cron-reminders error:", err);
    return res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
  }
};
