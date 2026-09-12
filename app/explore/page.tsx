"use client";
import Link from "next/link";
const PICKS = [
  { title: "Neon after the rain", style: "80s synthwave, tenor vocal, gated drums", blurb: "Chrome skyline, one last dance." },
  { title: "Porch light", style: "country ballad, male vocal, pedal steel", blurb: "Small-town goodbye with the engine running." },
  { title: "Choir in the wire", style: "gospel choir, piano, church reverb", blurb: "Hope that still has dust on it." },
  { title: "Wrong number", style: "dark trap, whispered hook, 808s", blurb: "2am text you should not have sent." },
  { title: "River names", style: "folk, nylon guitar, soft vocal", blurb: "Every town the water passed through." },
  { title: "Voltage garden", style: "indie pop, breathy female vocal, analog synths", blurb: "Summer that refused to end." }
];
export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-4xl">Explore</h1>
      <p className="mt-2 text-white/45">Steal a prompt. Make it yours.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PICKS.map((p) => (
          <Link key={p.title} href={`/create?style=${encodeURIComponent(p.style)}`} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:border-gold-400/30">
            <h2 className="font-display text-2xl">{p.title}</h2>
            <p className="mt-1 text-sm text-white/50">{p.blurb}</p>
            <p className="mt-3 text-xs text-gold-300/80">{p.style}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
