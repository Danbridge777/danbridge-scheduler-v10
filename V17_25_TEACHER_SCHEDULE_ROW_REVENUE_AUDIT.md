# V17.25 Teacher Schedule Row Revenue Audit

## Final revenue rule

Revenue is calculated from each teacher's timetable rows.

For every formal lesson shown on a teacher timetable:

`revenue row = student hourly rate × scheduled lesson hours`

- Repeated lessons are counted again because they are separate timetable rows.
- A shared SC lesson assigned to several teachers creates one row on each assigned teacher's timetable.
- The company total is the sum of those teacher timetable rows.
- The implementation does not use a teacher-headcount multiplier.
- `chargeStudent`, `paymentStatus`, teacher reporting, and lesson status do not affect revenue.
- Draft lessons are excluded because they are not formal timetable entries and are hidden from teacher schedules.

## Code change

Removed direct multiplication by `lessonTeacherIds(l).length`.
Revenue now expands each lesson into explicit teacher schedule rows through `teacherScheduleRevenueRows()` and sums each row independently.
