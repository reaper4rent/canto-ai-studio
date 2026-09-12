export type DemoTrack = {
  url: string;
  duration: number;
  vibe: string[];
};

export const DEMO_TRACKS: DemoTrack[] = [
  {
    url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    duration: 90,
    vibe: ["house", "electronic", "dance", "edm", "club"]
  },
  {
    url: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3",
    duration: 90,
    vibe: ["hip hop", "rap", "trap", "lofi", "lo-fi"]
  },
  {
    url: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3",
    duration: 90,
    vibe: ["cinematic", "epic", "orchestral", "trailer"]
  },
  {
    url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    duration: 90,
    vibe: ["ambient", "chill", "calm", "piano", "sad"]
  },
  {
    url: "https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3",
    duration: 90,
    vibe: ["folk", "acoustic", "indie", "country", "singer"]
  },
  {
    url: "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3",
    duration: 90,
    vibe: ["r&b", "soul", "urban", "jazz", "neo"]
  },
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 180,
    vibe: ["pop", "rock", "default"]
  },
  {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 180,
    vibe: ["metal", "punk", "aggressive"]
  }
];

export function pickDemoTrack(style: string, offset = 0): DemoTrack {
  const hay = style.toLowerCase();
  const scored = DEMO_TRACKS.map((t, i) => ({
    t,
    s: t.vibe.reduce((acc, v) => acc + (hay.includes(v) ? 3 : 0), 0) + ((i + offset) % 3)
  }));
  scored.sort((a, b) => b.s - a.s);
  return scored[offset % scored.length]?.t ?? DEMO_TRACKS[0];
}
