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

  const [loading, setLoading] = React.useState<boolean>(true)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    setLoading(true)

    const handleAdsenseLoad = () => {
      setLoading(false)
    }

    try {
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (window.adsbygoogle && window.adsbygoogle.push) {
        window.adsbygoogle.push({})
      } else {
        window.adsbygoogle = {
          push: handleAdsenseLoad,
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [pathname, searchParams])

  return (
    <>
      {loading ? (
        <Skeleton className="mb-4 h-72 rounded-xl" />
      ) : (
        <>
          {process.env.APP_ENV === "production" && (
            <Script
              id="adsense"
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
              strategy="afterInteractive"
              crossOrigin="anonymous"
            />
          )}
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            data-ad-slot={content}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </>
      )}
    </>
  )
}
