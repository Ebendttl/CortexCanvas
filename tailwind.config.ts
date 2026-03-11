import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#00f7ff",
          glow: "#6b00ff",
          neon: "#1aff9c",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        neobrutalist: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        "neobrutalist-hover": "2px 2px 0px 0px rgba(0, 0, 0, 1)",
        glow: "0 0 10px rgba(0, 247, 255, 0.5), 0 0 20px rgba(107, 0, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
