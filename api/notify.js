// Emails the tutor when a student does something that needs their attention.
// Called by the web app straight after the Firestore write it describes, so
// everything here is re-read from Firestore and never trusted from the body.
//
//   POST { type: "submission", assignmentId }         homework submitted
//   POST { type: "query", assignmentId, key }          homework mark queried
const fb = require("./_firebaseAdmin");
const mail = require("./_email");
const { setCors } = require("./_cors");
const { verifyFirebaseToken } = require("./_auth");

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const caller = await verifyFirebaseToken(req);
    if (!caller) throw fb.httpError(401, "Unauthorised");
    const { type, assignmentId, key } = req.body || {};
    if (!assignmentId || !["submission", "query"].includes(type)) throw fb.httpError(400, "type and assignmentId required");

    const token = await fb.getAccessToken();
    const [sub, asg, student] = await Promise.all([
      fb.getDocument(`submissions/${assignmentId}_${caller.uid}`, token),
      fb.getDocument(`assignments/${assignmentId}`, token),
      fb.getDocument(`users/${caller.uid}`, token),
    ]);
    if (!sub || !asg) throw fb.httpError(404, "Submission not found");
    const tutor = asg.tutorId ? await fb.getDocument(`users/${asg.tutorId}`, token) : null;
    if (!tutor?.email) return res.status(200).json({ ok: true, sent: false, reason: "tutor has no email" });

    const studentName = student?.displayName || student?.email || "A student";
    const link = `${mail.SITE}/tutor/homework/${assignmentId}`;
    let msg;
    if (type === "submission") {
      if (!sub.submittedAt) throw fb.httpError(400, "Not submitted yet");
      msg = mail.tutorSubmission({ tutorName: tutor.displayName, studentName, title: asg.title, score: sub.totalScore, maxScore: sub.maxScore, link });
    } else {
      const q = key && sub.queries?.[key];
      if (!q) throw fb.httpError(404, "Query not found");
      msg = mail.tutorQuery({ tutorName: tutor.displayName, studentName, where: asg.title, note: q.note || "", link });
    }
    await mail.sendEmail({ to: tutor.email, subject: msg.subject, html: msg.html });
    return res.status(200).json({ ok: true, sent: true });
  } catch (e) {
    if (!e.status) console.error("notify error:", e);
    return res.status(e.status || 500).json({ error: e.message || "Server error" });
  }
};
