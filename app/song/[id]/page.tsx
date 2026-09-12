"use client";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Cover } from "@/components/Cover";
import { CreateStudio } from "@/components/CreateStudio";

export default function SongPage() {
  const { id } = useParams<{ id: string }>();
  const { songs, play, player, toggle, toggleLike, removeSong } = useStore();
  const [panel, setPanel] = useState<"none" | "extend" | "remix" | "cover">("none");
  const song = useMemo(() => songs.find((s) => s.id === id), [songs, id]);
  if (!song) return <p className="text-white/50">Song not in this browser library.</p>;
  const playing = player.current?.id === song.id && player.playing;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <Cover id={song.id} title={song.model} className="aspect-square w-full" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-400">{song.model}</p>
          <h1 className="mt-2 font-display text-4xl">{song.title}</h1>
          <p className="mt-2 text-white/50">{song.style}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => (playing ? toggle() : play(song))} className="rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-ink-950">{playing ? "Pause" : "Play"}</button>
            <button type="button" onClick={() => toggleLike(song.id)} className="rounded-full border border-white/15 px-4 py-2 text-sm">{song.liked ? "Liked" : "Like"}</button>
            <a href={song.audioUrl} download className="rounded-full border border-white/15 px-4 py-2 text-sm">Download</a>
            <button type="button" onClick={() => removeSong(song.id)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-red-300">Delete</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {(["extend", "remix", "cover"] as const).map((a) => (
              <button key={a} type="button" onClick={() => setPanel(panel === a ? "none" : a)} className={`rounded-full px-4 py-1.5 capitalize ${panel === a ? "bg-white/15" : "border border-white/10 text-white/70"}`}>{a}</button>
            ))}
          </div>
        </div>
      </div>
      {song.lyrics && <section className="mt-10 whitespace-pre-wrap rounded-2xl border border-white/8 bg-white/[0.03] p-6 font-mono text-sm leading-7 text-white/75">{song.lyrics}</section>}
      {panel !== "none" && (
        <section className="mt-10 border-t border-white/10 pt-8">
          <CreateStudio preset={{ style: song.style, lyrics: song.lyrics, parentId: song.id, action: panel }} />
        </section>
      )}
    </div>
  );
}
