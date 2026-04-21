"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { ExamenLevel5Row, ExamenLevel5RowData } from "./Level5Row";

export interface ExamenLevel5Column {
  title: string;
  rows: ExamenLevel5RowData[];
}

export interface ExamenLevel5ViewRef {
  getData: () => ExamenLevel5Column[];
  setData: (data: ExamenLevel5Column[]) => void;
}

const createEmptyLevel5Row = (): ExamenLevel5RowData => ({ id: nanoid() });

export const ExamenLevel5View = forwardRef<ExamenLevel5ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel5Column[]>([
    {
      title: "",
      rows: [createEmptyLevel5Row()],
    },
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => columns,
    setData: (data) => setColumns(data),
  }));

  const handleQuickLoad = useCallback(() => {
    // Sin funcionalidad de carga rápida en Nivel 5
  }, []);

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        title: "",
        rows: [createEmptyLevel5Row()],
      },
    ]);
  };

  const removeColumn = (index: number) => {
    columns[index].rows.forEach((r) => {
      if (r.url) URL.revokeObjectURL(r.url);
    });
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
      rows: [...next[columnIndex].rows, createEmptyLevel5Row()],
    };
    setColumns(next);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel5RowData>,
  ) => {
    setColumns((prev) => {
      const next = [...prev];
      next[columnIndex] = {
        ...next[columnIndex],
        rows: next[columnIndex].rows.map((r, i) => {
          if (i === rowIndex) {
            if (updates.url && r.url && updates.url !== r.url) {
              URL.revokeObjectURL(r.url);
            }
            return { ...r, ...updates };
          }
          return r;
        }),
      };
      return next;
    });
  };

  const removeRow = (columnIndex: number, rowIndex: number) => {
    setColumns((prev) => {
      const next = [...prev];
      const row = next[columnIndex].rows[rowIndex];
      if (row?.url) URL.revokeObjectURL(row.url);

      next[columnIndex] = {
        ...next[columnIndex],
        rows: next[columnIndex].rows.filter((_, i) => i !== rowIndex),
      };
      return next;
    });
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
          onQuickLoad={() => handleQuickLoad()}
        >
          {col.rows.map((row, rowIndex) => (
            <ExamenLevel5Row
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

ExamenLevel5View.displayName = "ExamenLevel5View";
