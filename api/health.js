// Simple health check to verify which code version is deployed
module.exports = function handler(req, res) {
  res.status(200).json({
    version: "v3-levels-2026-05-30",
    node: process.version,
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString(),
  });
};
