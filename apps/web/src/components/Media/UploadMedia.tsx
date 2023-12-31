"use client"

import * as React from "react"
import axios from "axios"
import { useForm } from "react-hook-form"

import { Button, DropZone } from "@nisomnia/ui/next"
import { FormControl, FormErrorMessage, toast } from "@nisomnia/ui/next-client"

import { resizeImage } from "@/lib/resize-image"
import { useI18n, useScopedI18n } from "@/locales/client"

interface FormValues {
  file: Blob[]
}

interface UploadMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  setToggleUpload: React.Dispatch<React.SetStateAction<boolean>>
}

export const UploadMedia: React.FunctionComponent<UploadMediaProps> = (
  props,
) => {
  const { setToggleUpload } = props

  const [showUploadForm, setShowUploadForm] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("media")

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmitMedia = async (values: FormValues) => {
    setLoading(true)

    const formData = new FormData()

    for (const file of Array.from(values.file ?? [])) {
      const resizedImage = await resizeImage(file)
      formData.append("file", resizedImage)
    }

    try {
      const res = await axios.post("/api/media/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (res) {
        setToggleUpload((prev) => !prev)
        reset()
        toast({ variant: "success", description: ts("upload_success") })
      }
    } catch (err) {
      console.log(err)
      toast({ variant: "danger", description: ts("upload_failed") })
    }

    setLoading(false)
  }

  return (
    <div className="my-2 space-y-2">
      <Button
        aria-label={ts("add")}
        type="button"
        onClick={(e) => {
          e.preventDefault()
          setShowUploadForm(!showUploadForm)
        }}
      >
        {ts("add")}
      </Button>
      <div className={showUploadForm ? "flex" : "hidden"}>
        <div className="flex-1 space-y-4">
          <form
            id="media-upload"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <FormControl invalid={Boolean(errors.file)}>
              <DropZone {...register("file")} />
              {errors?.file && (
                <FormErrorMessage>{errors.file.message}</FormErrorMessage>
              )}
            </FormControl>
            <div className="align-center flex justify-center">
              <Button
                type="button"
                onClick={handleSubmit(onSubmitMedia)}
                aria-label={t("submit")}
                loading={loading}
              >
                {t("submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
