"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { getColumnData } from "@/helpers/data-processing";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, ArrowLeft } from "lucide-react";
import { DeletreoColumn } from "./components/DeletreoColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DEFAULT_FILENAME = "DeletreoData.json";

interface DeletreoGroup {
  words: string[];
}

interface DeletreoData {
  groups: DeletreoGroup[];
}

export default function DeletreoPage() {
  const [groups, setGroups] = useState<DeletreoGroup[]>([
    { words: ["", "", ""] },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addGroup = () => setGroups([...groups, { words: ["", "", ""] }]);

  const removeGroup = (groupIndex: number) =>
    setGroups(groups.filter((_, i) => i !== groupIndex));

  const addWordToGroup = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].words = [...newGroups[groupIndex].words, ""];
    setGroups(newGroups);
  };

  const updateWord = (groupIndex: number, wordIndex: number, value: string) => {
    const newGroups = [...groups];
    newGroups[groupIndex].words[wordIndex] = value;
    setGroups(newGroups);
  };

  const removeWord = (groupIndex: number, wordIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].words = newGroups[groupIndex].words.filter(
      (_, i) => i !== wordIndex,
    );
    setGroups(newGroups);
  };

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const newGroups = [...groups];
    newGroups[groupIndex].words = getColumnData(matrix, 0);
    setGroups(newGroups);
  };

  const handleSave = () => saveAsJson(DEFAULT_FILENAME, { groups });

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const isValid = (data: unknown): data is DeletreoData => {
        if (typeof data !== "object" || data === null || !("groups" in data))
          return false;
        const g = (data as DeletreoData).groups;
        return (
          Array.isArray(g) &&
          g.every(
            (r) =>
              typeof r === "object" &&
              r !== null &&
              "words" in r &&
              Array.isArray(r.words),
          )
        );
      };
      const data = await loadJsonFile<DeletreoData>(file, isValid);
      if (data?.groups) setGroups(data.groups);
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
    <>
      {/* Header — h-12 = 48px */}
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
              D
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Deletreo
            </span>
          </div>
          <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {groups.length} ronda{groups.length !== 1 ? "s" : ""}
          </span>
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

      {/*
        Workspace — No necesitamos wrapper de altura aquí, el layout ya maneja flex-1.
        El ScrollArea aquí es SOLO horizontal.
      */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div
            className="flex min-w-max gap-4 px-6 py-6"
            style={{ height: "calc(100vh - 48px - 36px)" }}
          >
            {groups.map((group, groupIndex) => (
              <DeletreoColumn
                key={groupIndex}
                index={groupIndex + 1}
                words={group.words}
                onWordChange={(wordIdx, val) =>
                  updateWord(groupIndex, wordIdx, val)
                }
                onAddWord={() => addWordToGroup(groupIndex)}
                onRemoveWord={(wordIdx) => removeWord(groupIndex, wordIdx)}
                onRemoveColumn={() => removeGroup(groupIndex)}
                onQuickLoad={(newWords) =>
                  handleQuickLoad(groupIndex, newWords)
                }
              />
            ))}

            {/* Add round — misma altura que las columnas vía h-full */}
            <div className="h-full w-[180px] shrink-0">
              <button
                onClick={addGroup}
                className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-current transition-colors group-hover:border-brand/50 group-hover:text-brand">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">Agregar ronda</span>
              </button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </>
  );
}
