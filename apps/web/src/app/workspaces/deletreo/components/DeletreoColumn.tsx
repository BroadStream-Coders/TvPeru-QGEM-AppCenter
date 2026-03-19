"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardColumn } from "@/components/shared/BoardColumn";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { DeletreoRow } from "./DeletreoRow";

interface DeletreoColumnProps {
  index: number;
  words: string[];
  onWordChange: (wordIndex: number, value: string) => void;
  onAddWord: () => void;
  onRemoveWord: (wordIndex: number) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function DeletreoColumn({
  index,
  words,
  onWordChange,
  onAddWord,
  onRemoveWord,
  onRemoveColumn,
  onQuickLoad,
}: DeletreoColumnProps) {
  return (
    <BoardColumn
      index={index}
      title={`Ronda ${index}`}
      itemCount={words.length}
      onRemove={onRemoveColumn}
      footer={<QuickLoad onLoad={onQuickLoad} />}
      addButton={
        <Button
          onClick={onAddWord}
          variant="outline"
          className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar Palabra
        </Button>
      }
    >
      {words.map((word, wordIndex) => (
        <DeletreoRow
          key={wordIndex}
          index={wordIndex}
          value={word}
          onChange={(val) => onWordChange(wordIndex, val)}
          onRemove={() => onRemoveWord(wordIndex)}
        />
      ))}
    </BoardColumn>
  );
}
