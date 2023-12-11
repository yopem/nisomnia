import * as React from "react"
import NextLink from "next/link"
import Script from "next/script"
import { Parser, ProcessNodeDefinitions } from "html-to-react"

import { cn } from "@nisomnia/ui/next"

import { TwitterEmbed } from "@/components/Embed/TwitterEmbed"
import { YoutubeEmbed } from "@/components/Embed/YoutubeEmbed"
import { Image } from "@/components/Image"

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
}

export const TransformContent: React.FunctionComponent<
  TransformContentProps
> = (props) => {
  const { htmlInput, title } = props

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
          <React.Fragment>
            {node.attribs?.className ? (
              <Image
                className={cn(`${node.attribs?.className} !relative`)}
                src={node.attribs?.src ?? ""}
                alt={title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
              />
            ) : (
              <div className="relative aspect-video w-full">
                <Image
                  src={node.attribs?.src ?? ""}
                  alt={title}
                  className="rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
                />
              </div>
            )}
          </React.Fragment>
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
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "blockquote"
      },
      processNode: function (node: Node, children: React.ReactNode[]) {
        if (node.attribs?.className?.includes("twitter-tweet")) {
          return <TwitterEmbed>{children}</TwitterEmbed>
        }
        return <blockquote {...node.attribs}>{children}</blockquote>
      },
    },
    {
      shouldProcessNode: function (node: Node) {
        return node.name && node.name === "script"
      },
      processNode: function (node: Node) {
        return <Script {...node.attribs} />
      },
    },
    {
      shouldProcessNode: function () {
        return true
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ]
  return htmlToReactParser.parseWithInstructions(
    htmlInput,
    () => true,
    processingInstructions,
  )
}
