import Link from "next/link";
import { FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      {/* Top bar */}
      <header className="flex h-12 items-center border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-red-600">
            <span className="text-[9px] font-black text-white leading-none">
              Q
            </span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            QGEM App Center
          </span>
        </div>
        <div className="ml-auto">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            TV Perú
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg space-y-10">
          {/* Hero */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-[0.2em]">
              Colector de datos
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Que Gane el Mejor
            </h1>
            <p className="text-sm text-muted-foreground">
              Selecciona el módulo de recolección para comenzar.
            </p>
          </div>

          {/* Module cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/deletreo"
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-red-600/50 hover:bg-card/80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Deletreo
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Gestión de palabras por rondas
                </p>
              </div>
              <div className="absolute right-4 top-4 text-muted-foreground/30 transition-all group-hover:text-red-600/60 text-sm">
                →
              </div>
            </Link>

            <Link
              href="/personajes"
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-red-600/50 hover:bg-card/80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Personajes
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Nombres e imágenes de personajes
                </p>
              </div>
              <div className="absolute right-4 top-4 text-muted-foreground/30 transition-all group-hover:text-red-600/60 text-sm">
                →
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-6 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              BroadStream Coders © {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] text-muted-foreground">
                Sistema activo
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
