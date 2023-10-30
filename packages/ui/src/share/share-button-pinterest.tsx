import * as React from "react"

import { Icon } from "../icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonPinterest: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, text, sharetext, mediaSrc, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Pinterest />}
      text={text ?? "Pinterest"}
      url={`https://pinterest.com/pin/create/button/?url=${encodeURI(
        url,
      )}&media=${encodeURI(mediaSrc!)}&description=${encodeURI(sharetext!)}`}
      {...rest}
    />
  )
}
