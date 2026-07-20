# V15.20.2 Branch + Delivery Mode + Room Foundation

- 實體校區與上課方式正式分離。
- 到府與線上課必須選擇歸屬校區。
- 課程新增 deliveryMode、onlinePlatform、meetingUrl。
- 舊到府／線上課無法判斷校區時標記為 unassigned，編輯時必須指定。
- 校區管理者的可見校區只保留實體管理單位。
- 教室清單依歸屬校區切換，教室衝堂依 branchId + room 判斷。
