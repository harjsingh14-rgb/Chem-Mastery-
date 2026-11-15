// Which topics of the HSJ diagnostic papers a student has not yet been taught.
//
// The papers are built from AQA questions tagged with AQA spec refs. The
// self-evaluation records what school has taught in the student's own board's
// refs: the modules ticked ("taught") and, inside them, "Covered in school?"
// per sub-topic. OCR and Edexcel refs are mapped onto the AQA refs they cover.
// An AQA ref counts as not taught only when every ref mapping onto it is
// untaught, so a topic is never excluded on a partial match.
const MODULES = require("./_specModules");

const AQA_REFS = Object.values(MODULES.aqa || {}).flat();
const TO_AQA = {
  aqa: Object.fromEntries(AQA_REFS.map(r => [r, [r]])),
  ocr: {
    "2.1.1": ["3.1.1"], "2.1.2": ["3.1.2"], "2.1.3": ["3.1.2"], "2.1.4": ["3.1.2"], "2.1.5": ["3.1.7"],
    "2.2.1": ["3.1.1"], "2.2.2": ["3.1.3"],
    "3.1.1": ["3.2.1"], "3.1.2": ["3.2.2"], "3.1.3": ["3.2.3"], "3.1.4": ["3.2.3"],
    "3.2.1": ["3.1.4"], "3.2.2": ["3.1.5"], "3.2.3": ["3.1.6"],
    "4.1.1": ["3.3.1"], "4.1.2": ["3.3.2"], "4.1.3": ["3.3.4"],
    "4.2.1": ["3.3.5"], "4.2.2": ["3.3.3"], "4.2.3": [], "4.2.4": ["3.3.6"],
    "5.1.1": ["3.1.9"], "5.1.2": ["3.1.10"], "5.1.3": ["3.1.12"],
    "5.2.1": ["3.1.8"], "5.2.2": ["3.1.8"], "5.2.3": ["3.1.11"],
    "5.3.1": ["3.2.5"], "5.3.2": ["3.2.5"], "5.3.3": ["3.2.5"], "5.3.4": ["3.2.5"], "5.3.5": ["3.2.6"],
    "6.1.1": ["3.3.10"], "6.1.2": ["3.3.8"], "6.1.3": ["3.3.9"],
    "6.2.1": ["3.3.11"], "6.2.2": ["3.3.13", "3.3.7"], "6.2.3": ["3.3.12"], "6.2.4": ["3.3.14"], "6.2.5": ["3.3.14"],
    "6.3.1": ["3.3.16"], "6.3.2": ["3.3.15"],
  },
  edexcel: {
    "1": ["3.1.1", "3.2.1"], "2": ["3.1.3"], "3": ["3.1.7"], "4": ["3.2.2", "3.2.3"], "5": ["3.1.2"],
    "6": ["3.3.1", "3.3.2", "3.3.3", "3.3.4", "3.3.5"], "7": ["3.3.6"],
    "8": ["3.1.4"], "9": ["3.1.5"], "10": ["3.1.6"],
    "11": ["3.1.10"], "12": ["3.1.12"], "13": ["3.1.8"], "14": ["3.1.11"], "15": ["3.2.5", "3.2.6"], "16": ["3.1.9"],
    "17": ["3.3.7", "3.3.8", "3.3.9"], "18": ["3.3.10", "3.3.11", "3.3.12", "3.3.13", "3.3.14"], "19": ["3.3.15", "3.3.16"],
  },
};

/**
 * The set of AQA refs the student has not been taught, from their
 * self-evaluation. Empty when there is no evaluation or everything is taught.
 */
function untaughtAqaRefs(selfEvaluation, board) {
  const ev = selfEvaluation;
  if (!ev || !Array.isArray(ev.taught) || ev.taught.length === 0) return new Set();
  // The evaluation was rated on the applicant's board at the time, which may
  // not be the group's board now: the module ids say which tree was used.
  const first = String(ev.taught[0]);
  const evBoard = ev.board || (first.startsWith("ocr-") ? "ocr" : first.startsWith("edx-") ? "edexcel" : first.startsWith("aqa-") ? "aqa" : board);
  const mods = MODULES[evBoard] || {};
  const map = TO_AQA[evBoard] || {};
  if (!Object.keys(mods).length) return new Set();
  const taughtRefs = new Set(), untaughtRefs = new Set();
  for (const [mid, refs] of Object.entries(mods)) {
    const ticked = ev.taught.includes(mid);
    for (const ref of refs) {
      const covered = ev.ratings?.[ref]?.covered;
      if (ticked && covered !== "no") taughtRefs.add(ref); else untaughtRefs.add(ref);
    }
  }
  const taughtAqa = new Set([...taughtRefs].flatMap(r => map[r] || []));
  const out = new Set();
  for (const r of untaughtRefs) for (const a of map[r] || []) if (!taughtAqa.has(a)) out.add(a);
  return out;
}

module.exports = { untaughtAqaRefs, TO_AQA };
