import * as React from "react"

import { cx } from "../utils"

interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const { className, placeholder, children, ...rest } = props
    return (
      <select
        ref={ref}
        className={cx(
          "form-select invalid:border-1 w-full min-w-0 max-w-xl appearance-none rounded-md border-input bg-background p-2 text-foreground transition-colors duration-75 ease-out invalid:border-danger invalid:ring-danger hover:bg-background/80 focus:border-input focus:ring-2 focus:ring-input",
          className,
        )}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    )
  },
)
