"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { TitleInput } from "@/components/shared/group-column/components/TitleInput";

const MAX_CAPACITY = 30;

interface ExamenGroupColumnProps {
  index: number;
  title: string;
  onTitleChange: (value: string) => void;
  itemCount: number;
  onAddRow: () => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
  children: React.ReactNode;
}

export function ExamenGroupColumn({
  index,
  title,
  onTitleChange,
  itemCount,
  onAddRow,
  onRemoveColumn,
  onQuickLoad,
  children,
}: ExamenGroupColumnProps) {
  const handleAddRow = () => {
    if (itemCount >= MAX_CAPACITY) return;
    onAddRow();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={itemCount}
      maxCapacity={MAX_CAPACITY}
    >
      <TitleInput
        value={title}
        onChange={onTitleChange}
        placeholder="Nombre del grupo..."
      />

      <RowsContainer>{children}</RowsContainer>

      <AddRowButton onClick={handleAddRow} label="Agregar Fila" />

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} />
      </GroupFooter>
    </GroupColumn>
  );
}
