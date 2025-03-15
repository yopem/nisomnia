/* eslint-disable @typescript-eslint/triple-slash-reference */

// Astro types, not necessary if you already have a `tsconfig.json`
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly APP_ENV: string
  readonly PORT: string
  readonly DATABASE_URL: string
  readonly GOOGLE_CLIENT_ID: string
  readonly GOOGLE_CLIENT_SECRET: string
  readonly GOOGLE_REDIRECT_URL: string
  readonly PUBLIC_SITE_DOMAIN: string
  readonly PUBLIC_SITE_TITLE: string
  readonly PUBLIC_SITE_DESCRIPTION: string
  readonly PUBLIC_ROBOTS: string
  readonly PUBLIC_FACEBOOK_USERNAME: string
  readonly PUBLIC_X_USERNAME: string
  readonly PUBLIC_INSTAGRAM_USERNAME: string
  readonly PUBLIC_TIKTOK_USERNAME: string
  readonly PUBLIC_WHATSAPP_CHANNEL_USERNAME: string
  readonly PUBLIC_YOUTUBE_USERNAME: string
  readonly PUBLIC_ADSENSE_CLIENT_ID: string
  readonly PUBLIC_GA_ID: string
  readonly PUBLIC_SUPPORT_EMAIL: string
  readonly PUBLIC_WHATSAPP_NUMBER: string
  readonly PUBLIC_ADDRESS: string
  readonly PUBLIC_LOGO_OG_URL: string
  readonly PUBLIC_LOGO_OG_WIDTH: string
  readonly PUBLIC_LOGO_OG_HEIGHT: string
  readonly CF_ACCOUNT_ID: string
  readonly R2_BUCKET: string
  readonly R2_REGION: string
  readonly R2_ACCESS_KEY: string
  readonly R2_SECRET_KEY: string
  readonly R2_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
