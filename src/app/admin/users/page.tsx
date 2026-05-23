import type { Metadata } from "next";
import { AdminUsersPage } from "./client";

export const metadata: Metadata = { title: "用户管理" };

export default function UsersPage() {
  return <AdminUsersPage />;
}
