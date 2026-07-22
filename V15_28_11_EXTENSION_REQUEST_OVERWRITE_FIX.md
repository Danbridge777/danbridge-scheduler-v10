# V15.28.11 Extension Request Overwrite Fix

## Root cause
`reportExtensionRequests` uses the lesson ID as the document ID. When an older request already existed for that lesson, Firestore treated a new `setDoc(..., {merge:false})` as an update. The previous rule required `resource.data.requesterUid` to equal the current user, so another authorized assigned teacher or branch manager could not submit a new request for the same lesson.

The request rule also compared display fields (date, time, student and teacher arrays) byte-for-byte with `lessonMeta`, causing valid requests to be rejected when legacy/local formats differed.

## Fix
- Authorize from current authentication, company membership, `lessonMeta.teacherIds`, and manager branch assignment.
- Allow an authorized assigned teacher/manager to replace an older request document for the same lesson.
- Remove fragile exact comparisons of display fields from authorization.
- Preserve pending-only status and fixed 10-minute request duration.
