"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useImagePicker } from "@/hooks/use-image-picker";

interface ImagePickerProps {
  value?: string;
  onChange: (file: File, url: string) => void;
  aspectRatio?: "square" | "portrait" | "landscape";
  placeholder?: string;
}

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-video",
};

export function ImagePicker({
  value,
  onChange,
  aspectRatio = "square",
  placeholder = "Foto",
}: ImagePickerProps) {
  const {
    previewUrl,
    fileInputRef,
    triggerUpload,
    handleFileChange,
    setPreviewUrl,
  } = useImagePicker({
    onImageSelect: onChange,
    initialPreview: value,
    skipCleanupOnUnmount: true,
  });

  useEffect(() => {
    if (value) setPreviewUrl(value);
  }, [value, setPreviewUrl]);

  return (
    <div
      className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden rounded-lg bg-muted/20 border border-dashed border-border hover:border-brand/50 transition-colors cursor-pointer group`}
      onClick={triggerUpload}
    >
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="preview"
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 border border-dashed border-border">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-3xs uppercase tracking-wider font-bold">
            {placeholder}
          </span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
