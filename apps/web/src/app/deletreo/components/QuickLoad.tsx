"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";

export function QuickLoad() {
  return (
    <div className="flex gap-2 w-full">
      <Textarea
        placeholder="Pegar lista aquí..."
        className="min-h-[60px] flex-1 resize-none text-xs bg-white dark:bg-zinc-900 border-zinc-200 overflow-hidden"
      />
      <Button
        variant="secondary"
        size="icon"
        className="h-auto w-10 shrink-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 self-stretch"
        disabled // Deshabilitado por ahora
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
