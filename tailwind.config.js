/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "navi-primary": {
          50: "var(--navi-primary-50)",
          100: "var(--navi-primary-100)",
          200: "var(--navi-primary-200)",
          300: "var(--navi-primary-300)",
          400: "var(--navi-primary-400)",
          500: "var(--navi-primary-500)",
          600: "var(--navi-primary-600)",
          700: "var(--navi-primary-700)",
          800: "var(--navi-primary-800)",
          900: "var(--navi-primary-900)",
          950: "var(--navi-primary-950)",
        },
        "navi-surface": {
          bolder: "var(--surface-bolder)",
          bold: "var(--surface-bold)",
          emphasis: "var(--surface-emphasis)",
          DEFAULT: "var(--surface-default)",
          primarySubtle: "var(--surfacePrimary-subtle)",
        },
      },
    },
  },
  plugins: [],
};
