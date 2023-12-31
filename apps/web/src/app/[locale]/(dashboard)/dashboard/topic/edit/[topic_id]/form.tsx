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
import { useI18n, useScopedI18n } from "@/locales/client"

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

  const t = useI18n()
  const ts = useScopedI18n("topic")

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
      toast({ variant: "success", description: ts("update_success") })
      router.push("/dashboard/topic")
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
          description: ts("update_failed"),
        })
      }
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
          {t("title")}
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("title", {
            required: t("title_required"),
          })}
          className="max-w-xl"
          placeholder={t("title_placeholder")}
        />
        {errors?.title && (
          <FormErrorMessage>{errors.title.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.slug)}>
        <FormLabel>
          {t("slug")}
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("slug", {
            required: t("slug_required"),
          })}
          className="max-w-xl"
          placeholder={t("slug_placeholder")}
        />
        {errors?.slug && (
          <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>
          {t("language")}
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("language", {
            required: t("language_required"),
          })}
          placeholder={t("language_placeholder")}
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
          {t("type")}
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("type", {
            required: "Type is Required",
          })}
          placeholder={t("title_placeholder")}
        >
          <option value="all">{t("all")}</option>
          <option value="article">{t("article")}</option>
          <option value="review">{t("review")}</option>
          <option value="tutorial">{t("tutorial")}</option>
        </Select>
        {errors?.type && (
          <FormErrorMessage>{errors.type.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.description)}>
        <FormLabel>{t("description")}</FormLabel>
        <Textarea
          {...register("description")}
          className="max-w-xl"
          placeholder={t("description_placeholder")}
        />
        {errors?.description && (
          <FormErrorMessage>{errors.description.message}</FormErrorMessage>
        )}
      </FormControl>
      {selectedFeaturedImageUrl ? (
        <>
          <FormLabel>{t("featured_image")}</FormLabel>
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
                  alt={t("featured_image")}
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
              <FormLabel>{t("featured_image")}</FormLabel>
              <div
                onClick={() => setOpenModal(true)}
                className="relative mr-auto flex aspect-video h-[150px] items-center justify-center bg-muted text-success"
              >
                <p>{t("featured_image_placeholder")}</p>
              </div>
            </>
          }
        />
      )}
      <FormControl invalid={Boolean(errors.meta_title)}>
        <FormLabel>{t("meta_title")}</FormLabel>
        <Input
          type="text"
          {...register("meta_title")}
          className="max-w-xl"
          placeholder={t("meta_title_placeholder")}
        />
        {errors?.meta_title && (
          <FormErrorMessage>{errors.meta_title.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.meta_description)}>
        <FormLabel>{t("meta_description")}</FormLabel>
        <Textarea
          {...register("meta_description")}
          className="max-w-xl"
          placeholder={t("meta_description_placeholder")}
        />
        {errors?.meta_description && (
          <FormErrorMessage>{errors.meta_description.message}</FormErrorMessage>
        )}
      </FormControl>
      <div className="flex space-x-2">
        <Button
          aria-label={t("save_as_draft")}
          type="submit"
          onClick={() => {
            setValue("status", "draft")
            handleSubmit(onSubmit)()
          }}
          loading={loading}
        >
          {t("save_as_draft")}
        </Button>
        <Button
          aria-label={t("update")}
          type="submit"
          onClick={() => {
            setValue("status", "published")
            handleSubmit(onSubmit)()
          }}
          loading={loading}
        >
          {t("update")}
        </Button>
      </div>
    </form>
  )
}
