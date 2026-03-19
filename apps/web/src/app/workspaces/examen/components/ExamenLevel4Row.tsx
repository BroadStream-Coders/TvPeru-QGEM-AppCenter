"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface ExamenLevel4RowData {
  id: string;
  question: string;
  answer: string;
}

interface ExamenLevel4RowProps {
  index: number;
  data: ExamenLevel4RowData;
  onChange: (updates: Partial<ExamenLevel4RowData>) => void;
  onRemove: () => void;
}

export function ExamenLevel4Row({
  index,
  data,
  onChange,
  onRemove,
}: ExamenLevel4RowProps) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-brand/30">
      <div className="grid grid-cols-[2rem_1fr] items-start gap-2 w-full">
        {/* Left column top: Trash and Number */}
        <div className="flex flex-col gap-1 w-full shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-full rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex h-[30px] w-full items-center justify-center rounded border border-border bg-muted/30 text-xs font-mono font-medium text-muted-foreground">
            {index + 1}
          </div>
        </div>

        {/* Right column top: Textarea Question */}
        <Textarea
          value={data.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Ingrese la pregunta..."
          className="h-[66px] min-h-[66px] resize-none w-full border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        {/* Left column bottom: Empty placeholder to align with input */}
        <div className="h-8 w-full" />

        {/* Right column bottom: Answer Input */}
        <Input
          value={data.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
          placeholder="Ingrese la respuesta..."
          className="h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />
      </div>
    </div>
  );
}
