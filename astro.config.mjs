// @ts-check
import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import partytown from "@astrojs/partytown"
import tailwindcss from "@tailwindcss/vite"

import { port, publicSiteDomain, publicSiteUrl } from "@/utils/constant"
import { redirects } from "./redirects.mjs"

export default defineConfig({
  site: publicSiteUrl ? publicSiteUrl : "http://localhost:4321",

  server: {
    port: port ? parseInt(port) : 4321,
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
      port: port ? parseInt(port) : 4321,
      host: true,
    },
  },

  // @ts-expect-error - we need to define the type of the redirects if astro support config in typescript
  redirects: redirects,

  trailingSlash: "never",

  experimental: {
    svg: true,
  },

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `**.${publicSiteDomain}`,
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },

  integrations: [partytown()],
})
