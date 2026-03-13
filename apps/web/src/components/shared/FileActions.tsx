"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

/**
 * @file components/shared/FileActions.tsx
 *
 * Botones "Cargar" y "Guardar" unificados para todos los workspaces.
 *
 * RESPONSABILIDAD:
 * - Renderizar los botones de acción de archivo.
 * - Manejar internamente el <input type="file" hidden> y su ref.
 * - Entregar el File al page.tsx via onLoad — nada más.
 *
 * LO QUE NO HACE:
 * - No llama a saveAsJson ni saveAsZip directamente.
 * - No parsea ni valida el archivo — eso es responsabilidad del page.tsx.
 *
 * USO básico (JSON):
 * ```tsx
 * <FileActions
 *   format="json"
 *   onSave={handleSave}
 *   onLoad={handleLoad}
 * />
 * ```
 *
 * USO con label personalizado (ZIP):
 * ```tsx
 * <FileActions
 *   format="zip"
 *   onSave={handleSave}
 *   onLoad={handleLoad}
 *   saveLabel="Exportar ZIP"
 * />
 * ```
 */

interface FileActionsProps {
  /**
   * Formato del archivo a aceptar en la carga.
   * - "json" → acepta .json
   * - "zip"  → acepta .zip
   */
  format: "json" | "zip";
  /** Se llama al hacer click en "Guardar". El page.tsx ejecuta el save. */
  onSave: () => void;
  /**
   * Se llama cuando el usuario selecciona un archivo.
   * Recibe el File directamente — el page.tsx decide qué hacer con él.
   */
  onLoad: (file: File) => void;
  /** Texto del botón guardar. Default: "Guardar" */
  saveLabel?: string;
  /** Texto del botón cargar. Default: "Cargar" */
  loadLabel?: string;
}

export function FileActions({
  format,
  onSave,
  onLoad,
  saveLabel = "Guardar",
  loadLabel = "Cargar",
}: FileActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onLoad(file);
    // Limpiar el input para permitir cargar el mismo archivo dos veces seguidas.
    e.target.value = "";
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold uppercase"
      >
        <Upload className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{loadLabel}</span>
      </Button>

      <Button
        size="sm"
        onClick={onSave}
        className="h-7 gap-1.5 bg-brand hover:brightness-110 active:scale-[0.98] text-brand-foreground text-xs shadow-sm transition-all font-bold uppercase"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{saveLabel}</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept={format === "json" ? ".json" : ".zip"}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
