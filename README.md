# V15.27.5 — Storage Fallback

本版讓 Firebase Storage 尚未啟用時，老師仍可正常儲存課程回報。

- 圖片上傳改為非阻斷流程。
- Storage 未啟用、拒絕或暫時失敗時，文字內容、家庭作業、老師回饋、上課狀態與備註仍會寫入 Firestore。
- 系統會明確提示「回報已儲存，但圖片未上傳」。
- 已成功上傳的照片仍會保存；失敗的照片不會拖垮整份回報。
- 目前只需部署 Firestore Rules；未來啟用 Storage 後，再部署 Storage Rules 即可恢復照片功能。

目前免費方案可執行：

```bash
firebase deploy --only firestore:rules
```

未來啟用 Firebase Storage 後，再執行：

```bash
firebase deploy --only storage
```

# V15.27.3 Deployment Requirement

This release fixes lesson-report photo uploads after a 10-minute extension approval. Deploy both rule files:

```bash
firebase deploy --only firestore:rules,storage
```

Uploading only the website or only Firestore rules is insufficient because lesson photos are authorized by Firebase Storage Rules.

# V15.27.3 — Owner 補交申請中心

- 新增 Owner 專用「補交申請」側邊入口與待處理數量。
- 新增待處理／已核准／已拒絕／全部清單。
- 支援逐筆核准 10 分鐘及拒絕。
- 修正登入後頁首重建導致通知鈴消失。
- Owner 即時監聽申請集合並更新清單。

# Danbridge Operations V15.27.1

修正「校區管理者同時也是老師」時，對自己的課程申請補交回報 10 分鐘會顯示申請失敗。

本版送出申請前不再讀取可能缺少 `branchId` 的舊 `lessonReports` 文件；送出時會依受保護的 `lessonMeta` 同步補齊 `companyId`、`lessonId`、`branchId`、`reportedForTeacherIds` 與 `editableUntil`，讓舊回報文件也能安全升級。

部署時必須同時更新 GitHub Pages 與重新部署 `firebase/firestore.rules`，否則前端修正與雲端權限規則不會完整生效。

### V15.27.1 deployment note

Deploy both the web files and Firestore rules. Branch managers retain full teacher reporting actions for lessons assigned to their own `teacherId`, including the 10-minute extension request.
