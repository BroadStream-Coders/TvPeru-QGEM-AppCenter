"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ExamenLevel0RowProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ExamenLevel0Row({
  index,
  value,
  onChange,
  onRemove,
}: ExamenLevel0RowProps) {
  return (
    <div className="flex items-center gap-2 group">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-2xs font-mono text-muted-foreground/50 select-none">
        {index + 1}
      </div>

      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe el valor aquí..."
          className="h-9 rounded-lg bg-background border-border text-sm placeholder:text-muted-foreground/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-brand hover:bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
