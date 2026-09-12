"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { SongCard } from "@/components/SongCard";

export default function LibraryPage() {
  const { songs } = useStore();
  const [q, setQ] = useState("");
  const [likedOnly, setLikedOnly] = useState(false);
  const filtered = useMemo(() => songs.filter((s) => {
    if (likedOnly && !s.liked) return false;
    if (!q.trim()) return true;
    return `${s.title} ${s.style} ${s.prompt} ${s.lyrics}`.toLowerCase().includes(q.toLowerCase());
  }), [songs, q, likedOnly]);
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-4xl">Library</h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles, styles, lyrics" className="min-w-[220px] flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm" />
        <button type="button" onClick={() => setLikedOnly((v) => !v)} className={`rounded-full px-4 py-2 text-sm ${likedOnly ? "bg-gold-400 text-ink-950" : "border border-white/10 text-white/70"}`}>Liked</button>
      </div>
      {filtered.length === 0 ? <p className="mt-10 text-white/40">No songs match.</p> : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{filtered.map((s) => <SongCard key={s.id} song={s} />)}</div>
      )}
    </div>
  );
}
