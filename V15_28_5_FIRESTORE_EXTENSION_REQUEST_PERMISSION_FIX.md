# V15.28.5 Firestore Extension Request Permission Fix

## Root cause

`canSubmitOwnTeacherRequest()` 同時驗證老師確實在 `lessonMeta.teacherIds` 中，又要求申請 payload 的 `lessonDate`、`lessonStart`、`lessonEnd`、`studentId`、`teacherIds` 與 `lessonMeta` 完全相等。前端 payload 取自本機 lesson 快取，因此只要時間格式、空值或 teacherIds 排序不同，Firestore 就回傳 `permission-denied`。

## Fix

保留必要的身分與授課權限驗證：

- active company member
- teacher / branch manager role
- lessonMeta exists and active
- own teacher ID exists in lessonMeta.teacherIds
- requester UID / email / teacher ID match authenticated user
- request document ID equals lesson ID
- extension status is pending and duration is 10 minutes

申請中的課程顯示欄位改為型別與本人 teacher ID 檢查，不再與 lessonMeta 做脆弱的逐字比對。

## Deployment

```bash
firebase deploy --only firestore:rules
```

部署完成後，老師必須登出再登入，再重新送出申請。
