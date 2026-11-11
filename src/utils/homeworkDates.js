// Due-date helpers that pages can use without pulling in the question banks
// (homeworkBank.js imports every bank, so the dashboard must not import it).
export const fmtDue = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "No due date";
export const isOverdue = (ms) => !!ms && Date.now() > ms;
