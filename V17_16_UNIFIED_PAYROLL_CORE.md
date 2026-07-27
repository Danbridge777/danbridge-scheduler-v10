# V17.16 Unified Payroll Core

## Scope
- Unified payroll calculation through `calculateTeacherPayroll()`.
- Fixed-salary payroll now supports independently entered base salary, overtime rate, deduction rate, weekly minimum hours and workdays.
- Hourly payroll remains based on paid lesson hours and the teacher's entered hourly rate.
- Owner and branch-manager settlement cards use the same complete payroll information and formula.
- Dashboard payroll, finance, settlement, saved settlement totals and exports consume the unified payroll result.
- Branch assignment and unassigned-branch data were intentionally not modified.

## Fixed salary formula
- Above minimum: base salary + overtime hours × overtime rate.
- Below minimum: base salary - short hours × deduction rate.
- Equal to minimum: base salary.
- Incomplete fixed-salary configuration returns NT$0 and displays a configuration warning rather than silently using fallback values.

## Data entry
All payroll numbers are manually entered per teacher. No shared salary, overtime-rate or deduction-rate default is applied.
