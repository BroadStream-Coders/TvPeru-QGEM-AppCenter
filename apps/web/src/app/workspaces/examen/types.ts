// ── Tipos del JSON de exportación/importación ──

export interface ExamenQuestionL1 {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ExamenQuestionL2 {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ExamenQuestionL3 {
  pairs: { leftText: string; rightText: string }[];
}

export interface ExamenQuestionL4 {
  question: string;
  answer: string;
}

export interface ExamenGroup<T> {
  title: string;
  questions: T[];
}

export interface ExamenSessionData {
  level1: { groups: ExamenGroup<ExamenQuestionL1>[] };
  level2: { groups: ExamenGroup<ExamenQuestionL2>[] };
  level3: { groups: ExamenGroup<ExamenQuestionL3>[] };
  level4: { groups: ExamenGroup<ExamenQuestionL4>[] };
}
