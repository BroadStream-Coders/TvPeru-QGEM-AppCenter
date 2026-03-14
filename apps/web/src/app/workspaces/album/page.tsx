"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

interface PhotoMetadata {
  name: string;
  path: string;
}

interface RoundMetadata {
  context: string;
  photos: PhotoMetadata[];
}

interface AlbumSessionData {
  version: number;
  groups: RoundMetadata[];
}

const createEmptyPhoto = (): ImageSlot => ({
  id: nanoid(),
  name: "",
});

const createEmptyAlbumRound = (): AlbumRound => ({
  id: nanoid(),
  context: "",
  photos: [createEmptyPhoto(), createEmptyPhoto()],
});

export default function AlbumPage() {
  const [rounds, setRounds] = useState<AlbumRound[]>([createEmptyAlbumRound()]);

  const addRound = (count: number = 1) => {
    const newRounds = Array(count)
      .fill(null)
      .map(createEmptyAlbumRound);
    setRounds((prev) => [...prev, ...newRounds]);
  };

  const removeRound = (roundId: string) => {
    const roundToRemove = rounds.find((r) => r.id === roundId);
    roundToRemove?.photos.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    setRounds((prev) => prev.filter((r) => r.id !== roundId));
  };

  const addPhotoToRound = (roundId: string) => {
    setRounds((prev) =>
      prev.map((r) =>
        r.id === roundId
          ? { ...r, photos: [...r.photos, createEmptyPhoto()] }
          : r,
      ),
    );
  };

  const removePhotoFromRound = (roundId: string, photoId: string) => {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        const photo = r.photos.find((p) => p.id === photoId);
        if (photo?.url) URL.revokeObjectURL(photo.url);
        return { ...r, photos: r.photos.filter((p) => p.id !== photoId) };
      }),
    );
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
            if (p.id !== photoId) return p;
            if (updates.url && p.url && updates.url !== p.url) {
              URL.revokeObjectURL(p.url);
            }
            return { ...p, ...updates };
          }),
        };
      }),
    );
  };

  const updateRound = (roundId: string, updates: Partial<{ context: string }>) => {
    setRounds((prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, ...updates } : r)),
    );
  };

  const handleSave = async () => {
    const prepareMetadata = (albumRounds: AlbumRound[]): RoundMetadata[] =>
      albumRounds.map((round) => ({
        context: round.context,
        photos: round.photos.map((photo) => ({
          name: photo.name || "",
          path: photo.file ? `images/${nanoid(4)}_${photo.file.name}` : "",
        })),
      }));

    const sessionData: AlbumSessionData = {
      version: 1,
      groups: prepareMetadata(rounds),
    };

    const filesToInclude: { name: string; file: File }[] = [];

    rounds.forEach((round, roundIndex) => {
      round.photos.forEach((photo, photoIndex) => {
        if (photo.file) {
          const path = sessionData.groups[roundIndex].photos[photoIndex].path;
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

      if (!sessionData.groups || !Array.isArray(sessionData.groups)) {
          alert("El archivo no contiene data de columnas validas.");
          return;
      }

      const processGroups = async (
        groupsMeta: RoundMetadata[],
      ): Promise<AlbumRound[]> => {
        return Promise.all(
          groupsMeta.map(async (roundMeta) => {
            const photos = await Promise.all(
              (roundMeta.photos || []).map(async (pMeta) => {
                let imageFile: File | undefined;
                let imageUrl: string | undefined;
                if (pMeta.path) {
                  const imgEntry = zip.file(pMeta.path);
                  if (imgEntry) {
                    const blob = await imgEntry.async("blob");
                    const parts = (
                      pMeta.path.split("/").pop() || pMeta.path
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
                  name: pMeta.name || "",
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );

            return {
              id: nanoid(),
              context: roundMeta.context || "",
              photos: photos.length > 0 ? photos : [createEmptyPhoto(), createEmptyPhoto()],
            };
          }),
        );
      };

      const loadedGroups = await processGroups(sessionData.groups);

      setRounds(loadedGroups.length > 0 ? loadedGroups : [createEmptyAlbumRound()]);
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
      <ScrollArea className="w-full h-full">
        <div
          className="flex min-w-max gap-4 px-6 py-6"
          style={{ height: "calc(100vh - 48px - 36px)" }}
        >
          {rounds.map((round, roundIndex) => (
            <AlbumColumn
              key={round.id}
              index={roundIndex + 1}
              photos={round.photos}
              context={round.context}
              onAddPhoto={() => addPhotoToRound(round.id)}
              onRemovePhoto={(photoId) =>
                removePhotoFromRound(round.id, photoId)
              }
              onUpdatePhoto={(photoId, updates) =>
                updatePhotoInRound(round.id, photoId, updates)
              }
              onUpdateRound={(updates) => updateRound(round.id, updates)}
              onRemoveColumn={() => removeRound(round.id)}
            />
          ))}

          <AddColumnButton label="Agregar columna" onClick={() => addRound(1)} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </WorkspaceShell>
  );
}
