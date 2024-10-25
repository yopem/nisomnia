import env from "@/env"
import AdsenseScript from "./ad/adsense-script"

const Scripts = () => {
  if (process.env.APP_ENV === "production") {
    return (
      <>
        <AdsenseScript />
        <script type="text/partytown">
          {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${env.NEXT_PUBLIC_GA_ID}');
          `}
          `
        </script>
      </>
    )
  }

  return null
}

export default Scripts
