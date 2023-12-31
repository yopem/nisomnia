"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import type { User as UserProps, UserRole } from "@nisomnia/db"
import { Button, Select, Textarea } from "@nisomnia/ui/next"
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
  phone_number?: string
  about?: string
  meta_title?: string
  meta_description?: string
  role: UserRole
}

interface EditUserFormProps {
  user: Partial<UserProps>
}

export const EditUserForm: React.FunctionComponent<EditUserFormProps> = (
  props,
) => {
  const { user } = props

  const [loading, setLoading] = React.useState<boolean>(false)

  const t = useI18n()
  const ts = useScopedI18n("user")

  const router = useRouter()

  const { mutate: updateUserByAdmin } = api.user.updateByAdmin.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: ts("update_success") })
      router.push("/dashboard/user")
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
  } = useForm<FormValues>({
    defaultValues: {
      id: user?.id,
      username: user?.username ?? "",
      name: user?.name ?? "",
      about: user?.about ?? "",
      phone_number: user?.phone_number ?? "",
      role: user?.role ?? "user",
    },
  })

  const onSubmit = (values: FormValues) => {
    setLoading(true)
    updateUserByAdmin(values)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormControl invalid={Boolean(errors.name)}>
        <FormLabel>{ts("name")}</FormLabel>
        <Input
          type="name"
          {...register("name", {
            required: ts("validation_name_required"),
            min: { value: 1, message: ts("validation_name_min") },
            max: { value: 64, message: ts("validation_name_max") },
          })}
          placeholder="Enter name"
          className="max-w-xl"
        />
        {errors?.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
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
          placeholder={ts("username_placeholder")}
          className="max-w-xl"
        />
        {errors?.username && (
          <FormErrorMessage>{errors.username.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.phone_number)}>
        <FormLabel>{ts("phone_number")}</FormLabel>
        <Input
          type="text"
          {...register("phone_number", {
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
              message: ts("validation_phone_number_pattern"),
            },
          })}
          placeholder={ts("phone_number_placeholder")}
          className="max-w-xl"
        />
        {errors?.phone_number && (
          <FormErrorMessage>{errors.phone_number.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.role)}>
        <FormLabel>
          {ts("role")}
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("role", {
            required: ts("validation_role_required"),
          })}
          placeholder={ts("role_placeholder")}
        >
          <option value="admin">admin</option>
          <option value="author">author</option>
          <option value="pro_user">pro user</option>
          <option value="user">user</option>
        </Select>
        {errors?.role && (
          <FormErrorMessage>{errors.role.message}</FormErrorMessage>
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
      <Button aria-label={t("submit")} type="submit" loading={loading}>
        {t("submit")}
      </Button>
    </form>
  )
}
