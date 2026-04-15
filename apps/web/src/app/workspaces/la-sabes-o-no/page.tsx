"use client";

import { useState, useEffect, useCallback } from "react";
import { HelpCircle } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { nanoid } from "nanoid";
import { Column, ColumnData } from "./components/Column";
import { RowData } from "./components/Row";

const DEFAULT_FILENAME = "LoSabesONo.json";

// ── Tipos del JSON de exportación ──

interface QuestionExport {
  question: string;
  options: string[];
  correctIndex: number;
}

interface GroupExport {
  title: string;
  questions: QuestionExport[];
}

interface SessionData {
  groups: GroupExport[];
}

// ── Helpers ──

const createEmptyRow = (): RowData => ({
  id: nanoid(),
  question: "",
  answerL: "",
  answerR: "",
  correctAnswer: "L",
});

const createEmptyColumn = (): ColumnData => ({
  title: "",
  rows: [createEmptyRow()],
});

export default function LaSabesONoPage() {
  const [columns, setColumns] = useState<ColumnData[]>([createEmptyColumn()]);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  // ── Column handlers ──

  const addColumn = () => setColumns((prev) => [...prev, createEmptyColumn()]);

  const removeColumn = (index: number) =>
    setColumns((prev) => prev.filter((_, i) => i !== index));

  const updateTitle = (colIndex: number, title: string) =>
    setColumns((prev) => {
      const next = [...prev];
      next[colIndex] = { ...next[colIndex], title };
      return next;
    });

  // ── Row handlers ──

  const addRow = (colIndex: number) =>
    setColumns((prev) => {
      const next = [...prev];
      next[colIndex] = {
        ...next[colIndex],
        rows: [...next[colIndex].rows, createEmptyRow()],
      };
      return next;
    });

  const updateRow = (
    colIndex: number,
    rowIndex: number,
    updates: Partial<RowData>,
  ) =>
    setColumns((prev) => {
      const next = [...prev];
      next[colIndex] = {
        ...next[colIndex],
        rows: next[colIndex].rows.map((r, i) =>
          i === rowIndex ? { ...r, ...updates } : r,
        ),
      };
      return next;
    });

  const removeRow = (colIndex: number, rowIndex: number) =>
    setColumns((prev) => {
      const next = [...prev];
      next[colIndex] = {
        ...next[colIndex],
        rows: next[colIndex].rows.filter((_, i) => i !== rowIndex),
      };
      return next;
    });

  // ── Quick Load ──

  const handleQuickLoad = useCallback(
    (colIndex: number, matrix: string[][]) => {
      const newRows: RowData[] = matrix.map((row) => {
        const isLCorrect = Math.random() > 0.5;
        return {
          id: nanoid(),
          question: row[0] || "",
          answerL: isLCorrect ? row[1] || "" : row[2] || "",
          answerR: isLCorrect ? row[2] || "" : row[1] || "",
          correctAnswer: isLCorrect ? "L" : "R",
        };
      });

      if (newRows.length > 0) {
        setColumns((prev) => {
          const next = [...prev];
          next[colIndex] = { ...next[colIndex], rows: newRows };
          return next;
        });
      }
    },
    [],
  );

  // ── Save / Load ──

  const handleSave = useCallback(() => {
    const data: SessionData = {
      groups: columns.map((col) => ({
        title: col.title,
        questions: col.rows.map((q) => ({
          question: q.question,
          options: [q.answerL, q.answerR],
          correctIndex: q.correctAnswer === "L" ? 0 : 1,
        })),
      })),
    };
    saveAsJson(DEFAULT_FILENAME, data);
  }, [columns]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const isValid = (data: unknown): data is SessionData =>
        typeof data === "object" &&
        data !== null &&
        "groups" in data &&
        Array.isArray((data as SessionData).groups);

      const data = await loadJsonFile<SessionData>(file, isValid);
      if (data?.groups) {
        const loaded: ColumnData[] = data.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answerL: q.options?.[0] || "",
            answerR: q.options?.[1] || "",
            correctAnswer:
              q.correctIndex === 0 ? ("L" as const) : ("R" as const),
          })),
        }));
        setColumns(loaded.length > 0 ? loaded : [createEmptyColumn()]);
      }
    } catch {
      alert("Error al cargar el archivo JSON.");
    }
  }, []);

  // ── Header ──

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "La Sabes o No",
      icon: <HelpCircle className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader, handleSave, handleLoad]);

  // ── Render ──

  return (
    <main className="flex-1 overflow-hidden">
      <GroupsContainer onAddGroup={addColumn} addLabel="Agregar Grupo">
        {columns.map((col, colIndex) => (
          <Column
            key={colIndex}
            index={colIndex + 1}
            title={col.title}
            onTitleChange={(val) => updateTitle(colIndex, val)}
            rows={col.rows}
            onAddRow={() => addRow(colIndex)}
            onRemoveColumn={() => removeColumn(colIndex)}
            onUpdateRow={(rowIdx, updates) =>
              updateRow(colIndex, rowIdx, updates)
            }
            onRemoveRow={(rowIdx) => removeRow(colIndex, rowIdx)}
            onQuickLoad={(matrix) => handleQuickLoad(colIndex, matrix)}
          />
        ))}
      </GroupsContainer>
    </main>
  );
}
