"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import type {
  LanguageType,
  Media as MediaProps,
  PostStatus,
  Topic as TopicProps,
  TopicType,
} from "@nisomnia/db"
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
  id: string
  title: string
  slug: string
  description?: string
  meta_title?: string
  meta_description?: string
  language: LanguageType
  type: TopicType
  status: PostStatus
  topic_translation_primary_id: string
}

interface EditTopicFormProps {
  topic: Pick<
    TopicProps,
    | "id"
    | "title"
    | "slug"
    | "description"
    | "meta_title"
    | "meta_description"
    | "language"
    | "type"
    | "status"
    | "topic_translation_primary_id"
  > & {
    featured_image?: Pick<MediaProps, "id" | "url"> | null
  }
}

export const EditTopicForm: React.FunctionComponent<EditTopicFormProps> = (
  props,
) => {
  const { topic } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [selectFeaturedImageId, setSelectFeaturedImageId] =
    React.useState<string>("")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>("")
  const [topicTranslationPrimaryId, setTopicTranslationPrimaryId] =
    React.useState<string>("")

  const router = useRouter()

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectFeaturedImageId(data.id as string)
    setSelectedFeaturedImageUrl(data.url as string)
    setOpenModal(false)
  }

  const { mutate: updateTopic } = api.topic.update.useMutation({
    onSuccess: () => {
      setSelectFeaturedImageId("")
      setSelectedFeaturedImageUrl("")
      toast({ variant: "success", description: "Update Topic successfully" })
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
    setValue,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      id: topic?.id,
      title: topic?.title ?? "",
      slug: topic?.slug ?? "",
      description: topic?.description ?? "",
      meta_title: topic?.meta_title ?? "",
      meta_description: topic?.meta_description ?? "",
      language: topic?.language ?? "id",
      type: topic?.type ?? "all",
      status: topic?.status ?? "published",
      topic_translation_primary_id: topic?.topic_translation_primary_id || "",
    },
  })

  React.useEffect(() => {
    setSelectFeaturedImageId(topic?.featured_image?.id!)
    setSelectedFeaturedImageUrl(topic?.featured_image?.url!)
  }, [topic?.featured_image?.id, topic?.featured_image?.url])

  const { data: topicTranslationPrimary } =
    api.topic.topicTranslationPrimaryById.useQuery(topicTranslationPrimaryId)

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      featured_image_id: selectFeaturedImageId,
    }

    setTopicTranslationPrimaryId(values.topic_translation_primary_id)

    if (topicTranslationPrimary) {
      const otherLangTopic = topicTranslationPrimary?.topics.find(
        (topicData) => topicData.id !== topic.id,
      )

      if (otherLangTopic?.language !== values.language) {
        setLoading(true)
        updateTopic(selectFeaturedImageId ? mergedValues : values)
        setLoading(false)
        router.push("/dashboard/topic")
      }
    }
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
      <FormControl invalid={Boolean(errors.slug)}>
        <FormLabel>
          Slug
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("slug", {
            required: "Slug is Required",
          })}
          className="max-w-xl"
          placeholder="Enter Slug"
        />
        {errors?.slug && (
          <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
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
          <option value={topic.language}>
            {topic.language === "id"
              ? "Indonesia"
              : topic.language === "en" && "English"}
          </option>
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
          <option value="all">all</option>
          <option value="article">article</option>
          <option value="review">review</option>
          <option value="tutorial">tutorial</option>
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
