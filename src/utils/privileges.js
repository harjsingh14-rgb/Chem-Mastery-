// What a tutor may do in the app. Admins can do everything; a tutor can do
// everything here unless an admin has turned it off for them (Tutors tab).
// Stored on the tutor's profile as privileges: { id: false, ... }, written
// server-side by api/staff.js. A missing key means allowed, so a new tutor
// starts with the lot and nothing changes for tutors added before this.
// firestore.rules enforces the same keys on the collections each one covers.

export const PRIVILEGES = [
  { id: "groups", label: "Groups", desc: "Create groups and change their usual times and Zoom link" },
  { id: "calendar", label: "Calendar", desc: "Add, move, cancel and delete sessions. Off means the calendar is view only" },
  { id: "lessons", label: "Lessons and notes", desc: "Record lessons, take attendance and write lesson notes" },
  { id: "sendNotes", label: "Email parents", desc: "Send lesson notes to parents. Off means notes are saved but not sent" },
  { id: "homework", label: "Set homework", desc: "Set, close and delete homework for their groups" },
  { id: "marking", label: "Marking", desc: "Change marks, and reply to students' mark queries" },
  { id: "family", label: "Family details", desc: "See parents' contact details, payments and the agreement on a student's profile" },
  { id: "editStudents", label: "Edit students", desc: "Change a student's name and picture" },
];

export const PRIVILEGE_IDS = PRIVILEGES.map(p => p.id);

/** True when this profile may do `id`. Admins always; tutors unless switched off; nobody else. */
export function can(profile, id) {
  if (!profile) return false;
  if (profile.role === "admin") return true;
  if (profile.role !== "tutor") return false;
  const p = profile.privileges;
  return !(p && p[id] === false);
}

/** The ids switched off for a tutor profile (empty for admins). */
export function withheld(profile) {
  if (!profile || profile.role === "admin") return [];
  const p = profile.privileges || {};
  return PRIVILEGE_IDS.filter(id => p[id] === false);
}
