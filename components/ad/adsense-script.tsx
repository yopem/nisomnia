"use client"

import * as React from "react"
import { GoogleAdSense } from "next-google-adsense"

import env from "@/env"

const AdsenseScript = () => {
  return <GoogleAdSense publisherId={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID} />
}

export default AdsenseScript
