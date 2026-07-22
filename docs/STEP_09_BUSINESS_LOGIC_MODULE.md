# Step 09 — Business Logic Module

## Goal
Move calculation-oriented finance, tuition, payroll, and settlement functions out of the remaining application/UI file without changing their implementation.

## Added
- `js/modules/business/business-logic.js`

## Extracted functions
1. `lessonCharge`
2. `lessonTeacherPay`
3. `lessonPay`
4. `fixedExpenseApplies`
5. `financeData`
6. `monthDateRange`
7. `countTeacherWorkDaysInRange`
8. `teacherExpectedHours`
9. `teacherPaidLessons`
10. `teacherWeekBreakdown`
11. `diffClass`
12. `diffText`
13. `settleData`
14. `monthlySettlementSnapshot`

## Compatibility
The functions remain classic-script globals. Their bodies were moved intact and their names and callers were not changed. The new module loads before `application-and-business-features.js`.
