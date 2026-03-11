"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface RedactorRowProps {
  index: number;
  original: string;
  corrected: string;
  onOriginalChange: (value: string) => void;
  onCorrectedChange: (value: string) => void;
  onRemove: () => void;
}

export function RedactorRow({
  index,
  original,
  corrected,
  onOriginalChange,
  onCorrectedChange,
  onRemove,
}: RedactorRowProps) {
  return (
    <div className="flex items-start gap-2 group min-h-[40px]">
      <div className="flex h-9 w-6 shrink-0 items-center justify-center rounded text-2xs font-mono text-muted-foreground/50 select-none pt-2.5">
        {index + 1}
      </div>

      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Incorrect version (Red) */}
        <div className="relative flex-1 min-w-0">
          <Textarea
            value={original}
            onChange={(e) => onOriginalChange(e.target.value)}
            placeholder="Frase incorrecta..."
            rows={2}
            className="min-h-[60px] resize-none rounded-lg bg-destructive/5 border-destructive/20 text-sm placeholder:text-destructive/30 focus-visible:border-destructive/40 focus-visible:ring-1 focus-visible:ring-destructive/20 text-destructive-foreground py-2"
          />
        </div>

        {/* Corrected version (Green) */}
        <div className="relative flex-1 min-w-0">
          <Textarea
            value={corrected}
            onChange={(e) => onCorrectedChange(e.target.value)}
            placeholder="Frase corregida..."
            rows={2}
            className="min-h-[60px] resize-none rounded-lg bg-emerald-500/5 border-emerald-500/20 text-sm placeholder:text-emerald-500/30 focus-visible:border-emerald-500/40 focus-visible:ring-1 focus-visible:ring-emerald-500/20 text-emerald-600 py-2"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-9 w-9 shrink-0 text-muted-foreground/40 hover:text-brand hover:bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
