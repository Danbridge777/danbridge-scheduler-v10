# V17.14 — Individual Teacher Base Salary

- Every teacher stores an independent `baseSalary` value.
- No global or automatic NT$35,000 fallback remains.
- Full-time teachers must have a manually entered base salary before their record can be saved.
- A blank base salary remains `null`; hourly teachers continue to use actual paid hours × hourly rate.
- Payroll formula for a teacher with a base salary: base salary + overtime hours × overtime hourly rate.
- Existing full-time records without a base salary are shown as not configured until edited.
