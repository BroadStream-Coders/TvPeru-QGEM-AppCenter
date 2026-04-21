"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { DescriptionInput } from "@/components/shared/group-column/components/DescriptionInput";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { X, AlertCircle } from "lucide-react";
import { Card } from "./Card";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isIntruso: boolean;
}

interface Option {
  text: string;
  isIntruso: boolean;
}

interface Level1ColumnProps {
  index: number;
  photo: Photo;
  context: string;
  options: Option[];
  onUpdatePhoto: (updates: Partial<Photo>) => void;
  onUpdateRound: (updates: { context?: string; options?: Option[] }) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function Level1Column({
  index,
  photo,
  context,
  options,
  onUpdatePhoto,
  onUpdateRound,
  onRemoveColumn,
  onQuickLoad,
}: Level1ColumnProps) {
  const addOption = () => {
    if (options.length < 4) {
      onUpdateRound({ options: [...options, { text: "", isIntruso: false }] });
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== idx);
      onUpdateRound({ options: newOptions });
    }
  };

  const updateOptionText = (idx: number, text: string) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], text };
    onUpdateRound({ options: newOptions });
  };

  const toggleOptionIntruso = (idx: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isIntruso: i === idx ? !opt.isIntruso : false,
    }));
    onUpdateRound({ options: newOptions });
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={options.length}
      maxCapacity={4}
    >
      <DescriptionInput
        value={context}
        onChange={(val) => onUpdateRound({ context: val })}
        placeholder="Escribe el contexto..."
      />

      <RowsContainer>
        {/* Imagen única */}
        <div className="space-y-1.5">
          <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/60 px-1">
            Imagen única
          </label>
          <div className="px-2">
            <Card
              id={photo.id}
              name={photo.name}
              imageUrl={photo.url}
              isIntruso={false}
              onImageChange={(file, url) => onUpdatePhoto({ file, url })}
              onNameChange={() => {}}
              onToggleIntruso={() => {}}
              onRemove={() => {}}
              variant="simple"
              hideName={true}
              crop={{ x: 21, y: 9 }}
            />
          </div>
        </div>

        {/* Opciones */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/60">
              Opciones ({options.length}/4)
            </label>
          </div>

          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="group relative">
                <div
                  className={`flex items-center gap-2 rounded-md border transition-all ${
                    option.isIntruso
                      ? "border-brand bg-brand/5 ring-1 ring-brand/20 shadow-sm"
                      : "border-border bg-background/50"
                  }`}
                >
                  <button
                    onClick={() => toggleOptionIntruso(idx)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-l-md border-r transition-colors ${
                      option.isIntruso
                        ? "bg-brand text-brand-foreground border-brand/20"
                        : "bg-muted/30 text-muted-foreground/30 hover:text-brand hover:bg-brand/10"
                    }`}
                  >
                    <AlertCircle
                      className={`h-4 w-4 ${option.isIntruso ? "animate-pulse" : ""}`}
                    />
                  </button>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOptionText(idx, e.target.value)}
                    placeholder={`Opción ${idx + 1}...`}
                    className="flex-1 bg-transparent px-2 text-xs focus:outline-none placeholder:text-muted-foreground/30 h-9"
                  />
                  {options.length > 1 && (
                    <button
                      onClick={() => removeOption(idx)}
                      className="mr-2 text-muted-foreground/30 hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </RowsContainer>

      <AddRowButton onClick={addOption} label="Agregar Opción" />

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} />
      </GroupFooter>
    </GroupColumn>
  );
}
