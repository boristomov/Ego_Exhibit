/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Dashboard palette, retuned for a darker, more cinematic exhibit feel.
      colors: {
        bg: "#070809",
        "bg-elev": "#0c0d10",
        panel: "#101216",
        "panel-hover": "#161a20",
        border: "#23272f",
        "border-strong": "#363c46",
        text: "#f4f6fa",
        "text-muted": "#9aa3b2",
        "text-dim": "#646b78",
        accent: "#7c3aed",        // violet 600
        "accent-bright": "#a78bfa", // violet 400
        "accent-deep": "#5b21b6", // violet 800
        cyan: "#22d3ee",
        emerald: "#34d399",
        amber: "#fbbf24",
        rose: "#fb7185",
      },
      fontFamily: {
        sans: [
          "InterVariable",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
        display: [
          "InterVariable",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 60px -20px rgba(124, 58, 237, 0.55)",
        "glow-strong": "0 0 80px -10px rgba(124, 58, 237, 0.8)",
        soft: "0 10px 30px -12px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #22d3ee 100%)",
        "grid-fade":
          "radial-gradient(ellipse at center, rgba(124,58,237,0.18), transparent 60%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-pan": {
          "0%": { transform: "scale(1.05) translateX(0)" },
          "100%": { transform: "scale(1.05) translateX(-2%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "slow-pan": "slow-pan 24s linear infinite alternate",
        marquee: "marquee 60s linear infinite",
      },
    },
  },
  plugins: [],
};
