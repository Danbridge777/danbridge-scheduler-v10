# Firebase Rules 部署

本版本的課堂回報規則為「只限課程當天」。請同時部署：

```bash
firebase deploy --only firestore:rules,storage
```

部署後請完成：

1. Owner 登入系統一次，等待雲端同步完成。
2. 確認每堂課的 `lessonMeta` 已包含 `editableFrom` 與 `editableUntil`。
3. 老師或校區主管測試今天的課程可儲存文字、家庭作業及照片。
4. 測試昨天與明天的課程皆為唯讀，且沒有任何申請或延長按鈕。
