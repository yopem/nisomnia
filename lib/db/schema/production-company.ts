import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const productionCompanies = pgTable("production_companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  description: text("description"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  originCountry: text("origin_country"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertProductionCompany = typeof productionCompanies.$inferInsert
export type SelectProductionCompany = typeof productionCompanies.$inferSelect
