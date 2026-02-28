"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    saveAsJson(DEFAULT_FILENAME, inputs);
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Definimos una validación para asegurar que el JSON es un arreglo de strings
      const isValidDeletreo = (data: unknown): data is string[] => {
        return (
          Array.isArray(data) && data.every((item) => typeof item === "string")
        );
      };

      const data = await loadJsonFile<string[]>(file, isValidDeletreo);

      // Si llegamos aquí, data es válido según nuestro validador
      const newInputs = Array(6).fill("");
      data.slice(0, 6).forEach((val, i) => {
        newInputs[i] = val;
      });
      setInputs(newInputs);
    } catch (error) {
      console.error("Error al cargar el archivo JSON:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error al cargar el archivo JSON.",
      );
    }

    // Reset file input so same file can be loaded again if needed
    if (event.target) event.target.value = "";
  };

  const triggerLoad = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black text-zinc-900 dark:text-zinc-100">
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

        <section className="flex flex-col gap-6">
          {inputs.map((value, index) => (
            <div key={index} className="grid w-full items-center gap-1.5">
              <Label
                htmlFor={`input-${index}`}
                className="text-xs font-semibold text-zinc-400 uppercase ml-1"
              >
                Dato {index + 1}
              </Label>
              <Input
                type="text"
                id={`input-${index}`}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Escribe algo para el dato ${index + 1}...`}
                className="h-12 rounded-xl border-zinc-200 bg-white shadow-sm focus-visible:ring-red-500 dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3 sm:flex-row mt-4">
          <Button
            onClick={handleSave}
            size="lg"
            className="flex-1 h-14 rounded-2xl bg-red-600 text-lg font-semibold text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-900/20"
          >
            Save Data
          </Button>

          <Button
            onClick={triggerLoad}
            variant="outline"
            size="lg"
            className="flex-1 h-14 rounded-2xl border-2 border-zinc-200 bg-transparent text-lg font-semibold text-zinc-900 hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 shadow-sm"
          >
            Load Data
          </Button>

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
