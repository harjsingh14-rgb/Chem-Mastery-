import React from "react";
import { useNavigate } from "react-router-dom";
import { T, boardLabel } from "../ui/theme";
import { Card, PageHeader, Chip, Icon, IconTile, Notice } from "../ui/components";
import { sourcesFor } from "../utils/homeworkBank";
import mcqData from "../mcq-data.json";
import { CALC_SETS } from "../data/calc-sets";
import { EXTENDED_QUESTIONS } from "../data/extended-questions";

const boardOk = (b, board) => b === "both" || b === board || (Array.isArray(b) && b.includes(board));

/**
 * Revision: the HSJ-written question banks and tools, tiered by topic and
 * difficulty, for students' own study. Real past-paper questions are set as
 * homework by the tutor. One card per tool with the size of the bank.
 */
export default function RevisionPage({ board, isAdmin, hasFullAccess }) {
  const navigate = useNavigate();
  const src = sourcesFor(board);
  const mcqTopicIds = new Set(src.mcqTopics.map(t => t.id));
  const mcqCount = mcqData.questions.filter(q => mcqTopicIds.has(q.topic)).length;
  const calcCount = CALC_SETS.filter(s => boardOk(s.board, board)).reduce((a, s) => a + s.questions.length, 0);
  const extCount = EXTENDED_QUESTIONS.filter(q => boardOk(q.board, board)).length;

  const tools = [
    { id: "mcq", title: "MCQs", icon: "target", tone: "red", to: "mcq", body: "Quick-fire multiple choice by topic, with an explanation after every answer.",
      count: mcqCount ? `${mcqCount} questions · ${src.mcqTopics.length} topics` : null, empty: "No MCQ bank for this board yet." },
    { id: "calc", title: "Calculations", icon: "calculator", tone: "accent", to: "calc", body: "Worked calculation sets from easy to exam style. Hints and full working after each attempt.",
      count: calcCount ? `${calcCount} questions · ${src.calcSets.length} sets` : null, empty: "No calculation sets for this board yet." },
    { id: "extended", title: "AI Examiner", icon: "pencil", tone: "indigo", to: "extended", body: "Six-mark extended answers marked by levels of response, with a model answer to compare against.",
      count: extCount ? `${extCount} questions · ${src.extCategories.length} topics` : null, empty: "No extended-answer bank for this board yet." },
    { id: "flashcards", title: "Flashcards", icon: "cards", tone: "amber", to: "flashcards", body: "Definitions, equations and key facts by topic. Mark each one known or not and the deck adapts.",
      count: "By topic", empty: null },
    { id: "pathways", title: "Pathways", icon: "nodes", tone: "green", to: "pathways", body: "Organic reaction pathways: reagents, conditions and the products in between.",
      count: hasFullAccess ? "Interactive map" : "HSJ students", empty: null },
    { id: "synth", title: "Synthesis", icon: "atom", tone: "green", to: "synth", body: "Plan multi-step syntheses from starting material to target molecule.",
      count: hasFullAccess ? "Route planner" : "HSJ students", empty: null },
    ...(isAdmin ? [
      { id: "mechanisms", title: "Mechanisms", icon: "arrowCurve", tone: "neutral", to: "mechanisms", body: "Step-by-step curly arrow mechanisms.", count: "Admin preview", empty: null },
      { id: "nmr", title: "NMR Practice", icon: "spectrum", tone: "neutral", to: "nmr", body: "Work out structures from spectra.", count: "Admin preview", empty: null },
    ] : []),
  ];

  return (
    <>
      <PageHeader eyebrow="Revision" title="Learn a topic"
        sub={`${boardLabel(board)} Chemistry. Build each topic up with HSJ's tiered question banks. Your homework tests it on real past-paper questions.`} />
      {board === "edexcel" && <Notice tone="amber"><b>Edexcel banks are still being written.</b> The calculation sets below cover Edexcel; the MCQ and extended-answer banks do not yet. Your homework uses real Edexcel past-paper questions.</Notice>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {tools.map(t => (
          <Card key={t.id} role="button" tabIndex={0} onClick={() => navigate(`/${board}/${t.to}`)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/${board}/${t.to}`); } }}
            style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 12, opacity: t.count ? 1 : 0.75 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconTile name={t.icon} tone={t.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 17 }}>{t.title}</div>
                {t.count ? <Chip tone="neutral" style={{ fontSize: 11, marginTop: 4 }}>{t.count}</Chip> : <span style={{ fontSize: 12, color: T.muted }}>{t.empty}</span>}
              </div>
              <Icon name="arrowRight" size={16} color={T.faint} />
            </div>
            <div style={{ fontSize: 13, color: T.body, lineHeight: 1.55 }}>{t.body}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
