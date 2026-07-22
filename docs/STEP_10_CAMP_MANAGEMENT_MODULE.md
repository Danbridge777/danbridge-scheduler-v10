# Step 10 — Camp Management Module

## Scope

V15.10 extracts summer and winter camp administration from the remaining application module into:

`js/modules/camps/camp-management.js`

## Extracted responsibilities

- Summer/winter camp class CRUD
- Summer/winter teacher-group CRUD
- Camp selector and teacher preview rendering
- Candidate generation and preview
- Recurring camp-series creation
- Automatic backing group-student creation

## Compatibility policy

The extracted function bodies are unchanged and remain classic global function declarations. Data structures, IDs, Firebase behavior, conflict rules, payroll rules, and persistence keys are unchanged.

## Script order

`course-operations.js` → `camp-management.js` → `business-logic.js` → `application-and-business-features.js`
