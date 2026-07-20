# Step 08 — Data Persistence Module

V15.8 extracts 19 local persistence, migration, backup history, JSON export/import, and reset functions into `js/core/data-persistence.js`. Storage keys, database schema, Firebase sync, and business rules are unchanged.

## Extracted functions

- loadDB
- normalizeLessonStates
- saveDB
- ensureV81Migration
- getVersions
- setVersions
- versionStats
- createVersion
- createManualVersion
- renderBackupHistory
- restoreVersion
- deleteVersion
- timestampName
- updateLastBackupInfo
- saveFileCrossBrowser
- downloadBackup
- normalizeImported
- importBackup
- resetData
