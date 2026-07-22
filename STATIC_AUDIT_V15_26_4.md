# V15.26.4 Static Audit

## 修正內容

- 移除前端對 `lessonReportExtensions` 集合的監聽與寫入。
- 延長申請改存於 `lessonReports/{lessonId}` 文件內。
- 老師／管理者僅讀取既有 `lessonReports` 查詢，不再額外查詢無權限集合。
- Owner 核准後寫入同一份回報文件的 `extensionStatus`、`extensionUntil` 等欄位。
- Firestore Rules 與 Storage Rules 均改從 `lessonReports/{lessonId}` 驗證 10 分鐘期限。
- 保留課程結束後 3 小時的原始限制。

## 靜態檢查

- JavaScript 語法：34 個檔案通過 `node --check`。
- 專案引用與 HTML ID：`tools/validate_project.py` 通過。
- 舊集合程式引用：前端與 Rules 已移除；部署文件僅保留遷移說明。

## 必要部署

必須同時部署 GitHub Pages、Firestore Rules、Storage Rules。僅更新網站檔案不足以修正 Firebase 權限。
