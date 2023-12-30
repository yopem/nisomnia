"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"

import { type AdPosition, type AdType } from "@nisomnia/db"
import { Button, Select, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Switch,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"
import { useI18n, useScopedI18n } from "@/locales/client"

interface FormValues {
  title: string
  content: string
  position: AdPosition
  type: AdType
  active: boolean
}

export const CreateAdForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("ad")

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<FormValues>()

  const adType = watch("type")

  const { mutate: createAd } = api.ad.create.useMutation({
    onSuccess: () => {
      reset()
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
    createAd(values)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormControl invalid={Boolean(errors.title)}>
        <FormLabel>
          {t("title")}
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("title", {
            required: ts("title_required"),
          })}
          className="max-w-xl"
          placeholder={ts("title_placeholder")}
        />
        {errors?.title && (
          <FormErrorMessage>{errors.title.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.type)}>
        <FormLabel>
          {t("type")}
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("type", {
            required: ts("type_required"),
          })}
          placeholder={ts("type_placeholder")}
        >
          <option value="plain_ad">{ts("plain_ad")}</option>
          <option value="adsense">Adsense</option>
        </Select>
        {errors?.type && (
          <FormErrorMessage>{errors.type.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.content)}>
        {adType !== "adsense" ? (
          <>
            <FormLabel>{t("content")}</FormLabel>
            <Textarea
              {...register("content")}
              className="max-w-xl"
              placeholder={ts("content_script_placeholder")}
            />
          </>
        ) : (
          <>
            <FormLabel>{ts("slot")}</FormLabel>
            <Input
              {...register("content")}
              className="max-w-xl"
              placeholder={ts("content_adsense_placeholder")}
            />
          </>
        )}
        {errors?.content && (
          <FormErrorMessage>{errors.content.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.position)}>
        <FormLabel>
          {t("position")}
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("position", {
            required: ts("position_required"),
          })}
          placeholder={ts("position_placeholder")}
        >
          <option value="home_below_header">
            {ts("position_home_below_header")}
          </option>
          <option value="topic_below_header">
            {ts("position_topic_below_header")}
          </option>
          <option value="article_below_header">
            {ts("position_article_below_header")}
          </option>
          <option value="single_article_above_content">
            {ts("position_single_article_above_content")}
          </option>
          <option value="single_article_middle_content">
            {ts("position_single_article_middle_content")}
          </option>
          <option value="single_article_below_content">
            {ts("position_single_article_below_content")}
          </option>
          <option value="single_article_pop_up">
            {ts("position_single_article_pop_up")}
          </option>
        </Select>
        {errors?.position && (
          <FormErrorMessage>{errors.position.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.active)}>
        <FormLabel>{t("active")}</FormLabel>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </FormControl>
      <Button aria-label="Submit" type="submit" loading={loading}>
        {t("submit")}
      </Button>
    </form>
  )
}
