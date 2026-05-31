// Vercel serverless function - Stripe webhook handler
// Updates Firestore user role on payment events

// Disable Vercel's automatic body parsing (Stripe needs raw body for signature)
module.exports.config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Lazy-init Firebase Admin (cold start friendly)
let adminDb = null;
function getFirestoreDb() {
  if (adminDb) return adminDb;
  const admin = require("firebase-admin");
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  adminDb = admin.firestore();
  return adminDb;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const rawBody = await getRawBody(req);
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const db = getFirestoreDb();
    const admin = require("firebase-admin");

    switch (event.type) {
      // Payment successful - activate subscription
      case "checkout.session.completed": {
        const session = event.data.object;
        const uid = session.client_reference_id || session.metadata?.firebaseUid;
        if (uid) {
          await db.collection("users").doc(uid).update({
            role: "paid",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`User ${uid} upgraded to paid`);
        }
        break;
      }

      // Subscription cancelled or expired
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const uid = subscription.metadata?.firebaseUid;
        if (uid) {
          await db.collection("users").doc(uid).update({
            role: "free",
            stripeSubscriptionId: null,
          });
          console.log(`User ${uid} downgraded to free (subscription deleted)`);
        }
        break;
      }

      // Subscription status changed (renewal failed, reactivated, etc.)
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const uid = subscription.metadata?.firebaseUid;
        if (uid) {
          if (subscription.status === "active") {
            await db.collection("users").doc(uid).update({ role: "paid" });
          } else if (
            subscription.status === "canceled" ||
            subscription.status === "unpaid" ||
            subscription.status === "past_due"
          ) {
            await db.collection("users").doc(uid).update({ role: "free" });
          }
        }
        break;
      }

      // Payment failed on renewal
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        if (subId) {
          // Retrieve subscription to get Firebase UID
          const sub = await stripe.subscriptions.retrieve(subId);
          const uid = sub.metadata?.firebaseUid;
          if (uid) {
            await db.collection("users").doc(uid).update({ role: "free" });
            console.log(`User ${uid} downgraded (payment failed)`);
          }
        }
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
};
