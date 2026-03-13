"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { ImpostorColumn } from "./ImpostorColumn";

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
}

interface ImpostorLevel2ViewProps {
  rounds: ImpostorRound[];
  onAddRound: (count?: number) => void;
  onRemoveRound: (id: string) => void;
  onAddPhotoToRound: (roundId: string) => void;
  onRemovePhotoFromRound: (roundId: string, photoId: string) => void;
  onUpdatePhotoInRound: (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => void;
  onUpdateRound: (roundId: string, updates: Partial<ImpostorRound>) => void;
}

export function ImpostorLevel2View({
  rounds,
  onAddRound,
  onRemoveRound,
  onAddPhotoToRound,
  onRemovePhotoFromRound,
  onUpdatePhotoInRound,
  onUpdateRound,
}: ImpostorLevel2ViewProps) {
  return (
    <ScrollArea className="w-full h-full">
      <div
        className="flex min-w-max gap-6 px-6 py-6"
        style={{ height: "calc(100vh - 48px - 48px - 32px)" }} // Adjusted to leave margin for vertical scroll
      >
        {rounds.map((round, roundIndex) => (
          <ImpostorColumn
            key={round.id}
            index={roundIndex + 1}
            photos={round.photos}
            context={round.context}
            onAddPhoto={() => onAddPhotoToRound(round.id)}
            onRemovePhoto={(photoId) =>
              onRemovePhotoFromRound(round.id, photoId)
            }
            onUpdatePhoto={(photoId, updates) =>
              onUpdatePhotoInRound(round.id, photoId, updates)
            }
            onUpdateRound={(updates) => onUpdateRound(round.id, updates)}
            onRemoveColumn={() => onRemoveRound(round.id)}
          />
        ))}

        {/* Add round section */}
        <div className="h-full w-[200px] shrink-0 flex flex-col gap-4">
          <button
            onClick={() => onAddRound(1)}
            className="group flex h-1/2 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-current transition-all group-hover:scale-110 group-hover:bg-brand group-hover:text-brand-foreground group-hover:border-transparent">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold uppercase tracking-wide">
                Añadir Ronda
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              const count = prompt("¿Cuántas rondas deseas agregar?", "5");
              if (count && !isNaN(Number(count))) {
                onAddRound(Number(count));
              }
            }}
            className="group flex h-[40%] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-current opacity-60 group-hover:opacity-100 transition-all">
              <Plus className="h-4 w-4" />
            </div>
            <div className="text-center">
              <span className="block text-2xs font-bold uppercase tracking-wide">
                Multi-Ronda
              </span>
            </div>
          </button>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
