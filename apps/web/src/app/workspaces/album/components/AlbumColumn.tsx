"use client";

import { AlbumCard } from "./AlbumCard";
import { Button } from "@/components/ui/button";
import { Trash2, LayoutGrid } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageSlot } from "@/types";

interface AlbumColumnProps {
  index: number;
  photos: ImageSlot[];
  context: string;
  onUpdatePhoto: (id: string, updates: Partial<ImageSlot>) => void;
  onUpdateRound: (updates: Partial<{ context: string }>) => void;
  onRemoveColumn: () => void;
}

export function AlbumColumn({
  index,
  photos,
  context,
  onUpdatePhoto,
  onUpdateRound,
  onRemoveColumn,
}: AlbumColumnProps) {
  return (
    <Card className="flex flex-col h-full w-[320px] shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand/20 text-brand text-xs font-bold ring-1 ring-brand/10">
            {index}
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Columna {index}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-2xs font-medium text-muted-foreground uppercase tracking-tight">
                <LayoutGrid className="h-2.5 w-2.5" />
                {photos.length} Fotos
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
          Título de la Columna
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => onUpdateRound({ context: e.target.value })}
          placeholder="Escribe el título (ej. 'Miguel Grau')..."
          className="w-full h-8 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-brand/40 transition-all"
        />
      </div>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-0 overflow-hidden">
        <ScrollArea className="flex-1 min-h-0 py-4">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {photos.map((photo) => (
              <AlbumCard
                key={photo.id}
                id={photo.id}
                name={photo.name}
                imageUrl={photo.url}
                isCroma={photo.isCroma}
                onImageChange={(file, url) =>
                  onUpdatePhoto(photo.id, { file, url })
                }
                onNameChange={(name) => onUpdatePhoto(photo.id, { name })}
                onToggleCroma={() =>
                  onUpdatePhoto(photo.id, { isCroma: !photo.isCroma })
                }
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
