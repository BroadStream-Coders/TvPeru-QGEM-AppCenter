"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { CalculoMentalBoard } from "./CalculoMentalBoard";

const MAX_CAPACITY = 30;

interface SlotData {
  question: string;
  answer: string;
}

interface BoardData {
  slots: SlotData[];
}

interface CalculoMentalColumnProps {
  index: number;
  boards: BoardData[];
  onSlotChange: (
    boardIdx: number,
    slotIdx: number,
    field: "question" | "answer",
    value: string,
  ) => void;
  onAddBoard: () => void;
  onRemoveBoard: (boardIdx: number) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function CalculoMentalColumn({
  index,
  boards,
  onSlotChange,
  onAddBoard,
  onRemoveBoard,
  onRemoveColumn,
  onQuickLoad,
}: CalculoMentalColumnProps) {
  const handleAddBoard = () => {
    if (boards.length >= MAX_CAPACITY) return;
    onAddBoard();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={boards.length}
      maxCapacity={MAX_CAPACITY}
      width="w-[700px]"
    >
      <RowsContainer>
        {boards.map((board, boardIdx) => (
          <CalculoMentalBoard
            key={boardIdx}
            index={boardIdx}
            slots={board.slots}
            onSlotChange={(slotIdx, field, val) =>
              onSlotChange(boardIdx, slotIdx, field, val)
            }
            onRemoveBoard={() => onRemoveBoard(boardIdx)}
          />
        ))}
      </RowsContainer>

      <AddRowButton onClick={handleAddBoard} label="Añadir Tablero" />

      <GroupFooter>
        <QuickLoad
          onLoad={onQuickLoad}
          placeholder="Pegar datos de Excel/Texto para carga rápida..."
        />
      </GroupFooter>
    </GroupColumn>
  );
}
