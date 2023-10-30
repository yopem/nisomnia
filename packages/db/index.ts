import { PrismaClient } from "@prisma/client"

export * from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    //@ts-ignore FIX: later
    log:
      process.env.APP_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

if (process.env.APP_ENV !== "production") globalForPrisma.prisma = db
