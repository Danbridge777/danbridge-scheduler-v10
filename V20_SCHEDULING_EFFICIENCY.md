# V20 Scheduling Efficiency

- Smart slots check student, teacher, teacher workday and an automatically assigned room.
- Batch and quick teacher replacement preserve group-course co-teachers.
- Live conflict detection includes every selected co-teacher.
- Recent history stores complete before/after lesson data and the signed-in operator.
- Quick student creation stores preferred teacher and `branchIds`, and resets all quick fields.
- Every V20 mutation entry point enforces the existing owner-only permission.

## Test checklist

1. Test individual and group lessons with multiple co-teachers.
2. Batch-replace a primary teacher and confirm co-teachers remain attached.
3. Test one-lesson, day and week replacement with conflicts.
4. Restore add, edit and delete history entries.
5. Create two students consecutively and confirm fields do not leak.
6. Verify teacher and branch-manager accounts cannot invoke V20 mutations.
