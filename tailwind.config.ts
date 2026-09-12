import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070b",
          900: "#0c0c12",
          800: "#13131c",
          700: "#1c1c28",
          600: "#2a2a3a"
        },
        gold: {
          300: "#f3d39a",
          400: "#e8b86d",
          500: "#d4a054"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(212, 160, 84, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
