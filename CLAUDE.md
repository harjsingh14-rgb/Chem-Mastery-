# ChemMastery (HSJ Tuition)

React app (Create React App, no local Node on the Mac: builds run on Vercel) with Vercel serverless functions in `api/` and Firebase (Auth, Firestore, Storage) project `chemmastery-3adb0`. Live at https://fc.hsjtuition.co.uk.

## Roles and the access-control matrix

Roles live on `users/{uid}.role`: `free` (signed in, not placed), `student` (placed in a group, `classId` + `tutorId`), `parent` (`children: [uid]`), `tutor` (per-tutor `privileges` switches, see `src/utils/privileges.js`), `admin` (everything). The source of truth is `firestore.rules` (published by hand from the Firebase console, never by the deploy). The `api/*` functions use a service account, which bypasses the rules, so every API action must check the caller itself: `verifyFirebaseToken` for identity, `requireAdmin` or an ownership check for authority.

| Data | Student | Parent | Tutor | Admin |
|---|---|---|---|---|
| `users/{uid}` profile | own: read, limited update (never role, group, onboarding fields) | child: read | own students: read, name and photo only | all |
| `attempts`, `errorLog`, `ppqAttempts` | own: read and create | child: read | own students: read | all |
| `assignments` (homework) | own group: read | child's group: read | own: create, update, delete (`homework` privilege) | all |
| `submissions` | own: create, save until submitted, query marks | child: read | own students: adjust marks, comment, reply (`marking`) | all |
| `classes` (groups), `sessions`, `lessons`, `lessonNotes` | group schedule and own notes: read | child: read | own: write (`groups`, `calendar`, `lessons`) | all |
| `privateNotes`, `payments`, `messages`, `applicants`, `reminders`, `quotas` | no | payments for child: read | own: read/write where applicable | all |
| `ppq`, `ppqIndex`, `settings` | read | read | read | write |

Unauthenticated: only `api/onboarding.js` (48-character random token per applicant) and `api/stripe-webhook.js` (signature checked). Every other endpoint needs a Firebase ID token. Endpoints that call Claude (`api/ppq-mark.js`, `api/examine.js`) are rate limited per account per day in `api/_quota.js`.

Secrets (`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`, `CRON_SECRET`) are Vercel environment variables read only in `api/`. Nothing secret goes in `src/` or `public/`. The Firebase web config in `src/firebase.js` is public by design.

## Working rules

- Vercel Hobby allows 12 serverless functions and the project is at the cap. New server work goes into an existing `api/*.js` file; files starting with `_` are helpers, not functions.
- CRA lint runs on Vercel with warnings treated as errors (unused imports and missing hook dependencies fail the build). Check syntax locally with `python3 tools/dev/check_syntax.py <files>`.
- Verify a change by pushing to the `redesign` branch and reading the Vercel status on the commit; production is `main` and is only pushed when Harj says to deploy.
- Commit named files only (`.claude/settings.local.json` holds keys). Never commit `ppq-build/`, `resources/`, PDFs or the modified `public/mechanisms/*.jpg`.
- UI uses the tokens in `src/ui/theme.js` and the icons in `src/ui/components.js`: no emoji, no gradients, no extra font links, no em dashes in copy. Exam-style language in anything a student reads.
- Firestore `setDoc` rejects `undefined`; strip it.
- No real student or parent names in code, comments or commits.
