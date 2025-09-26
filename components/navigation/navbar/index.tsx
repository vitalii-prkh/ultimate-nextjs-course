import Link from "next/link";
import Image from "next/image";
import {auth} from "@/auth";
import {UserAvatar} from "@/components/UserAvatar";
import {ThemeToggle} from "./ThemeToggle";
import {MobileNav} from "./MobileNav";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none">
      <Link
        href="/"
        className="flex items-center gap-1"
      >
        <Image
          src="/images/site-logo.svg"
          alt="DevFlow Logo"
          width={23}
          height={23}
        />
        <p className="h2-bold font-space-grotesk text-light-100 dark:text-dark-900 max-sm:hidden">
          Dev <span className="text-primary-500">Flow</span>
        </p>
      </Link>
      <p>Global Search</p>
      <div className="flex-between gap-5">
        <ThemeToggle />
        {session?.user?.id && (
          <UserAvatar
            profileId={session.user.id}
            name={session.user.name!}
            image={session.user.image!}
          />
        )}
        <MobileNav />
      </div>
    </nav>
  );
}
