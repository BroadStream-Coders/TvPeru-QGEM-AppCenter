# Roadmap de Refactorización - QGEM App Center

Este documento detalla las mejoras estructurales necesarias para que el proyecto sea más profesional, escalable y mantenible, siguiendo los principios de componentización y DRY (Don't Repeat Yourself).

## Prioridad Alta: Arquitectura de Componentes Nucleares
*Objetivo: Extraer elementos comunes que se repiten en todas las páginas de los workspaces.*

1.  **[ ] Componente `WorkspaceLayout`**:
    *   Actualmente, cada página (ej. `deletreo/page.tsx`) define su propio `<header>` y estructura de layout.
    *   **Acción**: Crear un layout compartido que reciba el título, icono, número de rondas y acciones (Cargar/Guardar) como props.
2.  **[ ] Componente `NavigationHeader`**:
    *   Extraer la lógica de navegación superior (botón volver, branding del workspace) a un componente reutilizable.
3.  **[ ] Abstracción de Acciones de Persistencia**:
    *   Unificar los botones de "Cargar" (Upload) y "Guardar" (Download) en un componente de acciones de archivo que maneje el estado de carga/guardado de forma consistente.

## Prioridad Media: Refactorización de Lógica de Negocio
*Objetivo: Separar la gestión del estado y la lógica de procesamiento de la capa de presentación.*

1.  **[ ] Custom Hooks para Workspaces (`useWorkspaceData`)**:
    *   Muchos workspaces comparten lógica similar: `addGroup`, `removeGroup`, `updateWord`, `handleSave`, `handleLoad`.
    *   **Acción**: Crear hooks personalizados para encapsular esta lógica, reduciendo el tamaño de los archivos `page.tsx`.
2.  **[ ] Unificación de Tipos Globales**:
    *   Mover las interfaces de datos (ej. `DeletreoData`, `Group`) a un archivo centralizado de tipos (`/src/types`) para evitar discrepancias.
3.  **[ ] Componentes de UI Especializados**:
    *   Extraer el "botón de agregar ronda" y otros elementos recurrentes del grid a componentes pequeños y enfocados.

## Prioridad Baja: Estética y Experiencia de Usuario (DX/UX)
*Objetivo: Mejoras en la calidad del código y la interfaz.*

1.  **[ ] Consistencia en Animaciones y Transiciones**:
    *   Asegurar que todos los componentes usen un set común de clases de Tailwind para hover/active/transitions.
2.  **[ ] Documentación de Componentes**:
    *   Agregar JSDoc a los helpers y componentes principales para facilitar el desarrollo a futuro.
3.  **[ ] Optimización de `globals.css`**:
    *   Limpiar el archivo CSS global y asegurar que se usen variables de CSS consistentes para el tema (brand colors, border-radius, etc).

---

### Estado Actual del Roadmap
- [x] **Refactorización de Botones de Home**: Convertidos a lista de objetos dinámica.
- [ ] **Componentización de Layout de Workspaces**: *Siguiente paso recomendado.*
- [ ] **Extracción de Hooks de Estado**: *Paso posterior.*
