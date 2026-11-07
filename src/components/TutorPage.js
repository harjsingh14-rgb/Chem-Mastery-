import React, { useState, useEffect, useMemo } from "react";
import { createClass, fetchTutorClasses, fetchClassStudents, fetchAttemptsForTutor } from "../firebase";
import { T, pctColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, StatTile, AccuracyBar, Avatar, Button, Input, Table, th, td, EmptyState, Notice, chipToneForPct, Icon } from "../ui/components";
import { summarise, pct, relativeTime, attemptTime, DAY, TYPE_LABEL } from "../utils/analytics";

export default function TutorPage({ authUser }) {
  const [classes, setClasses] = useState(null);
  const [selected, setSelected] = useState(null);
  const [students, setStudents] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBoard, setNewBoard] = useState("aqa");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openStudent, setOpenStudent] = useState(null);
  const [search, setSearch] = useState("");

  const tutorUid = authUser?.uid;

  useEffect(() => {
    if (!tutorUid) return;
    let cancelled = false;
    (async () => {
      try {
        const [cls, att] = await Promise.all([fetchTutorClasses(tutorUid), fetchAttemptsForTutor(tutorUid)]);
        if (cancelled) return;
        setClasses(cls); setAttempts(att);
        if (cls.length > 0) setSelected(cls[0].code); else setShowNew(true);
      } catch (e) { if (!cancelled) { setError(e.message); setClasses([]); } }
    })();
    return () => { cancelled = true; };
  }, [tutorUid]);

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
      setSelected(cls.code); setNewName(""); setShowNew(false);
    } catch (e) { setError(e.message || "Could not create class"); }
    setCreating(false);
  };

  const copyCode = () => { try { navigator.clipboard.writeText(selected); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} };

  const cls = classes?.find(c => c.code === selected);
  const classUids = useMemo(() => new Set((students || []).map(s => s.uid)), [students]);
  const classAttempts = useMemo(() => attempts.filter(a => classUids.has(a.uid)), [attempts, classUids]);

  // Per-student summaries + class-wide numbers
  const perStudent = useMemo(() => {
    const by = {};
    for (const a of classAttempts) (by[a.uid] || (by[a.uid] = [])).push(a);
    const out = {};
    for (const uid of Object.keys(by)) out[uid] = summarise(by[uid]);
    return out;
  }, [classAttempts]);
  const classSum = useMemo(() => summarise(classAttempts, { minForTopic: 8 }), [classAttempts]);

  const rows = useMemo(() => (students || []).map(s => {
    const sum = perStudent[s.uid];
    const weekPct = sum ? sum.weekPct : null;
    const inactiveDays = sum?.last ? Math.floor((Date.now() - sum.last) / DAY) : null;
    const flags = [];
    if (!sum || inactiveDays === null) flags.push({ tone: "amber", text: "No activity yet" });
    else if (inactiveDays >= 7) flags.push({ tone: "red", text: `Inactive ${inactiveDays} days` });
    if (sum && sum.week >= 5 && weekPct !== null && weekPct < 50) flags.push({ tone: "red", text: `${weekPct}% this week` });
    const weakest = sum?.weak?.find(t => t.pct < 75) || null;
    return { s, sum, weekPct, flags, weakest, name: s.displayName || s.email || "Student" };
  }).filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.flags.length - a.flags.length) || a.name.localeCompare(b.name)), [students, perStudent, search]);

  const attention = rows.filter(r => r.flags.length > 0);
  const activeThisWeek = rows.filter(r => r.sum && r.sum.week > 0).length;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={cls ? cls.name : "Your classes"}
        sub={cls ? `${cls.board === "ocr" ? "OCR A" : "AQA"} · ${students ? `${students.length} student${students.length === 1 ? "" : "s"}` : "loading students…"}` : "Create a class and share its code with your students."}
        right={<>
          {classes && classes.length > 1 && (
            <select value={selected || ""} onChange={e => setSelected(e.target.value)} aria-label="Switch class"
              style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, fontWeight: 600, color: T.ink }}>
              {classes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          )}
          <Button variant="primary" icon="plus" onClick={() => setShowNew(v => !v)}>New class</Button>
        </>}
      />

      {error && <Notice tone="red">{error}</Notice>}

      {showNew && (
        <Card style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 220px" }}>
            <label htmlFor="new-class-name" style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Class name</label>
            <Input id="new-class-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Year 13 Tuesday" onKeyDown={e => e.key === "Enter" && handleCreate()} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Exam board</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ id: "aqa", label: "AQA" }, { id: "ocr", label: "OCR A" }].map(b => (
                <Button key={b.id} variant={newBoard === b.id ? "primary" : "secondary"} onClick={() => setNewBoard(b.id)}>{b.label}</Button>
              ))}
            </div>
          </div>
          <Button variant="accent" onClick={handleCreate} disabled={creating || !newName.trim()}>{creating ? "Creating…" : "Create class"}</Button>
          {classes && classes.length > 0 && <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>}
        </Card>
      )}

      {cls && (
        <>
          <div className="cm-grid-4">
            <StatTile label="Students" value={students ? students.length : "–"} sub={students && students.length === 0 ? "Share the class code to get started" : `${activeThisWeek} active this week`} />
            <StatTile label="Answers · 7 days" value={classSum.week} sub={`${classSum.month} in the last 30 days`} />
            <StatTile label="Class accuracy · 7 days" value={classSum.weekPct === null ? "–" : `${classSum.weekPct}%`}
              sub={classSum.trend === null ? "Needs a few answers each week" : `${classSum.trend >= 0 ? "▲" : "▼"} ${Math.abs(classSum.trend)} pts on last week`}
              subTone={classSum.trend === null ? undefined : classSum.trend >= 0 ? "green" : "red"} />
            <StatTile label="Needs attention" value={<span style={{ color: attention.length ? T.red : T.ink }}>{attention.length}</span>} sub="Inactive 7+ days or under 50%" />
          </div>

          <div className="cm-two-col">
            <div className="cm-main-col">
              <Card padding={0}>
                <CardHeader title="Students" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
                  right={<>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: T.soft }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>Code</span>
                      <span style={{ fontFamily: "'SF Mono', Menlo, monospace", fontWeight: 700, fontSize: 15, color: T.accentText, letterSpacing: 1 }}>{cls.code}</span>
                      <Button size="sm" icon="copy" onClick={copyCode}>{copied ? "Copied" : "Copy"}</Button>
                    </div>
                    <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 150, padding: "7px 12px", fontSize: 13 }} aria-label="Search students" />
                  </>} />
                {students && students.length === 0 && (
                  <EmptyState icon="users" title="No students yet" body={`Students enter ${cls.code} under their avatar → Join. They appear here as soon as they do, and their work shows up as they practise.`} />
                )}
                {students && students.length > 0 && (
                  <Table minWidth={760}>
                    <thead>
                      <tr>
                        <th style={{ ...th, paddingLeft: 20 }}>Student</th>
                        <th style={th}>Status</th>
                        <th style={th}>This week</th>
                        <th style={{ ...th, width: 190 }}>Accuracy · 7d</th>
                        <th style={th}>Weakest topic</th>
                        <th style={{ ...th, paddingRight: 20 }}>Last active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(({ s, sum, weekPct, flags, weakest, name }) => {
                        const isOpen = openStudent === s.uid;
                        return (
                          <React.Fragment key={s.uid}>
                            <tr className="cm-row-hover" onClick={() => setOpenStudent(isOpen ? null : s.uid)} style={{ borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                              <td style={{ ...td, paddingLeft: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <Avatar name={s.displayName} email={s.email} photoURL={s.photoURL} size={32} />
                                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                    <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                                    <span style={{ fontSize: 11, color: T.muted }}>{s.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td style={td}>
                                {flags.length === 0 ? <Chip tone="green">On track</Chip> : <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{flags.map(f => <Chip key={f.text} tone={f.tone}>{f.text}</Chip>)}</div>}
                              </td>
                              <td style={{ ...td, fontWeight: 600 }}>{sum?.week || 0} <span style={{ color: T.muted, fontWeight: 400 }}>Qs</span></td>
                              <td style={td}><AccuracyBar pct={weekPct} width={170} /></td>
                              <td style={td}>{weakest ? <Chip tone={chipToneForPct(weakest.pct)}>{weakest.label} · {weakest.pct}%</Chip> : <span style={{ color: T.muted }}>{sum ? "None under 75%" : "No data yet"}</span>}</td>
                              <td style={{ ...td, paddingRight: 20, color: T.muted }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                                  {relativeTime(sum?.last)}
                                  <Icon name="chevronDown" size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: T.faint }} />
                                </div>
                              </td>
                            </tr>
                            {isOpen && (
                              <tr style={{ background: "#FAFBFC" }}>
                                <td colSpan={6} style={{ padding: "14px 20px 18px" }}>
                                  <div className="cm-grid-3" style={{ gap: 20 }}>
                                    <TopicList title="Needs work" topics={sum?.weak?.filter(t => t.pct < 75)} empty="Not enough answers yet (3+ per topic)." />
                                    <TopicList title="Going well" topics={sum?.strong} empty="Not enough answers yet." />
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Recent</div>
                                      {!sum && <div style={{ fontSize: 12, color: T.muted }}>Nothing yet.</div>}
                                      {sum?.recent.slice(0, 6).map(a => (
                                        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "3px 0" }}>
                                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.correct ? T.green : T.red, flexShrink: 0 }} />
                                          <span style={{ fontWeight: 700, width: 44, color: T.muted }}>{TYPE_LABEL[a.type] || a.type}</span>
                                          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.topicLabel || a.topic || a.questionId}</span>
                                          {a.maxScore > 1 && <span style={{ fontWeight: 700 }}>{a.score}/{a.maxScore}</span>}
                                          <span style={{ color: T.muted, flexShrink: 0 }}>{relativeTime(attemptTime(a))}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card>
            </div>

            <aside className="cm-side-col">
              <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <CardHeader title="Needs attention" right={attention.length ? <Chip tone="red">{attention.length}</Chip> : null} />
                {attention.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Everyone is active and above 50% this week.</span>}
                {attention.slice(0, 5).map(r => (
                  <div key={r.s.uid} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 12, borderRadius: 10, background: "#FAFBFC", border: `1px solid ${T.line}` }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.flags[0].tone === "red" ? T.red : T.amber, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                      <span style={{ fontWeight: 600 }}>{r.name}</span>
                      <span style={{ fontSize: 12, color: T.muted }}>{r.flags.map(f => f.text).join(" · ")}{r.weakest ? ` · weakest: ${r.weakest.label}` : ""}</span>
                    </div>
                  </div>
                ))}
              </Card>

              <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <CardHeader title="Class weak spots" sub="Topics the class scores lowest on (8+ answers)" />
                {classSum.weak.filter(t => t.pct < 75).length === 0
                  ? <span style={{ fontSize: 13, color: T.muted }}>Nothing flagged yet. This fills in as students practise.</span>
                  : classSum.weak.filter(t => t.pct < 75).map(t => (
                    <div key={t.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}>
                        <span>{t.label}</span>
                        <span style={{ fontWeight: 700, color: pctColour(t.pct) }}>{t.pct}% <span style={{ color: T.faint, fontWeight: 400 }}>({t.c}/{t.n})</span></span>
                      </div>
                      <AccuracyBar pct={t.pct} width="100%" />
                    </div>
                  ))}
                <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10, fontSize: 12, color: T.muted }}>
                  These are the topics to record videos for first.
                </div>
              </Card>

              <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <CardHeader title="Coming next" />
                <span style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>Set homework from the question bank with a time budget and due date, review AI-marked answers, and send automatic fix-up work for weak topics.</span>
              </Card>
            </aside>
          </div>
        </>
      )}
    </>
  );
}

function TopicList({ title, topics, empty }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{title}</div>
      {(!topics || topics.length === 0) && <div style={{ fontSize: 12, color: T.muted }}>{empty}</div>}
      {topics && topics.map(t => (
        <div key={t.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "3px 0", gap: 8 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.label}</span>
          <span style={{ fontWeight: 700, color: pctColour(t.pct), flexShrink: 0 }}>{t.pct}% <span style={{ color: T.faint, fontWeight: 400 }}>({t.c}/{t.n})</span></span>
        </div>
      ))}
    </div>
  );
}

export { pct };
