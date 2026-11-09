// Minimal Stripe REST client (no npm deps) plus the invoice -> payments doc
// mapping shared by the webhook and the in-app invoicing endpoint.
const { httpError } = require("./_firebaseAdmin");

function encode(params, prefix) {
  const out = [];
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") out.push(encode(v, key));
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
  }
  return out.filter(Boolean).join("&");
}

async function stripe(method, path, params) {
  const key = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!key) throw httpError(500, "STRIPE_SECRET_KEY is not configured");
  const qs = method === "GET" && params ? `?${encode(params)}` : "";
  const res = await fetch(`https://api.stripe.com/v1${path}${qs}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? undefined : encode(params || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw httpError(res.status >= 500 ? 502 : 400, data.error?.message || `Stripe error ${res.status}`);
  return data;
}

/** Find the parent's Stripe customer by email, or create one. */
async function findOrCreateCustomer({ email, name, uid, studentName }) {
  const found = await stripe("GET", "/customers", { email, limit: 1 });
  if (found.data?.[0]) return found.data[0];
  return stripe("POST", "/customers", { email, name, metadata: { uid, studentName } });
}

/** What goes into payments/{invoice.id}. */
function paymentFromInvoice(inv, student, extra = {}) {
  const email = inv.customer_email || null;
  const paid = inv.status === "paid";
  return {
    invoiceId: inv.id,
    number: inv.number || null,
    customerId: typeof inv.customer === "string" ? inv.customer : (inv.customer?.id || null),
    customerEmail: email,
    customerName: inv.customer_name || null,
    uid: student ? (student.id || student.uid) : null,
    tutorId: student ? (student.tutorId || null) : null,
    classId: student ? (student.classId || null) : null,
    studentName: student ? (student.displayName || null) : null,
    description: inv.description || (inv.lines?.data?.[0]?.description ?? null),
    currency: inv.currency || "gbp",
    amountDue: (inv.amount_due || 0) / 100,
    amountPaid: (inv.amount_paid || 0) / 100,
    amountRemaining: (inv.amount_remaining || 0) / 100,
    status: inv.status || null,
    createdAt: inv.created ? inv.created * 1000 : Date.now(),
    dueAt: inv.due_date ? inv.due_date * 1000 : null,
    paidAt: paid ? ((inv.status_transitions?.paid_at || Math.floor(Date.now() / 1000)) * 1000) : null,
    hostedInvoiceUrl: inv.hosted_invoice_url || null,
    invoicePdf: inv.invoice_pdf || null,
    scheduleIndex: inv.metadata?.scheduleIndex !== undefined && inv.metadata?.scheduleIndex !== "" ? Number(inv.metadata.scheduleIndex) : null,
    updatedAt: Date.now(),
    ...extra,
  };
}

module.exports = { stripe, findOrCreateCustomer, paymentFromInvoice };
