"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  Upload,
  ArrowLeft,
  Layers,
  Sparkles,
} from "lucide-react";
import { ImpostorColumn } from "./components/ImpostorColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { nanoid } from "nanoid";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";

const DEFAULT_FILENAME = "Impostor.zip";
const SESSION_DATA_FILENAME = "sessionData.json";

interface Photo {
  id: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface ImpostorRound {
  id: string;
  photos: Photo[];
}

interface PhotoMetadata {
  path: string;
  isImpostor: boolean;
}

interface RoundMetadata {
  photos: PhotoMetadata[];
}

interface SessionData {
  rounds: RoundMetadata[];
}

export default function ImpostorPage() {
  const [rounds, setRounds] = useState<ImpostorRound[]>([
    {
      id: nanoid(),
      photos: Array(4)
        .fill(null)
        .map(() => ({ id: nanoid(), isImpostor: false })),
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRound = (count: number = 1) => {
    const newRounds = Array(count)
      .fill(null)
      .map(() => ({
        id: nanoid(),
        photos: Array(4)
          .fill(null)
          .map(() => ({ id: nanoid(), isImpostor: false })),
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
            photos: [...r.photos, { id: nanoid(), isImpostor: false }],
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

  // Persistence logic
  const handleSave = async () => {
    console.log("[Impostor:Persistence] Starting ZIP export...");
    const metadataRounds: RoundMetadata[] = rounds.map((round) => {
      const photosMetadata: PhotoMetadata[] = round.photos.map((photo) => {
        let imagePath = "";
        if (photo.file) {
          const shortId = nanoid(4);
          imagePath = `images/${shortId}_${photo.file.name}`;
        }
        return {
          path: imagePath,
          isImpostor: photo.isImpostor,
        };
      });

      return {
        photos: photosMetadata,
      };
    });

    const sessionData: SessionData = {
      rounds: metadataRounds,
    };

    console.log("[Impostor:Persistence] Metadata prepared:", sessionData);

    const filesToInclude: { name: string; file: File }[] = [];
    rounds.forEach((round, roundIndex) => {
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
      const sessionData = JSON.parse(content) as SessionData;

      if (sessionData.rounds && Array.isArray(sessionData.rounds)) {
        const newRounds = await Promise.all(
          sessionData.rounds.map(async (roundMeta, roundIdx) => {
            console.log(`[Impostor] Restoring Round ${roundIdx + 1}...`);

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
                  isImpostor: pMeta.isImpostor,
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );

            return {
              id: nanoid(),
              photos,
            };
          }),
        );
        setRounds(newRounds);
      }
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
    <div className="flex flex-col h-screen bg-[#0a0a0b] text-foreground overflow-hidden">
      {/* Header — Glassmorphism Effect */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 z-20 shadow-2xl">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-white/5 hover:text-white active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Volver
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand via-brand/80 to-purple-600 text-white shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]">
              <Sparkles className="h-5 w-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest text-white">
                IMPOSTOR
              </h1>
              <p className="text-2xs font-medium text-muted-foreground uppercase tracking-tight">
                Colector de Rondas
              </p>
            </div>
          </div>
          <div className="ml-2 flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
            <Layers className="h-3 w-3 text-brand" />
            <span className="text-2xs font-bold text-white uppercase tracking-tighter">
              {rounds.length} Ronda{rounds.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerLoad}
            className="h-9 gap-2 text-xs font-bold uppercase tracking-tight text-muted-foreground hover:bg-white/5 hover:text-white"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Cargar</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-9 gap-2 bg-linear-to-r from-brand to-purple-600 hover:brightness-125 active:scale-[0.97] text-white text-xs font-black uppercase tracking-tight px-5 shadow-lg shadow-brand/20 transition-all"
          >
            <Download className="h-4 w-4" />
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

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(var(--brand-rgb),0.08),transparent_50%)]">
        <ScrollArea className="w-full h-full">
          <div
            className="flex min-w-max gap-8 px-8 py-8"
            style={{ height: "calc(100vh - 64px)" }}
          >
            {rounds.map((round, roundIndex) => (
              <ImpostorColumn
                key={roundIndex}
                index={roundIndex + 1}
                photos={round.photos}
                onAddPhoto={() => addPhotoToRound(round.id)}
                onRemovePhoto={(photoId) =>
                  removePhotoFromRound(round.id, photoId)
                }
                onUpdatePhoto={(photoId, updates) =>
                  updatePhotoInRound(round.id, photoId, updates)
                }
                onRemoveColumn={() => removeRound(round.id)}
              />
            ))}

            {/* Add round section */}
            <div className="h-full w-[240px] shrink-0 flex flex-col gap-4">
              <button
                onClick={() => addRound(1)}
                className="group flex h-1/2 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/2 text-muted-foreground transition-all hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-current transition-all group-hover:scale-110 group-hover:bg-brand group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-brand/20">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-black uppercase tracking-widest">
                    Añadir Ronda
                  </span>
                  <span className="text-2xs font-medium opacity-60">
                    Nueva partida limpia
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  const count = prompt("¿Cuántas rondas deseas agregar?", "5");
                  if (count && !isNaN(Number(count))) {
                    addRound(Number(count));
                  }
                }}
                className="group flex h-[40%] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/2 text-muted-foreground transition-all hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-purple-400"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-current opacity-60 group-hover:opacity-100 transition-all">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <span className="block text-caption font-black uppercase tracking-widest">
                    Multi-Ronda
                  </span>
                  <span className="text-3xs font-medium opacity-60">
                    Agregar en lote
                  </span>
                </div>
              </button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5 bg-white/5" />
        </ScrollArea>
      </main>

      <style jsx global>{`
        :root {
          --brand-rgb: 59, 130, 246; /* Blue-500 equivalent */
        }
      `}</style>
    </div>
  );
}
