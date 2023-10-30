import * as React from "react"

import { Icon } from "../icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonTwitter: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, text, sharetext, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Twitter />}
      text={text ?? "Twitter"}
      sharetext={sharetext}
      url={`https://twitter.com/intent/tweet/?text=${encodeURI(
        sharetext!,
      )}&url=${encodeURI(url)}`}
      {...rest}
    />
  )
}
