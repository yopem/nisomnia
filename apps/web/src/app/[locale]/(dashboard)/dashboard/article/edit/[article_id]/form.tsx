//FIX: change topic type article or all not only article type

"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

import type {
  Article as ArticleProps,
  LanguageType,
  Media as MediaProps,
  Topic as TopicProps,
  User as UserProps,
} from "@nisomnia/db"
import { useDisclosure } from "@nisomnia/ui/hooks"
import { Button, Icon, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"

const Editor = dynamic(() =>
  import("@/components/Editor/client").then((mod) => mod.Editor),
)
const DashboardAddAuthors = dynamic(() =>
  import("@/components/Dashboard/client").then(
    (mod) => mod.DashboardAddAuthors,
  ),
)
const DashboardAddEditors = dynamic(() =>
  import("@/components/Dashboard/client").then(
    (mod) => mod.DashboardAddEditors,
  ),
)
const DashboardAddTopics = dynamic(() =>
  import("@/components/Dashboard/client").then((mod) => mod.DashboardAddTopics),
)
const SelectMediaModal = dynamic(() =>
  import("@/components/Media/client").then((mod) => mod.SelectMediaModal),
)

interface FormValues {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  language: LanguageType
  meta_title?: string
  meta_description?: string
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

  const router = useRouter()

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
      ? article.authors.map((author) => {
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
  const [isClear, setIsClear] = React.useState(false)

  const { isOpen, onToggle } = useDisclosure()

  const { mutate: updateArticle } = api.article.update.useMutation({
    onSuccess: () => {
      setIsClear((prev) => !prev)
      reset()
      toast({ variant: "success", description: "Update Article successfully" })
      router.push("/dashboard/article")
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
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      id: article?.id,
      language: article?.language || "id",
      title: article?.title || "",
      slug: article?.slug || "",
      content: article?.content || "",
      excerpt: article?.excerpt || "",
      meta_title: article?.meta_title ?? "",
      meta_description: article?.meta_description ?? "",
      article_translation_primary_id:
        article?.article_translation_primary_id || "",
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
            aria-label="Back To Articles"
            href="/dashboard/article"
          >
            <Icon.ChevronLeft aria-label="Back To Articles" /> Articles
          </NextLink>
        </Button>
        <div>
          <Button
            aria-label="Publish"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="ghost"
            loading={loading}
          >
            Publish
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
                    required: "Title is Required",
                  })}
                  placeholder="Title"
                />
                {errors?.title && (
                  <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl invalid={Boolean(errors.content)}>
                <Editor
                  control={control}
                  fieldName={"content"}
                  isClear={isClear}
                />
              </FormControl>
              {errors?.content && (
                <FormErrorMessage>{errors.content.message}</FormErrorMessage>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${isOpen == false
              ? "hidden"
              : "pt-15 relative z-20 mt-16 flex flex-row overflow-x-auto bg-background py-4 opacity-100"
            } `}
        >
          <div className="fixed bottom-0 right-0 top-0 mt-[85px]">
            <ScrollArea className="h-[calc(100vh-80px)] max-w-[300px] rounded border py-4 max-md:min-w-full">
              <div className="flex flex-col bg-background px-2 py-2">
                <div className="my-2 flex flex-col px-4">
                  <FormControl invalid={Boolean(errors.language)}>
                    <Controller
                      control={control}
                      name="language"
                      render={({ field }) => (
                        <>
                          <FormLabel>Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Language</SelectLabel>
                                <SelectItem value={article?.language as string}>
                                  {article?.language === "id"
                                    ? "Indonesia"
                                    : article?.language === "en" && "English"}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {errors?.language && (
                            <FormErrorMessage>
                              {errors.language.message}
                            </FormErrorMessage>
                          )}
                        </>
                      )}
                    />
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>Slug</FormLabel>
                  <FormControl invalid={Boolean(errors.slug)}>
                    <Input {...register("slug")} placeholder="Enter Slug" />
                    {errors?.slug && (
                      <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl invalid={Boolean(errors.excerpt)}>
                    <Textarea
                      {...register("excerpt")}
                      placeholder="Enter Excerpt (Optional)"
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
                      <FormLabel>Featured Image</FormLabel>
                      <SelectMediaModal
                        handleSelectUpdateMedia={handleUpdateMedia}
                        open={openModal}
                        setOpen={setOpenModal}
                        triggerContent={
                          <>
                            <div className="relative">
                              <NextImage
                                src={selectedFeaturedImageUrl}
                                className="!relative mt-2 aspect-video h-[120px] cursor-pointer rounded-sm border-2 border-muted/30 object-cover"
                                fill
                                alt="Featured Image"
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
                      <FormLabel>Featured Image</FormLabel>
                      <SelectMediaModal
                        handleSelectUpdateMedia={handleUpdateMedia}
                        open={openModal}
                        setOpen={setOpenModal}
                        triggerContent={
                          <div
                            onClick={() => setOpenModal(true)}
                            className="relative m-auto flex aspect-video h-[120px] cursor-pointer items-center justify-center bg-muted text-success"
                          >
                            <p>Select Featured Image</p>
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
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl invalid={Boolean(errors.meta_title)}>
                    <Input
                      {...register("meta_title")}
                      placeholder="Enter Meta Title (Optional)"
                    />
                    {errors?.meta_title && (
                      <FormErrorMessage>
                        {errors.meta_title.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
                <div className="my-2 flex flex-col px-4">
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl invalid={Boolean(errors.meta_description)}>
                    <Textarea
                      {...register("meta_description")}
                      placeholder="Enter Meta Description (Optional)"
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
