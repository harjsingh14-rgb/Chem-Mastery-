// Emails one saved lesson note to the student's parent, with the student
// copied, and stamps the note as sent. Only the tutor who wrote it (or an
// admin) may send it.
const { setCors } = require("./_cors");
const { verifyFirebaseToken } = require("./_auth");
const fb = require("./_firebaseAdmin");
const mail = require("./_email");

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const caller = await verifyFirebaseToken(req);
    if (!caller) throw fb.httpError(401, "Please sign in again");
    const token = await fb.getAccessToken();
    const callerProfile = await fb.getDocument(`users/${caller.uid}`, token);
    if (!callerProfile || !["tutor", "admin"].includes(callerProfile.role)) throw fb.httpError(403, "Tutor accounts only");

    const noteId = String(req.body?.noteId || "").trim();
    if (!/^[\w-]+_[\w-]+$/.test(noteId)) throw fb.httpError(400, "Missing note id");
    const note = await fb.getDocument(`lessonNotes/${noteId}`, token);
    if (!note) throw fb.httpError(404, "Note not found. Save it first.");
    if (note.tutorId !== caller.uid && callerProfile.role !== "admin") throw fb.httpError(403, "This is another tutor's note");
    if (!note.text && !note.www && !note.ebi && !note.extra && !note.summary && !note.attendance) throw fb.httpError(400, "Write the note or record attendance before sending");

    const student = await fb.getDocument(`users/${note.uid}`, token);
    if (!student) throw fb.httpError(404, "Student profile not found");
    const tutor = note.tutorId === caller.uid ? callerProfile : await fb.getDocument(`users/${note.tutorId}`, token);

    const to = student.parentEmail || student.email;
    if (!to) throw fb.httpError(400, "The student has no parent or student email on file");
    const cc = student.parentEmail && student.email && student.email !== student.parentEmail ? student.email : undefined;

    const { subject, html } = mail.lessonNote(note, {
      studentName: student.displayName || note.studentName || "your child",
      parentName: student.parentName || "",
      tutorName: tutor?.displayName || "Your tutor",
      groupName: note.className || student.className || "",
    });
    await mail.sendEmail({ to, cc, subject, html });
    const sentTo = [to, cc].filter(Boolean);
    await fb.updateDocument(`lessonNotes/${noteId}`, { sentAt: Date.now(), sentTo, emailError: null }, token);
    return res.status(200).json({ ok: true, sentTo });
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("lesson-note error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
