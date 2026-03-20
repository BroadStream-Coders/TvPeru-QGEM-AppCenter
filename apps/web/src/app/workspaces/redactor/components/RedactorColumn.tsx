"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { RedactorRow } from "./RedactorRow";

const MAX_CAPACITY = 30;

interface RedactorRowData {
  original: string;
  corrected: string;
}

interface RedactorCardProps {
  index: number;
  rows: RedactorRowData[];
  onRowChange: (
    rowIndex: number,
    field: keyof RedactorRowData,
    value: string,
  ) => void;
  onAddRow: () => void;
  onRemoveRow: (rowIndex: number) => void;
  onRemoveCard: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function RedactorCard({
  index,
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  onRemoveCard,
  onQuickLoad,
}: RedactorCardProps) {
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
          <RedactorRow
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
