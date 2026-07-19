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

