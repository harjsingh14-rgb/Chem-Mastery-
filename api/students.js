// Admin-only onboarding actions: add a new student after the discovery call,
// resend their links, place them into a group (which creates the account and
// sends the welcome email), edit or remove an applicant.
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const mail = require("./_email");
const storage = require("./_storage");

const BOARDS = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };
const PLANS = ["pif", "instalments", "results"];
const GRADES = ["A*", "A", "B", "C", "D", "E", "U", "Not yet assessed"];
// Keep in step with src/components/CommunityCard.js; settings/community overrides it.
const DEFAULT_DISCORD_INVITE = "https://discord.gg/xHfG8PDzaa";
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
    const rows = Array.isArray(b.schedule) ? b.schedule.slice(0, 24) : [];
    out.schedule = rows.map(r => ({ amount: Number(r?.amount), due: str(r?.due, 80) })).filter(r => Number.isFinite(r.amount) && r.amount > 0 && r.due);
    if (out.schedule.length === 0) throw bad("Add at least one payment line (amount and when it is due)");
  }
  if (has("programmeStart")) { out.programmeStart = str(b.programmeStart, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(out.programmeStart)) throw bad("Programme start date is required"); }
  if (has("programmeEnd")) { out.programmeEnd = str(b.programmeEnd, 80) || `the end of the June ${Number(b.year) === 12 ? 2028 : 2027} A Level examination series`; }
  if (has("initialGrade")) { out.initialGrade = str(b.initialGrade, 20); if (out.initialGrade && !GRADES.includes(out.initialGrade)) throw bad("Initial assessed grade is not valid"); }
  if (has("groupSize")) { const g = Number(b.groupSize); out.groupSize = Number.isInteger(g) && g >= 2 && g <= 12 ? g : 6; }
  if (has("extraTerms")) out.extraTerms = str(b.extraTerms, 4000);
  if (has("notes")) out.notes = str(b.notes, 2000);
  // Current students joined before the platform: the parent agreed terms
  // already, so no agreement is emailed and the parent is not gated on one.
  if (has("currentStudent")) out.currentStudent = b.currentStudent === true || b.currentStudent === "true";
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
async function ensureParentAccount({ parentName, parentEmail, studentUid, studentEmail, studentName, groupName, tutorName, termsToken, discordInvite }, token, { sendEmail = true } = {}) {
  const email = str(parentEmail, 160).toLowerCase();
  if (!EMAIL_RE.test(email) || email === String(studentEmail || "").toLowerCase()) return { skipped: "no separate parent email" };
  let tempPassword = fb.generateTempPassword();
  const auth = await fb.createAuthUser({ email, password: tempPassword, displayName: parentName || "Parent" }, token);
  if (auth.existing) tempPassword = null;
  const existing = await fb.getDocument(`users/${auth.uid}`, token);
  const children = Array.from(new Set([...(existing?.children || []), studentUid]));
  // Terms still to accept, per child: the parent is shown the agreement when
  // they log in until it is accepted (api/onboarding marks acceptedAt).
  const childTerms = { ...(existing?.childTerms || {}) };
  if (termsToken && !childTerms[studentUid]) childTerms[studentUid] = { token: termsToken, acceptedAt: null };
  const now = new Date();
  const profile = { email, children, childTerms, updatedAt: now };
  if (!existing) Object.assign(profile, { displayName: parentName || "Parent", role: "parent", photoURL: "", createdAt: now });
  else if (!existing.role || existing.role === "free") profile.role = "parent";
  if (!existing?.displayName && parentName) profile.displayName = parentName;
  if (tempPassword) profile.needsPasswordChange = true;
  await fb.updateDocument(`users/${auth.uid}`, profile, token);
  await fb.updateDocument(`users/${studentUid}`, { parentUid: auth.uid }, token);
  let emailed = false, emailError = null;
  if (sendEmail) {
    try {
      const { subject, html } = mail.parentWelcome({ parentName, studentName, email, tempPassword, groupName, tutorName, discordInvite });
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

// Students placed before the login gate existed: copy the outstanding
// self-evaluation token onto the student profile and the terms token onto the
// parent profile, so they are asked to finish onboarding when they log in.
async function backfillOnboarding(token, res) {
  const placed = await fb.queryDocuments("applicants", { status: "placed" }, token, { limit: 2000 });
  const results = [];
  for (const a of placed) {
    if (!a.studentUid) continue;
    const r = { student: a.studentName, evalGate: false, termsGate: false };
    const st = await fb.getDocument(`users/${a.studentUid}`, token);
    if (st && !a.evaluation && !st.selfEvaluation && !st.evalToken) { await fb.updateDocument(`users/${a.studentUid}`, { evalToken: a.evalToken }, token); r.evalGate = true; }
    if (st?.parentUid && !a.terms && !a.currentStudent) {
      const parent = await fb.getDocument(`users/${st.parentUid}`, token);
      if (parent && !parent.childTerms?.[a.studentUid]) {
        await fb.updateDocument(`users/${st.parentUid}`, { childTerms: { ...(parent.childTerms || {}), [a.studentUid]: { token: a.termsToken, acceptedAt: null } } }, token);
        r.termsGate = true;
      }
    }
    results.push(r);
  }
  return res.status(200).json({ ok: true, count: results.length, results });
}

// Remove test accounts completely: auth user, profile, applicant records and
// the link from a parent's children list. { emails: [...] }, admin only.
// Refuses accounts that have a group unless { force: true } is passed.
async function deleteAccounts(body, token, res) {
  const emails = (Array.isArray(body.emails) ? body.emails : []).map(e => str(e).toLowerCase()).filter(e => EMAIL_RE.test(e)).slice(0, 20);
  if (!emails.length) throw bad("emails required");
  const results = [];
  for (const email of emails) {
    const r = { email, auth: false, profile: false, applicants: 0, unlinked: 0 };
    const [profile] = await fb.queryDocuments("users", { email }, token, { limit: 1 });
    if (profile?.role === "admin" || profile?.role === "tutor") { r.error = "will not delete a tutor or admin"; results.push(r); continue; }
    if (profile?.classId && !body.force) { r.error = "in a group; pass force to delete anyway"; results.push(r); continue; }
    const authUser = await fb.lookupAuthUser(email, token);
    const uid = profile?.id || authUser?.uid;
    if (uid) {
      // A parent: drop them from nothing; a student: remove from the parent's children
      if (profile?.parentUid) {
        const parent = await fb.getDocument(`users/${profile.parentUid}`, token);
        if (parent) {
          const childTerms = { ...(parent.childTerms || {}) }; delete childTerms[uid];
          await fb.updateDocument(`users/${profile.parentUid}`, { children: (parent.children || []).filter(c => c !== uid), childTerms }, token);
          r.unlinked++;
        }
      }
      for (const child of profile?.children || []) {
        const st = await fb.getDocument(`users/${child}`, token);
        if (st?.parentUid === uid) { await fb.updateDocument(`users/${child}`, { parentUid: null }, token); r.unlinked++; }
      }
      if (profile) { await fb.deleteDocument(`users/${uid}`, token); r.profile = true; }
      if (authUser) r.auth = await fb.deleteAuthUser(authUser.uid, token);
    }
    for (const field of ["studentEmail", "parentEmail"]) {
      const apps = await fb.queryDocuments("applicants", { [field]: email }, token, { limit: 50 });
      for (const a of apps) { await fb.deleteDocument(`applicants/${a.id}`, token); r.applicants++; }
    }
    results.push(r);
  }
  return res.status(200).json({ ok: true, results });
}

/**
 * Place an applicant into a group: create (or reuse) the student's account,
 * write the profile, mark the applicant placed, email the welcome (student,
 * parent copied) and give the parent their own account. With sendEmails false
 * the accounts are made but both welcomes are held for api action sendWelcome.
 */
async function placeApplicant(a, id, groupCode, token, origin, { sendEmails = true } = {}) {
  const group = await fb.getDocument(`classes/${groupCode}`, token);
  if (!group) throw bad("Group not found");
  const tutor = group.tutorId ? await fb.getDocument(`users/${group.tutorId}`, token) : null;
  const community = await fb.getDocument("settings/community", token).catch(() => null);
  const discordInvite = community?.hidden ? null : (community?.discordInvite || DEFAULT_DISCORD_INVITE);

  // Account: new email/password user with a temporary password, or the
  // existing account if the student already has one.
  let tempPassword = fb.generateTempPassword();
  const auth = await fb.createAuthUser({ email: a.studentEmail, password: tempPassword, displayName: a.studentName }, token);
  if (auth.existing) {
    tempPassword = null;
    // The account may carry a gamer tag or nickname from before; the app shows the name HSJ knows them by
    try { await fb.updateAuthUser(auth.uid, { displayName: a.studentName }, token); } catch (e) { console.error("displayName update failed:", e.message); }
  }
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
    parentName: a.parentName || "", parentEmail: a.parentEmail || "", parentPhone: a.parentPhone || "",
    paymentPlan: a.paymentPlan || null, paymentAmount: a.paymentAmount ?? null,
    agreement: {
      totalFee: a.paymentAmount ?? null, paymentPlan: a.paymentPlan || null, schedule: a.schedule || [],
      programmeStart: a.programmeStart || null, programmeEnd: a.programmeEnd || null,
      initialGrade: a.initialGrade || null, groupSize: a.groupSize || 6, extraTerms: a.extraTerms || "",
      acceptedAt: a.terms?.acceptedAt || null, acceptedName: a.terms?.acceptedName || null, version: a.terms?.version || null,
      agreedBeforePlatform: !!a.currentStudent,
    },
    selfEvaluation: a.evaluation || null,
    termsAccepted: a.terms || null,
    applicantId: id,
    evalToken: a.evaluation ? null : a.evalToken,
    placedAt: new Date(now),
  };
  if (!existingProfile) { profile.photoURL = ""; profile.createdAt = new Date(now); }
  if (tempPassword) profile.needsPasswordChange = true;
  await fb.updateDocument(`users/${auth.uid}`, profile, token);
  await fb.updateDocument(`applicants/${id}`, { status: "placed", groupCode: profile.classId, studentUid: auth.uid, placedAt: now, welcomeHeld: !sendEmails }, token);

  let emailError = null;
  if (sendEmails) {
    try {
      const evalLink = a.evaluation ? null : `${origin}/onboarding/${a.evalToken}`;
      const { subject, html } = mail.welcome(withLabel(a), { groupName: profile.className, tutorName: tutor?.displayName || "", tempPassword, email: a.studentEmail, discordInvite, evalLink });
      await mail.sendEmail({ to: a.studentEmail, cc: a.parentEmail || undefined, subject, html });
    } catch (e) { emailError = e.message; }
  }

  // The parent gets their own account, linked to this student
  let parent = null;
  try {
    parent = await ensureParentAccount({ parentName: a.parentName, parentEmail: a.parentEmail, studentUid: auth.uid, studentEmail: a.studentEmail, studentName: a.studentName, groupName: profile.className, tutorName: tutor?.displayName || "", discordInvite, termsToken: a.terms || a.currentStudent ? null : a.termsToken }, token, { sendEmail: sendEmails });
  } catch (e) { parent = { error: e.message }; }
  return { uid: auth.uid, existingAccount: auth.existing, emailError, parent, groupName: profile.className };
}

/** Send the welcomes that an import held back. Accounts never logged into get a fresh temporary password. */
async function sendHeldWelcome(a, id, token, origin) {
  const st = await fb.getDocument(`users/${a.studentUid}`, token);
  if (!st) throw bad("The student's profile is missing");
  const group = st.classId ? await fb.getDocument(`classes/${st.classId}`, token) : null;
  const tutor = group?.tutorId ? await fb.getDocument(`users/${group.tutorId}`, token) : null;
  const community = await fb.getDocument("settings/community", token).catch(() => null);
  const discordInvite = community?.hidden ? null : (community?.discordInvite || DEFAULT_DISCORD_INVITE);
  const fresh = async (uid, profile) => {
    if (!profile?.needsPasswordChange) return null; // they have logged in and chosen a password
    const pw = fb.generateTempPassword();
    await fb.updateAuthUser(uid, { password: pw }, token);
    return pw;
  };
  const studentPw = await fresh(a.studentUid, st);
  const evalLink = st.selfEvaluation || a.evaluation ? null : `${origin}/onboarding/${a.evalToken}`;
  const { subject, html } = mail.welcome(withLabel(a), { groupName: st.className || "", tutorName: tutor?.displayName || "", tempPassword: studentPw, email: a.studentEmail, discordInvite, evalLink });
  await mail.sendEmail({ to: a.studentEmail, cc: a.parentEmail || undefined, subject, html });
  let parentEmailed = false;
  if (st.parentUid) {
    const parent = await fb.getDocument(`users/${st.parentUid}`, token);
    if (parent?.email) {
      const parentPw = await fresh(st.parentUid, parent);
      const m = mail.parentWelcome({ parentName: parent.displayName || a.parentName, studentName: a.studentName, email: parent.email, tempPassword: parentPw, groupName: st.className || "", tutorName: tutor?.displayName || "", discordInvite });
      await mail.sendEmail({ to: parent.email, subject: m.subject, html: m.html });
      parentEmailed = true;
    }
  }
  await fb.updateDocument(`applicants/${id}`, { welcomeHeld: false, welcomeSentAt: Date.now() }, token);
  return { parentEmailed };
}

// ---- Account access (admin): new login details, password reset, disable ----
async function accessAction(body, admin, token, res) {
  const uid = str(body.uid, 64);
  const op = str(body.op, 20);
  if (!uid) throw bad("Missing account id");
  const u = await fb.getDocument(`users/${uid}`, token);
  if (!u) throw fb.httpError(404, "Account not found");
  if (!["student", "parent"].includes(u.role)) throw bad("Only student and parent accounts can be managed here");

  if (op === "disable" || op === "enable") {
    const off = op === "disable";
    await fb.updateAuthUser(uid, { disableUser: off }, token);
    await fb.updateDocument(`users/${uid}`, { accessDisabled: off, accessChangedAt: Date.now(), accessChangedBy: admin.uid }, token);
    return res.status(200).json({ ok: true, accessDisabled: off });
  }

  if (op === "resendLogin" || op === "resetPassword") {
    if (!u.email) throw bad("This account has no email address");
    if (u.accessDisabled) throw bad("Access is switched off for this account. Switch it back on first.");
    const pw = fb.generateTempPassword();
    await fb.updateAuthUser(uid, { password: pw }, token);
    await fb.updateDocument(`users/${uid}`, { needsPasswordChange: true, loginSentAt: Date.now(), loginSentBy: admin.uid }, token);
    const isParent = u.role === "parent";
    let studentName = null;
    if (isParent && Array.isArray(u.children) && u.children[0]) {
      const child = await fb.getDocument(`users/${u.children[0]}`, token).catch(() => null);
      studentName = child?.displayName || null;
    }
    const cc = !isParent && body.copyParent !== false && u.parentEmail && u.parentEmail.toLowerCase() !== u.email.toLowerCase() ? u.parentEmail : undefined;
    const { subject, html } = mail.loginDetails({ name: u.displayName, email: u.email, tempPassword: pw, isParent, reset: op === "resetPassword", studentName, groupName: u.className || "" });
    await mail.sendEmail({ to: u.email, cc, subject, html });
    return res.status(200).json({ ok: true, sentTo: u.email, cc: cc || null });
  }
  throw bad("Unknown access action");
}

// ---- Email to students and parents (admin) ----------------------------------
const EMAIL_MAX = 400;
async function emailAction(body, admin, token, res) {
  const subject = str(body.subject, 150);
  const message = String(body.message ?? "").trim().slice(0, 6000);
  const link = str(body.link, 500);
  const linkLabel = str(body.linkLabel, 60);
  if (subject.length < 3) throw bad("Give the email a subject");
  if (message.length < 10) throw bad("Write a message first");
  if (link && !/^https?:\/\//i.test(link)) throw bad("The link must start with http:// or https://");
  const attachments = storage.cleanAttachments(body.attachments);
  const groups = Array.isArray(body.groups) ? body.groups.map(g => str(g, 20).toUpperCase()).filter(Boolean) : [];
  const uids = Array.isArray(body.uids) ? body.uids.map(u => str(u, 64)).filter(Boolean) : [];
  const toStudents = body.students !== false;
  const toParents = body.parents === true;
  const test = body.test === true;

  const all = await fb.queryDocuments("users", { role: "student" }, token, { limit: 1000 });
  const students = all.filter(u => (uids.length ? uids.includes(u.id) : (groups.length === 0 || groups.includes(u.classId))) && !u.accessDisabled);
  const seen = new Set();
  const recipients = [];
  const add = (r) => { const k = (r.email || "").toLowerCase(); if (!k || seen.has(k)) return; seen.add(k); recipients.push(r); };
  for (const u of students) {
    if (toStudents && u.email) add({ uid: u.id, name: u.displayName || "", email: u.email, role: "student" });
    if (toParents && u.parentEmail) add({ uid: u.id, name: u.parentName || "", email: u.parentEmail, role: "parent", studentName: u.displayName || "" });
  }
  if (recipients.length === 0) throw bad("Nobody matches: check the groups and who the email is for");
  if (recipients.length > EMAIL_MAX) throw bad(`That is ${recipients.length} people; the most one send can go to is ${EMAIL_MAX}`);
  const from = admin.profile?.displayName ? `${admin.profile.displayName}, HSJ Tuition` : "HSJ Tuition";

  if (test) {
    const to = admin.email || admin.profile?.email;
    if (!to) throw bad("Your admin account has no email to send the test to");
    const m = mail.broadcast({ name: admin.profile?.displayName || "there", subject, message, link, linkLabel, from, attachments });
    await mail.sendEmail({ to, subject: `[Test] ${m.subject}`, html: m.html });
    return res.status(200).json({ ok: true, test: true, sentTo: to, wouldGoTo: recipients.length });
  }

  const messages = recipients.map(r => { const m = mail.broadcast({ name: r.name, subject, message, link, linkLabel, from, attachments }); return { to: r.email, subject: m.subject, html: m.html }; });
  const result = await mail.sendBatch(messages);
  const id = fb.newToken().slice(0, 20);
  const record = {
    subject, message, link: link || null, linkLabel: linkLabel || null, attachments,
    groups, uids, students: toStudents, parents: toParents,
    recipients: recipients.map(r => ({ uid: r.uid, name: r.name, email: r.email, role: r.role })),
    count: recipients.length, skipped: !!result.skipped,
    sentBy: admin.uid, sentByName: admin.profile?.displayName || null, sentAt: Date.now(),
  };
  await fb.createDocument("messages", id, record, token);
  return res.status(200).json({ ok: true, id, count: recipients.length, skipped: !!result.skipped });
}

const IMPORT_MAX = 100;
const softProblem = (p) => p.startsWith("no parent email") || p.includes("same as the student");

/** Rows: [{ studentName, studentEmail, parentName, parentEmail, parentPhone, board, year, groupCode }]. */
async function importStudents(body, admin, token, origin, res) {
  const rows = Array.isArray(body.rows) ? body.rows.slice(0, IMPORT_MAX) : [];
  if (rows.length === 0) throw bad("No rows to import");
  const dryRun = !!body.dryRun;
  const sendEmails = body.sendEmails === true;
  const groups = {};
  const groupOf = async (code) => {
    const c = str(code, 20).toUpperCase();
    if (!c) return null;
    if (!(c in groups)) groups[c] = await fb.getDocument(`classes/${c}`, token);
    return groups[c];
  };
  const existingApplicants = await fb.queryDocuments("applicants", {}, token, { limit: 2000 });
  const byEmail = {};
  for (const x of existingApplicants) if (x.studentEmail) byEmail[x.studentEmail.toLowerCase()] = x;
  const seen = new Set();
  const results = [];
  for (const [i, r] of rows.entries()) {
    const out = { row: i + 1, studentName: str(r.studentName), studentEmail: str(r.studentEmail, 160).toLowerCase(), status: "ready", problems: [] };
    const parentEmail = str(r.parentEmail, 160).toLowerCase();
    if (!out.studentName) out.problems.push("student name missing");
    if (!EMAIL_RE.test(out.studentEmail)) out.problems.push("student email not valid");
    if (parentEmail && !EMAIL_RE.test(parentEmail)) out.problems.push("parent email not valid");
    if (parentEmail && parentEmail === out.studentEmail) out.problems.push("parent email is the same as the student's, so no parent account");
    if (!parentEmail) out.problems.push("no parent email, so no parent account or lesson-note emails");
    const group = await groupOf(r.groupCode);
    if (!group) out.problems.push(r.groupCode ? `group ${str(r.groupCode, 20)} not found` : "no group");
    const board = str(r.board, 10).toLowerCase() || group?.board || "";
    if (!BOARDS[board]) out.problems.push("exam board must be AQA, OCR or Edexcel");
    const year = Number(r.year);
    if (![12, 13].includes(year)) out.problems.push("year must be 12 or 13");
    if (seen.has(out.studentEmail)) out.problems.push("duplicate row");
    seen.add(out.studentEmail);
    const prior = byEmail[out.studentEmail];
    if (prior) out.problems.push(prior.status === "placed" ? "already on the platform" : "already onboarding");
    if (out.problems.some(p => !softProblem(p))) { out.status = "skipped"; results.push(out); continue; }
    out.groupName = group.name || group.code;
    if (dryRun) { results.push(out); continue; }
    try {
      const id = fb.newToken().slice(0, 20);
      const now = Date.now();
      const applicant = {
        studentName: out.studentName, studentEmail: out.studentEmail,
        parentName: str(r.parentName) || "", parentEmail: parentEmail || "", parentPhone: str(r.parentPhone, 40),
        board, year, paymentPlan: null, paymentAmount: null, schedule: [], programmeStart: null,
        programmeEnd: `the end of the June ${year === 12 ? 2028 : 2027} A Level examination series`,
        initialGrade: null, groupSize: 6, extraTerms: "", notes: "Imported as a current student",
        currentStudent: true, imported: true,
        status: "invited", createdAt: now, createdBy: admin.uid,
        evalToken: fb.newToken(), termsToken: fb.newToken(),
        evalSentAt: null, termsSentAt: null, evaluation: null, terms: null,
        groupCode: null, studentUid: null, placedAt: null,
      };
      await fb.createDocument("applicants", id, applicant, token);
      const placed = await placeApplicant(applicant, id, group.code, token, origin, { sendEmails });
      out.status = "imported"; out.id = id; out.uid = placed.uid; out.existingAccount = placed.existingAccount;
      if (placed.emailError) out.problems.push(`welcome email failed: ${placed.emailError}`);
      if (placed.parent?.error) out.problems.push(`parent account: ${placed.parent.error}`);
    } catch (e) { out.status = "failed"; out.problems.push(e.message); }
    results.push(out);
  }
  return res.status(200).json({ dryRun, sendEmails, results });
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

    // Bulk import of current students: rows pasted from a spreadsheet, each
    // created as a current student (no agreement, no payment details) and
    // placed straight into a group. dryRun checks the rows without writing.
    if (action === "import") return importStudents(body, admin, token, origin, res);
    // Account access for one student or parent, and emails to many
    if (action === "access") return accessAction(body, admin, token, res);
    if (action === "email") return emailAction(body, admin, token, res);
    // One file for an email, stored first so the send itself stays small
    if (action === "upload") {
      const file = await storage.uploadAttachment({ folder: `mail/${admin.uid.slice(0, 12)}`, name: body.name, type: body.type, dataBase64: body.dataBase64 }, token);
      return res.status(200).json({ ok: true, file });
    }

    if (!["update", "resend", "delete", "place", "sendWelcome"].includes(action)) {
      if (action === "backfillParents") return backfillParents(body, token, res);
      if (action === "backfillOnboarding") return backfillOnboarding(token, res);
      if (action === "deleteAccounts") return deleteAccounts(body, token, res);
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
        if (a.currentStudent) throw bad("Terms for this student were agreed before the platform, so there is no agreement to send");
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
      const r = await placeApplicant(a, id, str(body.groupCode, 20).toUpperCase(), token, origin, { sendEmails: true });
      return res.status(200).json({ ok: true, ...r });
    }

    // Held welcome emails (imported current students): reset the temporary
    // passwords of accounts never logged into, then send the student and
    // parent welcomes now.
    if (action === "sendWelcome") {
      if (a.status !== "placed" || !a.studentUid) throw bad("This student has not been placed yet");
      const r = await sendHeldWelcome(a, id, token, origin);
      return res.status(200).json({ ok: true, ...r });
    }

    throw bad("Unknown action");
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("students error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
