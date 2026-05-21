/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        foreground: "var(--panel)",
        primary: "var(--accent)",
        "accent-warm": "var(--accent-warm)",
        "muted-foreground": "var(--muted)",
        border: "var(--line)"
      },
      boxShadow: {
        soft: "var(--shadow)"
      }
    }
  },
  plugins: []
};
