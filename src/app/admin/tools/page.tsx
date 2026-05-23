import type { Metadata } from "next";
import { AdminToolsPage } from "./client";

export const metadata: Metadata = { title: "工具管理" };

export default function ToolsPage() {
  return <AdminToolsPage />;
}
