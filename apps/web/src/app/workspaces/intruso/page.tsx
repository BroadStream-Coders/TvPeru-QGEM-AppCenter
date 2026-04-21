"use client";

import { useState, useEffect, useCallback } from "react";
import { VenetianMask, Layers } from "lucide-react";
import { nanoid } from "nanoid";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { Level1View } from "./components/Level1View";
import { Level2View } from "./components/Level2View";

const DEFAULT_FILENAME = "Intruso.zip";
const SESSION_DATA_FILENAME = "sessionData.json";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isIntruso: boolean;
}

interface Option {
  text: string;
  isIntruso: boolean;
}

interface Round {
  id: string;
  context: string;
  photos: Photo[];
  options?: Option[];
}

interface SessionData {
  textRounds: TextRound[];
  photoRounds: PhotoRound[];
}

interface TextRound {
  description: string;
  imagePath: string;
  answerIndex: number;
  choices: string[];
}

interface PhotoRound {
  description: string;
  answerIndex: number;
  choices: PhotoChoice[];
}

interface PhotoChoice {
  label: string;
  imagePath: string;
}

type LevelId = "nivel1" | "nivel2";

const createEmptyPhoto = (): Photo => ({
  id: nanoid(),
  name: "",
  isIntruso: false,
});

const createEmptyLevel1Round = (): Round => ({
  id: nanoid(),
  context: "",
  photos: [createEmptyPhoto()],
  options: [{ text: "", isIntruso: false }],
});

const createEmptyLevel2Round = (): Round => {
  const photos = Array(4).fill(null).map(createEmptyPhoto);
  if (photos.length > 0) {
    photos[0].isIntruso = true;
  }
  return {
    id: nanoid(),
    context: "",
    photos,
  };
};

export default function Page() {
  const [roundsPerLevel, setRoundsPerLevel] = useState<
    Record<LevelId, Round[]>
  >({
    nivel1: [createEmptyLevel1Round()],
    nivel2: [createEmptyLevel2Round()],
  });

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const setRoundsForLevel = (
    level: LevelId,
    newRounds: Round[] | ((prev: Round[]) => Round[]),
  ) => {
    setRoundsPerLevel((prev) => ({
      ...prev,
      [level]:
        typeof newRounds === "function" ? newRounds(prev[level]) : newRounds,
    }));
  };

  // ── Level 1 handlers ──

  const addLevel1Round = () => {
    setRoundsForLevel("nivel1", (prev) => [...prev, createEmptyLevel1Round()]);
  };

  const removeLevel1Round = (roundId: string) => {
    const round = roundsPerLevel.nivel1.find((r) => r.id === roundId);
    round?.photos.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    setRoundsForLevel("nivel1", (prev) => prev.filter((r) => r.id !== roundId));
  };

  const updateLevel1PhotoInRound = (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => {
    setRoundsForLevel("nivel1", (prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        return {
          ...r,
          photos: r.photos.map((p) => {
            if (p.id === photoId) {
              if (updates.url && p.url && updates.url !== p.url)
                URL.revokeObjectURL(p.url);
              return { ...p, ...updates };
            }
            return p;
          }),
        };
      }),
    );
  };

  const updateLevel1Round = (roundId: string, updates: Partial<Round>) => {
    setRoundsForLevel("nivel1", (prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, ...updates } : r)),
    );
  };

  const handleLevel1QuickLoad = (roundId: string, matrix: string[][]) => {
    const lines = matrix
      .map((row) => row[0]?.trim() ?? "")
      .filter((line) => line !== "")
      .slice(0, 4);

    if (lines.length === 0) return;

    const options: Option[] = lines.map((text) => ({
      text,
      isIntruso: false,
    }));

    setRoundsForLevel("nivel1", (prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, options } : r)),
    );
  };

  // ── Level 2 handlers ──

  const addLevel2Round = () => {
    setRoundsForLevel("nivel2", (prev) => [...prev, createEmptyLevel2Round()]);
  };

  const removeLevel2Round = (roundId: string) => {
    const round = roundsPerLevel.nivel2.find((r) => r.id === roundId);
    round?.photos.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    setRoundsForLevel("nivel2", (prev) => prev.filter((r) => r.id !== roundId));
  };

  const addPhotoToRound = (roundId: string) => {
    setRoundsForLevel("nivel2", (prev) =>
      prev.map((r) =>
        r.id === roundId && r.photos.length < 4
          ? { ...r, photos: [...r.photos, createEmptyPhoto()] }
          : r,
      ),
    );
  };

  const removePhotoFromRound = (roundId: string, photoId: string) => {
    setRoundsForLevel("nivel2", (prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        const photo = r.photos.find((p) => p.id === photoId);
        if (photo?.url) URL.revokeObjectURL(photo.url);
        return { ...r, photos: r.photos.filter((p) => p.id !== photoId) };
      }),
    );
  };

  const updateLevel2PhotoInRound = (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => {
    setRoundsForLevel("nivel2", (prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        return {
          ...r,
          photos: r.photos.map((p) => {
            if (p.id === photoId) {
              if (updates.url && p.url && updates.url !== p.url)
                URL.revokeObjectURL(p.url);
              return { ...p, ...updates };
            }
            if (updates.isIntruso === true) {
              return { ...p, isIntruso: false };
            }
            return p;
          }),
        };
      }),
    );
  };

  const updateLevel2Round = (roundId: string, updates: Partial<Round>) => {
    setRoundsForLevel("nivel2", (prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, ...updates } : r)),
    );
  };

  const handleLevel2QuickLoad = (roundId: string, matrix: string[][]) => {
    const names = matrix
      .map((row) => row[0]?.trim() ?? "")
      .filter((line) => line !== "")
      .slice(0, 4);

    if (names.length === 0) return;

    setRoundsForLevel("nivel2", (prev) =>
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

  // ── Save / Load ──

  const handleSave = useCallback(async () => {
    const sessionData: SessionData = {
      textRounds: roundsPerLevel.nivel1.map((round) => ({
        description: round.context,
        imagePath: round.photos[0]?.file
          ? `images/${nanoid(4)}_${round.photos[0].file.name}`
          : "",
        answerIndex: Math.max(
          0,
          round.options?.findIndex((o) => o.isIntruso) ?? 0,
        ),
        choices: round.options?.map((o) => o.text) ?? [],
      })),
      photoRounds: roundsPerLevel.nivel2.map((round) => ({
        description: round.context,
        answerIndex: Math.max(
          0,
          round.photos.findIndex((p) => p.isIntruso),
        ),
        choices: round.photos.map((photo) => ({
          label: photo.name || "",
          imagePath: photo.file ? `images/${nanoid(4)}_${photo.file.name}` : "",
        })),
      })),
    };

    const filesToInclude: { name: string; file: File }[] = [];

    roundsPerLevel.nivel1.forEach((round, roundIndex) => {
      const photo = round.photos[0];
      if (photo?.file) {
        const path = sessionData.textRounds[roundIndex].imagePath;
        if (path) {
          filesToInclude.push({ name: path, file: photo.file });
        }
      }
    });

    roundsPerLevel.nivel2.forEach((round, roundIndex) => {
      round.photos.forEach((photo, photoIndex) => {
        if (photo.file) {
          const path =
            sessionData.photoRounds[roundIndex].choices[photoIndex].imagePath;
          if (path) {
            filesToInclude.push({ name: path, file: photo.file });
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
  }, [roundsPerLevel]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file(SESSION_DATA_FILENAME);

      if (!dataFile) {
        alert(
          "El archivo no es un paquete válido de Intruso (falta sessionData.json).",
        );
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as SessionData & {
        rounds?: PhotoRound[];
      };

      const levelsData = {
        nivel1: sessionData.textRounds || [],
        nivel2: sessionData.photoRounds || sessionData.rounds || [],
      };

      const processLevel1 = async (
        levelMeta: TextRound[],
      ): Promise<Round[]> => {
        if (!Array.isArray(levelMeta)) return [];
        return Promise.all(
          levelMeta.map(async (roundMeta) => {
            let imageFile: File | undefined;
            let imageUrl: string | undefined;

            const photoPath = roundMeta.imagePath;

            if (photoPath) {
              const imgEntry = zip.file(photoPath);
              if (imgEntry) {
                const blob = await imgEntry.async("blob");
                const parts = (photoPath.split("/").pop() || photoPath).split(
                  "_",
                );
                const originalName =
                  parts.length > 1 ? parts.slice(1).join("_") : parts[0];
                imageFile = new File([blob], originalName, {
                  type: blob.type || "image/png",
                });
                imageUrl = URL.createObjectURL(blob);
              }
            }

            const normalizedOptions =
              Array.isArray(roundMeta.choices) && roundMeta.choices.length > 0
                ? roundMeta.choices.map((text, idx) => ({
                    text,
                    isIntruso: idx === roundMeta.answerIndex,
                  }))
                : [{ text: "", isIntruso: false }];

            return {
              id: nanoid(),
              context: roundMeta.description || "",
              photos: [
                {
                  id: nanoid(),
                  name: "",
                  isIntruso: false,
                  file: imageFile,
                  url: imageUrl,
                },
              ],
              options: normalizedOptions,
            };
          }),
        );
      };

      const processLevel2 = async (
        levelMeta: PhotoRound[],
      ): Promise<Round[]> => {
        if (!Array.isArray(levelMeta)) return [];
        return Promise.all(
          levelMeta.map(async (roundMeta) => {
            const photos = await Promise.all(
              (roundMeta.choices || []).map(async (pMeta, idx) => {
                let imageFile: File | undefined;
                let imageUrl: string | undefined;
                const path = pMeta.imagePath;
                if (path) {
                  const imgEntry = zip.file(path);
                  if (imgEntry) {
                    const blob = await imgEntry.async("blob");
                    const parts = (path.split("/").pop() || path).split("_");
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
                  name: pMeta.label || "",
                  isIntruso: idx === roundMeta.answerIndex,
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );

            return {
              id: nanoid(),
              context: roundMeta.description || "",
              photos,
            };
          }),
        );
      };

      const [nivel1, nivel2] = await Promise.all([
        processLevel1(levelsData.nivel1),
        processLevel2(levelsData.nivel2),
      ]);

      setRoundsPerLevel({
        nivel1: nivel1.length > 0 ? nivel1 : [createEmptyLevel1Round()],
        nivel2: nivel2.length > 0 ? nivel2 : [createEmptyLevel2Round()],
      });
    } catch {
      alert("Error al importar los datos.");
    }
  }, []);

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Intruso",
      icon: <VenetianMask className="h-3 w-3" />,
      format: "zip",
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader, handleSave, handleLoad]);

  return (
    <main className="flex-1 overflow-hidden">
      <LevelTabs
        levels={[
          {
            name: "Nivel 1",
            icon: Layers,
            component: (
              <Level1View
                rounds={roundsPerLevel.nivel1}
                onAddRound={addLevel1Round}
                onRemoveRound={removeLevel1Round}
                onUpdatePhotoInRound={updateLevel1PhotoInRound}
                onUpdateRound={updateLevel1Round}
                onQuickLoad={handleLevel1QuickLoad}
              />
            ),
          },
          {
            name: "Nivel 2",
            icon: Layers,
            component: (
              <Level2View
                rounds={roundsPerLevel.nivel2}
                onAddRound={addLevel2Round}
                onRemoveRound={removeLevel2Round}
                onAddPhotoToRound={addPhotoToRound}
                onRemovePhotoFromRound={removePhotoFromRound}
                onUpdatePhotoInRound={updateLevel2PhotoInRound}
                onUpdateRound={updateLevel2Round}
                onQuickLoad={handleLevel2QuickLoad}
              />
            ),
          },
        ]}
      />
    </main>
  );
}
