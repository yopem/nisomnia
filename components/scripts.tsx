import { Partytown } from "@builder.io/partytown/react"
import { GoogleAnalytics } from "@next/third-parties/google"

import env from "@/env"
import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <AdsenseScript />
        <Partytown debug={true} forward={["dataLayer.push"]} />
        <script
          defer
          src="https://analytic.nisomnia.com/script.js"
          data-website-id="fce06352-f464-4337-a716-b78f9f0b46c3"
          type="text/partytown"
        ></script>
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
      </>
    )
  }

  return null
}

export default Scripts
