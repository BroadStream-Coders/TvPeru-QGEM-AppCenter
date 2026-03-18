"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Upload, ArrowLeft, FileText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ExamenLevel1View,
  ExamenLevel1ViewRef,
} from "./components/ExamenLevel1View";
import {
  ExamenLevel2View,
  ExamenLevel2ViewRef,
} from "./components/ExamenLevel2View";
import {
  ExamenLevel3View,
  ExamenLevel3ViewRef,
} from "./components/ExamenLevel3View";
import {
  ExamenLevel4View,
  ExamenLevel4ViewRef,
} from "./components/ExamenLevel4View";
import { nanoid } from "nanoid";

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

  const level1Ref = useRef<ExamenLevel1ViewRef>(null);
  const level2Ref = useRef<ExamenLevel2ViewRef>(null);
  const level3Ref = useRef<ExamenLevel3ViewRef>(null);
  const level4Ref = useRef<ExamenLevel4ViewRef>(null);

  const handleSave = async () => {
    const data1 = level1Ref.current?.getData() || [];
    const data2 = level2Ref.current?.getData() || [];
    const data3 = level3Ref.current?.getData() || [];
    const data4 = level4Ref.current?.getData() || [];

    const exportData = {
      level1: {
        groups: data1.map((g) => ({
          questions: g.map((q) => ({
            question: q.question,
            options: [q.answerL, q.answerR],
            correctIndex: q.correctAnswer === "L" ? 0 : 1,
          })),
        })),
      },
      level2: {
        groups: data2.map((g) => ({
          questions: g.map((q) => ({
            question: q.question,
            options: [q.answerA, q.answerB, q.answerC, q.answerD],
            correctIndex:
              q.correctAnswer === "A"
                ? 0
                : q.correctAnswer === "B"
                  ? 1
                  : q.correctAnswer === "C"
                    ? 2
                    : 3,
          })),
        })),
      },
      level3: {
        groups: data3.map((g) => ({
          questions: g.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        })),
      },
      level4: {
        groups: data4.map((g) => ({
          questions: g.map((q) => ({
            pairs: q.pairs.map((pair) => ({
              leftText: pair.leftText,
              rightText: pair.rightText,
            })),
          })),
        })),
      },
    };

    try {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Examen.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al exportar los datos.");
    }
  };

  const handleLoad = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sessionData = JSON.parse(content) as any;

          if (sessionData.level1?.groups) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d1 = sessionData.level1.groups.map((g: any) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              g.questions.map((q: any) => ({
                id: nanoid(),
                question: q.question || "",
                answerL: q.options?.[0] || "",
                answerR: q.options?.[1] || "",
                correctAnswer: q.correctIndex === 0 ? "L" : "R",
              })),
            );
            level1Ref.current?.setData(d1);
          }

          if (sessionData.level2?.groups) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d2 = sessionData.level2.groups.map((g: any) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              g.questions.map((q: any) => ({
                id: nanoid(),
                question: q.question || "",
                answerA: q.options?.[0] || "",
                answerB: q.options?.[1] || "",
                answerC: q.options?.[2] || "",
                answerD: q.options?.[3] || "",
                correctAnswer: ["A", "B", "C", "D"][q.correctIndex || 0],
              })),
            );
            level2Ref.current?.setData(d2);
          }

          if (sessionData.level3?.groups) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d3 = sessionData.level3.groups.map((g: any) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              g.questions.map((q: any) => ({
                id: nanoid(),
                question: q.question || "",
                answer: q.answer || "",
              })),
            );
            level3Ref.current?.setData(d3);
          }

          if (sessionData.level4?.groups) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d4 = sessionData.level4.groups.map((g: any) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              g.questions.map((q: any) => ({
                id: nanoid(),
                // Try to load up to 4 pairs or fill with empty if missing
                pairs: Array.from({ length: 4 }, (_, idx) => ({
                  leftText: q.pairs?.[idx]?.leftText || "",
                  rightText: q.pairs?.[idx]?.rightText || "",
                })),
              })),
            );
            level4Ref.current?.setData(d4);
          }
        } catch {
          alert("El archivo no es un JSON válido.");
        }
      };
      reader.readAsText(file);
    } catch {
      alert("Error al leer el archivo.");
    }
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
            <span className="hidden sm:inline">Exportar JSON</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
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

      <main className="flex-1 overflow-hidden relative">
        <div
          className={cn(
            "absolute inset-0",
            activeTab === "nivel1"
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none -z-10",
          )}
        >
          <ExamenLevel1View ref={level1Ref} />
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeTab === "nivel2"
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none -z-10",
          )}
        >
          <ExamenLevel2View ref={level2Ref} />
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeTab === "nivel3"
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none -z-10",
          )}
        >
          <ExamenLevel3View ref={level3Ref} />
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeTab === "nivel4"
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none -z-10",
          )}
        >
          <ExamenLevel4View ref={level4Ref} />
        </div>
      </main>
    </>
  );
}
