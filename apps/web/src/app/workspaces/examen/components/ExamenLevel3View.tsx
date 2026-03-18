"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./ExamenGroupColumn";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { nanoid } from "nanoid";
import { ExamenLevel3Row, ExamenLevel3RowData } from "./ExamenLevel3Row";

export interface ExamenLevel3ViewRef {
  getData: () => ExamenLevel3RowData[][];
  setData: (data: ExamenLevel3RowData[][]) => void;
}

export const ExamenLevel3View = forwardRef<ExamenLevel3ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel3RowData[][]>([
    [
      {
        id: nanoid(),
        question: "",
        answer: "",
      },
    ],
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => columns,
    setData: (data) => setColumns(data),
  }));

  const addColumn = () => {
    setColumns([
      ...columns,
      [
        {
          id: nanoid(),
          question: "",
          answer: "",
        },
      ],
    ]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const addRow = (columnIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex] = [
      ...newColumns[columnIndex],
      {
        id: nanoid(),
        question: "",
        answer: "",
      },
    ];
    setColumns(newColumns);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel3RowData>,
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

  const handleQuickLoad = (columnIndex: number, matrix: string[][]) => {
    const newRows: ExamenLevel3RowData[] = matrix
      .filter((row) => row.length > 0 && row.some((cell) => cell.trim() !== ""))
      .map((row) => ({
        id: nanoid(),
        question: row[0] || "",
        answer: row[1] || "",
      }));

    if (newRows.length > 0) {
      const newColumns = [...columns];
      newColumns[columnIndex] = newRows;
      setColumns(newColumns);
    }
  };

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
                  <ExamenLevel3Row
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

ExamenLevel3View.displayName = "ExamenLevel3View";
