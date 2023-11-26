"use client"

import * as React from "react"
import Script from "next/script"

import { Skeleton } from "@nisomnia/ui"

import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

export const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    setLoading(true)

    try {
      if (typeof window === "object") {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      }

      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <>
      {process.env.APP_ENV === "production" && (
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
      {loading ? (
        <Skeleton className="mb-4 h-72 rounded-xl" />
      ) : (
        <div className="my-10" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </>
  )
}
