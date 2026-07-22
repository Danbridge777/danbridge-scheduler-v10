# V15.28.7 Lesson Report Authorization Fix

Firestore lesson report create/update authorization now uses the authenticated account and trusted lessonMeta document. Payload fields such as teacherUid, teacherId, reportedForTeacherIds, branchId, and editableUntil no longer act as duplicate authorization gates. Teacher ownership, manager branch scope, active lesson status, and the normal/approved reporting window remain required.
