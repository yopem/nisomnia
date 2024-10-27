"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast/use-toast"
import type { SelectProductionCompany } from "@/lib/db/schema"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"

interface FormValues {
  id: string
  name: string
  slug: string
  tmdbId: string
  originCountry?: string
  description?: string
}

interface EditProductionCompanyFormProps {
  productionCompany: SelectProductionCompany
}

export default function EditProductionCompanyForm(
  props: EditProductionCompanyFormProps,
) {
  const { productionCompany } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [selectedLogo, setSelectedLogo] = React.useState<string>(
    productionCompany.logo ?? "",
  )

  const t = useI18n()
  const ts = useScopedI18n("production_company")

  const router = useRouter()

  const { mutate: updateProductionCompany } =
    api.productionCompany.update.useMutation({
      onSuccess: () => {
        form.reset()
        router.push("/dashboard/production-company")
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
        } else if (error?.message) {
          toast({
            variant: "danger",
            description: error.message,
          })
        } else {
          toast({
            variant: "danger",
            description: ts("update_failed"),
          })
        }
      },
    })

  const form = useForm<FormValues>({
    defaultValues: {
      id: productionCompany.id,
      tmdbId: productionCompany.tmdbId,
      name: productionCompany.name,
      slug: productionCompany.slug,
      originCountry: productionCompany.originCountry ?? "",
      description: productionCompany.description ?? "",
    },
  })

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      logo: selectedLogo,
    }
    setLoading(true)
    updateProductionCompany(selectedLogo ? mergedValues : values)
    setLoading(false)
  }

  const handleUpdateMedia = (data: { url: React.SetStateAction<string> }) => {
    setSelectedLogo(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: t("featured_image_selected") })
  }

  const handleDeleteLogo = () => {
    setSelectedLogo("")
    toast({
      variant: "success",
      description: t("featured_image_deleted"),
    })
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <h1 className="pb-2 lg:pb-5">{ts("add")}</h1>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: t("name_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("name_placeholder")} {...field} />
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("description_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <FormLabel>{t("featured_image")}</FormLabel>
              {selectedLogo ? (
                <div className="relative overflow-hidden rounded-[18px]">
                  <DeleteMediaButton
                    description="Logo"
                    onDelete={() => handleDeleteLogo()}
                  />
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateMedia}
                    open={openDialog}
                    setOpen={setOpenDialog}
                    category="production_company"
                  >
                    <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                      <Image
                        src={selectedLogo}
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
                  category="production_company"
                >
                  <div
                    onClick={() => setOpenDialog(true)}
                    className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                  >
                    <p>{t("featured_image_placeholder")}</p>
                  </div>
                </SelectMediaDialog>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button
              aria-label={t("submit")}
              type="submit"
              onClick={() => {
                form.handleSubmit(onSubmit)()
              }}
              loading={loading}
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
