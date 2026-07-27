# V17.18 Teacher Company Revenue KPI

- Adds a company-revenue KPI to every teacher payroll card.
- Revenue is calculated automatically from chargeable lessons in that teacher’s schedule.
- Uses the same `lessonCharge()` logic as Finance and Settlement.
- Supports Owner and branch-manager settlement scopes.
- Adds company revenue to the payroll table, finance payroll rows, settlement text, and Teacher KPI page.
- Does not modify branch assignment or unassigned-branch data.
