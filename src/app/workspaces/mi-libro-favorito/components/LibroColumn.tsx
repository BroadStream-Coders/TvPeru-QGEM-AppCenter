"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { LibroRow } from "./LibroRow";

const MAX_CAPACITY = 30;

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface LibroColumnProps {
  index: number;
  items: QuestionAnswer[];
  onItemChange: (
    itemIndex: number,
    field: "question" | "answer",
    value: string,
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function LibroColumn({
  index,
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onRemoveColumn,
  onQuickLoad,
}: LibroColumnProps) {
  const handleAddItem = () => {
    if (items.length >= MAX_CAPACITY) return;
    onAddItem();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={items.length}
      maxCapacity={MAX_CAPACITY}
      width="w-[650px]"
    >
      <RowsContainer>
        {items.map((item, itemIdx) => (
          <LibroRow
            key={itemIdx}
            index={itemIdx}
            question={item.question}
            answer={item.answer}
            onQuestionChange={(val) => onItemChange(itemIdx, "question", val)}
            onAnswerChange={(val) => onItemChange(itemIdx, "answer", val)}
            onRemove={() => onRemoveItem(itemIdx)}
          />
        ))}
      </RowsContainer>

      <AddRowButton onClick={handleAddItem} label="Agregar Pregunta" />

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} />
      </GroupFooter>
    </GroupColumn>
  );
}
