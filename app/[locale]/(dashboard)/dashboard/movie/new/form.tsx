"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import DashboardAddGenres from "@/components/dashboard/dashboard-add-genres"
import DashboardAddProductionCompanies from "@/components/dashboard/dashboard-add-production-companies"
import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { MovieAiringStatus } from "@/lib/validation/movie"
import type { StatusType } from "@/lib/validation/status"

interface FormValues {
  id: string
  imdbId: string
  tmdbId: string
  title: string
  otherTitle: string
  tagline: string
  overview: string
  slug: string
  airingStatus: MovieAiringStatus
  originCountry: string
  originalLanguage: string
  spokenLanguages: string
  releaseDate: string
  revenue: number
  runtime: number
  budget: number
  homepage: string
  metaTitle?: string
  metaDescription?: string
  productionCompanies?: string[]
  genres: string[]
  status?: StatusType
}

export default function CreateMovieForm() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [imageType, setImageType] = React.useState<"poster" | "backdrop">(
    "poster",
  )
  const [selectedPoster, setSelectedPoster] = React.useState<string | null>(
    null,
  )

  const [selectedBackdrop, setSelectedBackdrop] = React.useState<string | null>(
    null,
  )
  const [genres, setGenres] = React.useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = React.useState<
    { id: string; title: string }[] | []
  >([])
  const [productionCompanies, setProductionCompanies] = React.useState<
    string[] | null
  >(null)

  const [selectedProductionCompanies, setSelectedProductionCompanies] =
    React.useState<{ id: string; name: string }[] | null>(null)

  const [showMetaData, setShowMetaData] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("movie")

  const router = useRouter()

  const { mutate: createMovie } = api.movie.create.useMutation({
    onSuccess: () => {
      form.reset()
      router.push("/dashboard/movie")
      toast({ variant: "success", description: ts("create_success") })
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

  const form = useForm<FormValues>({
    mode: "onChange",
  })

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      ...(selectedPoster && { poster: selectedPoster }),
      ...(selectedBackdrop && { backdrop: selectedBackdrop }),
      revenue: parseInt(values.revenue.toString()),
      runtime: parseInt(values.runtime.toString()),
      budget: parseInt(values.budget.toString()),
    }

    createMovie(mergedValues)
  }

  const handleUpdateImage = (data: {
    url: React.SetStateAction<string | null>
  }) => {
    switch (imageType) {
      case "poster":
        setSelectedPoster(data.url)
        toast({ variant: "success", description: ts("poster_selected") })
        break
      case "backdrop":
        setSelectedBackdrop(data.url)
        toast({
          variant: "success",
          description: ts("backdrop_selected"),
        })
        break
      default:
        break
    }
    setOpenDialog(false)
  }

  const handleDeleteImage = (type: "poster" | "backdrop") => {
    switch (type) {
      case "poster":
        setSelectedPoster(null)
        toast({
          variant: "success",
          description: ts("poster_deleted"),
        })
        break
      case "backdrop":
        setSelectedBackdrop(null)
        toast({
          variant: "success",
          description: ts("backdrop_deleted"),
        })
        break
      default:
        break
    }
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <h1 className="pb-2 lg:pb-5">{ts("edit")}</h1>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{
                  required: t("title_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("title_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("other_title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ts("other_title_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imdbId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMDB ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("imdb_id_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tmdbId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TMDB ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("tmdb_id_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                rules={{
                  required: t("slug_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("slug")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("slug_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("tagline")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ts("tagline_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airingStatus"
                rules={{
                  required: ts("airing_status_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("airing_status")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={ts("airing_status_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="released">Reseleased</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("origin_country")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("origin_country_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originalLanguage"
                rules={{
                  required: ts("original_language_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("original_language")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ts("original_language_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spokenLanguages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("spoken_languages")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ts("spoken_languages_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("release_date")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder={ts("release_date_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="runtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("runtime")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={ts("runtime_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("revenue")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={ts("revenue_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("budget")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={ts("budget_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homepage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("homepage")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ts("homepage_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ts("overview")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={ts("overview_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <div className="my-2">
                <DashboardAddGenres
                  mode="edit"
                  fieldName="genres"
                  //@ts-expect-error FIX: later
                  control={form.control}
                  genres={genres}
                  addGenres={setGenres}
                  selectedGenres={selectedGenres}
                  addSelectedGenres={setSelectedGenres}
                />
              </div>
              <div className="my-2">
                <DashboardAddProductionCompanies
                  fieldName="productionCompanies"
                  //@ts-expect-error FIX: later
                  control={form.control}
                  productionCompanies={productionCompanies}
                  addProductionCompanies={setProductionCompanies}
                  selectedProductionCompanies={selectedProductionCompanies}
                  addSelectedProdcutionCompanies={
                    setSelectedProductionCompanies
                  }
                />
              </div>
              <div>
                <FormLabel>{ts("poster")}</FormLabel>
                {selectedPoster ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description="Poster"
                      onDelete={() => handleDeleteImage("poster")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "poster"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("poster")
                      }}
                      category="movie"
                    >
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedPoster}
                          className="rounded-lg object-cover"
                          fill
                          alt={ts("poster")}
                          onClick={() => {
                            setOpenDialog(true)
                            setImageType("poster")
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog && imageType === "poster"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("poster")
                    }}
                    category="movie"
                  >
                    <div
                      onClick={() => setOpenDialog(true)}
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("poster_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
              <div>
                <FormLabel>{ts("backdrop")}</FormLabel>
                {selectedBackdrop ? (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      description="Backdrop"
                      onDelete={() => handleDeleteImage("backdrop")}
                    />
                    <SelectMediaDialog
                      handleSelectUpdateMedia={handleUpdateImage}
                      open={openDialog && imageType === "backdrop"}
                      setOpen={(isOpen) => {
                        setOpenDialog(isOpen)
                        if (isOpen) setImageType("backdrop")
                      }}
                      category="movie"
                    >
                      <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                        <Image
                          src={selectedBackdrop}
                          className="rounded-lg object-cover"
                          fill
                          alt={ts("backdrop")}
                          onClick={() => {
                            setOpenDialog(true)
                            setImageType("backdrop")
                          }}
                          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        />
                      </div>
                    </SelectMediaDialog>
                  </div>
                ) : (
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateImage}
                    open={openDialog && imageType === "backdrop"}
                    setOpen={(isOpen) => {
                      setOpenDialog(isOpen)
                      if (isOpen) setImageType("backdrop")
                    }}
                    category="movie"
                  >
                    <div
                      onClick={() => setOpenDialog(true)}
                      className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                    >
                      <p>{ts("backdrop_placeholder")}</p>
                    </div>
                  </SelectMediaDialog>
                )}
              </div>
            </div>
          </div>
          <div className="my-4 rounded-lg bg-muted p-3 lg:p-5">
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
                onClick={() => setShowMetaData(!showMetaData)}
              >
                {showMetaData ? t("close") : t("expand")}
              </Button>
            </div>
            <div className={showMetaData ? "flex flex-col" : "hidden"}>
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
                        placeholder={t("meta_description_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              aria-label={t("save")}
              type="submit"
              onClick={() => {
                form.setValue("status", "published")
                form.handleSubmit(onSubmit)()
              }}
              loading={loading}
            >
              {t("save")}
            </Button>
            <Button
              aria-label={t("save_as_draft")}
              type="submit"
              onClick={() => {
                form.setValue("status", "draft")
                form.handleSubmit(onSubmit)()
              }}
              loading={loading}
            >
              {t("save_as_draft")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
