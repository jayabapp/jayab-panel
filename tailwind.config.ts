import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./helpers/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {},
      borderRadius: {
        4: "4px",
        6: "6px",
        8: "8px",
        10: "10px",
        20: "20px",
      },
      boxShadow: {
        card: "rgb(99 99 99 / 15%) 0px 2px 8px 0px",
        cardDark: "rgb(0 0 0 / 15%) 0px 2px 8px 0px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          // ...
          colors: {
            background: "#f9f9f9",
          },
        },
        dark: {
          colors: {
            background: "#111827",
          },
        },
      },
    }),
  ],
};
export default config;
