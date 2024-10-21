import * as React from "react"
import NextLink from "next/link"
import { Parser, ProcessNodeDefinitions } from "html-to-react"

import YoutubeEmbed from "@/components/embed/youtube-embed"
import Image from "@/components/image"

const htmlToReactParser = Parser()

const processNodeDefinitions = ProcessNodeDefinitions()

interface Node {
  name?: string
  attribs?: {
    href?: string
    src?: string
    className?: string
    title?: string
  }
}

interface TransformContentProps {
  htmlInput: string
  title: string
  maxWords?: number
  readMoreLink?: string
}

const truncateHTMLByWords = (html: string, maxWords: number): string => {
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, "")
  const words = plainText.split(/\s+/)

  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "..."
  }

  return plainText
}

const TransformContent: React.FunctionComponent<TransformContentProps> = (
  props,
) => {
  const { htmlInput, title, maxWords, readMoreLink } = props

  // Truncate plain text version of the HTML content if maxWords is provided
  const truncatedHtmlInput = maxWords
    ? truncateHTMLByWords(htmlInput, maxWords)
    : htmlInput

  const processingInstructions = [
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "a"
      },
      processNode: function (
        node: Node,
        children: React.ReactNode[],
        index: number,
      ) {
        return (
          <NextLink href={node.attribs?.href ?? "#"} key={index}>
            {children}
          </NextLink>
        )
      },
    },
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "img"
      },
      processNode: function (node: Node) {
        return (
          <Image
            className={node.attribs?.className}
            src={node.attribs?.src ?? ""}
            alt={title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
          />
        )
      },
    },
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "iframe"
      },
      processNode: function (node: Node) {
        if (node.attribs?.src?.includes("youtube.com/embed")) {
          const arr = node.attribs?.src?.split(
            /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm,
          )

          return (
            <YoutubeEmbed
              title={node.attribs?.title ?? title}
              id={arr[3] ?? arr[0]!}
              wrapperClass="yt-lite"
            />
          )
        }
        return <iframe title={title} {...node.attribs} />
      },
    },
    {
      shouldProcessNode: function () {
        return true
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ]

  return (
    <div>
      {htmlToReactParser.parseWithInstructions(
        truncatedHtmlInput,
        () => true,
        processingInstructions,
      )}
      {maxWords && (
        <div>
          <NextLink className="text-primary" href={readMoreLink ?? "#"}>
            Read More
          </NextLink>
        </div>
      )}
    </div>
  )
}

export default TransformContent
