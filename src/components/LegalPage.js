import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { T, GLOBAL_CSS } from "../ui/theme";
import { Icon } from "../ui/components";

// Public privacy policy and terms of use for the ChemMastery platform
// (fc.hsjtuition.co.uk). The tuition contract itself is the Tutoring Programme
// Agreement the parent accepts during onboarding (src/data/terms.js); these
// pages cover use of the website and how it handles personal data.

const UPDATED = "14 November 2026";
const CONTACT = "info@hsjtuition.co.uk";

const PRIVACY = [
  { title: "Who we are", body: [
    "ChemMastery is the online learning platform of HSJ Tuition Limited (\"HSJ Tuition\", \"we\", \"us\"). HSJ Tuition is the data controller for the personal information held on this platform. You can contact us about anything in this policy at " + CONTACT + ".",
    "This policy covers the ChemMastery platform at fc.hsjtuition.co.uk. The HSJ Tuition marketing website has its own privacy policy.",
  ] },
  { title: "Who uses the platform", body: [
    "Accounts are created by HSJ Tuition for enrolled students, their parents or guardians, and HSJ tutors. There is no public sign-up. Most students are aged 16 to 18. A student's account is opened only after their parent or guardian has accepted the Tutoring Programme Agreement, which includes consent to the use of academic data for tracking progress.",
  ] },
  { title: "What we collect", body: [
    "Account details: name, email address, year group, exam board, the tuition group a student belongs to and, for parents, the link to their child's account.",
    "Onboarding information: the student's self-evaluation of topics taught and confidence, and the parent questionnaire about the student's school, targets and learning needs.",
    "Learning activity: answers to flashcards, multiple-choice and written questions, homework and past-paper submissions including typed answers, whiteboard drawings and photographs of handwritten work, marks and feedback, the initial diagnostic and its report, error log entries, and when the student was last active.",
    "Lesson records: attendance, lesson notes written by the tutor and the lesson schedule.",
    "Payments: invoices and payment status. Card details are entered directly with Stripe and never reach our systems.",
    "Technical information: the data needed to keep you signed in and to serve the site securely, such as your IP address in server logs.",
  ] },
  { title: "How we use it", body: [
    "To run the tuition programme: set and mark homework, track progress by topic, write reports, keep attendance and lesson notes, and share progress with parents.",
    "To mark work and draft feedback with the help of an AI model. Answers, including photographs of handwritten work, are sent to Anthropic's Claude for marking. A tutor reviews AI-marked work and feedback before a report is sent. Anthropic does not use data sent through its API to train its models.",
    "To send service emails: welcome details, homework reminders, lesson reminders, diagnostic reports and messages from your tutor.",
    "To invoice for tuition and record payments.",
    "To keep the service secure and fix faults.",
    "The lawful bases are the contract with the parent or guardian, our legitimate interest in running and improving the programme, and, where required, consent.",
  ] },
  { title: "Who we share it with", body: [
    "Service providers that process data on our instructions: Google Firebase (authentication, database and file storage), Vercel (hosting), Resend (email delivery), Stripe (invoicing and payments) and Anthropic (AI marking). Some of these providers process data outside the UK under standard contractual clauses or an adequacy decision.",
    "Your tutor and HSJ Tuition staff, who see the students they teach. Parents see their own child's progress, homework and lesson notes.",
    "We do not sell personal information or share it with advertisers. We may disclose information where the law requires it or to protect the safety of a student.",
  ] },
  { title: "Cookies and analytics", body: [
    "The platform uses only the storage a signed-in session needs: Firebase keeps you logged in, and the browser remembers choices such as your exam board. We do not run advertising or analytics cookies on the platform.",
  ] },
  { title: "How long we keep it", body: [
    "Account and learning data is kept while the student is enrolled and for up to two years afterwards so that returning students keep their history and so we can answer any questions about results. Invoices are kept for six years as the law requires. We delete an account sooner on request unless we need to keep a record for legal reasons.",
  ] },
  { title: "Your rights", body: [
    "You can ask for a copy of the personal information we hold, ask us to correct it, ask us to delete it, object to or restrict how we use it, and withdraw consent where we rely on it. Students aged 16 or over can exercise these rights themselves; parents can act for younger students. Email " + CONTACT + " and we will respond within one month.",
    "If you are unhappy with how we handle your information you can complain to the Information Commissioner's Office at ico.org.uk.",
  ] },
  { title: "Security", body: [
    "Data is encrypted in transit and at rest by our providers. Access is limited to the student, their parent or guardian, their tutor and HSJ Tuition staff, and is enforced by per-account database rules. No online system is completely secure, and we will tell you and the ICO about any breach that puts your rights at risk.",
  ] },
  { title: "Changes", body: [
    "We will post any changes to this policy here and tell parents by email if the changes are significant.",
  ] },
];

const TERMS = [
  { title: "About these terms", body: [
    "These terms cover use of the ChemMastery platform at fc.hsjtuition.co.uk, run by HSJ Tuition Limited. The tuition itself, including fees, attendance and cancellations, is governed by the Tutoring Programme Agreement accepted by the parent or guardian when a student joins. If the two conflict, the Tutoring Programme Agreement applies to the tuition and these terms apply to the website.",
  ] },
  { title: "Accounts", body: [
    "Accounts are created by HSJ Tuition for enrolled students, their parents or guardians, and tutors. Keep your password private and tell us straight away if you think someone else has used your account. An account is personal and must not be shared.",
    "A student's account is closed when they leave the programme. We may suspend an account that is being misused.",
  ] },
  { title: "Using the platform", body: [
    "The platform is for the personal revision and homework of enrolled students and for parents to follow their child's progress. You must not copy, redistribute or sell the questions, flashcards, mark schemes, videos, diagrams or any other material on it, attempt to gain access to another person's account or data, or interfere with how the site works.",
    "Work you submit, such as answers, drawings and photographs, stays yours. You give HSJ Tuition permission to store it, mark it, including with an AI marking service, and use it to track progress and improve teaching, as set out in the Privacy Policy.",
  ] },
  { title: "Marking and feedback", body: [
    "Homework and past-paper answers are first marked by an AI model and may contain mistakes. Marks can be adjusted by your tutor, and you can query a mark in the app. Diagnostic reports are reviewed by a tutor before they are sent. Marks and predicted grades on the platform are a guide to progress, not a guarantee of exam results.",
  ] },
  { title: "Exam boards", body: [
    "ChemMastery is an independent revision tool and is not affiliated with, endorsed by or connected to AQA, OCR, Pearson Edexcel or any other awarding body. Exam board names and specification references are used for identification only. Past-paper questions remain the copyright of the awarding body that set them and are provided for the private study of enrolled students.",
  ] },
  { title: "Availability", body: [
    "We aim to keep the platform available at all times but it may be interrupted for maintenance or by faults outside our control. We will restore it as quickly as we can. We are not liable for loss caused by the platform being unavailable or by errors in its content, except where the law does not allow us to limit liability.",
  ] },
  { title: "Changes and contact", body: [
    "We may update these terms and will post the new version here. Continued use after a change means you accept it. Questions about these terms can be sent to " + CONTACT + ".",
    "These terms are governed by the law of England and Wales.",
  ] },
];

export default function LegalPage({ kind }) {
  const privacy = kind === "privacy";
  const title = privacy ? "Privacy Policy" : "Terms of Use";
  const sections = privacy ? PRIVACY : TERMS;
  useEffect(() => { const prev = document.title; document.title = `${title} | ChemMastery`; window.scrollTo(0, 0); return () => { document.title = prev; }; }, [title]);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: T.font, fontSize: 14, lineHeight: 1.5 }}>
      <style>{GLOBAL_CSS}</style>
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 12, minHeight: 62 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: T.ink }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/hsj-logo.png" alt="" style={{ height: 28, objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 16, color: T.navy }}>HSJ Tuition</span>
            <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>ChemMastery</span>
          </div>
        </Link>
        <div style={{ flex: 1 }} />
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.body, textDecoration: "none", fontWeight: 600, fontSize: 13 }}><Icon name="arrowLeft" size={14} /> Back</Link>
      </header>
      <main className="cm-page" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>ChemMastery platform</div>
        <h1 style={{ fontFamily: T.display, fontSize: 30, fontWeight: 800, color: T.navy, margin: "0 0 6px", letterSpacing: -0.4 }}>{title}</h1>
        <div style={{ color: T.muted, fontSize: 13, marginBottom: 24 }}>Last updated {UPDATED}</div>
        {sections.map((sec, i) => (
          <section key={sec.title} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 20, marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 999, background: T.soft, color: T.navy, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              {sec.title}
            </h2>
            {sec.body.map((p, j) => <p key={j} style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.65, color: T.body }}>{p}</p>)}
          </section>
        ))}
        <div style={{ color: T.muted, fontSize: 13, marginTop: 20 }}>
          See also the <Link to={privacy ? "/terms" : "/privacy"} style={{ color: T.accentText, fontWeight: 600 }}>{privacy ? "Terms of Use" : "Privacy Policy"}</Link>. Questions: <a href={`mailto:${CONTACT}`} style={{ color: T.accentText, fontWeight: 600 }}>{CONTACT}</a>.
        </div>
      </main>
    </div>
  );
}
