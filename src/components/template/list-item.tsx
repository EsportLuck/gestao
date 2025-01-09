import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { NavigationMenuLink } from "@/components/ui";
import Link from "next/link";

interface IListItem {
  className?: string;
  title: string;
  children: string;
  href: string;
}

export const ListItem: FC<IListItem> = ({
  className,
  title,
  children,
  href,
}) => {
  return (
    <li
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
    >
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground break-words">
            {children}
          </p>
        </NavigationMenuLink>
      </Link>
    </li>
  );
};
