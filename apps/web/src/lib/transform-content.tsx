/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import * as React from "react"
import * as prod from "react/jsx-runtime"
import Script from "next/script"
import rehypeParse from "rehype-parse"
import rehypeReact from "rehype-react"
import { unified } from "unified"

import { cn } from "@nisomnia/ui/next"

import { TwitterEmbed, YoutubeEmbed } from "@/components/Embed/client"
import { Image } from "@/components/Image"

const parsePlugin = rehypeParse as never
const reactPlugin = rehypeReact as never

// @ts-expect-error: the react types are missing.

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

export const transformContent = async (html: string, title: string) => {
  const data = await unified()
    .use(parsePlugin, { fragment: true })
    .use(reactPlugin, {
      ...production,
      createElement: React.createElement,
      components: {
        img: (
          props: React.DetailedHTMLProps<
            React.ImgHTMLAttributes<HTMLImageElement>,
            HTMLImageElement
          >,
        ) => {
          if (props.src) {
            return (
              <React.Fragment>
                <Image
                  src={props.src}
                  alt={title}
                  className={cn(props.className)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
                />
              </React.Fragment>
            )
          }
        },
        iframe: (
          props: React.DetailedHTMLProps<
            React.IframeHTMLAttributes<HTMLIFrameElement>,
            HTMLIFrameElement
          >,
        ) => {
          if (props?.src?.includes("youtube.com/embed")) {
            const arr = props?.src?.split(
              /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm,
            )

            return (
              <YoutubeEmbed
                title={props.title || title}
                id={undefined !== arr[3] ? arr[3] : arr[0]!}
                wrapperClass="yt-lite"
              />
            )
          }
          return <iframe {...props} />
        },
        blockquote: (
          props: React.DetailedHTMLProps<
            React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
            HTMLQuoteElement
          >,
        ) => {
          if (props?.className?.includes("twitter-tweet")) {
            return <TwitterEmbed>{props.children}</TwitterEmbed>
          }
          return <blockquote {...props} />
        },
        script: (
          props: React.DetailedHTMLProps<
            React.ScriptHTMLAttributes<HTMLScriptElement>,
            HTMLScriptElement
          >,
        ) => {
          if (props) {
            return <Script {...props} />
          }
        },
      },
    })
    .process(html)
    .then((file) => {
      return file.result
    })
  return data
}
