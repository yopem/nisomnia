"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import env from "@/env"

const AdsenseScript = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasScrolled, setHasScrolled] = React.useState(false)
  const [isAdLoaded, setIsAdLoaded] = React.useState(false)

  React.useEffect(() => {
    const scriptElement = document.createElement("script")
    scriptElement.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`
    scriptElement.async = true
    scriptElement.crossOrigin = "anonymous"
    document.body.appendChild(scriptElement)

    // Handle script load event
    const handleScriptLoad = () => {
      setIsAdLoaded(true)
      // If ads are to be shown immediately upon scrolling, push ads here if already scrolled
      if (hasScrolled) {
        pushAds()
      }
    }

    scriptElement.addEventListener("load", handleScriptLoad)

    // Clean up the script element
    return () => {
      scriptElement.removeEventListener("load", handleScriptLoad)
      document.body.removeChild(scriptElement)
    }
  }, [hasScrolled])

  React.useEffect(() => {
    const handleAdLoad = () => {
      if (!isAdLoaded) return
      pushAds()
    }

    const handleAdScroll = () => {
      setHasScrolled(true)
      pushAds()
      window.removeEventListener("scroll", handleAdScroll) // Remove after first scroll
    }

    // Push ad after 8 seconds
    const timeoutId = setTimeout(handleAdLoad, 8000)

    // Push ad when scrolled
    window.addEventListener("scroll", handleAdScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleAdScroll)
    }
  }, [isAdLoaded, hasScrolled])

  const pushAds = () => {
    const insElements = Array.from(
      document.querySelectorAll("ins.manual-placed"),
    )
    const insWithoutIframe = insElements.filter(
      (ins) => !ins.querySelector("iframe"),
    )
    if (insWithoutIframe.length > 0) {
      //@ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }

  // Reset hasScrolled when pathname or searchParams change
  React.useEffect(() => {
    setHasScrolled(false)
  }, [pathname, searchParams])

  return null
}

export default AdsenseScript
