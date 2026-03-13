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

interface Option {
  text: string;
  isImpostor: boolean;
}

interface ImpostorRound {
  id: string;
  context: string;
  photos: Photo[];
  options?: Option[];
}

interface PhotoMetadata {
  name?: string;
  path: string;
  isImpostor: boolean;
}

interface RoundMetadata {
  context: string;
  photos: PhotoMetadata[];
  options?: Option[];
}

interface SessionData {
  nivel_1: RoundMetadata[];
  nivel_2: RoundMetadata[];
}

type LevelId = "nivel1" | "nivel2";

const createEmptyPhoto = (): Photo => ({
  id: nanoid(),
  name: "",
  isImpostor: false,
});

const createEmptyLevel1Round = (): ImpostorRound => ({
  id: nanoid(),
  context: "",
  photos: [createEmptyPhoto()],
  options: [{ text: "", isImpostor: false }],
});

const createEmptyLevel2Round = (): ImpostorRound => ({
  id: nanoid(),
  context: "",
  photos: Array(4).fill(null).map(createEmptyPhoto),
});

export default function ImpostorPage() {
  const [activeTab, setActiveTab] = useState<LevelId>("nivel1");
  const [roundsPerLevel, setRoundsPerLevel] = useState<
    Record<LevelId, ImpostorRound[]>
  >({
    nivel1: [createEmptyLevel1Round()],
    nivel2: [createEmptyLevel2Round()],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rounds = roundsPerLevel[activeTab];

  const setRounds = (
    newRounds: ImpostorRound[] | ((prev: ImpostorRound[]) => ImpostorRound[]),
  ) => {
    setRoundsPerLevel((prev) => ({
      ...prev,
      [activeTab]:
        typeof newRounds === "function"
          ? newRounds(prev[activeTab])
          : newRounds,
    }));
  };

  const addRound = (count: number = 1) => {
    const newRounds = Array(count)
      .fill(null)
      .map(() =>
        activeTab === "nivel1"
          ? createEmptyLevel1Round()
          : createEmptyLevel2Round(),
      );
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
        r.id === roundId && r.photos.length < 8
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
    updates: Partial<Photo>,
  ) => {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        return {
          ...r,
          photos: r.photos.map((p) => {
            if (p.id !== photoId) return p;
            if (updates.url && p.url && updates.url !== p.url)
              URL.revokeObjectURL(p.url);
            return { ...p, ...updates };
          }),
        };
      }),
    );
  };

  const updateRound = (roundId: string, updates: Partial<ImpostorRound>) => {
    setRounds((prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, ...updates } : r)),
    );
  };

  const handleSave = async () => {
    const prepareMetadata = (levelRounds: ImpostorRound[]): RoundMetadata[] =>
      levelRounds.map((round) => ({
        context: round.context,
        options: round.options,
        photos: round.photos.map((photo) => ({
          name: photo.name,
          path: photo.file ? `images/${nanoid(4)}_${photo.file.name}` : "",
          isImpostor: photo.isImpostor,
        })),
      }));

    const sessionData: SessionData = {
      nivel_1: prepareMetadata(roundsPerLevel.nivel1),
      nivel_2: prepareMetadata(roundsPerLevel.nivel2),
    };

    const filesToInclude: { name: string; file: File }[] = [];

    (["nivel1", "nivel2"] as LevelId[]).forEach((lvl) => {
      const levelRounds = roundsPerLevel[lvl];
      const metadataRounds =
        lvl === "nivel1" ? sessionData.nivel_1 : sessionData.nivel_2;
      levelRounds.forEach((round, roundIndex) => {
        round.photos.forEach((photo, photoIndex) => {
          if (photo.file) {
            filesToInclude.push({
              name: metadataRounds[roundIndex].photos[photoIndex].path,
              file: photo.file,
            });
          }
        });
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
          "El archivo no es un paquete válido de Impostor (falta sessionData.json).",
        );
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as SessionData & {
        rounds?: RoundMetadata[];
      };

      const levelsData = {
        nivel1: sessionData.nivel_1 || [],
        nivel2: sessionData.nivel_2 || sessionData.rounds || [],
      };

      const processLevel = async (
        levelMeta: RoundMetadata[],
      ): Promise<ImpostorRound[]> => {
        if (!Array.isArray(levelMeta)) return [];
        return Promise.all(
          levelMeta.map(async (roundMeta) => {
            const photos = await Promise.all(
              roundMeta.photos.map(async (pMeta) => {
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
                  isImpostor: pMeta.isImpostor,
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );

            const normalizedOptions =
              Array.isArray(roundMeta.options) && roundMeta.options.length > 0
                ? typeof roundMeta.options[0] === "string"
                  ? (roundMeta.options as unknown as string[]).map((text) => ({
                      text,
                      isImpostor: false,
                    }))
                  : roundMeta.options
                : [{ text: "", isImpostor: false }];

            return {
              id: nanoid(),
              context: roundMeta.context || "",
              photos,
              options: normalizedOptions,
            };
          }),
        );
      };

      const [nivel1, nivel2] = await Promise.all([
        processLevel(levelsData.nivel1),
        processLevel(levelsData.nivel2),
      ]);

      setRoundsPerLevel({
        nivel1: nivel1.length > 0 ? nivel1 : [createEmptyLevel1Round()],
        nivel2: nivel2.length > 0 ? nivel2 : [createEmptyLevel2Round()],
      });
    } catch {
      alert("Error al importar los datos.");
    }
  };

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10">
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
            onClick={() => fileInputRef.current?.click()}
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
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLoad(file);
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
      </header>

      <div className="flex h-12 shrink-0 items-center border-b border-border bg-muted/20 px-4 gap-1">
        {(["nivel1", "nivel2"] as LevelId[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setActiveTab(lvl)}
            className={cn(
              "flex items-center gap-2 h-8 px-4 rounded-md text-xs font-bold transition-all",
              activeTab === lvl
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            {lvl === "nivel1" ? "Nivel 1" : "Nivel 2"}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-hidden">
        {activeTab === "nivel1" ? (
          <ImpostorLevel1View
            rounds={roundsPerLevel.nivel1}
            onAddRound={addRound}
            onRemoveRound={removeRound}
            onUpdatePhotoInRound={updatePhotoInRound}
            onUpdateRound={updateRound}
          />
        ) : (
          <ImpostorLevel2View
            rounds={roundsPerLevel.nivel2}
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
