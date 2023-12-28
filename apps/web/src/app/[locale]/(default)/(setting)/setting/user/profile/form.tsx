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

  const [loading, setLoading] = React.useState<boolean>(false)

  const { mutate: updateUser } = api.user.update.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: "Update User successfully" })
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
          description: "Failed to update! Please try again later",
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
          Username
          <RequiredIndicator />
        </FormLabel>
        <Input
          {...register("username", {
            required: "Username is Required",
            pattern: {
              value: /^[a-z0-9]{3,16}$/i,
              message:
                "Username should be 3-20 characters without spaces, symbol or any special characters.",
            },
            min: {
              value: 3,
              message: "Minimal username 3 characters",
            },
            max: {
              value: 20,
              message: "Maximum username 20 characters",
            },
          })}
          disabled
          // placeholder="Enter your username"
          className="max-w-xl"
        />
        {errors?.username && (
          <FormErrorMessage>{errors.username.message}</FormErrorMessage>
        )}
      </FormControl>{" "}
      <FormControl invalid={Boolean(errors.name)}>
        <FormLabel>
          Name
          <RequiredIndicator />
        </FormLabel>
        <Input
          type="text"
          {...register("name", {
            required: "Name is Required",
          })}
          className="max-w-xl"
        />
        {errors?.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.phone_number)}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="string"
          {...register("phone_number", {
            pattern: {
              value: /^[0-9]*$/,
              message: "Please enter a valid phone number",
            },
            minLength: {
              value: 9,
              message: "Phone number must be at least 9 characters",
            },
            maxLength: {
              value: 16,
              message: "Phone number must be at most 16 characters",
            },
          })}
          className="max-w-xl"
          placeholder="Enter Phone Number (Optional)"
        />
        {errors?.phone_number && (
          <FormErrorMessage>{errors.phone_number.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.about)}>
        <FormLabel>About</FormLabel>
        <Textarea
          {...register("about")}
          className="max-w-xl"
          placeholder="Enter About (Optional)"
        />
        {errors?.about && (
          <FormErrorMessage>{errors.about.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button aria-label="Save" type="submit" loading={loading}>
        Save
      </Button>
    </form>
  )
}
