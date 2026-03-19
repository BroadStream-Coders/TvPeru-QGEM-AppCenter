"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { parseExcelPaste } from "@/helpers/data-processing";

interface QuickLoadProps {
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
        className="h-[72px] flex-1 resize-none text-xs bg-background border-border placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-ring/30 overflow-y-auto"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-auto w-9 shrink-0 border-border bg-background hover:bg-accent hover:text-foreground self-stretch text-muted-foreground"
        onClick={handleProcessLoad}
        title="Cargar datos"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
