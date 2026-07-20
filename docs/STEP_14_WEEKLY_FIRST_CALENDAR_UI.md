# Step 14 — Weekly-first Calendar UI

## Purpose
Simplify the calendar for a schedule that changes frequently. Monthly copying is no longer exposed in the interface; weekly copying is the only quick-copy action.

## Interface changes
- Removed `月底產生課表`.
- Removed `複製本月到下個月`.
- Removed `複製選取到下個月` from selection mode.
- Kept `複製本週到下週` as the primary copy action.
- Moved `新增課程` into a clear calendar workspace header.
- Added visual hierarchy for navigation, filters, secondary actions, and selection tools.

## Compatibility
The underlying legacy month-copy functions remain untouched but are no longer reachable from the interface. This minimizes regression risk while allowing later removal during the batch-operation module cleanup.
