// The parent questionnaire asked on the agreement link (after the parent has
// accepted the terms). Keep the ids in step with src/data/parent-questionnaire.js,
// which renders the same questions on the page and on the student's profile.
const GRADES = ["A*", "A", "B", "C", "D", "E", "U", "Not yet assessed"];

const SECTIONS = [
  { id: "start", title: "Starting point", questions: [
    { id: "currentGrade", label: "What grade are they currently achieving?", type: "select", options: GRADES },
    { id: "targetGrade", label: "What grade are they aiming for?", type: "select", options: GRADES.slice(0, 6) },
    { id: "hardestTopics", label: "Which topics do they find the hardest right now?", type: "text" },
    { id: "feeling", label: "How do they feel about chemistry?", type: "text" },
    { id: "hoursPerWeek", label: "How many hours per week do they spend revising outside of school?", type: "select",
      options: ["Less than 1 hour", "1 to 2 hours", "3 to 5 hours", "6 to 10 hours", "More than 10 hours"] },
  ] },
  { id: "why", title: "Why now?", questions: [
    { id: "whyNow", label: "What made you start looking for chemistry support?", type: "text" },
    { id: "howLong", label: "How long have you felt your child has needed extra support with chemistry?", type: "select",
      options: ["A few weeks", "A few months", "Most of this school year", "Since GCSE", "Longer than that"] },
    { id: "triedBefore", label: "Have you tried anything else before finding us? If yes, what worked and what did not?", type: "text" },
  ] },
  { id: "expect", title: "Expectations", questions: [
    { id: "outcome", label: "What is the single most important outcome you want from this course?", type: "text" },
    { id: "success12", label: "What would a successful outcome look like for you and your child in 12 weeks?", type: "text" },
    { id: "worthIt", label: "What would make you feel this was 100% worth the investment?", type: "text" },
    { id: "beyondGrades", label: "Is there anything beyond grades you are hoping this course gives your child?", type: "text" },
  ] },
  { id: "discovery", title: "Discovery", questions: [
    { id: "heardFrom", label: "Where did you first hear about us?", type: "select",
      options: ["Instagram", "TikTok", "Facebook", "YouTube", "Google search", "Recommendation from a friend or family", "School", "Other"] },
    { id: "timeToDecide", label: "How long did it take you to decide to sign up after first finding us?", type: "select",
      options: ["The same day", "Within a week", "Within a month", "Longer than a month"] },
    { id: "reasons", label: "What made you decide to go ahead? (Select all that apply)", type: "multi", optional: true,
      options: ["The reviews from other students", "The tutor's knowledge and credentials", "The way content was explained", "The price felt fair", "Recommendation by a friend", "My child was involved in the decision"] },
    { id: "pushedOver", label: "Can you elaborate on what pushed you over the line? This really helps us, so be as honest as possible.", type: "text" },
    { id: "hesitations", label: "What were your biggest hesitations before joining?", type: "text" },
    { id: "sooner", label: "What could have made you sign up sooner?", type: "text" },
  ] },
];

const QUESTIONS = SECTIONS.flatMap(s => s.questions);

/** Validated answers keyed by question id, or a 400-style message. */
function validateAnswers(body) {
  const out = {};
  const missing = [];
  for (const q of QUESTIONS) {
    const v = body[q.id];
    if (q.type === "multi") {
      const list = Array.isArray(v) ? v.map(x => String(x).trim()).filter(x => q.options.includes(x)) : [];
      if (list.length) out[q.id] = list.slice(0, q.options.length);
      else if (!q.optional) missing.push(q.label);
      continue;
    }
    const s = String(v ?? "").trim().slice(0, q.type === "select" ? 80 : 2000);
    if (!s) { if (!q.optional) missing.push(q.label); continue; }
    if (q.type === "select" && !q.options.includes(s)) missing.push(q.label);
    else out[q.id] = s;
  }
  return { answers: out, missing };
}

module.exports = { SECTIONS, QUESTIONS, validateAnswers };
