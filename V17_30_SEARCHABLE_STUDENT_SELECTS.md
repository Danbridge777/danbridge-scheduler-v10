# V17.30 Searchable Student Selects

## Change
Added a reusable search box and live result list to every major student/class selector:

- Lesson editor student selector
- Calendar student filter
- Lesson-record student filter
- Smart scheduler student selector
- Summer camp class selector
- Summer camp registration student selector
- Winter camp class selector

## Behavior
- Search by any text currently shown in the selector, including student name, parent information, or class label.
- Tap a live result to select the original native `<select>` option.
- Existing `change` handlers, validation, save/edit behavior and filters remain unchanged.
- The original native selector remains available below the search box.
- Dynamic option refreshes are detected automatically.
