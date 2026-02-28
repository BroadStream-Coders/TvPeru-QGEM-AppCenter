"use client";

import { DeletreoRow } from "./DeletreoRow";
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
    /*
      h-full: la columna ocupa toda la altura del contenedor padre,
      que ya tiene altura fija via calc() en la página.
      Así la columna nunca crece ni encoge por el contenido interno.
    */
    <Card className="flex flex-col h-full w-[320px] shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden">
      {/* Header — altura fija */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground font-mono">
            {index}
          </div>
          <span className="text-sm font-semibold text-foreground">
            Ronda {index}
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            {words.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveColumn}
          className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      {/*
        CardContent: flex-1 + min-h-0 para que pueda encoger.
        El ScrollArea aquí hace el scroll VERTICAL de los rows
        usando el mismo componente de shadcn que el scroll horizontal,
        por lo tanto visualmente idéntico.
      */}
      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-0">
        <ScrollArea className="flex-1 min-h-0 py-3">
          <div className="flex flex-col gap-2 pr-2">
            {words.map((word, wordIndex) => (
              <DeletreoRow
                key={wordIndex}
                index={wordIndex}
                value={word}
                onChange={(val) => onWordChange(wordIndex, val)}
                onRemove={() => onRemoveWord(wordIndex)}
              />
            ))}
          </div>
          {/* Scrollbar vertical — mismo componente y estilo que el horizontal de la página */}
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="shrink-0 pb-3">
          <Button
            onClick={onAddWord}
            variant="outline"
            className="w-full h-9 gap-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-red-600/50 hover:bg-red-600/5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar Palabra
          </Button>
        </div>
      </CardContent>

      {/* Footer — altura fija */}
      <CardFooter className="border-t border-border px-4 py-3 shrink-0">
        <QuickLoad onLoad={onQuickLoad} />
      </CardFooter>
    </Card>
  );
}
