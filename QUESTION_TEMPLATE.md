# Writing exam-style questions for ChemMastery

Each question is one scenario with lettered parts, like a real paper. Fill in
the template below for each question and send the file back (or add it
straight to `src/data/exam-questions.js`). Square brackets mark what to replace.

Three tiers:

- **Tier 1 (scaffolded)**: the calculation or explanation is broken into steps, each marked on its own.
- **Tier 2 (exam standard)**: familiar context, one answer per part, as in a past paper.
- **Tier 3 (unseen or stretch)**: unfamiliar compounds or contexts, multi-step.

Part types and what the app needs for each:

| Type | Marked by | Fields |
|---|---|---|
| `mcq` | automatically | `options` (A to D), `answer` (letter), `explanation` |
| `calc` | automatically | `answer` (number), `unit`, `tolerance` (how far off is still correct), `steps` (worked solution) |
| `short` | AI, point by point (2 to 5 marks) | `ms` (one mark per point), optional `allow` and `reject` lists |
| `extended` | AI, levels of response (6 or more marks) | `ms` (indicative content), optional `levels` |

Use mark scheme conventions in `ms`, `allow` and `reject` exactly as you would
write them: "allow", "ignore", "reject", "ECF", "must state gaseous ions", etc.
The AI examiner is told to apply ECF, appropriate significant figures,
alternative wording and contradiction rules.

## Template

```js
{
  id: "[topic]-[number]",          // e.g. "bh-001"
  board: "[aqa | ocr | edexcel | both]",
  tags: ["[sub-topic tag]"],       // e.g. "born-haber", "lattice-enthalpy"
  tier: [1 | 2 | 3],
  title: "[short title shown to the tutor]",
  context: "[scenario or data shared by all parts, or delete this line]",
  dataTable: [                     // optional, delete if not needed
    ["[label, e.g. ΔHf of KCl]", [value]],
  ],
  parts: [
    {
      label: "a", type: "short", marks: [2],
      q: "[question text, exam command word first: State, Define, Explain, Suggest ...]",
      ms: ["[mark point 1]", "[mark point 2]"],
      allow: ["[acceptable alternative]"],
      reject: ["[common wrong answer that scores 0]"],
    },
    {
      label: "b", type: "calc", marks: [3],
      q: "[Calculate ...]",
      answer: [number], unit: "[kJ mol-1]", tolerance: [number],
      steps: ["[step 1]", "[step 2]", "[step 3 with final answer and units]"],
    },
    {
      label: "c", type: "mcq", marks: 1,
      q: "[Which ...]",
      options: { A: "[...]", B: "[...]", C: "[...]", D: "[...]" },
      answer: "[A | B | C | D]",
      explanation: "[why the correct option is right]",
    },
  ],
},
```

## Scaffolded (tier 1) versions

For a tier 1 question, write the calculation as separate `calc` parts, one per
step, so each step is marked on its own. For example a lattice enthalpy
calculation becomes: (a) total the enthalpy changes for the metal, (b) total
them for the non-metal, (c) rearrange for the lattice enthalpy. Give each part
its own `answer`, `unit` and `tolerance`.

## Checklist before sending

- Every part has `marks`, and the marks add up to what the question is worth.
- `calc` tolerances are realistic for rounding (for example 3 on a value near 700).
- `short` parts have exactly as many `ms` points as marks, or a note in `ms` where a point is worth 2.
- No em dashes in question text. Use hyphens or commas.
- Units written as in the exam, for example `kJ mol-1`, `mol dm-3`.
