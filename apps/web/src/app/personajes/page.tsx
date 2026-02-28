"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Upload, ImageIcon } from "lucide-react";

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
    if (personajes[index].imagenPreview)
      URL.revokeObjectURL(personajes[index].imagenPreview!);
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
    const metadata = personajes.map((p, i) => ({
      slot: i + 1,
      nombre: p.nombre,
      extension: p.imagenFile ? p.imagenFile.name.split(".").pop() : null,
      archivoImagen: p.imagenFile
        ? `personaje_${i + 1}.${p.imagenFile.name.split(".").pop()}`
        : null,
    }));

    const filesToInclude = personajes
      .map((p, i) => {
        if (p.imagenFile) {
          const ext = p.imagenFile.name.split(".").pop();
          return { name: `personaje_${i + 1}.${ext}`, file: p.imagenFile };
        }
        return null;
      })
      .filter((item): item is { name: string; file: File } => item !== null);

    await saveAsZip(DEFAULT_FILENAME, metadata, filesToInclude);
  };

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file("data.json");
      if (!dataFile) {
        alert("El ZIP no contiene un archivo data.json válido.");
        return;
      }

      const content = await dataFile.async("string");
      const metadata = JSON.parse(content);

      if (Array.isArray(metadata)) {
        interface MetadataItem {
          slot: number;
          nombre: string;
          archivoImagen: string | null;
        }

        const newPersonajes = await Promise.all(
          Array(6)
            .fill(null)
            .map(async (_, i) => {
              const item = metadata.find(
                (m: MetadataItem) => m.slot === i + 1,
              ) || { nombre: "" };
              const nombre = item.nombre || "";
              let imagenFile = null;
              let imagenPreview = null;

              if (item.archivoImagen) {
                const imgFileInZip = zip.file(item.archivoImagen);
                if (imgFileInZip) {
                  const blob = await imgFileInZip.async("blob");
                  imagenFile = new File([blob], item.archivoImagen, {
                    type: blob.type,
                  });
                  imagenPreview = URL.createObjectURL(blob);
                }
              }
              return { nombre, imagenFile, imagenPreview };
            }),
        );

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

  const triggerZipLoad = () => fileInputRef.current?.click();

  const filledCount = personajes.filter((p) => p.nombre || p.imagenFile).length;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand text-2xs font-bold">
              P
            </div>
            <span className="text-sm font-semibold">Personajes</span>
          </div>
          <span className="rounded border border-border px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
            {filledCount}/6 cargados
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerZipLoad}
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cargar</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 gap-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guardar</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLoad}
            accept=".json,.zip"
            className="hidden"
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* Section header */}
          <div className="mb-6">
            <p className="text-caption font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Módulo Personajes
            </p>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Colector de Personajes
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Asigna una imagen y nombre a cada personaje del segmento.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personajes.map((personaje, index) => (
              <Card
                key={index}
                className="border border-border bg-card shadow-none rounded-xl py-0 gap-0 overflow-hidden transition-all hover:border-border/80"
              >
                <CardContent className="p-4 flex gap-3 items-center">
                  {/* Image upload area */}
                  <button
                    onClick={() => triggerImageUpload(index)}
                    className="relative h-16 w-16 shrink-0 overflow-hidden bg-muted rounded-lg flex items-center justify-center border border-dashed border-border hover:border-brand/50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {personaje.imagenPreview ? (
                      <Image
                        src={personaje.imagenPreview}
                        alt={`Preview ${index + 1}`}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground/40 group-hover:text-brand/60 transition-colors" />
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

                  {/* Name input */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Label
                      htmlFor={`personaje-${index}`}
                      className="text-2xs font-mono font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Personaje {index + 1}
                    </Label>
                    <Input
                      id={`personaje-${index}`}
                      type="text"
                      value={personaje.nombre}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Nombre del personaje..."
                      className="h-9 rounded-lg bg-background border-border text-sm placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-ring/30"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex h-9 shrink-0 items-center justify-between border-t border-border px-6">
        <span className="text-2xs text-muted-foreground font-mono">
          BroadStream Coders © {new Date().getFullYear()} — TV PERÚ QGEM APP
          CENTER
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-2xs text-muted-foreground">Activo</span>
        </div>
      </footer>
    </div>
  );
}
