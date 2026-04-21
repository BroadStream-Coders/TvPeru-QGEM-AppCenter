"use client";

import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { Level2Column } from "./Level2Column";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isIntruso: boolean;
}

interface Round {
  id: string;
  context: string;
  photos: Photo[];
}

interface Level2ViewProps {
  rounds: Round[];
  onAddRound: () => void;
  onRemoveRound: (id: string) => void;
  onAddPhotoToRound: (roundId: string) => void;
  onRemovePhotoFromRound: (roundId: string, photoId: string) => void;
  onUpdatePhotoInRound: (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => void;
  onUpdateRound: (roundId: string, updates: Partial<Round>) => void;
  onQuickLoad: (roundId: string, data: string[][]) => void;
}

export function Level2View({
  rounds,
  onAddRound,
  onRemoveRound,
  onAddPhotoToRound,
  onRemovePhotoFromRound,
  onUpdatePhotoInRound,
  onUpdateRound,
  onQuickLoad,
}: Level2ViewProps) {
  return (
    <GroupsContainer onAddGroup={onAddRound} addLabel="Añadir Ronda">
      {rounds.map((round, roundIndex) => (
        <Level2Column
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
