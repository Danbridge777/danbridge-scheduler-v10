# Step 16 — Smart Scheduler Module

## New module

`js/modules/calendar/smart-scheduler.js`

## Extracted functions

- `parseStudentAvailability()`
- `minutesToTime()`
- `dateRange()`
- `slotFree()`
- `openSmartScheduler()`
- `closeSmartScheduler()`
- `syncSmartStudent()`
- `findSmartSlots()`
- `useSmartSlot()`

## Scope

This step is a structural refactor only. It does not change scheduling rules, lesson fields, conflict handling, modal IDs, inline handler names, Firebase behavior, or any financial calculation.

The new module is loaded after `application-and-business-features.js`, so all existing shared helpers remain available before smart scheduling is used.
