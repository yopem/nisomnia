import * as React from "react"

interface DashboardBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  count?: number | string
  text?: string
}

export const DashboardBox: React.FunctionComponent<DashboardBoxProps> = (
  props,
) => {
  const { icon, count, text } = props

  return (
    <div className="rounded-md p-5 shadow-md">
      <div className="flex">{icon}</div>
      <div className="mt-6 text-3xl font-medium leading-8">{count}</div>
      <div className="mt-1 text-base text-foreground/80">{text}</div>
    </div>
  )
}
