"use client";

import { useState } from "react";
import { ExamenGroupColumn } from "./ExamenGroupColumn";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";

export function ExamenLevel3View() {
  const [columns, setColumns] = useState<{id: string, text: string}[][]>([[{ id: nanoid(), text: "Fila de ejemplo" }]]);

  const addColumn = () => {
    setColumns([...columns, [{ id: nanoid(), text: "Nueva fila" }]]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const addRow = (columnIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex] = [...newColumns[columnIndex], { id: nanoid(), text: "" }];
    setColumns(newColumns);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 w-full bg-muted/5">
        <div
          className="flex min-w-max gap-4 px-6 py-6"
          style={{ height: "calc(100vh - 48px - 36px - 48px)" }}
        >
          {columns.map((rows, colIndex) => (
            <ExamenGroupColumn
              key={colIndex}
              index={colIndex + 1}
              itemCount={rows.length}
              onRemoveColumn={() => removeColumn(colIndex)}
              onAddRow={() => addRow(colIndex)}
              onQuickLoad={() => {}}
            >
              <div className="flex flex-col gap-2">
                {rows.map((row) => (
                  <div key={row.id} className="flex items-center gap-2 p-3 bg-card border border-border rounded-md shadow-sm">
                    <span className="text-xs text-muted-foreground mr-2 cursor-move">☰</span>
                    <Input className="h-8 text-xs" placeholder="Placeholder Nivel 3..." />
                  </div>
                ))}
              </div>
            </ExamenGroupColumn>
          ))}
          <AddColumnButton onClick={addColumn} label="Agregar Grupo" />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
