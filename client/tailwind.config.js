/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#111010",
        },
        darkBox: {
          700: "#3f3f46",
          800: "#27272a",
          850: "#1f1f24",
          900: "#18181b",
          950: "#09090b",
        },
        darkBorder: {
          700: "#3f3f46",
          800: "#27272a",
        },
        darkText: {
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
        },
        theme: "#e8bfa5",
        primary: "#7e22ce",
        primaryHover: "#a855f7",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
