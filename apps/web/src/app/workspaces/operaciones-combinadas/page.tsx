"use client";

import { useState, useEffect, useCallback } from "react";
import { Sigma } from "lucide-react";
import { nanoid } from "nanoid";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";

import { RoundData, BoardData, Operation, Direction } from "./types";
import { RoundsBoardsSidebar } from "./components/RoundsBoardsSidebar";
import { OperacionesGrid, PreviewCell } from "./components/OperacionesGrid";
import { OperacionesList } from "./components/OperacionesList";

const GRID_SIZE = 11;
const createEmptyGrid = () =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(""));

const MAX_ROUNDS = 6;
const MAX_BOARDS = 4;
const MAX_OPERATIONS = 30;
const DEFAULT_FILENAME = "OperacionesCombinadas.json";

interface ExportedOperation {
  sequence: {
    values: string[];
    position: { x: number; y: number };
    direction: { x: number; y: number };
  };
  hiddenIndexes: number[];
}

interface ExportedData {
  rounds: {
    boards: {
      operations: ExportedOperation[];
    }[];
  }[];
}

// Helper initializers
const spawnBoard = (): BoardData => ({
  id: nanoid(),
  grid: createEmptyGrid(),
  operations: [],
});

const spawnRound = (): RoundData => ({
  id: nanoid(),
  boards: [spawnBoard()],
});

export default function OperacionesCombinadasPage() {
  const [rounds, setRounds] = useState<RoundData[]>([spawnRound()]);
  const [selectedRoundId, setSelectedRoundId] = useState<string>(rounds[0].id);
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    rounds[0].boards[0].id,
  );
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(
    null,
  );

  // Hover tracking
  const [hoverCell, setHoverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  // Derived state
  const currentRoundIndex = rounds.findIndex((r) => r.id === selectedRoundId);
  const currentRound =
    currentRoundIndex !== -1 ? rounds[currentRoundIndex] : rounds[0];

  const currentBoardIndex = currentRound
    ? currentRound.boards.findIndex((b) => b.id === selectedBoardId)
    : -1;
  const currentBoard =
    currentRound && currentBoardIndex !== -1
      ? currentRound.boards[currentBoardIndex]
      : currentRound?.boards[0];

  const handleSave = useCallback(() => {
    const payload = {
      rounds: rounds.map((r) => ({
        boards: r.boards.map((b) => ({
          operations: b.operations
            .filter((op) => op.sequence)
            .map((op) => ({
              sequence: {
                values: op.sequence!.values,
                position: op.sequence!.position,
                direction: op.sequence!.direction,
              },
              hiddenIndexes: op.sequence!.hiddenIndexes || [],
            })),
        })),
      })),
    };
    saveAsJson(DEFAULT_FILENAME, payload);
  }, [rounds]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const isValid = (data: unknown): data is ExportedData =>
        typeof data === "object" &&
        data !== null &&
        Array.isArray((data as ExportedData).rounds);

      const data = await loadJsonFile<ExportedData>(file, isValid);

      if (data && data.rounds) {
        const newRounds = data.rounds.map((r) => ({
          id: nanoid(),
          boards: (r.boards || []).map((b) => ({
            id: nanoid(),
            grid: createEmptyGrid(),
            operations: (b.operations || []).map((op) => {
              const seq = op.sequence;
              return {
                id: nanoid(),
                text: seq.values.join(""),
                direction: seq.direction.x === 1 ? "H" : ("V" as Direction),
                sequence: {
                  values: seq.values,
                  position: seq.position,
                  direction: seq.direction,
                  hiddenIndexes: op.hiddenIndexes || [],
                },
              };
            }),
          })),
        }));

        if (newRounds.length > 0) {
          setRounds(newRounds);
          setSelectedRoundId(newRounds[0].id);
          setSelectedBoardId(newRounds[0].boards[0]?.id || "");
          setSelectedOperationId(null);
          setHoverCell(null);
        }
      }
    } catch {
      alert("Error al cargar archivo JSON de Operaciones Combinadas.");
    }
  }, []);

  // Header hook
  useEffect(() => {
    setHeader({
      title: "Operaciones Combinadas",
      icon: <Sigma className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
    });

    return () => resetHeader();
  }, [setHeader, resetHeader, handleSave, handleLoad]);

  // Sync selectedBoardId with currentRound if navigating causes mismatch is handled by handlers natively

  // Handlers for Rounds and Boards
  const handleAddRound = () => {
    if (rounds.length >= MAX_ROUNDS) return;
    const newRound = spawnRound();
    setRounds([...rounds, newRound]);
    setSelectedRoundId(newRound.id);
    setSelectedBoardId(newRound.boards[0].id);
  };

  const handleAddBoard = () => {
    if (!currentRound || currentRound.boards.length >= MAX_BOARDS) return;
    const newBoard = spawnBoard();
    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = {
      ...currentRound,
      boards: [...currentRound.boards, newBoard],
    };
    setRounds(updatedRounds);
    setSelectedBoardId(newBoard.id);
  };

  const handleSelectRound = (id: string) => {
    setSelectedRoundId(id);
    const round = rounds.find((r) => r.id === id);
    if (round && round.boards.length > 0) {
      setSelectedBoardId(round.boards[0].id);
    }
    setSelectedOperationId(null);
  };

  const handleSelectBoard = (id: string) => {
    setSelectedBoardId(id);
    setSelectedOperationId(null);
  };

  // Updaters
  const updateCurrentBoard = (updatedBoard: BoardData) => {
    if (currentRoundIndex === -1 || currentBoardIndex === -1) return;
    const updatedRounds = [...rounds];
    const newBoards = [...currentRound.boards];
    newBoards[currentBoardIndex] = updatedBoard;
    updatedRounds[currentRoundIndex] = { ...currentRound, boards: newBoards };
    setRounds(updatedRounds);
  };

  // Placement Logic on Grid Cell Click
  const handleGridCellClick = (rowIndex: number, colIndex: number) => {
    if (!currentBoard) return;

    if (selectedOperationId) {
      const operationIndex = currentBoard.operations.findIndex(
        (o) => o.id === selectedOperationId,
      );
      if (operationIndex === -1) return;

      const operation = currentBoard.operations[operationIndex];
      const text = operation.text.trim();

      if (!text) {
        alert("La operación está vacía. Escribe algo como '15+12=27' primero.");
        return;
      }

      const values = text.match(/\d+|[+\-*/=]/g);
      const joinedValues = values ? values.join("") : "";

      if (!values || joinedValues.length !== text.replace(/\s+/g, "").length) {
        alert(
          "Formato de operación no válido. Asegúrate de usar números y operadores matemáticos (+, -, *, /, =).",
        );
        return;
      }

      const isHorizontal = operation.direction === "H";
      const dirX = isHorizontal ? 1 : 0;
      const dirY = isHorizontal ? 0 : 1;

      if (
        colIndex + values.length * dirX > GRID_SIZE ||
        rowIndex + values.length * dirY > GRID_SIZE
      ) {
        alert("La operación no cabe en el tablero iniciando en esta posición.");
        return;
      }

      const mockGrid = createEmptyGrid();
      currentBoard.operations.forEach((op) => {
        if (op.sequence && op.id !== operation.id) {
          op.sequence.values.forEach((v, i) => {
            const cx = op.sequence!.position.x + i * op.sequence!.direction.x;
            const cy = op.sequence!.position.y + i * op.sequence!.direction.y;
            mockGrid[cy][cx] = v;
          });
        }
      });

      let overlapsConflict = false;
      for (let i = 0; i < values.length; i++) {
        const cx = colIndex + i * dirX;
        const cy = rowIndex + i * dirY;
        const existingVal = mockGrid[cy][cx];

        if (existingVal && existingVal !== values[i]) {
          overlapsConflict = true;
          break;
        }
      }

      if (overlapsConflict) {
        alert(
          "Hay un cruce conflictivo. Un carácter distinto ya ocupa esa celda.",
        );
        return;
      }

      // Success: Save Placement
      const newOp: Operation = {
        ...operation,
        sequence: {
          values,
          position: { x: colIndex, y: rowIndex },
          direction: { x: dirX, y: dirY },
        },
      };

      const newOperations = [...currentBoard.operations];
      newOperations[operationIndex] = newOp;

      updateCurrentBoard({ ...currentBoard, operations: newOperations });
      setSelectedOperationId(null);
      setHoverCell(null);
    }
  };

  const handleGridCellDoubleClick = (rowIndex: number, colIndex: number) => {
    if (!currentBoard || selectedOperationId) return;

    let toggled = false;
    const newOperations = currentBoard.operations.map((op) => {
      if (op.sequence) {
        const { position, direction, values } = op.sequence;
        let intersectingIndex = -1;

        if (
          direction.x === 1 &&
          position.y === rowIndex &&
          colIndex >= position.x &&
          colIndex < position.x + values.length
        ) {
          intersectingIndex = colIndex - position.x;
        } else if (
          direction.y === 1 &&
          position.x === colIndex &&
          rowIndex >= position.y &&
          rowIndex < position.y + values.length
        ) {
          intersectingIndex = rowIndex - position.y;
        }

        if (intersectingIndex !== -1) {
          const hidden = op.sequence.hiddenIndexes || [];
          const newHidden = hidden.includes(intersectingIndex)
            ? hidden.filter((i) => i !== intersectingIndex)
            : [...hidden, intersectingIndex];
          toggled = true;
          return {
            ...op,
            sequence: { ...op.sequence, hiddenIndexes: newHidden },
          };
        }
      }
      return op;
    });

    if (toggled) {
      updateCurrentBoard({ ...currentBoard, operations: newOperations });
    }
  };

  // Hover Events
  const handleCellHover = (row: number, col: number) => {
    if (selectedOperationId) setHoverCell({ row, col });
  };
  const handleCellLeave = () => setHoverCell(null);

  // Handlers for Operations Context
  const handleAddOperation = () => {
    if (!currentBoard || currentBoard.operations.length >= MAX_OPERATIONS)
      return;
    updateCurrentBoard({
      ...currentBoard,
      operations: [
        ...currentBoard.operations,
        { id: nanoid(), text: "", direction: "H" },
      ],
    });
  };

  const handleQuickLoad = (matrix: string[][]) => {
    if (!currentBoard) return;

    // Detectar si es una simple lista VS cruzada de tablero
    // Si la inmensa mayoría de rows solo tiene un valor, se trata de una lista pegada
    let isListMode = true;
    for (const row of matrix) {
      if (row.filter(Boolean).length > 1) {
        isListMode = false;
        break;
      }
    }

    if (isListMode) {
      const availableSlots = MAX_OPERATIONS - currentBoard.operations.length;
      if (availableSlots <= 0) {
        alert("No hay más espacio para agregar operaciones en este Board.");
        return;
      }

      const lines = matrix.map((row) => row.join("\t").trim()).filter(Boolean);
      const toAdd = lines.slice(0, availableSlots).map((line) => ({
        id: nanoid(),
        text: line,
        direction: "H" as const,
      }));

      updateCurrentBoard({
        ...currentBoard,
        operations: [...currentBoard.operations, ...toAdd],
      });
      setSelectedOperationId(null);
      setHoverCell(null);
      return;
    }

    // Algoritmo de extracción tipo Crossword
    const newOperations: Operation[] = [];

    const getNorm = (y: number, x: number) => {
      if (y >= matrix.length || x >= matrix[y].length) return "";
      const val = matrix[y][x].trim();
      return val.replace(/^\((.+)\)$/, "$1");
    };

    const rowsLength = Math.min(GRID_SIZE, matrix.length);

    // Escaneo Horizontal
    for (let y = 0; y < rowsLength; y++) {
      let x = 0;
      while (x < GRID_SIZE) {
        const val = getNorm(y, x);
        if (val) {
          let len = 1;
          const values = [val];
          while (x + len < GRID_SIZE && getNorm(y, x + len)) {
            values.push(getNorm(y, x + len));
            len++;
          }
          if (len >= 3) {
            const text = values.join("");
            newOperations.push({
              id: nanoid(),
              text,
              direction: "H",
              sequence: {
                values,
                position: { x, y },
                direction: { x: 1, y: 0 },
              },
            });
          }
          x += len;
        } else {
          x++;
        }
      }
    }

    // Escaneo Vertical
    for (let x = 0; x < GRID_SIZE; x++) {
      let y = 0;
      while (y < rowsLength) {
        const val = getNorm(y, x);
        if (val) {
          let len = 1;
          const values = [val];
          while (y + len < rowsLength && getNorm(y + len, x)) {
            values.push(getNorm(y + len, x));
            len++;
          }
          if (len >= 3) {
            const text = values.join("");
            newOperations.push({
              id: nanoid(),
              text,
              direction: "V",
              sequence: {
                values,
                position: { x, y },
                direction: { x: 0, y: 1 },
              },
            });
          }
          y += len;
        } else {
          y++;
        }
      }
    }

    const finalOps = newOperations.slice(0, MAX_OPERATIONS);

    updateCurrentBoard({
      ...currentBoard,
      operations: finalOps,
    });
    setSelectedOperationId(null);
    setHoverCell(null);
  };

  const handleRemoveOperation = (id: string) => {
    if (!currentBoard) return;
    updateCurrentBoard({
      ...currentBoard,
      operations: currentBoard.operations.filter((o) => o.id !== id),
    });
    if (selectedOperationId === id) setSelectedOperationId(null);
  };

  const handleUpdateOperation = (
    id: string,
    field: keyof Operation,
    value: string,
  ) => {
    if (!currentBoard) return;
    updateCurrentBoard({
      ...currentBoard,
      operations: currentBoard.operations.map((o) => {
        if (o.id === id) {
          const isStructuralChange = field === "text" || field === "direction";
          return {
            ...o,
            [field]: value,
            ...(isStructuralChange && o.sequence
              ? { sequence: undefined }
              : {}),
          };
        }
        return o;
      }),
    });
  };

  const handleSelectOperation = (id: string) => {
    if (!currentBoard) return;

    if (selectedOperationId === id) {
      setSelectedOperationId(null);
      return;
    }

    const opIndex = currentBoard.operations.findIndex((o) => o.id === id);
    if (opIndex !== -1 && currentBoard.operations[opIndex].sequence) {
      const freshOps = [...currentBoard.operations];
      freshOps[opIndex] = { ...freshOps[opIndex], sequence: undefined };
      updateCurrentBoard({ ...currentBoard, operations: freshOps });
      setHoverCell(null);
    }

    setSelectedOperationId(id);
  };

  if (!currentBoard) return null;

  const visualGrid = createEmptyGrid();
  const hiddenCells = new Set<string>();

  currentBoard.operations.forEach((op) => {
    if (op.sequence && op.id !== selectedOperationId) {
      op.sequence.values.forEach((val, i) => {
        const cx = op.sequence!.position.x + i * op.sequence!.direction.x;
        const cy = op.sequence!.position.y + i * op.sequence!.direction.y;
        visualGrid[cy][cx] = val;
      });

      if (op.sequence.hiddenIndexes) {
        op.sequence.hiddenIndexes.forEach((idx) => {
          const cx = op.sequence!.position.x + idx * op.sequence!.direction.x;
          const cy = op.sequence!.position.y + idx * op.sequence!.direction.y;
          hiddenCells.add(`${cy}-${cx}`);
        });
      }
    }
  });

  // Calculate Preview logic
  const previewCells: Record<string, PreviewCell> = {};
  if (selectedOperationId && hoverCell) {
    const op = currentBoard.operations.find(
      (o) => o.id === selectedOperationId,
    );
    if (op && op.text.trim()) {
      const values = op.text.match(/\d+|[+\-*/=]/g);
      const joined = values ? values.join("") : "";

      // Is fully valid text logic
      if (values && joined.length === op.text.replace(/\s+/g, "").length) {
        const isHorizontal = op.direction === "H";
        const dirX = isHorizontal ? 1 : 0;
        const dirY = isHorizontal ? 0 : 1;

        const isOutOfBounds =
          hoverCell.col + values.length * dirX > GRID_SIZE ||
          hoverCell.row + values.length * dirY > GRID_SIZE;

        let hasConflict = false;
        if (!isOutOfBounds) {
          for (let i = 0; i < values.length; i++) {
            const cx = hoverCell.col + i * dirX;
            const cy = hoverCell.row + i * dirY;
            const existingVal = visualGrid[cy]?.[cx];

            if (existingVal && existingVal !== values[i]) {
              hasConflict = true;
              break;
            }
          }
        }

        // Real mock check to ignore self
        if (!isOutOfBounds && hasConflict) {
          const mockGrid = createEmptyGrid();
          currentBoard.operations.forEach((o) => {
            if (o.sequence && o.id !== op.id) {
              o.sequence.values.forEach((v, i) => {
                const cx = o.sequence!.position.x + i * o.sequence!.direction.x;
                const cy = o.sequence!.position.y + i * o.sequence!.direction.y;
                mockGrid[cy][cx] = v;
              });
            }
          });
          hasConflict = false;
          for (let i = 0; i < values.length; i++) {
            const cx = hoverCell.col + i * dirX;
            const cy = hoverCell.row + i * dirY;
            const existingVal = mockGrid[cy]?.[cx];
            if (existingVal && existingVal !== values[i]) {
              hasConflict = true;
              break;
            }
          }
        }

        const isValid = !isOutOfBounds && !hasConflict;

        values.forEach((val, i) => {
          const cx = hoverCell.col + i * dirX;
          const cy = hoverCell.row + i * dirY;
          if (cx < GRID_SIZE && cy < GRID_SIZE) {
            previewCells[`${cy}-${cx}`] = { value: val, isValid };
          }
        });
      }
    }
  }

  return (
    <main className="flex-1 overflow-hidden flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:p-6 bg-background">
      <RoundsBoardsSidebar
        rounds={rounds}
        selectedRoundId={selectedRoundId}
        selectedBoardId={selectedBoardId}
        maxRounds={MAX_ROUNDS}
        maxBoards={MAX_BOARDS}
        onSelectRound={handleSelectRound}
        onSelectBoard={handleSelectBoard}
        onAddRound={handleAddRound}
        onAddBoard={handleAddBoard}
      />

      <OperacionesGrid
        grid={visualGrid}
        onCellClick={handleGridCellClick}
        onCellDoubleClick={handleGridCellDoubleClick}
        onCellHover={handleCellHover}
        onCellLeave={handleCellLeave}
        previewCells={previewCells}
        hiddenCells={hiddenCells}
        isPlacementMode={!!selectedOperationId}
      />

      <OperacionesList
        operations={currentBoard.operations}
        maxOperations={MAX_OPERATIONS}
        selectedOperationId={selectedOperationId}
        onSelectOperation={handleSelectOperation}
        onAddOperation={handleAddOperation}
        onRemoveOperation={handleRemoveOperation}
        onUpdateOperation={handleUpdateOperation}
        onQuickLoad={handleQuickLoad}
      />
    </main>
  );
}
