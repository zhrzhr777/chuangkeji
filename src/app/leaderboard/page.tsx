import type { Metadata } from "next";
import { LeaderboardPage } from "./client";

export const metadata: Metadata = { title: "排行榜", description: "创客集工具排行榜 — 周榜、月榜、总榜、新锐榜" };

export default function Page() {
  return <LeaderboardPage />;
}
