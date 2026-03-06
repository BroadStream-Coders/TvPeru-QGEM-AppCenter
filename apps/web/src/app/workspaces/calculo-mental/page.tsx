"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, ArrowLeft } from "lucide-react";
import { CalculoMentalBoard } from "./components/CalculoMentalBoard";
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
    groups: [{ boards: [createEmptyBoard()] }],
  });
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeGroup = data.groups[activeGroupIndex];

  const addGroup = () => {
    setData({
      ...data,
      groups: [...data.groups, { boards: [createEmptyBoard()] }],
    });
    setActiveGroupIndex(data.groups.length);
  };

  const addBoard = () => {
    const newGroups = [...data.groups];
    newGroups[activeGroupIndex].boards = [
      ...newGroups[activeGroupIndex].boards,
      createEmptyBoard(),
    ];
    setData({ ...data, groups: newGroups });
  };

  const removeBoard = (boardIndex: number) => {
    const newGroups = [...data.groups];
    newGroups[activeGroupIndex].boards = newGroups[
      activeGroupIndex
    ].boards.filter((_, i) => i !== boardIndex);
    setData({ ...data, groups: newGroups });
  };

  const updateSlot = (
    boardIndex: number,
    slotIndex: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newGroups = [...data.groups];
    const board = newGroups[activeGroupIndex].boards[boardIndex];
    board.slots[slotIndex][field] = value;
    setData({ ...data, groups: newGroups });
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
        setActiveGroupIndex(0);
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
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10 transition-colors duration-200">
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
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand text-2xs font-bold ring-1 ring-brand/10">
              C
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Calculo Mental
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerLoad}
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cargar</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 gap-1.5 bg-brand hover:brightness-110 active:scale-[0.98] text-brand-foreground text-xs shadow-sm transition-all"
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

      {/* Group selector */}
      <div className="flex h-11 shrink-0 items-center border-b border-border bg-muted/5 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center h-8 gap-1">
          {data.groups.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveGroupIndex(i)}
              className={`h-7 px-3 text-caption font-bold rounded-md transition-all whitespace-nowrap ${
                activeGroupIndex === i
                  ? "bg-brand/10 text-brand border border-brand/20 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
              }`}
            >
              Grupo {i + 1}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={addGroup}
            className="h-7 w-7 rounded-md hover:bg-brand/10 hover:text-brand"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div
            className="flex min-w-max gap-4 px-6 py-6"
            style={{ height: "calc(100vh - 48px - 44px - 36px)" }}
          >
            {activeGroup.boards.map((board, boardIdx) => (
              <CalculoMentalBoard
                key={boardIdx}
                index={boardIdx + 1}
                slots={board.slots}
                onSlotChange={(slotIdx, field, val) =>
                  updateSlot(boardIdx, slotIdx, field, val)
                }
                onRemoveBoard={() => removeBoard(boardIdx)}
              />
            ))}

            <div className="h-full w-[200px] shrink-0">
              <button
                onClick={addBoard}
                className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-current transition-colors group-hover:border-brand/50 group-hover:text-brand">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium block">
                    Agregar Tablero
                  </span>
                  <span className="text-2xs text-muted-foreground/60">
                    (4 Slots)
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
