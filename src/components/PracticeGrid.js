import React from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../ui/theme";
import { IconTile, Chip } from "../ui/components";
import track from "../utils/track";

/** The practise modules, as tidy cards. `counts` fills in the live numbers. */
export const PRACTICE_MODULES = [
  { id: "mcq",        label: "MCQs",          icon: "checkSquare", tone: "red",     desc: (c) => `${c.mcq || "661"} questions · by spec point` },
  { id: "calc",       label: "Calculations",  icon: "calculator",  tone: "accent",  desc: () => "631 worked calcs · easy to exam" },
  { id: "extended",   label: "AI Examiner",   icon: "pencil",      tone: "indigo",  desc: () => "Extended answers, marked in seconds" },
  { id: "flashcards", label: "Flashcards",    icon: "cards",       tone: "green",   desc: (c) => c.topics ? `${c.topics} topics · random quiz` : "Every topic, random quiz" },
  { id: "mechanisms", label: "Mechanisms",    icon: "arrowCurve",  tone: "amber",   desc: () => "Hand-drawn curly-arrow walkthroughs" },
  { id: "pathways",   label: "Pathways",      icon: "nodes",       tone: "neutral", desc: () => "Organic synthesis routes" },
  { id: "nmr",        label: "NMR Practice",  icon: "spectrum",    tone: "indigo",  desc: () => "Spectra, shifts and structures" },
];

export default function PracticeGrid({ board, counts = {}, hasFullAccess, isAdmin, compact }) {
  const navigate = useNavigate();
  return (
    <div className="cm-grid-3">
      {PRACTICE_MODULES.map(m => {
        const comingSoon = (m.id === "mechanisms" || m.id === "nmr") && !isAdmin;
        const locked = !hasFullAccess && (m.id === "pathways");
        const preview = !hasFullAccess && !locked && !comingSoon;
        return (
          <button key={m.id} className="cm-card-link" disabled={comingSoon}
            onClick={() => { navigate(`/${board}/${m.id}`); track("open_section", { section: m.id, board }); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, padding: compact ? 14 : 16, textAlign: "left",
              borderRadius: T.radius, background: T.card, border: `1px solid ${T.border}`, cursor: comingSoon ? "default" : "pointer",
              opacity: comingSoon ? 0.6 : 1, color: T.ink,
            }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <IconTile name={m.icon} tone={m.tone} />
              {comingSoon && <Chip tone="amber">Coming soon</Chip>}
              {locked && <Chip tone="neutral">Pro</Chip>}
              {preview && <Chip tone="neutral">Preview</Chip>}
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</span>
            <span style={{ fontSize: 12, color: T.muted }}>{m.desc(counts)}</span>
          </button>
        );
      })}
    </div>
  );
}
