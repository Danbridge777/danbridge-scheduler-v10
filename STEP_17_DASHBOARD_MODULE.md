# V15.17 Dashboard Module

本版將 Dashboard 顯示邏輯從 `application-and-business-features.js` 抽離。

## 新增檔案

- `js/modules/dashboard/dashboard.js`

## 抽離函式

- `renderDashboard()`
- `enhanceDashboardV32()`
- `enhanceDashboardV33()`

## 保持不變

- 月營收、未收款、薪資與已完成時數算法
- 今日課程與異動顯示
- 待辦洞察、教室狀態與七日課量
- 老師端下一堂課顯示
- Firebase、資料格式與權限邏輯
