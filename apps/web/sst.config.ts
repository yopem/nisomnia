import * as cdk from "aws-cdk-lib"
import * as cf from "aws-cdk-lib/aws-cloudfront"
import { RetentionDays } from "aws-cdk-lib/aws-logs"
import { type SSTConfig } from "sst"
import { NextjsSite } from "sst/constructs"

import { getProtocol } from "@nisomnia/utils"

export default {
  config(_input) {
    return {
      name: "nisomnia-web",
      region: "ap-southeast-1",
    }
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const serverCachePolicy = new cf.CachePolicy(stack, "ServerCache", {
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
        headerBehavior: cf.CacheHeaderBehavior.none(),
        cookieBehavior: cf.CacheCookieBehavior.none(),
        defaultTtl: cdk.Duration.days(0),
        maxTtl: cdk.Duration.days(365),
        minTtl: cdk.Duration.days(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      })

      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "nisomnia.com",
          domainAlias: "www.nisomnia.com",
        },
        cdk: {
          serverCachePolicy,
          server: {
            logRetention: RetentionDays.ONE_MONTH,
          },
        },
        environment: {
          APP_ENV: process.env.APP_ENV!,
          DATABASE_URL: process.env.DATABASE_URL!,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
          EMAIL_FROM: process.env.EMAIL_FROM!,
          NEXT_PUBLIC_SITE_URL: getProtocol() + process.env.NEXT_PUBLIC_DOMAIN!,
          NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN!,
          NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API!,
          NEXT_PUBLIC_SITE_TITLE: process.env.NEXT_PUBLIC_SITE_TITLE!,
          NEXT_PUBLIC_SITE_DESCRIPTION:
            process.env.NEXT_PUBLIC_SITE_DESCRIPTION!,
          NEXT_PUBLIC_LOGO_URL: process.env.NEXT_PUBLIC_LOGO_OG_URL!,
          NEXT_PUBLIC_LOGO_OG_URL: process.env.NEXT_PUBLIC_LOGO_OG_URL!,
          NEXT_PUBLIC_LOGO_OG_WIDTH: process.env.NEXT_PUBLIC_LOGO_OG_WIDTH!,
          NEXT_PUBLIC_LOGO_OG_HEIGHT: process.env.NEXT_PUBLIC_LOGO_OG_HEIGHT!,
          NEXT_PUBLIC_FACEBOOK_USERNAME:
            process.env.NEXT_PUBLIC_FACEBOOK_USERNAME!,
          NEXT_PUBLIC_INSTAGRAM_USERNAME:
            process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME!,
          NEXT_PUBLIC_PINTEREST_USERNAME:
            process.env.NEXT_PUBLIC_PINTEREST_USERNAME!,
          NEXT_PUBLIC_TWITTER_USERNAME:
            process.env.NEXT_PUBLIC_TWITTER_USERNAME!,
          NEXT_PUBLIC_ADSENSE_CLIENT_ID:
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID!,
          R2_REGION: process.env.R2_REGION!,
          R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
          R2_ACCESS_KEY: process.env.R2_ACCESS_KEY!,
          R2_SECRET_KEY: process.env.R2_SECRET_KEY!,
          R2_DOMAIN: process.env.R2_DOMAIN!,
          R2_BUCKET: process.env.R2_BUCKET!,
        },
      })

      stack.addOutputs({
        SiteUrl: site.url,
      })
    })
  },
} satisfies SSTConfig
