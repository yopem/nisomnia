"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DropZone } from "@/components/ui/drop-zone"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { cn } from "@/lib/utils"
import { type MediaType } from "@/lib/validation/media"
import { uploadMultipleMediaAction } from "./action"

interface FormValues {
  files: FileList | null
  type: MediaType
}

interface UploadMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  setToggleUpload?: React.Dispatch<React.SetStateAction<boolean>>
  toggleUpload?: boolean
  mediaType?: MediaType
}

const UploadMedia: React.FC<UploadMediaProps> = (props) => {
  const { toggleUpload, setToggleUpload, mediaType } = props

  const [isPending, startTransition] = React.useTransition()
  const [previewImages, setPreviewImages] = React.useState<string[]>([])

  const t = useI18n()
  const ts = useScopedI18n("media")

  const form = useForm<FormValues>({
    defaultValues: {
      files: null,
      type: mediaType,
    },
  })

  const watchedFiles = form.watch("files")

  React.useEffect(() => {
    if (watchedFiles instanceof FileList) {
      const imagePreviews: string[] = []

      ;(async () => {
        for (const file of watchedFiles) {
          const reader = new FileReader()
          await new Promise((resolve) => {
            reader.onloadend = () => {
              imagePreviews.push(reader.result as string)
              resolve(null)
            }
            reader.readAsDataURL(file)
          })
        }
        setPreviewImages(imagePreviews.slice(0, 5))
      })()
    } else {
      setPreviewImages([])
    }
  }, [watchedFiles])

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const filesArray = values.files ? Array.from(values.files) : []

      const mediaData = filesArray.map((file) => ({
        file,
        type: mediaType ? mediaType : values.type,
      }))

      const { data, error } = await uploadMultipleMediaAction(mediaData)

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        setToggleUpload && setToggleUpload((prev) => !prev)
        setPreviewImages([])
        form.reset()
        toast({ variant: "success", description: ts("upload_success") })
      } else if (error) {
        console.error(error)
        toast({ variant: "danger", description: ts("upload_failed") })
      }
    })
  }

  const handleDrop = (files: FileList) => {
    // Update the form with the dropped files
    form.setValue("files", files)
  }

  return (
    <div className={toggleUpload ? "flex" : "hidden"}>
      <div className="flex-1 space-y-4">
        <div aria-label="media-upload" className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:mx-64"
            >
              <DropZone
                className={cn(previewImages.length > 0 && "hidden")}
                onDrop={handleDrop} // Pass the handleDrop function to DropZone
                {...form.register("files")}
              />
              {previewImages.length > 0 && (
                <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-border/30 bg-background/5 p-10">
                  <div className="grid grid-flow-row grid-cols-2 grid-rows-1 gap-2 md:grid-cols-6 md:grid-rows-1">
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        className="h-24 w-full cursor-pointer overflow-hidden rounded-lg object-cover md:h-48"
                        src={preview}
                        alt={`Selected ${index + 1}`}
                      />
                    ))}
                    {watchedFiles && watchedFiles.length > 5 && (
                      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-foreground/20 md:h-48">
                        +{watchedFiles.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Image Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="topic">Topic</SelectItem>
                          <SelectItem value="feed">Feed</SelectItem>
                          <SelectItem value="genre">Genre</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="tv">TV</SelectItem>
                          <SelectItem value="game">Game</SelectItem>
                          <SelectItem value="production_company">
                            Production Company
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              aria-label="Submit"
              loading={isPending}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadMedia
