// Vercel serverless function — AI Examiner v2
// Uses raw fetch only — NO @anthropic-ai/sdk dependency
// v2: force cache-bust; full outer try-catch; Node version diagnostics

module.exports = async function handler(req, res) {
  // Outer safety net — catches any unexpected throw including module-level issues
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { question, markScheme, studentAnswer, maxMarks } = req.body || {};

    if (!studentAnswer || !markScheme || !question) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();

    if (!apiKey) {
      return res.status(500).json({
        error: "API key not configured — add ANTHROPIC_API_KEY in Vercel > Settings > Environment Variables then redeploy",
      });
    }

    // Verify fetch is available (Node 18+ required)
    if (typeof fetch === "undefined") {
      return res.status(500).json({
        error: "fetch is not available — this function requires Node.js 18+. Check Vercel function runtime settings.",
      });
    }

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

    let anthropicRes;
    try {
      anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20250414",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });
    } catch (fetchErr) {
      return res.status(502).json({
        error: `Network error contacting Anthropic: ${fetchErr.message}`,
      });
    }

    if (!anthropicRes.ok) {
      let errBody = "";
      try {
        errBody = await anthropicRes.text();
      } catch (_) {
        errBody = "(could not read error body)";
      }
      return res.status(502).json({
        error: `Anthropic API returned ${anthropicRes.status}. Body: ${errBody.slice(0, 300)}`,
      });
    }

    let anthropicData;
    try {
      anthropicData = await anthropicRes.json();
    } catch (jsonErr) {
      return res.status(502).json({
        error: `Failed to parse Anthropic response as JSON: ${jsonErr.message}`,
      });
    }

    const raw = anthropicData.content?.[0]?.text?.trim() || "";
    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: "Could not parse AI response as JSON", raw });
    }

    result.score = Math.max(0, Math.min(maxMarks, result.score || 0));

    if (!Array.isArray(result.coveredPoints) || result.coveredPoints.length !== markScheme.length) {
      result.coveredPoints = markScheme.map(() => false);
    }

    return res.status(200).json(result);
  } catch (outerErr) {
    // Catch-all: return the actual error so we can diagnose it
    return res.status(500).json({
      error: `Unexpected function error: ${outerErr.message || String(outerErr)}`,
      stack: outerErr.stack ? outerErr.stack.split("\n").slice(0, 5).join(" | ") : undefined,
    });
  }
};
