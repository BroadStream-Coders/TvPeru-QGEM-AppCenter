"use client";

import { PenTool } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
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

const createEmptyRow = (): RedactorRowData => ({ original: "", corrected: "" });

export default function RedactorPage() {
  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<RedactorRowData>([[createEmptyRow()]], createEmptyRow);

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const rows = matrix.map((row) => ({
      original: (row[0] || "").trim(),
      corrected: (row[1] || "").trim(),
    }));
    if (rows.length > 0) replaceGroup(groupIndex, rows);
  };

  const handleSave = () => {
    const data: RedactorData = { groups: groups.map((rows) => ({ rows })) };
    saveAsJson(DEFAULT_FILENAME, data);
  };

  const handleLoad = async (file: File) => {
    try {
      const isValid = (data: unknown): data is RedactorData =>
        typeof data === "object" &&
        data !== null &&
        "groups" in data &&
        Array.isArray((data as RedactorData).groups) &&
        (data as RedactorData).groups.every((g) => Array.isArray(g.rows));

      const data = await loadJsonFile<RedactorData>(file, isValid);
      if (data?.groups) setGroups(data.groups.map((g) => g.rows));
    } catch {
      alert("Error al cargar el archivo JSON.");
    }
  };

  return (
    <WorkspaceShell
      title="Redactor"
      icon={<PenTool className="h-3 w-3" />}
      badge={`${groups.length} ronda${groups.length !== 1 ? "s" : ""}`}
      actions={
        <FileActions format="json" onSave={handleSave} onLoad={handleLoad} />
      }
    >
      <GroupsContainer onAddGroup={addGroup} addLabel="Agregar ronda">
        {groups.map((rows, groupIndex) => (
          <RedactorCard
            key={groupIndex}
            index={groupIndex + 1}
            rows={rows}
            onRowChange={(rowIdx, field, val) =>
              updateItem(groupIndex, rowIdx, {
                ...rows[rowIdx],
                [field]: val,
              })
            }
            onAddRow={() => addItem(groupIndex)}
            onRemoveRow={(rowIdx) => removeItem(groupIndex, rowIdx)}
            onRemoveCard={() => removeGroup(groupIndex)}
            onQuickLoad={(matrix) => handleQuickLoad(groupIndex, matrix)}
          />
        ))}
      </GroupsContainer>
    </WorkspaceShell>
  );
}
