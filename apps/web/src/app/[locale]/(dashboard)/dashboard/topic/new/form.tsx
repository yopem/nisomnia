"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import type { LanguageType, PostStatus, TopicType } from "@nisomnia/db"
import { Button, Select, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  toast,
} from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"

const SelectMediaModal = React.lazy(async () => {
  const { SelectMediaModal } = await import(
    "@/components/Media/SelectMediaModal"
  )
  return { default: SelectMediaModal }
})

interface FormValues {
  title: string
  description?: string
  meta_title?: string
  meta_description?: string
  language: LanguageType
  type: TopicType
  status: PostStatus
}

export const CreateTopicForm: React.FunctionComponent = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [selectFeaturedImageId, setSelectFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")

  const { mutate: createTopic } = api.topic.create.useMutation({
    onSuccess: () => {
      reset()
      toast({ variant: "success", description: "Topic Successfully created" })
    },
    onError: (err) => {
      setLoading(false)
      toast({ variant: "danger", description: err.message })
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormValues>()

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      featured_image_id: selectFeaturedImageId,
    }

    setLoading(true)
    createTopic(selectFeaturedImageId ? mergedValues : values)
    setLoading(false)
  }

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    toast({ variant: "success", description: "Image has been selected" })
    setOpenModal(false)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
      className="space-y-4"
    >
      <FormControl invalid={Boolean(errors.title)}>
        <FormLabel>
          Title
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("title", {
            required: "Title is Required",
          })}
          className="max-w-xl"
          placeholder="Enter Title"
        />
        {errors?.title && (
          <FormErrorMessage>{errors.title.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>
          Language
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("language", {
            required: "Language is Required",
          })}
          placeholder="Select a Language"
        >
          <option value="id">Indonesia</option>
          <option value="en">English</option>
        </Select>
        {errors?.language && (
          <FormErrorMessage>{errors.language.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>
          Type
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("type", {
            required: "Type is Required",
          })}
          placeholder="Select a Type"
        >
          <option value="all">ALL</option>
          <option value="article">ARTICLE</option>
          <option value="review">REVIEW</option>
          <option value="tutorial">TUTORIAL</option>
        </Select>
        {errors?.type && (
          <FormErrorMessage>{errors.type.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.description)}>
        <FormLabel>Description</FormLabel>
        <Textarea
          {...register("description")}
          className="max-w-xl"
          placeholder="Enter Description (Optional)"
        />
        {errors?.description && (
          <FormErrorMessage>{errors.description.message}</FormErrorMessage>
        )}
      </FormControl>
      {selectedFeaturedImageUrl ? (
        <>
          <FormLabel>Featured Image</FormLabel>
          <SelectMediaModal
            handleSelectUpdateMedia={handleUpdateMedia}
            open={openModal}
            setOpen={setOpenModal}
            triggerContent={
              <div className="relative mt-2 aspect-video h-[150px] cursor-pointer rounded-sm border-2 border-muted/30 ">
                <Image
                  src={selectedFeaturedImageUrl}
                  className="object-cover"
                  fill
                  alt="Featured Image"
                  onClick={() => setOpenModal(true)}
                  sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                />
              </div>
            }
          />
        </>
      ) : (
        <SelectMediaModal
          handleSelectUpdateMedia={handleUpdateMedia}
          open={openModal}
          setOpen={setOpenModal}
          triggerContent={
            <>
              <FormLabel>Featured Image</FormLabel>
              <div
                onClick={() => setOpenModal(true)}
                className="relative mr-auto flex aspect-video h-[150px] items-center justify-center bg-muted text-success"
              >
                <p>Select Featured Image</p>
              </div>
            </>
          }
        />
      )}
      <FormControl invalid={Boolean(errors.meta_title)}>
        <FormLabel>Meta Title</FormLabel>
        <Input
          type="text"
          {...register("meta_title")}
          className="max-w-xl"
          placeholder="Enter Meta Title (Optional)"
        />
        {errors?.meta_title && (
          <FormErrorMessage>{errors.meta_title.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.meta_description)}>
        <FormLabel>Meta Description</FormLabel>
        <Textarea
          {...register("meta_description")}
          className="max-w-xl"
          placeholder="Enter Meta Description (Optional)"
        />
        {errors?.meta_description && (
          <FormErrorMessage>{errors.meta_description.message}</FormErrorMessage>
        )}
      </FormControl>
      <div className="flex space-x-2">
        <Button
          aria-label="Save as Draft"
          type="submit"
          onClick={() => {
            setValue("status", "draft")
            handleSubmit(onSubmit)()
          }}
          loading={loading}
        >
          Save as Draft
        </Button>
        <Button
          aria-label="Submit"
          type="submit"
          onClick={() => {
            setValue("status", "published")
            handleSubmit(onSubmit)()
          }}
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
