"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import { GroupsContainer } from "@/components/shared/group-column/GroupsContainer";
import { GroupColumn } from "@/components/shared/group-column/GroupColumn";
import { nanoid } from "nanoid";

export default function SandboxPage() {
  const [columns, setColumns] = useState([{ id: nanoid() }, { id: nanoid() }]);

  const addColumn = () => setColumns([...columns, { id: nanoid() }]);
  const removeColumn = (id: string) =>
    setColumns(columns.filter((c) => c.id !== id));
  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Box className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold tracking-tight">Sandbox</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 z-10">
          <GroupsContainer onAddGroup={addColumn}>
            {columns.map((col, index) => (
              <GroupColumn
                key={col.id}
                index={index + 1}
                onRemove={() => removeColumn(col.id)}
                currentCapacity={3}
                maxCapacity={4}
              >
                {/* Dummy injected Lego content for testing stretch */}
                <div className="flex-1 min-h-0 rounded-md border-2 border-dashed border-border/50 bg-background/50 flex flex-col items-center justify-center text-muted-foreground p-4">
                  <p className="text-xs font-mono font-bold mb-1">
                    Contenedor Filas (Scroll)
                  </p>
                  <p className="text-2xs text-center max-w-[200px] opacity-70">
                    Ocupará todo el resto del alto disponible gracias a flex-1 y
                    min-h-0.
                  </p>
                </div>
                <div className="shrink-0 rounded-md border-2 border-dashed border-border/50 bg-muted/30 flex items-center justify-center p-3 text-2xs font-mono font-bold text-muted-foreground">
                  Footer (Botones Llenado)
                </div>
              </GroupColumn>
            ))}
          </GroupsContainer>
        </div>
      </main>
    </div>
  );
}
