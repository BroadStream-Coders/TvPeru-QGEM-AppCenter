"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardColumn } from "@/components/shared/BoardColumn";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";

interface ExamenGroupColumnProps {
  index: number;
  itemCount: number;
  onAddRow: () => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
  children: React.ReactNode;
}

export function ExamenGroupColumn({
  index,
  itemCount,
  onAddRow,
  onRemoveColumn,
  onQuickLoad,
  children,
}: ExamenGroupColumnProps) {
  return (
    <BoardColumn
      index={index}
      title={`Grupo ${index}`}
      itemCount={itemCount}
      onRemove={onRemoveColumn}
      footer={<QuickLoad onLoad={onQuickLoad} />}
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
      {children}
    </BoardColumn>
  );
}
