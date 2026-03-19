"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box, PenTool, FileText } from "lucide-react";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { TitleInput } from "@/components/shared/group-column/components/TitleInput";
import { DescriptionInput } from "@/components/shared/group-column/components/DescriptionInput";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { nanoid } from "nanoid";
import { Trash2 } from "lucide-react";

const MAX_CAPACITY = 20;

function ColumnsDemo() {
  const [columns, setColumns] = useState([{ id: nanoid() }]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rows, setRows] = useState(["Elemento 1", "Elemento 2", "Elemento 3"]);

  const addColumn = () => setColumns([...columns, { id: nanoid() }]);
  const removeColumn = (id: string) =>
    setColumns(columns.filter((c) => c.id !== id));
  const addRow = () => {
    if (rows.length >= MAX_CAPACITY) return;
    setRows([...rows, ""]);
  };
  const removeRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));
  const updateRow = (idx: number, val: string) =>
    setRows(rows.map((r, i) => (i === idx ? val : r)));

  return (
    <GroupsContainer onAddGroup={addColumn}>
      {columns.map((col, index) => (
        <GroupColumn
          key={col.id}
          index={index + 1}
          onRemove={() => removeColumn(col.id)}
          currentCapacity={rows.length}
          maxCapacity={MAX_CAPACITY}
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
          <RowsContainer>
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-2">
                <span className="text-2xs font-mono text-muted-foreground w-4 text-right shrink-0">
                  {rowIdx + 1}
                </span>
                <input
                  type="text"
                  value={row}
                  onChange={(e) => updateRow(rowIdx, e.target.value)}
                  placeholder="Escribe aquí..."
                  className="flex-1 h-8 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-brand/40 transition-all"
                />
                <button
                  onClick={() => removeRow(rowIdx)}
                  className="h-6 w-6 shrink-0 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </RowsContainer>
          <AddRowButton onClick={addRow} label="Agregar nueva fila" />
          <GroupFooter>
            <QuickLoad
              onLoad={(matrix) => {
                const newItems = matrix.map((row) => row[0] || "");
                const available = MAX_CAPACITY - rows.length;
                const toAdd = newItems.slice(0, available);
                setRows([...rows, ...toAdd]);
              }}
            />
          </GroupFooter>
        </GroupColumn>
      ))}
    </GroupsContainer>
  );
}

function EmptyLevel({ name }: { name: string }) {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-sm font-bold mb-1">{name}</p>
        <p className="text-2xs opacity-60">
          Aquí iría el contenido de este nivel.
        </p>
      </div>
    </div>
  );
}

export default function SandboxPage() {
  const levels = [
    { name: "Columnas", icon: PenTool, component: <ColumnsDemo /> },
    { name: "Nivel 2", icon: FileText, component: <EmptyLevel name="Vista del Nivel 2" /> },
    { name: "Nivel 3", component: <EmptyLevel name="Vista del Nivel 3" /> },
  ];

  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-sans overflow-hidden">
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

      <main className="flex-1 overflow-hidden">
        <LevelTabs levels={levels} />
      </main>
    </div>
  );
}
