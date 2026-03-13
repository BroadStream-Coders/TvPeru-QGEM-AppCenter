"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

interface BoardColumnProps {
  index: number;
  title: string;
  itemCount?: number;
  width?: string;
  onRemove: () => void;
  footer?: React.ReactNode;
  addButton?: React.ReactNode;
  children: React.ReactNode;
}

export function BoardColumn({
  index,
  title,
  itemCount,
  width = "w-[320px]",
  onRemove,
  footer,
  addButton,
  children,
}: BoardColumnProps) {
  return (
    <Card
      className={`flex flex-col h-full ${width} shrink-0 rounded-xl border border-border bg-card shadow-none gap-0 py-0 overflow-hidden`}
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-4 shrink-0 bg-muted/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/20 text-brand text-2xs font-bold font-mono">
            {index}
          </div>
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {itemCount !== undefined && (
            <span className="rounded border border-border px-1.5 py-0.5 text-2xs font-mono text-muted-foreground uppercase tracking-wider">
              {itemCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0 px-4 py-4">
        <ScrollArea className="flex-1 min-h-0 mb-4">
          <div className="flex flex-col gap-2">{children}</div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {addButton && <div className="shrink-0">{addButton}</div>}
      </CardContent>

      {footer && (
        <CardFooter className="border-t border-border px-4 py-4 shrink-0 bg-muted/5">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
