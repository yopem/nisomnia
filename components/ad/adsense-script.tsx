"use client"

import * as React from "react"
import Script from "next/script"

import env from "@/env"

const AdsenseScript = () => {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}

export default AdsenseScript
