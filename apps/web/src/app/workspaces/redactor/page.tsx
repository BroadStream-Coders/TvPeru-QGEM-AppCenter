"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { getColumnData } from "@/helpers/data-processing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenTool, Plus, Upload, Download } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RedactorCard } from "./components/RedactorColumn";

const DEFAULT_FILENAME = "Redactor.json";

interface RedactorRowData {
  original: string;
  corrected: string;
}

interface RedactorGroup {
  rows: RedactorRowData[];
}

interface RedactorData {
  groups: RedactorGroup[];
}

export default function RedactorPage() {
  const [groups, setGroups] = useState<RedactorGroup[]>([
    { rows: [{ original: "", corrected: "" }] },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addGroup = () =>
    setGroups([...groups, { rows: [{ original: "", corrected: "" }] }]);

  const removeGroup = (index: number) =>
    setGroups(groups.filter((_, i) => i !== index));

  const addRowToGroup = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].rows = [
      ...newGroups[groupIndex].rows,
      { original: "", corrected: "" },
    ];
    setGroups(newGroups);
  };

  const removeRowFromGroup = (groupIndex: number, rowIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].rows = newGroups[groupIndex].rows.filter(
      (_, i) => i !== rowIndex,
    );
    setGroups(newGroups);
  };

  const updateRowInGroup = (
    groupIndex: number,
    rowIndex: number,
    field: keyof RedactorRowData,
    value: string,
  ) => {
    const newGroups = [...groups];
    newGroups[groupIndex].rows[rowIndex][field] = value;
    setGroups(newGroups);
  };

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const newGroups = [...groups];
    const originalColumn = getColumnData(matrix, 0);
    const correctedColumn = getColumnData(matrix, 1);

    // Mapeamos las filas de la matriz a filas de RedactorRowData
    const newRows: RedactorRowData[] = originalColumn.map((original, i) => ({
      original: original.trim(),
      corrected: (correctedColumn[i] || "").trim(),
    }));

    if (newRows.length > 0) {
      newGroups[groupIndex].rows = newRows;
      setGroups(newGroups);
    }
  };

  const handleSave = () => saveAsJson(DEFAULT_FILENAME, { groups });

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const isValid = (data: unknown): data is RedactorData => {
        if (typeof data !== "object" || data === null || !("groups" in data))
          return false;
        const g = (data as RedactorData).groups;
        return (
          Array.isArray(g) &&
          g.every(
            (group) =>
              typeof group === "object" &&
              group !== null &&
              "rows" in group &&
              Array.isArray(group.rows),
          )
        );
      };
      const data = await loadJsonFile<RedactorData>(file, isValid);
      if (data?.groups) setGroups(data.groups);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Error al cargar el archivo JSON.",
      );
    }
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => fileInputRef.current?.click();

  return (
    <>
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand ring-1 ring-brand/10">
              <PenTool className="h-3 w-3" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Redactor
            </span>
          </div>
          <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {groups.length} ronda{groups.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerLoad}
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cargar</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLoad}
            accept=".json"
            className="hidden"
          />
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 gap-1.5 bg-brand hover:brightness-110 active:scale-[0.98] text-brand-foreground text-xs shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guardar</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div
            className="flex min-w-max gap-4 px-6 py-6"
            style={{ height: "calc(100vh - 48px - 36px)" }}
          >
            {groups.map((group, index) => (
              <RedactorCard
                key={index}
                index={index + 1}
                rows={group.rows}
                onRowChange={(rowIdx, field, val) =>
                  updateRowInGroup(index, rowIdx, field, val)
                }
                onAddRow={() => addRowToGroup(index)}
                onRemoveRow={(rowIdx) => removeRowFromGroup(index, rowIdx)}
                onRemoveCard={() => removeGroup(index)}
                onQuickLoad={(data) => handleQuickLoad(index, data)}
              />
            ))}

            {/* Add round */}
            <div className="h-full w-[180px] shrink-0">
              <button
                onClick={addGroup}
                className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/5 text-muted-foreground transition-all hover:border-brand/40 hover:bg-muted/10 hover:text-foreground"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-current transition-colors group-hover:border-brand/50 group-hover:text-brand">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">Agregar ronda</span>
              </button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </>
  );
}
