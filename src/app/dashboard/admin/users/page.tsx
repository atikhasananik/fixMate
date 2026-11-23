import type { Metadata } from "next";
import { AdminUsers } from "@/components/dashboard/admin/admin-users";
import { getAllUsers } from "@/lib/Action/api/admin/get";
import type { PlatformUser } from "@/types/type";

export const metadata: Metadata = {
  title: "Manage Users",
};

export default async function AdminUsersPage() {
  let users: PlatformUser[] = [];
  let error: string | null = null;

  try {
    users = await getAllUsers();
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Couldn't load users. Please try again.";
  }

  return <AdminUsers users={users} error={error} />;
}
