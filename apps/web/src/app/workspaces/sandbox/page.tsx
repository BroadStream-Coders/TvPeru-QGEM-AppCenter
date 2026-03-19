"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import { GroupsContainer } from "@/components/shared/group-column/GroupsContainer";
import { GroupColumn } from "@/components/shared/group-column/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/GroupFooter";
import { TitleInput } from "@/components/shared/group-column/components/TitleInput";
import { DescriptionInput } from "@/components/shared/group-column/components/DescriptionInput";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { nanoid } from "nanoid";

export default function SandboxPage() {
  const [columns, setColumns] = useState([{ id: nanoid() }]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

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
                <TitleInput
                  value={title}
                  onChange={setTitle}
                  placeholder="Escribe el título del grupo..."
                />

                <DescriptionInput
                  value={desc}
                  onChange={setDesc}
                  placeholder="Contexto o descripción de esta ronda..."
                />

                <div className="px-4 py-4 flex-1 flex flex-col min-h-0">
                  <div className="flex-1 rounded-md border-2 border-dashed border-border/50 bg-background/50 flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-xs font-mono font-bold mb-1">
                      Contenedor Filas (Scroll)
                    </p>
                    <p className="text-2xs text-center max-w-[200px] opacity-70">
                      Se estira dinámicamente.
                    </p>
                  </div>
                </div>

                <AddRowButton
                  onClick={() => console.log("Add Row")}
                  label="Agregar nueva fila"
                />

                <GroupFooter>
                  <QuickLoad
                    onLoad={(matrix) => console.log("Matriz:", matrix)}
                  />
                </GroupFooter>
              </GroupColumn>
            ))}
          </GroupsContainer>
        </div>
      </main>
    </div>
  );
}
