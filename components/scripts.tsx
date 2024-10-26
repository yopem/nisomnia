import { Partytown } from "@builder.io/partytown/react"

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
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_ID}`}
          type="text/partytown"
        ></script>
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GA_ID}')`,
          }}
        />
      </>
    )
  }

  return null
}

export default Scripts
