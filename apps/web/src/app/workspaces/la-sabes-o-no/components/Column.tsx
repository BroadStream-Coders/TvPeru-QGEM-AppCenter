"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { TitleInput } from "@/components/shared/group-column/components/TitleInput";
import { Row, RowData } from "./Row";

const MAX_CAPACITY = 30;

export interface ColumnData {
  title: string;
  rows: RowData[];
}

interface ColumnProps {
  index: number;
  title: string;
  onTitleChange: (value: string) => void;
  rows: RowData[];
  onAddRow: () => void;
  onRemoveColumn: () => void;
  onUpdateRow: (rowIndex: number, updates: Partial<RowData>) => void;
  onRemoveRow: (rowIndex: number) => void;
  onQuickLoad: (data: string[][]) => void;
}

export function Column({
  index,
  title,
  onTitleChange,
  rows,
  onAddRow,
  onRemoveColumn,
  onUpdateRow,
  onRemoveRow,
  onQuickLoad,
}: ColumnProps) {
  const handleAddRow = () => {
    if (rows.length >= MAX_CAPACITY) return;
    onAddRow();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={rows.length}
      maxCapacity={MAX_CAPACITY}
    >
      <TitleInput
        value={title}
        onChange={onTitleChange}
        placeholder="Nombre del grupo..."
      />

      <RowsContainer>
        {rows.map((row, rowIndex) => (
          <Row
            key={row.id}
            index={rowIndex}
            data={row}
            onChange={(updates) => onUpdateRow(rowIndex, updates)}
            onRemove={() => onRemoveRow(rowIndex)}
          />
        ))}
      </RowsContainer>

      <AddRowButton onClick={handleAddRow} label="Agregar Fila" />

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} />
      </GroupFooter>
    </GroupColumn>
  );
}
