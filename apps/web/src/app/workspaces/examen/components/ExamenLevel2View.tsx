"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { ExamenGroupColumn } from "./ExamenGroupColumn";
import { AddColumnButton } from "@/components/shared/group-column/components/AddColumnButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { nanoid } from "nanoid";
import { ExamenLevel2Row, ExamenLevel2RowData } from "./ExamenLevel2Row";

export interface ExamenLevel2ViewRef {
  getData: () => ExamenLevel2RowData[][];
  setData: (data: ExamenLevel2RowData[][]) => void;
}

export const ExamenLevel2View = forwardRef<ExamenLevel2ViewRef>((_, ref) => {
  const [columns, setColumns] = useState<ExamenLevel2RowData[][]>([
    [
      {
        id: nanoid(),
        question: "",
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
        correctAnswer: "A",
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
          answerA: "",
          answerB: "",
          answerC: "",
          answerD: "",
          correctAnswer: "A",
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
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
        correctAnswer: "A",
      },
    ];
    setColumns(newColumns);
  };

  const updateRow = (
    columnIndex: number,
    rowIndex: number,
    updates: Partial<ExamenLevel2RowData>,
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

  const handleQuickLoad = useCallback(
    (columnIndex: number, matrix: string[][]) => {
      // Flatten the matrix to a single column array of non-empty string values.
      // Excel vertical paste often results in matrix having one filled column per row.
      const rawLines = matrix
        .map((row) => row[0]?.trim() ?? "")
        .filter((line) => line !== "");

      const newRows: ExamenLevel2RowData[] = [];

      // Process in chunks of 5 lines:
      // Line 1: Question
      // Line 2: Correct answer
      // Line 3: Distractor
      // Line 4: Distractor
      // Line 5: Distractor
      for (let i = 0; i < rawLines.length; i += 5) {
        const chunk = rawLines.slice(i, i + 5);
        if (chunk.length < 2) continue; // Skip incomplete chunks that don't even have an answer

        const question = chunk[0];
        const correctAnswerText = chunk[1];
        const distractors = chunk.slice(2);

        // We have up to 4 answers total.
        const allAnswers = [correctAnswerText, ...distractors];

        // Shuffle answers
        for (let j = allAnswers.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [allAnswers[j], allAnswers[k]] = [allAnswers[k], allAnswers[j]];
        }

        // Find where the correct answer landed
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
          next[columnIndex] = newRows;
          return next;
        });
      }
    },
    [],
  );

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
                  <ExamenLevel2Row
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

ExamenLevel2View.displayName = "ExamenLevel2View";
