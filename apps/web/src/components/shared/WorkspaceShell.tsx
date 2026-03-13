"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface WorkspaceShellProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function WorkspaceShell({
  title,
  icon,
  badge,
  actions,
  children,
}: WorkspaceShellProps) {
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
              {icon}
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {title}
            </span>
          </div>

          {badge && (
            <span className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
              {badge}
            </span>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>
    </>
  );
}
