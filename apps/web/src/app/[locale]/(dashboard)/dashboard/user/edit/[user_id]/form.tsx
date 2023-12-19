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

  const router = useRouter()

  const { mutate: updateUserByAdmin } = api.user.updateByAdmin.useMutation({
    onSuccess: () => {
      toast({ variant: "success", description: "Update User successfully" })
      router.push("/dashboard/user")
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
        <FormLabel>Name</FormLabel>
        <Input
          type="name"
          {...register("name", {
            required: "Name is required",
            min: { value: 1, message: "Minimal name 1 characters" },
            max: { value: 64, message: "Maximum name 64 characters" },
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
          placeholder="Enter your username"
          className="max-w-xl"
        />
        {errors?.username && (
          <FormErrorMessage>{errors.username.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.phone_number)}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="text"
          {...register("phone_number", {
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
              message: "Number is Invalid",
            },
          })}
          placeholder="Optional"
          className="max-w-xl"
        />
        {errors?.phone_number && (
          <FormErrorMessage>{errors.phone_number.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl invalid={Boolean(errors.role)}>
        <FormLabel>
          Role
          <RequiredIndicator />
        </FormLabel>
        <Select
          {...register("role", {
            required: "Role is Required",
          })}
          placeholder="Select a Role"
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
        <FormLabel>About</FormLabel>
        <Textarea
          {...register("about")}
          className="max-w-xl"
          placeholder="Optional"
        />
        {errors?.about && (
          <FormErrorMessage>{errors.about.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button aria-label="Submit" type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
