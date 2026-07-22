# V15.20 Branch Role and Data Scope

## Added
- `js/core/access-control.js`
- Role: `branch_manager`
- Branch scope based on lesson `branchId`
- Legacy location migration to branch IDs
- Owner security UI for branch-manager Gmail and branch assignment
- Per-manager Firestore branch view
- Branch manager read-only dashboard, students, teachers, calendar, lessons, makeups, settlement and finance

## Current safety boundary
Branch managers are read-only in V15.20. This prevents a filtered branch copy from overwriting the company-wide source document. Scoped writes require a later repository/transaction layer.

## Default branch mapping
- 美術東四路 → `art_museum`
- 河西一路 → `hexi`
- 到府 → `home_service`
- 線上課 → `online`
