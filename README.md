# AG Grid Bug: `grandTotalRow="pinnedTop"` Goes Blank After `setGridOption('rowData', [])` + `applyTransaction`

## Version

- **Broken**: AG Grid 35.2.1+ (tested on 35.2.1 and 35.3.0)
- **Works**: AG Grid 35.0.1

## Bug Description

When `grandTotalRow` is set to `"pinnedTop"` (or `"pinnedBottom"`), the pinned grand total row **goes blank** after:

1. Clearing the grid with `api.setGridOption('rowData', [])`
2. Repopulating with `api.applyTransaction({ add: [...] })` or `api.applyTransactionAsync({ add: [...] })`

The data rows appear correctly with proper group aggregation, but the pinned grand total row shows empty cells.

### Works

```typescript
api.setGridOption("rowData", []);
api.setGridOption("rowData", newData);  // ✅ Grand total shows
```

### Broken

```typescript
api.setGridOption("rowData", []);
api.applyTransaction({ add: newData });  // ❌ Grand total is blank
```

This does NOT happen with `grandTotalRow="top"` or `"bottom"` — only the pinned variants.

## Steps to Reproduce

```bash
npm install
npm run dev
```

1. Open the app — View A loads with a pinned grand total row showing **revenue: 3500**
2. Click **"View B"** — data rows appear with correct group sums, but the **pinned grand total row is blank**
3. Click **"View A"** — same, grand total stays blank

## Workaround

Use `grandTotalRow="top"` instead of `"pinnedTop"`. The `"top"` variant is still sticky by default (via `suppressStickyTotalRow: false`) and looks nearly identical.

## Related Issues

- [#10623 / AG-14994](https://github.com/ag-grid/ag-grid/issues/10623) — "Aggregate values are not updated when grandTotalRow is pinned" (fixed in v34.0.0, similar regression)
- [#12104 / AG-16327](https://github.com/ag-grid/ag-grid/issues/12104) — "pinnedBottom grandTotalRow not visible after restoring state"
