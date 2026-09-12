"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { credits, addCredits } = useStore();
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { setKey(localStorage.getItem("canto.falKey") || ""); }, []);
  function save() {
    localStorage.setItem("canto.falKey", key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-2 text-sm text-white/50">Without a key, Canto plays demo previews. A fal.ai key runs ACE-Step for original songs with vocals.</p>
      <section className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="text-sm uppercase tracking-wider text-white/40">fal.ai API key</h2>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="fal-xxxxxxxx" className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm" />
        <button type="button" onClick={save} className="mt-3 rounded-full bg-gold-400 px-4 py-2 text-sm font-semibold text-ink-950">{saved ? "Saved" : "Save key"}</button>
      </section>
      <section className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="text-sm uppercase tracking-wider text-white/40">Credits</h2>
        <p className="mt-2 text-3xl text-gold-300">{credits}</p>
        <button type="button" onClick={() => addCredits(50)} className="mt-3 rounded-full border border-white/15 px-4 py-2 text-sm">Add 50 demo credits</button>
      </section>
    </div>
  );
}
