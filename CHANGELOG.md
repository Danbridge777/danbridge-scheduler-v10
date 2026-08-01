# Changelog

## V17.25 — Teacher Schedule Row Revenue Audit
- Replaced teacher-count multiplication with explicit per-teacher timetable revenue rows.
- Each timetable row calculates student hourly rate × scheduled duration.
- Repeated lessons remain counted; no revenue deduplication.
- Collection/payment/report/status fields do not affect revenue.

## V17.14 — 每位老師個別設定底薪
- 移除所有正職老師共用 NT$35,000 的預設底薪。
- 每位老師的固定底薪必須由管理者自行輸入並獨立儲存。
- 正職老師未填固定底薪時禁止儲存，避免月底結算套用錯誤金額。
- 兼職老師未設定底薪時維持按實際工時 × 時薪計算。
- 老師清單在未設定底薪時顯示「尚未設定」。


## V17.13 — 正職底薪＋超時薪資公式
- 正職薪資改為：固定底薪＋超過本月最低工時的時數×超時時薪。
- 既有正職老師未設定底薪時，預設使用 NT$35,000。
- 兼職與未設定底薪老師維持按實際授課時數計薪。
# V17.2 Executive Authentication UI

- Upgraded the login screen to a full-width black-and-gold executive workspace.
- Added a code-rendered operations dashboard, status cards, schedule chart, and trust indicators.
- Preserved Google authentication, Firebase synchronization, roles, and permissions without logic changes.

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

## V17.3 — Authentication Card Alignment Polish
- Corrected the Danbridge logo lockup alignment in the authentication card.
- Enlarged the right-side login panel for stronger visual balance.
- Preserved all authentication and cloud-sync behavior.

## V17.4 — Aligned Authentication Stage
- Aligned the executive dashboard and secure access panel to the same top and bottom edges.
- Expanded the dashboard vertically for a balanced two-column enterprise composition.
- Enlarged the access card, logo and Google sign-in control while preserving all authentication behavior.
- Responsive tablet and mobile layouts remain stacked and fully usable.

## V17.5 — iPad Drag Recovery and Lesson Record Toolbar
- Fixed iPad touch drags remaining in a locked/dragging state after pointer release outside the lesson card.
- Added pointer cancellation, lost-capture, and global release cleanup.
- Prevented lesson-record Month and Student filters from overlapping at iPad widths.
- No Firebase, permission, payroll, or lesson business logic was changed.

## V17.12
- Restored the missing right border on the lesson month field.
- Forced month text centering across desktop Safari and iPadOS.

## V17.16 — Unified Payroll Core
- Added a single payroll calculation result shared by finance, settlement, dashboard payroll and exports.
- Added per-teacher payroll mode, overtime rate and short-hours deduction rate fields.
- Added fixed-salary deductions when actual hours are below the monthly minimum.
- Removed branch-specific fallback to legacy hourly payroll in settlement and finance.
- Upgraded branch-manager teacher payroll cards to display full minimum hours, actual hours, difference, formula, breakdown and weekly details.
- Left branch assignment and unassigned-branch data unchanged.

## V17.17 — Student CRM Independent Scroll
- Added separate vertical scrolling for the Student / Parent CRM editor and student list on desktop and landscape tablet layouts.
- Kept the CRM search toolbar and student table header visible while the student list scrolls.
- Added viewport-aware height recalculation for resize, orientation change, and iPad visual viewport changes.
- Preserved normal document scrolling on stacked tablet and mobile layouts.
- No CRM data, permissions, synchronization, or business logic changed.

## V17.18
- Added per-teacher company revenue KPI calculated from scheduled chargeable lessons.
## V17.19
- Enlarged each teacher company revenue KPI card and payable salary card.
- Prevented the five-card payroll KPI row from becoming too narrow.
- Preserved responsive tablet and mobile layouts.


## V18.0 — Information Architecture & Finance Center
- Dashboard now focuses on lesson counts, teaching hours, students, teachers, makeups and operational changes; monetary cards are hidden.
- Consolidated Company Finance, Teacher KPI and Monthly Settlement into one Finance Center with internal tabs.
- Added collapsible finance detail cards so expense and payroll details are loaded on demand visually.
- Added teacher KPI search and sorting controls.
- Renamed primary navigation around operations, CRM, course management and finance.
- Added a global floating quick-action menu for lessons, students, teachers, expenses and camp registration.
- Preserved existing finance, payroll, settlement and revenue calculation functions and data IDs.

## V18.1 — Enterprise Finance Center
- Reorganized Finance Center into Finance Overview, Teacher Salary / KPI, Student Collections and Expense Management.
- Removed the standalone Monthly Settlement navigation entry while preserving its calculations, records and exports.
- Rebuilt Teacher KPI as a searchable left-list and right-detail workspace.
- Added Student Collections summary cards and a collapsed searchable complete list.
- Restored reliable finance rendering by preserving every existing data target while moving it into the new modules.
- Standardized card alignment, grid containment and responsive desktop, iPad and mobile layouts.
- Preserved Firebase, permissions, synchronization, revenue formulas, payroll formulas and stored data structures.

## V18.1.1 — Finance UI Cleanup
- Removed the standalone Monthly Settlement navigation item and all settlement-only controls from the visible Student Collections workflow.
- Renamed the remaining collection filters and refresh action around student receivables.
- Replaced the dark navy and gold finance treatment with a lighter blue-gray enterprise palette.
- Isolated nested Finance Center navigation from global sidebar group labels that caused misalignment.
- Standardized finance headings, descriptions, tab labels and active-state alignment.
- Locked all four Finance Center module controls to identical dimensions in both normal and active states.
- Increased heading, description and module-label contrast for clearer reading.
- Replaced circular teacher initials with slim accent rails and decorated name rows.
- Added a light profile header, accent rule and stronger name hierarchy to Teacher KPI details.
- Aligned every teacher-list accent rail and name to fixed grid columns.
- Removed teacher-initial avatars from complete payroll cards and replaced them with line-decorated headers.
- Constrained desktop payroll cards and KPI grids to prevent horizontal overflow while preserving iPad stacking.

## V18.2 — Unified Tutoring and Summer Camp Revenue
- Defined total monthly revenue as tutoring timetable revenue plus summer-camp registration fees.
- Excluded camp timetable rows from student revenue so multi-teacher camps never multiply tuition.
- Preserved camp timetable rows for teacher hours and payroll calculations.
- Added separate Tutoring Revenue and Summer Camp Revenue lines to the finance breakdown and copied summary.
- Applied the same calculation to company-wide and branch-scoped finance views.

## V18.3 — Student LINE Billing Copy
- Added a per-student Copy LINE action to the monthly Student Collections table.
- Combined tutoring hours and Summer Camp registration dates into one parent-facing monthly message.
- Kept parent tutoring charges independent of teacher headcount.
- Omitted empty tutoring or Summer Camp sections automatically.
- Used the approved opening, totals and confirmation wording for the copied message.

## V18.3.1 — Family LINE Billing
- Grouped all children sharing the same parent into one LINE billing message.
- Added a per-child subtotal and one combined family monthly total.

## V18.3.2 — Finance Number Fit and Parent Matching
- Sized revenue cards for million-level totals and expense cards for hundred-thousand-level totals without overflow.
- Restricted family billing groups to students with the same normalized parent name only.
- Removed decorative brackets from parent-facing billing text.

## V18.3.3 — Visible Family Billing Scope
- Built each family message from the current month's visible settlement rows only.
- Prevented archived or unrelated database records from entering a parent's copied LINE bill.

## V18.3.4 — Complete Active Family Members
- Included active siblings sharing the same parent name even when a sibling is absent from the tutoring settlement rows.
- Continued excluding camp backing records and inactive student records.

## V18.3.5 — Complete Student Collections List
- Included Summer Camp registration-only students in the branch-scoped Student Collections table.
- Kept every student with either monthly lesson rows or Summer Camp receivables visible.

## V18.3.6 — Full Student Directory in Collections
- Displayed every student record in Student Collections, including students with zero activity in the selected month.
- Added the full student count to the expandable list heading.
- Kept the average leave rate based on students with lesson activity so zero-activity rows do not dilute it.

## V18.3.7 — Parent Search
- Added a dedicated parent-name search field beside the student search in Student Collections.
- Allowed student and parent filters to work independently or together.

## V18.4 — Finance Reconciliation
- Counted each tutoring lesson once for company revenue regardless of how many teachers share the lesson.
- Kept Summer Camp revenue sourced only from student registrations.
- Included all applicable teachers in KPI, payroll and salary detail lists, including zero-lesson and fixed-salary teachers.
- Reconciled finance revenue with Student Collections receivables.
- Standardized all five finance summary cards to the same height and reduced number typography to prevent clipping.

## V18.5 — Interface Clarity Refresh
- Separated calendar navigation, filters and tools into three visually distinct control bands.
- Simplified the calendar student filter by removing the redundant inline search box.
- Narrowed and condensed the Student CRM editor while widening the student directory.
- Improved CRM table hierarchy with clearer headers, zebra rows and compact actions.
- Reworked Lesson Records into a compact filter panel and scan-friendly fixed-column table.

## V18.6 — One-click Chinese / English UI
- Added a persistent EN / 中文 toggle for the complete application interface.
- Translated navigation, forms, filters, buttons, statuses, finance, camps, CRM, reports and dynamic UI labels.
- Preserved student, parent, teacher, course and financial data exactly as entered.
- Remembered the selected language across reloads and translated newly rendered interface elements automatically.

## V18.7 — Synchronized Finance Month
- Added a Data Month selector to Financial Overview, Teacher KPI, Student Collections and Expense Management.
- Synchronized all four selectors and underlying native month fields.
- Recalculated all four finance modules immediately after any month change.
- Filtered recurring expenses to records active in the selected month and one-time expenses to that exact month.

## V18.7.1 — Safari Month and Language Button Fix
- Updated finance data on month input, selection, blur or Enter in Safari.
- Persisted the active finance workspace month as the authoritative value for all finance calculations.
- Moved the language toggle into the header action group and automatically remounted it after authentication refreshes.
# V18.8 — 營隊課表與報名流程整合

- 將夏令營操作整理為「建立營隊課表」與「學生報名與收費」兩個連續步驟，明確區分老師工時與學生收入。
- 夏令營學生報名可選擇既有營隊課表，並一鍵帶入所選月份的全部課表日期，不必重複勾選。
- 報名紀錄保存所屬營隊；舊紀錄仍可依原日期推斷營隊，不破壞既有資料。
- 冬令營介面同步簡化說明，避免把建立課表誤認為另一套報名功能。
# V18.9 — 冬夏令營建立介面精簡

- 冬、夏令營改為單一建立表單，不再要求選擇學生、營隊代碼、教師群組或教室。
- 校區只保留「美術東」與「河西一路」，班級名稱改為直接輸入並自動建立班級資料。
- 新增早上／下午時段選項，仍可調整開始與結束時間、上課星期及日期範圍。
- 收費直接設定在營隊班級；既有學生報名與費用資料保留但不再顯示重複表單。
# V18.9.1 — 營隊日期欄位窄版修正

- 冬、夏令營表單在窄版畫面自動切換為單欄，開始與結束日期可完整顯示。
- 限制日期、時間、金額與選單寬度不超出卡片，避免 iPad 分割畫面或窄視窗裁切內容。
# V18.9.2 — 營隊日期完整顯示

- 營隊建立表單固定最多兩欄，不再以整個瀏覽器寬度誤判版面。
- 日期欄位取得足夠寬度，可完整顯示年、月、日。
# V18.9.3 — 日期欄改為完整列

- 開始日期與結束日期各自獨占一整列，避免 Safari 日期控制元件裁掉最後的天數。
- 調整日期欄字級與內距，完整顯示年、月、日。
# V18.10 — 移除冬夏令營獨立介面

- 側邊欄移除「夏令營」與「冬令營」，快速新增選單同步移除夏令營報名入口。
- 冬夏令營獨立建立介面停止顯示，營隊課程改由一般課表直接安排。
- 財務中心「學生收款」完整保留；既有營隊課程、收費與歷史資料均未刪除。
