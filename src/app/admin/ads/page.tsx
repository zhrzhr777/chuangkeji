import type { Metadata } from "next";
import { AdminAdsPage } from "./client";

export const metadata: Metadata = { title: "广告管理" };

export default function AdsPage() {
  return <AdminAdsPage />;
}
