"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import type { LanguageType, TopicType } from "@nisomnia/db"
import { Button, Textarea } from "@nisomnia/ui/next"
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
  topic_translation_primary_id: string
}

interface TranslateTopicFormProps {
  topic_translation_primary_id: string
  language: LanguageType
  type: TopicType | undefined
}

export const TranslateTopicForm: React.FunctionComponent<
  TranslateTopicFormProps
> = (props) => {
  const { topic_translation_primary_id, language, type } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [selectFeaturedImageId, setSelectFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")

  const router = useRouter()

  const { mutate: translateTopic } = api.topic.translate.useMutation({
    onSuccess: () => {
      setSelectFeaturedImageId("")
      setSelectedFeaturedImageUrl("")
      reset()
      toast({ variant: "success", description: "Translate Topic successfully" })
      router.push("/dashboard/topic")
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
  } = useForm<FormValues>({
    defaultValues: {
      topic_translation_primary_id: topic_translation_primary_id,
      language: language,
      type: type,
    },
  })

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      featured_image_id: selectFeaturedImageId,
    }

    setLoading(true)
    translateTopic(selectFeaturedImageId ? mergedValues : values)
    setLoading(false)
  }

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    toast({
      variant: "success",
      description: "Featured Image has been selected",
    })
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
              <div className="relative mt-2 aspect-video h-[150px] cursor-pointer rounded-sm border-2 border-muted/30">
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
