"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { SharedColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { Level4Row, Level4RowData } from "./Level4Row";

export interface Level4Column {
  title: string;
  rows: Level4RowData[];
}

export interface Level4ViewRef {
  getData: () => Level4Column[];
  setData: (data: Level4Column[]) => void;
}

const createEmptyRow = (): Level4RowData => ({
  id: nanoid(),
  question: "",
  answer: "",
});

export const Level4View = forwardRef<Level4ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<Level4Column[]>([
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
    updates: Partial<Level4RowData>,
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
    const newRows: Level4RowData[] = matrix
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
        <SharedColumn
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
            <Level4Row
              key={row.id}
              index={rowIndex}
              data={row}
              onChange={(updates) => updateRow(colIndex, rowIndex, updates)}
              onRemove={() => removeRow(colIndex, rowIndex)}
            />
          ))}
        </SharedColumn>
      ))}
    </GroupsContainer>
  );
});

Level4View.displayName = "Level4View";
