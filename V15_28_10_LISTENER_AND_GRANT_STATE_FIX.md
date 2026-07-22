# V15.28.10 Listener and Grant State Fix

- Aligns lessonReports read rules with teacher/branch-manager listener queries.
- Prevents listener permission errors from being mistaken for report-save failures.
- Makes malformed lesson deadlines fail closed instead of opening reports.
- Uses only active extensionUntil grants in the UI.
- Allows re-requesting when an approved request has no grant after 30 seconds.
