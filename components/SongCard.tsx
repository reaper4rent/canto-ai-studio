"use client";

import Link from "next/link";
import { Cover } from "./Cover";
import type { Song } from "@/lib/types";
import { useStore } from "@/lib/store";

function formatTime(s: number) {
  if (!s || Number.isNaN(s)) return "--:--";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function SongCard({ song }: { song: Song }) {
  const { play, player, toggle, toggleLike } = useStore();
  const active = player.current?.id === song.id;
  const playing = active && player.playing;
  return (
    <article className="group rounded-2xl border border-white/5 bg-white/[0.03] p-3 hover:bg-white/[0.05] transition">
      <button type="button" className="relative w-full text-left" onClick={() => (playing ? toggle() : play(song))}>
        <Cover id={song.id} title={song.model} className="aspect-square w-full" />
        <span className="absolute inset-0 m-auto h-11 w-11 grid place-items-center rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 transition">
          {playing ? "||" : ">"}
        </span>
        {song.demo && (
          <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold-300">demo</span>
        )}
      </button>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/song/${song.id}`} className="block truncate text-sm font-medium hover:text-gold-300">{song.title}</Link>
          <p className="truncate text-xs text-white/45">{song.style || song.prompt}</p>
        </div>
        <button type="button" onClick={() => toggleLike(song.id)} className={`text-sm ${song.liked ? "text-gold-400" : "text-white/30 hover:text-white/70"}`} aria-label="like">*</button>
      </div>
      <p className="mt-1 text-[11px] text-white/30">{formatTime(song.duration)}</p>
    </article>
  );
}
