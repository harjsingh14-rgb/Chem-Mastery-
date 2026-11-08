import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { T, pctColour, boardLabel } from "../ui/theme";
import { LessonNotesCard } from "./StudentLessons";
import { Card, CardHeader, PageHeader, Chip, StatTile, AccuracyBar, EmptyState, Button, IconTile, Table, th, td, chipToneForPct } from "../ui/components";
import PracticeGrid from "./PracticeGrid";
import { useHomework, HomeworkRow } from "./StudentHomework";
import useAttempts from "../hooks/useAttempts";
import { summarise, groupBySection } from "../utils/analytics";

const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const longDate = () => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export function AccuracySpark({ weekly, accent = T.accent }) {
  // weekly: [{n, pct}] oldest -> newest
  const pts = weekly.map((w, i) => ({ x: 40 + i * (260 / Math.max(1, weekly.length - 1)), y: w.pct === null ? null : 100 - (w.pct * 0.9) }));
  const valid = pts.filter(p => p.y !== null);
  const last = [...weekly].reverse().find(w => w.pct !== null);
  if (valid.length < 2) return <div style={{ fontSize: 12, color: T.muted, padding: "8px 0" }}>Practise for two or more weeks to see a trend.</div>;
  return (
    <svg viewBox="0 0 320 120" width="100%" height="120" role="img" aria-label="Weekly accuracy trend">
      <line x1="30" y1="10" x2="30" y2="100" stroke={T.line} />
      <line x1="30" y1="100" x2="310" y2="100" stroke={T.line} />
      <line x1="30" y1="55" x2="310" y2="55" stroke={T.line} strokeDasharray="3 3" />
      <text x="4" y="14" fontSize="10" fill={T.muted}>100</text>
      <text x="10" y="59" fontSize="10" fill={T.muted}>50</text>
      <text x="16" y="104" fontSize="10" fill={T.muted}>0</text>
      <polyline fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" points={valid.map(p => `${p.x},${p.y}`).join(" ")} />
      {valid.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={accent} strokeWidth="2" />)}
      {last && <text x={valid[valid.length - 1].x} y={valid[valid.length - 1].y - 10} fontSize="11" fontWeight="700" fill={T.ink} textAnchor="middle">{last.pct}%</text>}
      <text x="40" y="114" fontSize="10" fill={T.muted} textAnchor="middle">{weekly.length} wks ago</text>
      <text x="300" y="114" fontSize="10" fill={T.muted} textAnchor="middle">now</text>
    </svg>
  );
}

export function TopicTable({ groups, emptyBody }) {
  if (groups.length === 0) return <EmptyState icon="chart" title="No answers recorded yet" body={emptyBody || "Answer MCQs, calculations or extended questions and your accuracy by topic will build up here."} />;
  return (
    <Table minWidth={560}>
      <thead>
        <tr>
          <th style={{ ...th, paddingLeft: 20 }}>Topic</th>
          <th style={{ ...th, textAlign: "right" }}>Right</th>
          <th style={{ ...th, textAlign: "right" }}>Wrong</th>
          <th style={{ ...th, textAlign: "right" }}>Total</th>
          <th style={{ ...th, paddingRight: 20, width: 200 }}>Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {groups.map(g => (
          <React.Fragment key={g.label}>
            <tr style={{ borderTop: `1px solid ${T.line}`, background: "#FAFBFC" }}>
              <td style={{ ...td, paddingLeft: 20, fontWeight: 700 }}>{g.label}</td>
              <td style={{ ...td, textAlign: "right", color: T.green, fontWeight: 600 }}>{g.c}</td>
              <td style={{ ...td, textAlign: "right", color: T.red, fontWeight: 600 }}>{g.n - g.c}</td>
              <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{g.n}</td>
              <td style={{ ...td, paddingRight: 20 }}><AccuracyBar pct={g.pct} width="100%" /></td>
            </tr>
            {g.topics.slice(0, 6).map(t => (
              <tr key={t.key} style={{ borderTop: `1px solid ${T.line}` }}>
                <td style={{ ...td, paddingLeft: 36, color: T.body }}>{t.label}</td>
                <td style={{ ...td, textAlign: "right", color: T.green }}>{t.c}</td>
                <td style={{ ...td, textAlign: "right", color: T.red }}>{t.n - t.c}</td>
                <td style={{ ...td, textAlign: "right" }}>{t.n}</td>
                <td style={{ ...td, paddingRight: 20 }}><AccuracyBar pct={t.pct} width="100%" /></td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default function StudentDashboard({ board, authUser, userProfile, currentStreak, known, sets, topicOrder, sectionOf, hasFullAccess, isAdmin, mcqCount }) {
  const navigate = useNavigate();
  const { attempts, loading } = useAttempts(authUser?.uid);
  const s = useMemo(() => summarise(attempts), [attempts]);
  const groups = useMemo(() => groupBySection(s.topicList, sectionOf), [s, sectionOf]);

  const totalCards = topicOrder.reduce((a, id) => a + (sets[id]?.cards.length || 0), 0);
  const knownCards = topicOrder.reduce((a, id) => a + ((known[id] || new Set()).size), 0);
  const cardPct = totalCards ? Math.round((knownCards / totalCards) * 100) : 0;
  const firstName = (authUser?.displayName || "").split(" ")[0];

  const inClass = !!userProfile?.classId;
  const hw = useHomework(authUser?.uid, userProfile?.classId);
  const todo = (hw.rows || []).filter(r => r.status !== "done");
  const overdue = todo.filter(r => r.overdue).length;
  const nextUp = todo[0];

  return (
    <>
      <PageHeader
        eyebrow={longDate()}
        title={`${greeting()}${firstName ? `, ${firstName}` : ""}`}
        sub={inClass
          ? (todo.length ? `${todo.length} homework to do${overdue ? `, ${overdue} overdue` : ""} · ${userProfile.className || "Your group"}` : `${userProfile.className || "Your group"} · ${boardLabel(board)} Chemistry · nothing due`)
          : "Your tutor has not placed you in a group yet"}
        right={nextUp
          ? <Button variant="primary" size="lg" iconRight="arrowRight" onClick={() => navigate(`/${board}/homework/${nextUp.a.id}`)}>{nextUp.status === "progress" ? "Continue homework" : "Start homework"}</Button>
          : <Button variant="primary" size="lg" iconRight="arrowRight" onClick={() => navigate(`/${board}/mcq`)}>Practise now</Button>}
      />

      <div className="cm-two-col">
        <div className="cm-main-col">
          <Card padding={0}>
            <CardHeader title="Homework" style={{ padding: "16px 20px" }}
              right={<><Chip tone={overdue ? "red" : todo.length ? "accent" : "neutral"}>{todo.length} to do</Chip><Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => navigate(`/${board}/homework`)}>All homework</Button></>} />
            {!inClass && <EmptyState icon="users" title="No group yet" body="HSJ Tuition places you in a group once your onboarding is complete. Homework, feedback and progress reports then appear here." />}
            {inClass && hw.loading && <div style={{ padding: 20, fontSize: 13, color: T.muted }}>Loading…</div>}
            {inClass && !hw.loading && todo.length === 0 && <EmptyState icon="check" title="Nothing to do" body="When your tutor sets homework it appears here with a due date, and your marks and feedback come back on the same page." />}
            {todo.slice(0, 3).map(r => <HomeworkRow key={r.a.id} row={r} board={board} />)}
          </Card>

          <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CardHeader title="Practise" sub="Independent revision · every answer counts towards your mastery" />
            <PracticeGrid board={board} counts={{ mcq: mcqCount, topics: topicOrder.length }} hasFullAccess={hasFullAccess} isAdmin={isAdmin} />
          </section>

          <Card padding={0}>
            <CardHeader title="Performance by topic" sub={loading ? "Loading…" : `${s.total} answers recorded`} style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}
              right={<Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => navigate(`/${board}/progress`)}>Full progress</Button>} />
            <TopicTable groups={groups.slice(0, 3)} />
          </Card>
        </div>

        <aside className="cm-side-col">
          <div className="cm-grid-2">
            <StatTile label="Streak" value={<>{currentStreak} <span style={{ fontSize: 14, fontWeight: 600, color: T.muted }}>days</span></>} sub={currentStreak >= 3 ? "Keep it going" : "Practise daily to build it"} />
            <StatTile label="Accuracy · 30 days" value={s.monthPct === null ? "–" : `${s.monthPct}%`}
              sub={s.trend === null ? `${s.month} answers` : `${s.trend >= 0 ? "▲" : "▼"} ${Math.abs(s.trend)} pts vs last week`}
              subTone={s.trend === null ? undefined : s.trend >= 0 ? "green" : "red"} />
            <StatTile label="This week" value={s.week} sub={s.weekPct === null ? "questions" : `questions · ${s.weekPct}% right`} />
            <StatTile label="Flashcards known" value={`${cardPct}%`} sub={`${knownCards} of ${totalCards} cards`} />
          </div>

          {inClass && <LessonNotesCard authUser={authUser} board={board} />}

          <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CardHeader title="Needs work" sub="Topics under 75% with 3+ answers" />
            {s.weak.filter(t => t.pct < 75).length === 0
              ? <span style={{ fontSize: 13, color: T.muted }}>Nothing flagged yet. Keep practising and weak spots will show here.</span>
              : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.weak.filter(t => t.pct < 75).map(t => <Chip key={t.key} tone={chipToneForPct(t.pct)}>{t.label} · {t.pct}%</Chip>)}
                </div>}
            <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
              <IconTile name="video" tone="neutral" size={32} />
              <span style={{ fontSize: 12, color: T.muted }}>Video explanations for weak topics will link here as the library grows.</span>
            </div>
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CardHeader title="Strengths" />
            {s.strong.length === 0
              ? <span style={{ fontSize: 13, color: T.muted }}>Topics you score 70%+ on will appear here.</span>
              : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{s.strong.map(t => <Chip key={t.key} tone="green">{t.label} · {t.pct}%</Chip>)}</div>}
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <CardHeader title="Accuracy over time" sub="weekly" />
            <AccuracySpark weekly={s.weekly} />
          </Card>
        </aside>
      </div>
    </>
  );
}

// Keep pctColour import used for parity with other pages
export { pctColour };
