// Vercel serverless function — AI Examiner v3
// Levels-of-response marking using Claude Sonnet
// Uses raw fetch only — NO @anthropic-ai/sdk dependency

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { question, markScheme, studentAnswer, maxMarks, levels } = req.body || {};

    if (!studentAnswer || !markScheme || !question) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();

    if (!apiKey) {
      return res.status(500).json({
        error: "API key not configured - add ANTHROPIC_API_KEY in Vercel > Settings > Environment Variables then redeploy",
      });
    }

    if (typeof fetch === "undefined") {
      return res.status(500).json({
        error: "fetch is not available - this function requires Node.js 18+.",
      });
    }

    const schemeLines = Array.isArray(markScheme)
      ? markScheme.map((point, i) => `${i + 1}. ${point}`).join("\n")
      : String(markScheme);

    // Build levels descriptor text
    let levelsText = "";
    if (levels && Array.isArray(levels) && levels.length > 0) {
      levelsText = levels.map(l =>
        `Level ${l.level} (${l.marks} marks): ${l.descriptor}`
      ).join("\n");
    } else {
      // Default generic AQA levels-of-response descriptors
      if (maxMarks <= 6) {
        levelsText = `Level 3 (5-6 marks): All stages are covered and each stage is generally correct and virtually complete. Answer is well structured with accurate terminology.
Level 2 (3-4 marks): All stages are covered but may be incomplete or contain inaccuracies OR two stages are covered and are generally correct and virtually complete.
Level 1 (1-2 marks): Two stages are covered but may be incomplete OR only one stage is covered but is generally correct and virtually complete.
Level 0 (0 marks): Insufficient correct chemistry to gain a mark.`;
      } else {
        levelsText = `Level 3 (7-8 marks): All stages are covered and each stage is generally correct and virtually complete. Answer is well structured with accurate terminology.
Level 2 (4-6 marks): All stages are covered but may be incomplete or contain inaccuracies OR two stages are covered and are generally correct and virtually complete.
Level 1 (1-3 marks): Two stages are covered but may be incomplete OR only one stage is covered but is generally correct and virtually complete.
Level 0 (0 marks): Insufficient correct chemistry to gain a mark.`;
      }
    }

    const prompt = `You are an experienced A-Level Chemistry examiner. You are marking a student's extended response using LEVELS OF RESPONSE marking (not point-by-point).

QUESTION (${maxMarks} marks):
${question}

LEVELS OF RESPONSE DESCRIPTORS:
${levelsText}

INDICATIVE CHEMISTRY CONTENT (use these points to help assign a level - students do NOT need to cover every point, and may gain credit for valid chemistry not listed here):
${schemeLines}

STUDENT ANSWER:
---
${studentAnswer}
---

MARKING INSTRUCTIONS:
1. Read the student's answer holistically.
2. Identify which indicative content points are addressed (even if worded differently).
3. Assess the overall quality: how many stages/aspects are covered, accuracy, use of technical terms, coherence and logical structure.
4. Assign the answer to a level first, then decide the mark within that level.
5. A well-structured answer with minor errors gets the higher mark in a level. A disorganised answer with some correct points gets the lower mark.
6. Write a model answer as a concise, exam-ready student response (full connected sentences, 4-8 sentences).
7. Keep feedback constructive: 2-3 sentences max.

Return ONLY valid JSON (no markdown code fences, no text outside the JSON):
{
  "level": <integer 0 to 3>,
  "score": <integer 0 to ${maxMarks}>,
  "coveredPoints": [<boolean for each indicative content point listed above, in order>],
  "feedback": "<2-3 sentences: acknowledge what they got right, state the level assigned and why, identify the most important thing they missed or could improve>",
  "modelAnswer": "<concise model student answer covering all key indicative content in full connected sentences>"
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
          model: "claude-sonnet-4-20250514",
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
    result.level = Math.max(0, Math.min(3, result.level || 0));

    if (!Array.isArray(result.coveredPoints) || result.coveredPoints.length !== markScheme.length) {
      result.coveredPoints = markScheme.map(() => false);
    }

    return res.status(200).json(result);
  } catch (outerErr) {
    return res.status(500).json({
      error: `Unexpected function error: ${outerErr.message || String(outerErr)}`,
      stack: outerErr.stack ? outerErr.stack.split("\n").slice(0, 5).join(" | ") : undefined,
    });
  }
};
