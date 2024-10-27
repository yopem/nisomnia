import {
  DashboardBox,
  DashboardBoxCount,
  DashboardBoxDescription,
  DashboardBoxIconWrapper,
} from "@/components/dashboard/dashboard-box"
import { Icon } from "@/components/ui/icon"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"

export default async function DashboardPage() {
  const t = await getI18n()

  const ads = await api.ad.count()
  const articles = await api.article.countDashboard()
  const feeds = await api.feed.countDashboard()
  const genres = await api.genre.countDashboard()
  const medias = await api.media.count()
  const movies = await api.movie.countDashboard()
  const productionCompanies = await api.productionCompany.count()
  const topics = await api.topic.countDashboard()
  const users = await api.user.count()

  return (
    <>
      <h2 className="text-3xl">Statistics</h2>
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Article />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{articles}</DashboardBoxCount>
          <DashboardBoxDescription>{t("articles")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Topic />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{topics}</DashboardBoxCount>
          <DashboardBoxDescription>{t("topics")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Feed />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{feeds}</DashboardBoxCount>
          <DashboardBoxDescription>{t("feeds")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Media />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{medias}</DashboardBoxCount>
          <DashboardBoxDescription>{t("medias")}</DashboardBoxDescription>
        </DashboardBox>
      </div>
      <hr />
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Movie />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{movies}</DashboardBoxCount>
          <DashboardBoxDescription>{t("movies")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Genre />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{genres}</DashboardBoxCount>
          <DashboardBoxDescription>{t("genres")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.ProductionCompany />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{productionCompanies}</DashboardBoxCount>
          <DashboardBoxDescription>
            {t("production_companies")}
          </DashboardBoxDescription>
        </DashboardBox>
      </div>
      <hr />
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.Ads />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{ads}</DashboardBoxCount>
          <DashboardBoxDescription>{t("ads")}</DashboardBoxDescription>
        </DashboardBox>
        <DashboardBox>
          <DashboardBoxIconWrapper>
            <Icon.User />
          </DashboardBoxIconWrapper>
          <DashboardBoxCount>{users}</DashboardBoxCount>
          <DashboardBoxDescription>{t("users")}</DashboardBoxDescription>
        </DashboardBox>
      </div>
    </>
  )
}
