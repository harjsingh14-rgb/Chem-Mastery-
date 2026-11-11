import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth, fetchPpqQuestion, fetchPpqAttempt, ppqMarkApi } from "../../firebase";
import { T } from "../../ui/theme";
import { Button, Card, Chip, Notice, Icon } from "../../ui/components";
import track from "../../utils/track";
import DrawCanvas from "./DrawCanvas";
import { noteAttempt } from "../../hooks/usePpq";
import { LEVEL_LABEL, seriesLabel, topicShort, compressImage, loadQueue, partKey } from "./ppqUtils";

const MCQ_LETTERS = ["A", "B", "C", "D"];
const docCache = {};

/**
 * One past-paper question: the original as an image, the parts underneath
 * with typed answers and progressive hints, a pen layer over the question,
 * photo upload of paper work, and AI marking against the mark scheme.
 *
 * Embedded inside a homework (embedded=true): no queue navigation or exit
 * button, the homework player hears about each marking through onMarked, and
 * once the homework is submitted (locked=true) the stored marking is shown
 * read-only.
 */
export default function PastPaperQuestion({ board, qid, authUser, logAttempt, onExit, embedded = false, locked = false, onMarked, onlyParts = null }) {
  const navigate = useNavigate();
  const [doc, setDoc] = useState(docCache[qid] || null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [hints, setHints] = useState({});          // label -> number revealed
  const [drawing, setDrawing] = useState(false);
  const [inkCount, setInkCount] = useState(0);
  const [photos, setPhotos] = useState([]);        // [{ dataUrl, dataBase64, mediaType }]
  const [marking, setMarking] = useState(false);
  const [result, setResult] = useState(null);
  const [showModel, setShowModel] = useState({});
  const [attempt, setAttempt] = useState(null);      // the student's ppqAttempts record, if any
  const [lockedShown, setLockedShown] = useState(false);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const queue = useMemo(() => embedded ? [] : loadQueue(), [embedded]);
  const pos = queue.indexOf(qid);
  const nextId = pos >= 0 && pos < queue.length - 1 ? queue[pos + 1] : null;
  const prevId = pos > 0 ? queue[pos - 1] : null;

  useEffect(() => {
    let alive = true;
    setResult(null); setAnswers({}); setHints({}); setPhotos([]); setInkCount(0); setShowModel({}); setError(null);
    if (docCache[qid]) { setDoc(docCache[qid]); return undefined; }
    setDoc(null);
    fetchPpqQuestion(qid).then(d => {
      if (!alive) return;
      if (!d) { setError("This question could not be found."); return; }
      docCache[qid] = d; setDoc(d);
    }).catch(e => alive && setError(e.message || "Could not load the question"));
    return () => { alive = false; };
  }, [qid]);

  useEffect(() => {
    let alive = true;
    setAttempt(null);
    if (!authUser?.uid) return undefined;
    fetchPpqAttempt(qid, authUser.uid).then(a => alive && setAttempt(a)).catch(() => {});
    return () => { alive = false; };
  }, [qid, authUser]);

  // Rebuild the marked view from the stored latest attempt, so a student who
  // comes back later can still see their marks, the scheme and query a part.
  const showLast = () => {
    if (!doc || !attempt?.latest) return;
    if (locked) { setLockedShown(true); }
    const lp0 = attempt.latest.parts || {};
    const shown = (doc.parts || []).filter(p => !subset || subset.includes(p.label));
    const lp = Object.fromEntries(shown.map(p => [p.label, lp0[partKey(p.label)]]));
    const partRows = shown.map(p => ({ label: p.label, marks: p.marks, score: lp[p.label]?.score || 0, awarded: lp[p.label]?.awarded || [], attempted: lp[p.label]?.attempted ?? !!(lp[p.label]?.answer || lp[p.label]?.score), feedback: lp[p.label]?.feedback || "" }));
    setResult({
      fromRecord: true,
      score: subset ? partRows.reduce((a, p) => a + p.score, 0) : attempt.latest.score, totalMarks: subset ? shown.reduce((a, p) => a + (Number(p.marks) || 0), 0) : attempt.totalMarks, overall: attempt.latest.overall || "",
      attempts: attempt.attempts, best: attempt.best, confidence: "medium",
      parts: partRows,
      scheme: shown.map(p => ({ label: p.label, marks: p.marks, ms: p.ms || [], modelAnswer: p.modelAnswer || null, answer: p.answer || null })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (locked && doc && attempt?.latest && !lockedShown) showLast();
  }, [locked, doc, attempt, lockedShown]); // eslint-disable-line

  const sendQuery = async (part, note) => {
    const r = await ppqMarkApi({ action: "query", qid, part, note });
    setAttempt(a => ({ ...(a || {}), qid, queries: r.queries, hasOpenQuery: true }));
  };

  // A homework may set only some parts of the question; the rest are not shown or marked
  const subset = Array.isArray(onlyParts) && onlyParts.length > 0 ? onlyParts : null;
  const parts = (doc?.parts || []).filter(p => !subset || subset.includes(p.label));
  const totalMarks = subset ? parts.reduce((a, p) => a + (Number(p.marks) || 0), 0) : (doc?.totalMarks || 0);
  const typedAny = Object.values(answers).some(v => v && v.trim());
  const canMark = !marking && (typedAny || inkCount > 0 || photos.length > 0);

  const addPhotos = async (files) => {
    const list = Array.from(files || []).slice(0, 4 - photos.length);
    const out = [];
    for (const f of list) {
      try { out.push(await compressImage(f, 1600)); } catch (e) { setError(e.message); }
    }
    setPhotos(p => [...p, ...out].slice(0, 4));
  };

  const mark = async () => {
    if (!doc || !canMark) return;
    setMarking(true); setError(null);
    track("ppq_mark", { board, qid, mode: inkCount > 0 ? "draw" : photos.length ? "photo" : "typed" });
    try {
      const images = [];
      let inkOnly = false;
      if (inkCount > 0 && canvasRef.current) {
        const ex = await canvasRef.current.exportCanvas();
        inkOnly = ex.inkOnly;
        images.push(await compressImage(ex.canvas, 1800, 0.85));
      }
      for (const p of photos) images.push({ mediaType: p.mediaType, dataBase64: p.dataBase64 });
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/ppq-mark", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ qid, answers, images: images.map(i => ({ mediaType: i.mediaType, dataBase64: i.dataBase64 })), mode: inkCount > 0 ? "draw" : photos.length ? "photo" : "typed", hintsUsed: hints, inkOnly, onlyParts: subset }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Marking failed (${res.status})`);
      setResult(data);
      setDrawing(false);
      setAttempt(a => ({ ...(a || {}), qid, attempts: data.attempts, best: data.best, totalMarks: data.totalMarks || doc.totalMarks, latest: { score: data.score, overall: data.overall, parts: Object.fromEntries(data.parts.map(p => [partKey(p.label), { score: p.score, marks: p.marks, feedback: p.feedback, awarded: p.awarded, attempted: p.attempted, answer: answers[p.label] || null }])) }, queries: {} }));
      noteAttempt(authUser?.uid, qid, { attempts: data.attempts, best: data.best, totalMarks: data.totalMarks || doc.totalMarks, qid });
      onMarked && onMarked(data, doc, { answers, hintsUsed: Object.values(hints).reduce((x, n) => x + (n || 0), 0) });
      logAttempt && logAttempt({
        board, type: "ppq", questionId: qid, topic: (doc.topics || [])[0] || null, topicLabel: doc.title || null,
        score: data.score, maxScore: totalMarks, correct: data.score >= Math.ceil(totalMarks * 0.7),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e.message || "Could not reach the marking service");
    } finally {
      setMarking(false);
    }
  };

  const tryAgain = () => { setResult(null); setShowModel({}); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const header = doc && (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{LEVEL_LABEL[doc.level]} Paper {doc.paper} · {seriesLabel(doc.series, doc.year)} · Question {doc.q}</div>
          <h2 style={{ margin: "2px 0 0", fontFamily: T.display, fontSize: 20, fontWeight: 700, lineHeight: 1.25 }}>{doc.title || `Question ${doc.q}`}</h2>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <Chip tone="indigo">{subset ? `${totalMarks} of ${doc.totalMarks} marks` : `${doc.totalMarks} marks`}</Chip>
          {subset && <Chip tone="amber">Parts {parts.map(p => p.label || "Q").join(", ")} only</Chip>}
          {pos >= 0 && <Chip tone="neutral">{pos + 1} of {queue.length}</Chip>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(doc.topics || []).map(t => <Chip key={t} tone="neutral">{topicShort(board, t)}</Chip>)}
      </div>
    </div>
  );

  const scoreTone = result ? (result.score >= totalMarks ? "green" : result.score >= Math.ceil(totalMarks * 0.7) ? "accent" : result.score > 0 ? "amber" : "red") : null;
  const toneColour = { green: T.green, accent: T.accentText, amber: T.amber, red: T.red };

  return (
    <div style={embedded ? { display: "flex", flexDirection: "column", gap: 16 } : { maxWidth: 980, margin: "0 auto", padding: "20px 20px 60px", display: "flex", flexDirection: "column", gap: 16 }} className={embedded ? undefined : "cm-page"}>
      {error && <Notice tone="red">{error}</Notice>}
      {!doc && !error && <div style={{ color: T.muted, padding: 40, textAlign: "center" }}>Loading question…</div>}
      {doc && (
        <>
          {header}

          {/* Result banner */}
          {result && (
            <Card style={{ borderColor: toneColour[scoreTone], display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: `${toneColour[scoreTone]}14`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: T.display, fontSize: 26, fontWeight: 800, color: toneColour[scoreTone], lineHeight: 1 }}>{result.score}</span>
                <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>/ {totalMarks}</span>
              </div>
              <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{result.score >= totalMarks ? "Full marks" : result.score >= Math.ceil(totalMarks * 0.7) ? "Good answer" : result.score > 0 ? "Some credit" : "No marks this time"}</div>
                {result.overall && <div style={{ fontSize: 13, color: T.body, lineHeight: 1.55 }}>{result.overall}</div>}
                <div style={{ fontSize: 12, color: T.muted }}>Attempt {result.attempts}{result.attempts > 1 && ` · best ${result.best}/${result.totalMarks || totalMarks}`}{result.confidence === "low" && " · the examiner was unsure about this one, check the scheme"}</div>
              </div>
              {!locked && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button onClick={tryAgain}>Try again</Button>
                  {!embedded && (nextId
                    ? <Button variant="primary" iconRight="arrowRight" onClick={() => navigate(`/${board}/practise/${nextId}`)}>Next question</Button>
                    : <Button variant="primary" onClick={onExit}>Back</Button>)}
                </div>
              )}
            </Card>
          )}

          {locked && !result && !attempt?.latest && <Notice tone="neutral">Not attempted.</Notice>}

          {/* Previous attempt */}
          {!result && !locked && attempt?.latest && (
            <Notice tone="neutral" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ flex: 1, minWidth: 200 }}>You have tried this {attempt.attempts === 1 ? "once" : `${attempt.attempts} times`}. Best {attempt.best}/{attempt.totalMarks}, last {attempt.latest.score}/{attempt.totalMarks}.{attempt.hasOpenQuery ? " A mark query is with your tutor." : ""}</span>
              <Button size="sm" onClick={showLast}>Show last marking</Button>
            </Notice>
          )}

          {/* Answer method */}
          {!result && !locked && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Answer by</span>
              <Button size="sm" variant={!drawing && photos.length === 0 ? "primary" : "secondary"} icon="pencil" onClick={() => setDrawing(false)}>Typing</Button>
              <Button size="sm" variant={drawing ? "primary" : "secondary"} icon="arrowCurve" onClick={() => setDrawing(d => !d)}>{drawing ? "Drawing on" : "Draw on the question"}</Button>
              <Button size="sm" variant={photos.length > 0 ? "primary" : "secondary"} icon="copy" onClick={() => fileRef.current?.click()} disabled={photos.length >= 4}>Photo of my work</Button>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple hidden onChange={e => { addPhotos(e.target.files); e.target.value = ""; }} />
              <a href={doc.imageUrl} target="_blank" rel="noreferrer" className="cm-link" style={{ marginLeft: "auto", fontSize: 12 }}>Open full size</a>
            </div>
          )}

          {subset && !result && <Notice tone="neutral" style={{ fontSize: 13 }}>Only parts {parts.map(p => p.label || "Q").join(", ")} are set for this homework. Ignore the other parts printed on the question.</Notice>}
          {/* The question itself, with the pen layer */}
          <DrawCanvas ref={canvasRef} src={doc.imageUrl} width={doc.imageW || 1100} height={doc.imageH || 1400} active={drawing && !result} onChange={setInkCount} />

          {/* Photos */}
          {photos.length > 0 && !result && (
            <Card padding={12} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p.dataUrl} alt={`Your work ${i + 1}`} style={{ height: 96, borderRadius: 8, border: `1px solid ${T.border}`, display: "block" }} />
                  <button type="button" aria-label="Remove photo" onClick={() => setPhotos(ps => ps.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", border: "none", background: T.ink, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={12} /></button>
                </div>
              ))}
              <span style={{ fontSize: 12, color: T.muted }}>{photos.length} of 4 photos. Make sure each part is labelled and the writing is in focus.</span>
            </Card>
          )}

          {/* Parts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {parts.map(p => (
              <PartCard key={p.label} part={p}
                value={answers[p.label] || ""} onChange={v => setAnswers(a => ({ ...a, [p.label]: v }))}
                hintsShown={hints[p.label] || 0} onHint={() => { setHints(h => ({ ...h, [p.label]: Math.min((h[p.label] || 0) + 1, (p.hints || []).length) })); track("ppq_hint", { board, qid, part: p.label }); }}
                result={result?.parts?.find(r => r.label === p.label)} scheme={result?.scheme?.find(s => s.label === p.label)}
                showModel={!!showModel[p.label]} onToggleModel={() => setShowModel(m => ({ ...m, [p.label]: !m[p.label] }))}
                locked={!!result || locked} query={attempt?.queries?.[partKey(p.label)]} onQuery={result ? (note) => sendQuery(p.label, note) : null} />
            ))}
          </div>

          {/* Mark */}
          {!result && !locked && (
            <Card style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", position: "sticky", bottom: 12, boxShadow: "0 8px 24px rgba(15,29,53,0.10)" }}>
              <div style={{ flex: 1, minWidth: 200, fontSize: 13, color: T.muted }}>
                {marking ? "Marking against the mark scheme…" : canMark
                  ? `${typedAny ? "Typed answers" : ""}${typedAny && (inkCount > 0 || photos.length) ? " plus " : ""}${inkCount > 0 ? "your drawing" : ""}${inkCount > 0 && photos.length ? " and " : ""}${photos.length ? `${photos.length} photo${photos.length === 1 ? "" : "s"}` : ""} will be sent to the examiner.`
                  : "Type an answer, draw on the question or add a photo of your work."}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!embedded && prevId && <Button variant="ghost" icon="arrowLeft" onClick={() => navigate(`/${board}/practise/${prevId}`)}>Previous</Button>}
                {!embedded && nextId && <Button variant="ghost" onClick={() => navigate(`/${board}/practise/${nextId}`)}>Skip</Button>}
                <Button variant="primary" size="lg" icon="check" onClick={mark} disabled={!canMark}>{marking ? "Marking…" : "Mark my answer"}</Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function PartCard({ part, value, onChange, hintsShown, onHint, result, scheme, showModel, onToggleModel, locked, query, onQuery }) {
  const hints = part.hints || [];
  const isMcq = part.type === "mcq";
  const tone = result ? (result.score >= part.marks ? "green" : result.score > 0 ? "amber" : result.attempted ? "red" : "neutral") : null;
  const toneColour = { green: T.green, amber: T.amber, red: T.red, neutral: T.faint };
  return (
    <Card padding={16} style={{ display: "flex", flexDirection: "column", gap: 10, borderLeft: result ? `4px solid ${toneColour[tone]}` : undefined }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flex: 1, minWidth: 200 }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15, color: T.ink }}>{part.label}</span>
          <span style={{ fontSize: 13, color: T.body, lineHeight: 1.5 }}>{part.ask}</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {result ? <Chip tone={tone === "neutral" ? "neutral" : tone}>{result.score} / {part.marks}</Chip> : <Chip tone="neutral">{part.marks} mark{part.marks === 1 ? "" : "s"}</Chip>}
        </div>
      </div>

      {/* Input */}
      {isMcq ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {MCQ_LETTERS.map(L => (
            <button key={L} type="button" disabled={locked} onClick={() => onChange(value === L ? "" : L)} aria-label={`Answer ${L}`} style={{
              width: 42, height: 42, borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: locked ? "default" : "pointer",
              border: `2px solid ${value === L ? T.ink : T.border}`, background: value === L ? T.ink : T.card, color: value === L ? "#fff" : T.ink,
            }}>{L}</button>
          ))}
          <span style={{ fontSize: 12, color: T.muted }}>Pick one letter.</span>
        </div>
      ) : (
        <textarea value={value} onChange={e => onChange(e.target.value)} disabled={locked} rows={part.type === "extended" ? 7 : part.marks >= 3 ? 4 : 2} aria-label={`Answer to ${part.label}`}
          placeholder={part.type === "calc" ? "Show your working line by line, then the final answer with units." : part.type === "draw" ? "Describe what you have drawn, or draw on the question above and leave this blank." : part.type === "extended" ? "Write your full answer in connected sentences." : "Type your answer"}
          style={{ width: "100%", padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 14, color: T.ink, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", background: locked ? T.soft : T.card, outline: "none" }}
          onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
      )}

      {/* Hints before marking */}
      {!result && hints.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {hints.slice(0, hintsShown).map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "8px 12px", borderRadius: T.radiusSm, background: T.amberTint, fontSize: 13, color: "#78350F", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>Hint {i + 1}</span><span>{h}</span>
            </div>
          ))}
          {hintsShown < hints.length && (
            <button type="button" onClick={onHint} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 0, cursor: "pointer", color: T.accentText, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="help" size={14} /> {hintsShown === 0 ? "Need a hint?" : `Another hint (${hints.length - hintsShown} left)`}
            </button>
          )}
        </div>
      )}

      {/* After marking: feedback, scheme, model answer */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.feedback && <div style={{ fontSize: 13, color: T.body, lineHeight: 1.55 }}>{result.feedback}</div>}
          {!result.attempted && <div style={{ fontSize: 12, color: T.muted }}>Not attempted.</div>}
          {scheme && scheme.ms.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>Mark scheme</div>
              {scheme.ms.map((m, i) => {
                const got = result.awarded?.[i];
                return (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: T.radiusSm, background: got ? T.greenTint : T.card, border: `1px solid ${got ? "#BBF7D0" : T.border}` }}>
                    <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: `2px solid ${got ? T.green : T.faint}`, background: got ? T.green : T.card, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                      {got && <Icon name="check" size={12} color="#fff" strokeWidth={3} />}
                    </span>
                    <span style={{ fontSize: 13, lineHeight: 1.5, color: got ? T.green : T.ink, fontWeight: got ? 600 : 400 }}>{m}</span>
                  </div>
                );
              })}
            </div>
          )}
          {(query || onQuery) && <QueryBox query={query} onSend={onQuery} />}
          {scheme && (scheme.modelAnswer || scheme.answer) && (
            <div>
              <button type="button" onClick={onToggleModel} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: T.accentText, fontSize: 12, fontWeight: 600 }}>{showModel ? "Hide model answer" : "Show model answer"}</button>
              {showModel && (
                <div style={{ marginTop: 6, padding: "10px 12px", borderRadius: T.radiusSm, background: T.indigoTint, fontSize: 13, color: T.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {scheme.answer && <div style={{ fontWeight: 700, marginBottom: scheme.modelAnswer ? 4 : 0 }}>{scheme.answer}</div>}
                  {scheme.modelAnswer}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/** "Query this mark": the student's note to their tutor on one part, and the reply once it comes. */
function QueryBox({ query, onSend }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  if (query) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 14px", background: "#FAFBFC", border: `1px solid ${T.line}`, borderRadius: T.radiusSm, fontSize: 13 }}>
        <Chip tone={query.status === "resolved" ? "green" : "amber"} style={{ fontSize: 11, alignSelf: "flex-start" }}>{query.status === "resolved" ? "Tutor replied" : "Query sent to your tutor"}</Chip>
        <div><span style={{ color: T.muted }}>You wrote: </span>{query.note}</div>
        {query.reply && <div><span style={{ color: T.muted }}>Tutor: </span>{query.reply}{query.newScore !== undefined && <span style={{ color: T.muted }}> (mark changed to {query.newScore})</span>}</div>}
      </div>
    );
  }
  if (!onSend) return null;
  if (!open) return <div><Button size="sm" variant="ghost" icon="message" onClick={() => setOpen(true)} style={{ color: T.muted }}>Query this mark</Button></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: "#FAFBFC", border: `1px solid ${T.line}`, borderRadius: T.radiusSm }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>Tell your tutor why you think this mark should be different</span>
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} aria-label="Your query" placeholder="e.g. I gave the state symbols in my second line"
        style={{ width: "100%", padding: "10px 12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", color: T.ink, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }} />
      {err && <span style={{ fontSize: 12, color: T.red }}>{err}</span>}
      <div style={{ display: "flex", gap: 8 }}>
        <Button size="sm" variant="primary" disabled={busy || note.trim().length < 5} onClick={async () => { setBusy(true); setErr(null); try { await onSend(note.trim()); } catch (e) { setErr(e.message); } finally { setBusy(false); } }}>{busy ? "Sending…" : "Send to tutor"}</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}
