"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/shared/ImagePicker";

interface AlbumCardProps {
  id: string;
  name?: string;
  imageUrl?: string;
  onImageChange: (file: File, url: string) => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}

export function AlbumCard({
  name,
  imageUrl,
  onImageChange,
  onNameChange,
  onRemove,
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

        <div className="absolute bottom-2 right-2 flex items-center justify-end opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
          <Button
            size="icon"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="h-6 w-6 bg-destructive/90 hover:bg-destructive shadow-sm"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="px-0.5 pb-0.5">
        <input
          type="text"
          value={name || ""}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="nombre..."
          className="w-full h-8 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-hidden focus:ring-1 focus:ring-brand/40 transition-all"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
