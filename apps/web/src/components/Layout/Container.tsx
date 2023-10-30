import * as React from "react"

import { cn } from "@nisomnia/ui/next"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container: React.FunctionComponent<ContainerProps> = (props) => {
  const { className, children, ...rest } = props

  return (
    <div className={cn("container mx-auto w-full py-4", className)} {...rest}>
      {children}
    </div>
  )
}
