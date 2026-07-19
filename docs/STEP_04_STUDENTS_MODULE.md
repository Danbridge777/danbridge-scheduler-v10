# V15.4 Students Module

## Goal
Extract the student CRM feature set from the main application file without changing behavior or data format.

## New module

`js/modules/students/students-crm.js`

## Functions moved

- `studentDefaults`
- `saveStudent`
- `editStudent`
- `clearStudentForm`
- `deleteStudent`
- `studentHistoryStats`
- `renderStudents`
- `showStudentHistory`

## Compatibility

The file is loaded as a classic script before `application-and-business-features.js`. Existing inline event handlers and the main `renderAll()` flow therefore continue to use the same global function names.

## Data behavior

No localStorage key, Firebase path, student field, billing rule, lesson record, or UI ID was changed.
