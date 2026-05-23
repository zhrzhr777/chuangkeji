"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Star, Trophy, Zap, Heart, MousePointerClick } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const RANK_COLORS = ["text-amber-500", "text-slate-400", "text-orange-600"];

export function LeaderboardTabs({ weeklyTools }: { weeklyTools: any[] }) {
  const [tab, setTab] = useState("week");
  const [tools, setTools] = useState(weeklyTools);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (tab === "week") { setTools(weeklyTools); return; }
    setLoading(true);
    loadTools(tab).then((data) => { setTools(data); setLoading(false); });
  }, [tab]);

  async function loadTools(t: string) {
    let query = supabase.from("tools").select("*, profiles(username)").eq("is_active", true).order("score", { ascending: false }).limit(10);
    const now = new Date();
    if (t === "month") query = query.gte("created_at", new Date(now.getTime() - 30 * 86400000).toISOString());
    if (t === "new") query = query.gte("created_at", new Date(now.getTime() - 7 * 86400000).toISOString()).order("created_at", { ascending: false });
    const { data } = await query;
    return data || [];
  }

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="week" className="gap-1"><TrendingUp className="h-3.5 w-3.5" />周榜</TabsTrigger>
        <TabsTrigger value="month" className="gap-1"><Star className="h-3.5 w-3.5" />月榜</TabsTrigger>
        <TabsTrigger value="all" className="gap-1"><Trophy className="h-3.5 w-3.5" />总榜</TabsTrigger>
        <TabsTrigger value="new" className="gap-1"><Zap className="h-3.5 w-3.5" />新锐</TabsTrigger>
      </TabsList>
      <TabsContent value={tab}>
        {tools.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">暂无数据</p>
        ) : (
          <div className="space-y-1.5">
            {tools.slice(0, 10).map((tool, i) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <Card className="hover:shadow-sm transition-shadow hover:border-primary/30">
                  <CardContent className="flex items-center gap-3 py-3">
                    <div className={`text-lg font-bold w-6 text-center shrink-0 ${i < 3 ? RANK_COLORS[i] : "text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {tool.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tool.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{tool.likes_count}</span>
                      <Badge variant="secondary" className="text-xs font-mono">{tool.score}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
