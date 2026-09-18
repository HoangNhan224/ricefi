/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paddy: {
          900: "var(--paddy-900)",
          500: "var(--paddy-500)",
        },
        husk: {
          100: "var(--husk-100)",
        },
        clay: {
          600: "var(--clay-600)",
        },
        gold: {
          500: "var(--gold-500)",
        },
        water: {
          600: "var(--water-600)",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ['"Be Vietnam Pro"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
