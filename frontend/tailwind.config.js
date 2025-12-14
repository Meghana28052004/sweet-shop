/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: "#FF5DA2",
          purple: "#A25CFF",
          yellow: "#FFD166",
          mint: "#06D6A0",
          sky: "#00B4D8",
        },
      },
    },
  },
  plugins: [],
}
