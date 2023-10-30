const million = require("million/compiler")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.APP_ENV === "development",
  register: true,
  sw: "service-worker.js",
  swcMinify: true,
})

const boolVals = {
  true: true,
  false: false,
}

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ??
  process.env.APP_ENV === "production"

const plugins = [withPWA, withBundleAnalyzer]

const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live vitals.vercel-insights.com platform.twitter.com youtube.com;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'none';
    connect-src *;
    font-src 'self';
    frame-src https://www.youtube.com https://platform.twitter.com https://www.youtube-nocookie.com;
    script-src-elem 'self' 'unsafe-inline' https://www.youtube.com https://platform.twitter.com http://platform.twitter.com/widgets.js;
`

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
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
    reactStrictMode: true,
    experimental: {
      webpackBuildWorker: true,
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
