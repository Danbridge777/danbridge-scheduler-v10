# V15.28.8 Final Lesson Report Permission Fix

- Firestore now validates an approved extension by the canonical `extensionUntil` server timestamp.
- Removed fragile calculation from `approvedAt + duration` and removed authorization dependence on duplicated report payload fields.
- Original report windows are accepted only when `lessonMeta.editableUntil` is a Firestore timestamp.
- Teacher identity, lesson ownership, manager branch scope, active lesson status, and the 10-minute expiration remain enforced.
- Client preflight now uses the same `extensionUntil` field as Firestore Rules.
