import JSZip from "jszip";

/**
 * persistence.ts
 * Helper central para la gestión de archivos (JSON, ZIP) en los colectores.
 */

/**
 * Guarda datos en un archivo JSON y dispara la descarga en el navegador.
 * @param filename Nombre del archivo (ej: "data.json")
 * @param data Objeto o arreglo de datos a guardar
 */
export const saveAsJson = (filename: string, data: unknown) => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", url);
  linkElement.setAttribute("download", filename);
  linkElement.click();

  // Limpieza
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Lee un archivo JSON y devuelve su contenido parseado.
 * @param file Objeto File obtenido de un input type="file"
 * @param validator Función opcional para validar la estructura de los datos
 * @returns Promesa con los datos parseados
 */
export const loadJsonFile = <T>(
  file: File,
  validator?: (data: unknown) => boolean,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (validator && !validator(data)) {
          return reject(
            new Error("Estructura de archivo no válida para este colector."),
          );
        }

        resolve(data as T);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

/**
 * Crea un paquete ZIP con un archivo data.json y múltiples archivos adicionales (imágenes).
 * @param filename Nombre del ZIP (ej: "Bundle.zip")
 * @param jsonData Datos para el archivo data.json
 * @param files Lista de archivos para incluir en el ZIP
 */
export const saveAsZip = async (
  filename: string,
  jsonData: unknown,
  files: { name: string; file: File }[],
) => {
  const zip = new JSZip();

  // 1. Añadir el JSON
  zip.file("data.json", JSON.stringify(jsonData, null, 2));

  // 2. Añadir cada archivo
  files.forEach((item) => {
    zip.file(item.name, item.file);
  });

  // 3. Generar y descargar
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", url);
  linkElement.setAttribute("download", filename);
  linkElement.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Carga un archivo ZIP y extrae su contenido.
 * @param file Archivo ZIP seleccionado
 * @returns Promesa con el ZIP cargado (objeto JSZip)
 */
export const loadZipFile = async (file: File): Promise<JSZip> => {
  try {
    const zip = await JSZip.loadAsync(file);
    return zip;
  } catch {
    throw new Error("No se pudo leer el archivo ZIP.");
  }
};
