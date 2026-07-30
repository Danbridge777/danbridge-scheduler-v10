# V17.27 Summer Camp Registration Integrity Fix

## Changes
- Added required branch selection to summer camp registrations.
- Prevented duplicate records for the same student and month.
- Existing duplicate records are normalized into one record with merged dates.
- Existing records without a branch inherit a branch from the student or lesson data when possible.
- Branch managers receive registration records by registration `branchId`.
- Registration totals remain `selected days × daily rate`.
- Payment confirmation does not affect the registration amount.

## Static validation
- 35 JavaScript files passed syntax validation.
- 100 local references resolved.
- 314 HTML IDs checked.
