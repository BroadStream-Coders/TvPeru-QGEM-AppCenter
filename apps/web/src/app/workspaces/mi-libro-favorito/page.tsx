"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { LibroColumn } from "./components/LibroColumn";
import { PlayersColumn } from "./components/PlayersColumn";

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
  players: {
    playerName: string;
    pictureFile: string | null;
    maxHealth: number;
  }[];
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

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

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

  const handleSave = useCallback(async () => {
    const playersMetadata = players.map((p, i) => ({
      playerName: p.name,
      pictureFile: p.imageFile
        ? `images/player_${i + 1}.${p.imageFile.name.split(".").pop()}`
        : null,
      maxHealth: 3,
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
  }, [players, groups]);

  const handleLoad = useCallback(
    async (file: File) => {
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
              if (p.pictureFile) {
                const entry = zip.file(p.pictureFile);
                if (entry) {
                  const blob = await entry.async("blob");
                  imageFile = new File(
                    [blob],
                    p.pictureFile.split("/").pop() || "image",
                    {
                      type: blob.type,
                    },
                  );
                  imagePreview = URL.createObjectURL(blob);
                }
              }
              return { name: p.playerName || "", imageFile, imagePreview };
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
    },
    [setPlayers, setGroups],
  );

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Mi Libro Favorito",
      icon: <BookOpen className="h-3 w-3" />,
      format: "zip",
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader, handleSave, handleLoad]);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="flex h-full overflow-hidden">
        {/* Player info column — se mantiene fuera del sistema de grupos */}
        <div className="shrink-0 overflow-y-auto py-6 px-6">
          <PlayersColumn
            players={players}
            onPlayerNameChange={handlePlayerNameChange}
            onPlayerImageChange={handlePlayerImageChange}
          />
        </div>

        <div className="w-px bg-border/50 shrink-0 my-6" />

        {/* Columnas de rondas */}
        <div className="flex-1 min-w-0">
          <GroupsContainer onAddGroup={addGroup} addLabel="Agregar ronda">
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
          </GroupsContainer>
        </div>
      </div>
    </main>
  );
}
