"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./ExamenGroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { ExamenLevel4Row, ExamenLevel4RowData } from "./ExamenLevel4Row";

export interface ExamenLevel4Column {
  title: string;
  rows: ExamenLevel4RowData[];
}

export interface ExamenLevel4ViewRef {
  getData: () => ExamenLevel4Column[];
  setData: (data: ExamenLevel4Column[]) => void;
}

const createEmptyRow = (): ExamenLevel4RowData => ({
  id: nanoid(),
  question: "",
  answer: "",
});

export const ExamenLevel4View = forwardRef<ExamenLevel4ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel4Column[]>([
    { title: "", rows: [createEmptyRow()] },
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => columns,
    setData: (data) => setColumns(data),
  }));

  const addColumn = () => {
    setColumns([...columns, { title: "", rows: [createEmptyRow()] }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateTitle = (columnIndex: number, title: string) => {
    const next = [...columns];
    next[columnIndex] = { ...next[columnIndex], title };
    setColumns(next);
  };

  const addRow = (columnIndex: number) => {
    const next = [...columns];
    next[columnIndex] = {
      ...next[columnIndex],
      rows: [...next[columnIndex].rows, createEmptyRow()],
    };
    setColumns(next);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel4RowData>,
  ) => {
    const next = [...columns];
    next[columnIndex] = {
      ...next[columnIndex],
      rows: next[columnIndex].rows.map((r, i) =>
        i === rowIndex ? { ...r, ...updates } : r,
      ),
    };
    setColumns(next);
  };

  const removeRow = (columnIndex: number, rowIndex: number) => {
    const next = [...columns];
    next[columnIndex] = {
      ...next[columnIndex],
      rows: next[columnIndex].rows.filter((_, i) => i !== rowIndex),
    };
    setColumns(next);
  };

  const handleQuickLoad = (columnIndex: number, matrix: string[][]) => {
    const newRows: ExamenLevel4RowData[] = matrix
      .filter((row) => row.length > 0 && row.some((cell) => cell.trim() !== ""))
      .map((row) => ({
        id: nanoid(),
        question: row[0] || "",
        answer: row[1] || "",
      }));

    if (newRows.length > 0) {
      const next = [...columns];
      next[columnIndex] = { ...next[columnIndex], rows: newRows };
      setColumns(next);
    }
  };

  return (
    <GroupsContainer onAddGroup={addColumn} addLabel="Agregar Grupo">
      {columns.map((col, colIndex) => (
        <ExamenGroupColumn
          key={colIndex}
          index={colIndex + 1}
          title={col.title}
          onTitleChange={(val) => updateTitle(colIndex, val)}
          itemCount={col.rows.length}
          onRemoveColumn={() => removeColumn(colIndex)}
          onAddRow={() => addRow(colIndex)}
          onQuickLoad={(matrix) => handleQuickLoad(colIndex, matrix)}
        >
          {col.rows.map((row, rowIndex) => (
            <ExamenLevel4Row
              key={row.id}
              index={rowIndex}
              data={row}
              onChange={(updates) => updateRow(colIndex, rowIndex, updates)}
              onRemove={() => removeRow(colIndex, rowIndex)}
            />
          ))}
        </ExamenGroupColumn>
      ))}
    </GroupsContainer>
  );
});

ExamenLevel4View.displayName = "ExamenLevel4View";
