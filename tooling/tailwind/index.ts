import type { Config } from "tailwindcss"

import { stylePreset } from "./preset"

export default {
  content: [""],
  theme: {
    extend: {},
  },
  presets: [stylePreset],
} satisfies Config
