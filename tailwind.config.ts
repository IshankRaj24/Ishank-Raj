import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#fbf7ff",
          100: "#f4eaff",
          200: "#ead8ff",
          300: "#d8b8ff",
          400: "#b58bea",
          500: "#9362cc",
          700: "#654392",
        },
        cream: {
          50: "#fffaf0",
          100: "#fff1d6",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
        script: ["Caveat", "Bradley Hand", "cursive"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(244, 114, 182, 0.35)",
        soft: "0 24px 80px rgba(83, 63, 111, 0.12)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.2) rotate(18deg)" },
        },
        drift: {
          "0%": { transform: "translate3d(0, 100vh, 0) rotate(0deg)", opacity: "0" },
          "10%, 85%": { opacity: "0.75" },
          "100%": { transform: "translate3d(20px, -10vh, 0) rotate(180deg)", opacity: "0" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        sparkle: "sparkle 2.8s ease-in-out infinite",
        drift: "drift 12s linear infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;
