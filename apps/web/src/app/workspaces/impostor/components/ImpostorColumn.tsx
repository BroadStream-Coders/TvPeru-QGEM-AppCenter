"use client";

import { ImpostorCard } from "./ImpostorCard";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Users, LayoutGrid } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface ImpostorColumnProps {
  index: number;
  photos: Photo[];
  context: string;
  onAddPhoto: () => void;
  onRemovePhoto: (id: string) => void;
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => void;
  onUpdateRound: (updates: Partial<{ context: string }>) => void;
  onRemoveColumn: () => void;
}

export function ImpostorColumn({
  index,
  photos,
  context,
  onAddPhoto,
  onRemovePhoto,
  onUpdatePhoto,
  onUpdateRound,
  onRemoveColumn,
}: ImpostorColumnProps) {
  const impostorCount = photos.filter((p) => p.isImpostor).length;

  return (
    <Card className="flex flex-col h-full w-[320px] shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand/20 text-brand text-xs font-bold ring-1 ring-brand/10">
            {index}
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">Ronda {index}</h3>
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
          className="h-7 w-7 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <div className="px-4 py-3 border-b border-border/50 bg-muted/10">
        <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
          Contexto de la Ronda
        </label>
        <textarea
          value={context}
          onChange={(e) => onUpdateRound({ context: e.target.value })}
          placeholder="Escribe el contexto para esta ronda (ej. 'La gran estafa')..."
          className="w-full h-14 resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-brand/40 transition-all leading-relaxed"
        />
      </div>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-0 overflow-hidden">
        <ScrollArea className="flex-1 min-h-0 py-4">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {photos.map((photo) => (
              <ImpostorCard
                key={photo.id}
                id={photo.id}
                name={photo.name}
                imageUrl={photo.url}
                isImpostor={photo.isImpostor}
                onImageChange={(file, url) =>
                  onUpdatePhoto(photo.id, { file, url })
                }
                onNameChange={(name) => onUpdatePhoto(photo.id, { name })}
                onToggleImpostor={() =>
                  onUpdatePhoto(photo.id, { isImpostor: !photo.isImpostor })
                }
                onRemove={() => onRemovePhoto(photo.id)}
              />
            ))}

            {photos.length < 8 && (
              <button
                onClick={onAddPhoto}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
              >
                <Plus className="h-5 w-5" />
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
