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
