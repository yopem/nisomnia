import { z } from "zod"

export const USER_ROLE = ["user", "pro_user", "author", "admin"] as const

export const userSchema = z.object({
  name: z.string().min(3).max(32),
})

const userCore = {
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9\-_]+$/), {
      message:
        "Username should be 3-20 characters without spaces, symbol or any special characters",
    })
    .min(3),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1),
  phone_number: z
    .string({ invalid_type_error: "Phone Number must be a string" })
    .optional()
    .nullish(),
  about: z
    .string({ invalid_type_error: "About must be a string" })
    .optional()
    .nullish(),
}

export const updateUserSchema = z.object({
  ...userCore,
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
})

export const updateUserByAdminSchema = z.object({
  ...userCore,
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a string",
  }),
  role: z.enum(USER_ROLE, {
    invalid_type_error: "only user, pro_user, author, and admin are accepted",
  }),
})
