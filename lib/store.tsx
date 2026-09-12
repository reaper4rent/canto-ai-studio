"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Song } from "./types";

const STORAGE_KEY = "canto.library.v1";
const CREDITS_KEY = "canto.credits.v1";
const STARTING_CREDITS = 50;

type PlayerState = { current: Song | null; playing: boolean; time: number; duration: number };
type Store = {
  songs: Song[]; credits: number; player: PlayerState; audioRef: RefObject<HTMLAudioElement>;
  upsertSongs: (next: Song[]) => void; toggleLike: (id: string) => void; removeSong: (id: string) => void;
  spendCredits: (n: number) => boolean; addCredits: (n: number) => void; play: (song: Song) => void;
  toggle: () => void; seek: (t: number) => void;
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [credits, setCredits] = useState(STARTING_CREDITS);
  const [player, setPlayer] = useState<PlayerState>({ current: null, playing: false, time: 0, duration: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const hydrated = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSongs(JSON.parse(raw));
      const c = localStorage.getItem(CREDITS_KEY);
      if (c) setCredits(Number(c));
    } catch {}
    hydrated.current = true;
  }, []);
  useEffect(() => { if (hydrated.current) localStorage.setItem(STORAGE_KEY, JSON.stringify(songs)); }, [songs]);
  useEffect(() => { if (hydrated.current) localStorage.setItem(CREDITS_KEY, String(credits)); }, [credits]);
  const upsertSongs = useCallback((next: Song[]) => {
    setSongs((prev) => {
      const map = new Map(prev.map((s) => [s.id, s]));
      for (const s of next) map.set(s.id, { ...map.get(s.id), ...s });
      return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
    });
  }, []);
  const toggleLike = useCallback((id: string) => setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, liked: !s.liked } : s))), []);
  const removeSong = useCallback((id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    setPlayer((p) => (p.current?.id === id ? { ...p, current: null, playing: false } : p));
  }, []);
  const spendCredits = useCallback((n: number) => { if (credits < n) return false; setCredits((c) => c - n); return true; }, [credits]);
  const addCredits = useCallback((n: number) => setCredits((c) => c + n), []);
  const play = useCallback((song: Song) => {
    const el = audioRef.current;
    setPlayer((p) => ({ ...p, current: song, playing: true, time: 0 }));
    if (el) { if (el.src !== song.audioUrl) el.src = song.audioUrl; void el.play(); }
  }, []);
  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !player.current) return;
    if (player.playing) { el.pause(); setPlayer((p) => ({ ...p, playing: false })); }
    else { void el.play(); setPlayer((p) => ({ ...p, playing: true })); }
  }, [player.current, player.playing]);
  const seek = useCallback((t: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = t;
    setPlayer((p) => ({ ...p, time: t }));
  }, []);
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setPlayer((p) => ({ ...p, time: el.currentTime, duration: el.duration || p.duration }));
    const onMeta = () => setPlayer((p) => ({ ...p, duration: el.duration || 0 }));
    const onEnd = () => setPlayer((p) => ({ ...p, playing: false, time: 0 }));
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => { el.removeEventListener("timeupdate", onTime); el.removeEventListener("loadedmetadata", onMeta); el.removeEventListener("ended", onEnd); };
  }, []);
  const value = useMemo(() => ({ songs, credits, player, audioRef, upsertSongs, toggleLike, removeSong, spendCredits, addCredits, play, toggle, seek }), [songs, credits, player, upsertSongs, toggleLike, removeSong, spendCredits, addCredits, play, toggle, seek]);
  return (<Ctx.Provider value={value}><audio ref={audioRef} preload="none" />{children}</Ctx.Provider>);
}
export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}
