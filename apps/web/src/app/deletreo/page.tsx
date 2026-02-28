"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { getColumnData } from "@/helpers/data-processing";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, ArrowLeft } from "lucide-react";
import { DeletreoColumn } from "./components/DeletreoColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Configuración de nombre de archivo por defecto
const DEFAULT_FILENAME = "DeletreoData.json";

interface DeletreoGroup {
  words: string[];
}

interface DeletreoData {
  groups: DeletreoGroup[];
}

export default function DeletreoPage() {
  const [groups, setGroups] = useState<DeletreoGroup[]>([
    { words: ["", "", ""] }, // Grupo inicial por defecto
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers de Estado ---

  const addGroup = () => {
    setGroups([...groups, { words: ["", "", ""] }]);
  };

  const removeGroup = (groupIndex: number) => {
    setGroups(groups.filter((_, i) => i !== groupIndex));
  };

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
    // Extraemos la primera columna de la matriz y reemplazamos la existente
    newGroups[groupIndex].words = getColumnData(matrix, 0);
    setGroups(newGroups);
  };

  // --- Persistencia ---

  const handleSave = () => {
    const data: DeletreoData = { groups };
    saveAsJson(DEFAULT_FILENAME, data);
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const isValidDeletreo = (data: unknown): data is DeletreoData => {
        if (typeof data !== "object" || data === null || !("groups" in data)) {
          return false;
        }
        const groups = (data as DeletreoData).groups;
        return (
          Array.isArray(groups) &&
          groups.every(
            (g) =>
              typeof g === "object" &&
              g !== null &&
              "words" in g &&
              Array.isArray(g.words),
          )
        );
      };

      const data = await loadJsonFile<DeletreoData>(file, isValidDeletreo);

      if (data && data.groups) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error("Error al cargar el archivo JSON:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error al cargar el archivo JSON.",
      );
    }
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Header Fijo */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </Link>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <h1 className="text-lg font-bold tracking-tight">Deletreo</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerLoad}
            className="flex gap-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Cargar Archivo</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white flex gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Guardar Archivo</span>
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

      {/* Área de Trabajo */}
      <main className="flex-1 overflow-hidden relative flex flex-col justify-evenly items-center">
        <div className="w-full flex justify-center">
          <ScrollArea className="w-full">
            <div className="flex px-12 gap-8 items-start justify-center min-w-max py-4">
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
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>

        {/* Botón para añadir Ronda */}
        <div className="flex shrink-0 items-center justify-center pb-16 pt-8 z-20">
          <Button
            onClick={addGroup}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-red-900/20 active:scale-95 transition-all flex gap-3"
          >
            <Plus className="h-6 w-6" />
            Agregar Ronda
          </Button>
        </div>
      </main>

      {/* Footer Fijo */}
      <footer className="flex h-10 items-center justify-center border-t bg-white px-6 text-[10px] text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 shrink-0">
        BroadStream Coders &copy; {new Date().getFullYear()} - TV PERÚ QGEM APP
        CENTER
      </footer>
    </div>
  );
}
