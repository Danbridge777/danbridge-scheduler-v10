# V16.8 — Teacher Schedule Change Notifications

- Owner schedule changes now notify only affected teachers in real time.
- Added, modified, reassigned, and removed lessons include readable change details.
- Teachers can acknowledge a notification so it does not reappear.
- Existing scheduling, synchronization, payroll, finance, permissions, and removed request features remain unchanged.

# V16.7 — Payroll Fluid KPI Layout

- Fixed long salary values being clipped or pushing teacher cards outside the viewport.
- Removed fixed KPI minimum widths and switched to fluid zero-minimum grid columns.
- Added responsive and container-aware KPI typography.
- Kept hour units on the same line while preserving full salary values.
- Reduced teacher card vertical spacing and weekly-row height.
- No calculation, data, permission, sync, ID, or event-handler changes.

# V16.6 — Payroll KPI single-line refinement

- Keep teacher difference values such as `多 10.8 hr` and `少 94.3 hr` on one line.
- Use responsive KPI typography and numeric alignment.
- Adjust KPI grid breakpoints so values retain adequate width.
- Visual-only change; calculations, data, permissions, sync and event handlers are unchanged.


## V16.4 — Premium Teacher Payroll UI
- Redesigned teacher work-hour and payroll cards.
- Teacher full names now wrap and remain fully visible.
- Visual-only change; calculations and functionality unchanged.
## V15.28.8 — Final Lesson Report Permission Fix

- Unified client and Firestore authorization on `extensionUntil`.
- Eliminated false permission-denied results from timestamp arithmetic and duplicated metadata comparisons.
- Preserved teacher ownership, active lesson, manager branch, and expiration controls.

# V15.28.3 — Final Lesson ID Integrity Lock

- Owner-only legacy Lesson ID migration authority.
- Teacher and branch-manager cloud views never generate local replacement IDs.
- Backup restore and every save pass through the same identity normalization guard.
- Duplicate legacy IDs are remapped only by exact lesson fingerprint; ambiguous records are preserved and logged instead of being attached to the wrong lesson.
- Grant, request, lessonMeta, Firestore Rules, and Storage Rules verify the same lesson date, time, student, and teacher fingerprint.
- Existing scheduling, reporting, finance, camp, backup, and permission behavior remains unchanged.

# V15.28.2 — Unified Lesson Identity Core

- All new lesson IDs use canonical `lsn_<UUID>` format.
- Existing lesson IDs are migrated once with local references rewritten.
- Firestore lessonMeta, lessonReports, reportExtensionRequests and reportExtensionGrants share the exact lesson ID as document ID.
- Single and batch requests write one canonical request document per lesson.
- Lesson copy/recurrence/camp creation always generates a new lesson ID.
- Existing non-lesson entity IDs and application behavior remain unchanged.

# V15.27.11 — Approved Grant UI Synchronization Fix

- Fixes the approval loop where an approved request arrived before the matching grant snapshot.
- Approved requests no longer show the request button again while grant synchronization is pending.
- Teacher schedule and open course drawer re-render immediately after grants arrive.
- Approved grants are filtered by the currently signed-in teacher.
- A direct Firestore grant refresh is triggered after approval to remove listener timing races.

# V15.27.11 — Lesson Report Workflow Stability

## Fixed
- 核准不再使用兩個平行寫入，避免申請已核准但 grant 未建立的半完成狀態。
- 多堂課分開申請與核准時，每堂課的授權完全獨立。
- 儲存前驗證正式 grant，錯誤訊息可區分未核准、資料不完整與伺服器時間尚未回寫。
- Firestore request create rules 驗證 requesterTeacherId 與 lessonMeta.teacherIds。


## V15.28.7 — Lesson Report Authorization Source Fix
- Lesson report writes now authorize from authenticated membership plus trusted lessonMeta.
- Removed payload identity fields as authorization gates to prevent false permission-denied.
- Teacher/manager scope, lesson ownership, branch scope, and report time window remain enforced.

## V15.28.11
- Fixed permission-denied when an authorized teacher or branch manager submits a new extension request for a lesson that already has an older request document.
- Removed fragile exact date/time/student/teacher-array comparisons from request authorization.
- Added branch scope validation for branch managers.


## V15.29.1 Cloud Sync Dirty Guard
- Fixed schedule drag changes reverting before cloud upload completed.
- Added a local dirty-state guard so stale Firestore snapshots cannot overwrite unsynced local changes.
- Added immediate retry when a stale snapshot arrives during the save/upload window.
- Preserved all existing features; no removed application/request feature was restored.
- Bumped module and service-worker cache versions.

## V16.2 — Global Design System
- Added a visual-only final CSS layer for consistent navigation, cards, forms, buttons, tables, KPI panels and dialogs.
- Added sidebar visual grouping while preserving the original navigation buttons and permission logic.
- Preserved all V16.1 synchronization and no-overlay fixes.
- Updated the PWA cache key.

## V16.3 Premium CRM and Pages
- Added visual-only premium refinement for Student / Parent CRM and related management pages.
- Preserved all IDs, handlers, synchronization, permissions, calculations, and data behavior.
