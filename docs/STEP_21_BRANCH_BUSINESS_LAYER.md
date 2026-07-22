# V15.21 Step 3 — Branch Business Layer

## Scope behavior
- Owner: can select all branches, one branch, or unassigned data.
- Branch manager: scope is fixed to the assigned branch.
- Dashboard, settlement, finance, reminders, rooms, weekly workload, payroll, revenue and expenses all use the same branch scope.

## Payroll and KPI
- Owner / all branches: teacher hours and payroll are consolidated, with a per-branch breakdown.
- Single branch / branch manager: only that branch's lessons, hours, payroll and KPI are visible.
- Minimum contracted hours and over/under calculations remain company-wide and are only shown in the all-branches view.

## Settlement history
Settlement records are stored by month and branch scope, so July all-branch and July Hexi are separate records.
