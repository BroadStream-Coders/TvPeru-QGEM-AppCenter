"use client";

import { Trash2, AlertCircle } from "lucide-react";
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
      className={`group relative aspect-square w-full overflow-hidden rounded-xl border-2 transition-all duration-300 ${
        isImpostor
          ? "border-brand bg-brand/5 shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)]"
          : "border-border bg-muted/20 hover:border-brand/30"
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 border border-dashed border-current">
            <span className="text-xl">+</span>
          </div>
          <span className="text-2xs uppercase tracking-wider font-semibold">
            Agregar Foto
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
          className={`h-7 px-2 text-2xs font-bold uppercase transition-all ${
            isImpostor
              ? "bg-brand text-brand-foreground"
              : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-brand hover:text-white"
          }`}
        >
          {isImpostor ? "Impostor" : "Candidato"}
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="h-7 w-7 bg-red-500/80 backdrop-blur-sm hover:bg-red-600 shadow-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
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
