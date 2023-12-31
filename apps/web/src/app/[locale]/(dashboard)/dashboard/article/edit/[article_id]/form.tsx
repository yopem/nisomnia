//FIX: change topic type article or all not only article type

"use client"

import * as React from "react"
import NextLink from "next/link"
import { useForm } from "react-hook-form"

import type {
  Article as ArticleProps,
  LanguageType,
  Media as MediaProps,
  PostStatus,
  Topic as TopicProps,
  User as UserProps,
} from "@nisomnia/db"
import { useDisclosure } from "@nisomnia/ui/hooks"
import { Button, Icon, Select, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ScrollArea,
  toast,
} from "@nisomnia/ui/next-client"

import { Image } from "@/components/Image"
import { api } from "@/lib/trpc/react"
import { useI18n, useScopedI18n } from "@/locales/client"

const Editor = React.lazy(async () => {
  const { Editor } = await import("@/components/Editor")
  return { default: Editor }
})

const DashboardAddAuthors = React.lazy(async () => {
  const { DashboardAddAuthors } = await import(
    "@/components/Dashboard/DashboardAddAuthors"
  )
  return { default: DashboardAddAuthors }
})

const DashboardAddEditors = React.lazy(async () => {
  const { DashboardAddEditors } = await import(
    "@/components/Dashboard/DashboardAddEditors"
  )
  return { default: DashboardAddEditors }
})

const DashboardAddTopics = React.lazy(async () => {
  const { DashboardAddTopics } = await import(
    "@/components/Dashboard/DashboardAddTopics"
  )
  return { default: DashboardAddTopics }
})

const SelectMediaModal = React.lazy(async () => {
  const { SelectMediaModal } = await import(
    "@/components/Media/SelectMediaModal"
  )
  return { default: SelectMediaModal }
})

interface FormValues {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  language: LanguageType
  meta_title?: string
  meta_description?: string
  status: PostStatus
  article_translation_primary_id: string
}

interface EditArticleFormProps {
  article: Pick<
    ArticleProps,
    | "id"
    | "title"
    | "excerpt"
    | "content"
    | "language"
    | "slug"
    | "meta_title"
    | "meta_description"
    | "status"
    | "article_translation_primary_id"
  > & {
    featured_image: Pick<MediaProps, "id" | "url">
    authors: Pick<UserProps, "id" | "name">[]
    editors: Pick<UserProps, "id" | "name">[]
    topics: Pick<TopicProps, "id" | "title">[]
  }
}

export const EditArticleForm: React.FunctionComponent<EditArticleFormProps> = (
  props,
) => {
  const { article } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [topics, setTopics] = React.useState<string[]>(
    article
      ? article.topics.map((topic) => {
          return topic.id
        })
      : [],
  )
  const [authors, setAuthors] = React.useState<string[]>(
    article
      ? article.authors.map((author) => {
          return author.id
        })
      : [],
  )
  const [editors, setEditors] = React.useState<string[]>(
    article
      ? article.editors.map((author) => {
          return author.id
        })
      : [],
  )
  const [selectedFeaturedImageId, setSelectedFeaturedImageId] =
    React.useState<string>(article ? article.featured_image.id : "")
  const [selectedFeaturedImageUrl, setSelectedFeaturedImageUrl] =
    React.useState<string>(article ? article.featured_image.url : "")
  const [selectedTopics, setSelectedTopics] = React.useState<
    { id: string; title: string }[]
  >(
    article
      ? article.topics.map((topic) => {
          return { id: topic.id, title: topic.title }
        })
      : [],
  )

  const [selectedAuthors, setSelectedAuthors] = React.useState<
    { id: string; name: string }[] | []
  >(
    article
      ? article.authors.map((author) => {
          return { id: author.id, name: author.name! }
        })
      : [],
  )
  const [selectedEditors, setSelectedEditors] = React.useState<
    { id: string; name: string }[] | []
  >(
    article
      ? article.editors.map((author) => {
          return { id: author.id, name: author.name! }
        })
      : [],
  )
  const [articleTranslationPrimaryId, setArticleTranslationPrimaryId] =
    React.useState<string>("")

  const t = useI18n()
  const ts = useScopedI18n("article")

  const { isOpen, onToggle } = useDisclosure()

  const { mutate: updateArticle } = api.article.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_success") })
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
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      id: article?.id,
      language: article?.language ?? "id",
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      content: article?.content ?? "",
      excerpt: article?.excerpt ?? "",
      meta_title: article?.meta_title ?? "",
      meta_description: article?.meta_description ?? "",
      status: article?.status ?? "published",
      article_translation_primary_id:
        article?.article_translation_primary_id ?? "",
    },
  })

  const valueLanguage = watch("language") as LanguageType | undefined

  const { data: articleTranslationPrimary } =
    api.article.articleTranslationPrimaryById.useQuery(
      articleTranslationPrimaryId,
    )

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      topics: topics,
      featured_image_id: selectedFeaturedImageId,
      authors: authors,
      editors: editors,
    }

    setArticleTranslationPrimaryId(values.article_translation_primary_id)

    if (articleTranslationPrimary) {
      const otherLangArticle = articleTranslationPrimary?.articles.find(
        (articleData) => articleData.id !== article?.id,
      )

      if (otherLangArticle?.language !== values.language) {
        setLoading(true)
        updateArticle(mergedValues)
        setLoading(false)
      }
    }
  }

  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectedFeaturedImageId(data.id)
    setSelectedFeaturedImageUrl(data.url)
    setOpenModal(false)
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
      className="space-y-4"
    >
      <div className="sticky top-[0px] z-[9] flex items-center justify-between bg-background px-3 py-5">
        <Button aria-label="Back To Articles" variant="ghost">
          <NextLink
            className="flex items-center"
            aria-label={ts("back")}
            href="/dashboard/article"
          >
            <Icon.ChevronLeft aria-label={ts("back")} /> Articles
          </NextLink>
        </Button>
        <div>
          <Button
            aria-label={t("save_as_draft")}
            type="submit"
            onClick={() => {
              setValue("status", "draft")
              handleSubmit(onSubmit)()
            }}
            variant="ghost"
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
            variant="ghost"
            loading={loading}
          >
            {t("update")}
          </Button>
          <Button aria-label="View Sidebar" variant="ghost" onClick={onToggle}>
            <Icon.Menu />
          </Button>
        </div>
      </div>
      <div className="flex min-h-screen flex-row flex-wrap">
        <div className="order-1 w-full md:px-64 lg:w-10/12">
          <div className="relative mt-4 flex items-center justify-center">
            <div className="flex-1 space-y-4">
              <FormControl invalid={Boolean(errors.title)}>
                <Input
                  type="text"
                  size="4xl"
                  variant="plain"
                  className="font-bold"
                  {...register("title", {
                    required: t("title_required"),
                  })}
                  placeholder={t("title_placeholder")}
                />
                {errors?.title && (
                  <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl invalid={Boolean(errors.content)}>
                <Editor control={control} fieldName={"content"} />
              </FormControl>
              {errors?.content && (
                <FormErrorMessage>{errors.content.message}</FormErrorMessage>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            isOpen == false
              ? "hidden"
              : "pt-15 relative z-20 mt-16 flex flex-row overflow-x-auto bg-background py-4 opacity-100"
          } `}
        >
          <div className="fixed bottom-0 right-0 top-0 mt-[85px]">
            <ScrollArea className="h-[calc(100vh-80px)] max-w-[300px] rounded border py-4 max-md:min-w-full">
              <div className="flex flex-col bg-background px-2 py-2">
                <div className="my-2 flex flex-col px-4">
                  <FormControl invalid={Boolean(errors.language)}>
                    <Select
                      {...register("language", {
                        required: t("language_required"),
                      })}
                      placeholder={t("language_select")}
                    >
                      <option value={article?.language as string}>
                        {article?.language === "id"
                          ? "Indonesia"
                          : article?.language === "en" && "English"}
                      </option>
                    </Select>
                    {errors?.language && (
                      <FormErrorMessage>
                        {errors.language.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>{t("slug")}</FormLabel>
                  <FormControl invalid={Boolean(errors.slug)}>
                    <Input
                      {...register("slug")}
                      placeholder={t("slug_placeholder")}
                    />
                    {errors?.slug && (
                      <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>{t("excerpt")}</FormLabel>
                  <FormControl invalid={Boolean(errors.excerpt)}>
                    <Textarea
                      {...register("excerpt")}
                      placeholder={t("excerpt_placeholder")}
                    />
                    {errors?.excerpt && (
                      <FormErrorMessage>
                        {errors.excerpt.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                {valueLanguage && (
                  <div className="my-2 px-4">
                    <DashboardAddTopics
                      mode="edit"
                      locale={valueLanguage}
                      topics={topics}
                      addTopics={setTopics}
                      selectedTopics={selectedTopics}
                      addSelectedTopics={setSelectedTopics}
                      topicType="article"
                    />
                  </div>
                )}
                <div className="my-2 px-4">
                  {selectedFeaturedImageUrl ? (
                    <>
                      <FormLabel>{t("featured_image")}</FormLabel>
                      <SelectMediaModal
                        handleSelectUpdateMedia={handleUpdateMedia}
                        open={openModal}
                        setOpen={setOpenModal}
                        triggerContent={
                          <>
                            <div className="relative">
                              <Image
                                src={selectedFeaturedImageUrl}
                                className="!relative mt-2 aspect-video h-[120px] cursor-pointer rounded-sm border-2 border-muted/30 object-cover"
                                fill
                                alt={t("featured_image")}
                                onClick={() => setOpenModal(true)}
                                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                                quality={60}
                              />
                            </div>
                          </>
                        }
                      />
                    </>
                  ) : (
                    <>
                      <FormLabel>{t("featured_image")}</FormLabel>
                      <SelectMediaModal
                        handleSelectUpdateMedia={handleUpdateMedia}
                        open={openModal}
                        setOpen={setOpenModal}
                        triggerContent={
                          <div
                            onClick={() => setOpenModal(true)}
                            className="relative m-auto flex aspect-video h-[120px] cursor-pointer items-center justify-center bg-muted text-success"
                          >
                            <p>{t("featured_image_placeholder")}</p>
                          </div>
                        }
                      />
                    </>
                  )}
                </div>
                <div className="my-2 flex flex-col px-4">
                  <DashboardAddAuthors
                    authors={authors}
                    addAuthors={setAuthors}
                    selectedAuthors={selectedAuthors}
                    addSelectedAuthors={setSelectedAuthors}
                  />
                </div>
                <div className="my-2 flex flex-col px-4">
                  <DashboardAddEditors
                    editors={editors}
                    addEditors={setEditors}
                    selectedEditors={selectedEditors}
                    addSelectedEditors={setSelectedEditors}
                  />
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>{t("meta_title")}</FormLabel>
                  <FormControl invalid={Boolean(errors.meta_title)}>
                    <Input
                      {...register("meta_title")}
                      placeholder={t("meta_title_placeholder")}
                    />
                    {errors?.meta_title && (
                      <FormErrorMessage>
                        {errors.meta_title.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>{t("meta_description")}</FormLabel>
                  <FormControl invalid={Boolean(errors.meta_description)}>
                    <Textarea
                      {...register("meta_description")}
                      placeholder={t("meta_description_placeholder")}
                    />
                    {errors?.meta_description && (
                      <FormErrorMessage>
                        {errors.meta_description.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </form>
  )
}
