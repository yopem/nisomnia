import Script from "next/script"

import env from "@/env"

export const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <Script
          id="adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
        </Script>
        <Script
          async
          type="application/javascript"
          src="https://news.google.com/swg/js/v1/swg-basic.js"
        />
        <Script id="google-news">
          {`
        (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
        basicSubscriptions.init({
        type: "NewsArticle",
        isPartOfType: ["Product"],
        isPartOfProductId: "CAowiP6nDA:openaccess",
        clientOptions: { theme: "light", lang: "id" },
            });
        });
        `}
        </Script>
      </>
    )
  }

  return null
}
