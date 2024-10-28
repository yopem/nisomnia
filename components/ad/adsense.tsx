"use client"

import * as React from "react"
import { AdUnit } from "next-google-adsense"

import { Skeleton } from "@/components/ui/skeleton"
import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const Adsense: React.FC<AdsenseProps> = (props) => {
  const { content } = props

  return (
    <React.Suspense
      fallback={
        <Skeleton className="[200px] my-[5px] flex min-h-[250px] w-screen min-w-full justify-center overflow-hidden sm:w-full" />
      }
    >
      <div className="my-[5px] flex h-auto w-screen min-w-full justify-center overflow-hidden sm:w-full">
        <AdUnit
          publisherId={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          slotId={content}
          layout="display"
        />
      </div>
    </React.Suspense>
  )
}

export default Adsense
