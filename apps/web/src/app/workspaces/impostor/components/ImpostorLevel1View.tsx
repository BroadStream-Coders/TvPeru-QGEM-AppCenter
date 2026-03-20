"use client";

import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { ImpostorLevel1Column } from "./ImpostorLevel1Column";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface Option {
  text: string;
  isImpostor: boolean;
}

interface ImpostorRound {
  id: string;
  context: string;
  photos: Photo[];
  options?: Option[];
}

interface ImpostorLevel1ViewProps {
  rounds: ImpostorRound[];
  onAddRound: () => void;
  onRemoveRound: (id: string) => void;
  onUpdatePhotoInRound: (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => void;
  onUpdateRound: (roundId: string, updates: Partial<ImpostorRound>) => void;
  onQuickLoad: (roundId: string, data: string[][]) => void;
}

const DEFAULT_OPTION: Option = { text: "", isImpostor: false };

function normalizeOptions(options: Option[] | string[] | undefined): Option[] {
  if (!options || options.length === 0) return [{ ...DEFAULT_OPTION }];
  if (typeof options[0] === "string") {
    return (options as string[]).map((text) => ({ text, isImpostor: false }));
  }
  return options as Option[];
}

export function ImpostorLevel1View({
  rounds,
  onAddRound,
  onRemoveRound,
  onUpdatePhotoInRound,
  onUpdateRound,
  onQuickLoad,
}: ImpostorLevel1ViewProps) {
  return (
    <GroupsContainer onAddGroup={onAddRound} addLabel="Añadir Ronda">
      {rounds.map((round, roundIndex) => (
        <ImpostorLevel1Column
          key={round.id}
          index={roundIndex + 1}
          photo={round.photos[0]}
          context={round.context}
          options={normalizeOptions(round.options)}
          onUpdatePhoto={(updates) =>
            onUpdatePhotoInRound(round.id, round.photos[0].id, updates)
          }
          onUpdateRound={(updates) => onUpdateRound(round.id, updates)}
          onRemoveColumn={() => onRemoveRound(round.id)}
          onQuickLoad={(matrix) => onQuickLoad(round.id, matrix)}
        />
      ))}
    </GroupsContainer>
  );
}
