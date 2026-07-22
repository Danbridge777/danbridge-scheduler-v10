# Danbridge Operations V15.29 Cleanup Stable — 完整獨立版

這個資料夾是完整專案，不依賴舊版任何程式檔案。

## 已保留

- 老師當天正常課程回報
- 上課內容
- 家庭作業
- 課程狀態
- 照片上傳
- Owner／校區管理者查看回報
- Firebase 雲端同步
- `lessonReports`、`lessonMeta`、`teacherViews`

## 已完全移除

- 超時回報申請按鈕
- 補交申請、核准、拒絕
- 延長授權與倒數
- 補交通知
- `reportExtensionRequests`
- `reportExtensionGrants`

## 時間規則

- 課程日期當天 00:00 起可回報。
- 隔日 00:00 立即鎖定。
- 未來課程不可提前回報。
- 沒有任何補交申請入口。

## 最乾淨的替換方式

### 不需要保留本機 Git 紀錄

1. 先把舊資料夾改名備份。
2. 將本資料夾放到原本位置。
3. 用 VS Code 開啟本資料夾。
4. 用 GitHub Desktop 選擇 `Add Existing Repository`；若本資料夾沒有 `.git`，請先從 GitHub Clone 原 Repository，再將本資料夾內容放入 Clone 後的資料夾。

### 需要保留原本 Git 歷史（建議）

`.git` 是 Git 的版本歷史，不是舊程式碼。請只保留舊專案根目錄中的 `.git`，其餘舊檔全部刪除，再把本資料夾全部內容放進去。

## 部署

除了網站檔案，也必須部署：

- `firebase/firestore.rules`
- `firebase/storage.rules`

否則線上權限可能仍使用舊規則。

## 驗證

在專案根目錄執行：

```bash
python3 tools/validate_project.py
```

應顯示 `PASS`。
