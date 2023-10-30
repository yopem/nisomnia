"use client"

import * as React from "react"
import Script from "next/script"
import env from "env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

export const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  React.useEffect(() => {
    try {
      if (typeof window === "object") {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <>
      {env.APP_ENV === "production" && (
        <Script
          id="adsense"
          async
          onError={(e) => {
            console.error("Script failed to load", e)
          }}
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <div className="my-10" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  )
}
