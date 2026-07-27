# V17.23 — All Timetable Revenue Fix

- Revenue now includes every formal lesson on the timetable.
- `chargeStudent`, `paymentStatus`, teacher reports and lesson status do not affect revenue.
- Removed legacy `chargeStudent === yes/no` revenue and settlement filters.
- Settlement lesson counts and hours now use all formal timetable lessons.
- The charge control remains only as an operational confirmation marker.
- Formula: student hourly rate × scheduled duration.
