import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        "custom": ["0 4px 3px rgba(255, 255, 255, 0.6)", "0 2px 2px rgba(255, 255, 255, 0.2)"],
      },
      maxWidth: {
        "60%": "80%",
      },
      maxHeight: {
        "40%": "40%",
      },
      colors: {
        "custom-blue": "#131B2E",
        slate: "#21293B",
        "sideBar-bg": "#0C1426",
        "li-bg": "#0171FF",
        "side-text": "#204E6F",
        "chat-bg": "#010515",
      },
      spacing: {
        "60px": "60px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
