"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import {
  DEMO_USER,
  NAV_ITEMS,
  isActivePath,
} from "@/lib/nav";
import type { NavbarUser } from "@/types/type";

export function Navbar() {
  const pathname = usePathname();

  // Temporary demo session. Replace this state with the BetterAuth session
  // hook once authentication is wired up.
  const [user, setUser] = useState<NavbarUser | null>(DEMO_USER);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Brand />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-0.5 md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-300 dark:after:bg-blue-400",
                    active
                      ? "text-foreground after:scale-x-100"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {user ? (
            <div className="hidden md:block">
              <UserMenu user={user} onSignOut={() => setUser(null)} />
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 md:flex">
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/sign-in" />}
              >
                <LogIn className="size-4" aria-hidden="true" />
                Sign In
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/sign-up" />}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                Sign Up
              </Button>
            </div>
          )}

          <MobileNav user={user} onSignOut={() => setUser(null)} />
        </div>
      </div>
    </header>
  );
}
