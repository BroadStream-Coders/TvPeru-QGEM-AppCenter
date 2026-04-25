"use client";

import { useEffect, useCallback } from "react";

import { Search } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { DetectiveColumn } from "./components/Column";

const DEFAULT_FILENAME = "DetectiveLiterario.json";

interface RowData {
  original: string;
  corrected: string;
}

interface GroupData {
  rows: RowData[];
}

interface SessionData {
  groups: GroupData[];
}

const createEmptyRow = (): RowData => ({
  original: "",
  corrected: "",
});

export default function DetectiveLiterarioPage() {
  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<RowData>([[createEmptyRow()]], createEmptyRow);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const rows = matrix.map((row) => ({
      original: (row[0] || "").trim(),
      corrected: (row[1] || "").trim(),
    }));
    if (rows.length > 0) replaceGroup(groupIndex, rows);
  };

  const handleSave = useCallback(() => {
    const data: SessionData = { groups: groups.map((rows) => ({ rows })) };
    saveAsJson(DEFAULT_FILENAME, data);
  }, [groups]);

  const handleLoad = useCallback(
    async (file: File) => {
      try {
        const isValid = (data: unknown): data is SessionData =>
          typeof data === "object" &&
          data !== null &&
          "groups" in data &&
          Array.isArray((data as SessionData).groups) &&
          (data as SessionData).groups.every((g) => Array.isArray(g.rows));

        const data = await loadJsonFile<SessionData>(file, isValid);
        if (data?.groups) setGroups(data.groups.map((g) => g.rows));
      } catch {
        alert("Error al cargar el archivo JSON.");
      }
    },
    [setGroups],
  );

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Detective Literario",
      icon: <Search className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader, handleSave, handleLoad]);

  return (
    <main className="flex-1 overflow-hidden">
      <GroupsContainer onAddGroup={addGroup} addLabel="Agregar ronda">
        {groups.map((rows, groupIndex) => (
          <DetectiveColumn
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
