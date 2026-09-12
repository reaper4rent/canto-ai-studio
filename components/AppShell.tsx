"use client";

import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { Player } from "./Player";
import Link from "next/link";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-3 md:hidden">
            <Link href="/" className="font-display text-xl">
              Canto
            </Link>
            <nav className="flex gap-3 text-sm text-white/70">
              <Link href="/create">Create</Link>
              <Link href="/library">Library</Link>
            </nav>
          </header>
          <main className="flex-1 px-4 py-6 pb-28 md:px-10">{children}</main>
        </div>
      </div>
      <Player />
    </StoreProvider>
  );
}
