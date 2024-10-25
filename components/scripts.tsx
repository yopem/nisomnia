import Script from "next/script"

import env from "@/env"

// import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        {/* <AdsenseScript /> */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_ID}`}
          strategy="worker"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4946821479056257"
          crossOrigin="anonymous"
        />
        <script type="text/partytown">
          {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${env.NEXT_PUBLIC_GA_ID}');
          `}
          `
        </script>
      </>
    )
  }

  return null
}

export default Scripts
