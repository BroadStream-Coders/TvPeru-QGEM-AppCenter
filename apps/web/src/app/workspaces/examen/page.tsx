"use client";

import { useRef, useEffect, useCallback } from "react";
import { FileText, Layers } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { nanoid } from "nanoid";
import { ExamenSessionData } from "./types";
import {
  ExamenLevel0View,
  ExamenLevel0ViewRef,
} from "./components/ExamenLevel0View";
import {
  ExamenLevel1View,
  ExamenLevel1ViewRef,
  ExamenLevel1Column,
} from "./components/ExamenLevel1View";
import {
  ExamenLevel2View,
  ExamenLevel2ViewRef,
  ExamenLevel2Column,
} from "./components/ExamenLevel2View";
import {
  ExamenLevel3View,
  ExamenLevel3ViewRef,
  ExamenLevel3Column,
} from "./components/ExamenLevel3View";
import {
  ExamenLevel4View,
  ExamenLevel4ViewRef,
  ExamenLevel4Column,
} from "./components/ExamenLevel4View";
import {
  ExamenLevel5View,
  ExamenLevel5ViewRef,
  ExamenLevel5Column,
} from "./components/ExamenLevel5View";

const DEFAULT_FILENAME = "Examen.zip";

export default function ExamenPage() {
  const level0Ref = useRef<ExamenLevel0ViewRef>(null);
  const level1Ref = useRef<ExamenLevel1ViewRef>(null);
  const level2Ref = useRef<ExamenLevel2ViewRef>(null);
  const level3Ref = useRef<ExamenLevel3ViewRef>(null);
  const level4Ref = useRef<ExamenLevel4ViewRef>(null);
  const level5Ref = useRef<ExamenLevel5ViewRef>(null);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const handleSave = useCallback(async () => {
    const data0 = level0Ref.current?.getData() || [];
    const data1 = level1Ref.current?.getData() || [];
    const data2 = level2Ref.current?.getData() || [];
    const data3 = level3Ref.current?.getData() || [];
    const data4 = level4Ref.current?.getData() || [];
    const data5 = level5Ref.current?.getData() || [];

    const exportData = {
      level0: { courses: data0 },
      level1: {
        groups: data1.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            question: q.question,
            options: [q.answerL, q.answerR],
            correctIndex: q.correctAnswer === "L" ? 0 : 1,
          })),
        })),
      },
      level2: {
        groups: data2.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
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
        groups: data3.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            pairs: q.pairs.map((pair) => ({
              leftText: pair.leftText,
              rightText: pair.rightText,
            })),
          })),
        })),
      },
      level4: {
        groups: data4.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        })),
      },
      level5: {
        groups: data5.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            imagePath: q.file ? `images/${nanoid(4)}_${q.file.name}` : "",
          })),
        })),
      },
    };

    const filesToInclude: { name: string; file: File }[] = [];
    data5.forEach((col, cIdx) => {
      col.rows.forEach((row, rIdx) => {
        if (row.file) {
          const path = exportData.level5.groups[cIdx].questions[rIdx].imagePath;
          if (path) filesToInclude.push({ name: path, file: row.file });
        }
      });
    });

    try {
      await saveAsZip(
        DEFAULT_FILENAME,
        exportData,
        filesToInclude,
        "sessionData.json",
      );
    } catch {
      alert("Error al exportar los datos.");
    }
  }, []);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file("sessionData.json") || zip.file("data.json");
      if (!dataFile) {
        alert("El archivo no es un paquete válido de Examen.");
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as ExamenSessionData;

      if (sessionData.level0?.courses) {
        level0Ref.current?.setData(sessionData.level0.courses);
      }

      if (sessionData.level1?.groups) {
        const d1: ExamenLevel1Column[] = sessionData.level1.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answerL: q.options?.[0] || "",
            answerR: q.options?.[1] || "",
            correctAnswer: q.correctIndex === 0 ? "L" : "R",
          })),
        }));
        level1Ref.current?.setData(d1);
      }

      if (sessionData.level2?.groups) {
        const d2: ExamenLevel2Column[] = sessionData.level2.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answerA: q.options?.[0] || "",
            answerB: q.options?.[1] || "",
            answerC: q.options?.[2] || "",
            answerD: q.options?.[3] || "",
            correctAnswer: (["A", "B", "C", "D"] as const)[q.correctIndex || 0],
          })),
        }));
        level2Ref.current?.setData(d2);
      }

      if (sessionData.level3?.groups) {
        const d3: ExamenLevel3Column[] = sessionData.level3.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            pairs: Array.from({ length: 4 }, (_, idx) => ({
              leftText: q.pairs?.[idx]?.leftText || "",
              rightText: q.pairs?.[idx]?.rightText || "",
            })),
          })),
        }));
        level3Ref.current?.setData(d3);
      }

      if (sessionData.level4?.groups) {
        const d4: ExamenLevel4Column[] = sessionData.level4.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answer: q.answer || "",
          })),
        }));
        level4Ref.current?.setData(d4);
      }

      if (sessionData.level5?.groups) {
        const d5: ExamenLevel5Column[] = await Promise.all(
          sessionData.level5.groups.map(async (g) => {
            const rows = await Promise.all(
              g.questions.map(async (q) => {
                let imageFile: File | undefined;
                let imageUrl: string | undefined;

                if (q.imagePath) {
                  const imgEntry = zip.file(q.imagePath);
                  if (imgEntry) {
                    const blob = await imgEntry.async("blob");
                    const parts = (
                      q.imagePath.split("/").pop() || q.imagePath
                    ).split("_");
                    const originalName =
                      parts.length > 1 ? parts.slice(1).join("_") : parts[0];
                    imageFile = new File([blob], originalName, {
                      type: blob.type || "image/png",
                    });
                    imageUrl = URL.createObjectURL(blob);
                  }
                }

                return {
                  id: nanoid(),
                  file: imageFile,
                  url: imageUrl,
                };
              }),
            );
            return {
              title: g.title || "",
              rows: rows.length > 0 ? rows : [{ id: nanoid() }],
            };
          }),
        );
        level5Ref.current?.setData(d5);
      }
    } catch {
      alert("Error al importar los datos.");
    }
  }, []);

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Examen",
      icon: <FileText className="h-3 w-3" />,
      format: "zip",
      onSave: handleSave,
      onLoad: handleLoad,
    });
  }, [setHeader, handleSave, handleLoad]);

  return (
    <main className="flex-1 overflow-hidden">
      <LevelTabs
        levels={[
          {
            name: "Nivel 0",
            icon: Layers,
            component: <ExamenLevel0View ref={level0Ref} />,
          },
          {
            name: "Nivel 1",
            icon: Layers,
            component: <ExamenLevel1View ref={level1Ref} />,
          },
          {
            name: "Nivel 2",
            icon: Layers,
            component: <ExamenLevel2View ref={level2Ref} />,
          },
          {
            name: "Nivel 3",
            icon: Layers,
            component: <ExamenLevel3View ref={level3Ref} />,
          },
          {
            name: "Nivel 4",
            icon: Layers,
            component: <ExamenLevel4View ref={level4Ref} />,
          },
          {
            name: "Nivel 5",
            icon: Layers,
            component: <ExamenLevel5View ref={level5Ref} />,
          },
        ]}
      />
    </main>
  );
}
