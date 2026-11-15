// Which meeting link a lesson uses. Mirrors groupLink in src/utils/schedule.js:
// the session's own link, else the usual-time row it comes from (same weekday
// and start time, or the only row at that time), else the group's link.
function slotsOf(cls) {
  if (!cls) return [];
  const list = Array.isArray(cls.slots) && cls.slots.length ? cls.slots : cls.schedule ? [cls.schedule] : [];
  return list.filter(s => s && s.time);
}
function groupLink(cls, s) {
  if (s && s.zoomLink) return s.zoomLink;
  if (!cls) return null;
  const slots = slotsOf(cls).filter(x => x.zoomLink);
  if (slots.length && s && s.time) {
    const weekday = s.weekday != null ? Number(s.weekday) : s.date ? new Date(`${s.date}T00:00:00`).getDay() : null;
    const exact = weekday == null ? null : slots.find(x => Number(x.weekday) === weekday && x.time === s.time);
    if (exact) return exact.zoomLink;
    const sameTime = slots.filter(x => x.time === s.time);
    if (sameTime.length === 1) return sameTime[0].zoomLink;
  }
  return cls.zoomLink || null;
}
module.exports = { groupLink, slotsOf };
