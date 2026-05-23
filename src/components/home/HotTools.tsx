import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

const PRICING_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  "免费": "default",
  "付费": "secondary",
  "免费增值": "outline",
};

export async function HotTools() {
  const supabase = createClient();

  const { data: tools } = await supabase
    .from("tools")
    .select("*, profiles(username)")
    .order("likes_count", { ascending: false })
    .limit(6);

  if (!tools?.length) {
    return (
      <section className="container py-12">
        <div className="text-center text-muted-foreground py-12">
          <h2 className="text-2xl font-bold mb-4">热门工具</h2>
          <p>还没有工具，快来添加第一个吧！</p>
          <Link href="/tools" className="text-primary hover:underline mt-2 inline-block">
            浏览全部工具 →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">热门工具</h2>
          <p className="text-muted-foreground mt-1">大家最喜爱的工具推荐</p>
        </div>
        <Link
          href="/tools"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          查看全部 <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool: any) => (
          <Link key={tool.id} href={`/tools/${tool.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tool.profiles?.username || "匿名用户"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={PRICING_COLORS[tool.pricing] || "outline"}>
                    {tool.pricing}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {tool.description || "暂无描述"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    {tool.likes_count}
                  </div>
                  <div className="flex gap-1">
                    {tool.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
