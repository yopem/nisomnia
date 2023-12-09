"use client"

import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Button, cn, Textarea } from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"

interface FormValues {
  content: string
}

interface EditArticleCommentProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  onSuccess: () => void
  content: string
  type?: "default" | "dashboard"
  onCancel?: () => void
}

export const EditArticleComment = (props: EditArticleCommentProps) => {
  const { id, onSuccess, content, type = "default", onCancel } = props
  const [isLoading, setIsLoading] = React.useState(false)

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      content: content ?? "",
    },
  })

  const { mutate: update } = api.articleComment.update.useMutation({
    onSuccess: () => {
      const textarea = document.querySelector("textarea")
      if (textarea && type === "default") {
        textarea.style.height = "30px"
      }

      reset()
      onSuccess()
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
    update({ id: id, content: values.content })

    setIsLoading(false)
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="mx-3 mb-2 w-full border-b border-border">
        <Textarea
          variant={type !== "default" ? "solid" : "plain"}
          onInput={(event) => {
            if (type === "default") {
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
            }
          }}
          {...register("content", {
            required: "content must be filled",
          })}
          className={cn(
            "max-h-[180px] w-full border border-b",
            type !== "dashboard"
              ? "mx-2 h-[30px] resize-y overflow-hidden"
              : "m-0 h-[200px]",
          )}
          placeholder="Write comment…"
        />
      </div>
      <div className="ml-auto flex gap-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="ml-auto block h-auto rounded-full px-2 py-1"
          >
            Cancel
          </Button>
        )}
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
  )
}
