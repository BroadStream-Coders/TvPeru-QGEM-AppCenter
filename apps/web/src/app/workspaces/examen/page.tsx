"use client";

import { useRef } from "react";
import { FileText, Layers } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { WorkspaceShell } from "@/components/shared/WorkspaceShell";
import { FileActions } from "@/components/shared/FileActions";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { nanoid } from "nanoid";
import { ExamenSessionData } from "./types";
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

const DEFAULT_FILENAME = "Examen.json";

export default function ExamenPage() {
  const level1Ref = useRef<ExamenLevel1ViewRef>(null);
  const level2Ref = useRef<ExamenLevel2ViewRef>(null);
  const level3Ref = useRef<ExamenLevel3ViewRef>(null);
  const level4Ref = useRef<ExamenLevel4ViewRef>(null);

  const handleSave = () => {
    const data1 = level1Ref.current?.getData() || [];
    const data2 = level2Ref.current?.getData() || [];
    const data3 = level3Ref.current?.getData() || [];
    const data4 = level4Ref.current?.getData() || [];

    const exportData = {
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
    };

    saveAsJson(DEFAULT_FILENAME, exportData);
  };

  const handleLoad = async (file: File) => {
    try {
      const isValid = (data: unknown): data is ExamenSessionData =>
        typeof data === "object" && data !== null;

      const sessionData = await loadJsonFile<ExamenSessionData>(file, isValid);
      if (!sessionData) return;

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
    } catch {
      alert("Error al cargar el archivo JSON.");
    }
  };

  return (
    <WorkspaceShell
      title="Examen"
      icon={<FileText className="h-3 w-3" />}
      badge="4 niveles"
      actions={
        <FileActions format="json" onSave={handleSave} onLoad={handleLoad} />
      }
    >
      <LevelTabs
        levels={[
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
        ]}
      />
    </WorkspaceShell>
  );
}
