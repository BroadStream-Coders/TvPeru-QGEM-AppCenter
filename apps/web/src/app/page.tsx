import Link from "next/link";
import { FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      {/* Top bar */}
      {/* Top bar */}
      <header className="flex h-12 items-center border-b border-border px-6 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 border border-brand/20 shadow-[0_0_15px_rgba(var(--brand-rgb),0.1)]">
            <span className="text-3xs font-black text-brand leading-none">
              Q
            </span>
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground/90">
            QGEM App Center
          </span>
        </div>
        <div className="ml-auto">
          <span className="rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-2xs font-bold text-muted-foreground uppercase tracking-widest">
            TV Perú
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg space-y-10">
          {/* Hero */}
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-caption font-mono font-medium text-muted-foreground uppercase tracking-header">
              Workspaces de datos
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Que Gane el Mejor
            </h1>
            <p className="text-sm text-muted-foreground">
              Selecciona un área de trabajo para comenzar la producción.
            </p>
          </div>

          {/* Module cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/workspaces/deletreo"
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-brand/40 hover:bg-card/80 active:scale-[0.98] hover:shadow-lg hover:shadow-brand/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand transition-colors">
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
              <div className="absolute right-4 top-4 text-muted-foreground/30 transition-all group-hover:text-brand/60 group-hover:translate-x-0.5 text-sm font-bold">
                →
              </div>
            </Link>

            <Link
              href="/workspaces/personajes"
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-brand/40 hover:bg-card/80 active:scale-[0.98] hover:shadow-lg hover:shadow-brand/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand transition-colors">
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
              <div className="absolute right-4 top-4 text-muted-foreground/30 transition-all group-hover:text-brand/60 group-hover:translate-x-0.5 text-sm font-bold">
                →
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer sticky to bottom */}
      <footer className="footer-home border-t border-border h-12 px-6 sm:px-8 flex items-center justify-between gap-4 bg-background/50 backdrop-blur-md">
        <p className="text-caption text-muted-foreground font-mono">
          BroadStream Coders © {new Date().getFullYear()} — TV PERÚ
        </p>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/10 border border-success/20">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(var(--success-rgb),0.5)]" />
          <span className="text-3xs font-mono font-bold text-success uppercase tracking-widest">
            Sistema activo
          </span>
        </div>
      </footer>
    </div>
  );
}
