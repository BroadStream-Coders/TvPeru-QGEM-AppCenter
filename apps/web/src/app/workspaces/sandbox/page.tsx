"use client";

import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";

export default function SandboxPage() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Box className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold tracking-tight">Sandbox</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground mb-4">
          <Box className="h-8 w-8 opacity-50" />
        </div>
        <h2 className="text-xl font-bold mb-2">Entorno de Pruebas</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Este colector está completamente aislado. Aquí construiremos y probaremos la 
          arquitectura estandarizada de componentes GroupColumn sin afectar otros módulos.
        </p>
      </main>
    </div>
  );
}
