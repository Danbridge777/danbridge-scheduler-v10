# Step 11 — Reports & Export Module

V15.11 extracts reporting, settlement presentation, and export functions into:

`js/modules/reports/reports-export.js`

## Extracted functions (16)

- settlementMonthList
- renderSettlementMonthOptions
- renderFinanceMonthOptions
- renderFinance
- copyFinanceSummary
- renderSettlement
- saveMonthlySettlement
- loadSettlementRecord
- deleteSettlementRecord
- renderSettlementHistory
- copySettlementText
- excelSafe
- downloadSettlementExcel
- printSettlementReport
- downloadCSV
- exportICS

This is a pure relocation refactor. Function bodies and existing global call sites are unchanged.
