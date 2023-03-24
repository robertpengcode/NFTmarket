/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        siteblack: "#131519",
        siteDimBlack: "#191d23",
        siteWhite: "#9eacc7",
        siteBlue: "#52c0e5",
        sitePurple: "#8e24aa",
      },
      backgroundImage: {
        forest: "url('/src/assets/background/forest.jpg')",
        castle: "url('/src/assets/background/castle.jpg')",
        throneroom: "url('/src/assets/background/throneroom.jpg')",
      },
      fontFamily: {
        righteous: ["Righteous", "sans-serif"],
      },
    },
  },
  plugins: [],
};
