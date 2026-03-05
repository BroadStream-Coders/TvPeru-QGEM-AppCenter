"use client";

import { ImpostorCard } from "./ImpostorCard";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Users, LayoutGrid } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Photo {
  id: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface ImpostorColumnProps {
  index: number;
  photos: Photo[];
  onAddPhoto: () => void;
  onRemovePhoto: (id: string) => void;
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => void;
  onRemoveColumn: () => void;
}

export function ImpostorColumn({
  index,
  photos,
  onAddPhoto,
  onRemovePhoto,
  onUpdatePhoto,
  onRemoveColumn,
}: ImpostorColumnProps) {
  const impostorCount = photos.filter((p) => p.isImpostor).length;

  return (
    <Card className="flex flex-col h-full w-[360px] shrink-0 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-xl ring-1 ring-white/10 transition-all hover:shadow-2xl hover:bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground shadow-lg shadow-brand/20">
            {index}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Ronda {index}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-2xs font-medium text-muted-foreground uppercase tracking-tight">
                <LayoutGrid className="h-2.5 w-2.5" />
                {photos.length} Fotos
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span
                className={`flex items-center gap-1 text-2xs font-bold uppercase tracking-tight ${impostorCount > 0 ? "text-brand" : "text-muted-foreground"}`}
              >
                <Users className="h-2.5 w-2.5" />
                {impostorCount} Impostor{impostorCount !== 1 ? "es" : ""}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveColumn}
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0 px-5 py-0 overflow-hidden">
        <ScrollArea className="flex-1 min-h-0 py-5">
          <div className="grid grid-cols-2 gap-4 pb-4">
            {photos.map((photo, index) => (
              <ImpostorCard
                key={index}
                id={photo.id}
                imageUrl={photo.url}
                isImpostor={photo.isImpostor}
                onImageChange={(file, url) =>
                  onUpdatePhoto(photo.id, { file, url })
                }
                onToggleImpostor={() =>
                  onUpdatePhoto(photo.id, { isImpostor: !photo.isImpostor })
                }
                onRemove={() => onRemovePhoto(photo.id)}
              />
            ))}

            {photos.length < 8 && (
              <button
                onClick={onAddPhoto}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
              >
                <Plus className="h-6 w-6" />
                <span className="text-2xs font-bold uppercase tracking-wider">
                  Agregar Foto
                </span>
              </button>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="py-4 border-t border-border/50">
          <div className="flex items-center justify-between px-1">
            <span className="text-2xs font-medium text-muted-foreground uppercase">
              Capacidad: {photos.length}/8
            </span>
            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${photos.length >= 4 ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${(photos.length / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
