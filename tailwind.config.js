/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb",
        background: "#ffffff",
        foreground: "#111827",
        primary: "#6366f1",
        secondary: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
