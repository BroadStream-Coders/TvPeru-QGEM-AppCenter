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
    <Card className="flex flex-col h-[750px] w-[340px] shrink-0 bg-white border-zinc-200 shadow-lg dark:bg-zinc-900 dark:border-zinc-800 transition-all">
      <CardHeader className="py-1.5 px-3 flex flex-row items-center justify-between border-b bg-zinc-50/50 dark:bg-zinc-950/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600">
            {index}
          </div>
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            Ronda {index}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveColumn}
          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 px-3 py-0 flex flex-col min-h-0 overflow-hidden">
        {/* Lista de palabras con scroll propio */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          <div className="flex flex-col gap-3 pb-2">
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
        </div>

        <div className="shrink-0 pt-2">
          <Button
            onClick={onAddWord}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-xl shadow-md active:scale-[0.98] transition-all flex gap-3"
          >
            <Plus className="h-5 w-5" /> Agregar Palabra
          </Button>
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 pt-0 shrink-0">
        <QuickLoad onLoad={onQuickLoad} />
      </CardFooter>
    </Card>
  );
}
