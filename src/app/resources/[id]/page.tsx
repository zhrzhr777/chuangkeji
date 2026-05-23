import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Coins, Calendar, User as UserIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { formatDate, getFileSizeString } from "@/lib/utils";
import { DownloadButton } from "./download-button";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!resource) return { title: "资源未找到" };

  return {
    title: resource.title,
    description: resource.description || `下载${resource.title}`,
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("*, profiles(username, avatar_url)")
    .eq("id", params.id)
    .single();

  if (!resource) notFound();

  return (
    <div className="container py-8 max-w-3xl">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回资源中心
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <FileText className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">{resource.title}</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <UserIcon className="h-3.5 w-3.5" />
            {resource.profiles?.username || "匿名用户"}
            <span>·</span>
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(resource.created_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge variant="secondary">{resource.category}</Badge>
        <Badge variant="outline">{resource.file_type || "未知格式"}</Badge>
        <Badge variant="outline">{getFileSizeString(resource.file_size)}</Badge>
        {resource.points_required > 0 && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Coins className="h-3 w-3 mr-1" />
            {resource.points_required} 积分
          </Badge>
        )}
        {resource.points_required === 0 && (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            免费
          </Badge>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">资源描述</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {resource.description || "暂无描述"}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Download className="h-4 w-4" />
          已下载 {resource.download_count} 次
        </div>
        <DownloadButton
          resourceId={resource.id}
          filePath={resource.file_path}
          pointsRequired={resource.points_required}
        />
      </div>
    </div>
  );
}
