"use client";

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
import { RedactorRow } from "./RedactorRow";

interface RedactorRowData {
  original: string;
  corrected: string;
}

interface RedactorCardProps {
  index: number;
  rows: RedactorRowData[];
  onRowChange: (rowIndex: number, field: keyof RedactorRowData, value: string) => void;
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
    <Card className="flex flex-col h-full w-[650px] shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-2xs font-bold text-muted-foreground font-mono">
            {index}
          </div>
          <span className="text-sm font-semibold text-foreground">
            Ronda {index}
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {rows.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveCard}
          className="h-7 w-7 text-muted-foreground hover:text-brand hover:bg-brand/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-0">
        <ScrollArea className="flex-1 min-h-0 py-3">
          <div className="flex flex-col gap-2 pr-2">
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
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="shrink-0 pb-3">
          <Button
            onClick={onAddRow}
            variant="outline"
            className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand/50 hover:bg-brand/5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar Fila
          </Button>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border px-4 py-4 shrink-0">
        <QuickLoad 
          onLoad={onQuickLoad} 
          placeholder="Pega frases aquí (original [tab] corregida)..." 
        />
      </CardFooter>
    </Card>
  );
}
