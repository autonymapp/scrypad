/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scry: {
          bg: "#0e1117",
          panel: "#161b22",
          card: "#1c2128",
          border: "#30363d",
          accent: "#8b5cf6",
          accentHover: "#7c3aed"
        }
      }
    },
  },
  plugins: [],
}
