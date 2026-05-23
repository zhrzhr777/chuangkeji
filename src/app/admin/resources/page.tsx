import type { Metadata } from "next";
import { AdminResourcesPage } from "./client";

export const metadata: Metadata = { title: "资源管理" };

export default function ResourcesPage() {
  return <AdminResourcesPage />;
}
