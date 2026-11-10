import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment, fetchTutorClasses } from "../firebase";
import { T, boardLabel } from "../ui/theme";
import { Card, CardHeader, PageHeader, Chip, Button, Input, Notice, EmptyState, Icon } from "../ui/components";
import { sourcesFor, buildItems, totals, describeItems, TYPE_LABEL, MIN_PER_MARK } from "../utils/homeworkBank";
import { YearToggle } from "./McqTab";
import usePpq from "../hooks/usePpq";
import { topicsFor, seriesLabel, LEVEL_LABEL, KIND_LABEL } from "./ppq/ppqUtils";

const PPQ_KINDS = ["mcq", "structured", "extended", "calculation", "practical"];
const TYPE_TONE = { mcq: "red", calc: "accent", exam: "amber", extended: "indigo", ppq: "green" };

const DIFFS = [{ id: "easy", label: "Easy" }, { id: "medium", label: "Medium" }, { id: "hard", label: "Hard" }, { id: "exam", label: "Exam style" }];

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
  const [mcqTopics, setMcqTopics] = useState([]);
  const [calcSets, setCalcSets] = useState([]);
  const [calcDiffs, setCalcDiffs] = useState(["easy", "medium", "hard"]);
  const [extCats, setExtCats] = useState([]);
  const [examTopics, setExamTopics] = useState([]);
  const [examTags, setExamTags] = useState([]);
  const [ppqTopics, setPpqTopics] = useState([]);
  const [ppqKinds, setPpqKinds] = useState(["structured", "extended", "calculation", "practical"]);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser?.uid) return;
    fetchTutorClasses(authUser.uid).then(c => { setClasses(c); if (c.length > 0) setClassId(c[0].code); }).catch(e => { setError(e.message); setClasses([]); });
  }, [authUser]);

  const cls = classes?.find(c => c.code === classId);
  const board = cls?.board || "aqa";
  const src = useMemo(() => sourcesFor(board), [board]);
  const mcqTopicsShown = src.mcqTopics.filter(t => year === "a2" || t.level === "AS");
  const calcSetsShown = src.calcSets.filter(s => year === "a2" || s.year !== "a2");

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
      if (year === "as" && t.year === 2) continue;
      let m = mods.find(x => x.id === t.module);
      if (!m) { m = { id: t.module, title: t.moduleTitle, topics: [] }; mods.push(m); }
      m.topics.push(t);
    }
    return mods;
  }, [board, year]);
  const ppqPool = useMemo(() => ppqCandidates.filter(it => (it.topics || []).some(t => ppqTopics.includes(t))), [ppqCandidates, ppqTopics]);

  const flip = (set, id) => set(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const anySource = mcqTopics.length + calcSets.length + extCats.length + examTopics.length + ppqPool.length > 0;

  const fill = () => {
    setItems(buildItems({ board, minutes: Number(minutes) || 60, mcqTopics, calcSets, calcDifficulties: calcDiffs, extCategories: extCats, examTopics, examTags, ppqPool }));
  };
  const remove = (key) => setItems(prev => prev.filter(it => it.key !== key));
  const tot = totals(items);

  const assign = async () => {
    if (!cls || !title.trim() || items.length === 0) return;
    setSaving(true); setError(null);
    try {
      const dueAt = due ? new Date(due + "T23:59:00").getTime() : null;
      await createAssignment(authUser.uid, {
        title: title.trim(), classId: cls.code, board, minutes: Number(minutes) || tot.minutes, dueAt, note: note.trim() || null,
        items, summary: describeItems(items), maxScore: tot.marks,
      });
      navigate("/tutor/homework");
    } catch (e) { setError(e.message || "Could not set the homework"); }
    setSaving(false);
  };

  const field = { display: "flex", flexDirection: "column", gap: 6 };
  const label = { fontSize: 12, fontWeight: 600, color: T.muted };

  return (
    <>
      <PageHeader eyebrow="Homework" title="Set homework" sub={`Pick the topics, give it a time budget and the builder fills it at ${MIN_PER_MARK} minutes per mark. Remove anything you don't want before assigning.`}
        right={<Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/tutor/homework")}>All homework</Button>} />
      {error && <Notice tone="red">{error}</Notice>}
      {classes && classes.length === 0 && <Card padding={0}><EmptyState icon="users" title="Create a group first" body="Homework is set for a group. Create one on the Overview tab, then come back here." action={<Button variant="primary" onClick={() => navigate("/tutor")}>Overview</Button>} /></Card>}

      {cls && (
        <div className="cm-two-col">
          <div className="cm-main-col">
            <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CardHeader title="Details" />
              <div className="cm-grid-2" style={{ gap: 14 }}>
                <div style={field}><label htmlFor="hw-class" style={label}>Group</label>
                  <select id="hw-class" value={classId} onChange={e => { setClassId(e.target.value); setMcqTopics([]); setCalcSets([]); setExtCats([]); setExamTags([]); setPpqTopics([]); setItems([]); }}
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

            <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CardHeader title="Sources" sub={`${boardLabel(board)} banks`} right={<YearToggle value={year} onChange={setYear} />} />
              <div style={field}><span style={label}>MCQ topics</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {mcqTopicsShown.length === 0 && <span style={{ fontSize: 12, color: T.muted }}>No MCQ bank for this board yet.</span>}
                  {mcqTopicsShown.map(t => <Toggle key={t.id} on={mcqTopics.includes(t.id)} onClick={() => flip(setMcqTopics, t.id)} count={t.questionCount}>{t.id.startsWith("OCR-P") ? t.name : `${t.id} ${t.name}`}</Toggle>)}
                </div></div>
              <div style={field}><span style={label}>Calculation sets</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{calcSetsShown.map(s => <Toggle key={s.id} on={calcSets.includes(s.id)} onClick={() => flip(setCalcSets, s.id)} count={s.count}>{s.title}</Toggle>)}</div>
                {calcSets.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}><span style={{ ...label, alignSelf: "center" }}>Difficulty:</span>{DIFFS.map(d => <Toggle key={d.id} on={calcDiffs.includes(d.id)} onClick={() => flip(setCalcDiffs, d.id)}>{d.label}</Toggle>)}</div>}
              </div>
              <div style={field}><span style={label}>Extended answers (AI marked, levels of response)</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{src.extCategories.map(c => <Toggle key={c.id} on={extCats.includes(c.id)} onClick={() => flip(setExtCats, c.id)} count={c.count}>{c.id}</Toggle>)}</div></div>
              <div style={field}><span style={label}>Exam-style questions (parts a, b, c)</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {src.examTopics.length === 0 && <span style={{ fontSize: 12, color: T.muted }}>None written yet. Add questions in src/data/exam-questions.js using QUESTION_TEMPLATE.md.</span>}
                  {src.examTopics.map(t => <Toggle key={t.id} on={examTopics.includes(t.id)} onClick={() => flip(setExamTopics, t.id)} count={t.count}>{t.id}</Toggle>)}
                </div>
                {src.examTopics.filter(t => examTopics.includes(t.id) && t.tags.length > 1).map(t => (
                  <div key={t.id} style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: T.muted, marginRight: 4 }}>{t.id}: narrow to</span>
                    {t.tags.map(tag => <Toggle key={tag.id} on={examTags.includes(tag.id)} onClick={() => flip(setExamTags, tag.id)} count={tag.count}>{tag.id}</Toggle>)}
                  </div>
                ))}
                {examTopics.length > 0 && <span style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>A topic is used whole unless you pick tags inside it.</span>}
              </div>
              <div style={field}><span style={label}>Past-paper questions (real exam questions, AI marked against the mark scheme)</span>
                {ppq.loading && <span style={{ fontSize: 12, color: T.muted }}>Loading the past-paper index…</span>}
                {ppq.error && <span style={{ fontSize: 12, color: T.red }}>{ppq.error}</span>}
                {!ppq.loading && !ppq.error && (
                  <>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <span style={{ ...label, alignSelf: "center" }}>Question types:</span>
                      {PPQ_KINDS.map(k => <Toggle key={k} on={ppqKinds.includes(k)} onClick={() => flip(setPpqKinds, k)}>{KIND_LABEL[k] || k}</Toggle>)}
                    </div>
                    {ppqModules.map(m => {
                      const shown = m.topics.filter(t => ppqByTopic[t.ref]);
                      if (shown.length === 0) return null;
                      return (
                        <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>{m.title}</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {shown.map(t => <Toggle key={t.ref} on={ppqTopics.includes(t.ref)} onClick={() => flip(setPpqTopics, t.ref)} count={ppqByTopic[t.ref]}>{board === "edexcel" ? `T${t.ref} ${t.title}` : `${t.ref} ${t.title}`}</Toggle>)}
                          </div>
                        </div>
                      );
                    })}
                    {ppqTopics.length > 0 && <span style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{ppqPool.length} question{ppqPool.length === 1 ? "" : "s"} to draw from. Students answer by typing, drawing on the paper or photographing their work; their first marked attempt counts.</span>}
                  </>
                )}
              </div>
              <div><Button variant="accent" icon="bolt" onClick={fill} disabled={!anySource}>{items.length ? "Refill" : "Fill"} {minutes} minutes</Button></div>
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
                    <Chip tone={TYPE_TONE[it.type] || "neutral"} style={{ padding: "2px 8px", fontSize: 11 }}>{TYPE_LABEL[it.type]}</Chip>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={it.type === "ppq" ? `${LEVEL_LABEL[it.level] || ""} Paper ${it.paper} · ${seriesLabel(it.series, it.year)} · Q${it.q}` : undefined}>{it.topicLabel}{it.type === "ppq" ? ` · ${seriesLabel(it.series, it.year)} P${it.paper} Q${it.q}` : ""}{it.difficulty ? ` · ${it.difficulty}` : ""}{it.tier ? ` · tier ${it.tier}` : ""}</span>
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
