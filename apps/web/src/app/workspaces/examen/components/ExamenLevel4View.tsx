"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./ExamenGroupColumn";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { nanoid } from "nanoid";
import { ExamenLevel4Row, ExamenLevel4RowData } from "./ExamenLevel4Row";

export interface ExamenLevel4ViewRef {
  getData: () => ExamenLevel4RowData[][];
  setData: (data: ExamenLevel4RowData[][]) => void;
}

export const ExamenLevel4View = forwardRef<ExamenLevel4ViewRef>((_, ref) => {
  const createEmptyRow = (): ExamenLevel4RowData => ({
    id: nanoid(),
    pairs: Array.from({ length: 4 }, () => ({ leftText: "", rightText: "" })),
  });

  const [columns, setColumns] = useState<ExamenLevel4RowData[][]>([
    [createEmptyRow()],
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => columns,
    setData: (data) => setColumns(data),
  }));

  const addColumn = () => {
    setColumns([...columns, [createEmptyRow()]]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const addRow = (columnIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex] = [...newColumns[columnIndex], createEmptyRow()];
    setColumns(newColumns);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel4RowData>,
  ) => {
    const newColumns = [...columns];
    newColumns[columnIndex][rowIndex] = {
      ...newColumns[columnIndex][rowIndex],
      ...updates,
    };
    setColumns(newColumns);
  };

  const removeRow = (columnIndex: number, rowIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex] = newColumns[columnIndex].filter(
      (_, i) => i !== rowIndex,
    );
    setColumns(newColumns);
  };

  const handleQuickLoad = useCallback(
    (columnIndex: number, matrix: string[][]) => {
      // We expect matrix rows with at least two valid cells (colA, colB).
      const validRows = matrix.filter(
        (row) =>
          row.length >= 2 && (row[0].trim() !== "" || row[1].trim() !== ""),
      );

      const newRows: ExamenLevel4RowData[] = [];

      // Parse every 4 lines as a new row
      for (let i = 0; i < validRows.length; i += 4) {
        const chunk = validRows.slice(i, i + 4);
        const pairs = Array.from({ length: 4 }, (_, idx) => {
          const rowData = chunk[idx];
          return {
            leftText: rowData ? rowData[0] || "" : "",
            rightText: rowData ? rowData[1] || "" : "",
          };
        });

        newRows.push({
          id: nanoid(),
          pairs,
        });
      }

      if (newRows.length > 0) {
        setColumns((prev) => {
          const next = [...prev];
          next[columnIndex] = newRows;
          return next;
        });
      }
    },
    [],
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 w-full bg-muted/5">
        <div
          className="flex min-w-max gap-4 px-6 py-6"
          style={{ height: "calc(100vh - 48px - 36px - 48px)" }}
        >
          {columns.map((rows, colIndex) => (
            <ExamenGroupColumn
              key={colIndex}
              index={colIndex + 1}
              itemCount={rows.length}
              onRemoveColumn={() => removeColumn(colIndex)}
              onAddRow={() => addRow(colIndex)}
              onQuickLoad={(matrix) => handleQuickLoad(colIndex, matrix)}
            >
              <div className="flex flex-col gap-2">
                {rows.map((row, rowIndex) => (
                  <ExamenLevel4Row
                    key={row.id}
                    index={rowIndex}
                    data={row}
                    onChange={(updates) =>
                      updateRow(colIndex, rowIndex, updates)
                    }
                    onRemove={() => removeRow(colIndex, rowIndex)}
                  />
                ))}
              </div>
            </ExamenGroupColumn>
          ))}
          <AddColumnButton onClick={addColumn} label="Agregar Grupo" />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
});

ExamenLevel4View.displayName = "ExamenLevel4View";
