/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        libre: ["Libre Franklin", ...defaultTheme.fontFamily.sans],
        playwrite: ["Playwrite US Modern", ...defaultTheme.fontFamily.sans],
        garamond: ["EB Garamond", ...defaultTheme.fontFamily.sans],
        bebas: ["Bebas Neue", "sans-serif"],
      },
      colors: {
        golden: "hsla(43, 74%, 66%, 1)",
        "soft-black": "hsla(0, 0%, 20%, 1)",
        ruby: "hsla(350, 100%, 23%, 1)",
        "soft-ruby": "hsla(29, 44%, 80%, 1)",
        "header-bg": "hsla(43, 74%, 90%, 1)",
        "system-bg": "hsla(43, 74%, 98%, 1)",
        "nav-bg": "hsla(350, 100%, 20%, 1)",
        "soft-white": "hsla(210, 8%, 95%, 1)",
      },
    },
  },
  plugins: [],
});
