/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

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
    const url = `${pathname}?${searchParams}`

    console.log("Adsense -> router changed ", url)

    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )

    const handleScriptLoad = () => {
      try {
        if (window.adsbygoogle) {
          console.log("pushing ads ")
          window.adsbygoogle.push({})
        } else {
          scriptElement?.addEventListener("load", handleScriptLoad)
          console.log(
            "waiting until adsense lib is loaded...This prevents adsbygoogle is not defined error",
          )
        }
      } catch (err) {
        console.log(
          "error in adsense - This prevents ad already exists error",
          err,
        )
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
  )
}
