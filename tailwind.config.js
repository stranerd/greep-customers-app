/** @type {import('tailwindcss').Config} */
// import type { Config } from 'tailwindcss'
import defaultTheme from "tailwindcss/defaultTheme";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    fontFamily: {
      jakarta: "'Plus Jakarta Sans', sans-serif",
      poppins: "'Poppins', sans-serif",
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#001726",
          50: "#D1EDFF",
          100: "#A3DAFF",
          200: "#42B4FF",
          300: "#008AE6",
          400: "#005085",
          500: "#001726",
          600: "#00121F",
          700: "#000F19",
          800: "#00090F",
          900: "#00060A",
          950: "#000305",
        },
        green: {
          50: "#DBFFF1",
          100: "#B8FFE2",
          200: "#6BFFC4",
          300: "#24FFA7",
          400: "#00DB84",
          500: "#009258",
          600: "#007546",
          700: "#005734",
          800: "#003822",
          900: "#001F12",
          950: "#000F09",
        },
        red: {
          50: "#FFF0F0",
          100: "#FFDBDB",
          200: "#FFBDBD",
          300: "#FF9999",
          400: "#FF7A7A",
          500: "#FF5656",
          600: "#FF1414",
          700: "#CC0000",
          800: "#8A0000",
          900: "#420000",
          950: "#240000",
        },
      },
    },
  },
  plugins: [],
};
