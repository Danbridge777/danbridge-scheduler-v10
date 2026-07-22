# V15.2 Core Safety

本階段只處理兩個低風險問題，不改變課表、薪資、財務或 Firebase 資料格式。

## 修改內容

1. 新增 `js/core/utils.js`
   - 建立唯一的全域 `keyOf(lesson)`。
   - 欄位順序與 V15.1 原本三個區域函式完全一致。
   - 提供 Firebase 尚未載入時的 `authLogout()` 安全後備。

2. `application-and-business-features.js`
   - 移除三個內容相同的區域 `keyOf()`。
   - 原本呼叫位置繼續使用 `keyOf()`，執行結果不變。

3. `firebase-auth-and-cloud-sync.module.js`
   - 公開真正的 `window.authLogout()`，內部呼叫 Firebase `signOut(auth)`。

4. `index.html`
   - 在主業務程式前載入 `js/core/utils.js`。

## 建議測試

- 老闆登入與登出。
- 老師登入與登出。
- 選取課程後複製到下個月。
- Ctrl/Command+C、貼到指定日期。
- 複製目前週到下一週。
- 確認重複課程仍會被略過。
