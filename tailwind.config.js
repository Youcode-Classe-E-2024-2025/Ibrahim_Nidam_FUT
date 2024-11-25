/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./assets/js/**/*.js", "./*.html", "./assets/html/**/*.html"],
  theme: {
    extend: {
      colors: {
        denim: {
          base: "#0060d1",
          100: "#00142a",
          200: "#002754",
          300: "#003b7d",
          400: "#004ea7",
          500: "#0060d1",
          600: "#0e7fff",
          700: "#4a9fff",
          800: "#87bfff",
          900: "#c3dfff",
        },
        light_orange: {
          base: "#ffd3a6",
          100: "#552a00",
          200: "#a95500",
          300: "#fe7f00",
          400: "#ffa954",
          500: "#ffd3a6",
          600: "#ffdcba",
          700: "#ffe5cb",
          800: "#ffeedc",
          900: "#fff6ee",
        },
      },
    },
  },
  plugins: [],
};
