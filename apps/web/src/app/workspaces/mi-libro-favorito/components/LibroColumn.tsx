"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardColumn } from "@/components/shared/BoardColumn";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { LibroRow } from "./LibroRow";

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
    <BoardColumn
      index={index}
      title={`Ronda ${index}`}
      itemCount={items.length}
      width="w-[650px]"
      onRemove={onRemoveColumn}
      footer={<QuickLoad onLoad={onQuickLoad} />}
      addButton={
        <Button
          onClick={onAddItem}
          variant="outline"
          className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar Pregunta
        </Button>
      }
    >
      {items.map((item, itemIdx) => (
        <LibroRow
          key={itemIdx}
          index={itemIdx}
          question={item.question}
          answer={item.answer}
          onQuestionChange={(val) => onItemChange(itemIdx, "question", val)}
          onAnswerChange={(val) => onItemChange(itemIdx, "answer", val)}
          onRemove={() => onRemoveItem(itemIdx)}
        />
      ))}
    </BoardColumn>
  );
}
