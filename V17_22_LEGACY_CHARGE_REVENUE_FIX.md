# V17.22 Legacy Charge Revenue Fix

## Root cause
Older timetable lessons may not contain the `chargeStudent` field. V17.21 required the field to be exactly `yes`, so those valid scheduled lessons returned revenue 0. This affected ordinary 1-on-1/home tutoring lessons as well as other legacy lessons.

## Correct rule
- `chargeStudent === "no"`: do not charge.
- `chargeStudent === "yes"` or field is missing: calculate `student hourly rate × scheduled duration`.
- Payment status and teacher report status do not affect scheduled revenue.
