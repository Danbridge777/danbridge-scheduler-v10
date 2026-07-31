# V18.2 — Unified Tutoring and Summer Camp Revenue

## Revenue definition

Monthly company revenue is now the sum of:

1. Tutoring revenue from non-camp timetable lessons.
2. Summer-camp tuition from saved registration records.

Camp timetable rows no longer create student revenue. They continue to create teacher hours and payroll according to the existing payroll rules. This prevents a camp with multiple assigned teachers from multiplying the student's tuition.

## Student overlap

When one student has both tutoring lessons and a summer-camp registration in the same month, the two independent amounts are added once each. The registration remains unique per student and month.

## Validation example

- Tutoring: NT$1,000 × 2 hours × 1 teacher = NT$2,000.
- Two-teacher camp timetable revenue = NT$0.
- Summer-camp registration fee = NT$12,000.
- Total company revenue = NT$14,000.

The same calculation applies to company-wide and branch-scoped finance views.
