import { GoogleAnalytics } from "@next/third-parties/google"

import env from "@/env"
import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <AdsenseScript />
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
      </>
    )
  }

  return null
}

export default Scripts
