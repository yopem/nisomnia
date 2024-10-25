"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

import env from "@/env"

const AdsenseScript = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [adsLoaded, setAdsLoaded] = React.useState(false)
  const [interacted, setInteracted] = React.useState(false)

  React.useEffect(() => {
    // Load ads after 8 seconds if there's no interaction
    const timeoutId = setTimeout(() => {
      if (!interacted) setAdsLoaded(true)
    }, 8000)

    const handleUserInteraction = () => {
      if (!interacted) {
        setInteracted(true)
        setAdsLoaded(true)
        clearTimeout(timeoutId)
      }
    }

    // Attach scroll and interaction events to load ads early on interaction
    window.addEventListener("scroll", handleUserInteraction, { once: true })
    window.addEventListener("click", handleUserInteraction, { once: true })
    window.addEventListener("keydown", handleUserInteraction, { once: true })

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleUserInteraction)
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }
  }, [interacted])

  React.useEffect(() => {
    // Reset ads on route change
    setInteracted(false)
    setAdsLoaded(false)
  }, [pathname, searchParams])

  return (
    <>
      {adsLoaded && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          async
          crossOrigin="anonymous"
          onLoad={() => {
            //@ts-ignore
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          }}
        />
      )}
    </>
  )
}

export default AdsenseScript
