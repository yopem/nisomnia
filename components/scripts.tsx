import { GoogleAnalytics } from "@next/third-parties/google"

import env from "@/env"
import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <AdsenseScript />
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
        <script
          defer
          src="https://data.dafunda.com/script.js"
          data-website-id="433dc72b-94a6-4fcd-92f2-3403a60f47c7"
          type="text/partytown"
        ></script>
      </>
    )
  }

  return null
}

export default Scripts
