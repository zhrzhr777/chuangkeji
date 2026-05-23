import Link from "next/link";
import { Download, Coins, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime, getFileSizeString } from "@/lib/utils";

export async function LatestResources() {
  const supabase = createClient();

  const { data: resources } = await supabase
    .from("resources")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false })
    .limit(8);

  if (!resources?.length) {
    return (
      <section className="container py-12">
        <div className="text-center text-muted-foreground py-12">
          <h2 className="text-2xl font-bold mb-4">最新资源</h2>
          <p>还没有资源分享，快来上传第一个吧！</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">最新资源</h2>
          <p className="text-muted-foreground mt-1">创作者们分享的优质资源</p>
        </div>
        <Link
          href="/resources"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          查看全部 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource: any) => (
          <Link key={resource.id} href={`/resources/${resource.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow group">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm group-hover:text-primary transition-colors truncate">
                      {resource.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatRelativeTime(resource.created_at)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {resource.description || "暂无描述"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {resource.download_count}
                    </span>
                    {resource.points_required > 0 && (
                      <span className="flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {resource.points_required}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getFileSizeString(resource.file_size)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
