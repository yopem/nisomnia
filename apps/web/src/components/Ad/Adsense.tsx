"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

import { Skeleton } from "@nisomnia/ui/next"

import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

export const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  const [showComponent, setShowComponent] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setShowComponent(true)
    }, 8000)
  }

  React.useEffect(() => {
    const handleScriptLoad = () => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error(err)
      }
    }

    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )

    if (!scriptElement) {
      const newScript = document.createElement("script")
      newScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`
      newScript.async = true
      newScript.crossOrigin = "anonymous"
      newScript.id = "adsense"
      newScript.addEventListener("load", handleScriptLoad)

      document.body.appendChild(newScript)
    } else {
      handleScriptLoad()
    }

    return () => {
      if (scriptElement) {
        scriptElement.removeEventListener("load", handleScriptLoad)
      }
    }
  }, [])

  React.useEffect(() => {
    const scrollListener = () => resetTimer()
    const keydownListener = () => resetTimer()

    window.addEventListener("scroll", scrollListener)
    window.addEventListener("keydown", keydownListener)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      window.removeEventListener("scroll", scrollListener)
      window.removeEventListener("keydown", keydownListener)
    }
  }, [])

  React.useEffect(() => {
    resetTimer()
  }, [pathname, searchParams])

  if (process.env.APP_ENV === "development" || !showComponent) {
    return null
  }

  return (
    <>
      <Script
        id="adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
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
