module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  mode: "jit",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  presets: [require("@prisma/lens/tailwind")],
};
