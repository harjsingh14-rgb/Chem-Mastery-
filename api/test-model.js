// Temporary endpoint to test which model names work with this API key
module.exports = async function handler(req, res) {
  const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey) return res.status(500).json({ error: "No API key" });

  const model = (req.query.model || "claude-haiku-4-5-20250414").trim();

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 5,
        messages: [{ role: "user", content: "Say OK" }],
      }),
    });
    const body = await r.text();
    return res.status(200).json({ model, status: r.status, body: body.slice(0, 300) });
  } catch (e) {
    return res.status(500).json({ model, error: e.message });
  }
};
