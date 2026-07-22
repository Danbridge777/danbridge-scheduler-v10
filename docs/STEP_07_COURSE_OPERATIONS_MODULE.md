# V15.7 — Calendar Course Operations Module

## Purpose
Separate course creation, editing, deletion, conflict validation, drawer display and drag-move persistence from the remaining application file.

## Added
- `js/modules/calendar/course-operations.js`

## Extracted functions
- Course modal: `openLessonModal`, `closeLessonModal`, `clearLessonForm`, `fillLessonForm`
- Persistence: `saveLesson`, `deleteCurrentLesson`, `moveLessonTo`
- Conflict rules: `teacherConflictDetail`, `lessonTeacherConflictNames`, `hasTeacherOverlap`, `conflictDetail`, `hasConflict`
- Course drawer: `courseDrawerStatusClass`, `formatCourseDrawerDate`, `openCourseDrawer`, `closeCourseDrawer`, `editLesson`
- Time helpers used by course operations: `addMinutes`, `snapTimeTo5`

## Explicitly unchanged
- Lesson schema and localStorage key
- Firebase synchronization
- Student and teacher schemas
- Teacher overlap warning behavior
- Student and room collision blocking behavior
- Repeating-series update behavior
- Makeup creation behavior
- Calendar selection, clipboard and rendering behavior
- Payroll, billing and settlement formulas
