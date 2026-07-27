# V17.20.1 Owner Display Name Fix

- Forces the owner badge and dashboard greeting to use `Daniel`.
- Normalizes the cloud role before applying role-specific names.
- Synchronizes the owner account profile display name to Firestore.
- Bumps the Firebase auth module URL and service-worker cache to prevent stale V17.20 JavaScript from remaining active.
- Leaves teacher custom badge names and all business logic unchanged.
