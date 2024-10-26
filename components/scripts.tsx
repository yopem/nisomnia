import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"

import env from "@/env"
import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <AdsenseScript />
        <Script
          defer
          src="https://analytic.nisomnia.com/script.js"
          data-website-id="fce06352-f464-4337-a716-b78f9f0b46c3"
        />
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
      </>
    )
  }

  return null
}

export default Scripts
