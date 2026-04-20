"use client";

import { useState, useEffect } from "react";
import { Box, PenTool, Image as ImageIcon } from "lucide-react";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { ImagePicker } from "@/components/shared/ImagePicker";
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

function CropperDemo() {
  return (
    <div className="p-8 h-full overflow-auto space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Sistema de Recorte</h2>
        <p className="text-muted-foreground text-sm">
          Sube imágenes para probar el recorte con diferentes proporciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Proporción 1:1 (Square)</h3>
          <div className="max-w-[250px]">
            <ImagePicker
              onChange={() => {}}
              crop={{ x: 1, y: 1 }}
              placeholder="1:1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Proporción 3:4 (Portrait)</h3>
          <div className="max-w-[250px]">
            <ImagePicker
              onChange={() => {}}
              crop={{ x: 3, y: 4 }}
              placeholder="3:4"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Proporción 16:9 (Landscape)</h3>
          <div className="w-full">
            <ImagePicker
              onChange={() => {}}
              crop={{ x: 16, y: 9 }}
              placeholder="16:9"
            />
          </div>
        </div>
      </div>
    </div>
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
  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  useEffect(() => {
    setHeader({
      title: "Sandbox (Layout Header)",
      icon: <Box className="h-3 w-3" />,
      format: "json",
      onSave: () => alert("Guardar: Disparado desde Layout Global"),
      onLoad: (file) => alert(`Cargar: ${file.name} desde Layout Global`),
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const levels = [
    { name: "Columnas", icon: PenTool, component: <ColumnsDemo /> },
    {
      name: "Recorte",
      icon: ImageIcon,
      component: <CropperDemo />,
    },
    { name: "Nivel 3", component: <EmptyLevel name="Vista del Nivel 3" /> },
  ];

  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-sans overflow-hidden">
      <main className="flex-1 overflow-hidden">
        <LevelTabs levels={levels} />
      </main>
    </div>
  );
}
