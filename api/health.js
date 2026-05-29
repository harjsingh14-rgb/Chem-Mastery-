// Simple health check to verify which code version is deployed
module.exports = function handler(req, res) {
  res.status(200).json({
    version: "v2-2026-05-29",
    node: process.version,
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    keyPrefix: (process.env.ANTHROPIC_API_KEY || "").slice(0, 7),
    timestamp: new Date().toISOString(),
  });
};
