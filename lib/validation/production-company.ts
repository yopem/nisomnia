import { z } from "zod"

const productionCompanyInput = {
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1),
  logo: z
    .string({
      invalid_type_error: "Logo must be a string",
    })
    .optional(),
  originCountry: z
    .string({
      invalid_type_error: "Origin Country must be a string",
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  metaTitle: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  metaDescription: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
}

const updateProductionCompanyInput = {
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a number",
  }),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
  ...productionCompanyInput,
}

export const createProductionCompanySchema = z.object({
  ...productionCompanyInput,
})

export const updateProductionCompanySchema = z.object({
  ...updateProductionCompanyInput,
})

export type CreateProductionCompany = z.infer<
  typeof createProductionCompanySchema
>
export type UpdateProductionCompany = z.infer<
  typeof updateProductionCompanySchema
>
