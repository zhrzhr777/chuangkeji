"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Coins,
  CalendarCheck,
  Upload,
  Download,
  LogOut,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Resource, Transaction } from "@/lib/types";

export function UserContent() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/user");
      return;
    }

    if (!user) return;

    async function loadData() {
      const [resResult, txResult, checkinResult] = await Promise.all([
        supabase
          .from("resources")
          .select("*")
          .eq("creator_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("checkins")
          .select("*")
          .eq("user_id", user!.id)
          .eq("checkin_date", new Date().toISOString().split("T")[0])
          .maybeSingle(),
      ]);

      setResources(resResult.data || []);
      setTransactions(txResult.data || []);
      setCheckedIn(!!checkinResult.data);
      setLoading(false);
    }

    loadData();
  }, [user, authLoading]);

  const handleCheckin = async () => {
    if (!user) return;
    setCheckingIn(true);

    try {
      const { error } = await supabase.from("checkins").insert({
        user_id: user.id,
        checkin_date: new Date().toISOString().split("T")[0],
        points_earned: 10,
      });

      if (error) throw error;

      // 写入积分流水
      await supabase.from("transactions").insert({
        user_id: user.id, amount: 10, type: "daily_checkin",
        description: "每日签到奖励",
      });

      // 更新用户积分
      await supabase.rpc("add_user_points", { uid: user.id, pts: 10 });

      setCheckedIn(true);
      toast({ title: "签到成功", description: "获得 10 积分！" });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "签到失败",
        description: error.message || "请重试",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">请先登录</p>
        <Button onClick={() => router.push("/login")}>去登录</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{profile.username}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                加入于 {formatDate(profile.created_at)}
              </p>

              <div className="flex items-center justify-center gap-2 mt-4 p-4 bg-primary/5 rounded-lg w-full">
                <Coins className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">{profile.points}</span>
                <span className="text-sm text-muted-foreground">积分</span>
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleCheckin}
                disabled={checkedIn || checkingIn}
                variant={checkedIn ? "outline" : "default"}
              >
                {checkingIn ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CalendarCheck className="h-4 w-4 mr-2" />
                )}
                {checkedIn ? "今日已签到" : "每日签到 (+10)"}
              </Button>

              <Button
                variant="ghost"
                className="w-full mt-2 text-muted-foreground"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 text-center">
              <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">{resources.length}</p>
              <p className="text-xs text-muted-foreground">上传资源</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Download className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">
                {resources.reduce((sum, r) => sum + r.download_count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">总下载</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="resources">
          <TabsList>
            <TabsTrigger value="resources">我的上传</TabsTrigger>
            <TabsTrigger value="transactions">积分明细</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-4">
            {resources.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="mb-3">还没有上传任何资源</p>
                <Button size="sm" onClick={() => router.push("/resources/upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  上传第一个资源
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {resources.map((res) => (
                  <Link key={res.id} href={`/resources/${res.id}`}>
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardContent className="flex items-center gap-4 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{res.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(res.created_at)} · {res.download_count} 次下载
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {res.points_required > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Coins className="h-3 w-3 mr-1" />
                              {res.points_required}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {res.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>暂无积分记录</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          tx.amount > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.created_at)} · {tx.type}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium text-sm ${
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
