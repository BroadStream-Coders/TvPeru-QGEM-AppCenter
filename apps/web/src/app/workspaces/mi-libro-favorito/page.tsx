"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Upload, Download, Users } from "lucide-react";
import { LibroColumn } from "./components/LibroColumn";
import { PlayersColumn } from "./components/PlayersColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface LibroGroup {
  slots: QuestionAnswer[];
}

interface PlayerData {
  name: string;
  imagePreview: string | null;
  imageFile?: File | null;
}

export default function MiLibroFavoritoPage() {
  const [players, setPlayers] = useState<PlayerData[]>([
    { name: "", imagePreview: null },
    { name: "", imagePreview: null },
  ]);

  const [groups, setGroups] = useState<LibroGroup[]>([
    {
      slots: [
        { question: "", answer: "" },
        { question: "", answer: "" },
      ],
    },
  ]);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name };
    setPlayers(newPlayers);
  };

  const handlePlayerImageChange = (index: number, file: File, url: string) => {
    const newPlayers = [...players];
    newPlayers[index] = {
      ...newPlayers[index],
      imageFile: file,
      imagePreview: url,
    };
    setPlayers(newPlayers);
  };

  const addGroup = () =>
    setGroups([...groups, { slots: [{ question: "", answer: "" }] }]);

  const removeGroup = (groupIndex: number) =>
    setGroups(groups.filter((_, i: number) => i !== groupIndex));

  const addItemToGroup = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].slots = [
      ...newGroups[groupIndex].slots,
      { question: "", answer: "" },
    ];
    setGroups(newGroups);
  };

  const updateItem = (
    groupIndex: number,
    itemIndex: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newGroups = [...groups];
    newGroups[groupIndex].slots[itemIndex][field] = value;
    setGroups(newGroups);
  };

  const removeItem = (groupIndex: number, itemIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].slots = newGroups[groupIndex].slots.filter(
      (_, i: number) => i !== itemIndex,
    );
    setGroups(newGroups);
  };
  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const newGroups = [...groups];
    newGroups[groupIndex].slots = matrix.map((row) => ({
      question: row[0] || "",
      answer: row[1] || "",
    }));
    setGroups(newGroups);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const playersMetadata = players.map((p, i) => ({
      name: p.name,
      imageFile: p.imageFile
        ? `images/player_${i + 1}.${p.imageFile.name.split(".").pop()}`
        : null,
    }));

    const sessionData = {
      players: playersMetadata,
      groups,
    };

    const filesToInclude = players
      .map((p, i) => {
        if (p.imageFile) {
          const ext = p.imageFile.name.split(".").pop();
          return {
            name: `images/player_${i + 1}.${ext}`,
            file: p.imageFile,
          };
        }
        return null;
      })
      .filter((item): item is { name: string; file: File } => item !== null);

    await saveAsZip("MiLibroFavorito.zip", sessionData, filesToInclude);
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file("sessionData.json");
      if (!dataFile) {
        alert("El ZIP no contiene un archivo sessionData.json válido.");
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content);

      // Restore Players
      if (Array.isArray(sessionData.players)) {
        interface LoadedPlayerMetadata {
          name: string;
          imageFile: string | null;
        }

        const loadedPlayers = await Promise.all(
          sessionData.players.map(async (p: LoadedPlayerMetadata) => {
            let imageFile = null;
            let imagePreview = null;

            if (p.imageFile) {
              const imgFileInZip = zip.file(p.imageFile);
              if (imgFileInZip) {
                const blob = await imgFileInZip.async("blob");
                imageFile = new File(
                  [blob],
                  p.imageFile.split("/").pop() || "image",
                  {
                    type: blob.type,
                  },
                );
                imagePreview = URL.createObjectURL(blob);
              }
            }
            return { name: p.name || "", imageFile, imagePreview };
          }),
        );
        setPlayers(loadedPlayers);
      }

      // Restore Groups
      if (Array.isArray(sessionData.groups)) {
        setGroups(sessionData.groups);
      }
    } catch (error) {
      console.error("Error cargando ZIP:", error);
      alert("Error al procesar el archivo ZIP.");
    }
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => fileInputRef.current?.click();

  return (
    <>
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
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand ring-1 ring-brand/10">
              <BookOpen className="h-3 w-3" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Mi Libro Favorito
            </span>
          </div>
          <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {groups.length} ronda{groups.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-500">
            <Users className="h-3 w-3" />
            <span className="text-2xs font-bold uppercase tracking-wider">
              Solo 2 Players
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
            accept=".zip"
            className="hidden"
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div
            className="flex min-w-max gap-4 px-6 py-6"
            style={{ height: "calc(100vh - 48px - 36px)" }}
          >
            {/* Fixed Players Column */}
            <PlayersColumn
              players={players}
              onPlayerNameChange={handlePlayerNameChange}
              onPlayerImageChange={handlePlayerImageChange}
            />

            <div className="w-px bg-border/50 shrink-0 mx-2" />

            {groups.map((group, groupIndex) => (
              <LibroColumn
                key={groupIndex}
                index={groupIndex + 1}
                items={group.slots}
                onItemChange={(itemIdx, field, val) =>
                  updateItem(groupIndex, itemIdx, field, val)
                }
                onAddItem={() => addItemToGroup(groupIndex)}
                onRemoveItem={(itemIdx) => removeItem(groupIndex, itemIdx)}
                onRemoveColumn={() => removeGroup(groupIndex)}
                onQuickLoad={(data) => handleQuickLoad(groupIndex, data)}
              />
            ))}

            <div className="h-full w-[180px] shrink-0">
              <button
                onClick={addGroup}
                className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-current transition-colors group-hover:border-brand/50 group-hover:text-brand">
                  <Upload className="h-4 w-4" />
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
