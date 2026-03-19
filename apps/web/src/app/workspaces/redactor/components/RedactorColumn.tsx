"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardColumn } from "@/components/shared/BoardColumn";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { RedactorRow } from "./RedactorRow";

interface RedactorRowData {
  original: string;
  corrected: string;
}

interface RedactorCardProps {
  index: number;
  rows: RedactorRowData[];
  onRowChange: (
    rowIndex: number,
    field: keyof RedactorRowData,
    value: string,
  ) => void;
  onAddRow: () => void;
  onRemoveRow: (rowIndex: number) => void;
  onRemoveCard: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function RedactorCard({
  index,
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  onRemoveCard,
  onQuickLoad,
}: RedactorCardProps) {
  return (
    <BoardColumn
      index={index}
      title={`Ronda ${index}`}
      itemCount={rows.length}
      width="w-[650px]"
      onRemove={onRemoveCard}
      footer={
        <QuickLoad
          onLoad={onQuickLoad}
          placeholder="Pega frases aquí (original [tab] corregida)..."
        />
      }
      addButton={
        <Button
          onClick={onAddRow}
          variant="outline"
          className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar Fila
        </Button>
      }
    >
      {rows.map((row, rowIndex) => (
        <RedactorRow
          key={rowIndex}
          index={rowIndex}
          original={row.original}
          corrected={row.corrected}
          onOriginalChange={(val) => onRowChange(rowIndex, "original", val)}
          onCorrectedChange={(val) => onRowChange(rowIndex, "corrected", val)}
          onRemove={() => onRemoveRow(rowIndex)}
        />
      ))}
    </BoardColumn>
  );
}
