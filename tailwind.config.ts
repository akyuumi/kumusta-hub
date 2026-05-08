import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18202f",
        muted: "#667085",
        line: "#e5e7eb",
        coral: "#e85d4f",
        mango: "#f2b84b",
        bay: "#267c87"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 32, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
