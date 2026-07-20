# Step 12 — Settings & Expenses Module

## Goal
Extract expense-setting CRUD from the remaining application module without changing behavior or data shape.

## Added
- `js/modules/settings/settings-expenses.js`

## Extracted functions
- `saveFixedExpense`
- `editFixedExpense`
- `clearFixedExpenseForm`
- `deleteFixedExpense`
- `saveOneTimeExpense`
- `editOneTimeExpense`
- `clearOneTimeExpenseForm`
- `deleteOneTimeExpense`

## Non-goals
No UI redesign, data migration, validation change, Firebase change, or financial calculation change.
