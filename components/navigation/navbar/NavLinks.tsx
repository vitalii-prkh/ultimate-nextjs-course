"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {LINKS} from "@/refs/links";
import {cn} from "@/lib/utils";
import {buildPath} from "@/lib/path/buildPath";
import {isActivePath} from "@/lib/path/isActivePath";
import {SheetClose} from "@/components/ui/sheet";

type NavLinksProps = {
  isMobile?: boolean;
};

export function NavLinks(props: NavLinksProps) {
  const pathname = usePathname();
  const profileId = undefined;

  return (
    <React.Fragment>
      {LINKS.map((link) => {
        const isAllowed =
          typeof link.isAllowed === "function"
            ? link.isAllowed({profileId})
            : true;

        if (!isAllowed) {
          return null;
        }

        const href = buildPath(link.route, {profileId});
        const isActive = isActivePath(pathname, href);
        const element = (
          <Link
            key={link.label}
            href={href}
            className={cn(
              "flex items-center justify-start gap-4 bg-transparent p-4",
              {
                "primary-gradient text-light-900 rounded-lg": isActive,
                "text-dark300_light900": !isActive,
              },
            )}
          >
            <Image
              src={link.image}
              alt={link.label}
              width={20}
              height={20}
              className={cn({"invert-colors": !isActive})}
            />
            <p
              className={cn({
                "base-bold": isActive,
                "base-medium": !isActive,
                "max-lg:hidden": !props.isMobile,
              })}
            >
              {link.label}
            </p>
          </Link>
        );

        return props.isMobile ? (
          <SheetClose
            asChild
            key={link.label}
          >
            {element}
          </SheetClose>
        ) : (
          element
        );
      })}
    </React.Fragment>
  );
}
