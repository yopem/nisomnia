import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { createId } from "@/utils/cuid"
import { articleAuthorsTable, articleEditorsTable } from "./article"

export const USER_ROLE = ["user", "member", "author", "admin"] as const

export const userRole = z.enum(USER_ROLE)

export const userRoleEnum = pgEnum("user_role", USER_ROLE)

export const usersTable = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email"),
  name: text("name"),
  username: text("username").notNull().unique(),
  image: text("image"),
  phoneNumber: text("phone_number"),
  about: text("about"),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const accountsTable = pgTable("accounts", {
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id")
    .notNull()
    .unique()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const sessionsTable = pgTable("sessions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  articleAuthors: many(articleAuthorsTable),
  articleEditors: many(articleEditorsTable),
}))

export const insertUserSchema = createInsertSchema(usersTable)
export const updateUserSchema = createUpdateSchema(usersTable)

export type SelectUser = typeof usersTable.$inferSelect
export type SelectSession = typeof sessionsTable.$inferSelect

export type UserRole = z.infer<typeof userRole>
