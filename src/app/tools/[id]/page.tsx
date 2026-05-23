import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Heart, Calendar, Tag, User as UserIcon, MessageSquare, ArrowLeft, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ToolLikeButton } from "./like-button";
import { VisitButton } from "./visit-button";
import { ReportButton } from "@/components/tools/ReportButton";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: tool } = await supabase
    .from("tools")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!tool) return { title: "工具未找到" };

  return {
    title: tool.name,
    description: tool.description || `查看${tool.name}的详细信息`,
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: tool } = await supabase
    .from("tools")
    .select("*, profiles(username, avatar_url)")
    .eq("id", params.id)
    .single();

  if (!tool) notFound();

  // Related resources
  const { data: relatedResources } = await supabase
    .from("resources")
    .select("*")
    .order("download_count", { ascending: false })
    .limit(4);

  // Related topics
  const { data: relatedTopics } = await supabase
    .from("topics")
    .select("*, profiles(username)")
    .eq("tool_id", tool.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const PRICING_COLOR: Record<string, string> = {
    "免费": "bg-green-100 text-green-700 border-green-200",
    "付费": "bg-orange-100 text-orange-700 border-orange-200",
    "免费增值": "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="container py-8">
      <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        返回工具导航
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tool header */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-2xl shrink-0">
                {tool.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{tool.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <UserIcon className="h-3.5 w-3.5" />
                      {tool.profiles?.username || "匿名用户"}
                      <span className="mx-1">·</span>
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(tool.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PRICING_COLOR[tool.pricing] || ""}`}>
                {tool.pricing}
              </span>
              <Badge variant="secondary">{tool.category}</Badge>
              {tool.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-6 whitespace-pre-wrap">
              {tool.description || "暂无描述"}
            </p>

            <div className="flex items-center gap-3">
              <ToolLikeButton toolId={tool.id} initialLikes={tool.likes_count} />
              <VisitButton toolId={tool.id} url={tool.url} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MousePointerClick className="h-3.5 w-3.5" />
                {tool.click_count || 0} 次访问
              </span>
              <div className="ml-auto">
                <ReportButton toolId={tool.id} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Discussion topics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                讨论
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href={`/community?toolId=${tool.id}`}>
                  查看全部
                </Link>
              </Button>
            </div>

            {relatedTopics && relatedTopics.length > 0 ? (
              <div className="space-y-3">
                {relatedTopics.map((topic: any) => (
                  <Link key={topic.id} href={`/community/${topic.id}`}>
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{topic.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {topic.profiles?.username} · {topic.reply_count} 回复 ·{" "}
                          {formatDate(topic.created_at)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center border rounded-lg">
                暂无讨论，快来发起第一个话题吧！
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tool info card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">工具信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">分类</span>
                <span>{tool.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">价格</span>
                <span>{tool.pricing}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">点赞</span>
                <span>{tool.likes_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">访问</span>
                <span>{tool.click_count || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">评分</span>
                <span className="font-mono font-bold">{tool.score || 0}</span>
              </div>
              <Separator />
              <VisitButton toolId={tool.id} url={tool.url} />
            </CardContent>
          </Card>

          {/* Related resources */}
          {relatedResources && relatedResources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">相关资源</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedResources.map((res: any) => (
                  <Link key={res.id} href={`/resources/${res.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors -mx-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-600 shrink-0">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{res.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {res.download_count} 次下载
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
