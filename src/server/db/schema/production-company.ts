import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createId } from "@/utils/cuid"
import { statusEnum } from "./status"

export const productionCompaniesTable = pgTable("production_companies", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  tmdbId: text("tmdb_id").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  originCountry: text("origin_country"),
  description: text("description"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertProductionCompanySchema = createInsertSchema(
  productionCompaniesTable,
)
export const updateProductionCompanySchema = createUpdateSchema(
  productionCompaniesTable,
)

export type SelectProductionCompany =
  typeof productionCompaniesTable.$inferSelect
