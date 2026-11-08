// Public, token-based onboarding steps. No login: the student's and parent's
// links each carry a long random token stored on the applicant.
//   GET  ?token=...                -> what this link is for, and the data the page needs
//   POST { token, action: "evaluation", taught, ratings, notes }
//   POST { token, action: "terms", name, version }
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const mail = require("./_email");

const BOARDS = { aqa: "AQA", ocr: "OCR A", edexcel: "Edexcel" };
const RAG = ["red", "amber", "green"];
const COVERED = ["yes", "partly", "no"];
const str = (v, max = 120) => String(v ?? "").trim().slice(0, max);
const bad = (m) => fb.httpError(400, m);

async function findByToken(token, fsToken) {
  if (!/^[a-f0-9]{48}$/.test(token)) return null;
  const [byEval] = await fb.queryDocuments("applicants", { evalToken: token }, fsToken, { limit: 1 });
  if (byEval) return { kind: "evaluation", a: byEval };
  const [byTerms] = await fb.queryDocuments("applicants", { termsToken: token }, fsToken, { limit: 1 });
  if (byTerms) return { kind: "terms", a: byTerms };
  return null;
}

function publicView(kind, a) {
  const base = { kind, id: a.id, studentName: a.studentName, board: a.board, boardLabel: BOARDS[a.board] || a.board, year: a.year, status: a.status };
  if (kind === "evaluation") return { ...base, evaluation: a.evaluation || null };
  return {
    ...base,
    parentName: a.parentName, paymentPlan: a.paymentPlan, paymentAmount: a.paymentAmount ?? null,
    schedule: a.schedule || [], programmeStart: a.programmeStart || null, programmeEnd: a.programmeEnd || null,
    initialGrade: a.initialGrade || null, groupSize: a.groupSize || 6, extraTerms: a.extraTerms || "", agreementDate: a.createdAt || null,
    evaluationDone: !!a.evaluation, terms: a.terms ? { acceptedAt: a.terms.acceptedAt, acceptedName: a.terms.acceptedName, version: a.terms.version } : null,
  };
}

function validateEvaluation(b) {
  const taught = Array.isArray(b.taught) ? b.taught.slice(0, 30).map(x => str(x, 60)).filter(Boolean) : [];
  const ratings = {};
  const src = b.ratings && typeof b.ratings === "object" ? b.ratings : {};
  for (const [ref, r] of Object.entries(src).slice(0, 150)) {
    if (!r || typeof r !== "object") continue;
    const rag = RAG.includes(r.rag) ? r.rag : null;
    const covered = COVERED.includes(r.covered) ? r.covered : "yes";
    const note = str(r.note, 300);
    if (!rag && covered !== "no" && !note) continue;
    ratings[str(ref, 20)] = { rag, covered, note };
  }
  if (taught.length === 0) throw bad("Tick at least one module you have been taught");
  if (Object.keys(ratings).length === 0) throw bad("Rate at least one topic");
  return { taught, ratings, notes: str(b.notes, 2000), submittedAt: Date.now() };
}

const ragCounts = (ratings) => {
  const n = { red: 0, amber: 0, green: 0 };
  for (const r of Object.values(ratings || {})) if (r?.rag && n[r.rag] !== undefined) n[r.rag]++;
  return n;
};

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  try {
    const fsToken = await fb.getAccessToken();
    const origin = fb.siteOrigin(req);

    if (req.method === "GET") {
      const found = await findByToken(str(req.query?.token, 60), fsToken);
      if (!found) throw fb.httpError(404, "This link is not valid. Ask HSJ Tuition for a new one.");
      return res.status(200).json(publicView(found.kind, found.a));
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const body = req.body || {};
    const found = await findByToken(str(body.token, 60), fsToken);
    if (!found) throw fb.httpError(404, "This link is not valid. Ask HSJ Tuition for a new one.");
    const { kind, a } = found;
    const action = str(body.action, 20);
    const labelled = { ...a, boardLabel: BOARDS[a.board] || a.board };
    const adminLink = `${origin}/tutor/students`;

    if (action === "evaluation") {
      if (kind !== "evaluation") throw bad("This link is for the parent terms, not the self-evaluation");
      if (a.status === "placed") throw bad("This self-evaluation has already been used to place you. Ask your tutor if something needs changing.");
      const evaluation = validateEvaluation(body);
      const patch = { evaluation, status: a.status === "agreed" ? "agreed" : "evaluated" };
      let emailError = null;
      if (!a.termsSentAt) {
        try {
          const link = `${origin}/onboarding/${a.termsToken}`;
          const { subject, html } = mail.termsInvite(labelled, link, ragCounts(evaluation.ratings));
          await mail.sendEmail({ to: a.parentEmail, subject, html });
          patch.termsSentAt = Date.now();
        } catch (e) { emailError = e.message; console.error("terms invite failed:", e); }
      }
      await fb.updateDocument(`applicants/${a.id}`, patch, fsToken);
      try {
        const { subject, html } = mail.notify(labelled, "Self-evaluation completed", adminLink);
        await mail.sendEmail({ to: mail.NOTIFY, subject, html });
      } catch (e) { console.error("notify failed:", e); }
      return res.status(200).json({ ok: true, emailError });
    }

    if (action === "terms") {
      if (kind !== "terms") throw bad("This link is for the self-evaluation, not the terms");
      const name = str(body.name);
      if (name.length < 2) throw bad("Please type your full name to accept");
      const terms = {
        acceptedAt: Date.now(), acceptedName: name, version: str(body.version, 40),
        ip: str((req.headers["x-forwarded-for"] || "").split(",")[0], 60), userAgent: str(req.headers["user-agent"], 200),
      };
      const patch = { terms };
      if (a.status !== "placed") patch.status = "agreed";
      await fb.updateDocument(`applicants/${a.id}`, patch, fsToken);
      try {
        const { subject, html } = mail.notify(labelled, a.evaluation ? "Terms accepted, ready to place" : "Terms accepted (self-evaluation still to come)", adminLink);
        await mail.sendEmail({ to: mail.NOTIFY, subject, html });
      } catch (e) { console.error("notify failed:", e); }
      return res.status(200).json({ ok: true, terms });
    }

    throw bad("Unknown action");
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("onboarding error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
