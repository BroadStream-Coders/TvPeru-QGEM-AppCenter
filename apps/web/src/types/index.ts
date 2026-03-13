/**
 * @file types/index.ts
 * Tipos base compartidos entre todos los colectores del QGEM App Center.
 *
 * REGLAS:
 * - Solo van aquí tipos que se usan en 2+ colectores.
 * - Los tipos exclusivos de un colector van en su propio page.tsx o carpeta local.
 * - Siempre usar nanoid() para generar IDs, nunca el índice del array.
 */

// ---------------------------------------------------------------------------
// Primitivos de UI compartidos
// ---------------------------------------------------------------------------

/**
 * Par pregunta / respuesta. Usado en: Deletreo (solo word→answer),
 * Mi Libro Favorito, Cálculo Mental.
 */
export interface SlotQA {
  question: string;
  answer: string;
}

/**
 * Slot de imagen con metadatos. Usado en: Impostor, Mi Libro Favorito,
 * Personajes, y cualquier colector futuro que maneje fotos.
 */
export interface ImageSlot {
  /** ID único generado con nanoid(). Nunca usar el índice del array. */
  id: string;
  name?: string;
  /** Objeto File en memoria (viene del input type="file"). */
  file?: File;
  /** Object URL para preview (generado con URL.createObjectURL). */
  url?: string;
}

// ---------------------------------------------------------------------------
// Estructura de grupos / columnas
// ---------------------------------------------------------------------------

/**
 * Grupo genérico de items. Representa una "columna" o "ronda" en la UI.
 * T es el tipo del item individual (ej. string, SlotQA, ImageSlot...).
 *
 * @example
 * // Colector de palabras (Deletreo)
 * type DeletreoGroup = WorkspaceGroup<string>;
 *
 * @example
 * // Colector de preguntas (Mi Libro Favorito)
 * type LibroGroup = WorkspaceGroup<SlotQA>;
 */
export interface WorkspaceGroup<T> {
  /** ID único generado con nanoid(). */
  id: string;
  items: T[];
}

// ---------------------------------------------------------------------------
// Persistencia
// ---------------------------------------------------------------------------

/**
 * Estructura mínima que todo archivo sessionData.json debe cumplir.
 * Cada colector extiende esto con sus campos específicos.
 *
 * @example
 * interface DeletreoSessionData extends SessionData {
 *   groups: WorkspaceGroup<string>[];
 * }
 */
export interface SessionData {
  /** Versión del schema. Reservado para uso futuro. */
  version?: number;
}

/**
 * Metadatos de una imagen dentro de un ZIP exportado.
 * El campo `path` es la ruta relativa dentro del ZIP (ej. "images/abc_foto.jpg").
 */
export interface ImageMetadata {
  name?: string;
  path: string;
}

// ---------------------------------------------------------------------------
// Validación (infraestructura futura — Bloque 3)
// ---------------------------------------------------------------------------

/**
 * Resultado de validar un workspace antes de exportar.
 * Reservado para el Bloque 3 del todo.md.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  /** Identificador del campo con error (ej. "groups[0].items[2].question") */
  field: string;
  message: string;
}
