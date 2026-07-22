# V15.28.12 — Grant Consumption and Lesson Isolation Fix

- A 10-minute extension is matched to the exact lesson identity, not teacher/date alone.
- Saving a report through an extension atomically marks that grant as `consumed`.
- A consumed grant closes immediately and cannot reopen any lesson.
- Owner repair only creates a genuinely missing grant; it never renews an existing, expired, or consumed grant.
- Firestore Rules permit the assigned teacher/manager to consume only their own active grant while saving.
