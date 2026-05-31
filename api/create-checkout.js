// Vercel serverless function - Create Stripe Checkout session
// Supports monthly (4.99) and yearly (43.99) subscriptions

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { plan, uid, email } = req.body || {};

    if (!plan || !uid || !email) {
      return res.status(400).json({ error: "Missing required fields: plan, uid, email" });
    }

    if (plan !== "monthly" && plan !== "yearly") {
      return res.status(400).json({ error: "Plan must be 'monthly' or 'yearly'" });
    }

    const priceConfig = plan === "yearly"
      ? { unit_amount: 4399, recurring: { interval: "year" } }
      : { unit_amount: 499, recurring: { interval: "month" } };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id: uid,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "ChemMastery Pro",
              description: plan === "yearly"
                ? "Full access to all A-Level Chemistry content - yearly"
                : "Full access to all A-Level Chemistry content - monthly",
            },
            ...priceConfig,
          },
          quantity: 1,
        },
      ],
      success_url: "https://fc.hsjtuition.co.uk/?payment=success",
      cancel_url: "https://fc.hsjtuition.co.uk/?payment=cancel",
      metadata: { firebaseUid: uid },
      subscription_data: {
        metadata: { firebaseUid: uid },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: err.message || "Failed to create checkout session" });
  }
};
