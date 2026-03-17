"use client";

import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/shared/ImagePicker";

interface AlbumCardProps {
  id: string;
  name?: string;
  imageUrl?: string;
  isCroma?: boolean;
  onImageChange: (file: File, url: string) => void;
  onNameChange: (name: string) => void;
  onToggleCroma: () => void;
}

export function AlbumCard({
  name,
  imageUrl,
  isCroma,
  onImageChange,
  onNameChange,
  onToggleCroma,
}: AlbumCardProps) {
  return (
    <div className="group flex flex-col gap-2 rounded-xl border p-1.5 transition-all duration-200 border-border bg-card hover:border-brand/40 hover:shadow-xs">
      <div className="relative w-full">
        <ImagePicker
          value={imageUrl}
          onChange={onImageChange}
          aspectRatio="square"
          placeholder="Foto"
        />

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between transition-all duration-300 pointer-events-auto">
          <Button
            size="sm"
            variant={isCroma ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCroma();
            }}
            className={`h-6 px-2 text-3xs font-bold uppercase transition-all shadow-sm w-full ${
              isCroma
                ? "bg-brand text-brand-foreground hover:brightness-110 border-transparent"
                : "bg-background/95 text-muted-foreground hover:bg-brand/10 hover:text-brand border-border"
            }`}
          >
            {isCroma ? "✨ Croma" : "Marcar Croma"}
          </Button>
        </div>
      </div>

      <div className="px-0.5 pb-0.5">
        <textarea
          value={name || ""}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Pregunta o descripción..."
          className="w-full h-14 resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-hidden focus:ring-1 focus:ring-brand/40 transition-all leading-relaxed"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
