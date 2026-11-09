// Stripe webhook: records invoices and their payments against the student so
// parents can pay HSJ invoices through Stripe (as they did through TutorBird)
// and tutors and admins see what is paid. Invoices are raised in the Stripe
// dashboard or from the Payments tab (api/invoices.js); both land here.
// Raw body is needed for the signature check, so Vercel body parsing is off.
const crypto = require("crypto");
const fb = require("./_firebaseAdmin");
const { paymentFromInvoice } = require("./_stripe");

module.exports.config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(sigHeader.split(",").map(p => p.split("=").map(x => x.trim())));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(parts.v1), b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** The student this invoice belongs to: match the parent's email first, then the student's. */
async function findStudent(email, token) {
  if (!email) return null;
  const e = email.toLowerCase();
  const [byParent] = await fb.queryDocuments("users", { parentEmail: e }, token, { limit: 1 });
  if (byParent) return byParent;
  const [byStudent] = await fb.queryDocuments("users", { email: e }, token, { limit: 1 });
  return byStudent || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const secret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    if (!secret) return res.status(500).json({ error: "STRIPE_WEBHOOK_SECRET not configured" });
    const raw = await getRawBody(req);
    if (!verifyStripeSignature(raw.toString(), req.headers["stripe-signature"], secret)) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    const event = JSON.parse(raw.toString());

    if (event.type.startsWith("invoice.")) {
      const inv = event.data.object;
      const token = await fb.getAccessToken();
      const email = inv.customer_email || null;
      const student = await findStudent(email, token);
      await fb.updateDocument(`payments/${inv.id}`, paymentFromInvoice(inv, student, { lastEvent: event.type }), token);
      console.log(`${event.type}: ${inv.id} ${email || ""} -> ${student ? student.id : "unmatched"}`);
    }
    // Other events (subscriptions from the old paid plan, checkout sessions) are acknowledged and ignored.
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("stripe webhook error:", err);
    return res.status(500).json({ error: err.message || "Webhook failed" });
  }
};
