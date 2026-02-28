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
