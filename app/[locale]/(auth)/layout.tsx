import AnalyticScripts from "@/components/script/analytic-scripts"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnalyticScripts />
      <section>{children}</section>
    </>
  )
}
