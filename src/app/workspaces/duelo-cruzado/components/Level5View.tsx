"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { SharedColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { Level5Row, Level5RowData } from "./Level5Row";

export interface Level5Column {
  title: string;
  rows: Level5RowData[];
}

export interface Level5ViewRef {
  getData: () => Level5Column[];
  setData: (data: Level5Column[]) => void;
}

const createEmptyLevel5Row = (): Level5RowData => ({ id: nanoid() });

export const Level5View = forwardRef<Level5ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<Level5Column[]>([
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
    updates: Partial<Level5RowData>,
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
        <SharedColumn
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
            <Level5Row
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

Level5View.displayName = "Level5View";
