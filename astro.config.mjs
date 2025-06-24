// @ts-check

import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import tailwindcss from "@tailwindcss/vite"

import { redirects } from "./redirects.mjs"

export default defineConfig({
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      "Referrer-Policy": "origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "X-DNS-Prefetch-Control": "on",
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Accept-Encoding": "gzip, compress, br",
    },
  },

  output: "server",

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  environments: {
    ssr: {
      external: [
        "node:events",
        "node:stream",
        "node:util",
        "node:url",
        "node:buffer",
      ],
    },
  },

  // @ts-expect-error - we need to define the type of the redirects if astro support config in typescript
  redirects: redirects,

  trailingSlash: "never",

  integrations: [],
})
