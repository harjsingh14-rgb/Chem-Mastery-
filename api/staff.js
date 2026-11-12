// Admin-only: tutors and admins on the platform. Add one (creates the
// account if needed, sets the role, emails the login), change a role, or
// take access away. Students and parents are handled by api/students.js.
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const mail = require("./_email");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ["tutor", "admin"];
// Must match src/utils/privileges.js
const PRIVILEGES = ["groups", "calendar", "lessons", "sendNotes", "homework", "marking", "family", "editStudents"];
const str = (v, max = 120) => String(v ?? "").trim().slice(0, max);
const bad = (m) => fb.httpError(400, m);

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const token = await fb.getAccessToken();
    const admin = await fb.requireAdmin(req, token);
    const body = req.body || {};
    const action = str(body.action, 20);

    if (action === "add") {
      const name = str(body.name);
      const email = str(body.email, 160).toLowerCase();
      const role = ROLES.includes(body.role) ? body.role : "tutor";
      if (!name) throw bad("Name is required");
      if (!EMAIL_RE.test(email)) throw bad("Email is not valid");
      let tempPassword = fb.generateTempPassword();
      const auth = await fb.createAuthUser({ email, password: tempPassword, displayName: name }, token);
      if (auth.existing) tempPassword = null;
      const existing = await fb.getDocument(`users/${auth.uid}`, token);
      if (existing?.role === "student" || existing?.classId) throw bad("That email belongs to a student account. Use a different email for the tutor.");
      if (existing?.role === "parent") throw bad("That email belongs to a parent account. Use a different email for the tutor.");
      const now = new Date();
      const profile = { email, displayName: name, role, updatedAt: now, staffAddedBy: admin.uid, staffAddedAt: now };
      if (!existing) Object.assign(profile, { photoURL: "", createdAt: now });
      if (tempPassword) profile.needsPasswordChange = true;
      await fb.updateDocument(`users/${auth.uid}`, profile, token);
      let emailError = null;
      try {
        const { subject, html } = mail.staffWelcome({ name, email, tempPassword, role, addedBy: admin.profile.displayName || "HSJ Tuition" });
        await mail.sendEmail({ to: email, subject, html });
      } catch (e) { emailError = e.message; }
      return res.status(200).json({ ok: true, uid: auth.uid, existing: !!auth.existing, emailed: !emailError, emailError });
    }

    if (action === "setRole") {
      const uid = str(body.uid, 128);
      const role = str(body.role, 10);
      if (!uid) throw bad("Missing user");
      if (!["tutor", "admin", "free"].includes(role)) throw bad("Role must be tutor, admin or free");
      if (uid === admin.uid) throw bad("You cannot change your own role");
      const target = await fb.getDocument(`users/${uid}`, token);
      if (!target) throw fb.httpError(404, "User not found");
      if (!["tutor", "admin"].includes(target.role)) throw bad("That account is not a tutor or admin");
      if (role === "free") {
        const groups = await fb.queryDocuments("classes", { tutorId: uid }, token, { limit: 50 });
        if (groups.length) throw bad(`Reassign their ${groups.length} group${groups.length === 1 ? "" : "s"} to another tutor first (Overview tab)`);
      }
      await fb.updateDocument(`users/${uid}`, { role, updatedAt: new Date(), roleChangedBy: admin.uid }, token);
      return res.status(200).json({ ok: true });
    }

    if (action === "setPrivileges") {
      // What this tutor may do (src/utils/privileges.js). Stored as a map of
      // id -> boolean; a key left out means allowed.
      const uid = str(body.uid, 128);
      if (!uid) throw bad("Missing user");
      const given = body.privileges && typeof body.privileges === "object" ? body.privileges : null;
      if (!given) throw bad("Missing privileges");
      const target = await fb.getDocument(`users/${uid}`, token);
      if (!target) throw fb.httpError(404, "User not found");
      if (target.role !== "tutor") throw bad(target.role === "admin" ? "Admins can do everything; make them a tutor first" : "That account is not a tutor");
      const privileges = {};
      for (const id of PRIVILEGES) if (id in given) privileges[id] = !!given[id];
      await fb.updateDocument(`users/${uid}`, { privileges, privilegesChangedBy: admin.uid, privilegesChangedAt: new Date(), updatedAt: new Date() }, token);
      return res.status(200).json({ ok: true, privileges });
    }

    throw bad("Unknown action");
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("staff error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
