"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface ExamenLevel3Pair {
  leftText: string;
  rightText: string;
}

export interface ExamenLevel3RowData {
  id: string;
  pairs: ExamenLevel3Pair[];
}

interface ExamenLevel3RowProps {
  index: number;
  data: ExamenLevel3RowData;
  onChange: (updates: Partial<ExamenLevel3RowData>) => void;
  onRemove: () => void;
}

export function ExamenLevel3Row({
  index,
  data,
  onChange,
  onRemove,
}: ExamenLevel3RowProps) {
  const handlePairChange = (
    pairIndex: number,
    field: "leftText" | "rightText",
    value: string,
  ) => {
    const newPairs = [...(data.pairs || [])];
    if (!newPairs[pairIndex]) {
      newPairs[pairIndex] = { leftText: "", rightText: "" };
    }
    newPairs[pairIndex] = { ...newPairs[pairIndex], [field]: value };
    onChange({ pairs: newPairs });
  };

  // Ensure we always render exactly 3 pairs
  const pairsToRender =
    data.pairs?.length === 3
      ? data.pairs
      : Array.from(
          { length: 3 },
          (_, i) => data.pairs?.[i] || { leftText: "", rightText: "" },
        );

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-brand/30">
      <div className="grid grid-cols-[2rem_1fr] items-start gap-2 w-full">
        {/* Left column: Trash and Number */}
        <div className="flex flex-col gap-1 w-full shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-full rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex h-[30px] w-full items-center justify-center rounded border border-border bg-muted/30 text-xs font-mono font-medium text-muted-foreground">
            {index + 1}
          </div>
        </div>

        {/* Right column: 4 Pairs of Inputs */}
        <div className="flex flex-col gap-2 w-full">
          {pairsToRender.map((pair, pIndex) => (
            <div key={pIndex} className="grid grid-cols-2 gap-2 w-full">
              <Input
                value={pair.leftText}
                onChange={(e) =>
                  handlePairChange(pIndex, "leftText", e.target.value)
                }
                placeholder={`Col A (Par ${pIndex + 1})`}
                className="h-8 border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
              />
              <Input
                value={pair.rightText}
                onChange={(e) =>
                  handlePairChange(pIndex, "rightText", e.target.value)
                }
                placeholder={`Col B (Par ${pIndex + 1})`}
                className="h-8 border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
