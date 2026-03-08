"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, ArrowLeft, Calculator } from "lucide-react";
import { CalculoMentalColumn } from "./components/CalculoMentalColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DEFAULT_FILENAME = "CalculoMental.json";

interface SlotData {
  question: string;
  answer: string;
}

interface BoardData {
  slots: SlotData[];
}

interface GroupData {
  boards: BoardData[];
}

interface CalculoMentalData {
  groups: GroupData[];
}

const createEmptyBoard = (): BoardData => ({
  slots: Array(4)
    .fill(null)
    .map(() => ({ question: "", answer: "" })),
});

export default function CalculoMentalPage() {
  const [data, setData] = useState<CalculoMentalData>({
    groups: [
      { boards: [createEmptyBoard()] },
      { boards: [createEmptyBoard()] },
    ],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addGroup = () => {
    setData({
      ...data,
      groups: [...data.groups, { boards: [createEmptyBoard()] }],
    });
  };

  const removeGroup = (groupIndex: number) => {
    if (data.groups.length <= 1) {
      // Keep at least one group but empty its boards if needed
      setData({
        groups: [{ boards: [createEmptyBoard()] }],
      });
      return;
    }
    setData({
      ...data,
      groups: data.groups.filter((_, i) => i !== groupIndex),
    });
  };

  const addBoardToGroup = (groupIndex: number) => {
    const newGroups = [...data.groups];
    newGroups[groupIndex].boards = [
      ...newGroups[groupIndex].boards,
      createEmptyBoard(),
    ];
    setData({ ...data, groups: newGroups });
  };

  const removeBoardFromGroup = (groupIndex: number, boardIndex: number) => {
    const newGroups = [...data.groups];
    newGroups[groupIndex].boards = newGroups[groupIndex].boards.filter(
      (_, i) => i !== boardIndex,
    );
    setData({ ...data, groups: newGroups });
  };

  const updateSlot = (
    groupIndex: number,
    boardIndex: number,
    slotIndex: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newGroups = [...data.groups];
    const group = newGroups[groupIndex];
    const board = group.boards[boardIndex];
    board.slots[slotIndex][field] = value;
    setData({ ...data, groups: newGroups });
  };

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const newBoards: BoardData[] = [];

    // Cada board consiste en 4 slots (A, B, C, D)
    // El excel pegado trae:
    // Fila 1: Preguntas (A1, B1, C1, D1)
    // Fila 2: Respuestas (A1, B1, C1, D1)
    // Fila 3: Preguntas (A2, B2, C2, D2)
    // Fila 4: Respuestas (A2, B2, C2, D2)
    // ...
    for (let i = 0; i < matrix.length; i += 2) {
      const questionRow = matrix[i] || [];
      const answerRow = matrix[i + 1] || [];

      // Si ambas filas están vacías, saltamos
      if (questionRow.length === 0 && answerRow.length === 0) continue;

      const slots: SlotData[] = Array(4)
        .fill(null)
        .map((_, slotIdx) => ({
          question: (questionRow[slotIdx] || "").trim(),
          answer: (answerRow[slotIdx] || "").trim(),
        }));

      newBoards.push({ slots });
    }

    if (newBoards.length > 0) {
      const newGroups = [...data.groups];
      newGroups[groupIndex].boards = newBoards;
      setData({ ...data, groups: newGroups });
    }
  };

  const handleSave = () => saveAsJson(DEFAULT_FILENAME, data);

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const isValid = (d: unknown): d is CalculoMentalData => {
        if (typeof d !== "object" || d === null || !("groups" in d))
          return false;
        const g = (d as CalculoMentalData).groups;
        return (
          Array.isArray(g) &&
          g.every(
            (group) =>
              Array.isArray(group.boards) &&
              group.boards.every((board) => Array.isArray(board.slots)),
          )
        );
      };
      const loadedData = await loadJsonFile<CalculoMentalData>(file, isValid);
      if (loadedData) {
        setData(loadedData);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Error al cargar el archivo JSON.",
      );
    }
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans uppercase">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10 transition-colors duration-200 uppercase">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand ring-1 ring-brand/10">
              <Calculator className="h-3 w-3" />
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">
              Calculo Mental
            </span>
          </div>
          <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-2xs font-mono text-muted-foreground uppercase">
            {data.groups.length} Grupo{data.groups.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 uppercase">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerLoad}
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold uppercase"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cargar</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 gap-1.5 bg-brand hover:brightness-110 active:scale-[0.98] text-brand-foreground text-xs shadow-sm transition-all font-bold uppercase"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guardar</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLoad}
            accept=".json"
            className="hidden"
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div
            className="flex min-w-max gap-6 px-8 py-8"
            style={{ height: "calc(100vh - 48px - 36px)" }}
          >
            {data.groups.map((group, groupIdx) => (
              <CalculoMentalColumn
                key={groupIdx}
                index={groupIdx + 1}
                boards={group.boards}
                onSlotChange={(boardIdx, slotIdx, field, val) =>
                  updateSlot(groupIdx, boardIdx, slotIdx, field, val)
                }
                onAddBoard={() => addBoardToGroup(groupIdx)}
                onRemoveBoard={(boardIdx) =>
                  removeBoardFromGroup(groupIdx, boardIdx)
                }
                onRemoveColumn={() => removeGroup(groupIdx)}
                onQuickLoad={(matrix) => handleQuickLoad(groupIdx, matrix)}
              />
            ))}

            {/* Empty space for "Add Group" at the end */}
            <div className="h-full w-[240px] shrink-0">
              <button
                onClick={addGroup}
                className="group flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/40 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-dashed border-current transition-all group-hover:scale-110 group-hover:bg-brand group-hover:text-brand-foreground group-hover:border-transparent">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider">
                    Añadir Grupo
                  </span>
                  <span className="text-2xs text-muted-foreground/50 font-medium">
                    (Nueva Columna)
                  </span>
                </div>
              </button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </div>
  );
}
