export type Direction = "H" | "V";

export interface SequenceData {
  values: string[];
  position: { x: number; y: number };
  direction: { x: number; y: number };
  hiddenIndexes?: number[];
}

export interface Operation {
  id: string;
  text: string;
  direction: Direction;
  sequence?: SequenceData;
}

export interface BoardData {
  id: string;
  grid: string[][];
  operations: Operation[];
}

export interface RoundData {
  id: string;
  boards: BoardData[];
}
