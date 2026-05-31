// Vercel serverless function - Stripe Customer Portal
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

    const { customerId } = req.body || {};
    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    const params = new URLSearchParams({
      customer: customerId,
      return_url: "https://fc.hsjtuition.co.uk/",
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      return res.status(502).json({ error: data.error?.message || "Stripe API error" });
    }

    return res.status(200).json({ url: data.url });
  } catch (err) {
    console.error("Portal error:", err);
    return res.status(500).json({ error: err.message || "Failed to create portal session" });
  }
};
