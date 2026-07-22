# V15.29.1 Realtime Parallel Sync Fix

## Changes
- Reduced owner save debounce from 650 ms to 120 ms.
- Main cloud data and teacher/branch scoped views now publish concurrently.
- Lesson metadata synchronization runs in the background and no longer blocks normal data synchronization.
- Company access query results are cached briefly to avoid repeated Firestore reads during consecutive saves.
- Access cache is invalidated when teacher/branch access is changed or removed.
- Updated Service Worker cache version so GitHub Pages clients receive the new synchronization code.

## Preserved behavior
- Existing realtime Firestore listeners remain enabled.
- Local save and offline recovery remain enabled.
- Removed application/request workflow is not restored.
