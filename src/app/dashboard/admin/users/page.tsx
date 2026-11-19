import type { Metadata } from "next";
import { AdminUsers } from "@/components/dashboard/admin/admin-users";

export const metadata: Metadata = {
  title: "Manage Users",
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
