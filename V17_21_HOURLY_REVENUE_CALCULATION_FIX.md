# V17.21 Hourly Revenue Calculation Fix

## Revenue rule
Every chargeable scheduled lesson is calculated as:

`student hourly rate × scheduled duration in hours`

Examples:
- NT$700 × 1.0 hr = NT$700
- NT$700 × 1.5 hr = NT$1,050
- NT$700 × 2.0 hr = NT$1,400

All lesson amounts are then added together. The calculation no longer switches to a flat per-lesson amount based on the student's legacy billing selector. Lessons explicitly marked not to charge the student remain NT$0.

This shared `lessonCharge()` source feeds Dashboard revenue, Finance, Settlement, unpaid totals, teacher company-revenue KPI, notifications, and exports.
