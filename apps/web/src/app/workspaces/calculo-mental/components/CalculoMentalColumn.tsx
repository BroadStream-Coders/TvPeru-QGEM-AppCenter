"use client";

import { CalculoMentalBoard } from "./CalculoMentalBoard";
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
    <Card className="flex flex-col h-full w-[650px] shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 pt-6 shrink-0 bg-muted/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/20 text-brand text-2xs font-bold font-mono">
            {index}
          </div>
          <span className="text-sm font-semibold text-foreground">
            Grupo {index}
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 text-2xs font-mono text-muted-foreground uppercase tracking-wider">
            {boards.length} Tableros
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveColumn}
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-4">
        <ScrollArea className="flex-1 min-h-0 mb-4">
          <div className="flex flex-col gap-5">
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
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="shrink-0">
          <Button
            onClick={onAddBoard}
            variant="outline"
            className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs font-semibold uppercase tracking-wide"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir Tablero
          </Button>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border px-4 pb-6 shrink-0 bg-muted/5">
        <QuickLoad
          onLoad={(matrix) => {
            console.log("[CalculoMental:QuickLoad] Data received:", matrix);
            onQuickLoad(matrix);
          }}
          placeholder="Pegar datos de Excel/Texto para carga rápida..."
        />
      </CardFooter>
    </Card>
  );
}
