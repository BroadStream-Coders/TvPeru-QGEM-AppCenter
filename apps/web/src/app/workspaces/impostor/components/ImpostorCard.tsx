"use client";

import { Trash2, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useImagePicker } from "@/hooks/use-image-picker";
import { useEffect } from "react";

interface ImpostorCardProps {
  id: string;
  imageUrl?: string;
  isImpostor: boolean;
  onImageChange: (file: File, url: string) => void;
  onToggleImpostor: () => void;
  onRemove: () => void;
}

export function ImpostorCard({
  imageUrl,
  isImpostor,
  onImageChange,
  onToggleImpostor,
  onRemove,
}: ImpostorCardProps) {
  const {
    previewUrl,
    fileInputRef,
    triggerUpload,
    handleFileChange,
    setPreviewUrl,
  } = useImagePicker({
    onImageSelect: onImageChange,
    initialPreview: imageUrl,
  });

  // Sync with external imageUrl updates (e.g. from loading state)
  useEffect(() => {
    if (imageUrl) setPreviewUrl(imageUrl);
  }, [imageUrl, setPreviewUrl]);

  return (
    <div
      className={`group relative aspect-square w-full overflow-hidden rounded-lg border transition-all duration-200 ${
        isImpostor
          ? "border-brand bg-brand/5 ring-1 ring-brand/20"
          : "border-border bg-muted/20 hover:border-brand/40"
      }`}
    >
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Impostor candidate"
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <button
          onClick={triggerUpload}
          className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 border border-dashed border-border">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-3xs uppercase tracking-wider font-bold">
            Foto
          </span>
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
        <Button
          size="sm"
          variant={isImpostor ? "default" : "secondary"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleImpostor();
          }}
          className={`h-6 px-1.5 text-3xs font-bold uppercase transition-all ${
            isImpostor
              ? "bg-brand text-brand-foreground hover:brightness-110"
              : "bg-background/80 text-foreground hover:bg-brand hover:text-brand-foreground"
          }`}
        >
          {isImpostor ? "Impostor" : "Inocente"}
        </Button>

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

      {isImpostor && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-lg animate-pulse">
          <AlertCircle className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}
