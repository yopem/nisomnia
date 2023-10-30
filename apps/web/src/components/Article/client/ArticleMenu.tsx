"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import {
  Button,
  cn,
  Icon,
  IconButton,
  ShareButtonEmail,
  ShareButtonFacebook,
  ShareButtonPinterest,
  ShareButtonTwitter,
  ShareButtonWhatsApp,
} from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

import { ReportButton } from "@/components/Report"

const CommentForm = dynamic(() =>
  import("@/components/Comment/client").then((mod) => mod.CommentForm),
)

interface ArticleMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  text: string
  article_id: string
  mediaSrc: string
}

export const ArticleMenu: React.FunctionComponent<ArticleMenuProps> = (
  props,
) => {
  const { url, text, mediaSrc, article_id, className, ...rest } = props

  const [showShare, setShowShare] = React.useState<boolean>(false)
  const [showComments, setShowComments] = React.useState<boolean>(false)
  const [showMore, setShowMore] = React.useState<boolean>(false)

  return (
    <>
      <div
        className={`${
          showShare ? "flex" : "hidden"
        } left-50 fixed bottom-[345px] right-0 z-50 h-12 w-full flex-col flex-wrap justify-center`}
      >
        <div className="relative ml-auto mr-auto flex h-12 flex-shrink flex-wrap justify-center px-5 py-1 text-sm leading-5">
          <div className="relative">
            <div className="relative flex cursor-pointer items-center space-x-2">
              <div className="flex flex-col space-y-2 rounded-md border border-border bg-background p-2 shadow">
                <Button
                  className="text-left font-normal"
                  variant="ghost"
                  onClick={() => {
                    copyToClipboard(window.location.href)
                    toast({
                      variant: "success",
                      description: "Article permalink copied!",
                    })
                    setShowShare(false)
                  }}
                >
                  <Icon.Link className="mr-1" />
                  Permalink
                </Button>
                <ShareButtonFacebook url={url} />
                <ShareButtonTwitter url={url} sharetext={text} />
                <ShareButtonEmail url={url} subject={text} />
                <ShareButtonPinterest
                  url={url}
                  sharetext={text}
                  mediaSrc={mediaSrc}
                />
                <ShareButtonWhatsApp message={text} url={url} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          showMore ? "flex" : "hidden"
        } left-50 fixed bottom-[100px] right-0 z-50 h-12 w-full flex-col flex-wrap justify-center`}
      >
        <div className="relative ml-auto mr-auto flex h-12 flex-shrink flex-wrap justify-center px-5 py-1 text-sm leading-5">
          <div className="relative">
            <div className="relative flex cursor-pointer items-center space-x-2">
              <div className="flex flex-col space-y-2 rounded-md border border-border bg-background p-2 shadow">
                <ReportButton url={url} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "bottom-[40px] left-0 right-0 z-50 flex h-12 w-full flex-wrap justify-center",
          className,
        )}
        {...rest}
      >
        <div className="relative ml-auto mr-auto flex h-12 flex-shrink flex-wrap justify-center rounded-full border border-border bg-background px-5 pt-1 text-sm leading-5 shadow-md">
          <div className="relative">
            <div className="relative flex cursor-pointer items-center space-x-2">
              <IconButton
                aria-label="Comment"
                variant="ghost"
                onClick={() => {
                  setShowComments((prev) => !prev)
                  setShowMore(false)
                }}
              >
                <Icon.Comment />
              </IconButton>
              <IconButton
                aria-label="Share"
                variant="ghost"
                onClick={() => {
                  setShowShare((prev) => !prev)
                  setShowMore(false)
                }}
              >
                <Icon.Share2 />
              </IconButton>
              <IconButton
                aria-label="Show More"
                variant="ghost"
                onClick={() => {
                  setShowMore((prev) => !prev)
                  setShowShare(false)
                }}
              >
                <Icon.MoreVertical />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <section id="#comments">
        <CommentForm
          article_id={article_id}
          showComments={showComments}
          setShowComments={setShowComments}
        />
      </section>
    </>
  )
}
