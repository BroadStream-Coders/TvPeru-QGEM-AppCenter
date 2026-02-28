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
    // overflow-hidden en todo: la página nunca hace scroll en Y
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Header — h-12 = 48px */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand text-2xs font-bold">
              D
            </div>
            <span className="text-sm font-semibold">Deletreo</span>
          </div>
          <span className="rounded border border-border px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
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
            className="h-7 gap-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs"
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
        Workspace — flex-1 toma el espacio restante entre header (48px) y footer (36px).
        overflow-hidden: nunca scroll Y en la página.
        El ScrollArea aquí es SOLO horizontal.
      */}
      <main className="flex flex-1 overflow-hidden">
        <ScrollArea className="w-full">
          {/*
            py-6 (24px) = padding simétrico arriba y abajo.
            Las columnas tienen altura fija via CSS var calculada:
              100vh - header(48px) - footer(36px) - padding vertical(48px) = restante
            Se pasa como prop a DeletreoColumn vía clase en el wrapper,
            pero es más limpio dejar que DeletreoColumn use h-full
            dentro de un contenedor con altura explícita.

            Usamos: calc(100vh - 48px - 36px - 48px) = calc(100vh - 132px)
            como altura del contenedor de filas para que las columnas sean fijas.
          */}
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
                className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-muted-foreground transition-all hover:border-brand/50 hover:text-foreground"
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

      {/* Footer — h-9 = 36px */}
      <footer className="flex h-9 shrink-0 items-center justify-between border-t border-border px-6">
        <span className="text-2xs text-muted-foreground font-mono">
          BroadStream Coders © {new Date().getFullYear()} — TV PERÚ QGEM APP
          CENTER
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-2xs text-muted-foreground">Activo</span>
        </div>
      </footer>
    </div>
  );
}
