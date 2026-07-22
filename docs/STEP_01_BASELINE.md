# Step 01 — Baseline freeze and safety checks

This package is a clean baseline of the currently deployed V15 project.

Completed:
- Removed `.git`, `.DS_Store`, and macOS archive metadata from the distributable copy.
- Added `.gitignore` to prevent macOS metadata and ZIP files from entering Git.
- Added `tools/validate_project.py`.
- Verified every local CSS/JS/icon/manifest reference in `index.html` exists.
- Ran `node --check` on every JavaScript file.
- Checked duplicate HTML IDs.
- Generated `docs/sha256-manifest.json` so later refactoring can be compared against this frozen baseline.

No application behavior or production logic was changed in Step 01.

Run validation:

```bash
python3 tools/validate_project.py
```
