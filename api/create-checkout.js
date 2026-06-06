// Vercel serverless function - Create Stripe Checkout session
// Uses raw fetch - no stripe SDK dependency

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    if (!secretKey) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });
    }

    const { plan, uid, email } = req.body || {};
    if (!plan || !uid || !email) {
      return res.status(400).json({ error: "Missing required fields: plan, uid, email" });
    }

    const priceConfig = plan === "yearly"
      ? { "line_items[0][price_data][unit_amount]": "24999", "line_items[0][price_data][recurring][interval]": "year" }
      : { "line_items[0][price_data][unit_amount]": "2799", "line_items[0][price_data][recurring][interval]": "month" };

    const params = new URLSearchParams({
      "mode": "subscription",
      "client_reference_id": uid,
      "customer_email": email,
      "line_items[0][price_data][currency]": "gbp",
      "line_items[0][price_data][product_data][name]": "ChemMastery Pro",
      "line_items[0][price_data][product_data][description]": plan === "yearly"
        ? "Full access to all A-Level Chemistry content - yearly"
        : "Full access to all A-Level Chemistry content - monthly",
      "line_items[0][quantity]": "1",
      "success_url": "https://fc.hsjtuition.co.uk/?payment=success",
      "cancel_url": "https://fc.hsjtuition.co.uk/?payment=cancel",
      "metadata[firebaseUid]": uid,
      "subscription_data[metadata][firebaseUid]": uid,
      ...priceConfig,
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe error:", data);
      return res.status(502).json({ error: data.error?.message || "Stripe API error" });
    }

    return res.status(200).json({ url: data.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: err.message || "Failed to create checkout session" });
  }
};
