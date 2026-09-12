const HOOKS = [
  "We keep the lights on just to feel the night",
  "Every scar is a map back home",
  "Say my name like a chorus in the dark",
  "I was gold until the morning came",
  "Run with me until the sirens fade",
  "Love like thunder, leave like rain"
];

function hash(s: string) {
  let n = 7;
  for (let i = 0; i < s.length; i++) n = (n * 33 + s.charCodeAt(i)) >>> 0;
  return n;
}

function pick<T>(arr: T[], n: number) {
  return arr[n % arr.length];
}

export function inventTitle(prompt: string, style: string) {
  const seed = hash(prompt + style);
  const words = `${prompt} ${style}`
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 8);
  const a = pick(words.length ? words : ["Midnight"], seed);
  const b = pick(["Static", "Garden", "Voltage", "Halo", "Afterglow", "Cipher", "Ember", "River"], seed >> 3);
  return `${cap(a)} ${b}`.slice(0, 32);
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function inventLyrics(prompt: string, style: string) {
  const seed = hash(prompt + "|" + style);
  const hook = pick(HOOKS, seed);
  const subject = prompt.trim() || "a night that would not end";
  return `[Verse]\nI wrote it down in the glow of a cheap motel sign\n${subject}\nThe radio hummed in a language I almost knew\n\n[Chorus]\n${hook}\n${hook}\nDon't you dare look away\n\n[Verse]\n${cap(style.split(",")[0] || "the band")} in the wires, dust on the keys\nWe counted the miles in unfinished melodies\n\n[Bridge]\nIf the morning steals the color from the room\nLeave the tape running — I'll find you in the tune\n\n[Chorus]\n${hook}\n${hook}\nDon't you dare look away`;
}

export const STYLE_CHIPS = [
  "indie pop, breathy female vocal, analog synths",
  "country ballad, male vocal, pedal steel, warm tape",
  "dark trap, 808s, whispered hook, night drive",
  "80s synthwave, neon, gated drums, tenor vocal",
  "gospel choir, piano, church reverb, hopeful",
  "metalcore, screamed verse, clean chorus, tight drums",
  "bossa nova, nylon guitar, soft male vocal, midnight",
  "cinematic orchestral, wordless choir, thunder percussion"
];

export const PROMPT_SEEDS = [
  "A song about leaving a small town with the headlights off",
  "Late-night diner love story that never gets a second chapter",
  "Anthem for starting over after the fire",
  "Soft song about a dog waiting by the door",
  "Club track about texting the wrong person at 2am",
  "Folk tune about a river that remembers every name"
];
