// TODO: make users can delete and update their own comments

"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useForm } from "react-hook-form"

import { signIn, useSession } from "@nisomnia/auth/client"
import { Button, Icon, IconButton, Textarea } from "@nisomnia/ui/next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
  toast,
} from "@nisomnia/ui/next-client"
import { formatDate } from "@nisomnia/utils"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"

const CommentMenu = dynamic(() =>
  import("./CommentMenu").then((mod) => mod.CommentMenu),
)

interface CommentFormProps {
  article_id: string
  showComments: boolean
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
  article_id: string
  content: string
}

export const CommentForm: React.FunctionComponent<CommentFormProps> = (
  props,
) => {
  const { article_id, showComments, setShowComments } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [page, setPage] = React.useState<number>(1)

  const commentRef = React.useRef<HTMLTextAreaElement>(null)

  const { data: session } = useSession()

  const { data: articleCommentsCount } = api.articleComment.count.useQuery()

  const lastPage = articleCommentsCount && Math.ceil(articleCommentsCount / 10)

  const {
    data: articleComments,
    isLoading,
    refetch,
  } = api.articleComment.byArticleId.useQuery(
    { article_id: article_id, page: page, per_page: 10 },
    {
      keepPreviousData: true,
    },
  )

  const { mutate } = api.articleComment.create.useMutation({
    onSuccess: () => {
      reset()
      toast({ variant: "success", description: "Comment Successfully created" })
    },
    onError: (err) => {
      setLoading(false)
      toast({ variant: "danger", description: err.message })
    },
  })

  const { mutate: handleDeleteCommentByAdmin } =
    api.articleComment.delete.useMutation({
      onSuccess: () => {
        refetch()
        toast({
          variant: "success",
          description: "Delete Comment Successfully",
        })
      },
      onError: (err) => {
        toast({ variant: "danger", description: err.message })
      },
    })

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      article_id: article_id,
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    mutate(values)
    setLoading(false)
  }

  React.useEffect(() => {
    if (lastPage && page !== 1 && page > lastPage) {
      setPage((old) => Math.max(old - 1, 0))
    }
  }, [lastPage, page])

  return (
    <>
      {showComments && (
        <div
          className="bg-backgroundd/90 fixed inset-0 z-40 overflow-hidden backdrop-blur-sm backdrop-filter"
          onClick={() => {
            setShowComments(!showComments)
          }}
        ></div>
      )}
      <div
        className={`scrollbar fixed right-0 top-0 z-[999] h-screen w-full overflow-y-auto border-l border-border bg-background p-4 transition-transform md:max-w-[27rem] ${
          showComments ? "transform-none" : "translate-x-full"
        }`}
        tabIndex={-1}
      >
        <div className="mb-4 flex justify-between">
          <h5
            id="drawer-label"
            className="inline-flex items-center text-lg font-semibold text-foreground"
          >
            Comments ({articleComments?.length ?? 0})
          </h5>
          <IconButton
            variant="ghost"
            onClick={() => {
              setShowComments(!showComments)
            }}
          >
            <Icon.Close className="h-5 w-5" />
          </IconButton>
        </div>
        {session?.user ? (
          <form onSubmit={(e) => e.preventDefault()} className="my-2">
            <Textarea
              {...register("content", {
                required: "content must be filled",
              })}
              variant="plain"
              className="my-2"
              placeholder="Write comment…"
              ref={commentRef}
            />
            <Button
              className="ml-auto block rounded-full"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            >
              Submit
            </Button>
          </form>
        ) : (
          <div className="my-8 flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Icon.SignIn className="mr-2 h-4 w-4" />
                  You should login before comment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex flex-col items-center justify-center space-y-3">
                    <h2>Sign In</h2>
                  </DialogTitle>
                  <DialogDescription className="p-5 text-center">
                    Use your Google account to sign in.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center">
                  <Button variant="outline" onClick={() => signIn("google")}>
                    <Icon.GoogleColored className="mr-2" />
                    Sign In with Google
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        <Separator />
        <ul className="flex flex-col overscroll-auto">
          {!isLoading && articleComments !== undefined ? (
            articleComments?.map((comment, i: number) => {
              return (
                <li className="flex flex-col" key={i}>
                  <div className="flex justify-between">
                    <figcaption className="mb-2 flex items-center justify-start gap-2">
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
                      <div className="space-y-0.5 text-left text-sm font-medium text-foreground">
                        <div>{comment?.author?.name}</div>
                        <div className="text-xs text-foreground">
                          {formatDate(
                            comment.createdAt as unknown as string,
                            "YYYY-MM-DDTHH:mm:ss.sssZ",
                          )}
                        </div>
                      </div>
                    </figcaption>
                    {session?.user?.role === "admin" && (
                      <CommentMenu placement="right-end">
                        <div>
                          <IconButton variant="ghost">
                            <Icon.MoreVertical />
                          </IconButton>
                        </div>
                        <div>
                          <div className="divide-y divide-muted/50">
                            <div className="flex flex-col py-1 text-sm text-foreground">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  handleDeleteCommentByAdmin(comment.id!)
                                }}
                              >
                                <Icon.Delete className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CommentMenu>
                    )}
                  </div>
                  {comment.content}
                  {i < articleComments.length && <Separator />}
                </li>
              )
            })
          ) : (
            <div className="my-48 flex items-center justify-center">
              <h4 className="text-center text-xl font-bold">
                No comments yet.
              </h4>
            </div>
          )}
        </ul>
      </div>
    </>
  )
}
