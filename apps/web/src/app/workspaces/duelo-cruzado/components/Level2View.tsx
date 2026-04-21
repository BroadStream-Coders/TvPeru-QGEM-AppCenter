"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./GroupColumn";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { ExamenLevel2Row, ExamenLevel2RowData } from "./Level2Row";

export interface ExamenLevel2Column {
  title: string;
  rows: ExamenLevel2RowData[];
}

export interface ExamenLevel2ViewRef {
  getData: () => ExamenLevel2Column[];
  setData: (data: ExamenLevel2Column[]) => void;
}

const createEmptyRow = (): ExamenLevel2RowData => ({
  id: nanoid(),
  question: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  correctAnswer: "A",
});

export const ExamenLevel2View = forwardRef<ExamenLevel2ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel2Column[]>([
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
    updates: Partial<ExamenLevel2RowData>,
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
      const rawLines = matrix
        .map((row) => row[0]?.trim() ?? "")
        .filter((line) => line !== "");

      const newRows: ExamenLevel2RowData[] = [];

      for (let i = 0; i < rawLines.length; i += 5) {
        const chunk = rawLines.slice(i, i + 5);
        if (chunk.length < 2) continue;

        const question = chunk[0];
        const correctAnswerText = chunk[1];
        const distractors = chunk.slice(2);

        const allAnswers = [correctAnswerText, ...distractors];

        for (let j = allAnswers.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [allAnswers[j], allAnswers[k]] = [allAnswers[k], allAnswers[j]];
        }

        const correctIndex = allAnswers.indexOf(correctAnswerText);
        const correctLetter = ["A", "B", "C", "D"][correctIndex] as
          | "A"
          | "B"
          | "C"
          | "D";

        newRows.push({
          id: nanoid(),
          question,
          answerA: allAnswers[0] || "",
          answerB: allAnswers[1] || "",
          answerC: allAnswers[2] || "",
          answerD: allAnswers[3] || "",
          correctAnswer: correctLetter,
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
            <ExamenLevel2Row
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

ExamenLevel2View.displayName = "ExamenLevel2View";
