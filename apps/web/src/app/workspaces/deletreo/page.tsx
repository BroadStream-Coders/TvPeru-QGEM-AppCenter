"use client";

import { SpellCheck } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { getColumnData } from "@/helpers/data-processing";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { DeletreoColumn } from "./components/DeletreoColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DEFAULT_FILENAME = "DeletreoData.json";

interface DeletreoGroup {
  words: string[];
}

interface DeletreoData {
  groups: DeletreoGroup[];
}

export default function DeletreoPage() {
  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<string>([["", "", ""]], () => "");

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    replaceGroup(groupIndex, getColumnData(matrix, 0));
  };

  const handleSave = () => {
    const data: DeletreoData = { groups: groups.map((words) => ({ words })) };
    saveAsJson(DEFAULT_FILENAME, data);
  };

  const handleLoad = async (file: File) => {
    try {
      const isValid = (data: unknown): data is DeletreoData =>
        typeof data === "object" &&
        data !== null &&
        "groups" in data &&
        Array.isArray((data as DeletreoData).groups) &&
        (data as DeletreoData).groups.every((g) => Array.isArray(g.words));

      const data = await loadJsonFile<DeletreoData>(file, isValid);
      if (data?.groups) setGroups(data.groups.map((g) => g.words));
    } catch {
      alert("Error al cargar el archivo JSON.");
    }
  };

  return (
    <WorkspaceShell
      title="Deletreo"
      icon={<SpellCheck className="h-3 w-3" />}
      badge={`${groups.length} ronda${groups.length !== 1 ? "s" : ""}`}
      actions={
        <FileActions format="json" onSave={handleSave} onLoad={handleLoad} />
      }
    >
      <ScrollArea className="w-full h-full">
        <div
          className="flex min-w-max gap-4 px-6 py-6"
          style={{ height: "calc(100vh - 48px - 36px)" }}
        >
          {groups.map((words, groupIndex) => (
            <DeletreoColumn
              key={groupIndex}
              index={groupIndex + 1}
              words={words}
              onWordChange={(wordIdx, val) =>
                updateItem(groupIndex, wordIdx, val)
              }
              onAddWord={() => addItem(groupIndex)}
              onRemoveWord={(wordIdx) => removeItem(groupIndex, wordIdx)}
              onRemoveColumn={() => removeGroup(groupIndex)}
              onQuickLoad={(matrix) => handleQuickLoad(groupIndex, matrix)}
            />
          ))}

          <AddColumnButton label="Agregar ronda" onClick={addGroup} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </WorkspaceShell>
  );
}
