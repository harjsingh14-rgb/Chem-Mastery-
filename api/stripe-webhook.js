// Vercel serverless function - Stripe webhook handler
// Uses raw fetch + crypto - no external dependencies

const crypto = require("crypto");

// Disable Vercel body parsing (Stripe needs raw body for signature)
module.exports.config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verifyStripeSignature(rawBody, sigHeader, secret) {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [key, val] = part.split("=");
    acc[key.trim()] = val;
    return acc;
  }, {});
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// Get a Google access token from service account credentials
async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(serviceAccount.private_key, "base64url");

  const jwt = `${header}.${payload}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// Update a Firestore document
async function updateFirestoreUser(uid, fields, accessToken) {
  const projectId = "chemmastery-3adb0";
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=${Object.keys(fields).join("&updateMask.fieldPaths=")}`;

  const firestoreFields = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val === null) {
      firestoreFields[key] = { nullValue: null };
    } else if (typeof val === "string") {
      firestoreFields[key] = { stringValue: val };
    } else if (typeof val === "number") {
      firestoreFields[key] = { integerValue: String(val) };
    } else if (typeof val === "boolean") {
      firestoreFields[key] = { booleanValue: val };
    }
  }
  // Add server timestamp for paidAt
  if (fields.role === "paid") {
    firestoreFields.paidAt = { timestampValue: new Date().toISOString() };
  }

  await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: firestoreFields }),
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    const stripeKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    if (!webhookSecret || !stripeKey) {
      return res.status(500).json({ error: "Missing Stripe env vars" });
    }

    const rawBody = await getRawBody(req);
    const sig = req.headers["stripe-signature"];

    if (!verifyStripeSignature(rawBody.toString(), sig, webhookSecret)) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = JSON.parse(rawBody.toString());

    // Get Firebase access token
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
    const accessToken = await getAccessToken(serviceAccount);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const uid = session.client_reference_id || session.metadata?.firebaseUid;
        if (uid) {
          await updateFirestoreUser(uid, {
            role: "paid",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          }, accessToken);
          console.log(`User ${uid} upgraded to paid`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const uid = subscription.metadata?.firebaseUid;
        if (uid) {
          await updateFirestoreUser(uid, { role: "free" }, accessToken);
          console.log(`User ${uid} downgraded to free`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const uid = subscription.metadata?.firebaseUid;
        if (uid) {
          if (subscription.status === "active") {
            await updateFirestoreUser(uid, { role: "paid" }, accessToken);
          } else if (["canceled", "unpaid", "past_due"].includes(subscription.status)) {
            await updateFirestoreUser(uid, { role: "free" }, accessToken);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        if (subId) {
          // Fetch subscription to get Firebase UID
          const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
            headers: { "Authorization": `Bearer ${stripeKey}` },
          });
          const sub = await subRes.json();
          const uid = sub.metadata?.firebaseUid;
          if (uid) {
            await updateFirestoreUser(uid, { role: "free" }, accessToken);
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
