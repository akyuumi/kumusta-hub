import Link from "next/link";
import type { ElementType } from "react";
import { Heart, LogOut, PlusCircle, Search, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function AuthNav() {
  const user = await getCurrentUser();

  return (
    <nav className="hidden items-center gap-2 md:flex">
      <NavLink href="/search" label="Search" icon={Search} />
      <NavLink href="/store-request" label="Add store" icon={PlusCircle} />
      <NavLink href="/mypage/favorites" label="Favorites" icon={Heart} />
      {user ? (
        <>
          <NavLink href="/mypage" label="My page" icon={UserRound} />
          <form action="/auth/sign-out" method="post">
            <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-[#f4eee7] hover:text-ink">
              <LogOut size={17} />
              Logout
            </button>
          </form>
        </>
      ) : (
        <NavLink href="/login" label="Login" icon={UserRound} />
      )}
    </nav>
  );
}

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: ElementType }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-[#f4eee7] hover:text-ink">
      <Icon size={17} />
      {label}
    </Link>
  );
}
