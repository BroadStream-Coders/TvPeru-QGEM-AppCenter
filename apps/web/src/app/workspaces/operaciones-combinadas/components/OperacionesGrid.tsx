import React from "react";

const GRID_SIZE = 11;

export interface PreviewCell {
  value: string;
  isValid: boolean;
}

interface OperacionesGridProps {
  grid: string[][];
  onCellClick: (row: number, col: number) => void;
  onCellDoubleClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  onCellLeave?: () => void;
  previewCells?: Record<string, PreviewCell>;
  hiddenCells?: Set<string>;
  isPlacementMode?: boolean;
}

export function OperacionesGrid({
  grid,
  onCellClick,
  onCellDoubleClick,
  onCellHover,
  onCellLeave,
  previewCells = {},
  hiddenCells = new Set(),
  isPlacementMode = false,
}: OperacionesGridProps) {
  return (
    <section
      className={`flex-1 flex flex-col items-center justify-center border rounded-xl p-6 overflow-hidden transition-all duration-300 ${
        isPlacementMode
          ? "border-brand bg-brand/5 shadow-lg shadow-brand/20 relative"
          : "border-border bg-card shadow-sm"
      }`}
    >
      {isPlacementMode && (
        <div className="absolute top-4 left-0 w-full text-center pointer-events-none animate-pulse">
          <span className="bg-brand text-brand-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            Modo Ubicación Activo
          </span>
        </div>
      )}

      <div
        className={`w-full max-w-[650px] aspect-square shrink-0 transition-transform duration-300 ${isPlacementMode ? "scale-[1.02]" : ""}`}
      >
        <div
          className={`grid gap-[2px] lg:gap-1 w-full h-full p-1 lg:p-2 rounded-lg transition-colors duration-300 ${
            isPlacementMode
              ? "bg-brand/20 ring-1 ring-brand/30"
              : "bg-border/20"
          }`}
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
          onMouseLeave={onCellLeave} // Leave grid
        >
          {grid.map((row, rowIndex) =>
            row.map((cellValue, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const preview = previewCells[cellKey];
              const isHidden = hiddenCells.has(cellKey);

              let content = cellValue;
              let extraClass = "border-border/80 bg-background text-brand"; // base

              if (preview) {
                content = preview.value;
                extraClass = preview.isValid
                  ? "border-success bg-success/20 text-success ring-2 ring-success scale-110 z-10 shadow-md"
                  : "border-destructive bg-destructive/20 text-destructive ring-2 ring-destructive scale-110 z-10 shadow-md";
              } else if (cellValue) {
                if (isHidden) {
                  extraClass =
                    "border-brand/40 border-dashed bg-background text-brand/30 shadow-inner font-extrabold";
                } else {
                  extraClass =
                    "border-brand/40 bg-brand/10 text-brand shadow-sm font-extrabold";
                }
              } else if (isPlacementMode) {
                extraClass =
                  "border-brand/20 bg-background text-brand hover:bg-brand/10";
              } else {
                extraClass =
                  "border-border/80 bg-background text-brand hover:bg-muted/50";
              }

              return (
                <button
                  key={cellKey}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  onDoubleClick={() =>
                    onCellDoubleClick && onCellDoubleClick(rowIndex, colIndex)
                  }
                  onMouseEnter={() =>
                    onCellHover && onCellHover(rowIndex, colIndex)
                  }
                  className={`w-full h-full border transition-all duration-150 rounded-sm lg:rounded-md flex items-center justify-center font-mono font-bold text-sm lg:text-lg focus:outline-none ${extraClass}`}
                >
                  {content}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="mt-4 md:mt-6 text-sm text-muted-foreground flex items-center justify-center gap-1.5 opacity-90 text-center font-medium bg-muted/30 px-4 py-2 rounded-lg border border-border/50">
        💡 <span className="font-bold text-foreground">Tip:</span>
        <span>
          Doble clic sobre un número para marcarlo como &quot;oculto&quot; para
          los jugadores.
        </span>
      </div>
    </section>
  );
}
