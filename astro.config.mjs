// @ts-check
import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import tailwindcss from "@tailwindcss/vite"

const { PORT, PUBLIC_SITE_DOMAIN } = import.meta.env

export default defineConfig({
  site: PUBLIC_SITE_DOMAIN
    ? `https://${PUBLIC_SITE_DOMAIN}`
    : "http://localhost:4321",
  server: {
    port: PORT ? parseInt(PORT) : 4321,
    host: true,
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["path-to-regexp"],
    },
    preview: {
      port: PORT ? parseInt(PORT) : 4321,
      host: true,
    },
  },
  experimental: {
    svg: true,
  },
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `**.${PUBLIC_SITE_DOMAIN}`,
      },
    ],
  },
})
