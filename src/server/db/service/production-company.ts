import { count, eq } from "drizzle-orm"

import { db } from "@/server/db"
import { productionCompaniesTable } from "@/server/db/schema"

export const getProductionCompanyBySlug = async (slug: string) => {
  return await db.query.productionCompaniesTable.findFirst({
    where: (productionCompany, { eq }) => eq(productionCompany.slug, slug),
  })
}

export const getProductionCompaniesSitemap = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  return await db.query.productionCompaniesTable.findMany({
    where: (productionCompanies, { eq }) =>
      eq(productionCompanies.status, "published"),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (productionCompanies, { desc }) => [
      desc(productionCompanies.updatedAt),
    ],
    columns: {
      slug: true,
      updatedAt: true,
    },
  })
}

export const getProductionCompaniesCount = async () => {
  const data = await db
    .select({ value: count() })
    .from(productionCompaniesTable)
    .where(eq(productionCompaniesTable.status, "published"))

  return data[0].value
}
