import * as React from "react"

import { Icon } from "../icon"
import { ShareButton, type ShareButtonProps } from "./share-button"

export const ShareButtonEmail: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { url, onClick, subject, title, ...rest } = props

  return (
    <ShareButton
      onClick={onClick}
      icon={<Icon.Email />}
      subject={subject}
      title={title ?? "Email"}
      url={`mailto:?subject=${encodeURI(subject!)}&body=${encodeURI(url)}`}
      {...rest}
    />
  )
}
