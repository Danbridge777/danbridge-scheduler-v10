# Step 13 — Makeup Management Module

## Goal
Move the complete makeup workflow out of `application-and-business-features.js` without changing runtime behavior.

## New module

`js/modules/makeups/makeup-management.js`

## Extracted functions

- `addMakeupForLesson`
- `renderMakeups`
- `scheduleMakeup`
- `finishMakeup`

## Dependency contract

The module intentionally continues to use the existing global application interfaces:

- `db`
- `$`
- `uid`
- `hours`
- `student`
- `esc`
- `todayStr`
- `openLessonModal`
- `saveDB`
- `toast`

No data schema, status value, DOM id, inline handler name, or save timing was changed.

## Regression checks

1. Changing a lesson to student leave creates one pending makeup record.
2. Repeating the operation does not create a second unfinished makeup record.
3. Makeup filtering still shows pending, scheduled, completed, and all records correctly.
4. Scheduling a makeup pre-fills student, teacher, title, status, time, and source note.
5. Completing a makeup persists the completed state.
6. Existing inline buttons continue to resolve their global handlers.
