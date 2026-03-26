"use client";

import { ImagePicker } from "@/components/shared/ImagePicker";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface ExamenLevel5RowData {
  id: string;
  file?: File;
  url?: string;
}

interface ExamenLevel5RowProps {
  index: number;
  data: ExamenLevel5RowData;
  onChange: (updates: Partial<ExamenLevel5RowData>) => void;
  onRemove: () => void;
}

export function ExamenLevel5Row({
  index,
  data,
  onChange,
  onRemove,
}: ExamenLevel5RowProps) {
  return (
    <div className="group/row flex items-start gap-3 rounded-lg border border-border/50 bg-muted/10 p-3 transition-colors hover:border-border/80">
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-2xs font-bold text-brand">
        {index + 1}
      </div>

      <div className="flex-1 space-y-4">
        <div className="w-full">
          <ImagePicker
            aspectRatio="landscape"
            value={data.url}
            onChange={(file, url) => onChange({ file, url })}
            placeholder="Subir Imagen"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="mt-1 h-7 w-7 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover/row:opacity-100 sm:opacity-0 transition-all"
        title="Eliminar pregunta"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
