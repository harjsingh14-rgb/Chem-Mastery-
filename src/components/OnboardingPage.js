// Public onboarding steps reached from emailed links (no login):
//   /onboarding/<evalToken>   the student's adaptive self-evaluation
//   /onboarding/<termsToken>  the parent's terms acceptance
import React, { useState, useEffect, useMemo } from "react";
import { T, FONT_LINK, GLOBAL_CSS } from "../ui/theme";
import { Button, Input, Notice, Chip } from "../ui/components";
import { SELF_EVALUATION, RAG, COVERED } from "../data/self-evaluation";
import { TERMS_SECTIONS, TERMS_VERSION, fillTerms, paymentPlanLabel } from "../data/terms";

async function api(method, token, body) {
  const res = await fetch(method === "GET" ? `/api/onboarding?token=${encodeURIComponent(token)}` : "/api/onboarding", {
    method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify({ token, ...body }) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export default function OnboardingPage({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api("GET", token).then(d => { if (!cancelled) setData(d); }).catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.ink }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <img src="/hsj-logo.png" alt="" style={{ height: 36, objectFit: "contain" }} />
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20 }}><span style={{ color: T.accent }}>HSJ</span> Tuition</div>
        </div>
        {error && <Notice tone="red">{error}</Notice>}
        {!error && !data && <div style={{ color: T.muted, fontSize: 14 }}>Loading…</div>}
        {data && data.kind === "evaluation" && <EvaluationForm token={token} data={data} />}
        {data && data.kind === "terms" && <TermsForm token={token} data={data} />}
      </div>
    </div>
  );
}

const label = { fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 };
const cardStyle = { background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 20, marginBottom: 14 };

function Seg({ options, value, onChange, tone, disabled }) {
  return (
    <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
      {options.map(o => {
        const on = value === o.id;
        const colour = tone ? tone(o.id) : null;
        return (
          <button key={o.id} type="button" disabled={disabled} onClick={() => onChange(o.id)} title={o.help}
            style={{
              padding: "6px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: disabled ? "default" : "pointer",
              border: `1px solid ${on ? (colour?.fg || T.accentText) : T.border}`,
              background: on ? (colour?.bg || T.accentTint) : T.card, color: on ? (colour?.fg || T.accentText) : T.body,
              opacity: disabled ? 0.45 : 1,
            }}>{o.label}</button>
        );
      })}
    </div>
  );
}

const ragTone = (id) => id === "red" ? { fg: T.red, bg: T.redTint } : id === "amber" ? { fg: T.amber, bg: T.amberTint } : { fg: T.green, bg: T.greenTint };

function EvaluationForm({ token, data }) {
  const tree = SELF_EVALUATION[data.board];
  const existing = data.evaluation;
  const [step, setStep] = useState(existing ? 2 : 1);
  const [taught, setTaught] = useState(() => {
    if (existing?.taught?.length) return existing.taught;
    // A Year 13 student has done the Year 12 modules, so start with those ticked
    return data.year === 13 && tree ? tree.modules.filter(m => m.year === 12).map(m => m.id) : [];
  });
  const [ratings, setRatings] = useState(existing?.ratings || {});
  const [notes, setNotes] = useState(existing?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const modules = useMemo(() => (tree ? tree.modules.filter(m => taught.includes(m.id)) : []), [tree, taught]);
  const subtopics = useMemo(() => modules.flatMap(m => m.subtopics), [modules]);
  const needsRating = (s) => (ratings[s.ref]?.covered || "yes") !== "no";
  const rated = subtopics.filter(s => !needsRating(s) || ratings[s.ref]?.rag).length;
  const missing = subtopics.filter(s => needsRating(s) && !ratings[s.ref]?.rag);

  const setR = (ref, patch) => setRatings(prev => ({ ...prev, [ref]: { covered: "yes", rag: null, note: "", ...(prev[ref] || {}), ...patch } }));
  const toggleModule = (id) => setTaught(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const submit = async () => {
    if (missing.length) { setError(`Rate every topic before sending (${missing.length} left).`); return; }
    setSaving(true); setError(null);
    try {
      const clean = {};
      for (const s of subtopics) if (ratings[s.ref]) clean[s.ref] = ratings[s.ref];
      await api("POST", token, { action: "evaluation", taught, ratings: clean, notes });
      setDone(true);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  if (!tree) return <Notice tone="red">No self-evaluation exists for this exam board yet. Please reply to the email and HSJ will sort it out.</Notice>;
  if (data.status === "placed") return <Notice tone="green">Your self-evaluation has already been used to place you in a group. Log in at fc.hsjtuition.co.uk to see your homework.</Notice>;
  if (done) return (
    <div style={cardStyle}>
      <h1 style={{ fontFamily: T.display, fontSize: 24, margin: "0 0 8px" }}>Thanks, {data.studentName.split(" ")[0]}</h1>
      <p style={{ color: T.body, lineHeight: 1.6, margin: 0 }}>Your self-evaluation has been sent to HSJ Tuition. Your parent has been emailed the terms to accept, and once they have, you will get a welcome email with your group and your login. Nothing else to do for now.</p>
    </div>
  );

  const byYear = [12, 13].map(y => ({ y, mods: tree.modules.filter(m => m.year === y) }));

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div style={label}>Self-evaluation · {data.boardLabel} · Year {data.year}</div>
        <h1 style={{ fontFamily: T.display, fontSize: 26, margin: "6px 0 6px" }}>Hi {data.studentName.split(" ")[0]}, where are you right now?</h1>
        <p style={{ color: T.body, lineHeight: 1.6, margin: 0, fontSize: 14 }}>This helps HSJ place you in the right group and plan your first lessons. Be honest: Red means you need it taught, Amber means you have gaps, Green means exam ready.</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["Modules taught so far", "Rate each topic", "Send"].map((t, i) => (
          <Chip key={t} tone={step === i + 1 ? "accent" : step > i + 1 ? "green" : "neutral"}>{i + 1}. {t}</Chip>
        ))}
      </div>

      {step === 1 && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Which of these have you been taught in school so far?</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 14 }}>Tick everything your school has started, even if you did not finish it. You will only rate the topics inside the modules you tick.</div>
          {byYear.map(({ y, mods }) => (
            <div key={y} style={{ marginBottom: 14 }}>
              <div style={{ ...label, marginBottom: 8 }}>Year {y}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mods.map(m => {
                  const on = taught.includes(m.id);
                  return (
                    <label key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${on ? T.accent : T.border}`, background: on ? T.accentTint : T.card, cursor: "pointer", fontSize: 14 }}>
                      <input type="checkbox" checked={on} onChange={() => toggleModule(m.id)} style={{ marginTop: 3 }} />
                      <span><span style={{ fontWeight: 600 }}>{m.title}</span><span style={{ color: T.muted, fontSize: 12 }}> · {m.subtopics.length} topics</span></span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="primary" iconRight="arrowRight" disabled={taught.length === 0} onClick={() => setStep(2)}>Rate {subtopics.length} topics</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <Notice tone="accent" style={{ marginBottom: 12 }}>
            For each topic say whether school has covered it, then rate yourself. {rated} of {subtopics.length} done.
          </Notice>
          {modules.map(m => (
            <div key={m.id} style={cardStyle}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{m.title}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {m.subtopics.map((s, i) => {
                  const r = ratings[s.ref] || {};
                  const covered = r.covered || "yes";
                  return (
                    <div key={s.ref} style={{ padding: "12px 0", borderTop: i ? `1px solid ${T.line}` : "none" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px" }}>
                        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                          <span style={{ fontSize: 11, color: T.faint, fontWeight: 600, marginRight: 8 }}>{s.ref}</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>Covered in school?</span>
                          <Seg options={COVERED} value={covered} onChange={v => setR(s.ref, { covered: v, rag: v === "no" ? null : r.rag || null })} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>How confident?</span>
                          <Seg options={RAG} value={r.rag || null} onChange={v => setR(s.ref, { rag: v })} tone={ragTone} disabled={covered === "no"} />
                        </div>
                      </div>
                      {(r.rag === "red" || r.note) && (
                        <Input value={r.note || ""} onChange={e => setR(s.ref, { note: e.target.value })} placeholder="Optional: what is hard about this one?" maxLength={300}
                          style={{ marginTop: 8, width: "100%", boxSizing: "border-box", fontSize: 13, padding: "7px 10px" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <Button variant="secondary" icon="arrowLeft" onClick={() => setStep(1)}>Modules</Button>
            <Button variant="primary" iconRight="arrowRight" onClick={() => { if (missing.length) setError(`Rate every topic before moving on (${missing.length} left).`); else { setError(null); setStep(3); } }}>Next</Button>
          </div>
          {error && <Notice tone="red" style={{ marginTop: 10 }}>{error}</Notice>}
        </>
      )}

      {step === 3 && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Anything else your tutor should know?</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>Target grade, recent mock result, what you find hardest about chemistry exams, anything at all. Optional.</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} maxLength={2000}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.ink, resize: "vertical" }} />
          <Summary ratings={ratings} subtopics={subtopics} />
          {error && <Notice tone="red" style={{ marginTop: 10 }}>{error}</Notice>}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Button variant="secondary" icon="arrowLeft" onClick={() => setStep(2)}>Back</Button>
            <Button variant="accent" disabled={saving} onClick={submit}>{saving ? "Sending…" : existing ? "Update my self-evaluation" : "Send to HSJ Tuition"}</Button>
          </div>
        </div>
      )}
    </>
  );
}

function Summary({ ratings, subtopics }) {
  const n = { red: 0, amber: 0, green: 0, no: 0 };
  for (const s of subtopics) { const r = ratings[s.ref]; if (!r) continue; if ((r.covered || "yes") === "no") n.no++; else if (r.rag) n[r.rag]++; }
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
      <Chip tone="red">{n.red} Red</Chip><Chip tone="amber">{n.amber} Amber</Chip><Chip tone="green">{n.green} Green</Chip>
      {n.no > 0 && <Chip tone="neutral">{n.no} not yet taught</Chip>}
    </div>
  );
}

function TermsForm({ token, data }) {
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(data.terms || null);

  const vars = {
    studentName: data.studentName, parentName: data.parentName,
    course: `A-level Chemistry (${data.boardLabel}, Year ${data.year})`,
    paymentPlan: `${paymentPlanLabel(data.paymentPlan)}${data.paymentAmount ? `, £${Number(data.paymentAmount).toLocaleString("en-GB")}` : ""}`,
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!agree || name.trim().length < 2) return;
    setSaving(true); setError(null);
    try { const r = await api("POST", token, { action: "terms", name: name.trim(), version: TERMS_VERSION }); setAccepted(r.terms); }
    catch (err) { setError(err.message); }
    setSaving(false);
  };

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div style={label}>Terms for group lessons</div>
        <h1 style={{ fontFamily: T.display, fontSize: 26, margin: "6px 0 6px" }}>HSJ Tuition and {data.studentName}</h1>
        <p style={{ color: T.body, lineHeight: 1.6, margin: 0, fontSize: 14 }}>Please read these terms. At the bottom, type your name and accept. HSJ Tuition then confirms the group and lesson time by email.</p>
      </div>
      {!data.evaluationDone && <Notice tone="amber" style={{ marginBottom: 12 }}>{data.studentName.split(" ")[0]} has not completed the self-evaluation yet. You can still accept the terms now.</Notice>}
      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 6 }}>
          {[["Student", data.studentName], ["Parent or guardian", data.parentName], ["Course", vars.course], ["Payment plan", vars.paymentPlan]].map(([k, v]) => (
            <div key={k}><div style={label}>{k}</div><div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{v}</div></div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        {TERMS_SECTIONS.map(sec => (
          <div key={sec.title} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{sec.title}</div>
            {sec.body.map((p, i) => <p key={i} style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.65, color: T.body }}>{fillTerms(p, vars)}</p>)}
          </div>
        ))}
        <div style={{ fontSize: 11, color: T.faint }}>Version {TERMS_VERSION}</div>
      </div>
      {accepted ? (
        <Notice tone="green">Accepted by {accepted.acceptedName} on {new Date(accepted.acceptedAt).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}. Thank you. Nothing else to do: HSJ Tuition will email the group and lesson time.</Notice>
      ) : (
        <form onSubmit={submit} style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Accept the terms</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, fontWeight: 600, color: T.muted }}>
              Your full name
              <Input value={name} onChange={e => setName(e.target.value)} placeholder={data.parentName} required style={{ maxWidth: 360 }} />
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
              <span>I am the parent or guardian of {data.studentName} and I agree to these terms on behalf of us both.</span>
            </label>
            {error && <Notice tone="red">{error}</Notice>}
            <div><Button type="submit" variant="accent" disabled={saving || !agree || name.trim().length < 2}>{saving ? "Saving…" : "Accept the terms"}</Button></div>
          </div>
        </form>
      )}
    </>
  );
}
