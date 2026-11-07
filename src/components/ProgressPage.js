import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { T, pctColour } from "../ui/theme";
import { Card, CardHeader, PageHeader, StatTile, Bar, Button, Chip, chipToneForPct } from "../ui/components";
import useAttempts from "../hooks/useAttempts";
import { summarise, groupBySection, relativeTime, TYPE_LABEL, attemptTime } from "../utils/analytics";
import { TopicTable, AccuracySpark } from "./StudentDashboard";

export default function ProgressPage({ board, authUser, currentStreak, studyLog, todayKey, known, sets, sections, sectionOf }) {
  const navigate = useNavigate();
  const { attempts, loading } = useAttempts(authUser?.uid);
  const s = useMemo(() => summarise(attempts), [attempts]);
  const groups = useMemo(() => groupBySection(s.topicList, sectionOf), [s, sectionOf]);

  // 28-day activity grid from the local study log (kept for streaks)
  const cells = [];
  const now = new Date(); const st = new Date(now);
  st.setDate(st.getDate() - 27 - ((st.getDay() + 6) % 7));
  for (let i = 0; i < 28; i++) {
    const d = new Date(st); d.setDate(d.getDate() + i);
    const k = d.toISOString().slice(0, 10); const dd = studyLog[k];
    const tot = dd ? (dd.cards || 0) + (dd.calcs || 0) + (dd.extended || 0) + (dd.mechanisms || 0) : 0;
    cells.push({ k, tot, level: tot === 0 ? 0 : tot < 5 ? 1 : tot < 15 ? 2 : tot < 30 ? 3 : 4, today: k === todayKey });
  }
  const levelColours = [T.line, "#BAE6FD", "#7DD3FC", "#29ABE2", "#0B6E9C"];

  return (
    <>
      <PageHeader eyebrow="Progress" title="Your progress" sub="Everything you answer, in revision or homework, is counted here."
        right={<Button variant="secondary" icon="arrowLeft" onClick={() => navigate(`/${board}`)}>Dashboard</Button>} />

      <div className="cm-grid-4">
        <StatTile label="Answers · all time" value={s.total} sub={s.allPct === null ? "" : `${s.allPct}% correct`} />
        <StatTile label="Accuracy · 30 days" value={s.monthPct === null ? "–" : `${s.monthPct}%`} sub={`${s.month} answers`} />
        <StatTile label="Streak" value={<>{currentStreak} <span style={{ fontSize: 14, fontWeight: 600, color: T.muted }}>days</span></>} sub="days in a row with practice" />
        <StatTile label="Last active" value={s.last ? relativeTime(s.last) : "–"} sub={loading ? "Loading…" : ""} />
      </div>

      <div className="cm-two-col">
        <div className="cm-main-col">
          <Card padding={0}>
            <CardHeader title="Performance by topic" sub="All recorded answers" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
            <TopicTable groups={groups} />
          </Card>

          <Card padding={0}>
            <CardHeader title="Flashcards" sub="Cards you've marked as known, by section" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}` }} />
            <div style={{ padding: "8px 20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {sections.map(sec => {
                const sT = sec.topics.reduce((a, id) => a + (sets[id]?.cards.length || 0), 0);
                const sM = sec.topics.reduce((a, id) => a + (known[id] || new Set()).size, 0);
                const sP = sT ? Math.round((sM / sT) * 100) : 0;
                return (
                  <div key={sec.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{sec.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: sP === 0 ? T.muted : T.accentText }}>{sP}% · {sM}/{sT}</span>
                    </div>
                    <Bar value={sP} colour={T.accent} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <aside className="cm-side-col">
          <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <CardHeader title="Last 28 days" sub="Activity from this device" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} style={{ fontSize: 10, color: T.muted, textAlign: "center", fontWeight: 600 }}>{d}</div>)}
              {cells.map(c => <div key={c.k} title={`${c.k}: ${c.tot}`} style={{ aspectRatio: "1", borderRadius: 4, background: levelColours[c.level], outline: c.today ? `2px solid ${T.amber}` : "none", outlineOffset: -1 }} />)}
            </div>
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <CardHeader title="Accuracy over time" sub="weekly" />
            <AccuracySpark weekly={s.weekly} />
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CardHeader title="Needs work" />
            {s.weak.filter(t => t.pct < 75).length === 0
              ? <span style={{ fontSize: 13, color: T.muted }}>Nothing flagged yet.</span>
              : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{s.weak.filter(t => t.pct < 75).map(t => <Chip key={t.key} tone={chipToneForPct(t.pct)}>{t.label} · {t.pct}%</Chip>)}</div>}
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CardHeader title="Recent answers" />
            {s.recent.length === 0 && <span style={{ fontSize: 13, color: T.muted }}>Nothing yet.</span>}
            {s.recent.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.correct ? T.green : T.red, flexShrink: 0 }} />
                <span style={{ fontWeight: 700, width: 48, color: T.muted }}>{TYPE_LABEL[a.type] || a.type}</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.topicLabel || a.topic || a.questionId}</span>
                {a.maxScore > 1 && <span style={{ fontWeight: 700, color: pctColour(Math.round((a.score / a.maxScore) * 100)) }}>{a.score}/{a.maxScore}</span>}
                <span style={{ color: T.muted, flexShrink: 0 }}>{relativeTime(attemptTime(a))}</span>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </>
  );
}
