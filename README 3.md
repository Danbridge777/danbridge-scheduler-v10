# V15.27.2 — Owner 補交申請中心

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
