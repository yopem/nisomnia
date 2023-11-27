"use client"

import * as React from "react"

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

    const delay = 3000

    const timerId = setTimeout(() => {
      try {
        if (typeof window === "object") {
          window.adsbygoogle = window.adsbygoogle || []
          window.adsbygoogle.push({})
        }
      } catch (e) {
        console.error("Error initializing AdSense:", e)
      }

      setLoading(false)
    }, delay)

    return () => clearTimeout(timerId)
  }, [])

  return (
    <>
      {loading ? (
        <Skeleton className="mb-4 h-72 rounded-xl" />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={content}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      )}
    </>
  )
}
