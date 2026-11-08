// Admin-only onboarding actions: add a new student after the discovery call,
// resend their links, place them into a group (which creates the account and
// sends the welcome email), edit or remove an applicant.
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const mail = require("./_email");

const BOARDS = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };
const PLANS = ["pif", "x2", "quarterly", "monthly"];
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
  if (has("paymentPlan")) { out.paymentPlan = str(b.paymentPlan, 20); if (!PLANS.includes(out.paymentPlan)) throw bad("Payment plan must be PIF, two instalments, quarterly or monthly"); }
  if (has("paymentAmount")) { const n = b.paymentAmount === "" || b.paymentAmount === null ? null : Number(b.paymentAmount); if (n !== null && (!Number.isFinite(n) || n < 0)) throw bad("Payment amount must be a number"); out.paymentAmount = n; }
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
      return res.status(200).json({ ok: true, uid: auth.uid, existingAccount: auth.existing, emailError });
    }

    throw bad("Unknown action");
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("students error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
