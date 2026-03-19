"use client";

import { Calculator } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { AddColumnButton } from "@/components/shared/group-column/components/AddColumnButton";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { CalculoMentalColumn } from "./components/CalculoMentalColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DEFAULT_FILENAME = "CalculoMental.json";

interface SlotData {
  question: string;
  answer: string;
}

interface BoardData {
  slots: SlotData[];
}

interface GroupData {
  boards: BoardData[];
}

interface CalculoMentalData {
  groups: GroupData[];
}

const createEmptySlot = (): SlotData => ({ question: "", answer: "" });
const createEmptyBoard = (): BoardData => ({
  slots: Array(4).fill(null).map(createEmptySlot),
});

export default function CalculoMentalPage() {
  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<BoardData>([[createEmptyBoard()]], createEmptyBoard);

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const boards: BoardData[] = [];
    for (let i = 0; i < matrix.length; i += 2) {
      const questionRow = matrix[i] || [];
      const answerRow = matrix[i + 1] || [];
      if (questionRow.length === 0 && answerRow.length === 0) continue;
      boards.push({
        slots: Array(4)
          .fill(null)
          .map((_, slotIdx) => ({
            question: (questionRow[slotIdx] || "").trim(),
            answer: (answerRow[slotIdx] || "").trim(),
          })),
      });
    }
    if (boards.length > 0) replaceGroup(groupIndex, boards);
  };

  const handleSave = () => {
    const data: CalculoMentalData = {
      groups: groups.map((boards) => ({ boards })),
    };
    saveAsJson(DEFAULT_FILENAME, data);
  };

  const handleLoad = async (file: File) => {
    try {
      const isValid = (data: unknown): data is CalculoMentalData =>
        typeof data === "object" &&
        data !== null &&
        "groups" in data &&
        Array.isArray((data as CalculoMentalData).groups) &&
        (data as CalculoMentalData).groups.every(
          (g) =>
            Array.isArray(g.boards) &&
            g.boards.every((b) => Array.isArray(b.slots)),
        );

      const data = await loadJsonFile<CalculoMentalData>(file, isValid);
      if (data?.groups) setGroups(data.groups.map((g) => g.boards));
    } catch {
      alert("Error al cargar el archivo JSON.");
    }
  };

  return (
    <WorkspaceShell
      title="Cálculo Mental"
      icon={<Calculator className="h-3 w-3" />}
      badge={`${groups.length} grupo${groups.length !== 1 ? "s" : ""}`}
      actions={
        <FileActions format="json" onSave={handleSave} onLoad={handleLoad} />
      }
    >
      <ScrollArea className="w-full h-full">
        <div
          className="flex min-w-max gap-6 px-8 py-8"
          style={{ height: "calc(100vh - 48px - 36px)" }}
        >
          {groups.map((boards, groupIndex) => (
            <CalculoMentalColumn
              key={groupIndex}
              index={groupIndex + 1}
              boards={boards}
              onSlotChange={(boardIdx, slotIdx, field, val) =>
                updateItem(groupIndex, boardIdx, {
                  ...boards[boardIdx],
                  slots: boards[boardIdx].slots.map((s, i) =>
                    i === slotIdx ? { ...s, [field]: val } : s,
                  ),
                })
              }
              onAddBoard={() => addItem(groupIndex)}
              onRemoveBoard={(boardIdx) => removeItem(groupIndex, boardIdx)}
              onRemoveColumn={() => removeGroup(groupIndex)}
              onQuickLoad={(matrix) => handleQuickLoad(groupIndex, matrix)}
            />
          ))}

          <AddColumnButton
            label="Añadir Grupo"
            sublabel="(Nueva Columna)"
            onClick={addGroup}
            width="w-[240px]"
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </WorkspaceShell>
  );
}
