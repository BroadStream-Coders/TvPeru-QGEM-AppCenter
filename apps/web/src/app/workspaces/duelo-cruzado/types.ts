// ── Tipos del JSON de exportación/importación ──

export interface QuestionLevel1 {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuestionLevel2 {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuestionLevel3 {
  pairs: { leftText: string; rightText: string }[];
}

export interface QuestionLevel4 {
  question: string;
  answer: string;
}

export interface QuestionLevel5 {
  imagePath: string;
}

export interface GroupLevel<T> {
  title: string;
  questions: T[];
}

export interface SessionData {
  level0: { courses: string[] };
  level1: { groups: GroupLevel<QuestionLevel1>[] };
  level2: { groups: GroupLevel<QuestionLevel2>[] };
  level3: { groups: GroupLevel<QuestionLevel3>[] };
  level4: { groups: GroupLevel<QuestionLevel4>[] };
  level5?: { groups: GroupLevel<QuestionLevel5>[] };
}
