"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/shared/ImagePicker";

interface ImpostorCardProps {
  id: string;
  name?: string;
  imageUrl?: string;
  isImpostor: boolean;
  onImageChange: (file: File, url: string) => void;
  onNameChange: (name: string) => void;
  onToggleImpostor: () => void;
  onRemove: () => void;
  hideName?: boolean;
  variant?: "impostor" | "simple";
}

export function ImpostorCard({
  name,
  imageUrl,
  isImpostor,
  onImageChange,
  onNameChange,
  onToggleImpostor,
  onRemove,
  hideName = false,
  variant = "impostor",
}: ImpostorCardProps) {
  return (
    <div
      className={`group flex flex-col gap-2 rounded-xl border p-1.5 transition-all duration-200 ${
        isImpostor
          ? "border-brand bg-brand/5 ring-1 ring-brand/20 shadow-sm"
          : "border-border bg-card hover:border-brand/40 hover:shadow-xs"
      }`}
    >
      <div className="relative w-full">
        <ImagePicker
          value={imageUrl}
          onChange={onImageChange}
          aspectRatio="square"
          placeholder="Foto"
        />

        {variant === "impostor" && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between transition-all duration-300 pointer-events-auto">
            <Button
              size="sm"
              variant={isImpostor ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                // Only toggle if it's currently NOT the impostor.
                // We don't want to un-toggle leaving the round with NO impostor at all.
                if (!isImpostor) onToggleImpostor();
              }}
              className={`h-6 px-2 text-3xs font-bold uppercase transition-all shadow-sm w-full ${
                isImpostor
                  ? "bg-brand text-brand-foreground hover:brightness-110 border-transparent"
                  : "bg-background/95 text-muted-foreground hover:bg-brand/10 hover:text-brand border-border"
              }`}
            >
              {isImpostor ? "🎯 Es el Intruso" : "Marcar Intruso"}
            </Button>
          </div>
        )}

        {/* Delete Button (moved to top right) */}
        {variant === "impostor" && (
          <div className="absolute top-2 right-2 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
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
        )}
      </div>

      {!hideName && (
        <div className="px-0.5 pb-0.5">
          <input
            type="text"
            value={name || ""}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="nombre..."
            className={`w-full h-8 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-hidden focus:ring-1 focus:ring-brand/40 transition-all ${
              isImpostor ? "border-brand/30" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
