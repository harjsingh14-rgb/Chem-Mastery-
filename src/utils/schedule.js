// Weekly lesson times for a group. A group has one or more slots, each
// { weekday 0..6 (0 = Sunday), time "18:00", minutes 60 }, held in
// `cls.slots`. Older groups hold a single slot in `cls.schedule`; slotsOf()
// reads either. Lessons are not stored ahead of time: occurrences are worked
// out from the slots.
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DEFAULT_MINUTES = 120;

const validSlot = (s) => s && s.weekday !== undefined && s.weekday !== null && !!s.time;

/** The group's slots, whichever shape the document has. */
export function slotsOf(cls) {
  if (!cls) return [];
  if (Array.isArray(cls.slots) && cls.slots.length) return cls.slots.filter(validSlot);
  return validSlot(cls.schedule) ? [cls.schedule] : [];
}
const asList = (x) => Array.isArray(x) ? x.filter(validSlot) : validSlot(x) ? [x] : [];

export const fmtTime = (hhmm) => {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, "0")}${ampm}` : `${hh}${ampm}`;
};

const addMinutes = (hhmm, mins) => {
  const [h, m] = hhmm.split(":").map(Number);
  const t = h * 60 + m + mins;
  return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

/** "Tuesdays 6pm to 8pm" */
export function describeSchedule(s) {
  if (!validSlot(s)) return "";
  return `${WEEKDAYS[s.weekday]}s ${fmtTime(s.time)} to ${fmtTime(addMinutes(s.time, s.minutes || DEFAULT_MINUTES))}`;
}

/** "Mondays 5pm to 6pm and Thursdays 5pm to 6pm" */
export function describeSlots(slots) {
  const list = asList(slots).slice().sort((a, b) => a.weekday - b.weekday || a.time.localeCompare(b.time)).map(describeSchedule);
  if (list.length <= 1) return list[0] || "";
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
}

/** Total minutes of lessons per week. */
export const weeklyMinutes = (slots) => asList(slots).reduce((a, s) => a + (s.minutes || DEFAULT_MINUTES), 0);

export const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Start Date of the lesson on a given ISO date. */
export function lessonStart(s, iso) {
  const [h, m] = (s.time || "00:00").split(":").map(Number);
  const d = new Date(`${iso}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Next n lessons from `from` (default now), across every slot, in order.
 * Each is { iso, time, minutes, weekday, slot }. A lesson still counts as
 * upcoming until it ends.
 */
export function nextOccurrences(slots, n = 4, from = new Date()) {
  const list = asList(slots);
  if (!list.length) return [];
  const out = [];
  const d = new Date(from); d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 70 && out.length < n; i++) {
    const iso = isoDate(d);
    for (const s of list.slice().sort((a, b) => a.time.localeCompare(b.time))) {
      if (d.getDay() !== Number(s.weekday)) continue;
      const end = lessonStart(s, iso).getTime() + (s.minutes || DEFAULT_MINUTES) * 60000;
      if (end > from.getTime() && out.length < n) out.push({ iso, time: s.time, minutes: s.minutes || DEFAULT_MINUTES, weekday: Number(s.weekday), slot: s });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** The most recent lesson date on or before `from` (ISO) across every slot, for defaulting the lesson-note date. */
export function lastOccurrence(slots, from = new Date()) {
  const list = asList(slots);
  if (!list.length) return null;
  const days = new Set(list.map(s => Number(s.weekday)));
  const d = new Date(from); d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    if (days.has(d.getDay())) return isoDate(d);
    d.setDate(d.getDate() - 1);
  }
  return null;
}

export const fmtLessonDay = (iso) => { const d = new Date(`${iso}T00:00:00`); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); };
