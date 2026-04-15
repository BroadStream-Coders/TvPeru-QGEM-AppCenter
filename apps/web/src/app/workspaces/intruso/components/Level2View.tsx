"use client";

import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { ImpostorColumn } from "./Column";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface ImpostorRound {
  id: string;
  context: string;
  photos: Photo[];
}

interface ImpostorLevel2ViewProps {
  rounds: ImpostorRound[];
  onAddRound: () => void;
  onRemoveRound: (id: string) => void;
  onAddPhotoToRound: (roundId: string) => void;
  onRemovePhotoFromRound: (roundId: string, photoId: string) => void;
  onUpdatePhotoInRound: (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => void;
  onUpdateRound: (roundId: string, updates: Partial<ImpostorRound>) => void;
  onQuickLoad: (roundId: string, data: string[][]) => void;
}

export function ImpostorLevel2View({
  rounds,
  onAddRound,
  onRemoveRound,
  onAddPhotoToRound,
  onRemovePhotoFromRound,
  onUpdatePhotoInRound,
  onUpdateRound,
  onQuickLoad,
}: ImpostorLevel2ViewProps) {
  return (
    <GroupsContainer onAddGroup={onAddRound} addLabel="Añadir Ronda">
      {rounds.map((round, roundIndex) => (
        <ImpostorColumn
          key={round.id}
          index={roundIndex + 1}
          photos={round.photos}
          context={round.context}
          onAddPhoto={() => onAddPhotoToRound(round.id)}
          onRemovePhoto={(photoId) => onRemovePhotoFromRound(round.id, photoId)}
          onUpdatePhoto={(photoId, updates) =>
            onUpdatePhotoInRound(round.id, photoId, updates)
          }
          onUpdateRound={(updates) => onUpdateRound(round.id, updates)}
          onRemoveColumn={() => onRemoveRound(round.id)}
          onQuickLoad={(matrix) => onQuickLoad(round.id, matrix)}
        />
      ))}
    </GroupsContainer>
  );
}
