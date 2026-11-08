/**
 * HSJ Tuition terms for group lessons, shown to the parent during onboarding.
 * DRAFT written by Claude for Harj to edit before the first student is
 * onboarded. Bump TERMS_VERSION whenever the wording changes, so each
 * acceptance records which version the parent agreed to.
 *
 * Placeholders are filled from the applicant: {studentName}, {parentName},
 * {course}, {paymentPlan}.
 */

export const TERMS_VERSION = "2026-11-draft1";

export const PAYMENT_PLANS = [
  { id: "pif", label: "Paid in full" },
  { id: "x2", label: "Two instalments" },
  { id: "quarterly", label: "Quarterly" },
  { id: "monthly", label: "Monthly" },
];

export const paymentPlanLabel = (id) => (PAYMENT_PLANS.find(p => p.id === id) || {}).label || id;

export const TERMS_SECTIONS = [
  {
    title: "The agreement",
    body: [
      "This agreement is between HSJ Tuition and {parentName} (the parent or guardian) for {studentName} (the student) to join HSJ Tuition group lessons in {course}.",
      "Lessons are taught online in small groups of students studying the same exam board and year. HSJ Tuition places each student in a group and confirms the weekly lesson time by email.",
      "Lessons run weekly during term time and continue until either side ends the agreement under the notice terms below.",
    ],
  },
  {
    title: "Payment",
    body: [
      "The payment plan agreed on your call is: {paymentPlan}.",
      "Fees are payable in advance. Where a plan is paid in instalments, each instalment is due on the date shown on its invoice and a place is held only while payments are up to date.",
      "Fees cover the weekly group lesson, the homework platform, marked homework, lesson notes and progress reports.",
    ],
  },
  {
    title: "Missed lessons and cancellations",
    body: [
      "Group lessons run at the fixed weekly time whether or not every student attends. A missed group lesson is not refunded or re-taught, but the student can catch up using the lesson notes and the homework set for that week.",
      "If HSJ Tuition has to cancel a lesson, it is rescheduled or the fee for that lesson is credited.",
      "Students should join on time. Lessons are not extended for late arrivals.",
    ],
  },
  {
    title: "Homework and conduct",
    body: [
      "Homework is set after each lesson on the HSJ Tuition platform and is due before the next lesson. Completing it is part of the course, and parents can see completion and marks in their reports.",
      "Students are expected to take part respectfully. Repeated disruption may lead to the student being moved or removed from the group.",
    ],
  },
  {
    title: "Ending the agreement",
    body: [
      "Either side may end the agreement with one month's written notice (by email). Fees already paid for lessons after the notice period are refunded. Fees for lessons within the notice period are not.",
      "HSJ Tuition may end the agreement immediately where fees are overdue or the conduct terms are repeatedly broken.",
    ],
  },
  {
    title: "Communication and data",
    body: [
      "HSJ Tuition can be reached at info@hsjtuition.co.uk. Lesson notes, homework results and reports are sent to the parent by email and are available in the student's account.",
      "HSJ Tuition stores the student's and parent's names, contact details, self-evaluation and homework results to run the lessons and report progress. This information is not shared with anyone else and is deleted on request once lessons end.",
    ],
  },
];

/** Fill the placeholders in one paragraph. */
export function fillTerms(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined && vars[k] !== null && vars[k] !== "" ? vars[k] : `[${k}]`));
}
