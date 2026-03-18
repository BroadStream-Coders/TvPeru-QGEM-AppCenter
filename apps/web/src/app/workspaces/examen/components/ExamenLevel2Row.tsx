"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface ExamenLevel2RowData {
  id: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: "A" | "B" | "C" | "D" | null;
}

interface ExamenLevel2RowProps {
  index: number;
  data: ExamenLevel2RowData;
  onChange: (updates: Partial<ExamenLevel2RowData>) => void;
  onRemove: () => void;
}

export function ExamenLevel2Row({
  index,
  data,
  onChange,
  onRemove,
}: ExamenLevel2RowProps) {
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
          <div className="flex h-8 w-full items-center justify-center rounded border border-border bg-muted/30 text-xs font-mono font-medium text-muted-foreground">
            {index + 1}
          </div>
        </div>

        {/* Right column top: Textarea Question */}
        <Textarea
          value={data.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Ingrese la pregunta..."
          className="h-[68px] min-h-[68px] resize-none w-full border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        {/* Answer A */}
        <button
          onClick={() => onChange({ correctAnswer: "A" })}
          className={`flex h-8 w-full items-center justify-center rounded border text-xs font-bold font-mono transition-colors ${
            data.correctAnswer === "A"
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50"
          }`}
        >
          A
        </button>
        <Input
          value={data.answerA}
          onChange={(e) => onChange({ answerA: e.target.value })}
          placeholder="Ingrese la respuesta A..."
          className="h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        {/* Answer B */}
        <button
          onClick={() => onChange({ correctAnswer: "B" })}
          className={`flex h-8 w-full items-center justify-center rounded border text-xs font-bold font-mono transition-colors ${
            data.correctAnswer === "B"
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50"
          }`}
        >
          B
        </button>
        <Input
          value={data.answerB}
          onChange={(e) => onChange({ answerB: e.target.value })}
          placeholder="Ingrese la respuesta B..."
          className="h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        {/* Answer C */}
        <button
          onClick={() => onChange({ correctAnswer: "C" })}
          className={`flex h-8 w-full items-center justify-center rounded border text-xs font-bold font-mono transition-colors ${
            data.correctAnswer === "C"
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50"
          }`}
        >
          C
        </button>
        <Input
          value={data.answerC}
          onChange={(e) => onChange({ answerC: e.target.value })}
          placeholder="Ingrese la respuesta C..."
          className="h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        {/* Answer D */}
        <button
          onClick={() => onChange({ correctAnswer: "D" })}
          className={`flex h-8 w-full items-center justify-center rounded border text-xs font-bold font-mono transition-colors ${
            data.correctAnswer === "D"
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50"
          }`}
        >
          D
        </button>
        <Input
          value={data.answerD}
          onChange={(e) => onChange({ answerD: e.target.value })}
          placeholder="Ingrese la respuesta D..."
          className="h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />
      </div>
    </div>
  );
}
