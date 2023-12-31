// NOTE: username is disabled because prisma cannot handle existing data

"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import type { User as UserProps } from "@nisomnia/db"
import { Button, Textarea } from "@nisomnia/ui/next"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  toast,
} from "@nisomnia/ui/next-client"

import { api } from "@/lib/trpc/react"
import { useI18n, useScopedI18n } from "@/locales/client"

interface FormValues {
  id: string
  username: string
  name: string
  about?: string
  phone_number?: string
}

interface UserSettingFormProps {
  user: Partial<UserProps>
}

export const UserSettingForm: React.FunctionComponent<UserSettingFormProps> = (
  props,
) => {
  const { user } = props

  const t = useI18n()
  const ts = useScopedI18n("user")

  const [loading, setLoading] = React.useState<boolean>(false)

  const { mutate: updateUser } = api.user.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_profile_success") })
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
          description: ts("update_profile_failed"),
        })
      }
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      id: user?.id!,
      username: user?.username ?? "",
      name: user?.name! ?? "",
      about: user?.about ?? "",
      phone_number: user?.phone_number ?? "",
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateUser(values)
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-sm border border-border p-5 lg:p-10"
    >
      <FormControl invalid={Boolean(errors.username)}>
        <FormLabel>
          {ts("username")}
          <RequiredIndicator />
        </FormLabel>
        <Input
          {...register("username", {
            required: ts("validation_username_required"),
            pattern: {
              value: /^[a-z0-9]{3,16}$/i,
              message: ts("validation_username_pattern"),
            },
            min: {
              value: 3,
              message: ts("validation_username_min"),
            },
            max: {
              value: 20,
              message: ts("validation_username_max"),
            },
          })}
          disabled
          placeholder={ts("username_placeholder")}
          className="max-w-xl"
        />
        {errors?.username && (
          <FormErrorMessage>{errors.username.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.name)}>
        <FormLabel>
          {ts("name")}
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("name", {
            required: ts("validation_name_required"),
          })}
          placeholder={ts("name_placeholder")}
          className="max-w-xl"
        />
        {errors?.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.phone_number)}>
        <FormLabel>{ts("phone_number")}</FormLabel>
        <Input
          type="string"
          {...register("phone_number", {
            pattern: {
              value: /^[0-9]*$/,
              message: ts("validation_phone_number_pattern"),
            },
            minLength: {
              value: 9,
              message: ts("validation_phone_number_min"),
            },
            maxLength: {
              value: 16,
              message: ts("validation_phone_number_max"),
            },
          })}
          className="max-w-xl"
          placeholder={ts("phone_number_placeholder")}
        />
        {errors?.phone_number && (
          <FormErrorMessage>{errors.phone_number.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.about)}>
        <FormLabel>{ts("about")}</FormLabel>
        <Textarea
          {...register("about")}
          className="max-w-xl"
          placeholder={ts("about_placeholder")}
        />
        {errors?.about && (
          <FormErrorMessage>{errors.about.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button aria-label="Save" type="submit" loading={loading}>
        {t("save")}
      </Button>
    </form>
  )
}
