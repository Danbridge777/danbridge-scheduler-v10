# Step 05 — Teachers Module

Version: V15.5

## Scope
The teacher master-data and CRM functions were extracted from the main application script into:

`js/modules/teachers/teachers-crm.js`

Extracted functions:

- `normalizedWorkDays()`
- `workDayNames()`
- `selectedTeacherWorkDays()`
- `clearTeacherForm()`
- `saveTeacher()`
- `editTeacher()`
- `deleteTeacher()`
- `renderTeachers()`

## Compatibility guarantees

- Existing global function names remain unchanged.
- Inline HTML handlers continue to work.
- Teacher data schema, hourly rate, minimum weekly hours, workdays and Firebase synchronization are unchanged.
- Payroll, settlement calculations, teacher workspace and calendar logic were not moved in this step.
