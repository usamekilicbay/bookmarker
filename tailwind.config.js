const colors = {
  blackish: "#1f1e1e",
  greyish: "#f3f3f3",
  greenish: "#b8ff66",
  orangeish: "#ffcc33",
  blueish: "#3399ff",
  yellowish: "#fffe00",
  redish: "#ff3333",
  purpleish: "#9933ff",
  pinkish: "#ff33ff",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: colors.blackish,
        primary: colors.greenish,
        danger: colors.redish,
        warning: colors.yellowish,
        outline: "outline-lime-300",
        blackish: colors.blackish,
        greyish: colors.greyish,
        greenish: colors.greenish,
        orangeish: colors.orangeish,
        blueish: colors.blueish,
        yellowish: colors.yellowish,
        redish: colors.redish,
        purpleish: colors.purpleish,
        pinkish: colors.pinkish,
        ...colors,
      },
      screens: {
        "ext-sm": "200px",
        "ext-md": "400px",
        "ext-lg": "600px",
      },
    },
  },
  plugins: [],
};
