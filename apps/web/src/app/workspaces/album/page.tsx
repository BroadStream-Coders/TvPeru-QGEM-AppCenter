"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { nanoid } from "nanoid";
import { ImageSlot } from "@/types";
import { AlbumColumn } from "./components/AlbumColumn";

const DEFAULT_FILENAME = "Album.zip";
const SESSION_DATA_FILENAME = "sessionData.json";

interface AlbumRound {
  id: string;
  context: string;
  photos: ImageSlot[];
}

interface AlbumExportCard {
  isCroma?: boolean;
  question: string;
  imagePath: string;
}

interface AlbumExportRound {
  title: string;
  cards: AlbumExportCard[];
}

interface AlbumSessionData {
  rounds: AlbumExportRound[];
}

const createEmptyPhoto = (): ImageSlot => ({
  id: nanoid(),
  name: "",
});

const createEmptyAlbumRound = (): AlbumRound => {
  const photos = Array(5).fill(null).map(createEmptyPhoto);
  return {
    id: nanoid(),
    context: "",
    photos,
  };
};

export default function AlbumPage() {
  const [rounds, setRounds] = useState<AlbumRound[]>([createEmptyAlbumRound()]);

  const addRound = () => {
    setRounds((prev) => [...prev, createEmptyAlbumRound()]);
  };

  const removeRound = (roundId: string) => {
    const roundToRemove = rounds.find((r) => r.id === roundId);
    roundToRemove?.photos.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    setRounds((prev) => prev.filter((r) => r.id !== roundId));
  };

  const updatePhotoInRound = (
    roundId: string,
    photoId: string,
    updates: Partial<ImageSlot>,
  ) => {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        return {
          ...r,
          photos: r.photos.map((p) => {
            if (p.id === photoId) {
              if (updates.url && p.url && updates.url !== p.url) {
                URL.revokeObjectURL(p.url);
              }
              return { ...p, ...updates };
            }
            return p;
          }),
        };
      }),
    );
  };

  const updateRound = (
    roundId: string,
    updates: Partial<{ context: string }>,
  ) => {
    setRounds((prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, ...updates } : r)),
    );
  };

  const handleQuickLoad = (roundId: string, matrix: string[][]) => {
    // Each line = a question name, max 5 taken
    const names = matrix
      .map((row) => row[0]?.trim() ?? "")
      .filter((line) => line !== "")
      .slice(0, 5);

    if (names.length === 0) return;

    setRounds((prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        return {
          ...r,
          photos: r.photos.map((p, i) => ({
            ...p,
            name: names[i] ?? p.name,
          })),
        };
      }),
    );
  };

  const handleSave = async () => {
    const prepareMetadata = (albumRounds: AlbumRound[]): AlbumExportRound[] =>
      albumRounds.map((round) => ({
        title: round.context,
        cards: round.photos.map((photo) => ({
          isCroma: photo.isCroma ? true : undefined,
          question: photo.name || "",
          imagePath: photo.file ? `images/${nanoid(4)}_${photo.file.name}` : "",
        })),
      }));

    const sessionData: AlbumSessionData = {
      rounds: prepareMetadata(rounds),
    };

    const filesToInclude: { name: string; file: File }[] = [];

    rounds.forEach((round, roundIndex) => {
      round.photos.forEach((photo, photoIndex) => {
        if (photo.file) {
          const path =
            sessionData.rounds[roundIndex].cards[photoIndex].imagePath;
          if (path) {
            filesToInclude.push({
              name: path,
              file: photo.file,
            });
          }
        }
      });
    });

    try {
      await saveAsZip(
        DEFAULT_FILENAME,
        sessionData,
        filesToInclude,
        SESSION_DATA_FILENAME,
      );
    } catch {
      alert("Error al exportar los datos.");
    }
  };

  const handleLoad = async (file: File) => {
    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file(SESSION_DATA_FILENAME) || zip.file("data.json");

      if (!dataFile) {
        alert(
          "El archivo no es un paquete válido de Album (falta sessionData.json).",
        );
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as AlbumSessionData;

      if (!sessionData.rounds || !Array.isArray(sessionData.rounds)) {
        alert("El archivo no contiene data de rondas validas.");
        return;
      }

      const processGroups = async (
        groupsMeta: AlbumExportRound[],
      ): Promise<AlbumRound[]> => {
        return Promise.all(
          groupsMeta.map(async (roundMeta) => {
            const photos = await Promise.all(
              (roundMeta.cards || []).map(async (pMeta) => {
                let imageFile: File | undefined;
                let imageUrl: string | undefined;
                if (pMeta.imagePath) {
                  const imgEntry = zip.file(pMeta.imagePath);
                  if (imgEntry) {
                    const blob = await imgEntry.async("blob");
                    const parts = (
                      pMeta.imagePath.split("/").pop() || pMeta.imagePath
                    ).split("_");
                    const originalName =
                      parts.length > 1 ? parts.slice(1).join("_") : parts[0];
                    imageFile = new File([blob], originalName, {
                      type: blob.type || "image/png",
                    });
                    imageUrl = URL.createObjectURL(blob);
                  }
                }
                return {
                  id: nanoid(),
                  name: pMeta.question || "",
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );

            return {
              id: nanoid(),
              context: roundMeta.title || "",
              photos:
                photos.length > 0
                  ? photos
                  : [createEmptyPhoto(), createEmptyPhoto()],
            };
          }),
        );
      };

      const loadedGroups = await processGroups(sessionData.rounds);

      setRounds(
        loadedGroups.length > 0 ? loadedGroups : [createEmptyAlbumRound()],
      );
    } catch {
      alert("Error al importar los datos.");
    }
  };

  return (
    <WorkspaceShell
      title="Album"
      icon={<ImageIcon className="h-3 w-3" />}
      badge={`${rounds.length} columna${rounds.length !== 1 ? "s" : ""}`}
      actions={
        <FileActions format="zip" onSave={handleSave} onLoad={handleLoad} />
      }
    >
      <GroupsContainer onAddGroup={addRound} addLabel="Agregar columna">
        {rounds.map((round, roundIndex) => (
          <AlbumColumn
            key={round.id}
            index={roundIndex + 1}
            photos={round.photos}
            context={round.context}
            onUpdatePhoto={(photoId, updates) =>
              updatePhotoInRound(round.id, photoId, updates)
            }
            onUpdateRound={(updates) => updateRound(round.id, updates)}
            onRemoveColumn={() => removeRound(round.id)}
            onQuickLoad={(matrix) => handleQuickLoad(round.id, matrix)}
          />
        ))}
      </GroupsContainer>
    </WorkspaceShell>
  );
}
