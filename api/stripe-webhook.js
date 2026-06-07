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

// Create a Firebase Auth user (for guest checkout)
async function createFirebaseUser(email, password, accessToken) {
  const projectId = "chemmastery-3adb0";
  const url = `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      emailVerified: false,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    // User might already exist - try to find them
    if (data.error?.message?.includes("EMAIL_EXISTS") || data.error?.status === "ALREADY_EXISTS") {
      console.log(`User ${email} already exists, looking up uid`);
      // Look up existing user
      const lookupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: [email] }),
      });
      const lookupData = await lookupRes.json();
      if (lookupData.users && lookupData.users[0]) {
        return { uid: lookupData.users[0].localId, existing: true };
      }
    }
    console.error("Firebase create user error:", data);
    return null;
  }

  return { uid: data.localId, existing: false };
}

// Generate a random temporary password
function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 10; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

// Send welcome email via Resend
async function sendWelcomeEmail(email, name, tempPassword) {
  const resendKey = (process.env.RESEND_API_KEY || "").trim();
  if (!resendKey) {
    console.log("RESEND_API_KEY not set, skipping welcome email");
    return;
  }

  const firstName = name ? name.split(" ")[0] : "there";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d1b2a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:1px;">
        <span style="color:#29ABE2;">Chem</span>Mastery Pro
      </div>
      <div style="font-size:13px;color:#29ABE2;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">
        A-Level Chemistry. Mastered.
      </div>
    </div>

    <!-- Main card -->
    <div style="background:#ffffff;border-radius:16px;padding:36px 28px;box-shadow:0 8px 30px rgba(0,0,0,0.3);">

      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:40px;margin-bottom:8px;">🎉</div>
        <h1 style="font-size:24px;font-weight:800;color:#1a2d45;margin:0 0 6px;">Welcome to ChemMastery Pro!</h1>
        <p style="font-size:15px;color:#64748b;margin:0;">Hey ${firstName}, you're all set. Full access is now unlocked.</p>
      </div>

      <div style="background:#f0fdf4;border:1.5px solid #059669;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <div style="font-size:14px;font-weight:700;color:#059669;">✓ Your subscription is active</div>
        <div style="font-size:12px;color:#047857;margin-top:4px;">All premium content is now unlocked</div>
      </div>

      <!-- Login details -->
      ${tempPassword ? `
      <div style="background:#eff6ff;border:1.5px solid #29ABE2;border-radius:12px;padding:18px;margin-bottom:24px;">
        <div style="font-size:14px;font-weight:800;color:#1a2d45;margin-bottom:10px;">Your login details:</div>
        <div style="font-size:14px;color:#1a2d45;line-height:2;">
          <strong>Email:</strong> ${email}<br>
          <strong>Temporary password:</strong> <code style="background:#e0e8f0;padding:2px 8px;border-radius:4px;font-size:15px;font-weight:700;">${tempPassword}</code>
        </div>
        <div style="font-size:12px;color:#64748b;margin-top:8px;">Please change your password after your first login.</div>
      </div>
      ` : ''}

      <!-- How to access -->
      <div style="margin-bottom:24px;">
        <div style="font-size:14px;font-weight:800;color:#1a2d45;margin-bottom:12px;">How to access:</div>
        <div style="font-size:14px;color:#475569;line-height:1.8;">
          1. Go to <a href="https://fc.hsjtuition.co.uk" style="color:#29ABE2;font-weight:700;text-decoration:none;">fc.hsjtuition.co.uk</a><br>
          2. Log in with ${tempPassword ? 'the details above' : 'your email and password'}<br>
          3. Everything is unlocked. Start revising!
        </div>
      </div>

      <!-- What's included -->
      <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="font-size:13px;font-weight:800;color:#1a2d45;margin-bottom:10px;">What's inside:</div>
        <table style="width:100%;font-size:13px;color:#475569;line-height:2;">
          <tr><td>🧪</td><td style="padding-left:8px;">11 curly arrow mechanisms with handdrawn diagrams</td></tr>
          <tr><td>🎯</td><td style="padding-left:8px;">566+ exam-style MCQs (AQA & OCR A)</td></tr>
          <tr><td>📚</td><td style="padding-left:8px;">1400+ topic flashcards</td></tr>
          <tr><td>🧮</td><td style="padding-left:8px;">Step-by-step calculations</td></tr>
          <tr><td>🗺️</td><td style="padding-left:8px;">Synthesis pathway maps</td></tr>
          <tr><td>🤖</td><td style="padding-left:8px;">AI-marked extended questions</td></tr>
        </table>
      </div>

      <!-- CTA button -->
      <div style="text-align:center;">
        <a href="https://fc.hsjtuition.co.uk" style="display:inline-block;padding:14px 36px;background:#29ABE2;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;border-radius:12px;box-shadow:0 4px 12px rgba(41,171,226,0.3);">
          Start Revising →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;font-size:11px;color:#475569;line-height:1.6;">
      <div>Good luck with your exams! 💪</div>
      <div style="margin-top:12px;color:#334155;">© ${new Date().getFullYear()} HSJ Tuition. All rights reserved.</div>
      <div style="margin-top:4px;">Questions? Reply to this email.</div>
    </div>
  </div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ChemMastery <noreply@hsjtuition.co.uk>",
        to: email,
        subject: "Welcome to ChemMastery Pro! 🎉 You're all set",
        html: html,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`Welcome email sent to ${email}`, data.id);
    } else {
      console.error("Resend error:", data);
    }
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
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
        let uid = session.client_reference_id || session.metadata?.firebaseUid;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name || "";
        const isGuestCheckout = !uid || session.metadata?.guestCheckout === "true";
        let tempPassword = null;

        // Guest checkout: create Firebase account automatically
        if (isGuestCheckout && customerEmail) {
          tempPassword = generateTempPassword();
          const result = await createFirebaseUser(customerEmail, tempPassword, accessToken);
          if (result) {
            uid = result.uid;
            if (result.existing) {
              // User already exists, don't send temp password
              tempPassword = null;
              console.log(`Guest checkout: existing user ${customerEmail} (${uid})`);
            } else {
              console.log(`Guest checkout: created user ${customerEmail} (${uid})`);
            }

            // Update subscription metadata with the new uid
            if (session.subscription) {
              await fetch(`https://api.stripe.com/v1/subscriptions/${session.subscription}`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${stripeKey}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `metadata[firebaseUid]=${uid}`,
              });
            }
          } else {
            console.error(`Failed to create Firebase user for ${customerEmail}`);
          }
        }

        if (uid) {
          await updateFirestoreUser(uid, {
            role: "paid",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          }, accessToken);
          console.log(`User ${uid} upgraded to paid`);

          // Send welcome email (with temp password for guest checkouts)
          if (customerEmail) {
            await sendWelcomeEmail(customerEmail, customerName, tempPassword);
          }
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
