"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { DueloCruzadoRow } from "./DueloCruzadoRow";

const MAX_CAPACITY = 20;

interface DueloCruzadoColumnProps {
  index: number;
  courses: string[];
  onCourseChange: (courseIndex: number, value: string) => void;
  onAddCourse: () => void;
  onRemoveCourse: (courseIndex: number) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function DueloCruzadoColumn({
  index,
  courses,
  onCourseChange,
  onAddCourse,
  onRemoveCourse,
  onRemoveColumn,
  onQuickLoad,
}: DueloCruzadoColumnProps) {
  const handleAddCourse = () => {
    if (courses.length >= MAX_CAPACITY) return;
    onAddCourse();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={courses.length}
      maxCapacity={MAX_CAPACITY}
    >
      <RowsContainer>
        {courses.map((course, courseIndex) => (
          <DueloCruzadoRow
            key={courseIndex}
            index={courseIndex}
            value={course}
            onChange={(val) => onCourseChange(courseIndex, val)}
            onRemove={() => onRemoveCourse(courseIndex)}
          />
        ))}
      </RowsContainer>

      <AddRowButton onClick={handleAddCourse} label="Agregar Curso" />

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} placeholder="Pega tus cursos aquí..." />
      </GroupFooter>
    </GroupColumn>
  );
}
