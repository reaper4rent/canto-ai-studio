"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/library", label: "Library" },
  { href: "/explore", label: "Explore" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  const path = usePathname();
  const { credits } = useStore();
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/5 bg-black/20 px-4 py-6">
      <Link href="/" className="mb-8 px-2">
        <div className="font-display text-2xl tracking-tight">Canto</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-gold-400/80">AI studio</div>
      </Link>
      <nav className="flex flex-col gap-1">
        {LINKS.map((l) => {
          const on = path === l.href;
          return (
            <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 text-sm ${on ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-gold-500/20 bg-gold-500/5 p-3">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Credits</p>
        <p className="mt-1 text-2xl font-medium text-gold-300">{credits}</p>
        <p className="mt-1 text-[11px] text-white/35">Create uses 10 · two takes</p>
      </div>
    </aside>
  );
}
