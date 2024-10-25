import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"

import env from "@/env"
import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <AdsenseScript />
        <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </>
    )
  }

  return null
}

export default Scripts
