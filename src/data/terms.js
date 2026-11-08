/**
 * HSJ Tuition "A Level Chemistry Tutoring Agreement", the template Harj has
 * been sending through GrowthPilot, rebuilt so the parent accepts it online
 * during onboarding. Fixed clauses are verbatim from the signed agreements of
 * October and November 2026; the variable parts come from the applicant.
 *
 * Bump TERMS_VERSION whenever the wording changes, so each acceptance records
 * which version the parent agreed to.
 */

export const TERMS_VERSION = "2026-11-agreement-v1";

export const PAYMENT_PLANS = [
  { id: "pif", label: "Paid in full" },
  { id: "instalments", label: "Instalments" },
  { id: "results", label: "Results-based instalments" },
];
export const paymentPlanLabel = (id) => (PAYMENT_PLANS.find(p => p.id === id) || {}).label || id;

export const GRADES = ["A*", "A", "B", "C", "D", "E", "U", "Not yet assessed"];
// A programme runs to the student's final A Level exam series: Year 13 sits in
// June 2027, Year 12 in June 2028. The exact last exam date is filled in once
// the boards publish the timetable, so the default names the series.
export const programmeEndFor = (year) => `the end of the June ${Number(year) === 12 ? 2028 : 2027} A Level examination series`;
export const DEFAULT_PROGRAMME_END = programmeEndFor(13);
export const DEFAULT_GROUP_SIZE = 6;

export const money = (n) => (n === null || n === undefined || n === "" || Number.isNaN(Number(n))) ? "" : `£${Number(n).toLocaleString("en-GB")}`;

export function fmtLongDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Special clause token: the TermsForm renders the payment schedule table here. */
export const SCHEDULE_TOKEN = "__SCHEDULE__";

/**
 * Build the agreement for one applicant.
 * vars: { parentName, studentName, agreementDate, subject, level, startDate, programmeEnd,
 *         groupSize, totalFee, paymentPlan, schedule: [{amount, due}], initialGrade, extraTerms }
 * Returns [{ n, title, clauses: [string | SCHEDULE_TOKEN] }]. Clauses starting "- " are list items.
 */
export function buildAgreement(v) {
  const fee = money(v.totalFee) || "[fee]";
  const plan = paymentPlanLabel(v.paymentPlan);
  const collection = v.paymentPlan === "pif"
    ? "(a) The full programme fee is payable on signing, before tuition begins."
    : "(a) Payments will be collected via the payment method provided at enrolment, on the dates above.";

  const sections = [
    { n: 1, title: "Scope of Services", clauses: [
      `1.1 HSJ Tuition agrees to provide academic tutoring services to the enrolled student as part of a structured tutoring programme.`,
      `1.2 Programme Subject(s): ${v.subject}`,
      `1.3 Qualification Level: ${v.level}`,
      `1.4 Tutoring is delivered as part of a structured small-group programme, with students placed into a fixed group.`,
      `1.5 Sessions are delivered online via Zoom, with resources, homework and progress tracking on the HSJ Tuition platform (fc.hsjtuition.co.uk).`,
      `1.6 The programme includes:`,
      `- Scheduled weekly group teaching sessions`,
      `- Set homework and independent study tasks`,
      `- Progress tracking and feedback`,
      `- Mock exams and assessments`,
    ] },
    { n: 2, title: "Programme Structure", clauses: [
      `2.1 The programme consists of scheduled group tutoring sessions delivered as part of a structured timetable.`,
      `2.2 Sessions are delivered at a frequency of 1 weekly lesson, each lasting 2 hours.`,
      `2.3 Programme Start Date: ${fmtLongDate(v.startDate) || "[start date]"}`,
      `2.4 Programme Duration: until ${v.programmeEnd || DEFAULT_PROGRAMME_END}`,
      `2.5 Students are enrolled into a fixed timetable, which is agreed at the point of enrolment.`,
      `2.6 Sessions are delivered in small groups (typically up to ${v.groupSize || DEFAULT_GROUP_SIZE} students) to maximise engagement and progress.`,
      `2.7 Missed sessions are not rescheduled, as all sessions follow a fixed group timetable.`,
    ] },
    { n: 3, title: "Attendance Requirement", clauses: [
      `3.1 Attendance at all scheduled sessions is mandatory.`,
      `3.2 To remain eligible for any results-based commitment or guarantee, the student must maintain a minimum of 90% attendance across all scheduled sessions.`,
      `3.3 The following apply:`,
      `- (a) All sessions form part of a fixed group timetable and cannot be rescheduled`,
      `- (b) Missed sessions are non-refundable and non-transferable`,
      `- (c) No-shows are charged in full`,
      `- (d) Sessions cancelled with less than 24 hours' notice are charged in full`,
      `- (e) Late arrival does not extend session time`,
      `3.4 Failure to meet attendance requirements will void any results-based guarantee.`,
      `3.5 Sessions missed due to university interviews or official school trips will be treated as authorised absences and excluded from the 90% attendance calculation in clause 3.2, provided the Client gives at least 48 hours' notice where possible and provides evidence if requested. Authorised absences do not entitle the Student to a rescheduled session, but resources from the missed session will be provided.`,
    ] },
    { n: 4, title: "Student Responsibilities", clauses: [
      `4.1 To maximise progress and remain eligible for any results-based commitment, the student agrees to:`,
      `- (a) Complete all assigned homework and independent study tasks on time`,
      `- (b) Actively participate and engage during all sessions`,
      `- (c) Apply feedback, exam techniques, and strategies provided`,
      `- (d) Attend and complete all required assessments, mock exams, and progress checks`,
      `4.2 The student acknowledges that results are dependent on consistent effort both inside and outside of sessions.`,
      `4.3 Failure to meet the above responsibilities:`,
      `- Voids any results-based guarantee`,
      `- Does not remove the obligation to complete full payment for the programme`,
    ] },
    { n: 5, title: "Fees and Payment", clauses: [
      `5.1 Total Programme Fee: ${fee}`,
      `5.2 Selected Payment Option: the Client has selected the following payment method at enrolment: ${plan}`,
      `5.3 By enrolling, the Client authorises HSJ Tuition to collect payments in accordance with the selected payment option.`,
      `5.4 The payment is due as follows:`,
      SCHEDULE_TOKEN,
      collection,
      `5.5 Instalment plans are provided as a payment convenience only and do not represent a pay-per-session arrangement.`,
      `5.6 The Client remains liable for the full programme fee, regardless of attendance, withdrawal, or completion.`,
      `5.7 Failed or missed payments may result in:`,
      `- Immediate suspension of sessions`,
      `- Removal from the programme until payments are brought up to date`,
      `5.8 Continued non-payment may result in termination of services, with the remaining balance still payable in full.`,
      `5.9 All fees are non-refundable once the programme has commenced.`,
    ] },
    { n: 6, title: "Refund Policy", clauses: [
      `6.1 Once the programme has commenced, all fees are non-refundable, regardless of payment option, except where required by law.`,
      `6.2 Early withdrawal, missed sessions, or lack of engagement do not entitle the Client to refunds or fee reductions.`,
    ] },
    { n: 7, title: "Results Commitment", clauses: [
      `7.1 Initial Assessed Grade: ${v.initialGrade || "Not yet assessed"}`,
      `7.2 HSJ Tuition offers a results-based commitment. A student who:`,
      `- (a) Completes the full programme`,
      `- (b) Maintains a minimum of 90% attendance`,
      `- (c) Completes all assigned work and assessments`,
      `- (d) Actively applies feedback and strategies provided`,
      `will achieve a minimum improvement of two grades, measured between an initial diagnostic assessment and a subsequent formal assessment.`,
      `7.3 If this improvement is not achieved despite full compliance, HSJ Tuition will continue to provide support at no additional cost until the improvement is met.`,
      `7.4 This commitment is conditional upon full compliance with Sections 3 and 4.`,
      `7.5 The results commitment applies to internal assessments and predicted grade improvements and does not guarantee specific final examination outcomes.`,
    ] },
    { n: 8, title: "Tutor Cancellations", clauses: [
      `8.1 If HSJ Tuition must cancel or reschedule a session, reasonable notice will be provided where possible.`,
      `8.2 Any cancelled sessions will be:`,
      `- Rescheduled, or`,
      `- Delivered at an alternative time, or`,
      `- Covered via additional support or resources`,
      `8.3 Tutor cancellations do not entitle the Client to refunds.`,
    ] },
    { n: 9, title: "Behaviour and Termination", clauses: [
      `9.1 HSJ Tuition reserves the right to suspend or terminate a student's participation in the programme immediately in cases of:`,
      `- (a) Disruptive or inappropriate behaviour`,
      `- (b) Repeated non-attendance or lack of engagement`,
      `- (c) Non-payment of fees`,
      `- (d) Breach of this Agreement`,
      `9.2 In such cases, no refunds will be issued and any outstanding balance remains payable.`,
    ] },
    { n: 10, title: "Cooling-Off Period", clauses: [
      `10.1 Clients enrolling online are entitled to a 14-day cooling-off period in accordance with UK consumer regulations.`,
      `10.2 If the Client chooses to begin the programme within the cooling-off period, they acknowledge that services have commenced and agree that any delivered sessions are chargeable and non-refundable.`,
    ] },
    { n: 11, title: "Confidentiality and Data", clauses: [
      `11.1 All personal and academic information is handled confidentially and in accordance with UK data protection regulations.`,
      `11.2 Sessions may be recorded for safeguarding or quality assurance purposes.`,
      `11.3 By enrolling, the Client consents to the use of relevant academic data for tracking progress and improving programme delivery.`,
    ] },
    { n: 12, title: "Communication", clauses: [
      `12.1 HSJ Tuition Contact Details: Email: info@hsjtuition.co.uk. Phone: 07920 178412`,
    ] },
    { n: 13, title: "Client Confirmations", clauses: [
      `By accepting this Agreement, the Client confirms that they understand and agree:`,
      `13.1 The programme operates on a fixed group timetable and sessions cannot be rescheduled`,
      `13.2 Attendance and participation requirements are mandatory`,
      `13.3 The results commitment is conditional upon full compliance`,
      `13.4 The selected payment structure represents a commitment to the full programme fee`,
      `13.5 Fees are non-refundable once the programme has commenced`,
      `13.6 The Client acknowledges that enrolment secures a limited place within a structured programme and is not a pay-per-session service.`,
    ] },
  ];
  if (v.extraTerms && v.extraTerms.trim()) {
    sections.push({ n: 14, title: "Additional Terms", clauses: [
      `14.1 The following additional terms were agreed at enrolment. Where they conflict with Sections 5 or 7, these additional terms apply.`,
      ...v.extraTerms.trim().split(/\n+/).map(l => l.trim()).filter(Boolean),
    ] });
  }
  return sections;
}

export function agreementPreamble(v) {
  return [
    `This Tutoring Programme Agreement ("Agreement") is made between HSJ Tuition, operated by Harjinder Singh ("HSJ Tuition", "we", "us"), and ${v.parentName || "[parent]"} ("Client", "you"), parent/guardian of ${v.studentName || "[student]"} ("Student").`,
    `This Agreement is entered into on ${v.agreementDate || "[date]"}, following confirmation of enrolment onto the ChemMastery Framework programme.`,
  ];
}
