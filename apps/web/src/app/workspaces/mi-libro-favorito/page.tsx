"use client";

import { useState } from "react";
import { BookOpen, Users } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { AddColumnButton } from "@/components/shared/group-column/components/AddColumnButton";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { LibroColumn } from "./components/LibroColumn";
import { PlayersColumn } from "./components/PlayersColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DEFAULT_FILENAME = "MiLibroFavorito.zip";

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

interface SessionData {
  players: { name: string; imageFile: string | null }[];
  groups: LibroGroup[];
}

const createEmptyQA = (): QuestionAnswer => ({ question: "", answer: "" });

const initialGroups: QuestionAnswer[][] = [
  [createEmptyQA(), createEmptyQA()],
  [createEmptyQA(), createEmptyQA()],
];

export default function MiLibroFavoritoPage() {
  const [players, setPlayers] = useState<PlayerData[]>([
    { name: "", imagePreview: null },
    { name: "", imagePreview: null },
  ]);

  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<QuestionAnswer>(initialGroups, createEmptyQA);

  const handlePlayerNameChange = (index: number, name: string) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, name } : p)),
    );
  };

  const handlePlayerImageChange = (index: number, file: File, url: string) => {
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, imageFile: file, imagePreview: url } : p,
      ),
    );
  };

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    replaceGroup(
      groupIndex,
      matrix.map((row) => ({ question: row[0] || "", answer: row[1] || "" })),
    );
  };

  const handleSave = async () => {
    const playersMetadata = players.map((p, i) => ({
      name: p.name,
      imageFile: p.imageFile
        ? `images/player_${i + 1}.${p.imageFile.name.split(".").pop()}`
        : null,
    }));

    const sessionData: SessionData = {
      players: playersMetadata,
      groups: groups.map((slots) => ({ slots })),
    };

    const filesToInclude = players
      .map((p, i) => {
        if (!p.imageFile) return null;
        const ext = p.imageFile.name.split(".").pop();
        return { name: `images/player_${i + 1}.${ext}`, file: p.imageFile };
      })
      .filter((item): item is { name: string; file: File } => item !== null);

    await saveAsZip(DEFAULT_FILENAME, sessionData, filesToInclude);
  };

  const handleLoad = async (file: File) => {
    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file("sessionData.json");
      if (!dataFile) {
        alert("El ZIP no contiene un archivo sessionData.json válido.");
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as SessionData;

      if (Array.isArray(sessionData.players)) {
        const loadedPlayers = await Promise.all(
          sessionData.players.map(async (p) => {
            let imageFile = null;
            let imagePreview = null;
            if (p.imageFile) {
              const entry = zip.file(p.imageFile);
              if (entry) {
                const blob = await entry.async("blob");
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

      if (Array.isArray(sessionData.groups)) {
        setGroups(sessionData.groups.map((g) => g.slots));
      }
    } catch {
      alert("Error al procesar el archivo ZIP.");
    }
  };

  return (
    <WorkspaceShell
      title="Mi Libro Favorito"
      icon={<BookOpen className="h-3 w-3" />}
      badge={`${groups.length} ronda${groups.length !== 1 ? "s" : ""}`}
      actions={
        <>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-500">
            <Users className="h-3 w-3" />
            <span className="text-2xs font-bold uppercase tracking-wider">
              Solo 2 Players
            </span>
          </div>
          <FileActions format="zip" onSave={handleSave} onLoad={handleLoad} />
        </>
      }
    >
      <ScrollArea className="w-full h-full">
        <div
          className="flex min-w-max gap-4 px-6 py-6"
          style={{ height: "calc(100vh - 48px - 36px)" }}
        >
          <PlayersColumn
            players={players}
            onPlayerNameChange={handlePlayerNameChange}
            onPlayerImageChange={handlePlayerImageChange}
          />

          <div className="w-px bg-border/50 shrink-0 mx-2" />

          {groups.map((slots, groupIndex) => (
            <LibroColumn
              key={groupIndex}
              index={groupIndex + 1}
              items={slots}
              onItemChange={(itemIdx, field, val) =>
                updateItem(groupIndex, itemIdx, {
                  ...slots[itemIdx],
                  [field]: val,
                })
              }
              onAddItem={() => addItem(groupIndex)}
              onRemoveItem={(itemIdx) => removeItem(groupIndex, itemIdx)}
              onRemoveColumn={() => removeGroup(groupIndex)}
              onQuickLoad={(matrix) => handleQuickLoad(groupIndex, matrix)}
            />
          ))}

          <AddColumnButton label="Agregar ronda" onClick={addGroup} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </WorkspaceShell>
  );
}
