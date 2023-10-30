"use client"

import * as React from "react"
import axios from "axios"
import { useForm } from "react-hook-form"

import { Button, DropZone } from "@nisomnia/ui/next"
import { FormControl, FormErrorMessage, toast } from "@nisomnia/ui/next-client"

interface FormValues {
  file: Blob[]
}

interface UploadMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  addLoadMedias: () => void
}

export const UploadMedia: React.FunctionComponent<UploadMediaProps> = (
  props,
) => {
  const { addLoadMedias, ...rest } = props
  const [showUploadForm, setShowUploadForm] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)

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
      formData.append("file", file)
    }

    try {
      const res = await axios.post("/api/media/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (res) {
        addLoadMedias()
        reset()
        //FIX : toast not showing up
        toast({ variant: "success", description: "Upload Media Successfuly!" })
      }
    } catch (err) {
      console.log(err)
      toast({ variant: "danger", description: "An error occured" })
    }

    setLoading(false)
  }

  return (
    <div className="my-2 space-y-2" {...rest}>
      <Button
        aria-label="Add New Media"
        type="button"
        onClick={(e) => {
          e.preventDefault()
          setShowUploadForm(!showUploadForm)
        }}
      >
        Add New
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
                aria-label="Submit"
                loading={loading}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
