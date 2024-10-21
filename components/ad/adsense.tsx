"use client"

import * as React from "react"
import LazyLoad from "react-lazy-load"

import env from "@/env.mjs"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (process.env.APP_ENV === "development") {
    return null
  }

  if (!isHydrated) {
    return null
  }

  return (
    <LazyLoad>
      <div className="my-[5px] flex h-auto w-screen min-w-full justify-center overflow-hidden sm:w-full">
        <ins
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="adsbygoogle manual-placed h-auto w-screen min-w-full sm:w-full"
          style={{ display: "block" }}
          data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={content}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </LazyLoad>
  )
}

export default Adsense
