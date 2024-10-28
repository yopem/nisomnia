"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import env from "@/env"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const Adsense: React.FC<AdsenseProps> = (props) => {
  const { content } = props

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasScrolled, setHasScrolled] = React.useState<boolean>(false)

  const handleAdLoad = () => {
    try {
      const insElements = Array.from(
        document.querySelectorAll("ins.manual-adsense"),
      )
      const insWithoutIframe = insElements.filter(
        (ins) => !ins.querySelector("iframe"),
      )
      if (!hasScrolled && insWithoutIframe.length > 0) {
        if (window.adsbygoogle) {
          setHasScrolled(true)
          insWithoutIframe.forEach((el) => {
            if (!el.querySelector("iframe")) {
              ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            }
          })
        }
      }
    } catch (err) {
      console.log("Err", err)
    }
  }

  const handleAdScroll = () => {
    const insElements = Array.from(
      document.querySelectorAll("ins.manual-adsense"),
    )
    const insWithoutIframe = insElements.filter(
      (ins) => !ins.querySelector("iframe"),
    )
    if (!hasScrolled && insWithoutIframe.length > 0) {
      if (window.adsbygoogle) {
        setHasScrolled(true)
        insWithoutIframe.forEach((el) => {
          if (!el.querySelector("iframe")) {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        })
      }
    }
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(handleAdLoad, 9000)
    window.addEventListener("scroll", handleAdScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleAdScroll)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasScrolled, pathname, searchParams])

  React.useEffect(() => {
    setHasScrolled(false)
  }, [pathname, searchParams])

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
          data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={content}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </React.Suspense>
  )
}

export default Adsense
