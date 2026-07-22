# V15.28.2 Unified Lesson ID Audit

## Canonical model

Each lesson uses one canonical ID in `lsn_<UUID v4>` format. The same value is used as:

- `db.lessons[].id`
- `lessonMeta/{lessonId}`
- `lessonReports/{lessonId}`
- `reportExtensionRequests/{lessonId}`
- `reportExtensionGrants/{lessonId}`

Different lessons always receive different IDs. Copy, recurrence, week/month copy, date-gap paste, and camp generation create a new lesson ID.

## Migration

Legacy and duplicate lesson IDs are converted once. Local properties named `lessonId` and arrays named `lessonIds` are rewritten. Owner cloud sync migrates legacy Firestore lesson metadata, reports, requests, and grants before publishing the canonical main dataset.

## Compatibility

Student, teacher, parent, branch, expense, makeup, audit-log, and backup IDs remain independent entity IDs. Their behavior and relationships are unchanged.

## Validation

- 34 JavaScript files passed `node --check`.
- 75 local references passed project validation.
- 306 HTML IDs are unique.
- Extension request document ID equals lesson ID.
- Extension grant document ID equals lesson ID.
- Firestore rules enforce request/grant path ID equality.
