"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// Configuración de nombre de archivo por defecto
const DEFAULT_FILENAME = "DeletreoData.json";

export default function DeletreoPage() {
  const [inputs, setInputs] = useState<string[]>(Array(6).fill(""));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleSave = () => {
    const dataStr = JSON.stringify(inputs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = DEFAULT_FILENAME;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          // Aseguramos que solo cargamos hasta 6 o rellenamos si hay menos
          const newInputs = Array(6).fill("");
          data.slice(0, 6).forEach((val, i) => {
            newInputs[i] = String(val);
          });
          setInputs(newInputs);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert(
          "Error al cargar el archivo JSON. Asegúrate de que sea un formato válido.",
        );
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be loaded again if needed
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <header className="mb-12 w-full max-w-2xl flex justify-between items-center">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          &larr; Volver al Inicio
        </Link>
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          Módulo Deletreo
        </span>
      </header>

      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Colector de Deletreo
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Ingresa los datos del programa a continuación.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          {inputs.map((value, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase ml-1">
                Dato {index + 1}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Escribe algo para el dato ${index + 1}...`}
                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              />
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3 sm:flex-row mt-4">
          <button
            onClick={handleSave}
            className="flex-1 flex h-14 items-center justify-center rounded-2xl bg-red-600 text-lg font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98]"
          >
            Save Data
          </button>

          <button
            onClick={triggerLoad}
            className="flex-1 flex h-14 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-transparent text-lg font-semibold text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Load Data
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLoad}
            accept=".json"
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
