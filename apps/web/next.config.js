const million = require("million/compiler")
const redirects = require("./redirects")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

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

module.exports = () => {
  /** @type {import('next').NextConfig} */

  let config = {
    reactStrictMode: false,
    webpack(config, { isServer }) {
      if (!isServer) {
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
      webpackBuildWorker: true,
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
    config = {
      ...config,
      ...plugin(config),
    }
  }

  const millionConfig = {
    auto: { rsc: true },
    mute: true,
  }

  if (enableMillionJS) {
    return million.next(config, millionConfig)
  }

  return config
}
