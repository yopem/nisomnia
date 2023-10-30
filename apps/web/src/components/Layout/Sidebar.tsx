import * as React from "react"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const { children, ...rest } = props

  return (
    <aside
      className="scrollbar flex h-screen flex-col flex-wrap overflow-y-auto rounded border-r border-border bg-background px-3 pb-12 pt-4 text-foreground transition-[width] duration-300"
      aria-label="Sidebar"
      {...rest}
    >
      <div>
        <ul className="space-y-2">{children}</ul>
      </div>
    </aside>
  )
}
