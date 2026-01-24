/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Geist Mono"', '"SF Mono"', "Menlo", "Monaco", "monospace"],
        sans: ['"Geist"', "system-ui", "sans-serif"],
      },
      colors: {
        aluminum: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#0f0f11",
        },
        champagne: {
          50: "#fdfaf7",
          100: "#f9f3eb",
          200: "#f2e5d5",
          300: "#e8d1b8",
          400: "#d4a574",
          500: "#c4915a",
        },
      },
      boxShadow: {
        key: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 -1px 0 0 rgba(0,0,0,0.2) inset, 0 2px 4px rgba(0,0,0,0.4)",
        "key-pressed":
          "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 -1px 0 0 rgba(0,0,0,0.3) inset, 0 1px 2px rgba(0,0,0,0.3)",
        keyboard:
          "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
        ambient:
          "0 0 120px 40px rgba(255,255,255,0.03), 0 0 60px 20px rgba(255,255,255,0.02)",
      },
    },
  },
  plugins: [],
};
