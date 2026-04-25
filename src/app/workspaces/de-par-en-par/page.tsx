"use client";

import { useEffect, useCallback, useState } from "react";
import { Grid2x2, Layers } from "lucide-react";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";

import { Tab1View } from "./components/Tab1View";
import { Tab2View } from "./components/Tab2View";
import { PairData, DeParEnParSessionData, CardContent } from "./types";

export default function DeParEnParPage() {
  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  // === ESTADO GLOBAL COMPARTIDO ===
  const [numPairs, setNumPairs] = useState<number>(8);
  const [pairsData, setPairsData] = useState<Record<number, PairData>>({});
  const [boardOrder, setBoardOrder] = useState<string[]>(() => {
    const order: string[] = [];
    for (let i = 0; i < 8; i++) order.push(`${i}_A`, `${i}_B`);
    return order;
  });

  // Interceptar cambios manuales del dropdown para resetear el tablero
  const handleNumPairsChange = useCallback((newPairs: number) => {
    setNumPairs(newPairs);
    const order: string[] = [];
    for (let i = 0; i < newPairs; i++) order.push(`${i}_A`, `${i}_B`);
    setBoardOrder(order);
  }, []);

  const handleSave = useCallback(async () => {
    const cells = [];
    const filesToInclude: { name: string; file: File }[] = [];

    // Reglas de exportación JSON: type: 0 = text, 1 = image, 2 = both
    for (let i = 0; i < numPairs; i++) {
      // Recordar que Tab1View usa almacenamiento en indices base 1
      const pair = pairsData[i + 1] || {
        cartaA: { mode: "image", text: "" },
        cartaB: { mode: "image", text: "" },
      };

      const processCard = (cardData: CardContent, side: "A" | "B") => {
        let type = 0; // por defeco "texto"
        if (cardData.mode === "image") type = 1;
        if (cardData.mode === "both") type = 2;

        let pictureFileStr = "";
        if ((type === 1 || type === 2) && cardData.imageFile) {
          const ext = cardData.imageFile.name.split(".").pop();
          pictureFileStr = `images/${i}_${side}.${ext || "png"}`;
          filesToInclude.push({
            name: pictureFileStr,
            file: cardData.imageFile,
          });
        }

        return {
          type,
          text: type === 0 || type === 2 ? cardData.text || "" : "",
          pictureFile: pictureFileStr,
        };
      };

      cells.push({
        cardA: processCard(pair.cartaA, "A"),
        cardB: processCard(pair.cartaB, "B"),
      });
    }

    const exportData: DeParEnParSessionData = {
      cells,
      answer: boardOrder,
    };

    try {
      await saveAsZip(
        "DeParEnPar.zip",
        exportData as unknown as Record<string, unknown>,
        filesToInclude,
        "sessionData.json",
      );
    } catch {
      alert("Error al exportar los datos.");
    }
  }, [numPairs, pairsData, boardOrder]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const zip = await loadZipFile(file);
      const dataFile = zip.file("sessionData.json") || zip.file("data.json");
      if (!dataFile) {
        alert("El archivo no es un paquete válido de De par en par.");
        return;
      }

      const content = await dataFile.async("string");
      const sessionData = JSON.parse(content) as DeParEnParSessionData;

      if (!sessionData.cells || !Array.isArray(sessionData.cells)) {
        alert("Estructura JSON inválida.");
        return;
      }

      const newNumPairs = sessionData.cells.length;
      const newPairsData: Record<number, PairData> = {};

      for (let i = 0; i < newNumPairs; i++) {
        const cell = sessionData.cells[i];

        const processLoadedCard = async (cardInfo: {
          type: number;
          text: string;
          pictureFile: string;
        }) => {
          let mode: "image" | "text" | "both" = "text";
          if (cardInfo.type === 1) mode = "image";
          if (cardInfo.type === 2) mode = "both";

          let imageFile: File | undefined = undefined;
          let imageUrl: string | undefined = undefined;

          if ((mode === "image" || mode === "both") && cardInfo.pictureFile) {
            const imgEntry = zip.file(cardInfo.pictureFile);
            if (imgEntry) {
              const blob = await imgEntry.async("blob");
              const filename =
                cardInfo.pictureFile.split("/").pop() || "image.png";

              imageFile = new File([blob], filename, {
                type: blob.type || "image/png",
              });
              imageUrl = URL.createObjectURL(blob);
            }
          }

          return {
            mode,
            text: cardInfo.text || "",
            imageFile,
            imageUrl,
          };
        };

        newPairsData[i + 1] = {
          cartaA: await processLoadedCard(cell.cardA),
          cartaB: await processLoadedCard(cell.cardB),
        };
      }

      setNumPairs(newNumPairs);
      setPairsData(newPairsData);

      if (sessionData.answer && Array.isArray(sessionData.answer)) {
        setBoardOrder(sessionData.answer);
      } else {
        const order: string[] = [];
        for (let i = 0; i < newNumPairs; i++) order.push(`${i}_A`, `${i}_B`);
        setBoardOrder(order);
      }
    } catch (error) {
      console.error(error);
      alert("Error al importar los datos.");
    }
  }, []);

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "De par en par",
      icon: <Grid2x2 className="h-3 w-3" />,
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
            name: "Recolector",
            icon: Layers,
            component: (
              <Tab1View
                numPairs={numPairs}
                setNumPairs={handleNumPairsChange}
                pairsData={pairsData}
                setPairsData={setPairsData}
              />
            ),
          },
          {
            name: "Tablero",
            icon: Layers,
            component: (
              <Tab2View
                boardOrder={boardOrder}
                setBoardOrder={setBoardOrder}
                pairsData={pairsData}
              />
            ),
          },
        ]}
      />
    </main>
  );
}
