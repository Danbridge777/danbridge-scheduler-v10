# V15.25.2 Lesson Reporting Foundation

## Completed
- Calendar toolbar baseline-date label vertical alignment
- Lesson content
- Homework
- Teacher feedback
- Classroom photo upload through Firebase Storage
- One-click completion
- Existing unfinished-report dashboard reminder retained

## Photo constraints
- Maximum 6 photos per report
- Maximum 8 MB per photo
- Storage path: `companies/{companyId}/lessonReports/{lessonId}/...`

## Deployment note
Firebase Storage rules must permit authenticated teachers to upload only to their company lesson-report path.
