import * as React from "react"

interface PlainSelectAd extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const PlainAd: React.FunctionComponent<PlainSelectAd> = (props) => {
  const { content } = props

  return (
    <div
      className="mx-auto my-10"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default PlainAd
