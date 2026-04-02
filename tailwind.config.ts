import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
        serif: ["EB Garamond", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: {
          500: "#2563EB",
          600: "#1E40AF",
          700: "#1E3A8A",
        },
        accent: {
          500: "#D97706",
          600: "#B45309",
        },
        surface: "#FFFFFF",
        "surface-soft": "#F1F5F9",
        border: "#CBD5E1",
        text: "#0F172A",
        "text-muted": "#475569",
        "success-bg": "#DCFCE7",
        "success-fg": "#166534",
        "warning-bg": "#FEF3C7",
        "warning-fg": "#92400E",
        "danger-bg": "#FEE2E2",
        "danger-fg": "#B91C1C",
        "info-bg": "#DBEAFE",
        "info-fg": "#1E3A8A",
      },
      boxShadow: {
        soft: "0 20px 60px -28px rgba(15, 23, 42, 0.22)",
        elevated: "0 24px 70px -28px rgba(15, 23, 42, 0.28)",
      },
      backgroundImage: {
        "app-shell":
          "radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 38%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      },
      keyframes: {
        indeterminate: {
          "0%": { transform: "translateX(-55%) scaleX(0.55)" },
          "100%": { transform: "translateX(180%) scaleX(0.9)" },
        },
      },
      animation: {
        indeterminate: "indeterminate 1.5s linear infinite",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
