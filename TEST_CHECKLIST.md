# V15.16 Test Checklist

## Smart scheduler
- [ ] Open smart scheduler from its existing entry point.
- [ ] Selected student is carried into the modal.
- [ ] Preferred teacher is selected when configured.
- [ ] Student availability text is displayed correctly.
- [ ] Student availability windows are respected.
- [ ] A student without availability uses 09:00–21:00.
- [ ] Date range validation works.
- [ ] Teacher conflicts are excluded.
- [ ] Student conflicts are excluded.
- [ ] Same-room and same-location conflicts are excluded.
- [ ] Available slots are listed and the best slots are highlighted.
- [ ] Selecting a suggestion opens the lesson editor with date, time, student, teacher, title, location, and room filled in.
- [ ] Closing the modal by its close action works.
- [ ] Clicking the modal backdrop closes it.

## Regression
- [ ] Add, edit, move, and delete lessons.
- [ ] Weekly copy works.
- [ ] Partial selection and batch adjustment work.
- [ ] Makeup workflow works.
- [ ] Undo/redo works.
- [ ] Firebase login and synchronization work.

## V15.17 Dashboard 模組

- [ ] 總覽月營收、未收款、老師薪資與課程數正確
- [ ] 今日課程與今日異動正常顯示
- [ ] 待辦提醒與補課提醒正常
- [ ] 即時教室狀態與未來七日課量正常
- [ ] 老師登入時下一堂課正常顯示


## V15.18 課程列表與搜尋模組

- [ ] 全域搜尋可找到學生、老師、日期、課程、教室與地點
- [ ] 點搜尋結果可開啟正確課程
- [ ] 月份、學生及老師篩選正常
- [ ] 課程列表排序及內容正常
- [ ] 老師重疊警示正常
- [ ] 課堂回報內容正常顯示
- [ ] 老師端不顯示營收與薪資
- [ ] 本月全部標記已上課與復原正常

## V15.26.1 課堂回報權限分層

- [ ] Owner 可開啟任一校區任一課程回報並修改。
- [ ] 校區管理者可查看所屬校區其他老師回報，所有欄位為唯讀。
- [ ] 校區管理者只能儲存自己授課的課程回報。
- [ ] 老師只能開啟自己授課的課程回報。
- [ ] 老師在課程結束後 3 小時內可修改。
- [ ] 老師在課程結束後 3 小時外無法儲存，且 Firebase Rules 同步拒絕。
- [ ] 課堂照片可正常上傳；超過 8 MB 會被拒絕。
- [ ] 已部署 `firebase/firestore.rules` 與 `firebase/storage.rules`。


## V15.26.3 回報逾時申請

- [ ] 老師自己的課在下課後 3 小時內仍可回報。
- [ ] 校區管理者自己的課也在下課後 3 小時自動鎖定。
- [ ] 鎖定後可開啟回報視窗，但欄位唯讀並顯示「申請開放 10 分鐘」。
- [ ] 老師送出後按鈕顯示等待 Owner，不會重複申請。
- [ ] Owner 通知中心出現申請，按下後需再次確認。
- [ ] 核准後從核准當下開始 10 分鐘，老師無須重新登入即可編輯。
- [ ] 10 分鐘到期後，文字、照片與 Firestore 寫入皆重新被拒絕。
- [ ] 校區管理者不能申請或修改其他老師的課。
- [ ] Owner 仍可修改全部校區課堂回報且不受時限。
