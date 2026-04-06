export type CardMode = "image" | "text" | "both";

export interface CardContent {
  mode: CardMode;
  imageFile?: File;
  imageUrl?: string;
  text: string;
}

export interface PairData {
  cartaA: CardContent;
  cartaB: CardContent;
}

export interface DeParEnParSessionData {
  cells: {
    cardA: {
      type: number;
      text: string;
      pictureFile: string;
    };
    cardB: {
      type: number;
      text: string;
      pictureFile: string;
    };
  }[];
  answer: string[];
}
