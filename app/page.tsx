"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { SongCard } from "@/components/SongCard";

const GENRES = ["Synthwave", "Country", "Gospel", "Trap", "Folk", "Metal", "R&B", "Piano ballad"];

export default function HomePage() {
  const { songs, credits } = useStore();
  const recent = songs.slice(0, 8);
  return (
    <div className="mx-auto max-w-5xl">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-400">Canto studio</p>
        <h1 className="mt-3 max-w-xl font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">Type a feeling. Hear a song.</h1>
        <p className="mt-4 max-w-lg text-white/55">Simple mode from one sentence. Custom mode with your lyrics and style box. Two takes each time. Connect ACE-Step in Settings for real generation.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/create" className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950">Create a song</Link>
          <Link href="/settings" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80">Connect ACE-Step</Link>
        </div>
        <p className="mt-6 text-xs text-white/35">{credits} credits remaining</p>
      </section>
      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-wider text-white/40">Start from a lane</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Link key={g} href={`/create?style=${encodeURIComponent(g.toLowerCase())}`} className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70 hover:border-gold-400/40 hover:text-white">{g}</Link>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-sm uppercase tracking-wider text-white/40">Your catalog</h2>
          <Link href="/library" className="text-sm text-gold-300">Library</Link>
        </div>
        {recent.length === 0 ? <p className="mt-6 text-white/40">Nothing yet. Create your first two takes.</p> : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">{recent.map((s) => <SongCard key={s.id} song={s} />)}</div>
        )}
      </section>
    </div>
  );
}
