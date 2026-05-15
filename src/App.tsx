/**
 * AG Grid 35.2+ Bug: grandTotalRow="pinnedTop" goes blank after
 * setGridOption('rowData', []) followed by applyTransactionAsync.
 *
 * Works in AG Grid 35.0.1, broken in 35.2.1+.
 * Workaround: use grandTotalRow="top" instead of "pinnedTop".
 */

import { useCallback, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  PinnedRowModule,
  type ColDef,
  type GetRowIdParams,
  type GridApi,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  RowGroupingModule,
  PinnedRowModule,
]);

interface RowData {
  id: string;
  category: string;
  product: string;
  revenue: number;
}

const VIEW_A_DATA: RowData[] = [
  { id: "1", category: "Electronics", product: "Phone", revenue: 1000 },
  { id: "2", category: "Electronics", product: "Laptop", revenue: 2000 },
  { id: "3", category: "Food", product: "Pizza", revenue: 300 },
  { id: "4", category: "Food", product: "Burger", revenue: 200 },
];

const VIEW_B_DATA: RowData[] = [
  { id: "5", category: "Clothing", product: "Shirt", revenue: 500 },
  { id: "6", category: "Clothing", product: "Pants", revenue: 700 },
  { id: "7", category: "Books", product: "Novel", revenue: 150 },
  { id: "8", category: "Books", product: "Textbook", revenue: 400 },
];

const columnDefs: ColDef<RowData>[] = [
  { field: "category", rowGroup: true, hide: true },
  { field: "product" },
  { field: "revenue", aggFunc: "sum" },
];

const getRowId = (params: GetRowIdParams<RowData>) => params.data.id;

export function App() {
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const apiRef = useRef<GridApi<RowData> | null>(null);
  const [currentView, setCurrentView] = useState<"A" | "B">("A");

  const onGridReady = useCallback(() => {
    const api = gridRef.current!.api;
    apiRef.current = api;
    api.setGridOption("rowData", VIEW_A_DATA);
  }, []);

  const switchView = useCallback((viewKey: "A" | "B") => {
    const api = apiRef.current;
    if (!api) return;

    setCurrentView(viewKey);
    const data = viewKey === "A" ? VIEW_A_DATA : VIEW_B_DATA;

    // Clear grid then repopulate via async transaction
    api.setGridOption("rowData", []);

    setTimeout(() => {
      api.applyTransactionAsync({ add: data });
    }, 100);
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>AG Grid Bug: pinnedTop Grand Total Blank After View Switch</h3>
        <button onClick={() => switchView("A")} disabled={currentView === "A"} style={{ padding: "8px 16px" }}>
          View A (total: 3500)
        </button>
        <button onClick={() => switchView("B")} disabled={currentView === "B"} style={{ padding: "8px 16px" }}>
          View B (total: 1750)
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <AgGridReact<RowData>
          ref={gridRef}
          columnDefs={columnDefs}
          getRowId={getRowId}
          grandTotalRow="pinnedTop"
          groupDefaultExpanded={-1}
          suppressAggFuncInHeader
          suppressNoRowsOverlay
          defaultColDef={{ flex: 1 }}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
