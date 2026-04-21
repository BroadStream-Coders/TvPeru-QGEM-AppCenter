"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { ExamenLevel1Row, ExamenLevel1RowData } from "./Level1Row";

export interface ExamenLevel1Column {
  title: string;
  rows: ExamenLevel1RowData[];
}

export interface ExamenLevel1ViewRef {
  getData: () => ExamenLevel1Column[];
  setData: (data: ExamenLevel1Column[]) => void;
}

export const ExamenLevel1View = forwardRef<ExamenLevel1ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel1Column[]>([
    {
      title: "",
      rows: [
        {
          id: nanoid(),
          question: "",
          answerL: "",
          answerR: "",
          correctAnswer: "L",
        },
      ],
    },
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

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        title: "",
        rows: [
          {
            id: nanoid(),
            question: "",
            answerL: "",
            answerR: "",
            correctAnswer: "L",
          },
        ],
      },
    ]);
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
      rows: [
        ...next[columnIndex].rows,
        {
          id: nanoid(),
          question: "",
          answerL: "",
          answerR: "",
          correctAnswer: "L",
        },
      ],
    };
    setColumns(next);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel1RowData>,
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
            <ExamenLevel1Row
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

ExamenLevel1View.displayName = "ExamenLevel1View";
