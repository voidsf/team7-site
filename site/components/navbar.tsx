"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useActionState, useState } from "react";

import { siteConfig } from "@/config/site";
import { deleteSession } from "@/app/lib/session";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

export function Navbar({ sessionStatus }: { sessionStatus: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteSession, undefined);

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {sessionStatus}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          className="lg:hidden"
        />

        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <span className="font-bold">EcoSort</span>
        </NavbarBrand>

        {/* wide navbar for large screens */}
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {sessionStatus
            ? (<>{siteConfig.navItemsLoggedIn.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium",
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
              <NavbarItem>
              <Form action={action}><Button type="submit">Log Out</Button></Form></NavbarItem></>)
            : siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium",
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
        </ul>
      </NavbarContent>

      {/* skinny navbar for snatched screens */}
      <NavbarMenu>
        {sessionStatus
          ? (<>{siteConfig.navItemsLoggedIn.map((item, index) => (
              <NavbarMenuItem key={`${item}${index}`}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
            <NavbarMenuItem >
              <Form action={action}><Button type="submit">Log Out</Button></Form>
            </NavbarMenuItem>
            
            </>)
          : siteConfig.navItems.map((item, index) => (
              <NavbarMenuItem key={`${item}${index}`}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
}
