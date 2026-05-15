# AG Grid Bug: `grandTotalRow="pinnedTop"` Goes Blank After `setGridOption('rowData', [])` + `applyTransactionAsync`

## Version

- **Broken**: AG Grid 35.2.1+ (tested on 35.2.1 and 35.3.0)
- **Works**: AG Grid 35.0.1

## Bug Description

When `grandTotalRow` is set to `"pinnedTop"` (or `"pinnedBottom"`), the pinned grand total row **goes blank** after:

1. Clearing the grid with `api.setGridOption('rowData', [])`
2. Repopulating with `api.applyTransactionAsync({ add: [...] })`

The data rows appear correctly with proper group aggregation, but the pinned grand total row shows empty cells.

This does NOT happen with `grandTotalRow="top"` or `"bottom"` — only the pinned variants.

## Steps to Reproduce

```bash
npm install
npm run dev
```

1. Open the app — View A loads with a pinned grand total row showing **revenue: 3500**
2. Click **"View B"** — data rows appear with correct groups, but the **pinned grand total row is blank**
3. Click **"View A"** — same, grand total stays blank

## Expected Behavior

The pinned grand total row should show the correct aggregate values after data is cleared and repopulated via async transactions.

## Minimal Trigger

```typescript
// Clear all data
api.setGridOption("rowData", []);

// Repopulate via async transaction
setTimeout(() => {
  api.applyTransactionAsync({ add: newData });
}, 100);
```

With `grandTotalRow="pinnedTop"`, the total row goes blank. With `grandTotalRow="top"`, it works.

## Workaround

Use `grandTotalRow="top"` instead of `"pinnedTop"`. The `"top"` variant is still sticky by default (via `suppressStickyTotalRow: false`) and looks nearly identical.

## Related Issues

- [#10623 / AG-14994](https://github.com/ag-grid/ag-grid/issues/10623) — "Aggregate values are not updated when grandTotalRow is pinned" (fixed in v34.0.0, but this is a similar regression)
- [#12104 / AG-16327](https://github.com/ag-grid/ag-grid/issues/12104) — "pinnedBottom grandTotalRow not visible after restoring state"
