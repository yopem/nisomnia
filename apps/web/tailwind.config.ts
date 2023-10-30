import type { Config } from "tailwindcss"

import baseConfig from "@nisomnia/tailwind-config"

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/editor/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config
