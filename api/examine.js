const { setCors } = require("./_cors");
const { verifyFirebaseToken } = require("./_auth");

// Marking conventions agreed with HSJ Tuition. These are quoted verbatim in
// the prompt so the examiner applies the same rules as a real mark scheme.
const CONVENTIONS = `MARKING CONVENTIONS (apply all of these):
1. Error carried forward (ECF): if an earlier value is wrong but is then used correctly in a later step, award the later marks.
2. Significant figures: the final answer should be rounded appropriately, to the same number of significant figures as the least precise data given in the question, even if the question does not state this. Deduct at most one mark for rounding, and only where a mark scheme point depends on the final value.
3. Alternative wording: award a point for equivalent chemistry expressed in different words. Use the ALLOW list where given.
4. Contradictions: if a correct statement is contradicted elsewhere in the answer, award 0 for that point. Use the REJECT list where given.
5. Never award more than the marks available for a point, and never award a point twice.`;

// Students can attempt a question up to three times, with hints between attempts.
// Feedback must help them find the missing chemistry themselves, not hand it over.
const FEEDBACK_RULES = `FEEDBACK RULES (the student may attempt this question again):
- Do NOT state any missing mark scheme point, the correct value, or the answer.
- Do NOT quote or paraphrase the mark scheme.
- Say what was credited in general terms, then describe what is missing or wrong by its kind: which concept, which step of the working, what type of error (sign, units, moles, a condition not stated, a term used loosely).
- Keep to 2 or 3 sentences in exam language. The model answer is returned separately and is shown to the student only once the mark scheme is unlocked.`;

function levelsPrompt({ question, schemeLines, levelsText, studentAnswer, maxMarks }) {
  return `You are an experienced A-Level Chemistry examiner. You are marking a student's extended response using LEVELS OF RESPONSE marking (not point-by-point).

QUESTION (${maxMarks} marks):
${question}

LEVELS OF RESPONSE DESCRIPTORS:
${levelsText}

INDICATIVE CHEMISTRY CONTENT (use these points to help assign a level. Students do NOT need to cover every point, and may gain credit for valid chemistry not listed here):
${schemeLines}

STUDENT ANSWER:
---
${studentAnswer}
---

${CONVENTIONS}

MARKING INSTRUCTIONS:
1. Read the student's answer holistically.
2. Identify which indicative content points are addressed (even if worded differently).
3. Assess the overall quality: how many stages are covered, accuracy, use of technical terms, coherence and logical structure.
4. Assign the answer to a level first, then decide the mark within that level.
5. A well-structured answer with minor errors gets the higher mark in a level. A disorganised answer with some correct points gets the lower mark.
6. Write a model answer as a concise, exam-ready student response (full connected sentences, 4 to 8 sentences).
7. Write feedback following the FEEDBACK RULES below.

${FEEDBACK_RULES}

Return ONLY valid JSON (no markdown code fences, no text outside the JSON):
{
  "level": <integer 0 to 3>,
  "score": <integer 0 to ${maxMarks}>,
  "coveredPoints": [<boolean for each indicative content point listed above, in order>],
  "feedback": "<2 to 3 sentences: acknowledge what they got right, state the level assigned and why, and describe in general terms the kind of thing missing, without giving it away>",
  "modelAnswer": "<concise model student answer covering all key indicative content in full connected sentences>",
  "confidence": "<high | medium | low: how confident you are in this mark>"
}`;
}

function pointsPrompt({ question, context, schemeLines, allow, reject, studentAnswer, maxMarks }) {
  return `You are an experienced A-Level Chemistry examiner. You are marking a short-answer question POINT BY POINT against a mark scheme, exactly as in a real exam.

${context ? `CONTEXT (shared by all parts of this question):\n${context}\n\n` : ""}QUESTION (${maxMarks} marks):
${question}

MARK SCHEME (one mark per point unless stated; ${maxMarks} marks available in total):
${schemeLines}
${allow ? `\nALLOW:\n${allow}\n` : ""}${reject ? `\nREJECT:\n${reject}\n` : ""}
STUDENT ANSWER:
---
${studentAnswer}
---

${CONVENTIONS}

MARKING INSTRUCTIONS:
1. For each mark scheme point, decide whether the student's answer earns it. Be as strict as a real examiner: the chemistry must be correct and specific.
2. Total the marks earned, capped at ${maxMarks}.
3. Write feedback following the FEEDBACK RULES below.
4. Write a model answer that would earn full marks, in the concise style of a mark scheme answer.

${FEEDBACK_RULES}

Return ONLY valid JSON (no markdown code fences, no text outside the JSON):
{
  "awarded": [<boolean for each mark scheme point listed above, in order>],
  "score": <integer 0 to ${maxMarks}>,
  "feedback": "<2 to 3 sentences in examiner language, following the FEEDBACK RULES>",
  "modelAnswer": "<full-mark answer>",
  "confidence": "<high | medium | low>"
}`;
}

const defaultLevels = (maxMarks) => maxMarks <= 6
  ? `Level 3 (5-6 marks): All stages are covered and each stage is generally correct and virtually complete. Answer is well structured with accurate terminology.
Level 2 (3-4 marks): All stages are covered but may be incomplete or contain inaccuracies OR two stages are covered and are generally correct and virtually complete.
Level 1 (1-2 marks): Two stages are covered but may be incomplete OR only one stage is covered but is generally correct and virtually complete.
Level 0 (0 marks): Insufficient correct chemistry to gain a mark.`
  : `Level 3 (7-8 marks): All stages are covered and each stage is generally correct and virtually complete. Answer is well structured with accurate terminology.
Level 2 (4-6 marks): All stages are covered but may be incomplete or contain inaccuracies OR two stages are covered and are generally correct and virtually complete.
Level 1 (1-3 marks): Two stages are covered but may be incomplete OR only one stage is covered but is generally correct and virtually complete.
Level 0 (0 marks): Insufficient correct chemistry to gain a mark.`;

const toLines = (arr) => Array.isArray(arr) ? arr.map((p, i) => `${i + 1}. ${p}`).join("\n") : (arr ? String(arr) : "");

module.exports = async function handler(req, res) {
  if (setCors(req, res)) return res.status(200).end();

  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const caller = await verifyFirebaseToken(req);
    if (!caller) return res.status(401).json({ error: "Unauthorized" });

    const { mode, question, context, markScheme, allow, reject, studentAnswer, maxMarks, levels } = req.body || {};
    if (!studentAnswer || !markScheme || !question) return res.status(400).json({ error: "Missing required fields" });
    const max = Math.max(1, Math.min(20, parseInt(maxMarks, 10) || 6));

    const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

    const schemeLines = toLines(markScheme);
    const usePoints = mode === "points" || (mode !== "levels" && max <= 5);

    const prompt = usePoints
      ? pointsPrompt({ question, context, schemeLines, allow: toLines(allow), reject: toLines(reject), studentAnswer, maxMarks: max })
      : levelsPrompt({
          question, schemeLines, studentAnswer, maxMarks: max,
          levelsText: (Array.isArray(levels) && levels.length > 0)
            ? levels.map(l => `Level ${l.level} (${l.marks} marks): ${l.descriptor}`).join("\n")
            : defaultLevels(max),
        });

    let anthropicRes;
    try {
      anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, messages: [{ role: "user", content: prompt }] }),
      });
    } catch (fetchErr) {
      return res.status(502).json({ error: `Network error contacting the marking service: ${fetchErr.message}` });
    }

    if (!anthropicRes.ok) {
      let errBody = "";
      try { errBody = await anthropicRes.text(); } catch (_) { errBody = "(could not read error body)"; }
      return res.status(502).json({ error: `Marking service returned ${anthropicRes.status}. ${errBody.slice(0, 300)}` });
    }

    let anthropicData;
    try { anthropicData = await anthropicRes.json(); }
    catch (jsonErr) { return res.status(502).json({ error: `Failed to parse marking response: ${jsonErr.message}` }); }

    const raw = anthropicData.content?.[0]?.text?.trim() || "";
    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
    let result;
    try { result = JSON.parse(cleaned); }
    catch { return res.status(502).json({ error: "Could not parse AI response as JSON", raw }); }

    const n = Array.isArray(markScheme) ? markScheme.length : 0;
    result.score = Math.max(0, Math.min(max, parseInt(result.score, 10) || 0));
    if (!["high", "medium", "low"].includes(result.confidence)) result.confidence = "medium";

    if (usePoints) {
      if (!Array.isArray(result.awarded) || result.awarded.length !== n) result.awarded = Array.from({ length: n }, () => false);
      result.awarded = result.awarded.map(Boolean);
      // Never award more marks than points credited
      result.score = Math.min(result.score, result.awarded.filter(Boolean).length || result.score);
      result.coveredPoints = result.awarded;
      result.mode = "points";
    } else {
      result.level = Math.max(0, Math.min(3, parseInt(result.level, 10) || 0));
      if (!Array.isArray(result.coveredPoints) || result.coveredPoints.length !== n) result.coveredPoints = Array.from({ length: n }, () => false);
      result.mode = "levels";
    }

    return res.status(200).json(result);
  } catch (outerErr) {
    console.error("Examine error:", outerErr);
    return res.status(500).json({ error: "Internal server error" });
  }
};
