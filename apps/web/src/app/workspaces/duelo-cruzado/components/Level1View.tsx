"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { SharedColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { Level1Row, Level1RowData } from "./Level1Row";

export interface Level1Column {
  title: string;
  rows: Level1RowData[];
}

export interface Level1ViewRef {
  getData: () => Level1Column[];
  setData: (data: Level1Column[]) => void;
}

export const Level1View = forwardRef<Level1ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<Level1Column[]>([
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
        } as Level1RowData;
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
    updates: Partial<Level1RowData>,
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
            <Level1Row
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

Level1View.displayName = "Level1View";
