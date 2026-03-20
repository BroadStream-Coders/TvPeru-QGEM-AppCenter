"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { TitleInput } from "@/components/shared/group-column/components/TitleInput";
import { ImageSlot } from "@/types";
import { AlbumCard } from "./AlbumCard";

const MAX_PHOTOS = 5;

interface AlbumColumnProps {
  index: number;
  photos: ImageSlot[];
  context: string;
  onUpdatePhoto: (id: string, updates: Partial<ImageSlot>) => void;
  onUpdateRound: (updates: Partial<{ context: string }>) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function AlbumColumn({
  index,
  photos,
  context,
  onUpdatePhoto,
  onUpdateRound,
  onRemoveColumn,
  onQuickLoad,
}: AlbumColumnProps) {
  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={MAX_PHOTOS}
      maxCapacity={MAX_PHOTOS}
    >
      <TitleInput
        value={context}
        onChange={(val) => onUpdateRound({ context: val })}
        placeholder="Título..."
      />

      <RowsContainer>
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <AlbumCard
              key={photo.id}
              id={photo.id}
              name={photo.name}
              imageUrl={photo.url}
              isCroma={photo.isCroma}
              onImageChange={(file, url) =>
                onUpdatePhoto(photo.id, { file, url })
              }
              onNameChange={(name) => onUpdatePhoto(photo.id, { name })}
              onToggleCroma={() =>
                onUpdatePhoto(photo.id, { isCroma: !photo.isCroma })
              }
            />
          ))}
        </div>
      </RowsContainer>

      <GroupFooter>
        <QuickLoad onLoad={onQuickLoad} />
      </GroupFooter>
    </GroupColumn>
  );
}
