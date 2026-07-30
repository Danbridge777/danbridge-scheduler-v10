# V17.28 Summer Camp Multi-Rate Pricing

## Added
- Pricing mode selector: daily, weekly, monthly.
- Separate input fields for daily rate, weekly rate, and monthly rate.
- Live day count, covered-week count, and receivable total.

## Calculation
- Daily: selected days × daily rate.
- Weekly: distinct calendar weeks covered by selected dates × weekly rate.
- Monthly: one monthly rate when at least one date is selected.

## Compatibility
- Existing summer-camp registrations default to daily pricing.
- Existing daily-rate data remains valid.
- Backup, import, cloud synchronization, branch scope, duplicate protection, edit, and delete flows retain all rate fields.

## Static validation
- 35 JavaScript files passed syntax checks.
- 100 local references passed.
- 318 HTML IDs checked; no duplicates.
