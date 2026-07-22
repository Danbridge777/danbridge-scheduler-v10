# V15.28.6 Lesson Report Grant Rule Fix

- 修正 Owner 已核准補交後，老師仍被 Firestore 拒絕儲存課程回報。
- `extensionOpen()` 不再以日期、時間、學生 ID 與 teacherIds 陣列完全相等作為授權條件。
- 授權仍嚴格限制為：有效公司成員、該堂課授課老師、指定老師本人、approved 狀態、核准後 10 分鐘內。
- 建立 Grant 時保留 lessonMeta 的 teacherIds 原始順序，避免陣列排序造成 Rules 比對失敗。
- 更新 permission-denied 錯誤訊息版本號。
