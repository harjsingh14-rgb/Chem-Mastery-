// Weekly lesson schedule for a group: { weekday 0..6 (0 = Sunday), time "18:00", minutes 120 }.
// Lessons are not stored ahead of time; occurrences are worked out from the schedule.
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DEFAULT_MINUTES = 120;

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
  if (!s || s.weekday === undefined || s.weekday === null || !s.time) return "";
  return `${WEEKDAYS[s.weekday]}s ${fmtTime(s.time)} to ${fmtTime(addMinutes(s.time, s.minutes || DEFAULT_MINUTES))}`;
}

export const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Start Date of the lesson on a given ISO date. */
export function lessonStart(s, iso) {
  const [h, m] = (s.time || "00:00").split(":").map(Number);
  const d = new Date(`${iso}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Next n lesson dates (ISO) from `from` (default now); a lesson still counts as upcoming until it ends. */
export function nextOccurrences(s, n = 4, from = new Date()) {
  if (!s || s.weekday === undefined || s.weekday === null || !s.time) return [];
  const out = [];
  const d = new Date(from); d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 70 && out.length < n; i++) {
    if (d.getDay() === Number(s.weekday)) {
      const iso = isoDate(d);
      const end = lessonStart(s, iso).getTime() + (s.minutes || DEFAULT_MINUTES) * 60000;
      if (end > from.getTime()) out.push(iso);
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** The most recent lesson date on or before `from` (ISO), for defaulting the lesson-note date. */
export function lastOccurrence(s, from = new Date()) {
  if (!s || s.weekday === undefined || s.weekday === null) return null;
  const d = new Date(from); d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    if (d.getDay() === Number(s.weekday)) return isoDate(d);
    d.setDate(d.getDate() - 1);
  }
  return null;
}

export const fmtLessonDay = (iso) => { const d = new Date(`${iso}T00:00:00`); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); };
