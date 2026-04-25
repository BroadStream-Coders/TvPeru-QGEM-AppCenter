"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { DetectiveRow } from "./Row";

const MAX_CAPACITY = 30;

interface DetectiveRowData {
  original: string;
  corrected: string;
}

interface DetectiveColumnProps {
  index: number;
  rows: DetectiveRowData[];
  onRowChange: (
    rowIndex: number,
    field: keyof DetectiveRowData,
    value: string,
  ) => void;
  onAddRow: () => void;
  onRemoveRow: (rowIndex: number) => void;
  onRemoveCard: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function DetectiveColumn({
  index,
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  onRemoveCard,
  onQuickLoad,
}: DetectiveColumnProps) {
  const handleAddRow = () => {
    if (rows.length >= MAX_CAPACITY) return;
    onAddRow();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveCard}
      currentCapacity={rows.length}
      maxCapacity={MAX_CAPACITY}
      width="w-[650px]"
    >
      <RowsContainer>
        {rows.map((row, rowIndex) => (
          <DetectiveRow
            key={rowIndex}
            index={rowIndex}
            original={row.original}
            corrected={row.corrected}
            onOriginalChange={(val) => onRowChange(rowIndex, "original", val)}
            onCorrectedChange={(val) => onRowChange(rowIndex, "corrected", val)}
            onRemove={() => onRemoveRow(rowIndex)}
          />
        ))}
      </RowsContainer>

      <AddRowButton onClick={handleAddRow} label="Agregar Fila" />

      <GroupFooter>
        <QuickLoad
          onLoad={onQuickLoad}
          placeholder="Pega frases aquí (original [tab] corregida)..."
        />
      </GroupFooter>
    </GroupColumn>
  );
}
