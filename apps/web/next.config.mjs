import withBundleAnalyzer from "@next/bundle-analyzer"
import million from "million/compiler"

import redirects from "./redirects.mjs"

const boolVals = {
  true: true,
  false: false,
}

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ??
  process.env.APP_ENV === "production"

const plugins = [withBundleAnalyzer]

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Accept-Encoding", value: "gzip, compress, br" },
]

const config = {
  reactStrictMode: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      if (
        process.env.APP_ENV === "development" &&
        typeof config.optimization.splitChunks === "boolean"
      ) {
        config.optimization.splitChunks = {}
      }
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        "@radix-ui": {
          test: /[\\/]node_modules[\\/](@radix-ui)[\\/]/,
          name: "@radix-ui",
          priority: 10,
          reuseExistingChunk: false,
        },
        "@tiptap": {
          test: /[\\/]node_modules[\\/](@tiptap)[\\/]/,
          name: "@tiptap",
          priority: 10,
          reuseExistingChunk: false,
        },
      }
      config.optimization.mergeDuplicateChunks = true
    }
    return config
  },
  experimental: {
    optimizePackageImports: ["@nisomnia/ui", "@nisomnia/editor"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.nisomnia.com",
      },
      {
        protocol: "https",
        hostname: "**.nisomnia.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },
  transpilePackages: [
    "@nisomnia/auth",
    "@nisomnia/api",
    "@nisomnia/db",
    "@nisomnia/editor",
    "@nisomnia/ui",
    "@nisomnia/utils",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ]
  },
  async redirects() {
    return redirects
  },
}

for (const plugin of plugins) {
  Object.assign(config, plugin(config))
}

const millionConfig = {
  auto: { rsc: true },
  mute: true,
}

const getConfig = () => {
  if (enableMillionJS) {
    return million.next(config, millionConfig)
  }

  return config
}

export default getConfig
