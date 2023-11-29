"use client"

import * as React from "react"
import NextLink from "next/link"
import { useForm, type SubmitHandler } from "react-hook-form"

import type { User } from "@nisomnia/auth"
import { Button, Icon, IconButton, Textarea } from "@nisomnia/ui/next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "@nisomnia/ui/next-client"
import { formatDate } from "@nisomnia/utils"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"
import { DeleteArticleCommentButton } from "./DeleteArticleCommentButton"
import { EditArticleComment } from "./EditArticleComment"
import { ReplyArticleComment } from "./ReplyArticleComment"

interface ArticleCommentFormProps extends React.HTMLAttributes<HTMLDivElement> {
  article_id: string
  user: User
}

interface FormValues {
  content: string
  id: string
}

export const ArticleComment: React.FunctionComponent<
  ArticleCommentFormProps
> = (props) => {
  const { article_id, user } = props

  const [openDeleteAction, setOpenDeleteAction] = React.useState<string | null>(
    null,
  )
  const [isEdited, setIsEdited] = React.useState("")
  const [isReplyied, setIsReplyied] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const { data: commentCount, refetch } =
    api.articleComment.countByArticleId.useQuery(article_id)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch: updateComment,
  } = api.articleComment.byArticleIdInfinite.useInfiniteQuery(
    {
      article_id: article_id,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: null,
    },
  )

  const { register, handleSubmit, reset } = useForm<FormValues>()
  const { mutate: createComment } = api.articleComment.create.useMutation({
    onSuccess: () => {
      const textarea = document.querySelector("textarea")
      if (textarea) {
        textarea.style.height = "30px"
      }
      updateComment()
      reset()
      refetch()
      toast({
        variant: "success",
        description: "Comment is successfully created",
      })
    },
    onError: (err) => {
      toast({ variant: "danger", description: err.message })
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setIsLoading(true)
    createComment({
      article_id,
      content: values.content,
    })

    setIsLoading(false)
  }

  const { mutate: deleteArticleCommentAction } =
    api.articleComment.delete.useMutation({
      onSuccess: () => {
        updateComment()
        refetch()
        toast({
          variant: "success",
          description: "Comment is successfully deleted",
        })
      },
      onError: (err) => {
        toast({ variant: "danger", description: err.message })
      },
    })

  function handleDeleteComment(comment_id: string) {
    deleteArticleCommentAction(comment_id)
  }

  return (
    <>
      <div id="comment" className="block w-full bg-background">
        <div className="mb-4 flex justify-between">
          <h5
            id="drawer-label"
            className="inline-flex items-center text-lg font-semibold text-foreground"
          >
            Comments ({commentCount ?? 0})
          </h5>
        </div>
        {user ? (
          <form className="mb-5 mt-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                {user?.image ? (
                  <Image
                    fill
                    src={user?.image}
                    alt={user?.name!}
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  <Icon.User className="h-10 w-10" />
                )}
              </div>
              <div className="ml-1 flex w-full flex-1 flex-col items-center">
                <div className="mx-3 mb-2 w-full border-b border-border">
                  <Textarea
                    variant="plain"
                    onInput={(event) => {
                      const textarea = event.currentTarget
                      const currentFocus = document.activeElement
                      const totalHeight =
                        textarea.scrollHeight -
                        parseInt(getComputedStyle(textarea).paddingTop) -
                        parseInt(getComputedStyle(textarea).paddingBottom)
                      textarea.style.height = totalHeight + "px"
                      if (textarea.value === "") {
                        textarea.style.height = "30px"
                        textarea.focus()
                      }
                      if (currentFocus === textarea) {
                        textarea.focus()
                      }
                    }}
                    {...register("content", {
                      required: "content must be filled",
                    })}
                    className="mx-2 h-[30px] max-h-[180px] w-full resize-none overflow-hidden border border-b"
                    placeholder="Write comment…"
                  />
                </div>
                <Button
                  loading={isLoading}
                  variant="outline"
                  className="ml-auto block h-auto rounded-full px-2 py-1"
                  onClick={handleSubmit(onSubmit)}
                >
                  {!isLoading && "Submit"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="my-8 flex items-center justify-center">
            <NextLink aria-label="Sign In" href="/auth/sign-in">
              <Button>You should login before comment</Button>
            </NextLink>
          </div>
        )}
        <ul className="mt-4 flex flex-col gap-3">
          {data?.pages.map((page) => {
            return page.articleComments.map((comment, i) => {
              return (
                <>
                  <li className="relative flex flex-col" key={i}>
                    <div className="flex justify-between">
                      <figcaption className="mb-2 flex flex-1 items-start justify-start gap-2 md:gap-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                          {comment?.author?.image ? (
                            <Image
                              fill
                              src={comment?.author?.image}
                              alt={comment?.author?.name!}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <Icon.User className="h-10 w-10" />
                          )}
                        </div>
                        {isEdited !== comment.id ? (
                          <div className="flex flex-1 flex-col items-start gap-2">
                            <div className="flex items-center gap-1">
                              <div className="text-[13px] font-bold">
                                {comment?.author?.name}
                              </div>
                              <div className="text-xs text-foreground">
                                {formatDate(comment.createdAt, "LL")}
                              </div>
                            </div>
                            <span className="text-sm">{comment.content}</span>
                            <div>
                              <Button
                                onClick={() => setIsReplyied(comment.id!)}
                                variant="ghost"
                                className="h-8 w-8 rounded-full p-1 md:h-auto md:w-auto md:px-2 md:py-1"
                              >
                                <span className="block md:hidden">
                                  <Icon.Comment />
                                </span>
                                <span className="hidden text-xs md:block">
                                  Reply
                                </span>
                              </Button>
                            </div>
                            <div className="w-full">
                              {isReplyied === comment?.id ? (
                                <ReplyArticleComment
                                  id={article_id ?? ""}
                                  reply_to_id={comment?.id ?? ""}
                                  avatar={user?.image}
                                  username={user?.username}
                                  onSuccess={() => {
                                    refetch()
                                    updateComment()
                                    setIsReplyied("")
                                  }}
                                  onCancel={() => setIsReplyied("")}
                                />
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <EditArticleComment
                            id={comment.id}
                            onCancel={() => setIsEdited("")}
                            onSuccess={() => {
                              setIsEdited("")
                              updateComment()
                            }}
                            content={comment.content ?? ""}
                          />
                        )}
                      </figcaption>
                      {!isEdited && user?.role === "admin" ? (
                        <Popover
                          open={openDeleteAction === comment.id!}
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              setOpenDeleteAction(null)
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <IconButton
                              onClick={() => setOpenDeleteAction(comment.id!)}
                              variant="ghost"
                            >
                              <Icon.MoreVertical />
                            </IconButton>
                          </PopoverTrigger>
                          <PopoverContent className="flex w-[min-content] p-0">
                            <div className="divide-y divide-muted/50">
                              <div className="flex flex-col py-1 text-sm text-foreground">
                                <Button
                                  variant="ghost"
                                  className="h-auto justify-start"
                                  onClick={() => {
                                    handleDeleteComment(comment.id!)
                                    setOpenDeleteAction("")
                                  }}
                                >
                                  <Icon.Delete className="mr-1" />
                                  Delete
                                </Button>
                                <Button
                                  onClick={() => {
                                    setIsEdited(comment.id!)
                                    setOpenDeleteAction(null)
                                  }}
                                  variant="ghost"
                                  className="h-auto justify-start"
                                >
                                  <Icon.Edit className="mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : null}
                    </div>
                  </li>
                  {comment?.replies?.map((reply) => {
                    return (
                      <li
                        className="relative ml-12 flex flex-col md:ml-14"
                        key={reply.id}
                      >
                        <div className="flex justify-between">
                          <figcaption className="mb-2 flex flex-1 items-start justify-start gap-2 md:gap-4">
                            <div className="relative h-4 w-4 overflow-hidden rounded-full bg-muted md:h-8 md:w-8">
                              {reply?.author?.image ? (
                                <Image
                                  fill
                                  src={reply?.author?.image}
                                  alt={reply?.author?.name!}
                                  className="object-cover"
                                />
                              ) : (
                                <Icon.User className="h-6 w-6 md:h-10 md:w-10" />
                              )}
                            </div>
                            {isEdited !== reply.id ? (
                              <div className="flex flex-1 flex-col items-start gap-2">
                                <div className="flex items-center gap-1">
                                  <div className="text-[13px] font-bold">
                                    {reply?.author?.name}
                                  </div>
                                  <div className="text-xs text-foreground">
                                    {formatDate(reply.createdAt, "LL")}
                                  </div>
                                </div>
                                <span className="text-sm">{reply.content}</span>
                              </div>
                            ) : (
                              <EditArticleComment
                                id={reply.id}
                                onCancel={() => setIsEdited("")}
                                onSuccess={() => {
                                  setIsEdited("")
                                  updateComment()
                                }}
                                content={reply.content ?? ""}
                              />
                            )}
                          </figcaption>
                          {!isEdited && user?.role === "admin" ? (
                            <Popover
                              open={openDeleteAction === reply.id!}
                              onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                  setOpenDeleteAction(null)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <IconButton
                                  onClick={() => setOpenDeleteAction(reply.id!)}
                                  variant="ghost"
                                >
                                  <Icon.MoreVertical />
                                </IconButton>
                              </PopoverTrigger>
                              <PopoverContent className="flex w-[min-content] p-0">
                                <div className="divide-y divide-muted/50">
                                  <div className="flex flex-col py-1 text-sm text-foreground">
                                    <DeleteArticleCommentButton
                                      description="this comment"
                                      action={() => {
                                        handleDeleteComment(reply.id!)
                                        setOpenDeleteAction("")
                                      }}
                                    />
                                    <Button
                                      onClick={() => {
                                        setIsEdited(reply.id!)
                                        setOpenDeleteAction(null)
                                      }}
                                      variant="ghost"
                                      className="h-auto justify-start"
                                    >
                                      <Icon.Edit className="mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </>
              )
            })
          })}
        </ul>
        {hasNextPage ? (
          <Button
            onClick={() => {
              fetchNextPage()
            }}
            type="button"
            className="mt-2 w-full"
          >
            Load More
          </Button>
        ) : null}
      </div>
    </>
  )
}
