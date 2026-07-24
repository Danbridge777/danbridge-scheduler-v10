# V17.5 — iPad Drag and Lesson Filter Fix

- Added global pointer-up/cancel recovery so an iPad schedule drag cannot remain stuck when the finger is released outside the lesson card.
- Added lost-pointer-capture cleanup and guaranteed removal of drag/drop visual state.
- Rebuilt the lesson-record filter toolbar as a responsive grid so Month, Student, Teacher, and the monthly completion action never overlap on iPad.
- Preserved lesson movement rules, Firebase synchronization, permissions, and all business calculations.
