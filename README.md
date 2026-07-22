# Danbridge Operations V15.27.11

課程回報與補交授權穩定化版本。

- 每堂課使用獨立 `reportExtensionGrants/{lessonId}`。
- Owner 核准改為 Firestore 原子批次，申請狀態與授權文件同時成功或同時失敗。
- 老師儲存逾時回報前，先確認該堂課的正式 grant、lessonId、狀態與 Firestore 伺服器核准時間。
- 申請規則確認登入老師確實屬於該堂課，避免錯誤或交叉授權。
- 10 分鐘最終有效性仍由 Firestore Rules 的 `request.time` 判斷。
