import NextLink from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getSession, logout } from "@/lib/auth/utils"
import { getI18n, getScopedI18n } from "@/lib/locales/server"

export default async function UserProfilePage() {
  const { session } = await getSession()

  const t = await getI18n()
  const ts = await getScopedI18n("user")

  if (!session) {
    return notFound()
  }

  return (
    <main className="min-h-screen pb-10">
      <div className="container mt-4 md:mt-10">
        <section>
          <h2 className="mb-[14px] text-base font-bold md:mb-6 md:text-2xl">
            {t("account")}
          </h2>
          <div className="mb-[14px] flex flex-wrap text-sm md:mb-6 md:text-base">
            <div className="w-[130px]">{ts("name")}</div>
            <div className="w-[calc(100%-130px)]">{session?.user?.name}</div>
            <div className="mt-2 w-[130px]">{ts("email")}</div>
            <div className="mt-2 w-[calc(100%-130px)]">
              {session?.user?.email}
            </div>
          </div>
          <div className="flex justify-start space-x-2">
            {session?.user?.role.includes("admin" || "author") && (
              <Button asChild variant="cool" className="rounded-full">
                <NextLink href="/dashboard">{t("dashboard")}</NextLink>
              </Button>
            )}
            <form action={logout}>
              <Button variant="danger" className="rounded-full">
                {t("logout")}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
