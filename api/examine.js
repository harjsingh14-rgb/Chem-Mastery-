// Vercel serverless function — AI Examiner
// Called by the React app at POST /api/examine
// Requires ANTHROPIC_API_KEY environment variable in Vercel dashboard

const Anthropic = require("@anthropic-ai/sdk");

module.exports = async function handler(req, res) {
  // Outer catch-all — nothing should escape unhandled
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { question, markScheme, studentAnswer, maxMarks } = req.body || {};

    if (!studentAnswer || !markScheme || !question) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    if (!apiKey.startsWith("sk-ant-")) {
      return res.status(500).json({ error: "API key format invalid — re-paste from Anthropic console in Vercel env vars" });
    }

    const client = new Anthropic({ apiKey });

    const schemeLines = Array.isArray(markScheme)
      ? markScheme.map((point, i) => `${i + 1}. ${point}`).join("\n")
      : String(markScheme);

    const prompt = `You are an experienced A-Level Chemistry examiner marking a student's extended response.

QUESTION (${maxMarks} marks):
${question}

MARK SCHEME (award 1 mark per point — ignore any examiner-only penalty/credit notes, focus only on the chemistry content):
${schemeLines}

STUDENT ANSWER:
---
${studentAnswer}
---

INSTRUCTIONS:
- Assess each mark scheme point independently — did the student's answer cover the chemistry content of that point, even if worded differently?
- Be fair but strict: partial mentions do not earn the mark.
- Write the model answer as a concise, exam-ready student response (not bullet points — full connected sentences, 4–8 sentences).
- Keep the feedback brief and constructive: 2–3 sentences max.

Return ONLY valid JSON (no markdown code fences, no text outside the JSON):
{
  "score": <integer 0 to ${maxMarks}>,
  "coveredPoints": [<boolean for each mark scheme point, in order>],
  "feedback": "<2-3 sentences: acknowledge what they got right, identify the single most important thing they missed>",
  "modelAnswer": "<concise model student answer covering all mark scheme points in full connected sentences>"
}`;

    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].text.trim();

    // Strip markdown code fences if the model wraps in ```json...```
    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: "Could not parse AI response", raw });
    }

    // Clamp score to valid range
    result.score = Math.max(0, Math.min(maxMarks, result.score || 0));

    // Ensure coveredPoints array matches mark scheme length
    if (!Array.isArray(result.coveredPoints) || result.coveredPoints.length !== markScheme.length) {
      result.coveredPoints = markScheme.map(() => false);
    }

    return res.status(200).json(result);

  } catch (err) {
    // Catch-all — return the real error so we can diagnose it
    console.error("examine.js unhandled error:", err);
    return res.status(500).json({
      error: `Examiner error: ${err.message}`,
      errorName: err.name,
      errorType: err.constructor?.name,
    });
  }
};
