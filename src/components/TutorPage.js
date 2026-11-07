import React, { useState, useEffect, useMemo } from "react";
import { createClass, fetchTutorClasses, fetchClassStudents, fetchAttemptsForTutor } from "../firebase";

const NAVY = "#1a2d45";
const BLUE = "#29ABE2";
const MUTED = "#7a95b0";

const DAY = 24 * 60 * 60 * 1000;
const attemptTime = (a) => a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.clientTime || 0);
const pct = (n, d) => d === 0 ? null : Math.round((n / d) * 100);
const pctColour = (p) => p === null ? "#94a3b8" : p >= 75 ? "#16a34a" : p >= 50 ? "#d97706" : "#dc2626";

function relativeTime(ms) {
  if (!ms) return "never";
  const diff = Date.now() - ms;
  if (diff < 60 * 1000) return "just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / 3600000)} h ago`;
  const d = Math.floor(diff / DAY);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

const TYPE_LABEL = { mcq: "MCQ", calc: "Calc", extended: "6-mark", quiz: "Quiz", flashcard: "Card" };

export default function TutorPage({ authUser, userProfile }) {
  const [classes, setClasses] = useState(null);       // null = loading
  const [selected, setSelected] = useState(null);     // class code
  const [students, setStudents] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newBoard, setNewBoard] = useState("aqa");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openStudent, setOpenStudent] = useState(null);

  const tutorUid = authUser?.uid;

  // Load the tutor's classes and every attempt made by their students
  useEffect(() => {
    if (!tutorUid) return;
    let cancelled = false;
    (async () => {
      try {
        const [cls, att] = await Promise.all([fetchTutorClasses(tutorUid), fetchAttemptsForTutor(tutorUid)]);
        if (cancelled) return;
        setClasses(cls);
        setAttempts(att);
        if (cls.length > 0) setSelected(cls[0].code);
      } catch (e) {
        if (!cancelled) { setError(e.message); setClasses([]); }
      }
    })();
    return () => { cancelled = true; };
  }, [tutorUid]);

  // Load the roster when the selected class changes
  useEffect(() => {
    if (!selected) { setStudents(null); return; }
    let cancelled = false;
    setStudents(null);
    fetchClassStudents(selected, tutorUid)
      .then(s => { if (!cancelled) setStudents(s); })
      .catch(e => { if (!cancelled) { setError(e.message); setStudents([]); } });
    return () => { cancelled = true; };
  }, [selected, tutorUid]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true); setError(null);
    try {
      const cls = await createClass(tutorUid, { name: newName, board: newBoard });
      setClasses(prev => [...(prev || []), cls].sort((a, b) => a.name.localeCompare(b.name)));
      setSelected(cls.code);
      setNewName("");
    } catch (e) {
      setError(e.message || "Could not create class");
    }
    setCreating(false);
  };

  const copyCode = () => {
    try { navigator.clipboard.writeText(selected); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  // Per-student summary computed from the attempts table
  const summaries = useMemo(() => {
    const byUid = {};
    for (const a of attempts) {
      const s = byUid[a.uid] || (byUid[a.uid] = { total: 0, correct: 0, week: 0, weekCorrect: 0, last: 0, topics: {}, recent: [] });
      const t = attemptTime(a);
      s.total++; if (a.correct) s.correct++;
      if (t > Date.now() - 7 * DAY) { s.week++; if (a.correct) s.weekCorrect++; }
      if (t > s.last) s.last = t;
      const key = a.topic || "other";
      const tp = s.topics[key] || (s.topics[key] = { label: a.topicLabel || key, n: 0, c: 0, type: a.type });
      tp.n++; if (a.correct) tp.c++;
      if (s.recent.length < 8) s.recent.push(a);
    }
    for (const s of Object.values(byUid)) {
      const list = Object.values(s.topics).filter(t => t.n >= 3).map(t => ({ ...t, pct: pct(t.c, t.n) }));
      s.weak = list.sort((a, b) => a.pct - b.pct).slice(0, 3);
      s.strong = list.sort((a, b) => b.pct - a.pct).slice(0, 3);
    }
    return byUid;
  }, [attempts]);

  const cls = classes?.find(c => c.code === selected);

  const card = { background: "#fff", borderRadius: "16px", padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" };
  const inputStyle = { padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e0e8f0", fontSize: "14px", fontFamily: "inherit", outline: "none" };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 56px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: MUTED, letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 6px" }}>ChemMastery for tutors</p>
        <h2 style={{ fontSize: "26px", fontWeight: 800, color: NAVY, margin: "0 0 20px", letterSpacing: "-0.5px" }}>Your classes</h2>

        {error && <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", color: "#991b1b", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) 1fr", gap: "16px", alignItems: "start" }}>
          {/* ── Class list + create ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={card}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Classes</div>
              {classes === null && <div style={{ fontSize: "13px", color: MUTED }}>Loading…</div>}
              {classes && classes.length === 0 && <div style={{ fontSize: "13px", color: MUTED, lineHeight: 1.5 }}>No classes yet. Create one below and share its code with your students.</div>}
              {classes && classes.map(c => (
                <button key={c.code} onClick={() => setSelected(c.code)} style={{
                  width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: "10px", marginBottom: "6px", cursor: "pointer", fontFamily: "inherit",
                  border: `2px solid ${selected === c.code ? BLUE : "#e8edf3"}`, background: selected === c.code ? `${BLUE}10` : "#fff",
                }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: NAVY }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: MUTED, marginTop: "2px" }}>{c.board === "ocr" ? "OCR A" : "AQA"} · {c.code}</div>
                </button>
              ))}
            </div>

            <div style={card}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>New class</div>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Year 13 Tuesday" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
                onKeyDown={e => e.key === "Enter" && handleCreate()} />
              <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                {[{ id: "aqa", label: "AQA" }, { id: "ocr", label: "OCR A" }].map(b => (
                  <button key={b.id} onClick={() => setNewBoard(b.id)} style={{
                    flex: 1, padding: "8px", borderRadius: "8px", fontFamily: "inherit", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                    border: `2px solid ${newBoard === b.id ? BLUE : "#e0e8f0"}`, background: newBoard === b.id ? BLUE : "#fff", color: newBoard === b.id ? "#fff" : NAVY,
                  }}>{b.label}</button>
                ))}
              </div>
              <button onClick={handleCreate} disabled={creating || !newName.trim()} style={{
                width: "100%", padding: "10px", borderRadius: "10px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700,
                background: newName.trim() ? NAVY : "#e8edf3", color: newName.trim() ? "#fff" : "#b0c4d4", cursor: newName.trim() ? "pointer" : "default",
              }}>{creating ? "Creating…" : "Create class"}</button>
            </div>
          </div>

          {/* ── Selected class ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {!cls && classes && classes.length > 0 && <div style={{ ...card, color: MUTED, fontSize: "13px" }}>Select a class to see its students.</div>}
            {cls && (
              <>
                <div style={{ ...card, display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: NAVY }}>{cls.name}</div>
                    <div style={{ fontSize: "12px", color: MUTED, marginTop: "2px" }}>{students ? `${students.length} student${students.length === 1 ? "" : "s"}` : "Loading students…"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "1px" }}>Class code</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "22px", fontWeight: 700, color: BLUE, letterSpacing: "1px" }}>{cls.code}</span>
                      <button onClick={copyCode} style={{ padding: "6px 10px", borderRadius: "8px", border: `1.5px solid ${BLUE}`, background: "#fff", color: BLUE, fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "Copied" : "Copy"}</button>
                    </div>
                    <div style={{ fontSize: "11px", color: MUTED, marginTop: "2px" }}>Students enter this under their avatar → “Join”</div>
                  </div>
                </div>

                {students && students.length === 0 && (
                  <div style={{ ...card, textAlign: "center", padding: "32px" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>No students yet</div>
                    <div style={{ fontSize: "13px", color: MUTED }}>Share the code <b>{cls.code}</b>. Students appear here as soon as they join, and their work shows up as they practise.</div>
                  </div>
                )}

                {students && students.map(s => {
                  const sum = summaries[s.uid];
                  const weekPct = sum ? pct(sum.weekCorrect, sum.week) : null;
                  const allPct = sum ? pct(sum.correct, sum.total) : null;
                  const isOpen = openStudent === s.uid;
                  return (
                    <div key={s.uid} style={card}>
                      <div onClick={() => setOpenStudent(isOpen ? null : s.uid)} style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0, background: s.photoURL ? `url(${s.photoURL}) center/cover` : BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                          {!s.photoURL && (s.displayName?.[0] || s.email?.[0] || "?").toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "15px", fontWeight: 700, color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.displayName || s.email}</div>
                          <div style={{ fontSize: "11px", color: MUTED }}>{s.email} · last active {relativeTime(sum?.last)}</div>
                        </div>
                        <Stat label="This week" value={sum?.week || 0} sub="questions" />
                        <Stat label="Accuracy (7d)" value={weekPct === null ? "–" : `${weekPct}%`} colour={pctColour(weekPct)} />
                        <Stat label="All time" value={allPct === null ? "–" : `${allPct}%`} sub={`${sum?.total || 0} Qs`} colour={pctColour(allPct)} />
                        <span style={{ fontSize: "14px", color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                      </div>

                      {isOpen && (
                        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e8edf3", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                          <TopicList title="Needs work" topics={sum?.weak} empty="Not enough attempts yet (3+ per topic)." />
                          <TopicList title="Going well" topics={sum?.strong} empty="Not enough attempts yet." />
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Recent activity</div>
                            {!sum && <div style={{ fontSize: "12px", color: MUTED }}>Nothing yet.</div>}
                            {sum?.recent.map(a => (
                              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", padding: "4px 0", color: NAVY }}>
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: a.correct ? "#16a34a" : "#dc2626", flexShrink: 0 }} />
                                <span style={{ fontWeight: 700, width: "52px", color: MUTED }}>{TYPE_LABEL[a.type] || a.type}</span>
                                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.topicLabel || a.topic || a.questionId}</span>
                                {a.maxScore > 1 && <span style={{ fontWeight: 700 }}>{a.score}/{a.maxScore}</span>}
                                <span style={{ color: MUTED, flexShrink: 0 }}>{relativeTime(attemptTime(a))}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, colour }) {
  return (
    <div style={{ textAlign: "center", minWidth: "64px" }}>
      <div style={{ fontSize: "18px", fontWeight: 800, color: colour || NAVY, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "10px", color: MUTED, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: "10px", color: "#b0c4d4" }}>{sub}</div>}
    </div>
  );
}

function TopicList({ title, topics, empty }) {
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{title}</div>
      {(!topics || topics.length === 0) && <div style={{ fontSize: "12px", color: MUTED }}>{empty}</div>}
      {topics && topics.map(t => (
        <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", padding: "4px 0", color: NAVY }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "8px" }}>{t.label}</span>
          <span style={{ fontWeight: 700, color: pctColour(t.pct), flexShrink: 0 }}>{t.pct}% <span style={{ color: "#b0c4d4", fontWeight: 400 }}>({t.c}/{t.n})</span></span>
        </div>
      ))}
    </div>
  );
}
