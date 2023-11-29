/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

import { Skeleton } from "@nisomnia/ui"

import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

export const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (process.env.APP_ENV === "development") {
    return <></>
  }

  React.useEffect(() => {
    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )

    let userInteracted = false

    const handleUserInteraction = () => {
      userInteracted = true
    }

    // Set up event listeners for user interaction events
    window.addEventListener("mousemove", handleUserInteraction)
    window.addEventListener("scroll", handleUserInteraction)
    window.addEventListener("touchstart", handleUserInteraction)

    // Set a timeout to load the script after 8 seconds if there is no user interaction
    const delayTimeout = setTimeout(() => {
      if (!userInteracted) {
        handleScriptLoad()
      }
    }, 8000)

    const handleScriptLoad = () => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({})
        } else {
          scriptElement?.addEventListener("load", handleScriptLoad)
        }
      } catch (err) {
        console.error(err)
      }
    }

    handleScriptLoad()

    return () => {
      // Remove event listeners
      window.removeEventListener("mousemove", handleUserInteraction)
      window.removeEventListener("scroll", handleUserInteraction)
      window.removeEventListener("touchstart", handleUserInteraction)

      // Clear the timeout if the component is unmounted before the delay expires
      clearTimeout(delayTimeout)

      if (scriptElement) {
        scriptElement.removeEventListener("load", handleScriptLoad)
      }
    }
  }, [pathname, searchParams])

  return (
    <>
      <Script
        id="adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
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
    </>
  )
}
