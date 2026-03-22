/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0000ff", // Focus Blue
        "emergency": "#ff0000",
        "warning": "#ffbf00",
        "background-light": "#f5f5f8",
        "background-dark": "#0a0a0b", // Matte Deep Gray
        "panel": "#141416",
        "border-muted": "#2d2d30",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "lg": "0.375rem", // 6px for panels
        "item": "0.25rem" // 4px for items
      },
    },
  },
  plugins: [],
}
