"use client";

import { CalculoMentalSlot } from "./CalculoMentalSlot";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SlotData {
  question: string;
  answer: string;
}

interface CalculoMentalBoardProps {
  index: number;
  slots: SlotData[];
  onSlotChange: (
    slotIndex: number,
    field: "question" | "answer",
    value: string,
  ) => void;
  onRemoveBoard: () => void;
}

export function CalculoMentalBoard({
  index,
  slots,
  onSlotChange,
  onRemoveBoard,
}: CalculoMentalBoardProps) {
  return (
    <Card className="flex flex-col h-full w-[300px] shrink-0 rounded-xl border border-border bg-card shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 shrink-0 bg-muted/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/20 text-brand text-2xs font-bold font-mono">
            {index}
          </div>
          <span className="text-sm font-semibold text-foreground">
            Tablero {index}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveBoard}
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-0">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-4 px-2 py-2">
            {slots.map((slot, slotIdx) => (
              <CalculoMentalSlot
                key={slotIdx}
                index={slotIdx}
                question={slot.question}
                answer={slot.answer}
                onQuestionChange={(val) =>
                  onSlotChange(slotIdx, "question", val)
                }
                onAnswerChange={(val) => onSlotChange(slotIdx, "answer", val)}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
