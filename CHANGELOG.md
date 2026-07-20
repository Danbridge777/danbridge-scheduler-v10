# V15.25.2 — Lesson Reporting Foundation

- 修正 iPad／橫向畫面「基準日期」標題貼住輸入框上緣的問題，統一工具列標籤垂直間距。
- 課堂回報新增「老師回饋」欄位。
- 課堂回報新增最多 6 張照片上傳、預覽與既有照片移除介面。
- 新增「一鍵完成」，自動設定為已完成並儲存回報。
- 專注上課模式同步支援老師回饋與本機暫存。
- 課程紀錄與課程詳情可查看老師回饋及課堂照片。
- 更新 PWA cache key，避免部署後仍讀取舊版樣式。

# V15.25 — Owner Brand Refinement

- Replaced the mustard Owner sidebar with a premium charcoal-and-gold palette.
- Split the sidebar subtitle into overflow-safe lines.
- Added hard width and overflow containment for the product mark.
- Reduced dashboard gold saturation while retaining role distinction.
- Updated the PWA cache version.

# V15.24 — Brand Refresh + Teacher KPI Foundation

- 修正桌面版側邊欄品牌字樣重疊，統一為 Danbridge / OPERATIONS / Education Management System。
- 新增依月份與校區篩選的老師 KPI：學生數、堂數、時數、營收、請假率、補課率、課堂回報完成率。
- Owner 可查看全部或單一校區；校區管理者固定自己的校區；老師只看自己的 KPI。

## V15.23 — Data Integrity & Brand Foundation
- Renamed product to Danbridge Operations.
- Added Owner gold navigation theme.
- Added data integrity audit/repair center and centralized branch normalization.


## V15.22 UI Polish
- Fixed summer/winter camp layout overflow across desktop, iPad, and narrow screens.
- Rebuilt camp form grids with zero-min-width responsive columns and wrapping weekday/teacher controls.
- Added role-specific dashboard identity: Owner gold, Branch Manager blue, Teacher white.
- Added role accent to dashboard header, KPI cards, active navigation, and account marker.
- No Firebase, permission, data-model, or business-logic changes.
# V15.21 Step 3 — Branch Business Layer

- Dashboard cards, reminders, room status, weekly volume and changes now obey the selected branch.
- Owner can view all branches or one branch; branch managers are locked to assigned scope.
- Settlement shows branch-only teacher KPI while company minimum-hours differences remain company-wide.
- Owner all-branch settlement and finance show per-branch teacher hour/pay breakdowns.
- Fixed and one-time expenses remain branch-scoped.
- Updated PWA cache version.


## V15.21 Step 2.1 — Branch permission hotfix
- 校區管理者的 scoped data 改存於自身 `companyAccess/{email}` 文件，沿用既有可讀權限。
- 移除儲存流程對 `branchViews` 的強制寫入，避免畫面先顯示 Missing or insufficient permissions。
- Owner 每次雲端同步都會更新所有管理者的 scopedDb。
- 校區管理者直接監聽自己的 companyAccess 文件，課程、老師、學生會即時更新。
- 舊 branchViews/teacherViews 僅做相容清理，不再阻斷新增或刪除權限。
## V15.21 Step 1 — Branch Manager Access Button Fix

- Fixed the branch-manager permission button by using stable document-level event delegation.
- Added Gmail validation, branch selection validation, duplicate-role protection, loading state, and visible error messages.
- Preserved the static HTML card instead of rebuilding it dynamically after login.
- Refreshes the branch-manager list immediately after a successful save.

# V15.20.1

- Fixed missing branch-manager UI in Security settings.
- Added a permanent Account Center, Teacher Account, and Branch Manager card.
- Branch checkboxes are now always rendered after owner login.
- Improved responsive layout for desktop, iPad, and mobile.

## V15.19 — App Shell / Render Orchestrator
- Split navigation and defaults into `js/app/app-shell.js`.
- Split shared select rendering into `js/ui/select-options.js`.
- Split `renderAll()` into `js/app/render-orchestrator.js`.
- No functional or data-model changes.

# V15.18 Lesson List and Search Module

- 新增 `js/modules/lessons/lesson-list-and-search.js`。
- 抽離全域課程搜尋、課程篩選、課程列表渲染及本月全部標記已上課。
- 保留既有老師端財務隱藏、課堂回報、衝堂警示與批次完成行為。
- 不修改 Firebase、資料格式、財務公式或角色權限。

# V15.17 Dashboard Module

- 新增 `js/modules/dashboard/dashboard.js`。
- 抽離 `renderDashboard()`、`enhanceDashboardV32()`、`enhanceDashboardV33()`。
- 保持營收、薪資、未收款、今日課程、教室狀態與老師端顯示算法不變。
- 更新 PWA 快取版本。

# V15.15 — Batch Lesson Operations Module

- Added `js/modules/calendar/batch-lesson-operations.js`.
- Extracted batch modal opening, candidate generation, preview, and application from the mixed application module.
- Preserved all selection state, conflict rules, lesson fields, makeup creation, save timing, and inline handler names.
- Updated the Service Worker cache key and integrity manifest.

# V15.13 — Makeup Management Module

- Extracted the makeup workflow into `js/modules/makeups/makeup-management.js`.
- Preserved all existing function names, DOM hooks, data fields, statuses, and save behavior.
- Reduced the remaining mixed application/business module without introducing new permissions or branch logic.

# Changelog

## V15.12 — Settings & Expenses Module
- Added `js/modules/settings/settings-expenses.js`.
- Moved 8 fixed-expense and one-time-expense CRUD functions out of the main application module.
- Preserved function bodies, global names, storage schema, and behavior.
- Updated Service Worker cache key and integrity manifest.

## V15.11 — Reports & Export Module
- Added `js/modules/reports/reports-export.js`.
- Extracted 16 finance reporting, settlement, CSV, Excel, print, and ICS functions.
- Preserved original function bodies and global call sites.
- Updated service worker cache version.
- Updated validation manifest generation to exclude the manifest itself.


## V15.10 — Camp Management Module

- Added `js/modules/camps/camp-management.js`.
- Extracted 33 summer/winter camp functions from the main application module.
- Preserved function bodies and existing global call contracts.
- Updated Service Worker cache version and project integrity manifest.

## V15.9 — Business Logic Module
- Added `js/modules/business/business-logic.js`.
- Extracted 14 finance, tuition, payroll, and settlement calculation functions without changing their bodies.
- Updated script loading order and Service Worker cache version.
- Added Step 09 documentation and focused regression checklist.

## V15.8 — Data Persistence Module

- Added `js/core/data-persistence.js`.
- Extracted 19 persistence and backup functions without rewriting them.
- Preserved localStorage keys and database normalization behavior.
- Updated the service-worker cache version.

# Danbridge Scheduler Changelog

## V15.3 Core Utilities

### 新增
- `js/core/constants.js`：集中 Local Storage／版本儲存鍵值。
- `js/core/dom.js`：集中 `$()` DOM 查找工具。
- `js/core/date-utils.js`：集中日期格式與日期位移工具。

### 重構
從 `application-and-business-features.js` 安全抽出以下純函式：

- 日期：`localDate`, `todayStr`, `monthNow`, `weekday`, `shiftDate`, `monthLabel`
- 共用：`uid`, `money`, `hours`, `esc`, `mapUrl`, `shiftTime`, `minutesOf`, `fmtHours`
- DOM：`$`
- 常數：`LS_KEY`, `VERSION_KEY`, `LAST_EXPORT_KEY`, `MIGRATION_KEY`

### 相容性
- 所有舊版全域函式名稱保持不變。
- 未修改資料格式、Firebase 流程、課表、薪資、財務或營隊邏輯。
- `keyOf()` 與 `authLogout()` 的 V15.2 安全修正完整保留。

## V15.4 — Students Module

### Refactored
- Extracted the student CRM functions into `js/modules/students/students-crm.js`.
- Reduced the responsibility of `application-and-business-features.js`.
- Preserved all existing global function names for inline UI handlers.

### Unchanged
- Student data schema and localStorage format.
- Firebase synchronization behavior.
- Student creation, editing, deletion, search, history, billing, and smart-scheduler entry points.

## V15.5 — Teachers Module

### Refactored
- Extracted teacher master-data functions into `js/modules/teachers/teachers-crm.js`.
- Preserved global function names used by existing inline UI handlers.
- Reduced the responsibility of `application-and-business-features.js`.

### Unchanged
- Teacher data schema and localStorage format.
- Firebase synchronization behavior.
- Hourly rate, minimum weekly hours and fixed workday behavior.
- Payroll, monthly settlement, teacher workspace and calendar calculations.

## V15.6 — Calendar UI Module

### Refactored
- Extracted calendar rendering and interaction functions into `js/modules/calendar/scheduler-ui.js`.
- Preserved existing global function names and event-handler entry points.
- Reduced the responsibility of `application-and-business-features.js`.

### Unchanged
- Lesson schema, Firebase synchronization and calendar visual behavior.
- Course editor, conflict checks, room checks and week/month copy behavior.


## V15.7 — Course Operations Module

### Refactored
- Extracted course modal, save, edit, delete and move operations into `js/modules/calendar/course-operations.js`.
- Extracted student/room conflict blocking and teacher-overlap warning helpers.
- Extracted course detail drawer state and handlers.

### Unchanged
- Lesson data schema, Firebase sync, recurring lesson behavior, collision rules, billing, payroll and settlement calculations.

## V15.14 — Weekly-first Calendar UI
- Removed monthly schedule-copy actions from the calendar interface.
- Removed selected-lessons-to-next-month action.
- Kept weekly copy as the single quick-copy workflow.
- Refined the calendar header and toolbar visual hierarchy.
- Added responsive styling for desktop, iPad, and mobile layouts.

## V15.16 — Smart Scheduler Module
- Extracted smart scheduling functions into `js/modules/calendar/smart-scheduler.js`.
- Preserved student availability parsing, 62-day search cap, 80-candidate cap, and top-40 result display.
- Preserved student, teacher, room, and location collision checks.
- Preserved preference for slots adjacent to an existing teacher lesson.
- Preserved the existing smart scheduler modal and lesson-editor handoff.
- No changes to lesson data, Firebase synchronization, payroll, finance, or permissions.

## V15.20 — Branch Role and Data Scope
- Added branch manager role with one-or-many branch assignments.
- Added branch-scoped cloud views and automatic legacy location migration.
- Branch managers can view scoped students, teachers, lessons, revenue, unpaid amounts, hours and payroll.
- Branch manager access is read-only until scoped write transactions are introduced.

## V15.20.2
- 分離歸屬校區與上課方式，加入校區教室、到府與線上歸屬。

## V15.21 Step 1.1
- Branch manager list updates immediately after save/delete.
- Added responsive branch access controls.
- Added branch-manager view compatibility fallback for existing Firestore rules.

## V15.21 Step 2 — Branch Business Scope
- Added shared branch filters to Dashboard, Month-end Settlement, and Company Finance.
- Owner can switch between all branches, individual branches, and unassigned legacy records.
- Branch managers are locked to their assigned branch.
- Revenue, unpaid amounts, lessons, teacher hours/payroll, students, and teachers are calculated from lessons in the selected branch.
- Fixed and one-time expenses now require a branch and are filtered by branch.
- Teacher payroll remains consolidated when Owner selects all branches; branch view shows only the teacher's work and payroll generated in that branch.

## V15.22.2 — Security Permission Card Containment
- Fixed teacher and branch-manager permission entries extending outside the Security Settings cards.
- Permission actions now wrap within the card at every desktop, iPad, and mobile width.
- No changes to Firebase, permissions, or business calculations.

## V15.25.1 — Owner UI Contrast Balance
- Reduced the abrupt dark-gold / pure-white contrast across the Owner dashboard.
- Rebalanced the Owner sidebar with a softer bronze accent and lower-intensity active state.
- Converted dashboard cards, branch selector, and lesson rows to warm neutral surfaces.
- Reserved gold for hierarchy and primary actions instead of applying it to every component.
- Unified borders, shadows, focus rings, and muted text for a calmer professional appearance.

## V15.25.3 — Calendar Base Date Centering
- Corrected the base-date input so its value is optically centered horizontally and vertically.
- Positioned Safari/iPad's native calendar indicator independently so it no longer pushes the date text off-center.
- Preserved native date selection behavior and responsive toolbar layout.
