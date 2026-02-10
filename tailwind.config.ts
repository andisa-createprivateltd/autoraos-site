import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        coal: "var(--coal)",
        steel: "var(--steel)",
        mist: "var(--mist)",
        ember: "var(--ember)",
        tide: "var(--tide)",
        gold: "var(--gold)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 20px 45px rgba(4, 14, 23, 0.14)",
        focus: "0 0 0 4px rgba(242, 184, 89, 0.3)"
      }
    }
  },
  plugins: []
};

export default config;
