// @ts-check
import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    svg: true,
  },
  image: {
    domains: ["assets.nisomnia.com"],
  },
  adapter: node({
    mode: "standalone",
  }),
})
