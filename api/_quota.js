// Daily per-account caps on the endpoints that call Claude, so one student
// (or one leaked login) cannot run up the marking bill. Counters live in
// quotas/<uid>_<YYYY-MM-DD>, written only by the server; the Firestore rules
// have no match for the collection, so clients cannot read or change them.
const fb = require("./_firebaseAdmin");

// Per account, per UTC day. A homework of ten questions with three attempts
// each is thirty marks, so a heavy revision day fits comfortably.
const DAILY = { mark: 80, examine: 80 };

async function takeQuota(uid, kind, token) {
  const limit = DAILY[kind];
  if (!limit) return;
  const day = new Date().toISOString().slice(0, 10);
  const path = `quotas/${uid}_${day}`;
  const doc = await fb.getDocument(path, token);
  const used = Number((doc || {})[kind] || 0);
  if (used >= limit) {
    throw fb.httpError(429, `You have reached today's limit of ${limit} AI-marked answers. It resets at midnight (UK time is one hour ahead in summer). Your tutor can still mark your work.`);
  }
  await fb.updateDocument(path, { uid, day, [kind]: used + 1, updatedAt: new Date() }, token);
}

module.exports = { takeQuota, DAILY };
