# Step 15 — Batch Lesson Operations Module

## Goal

Move the batch lesson adjustment workflow out of `application-and-business-features.js` without changing its data handling or user-visible behavior.

## New module

`js/modules/calendar/batch-lesson-operations.js`

## Extracted functions

- `openBatchModal`
- `closeBatchModal`
- `buildBatchCandidates`
- `previewBatch`
- `applyBatch`

## Existing selection boundary

Selection mode, Ctrl/Cmd selection, marquee selection, clipboard operations, and selection rendering remain in the previously separated calendar modules. This step isolates only the batch-edit business workflow and does not duplicate selection state.

## Dependency contract

The module continues to use the existing global application interfaces:

- `db`
- `$`
- `selectedLessonIds`
- `batchPreviewCache`
- `renderSelects`
- `shiftTime`
- `shiftDate`
- `lessonTeacherIds`
- `hasConflict`
- `teacherConflictDetail`
- `student`
- `esc`
- `snapshot`
- `logChange`
- `addMakeupForLesson`
- `saveDB`
- `toast`

No lesson schema, conflict rule, status value, payment value, confirmation behavior, save timing, or inline handler name was changed.

## Regression checks

1. Selecting lessons and opening Batch Adjustment still works.
2. Date and time shifts preview correctly.
3. Teacher, room, status, and payment changes preview correctly.
4. Invalid times and room conflicts are rejected as before.
5. Teacher overlaps remain warnings and may still be applied.
6. Conflicting rows are skipped when the user confirms partial application.
7. Student-leave changes still create makeup records.
8. Undo restores the state before the batch operation.
