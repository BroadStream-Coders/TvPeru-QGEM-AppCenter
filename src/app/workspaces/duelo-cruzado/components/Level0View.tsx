"use client";

import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { getColumnData } from "@/helpers/data-processing";
import { Level0Column } from "./Level0Column";

export interface Level0ViewRef {
  getData: () => string[];
  setData: (data: string[]) => void;
}

export const Level0View = forwardRef<Level0ViewRef>((props, ref) => {
  const { groups, addItem, removeItem, updateItem, replaceGroup, setGroups } =
    useWorkspaceGroups<string>([[""]], () => "");

  const courses = useMemo(() => groups[0] || [], [groups]);

  useImperativeHandle(ref, () => ({
    getData: () =>
      courses
        .map((c) => c.trim())
        .filter((c) => c !== "")
        .slice(0, 20),
    setData: (data) => setGroups([data.length > 0 ? data : [""]]),
  }));

  const handleQuickLoad = (matrix: string[][]) => {
    replaceGroup(0, getColumnData(matrix, 0));
  };

  const handleClearAll = () => {
    setGroups([[""]]);
  };

  return (
    <div className="flex min-w-max gap-4 px-6 py-6 h-full justify-center">
      <Level0Column
        index={1}
        courses={courses}
        onCourseChange={(idx, val) => updateItem(0, idx, val)}
        onAddCourse={() => addItem(0)}
        onRemoveCourse={(idx) => removeItem(0, idx)}
        onRemoveColumn={handleClearAll}
        onQuickLoad={handleQuickLoad}
      />
    </div>
  );
});

Level0View.displayName = "Level0View";
