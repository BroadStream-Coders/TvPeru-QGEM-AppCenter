"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./ExamenGroupColumn";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { nanoid } from "nanoid";
import { ExamenLevel1Row, ExamenLevel1RowData } from "./ExamenLevel1Row";

export interface ExamenLevel1ViewRef {
  getData: () => ExamenLevel1RowData[][];
  setData: (data: ExamenLevel1RowData[][]) => void;
}

export const ExamenLevel1View = forwardRef<ExamenLevel1ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel1RowData[][]>([
    [
      {
        id: nanoid(),
        question: "",
        answerL: "",
        answerR: "",
        correctAnswer: "L",
      },
    ],
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => columns,
    setData: (data) => setColumns(data),
  }));

  const handleQuickLoad = useCallback(
    (columnIndex: number, matrix: string[][]) => {
      const newRows = matrix.map((row) => {
        const isLCorrect = Math.random() > 0.5;
        return {
          id: nanoid(),
          question: row[0] || "",
          answerL: isLCorrect ? row[1] || "" : row[2] || "",
          answerR: isLCorrect ? row[2] || "" : row[1] || "",
          correctAnswer: isLCorrect ? "L" : "R",
        } as ExamenLevel1RowData;
      });

      // Replace existing rows if it's just the initial empty row, otherwise append or replace based on your standard pattern.
      // Usually QuickLoad replaces all rows in the group for a fresh start.
      setColumns((prev) => {
        const next = [...prev];
        next[columnIndex] = newRows;
        return next;
      });
    },
    [],
  );

  const addColumn = () => {
    setColumns([
      ...columns,
      [
        {
          id: nanoid(),
          question: "",
          answerL: "",
          answerR: "",
          correctAnswer: "L",
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
        answerL: "",
        answerR: "",
        correctAnswer: "L",
      },
    ];
    setColumns(newColumns);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel1RowData>,
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
                  <ExamenLevel1Row
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

ExamenLevel1View.displayName = "ExamenLevel1View";
