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

export const UploadMediaForm: React.FunctionComponent = () => {
  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("media")

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmit = async (values: FormValues) => {
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
        toast({ variant: "success", description: ts("upload_success") })
        reset()
      }
    } catch (err) {
      console.log(err)
      toast({ variant: "danger", description: ts("upload_failed") })
    }

    setLoading(false)
  }

  return (
    <div className="mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormControl invalid={Boolean(errors.file)}>
            <DropZone {...register("file")} />
            {errors?.file && (
              <FormErrorMessage>{errors.file.message}</FormErrorMessage>
            )}
          </FormControl>
          <div className="align-center flex justify-center">
            <Button aria-label="Submit" loading={loading}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
