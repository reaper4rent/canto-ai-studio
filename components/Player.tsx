"use client";

import { useStore } from "@/lib/store";
import { Cover } from "./Cover";
import Link from "next/link";

function fmt(s: number) {
  if (!s || Number.isNaN(s) || !Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function Player() {
  const { player, toggle, seek } = useStore();
  const song = player.current;
  if (!song) return null;
  const pct = player.duration ? (player.time / player.duration) * 100 : 0;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0c0c12]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Cover id={song.id} title="" className="h-12 w-12 shrink-0" />
        <div className="min-w-0 w-40">
          <Link href={`/song/${song.id}`} className="block truncate text-sm font-medium">
            {song.title}
          </Link>
          <p className="truncate text-[11px] text-white/40">{song.style}</p>
        </div>
        <button type="button" onClick={toggle} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-400 text-ink-950 text-sm font-semibold">
          {player.playing ? "||" : ">"}
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="w-10 text-right text-[11px] text-white/40">{fmt(player.time)}</span>
          <input type="range" min={0} max={player.duration || 0} step={0.1} value={player.time} onChange={(e) => seek(Number(e.target.value))} className="w-full accent-gold-400" />
          <span className="w-10 text-[11px] text-white/40">{fmt(player.duration)}</span>
        </div>
      </div>
    </div>
  );
}
