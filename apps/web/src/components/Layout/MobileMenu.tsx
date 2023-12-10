import * as React from "react"
import NextLink from "next/link"

import { Button, Icon, IconButton } from "@nisomnia/ui/next"
import { Drawer, DrawerContent, DrawerTrigger } from "@nisomnia/ui/next-client"

export const MobileMenu: React.FunctionComponent = () => {
  return (
    <div className="flex lg:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <IconButton variant="ghost" aria-label="Menu">
            <Icon.Menu />
          </IconButton>
        </DrawerTrigger>
        <DrawerContent position="left" className="w-full md:w-[250px]">
          <div className="flex flex-col items-start">
            <Button asChild variant="ghost">
              <NextLink aria-label="Home" href="/">
                Home
              </NextLink>
            </Button>
            <Button asChild variant="ghost">
              <NextLink aria-label="Article" href="/article">
                Article
              </NextLink>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
