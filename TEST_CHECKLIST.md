# V15.3 本機測試清單

使用 VS Code → Live Server 開啟 `index.html`。

## 核心
- [ ] 老闆 Google 登入成功
- [ ] 登出後可重新登入
- [ ] 頁面日期與月份顯示正確

## 基本資料
- [ ] 學生清單正常顯示
- [ ] 老師清單正常顯示
- [ ] 新增／編輯一筆測試資料後可儲存

## 課表
- [ ] 月曆正常顯示
- [ ] 週曆正常顯示
- [ ] 新增課程正常
- [ ] 拖曳課程正常
- [ ] 複製選取課程到下個月正常
- [ ] 複製本週到下一週正常

## 財務與備份
- [ ] 金額格式顯示正常
- [ ] 月底結算頁可開啟
- [ ] 備份下載檔名與內容正常

全部通過後才覆蓋正式 Repository 並 Push。

## V15.4 Student CRM regression checks

- [ ] Student list loads after sign-in
- [ ] Search filters student rows
- [ ] Add a new student
- [ ] Edit an existing student
- [ ] Clear the student form
- [ ] Open student history
- [ ] Open smart scheduler from a student row
- [ ] Delete a test student and undo if needed
- [ ] Refresh and confirm student data persists

## V15.5 Teacher CRM regression checks

- [ ] Teacher list loads after sign-in
- [ ] Add a test teacher with hourly rate
- [ ] Save minimum weekly hours
- [ ] Select and save fixed workdays
- [ ] Edit teacher name, type, subjects and color
- [ ] Refresh and confirm teacher data persists
- [ ] Teacher appears in lesson teacher selectors
- [ ] Existing teacher lessons still display correctly
- [ ] Monthly settlement still calculates teacher hours and payroll
- [ ] Delete an unused test teacher
- [ ] Console has no red JavaScript errors

