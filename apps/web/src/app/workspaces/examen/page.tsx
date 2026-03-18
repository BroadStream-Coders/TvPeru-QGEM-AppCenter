"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Upload, ArrowLeft, FileText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamenLevel1View } from "./components/ExamenLevel1View";
import { ExamenLevel2View } from "./components/ExamenLevel2View";
import { ExamenLevel3View } from "./components/ExamenLevel3View";
import { ExamenLevel4View } from "./components/ExamenLevel4View";

type LevelId = "nivel1" | "nivel2" | "nivel3" | "nivel4";

const levels: { id: LevelId; label: string }[] = [
  { id: "nivel1", label: "Nivel 1" },
  { id: "nivel2", label: "Nivel 2" },
  { id: "nivel3", label: "Nivel 3" },
  { id: "nivel4", label: "Nivel 4" },
];

export default function ExamenPage() {
  const [activeTab, setActiveTab] = useState<LevelId>("nivel1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    alert("Exportación pendiente de implementación");
  };

  const handleLoad = async () => {
    alert("Importación pendiente de implementación");
  };

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-brand/20 text-brand ring-1 ring-brand/10">
              <FileText className="h-3 w-3" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Examen</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cargar</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 gap-1.5 bg-brand hover:brightness-110 active:scale-[0.98] text-brand-foreground text-xs shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar ZIP</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLoad(file);
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
      </header>

      <div className="flex h-12 shrink-0 items-center border-b border-border bg-muted/20 px-4 gap-1">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setActiveTab(level.id)}
            className={cn(
              "flex items-center gap-2 h-8 px-4 rounded-md text-xs font-bold transition-all",
              activeTab === level.id
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            {level.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-hidden">
        {activeTab === "nivel1" && <ExamenLevel1View />}
        {activeTab === "nivel2" && <ExamenLevel2View />}
        {activeTab === "nivel3" && <ExamenLevel3View />}
        {activeTab === "nivel4" && <ExamenLevel4View />}
      </main>
    </>
  );
}
