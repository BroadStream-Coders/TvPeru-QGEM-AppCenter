"use client";

import { Input } from "@/components/ui/input";

interface CalculoMentalSlotProps {
  index: number;
  question: string;
  answer: string;
  onQuestionChange: (val: string) => void;
  onAnswerChange: (val: string) => void;
}

export function CalculoMentalSlot({
  index,
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
}: CalculoMentalSlotProps) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-muted/20 group relative">
      <div className="absolute -left-2 -top-2 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center text-2xs font-mono font-bold text-muted-foreground shadow-sm z-10">
        {index + 1}
      </div>

      <div className="space-y-1.5">
        <label className="text-2xs font-bold uppercase tracking-wider text-blue-400/80 px-1">
          Pregunta
        </label>
        <Input
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Ej: 250 + 265"
          className="h-9 rounded-lg bg-background border-blue-500/20 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-2xs font-bold uppercase tracking-wider text-purple-400/80 px-1">
          Respuesta
        </label>
        <Input
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Ej: 515"
          className="h-9 rounded-lg bg-background border-purple-500/20 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20 text-sm font-bold text-purple-200"
        />
      </div>
    </div>
  );
}
