"use client"

import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const Adsense: React.FC<AdsenseProps> = (props) => {
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
    <React.Suspense
      fallback={
        <Skeleton className="[200px] my-[5px] flex min-h-[250px] w-screen min-w-full justify-center overflow-hidden sm:w-full" />
      }
    >
      <div className="my-[5px] flex h-auto w-screen min-w-full justify-center overflow-hidden sm:w-full">
        <ins
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="adsbygoogle manual-adsense h-auto w-screen min-w-full sm:w-full"
          style={{ display: "block" }}
          data-ad-client={`ca-${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          data-ad-slot={content}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </React.Suspense>
  )
}

export default Adsense
