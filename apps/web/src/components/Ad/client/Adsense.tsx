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

    try {
      if (typeof window === "object") {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <>
      {loading ? (
        <Skeleton className="mb-4 h-72 rounded-xl" />
      ) : (
        <div className="my-10" data-lazyhtml>
          <script type="text/lazyhtml">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
              data-ad-slot={content}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </script>
        </div>
      )}
    </>
  )
}
