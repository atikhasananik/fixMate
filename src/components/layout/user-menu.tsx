"use client";

import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DASHBOARD_PATHS,
  ROLE_BADGE_CLASSES,
  ROLE_LABELS,
  getInitials,
} from "@/lib/nav";
import type { UserMenuProps } from "@/types/type";

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-9 gap-2 rounded-full border border-transparent py-1 pl-1 pr-2 hover:border-border hover:bg-muted/60"
          />
        }
      >
        <Avatar size="sm">
          {user.image ? (
            <AvatarImage src={user.image} alt={`${user.name}'s avatar`} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-sm font-medium lg:inline">
          {user.name}
        </span>
        <ChevronDown
          className="hidden size-4 text-muted-foreground sm:block"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar size="lg">
            {user.image ? (
              <AvatarImage src={user.image} alt={`${user.name}'s avatar`} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
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

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href={DASHBOARD_PATHS[user.role]} />}>
          <LayoutDashboard aria-hidden="true" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
          <UserRound aria-hidden="true" />
          <span>Update Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOut aria-hidden="true" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
