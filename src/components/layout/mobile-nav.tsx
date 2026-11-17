"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  UserRound,
} from "lucide-react";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brand } from "@/components/layout/brand";
import {
  DASHBOARD_PATHS,
  NAV_ITEMS,
  ROLE_BADGE_CLASSES,
  ROLE_LABELS,
  getInitials,
  isActivePath,
  type NavbarUser,
} from "@/lib/nav";

type MobileNavProps = {
  user: NavbarUser | null;
  onSignOut: () => void;
};

export function MobileNav({ user, onSignOut }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  function handleSignOut() {
    onSignOut();
    close();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="data-[side=right]:w-[min(20rem,90vw)] gap-0 overflow-y-auto p-0"
      >
        <SheetHeader className="border-b border-border/70 p-4">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <Brand onClick={close} />
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "bg-blue-50 text-blue-700 before:absolute before:top-1/2 before:left-0 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-blue-600 dark:bg-blue-950/50 dark:text-blue-300 dark:before:bg-blue-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{item.label}</span>
                <ChevronRight
                  className="size-4 opacity-50"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border/70 p-4">
          {user ? (
            <>
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-3">
                <Avatar>
                  {user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt={`${user.name}'s avatar`}
                    />
                  ) : null}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1.5 ${ROLE_BADGE_CLASSES[user.role]}`}
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  href={DASHBOARD_PATHS[user.role]}
                  onClick={close}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LayoutDashboard className="size-4" aria-hidden="true" />
                  Dashboard
                  <ChevronRight
                    className="ml-auto size-4 opacity-50"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/profile"
                  onClick={close}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <UserRound className="size-4" aria-hidden="true" />
                  Update Profile
                  <ChevronRight
                    className="ml-auto size-4 opacity-50"
                    aria-hidden="true"
                  />
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-in" onClick={close} />}
              >
                <LogIn className="size-4" aria-hidden="true" />
                Sign In
              </Button>
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-up" onClick={close} />}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
