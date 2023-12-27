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

interface FormValues {
  title: string
  content: string
  position: AdPosition
  type: AdType
  active: boolean
}

export const CreateAdForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false)

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
      toast({ variant: "success", description: "Ad Successfully created" })
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
          description: "Failed to create ad! Please try again later",
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
      <FormControl invalid={Boolean(errors.type)}>
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
          <option value="plain_ad">Plain Ad</option>
          <option value="adsense">Adsense</option>
        </Select>
        {errors?.type && (
          <FormErrorMessage>{errors.type.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.content)}>
        {adType !== "adsense" ? (
          <>
            <FormLabel>Content</FormLabel>
            <Textarea
              {...register("content")}
              className="max-w-xl"
              placeholder="Enter Script"
            />
          </>
        ) : (
          <>
            <FormLabel>Ad Slot</FormLabel>
            <Input
              {...register("content")}
              className="max-w-xl"
              placeholder="AdSlot"
            />
          </>
        )}
        {errors?.content && (
          <FormErrorMessage>{errors.content.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.position)}>
        <FormLabel>
          Position
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("position", {
            required: "Position is Required",
          })}
          placeholder="Select a Position"
        >
          <option value="home_below_header">Home (Below Header)</option>
          <option value="topic_below_header">Topic (Below Header)</option>
          <option value="article_below_header">Article (Below Header)</option>
          <option value="single_article_above_content">
            Single Article (Above Content)
          </option>
          <option value="single_article_middle_content">
            Single Article (Middle Content)
          </option>
          <option value="single_article_below_content">
            Single Article (Below Content)
          </option>
          <option value="single_article_pop_up">Single Article (Pop Up)</option>
        </Select>
        {errors?.position && (
          <FormErrorMessage>{errors.position.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.active)}>
        <FormLabel>Active</FormLabel>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </FormControl>
      <Button aria-label="Submit" type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
