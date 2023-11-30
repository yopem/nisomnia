"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Controller, useForm } from "react-hook-form"

import type { LanguageType, TopicType } from "@nisomnia/db"
import { Button, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  toast,
} from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"

const SelectMediaModal = dynamic(async () => {
  const { SelectMediaModal } = await import("@/components/Media/client")
  return { default: SelectMediaModal }
})

interface FormValues {
  title: string
  description?: string
  meta_title?: string
  meta_description?: string
  language: LanguageType
  type: TopicType
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
    control,
    reset,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Controller
          control={control}
          name="language"
          render={({ field }) => (
            <Select
              defaultValue={field.value}
              value={field.value}
              onValueChange={(value: LanguageType) => field.onChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  <SelectItem value="id">Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.language && (
          <FormErrorMessage>{errors.language.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>
          Type
          <RequiredIndicator />
        </FormLabel>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              defaultValue={field.value}
              value={field.value}
              onValueChange={(value: TopicType) => field.onChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="all">ALL</SelectItem>
                  <SelectItem value="article">ARTICLE</SelectItem>
                  <SelectItem value="review">REVIEW</SelectItem>
                  <SelectItem value="tutorial">TUTORIAL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
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
      <Button aria-label="Submit" type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
