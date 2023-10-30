import * as React from "react"

import { Icon } from "../icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonFacebook: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, text, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Facebook />}
      url={`https://facebook.com/sharer/sharer.php?u=${encodeURI(url)}`}
      text={text ?? "Facebook"}
      {...rest}
    />
  )
}
