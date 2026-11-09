// Admin invoicing through Stripe, mirroring TutorBird: raise an invoice to the
// parent (Stripe emails the hosted payment page), void it, record a bank
// transfer as paid, or resend it. Every change is mirrored into `payments`.
const { setCors } = require("./_cors");
const fb = require("./_firebaseAdmin");
const { stripe, findOrCreateCustomer, paymentFromInvoice } = require("./_stripe");

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const token = await fb.getAccessToken();
    const admin = await fb.requireAdmin(req, token);
    const { action } = req.body || {};
    const body = req.body || {};

    if (action === "create") {
      const uid = String(body.uid || "").trim();
      const amount = Math.round(Number(body.amount) * 100);
      const description = String(body.description || "").trim();
      const dueDate = String(body.dueDate || "").trim();
      if (!uid) throw fb.httpError(400, "Choose a student");
      if (!Number.isFinite(amount) || amount < 100) throw fb.httpError(400, "Enter an amount of at least £1");
      if (!description) throw fb.httpError(400, "Describe what the invoice is for");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) throw fb.httpError(400, "Choose a due date");
      const dueUnix = Math.floor(new Date(`${dueDate}T23:59:00`).getTime() / 1000);
      if (dueUnix * 1000 < Date.now()) throw fb.httpError(400, "The due date must be in the future");

      const student = await fb.getDocument(`users/${uid}`, token);
      if (!student) throw fb.httpError(404, "Student not found");
      const email = (student.parentEmail || student.email || "").toLowerCase();
      if (!email) throw fb.httpError(400, "The student has no parent email on file");

      const customer = await findOrCreateCustomer({ email, name: student.parentName || student.displayName || email, uid, studentName: student.displayName || "" });
      const metadata = { uid, studentName: student.displayName || "", scheduleIndex: body.scheduleIndex ?? "" };
      const invoice = await stripe("POST", "/invoices", {
        customer: customer.id, collection_method: "send_invoice", due_date: dueUnix, description,
        auto_advance: false, currency: "gbp", metadata,
        footer: "HSJ Tuition. Questions about this invoice? Reply to info@hsjtuition.co.uk",
      });
      await stripe("POST", "/invoiceitems", { customer: customer.id, invoice: invoice.id, amount, currency: "gbp", description });
      await stripe("POST", `/invoices/${invoice.id}/finalize`, {});
      const sent = await stripe("POST", `/invoices/${invoice.id}/send`, {});
      const payment = paymentFromInvoice(sent, { id: uid, ...student }, { lastEvent: "app.create", raisedBy: admin.uid });
      await fb.updateDocument(`payments/${sent.id}`, payment, token);
      return res.status(200).json({ payment: { id: sent.id, ...payment } });
    }

    const invoiceId = String(body.invoiceId || "").trim();
    if (!/^in_[A-Za-z0-9]+$/.test(invoiceId)) throw fb.httpError(400, "Missing invoice id");
    const existing = await fb.getDocument(`payments/${invoiceId}`, token);
    const student = existing?.uid ? await fb.getDocument(`users/${existing.uid}`, token) : null;
    const studentRef = student ? { id: existing.uid, ...student } : null;

    let inv, event;
    if (action === "void") { inv = await stripe("POST", `/invoices/${invoiceId}/void`, {}); event = "app.void"; }
    else if (action === "markPaid") { inv = await stripe("POST", `/invoices/${invoiceId}/pay`, { paid_out_of_band: true }); event = "app.markPaid"; }
    else if (action === "resend") { inv = await stripe("POST", `/invoices/${invoiceId}/send`, {}); event = "app.resend"; }
    else throw fb.httpError(400, "Unknown action");

    const payment = paymentFromInvoice(inv, studentRef, { lastEvent: event, ...(action === "markPaid" ? { paidOutOfBand: true } : {}) });
    await fb.updateDocument(`payments/${inv.id}`, payment, token);
    return res.status(200).json({ payment: { id: inv.id, ...payment } });
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error("invoices error:", err);
    return res.status(status).json({ error: err.message || "Something went wrong" });
  }
};
