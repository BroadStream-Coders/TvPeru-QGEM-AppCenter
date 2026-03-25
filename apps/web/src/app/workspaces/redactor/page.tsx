"use client";

import { useEffect } from "react";

import { PenTool } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
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

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

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

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Redactor",
      icon: <PenTool className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader]);

  return (
    <main className="flex-1 overflow-hidden">
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
    </main>
  );
}
