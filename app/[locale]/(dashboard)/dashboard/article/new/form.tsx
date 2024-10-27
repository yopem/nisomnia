"use client"

import * as React from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import DashboardAddAuthors from "@/components/dashboard/dashboard-add-authors"
import DashboardAddEditors from "@/components/dashboard/dashboard-add-editors"
import DashboardAddTopics from "@/components/dashboard/dashboard-add-topics"
import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import TextEditorExtended from "@/components/text-editor/text-editor-extended"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import { useDisclosure } from "@/hooks/use-disclosure"
import type { SelectUser } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import type { StatusType } from "@/lib/validation/status"

interface FormValues {
  content: string
  title: string
  topics: string[]
  language?: LanguageType
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  status?: StatusType
}

interface CreateArticleFormProps {
  user: SelectUser
}

export default function CreateArticleForm(props: CreateArticleFormProps) {
  const { user } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)
  const [clearContent, setClearContent] = React.useState<boolean>(false)
  const [selectedFeaturedImage, setSelectedFeaturedImage] =
    React.useState<string>("")
  const [topics, setTopics] = React.useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = React.useState<
    { id: string; title: string }[] | []
  >([])
  const [authors, setAuthors] = React.useState<string[]>(user ? [user?.id] : [])
  const [editors, setEditors] = React.useState<string[]>(user ? [user?.id] : [])
  const [selectedAuthors, setSelectedAuthors] = React.useState<
    { id: string; name: string }[] | []
  >(
    user
      ? [
          {
            id: user?.id!,
            name: user?.name!,
          },
        ]
      : [],
  )
  const [selectedEditors, setSelectedEditors] = React.useState<
    { id: string; name: string }[] | []
  >(
    user
      ? [
          {
            id: user?.id!,
            name: user?.name!,
          },
        ]
      : [],
  )

  const { isOpen: isOpenSidebar, onToggle: onToggleSidebar } = useDisclosure()
  const t = useI18n()
  const ts = useScopedI18n("article")
  const router = useRouter()

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      language: "id",
    },
  })

  const valueLanguage = form.watch("language")

  const { mutate: createArticle } = api.article.create.useMutation({
    onSuccess: () => {
      form.reset()
      setClearContent((prev) => !prev)
      toast({
        variant: "success",
        description: ts("create_success"),
      })
      router.push("/dashboard/article")
    },
    onError: (error) => {
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
      } else if (error?.message) {
        toast({
          variant: "danger",
          description: error.message,
        })
      } else {
        toast({
          variant: "danger",
          description: ts("create_failed"),
        })
      }
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    const mergedValues = {
      ...values,
      featuredImage: selectedFeaturedImage,
      authors: authors,
      editors: editors,
    }
    createArticle(mergedValues)
    setLoading(false)
  }

  const handleUpdateMedia = (data: { url: React.SetStateAction<string> }) => {
    setSelectedFeaturedImage(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: t("featured_image_selected") })
  }

  const handleDeleteFeaturedImage = () => {
    setSelectedFeaturedImage("")
    toast({
      variant: "success",
      description: t("featured_image_deleted"),
    })
  }

  return (
    <div className="flex w-full flex-col">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="space-y-4"
        >
          <div className="sticky top-0 z-20 w-full">
            <div className="flex items-center justify-between bg-background px-3 py-5">
              <Button aria-label="Back To Articles" variant="ghost">
                <NextLink
                  className="flex items-center"
                  aria-label="Back To Articles"
                  href="/dashboard/article"
                >
                  <Icon.ChevronLeft aria-label={t("articles")} />
                  {t("articles")}
                </NextLink>
              </Button>
              <div>
                <Button
                  aria-label={t("save_as_draft")}
                  type="submit"
                  onClick={() => {
                    form.setValue("status", "draft")
                    form.handleSubmit(onSubmit)()
                  }}
                  variant="ghost"
                  loading={loading}
                >
                  {t("save_as_draft")}
                </Button>
                <Button
                  aria-label={t("publish")}
                  type="submit"
                  onClick={() => {
                    form.setValue("status", "published")
                    form.handleSubmit(onSubmit)()
                  }}
                  variant="ghost"
                  loading={loading}
                >
                  {t("publish")}
                </Button>
                <Button
                  type="button"
                  aria-label="View Sidebar"
                  variant="ghost"
                  onClick={onToggleSidebar}
                >
                  <Icon.ViewSidebar />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex min-h-screen flex-row flex-wrap">
            <div className="order-1 w-full md:px-56 lg:w-10/12">
              <div className="relative mt-4 flex items-center justify-center">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{
                      required: t("title_required"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            onInput={(event) => {
                              const textarea = event.currentTarget
                              const currentFocus = document.activeElement
                              const totalHeight =
                                textarea.scrollHeight -
                                parseInt(
                                  getComputedStyle(textarea).paddingTop,
                                ) -
                                parseInt(
                                  getComputedStyle(textarea).paddingBottom,
                                )
                              textarea.style.height = totalHeight + "px"
                              if (textarea.value === "") {
                                textarea.style.height = "40px"
                                textarea.focus()
                              }
                              if (currentFocus === textarea) {
                                textarea.focus()
                              }
                            }}
                            variant="plain"
                            className="h-10 resize-none overflow-hidden text-[40px] font-bold leading-10"
                            placeholder={t("title_placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormControl>
                    <React.Suspense>
                      <TextEditorExtended
                        control={form.control}
                        name="content"
                        isClear={clearContent}
                      />
                    </React.Suspense>
                  </FormControl>
                </div>
              </div>
            </div>
            <div
              className={`${
                isOpenSidebar == false
                  ? "hidden"
                  : "relative z-20 mt-16 flex flex-row overflow-x-auto bg-background py-4 pt-14 opacity-100"
              } `}
            >
              <div className="fixed bottom-[95px] right-0 top-[90px]">
                <div className="h-[calc(100vh-180px)] max-w-[300px] overflow-y-auto rounded border py-4 max-sm:max-w-full lg:w-[400px] lg:max-w-[400px]">
                  <div className="flex flex-col bg-background p-2">
                    <div className="my-2 flex flex-col space-y-4 px-4">
                      <FormField
                        control={form.control}
                        name="language"
                        rules={{
                          required: t("language_required"),
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("language")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("language_placeholder")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="id">Indonesia</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("excerpt")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("excerpt_placeholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {valueLanguage && (
                        <div className="my-2">
                          <DashboardAddTopics
                            locale={valueLanguage}
                            fieldName="topics"
                            //@ts-expect-error FIX: later
                            control={form.control}
                            topics={topics}
                            addTopics={setTopics}
                            selectedTopics={selectedTopics}
                            addSelectedTopics={setSelectedTopics}
                          />
                        </div>
                      )}
                      {selectedFeaturedImage ? (
                        <div className="relative overflow-hidden rounded-[18px]">
                          <DeleteMediaButton
                            description="Featured Image"
                            onDelete={() => handleDeleteFeaturedImage()}
                          />
                          <SelectMediaDialog
                            handleSelectUpdateMedia={handleUpdateMedia}
                            open={openDialog}
                            setOpen={setOpenDialog}
                            category="article"
                          >
                            <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                              <Image
                                src={selectedFeaturedImage}
                                className="rounded-lg object-cover"
                                fill
                                alt={t("featured_image")}
                                onClick={() => setOpenDialog(true)}
                                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                              />
                            </div>
                          </SelectMediaDialog>
                        </div>
                      ) : (
                        <SelectMediaDialog
                          handleSelectUpdateMedia={handleUpdateMedia}
                          open={openDialog}
                          setOpen={setOpenDialog}
                          category="article"
                        >
                          <div
                            onClick={() => setOpenDialog(true)}
                            className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                          >
                            <p>{t("featured_image_placeholder")}</p>
                          </div>
                        </SelectMediaDialog>
                      )}
                      <DashboardAddAuthors
                        authors={authors}
                        addAuthors={setAuthors}
                        selectedAuthors={selectedAuthors}
                        addSelectedAuthors={setSelectedAuthors}
                      />
                      <DashboardAddEditors
                        editors={editors}
                        addEditors={setEditors}
                        selectedEditors={selectedEditors}
                        addSelectedEditors={setSelectedEditors}
                      />
                      <div className="rounded-lg bg-muted p-3 lg:p-5">
                        <div className="flex justify-between">
                          <div className={showMetaData ? "pb-4" : "pb-0"}>
                            <span className="flex align-top text-base font-semibold">
                              Meta Data
                            </span>
                            <span className="text-xs">
                              {t("extra_content_search_engine")}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="border-none p-0"
                            onClick={() => setShowMetaData(!showMetaData)}
                          >
                            {showMetaData ? (
                              <Icon.Close />
                            ) : (
                              <Icon.ChevronDown />
                            )}
                          </Button>
                        </div>
                        <div
                          className={showMetaData ? "flex flex-col" : "hidden"}
                        >
                          <FormField
                            control={form.control}
                            name="metaTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("meta_title")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("meta_title_placeholder")}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="metaDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("meta_description")}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t(
                                      "meta_description_placeholder",
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
