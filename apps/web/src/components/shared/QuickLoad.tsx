"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { parseExcelPaste } from "@/helpers/data-processing";

interface QuickLoadProps {
  /**
   * Callback consistency returning a 2D matrix of strings from the Excel/Text paste.
   * Rows are separated by \n, columns by \t.
   */
  onLoad: (data: string[][]) => void;
  placeholder?: string;
  className?: string;
}

export function QuickLoad({
  onLoad,
  placeholder = "Pegar lista aquí...",
  className = "",
}: QuickLoadProps) {
  const [inputValue, setInputValue] = useState("");

  const handleProcessLoad = () => {
    if (!inputValue.trim()) return;

    const matrix = parseExcelPaste(inputValue);

    if (matrix.length > 0) {
      onLoad(matrix);
      setInputValue("");
    }
  };

  return (
    <div className={`flex gap-2 w-full ${className}`}>
      <Textarea
        placeholder={placeholder}
        className="h-[80px] flex-1 resize-none text-xs bg-white dark:bg-zinc-900 border-zinc-200 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        variant="secondary"
        size="icon"
        className="h-auto w-10 shrink-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 self-stretch"
        onClick={handleProcessLoad}
        title="Cargar datos"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
