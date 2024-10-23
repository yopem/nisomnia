import * as React from "react"

interface TwitterEmbedAMPProps {
  children: React.ReactNode
}

const TwitterEmbedAMP = ({ children }: TwitterEmbedAMPProps) => {
  const regex = /^https?:\/\/twitter\.com\/\w+\/status\/(\d+).*$/
  const modifiedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      child.type === "a" &&
      // @ts-expect-error FIX: later
      child?.props?.href?.match(regex)
    ) {
      // @ts-expect-error FIX: later
      const { href } = child.props
      const match = href.match(regex)
      if (match?.[1]) {
        return <span data-tweetid={match?.[1]}></span>
      }

      return
    }
    return
  })

  return <>{modifiedChildren}</>
}

export default TwitterEmbedAMP
