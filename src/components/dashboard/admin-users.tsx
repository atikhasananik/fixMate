"use client";

import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/components/ui/toast";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableCard } from "@/components/dashboard/table-card";
import { useDashboardStore } from "@/components/dashboard/dashboard-store";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS, getInitials } from "@/lib/nav";
import type { PlatformUser, UserRole } from "@/types/type";

const ROLE_OPTIONS: UserRole[] = ["customer", "technician", "admin"];

export function AdminUsers() {
  const { viewer, users, setUserRole } = useDashboardStore();

  function handleRoleChange(user: PlatformUser, role: UserRole) {
    if (user.id === viewer.id) {
      return;
    }

    setUserRole(user.id, role);
    toast.add({
      type: "success",
      title: "Role updated",
      description: `${user.name} is now a ${ROLE_LABELS[role].toLowerCase()}.`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Users"
        description="Review everyone on the platform and adjust roles when needed."
      />

      <TableCard
        title="All users"
        description="You cannot change your own role from this table."
      >
        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Registered accounts will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const isSelf = user.id === viewer.id;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="sm">
                          {user.image ? (
                            <AvatarImage src={user.image} alt="" />
                          ) : null}
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium text-foreground">
                          {user.name}
                        </span>
                        {isSelf ? (
                          <Badge
                            variant="outline"
                            className="h-5 border-border text-xs text-muted-foreground"
                          >
                            You
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-56 truncate md:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => {
                          if (value) {
                            handleRoleChange(user, value as UserRole);
                          }
                        }}
                        disabled={isSelf}
                      >
                        <SelectTrigger
                          size="sm"
                          className="w-36"
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
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      {formatDate(user.joinedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}
