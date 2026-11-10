// Admin-only onboarding actions: add a new student after the discovery call,
// resend their links, place them into a group (which creates the account and
// sends the welcome email), edit or remove an applicant.
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const mail = require("./_email");

const BOARDS = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };
const PLANS = ["pif", "instalments", "results"];
const GRADES = ["A*", "A", "B", "C", "D", "E", "U", "Not yet assessed"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v, max = 120) => String(v ?? "").trim().slice(0, max);
const bad = (m) => fb.httpError(400, m);

function validateDetails(b, { partial = false } = {}) {
  const out = {};
  const has = (k) => !partial || b[k] !== undefined;
  if (has("studentName")) { out.studentName = str(b.studentName); if (!out.studentName) throw bad("Student name is required"); }
  if (has("studentEmail")) { out.studentEmail = str(b.studentEmail).toLowerCase(); if (!EMAIL_RE.test(out.studentEmail)) throw bad("Student email is not valid"); }
  if (has("parentName")) { out.parentName = str(b.parentName); if (!out.parentName) throw bad("Parent name is required"); }
  if (has("parentEmail")) { out.parentEmail = str(b.parentEmail).toLowerCase(); if (!EMAIL_RE.test(out.parentEmail)) throw bad("Parent email is not valid"); }
  if (has("parentPhone")) out.parentPhone = str(b.parentPhone, 40);
  if (has("board")) { out.board = str(b.board, 10); if (!BOARDS[out.board]) throw bad("Exam board must be AQA, OCR A or Edexcel"); }
  if (has("year")) { out.year = Number(b.year); if (![12, 13].includes(out.year)) throw bad("Year group must be 12 or 13"); }
  if (has("paymentPlan")) { out.paymentPlan = str(b.paymentPlan, 20); if (!PLANS.includes(out.paymentPlan)) throw bad("Payment option must be paid in full, instalments or results-based"); }
  if (has("paymentAmount")) { const n = b.paymentAmount === "" || b.paymentAmount === null ? null : Number(b.paymentAmount); if (n === null || !Number.isFinite(n) || n <= 0) throw bad("Total programme fee is required"); out.paymentAmount = n; }
  if (has("schedule")) {
    const rows = Array.isArray(b.schedule) ? b.schedule.slice(0, 12) : [];
    out.schedule = rows.map(r => ({ amount: Number(r?.amount), due: str(r?.due, 80) })).filter(r => Number.isFinite(r.amount) && r.amount > 0 && r.due);
    if (out.schedule.length === 0) throw bad("Add at least one payment line (amount and when it is due)");
  }
  if (has("programmeStart")) { out.programmeStart = str(b.programmeStart, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(out.programmeStart)) throw bad("Programme start date is required"); }
  if (has("programmeEnd")) { out.programmeEnd = str(b.programmeEnd, 80) || `the end of the June ${Number(b.year) === 12 ? 2028 : 2027} A Level examination series`; }
  if (has("initialGrade")) { out.initialGrade = str(b.initialGrade, 20); if (out.initialGrade && !GRADES.includes(out.initialGrade)) throw bad("Initial assessed grade is not valid"); }
  if (has("groupSize")) { const g = Number(b.groupSize); out.groupSize = Number.isInteger(g) && g >= 2 && g <= 12 ? g : 6; }
  if (has("extraTerms")) out.extraTerms = str(b.extraTerms, 4000);
  if (has("notes")) out.notes = str(b.notes, 2000);
  return out;
}

const withLabel = (a) => ({ ...a, boardLabel: BOARDS[a.board] || a.board });

async function sendEvaluationInvite(a, origin) {
  const link = `${origin}/onboarding/${a.evalToken}`;
  const { subject, html } = mail.evaluationInvite(withLabel(a), link);
  await mail.sendEmail({ to: a.studentEmail, subject, html });
}

async function sendTermsInvite(a, origin) {
  const link = `${origin}/onboarding/${a.termsToken}`;
  const n = { red: 0, amber: 0, green: 0 };
  for (const r of Object.values(a.evaluation?.ratings || {})) if (r?.rag && n[r.rag] !== undefined) n[r.rag]++;
  const { subject, html } = mail.termsInvite(withLabel(a), link, n);
  await mail.sendEmail({ to: a.parentEmail, subject, html });
}

/**
 * Make sure the parent has an account linked to the student. Returns
 * { uid, existing, emailed } or { skipped } when there is no usable parent
 * email (or it is the student's own address).
 */
async function ensureParentAccount({ parentName, parentEmail, studentUid, studentEmail, studentName, groupName, tutorName }, token, { sendEmail = true } = {}) {
  const email = str(parentEmail, 160).toLowerCase();
  if (!EMAIL_RE.test(email) || email === String(studentEmail || "").toLowerCase()) return { skipped: "no separate parent email" };
  let tempPassword = fb.generateTempPassword();
  const auth = await fb.createAuthUser({ email, password: tempPassword, displayName: parentName || "Parent" }, token);
  if (auth.existing) tempPassword = null;
  const existing = await fb.getDocument(`users/${auth.uid}`, token);
  const children = Array.from(new Set([...(existing?.children || []), studentUid]));
  const now = new Date();
  const profile = { email, children, updatedAt: now };
  if (!existing) Object.assign(profile, { displayName: parentName || "Parent", role: "parent", photoURL: "", createdAt: now });
  else if (!existing.role || existing.role === "free") profile.role = "parent";
  if (!existing?.displayName && parentName) profile.displayName = parentName;
  if (tempPassword) profile.needsPasswordChange = true;
  await fb.updateDocument(`users/${auth.uid}`, profile, token);
  await fb.updateDocument(`users/${studentUid}`, { parentUid: auth.uid }, token);
  let emailed = false, emailError = null;
  if (sendEmail) {
    try {
      const { subject, html } = mail.parentWelcome({ parentName, studentName, email, tempPassword, groupName, tutorName });
      await mail.sendEmail({ to: email, subject, html });
      emailed = true;
    } catch (e) { emailError = e.message; }
  }
  return { uid: auth.uid, existing: auth.existing, emailed, emailError };
}

// Create parent accounts for students placed before parent logins existed.
// { dryRun: true } lists who would get one without creating or emailing.
async function backfillParents(body, token, res) {
      const dryRun = !!body.dryRun;
      const students = await fb.queryDocuments("users", { role: "student" }, token, { limit: 2000 });
      const results = [];
      for (const st of students) {
        if (st.parentUid || !st.parentEmail || !EMAIL_RE.test(st.parentEmail)) continue;
        if (dryRun) { results.push({ student: st.displayName, parentEmail: st.parentEmail, parentName: st.parentName || "" }); continue; }
        let r;
        try {
          const group = st.classId ? await fb.getDocument(`classes/${st.classId}`, token) : null;
          const tutor = st.tutorId ? await fb.getDocument(`users/${st.tutorId}`, token) : null;
          r = await ensureParentAccount({ parentName: st.parentName, parentEmail: st.parentEmail, studentUid: st.id, studentEmail: st.email, studentName: st.displayName, groupName: group?.name || st.className || "", tutorName: tutor?.displayName || "" }, token, { sendEmail: true });
        } catch (e) { r = { error: e.message }; }
        results.push({ student: st.displayName, parentEmail: st.parentEmail, ...r });
      }
      return res.status(200).json({ ok: true, dryRun, count: results.length, results });
    }

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const token = await fb.getAccessToken();
    const admin = await fb.requireAdmin(req, token);
    const body = req.body || {};
    const origin = fb.siteOrigin(req);
    const action = str(body.action, 20);

    if (action === "create") {
      const details = validateDetails(body);
      const id = fb.newToken().slice(0, 20);
      const now = Date.now();
      const applicant = {
        ...details,
        status: "invited",
        createdAt: now, createdBy: admin.uid,
        evalToken: fb.newToken(), termsToken: fb.newToken(),
        evalSentAt: null, termsSentAt: null,
        evaluation: null, terms: null,
        groupCode: null, studentUid: null, placedAt: null,
      };
      await fb.createDocument("applicants", id, applicant, token);
      let emailError = null;
      try {
        await sendEvaluationInvite(applicant, origin);
        await fb.updateDocument(`applicants/${id}`, { evalSentAt: Date.now() }, token);
        applicant.evalSentAt = Date.now();
      } catch (e) { emailError = e.message; }
      return res.status(200).json({ applicant: { id, ...applicant }, emailError });
    }

    if (!["update", "resend", "delete", "place"].includes(action)) {
      if (action === "backfillParents") return backfillParents(body, token, res);
      throw bad("Unknown action");
    }

    const id = str(body.id, 40);
    if (!id) throw bad("Missing applicant id");
    const a = await fb.getDocument(`applicants/${id}`, token);
    if (!a) throw fb.httpError(404, "Applicant not found");

    if (action === "update") {
      const patch = validateDetails(body.fields || {}, { partial: true });
      if (Object.keys(patch).length === 0) throw bad("Nothing to update");
      await fb.updateDocument(`applicants/${id}`, patch, token);
      return res.status(200).json({ ok: true, applicant: { ...a, ...patch } });
    }

    if (action === "resend") {
      const which = str(body.which, 20);
      if (which === "evaluation") {
        await sendEvaluationInvite(a, origin);
        await fb.updateDocument(`applicants/${id}`, { evalSentAt: Date.now() }, token);
      } else if (which === "terms") {
        await sendTermsInvite(a, origin);
        await fb.updateDocument(`applicants/${id}`, { termsSentAt: Date.now() }, token);
      } else throw bad("Say which email to resend");
      return res.status(200).json({ ok: true });
    }

    if (action === "delete") {
      if (a.status === "placed") throw bad("This student has already been placed; remove them from their group instead");
      await fb.deleteDocument(`applicants/${id}`, token);
      return res.status(200).json({ ok: true });
    }

    if (action === "place") {
      if (a.status === "placed") throw bad("Already placed");
      const groupCode = str(body.groupCode, 20).toUpperCase();
      const group = await fb.getDocument(`classes/${groupCode}`, token);
      if (!group) throw bad("Group not found");
      const tutor = group.tutorId ? await fb.getDocument(`users/${group.tutorId}`, token) : null;

      // Account: new email/password user with a temporary password, or the
      // existing account if the student already has one.
      let tempPassword = fb.generateTempPassword();
      const auth = await fb.createAuthUser({ email: a.studentEmail, password: tempPassword, displayName: a.studentName }, token);
      if (auth.existing) tempPassword = null;
      const existingProfile = await fb.getDocument(`users/${auth.uid}`, token);

      const now = Date.now();
      const profile = {
        email: a.studentEmail,
        displayName: a.studentName,
        role: "student",
        board: group.board || a.board,
        year: a.year,
        classId: group.code || groupCode,
        className: group.name || groupCode,
        tutorId: group.tutorId,
        joinedClassAt: new Date(now),
        parentName: a.parentName, parentEmail: a.parentEmail, parentPhone: a.parentPhone || "",
        paymentPlan: a.paymentPlan, paymentAmount: a.paymentAmount ?? null,
        agreement: {
          totalFee: a.paymentAmount ?? null, paymentPlan: a.paymentPlan, schedule: a.schedule || [],
          programmeStart: a.programmeStart || null, programmeEnd: a.programmeEnd || null,
          initialGrade: a.initialGrade || null, groupSize: a.groupSize || 6, extraTerms: a.extraTerms || "",
          acceptedAt: a.terms?.acceptedAt || null, acceptedName: a.terms?.acceptedName || null, version: a.terms?.version || null,
        },
        selfEvaluation: a.evaluation || null,
        termsAccepted: a.terms || null,
        applicantId: id,
        placedAt: new Date(now),
      };
      if (!existingProfile) { profile.photoURL = ""; profile.createdAt = new Date(now); }
      if (tempPassword) profile.needsPasswordChange = true;
      await fb.updateDocument(`users/${auth.uid}`, profile, token);
      await fb.updateDocument(`applicants/${id}`, { status: "placed", groupCode: profile.classId, studentUid: auth.uid, placedAt: now }, token);

      let emailError = null;
      try {
        const { subject, html } = mail.welcome(withLabel(a), { groupName: profile.className, tutorName: tutor?.displayName || "", tempPassword, email: a.studentEmail });
        await mail.sendEmail({ to: a.studentEmail, cc: a.parentEmail, subject, html });
      } catch (e) { emailError = e.message; }

      // The parent gets their own account, linked to this student
      let parent = null;
      try {
        parent = await ensureParentAccount({ parentName: a.parentName, parentEmail: a.parentEmail, studentUid: auth.uid, studentEmail: a.studentEmail, studentName: a.studentName, groupName: profile.className, tutorName: tutor?.displayName || "" }, token, { sendEmail: true });
      } catch (e) { parent = { error: e.message }; }
      return res.status(200).json({ ok: true, uid: auth.uid, existingAccount: auth.existing, emailError, parent });
    }

    throw bad("Unknown action");
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("students error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
