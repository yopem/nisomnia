"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

import type { AdPosition, Ad as AdProps, AdType } from "@nisomnia/db"
import { Button, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
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
  id: string
}

interface EditAdForm {
  ad?: AdProps
}

export const EditAdForm: React.FunctionComponent<EditAdForm> = (props) => {
  const { ad } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const router = useRouter()

  const { mutate: updateAd } = api.ad.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: "Update Ad successfully" })
      router.push("/dashboard/ad")
    },
    onError: (err) => {
      setLoading(false)
      toast({ variant: "danger", description: err.message })
    },
  })

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      id: ad?.id!,
      title: ad?.title ?? "",
      content: ad?.content ?? "",
      position: ad?.position ?? "home_below_header",
      type: ad?.type ?? "plain_ad",
      active: ad?.active ?? false,
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateAd(values)
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
      <FormControl invalid={Boolean(errors.content)}>
        <FormLabel>Content</FormLabel>
        <Textarea
          {...register("content")}
          className="max-w-xl"
          placeholder="Enter Script"
        />
        {errors?.content && (
          <FormErrorMessage>{errors.content.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.position)}>
        <FormLabel>
          Position
          <RequiredIndicator />
        </FormLabel>
        <Controller
          control={control}
          name="position"
          render={({ field }) => (
            <Select
              defaultValue={field.value}
              value={field.value}
              onValueChange={(value: AdPosition) => field.onChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Position</SelectLabel>
                  <SelectItem value="home_below_header">
                    Home (Below Header)
                  </SelectItem>
                  <SelectItem value="topic_below_header">
                    Topic (Below Header)
                  </SelectItem>
                  <SelectItem value="article_below_header">
                    Article (Below Header)
                  </SelectItem>
                  <SelectItem value="single_article_above_content">
                    Single Article (Above Content)
                  </SelectItem>
                  <SelectItem value="single_article_middle_content">
                    Single Article (Middle Content)
                  </SelectItem>
                  <SelectItem value="single_article_below_content">
                    Single Article (Below Content)
                  </SelectItem>
                  <SelectItem value="single_article_pop_up">
                    Single Article (Pop Up)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.position && (
          <FormErrorMessage>{errors.position.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.type)}>
        <FormLabel>
          Type
          <RequiredIndicator />
        </FormLabel>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              defaultValue={field.value}
              value={field.value}
              onValueChange={(value: AdType) => field.onChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="plain_ad">Plain Ad</SelectItem>
                  <SelectItem value="adsense">Adsense</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.type && (
          <FormErrorMessage>{errors.type.message}</FormErrorMessage>
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
