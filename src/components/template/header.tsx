"use client";
import { DetailedHTMLProps, HTMLAttributes, FC } from "react";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavMenu } from "./nav-menu";
import { Profile } from "./profile";

interface IHeader
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export const Header: FC<IHeader> = ({ ...props }) => {
  const { status, data } = useSession();
  const pathname = usePathname();
  const handleSignOut = () => signOut();
  const authenticated = () => {
    if (status === "authenticated" && pathname !== "/") return true;
    return false;
  };
  const menu = () => {
    if (authenticated()) return <NavMenu />;
  };

  return (
    <header className="flex h-16 items-center justify-between" {...props}>
      <div className="flex items-center justify-between gap-8">
        <Link href={"/"}>
          <Image
            className="invert dark:invert-0"
            src="/vector_pure.svg"
            alt="logo"
            width={50}
            height={50}
            priority
          />
        </Link>
        {menu()}
      </div>
      {authenticated() && (
        <Profile
          username={data?.user.username as string}
          role={data?.user.role as string}
          onClick={handleSignOut}
        />
      )}
    </header>
  );
};
