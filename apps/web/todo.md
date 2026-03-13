# QGEM App Center — Hoja de Ruta del Proyecto

## Contexto del Proyecto

**Qué es**: Sistema web de recolección de datos para el programa de TV en vivo _Que Gane el Mejor_ (TV Perú). Los especialistas de producción llenan la información de cada juego **antes del en vivo**, el desarrollador exporta los archivos (JSON/ZIP), los carga en un cliente **Unity** que los lee y renderiza los juegos en pantalla durante la transmisión.

**Usuarios de la app**: Personas con bajo perfil técnico (profesores universitarios, productores de contenido). La interfaz debe ser clara, con feedback visible y errores comprensibles.

**Escala**: Sistema cerrado, máximo 5 usuarios simultáneos. El volumen no es el problema — la **velocidad de desarrollo** sí lo es: hay que entregar 8 colectores en ~1 mes.

**Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui (new-york), TypeScript strict.

**Decisiones tomadas**:

- Exportación siempre por archivo (JSON o ZIP con imágenes). Sin backend, sin base de datos.
- Tema dark por defecto, diseño con variables CSS propias (`--brand`, `--success`, etc.).
- Cada colector tiene su propio schema de JSON (no hay schema global). Los componentes de UI sí se comparten.

---

## Estado Actual (diagnóstico)

Cada `page.tsx` de workspace mezcla 4 responsabilidades:

1. Renderizado del header (con botones Cargar/Guardar)
2. Gestión completa del estado
3. Lógica de persistencia (save/load JSON o ZIP)
4. Layout y orquestación de columnas

Esto produce archivos de 200–350 líneas, y componentes casi idénticos duplicados (`DeletreoColumn`, `LibroColumn`, `RedactorColumn`) que solo difieren en su interior.

**Consecuencia directa**: agregar un colector nuevo tarda el doble de lo necesario y cualquier cambio global (ej. cambiar el estilo del header, agregar validación al guardado) hay que repetirlo en cada archivo.

---

## Principios de Diseño del Código

1. **Un colector = un `page.tsx` liviano**. El `page.tsx` solo orquesta estado y callbacks. Todo lo visual y estructural viene de componentes compartidos.
2. **Componentes por contrato, no por contenido**. Los componentes compartidos reciben `children` y props semánticas; no saben qué juego son.
3. **DRY en UI, flexible en schema**. Los schemas JSON pueden ser distintos por colector — está bien. Los inputs, columnas, headers y acciones de archivo deben ser siempre los mismos componentes.
4. **Feedback visible siempre**. Los usuarios no son técnicos. Estados de carga, errores y confirmaciones deben ser explícitos.
5. **Sin over-engineering**. No hay multi-usuario, no hay auth, no hay backend. No agregar complejidad que no resuelve un problema real hoy.

---

## Estructura de Carpetas Objetivo

```
src/
├── app/
│   ├── page.tsx                          # Home (ya OK)
│   ├── layout.tsx                        # Root layout (ya OK)
│   └── workspaces/
│       ├── layout.tsx                    # WorkspaceLayout: footer siempre presente
│       ├── [nombre-colector]/
│       │   ├── page.tsx                  # SOLO: estado + callbacks + schema
│       │   └── components/              # Componentes privados del colector
│       └── ...
├── components/
│   ├── shared/
│   │   ├── WorkspaceShell.tsx           # [NUEVO] Header declarativo del workspace
│   │   ├── FileActions.tsx              # [NUEVO] Botones Cargar/Guardar unificados
│   │   ├── BoardColumn.tsx              # [NUEVO] Columna genérica con header + scroll + footer
│   │   ├── AddColumnButton.tsx          # [NUEVO] Botón ghost dashed "Añadir X"
│   │   ├── ImagePicker.tsx              # [NUEVO] Componente visual wrapper de use-image-picker
│   │   └── QuickLoad.tsx                # [YA EXISTE — mantener]
│   └── ui/                              # shadcn/ui (no tocar)
├── hooks/
│   ├── use-image-picker.ts              # [YA EXISTE — mantener]
│   └── use-workspace-groups.ts          # [NUEVO] Hook genérico para estado de grupos/columnas
├── helpers/
│   ├── persistence.ts                   # [YA EXISTE — mantener]
│   └── data-processing.ts              # [YA EXISTE — mantener]
├── types/
│   └── index.ts                         # [NUEVO] Tipos compartidos entre colectores
└── lib/
    └── utils.ts                         # [YA EXISTE — mantener]
```

---

## Hoja de Ruta — Tareas Ordenadas por Prioridad

### BLOQUE 0 — Fundamentos (hacer ANTES de cualquier colector nuevo)

> Objetivo: tener la base lista para que cada colector nuevo tarde 1/3 del tiempo actual.
> Estimado: 1–2 días de trabajo.

#### 0.1 — Crear `/src/types/index.ts`

- [ ] Definir tipos base reutilizables:
  ```ts
  export interface GroupBase<T> {
    id: string; // usar nanoid() siempre
    items: T[];
  }
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
  ```
- [ ] Migrar interfaces duplicadas de los `page.tsx` existentes a este archivo.
- [ ] Todos los colectores importan tipos desde `@/types`.

#### 0.2 — Crear `WorkspaceShell.tsx`

**Responsabilidad**: Renderizar el header completo del workspace. Elimina el `<header>` duplicado en cada `page.tsx`.

Props esperadas:

```ts
interface WorkspaceShellProps {
  title: string;
  icon: React.ReactNode;
  badge?: string; // ej. "3 rondas"
  actions?: React.ReactNode; // botones Cargar/Guardar
  children: React.ReactNode;
}
```

- [ ] Incluye: botón "Volver", separador, ícono + título, badge opcional, slot de acciones a la derecha.
- [ ] Renderiza `<main className="flex-1 overflow-hidden">` alrededor de `children`.
- [ ] El footer lo provee `workspaces/layout.tsx` (ya existe — no duplicar).
- [ ] Usar en `deletreo/page.tsx` como prueba. Si funciona, migrar todos.

#### 0.3 — Crear `FileActions.tsx`

**Responsabilidad**: Botones "Cargar" y "Guardar" con el `<input type="file" hidden>` incluido.

Variantes necesarias (prop `format`):

- `"json"` → acepta `.json`, llama `onSave()` y `onLoad(file)`
- `"zip"` → acepta `.zip`, llama `onSave()` y `onLoad(file)`

```ts
interface FileActionsProps {
  format: "json" | "zip";
  onSave: () => void;
  onLoad: (file: File) => void;
  saveLabel?: string; // default: "Guardar"
}
```

- [ ] El componente maneja internamente el `useRef<HTMLInputElement>` y el `onChange`.
- [ ] El `page.tsx` solo recibe el `File` y lo procesa — no gestiona el input.

#### 0.4 — Crear `BoardColumn.tsx`

**Responsabilidad**: Columna genérica que reemplaza `DeletreoColumn`, `LibroColumn`, `RedactorColumn`, `CalculoMentalColumn`.

```ts
interface BoardColumnProps {
  index: number; // número de la columna (para el badge)
  title: string; // ej. "Ronda 1", "Grupo 1"
  itemCount?: number; // badge de cantidad
  width?: string; // default: "w-[320px]"
  onRemove: () => void;
  footer?: React.ReactNode; // slot para QuickLoad u otro
  addButton?: React.ReactNode; // slot para "Añadir ítem"
  children: React.ReactNode; // los rows/cards del colector
}
```

- [ ] Incluye: `CardHeader` con índice, título, badge, botón eliminar.
- [ ] `CardContent` con `ScrollArea` vertical.
- [ ] Slot `footer` en `CardFooter`.
- [ ] Slot `addButton` justo antes del footer, dentro del scroll o fuera (a definir).

#### 0.5 — Crear `AddColumnButton.tsx`

**Responsabilidad**: El botón ghost dashed de "Añadir ronda / Añadir grupo" que aparece al final del scroll horizontal. Actualmente duplicado en todos los `page.tsx`.

```ts
interface AddColumnButtonProps {
  label: string; // ej. "Añadir ronda"
  sublabel?: string; // ej. "(Nueva Columna)"
  onClick: () => void;
  width?: string; // default: "w-[180px]"
}
```

#### 0.6 — Crear `use-workspace-groups.ts`

**Responsabilidad**: Hook genérico para la lógica de estado de grupos con items. Elimina el patrón `addGroup / removeGroup / addItemToGroup / updateItem / removeItem` duplicado en cada `page.tsx`.

```ts
function useWorkspaceGroups<TItem>(
  initialGroups: TItem[][],
  createEmptyItem: () => TItem
): {
  groups: TItem[][];
  addGroup: () => void;
  removeGroup: (index: number) => void;
  addItem: (groupIndex: number) => void;
  removeItem: (groupIndex: number, itemIndex: number) => void;
  updateItem: (groupIndex: number, itemIndex: number, value: TItem) => void;
  replaceGroup: (groupIndex: number, items: TItem[]) => void; // para QuickLoad
  setGroups: Dispatch<...>; // escape hatch para casos complejos
}
```

- [ ] Usar genéricos de TypeScript para que funcione con cualquier tipo de item.
- [ ] `replaceGroup` reemplaza todos los items de un grupo (necesario para QuickLoad).

#### 0.7 — Crear `ImagePicker.tsx` (componente visual)

**Responsabilidad**: Componente visual que envuelve `use-image-picker`. Actualmente el hook se usa con boilerplate repetido en `ImpostorCard`, `PersonajeSlot`, `PlayerSlot`.

```ts
interface ImagePickerProps {
  value?: string; // URL preview externa (para carga desde ZIP)
  onChange: (file: File, url: string) => void;
  aspectRatio?: "square" | "portrait" | "landscape"; // default: square
  placeholder?: string;
}
```

- [ ] El componente muestra la imagen si hay preview, o el estado vacío con botón.
- [ ] Maneja internamente el `fileInputRef`, el `triggerUpload` y el cleanup de URL.
- [ ] Sincroniza con `value` externo via `useEffect` (igual que hoy en los componentes que lo usan).

---

### BLOQUE 1 — Migración de colectores existentes

> Objetivo: aplicar los componentes del Bloque 0 a los colectores ya construidos.
> Hacer en este orden (de más simple a más complejo).
> Estimado: 1 día.

- [ ] **1.1** Migrar `deletreo` → usa `WorkspaceShell`, `FileActions`, `BoardColumn`, `AddColumnButton`, `use-workspace-groups`
- [ ] **1.2** Migrar `redactor` → igual que deletreo (estructura casi idéntica)
- [ ] **1.3** Migrar `mi-libro-favorito` → igual + `ImagePicker` para `PlayersColumn`
- [ ] **1.4** Migrar `calculo-mental` → usa `BoardColumn` con ancho custom (`w-[700px]`)
- [ ] **1.5** Migrar `impostor` → el más complejo, migrar al final; usa `ImagePicker` en `ImpostorCard`
- [ ] **1.6** Revisar `personajes` → usa `ImagePicker`, simplificar `PersonajeSlot`

**Criterio de "migrado"**: el `page.tsx` del colector no tiene `<header>`, no tiene `useRef<HTMLInputElement>`, y tiene menos de 120 líneas.

---

### BLOQUE 2 — Nuevos colectores

> Con el Bloque 0 listo, cada nuevo colector solo necesita:
>
> 1. Crear la carpeta `workspaces/[nombre]/`
> 2. Definir el schema de datos en `types/index.ts` o localmente
> 3. Escribir `page.tsx` (estado + callbacks, ~80 líneas)
> 4. Crear componentes privados solo si la UI es única al colector

**Colectores pendientes** (ordenar según prioridad de producción):

- [ ] Colector 7: _(nombre pendiente)_
- [ ] Colector 8: _(nombre pendiente)_
- [ ] Colector 9+: _(definir)_

**Template para nuevo colector** (crear como `_template/` en workspaces):

- [ ] Crear `workspaces/_template/page.tsx` con la estructura mínima comentada
- [ ] Documentar en el template qué va en `page.tsx` y qué va en `components/`

---

### BLOQUE 3 — Validaciones antes de exportar

> No bloquea los Bloques 0–2. Implementar cuando los colectores estén estables.

El sistema de validación debe ser **por colector** (cada juego tiene reglas distintas) pero usar una **infraestructura compartida**.

#### 3.1 — Definir contrato de validación

- [ ] Crear tipo `ValidationRule<T>` y función `validateWorkspace(data: T, rules: ValidationRule<T>[]): ValidationResult`
- [ ] `ValidationResult` incluye: `isValid: boolean`, `errors: { field: string, message: string }[]`

#### 3.2 — Componente `ValidationSummary`

- [ ] Muestra errores antes de permitir guardar
- [ ] Se integra en `FileActions` como prop opcional `validate?: () => ValidationResult`
- [ ] Si `validate` retorna errores, el botón Guardar muestra un modal/toast con la lista antes de ejecutar

#### 3.3 — Reglas comunes a implementar

- [ ] Campo de texto requerido (no vacío)
- [ ] Imagen requerida en slot
- [ ] Mínimo N items en un grupo
- [ ] Longitud máxima de texto (útil para palabras de Deletreo)

---

### BLOQUE 4 — Pulido y documentación

> Para cuando todo lo anterior esté estable. No es urgente.

- [ ] **4.1** Escribir `README.md` completo: qué es el proyecto, cómo correrlo, cómo crear un colector nuevo
- [ ] **4.2** Documentar el contrato del schema de Unity: qué espera leer Unity de cada colector (para evitar romper la integración)
- [ ] **4.3** Agregar JSDoc a los helpers `persistence.ts` y `data-processing.ts`
- [ ] **4.4** Revisar consistencia visual: hover states, transiciones, spacing — una pasada final
- [ ] **4.5** Considerar `nanoid` como dependencia explícita en todos los colectores que crean IDs (impostor ya lo usa)

---

## Convenciones del Proyecto

### Nombrado

- Componentes compartidos: `PascalCase.tsx` en `components/shared/`
- Componentes privados de colector: `PascalCase.tsx` en `workspaces/[colector]/components/`
- Hooks: `use-kebab-case.ts` en `hooks/`
- Helpers: `kebab-case.ts` en `helpers/`
- Tipos: `PascalCase` exportados desde `@/types`

### IDs de entidades

- Siempre usar `nanoid()` para IDs de rondas, fotos, etc. Nunca usar el índice del array como ID.

### Estado

- El estado vive en `page.tsx`. Los componentes son controlados (reciben valor + callback).
- No usar estado local en componentes de columna excepto para UI efímera (ej. hover, focus).

### Exportación

- JSON: para colectores sin imágenes. Nombre: `[NombreColector].json`
- ZIP: para colectores con imágenes. Nombre: `[NombreColector].zip`. Siempre incluir `sessionData.json` dentro.
- El schema interno del ZIP siempre usa `sessionData.json` como entrada (no `data.json` — hay un caso legacy en Impostor a limpiar).

### Colectores sin imágenes → `saveAsJson` / `loadJsonFile`

### Colectores con imágenes → `saveAsZip` / `loadZipFile`

---

## Checklist de "Colector Listo para Producción"

Antes de considerar un colector terminado, debe cumplir:

- [ ] `page.tsx` tiene menos de 120 líneas
- [ ] No hay `<header>` definido en `page.tsx` (lo maneja `WorkspaceShell`)
- [ ] No hay `useRef<HTMLInputElement>` en `page.tsx` (lo maneja `FileActions`)
- [ ] Usa `BoardColumn` para las columnas (si aplica)
- [ ] Usa `ImagePicker` para todos los inputs de imagen
- [ ] Usa `use-workspace-groups` para el estado de grupos (si aplica)
- [ ] El schema JSON exportado está documentado en un comentario al inicio de `page.tsx`
- [ ] Está registrado en el array `workspaces` de `app/page.tsx` (home)
- [ ] No hay `console.log` de debug sin limpiar

---

## Notas para Continuación con otra IA

Si retomás este proyecto con otro modelo de lenguaje, el contexto clave es:

1. **Este es un sistema de pre-producción**: los usuarios llenan datos → exportan archivos → Unity los lee en vivo. Sin backend.
2. **La prioridad es velocidad de desarrollo**: 8 colectores en ~1 mes, trabajando solo.
3. **El Bloque 0 es el desbloqueador**: sin esos 7 componentes/hooks base, cada colector nuevo es costoso. Terminar el Bloque 0 antes de cualquier otra cosa.
4. **Los schemas JSON son distintos por colector**: no intentar unificarlos. Solo unificar la UI.
5. **El archivo de referencia de estructura es este `todo.md`**: refleja las decisiones tomadas y el orden acordado.
6. **Colectores existentes** (en `apps/web/src/app/workspaces/`): `deletreo`, `calculo-mental`, `mi-libro-favorito`, `impostor`, `redactor`, `personajes`.
7. **El issue de legacy a resolver**: en `impostor/page.tsx`, la carga del ZIP intenta leer `data.json` como fallback. Estandarizar a `sessionData.json` siempre.
