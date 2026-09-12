import type { CSSProperties } from "react";

const PALETTES = [
  ["#1b1030", "#d4a054", "#ff6b4a"],
  ["#0b1d2a", "#3dd6c6", "#f2c14e"],
  ["#1a0b16", "#e05aa0", "#7c5cff"],
  ["#10140c", "#9ad64b", "#f0e38a"],
  ["#140c08", "#ff8a3d", "#5c2a00"],
  ["#0c1020", "#6ea8ff", "#d9e6ff"],
  ["#1a0810", "#ff4d6d", "#ffd166"],
  ["#0d1512", "#2ee59d", "#c9fbd5"]
];

export function coverPalette(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTES[n % PALETTES.length];
}

export function coverStyle(id: string): CSSProperties {
  const [a, b, c] = coverPalette(id);
  return {
    backgroundImage: `radial-gradient(120% 80% at 20% 10%, ${b}cc, transparent 50%),
      radial-gradient(90% 70% at 90% 90%, ${c}99, transparent 46%),
      linear-gradient(160deg, ${a}, #09090f)`
  };
}
