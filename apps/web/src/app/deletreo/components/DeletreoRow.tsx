"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeletreoRowProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function DeletreoRow({
  index,
  value,
  onChange,
  onRemove,
}: DeletreoRowProps) {
  const charCount = value.length;

  // Lógica de color según longitud (simulando el diseño original)
  const getCountColor = () => {
    if (charCount === 0) return "text-zinc-400";
    if (charCount > 20) return "text-red-500 font-bold";
    if (charCount > 15) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="flex items-center gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500">
        {index}
      </div>

      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe aquí..."
          className="h-10 pr-10 rounded-lg border-zinc-200 bg-white focus-visible:ring-red-500 dark:border-zinc-800 dark:bg-zinc-900"
        />
        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${getCountColor()}`}
        >
          {charCount}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
