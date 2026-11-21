"use client";

import { useState, type ReactNode } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { TableCard } from "@/components/dashboard/shared/table-card";
import { useDashboardStore } from "@/components/dashboard/shared/dashboard-store";
import { updateUserRoleAction } from "@/lib/Action/update-role.action";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS, getInitials } from "@/lib/nav";
import type { PlatformUser, UserRole } from "@/types/type";

const ROLE_OPTIONS: UserRole[] = ["customer", "technician", "admin"];

/** The backend refuses every role change for this account. */
const PROTECTED_ADMIN_EMAIL = "admin@fixmate.com";

function isProtectedAdmin(email: string) {
  return email.trim().toLowerCase() === PROTECTED_ADMIN_EMAIL;
}

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
  onValueChange: (role: UserRole) => void;
  /** The account is locked, so the control stays read-only. */
  pending?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

/**
 * Role control shared by the table and the mobile cards. Updates are sent
 * through the server action, so the select reflects saved state only.
 */
function UserRoleSelect({
  user,
  onValueChange,
  pending = false,
  disabled = false,
  fullWidth = false,
}: UserRoleSelectProps) {
  const isProtected = isProtectedAdmin(user.email);

  return (
    <div className={cn("flex items-center gap-2", fullWidth && "w-full")}>
      <Select
        value={user.role}
        onValueChange={(value) => {
          if (value && value !== user.role) {
            onValueChange(value as UserRole);
          }
        }}
        disabled={disabled || pending || isProtected}
      >
        <SelectTrigger
          size="sm"
          className={cn(fullWidth ? "w-full" : "w-36")}
          aria-label={
            isProtected
              ? `Role for ${user.name} (protected account)`
              : `Role for ${user.name}`
          }
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
      {pending ? <Spinner className="size-3.5" /> : null}
    </div>
  );
}

export function AdminUsers({ users: initialUsers, error }: AdminUsersProps) {
  const { viewer } = useDashboardStore();
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [serverUsers, setServerUsers] = useState(initialUsers);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Pick up fresh server data after `router.refresh()` retries a failed load.
  if (initialUsers !== serverUsers) {
    setServerUsers(initialUsers);
    setUsers(initialUsers);
  }

  async function handleRoleChange(user: PlatformUser, role: UserRole) {
    // One role update at a time; ignore extra changes while it runs.
    if (updatingUserId || role === user.role) {
      return;
    }

    setUpdatingUserId(user.id);

    try {
      const result = await updateUserRoleAction(user.email, role);

      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Couldn't update role",
          description: result.error,
        });
        return;
      }

      // The backend confirmed the change, so reflect it in both layouts.
      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id ? { ...item, role } : item,
        ),
      );

      toast.add({
        type: "success",
        title: "Role updated",
        description: `${user.name} is now ${ROLE_LABELS[role]}.`,
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Couldn't update role",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  }

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
                  const isProtected = isProtectedAdmin(user.email);

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
                              fullWidth
                              onValueChange={(role) =>
                                handleRoleChange(user, role)
                              }
                              disabled={updatingUserId !== null}
                              pending={updatingUserId === user.id}
                            />
                            {isProtected ? (
                              <p className="text-xs text-muted-foreground">
                                This account&apos;s role can&apos;t be changed.
                              </p>
                            ) : null}
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
                          <UserRoleSelect
                            user={user}
                            onValueChange={(role) =>
                              handleRoleChange(user, role)
                            }
                            disabled={updatingUserId !== null}
                            pending={updatingUserId === user.id}
                          />
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
