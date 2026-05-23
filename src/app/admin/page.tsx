import type { Metadata } from "next";
import { Wrench, FolderOpen, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "仪表盘" };

export default async function AdminDashboard() {
  const supabase = createClient();

  const [toolsRes, resourcesRes, usersRes, topicsRes] = await Promise.all([
    supabase.from("tools").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("topics").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { title: "工具总数", value: toolsRes.count || 0, icon: Wrench, color: "text-blue-600 bg-blue-50" },
    { title: "资源总数", value: resourcesRes.count || 0, icon: FolderOpen, color: "text-green-600 bg-green-50" },
    { title: "注册用户", value: usersRes.count || 0, icon: Users, color: "text-purple-600 bg-purple-50" },
    { title: "话题总数", value: topicsRes.count || 0, icon: MessageSquare, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          仪表盘
        </h1>
        <p className="text-muted-foreground mt-1">网站数据概览</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">快捷操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>· 在 <strong>工具管理</strong> 中可审核、推荐、删除工具</p>
            <p>· 在 <strong>资源管理</strong> 中可审核、删除资源</p>
            <p>· 在 <strong>用户管理</strong> 中可修改角色、发放积分</p>
            <p>· 在 <strong>广告管理</strong> 中可配置广告位</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">变现概览</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>· <strong>广告系统</strong>：侧边栏、内容区横幅广告</p>
            <p>· <strong>工具推广</strong>：付费置顶工具，首页优先展示</p>
            <p>· <strong>VIP 会员</strong>：免积分下载、专属身份标识</p>
            <p>· <strong>积分体系</strong>：上传赚积分、下载花积分</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
