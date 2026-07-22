# V15.28.4 補交授權修復

## 修正內容
- Owner 核准時改由 Firestore `lessonMeta` 取得課程身分欄位，不再使用可能過期的老師端申請快照。
- `reportExtensionRequests` 與 `reportExtensionGrants` 維持同一批次寫入，並於完成後立即驗證 Grant 文件存在。
- 老師端辨識授權時，以課程 ID、核准老師與授權狀態為主；實際儲存仍由 Firestore Rules 與可信任 `lessonMeta` 驗證。
- 儲存前的授權一致性檢查改與雲端 `lessonMeta` 比對，不再被本機舊課程資料誤判。
- Owner 登入後會自動掃描「已核准但缺少／欄位不一致」的舊授權，重建正確 Grant，並重新開放 10 分鐘。
- Service Worker cache 與 module query 升版至 15.28.4，避免裝置繼續執行舊程式。

## 靜態檢查
- `node --check`：通過
- `tools/validate_project.py`：通過
