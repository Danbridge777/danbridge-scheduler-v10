# V15.19 App Shell and Render Orchestrator

## Purpose
Separate navigation, default initialization, shared select rendering, and global render coordination from the remaining application/business file.

## New files
- `js/app/app-shell.js`
- `js/ui/select-options.js`
- `js/app/render-orchestrator.js`

## Extracted functions
- `switchTab()`
- `setDefaults()`
- `selectedCoTeacherIds()`
- `syncCoTeacherOptions()`
- `renderSelects()`
- `renderAll()`

No database schema, calculation formula, Firebase behavior, role behavior, or UI workflow was changed.
