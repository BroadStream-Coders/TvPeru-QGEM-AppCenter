export interface SlotQA {
  question: string;
  answer: string;
}

export interface ImageSlot {
  id: string;
  name?: string;
  file?: File;
  url?: string;
}

export interface WorkspaceGroup<T> {
  id: string;
  items: T[];
}

export interface SessionData {
  version?: number;
}

export interface ImageMetadata {
  name?: string;
  path: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
