"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { ExamenLevel3Row, ExamenLevel3RowData } from "./Level3Row";

export interface ExamenLevel3Column {
  title: string;
  rows: ExamenLevel3RowData[];
}

export interface ExamenLevel3ViewRef {
  getData: () => ExamenLevel3Column[];
  setData: (data: ExamenLevel3Column[]) => void;
}

export const ExamenLevel3View = forwardRef<ExamenLevel3ViewRef>((_, ref) => {
  const createEmptyRow = (): ExamenLevel3RowData => ({
    id: nanoid(),
    pairs: Array.from({ length: 3 }, () => ({ leftText: "", rightText: "" })),
  });

  const [columns, setColumns] = useState<ExamenLevel3Column[]>([
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
    updates: Partial<ExamenLevel3RowData>,
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

  const handleQuickLoad = useCallback(
    (columnIndex: number, matrix: string[][]) => {
      const validRows = matrix.filter(
        (row) =>
          row.length >= 2 && (row[0].trim() !== "" || row[1].trim() !== ""),
      );

      const newRows: ExamenLevel3RowData[] = [];

      for (let i = 0; i < validRows.length; i += 3) {
        const chunk = validRows.slice(i, i + 3);
        const pairs = Array.from({ length: 3 }, (_, idx) => {
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
          next[columnIndex] = { ...next[columnIndex], rows: newRows };
          return next;
        });
      }
    },
    [],
  );

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
            <ExamenLevel3Row
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

ExamenLevel3View.displayName = "ExamenLevel3View";
