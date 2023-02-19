const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {},
    fontFamily: {
      ...fontFamily,
      sans: ["var(--font-inter)"],
    },
  },
  safelist: [
    {
      pattern: /gap-/,
    },
    {
      pattern: /items-/,
    },
    {
      pattern: /justify-/,
    },
  ],
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
