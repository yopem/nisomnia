import AnalyticScripts from "@/components/script/analytic-scripts"

export default function AMPLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticScripts />
      <>{children}</>
    </>
  )
}
