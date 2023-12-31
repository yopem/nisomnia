"use client"

import * as React from "react"

import env from "@/env"

export function AdsenseScript() {
  React.useEffect(() => {
    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )
    const handleScriptLoad = () => {
      if (!scriptElement) {
        const script = document.createElement("script")
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`
        script.async = true
        script.crossOrigin = "anonymous"
        document.body.appendChild(script)
      }
    }

    const handleLoad = () => {
      clearTimeout(timeoutId)
      handleScriptLoad()
    }

    const handleScroll = () => {
      handleScriptLoad()

      // Remove event listener after script is loaded
      window.removeEventListener("scroll", handleScroll)
    }

    // Push ad after 8 seconds
    const timeoutId = setTimeout(handleLoad, 7000)

    // Push ad when scrolled
    window.addEventListener("scroll", handleScroll)

    // Clean up event listener on component unmount
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return <></>
}
