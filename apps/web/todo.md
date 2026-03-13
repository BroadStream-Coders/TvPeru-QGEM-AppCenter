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
- Header de cada workspace controlado por `WorkspaceShell` — cada `page.tsx` pasa sus props. No usar Context API hasta que llegue la barra lateral (post-entrega de los 8 colectores).

---

## Estado Actual

**Bloques 0 y 1 completados.** La base está lista — cada nuevo colector se construye sobre los componentes compartidos sin repetir código estructural.

Colectores activos: `deletreo`, `calculo-mental`, `mi-libro-favorito`, `impostor`, `redactor`.
Colector eliminado: `personajes` (juego cancelado por producción).

---

## Principios de Diseño del Código

1. **Un colector = un `page.tsx` liviano**. El `page.tsx` solo orquesta estado y callbacks. Todo lo visual y estructural viene de componentes compartidos.
2. **Componentes por contrato, no por contenido**. Los componentes compartidos reciben `children` y props semánticas; no saben qué juego son.
3. **DRY en UI, flexible en schema**. Los schemas JSON pueden ser distintos por colector — está bien. Los inputs, columnas, headers y acciones de archivo deben ser siempre los mismos componentes.
4. **Feedback visible siempre**. Los usuarios no son técnicos. Estados de carga, errores y confirmaciones deben ser explícitos.
5. **Sin over-engineering**. No hay multi-usuario, no hay auth, no hay backend. No agregar complejidad que no resuelve un problema real hoy.

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── page.tsx                          # Home
│   ├── layout.tsx                        # Root layout
│   └── workspaces/
│       ├── layout.tsx                    # Footer siempre presente
│       ├── [nombre-colector]/
│       │   ├── page.tsx                  # SOLO: estado + callbacks + schema
│       │   └── components/              # Componentes privados del colector
│       └── ...
├── components/
│   ├── shared/
│   │   ├── WorkspaceShell.tsx           # ✅ Header declarativo del workspace
│   │   ├── FileActions.tsx              # ✅ Botones Cargar/Guardar unificados
│   │   ├── BoardColumn.tsx              # ✅ Columna genérica con header + scroll + footer
│   │   ├── AddColumnButton.tsx          # ✅ Botón ghost dashed "Añadir X"
│   │   ├── ImagePicker.tsx              # ✅ Wrapper visual de use-image-picker
│   │   └── QuickLoad.tsx                # ✅ Ya existía
│   └── ui/                              # shadcn/ui (no tocar)
├── hooks/
│   ├── use-image-picker.ts              # ✅ Actualizado con skipCleanupOnUnmount
│   └── use-workspace-groups.ts          # ✅ Hook genérico para estado de grupos
├── helpers/
│   ├── persistence.ts                   # ✅ Sin cambios
│   └── data-processing.ts              # ✅ Sin cambios
├── types/
│   └── index.ts                         # ✅ Tipos base compartidos
└── lib/
    └── utils.ts                         # ✅ Sin cambios
```

---

## Hoja de Ruta

### ✅ BLOQUE 0 — Fundamentos

- [x] **0.1** Crear `/src/types/index.ts` con tipos base (`SlotQA`, `ImageSlot`, `WorkspaceGroup<T>`, `SessionData`, `ValidationResult`)
- [x] **0.2** Crear `WorkspaceShell.tsx`
- [x] **0.3** Crear `FileActions.tsx`
- [x] **0.4** Crear `BoardColumn.tsx`
- [x] **0.5** Crear `AddColumnButton.tsx`
- [x] **0.6** Crear `use-workspace-groups.ts`
- [x] **0.7** Crear `ImagePicker.tsx` + actualizar `use-image-picker.ts` con `skipCleanupOnUnmount`

---

### ✅ BLOQUE 1 — Migración de colectores existentes

- [x] **1.1** Migrar `deletreo`
- [x] **1.2** Migrar `redactor`
- [x] **1.3** Migrar `mi-libro-favorito`
- [x] **1.4** Migrar `calculo-mental`
- [x] **1.5** Migrar `impostor` + fix imágenes al cambiar de tab + fix error tipos `Option[]`
- [x] **1.6** Eliminar `personajes` (juego cancelado)

---

### 🔲 BLOQUE 2 — Nuevos colectores

> Con el Bloque 0 listo, cada nuevo colector solo necesita:
>
> 1. Crear la carpeta `workspaces/[nombre]/`
> 2. Definir el schema localmente en `page.tsx` (o en `@/types` si se comparte)
> 3. Escribir `page.tsx` (~80 líneas): estado + callbacks + `WorkspaceShell` + `FileActions`
> 4. Crear componentes privados solo si la UI es única al colector

**Colectores pendientes** (completar nombres y ordenar por prioridad de producción):

- [ ] Colector 6: _(nombre pendiente)_
- [ ] Colector 7: _(nombre pendiente)_
- [ ] Colector 8: _(nombre pendiente)_

**Template de referencia** — estructura mínima de un `page.tsx` nuevo:

```tsx
"use client";
import { [Icono] } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { AddColumnButton } from "@/components/shared/AddColumnButton";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

/*
  SCHEMA exportado (para Unity):
  {
    groups: [
      { items: [...] }
    ]
  }
*/

const DEFAULT_FILENAME = "[Nombre].json"; // o .zip si tiene imágenes
interface ItemData { ... }
interface GroupData { items: ItemData[]; }
interface ColectorData { groups: GroupData[]; }

const createEmptyItem = (): ItemData => ({ ... });

export default function [Nombre]Page() {
  const { groups, addGroup, removeGroup, addItem, removeItem, updateItem, replaceGroup, setGroups } =
    useWorkspaceGroups<ItemData>([[createEmptyItem()]], createEmptyItem);

  const handleSave = () => {
    const data: ColectorData = { groups: groups.map((items) => ({ items })) };
    saveAsJson(DEFAULT_FILENAME, data);
  };

  const handleLoad = async (file: File) => {
    try {
      const data = await loadJsonFile<ColectorData>(file);
      if (data?.groups) setGroups(data.groups.map((g) => g.items));
    } catch {
      alert("Error al cargar el archivo.");
    }
  };

  return (
    <WorkspaceShell
      title="[Nombre]"
      icon={<[Icono] className="h-3 w-3" />}
      badge={`${groups.length} ronda${groups.length !== 1 ? "s" : ""}`}
      actions={<FileActions format="json" onSave={handleSave} onLoad={handleLoad} />}
    >
      <ScrollArea className="w-full h-full">
        <div className="flex min-w-max gap-4 px-6 py-6" style={{ height: "calc(100vh - 48px - 36px)" }}>
          {groups.map((items, groupIndex) => (
            <[Nombre]Column key={groupIndex} ... />
          ))}
          <AddColumnButton label="Agregar ronda" onClick={addGroup} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </WorkspaceShell>
  );
}
```

---

### 🔲 BLOQUE 3 — Validaciones antes de exportar

> Implementar cuando los colectores del Bloque 2 estén estables.

- [ ] **3.1** Crear función `validateWorkspace(data, rules): ValidationResult` en `@/helpers/validation.ts`
- [ ] **3.2** Crear componente `ValidationSummary` — muestra errores antes de permitir guardar
- [ ] **3.3** Integrar en `FileActions` via prop opcional `validate?: () => ValidationResult`
- [ ] **3.4** Implementar reglas comunes: campo requerido, imagen requerida, mínimo N items, longitud máxima

---

### 🔲 BLOQUE 4 — Infraestructura futura

> Post-entrega de los 8 colectores. No bloquea nada anterior.

- [ ] **4.1** Migrar header al `layout.tsx` usando Context API cuando se agregue la barra lateral izquierda
- [ ] **4.2** Escribir `README.md` completo: qué es el proyecto, cómo correrlo, cómo crear un colector nuevo
- [ ] **4.3** Documentar el contrato del schema de Unity por colector
- [ ] **4.4** Revisar consistencia visual final: hover states, transiciones, spacing

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

- JSON: colectores sin imágenes → `saveAsJson` / `loadJsonFile`. Nombre: `[NombreColector].json`
- ZIP: colectores con imágenes → `saveAsZip` / `loadZipFile`. Nombre: `[NombreColector].zip`. Siempre incluir `sessionData.json` dentro.

### Schema y Unity

- El schema JSON de cada colector es independiente — no intentar unificarlos.
- El contrato con Unity es inamovible: no cambiar la estructura de un JSON ya en producción sin coordinar con el cliente Unity.
- Siempre documentar el schema exportado en un comentario al inicio del `page.tsx`.

---

## Checklist de "Colector Listo para Producción"

- [ ] `page.tsx` tiene menos de 120 líneas
- [ ] Usa `WorkspaceShell` — no hay `<header>` definido en `page.tsx`
- [ ] Usa `FileActions` — no hay `useRef<HTMLInputElement>` en `page.tsx`
- [ ] Usa `BoardColumn` para las columnas (si aplica)
- [ ] Usa `ImagePicker` para todos los inputs de imagen (si aplica)
- [ ] Usa `use-workspace-groups` para el estado de grupos (si aplica)
- [ ] El schema JSON exportado está documentado en un comentario al inicio de `page.tsx`
- [ ] Está registrado en el array `workspaces` de `app/page.tsx` (home)
- [ ] No hay `console.log` de debug

---

## Notas para Continuación con otra IA

1. **Sistema de pre-producción**: usuarios llenan datos → exportan archivos → Unity los lee en vivo. Sin backend.
2. **Prioridad**: velocidad de desarrollo. 8 colectores en ~1 mes, trabajando solo.
3. **Bloques 0 y 1 completados**: todos los componentes base existen y todos los colectores anteriores están migrados. Arrancar directo en Bloque 2.
4. **Los schemas JSON son distintos por colector**: no unificarlos. Solo unificar la UI.
5. **El template del Bloque 2** es el punto de partida para cualquier colector nuevo.
6. **`use-image-picker.ts`** tiene la opción `skipCleanupOnUnmount` — activarla en `ImagePicker` para evitar que las URLs se invaliden al cambiar de tab (necesario en Impostor).
7. **Impostor es especial**: tiene dos niveles con tabs, maneja su propio estado por nivel en `roundsPerLevel`, y NO usa `use-workspace-groups` porque su estructura es más compleja.
