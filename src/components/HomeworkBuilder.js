import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAssignment, fetchTutorClasses, fetchPpqQuestion, fetchLesson, fetchTutorSessions, fetchTutorLessons, updateLesson, fetchOpenErrorLogForGroup } from "../firebase";
import { typeShort, isDue } from "../utils/errorLog";
import { fmtLessonDay, addDays, isoDate } from "../utils/schedule";
import { T, boardLabel } from "../ui/theme";
import chemFormat from "../utils/chemFormat";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Notice, EmptyState, Icon } from "../ui/components";
import { buildItems, ppqItem, ppqItemWithParts, describeParts, totals, describeItems, MIN_PER_MARK } from "../utils/homeworkBank";
import { YearToggle } from "./McqTab";
import usePpq from "../hooks/usePpq";
import { topicsFor, seriesLabel, paperLabel, paperShort, LEVEL_LABEL, KIND_LABEL } from "./ppq/ppqUtils";

/** "ph weak -buffer": every plain word must appear in the title or keywords, no "-word" may. */
function matchesSearch(q, search) {
  const hay = `${q.title || ""} ${(q.keywords || []).join(" ")} ${(q.topics || []).join(" ")}`.toLowerCase();
  for (const tok of search.toLowerCase().split(/\s+/).filter(Boolean)) {
    if (tok.startsWith("-")) { if (tok.length > 1 && hay.includes(tok.slice(1))) return false; }
    else if (!hay.includes(tok)) return false;
  }
  return true;
}

// Homework is set from real past-paper questions only (HSJ decision, 10 Nov
// 2026). The HSJ-written tiered banks are for students' own revision.
const PPQ_KINDS = ["mcq", "structured", "extended", "calculation", "practical"];

function Toggle({ on, onClick, children, count }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 600,
      border: `1px solid ${on ? T.accentText : T.border}`, background: on ? T.accentTint : T.card, color: on ? T.accentText : T.body,
    }}>
      {on && <Icon name="check" size={12} strokeWidth={3} />}{children}{count !== undefined && <span style={{ color: on ? T.accentText : T.faint, fontWeight: 500 }}>{count}</span>}
    </button>
  );
}

export default function HomeworkBuilder({ authUser }) {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(null);
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [due, setDue] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10); });
  const [note, setNote] = useState("");
  const [year, setYear] = useState("as");
  const [ppqTopics, setPpqTopics] = useState([]);
  const [ppqKinds, setPpqKinds] = useState(["structured", "extended", "calculation", "practical"]);
  const [items, setItems] = useState([]);
  const [openModules, setOpenModules] = useState({});
  const [search, setSearch] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [openParts, setOpenParts] = useState({});   // qid -> true when the parts are shown
  const [docs, setDocs] = useState({});             // qid -> ppq document (loaded when parts are opened)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [logEntries, setLogEntries] = useState([]);   // the group's open error-log entries
  // "Set homework from this lesson": /tutor/homework/new?lesson=ID prefills the
  // group, the lesson's spec topics, a title, the due date (the day before the
  // next lesson) and fills the questions once, for the tutor to check and send.
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lesson");
  const [lesson, setLesson] = useState(null);
  const autoFilled = useRef(false);

  useEffect(() => {
    if (!authUser?.uid) return;
    fetchTutorClasses(authUser.uid).then(c => { setClasses(c); if (c.length > 0) setClassId(c[0].code); }).catch(e => { setError(e.message); setClasses([]); });
  }, [authUser]);

  const cls = classes?.find(c => c.code === classId);
  const board = cls?.board || "aqa";

  const classCode = cls?.code || null;
  useEffect(() => {
    if (!classCode) { setLogEntries([]); return undefined; }
    let alive = true;
    fetchOpenErrorLogForGroup(classCode).then(d => alive && setLogEntries(d)).catch(() => alive && setLogEntries([]));
    return () => { alive = false; };
  }, [classCode]);

  useEffect(() => {
    if (!lessonId || !classes || classes.length === 0 || !authUser?.uid) return undefined;
    let alive = true;
    (async () => {
      try {
        const l = await fetchLesson(lessonId);
        if (!alive) return;
        if (!l) { setError("That lesson no longer exists, so nothing was prefilled."); return; }
        const group = classes.find(c => c.code === l.classId);
        if (!group) { setError("That lesson's group is not one of yours, so nothing was prefilled."); return; }
        const all = topicsFor(group.board);
        const refs = (l.topics || []).map(t => String(t).split(" ")[0]).filter(r => all.some(x => x.ref === r));
        const picked = all.filter(t => refs.includes(t.ref));
        const titles = picked.map(t => t.title);
        const when = fmtLessonDay(l.date);
        setLesson(l);
        setClassId(group.code);
        setPpqTopics(refs);
        setOpenModules(Object.fromEntries(picked.map(t => [t.module, true])));
        setYear(picked.some(t => Number(t.year) === 13) ? "a2" : "as");
        setTitle(`${titles.length ? (titles.length > 3 ? `${titles.slice(0, 3).join(", ")} and more` : titles.join(", ")) : "Homework"} (lesson ${when})`);
        if (l.summary) setNote(`From the lesson on ${when}: ${l.summary}`);
        // Due the day before the group's next lesson, if one is on the calendar
        try {
          const sessions = await fetchTutorSessions(authUser.uid);
          const next = sessions.filter(x => x.classId === l.classId && !x.studentIds && x.status !== "cancelled" && x.date > l.date).sort((a, b) => a.date.localeCompare(b.date))[0];
          if (next && alive) {
            const dayBefore = addDays(next.date, -1);
            setDue(dayBefore > isoDate(new Date()) ? dayBefore : next.date);
          }
        } catch { /* keep the default due date */ }
      } catch (e) { if (alive) setError(e.message); }
    })();
    return () => { alive = false; };
  }, [lessonId, classes, authUser]);
  // Past-paper questions: the index for this board, narrowed to the chosen
  // level, spec topics and question kinds. AS homework uses AS papers only;
  // A2 homework can draw on both levels.
  const ppq = usePpq(board, null);
  const ppqCandidates = useMemo(() => ppq.items.filter(it => (year === "a2" || it.level === "as") && ppqKinds.includes(it.kind || "structured")), [ppq.items, year, ppqKinds]);
  const ppqByTopic = useMemo(() => {
    const n = {};
    for (const it of ppqCandidates) for (const t of it.topics || []) n[t] = (n[t] || 0) + 1;
    return n;
  }, [ppqCandidates]);
  const ppqModules = useMemo(() => {
    const mods = [];
    for (const t of topicsFor(board)) {
      if (year === "as" && Number(t.year) === 13) continue; // modules carry 12 or 13
      let m = mods.find(x => x.id === t.module);
      if (!m) { m = { id: t.module, title: t.moduleTitle, topics: [] }; mods.push(m); }
      m.topics.push(t);
    }
    return mods;
  }, [board, year]);
  const ppqPool = useMemo(() => ppqCandidates.filter(it => (it.topics || []).some(t => ppqTopics.includes(t))), [ppqCandidates, ppqTopics]);
  // The questions on offer: the pool, narrowed by the search box. Both the
  // tick boxes and the auto-fill draw from this list, so searching "ph -buffer"
  // keeps buffer questions out of a fill as well.
  const shownQuestions = useMemo(() => {
    const list = search.trim() ? ppqPool.filter(q => matchesSearch(q, search.trim())) : ppqPool;
    return list.slice().sort((a, b) => (a.topics?.[0] || "").localeCompare(b.topics?.[0] || "", undefined, { numeric: true }) || (b.year || 0) - (a.year || 0) || (a.q || 0) - (b.q || 0));
  }, [ppqPool, search]);
  const chosen = useMemo(() => new Set(items.filter(it => it.type === "ppq").map(it => it.questionId)), [items]);
  // Past-paper questions the group's students have in their error logs, most
  // retests due first, so the tutor can set them again two weeks on.
  const retestQs = useMemo(() => {
    const byQ = {};
    for (const e of logEntries) {
      const q = ppq.items.find(it => it.id === e.questionId);
      if (!q) continue;
      const r = byQ[q.id] || (byQ[q.id] = { q, students: new Set(), due: 0, cats: {} });
      r.students.add(e.uid); if (isDue(e)) r.due++; r.cats[e.category] = (r.cats[e.category] || 0) + 1;
    }
    return Object.values(byQ).map(r => ({ ...r, n: r.students.size, cats: Object.entries(r.cats).sort((a, b) => b[1] - a[1]).map(([c]) => typeShort(c)) }))
      .sort((a, b) => b.due - a.due || b.n - a.n);
  }, [logEntries, ppq.items]);

  const flip = (set, id) => set(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const anySource = shownQuestions.length > 0;

  const fill = () => {
    setItems(buildItems({ board, minutes: Number(minutes) || 60, ppqPool: shownQuestions }));
  };
  // Prefilled from a lesson: fill once as soon as the index gives a pool
  useEffect(() => {
    if (!lesson || autoFilled.current || ppq.loading || ppqTopics.length === 0) return;
    if (shownQuestions.length === 0) return;
    autoFilled.current = true;
    setItems(buildItems({ board, minutes: Number(minutes) || 60, ppqPool: shownQuestions }));
  }, [lesson, ppq.loading, ppqTopics, shownQuestions, board, minutes]);
  const remove = (key) => setItems(prev => prev.filter(it => it.key !== key));
  const toggleQuestion = (q) => setItems(prev => chosen.has(q.id) ? prev.filter(it => it.questionId !== q.id) : [...prev, ppqItem(q)]);
  const openQuestionParts = async (q) => {
    setOpenParts(o => ({ ...o, [q.id]: !o[q.id] }));
    if (docs[q.id]) return;
    try { const d = await fetchPpqQuestion(q.id); setDocs(ds => ({ ...ds, [q.id]: d || { parts: [] } })); }
    catch (e) { setError(e.message); }
  };
  // Tick or untick one part: the item is added if needed, narrowed to the kept parts, or removed when none are left
  const togglePart = (q, label) => {
    const d = docs[q.id]; if (!d) return;
    const all = (d.parts || []).map(p => p.label);
    setItems(prev => {
      const cur = prev.find(it => it.questionId === q.id);
      const kept = cur ? (Array.isArray(cur.parts) ? cur.parts : all) : [];
      const next = kept.includes(label) ? kept.filter(l => l !== label) : [...kept, label];
      if (next.length === 0) return prev.filter(it => it.questionId !== q.id);
      const made = ppqItemWithParts(cur || ppqItem(q), d.parts, next);
      return cur ? prev.map(it => it.questionId === q.id ? made : it) : [...prev, made];
    });
  };
  const partsKept = (qid) => { const it = items.find(x => x.questionId === qid); if (!it) return new Set(); return Array.isArray(it.parts) ? new Set(it.parts) : null; }; // null = all
  const addShown = () => setItems(prev => [...prev, ...shownQuestions.filter(q => !chosen.has(q.id)).map(ppqItem)]);
  const removeShown = () => { const ids = new Set(shownQuestions.map(q => q.id)); setItems(prev => prev.filter(it => !ids.has(it.questionId))); };
  const topicShort = (ref) => { const t = topicsFor(board).find(x => x.ref === ref); return t ? (board === "edexcel" ? `T${t.ref} ${t.title}` : `${t.ref} ${t.title}`) : ref; };
  const tot = totals(items);

  const assign = async () => {
    if (!cls || !title.trim() || items.length === 0) return;
    setSaving(true); setError(null);
    try {
      const dueAt = due ? new Date(due + "T23:59:00").getTime() : null;
      // Set from the Homework tab: attach to the group's most recent lesson that
      // has no homework yet, so it shows under that lesson's notes too.
      let target = lesson;
      if (!target) {
        try {
          const today = isoDate(new Date());
          target = (await fetchTutorLessons(authUser.uid)).filter(l => l.classId === cls.code && !l.homeworkAssignmentId && l.date <= today).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
        } catch { target = null; }
      }
      const made = await createAssignment(authUser.uid, {
        title: title.trim(), classId: cls.code, board, minutes: Number(minutes) || tot.minutes, dueAt, note: note.trim() || null,
        items, summary: describeItems(items), maxScore: tot.marks, lessonId: target?.id || null,
      });
      if (target) await updateLesson(target.id, { homeworkAssignmentId: made.id, homeworkAssignmentTitle: title.trim() }).catch(() => {});
      if (lesson) navigate(`/tutor/lessons/${lesson.id}`); else navigate("/tutor/homework");
    } catch (e) { setError(e.message || "Could not set the homework"); }
    setSaving(false);
  };

  const field = { display: "flex", flexDirection: "column", gap: 6 };
  const label = { fontSize: 12, fontWeight: 600, color: T.muted };

  return (
    <>
      <PageHeader eyebrow="Homework" title={lesson ? "Homework from this lesson" : "Set homework"} sub={lesson ? `Drafted from the ${lesson.className || lesson.classId} lesson on ${fmtLessonDay(lesson.date)}: the spec topics you ticked are picked and the questions filled to the time budget. Untick anything you did not cover (or search, e.g. "ph -buffer"), then Set homework.` : `Pick the spec topics, then tick the past-paper questions you want, or give it a time budget and let Fill choose at ${MIN_PER_MARK} minutes per mark. Remove anything you don't want before assigning.`}
        right={lesson ? <Button variant="secondary" icon="arrowLeft" onClick={() => navigate(`/tutor/lessons/${lesson.id}`)}>Back to the lesson</Button> : <Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/tutor/homework")}>All homework</Button>} />
      {lesson && !ppq.loading && ppqTopics.length > 0 && ppqPool.length === 0 && <Notice tone="amber">No past-paper questions in the index match the topics ticked on this lesson. Pick a neighbouring topic below.</Notice>}
      {lesson && ppqTopics.length === 0 && <Notice tone="amber">This lesson has no spec topics ticked, so nothing could be picked. Choose the topics below.</Notice>}
      {error && <Notice tone="red">{error}</Notice>}
      {classes && classes.length === 0 && <Card padding={0}><EmptyState icon="users" title="Create a group first" body="Homework is set for a group. Create one on the Overview tab, then come back here." action={<Button variant="primary" onClick={() => navigate("/tutor")}>Overview</Button>} /></Card>}

      {cls && (
        <div className="cm-two-col">
          <div className="cm-main-col">
            <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CardHeader title="Details" />
              <div className="cm-grid-2" style={{ gap: 14 }}>
                <div style={field}><label htmlFor="hw-class" style={label}>Group</label>
                  <select id="hw-class" value={classId} onChange={e => { setClassId(e.target.value); setPpqTopics([]); setItems([]); }}
                    style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, fontSize: 14, color: T.ink }}>
                    {classes.map(c => <option key={c.code} value={c.code}>{c.name} ({boardLabel(c.board)})</option>)}
                  </select></div>
                <div style={field}><label htmlFor="hw-title" style={label}>Title</label><Input id="hw-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Born-Haber cycles" /></div>
                <div style={field}><label htmlFor="hw-min" style={label}>Time budget (minutes)</label><Input id="hw-min" type="number" min={10} max={240} value={minutes} onChange={e => setMinutes(e.target.value)} /></div>
                <div style={field}><label htmlFor="hw-due" style={label}>Due</label><Input id="hw-due" type="date" value={due} onChange={e => setDue(e.target.value)} /></div>
              </div>
              <div style={field}><label htmlFor="hw-note" style={label}>Note to students (optional)</label>
                <textarea id="hw-note" value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="e.g. Show your working in the calculations. Method marks are given even if the final value is off."
                  style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, color: T.ink, resize: "vertical", fontFamily: "inherit" }} /></div>
            </Card>

            {retestQs.length > 0 && (
              <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <CardHeader title="Retest from the error log" sub="Questions this group's students lost marks on and filed. Those marked due were logged two weeks or more ago."
                  right={<Button size="sm" onClick={() => setItems(prev => [...prev, ...retestQs.filter(r => r.due > 0 && !chosen.has(r.q.id)).map(r => ppqItem(r.q))])} disabled={!retestQs.some(r => r.due > 0 && !chosen.has(r.q.id))}>Tick all due</Button>} />
                <div style={{ border: `1px solid ${T.line}`, borderRadius: T.radiusSm, maxHeight: 260, overflowY: "auto" }}>
                  {retestQs.map((r, i) => {
                    const on = chosen.has(r.q.id);
                    return (
                      <label key={r.q.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", cursor: "pointer", fontSize: 12, borderTop: i ? `1px solid ${T.line}` : "none", background: on ? T.accentTint : "transparent" }}>
                        <input type="checkbox" checked={on} onChange={() => toggleQuestion(r.q)} style={{ accentColor: T.accent }} />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontWeight: 600, color: T.ink }}>{chemFormat(r.q.title) || `Question ${r.q.q}`}</span>
                          <span style={{ display: "block", color: T.muted, fontSize: 11 }}>{r.n} student{r.n === 1 ? "" : "s"} · {r.cats.join(", ")} · {LEVEL_LABEL[r.q.level] || ""} {seriesLabel(r.q.series, r.q.year)} {paperShort(r.q)} Q{r.q.q}</span>
                        </span>
                        {r.due > 0 ? <Chip tone="red" style={{ padding: "2px 8px", fontSize: 11 }}>{r.due} due</Chip> : <Chip tone="neutral" style={{ padding: "2px 8px", fontSize: 11 }}>Not yet due</Chip>}
                        <span style={{ color: T.muted, whiteSpace: "nowrap" }}>{r.q.totalMarks} mk</span>
                        <a href={`/${board}/practise/${r.q.id}`} target="_blank" rel="noopener noreferrer" className="cm-link" onClick={e => e.stopPropagation()} style={{ fontSize: 11, whiteSpace: "nowrap" }}>View</a>
                      </label>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CardHeader title="Past-paper questions" sub={`${boardLabel(board)} papers, marked by the AI examiner against the real mark scheme`} right={<YearToggle value={year} onChange={setYear} />} />
              <div style={field}>
                {ppq.loading && <span style={{ fontSize: 12, color: T.muted }}>Loading the past-paper index…</span>}
                {ppq.error && <span style={{ fontSize: 12, color: T.red }}>{ppq.error}</span>}
                {!ppq.loading && !ppq.error && (
                  <>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <span style={{ ...label, alignSelf: "center" }}>Question types:</span>
                      {PPQ_KINDS.map(k => <Toggle key={k} on={ppqKinds.includes(k)} onClick={() => flip(setPpqKinds, k)}>{KIND_LABEL[k] || k}</Toggle>)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                      {ppqModules.map(m => {
                        const shown = m.topics.filter(t => ppqByTopic[t.ref]);
                        if (shown.length === 0) return null;
                        const picked = shown.filter(t => ppqTopics.includes(t.ref));
                        const isOpen = openModules[m.id] ?? false;
                        const n = shown.reduce((a, t) => a + ppqByTopic[t.ref], 0);
                        return (
                          <div key={m.id} style={{ border: `1px solid ${picked.length ? T.accentText : T.border}`, borderRadius: T.radiusSm, overflow: "hidden" }}>
                            <button type="button" onClick={() => setOpenModules(o => ({ ...o, [m.id]: !isOpen }))} className="cm-row-hover" aria-expanded={isOpen}
                              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", background: picked.length ? T.accentTint : "transparent", border: "none", cursor: "pointer", color: T.ink, fontFamily: "inherit" }}>
                              <Icon name="chevronDown" size={14} color={T.muted} style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
                              <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{m.title}</span>
                              {picked.length > 0 && <Chip tone="accent">{picked.length} picked</Chip>}
                              <span style={{ fontSize: 11, color: T.faint }}>{n} question{n === 1 ? "" : "s"}</span>
                            </button>
                            {isOpen && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "4px 12px 12px" }}>
                                {shown.map(t => <Toggle key={t.ref} on={ppqTopics.includes(t.ref)} onClick={() => flip(setPpqTopics, t.ref)} count={ppqByTopic[t.ref]}>{board === "edexcel" ? `T${t.ref} ${t.title}` : `${t.ref} ${t.title}`}</Toggle>)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {ppqTopics.length === 0 && ppqModules.length > 0 && <span style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>Open a module and pick one or more topics. {year === "as" ? "AS homework draws on AS papers only." : "A2 homework draws on AS and A-level papers."}</span>}
                  </>
                )}
              </div>

              {ppqTopics.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Choose the questions</span>
                    <span style={{ fontSize: 11, color: T.muted }}>{shownQuestions.length} of {ppqPool.length} shown · {chosen.size} ticked</span>
                    <Button size="sm" variant="ghost" onClick={() => setShowQuestions(v => !v)}>{showQuestions ? "Hide list" : "Show list"}</Button>
                  </div>
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder='Narrow by what you taught, e.g. "weak acid" or "ph -buffer" (a minus leaves that word out)' aria-label="Search questions" />
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Button size="sm" onClick={addShown} disabled={shownQuestions.length === 0}>Tick all shown</Button>
                    <Button size="sm" onClick={removeShown} disabled={shownQuestions.every(q => !chosen.has(q.id))}>Untick all shown</Button>
                    <span style={{ fontSize: 11, color: T.faint, alignSelf: "center" }}>Tick questions yourself, or let Fill choose from the ones shown.</span>
                  </div>
                  {showQuestions && (
                    <div style={{ maxHeight: 380, overflowY: "auto", border: `1px solid ${T.line}`, borderRadius: T.radiusSm }}>
                      {shownQuestions.length === 0 && <div style={{ padding: 14, fontSize: 12, color: T.muted }}>No questions match. Try fewer words.</div>}
                      {shownQuestions.map((q, i) => {
                        const on = chosen.has(q.id);
                        const it = on ? items.find(x => x.questionId === q.id) : null;
                        const kept = partsKept(q.id);
                        const d = docs[q.id];
                        const isOpen = !!openParts[q.id];
                        return (
                          <div key={q.id} style={{ borderTop: i ? `1px solid ${T.line}` : "none", background: on ? T.accentTint : "transparent" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>
                              <input type="checkbox" checked={on} onChange={() => toggleQuestion(q)} style={{ accentColor: T.accent }} />
                              <span style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontWeight: 600, color: T.ink }}>{chemFormat(q.title) || `Question ${q.q}`}</span>
                                <span style={{ display: "block", color: T.muted, fontSize: 11 }}>{topicShort((q.topics || [])[0])} · {LEVEL_LABEL[q.level] || ""} {seriesLabel(q.series, q.year)} {paperShort(q)} Q{q.q}{(q.keywords || []).length ? ` · ${q.keywords.slice(0, 4).join(", ")}` : ""}{it && describeParts(it) ? ` · ${describeParts(it)}` : ""}</span>
                              </span>
                              <Chip tone={on ? "accent" : "neutral"} style={{ padding: "2px 8px", fontSize: 11 }}>{KIND_LABEL[q.kind] || "Structured"}</Chip>
                              <span style={{ color: T.muted, whiteSpace: "nowrap" }}>{it && it.parts ? `${it.marks} of ${q.totalMarks}` : q.totalMarks} mk</span>
                              <button type="button" onClick={e => { e.preventDefault(); openQuestionParts(q); }} className="cm-link" style={{ border: "none", background: "transparent", padding: 0, fontSize: 11, whiteSpace: "nowrap", cursor: "pointer", fontFamily: "inherit" }}>{isOpen ? "Hide parts" : "Parts"}</button>
                              <a href={`/${board}/practise/${q.id}`} target="_blank" rel="noopener noreferrer" className="cm-link" onClick={e => e.stopPropagation()} style={{ fontSize: 11, whiteSpace: "nowrap" }}>View</a>
                            </label>
                            {isOpen && (
                              <div style={{ padding: "0 12px 10px 34px", display: "flex", flexDirection: "column", gap: 4 }}>
                                {!d && <span style={{ fontSize: 11, color: T.muted }}>Loading parts…</span>}
                                {d && (d.parts || []).length === 0 && <span style={{ fontSize: 11, color: T.muted }}>This question has no separate parts.</span>}
                                {d && (d.parts || []).map(p => {
                                  const pOn = on && (kept === null || kept.has(p.label));
                                  return (
                                    <label key={p.label === "" ? "q" : p.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, cursor: "pointer", color: pOn ? T.ink : T.muted }}>
                                      <input type="checkbox" checked={pOn} onChange={() => togglePart(q, p.label)} style={{ accentColor: T.accent, marginTop: 2 }} />
                                      <span style={{ fontWeight: 700, minWidth: 28 }}>{p.label || "Q"}</span>
                                      <span style={{ flex: 1 }}>{p.ask}</span>
                                      <span style={{ color: T.faint, whiteSpace: "nowrap" }}>{p.marks} mk</span>
                                    </label>
                                  );
                                })}
                                {d && (d.parts || []).length > 0 && <span style={{ fontSize: 11, color: T.faint }}>Untick the parts you have not taught yet. The student sees and is marked on the ticked parts only.</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Button variant="accent" icon="bolt" onClick={fill} disabled={!anySource}>{items.length ? "Refill" : "Fill"} {minutes} minutes</Button>
                {ppqTopics.length > 0 && <span style={{ fontSize: 11, color: T.faint }}>Replaces the list with an automatic pick from the {shownQuestions.length} question{shownQuestions.length === 1 ? "" : "s"} shown. Your own ticks are kept if you tick after filling.</span>}
              </div>
            </Card>
          </div>

          <aside className="cm-side-col">
            <Card padding={0} style={{ position: "sticky", top: 80 }}>
              <CardHeader title="This homework" sub={items.length ? `${describeItems(items)}` : "Nothing added yet"} style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
              <div style={{ padding: "12px 20px", display: "flex", gap: 16, borderBottom: `1px solid ${T.line}` }}>
                <div><div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800 }}>{tot.marks}</div><div style={{ fontSize: 11, color: T.muted }}>marks</div></div>
                <div><div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, color: tot.minutes > Number(minutes) * 1.15 ? T.amber : T.ink }}>{tot.minutes}</div><div style={{ fontSize: 11, color: T.muted }}>min estimated</div></div>
                <div><div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800 }}>{tot.count}</div><div style={{ fontSize: 11, color: T.muted }}>questions</div></div>
              </div>
              <div style={{ maxHeight: 420, overflowY: "auto" }}>
                {items.map((it, i) => (
                  <div key={it.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 20px", borderBottom: `1px solid ${T.line}`, fontSize: 12 }}>
                    <span style={{ color: T.faint, width: 18 }}>{i + 1}</span>
                    <Chip tone="green" style={{ padding: "2px 8px", fontSize: 11 }}>{KIND_LABEL[it.kind] || "Structured"}</Chip>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={`${paperLabel(it)} · ${seriesLabel(it.series, it.year)} · Q${it.q}${describeParts(it) ? ` · ${describeParts(it)}` : ""}`}>{it.topicLabel} · {seriesLabel(it.series, it.year)} {paperShort(it)} Q{it.q}{describeParts(it) ? ` (${it.parts.map(l => l === "" ? "q" : l).join(", ")})` : ""}</span>
                    <span style={{ color: T.muted, whiteSpace: "nowrap" }}>{it.marks} mk</span>
                    <button onClick={() => remove(it.key)} aria-label="Remove" style={{ border: "none", background: "transparent", color: T.faint, cursor: "pointer", padding: 2 }}><Icon name="x" size={14} /></button>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <Button variant="primary" size="lg" onClick={assign} disabled={saving || !title.trim() || items.length === 0}>{saving ? "Assigning…" : `Assign to ${cls.name}`}</Button>
                {!title.trim() && items.length > 0 && <span style={{ fontSize: 12, color: T.muted }}>Give it a title to assign.</span>}
              </div>
            </Card>
          </aside>
        </div>
      )}
    </>
  );
}
