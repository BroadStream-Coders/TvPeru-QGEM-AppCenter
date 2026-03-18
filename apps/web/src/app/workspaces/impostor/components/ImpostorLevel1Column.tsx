"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Trash2, X, AlertCircle } from "lucide-react";
import { ImpostorCard } from "./ImpostorCard";
import { Textarea } from "@/components/ui/textarea";

interface Photo {
  id: string;
  name?: string;
  file?: File;
  url?: string;
  isImpostor: boolean;
}

interface Option {
  text: string;
  isImpostor: boolean;
}

interface ImpostorLevel1ColumnProps {
  index: number;
  photo: Photo;
  context: string;
  options: Option[];
  onUpdatePhoto: (updates: Partial<Photo>) => void;
  onUpdateRound: (updates: { context?: string; options?: Option[] }) => void;
  onRemoveColumn: () => void;
}

export function ImpostorLevel1Column({
  index,
  photo,
  context,
  options,
  onUpdatePhoto,
  onUpdateRound,
  onRemoveColumn,
}: ImpostorLevel1ColumnProps) {
  const addOption = () => {
    if (options.length < 4) {
      onUpdateRound({ options: [...options, { text: "", isImpostor: false }] });
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== idx);
      onUpdateRound({ options: newOptions });
    }
  };

  const updateOptionText = (idx: number, text: string) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], text };
    onUpdateRound({ options: newOptions });
  };

  const toggleOptionImpostor = (idx: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isImpostor: i === idx ? !opt.isImpostor : false, // Only one can be impostor
    }));
    onUpdateRound({ options: newOptions });
  };

  return (
    <Card className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-2 transition-all hover:border-brand/30 hover:shadow-lg">
      <CardHeader className="shrink-0 border-b bg-muted/30 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand text-2xs font-bold text-brand-foreground shadow-sm">
              #{index}
            </div>
            <h3 className="text-xs font-bold uppercase tracking-tight text-foreground">
              Nivel 1
            </h3>
          </div>
          <button
            onClick={onRemoveColumn}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
        {/* Context Input */}
        <div className="space-y-1.5">
          <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/60 px-1">
            Contexto / Título
          </label>
          <Textarea
            value={context}
            onChange={(e) => onUpdateRound({ context: e.target.value })}
            placeholder="Escribe el contexto..."
            className="min-h-[50px] resize-none text-xs leading-relaxed focus-visible:ring-brand/30"
          />
        </div>

        {/* Larger Simple Photo Section */}
        <div className="space-y-1.5">
          <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/60 px-1">
            Imagen única
          </label>
          <div className="px-2">
            <ImpostorCard
              id={photo.id}
              name={photo.name}
              imageUrl={photo.url}
              isImpostor={false} // Force false in UI
              onImageChange={(file, url) => onUpdatePhoto({ file, url })}
              onNameChange={() => {}}
              onToggleImpostor={() => {}}
              onRemove={() => {}}
              variant="simple"
              hideName={true}
            />
          </div>
        </div>

        {/* Options Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/60">
              Opciones ({options.length}/4)
            </label>
            {options.length < 4 && (
              <button
                onClick={addOption}
                className="flex h-5 w-5 items-center justify-center rounded bg-brand/10 text-brand hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="group relative">
                <div
                  className={`flex items-center gap-2 rounded-md border transition-all ${
                    option.isImpostor
                      ? "border-brand bg-brand/5 ring-1 ring-brand/20 shadow-sm"
                      : "border-border bg-background/50"
                  }`}
                >
                  <button
                    onClick={() => toggleOptionImpostor(idx)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-l-md border-r transition-colors ${
                      option.isImpostor
                        ? "bg-brand text-brand-foreground border-brand/20"
                        : "bg-muted/30 text-muted-foreground/30 hover:text-brand hover:bg-brand/10"
                    }`}
                  >
                    <AlertCircle
                      className={`h-4 w-4 ${option.isImpostor ? "animate-pulse" : ""}`}
                    />
                  </button>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOptionText(idx, e.target.value)}
                    placeholder={`Opción ${idx + 1}...`}
                    className="flex-1 bg-transparent px-2 text-xs focus:outline-none placeholder:text-muted-foreground/30 h-9"
                  />
                  {options.length > 1 && (
                    <button
                      onClick={() => removeOption(idx)}
                      className="mr-2 text-muted-foreground/30 hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
