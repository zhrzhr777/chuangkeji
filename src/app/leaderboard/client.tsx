"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, TrendingUp, Star, Zap, ExternalLink, Heart, MousePointerClick } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

const RANK_COLORS = ["text-amber-500", "text-slate-400", "text-orange-600"];

export function LeaderboardPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [tab, setTab] = useState("week");
  const supabase = createClient();

  useEffect(() => { loadTools(); }, [tab]);

  async function loadTools() {
    let query = supabase.from("tools").select("*, profiles(username)").eq("is_active", true).order("score", { ascending: false }).limit(30);
    const now = new Date();

    if (tab === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      query = query.gte("created_at", weekAgo);
    } else if (tab === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
      query = query.gte("created_at", monthAgo);
    } else if (tab === "new") {
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      query = query.gte("created_at", weekAgo).order("created_at", { ascending: false });
    }

    const { data } = await query;
    setTools(data || []);
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="text-center mb-8">
        <Trophy className="h-10 w-10 mx-auto mb-3 text-amber-500" />
        <h1 className="text-3xl font-bold">排行榜</h1>
        <p className="text-muted-foreground mt-1">综合评分自动排名</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="week" className="gap-1"><TrendingUp className="h-4 w-4" />周榜</TabsTrigger>
            <TabsTrigger value="month" className="gap-1"><Star className="h-4 w-4" />月榜</TabsTrigger>
            <TabsTrigger value="all" className="gap-1"><Trophy className="h-4 w-4" />总榜</TabsTrigger>
            <TabsTrigger value="new" className="gap-1"><Zap className="h-4 w-4" />新锐</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={tab}>
          {tools.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">暂无数据</p>
          ) : (
            <div className="space-y-2">
              {tools.map((tool, i) => (
                <Link key={tool.id} href={`/tools/${tool.id}`}>
                  <Card className="hover:shadow-sm transition-shadow hover:border-primary/30">
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className={`text-2xl font-bold w-8 text-center shrink-0 ${i < 3 ? RANK_COLORS[i] : "text-muted-foreground"}`}>
                        {i + 1}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold shrink-0">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{tool.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{tool.likes_count}</span>
                        <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" />{tool.click_count}</span>
                        <Badge variant="secondary" className="font-mono">{tool.score}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
