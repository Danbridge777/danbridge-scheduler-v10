# V15.28.3 Final Static Audit

## Identity invariants

1. Every newly created or copied lesson receives `lsn_<UUID v4>` from `createLessonId()`.
2. One lesson keeps the same `lessonId` across lessonMeta, lessonReports, reportExtensionRequests, and reportExtensionGrants.
3. Different lessons never intentionally share a Lesson ID.
4. Only the Owner may migrate legacy Lesson IDs. Teacher and branch-manager cloud payloads are preserved until the Owner publishes the canonical data.
5. Duplicate legacy IDs are resolved using date, start, end, student, and sorted teacher IDs. Ambiguous related records are not silently attached to the wrong lesson.
6. Grants are accepted only when Lesson ID and the full lesson fingerprint match.

## Static validation completed

- JavaScript syntax: all project JavaScript files passed `node --check`.
- HTML: no duplicate IDs; all local references resolved.
- Lesson creation/copy flows: manual, weekly recurrence, week copy, month copy, selected copy, date-offset paste, summer camp, and winter camp use `createLessonId()`.
- Persistence: load, import, restore, save, integrity repair, and cloud handoff were inspected.
- Cloud documents: lessonMeta, lessonReports, extension requests, and grants use the Lesson ID as the Firestore document ID.
- Rules: Firestore and Storage grant checks compare Lesson ID, date, start, end, student ID, and teacher IDs.
- Migration behavior: automated Node test confirmed unique canonical IDs, fingerprint-aware duplicate remapping, and no teacher-side legacy ID mutation.

## Functional surface preserved

No UI workflow was intentionally removed or renamed. Existing modules and entry points for scheduling, drag/drop, multi-select, weekly/monthly copying, drafts, camps, makeups, reports, extension approval, finance, settlement, backups, role views, and cloud sync remain present.

Static validation cannot simulate real Firebase credentials, concurrent devices, browser drag gestures, or production Firestore data. These require deployment testing, but the known static ID defects from V15.28.2 are corrected in this version.
