# V15.27.5 — Storage Fallback

- 課堂照片上傳改為非阻斷流程。
- Firebase Storage 尚未啟用或上傳失敗時，課程回報文字資料仍正常儲存。
- 支援部分照片成功、部分失敗；成功照片仍會寫入回報。
- 新增清楚提示，區分「回報儲存成功」與「圖片未上傳」。
- 更新 Service Worker 快取版本，避免載入舊版儲存流程。

# V15.27.3 — Lesson Report Storage Authorization Fix

- Aligned Firebase Storage authorization with the V15.27 report-extension architecture.
- Storage now validates approved windows through `reportExtensionGrants/{uid}__{lessonId}` instead of obsolete fields in `lessonReports`.
- Added compatibility for branch managers acting as teachers and teacher IDs stored in user profiles.
- Kept the 8 MB/image and image MIME restrictions.
- Added specific diagnostics for Storage-rule and Firestore-rule deployment failures.
- Deployment now requires both Firestore and Storage rules.

# V15.27.3 — Owner 補交申請中心

- 新增 Owner 專用「補交申請」側邊入口與待處理數量。
- 新增待處理／已核准／已拒絕／全部清單。
- 支援逐筆核准 10 分鐘及拒絕。
- 修正登入後頁首重建導致通知鈴消失。
- Owner 即時監聽申請集合並更新清單。

# V15.27.1 — Lesson Report Permission Rewrite

- Rebuilt 10-minute extension requests as independent documents keyed by `UID__lessonId`.
- Teacher requests no longer write or merge into `lessonReports`.
- Owner approval updates only the independent request document.
- Report authorization reads the approved request directly and expires after 10 minutes.
- Request creation validates active company membership, authenticated UID, and bound teacherId; legacy lessonMeta formatting can no longer block the request itself.
- Actual lesson-report saving still validates trusted lessonMeta and the teacher assignment.
- Supports single requests and batches larger than six lessons.
- Updated the PWA cache key so browsers do not continue loading the previous implementation.

# V15.27.1 — Teacher Extension Permission Full Audit

- Rebuilt teacher extension-request authorization around active membership, trusted lessonMeta ownership, authenticated UID, and bound teacherId.
- Removed fragile dependency on exact role strings and exact teacherIds array equality.
- Added client preflight checks for missing teacher binding and stale lessonMeta.
- Improved permission error diagnostics.
- Teachers and branch managers acting as teachers can submit one or many requests for their own lessons.

# V15.27.1 — Teacher Extension Permission & Multi-Request Identity Fix

- 修正老師端 `reportExtensionRequests` 即時監聽出現 Missing or insufficient permissions。
- 老師端查詢只以登入 UID 限縮，Rules 同步只允許讀取 `requesterUid` 為自己的申請。
- 申請文件 ID 改為 `lessonId + requesterUid`，避免多人授課、舊申請及重新申請互相覆蓋。
- Owner 仍可即時看到所有老師申請並逐筆核准。
- 批次申請維持可勾選 6 筆以上，且每筆獨立寫入。
- 本版本必須重新部署 `firebase/firestore.rules`。

## V15.27.1 — Owner Extension Inbox + Batch Requests

- Moved 10-minute report-extension applications into the dedicated `reportExtensionRequests` Firestore collection.
- Owner now subscribes directly to all pending applications in real time.
- Teachers and branch managers can submit multiple overdue lessons in one batch, including 6 or more at once.
- Added “Select first 6”, “Select all”, and manual multi-select controls.
- Owner approval updates both the request inbox and the lesson report extension window.
- Firestore Rules updated for the new request collection.

## V15.26.4.12 — Branch Manager Own-Lesson Extension Repair

- Fixed the 10-minute extension request failure for branch managers acting as teachers on their own lessons.
- Removed the permission-sensitive pre-read of existing lesson report documents.
- Extension requests now merge trusted identity metadata from `lessonMeta`, repairing legacy reports missing branch or teacher-scope fields.
- Firestore Rules permit only verified trusted identity repairs together with the extension-request fields.
- Advanced module and service-worker cache versions.

## V15.26.4.10 — Teacher / Branch Manager Login Permission Fix

- Fixed login failure caused by copying `scopedDb` and other companyAccess-only fields into `users/{uid}`.
- Login profile synchronization now writes only the identity fields permitted by Firestore Rules.
- Preserves teacherId, branchIds, role, active state, and own-report permission.

## V15.26.4.10 — Branch Manager Extension Request Identity Sync Fix

- 每次登入同步 companyAccess 到 users profile。
- Firestore Rules 的 teacherId 與 branchIds 可安全回退到受保護的 users profile，修正舊管理者權限資料不完整造成的申請失敗。
- 申請仍僅限管理者本人課程，且校區範圍必須符合授權。

# V15.26.4.6 — Extension Request Existing Report Fix

- Existing lesson reports now update only extension-request fields.
- New request documents still require full trusted lesson metadata.
- Firestore Rules validate manager scope directly against lessonMeta.
- Fixed stale V15.26.4.4 README version.

# V15.26.4.5 — Extension Request Permission Fix

- 修正老師／校區管理者對既有舊版 lessonReports 文件申請「開放 10 分鐘」時遭 Firestore 拒絕。
- 申請時允許補齊 companyId、lessonId、branchId、reportedForTeacherIds、editableUntil。
- 上述欄位仍須與 Owner 發布的 lessonMeta 完全一致，未放寬跨老師或跨校區權限。

# V15.26.4.4 — Batch Branch & Room Assignment

- 批次調整新增「歸屬校區」。
- 教室改為下拉選單，依所選校區顯示可用教室。
- 支援批次清除教室。
- 批次更換校區時同步更新 branchId、location 與 onsite 模式。
- 預覽會顯示套用後的校區與教室。

## V15.26.4.3 — Owner LessonMeta Permission Fix

- 新增 Owner 對 `companies/{companyId}/{document=**}` 的完整 Firestore 權限。
- 修正 Owner 主資料可寫入，但 `lessonMeta` 課程權限索引被拒絕的問題。
- 保留老師、校區管理者在特定集合中的限制；重疊規則只會對 Owner 放行。
- 必須重新部署 Firestore Rules。

# V15.26.3 — 10-Minute Report Reopen Approval

- 老師與校區管理者皆以課程結束後 3 小時自動鎖定。
- 鎖定後可向 Owner 送出「開放 10 分鐘」申請。
- Owner 會在通知中心收到申請，確認後從核准當下起開放 10 分鐘。
- 10 分鐘到期後前端、Firestore 與 Storage 同時重新鎖定。
- 校區管理者只能申請自己授課的課程，不能修改其他老師回報。
- Owner 仍可查看並修改全部校區回報，不受時間限制。

# V15.26.2 — Permission Verification Hardening

- 新增 Owner 發布的 lessonMeta 權限資料。
- Firestore 以可信課程截止時間驗證老師三小時限制。
- 校區管理者只能寫入自己授課且屬於管理校區的回報。
- Storage 上傳同步驗證授課老師與校區。
- 移除前端可偽造 editableUntil 的後端權限缺口。

# V15.26.1 — Lesson Reporting Permission Layers

- Owner 可查看並修改全部校區課堂回報。
- 校區管理者可查看所屬校區全部回報；其他老師內容為唯讀；只能回報自己的課。
- 老師只能回報自己的課，課程結束 3 小時後前端與 Firestore Rules 同步鎖定。
- 課堂回報新增 branchId 與 editableUntil，並附 Firestore／Storage Rules 與部署說明。

# V15.26 — Notification Center

- Added a role-aware notification bell and slide-out Notification Center.
- Added alerts for incomplete lesson reports, unpaid lessons, pending makeups, tomorrow lessons, teacher hour shortages, and teacher schedule conflicts.
- Owner sees company-wide notifications; branch managers see assigned branches; teachers see only their own classes.
- Notifications support unread state, category filtering, mark-all-read, and direct navigation to the related lesson or module.
- Owner and branch-manager lesson reporting permissions from V15.25.5 remain intact.
- Updated PWA cache to V15.26.

# V15.25.5 — Owner Lesson Reporting

- Owner now has a dedicated lesson-report action without losing course editing.
- Owner can submit or correct reports for any lesson, including content, homework, feedback, photos and one-click completion.
- Reports record the reporting role and the teachers assigned to the lesson for auditability.
- Course drawer and lesson list both expose the reporting entry point.
- Teacher and branch-manager restrictions remain unchanged.

# V15.25.4 — Branch Manager Lesson Reporting

- 校區管理者帳號新增對應老師身分綁定。
- 校區管理者可查看所屬校區全部課程，但只能回報自己教授的課程。
- 支援上課內容、作業、老師回饋、課堂照片、開始上課與一鍵完成。
- 其他老師的課程維持唯讀，不允許代填。
- 課堂回報監聽與未完成提醒納入校區管理者本人課程。

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


## V15.26.4.3 — Cloud Sync Cache Fix
- 更新 Service Worker cache key。
- JavaScript / CSS 改為 network-first。
- Firebase 同步模組加入版本查詢字串，避免舊模組被快取。
- 保留 Owner 雲端權限與精確同步階段錯誤訊息。

## V15.26.4.10 — Login Source of Truth & Lesson Report Trust Fix

- Teacher and branch-manager login now reads `companyAccess/{email}` directly and no longer writes `users/{uid}` during login.
- Added explicit account diagnostics for missing teacher binding, inactive accounts, invalid roles, and missing branch assignments.
- Lesson report saves and 10-minute reopen requests now read `lessonMeta/{lessonId}` first and reuse its exact `branchId`, `teacherIds`, and `editableUntil` values.
- Existing legacy lesson reports may safely backfill missing trusted identity fields, but existing trusted fields cannot be changed.
- Service Worker and module cache version advanced to V15.26.4.10.


## V15.26.4.10 — Branch Manager Dual Role
- 校區管理者在本人課程上完整套用老師權限：課堂回報、快速完成、上課模式、作業、回饋、照片、內部備註與逾時申請。
- 校區管理者查看其他老師課程時仍維持唯讀。
- Firestore 權限仍限定管理者只能修改本人 teacherId 所屬課程。

## V15.26.4.12 — Cloud Sync Performance
- lessonMeta 改為差異同步，只新增、更新或刪除真正變動的課程索引。
- 老師與校區管理者檢視加入 client hash，未變動時不再重寫完整資料。
- 課程權限索引與角色檢視改為平行發布，縮短 Owner 儲存後等待時間。
- 登出／切換帳號時重設同步快取，避免跨帳號誤判。


## V15.27.1
- 逾時課程的「申請開放 10 分鐘」與批次申請移至回報表單上方，避免長表單造成誤判為功能卡住。
- 批次申請按鈕固定存在，支援一次選取 6 堂以上。
- Firestore Rules 相容舊 lessonReports 文件缺少 trusted identity 欄位的情況；老師獲准後可用可信 lessonMeta 修復並儲存。
- 逾時表單開啟時自動回到頂部。

## V15.27.1 — 補交申請可靠性重構
- 每次補交申請都建立新文件，不再被舊申請文件誤判為 update。
- Owner 核准後建立獨立 reportExtensionGrants 授權文件。
- 老師端僅查詢 requesterUid 為自己的申請。
- teacherId 登入時統一正規化為字串。
