"use client";

import { useEffect, useCallback, useMemo } from "react";
import { Swords } from "lucide-react";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { getColumnData } from "@/helpers/data-processing";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { DueloCruzadoColumn } from "./components/DueloCruzadoColumn";

export default function DueloCruzadoPage() {
  // Usamos el hook estandarizado del sistema lego inicializando a 1 sola columna
  const { groups, addItem, removeItem, updateItem, replaceGroup, setGroups } =
    useWorkspaceGroups<string>([[""]], () => "");

  // Solo existe y operamos sobre el índice 0 (La única columna)
  const courses = useMemo(() => groups[0] || [], [groups]);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const handleQuickLoad = (matrix: string[][]) => {
    // getColumnData intercepta el excel y abstrae la primera columna limpia
    replaceGroup(0, getColumnData(matrix, 0));
  };

  const handleClearAll = () => {
    setGroups([[""]]); // Truco: Limpiar todo restaurando a la estructura inicial
  };

  const handleSave = useCallback(() => {
    // Filtro estricto respetando el techo máximo exigido de 20
    const validLines = courses.map((c) => c.trim()).filter((c) => c !== "");
    const finalSet = validLines.slice(0, 20);

    const exportData = {
      courses: finalSet,
    };

    try {
      // Usamos el exportable estándar local
      saveAsJson("DueloCruzado.json", exportData);
    } catch {
      alert("Error al exportar los datos.");
    }
  }, [courses]);

  const handleLoad = useCallback(
    async (file: File) => {
      try {
        const sessionData = await loadJsonFile<{ courses: string[] }>(
          file,
          (data: unknown) => {
            return (
              typeof data === "object" &&
              data !== null &&
              "courses" in data &&
              Array.isArray((data as { courses: unknown[] }).courses)
            );
          },
        );

        if (sessionData && sessionData.courses) {
          setGroups([
            sessionData.courses.length > 0 ? sessionData.courses : [""],
          ]);
        }
      } catch (error) {
        console.error(error);
        alert(
          "Error al importar los datos. Verifica que sea el .json original de Duelo Cruzado.",
        );
      }
    },
    [setGroups],
  );

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Duelo Cruzado",
      icon: <Swords className="h-3 w-3" />,
      format: "json", // Formato pelado como solicitado
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader, handleSave, handleLoad]);

  return (
    <main className="flex-1 overflow-x-auto overflow-y-hidden bg-background">
      {/* Contenedor centralizado para la columna solitaria con el padding estandar lego */}
      <div className="flex min-w-max gap-4 px-6 py-6 h-full justify-center">
        <DueloCruzadoColumn
          index={1} // Visual display del GroupColumn
          courses={courses}
          onCourseChange={(idx, val) => updateItem(0, idx, val)}
          onAddCourse={() => addItem(0)}
          onRemoveCourse={(idx) => removeItem(0, idx)}
          onRemoveColumn={handleClearAll} // Si destruye la columna -> Reset completo
          onQuickLoad={handleQuickLoad}
        />
      </div>
    </main>
  );
}
