"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  ArrowLeft,
  VenetianMask,
  Layers,
} from "lucide-react";
import { ImpostorLevel1View } from "./components/ImpostorLevel1View";
import { ImpostorLevel2View } from "./components/ImpostorLevel2View";
import { nanoid } from "nanoid";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { cn } from "@/lib/utils";

const DEFAULT_FILENAME = "Impostor.zip";
const SESSION_DATA_FILENAME = "sessionData.json";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface ImpostorRound {
  id: string;
  context: string;
  photos: Photo[];
  options?: { text: string; isImpostor: boolean }[]; // Updated for L1
}

interface PhotoMetadata {
  name?: string;
  path: string;
  isImpostor: boolean;
}

interface RoundMetadata {
  context: string;
  photos: PhotoMetadata[];
  options?: { text: string; isImpostor: boolean }[]; // Updated for L1
}

interface SessionData {
  nivel_1: RoundMetadata[];
  nivel_2: RoundMetadata[];
}

type LevelId = "nivel1" | "nivel2";

export default function ImpostorPage() {
  const [activeTab, setActiveTab] = useState<LevelId>("nivel1");
  const [roundsPerLevel, setRoundsPerLevel] = useState<
    Record<LevelId, ImpostorRound[]>
  >({
    nivel1: [
      {
        id: nanoid(),
        context: "",
        photos: [{ id: nanoid(), name: "", isImpostor: false }],
        options: [{ text: "", isImpostor: false }],
      },
    ],
    nivel2: [
      {
        id: nanoid(),
        context: "",
        photos: Array(4)
          .fill(null)
          .map(() => ({ id: nanoid(), name: "", isImpostor: false })),
      },
    ],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rounds = roundsPerLevel[activeTab];

  const setRounds = (newRounds: ImpostorRound[]) => {
    setRoundsPerLevel((prev) => ({
      ...prev,
      [activeTab]: newRounds,
    }));
  };

  const addRound = (count: number = 1) => {
    const newRounds = Array(count)
      .fill(null)
      .map(() => ({
        id: nanoid(),
        context: "",
        photos:
          activeTab === "nivel1"
            ? [{ id: nanoid(), name: "", isImpostor: false }]
            : Array(4)
                .fill(null)
                .map(() => ({ id: nanoid(), name: "", isImpostor: false })),
        options: activeTab === "nivel1" ? [{ text: "", isImpostor: false }] : undefined,
      }));
    setRounds([...rounds, ...newRounds]);
  };

  const removeRound = (roundId: string) => {
    const roundToRemove = rounds.find((r) => r.id === roundId);
    roundToRemove?.photos.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    setRounds(rounds.filter((r) => r.id !== roundId));
  };

  const addPhotoToRound = (roundId: string) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId && r.photos.length < 8) {
          return {
            ...r,
            photos: [
              ...r.photos,
              { id: nanoid(), name: "", isImpostor: false },
            ],
          };
        }
        return r;
      }),
    );
  };

  const removePhotoFromRound = (roundId: string, photoId: string) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          const photoToRemove = r.photos.find((p) => p.id === photoId);
          if (photoToRemove?.url) URL.revokeObjectURL(photoToRemove.url);
          return {
            ...r,
            photos: r.photos.filter((p) => p.id !== photoId),
          };
        }
        return r;
      }),
    );
  };

  const updatePhotoInRound = (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
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
        }
        return r;
      }),
    );
  };

  const updateRound = (roundId: string, updates: Partial<ImpostorRound>) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          return { ...r, ...updates };
        }
        return r;
      }),
    );
  };

  const updateOptionsInRound = (roundId: string, options: { text: string; isImpostor: boolean }[]) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          return { ...r, options };
        }
        return r;
      }),
    );
  };

  // Persistence logic
  const handleSave = async () => {
    console.log("[Impostor:Persistence] Starting ZIP export...");
    const prepareMetadata = (levelRounds: ImpostorRound[]) => {
      return levelRounds.map((round) => {
        const photosMetadata: PhotoMetadata[] = round.photos.map((photo) => {
          let imagePath = "";
          if (photo.file) {
            const shortId = nanoid(4);
            imagePath = `images/${shortId}_${photo.file.name}`;
          }
          return {
            name: photo.name,
            path: imagePath,
            isImpostor: photo.isImpostor,
          };
        });

        return {
          context: round.context,
          photos: photosMetadata,
          options: round.options,
        };
      });
    };

    const sessionData: SessionData = {
      nivel_1: prepareMetadata(roundsPerLevel.nivel1),
      nivel_2: prepareMetadata(roundsPerLevel.nivel2),
    };

    console.log("[Impostor:Persistence] Metadata prepared:", sessionData);

    const filesToInclude: { name: string; file: File }[] = [];

    // Process both levels for file inclusion
    (["nivel1", "nivel2"] as LevelId[]).forEach((lvl) => {
      const levelRounds = roundsPerLevel[lvl];
      const metadataRounds =
        lvl === "nivel1" ? sessionData.nivel_1 : sessionData.nivel_2;

      levelRounds.forEach((round, roundIndex) => {
        const roundMetadata = metadataRounds[roundIndex];
        round.photos.forEach((photo, photoIndex) => {
          if (photo.file) {
            filesToInclude.push({
              name: roundMetadata.photos[photoIndex].path,
              file: photo.file,
            });
          }
        });
      });
    });

    console.log(
      `[Impostor:Persistence] Including ${filesToInclude.length} image files.`,
    );

    try {
      await saveAsZip(
        DEFAULT_FILENAME,
        sessionData,
        filesToInclude,
        SESSION_DATA_FILENAME,
      );
      console.log("[Impostor:Persistence] Export successful.");
    } catch (error) {
      console.error("[Impostor:Persistence] Export error:", error);
      alert("Error al exportar los datos.");
    }
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(
      `[Impostor:Persistence] Importing ZIP: ${file.name} (${file.size} bytes)`,
    );

    try {
      const zip = await loadZipFile(file);
      // Try sessionData.json first, then data.json for compatibility
      const dataFile = zip.file(SESSION_DATA_FILENAME) || zip.file("data.json");

      if (!dataFile) {
        console.error(
          "[Impostor:Persistence] Invalid package: missing sessionData.json",
        );
        alert(
          "El archivo no es un paquete válido de Impostor (falta sessionData.json).",
        );
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as any;

      // Handle legacy structure or new levels structure
      const levelsData = {
        nivel1:
          sessionData.nivel_1 ||
          (sessionData.levels ? sessionData.levels.nivel1 : []),
        nivel2:
          sessionData.nivel_2 ||
          (sessionData.levels ? sessionData.levels.nivel2 : sessionData.rounds) ||
          [],
      };

      const processLevel = async (levelMeta: RoundMetadata[]) => {
        if (!levelMeta || !Array.isArray(levelMeta)) return [];
        return await Promise.all(
          levelMeta.map(async (roundMeta, roundIdx) => {
            const photos = await Promise.all(
              roundMeta.photos.map(async (pMeta) => {
                let imageFile: File | undefined = undefined;
                let imageUrl: string | undefined = undefined;

                if (pMeta.path) {
                  const imgEntry = zip.file(pMeta.path);
                  if (imgEntry) {
                    const blob = await imgEntry.async("blob");
                    const fileNameOnly = pMeta.path.split("/").pop();
                    const parts = (fileNameOnly || pMeta.path).split("_");
                    const originalName =
                      parts.length > 1
                        ? parts.slice(1).join("_")
                        : fileNameOnly || "image.png";

                    imageFile = new File([blob], originalName, {
                      type: blob.type || "image/png",
                    });
                    imageUrl = URL.createObjectURL(blob);
                  }
                }

                return {
                  id: nanoid(),
                  name: pMeta.name || "",
                  isImpostor: pMeta.isImpostor,
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );

            return {
              id: nanoid(),
              context: roundMeta.context || "",
              photos,
              options: roundMeta.options,
            };
          }),
        );
      };

      const nivel1 = await processLevel(levelsData.nivel1);
      const nivel2 = await processLevel(levelsData.nivel2);

      setRoundsPerLevel({
        nivel1: nivel1.length > 0 ? nivel1 : roundsPerLevel.nivel1,
        nivel2:
          nivel2.length > 0
            ? nivel2
            : nivel1.length === 0
              ? roundsPerLevel.nivel2
              : [],
      });
    } catch (error) {
      console.error("[Impostor:Persistence] Import error:", error);
      alert("Error al importar los datos.");
    }
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => {
    fileInputRef.current?.click();
  };

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
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand ring-1 ring-brand/10">
              <VenetianMask className="h-3 w-3" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Impostor
            </span>
          </div>
          <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {rounds.length} ronda{rounds.length !== 1 ? "s" : ""}
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
            <span className="hidden sm:inline">Exportar ZIP</span>
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

      {/* Tabs Switcher — h-12 = 48px */}
      <div className="flex h-12 shrink-0 items-center border-b border-border bg-muted/20 px-4 gap-1">
        <button
          onClick={() => setActiveTab("nivel1")}
          className={cn(
            "flex items-center gap-2 h-8 px-4 rounded-md text-xs font-bold transition-all",
            activeTab === "nivel1"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/50",
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          Nivel 1
        </button>
        <button
          onClick={() => setActiveTab("nivel2")}
          className={cn(
            "flex items-center gap-2 h-8 px-4 rounded-md text-xs font-bold transition-all",
            activeTab === "nivel2"
              ? "bg-brand text-brand-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/50",
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          Nivel 2
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "nivel1" ? (
          <ImpostorLevel1View
            rounds={rounds}
            onAddRound={addRound}
            onRemoveRound={removeRound}
            onUpdatePhotoInRound={updatePhotoInRound}
            onUpdateRound={updateRound}
          />
        ) : (
          <ImpostorLevel2View
            rounds={rounds}
            onAddRound={addRound}
            onRemoveRound={removeRound}
            onAddPhotoToRound={addPhotoToRound}
            onRemovePhotoFromRound={removePhotoFromRound}
            onUpdatePhotoInRound={updatePhotoInRound}
            onUpdateRound={updateRound}
          />
        )}
      </main>
    </>
  );
}
