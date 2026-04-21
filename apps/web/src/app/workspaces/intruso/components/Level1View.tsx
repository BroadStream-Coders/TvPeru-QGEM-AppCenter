"use client";

import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { Level1Column } from "./Level1Column";

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

interface Round {
  id: string;
  context: string;
  photos: Photo[];
  options?: Option[];
}

interface Level1ViewProps {
  rounds: Round[];
  onAddRound: () => void;
  onRemoveRound: (id: string) => void;
  onUpdatePhotoInRound: (
    roundId: string,
    photoId: string,
    updates: Partial<Photo>,
  ) => void;
  onUpdateRound: (roundId: string, updates: Partial<Round>) => void;
  onQuickLoad: (roundId: string, data: string[][]) => void;
}

const DEFAULT_OPTION: Option = { text: "", isIntruso: false };

function normalizeOptions(options: Option[] | string[] | undefined): Option[] {
  if (!options || options.length === 0) return [{ ...DEFAULT_OPTION }];
  if (typeof options[0] === "string") {
    return (options as string[]).map((text) => ({ text, isIntruso: false }));
  }
  return options as Option[];
}

export function Level1View({
  rounds,
  onAddRound,
  onRemoveRound,
  onUpdatePhotoInRound,
  onUpdateRound,
  onQuickLoad,
}: Level1ViewProps) {
  return (
    <GroupsContainer onAddGroup={onAddRound} addLabel="Añadir Ronda">
      {rounds.map((round, roundIndex) => (
        <Level1Column
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
