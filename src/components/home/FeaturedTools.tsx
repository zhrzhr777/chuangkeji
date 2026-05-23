import Link from "next/link";
import { Star, Heart, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export async function FeaturedTools() {
  const supabase = createClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("*, profiles(username)")
    .eq("featured", true)
    .eq("status", "approved")
    .order("likes_count", { ascending: false })
    .limit(4);

  if (!tools?.length) return null;

  return (
    <section className="container py-12 border-t">
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 text-amber-500 fill-current" />
        <h2 className="text-xl font-bold">推荐工具</h2>
        <Badge variant="outline" className="ml-2">推广</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool: any) => (
          <Link key={tool.id} href={`/tools/${tool.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow border-amber-200/50 hover:border-amber-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold text-lg">
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{tool.profiles?.username}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />{tool.likes_count}
                  </span>
                  <div className="flex gap-1">
                    {tool.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
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
