"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import JSZip from "jszip";

// Configuración de nombre de archivo por defecto
const DEFAULT_FILENAME = "PersonajesBundle.zip";

interface PersonajeData {
  nombre: string;
  imagenFile: File | null;
  imagenPreview: string | null;
}

export default function PersonajesPage() {
  const [personajes, setPersonajes] = useState<PersonajeData[]>(
    Array(6).fill({ nombre: "", imagenFile: null, imagenPreview: null }),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Corrección: En el paso anterior usé setInputs por error en la lógica, lo corrijo a setPersonajes
  const handleNameChange = (index: number, value: string) => {
    const newPersonajes = [...personajes];
    newPersonajes[index] = { ...newPersonajes[index], nombre: value };
    setPersonajes(newPersonajes);
  };

  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (personajes[index].imagenPreview) {
      URL.revokeObjectURL(personajes[index].imagenPreview!);
    }

    const previewUrl = URL.createObjectURL(file);
    const newPersonajes = [...personajes];
    newPersonajes[index] = {
      ...newPersonajes[index],
      imagenFile: file,
      imagenPreview: previewUrl,
    };
    setPersonajes(newPersonajes);
  };

  const triggerImageUpload = (index: number) => {
    itemFileInputRefs.current[index]?.click();
  };

  const handleSave = async () => {
    const zip = new JSZip();

    // 1. Preparamos el JSON de metadatos
    const metadata = personajes.map((p, i) => ({
      slot: i + 1,
      nombre: p.nombre,
      extension: p.imagenFile ? p.imagenFile.name.split(".").pop() : null,
      archivoImagen: p.imagenFile
        ? `personaje_${i + 1}.${p.imagenFile.name.split(".").pop()}`
        : null,
    }));

    zip.file("data.json", JSON.stringify(metadata, null, 2));

    // 2. Añadimos las imágenes al ZIP
    personajes.forEach((p, i) => {
      if (p.imagenFile) {
        const ext = p.imagenFile.name.split(".").pop();
        zip.file(`personaje_${i + 1}.${ext}`, p.imagenFile);
      }
    });

    // 3. Generamos y descargamos el ZIP
    const content = await zip.generateAsync({ type: "blob" });
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", URL.createObjectURL(content));
    linkElement.setAttribute("download", DEFAULT_FILENAME);
    linkElement.click();
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const zip = await JSZip.loadAsync(file);
      const dataFile = zip.file("data.json");

      if (!dataFile) {
        alert("El ZIP no contiene un archivo data.json válido.");
        return;
      }

      const content = await dataFile.async("string");
      const metadata = JSON.parse(content);

      if (Array.isArray(metadata)) {
        const newPersonajes = await Promise.all(
          Array(6)
            .fill(null)
            .map(async (_, i) => {
              const item = metadata.find((m) => m.slot === i + 1) || {
                nombre: "",
              };
              const nombre = item.nombre || "";
              let imagenFile = null;
              let imagenPreview = null;

              if (item.archivoImagen) {
                const imgFileInZip = zip.file(item.archivoImagen);
                if (imgFileInZip) {
                  const blob = await imgFileInZip.async("blob");
                  // Creamos un File real a partir del blob
                  imagenFile = new File([blob], item.archivoImagen, {
                    type: blob.type,
                  });
                  imagenPreview = URL.createObjectURL(blob);
                }
              }

              return { nombre, imagenFile, imagenPreview };
            }),
        );

        // Limpiar previews viejos para evitar fugas de memoria
        personajes.forEach((p) => {
          if (p.imagenPreview) URL.revokeObjectURL(p.imagenPreview);
        });

        setPersonajes(newPersonajes);
      }
    } catch (error) {
      console.error("Error cargando ZIP:", error);
      alert("Error al procesar el archivo ZIP.");
    }

    if (event.target) event.target.value = "";
  };

  const triggerZipLoad = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <header className="mb-12 w-full max-w-4xl flex justify-between items-center">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          &larr; Volver al Inicio
        </Link>
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          Módulo Personajes
        </span>
      </header>

      <main className="flex w-full max-w-4xl flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Colector de Personajes
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Selecciona una imagen y asigna un nombre a cada personaje.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personajes.map((personaje, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 items-center shadow-sm"
            >
              <button
                onClick={() => triggerImageUpload(index)}
                className="relative h-20 w-20 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-red-500 transition-colors group"
              >
                {personaje.imagenPreview ? (
                  <Image // Changed to Next.js Image component
                    src={personaje.imagenPreview}
                    alt={`Preview ${index + 1}`}
                    fill // Use fill to make it cover the parent
                    unoptimized
                    style={{ objectFit: "cover" }} // Equivalent to object-cover
                  />
                ) : (
                  <span className="text-[10px] text-zinc-400 font-bold group-hover:text-red-500">
                    UPLOAD
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    itemFileInputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleImageChange(index, e)}
                />
              </button>

              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                  Personaje {index + 1}
                </label>
                <input
                  type="text"
                  value={personaje.nombre}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Nombre del personaje..."
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3 sm:flex-row mt-8 max-w-md mx-auto w-full">
          <button
            onClick={handleSave}
            className="flex-1 flex h-14 items-center justify-center rounded-2xl bg-red-600 text-lg font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98]"
          >
            Save Data
          </button>

          <button
            onClick={triggerZipLoad}
            className="flex-1 flex h-14 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-transparent text-lg font-semibold text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Load Data
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLoad}
            accept=".json,.zip"
            className="hidden"
          />
        </section>

        <footer className="mt-12 text-center text-sm text-zinc-400">
          BroadStream Coders &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
