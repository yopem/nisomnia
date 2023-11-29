/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { Skeleton } from "@nisomnia/ui"

import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

export const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (process.env.APP_ENV == "development") {
    return <></>
  }

  React.useEffect(() => {
    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )

    const handleScriptLoad = () => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({})
        } else {
          scriptElement?.addEventListener("load", handleScriptLoad)
        }
      } catch (err) {
        console.log(err)
      }
    }

    handleScriptLoad()

    return () => {
      if (scriptElement) {
        scriptElement.removeEventListener("load", handleScriptLoad)
      }
    }
  }, [pathname, searchParams])

  return (
    <React.Suspense
      fallback={<Skeleton className="mb-4 h-72 w-full rounded-xl" />}
    >
      <div style={{ overflow: "hidden", margin: "5px" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={content}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </React.Suspense>
  )
}
