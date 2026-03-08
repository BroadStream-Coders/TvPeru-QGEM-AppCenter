"use client";

import { LibroRow } from "./LibroRow";
import { QuickLoad } from "@/components/shared/QuickLoad";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface LibroColumnProps {
  index: number;
  items: QuestionAnswer[];
  onItemChange: (
    itemIndex: number,
    field: "question" | "answer",
    value: string,
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function LibroColumn({
  index,
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onRemoveColumn,
  onQuickLoad,
}: LibroColumnProps) {
  return (
    <Card className="flex flex-col h-full w-[340px] shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-2xs font-bold text-muted-foreground font-mono">
            {index}
          </div>
          <span className="text-sm font-semibold text-foreground">
            Ronda {index}
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {items.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveColumn}
          className="h-7 w-7 text-muted-foreground hover:text-brand hover:bg-brand/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-0">
        <ScrollArea className="flex-1 min-h-0 py-3">
          <div className="flex flex-col gap-3 pr-2">
            {items.map((item, itemIdx) => (
              <LibroRow
                key={itemIdx}
                index={itemIdx}
                question={item.question}
                answer={item.answer}
                onQuestionChange={(val) =>
                  onItemChange(itemIdx, "question", val)
                }
                onAnswerChange={(val) => onItemChange(itemIdx, "answer", val)}
                onRemove={() => onRemoveItem(itemIdx)}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="shrink-0 pb-3">
          <Button
            onClick={onAddItem}
            variant="outline"
            className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar Pregunta
          </Button>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border px-4 py-3 shrink-0">
        <QuickLoad onLoad={onQuickLoad} />
      </CardFooter>
    </Card>
  );
}
