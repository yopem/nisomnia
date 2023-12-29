import * as React from "react"

import {
  ShareButtonFacebook,
  ShareButtonWhatsApp,
  ShareButtonX,
} from "@nisomnia/ui/next"

import { getI18n } from "@/locales/server"

const CopyLinkButon = React.lazy(async () => {
  const { CopyLinkButon } = await import("./CopyLinkButton")
  return { default: CopyLinkButon }
})

interface ShareProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  text: string
}

export const Share: React.FunctionComponent<ShareProps> = async (props) => {
  const { text, url } = props

  const t = await getI18n()

  return (
    <div className="my-4">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-lg font-semibold">{t("share")}</span>
        </div>
        <div className="flex flex-row">
          <ShareButtonFacebook url={url} />
          <ShareButtonX url={url} text={text} />
          <ShareButtonWhatsApp url={url} text={text} />
          <CopyLinkButon url={url} />
        </div>
      </div>
    </div>
  )
}
