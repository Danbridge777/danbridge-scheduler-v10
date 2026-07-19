# V15.6 — Calendar UI Module

## Refactored

The calendar interaction layer was extracted from `application-and-business-features.js` into:

`js/modules/calendar/scheduler-ui.js`

The module contains:

- Calendar filters and visible-range calculations
- Calendar rendering and analysis
- Lesson selection and multi-selection actions
- Copy/paste and context-menu actions
- Desktop marquee integration entry point
- Keyboard shortcuts
- Drag-and-drop handler attachment

## Unchanged

- Lesson data schema
- Firebase synchronization
- Calendar HTML and CSS
- Course creation/editing forms
- Conflict and room checks
- Week/month copy logic
- Existing global function names and inline event handlers
