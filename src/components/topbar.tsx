import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import TopBarMenu from "./topBarMenu";

export default async function TopBar() {
  const { userId } = await auth();

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur flex justify-between items-center h-60px transition-colors border-b border-slate px-10 py-4 supports-backdrop-blur:bg-white/95">
      <h1 className="text-2xl font-bold">Chat.io</h1>
      <div className="flex items-center">
        {!userId ? (
          <div>
            <Link
              href="/sign-up"
              className="hover:text-sky-500 font-bold text-blue-500"
            >
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              className="ml-4 dark:hover:text-sky-400 font-bold text-blue-500"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-full justify-center gap-10 xl:flex md:flex hidden">
              <Link
                href="/chat"
                className="font-bold text-blue-500 hover:text-sky-500"
              >
                Chats
              </Link>
              <Link
                href="/subscription"
                className="font-bold text-blue-500 hover:text-sky-500"
              >
                Manage Subscription
              </Link>
              <Link
                href="/dashboard"
                className="font-bold text-blue-500 hover:text-sky-500"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/"/>
            </div>
            <div className="xl:hidden md:hidden sm:block">
              <TopBarMenu />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
