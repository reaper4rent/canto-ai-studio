"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PROMPT_SEEDS, STYLE_CHIPS } from "@/lib/lyrics";
import { SongCard } from "./SongCard";
import type { Song } from "@/lib/types";

const COST = 10;

export function CreateStudio({ preset }: { preset?: { style?: string; lyrics?: string; parentId?: string; action?: "extend" | "remix" | "cover" } }) {
  const { songs, upsertSongs, spendCredits, credits } = useStore();
  const [mode, setMode] = useState<"simple" | "custom">(preset?.lyrics ? "custom" : "simple");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(preset?.style || "");
  const [lyrics, setLyrics] = useState(preset?.lyrics || "");
  const [instrumental, setInstrumental] = useState(false);
  const [duration, setDuration] = useState(60);
  const [weirdness, setWeirdness] = useState(50);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState("");
  const latest = useMemo(() => songs.filter((s) => s.action !== undefined).slice(0, 8), [songs]);

  async function writeLyrics() {
    const res = await fetch("/api/lyrics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: prompt || lyrics, style }) });
    const json = await res.json();
    setLyrics(json.lyrics);
    setMode("custom");
  }

  async function create() {
    setError("");
    if (mode === "simple" && !prompt.trim()) { setError("Describe the song first."); return; }
    if (mode === "custom" && !style.trim() && !lyrics.trim()) { setError("Add a style or lyrics."); return; }
    if (!spendCredits(COST)) { setError("Not enough credits. Add more in Settings."); return; }
    setBusy(true);
    try {
      const falKey = localStorage.getItem("canto.falKey") || "";
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(falKey ? { "x-fal-key": falKey } : {}) },
        body: JSON.stringify({ mode, prompt, style: mode === "simple" ? prompt : style, lyrics, instrumental, duration, weirdness, parentId: preset?.parentId, action: preset?.action || "create", takes: 2 })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      upsertSongs(json.songs as Song[]);
      setEngine(json.engine);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  const title = preset?.action === "extend" ? "Extend" : preset?.action === "remix" ? "Remix" : preset?.action === "cover" ? "Cover" : "Create";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-white/45">Simple mode writes the song. Custom mode takes your lyrics and style.</p>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">{credits} credits</div>
      </div>
      <div className="mt-6 inline-flex rounded-full bg-white/5 p-1 text-sm">
        {(["simple", "custom"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 capitalize ${mode === m ? "bg-gold-400 text-ink-950" : "text-white/60"}`}>{m}</button>
        ))}
      </div>
      {mode === "simple" ? (
        <div className="mt-5">
          <label className="text-xs uppercase tracking-wider text-white/40">Song description</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A dusty desert rock song about driving until the radio dies..." className="mt-2 h-36 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-[15px] leading-relaxed" />
          <div className="mt-3 flex flex-wrap gap-2">
            {PROMPT_SEEDS.map((s) => <button key={s} type="button" onClick={() => setPrompt(s)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55 hover:text-white">{s}</button>)}
            <button type="button" onClick={() => setPrompt(PROMPT_SEEDS[Math.floor(Math.random() * PROMPT_SEEDS.length)])} className="rounded-full border border-gold-500/30 px-3 py-1 text-xs text-gold-300">Surprise me</button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-white/40">Lyrics</label>
              <button type="button" onClick={writeLyrics} className="text-xs text-gold-300">Write lyrics</button>
            </div>
            <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder="[Verse]\n...\n[Chorus]" disabled={instrumental} className="mt-2 h-48 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-mono text-sm disabled:opacity-40" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-white/40">Style</label>
            <textarea value={style} onChange={(e) => setStyle(e.target.value)} placeholder="genre, vocal type, instruments, era, mix" className="mt-2 h-24 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm" />
            <div className="mt-3 flex flex-wrap gap-2">
              {STYLE_CHIPS.map((s) => <button key={s} type="button" onClick={() => setStyle(s)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55 hover:text-white">{s.split(",")[0]}</button>)}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 grid gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={instrumental} onChange={(e) => setInstrumental(e.target.checked)} /> Instrumental</label>
        <label className="text-sm"><span className="text-white/45">Length {duration}s</span><input type="range" min={30} max={180} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-2 w-full accent-gold-400" /></label>
        <label className="text-sm"><span className="text-white/45">Weirdness {weirdness}</span><input type="range" min={0} max={100} value={weirdness} onChange={(e) => setWeirdness(Number(e.target.value))} className="mt-2 w-full accent-gold-400" /></label>
      </div>
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      {engine === "demo" && !error && <p className="mt-4 text-sm text-gold-300/80">Demo engine is on. Add a fal.ai key in Settings for real ACE-Step songs.</p>}
      <button type="button" onClick={create} disabled={busy} className="mt-6 w-full rounded-2xl bg-gold-400 py-3 text-sm font-semibold text-ink-950 shadow-glow disabled:opacity-50">{busy ? "Composing two takes..." : `Create · ${COST} credits`}</button>
      {latest.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm uppercase tracking-wider text-white/40">This session</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{latest.map((s) => <SongCard key={s.id} song={s} />)}</div>
        </section>
      )}
    </div>
  );
}
