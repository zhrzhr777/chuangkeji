import Link from "next/link";
import { Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardTabs } from "./LeaderboardTabs";

export async function Leaderboard() {
  const supabase = createClient();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  const { data: weeklyTools } = await supabase
    .from("tools")
    .select("*, profiles(username)")
    .eq("is_active", true)
    .gte("created_at", weekAgo)
    .order("score", { ascending: false })
    .limit(10);

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="text-2xl font-bold">排行榜</h2>
        </div>
        <Link href="/leaderboard" className="text-sm text-primary hover:underline flex items-center gap-1">
          完整榜单 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <LeaderboardTabs weeklyTools={weeklyTools || []} />
    </section>
  );
}
