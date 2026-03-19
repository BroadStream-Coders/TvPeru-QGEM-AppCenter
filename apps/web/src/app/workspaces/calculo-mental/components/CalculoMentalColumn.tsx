"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardColumn } from "@/components/shared/BoardColumn";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { CalculoMentalBoard } from "./CalculoMentalBoard";

interface SlotData {
  question: string;
  answer: string;
}

interface BoardData {
  slots: SlotData[];
}

interface CalculoMentalColumnProps {
  index: number;
  boards: BoardData[];
  onSlotChange: (
    boardIdx: number,
    slotIdx: number,
    field: "question" | "answer",
    value: string,
  ) => void;
  onAddBoard: () => void;
  onRemoveBoard: (boardIdx: number) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function CalculoMentalColumn({
  index,
  boards,
  onSlotChange,
  onAddBoard,
  onRemoveBoard,
  onRemoveColumn,
  onQuickLoad,
}: CalculoMentalColumnProps) {
  return (
    <BoardColumn
      index={index}
      title={`Grupo ${index}`}
      itemCount={boards.length}
      width="w-[700px]"
      onRemove={onRemoveColumn}
      footer={
        <QuickLoad
          onLoad={onQuickLoad}
          placeholder="Pegar datos de Excel/Texto para carga rápida..."
        />
      }
      addButton={
        <Button
          onClick={onAddBoard}
          variant="outline"
          className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs font-semibold uppercase tracking-wide"
        >
          <Plus className="h-3.5 w-3.5" />
          Añadir Tablero
        </Button>
      }
    >
      {boards.map((board, boardIdx) => (
        <CalculoMentalBoard
          key={boardIdx}
          index={boardIdx}
          slots={board.slots}
          onSlotChange={(slotIdx, field, val) =>
            onSlotChange(boardIdx, slotIdx, field, val)
          }
          onRemoveBoard={() => onRemoveBoard(boardIdx)}
        />
      ))}
    </BoardColumn>
  );
}
