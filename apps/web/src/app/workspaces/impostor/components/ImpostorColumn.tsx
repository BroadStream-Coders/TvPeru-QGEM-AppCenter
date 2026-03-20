"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { DescriptionInput } from "@/components/shared/group-column/components/DescriptionInput";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { ImpostorCard } from "./ImpostorCard";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface ImpostorColumnProps {
  index: number;
  photos: Photo[];
  context: string;
  onAddPhoto: () => void;
  onRemovePhoto: (id: string) => void;
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => void;
  onUpdateRound: (updates: Partial<{ context: string }>) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function ImpostorColumn({
  index,
  photos,
  context,
  onAddPhoto,
  onRemovePhoto,
  onUpdatePhoto,
  onUpdateRound,
  onRemoveColumn,
  onQuickLoad,
}: ImpostorColumnProps) {
  const handleAddPhoto = () => {
    if (photos.length >= 4) return;
    onAddPhoto();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={photos.length}
      maxCapacity={4}
    >
      <DescriptionInput
        value={context}
        onChange={(val) => onUpdateRound({ context: val })}
        placeholder="Escribe el contexto para esta ronda..."
      />

      <RowsContainer>
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <ImpostorCard
              key={photo.id}
              id={photo.id}
              name={photo.name}
              imageUrl={photo.url}
              isImpostor={photo.isImpostor}
              onImageChange={(file, url) =>
                onUpdatePhoto(photo.id, { file, url })
              }
              onNameChange={(name) => onUpdatePhoto(photo.id, { name })}
              onToggleImpostor={() =>
                onUpdatePhoto(photo.id, { isImpostor: !photo.isImpostor })
              }
              onRemove={() => onRemovePhoto(photo.id)}
            />
          ))}
        </div>
      </RowsContainer>

      <AddRowButton onClick={handleAddPhoto} label="Agregar Foto" />

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} />
      </GroupFooter>
    </GroupColumn>
  );
}
