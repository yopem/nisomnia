import * as React from "react"

import { Icon } from "../icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonWhatsApp: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, text, message, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.WhatsApp />}
      message={message}
      text={text ?? "WhatsApp"}
      url={
        "whatsapp://send?text=" + encodeURI(message!) + "%20" + encodeURI(url)
      }
      {...rest}
    />
  )
}
