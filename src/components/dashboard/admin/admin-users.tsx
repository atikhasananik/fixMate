"use client";

import type { ReactNode } from "react";
import { TriangleAlert, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS, getInitials } from "@/lib/nav";
import type { PlatformUser, UserRole } from "@/types/type";

const ROLE_OPTIONS: UserRole[] = ["customer", "technician", "admin"];

type AdminUsersProps = {
  users: PlatformUser[];
  error?: string | null;
};

type UserIdentityProps = {
  user: PlatformUser;
  isSelf: boolean;
  /** `default` is used on the roomier mobile cards. */
  avatarSize?: "sm" | "default";
  /** Optional second line, e.g. the email on a card. */
  secondary?: ReactNode;
};

/** Avatar + name + "You" badge, shared by the table and the mobile cards. */
function UserIdentity({
  user,
  isSelf,
  avatarSize = "sm",
  secondary,
}: UserIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size={avatarSize}>
        {user.image ? <AvatarImage src={user.image} alt="" /> : null}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-medium text-foreground">
            {user.name}
          </span>
          {isSelf ? (
            <Badge
              variant="outline"
              className="h-5 shrink-0 border-border text-xs text-muted-foreground"
            >
              You
            </Badge>
          ) : null}
        </div>
        {secondary ? (
          <div className="truncate text-sm text-muted-foreground">
            {secondary}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type UserRoleSelectProps = {
  user: PlatformUser;
  className?: string;
};

/**
 * Read-only role control: the API has no role-update endpoint yet, so this is
 * intentionally disabled on both layouts.
 */
function UserRoleSelect({ user, className }: UserRoleSelectProps) {
  return (
    <Select value={user.role} disabled>
      <SelectTrigger
        size="sm"
        className={cn("w-36", className)}
        aria-label={`Role for ${user.name}`}
      >
        <SelectValue>{ROLE_LABELS[user.role]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AdminUsers({ users, error }: AdminUsersProps) {
  const { viewer } = useDashboardStore();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Users"
        description="Review everyone registered on the platform."
      />

      <TableCard
        title="All users"
        description="Roles are assigned by the platform."
      >
        {error ? (
          <EmptyState
            icon={TriangleAlert}
            title="Couldn't load users"
            description={error}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
              className="mt-2"
            >
              Try again
            </Button>
          </EmptyState>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Registered accounts will appear here."
          />
        ) : (
          <>
            {/* Mobile: stacked cards, one per user. */}
            <div className="md:hidden">
              <ul
                aria-label="All users"
                className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5"
              >
                {users.map((user) => {
                  const isSelf = user.id === viewer.id;

                  return (
                    <li key={user.id}>
                      <Card className="h-full">
                        <CardContent className="flex h-full flex-col gap-4">
                          <UserIdentity
                            user={user}
                            isSelf={isSelf}
                            avatarSize="default"
                            secondary={user.email}
                          />

                          <div className="mt-auto flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground">
                              Role
                            </span>
                            <UserRoleSelect
                              user={user}
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-sm">
                            <span className="text-muted-foreground">
                              Joined
                            </span>
                            <span className="font-medium text-foreground">
                              {formatDate(user.joinedAt)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tablet & desktop: the existing table. */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => {
                    const isSelf = user.id === viewer.id;

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <UserIdentity user={user} isSelf={isSelf} />
                        </TableCell>
                        <TableCell className="hidden max-w-56 truncate md:table-cell">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <UserRoleSelect user={user} />
                        </TableCell>
                        <TableCell className="hidden whitespace-nowrap sm:table-cell">
                          {formatDate(user.joinedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </TableCard>
    </div>
  );
}
