"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import type { Media as MediaProps } from "@nisomnia/db"
import { Button, Icon, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  toast,
} from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"

interface FormValues {
  id: string
  name: string
  description?: string
}

interface EditMediaProps {
  media: Pick<MediaProps, "id" | "name" | "url" | "description">
}

export const EditMediaForm: React.FunctionComponent<EditMediaProps> = (
  props,
) => {
  const { media } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const router = useRouter()

  const { mutate: updateMedia } = api.media.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: "Update Media successfully" })
      router.push("/dashboard/media")
    },
    onError: (error) => {
      setLoading(false)
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: "Failed to update media! Please try again later",
        })
      }
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      id: media?.id,
      name: media?.name || "",
      description: media?.description ?? "",
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateMedia(values)
    setLoading(false)
  }

  return (
    <div className="mt-4 flex flex-col space-x-8 md:flex-row md:justify-between">
      <div className="relative aspect-[4/4] h-[200px]">
        <Image
          src={media.url}
          alt={media.name}
          className="relative rounded-sm border-2 border-muted/30 object-cover"
          fill
          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
          quality={60}
        />
      </div>
      <div className="flex-1 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormLabel>Name</FormLabel>
          <div className="invalid:border- relative inline-flex h-9 w-full min-w-0 max-w-xl appearance-none items-center rounded-md border border-muted/30 bg-muted/50 px-3 text-base transition-colors duration-75 ease-out invalid:border-warning/50 invalid:ring-warning/60 focus:bg-background focus:outline-none focus:ring-2 dark:invalid:ring-offset-2">
            <p>{media.name}</p>
          </div>
          <FormLabel>URL</FormLabel>
          <div className="invalid:border- relative inline-flex h-9 w-full min-w-0 max-w-xl appearance-none items-center justify-between rounded-md border border-muted/30 bg-muted/50 px-3 text-base transition-colors duration-75 ease-out invalid:border-warning/50 invalid:ring-warning/60 focus:bg-background focus:outline-none focus:ring-2 dark:invalid:ring-offset-2">
            <p>{media.url}</p>
            <Button
              aria-label="Copy Link"
              className="text-left font-normal"
              variant="ghost"
              size={null}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault()
                copyToClipboard(media.url)
                toast({
                  variant: "success",
                  description: "Media Permalink Copied",
                })
              }}
            >
              <Icon.Copy className="mr-2" />
              Copy Link
            </Button>
          </div>
          <FormControl invalid={Boolean(errors.description)}>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} className="max-w-xl" />
            {errors?.description && (
              <FormErrorMessage>{errors.description.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button aria-label="Save" type="submit" loading={loading}>
            Save
          </Button>
        </form>
      </div>
    </div>
  )
}
