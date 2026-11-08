// Onboarding emails, sent through Resend. The sender and the copy address
// for HSJ notifications can be changed with env vars without a code change.
const FROM = process.env.ONBOARDING_FROM || "Harj at HSJ Tuition <harj@hsjtuition.co.uk>";
const NOTIFY = process.env.ONBOARDING_NOTIFY || "info@hsjtuition.co.uk";
// Replies to every onboarding email go to the HSJ inbox, whoever it was sent as.
const REPLY_TO = process.env.ONBOARDING_REPLY_TO || "info@hsjtuition.co.uk";
const SITE = "https://fc.hsjtuition.co.uk";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const firstName = (name) => (name || "").trim().split(/\s+/)[0] || "there";

function layout(title, inner) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:Inter,'Helvetica Neue',Arial,sans-serif;color:#1a2d45;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">
  <div style="font-size:20px;font-weight:800;letter-spacing:0.3px;margin-bottom:18px;"><span style="color:#29ABE2;">HSJ</span> Tuition</div>
  <div style="background:#ffffff;border:1px solid #E3E8EF;border-radius:14px;padding:28px 26px;">
    <h1 style="font-size:21px;font-weight:800;margin:0 0 14px;">${esc(title)}</h1>
    <div style="font-size:15px;line-height:1.65;color:#2b3a4e;">${inner}</div>
  </div>
  <div style="text-align:center;margin-top:20px;font-size:12px;color:#6b7a8c;line-height:1.6;">
    HSJ Tuition · A-level Chemistry · <a href="${SITE}" style="color:#29ABE2;text-decoration:none;">fc.hsjtuition.co.uk</a><br>Questions? Reply to this email.
  </div>
</div></body></html>`;
}

const button = (href, label) => `<div style="margin:22px 0;"><a href="${href}" style="display:inline-block;padding:13px 26px;background:#29ABE2;color:#ffffff;font-weight:700;text-decoration:none;border-radius:10px;font-size:15px;">${esc(label)}</a></div>
<div style="font-size:12px;color:#6b7a8c;">If the button does not work, copy this link into your browser:<br><a href="${href}" style="color:#29ABE2;word-break:break-all;">${href}</a></div>`;

async function sendEmail({ to, cc, subject, html, replyTo }) {
  const key = (process.env.RESEND_API_KEY || "").trim();
  if (!key) { console.log("RESEND_API_KEY not set, skipping email:", subject); return { skipped: true }; }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: Array.isArray(to) ? to : [to], cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined, reply_to: replyTo || REPLY_TO, subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { console.error("Resend error:", data); throw new Error(data.message || "Email could not be sent"); }
  return data;
}

/** To the student: please complete your self-evaluation. */
function evaluationInvite(a, link) {
  const html = layout("Welcome to HSJ Tuition", `
    <p>Hi ${esc(firstName(a.studentName))},</p>
    <p>Great to have you joining us for A-level Chemistry (${esc(a.boardLabel)}, Year ${esc(a.year)}). Before your first lesson I need a picture of where you are, so I can put you in the right group and plan what we cover.</p>
    <p>Please fill in the short self-evaluation below. Tick the modules you have been taught in school so far, then rate yourself Red, Amber or Green on each topic. Be honest, there are no wrong answers and it takes about 5 minutes.</p>
    ${button(link, "Complete my self-evaluation")}
    <p style="margin-top:22px;">Speak soon,<br>Harj</p>`);
  return { subject: "Your HSJ Tuition self-evaluation (5 minutes)", html };
}

/** To the parent: the student has finished the evaluation, please accept the terms. */
function termsInvite(a, link, ragCounts) {
  const html = layout("One last step before lessons start", `
    <p>Hi ${esc(firstName(a.parentName))},</p>
    <p>${esc(firstName(a.studentName))} has completed the self-evaluation (${ragCounts.red} topics rated Red, ${ragCounts.amber} Amber, ${ragCounts.green} Green). I will use it to place ${esc(firstName(a.studentName))} in the right group and plan the first lessons.</p>
    <p>Please read and accept the HSJ Tuition Tutoring Programme Agreement. It sets out the programme, attendance, fees and payment dates we agreed on the call. It takes a few minutes and once done I will confirm the group and lesson time by email.</p>
    ${button(link, "Read and accept the agreement")}
    <p style="margin-top:22px;">Thank you,<br>Harj</p>`);
  return { subject: `HSJ Tuition Tutoring Programme Agreement for ${a.studentName}`, html };
}

/** To the student, parent copied: your account and group. */
function welcome(a, { groupName, tutorName, tempPassword, email }) {
  const html = layout("Your HSJ Tuition account is ready", `
    <p>Hi ${esc(firstName(a.studentName))},</p>
    <p>You are in <strong>${esc(groupName)}</strong>${tutorName ? ` with ${esc(tutorName)}` : ""}. Your homework, feedback and progress all live in your HSJ Tuition account.</p>
    ${tempPassword ? `
    <div style="background:#EEF7FC;border:1px solid #BFE3F5;border-radius:10px;padding:14px 16px;margin:18px 0;">
      <div style="font-weight:700;margin-bottom:6px;">Your login</div>
      <div>Email: <strong>${esc(email)}</strong></div>
      <div>Temporary password: <code style="background:#DCEFFA;padding:2px 8px;border-radius:4px;font-size:15px;font-weight:700;">${esc(tempPassword)}</code></div>
      <div style="font-size:12px;color:#6b7a8c;margin-top:6px;">You will be asked to choose your own password when you first log in.</div>
    </div>` : `<p>Log in with your existing account for <strong>${esc(email)}</strong>.</p>`}
    ${button(SITE, "Log in to HSJ Tuition")}
    <p style="margin-top:22px;">How it works: after each lesson a homework set appears in your account. Do it before the next lesson. Most of it is marked as you go, and I look at the rest. Your parent is copied in here so they know where to find everything.</p>
    <p>See you in the lesson,<br>Harj</p>`);
  return { subject: `Welcome to HSJ Tuition, ${firstName(a.studentName)}`, html };
}

/** To HSJ: something happened on an applicant. */
function notify(a, what, link) {
  const html = layout(what, `
    <p><strong>${esc(a.studentName)}</strong> (${esc(a.boardLabel)}, Year ${esc(a.year)})<br>Parent: ${esc(a.parentName)} · ${esc(a.parentEmail)}</p>
    ${button(link, "Open onboarding")}`);
  return { subject: `${what}: ${a.studentName}`, html };
}

module.exports = { sendEmail, evaluationInvite, termsInvite, welcome, notify, NOTIFY };
