/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Dark architectural palette. Values live as CSS custom properties in
          // app/globals.css so they can be used from plain CSS too.
          bg: "rgb(var(--brand-bg) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          card: "rgb(var(--brand-card) / <alpha-value>)",
          elevated: "rgb(var(--brand-elevated) / <alpha-value>)",
          ink: "rgb(var(--brand-ink) / <alpha-value>)",
          secondary: "rgb(var(--brand-secondary) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          gold: "rgb(var(--brand-gold) / <alpha-value>)",
          bronze: "rgb(var(--brand-bronze) / <alpha-value>)",
          line: "rgb(var(--brand-line) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(3.5rem, 9vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          sm: "2rem",
          lg: "4rem",
        },
      },
      maxWidth: {
        "8xl": "96rem",
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
      boxShadow: {
        lift: "0 30px 70px -35px rgba(0, 0, 0, 0.75)",
        "gold-soft": "0 0 0 1px rgba(196, 164, 106, 0.28), 0 30px 70px -40px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        "scroll-dot": "scrollDot 2.2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out both",
        "draw-line": "drawLine 2.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        scrollDot: {
          "0%": { transform: "translateY(0)", opacity: 0.3 },
          "50%": { transform: "translateY(8px)", opacity: 1 },
          "100%": { transform: "translateY(0)", opacity: 0.3 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        drawLine: {
          from: { strokeDashoffset: 1 },
          to: { strokeDashoffset: 0 },
        },
      },
    },
  },
  plugins: [],
};
